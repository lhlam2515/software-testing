---
name: api-test-execute
description: Run, inspect, and report one already-built local Postman/Newman FR package. Use when the user asks to execute a collection, trace Newman failures to test cases, identify likely SUT bugs, record them in BUG_REPORT.md, re-run a suite after its test cases were updated and sync the existing bug report with the new results, or produce execution evidence. Do not use to design test cases or build collections.
---

# API Test Execute

Execute one existing FR package without changing its collection, environment, or data
snapshot. Use `api-test-postman-build` first when the package is absent or stale.

## Input contract

Require one package containing:

- `collection.postman_collection.json`;
- `environment.postman_environment.json`;
- `test-data.csv`;
- `RUN.md`;
- a writable `reports/` directory or permission to create it;
- runtime `studentId` and any required credentials, never hard-coded in artifacts.

Read [`references/run-contract.md`](references/run-contract.md) before running optional
setup or teardown hooks. Missing prerequisites produce `BLOCKED`, not invented results.

When `reports/` already holds a previous run, check whether this is a re-run before
executing: read [`references/rerun-contract.md`](references/rerun-contract.md) and follow it
if any suite artifact changed since that report.

## Run

For the standard local package, use the deterministic runner:

```bash
node <skill-dir>/scripts/run-cycle.mjs \
  --package <fr-package-dir> \
  --student-id <StudentID> \
  --fr <FR>
```

Pass runtime credentials with repeatable `--env-var <key=value>` arguments. The runner
redacts their values from `run-cycle.json`. Add timeout flags only when `RUN.md` requires
them for a timing case.

The runner performs preflight checks, invokes Newman, preserves JSON/HTML evidence, and
calls `inspect-newman.mjs`. Setup and teardown scripts are opt-in; never reset a database,
delete test data, start or stop a shared service merely because execution was requested.

Use Postman `run-collection` or MCP only for an existing cloud collection when the caller
requests cloud execution. Do not upload a local grading artifact just to use cloud tooling;
Newman JSON/HTML remains the portable submission evidence.

Keep the real Newman exit code. A non-zero exit is evidence to inspect, not permission to
force success. Make at most one unchanged rerun for a suspected transient failure.

## Inspect

Map assertion names of the form `[<tc_id>][<trace>] <assertion>` back to the CSV and
classify failures as:

- test artifact or data defect;
- environment or transport failure;
- SUT bug candidate;
- unresolved.

First compare the request, response, assertion, and documented oracle. Inspect the SUT
handler only when root-cause analysis is requested or the observed evidence cannot
distinguish an artifact defect from a bug candidate. Do not modify the SUT unless the user
separately asks.

The raw Newman reports may contain response bodies, credentials, or personal data. Review
them before publishing. Keep observed, inferred, and unverified claims distinct.

## Report bugs

Run this step only for failures classified as SUT bug candidates, and only when the caller
wants them recorded (execution alone does not imply a report is wanted). Read
[`references/bug-report-contract.md`](references/bug-report-contract.md) for triage rules,
severity/`foundBy` taxonomy, and the GitHub Issue workflow before writing anything.

1. Group failing assertions by root cause and build one bug object per distinct defect, not
   per failing assertion.
2. Write the bug objects to a JSON array file, then append them to the project's
   `BUG_REPORT.md`:

```bash
node <skill-dir>/scripts/append-bug-report.mjs \
  --report <path-to-BUG_REPORT.md> \
  --input <bugs.json>
```

The script appends one row to the Bug Summary table and one `### BUG-ID - <title>` section
under Detailed Findings per bug, in the format used since HW02/HW04/HW05. It matches the
summary table's columns by header text, validates `severity` and `foundBy`, skips ids already
present, and drops the `_TBD_` placeholder row once real rows exist. It never opens a GitHub
Issue or takes a screenshot.

3. Opening the GitHub Issue and attaching a screenshot per bug (required by REQUIREMENTS.md
   section 6 item 5) needs the user's explicit go-ahead — treat `gh issue create` as a
   visible action on shared state, not something to run on your own judgment. Once created,
   update that bug's `GitHub Issue` cell in the summary table and its `**GitHub Issue:**` /
   `#### Screenshot` lines in its Detailed Findings section directly.

## Re-run after a suite update

A package executed before, whose test cases, `test-data.csv`, collection, or environment
changed since, is a re-run, not a fresh run. Confirm it from artifact mtimes and the `tc_id`
diff rather than assuming, then follow
[`references/rerun-contract.md`](references/rerun-contract.md): archive the existing
`reports/` to `reports/archive/<UTC-timestamp>/`, re-run the whole suite, report a `Re-run
delta` against the archived report, and synchronize `BUG_REPORT.md` per the "Re-run
synchronization" rules in
[`references/bug-report-contract.md`](references/bug-report-contract.md).

Never close, delete, or rewrite an existing bug entry because the suite changed. New root
causes are appended through the script; moved evidence is a hand edit on the existing entry;
a bug that stops reproducing is a fix candidate for the user to decide, not a silent close.

## Completion contract

The package should contain:

- `reports/newman-report.json`;
- `reports/newman-report.html` when the HTML reporter is available;
- `reports/test-execution.md` generated from the observed JSON report;
- `reports/run-cycle.json` with phase status, exit codes, and cleanup state.

When bug reporting ran, also report: bug ids appended to `BUG_REPORT.md`, ids skipped as
duplicates, and which rows still need a GitHub Issue Link and Screenshot.

On a re-run, the package should additionally contain `reports/archive/<UTC-timestamp>/` with
the previous evidence, a `Re-run delta` section in `reports/test-execution.md`, and the
archive path plus delta recorded in `run-cycle.json`. Report the `tc_id` delta, the newly
failing / newly passing / still failing counts, and every `BUG_REPORT.md` sync action taken:
bugs added, bugs whose evidence was re-pointed, bugs no longer reproduced and awaiting the
user's close decision, and bugs left uncovered by the current suite.

Report the FR, exact command, exit code, concise counts, failed or blocked `tc_id`s, bug
candidates, artifact paths, and cleanup still required. Never claim a pass from collection
generation or from the existence of a report file alone.
