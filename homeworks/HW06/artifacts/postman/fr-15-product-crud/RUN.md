# FR-15 Product Management (Admin CRUD) — Newman Run

Local, account-free execution. No Postman API key, collection ID, or cloud workspace
permission required. Run from this directory
(`homeworks/HW06/artifacts/postman/fr-15-product-crud/`).

Built from the Pass 2 audited suite (`audit/audited-master-test-cases-v2.md`) via
`data/test-data.csv` (56 rows, TC-01..TC-56) and `data/request-template.md`.

## Prerequisites

- e-Shop backend running locally: `cd apps/backend && node server.js` (default
  `http://localhost:3000`).
- `newman` installed (`npm install -g newman` or `npx newman`).
- Set `studentId` in `environment.postman_environment.json` (or override with `--env-var`)
  before running — every request is refused by the collection-level pre-request script
  when it is blank.
- Both seeded accounts must exist and be able to log in. The fixture reads them from the
  environment and falls back to the values seeded by `apps/backend/database.js`:
  `adminEmail=admin@eshop.com` / `adminPassword=Admin123!` and
  `customerEmail=test@eshop.com` / `customerPassword=Test1234!`. Override any of the four
  with `--env-var` when the local DB differs. The fixture logs in both on iteration 0 and
  every `admin_valid`/`customer_valid` row reuses the cached token for the rest of the run.
- **If either login returns no token the run refuses to continue.** The fixture records the
  reason in `fixtureError` and the data-driven item's pre-request script throws on every
  subsequent row rather than sending it as `Bearer null`. A tokenless run cannot separate
  "role not enforced" from "auth not enforced at all", and repeated bad logins also trip
  FR-02's account lockout on the seeded admin user, poisoning later runs.
- At least one category must exist (`GET /api/categories` non-empty) — the fixture uses
  it to seed products A/B/C, and every `VALID_CATEGORY` row resolves a fresh category id
  the same way, immediately before it fires.
- TC-50 and TC-51 exercise cart and order state (`POST /api/cart`, `POST /api/checkout`,
  `GET /api/orders/my-orders`, `GET /api/orders/:id`) under the customer principal named by
  the `secondary_auth_token` column. Those endpoints must be reachable or both rows record
  a failed precondition rather than their own subject.

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
  --reporter-json-export ../../newman/fr-15-product-crud/newman-report.json \
  --reporter-html-export ../../newman/fr-15-product-crud/newman-report.html
