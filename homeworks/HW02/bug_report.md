# Bug Report

## 1. Overview

This report summarizes confirmed and review-required issues found from the existing result files under `test_scripts/results/` and reviewed screenshots under `evidence/screenshots/`. JSON files were used as the primary API evidence source, HTML files are listed as supporting evidence, and screenshots are used only where they visibly prove the observed UI result.

GitHub Issue links are available for six confirmed bugs. Other confirmed bugs remain documented here, but no GitHub Issue links were provided for them.

## GitHub Issue Screenshot Evidence

Screenshots of the GitHub Issues page and each confirmed bug issue page should be stored under:

`evidence/github_issues/`

| Bug ID | GitHub Issue | Screenshot Evidence |
|---|---|---|
| BUG-FR04-01 | https://github.com/lhlam2515/software-testing/issues/7 | [evidence/github_issues/1.png](evidence/github_issues/1.png) |
| BUG-FR08-01 | https://github.com/lhlam2515/software-testing/issues/8 | [evidence/github_issues/2.png](evidence/github_issues/2.png) |
| BUG-FR08-02 | https://github.com/lhlam2515/software-testing/issues/9 | [evidence/github_issues/3.png](evidence/github_issues/3.png) |
| BUG-FR18-01 | https://github.com/lhlam2515/software-testing/issues/10 | [evidence/github_issues/4.png](evidence/github_issues/4.png) |
| BUG-FR18-02 | https://github.com/lhlam2515/software-testing/issues/11 | [evidence/github_issues/5.png](evidence/github_issues/5.png) |
| BUG-FR18-03 | https://github.com/lhlam2515/software-testing/issues/12 | [evidence/github_issues/6.png](evidence/github_issues/6.png) |

## 2. Confirmed Bug Summary

