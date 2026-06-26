---
title: "HW02 — Domain Testing on EShop"
assignment: HW02-AI
course: CS423 / CSC13003 – Software Testing
policy: "Adapted from Med Kharbach, PhD (2026) — AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0."
---

Faculty of Information Technology (FIT) – Ho Chi Minh City University of Science (HCMUS)  
CS423 / CSC13003 – Software Testing (AI-augmented · 2026)

# Main Report — HW02

---

## 1. Student Information

| Field                   | Value                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                                                                              |
| Student ID:             | 23127216                                                                                  |
| Class / Cohort:         | 23KTPM1                                                                                   |
| Assignment ID:          | HW#02                                                                                     |
| Assignment date:        | 22/06/2026                                                                                |
| AI tool(s) used:        | Claude Code                                                                               |
| AI Disclosure Form:     | [[AI-03] AI Disclosure Form — HW02]([AI-03]_AI_Disclosure_Form.md)                       |
| GitHub Repository:      | [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing)   |

---

## 2. Feature A - FR-02: Login and Account Lockout

> **Technique:** Domain Testing (Equivalence Partitioning) + Boundary Value Analysis
> **Artifacts:** [`artifacts/tests/FR-02-login-lockout/`](artifacts/tests/FR-02-login-lockout/)

### 2.1 Domain Testing

#### Step 1 - Identify Input/Output Variables

FR-02 controls two core behaviors: authenticate email and password and return a JWT
token on success; and lock the account for 30 seconds after 3 consecutive failures.
Seven variables were identified across three types: two user inputs (`email`,
`password`), three server-side system states (`login_attempts`, `account_locked`,
`locked_until`), and two outputs (`jwt_token`, `error_message`).

The most complex variables are `login_attempts` (the primary state driver, an INTEGER
column that triggers lockout at 3) and `locked_until` (a DATETIME column set
server-side and checked against `datetime('now')` on every request). Four implicit
gaps were flagged where the SRS is silent: whether `login_attempts` resets after the
lock expires (G1), whether the counter increments while the account is locked (G2),
whether lockout scope is per-account or per-IP (G3), and whether any length limit
exists for email or password at login (G4).

Full variable table: [`domain-testing.md` - Step 1](artifacts/tests/FR-02-login-lockout/domain-testing.md)

#### Step 2 - Identify Equivalence Classes

Equivalence partitioning was applied across 8 functional groups using Range Rule,
Must-Be Rule, and Splitting Rule, producing 21 ECs total (9 valid, 12 invalid).

Key design decisions:

**Splitting Rule on `email`:** EC01 (empty string) and EC02 (non-empty but invalid
format) are separate classes because they test two distinct mechanisms: a missing
`required` attribute versus HTML5 `type="email"` format validation. These mechanisms
can fail independently, so collapsing them into one class would mask one defect with
the other.

**EC10 and EC12 coupling:** `login_attempts >= 3` (EC10) and `locked_until >
datetime('now')` (EC12) cannot be triggered independently in practice. They always
coexist when an account is locked. Both are assigned to TC-07 as a composite system
state; this is not a violation of Error Isolation because the coupling is a physical
constraint of the SUT, not a test design choice.

**Output-space invalid ECs (EC14, EC16, EC19, EC21):** These describe behaviors the
system must NOT exhibit (counter increments by != 1, counter does not reset, JWT
returned on failure, error reveals the specific reason). They cannot be triggered by
the tester; they are verified absent within existing TCs. Error Isolation applies to
the input domain, not the output domain.

| Group | Variable | Valid | Invalid | Total |
| ----- | -------- | ----- | ------- | ----- |
| 1 | `email` - Format | EC03 | EC01, EC02 | 3 |
| 2 | `email` - Existence | EC05 | EC04 | 2 |
| 3 | `password` - Match | EC08 | EC06, EC07 | 3 |
| 4 | `login_attempts` - Threshold | EC09 | EC10 | 2 |
| 5 | `locked_until` - Window | EC11 | EC12 | 2 |
| 6 | Counter behavior | EC13, EC15 | EC14, EC16 | 4 |
| 7 | `jwt_token` - Output | EC17, EC18 | EC19 | 3 |
| 8 | `error_message` - Content | EC20 | EC21 | 2 |
| **Total** | | **9 Valid** | **12 Invalid** | **21** |

