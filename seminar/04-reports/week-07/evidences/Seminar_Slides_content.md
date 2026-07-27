# Seminar Slides — content source (build → `Seminar_Slides.pptx`)

> **T10 — Mutation Testing & Test Effectiveness** · ≤ 15 slides · 45-min session
> **Convention:** *On-slide* = English (keep it sparse — the activity is the centrepiece, not the slides). *Speaker notes* = tiếng Việt (để nhóm tập nói). `📷/TODO` = chèn ảnh/đo thật trước khi nộp.
> **Roles:** Presenter (S1–S8, S12–S15) · Demoer (live demo) · Facilitator (S9–S11 + activity) · Timekeeper.
> **Time map:** Pitch S1–S8 = 10' · Live demo (no slides) = 10' · Activity S9–S11 = 20' · Debrief+Q&A S12–S15 = 5'.

---

## Slide 1 — Title  · ⏱ 0:00–0:30

**On-slide**

- **Mutation Testing & Test Effectiveness**
- *"Coverage lies. Mutation testing tells you if your tests can actually catch bugs."*
- T10 · CS423/CSC15003 Software Testing · FIT @ HCMUS
- Team *[names]* · Tools: StrykerJS + Claude/ChatGPT · SUT: EShop

**Speaker notes (VN)**

- Chào lớp, nhóm mình làm T10. Một câu mở: "coverage nói dối — mutation testing mới cho biết test có bắt được lỗi không". Cả buổi xoay quanh chứng minh điều đó ngay trên EShop, và dành 20 phút để các bạn tự tay "giết mutant".

---

## Slide 2 — Hook: coverage lies  · ⏱ 0:30–2:00

**On-slide**

- Coverage answers: *"Did a test run this line?"*
- It does **not** answer: *"Would a test fail if this line were wrong?"*
- Real cases: **96% coverage → 34% mutation score** · some suites **100% coverage → ~4% mutation score**
- 📷 simple bar: Coverage vs Mutation Score

**Speaker notes (VN)**

- Đặt vấn đề: coverage chỉ đo "code có chạy qua khi test không", không đo "test có phát hiện lỗi không". Dẫn 2 số liệu thật (nhớ verify nguồn ở §7 user guide). Câu chốt: một bộ test có thể 100% coverage mà gần như không assert gì → đó là "test giả tạo". Mutation testing vạch trần điều này.

---

## Slide 3 — What is a mutant? + Mutation Score  · ⏱ 2:00–3:30

**On-slide**

- **Mutant** = source with one small fault seeded: `>`→`>=`, `-`→`+`, `true`→`false`, remove `return`
- Run the existing suite on each mutant:
  - **Killed** — a test failed ✓ (good)
  - **Survived** — all tests passed ✗ (blind spot)
  - **Equivalent** — behaviour unchanged (noise — exclude)
- **Mutation Score = Killed / (Total − Equivalent)**

**Speaker notes (VN)**

- Giải thích cơ chế: tool sửa nhẹ source tạo mutant, chạy lại test. Killed = có test fail (mong muốn). Survived = mọi test pass → lỗ hổng test. Equivalent = đổi cú pháp nhưng logic không đổi, loại khỏi mẫu số. Mutation score là KPI: càng cao test càng nhạy. Ví dụ nhanh đổi `>` thành `>=`.

---

## Slide 4 — Goal & Why  · ⏱ 3:30–5:00

**On-slide**

- **Goal:** test the *test suite*, not the production code — measure & raise Test Effectiveness
- **Why it matters**
  - Exposes "fake coverage" (high coverage, weak/no asserts)
  - Pinpoints the exact line/boundary missing a test
  - A real safety net for refactoring

**Speaker notes (VN)**

- Nhấn mục tiêu tối thượng: không phải tìm bug trong code, mà kiểm định + nâng chất lượng chính bộ test. 3 lý do: vạch trần test giả tạo; chỉ đích danh dòng/điều kiện biên thiếu test; tấm lưới an toàn khi refactor. (Liên hệ: lát nữa demo sẽ thấy test happy-path bỏ sót boundary thế nào.)

---

## Slide 5 — Level & Method  · ⏱ 5:00–6:15

**On-slide**

- **Level:** primarily **Unit** (ms-fast → survives running the suite ×N mutants; high isolation). Integration: limited (Extreme Mutation). System/E2E: impractical.
- **Method:** **Automated White-box (Glass-box)**
  - White-box: needs AST/source access to seed mutants + coverage to optimise
  - Automated: state explosion makes manual impossible; humans only analyse survivors

**Speaker notes (VN)**

- Trả lời 2 câu TA hỏi. Level: chủ yếu Unit vì test chạy mili-giây, chịu được việc lặp hàng trăm lần/mutant; cô lập cao. Integration ít (tốn thời gian, dùng Extreme Mutation). System/E2E gần như không. Method: bắt buộc White-box (phải đọc cấu trúc code để sinh mutant) + Automated (số mutant quá lớn, không làm tay). Điểm độc đáo: đây là White-box dùng để soi chính bộ test.

