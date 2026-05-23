---
title: "Chương 03: Kiểm thử tĩnh (Static Testing)"
source: "https://www.fit.hcmus.edu.vn/~lqvu/Courses/SoftwareTesting/istqb-foundation-selfstudy.html"
chapter: 3
tags: [istqb, software-testing, foundation-level, ctfl-v4]
---

### 3.1 Cơ bản về kiểm thử tĩnh

**Kiểm thử tĩnh (static testing)** là việc kiểm tra sản phẩm công việc **mà không thực thi code**. **Kiểm thử động (dynamic testing)** đòi hỏi thực thi phần mềm với input cụ thể. Cả hai đều có vai trò bổ sung cho nhau — không thay thế.

Kiểm thử tĩnh có hai dạng chính:

- **Review** — con người xem xét tài liệu (yêu cầu, design, code, test case). Có thể không chính thức (informal) hoặc chính thức (inspection).
- **Static analysis** — công cụ tự động phân tích code mà không chạy. **VD:** SonarQube tìm code smell, ESLint check JavaScript, FindBugs cho Java, Checkstyle cho coding standard.

|  | Kiểm thử tĩnh | Kiểm thử động |
| --- | --- | --- |
| Cách làm | Review thủ công hoặc static analysis tự động. | Thực thi với input và kiểm tra output. |
| Tìm thấy | Trực tiếp **defect**. | **Failure** do defect gây ra. |
| Áp dụng cho | Yêu cầu, thiết kế, code, test case, hợp đồng, user story. | Code thực thi được. |
| Chi phí sửa | Thấp nhất (sớm). | Cao hơn (muộn hơn). |
| Khi nào áp dụng | Ngay khi có sản phẩm công việc đầu tiên. | Chỉ khi đã có code chạy được. |

Ví dụ — kiểm thử tĩnh phát hiện gì mà động không thể
**Tài liệu yêu cầu**: "Hệ thống phải có khả năng xử lý nhanh các giao dịch quan trọng."\
\
**Kiểm thử tĩnh (review)** phát hiện ngay 3 vấn đề:\

1. **Mơ hồ**: "nhanh" là bao nhiêu giây? "quan trọng" được định nghĩa thế nào?\
2. **Thiếu thông tin**: bao nhiêu giao dịch đồng thời? Trên hardware nào?\
3. **Không kiểm thử được**: không có cách nào viết test case từ yêu cầu này.\
\
**Kiểm thử động** không phát hiện được — vì không có code thực thi, không có input để chạy, và nếu có code thì developer cũng phải đoán xem "nhanh" là gì → mỗi developer hiểu một kiểu, defect đã đi vào code trước khi test động có cơ hội xem.

**Lợi ích của kiểm thử tĩnh**:

- **Phát hiện defect sớm và rẻ** — yêu cầu mơ hồ phát hiện trong 30 phút review tốn ít hơn việc viết code, test, fix sau 2 tuần.
- **Phát hiện loại defect mà động khó tìm** — yêu cầu thiếu, mâu thuẫn giữa các tài liệu, code không tuân thủ chuẩn, lỗ hổng bảo mật trong code chưa được khai thác.
- **Tăng hiểu biết chung** — review buộc team cùng đọc tài liệu, giảm hiểu nhầm.
- **Tăng năng suất** — bug ít hơn ở giai đoạn sau → ít rework hơn.
- **Tăng chất lượng code** — static analysis tự động tìm các pattern xấu mà mắt người dễ bỏ sót.

### 3.2 Quy trình review và phản hồi

Phản hồi sớm và thường xuyên từ các bên liên quan ngăn chặn hiểu nhầm, xây dựng nhận thức chung, và tránh rework tốn kém. Review là cơ chế chính thức nhất để thu thập phản hồi này.

**Năm hoạt động** của một review chính thức:

1. **Planning**: định nghĩa phạm vi, mục tiêu, exit criteria, vai trò, chọn người tham gia, ước lượng effort.
2. **Review initiation**: phân phối tài liệu cần review, brief mục đích cho team.
3. **Individual review**: mỗi reviewer độc lập đọc tài liệu, ghi nhận phát hiện. Đây là pha tốn nhiều thời gian nhất.
4. **Issue communication & analysis**: review meeting — thảo luận findings, phân loại (defect thật / hiểu nhầm / câu hỏi), gán mức độ.
5. **Fixing and reporting**: tác giả sửa, gửi lại; metrics được thu thập (số defect, effort, thời gian).

**Sáu vai trò** chính:

- **Manager**: phê duyệt nguồn lực, quyết định review có diễn ra không.
- **Author**: người viết tài liệu được review.
- **Moderator (facilitator)**: điều phối cuộc họp, đảm bảo quy trình. Trong inspection phải được đào tạo chuyên môn.
- **Scribe**: ghi chép findings và quyết định.
- **Reviewer**: người xem xét và đưa ra phát hiện. Có thể là chuyên gia kỹ thuật, business, hoặc end user.
- **Review leader**: chịu trách nhiệm tổng thể cho review (đôi khi trùng với moderator).

| Loại review | Độ chính thức | Mục đích chính | Ví dụ thực tế |
| --- | --- | --- | --- |
| Informal review | Không / nhẹ | Phát hiện defect, rẻ. | Hai dev nhìn vào màn hình cùng nhau, comment đoạn code đáng nghi. |
| Walkthrough | Do tác giả dẫn | Tìm defect, chia sẻ kiến thức, đồng thuận. | Author trình bày design module mới trong meeting 1 tiếng, team đặt câu hỏi. |
| Technical review | Có tài liệu, moderator được đào tạo | Đạt đồng thuận, đánh giá chất lượng, tìm defect. | Architect review của thiết kế hệ thống mới, có biên bản chính thức. |
| Inspection | Chính thức cao nhất, có quy tắc & vai trò | Tìm defect; đo lường chất lượng; cải tiến quy trình. | Inspection code an toàn của thiết bị y tế, có metrics, audit trail. |

Ví dụ — một buổi review trong dự án thực tế
**Dự án**: app đặt vé xem phim. PO viết user story mới: "Khách hàng đặt vé và chọn ghế ngồi".\
\
**Planning**: tester đề xuất review trước khi dev bắt đầu code. 5 người tham gia: PO (author), tester (reviewer + moderator), 2 dev (reviewer), UX designer (reviewer). Thời gian: 1 giờ.\
\
**Individual review** (offline): mỗi người đọc user story và ghi nhận findings.\
\
**Review meeting**: tester chủ trì. Findings:\
  • Dev1: "Nếu 2 khách cùng chọn 1 ghế thì sao?" — defect: thiếu xử lý xung đột.\
  • UX: "Khách có xem được sơ đồ rạp không?" — defect: thiếu mock-up.\
  • Tester: "Acceptance criteria thế nào?" — defect: chưa định nghĩa.\
  • Dev2: "Có giới hạn ghế tối đa?" — câu hỏi (không phải defect).\
\
**Fix & report**: PO bổ sung 4 mục, gửi lại version 2.\
\
**Kết quả**: 3 defect được tìm ra trước khi code → tiết kiệm ít nhất 2 ngày rework. Nếu không review, các vấn đề này sẽ chỉ xuất hiện khi user thật gặp lỗi.

Yếu tố thành công của review

- **Mục tiêu rõ ràng**: mỗi review phải có mục đích cụ thể (tìm defect? Đạt đồng thuận? Đào tạo?).
- **Đúng người tham gia**: ít người có chuyên môn liên quan thì hơn nhiều người chỉ ngồi nhìn.
- **Defect là phát hiện tích cực**: không đổ lỗi tác giả. Văn hóa "không trách móc" giúp tác giả không giấu defect.
- **Quản lý ủng hộ**: cấp effort, không cắt review khi gấp deadline.
- **Đào tạo**: đặc biệt cho moderator của inspection.
- **Liên tục cải tiến**: rút kinh nghiệm sau mỗi review.
