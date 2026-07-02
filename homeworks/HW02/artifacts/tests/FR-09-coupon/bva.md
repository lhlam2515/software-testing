# FR-09 — Boundary Value Analysis: Coupon

**Feature:** FR-09 — Coupon (Discount Code)
**Technique:** Boundary Value Analysis (BVA) — additive to Domain Testing
**Spec source:** `docs/eshop-sut/srs.md` §4 FR-09 · `docs/eshop-sut/api_specification.md` §5
**API endpoint:** `POST /api/apply-coupon`
**Author:** Lê Hoàng Lâm — 23127216

---

## 1. Overview

BVA supplements Domain Testing (EP) by probing **exact boundary points** — where off-by-one defects hide. EP covers midpoint values; BVA covers the ON point, the OFF point, and the point just past the boundary.

**Selected target variables** (numeric/range only — string format conditions are not BVA targets):

| Variable | Boundary Condition | Unit | Reference coupon |
|:---|:---|:---|:---|
| `total_amount` | `total_amount >= min_order_amount` (C3) | 1₫ | SAVE10: min=300,000₫ |
| `uses_by_user` | `uses_by_user < max_uses_per_user` (C5) | 1 use | SAVE10 max=1; VIP100 max=2 |
| `expired_at` | `current_date < expired_at` (C2, strict) | 1 day | Test coupons created with precise expiry dates |

String conditions (`code` format, case sensitivity) are not BVA targets — covered by EP gap tests.

---

## 2. Target Variables & Boundary Maps

### Target 1: `total_amount` vs `min_order_amount`

Condition: `total_amount >= min_order_amount`
Reference coupon: `SAVE10` with `min_order_amount = 300,000₫`

```
         INVALID                     VALID
            |                          |        |
...──────299,999───────────────────300,000──300,001──...
              ^                          ^         ^
           OFF point                 ON point    UB+1
          (< min_order)            (= min_order) (> min)
          TC-BVA-01                 TC-BVA-02  TC-BVA-03
```

| BVA Point | `total_amount` | State | TC |
|:---|:---|:---|:---|
| UB-1 (OFF point) | 299,999 | INVALID | TC-BVA-01 |
| UB (ON point) | 300,000 | VALID | TC-BVA-02 |
| UB+1 | 300,001 | VALID | TC-BVA-03 |

---

### Target 2: `uses_by_user` vs `max_uses_per_user`

Condition: `uses_by_user < max_uses_per_user`

```
                  VALID                    |  INVALID
                    |           |          |         |
...──uses=0──────uses=1──────uses=2──────────────────...
                    ^           ^
         (VIP100 max=2)  (SAVE10 max=1 / VIP100 max=2)
            UB-1: last valid    UB: transition -> invalid
            TC-BVA-04           TC-BVA-05 (SAVE10: uses=1, max=1)
                                TC-BVA-06 (VIP100: uses=2, max=2)
```

| BVA Point | Coupon | uses | max | State | TC |
|:---|:---|:---|:---|:---|:---|
| UB-1 (last valid) | VIP100 | 1 | 2 | VALID | TC-BVA-04 |
| UB (transition) | SAVE10 | 1 | 1 | INVALID | TC-BVA-05 |
| UB (transition) | VIP100 | 2 | 2 | INVALID | TC-BVA-06 |

---

### Target 3: `expired_at` vs `current_date`

Condition: `current_date < expired_at` (strict less-than — spec says "before")
Test date: 2026-07-02 (date of test design)

```
   INVALID            INVALID (!)              VALID
      |                    |                      |
2026-07-01──────2026-07-02 (TODAY)──────2026-07-03──...
                            ^                      ^
                       ON point                  UB+1
                   (today < today = FALSE)   (today < tomorrow = TRUE)
                       TC-BVA-07               TC-BVA-08
```

| BVA Point | `expired_at` | State | TC |
|:---|:---|:---|:---|
| ON point (= today) | 2026-07-02 | INVALID | TC-BVA-07 |
| UB+1 (= tomorrow) | 2026-07-03 | VALID | TC-BVA-08 |

---

## 3. BVA Test Cases

