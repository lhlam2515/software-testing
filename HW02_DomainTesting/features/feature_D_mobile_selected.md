# FR-20 - Mobile Checkout

## 1. Feature Overview
Feature D được chọn là **Mobile Checkout** trong FR-20. Đây là luồng thanh toán trên ứng dụng React Native/Expo, cho phép người dùng di động xem giỏ hàng, áp dụng mã giảm giá nếu có và xác nhận đặt hàng.

**Lý do chọn:** Sau khi inspect `apps/frontend-mobile/App.js`, mobile app có màn hình cart/checkout, hàm `openCheckout`, `handleConfirmCheckout`, `handleApplyCoupon` và trạng thái cart/order. Mobile Checkout là chức năng quan trọng, có rủi ro cao vì liên quan tiền, đăng nhập, dữ liệu cart và khác biệt giữa client mobile với backend.

## 2. Requirement Summary
FR-20 yêu cầu mobile có đầy đủ chức năng, trong đó có giỏ hàng và thanh toán. Với Mobile Checkout, áp dụng yêu cầu FR-08: chỉ user đăng nhập được checkout, tổng tiền tự tính từ cart, danh sách sản phẩm phải hiển thị đầy đủ, backend phải tính lại tổng và cart phải được xóa sau checkout thành công.

## 3. Domain Testing

### 3.1 Input Variables / Conditions
| Variable / Condition | Description | Valid Domain | Invalid Domain |
|---|---|---|---|
| Trạng thái đăng nhập mobile | User trong state mobile | Đã login và có token | Chưa login, token rỗng/hết hạn |
| Cart mobile | State `cart` trong app | Có ít nhất 1 item hợp lệ | Cart rỗng, item thiếu/sai dữ liệu |
| Quantity mobile | Số lượng item | Số nguyên dương | 0, âm, text, quá lớn |
| Total mobile | `cartTotal`/final amount | Tính từ item price*quantity | Editable/sai lệch so với cart |
| Coupon mobile | Mã giảm giá nếu dùng | Mã hợp lệ theo FR-09 | Rỗng, hết hạn, không đủ min, vượt lượt |
| Payload checkout | Body gửi backend | Không làm mất item, tổng được backend xác minh | Gửi thiếu item, `total_amount` bị sửa |
| Network/API | Kết nối tới backend LAN | API_URL đúng, server chạy | Sai IP, mất mạng, API trả lỗi |
| Sau checkout | State sau thành công | Cart rỗng, success message, orders reload | Cart còn item, order thiếu item |

### 3.2 Domain Analysis Explanation
Mobile Checkout được phân tích theo miền giao diện di động, miền trạng thái local và miền API. Vì mobile app giữ cart ở state client, cần kiểm thử các miền cart rỗng/có item, quantity hợp lệ/bất hợp lệ và token hợp lệ/không hợp lệ. Ngoài ra, vì checkout gửi payload đến backend, phải có ca kiểm tra dữ liệu bị thao túng hoặc thiếu item để phát hiện UI/API mismatch.

