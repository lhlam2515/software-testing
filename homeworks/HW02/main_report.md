# HW02 - Domain Testing Main Report

## Assignment Overview

This report is the main index for the HW02 Domain Testing submission on the EShop system. It collects the selected feature reports, Domain Testing and Boundary Value Analysis summaries, execution status, bug evidence, AI usage documentation, and supporting materials required by HW02 Section 14.

No files in the SUT folder were intentionally modified for this submission package.

## Selected Features

| Pool | Feature ID | Feature Name | Report File |
|---|---|---|---|
| A | FR-04 | Personal Profile Management | [feature_A_FR04_profile.md](feature_A_FR04_profile.md) |
| B | FR-08 | Checkout | [feature_B_FR08_checkout.md](feature_B_FR08_checkout.md) |
| C | FR-18 | Admin Order Management | [feature_C_FR18_admin_order_management.md](feature_C_FR18_admin_order_management.md) |
| D | FR-20 | Mobile Checkout | [feature_D_mobile_selected.md](feature_D_mobile_selected.md) |

## Feature Report Links

- [FR-04 Personal Profile Management](feature_A_FR04_profile.md)
- [FR-08 Checkout](feature_B_FR08_checkout.md)
- [FR-18 Admin Order Management](feature_C_FR18_admin_order_management.md)
- [FR-20 Mobile Checkout](feature_D_mobile_selected.md)

## Domain Testing Summary

| Feature | Domain Testing Cases | Main Domains Covered |
|---|---:|---|
| FR-04 | 12 | Authentication, editable profile fields, protected fields, phone rules, address values |
| FR-08 | 12 | Login state, cart state, quantity, checkout total, coupon use, shipping address |
| FR-18 | 12 | Admin role, user role, token state, order status transitions, unsafe address rendering |
| FR-20 | 12 | Mobile login state, cart state, payload contents, coupon use, network failure |
| **Total** | **48** |  |

## BVA Summary

| Feature | BVA Cases | Boundary Variables |
|---|---:|---|
| FR-04 | 6 | Phone length, first digit, name length |
| FR-08 | 13 | Cart size, quantity, coupon threshold, token state, cart state after checkout |
| FR-18 | 6 | Order count, status values, transition boundaries |
| FR-20 | 6 | Cart size, quantity, coupon threshold, total amount around expected sum |
| **Total** | **31** |  |

## Execution Summary

| Feature | Designed | Executed / Reviewed | Pass | Fail | Needs Review | To be executed |
|---|---:|---:|---:|---:|---:|---:|
| FR-04 Profile | 18 | 18 | 8 | 8 | 2 | 0 |
| FR-08 Checkout | 25 | 25 | 14 | 7 | 4 | 0 |
| FR-18 Admin Order Management | 18 | 18 | 5 | 13 | 0 | 0 |
| FR-20 Mobile Checkout | 18 | 17 | 9 | 5 | 3 | 1 |
| **Total** | **79** | **78** | **36** | **33** | **9** | **1** |

Generated API logs are stored in [test_scripts/results/json/](test_scripts/results/json/) and [test_scripts/results/html/](test_scripts/results/html/). Reviewed screenshots are stored under [evidence/screenshots/](evidence/screenshots/).

## Bug Summary

The full bug report is maintained in [bug_report.md](bug_report.md). It records 16 confirmed bugs and 9 potential bugs requiring review. Six confirmed bugs have GitHub Issues created and linked in [github_issue_bugs.txt](github_issue_bugs.txt) and [github_issue_summary.md](github_issue_summary.md).

GitHub Issue screenshot evidence is stored under [evidence/github_issues/](evidence/github_issues/). Screenshots are available for the six created GitHub issues. Other confirmed bugs still need GitHub Issues and screenshots if they are submitted as separate issues.

## AI Usage Summary

AI was used to draft and standardize Domain Testing cases, BVA cases, helper scripts, evidence review notes, and report structure. Human review was used to decide final verdicts and to keep missing evidence clearly marked.

- [AI Critique](ai_critique.md)
- [AI Audit Report](ai_audit_report.md)

## Supporting Materials

- Bug report: [bug_report.md](bug_report.md)
- AI critique: [ai_critique.md](ai_critique.md)
- AI audit report: [ai_audit_report.md](ai_audit_report.md)
- Git commit log: [git_commit_log.txt](git_commit_log.txt)
- GitHub issue summary: [github_issue_summary.md](github_issue_summary.md)
- Test scripts: [test_scripts/](test_scripts/)
- Evidence folders: [evidence/](evidence/)
- Agent skills: [agent_skill/](agent_skill/)
- PDF folder: [pdf/](pdf/)

## GitHub Issue Screenshot Note

Screenshots of the GitHub Issues page and each confirmed bug issue page should be stored under [evidence/github_issues/](evidence/github_issues/). The current folder contains screenshots for issues #7-#12. Missing screenshots are marked in [bug_report.md](bug_report.md) and [github_issue_summary.md](github_issue_summary.md).
