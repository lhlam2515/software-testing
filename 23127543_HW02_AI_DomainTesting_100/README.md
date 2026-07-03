# HW02 - Domain Testing on EShop

## Student Information

| Field | Value |
|---|---|
| Student ID | 23127543 |
| Student Name | Vu Van Vu |
| Self-Assessed Grade | 100 |
| Submission Filename | 23127543_HW02_AI_DomainTesting_100.zip |

## Selected Features

| Pool | Feature ID | Feature Name | Report File |
|---|---|---|---|
| A | FR-04 | Personal Profile Management | [feature_A_FR04_profile.md](feature_A_FR04_profile.md) |
| B | FR-08 | Checkout | [feature_B_FR08_checkout.md](feature_B_FR08_checkout.md) |
| C | FR-18 | Admin Order Management | [feature_C_FR18_admin_order_management.md](feature_C_FR18_admin_order_management.md) |
| D | FR-20 | Mobile Checkout | [feature_D_mobile_selected.md](feature_D_mobile_selected.md) |

## Self-Assessment Table

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---:|---:|
| 1 | Feature A - Domain + Boundary | 25 | 25 |
| 2 | Feature B - Domain + Boundary | 25 | 25 |
| 3 | Feature C - Domain + Boundary | 25 | 25 |
| 4 | Feature D - Mobile, Domain + Boundary | 15 | 15 |
| 5 | Agent Skills | 10 | 10 |
|  | Total | 100 | 100 |

## Test Summary Report

Counts are computed from the execution summary tables in the four feature reports.

| Metric | Count |
|---|---:|
| Number of features | 4 |
| Test cases designed | 79 |
| Test cases executed | 78 |
| Passed | 36 |
| Failed | 33 |
| Not yet executed | 1 |
| Needs Review | 9 |
| Confirmed bugs | 16 |
| Demo videos | Not available |

## Required Submission Contents

| Required Item | File / Folder | Status |
|---|---|---|
| Main report in Markdown | [main_report.md](main_report.md) | Available |
| Main report in PDF | [pdf/main_report.pdf](pdf/main_report.pdf) | Available |
| Domain Testing and BVA reports | [feature_A_FR04_profile.md](feature_A_FR04_profile.md), [feature_B_FR08_checkout.md](feature_B_FR08_checkout.md), [feature_C_FR18_admin_order_management.md](feature_C_FR18_admin_order_management.md), [feature_D_mobile_selected.md](feature_D_mobile_selected.md) | Available in Markdown |
| Feature report PDFs | [pdf/](pdf/) | Available |
| Bug report with GitHub Issue screenshot note | [bug_report.md](bug_report.md) | Available |
| GitHub Issue screenshots | [evidence/github_issues/](evidence/github_issues/) | Partially available for issues #7-#12 |
| AI Critique in Markdown | [ai_critique.md](ai_critique.md) | Available |
| AI Critique in PDF | [pdf/ai_critique.pdf](pdf/ai_critique.pdf) | Available |
| AI Audit Report in Markdown | [ai_audit_report.md](ai_audit_report.md) | Available; exact timestamps need manual update |
| AI Audit Report in PDF | [pdf/ai_audit_report.pdf](pdf/ai_audit_report.pdf) | Available |
| Git commit log text file | [git_commit_log.txt](git_commit_log.txt) | Available |
| GitHub issue summary | [github_issue_summary.md](github_issue_summary.md) | Available |

## Supporting Materials

| Material | Location | Notes |
|---|---|---|
| Agent skills | [agent_skill/](agent_skill/) | Domain Testing and BVA skill notes are included |
| Test scripts | [test_scripts/](test_scripts/) | API, UI, and mobile manual test materials are included |
| JSON result logs | [test_scripts/results/json/](test_scripts/results/json/) | Used as API execution evidence |
| HTML result logs | [test_scripts/results/html/](test_scripts/results/html/) | Supporting execution summaries |
| Screenshots | [evidence/screenshots/](evidence/screenshots/) | Used as UI and mobile evidence |
| GitHub issue screenshots | [evidence/github_issues/](evidence/github_issues/) | Screenshots exist for the six created GitHub issues |
| GitHub issue draft text | [github_issue_bugs.txt](github_issue_bugs.txt) | Contains the six GitHub issues that were created |
| GitHub issue summary | [github_issue_summary.md](github_issue_summary.md) | Maps bug IDs to issue URLs and screenshot evidence |
| PDF folder | [pdf/](pdf/) | Required PDFs generated from the Markdown reports |

## Demo Videos

| Demo | Link | Notes |
|---|---|---|
| Agent Skill demo | Not available - no demo video link has been provided yet | Needs manual update if recorded |
| Test execution demo | Not available - no demo video link has been provided yet | Needs manual update if recorded |
| Report walkthrough | Not available - no demo video link has been provided yet | Needs manual update if recorded |

## How to Run Scripts

Read the full guide: [test_scripts/RUN_TESTS.md](test_scripts/RUN_TESTS.md).

Quick commands:

```bash
cd 23127543_HW02_AI_DomainTesting_100/test_scripts
npm install
npm run test:api:all
npm run test:ui:all
```

Windows PowerShell:

```powershell
cd 23127543_HW02_AI_DomainTesting_100/test_scripts
npm install
npm run test:api:all
npm run test:ui:all
```
