# FR-18 - Quản lý đơn hàng Admin

## 1. Feature Overview
FR-18 cho phép admin xem toàn bộ đơn hàng của tất cả người dùng và cập nhật trạng thái đơn hàng. Đây là chức năng vận hành quan trọng vì ảnh hưởng trực tiếp đến quy trình xác nhận, giao hàng, hoàn tất và hủy đơn.

## 2. Requirement Summary
Admin được xem tất cả đơn hàng. Admin chỉ được đổi trạng thái theo FR-10: `pending -> confirmed`, `confirmed -> shipping`, `shipping -> delivered`, `pending -> canceled`, `confirmed -> canceled`. `delivered` và `canceled` là trạng thái cuối. Chuyển trạng thái sai phải trả lỗi phù hợp. Địa chỉ giao hàng phải hiển thị an toàn, không render HTML.

## 3. Domain Testing

### 3.1 Input Variables / Conditions
| Variable / Condition | Description | Valid Domain | Invalid Domain |
|---|---|---|---|
| Role người dùng | Quyền truy cập admin order | Token có `role=admin` | User thường, không token, token giả |
| Danh sách đơn hàng | Phạm vi dữ liệu admin xem | Tất cả đơn của mọi user | Chỉ đơn của admin hoặc bị lọc sai |
| Trạng thái hiện tại | State hiện tại của order | pending, confirmed, shipping, delivered, canceled | State rỗng/sai chính tả |
| Trạng thái đích | State admin muốn chuyển | State hợp lệ theo FR-10 | Bỏ qua bước, đổi từ final state |
| Order tồn tại | ID đơn hàng | ID tồn tại | ID không tồn tại |
| Địa chỉ giao hàng | Dữ liệu hiển thị | Text được escape | HTML/script được render |
| Lỗi chuyển trạng thái | Phản hồi API/UI | 400 và thông báo rõ | Im lặng, 200 sai, đổi trạng thái sai |

### 3.2 Domain Analysis Explanation
Miền FR-18 gồm miền quyền truy cập, miền dữ liệu hiển thị và miền trạng thái. Với trạng thái, mỗi cạnh hợp lệ trong state machine là một miền hợp lệ riêng; các cạnh bỏ qua bước hoặc xuất phát từ final state là miền không hợp lệ. Vì admin order hiển thị dữ liệu do user nhập, kiểm thử thêm miền bảo mật cho shipping address chứa HTML/script.

### 3.3 Domain Testing Test Cases
| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR18-DT-01 | Valid domain | Admin xem tất cả orders | Có admin token, có đơn của nhiều user | GET /api/admin/orders | Đăng nhập admin, mở Orders | Hiển thị toàn bộ đơn của mọi user | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-01.png |
| FR18-DT-02 | Authorization | User thường xem admin orders | Token user thường | GET /api/admin/orders | Gọi API/mở admin page | Bị từ chối 403/401 | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-02.png |
| FR18-DT-03 | Authorization | Không token xem admin orders | Không token | GET /api/admin/orders | Gọi API | Trả 401 Unauthorized | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-03.png |
| FR18-DT-04 | Valid transition | pending -> confirmed | Order pending | status: confirmed | Admin cập nhật trạng thái | Thành công, order thành confirmed | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-04.png |
| FR18-DT-05 | Valid transition | confirmed -> shipping | Order confirmed | status: shipping | Admin cập nhật | Thành công, order thành shipping | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-05.png |
| FR18-DT-06 | Valid transition | shipping -> delivered | Order shipping | status: delivered | Admin cập nhật | Thành công, order thành delivered | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-06.png |
| FR18-DT-07 | Valid transition | pending -> canceled | Order pending | status: canceled | Admin cập nhật | Thành công, order canceled | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-07.png |
| FR18-DT-08 | Valid transition | confirmed -> canceled | Order confirmed | status: canceled | Admin cập nhật | Thành công, order canceled | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-08.png |
| FR18-DT-09 | Invalid transition | pending -> delivered | Order pending | status: delivered | Admin cập nhật | Trả lỗi, trạng thái không đổi | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-09.png |
| FR18-DT-10 | Invalid transition | delivered -> canceled | Order delivered | status: canceled | Admin cập nhật | Trả lỗi vì delivered là final state | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-10.png |
| FR18-DT-11 | Invalid transition | canceled -> delivered/confirmed | Order canceled | status: delivered | Admin cập nhật | Trả lỗi vì canceled là final state | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-11.png |
| FR18-DT-12 | Security domain | Shipping address HTML/script | Order có address `<img src=x onerror=alert(1)>` | Mở admin orders | Quan sát address | HTML được escape, không chạy script | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-12.png |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables
| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Số đơn hiển thị | Admin list xử lý 0..n orders | 0 | 1 | 2+ |
| State index pending | Bắt đầu luồng chính | Không có previous | pending | confirmed |
| State index confirmed | Điểm rẽ shipping/canceled | pending | confirmed | shipping |
| State index shipping | Chỉ admin hoàn tất | confirmed | shipping | delivered |
| Final state delivered | Không cho chuyển tiếp | shipping | delivered | canceled/confirmed |
| Final state canceled | Không cho chuyển tiếp | pending/confirmed | canceled | delivered/confirmed |

