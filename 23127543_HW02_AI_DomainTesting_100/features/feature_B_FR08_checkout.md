# FR-08 - Thanh toán

## 1. Feature Overview
FR-08 xử lý bước đặt hàng cuối cùng của khách hàng. Chức năng này chuyển giỏ hàng thành đơn hàng, hiển thị danh sách sản phẩm đặt mua, tự tính tổng tiền và xóa giỏ hàng sau khi thanh toán thành công.

## 2. Requirement Summary
Chỉ người dùng đã đăng nhập mới được checkout. Tổng tiền phải được tính tự động từ giỏ hàng, không cho người dùng chỉnh sửa trực tiếp. Backend phải tự tính lại tổng tiền và không tin `total_amount` do client gửi lên. Sau checkout thành công, giỏ hàng được xóa.

## 3. Domain Testing

### 3.1 Input Variables / Conditions
| Variable / Condition | Description | Valid Domain | Invalid Domain |
|---|---|---|---|
| Trạng thái đăng nhập | Quyền checkout | JWT hợp lệ của user | Không token, token sai/hết hạn |
| Trạng thái giỏ hàng | Dữ liệu đặt hàng | Có ít nhất 1 sản phẩm hợp lệ | Giỏ rỗng, item thiếu id/price/quantity |
| Số lượng sản phẩm | Quantity trong cart | Số nguyên dương | 0, âm, thập phân, chuỗi |
| Giá sản phẩm | Price từ dữ liệu sản phẩm | Số dương từ backend | 0, âm, chuỗi, giá client tự sửa |
| Tổng tiền UI | Tổng hiển thị | Tự tính từ cart, read-only | Editable hoặc khác cart total |
| `total_amount` API | Tổng tiền client gửi | Backend bỏ qua hoặc kiểm tra lại | Client gửi thấp hơn/cao hơn |
| Danh sách sản phẩm | UI checkout | Hiển thị đầy đủ item, quantity, giá | Thiếu item, sai quantity, thiếu tên |
| Sau checkout | Trạng thái cart | Cart rỗng, order được tạo | Cart còn item, order sai tổng |

### 3.2 Domain Analysis Explanation
Miền checkout được chia theo quyền truy cập, nội dung giỏ hàng, dữ liệu tiền tệ và trạng thái sau xử lý. Vì checkout là luồng tài chính, kiểm thử không chỉ dừng ở UI mà phải kiểm tra backend với payload bị sửa. Miền hợp lệ là user đăng nhập, cart có item hợp lệ và tổng tiền khớp tính toán; miền không hợp lệ gồm không đăng nhập, cart rỗng, item sai quantity/price và `total_amount` bị thao túng.

