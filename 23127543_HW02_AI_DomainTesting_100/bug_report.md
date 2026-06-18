# Bug Report

## 1. Overview

This report summarizes bugs found during Domain Testing and Boundary Value Analysis for the selected EShop features. The results are based on generated API/UI result logs under `test_scripts/results/`. Screenshot evidence is not included in this update pass and can be attached later to GitHub Issues if required.

## 2. Confirmed Bug Summary

| Bug ID | Feature | Related Test Case(s) | Severity | Status | GitHub Issue |
|---|---|---|---|---|---|
| BUG-FR04-01 | FR-04 - Personal Profile Management | FR04-DT-07 | Medium | Confirmed by result log | [To be added] |
| BUG-FR08-01 | FR-08 - Checkout | FR08-BVA-08 | Critical | Confirmed by result log | [To be added] |
| BUG-FR08-02 | FR-08 - Checkout | FR08-BVA-12 | High | Confirmed by result log | [To be added] |
| BUG-FR18-01 | FR-18 - Admin Order Management | FR18-DT-01 | Critical | Confirmed by result log | [To be added] |
| BUG-FR18-02 | FR-18 - Admin Order Management | FR18-DT-04, FR18-DT-05, FR18-DT-06, FR18-DT-07, FR18-DT-08, FR18-BVA-04 | Critical | Confirmed by result log | [To be added] |
| BUG-FR18-03 | FR-18 - Admin Order Management | FR18-DT-09, FR18-DT-10, FR18-DT-11, FR18-BVA-05, FR18-BVA-06 | High | Confirmed by result log | [To be added] |

## 3. Confirmed Bugs

### BUG-FR04-01 - [FR-04] Profile update with email field is rejected with Forbidden

**Feature:** FR-04 - Personal Profile Management  
**Related Test Case(s):** FR04-DT-07  
**Severity:** Medium  
**Status:** Confirmed by result log  

#### Description

The profile API returned Forbidden when the request included an email field. The test expected the system to ignore or reject the email field while preserving a clear profile-update behavior.

#### Steps to Reproduce

[FR04-DT-07] Send `PUT /api/users/me`, then call `GET /api/users/me`

#### Input Data

[FR04-DT-07] Body: `{"name":"A","phone":"9123456789","shipping_address":"X","email":"attacker@eshop.com"}`

#### Expected Result

[FR04-DT-07] Email remains unchanged; API ignores or rejects `email`

#### Actual Result

[FR04-DT-07] API returned HTTP 403 Forbidden when the update payload included an email field; follow-up profile checks also returned Forbidden.

#### Impact

Users or API clients may receive an unclear authorization failure instead of a controlled validation or ignore behavior for non-editable email.

#### Suggested Fix

Validate unsupported profile fields explicitly and return a clear response without changing protected fields.

#### Evidence

Result log available in `test_scripts/results/`.

#### GitHub Issue Link

[To be added]

### BUG-FR08-01 - [FR-08] Valid-token checkout boundary is rejected with Forbidden

**Feature:** FR-08 - Checkout  
**Related Test Case(s):** FR08-BVA-08  
**Severity:** Critical  
**Status:** Confirmed by result log  

#### Description

The checkout API returned Forbidden for a valid-token checkout boundary that was expected to create an order.

#### Steps to Reproduce

[FR08-BVA-08] Log in, copy token, and send checkout request through Apidog/API client

#### Input Data

[FR08-BVA-08] `POST /api/checkout` with positive `total_amount` and valid bearer token

#### Expected Result

[FR08-BVA-08] Backend accepts the authenticated checkout request and returns checkout success with an `orderId`

#### Actual Result

[FR08-BVA-08] API returned HTTP 403 Forbidden for the valid-token checkout boundary instead of creating an order.

#### Impact

Authenticated users may be blocked from completing checkout.

#### Suggested Fix

Review checkout authentication/authorization handling and ensure valid user tokens can create orders.

#### Evidence

Result log available in `test_scripts/results/`.

#### GitHub Issue Link

[To be added]

### BUG-FR08-02 - [FR-08] Coupon usage recording is rejected after coupon application

