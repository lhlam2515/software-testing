# FR-09 — Mã Giảm Giá (Coupon): Boundary Value Analysis

## 1. Identified Boundaries

### Boundary 1: `order_total` vs `min_order_amount`

Dùng mã `SAVE10` (min = 300,000₫) và `BIGBUY` (min = 500,000₫).

| Partition | Condition | Boundary |
| --------- | --------- | -------- |
| Không đủ ngưỡng | total < min | UB = min − 1 |
| Đủ ngưỡng | total ≥ min | LB = min |

### Boundary 2: `max_uses_per_user`

Dùng mã `VIP100` (max = 2).

| Partition | Condition | Boundary |
| --------- | --------- | -------- |
| Còn lượt | uses < max | UB = max − 1 |
| Hết lượt | uses ≥ max | LB = max |

### Boundary 3: `expired_at` (date boundary)

| Partition | Condition | Boundary |
| --------- | --------- | -------- |
| Còn hạn | now < expired_at | today < expired_at |
| Hết hạn | now ≥ expired_at | today = expired_at |

### Boundary 4: `discount_value = fixed` — final_amount có thể âm?

| Partition | Condition | Boundary |
| --------- | --------- | -------- |
| final > 0 | total > discount_value | LB = discount_value + 1 |
| final ≤ 0 | total ≤ discount_value | UB = discount_value |

---

## 2. BVA Test Cases

### Boundary 1: order_total vs min_order_amount (SAVE10, min=300,000₫)

| TC ID | Order Total | Point | Expected |
| ----- | ----------- | ----- | -------- |
| TC-09-BVA-01 | 299,999₫ | UB−1 (below) | Error: chưa đủ ngưỡng |
| TC-09-BVA-02 | 300,000₫ | LB (boundary) | Áp dụng thành công; final = 270,000₫ |
| TC-09-BVA-03 | 300,001₫ | LB+1 | Áp dụng thành công; final = 270,001₫ |

### Boundary 1b: order_total vs min_order_amount (BIGBUY, min=500,000₫)

| TC ID | Order Total | Point | Expected |
| ----- | ----------- | ----- | -------- |
| TC-09-BVA-04 | 499,999₫ | UB−1 (below) | Error: chưa đủ ngưỡng |
| TC-09-BVA-05 | 500,000₫ | LB (boundary) | Áp dụng thành công; final = 450,000₫ |
| TC-09-BVA-06 | 500,001₫ | LB+1 | Áp dụng thành công; final = 450,001₫ |

### Boundary 2: max_uses_per_user (VIP100, max=2)

| TC ID | User uses count | Point | Expected |
| ----- | --------------- | ----- | -------- |
| TC-09-BVA-07 | 0 | Nominal | Áp dụng thành công (lần 1) |
| TC-09-BVA-08 | 1 | UB−1 (last allowed) | Áp dụng thành công (lần 2) |
| TC-09-BVA-09 | 2 | LB (exceeded) | Error: đã dùng hết lượt |

### Boundary 3: expired_at (dùng mã EXPIRED — expired_at=2020-01-01)

| TC ID | Scenario | Expected |
| ----- | -------- | -------- |
| TC-09-BVA-10 | now > expired_at (hết hạn) | Error: mã đã hết hạn |
| TC-09-BVA-11 | Mã SAVE10 — now < expired_at (2099-12-31) | Áp dụng thành công |

### Boundary 4: final_amount khi fixed discount > order_total

| TC ID | Order Total | Discount | Expected final_amount |
| ----- | ----------- | -------- | --------------------- |
| TC-09-BVA-12 | 49,999₫ | BIGBUY (−50,000₫) | Lỗi hoặc final = 0 (không âm) |
| TC-09-BVA-13 | 50,000₫ | BIGBUY (−50,000₫) | final = 0 |
| TC-09-BVA-14 | 50,001₫ | BIGBUY (−50,000₫) | final = 1₫ |

> **Lưu ý:** TC-09-BVA-12/13/14 cần ngưỡng đơn hàng ≥ 500,000₫ (BIGBUY) để coupon được áp dụng. Điều chỉnh order_total = 500,000₫ và verify final_amount tính đúng.

---

## 3. Execution Log

| TC ID | Executed? | Actual Result | Pass/Fail | Bug ID |
| ----- | --------- | ------------- | --------- | ------ |
| TC-09-BVA-01 | | | | |
| TC-09-BVA-02 | | | | |
| TC-09-BVA-03 | | | | |
| TC-09-BVA-04 | | | | |
| TC-09-BVA-05 | | | | |
| TC-09-BVA-06 | | | | |
| TC-09-BVA-07 | | | | |
| TC-09-BVA-08 | | | | |
| TC-09-BVA-09 | | | | |
| TC-09-BVA-10 | | | | |
| TC-09-BVA-11 | | | | |
| TC-09-BVA-12 | | | | |
| TC-09-BVA-13 | | | | |
| TC-09-BVA-14 | | | | |