Full EC table: [`domain-testing.md` - Step 2](artifacts/tests/FR-02-login-lockout/domain-testing.md)

#### Step 3 - Minimum Test Case Set

7 test cases were derived using Error Isolation: 1 happy-path TC combining all 7
valid ECs, plus 6 negative TCs each isolating one triggerable invalid EC group.

TC-01 sets `login_attempts = 1` as a pre-condition (not 0) so it simultaneously
verifies EC09 (counter below threshold) and EC15 (counter resets to 0 on success)
within a single execution, without needing a separate TC for the reset check.

TC-07 covers the coupled EC10 and EC12 composite state using correct credentials as
input. This is intentional: submitting correct credentials while locked proves that
the lockout mechanism overrides authentication, which is the core behavioral invariant
of FR-02.

| TC | ECs Covered | Input | Pre-condition | Expected Result |
| -- | ----------- | ----- | ------------- | --------------- |
| TC-01 | EC03,05,08,09,11,15,17 | test@eshop.com / Test1234! | login_attempts=1 | 200 OK, JWT returned, counter reset to 0 |
| TC-02 | EC01 | email="" | none | No request sent, HTML5 required blocks |
| TC-03 | EC02 | email="invalid_no_at_sign" | none | HTML5 type="email" blocks (or 401 if field is type="text") |
| TC-04 | EC04 | notfound@example.com / Test1234! | none | 401, generic error, no JWT |
| TC-05 | EC06 | test@eshop.com / "" | login_attempts=0 | 401 or client block, no JWT |
| TC-06 | EC07, EC13 | test@eshop.com / WrongPass1! | login_attempts=0 | 401, generic error, counter 0 to 1 exactly |
| TC-07 | EC10, EC12 | test@eshop.com / Test1234! | login_attempts=3, locked_until=NOW+25s | 403, rejected despite correct credentials |

Full TC specifications: [`domain-testing.md` - Step 3](artifacts/tests/FR-02-login-lockout/domain-testing.md)

### 2.2 Boundary Value Analysis

Two numeric variables were identified for BVA enhancement based on their role in
triggering discrete behavioral transitions.

**`login_attempts` at lock threshold = 3.** The SRS states "3 or more consecutive
failures." The critical boundary is the transition from the last non-locked state
(login_attempts = 2, the OFF point) to the first locked state (login_attempts = 3,
the ON point). A potential off-by-one defect would implement `> 3` instead of `>= 3`,
delaying the lockout by one attempt.

**`locked_until` at the 30-second lockout window.** The expiry condition is
`locked_until <= datetime('now')`. Three boundary points are tested: UB-1 (NOW+1s, 1
second remaining, account must still be rejected), UB (NOW, exact expiry, account
must be allowed), and UB+1 (NOW-1s, 1 second past expiry, account must be allowed).
A potential defect would use strict less-than `locked_until < datetime('now')`,
keeping the account locked at the exact expiry boundary.

| TC | Variable | Boundary Point | Defect Targeted |
| -- | -------- | -------------- | --------------- |
| TC-BVA-01 | `login_attempts` | 2 to 3 (ON point transition) | `> 3` instead of `>= 3`, lock delayed by one attempt |
| TC-BVA-02 | `login_attempts` | UB=2, success path | Counter not reset at UB, next failure miscounted as third |
| TC-BVA-03 | `locked_until` | NOW+1s (UB-1) | Unlock before `locked_until`, early release |
| TC-BVA-04 | `locked_until` | NOW (UB / OFF point) | `< NOW` instead of `<= NOW`, locked at exact boundary |
| TC-BVA-05 | `locked_until` | NOW-1s (UB+1) | Post-expiry race condition or timer drift |

Full BVA specifications and DB setup protocol: [`bva.md`](artifacts/tests/FR-02-login-lockout/bva.md)

