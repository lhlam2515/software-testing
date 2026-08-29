# FR-15 Test Execution

- Source: `newman-report.json`
- Newman exit: `1`
- Requests: 199/199 passed
- Assertions: 157/173 passed
- Newman failures: 16
- Data note: raw Newman JSON may contain response bodies; review it before sharing.

## Test cases

| Test case | Trace | Result | Assertions | Evidence |
|---|---|---:|---:|---|
| FIXTURE | UNTRACED | PASS | 16 pass / 0 fail |  |
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
| TC-14 | EC-10 | FAIL | 6 pass / 3 fail | expected 22 to deeply equal 21; expected 22 to deeply equal 21; expected 22 to deeply equal 21 |
| TC-15 | EC-11 | PASS | 4 pass / 0 fail |  |
| TC-16 | EC-13 | PASS | 4 pass / 0 fail |  |
| TC-17 | EC-16 | PASS | 4 pass / 0 fail |  |
| TC-18 | BVA-05_PUT_SCOPED | FAIL | 10 pass / 5 fail | expected '{"id":9,"name":"Áo thun mới","price":…' to deeply equal '{"id":9,"name":"Áo thun nam","price":…'; expected '{"id":9,"name":"Áo thun mới","price":…' to deeply equal '{"id":9,"name":"Áo thun nam","price":…'; expected '{"id":9,"name":"Áo thun mới","price":…' to deeply equal '{"id":9,"name":"Áo thun nam","price":…'; expected '{"id":9,"name":"Áo thun mới","price":…' to deeply equal '{"id":9,"name":"Áo thun nam","price":…'; expected '{"id":9,"name":"Áo thun mới","price":…' to deeply equal '{"id":9,"name":"Áo thun nam","price":…' |
| TC-19 | EC-08_PUT_SCOPED | FAIL | 8 pass / 4 fail | expected '{"id":9,"name":"Áo thun mới","price":…' to deeply equal '{"id":9,"name":"Áo thun mới","price":…'; expected '{"id":9,"name":"Áo thun mới","price":…' to deeply equal '{"id":9,"name":"Áo thun mới","price":…'; expected '{"id":9,"name":"Áo thun mới","price":…' to deeply equal '{"id":9,"name":"Áo thun mới","price":…'; expected '{"id":9,"name":"Áo thun mới","price":…' to deeply equal '{"id":9,"name":"Áo thun mới","price":…' |
| TC-20 | S-01 | PASS | 9 pass / 0 fail |  |
| TC-21 | S-02 | PASS | 15 pass / 0 fail |  |
| TC-22 | S-03 | PASS | 12 pass / 0 fail |  |
| TC-23 | S-04 | PASS | 9 pass / 0 fail |  |
| TC-24 | S-05 | FAIL | 15 pass / 5 fail | expected 200 to be at least 400; expected 200 to be at least 400; expected 200 to be at least 400; expected 200 to be at least 400; expected 200 to be at least 400 |
| TC-25 | SEC-C-01 | FAIL | 8 pass / 4 fail | expected 25 to deeply equal 24; expected 25 to deeply equal 24; expected 25 to deeply equal 24; expected 25 to deeply equal 24 |
| TC-26 | SEC-C-02 | FAIL | 10 pass / 5 fail | expected '{"id":9,"name":"Áo thun nam","price":…' to deeply equal '{"id":9,"name":"Áo thun mới","price":…'; expected '{"id":9,"name":"Áo thun nam","price":…' to deeply equal '{"id":9,"name":"Áo thun mới","price":…'; expected '{"id":9,"name":"Áo thun nam","price":…' to deeply equal '{"id":9,"name":"Áo thun mới","price":…'; expected '{"id":9,"name":"Áo thun nam","price":…' to deeply equal '{"id":9,"name":"Áo thun mới","price":…'; expected '{"id":9,"name":"Áo thun nam","price":…' to deeply equal '{"id":9,"name":"Áo thun mới","price":…' |
| TC-27 | SEC-C-03 | FAIL | 8 pass / 4 fail | expected '{}' to deeply equal '{"id":9,"name":"Áo thun nam","price":…'; expected '{}' to deeply equal '{"id":9,"name":"Áo thun nam","price":…'; expected '{}' to deeply equal '{"id":9,"name":"Áo thun nam","price":…'; expected '{}' to deeply equal '{"id":9,"name":"Áo thun nam","price":…' |
| TC-28 | SEC-C-04 | FAIL | 8 pass / 4 fail | expected 25 to deeply equal 24; expected 25 to deeply equal 24; expected 25 to deeply equal 24; expected 25 to deeply equal 24 |
| TC-29 | SEC-C-05 | PASS | 15 pass / 0 fail |  |
| TC-30 | SEC-C-06 | FAIL | 8 pass / 4 fail | expected 26 to deeply equal 25; expected 26 to deeply equal 25; expected 26 to deeply equal 25; expected 26 to deeply equal 25 |
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
| TC-44 | srs.md FR-12 L177,SEC-02 L279 | FAIL | 18 pass / 6 fail | expected 29 to deeply equal 28; expected 29 to deeply equal 28; expected 29 to deeply equal 28; expected 29 to deeply equal 28; expected 29 to deeply equal 28; expected 29 to deeply equal 28 |
| TC-45 | SEC-05 L282,api_spec 3.3 L106-107 | PASS | 12 pass / 0 fail |  |
| TC-46 | srs.md FR-14 L186-189,FR-15 L197,api_spec 3.4 L120-125 | PASS | 16 pass / 0 fail |  |
| TC-47 | BVA-06 | PASS | 4 pass / 0 fail |  |
| TC-48 | api_spec L106-107,EC-16,EC-17 | PASS | 15 pass / 0 fail |  |
| TC-49 | api_spec L108-118,srs.md FR-15 L195,srs.md FR-15 L197,srs.md FR-15 L198 | PASS | 24 pass / 0 fail |  |
| TC-50 | api_spec L139,api_spec L135,api_spec L103-118 | PASS | 18 pass / 0 fail |  |
| TC-51 | srs.md FR-08 L106,api_spec L169,api_spec L103-118 | PASS | 24 pass / 0 fail |  |
| TC-52 | api_spec L103-118,SC-06,SC-07,SC-08 | PASS | 4 pass / 0 fail |  |
| TC-53 | srs.md FR-12 L177-178,SEC-02 L279 | PASS | 15 pass / 0 fail |  |
| TC-54 | srs.md FR-12 L177-178,SEC-02 L279 | PASS | 12 pass / 0 fail |  |
| TC-55 | api_spec L106-107,EC-16,EC-17 | PASS | 15 pass / 0 fail |  |
| TC-56 | srs.md SEC-05 L282,api_spec L115 | PASS | 25 pass / 0 fail |  |

