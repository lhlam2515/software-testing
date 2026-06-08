# HW02 - Domain Testing on EShop

## 1. Introduction
Báo cáo này trình bày thiết kế kiểm thử Domain Testing và Boundary Value Analysis cho EShop SUT. Phạm vi tập trung vào 4 feature thuộc 4 pool: hồ sơ cá nhân, checkout, quản lý đơn hàng admin và một chức năng mobile được chọn sau khi inspect repo. Các test case chưa được thực thi, vì vậy `Actual Result` và `Verdict` đang để `Not Executed`.

## 2. Selected Features
| Pool | Feature ID | Feature Name | Reason for Selection |
|---|---|---|---|
| A | FR-04 | Quản lý hồ sơ cá nhân | Có nhiều miền dữ liệu cá nhân, phone boundary và rủi ro đổi email/role |
| B | FR-08 | Thanh toán | Luồng tài chính quan trọng, cần kiểm tra total, cart và backend recalculation |
| C | FR-18 | Quản lý đơn hàng Admin | Phụ thuộc state machine FR-10 và authorization admin |
| D | FR-20 | Mobile Checkout | Được chọn sau khi inspect mobile app; có cart/checkout flow và rủi ro UI/API mismatch |

## 3. Testing Approach
Domain Testing được dùng để chia input/condition thành miền hợp lệ và không hợp lệ, sau đó thiết kế test case bao phủ quyền truy cập, dữ liệu nhập, trạng thái và bảo mật. Boundary Value Analysis tập trung vào các điểm ngay dưới biên, tại biên và trên biên như độ dài phone, số item trong cart, quantity, total amount, coupon threshold và final states của order.

## 4. Feature A Summary - FR-04
FR-04 có 12 Domain Testing cases và 6 BVA cases. Các ca chính gồm cập nhật profile hợp lệ, phone 10/11 chữ số, phone sai prefix, phone quá ngắn/quá dài, đổi email, đổi role, cập nhật profile người khác và địa chỉ chứa HTML/script. Bug confirmed: 0. Potential bugs được ghi trong bug report sau khi inspect code.

## 5. Feature B Summary - FR-08
FR-08 có 12 Domain Testing cases và 6 BVA cases. Các ca chính gồm checkout hợp lệ, chưa đăng nhập, cart rỗng, một/nhiều sản phẩm, sửa total ở UI/API, manipulated `total_amount`, cart clear sau checkout và quantity/price edge cases. Bug confirmed: 0.

## 6. Feature C Summary - FR-18
FR-18 có 12 Domain Testing cases và 6 BVA cases. Các ca chính gồm admin xem tất cả orders, user thường/không token bị chặn, các transition hợp lệ, invalid transition, final states `delivered`/`canceled` và shipping address HTML escaping. Bug confirmed: 0.

## 7. Feature D Summary - Selected Mobile Feature
Feature D được chọn là FR-20 Mobile Checkout. Báo cáo có 12 Domain Testing cases và 6 BVA cases. Các ca chính gồm mobile checkout hợp lệ, chưa login, cart rỗng, một/nhiều item, coupon hợp lệ/không hợp lệ, manipulated total, payload thiếu item, network error và cart clear sau thành công. Bug confirmed: 0.

## 8. Test Summary
| Feature | DT Cases | BVA Cases | Total Cases | Executed | Passed | Failed | Not Executed | Bugs |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| FR-04 Profile | 12 | 6 | 18 | 0 | 0 | 0 | 18 | 0 confirmed |
| FR-08 Checkout | 12 | 6 | 18 | 0 | 0 | 0 | 18 | 0 confirmed |
| FR-18 Admin Order Management | 12 | 6 | 18 | 0 | 0 | 0 | 18 | 0 confirmed |
| FR-20 Mobile Checkout | 12 | 6 | 18 | 0 | 0 | 0 | 18 | 0 confirmed |
| **Total** | **48** | **24** | **72** | **0** | **0** | **0** | **72** | **0 confirmed** |

## 9. Bug Summary
Không có bug nào được xác nhận vì chưa thực thi test. `bug_report/bug_report.md` có 5 potential bugs cần xác nhận:
- FR-04: API profile có thể cho đổi role.
- FR-08/FR-20: checkout backend có thể tin `total_amount` từ client.
- FR-18: admin API có thể thiếu kiểm tra role admin.
- FR-18: state machine có thể cho `canceled -> delivered`.
- FR-20: mobile checkout có thể gửi thiếu item trong cart.

## 10. AI Gap Analysis Summary
AI hữu ích để tạo cấu trúc báo cáo và test cases ban đầu, nhưng có thể bỏ sót state-machine cases, backend recalculation, authorization bypass, HTML escaping và UI/API mismatch. Người kiểm thử đã bổ sung các ca thủ công dựa trên SRS, API spec và inspect mobile/backend code.

## 11. Conclusion
Bộ tài liệu HW02 đã sẵn sàng cho bước review thủ công, export PDF và thực thi test. Trước khi nộp, cần chạy EShop SUT, cập nhật Actual Result/Verdict, bổ sung screenshot/video evidence, xác nhận hoặc loại bỏ potential bugs và tạo GitHub issues nếu có lỗi thật.
