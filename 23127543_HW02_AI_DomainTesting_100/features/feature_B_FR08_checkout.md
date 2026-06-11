# FR-08 - Checkout

## 1. Feature Overview

FR-08 is the web checkout flow that converts the local shopping cart into an order. Source-code review shows that the web UI keeps cart data in React state, opens `/checkout` only after the user passes the cart-page login check, and sends `POST /api/checkout` to the backend. The backend checkout route requires a JWT token and creates an order with `user_id`, client-provided `total_amount`, `status = pending`, and optional `shipping_address`.

## 2. Requirement Summary

According to the SRS, only logged-in users can checkout. Checkout total must be calculated from the cart and must not be directly editable. Backend must recalculate the total, UI must display all products, and cart must be cleared after successful checkout. In the actual implementation, web checkout has an editable total input, sends `items`, `total_amount`, and optional `coupon_id`, but backend ignores `items`, trusts `total_amount`, does not recalculate from cart data, and the web client does not call `clearCart()` after successful checkout.

## 3. Domain Testing

### 3.1 Input Variables / Conditions

| Variable / Condition | Description | Valid Domain | Invalid Domain |
|---|---|---|---|
| Login/token state | Checkout permission | Valid JWT token in `Authorization: Bearer <token>` | No token, invalid token, expired token |
| Cart state | Web cart in React `CartContext` | At least 1 valid product | Empty cart, stale local cart, product missing required fields |
| Cart item count | Number of products shown before checkout | 1 or more | 0 for checkout |
| Quantity | Quantity stored in cart item | Positive integer | 0, negative, string, decimal, manipulated local state |
| Product price | Price stored in cart item | Positive product price from product list | 0, negative, client-modified price |
| Total amount | `total_amount` sent to `POST /api/checkout` | Must match calculated cart total according to SRS | Client-edited lower/higher total, 0, negative, missing value |
| Shipping address | Optional backend field in checkout body | Meaningful address when provided by API caller | Missing/blank address if checkout is expected to require delivery information |
| Coupon | Optional discount flow before checkout | Existing valid coupon that meets minimum amount and usage limits | Empty, expired, below minimum, over usage limit |
| After checkout | Client and order state | Order created and cart cleared | Order created with wrong total, cart still has items, missing line items |

### 3.2 Domain Testing Explanation

1. Identify checkout domains from the real code: token, local cart, item count, quantity, price, editable total, optional coupon, optional shipping address, and post-checkout state.
2. Separate SRS-expected behavior from implementation behavior. The SRS expects server-side total recalculation, but the backend currently stores the client-provided `total_amount`.
3. Use screenshots only for executed verdicts. If a screenshot does not show the final expected behavior, keep the row as `Needs Review`.
4. Keep source-code-only risks as feasible test cases with `Actual Result = Not Executed`.
5. Include API cases because the backend route has different validation behavior from the web UI.

### 3.3 Domain Testing Test Cases

| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR08-DT-01 | Domain Testing | Logged-in user with a valid cart starts checkout | User is logged in; cart has one valid item | MacBook Pro M3, qty 1, total 45,000,000 VND | Open Cart and prepare to click Proceed to Checkout | User can continue to checkout and, after confirmation, a pending order is created with the correct total | Screenshot shows a logged-in user with one valid cart item and the Proceed to Checkout button, but it does not show the final checkout confirmation or created order. Needs manual confirmation. | Needs Review | [FR08-DT-01.png](../evidence/test_execution_screenshots/FR08-DT-01.png) |
| FR08-DT-02 | Domain Testing | Checkout from UI without login | No logged-in user; local cart has one item | Samsung Galaxy S24 Ultra, qty 1, total 28,000,000 VND | Click Proceed to Checkout from Cart | UI blocks checkout and requires the user to log in | UI shows an alert saying login is required before payment. | Pass | [FR08-DT-02.png](../evidence/test_execution_screenshots/FR08-DT-02.png) |
| FR08-DT-03 | Domain Testing | Checkout API without token | No `Authorization` token | `POST /api/checkout` with body `{ "total_amount": 30000000 }` | Send the checkout request through an API client | Backend returns `401 Unauthorized`; no order is created | API response is HTTP 401 with body `{ "error": "Unauthorized" }`. | Pass | [FR08-DT-03.png](../evidence/test_execution_screenshots/FR08-DT-03.png) |
| FR08-DT-04 | Domain Testing | Multiple cart items displayed before checkout | User is logged in; cart has multiple entries | iPhone 15 Pro Max qty 1; AirPods Pro 2 qty 1; AirPods Pro 2 qty 1 | Open Cart | UI displays all cart entries and total equals the sum of displayed line totals | UI displays three cart rows and total 42,000,000 VND, matching 30,000,000 + 6,000,000 + 6,000,000. | Pass | [FR08-DT-04.png](../evidence/test_execution_screenshots/FR08-DT-04.png) |
| FR08-DT-05 | Domain Testing | Empty cart checkout | User is logged in; cart is empty | Cart length 0; API body may contain `total_amount: 0` | Open Cart, try direct `/checkout`, and send checkout API with valid token | Checkout should be blocked and no empty order should be created | Not Executed | Not Executed | To be added after execution |
| FR08-DT-06 | Domain Testing | One item on checkout page | User is logged in; cart has one item | One product, qty 1 | Proceed from Cart to Checkout | Checkout page displays exactly one product line and total equals price x quantity | Not Executed | Not Executed | To be added after execution |
| FR08-DT-07 | Domain Testing | Cart cleared after successful checkout | User is logged in; cart has at least one item | Successful checkout request | Confirm checkout, then return to Cart | Cart is empty after successful checkout | Not Executed | Not Executed | To be added after execution |
| FR08-DT-08 | Domain Testing | Backend total calculation | User is logged in; real cart total is greater than 1 VND | API body `{ "total_amount": 1, "shipping_address": "Test address" }` | Send `POST /api/checkout` with valid token | Backend recalculates from trusted cart/product data or rejects the wrong total | Not Executed | Not Executed | To be added after execution |
| FR08-DT-09 | Domain Testing | Zero or negative total through API | User is logged in | `total_amount = 0` and `total_amount = -1` | Send checkout API requests with valid token | Backend rejects invalid money values and creates no order | Not Executed | Not Executed | To be added after execution |
| FR08-DT-10 | Domain Testing | Missing shipping address through API | User is logged in | Body contains `total_amount` only | Send checkout API request with valid token | If delivery address is required, backend should reject the request; otherwise behavior must be documented | Not Executed | Not Executed | To be added after execution |
| FR08-DT-11 | Domain Testing | Valid coupon before checkout | User is logged in; total meets coupon minimum | Valid coupon code and cart total above minimum | Apply coupon, then confirm checkout | Discount is shown correctly and coupon usage is recorded after successful checkout | Not Executed | Not Executed | To be added after execution |
| FR08-DT-12 | Domain Testing | Invalid coupon before checkout | User is logged in | Expired, unknown, or below-minimum coupon | Apply coupon before checkout | Error is shown and checkout total does not change | Not Executed | Not Executed | To be added after execution |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables

| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Cart item count | Checkout should require at least 1 item | 0 | 1 | 2 |
| Quantity | Minimum meaningful quantity is 1 | 0 | 1 | 2 |
| Total amount | Request total should equal calculated cart total | sum - 1 | sum | sum + 1 |
| API token state | Checkout requires authentication | No token | Valid token | Invalid token |
| Displayed product count | Checkout/cart UI should show all selected items | expected - 1 | expected | expected + 1 duplicate |
| Coupon minimum amount | Coupon applies only at/above minimum | min - 1 | min | min + 1 |

### 4.2 BVA Explanation

1. Use source-code review to choose boundaries that are actually reachable through UI or API.
2. Cover cart item count because the cart UI blocks empty cart navigation but the backend route does not read the cart.
3. Cover quantity and displayed product count because the frontend calculates totals from local cart entries.
4. Cover `total_amount` around the calculated sum because the backend stores the request value directly.
5. Cover token boundaries because `authenticateToken` returns 401 for missing token and 403 for invalid token.
6. Do not mark any BVA case as executed without separate evidence.

### 4.3 Boundary Value Analysis Test Cases

| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR08-BVA-01 | Boundary Value Analysis | 0 cart items | User is logged in; cart is empty | Cart length 0 | Open Cart, direct `/checkout`, and API checkout with valid token | Checkout is blocked and no empty order is created | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-02 | Boundary Value Analysis | 1 cart item | User is logged in | Cart length 1 | Proceed to Checkout | Checkout page displays one item and total equals the item subtotal | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-03 | Boundary Value Analysis | 2 cart items | User is logged in | Cart length 2 | Proceed to Checkout | Checkout page displays both items and total equals both subtotals | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-04 | Boundary Value Analysis | Quantity 0, 1, 2 | User is logged in; cart state can be manipulated | qty 0, qty 1, qty 2 | Modify local cart state or API payload, then inspect checkout total | Quantity 0 is blocked; quantity 1 and 2 are calculated correctly | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-05 | Boundary Value Analysis | Total amount around calculated sum | User is logged in; calculated sum is known | `sum - 1`, `sum`, `sum + 1` | Send checkout API requests with valid token | Only the correct/recalculated total is accepted or saved | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-06 | Boundary Value Analysis | Token state | Checkout body is otherwise valid | No token, valid token, invalid token | Send checkout API request for each token state | Missing token returns 401, valid token may create order, invalid token returns 403 | Not Executed | Not Executed | To be added after execution |

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases

AI commonly suggests successful checkout, unauthenticated checkout, empty cart, one/multiple products, coupon use, and clearing the cart after checkout.

### 5.2 Missing / Weak AI Cases

AI may miss cases where the web total is editable, `total_amount` can be manipulated through the API, backend checkout ignores `items`, missing `shipping_address` is not validated, order line items are not saved by checkout, and the web cart is not cleared after success.

### 5.3 Why AI Might Miss Them

Without source inspection, AI may assume the backend follows the SRS and recalculates totals from trusted product/cart data. The actual checkout route is very short and stores the request total directly, so source review is required to find the risk.

### 5.4 Human Corrections

Test cases were corrected to use actual route `POST /api/checkout`, actual token behavior, actual web cart behavior, and actual request body fields. Executed verdicts are based only on the four available screenshots; all source-code-only risks remain `Not Executed`.

## 6. Potential Bugs / Bug Report Placeholders

### Potential BUG-FR08-01: Backend checkout trusts client-provided `total_amount`

**Feature:** FR-08 Checkout  
**Related Test Case:** FR08-DT-08, FR08-BVA-05  
**Severity:** Critical  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Log in and prepare a cart with total greater than 1 VND.
2. Send `POST /api/checkout` with `total_amount: 1`.
3. Check the newly created order in user order history or admin order list.

#### Expected Result

Backend recalculates total from trusted cart/product data or rejects the wrong request.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-FR08-02: Web checkout does not clear cart after success

**Feature:** FR-08 Checkout  
**Related Test Case:** FR08-DT-07  
**Severity:** High  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Log in on web and add a product to cart.
2. Complete checkout successfully.
3. Return to the cart page.

#### Expected Result

Cart is cleared after successful checkout.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.
