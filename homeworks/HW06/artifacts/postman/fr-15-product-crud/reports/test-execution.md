# FR-15 Test Execution

- Source: `newman-report.json`
- Newman exit: `1`
- Requests: 140/140 passed
- Assertions: 123/138 passed
- Newman failures: 15
- Data note: raw Newman JSON may contain response bodies; review it before sharing.

## Test cases

| Test case | Trace | Result | Assertions | Evidence |
|---|---|---:|---:|---|
| FIXTURE | UNTRACED | FAIL | 0 pass / 8 fail | expected null to be a string; expected null to be a string; expected null to be a string; expected null to be a string; expected null to be a string; expected null to be a string; expected null to be a string; expected null to be a string |
| TC-01 | EC-03,EC-06,EC-09,EC-12,EC-14 | PASS | 4 pass / 0 fail |  |
| TC-02 | EC-01 | FAIL | 8 pass / 4 fail | expected 10 to deeply equal 9; expected 10 to deeply equal 9; expected 10 to deeply equal 9; expected 10 to deeply equal 9 |
| TC-03 | EC-02 | PASS | 4 pass / 0 fail |  |
| TC-04 | BVA-01 | PASS | 4 pass / 0 fail |  |
| TC-05 | BVA-02 | PASS | 4 pass / 0 fail |  |
| TC-06 | BVA-03 | FAIL | 8 pass / 4 fail | expected 14 to deeply equal 13; expected 14 to deeply equal 13; expected 14 to deeply equal 13; expected 14 to deeply equal 13 |
| TC-07 | EC-04 | PASS | 4 pass / 0 fail |  |
| TC-08 | EC-05 | PASS | 4 pass / 0 fail |  |
| TC-09 | BVA-04 | FAIL | 8 pass / 4 fail | expected 17 to deeply equal 16; expected 17 to deeply equal 16; expected 17 to deeply equal 16; expected 17 to deeply equal 16 |
| TC-10 | BVA-05 | FAIL | 8 pass / 4 fail | expected 18 to deeply equal 17; expected 18 to deeply equal 17; expected 18 to deeply equal 17; expected 18 to deeply equal 17 |
| TC-11 | BVA-06 | PASS | 4 pass / 0 fail |  |
| TC-12 | EC-07 | PASS | 2 pass / 0 fail |  |
| TC-13 | EC-08 | FAIL | 6 pass / 3 fail | expected 21 to deeply equal 20; expected 21 to deeply equal 20; expected 21 to deeply equal 20 |
| TC-14 | EC-10 | PASS | 2 pass / 0 fail |  |
| TC-15 | EC-11 | PASS | 4 pass / 0 fail |  |
| TC-16 | EC-13 | PASS | 4 pass / 0 fail |  |
| TC-17 | EC-16 | PASS | 4 pass / 0 fail |  |
| TC-18 | BVA-05_PUT_SCOPED | FAIL | 8 pass / 4 fail | expected '{"id":18,"name":"Áo thun mới","price"…' to deeply equal '{"id":18,"name":"Áo thun nam","price"…'; expected '{"id":18,"name":"Áo thun mới","price"…' to deeply equal '{"id":18,"name":"Áo thun nam","price"…'; expected '{"id":18,"name":"Áo thun mới","price"…' to deeply equal '{"id":18,"name":"Áo thun nam","price"…'; expected '{"id":18,"name":"Áo thun mới","price"…' to deeply equal '{"id":18,"name":"Áo thun nam","price"…' |
| TC-19 | EC-08_PUT_SCOPED | FAIL | 6 pass / 3 fail | expected '{"id":18,"name":"Áo thun mới","price"…' to deeply equal '{"id":18,"name":"Áo thun mới","price"…'; expected '{"id":18,"name":"Áo thun mới","price"…' to deeply equal '{"id":18,"name":"Áo thun mới","price"…'; expected '{"id":18,"name":"Áo thun mới","price"…' to deeply equal '{"id":18,"name":"Áo thun mới","price"…' |
| TC-20 | S-01 | PASS | 9 pass / 0 fail |  |
| TC-21 | S-02 | PASS | 15 pass / 0 fail |  |
| TC-22 | S-03 | PASS | 12 pass / 0 fail |  |
| TC-23 | S-04 | PASS | 2 pass / 0 fail |  |
| TC-24 | S-05 | FAIL | 6 pass / 3 fail | expected 200 to be at least 400; expected 200 to be at least 400; expected 200 to be at least 400 |
| TC-25 | SEC-C-01 | FAIL | 8 pass / 4 fail | expected 25 to deeply equal 24; expected 25 to deeply equal 24; expected 25 to deeply equal 24; expected 25 to deeply equal 24 |
| TC-26 | SEC-C-02 | FAIL | 8 pass / 4 fail | expected '{"id":18,"name":"Áo thun nam","price"…' to deeply equal '{"id":18,"name":"Áo thun mới","price"…'; expected '{"id":18,"name":"Áo thun nam","price"…' to deeply equal '{"id":18,"name":"Áo thun mới","price"…'; expected '{"id":18,"name":"Áo thun nam","price"…' to deeply equal '{"id":18,"name":"Áo thun mới","price"…'; expected '{"id":18,"name":"Áo thun nam","price"…' to deeply equal '{"id":18,"name":"Áo thun mới","price"…' |
| TC-27 | SEC-C-03 | FAIL | 6 pass / 3 fail | expected '{}' to deeply equal '{"id":18,"name":"Áo thun nam","price"…'; expected '{}' to deeply equal '{"id":18,"name":"Áo thun nam","price"…'; expected '{}' to deeply equal '{"id":18,"name":"Áo thun nam","price"…' |
| TC-28 | SEC-C-04 | FAIL | 8 pass / 4 fail | expected 25 to deeply equal 24; expected 25 to deeply equal 24; expected 25 to deeply equal 24; expected 25 to deeply equal 24 |
| TC-29 | SEC-C-05 | PASS | 12 pass / 0 fail |  |
| TC-30 | SEC-C-06 | FAIL | 8 pass / 4 fail | expected 26 to deeply equal 25; expected 26 to deeply equal 25; expected 26 to deeply equal 25; expected 26 to deeply equal 25 |
| TC-31 | SEC-C-07 | PASS | 12 pass / 0 fail |  |
| TC-32 | SEC-C-08 | PASS | 9 pass / 0 fail |  |
| TC-33 | SEC-C-09 | PASS | 6 pass / 0 fail |  |
| TC-34 | SEC-C-10 | PASS | 16 pass / 0 fail |  |
| TC-35 | SEC-C-11 | PASS | 9 pass / 0 fail |  |
| TC-36 | SEC-C-12 | PASS | 9 pass / 0 fail |  |
| TC-37 | SC-01,SC-02 | PASS | 3 pass / 0 fail |  |
| TC-38 | SC-03 | PASS | 3 pass / 0 fail |  |
| TC-39 | SC-05 | PASS | 3 pass / 0 fail |  |
| TC-40 | SC-06 | PASS | 3 pass / 0 fail |  |
| TC-41 | SC-07 | PASS | 3 pass / 0 fail |  |
| TC-42 | SC-08 | PASS | 4 pass / 0 fail |  |
| TC-43 | SC-09 | PASS | 4 pass / 0 fail |  |
| TC-44 | srs.md FR-12 L177,SEC-02 L279 | FAIL | 8 pass / 4 fail | expected 29 to deeply equal 28; expected 29 to deeply equal 28; expected 29 to deeply equal 28; expected 29 to deeply equal 28 |
| TC-45 | SEC-05 L282,api_spec 3.3 L106-107 | PASS | 3 pass / 0 fail |  |
| TC-46 | srs.md FR-14 L186-189,FR-15 L197,api_spec 3.4 L120-125 | PASS | 16 pass / 0 fail |  |
| TC-47 | BVA-06 | PASS | 4 pass / 0 fail |  |
| TC-48a | EC-16,EC-17 | PASS | 12 pass / 0 fail |  |
| TC-48b | EC-16,EC-17 | PASS | 12 pass / 0 fail |  |

