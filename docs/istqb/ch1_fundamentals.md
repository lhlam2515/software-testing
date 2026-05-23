---
title: "Chương 01: Cơ bản về kiểm thử (Fundamentals of Testing)"
source: "https://www.fit.hcmus.edu.vn/~lqvu/Courses/SoftwareTesting/istqb-foundation-selfstudy.html"
chapter: 1
tags: [istqb, software-testing, foundation-level, ctfl-v4]
---

### 1.1 Kiểm thử là gì?

Kiểm thử phần mềm là một quá trình có hệ thống để đánh giá một sản phẩm phần mềm hoặc thành phần nào đó, nhằm xác định xem nó có đáp ứng các yêu cầu đã đặc tả hay không, đồng thời tìm ra các khiếm khuyết. Phạm vi của kiểm thử rộng hơn nhiều so với suy nghĩ thông thường — nó không chỉ là việc "chạy chương trình rồi xem có lỗi gì không", mà bao gồm cả lập kế hoạch, phân tích yêu cầu, thiết kế test case, triển khai môi trường, báo cáo kết quả và đánh giá chất lượng tổng thể.

Một cách hình dung trực quan: nếu phát triển phần mềm giống như xây một tòa nhà, thì kiểm thử không chỉ là việc "kiểm tra xem cửa có đóng được không" lúc bàn giao. Nó bắt đầu từ khi đọc bản vẽ (review yêu cầu), tiếp tục khi đổ móng (kiểm thử component), khi lắp ráp các tầng (integration), khi nghiệm thu công trình (system testing), và kéo dài đến cả việc bảo trì sau bàn giao.

Các hiểu nhầm phổ biến

Trong thực tế, người mới làm việc với kiểm thử thường có những hiểu nhầm sau:

- **"Kiểm thử chỉ là chạy test"** — Sai. Việc chạy test (test execution) chỉ là một trong bảy hoạt động kiểm thử. Phần lớn thời gian thực ra dành cho phân tích, thiết kế và xem xét tài liệu.
- **"Kiểm thử = verification"** — Không đủ. Verification trả lời "có làm đúng theo spec không", còn validation trả lời "spec có đúng nhu cầu thực không". Cả hai đều cần.
- **"Kiểm thử = debugging"** — Hoàn toàn khác. Kiểm thử **phát hiện** failure (triệu chứng); debugging **truy ngược tìm** defect (nguyên nhân) trong code rồi sửa. Tester có thể không cần biết code; developer làm debugging.

| Verification | Validation |
| --- | --- |
| Chúng ta đang làm sản phẩm **đúng cách** không? | Chúng ta đang làm **đúng sản phẩm** không? |
| Tuân thủ yêu cầu đã đặc tả. | Phù hợp với nhu cầu thực tế của người dùng. |
| VD: code đăng nhập đúng như spec đã viết — yêu cầu password ≥ 8 ký tự. | VD: sau khi launch, người dùng phàn nàn không thể nhớ password phức tạp → spec sai ngay từ đầu. |

Tình huống thực tế
Một ngân hàng ở TP.HCM phát triển app chuyển khoản. Verification: developer xác nhận code khớp với requirement "giới hạn chuyển 500 triệu/ngày". Validation: sau khi launch, các doanh nghiệp than phiền hạn mức quá thấp — yêu cầu ban đầu không phản ánh nhu cầu thực tế. Verification đậu nhưng validation rớt.

**Chín mục tiêu điển hình của kiểm thử**. Tùy theo cấp độ kiểm thử (unit, system, acceptance), giai đoạn dự án và bối cảnh kinh doanh, mức độ ưu tiên các mục tiêu này sẽ khác nhau:

1. **Đánh giá các sản phẩm công việc** như yêu cầu, user story, thiết kế, code — bằng cả kiểm thử tĩnh (review) và động (chạy).
2. **Kích hoạt failure và phát hiện defect** — chủ động tìm lỗi trước khi khách hàng tìm thấy.
3. **Đảm bảo độ phủ yêu cầu** của đối tượng kiểm thử — đo lường được "đã test bao nhiêu phần trăm".
4. **Giảm rủi ro** về chất lượng phần mềm không đạt — tập trung vào vùng có khả năng gây thiệt hại lớn.
5. **Xác minh yêu cầu** đã được hoàn thành (verification).
6. **Xác minh tuân thủ** hợp đồng, pháp lý và quy định — đặc biệt quan trọng với phần mềm tài chính, y tế.
7. **Cung cấp thông tin** cho các bên liên quan để ra quyết định (go/no-go release).
8. **Xây dựng niềm tin** vào chất lượng đối tượng kiểm thử.
9. **Validate** đối tượng kiểm thử có đầy đủ và hoạt động đúng kỳ vọng người dùng.