### 2.3 AI Gap Analysis

| # | Missed item | Root cause (why AI missed it) |
| - | ----------- | ----------------------------- |
| 1 | Missed TC: No test case asserting that HTTP 401 (wrong credentials) and HTTP 403 (account locked) are two distinct observable behavioral states. AI collapsed both into a single EC20 ("generic error, reason not revealed") covering all failure modes. | Spec quality: SRS FR-02 describes both failure outputs with identical language ("appropriate error message, no reason revealed"). AI had no oracle support to partition EC20 further. The distinction was discovered during execution when TC-07 returned 403 and TC-04/TC-06 returned 401, with the same UI message but different server codes. |
| 2 | Missed bug (D7): No TC to verify that the login response body does not expose the `password` field. The server returned `user.password` in plaintext in the JSON response. | AI tool limitation: AI assumed spec-compliant hash storage ("matches stored hash" in Step 1 analysis). Black-box design from SRS provides no signal to suspect data exposure in the response body. Discovered only by inspecting the raw API response during execution. |

### 2.4 Execution Summary

| Metric | Count |
| ------ | ----- |
| TC Designed (EP) | 7 |
| TC Designed (BVA) | 5 |
| TC Executed | 12 / 12 |
| Passed | 10 |
| Pass with deviation | 1 (TC-02: blocked by `required`, not `type="email"`) |
| Failed | 1 (TC-06, BUG-02-003) |
| Bugs found | 4 (BUG-02-001 to BUG-02-004) |

Full execution log: [`execution-log.md`](artifacts/tests/FR-02-login-lockout/execution-log.md)

---

## 3. Feature B - FR-09: Discount Coupons

> **Technique applied:** Domain Testing (Equivalence Partitioning) + Boundary Value Analysis
> **Detailed test cases:** [`artifacts/tests/FR-09-coupon/`](artifacts/tests/FR-09-coupon/)

### 3.1 Domain Testing

#### Step 1 - Identify Input/Output Variables

FR-09 governs coupon application at checkout, enforcing five simultaneous conditions (C1 through C5): the code exists and is active, has not expired, the order total meets the minimum threshold, the user holds a valid JWT, and the user has not exhausted their per-user usage allowance. Twelve variables were identified across three categories: three user-supplied inputs (`code`, `total_amount`, `user_id`), seven system-state fields retrieved from the database (`is_active`, `expired_at`, `min_order_amount`, `uses_by_user`, `max_uses_per_user`, `type`, `discount_value`), and two output signals (`discount_amount`, `final_amount`). Five implicit gaps were flagged where the SRS is silent: whether coupon code matching is case-sensitive (G1), a spec conflict between FR-08 (backend must recompute the order total independently) and the `apply-coupon` API accepting a client-supplied `total_amount` (G2), undefined behavior when a fixed `discount_value` exceeds `total_amount` and produces a negative `final_amount` (G3), no specification of whether usage is rolled back when an order is cancelled (G4), and ambiguous granularity for `expired_at` comparisons with no timezone specified (G5).

Full variable table: [`domain-testing.md` - Step 1](artifacts/tests/FR-09-coupon/domain-testing.md)

#### Step 2 - Identify Equivalence Classes

Equivalence partitioning was applied across eight functional groups using three rules, producing 18 ECs total (8 valid, 10 invalid).

**Must-Be Rule for C1, C2, and C4.** Code existence and active status, expiry, and authentication are binary gates with no numeric range to partition. Each condition either holds or fails outright, yielding one valid class and one or two invalid classes per group. Range Rule does not apply because there is no continuum.

**Range Rule for C3 and C5.** Both conditions use numeric comparisons: `total_amount >= min_order_amount` and `uses_by_user < max_uses_per_user`. Each produces exactly two classes: the region where the condition holds and the region where it fails. These two groups are the primary BVA targets in section 3.2.

**Splitting Rule for `type`.** The `percent` and `fixed` types trigger entirely different formula paths (`discount = total * value / 100` vs. `discount = value`). Although both are syntactically valid inputs, their behavioral outputs differ completely. Collapsing them into one valid EC would execute only one formula path and leave the other untested.

