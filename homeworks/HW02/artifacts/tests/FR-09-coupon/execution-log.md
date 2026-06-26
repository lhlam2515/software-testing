# FR-09 — Execution Log

**Feature:** FR-09 — Coupon (Discount Code)
**Tester:** Lê Hoàng Lâm (23127216)
**SUT:** EShop API `http://localhost:3000` · Frontend `http://localhost:5173`
**DB:** `apps/backend/database.sqlite` · test account: `test@eshop.com` / `Test1234!`
**Started:** 2026-06-26

Screenshots: `homeworks/HW02/artifacts/tests/FR-09-coupon/screenshots/`

---

## Domain Testing (EP) — TC-01 to TC-11

### TC-01 — Apply valid `percent` coupon (happy path)

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-09-001 |
| **Pre-condition setup** | SAVE10: is_active=1, type=percent, discount_value=10, min_order_amount=300000, expired_at=2099-12-31, max_uses_per_user=5; coupon_usage empty (uses=0) |
| **Executed at** | 2026-06-26 11:06 |
| **Actual result** | POST /api/apply-coupon → HTTP 200 · discount_amount=-4,500,000 (expected 50,000) · final_amount=5,000,000 (expected 450,000) |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/BUG-09-001-percent-formula-wrong.png` |
| **Bug ID** | **BUG-09-001** |
| **Notes** | HTTP status 200 OK but output values wrong. Formula computes `total_amount × discount_value` = 500,000 × 10 = 5,000,000 without dividing by 100. Then discount_amount = total_amount - (total_amount × discount_value) = 500,000 - 5,000,000 = -4,500,000. final_amount = total_amount - discount_amount = 500,000 - (-4,500,000) = 5,000,000. EC01, EC05, EC07, EC09, EC12, EC14 verified; EC16 FAILED (wrong formula). |

---

### TC-02 — Apply valid `fixed` coupon (happy path)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | BIGBUY: is_active=1, type=fixed, discount_value=50000, min_order_amount=500000, expired_at=2099-12-31, max_uses_per_user=1; coupon_usage empty (uses=0) |
| **Executed at** | 2026-06-26 11:06 |
| **Actual result** | POST /api/apply-coupon → HTTP 200 · discount_amount=50,000 · final_amount=550,000 |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-02-fixed-pass.png` |
| **Bug ID** | — |
| **Notes** | EC01, EC05, EC07, EC09, EC12, EC15, EC16 all verified. Fixed-type formula correct: discount=50,000 (flat), final=600,000-50,000=550,000. |

---

### TC-03 — Coupon code does not exist in the system

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | "NOTEXIST99" does not exist in coupons table |
| **Executed at** | 2026-06-26 11:06 |
| **Actual result** | POST /api/apply-coupon → HTTP 404 · error: "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa" |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-03-not-exist.png` |
| **Bug ID** | — |
| **Notes** | EC02, EC17 confirmed. HTTP 404 is within expected "4xx" range. Error message combines "not found" and "inactive" — generic enough not to leak existence. |

---

### TC-04 — Coupon exists but `is_active = 0`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | DEAD01: is_active=0 (deactivated via `UPDATE coupons SET is_active=0 WHERE code='DEAD01'`) |
| **Executed at** | 2026-06-26 11:06 |
| **Actual result** | POST /api/apply-coupon → HTTP 404 · error: "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa" |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-04-inactive.png` |
| **Bug ID** | — |
| **Notes** | EC03, EC17 confirmed. System returns same 404 for inactive as for not-found — generic error masks the distinction (acceptable from security standpoint). |

---

### TC-05 — Coupon entered with wrong case (EC04 — Implicit Gap)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | SAVE10 exists and is active; sending code="save10" (all lowercase) |
| **Executed at** | 2026-06-26 11:06 |
| **Actual result** | POST /api/apply-coupon → HTTP 404 · error: "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa" |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-05-wrong-case.png` |
| **Bug ID** | — |
| **Notes** | EC04 gap resolved: system is **case-sensitive**. "save10" does not match "SAVE10" → treated as non-existent code. No security leak in error message. EC17 confirmed. |

---

### TC-06 — Coupon has expired

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | EXPIRED: expired_at=2020-01-01 (past date) |
| **Executed at** | 2026-06-26 11:06 |
| **Actual result** | POST /api/apply-coupon → HTTP 400 · error: "Mã giảm giá đã hết hạn" |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-06-expired.png` |
| **Bug ID** | — |
| **Notes** | EC06, EC17 confirmed. Specific "expired" message distinct from "not found" — acceptable and informative. |

---

