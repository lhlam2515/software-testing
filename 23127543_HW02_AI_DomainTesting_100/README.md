# HW02 - Domain Testing on EShop

## Student Information

- Student ID: 23127543
- Student Name: Vũ Văn Vũ
- Class: 23KTPM1
- Repository/SUT: EShop

## Selected Features

| Pool | Feature ID | Feature Name | Report File |
|---|---|---|---|
| A | FR-04 | Personal Profile Management | [feature_A_FR04_profile.md](feature_A_FR04_profile.md) |
| B | FR-08 | Checkout | [feature_B_FR08_checkout.md](feature_B_FR08_checkout.md) |
| C | FR-18 | Admin Order Management | [feature_C_FR18_admin_order_management.md](feature_C_FR18_admin_order_management.md) |
| D | FR-20 | Mobile Checkout | [feature_D_mobile_selected.md](feature_D_mobile_selected.md) |

## Required Deliverables

| Deliverable | File/Folder | Status |
|---|---|---|
| Main report | [main_report.md](main_report.md) | Completed / To update after execution |
| Feature A report | [feature_A_FR04_profile.md](feature_A_FR04_profile.md) | Completed / To execute |
| Feature B report | [feature_B_FR08_checkout.md](feature_B_FR08_checkout.md) | Completed / To execute |
| Feature C report | [feature_C_FR18_admin_order_management.md](feature_C_FR18_admin_order_management.md) | Completed / To execute |
| Feature D report | [feature_D_mobile_selected.md](feature_D_mobile_selected.md) | Completed / To execute |
| Bug report | [bug_report.md](bug_report.md) | To update after confirmed bugs |
| AI Audit Report | [ai_audit_report.md](ai_audit_report.md) | To update with exact prompts and times |
| AI Critique | [ai_critique.md](ai_critique.md) | Completed draft |
| Git commit log | [git_commit_log.txt](git_commit_log.txt) | To update before submission |
| Test scripts | [test_scripts/](test_scripts/) | Available |
| Evidence | [evidence/](evidence/) and [test_scripts/results/](test_scripts/results/) | To be generated or reviewed |

## Self-Assessment

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---:|---:|
| 1 | Feature A - Domain + Boundary | 25 | 25 |
| 2 | Feature B - Domain + Boundary | 25 | 25 |
| 3 | Feature C - Domain + Boundary | 25 | 25 |
| 4 | Feature D - Mobile, Domain + Boundary | 15 | 15 |
| 5 | Agent Skills | 10 | 10 |
|  | Total | 100 | 100 |

## Test Summary

The counts below are computed from the updated feature report tables after reading the generated result logs under `test_scripts/results/` and reviewed screenshots under `evidence/screenshots/`.

| Metric | Count |
|---|---:|
| Features tested | 3 |
| Test cases designed | 79 |
| Test cases executed | 57 |
| Passed | 18 |
| Failed | 22 |
| Needs Review | 17 |
| To be executed | 22 |
| Confirmed bugs | 9 |
| Potential bugs requiring review | 12 |

## Evidence Status

| Evidence Type | Folder | Status |
|---|---|---|
| API JSON logs | [test_scripts/results/json/](test_scripts/results/json/) | Used for this update |
| API HTML summaries | [test_scripts/results/html/](test_scripts/results/html/) | Available as supporting logs |
| UI screenshots | [test_scripts/results/screenshots/](test_scripts/results/screenshots/) | To be generated |
| Reviewed screenshots | [evidence/screenshots/](evidence/screenshots/) | Used for FR-04 and FR-08 UI evidence |
| GitHub issue evidence | [evidence/github_issues/](evidence/github_issues/) | To be added |
| GitHub issue text | [github_issue_bugs.txt](github_issue_bugs.txt) | Prepared |

## Demo Videos

- Agent Skill demo: [Fill in]
- Test execution demo: [Fill in]
- Report walkthrough: [Fill in]

## How to Run Scripts

Read the full guide: [test_scripts/RUN_TESTS.md](test_scripts/RUN_TESTS.md).

Quick commands:

```bash
cd 23127543_HW02_AI_DomainTesting_100/test_scripts
npm install
cp .env.example .env
npm run test:api:all
npm run test:ui:all
```

Windows PowerShell:

```powershell
cd 23127543_HW02_AI_DomainTesting_100/test_scripts
npm install
Copy-Item .env.example .env
npm run test:api:all
npm run test:ui:all
```
