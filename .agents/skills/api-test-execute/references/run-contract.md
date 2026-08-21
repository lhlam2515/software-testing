# Newman run contract

## Entry gate

- The FR package and runtime `studentId` exist.
- Collection and environment JSON parse successfully.
- `test-data.csv` is readable and contains `tc_id`.
- The caller states whether the SUT is already reachable and whether its current state is
  suitable for this run. If either condition is unknown, report it instead of resetting the
  environment automatically.
- Newman and requested reporters are available. Do not install or authenticate tools
  without permission.

## Optional hooks

Setup and teardown belong to project runbooks, not to the generic executor. Run a hook only
when the caller supplies its exact script path. Never synthesize a reset, database mutation,
cleanup request, or process-control command.

The runner preserves failure state by default. A supplied teardown hook runs after a passing
suite; running it after a failure additionally requires `--teardown-on-failure`.

## Evidence and exit

- Capture Newman JSON/HTML before any teardown hook.
- Preserve the Newman exit code even when inspection or teardown also fails.
- Record setup, Newman, inspection, and teardown independently in `run-cycle.json`.
- Mark cases without traceable assertions `NOT OBSERVED`; unreachable SUT or missing tools
  are `BLOCKED`, not failed test cases.
- State what cleanup remains and whether any explicitly started process is still running.
