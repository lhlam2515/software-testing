# FR-20 - Mobile Checkout

## 1. Feature Overview
Feature D is selected as **Mobile Checkout** under FR-20. This is the checkout flow in the React Native/Expo application, allowing mobile users to view the cart, apply a coupon if available, and confirm order placement.

**Reason for selection:** After inspecting `apps/frontend-mobile/App.js`, the mobile app contains cart/checkout screens, `openCheckout`, `handleConfirmCheckout`, `handleApplyCoupon`, and cart/order state. Mobile Checkout is important and high-risk because it involves money, authentication, cart data, and differences between the mobile client and backend behavior.

## 2. Requirement Summary
FR-20 requires the mobile app to include full functionality, including cart and checkout. For Mobile Checkout, FR-08 requirements also apply: only logged-in users can checkout, total is calculated from the cart, the product list must be displayed fully, the backend must recalculate the total, and the cart must be cleared after successful checkout.

## 3. Domain Testing

### 3.1 Input Variables / Conditions
| Variable / Condition | Description | Valid Domain | Invalid Domain |
|---|---|---|---|
| Mobile login status | User state in mobile app | Logged in and has token | Not logged in, empty/expired token |
| Mobile cart | `cart` state in app | At least 1 valid item | Empty cart, item with missing/invalid data |
| Mobile quantity | Item quantity | Positive integer | 0, negative, text, too large |
| Mobile total | `cartTotal`/final amount | Calculated from item price*quantity | Editable or different from cart |
| Mobile coupon | Coupon code if used | Valid code according to FR-09 | Empty, expired, below minimum, usage exceeded |
| Checkout payload | Body sent to backend | Does not lose items; total is verified by backend | Missing item, manipulated `total_amount` |
| Network/API | Connection to LAN backend | Correct API_URL and server running | Wrong IP, network lost, API error |
| After checkout | State after success | Empty cart, success message, orders reloaded | Cart still has items, order missing items |

### 3.2 Domain Analysis Explanation
Mobile Checkout is analyzed by mobile UI domain, local state domain, and API domain. Because the mobile app stores the cart in client state, testing must cover empty/non-empty cart, valid/invalid quantity, and valid/invalid token. Since checkout sends a payload to the backend, manipulated or missing-item payloads must also be tested to detect UI/API mismatches.

### 3.3 Domain Testing Test Cases
| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR20-DT-01 | Valid domain | Valid mobile checkout | Mobile user logged in, cart has item | 1 product quantity 1 | Open Cart, click Checkout, confirm | Order is created successfully and cart is empty | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-01.png |
| FR20-DT-02 | Invalid domain | Not logged in | Cart has item, user null | Click checkout | App requires login or navigates to login | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-02.png |
| FR20-DT-03 | Invalid domain | Empty cart | User logged in, cart empty | Click checkout if button appears | Confirmation is blocked or empty-cart UI is shown | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-03.png |
| FR20-DT-04 | Valid domain | One item | User logged in | Cart: 1 item, qty 1 | Checkout | UI displays exactly 1 item and correct total | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-04.png |
| FR20-DT-05 | Valid domain | Multiple items | User logged in | Cart: >=2 items | Checkout | UI displays all items and total = sum | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-05.png |
| FR20-DT-06 | Security domain | Mobile payload missing item | User logged in, cart has multiple items | Inspect request body | Checkout on mobile/proxy request | Backend does not create an order with missing products; it uses server-side cart or validates payload | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-06.png |
| FR20-DT-07 | Security domain | Manipulated total | User logged in, cart sum=300000 | total_amount: 1 through proxy/API | Send checkout | Backend recalculates/rejects and does not save wrong total | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-07.png |
| FR20-DT-08 | Coupon domain | Valid coupon | User logged in, cart meets minimum | SAVE10/VIP100 if eligible | Apply coupon, checkout | Final amount is correct and order total is validated | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-08.png |
| FR20-DT-09 | Invalid coupon | Expired/below-minimum coupon | User logged in | EXPIRED or total below minimum | Apply coupon | Clear error shown and final amount not changed | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-09.png |
| FR20-DT-10 | State domain | Cart cleared after success | User logged in, cart has item | Successful checkout | Return to Cart | Cart is empty and success message appears | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-10.png |
| FR20-DT-11 | Network domain | Wrong API_URL/network lost | Mobile app cannot reach backend | Checkout | Confirm | Friendly error shown and cart is not cleared | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-11.png |
| FR20-DT-12 | Invalid domain | Abnormal quantity | User logged in | quantity 0/negative/text through state/input modification | Checkout | Rejected or normalized safely; total is not wrong | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-DT-12.png |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables
| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Cart item count | Checkout requires >=1 item | 0 | 1 | 2 |
| Quantity | Minimum quantity is 1 | 0 | 1 | 2 |
| Total amount | Must match cart sum | sum-1 | sum | sum+1 |
| Coupon minimum amount | Must reach coupon threshold | min-1 | min | min+1 |
| Token | Valid token is required | No token | Valid token | Invalid/expired token |
| Network timeout/error | Local data must not be lost on error | Error before send | Success | Error after send/API response error |

### 4.2 BVA Explanation
BVA for Mobile Checkout uses boundaries around item count, quantity, total amount, coupon threshold, and token. These boundaries fit the mobile flow because much of the data is stored in client state before being sent to the API. Tests must observe both UI response and order/cart data after the action.

### 4.3 BVA Test Cases
| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR20-BVA-01 | BVA | Cart with 0 items | User logged in | Empty cart | Open Cart/Checkout | Checkout not allowed | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-BVA-01.png |
| FR20-BVA-02 | BVA | Cart with 1 item | User logged in | 1 item | Checkout | Successful if item is valid | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-BVA-02.png |
| FR20-BVA-03 | BVA | Cart with 2 items | User logged in | 2 items | Checkout | Successful and no item is lost | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-BVA-03.png |
| FR20-BVA-04 | BVA | Quantity below minimum | User logged in | quantity 0 | Checkout through input/state modification | Rejected or normalized safely | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-BVA-04.png |
| FR20-BVA-05 | BVA | Coupon below/on/above minimum | User logged in, coupon min 300000 | 299999/300000/300001 | Apply coupon | Below min rejected; on/above min evaluated as valid | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-BVA-05.png |
| FR20-BVA-06 | BVA | Total around boundary | User logged in, sum=300000 | 299999/300000/300001 | Send checkout through proxy/API | Backend accepts only correct/recalculated total | Not Executed | Not Executed | evidence/test_execution_screenshots/FR20-BVA-06.png |

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases
AI commonly suggests successful mobile checkout, unauthenticated checkout, empty cart, one/multiple products, and coupon application.

### 5.2 Missing / Weak AI Cases
AI may miss mobile payloads with missing items, manipulated mobile `total_amount`, network failure after pressing checkout, coupon boundaries, and differences between local mobile cart state and backend behavior.

### 5.3 Why AI Might Miss Them
The causes include AI not always inspecting mobile code, a prompt that may be too general, and mobile flows depending on local state, network behavior, LAN API_URL, and backend security behavior.

### 5.4 Human Corrections
The tester selected Mobile Checkout after inspecting the repository, then added UI/API mismatch cases, network failure cases, coupon boundaries, and cart-clear verification. No execution is claimed until the app is run on a real emulator/device.
