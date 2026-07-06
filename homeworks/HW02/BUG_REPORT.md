# Bug Report - HW02

**Tester:** Le Hoang Lam (23127216)
**SUT:** EShop, [github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut)
**GitHub Issues:** [github.com/lhlam2515/software-testing/issues](https://github.com/lhlam2515/software-testing/issues)
**Total bugs found:** 18

---

## Bug Summary

| Bug ID | Feature | Severity | TC Found By | Status | GitHub Issue |
| ------ | ------- | -------- | ----------- | ------ | ------------ |
| BUG-02-001 | FR-02, Login and Account Lockout | Medium | TC-03 | Open | [#13](https://github.com/lhlam2515/software-testing/issues/13) |
| BUG-02-002 | FR-02, Login and Account Lockout | Low | TC-04 | Open | [#14](https://github.com/lhlam2515/software-testing/issues/14) |
| BUG-02-003 | FR-02, Login and Account Lockout | High | TC-06, TC-BVA-01 | Open | [#15](https://github.com/lhlam2515/software-testing/issues/15) |
| BUG-02-004 | FR-02, Login and Account Lockout | Medium | TC-BVA-01 | Open | [#16](https://github.com/lhlam2515/software-testing/issues/16) |
| BUG-09-001 | FR-09, Coupon (Discount Code) | High | TC-01, TC-05, TC-BVA-03, TC-BVA-08 | Open | [#17](https://github.com/lhlam2515/software-testing/issues/17) |
| BUG-09-002 | FR-09, Coupon (Discount Code) | High | TC-08 | Open | [#18](https://github.com/lhlam2515/software-testing/issues/18) |
| BUG-09-003 | FR-09, Coupon (Discount Code) | High | TC-09 | Open | [#19](https://github.com/lhlam2515/software-testing/issues/19) |
| BUG-09-004 | FR-09, Coupon (Discount Code) | High | TC-11 | Open | [#20](https://github.com/lhlam2515/software-testing/issues/20) |
| BUG-09-005 | FR-09, Coupon (Discount Code) | Medium | TC-12, TC-BVA-02 | Open | [#21](https://github.com/lhlam2515/software-testing/issues/21) |
| BUG-09-006 | FR-09, Coupon (Discount Code) | Medium | TC-05 | Open | [#22](https://github.com/lhlam2515/software-testing/issues/22) |
| BUG-09-007 | FR-09, Coupon (Discount Code) | High | TC-13 | Open | [#30](https://github.com/lhlam2515/software-testing/issues/30) |
| BUG-16-001 | FR-16, CSV Product Import | High | TC-04 | Open | [#23](https://github.com/lhlam2515/software-testing/issues/23) |
| BUG-16-002 | FR-16, CSV Product Import | High | TC-08 to TC-12, TC-18, TC-BVA-01 | Open | [#24](https://github.com/lhlam2515/software-testing/issues/24) |
| BUG-16-003 | FR-16, CSV Product Import | High | TC-15 | Open | [#25](https://github.com/lhlam2515/software-testing/issues/25) |
| BUG-16-004 | FR-16, CSV Product Import | Medium | TC-14, TC-BVA-05 | Open | [#26](https://github.com/lhlam2515/software-testing/issues/26) |
| BUG-16-005 | FR-16, CSV Product Import | Low | TC-19 | Open | [#27](https://github.com/lhlam2515/software-testing/issues/27) |
| BUG-20-001 | FR-20, Cancel Order (Mobile) | High | TC-07, TC-BVA-02 | Open | [#28](https://github.com/lhlam2515/software-testing/issues/28) |
| BUG-20-002 | FR-20, Cancel Order (Mobile) | Low | TC-10 | Open | [#29](https://github.com/lhlam2515/software-testing/issues/29) |

**Severity distribution:** High: 10, Medium: 5, Low: 3

---

### BUG-02-001 - Invalid email format is not rejected client-side

**Feature:** FR-02, Login and Account Lockout
**TC that found it:** TC-03
**Severity:** Medium
**GitHub Issue:** [#13](https://github.com/lhlam2515/software-testing/issues/13)

#### Description

The login form does not validate the email format before submitting. When a value like `invalid_no_at_sign` (no `@` sign) is typed into the username field and `Sign In` is clicked, the browser sends the request straight to the server instead of blocking it locally. The server correctly rejects the malformed value with an HTTP 401, but the user only finds out after a full round trip, and the error message they see is the same generic "Dang nhap that bai" text used for wrong passwords, so it does not tell them the email itself is malformed.

#### Steps to Reproduce

1. Open the login page at `http://localhost:5173/login`.
2. Type `invalid_no_at_sign` into the username/email field and any password.
3. Click `Sign In`.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | The form should catch the malformed email client-side (e.g. via `type="email"` or a regex check) and block the request before it reaches the server. |
| **Actual** | The request is sent as `POST /api/login`, the server returns HTTP 401, and the page shows the generic failure message with no indication the email format itself was the problem. |

#### Screenshot

![BUG-02-001](artifacts/tests/FR-02-login-lockout/screenshots/BUG-02-001-type-text-invalid-email.png)

---

### BUG-02-002 - Login error message renders in the wrong position

**Feature:** FR-02, Login and Account Lockout
**TC that found it:** TC-04
**Severity:** Low
**GitHub Issue:** [#14](https://github.com/lhlam2515/software-testing/issues/14)

#### Description

When logging in with an unregistered email, the generic error message is displayed correctly, but it appears below the `Sign In` button and after the "don't have an account, sign up" prompt, instead of directly above the form fields where users would expect to see it. This does not break the login flow, but it hurts discoverability, especially for users who may not scroll down far enough to notice the error appeared at all.

#### Steps to Reproduce

1. Open the login page.
2. Enter `notfound@example.com` with any password.
3. Click `Sign In`.
4. Observe where the error text renders relative to the form and the sign-up prompt.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | The error message should render close to the form fields (e.g. directly above or below the input fields), in a position immediately visible after submission. |
| **Actual** | The error text renders after the `Sign In` button and after the sign-up prompt, pushing it lower on the page than users would naturally look. |

#### Screenshot

![BUG-02-002](artifacts/tests/FR-02-login-lockout/screenshots/TC-04-unregistered-email.png)

---

### BUG-02-003 - Failed login attempts counter increments by 2 instead of 1

**Feature:** FR-02, Login and Account Lockout
**TC that found it:** TC-06, TC-BVA-01
**Severity:** High
**GitHub Issue:** [#15](https://github.com/lhlam2515/software-testing/issues/15)

#### Description

Every time a login attempt fails with the correct email but wrong password, the `login_attempts` counter in the database jumps by 2 instead of 1. This was confirmed twice: once from a clean state (`0 -> 2` after a single failed attempt) and again at the lockout boundary (`2 -> 4` after one more failed attempt, triggering the lock two attempts earlier than the documented threshold of 3). This is a high-severity defect because it directly undermines the account lockout policy, users get locked out roughly twice as fast as intended.

#### Steps to Reproduce

1. Reset the test account's login attempts to 0 (`node test-db.cjs reset test@eshop.com`).
2. On the login page, submit the correct email with an incorrect password once.
3. Check `login_attempts` in the database.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | `login_attempts` should increase from `0` to `1` after a single failed attempt. |
| **Actual** | `login_attempts` increases from `0` to `2` after a single failed attempt, and the same doubled increment was reproduced at the lockout boundary (`2 -> 4`). |

#### Screenshot

![BUG-02-003](artifacts/tests/FR-02-login-lockout/screenshots/BUG-02-003-login-attempts-plus2.png)

---

### BUG-02-004 - Account lockout duration is roughly 180 seconds instead of the documented 30 seconds

**Feature:** FR-02, Login and Account Lockout
**TC that found it:** TC-BVA-01
**Severity:** Medium
**GitHub Issue:** [#16](https://github.com/lhlam2515/software-testing/issues/16)

#### Description

When an account becomes locked after crossing the failed-attempt threshold, the server sets `locked_until` about 180 seconds into the future, roughly six times longer than the 30-second lockout window described in the spec. Users who fail login end up waiting much longer than expected before they can try again, which is a real usability and support-burden issue even though the lockout mechanism itself functions.

#### Steps to Reproduce

1. Set the test account's `login_attempts` to 2 (`node test-db.cjs set-attempts test@eshop.com 2`).
2. On the login page, submit a wrong password to trigger the threshold-crossing failure.
3. Inspect the resulting `locked_until` value against the current time.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | `locked_until` should be set to approximately 30 seconds after the triggering failure. |
| **Actual** | `locked_until` is set to approximately 180 seconds after the triggering failure. |

#### Screenshot

![BUG-02-004](artifacts/tests/FR-02-login-lockout/screenshots/TC-BVA-01-lock-triggered.png)

---

### BUG-09-001 - Percent coupon formula produces a negative discount instead of a percentage discount

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-01, TC-05, TC-BVA-03, TC-BVA-08
**Severity:** High
**GitHub Issue:** [#17](https://github.com/lhlam2515/software-testing/issues/17)

#### Description

Applying any `percent`-type coupon (such as `SAVE10`, a 10 percent discount) does not divide the discount value by 100 as expected. Instead the calculation appears to multiply the order total by the raw discount value, producing a large negative "discount" that is bigger than the order itself. On a 500,000 VND order, `SAVE10` reports "Tiet kiem: -4,500,000 VND" and a final amount of 5,000,000 VND (nine times the original total), instead of an actual 50,000 VND discount and a final amount of 450,000 VND. This is a critical pricing defect since every percent coupon in the system is affected and customers would be massively overcharged if this reached production.

#### Steps to Reproduce

1. Add items totaling 500,000 VND to the cart and proceed to `/checkout`.
2. Apply the coupon code `SAVE10` (a 10 percent, active, non-expired coupon).
3. Observe the displayed discount and final total.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | `discount_amount = 50,000 VND` (10% of 500,000), `final_amount = 450,000 VND`. |
| **Actual** | `discount_amount = -4,500,000 VND`, `final_amount = 5,000,000 VND` (the total is inflated to nine times the original, not discounted). |

#### Screenshot

![BUG-09-001](artifacts/tests/FR-09-coupon/screenshots/BUG-09-001-percent-formula-wrong.png)

---

### BUG-09-002 - `/api/apply-coupon` accepts requests with no authentication token at all

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-08
**Severity:** High
**GitHub Issue:** [#18](https://github.com/lhlam2515/software-testing/issues/18)

#### Description

The coupon endpoint does not enforce authentication. A direct request to `POST /api/apply-coupon` with no `Authorization` header at all still returns HTTP 200 and successfully applies the coupon, exactly as if a logged-in user had sent it. This means anyone, without ever logging in, can probe coupon codes, check their validity and discount amounts, and potentially abuse coupon usage tracking tied to arbitrary user IDs.

#### Steps to Reproduce

1. Send `POST /api/apply-coupon` directly (e.g. via browser `fetch`) with a valid coupon code and order details, but omit the `Authorization` header entirely.
2. Observe the HTTP status and response body.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | The request should be rejected with HTTP 401 Unauthorized, since no token was supplied. |
| **Actual** | The request succeeds with HTTP 200 and the coupon is applied normally. |

#### Screenshot

![BUG-09-002](artifacts/tests/FR-09-coupon/screenshots/BUG-09-002-no-auth-accepted.png)

---

### BUG-09-003 - `/api/apply-coupon` accepts an invalid/malformed JWT

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-09
**Severity:** High
**GitHub Issue:** [#19](https://github.com/lhlam2515/software-testing/issues/19)

#### Description

Sending `POST /api/apply-coupon` with a clearly invalid bearer token (`Authorization: Bearer invalidtokenstring123abc`) is treated the same as a valid session, returning HTTP 200 with the coupon successfully applied. Combined with BUG-09-002, this confirms the endpoint performs no meaningful authentication check whatsoever, any token-shaped or token-less request is accepted.

#### Steps to Reproduce

1. Send `POST /api/apply-coupon` with `Authorization: Bearer invalidtokenstring123abc` and a valid coupon code and order details.
2. Observe the HTTP status and response body.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | The request should be rejected with HTTP 401/403 due to an invalid token. |
| **Actual** | The request succeeds with HTTP 200 and the coupon is applied normally. |

#### Screenshot

![BUG-09-003](artifacts/tests/FR-09-coupon/screenshots/BUG-09-003-invalid-jwt-accepted.png)

---

### BUG-09-004 - Fixed-amount coupon discount is not capped at the order total, producing a negative final amount

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-11
**Severity:** High
**GitHub Issue:** [#20](https://github.com/lhlam2515/software-testing/issues/20)

#### Description

When a `fixed`-type coupon's discount value is larger than the order's total amount, the service happily subtracts the full discount anyway, letting `final_amount` go negative. Using a coupon worth 100,000 VND on a 60,000 VND order, the API returns `discount_amount=100000` and `final_amount=-40000`. A negative amount payable makes no business sense and could be exploited to break checkout/payment logic downstream.

#### Steps to Reproduce

1. Create (or use) a `fixed`-type coupon with `discount_value = 100000` and `min_order_amount = 50000`.
2. Build an order/cart with `total_amount = 60000` (above the minimum, but below the discount value).
3. Apply the coupon.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | The discount should be capped at the order total, so `final_amount` should never go below 0 (e.g. `final_amount = 0`). |
| **Actual** | `discount_amount = 100,000 VND`, `final_amount = -40,000 VND`. |

#### Screenshot

![BUG-09-004](artifacts/tests/FR-09-coupon/screenshots/BUG-09-004-negative-final-amount.png)

---

### BUG-09-005 - Minimum order amount check uses strict greater-than instead of greater-than-or-equal

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-12, TC-BVA-02
**Severity:** Medium
**GitHub Issue:** [#21](https://github.com/lhlam2515/software-testing/issues/21)

#### Description

The `total_amount >= min_order_amount` rule is implemented as a strict `>` comparison. Two cases confirm this: with `min_order_amount = 0` and `total_amount = 0`, the request is rejected as "below minimum" even though `0 >= 0` should hold; and with `SAVE10`'s real threshold of 300,000 VND, an order of exactly 300,000 VND (the ON boundary) is also rejected. Orders that exactly match the coupon's minimum spend are wrongly turned away.

#### Steps to Reproduce

1. Apply `SAVE10` (min_order_amount = 300,000 VND) to an order whose total is exactly 300,000 VND.
2. Observe the response.
3. Separately, create a coupon with `min_order_amount = 0` and apply it to an order with `total_amount = 0`.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | An order total exactly equal to `min_order_amount` should be accepted (`total_amount >= min_order_amount`). |
| **Actual** | Both the 300,000-VND-exact case and the 0-VND-exact case are rejected with the "below minimum" error, as if the rule were `total_amount > min_order_amount`. |

#### Screenshot

![BUG-09-005](artifacts/tests/FR-09-coupon/screenshots/BUG-09-005-on-point-rejected.png)

---

### BUG-09-006 - Coupon code lookup is case-insensitive

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-05
**Severity:** Medium
**GitHub Issue:** [#22](https://github.com/lhlam2515/software-testing/issues/22)

#### Description

Typing the coupon code in lowercase (`save10`) is accepted and matched to the seeded `SAVE10` coupon exactly as if the case matched, returning the same `coupon_id`, discount amount and final amount. Coupon codes are typically expected to be case-sensitive identifiers, so this loose matching could lead to unexpected collisions between similarly-cased codes in the future, and it was not something the API/behavior explicitly documented.

#### Steps to Reproduce

1. Apply the coupon code as `save10` (all lowercase) to an order that otherwise qualifies for `SAVE10`.
2. Observe whether the coupon is recognized.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Coupon code matching should be exact/case-sensitive, so `save10` should be treated as a different (non-existent) code from `SAVE10`. |
| **Actual** | `save10` resolves to the same coupon as `SAVE10` (`coupon_id=1`) and applies the same discount. |

#### Screenshot

![BUG-09-006](artifacts/tests/FR-09-coupon/screenshots/BUG-09-006-lowercase-save10-accepted.png)

---

### BUG-09-007 - Checkout trusts a client-derived `total_amount` instead of recomputing it from the cart

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-13
**Severity:** High
**GitHub Issue:** [#30](https://github.com/lhlam2515/software-testing/issues/30)

#### Description

`POST /api/apply-coupon` accepts `total_amount` exactly as supplied by the client instead of independently recomputing it from the real cart contents, which conflicts with FR-08's mandate that the backend recompute the order total server-side. With a cart containing exactly 1x `Bàn phím cơ Keychron Q1` (real unit price and subtotal `4,000,000₫`), overwriting the checkout page's `Tổng tiền thanh toán (VND)` field to `500000` before applying `SAVE10` (`min_order_amount=300000`) makes the manipulated value clear the minimum-order threshold. The API accepts it and returns `final_amount=5000000` (further inflated by BUG-09-001's percent formula bug). Confirming the order via `Xác Nhận Thanh Toán` then persists the order with `total_amount=5000000` in the `orders` table, the value derived entirely from the manipulated client input, not from the real `4,000,000₫` cart subtotal. This is not just a UI preview glitch, the wrong amount is actually committed to the database, so a customer can set their own charged total by editing a client-controlled field before checkout.

#### Steps to Reproduce

1. Log in as `test@eshop.com`, add exactly 1x `Bàn phím cơ Keychron Q1` to the cart, and confirm `/cart` shows the real subtotal `4,000,000₫`.
2. Proceed to `/checkout`.
3. Overwrite the `Tổng tiền thanh toán (VND)` field with `500000` (below the real subtotal, but still `>= min_order_amount=300000` for `SAVE10`).
4. Enter `SAVE10` in the coupon field and click `Áp dụng`.
5. Click `Xác Nhận Thanh Toán` to complete the order.
6. Query the persisted order, e.g. `sqlite3 apps/backend/database.sqlite "SELECT * FROM orders ORDER BY id DESC LIMIT 1"`.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | The backend should independently recompute `total_amount` from the real cart contents (`4,000,000₫`) per FR-08, ignoring or rejecting any client-supplied `total_amount` that disagrees with it, so the persisted order total reflects the real cart value. |
| **Actual** | `POST /api/apply-coupon` accepts the manipulated `total_amount=500000` and returns `final_amount=5000000`; the confirmed order then persists `total_amount=5000000` in the database, a value derived entirely from client input rather than the real `4,000,000₫` cart subtotal. |

#### Screenshot

![BUG-09-007](artifacts/tests/FR-09-coupon/screenshots/BUG-09-007-client-total-trusted.png)

---

### BUG-16-001 - Admin-only CSV import route accepts a regular user's token

**Feature:** FR-16, CSV Product Import
**TC that found it:** TC-04
**Severity:** High
**GitHub Issue:** [#23](https://github.com/lhlam2515/software-testing/issues/23)

#### Description

The product import endpoint is supposed to be restricted to Admin accounts, but it accepts a valid JWT belonging to a regular (non-admin) user just as readily. Injecting a regular user's token into the Admin panel and importing a CSV file successfully creates a new product, no role check rejects the request. This is a privilege escalation issue: any authenticated customer could bulk-create products in the storefront.

#### Steps to Reproduce

1. Log in as a regular (non-admin) user via `POST /api/login` to obtain a token.
2. Inject that token into the Admin UI's local storage and reload the import screen.
3. Import a CSV with one valid product row.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | The request should be rejected with HTTP 403 Forbidden, since the token does not belong to an Admin. |
| **Actual** | HTTP 200, `inserted=1`, the product is created and appears in `GET /api/products`. |

#### Screenshot

![BUG-16-001](artifacts/tests/FR-16-csv-import/screenshots/BUG-16-001-non-admin-accepted.png)

---

### BUG-16-002 - `price > 0` is not validated during CSV import

**Feature:** FR-16, CSV Product Import
**TC that found it:** TC-08, TC-09, TC-10, TC-11, TC-12, TC-18, TC-BVA-01
**Severity:** High
**GitHub Issue:** [#24](https://github.com/lhlam2515/software-testing/issues/24)

#### Description

The import route never checks that a row's `price` is a positive number. Rows with `price = 0`, negative prices, non-numeric prices, and even rows missing the `price` field entirely are all accepted and inserted as products without any validation error. This was reproduced across seven separate test cases, including a batch where every single row was invalid (all three rows were still inserted successfully) and a mixed batch with one invalid row (which should have triggered an all-or-nothing rollback but instead committed everything). The missing validation defeats the documented atomic-rollback behavior for invalid rows, since a row is never classified as invalid in the first place.

#### Steps to Reproduce

1. Log in as Admin and open the CSV import screen.
2. Import a CSV row with `price = 0` (or a negative value, a non-numeric value, or an empty `price` field).
3. Observe the import result and check whether the product was created.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Rows with `price <= 0`, non-numeric, or missing `price` should be rejected with a validation error (e.g. "Row N: invalid price"), and in a mixed batch the entire import should roll back. |
| **Actual** | Every invalid-price variant is accepted with HTTP 200 and `inserted=1` (or more, for batches), and the product is created with the bad price value stored as-is. |

#### Screenshot

![BUG-16-002](artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-08-invalid-price-accepted.png)

---

### BUG-16-003 - Import accepts a non-existent `category_id`

**Feature:** FR-16, CSV Product Import
**TC that found it:** TC-15
**Severity:** High
**GitHub Issue:** [#25](https://github.com/lhlam2515/software-testing/issues/25)

#### Description

The import route does not verify that `category_id` references an existing category. Submitting a row with `category_id = 99999` (confirmed absent from `GET /api/categories`) is still accepted and creates the product with that dangling foreign key. This can leave the catalog in an inconsistent state where products reference categories that do not exist, which may break category-filtered browsing or admin category management downstream.

#### Steps to Reproduce

1. Confirm via `GET /api/categories` that `category_id = 99999` does not exist.
2. Import a CSV row referencing `category_id = 99999` with an otherwise valid product.
3. Check the import result and the created product's stored `category_id`.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | The row should be rejected with a validation error indicating the category does not exist. |
| **Actual** | HTTP 200, `inserted=1`, and the product is created referencing the non-existent `category_id = 99999`. |

#### Screenshot

![BUG-16-003](artifacts/tests/FR-16-csv-import/screenshots/BUG-16-003-invalid-category-accepted.png)

---

### BUG-16-004 - Import does not enforce the 255-character `name` limit shared with FR-15

**Feature:** FR-16, CSV Product Import
**TC that found it:** TC-14, TC-BVA-05
**Severity:** Medium
**GitHub Issue:** [#26](https://github.com/lhlam2515/software-testing/issues/26)

#### Description

FR-15 specifies a 255-character maximum for a product's `name`, but the CSV import route accepts names of 256 characters (and presumably longer) without any rejection or truncation. Because product creation is shared functionality between FR-15 (manual entry) and FR-16 (bulk import), this is a cross-feature invariant violation, imported products can bypass a length constraint that would otherwise be enforced when creating a product manually.

#### Steps to Reproduce

1. Prepare a CSV row with a `name` field of 256 characters.
2. Import it as Admin.
3. Check whether the product was created and inspect the stored `name` length.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | The row should be rejected (or the name truncated) to respect the 255-character limit defined in FR-15. |
| **Actual** | HTTP 200, `inserted=1`, and the product is created with `name.length = 256`. |

#### Screenshot

![BUG-16-004](artifacts/tests/FR-16-csv-import/screenshots/TC-14-name-256-gap-confirmed.png)

---

### BUG-16-005 - Admin UI does not enforce the `.csv` file extension

**Feature:** FR-16, CSV Product Import
**TC that found it:** TC-19
**Severity:** Low
**GitHub Issue:** [#27](https://github.com/lhlam2515/software-testing/issues/27)

#### Description

The SRS states that imported files must have a `.csv` extension, but the Admin UI's file picker accepts a `.txt` file with identical CSV-formatted content just as readily as a real `.csv` file. Both produce the same preview table, the same successful import, and an identical JSON request body over the network. The file-extension requirement exists only in the spec, not in the actual client-side check.

#### Steps to Reproduce

1. Prepare two files with byte-identical CSV content: `products.csv` and `products.txt`.
2. In the Admin import screen, choose `products.txt` via the file picker.
3. Observe whether the file is accepted, previewed, and successfully imported.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | The file picker or the UI should reject `products.txt` because it does not have a `.csv` extension. |
| **Actual** | `products.txt` is accepted, previewed, and imported exactly like a `.csv` file (`Import hoan tat: 1/1 san pham duoc them`). |

#### Screenshot

![BUG-16-005](artifacts/tests/FR-16-csv-import/screenshots/TC-19-txt-extension-accepted-preview.png)

---

### BUG-20-001 - Backend allows cancelling an order in `shipping` status

**Feature:** FR-20, Cancel Order (Mobile)
**TC that found it:** TC-07, TC-BVA-02
**Severity:** High
**GitHub Issue:** [#28](https://github.com/lhlam2515/software-testing/issues/28)

#### Description

The mobile UI correctly hides the `Huy don` (Cancel) button once an order reaches `shipping` status, matching the SRS rule that customers may only self-cancel `pending` or `confirmed` orders. However, the restriction is only enforced on the client. Calling `PUT /api/orders/:id/cancel` directly against a `shipping` order still succeeds with HTTP 200 and flips the order to `canceled`. This looks like the backend uses a deny-list check (block only `delivered`/`canceled`) instead of the correct allow-list (`pending`/`confirmed` only), so any user who bypasses the UI (e.g. via direct API calls, or a future UI bug) can cancel an order that is already out for delivery.

#### Steps to Reproduce

1. Create an order and advance it through the Admin API to `shipping` status.
2. Confirm the mobile UI shows no `Huy don` button for this order.
3. Send `PUT /api/orders/:id/cancel` directly against this order using the owning user's token.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | The backend should reject the cancel request with HTTP 400 ("Cannot cancel this order."), the same as it does for `delivered` orders. |
| **Actual** | HTTP 200, `{"message":"Order canceled successfully"}`, and the order's status changes to `canceled`. |

#### Screenshot

![BUG-20-001](artifacts/tests/FR-20-cancel-order-mobile/screenshots/BUG-20-001-07-shipping-cancel-accepted.png)

---

### BUG-20-002 - Order status labels do not use distinct colors as required by FR-11

**Feature:** FR-20, Cancel Order (Mobile)
**TC that found it:** TC-10
**Severity:** Low
**GitHub Issue:** [#29](https://github.com/lhlam2515/software-testing/issues/29)

#### Description

FR-11 explicitly requires that order status text be "translated to Vietnamese and visually distinguished by color" ("phan biet mau sac"). The Vietnamese-translation half is implemented correctly (Cho xac nhan, Da xac nhan, Dang giao, Da giao, Da huy), but every single status renders with identical styling: `color: rgb(0, 0, 0)`, transparent background, and no border. A user scanning their order history cannot tell any status apart from another by appearance alone, they have to read the text carefully.

#### Steps to Reproduce

1. Log in on the mobile UI as a user with orders in multiple statuses (`pending`, `confirmed`, `shipping`, `delivered`, `canceled`).
2. Open "Lich su don hang" (order history).
3. Inspect the computed style of each status label (e.g. via `getComputedStyle()` in DevTools).

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Each order status should render with a distinct color and/or background per FR-11 (e.g. yellow for pending, blue for confirmed, red for canceled, green for delivered). |
| **Actual** | All five statuses render with identical `color: rgb(0, 0, 0)`, `background-color: rgba(0, 0, 0, 0)`, and `border-width: 0px`, with no visual differentiation whatsoever. |

#### Screenshot

![BUG-20-002](artifacts/tests/FR-20-cancel-order-mobile/screenshots/BUG-20-002-status-labels-same-color.png)

---