| Bug ID | Feature | Related Test Case | Severity | Status | Evidence |
|---|---|---|---|---|---|
| BUG-FR04-01 | FR-04 - Personal Profile Management | FR04-DT-07 | Medium | Confirmed by test result | `test_scripts/results/json/fr04_profile_api_results.json`, `test_scripts/results/html/fr04_profile_api_results.html` |
| BUG-FR04-02 | FR-04 - Personal Profile Management | FR04-DT-01, FR04-DT-03, FR04-DT-04, FR04-DT-05 | High | Confirmed by screenshot evidence | [FR04-DT-01 screenshot](evidence/screenshots/FR04-DT-01.png), [FR04-DT-03 screenshot](evidence/screenshots/FR04-DT-03.png), [FR04-DT-04 screenshot](evidence/screenshots/FR04-DT-04.png), [FR04-DT-05 screenshot](evidence/screenshots/FR04-DT-05.png) |
| BUG-FR04-03 | FR-04 - Personal Profile Management | FR04-BVA-01, FR04-BVA-04, FR04-BVA-05 | High | Confirmed by source review | [JSON log](test_scripts/results/json/fr04_profile_api_results.json), [HTML log](test_scripts/results/html/fr04_profile_api_results.html) |
| BUG-FR08-01 | FR-08 - Checkout | FR08-BVA-08 | Critical | Confirmed by test result | `test_scripts/results/json/fr08_checkout_api_results.json`, `test_scripts/results/html/fr08_checkout_api_results.html` |
| BUG-FR08-02 | FR-08 - Checkout | FR08-BVA-12 | High | Confirmed by test result | `test_scripts/results/json/fr08_checkout_api_results.json`, `test_scripts/results/html/fr08_checkout_api_results.html` |
| BUG-FR08-03 | FR-08 - Checkout | FR08-DT-07, FR08-BVA-13 | High | Confirmed by screenshot evidence | [FR08-DT-07 screenshot](evidence/screenshots/FR08-DT-07.png), [FR08-DT-07 second screenshot](evidence/screenshots/FR08-DT-07-2.png), [FR08-BVA-13 screenshot](evidence/screenshots/FR08-BVA-13.png), [FR08-BVA-13 second screenshot](evidence/screenshots/FR08-BVA-13-2.png) |
| BUG-FR08-04 | FR-08 - Checkout | FR08-BVA-04 | High | Confirmed by screenshot evidence | [FR08-BVA-04 screenshot](evidence/screenshots/FR08-BVA-04.png) |
| BUG-FR08-05 | FR-08 - Checkout | FR08-BVA-10 | Medium | Confirmed by test result and source review | [JSON log](test_scripts/results/json/fr08_checkout_api_results.json), [HTML log](test_scripts/results/html/fr08_checkout_api_results.html) |
| BUG-FR08-06 | FR-08 - Checkout | FR08-BVA-11 | High | Confirmed by test result and source review | [JSON log](test_scripts/results/json/fr08_checkout_api_results.json), [HTML log](test_scripts/results/html/fr08_checkout_api_results.html) |
| BUG-FR18-01 | FR-18 - Admin Order Management | FR18-DT-01 | Critical | Confirmed by test result | `test_scripts/results/json/fr18_admin_order_api_results.json`, `test_scripts/results/html/fr18_admin_order_api_results.html` |
| BUG-FR18-02 | FR-18 - Admin Order Management | FR18-DT-04, FR18-DT-05, FR18-DT-06, FR18-DT-07, FR18-DT-08, FR18-BVA-04 | Critical | Confirmed by test result | `test_scripts/results/json/fr18_admin_order_api_results.json`, `test_scripts/results/html/fr18_admin_order_api_results.html` |
| BUG-FR18-03 | FR-18 - Admin Order Management | FR18-DT-09, FR18-DT-10, FR18-DT-11, FR18-BVA-05, FR18-BVA-06 | High | Confirmed by test result | `test_scripts/results/json/fr18_admin_order_api_results.json`, `test_scripts/results/html/fr18_admin_order_api_results.html` |
| BUG-FR18-04 | FR-18 - Admin Order Management | FR18-DT-12 | Critical | Confirmed by screenshot evidence | [FR18-DT-12 checkout screenshot](evidence/screenshots/FR18-DT-12.png), [FR18-DT-12 admin UI screenshot](evidence/screenshots/FR18-DT-12-2.png) |
| BUG-FR20-01 | FR-20 - Mobile Checkout | FR20-DT-06, FR20-BVA-03 | High | Confirmed by source review; execution evidence still recommended | Source review note in feature report; GitHub Issue not provided |
| BUG-FR20-02 | FR-20 - Mobile Checkout | FR20-DT-07, FR20-BVA-06 | Critical | Confirmed by source review; execution evidence still recommended | Source review note in feature report; GitHub Issue not provided |
| BUG-FR20-03 | FR-20 - Mobile Checkout | FR20-DT-08 | High | Confirmed by screenshot evidence | [FR20-DT-08 screenshot](evidence/screenshots/FR20-DT-08.jpg) |

## 3. Confirmed Bugs

### BUG-FR04-01 - Profile update with email field is rejected with Forbidden

**Feature:** FR-04 - Personal Profile Management  
**Related Test Case:** FR04-DT-07  
**Severity:** Medium  
**Status:** Confirmed by test result  
**GitHub Issue:** https://github.com/lhlam2515/software-testing/issues/7  

#### Description

The profile API returned Forbidden when the request included an email field. The expected behavior was to ignore or clearly reject the protected email field while preserving controlled profile-update behavior.

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

`test_scripts/results/json/fr04_profile_api_results.json`, `test_scripts/results/html/fr04_profile_api_results.html`

### BUG-FR04-02 - Web profile phone validation conflicts with SRS

**Feature:** FR-04 - Personal Profile Management  
**Related Test Case:** FR04-DT-01, FR04-DT-03, FR04-DT-04, FR04-DT-05  
**Severity:** High  
**Status:** Confirmed by screenshot evidence  

#### Description

The web profile UI rejects phone numbers that are valid according to the SRS and accepts a phone number that should be invalid according to the SRS. The SRS expects phone numbers to start with `0` and contain 10-11 digits.

#### Steps to Reproduce

1. Log in as `test@eshop.com`.
2. Open the Profile page.
3. Enter the test phone number from the related test case.
4. Click Update.
5. Observe the browser alert.

#### Input Data

`0912345678`, `09123456789`, and `9123456789`.

#### Expected Result

`0912345678` and `09123456789` are accepted. `9123456789` is rejected because it does not start with `0`.

#### Actual Result

