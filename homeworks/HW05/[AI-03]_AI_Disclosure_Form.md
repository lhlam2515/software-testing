# AI Use Disclosure Form — HW05

---

## 1. Course & Student Info

| Field                  | Value                                       |
| ---------------------- | ------------------------------------------- |
| Course:                | CS423 / CSC13003 – Software Testing         |
| Assignment ID:         | HW#05                                       |
| Assignment Title:      | Performance Testing on EShop                |
| AI Use Category (1–5): | Cat. 4 — AI-Assisted Production             |
| Date:                  | 19/08/2026                                  |
| Student name:          | Lê Hoàng Lâm                                |
| Student ID:            | 23127216                                    |

---

## 2. Disclosure Questions

### 1. AI tool(s) used

Claude Code (Sonnet 5) — the only AI tool used for this assignment, across all 10 logged sessions (`prompt_log.md`, Entries 001–010, 17–19/08/2026). Used both as a code-generation assistant (test plans, CSV data, analysis scripts) and as a raw-log analyst (Task 2).

---

### 2. Stage(s) of the assignment where AI was used

- [ ] brainstorming
- [ ] outlining
- [x] drafting (`BUG_REPORT.md` Bug Summary + Detailed Findings, Entry 008; `REPORT.md` prose drafted from raw data and reviewed/corrected by me)
- [ ] feedback
- [x] revision (test-plan assertions and Spike root-cause claim corrected after human review, see §5 below)
- [x] coding (k6 test plans, `lib/journey.js`, CSV generators, `analyze_*.py` scripts, Entries 001–007)
- [x] data analysis (Task 2 raw-log summary and threshold proposal, Entry 010)
- [ ] visual design
- [ ] other: not used for brainstorming/outlining in the generic sense — every design choice was grounded in a specific hardware probe or SUT source-code read, not open brainstorming

---

### 3. Main prompts or tasks given to the AI

_Paste the 2–3 most impactful prompts verbatim. Full transcript: see [Prompt Log](prompt_log.md)._

**Entry 002 (16:46 17/08/2026), Load scenario parameters — sets the pattern reused for Stress/Spike:**

> "Tôi cần chọn tham số tải cho kịch bản Load test, chạy hàm shopJourney() trong lib/journey.js. [...] Đề xuất cụ thể cho riêng scenario Load: số VU, ramp-up/ramp-down, think-time giữa từng bước trong shopJourney(), duration. Giải thích lý do từng con số bám theo phần cứng thật ở trên — không dùng số tròn mặc định kiểu sách giáo khoa (ví dụ 50/100/200 VU không có căn cứ). Bắt buộc cảnh báo rõ: vì k6 và backend chạy chung 8 luồng CPU, nếu VU đề xuất đủ cao để bản thân k6 [...] tranh CPU với backend, số đo (latency, throughput) sẽ bị nhiễu bởi chính công cụ đo — nêu rõ ngưỡng VU mà bạn cho là bắt đầu có rủi ro này [...]"

**Entry 010 (00:37 19/08/2026), Task 2 raw-log analysis — deliberately isolated from `REPORT.md`/`BUG_REPORT.md` so it could not just repeat known findings:**

> "Vai trò: Bạn là kỹ sư performance testing, nhiệm vụ là đọc raw log k6 đã thu thập cho SUT EShop [...] rồi (a) đề xuất performance threshold cho từng bước của workflow và (b) đề xuất phương án optimization [...] Đây KHÔNG phải bước review: bạn không tự đối chiếu lại số liệu của mình với ai khác, không tự chấm điểm feasible/hallucinated cho optimization của chính mình, không được đọc REPORT.md mục 4 hay 5, BUG_REPORT.md, hay bất kỳ kết luận nào đã có sẵn [...] TUYỆT ĐỐI không đọc trực tiếp bất kỳ file .csv/.json log thô nào vào ngữ cảnh [...] Toàn bộ việc trích số liệu phải đi qua script Python ngắn [...]"

Full verbatim prompts and outputs for all 10 entries: [prompt_log.md](prompt_log.md).

---

### 4. Specific parts of the work AI contributed to

