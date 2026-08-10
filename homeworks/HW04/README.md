# HW04 - Automation Testing on EShop

## Student Information

- **Student name**: Lê Hoàng Lâm
- **Student ID**: 23127216
- **Group**: 02
- **Class / Cohort**: 23KTPM1
- **Github Repository**: [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing)
- **SUT (EShop web)**: `<Base URL — local http://localhost:5173 or deployed>`
- **Demo video**: `<Unlisted YouTube URL>`

---

## Submission Contents

| Document | Description |
| -------- | ------------ |
| [REPORT.md](./REPORT.md) | Main report — feature selection, automation approach, results per feature, AI gap analysis, AI Critique (§12), Agent Skill |
| [BUG_REPORT.md](./bugs/BUG_REPORT.md) | Consolidated bug report, cross-linked to GitHub Issues |
| [prompt_log.md](./prompt_log.md) | Full AI prompt log with timestamps |
| [[AI-02]_AI_Audit_Report.md](./%5BAI-02%5D_AI_Audit_Report.md) | Per-artifact AI audit (prompt, output, verdict, reasoning, student fix) |
| [[AI-03]_AI_Disclosure_Form.md](./%5BAI-03%5D_AI_Disclosure_Form.md) | Mandatory AI usage disclosure |
| [[AI-05]_AI_Privacy_Checklist.md](./%5BAI-05%5D_AI_Privacy_Checklist.md) | AI privacy and responsible-use checklist |
| [artifacts/tests/](./artifacts/tests/) | Playwright automation scripts, one folder per feature (FR-02, FR-09, FR-16) |
| [artifacts/test-data/](./artifacts/test-data/) | External `.csv` / `.json` test data — no hardcoded arrays in scripts |
| [artifacts/html-reports/](./artifacts/html-reports/) | Multi-browser HTML reports (Chromium / Firefox / Edge — WebKit substituted per [BUG_REPORT.md](./bugs/BUG_REPORT.md)) per feature, showing `Run by: {StudentID}` |
| [artifacts/skills/](./artifacts/skills/) | Agent Skill submission — reusable data-driven, multi-browser automation workflow |
| [assets/](./assets/) | Signature image and Git commit log |

---

## Selected Features

Same three web features selected in HW02 — one per Pool A/B/C.

| Feature | Name | HW02 source | Automated test cases |
| --- | --- | --- | ---: |
| FR-02 | Login & Account Lockout | [HW02 domain-testing.md](../HW02/artifacts/tests/FR-02-login-lockout/domain-testing.md) · [bva.md](../HW02/artifacts/tests/FR-02-login-lockout/bva.md) | `<Count>` |
| FR-09 | Discount Coupons | [HW02 domain-testing.md](../HW02/artifacts/tests/FR-09-coupon/domain-testing.md) · [bva.md](../HW02/artifacts/tests/FR-09-coupon/bva.md) | `<Count>` |
| FR-16 | CSV Import | [HW02 domain-testing.md](../HW02/artifacts/tests/FR-16-csv-import/domain-testing.md) · [bva.md](../HW02/artifacts/tests/FR-16-csv-import/bva.md) | `<Count>` |

## Test Summary

| Metric | Result |
| --- | ---: |
| Features | `3` |
| Test cases automated | `<Count>` |
| Test cases executed | `<Count>` |
| Passed | `<Count>` |
| Failed | `<Count>` |
| Browser runs | `<Count>` |
| Bugs | `<Count>` |

## Self-assessment

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1** | Task 1 — Feature A (FR-02, ≥12 TCs, data-driven, 3 assertion patterns, 3 browsers) | 25 |  |
| **1** | Task 1 — Feature B (FR-09, ≥12 TCs, data-driven, 3 assertion patterns, 3 browsers) | 25 |  |
| **1** | Task 1 — Feature C (FR-16, ≥12 TCs, data-driven, 3 assertion patterns, 3 browsers) | 25 |  |
| **2** | Task 2 — Demo video | 15 |  |
| **3** | Agent Skills | 10 |  |
|  | **Total** | **100** |  |

---

## Submission Checklist

- [ ] Main report available in Markdown and PDF, including automation report + AI-gap review.
- [ ] AI Audit Report available in Markdown and PDF.
- [ ] AI Critique is 200–300 words, embedded in `REPORT.md` §12, and available in Markdown and PDF.
- [ ] AI Use Disclosure Form ([AI-03]) and Privacy Checklist ([AI-05]) are completed.
- [ ] Each feature contains at least 12 automated test cases (positive/negative/edge combined).
- [ ] Test data is stored in separate `.csv` or `.json` files — no hardcoded inline arrays/objects.
- [ ] Each script uses at least 3 distinct assertion patterns.
- [ ] Each feature has Chromium, Firefox, and Edge HTML reports (≥ 9 browser runs total).
- [ ] Every generated HTML report displays `Run by: {StudentID}` and an ISO timestamp.
- [ ] Genuine defects are recorded in Markdown ([BUG_REPORT.md](./bugs/BUG_REPORT.md)) and on GitHub Issues with screenshots.
- [ ] Public GitHub repository has ≥ 8 commits touching test-script files. *(4-day span requirement removed per TA update, 2026-08-10.)*
- [ ] Git commit log exported to [assets/git-commit-log.txt](./assets/git-commit-log.txt).
- [ ] Agent Skill submitted under [artifacts/skills/](./artifacts/skills/) with a demo video link.
- [ ] Unlisted YouTube demo video (≥ 5 min, Vietnamese narration, face-cam or `whoami`/`hostname`) link included.
- [ ] Zip named `23127216_HW04_AI_Automation_<SelfAssessedGrade>.zip`.