## Failure triage

- **UNRESOLVED** : Fixture Setup / Login Admin+Customer, Seed Products A/B/C: expected null to be a string
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 10 to deeply equal 9
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 14 to deeply equal 13
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 17 to deeply equal 16
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 18 to deeply equal 17
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 21 to deeply equal 20
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected '{"id":18,"name":"Áo thun mới","price"…' to deeply equal '{"id":18,"name":"Áo thun nam","price"…'
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected '{"id":18,"name":"Áo thun mới","price"…' to deeply equal '{"id":18,"name":"Áo thun mới","price"…'
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 200 to be at least 400
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 25 to deeply equal 24
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected '{"id":18,"name":"Áo thun nam","price"…' to deeply equal '{"id":18,"name":"Áo thun mới","price"…'
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected '{}' to deeply equal '{"id":18,"name":"Áo thun nam","price"…'
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 25 to deeply equal 24
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 26 to deeply equal 25
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 29 to deeply equal 28

> Classification and bug conclusions require agent review of the test contract and relevant SUT handler.

## Agent triage (post-inspection)

Evidence pulled directly from `newman-report.json` (request/response bodies, auth headers)
for each failing assertion. Root cause collapses into three systemic SUT defects, not 15
independent artifact bugs.

### SUT bug candidate — BUG-1 (critical): POST/PUT/DELETE /api/products enforce no
authentication or authorization
- **TC-26** (PUT `/api/products/18`, `auth_token=MISSING`): live evidence shows product 18's
  name/category actually changed to the row's own request body (`"Áo thun nam"`, category
  `1`) even though no `Authorization` header was sent at all. The "P1 fields unchanged"
  oracle failed because the SUT applied the update anyway.
