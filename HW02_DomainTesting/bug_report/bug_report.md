# Bug Report - HW02 Domain Testing

Các mục dưới đây là mẫu ghi nhận lỗi sau khi thực thi. Không có lỗi nào được xác nhận vì chưa chạy test thủ công. Những mục có căn cứ từ inspect code/spec được đánh dấu **Potential bug - needs execution confirmation**.

## BUG-01: Potential bug - API cập nhật profile có thể cho đổi role

**Feature:** FR-04  
**Severity:** Critical  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:** FR04-DT-08  
**Status:** Potential bug - needs execution confirmation

### Steps to Reproduce
1. Đăng nhập bằng tài khoản user thường.
2. Gửi `PUT /api/users/me` với body có `role: "admin"`.
3. Gọi lại API lấy thông tin user hoặc truy cập admin API.

### Expected Result
Backend không cho phép user tự thay đổi `role`; trả lỗi hoặc bỏ qua trường `role`.

### Actual Result
To be filled after execution.

### Evidence
Screenshot placeholder: `bug_report/screenshots/BUG-01.png`

### GitHub Issue Link
To be filled after creating issue.

## BUG-02: Potential bug - Checkout backend có thể tin `total_amount` từ client

**Feature:** FR-08 / FR-20 Mobile Checkout  
**Severity:** Critical  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:** FR08-DT-07, FR20-DT-07  
**Status:** Potential bug - needs execution confirmation

### Steps to Reproduce
1. Đăng nhập và chuẩn bị cart có tổng tiền xác định.
2. Gửi `POST /api/checkout` với `total_amount` thấp hơn tổng thật.
3. Kiểm tra order được tạo trong lịch sử/admin.

### Expected Result
Backend tự tính lại tổng tiền từ cart/server-side data hoặc từ chối payload sai.

### Actual Result
To be filled after execution.

### Evidence
Screenshot placeholder: `bug_report/screenshots/BUG-02.png`

### GitHub Issue Link
To be filled after creating issue.

## BUG-03: Potential bug - Admin API có thể thiếu kiểm tra role admin

**Feature:** FR-18  
**Severity:** Critical  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:** FR18-DT-02  
**Status:** Potential bug - needs execution confirmation

### Steps to Reproduce
1. Đăng nhập bằng user thường.
2. Dùng token user thường gọi `GET /api/admin/orders`.
3. Quan sát phản hồi.

### Expected Result
API trả 403/401 vì user không có `role=admin`.

### Actual Result
To be filled after execution.

### Evidence
Screenshot placeholder: `bug_report/screenshots/BUG-03.png`

### GitHub Issue Link
To be filled after creating issue.

## BUG-04: Potential bug - State machine có thể cho `canceled -> delivered`

**Feature:** FR-18  
**Severity:** High  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:** FR18-DT-11, FR18-BVA-06  
**Status:** Potential bug - needs execution confirmation

### Steps to Reproduce
1. Tạo hoặc tìm order trạng thái `canceled`.
2. Admin gửi `PUT /api/admin/orders/:id/status` với `status: "delivered"`.
3. Kiểm tra trạng thái order sau phản hồi.

### Expected Result
API trả lỗi vì `canceled` là final state.

### Actual Result
To be filled after execution.

### Evidence
Screenshot placeholder: `bug_report/screenshots/BUG-04.png`

### GitHub Issue Link
To be filled after creating issue.

## BUG-05: Potential bug - Mobile checkout có thể gửi thiếu item trong cart

**Feature:** FR-20 Mobile Checkout  
**Severity:** High  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:** FR20-DT-06  
**Status:** Potential bug - needs execution confirmation

### Steps to Reproduce
1. Chạy mobile app, đăng nhập và thêm nhiều sản phẩm vào cart.
2. Xác nhận checkout.
3. Inspect request/response hoặc kiểm tra order được tạo.

### Expected Result
Order chứa đầy đủ các item trong cart; backend validate dữ liệu.

### Actual Result
To be filled after execution.

### Evidence
Screenshot placeholder: `bug_report/screenshots/BUG-05.png`

### GitHub Issue Link
To be filled after creating issue.

## BUG-XX: [Short title]

**Feature:** FR-XX  
**Severity:** Low / Medium / High / Critical  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:**  
**Status:** Potential bug - needs execution confirmation / Confirmed after execution

### Steps to Reproduce
1.
2.
3.

### Expected Result

### Actual Result

### Evidence
Screenshot placeholder:

### GitHub Issue Link
To be filled after creating issue.
