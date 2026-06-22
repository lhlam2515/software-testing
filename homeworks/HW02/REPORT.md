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

## 2. Feature A — FR-02: Login & Account Lockout

> **Technique applied:** Domain Testing (Equivalence Partitioning) + Boundary Value Analysis  
> **Detailed test cases:** [`artifacts/tests/FR-02-login-lockout/`](artifacts/tests/FR-02-login-lockout/)

### 2.1 Domain Testing — Step-by-Step Application

#### Step 1: Identify Input & Output Variables

_Based on `docs/eshop-sut/srs.md` §2 FR-02._

| Variable | Type | Source |
| -------- | ---- | ------ |
| `email` | Input | User-entered |
| `password` | Input | User-entered |
| `fail_counter` | Internal state | Server-side, reset on success |
| `lockout_timer` | Internal state | 30s countdown on lockout |
| `result` | Output | JWT token / error / lockout message |

#### Step 2: Identify Equivalence Classes

See detailed EC table in [`artifacts/tests/FR-02-login-lockout/domain-testing.md`](artifacts/tests/FR-02-login-lockout/domain-testing.md).

| EC | Variable | Description | Type |
| -- | -------- | ----------- | ---- |
| EC1 | email | Valid format, registered | Valid |
| EC2 | email | Valid format, unregistered | Invalid |
| EC3 | email | Invalid format | Invalid |
| EC4 | email | Empty | Invalid |
| EC5 | password | Correct | Valid |
| EC6 | password | Incorrect | Invalid |
| EC7 | password | Empty | Invalid |
| EC8 | fail_counter | 0–2 (no lockout) | Valid |
| EC9 | fail_counter | ≥ 3 (locked) | Invalid |
| EC10 | lockout_timer | 0–29s (still locked) | Invalid |
| EC11 | lockout_timer | ≥ 30s (released) | Valid |

#### Step 3 & 4: Test Cases

| TC ID | EC Covered | Email | Password | Precondition | Expected Result |
| ----- | ---------- | ----- | -------- | ------------ | --------------- |
| TC-02-EP-01 | EC1,5,8 | <test@eshop.com> | Test1234! | counter=0 | JWT Token returned |
| TC-02-EP-02 | EC2 | <noone@x.com> | Test1234! | — | Error: account not found |
| TC-02-EP-03 | EC3 | invalidemail | Test1234! | — | Error: invalid email format |
| TC-02-EP-04 | EC4 | (empty) | Test1234! | — | Validation error |
| TC-02-EP-05 | EC1,6,8 | <test@eshop.com> | wrongpass | counter=0 | Error: wrong credentials |
| TC-02-EP-06 | EC7 | <test@eshop.com> | (empty) | — | Validation error |
| TC-02-EP-07 | EC1,6,9 | <test@eshop.com> | wrongpass | counter=3 | Error: account locked |
| TC-02-EP-08 | EC1,5,10 | <test@eshop.com> | Test1234! | locked, timer=15s | Error: still locked |
| TC-02-EP-09 | EC1,5,11 | <test@eshop.com> | Test1234! | locked, timer=31s | JWT Token returned |

### 2.2 Boundary Value Analysis — Step-by-Step Application

#### Boundaries Identified

| Boundary | LB | UB | Key insight |
| -------- | -- | -- | ----------- |
| fail_counter lockout | 3 | 2 | Off-by-one: counter=2 (last allowed) vs counter=3 (first locked) |
| lockout_timer release | 30s | 29s | 29s (locked) vs 30s (released) |

#### BVA Test Cases

| TC ID | Variable | Value | Point | Expected |
| ----- | -------- | ----- | ----- | -------- |
| TC-02-BVA-01 | fail_counter | 0 | Nominal | counter→1; error message |
| TC-02-BVA-02 | fail_counter | 1 | LB+1 | counter→2; error message |
| TC-02-BVA-03 | fail_counter | 2 | UB (no-lock) | counter→3; **account locked** |
| TC-02-BVA-04 | fail_counter | 3 | LB (locked) | Error: account locked 30s |
| TC-02-BVA-05 | fail_counter | 3 | LB (locked) | Correct password also rejected while locked |
| TC-02-BVA-06 | lockout_timer | 29s | UB−1 (before release) | Error: still locked |
| TC-02-BVA-07 | lockout_timer | 30s | Boundary (release) | Login possible again |
| TC-02-BVA-08 | lockout_timer | 31s | UB+1 (after release) | Login possible again |

### 2.3 AI Gap Analysis

_Điền sau khi chạy AI và review kết quả._

| # | Missed test case | Root cause (why AI missed it) |
| - | ---------------- | ----------------------------- |
| | | |

### 2.4 Execution Summary

| Metric | Count |
| ------ | ----- |
| TC Designed (EP) | 9 |
| TC Designed (BVA) | 8 |
| TC Executed | — |
| Passed | — |
| Failed | — |
| Bugs found | — |

---

## 3. Feature B — FR-09: Mã Giảm Giá (Coupon)

> **Technique applied:** Domain Testing (Equivalence Partitioning) + Boundary Value Analysis  
> **Detailed test cases:** [`artifacts/tests/FR-09-coupon/`](artifacts/tests/FR-09-coupon/)

### 3.1 Domain Testing — Step-by-Step Application

#### Step 1: Identify Input & Output Variables

_Based on `docs/eshop-sut/srs.md` §4 FR-09 — 5 conditions, 2 discount types._

