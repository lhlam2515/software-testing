# FR-08 Checkout — Newman Run

Local, account-free execution. No Postman API key, collection ID, or cloud workspace
permission required. Run from the repository root
(`homeworks/HW06/artifacts/postman/fr-08-checkout/`, i.e. this directory).

## Prerequisites

- e-Shop backend running locally: `cd apps/backend && node server.js` (default
  `http://localhost:3000`).
- `newman` installed (`npm install -g newman` or `npx newman`).
- Set `studentId` in `environment.postman_environment.json` (or override with `--env-var`)
  before running — every request is refused by the collection-level pre-request script
  when it is blank.
- The backend must allow new self-registrations (`POST /api/register`) — the fixture item
  provisions two brand-new throwaway accounts (User B, User C) on iteration 0 with
  timestamp-unique emails, so re-running the collection never collides with a prior run's
  accounts.

## Command

```bash
cd homeworks/HW06/artifacts/postman/fr-08-checkout

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
collection.postman_collection.json  — 2 items: a one-time fixture + the data-driven checkout request, 42 tc_id rows
environment.postman_environment.json — baseUrl + studentId placeholders (no credentials)
test-data.csv                        — build-time snapshot of ../../test-cases/fr-08-checkout/data/test-data.csv
RUN.md                               — this file
reports/                             — reserved for api-test-execute's real run output
```

## Execution shape notes (for whoever runs/audits this collection)

