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
| `user_id` | Input (integer) | User ID sent in request body | Valid ID + valid JWT Token (C4) | Requires `Authorization: Bearer <token>` header | HTTP 401 if token is missing or invalid |
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

| Variable | Gap | Risk |
|:---|:---|:---|
| `code` | Spec does not define case-sensitivity (`SAVE10` vs `save10`) | If case-insensitive, user typos pass silently; if case-sensitive, user gets an opaque error |
| `total_amount` | API spec accepts `total_amount` from client, but FR-08 mandates backend recomputation — spec conflict | If client value is used, user can manipulate the discount threshold |
| `discount_amount` | Spec does not define behavior when `fixed_value > total_amount` | `final_amount < 0` is a potential bug (discount exceeds order total) |
| `uses_by_user` | Tracking mechanism not specified; unclear whether uses are rolled back when an order is cancelled | If no rollback, user loses usage slot when cancelling an order |
| `expired_at` | Granularity undefined (day vs time); time zone not specified | Exact behavior at the boundary day (midnight cutoff?) is ambiguous |

---

## 3. Step 2 — Equivalence Classes

### Group 1: `code` — Exists & Active (C1) | Must-Be Rule

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `code` exists + `is_active = 1` | EC01 | Code exists in DB and `is_active = 1` | Valid | Proceed to check C2–C5 |
| `code` exists + `is_active = 1` | EC02 | Code does not exist in DB | Invalid | HTTP 4xx + error message (invalid code) |
| `code` exists + `is_active = 1` | EC03 | Code exists but `is_active = 0` | Invalid | HTTP 4xx + error message (code inactive) |

### Group 2: `code` — Case Sensitivity (Implicit Gap)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `code` case format | EC04 | Correct characters but wrong case (e.g., `"save10"` instead of `"SAVE10"`) | Invalid/Gap | Behavior undefined in spec — test to discover: accepted or rejected? |

### Group 3: `expired_at` — Not Expired (C2) | Must-Be Rule

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `current_date < expired_at` | EC05 | Current date is before the expiry date (still valid) | Valid | Proceed to check C3–C5 |
| `current_date < expired_at` | EC06 | Coupon has expired (`current_date >= expired_at`) | Invalid | HTTP 4xx + error message (coupon expired) |

### Group 4: `total_amount` — Meets Minimum Order Threshold (C3) | Range Rule

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `total_amount >= min_order_amount` | EC07 | `total_amount >= min_order_amount` | Valid | Proceed to check C4–C5 |
| `total_amount >= min_order_amount` | EC08 | `total_amount < min_order_amount` | Invalid | HTTP 4xx + error message (order below minimum) |

### Group 5: JWT Token — User Authenticated (C4) | Must-Be Rule

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| Valid JWT Token | EC09 | Valid `Authorization: Bearer <token>` header present | Valid | Proceed to check C5 |
| Valid JWT Token | EC10 | No Authorization header (guest request) | Invalid | HTTP 401 Unauthorized |
| Valid JWT Token | EC11 | JWT Token is invalid or expired | Invalid | HTTP 401 Unauthorized |

