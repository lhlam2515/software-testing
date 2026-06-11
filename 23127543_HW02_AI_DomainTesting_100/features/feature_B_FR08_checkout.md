# FR-08 - Checkout

## 1. Feature Overview

FR-08 is the web checkout flow that converts the local shopping cart into an order. Source-code review shows that the web UI keeps cart data in React state, opens `/checkout` only after the user passes the cart-page login check, and sends `POST /api/checkout` to the backend. The backend checkout route requires a JWT token and creates an order with `user_id`, client-provided `total_amount`, `status = pending`, and optional `shipping_address`.

## 2. Requirement Summary

According to the SRS, only logged-in users can checkout. Checkout total must be calculated from the cart and must not be directly editable. Backend must recalculate the total, UI must display all products, and cart must be cleared after successful checkout. In the actual implementation, web checkout has an editable total input, sends `items`, `total_amount`, and optional `coupon_id`, but backend ignores `items`, trusts `total_amount`, does not recalculate from cart data, and the web client does not call `clearCart()` after successful checkout.

### Valid Coupon Codes Found from Source Code

After reading `eshop-sut/backend/database.js` and `eshop-sut/backend/server.js`, the following seeded coupons can be used for checkout-related tests:

| Coupon Code | Type | Discount Value | Minimum Order Amount | Expired At | Is Active | Max Uses/User | Testing Purpose |
|---|---|---:|---:|---|---:|---:|---|
| SAVE10 | percent | 10 | 300000 | 2099-12-31 | 1 | 1 | Valid coupon |
| BIGBUY | fixed | 50000 | 500000 | 2099-12-31 | 1 | 1 | Valid coupon |
| VIP100 | fixed | 100000 | 300000 | 2099-12-31 | 1 | 2 | Valid coupon |
| EXPIRED | percent | 20 | 100000 | 2020-01-01 | 1 | 1 | Negative test: expired coupon |

Source-code note: `POST /api/apply-coupon` uses `total_amount > min_order_amount`, while the README says the boundary should be `>= min_order_amount`. The implementation also calculates percent coupons with `total_amount * (1 - discount_value)`, so percent coupon behavior needs execution evidence before any confirmed verdict is assigned.

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
| FR08-DT-07 | Domain Testing | Cart cleared after successful checkout | User is logged in; cart has at least one item | Successful checkout request | Confirm checkout, then return to Cart | Cart is empty after successful checkout | Screenshot shows checkout success on `/checkout`, but it does not show the cart after checkout. Screenshot evidence is unclear; needs manual confirmation. | Needs Review | [FR08-DT-07.png](../evidence/test_execution_screenshots/FR08-DT-07.png) |
| FR08-DT-08 | Domain Testing | Backend total calculation | User is logged in; real cart total is greater than 1 VND | API body `{ "total_amount": 1, "shipping_address": "Test address" }` | Send `POST /api/checkout` with valid token | Backend recalculates from trusted cart/product data or rejects the wrong total | API returns HTTP 200 with `{ "message": "Checkout successful", "orderId": 2 }`, so the manipulated total request is accepted. Bug candidate: BUG-FR08-01. | Fail | [FR08-DT-08.png](../evidence/test_execution_screenshots/FR08-DT-08.png) |
| FR08-DT-09 | Domain Testing | Zero or negative total through API | User is logged in | `total_amount = -1`, then `total_amount = 0`, with `shipping_address = "Test address"` | Send checkout API requests with valid token | Backend rejects invalid money values and creates no order | API returns HTTP 200 and creates orders for both `total_amount = -1` and `total_amount = 0`. Bug candidate: BUG-FR08-02. | Fail | [FR08-DT-09-1.png](../evidence/test_execution_screenshots/FR08-DT-09-1.png)<br>[FR08-DT-09-2.png](../evidence/test_execution_screenshots/FR08-DT-09-2.png) |
| FR08-DT-10 | Domain Testing | Missing shipping address through API | User is logged in | Body contains `total_amount` only | Send checkout API request with valid token | Backend implementation accepts checkout without `shipping_address` and creates an order; the behavior should be documented because the API does not validate this field | API returns HTTP 200 with `{ "message": "Checkout successful", "orderId": 8 }` when `shipping_address` is omitted. | Pass | [FR08-DT-10.png](../evidence/test_execution_screenshots/FR08-DT-10.png) |
| FR08-DT-11 | Domain Testing | Valid coupon before checkout | User is logged in; total is above coupon minimum | `BIGBUY` with total above 500000, or `VIP100` with total above 300000 | Apply coupon, then confirm checkout | Fixed discount is shown correctly and coupon usage is recorded after successful checkout | Not Executed | Not Executed | To be added after execution |
| FR08-DT-12 | Domain Testing | Expired coupon before checkout | User is logged in | `EXPIRED` with total above 100000 | Apply coupon before checkout | Expired-coupon error is shown and checkout total does not change | Not Executed | Not Executed | To be added after execution |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables

| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Cart item count | Checkout should require at least 1 cart item | 0 items | 1 item | 2 items |
| Product quantity | Product detail quantity should be at least 1; current UI allows direct numeric entry | 0 | 1 | 2 |
| Authentication state | `POST /api/checkout` requires a bearer token | No token | Valid token | Invalid token |
| Coupon threshold | `POST /api/apply-coupon` checks coupon minimum order amount before checkout | `SAVE10` at 299999 | `SAVE10` at 300000 | `SAVE10` at 300001 |
| Coupon usage count | Coupon usage is stored through `POST /api/coupon-usage` after checkout | Before max use | At max use | After max use |
| Cart state after checkout | Successful checkout should clear frontend cart state | Cart has item before checkout | Cart empty after checkout | Repeat checkout without adding a new item |

### 4.2 BVA Explanation

BVA was regenerated after inspecting the actual EShop source code. Only boundaries that can be executed through the current browser UI, Apidog/API client, or normal local setup were kept.

The main FR08 boundaries are cart item count, product quantity, authentication state, coupon threshold, coupon usage count, and cart state after checkout. Earlier artificial cases were removed or rewritten when they required changing application source code or checking data that checkout does not store. For each practical boundary, below/on/above values are selected where the implementation exposes a realistic way to test them.

Implementation notes used for this BVA set:

- Web cart data is stored in React `CartContext`, not in a persisted backend cart used by checkout.
- Web checkout sends `items`, `total_amount`, and optional `coupon_id`, but backend checkout stores only `user_id`, `total_amount`, `status`, and optional `shipping_address`.
- `POST /api/checkout` requires `Authorization: Bearer <token>`.
- Coupon validation is a separate `POST /api/apply-coupon` call before checkout.
- Product quantity can be typed in the product detail UI because the input has no `min` validation in the source.
- The web checkout code imports `clearCart` but does not call it after checkout success.

### 4.3 Boundary Value Analysis Test Cases

| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR08-BVA-01 | Boundary Value Analysis | Cart item count below minimum | User is logged in; frontend cart is empty | 0 cart items | Open Cart, then try to proceed to Checkout; also try direct `/checkout` in the browser if needed | Checkout is blocked for an empty cart and no order is created | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-02 | Boundary Value Analysis | Cart item count at minimum | User is logged in | 1 cart item with valid product and quantity 1 | Add one product to cart, proceed to Checkout, and confirm checkout | Checkout succeeds and the checkout page displays exactly one product before confirmation | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-03 | Boundary Value Analysis | Cart item count above minimum | User is logged in | 2 cart items with valid products | Add two products to cart, proceed to Checkout, and confirm checkout | Checkout succeeds and the checkout page displays both products before confirmation | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-04 | Boundary Value Analysis | Quantity below minimum | User is logged in; product detail page is available | Quantity `0` | Open a product detail page, enter quantity `0`, add to cart, then inspect Cart/Checkout | Quantity `0` is rejected or checkout is blocked before creating an order | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-05 | Boundary Value Analysis | Quantity at minimum | User is logged in; product detail page is available | Quantity `1` | Open a product detail page, enter quantity `1`, add to cart, then open Checkout | Checkout shows one unit and subtotal equals product price x 1 | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-06 | Boundary Value Analysis | Quantity above minimum | User is logged in; product detail page is available | Quantity `2` | Open a product detail page, enter quantity `2`, add to cart, then open Checkout | Checkout shows two units and subtotal equals product price x 2 | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-07 | Boundary Value Analysis | Authentication below boundary | No token is provided | `POST /api/checkout` with valid-looking body and no `Authorization` header | Send checkout request through Apidog/API client | Backend returns `401 Unauthorized` and no order is created | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-08 | Boundary Value Analysis | Authentication on boundary | Valid user token exists | `POST /api/checkout` with positive `total_amount` and valid bearer token | Log in, copy token, and send checkout request through Apidog/API client | Backend accepts the authenticated checkout request and returns checkout success with an `orderId` | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-09 | Boundary Value Analysis | Coupon threshold below minimum | User is logged in; coupon has not exceeded usage limit | `SAVE10`, `total_amount = 299999` | Send `POST /api/apply-coupon`, then keep checkout total unchanged | Coupon is rejected because the order total is below the minimum amount | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-10 | Boundary Value Analysis | Coupon threshold exactly at minimum | User is logged in; coupon has not exceeded usage limit | `SAVE10`, `total_amount = 300000` | Send `POST /api/apply-coupon`, then proceed to checkout only if coupon is accepted | Coupon is accepted at the documented minimum threshold and discounted total is shown | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-11 | Boundary Value Analysis | Coupon threshold above minimum | User is logged in; coupon has not exceeded usage limit | `SAVE10`, `total_amount = 300001` | Send `POST /api/apply-coupon`, then proceed to checkout if coupon is accepted | Coupon is accepted above the minimum threshold and discounted total is shown | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-12 | Boundary Value Analysis | Coupon usage limit | User is logged in; `VIP100` has max 2 uses per user | Apply `VIP100` before first use, second use, and third use | Apply coupon, checkout successfully, call `POST /api/coupon-usage`, then repeat until the third apply attempt | First and second uses are allowed; third use is rejected because usage count reaches the max | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-13 | Boundary Value Analysis | Cart state after checkout | User is logged in; cart has one valid item | Cart before checkout has 1 item; after success should have 0 items; repeat checkout without new item | Add one item, complete checkout, return to Cart, then try checkout again without adding a new item | Cart is cleared after success and repeated checkout is blocked until a new item is added | Not Executed | Not Executed | To be added after execution |