### TC-BVA-01 — `total_amount` one unit below threshold (OFF point)

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-01 |
| **Test Case Name** | total_amount = min_order - 1 = 299,999₫ is rejected |
| **Target Variable** | `total_amount` |
| **Boundary Point Type** | UB-1 (OFF point — one unit below the threshold) |
| **Target Variable State** | `total_amount = 299,999`, `min_order_amount = 300,000` |
| **Pre-conditions** | Coupon `SAVE10`: `is_active=1`, `expired_at=2099-12-31`, `min_order_amount=300000`; user `test@eshop.com` has not used SAVE10; valid JWT |
| **Input — `code`** | `"SAVE10"` |
| **Input — `total_amount`** | `299999` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `299999` · 4. Enter coupon code `SAVE10` in `Nhập mã giảm giá...`, then click `Áp dụng` · 5. Record the discount/error shown in the UI and the underlying `POST /api/apply-coupon` response |
| **Defect Target** | Catches bug where system uses `total_amount >= min_order_amount - 1` (off by 1) instead of `total_amount >= min_order_amount`, incorrectly accepting an order at 299,999₫ |
| **Expected Result** | ❌ On `/checkout`, after clicking `Áp dụng`, the UI shows an error and does not apply coupon `SAVE10` when `Tổng tiền thanh toán (VND)` is `299999`. API cross-check: HTTP 4xx — rejected because order total is below the threshold (299,999 < 300,000) |
| **Verification Points** | 1. On `/checkout`, an error is shown after `Áp dụng` · 2. No applied discount is shown in the UI · 3. API cross-check: HTTP status 4xx · 4. API cross-check: No `discount_amount` in response · 5. API cross-check: Confirm 299,999₫ does NOT pass C3 |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-02 — `total_amount` exactly at minimum threshold (ON point)

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-02 |
| **Test Case Name** | total_amount = min_order = 300,000₫ is accepted |
| **Target Variable** | `total_amount` |
| **Boundary Point Type** | UB (ON point — exactly at the boundary; most critical BVA case) |
| **Target Variable State** | `total_amount = 300,000`, `min_order_amount = 300,000` |
| **Pre-conditions** | Coupon `SAVE10`: active, not expired, `min_order_amount=300000`; user has not used SAVE10; valid JWT |
| **Input — `code`** | `"SAVE10"` |
| **Input — `total_amount`** | `300000` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `300000` · 4. Enter coupon code `SAVE10` in `Nhập mã giảm giá...`, then click `Áp dụng` · 5. Record the discount/error shown in the UI and the underlying `POST /api/apply-coupon` response |
| **Defect Target** | Catches bug where system uses `total_amount > min_order_amount` (strict greater-than) instead of `total_amount >= min_order_amount` — causing an order of exactly 300,000₫ to be incorrectly rejected even though it satisfies the spec condition |
| **Expected Result** | ✅ On `/checkout`, after clicking `Áp dụng`, the UI applies coupon `SAVE10`, shows the discount, and updates `Tổng tiền thanh toán (VND)` to `270000`. API cross-check: HTTP 200 + `{"discount_amount": 30000, "final_amount": 270000}` |
| **Verification Points** | 1. On `/checkout`, a discount is shown after `Áp dụng` · 2. `Tổng tiền thanh toán (VND)` is updated to `270000` · 3. API cross-check: HTTP status = 200 · 4. API cross-check: `discount_amount` = `300000 × 10 / 100` = `30000` · 5. API cross-check: `final_amount` = `300000 - 30000` = `270000` · 6. API cross-check: Confirm total = min_order PASSES C3 |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-03 — `total_amount` one unit above threshold (UB+1)

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-03 |
| **Test Case Name** | total_amount = min_order + 1 = 300,001₫ is accepted |
| **Target Variable** | `total_amount` |
| **Boundary Point Type** | UB+1 (just above the boundary, clearly in the valid range) |
| **Target Variable State** | `total_amount = 300,001`, `min_order_amount = 300,000` |
| **Pre-conditions** | Coupon `SAVE10`: active, not expired; user has not used SAVE10; valid JWT |
| **Input — `code`** | `"SAVE10"` |
| **Input — `total_amount`** | `300001` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `300001` · 4. Enter coupon code `SAVE10` in `Nhập mã giảm giá...`, then click `Áp dụng` · 5. Record the discount/error shown in the UI and the underlying `POST /api/apply-coupon` response |
| **Defect Target** | Confirms no off-by-one in the other direction — the valid range genuinely starts at 300,000, not 300,001 |
| **Expected Result** | ✅ On `/checkout`, after clicking `Áp dụng`, the UI applies coupon `SAVE10`, shows the discount, and updates `Tổng tiền thanh toán (VND)` to `270001`. API cross-check: HTTP 200 + `{"discount_amount": 30000, "final_amount": 270001}` |
| **Verification Points** | 1. On `/checkout`, a discount is shown after `Áp dụng` · 2. `Tổng tiền thanh toán (VND)` is updated to `270001` · 3. API cross-check: HTTP status = 200 · 4. API cross-check: `discount_amount` = `floor(300001 × 10 / 100)` = `30000` · 5. API cross-check: `final_amount` = `300001 - 30000` = `270001` |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-04 — `uses_by_user = max - 1`: last valid use (VIP100, max=2)

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-04 |
| **Test Case Name** | uses=1 < max=2: second use (last permitted) with VIP100 is accepted |
| **Target Variable** | `uses_by_user` |
| **Boundary Point Type** | UB-1 (last valid use before hitting the limit) |
| **Target Variable State** | `uses_by_user = 1`, `max_uses_per_user = 2` |
| **Pre-conditions** | Coupon `VIP100`: `type=fixed`, `discount_value=100000`, `min_order_amount=300000`, `max_uses_per_user=2`, `is_active=1`, not expired; user `test@eshop.com` has used VIP100 exactly **once** (`uses_by_user=1`). Setup: complete one checkout with VIP100, OR insert directly into the usage table in SQLite (see Setup Protocol) |
| **Input — `code`** | `"VIP100"` |
| **Input — `total_amount`** | `400000` (>= 300000 min_order) |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. (Setup) Log in at `/login`, then complete one full checkout purchase using `VIP100`: add any product from `/`, open `/cart` via `Giỏ hàng`, click `Tiến hành thanh toán`, overwrite `Tổng tiền thanh toán (VND)` with `400000`, enter `VIP100`, click `Áp dụng`, then click `Xác Nhận Thanh Toán` to bring `uses_by_user` to 1 · 2. Start a new order by adding any product to the cart, opening `/cart`, and clicking `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `400000` · 4. Enter coupon code `VIP100` in `Nhập mã giảm giá...`, then click `Áp dụng` again · 5. Record the discount/error shown in the UI and the underlying `POST /api/apply-coupon` response |
| **Defect Target** | Catches bug where system uses `uses_by_user < max_uses_per_user - 1` (off by 1 subtraction) instead of `uses_by_user < max_uses_per_user` — incorrectly rejecting the second use (uses=1) when max=2 |
| **Expected Result** | ✅ On `/checkout`, after clicking `Áp dụng`, the UI applies coupon `VIP100`, shows the discount, and updates `Tổng tiền thanh toán (VND)` to `300000`. API cross-check: HTTP 200 + `{"discount_amount": 100000, "final_amount": 300000}` |
| **Verification Points** | 1. On `/checkout`, a discount is shown after `Áp dụng` · 2. `Tổng tiền thanh toán (VND)` is updated to `300000` · 3. API cross-check: HTTP status = 200 · 4. API cross-check: `discount_amount` = `100000` (fixed) · 5. API cross-check: `final_amount` = `400000 - 100000` = `300000` · 6. API cross-check: Confirm uses=max-1 PASSES C5 |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-05 — `uses_by_user = max`: limit reached (SAVE10, max=1)

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-05 |
| **Test Case Name** | uses=1 = max=1: next use attempt is rejected (SAVE10) |
| **Target Variable** | `uses_by_user` |
| **Boundary Point Type** | UB (transition — at exactly max, `uses < max` first becomes FALSE) |
| **Target Variable State** | `uses_by_user = 1`, `max_uses_per_user = 1` |
| **Pre-conditions** | Coupon `SAVE10`: `max_uses_per_user=1`; user `test@eshop.com` has used SAVE10 exactly **once** (`uses_by_user=1`); valid JWT |
| **Input — `code`** | `"SAVE10"` |
| **Input — `total_amount`** | `500000` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. (Setup) Log in at `/login`, then complete one full checkout purchase using `SAVE10`: add any product from `/`, open `/cart` via `Giỏ hàng`, click `Tiến hành thanh toán`, overwrite `Tổng tiền thanh toán (VND)` with `500000`, enter `SAVE10`, click `Áp dụng`, then click `Xác Nhận Thanh Toán` to bring `uses_by_user` to 1 (= `max_uses_per_user`) · 2. Start a new order by adding any product to the cart, opening `/cart`, and clicking `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `500000` · 4. Enter coupon code `SAVE10` in `Nhập mã giảm giá...`, then click `Áp dụng` again · 5. Record the discount/error shown in the UI and the underlying `POST /api/apply-coupon` response |
| **Defect Target** | Catches bug where system uses `uses_by_user <= max_uses_per_user` instead of `uses_by_user < max_uses_per_user` — causing uses=1, max=1: `1 <= 1` = TRUE (incorrectly allowed), when correct check `1 < 1` = FALSE (must reject) |
| **Expected Result** | ❌ On `/checkout`, after clicking `Áp dụng`, the UI shows an error and does not apply coupon `SAVE10` once `uses_by_user = max_uses_per_user`. API cross-check: HTTP 4xx — rejected because usage limit is reached (uses = max) |
| **Verification Points** | 1. On `/checkout`, an error is shown after `Áp dụng` · 2. No applied discount is shown in the UI · 3. API cross-check: HTTP status 4xx · 4. API cross-check: No `discount_amount` · 5. API cross-check: Confirm uses=max does NOT pass C5 |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-06 — `uses_by_user = max`: limit reached (VIP100, max=2)

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-06 |
| **Test Case Name** | uses=2 = max=2: third use attempt is rejected (VIP100) |
| **Target Variable** | `uses_by_user` |
| **Boundary Point Type** | UB (transition at max=2) |
| **Target Variable State** | `uses_by_user = 2`, `max_uses_per_user = 2` |
| **Pre-conditions** | Coupon `VIP100`: `max_uses_per_user=2`; user has used VIP100 **twice** (`uses_by_user=2`); valid JWT |
| **Input — `code`** | `"VIP100"` |
| **Input — `total_amount`** | `400000` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. (Setup) Log in at `/login`, then complete two full checkout purchases using `VIP100`: for each purchase, add any product from `/`, open `/cart` via `Giỏ hàng`, click `Tiến hành thanh toán`, overwrite `Tổng tiền thanh toán (VND)` with `400000`, enter `VIP100`, click `Áp dụng`, then click `Xác Nhận Thanh Toán` to bring `uses_by_user` to 2 (= `max_uses_per_user`) · 2. Start a new order by adding any product to the cart, opening `/cart`, and clicking `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `400000` · 4. Enter coupon code `VIP100` in `Nhập mã giảm giá...`, then click `Áp dụng` again · 5. Record the discount/error shown in the UI and the underlying `POST /api/apply-coupon` response |
| **Defect Target** | Catches the same `uses <= max` instead of `uses < max` bug as TC-BVA-05, but with max=2 to rule out the possibility that the bug is hardcoded for max=1 specifically |
| **Expected Result** | ❌ On `/checkout`, after clicking `Áp dụng`, the UI shows an error and does not apply coupon `VIP100` once `uses_by_user = max_uses_per_user`. API cross-check: HTTP 4xx — rejected because usage limit is reached (uses = max = 2) |
| **Verification Points** | 1. On `/checkout`, an error is shown after `Áp dụng` · 2. No applied discount is shown in the UI · 3. API cross-check: HTTP status 4xx · 4. API cross-check: No `discount_amount` |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-07 — `expired_at` = today: strict boundary (most critical)

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-07 |
| **Test Case Name** | expired_at = 2026-07-02 (= today) is rejected as expired |
| **Target Variable** | `expired_at` |
| **Boundary Point Type** | ON point (expiry date equals current date — the absolute boundary) |
| **Target Variable State** | `expired_at = '2026-07-02'`, `current_date = 2026-07-02` |
| **Pre-conditions** | Create coupon `TODAYEXP` via Admin API: `POST /api/admin/coupons` with `{"code":"TODAYEXP","type":"percent","discount_value":10,"min_order_amount":100000,"expired_at":"2026-07-02","max_uses_per_user":99}`; user has not used TODAYEXP; valid JWT |
| **Input — `code`** | `"TODAYEXP"` |
| **Input — `total_amount`** | `500000` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `500000` · 4. Enter coupon code `TODAYEXP` in `Nhập mã giảm giá...`, then click `Áp dụng` · 5. Record the discount/error shown in the UI and the underlying `POST /api/apply-coupon` response |
| **Defect Target** | Catches bug where system uses `current_date <= expired_at` instead of `current_date < expired_at` (strict less-than, per spec "current date must be before expired_at"). With `<=`: `2026-07-02 <= 2026-07-02` = TRUE → coupon expiring today is incorrectly accepted |
| **Expected Result** | ❌ On `/checkout`, after clicking `Áp dụng`, the UI shows an error and does not apply coupon `TODAYEXP` when `expired_at` equals today. API cross-check: HTTP 4xx — rejected as expired (today is not "before" today per spec) |
| **Verification Points** | 1. On `/checkout`, an error is shown after `Áp dụng` · 2. No applied discount is shown in the UI · 3. API cross-check: HTTP status 4xx · 4. API cross-check: No `discount_amount` · 5. API cross-check: Confirm expired_at = today → INVALID (spec uses strict comparison) |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-08 — `expired_at` = tomorrow: still valid

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-08 |
| **Test Case Name** | expired_at = 2026-07-03 (= tomorrow) is accepted |
| **Target Variable** | `expired_at` |
| **Boundary Point Type** | UB+1 (one day past the boundary, clearly in the valid range) |
| **Target Variable State** | `expired_at = '2026-07-03'`, `current_date = 2026-07-02` |
| **Pre-conditions** | Create coupon `TOMORROWEXP` via Admin API: `POST /api/admin/coupons` with `{"code":"TOMORROWEXP","type":"percent","discount_value":10,"min_order_amount":100000,"expired_at":"2026-07-03","max_uses_per_user":99}`; user has not used TOMORROWEXP; valid JWT |
| **Input — `code`** | `"TOMORROWEXP"` |
| **Input — `total_amount`** | `500000` |
| **Input — `user_id`** | ID of `test@eshop.com` |
| **Input — Authorization** | `Bearer <valid_token>` |
| **Steps** | 1. Open `/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. From `/`, add any product to the cart, open `/cart` via `Giỏ hàng`, and click `Tiến hành thanh toán` · 3. On `/checkout`, overwrite `Tổng tiền thanh toán (VND)` with `500000` · 4. Enter coupon code `TOMORROWEXP` in `Nhập mã giảm giá...`, then click `Áp dụng` · 5. Record the discount/error shown in the UI and the underlying `POST /api/apply-coupon` response |
| **Defect Target** | Confirms a coupon expiring tomorrow is still valid; catches an off-by-one in the other direction where tomorrow is incorrectly rejected |
| **Expected Result** | ✅ On `/checkout`, after clicking `Áp dụng`, the UI applies coupon `TOMORROWEXP`, shows the discount, and updates `Tổng tiền thanh toán (VND)` to `450000`. API cross-check: HTTP 200 + `{"discount_amount": 50000, "final_amount": 450000}` |
| **Verification Points** | 1. On `/checkout`, a discount is shown after `Áp dụng` · 2. `Tổng tiền thanh toán (VND)` is updated to `450000` · 3. API cross-check: HTTP status = 200 · 4. API cross-check: `discount_amount` = `500000 × 10 / 100` = `50000` · 5. API cross-check: `final_amount` = `500000 - 50000` = `450000` · 6. API cross-check: Confirm expired_at = tomorrow → VALID |
| **Status** | ⬜ Not yet executed |

