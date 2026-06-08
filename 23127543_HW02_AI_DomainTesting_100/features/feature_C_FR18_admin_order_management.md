# FR-18 - Admin Order Management

## 1. Feature Overview
FR-18 allows an admin to view all orders from all users and update order statuses. This is an important operational feature because it directly affects the confirmation, shipping, completion, and cancellation workflow.

## 2. Requirement Summary
Admin users can view all orders. Admin users can only change statuses according to FR-10: `pending -> confirmed`, `confirmed -> shipping`, `shipping -> delivered`, `pending -> canceled`, and `confirmed -> canceled`. `delivered` and `canceled` are final states. Invalid transitions must return a proper error. Shipping addresses must be displayed safely and must not render HTML.

## 3. Domain Testing

### 3.1 Input Variables / Conditions
| Variable / Condition | Description | Valid Domain | Invalid Domain |
|---|---|---|---|
| User role | Permission to access admin orders | Token with `role=admin` | Regular user, no token, fake token |
| Order list | Scope of data visible to admin | All orders from all users | Only admin's orders or incorrectly filtered data |
| Current status | Current order state | pending, confirmed, shipping, delivered, canceled | Empty/invalid state |
| Target status | State admin wants to change to | Valid state according to FR-10 | Skipped state, transition from final state |
| Order existence | Order ID | Existing ID | Non-existing ID |
| Shipping address | Displayed data | Escaped text | Rendered HTML/script |
| Transition error | API/UI response | 400 and clear message | Silent failure, incorrect 200, invalid state change |

### 3.2 Domain Analysis Explanation
FR-18 domains include access control, displayed data, and order state. For state behavior, each valid edge in the state machine is a separate valid domain; skipped transitions or transitions from final states are invalid domains. Because admin order management displays user-provided shipping addresses, security testing also includes HTML/script input.

### 3.3 Domain Testing Test Cases
| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR18-DT-01 | Valid domain | Admin views all orders | Admin token exists; orders from multiple users exist | GET /api/admin/orders | Log in as admin and open Orders | All orders from all users are displayed | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-01.png |
| FR18-DT-02 | Authorization | Regular user views admin orders | Regular user token | GET /api/admin/orders | Call API/open admin page | Rejected with 403/401 | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-02.png |
| FR18-DT-03 | Authorization | No token views admin orders | No token | GET /api/admin/orders | Call API | Returns 401 Unauthorized | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-03.png |
| FR18-DT-04 | Valid transition | pending -> confirmed | Order is pending | status: confirmed | Admin updates status | Success, order becomes confirmed | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-04.png |
| FR18-DT-05 | Valid transition | confirmed -> shipping | Order is confirmed | status: shipping | Admin updates status | Success, order becomes shipping | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-05.png |
| FR18-DT-06 | Valid transition | shipping -> delivered | Order is shipping | status: delivered | Admin updates status | Success, order becomes delivered | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-06.png |
| FR18-DT-07 | Valid transition | pending -> canceled | Order is pending | status: canceled | Admin updates status | Success, order becomes canceled | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-07.png |
| FR18-DT-08 | Valid transition | confirmed -> canceled | Order is confirmed | status: canceled | Admin updates status | Success, order becomes canceled | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-08.png |
| FR18-DT-09 | Invalid transition | pending -> delivered | Order is pending | status: delivered | Admin updates status | Returns error and status does not change | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-09.png |
| FR18-DT-10 | Invalid transition | delivered -> canceled | Order is delivered | status: canceled | Admin updates status | Returns error because delivered is a final state | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-10.png |
| FR18-DT-11 | Invalid transition | canceled -> delivered/confirmed | Order is canceled | status: delivered | Admin updates status | Returns error because canceled is a final state | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-11.png |
| FR18-DT-12 | Security domain | Shipping address contains HTML/script | Order has address `<img src=x onerror=alert(1)>` | Open admin orders | Observe address | HTML is escaped and script does not execute | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-DT-12.png |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables
| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Number of displayed orders | Admin list handles 0..n orders | 0 | 1 | 2+ |
| State index pending | Start of main flow | No previous state | pending | confirmed |
| State index confirmed | Branch point to shipping/canceled | pending | confirmed | shipping |
| State index shipping | Admin can complete only | confirmed | shipping | delivered |
| Final state delivered | No further transitions allowed | shipping | delivered | canceled/confirmed |
| Final state canceled | No further transitions allowed | pending/confirmed | canceled | delivered/confirmed |

### 4.2 BVA Explanation
The state machine is not a purely numeric boundary, so BVA is applied using state boundaries: before the state, on the state, and after the state. `delivered` and `canceled` are final-state boundaries and must be tested to ensure no further transition is allowed. The order list also has 0/1/n boundaries to verify admin UI display behavior.

### 4.3 BVA Test Cases
| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR18-BVA-01 | BVA | 0 orders | Admin token, DB has no orders | GET admin orders | Open order list | Clear empty state, no error | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-BVA-01.png |
| FR18-BVA-02 | BVA | 1 order | Admin token, 1 order | GET admin orders | Open order list | Exactly 1 order displayed | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-BVA-02.png |
| FR18-BVA-03 | BVA | Multiple orders | Admin token, >=2 orders | GET admin orders | Open order list | All orders displayed; no user order is missing | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-BVA-03.png |
| FR18-BVA-04 | BVA | Confirmed state boundary | Order is confirmed | status: shipping and canceled | Update both valid directions separately | Both directions are accepted separately | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-BVA-04.png |
| FR18-BVA-05 | BVA | Delivered final boundary | Order is delivered | status: canceled | Update status | Rejected, status remains unchanged | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-BVA-05.png |
| FR18-BVA-06 | BVA | Canceled final boundary | Order is canceled | status: delivered | Update status | Rejected, status remains unchanged | Not Executed | Not Executed | evidence/test_execution_screenshots/FR18-BVA-06.png |

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases
AI commonly suggests admin viewing orders, regular users being blocked, and a few basic transitions such as pending -> confirmed or shipping -> delivered.

### 5.2 Missing / Weak AI Cases
AI may miss final states, cancellation edges, invalid transition pending -> delivered, delivered -> canceled, canceled -> delivered, and shipping addresses containing HTML/script.

### 5.3 Why AI Might Miss Them
The reason is that behavior depends on the state machine and requires reading FR-10, not just FR-18. HTML escaping security cases are also easy to miss if the prompt only says "admin order management".

### 5.4 Human Corrections
The tester added all valid/invalid FR-10 edges, admin role checks, no-token checks, final-state tests, and shipping-address escaping. All results remain `Not Executed` until actual execution.
