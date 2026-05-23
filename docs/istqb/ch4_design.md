---
title: "Chương 04: Phân tích và thiết kế kiểm thử (Test Analysis and Design)"
source: "https://www.fit.hcmus.edu.vn/~lqvu/Courses/SoftwareTesting/istqb-foundation-selfstudy.html"
chapter: 4
tags: [istqb, software-testing, foundation-level, ctfl-v4]
---

**Đây là chương nặng nhất.** Sáu câu K3 nghĩa là phải **áp dụng** kỹ thuật, không chỉ thuộc lý thuyết.

### 4.1 Tổng quan các kỹ thuật kiểm thử

Kỹ thuật kiểm thử là cách tiếp cận có hệ thống để suy ra test case từ một nguồn thông tin nào đó (test basis). Mỗi kỹ thuật có điểm mạnh riêng, phù hợp với loại defect và bối cảnh khác nhau. Tester giỏi không phụ thuộc vào một kỹ thuật duy nhất — họ phối hợp nhiều kỹ thuật cho từng tình huống.

ISTQB chia các kỹ thuật thành ba nhóm lớn dựa trên nguồn thông tin sử dụng:

| Loại | Dựa trên | Ví dụ kỹ thuật | Khi nào dùng |
| --- | --- | --- | --- |
| Black-box (specification-based) | Đặc tả — không cần biết bên trong. | Equivalence partitioning, BVA, decision tables, state transition. | Có spec rõ ràng, test ở mức system/acceptance. |
| White-box (structure-based) | Cấu trúc nội bộ của đối tượng kiểm thử. | Statement coverage, branch coverage. | Có quyền truy cập code, test ở mức component. |
| Experience-based | Kiến thức, trực giác và kinh nghiệm tester. | Error guessing, exploratory, checklist-based. | Spec yếu, tester có kinh nghiệm miền. |

**Lưu ý:** Ba nhóm này không loại trừ nhau — trong thực tế bạn nên dùng **kết hợp**. **VD:** dùng EP/BVA để xây test ban đầu, exploratory để tìm các vùng "lạ", coverage tool để đo độ phủ code.

### 4.2 Kỹ thuật black-box

Black-box (còn gọi specification-based) suy ra test case từ đặc tả mà không cần biết cấu trúc bên trong. Tester nhìn hệ thống như "hộp đen" — quan tâm input/output, không quan tâm code thế nào. Có 4 kỹ thuật cốt lõi trên đề thi.

1. Phân chia tương đương (Equivalence Partitioning — EP)

Chia miền giá trị đầu vào (hoặc đầu ra) thành các **partition** mà các thành viên trong cùng partition cần được xử lý **như nhau**. Test một giá trị mỗi partition là đủ — vì nếu một giá trị pass/fail, các giá trị khác trong cùng partition cũng vậy.

**Quy tắc**: cho mỗi miền, luôn có ít nhất một partition hợp lệ (valid) và các partition không hợp lệ (invalid).

Ví dụ — trường giảm giá nhận 1–99
**Phân tích partition**:\
  • P1 (hợp lệ): { 1, 2, 3, ..., 99 } → test với 50\
  • P2 (không hợp lệ, thấp): { ..., -1, 0 } → test với 0\
  • P3 (không hợp lệ, cao): { 100, 101, ... } → test với 120\
  • P4 (không phải số): "abc", "1.5 ", "@" → test với "abc"\
\
**Tổng cộng**: 4 test case để đạt 100% EP coverage. So với việc test 1 → 99 (99 test case), EP tiết kiệm 95 lần.

1. Phân tích giá trị biên (Boundary Value Analysis — BVA)

Defect tập trung tại **biên của partition** nhiều hơn ở giữa — vì developer thường nhầm < với <=, quên xử lý giá trị đầu/cuối. BVA test các giá trị **tại** và **xung quanh** mỗi biên.

