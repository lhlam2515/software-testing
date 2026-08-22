# Bug Report - HW06

**Tester:** Le Hoang Lam (23127216)
**SUT:** EShop, [github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut)
**GitHub Issues:** [github.com/lhlam2515/software-testing/issues](https://github.com/lhlam2515/software-testing/issues)
**Total bugs found:** 11 (9 AI-found, 2 Beyond AI — one each on FR-02 and FR-08)

---

## Scope

Bugs below were surfaced by executing the audited, data-driven Postman/Newman packages for
the three selected APIs (`POST /api/login` - FR-02, `POST /api/checkout` - FR-08,
`POST`/`PUT`/`DELETE /api/products` - FR-15) against the live `apps/` backend, per
REQUIREMENTS.md section 6. Each row's **Found By** column records whether the failing case
traces to an AI-generated `tc_id` (`AI`) or to a human-added case / agent SUT-source
inspection during triage (`Beyond AI`), per section 6 items 3 and 5.

---

## Bug Summary

| Bug ID | API | Severity | Found By | Status | GitHub Issue |
| ------ | --- | -------- | -------- | ------ | ------------- |
| BUG-FR02-01 | `POST /api/login` | Medium | Beyond AI | Open | [#44](https://github.com/lhlam2515/software-testing/issues/44) |
| BUG-FR02-02 | `POST /api/login` | Medium | AI | Open | [#45](https://github.com/lhlam2515/software-testing/issues/45) |
| BUG-FR02-03 | `POST /api/login` | Critical | AI | Open | [#46](https://github.com/lhlam2515/software-testing/issues/46) |
| BUG-FR02-04 | `POST /api/login` | High | AI | Open | [#47](https://github.com/lhlam2515/software-testing/issues/47) |
| BUG-FR08-01 | `POST /api/checkout` | High | Beyond AI | Open | [#48](https://github.com/lhlam2515/software-testing/issues/48) |
| BUG-FR08-02 | `POST /api/checkout` | High | AI | Open | [#49](https://github.com/lhlam2515/software-testing/issues/49) |
| BUG-FR08-03 | `POST /api/checkout` | High | AI | Open | [#50](https://github.com/lhlam2515/software-testing/issues/50) |
| BUG-FR08-04 | `POST /api/checkout` | High | AI | Open | [#51](https://github.com/lhlam2515/software-testing/issues/51) |
| BUG-FR15-01 | `POST /api/products` | Critical | AI | Open | [#52](https://github.com/lhlam2515/software-testing/issues/52) |
| BUG-FR15-02 | `PUT /api/products/:id` | Critical | AI | Open | [#53](https://github.com/lhlam2515/software-testing/issues/53) |
| BUG-FR15-03 | `DELETE /api/products/:id` | Critical | AI | Open | [#54](https://github.com/lhlam2515/software-testing/issues/54) |

**Severity distribution:** Critical: 4, High: 5, Medium: 2, Low: 0

---

## Detailed Findings

### BUG-FR02-01 - Failed-login counter increments by 2, locking the account after 2 attempts instead of 3

**API:** `POST /api/login`
**Found By:** Beyond AI
**Severity:** Medium
**GitHub Issue:** [#44](https://github.com/lhlam2515/software-testing/issues/44)

#### Description

Account lockout triggers after 2 consecutive wrong-password attempts instead of the
documented 3, because the failed-attempt counter is incremented by 2 per failure instead of 1.

#### Steps to Reproduce

1. Reset `test@eshop.com` to `login_attempts=0` / unlocked.
2. `POST /api/login` with a wrong password, twice in a row.
3. Observe `login_attempts` and whether the account locks after only 2 failures.

#### Root Cause

`server.js:54` sets `const newAttempts = user.login_attempts + 2;` inside the wrong-password
branch of `POST /api/login`, then locks when `newAttempts >= 3` (`server.js:56`). Evidence:
TC-16 sequence, `reports/newman-report.json` iteration 15.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `srs.md` line 42, the account should only lock after 3 or more consecutive failed attempts ("Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa"). |
| **Actual** | The counter jumps `0 -> 2` after attempt 1, then `2 -> 4` after attempt 2, crossing the `>= 3` threshold and locking the account on the 2nd failed attempt. |

#### Screenshot

![GitHub Issue #44](assets/issues/BUG-FR02-01-issue-44.png)

---

### BUG-FR02-02 - Account lockout lasts 180 seconds instead of the documented 30-second window

**API:** `POST /api/login`
**Found By:** AI
**Severity:** Medium
**GitHub Issue:** [#45](https://github.com/lhlam2515/software-testing/issues/45)

#### Description

Account lockout duration is 180 seconds (3 minutes) instead of the documented 30-second
demo-environment window.

#### Steps to Reproduce

1. Trigger a lockout (3 consecutive wrong-password `POST /api/login` requests for
   `test@eshop.com`).
2. Wait 31 seconds.
3. Retry with correct credentials.

#### Root Cause

`server.js:57` sets `lockedUntil = new Date(Date.now() + 180000).toISOString();`. Evidence:
TC-15, `reports/newman-report.json` iteration 14 - still `403` "Tài khoản đã bị khóa" at
T=31s. The same root cause cascades into TC-19, TC-21, TC-23, TC-36, TC-38a, all failing with
the account still locked well past their documented 30s wait.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `srs.md` line 42, the lock lasts 30 seconds in the demo environment. |
| **Actual** | The lock persists for 180 seconds; a login attempt at T=31s (and beyond, until ~T=180s) is rejected with `403` `{"error":"Tài khoản đã bị khóa. Vui lòng thử lại sau."}` instead of succeeding. |

#### Screenshot

![GitHub Issue #45](assets/issues/BUG-FR02-02-issue-45.png)

---

### BUG-FR02-03 - Successful login responses leak the user's plaintext password

**API:** `POST /api/login`
**Found By:** AI
**Severity:** Critical
**GitHub Issue:** [#46](https://github.com/lhlam2515/software-testing/issues/46)

#### Description

Successful login responses embed the user's plaintext password in the returned `user` object.

#### Steps to Reproduce

1. `POST /api/login` with `test@eshop.com` / `Test1234!`.
2. Inspect the response body's `user` object.

#### Root Cause

`server.js:52` responds with `res.json({ message: "Login successful", token, user })` where
`user` is the raw DB row, including the `password` column. Evidence: TC-01,
`reports/newman-report.json` iteration 0. Reproduced identically on TC-07, TC-37 (admin), and
TC-39.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `srs.md` FR-02's security requirement and `test-data.csv` TC-01's `expected_body_note` ("user must not contain password field"), the response body must not contain a password or password-hash field. |
| **Actual** | Response body is `{"message":"Login successful","token":"...","user":{"id":2,"name":"Test User","email":"test@eshop.com","password":"Test1234!","role":"user",...}}` - the plaintext password is returned verbatim. |

#### Screenshot

![GitHub Issue #46](assets/issues/BUG-FR02-03-issue-46.png)

---

### BUG-FR02-04 - Malformed JSON / missing Content-Type crashes login with a raw stack trace instead of a structured error

**API:** `POST /api/login`
**Found By:** AI
**Severity:** High
**GitHub Issue:** [#47](https://github.com/lhlam2515/software-testing/issues/47)

#### Description

Malformed JSON bodies or requests missing `Content-Type` crash with an unhandled exception,
returning Express's default HTML error page with a full stack trace and absolute server file
paths instead of a structured JSON error.

#### Steps to Reproduce

1. Case A: `POST /api/login` with `Content-Type: application/json` and body
   `{"email":"test@eshop.com","password":}` (evidence: TC-34, `reports/newman-report.json`
   iteration 33) -> `400` HTML page with the body-parser `SyntaxError` stack trace.
2. Case B: `POST /api/login` with no `Content-Type` header (evidence: TC-35,
   `reports/newman-report.json` iteration 34) -> `500` HTML page with
   `TypeError: Cannot destructure property 'email' of 'req.body' as it is undefined` and a
   full stack trace including local filesystem paths.

#### Root Cause

No error-handling middleware wraps body-parser (which throws `SyntaxError` on malformed
JSON) or the `const { email, password } = req.body` destructuring in `server.js:33` (which
throws `TypeError` when `req.body` is undefined).

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `test-data.csv` SC-14/SC-15 oracle, both the malformed-JSON and missing-Content-Type inputs should return a structured JSON error, not a raw stack trace / HTML page. |
| **Actual** | Both cases return `<!DOCTYPE html>...<pre>SyntaxError/TypeError...</pre>` pages containing the full Node.js stack trace and absolute server file paths (e.g. `/home/.../apps/backend/server.js:33:11`) - an information-disclosure and unhandled-crash defect. |

#### Screenshot

![GitHub Issue #47](assets/issues/BUG-FR02-04-issue-47.png)

---

### BUG-FR08-01 - Checkout accepts an empty shipping_address and still creates an order

**API:** `POST /api/checkout`
**Found By:** Beyond AI
**Severity:** High
**GitHub Issue:** [#48](https://github.com/lhlam2515/software-testing/issues/48)

#### Description

Checkout accepts an empty-string `shipping_address` with no server-side validation and
persists an order with a blank address.

#### Steps to Reproduce

1. Log in as `test@eshop.com`.
2. `POST /api/checkout` with body `{"shipping_address":"","total_amount":<real cart total>}`
   (evidence: TC-02, `reports/newman-report.json`).
3. Compare User A's order count immediately before/after the request.

#### Root Cause

`server.js:297-300` destructures `shipping_address` from `req.body` and inserts it into the
`orders` table verbatim, with no non-empty/format check. TC-37 (analysis-only, iteration 37)
diffs User A's order count immediately before/after TC-02..TC-10/TC-13 and found only TC-02's
request changed the count (34 -> 33 orders before the run, i.e. an order was created).

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `srs.md` FR-08 (lines 104-108) and `test-data.csv` TC-37's oracle (backed by `schema-cases.md` SC-08), none of the `shipping_address`/`total_amount` validation-error attempts, TC-02 included, may create an order. |
| **Actual** | The empty-`shipping_address` request returned success and inserted a new row into `orders` with `shipping_address=''`, increasing User A's order count by one. |

#### Screenshot

![GitHub Issue #48](assets/issues/BUG-FR08-01-issue-48.png)

---

### BUG-FR08-02 - Checkout on an empty cart still creates a pending order with total_amount 0

**API:** `POST /api/checkout`
**Found By:** AI
**Severity:** High
**GitHub Issue:** [#49](https://github.com/lhlam2515/software-testing/issues/49)

#### Description

Checkout on a 0-item cart still creates a pending order with `total_amount` 0 instead of being
rejected.

#### Steps to Reproduce

1. Log in as `test@eshop.com`, empty the cart.
2. `POST /api/checkout` with body
   `{"shipping_address":"123 Le Loi, TP.HCM","total_amount":0}` (evidence: TC-14,
   `reports/newman-report.json`).
3. Compare User A's order count immediately before/after the request.

#### Root Cause

`server.js:297-300` has no check that the user's cart is non-empty before inserting into
`orders`. TC-31 (analysis-only, iteration 30) compares User A's order count immediately
before/after TC-14 and found it rose from 45 to 46.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `test-data.csv` TC-31's oracle (`schema-cases.md` SC-06/SC-07/SC-08, `srs.md` FR-08 line 108), an empty-cart checkout attempt must not create an order or otherwise alter state beyond the pre-existing empty cart. |
| **Actual** | The empty-cart checkout returned success and inserted a new pending order (`total_amount` 0) into the `orders` table, raising the order count from 45 to 46. |

#### Screenshot

![GitHub Issue #49](assets/issues/BUG-FR08-02-issue-49.png)

---

### BUG-FR08-03 - Successful checkout does not clear the cart

**API:** `POST /api/checkout`
**Found By:** AI
**Severity:** High
**GitHub Issue:** [#50](https://github.com/lhlam2515/software-testing/issues/50)

#### Description

A successful checkout does not clear the user's cart, so the same items remain checkoutable
again (duplicate-order risk).

#### Steps to Reproduce

1. Log in as `test@eshop.com` with a fresh non-empty cart (4 items).
2. `POST /api/checkout` with the matching `shipping_address`/`total_amount` (evidence: TC-16,
   `reports/newman-report.json` iteration 15).
3. `GET /api/cart` immediately after.

#### Root Cause

`server.js:297-306` inserts the order but never touches `userCarts[userId]` afterward, unlike
`POST /api/cart` which pushes directly into that same in-memory array.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `test-data.csv` TC-16's oracle (`state-model.md` S-01, `srs.md` FR-08 lines 104-108), the follow-up `GET /api/cart` must return an empty cart after a successful checkout. |
| **Actual** | The follow-up `GET /api/cart` still returned all 4 pre-checkout items unchanged; the cart was never cleared. |

#### Screenshot

![GitHub Issue #50](assets/issues/BUG-FR08-03-issue-50.png)

---

### BUG-FR08-04 - Malformed JSON / non-JSON Content-Type crashes checkout with a raw stack trace instead of a structured error

**API:** `POST /api/checkout`
**Found By:** AI
**Severity:** High
**GitHub Issue:** [#51](https://github.com/lhlam2515/software-testing/issues/51)

#### Description

Malformed JSON bodies or a non-JSON `Content-Type` crash checkout with an unhandled exception,
returning Express's default HTML error page with a full stack trace and absolute server file
paths instead of a structured JSON error - the same unhandled-crash/information-disclosure
pattern already recorded for `POST /api/login` as BUG-FR02-04.

#### Steps to Reproduce

1. Case A: `POST /api/checkout`, `Content-Type: application/json`, body
   `{"shipping_address":"x","total_amount":}` (evidence: TC-33, `reports/newman-report.json`
   iteration 32) -> `400` HTML page with the body-parser `SyntaxError` stack trace.
2. Case B: `POST /api/checkout`, `Content-Type: text/plain` (or header omitted), same JSON
   string as the body (evidence: TC-34 iteration 33 and TC-41 iteration 41) -> `500` HTML page
   with `TypeError: Cannot destructure property 'total_amount' of 'req.body' as it is undefined`
   and the full stack trace including local filesystem paths.

#### Root Cause

No error-handling middleware wraps body-parser (throws `SyntaxError` on malformed JSON) or
the `const { total_amount, shipping_address } = req.body` destructuring in `server.js:298`
(throws `TypeError` when `req.body` is undefined because `Content-Type` isn't
`application/json`).

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `test-data.csv` SC-10/SC-11 oracle, both the malformed-JSON and wrong/missing-`Content-Type` inputs should return a structured error, not a raw stack trace / HTML page. |
| **Actual** | All three cases return `<!DOCTYPE html>...<pre>SyntaxError/TypeError...</pre>` pages containing the full Node.js stack trace and absolute server file paths (e.g. `/home/.../apps/backend/server.js:299:11`). |

#### Screenshot

![GitHub Issue #51](assets/issues/BUG-FR08-04-issue-51.png)

---

### BUG-FR15-01 - POST /api/products has no authentication/authorization middleware

**API:** `POST /api/products`
**Found By:** AI
**Severity:** Critical
**GitHub Issue:** [#52](https://github.com/lhlam2515/software-testing/issues/52)

#### Description

`POST /api/products` has no authentication/authorization middleware at all, so requests with
no token, a syntactically invalid token, a valid non-admin (customer) token, or a JWT with a
tampered signature are all accepted and the product is created.

#### Steps to Reproduce

`POST http://127.0.0.1:3000/api/products` with body
`{"name":"Áo thun nam","price":100000,"category_id":<valid category id>,"description":"Mô tả sản phẩm","imageUrl":"http://example.com/img.png"}` and:

1. No `Authorization` header (TC-25, trace SEC-C-01, `reports/newman-report.json` iteration 25).
2. `Authorization: Bearer not-a-real-jwt-string` (TC-28, SEC-C-04, iteration 28).
3. A valid customer-role JWT (TC-30, SEC-C-06, iteration 30).
4. A well-formed JWT claiming `role='admin'` with an invalid signature (TC-44, iteration 44).

#### Root Cause

`server.js:167` defines `app.post("/api/products", (req, res) => {...})` with zero
middleware, unlike the sibling admin route `app.post("/api/categories", authenticateToken, ...)`
at `server.js:249`. Same defect additionally reproduced by TC-02/TC-06/TC-09/TC-10/TC-13
(EP/BVA rows, iterations 2/6/9/10/13), which sent `Bearer undefined` after the collection
fixture's own admin login failed on a stale hardcoded password (a test-artifact defect, not
filed as an SUT bug) - the endpoint accepted that garbage token too, for the same root-cause
reason: no middleware checks it.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `srs.md` FR-12 line 177 (a valid admin JWT is required for this endpoint) and SEC-02 line 279 (role enforcement), all cases above must be rejected (`401`/`403`) with no product created. |
| **Actual** | All requests returned `200` with body `{"message":"Product created","id":<n>}` and the product was persisted. The "no product created" catalog-count assertion failed for every case (count rose by exactly 1 each time), e.g. TC-25: count 51 vs expected 50; TC-28: 51 vs 50; TC-30: 52 vs 51; TC-44: 55 vs 54. |

#### Screenshot

![GitHub Issue #52](assets/issues/BUG-FR15-01-issue-52.png)

---

### BUG-FR15-02 - PUT /api/products/:id has no authentication/authorization middleware

**API:** `PUT /api/products/:id`
**Found By:** AI
**Severity:** Critical
**GitHub Issue:** [#53](https://github.com/lhlam2515/software-testing/issues/53)

#### Description

`PUT /api/products/:id` has no authentication/authorization middleware, so a request with no
`Authorization` header still updates the target product.

#### Steps to Reproduce

1. `PUT http://127.0.0.1:3000/api/products/<P1 id>` with no `Authorization` header and body
   `{"name":"Áo thun nam","price":100000,"category_id":<valid>,"description":"Mô tả sản phẩm","imageUrl":"http://example.com/img.png"}`
   (TC-26, trace SEC-C-02, `reports/newman-report.json` iteration 26).
2. `GET` the same product id afterward.

#### Root Cause

`server.js:179` defines `app.put("/api/products/:id", (req, res) => {...})` with no
`authenticateToken` middleware. Same defect reproduced by TC-18/TC-19 (BVA rows, iterations
18/19) via the same broken-fixture-token mechanism noted in BUG-FR15-01.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `srs.md` FR-12 line 177, `PUT` must require a valid admin JWT and reject unauthenticated requests, leaving the target product's fields unchanged. |
| **Actual** | The request returned `200` `{"message":"Product updated"}` and the update was persisted. The follow-up `GET` on the same product id returned the new field values instead of the original ones - assertion failure: expected the original body (name "Áo thun nam", ...) to deeply equal itself but observed the mutated body. |

#### Screenshot

![GitHub Issue #53](assets/issues/BUG-FR15-02-issue-53.png)

---

### BUG-FR15-03 - DELETE /api/products/:id has no authentication/authorization middleware

**API:** `DELETE /api/products/:id`
**Found By:** AI
**Severity:** Critical
**GitHub Issue:** [#54](https://github.com/lhlam2515/software-testing/issues/54)

#### Description

`DELETE /api/products/:id` has no authentication/authorization middleware, so a request with
no `Authorization` header still deletes the target product.

#### Steps to Reproduce

1. `DELETE http://127.0.0.1:3000/api/products/<P1 id>` with no `Authorization` header
   (TC-27, trace SEC-C-03, `reports/newman-report.json` iteration 27).
2. `GET` the same product id afterward.

#### Root Cause

`server.js:191` defines `app.delete("/api/products/:id", (req, res) => {...})` with no
`authenticateToken` middleware. Same defect reproduced by TC-24 (DELETE-then-GET-then-DELETE
sequence on fixture product C, iteration 24) via the broken-fixture-token mechanism noted in
BUG-FR15-01.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `srs.md` FR-12 line 177, `DELETE` must require a valid admin JWT and reject unauthenticated requests, leaving the target product intact ("P1 still exists"). |
| **Actual** | The request returned `200` `{"message":"Product deleted"}` and the row was removed. The follow-up `GET` on the same product id returned `{}` instead of the original product body, confirming the delete executed with zero authentication. TC-24's related "C is not retrievable after first delete" assertion additionally surfaced that `GET /api/products/:id` (`server.js:161`) hardcodes `if (!row) return res.status(200).json({})` for a missing id - so even though the unauthenticated delete succeeds, the follow-up not-found check can never observe a `>=400` status from this endpoint. |

#### Screenshot

![GitHub Issue #54](assets/issues/BUG-FR15-03-issue-54.png)

---

All 11 rows above have a GitHub Issue opened (issues #44-#54) with a full-page screenshot of
the issue page attached, per REQUIREMENTS.md section 6 item 5.
