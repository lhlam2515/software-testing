# HW02 - Domain Testing on EShop

## 1. Introduction

This report presents Domain Testing and Boundary Value Analysis test cases for the EShop SUT. The test cases were regenerated after inspecting the source code in `eshop-sut/`, especially `backend/server.js`, `backend/database.js`, the API specification, web frontend, admin frontend, and mobile app.

No application source code in `eshop-sut/` was modified. Only files inside `23127543_HW02_AI_DomainTesting_100/` were updated.

## 2. Selected Features

| Pool | Feature ID | Feature Name | Reason for Selection |
|---|---|---|---|
| A | FR-04 | Personal Profile Management | Includes phone validation, token handling, email/role security, and field-name mismatch |
| B | FR-08 | Checkout | Critical financial flow with risk of trusting client-provided `total_amount` |
| C | FR-18 | Admin Order Management | Depends on role checks and the FR-10 state machine |
| D | FR-20 | Mobile Checkout | Mobile flow includes cart/checkout, coupon, network, and local-state/API mismatch risks |

## 3. Testing Approach

Domain Testing is used to divide inputs and conditions into valid and invalid domains: token, role, cart, quantity, money, coupon, status, and UI rendering. Boundary Value Analysis focuses on 0/1/2 cart items, phone length 9/10/11/12 digits, total `sum-1/sum/sum+1`, coupon `min-1/min/min+1`, and state boundaries.

Results are marked Passed/Failed only when screenshot/evidence exists. Cases without evidence keep `Actual Result = Not Executed` and `Verdict = Not Executed`.

## 4. Feature Summaries

| Feature | Summary |
|---|---|
| FR-04 Profile | Tests use actual route `GET/PUT /api/users/me` and body fields `name`, `phone`, `shipping_address`; added cases for `role`, `email`, invalid token, HTML/script, and long address. |
| FR-08 Checkout | Tests use `POST /api/checkout` and `POST /api/apply-coupon`; clearly note that web UI has `editableTotal`, backend trusts `total_amount`, and web does not call `clearCart()`. |
| FR-18 Admin Order | Tests use `GET /api/admin/orders` and `PUT /api/admin/orders/:id/status`; covers role, no token, valid/invalid transitions, final states, and address XSS. |
| FR-20 Mobile Checkout | Tests are based on `frontend-mobile/App.js`; covers login state, cart state, coupon, network, cart clearing, and missing payload item when `cart.length > 1`. |

## 5. Test Summary

| Feature | Domain Testing | BVA | Total | Executed | Passed | Failed | Not Executed | Needs Review |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| FR-04 Profile | 12 | 6 | 18 | 18 | 7 | 7 | 0 | 4 |
| FR-08 Checkout | 12 | 13 | 25 | 8 | 4 | 2 | 17 | 2 |
| FR-18 Admin Order Management | 12 | 6 | 18 | 0 | 0 | 0 | 18 | 0 |
| FR-20 Mobile Checkout | 12 | 6 | 18 | 0 | 0 | 0 | 18 | 0 |
| **Total** | **48** | **31** | **79** | **26** | **11** | **9** | **53** | **6** |

## 6. Bug Summary

Confirmed bug:

| Bug ID | Feature | Title | Related Evidence |
|---|---|---|---|
| BUG-FR04-01 | FR-04 | Profile phone validation does not follow SRS | FR04-DT-01, FR04-DT-03, FR04-DT-04, FR04-DT-05 screenshots |
| BUG-FR04-BVA-02 | FR-04 | 10-digit phone starting with 0 is rejected | FR04-BVA-02 screenshot |
| BUG-FR04-BVA-03 | FR-04 | 11-digit phone starting with 0 is rejected | FR04-BVA-03 screenshot |
| BUG-FR04-BVA-05 | FR-04 | Phone not starting with 0 is accepted | FR04-BVA-05 screenshot |
| BUG-FR08-01 | FR-08 | Backend checkout trusts client-provided `total_amount` | FR08-DT-08 screenshot |
| BUG-FR08-02 | FR-08 | Checkout API accepts zero and negative totals | FR08-DT-09 screenshots |

Potential bug candidates needing execution:

| Candidate | Feature | Related Test Cases |
|---|---|---|
| Backend profile API may allow role escalation | FR-04 | FR04-DT-08 |
| Mobile profile may send `shippingAddress` instead of `shipping_address` | FR-04/FR-20 | FR04-DT-12, FR20 manual check |
| Web checkout may not clear cart after success | FR-08 | FR08-DT-07 |
| Admin APIs may not check `role=admin` | FR-18 | FR18-DT-02 |
| Admin state machine may allow `canceled -> delivered` | FR-18 | FR18-DT-11 |
| Admin UI may render shipping address HTML | FR-18 | FR18-DT-12 |
| Mobile checkout may send incomplete `items` | FR-20 | FR20-DT-06 |

## 7. AI Gap Analysis Summary

AI was useful for creating the initial report structure, test tables, and coverage ideas. However, without reading source code, AI may generate cases with wrong routes/bodies or expected behavior based on the SRS rather than implementation. Source-code inspection corrected endpoints, request bodies, phone validation, role/auth checks, state transitions, and mobile local-state/API mismatch.

## 8. Conclusion

The report is ready for manual testing and PDF export. Remaining work: run the SUT, execute cases without evidence, update Actual Result/Verdict, add screenshots/videos, and create GitHub Issues for confirmed bugs.