**Feature:** FR-08 - Checkout  
**Related Test Case(s):** FR08-BVA-12  
**Severity:** High  
**Status:** Confirmed by result log  

#### Description

The coupon apply step succeeded, but the coupon usage recording request returned Forbidden.

#### Steps to Reproduce

[FR08-BVA-12] Apply coupon, checkout successfully, call `POST /api/coupon-usage`, then repeat until the third apply attempt

#### Input Data

[FR08-BVA-12] Apply `VIP100` before first use, second use, and third use

#### Expected Result

[FR08-BVA-12] First and second uses are allowed; third use is rejected because usage count reaches the max

#### Actual Result

[FR08-BVA-12] Coupon apply step returned HTTP 200, but the coupon usage recording request returned HTTP 403 Forbidden.

#### Impact

Coupon usage limits may not be recorded correctly, which can affect discount enforcement.

#### Suggested Fix

Review coupon usage authorization and ensure successful checkout can record coupon usage for the authenticated user.

#### Evidence

Result log available in `test_scripts/results/`.

#### GitHub Issue Link

[To be added]

### BUG-FR18-01 - [FR-18] Admin token cannot view admin order list

**Feature:** FR-18 - Admin Order Management  
**Related Test Case(s):** FR18-DT-01  
**Severity:** Critical  
**Status:** Confirmed by result log  

#### Description

The admin order list endpoint returned Forbidden when accessed with an admin token.

#### Steps to Reproduce

[FR18-DT-01] 1. Log in as admin using `POST http://localhost:3000/api/login` with body `{"email":"admin@eshop.com","password":"Admin123!"}`.<br>2. Copy the admin JWT token.<br>3. Send `GET http://localhost:3000/api/admin/orders` with header `Authorization: Bearer <admin_token>`.<br>4. Alternatively, open `http://localhost:5174`, log in as admin, and click the Orders tab.<br>5. Observe whether all orders are displayed.

#### Input Data

[FR18-DT-01] Admin token: `<admin_token>`<br>Endpoint: `GET /api/admin/orders`<br>Headers: `Authorization: Bearer <admin_token>`

#### Expected Result

[FR18-DT-01] All orders are displayed with `id`, `user_name`, `total_amount`, `status`, `shipping_address`, and latest orders first.

#### Actual Result

[FR18-DT-01] API returned HTTP 403 Forbidden when the admin token attempted to view all orders.

#### Impact

Administrators may be unable to view orders, blocking order management.

#### Suggested Fix

Review admin login token generation, role claims, and admin order authorization checks.

#### Evidence

Result log available in `test_scripts/results/`.

#### GitHub Issue Link

[To be added]

### BUG-FR18-02 - [FR-18] Valid admin order status transitions are rejected

**Feature:** FR-18 - Admin Order Management  
**Related Test Case(s):** FR18-DT-04, FR18-DT-05, FR18-DT-06, FR18-DT-07, FR18-DT-08, FR18-BVA-04  
**Severity:** Critical  
**Status:** Confirmed by result log  

#### Description

Valid admin order status transitions returned Forbidden, and follow-up order status was unavailable.

#### Steps to Reproduce