Ví dụ về sự thay đổi ưu tiên: với **unit testing**, mục tiêu 2 và 3 (tìm defect, đảm bảo coverage) thường quan trọng nhất. Với **acceptance testing** trước khi go-live, mục tiêu 7 và 8 (cung cấp thông tin, xây dựng niềm tin) lại quan trọng hơn.

### 1.2 Tại sao kiểm thử là cần thiết?

Kiểm thử đóng góp vào thành công của dự án và sản phẩm theo nhiều cách: giảm khả năng xảy ra failure trong vận hành, đáp ứng yêu cầu hợp đồng và quy định pháp luật, cung cấp thông tin cho các bên liên quan ra quyết định. Phần mềm không được kiểm thử kỹ có thể gây thiệt hại tài chính nghiêm trọng — vụ Knight Capital năm 2012 mất 440 triệu USD trong 45 phút chỉ vì lỗi triển khai một bản update không qua test đầy đủ.

Ngoài ra, ngày nay phần mềm hiện diện trong những hệ thống mà lỗi có thể ảnh hưởng đến tính mạng (xe tự lái, máy thở, hệ thống điều khiển không lưu). Trong những trường hợp này, kiểm thử không phải là tùy chọn — nó là yêu cầu bắt buộc do luật pháp và tiêu chuẩn quy định (ISO 26262 cho ô tô, IEC 62304 cho thiết bị y tế).

Định nghĩa phải nhớ

Error → Defect → Failure

Một **error** (sai sót) là hành động của con người tạo ra một kết quả không đúng. Error này khi được "đông cứng" vào sản phẩm công việc (code, tài liệu) thì trở thành một **defect** (khiếm khuyết, còn gọi là **bug**, **fault**). Khi defect được thực thi trong điều kiện thích hợp, có thể quan sát được một **failure** — sự lệch lạc so với hành vi mong đợi.

**Lưu ý quan trọng**: không phải defect nào cũng gây failure (ví dụ: code chết không bao giờ chạy đến), và không phải failure nào cũng do defect (có thể do yếu tố môi trường như mất kết nối mạng, lỗi hardware).

Ví dụ minh họa — chuỗi error/defect/failure
**Tình huống**: Tính giảm giá khi đơn hàng từ 100k đồng trở lên.\
\

1. **Error**: Lập trình viên hiểu nhầm spec, viết if (total > 100) thay vì if (total >= 100).\
2. **Defect**: Đoạn code này đã được commit vào repo. Khi user nhập đúng 100k thì điều kiện bị FALSE.\
3. **Failure**: Khách hàng Phương đặt đơn 100.000 đ, hệ thống không áp dụng giảm giá → khách phàn nàn.\
\
**Nếu defect không bao giờ gây failure**: giả sử frontend đã ràng buộc đơn tối thiểu là 150k, thì defect vẫn nằm đó nhưng user không bao giờ gặp failure. Defect vẫn tồn tại, chỉ là không được kích hoạt.

**Lưu ý:** Trong giao tiếp hàng ngày, người ta thường dùng từ "bug" cho tất cả. Tuy nhiên trong đề thi ISTQB, phân biệt rõ ba khái niệm này là kiến thức bắt buộc — đề thi thường có câu hỏi đảo lộn thứ tự để bẫy thí sinh.

### 1.3 Bảy nguyên lý kiểm thử

Bảy nguyên tắc tổng quát áp dụng cho toàn bộ lĩnh vực kiểm thử, được hình thành qua hàng chục năm kinh nghiệm trong ngành. Phải thuộc cả bảy — chúng xuất hiện trực tiếp trên đề thi và là nền tảng để loại trừ các đáp án sai ở những câu khác. Mỗi nguyên lý có một bài học cốt lõi và những ví dụ thực tế.

#### Kiểm thử cho thấy sự tồn tại của defect, không phải sự vắng mặt

Kiểm thử giảm xác suất có defect chưa phát hiện, nhưng không bao giờ chứng minh được không còn defect. **Ví dụ:** chạy 10.000 test case không tìm thấy lỗi không có nghĩa là phần mềm hoàn hảo — chỉ có nghĩa là 10.000 test đó không phát hiện được lỗi.

