# AI Use Disclosure Form — HW04

---

## 1. Course & Student Info

| Field                  | Value                                       |
| -----------------------| --------------------------------------------|
| Course:                | CS423 / CSC13003 – Software Testing         |
| Assignment ID:         | HW#04                                       |
| Assignment Title:      | Automation Testing on EShop                 |
| AI Use Category (1–5): | Category 4 — AI-Assisted Production         |
| Date:                  | 2026-08-11                                  |
| Student name:          | Lê Hoàng Lâm                                |
| Student ID:            | 23127216                                    |

---

## 2. Disclosure Questions

### 1. AI tool(s) used

> Claude Code (`claude-sonnet-5`) — primary tool for script generation, spec review, report drafting, and the Agent Skill build.
> Codex CLI (`gpt-5.6-sol`) — used for the FR-16 spec generation session and the initial HW04 workspace scaffold on 2026-08-05.

---

### 2. Stage(s) of the assignment where AI was used

- [ ] brainstorming
- [x] test-case → script conversion
- [x] data-driven refactor (CSV/JSON extraction)
- [x] assertion design
- [x] debugging / flaky-wait fixes
- [x] report drafting
- [x] coding
- [x] other: Agent Skill packaging (`skill-creator`), pre-submission gap review

---

### 3. Main prompts or tasks given to the AI

_Paste the 2–3 most impactful prompts verbatim, one per automated feature (FR-02 / FR-09 / FR-16). Full transcript: see [Prompt Log](prompt_log.md)._

**FR-02 — Login & Account Lockout** (driven step by step, one prompt per technique stage, not one generic prompt):

1. `"Đi thẳng A4, sinh login.spec.ts từ POM đã có"` — 2026-08-06T00:04:54+07:00 (spec generation from the already-verified Page Object)
2. `"ừ, bắt đầu A5 cho FR-02 đi"` — 2026-08-06T09:51:30+07:00 (add network + DB-state assertion patterns)
3. `"làm A6 cho FR-02 trước"` — 2026-08-06T10:07:25+07:00 (self-critique pass)

**FR-09 — Discount Coupons:**

`"Hãy giúp tôi thực hiện viết script kiểm thử tự động bằng playwright cho FR-09"` — 2026-08-06T14:58:21+07:00. Executed via the just-built Agent Skill (`Skill({skill: "playwright-automation-pipeline", args: "FR-09"})`), which then drove its own 9-phase pipeline for the rest of the session.

**FR-16 — CSV Import:**

`"Hãy giúp tôi thực hiện viết script kiểm thử tự động bằng playwright cho FR-16"` — 2026-08-06T15:47:07+07:00 (Codex CLI, reading the same shared, agent-agnostic `playwright-automation-pipeline` skill — confirmed by Codex announcing it before starting: _"Mình sẽ dùng `playwright-automation-pipeline` để chuyển bộ ca kiểm thử FR-16..."_).

Full entries with timestamps, tool/model, and exact AI output for every interaction above: [prompt_log.md](prompt_log.md).

---

### 4. Specific parts of the work AI contributed to

| Feature | AI generated | Student wrote / corrected |
| --- | --- | --- |
| FR-02 | `login.spec.ts` skeleton, `login.page.ts` locators, `fr02-helpers.ts` assertion helpers, single DB-read draft | Fixed the DB-read race (WAL + `expect.poll()`), added `submitVia:'none'` for TC-UI-01, expanded TC-03 to 4 variants, corrected a wrong AI-authored root-cause note (`type=email` claim vs. actual `type=text`) |
| FR-09 | `coupon.spec.ts`, `checkout.page.ts`, `fr09-helpers.ts`, initial `cases.json` expected values | Re-derived `expected` values for the coupon-application bugs by reading `server.js:363,379` directly (missing auth middleware, strict `>` vs `>=`); flagged (not fixed) the OR-regex locator and TC-11's missing `discount_amount` bound as accepted, documented risk |
| FR-16 | `csv-import.spec.ts`, `fr16-helpers.ts`, `csv.ts` dynamic fixture generator, initial `cases.json` | Added the missing `note` field to the 4 Gap Probe cases (TC-13–16) explaining the chosen branch, cross-checked against existing `knownDefect` tags |
| Report/docs | First draft of `REPORT.md`/`README.md` prose from student-supplied HTML-report numbers and `BUG_REPORT.md` | Verified every metric against the actual generated HTML reports before accepting; `REPORT.md §12` AI Critique written entirely unaided |
| Agent Skill | `SKILL.md` v0.1 pipeline structure (`skill-creator`) | Rewrote description/keywords (contradicted its own "Not for" section), renamed twice as real use on FR-09/FR-16/FR-01 exposed scope drift |

---

### 5. How I reviewed, revised, or verified the AI output

- **FR-02:** Ran the merged `login.spec.ts` locally (`playwright test tests/FR-02 --project=chromium`) after the DDT single-loop merge — confirmed 15/15 cases generated, 11 passed / 4 failed, matching the 4 pre-tagged `knownDefect` cases exactly (no regression). After the 2026-08-10 gap review, re-ran TC-03b/c/d and TC-05 live against the SUT — not just a diff read — and cross-checked the AI's root-cause claim against `Login.jsx:30` directly, which is how the wrong `type=email` note was caught.
- **FR-09:** Cross-checked every `expected` value in `cases.json` against `server.js:363–379` before accepting it, since the AI's first draft derived expected behavior from `domain-testing.md`'s wording alone.
- **FR-16:** Compared the 4 Gap Probe notes against the HW02-observed pass/fail status (BUG-16-003/004) before finalizing, to make sure the chosen branch was internally consistent with the rest of the bug report.
- **All 3 features:** Ran the full suite on Chromium, Firefox, and Edge (9 browser runs total, 189 test executions) and confirmed every generated HTML report visibly shows `Run by: 23127216` and an ISO timestamp before treating any pass/fail number as final.
- **Defects:** Every genuine defect surfaced by a failing assertion was cross-linked to a GitHub Issue with a screenshot before being counted in `BUG_REPORT.md` — no bug was logged from AI output alone without independent confirmation.

---

### 6. Citation

> No external text, code, or data was copied from AI output without review and disclosure. Every AI-authored artifact is traceable to a specific `prompt_log.md` entry and a specific git commit (`test(hw04):`/`fix(hw04):`/`refactor(hw04):` prefixed); no separate external citation is required beyond the AI Use Agreement (`context/ai_use_agreement.md`) this disclosure operates under.

---

## 3. Statement of Honesty

By signing below, I confirm that the disclosure above is accurate and complete. I understand that undisclosed or false disclosure of AI use is treated as academic misconduct and may result in a 0 grade for the assignment and disciplinary referral.

---

## 4. Signature

| Field                   | Value                                 |
| ----------------------- | -------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                          |
| Student ID:             | 23127216                              |
| Class / Cohort:         | 23KTPM1                               |
| Course:                 | CS423 / CSC13003 – Software Testing   |
| Instructor:             | Dr. Lam Quang Vu                      |
| Date:                   | 2026-08-11                            |
| Signature:              | ![Lê Hoàng Lâm](assets/signature.png) |

---

## References

- Kharbach, M. (2026). _AI Use Policy Templates for Higher Education._ CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Playwright documentation.
- Hardman, P. (2025). _A Post-AI Learning Taxonomy._
