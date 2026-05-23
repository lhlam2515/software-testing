---
title: "Chương 02: Kiểm thử trong SDLC (Testing Throughout the SDLC)"
source: "https://www.fit.hcmus.edu.vn/~lqvu/Courses/SoftwareTesting/istqb-foundation-selfstudy.html"
chapter: 2
tags: [istqb, software-testing, foundation-level, ctfl-v4]
---

### 2.1 Kiểm thử trong bối cảnh SDLC

Software Development Lifecycle (SDLC) là mô hình mô tả các giai đoạn từ ý tưởng đến vận hành phần mềm. SDLC khác nhau sẽ thay đổi **khi nào** và **như thế nào** hoạt động kiểm thử diễn ra, chứ không thay đổi **cái gì** được kiểm thử. Hiểu rõ SDLC giúp tester biết cách hòa nhập và đóng góp đúng lúc.

**Hai họ SDLC chính**:

- **Tuần tự (sequential)**: Waterfall, V-model. Các pha diễn ra lần lượt — analysis → design → coding → testing → deployment. Kiểm thử thường là pha riêng, sau khi code xong. Phù hợp với dự án có yêu cầu ổn định, quy định nghiêm ngặt (ví dụ: phần mềm điều khiển nhà máy).
- **Lặp & tăng dần (iterative & incremental)**: Agile (Scrum, Kanban), RUP, DevOps. Phần mềm được xây dựng qua nhiều chu kỳ ngắn (sprint 2 tuần), mỗi sprint có cả code lẫn test. Phù hợp với dự án thay đổi nhanh, cần feedback liên tục từ thị trường (app khởi nghiệp, web).

Ví dụ — V-model
**V-model** mở rộng waterfall bằng cách ghép mỗi pha phát triển với một pha test tương ứng:\
\
  Requirements ←—————→ Acceptance test\
    System design ←—————→ System test\
      Architectural design ←—————→ Integration test\
        Component design ←—————→ Component test\
          Coding\
\
Ưu điểm: test được lập kế hoạch sớm — khi viết requirements thì đồng thời viết acceptance test. Nhược điểm: tài liệu nặng, khó thay đổi yêu cầu giữa chừng.

| Thực hành | Ý nghĩa | Ví dụ |
| --- | --- | --- |
| Test-first (TDD/BDD/ATDD) | Viết test **trước** khi viết code sản phẩm. | Developer viết test "calculator cộng 2+3 = 5" rồi mới viết hàm cộng. |
| DevOps | Dev và Ops hợp tác liên tục, test tự động trong pipeline. | Mỗi commit push lên Git → CI chạy 500 test → nếu pass thì deploy lên staging tự động. |
| Shift-left | Hoạt động kiểm thử dịch về phía sớm hơn. | Tester tham gia review user story ngay từ refinement, không đợi đến khi code xong. |
| Retrospectives | Họp định kỳ để cải tiến. | Cuối sprint, team họp 1 giờ: "what went well, what to improve, action items". |

**Thay đổi quan trọng v4.0 :** "Integration testing" được chia thành **component integration testing** (test tương tác giữa các component trong cùng hệ thống) và **system integration testing** (test tương tác với hệ thống/dịch vụ bên ngoài). Bây giờ có bốn cấp độ kiểm thử, không phải ba như v3.1 trước.

### 2.2 Cấp độ kiểm thử và loại kiểm thử

Hai khái niệm dễ nhầm lẫn. **Test level** là "khi nào / ở đâu" trong vòng đời ta test (tương ứng với mức độ tích hợp của đối tượng). **Test type** là "loại đặc tính chất lượng" ta tập trung kiểm tra. Một test type bất kỳ có thể áp dụng ở bất kỳ test level nào.

**Bốn cấp độ kiểm thử** theo v4.0 .1:

| Cấp độ | Test cái gì | Test basis | Ai làm |
| --- | --- | --- | --- |
| Component testing | Các đơn vị riêng lẻ (function, class). Còn gọi là unit testing. | Thiết kế chi tiết, code. | Developer. |
| Component integration | Tương tác giữa các component trong cùng hệ thống. | Architecture, interface specs. | Developer / Tester. |
| System testing | Hành vi đầu cuối của hệ thống đã tích hợp. | Yêu cầu, phân tích rủi ro, user story. | Tester (độc lập). |
| System integration | Tương tác với hệ thống/dịch vụ bên ngoài. | System & external interface specs. | Tester. |
| Acceptance testing | Hệ thống có phù hợp cho mục đích kinh doanh. | Yêu cầu kinh doanh, hợp đồng, user story, quy định pháp luật. | Người dùng cuối / Khách hàng. |

Ví dụ — App e-commerce qua 4 cấp độ test
**Component test**: Function calculateDiscount(orderTotal, customerType) được test riêng với 10 input — đầu vào VIP+đơn 500k → output 50k giảm.\
\
**Component integration test**: Module Cart gọi module Discount → khi user add 3 sản phẩm và là VIP, Cart phải hiển thị đúng giá sau giảm.\
\
**System test**: User flow đầy đủ — login → tìm sản phẩm → add giỏ hàng → checkout → thanh toán → nhận email xác nhận. Test trên toàn bộ hệ thống đã tích hợp.\
\
**System integration test**: Hệ thống gọi PayPal API để xử lý thanh toán; gọi GHN API để track đơn hàng; gọi Mailgun để gửi email. Test các tương tác với các bên thứ ba này.\
\
**Acceptance test**: Khách hàng (business owner) thực hiện 20 scenario thực tế trên môi trường UAT, ký nghiệm thu nếu đạt.

