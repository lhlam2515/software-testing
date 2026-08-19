# FR-09 — Domain Testing: Coupon

**Feature:** FR-09 — Coupon (Discount Code)
**Technique:** Domain Testing (Equivalence Partitioning)
**Spec source:** `docs/eshop-sut/srs.md` §4 FR-09 · `docs/eshop-sut/api_specification.md` §5, §6.4
**API endpoint:** `POST /api/apply-coupon`
**Author:** Lê Hoàng Lâm — 23127216

---

## 1. Feature Overview

At checkout, the user enters a coupon code. The system validates **5 conditions simultaneously** (C1–C5): the code exists and is active, has not expired, the order total meets the minimum threshold, the user is authenticated, and the user has remaining uses. If all conditions pass, the system computes `discount_amount` and `final_amount` using the formula corresponding to the coupon `type` (`percent` or `fixed`).

Cross-feature note: FR-08 states the backend must recompute the order total independently; however, the `apply-coupon` API accepts `total_amount` from the client — a spec conflict that requires testing.

---

## 2. Step 1 — Variables & Constraints

| Variable | Type | Description | Valid Domain / Boundaries | Dependencies & Constraints | Expected Error / Behavior |
|:---|:---|:---|:---|:---|:---|
| `code` | Input (string) | Coupon code entered by the user | Must exist in DB and have `is_active = 1` (C1) | Must match exactly with a DB record | Error: code not found / inactive |
| `total_amount` | Input (integer ₫) | Order total before discount | `>= min_order_amount` of the coupon (C3); practically > 0 | Per FR-08, backend should recompute; but API accepts client value | Error: order total below minimum threshold |
| `user_id` | Input (integer) | User ID sent in request body | Valid ID + valid JWT Token (C4) | Requires `Authorization: Bearer <token>` header | Error: authentication required or token invalid |
| `is_active` | System State (boolean) | Whether the coupon is active | Must be `= 1` (C1) | Set by Admin at creation; user cannot control | If `= 0`: coupon is deactivated, request rejected |
| `expired_at` | System State (date) | Coupon expiry date | `current_date < expired_at` (C2) | Compared against server date, not client | Error: coupon has expired |
| `min_order_amount` | System State (integer ₫) | Minimum order value required | `>= 0` (per FR-17); `total_amount >= min_order_amount` (C3) | Bound to each coupon | Error: order below minimum |
| `uses_by_user` | System State (integer) | Number of times this user has used this coupon | `< max_uses_per_user` (C5) | Incremented after each successful checkout | Error: usage limit reached |
| `max_uses_per_user` | System State (integer) | Per-user usage limit | `>= 1` (per FR-17) | Bound to each coupon | Baseline for comparison against `uses_by_user` |
| `type` | System State (enum) | Discount type | `percent` or `fixed` | Determines which calculation formula applies | Completely different output per type |
| `discount_value` | System State (number) | Discount amount or percentage | `> 0` | Bound to each coupon | Used in the calculation formula |
| `discount_amount` | Output (integer ₫) | Amount deducted from order total | `>= 0` | `total × value/100` or `= value` | Must match the spec formula |
| `final_amount` | Output (integer ₫) | Order total after discount | `= total_amount - discount_amount` | Must be accurate | Must match the spec formula |

### Implicit Gaps

| Variable | Gap | Risk | Coverage / Decision |
|:---|:---|:---|:---|
| `code` | Spec does not define case-sensitivity (`SAVE10` vs `save10`) | If case-insensitive, user typos pass silently; if case-sensitive, user gets an opaque error | Covered — TC-05 (gap probe) |
| `total_amount` | API spec accepts `total_amount` from client, but FR-08 mandates backend recomputation — spec conflict | If client value is used, user can manipulate the discount threshold | Covered — TC-13 (gap probe, added 2026-07-06) |
| `discount_amount` | Spec does not define behavior when `fixed_value > total_amount` | `final_amount < 0` is a potential bug (discount exceeds order total) | Covered — TC-11 (gap probe) |
| `uses_by_user` | Tracking mechanism not specified; unclear whether uses are rolled back when an order is cancelled | If no rollback, user loses usage slot when cancelling an order | **Decision: Deferred, not tested.** Reason: requires a cross-app, cross-FR flow (web checkout + Admin order-cancel) — a State Transition/integration concern, not a Domain Testing boundary of FR-09's own variables; cost disproportionate given FR-09 already has 13 TCs/18 ECs and the 2026-07-08 deadline. |
| `expired_at` | Granularity undefined (day vs time); time zone not specified | Exact behavior at the boundary day (midnight cutoff?) is ambiguous | **Decision: Day-level covered, time zone excluded.** Reason: TC-BVA-07/08 confirm the spec's day-level "before" semantics; time zone is undefined in SRS/API spec and untestable without manipulating the system clock — an environment-level concern, not an input-parameter boundary, with negligible risk for a single-server deployment. |

