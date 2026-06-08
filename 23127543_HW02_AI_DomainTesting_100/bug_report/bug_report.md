# Bug Report - HW02 Domain Testing

The entries below are templates for defects found during execution. No bug has been confirmed because manual test execution has not been performed. Items supported by code/spec inspection are marked as **Potential bug - needs execution confirmation**.

## BUG-01: Potential bug - Profile API may allow role changes

**Feature:** FR-04  
**Severity:** Critical  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:** FR04-DT-08  
**Status:** Potential bug - needs execution confirmation

### Steps to Reproduce
1. Log in with a regular user account.
2. Send `PUT /api/users/me` with a body containing `role: "admin"`.
3. Call the user-info API again or try accessing an admin API.

### Expected Result
The backend must not allow a user to change their own `role`; it should reject the field or ignore it.

### Actual Result
To be filled after execution.

### Evidence
Screenshot placeholder: `bug_report/screenshots/BUG-01.png`

### GitHub Issue Link
To be filled after creating issue.

## BUG-02: Potential bug - Checkout backend may trust client-provided `total_amount`

**Feature:** FR-08 / FR-20 Mobile Checkout  
**Severity:** Critical  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:** FR08-DT-07, FR20-DT-07  
**Status:** Potential bug - needs execution confirmation

### Steps to Reproduce
1. Log in and prepare a cart with a known total amount.
2. Send `POST /api/checkout` with `total_amount` lower than the real cart total.
3. Check the order created in order history/admin order management.

### Expected Result
The backend recalculates the total from server-side cart/order data or rejects the incorrect payload.

### Actual Result
To be filled after execution.

### Evidence
Screenshot placeholder: `bug_report/screenshots/BUG-02.png`

### GitHub Issue Link
To be filled after creating issue.

## BUG-03: Potential bug - Admin API may be missing admin-role validation

**Feature:** FR-18  
**Severity:** Critical  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:** FR18-DT-02  
**Status:** Potential bug - needs execution confirmation

### Steps to Reproduce
1. Log in as a regular user.
2. Use the regular user's token to call `GET /api/admin/orders`.
3. Observe the response.

### Expected Result
The API returns 403/401 because the user does not have `role=admin`.

### Actual Result
To be filled after execution.

### Evidence
Screenshot placeholder: `bug_report/screenshots/BUG-03.png`

### GitHub Issue Link
To be filled after creating issue.

## BUG-04: Potential bug - State machine may allow `canceled -> delivered`

**Feature:** FR-18  
**Severity:** High  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:** FR18-DT-11, FR18-BVA-06  
**Status:** Potential bug - needs execution confirmation

### Steps to Reproduce
1. Create or locate an order with status `canceled`.
2. As admin, send `PUT /api/admin/orders/:id/status` with `status: "delivered"`.
3. Check the order status after the response.

### Expected Result
The API returns an error because `canceled` is a final state.

### Actual Result
To be filled after execution.

### Evidence
Screenshot placeholder: `bug_report/screenshots/BUG-04.png`

### GitHub Issue Link
To be filled after creating issue.

## BUG-05: Potential bug - Mobile checkout may send an incomplete cart payload

**Feature:** FR-20 Mobile Checkout  
**Severity:** High  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:** FR20-DT-06  
**Status:** Potential bug - needs execution confirmation

### Steps to Reproduce
1. Run the mobile app, log in, and add multiple products to the cart.
2. Confirm checkout.
3. Inspect the request/response or check the created order.

### Expected Result
The order contains all items in the cart, and the backend validates the data.

### Actual Result
To be filled after execution.

### Evidence
Screenshot placeholder: `bug_report/screenshots/BUG-05.png`

### GitHub Issue Link
To be filled after creating issue.

## BUG-FR04-01: Confirmed bug - Profile phone validation does not follow FR-04

**Feature:** FR-04  
**Severity:** High  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:** FR04-DT-01, FR04-DT-03, FR04-DT-04, FR04-DT-05  
**Status:** Confirmed by screenshot evidence

### Steps to Reproduce
1. Log in as a normal user and open the Profile page.
2. Enter valid phone values starting with `0`, such as `0912345678` or `09123456789`, then click Update.
3. Enter an invalid phone value not starting with `0`, such as `9123456789`, then click Update.

### Expected Result
Phone numbers starting with `0` and containing 10-11 digits are accepted. Phone numbers not starting with `0` are rejected.

### Actual Result
The UI rejects valid phone numbers `0912345678` and `09123456789` with an invalid-phone message requiring 9-10 digits. The UI accepts `9123456789` even though it does not start with `0`.

### Evidence
Screenshot placeholders:
- `evidence/test_execution_screenshots/FR04-DT-01.png`
- `evidence/test_execution_screenshots/FR04-DT-03.png`
- `evidence/test_execution_screenshots/FR04-DT-04.png`
- `evidence/test_execution_screenshots/FR04-DT-05.png`

### GitHub Issue Link
To be filled after creating issue.

## BUG-XX: [Short title]

**Feature:** FR-XX  
**Severity:** Low / Medium / High / Critical  
**Environment:** Windows, Chrome, localhost, EShop SUT  
**Related Test Case:**  
**Status:** Potential bug - needs execution confirmation / Confirmed after execution

### Steps to Reproduce
1.
2.
3.

### Expected Result

### Actual Result

### Evidence
Screenshot placeholder:

### GitHub Issue Link
To be filled after creating issue.