**Các hình thức acceptance testing**:

- **UAT (User Acceptance Testing)**: người dùng cuối test trước khi go-live.
- **OAT (Operational Acceptance Testing)**: ops team test backup, recovery, monitoring.
- **Contractual/Regulatory acceptance**: nghiệm thu theo điều khoản hợp đồng hoặc luật định.
- **Alpha testing**: test tại văn phòng nhà phát triển với khách hàng tiềm năng (mời tham gia).
- **Beta testing**: test trên môi trường thực của một số user thật trước khi release rộng.

**Bốn loại kiểm thử (test types)**:

- **Functional testing** — hệ thống **làm gì**. **VD:** "khi user click 'Thanh toán', hệ thống chuyển đến trang payment". Liên quan đến tính năng (feature).
- **Non-functional testing** — hệ thống làm điều đó **tốt đến đâu**. Bao gồm performance, security, usability, reliability... theo 8 đặc tính trong ISO/IEC 25010. **VD:** "trang checkout phải load trong 2 giây với 1000 user đồng thời".
- **Black-box vs white-box testing** — dựa trên đặc tả (không nhìn vào trong) hoặc cấu trúc nội bộ của code. Sẽ học chi tiết ở chương 4.
- **Change-related testing** — chia làm hai:
  - **Confirmation testing (re-testing)**: test lại các case đã fail sau khi fix bug, để xác nhận bug đã được sửa.
  - **Regression testing**: test các phần **không thay đổi** để chắc chắn fix không phá vỡ chức năng cũ.

Ví dụ — Confirmation vs Regression
**Tình huống**: Bug PROJ-247 báo "khi hủy vé xe buýt không tự động refund". Developer fix code refund.\
\
**Confirmation test**: Tester chạy lại test case TC09 đã từng fail ("đặt vé → hủy → kiểm tra refund"). Nếu pass → bug đã được fix.\
\
**Regression test**: Tester chạy thêm 30 test case khác (mua vé, in vé, đặt nhiều vé, đổi vé...) để chắc chắn rằng việc fix refund không vô tình phá vỡ các tính năng khác. Đây là phần nhiều người bỏ sót — fix một chỗ, vỡ chỗ khác.

**Bẫy đề thi:** Test type **không phải** test level. Bất kỳ test type nào (functional, performance, regression) cũng có thể áp dụng ở bất kỳ test level nào. **VD:** performance testing có thể làm ở mức component (đo tốc độ một function) hoặc system (đo throughput toàn hệ thống).

### 2.3 Kiểm thử bảo trì

Phần mềm không kết thúc khi go-live. Sau release, phần mềm bước vào giai đoạn vận hành và bảo trì — thường chiếm 60-80% tổng chi phí vòng đời. Bất kỳ thay đổi nào sau khi vận hành đều có thể kích hoạt **kiểm thử bảo trì (maintenance testing)**. Mục tiêu là xác minh thay đổi hoạt động đúng VÀ không phá vỡ phần đã chạy ổn định.

Kiểm thử bảo trì có hai phần thiết yếu, đi đôi với nhau:

1. **Test phần thay đổi** — bao gồm test chức năng mới và confirmation test cho bản fix.
2. **Regression test** các phần không thay đổi — để đảm bảo không bị tác dụng phụ.

**Bốn nhóm yếu tố kích hoạt** kiểm thử bảo trì:

- **Modification (sửa đổi)**: thêm tính năng mới, sửa bug, tối ưu hiệu năng.
- **Migration (di chuyển)**: chuyển hệ thống sang nền tảng mới, đổi database, đổi cloud provider.
- **Upgrade (nâng cấp)**: nâng cấp OS, runtime (Java, .NET), framework, COTS (Commercial-Off-The-Shelf) như SAP, Oracle.
- **Retirement (ngừng vận hành)**: test data migration sang hệ thống mới, lưu trữ dài hạn (archival), đảm bảo data không bị mất.

Ví dụ — kiểm thử bảo trì sau khi nâng cấp database
**Tình huống**: Hệ thống quản lý sinh viên đang dùng PostgreSQL 13, cần nâng cấp lên PostgreSQL 16 để được hỗ trợ.\
\
**Phân tích tác động**: 47 module sử dụng DB. Khoảng 12 module dùng các function PostgreSQL cụ thể (json\_agg, full-text search), có rủi ro syntax thay đổi.\
\
**Kế hoạch test**:\

1. Confirmation test: chạy lại 8 bug-fix gần đây để chắc chắn vẫn pass trên DB mới.\
2. Regression test: chạy 200 test case cho các module sử dụng DB nhiều — đăng ký môn học, xếp lớp, tính điểm.\
3. Performance test: so sánh query response time giữa PG13 và PG16 với 50.000 sinh viên.\
4. Migration test: kiểm tra data đã chuyển đúng — count rows, checksum, sample data integrity.

Phân tích tác động (Impact analysis)

Phân tích tác động đánh giá xem những vùng nào của sản phẩm bị ảnh hưởng bởi một thay đổi, để xác định phạm vi regression test. Đầu ra là một danh sách module/feature cần test lại.

**Ví dụ:** Khi thay đổi quy tắc tính điểm sinh viên (từ thang 10 sang thang 4), impact analysis phải xác định: hàm tính điểm tổng, báo cáo điểm, certificate generator, đồ thị thống kê, mobile app... — tất cả đều cần test. Không có traceability tốt, impact analysis chỉ là phỏng đoán → bỏ sót → defect lọt vào production.
