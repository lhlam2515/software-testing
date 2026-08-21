---
name: api-test-postman-build
description: Build and statically validate one local Postman FR package from an audited, synchronized API test suite. Use after api-test-sync when the user asks to generate or refresh a Postman collection, environment, iteration-data snapshot, or RUN.md. Do not send requests or report execution results.
---

# API Test Postman Build

Build one independently runnable local package for one FR. Keep the audited suite and its
source data read-only; generated package files are disposable build outputs.

## Inputs

Resolve one suite directory and require:

- `audit/audited-master-test-cases.md` for traceability;
- `data/test-data.csv` as the iteration source;
- `data/request-template.md` as the request and assertion contract;
- target package directory, normally `homeworks/HW06/artifacts/postman/<fr-slug>/`.

Stop for a missing input, an undocumented CSV value, or disagreement between the CSV and
request template. Use `api-test-sync` for the latter; do not repair design sources here.

## Build

1. Parse the CSV with a CSV-aware parser. Inventory every `tc_id`, trace, request mapping,
   expected result, precondition, and cleanup need.
2. Classify non-trivial rows with
   [`references/execution-shapes.md`](references/execution-shapes.md). Read only the matching
   sections of [`references/script-templates.md`](references/script-templates.md).
3. Generate or replace only this FR package:
   - `collection.postman_collection.json` using Collection schema v2.1;
   - `environment.postman_environment.json` with placeholders, not credentials;
   - `test-data.csv` as an exact build-time snapshot of the synchronized source;
   - `RUN.md` with a relative, copy-pasteable Newman command and reporter paths;
   - empty `reports/` only when the repository tracks empty directories explicitly.
4. Apply these invariants to every HTTP-producing path, including `pm.sendRequest()`:
   - refuse traffic when `studentId` is blank;
   - send `X-Student-Id: {{studentId}}`;
   - name assertions `[<tc_id>][<trace>] <assertion>`;
   - derive requests and oracles only from the CSV and request template;
   - preserve unspecified outcomes as unspecified, never as passes.

Regenerate the collection rather than preserving hand edits. Do not change another FR's
package or overwrite shared environment values.

## Static validation

Before handoff, verify:

- both JSON files parse and collection schema is v2.1;
- the package CSV exactly matches its source snapshot;
- every CSV `tc_id` is represented and no extra `tc_id` appears;
- every assertion name is reversible to `tc_id` and trace;
- every normal request and scripted request carries `X-Student-Id`;
- every referenced environment variable is declared;
- `RUN.md` names the local collection, environment, data, JSON report, and HTML report.

Do not contact the SUT, invoke Newman, create observed reports, or diagnose runtime failures.

## Handoff

Report the FR, source suite, generated files, case count, static validation result, and any
unresolved mapping. State explicitly that runtime behavior remains unverified.
