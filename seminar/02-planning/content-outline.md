# T10 Seminar — Đề xuất cấu trúc nội dung & hoạt động (bản trao đổi với TA)

> **Mục đích tài liệu:** trình bày cấu trúc dự kiến của buổi seminar 45 phút để TA review, góp ý, tinh chỉnh trước khi nhóm dựng slide + worksheet.
> **Topic:** T10 — Mutation Testing & Test Effectiveness · **Công cụ:** StrykerJS + Claude/ChatGPT · **SUT:** EShop Node.js backend.
> Cập nhật: 2026-06-22.

---

## 1. Thông điệp cốt lõi của buổi seminar

> *"Coverage chứng minh test có **chạy** qua code. Mutation testing chứng minh test có **bắt được lỗi** hay không."*

Cả buổi xoay quanh việc chứng minh trực tiếp trên EShop rằng một bộ test có thể đạt coverage cao nhưng mutation score thấp — và cách dùng AI để vá khoảng cách đó một cách có kiểm chứng (không tin mù AI).

---

## 2. Bố cục 45 phút (theo Guide §S6) + phân bổ slide (≤15)

| Thời gian | Phân đoạn | Slide | Nội dung chính |
|---|---|---|---|
| 0:00–0:10 | **Pitch** | S1–S8 | 4 điểm khái niệm TA yêu cầu (xem §3) |
| 0:10–0:20 | **Live Demo** | *(không slide)* | Stryker chạy thật + AI assertion synthesis trên EShop |
| 0:20–0:40 | **Activity** "Kill the Mutant" | S9–S12 | Audience viết assertion để diệt 5 mutant |
| 0:40–0:45 | **Debrief + Q&A** | S13–S15 | Takeaways, references, backup |

> Nguyên tắc của môn: **activity là trọng tâm, slide chỉ là khung**. 10 phút pitch phải gói gọn 4 điểm khái niệm — không sa đà lý thuyết.

---

## 3. Pitch (10 phút) — ánh xạ 4 điểm khái niệm TA yêu cầu

Đây là 4 nội dung TA đã thống nhất phải có. Mỗi điểm gắn với 1–2 slide.

### 3.1. Tổng quan + Mục tiêu + Tại sao *(Slide 2–4)*

- **Khái niệm:** mutation testing seeding lỗi giả (mutant) vào source rồi hỏi "có test nào fail không?". Killed / Survived / Equivalent. Công thức **Mutation Score = Killed / (Total − Equivalent)**.
- **Mục tiêu:** không phải tìm bug trong production code, mà **kiểm định & nâng chất lượng chính bộ test** (Test Effectiveness).
- **Tại sao cần:** vạch trần "test giả tạo" (coverage cao, assert hời hợt); định hướng vá blind spot; tấm lưới an toàn khi refactor.
- **Số liệu mồi (hook):** coverage 96% nhưng mutation score 34%; có suite 100% coverage chỉ 4% mutation score (research_result §1.4) → dùng làm slide mở đầu gây ấn tượng.

### 3.2. Level + Method *(Slide 5)*

- **Level:** chủ yếu **Unit Test level** (chạy mili-giây nên chịu được việc lặp test hàng trăm lần/mutant; độ cô lập cao). Integration: hạn chế (dùng Extreme Mutation nếu cần). System/E2E: gần như không.
- **Method:** **Automated White-box (Glass-box)** — bắt buộc truy cập cấu trúc code (AST/source/bytecode) để sinh mutant; dùng coverage để tối ưu; không thể Manual (state explosion). Đối tượng bị "săm soi" là **bộ test**, không phải production code.

### 3.3. Chiến lược áp dụng cho project bất kỳ (general) *(Slide 6)*

Quy trình tổng quát áp dụng cho hầu hết project, không chỉ EShop (Gemini doc §"How-to"):

1. **Nền tảng trước:** chỉ áp dụng khi line coverage đã ~70–80%; nếu chưa có test thì viết test happy-path trước.
2. **Giới hạn scope:** chỉ quét Core Domain Logic / tính toán tài chính / bảo mật / utility dùng chung. Loại trừ boilerplate (getter/setter, DTO, config, UI).
3. **Tối ưu thực thi:** coverage-guided + incremental (git diff) + giới hạn mutation operators (5–7 operator giữ ~80% hiệu quả).
4. **Tích hợp CI/CD:** local trước PR; CI chạy định kỳ/nightly, **không block merge** nếu vượt ~10 phút.

> Liên hệ EShop: vì EShop chưa có test → nhóm thực thi đúng bước 1 (viết Jest baseline) rồi mới chạy Stryker. Đây là minh hoạ sống cho chiến lược tổng quát.

### 3.4. AI Workflow *(Slide 7–8)*

4 điểm AI cắm vào mutation testing (research_result §3 + Gemini doc):

1. **AI predictive filter** — phân tích AST chọn vùng rủi ro cao để sinh mutant chất lượng, giảm CPU.
2. **Tool thực thi** (Stryker) → trả về danh sách survivor.
3. **AI triage** — phát hiện equivalent mutant + chỉ ra thiếu assert (research_result §3.2: UniXCoder fine-tuned F1=86.58%).
4. **AI sinh assertion** để kill survivor (MuTAP 94% mutation score trên HumanEval) — **bắt buộc qua validation gate**: PASS trên code gốc, FAIL trên mutant, mới nhận.

