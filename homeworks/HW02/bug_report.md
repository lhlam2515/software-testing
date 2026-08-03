# Bug Report

## 1. Overview

This root report summarizes confirmed and review-required issues found from existing result files in `23127543_HW02_AI_DomainTesting_100/test_scripts/results/`. JSON result files were used as the primary source. HTML result files are supporting evidence. No screenshot evidence is claimed because no screenshot files were found.

## 2. Confirmed Bug Summary

| Bug ID | Feature | Related Test Case | Severity | Status | Evidence |
|---|---|---|---|---|---|
| BUG-FR04-01 | FR-04 - Personal Profile Management | FR04-DT-07 | Medium | Confirmed by test result | `23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/fr04_profile_api_results.json`, `23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/fr04_profile_api_results.html` |
| BUG-FR08-01 | FR-08 - Checkout | FR08-BVA-08 | Critical | Confirmed by test result | `23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/fr08_checkout_api_results.json`, `23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/fr08_checkout_api_results.html` |
| BUG-FR08-02 | FR-08 - Checkout | FR08-BVA-12 | High | Confirmed by test result | `23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/fr08_checkout_api_results.json`, `23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/fr08_checkout_api_results.html` |
| BUG-FR18-01 | FR-18 - Admin Order Management | FR18-DT-01 | Critical | Confirmed by test result | `23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/fr18_admin_order_api_results.json`, `23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/fr18_admin_order_api_results.html` |
| BUG-FR18-02 | FR-18 - Admin Order Management | FR18-DT-04, FR18-DT-05, FR18-DT-06, FR18-DT-07, FR18-DT-08, FR18-BVA-04 | Critical | Confirmed by test result | `23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/fr18_admin_order_api_results.json`, `23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/fr18_admin_order_api_results.html` |
| BUG-FR18-03 | FR-18 - Admin Order Management | FR18-DT-09, FR18-DT-10, FR18-DT-11, FR18-BVA-05, FR18-BVA-06 | High | Confirmed by test result | `23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/fr18_admin_order_api_results.json`, `23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/fr18_admin_order_api_results.html` |

## 3. Confirmed Bugs

### BUG-FR04-01 - Profile update with email field is rejected with Forbidden

**Feature:** FR-04 - Personal Profile Management  
**Related Test Case:** FR04-DT-07  
**Severity:** Medium  
**Status:** Confirmed by test result  

#### Description
The profile API returned HTTP 403 when the request included an `email` field.

#### Steps to Reproduce
1. Log in as a regular user.
2. Send `PUT /api/users/me` with the input data below.
3. Call `GET /api/users/me` before and after the update.

#### Input Data
`{"name":"FR04 Email Attempt","phone":"9123456789","shipping_address":"FR04 email attempt","email":"attacker@eshop.com"}`

#### Expected Result
Email remains unchanged; API ignores or rejects `email` with clear behavior.

#### Actual Result
API returned HTTP 403 Forbidden. Follow-up profile checks also returned Forbidden.

#### Impact
Clients receive an authorization failure instead of a clear validation result for a protected profile field.

#### Suggested Fix
Validate unsupported profile fields explicitly and return a clear response without changing protected fields.

#### Evidence
`23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/fr04_profile_api_results.json`, `23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/fr04_profile_api_results.html`

### BUG-FR08-01 - Valid-token checkout boundary is rejected with Forbidden

**Feature:** FR-08 - Checkout  
**Related Test Case:** FR08-BVA-08  
**Severity:** Critical  
**Status:** Confirmed by test result  

#### Description
Checkout with a valid bearer token returned HTTP 403 instead of creating an order.

#### Steps to Reproduce
1. Log in and copy a valid user token.
2. Send `POST /api/checkout` with a positive `total_amount`.
3. Observe the response.

#### Input Data
`{"total_amount":100000,"shipping_address":"FR08 valid token"}` with `Authorization: Bearer <token>`.

