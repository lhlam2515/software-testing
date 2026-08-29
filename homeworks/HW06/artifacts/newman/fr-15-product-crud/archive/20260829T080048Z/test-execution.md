# FR-15 Test Execution

- Source: `newman-report.json`
- Newman exit: `1`
- Requests: 199/199 passed
- Assertions: 154/172 passed
- Newman failures: 18
- Data note: raw Newman JSON may contain response bodies; review it before sharing.

## Test cases

| Test case | Trace | Result | Assertions | Evidence |
|---|---|---:|---:|---|
| FIXTURE | UNTRACED | FAIL | 0 pass / 8 fail | expected null to be a string; expected null to be a string; expected null to be a string; expected null to be a string; expected null to be a string; expected null to be a string; expected null to be a string; expected null to be a string |
| TC-01 | EC-03,EC-06,EC-09,EC-12,EC-14 | PASS | 4 pass / 0 fail |  |
| TC-02 | EC-01 | FAIL | 8 pass / 4 fail | expected 62 to deeply equal 61; expected 62 to deeply equal 61; expected 62 to deeply equal 61; expected 62 to deeply equal 61 |
| TC-03 | EC-02 | PASS | 4 pass / 0 fail |  |
| TC-04 | BVA-01 | PASS | 4 pass / 0 fail |  |
| TC-05 | BVA-02 | PASS | 4 pass / 0 fail |  |
| TC-06 | BVA-03 | FAIL | 8 pass / 4 fail | expected 66 to deeply equal 65; expected 66 to deeply equal 65; expected 66 to deeply equal 65; expected 66 to deeply equal 65 |
| TC-07 | EC-04 | PASS | 4 pass / 0 fail |  |
| TC-08 | EC-05 | PASS | 4 pass / 0 fail |  |
| TC-09 | BVA-04 | FAIL | 8 pass / 4 fail | expected 69 to deeply equal 68; expected 69 to deeply equal 68; expected 69 to deeply equal 68; expected 69 to deeply equal 68 |
| TC-10 | BVA-05 | FAIL | 8 pass / 4 fail | expected 70 to deeply equal 69; expected 70 to deeply equal 69; expected 70 to deeply equal 69; expected 70 to deeply equal 69 |
| TC-11 | BVA-06 | PASS | 4 pass / 0 fail |  |
| TC-12 | EC-07 | PASS | 2 pass / 0 fail |  |
| TC-13 | EC-08 | FAIL | 6 pass / 3 fail | expected 73 to deeply equal 72; expected 73 to deeply equal 72; expected 73 to deeply equal 72 |
| TC-14 | EC-10 | FAIL | 6 pass / 3 fail | expected 74 to deeply equal 73; expected 74 to deeply equal 73; expected 74 to deeply equal 73 |
| TC-15 | EC-11 | PASS | 4 pass / 0 fail |  |
| TC-16 | EC-13 | PASS | 4 pass / 0 fail |  |
| TC-17 | EC-16 | PASS | 4 pass / 0 fail |  |
| TC-18 | BVA-05_PUT_SCOPED | FAIL | 10 pass / 5 fail | expected '{"id":74,"name":"Áo thun mới","price"…' to deeply equal '{"id":74,"name":"Áo thun nam","price"…'; expected '{"id":74,"name":"Áo thun mới","price"…' to deeply equal '{"id":74,"name":"Áo thun nam","price"…'; expected '{"id":74,"name":"Áo thun mới","price"…' to deeply equal '{"id":74,"name":"Áo thun nam","price"…'; expected '{"id":74,"name":"Áo thun mới","price"…' to deeply equal '{"id":74,"name":"Áo thun nam","price"…'; expected '{"id":74,"name":"Áo thun mới","price"…' to deeply equal '{"id":74,"name":"Áo thun nam","price"…' |
| TC-19 | EC-08_PUT_SCOPED | FAIL | 8 pass / 4 fail | expected '{"id":74,"name":"Áo thun mới","price"…' to deeply equal '{"id":74,"name":"Áo thun mới","price"…'; expected '{"id":74,"name":"Áo thun mới","price"…' to deeply equal '{"id":74,"name":"Áo thun mới","price"…'; expected '{"id":74,"name":"Áo thun mới","price"…' to deeply equal '{"id":74,"name":"Áo thun mới","price"…'; expected '{"id":74,"name":"Áo thun mới","price"…' to deeply equal '{"id":74,"name":"Áo thun mới","price"…' |
| TC-20 | S-01 | PASS | 9 pass / 0 fail |  |
| TC-21 | S-02 | PASS | 15 pass / 0 fail |  |
| TC-22 | S-03 | PASS | 12 pass / 0 fail |  |
| TC-23 | S-04 | PASS | 9 pass / 0 fail |  |
| TC-24 | S-05 | FAIL | 15 pass / 5 fail | expected 200 to be at least 400; expected 200 to be at least 400; expected 200 to be at least 400; expected 200 to be at least 400; expected 200 to be at least 400 |
| TC-25 | SEC-C-01 | FAIL | 8 pass / 4 fail | expected 77 to deeply equal 76; expected 77 to deeply equal 76; expected 77 to deeply equal 76; expected 77 to deeply equal 76 |
| TC-26 | SEC-C-02 | FAIL | 10 pass / 5 fail | expected '{"id":74,"name":"Áo thun nam","price"…' to deeply equal '{"id":74,"name":"Áo thun mới","price"…'; expected '{"id":74,"name":"Áo thun nam","price"…' to deeply equal '{"id":74,"name":"Áo thun mới","price"…'; expected '{"id":74,"name":"Áo thun nam","price"…' to deeply equal '{"id":74,"name":"Áo thun mới","price"…'; expected '{"id":74,"name":"Áo thun nam","price"…' to deeply equal '{"id":74,"name":"Áo thun mới","price"…'; expected '{"id":74,"name":"Áo thun nam","price"…' to deeply equal '{"id":74,"name":"Áo thun mới","price"…' |
| TC-27 | SEC-C-03 | FAIL | 8 pass / 4 fail | expected '{}' to deeply equal '{"id":74,"name":"Áo thun nam","price"…'; expected '{}' to deeply equal '{"id":74,"name":"Áo thun nam","price"…'; expected '{}' to deeply equal '{"id":74,"name":"Áo thun nam","price"…'; expected '{}' to deeply equal '{"id":74,"name":"Áo thun nam","price"…' |
| TC-28 | SEC-C-04 | FAIL | 8 pass / 4 fail | expected 77 to deeply equal 76; expected 77 to deeply equal 76; expected 77 to deeply equal 76; expected 77 to deeply equal 76 |
| TC-29 | SEC-C-05 | PASS | 15 pass / 0 fail |  |
| TC-30 | SEC-C-06 | FAIL | 8 pass / 4 fail | expected 78 to deeply equal 77; expected 78 to deeply equal 77; expected 78 to deeply equal 77; expected 78 to deeply equal 77 |
| TC-31 | SEC-C-07 | PASS | 15 pass / 0 fail |  |
| TC-32 | SEC-C-08 | PASS | 12 pass / 0 fail |  |
| TC-33 | SEC-C-09 | PASS | 25 pass / 0 fail |  |
| TC-34 | SEC-C-10 | PASS | 25 pass / 0 fail |  |
| TC-35 | SEC-C-11 | PASS | 9 pass / 0 fail |  |
| TC-36 | SEC-C-12 | PASS | 12 pass / 0 fail |  |
| TC-37 | SC-01,SC-02 | PASS | 3 pass / 0 fail |  |
| TC-38 | SC-03 | PASS | 3 pass / 0 fail |  |
| TC-39 | SC-05 | PASS | 3 pass / 0 fail |  |
| TC-40 | SC-06 | PASS | 3 pass / 0 fail |  |
| TC-41 | SC-07 | PASS | 3 pass / 0 fail |  |
| TC-42 | SC-08 | PASS | 4 pass / 0 fail |  |
| TC-43 | SC-09 | FAIL | 4 pass / 1 fail | TC-25 was not refused: expected 200 to be at least 400 |
| TC-44 | srs.md FR-12 L177,SEC-02 L279 | FAIL | 18 pass / 6 fail | expected 81 to deeply equal 80; expected 81 to deeply equal 80; expected 81 to deeply equal 80; expected 81 to deeply equal 80; expected 81 to deeply equal 80; expected 81 to deeply equal 80 |
| TC-45 | SEC-05 L282,api_spec 3.3 L106-107 | PASS | 12 pass / 0 fail |  |
| TC-46 | srs.md FR-14 L186-189,FR-15 L197,api_spec 3.4 L120-125 | PASS | 16 pass / 0 fail |  |
| TC-47 | BVA-06 | PASS | 4 pass / 0 fail |  |
| TC-48 | api_spec L106-107,EC-16,EC-17 | PASS | 15 pass / 0 fail |  |
| TC-49 | api_spec L108-118,srs.md FR-15 L195,srs.md FR-15 L197,srs.md FR-15 L198 | PASS | 24 pass / 0 fail |  |
| TC-50 | api_spec L139,api_spec L135,api_spec L103-118 | PASS | 18 pass / 0 fail |  |
| TC-51 | srs.md FR-08 L106,api_spec L169,api_spec L103-118 | FAIL | 16 pass / 8 fail | expected '{"id":1,"user_id":2,"total_amount":10…' to include '74'; expected '{"id":1,"user_id":2,"total_amount":10…' to include '74'; expected '{"id":1,"user_id":2,"total_amount":10…' to include '74'; expected '{"id":1,"user_id":2,"total_amount":10…' to include '74'; expected '{"id":1,"user_id":2,"total_amount":10…' to include '74'; expected '{"id":1,"user_id":2,"total_amount":10…' to include '74'; expected '{"id":1,"user_id":2,"total_amount":10…' to include '74'; expected '{"id":1,"user_id":2,"total_amount":10…' to include '74' |
| TC-52 | api_spec L103-118,SC-06,SC-07,SC-08 | PASS | 4 pass / 0 fail |  |
| TC-53 | srs.md FR-12 L177-178,SEC-02 L279 | PASS | 15 pass / 0 fail |  |
| TC-54 | srs.md FR-12 L177-178,SEC-02 L279 | PASS | 12 pass / 0 fail |  |
| TC-55 | api_spec L106-107,EC-16,EC-17 | PASS | 15 pass / 0 fail |  |
| TC-56 | srs.md SEC-05 L282,api_spec L115 | PASS | 25 pass / 0 fail |  |

