# Main Report — HW04

**Automation Testing on EShop (Playwright, Multi-browser)**

---

## 1. Student Information

| Field | Value |
| ----- | ----- |
| Student name | Lê Hoàng Lâm |
| Student ID | 23127216 |
| Group | 02 |
| Class / Cohort | 23KTPM1 |
| Assignment | HW04-AI — Automation Testing |
| SUT | EShop — `<Base URL>` (repo: [github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut)) |
| Public GitHub repository | [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing) |
| Report date | _TBD_ |

---

## 2. System Under Test

_TBD — how the SUT was run (local `apps/` monorepo vs. the standalone `eshop-sut` repo), base URL, test account(s) used, seeded data notes._

| Item | Value |
| ---- | ----- |
| Frontend URL | _TBD_ |
| Backend URL | _TBD_ |
| Test account(s) | _TBD (do not share credentials shared with other members)_ |
| Build / commit under test | _TBD_ |

---

## 3. Feature Selection

Same three web features selected in HW02 — one each from Pools A, B, C. See §5 of `REQUIREMENTS.md`.

### 3.1 FR-02 — Login & Account Lockout (Pool A)

| Field | Value |
| ----- | ----- |
| HW02 reference | [domain-testing.md](../HW02/artifacts/tests/FR-02-login-lockout/domain-testing.md) · [bva.md](../HW02/artifacts/tests/FR-02-login-lockout/bva.md) |
| Why this feature | _TBD_ |
| Test cases carried over from HW02 | _TBD (count)_ |

### 3.2 FR-09 — Discount Coupons (Pool B)

| Field | Value |
| ----- | ----- |
| HW02 reference | [domain-testing.md](../HW02/artifacts/tests/FR-09-coupon/domain-testing.md) · [bva.md](../HW02/artifacts/tests/FR-09-coupon/bva.md) |
| Why this feature | _TBD_ |
| Test cases carried over from HW02 | _TBD (count)_ |

### 3.3 FR-16 — CSV Import (Pool C)

| Field | Value |
| ----- | ----- |
| HW02 reference | [domain-testing.md](../HW02/artifacts/tests/FR-16-csv-import/domain-testing.md) · [bva.md](../HW02/artifacts/tests/FR-16-csv-import/bva.md) |
| Why this feature | _TBD_ |
| Test cases carried over from HW02 | _TBD (count)_ |

### 3.4 Non-overlap declaration (§5)

| Member | Pool A | Pool B | Pool C |
| ------ | ------ | ------ | ------ |
| Lê Hoàng Lâm (me) | FR-02 | FR-09 | FR-16 |
|  |  |  |  |

---

## 4. Automation Approach

### 4.1 Tooling and Environment

_TBD — Playwright version, language (TS/JS), project layout, how the AI tool was steered step by step (not a single generic prompt), reference to `prompt_log.md`._

| Item | Value |
| ---- | ----- |
| Automation framework | Playwright `<version>` |
| Language | _TBD_ |
| AI tool(s) used to generate scripts | _TBD_ |
| Report format | Playwright HTML reporter / Allure |

### 4.2 Data-driven Design

_TBD — how `.csv` / `.json` files under `test-data/<feature>/` are loaded into the specs, why no data is hardcoded inline._

| Feature | Data file | Format | Rows |
| ------- | --------- | ------ | ---: |
| FR-02 | [test-data/FR-02/cases.json](test-data/FR-02/cases.json) | JSON | _TBD_ |
| FR-09 | [test-data/FR-09/cases.json](test-data/FR-09/cases.json) | JSON | _TBD_ |
| FR-16 | [test-data/FR-16/cases.json](test-data/FR-16/cases.json) + [fixtures/](test-data/FR-16/fixtures/) | JSON + CSV fixtures | _TBD_ |

### 4.3 Assertion Patterns

> At least 3 distinct assertion patterns are required across the suite (e.g., UI state assertion, network/response assertion, DB/state assertion).

