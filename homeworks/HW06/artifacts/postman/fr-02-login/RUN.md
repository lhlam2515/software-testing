# FR-02 Login & Account Lockout — Newman Run

Local, account-free execution. No Postman API key, collection ID, or cloud workspace
permission required. Run from the repository root
(`homeworks/HW06/artifacts/postman/fr-02-login/`, i.e. this directory).

## Prerequisites

- e-Shop backend running locally: `cd apps/backend && node server.js` (default
  `http://localhost:3000`).
- `newman` installed (`npm install -g newman` or `npx newman`).
- Set `studentId` in `environment.postman_environment.json` (or override with `--env-var`)
  before running — every request is refused by the collection-level pre-request script
  when it is blank.

## Command

```bash
cd homeworks/HW06/artifacts/postman/fr-02-login

newman run collection.postman_collection.json \
  -e environment.postman_environment.json \
  -d test-data.csv \
  --env-var "studentId=<YOUR_STUDENT_ID>" \
  --timeout-request 35000 \
  --timeout-script 35000 \
  --reporters cli,json,html \
  --reporter-json-export reports/newman-report.json \
  --reporter-html-export reports/newman-report.html
```

`--timeout-request`/`--timeout-script` are raised above Newman's 5s default because
TC-13/TC-14/TC-15 each wait up to ~31s inside their pre-request script for the
30-second lock-expiry boundary (execution-shape §5). `test-execution.md` and
`run-cycle.json` under `reports/` are produced by the `api-test-execute` skill from
this same JSON/HTML report, not by this build step.

## Package contents

```text
collection.postman_collection.json  — 1 data-driven item, all 42 tc_id rows
environment.postman_environment.json — baseUrl + studentId placeholders (no credentials)
test-data.csv                        — build-time snapshot of ../../test-cases/fr-02-login/data/test-data.csv
RUN.md                               — this file
reports/                             — reserved for api-test-execute's real run output
```

## Execution shape notes (for whoever runs/audits this collection)

The request-level pre-request script dispatches each CSV row by `tc_id`/columns per
`.agents/skills/api-test-postman-build/references/execution-shapes.md`:

- **Shape 1 (default, single request)** — TC-01/02/03/04/05/07/08/09/11/12, TC-17/18,
  TC-21..27, TC-37. Includes the wire-mutation composites (Shape 9) TC-06, TC-10,
  TC-32, TC-33, TC-34, TC-35, TC-41 — handled generically from
  `email_raw_json`/`password_raw_json`/`body_raw_override`/`content_type`, no
  per-row branch needed.
- **Shape 3 + 5 (setup sequence + timing wait)** — TC-13/14/15 (fresh 3-failure lock,
  then wait to T=29s/30s/31s), TC-16 (the row *is* the 3-attempt sequence; arms
  `lockUntil_test` for downstream rows), TC-19 (setup + success step + follow-up-failure
  step), TC-20 (waits out the active lock, fires 3 more attempts, then conservatively
  re-arms `lockUntil_test` since the audited oracle leaves which attempt re-locks
  UNSPECIFIED), TC-36 (2-attempt setup then the row's own correct-credential request).
- **Shared `lockUntil_test` wait-guard** — every row whose audited precondition requires
  `test@eshop.com` unlocked/counter=0 (TC-01, TC-21, TC-23, TC-38a, plus TC-19 and
  TC-36 above) calls `waitOutTestLock()` before firing. This was added after the
  package's own dry-run (against a local stub, discarded — not `reports/`) showed
  TC-19/TC-36/TC-38a failing when run back-to-back after TC-16/TC-20 without a wait:
  the account was still inside its 30s lock window. TC-17/TC-18 deliberately do *not*
  wait — they exist to observe the locked state immediately after TC-16.
- **Shape 4 (cross-response analysis, no new request)** — TC-28/29/30/31. Fire a
  harmless placeholder (`GET {{baseUrl}}/api/login`) so the Test phase still records
  assertions (sandbox constraint 5), then diff `captured_<tc_id>` responses stored by
  the collection-level Test script for the `tc_id`s named in `precondition_note`.
- **Shape 7 (cross-actor isolation)** — TC-39: locks `test@eshop.com` first, then
  fires its own request as `admin@eshop.com`.
- **Shape 6 (concurrency)** — TC-40: 3 concurrent wrong-password attempts via
  `Promise.all`, then a correct-credential verification call.
- **Shape 8-style (captured-response reuse)** — TC-38b: reads the token from
  `captured_TC-38a` (set by the mandatory §0 collection-level Test script) instead of
  a fresh fetch, then calls the protected `GET /api/users/me`.

`pm.test()` calls inside `send()`-driven sequences (TC-16, TC-19, TC-20, TC-40) still
register in the Newman JSON/HTML report; only the top-level "requests executed" count
under-reports the real number of HTTP calls those rows make.

## Known static-validation caveat

TC-29's cross-response assertion diffs the two captured bodies' `message` field. The
audited oracle leaves the exact response shape UNSPECIFIED; `message` is the field
name this backend uses elsewhere (`/api/forgot-password`, and the observed
`{"message":"login successful",...}` success shape) — if a real run shows a different
field name, that is new information for `api-test-execute` to report, not a defect in
this script.
