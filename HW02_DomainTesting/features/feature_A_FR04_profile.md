# FR-04 - Quản lý hồ sơ cá nhân

## 1. Feature Overview
FR-04 cho phép người dùng đã đăng nhập cập nhật thông tin hồ sơ cá nhân như họ tên, số điện thoại và địa chỉ giao hàng mặc định. Mục đích nghiệp vụ là giúp khách hàng duy trì thông tin liên hệ chính xác để hệ thống giao hàng và hỗ trợ sau bán hàng.

## 2. Requirement Summary
Theo SRS EShop, người dùng chỉ được cập nhật hồ sơ của chính mình. Số điện thoại hợp lệ phải bắt đầu bằng `0` và có 10-11 chữ số. Email không được thay đổi qua UI. Người dùng không được tự thay đổi `role`.

## 3. Domain Testing

### 3.1 Input Variables / Conditions
| Variable / Condition | Description | Valid Domain | Invalid Domain |
|---|---|---|---|
| Trạng thái đăng nhập | Người dùng gọi chức năng hồ sơ | JWT hợp lệ | Không token, token hết hạn/sai |
| Chủ sở hữu hồ sơ | Hồ sơ được cập nhật | Chính người dùng đang đăng nhập | Hồ sơ người dùng khác |
| Họ tên | Tên hiển thị của khách hàng | Chuỗi không rỗng, ký tự chữ/khoảng trắng hợp lệ | Rỗng nếu hệ thống bắt buộc, toàn khoảng trắng, quá dài |
| Số điện thoại | Số liên hệ | Bắt đầu `0`, gồm 10 hoặc 11 chữ số | Không bắt đầu `0`, dưới 10 số, trên 11 số, có chữ/ký tự đặc biệt |
| Địa chỉ giao hàng | Địa chỉ mặc định | Chuỗi văn bản hợp lệ, có thể dài trong giới hạn UI/API | HTML/script nếu bị render, quá dài, rỗng nếu hệ thống bắt buộc |
| Email | Trường định danh đăng nhập | Chỉ hiển thị, không editable qua UI | Client cố gửi email mới |
| Role | Quyền người dùng | Không xuất hiện trong form và không đổi từ client | Client gửi `role=admin` |

### 3.2 Domain Analysis Explanation
Phân tích miền được thực hiện bằng cách tách từng biến đầu vào thành miền hợp lệ và không hợp lệ. Với số điện thoại, miền chính là mẫu `0` + 9 hoặc 10 chữ số. Với quyền truy cập, miền hợp lệ là token của chính user; miền không hợp lệ gồm không đăng nhập, token của user khác và payload có trường nhạy cảm. Các ca kiểm thử cũng bao phủ khác biệt UI/API vì UI có thể khóa email nhưng API vẫn cần từ chối dữ liệu ngoài đặc tả.

### 3.3 Domain Testing Test Cases
| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR04-DT-01 | Valid domain | Cập nhật đầy đủ hợp lệ | User đã đăng nhập | Name: Nguyen Van A; Phone: 0912345678; Address: 1 Le Loi | Mở Profile, nhập dữ liệu, bấm Cập nhật | Hồ sơ cập nhật thành công, dữ liệu lưu đúng | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-DT-01.png |
| FR04-DT-02 | Invalid domain | Họ tên rỗng | User đã đăng nhập | Name: rỗng; Phone hợp lệ; Address hợp lệ | Xóa họ tên, lưu | Hệ thống từ chối nếu họ tên bắt buộc hoặc hiển thị lỗi rõ ràng | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-DT-02.png |
| FR04-DT-03 | Valid domain | Phone 10 chữ số | User đã đăng nhập | Phone: 0912345678 | Cập nhật phone | Chấp nhận vì bắt đầu bằng 0 và đủ 10 chữ số | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-DT-03.png |
| FR04-DT-04 | Valid domain | Phone 11 chữ số | User đã đăng nhập | Phone: 09123456789 | Cập nhật phone | Chấp nhận vì bắt đầu bằng 0 và đủ 11 chữ số | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-DT-04.png |
| FR04-DT-05 | Invalid domain | Phone không bắt đầu bằng 0 | User đã đăng nhập | Phone: 9123456789 | Cập nhật phone | Từ chối và báo số điện thoại không hợp lệ | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-DT-05.png |
| FR04-DT-06 | Invalid domain | Phone có chữ/ký tự đặc biệt | User đã đăng nhập | Phone: 09A234567! | Cập nhật phone | Từ chối và không lưu dữ liệu | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-DT-06.png |
| FR04-DT-07 | Security domain | Cố đổi email qua UI/API | User đã đăng nhập | email: attacker@eshop.com | Kiểm tra UI email disabled; gửi PUT có email mới bằng API | Email không đổi trong CSDL/phản hồi | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-DT-07.png |
| FR04-DT-08 | Security domain | Cố đổi role | User thường đã đăng nhập | role: admin | Gửi PUT /api/users/me có role=admin | Role không đổi; API bỏ qua hoặc trả lỗi | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-DT-08.png |
| FR04-DT-09 | Authorization domain | Cập nhật hồ sơ người khác | Có 2 user | Token user A, target user B | Thử gọi endpoint cập nhật user B nếu tồn tại hoặc sửa id trên client | Bị từ chối; chỉ `/users/me` của token được phép đổi | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-DT-09.png |
| FR04-DT-10 | Security domain | Địa chỉ chứa HTML/script | User đã đăng nhập | Address: `<script>alert(1)</script>` | Lưu địa chỉ, mở lại Profile/Checkout/Admin order | Nội dung được escape, không chạy script | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-DT-10.png |
| FR04-DT-11 | Invalid domain | Không đăng nhập | Không token | Name/Phone/Address hợp lệ | Gọi cập nhật hồ sơ | Trả 401/403, không lưu | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-DT-11.png |
| FR04-DT-12 | Robustness domain | Địa chỉ rất dài | User đã đăng nhập | Address dài 500-1000 ký tự | Lưu địa chỉ dài | Hệ thống xử lý có giới hạn rõ ràng, không vỡ UI | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-DT-12.png |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables
| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Độ dài phone tối thiểu | Hợp lệ từ 10 chữ số | 9 | 10 | 11 |
| Độ dài phone tối đa | Hợp lệ tối đa 11 chữ số | 10 | 11 | 12 |
| Ký tự đầu phone | Phải là `0` | `9` | `0` | `00` prefix cần xét với tổng độ dài |
| Độ dài họ tên | Không rỗng nếu bắt buộc | 0 | 1 | 2+ |
| Độ dài địa chỉ | Cần giới hạn hợp lý UI/API | 0 | 1 | Chuỗi rất dài |
| Số trường nhạy cảm trong payload | Không cho đổi email/role | 0 | 1 trường nhạy cảm | 2 trường nhạy cảm |