The UI displayed an invalid-phone alert for `0912345678` and `09123456789`, but displayed an update-success alert for `9123456789`.

#### Impact

Users with SRS-valid phone numbers may be blocked from updating their profile, while invalid phone data can be accepted.

#### Suggested Fix

Align the web profile phone validation rule with the SRS: require a leading `0` and 10-11 digits, and apply the same validation consistently in the backend.

#### Evidence

[FR04-DT-01 screenshot](evidence/screenshots/FR04-DT-01.png), [FR04-DT-03 screenshot](evidence/screenshots/FR04-DT-03.png), [FR04-DT-04 screenshot](evidence/screenshots/FR04-DT-04.png), [FR04-DT-05 screenshot](evidence/screenshots/FR04-DT-05.png)

### BUG-FR04-03 - Backend profile update does not validate phone boundaries

**Feature:** FR-04 - Personal Profile Management  
**Related Test Case:** FR04-BVA-01, FR04-BVA-04, FR04-BVA-05  
**Severity:** High  
**Status:** Confirmed by source review  

#### Description

The backend profile update route accepts the `phone` field without checking the SRS rule that phone numbers must start with `0` and contain 10-11 digits.

#### Steps to Reproduce

1. Log in as a regular user and use a valid bearer token.
2. Send `PUT /api/users/me` with a phone number below the minimum, above the maximum, or not starting with `0`.
3. Observe that the route has no validation before updating the user row.

#### Input Data

`012345678`, `012345678901`, and `1123456789`.

#### Expected Result

Invalid phone boundaries are rejected.

#### Actual Result

Source review shows `PUT /api/users/me` directly updates `phone` with no format or length validation. The existing API log returned HTTP 403 before route behavior because authentication failed, so it is supporting context rather than proof of the validation path.

#### Impact

Invalid phone numbers can be stored through the backend API even when the UI blocks some invalid values.

#### Suggested Fix

Validate phone format on the backend using the SRS rule and return a clear validation error for invalid values.

#### Evidence

[JSON log](test_scripts/results/json/fr04_profile_api_results.json), [HTML log](test_scripts/results/html/fr04_profile_api_results.html)

### BUG-FR08-01 - Valid-token checkout boundary is rejected with Forbidden

**Feature:** FR-08 - Checkout  
**Related Test Case:** FR08-BVA-08  
**Severity:** Critical  
**Status:** Confirmed by test result  
**GitHub Issue:** https://github.com/lhlam2515/software-testing/issues/8  

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

`test_scripts/results/json/fr08_checkout_api_results.json`, `test_scripts/results/html/fr08_checkout_api_results.html`

### BUG-FR08-02 - Coupon usage recording is rejected after coupon application

**Feature:** FR-08 - Checkout  
**Related Test Case:** FR08-BVA-12  
**Severity:** High  
**Status:** Confirmed by test result  
**GitHub Issue:** https://github.com/lhlam2515/software-testing/issues/9  

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

`test_scripts/results/json/fr08_checkout_api_results.json`, `test_scripts/results/html/fr08_checkout_api_results.html`

### BUG-FR08-03 - Cart is not cleared after successful checkout

**Feature:** FR-08 - Checkout  
**Related Test Case:** FR08-DT-07, FR08-BVA-13  
**Severity:** High  
**Status:** Confirmed by screenshot evidence  

#### Description

The web checkout flow displayed a successful checkout page, but the cart still contained items after returning to the Cart page.

#### Steps to Reproduce

1. Log in as a regular user.
2. Add one or more products to the cart.
3. Complete checkout successfully.
4. Return to the Cart page.

#### Input Data

Cart containing products such as iPhone 15 Pro Max and Keychron Q1 keyboard.

#### Expected Result

Cart is cleared after successful checkout, and repeat checkout is blocked until a new item is added.

#### Actual Result

Checkout success was shown, but returning to Cart still displayed items and the checkout button.

#### Impact

Users may accidentally submit duplicate orders because the cart remains populated after a successful checkout.

#### Suggested Fix

Call the frontend cart-clearing logic after successful checkout and verify the cart state before allowing another checkout.

#### Evidence