### 3.3 Domain Testing Test Cases
| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR08-DT-01 | Valid domain | Checkout hợp lệ | User đăng nhập, cart có 2 sản phẩm | Cart total đúng | Mở Checkout, xác nhận | Tạo order thành công, tổng đúng, cart rỗng | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-01.png |
| FR08-DT-02 | Invalid domain | Chưa đăng nhập | Không token, cart có item local | Cart có 1 item | Bấm Thanh toán | Điều hướng/login hoặc API trả 401 | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-02.png |
| FR08-DT-03 | Invalid domain | Giỏ hàng rỗng | User đăng nhập | Cart rỗng | Mở checkout/xác nhận | Không cho checkout, hiển thị empty state | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-03.png |
| FR08-DT-04 | Valid domain | Một sản phẩm | User đăng nhập | 1 item, quantity 1 | Checkout | Order có đúng 1 sản phẩm và tổng = price | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-04.png |
| FR08-DT-05 | Valid domain | Nhiều sản phẩm | User đăng nhập | 3 items, quantity khác nhau | Checkout | UI hiển thị đủ danh sách; tổng = sum price*qty | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-05.png |
| FR08-DT-06 | Security domain | User cố sửa tổng ở UI | User đăng nhập | Dùng DevTools sửa input total nếu có | Thử chỉnh tổng trước khi xác nhận | Không chỉnh được hoặc không ảnh hưởng order | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-06.png |
| FR08-DT-07 | Security domain | Client gửi `total_amount` thấp | User đăng nhập, cart 300000 | API body total_amount: 1 | Gửi POST /api/checkout bằng Postman/cURL | Backend tính lại 300000 hoặc từ chối | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-07.png |
| FR08-DT-08 | Security domain | Client gửi `total_amount` cao | User đăng nhập, cart 300000 | API body total_amount: 999999999 | Gửi POST /api/checkout | Backend tính lại đúng hoặc từ chối | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-08.png |
| FR08-DT-09 | State domain | Cart clear sau thành công | User đăng nhập, cart có item | Checkout hợp lệ | Xác nhận, quay lại cart | Cart rỗng, không checkout lặp lại cùng item | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-09.png |
| FR08-DT-10 | Display domain | Danh sách sản phẩm hiển thị đủ | User đăng nhập, cart nhiều item | Tên/giá/quantity khác nhau | Mở Checkout | Hiển thị đủ item, quantity, giá, thành tiền | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-10.png |
| FR08-DT-11 | Invalid domain | Quantity bằng 0/âm | User đăng nhập | quantity: 0 hoặc -1 qua client/API | Thêm item bất thường rồi checkout | Từ chối item không hợp lệ | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-11.png |
| FR08-DT-12 | Robustness domain | Price kiểu chuỗi | User đăng nhập | price: "100000" trong cart/API | Checkout | Backend chuẩn hóa an toàn hoặc từ chối, không sai tổng | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-12.png |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables
| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Số item trong cart | Checkout cần ít nhất 1 item | 0 | 1 | 2 |
| Quantity | Số nguyên dương tối thiểu 1 | 0 | 1 | 2 |
| Price | Giá sản phẩm phải > 0 | 0 | 1 | 2 |
| Total amount | Tổng phải bằng sum cart | sum-1 | sum | sum+1 |
| Độ dài danh sách hiển thị | UI phải hiển thị toàn bộ item | n-1 item | n item | n+1 item sai |
| Token | Checkout cần token hợp lệ | Không token | Token hợp lệ | Token sai/hết hạn |

### 4.2 BVA Explanation
BVA cho FR-08 dùng các biên số lượng item, quantity, price và total. Các giá trị `sum-1`, `sum`, `sum+1` giúp phát hiện backend có tin dữ liệu client hay tự tính lại. Biên 0/1/2 item kiểm tra điều kiện tối thiểu của checkout.

### 4.3 BVA Test Cases
| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR08-BVA-01 | BVA | Cart 0 item | User đăng nhập | Cart rỗng | Bấm checkout | Bị chặn | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-BVA-01.png |
| FR08-BVA-02 | BVA | Cart 1 item | User đăng nhập | 1 item hợp lệ | Checkout | Thành công | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-BVA-02.png |
| FR08-BVA-03 | BVA | Cart 2 item | User đăng nhập | 2 item hợp lệ | Checkout | Thành công, hiển thị đủ 2 item | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-BVA-03.png |
| FR08-BVA-04 | BVA | Quantity dưới min | User đăng nhập | quantity: 0 | Checkout qua API/client sửa | Từ chối | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-BVA-04.png |
| FR08-BVA-05 | BVA | Quantity tại min | User đăng nhập | quantity: 1 | Checkout | Chấp nhận | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-BVA-05.png |
| FR08-BVA-06 | BVA | Total lệch biên | User đăng nhập, sum=300000 | total_amount: 299999/300000/300001 | Gửi API checkout | Chỉ tổng backend tính đúng được lưu; lệch bị bỏ qua/từ chối | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-BVA-06.png |

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases
AI thường gợi ý checkout thành công, chưa đăng nhập, giỏ hàng rỗng, một/nhiều sản phẩm và xóa giỏ sau thanh toán.

### 5.2 Missing / Weak AI Cases
AI có thể bỏ sót việc sửa `total_amount` ở API, price/quantity bất thường, danh sách sản phẩm bị thiếu item và việc backend không được tin dữ liệu client.

### 5.3 Why AI Might Miss Them
Nguyên nhân chính là prompt quá tập trung vào UI, không inspect API, và bỏ qua rủi ro tài chính ở backend. Đây cũng là trường hợp UI/API mismatch vì UI có thể read-only nhưng API vẫn nhận payload.

### 5.4 Human Corrections
Người kiểm thử bổ sung ca kiểm tra tổng tiền bị thao túng, quantity/price edge cases, xác minh cart clear và kiểm tra danh sách item hiển thị đủ trước khi xác nhận checkout.
