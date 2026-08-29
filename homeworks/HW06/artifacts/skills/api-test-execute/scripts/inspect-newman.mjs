#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function usage(message) {
  if (message) console.error(message);
  console.error('Usage: node inspect-newman.mjs --input <newman-report.json> [--data <test-data.csv>] [--output <report.md>] [--fr <FR>] [--exit-code <n>]');
  process.exit(2);
}

const args = process.argv.slice(2);
const options = {};
for (let index = 0; index < args.length; index += 2) {
  const key = args[index];
  const value = args[index + 1];
  if (!key?.startsWith('--') || value === undefined) usage(`Invalid argument: ${key ?? ''}`);
  options[key.slice(2)] = value;
}
if (!options.input) usage('Missing --input.');

let document;
try {
  document = JSON.parse(fs.readFileSync(options.input, 'utf8'));
} catch (error) {
  console.error(`Cannot read Newman JSON: ${error.message}`);
  process.exit(2);
}

const run = document.run ?? {};
const stats = run.stats ?? {};
const executions = Array.isArray(run.executions) ? run.executions : [];
const failures = Array.isArray(run.failures) ? run.failures : [];
const count = (name, field) => Number(stats[name]?.[field] ?? 0);
const escapeCell = (value) => String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');

function parseCsv(text) {
  const records = [];
  let record = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') {
      record.push(field);
      field = '';
    } else if (char === '\n') {
      record.push(field.replace(/\r$/, ''));
      if (record.some((value) => value !== '')) records.push(record);
      record = [];
      field = '';
    } else field += char;
  }
  if (quoted) throw new Error('Unclosed quoted CSV field.');
  record.push(field.replace(/\r$/, ''));
  if (record.some((value) => value !== '')) records.push(record);
  return records;
}

function traceFrom(label) {
  const match = /^\[([^\]]+)\](?:\[([^\]]+)\])?\s*(.*)$/.exec(label ?? '');
  return match
    ? { tcId: match[1], trace: match[2] || 'UNTRACED', assertion: match[3] || label }
    : { tcId: 'UNTRACED', trace: 'UNTRACED', assertion: label || '(unnamed assertion)' };
}

const rows = [];
for (const execution of executions) {
  const requestName = execution.item?.name ?? '(unnamed request)';
  for (const assertion of execution.assertions ?? []) {
    const label = assertion.assertion ?? assertion.name ?? '';
    const traced = traceFrom(label);
    rows.push({
      ...traced,
      requestName,
      status: assertion.error ? 'FAIL' : 'PASS',
      evidence: assertion.error?.message ?? '',
    });
  }
}

const grouped = new Map();
if (options.data) {
  let records;
  try {
    records = parseCsv(fs.readFileSync(options.data, 'utf8'));
  } catch (error) {
    console.error(`Cannot read iteration CSV: ${error.message}`);
    process.exit(2);
  }
  const header = records.shift() ?? [];
  const tcIndex = header.indexOf('tc_id');
  const traceIndex = header.indexOf('trace');
  if (tcIndex < 0) usage('Iteration CSV has no tc_id column.');
  for (const record of records) {
    const tcId = record[tcIndex]?.trim();
    if (!tcId) continue;
    if (grouped.has(tcId)) usage(`Duplicate tc_id in iteration CSV: ${tcId}`);
    grouped.set(tcId, {
      tcId,
      traces: new Set([record[traceIndex]?.trim() || 'UNTRACED']),
      passed: 0,
      failed: 0,
      evidence: [],
    });
  }
}
for (const row of rows) {
  const current = grouped.get(row.tcId) ?? {
    tcId: row.tcId,
    traces: new Set(),
    passed: 0,
    failed: 0,
    evidence: [],
  };
  if (row.trace !== 'UNTRACED' || current.traces.size === 0) current.traces.add(row.trace);
  if (row.status === 'PASS') current.passed += 1;
  else {
    current.failed += 1;
    if (row.evidence) current.evidence.push(row.evidence);
  }
  grouped.set(row.tcId, current);
}

const exitCode = options['exit-code'];
const lines = [
  `# ${options.fr ? `${options.fr} ` : ''}Test Execution`,
  '',
  `- Source: \`${path.basename(options.input)}\``,
  `- Newman exit: ${exitCode === undefined ? 'not supplied' : `\`${exitCode}\``}`,
  `- Requests: ${count('requests', 'total') - count('requests', 'failed')}/${count('requests', 'total')} passed`,
  `- Assertions: ${count('assertions', 'total') - count('assertions', 'failed')}/${count('assertions', 'total')} passed`,
  `- Newman failures: ${failures.length}`,
  '- Data note: raw Newman JSON may contain response bodies; review it before sharing.',
  '',
  '## Test cases',
  '',
  '| Test case | Trace | Result | Assertions | Evidence |',
  '|---|---|---:|---:|---|',
];

if (grouped.size === 0) {
  lines.push('| UNTRACED | UNTRACED | NO ASSERTIONS | 0 | Inspect collection scripts and partial run output. |');
} else {
  for (const item of [...grouped.values()].sort((a, b) => a.tcId.localeCompare(b.tcId))) {
    const observed = item.passed + item.failed;
    const result = item.failed > 0 ? 'FAIL' : observed > 0 ? 'PASS' : 'NOT OBSERVED';
    const evidence = observed > 0 ? item.evidence.join('; ') : 'No traceable assertion observed.';
    lines.push(`| ${escapeCell(item.tcId)} | ${escapeCell([...item.traces].join(', '))} | ${result} | ${item.passed} pass / ${item.failed} fail | ${escapeCell(evidence)} |`);
  }
}

lines.push('', '## Failure triage', '');
if (failures.length === 0) {
  lines.push('No Newman runtime failures were reported.');
} else {
  for (const failure of failures) {
    const label = failure.source?.name ?? failure.source?.id ?? '(unknown source)';
    const message = failure.error?.message ?? failure.error?.name ?? 'Unknown failure';
    lines.push(`- **UNRESOLVED** : ${escapeCell(label)}: ${escapeCell(message)}`);
  }
}
lines.push('', '> Classification and bug conclusions require agent review of the test contract and relevant SUT handler.');

const markdown = `${lines.join('\n')}\n`;
if (options.output) {
  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  fs.writeFileSync(options.output, markdown);
  console.log(options.output);
} else {
  process.stdout.write(markdown);
}