**Gap-driven ECs (EC04 and EC18).** EC04 (wrong-case code input) and EC18 (negative `final_amount` when fixed discount exceeds total) cannot be derived from SRS text alone. They are labeled gap tests to distinguish them from spec-derived ECs and are assigned dedicated TCs to discover actual system behavior rather than verify a known expected outcome.

| Group | Variable / Condition | Valid ECs | Invalid ECs | Total |
| ----- | -------------------- | --------- | ----------- | ----- |
| 1 | `code` exists + `is_active=1` (C1, Must-Be) | EC01 | EC02, EC03 | 3 |
| 2 | `code` case format (Gap G1) | none | EC04 | 1 |
| 3 | `expired_at` not expired (C2, Must-Be) | EC05 | EC06 | 2 |
| 4 | `total_amount >= min_order_amount` (C3, Range) | EC07 | EC08 | 2 |
| 5 | JWT Token valid (C4, Must-Be) | EC09 | EC10, EC11 | 3 |
| 6 | `uses_by_user < max_uses_per_user` (C5, Range) | EC12 | EC13 | 2 |
| 7 | `type` discount formula (Splitting) | EC14, EC15 | none | 2 |
| 8 | Output correctness | EC16 | EC17, EC18 | 3 |
| **Total** | | **8 Valid** | **10 Invalid** | **18** |

Full EC table: [`domain-testing.md` - Step 2](artifacts/tests/FR-09-coupon/domain-testing.md)

#### Step 3 - Minimum Test Case Set

Eleven test cases were derived using Error Isolation: two happy-path TCs covering all valid ECs, eight negative TCs each isolating one triggerable invalid EC, and one dedicated gap test.

TC-01 and TC-02 both represent valid-all-five-conditions scenarios but must be separate because the Splitting Rule requires one TC per `type` value. TC-01 uses `SAVE10` (`type=percent`) and TC-02 uses `BIGBUY` (`type=fixed`). Collapsing them into one TC would execute only one formula path and leave EC14 or EC15 uncovered. TC-11 is a dedicated gap test for EC18: it uses a coupon where `discount_value > total_amount` and records whether the system returns a negative `final_amount` or guards against it, since the SRS specifies no behavior for this case.

| TC | ECs Covered | Input `code` | `total_amount` | Expected Result |
| -- | ----------- | ------------ | -------------- | --------------- |
| TC-01 | EC01,05,07,09,12,14,16 | SAVE10 | 500,000 VND | 200 OK, discount_amount=50,000, final_amount=450,000 |
| TC-02 | EC01,05,07,09,12,15,16 | BIGBUY | 600,000 VND | 200 OK, discount_amount=50,000, final_amount=550,000 |
| TC-03 | EC02,17 | NOTEXIST99 | 500,000 VND | 4xx, code not found |
| TC-04 | EC03,17 | DEAD01 (is_active=0) | 500,000 VND | 4xx, code inactive |
| TC-05 | EC04,17 | save10 (wrong case) | 500,000 VND | gap probe: 4xx expected if system is case-sensitive |
| TC-06 | EC06,17 | EXPIRED | 200,000 VND | 4xx, coupon expired |
| TC-07 | EC08,17 | SAVE10 | 200,000 VND | 4xx, below minimum 300,000 VND |
| TC-08 | EC10,17 | SAVE10 | 500,000 VND | 401, no Authorization header |
| TC-09 | EC11,17 | SAVE10 | 500,000 VND | 401, invalid JWT |
| TC-10 | EC13,17 | SAVE10 (uses=1, max=1) | 500,000 VND | 4xx, usage limit reached |
| TC-11 | EC18 | GAPTEST1 (fixed=100k, min=50k) | 60,000 VND | gap probe: negative final_amount or 4xx |
| TC-12 | EC07 (zero path) | ZERO01 (percent=10%, min=0) | 0 VND | gap probe: zero-amount degenerate — C3 passes (0≥0), discover system behavior |

Full TC specifications: [`domain-testing.md` - Step 3](artifacts/tests/FR-09-coupon/domain-testing.md)

