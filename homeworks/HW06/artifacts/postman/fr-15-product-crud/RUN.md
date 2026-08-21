# FR-15 Product Management (Admin CRUD) — Newman Run

Local, account-free execution. No Postman API key, collection ID, or cloud workspace
permission required. Run from the repository root
(`homeworks/HW06/artifacts/postman/fr-15-product-crud/`, i.e. this directory).

## Prerequisites

- e-Shop backend running locally: `cd apps/backend && node server.js` (default
  `http://localhost:3000`).
- `newman` installed (`npm install -g newman` or `npx newman`).
- Set `studentId` in `environment.postman_environment.json` (or override with `--env-var`)
  before running — every request is refused by the collection-level pre-request script
  when it is blank.
- The seeded admin account `admin@eshop.com` / `admin123` (per
  `docs/eshop-sut/setup_guide.md`) and the seeded customer account `test@eshop.com` /
  `Test1234!` (same account reused by `fr-02-login`/`fr-08-checkout`) must both exist and
  be able to log in — the fixture item logs in both on iteration 0 and every `admin_valid`/
  `customer_valid` row reuses the cached token for the rest of the run.
- At least one category must exist (`GET /api/categories` non-empty) — the fixture uses
  it to seed products A/B/C, and every `VALID_CATEGORY` row resolves a fresh category id
  the same way, immediately before it fires.

## Command

```bash
cd homeworks/HW06/artifacts/postman/fr-15-product-crud

newman run collection.postman_collection.json \
  -e environment.postman_environment.json \
  -d test-data.csv \
  --env-var "studentId=<YOUR_STUDENT_ID>" \
  --timeout-request 15000 \
  --timeout-script 15000 \
  --reporters cli,json,html \
  --reporter-json-export reports/newman-report.json \
  --reporter-html-export reports/newman-report.html
```

`test-execution.md` and `run-cycle.json` under `reports/` are produced by the
`api-test-execute` skill from this same JSON/HTML report, not by this build step.

## Package contents

```text
collection.postman_collection.json  — 2 items: a one-time fixture + the data-driven CRUD request, 49 tc_id rows (TC-01..TC-48b)
environment.postman_environment.json — baseUrl + studentId placeholders (no credentials)
test-data.csv                        — build-time snapshot of ../../test-cases/fr-15-product-crud/data/test-data.csv
RUN.md                               — this file
reports/                             — reserved for api-test-execute's real run output
```

## Execution shape notes (for whoever runs/audits this collection)