Có 2 biến thể chính:

- **2-value BVA**: biên + hàng xóm **không hợp lệ**. Mỗi biên = 2 giá trị.
- **3-value BVA**: biên + cả hai hàng xóm. Mỗi biên = 3 giá trị (chặt chẽ hơn).

Ví dụ — trường giảm giá hợp lệ 1..99
**Biên**: 1 và 99 (cận dưới và cận trên của partition hợp lệ).\
\
**2-value BVA**: { 0, 1, 99, 100 } → 4 test case (biên + hàng xóm không hợp lệ ngay sát).\
\
**3-value BVA**: { 0, 1, 2, 98, 99, 100 } → 6 test case (cộng thêm hàng xóm hợp lệ).\
\
**Áp dụng cho trường tuổi 18–65**:\
  • 2-value BVA: { 17, 18, 65, 66 } → 4 test case\
  • 3-value BVA: { 17, 18, 19, 64, 65, 66 } → 6 test case\
\
**Công thức nhanh cho đề thi**: với N biên (mỗi partition hợp lệ có 2 biên), 2-value BVA cần 2N test case, 3-value BVA cần 3N test case (hoặc 3N với một số trùng lắp).

1. Decision table testing

Phù hợp khi có **nhiều điều kiện kết hợp** tạo thành các hành động khác nhau — kiểu "nếu A và B thì X, nếu A và không B thì Y...". Quá nhiều "if/else" lồng nhau dễ làm tester bỏ sót case.

Decision table có:

- **Condition rows**: các điều kiện đầu vào (Y/N).
- **Action rows**: các hành động đầu ra (Y/N hoặc giá trị).
- **Rule columns**: mỗi cột = một tổ hợp duy nhất. N điều kiện boolean → 2ᴺ tổ hợp tối đa.

100% decision table coverage = mỗi cột được chạy ít nhất một lần.

Ví dụ — quy tắc giảm giá thành viên
**Quy tắc kinh doanh**: thành viên VIP được giảm 10%; đơn ≥ 1 triệu được miễn phí ship; nếu cả hai → giảm 15% + free ship.\
\
**Decision table**:\

```
Conditions       | R1 | R2 | R3 | R4
─────────────────┼────┼────┼────┼────
Is VIP?          | N  | N  | Y  | Y
Order ≥ 1M?      | N  | Y  | N  | Y
─────────────────┼────┼────┼────┼────
Actions          |    |    |    |
Discount         | 0% | 0% |10% |15%
Free ship?       | N  | Y  | N  | Y
```

2 điều kiện → 2² = 4 cột → cần 4 test case. Mỗi test verify cả discount và free ship cho một tổ hợp.\
\
**Lưu ý**: đôi khi có thể "nén" (collapse) decision table — nếu một số combination cho cùng action, có thể gộp lại. Nhưng trong đề thi, câu hỏi "tối đa bao nhiêu cột" → dùng 2ᴺ.

1. State transition testing

Phù hợp khi hành vi hệ thống phụ thuộc **trạng thái hiện tại + sự kiện đến**: login flow, vòng đời đơn hàng, máy ATM, đèn giao thông. Mô hình hóa bằng state diagram: các **state** (trạng thái), **transition** (chuyển trạng thái khi có sự kiện), **guard** (điều kiện), **action** (hành động kèm theo).

Các mức coverage (từ yếu đến mạnh):

- **All states**: thăm mỗi state ít nhất một lần (yếu nhất).
- **All transitions**: chạy mọi transition hợp lệ. Đây thường là mục tiêu thực tế.
- **All N-switches**: chuỗi N transition liên tiếp được test. N càng lớn càng chặt chẽ.