### 3.2 Boundary Value Analysis

Three numeric variables were identified for BVA enhancement based on their role in triggering discrete behavioral transitions under Range Rule and strict-comparison conditions.

**`total_amount` vs. `min_order_amount` (C3, `>=` condition).** The spec requires `total_amount >= min_order_amount`. Using `SAVE10` (min=300,000 VND), three boundary points are tested: UB-1 at 299,999 VND (must be rejected), ON point at 300,000 VND (must be accepted per `>=`), and UB+1 at 300,001 VND (confirming the valid range starts exactly at min_order). A potential off-by-one defect would implement `total_amount > min_order_amount` (strict greater-than), causing TC-BVA-02 to fail: an order at exactly 300,000 VND would be incorrectly rejected despite satisfying the spec condition.

**`uses_by_user` vs. `max_uses_per_user` (C5, `<` condition).** The condition is `uses_by_user < max_uses_per_user`. Two coupons are tested: `SAVE10` (max=1) and `VIP100` (max=2). Using both max values rules out any hardcoded comparison logic. UB-1 is the last valid use (uses=1, max=2: the second use with VIP100 must be accepted). UB is the transition point where `uses < max` first becomes false (uses=max=1 for SAVE10, uses=max=2 for VIP100: both must be rejected). A potential defect would use `uses <= max`, incorrectly accepting a request when `uses` already equals `max`.

**`expired_at` vs. `current_date` (C2, strict `<` condition).** The SRS states "current date must be before `expired_at`" (strict less-than). The ON point is today's date set as `expired_at`: `today < today` evaluates to FALSE, so the coupon must be rejected. UB+1 is tomorrow's date: `today < tomorrow` is TRUE and the coupon must be accepted. A potential defect would use `current_date <= expired_at`, incorrectly accepting a coupon that expires today.

String conditions (code format and case sensitivity) are not BVA targets as they are not numeric ranges and are already covered by EC04 in the gap test group.

| TC | Variable | Boundary Point | State | Defect Targeted |
| -- | -------- | -------------- | ----- | --------------- |
| TC-BVA-01 | `total_amount` | UB-1 = 299,999 VND | Invalid | `>= min_order - 1` instead of `>= min_order`, off-by-one accepting sub-threshold orders |
| TC-BVA-02 | `total_amount` | ON = 300,000 VND | Valid | `total > min_order` instead of `total >= min_order`, ON point incorrectly rejected |
| TC-BVA-03 | `total_amount` | UB+1 = 300,001 VND | Valid | Confirms valid range starts at 300,000, not 300,001 |
| TC-BVA-04 | `uses_by_user` | UB-1: uses=1, max=2 | Valid | `uses < max - 1` instead of `uses < max`, last valid use incorrectly rejected |
| TC-BVA-05 | `uses_by_user` | UB: uses=1, max=1 | Invalid | `uses <= max` instead of `uses < max`, allows exceeding limit when max=1 |
| TC-BVA-06 | `uses_by_user` | UB: uses=2, max=2 | Invalid | Same defect as TC-BVA-05 at max=2, rules out hardcoded max=1 logic |
| TC-BVA-07 | `expired_at` | ON = today | Invalid | `current_date <= expired_at` instead of `<`, coupon expiring today incorrectly accepted |
| TC-BVA-08 | `expired_at` | UB+1 = tomorrow | Valid | Confirms tomorrow is still valid; catches reverse off-by-one |

Full BVA specifications and DB setup protocol: [`bva.md`](artifacts/tests/FR-09-coupon/bva.md)

### 3.3 AI Gap Analysis