[FR08-DT-07 screenshot](evidence/screenshots/FR08-DT-07.png), [FR08-DT-07 second screenshot](evidence/screenshots/FR08-DT-07-2.png), [FR08-BVA-13 screenshot](evidence/screenshots/FR08-BVA-13.png), [FR08-BVA-13 second screenshot](evidence/screenshots/FR08-BVA-13-2.png)

### BUG-FR08-04 - Quantity zero is accepted into cart and checkout remains available

**Feature:** FR-08 - Checkout  
**Related Test Case:** FR08-BVA-04  
**Severity:** High  
**Status:** Confirmed by screenshot evidence  

#### Description

The cart displayed an item with quantity `0`, and the checkout button remained available.

#### Steps to Reproduce

1. Log in as a regular user.
2. Open a product detail page.
3. Enter quantity `0`.
4. Add the item to cart.
5. Open the Cart page.

#### Input Data

Quantity `0`.

#### Expected Result

Quantity `0` is rejected or checkout is blocked before creating an order.

#### Actual Result

The cart displayed a product row with quantity `0`, line total `0`, and the checkout button was still available.

#### Impact

Invalid cart data can enter the checkout flow, which may cause incorrect order totals or inconsistent order contents.

#### Suggested Fix

Validate quantity on the product detail page, cart state, and checkout submission. Reject quantities below `1`.

#### Evidence

[FR08-BVA-04 screenshot](evidence/screenshots/FR08-BVA-04.png)

### BUG-FR08-05 - Coupon at exact minimum threshold is rejected

**Feature:** FR-08 - Checkout  
**Related Test Case:** FR08-BVA-10  
**Severity:** Medium  
**Status:** Confirmed by test result and source review  

#### Description

The `SAVE10` coupon is rejected when `total_amount` is exactly equal to its documented minimum order amount.

#### Steps to Reproduce

1. Send `POST /api/apply-coupon`.
2. Use coupon `SAVE10`.
3. Set `total_amount` to `300000`.

#### Input Data

`{"code":"SAVE10","total_amount":300000,"user_id":2}`

#### Expected Result

The coupon is accepted at the documented minimum threshold.

#### Actual Result

API returned HTTP 400 with the minimum-order error. Source review confirms the route uses `total_amount > coupon.min_order_amount`, excluding the exact boundary.

#### Impact

Users whose order exactly reaches the coupon minimum cannot apply the coupon.

#### Suggested Fix

Use an inclusive threshold check when the requirement states that the minimum amount is accepted.

#### Evidence

[JSON log](test_scripts/results/json/fr08_checkout_api_results.json), [HTML log](test_scripts/results/html/fr08_checkout_api_results.html)

### BUG-FR08-06 - Percent coupon calculation produces negative discount

**Feature:** FR-08 - Checkout  
**Related Test Case:** FR08-BVA-11  
**Severity:** High  
**Status:** Confirmed by test result and source review  

#### Description

The `SAVE10` percent coupon returned a negative discount and an inflated final amount when the total was above the minimum threshold.

#### Steps to Reproduce

1. Send `POST /api/apply-coupon`.
2. Use coupon `SAVE10`.
3. Set `total_amount` to `300001`.

#### Input Data

`{"code":"SAVE10","total_amount":300001,"user_id":2}`

#### Expected Result

The coupon applies a 10% discount and returns a final amount below the original total.

#### Actual Result

API returned HTTP 200, but `discount_amount` was `-2700009` and `final_amount` was `3000010`. Source review shows the route calculates percent discounts as `total_amount * (1 - coupon.discount_value)` instead of `total_amount * coupon.discount_value / 100`.

#### Impact

Percent coupons can increase the final checkout total instead of discounting it.

#### Suggested Fix

Calculate percent discounts as a percentage of the total and ensure the final amount is less than or equal to the original total.

#### Evidence

[JSON log](test_scripts/results/json/fr08_checkout_api_results.json), [HTML log](test_scripts/results/html/fr08_checkout_api_results.html)

### BUG-FR18-01 - Admin token cannot view admin order list

**Feature:** FR-18 - Admin Order Management  
**Related Test Case:** FR18-DT-01  
**Severity:** Critical  
**Status:** Confirmed by test result  
**GitHub Issue:** https://github.com/lhlam2515/software-testing/issues/10  

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