### Group 6: `uses_by_user` — Usage Limit Not Reached (C5) | Range Rule

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `uses_by_user < max_uses_per_user` | EC12 | `uses_by_user < max_uses_per_user` (uses remaining) | Valid | Coupon applied successfully |
| `uses_by_user < max_uses_per_user` | EC13 | `uses_by_user >= max_uses_per_user` (limit reached) | Invalid | HTTP 4xx + error message (usage limit exceeded) |

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
| **Steps** | 1. `POST /api/login` with `test@eshop.com`/`Test1234!` — save `token` and `user.id` · 2. `POST /api/apply-coupon` with body `{"code":"SAVE10","total_amount":500000,"user_id":<id>}` + header `Authorization: Bearer <token>` · 3. Inspect response |
| **Expected Result** | ✅ HTTP 200 + JSON `{"discount_amount": 50000, "final_amount": 450000}` |
| **Verification Points** | 1. HTTP status = 200 · 2. `discount_amount` = `500000 × 10 / 100` = `50000` · 3. `final_amount` = `500000 - 50000` = `450000` · 4. No error field in response |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. `POST /api/login` → save `token` · 2. `POST /api/apply-coupon` with body `{"code":"BIGBUY","total_amount":600000,"user_id":<id>}` + Auth header · 3. Inspect response |
| **Expected Result** | ✅ HTTP 200 + JSON `{"discount_amount": 50000, "final_amount": 550000}` |
| **Verification Points** | 1. HTTP status = 200 · 2. `discount_amount` = `50000` (flat, independent of total) · 3. `final_amount` = `600000 - 50000` = `550000` · 4. No error field |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Login to get token · 2. `POST /api/apply-coupon` with `{"code":"NOTEXIST99","total_amount":500000,"user_id":<id>}` + Auth header · 3. Inspect response |
| **Expected Result** | ❌ HTTP 4xx + error message (invalid or not found) |
| **Verification Points** | 1. HTTP status is 4xx (400 or 404) · 2. Response body contains an error message · 3. No `discount_amount` or `final_amount` in response |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Admin creates coupon + deactivates it (see Pre-conditions) · 2. Login as `test@eshop.com` to get token · 3. `POST /api/apply-coupon` · 4. Inspect response |
| **Expected Result** | ❌ HTTP 4xx + error message (invalid or inactive code) |
| **Verification Points** | 1. HTTP status 4xx · 2. Response contains error message · 3. No `discount_amount` in response |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Login to get token · 2. `POST /api/apply-coupon` with `{"code":"save10","total_amount":500000,"user_id":<id>}` + Auth header · 3. Record HTTP status and full response body |
| **Expected Result** | ❌ HTTP 4xx (spec does not define — expected rejection since code does not match exactly) |
| **Verification Points** | 1. Record HTTP status: 2xx = case-insensitive (potential risk); 4xx = case-sensitive · 2. If 2xx: document as undocumented behavior · 3. If 4xx: confirm error message is generic (does not reveal "correct code, wrong case") |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Login to get token · 2. `POST /api/apply-coupon` with `{"code":"EXPIRED","total_amount":200000,"user_id":<id>}` + Auth header · 3. Inspect response |
| **Expected Result** | ❌ HTTP 4xx + error message (coupon expired or invalid) |
| **Verification Points** | 1. HTTP status 4xx · 2. Response contains error message · 3. No `discount_amount` |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Login to get token · 2. `POST /api/apply-coupon` with `{"code":"SAVE10","total_amount":200000,"user_id":<id>}` + Auth header · 3. Inspect response |
| **Expected Result** | ❌ HTTP 4xx + error message (order total below minimum required) |
| **Verification Points** | 1. HTTP status 4xx · 2. Response contains error message · 3. No `discount_amount` |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. `POST /api/apply-coupon` with `{"code":"SAVE10","total_amount":500000,"user_id":2}` — **omit** Authorization header · 2. Inspect response |
| **Expected Result** | ❌ HTTP 401 Unauthorized |
| **Verification Points** | 1. HTTP status = 401 · 2. No `discount_amount` in response · 3. Note: if API returns 200 → C4 is not enforced server-side (security bug) |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. `POST /api/apply-coupon` with `{"code":"SAVE10","total_amount":500000,"user_id":2}` + header `Authorization: Bearer invalidtokenstring123abc` · 2. Inspect response |
| **Expected Result** | ❌ HTTP 401 Unauthorized |
| **Verification Points** | 1. HTTP status = 401 · 2. No `discount_amount` in response |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. (Setup) Ensure user has used SAVE10 once · 2. Login to get token · 3. `POST /api/apply-coupon` with `{"code":"SAVE10","total_amount":500000,"user_id":<id>}` + Auth header · 4. Inspect response |
| **Expected Result** | ❌ HTTP 4xx + error message (usage limit reached for this coupon) |
| **Verification Points** | 1. HTTP status 4xx · 2. Error message relates to usage limit · 3. No `discount_amount` |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Admin creates coupon GAPTEST1 (see Pre-conditions) · 2. Login as `test@eshop.com` to get token · 3. `POST /api/apply-coupon` with `{"code":"GAPTEST1","total_amount":60000,"user_id":<id>}` + Auth header · 4. Record full response |
| **Expected Result** | ❌ HTTP 4xx + error (system rejects when discount exceeds total) OR if bug: HTTP 200 with `final_amount = -40000` |
| **Verification Points** | 1. Record `final_amount` from response · 2. `final_amount < 0` → BUG, must be reported · 3. `final_amount = 0` → clamping behavior (acceptable, must be documented) · 4. HTTP 4xx → system handles correctly |
| **Status** | ⬜ Not yet executed |

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

**Total: 11 TCs covering 18 ECs — 100% coverage.**
