#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function usage(message) {
  if (message) console.error(message);
  console.error('Usage: node run-cycle.mjs --package <dir> --student-id <id> [--fr <FR>] [--env-var <key=value>]... [--timeout-request <ms>] [--timeout-script <ms>] [--newman-bin <path>] [--setup-script <path>] [--teardown-script <path>] [--teardown-on-failure]');
  process.exit(message ? 2 : 0);
}

const args = process.argv.slice(2);
const options = {};
for (let index = 0; index < args.length; index += 1) {
  const argument = args[index];
  if (argument === '--help') usage();
  if (argument === '--teardown-on-failure') {
    options.teardownOnFailure = true;
    continue;
  }
  if (argument === '--env-var') {
    const value = args[index + 1];
    if (!value) usage('Missing value after --env-var.');
    options.envVars ??= [];
    options.envVars.push(value);
    index += 1;
    continue;
  }
  if (!argument.startsWith('--') || args[index + 1] === undefined) usage(`Invalid argument: ${argument}`);
  options[argument.slice(2)] = args[index + 1];
  index += 1;
}

if (!options.package) usage('Missing --package.');
if (!options['student-id']?.trim()) usage('Missing or blank --student-id.');
for (const value of options.envVars ?? []) {
  const separator = value.indexOf('=');
  if (separator < 1) usage(`Invalid --env-var: ${value}`);
  if (value.slice(0, separator) === 'studentId') usage('Use --student-id instead of --env-var studentId=...');
}
for (const name of ['timeout-request', 'timeout-script']) {
  if (options[name] !== undefined && !/^[1-9]\d*$/.test(options[name])) {
    usage(`--${name} must be a positive integer.`);
  }
}

const packageDir = path.resolve(options.package);
const reportsDir = path.join(packageDir, 'reports');
const files = {
  collection: path.join(packageDir, 'collection.postman_collection.json'),
  environment: path.join(packageDir, 'environment.postman_environment.json'),
  data: path.join(packageDir, 'test-data.csv'),
  run: path.join(packageDir, 'RUN.md'),
  json: path.join(reportsDir, 'newman-report.json'),
  html: path.join(reportsDir, 'newman-report.html'),
  report: path.join(reportsDir, 'test-execution.md'),
  summary: path.join(reportsDir, 'run-cycle.json'),
};

const summary = {
  fr: options.fr ?? path.basename(packageDir),
  startedAt: new Date().toISOString(),
  package: packageDir,
  phases: {
    preflight: { status: 'PENDING' },
    setup: { status: options['setup-script'] ? 'PENDING' : 'NOT REQUESTED' },
    newman: { status: 'NOT RUN', exitCode: null },
    inspection: { status: 'NOT RUN', exitCode: null },
    teardown: { status: options['teardown-script'] ? 'PENDING' : 'NOT REQUESTED' },
  },
  cleanupRequired: null,
};

function writeSummary() {
  fs.mkdirSync(reportsDir, { recursive: true });
  summary.finishedAt = new Date().toISOString();
  fs.writeFileSync(files.summary, `${JSON.stringify(summary, null, 2)}\n`);
}

function failPreflight(message) {
  summary.phases.preflight = { status: 'BLOCKED', message };
  writeSummary();
  console.error(message);
  process.exit(2);
}

if (!fs.existsSync(packageDir) || !fs.statSync(packageDir).isDirectory()) {
  console.error(`Package directory does not exist: ${packageDir}`);
  process.exit(2);
}

for (const [label, file] of Object.entries({
  collection: files.collection,
  environment: files.environment,
  'iteration data': files.data,
  RUN: files.run,
})) {
  if (!fs.existsSync(file)) failPreflight(`Missing ${label}: ${file}`);
}

try {
  JSON.parse(fs.readFileSync(files.collection, 'utf8'));
  JSON.parse(fs.readFileSync(files.environment, 'utf8'));
} catch (error) {
  failPreflight(`Invalid package JSON: ${error.message}`);
}

const csvHeader = fs.readFileSync(files.data, 'utf8').split(/\r?\n/, 1)[0] ?? '';
if (!csvHeader.split(',').map((field) => field.replace(/^"|"$/g, '').trim()).includes('tc_id')) {
  failPreflight('Iteration data has no tc_id column.');
}

summary.phases.preflight = { status: 'PASS' };
fs.mkdirSync(reportsDir, { recursive: true });