**Item 1 — "Fixture Setup / Login Admin+Customer, Seed Products A/B/C"** (execution-shape
§2, fixture-dependent). Fires only on iteration 0 (`pm.info.iteration > 0` →
`skipRequest()`). Logs in `admin@eshop.com` and `test@eshop.com`, storing `adminToken`/
`customerToken` in the environment for reuse by every row (these are cached once, not
re-fetched per row — the mapping table does not say auth tokens are resolved "immediately
before the row fires", unlike `VALID_CATEGORY`). Fetches a category id to seed three
throwaway products (`A_ID`, `B_ID`, `C_ID` — needed before TC-21/TC-34 and TC-24 fire,
since those rows do not create their own target products), and snapshots the baseline
product count. Fires the real visible request — `GET /api/categories` — last.

**Item 2 — "Product CRUD / Data-Driven Request"** dispatches each CSV row by
`technique`/`method`/sentinel columns per
`.agents/skills/api-test-postman-build/references/execution-shapes.md`:

- **Shape 3 (multi-step sequence)** — TC-20 (create P2, then GET P2), TC-21 (PUT A, then
  GET B for isolation), TC-24 (DELETE C, GET C, DELETE C again), TC-46 (create category CX,
  create a product referencing CX, DELETE CX, GET the product — cross-FR with FR-14). Each
  has its own dedicated function (`runSequenceTC20`/`TC21`/`TC24`/`TC46`) called from a
  `runSequence()` switch on `tc_id`; all traffic goes through the local `send()` wrapper and
  all `pm.test()` calls run inside the pre-request script, followed by
  `pm.execution.skipRequest()` (safe per sandbox constraint 5 — real traffic already fired).
  TC-21 and TC-24 additionally write their own `captured_TC-21`/`captured_TC-24` entries
  (the collection-level auto-capture is suppressed for SEQUENCE rows — see below), since
  TC-38/TC-39 later inspect those exact responses.
- **Shape 4 (cross-response analysis, no new request)** — TC-37..TC-43. A harmless
  `GET /api/products/000000000` placeholder fires (guaranteed 404, no mutation) so the Test
  phase still records assertions; the real checks (referenced responses captured, JSON-
  parseable where a body exists, no leaked stack trace/HTML on 4xx+, and — when more than
  one `tc_ref` is named — a recorded top-level-key-set comparison) run in the Test script
  keyed off `captured_<tc_ref>`.
- **Shape 1 + 9 (default, single request + wire-mutation)** — the remaining 38 rows
  (TC-01..TC-19 minus TC-20/21, TC-22/23, TC-25..TC-36, TC-44/45/47/48a/48b). Body
  construction (`buildProductBody`) applies `name_raw`/`price_raw`/`description_raw`/
  `imageUrl_raw` sentinels (`OMIT_KEY`, `EMPTY_STRING`, `LEN_n`, `RAW_TYPE_STRING`);
  `category_id` resolves `VALID_CATEGORY` via a fresh `GET /api/categories` immediately
  before the row fires (per the mapping table's explicit wording), or applies
  `category_id_raw`'s `OMIT_KEY`/`RAW_TYPE_STRING` sentinel to the literal CSV value
  otherwise. `buildAuthHeader` maps `auth_token` (`admin_valid`/`customer_valid` → cached
  token, `MISSING` → no header, `MALFORMED` → a fixed bad string, `EXPIRED` → a locally
  forged JWT with `exp` in the past, `TAMPERED_SIG_ADMIN_CLAIM` → the cached customer token
  with its `role` claim locally overridden to `admin` and the original signature left
  invalid for the new payload) via locally-declared `forgeJwt`/`tamperRealToken`/
  `base64url`/`decodeBase64url` (no external JWT library, per script-templates.md §9).
  `extra_field` (`INJECT_ROLE_ADMIN`/`INJECT_IS_ADMIN_TRUE`) adds the undocumented key to
  the JSON body.
- **Live before/after checks** for this default shape — before firing, rows whose
  `expected_side_effect_note` contains "no product created" snapshot the current
  `GET /api/products` count (`countBefore_<tc_id>`); the Test script re-counts afterward
  and hard-asserts no change. Rows whose note contains "unchanged"/"unaffected"/"still
  exists"/"still returns" snapshot the target product's full body
  (`snapshotBefore_<tc_id>`) before firing and diff it byte-for-byte afterward — the target
  is normally extracted from the row's own `{{P1_ID}}`/`{{A_ID}}` path token, except
  TC-34 (whose own path targets A but whose isolation claim is about B) and TC-48a/TC-48b
  (whose own path targets the literal `0`/`-1`, but whose claim is about P1), which override
  the target explicitly. TC-01 additionally captures the created product's `id` into
  `P1_ID` — every later `{{P1_ID}}` reference (TC-17..19, TC-26/27/29/31/32/36, TC-48a/48b)
  depends on this.
- **Mass-assignment check** — TC-35/TC-36 (`extra_field` set): after the row's own request,
  the Test script re-fetches the affected product (by the POST response's `id`, or by the
  PUT/DELETE row's path-extracted id) and asserts the injected `role`/`isAdmin` field was
  not persisted. It does **not** re-run TC-35's documented follow-up privilege probe
  ("a follow-up non-admin-token attempt is still rejected") — see caveats below.
- **SQL-injection-no-error check** — any row whose `trace` contains `SEC-C-09`, `SEC-C-10`,
  or `SEC-05` (TC-33, TC-34, TC-45) asserts the raw response body never matches
  `SQLITE_ERROR|syntax error|SQL error`.
- **Collection-level auto-capture guard** — the mandatory §0 collection-level Test script
  (`captured_<tc_id>` from `pm.response`) is skipped for SEQUENCE and ANALYSIS rows: for
  SEQUENCE rows the visible request is skipped entirely (nothing meaningful to capture, and
  TC-21/TC-24 already set their own `captured_*` from the real `send()` response inside the
  pre-request script — letting the collection-level script run unguarded would overwrite
  those with the harmless-placeholder/skipped response); for ANALYSIS rows the visible
  request is a harmless placeholder that nothing downstream reads by `tc_id`, so there is
  nothing to preserve either way, but excluding it keeps the two branches parallel.

`pm.test()` calls inside `send()`-driven branches (all four SEQUENCE rows) still register
in the Newman JSON/HTML report; only the top-level "requests executed" summary metric
under-counts that traffic.

## Known build-time caveats

- **TC-33's "GET /api/products afterward still lists every previously-existing product"
  claim is not independently verified.** No single target id exists for a whole-catalog
  preservation check, and this suite's generic "no product created"/"unchanged" live checks
  are keyed off a single request path or product count, not a full list diff. The row still
  gets the generic SQL-injection-no-error check and status recording. Flagging here rather
  than inventing a bespoke list-diff mechanism for one row.
- **TC-35's "a follow-up non-admin-token attempt is still rejected" half of the oracle is
  not implemented.** Only the "no persisted `role` field" half is checked live; re-running
  a `customer_valid` POST/PUT/DELETE probe as a second real request was judged out of scope
  for this build pass (it would need its own before/after bookkeeping distinct from the
  row's own oracle). Same caveat applies to TC-36's `isAdmin` equivalent.
- **TC-40/TC-41's "confirm via GET /api/products that no [new product was created /
  product was removed]" halves are not independently re-verified by the ANALYSIS row
  itself.** TC-22 and TC-23 (the rows TC-40/TC-41 each inspect) already carry a "no product
  created"/matching keyword in their own `expected_side_effect_note`, so the live
  count-check already ran once, on TC-22/TC-23's own row. TC-40/TC-41 focus on response-shape
  inspection (status range, body absence of leaked detail) instead of re-running the same
  count check a second time.
- **`resolveCategoryId()` always picks `categoryList[0].id`** — the first category returned
  by `GET /api/categories`. If the backend ever returns zero categories, every
  `VALID_CATEGORY` row and the fixture's own product seeding will throw
  (`Cannot read properties of undefined`) instead of producing a graceful failure — the SUT
  is expected to always have at least one seeded category (per `setup_guide.md`'s seed data
  step), so this was not hardened further.
- **Response id field is assumed to be `.id`** — `api_specification.md` §3.3 is silent on
  the successful POST/PUT/DELETE response body shape (this is itself TC-37/TC-38/TC-39's own
  subject of inspection). Every place this build reads a created/updated resource's id
  (`P1_ID`, `A_ID`, `B_ID`, `C_ID`, `P2_ID`, `CX_ID`, `PRODUCT_CX_ID`) assumes a top-level
  `id` field; if the real SUT uses a different key, every id-dependent downstream row
  degrades to an `undefined` path segment and will surface as a real-SUT execution finding,
  not a silent pass.
