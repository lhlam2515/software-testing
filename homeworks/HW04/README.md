# HW04 - Automation Testing on EShop

## Student Information

- **Student name**: Lê Hoàng Lâm
- **Student ID**: 23127216
- **Group**: 02
- **Class / Cohort**: 23KTPM1
- **Github Repository**: [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing)
- **SUT (EShop web)**: `http://localhost:5173` (customer storefront — FR-02, FR-09) · `http://localhost:5174` (admin dashboard — FR-16) · backend `http://localhost:3000` (repo: [github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut))
- **Demo video (Task 2)**: [Video Demo](https://youtu.be/371g6eJhN88) (unlisted, FR-02 — Login & Account Lockout)
- **Demo video (Agent Skill)**: [Video Demo](https://youtu.be/kcqyrRKTTz0) (unlisted, `playwright-spec-generator` skill applied to FR-01 — Registration)

---

## Submission Contents

| Document | Description |
| -------- | ------------ |
| [REPORT.md](./REPORT.md) | Main report — feature selection, automation approach, results per feature, AI gap analysis, AI Critique (§12), Agent Skill |
| [BUG_REPORT.md](./bugs/BUG_REPORT.md) | Consolidated bug report, cross-linked to GitHub Issues |
| [prompt_log.md](./prompt_log.md) | Full AI prompt log with timestamps |
| [AI_Audit_Report.md](./%5BAI-02%5D_AI_Audit_Report.md) | Per-artifact AI audit (prompt, output, verdict, reasoning, student fix) |
| [AI_Disclosure_Form.md](./%5BAI-03%5D_AI_Disclosure_Form.md) | Mandatory AI usage disclosure |
| [AI_Privacy_Checklist.md](./%5BAI-05%5D_AI_Privacy_Checklist.md) | AI privacy and responsible-use checklist |
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
| FR-02 | Login & Account Lockout | [HW02 domain-testing.md](.reference/FR-02-login-lockout/domain-testing.md) · [bva.md](.reference/FR-02-login-lockout/bva.md) | `18` |
| FR-09 | Discount Coupons | [HW02 domain-testing.md](.reference/FR-09-coupon/domain-testing.md) · [bva.md](.reference/FR-09-coupon/bva.md) | `21` |
| FR-16 | CSV Import | [HW02 domain-testing.md](.reference/FR-16-csv-import/domain-testing.md) · [bva.md](.reference/FR-16-csv-import/bva.md) | `24` |

## Test Summary

> Executed / Passed / Failed are summed across all 3 browser runs per feature (single-run count × 3, since all 3 browsers produced identical results — see [REPORT.md §4.4](./REPORT.md)).

| Metric | Result |
| --- | ---: |
| Features | `3` |
| Test cases automated | `63` |
| Test cases executed | `189` |
| Passed | `99` |
| Failed | `90` |
| Browser runs | `9` |
| Bugs | `16` |

## Self-assessment

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1** | Task 1 — Feature A (FR-02, ≥12 TCs, data-driven, 3 assertion patterns, 3 browsers) | 25 | 25 |
| **1** | Task 1 — Feature B (FR-09, ≥12 TCs, data-driven, 3 assertion patterns, 3 browsers) | 25 | 25 |
| **1** | Task 1 — Feature C (FR-16, ≥12 TCs, data-driven, 3 assertion patterns, 3 browsers) | 25 | 25 |
| **2** | Task 2 — Demo video | 15 | 15 |
| **3** | Agent Skills | 10 | 10 |
| | **Total** | **100** | 100 |

---

## Submission Checklist

- [ ] Main report available in Markdown and PDF, including automation report + AI-gap review. *(REPORT.md §1–11 filled; §12 (AI Critique) still `_TBD_` — re-export PDF after.)*
- [ ] AI Audit Report available in Markdown and PDF. *(Markdown content complete; PDF export still pending.)*
- [ ] AI Critique is 200–300 words, embedded in `REPORT.md` §12, and available in Markdown and PDF. *(Not yet written.)*
- [ ] AI Use Disclosure Form ([AI-03]) and Privacy Checklist ([AI-05]) are completed. *([AI-03] mostly `_TBD_`; [AI-05] only missing signature date.)*
- [x] Each feature contains at least 12 automated test cases (positive/negative/edge combined). *(18 / 21 / 24 — see Test Summary above.)*
- [x] Test data is stored in separate `.csv` or `.json` files — no hardcoded inline arrays/objects. *(`artifacts/test-data/FR-02|FR-09|FR-16/cases.json`.)*
- [x] Each script uses at least 3 distinct assertion patterns. *(See REPORT.md §4.3.)*
- [x] Each feature has Chromium, Firefox, and Edge HTML reports (≥ 9 browser runs total). *(9 total — see Test Summary above.)*
- [x] Every generated HTML report displays `Run by: {StudentID}` and an ISO timestamp. *(Set via `STUDENT_ID` in `artifacts/playwright.config.ts`.)*
- [x] Genuine defects are recorded in Markdown ([BUG_REPORT.md](./bugs/BUG_REPORT.md)) and on GitHub Issues with screenshots. *(16 bugs, all cross-linked to Issues.)*
- [x] Public GitHub repository has ≥ 8 commits touching test-script files. *(4-day span requirement removed per TA update, 2026-08-10. 9 commits — `.spec.ts` files plus `artifacts/tests/_fixtures/` page objects/helpers, which the specs import directly and cannot run without.)*
- [ ] Git commit log exported to [assets/git-commit-log.txt](./assets/git-commit-log.txt). *(File still contains the TODO placeholder — export the 9-commit log above.)*
- [x] Agent Skill submitted under [artifacts/skills/](./artifacts/skills/) with a demo video link. *([youtu.be/kcqyrRKTTz0](https://youtu.be/kcqyrRKTTz0) — FR-01 Registration, link in [skill README.md](./artifacts/skills/playwright-spec-generator/README.md#demo-video) and [REPORT.md §10](./REPORT.md).)*
- [x] Unlisted YouTube demo video (≥ 5 min, Vietnamese narration, face-cam or `whoami`/`hostname`) link included. *([youtu.be/371g6eJhN88](https://youtu.be/371g6eJhN88) — FR-02 Login & Account Lockout, face-cam authorship.)*
- [ ] Zip named `23127216_HW04_AI_Automation_<SelfAssessedGrade>.zip`. *(Pending — depends on final self-assessed grade.)*
