# Newman Artifacts

Execution evidence for the three Postman FR packages required by REQUIREMENTS.md
section 6, item 4, and listed as submission evidence in section 14. The runnable
inputs (collection, environment, `test-data.csv`, `RUN.md`) live in
`artifacts/postman/<fr>/`; this directory holds only what a real Newman run produced.

## Layout

```text
newman/
├── fr-02-login/
├── fr-08-checkout/
└── fr-15-product-crud/
```

Each FR directory contains:

```text
newman-report.html                 — HTML reporter output
newman-report.json                 — JSON reporter output, the evidence cited by BUG_REPORT.md
test-execution.md                  — per-test-case result summary written by api-test-execute
run-cycle.json                     — phase status, exit codes, leftover SUT state
archive/<UTC-timestamp>/           — the same four files from an earlier pass
```

Earlier passes are archived rather than overwritten, so Pass 1 evidence stays
available next to the current results.

## Reproducing a run

Follow `artifacts/postman/<fr>/RUN.md`. Its Newman command writes the JSON and HTML
reports straight into `artifacts/newman/<fr>/`.