#### Expected Result
Backend accepts the authenticated checkout request and returns checkout success with an `orderId`.

#### Actual Result
API returned HTTP 403 Forbidden.

#### Impact
Authenticated users may be blocked from completing checkout.

#### Suggested Fix
Review checkout authentication/authorization handling and ensure valid user tokens can create orders.

#### Evidence
`23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/fr08_checkout_api_results.json`, `23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/fr08_checkout_api_results.html`

### BUG-FR08-02 - Coupon usage recording is rejected after coupon application

**Feature:** FR-08 - Checkout  
**Related Test Case:** FR08-BVA-12  
**Severity:** High  
**Status:** Confirmed by test result  

#### Description
The coupon apply step succeeded, but the coupon usage recording request returned HTTP 403.

#### Steps to Reproduce
1. Apply coupon `VIP100`.
2. After a successful coupon response, call `POST /api/coupon-usage`.
3. Observe the response.

#### Input Data
Apply coupon body: `{"code":"VIP100","total_amount":70000000,"user_id":2}`. Usage body: `{"coupon_id":3}` with authorization.

#### Expected Result
Coupon usage is recorded after successful checkout when `coupon_id` is available.

#### Actual Result
Coupon apply returned HTTP 200, but coupon usage recording returned HTTP 403 Forbidden.

#### Impact
Coupon usage limits may not be recorded correctly, which can affect discount enforcement.

#### Suggested Fix
Review coupon usage authorization and ensure successful checkout can record coupon usage for the authenticated user.

#### Evidence
`23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/fr08_checkout_api_results.json`, `23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/fr08_checkout_api_results.html`

### BUG-FR18-01 - Admin token cannot view admin order list

**Feature:** FR-18 - Admin Order Management  
**Related Test Case:** FR18-DT-01  
**Severity:** Critical  
**Status:** Confirmed by test result  

#### Description
The admin order list endpoint returned HTTP 403 when accessed with an admin token.

#### Steps to Reproduce
1. Log in as admin.
2. Send `GET /api/admin/orders` with `Authorization: Bearer <admin_token>`.
3. Observe the response.

#### Input Data
Admin token request to `GET /api/admin/orders`.

#### Expected Result
All orders are displayed with `id`, `user_name`, `total_amount`, `status`, `shipping_address`, and latest orders first.

#### Actual Result
API returned HTTP 403 Forbidden.

#### Impact
Administrators may be unable to view orders, blocking order management.

#### Suggested Fix
Review admin login token generation, role claims, and admin order authorization checks.

#### Evidence
`23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/fr18_admin_order_api_results.json`, `23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/fr18_admin_order_api_results.html`

### BUG-FR18-02 - Valid admin order status transitions are rejected

**Feature:** FR-18 - Admin Order Management  
**Related Test Case:** FR18-DT-04, FR18-DT-05, FR18-DT-06, FR18-DT-07, FR18-DT-08, FR18-BVA-04  
**Severity:** Critical  
**Status:** Confirmed by test result  

#### Description
Valid admin order status transitions returned HTTP 403, and follow-up order status was unavailable.

#### Steps to Reproduce
1. Prepare an order in the required starting status.
2. Send `PUT /api/admin/orders/<order_id>/status` with a valid target status.
3. Call `GET /api/admin/orders` to verify status.

#### Input Data
Bodies include `{"status":"confirmed"}`, `{"status":"shipping"}`, `{"status":"delivered"}`, and `{"status":"canceled"}` for valid transitions.

#### Expected Result
Valid transitions succeed and the order status changes accordingly.

#### Actual Result
Each tested valid admin status update returned HTTP 403 Forbidden, and follow-up order status was not available.

#### Impact
Administrators may be unable to process orders through normal workflow states.

#### Suggested Fix
Review authorization and state-transition handling for admin status update routes.

#### Evidence
`23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/fr18_admin_order_api_results.json`, `23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/fr18_admin_order_api_results.html`