---

## Slide 6 — Strategy for any project  · ⏱ 6:15–7:30

**On-slide**

- 1. **Foundation first** — only apply when line coverage ~70–80%; if no tests, write happy-path first
- 1. **Limit scope** — core/business/financial/security/shared utils; exclude boilerplate, DTO, config, UI
- 1. **Optimise** — coverage-guided + incremental (git diff) + select 5–7 operators
- 1. **CI/CD** — local before PR; nightly/scheduled; don't block merge if > ~10 min

**Speaker notes (VN)**

- Đây là chiến lược tổng quát cho project bất kỳ, không riêng EShop. Bước 1 quan trọng: chưa có test thì viết test trước (EShop chính là case này — mình phải tự viết bộ baseline). Bước 2: chỉ quét vùng giá trị cao. Bước 3–4: tối ưu + đưa vào CI nhưng không chặn merge. Chuyển ý: vậy AI giúp gì trong quy trình này?

---

## Slide 7 — AI Workflow  · ⏱ 7:30–8:45

**On-slide**

- AI plugs in at 4 points:
  1. **Predictive filter** — AST analysis → mutate high-risk code only (save CPU)
  2. **Engine runs** (StrykerJS) → list of survivors
  3. **AI triage** — flag equivalent mutants + missing-assert spots
  4. **AI synthesises assertions** to kill survivors
- ⚠️ Every AI assertion → **validation gate**: PASS on original, FAIL on mutant
- 📷 4-box flow diagram

**Speaker notes (VN)**

- 4 điểm AI cắm vào (vẽ sơ đồ 4 hộp dọc). Dẫn vài bằng chứng: MuTAP đạt 94% mutation score; UniXCoder fine-tuned F1≈86.6% phát hiện equivalent mutant (verify §7). Chốt nguyên tắc xuyên suốt: AI chỉ là bản nháp — mọi assertion phải qua validation gate (pass code gốc, fail trên mutant) mới nhận. Không bao giờ tin mù.

---

## Slide 8 — Why StrykerJS + Claude/ChatGPT  · ⏱ 8:45–10:00

**On-slide**

- **StrykerJS** — JS/TS-native mutation engine; Jest runner; HTML/JSON reports → fits EShop (Node/CommonJS). PIT (Java) / mutmut (Python) can't mutate it.
- **Claude/ChatGPT** — assertion synthesis Stryker lacks natively
- Pairing satisfies the mandatory *traditional + AI* rule
- Next: **live demo on EShop's coupon endpoint**

**Speaker notes (VN)**

- Lý do chọn: EShop là Node/CommonJS nên Stryker là lựa chọn native duy nhất (PIT/mutmut không mutate được). Stryker không tự sinh assertion → ghép Claude/ChatGPT. Cặp này thỏa rule bắt buộc traditional+AI. Bàn giao cho bạn demo: chạy thật trên route apply-coupon.

---

## 🔴 LIVE DEMO (no slides) · ⏱ 10:00–20:00

> Demoer chạy terminal/IDE thật. Có **backup recording** phòng sự cố. Kịch bản (khớp `../02-planning/content-outline.md §4`):
>
> 1. `npx stryker run` trên `server.js`; mở HTML report; chỉ 1–2 survivor ở route coupon (vd: `final_amount` `-`→`+`).
> 2. Giải thích vì sao sống: test happy-path chỉ check `status/success`.
> 3. Đưa survivor + source vào Claude/ChatGPT (prompt template) → nhận assertion.
> 4. Chạy **validation gate**: PASS code gốc, FAIL trên mutant → mutation score tăng.
> 5. Chốt: coverage không đổi nhưng mutation score tăng → "coverage lies".
> *(Tùy chọn nhấn 2 bug seed của EShop như "mutant đã sống sót ngoài đời thực vì không có test".)*

---

## Slide 9 — Activity: Kill the Mutant  · ⏱ 20:00–21:00

**On-slide**

- **Your turn (20 min):** 5 mutants survived our baseline suite on EShop's coupon endpoint
- For each mutant, write **one assertion** that passes on the original, fails on the mutant
- Most kills wins 🏆
- Worksheet = the `Activity_Worksheet.md` shared 3 days ago

**Speaker notes (VN)**

- Facilitator tiếp quản. Giới thiệu luật chơi: 5 mutant sống sót, mỗi nhóm viết 1 assertion/mutant để giết. Killed = pass code gốc, fail trên mutant. Nhóm giết nhiều nhất thắng. Nhắc đã phát worksheet 3 ngày trước.

---

## Slide 10 — Rules & what you need  · ⏱ 21:00–22:00

**On-slide**

- Work in teams of 3–4; one note-taker
- On your machine: refactored EShop backend (provided) + editor + terminal; AI tool optional
- **AI allowed — but cross-check every suggestion** (a test that passes on the mutant kills nothing)
- One minute-paper per team at the end (attendance credit)