### TC-07 — Order total below minimum threshold

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | SAVE10: min_order_amount=300,000; sending total_amount=200,000 |
| **Executed at** | 2026-06-26 11:06 |
| **Actual result** | POST /api/apply-coupon → HTTP 400 · error: "Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này" |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-07-below-min.png` |
| **Bug ID** | — |
| **Notes** | EC08, EC17 confirmed. Error message includes specific minimum amount (300,000₫) — helpful for users. |

---

### TC-08 — No JWT Token in request

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-09-002 |
| **Pre-condition setup** | No Authorization header sent in request |
| **Executed at** | 2026-06-26 11:06 |
| **Actual result** | POST /api/apply-coupon → HTTP 200 · coupon applied successfully without authentication |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/BUG-09-002-no-auth-accepted.png` |
| **Bug ID** | **BUG-09-002** |
| **Notes** | EC10 FAILED: C4 (user authentication) is not enforced. The /api/apply-coupon endpoint has no auth middleware — any unauthenticated request is accepted. This is a security defect: unauthenticated users can manipulate coupon discounts. EC17 absent (no error returned). |

---

### TC-09 — Invalid JWT Token

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-09-003 |
| **Pre-condition setup** | Authorization: Bearer invalidtokenstring123abc (fabricated invalid token) |
| **Executed at** | 2026-06-26 11:06 |
| **Actual result** | POST /api/apply-coupon → HTTP 200 · coupon applied with invalid token |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/BUG-09-003-invalid-jwt-accepted.png` |
| **Bug ID** | **BUG-09-003** |
| **Notes** | EC11 FAILED: same root cause as BUG-09-002 — the endpoint does not verify JWT signatures. Any arbitrary string in the Authorization header is accepted (or ignored entirely). |

---

### TC-10 — User has reached the usage limit

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `INSERT INTO coupon_usage (coupon_id, user_id) VALUES (1, 2)` → uses_by_user=1; SAVE10 max_uses_per_user=1 |
| **Executed at** | 2026-06-26 11:10 |
| **Actual result** | POST /api/apply-coupon → HTTP 400 · error: "Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)" |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-10-limit-reached.png` |
| **Bug ID** | — |
| **Notes** | EC13, EC17 confirmed. Usage limit enforcement works correctly. Error message includes exact usage count and indicates limit reached. |

---

### TC-11 — Gap: `fixed_discount_value > total_amount` → negative `final_amount`

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-09-004 |
| **Pre-condition setup** | GAPTEST1: type=fixed, discount_value=100,000, min_order_amount=50,000; sending total_amount=60,000 |
| **Executed at** | 2026-06-26 11:06 |
| **Actual result** | POST /api/apply-coupon → HTTP 200 · discount_amount=100,000 · final_amount=-40,000 |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/BUG-09-004-negative-final-amount.png` |
| **Bug ID** | **BUG-09-004** |
| **Notes** | EC18 gap confirmed as real bug. System returns HTTP 200 with final_amount=-40,000 (negative). No guard against discount exceeding total. A negative final_amount at checkout could corrupt order totals or result in free orders. |

---

## Boundary Value Analysis (BVA) — TC-BVA-01 to TC-BVA-08

### TC-BVA-01 — `total_amount` = 299,999 (OFF point)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | SAVE10 uses=1, max=1 (TC-10 state); total=299,999 — rejected by min_order check before usage check |
| **Executed at** | 2026-06-26 11:10 |
| **Actual result** | POST /api/apply-coupon → HTTP 400 · error: "Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này" |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-01-off-point.png` |
| **Bug ID** | — |
| **Notes** | OFF point (299,999) correctly rejected. Rejection reason is min_order_amount, not usage limit. BVA target (off-by-one for >= boundary) confirmed: 299,999 < 300,000 = rejected. |

---

### TC-BVA-02 — `total_amount` = 300,000 (ON point)

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-09-005 |
| **Pre-condition setup** | SAVE10 usage deleted → uses=0; max_uses=1; total_amount=300,000 = min_order_amount=300,000 |
| **Executed at** | 2026-06-26 11:11 |
| **Actual result** | POST /api/apply-coupon → HTTP 400 · error: "Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này" |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/BUG-09-005-on-point-rejected.png` |
| **Bug ID** | **BUG-09-005** |
| **Notes** | ON point (total=300,000 = min_order=300,000) incorrectly rejected. Spec requires `total_amount >= min_order_amount` but system uses `total_amount > min_order_amount` (strict greater-than). 300,000 > 300,000 = FALSE → rejected. Off-by-one confirmed at the exact boundary. |

---

### TC-BVA-03 — `total_amount` = 300,001 (UB+1)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (with deviation) |
| **Pre-condition setup** | SAVE10 uses=0 (usage deleted); total_amount=300,001 |
| **Executed at** | 2026-06-26 11:11 |
| **Actual result** | POST /api/apply-coupon → HTTP 200 · discount_amount=-2,700,009 · final_amount=3,000,010 |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-03-ub-plus1.png` |
| **Bug ID** | — (deviation from BUG-09-001) |
| **Notes** | HTTP 200 confirms total=300,001 > 300,000 passes C3. Boundary acceptance correct ✅. Amount values wrong due to BUG-09-001 formula bug (percent type). BVA objective (verifying UB+1 is accepted) met. |

---