```

`test-execution.md` and `run-cycle.json` under `../../newman/fr-15-product-crud/` are produced by the
`api-test-execute` skill from this same JSON/HTML report, not by this build step.

## Package contents

```text
collection.postman_collection.json  — 2 items: a one-time fixture + the data-driven CRUD request, 56 tc_id rows (TC-01..TC-56)
environment.postman_environment.json — baseUrl + studentId placeholders and empty runtime slots (no credentials)
test-data.csv                        — build-time snapshot of ../../test-cases/fr-15-product-crud/data/test-data.csv
RUN.md                               — this file
(Newman run output lives in ../../newman/fr-15-product-crud/, not here)
```

## Execution shape notes (for whoever runs/audits this collection)

**Item 1 — "Fixture Setup / Login Admin+Customer, Seed Products A/B/C"** (execution-shape
§2, fixture-dependent). Fires only on iteration 0 (`pm.info.iteration > 0` →
`skipRequest()`). Logs in the admin and customer accounts named by
`adminEmail`/`adminPassword`/`customerEmail`/`customerPassword` (falling back to the
`apps/backend/database.js` seed values), storing `adminToken`/`customerToken` in the
environment for reuse by every row (cached once, not re-fetched per
row — the mapping table does not say auth tokens are resolved "immediately before the row
fires", unlike `VALID_CATEGORY`). Fetches a category id to seed three throwaway products
(`A_ID`, `B_ID`, `C_ID` — needed before TC-21/TC-34 and TC-24 fire, since those rows do not
create their own target products), and snapshots the baseline product count. Fires the real
visible request — `GET /api/categories` — last. If either login yields no token it sets
`fixtureError`, skips seeding, and every data row afterward is refused with that message.

**Item 2 — "Product CRUD / Data-Driven Request"** dispatches each CSV row by
`technique`/`method`/sentinel columns per
`.agents/skills/api-test-postman-build/references/execution-shapes.md`:

- **Shape 3 (multi-step sequence)** — TC-20 (create P2, then GET P2), TC-21 (PUT A, then
  GET B for isolation), TC-24 (DELETE C, GET C, DELETE C again, then a catalog id-set diff),
  TC-46 (create category CX, create a product referencing CX, DELETE CX, GET the product —
  cross-FR with FR-14), TC-50 (seed the customer's cart with P1, DELETE P1 as admin, GET
  /api/cart as the customer), TC-51 (cart + checkout to create order O1, DELETE P1 as admin,
  GET /api/orders/{{O1_ID}} as the customer). Each has its own function
  (`runSequenceTC20`/`TC21`/`TC24`/`TC46`/`TC50`/`TC51`) called from a `runSequence()` switch
  on `tc_id`; all traffic goes through the local `send()` wrapper and all `pm.test()` calls
  run inside the pre-request script, followed by `pm.execution.skipRequest()` (safe per
  sandbox constraint 5 — real traffic already fired). TC-21, TC-24, TC-50 and TC-51
  additionally write their own `captured_*` entries (collection-level auto-capture is
  suppressed for SEQUENCE rows — see below), since TC-38/TC-39 later inspect those responses.
- **Shape 4 (cross-response analysis, no new request)** — TC-37..TC-43 and TC-52. A harmless
  `GET /api/products/000000000` placeholder fires (guaranteed 404, no mutation) so the Test
  phase still records assertions; the real checks (referenced responses captured, JSON-
  parseable where a body exists, no leaked stack trace/HTML on 4xx+, and — when more than
  one `tc_ref` is named — recorded key-set, status and Content-Type comparisons) run in the
  Test script keyed off `captured_<tc_ref>`. TC-43 additionally hard-asserts each of its
  eight referenced auth/role attempts was refused; that is the one source-backed claim its
  v2 `expected_status_note` allows (srs.md L177-179). Every other analysis output is
  recorded for reporting, not asserted.
- **Shape 1 + 9 (default, single request + wire-mutation)** — the remaining 44 rows. Body
  construction (`buildProductBody`) applies `name_raw`/`price_raw`/`description_raw`/
  `imageUrl_raw` sentinels (`OMIT_KEY`, `EMPTY_STRING`, `LEN_n`, `RAW_TYPE_STRING`);
  `category_id` resolves `VALID_CATEGORY` via a fresh `GET /api/categories` immediately
  before the row fires, or applies `category_id_raw`'s `OMIT_KEY`/`RAW_TYPE_STRING` sentinel
  to the literal CSV value otherwise. `buildAuthHeader` maps `auth_token` (`admin_valid`/
  `customer_valid` → cached token, `MISSING` → no header, `MALFORMED` → a fixed bad string,
  `EXPIRED` → a locally forged JWT with `exp` in the past, `TAMPERED_SIG_ADMIN_CLAIM` → the
  cached customer token with its `role` claim locally overridden to `admin` and the original
  signature left invalid for the new payload) via locally-declared `forgeJwt`/
  `tamperRealToken`/`base64url`/`decodeBase64url` (no external JWT library, per
  script-templates.md §9). `extra_field` (`INJECT_ROLE_ADMIN`/`INJECT_IS_ADMIN_TRUE`) adds
  the undocumented key to the JSON body.

### Live before/after checks on the default shape

- **`no product created`** → snapshot the `GET /api/products` count before firing
  (`countBefore_<tc_id>`), re-count afterward, hard-assert no change.
- **Whole-catalog preservation** (`still lists every ...`, `existing products unaffected`,
  `list count unchanged`) → snapshot the full product id set before firing
  (`idsBefore_<tc_id>`) and assert afterward that no previously-existing id disappeared.
  This is what covers TC-33's, TC-44's, TC-45's and TC-56's catalog claims; the previous
  build pass flagged TC-33's as unverified, and it no longer is.
- **Single-target byte diff** (`unchanged`/`unaffected`/`still exists`/`still returns`) →
  snapshot the target product's full body before firing and diff it afterward. The target is
  normally the row's own `{{P1_ID}}`/`{{A_ID}}` path token, except TC-34 (path targets A, the
  isolation claim is about B) and TC-48/TC-55 (path targets the literal `0`/`-1`, the claim
  is about P1), which override it. TC-23, TC-36 and TC-44 are excluded: TC-23 and TC-44 have
  no single target (the id-set diff covers them) and TC-36's own PUT legitimately mutates P1,
  so a byte diff would be a false failure.
- **Verbatim-storage read-back** — rows whose `expected_side_effect_note` names a stored
  field (`stored name equals` → TC-33, `stored imageUrl equals` → TC-56,
  `description changes and equals` → TC-34) re-fetch the record and assert the injection
  payload was persisted as an inert literal, byte-for-byte. If the write was rejected, the
  row records that instead — the claim is conditional in the source note.
- **SQL-injection-no-error check** — any row whose `trace` contains `SEC-C-09`, `SEC-C-10`
  or `SEC-05` (TC-33, TC-34, TC-45, TC-56) asserts the raw body never matches
  `SQLITE_ERROR|syntax error|SQL error`.
- **Mass-assignment rows (TC-35/TC-36)** — v2 downgraded these to characterization: no
  source governs an undocumented body key for FR-15, and SEC-06 is scoped to
  `PUT /api/users/me`. The build now **records** whether `role`/`isAdmin` was echoed in the
  response and whether it is persisted on the re-fetched product
  (`echoed_*`/`persisted_*` environment keys) instead of asserting non-persistence. No
  privilege probe runs here — that is TC-30's condition.
- **TC-49 (partial-body PUT)** — snapshots P1 before firing, then classifies each of
  `name`, `description`, `imageUrl`, `category_id` as `preserved` / `changed` / `nulled` /
  `absent` and records `price`, into `tc49_fieldFates`. Merge-vs-replace is UNSPECIFIED, so
  nothing is asserted about which outcome is correct; a catalog id-set diff covers the row's
  "no other product changed" half.
- **Collection-level auto-capture guard** — the §0 collection-level Test script
  (`captured_<tc_id>` from `pm.response`) is skipped for SEQUENCE and ANALYSIS rows: SEQUENCE
  rows skip the visible request and set their own `captured_*` from the real `send()`
  response; ANALYSIS rows fire a placeholder nothing downstream reads.

### P1 lifecycle

TC-01 creates P1 and captures `P1_ID`; every `{{P1_ID}}` row depends on it. TC-50 and TC-51
delete P1 on purpose — that deletion *is* their condition under test — so any later row that
needs P1 calls `ensureP1()`, which probes `GET /api/products/{{P1_ID}}` and re-seeds an
equivalent record (same field values as TC-01's row) when the id is dangling, updating
`P1_ID`. The same self-heal covers the case where an earlier row's rejection oracle fails
against the real SUT and P1 is destroyed by a row that should not have destroyed it: that
row's own assertion still fails and is reported, while downstream rows keep testing their own
subject instead of cascading into meaningless dangling-id failures.

`pm.test()` calls inside `send()`-driven branches (all six SEQUENCE rows) still register in
the Newman JSON/HTML report; only the top-level "requests executed" summary metric
under-counts that traffic.

## Build-time verification

Static validation covered: both JSON files parse, schema v2.1, byte-exact CSV snapshot, all
56 `tc_id`s dispatchable with no extras, every `tc_ref` resolvable inside the CSV, every
assertion name reversible to `[tc_id][trace]`, `X-Student-Id` on every visible and scripted
request, blank `studentId` refusing traffic, every statically referenced environment variable
declared, and the five sandbox constraints (no top-level `const`/`let`, no bare top-level
`await`, no cross-script identifiers, 2-argument `pm.sendRequest` callbacks, no
`skipRequest()` branch without prior real traffic).

Dry-run: executed against a throwaway local `http` stub on port 3999 (not `apps/backend`, no
Postman cloud resources), over a 29-row subset covering every dispatcher branch, on two
paths:

- **Correct credentials** — 135 responses, no `SyntaxError`/`ReferenceError`/`TypeError`,
  every exercised row recorded at least one `pm.test()` result. The only failing assertions
  were stub-fidelity artifacts (the stub accepts any `a.b.c`-shaped bearer token and any
  price, so rows whose oracle expects a rejection correctly failed against it).
- **Deliberately wrong `adminPassword`** — the fixture assertion fails with a diagnostic
  naming both login statuses, and all 29 data rows are refused with
  `fixture did not establish tokens, row not sent: ...`. No row went out as `Bearer null`
  and no false oracle was recorded. This path exists because the first real execution of
  this package produced exactly that failure mode.

The dry-run's request/response data was discarded; `../../newman/fr-15-product-crud/` holds nothing from it.

**Runtime behavior against the real SUT remains unverified** — that is `api-test-execute`'s
step.

## Known build-time caveats

- **TC-35's "a follow-up non-admin-token attempt is still rejected" is not implemented**, and
  under v2 no longer needs to be: the row's note explicitly moves the privilege probe out of
  scope ("no privilege probe in this row — that is TC-30's condition"). Only the record-what-
  happened half runs.
- **TC-40/TC-41's "confirm via GET /api/products that no [new product was created / product
  was removed]" halves are not re-verified by the ANALYSIS row itself.** TC-22 and TC-23 (the
  rows they inspect) already carry that keyword in their own `expected_side_effect_note`, so
  the live check ran once on those rows.
- **`resolveCategoryId()` always picks `categoryList[0].id`.** If the backend ever returns
  zero categories, every `VALID_CATEGORY` row and the fixture's seeding will throw instead of
  failing gracefully — the SUT is expected to always have at least one seeded category per
  `setup_guide.md`.
- **Response id field is assumed to be `.id`** — `api_specification.md` §3.3 is silent on the
  successful POST/PUT/DELETE response body shape (itself TC-37/TC-38/TC-39's subject). Every
  place this build reads a created resource's id (`P1_ID`, `A_ID`, `B_ID`, `C_ID`, `P2_ID`,
  `CX_ID`, `PRODUCT_CX_ID`) assumes a top-level `id`; a different key degrades downstream rows
  to an `undefined` path segment, which surfaces as a real-SUT execution finding, not a
  silent pass.
- **TC-51's `O1_ID` is resolved as the last entry of `GET /api/orders/my-orders`**, since
  `POST /api/checkout`'s response body shape is undocumented. If the SUT orders that list
  newest-first, the row will target the wrong order and record a failed precondition rather
  than a false pass.
- **Count- and id-set-based assertions assume the run starts from a reasonably clean
  catalog.** Each row's count/id snapshot is taken inside that same row, so leftovers do not
  invalidate an oracle, but a DB carrying hundreds of probe products from earlier runs makes
  every `GET /api/products` snapshot larger and slower. Reset
  `apps/backend/database.sqlite` from the seed before a run whose results will be reported.
- **The fixture never re-tries a failed login.** FR-02's lockout counts failed attempts on
  the seeded admin account, so a retry loop would lock the very account it needs. One attempt
  per principal, then abort with a diagnostic.
- **TC-50/TC-51 line-presence detection is a substring match on the response text** for the
  product id. The cart and order response schemas are not documented for FR-15's purposes, so
  the build records the full body alongside the boolean (`tc50_cartAfterBody`,
  `tc51_orderAfterBody`) for manual confirmation during execution.
