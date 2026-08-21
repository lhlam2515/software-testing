# Postman execution artifacts

This directory is the submission index for the three independently runnable FR
packages. Reusable build logic lives in `.agents/skills/api-test-postman-build/`;
execution and inspection logic lives in `.agents/skills/api-test-execute/`. Neither is
duplicated here.

## Package layout

```text
postman/
├── fr-02-login/
├── fr-08-checkout/
└── fr-15-product-crud/
```

Each FR directory must contain:

```text
collection.postman_collection.json
environment.postman_environment.json
test-data.csv
RUN.md
reports/
├── newman-report.html
├── newman-report.json
├── test-execution.md
└── run-cycle.json
```

`artifacts/test-cases/<fr>/data/test-data.csv` and `request-template.md` remain the
design sources of truth. The local `test-data.csv` is a build-time snapshot and must
not be edited independently.

## Submission contract

- Every HTTP request, including calls created by `pm.sendRequest()`, carries
  `X-Student-Id` from the FR environment.
- Environment files contain placeholders only. Tokens, passwords, and account
  credentials are not submission artifacts.
- `RUN.md` contains the exact Newman command and runs without a Postman account,
  collection ID, API key, or cloud workspace permission.
- Assertion names use `[<tc_id>][<trace>] <assertion>` so JSON results map back to
  the audited suite.
- A package is executed only when one real run produces its exit status, JSON/HTML
  reports, and `test-execution.md`. Collection generation alone is not execution.

Postman cloud, Postman CLI by collection ID, and MCP may support development or
provide secondary evidence. The local collection and Newman reports are the grading
artifacts.

## Current status

The package directories have not been generated yet. Build each FR with
`api-test-postman-build`, then run it with `api-test-execute`; replace this status when
the actual artifacts exist.