## Failure triage

- **UNRESOLVED** : Login Admin+Customer, Seed Products A/B/C: expected null to be a string
- **UNRESOLVED** : Data-Driven Request: expected 62 to deeply equal 61
- **UNRESOLVED** : Data-Driven Request: expected 66 to deeply equal 65
- **UNRESOLVED** : Data-Driven Request: expected 69 to deeply equal 68
- **UNRESOLVED** : Data-Driven Request: expected 70 to deeply equal 69
- **UNRESOLVED** : Data-Driven Request: expected 73 to deeply equal 72
- **UNRESOLVED** : Data-Driven Request: expected 74 to deeply equal 73
- **UNRESOLVED** : Data-Driven Request: expected '{"id":74,"name":"Áo thun mới","price"…' to deeply equal '{"id":74,"name":"Áo thun nam","price"…'
- **UNRESOLVED** : Data-Driven Request: expected '{"id":74,"name":"Áo thun mới","price"…' to deeply equal '{"id":74,"name":"Áo thun mới","price"…'
- **UNRESOLVED** : Data-Driven Request: expected 200 to be at least 400
- **UNRESOLVED** : Data-Driven Request: expected 77 to deeply equal 76
- **UNRESOLVED** : Data-Driven Request: expected '{"id":74,"name":"Áo thun nam","price"…' to deeply equal '{"id":74,"name":"Áo thun mới","price"…'
- **UNRESOLVED** : Data-Driven Request: expected '{}' to deeply equal '{"id":74,"name":"Áo thun nam","price"…'
- **UNRESOLVED** : Data-Driven Request: expected 77 to deeply equal 76
- **UNRESOLVED** : Data-Driven Request: expected 78 to deeply equal 77
- **UNRESOLVED** : Data-Driven Request: TC-25 was not refused: expected 200 to be at least 400
- **UNRESOLVED** : Data-Driven Request: expected 81 to deeply equal 80
- **UNRESOLVED** : Data-Driven Request: expected '{"id":1,"user_id":2,"total_amount":10…' to include '74'