const newmanBin = options['newman-bin'] ?? 'newman';
const versionResult = spawnSync(newmanBin, ['--version'], { encoding: 'utf8' });
if (versionResult.status !== 0) {
  failPreflight(versionResult.error?.message ?? `Cannot run Newman at ${newmanBin}.`);
}
summary.newmanVersion = versionResult.stdout.trim();

function resolveHook(value) {
  return value ? path.resolve(value) : null;
}

function runHook(label, hookPath) {
  if (!fs.existsSync(hookPath)) {
    return { status: 'BLOCKED', exitCode: 2, message: `Missing hook: ${hookPath}` };
  }
  const result = spawnSync(hookPath, [], {
    cwd: packageDir,
    env: { ...process.env, POSTMAN_PACKAGE_DIR: packageDir, STUDENT_ID: options['student-id'] },
    stdio: 'inherit',
  });
  const exitCode = result.status ?? 2;
  return {
    status: exitCode === 0 ? 'PASS' : 'FAIL',
    exitCode,
    ...(result.error ? { message: `${label}: ${result.error.message}` } : {}),
  };
}

let primaryExit = 0;
const setupScript = resolveHook(options['setup-script']);
if (setupScript) {
  summary.phases.setup = runHook('setup', setupScript);
  if (summary.phases.setup.status !== 'PASS') primaryExit = summary.phases.setup.exitCode;
}

if (primaryExit === 0) {
  const newmanArgs = [
    'run', files.collection,
    '--environment', files.environment,
    '--iteration-data', files.data,
    '--env-var', `studentId=${options['student-id']}`,
    '--reporters', 'cli,json,html',
    '--reporter-json-export', files.json,
    '--reporter-html-export', files.html,
  ];
  for (const value of options.envVars ?? []) newmanArgs.push('--env-var', value);
  if (options['timeout-request']) newmanArgs.push('--timeout-request', options['timeout-request']);
  if (options['timeout-script']) newmanArgs.push('--timeout-script', options['timeout-script']);
  const displayArg = (value) => /^[A-Za-z0-9_./:=+-]+$/.test(value) ? value : JSON.stringify(value);
  const displayArgs = newmanArgs.map((value, index) => {
    if (newmanArgs[index - 1] !== '--env-var' || value.startsWith('studentId=')) return value;
    return `${value.slice(0, value.indexOf('='))}=[REDACTED]`;
  });
  summary.command = [newmanBin, ...displayArgs].map(displayArg).join(' ');
  console.log(summary.command);
  const result = spawnSync(newmanBin, newmanArgs, { cwd: packageDir, stdio: 'inherit' });
  const exitCode = result.status ?? 2;
  summary.phases.newman = {
    status: exitCode === 0 ? 'PASS' : result.error ? 'BLOCKED' : 'FAIL',
    exitCode,
    ...(result.error ? { message: result.error.message } : {}),
  };
  primaryExit = exitCode;

  if (fs.existsSync(files.json)) {
    const inspector = path.join(path.dirname(fileURLToPath(import.meta.url)), 'inspect-newman.mjs');
    const result = spawnSync(process.execPath, [
      inspector,
      '--input', files.json,
      '--data', files.data,
      '--output', files.report,
      '--fr', summary.fr,
      '--exit-code', String(exitCode),
    ], { cwd: packageDir, stdio: 'inherit' });
    const inspectionExit = result.status ?? 2;
    summary.phases.inspection = {
      status: inspectionExit === 0 ? 'PASS' : 'FAIL',
      exitCode: inspectionExit,
      ...(result.error ? { message: result.error.message } : {}),
    };
    if (primaryExit === 0 && inspectionExit !== 0) primaryExit = inspectionExit;
  } else {
    summary.phases.inspection = {
      status: 'BLOCKED',
      exitCode: 2,
      message: 'Newman JSON report was not produced.',
    };
    if (primaryExit === 0) primaryExit = 2;
  }
}

const teardownScript = resolveHook(options['teardown-script']);
if (teardownScript) {
  if (primaryExit === 0 || options.teardownOnFailure) {
    summary.phases.teardown = runHook('teardown', teardownScript);
    summary.cleanupRequired = summary.phases.teardown.status !== 'PASS';
    if (primaryExit === 0 && summary.phases.teardown.status !== 'PASS') {
      primaryExit = summary.phases.teardown.exitCode;
    }
  } else {
    summary.phases.teardown = {
      status: 'SKIPPED',
      message: 'Failure state preserved; use --teardown-on-failure to override.',
    };
    summary.cleanupRequired = true;
  }
}

summary.exitCode = primaryExit;
writeSummary();
process.exit(primaryExit);
