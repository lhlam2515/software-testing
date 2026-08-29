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
| TC-02 | EC-01 | FAIL | 8 pass / 4 fail | expected 36 to deeply equal 35; expected 36 to deeply equal 35; expected 36 to deeply equal 35; expected 36 to deeply equal 35 |
| TC-03 | EC-02 | PASS | 4 pass / 0 fail |  |
| TC-04 | BVA-01 | PASS | 4 pass / 0 fail |  |
| TC-05 | BVA-02 | PASS | 4 pass / 0 fail |  |
| TC-06 | BVA-03 | FAIL | 8 pass / 4 fail | expected 40 to deeply equal 39; expected 40 to deeply equal 39; expected 40 to deeply equal 39; expected 40 to deeply equal 39 |
| TC-07 | EC-04 | PASS | 4 pass / 0 fail |  |
| TC-08 | EC-05 | PASS | 4 pass / 0 fail |  |
| TC-09 | BVA-04 | FAIL | 8 pass / 4 fail | expected 43 to deeply equal 42; expected 43 to deeply equal 42; expected 43 to deeply equal 42; expected 43 to deeply equal 42 |
| TC-10 | BVA-05 | FAIL | 8 pass / 4 fail | expected 44 to deeply equal 43; expected 44 to deeply equal 43; expected 44 to deeply equal 43; expected 44 to deeply equal 43 |
| TC-11 | BVA-06 | PASS | 4 pass / 0 fail |  |
| TC-12 | EC-07 | PASS | 2 pass / 0 fail |  |
| TC-13 | EC-08 | FAIL | 6 pass / 3 fail | expected 47 to deeply equal 46; expected 47 to deeply equal 46; expected 47 to deeply equal 46 |
| TC-14 | EC-10 | PASS | 2 pass / 0 fail |  |
| TC-15 | EC-11 | PASS | 4 pass / 0 fail |  |
| TC-16 | EC-13 | PASS | 4 pass / 0 fail |  |
| TC-17 | EC-16 | PASS | 4 pass / 0 fail |  |
| TC-18 | BVA-05_PUT_SCOPED | FAIL | 8 pass / 4 fail | expected '{"id":46,"name":"Áo thun mới","price"…' to deeply equal '{"id":46,"name":"Áo thun nam","price"…'; expected '{"id":46,"name":"Áo thun mới","price"…' to deeply equal '{"id":46,"name":"Áo thun nam","price"…'; expected '{"id":46,"name":"Áo thun mới","price"…' to deeply equal '{"id":46,"name":"Áo thun nam","price"…'; expected '{"id":46,"name":"Áo thun mới","price"…' to deeply equal '{"id":46,"name":"Áo thun nam","price"…' |
| TC-19 | EC-08_PUT_SCOPED | FAIL | 6 pass / 3 fail | expected '{"id":46,"name":"Áo thun mới","price"…' to deeply equal '{"id":46,"name":"Áo thun mới","price"…'; expected '{"id":46,"name":"Áo thun mới","price"…' to deeply equal '{"id":46,"name":"Áo thun mới","price"…'; expected '{"id":46,"name":"Áo thun mới","price"…' to deeply equal '{"id":46,"name":"Áo thun mới","price"…' |
| TC-20 | S-01 | PASS | 9 pass / 0 fail |  |
| TC-21 | S-02 | PASS | 15 pass / 0 fail |  |
| TC-22 | S-03 | PASS | 12 pass / 0 fail |  |
| TC-23 | S-04 | PASS | 2 pass / 0 fail |  |
| TC-24 | S-05 | FAIL | 6 pass / 3 fail | expected 200 to be at least 400; expected 200 to be at least 400; expected 200 to be at least 400 |
| TC-25 | SEC-C-01 | FAIL | 8 pass / 4 fail | expected 51 to deeply equal 50; expected 51 to deeply equal 50; expected 51 to deeply equal 50; expected 51 to deeply equal 50 |
| TC-26 | SEC-C-02 | FAIL | 8 pass / 4 fail | expected '{"id":46,"name":"Áo thun nam","price"…' to deeply equal '{"id":46,"name":"Áo thun mới","price"…'; expected '{"id":46,"name":"Áo thun nam","price"…' to deeply equal '{"id":46,"name":"Áo thun mới","price"…'; expected '{"id":46,"name":"Áo thun nam","price"…' to deeply equal '{"id":46,"name":"Áo thun mới","price"…'; expected '{"id":46,"name":"Áo thun nam","price"…' to deeply equal '{"id":46,"name":"Áo thun mới","price"…' |
| TC-27 | SEC-C-03 | FAIL | 6 pass / 3 fail | expected '{}' to deeply equal '{"id":46,"name":"Áo thun nam","price"…'; expected '{}' to deeply equal '{"id":46,"name":"Áo thun nam","price"…'; expected '{}' to deeply equal '{"id":46,"name":"Áo thun nam","price"…' |
| TC-28 | SEC-C-04 | FAIL | 8 pass / 4 fail | expected 51 to deeply equal 50; expected 51 to deeply equal 50; expected 51 to deeply equal 50; expected 51 to deeply equal 50 |
| TC-29 | SEC-C-05 | PASS | 12 pass / 0 fail |  |
| TC-30 | SEC-C-06 | FAIL | 8 pass / 4 fail | expected 52 to deeply equal 51; expected 52 to deeply equal 51; expected 52 to deeply equal 51; expected 52 to deeply equal 51 |
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
| TC-44 | srs.md FR-12 L177,SEC-02 L279 | FAIL | 8 pass / 4 fail | expected 55 to deeply equal 54; expected 55 to deeply equal 54; expected 55 to deeply equal 54; expected 55 to deeply equal 54 |
| TC-45 | SEC-05 L282,api_spec 3.3 L106-107 | PASS | 3 pass / 0 fail |  |
| TC-46 | srs.md FR-14 L186-189,FR-15 L197,api_spec 3.4 L120-125 | PASS | 16 pass / 0 fail |  |
| TC-47 | BVA-06 | PASS | 4 pass / 0 fail |  |
| TC-48a | EC-16,EC-17 | PASS | 12 pass / 0 fail |  |
| TC-48b | EC-16,EC-17 | PASS | 12 pass / 0 fail |  |

## Failure triage

- **UNRESOLVED** : Fixture Setup / Login Admin+Customer, Seed Products A/B/C: expected null to be a string
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 36 to deeply equal 35
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 40 to deeply equal 39
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 43 to deeply equal 42
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 44 to deeply equal 43
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 47 to deeply equal 46
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected '{"id":46,"name":"Áo thun mới","price"…' to deeply equal '{"id":46,"name":"Áo thun nam","price"…'
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected '{"id":46,"name":"Áo thun mới","price"…' to deeply equal '{"id":46,"name":"Áo thun mới","price"…'
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 200 to be at least 400
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 51 to deeply equal 50
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected '{"id":46,"name":"Áo thun nam","price"…' to deeply equal '{"id":46,"name":"Áo thun mới","price"…'
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected '{}' to deeply equal '{"id":46,"name":"Áo thun nam","price"…'
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 51 to deeply equal 50
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 52 to deeply equal 51
- **UNRESOLVED** : Product CRUD / Data-Driven Request: expected 55 to deeply equal 54

> Classification and bug conclusions require agent review of the test contract and relevant SUT handler.
