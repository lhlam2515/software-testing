# T10 Seminar — Kế hoạch chuẩn bị & Checklist bàn giao

> Tài liệu nội bộ nhóm. Topic: **T10 — Mutation Testing & Test Effectiveness**.
> Công cụ chốt: **StrykerJS (traditional) + Claude/ChatGPT (AI-augmented)**.
> Cập nhật: 2026-06-22.

---

## 0. Ràng buộc cứng cần nhớ (trích từ Guide + Workflow + T10 brief)

| Ràng buộc | Giá trị | Nguồn |
|---|---|---|
| Thời lượng buổi seminar | 45 phút: Pitch 10 + Demo 10 + Activity 20 + Q&A 5 | Guide §S6 |
| Số slide | **≤ 15** — activity là trọng tâm, không phải slide | Guide §S6 |
| Demo bắt buộc | **1 feature Stryker + 1 feature AI** (thiếu 1 trong 2 → auto-penalty) | Workflow Pitfall #2 |
| User_Guide | ≥ 7 mục, **bắt buộc có "Failure Modes" ≥ 3** (thiếu → auto-penalty) | Workflow S4, Pitfall #3 |
| Screencast | 5–8 phút (firm), ≤ 100 MB, terminal thật (không pre-record giả), narration tiếng Anh, không nhạc nền | Workflow S4, Pitfall #4 |
| Activity | Peer team làm xong trong **≤ 25 phút, không cần nhóm hỗ trợ** | T10 §9, Pitfall #5 |
| Pre-share (S5) | Đẩy lên Moodle **≥ 3 ngày làm việc trước** ngày seminar | Guide §S5 |
| AI Audit (S8) | Trong **5 ngày làm việc sau** seminar | Guide §S8 |
| Ngôn ngữ | User guide + screencast + AI docs: **tiếng Anh** | Guide §S4, §S8 |

> ⚠️ **Mốc thời gian cần xác nhận với TA:** ngày seminar live của nhóm (Week 7–11). Từ ngày đó suy ngược ra deadline S5 (−3 ngày làm việc) và S8 (+5 ngày làm việc). Toàn bộ lịch dưới đây phụ thuộc mốc này.

---

## 1. Phát hiện then chốt định hình kế hoạch (đã khảo sát code thật `apps/backend/`)

**EShop SUT là greenfield cho mục đích kiểm thử**: không có Jest test, không có Stryker config, không có CI; `package.json` test script vẫn là placeholder. Hệ quả trực tiếp:

- Stryker **không thể chạy** nếu chưa có một bộ test xanh. → Nhóm phải **tự viết bộ test baseline** trước (happy-path) cho các module ưu tiên.
- Đây chính là điều kiện để dựng được narrative cốt lõi: *"test đạt coverage cao nhưng mutation score thấp"* — phải có test thật mới chứng minh được khoảng cách này trên chính EShop.
- **Monolith thuần (đã xác nhận):** toàn bộ route inline trong `server.js` (572 dòng). KHÔNG có `services/`, `controllers/`, `middleware/`, `utils/`. Logic coupon nằm lồng trong callback sqlite3 của route handler → **test cấp HTTP bằng `supertest`** (không phải pure unit test). Stryker `mutate: ['server.js']`.
- **Blocker setup:** `server.js` gọi thẳng `app.listen(3000)`, **không export `app`** → phải refactor `module.exports = app` + guard `if (require.main === module)` thì supertest mới import được.
- **2 bug seed sẵn trong coupon (FR-09)** — biến thành talking point cho seminar ("mutant đã sống sót ngoài đời thực vì không có test"):
  - **BUG-A** (dòng ~379): min-order dùng `>` thay vì `>=` → đơn đúng bằng ngưỡng bị từ chối sai.
  - **BUG-B** (dòng ~399): công thức percent `Math.floor(total*(1-discount_value))` → coupon 10% cho discount **âm khổng lồ** (đúng spec: `total*value/100`).
- Phụ: auth không dùng bcrypt (password plaintext, dòng 23) — vấn đề cho module auth khi tới lượt mutation, không phải coupon.
- Dependencies thật: express 5, cors, body-parser, jsonwebtoken, **sqlite3** (callback async).

---

## 2. Danh sách công việc (Work Breakdown)

### A. Setup & Baseline — *điều kiện tiên quyết* (Stage S3 · M1–M2)