[FR18-DT-04] 1. Create or find an order with status `pending`.<br>2. Log in as admin and copy token.<br>3. Send `PUT http://localhost:3000/api/admin/orders/<pending_order_id>/status`.<br>4. Use header `Authorization: Bearer <admin_token>`.<br>5. Use body `{"status":"confirmed"}`.<br>6. Send `GET http://localhost:3000/api/admin/orders` again.<br>7. Verify the order status is now `confirmed`.
[FR18-DT-05] 1. Use an order that is already `confirmed`, or first execute FR18-DT-04.<br>2. Send `PUT http://localhost:3000/api/admin/orders/<confirmed_order_id>/status` with body `{"status":"shipping"}`.<br>3. Call `GET http://localhost:3000/api/admin/orders`.<br>4. Verify status is `shipping`.
[FR18-DT-06] 1. Use an order that is already `shipping`, or first execute FR18-DT-04 then FR18-DT-05.<br>2. Send `PUT http://localhost:3000/api/admin/orders/<shipping_order_id>/status` with body `{"status":"delivered"}`.<br>3. Call `GET http://localhost:3000/api/admin/orders`.<br>4. Verify status is `delivered`.
[FR18-DT-07] 1. Create or find a `pending` order.<br>2. Send `PUT http://localhost:3000/api/admin/orders/<pending_order_id>/status` with body `{"status":"canceled"}`.<br>3. Call `GET http://localhost:3000/api/admin/orders`.<br>4. Verify status is `canceled`.
[FR18-DT-08] 1. Use an order that is already `confirmed`.<br>2. Send `PUT http://localhost:3000/api/admin/orders/<confirmed_order_id>/status` with body `{"status":"canceled"}`.<br>3. Call `GET http://localhost:3000/api/admin/orders`.<br>4. Verify status is `canceled`.
[FR18-BVA-04] 1. Create two pending orders.<br>2. Change both to `confirmed` using `PUT /api/admin/orders/<order_id>/status` with body `{"status":"confirmed"}`.<br>3. For the first order, update `confirmed -> shipping` with body `{"status":"shipping"}`.<br>4. For the second order, update `confirmed -> canceled` with body `{"status":"canceled"}`.<br>5. Verify both transitions are accepted separately.

#### Input Data

[FR18-DT-04] Admin token: `<admin_token>`<br>Order ID: `<pending_order_id>`<br>Endpoint: `PUT /api/admin/orders/<pending_order_id>/status`<br>Headers: `Authorization: Bearer <admin_token>`, `Content-Type: application/json`<br>Body: `{"status":"confirmed"}`
[FR18-DT-05] Admin token: `<admin_token>`<br>Order ID: `<confirmed_order_id>`<br>Endpoint: `PUT /api/admin/orders/<confirmed_order_id>/status`<br>Headers: `Authorization: Bearer <admin_token>`, `Content-Type: application/json`<br>Body: `{"status":"shipping"}`
[FR18-DT-06] Admin token: `<admin_token>`<br>Order ID: `<shipping_order_id>`<br>Endpoint: `PUT /api/admin/orders/<shipping_order_id>/status`<br>Headers: `Authorization: Bearer <admin_token>`, `Content-Type: application/json`<br>Body: `{"status":"delivered"}`
[FR18-DT-07] Admin token: `<admin_token>`<br>Order ID: `<pending_order_id>`<br>Endpoint: `PUT /api/admin/orders/<pending_order_id>/status`<br>Headers: `Authorization: Bearer <admin_token>`, `Content-Type: application/json`<br>Body: `{"status":"canceled"}`
[FR18-DT-08] Admin token: `<admin_token>`<br>Order ID: `<confirmed_order_id>`<br>Endpoint: `PUT /api/admin/orders/<confirmed_order_id>/status`<br>Headers: `Authorization: Bearer <admin_token>`, `Content-Type: application/json`<br>Body: `{"status":"canceled"}`
[FR18-BVA-04] Admin token: `<admin_token>`<br>First order ID: `<confirmed_order_id_1>`<br>Second order ID: `<confirmed_order_id_2>`<br>Endpoint: `PUT /api/admin/orders/<order_id>/status`<br>Bodies: `{"status":"shipping"}` and `{"status":"canceled"}`

#### Expected Result

[FR18-DT-04] Success response is returned, and the order status becomes `confirmed`.
[FR18-DT-05] Success response is returned, and the order status becomes `shipping`.
[FR18-DT-06] Success response is returned, and the order status becomes `delivered`.
[FR18-DT-07] Success response is returned, and the order status becomes `canceled`.
[FR18-DT-08] Success response is returned, and the order status becomes `canceled`.
[FR18-BVA-04] Both valid directions from `confirmed` are accepted separately.

#### Actual Result

[FR18-DT-04] API returned HTTP 403 Forbidden for the admin order status operation; follow-up order status was not available.
[FR18-DT-05] API returned HTTP 403 Forbidden for the admin order status operation; follow-up order status was not available.
[FR18-DT-06] API returned HTTP 403 Forbidden for the admin order status operation; follow-up order status was not available.
[FR18-DT-07] API returned HTTP 403 Forbidden for the admin order status operation; follow-up order status was not available.
[FR18-DT-08] API returned HTTP 403 Forbidden for the admin order status operation; follow-up order status was not available.
[FR18-BVA-04] API returned HTTP 403 Forbidden for the admin order status operation; follow-up order status was not available.

