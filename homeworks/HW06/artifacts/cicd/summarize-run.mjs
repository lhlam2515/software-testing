#!/usr/bin/env node
// Render one Newman JSON report as a Markdown summary.
//
// Used by the pipeline to write the job summary a reviewer sees without
// downloading the artifact, and locally to check a subset before pushing.
//
// Usage: node summarize-run.mjs <newman-report.json> [fr-name]

import { readFileSync } from "node:fs";

const [reportPath, frName = ""] = process.argv.slice(2);
const report = JSON.parse(readFileSync(reportPath, "utf8"));
const stats = report.run.stats;

const caseOf = (assertionName) =>
  assertionName.match(/\[(TC-[0-9]+[a-z]?|FIXTURE)\]/)?.[1] ?? "UNLABELLED";

const cases = new Map(); // tc_id -> { pass, fail, firstError }
for (const execution of report.run.executions) {
  for (const assertion of execution.assertions ?? []) {
    const tc = caseOf(assertion.assertion);
    const entry = cases.get(tc) ?? { pass: 0, fail: 0, firstError: "" };
    if (assertion.error) {
      entry.fail++;
      entry.firstError ||= `${assertion.assertion} — ${assertion.error.message}`;
    } else {
      entry.pass++;
    }
    cases.set(tc, entry);
  }
}

const failed = [...cases].filter(([, e]) => e.fail > 0);

const lines = [];
lines.push(`## ${frName || reportPath}`);
lines.push("");
lines.push("| Metric | Executed | Failed |");
lines.push("|---|---:|---:|");
for (const key of ["iterations", "requests", "testScripts", "assertions"]) {
  lines.push(`| ${key} | ${stats[key].total} | ${stats[key].failed} |`);
}
lines.push("");
lines.push(`**Test cases:** ${cases.size} exercised, ${failed.length} failing`);
lines.push("");
if (failed.length === 0) {
  lines.push("All test cases in the CI regression subset passed.");
} else {
  lines.push("| Test case | Passed | Failed | First failure |");
  lines.push("|---|---:|---:|---|");
  for (const [tc, e] of failed) {
    lines.push(`| ${tc} | ${e.pass} | ${e.fail} | ${e.firstError.replace(/\|/g, "\\|").slice(0, 160)} |`);
  }
}

console.log(lines.join("\n"));
process.exitCode = failed.length === 0 ? 0 : 1;