### 3.3 Domain Testing Test Cases
| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR20-DT-01 | Valid domain | Mobile checkout hợp lệ | User mobile đã login, cart có item | 1 sản phẩm quantity 1 | Mở Cart, bấm Checkout, xác nhận | Tạo order thành công, cart rỗng | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-01.png |
| FR20-DT-02 | Invalid domain | Chưa đăng nhập | Cart có item, user null | Bấm checkout | App yêu cầu đăng nhập/chuyển login | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-02.png |
| FR20-DT-03 | Invalid domain | Cart rỗng | User đã login, cart rỗng | Bấm checkout nếu nút xuất hiện | Không cho xác nhận hoặc hiển thị cart rỗng | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-03.png |
| FR20-DT-04 | Valid domain | Một item | User login | Cart: 1 item, qty 1 | Checkout | UI hiển thị đúng 1 item, tổng đúng | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-04.png |
| FR20-DT-05 | Valid domain | Nhiều item | User login | Cart: >=2 item | Checkout | UI hiển thị đủ item và tổng = sum | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-05.png |
| FR20-DT-06 | Security domain | Payload mobile thiếu item | User login, cart nhiều item | Inspect request body | Checkout trên mobile/proxy request | Backend không tạo order thiếu sản phẩm; phải dựa dữ liệu cart server hoặc validate | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-06.png |
| FR20-DT-07 | Security domain | Manipulated total | User login, cart sum=300000 | total_amount: 1 qua proxy/API | Gửi checkout | Backend tính lại/từ chối, không lưu tổng sai | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-07.png |
| FR20-DT-08 | Coupon domain | Coupon hợp lệ | User login, cart đủ min | SAVE10/VIP100 nếu đủ điều kiện | Apply coupon, checkout | Final amount đúng, order dùng tổng đã validate | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-08.png |
| FR20-DT-09 | Coupon invalid | Coupon hết hạn/không đủ min | User login | EXPIRED hoặc total dưới min | Apply coupon | Hiển thị lỗi rõ, không đổi final amount | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-09.png |
| FR20-DT-10 | State domain | Cart clear sau thành công | User login, cart có item | Checkout thành công | Quay lại Cart | Cart rỗng, success message hiển thị | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-10.png |
| FR20-DT-11 | Network domain | API_URL sai/mất mạng | Mobile app không kết nối backend | Checkout | Xác nhận | Hiển thị lỗi thân thiện, không clear cart | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-11.png |
| FR20-DT-12 | Invalid domain | Quantity bất thường | User login | quantity 0/âm/text nếu sửa state/input | Checkout | Từ chối hoặc normalize an toàn, không sai tổng | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-12.png |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables
| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Số item cart | Checkout cần >=1 item | 0 | 1 | 2 |
| Quantity | Quantity tối thiểu 1 | 0 | 1 | 2 |
| Total amount | Phải khớp sum cart | sum-1 | sum | sum+1 |
| Coupon min amount | Phải đạt ngưỡng coupon | min-1 | min | min+1 |
| Token | Cần token hợp lệ | Không token | Token hợp lệ | Token sai/hết hạn |
| Network timeout/error | Không được mất dữ liệu local khi lỗi | Lỗi trước gửi | Thành công | Lỗi sau gửi/response lỗi |

### 4.2 BVA Explanation
BVA cho Mobile Checkout dùng biên số item, quantity, tổng tiền, ngưỡng coupon và token. Các biên này phù hợp với mobile vì nhiều dữ liệu được giữ ở state client trước khi gửi API. Test cần quan sát cả phản hồi UI và dữ liệu order/cart sau thao tác.

### 4.3 BVA Test Cases
| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR20-BVA-01 | BVA | Cart 0 item | User login | Cart rỗng | Mở Cart/Checkout | Không cho checkout | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-BVA-01.png |
| FR20-BVA-02 | BVA | Cart 1 item | User login | 1 item | Checkout | Thành công nếu item hợp lệ | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-BVA-02.png |
| FR20-BVA-03 | BVA | Cart 2 item | User login | 2 item | Checkout | Thành công, không mất item | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-BVA-03.png |
| FR20-BVA-04 | BVA | Quantity dưới min | User login | quantity 0 | Checkout qua sửa input/state | Từ chối/normalize an toàn | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-BVA-04.png |
| FR20-BVA-05 | BVA | Coupon dưới/tại/trên min | User login, coupon min 300000 | 299999/300000/300001 | Apply coupon | Dưới min bị từ chối; tại/trên min được xét hợp lệ | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-BVA-05.png |
| FR20-BVA-06 | BVA | Total lệch biên | User login, sum=300000 | 299999/300000/300001 | Gửi checkout qua proxy/API | Backend chỉ chấp nhận tổng đúng/tự tính lại | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-BVA-06.png |

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases
AI thường gợi ý mobile checkout thành công, chưa đăng nhập, cart rỗng, một/nhiều sản phẩm và apply coupon.

### 5.2 Missing / Weak AI Cases
AI có thể bỏ qua payload mobile bị thiếu item, mobile gửi `total_amount` bị sửa, lỗi mạng sau khi bấm checkout, coupon boundary và sự khác biệt giữa cart local mobile với backend.

### 5.3 Why AI Might Miss Them
Nguyên nhân là AI không luôn inspect code mobile, prompt có thể quá tổng quát, và luồng mobile phụ thuộc state local, network, API_URL LAN và backend security behavior.

### 5.4 Human Corrections
Người kiểm thử chọn Mobile Checkout sau khi inspect repo, bổ sung các ca UI/API mismatch, network failure, coupon boundary và xác minh cart clear. Chưa claim execution cho đến khi chạy app thật trên emulator/thiết bị.
