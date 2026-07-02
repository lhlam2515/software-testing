# FR-09 - Execution Log

**Feature:** FR-09 - Coupon (Discount Code)  
**Tester:** Le Hoang Lam (23127216)  
**SUT:** EShop frontend `http://localhost:5173` and API `http://localhost:3000`  
**DB:** `apps/backend/database.sqlite`  
**Started:** 2026-07-02

Screenshots: `homeworks/HW02/artifacts/tests/FR-09-coupon/screenshots/`

---

## Domain Testing (EP) - TC-01 to TC-12

### TC-01 - Apply valid `percent` coupon

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-09-001 |
| **Pre-condition setup** | `SAVE10` seeded active, not expired, `min_order_amount=300000`, no usage rows for user 2 |
| **Executed at** | 2026-07-02 13:35 |
| **Actual result** | UI accepted `SAVE10` on `/checkout` and showed `Tiết kiệm: -4,500,000 ₫`, `Thành tiền: 5,000,000 ₫`. API cross-check: `POST /api/apply-coupon` -> HTTP 200, `discount_amount=-4500000`, `final_amount=5000000` |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/BUG-09-001-percent-formula-wrong.png` |
| **Bug ID** | BUG-09-001 |
| **Notes** | EC01, EC05, EC07, EC09, EC12, EC14 confirmed. EC16 failed: percent formula multiplies by 10 instead of dividing by 100. |

### TC-02 - Apply valid `fixed` coupon

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `BIGBUY` seeded active, not expired, `min_order_amount=500000`, no usage rows for user 2 |
| **Executed at** | 2026-07-02 13:35 |
| **Actual result** | UI accepted `BIGBUY` and showed `Tiết kiệm: 50,000 ₫`, `Thành tiền: 550,000 ₫`. API cross-check: HTTP 200, `discount_amount=50000`, `final_amount=550000` |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-02-fixed-pass.png` |
| **Bug ID** | - |
| **Notes** | EC01, EC05, EC07, EC09, EC12, EC15, EC16 confirmed. |

### TC-03 - Coupon code does not exist

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `NOTEXIST99` absent from `coupons` |
| **Executed at** | 2026-07-02 13:35 |
| **Actual result** | UI showed `Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa`. API cross-check: HTTP 404 with error body, no discount fields |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-03-not-exist.png` |
| **Bug ID** | - |
| **Notes** | EC02, EC17 confirmed. |

### TC-04 - Coupon exists but `is_active = 0`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Create `DEAD01` through admin API, then direct fixture write: `UPDATE coupons SET is_active=0 WHERE code='DEAD01'`; verified `is_active=0` via SQLite query |
| **Executed at** | 2026-07-02 13:39 |
| **Actual result** | UI showed `Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa`. API cross-check: HTTP 404 with error body, no discount fields |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-04-inactive.png` |
| **Bug ID** | - |
| **Notes** | EC03, EC17 confirmed. The inactive branch is indistinguishable from not-found at the UI and API message level. |

### TC-05 - Wrong case: `save10`

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-09-006 |
| **Pre-condition setup** | `SAVE10` seeded active, no usage rows for user 2 |
| **Executed at** | 2026-07-02 13:40 |
| **Actual result** | UI accepted lowercase `save10` and showed the same broken percent output as `SAVE10`. API cross-check: HTTP 200, `coupon_id=1`, `discount_amount=-4500000`, `final_amount=5000000` |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-05-wrong-case.png` |
| **Bug ID** | BUG-09-006 |
| **Notes** | EC04 gap resolved as a defect: code lookup is case-insensitive, even though the TC expected exact matching. Same request also re-exposed BUG-09-001. |

### TC-06 - Coupon has expired

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `EXPIRED` seeded with `expired_at=2020-01-01`, no usage rows for user 2 |
| **Executed at** | 2026-07-02 13:35 |
| **Actual result** | UI showed `Mã giảm giá đã hết hạn`. API cross-check: HTTP 400 with expired-coupon error |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-06-expired.png` |
| **Bug ID** | - |
| **Notes** | EC06, EC17 confirmed. |