### 4.4 Source-Code Review Notes

The BVA cases above were regenerated after reviewing the actual EShop source code. Some earlier cases were removed because they could not be executed through the current UI/API without modifying the application source code. The final BVA set focuses on executable boundaries: cart item count, quantity, authentication state, coupon threshold, coupon usage count, and cart state after successful checkout.

Specific implementation limitations:

- Checkout does not read a persisted backend cart and does not save order line items, so BVA cases cannot verify stored per-item order details without additional implementation support.
- Coupon validation is handled by `POST /api/apply-coupon` before checkout, not by `POST /api/checkout` itself.
- Quantity `0` is testable through the current product detail UI because the input accepts typed numeric values and the cart stores the parsed value.
- Cart clearing after checkout must be verified through the frontend after success because the backend does not manage the web cart state.

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases

AI commonly suggests successful checkout, unauthenticated checkout, empty cart, one/multiple products, coupon use, and clearing the cart after checkout.

### 5.2 Missing / Weak AI Cases

AI may miss cases where the web total is editable, `total_amount` can be manipulated through the API, backend checkout ignores `items`, missing `shipping_address` is not validated, order line items are not saved by checkout, and the web cart is not cleared after success.

### 5.3 Why AI Might Miss Them

Without source inspection, AI may assume the backend follows the SRS and recalculates totals from trusted product/cart data. The actual checkout route is very short and stores the request total directly, so source review is required to find the risk.

### 5.4 Human Corrections

Test cases were corrected to use actual route `POST /api/checkout`, actual token behavior, actual web cart behavior, seeded coupon codes, and actual request body fields. Executed verdicts are based only on the available screenshots; all source-code-only coupon risks remain `Not Executed`.

## 6. Confirmed and Potential Bugs / Bug Report Placeholders

### BUG-FR08-01: Backend checkout trusts client-provided `total_amount`

**Feature:** FR-08 Checkout  
**Related Test Case:** FR08-DT-08, FR08-BVA-05  
**Severity:** Critical  
**Status:** Confirmed by screenshot evidence  

#### Steps to Reproduce
1. Log in and prepare a cart with total greater than 1 VND.
2. Send `POST /api/checkout` with `total_amount: 1`.
3. Check the newly created order in user order history or admin order list.

#### Expected Result

Backend recalculates total from trusted cart/product data or rejects the wrong request.

#### Actual Result
API returns HTTP 200 and creates an order when `total_amount` is manipulated to `1`.

#### Evidence
[FR08-DT-08.png](../evidence/test_execution_screenshots/FR08-DT-08.png)

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### BUG-FR08-02: Checkout API accepts zero and negative totals

**Feature:** FR-08 Checkout  
**Related Test Case:** FR08-DT-09  
**Severity:** Critical  
**Status:** Confirmed by screenshot evidence  

#### Steps to Reproduce
1. Log in and use a valid user token.
2. Send `POST /api/checkout` with `total_amount: -1`.
3. Send `POST /api/checkout` with `total_amount: 0`.

#### Expected Result

Backend rejects invalid totals and creates no order.

#### Actual Result
API returns HTTP 200 and creates orders for both negative and zero totals.

#### Evidence
[FR08-DT-09-1.png](../evidence/test_execution_screenshots/FR08-DT-09-1.png)<br>[FR08-DT-09-2.png](../evidence/test_execution_screenshots/FR08-DT-09-2.png)

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-FR08-03: Web checkout does not clear cart after success

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