#### Impact

Administrators may be unable to process orders through normal workflow states.

#### Suggested Fix

Review authorization and state-transition handling for admin status update routes.

#### Evidence

Result log available in `test_scripts/results/`.

#### GitHub Issue Link

[To be added]

### BUG-FR18-03 - [FR-18] Admin transition validation cannot be verified because status updates return Forbidden

**Feature:** FR-18 - Admin Order Management  
**Related Test Case(s):** FR18-DT-09, FR18-DT-10, FR18-DT-11, FR18-BVA-05, FR18-BVA-06  
**Severity:** High  
**Status:** Confirmed by result log  

#### Description

Invalid or final-state transition checks returned Forbidden with no follow-up order status available, so the expected state-machine validation was not observable.

#### Steps to Reproduce

[FR18-DT-09] 1. Create or find a `pending` order.<br>2. Send `PUT http://localhost:3000/api/admin/orders/<pending_order_id>/status` with body `{"status":"delivered"}`.<br>3. Observe response status and body.<br>4. Call `GET http://localhost:3000/api/admin/orders`.<br>5. Verify the order status remains `pending`.
[FR18-DT-10] 1. Use an order that is already `delivered`, or execute `pending -> confirmed -> shipping -> delivered` first.<br>2. Send `PUT http://localhost:3000/api/admin/orders/<delivered_order_id>/status` with body `{"status":"canceled"}`.<br>3. Observe response status and body.<br>4. Call `GET http://localhost:3000/api/admin/orders`.<br>5. Verify status remains `delivered`.
[FR18-DT-11] 1. Use an order that is already `canceled`, or execute `pending -> canceled` first.<br>2. Send `PUT http://localhost:3000/api/admin/orders/<canceled_order_id>/status` with body `{"status":"delivered"}`.<br>3. Observe response status and body.<br>4. Call `GET http://localhost:3000/api/admin/orders`.<br>5. Verify status remains `canceled`.
[FR18-BVA-05] 1. Create a pending order.<br>2. Change `pending -> confirmed -> shipping -> delivered`.<br>3. Try `delivered -> canceled` with body `{"status":"canceled"}`.<br>4. Verify rejection and unchanged status by calling `GET /api/admin/orders`.
[FR18-BVA-06] 1. Create a pending order.<br>2. Change `pending -> canceled`.<br>3. Try `canceled -> delivered` with body `{"status":"delivered"}`.<br>4. Verify rejection and unchanged status by calling `GET /api/admin/orders`.

#### Input Data

[FR18-DT-09] Admin token: `<admin_token>`<br>Order ID: `<pending_order_id>`<br>Endpoint: `PUT /api/admin/orders/<pending_order_id>/status`<br>Headers: `Authorization: Bearer <admin_token>`, `Content-Type: application/json`<br>Body: `{"status":"delivered"}`
[FR18-DT-10] Admin token: `<admin_token>`<br>Order ID: `<delivered_order_id>`<br>Endpoint: `PUT /api/admin/orders/<delivered_order_id>/status`<br>Headers: `Authorization: Bearer <admin_token>`, `Content-Type: application/json`<br>Body: `{"status":"canceled"}`
[FR18-DT-11] Admin token: `<admin_token>`<br>Order ID: `<canceled_order_id>`<br>Endpoint: `PUT /api/admin/orders/<canceled_order_id>/status`<br>Headers: `Authorization: Bearer <admin_token>`, `Content-Type: application/json`<br>Body: `{"status":"delivered"}`
[FR18-BVA-05] Admin token: `<admin_token>`<br>Order ID: `<delivered_order_id>`<br>Endpoint: `PUT /api/admin/orders/<delivered_order_id>/status`<br>Body: `{"status":"canceled"}`
[FR18-BVA-06] Admin token: `<admin_token>`<br>Order ID: `<canceled_order_id>`<br>Endpoint: `PUT /api/admin/orders/<canceled_order_id>/status`<br>Body: `{"status":"delivered"}`

