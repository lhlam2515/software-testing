# FR-08 Checkout — Newman Run

Local, account-free execution. No Postman API key, collection ID, or cloud workspace
permission required. Run from the repository root
(`homeworks/HW06/artifacts/postman/fr-08-checkout/`, i.e. this directory).

Built from the **Pass 2** audited suite: `audit/audited-master-test-cases-v2.md` (47 cases,
TC-01..TC-47) plus `audit/extended-test-cases-v2.md`, via `data/test-data.csv` (50 rows —
TC-36, TC-42 and TC-47 are each split one row per request) and `data/request-template.md`.

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
- Product id `1` must exist in the catalog (`GET /api/products/1`) — the fixture records its
  catalog price for TC-47a/TC-47b's injected-price comparison.
- Coupons `SAVE10` and `EXPIRED` must be seeded as documented in `srs.md` lines 130-135 —
  TC-42a, TC-43 and TC-44 address them by code.

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
  --reporter-json-export ../../newman/fr-08-checkout/newman-report.json \
  --reporter-html-export ../../newman/fr-08-checkout/newman-report.html
```

`test-execution.md` and `run-cycle.json` under `../../newman/fr-08-checkout/` are produced by the
`api-test-execute` skill from this same JSON/HTML report, not by this build step.

## Package contents

```text
collection.postman_collection.json  — 2 items: a one-time fixture + the data-driven checkout request, 50 tc_id rows
environment.postman_environment.json — baseUrl + studentId placeholders (no credentials)
test-data.csv                        — build-time snapshot of ../../test-cases/fr-08-checkout/data/test-data.csv
RUN.md                               — this file
(Newman run output lives in ../../newman/fr-08-checkout/, not here)
```

## Execution shape notes (for whoever runs/audits this collection)

**Item 1 — "Fixture Setup / Provision User A, B, C"** (execution-shape §2, fixture-dependent).
Fires only on iteration 0 (`pm.info.iteration > 0` → `skipRequest()`). Registers two fresh
throwaway accounts (`fr08-userb-<ts>@eshop.com`, `fr08-userc-<ts>@eshop.com`) so User C is
guaranteed to have a cart that was **never populated** (TC-18's own precondition) and User B
is guaranteed isolated from any other run. Logs in User A (`test@eshop.com` / `Test1234!`),
stores `tokenA`/`tokenB`/`tokenC`/`userBId`/`userCId` in the environment, resolves
`userAId` via `GET /api/users/me` (the `USER_A_ID` placeholder in TC-42a/TC-43/TC-44's
apply-coupon body) and `catalogPrice_product1` via `GET /api/products/1` (TC-47a/TC-47b),
then fires the real visible request — `GET /api/orders/my-orders` as User A — to snapshot
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
  `forgeJwt()` (no external JWT library, per script-templates.md §9). `content_type` drives
  the `Content-Type` header: `OMIT_HEADER` removes it (TC-34), any other value is sent
  verbatim (TC-41's `text/plain`).
- **Cart seeding (`seedCart`, before every real checkout)** — since this SUT documents no
  clear-cart endpoint, "0 items"/"known total" preconditions are forced via `forceEmpty()`:
  read the cart, and if non-empty, fire a real checkout to clear it (best-effort — its own
  outcome is itself one of this suite's UNSPECIFIED questions, so this is a precondition
  step, not an assertion). TC-01 → `ensureItemCount(tokenA, 2)`; TC-07/TC-26 → force-empty
  then seed exactly one 500,000₫ item; TC-14 → force-empty only; TC-15 → force-empty then
  seed exactly one item; TC-16 → `ensureNonEmpty`; TC-42a → force-empty then seed a known
  500,000₫ total (SAVE10's 300,000₫ threshold, `srs.md` line 132); TC-43 →
  `ensureCartTotalAtLeast(tokenA, 100000)` (EXPIRED's threshold, line 135); TC-47a →
  force-empty before the price-injected cart line. Rows in `NO_SEED_ROWS` (TC-17, TC-18,
  TC-38, TC-39, TC-42b, TC-44, TC-45, TC-46, TC-47b) get **no** cart mutation at all: they
  either send no cart-dependent traffic or depend verbatim on the state a prior row left
  behind. Every other real-checkout row defaults to `ensureNonEmpty(tokenA)`.
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
- **Shape 8 / endpoint override** — TC-38, TC-39, TC-42a, TC-43, TC-44, TC-45, TC-46,
  TC-47a: `endpoint_override` fires a genuine request against a different route
  (`GET /api/orders/my-orders`, `POST /api/apply-coupon`, `GET /api/orders/:id`,
  `POST /api/cart`), authenticated as the row's own `auth_token` account. A leading
  `{{baseUrl}}` in the column value is stripped and re-prefixed from the environment, so
  both the bare-path form (TC-38/TC-39) and the `{{baseUrl}}`-prefixed form (TC-42a onward)
  resolve identically. Runtime placeholders are resolved before the request is built:
  `ORDER_ID_TC16` in the path from `orderIdTC16` (captured by TC-16's Test script, falling
  back to User A's latest order in `GET /api/orders/my-orders`); `USER_A_ID` and
  `REAL_CART_TOTAL` inside `body_raw_override` from `userAId` and a live cart read.
- **Two-request cases split across rows** — TC-42a/TC-42b (apply-coupon then checkout),
  TC-47a/TC-47b (price-injected cart line then checkout). The `b` half carries `tc_ref` *and*
  request columns, so it fires the default `POST /api/checkout` after its `a` half, with no
  cart re-seeding (per `request-template.md` section 2's `tc_ref` + request-columns row).
- **Before/after side-effect snapshots** (`NEEDS_SNAPSHOT` list: TC-02..TC-13, TC-14,
  TC-21..24, TC-36a, TC-36b) — order count + cart item count captured for User A
  immediately before and after firing, feeding TC-31/TC-32/TC-37's analysis. Rows in
  `NO_ORDER_CREATED_ROWS` (the auth fail-closed set: TC-11, TC-12, TC-21..24, TC-36a,
  TC-36b) additionally hard-assert the delta is zero directly in their own row.

`pm.test()` calls inside `send()`-driven branches (TC-19, TC-20/25's isolation diff,
TC-29..40's analysis, TC-42b/TC-45/TC-47a/TC-47b's follow-up reads) still register in the
Newman JSON/HTML report.

## What is asserted vs. recorded

`expected_status` is blank on every row — no source documents a status code for
`POST /api/checkout` — so no row asserts one. `case_kind` marks the split:

- **`characterization` rows record only.** TC-02, TC-03, TC-04, TC-05, TC-08, TC-10, TC-13,
  TC-14, TC-17, TC-18, TC-19, TC-31, TC-33, TC-34, TC-35, TC-37, TC-41, TC-46, TC-42b,
  TC-47b. Their `pm.test()` calls persist the observation to environment variables
  (`observed_status_<id>`, `tc41_*`, `tc42b_orderTotal`, `tc46_orderStatusField`,
  `tc47b_*`) and assert nothing about the outcome.
- **`contract` rows assert the one thing a source establishes.** The decidable coupon
  oracle is TC-42a: SAVE10 (percent, 10%) on 500,000₫ must return `discount_amount` 50,000
  and `final_amount` 450,000 (`srs.md` lines 124, 126). TC-43 asserts EXPIRED yields no
  `discount_amount` above 0 (C2, line 117); TC-44 asserts the same for SAVE10's second use
  (C5, line 120, `max_uses_per_user` 1 at line 132). TC-45 asserts User B's
  `GET /api/orders/:id` does not return User A's order N and that order N is absent from
  User B's own list (FR-11 line 166). TC-47a asserts the client-supplied `price: 1` is
  accepted into the cart and that the recorded catalog price exceeds it.

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
  behavior), `TC-14`/`TC-07`/`TC-26`/`TC-15`/`TC-42a`/`TC-47a`'s "known total"/"0 items"/
  "1 item" preconditions will not hold, and downstream rows will observe and record
  whatever actually happened rather than a forced/faked state.
- **TC-44's precondition depends on an unobservable counter.** No source defines whether
  `apply-coupon` alone or a completed checkout increments SAVE10's per-user use count, so
  the script records the establishing events (`tc44_priorUseEvents`: TC-42a's returned
  discount and TC-42b's observed checkout status) next to the assertion. If TC-42a itself
  did not register a use, TC-44's "second use" premise is unmet and its assertion is
  vacuous — read the recorded value before drawing a conclusion.
- **TC-42a's assertion assumes the SAVE10 row is seeded exactly as `srs.md` line 132
  documents it** (percent, 10%, `min_order_value` 300,000, `max_uses_per_user` 1). A
  differently-seeded coupon table makes the 50,000 / 450,000 expectation fail for a data
  reason, not a code reason.
- **`orderIdTC16` falls back to "User A's latest order"** when TC-16's checkout response
  carries no id field. If TC-16 did not actually create an order, TC-45 and TC-46 address
  whichever order was most recent instead, and their results describe that object — check
  `orderIdTC16` in the run's environment output before interpreting them.
