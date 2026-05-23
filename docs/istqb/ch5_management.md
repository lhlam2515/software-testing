---
title: "Chương 05: Quản lý hoạt động kiểm thử (Managing Test Activities)"
source: "https://www.fit.hcmus.edu.vn/~lqvu/Courses/SoftwareTesting/istqb-foundation-selfstudy.html"
chapter: 5
tags: [istqb, software-testing, foundation-level, ctfl-v4]
---

### 5.1 Lập kế hoạch kiểm thử

Test plan là tài liệu mô tả mục tiêu, phạm vi, nguồn lực, lịch trình và phương pháp kiểm thử cho một dự án hoặc cấp độ test. Đây là "bản đồ" định hướng toàn bộ hoạt động test. Test plan tốt giúp team thống nhất kỳ vọng, ước lượng chi phí, và dễ điều chỉnh khi tình huống thay đổi.

Tester đóng góp vào planning bằng nhiều cách: ước lượng effort cho từng test level, nhận diện và đánh giá rủi ro, định nghĩa acceptance criteria cùng PO, refine backlog với developer. Trong Agile, planning là hoạt động liên tục — không phải làm một lần đầu rồi thôi.

**Một test plan điển hình** bao gồm: phạm vi (in/out of scope), mục tiêu, test items, features cần test, test approach, deliverables, entry/exit criteria, lịch trình, vai trò, rủi ro và biện pháp giảm thiểu, môi trường, công cụ.

| Entry criteria | Exit criteria (DoD) |
| --- | --- |
| Điều kiện để **bắt đầu** một hoạt động test. | Điều kiện để **hoàn tất** hoạt động test. |
| VD: Môi trường test sẵn sàng; smoke test pass; build được deploy; test data có sẵn. | VD: 100% test case đã chạy; mọi critical defect đã fix; coverage ≥ 80%; completion report được approve. |

**Bẫy đề thi:** "Defect đã fix" là **exit**, không phải entry. Entry là điều kiện **bắt đầu**; defect chỉ phát sinh sau khi đã bắt đầu test.

Bốn kỹ thuật ước lượng

- **Estimation by ratio**: dùng tỉ lệ chuẩn ngành — VD: "test effort ≈ 30% effort phát triển". Đơn giản nhưng phụ thuộc dữ liệu chính xác.
- **Extrapolation**: dùng dữ liệu các dự án trước tương tự để ngoại suy. VD: "dự án A có 100 user story → 500 giờ test; dự án B có 80 story → ước lượng 400 giờ".
- **Wideband Delphi / Planning Poker**: nhiều chuyên gia ước lượng độc lập, thảo luận chênh lệch, lặp lại đến đồng thuận. Phổ biến trong Agile.
- **Three-point estimation**: ước lượng ba số — Best case (B), Most likely (M), Worst case (W) — rồi áp dụng công thức PERT: E = (B + 4M + W) / 6. Có tính đến rủi ro.

Ví dụ — three-point estimation cho một sprint
**Tình huống**: Ước lượng effort test cho 1 sprint có 8 user story.\
\
Sau khi thảo luận với team:\
  • Best case (mọi thứ thuận lợi): 40 giờ\
  • Most likely (kinh nghiệm thông thường): 60 giờ\
  • Worst case (môi trường hỏng, defect nhiều): 100 giờ\
\
**PERT**: E = (40 + 4×60 + 100) / 6 = 380 / 6 ≈ 63 giờ.\
\
So với ước lượng đơn (chỉ "Most likely" = 60 giờ), three-point tự nhiên cộng thêm 5% phòng rủi ro. Khi báo cáo, có thể nói "ước lượng 63 giờ, dao động 40-100 giờ".

Test pyramid

Mô hình phân bổ test theo tỷ lệ:

- **Đáy (rộng nhất)**: Component/unit test — rất nhiều (500-5000), chạy < 1 giây, gọi vào isolation. Phát hiện defect rẻ và nhanh.
- **Giữa**: Integration/API test — ít hơn (50-500), tốc độ trung bình, test tương tác giữa module hoặc với DB/API.
- **Đỉnh (hẹp nhất)**: End-to-end UI test — rất ít (5-50), chậm, test toàn flow qua giao diện thực.

**"Ice-cream cone" anti-pattern**: ngược lại — nhiều UI test, ít unit test. Dẫn đến: test chạy 4 giờ mỗi lần, dễ flaky, khó debug.

Testing quadrants (Brian Marick)

Mô hình 2×2 phân loại test theo 2 trục:

- **Trục ngang**: business-facing (hiểu được bởi business) ↔ technology-facing (cần kiến thức kỹ thuật).
- **Trục dọc**: support development (hỗ trợ team viết code đúng) ↔ critique product (đánh giá sản phẩm).

Bốn ô:

- **Q1** (tech, support): Unit test, component integration. Automated.
- **Q2** (business, support): Functional test, story test, simulation. Both auto & manual.
- **Q3** (business, critique): Exploratory testing, UAT, alpha/beta. Manual.
- **Q4** (tech, critique): Performance, security, reliability test. Tool-supported.

Bốn ô đều cần thiết — không bỏ qua ô nào.

### 5.2 Quản lý rủi ro

Rủi ro là yếu tố có thể có tác động tiêu cực đến mục tiêu — của dự án hoặc sản phẩm. Quản lý rủi ro trong kiểm thử là tập trung effort vào những vùng có khả năng/tác động cao nhất, thay vì test đồng đều (vốn không khả thi do nguyên lý 2).

Định nghĩa cốt lõi

Risk level = Likelihood × Impact

**Likelihood** (xác suất xảy ra): có thể đánh giá định tính (thấp/trung bình/cao) hoặc định lượng (0-1).\
**Impact** (mức độ tác động nếu xảy ra): đánh giá theo thiệt hại tài chính, danh tiếng, an toàn người dùng, vi phạm pháp luật.\
**Risk level** kết quả thường được đặt vào ma trận 3×3 hoặc 5×5 — vùng đỏ cần ưu tiên test cao nhất.

| Project risk | Product (quality) risk |
| --- | --- |
| Ảnh hưởng đến khả năng **giao** dự án đúng hạn, đúng chi phí, đúng phạm vi. | Ảnh hưởng đến **chất lượng** sản phẩm sau khi giao. |
| VD: nhà cung cấp hardware giao trễ, senior tester nghỉ việc, ngân sách cắt giảm, công cụ chưa được mua. | VD: payment module lỗi dưới tải; lỗ hổng bảo mật trong API; UI khó dùng; thiếu accessibility. |
| Test management role xử lý. | Cả test management và testing role xử lý. |

Ví dụ — risk-based testing cho app ngân hàng
**Tình huống**: Sắp release app banking, có 50 chức năng. Effort test chỉ đủ làm 60%. Phân tích rủi ro để quyết định test gì.\
\
**Phân tích sơ bộ** (ma trận 3×3):\

```
Chức năng              | Likelihood | Impact | Level
───────────────────────┼────────────┼────────┼──────
Chuyển khoản           |     Cao    |  Cao   | ĐỎ
Đăng nhập 2FA          |     TB     |  Cao   | ĐỎ
Xem số dư              |     Thấp   |  Cao   | VÀNG
Thay đổi avatar        |     Thấp   |  Thấp  | XANH
Lịch sử giao dịch      |     TB     |  TB    | VÀNG
...
```

**Quyết định**:\
  • ĐỎ (8 chức năng): test sâu — unit, integration, system, performance, security. 60% effort.\
  • VÀNG (20 chức năng): test cơ bản — happy path + 2-3 negative test. 30% effort.\
  • XANH (22 chức năng): smoke test thôi. 10% effort.\
\
**Tiết kiệm**: thay vì test đều mọi thứ (không khả thi), tập trung vào vùng có khả năng gây thiệt hại lớn nhất.