| # | Pattern | Example use | Feature(s) |
| - | ------- | ------------ | ---------- |
| 1 | _TBD_ | _TBD_ | _TBD_ |
| 2 | _TBD_ | _TBD_ | _TBD_ |
| 3 | _TBD_ | _TBD_ | _TBD_ |

### 4.4 Browser Matrix and Run Metadata

> Each feature must run on all 3 browsers — at least 9 browser runs total. Every HTML report must visibly show `Run by: {StudentID}` and an ISO timestamp (§11 anti-cheat constraint).

| Feature | Chromium | Firefox | WebKit |
| ------- | :------: | :-----: | :----: |
| FR-02 | _TBD_ | _TBD_ | _TBD_ |
| FR-09 | _TBD_ | _TBD_ | _TBD_ |
| FR-16 | _TBD_ | _TBD_ | _TBD_ |

---

## 5. Automation Results

> Full specs live under `tests/<feature>/`. Full HTML reports live under `artifacts/html-reports/<feature>/<browser>/`.

### 5.1 FR-02 — Login & Account Lockout

| Metric | Value |
| ------ | ----- |
| Test cases automated | _TBD_ |
| Executed / Passed / Failed | _TBD_ |
| Browser runs | _TBD_ |
| Spec location | [tests/FR-02/](tests/FR-02/) |
| HTML reports | [artifacts/html-reports/FR-02/](artifacts/html-reports/FR-02/) |

### 5.2 FR-09 — Discount Coupons

| Metric | Value |
| ------ | ----- |
| Test cases automated | _TBD_ |
| Executed / Passed / Failed | _TBD_ |
| Browser runs | _TBD_ |
| Spec location | [tests/FR-09/](tests/FR-09/) |
| HTML reports | [artifacts/html-reports/FR-09/](artifacts/html-reports/FR-09/) |

### 5.3 FR-16 — CSV Import

| Metric | Value |
| ------ | ----- |
| Test cases automated | _TBD_ |
| Executed / Passed / Failed | _TBD_ |
| Browser runs | _TBD_ |
| Spec location | [tests/FR-16/](tests/FR-16/) |
| HTML reports | [artifacts/html-reports/FR-16/](artifacts/html-reports/FR-16/) |

### 5.4 Consolidated Test Summary

| Feature | Automated | Executed | Passed | Failed | Browser runs | Bugs |
| ------- | --------: | -------: | -----: | -----: | ------------: | ---: |
| FR-02 |  |  |  |  |  |  |
| FR-09 |  |  |  |  |  |  |
| FR-16 |  |  |  |  |  |  |
| **Total** |  |  |  |  |  |  |

---

## 6. Human Review and AI Gap Analysis

> Critical review of the AI-generated scripts (§6, Task 1 — "Review and fix"). Full per-artifact audit lives in [[AI-02]_AI_Audit_Report.md](%5BAI-02%5D_AI_Audit_Report.md).

### 6.1 Fragile Selectors

| # | Feature | AI-generated selector | Issue | Fix |
| - | ------- | ---------------------- | ----- | --- |
|  |  |  |  |  |

### 6.2 Weak or Missing Assertions

| # | Feature | AI-generated assertion | Issue | Fix |
| - | ------- | ------------------------ | ----- | --- |
|  |  |  |  |  |

### 6.3 Missing Edge Cases

| # | Feature | Edge case AI missed | Why it matters | Added TC |
| - | ------- | --------------------- | --------------- | -------- |
|  |  |  |  |  |

### 6.4 Flaky Waits and Execution Stability

| # | Feature | AI-generated wait/timing | Issue | Fix |
| - | ------- | -------------------------- | ----- | --- |
|  |  |  |  |  |

### 6.5 Test Cases Not Automated

| # | Feature | TC ID | Reason not automated |
| - | ------- | ----- | ---------------------- |
|  |  |  |  |

### 6.6 Why the AI missed these (summary)