- **TC-27** (DELETE `/api/products/18`, `auth_token=MISSING`): the follow-up
  `GET /api/products/18` returned `{}` — the product was actually deleted with no token
  present. `P1_ID` (18) never reappears in the catalog for the rest of the run.
- **TC-44** (POST `/api/products`, `auth_token=TAMPERED_SIG_ADMIN_CLAIM` — customer JWT with
  a locally forged `role` claim and an invalidated signature): the "no product created"
  count check failed — a product was created from a token whose signature does not verify
  against any secret the server could legitimately hold, i.e., the server is not verifying
  JWT signatures.
- Reproduces and extends the already-known open finding ("POST returns 200 regardless of
  auth state") to PUT and DELETE, and to a token that is not merely wrong-role but
  cryptographically invalid. This is an OWASP API1/API5-class broken auth finding.

### SUT bug candidate — BUG-2: POST/PUT accept and persist invalid input (no server-side
validation)
- **TC-02** (`name` omitted): created product `id=19` with `"name": null`.
- **TC-18** (PUT, `price` boundary `0`): product 18 persisted with `"price": "0"` (string,
  not rejected, and coerced to string type instead of the numeric type used elsewhere).
- **TC-19** (PUT, `category_id=999999`, non-existent FK): product 18 persisted with
  `"category_id": 999999` — no foreign-key validation on update.
- **TC-06, TC-09, TC-10, TC-13, TC-25, TC-28, TC-30**: same "no product created" count
  check fails for other EC/BVA/security-payload rows (empty name, oversized name, invalid
  price types/values, invalid category variants). Live catalog evidence (ids 20–33, 35–37,
  39–40) shows a persisted product for essentially every one of these rows, including a
  literal `"Ao'; DROP TABLE products;--"` name (TC-38/25-family, SQLi payload stored
  verbatim — not executed as SQL, but not rejected either) and 254/255-char oversized
  names.
- Also observed (did not hard-fail because the row's own oracle was "record actual
  behavior", not a hard assertion): **TC-03** (empty-string name) created `id=20` with
  `"name": ""` — same missing-validation defect, just not asserted by this row.

### SUT bug candidate — BUG-3: not-found resource returns 200, not 4xx
- **TC-24** (sequence: DELETE C → GET C → DELETE C again): `GET` after the first delete
  returned `200` where the oracle expected `>= 400`. Matches the SUT's general pattern
  (seen elsewhere in this suite) of returning `200` with an empty/near-empty body instead
  of `404` for a missing id.

### Test-artifact defect (not a SUT bug) — fixture assertion
- The one `[FIXTURE] ... expected null to be a string` failure (8 duplicate entries, all
  tied to the single iteration-0 fixture item) does not block any downstream `tc_id`: every
  row that depends on fixture output (`adminToken`/`customerToken`/`A_ID`/`B_ID`/`C_ID`)
  executed and mostly passed, so the tokens/products were seeded successfully. The failing
  check itself most likely reads a token/id from the wrong one of the fixture's 8 chained
  requests (e.g., the deliberate first `401` login attempt instead of the second `200` one).
  Classified **test artifact / build-script defect**, not a SUT defect — no SUT handler
  inspection performed since fixture output is independently confirmed correct by every
  downstream pass.