Risk-based testing — 4 hoạt động

1. **Risk identification**: brainstorm với team, dùng checklist, kinh nghiệm.
2. **Risk analysis**: đánh giá likelihood và impact cho mỗi rủi ro.
3. **Risk treatment**: quyết định mitigation — test sâu, chấp nhận, chuyển giao, tránh né.
4. **Risk monitoring**: theo dõi xem rủi ro có giảm sau test không; có rủi ro mới phát sinh không.

### 5.3 Theo dõi, kiểm soát và kết thúc kiểm thử

Khi việc test đang diễn ra, test manager cần theo dõi tiến độ thực tế, so sánh với kế hoạch, và đưa ra hành động điều chỉnh nếu lệch. Đây là chu trình **monitor → analyze → control**. Kết thúc test level/dự án, cần đúc kết và báo cáo.

**Metrics điển hình** mà test manager theo dõi:

- **Tiến độ test case**: số test case kế hoạch / đã thiết kế / đã thực thi / pass / fail / blocked.
- **Defect**: số defect tìm thấy / đã fix / đang chờ / được defer (hoãn); trend theo thời gian.
- **Coverage**: % requirements đã có test, % code đã chạy (nếu có tool), % risk đã được cover.
- **Effort**: giờ thực tế vs ước lượng, theo từng pha (planning, design, execution).
- **Chất lượng môi trường**: % thời gian môi trường stable, số lần xảy ra blocker.

| Test progress report | Test completion report |
| --- | --- |
| Trong khi test đang diễn ra. | Cuối test level hoặc cuối dự án. |
| Cho phép điều phối kịp thời. | Đúc kết toàn bộ, bài học, residual risk. |
| Thường hàng tuần hoặc hàng sprint. | Một lần. |

Ví dụ — đoạn trích test progress report tuần 3

```
SPRINT 3 — TEST PROGRESS (ngày 15/03/2026)

Test cases:
  Kế hoạch:       120
  Đã thực thi:     78 (65%)
  Pass:           65
  Fail:            8
  Blocked:         5
  Còn lại:        42

Defects:
  Tìm thấy:       17 (Critical: 2, High: 6, Med: 7, Low: 2)
  Đã fix:         11
  Đang chờ fix:    4
  Re-test pending: 2

Coverage:
  Requirements:   28/35 (80%)
  Code (Jacoco):  72%

Rủi ro / blocker:
  - Môi trường staging down 2 lần tuần này (tổng 4h)
  - Performance test bị defer sang sprint 4 do thiếu data

Đề xuất:
  - Thêm 1 dev part-time hỗ trợ fix 6 high-severity
  - Schedule training với QA team về Cypress
```

### 5.4 Quản lý cấu hình

Configuration management (CM) định danh, kiểm soát và theo dõi mọi **testware** (test case, test script, test data, test environment, test report) và các phiên bản của chúng. CM đảm bảo:

- **Identification**: mỗi testware có ID duy nhất và phiên bản.
- **Version control**: mọi thay đổi được ghi nhận, có thể rollback.
- **Traceability**: liên kết testware với requirement, code, defect.
- **Repeatability**: bất cứ ai cũng có thể lấy một phiên bản test cụ thể và chạy lại y nguyên.

Nếu không có CM tốt, bug "không thể tái hiện" trở thành câu trả lời quen thuộc và cuộc tranh cãi "tôi đã fix rồi" vs "vẫn fail" không có hồi kết.

Ví dụ — CM trong thực tế với Git
**Cấu trúc repo**:\

```
/app
  /src              ← production code
  /tests
    /unit           ← unit tests, chạy với mỗi commit
    /integration    ← chạy mỗi đêm
    /e2e            ← chạy trước release
  /test-data
    /staging.json   ← dữ liệu test staging
  /testware
    /test-cases     ← Word/Excel file mô tả manual test
    /test-plans     ← test plan cho từng sprint
```