Ví dụ — vòng đời đơn hàng e-commerce
**States**: Draft → Submitted → Paid → Shipped → Delivered (đường thuận); có thể Cancelled từ Draft/Submitted; có thể Refunded từ Paid/Delivered.\
\
**Transitions** (mỗi cái cần ít nhất 1 test):\
  1. Draft → Submitted (event: click "Đặt hàng")\
  2. Draft → Cancelled (event: xóa giỏ)\
  3. Submitted → Paid (event: payment success)\
  4. Submitted → Cancelled (event: hủy trước payment)\
  5. Paid → Shipped (event: warehouse confirm)\
  6. Paid → Refunded (event: hủy sau payment)\
  7. Shipped → Delivered (event: customer confirm)\
  8. Delivered → Refunded (event: return policy)\
\
**All-states coverage**: thăm 6 state → ít nhất 5-6 test.\
**All-transitions coverage**: 8 transitions → ít nhất 8 test (chặt chẽ hơn).\
\
**Defect điển hình**: developer có thể vô tình cho phép transition không hợp lệ — VD: Delivered → Cancelled (đã giao mà vẫn cho hủy → mất hàng). State transition testing tìm ra điều này.

### 4.3 Kỹ thuật white-box

White-box (structure-based) suy ra test case từ **cấu trúc nội bộ** của đối tượng kiểm thử. Cần truy cập source code. Mục tiêu: đo lường "code đã được test bao nhiêu?". Thường được developer áp dụng ở component testing với sự hỗ trợ của coverage tool (JaCoCo cho Java, Coverage.py cho Python, Istanbul cho JS).

CTFL chỉ yêu cầu hai mức coverage cơ bản:

Statement testing & coverage

Mỗi câu lệnh thực thi của code phải được chạy ít nhất một lần.

Statement coverage % = (số statement đã chạy / tổng số statement) × 100%

Đây là mức coverage **yếu nhất** — chỉ đảm bảo mọi dòng được "đụng đến", nhưng không đảm bảo mọi nhánh của decision đã được test.

Branch testing & coverage

Mỗi **nhánh** (kết quả true và false của mọi quyết định/decision) phải được chạy.

**Quan hệ quan trọng**: 100% branch coverage **bao hàm** 100% statement coverage, nhưng **không ngược lại**. Vì để chạy mọi nhánh, bạn phải chạy mọi statement; nhưng chạy mọi statement không nhất thiết chạy mọi nhánh.

Ví dụ minh họa — sự khác biệt statement vs branch
**Code**:\

```
function checkAge(age) {
  if (age >= 18) {
    return "adult";
  }
  return "minor";
}
```

**Test 1**: checkAge(25) → chạy: dòng 2, 3 → branch true của if.\
  Statement coverage: 2/3 = 66%. Branch coverage: 1/2 = 50%.\
\
**Thêm Test 2**: checkAge(15) → chạy: dòng 2, 4 → branch false.\
  Statement coverage: 3/3 = 100%. Branch coverage: 2/2 = 100%.\
\
**Trường hợp đặc biệt** — if không có else:\

```
function discount(total) {
  let d = 0;
  if (total > 1000000) {
    d = total * 0.1 ;
  }
  return d;
}
```

**Test 1**: discount(2000000) → cả 4 statement được chạy.\
  Statement coverage: 100% với chỉ 1 test!\
  Nhưng branch coverage: chỉ 50% — branch false chưa được test.\
  Phải thêm discount(500000) để đạt 100% branch.\
\
**Bài học**: nếu chỉ đặt mục tiêu statement coverage, có thể bỏ sót defect ở nhánh không có else.

**Giá trị và giới hạn của coverage:** 100% coverage **không** đồng nghĩa với "không còn bug". Coverage chỉ đo những gì đã được test, không đo chất lượng oracle (kỳ vọng), cũng không đo các tổ hợp đầu vào. Coverage là **điều kiện cần, không phải điều kiện đủ**.

### 4.4 Kỹ thuật dựa trên kinh nghiệm