### 4.2 BVA Explanation
BVA tập trung vào các biên có khả năng lỗi cao: độ dài số điện thoại 9/10/11/12, ký tự đầu tiên của phone, trường rỗng và payload chứa thêm trường nhạy cảm. Các giá trị dưới biên, tại biên và trên biên được chọn để xác nhận UI và backend cùng tuân thủ đặc tả.

### 4.3 BVA Test Cases
| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR04-BVA-01 | BVA | Phone dưới min | User đã đăng nhập | Phone: 012345678 (9 số) | Lưu hồ sơ | Từ chối | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-BVA-01.png |
| FR04-BVA-02 | BVA | Phone tại min | User đã đăng nhập | Phone: 0123456789 (10 số) | Lưu hồ sơ | Chấp nhận | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-BVA-02.png |
| FR04-BVA-03 | BVA | Phone tại max | User đã đăng nhập | Phone: 01234567890 (11 số) | Lưu hồ sơ | Chấp nhận | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-BVA-03.png |
| FR04-BVA-04 | BVA | Phone trên max | User đã đăng nhập | Phone: 012345678901 (12 số) | Lưu hồ sơ | Từ chối | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-BVA-04.png |
| FR04-BVA-05 | BVA | Ký tự đầu phone | User đã đăng nhập | Phone: 1123456789 | Lưu hồ sơ | Từ chối vì không bắt đầu bằng 0 | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-BVA-05.png |
| FR04-BVA-06 | BVA | Họ tên rỗng/tối thiểu | User đã đăng nhập | Name: ""; Phone hợp lệ | Lưu hồ sơ | Nếu bắt buộc thì từ chối; nếu không bắt buộc phải có hành vi rõ ràng | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-BVA-06.png |

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases
AI thường đề xuất các ca cơ bản như cập nhật hồ sơ hợp lệ, phone sai định dạng, phone thiếu/thừa chữ số và người dùng chưa đăng nhập.

### 5.2 Missing / Weak AI Cases
AI dễ bỏ sót ca gửi `role=admin`, gửi `email` qua API, cập nhật hồ sơ người khác, địa chỉ chứa HTML/script và khác biệt giữa tên trường `shipping_address` trong API với `shippingAddress` ở client.

### 5.3 Why AI Might Miss Them
Nguyên nhân có thể do prompt quá tổng quát, AI không kiểm tra đúng đặc tả/API, hoặc bỏ qua hành vi bảo mật phía backend. Một số lỗi nằm ở vùng UI/API mismatch nên không lộ nếu chỉ nhìn giao diện.

### 5.4 Human Corrections
Người kiểm thử bổ sung các ca authorization, role escalation, email immutability, HTML escaping và boundary 10-11 chữ số theo đúng SRS. Các kết quả vẫn để `Not Executed` cho đến khi chạy thủ công.
