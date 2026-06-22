# FR-20 — Hủy Đơn Hàng (Mobile): Boundary Value Analysis

## 1. Identified Boundaries

FR-20 Cancel Order là state-based feature. BVA áp dụng cho **transitions tại biên** giữa trạng thái được phép và không được phép hủy.

### Boundary: allowed vs forbidden cancel states

| Partition | States | Boundary |
| --------- | ------ | -------- |
| Allowed (can cancel) | `pending`, `confirmed` | Upper: `confirmed` |
| Forbidden (cannot cancel) | `shipping`, `delivered`, `canceled` | Lower: `shipping` |

**Critical boundary:** `confirmed` (last allowed) ↔ `shipping` (first forbidden)

---

## 2. BVA Test Cases — State Transition Boundary

> Mỗi test phải thực hiện state transition đúng thứ tự trước khi cancel.

| TC ID | Order State | State Position | Expected |
| ----- | ----------- | -------------- | -------- |
| TC-20-BVA-01 | `pending` | Trạng thái đầu tiên | Hủy thành công → `canceled` |
| TC-20-BVA-02 | `confirmed` | Trạng thái cuối được phép hủy (UB) | Hủy thành công → `canceled` |
| TC-20-BVA-03 | `shipping` | Trạng thái đầu tiên bị cấm (LB of forbidden) | Error: không được hủy |
| TC-20-BVA-04 | `delivered` | Final state | Error: không được hủy |
| TC-20-BVA-05 | `canceled` | Final state (đã hủy) | Error: đã ở trạng thái kết thúc |

### Timing boundary — cancel ngay sau khi state change

| TC ID | Scenario | Expected |
| ----- | -------- | -------- |
| TC-20-BVA-06 | Admin vừa chuyển `confirmed → shipping`, user ngay lập tức bấm hủy | Error: không thể hủy (đã `shipping`) |
| TC-20-BVA-07 | Order vừa được tạo (`pending`), user ngay lập tức hủy | Hủy thành công |

---

## 3. Execution Log

| TC ID | Executed? | Actual Result | Pass/Fail | Bug ID |
| ----- | --------- | ------------- | --------- | ------ |
| TC-20-BVA-01 | | | | |
| TC-20-BVA-02 | | | | |
| TC-20-BVA-03 | | | | |
| TC-20-BVA-04 | | | | |
| TC-20-BVA-05 | | | | |
| TC-20-BVA-06 | | | | |
| TC-20-BVA-07 | | | | |