Kỹ thuật dựa trên kinh nghiệm tận dụng kiến thức và trực giác của tester về các loại defect phổ biến, đặc điểm của hệ thống và miền nghiệp vụ. Chúng không yêu cầu spec chính thức — phù hợp khi tài liệu yếu, thay đổi nhanh, hoặc cần bổ sung cho các kỹ thuật khác. Ba kỹ thuật chính:

1. Error guessing

Tester dự đoán các loại defect mà developer dễ mắc và thiết kế test nhắm vào đó. Dựa trên kinh nghiệm cá nhân, kiến thức về hệ thống tương tự, và "danh sách lỗi điển hình" (common defect taxonomies).

**Các loại thường được "đoán"**: chia cho 0, null/undefined input, chuỗi rỗng, mảng rỗng, giá trị âm, ngày 29/2, timezone, race condition, mất kết nối giữa chừng.

Ví dụ — error guessing cho form đăng ký
**Form**: tên, email, password, ngày sinh, số điện thoại.\
\
**Test "đoán" của tester có kinh nghiệm**:\
  • Tên có ký tự đặc biệt (Nguyễn O'Connor, 王明)\
  • Email có dấu + (<user+tag@example.com>)\
  • Password chứa SQL injection (' OR 1=1 --)\
  • Ngày sinh 29/2/2000 (năm nhuận)\
  • Ngày sinh ở tương lai\
  • SĐT có khoảng trắng (0901 234 567)\
  • Submit form khi mất mạng giữa chừng\
\
Những test này khó suy ra từ spec — chỉ có người đã từng gặp các bug tương tự mới nghĩ đến.

1. Exploratory testing

Test thiết kế, thực thi và phân tích đồng thời. Tester khám phá hệ thống, mỗi phát hiện dẫn đến test tiếp theo. Thường được tổ chức thành **session** có time-box (60-120 phút), với mục đích cụ thể (gọi là **charter**).

Phù hợp khi: spec yếu, sản phẩm thay đổi nhanh, cần bổ sung cho test script chính thức, hoặc khám phá vùng mới.

Ví dụ — phiên exploratory cho app chat
**Charter**: "Khám phá chức năng gửi file đính kèm để tìm bug edge case" — 90 phút.\
\
**Hoạt động trong phiên**:\
  • Gửi ảnh 5MB, 50MB, 500MB → phát hiện app crash với file > 100MB.\
  • Gửi file tên có dấu tiếng Việt "báo\_cáo.docx" → tên file bị mã hóa thành "%E1%BA%A3o".\
  • Gửi file .exe → chấp nhận (lỗ hổng bảo mật?).\
  • Gửi 10 file cùng lúc → app freeze 5 giây.\
  • Tắt wifi giữa lúc upload → app báo "uploaded" nhưng phía nhận không có file.\
\
**Kết quả**: 4 defect được log, kèm session notes ghi lại quá trình tư duy. Các bug này hầu như chắc chắn không có trong test plan chính thức.

1. Checklist-based testing

Test dựa trên danh sách các mục cần kiểm tra. Checklist có thể được rút ra từ kinh nghiệm, tiêu chuẩn (như OWASP cho security), heuristics, hoặc các bug đã gặp trước.

Ưu điểm: dễ đào tạo tester mới, đảm bảo coverage đều, lưu giữ kinh nghiệm tập thể. Nhược điểm: chi tiết quá → cứng nhắc; chi tiết quá ít → mỗi tester làm một kiểu.

Ví dụ — checklist cho UI form
**Checklist 12 mục cho mọi form trên app**:\
  1. ☐ Tab key di chuyển đúng thứ tự field.\
  2. ☐ Enter key submit form (nếu phù hợp).\
  3. ☐ Field bắt buộc đánh dấu \* và validate.\
  4. ☐ Error message hiển thị gần field lỗi.\
  5. ☐ Reset/Cancel xóa toàn bộ input.\
  6. ☐ Submit double-click không tạo 2 record.\
  7. ☐ Disabled state hiển thị rõ.\
  8. ☐ Loading state khi submit.\
  9. ☐ Field text dài không vỡ layout.\
  10. ☐ Validation real-time vs on-submit nhất quán.\
  11. ☐ Form hoạt động trên mobile (touch, keyboard).\
  12. ☐ Tương thích với screen reader (accessibility).\