**Item 1 — "Fixture Setup / Provision User A, B, C"** (execution-shape §2, fixture-dependent).
Fires only on iteration 0 (`pm.info.iteration > 0` → `skipRequest()`). Registers two fresh
throwaway accounts (`fr08-userb-<ts>@eshop.com`, `fr08-userc-<ts>@eshop.com`) so User C is
guaranteed to have a cart that was **never populated** (TC-18's own precondition) and User B
is guaranteed isolated from any other run. Logs in User A (`test@eshop.com` / `Test1234!`),
stores `tokenA`/`tokenB`/`tokenC`/`userBId`/`userCId` in the environment, and fires the real
visible request — `GET /api/orders/my-orders` as User A — to snapshot
`orderCountBaseline_userA` before any checkout in this run (needed by TC-38's oracle).

**Item 2 — "Checkout / Data-Driven Request"** dispatches each CSV row by `tc_id`/columns per
`.agents/skills/api-test-postman-build/references/execution-shapes.md`:

- **Shape 1 + Shape 9 (default, single request + wire-mutation)** — TC-02..06, TC-08..13,
  TC-21..24, TC-27, TC-28, TC-33, TC-34, TC-36a, TC-36b, TC-41. Body/header construction is
  generic: `resolveShippingAddress`/`resolveTotalAmount` read `shipping_address_raw` /
  `total_amount_raw` sentinels (`OMIT_KEY`, `RAW_TYPE_NULL`, `RAW_TYPE_NUMBER`,
  `RAW_TYPE_STRING`, `LONG_STRING_5000_CHARS`); `buildAuthHeaderValue` maps `auth_token`
  (`valid_userA/B/C`, `MISSING`, `MALFORMED`, `FORGED_BAD_SIG`, `EXPIRED`, `NO_SCHEME`,
  `WRONG_SCHEME_BASIC`) to the actual `Authorization` value, including a locally-declared
  `forgeJwt()` (no external JWT library, per script-templates.md §9).
- **Cart seeding (`seedCart`, before every real checkout)** — since this SUT documents no
  clear-cart endpoint, "0 items"/"known total" preconditions are forced via `forceEmpty()`:
  read the cart, and if non-empty, fire a real checkout to clear it (best-effort — its own
  outcome is itself one of this suite's UNSPECIFIED questions, so this is a precondition
  step, not an assertion). TC-01 → `ensureItemCount(tokenA, 2)`; TC-07/TC-26 → force-empty
  then seed exactly one 500,000₫ item; TC-14 → force-empty only; TC-15 → force-empty then
  seed exactly one item; TC-16 → `ensureNonEmpty`; TC-17/TC-18 get no forced setup (TC-17
  relies on TC-16 — the immediately preceding row — having actually cleared the cart; TC-18
  relies on User C's cart never having been touched); every other real-checkout row defaults
  to `ensureNonEmpty(tokenA)`.
- **Shape 7 (cross-actor isolation)** — TC-20, TC-25: seed both User A's and User B's carts,
  snapshot User B's cart/orders *before* firing User A's checkout, then the Test script
  re-reads User B's state *after* and diffs both snapshots byte-for-byte.
- **Shape 6 (concurrency)** — TC-19 (`extra_field=DOUBLE_SUBMIT`): two `send()` calls fired
  via `Promise.all` (no sequential wait), then `pm.execution.skipRequest()` — safe per
  sandbox constraint 5 since real traffic already fired. Its own `pm.test()` runs inside the
  pre-request script (no Test-phase assertions for this row).
- **Shape 4 (cross-response analysis, no new request)** — TC-29, TC-30, TC-31, TC-32,
  TC-35, TC-37, TC-40. Fire a harmless placeholder (`GET {{baseUrl}}/api/checkout`, this
  FR's own POST-only route) so the Test phase still records assertions (sandbox
  constraint 5), then diff `captured_<tc_id>` bodies / `orderCountBefore_<tc_id>` /
  `orderCountAfter_<tc_id>` / `cartCountBefore_<tc_id>` / `cartCountAfter_<tc_id>` snapshots
  captured by the referenced rows themselves.
- **Shape 8 / endpoint override** — TC-38, TC-39: `endpoint_override` fires
  `GET /api/orders/my-orders` instead of a checkout, authenticated as the row's own
  `auth_token` account (User A for TC-38, User B for TC-39).
- **Before/after side-effect snapshots** (`NEEDS_SNAPSHOT` list: TC-02..TC-13(minus none),
  TC-14, TC-21..24, TC-36a, TC-36b) — order count + cart item count captured for User A
  immediately before and after firing, feeding TC-31/TC-32/TC-37's analysis. Rows in
  `NO_ORDER_CREATED_ROWS` (the auth fail-closed set: TC-11, TC-12, TC-21..24, TC-36a,
  TC-36b) additionally hard-assert the delta is zero directly in their own row.

`pm.test()` calls inside `send()`-driven branches (TC-19, TC-20/25's isolation diff,
TC-29..40's analysis) still register in the Newman JSON/HTML report.

## Known build-time caveats

- **TC-37's tc_ref list includes TC-05, TC-07, TC-08, TC-09, TC-10 alongside a blanket
  "none may have created an order" claim** — but TC-07 is *separately* documented as an
  accepted, recomputed checkout (not a validation error), and TC-05/TC-08/TC-09/TC-10 each
  carry their own row-level oracle admitting an accepted/recompute-rule outcome is
  plausible. Hard-asserting "no order" for all ten referenced ids would fail against any
  SUT that actually implements the documented recompute rule — that is a pre-existing
  tension in the audited suite's own TC-37 oracle, not a script defect. The Test script
  hard-asserts the invariant only for the five ids where no source suggests an accepted
  outcome (TC-02, TC-03, TC-04, TC-06, TC-13 — all shipping_address structural defects) and
  *records* (via `tc37_orderDelta_<id>`/`tc37_cartDelta_<id>` environment variables) the
  delta for the other five without asserting on it.
- **TC-09's own audited oracle asks for two sub-cases** (`total_amount=-1`, then repeated
  with `total_amount=0`), but `data/test-data.csv` materializes only the `-1` row. Per this
  build's scope ("cover every `tc_id` present in this suite's `data/test-data.csv` — no
  subset, no extra"), no second row was invented; the `0` sub-case is simply absent from
  this package. Flagging here rather than silently working around it in the CSV or script.
- **TC-38's oracle ("order count increased by exactly one")** cannot hold literally in a
  single consolidated run: TC-01, TC-07, TC-15, TC-16, TC-19, TC-20, TC-25, TC-26 all plausibly
  succeed before TC-38 fires, each incrementing User A's order count. The Test script
  therefore asserts only that the count is *greater than* `orderCountBaseline_userA`
  (captured by the fixture item before any checkout ran), not a specific delta.
- **`forceEmpty()` has no dedicated clear-cart endpoint to call** — it clears a non-empty
  cart only by firing a real checkout with the cart's own current total. If that checkout
  itself doesn't clear the cart against the real SUT (contrary to TC-16's documented
  behavior), `TC-14`/`TC-07`/`TC-26`/`TC-15`'s "known total"/"0 items"/"1 item" preconditions
  will not hold, and downstream rows will observe and record whatever actually happened
  rather than a forced/faked state.
