# HW02 - Domain Testing on EShop

## Student Information

- Student ID: 23127543
- Student Name: Vu Van Vu
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
| Main report | [main_report.md](main_report.md) | Completed |
| Feature A report | [feature_A_FR04_profile.md](feature_A_FR04_profile.md) | Completed with remaining review items |
| Feature B report | [feature_B_FR08_checkout.md](feature_B_FR08_checkout.md) | Completed with remaining review items |
| Feature C report | [feature_C_FR18_admin_order_management.md](feature_C_FR18_admin_order_management.md) | Completed |
| Feature D report | [feature_D_mobile_selected.md](feature_D_mobile_selected.md) | Completed with remaining review items |
| Bug report | [bug_report.md](bug_report.md) | Completed; issue links still need real GitHub URLs |
| AI Audit Report | [ai_audit_report.md](ai_audit_report.md) | Completed; exact timestamps need manual fill-in |
| AI Critique | [ai_critique.md](ai_critique.md) | Completed |
| Git commit log | [git_commit_log.txt](git_commit_log.txt) | Completed from `git log --oneline --decorate --all` |
| Test scripts | [test_scripts/](test_scripts/) | Available |
| Evidence | [evidence/](evidence/) and [test_scripts/results/](test_scripts/results/) | Available where executed; missing evidence remains marked |

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
| Features tested | 4 |
| Test cases designed | 79 |
| Test cases executed/reviewed | 78 |
| Pass | 36 |
| Fail | 33 |
| Needs Review | 9 |
| To be executed | 1 |
| Confirmed bugs | 16 |
| Potential bugs requiring review | 9 |

## Evidence Status

| Evidence Type | Folder | Status |
|---|---|---|
| API JSON logs | [test_scripts/results/json/](test_scripts/results/json/) | Used for this update |
| API HTML summaries | [test_scripts/results/html/](test_scripts/results/html/) | Available as supporting logs |
| UI screenshots | [test_scripts/results/screenshots/](test_scripts/results/screenshots/) | To be generated |
| Reviewed screenshots | [evidence/screenshots/](evidence/screenshots/) | Used for FR-04, FR-08, FR-18, and FR-20 evidence |
| GitHub issue evidence | [evidence/github_issues/](evidence/github_issues/) | To be added |
| GitHub issue text | [github_issue_bugs.txt](github_issue_bugs.txt) | Prepared |
| PDF exports | [pdf/](pdf/) | Needs manual export; current environment has no working PDF generator |

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