### TC-07 - Order total below minimum threshold

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `SAVE10` seeded active, no usage rows for user 2 |
| **Executed at** | 2026-07-02 13:35 |
| **Actual result** | UI showed `Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này`. API cross-check: HTTP 400, no discount fields |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-07-below-min.png` |
| **Bug ID** | - |
| **Notes** | EC08, EC17 confirmed. |

### TC-08 - No JWT token

Fallback Reason: the checkout UI always sends the current browser session token after login, so the no-token branch cannot be reached through the visible checkout controls. Executed through a direct browser `fetch` to the same endpoint.

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-09-002 |
| **Pre-condition setup** | No `Authorization` header sent |
| **Executed at** | 2026-07-02 13:57 |
| **Actual result** | API cross-check: `POST /api/apply-coupon` without `Authorization` returned HTTP 200 and applied `SAVE10`, `discount_amount=-4500000`, `final_amount=5000000` |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/BUG-09-002-no-auth-accepted.png` |
| **Bug ID** | BUG-09-002 |
| **Notes** | EC10 failed. Authentication is not enforced at all on this endpoint. |

### TC-09 - Invalid JWT token

Fallback Reason: the invalid-token branch cannot be produced through the visible checkout controls because the browser UI either uses a valid stored token or no token. Executed through a direct browser `fetch` with `Authorization: Bearer invalidtokenstring123abc`.

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-09-003 |
| **Pre-condition setup** | Invalid bearer token sent explicitly |
| **Executed at** | 2026-07-02 13:57 |
| **Actual result** | API cross-check: HTTP 200 and coupon applied, `discount_amount=-4500000`, `final_amount=5000000` |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/BUG-09-003-invalid-jwt-accepted.png` |
| **Bug ID** | BUG-09-003 |
| **Notes** | EC11 failed. Invalid JWTs are ignored the same way as missing JWTs. |

### TC-10 - Usage limit reached

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Direct fixture insert: `coupon_usage(coupon_id=1,user_id=2)` so `SAVE10` uses=1 and max=1 |
| **Executed at** | 2026-07-02 13:40 |
| **Actual result** | UI showed `Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)`. API cross-check: HTTP 400, no discount fields |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-10-limit-reached.png` |
| **Bug ID** | - |
| **Notes** | EC13, EC17 confirmed. |

### TC-11 - Gap: fixed discount larger than total

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-09-004 |
| **Pre-condition setup** | `GAPTEST1` created through admin API: `type=fixed`, `discount_value=100000`, `min_order_amount=50000`, active, no usage rows |
| **Executed at** | 2026-07-02 13:35 |
| **Actual result** | UI accepted `GAPTEST1` and showed a negative payable total. API cross-check: HTTP 200, `discount_amount=100000`, `final_amount=-40000` |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/BUG-09-004-negative-final-amount.png` |
| **Bug ID** | BUG-09-004 |
| **Notes** | EC18 gap is a real defect: the service does not cap fixed discounts at the order total. |

### TC-12 - Gap: `total_amount = 0`, `min_order_amount = 0`

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-09-005 |
| **Pre-condition setup** | `ZERO01` created through admin API: `type=percent`, `discount_value=10`, `min_order_amount=0`, active, no usage rows |
| **Executed at** | 2026-07-02 13:35 |
| **Actual result** | API cross-check: HTTP 400, `Đơn hàng chưa đủ giá trị tối thiểu 0 ₫ để áp dụng mã này` |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-12-zero-amount-bug09005-degenerate.png` |
| **Bug ID** | BUG-09-005 |
| **Notes** | Degenerate boundary defect: `0 >= 0` should pass, but the implementation behaves as if the rule were strict greater-than. |

---

## Boundary Value Analysis (BVA) - TC-BVA-01 to TC-BVA-08

### TC-BVA-01 - `total_amount = 299999`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `SAVE10` seeded active, no usage rows for user 2 |
| **Executed at** | 2026-07-02 13:35 |
| **Actual result** | UI rejected the coupon. API cross-check: HTTP 400, minimum-threshold error |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-01-off-point.png` |
| **Bug ID** | - |
| **Notes** | OFF point below the threshold rejected correctly. |

### TC-BVA-02 - `total_amount = 300000`

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-09-005 |
| **Pre-condition setup** | `SAVE10` seeded active, no usage rows for user 2 |
| **Executed at** | 2026-07-02 13:35 |
| **Actual result** | UI rejected the exact threshold. API cross-check: HTTP 400, minimum-threshold error |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/BUG-09-005-on-point-rejected.png` |
| **Bug ID** | BUG-09-005 |
| **Notes** | ON point should be valid, but the service rejects equality. |