- **Test plan design (Task 1):** AI-generated (Claude Code), step by step across Entries 001–007: shared journey logic, per-scenario VU/ramp/think-time parameters (each validated against a real calibration probe before acceptance), thresholds/assertions, and edge-case handling (lockout sub-scenario, token-expiry, non-empty cart). I reviewed every parameter and corrected the Spike lockout assertion (see §5 below).
- **CSV input data (Task 1):** AI-generated (Entry 006), verified by me against the seeded database (200-account pool, real keyword weights, product-id range 1–2005).
- **Test execution (Task 1):** Mixed. AI (Claude Code, via its own shell access) wrote and ran the isolated calibration probes that grounded the Load/Stress/Spike parameters (Entries 002–003) and authored the post-run analysis scripts (`analyze_raw.py`, `analyze_soak.py`, `analyze_load.py`). The full-scale Load/Stress/Spike/Soak runs, resource-monitor capture, and hardware-report screenshot were executed and captured by me, per the assignment's anti-AI-cheat constraint on raw evidence.
- **Raw log analysis (Task 2):** AI-generated (Entry 010, deliberately isolated from `REPORT.md`/`BUG_REPORT.md`). I independently re-derived every figure from the raw logs and found one root-cause misattribution (see `REPORT.md` §5.2).
- **Continuous performance testing proposal (Task 3):** Not attempted. Deliberate decision — not completed for this submission; see `REPORT.md` §6.
- **Agent Skill (section 7):** Not attempted. Deliberate decision — not completed for this submission; see `REPORT.md` §7.
- **Report and README drafting:** AI-assisted (Claude Code drafted prose from the raw data, prompt log, and analysis scripts); every claim, number, and citation was reviewed and corrected by me against its source before being kept. Section 8 of `REPORT.md` (AI Critique) was written entirely by the student, per the assignment's anti-AI-cheat constraint on that artifact.

---

### 5. How I reviewed, revised, or verified the AI output

- **Test plans:** Every VU/ramp/think-time parameter was required by prompt to be grounded in a real hardware probe before I accepted it (not a textbook round number); the Spike lockout status-code assumption (initial `423`, actual `401`/`403`) was caught and corrected by re-reading `apps/backend/server.js:40-44` directly. Full audit trail: `[AI-02]_AI_Audit_Report.md` Artifact #1–3.
- **Metrics quoted in the report:** every number traced back to the raw log or the resource-monitor capture it came from, not taken from the AI's running summary. `REPORT.md` §5.2 re-derives every Task 2 figure independently and documents the one case where it disagreed with the AI's claim.
- **Optimization proposals:** each of the 6 proposed optimizations was checked against the real `apps/backend/database.js`/`server.js` source (not a generic web-stack assumption) before being classified feasible; none were classified hallucinated. Full audit: `[AI-02]_AI_Audit_Report.md` Artifact #5, `REPORT.md` §5.3.

---

### 6. Citation

Every AI-drafted claim in `REPORT.md` and `[AI-02]_AI_Audit_Report.md` is attributed to its source session via an explicit `prompt_log.md Entry NNN` reference inline in the text — no AI output is presented as unattributed original prose. The one exception, `REPORT.md` §8 (AI Critique), carries no such citation because it contains no AI-drafted content: it was written entirely by me, per the assignment's anti-AI-cheat constraint on that artifact.

---

## 3. Statement of Honesty

By signing below, I confirm that the disclosure above is accurate and complete. I understand that undisclosed or false disclosure of AI use is treated as academic misconduct and may result in a 0 grade for the assignment and disciplinary referral.

---

## 4. Signature

| Field                   | Value                                 |
| ----------------------- | ------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                          |
| Student ID:             | 23127216                              |
| Class / Cohort:         | 23KTPM1                               |
| Course:                 | CS423 / CSC13003 – Software Testing   |
| Instructor:             | Dr. Lam Quang Vu                      |
| Date:                   | 19/08/2026                            |
| Signature:              | ![Lê Hoàng Lâm](assets/signature.png) |

---

## References

- Kharbach, M. (2026). _AI Use Policy Templates for Higher Education._ CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Hardman, P. (2025). _A Post-AI Learning Taxonomy._
