# HW02 - Domain Testing on EShop

## 1. Introduction
This report presents Domain Testing and Boundary Value Analysis designs for the EShop SUT. The scope covers four selected features from four pools: personal profile management, checkout, admin order management, and one mobile feature selected after inspecting the repository. The test cases have not been executed yet, so `Actual Result` and `Verdict` remain `Not Executed`.

## 2. Selected Features
| Pool | Feature ID | Feature Name | Reason for Selection |
|---|---|---|---|
| A | FR-04 | Personal Profile Management | Contains personal-data domains, phone-number boundaries, and risks around email/role changes |
| B | FR-08 | Checkout | Critical financial flow that requires total calculation, cart validation, and backend recalculation |
| C | FR-18 | Admin Order Management | Depends on the FR-10 state machine and admin authorization |
| D | FR-20 | Mobile Checkout | Selected after inspecting the mobile app; includes cart/checkout flow and UI/API mismatch risks |

## 3. Testing Approach
Domain Testing is used to split inputs and conditions into valid and invalid domains, then design cases that cover access control, input data, state behavior, and security. Boundary Value Analysis focuses on values just below, on, and just above important boundaries such as phone length, cart item count, quantity, total amount, coupon threshold, and order final states.

## 4. Feature A Summary - FR-04
FR-04 includes 12 Domain Testing cases and 6 BVA cases. Key cases cover valid profile updates, 10/11-digit phone numbers, invalid phone prefixes, too-short/too-long phone numbers, email change attempts, role change attempts, updating another user's profile, and HTML/script input in the address. Confirmed bugs: 0. Potential bugs are listed in the bug report after code inspection.

## 5. Feature B Summary - FR-08
FR-08 includes 12 Domain Testing cases and 6 BVA cases. Key cases cover successful checkout, unauthenticated checkout, empty cart, single/multiple products, editing total through UI/API, manipulated `total_amount`, cart clearing after checkout, and quantity/price edge cases. Confirmed bugs: 0.

## 6. Feature C Summary - FR-18
FR-18 includes 12 Domain Testing cases and 6 BVA cases. Key cases cover admin viewing all orders, regular user/no-token rejection, valid transitions, invalid transitions, final states `delivered`/`canceled`, and safe display of shipping addresses containing HTML. Confirmed bugs: 0.

## 7. Feature D Summary - Selected Mobile Feature
Feature D is FR-20 Mobile Checkout. The report includes 12 Domain Testing cases and 6 BVA cases. Key cases cover successful mobile checkout, unauthenticated checkout, empty cart, one/multiple items, valid/invalid coupons, manipulated total, missing-item payloads, network errors, and cart clearing after success. Confirmed bugs: 0.

## 8. Test Summary
| Feature | DT Cases | BVA Cases | Total Cases | Executed | Passed | Failed | Not Executed | Bugs |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| FR-04 Profile | 12 | 6 | 18 | 0 | 0 | 0 | 18 | 0 confirmed |
| FR-08 Checkout | 12 | 6 | 18 | 0 | 0 | 0 | 18 | 0 confirmed |
| FR-18 Admin Order Management | 12 | 6 | 18 | 0 | 0 | 0 | 18 | 0 confirmed |
| FR-20 Mobile Checkout | 12 | 6 | 18 | 0 | 0 | 0 | 18 | 0 confirmed |
| **Total** | **48** | **24** | **72** | **0** | **0** | **0** | **72** | **0 confirmed** |

## 9. Bug Summary
No bugs have been confirmed because the tests have not been executed. `bug_report/bug_report.md` lists 5 potential bugs that need confirmation:
- FR-04: The profile API may allow role changes.
- FR-08/FR-20: The checkout backend may trust client-provided `total_amount`.
- FR-18: Admin APIs may be missing admin-role checks.
- FR-18: The state machine may allow `canceled -> delivered`.
- FR-20: Mobile checkout may send an incomplete cart payload.

## 10. AI Gap Analysis Summary
AI was useful for creating the initial report structure and test cases, but it may miss state-machine behavior, backend recalculation, authorization bypasses, HTML escaping, and UI/API mismatches. The tester added manual cases based on the SRS, API specification, and inspection of the mobile/backend code.

## 11. Conclusion
The HW02 documentation is ready for manual review, PDF export, and test execution. Before submission, the EShop SUT should be run, `Actual Result`/`Verdict` should be updated, screenshot/video evidence should be added, potential bugs should be confirmed or dismissed, and GitHub issues should be created for real defects.
