# FR-16 — Import Sản phẩm từ CSV: Boundary Value Analysis

## 1. Identified Boundaries

### Boundary 1: `price` — phải > 0

| Partition | Condition | Boundary |
| --------- | --------- | -------- |
| Invalid | price ≤ 0 | UB = 0 |
| Valid | price > 0 | LB = 1 (hoặc 0.01 nếu float) |

### Boundary 2: `name` length

Spec không định nghĩa max length cho name ở FR-16 (chỉ FR-15 có max 255 ký tự). Test cả hai giới hạn.

| Partition | Condition | Boundary |
| --------- | --------- | -------- |
| Invalid | length = 0 (empty) | UB = 0 |
| Valid | length ≥ 1 | LB = 1 |
| Edge (FR-15 context) | length = 255 | UB |
| Edge (FR-15 context) | length = 256 | UB+1 |

### Boundary 3: số dòng (rows) trong file

| Partition | Scenario | Boundary |
| --------- | -------- | -------- |
| Edge low | 0 data rows (chỉ header) | LB = 0 |
| Nominal | 1 data row | LB+1 = 1 |
| Large | N rows (performance edge) | — |

---

## 2. BVA Test Cases

### Boundary 1: price

| TC ID | price value | Point | Expected |
| ----- | ----------- | ----- | -------- |
| TC-16-BVA-01 | -1 | Below invalid | Rollback; error: price phải dương |
| TC-16-BVA-02 | 0 | UB invalid | Rollback; error: price phải dương |
| TC-16-BVA-03 | 1 | LB valid | Import thành công |
| TC-16-BVA-04 | 0.01 | LB valid (float) | Import thành công (nếu system hỗ trợ decimal) |
| TC-16-BVA-05 | 2 | LB+1 nominal | Import thành công |

### Boundary 2: name length

| TC ID | name value | Length | Point | Expected |
| ----- | ---------- | ------ | ----- | -------- |
| TC-16-BVA-06 | `""` | 0 | LB invalid | Rollback; error: name rỗng |
| TC-16-BVA-07 | `"A"` | 1 | LB valid | Import thành công |
| TC-16-BVA-08 | `"A" × 254` | 254 | UB−1 | Import thành công |
| TC-16-BVA-09 | `"A" × 255` | 255 | UB | Import thành công |
| TC-16-BVA-10 | `"A" × 256` | 256 | UB+1 | Lỗi hoặc truncate? (cần verify) |

### Boundary 3: số dòng

| TC ID | Rows | Point | Expected |
| ----- | ---- | ----- | -------- |
| TC-16-BVA-11 | 0 (chỉ header) | LB | Import 0 sản phẩm; không rollback |
| TC-16-BVA-12 | 1 (valid) | LB+1 | Import 1 sản phẩm |
| TC-16-BVA-13 | 1 valid + 1 lỗi | Mixed | Rollback toàn bộ (kể cả row valid) |

---

## 3. Test Data Files

> Xem thư mục `test-data/` cho các file CSV mẫu.

| File | Description |
| ---- | ----------- |
| `valid-all.csv` | Tất cả rows hợp lệ |
| `empty.csv` | File rỗng |
| `header-only.csv` | Chỉ có header |
| `price-zero.csv` | 1 row có price = 0 |
| `price-negative.csv` | 1 row có price = -1 |
| `name-empty.csv` | 1 row có name rỗng |
| `mixed-valid-invalid.csv` | 5 valid + 1 invalid |
| `comma-in-field.csv` | Field có dấu phẩy bọc `"` |
| `name-255.csv` | name đúng 255 ký tự |
| `name-256.csv` | name 256 ký tự |

---

## 4. Execution Log

| TC ID | Executed? | Actual Result | Pass/Fail | Bug ID |
| ----- | --------- | ------------- | --------- | ------ |
| TC-16-BVA-01 | | | | |
| TC-16-BVA-02 | | | | |
| TC-16-BVA-03 | | | | |
| TC-16-BVA-04 | | | | |
| TC-16-BVA-05 | | | | |
| TC-16-BVA-06 | | | | |
| TC-16-BVA-07 | | | | |
| TC-16-BVA-08 | | | | |
| TC-16-BVA-09 | | | | |
| TC-16-BVA-10 | | | | |
| TC-16-BVA-11 | | | | |
| TC-16-BVA-12 | | | | |
| TC-16-BVA-13 | | | | |