| # | Missed item | Root cause (why AI missed it) |
| - | ----------- | ----------------------------- |
| 1 | Missed TC: No test case probes concurrent coupon application by the same user. Two simultaneous requests for the same coupon could both pass the C5 check (`uses < max`) before either increments the usage counter, resulting in double usage when `max_uses_per_user=1`. | Technique limitation: Domain Testing and BVA are inherently sequential techniques. Each TC assumes a stable, single-user system state. The `domain-testing` skill designs one TC per EC and has no mechanism to model concurrent state transitions. Concurrency testing is a separate dimension (load and stress testing) that falls outside the Domain Testing methodology scope. |
| 2 | Missed TC: No test case covers the degenerate combination where `total_amount=0` and `min_order_amount=0`. FR-17 explicitly allows `min_order_amount >= 0`, so C3 should pass (0 >= 0), but the system rejected the request. TC-12 was added after human review and executed: result was HTTP 400 with error "Đơn hàng chưa đủ giá trị tối thiểu 0 ₫ để áp dụng mã này" — confirming BUG-09-005 (strict `>` instead of `>=`) in a degenerate state where the error message is logically absurd ("minimum 0₫ not met" is impossible for a user to satisfy). | Reasoning gap at EC composition: the AI noted the `min_order_amount >= 0` constraint in the Step 1 variable table but applied single-variable analysis. EC07 (`total_amount >= min_order_amount`) was derived without enumerating the degenerate case where both values are zero. The AI identified the range rule correctly but stopped short of exhausting the edge cases that the rule creates when combined with boundary-valid inputs from a different variable. TC-12 serves as a concrete artifact demonstrating this gap: it was not generated by the AI tool, and its execution revealed a qualitatively distinct bug manifestation (absurd error message on a zero-minimum coupon) that the original 11-TC suite did not surface. |
| 3 | Missed TC: No test case sends a deliberately manipulated `total_amount` (inflated above the actual cart value) to verify whether the backend recomputes the total independently per FR-08 or trusts the client-supplied value. If the backend uses the client value, a user can bypass C3 by sending `total_amount` equal to `min_order_amount` regardless of actual cart contents. | Scope limitation of the `domain-testing` skill: the skill documented this conflict as an Implicit Gap in Step 1 but its workflow covers TC design from spec conditions (EP/BVA from the SRS), not adversarial input probes. Security testing requires intentionally invalid inputs designed to exploit trust boundaries, which is outside the EP methodology. The skill correctly flagged the risk but had no workflow step to convert a noted concern into an attack-scenario TC. |

### 3.4 Execution Summary

| Metric | Count |
| ------ | ----- |
| TC Designed (EP) | 12 |
| TC Designed (BVA) | 8 |
| TC Executed | 20 / 20 |
| Passed | 12 |
| Pass with deviation | 2 (TC-BVA-03, TC-BVA-08: boundary acceptance correct, output values wrong due to BUG-09-001) |
| Failed | 6 (TC-01, TC-08, TC-09, TC-11, TC-12, TC-BVA-02) |
| Bugs found | 5 (BUG-09-001 to BUG-09-005) |

Full execution log: [`execution-log.md`](artifacts/tests/FR-09-coupon/execution-log.md)

---

## 4. Feature C — FR-16: Import Sản phẩm từ CSV

> **Technique applied:** Domain Testing (Equivalence Partitioning) + Boundary Value Analysis  
> **Detailed test cases:** [`artifacts/tests/FR-16-csv-import/`](artifacts/tests/FR-16-csv-import/)  
> **Test data files:** [`artifacts/tests/FR-16-csv-import/test-data/`](artifacts/tests/FR-16-csv-import/test-data/)

### 4.1 Domain Testing — Step-by-Step Application

#### Step 1: Identify Input & Output Variables

_Based on `docs/eshop-sut/srs.md` §6 FR-16 — atomic transaction, RFC 4180._

| Variable | Type | Description |
| -------- | ---- | ----------- |
| `file_extension` | Input | Đuôi file upload |
| `file_header` | Input | Dòng header CSV |
| `row.name` | Input | Tên sản phẩm mỗi dòng |
| `row.price` | Input | Giá sản phẩm mỗi dòng |
| `import_result` | Output | Báo cáo (success/fail count) |
| `db_state` | Output | Committed hoặc rolled back |

#### Step 2: Equivalence Classes