- [ ] **Refactor `server.js`**: thêm `module.exports = app` + guard `if (require.main === module) app.listen(...)` (bắt buộc để supertest import được).
- [ ] Cài `jest` + `supertest` + `@stryker-mutator/core` + `@stryker-mutator/jest-runner`; tạo `jest.config.js`.
- [ ] **Viết bộ test baseline (happy-path)** cấp HTTP bằng `supertest` cho các route ưu tiên (xem bảng cuối §2).
- [ ] Chạy test xanh; ghi lại **line/branch coverage baseline**.
- [ ] Cấu hình `stryker.config.mjs` (`mutate: ['server.js']`, `testRunner: 'jest'`, `coverageAnalysis: 'perTest'`); chạy baseline mutation; ghi **mutation score baseline** vào `BASELINE.md`.
- [ ] *(Khuyến nghị)* dùng DB seed sẵn chế độ chỉ-đọc cho test apply-coupon (nhánh no-`user_id` không ghi `coupon_usage`) → reproducible, không cần test DB riêng.

### B. Phân tích Mutant (Stage S3 · M3)

- [ ] Đọc HTML report; phân loại survivor: *real gap / equivalent / timeout / no-coverage*.
- [ ] Chọn **3 mutant sống sót**, giải thích từng cái vì sao sống (learning objective bắt buộc).
- [ ] Viết tay 3 assertion để kill chính 3 mutant đó; chạy lại, xác nhận mutation score tăng.
- [ ] Ghi nhận **3 failure modes thực tế của Stryker** đã quan sát (phục vụ User_Guide §6).

### C. AI Augmentation (Stage S3 · M4–M5)

- [ ] Chạy prompt template assertion-synthesis (research_result §3.1) qua Claude/ChatGPT cho các survivor.
- [ ] Áp **validation gate bắt buộc**: test phải PASS trên code gốc, FAIL trên mutant; loại assertion không kill được (research_result §3.7).
- [ ] Thử nghiệm AI phát hiện equivalent-mutant (research_result §3.2) — chỉ dùng để triage, người vẫn ký duyệt.
- [ ] Đo metric: setup time, run time, MS gain mỗi test AI sinh ra.

### D. Chuẩn bị Demo live (Stage S6)

- [ ] Script demo ≤ 10 phút: thể hiện **1 feature Stryker** (vd: chạy + đọc HTML report, incremental) **+ 1 feature AI** (assertion synthesis có validation gate).
- [ ] Quay **backup recording** đề phòng mạng/máy hỏng.
- [ ] Rehearse demo end-to-end, bấm giờ.

### E. Chuẩn bị Activity "Kill the Mutant" (Stage S5–S6)

- [ ] Chọn **5 mutant sống sót** từ module checkout/coupon của EShop.
- [ ] Dựng **sandbox prepared** chạy assertion của audience và tally kills trong ~4 phút (bước 0:18–0:22).
- [ ] Viết `Activity_Worksheet.md` + **answer key**; đảm bảo reproducible ≤ 25 phút không cần nhóm hỗ trợ.
- [ ] **Dry-run nội bộ** activity với 1 thành viên đóng vai audience để verify timing.
- [ ] Chuẩn bị 1-page cheat-sheet phát cho audience; in worksheet cho nhóm không mang laptop.

### F. Documentation (Stage S4)

- [ ] `User_Guide.md` 7 mục: Introduction / Installation / First Test / Advanced Usage / Troubleshooting / **Failure Modes (≥3)** / References.
- [ ] Quay `Demo_Screencast.mp4`: 5–8 phút, terminal thật, narration tiếng Anh, không nhạc, ≤ 100 MB.

### G. Slides (Stage S6)

- [ ] `Seminar_Slides.pptx` ≤ 15 slide theo outline trong `content-outline.md`.

### H. Pre-share (Stage S5)

- [ ] Đẩy User_Guide + Screencast + Activity_Worksheet + Slides lên Moodle ≥ 3 ngày làm việc trước seminar.

### I. Live & Post-seminar (Stage S6–S8)

- [ ] Phân vai: **1 presenter · 1 demoer · 1 facilitator · 1 timekeeper**.
- [ ] Chạy seminar; thu minute-paper từ các nhóm audience.
- [ ] Tổng hợp `Audience_Feedback_Aggregated.md`.
- [ ] Nộp `[AI-02]` (≥600 từ, 5 mục) · `[AI-03]` (ký tên từng thành viên) · `[AI-04]` (300 từ).
- [ ] Viết `Final_Reflection.md` (300 từ) + `Peer_Review.md` cho 2 nhóm partner.

