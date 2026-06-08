# FR-08 - Checkout

## 1. Feature Overview
FR-08 handles the customer's final ordering step. This feature converts the cart into an order, displays the ordered product list, calculates the total automatically, and clears the cart after successful checkout.

## 2. Requirement Summary
Only logged-in users can checkout. The checkout total must be calculated automatically from the cart and must not be directly editable by the user. The backend must recalculate the total and must not trust `total_amount` sent by the client. After successful checkout, the cart is cleared.

## 3. Domain Testing

### 3.1 Input Variables / Conditions
| Variable / Condition | Description | Valid Domain | Invalid Domain |
|---|---|---|---|
| Login status | Checkout permission | Valid user JWT | No token, invalid/expired token |
| Cart status | Order data | At least 1 valid product | Empty cart, item missing id/price/quantity |
| Product quantity | Quantity in cart | Positive integer | 0, negative, decimal, string |
| Product price | Price from product data | Positive number from backend | 0, negative, string, client-modified price |
| UI total | Displayed total | Automatically calculated from cart, read-only | Editable or different from cart total |
| `total_amount` API | Total sent by client | Backend ignores or verifies it | Client sends lower/higher amount |
| Product list | Checkout UI | Displays all items, quantities, prices | Missing item, wrong quantity, missing name |
| After checkout | Cart state | Empty cart and order created | Cart still has items, order has wrong total |

### 3.2 Domain Analysis Explanation
The checkout domain is divided by access permission, cart contents, monetary data, and post-processing state. Because checkout is a financial flow, testing must go beyond the UI and include backend requests with manipulated payloads. The valid domain is a logged-in user with a valid cart and matching calculated total. Invalid domains include unauthenticated access, empty cart, invalid quantity/price, and manipulated `total_amount`.

### 3.3 Domain Testing Test Cases
| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR08-DT-01 | Valid domain | Valid checkout | User logged in, cart has 2 products | Correct cart total | Open Checkout and confirm | Order is created successfully, total is correct, cart is empty | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-01.png |
| FR08-DT-02 | Invalid domain | Not logged in | No token, local cart has item | Cart has 1 item | Click Checkout | Redirects/requires login or API returns 401 | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-02.png |
| FR08-DT-03 | Invalid domain | Empty cart | User logged in | Empty cart | Open checkout/confirm | Checkout is blocked and empty state is shown | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-03.png |
| FR08-DT-04 | Valid domain | One product | User logged in | 1 item, quantity 1 | Checkout | Order contains exactly 1 product and total = price | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-04.png |
| FR08-DT-05 | Valid domain | Multiple products | User logged in | 3 items with different quantities | Checkout | UI displays the full list; total = sum price*qty | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-05.png |
| FR08-DT-06 | Security domain | User tries to edit UI total | User logged in | Use DevTools to modify total input if present | Try changing total before confirmation | Total cannot be changed or does not affect the order | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-06.png |
| FR08-DT-07 | Security domain | Client sends low `total_amount` | User logged in, cart total 300000 | API body total_amount: 1 | Send POST /api/checkout using Postman/cURL | Backend recalculates 300000 or rejects request | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-07.png |
| FR08-DT-08 | Security domain | Client sends high `total_amount` | User logged in, cart total 300000 | API body total_amount: 999999999 | Send POST /api/checkout | Backend recalculates correctly or rejects request | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-08.png |
| FR08-DT-09 | State domain | Cart cleared after success | User logged in, cart has item | Valid checkout | Confirm and return to cart | Cart is empty and same item cannot be checked out again | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-09.png |
| FR08-DT-10 | Display domain | Product list displayed fully | User logged in, cart has multiple items | Different names/prices/quantities | Open Checkout | All items, quantities, prices, and subtotals are displayed | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-10.png |
| FR08-DT-11 | Invalid domain | Quantity 0/negative | User logged in | quantity: 0 or -1 through client/API | Add abnormal item then checkout | Invalid item is rejected | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-11.png |
| FR08-DT-12 | Robustness domain | Price as string | User logged in | price: "100000" in cart/API | Checkout | Backend safely normalizes or rejects; total is not wrong | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-DT-12.png |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables
| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Number of cart items | Checkout requires at least 1 item | 0 | 1 | 2 |
| Quantity | Minimum positive integer is 1 | 0 | 1 | 2 |
| Price | Product price must be > 0 | 0 | 1 | 2 |
| Total amount | Total must equal cart sum | sum-1 | sum | sum+1 |
| Displayed list length | UI must display all items | n-1 items | n items | n+1 wrong item |
| Token | Checkout requires valid token | No token | Valid token | Invalid/expired token |

### 4.2 BVA Explanation
BVA for FR-08 uses boundaries around cart item count, quantity, price, and total. Values `sum-1`, `sum`, and `sum+1` help detect whether the backend trusts client data or recalculates the total. The 0/1/2 item boundary checks the minimum condition for checkout.

### 4.3 BVA Test Cases
| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR08-BVA-01 | BVA | Cart with 0 items | User logged in | Empty cart | Click checkout | Blocked | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-BVA-01.png |
| FR08-BVA-02 | BVA | Cart with 1 item | User logged in | 1 valid item | Checkout | Successful | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-BVA-02.png |
| FR08-BVA-03 | BVA | Cart with 2 items | User logged in | 2 valid items | Checkout | Successful, both items displayed | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-BVA-03.png |
| FR08-BVA-04 | BVA | Quantity below minimum | User logged in | quantity: 0 | Checkout through API/client modification | Rejected | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-BVA-04.png |
| FR08-BVA-05 | BVA | Quantity at minimum | User logged in | quantity: 1 | Checkout | Accepted | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-BVA-05.png |
| FR08-BVA-06 | BVA | Total around boundary | User logged in, sum=300000 | total_amount: 299999/300000/300001 | Send checkout API request | Only backend-calculated correct total is saved; mismatches are ignored/rejected | Not Executed | Not Executed | evidence/test_execution_screenshots/FR08-BVA-06.png |

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases
AI commonly suggests successful checkout, unauthenticated checkout, empty cart, one/multiple products, and cart clearing after checkout.

### 5.2 Missing / Weak AI Cases
AI may miss API-level `total_amount` manipulation, abnormal price/quantity, missing product list items, and the requirement that the backend must not trust client data.

### 5.3 Why AI Might Miss Them
The main cause is that prompts often focus on UI behavior, do not inspect APIs, and overlook backend financial risks. This is also a UI/API mismatch case because the UI may be read-only while the API still accepts payloads.

### 5.4 Human Corrections
The tester added manipulated-total cases, quantity/price edge cases, cart-clear verification, and full product-list display checks before checkout confirmation.