#### Kiểm thử toàn diện là bất khả thi

Trừ trường hợp đơn giản, không thể test mọi tổ hợp đầu vào. **Ví dụ:** một form có 5 trường, mỗi trường 1000 giá trị → 10¹⁵ tổ hợp, không thể test hết. Phải dùng phân tích rủi ro và kỹ thuật (BVA, equivalence partitioning) để ưu tiên.

#### Kiểm thử sớm tiết kiệm thời gian và chi phí

Defect tìm thấy sớm rẻ hơn nhiều — quy luật "10x": chi phí fix một defect ở giai đoạn sau gấp 10 lần giai đoạn trước. **Ví dụ:** defect trong yêu cầu fix tốn 1 giờ; nếu để đến production có thể tốn cả tuần (rollback, hỗ trợ khách hàng, danh tiếng). Đây là cơ sở cho **shift-left**.

#### Defect tập trung theo cụm

Phân phối defect không đều — một số ít module thường chứa phần lớn defect (tuân theo quy luật Pareto 80/20). **Ví dụ:** trong dự án 100 module, có thể 15-20 module chứa 80% số bug. Lý do: code phức tạp, có lịch sử thay đổi nhiều, hoặc viết bởi dev mới. Tập trung effort vào vùng này.

#### Test bị "mòn" (nghịch lý thuốc trừ sâu)

Lặp lại cùng một test sẽ không tìm được lỗi mới — giống như sâu bệnh kháng thuốc. **Ví dụ:** đội QA chạy bộ regression test 200 case mỗi tuần trong 1 năm. Sau 6 tháng, không phát hiện bug mới. Lý do: code đã được "chống đỡ" với chính những test đó. Giải pháp: định kỳ review và bổ sung test mới.

#### Kiểm thử phụ thuộc bối cảnh

Không có "best practice" duy nhất — cách test phụ thuộc loại phần mềm, rủi ro, quy định. **Ví dụ:** phần mềm máy thở (an toàn sống còn) cần coverage rất cao, tài liệu kỹ lưỡng, tuân thủ IEC 62304; app game di động thì exploratory testing và A/B testing với user thực tế quan trọng hơn.

#### Ngộ nhận "không có defect"

Một hệ thống không còn defect nhưng không đáp ứng nhu cầu người dùng thì vẫn vô dụng. **Ví dụ:** Microsoft Bob (1995) — code không lỗi nhưng UI quá khó dùng, thất bại thảm hại. Validation quan trọng ngang verification: pass spec không có nghĩa là pass người dùng.

### 1.4 Hoạt động kiểm thử, testware, và vai trò

Hoạt động kiểm thử không phải là một chuỗi tuần tự cứng nhắc — có sự lồng ghép, lặp lại và đôi khi xảy ra song song. Tuy nhiên, ISTQB phân chia thành **bảy nhóm hoạt động chính** để dễ quản lý và đào tạo:

1. **Test planning** — xác định mục tiêu, phương pháp tiếp cận, lịch trình, nguồn lực. Đầu ra: test plan.
2. **Test monitoring and control** — so sánh tiến độ thực tế với kế hoạch, đưa ra hành động điều chỉnh khi cần.
3. **Test analysis** — xem xét test basis (yêu cầu, design, code), xác định "test condition" — những gì cần được kiểm thử.
4. **Test design** — từ test condition, suy ra các test case ở mức trừu tượng (chưa cần dữ liệu cụ thể).
5. **Test implementation** — chuẩn bị test procedure, dữ liệu thực tế, script tự động, môi trường test.
6. **Test execution** — thực thi test (manual hoặc automated), so sánh kết quả thực tế với kết quả mong đợi, ghi nhận defect.
7. **Test completion** — đúc kết bài học, lưu trữ testware để tái sử dụng, viết completion report.

Ví dụ — bảy hoạt động trong dự án thực tế
**Dự án**: làm chức năng "đặt vé xe buýt" cho app mới.\
\

