# Re-run contract

Applies when a package has been executed before and its test suite changed since: the
audited test cases, `test-data.csv`, the collection, or the environment were rebuilt after
the last recorded run. A re-run is not a fresh run — its deliverable includes a delta
against the previous run and a synchronization pass over the existing bug report.

## Detect, do not assume

Confirm the condition from evidence before treating a run as a re-run:

- compare the mtimes of `test-data.csv`, `collection.postman_collection.json`, and
  `environment.postman_environment.json` against `reports/newman-report.json`;
- diff the `tc_id` set in `test-data.csv` against the `tc_id`s already listed in
  `reports/test-execution.md`.

No prior report means a first run. Prior report with no changed artifact means an ordinary
repeat run — record it as such and skip the delta.

## Archive before running

Copy the existing `reports/` content to `reports/archive/<UTC-timestamp>/` before invoking
the runner. Never overwrite or delete prior evidence: the previous report is the baseline
the delta is computed against, and a graded submission keeps its execution history.

## Run the whole suite

Re-run every `tc_id` with the same runner command and the same runtime credentials, even
when only a few cases changed. A partial re-run cannot support a delta, and a case that
passed before can regress through shared SUT state.

## Report the delta

Add a `Re-run delta` section to the regenerated `reports/test-execution.md` covering:

- `tc_id`s added, removed, or renamed by the suite update;
- newly failing, newly passing, still failing, still passing.

Every entry comes from comparing the archived and the new `newman-report.json`, never from
recollection of an earlier session. Record the delta in `run-cycle.json` alongside the
archive path.

## Synchronize the bug report

Bug entries recorded from a previous run stay valid until re-run evidence says otherwise.
Follow the "Re-run synchronization" rules in
[`bug-report-contract.md`](bug-report-contract.md): new root causes are appended through the
script, moved evidence is a hand edit on the existing entry, and a bug is never closed or
deleted because a run passed once or because its test case disappeared.
