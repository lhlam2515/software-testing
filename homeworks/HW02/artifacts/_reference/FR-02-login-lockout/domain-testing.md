# FR-02 — Login & Account Lockout: Domain Testing

## 1. Feature Overview

**Feature:** FR-02 — Đăng nhập & Khóa tài khoản  
**Technique:** Domain Testing (Equivalence Partitioning)  
**Source:** `docs/eshop-sut/srs.md` — Section 2, FR-02

---

## 2. Step 1 — Identify Input & Output Variables

| Variable | Type | Description |
| -------- | ---- | ----------- |
| `email` | Input | Địa chỉ email người dùng nhập |
| `password` | Input | Mật khẩu người dùng nhập |
| `fail_counter` | Internal | Số lần đăng nhập sai liên tiếp |
| `lockout_timer` | Internal | Thời gian đã trôi qua từ khi bị khóa |
| `result` | Output | JWT token / error message / lockout message |

---

## 3. Step 2 — Identify Equivalence Classes

### Variable: `email`

| EC | Description | Type |
| -- | ----------- | ---- |
| EC1 | Email có định dạng hợp lệ và đã đăng ký | Valid |
| EC2 | Email có định dạng hợp lệ nhưng chưa đăng ký | Invalid |
| EC3 | Email sai định dạng (không có @, không có domain) | Invalid |
| EC4 | Email rỗng | Invalid |

### Variable: `password`

| EC | Description | Type |
| -- | ----------- | ---- |
| EC5 | Mật khẩu đúng với email tương ứng | Valid |
| EC6 | Mật khẩu sai (không khớp) | Invalid |
| EC7 | Mật khẩu rỗng | Invalid |

### Variable: `fail_counter` (số lần sai liên tiếp)

| EC | Range | Type |
| -- | ----- | ---- |
| EC8 | 0 ≤ counter ≤ 2 | Valid (chưa bị khóa) |
| EC9 | counter ≥ 3 | Invalid (bị khóa 30s) |

### Variable: `lockout_timer` (giây kể từ lúc khóa)

| EC | Range | Type |
| -- | ----- | ---- |
| EC10 | 0 ≤ timer < 30s | Invalid (đang bị khóa) |
| EC11 | timer ≥ 30s | Valid (hết thời gian khóa) |

### Output classes

| EC | Description |
| -- | ----------- |
| EC12 | JWT Token (đăng nhập thành công) |
| EC13 | Error message: sai thông tin |
| EC14 | Error message: tài khoản bị khóa |

---

## 4. Step 3 — Select Test Cases (Equivalence Partitioning)

| TC ID | EC Covered | Email | Password | Precondition | Expected Output |
| ----- | ---------- | ----- | -------- | ------------ | --------------- |
| TC-02-EP-01 | EC1, EC5, EC8, EC12 | test@eshop.com | Test1234! | counter=0 | JWT Token, đăng nhập thành công |
| TC-02-EP-02 | EC2, EC13 | notexist@eshop.com | Test1234! | — | Error: email không tồn tại |
| TC-02-EP-03 | EC3, EC13 | invalidemail | Test1234! | — | Error: định dạng email không hợp lệ |
| TC-02-EP-04 | EC4, EC13 | (rỗng) | Test1234! | — | Validation error: email bắt buộc |
| TC-02-EP-05 | EC1, EC6, EC8, EC13 | test@eshop.com | wrongpass | counter=0 | Error: sai mật khẩu |
| TC-02-EP-06 | EC7, EC13 | test@eshop.com | (rỗng) | — | Validation error: mật khẩu bắt buộc |
| TC-02-EP-07 | EC1, EC6, EC9, EC14 | test@eshop.com | wrongpass | counter=3 | Error: tài khoản bị khóa |
| TC-02-EP-08 | EC1, EC5, EC10, EC14 | test@eshop.com | Test1234! | locked, timer=15s | Error: tài khoản đang bị khóa |
| TC-02-EP-09 | EC1, EC5, EC11, EC12 | test@eshop.com | Test1234! | locked, timer=31s | JWT Token, đăng nhập thành công |

---

## 5. Step 4 — Boundary Value Analysis

> Xem chi tiết tại: `bva.md`

---

## 6. AI Gap Analysis

_Điền sau khi chạy AI và review kết quả._

---

## 7. Execution Log

| TC ID | Executed? | Actual Result | Pass/Fail | Notes |
| ----- | --------- | ------------- | --------- | ----- |
| TC-02-EP-01 | | | | |
| TC-02-EP-02 | | | | |
| TC-02-EP-03 | | | | |
| TC-02-EP-04 | | | | |
| TC-02-EP-05 | | | | |
| TC-02-EP-06 | | | | |
| TC-02-EP-07 | | | | |
| TC-02-EP-08 | | | | |
| TC-02-EP-09 | | | | |