---

## 4. Defect Coverage Matrix

| TC ID | Target Variable | Boundary Point | Specific defect caught |
|:---|:---|:---|:---|
| TC-BVA-01 | `total_amount` | UB-1 = 299,999 (invalid) | Catches `>= min_order - 1` instead of `>= min_order` — off-by-one accepting sub-threshold orders |
| TC-BVA-02 | `total_amount` | UB = 300,000 (valid) | Catches `total > min_order` instead of `total >= min_order` — ON point incorrectly rejected |
| TC-BVA-03 | `total_amount` | UB+1 = 300,001 (valid) | Confirms valid range starts exactly at min_order (not min_order + 1) |
| TC-BVA-04 | `uses_by_user` | UB-1 = uses=1, max=2 (valid) | Catches `uses < max_uses_per_user - 1` instead of `uses < max_uses_per_user` — last valid use incorrectly rejected |
| TC-BVA-05 | `uses_by_user` | UB = uses=1, max=1 (invalid) | Catches `uses <= max_uses_per_user` instead of `uses < max_uses_per_user` — allows exceeding the limit when max=1 |
| TC-BVA-06 | `uses_by_user` | UB = uses=2, max=2 (invalid) | Same bug as TC-BVA-05 with max=2, rules out hardcoded max=1 |
| TC-BVA-07 | `expired_at` | ON = today 2026-07-02 (invalid) | Catches `current_date <= expired_at` instead of `current_date < expired_at` — coupon expiring today incorrectly accepted |
| TC-BVA-08 | `expired_at` | UB+1 = tomorrow 2026-07-03 (valid) | Confirms coupon expiring tomorrow is still valid; catches reverse off-by-one |

