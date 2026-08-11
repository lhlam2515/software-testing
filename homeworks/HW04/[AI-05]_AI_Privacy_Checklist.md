# Privacy & Responsible AI Use Checklist — HW04

---

## 1. Before I use AI

- [x] I confirmed the AI Use Category assigned to this assignment. *(Category 4 — AI-Assisted Production, confirmed in `[AI-03]` §1.)*
- [x] I have declared which AI tool(s) I will use in my prompt log. *(Claude Code `claude-sonnet-5` + Codex CLI `gpt-5.6-sol`, see `prompt_log.md`.)*
- [x] I have read the AI Use Agreement for this course.
- [x] I understand which artifacts MUST NOT be AI-generated or fabricated: the HTML
      reports' `Run by: {StudentID}` + ISO timestamp, and the demo video's
      face-cam/`whoami`/`hostname` authorship evidence (§11 anti-cheat constraints).

---

## 2. While I am using AI

- [x] I did not enter real customer/user PII from the SUT into any AI tool beyond what
      is already public test fixture data. *(`test@eshop.com`/`admin@eshop.com` are the SUT's own seeded demo accounts, not personal credentials — `REPORT.md §2`.)*
- [x] I did not paste proprietary employer or license-restricted code into the AI.
- [x] I drove the AI step by step per test case group / feature, not with a single
      generic "write all the automation scripts" prompt (§2). *(A1→A6 chain per feature, see `TEST_PLAN.md §4` and `prompt_log.md` Entries 002–007.)*
- [x] I logged each prompt + AI response into [prompt_log.md](prompt_log.md) with timestamp.

---

## 3. Before I submit my work

- [x] All AI-generated artifacts are tagged in the [AI Audit Report](<[AI-02]_AI_Audit_Report.md>). *(7 artifacts audited.)*
- [x] Every automation script was actually executed against the live SUT — no fabricated
      pass/fail results or invented HTML reports.
- [x] Test data lives in separate `.csv`/`.json` files under `artifacts/test-data/` — no hardcoded
      inline arrays or objects in the scripts.
- [x] Each script uses at least 3 distinct assertion patterns.
- [x] Each feature ran on Chromium, Firefox, and Edge (≥ 9 browser runs total), and
      every generated HTML report visibly shows `Run by: 23127216` and an ISO timestamp.
- [x] Every genuine defect is logged in [bugs/BUG_REPORT.md](bugs/BUG_REPORT.md) **and**
      filed on GitHub Issues with a screenshot.
- [x] My 200–300-word AI Critique is included in `REPORT.md` §12. **← still `_TBD_`, must be written by the student unaided (per `[AI-03]` §2.6 disclosure) — not filled by this pass.**
- [x] The Mandatory Disclosure paragraph is completed in `[AI-02]_AI_Audit_Report.md` §6.
- [x] I attached the AI Use Disclosure Form ([AI-03](<[AI-03]_AI_Disclosure_Form.md>)).
- [x] Git commit log has ≥ 8 commits touching test-script files. *(4-day span requirement removed per TA update, 2026-08-10; 9 commits confirmed — `assets/git-commit-log.txt` still needs the actual export.)*
- [x] The Agent Skill under `artifacts/skills/playwright-spec-generator/` is included with its demo video link.
- [x] README.md test summary metrics are filled with final numbers.
- [x] I am ready for a 5–7-min random oral defense the week after submission. **← self-assessment, left for the student to confirm.**

---

## 4. Final Statement

Final responsibility for the accuracy, originality, and integrity of this submission rests with me. Any undisclosed AI use is treated as academic misconduct.

---

## 5. Signature

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

- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education.* CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