`test_scripts/results/json/fr18_admin_order_api_results.json`, `test_scripts/results/html/fr18_admin_order_api_results.html`

### BUG-FR18-02 - Valid admin order status transitions are rejected

**Feature:** FR-18 - Admin Order Management  
**Related Test Case:** FR18-DT-04, FR18-DT-05, FR18-DT-06, FR18-DT-07, FR18-DT-08, FR18-BVA-04  
**Severity:** Critical  
**Status:** Confirmed by test result  
**GitHub Issue:** https://github.com/lhlam2515/software-testing/issues/11  

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

`test_scripts/results/json/fr18_admin_order_api_results.json`, `test_scripts/results/html/fr18_admin_order_api_results.html`

### BUG-FR18-03 - Admin transition validation cannot be verified because status updates return Forbidden

**Feature:** FR-18 - Admin Order Management  
**Related Test Case:** FR18-DT-09, FR18-DT-10, FR18-DT-11, FR18-BVA-05, FR18-BVA-06  
**Severity:** High  
**Status:** Confirmed by test result  
**GitHub Issue:** https://github.com/lhlam2515/software-testing/issues/12  

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

`test_scripts/results/json/fr18_admin_order_api_results.json`, `test_scripts/results/html/fr18_admin_order_api_results.html`

### BUG-FR18-04 - Admin Orders renders HTML shipping address instead of escaped text

**Feature:** FR-18 - Admin Order Management  
**Related Test Case:** FR18-DT-12  
**Severity:** Critical  
**Status:** Confirmed by screenshot evidence  

#### Description

The Admin Orders page rendered a submitted HTML shipping address as an element instead of displaying it as escaped text. The screenshot shows the address column rendering a broken image element after checkout accepted the HTML payload.

#### Steps to Reproduce

1. Log in as a regular user and copy the user token.
2. Send `POST /api/checkout` with an HTML shipping address.
3. Log in to the Admin Web interface.
4. Open the Orders page.
5. Observe the address column for the created order.

#### Input Data

`{"total_amount":100000,"shipping_address":"<img src=x onerror=alert('FR18-XSS')>"}`

#### Expected Result

The address is escaped and displayed as plain text; no HTML element is rendered and no script can execute.

#### Actual Result

The Admin Orders page rendered the submitted HTML as an image element in the address column.

#### Impact

User-controlled order data can be interpreted as HTML in the admin interface, creating an XSS risk for administrators.

#### Suggested Fix

Render shipping addresses as text instead of using unsafe HTML rendering. Sanitize existing stored address data before display if HTML rendering is unavoidable.

#### Evidence

[FR18-DT-12 checkout screenshot](evidence/screenshots/FR18-DT-12.png), [FR18-DT-12 admin UI screenshot](evidence/screenshots/FR18-DT-12-2.png)

### BUG-FR20-01 - Mobile checkout payload omits the last item

**Feature:** FR-20 - Mobile Checkout  
**Related Test Case:** FR20-DT-06, FR20-BVA-03  
**Severity:** High  
**Status:** Confirmed by source review  

#### Description

The mobile checkout request omits the last cart item whenever the cart contains more than one item. The mobile code sends `cart.slice(0, -1)` for multi-item carts.

#### Steps to Reproduce

1. Add two or more products to the mobile cart.
2. Proceed to checkout.
3. Inspect the request body sent by the mobile checkout handler.

#### Input Data

Any mobile cart with at least two items.

#### Expected Result

The checkout payload includes all cart items, and the backend validates the submitted items.

#### Actual Result

Source review shows the mobile payload removes the last item before sending checkout. Backend checkout stores only `total_amount` and does not validate line items.

#### Impact

The submitted checkout payload can differ from the visible cart, reducing traceability and making order contents unreliable.

#### Suggested Fix

Send the full `cart` array and validate each line item on the backend before creating the order.

#### Evidence

Source review note in [feature_D_mobile_selected.md](feature_D_mobile_selected.md). Additional request/response execution evidence should be captured before creating a separate GitHub Issue.

### BUG-FR20-02 - Backend checkout trusts client-supplied total amount

**Feature:** FR-20 - Mobile Checkout  
**Related Test Case:** FR20-DT-07, FR20-BVA-06  
**Severity:** Critical  
**Status:** Confirmed by source review  