---

## 3. Step 2 — Equivalence Classes

### Group 1: `code` — Exists & Active (C1) | Must-Be Rule

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `code` exists + `is_active = 1` | EC01 | Code exists in DB and `is_active = 1` | Valid | Proceed to check C2–C5 |
| `code` exists + `is_active = 1` | EC02 | Code does not exist in DB | Invalid | Rejected - code not found |
| `code` exists + `is_active = 1` | EC03 | Code exists but `is_active = 0` | Invalid | Rejected - code inactive |

### Group 2: `code` — Case Sensitivity (Implicit Gap)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `code` case format | EC04 | Correct characters but wrong case (e.g., `"save10"` instead of `"SAVE10"`) | Invalid/Gap | Behavior undefined in spec — test to discover: accepted or rejected? |

### Group 3: `expired_at` — Not Expired (C2) | Must-Be Rule

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `current_date < expired_at` | EC05 | Current date is before the expiry date (still valid) | Valid | Proceed to check C3–C5 |
| `current_date < expired_at` | EC06 | Coupon has expired (`current_date >= expired_at`) | Invalid | Rejected - coupon expired |

### Group 4: `total_amount` — Meets Minimum Order Threshold (C3) | Range Rule

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `total_amount >= min_order_amount` | EC07 | `total_amount >= min_order_amount` | Valid | Proceed to check C4–C5 |
| `total_amount >= min_order_amount` | EC08 | `total_amount < min_order_amount` | Invalid | Rejected - order below minimum |

### Group 5: JWT Token — User Authenticated (C4) | Must-Be Rule

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| Valid JWT Token | EC09 | Valid `Authorization: Bearer <token>` header present | Valid | Proceed to check C5 |
| Valid JWT Token | EC10 | No Authorization header (guest request) | Invalid | Rejected - authentication required |
| Valid JWT Token | EC11 | JWT Token is invalid or expired | Invalid | Rejected - token invalid or expired |

### Group 6: `uses_by_user` — Usage Limit Not Reached (C5) | Range Rule

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `uses_by_user < max_uses_per_user` | EC12 | `uses_by_user < max_uses_per_user` (uses remaining) | Valid | Coupon applied successfully |
| `uses_by_user < max_uses_per_user` | EC13 | `uses_by_user >= max_uses_per_user` (limit reached) | Invalid | Rejected - usage limit exceeded |

### Group 7: `type` — Discount Type | Splitting Rule

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `type` enum | EC14 | `type = 'percent'` → `discount = total × value / 100` | Valid | `discount_amount` calculated as a percentage |
| `type` enum | EC15 | `type = 'fixed'` → `discount = value` (flat amount) | Valid | `discount_amount` equals the fixed value |

### Group 8: Output — Response

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| Correct `discount_amount` + `final_amount` | EC16 | HTTP 200 + `{discount_amount, final_amount}` matching the spec formula | Valid | Values match the formula exactly |
| Error response when C1–C5 fails | EC17 | HTTP 4xx + descriptive error message | Invalid | Observed in all negative test cases |
| Negative `final_amount` — Implicit Gap | EC18 | `type=fixed` with `discount_value > total_amount` → `final_amount < 0` | Invalid/Gap | Undefined in spec — test to discover actual behavior |

---

## 4. Step 3 — Minimum Test Cases

### TC-01 — Apply valid `percent` coupon (happy path)