---

## 5. Setup Protocol

### Setting `uses_by_user` to exact value (TC-BVA-04, TC-BVA-05, TC-BVA-06)

```bash
# Step 1: Inspect DB schema to find the usage tracking table
sqlite3 apps/backend/database.sqlite ".tables"
sqlite3 apps/backend/database.sqlite ".schema"

# Step 2 (Option A): Complete real checkouts with the coupon to accumulate uses
# Step 2 (Option B): Insert directly (replace table/column names after schema inspection)
sqlite3 apps/backend/database.sqlite \
  "INSERT INTO <coupon_usage_table> (user_id, coupon_code, ...) VALUES (<user_id>, 'VIP100', ...)"

# Verify state after setup
sqlite3 apps/backend/database.sqlite \
  "SELECT COUNT(*) FROM <coupon_usage_table> WHERE user_id=<id> AND coupon_code='VIP100'"
```

### Creating coupons with precise `expired_at` dates (TC-BVA-07, TC-BVA-08)

```bash
# Get admin token
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eshop.com","password":"Admin123!"}' | jq -r '.token')

# Create coupon expiring today (TC-BVA-07)
curl -X POST http://localhost:3000/api/admin/coupons \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"TODAYEXP","type":"percent","discount_value":10,
       "min_order_amount":100000,"expired_at":"2026-07-02","max_uses_per_user":99}'

# Create coupon expiring tomorrow (TC-BVA-08)
curl -X POST http://localhost:3000/api/admin/coupons \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"TOMORROWEXP","type":"percent","discount_value":10,
       "min_order_amount":100000,"expired_at":"2026-07-03","max_uses_per_user":99}'
```

**Important:** TC-BVA-07 and TC-BVA-08 are date-sensitive. If executed after 2026-07-02, update `expired_at` to `current_date` (TC-BVA-07) and `current_date + 1 day` (TC-BVA-08) accordingly.

---

## 6. Test Suite Summary

| Type | TCs | Coverage |
|:---|:---|:---|
| EP — Happy Path | TC-01, TC-02 | EC14 (percent type), EC15 (fixed type) |
| EP — Negative | TC-03 → TC-11 | EC02–EC04, EC06, EC08, EC10, EC11, EC13, EC18 |
| BVA — `total_amount` | TC-BVA-01 → TC-BVA-03 | Boundary of `>= min_order_amount` |
| BVA — `uses_by_user` | TC-BVA-04 → TC-BVA-06 | Boundary of `< max_uses_per_user` |
| BVA — `expired_at` | TC-BVA-07, TC-BVA-08 | Strict `<` boundary of expiry date |
| **Total** | **19 TCs** | **100% EC (18 ECs) + 8 boundary defect targets** |