#### Description

The backend checkout endpoint inserts the submitted `total_amount` directly into the `orders` table without recalculating from trusted product or cart data.

#### Steps to Reproduce

1. Log in as a user and obtain a token.
2. Send `POST /api/checkout` with a manipulated `total_amount`.
3. Review the backend checkout route behavior.

#### Input Data

Examples: `total_amount=1`, `sum-1`, or `sum+1`.

#### Expected Result

The backend recalculates the total from trusted product/cart data or rejects manipulated totals.

#### Actual Result

Source review shows the backend stores `total_amount` from the request body directly.

#### Impact

Users or clients can submit incorrect payable amounts if they can call the checkout API directly.

#### Suggested Fix

Recalculate totals on the backend from trusted product IDs, quantities, coupon rules, and authenticated user state.

#### Evidence

Source review note in [feature_D_mobile_selected.md](feature_D_mobile_selected.md). Additional request/response execution evidence should be captured before creating a separate GitHub Issue.

### BUG-FR20-03 - Mobile valid coupon calculation increases final amount

**Feature:** FR-20 - Mobile Checkout  
**Related Test Case:** FR20-DT-08  
**Severity:** High  
**Status:** Confirmed by screenshot evidence  

#### Description

The mobile checkout screen showed `SAVE10` applied successfully, but the final amount increased from `103,000,000` to `1,030,000,000` instead of decreasing by 10%.

#### Steps to Reproduce

1. Log in to the mobile app.
2. Add multiple products totaling `103,000,000`.
3. Open checkout.
4. Apply coupon `SAVE10`.
5. Observe the displayed discount and final total.

#### Input Data

Coupon code: `SAVE10`; cart total: `103,000,000`.

#### Expected Result

The final amount decreases by the coupon discount.

#### Actual Result

The screenshot shows a successful coupon message but an inflated payable total of `1,030,000,000`.

#### Impact

Customers may be shown or charged an incorrect checkout amount after applying a valid coupon.

#### Suggested Fix

Correct percent-coupon calculation and add automated tests for percentage discounts on web and mobile checkout.

#### Evidence

[FR20-DT-08 screenshot](evidence/screenshots/FR20-DT-08.jpg)

## 4. Potential Bugs Requiring Review

| Potential ID | Related Test Case | Feature | Reason | Next Step |
|---|---|---|---|---|
| PBUG-FR04-DT-10 | FR04-DT-10 | FR-04 | API returned HTTP 403; UI rendering safety still requires visual/security review. | Execute UI review with evidence. |
| PBUG-FR04-DT-12 | FR04-DT-12 | FR-04 | API returned HTTP 403; long-address storage behavior remains unclear. | Review logs and rerun manually if needed. |
| PBUG-FR08-BVA-02 | FR08-BVA-02 | FR-08 | Screenshot shows one product on the checkout page but not post-confirmation success. | Confirm checkout and capture success/order evidence. |
| PBUG-FR08-BVA-03 | FR08-BVA-03 | FR-08 | Screenshot shows two products and total on the checkout page but not post-confirmation success. | Confirm checkout and capture success/order evidence. |
| PBUG-FR08-BVA-05 | FR08-BVA-05 | FR-08 | Screenshot shows quantity on product page only, not cart/checkout subtotal. | Capture cart or checkout subtotal evidence. |
| PBUG-FR08-BVA-06 | FR08-BVA-06 | FR-08 | Screenshot shows quantity on product page only, not cart/checkout subtotal. | Capture cart or checkout subtotal evidence. |
| PBUG-FR20-DT-11 | FR20-DT-11 | FR-20 | Screenshot shows cart empty after checkout, but does not prove order history reload. | Capture order history after successful mobile checkout. |
| PBUG-FR20-DT-12-BVA-04 | FR20-DT-12, FR20-BVA-04 | FR-20 | Screenshots do not prove abnormal quantity normalization after add-to-cart and checkout. | Capture quantity `0`, `1`, and `2` after add-to-cart/cart update and checkout total calculation. |
| PBUG-FR20-BVA-05 | FR20-BVA-05 | FR-20 | Coupon threshold below/on/above values have no execution evidence. | Execute mobile/API coupon threshold checks and save screenshots or logs. |