| EC | Variable | Description | Type |
| -- | -------- | ----------- | ---- |
| EC1 | file_extension | `.csv` | Valid |
| EC2 | file_extension | `.xlsx`, `.txt`, `.json` | Invalid |
| EC3 | file_extension | No extension | Invalid |
| EC4 | file_header | Đúng format | Valid |
| EC5 | file_header | Thiếu cột bắt buộc | Invalid |
| EC6 | file_header | Sai tên cột | Invalid |
| EC7 | file_header | File rỗng | Invalid |
| EC8 | file_header | Chỉ header, không có data | Valid (0 rows) |
| EC9 | row.name | Có giá trị | Valid |
| EC10 | row.name | Rỗng | Invalid → rollback |
| EC11 | row.price | > 0 | Valid |
| EC12 | row.price | = 0 | Invalid → rollback |
| EC13 | row.price | < 0 | Invalid → rollback |
| EC14 | row.price | Non-numeric | Invalid → rollback |
| EC15 | atomicity | All rows valid | Valid → commit |
| EC16 | atomicity | ≥1 row invalid | Invalid → full rollback |

#### Step 3 & 4: Test Cases

| TC ID | EC | Scenario | Expected |
| ----- | -- | -------- | -------- |
| TC-16-EP-01 | EC1,4,9,11,15 | Valid CSV, all rows OK | Import thành công |
| TC-16-EP-02 | EC2 | Upload `.xlsx` | Error: sai định dạng |
| TC-16-EP-03 | EC5 | Header thiếu `price` | Error: header sai |
| TC-16-EP-04 | EC7 | File rỗng | Error: file rỗng |
| TC-16-EP-05 | EC8 | Header only | Import 0 sản phẩm |
| TC-16-EP-06 | EC10,16 | 1 row: name="" | Rollback; 0 sản phẩm |
| TC-16-EP-07 | EC12,16 | 1 row: price=0 | Rollback; 0 sản phẩm |
| TC-16-EP-08 | EC13,16 | 1 row: price=−100 | Rollback; 0 sản phẩm |
| TC-16-EP-09 | EC14,16 | 1 row: price="abc" | Rollback; error on row |
| TC-16-EP-10 | EC1,16 | 5 valid rows + 1 invalid | Rollback ALL 5 valid rows |

### 4.2 Boundary Value Analysis — Step-by-Step Application

#### Boundaries Identified

| Boundary | Variable | Rule |
| -------- | -------- | ---- |
| B1 | `row.price` | Must be > 0; boundary at 0 vs 1 |
| B2 | `row.name` length | Must be ≥ 1 char; context: FR-15 max 255 |

#### BVA Test Cases

| TC ID | Variable | Value | Point | Expected |
| ----- | -------- | ----- | ----- | -------- |
| TC-16-BVA-01 | price | −1 | Below invalid | Rollback |
| TC-16-BVA-02 | price | 0 | UB invalid | Rollback |
| TC-16-BVA-03 | price | 1 | LB valid | Import OK |
| TC-16-BVA-04 | price | 2 | LB+1 nominal | Import OK |
| TC-16-BVA-05 | name length | 0 (empty) | LB invalid | Rollback |
| TC-16-BVA-06 | name length | 1 char | LB valid | Import OK |
| TC-16-BVA-07 | name length | 255 chars | UB (FR-15) | Import OK |
| TC-16-BVA-08 | name length | 256 chars | UB+1 | Error or truncate? |

### 4.3 AI Gap Analysis

_Điền sau khi chạy AI và review kết quả._

| # | Missed test case | Root cause (why AI missed it) |
| - | ---------------- | ----------------------------- |
| | | |

### 4.4 Execution Summary

| Metric | Count |
| ------ | ----- |
| TC Designed (EP) | 10 |
| TC Designed (BVA) | 8 |
| TC Executed | — |
| Passed | — |
| Failed | — |
| Bugs found | — |

---

## 5. Feature D — FR-20: Hủy Đơn Hàng (Mobile)

> **Technique applied:** Domain Testing (Equivalence Partitioning) + Boundary Value Analysis  
> **Detailed test cases:** [`artifacts/tests/FR-20-cancel-order-mobile/`](artifacts/tests/FR-20-cancel-order-mobile/)

