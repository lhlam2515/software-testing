# FR-02 Login & Account Lockout — Newman Run

Local, account-free execution. No Postman API key, collection ID, or cloud workspace
permission required. Run from the repository root
(`homeworks/HW06/artifacts/postman/fr-02-login/`, i.e. this directory).

Built from the Pass 2 audited suite (`audit/audited-master-test-cases-v2.md`,
`audit/extended-test-cases-v2.md`) via `data/test-data.csv` + `data/request-template.md`.

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
  --timeout-request 60000 \
  --timeout-script 60000 \
  --reporters cli,json,html \
  --reporter-json-export ../../newman/fr-02-login/newman-report.json \
  --reporter-html-export ../../newman/fr-02-login/newman-report.html
```

`--timeout-request`/`--timeout-script` are raised well above Newman's 5s default because
several rows wait inside their pre-request script for the 30-second lock window:
TC-13/TC-14/TC-15 wait up to ~31s, and TC-45 runs a ~31s staged sequence (lock at T=0,
attempts at T=10s and T=15s, its own request at T=31s). `test-execution.md` and
`run-cycle.json` under `../../newman/fr-02-login/` are produced by the `api-test-execute` skill from
this same JSON/HTML report, not by this build step.

Expect a wall-clock run of roughly 3-4 minutes: the timed rows alone account for
about 2.5 minutes of deliberate waiting.

## Package contents

```text
collection.postman_collection.json   — 1 data-driven item, all 53 tc_id rows
environment.postman_environment.json — baseUrl + studentId + lockUntil_test placeholders (no credentials)
test-data.csv                        — build-time snapshot of ../../test-cases/fr-02-login/data/test-data.csv
RUN.md                               — this file
(Newman run output lives in ../../newman/fr-02-login/, not here)
```

## Execution shape notes (for whoever runs/audits this collection)

The request-level pre-request script dispatches each CSV row by `tc_id`/columns per
`.agents/skills/api-test-postman-build/references/execution-shapes.md`:

- **Shape 1 (default, single request)** — TC-02..TC-12, TC-17/18, TC-22/24/25/26/27,
  TC-37, TC-43a..TC-43g. Includes the wire-mutation composites (Shape 9) TC-06, TC-10,
  TC-32, TC-33, TC-34, TC-35, TC-41 — handled generically from
  `email_raw_json`/`password_raw_json`/`body_raw_override`/`content_type`, no
  per-row branch needed.
- **Shape 3 + 5 (setup sequence + timing wait)** — TC-13/14/15 (fresh 3-failure lock,
  then wait to T=29s/30s/31s), TC-16 (the row *is* the 3-attempt sequence; arms
  `lockUntil_test` for downstream rows), TC-19 (setup + success step + follow-up-failure
  step), TC-20 (waits out the active lock, fires 3 more attempts, then conservatively
  re-arms `lockUntil_test` since the audited oracle leaves which attempt re-locks
  UNSPECIFIED), TC-36 (2-attempt setup then the row's own correct-credential request),
  TC-44 (fail, fail, success, fail, fail, then its own 6th attempt — the "liên tiếp"
  trigger guard), TC-45 (lock at T=0, wrong-password attempts at T=10s and T=15s inside
  the window, then its own correct-credential request at T=31s), TC-46 (three failures
  across email case variants, then an exact-case correct-credential probe).
- **Shared `lockUntil_test` wait-guard** — every row whose audited precondition requires
  `test@eshop.com` unlocked/counter=0 calls `waitOutTestLock()` before firing:
  TC-01, TC-02, TC-07, TC-11, TC-21, TC-23, TC-26, TC-38a (the Pass 2 audit added
  TC-02/TC-07/TC-11/TC-26 to this set), plus TC-19, TC-36, TC-40, TC-43a, TC-44, TC-45
  and TC-46. TC-17/TC-18 deliberately do *not* wait — they exist to observe the locked
  state immediately after TC-16, and TC-43b..TC-43g do not wait because the unbroken
  interleave order is the property under test.
- **Shape 4 (cross-response analysis, no new request)** — TC-28/29/30/31 and TC-42.
  Fire a harmless placeholder (`GET {{baseUrl}}/api/login`) so the Test phase still
  records assertions (sandbox constraint 5), then diff `captured_<tc_id>` responses
  stored by the collection-level Test script for the `tc_id`s named in
  `precondition_note`.
- **Shape 7 (cross-actor isolation)** — TC-39 locks `test@eshop.com` first, then fires
  its own request as `admin@eshop.com`; the Pass 2 oracle makes the outcome UNSPECIFIED
  (counter/lock scope undocumented), so it is recorded, not asserted. TC-43a..TC-43g
  extend this to a 5-step interleave across the two accounts followed by two lock-state
  probes (TC-43f on `test@eshop.com`, TC-43g on `admin@eshop.com`), both recorded.
- **Shape 6 (concurrency)** — TC-40: 3 concurrent wrong-password attempts via
  `Promise.all`, then a correct-credential verification call.
- **Shape 8-style (captured-response reuse)** — TC-38b: reads the token from
  `captured_TC-38a` (set by the collection-level Test script) instead of a fresh fetch,
  then calls the protected `GET /api/users/me`.

`pm.test()` calls inside `send()`-driven sequences (TC-16, TC-19, TC-20, TC-40) still
register in the Newman JSON/HTML report; only the top-level "requests executed" count
under-reports the real number of HTTP calls those rows make.

## Build-time caveats

1. **Counter reset is approximated, not performed.** The Pass 2 audit gives TC-02,
   TC-07, TC-11 and TC-26 a precondition of "unlocked, counter=0 (reset before running
   this row)". This package can only wait out a lock that an earlier row in the same
   run armed; it cannot set the failed-attempt counter to 0, because no API exposes
   that and whether a successful login resets it is itself UNSPECIFIED (TC-19/TC-36).
   A row that runs after a non-locking failure on the same account (for example TC-11
   after TC-08) therefore starts from an unknown counter value. `api-test-execute`
   should reset the account at the DB level between those rows, or record the deviation.

2. **Stack-trace / HTML assertion is scoped to the SQLi rows only.**
   `data/request-template.md` section 3 hard-asserts "no raw stack trace / HTML error
   page" only for TC-25, TC-26 and TC-27 — SEC-05 (`srs.md` line 282) is the one source
   that states that expectation, and it names the SQLi probes as its cases. Every other
   non-2xx row records `observed_stack_or_html_<tc_id>` instead of asserting; sources are
   silent on that facet for them, including TC-32/TC-33/TC-34/TC-41 which the Pass 2
   re-audit demoted to characterization. Those four also record
   `observed_content_type_*` and `observed_body_parses_as_json_*`, the remaining facets
   their oracle asks to record. The collection matches the template exactly on this
   point — the earlier template-vs-CSV disagreement is resolved.

3. **TC-28 is now record-only.** The Pass 2 oracle records whether the five error
   bodies share a top-level key set rather than asserting it; the credential-rejection
   subset is asserted separately by TC-29 and TC-42.

4. **TC-29 / TC-42 read a `message` field.** The audited oracle leaves the exact error
   response shape UNSPECIFIED; `message` is the field name this backend uses elsewhere
   (`/api/forgot-password`, and the observed `{"message":"login successful",...}`
   success shape). If a real run shows a different field name, that is new information
   for `api-test-execute` to report, not a defect in this script.