_TBD — prompt quality, model limitations, or feature characteristics that explain the gaps above. Feed this into §7 of [[AI-02]_AI_Audit_Report.md](%5BAI-02%5D_AI_Audit_Report.md) and into §12 (AI Critique) below._

---

## 7. Defects Found

> Genuine defects revealed by failing assertions. Full entries (repro, expected/actual, screenshot) in [bugs/BUG_REPORT.md](bugs/BUG_REPORT.md), cross-linked to GitHub Issues.

| Bug ID | Feature | Title | Severity | GitHub Issue |
| ------ | ------- | ----- | -------- | ------------- |
|  |  |  |  |  |

---

## 8. Multi-browser HTML Reports

| Feature | Chromium | Firefox | WebKit |
| ------- | -------- | ------- | ------ |
| FR-02 | [report](artifacts/html-reports/FR-02/chromium/) | [report](artifacts/html-reports/FR-02/firefox/) | [report](artifacts/html-reports/FR-02/webkit/) |
| FR-09 | [report](artifacts/html-reports/FR-09/chromium/) | [report](artifacts/html-reports/FR-09/firefox/) | [report](artifacts/html-reports/FR-09/webkit/) |
| FR-16 | [report](artifacts/html-reports/FR-16/chromium/) | [report](artifacts/html-reports/FR-16/firefox/) | [report](artifacts/html-reports/FR-16/webkit/) |

> Every report must show `Run by: 23127216` and an ISO timestamp — see [artifacts/html-reports/README.md](artifacts/html-reports/README.md).

---

## 9. Demo Video

| Field | Value |
| ----- | ----- |
| Link (unlisted YouTube, ≥ 5 min) | _TBD_ |
| Feature demonstrated end to end | _TBD_ |
| Fix narrated during the review | _TBD_ |
| Authorship evidence | `<Face-cam or terminal running whoami/hostname>` |

---

## 10. Agent Skill

> §7 — reusable Agent Skill for the data-driven, multi-browser automation workflow (script generation and maintenance). Source lives in [skills/automation-workflow/](skills/automation-workflow/).

| Field | Value |
| ----- | ----- |
| Skill name | `automation-workflow` |
| What it automates | _TBD_ |
| Demo video (skill applied to a full feature) | _TBD_ |

---

## 11. Repository and Git History

| Field | Value |
| ----- | ----- |
| Public GitHub repository | [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing) |
| Commits touching test-script files | _TBD (≥ 8 required, spread over ≥ 4 days)_ |
| Git commit log | [assets/git-commit-log.txt](assets/git-commit-log.txt) |

---

## 12. AI Critique (200–300 words, Mandatory)

> Assignment §10. Must be written entirely by the student. Where was the AI wrong, biased,
> or incomplete? Why did it fail to catch the issue? What principle did you learn about
> collaborating with AI during this assignment?

_TBD_

---

## 13. AI Audit Report & Prompt Log

| Document | Location |
| -------- | -------- |
| AI Audit Report (mandatory appendix, §9) | [[AI-02]_AI_Audit_Report.md](%5BAI-02%5D_AI_Audit_Report.md) |
| AI Use Disclosure Form | [[AI-03]_AI_Disclosure_Form.md](%5BAI-03%5D_AI_Disclosure_Form.md) |
| Privacy & Responsible AI Use Checklist | [[AI-05]_AI_Privacy_Checklist.md](%5BAI-05%5D_AI_Privacy_Checklist.md) |
| Full prompt log | [prompt_log.md](prompt_log.md) |

---

## 14. References

- ISTQB Foundation Level Syllabus (latest edition).
- Playwright documentation — Test Generator, Assertions, HTML Reporter, Multi-browser projects.
- Course slides: _Automation & Regression Testing (AI-First)_.
- Hardman, P. (2025). _A Post-AI Learning Taxonomy._
- Fuster Rabella, M. (2025). _OECD Education Working Paper No. 338._
- Anthropic (2025). _Building Reliable AI Test Agents_ — engineering blog.
