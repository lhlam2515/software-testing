# Bug Report - HW02 Domain Testing

This report separates confirmed bugs with evidence from potential bugs inferred from source-code inspection. No fake GitHub issue links are added; links will be filled after real issues are created.

## Confirmed Bugs

### BUG-FR04-01: Profile phone validation does not follow FR-04

**Feature:** FR-04  
**Related Test Case:** FR04-DT-01, FR04-DT-03, FR04-DT-04, FR04-DT-05  
**Severity:** High  
**Status:** Confirmed by screenshot evidence  

#### Steps to Reproduce
1. Log in as a regular user and open the Profile page.
2. Enter SRS-valid phone values such as `0912345678` or `09123456789`, then click Update.
3. Enter a phone value that does not start with `0`, such as `9123456789`, then click Update.

#### Expected Result

Phone numbers starting with `0` and containing 10-11 digits are accepted. Phone numbers not starting with `0` are rejected.

#### Actual Result

UI rejects `0912345678` and `09123456789`, but accepts `9123456789`.

#### Evidence

- [FR04-DT-01.png](../evidence/test_execution_screenshots/FR04-DT-01.png)
- [FR04-DT-03.png](../evidence/test_execution_screenshots/FR04-DT-03.png)
- [FR04-DT-04.png](../evidence/test_execution_screenshots/FR04-DT-04.png)
- [FR04-DT-05.png](../evidence/test_execution_screenshots/FR04-DT-05.png)

#### GitHub Issue Link
To be filled after creating GitHub Issue.

## BUG-FR04-BVA-02: 10-digit phone starting with 0 is rejected

**Feature:** FR-04 Personal Profile Management  
**Related Test Case:** FR04-BVA-02  
**Severity:** Medium  
**Status:** Confirmed by screenshot evidence  

### Steps to Reproduce
1. Log in as a valid user.
2. Open the profile update UI.
3. Enter phone `0123456789`.
4. Submit the update request.

### Expected Result
The 10-digit phone number starting with `0` is accepted according to FR-04.

### Actual Result
The UI rejects `0123456789` and shows an invalid-phone alert.

### Evidence
[FR04-BVA-02.png](../evidence/test_execution_screenshots/FR04-BVA-02.png)

### GitHub Issue Link
To be filled after creating GitHub Issue.

## BUG-FR04-BVA-03: 11-digit phone starting with 0 is rejected

**Feature:** FR-04 Personal Profile Management  
**Related Test Case:** FR04-BVA-03  
**Severity:** Medium  
**Status:** Confirmed by screenshot evidence  

### Steps to Reproduce
1. Log in as a valid user.
2. Open the profile update UI.
3. Enter phone `01234567890`.
4. Submit the update request.

### Expected Result
The 11-digit phone number starting with `0` is accepted according to FR-04.

### Actual Result
The UI rejects `01234567890` and shows an invalid-phone alert.

### Evidence
[FR04-BVA-03.png](../evidence/test_execution_screenshots/FR04-BVA-03.png)

### GitHub Issue Link
To be filled after creating GitHub Issue.

## BUG-FR04-BVA-05: Phone not starting with 0 is accepted

**Feature:** FR-04 Personal Profile Management  
**Related Test Case:** FR04-BVA-05  
**Severity:** Medium  
**Status:** Confirmed by screenshot evidence  

### Steps to Reproduce
1. Log in as a valid user.
2. Open the profile update UI.
3. Enter phone `1123456789`.
4. Submit the update request.

### Expected Result
The phone number is rejected because it does not start with `0`.

### Actual Result
The UI accepts `1123456789` and shows update success.

### Evidence
[FR04-BVA-05.png](../evidence/test_execution_screenshots/FR04-BVA-05.png)

### GitHub Issue Link
To be filled after creating GitHub Issue.

## Potential Bugs

### Potential BUG-01: Backend profile API may allow role escalation

**Feature:** FR-04  
**Related Test Case:** FR04-DT-08  
**Severity:** Critical  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Log in as a regular user.
2. Send `PUT /api/users/me` with body containing `role: "admin"`.
3. Call `GET /api/users/me` or try an admin API.

#### Expected Result
Backend does not allow users to change their own role.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-02: Checkout backend may trust client-provided `total_amount`

**Feature:** FR-08 / FR-20  
**Related Test Case:** FR08-DT-08, FR20-DT-07  
**Severity:** Critical  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Log in and prepare a high-value cart.
2. Send `POST /api/checkout` with `total_amount: 1`.
3. Check the new order in user orders/admin orders.

#### Expected Result
Backend recalculates total or rejects the incorrect payload.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-03: Admin APIs may be missing admin-role validation

**Feature:** FR-18  
**Related Test Case:** FR18-DT-02  
**Severity:** Critical  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Log in as a regular user.
2. Use the regular user token to call `GET /api/admin/orders`.
3. Observe the response.

#### Expected Result
API returns 401/403 because the user does not have `role=admin`.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-04: Admin state machine may allow `canceled -> delivered`

**Feature:** FR-18  
**Related Test Case:** FR18-DT-11, FR18-BVA-06  
**Severity:** High  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Create or find an order with status `canceled`.
2. Send `PUT /api/admin/orders/:id/status` with `{"status":"delivered"}`.
3. Check status after the request.

#### Expected Result
API rejects the transition because `canceled` is a final state.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-05: Admin UI may render shipping address as HTML

**Feature:** FR-18  
**Related Test Case:** FR18-DT-12  
**Severity:** Critical  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Create an order with `shipping_address` containing HTML/script.
2. Open Admin > Orders.
3. Observe the Address column.

#### Expected Result
Address is escaped as plain text.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-06: Mobile checkout may send incomplete cart payload

**Feature:** FR-20  
**Related Test Case:** FR20-DT-06, FR20-BVA-03  
**Severity:** High  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Log in on mobile and add 2 products to cart.
2. Confirm checkout and inspect the request body.
3. Compare `items` in the request with cart UI.

#### Expected Result
Payload contains all cart items.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-07: Web checkout may not clear cart after success

**Feature:** FR-08  
**Related Test Case:** FR08-DT-10  
**Severity:** High  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Log in on web and add an item to cart.
2. Complete checkout successfully.
3. Return to the Cart page.

#### Expected Result
Cart is empty after checkout.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-08: Mobile profile may send wrong shipping-address field

**Feature:** FR-04 / FR-20  
**Related Test Case:** FR04-DT-12, manual mobile profile check  
**Severity:** Medium  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Log in on mobile and open Profile.
2. Update shipping address.
3. Call `GET /api/users/me` to check backend field `shipping_address`.

#### Expected Result
Mobile address is saved to backend field `shipping_address`.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.