\
Mỗi form mới được tester chạy qua 12 mục → đảm bảo không bỏ sót những vấn đề cơ bản.

### 4.5 Phương pháp dựa trên cộng tác

Trong Agile, kiểm thử không chỉ là việc của QA mà là kết quả của sự cộng tác giữa các vai trò khác nhau. CTFL v4.0 nhấn mạnh ba cách tiếp cận:

1. Three amigos

Trước khi bắt đầu code một user story, ba vai trò họp ngắn (15-30 phút):

- **Business (PO/BA)**: "Tôi muốn người dùng đặt vé qua QR code."
- **Developer**: "Tôi nghĩ implementation thế này, có ràng buộc kỹ thuật X."
- **Tester**: "Vậy điều gì xảy ra nếu QR đã được dùng? QR hết hạn? Mất mạng?"

Mỗi vai trò mang góc nhìn riêng → user story được làm rõ trước khi code → giảm rework.

1. User story chuẩn INVEST

User story tốt thoả mãn 6 tiêu chí **INVEST**:

- **I — Independent**: độc lập với các story khác.
- **N — Negotiable**: chi tiết có thể thương lượng.
- **V — Valuable**: mang lại giá trị cho người dùng.
- **E — Estimable**: đội có thể ước lượng được effort.
- **S — Small**: đủ nhỏ để xong trong 1 sprint.
- **T — Testable**: có acceptance criteria rõ ràng, kiểm chứng được.

Cấu trúc điển hình: **"As a [vai trò], I want [hành động] so that [lợi ích]"**, kèm danh sách acceptance criteria.

Ví dụ — user story tốt vs xấu
**Xấu**: "Hệ thống phải nhanh và an toàn." — vi phạm V (không rõ giá trị), T (không testable), S (quá rộng).\
\
**Tốt**:\
**"As a customer, I want to reset my password via email so that I can regain access when I forget it."**\
\
**Acceptance criteria**:\
  • Given user clicks "Forgot password", When they enter a registered email, Then a reset link is sent within 30 seconds.\
  • Given a reset link is opened, When more than 60 minutes have passed since sending, Then show "link expired" message.\
  • Given a valid reset link, When user enters new password (≥ 8 chars), Then password is updated and user can login.

1. ATDD & BDD

**Acceptance Test-Driven Development (ATDD)**: viết acceptance test **trước** khi code, dựa trên thảo luận với khách hàng. Test trở thành "đặc tả sống" (executable specification).

**Behavior-Driven Development (BDD)**: mở rộng ATDD với cú pháp **Given/When/Then** dễ đọc, được hỗ trợ bởi tool như Cucumber, SpecFlow.

Ví dụ — kịch bản BDD bằng Gherkin

```
Feature: Login

  Scenario: Đăng nhập thành công
    Given user đã đăng ký với email "test@hcmus.edu.vn"
    And password "MK@2026"
    When user nhập đúng email và password
    Then user được chuyển đến trang Dashboard
    And hiển thị thông báo "Xin chào, [tên]"

  Scenario: Đăng nhập thất bại do sai password
    Given user đã đăng ký với email "test@hcmus.edu.vn"
    When user nhập email "test@hcmus.edu.vn" và password "saiMK"
    Then hiển thị lỗi "Email hoặc password không đúng"
    And user vẫn ở trang đăng nhập
```

Cú pháp này business analyst, developer và tester đều đọc hiểu — kịch bản trở thành ngôn ngữ chung. Cucumber chuyển những file này thành test tự động.
