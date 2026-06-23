# FR-09 — Mã Giảm Giá (Coupon): Domain Testing

## 1. Feature Overview

**Feature:** FR-09 — Mã Giảm Giá  
**Technique:** Domain Testing (Equivalence Partitioning)  
**Source:** `docs/eshop-sut/srs.md` — Section 4, FR-09

**5 điều kiện phải đồng thời thỏa mãn:**

| # | Condition | Rule |
| - | --------- | ---- |
| C1 | Mã tồn tại | `is_active = 1` trong CSDL |
| C2 | Còn hạn sử dụng | `now() < expired_at` |
| C3 | Đủ ngưỡng đơn hàng | `total >= min_order_amount` |
| C4 | Đã đăng nhập | JWT Token hợp lệ |
| C5 | Chưa dùng hết lượt | `uses < max_uses_per_user` |

---

## 2. Step 1 — Identify Input & Output Variables

| Variable | Type | Description |
| -------- | ---- | ----------- |
| `coupon_code` | Input | Chuỗi mã coupon người dùng nhập |
| `order_total` | Input | Tổng tiền đơn hàng trước giảm |
| `auth_status` | Input | Trạng thái đăng nhập (logged in / not) |
| `coupon.is_active` | Lookup | Trạng thái hoạt động của mã |
| `coupon.expired_at` | Lookup | Ngày hết hạn |
| `coupon.min_order_amount` | Lookup | Ngưỡng tối thiểu |
| `coupon.discount_type` | Lookup | `percent` hoặc `fixed` |
| `coupon.discount_value` | Lookup | Giá trị giảm |
| `coupon.max_uses_per_user` | Lookup | Số lần tối đa/người |
| `user_uses` | Lookup | Số lần user đã dùng mã này |
| `final_amount` | Output | Tổng tiền sau giảm |
| `error_message` | Output | Thông báo lỗi nếu coupon không hợp lệ |

---

## 3. Step 2 — Identify Equivalence Classes

### C1: Tồn tại & active

| EC | Description | Type |
| -- | ----------- | ---- |
| EC1 | Mã tồn tại trong CSDL và `is_active = 1` | Valid |
| EC2 | Mã không tồn tại trong CSDL | Invalid |
| EC3 | Mã tồn tại nhưng `is_active = 0` | Invalid |

### C2: Hạn sử dụng

| EC | Description | Type |
| -- | ----------- | ---- |
| EC4 | `now() < expired_at` (còn hạn) | Valid |
| EC5 | `now() >= expired_at` (đã hết hạn) | Invalid |

### C3: Ngưỡng đơn hàng

| EC | Description | Type |
| -- | ----------- | ---- |
| EC6 | `order_total >= min_order_amount` | Valid |
| EC7 | `order_total < min_order_amount` | Invalid |

### C4: Trạng thái đăng nhập

| EC | Description | Type |
| -- | ----------- | ---- |
| EC8 | Có JWT Token hợp lệ | Valid |
| EC9 | Chưa đăng nhập / token invalid | Invalid |

### C5: Lượt sử dụng

| EC | Description | Type |
| -- | ----------- | ---- |
| EC10 | `user_uses < max_uses_per_user` | Valid |
| EC11 | `user_uses >= max_uses_per_user` | Invalid |

### Discount type

| EC | Description | Type |
| -- | ----------- | ---- |
| EC12 | `type = percent` — `final = total × (1 - value/100)` | Valid |
| EC13 | `type = fixed` — `final = total - value` | Valid |

---

## 4. Step 3 — Select Test Cases

> **Nguyên tắc:** Happy path gom nhiều valid EC; mỗi invalid EC phải có TC riêng (isolate failure).

| TC ID | EC Covered | Code | Order Total | Auth | Expected Output |
| ----- | ---------- | ---- | ----------- | ---- | --------------- |
| TC-09-EP-01 | EC1,EC4,EC6,EC8,EC10,EC12 | SAVE10 | 400,000₫ | logged in | final = 360,000₫ (−10%) |
| TC-09-EP-02 | EC1,EC4,EC6,EC8,EC10,EC13 | BIGBUY | 600,000₫ | logged in | final = 550,000₫ (−50,000₫) |
| TC-09-EP-03 | EC2 | FAKE123 | 400,000₫ | logged in | Error: mã không tồn tại |
| TC-09-EP-04 | EC3 | INACTIVE | 400,000₫ | logged in | Error: mã không hoạt động |
| TC-09-EP-05 | EC5 | EXPIRED | 150,000₫ | logged in | Error: mã đã hết hạn |
| TC-09-EP-06 | EC7 | SAVE10 | 200,000₫ | logged in | Error: đơn hàng chưa đủ ngưỡng (< 300,000₫) |
| TC-09-EP-07 | EC9 | SAVE10 | 400,000₫ | not logged in | Redirect to login / error |
| TC-09-EP-08 | EC11 | SAVE10 | 400,000₫ | logged in, used 1× | Error: đã dùng hết lượt |
| TC-09-EP-09 | EC1,EC4,EC6,EC8,EC10,EC13 | VIP100 | 400,000₫ | logged in, used 1× (max=2) | final = 300,000₫ (−100,000₫) |

---

## 5. Step 4 — Boundary Value Analysis

> Xem chi tiết tại: `bva.md`

---

## 6. AI Gap Analysis

_Điền sau khi chạy AI và review kết quả._

---

## 7. Execution Log

| TC ID | Executed? | Actual Result | Pass/Fail | Bug ID |
| ----- | --------- | ------------- | --------- | ------ |
| TC-09-EP-01 | | | | |
| TC-09-EP-02 | | | | |
| TC-09-EP-03 | | | | |
| TC-09-EP-04 | | | | |
| TC-09-EP-05 | | | | |
| TC-09-EP-06 | | | | |
| TC-09-EP-07 | | | | |
| TC-09-EP-08 | | | | |
| TC-09-EP-09 | | | | |