### Bảng route ưu tiên cho test baseline + mutation (đều inline trong `server.js`)

> Logic nằm inline trong route handler, không phải file riêng — target qua endpoint bằng supertest.

| Hạng | Route / FR | Vì sao là target tốt |
|---|---|---|
| 1 | `POST /api/apply-coupon` (FR-09) | min-order guard, expiry, max-uses, percent/fixed → giàu ROR + AOR + boundary; **đã có sẵn 2 bug** (xem §1) |
| 2 | `PUT /api/admin/orders/:id/status` (FR-10) | state machine `isValidTransition` → cụm mutant relational/equality |
| 3 | Auth/login (FR-02) | so khớp password, JWT sign → EqualityOperator, StringLiteral (lưu ý: không có bcrypt) |
| 4 | Cart total / checkout (FR-08) | `price*qty`, kiểm tra stock → AOR, ConditionalExpression |

---

## 3. Checklist Artifacts phải bàn giao

### 3.1. TRƯỚC seminar

| # | Artifact | Stage | Trạng thái | Ràng buộc |
|---|---|---|---|---|
| 1 | `Tool_Survey_Proposal.md` | S1 | ✅ **Đã có** | ≤ 1 trang |
| 2 | `User_Guide.md` | S4 | ☐ | ≥7 mục, có Failure Modes ≥3, tiếng Anh |
| 3 | `Demo_Screencast.mp4` | S4 | ☐ | 5–8 phút, ≤100MB, terminal thật, EN |
| 4 | `Activity_Worksheet.md` | S5 | ☐ | Worksheet + answer key, ≤25 phút |
| 5 | `Seminar_Slides.pptx` | S6 | ☐ | ≤15 slide |

**Pre-share S5 (≥3 ngày làm việc trước):** đẩy đồng thời #2, #3, #4, #5 lên Moodle.

**Artifacts nội bộ (không nộp nhưng cần để demo/activity chạy được):**

- `BASELINE.md` — mutation score baseline per file.
- `stryker.config.mjs` + `jest.config.js` + bộ Jest test.
- Sandbox "Kill the Mutant" đã chuẩn bị + 5 mutant diff.
- Backup recording của live demo.

### 3.2. SAU seminar (trong 5 ngày làm việc)

| # | Artifact | Stage | Ràng buộc |
|---|---|---|---|
| 6 | `Audience_Feedback_Aggregated.md` | S7 | Tổng hợp minute-paper |
| 7 | `[AI-02]` AI Audit Report | S8 | 5 mục, ≥600 từ |
| 8 | `[AI-03]` AI Disclosure | S8 | PDF ký tên **từng thành viên** |
| 9 | `[AI-04]` Reflective Statement | S8 | 300 từ tiếng Anh |
| 10 | `Final_Reflection.md` | S8 | 300 từ tiếng Anh |
| 11 | `Peer_Review.md` ×2 | S8 | ≥3 strengths + ≥3 suggestions + 1 câu hỏi/nhóm partner |

> Template AI-02/03/04 đã có sẵn trong `templates/` (AI-02_ai-audit-report.md, AI-03_ai-disclosure-form.md, AI-04_ai-reflective-statement.md, AI-05_ai-privacy-checklist.md, AI-06_ai-student_acknowledgement.md).

---

## 4. Ánh xạ rubric → công việc (để không rớt điểm)

| Tiêu chí | Trọng số | Việc đảm bảo điểm |
|---|---|---|
| Tool survey + proposal | 10% | ✅ Đã nộp — kiểm lại comparison matrix 5 tiêu chí |
| Depth of study | 15% | Phân loại survivor đúng thuật ngữ; cover edge case + equivalent-mutant problem |
| User-guide document | 20% | 7 mục, Failure Modes ≥3, AI-disclosure, references có nguồn gốc |
| Live demo on EShop | 15% | Chạy end-to-end không kịch bản; **Stryker + AI** đều xuất hiện |
| In-class activity | 20% | "Kill the Mutant" feasible ≤25 phút, có answer key cho peer |
| Q&A + facilitation | 10% | Trả lời chính xác; biết nói "không chắc" + redirect |
| AI Audit + Disclosure + Reflect | 10% | AI-02 đủ 5 mục/≥600 từ; AI-03 ký; AI-04 300 từ |
