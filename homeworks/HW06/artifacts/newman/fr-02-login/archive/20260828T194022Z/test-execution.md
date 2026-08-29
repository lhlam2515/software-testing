# FR-02 Test Execution

- Source: `newman-report.json`
- Newman exit: `1`
- Requests: 65/65 passed
- Assertions: 185/207 passed
- Newman failures: 22
- Data note: raw Newman JSON may contain response bodies; review it before sharing.

## Test cases

| Test case | Trace | Result | Assertions | Evidence |
|---|---|---:|---:|---|
| TC-01 | EC-01,EC-08,TR-04,SC-01..07 | FAIL | 4 pass / 1 fail | expected '{"message":"login successful","token"…' to not include '"password"' |
| TC-02 | EC-02 | PASS | 5 pass / 0 fail |  |
| TC-03 | EC-03 | PASS | 5 pass / 0 fail |  |
| TC-04 | EC-04 | PASS | 5 pass / 0 fail |  |
| TC-05 | EC-05 | PASS | 5 pass / 0 fail |  |
| TC-06 | EC-06 | PASS | 5 pass / 0 fail |  |
| TC-07 | EC-07 | FAIL | 4 pass / 1 fail | expected '{"message":"login successful","token"…' to not include '"password"' |
| TC-08 | EC-09,TR-01 | PASS | 5 pass / 0 fail |  |
| TC-09 | EC-10 | PASS | 5 pass / 0 fail |  |
| TC-10 | EC-11 | PASS | 5 pass / 0 fail |  |
| TC-11 | EC-12 | PASS | 5 pass / 0 fail |  |
| TC-12 | EC-05,EC-10 | PASS | 5 pass / 0 fail |  |
| TC-13 | BVA-01 | PASS | 20 pass / 0 fail |  |
| TC-14 | BVA-02 | PASS | 20 pass / 0 fail |  |
| TC-15 | BVA-03,TR-09 | FAIL | 12 pass / 8 fail | expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true |
| TC-16 | TR-01,TR-02,TR-03 | PASS | 9 pass / 0 fail |  |
| TC-17 | TR-07 | PASS | 5 pass / 0 fail |  |
| TC-18 | TR-08,SEC-C-05 | PASS | 5 pass / 0 fail |  |
| TC-19 | TR-05 | FAIL | 3 pass / 3 fail | expected 403 to deeply equal 200; expected 403 to deeply equal 200; expected 403 to deeply equal 200 |
| TC-20 | TR-03,TR-09 | PASS | 9 pass / 0 fail |  |
| TC-21 | SEC-C-01 | FAIL | 3 pass / 2 fail | expected 403 to deeply equal 200; expected false to be true |
| TC-22 | SEC-C-02 | PASS | 5 pass / 0 fail |  |
| TC-23 | SEC-C-03 | FAIL | 3 pass / 2 fail | expected 403 to deeply equal 200; expected false to be true |
| TC-24 | SEC-C-04 | PASS | 5 pass / 0 fail |  |
| TC-25 | SEC-C-06 | PASS | 5 pass / 0 fail |  |
| TC-26 | SEC-C-07 | PASS | 5 pass / 0 fail |  |
| TC-27 | SEC-C-08 | PASS | 5 pass / 0 fail |  |
| TC-28 | SC-08 | FAIL | 5 pass / 1 fail | expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i |
| TC-29 | SC-09 | FAIL | 5 pass / 1 fail | expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i |
| TC-30 | SC-10 | FAIL | 5 pass / 1 fail | expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i |
| TC-31 | SC-11 | FAIL | 5 pass / 1 fail | expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i |
| TC-32 | SC-12 | PASS | 5 pass / 0 fail |  |
| TC-33 | SC-13 | PASS | 5 pass / 0 fail |  |
| TC-34 | SC-14 | FAIL | 4 pass / 1 fail | expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i |
| TC-35 | SC-15 | FAIL | 4 pass / 1 fail | expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i |
| TC-36 | TR-06 | FAIL | 9 pass / 6 fail | expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true |
| TC-37 | SEC-01 (admin variant) | FAIL | 4 pass / 1 fail | expected '{"message":"login successful","token"…' to not include '"password"' |
| TC-38a | srs.md FR-02 line 43 | FAIL | 3 pass / 2 fail | expected 403 to deeply equal 200; expected false to be true |
| TC-38b | srs.md FR-02 line 43; api_specification.md section 2.1 | FAIL | 5 pass / 1 fail | expected 401 to not be one of [ 401, 403 ] |
| TC-39 | srs.md FR-02 line 42 (per-account scope) | FAIL | 16 pass / 4 fail | expected '{"message":"login successful","token"…' to not include '"password"'; expected '{"message":"login successful","token"…' to not include '"password"'; expected '{"message":"login successful","token"…' to not include '"password"'; expected '{"message":"login successful","token"…' to not include '"password"' |
| TC-40 | srs.md FR-02 lines 41-42 (concurrency) | PASS | 16 pass / 0 fail |  |
| TC-41 | SC-12/SC-13 pattern (schema-cases.md) | PASS | 5 pass / 0 fail |  |

## Failure triage

- **UNRESOLVED** : Login / Data-Driven Request: expected '{"message":"login successful","token"…' to not include '"password"'
- **UNRESOLVED** : Login / Data-Driven Request: expected '{"message":"login successful","token"…' to not include '"password"'
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected false to be true
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected false to be true
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected false to be true
- **UNRESOLVED** : Login / Data-Driven Request: expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i
- **UNRESOLVED** : Login / Data-Driven Request: expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i
- **UNRESOLVED** : Login / Data-Driven Request: expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i
- **UNRESOLVED** : Login / Data-Driven Request: expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i
- **UNRESOLVED** : Login / Data-Driven Request: expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i
- **UNRESOLVED** : Login / Data-Driven Request: expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected false to be true
- **UNRESOLVED** : Login / Data-Driven Request: expected '{"message":"login successful","token"…' to not include '"password"'
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected false to be true
- **UNRESOLVED** : Login / Data-Driven Request: expected 401 to not be one of [ 401, 403 ]
- **UNRESOLVED** : Login / Data-Driven Request: expected '{"message":"login successful","token"…' to not include '"password"'

> Classification and bug conclusions require agent review of the test contract and relevant SUT handler.