**Speaker notes (VN)**

- Nêu điều kiện: nhóm 3–4, 1 người ghi. Sandbox + server.js đã refactor mình cung cấp sẵn, không cần internet sau setup. AI được dùng nhưng phải kiểm tay. Cuối buổi mỗi nhóm nộp 1 minute-paper lấy điểm chuyên cần.

---

## Slide 11 — Activity steps  · ⏱ 22:00–22:30 (then run 22:30–40:00)

**On-slide**

| Time | Step |
|---|---|
| 0:00–0:03 | Facilitator shows 5 mutant diffs |
| 0:03–0:13 | Each team writes 5 candidate assertions |
| 0:13–0:18 | Swap & review with a partner team |
| 0:18–0:22 | Facilitator runs them in the sandbox; tally kills |
| 0:22–0:25 | Winning team explains its design |

**Speaker notes (VN)**

- Chiếu bảng thời gian, bám sát đồng hồ (Timekeeper hỗ trợ). 3' giới thiệu 5 diff → 10' viết → 5' đổi chéo review → 4' mình chạy sandbox tally → 1' nhóm thắng giải thích. Lưu ý mutant boundary (min-order, max-uses) cần đúng giá trị biên mới giết được.

---

## Slide 12 — Debrief  · ⏱ 40:00–42:30

**On-slide**

- Q1: What surprised you most?
- Q2: Where did AI save time vs add work?
- Q3: One failure mode you'd prevent next time?
- Q4: With one more hour, what next?
- → write one answer each on the minute-paper

**Speaker notes (VN)**

- Dẫn 4 câu debrief, mời 1–2 nhóm trả lời nhanh. Nhấn lại bài học: assertion `typeof`/`success` không giết được mutant giá trị; boundary là chỗ test hay sót; AI hữu ích nhưng phải validation gate.

---

## Slide 13 — Takeaways  · ⏱ 42:30–43:30

**On-slide**

- ✓ Mutation score 70–80% is a strong target; 100% is usually unrealistic
- ✓ Equivalent mutants are unavoidable noise — manual review still required
- ✓ AI assertion generators are drafts — validation against the mutation report is mandatory

**Speaker notes (VN)**

- 3 điều mang về. Mục tiêu 70–80% là tốt, đừng đuổi 100%. Equivalent mutant là nhiễu phải review tay. AI chỉ là nháp, bắt buộc validation. (Nếu còn giờ: nhắc 2 bug coupon EShop minh hoạ "mutation testing đo độ nhạy test, không nói baseline đúng — vẫn cần spec.")

---

## Slide 14 — References  · ⏱ 43:30–44:00

**On-slide**

- Jia & Harman (2011) · Petrović & Ivanković — *Mutation Testing at Google* (ICSE 2018)
- StrykerJS docs — stryker-mutator.io · Jest · supertest
- MuTAP (IST 2024) · MutGen (2025) · Tian et al. — Equivalent Mutant Detection (ISSTA 2024)
- Full guide + worksheet: see our Moodle folder
- Cite the original source — not the AI

**Speaker notes (VN)**

- Chỉ nguồn để các bạn đọc thêm; nhấn nguyên tắc trích nguồn gốc không trích AI. Trỏ về User_Guide + Worksheet trên Moodle.

---

## Slide 15 — Q&A / Backup  · ⏱ 44:00–45:00

**On-slide**

- **Questions?**
- Contact: *[team emails]*
- Backup: equivalent-mutant deep dive · stryker.config.mjs · full mutation report

**Speaker notes (VN)**

- Mở Q&A. Nếu hỏi sâu: dùng slide backup (config, report đầy đủ, equivalent mutant). Trả lời trung thực — không chắc thì nói "mình kiểm lại". Cảm ơn lớp + nhắc nộp minute-paper.

---

## Backup slides (chỉ dùng khi Q&A cần — không tính trong 15)

- **B1 — `stryker.config.mjs`** full config + giải thích `coverageAnalysis: 'perTest'`, `mutate: ['server.js']`.
- **B2 — Equivalent mutant** ví dụ + vì sao undecidable + cách dùng `// stryker-disable next-line`.
- **B3 — EShop 2 seeded bugs** (min-order `>` vs `>=`; percent formula âm) đối chiếu FR-09.
- **B4 — Full mutation report** screenshot (before/after) + bảng MS theo file.

---

## Checklist trước khi nộp `.pptx`

- [ ] Đúng **≤ 15 slide** (B1–B4 để ở cuối, ngoài đếm).
- [ ] Thay hết `📷/TODO`: bar coverage-vs-mutation (S2), sơ đồ AI 4 hộp (S7), report demo.
- [ ] Verify số liệu anchor (96%/34%, ~4%, 94%, 86.6%) khớp User_Guide §7.
- [ ] Điền tên thành viên (S1, S15) + email (S15).
- [ ] Dùng template seminar của môn nếu được yêu cầu.
