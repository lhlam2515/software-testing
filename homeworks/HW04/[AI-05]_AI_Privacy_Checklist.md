# Privacy & Responsible AI Use Checklist — HW04

---

## 1. Before I use AI

- [ ] I confirmed the AI Use Category assigned to this assignment.
- [ ] I have declared which AI tool(s) I will use in my prompt log.
- [ ] I have read the AI Use Agreement for this course.
- [ ] I understand which artifacts MUST NOT be AI-generated or fabricated: the HTML
      reports' `Run by: {StudentID}` + ISO timestamp, and the demo video's
      face-cam/`whoami`/`hostname` authorship evidence (§11 anti-cheat constraints).

---

## 2. While I am using AI

- [ ] I did not enter real customer/user PII from the SUT into any AI tool beyond what
      is already public test fixture data.
- [ ] I did not paste proprietary employer or license-restricted code into the AI.
- [ ] I drove the AI step by step per test case group / feature, not with a single
      generic "write all the automation scripts" prompt (§2).
- [ ] I logged each prompt + AI response into [prompt_log.md](prompt_log.md) with timestamp.

---

## 3. Before I submit my work

- [ ] All AI-generated artifacts are tagged in the [AI Audit Report](<[AI-02]_AI_Audit_Report.md>).
- [ ] Every automation script was actually executed against the live SUT — no fabricated
      pass/fail results or invented HTML reports.
- [ ] Test data lives in separate `.csv`/`.json` files under `test-data/` — no hardcoded
      inline arrays or objects in the scripts.
- [ ] Each script uses at least 3 distinct assertion patterns.
- [ ] Each feature ran on Chromium, Firefox, and WebKit (≥ 9 browser runs total), and
      every generated HTML report visibly shows `Run by: 23127216` and an ISO timestamp.
- [ ] Every genuine defect is logged in [bugs/BUG_REPORT.md](bugs/BUG_REPORT.md) **and**
      filed on GitHub Issues with a screenshot.
- [ ] My 200–300-word AI Critique is included in `REPORT.md` §12.
- [ ] The Mandatory Disclosure paragraph is completed in `[AI-02]_AI_Audit_Report.md` §6.
- [ ] I attached the AI Use Disclosure Form ([AI-03](<[AI-03]_AI_Disclosure_Form.md>)).
- [ ] Git commit log has ≥ 8 commits touching test-script files, spread over ≥ 4 days.
- [ ] The Agent Skill under `skills/automation-workflow/` is included with its demo video link.
- [ ] README.md test summary metrics are filled with final numbers.
- [ ] I am ready for a 5–7-min random oral defense the week after submission.

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
| Date:                   | _TBD_                                 |
| Signature:              | ![Lê Hoàng Lâm](assets/signature.png) |

---

## References

- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education.* CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