#### Expected Result

[FR18-DT-09] Rejected with clear error; status unchanged.
[FR18-DT-10] Rejected because `delivered` is a final state; status unchanged.
[FR18-DT-11] Rejected because `canceled` is a final state; status unchanged.
[FR18-BVA-05] Rejected, and status remains `delivered`.
[FR18-BVA-06] Rejected, and status remains `canceled`.

#### Actual Result

[FR18-DT-09] API returned HTTP 403 Forbidden for the admin order status operation; follow-up order status was not available.
[FR18-DT-10] API returned HTTP 403 Forbidden for the admin order status operation; follow-up order status was not available.
[FR18-DT-11] API returned HTTP 403 Forbidden for the admin order status operation; follow-up order status was not available.
[FR18-BVA-05] API returned HTTP 403 Forbidden for the admin order status operation; follow-up order status was not available.
[FR18-BVA-06] API returned HTTP 403 Forbidden for the admin order status operation; follow-up order status was not available.

#### Impact

The system may hide state-machine behavior behind authorization failure, preventing reliable validation of invalid transitions.

#### Suggested Fix

Ensure authorized admin requests reach state-machine validation and return clear transition errors when appropriate.

#### Evidence

Result log available in `test_scripts/results/`.

#### GitHub Issue Link

[To be added]

## 4. Potential Bugs Requiring Review

| Potential ID | Related Test Case | Feature File | Reason | Next Step |
|---|---|---|---|---|
| PBUG-FR04-DT-09 | FR04-DT-09 | feature_A_FR04_profile.md | Automated result log requires human review before final judgment. | Review the result log and, if needed, execute the case manually before confirming a bug. |
| PBUG-FR04-DT-10 | FR04-DT-10 | feature_A_FR04_profile.md | Automated result log requires human review before final judgment. | Review the result log and, if needed, execute the case manually before confirming a bug. |
| PBUG-FR04-DT-12 | FR04-DT-12 | feature_A_FR04_profile.md | Automated result log requires human review before final judgment. | Review the result log and, if needed, execute the case manually before confirming a bug. |
| PBUG-FR04-BVA-01 | FR04-BVA-01 | feature_A_FR04_profile.md | Automated result log requires human review before final judgment. | Review the result log and, if needed, execute the case manually before confirming a bug. |
| PBUG-FR04-BVA-02 | FR04-BVA-02 | feature_A_FR04_profile.md | Automated result log requires human review before final judgment. | Review the result log and, if needed, execute the case manually before confirming a bug. |
| PBUG-FR04-BVA-03 | FR04-BVA-03 | feature_A_FR04_profile.md | Automated result log requires human review before final judgment. | Review the result log and, if needed, execute the case manually before confirming a bug. |
| PBUG-FR04-BVA-04 | FR04-BVA-04 | feature_A_FR04_profile.md | Automated result log requires human review before final judgment. | Review the result log and, if needed, execute the case manually before confirming a bug. |
| PBUG-FR04-BVA-05 | FR04-BVA-05 | feature_A_FR04_profile.md | Automated result log requires human review before final judgment. | Review the result log and, if needed, execute the case manually before confirming a bug. |
| PBUG-FR08-DT-10 | FR08-DT-10 | feature_B_FR08_checkout.md | Automated result log requires human review before final judgment. | Review the result log and, if needed, execute the case manually before confirming a bug. |
| PBUG-FR08-BVA-09 | FR08-BVA-09 | feature_B_FR08_checkout.md | Automated result log requires human review before final judgment. | Review the result log and, if needed, execute the case manually before confirming a bug. |
| PBUG-FR08-BVA-10 | FR08-BVA-10 | feature_B_FR08_checkout.md | Automated result log requires human review before final judgment. | Review the result log and, if needed, execute the case manually before confirming a bug. |
| PBUG-FR08-BVA-11 | FR08-BVA-11 | feature_B_FR08_checkout.md | Automated result log requires human review before final judgment. | Review the result log and, if needed, execute the case manually before confirming a bug. |

## 5. GitHub Issue Preparation

All confirmed bugs are also prepared in `github_issue_bugs.txt` for easy copying into GitHub Issue pages.
