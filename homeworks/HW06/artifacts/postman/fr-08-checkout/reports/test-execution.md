# FR-08 Test Execution

- Source: `newman-report.json`
- Newman exit: `1`
- Requests: 222/222 passed
- Assertions: 89/95 passed
- Newman failures: 6
- Data note: raw Newman JSON may contain response bodies; review it before sharing.

## Test cases

| Test case | Trace | Result | Assertions | Evidence |
|---|---|---:|---:|---|
| FIXTURE | setup | PASS | 6 pass / 0 fail |  |
| TC-01 | EC-01,EC-07,EC-12 | PASS | 14 pass / 0 fail |  |
| TC-02 | EC-02 | PASS | 14 pass / 0 fail |  |
| TC-03 | EC-03 | PASS | 14 pass / 0 fail |  |
| TC-04 | EC-04 | PASS | 14 pass / 0 fail |  |
| TC-05 | EC-05 | PASS | 14 pass / 0 fail |  |
| TC-06 | EC-06 | PASS | 14 pass / 0 fail |  |
| TC-07 | EC-08 | PASS | 33 pass / 0 fail |  |
| TC-08 | EC-09 | PASS | 14 pass / 0 fail |  |
| TC-09 | EC-10 | PASS | 16 pass / 0 fail |  |
| TC-10 | EC-11 | PASS | 14 pass / 0 fail |  |
| TC-11 | EC-13,SEC-C-01 | PASS | 21 pass / 0 fail |  |
| TC-12 | EC-14,SEC-C-02 | PASS | 21 pass / 0 fail |  |
| TC-13 | EC-02,EC-09 | PASS | 14 pass / 0 fail |  |
| TC-14 | BVA-01 | PASS | 18 pass / 0 fail |  |
| TC-15 | BVA-02 | PASS | 12 pass / 0 fail |  |
| TC-16 | S-01 | FAIL | 8 pass / 4 fail | expected 4 to deeply equal +0; expected 4 to deeply equal +0; expected 4 to deeply equal +0; expected 4 to deeply equal +0 |
| TC-17 | S-02 | PASS | 9 pass / 0 fail |  |
| TC-18 | S-03 | PASS | 9 pass / 0 fail |  |
| TC-19 | S-04 | PASS | 4 pass / 0 fail |  |
| TC-20 | S-05 | PASS | 40 pass / 0 fail |  |
| TC-21 | SEC-C-01 | PASS | 21 pass / 0 fail |  |
| TC-22 | SEC-C-02 | PASS | 21 pass / 0 fail |  |
| TC-23 | SEC-C-03 | PASS | 21 pass / 0 fail |  |
| TC-24 | SEC-C-04 | PASS | 21 pass / 0 fail |  |
| TC-25 | SEC-C-05 | PASS | 40 pass / 0 fail |  |
| TC-26 | SEC-C-06 | PASS | 21 pass / 0 fail |  |
| TC-27 | SEC-C-07 | PASS | 9 pass / 0 fail |  |
| TC-28 | SEC-C-08 | PASS | 9 pass / 0 fail |  |
| TC-29 | SC-01,SC-02,SC-03,SC-05 | PASS | 1 pass / 0 fail |  |
| TC-30 | SC-04 | PASS | 1 pass / 0 fail |  |
| TC-31 | SC-06,SC-07,SC-08 | FAIL | 0 pass / 1 fail | expected 46 to deeply equal 45 |
| TC-32 | SC-09 | PASS | 1 pass / 0 fail |  |
| TC-33 | SC-10 | FAIL | 3 pass / 3 fail | expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i; expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i; expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i |
| TC-34 | SC-11 | FAIL | 3 pass / 3 fail | expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i; expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i; expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i |
| TC-35 | SC-12 | PASS | 1 pass / 0 fail |  |
| TC-36a | EC-14 | PASS | 21 pass / 0 fail |  |
| TC-36b | EC-14 | PASS | 21 pass / 0 fail |  |
| TC-37 | SC-08 | FAIL | 0 pass / 1 fail | order count changed for TC-02: expected 34 to deeply equal 33 |
| TC-38 | FR-08 lines 104-108; FR-11 line 164 | PASS | 1 pass / 0 fail |  |
| TC-39 | FR-11 line 164; FR-07 lines 93-100 | PASS | 1 pass / 0 fail |  |
| TC-40 | SC-04 | PASS | 1 pass / 0 fail |  |
| TC-41 | SC-11 | FAIL | 3 pass / 3 fail | expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i; expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i; expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i |

## Failure triage

- **UNRESOLVED** : Checkout / Data-Driven Request: expected 4 to deeply equal +0
- **UNRESOLVED** : Checkout / Data-Driven Request: expected 46 to deeply equal 45
- **UNRESOLVED** : Checkout / Data-Driven Request: expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i
- **UNRESOLVED** : Checkout / Data-Driven Request: expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i
- **UNRESOLVED** : Checkout / Data-Driven Request: order count changed for TC-02: expected 34 to deeply equal 33
- **UNRESOLVED** : Checkout / Data-Driven Request: expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i

> Classification and bug conclusions require agent review of the test contract and relevant SUT handler.