- **Slide 8** chốt lý do chọn **Stryker + Claude/ChatGPT**: Stryker là chuẩn JS/TS native cho EShop; AI bù phần assertion synthesis mà Stryker không có.
- Thông điệp đạo đức/kỹ thuật xuyên suốt: **AI là draft, người kiểm chứng** — không assertion AI nào được ship khi chưa chạy đối chứng P vs P′.

---

## 4. Live Demo (10 phút) — bắt buộc Stryker + AI

Demo trên terminal thật (có backup recording). Kịch bản đề xuất:

| Phút | Hành động | Cột mốc rubric |
|---|---|---|
| 0–4 | Chạy `npx stryker run` trên module coupon/discount của EShop; mở HTML report; chỉ 1–2 survivor cụ thể, giải thích vì sao sống | **Feature Stryker** ✓ |
| 4–7 | Đưa survivor + source vào Claude/ChatGPT bằng prompt template (research_result §3.1); nhận assertion đề xuất | **Feature AI** ✓ |
| 7–9 | Chạy assertion qua **validation gate**: PASS trên gốc, FAIL trên mutant → mutation score tăng | Chứng minh AI có kiểm chứng |
| 9–10 | Chốt: coverage không đổi nhưng mutation score tăng → "coverage lies" | Đóng vòng thông điệp |

> Điểm cần TA góp ý: nên demo trên 1 module (coupon) cho đủ sâu hay 2 module cho đủ rộng trong 10 phút?

---

## 5. Activity (20 phút) — "Kill the Mutant"

Giữ nguyên format chuẩn trong activity deck (../00-brief/activity-deck.md), nhóm chuẩn bị mutant + sandbox + worksheet.

| Thời gian | Bước |
|---|---|
| 0:00–0:03 | Facilitator chiếu **5 mutant diff** từ module checkout EShop |
| 0:03–0:13 | Mỗi nhóm viết 5 assertion ứng viên (Jest pseudocode) |
| 0:13–0:18 | Đổi chéo nhóm review: assertion này có thật sự kill mutant? |
| 0:18–0:22 | Facilitator chạy assertion trên **sandbox prepared**, tally kills |
| 0:22–0:25 | Nhóm thắng giải thích thiết kế assertion |

**Điều kiện nhóm phải chuẩn bị:**

- Sandbox chạy được assertion audience + đếm kills trong ~4 phút.
- Worksheet + answer key, reproducible ≤ 25 phút, không cần nhóm hỗ trợ.
- AI cho phép dùng nhưng mọi output phải cross-check tay.

**Debrief (Slide 12):** What surprised you? · AI giúp/hại ở đâu? · 1 failure mode sẽ phòng lần sau? · Có thêm 1h thì điều tra gì?

---

## 6. Slide budget đề xuất (≤15)

| # | Slide | # | Slide |
|---|---|---|---|
| 1 | Title + thông điệp | 9 | Activity intro: Kill the Mutant |
| 2 | Hook: "coverage lies" (số liệu 96%/34%) | 10 | Activity rules + cần gì trên máy |
| 3 | Khái niệm + Mutation Score | 11 | Activity steps (bảng timing) |
| 4 | Mục tiêu + Tại sao | 12 | Debrief prompts |
| 5 | Level (Unit) + Method (Automated White-box) | 13 | 3 Takeaways |
| 6 | Chiến lược cho project bất kỳ (4 bước) | 14 | References |
| 7 | AI Workflow (sơ đồ 4 bước) | 15 | Backup / Q&A |
| 8 | Vì sao chọn Stryker + Claude/ChatGPT | | |

---

## 7. Phân vai nhóm (Workflow S6 tip)

- **Presenter** — pitch 10 phút.
- **Demoer** — chạy live demo (thuộc thao tác, có backup).
- **Facilitator** — điều phối activity, chạy sandbox tally.
- **Timekeeper** — giữ nhịp đồng hồ, nhắc chuyển phân đoạn.

---

## 8. 3 Takeaways chốt buổi (đồng nhất với activity deck)

1. Mutation score 70–80% là mục tiêu mạnh; 100% thường phi thực tế.
2. Equivalent mutant là nhiễu không tránh khỏi — vẫn cần review tay.
3. AI sinh assertion hữu ích như bản nháp; **validation đối chứng mutation report là bắt buộc**.

---

## 9. Câu hỏi mở để TA góp ý

1. Pitch 10 phút có nên cắt bớt điểm nào trong 4 điểm khái niệm để dành thời gian cho demo?
2. Demo 1 module sâu (coupon) hay 2 module rộng?
3. Mức mutation score baseline kỳ vọng cho EShop nên đặt bao nhiêu để demo "trước/sau" thuyết phục?
4. Activity "Kill the Mutant" dùng EShop chạy local hay sandbox chuẩn bị sẵn của nhóm sẽ ổn định hơn cho audience?
5. Có cần dự phòng phương án audience không cài được môi trường (chạy assertion bằng pseudocode + nhóm chạy hộ)?