### 5.1 Domain Testing — Step-by-Step Application

#### Step 1: Identify Input & Output Variables

_Based on `docs/eshop-sut/srs.md` §7 FR-20 + §5 FR-10 State Machine._

| Variable | Type | Description |
| -------- | ---- | ----------- |
| `order.status` | Input | Trạng thái hiện tại của đơn |
| `actor` | Input | User / Admin |
| `cancel_action` | Input | Tap "Hủy đơn" trên mobile |
| `result` | Output | `canceled` hoặc error message |

#### Step 2: Equivalence Classes

| EC | `order.status` | Actor | Can Cancel? | Type |
| -- | -------------- | ----- | ----------- | ---- |
| EC1 | `pending` | User (owner) | ✅ | Valid |
| EC2 | `confirmed` | User (owner) | ✅ | Valid |
| EC3 | `shipping` | User (owner) | ❌ | Invalid |
| EC4 | `delivered` | User (owner) | ❌ (final) | Invalid |
| EC5 | `canceled` | User (owner) | ❌ (final) | Invalid |
| EC6 | `pending` | Unauthenticated | ❌ | Invalid |
| EC7 | `pending` | User (not owner) | ❌ | Invalid |

#### Step 3 & 4: Test Cases

| TC ID | EC | Status | Actor | Expected |
| ----- | -- | ------ | ----- | -------- |
| TC-20-EP-01 | EC1 | `pending` | User (owner) | Order → `canceled` |
| TC-20-EP-02 | EC2 | `confirmed` | User (owner) | Order → `canceled` |
| TC-20-EP-03 | EC3 | `shipping` | User (owner) | Error: cannot cancel |
| TC-20-EP-04 | EC4 | `delivered` | User (owner) | Error: final state |
| TC-20-EP-05 | EC5 | `canceled` | User (owner) | Error: already canceled |
| TC-20-EP-06 | EC6 | `pending` | Not logged in | Error 401 |
| TC-20-EP-07 | EC7 | `pending` | Other user | Error 403 |

### 5.2 Boundary Value Analysis — State Transition Boundary

#### Boundary: `confirmed` (last allowed) ↔ `shipping` (first forbidden)

| TC ID | Status | Point | Expected |
| ----- | ------ | ----- | -------- |
| TC-20-BVA-01 | `pending` | First valid state | Cancel OK |
| TC-20-BVA-02 | `confirmed` | Last allowed (UB) | Cancel OK |
| TC-20-BVA-03 | `shipping` | First forbidden (LB forbidden) | Error: cannot cancel |
| TC-20-BVA-04 | Admin: `confirmed→shipping`; user immediately cancels | Timing boundary | Error: already shipping |

### 5.3 AI Gap Analysis

_Điền sau khi chạy AI và review kết quả._

| # | Missed test case | Root cause (why AI missed it) |
| - | ---------------- | ----------------------------- |
| | | |

### 5.4 Execution Summary

| Metric | Count |
| ------ | ----- |
| TC Designed (EP) | 7 |
| TC Designed (BVA) | 4 |
| TC Executed | — |
| Passed | — |
| Failed | — |
| Bugs found | — |

---

## 6. AI Critique (200–300 words)

_Điền sau khi hoàn thành quá trình dùng AI._

> **Hướng dẫn:** Viết 200–300 từ trả lời:
>
> - AI sai, thiên lệch, hoặc bỏ sót ở đâu?
> - Tại sao AI không bắt được vấn đề đó?
> - Nguyên tắc nào về cộng tác với AI bạn rút ra được?

---

## References

- ISTQB Foundation Level Syllabus (latest edition).
- Hardman, P. (2025). _A Post-AI Learning Taxonomy._
- Fuster Rabella, M. (2025). _OECD Education Working Paper No. 338._
- Anthropic (2025). _Building Reliable AI Test Agents_ — engineering blog.
- Kharbach, M. (2026). _AI Use Policy Templates for Higher Education._ CC BY-NC-SA 4.0.
- DeepEval & Promptfoo documentation — LLM testing frameworks.