| Variable | Type | Description |
| -------- | ---- | ----------- |
| `coupon_code` | Input | Mã nhập bởi user |
| `order_total` | Input | Tổng tiền đơn hàng |
| `auth_status` | Input | Đã đăng nhập hay chưa |
| `coupon.is_active` | DB | Trạng thái active |
| `coupon.expired_at` | DB | Ngày hết hạn |
| `coupon.min_order_amount` | DB | Ngưỡng tối thiểu |
| `coupon.discount_type` | DB | `percent` hoặc `fixed` |
| `coupon.discount_value` | DB | Giá trị giảm |
| `coupon.max_uses_per_user` | DB | Giới hạn lượt/người |
| `user_uses` | DB | Số lần user đã dùng |
| `final_amount` | Output | Tổng tiền sau giảm |

#### Step 2: Equivalence Classes (per condition)

| EC | Condition | Description | Type |
| -- | --------- | ----------- | ---- |
| EC1 | C1 | Mã tồn tại, `is_active=1` | Valid |
| EC2 | C1 | Mã không tồn tại | Invalid |
| EC3 | C1 | Mã tồn tại, `is_active=0` | Invalid |
| EC4 | C2 | `now() < expired_at` | Valid |
| EC5 | C2 | `now() >= expired_at` | Invalid |
| EC6 | C3 | `order_total >= min_order_amount` | Valid |
| EC7 | C3 | `order_total < min_order_amount` | Invalid |
| EC8 | C4 | JWT Token hợp lệ | Valid |
| EC9 | C4 | Chưa đăng nhập | Invalid |
| EC10 | C5 | `uses < max_uses_per_user` | Valid |
| EC11 | C5 | `uses >= max_uses_per_user` | Invalid |
| EC12 | type | `percent` — `final = total × (1 − value/100)` | Valid |
| EC13 | type | `fixed` — `final = total − value` | Valid |

#### Step 3 & 4: Test Cases

| TC ID | EC Covered | Code | Order Total | Expected |
| ----- | ---------- | ---- | ----------- | -------- |
| TC-09-EP-01 | EC1,4,6,8,10,12 | SAVE10 | 400,000₫ | final=360,000₫ (−10%) |
| TC-09-EP-02 | EC1,4,6,8,10,13 | BIGBUY | 600,000₫ | final=550,000₫ (−50,000₫) |
| TC-09-EP-03 | EC2 | FAKE123 | 400,000₫ | Error: mã không tồn tại |
| TC-09-EP-04 | EC3 | INACTIVE | 400,000₫ | Error: mã không hoạt động |
| TC-09-EP-05 | EC5 | EXPIRED | 150,000₫ | Error: mã đã hết hạn |
| TC-09-EP-06 | EC7 | SAVE10 | 200,000₫ | Error: chưa đủ ngưỡng 300,000₫ |
| TC-09-EP-07 | EC9 | SAVE10 | 400,000₫ | Error / redirect to login |
| TC-09-EP-08 | EC11 | SAVE10 | 400,000₫ | Error: đã dùng hết lượt |
| TC-09-EP-09 | EC1,4,6,8,10,13 | VIP100 (uses=1,max=2) | 400,000₫ | final=300,000₫ (−100,000₫) |

### 3.2 Boundary Value Analysis — Step-by-Step Application

#### Boundaries Identified

| Boundary | Variable | LB | UB |
| -------- | -------- | -- | -- |
| B1 | `order_total` vs SAVE10 min=300,000₫ | 300,000₫ | 299,999₫ |
| B2 | `order_total` vs BIGBUY min=500,000₫ | 500,000₫ | 499,999₫ |
| B3 | `user_uses` vs VIP100 max=2 | uses=2 (exceeded) | uses=1 (last allowed) |
| B4 | `expired_at` date | today < expired | today ≥ expired |

#### BVA Test Cases

| TC ID | Boundary | Value | Expected |
| ----- | -------- | ----- | -------- |
| TC-09-BVA-01 | B1 UB−1 | 299,999₫ | Error: chưa đủ ngưỡng |
| TC-09-BVA-02 | B1 LB | 300,000₫ | Áp dụng; −10% |
| TC-09-BVA-03 | B1 LB+1 | 300,001₫ | Áp dụng; −10% |
| TC-09-BVA-04 | B2 UB−1 | 499,999₫ | Error: chưa đủ ngưỡng |
| TC-09-BVA-05 | B2 LB | 500,000₫ | Áp dụng; −50,000₫ |
| TC-09-BVA-06 | B3 uses=1 | Last allowed | Áp dụng thành công |
| TC-09-BVA-07 | B3 uses=2 | Exceeded | Error: đã dùng hết lượt |
| TC-09-BVA-08 | B4 EXPIRED | now > expired_at | Error: mã đã hết hạn |
| TC-09-BVA-09 | B4 SAVE10 | now < 2099-12-31 | Áp dụng thành công |

### 3.3 AI Gap Analysis

_Điền sau khi chạy AI và review kết quả._

| # | Missed test case | Root cause (why AI missed it) |
| - | ---------------- | ----------------------------- |
| | | |

### 3.4 Execution Summary

| Metric | Count |
| ------ | ----- |
| TC Designed (EP) | 9 |
| TC Designed (BVA) | 9 |
| TC Executed | — |
| Passed | — |
| Failed | — |
| Bugs found | — |

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
