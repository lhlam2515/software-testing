# FR-20 — Hủy Đơn Hàng (Mobile): Domain Testing

## 1. Feature Overview

**Feature:** FR-20 — Cancel Order (Mobile App)  
**Technique:** Domain Testing (Equivalence Partitioning)  
**Source:** `docs/eshop-sut/srs.md` — Section 7, FR-20 + FR-10 (State Machine)

**Business rule:** Người dùng chỉ được hủy đơn khi trạng thái là `pending` hoặc `confirmed`.  
Khi ở `shipping`, `delivered`, `canceled` → **không được hủy**.

**State Machine (FR-10):**
```
pending → confirmed → shipping → delivered  (final)
   ↓          ↓
canceled   canceled  (final — chỉ admin hủy từ shipping)
```

---

## 2. Step 1 — Identify Input & Output Variables

| Variable | Type | Description |
| -------- | ---- | ----------- |
| `order.status` | Input | Trạng thái hiện tại của đơn hàng |
| `actor` | Input | User hoặc Admin thực hiện hủy |
| `cancel_action` | Input | Người dùng bấm "Hủy đơn" trên mobile |
| `result` | Output | Đơn chuyển sang `canceled` / Error message |

---

## 3. Step 2 — Identify Equivalence Classes

### Variable: `order.status`

| EC | Status | Actor | Can Cancel? | Type |
| -- | ------ | ----- | ----------- | ---- |
| EC1 | `pending` | User | ✅ Có | Valid |
| EC2 | `confirmed` | User | ✅ Có | Valid |
| EC3 | `shipping` | User | ❌ Không | Invalid |
| EC4 | `delivered` | User | ❌ Không (final state) | Invalid |
| EC5 | `canceled` | User | ❌ Không (final state) | Invalid |

### Variable: `actor`

| EC | Actor | Type |
| -- | ----- | ---- |
| EC6 | User đã đăng nhập, đúng chủ đơn | Valid |
| EC7 | User chưa đăng nhập | Invalid |
| EC8 | User đăng nhập nhưng không phải chủ đơn | Invalid |

---

## 4. Step 3 — Select Test Cases

| TC ID | EC Covered | Order Status | Actor | Expected Output |
| ----- | ---------- | ------------ | ----- | --------------- |
| TC-20-EP-01 | EC1, EC6 | `pending` | User (owner) | Đơn → `canceled`; success message |
| TC-20-EP-02 | EC2, EC6 | `confirmed` | User (owner) | Đơn → `canceled`; success message |
| TC-20-EP-03 | EC3, EC6 | `shipping` | User (owner) | Error: không thể hủy ở trạng thái này |
| TC-20-EP-04 | EC4, EC6 | `delivered` | User (owner) | Error: đơn đã giao, không thể hủy |
| TC-20-EP-05 | EC5, EC6 | `canceled` | User (owner) | Error: đơn đã bị hủy rồi |
| TC-20-EP-06 | EC7 | `pending` | Not logged in | Redirect login / error 401 |
| TC-20-EP-07 | EC8 | `pending` | User (not owner) | Error 403: không có quyền |

---

## 5. State Transition Coverage

| From State | To State | Actor | Valid? | TC |
| ---------- | -------- | ----- | ------ | -- |
| pending | canceled | User | ✅ | TC-20-EP-01 |
| confirmed | canceled | User | ✅ | TC-20-EP-02 |
| shipping | canceled | User | ❌ | TC-20-EP-03 |
| delivered | canceled | User | ❌ | TC-20-EP-04 |
| canceled | canceled | User | ❌ | TC-20-EP-05 |

---

## 6. Step 4 — Boundary Value Analysis

> Xem chi tiết tại: `bva.md`

---

## 7. AI Gap Analysis

_Điền sau khi chạy AI và review kết quả._

---

## 8. Execution Log

| TC ID | Executed? | Actual Result | Pass/Fail | Bug ID |
| ----- | --------- | ------------- | --------- | ------ |
| TC-20-EP-01 | | | | |
| TC-20-EP-02 | | | | |
| TC-20-EP-03 | | | | |
| TC-20-EP-04 | | | | |
| TC-20-EP-05 | | | | |
| TC-20-EP-06 | | | | |
| TC-20-EP-07 | | | | |
