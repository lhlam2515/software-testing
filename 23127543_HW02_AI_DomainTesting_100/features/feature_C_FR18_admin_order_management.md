# FR-18 - Admin Order Management

## 1. Feature Overview

FR-18 allows an admin to view all orders and update order statuses. The actual code uses `GET /api/admin/orders` and `PUT /api/admin/orders/:id/status`; both routes pass through the `authenticateToken` middleware.

## 2. Requirement Summary

According to the SRS, only admins can view/update orders, order status must follow the FR-10 state machine, `delivered` and `canceled` are final states, and shipping addresses must be displayed safely. In the actual code, backend admin APIs only verify that a token exists and do not check `role=admin`; transition `canceled -> delivered` is allowed; and the admin UI displays shipping address using `dangerouslySetInnerHTML`.

## 3. Domain Testing

### 3.1 Input Variables / Conditions

| Variable / Condition | Description | Valid Domain | Invalid Domain |
|---|---|---|---|
| Token | Admin API authentication | Valid JWT | No token, invalid token |
| Role | Admin permission | `role=admin` | `role=user` with valid token |
| Order ID | Order being viewed/updated | Existing ID | Non-existing ID |
| Current status | Current order state | pending, confirmed, shipping | delivered/canceled final state |
| Target status | Desired new state | Valid FR-10 transition edge | Skipped transition, backward transition, transition from final state |
| Shipping address | User data displayed in admin UI | Escaped text | Rendered HTML/script |
| Error response | Invalid transition response | 400 with clear message | Wrong 200, silent failure |

### 3.2 Domain Testing Explanation

1. Identify inputs/conditions: token, role, order id, current/target status, and shipping address.
2. Divide role domains and state-transition domains into valid and invalid classes.
3. Select representatives for each state-machine edge: pending->confirmed, confirmed->shipping, shipping->delivered, and cancellation from pending/confirmed.
4. Combine positive and negative cases, including non-admin, no-token, and non-existing-order cases.
5. Add security/UI cases because the admin UI renders address content as HTML.
6. Review actual code: middleware does not check role and backend contains suspicious `canceled -> delivered` logic.

### 3.3 Domain Testing Test Cases

| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR18-DT-01 | Domain Testing | Admin views all orders | Admin token is valid; orders from multiple users exist | `GET /api/admin/orders` | Log in as admin, open Orders tab | All orders are displayed with `user_name`, `total_amount`, `status`, `shipping_address` | Not Executed | Not Executed | To be added after execution |
| FR18-DT-02 | Domain Testing | Regular user calls admin orders | Regular user token | `GET /api/admin/orders` | Call API with user token | Must be rejected with 401/403 according to SRS | Not Executed | Not Executed | To be added after execution |
| FR18-DT-03 | Domain Testing | No token | No token | `GET /api/admin/orders` | Call API | Returns `401 Unauthorized` | Not Executed | Not Executed | To be added after execution |
| FR18-DT-04 | Domain Testing | pending -> confirmed | Order is `pending` | Body `{"status":"confirmed"}` | Admin updates status | Success, status becomes `confirmed` | Not Executed | Not Executed | To be added after execution |
| FR18-DT-05 | Domain Testing | confirmed -> shipping | Order is `confirmed` | `{"status":"shipping"}` | Admin updates status | Success, status becomes `shipping` | Not Executed | Not Executed | To be added after execution |
| FR18-DT-06 | Domain Testing | shipping -> delivered | Order is `shipping` | `{"status":"delivered"}` | Admin updates status | Success, status becomes `delivered` | Not Executed | Not Executed | To be added after execution |
| FR18-DT-07 | Domain Testing | pending -> canceled | Order is `pending` | `{"status":"canceled"}` | Admin cancels order | Success, status becomes `canceled` | Not Executed | Not Executed | To be added after execution |
| FR18-DT-08 | Domain Testing | confirmed -> canceled | Order is `confirmed` | `{"status":"canceled"}` | Admin cancels order | Success, status becomes `canceled` | Not Executed | Not Executed | To be added after execution |
| FR18-DT-09 | Domain Testing | Invalid pending -> delivered | Order is `pending` | `{"status":"delivered"}` | Call update API | Returns 400, status unchanged | Not Executed | Not Executed | To be added after execution |
| FR18-DT-10 | Domain Testing | delivered final state | Order is `delivered` | `{"status":"canceled"}` | Call update API | Rejected because `delivered` is a final state | Not Executed | Not Executed | To be added after execution |
| FR18-DT-11 | Domain Testing | canceled final state | Order is `canceled` | `{"status":"delivered"}` | Call update API | Rejected because `canceled` is a final state | Not Executed | Not Executed | To be added after execution |
| FR18-DT-12 | Domain Testing | Address contains script in admin UI | Order has `shipping_address=<img src=x onerror=alert(1)>` | Open admin Orders | Observe Address column | HTML is escaped and script does not execute | Not Executed | Not Executed | To be added after execution |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables

| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Displayed order count | Admin list handles 0..n orders | 0 | 1 | 2 |
| State pending | Start state | none | pending | confirmed |
| State confirmed | Can go to shipping or canceled | pending | confirmed | shipping |
| State shipping | Can only go to delivered | confirmed | shipping | delivered |
| Final delivered | No further transition allowed | shipping | delivered | canceled |
| Final canceled | No further transition allowed | pending/confirmed | canceled | delivered |

### 4.2 BVA Explanation

1. Identify state-boundary and list-size boundaries.
2. Select below/on/above boundary values for 0/1/2 orders and adjacent states.
3. Create tests around final states to detect transitions after completion.
4. Include both valid and invalid boundaries.
5. Review code: `canceled -> delivered` is marked valid in backend, which conflicts with the SRS.

### 4.3 Boundary Value Analysis Test Cases

| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR18-BVA-01 | Boundary Value Analysis | 0 orders | Admin token, DB has no orders | `GET /api/admin/orders` | Open admin Orders | Empty list/state shown, no crash | Not Executed | Not Executed | To be added after execution |
| FR18-BVA-02 | Boundary Value Analysis | 1 order | Admin token, DB has 1 order | `GET /api/admin/orders` | Open admin Orders | Exactly 1 order displayed | Not Executed | Not Executed | To be added after execution |
| FR18-BVA-03 | Boundary Value Analysis | 2+ orders | Admin token, DB has >=2 orders | `GET /api/admin/orders` | Open admin Orders | All orders displayed, sorted by descending id | Not Executed | Not Executed | To be added after execution |
| FR18-BVA-04 | Boundary Value Analysis | Confirmed boundary | Order is `confirmed` | `shipping` and `canceled` | Update each direction separately | Both valid directions are accepted separately | Not Executed | Not Executed | To be added after execution |
| FR18-BVA-05 | Boundary Value Analysis | Delivered final boundary | Order is `delivered` | `status=canceled` | Update status | Rejected, status unchanged | Not Executed | Not Executed | To be added after execution |
| FR18-BVA-06 | Boundary Value Analysis | Canceled final boundary | Order is `canceled` | `status=delivered` | Update status | Rejected, status unchanged | Not Executed | Not Executed | To be added after execution |

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases

AI commonly suggests admin viewing orders, non-admin users being blocked, and basic transitions such as pending->confirmed or shipping->delivered.

### 5.2 Missing / Weak AI Cases

AI may miss the actual API role-check behavior, final state `canceled`, shipping-address XSS in admin UI, non-existing orders, and skipped transitions such as pending->delivered.

### 5.3 Why AI Might Miss Them

The state machine is more complex than simple CRUD. Without reading `server.js`, AI may trust the API document that says admin APIs check role, while the actual middleware only verifies token existence.

### 5.4 Human Corrections

Tests were corrected according to actual routes, with added role/user-token cases, final-state boundary tests, and XSS address cases because the admin UI uses `dangerouslySetInnerHTML`.

## 6. Potential Bugs / Bug Report Placeholders

### Potential BUG-FR18-01: Admin APIs may not check `role=admin`

**Feature:** FR-18  
**Related Test Case:** FR18-DT-02  
**Severity:** Critical  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Log in as a regular user.
2. Use the regular user token to call `GET /api/admin/orders`.
3. Observe the response.

#### Expected Result

API returns 401/403 because the user is not an admin.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-FR18-02: `canceled -> delivered` may be allowed

**Feature:** FR-18  
**Related Test Case:** FR18-DT-11, FR18-BVA-06  
**Severity:** High  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Create or locate an order with status `canceled`.
2. Send `PUT /api/admin/orders/:id/status` with `{"status":"delivered"}`.
3. Check status after the response.

#### Expected Result

API rejects the transition because `canceled` is a final state.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-FR18-03: Admin UI may render shipping address as HTML

**Feature:** FR-18  
**Related Test Case:** FR18-DT-12  
**Severity:** Critical  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Create an order whose address contains HTML/script.
2. Open the Orders tab in admin.
3. Observe whether script/HTML is rendered.

#### Expected Result

Address is escaped as text.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.