## Failure triage

- **UNRESOLVED** : Data-Driven Request: expected 10 to deeply equal 9
- **UNRESOLVED** : Data-Driven Request: expected 14 to deeply equal 13
- **UNRESOLVED** : Data-Driven Request: expected 17 to deeply equal 16
- **UNRESOLVED** : Data-Driven Request: expected 18 to deeply equal 17
- **UNRESOLVED** : Data-Driven Request: expected 21 to deeply equal 20
- **UNRESOLVED** : Data-Driven Request: expected 22 to deeply equal 21
- **UNRESOLVED** : Data-Driven Request: expected '{"id":9,"name":"Áo thun mới","price":…' to deeply equal '{"id":9,"name":"Áo thun nam","price":…'
- **UNRESOLVED** : Data-Driven Request: expected '{"id":9,"name":"Áo thun mới","price":…' to deeply equal '{"id":9,"name":"Áo thun mới","price":…'
- **UNRESOLVED** : Data-Driven Request: expected 200 to be at least 400
- **UNRESOLVED** : Data-Driven Request: expected 25 to deeply equal 24
- **UNRESOLVED** : Data-Driven Request: expected '{"id":9,"name":"Áo thun nam","price":…' to deeply equal '{"id":9,"name":"Áo thun mới","price":…'
- **UNRESOLVED** : Data-Driven Request: expected '{}' to deeply equal '{"id":9,"name":"Áo thun nam","price":…'
- **UNRESOLVED** : Data-Driven Request: expected 25 to deeply equal 24
- **UNRESOLVED** : Data-Driven Request: expected 26 to deeply equal 25
- **UNRESOLVED** : Data-Driven Request: TC-25 was not refused: expected 200 to be at least 400
- **UNRESOLVED** : Data-Driven Request: expected 29 to deeply equal 28

