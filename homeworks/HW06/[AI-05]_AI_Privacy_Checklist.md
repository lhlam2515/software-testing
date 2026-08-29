# Privacy & Responsible AI Use Checklist - HW06

## 1. Before I Use AI

- [x] I confirmed the AI Use Category assigned to this assignment in `[AI-03]_AI_Disclosure_Form.md`. Category 4, AI-Assisted Production, per the AI Use Agreement section 4.
- [x] I declared every AI tool and model I will use in [prompt_log.md](prompt_log.md). Claude Code with Sonnet 5 in Pass 1 and Opus 5 in Pass 2; no other AI service.
- [x] I read the [AI Use Agreement](../../context/ai_use_agreement.md) and [HW06 Requirements](REQUIREMENTS.md).
- [x] I understand that the 200-300-word AI Critique in `REPORT.md` must be written by me.
- [x] I understand that the test-generator diagram must reflect my own design decisions and must not be AI-generated.

## 2. While I Am Using AI

- [x] I did not enter personal data, real customer credentials, access tokens, or other secrets into an AI tool.
- [x] Any credentials or records shared with AI are public SUT fixtures or synthetic test data, not real user data. The accounts used are the seeded `test@eshop.com` and `admin@eshop.com` fixtures; every JWT in the artifacts was issued by the local SUT.
- [x] I did not paste copyrighted reading materials wholesale or proprietary employer code into an AI tool. The technique references under `artifacts/skills/api-test-generator/references/` are condensed notes that cite `docs/istqb/ch4_design.md` by section rather than reproducing it.
- [x] I drove test generation step by step for each selected API instead of using one generic prompt. The seven generator stages and the two audit gates are visible in entries 1, 3, 5, 8, 12, and 13.
- [x] I logged each relevant prompt and AI response in [prompt_log.md](prompt_log.md) with tool, model, and timestamp. Pass 2 entries were copied out of the session logs by script, not retyped.
- [x] I kept the exact boundary between AI-generated cases, student corrections, and student-added cases visible. Pass 1 files are kept unchanged next to the `-v2` files, and the workbook marks student-added rows in its `Origin` column.

## 3. Before I Submit My Work

- [x] Every substantial AI-generated artifact is covered by the [AI Audit Report](<[AI-02]_AI_Audit_Report.md>). Seven artifact blocks: three test-case suites, the executable package and Newman run, the Excel workbook, the CI/CD pipeline, and the agent skills with the generator design.
- [x] Every AI-generated test case has a VALID, INVALID, or INCOMPLETE verdict with reasoning. 130 rows re-derived in Pass 2, each naming the check that decided it.
- [x] Invalid and incomplete cases show the student's correction, and student-added cases are identified separately. 36 student-added cases across the three APIs.
- [x] Every request executed by the suite carries the required `X-Student-Id` header. Console evidence in `assets/t1-xstudentid-hostname-evidence.png`.
- [x] Postman and Newman results come from actual execution against the SUT and were not fabricated or inferred by AI.
- [x] The Newman HTML report and console output are attached. `artifacts/newman/<fr>/newman-report.html` with the Pass 1 runs under `archive/`, and the CI run logs under `artifacts/cicd/evidence/`.
- [x] The Excel test cases and Markdown summary match the final reviewed suite. `23127216_HW06_TestCases.xlsx` is rebuilt from the `-v2` suites and reconciles with `REPORT.md` section 6.6.
- [x] Every genuine bug in [BUG_REPORT.md](BUG_REPORT.md) has a matching GitHub Issue and screenshot. 15 bugs, issues #44 to #58, 15 screenshots under `assets/issues/`.
- [x] The CI/CD evidence contains one all-passing run and one run with exactly one failing test case. Run 33260661696 green with 403 assertions; run 33261095283 failing only FR-15 TC-17.
- [x] The self-drawn test-generator diagram and pseudocode are attached; any implemented Agent Skill is disclosed separately. `artifacts/test-generator/` and `artifacts/skills/`.
- [ ] My 200-300-word AI Critique is included in `REPORT.md` and was written by me.
- [x] The Mandatory Disclosure section is completed in `[AI-02]_AI_Audit_Report.md`.
- [x] I attached this checklist and the [AI Use Disclosure Form](<[AI-03]_AI_Disclosure_Form.md>).
- [ ] The Git commit log records multiple meaningful work steps, not a single submission commit.
- [ ] README.md contains final test-summary metrics and the completed self-assessment.
- [ ] I am ready for the required random oral defense.

### Open items and what closes each

| Item | Current state | What closes it |
| --- | --- | --- |
| AI Critique | `REPORT.md` section 10 is empty, with no AI draft in it | The student writes 200 to 300 words answering the three questions in REQUIREMENTS.md section 10 |
| Git commit log | `assets/commit-log.txt` still holds its placeholder line | Export the branch history, for example `git log --date=iso-strict > assets/commit-log.txt` |
| README metrics | The Test Summary table and the self-assessment grades are `_TBD_` | Fill 3 APIs, 113 generated, 130 audited, 36 extended, 159 executed rows, 523 of 567 assertions passed, 44 failed, 15 bugs; the self-assessed grade is the student's own judgement |
| Oral defense | A personal readiness statement, not an artifact | The student confirms it |

## 4. Final Statement

- [ ] I confirm that this checklist is accurate for the final HW06 submission.

Ticked once the four open items above are closed. Everything else on this checklist was verified against the artifact it names, not assumed.

## 5. Signature

| Field | Value |
| --- | --- |
| Student name (printed) | Le Hoang Lam |
| Student ID | 23127216 |
| Class / Cohort | 23KTPM1 |
| Course | CS423 / CSC13003 - Software Testing |
| Instructor | Dr. Lam Quang Vu |
| Date | 2026-08-29 |
| Signature | ![Le Hoang Lam](assets/signature.png) |

## References

- [AI Use Agreement](../../context/ai_use_agreement.md)
- [HW06 Requirements](REQUIREMENTS.md)
- [AI Audit Report](<[AI-02]_AI_Audit_Report.md>)
- [AI Use Disclosure Form](<[AI-03]_AI_Disclosure_Form.md>)
