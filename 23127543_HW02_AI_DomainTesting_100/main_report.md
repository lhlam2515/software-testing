# HW02 - Domain Testing Main Report

## 1. Overview

This report organizes the HW02 Domain Testing assignment for the EShop system under test. The selected features cover profile management, web checkout, admin order management, and mobile checkout. The report package contains feature-level Domain Testing and Boundary Value Analysis tables, supporting scripts, evidence folders, a bug report, and AI usage documentation.

No source code in `eshop-sut/` is modified by this submission package.

## 2. Selected Features

| Pool | Feature ID | Feature Name | Report File |
|---|---|---|---|
| A | FR-04 | Personal Profile Management | [feature_A_FR04_profile.md](feature_A_FR04_profile.md) |
| B | FR-08 | Checkout | [feature_B_FR08_checkout.md](feature_B_FR08_checkout.md) |
| C | FR-18 | Admin Order Management | [feature_C_FR18_admin_order_management.md](feature_C_FR18_admin_order_management.md) |
| D | FR-20 | Mobile Checkout | [feature_D_mobile_selected.md](feature_D_mobile_selected.md) |

## 3. Testing Methodology

- Domain Testing: inputs and conditions are divided into valid and invalid domains such as authentication state, profile fields, cart contents, totals, coupons, order status, role, and mobile network state.
- Boundary Value Analysis: tests focus on values just below, on, and just above boundaries such as phone length, cart item count, quantity, coupon thresholds, total amount, and order state transitions.
- AI-assisted workflow: AI was used to draft and standardize test ideas, reports, scripts, and review checklists.
- Human review: source code, generated evidence, screenshots, and JSON logs must be reviewed manually before final verdicts are recorded.
- Evidence-based verdicts: a case must not be marked `Pass` or `Fail` unless there is clear evidence from screenshots, JSON logs, HTML logs, or manual execution notes.

## 4. Feature Reports

- [FR-04 Personal Profile Management](feature_A_FR04_profile.md)
- [FR-08 Checkout](feature_B_FR08_checkout.md)
- [FR-18 Admin Order Management](feature_C_FR18_admin_order_management.md)
- [FR-20 Mobile Checkout](feature_D_mobile_selected.md)

## 5. Test Execution Summary

| Feature | Domain Testing Cases | BVA Cases | Designed | Executed and Reviewed | Pass | Fail | Needs Review | To be executed |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| FR-04 Profile | 12 | 6 | 18 | 18 | 5 | 5 | 8 | 0 |
| FR-08 Checkout | 12 | 13 | 25 | 25 | 11 | 5 | 9 | 0 |
| FR-18 Admin Order Management | 12 | 6 | 18 | 14 | 2 | 12 | 0 | 4 |
| FR-20 Mobile Checkout | 12 | 6 | 18 | 0 | 0 | 0 | 0 | 18 |
| **Total** | **48** | **31** | **79** | **57** | **18** | **22** | **17** | **22** |

Generated API logs exist in `test_scripts/results/json/` and `test_scripts/results/html/`. JSON logs were used as the primary API source for this update. Reviewed screenshots under `evidence/screenshots/` were used as visual evidence for FR-04 profile UI cases and FR-08 checkout UI cases.

## 6. Bug Summary

The bug report is maintained in [bug_report.md](bug_report.md). Based on the generated result logs and reviewed screenshots, this update records 9 confirmed bug entries and 12 potential bugs requiring review. GitHub-Issue-ready text is prepared in [github_issue_bugs.txt](github_issue_bugs.txt).

## 7. AI Usage Summary

AI usage is documented in:

- [AI Audit Report](ai_audit_report.md)
- [AI Critique](ai_critique.md)

## 8. Supporting Materials

- Test scripts: [test_scripts/](test_scripts/)
- Evidence folders: [evidence/](evidence/) and [test_scripts/results/](test_scripts/results/)
- GitHub Issues: create only for confirmed bugs after evidence review.
- Demo videos: add links in [README.md](README.md) if available.