### TC-BVA-04 — `uses_by_user` = 1, max = 2 (VIP100, last valid use)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `INSERT INTO coupon_usage (coupon_id, user_id) VALUES (3, 2)` → VIP100 uses=1; max_uses_per_user=2 |
| **Executed at** | 2026-06-26 11:11 |
| **Actual result** | POST /api/apply-coupon → HTTP 200 · discount_amount=100,000 · final_amount=300,000 |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-04-last-valid-use.png` |
| **Bug ID** | — |
| **Notes** | uses=1 < max=2 → C5 passes. Fixed-type formula correct (100,000 flat discount, 400,000-100,000=300,000). Last valid use accepted. No off-by-one in subtraction (`< max_uses_per_user - 1` not used). EC12 and EC16 verified. |

---

### TC-BVA-05 — `uses_by_user` = 1, max = 1 (SAVE10, limit reached)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | SAVE10 coupon_usage has 1 row for user_id=2; max_uses_per_user=1 |
| **Executed at** | 2026-06-26 11:11 |
| **Actual result** | POST /api/apply-coupon → HTTP 400 · error: "Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)" |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-05-max-uses-1-1.png` |
| **Bug ID** | — |
| **Notes** | uses=1 < max=1 → FALSE → correctly rejected. No `uses <= max` bug (which would accept 1 when max=1). EC13 and EC17 confirmed. |

---

### TC-BVA-06 — `uses_by_user` = 2, max = 2 (VIP100, limit reached)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `INSERT INTO coupon_usage (coupon_id, user_id) VALUES (3, 2)` again → VIP100 uses=2; max_uses_per_user=2 |
| **Executed at** | 2026-06-26 11:11 |
| **Actual result** | POST /api/apply-coupon → HTTP 400 · error: "Bạn đã sử dụng mã này 2 lần (đã đạt giới hạn)" |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-06-max-uses-2-2.png` |
| **Bug ID** | — |
| **Notes** | uses=2 < max=2 → FALSE → correctly rejected. Rules out any hardcoded max=1 behavior — same check works for max=2. EC13 and EC17 confirmed. |

---

### TC-BVA-07 — `expired_at` = 2026-06-26 (= today, ON point)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | TODAYEXP: expired_at=2026-06-26 (created via admin API; today is 2026-06-26, adjusted from original 2026-06-25 design date) |
| **Executed at** | 2026-06-26 11:10 |
| **Actual result** | POST /api/apply-coupon → HTTP 400 · error: "Mã giảm giá đã hết hạn" |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-07-expires-today.png` |
| **Bug ID** | — |
| **Notes** | Strict `<` comparison confirmed: current_date (2026-06-26) < expired_at (2026-06-26) = FALSE → rejected correctly. No `<=` bug (which would accept a coupon expiring today). EC06 boundary case verified. |

---

### TC-BVA-08 — `expired_at` = 2026-06-27 (= tomorrow, UB+1)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (with deviation) |
| **Pre-condition setup** | TOMORROWEXP: expired_at=2026-06-27; today=2026-06-26; total=500,000 |
| **Executed at** | 2026-06-26 11:10 |
| **Actual result** | POST /api/apply-coupon → HTTP 200 · discount_amount=-4,500,000 · final_amount=5,000,000 |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-08-expires-tomorrow.png` |
| **Bug ID** | — (deviation from BUG-09-001) |
| **Notes** | HTTP 200 confirms expired_at=tomorrow is correctly accepted by C2. Boundary objective ✅. Amount values wrong due to pre-existing BUG-09-001 (percent formula). No off-by-one in reverse direction (tomorrow is not incorrectly rejected). EC05 confirmed. |

---

## Execution Summary

| Metric | Count |
| :----- | :---- |
| TC Designed (EP) | 11 |
| TC Designed (BVA) | 8 |
| TC Executed | 19 / 19 |
| Passed | 12 |
| Failed | 5 (TC-01, TC-08, TC-09, TC-11, TC-BVA-02) |
| Pass with deviation | 2 (TC-BVA-03, TC-BVA-08) |
| Bugs found | 5 (BUG-09-001 to BUG-09-005) |

## Bugs Discovered

| Bug ID | TC | Description | Severity |
| :----- | :- | :---------- | :------- |
| BUG-09-001 | TC-01 | Percent discount formula: multiplies total by discount_value directly without dividing by 100, producing negative discount_amount and inflated final_amount | High |
| BUG-09-002 | TC-08 | apply-coupon endpoint missing auth middleware: requests without Authorization header return HTTP 200 (C4 not enforced) | High |
| BUG-09-003 | TC-09 | apply-coupon endpoint accepts any string as JWT: invalid/fake tokens bypass authentication | High |
| BUG-09-004 | TC-11 | No guard when fixed discount exceeds total_amount: final_amount goes negative (-40,000) without error | Medium |
| BUG-09-005 | TC-BVA-02 | Off-by-one in min_order_amount check: uses strict > instead of >=, rejecting orders at exactly the minimum threshold | Medium |