1. **Planning**: Test lead viết test plan — mục tiêu (acceptance test với 95% pass), 2 tester, deadline 2 tuần, 3 môi trường (dev/staging/prod).\
2. **Monitoring & control**: Hàng ngày check Jira — đã chạy 45/120 test, còn 8 ngày → trên tiến độ.\
3. **Analysis**: Đọc user story "Người dùng đặt vé bằng QR" → xác định 6 test condition: QR hợp lệ, QR hết hạn, QR đã dùng, lỗi network, hủy đặt vé, in lại vé.\
4. **Design**: Viết 18 test case trừu tượng. Ví dụ: TC03 = "QR đã dùng → hiển thị thông báo lỗi và không trừ tiền".\
5. **Implementation**: Tạo 5 mã QR test trong DB, viết Selenium script cho 12 test, chuẩn bị môi trường staging.\
6. **Execution**: Chạy test → 17 pass, 1 fail (TC09: hủy vé không refund). Log Jira bug PROJ-247.\
7. **Completion**: Sau khi fix và retest hết, viết completion report — coverage 100%, residual risk thấp.

Khả năng truy vết (Traceability)

Truy vết hai chiều giữa **test basis** (yêu cầu, user story, design) và **test work products** (test case, defect, kết quả) là một trong những kỹ năng quan trọng nhất của tester. Nó cho phép trả lời các câu hỏi:

- **Forward**: yêu cầu này đã được test bằng những test case nào? (đo coverage)
- **Backward**: defect này liên quan đến yêu cầu nào? Test case nào cần update khi yêu cầu thay đổi? (impact analysis)

**Ví dụ:** khi business analyst thay đổi yêu cầu "giảm giá tối đa 30%" → "giảm giá tối đa 50%", nhờ traceability matrix bạn biết ngay 12 test case và 3 user story cần xem lại. Không có traceability, bạn chỉ có thể đoán.

**Hai vai trò** trong CTFL v4.0 (thay đổi so với v3.1 trước đây):

- **Test management role** — chịu trách nhiệm quản lý quy trình kiểm thử, lập kế hoạch, lãnh đạo team. Tương đương Test Manager/Test Lead truyền thống.
- **Testing role** — chịu trách nhiệm phần kỹ thuật: phân tích, thiết kế, thực thi test. Tương đương Tester/Test Engineer.

Trong dự án nhỏ, một người có thể đảm nhiệm cả hai vai trò. Trong dự án lớn (50+ người), các vai trò này được tách rõ ràng.

### 1.5 Kỹ năng và thực hành tốt

**Kỹ năng chung của tester** — tester không chỉ cần biết kỹ thuật mà còn cần các kỹ năng mềm quan trọng:

- **Kiến thức kiểm thử**: hiểu sâu kỹ thuật, quy trình, công cụ. Đây là điều kiện cần.
- **Tỉ mỉ, chú ý chi tiết**: bỏ sót một dấu chấm phẩy trong test data có thể che giấu một bug nghiêm trọng.
- **Kỹ năng giao tiếp**: viết defect report rõ ràng, thuyết phục developer fix bug, báo cáo với manager.
- **Tư duy phân tích và phản biện**: đặt câu hỏi "what if...?" liên tục — điều gì xảy ra nếu user nhập số âm? Mất mạng giữa chừng?
- **Sáng tạo**: nghĩ ra các tình huống "lạ" mà developer không lường trước.
- **Kiến thức kỹ thuật và miền**: hiểu công nghệ (web, mobile, API) và lĩnh vực kinh doanh (ngân hàng, y tế, e-commerce).

Whole-team approach (Agile)

Trong Agile, **cả team chịu trách nhiệm về chất lượng** — không phải "QA test, dev code". Tester tham gia từ refinement backlog; developer viết unit test; PO/BA review test case. **Ví dụ:** trong sprint planning, tester chỉ ra rằng một user story thiếu acceptance criteria → developer và PO cùng bổ sung trước khi bắt đầu code. Việc này ngăn defect ngay từ đầu.

Độc lập của kiểm thử (Independence of testing)

Tester độc lập phát hiện được các defect mà developer (tác giả code) thường bỏ qua, vì có "góc nhìn khác". Có nhiều mức độ độc lập:

1. **Không độc lập**: developer tự test code của chính mình.
2. **Độc lập một phần**: developer khác trong cùng team test.
3. **Độc lập trong tổ chức**: team QA riêng trong cùng công ty.
4. **Độc lập hoàn toàn**: thuê tổ chức bên ngoài (third-party testing).

Mức độ càng cao càng tốt cho việc phát hiện defect, nhưng cũng tốn nhiều chi phí và thời gian giao tiếp hơn. Lựa chọn dựa trên rủi ro và bối cảnh.
