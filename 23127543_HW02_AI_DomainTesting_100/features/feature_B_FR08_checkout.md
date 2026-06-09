# FR-08 - Checkout

## 1. Feature Overview

FR-08 is the web flow that converts a shopping cart into an order. The actual code uses a local React cart context for the UI, `POST /api/checkout` to create an order, and `POST /api/apply-coupon` when a coupon is used. Backend checkout requires a token but only stores `user_id`, `total_amount`, `status=pending`, and `shipping_address`.

## 2. Requirement Summary

According to the SRS, only logged-in users can checkout. Checkout total must be calculated from the cart and must not be directly editable. Backend must recalculate the total, UI must display all products, and cart must be cleared after successful checkout. In the actual code, web checkout has an editable `editableTotal` input, sends `items`, `total_amount`, and `coupon_id`, but backend ignores `items`, trusts `total_amount`, does not recalculate total, and the web client does not call `clearCart()` after success.

## 3. Domain Testing

### 3.1 Input Variables / Conditions

| Variable / Condition | Description | Valid Domain | Invalid Domain |
|---|---|---|---|
| Login status | Checkout permission | User has valid JWT | No token, invalid/expired token |
| Cart state | Frontend cart | At least 1 valid product | Empty cart, item missing id/name/price/quantity |
| Quantity | Item quantity | Positive integer | 0, negative, string, decimal |
| Price | Product price in cart | Positive number from product data | 0, negative, client-modified price |
| UI total | Web `editableTotal` | Equals `cartTotal` and is not editable according to SRS | Directly edited, different from cart total |
| Checkout payload | Body of `POST /api/checkout` | `total_amount` is verified/recalculated by backend | Client sends 1, 0, negative, or very large value |
| Coupon | Optional discount code | Existing, active, not expired, meets minimum | Empty, expired, below minimum, usage exceeded |
| After checkout | Cart/order state | Pending order created, cart is empty | Wrong order total, cart still has items, missing address |

### 3.2 Domain Testing Explanation

1. Identify variables: token, cart, quantity, price, total, coupon, and post-checkout state.
2. Divide valid and invalid domains according to the SRS and actual backend/frontend code.
3. Select representative values: empty cart, one item, multiple items, `total_amount=1`, `total_amount=cartTotal`, valid/expired coupon.
4. Combine domains into positive and negative cases, especially financial-risk cases.
5. Add API, security, state, and UI cases because backend trusts client-supplied data.
6. Review code: `POST /api/checkout` does not read server cart, does not clear `userCarts`, does not save line items, and web checkout does not send `shipping_address`.

### 3.3 Domain Testing Test Cases

| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR08-DT-01 | Domain Testing | Valid checkout with cart item | User is logged in, web cart has item | 1 iPhone, qty 1, total 30000000 | Open Checkout, click Confirm Checkout | Pending order is created, total is correct, success is shown | Not Executed | Not Executed | To be added after execution |
| FR08-DT-02 | Domain Testing | Checkout from UI while not logged in | No user, local cart has item | Cart has 1 item | Click Proceed to Checkout on Cart | UI alerts that login is required and navigates to `/login` | Not Executed | Not Executed | To be added after execution |
| FR08-DT-03 | Domain Testing | Checkout API without token | No token | `POST /api/checkout`, body `{total_amount:30000000}` | Send API request | Returns `401 Unauthorized`, no order created | Not Executed | Not Executed | To be added after execution |
| FR08-DT-04 | Domain Testing | Empty cart but checkout page/API | User is logged in, cart is empty | `total_amount=0` | Open `/checkout` directly or call API | SRS requires empty checkout to be blocked | Not Executed | Not Executed | To be added after execution |
| FR08-DT-05 | Domain Testing | One item | User is logged in | MacBook qty 1 | Checkout | UI displays exactly 1 item and total = price*qty | Not Executed | Not Executed | To be added after execution |
| FR08-DT-06 | Domain Testing | Multiple items | User is logged in | iPhone qty 1, AirPods qty 2 | Checkout | UI displays all items and correct subtotals | Not Executed | Not Executed | To be added after execution |
| FR08-DT-07 | Domain Testing | Edit total in UI | User is logged in, cart total is 30000000 | Change total input to `1` | Open Checkout, edit input, confirm | SRS expects UI not editable or backend rejects wrong total | Not Executed | Not Executed | To be added after execution |
| FR08-DT-08 | Domain Testing | Manipulated `total_amount` through API | User is logged in | Body `{total_amount:1, shipping_address:"A"}` | Send `POST /api/checkout` via Postman/cURL | Backend recalculates from server cart or rejects | Not Executed | Not Executed | To be added after execution |
| FR08-DT-09 | Domain Testing | Negative/zero total | User is logged in | `total_amount=-1` and `0` | Send checkout API | Backend rejects invalid money values | Not Executed | Not Executed | To be added after execution |
| FR08-DT-10 | Domain Testing | Cart cleared after success | User is logged in, cart has item | Successful checkout | Return to Cart after success | Cart is empty | Not Executed | Not Executed | To be added after execution |
| FR08-DT-11 | Domain Testing | Valid coupon | User is logged in, total exceeds minimum | `SAVE10`, total 500000 | Apply coupon then checkout | Discount is correct and usage is recorded after successful checkout | Not Executed | Not Executed | To be added after execution |
| FR08-DT-12 | Domain Testing | Expired/below-minimum coupon | User is logged in | `EXPIRED` or `SAVE10` with total 300000 | Apply coupon | Clear error is shown and total does not change | Not Executed | Not Executed | To be added after execution |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables

| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Cart item count | Checkout requires >=1 item | 0 | 1 | 2 |
| Quantity | Minimum quantity is 1 | 0 | 1 | 2 |
| Price | Product price must be >0 | 0 | 1 | 2 |
| Total amount | Must equal cart total | sum-1 | sum | sum+1 |
| Coupon minimum | Coupon applies when order reaches minimum | min-1 | min | min+1 |
| Token | Valid token is required | No token | Valid token | Invalid token |

### 4.2 BVA Explanation

1. Identify quantity, money, token, and coupon-threshold boundaries.
2. Select below/on/above values: 0/1/2 items, 0/1/2 quantity, `sum-1/sum/sum+1`, `min-1/min/min+1`.
3. Create tests around boundaries to verify whether UI and backend block correctly.
4. Include both valid and invalid boundaries.
5. Review code: backend has no line-item/quantity validation and stores only client-provided `total_amount`.

### 4.3 Boundary Value Analysis Test Cases

| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR08-BVA-01 | Boundary Value Analysis | 0 items | User is logged in, cart is empty | Cart length 0 | Open Checkout or call API | Checkout is blocked | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-02 | Boundary Value Analysis | 1 item | User is logged in | Cart length 1 | Checkout | Successful if item is valid | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-03 | Boundary Value Analysis | 2 items | User is logged in | Cart length 2 | Checkout | UI displays both items and correct total | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-04 | Boundary Value Analysis | Quantity 0/1/2 | User is logged in | qty 0, 1, 2 | Modify cart state/API then checkout | 0 is blocked; 1/2 are calculated correctly | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-05 | Boundary Value Analysis | Total around cart total | User is logged in, sum=30000000 | `29999999`, `30000000`, `30000001` | Send checkout API | Only correct/recalculated total is accepted/saved | Not Executed | Not Executed | To be added after execution |
| FR08-BVA-06 | Boundary Value Analysis | Coupon minimum amount | User is logged in | `SAVE10` with 299999, 300000, 300001 | Apply coupon | According to SRS, `>= min` is valid; below min is rejected | Not Executed | Not Executed | To be added after execution |

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases

AI commonly suggests successful checkout, unauthenticated checkout, empty cart, one/multiple products, and clearing the cart after checkout.

### 5.2 Missing / Weak AI Cases

AI may miss cases where `total_amount` is edited through UI/API, backend does not save line items, checkout does not send address, coupon usage, and web cart is not cleared by the code.

### 5.3 Why AI Might Miss Them

Without source inspection, AI may assume the total is readonly and backend recalculates correctly according to SRS. In the code, financial logic is mostly client-side and the backend checkout route is very short, so source review is required to find the risk.

### 5.4 Human Corrections

Test cases were corrected to use actual route `POST /api/checkout`, actual body `total_amount`, optional `shipping_address` when calling API directly, and web UI behavior with `editableTotal`. All cases without screenshots remain `Not Executed`.

## 6. Potential Bugs / Bug Report Placeholders

### Potential BUG-FR08-01: Backend checkout trusts client-provided `total_amount`

**Feature:** FR-08  
**Related Test Case:** FR08-DT-08, FR08-BVA-05  
**Severity:** Critical  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Log in and prepare a cart with total greater than 1.
2. Send `POST /api/checkout` with `total_amount: 1`.
3. Check the newly created order in user order history/admin.

#### Expected Result

Backend recalculates total or rejects the wrong request.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-FR08-02: Web checkout does not clear cart after success

**Feature:** FR-08  
**Related Test Case:** FR08-DT-10  
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