### 4.2 BVA Explanation
State machine không phải biên số học thuần túy, nên BVA được áp dụng theo biên trạng thái: trước trạng thái, tại trạng thái và sau trạng thái. Các trạng thái `delivered` và `canceled` là biên cuối, cần kiểm tra không thể đi tiếp. Danh sách order cũng có biên 0/1/n để đảm bảo admin UI hiển thị đúng.

### 4.3 BVA Test Cases
| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR18-BVA-01 | BVA | Danh sách 0 đơn | Admin token, DB không có orders | GET admin orders | Mở danh sách | Empty state rõ ràng, không lỗi | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-BVA-01.png |
| FR18-BVA-02 | BVA | Danh sách 1 đơn | Admin token, 1 order | GET admin orders | Mở danh sách | Hiển thị đúng 1 order | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-BVA-02.png |
| FR18-BVA-03 | BVA | Danh sách nhiều đơn | Admin token, >=2 orders | GET admin orders | Mở danh sách | Hiển thị đủ, không mất order user khác | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-BVA-03.png |
| FR18-BVA-04 | BVA | Biên confirmed | Order confirmed | status: shipping và canceled | Cập nhật 2 hướng hợp lệ | Cả hai hướng được chấp nhận riêng biệt | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-BVA-04.png |
| FR18-BVA-05 | BVA | Biên delivered final | Order delivered | status: canceled | Cập nhật | Bị từ chối, trạng thái giữ nguyên | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-BVA-05.png |
| FR18-BVA-06 | BVA | Biên canceled final | Order canceled | status: delivered | Cập nhật | Bị từ chối, trạng thái giữ nguyên | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-BVA-06.png |

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases
AI thường gợi ý admin xem đơn, user thường bị chặn, và một vài chuyển trạng thái cơ bản như pending -> confirmed hoặc shipping -> delivered.

### 5.2 Missing / Weak AI Cases
AI dễ bỏ sót final state, các cạnh hủy đơn, invalid transition pending -> delivered, delivered -> canceled, canceled -> delivered và address chứa HTML/script.

### 5.3 Why AI Might Miss Them
Nguyên nhân là hành vi phụ thuộc state machine, cần đọc FR-10 chứ không chỉ FR-18. Các ca bảo mật HTML escaping cũng dễ bị bỏ qua nếu prompt chỉ nói "admin order management".

### 5.4 Human Corrections
Người kiểm thử bổ sung đầy đủ cạnh hợp lệ/không hợp lệ của FR-10, kiểm tra role admin, không token, final states và shipping address escaping. Tất cả kết quả để `Not Executed` cho đến khi chạy thực tế.
