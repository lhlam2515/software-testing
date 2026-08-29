# FR-08 Test Execution

- Source: `newman-report.json`
- Newman exit: `1`
- Requests: 250/250 passed
- Assertions: 119/127 passed
- Newman failures: 8
- Data note: raw Newman JSON may contain response bodies; review it before sharing.

## Test cases

| Test case | Trace | Result | Assertions | Evidence |
|---|---|---:|---:|---|
| FIXTURE | setup | PASS | 16 pass / 0 fail |  |
| TC-01 | EC-01, EC-07, EC-12 (cross-ref); `api_specification.md` 4.3 lines 151-161 | PASS | 14 pass / 0 fail |  |
| TC-02 | EC-02 (cross-ref); `api_specification.md` 4.3 lines 156-161 — `shipping_address` appears only as an example value, no constraint or validation rule is stated anywhere, which is the location establishing the silence | PASS | 14 pass / 0 fail |  |
| TC-03 | EC-03 (cross-ref); `api_specification.md` 4.3 lines 156-161 — the body example shows the field present but no source states whether it is required | PASS | 14 pass / 0 fail |  |
| TC-04 | EC-04 (cross-ref); `api_specification.md` 4.3 lines 156-161 — no source states null-handling for `shipping_address` | PASS | 14 pass / 0 fail |  |
| TC-05 | EC-05 (cross-ref); `api_specification.md` 4.3 lines 156-161 — no maximum length for `shipping_address` is stated in any source, so no boundary is asserted | PASS | 14 pass / 0 fail |  |
| TC-06 | EC-06 (cross-ref); `api_specification.md` 4.3 lines 156-161 (string type shown by example) | PASS | 14 pass / 0 fail |  |
| TC-07 | EC-08 (cross-ref); `srs.md` FR-08 line 107; composite with SEC-C-06 | PASS | 33 pass / 0 fail |  |
| TC-08 | EC-09 (cross-ref); `api_specification.md` 4.3 lines 156-161 (field shown in the example, requiredness not stated); `srs.md` FR-08 line 107 (the submitted value is documented as non-authoritative, which is what makes the omission's effect undefined) | PASS | 14 pass / 0 fail |  |
| TC-09 | EC-10 (cross-ref); `srs.md` FR-08 line 107 | PASS | 16 pass / 0 fail |  |
| TC-10 | EC-11 (cross-ref); `api_specification.md` 4.3 lines 156-161 — `total_amount` appears as a JSON number in the example; no source states type-validation behavior | PASS | 14 pass / 0 fail |  |
| TC-11 | EC-13 (cross-ref); `api_specification.md` line 131 (section 4 header requiring `Authorization: Bearer <token>`); `srs.md` FR-08 line 104; composite with SEC-C-01 | PASS | 21 pass / 0 fail |  |
| TC-12 | EC-14 (cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104; composite with SEC-C-02 | PASS | 21 pass / 0 fail |  |
| TC-13 | EC-02, EC-09 (combination, cross-ref); `api_specification.md` 4.3 lines 156-161 | PASS | 14 pass / 0 fail |  |
| TC-14 | BVA-01 (cross-ref); `api_specification.md` 4.1 line 135 and 4.2 line 139 (the only documented cart endpoints); `srs.md` FR-08 lines 102-108 — silent on empty-cart checkout | PASS | 18 pass / 0 fail |  |
| TC-15 | BVA-02 (cross-ref); `srs.md` FR-08 lines 104-108 | PASS | 12 pass / 0 fail |  |
| TC-16 | S-01 (cross-ref); `srs.md` FR-08 lines 104-108, decisively line 108 | FAIL | 8 pass / 4 fail | expected 4 to deeply equal +0; expected 4 to deeply equal +0; expected 4 to deeply equal +0; expected 4 to deeply equal +0 |
| TC-17 | S-02 (cross-ref); `srs.md` FR-08 lines 102-108 (silent on repeat calls); `api_specification.md` 4.4 line 165 | PASS | 9 pass / 0 fail |  |
| TC-18 | S-03 (cross-ref); `srs.md` FR-08 lines 102-108 — silent on checkout against a never-populated cart. FR-07 line 100 is deliberately **not** cited: it governs the empty-cart UI display, not API behavior | PASS | 9 pass / 0 fail |  |
| TC-19 | S-04 (cross-ref); `srs.md` FR-08 lines 102-108 (a single documented transition only) | PASS | 4 pass / 0 fail |  |
| TC-20 | S-05 (cross-ref); `srs.md` FR-11 line 166 (order isolation, documented); `srs.md` FR-08 line 104 (checkout is bound to the logged-in user) | PASS | 40 pass / 0 fail |  |
| TC-21 | SEC-C-01 (cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104 | PASS | 21 pass / 0 fail |  |
| TC-22 | SEC-C-02 (cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104 | PASS | 21 pass / 0 fail |  |
| TC-23 | SEC-C-03 (cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104 | PASS | 21 pass / 0 fail |  |
| TC-24 | SEC-C-04 (cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104; token lifetime undocumented | PASS | 21 pass / 0 fail |  |
| TC-25 | SEC-C-05 (cross-ref); `srs.md` FR-08 line 104 (checkout is bound to the logged-in user); `api_specification.md` 4.3 lines 151-161 (no cart or user identifier is a documented parameter) | PASS | 40 pass / 0 fail |  |
| TC-26 | SEC-C-06 (cross-ref); `srs.md` FR-08 line 107; composite with EC-08 (TC-07) and SC-04 (TC-30) | PASS | 21 pass / 0 fail |  |
| TC-27 | SEC-C-07 (cross-ref); `srs.md` line 282 (SEC-05) | PASS | 9 pass / 0 fail |  |
| TC-28 | SEC-C-08 (cross-ref); `srs.md` line 282 (SEC-05) | PASS | 9 pass / 0 fail |  |
| TC-29 | SC-01, SC-02, SC-03, SC-05 (cross-ref); `api_specification.md` 4.3 lines 151-161 (no response example given); `srs.md` FR-10 lines 141-156 | PASS | 1 pass / 0 fail |  |
| TC-30 | SC-04 (cross-ref); `srs.md` FR-08 line 107 | PASS | 1 pass / 0 fail |  |
| TC-31 | SC-06, SC-07, SC-08 (cross-ref); `srs.md` FR-08 line 108 (cart clearing documented as a success side effect only); FR-08 lines 102-108 silent on empty-cart handling | FAIL | 0 pass / 1 fail | expected 72 to deeply equal 71 |
| TC-32 | SC-09 (cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104 (only a logged-in user may check out — an order created here would contradict it); `srs.md` FR-08 line 108 (clearing documented for success only) | PASS | 1 pass / 0 fail |  |
| TC-33 | SC-10 (cross-ref); `api_specification.md` 4.3 lines 151-161 — silent on malformed-body handling | FAIL | 3 pass / 3 fail | expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i; expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i; expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i |
| TC-34 | SC-11 (cross-ref); `api_specification.md` 4.3 lines 151-161 (silent) | FAIL | 3 pass / 3 fail | expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i; expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i; expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i |
| TC-35 | SC-12 (cross-ref); `api_specification.md` 4.3 lines 151-161 (no response documented anywhere for this endpoint) | PASS | 1 pass / 0 fail |  |
| TC-36a | P-14 (EC-14 "wrong-scheme value" sub-variant, cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104 | PASS | 21 pass / 0 fail |  |
| TC-36b | P-14 (EC-14 "wrong-scheme value" sub-variant, cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104 | PASS | 21 pass / 0 fail |  |
| TC-37 | SC-08 (cross-ref); `srs.md` FR-08 line 108 (clearing documented for success only); FR-08 lines 102-108 silent on field validation; `api_specification.md` 4.4 line 165 and 4.1 line 135 | FAIL | 0 pass / 1 fail | order count changed for TC-02: expected 60 to deeply equal 59 |
| TC-38 | `api_specification.md` 4.4 lines 163-165; `srs.md` FR-08 lines 104-108; FR-11 lines 164-166 | PASS | 3 pass / 0 fail |  |
| TC-39 | `srs.md` FR-11 line 166; `srs.md` FR-08 line 104; `api_specification.md` 4.4 line 165 | PASS | 3 pass / 0 fail |  |
| TC-40 | `srs.md` FR-08 line 107 (recompute rule, unconditional on the submitted value's class); same basis as TC-30 | PASS | 1 pass / 0 fail |  |
| TC-41 | SC-11 (cross-ref); `api_specification.md` 4.3 lines 151-161 — the body is documented as JSON by example only, and no source states how an incorrect `Content-Type` value is handled | FAIL | 6 pass / 3 fail | expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i; expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i; expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i |
| TC-42a | `srs.md` FR-09 line 112, lines 124-126, line 132; `api_specification.md` 5.1 lines 182-192; 4.3 lines 156-161 (no coupon field documented); `srs.md` FR-08 line 107 | FAIL | 12 pass / 6 fail | expected -4500000 to deeply equal 50000; expected -4500000 to deeply equal 50000; expected -4500000 to deeply equal 50000; expected -4500000 to deeply equal 50000; expected -4500000 to deeply equal 50000; expected -4500000 to deeply equal 50000 |
| TC-42b | `srs.md` FR-09 line 112, lines 124-126, line 132; `api_specification.md` 5.1 lines 182-192; 4.3 lines 156-161 (no coupon field documented); `srs.md` FR-08 line 107 | PASS | 9 pass / 0 fail |  |
| TC-43 | `srs.md` FR-09 line 112, C2 line 117, sample-coupon table line 135; `api_specification.md` 5.1 lines 182-192 | PASS | 9 pass / 0 fail |  |
| TC-44 | `srs.md` FR-09 C5 line 120, sample-coupon table line 132; `api_specification.md` 5.1 lines 182-192 | PASS | 6 pass / 0 fail |  |
| TC-45 | `srs.md` FR-11 line 166; `api_specification.md` 4.5 line 169; `specs/security-requirement.md` SEC-02-extended(a) | FAIL | 6 pass / 2 fail | expected '77' to not deeply equal '77'; expected '77' to not deeply equal '77' |
| TC-46 | `srs.md` FR-10 lines 141-156; `srs.md` FR-08 lines 104-108; `api_specification.md` 4.5 line 169 | PASS | 3 pass / 0 fail |  |
| TC-47a | `api_specification.md` 4.2 lines 139-149 (`price` is a client-supplied field); 3.2 line 101; `srs.md` FR-08 line 105 and line 107 | PASS | 24 pass / 0 fail |  |
| TC-47b | `api_specification.md` 4.2 lines 139-149 (`price` is a client-supplied field); 3.2 line 101; `srs.md` FR-08 line 105 and line 107 | PASS | 9 pass / 0 fail |  |

## Failure triage

- **UNRESOLVED** : Data-Driven Request: expected 4 to deeply equal +0
- **UNRESOLVED** : Data-Driven Request: expected 72 to deeply equal 71
- **UNRESOLVED** : Data-Driven Request: expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i
- **UNRESOLVED** : Data-Driven Request: expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i
- **UNRESOLVED** : Data-Driven Request: order count changed for TC-02: expected 60 to deeply equal 59
- **UNRESOLVED** : Data-Driven Request: expected '<!DOCTYPE html>\n<html lang="en">\n<h…' not to match /<html/i
- **UNRESOLVED** : Data-Driven Request: expected -4500000 to deeply equal 50000
- **UNRESOLVED** : Data-Driven Request: expected '77' to not deeply equal '77'

> Classification and bug conclusions require agent review of the test contract and relevant SUT handler.

## Re-run delta

Baseline: `reports/archive/20260829T042700Z/` (previous run, Newman exit `1`, 89/95 assertions, 6 failures).
Trigger: `test-data.csv`, `collection.postman_collection.json`, and `environment.postman_environment.json`
were rebuilt after the baseline report was written.

### Test case set

- Added (8): TC-42a, TC-42b, TC-43, TC-44, TC-45, TC-46, TC-47a, TC-47b
- Removed: none
- Renamed: none

### Result movement

- Newly failing: none
- Newly passing: none
- Still failing (6): TC-16, TC-31, TC-33, TC-34, TC-37, TC-41
- Still passing (37): FIXTURE, TC-01 to TC-15, TC-17 to TC-30, TC-32, TC-35, TC-36a, TC-36b, TC-38, TC-39, TC-40
- Failing among newly added cases (2): TC-42a, TC-42b is passing; TC-45 fails

The failure count moved from 6 to 8 entirely because the suite update added two failing
cases (TC-42a, TC-45). No pre-existing case changed result.