| Field | Content |
|:---|:---|
| **TC ID** | TC-01 |
| **Test Case Name** | Successfully apply a `percent` coupon when all 5 conditions C1–C5 are satisfied |
| **ECs Covered** | EC01, EC05, EC07, EC09, EC12, EC14, EC16 |
| **ECs Verified Absent** | EC17 (no error response), EC18 (final_amount is not negative) |
| **Pre-conditions** | Account `test@eshop.com` exists; coupon `SAVE10` in DB: `is_active=1`, `type=percent`, `discount_value=10`, `min_order_amount=300000`, `expired_at=2099-12-31`, `max_uses_per_user=1`; user has never used `SAVE10` (`uses_by_user = 0`) |
| **Input — `code`** | `"SAVE10"` |
| **Input — `total_amount`** | `500000` |
| **Input — `user_id`** | ID of `test@eshop.com` (retrieved from login response) |
| **Input — Authorization** | `Bearer <valid_token_from_login>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `500000`, enter coupon code `SAVE10` in `Nhập mã giảm giá...`, then click `Áp dụng` · 4. Inspect the discount/error shown in the UI and cross-check the underlying `POST /api/apply-coupon` response |
| **Expected Result** | ✅ On `/checkout`, after clicking `Áp dụng`, the UI applies coupon `SAVE10`, shows the discount, and updates `Tổng tiền thanh toán (VND)` to `450000` without an error. API cross-check: HTTP 200 + JSON `{"discount_amount": 50000, "final_amount": 450000}` |
| **Verification Points** | 1. On `/checkout`, a discount is shown after `Áp dụng` · 2. `Tổng tiền thanh toán (VND)` is updated to `450000` · 3. API cross-check: HTTP status = 200 · 4. API cross-check: `discount_amount` = `500000 × 10 / 100` = `50000` · 5. API cross-check: `final_amount` = `500000 - 50000` = `450000` · 6. API cross-check: No error field in response |
| **Status** | ❌ FAIL — BUG-09-001 |

---

### TC-02 — Apply valid `fixed` coupon (happy path)

| Field | Content |
|:---|:---|
| **TC ID** | TC-02 |
| **Test Case Name** | Successfully apply a `fixed` coupon when all 5 conditions C1–C5 are satisfied |
| **ECs Covered** | EC01, EC05, EC07, EC09, EC12, EC15, EC16 |
| **ECs Verified Absent** | EC17 (no error), EC18 (final_amount is not negative) |
| **Pre-conditions** | Account `test@eshop.com` exists; coupon `BIGBUY` in DB: `is_active=1`, `type=fixed`, `discount_value=50000`, `min_order_amount=500000`, `expired_at=2099-12-31`, `max_uses_per_user=1`; user has never used `BIGBUY` (`uses_by_user = 0`) |
| **Input — `code`** | `"BIGBUY"` |
| **Input — `total_amount`** | `600000` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `600000`, enter coupon code `BIGBUY` in `Nhập mã giảm giá...`, then click `Áp dụng` · 4. Inspect the discount/error shown in the UI and cross-check the underlying `POST /api/apply-coupon` response |
| **Expected Result** | ✅ On `/checkout`, after clicking `Áp dụng`, the UI applies coupon `BIGBUY`, shows the discount, and updates `Tổng tiền thanh toán (VND)` to `550000` without an error. API cross-check: HTTP 200 + JSON `{"discount_amount": 50000, "final_amount": 550000}` |
| **Verification Points** | 1. On `/checkout`, a discount is shown after `Áp dụng` · 2. `Tổng tiền thanh toán (VND)` is updated to `550000` · 3. API cross-check: HTTP status = 200 · 4. API cross-check: `discount_amount` = `50000` (flat, independent of total) · 5. API cross-check: `final_amount` = `600000 - 50000` = `550000` · 6. API cross-check: No error field |
| **Status** | ✅ PASS |

---

### TC-03 — Coupon code does not exist in the system (EC02)

| Field | Content |
|:---|:---|
| **TC ID** | TC-03 |
| **Test Case Name** | Reject request when the coupon code is not found in DB |
| **ECs Covered** | EC02, EC17 |
| **ECs Verified Absent** | EC16 (no success response) |
| **Pre-conditions** | String `"NOTEXIST99"` does not exist in the `coupons` table; user is authenticated |
| **Input — `code`** | `"NOTEXIST99"` |
| **Input — `total_amount`** | `500000` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `500000`, enter coupon code `NOTEXIST99` in `Nhập mã giảm giá...`, then click `Áp dụng` · 4. Inspect the discount/error shown in the UI and cross-check the underlying `POST /api/apply-coupon` response |
| **Expected Result** | ❌ On `/checkout`, after clicking `Áp dụng`, the UI shows an error for coupon code `NOTEXIST99` and does not show any applied discount. API cross-check: HTTP 4xx + error message (invalid or not found) |
| **Verification Points** | 1. On `/checkout`, an error is shown after `Áp dụng` · 2. No applied discount is shown in the UI · 3. API cross-check: HTTP status is 4xx (400 or 404) · 4. API cross-check: Response body contains an error message · 5. API cross-check: No `discount_amount` or `final_amount` in response |
| **Status** | ✅ PASS |

---

### TC-04 — Coupon exists but `is_active = 0` (EC03)

| Field | Content |
|:---|:---|
| **TC ID** | TC-04 |
| **Test Case Name** | Reject request when the coupon is deactivated (`is_active = 0`) |
| **ECs Covered** | EC03, EC17 |
| **ECs Verified Absent** | EC16 |
| **Pre-conditions** | Create coupon `DEAD01` via Admin API: `POST /api/admin/coupons` with `{"code":"DEAD01","type":"percent","discount_value":5,"min_order_amount":100000,"expired_at":"2099-12-31","max_uses_per_user":1}`; then deactivate directly: `sqlite3 apps/backend/database.sqlite "UPDATE coupons SET is_active=0 WHERE code='DEAD01'"` |
| **Input — `code`** | `"DEAD01"` |
| **Input — `total_amount`** | `500000` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. (Setup) Admin creates coupon `DEAD01` then deactivates it directly in DB (see Pre-conditions) · 2. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 3. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 4. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `500000`, enter coupon code `DEAD01` in `Nhập mã giảm giá...`, then click `Áp dụng` · 5. Inspect the discount/error shown in the UI and cross-check the underlying `POST /api/apply-coupon` response |
| **Expected Result** | ❌ On `/checkout`, after clicking `Áp dụng`, the UI shows an error for coupon code `DEAD01` and does not show any applied discount. API cross-check: HTTP 4xx + error message (invalid or inactive code) |
| **Verification Points** | 1. On `/checkout`, an error is shown after `Áp dụng` · 2. No applied discount is shown in the UI · 3. API cross-check: HTTP status 4xx · 4. API cross-check: Response contains error message · 5. API cross-check: No `discount_amount` in response |
| **Status** | ✅ PASS |

---

### TC-05 — Coupon entered with wrong case (EC04 — Implicit Gap)

| Field | Content |
|:---|:---|
| **TC ID** | TC-05 |
| **Test Case Name** | Case-sensitivity probe: `"save10"` instead of `"SAVE10"` |
| **ECs Covered** | EC04 |
| **ECs Verified Absent** | N/A (gap test — observe actual behavior) |
| **Pre-conditions** | Coupon `SAVE10` exists and is active; user has not used SAVE10; valid JWT |
| **Input — `code`** | `"save10"` (all lowercase) |
| **Input — `total_amount`** | `500000` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `500000`, enter coupon code `save10` in `Nhập mã giảm giá...`, then click `Áp dụng` · 4. Record the discount/error shown in the UI and cross-check the underlying `POST /api/apply-coupon` response |
| **Expected Result** | On `/checkout`, after clicking `Áp dụng`, the UI should either show an applied discount or show an error for coupon code `save10` so the case-sensitivity behavior can be recorded. API cross-check: ❌ HTTP 4xx (spec does not define — expected rejection since code does not match exactly) |
| **Verification Points** | 1. Record whether `/checkout` shows an applied discount or an error after `Áp dụng` · 2. If the UI applies the coupon, document the behavior as undocumented · 3. API cross-check: Record HTTP status: 2xx = case-insensitive (potential risk); 4xx = case-sensitive · 4. API cross-check: If 2xx: document as undocumented behavior · 5. API cross-check: If 4xx: confirm error message is generic (does not reveal "correct code, wrong case") |
| **Status** | ❌ FAIL — BUG-09-006 |

---

### TC-06 — Coupon has expired (EC06)

| Field | Content |
|:---|:---|
| **TC ID** | TC-06 |
| **Test Case Name** | Reject request when the coupon's `expired_at` date is in the past |
| **ECs Covered** | EC06, EC17 |
| **ECs Verified Absent** | EC16 |
| **Pre-conditions** | Coupon `EXPIRED` in DB: `type=percent`, `discount_value=20`, `min_order_amount=100000`, `expired_at=2020-01-01`; user `test@eshop.com` has not used `EXPIRED` |
| **Input — `code`** | `"EXPIRED"` |
| **Input — `total_amount`** | `200000` (>= 100000 min_order, satisfies C3 if not blocked by C2) |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `200000`, enter coupon code `EXPIRED` in `Nhập mã giảm giá...`, then click `Áp dụng` · 4. Inspect the discount/error shown in the UI and cross-check the underlying `POST /api/apply-coupon` response |
| **Expected Result** | ❌ On `/checkout`, after clicking `Áp dụng`, the UI shows an error for coupon code `EXPIRED` and does not show any applied discount. API cross-check: HTTP 4xx + error message (coupon expired or invalid) |
| **Verification Points** | 1. On `/checkout`, an error is shown after `Áp dụng` · 2. No applied discount is shown in the UI · 3. API cross-check: HTTP status 4xx · 4. API cross-check: Response contains error message · 5. API cross-check: No `discount_amount` |
| **Status** | ✅ PASS |

---

### TC-07 — Order total below minimum threshold (EC08)

| Field | Content |
|:---|:---|
| **TC ID** | TC-07 |
| **Test Case Name** | Reject request when `total_amount < min_order_amount` |
| **ECs Covered** | EC08, EC17 |
| **ECs Verified Absent** | EC16 |
| **Pre-conditions** | Coupon `SAVE10`: `is_active=1`, `expired_at=2099-12-31`, `min_order_amount=300000`; user has not used SAVE10; valid JWT |
| **Input — `code`** | `"SAVE10"` |
| **Input — `total_amount`** | `200000` (clearly below the 300,000₫ threshold) |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `200000`, enter coupon code `SAVE10` in `Nhập mã giảm giá...`, then click `Áp dụng` · 4. Inspect the discount/error shown in the UI and cross-check the underlying `POST /api/apply-coupon` response |
| **Expected Result** | ❌ On `/checkout`, after clicking `Áp dụng`, the UI shows an error and does not apply coupon `SAVE10` because `Tổng tiền thanh toán (VND)` is below the required threshold. API cross-check: HTTP 4xx + error message (order total below minimum required) |
| **Verification Points** | 1. On `/checkout`, an error is shown after `Áp dụng` · 2. No applied discount is shown in the UI · 3. API cross-check: HTTP status 4xx · 4. API cross-check: Response contains error message · 5. API cross-check: No `discount_amount` |
| **Status** | ✅ PASS |

---

### TC-08 — No JWT Token in request (EC10)

| Field | Content |
|:---|:---|
| **TC ID** | TC-08 |
| **Test Case Name** | Reject request when Authorization header is absent |
| **ECs Covered** | EC10, EC17 |
| **ECs Verified Absent** | EC16 |
| **Pre-conditions** | Coupon `SAVE10` exists, active, not expired; no login required |
| **Input — `code`** | `"SAVE10"` |
| **Input — `total_amount`** | `500000` |
| **Input — `user_id`** | `2` (assumed ID of test user) |
| **Input — Authorization** | _(no Authorization header sent)_ |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In`; from `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 2. While remaining on `/checkout`, click `Thoát` so the `token` storage key is cleared and the header switches back to `Đăng nhập` / `Đăng ký` · 3. Overwrite `Tổng tiền thanh toán (VND)` with `500000`, enter coupon code `SAVE10` in `Nhập mã giảm giá...`, then click `Áp dụng` · 4. Inspect the discount/error shown in the UI and cross-check the underlying `POST /api/apply-coupon` response |
| **Expected Result** | ❌ On `/checkout`, after clicking `Áp dụng`, the UI shows an error and does not show any applied discount after `Thoát` clears the authenticated session. API cross-check: HTTP 401 Unauthorized |
| **Verification Points** | 1. On `/checkout`, an error is shown after `Áp dụng` · 2. No applied discount is shown in the UI · 3. API cross-check: HTTP status = 401 · 4. API cross-check: No `discount_amount` in response · 5. API cross-check: Note: if API returns 200 → C4 is not enforced server-side (security bug) |
| **Status** | ❌ FAIL — BUG-09-002 |

---

### TC-09 — Invalid JWT Token (EC11)

| Field | Content |
|:---|:---|
| **TC ID** | TC-09 |
| **Test Case Name** | Reject request when JWT Token is invalid |
| **ECs Covered** | EC11, EC17 |
| **ECs Verified Absent** | EC16 |
| **Pre-conditions** | Coupon `SAVE10` exists, active, not expired |
| **Input — `code`** | `"SAVE10"` |
| **Input — `total_amount`** | `500000` |
| **Input — `user_id`** | `2` |
| **Input — Authorization** | `Bearer invalidtokenstring123abc` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In`; from `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 2. While remaining on `/checkout`, overwrite the browser storage key `token` with `invalidtokenstring123abc` · 3. Overwrite `Tổng tiền thanh toán (VND)` with `500000`, enter coupon code `SAVE10` in `Nhập mã giảm giá...`, then click `Áp dụng` · 4. Inspect the discount/error shown in the UI and cross-check the underlying `POST /api/apply-coupon` response |
| **Expected Result** | ❌ On `/checkout`, after clicking `Áp dụng`, the UI shows an error and does not show any applied discount when the browser storage `token` is invalid. API cross-check: HTTP 401 Unauthorized |
| **Verification Points** | 1. On `/checkout`, an error is shown after `Áp dụng` · 2. No applied discount is shown in the UI · 3. API cross-check: HTTP status = 401 · 4. API cross-check: No `discount_amount` in response |
| **Status** | ❌ FAIL — BUG-09-003 |

---

### TC-10 — User has reached the usage limit (EC13)

| Field | Content |
|:---|:---|
| **TC ID** | TC-10 |
| **Test Case Name** | Reject request when `uses_by_user >= max_uses_per_user` |
| **ECs Covered** | EC13, EC17 |
| **ECs Verified Absent** | EC16 |
| **Pre-conditions** | Coupon `SAVE10` (`max_uses_per_user=1`); `test@eshop.com` has already used `SAVE10` exactly once (`uses_by_user=1 >= max_uses_per_user=1`). Setup: complete one successful checkout with SAVE10 beforehand, OR insert directly into the usage tracking table in SQLite |
| **Input — `code`** | `"SAVE10"` |
| **Input — `total_amount`** | `500000` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. Complete one full checkout purchase using `SAVE10`: add any product from `/`, open `/cart` via `Giỏ hàng`, click `Tiến hành thanh toán`, overwrite `Tổng tiền thanh toán (VND)` with `500000`, enter `SAVE10`, click `Áp dụng`, then click `Xác Nhận Thanh Toán` to consume the coupon use · 3. Start a new order: add any product, open `/cart`, click `Tiến hành thanh toán`, overwrite `Tổng tiền thanh toán (VND)` with `500000`, enter `SAVE10`, then click `Áp dụng` again · 4. Inspect the discount/error shown in the UI and cross-check the underlying `POST /api/apply-coupon` response |
| **Expected Result** | ❌ On `/checkout`, after clicking `Áp dụng`, the UI shows an error for coupon `SAVE10` on the second order and does not show any applied discount. API cross-check: HTTP 4xx + error message (usage limit reached for this coupon) |
| **Verification Points** | 1. On `/checkout`, an error is shown after `Áp dụng` on the second order · 2. No applied discount is shown in the UI · 3. API cross-check: HTTP status 4xx · 4. API cross-check: Error message relates to usage limit · 5. API cross-check: No `discount_amount` |
| **Status** | ✅ PASS |

---

### TC-11 — Gap: `fixed_discount_value > total_amount` → negative `final_amount` (EC18)

| Field | Content |
|:---|:---|
| **TC ID** | TC-11 |
| **Test Case Name** | Gap test: final_amount goes negative when fixed discount exceeds order total |
| **ECs Covered** | EC18 |
| **ECs Verified Absent** | EC16 |
| **Pre-conditions** | Create test coupon via Admin API: `POST /api/admin/coupons` with `{"code":"GAPTEST1","type":"fixed","discount_value":100000,"min_order_amount":50000,"expired_at":"2099-12-31","max_uses_per_user":99}`; user has not used `GAPTEST1`; valid JWT |
| **Input — `code`** | `"GAPTEST1"` |
| **Input — `total_amount`** | `60000` (`>= min_order=50000` satisfies C3; but `< discount_value=100000`) |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. (Setup) Admin creates coupon `GAPTEST1` via Admin API (see Pre-conditions) · 2. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 3. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán`; on `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `60000`, enter coupon code `GAPTEST1` in `Nhập mã giảm giá...`, then click `Áp dụng` · 4. Record the discount/error shown in the UI and cross-check the underlying `POST /api/apply-coupon` response |
| **Expected Result** | On `/checkout`, after clicking `Áp dụng`, the UI should either show an error for `GAPTEST1` or show the resulting discount and updated `Tổng tiền thanh toán (VND)` so the negative-total branch can be recorded. API cross-check: ❌ HTTP 4xx + error (system rejects when discount exceeds total) OR if bug: HTTP 200 with `final_amount = -40000` |
| **Verification Points** | 1. Record whether `/checkout` shows an error or shows an applied discount and updated total after `Áp dụng` · 2. If the UI shows an updated total, record the displayed total value · 3. API cross-check: Record `final_amount` from response · 4. API cross-check: `final_amount < 0` → BUG, must be reported · 5. API cross-check: `final_amount = 0` → clamping behavior (acceptable, must be documented) · 6. API cross-check: HTTP 4xx → system handles correctly |
| **Status** | ❌ FAIL — BUG-09-004 |

---

### TC-12 — Gap: `total_amount = 0` with `min_order_amount = 0` (zero-amount degenerate)

| Field | Content |
|:---|:---|
| **TC ID** | TC-12 |
| **Test Case Name** | Gap probe: degenerate zero-amount intersection — `total_amount=0` satisfies C3 when `min_order_amount=0` |
| **ECs Covered** | EC07 (degenerate path: C3 passes with total=0, min=0), EC01, EC05, EC09, EC12, EC14 |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Create coupon `ZERO01` via Admin API: `POST /api/admin/coupons` with `{"code":"ZERO01","type":"percent","discount_value":10,"min_order_amount":0,"expired_at":"2099-12-31","max_uses_per_user":5}`; user has not used `ZERO01`; valid JWT |
| **Input — `code`** | `"ZERO01"` |
| **Input — `total_amount`** | `0` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. (Setup) Admin creates coupon `ZERO01` with `min_order_amount=0` via Admin API (see Pre-conditions) · 2. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 3. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán`; on `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `0`, enter coupon code `ZERO01` in `Nhập mã giảm giá...`, then click `Áp dụng` · 4. Record the discount/error shown in the UI and cross-check the underlying `POST /api/apply-coupon` response |
| **Expected Result** | On `/checkout`, after clicking `Áp dụng`, record whether the UI shows an error or shows an applied discount with the resulting `Tổng tiền thanh toán (VND)` for the zero-amount case. API cross-check: Discover actual behavior — plausible outcomes: (1) HTTP 4xx → system guards against zero total (undocumented validation); (2) HTTP 200 with `discount_amount=0, final_amount=0` → correct degenerate result; (3) HTTP 200 with unexpected values → additional calculation bug |
| **Verification Points** | 1. Record whether `/checkout` shows an error or an applied discount after `Áp dụng` · 2. If the UI shows an updated total, record the displayed total value · 3. API cross-check: Record HTTP status · 4. API cross-check: If 200: record `discount_amount` and `final_amount` exact values · 5. API cross-check: If `final_amount < 0` → BUG (analogous to BUG-09-004 via zero-total path) · 6. API cross-check: Note: with `type=percent` and `total=0`, BUG-09-001 formula produces `0×10=0`, so buggy formula coincidentally yields correct result — document this masking effect if observed |
| **Status** | ❌ FAIL — BUG-09-005 (degenerate case: `0 > 0 = FALSE`, error "tối thiểu 0₫ chưa đạt") |

---

### TC-13 — Gap: `total_amount` manipulated below actual cart subtotal (spec conflict with FR-08)

| Field | Content |
|:---|:---|
| **TC ID** | TC-13 |
| **Test Case Name** | Gap probe: client-manipulated `total_amount` diverges from real cart subtotal — does the backend trust the client value through to the final charged order (FR-08 spec conflict)? |
| **ECs Covered** | EC07 (C3 satisfied via manipulated value), EC01, EC05, EC09, EC12, EC14 |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Coupon `SAVE10` (`type=percent`, `discount_value=10`, `min_order_amount=300000`, `expired_at=2099-12-31`) active; user `test@eshop.com` has not used `SAVE10`; valid JWT; cart contains exactly 1× `Bàn phím cơ Keychron Q1` (real unit price `4,000,000₫`, so real cart subtotal = `4,000,000₫`) |
| **Input — `code`** | `"SAVE10"` |
| **Input — `total_amount`** | `500000` (manipulated — far below the real cart subtotal of `4,000,000₫`, but still `>= min_order_amount=300000` so C3 passes on the fake value) |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. From `/`, add exactly 1× `Bàn phím cơ Keychron Q1` to the cart, open `/cart` via `Giỏ hàng`, and record the displayed subtotal (expected `4,000,000₫`) · 3. Click `Tiến hành thanh toán` · 4. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `500000`, enter coupon code `SAVE10` in `Nhập mã giảm giá...`, then click `Áp dụng` and record the discount/error and the resulting `Tổng tiền thanh toán (VND)` shown · 5. Click `Xác Nhận Thanh Toán` to complete the order · 6. Cross-check the actual persisted order (via Admin panel order detail or `sqlite3 apps/backend/database.sqlite "SELECT * FROM orders ORDER BY id DESC LIMIT 1"`) for the real `total_amount`/`final_amount` charged |
| **Expected Result** | Discover actual behavior — plausible outcomes: (1) `Áp dụng` accepts the manipulated `500000` and computes `discount_amount=50000, final_amount=450000` (based on the fake value) — this alone confirms C3 is checked against the client value, not the real cart subtotal; (2) after `Xác Nhận Thanh Toán`, if the persisted order's total reflects `~450000` (or any value derived from the manipulated `500000`) instead of the real cart subtotal (`~4,000,000` minus a correctly-recomputed discount) → **BUG**: the client can pay a fraction of the real order value by manipulating `total_amount` at the apply-coupon step; (3) if the persisted order total is independently recomputed from the real cart contents (per FR-08), record whether the discount shown during `Áp dụng` was honored, ignored, or caused an inconsistency/error at the final step |
| **Verification Points** | 1. Record the real cart subtotal shown on `/cart` before checkout (expected `4,000,000₫`) · 2. Record whether `Áp dụng` accepts `SAVE10` against the manipulated `500000` and what `Tổng tiền thanh toán (VND)` it displays afterward · 3. API cross-check: record `discount_amount` and `final_amount` from the `POST /api/apply-coupon` response · 4. API cross-check: after `Xác Nhận Thanh Toán`, query the persisted order's actual charged amount · 5. **BUG condition**: persisted order total is at or near `450000` (derived from the manipulated value) instead of a value derived from the real `4,000,000₫` subtotal → confirms the FR-08/FR-09 spec conflict is exploitable, not just theoretical · 6. If the backend instead recomputes independently and rejects/ignores the manipulated `total_amount`, document the actual final charged amount and whether the earlier `Áp dụng` discount preview was misleading (UI/logic inconsistency, lower severity than the exploit case) |
| **Status** | ❌ FAIL — BUG-09-007 |

---

## 5. EC Coverage Matrix

| EC ID | Description | TC Cover | Mechanism |
|:---|:---|:---|:---|
| EC01 | `code` exists + `is_active=1` | TC-01, TC-02 | Nominal valid input |
| EC02 | `code` not found in DB | TC-03 | Direct trigger |
| EC03 | `code` exists, `is_active=0` | TC-04 | Direct trigger |
| EC04 | Correct characters, wrong case | TC-05 | Direct trigger (gap) |
| EC05 | `expired_at` in future (not expired) | TC-01, TC-02 | Nominal valid input |
| EC06 | `expired_at` in past (expired) | TC-06 | Direct trigger |
| EC07 | `total_amount >= min_order_amount` | TC-01, TC-02 | Nominal valid input |
| EC08 | `total_amount < min_order_amount` | TC-07 | Direct trigger |
| EC09 | Valid JWT Token | TC-01, TC-02 | Nominal valid input |
| EC10 | No Authorization header | TC-08 | Direct trigger |
| EC11 | Invalid or expired JWT Token | TC-09 | Direct trigger |
| EC12 | `uses_by_user < max_uses_per_user` | TC-01, TC-02 | Nominal valid input |
| EC13 | `uses_by_user >= max_uses_per_user` | TC-10 | Direct trigger |
| EC14 | `type = 'percent'` | TC-01 | Direct trigger |
| EC15 | `type = 'fixed'` | TC-02 | Direct trigger |
| EC16 | Correct output: `discount_amount` + `final_amount` per formula | TC-01, TC-02 | Verified present |
| EC17 | HTTP 4xx error response | TC-03 → TC-10 | Verified present (cross-check) |
| EC18 | `final_amount < 0` (gap: fixed > total) | TC-11 | Direct trigger (gap test) |
| EC07 (zero path) | C3 passes with `total=0`, `min=0` — degenerate intersection | TC-12 | Direct trigger (gap probe) |
| `total_amount` spec conflict | Client-manipulated `total_amount` diverges from real cart subtotal (FR-08 vs FR-09 conflict) | TC-13 | Direct trigger (gap probe) |

**Total: 13 TCs covering 18 ECs — 100% EP coverage + 2 additional gap probes (TC-12, TC-13, added after human review).**