### BUG-FR18-03 - Admin transition validation cannot be verified because status updates return Forbidden

**Feature:** FR-18 - Admin Order Management  
**Related Test Case:** FR18-DT-09, FR18-DT-10, FR18-DT-11, FR18-BVA-05, FR18-BVA-06  
**Severity:** High  
**Status:** Confirmed by test result  

#### Description
Invalid or final-state transition checks returned HTTP 403 with no follow-up order status available, so the expected state-machine validation was not observable.

#### Steps to Reproduce
1. Prepare an order in the required starting status.
2. Send an invalid or final-state transition request to `PUT /api/admin/orders/<order_id>/status`.
3. Call `GET /api/admin/orders` to verify status.

#### Input Data
Invalid/final transition bodies include `{"status":"delivered"}` from `pending` or `canceled`, and `{"status":"canceled"}` from `delivered`.

#### Expected Result
Invalid transitions are rejected with a clear transition error and the order status remains unchanged.

#### Actual Result
Each tested transition request returned HTTP 403 Forbidden, and follow-up order status was not available.

#### Impact
The system hides state-machine behavior behind authorization failure, preventing reliable validation of invalid transitions.

#### Suggested Fix
Ensure authorized admin requests reach state-machine validation and return clear transition errors when appropriate.

#### Evidence
`23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/fr18_admin_order_api_results.json`, `23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/fr18_admin_order_api_results.html`

## 4. Potential Bugs Requiring Review

| Potential ID | Related Test Case | Feature | Reason | Next Step |
|---|---|---|---|---|
| PBUG-FR04-DT-09 | FR04-DT-09 | FR-04 | HTTP 403 was returned, but ownership impact and follow-up profile state are unclear. | Review JSON/HTML logs and rerun manually if needed. |
| PBUG-FR04-DT-10 | FR04-DT-10 | FR-04 | API returned HTTP 403; UI rendering safety still requires visual/security review. | Execute UI review with evidence. |
| PBUG-FR04-DT-12 | FR04-DT-12 | FR-04 | API returned HTTP 403; long-address storage behavior remains unclear. | Review logs and rerun manually if needed. |
| PBUG-FR04-BVA-01 | FR04-BVA-01 | FR-04 | Boundary result returned HTTP 403 and needs validation against expected phone behavior. | Review logs and rerun manually if needed. |
| PBUG-FR04-BVA-02 | FR04-BVA-02 | FR-04 | Boundary result returned HTTP 403 and needs validation against expected phone behavior. | Review logs and rerun manually if needed. |
| PBUG-FR04-BVA-03 | FR04-BVA-03 | FR-04 | Boundary result returned HTTP 403 and needs validation against expected phone behavior. | Review logs and rerun manually if needed. |
| PBUG-FR04-BVA-04 | FR04-BVA-04 | FR-04 | Boundary result returned HTTP 403 and needs validation against expected phone behavior. | Review logs and rerun manually if needed. |
| PBUG-FR04-BVA-05 | FR04-BVA-05 | FR-04 | Boundary result returned HTTP 403 and needs validation against expected phone behavior. | Review logs and rerun manually if needed. |
| PBUG-FR08-DT-10 | FR08-DT-10 | FR-08 | Missing shipping address returned HTTP 403; intended API behavior needs review. | Review requirement and rerun manually if needed. |
| PBUG-FR08-BVA-09 | FR08-BVA-09 | FR-08 | Coupon below-minimum result needs threshold review. | Review coupon requirement and implementation. |
| PBUG-FR08-BVA-10 | FR08-BVA-10 | FR-08 | Coupon exactly at minimum returned HTTP 400; inclusive/exclusive threshold needs review. | Review coupon requirement and implementation. |
| PBUG-FR08-BVA-11 | FR08-BVA-11 | FR-08 | Coupon above minimum returned HTTP 200, but discount amount requires review. | Review calculation and currency formatting. |