> Classification and bug conclusions require agent review of the test contract and relevant SUT handler.

## Re-run delta

Baseline: `reports/archive/20260829T080048Z/` — the confounded run of 2026-08-29T07:29Z,
whose fixture failed to obtain an admin token. This run follows the corrected collection
(credentials read from `--env-var`, fail-closed fixture) against a freshly reseeded
database (5 products, 3 categories).

### Suite update

- `tc_id` set unchanged: 56 rows, TC-01..TC-56. None added, removed, or renamed.
- Changed artifacts: `collection.postman_collection.json` (fixture credential handling and
  fail-closed guard), `environment.postman_environment.json` (4 credential variables plus
  `adminLoginStatus`, `customerLoginStatus`, `fixtureError`).

### Status movement

- FIXTURE: FAIL (0 pass / 8 fail) to **PASS** (16 pass / 0 fail). Admin and customer tokens
  both established; no row ran with `Bearer null`.
- Newly passing: TC-51. Newly failing: none. Still failing: TC-02, TC-06, TC-09, TC-10,
  TC-13, TC-14, TC-18, TC-19, TC-24, TC-25, TC-26, TC-27, TC-28, TC-30, TC-43, TC-44.
  Still passing: 39.
- Assertions: 172 total / 18 failed, to 173 total / 16 failed.

## Classification

Unlike the archived run, this one carries a valid admin baseline, so the failures are
attributable. Every `admin_valid` row sent a real admin JWT (verified on the passing rows
whose visible request is the write itself, e.g. TC-03/TC-07/TC-11/TC-15 iterations 2/6/10/14
show `POST /api/products auth=JWT role=admin`).

Note on evidence: for the failing rows the visible item request is the follow-up
verification `GET`; the mutating call is issued through `pm.sendRequest` and therefore does
not appear in `newman-report.json`. The auth conditions below were confirmed by direct
requests against the SUT rather than read out of the report.

**SUT bug candidates (4 root causes).**

- Missing auth/authorization on the write endpoints — TC-25, TC-26, TC-27, TC-28, TC-30,
  TC-43, TC-44. Direct confirmation: `POST /api/products` returned `200` with no token, with
  `Bearer not.a.jwt`, with a customer JWT, and with an admin JWT alike. Tracked as the
  pre-existing BUG-FR15-01 / BUG-FR15-02 / BUG-FR15-03.
- Missing input validation on create and update — TC-02, TC-06, TC-09, TC-10, TC-13, TC-14,
  TC-18, TC-19. All ran with a valid admin JWT, so this is independent of the auth defect.
  Filed as **BUG-FR15-04**.
- `GET /api/products/:id` answering `200 {}` for a missing id — TC-24. Filed as
  **BUG-FR15-05**.

**Observation not filed.** `server.js:162` contains
`if (row.id % 2 === 0) row.price = row.price.toString();`, serializing `price` as a string
for even product ids. No assertion in this suite failed on it, so it is recorded here for
the user's decision rather than filed as a bug.

**Environment/artifact defects.** None in this run. The fixture defect that invalidated the
archived run is fixed and verified by the FIXTURE item passing.