### TC-BVA-03 - `total_amount = 300001`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (with deviation) |
| **Pre-condition setup** | `SAVE10` seeded active, no usage rows for user 2 |
| **Executed at** | 2026-07-02 13:35 |
| **Actual result** | Boundary accepted at the UI. API cross-check: HTTP 200, but `discount_amount=-2700009`, `final_amount=3000010` |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-03-ub-plus1.png` |
| **Bug ID** | - |
| **Notes** | C3 boundary behavior is correct here. Amount calculation still deviates because of BUG-09-001. |

### TC-BVA-04 - `uses_by_user = 1`, `max_uses_per_user = 2`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Direct fixture insert: `coupon_usage(coupon_id=3,user_id=2)` so `VIP100` uses=1 and max=2 |
| **Executed at** | 2026-07-02 13:41 |
| **Actual result** | UI accepted `VIP100` and showed `Tiết kiệm: 100,000 ₫`, `Thành tiền: 300,000 ₫`. API cross-check: HTTP 200, `discount_amount=100000`, `final_amount=300000` |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-04-last-valid-use.png` |
| **Bug ID** | - |
| **Notes** | Last valid use before the limit works correctly. |

### TC-BVA-05 - `uses_by_user = 1`, `max_uses_per_user = 1`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Direct fixture insert: `coupon_usage(coupon_id=1,user_id=2)` so `SAVE10` uses=1 and max=1 |
| **Executed at** | 2026-07-02 13:42 |
| **Actual result** | UI rejected the coupon. API cross-check: HTTP 400, `Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)` |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-05-max-uses-1-1.png` |
| **Bug ID** | - |
| **Notes** | Equality at max is rejected correctly. |

### TC-BVA-06 - `uses_by_user = 2`, `max_uses_per_user = 2`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Direct fixture inserts: two `coupon_usage` rows for `coupon_id=3,user_id=2`, so `VIP100` uses=2 and max=2 |
| **Executed at** | 2026-07-02 13:43 |
| **Actual result** | UI rejected the coupon. API cross-check: HTTP 400, `Bạn đã sử dụng mã này 2 lần (đã đạt giới hạn)` |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-06-max-uses-2-2.png` |
| **Bug ID** | - |
| **Notes** | Equality at max=2 is rejected correctly. |

### TC-BVA-07 - `expired_at = 2026-07-02`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `TODAYEXP` created through admin API with `expired_at=2026-07-02`, no usage rows |
| **Executed at** | 2026-07-02 13:44 |
| **Actual result** | UI showed `Mã giảm giá đã hết hạn`. API cross-check: HTTP 400 expired-coupon error |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-07-expired-today.png` |
| **Bug ID** | - |
| **Notes** | The exact-today boundary is treated as expired, which matches the strict less-than rule in the artifact. |

### TC-BVA-08 - `expired_at = 2026-07-03`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (with deviation) |
| **Pre-condition setup** | `TOMORROWEXP` created through admin API with `expired_at=2026-07-03`, no usage rows |
| **Executed at** | 2026-07-02 13:45 |
| **Actual result** | Boundary accepted at the UI. API cross-check: HTTP 200, but `discount_amount=-4500000`, `final_amount=5000000` |
| **Screenshot** | `artifacts/tests/FR-09-coupon/screenshots/TC-BVA-08-valid-tomorrow.png` |
| **Bug ID** | - |
| **Notes** | Tomorrow remains valid. Amount calculation still deviates because of BUG-09-001. |

---

## Execution Summary

| Metric | Count |
| :----- | :---- |
| TC Designed (EP) | 12 |
| TC Designed (BVA) | 8 |
| TC Executed | 20 / 20 |
| Passed | 11 |
| Failed | 7, TC-01, TC-05, TC-08, TC-09, TC-11, TC-12, TC-BVA-02 |
| Pass with deviation | 2, TC-BVA-03, TC-BVA-08 |
| Bugs found | 6, BUG-09-001 to BUG-09-006 |

## Bugs Discovered

| Bug ID | TC | Description | Severity |
| :----- | :- | :---------- | :------- |
| BUG-09-001 | TC-01 | Percent coupon formula is wrong, producing negative savings and inflated final totals | High |
| BUG-09-002 | TC-08 | `/api/apply-coupon` accepts unauthenticated requests | High |
| BUG-09-003 | TC-09 | `/api/apply-coupon` accepts invalid bearer tokens | High |
| BUG-09-004 | TC-11 | Fixed coupon discount is not capped at the order total, allowing negative `final_amount` | High |
| BUG-09-005 | TC-12, TC-BVA-02 | Minimum-order rule behaves as strict greater-than instead of greater-than-or-equal | Medium |
| BUG-09-006 | TC-05 | Coupon code lookup is case-insensitive, so lowercase `save10` incorrectly matches `SAVE10` | Medium |