**Workflow**:\
  • Tester sửa test case TC047 → commit "fix: TC047 cập nhật expected result theo spec mới" → tag với version sprint.\
  • Build #234 chạy 500 test → fail TC047 → log defect kèm "commit hash a3f1b9, build 234, test data v2".\
  • Khi defect được retest sau fix → checkout đúng commit a3f1b9, chạy lại y nguyên → biết chắc đã fix hay chưa.\
\
Không có CM → không biết tester nào đã đổi gì, không thể tái hiện bug → mất nhiều giờ debug.

### 5.5 Quản lý lỗi

Defect management là quy trình theo dõi mọi anomaly từ khi phát hiện đến khi đóng. Mỗi defect có một vòng đời và một bản ghi (defect report) chính thức trong tool như Jira, Azure DevOps, Bugzilla.

**Vòng đời defect điển hình**:

```
NEW → ASSIGNED → IN PROGRESS → FIXED → RE-TESTED → CLOSED
                      ↓
                   REJECTED (không phải defect / không reproduce được)
                      ↓
                   DEFERRED (defect thật, fix sau)
                      ↓
                   REOPENED (re-test fail, fix chưa đúng)
```

**Nội dung một defect report tốt**:

- **ID** duy nhất (auto-generated)
- **Tiêu đề** ngắn gọn, mô tả vấn đề (không phải "App lỗi" mà "Login fail với email có dấu +")
- **Mô tả**: hành vi quan sát được, kèm screenshot/video nếu có
- **Các bước reproduce**: 1, 2, 3... cụ thể đến mức người khác làm theo được
- **Expected vs Actual**: kỳ vọng vs thực tế
- **Severity**: tác động kỹ thuật (Critical/High/Med/Low)
- **Priority**: mức cấp bách fix (P1/P2/P3/P4)
- **Môi trường**: OS, browser, version, server
- **Người báo cáo, thời gian, attachments**

Ví dụ — defect report đầy đủ

```
ID: BUG-2026-0247
Tiêu đề: [Login] Tài khoản bị khóa sau 3 lần sai password
          nhưng không có thông báo cho user

Reporter: Nguyễn Minh (tester)
Date: 15/03/2026 14:25
Severity: High
Priority: P2
Component: Authentication module v2.3 .1
Environment:
  - Browser: Chrome 120, Firefox 121
  - OS: Windows 11, macOS Sonoma
  - Backend: staging server (build #234)

MÔ TẢ:
Sau khi user nhập sai password 3 lần liên tiếp, hệ thống tự
động khóa tài khoản 30 phút (đúng theo spec SEC-005), nhưng
không có thông báo nào cho user biết. User vẫn thấy form
login và nghĩ rằng mình tiếp tục nhập sai password.

BƯỚC REPRODUCE:
1. Đi đến trang Login
2. Nhập email hợp lệ: test@hcmus.edu.vn
3. Nhập password sai 3 lần liên tiếp
4. Quan sát message hiển thị

EXPECTED:
Sau lần thứ 3, hiển thị: "Tài khoản đã bị khóa 30 phút do
nhập sai password nhiều lần. Vui lòng thử lại sau."

ACTUAL:
Vẫn hiển thị "Email hoặc password không đúng" giống các
lần trước.

ATTACHMENTS:
- screenshot-1.png (lần thử thứ 3)
- screenshot-2.png (lần thử thứ 4)
- backend.log (cho thấy account đã locked)
```

**Severity ≠ Priority.** Hai khái niệm thường bị nhầm. **Severity** = mức độ tác động kỹ thuật lên sản phẩm. **Priority** = mức cấp bách fix theo bối cảnh kinh doanh. Ví dụ: typo trên logo công ty có **severity thấp** (không ảnh hưởng chức năng) nhưng **priority cao** (phải fix trước khi launch). Ngược lại, một crash khi user nhập 1 triệu ký tự vào search box có **severity cao** (crash app) nhưng **priority thấp** (không có user thực nào nhập như vậy). Developer quyết định severity, business/PO quyết định priority.