> Classification and bug conclusions require agent review of the test contract and relevant SUT handler.

## Re-run delta

Baseline: `reports/archive/20260829T072916Z/` (run of 2026-08-22T08:57:40Z, 48 traced
`tc_id`s, 138 assertions / 15 failed). This run: 56 traced `tc_id`s, 172 assertions /
18 failed.

### Suite update

- Added: TC-49, TC-50, TC-51, TC-52, TC-53, TC-54, TC-55, TC-56 (`test-data.csv` grew
  from 48 to 56 rows). TC-48 carried no traceable assertion in the baseline report and
  first produces one here.
- Removed or renamed: none.

### Status movement

- Newly failing: TC-14, TC-43, TC-51.
- Newly passing: TC-48, TC-49, TC-50, TC-52, TC-53, TC-54, TC-55, TC-56.
- Still failing: TC-02, TC-06, TC-09, TC-10, TC-13, TC-18, TC-19, TC-24, TC-25, TC-26,
  TC-27, TC-28, TC-30, TC-44.
- Still passing: 31 cases.

## Classification

The failure list above is **not** a valid oracle for the admin-authenticated path in this
run. The fixture did not obtain an admin token, and every `admin_valid` row executed
unauthenticated.

**Root cause (test artifact defect).** The fixture pre-request script hard-codes
`password: 'admin123'` when logging in `admin@eshop.com`, and ignores the `adminEmail` /
`adminPassword` values supplied via `--env-var`. The seeded password is `Admin123!`
(`apps/backend/database.js:92`), so all six login attempts failed. Observed consequences:

- `adminToken` was stored as `null`; requests went out as `Authorization: Bearer null`
  (e.g. TC-01 iteration 0: `POST /api/products auth=Bearer null -> 200`).
- The repeated failures tripped the FR-02 account lockout. After the run,
  `users.login_attempts = 6` and `locked_until = 2026-08-29T07:32:23.652Z` for
  `admin@eshop.com`.
- The 8 FIXTURE assertion failures (`expected null to be a string`) are this defect
  surfacing directly, not a SUT fault.

`customerToken` was obtained normally — `test@eshop.com` is not locked and its password in
the fixture is correct.

**Per-case classification.**

- FIXTURE, and every row whose `auth_token` is `admin_valid`: **test artifact defect**.
  Their results are recorded but NOT OBSERVED as evidence for the documented oracle,
  because the intended precondition (a valid admin JWT) never held.
- TC-25, TC-28 (`MISSING` / `MALFORMED` token) and TC-30, TC-31, TC-32 (`customer_valid`):
  these rows sent the token they intended to send, but they are **confounded** for
  discrimination purposes. With admin rows also tokenless, this run cannot distinguish
  "role not enforced" from "auth not enforced at all".
- No failure in this run is classified as a SUT bug candidate on this evidence alone.

**Bearing on the known open finding.** `POST /api/products` returning `200` for a
`Bearer null` token (TC-01) and for a missing token (TC-25) is consistent with the
previously observed auth-bypass behavior. It is not filed from this run: the suite must
first be corrected so an authenticated admin baseline exists to compare against.

**Not re-run.** The defect is deterministic, not transient, so the single permitted
unchanged rerun was not spent on it. An unchanged rerun would reproduce the same wrong
login and, until the lockout window elapses, would fail earlier still.
