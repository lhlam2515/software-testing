# Bug Report - HW06

**Tester:** Le Hoang Lam (23127216)
**SUT:** EShop, [github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut)
**GitHub Issues:** [github.com/lhlam2515/software-testing/issues](https://github.com/lhlam2515/software-testing/issues)
**Total bugs found:** 15 (11 AI-found, 4 Beyond AI)

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
| BUG-FR08-05 | POST /api/apply-coupon | High | Beyond AI | Open | Pending |
| BUG-FR08-06 | GET /api/orders/:id | Critical | Beyond AI | Open | Pending |
| BUG-FR15-04 | POST /api/products, PUT /api/products/:id | High | AI | Open | Pending |
| BUG-FR15-05 | GET /api/products/:id | Medium | AI | Open | Pending |

**Severity distribution:** Critical: 5, High: 7, Medium: 3, Low: 0

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
4. Stronger variant (TC-44): send wrong, wrong, **correct**, wrong, wrong, then a 6th
   request with correct credentials. Per `srs.md` line 42 the successful 3rd request breaks
   the "liên tiếp" (consecutive) chain, so no lock should ever trigger.

#### Root Cause

`server.js:54` sets `const newAttempts = user.login_attempts + 2;` inside the wrong-password
branch of `POST /api/login`, then locks when `newAttempts >= 3` (`server.js:56`). Evidence:
TC-16 sequence, `reports/newman-report.json` iteration 15; TC-36 (iteration 35) fails with
`403` where its `counter=2` precondition documents one remaining attempt.

TC-44 (iteration 50, added by the Pass 2 audit) makes the defect direct: the account locks on
the 2nd wrong password, so the sequence never reaches the successful 3rd request that would
have tested the "consecutive" semantics at all. The `srs.md` line 41 requirement that the
counter increment by "đúng 1 đơn vị" is violated independently of the lock threshold.

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
T=31s.

The same root cause cascades into every row whose precondition assumes the lock has expired
after the documented 30-second wait: TC-19 (`counter=1`, no lock of its own), TC-21 and TC-23
(both documented as "wait out TC-20's 30s lock"), TC-38a (`counter=0`, unlocked) and, through
it, TC-38b, which receives no token and gets `401` from the protected endpoint. TC-45
(iteration 51, added by the Pass 2 audit) isolates the timing directly: it locks the account
at T=0, makes wrong-password attempts inside the window at T=10s and T=15s, then retries with
correct credentials at T=31s and still receives `403`.

TC-36 is **not** attributable to this defect - its `counter=2` precondition means the account
is already locked by BUG-FR02-01's `+2` increment before any wait applies.

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

#### Evidence location after the Pass 2 re-run

The Pass 2 audit demoted TC-32, TC-33, TC-34 and TC-41 to characterization rows: they now
record `observed_stack_or_html_*`, `observed_content_type_*` and
`observed_body_parses_as_json_*` instead of asserting on them, because `srs.md` SEC-05 names
only the SQLi probes (TC-25/26/27) as cases where the no-stack-trace expectation is stated.
TC-34 and TC-35 therefore show as **PASS** in the current
`reports/newman-report.json` - that is an oracle change in the suite, not a fix.

The defect still reproduces unchanged in that same run:

| Case | Iteration | Observed |
| ---- | --------- | -------- |
| TC-34 (malformed JSON) | 33 | `400` + `<!DOCTYPE html>…<pre>SyntaxError…` |
| TC-35 (no `Content-Type`) | 34 | `500` + `<!DOCTYPE html>…<pre>TypeError…` |

The original failing-assertion evidence is preserved at
`homeworks/HW06/artifacts/postman/fr-02-login/reports/archive/20260828T194022Z/newman-report.json`.
This entry stays **Open**: the behaviour is unchanged, only the way the suite records it.

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
at `server.js:249`. Nothing in the handler inspects the `Authorization` header, so token
presence, syntactic validity, signature, and role are all irrelevant to the outcome.

Confirmed independently of the collection by four direct requests carrying an otherwise
identical body, which returned `200` in every case: no `Authorization` header; `Authorization:
Bearer not.a.jwt`; a valid customer-role JWT; and a valid admin JWT. Only the last of these
should have succeeded.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `srs.md` FR-12 line 177 (a valid admin JWT is required for this endpoint) and SEC-02 line 279 (role enforcement), all cases above must be rejected (`401`/`403`) with no product created. |
| **Actual** | All requests returned `200` with body `{"message":"Product created","id":<n>}` and the product was persisted. The "no product created" catalog-count assertion failed for every case (count rose by exactly 1 each time): TC-25: count 25 vs expected 24; TC-28: 25 vs 24; TC-30: 26 vs 25; TC-44: 29 vs 28. TC-43's aggregate check (`SC-09`, "every referenced auth/role attempt was refused") failed on the same evidence with `TC-25 was not refused: expected 200 to be at least 400`. |

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
`authenticateToken` middleware, so an unauthenticated caller reaches the `UPDATE` statement
directly.

TC-18/TC-19 were previously cross-referenced here as reproducing this same defect. That
cross-reference was withdrawn after the collection fixture was corrected: both rows send a
valid admin JWT, and they now fail for missing field validation, which is tracked separately
as BUG-FR15-04. TC-26 remains the evidence for this entry.

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
`authenticateToken` middleware, so an unauthenticated caller reaches the `DELETE` statement
directly. Confirmed independently of the collection: a `DELETE` with no `Authorization`
header returned `200` and the row was gone from `apps/backend/database.sqlite` afterward.

TC-24 was previously cross-referenced here as reproducing this same defect. That
cross-reference was withdrawn after the collection fixture was corrected: TC-24 now fails
because `GET /api/products/:id` answers `200 {}` for a missing id, tracked separately as
BUG-FR15-05. TC-27 remains the evidence for this entry.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `srs.md` FR-12 line 177, `DELETE` must require a valid admin JWT and reject unauthenticated requests, leaving the target product intact ("P1 still exists"). |
| **Actual** | The request returned `200` `{"message":"Product deleted"}` and the row was removed from the database, confirming the delete executed with zero authentication. The follow-up `GET` on the same product id returned `{}` rather than a not-found status; that response-shape defect is tracked separately as BUG-FR15-05. |

#### Screenshot

![GitHub Issue #54](assets/issues/BUG-FR15-03-issue-54.png)

---

### BUG-FR08-05 - Percent coupon discount is computed with the wrong formula, returning a negative discount and a final amount ten times the cart total

**API:** `POST /api/apply-coupon`
**Found By:** Beyond AI
**Severity:** High
**GitHub Issue:** Pending

#### Description

For a percent-type coupon the handler treats discount_value as a fraction instead of a percentage, so the discount comes back negative and the final amount is larger than the original total.

#### Steps to Reproduce

1. Log in as the seed user test@eshop.com and populate the cart to a total of 500000 via POST /api/cart.
2. Send POST /api/apply-coupon with body {"code":"SAVE10","total_amount":500000,"user_id":2}.
3. Observe the 200 OK response body. Evidence: TC-42a, iteration 43 of the FR-08 Newman run.

#### Root Cause

apps/backend/server.js line 397 computes the percent discount as Math.floor(total_amount * (1 - coupon.discount_value)). SAVE10 stores discount_value = 10 (a percentage, not a fraction), so the expression evaluates to 500000 * (1 - 10) = -4500000. The correct expression for a percent coupon is total_amount * discount_value / 100. final_amount is then derived from this wrong discount, producing 5000000.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | srs.md FR-09 lines 124 and 126 specify a 10% discount on a 500000 total: discount_amount 50000 and final_amount 450000. |
| **Actual** | HTTP 200 with {"success":true,"coupon_id":1,"discount_amount":-4500000,"final_amount":5000000,"message":"Ap dung thanh cong! Giam 10%"} - the discount is negative and the final amount is ten times the cart total. |

#### Screenshot

Pending

---

### BUG-FR08-06 - GET /api/orders/:id has no authentication or ownership check, exposing any user's order to anyone

**API:** `GET /api/orders/:id`
**Found By:** Beyond AI
**Severity:** Critical
**GitHub Issue:** Pending

#### Description

The order-detail endpoint is registered without the authenticateToken middleware and performs no ownership comparison, so any caller can read any order by guessing or enumerating its id.

#### Steps to Reproduce

1. Log in as User A and complete a checkout, producing order id 77 (visible in GET /api/orders/my-orders as User A).
2. Log in as a different user, User B, whose own GET /api/orders/my-orders returns [] and therefore does not contain order 77.
3. Send GET /api/orders/77 using User B's token. Evidence: TC-45, iteration 47 of the FR-08 Newman run.

#### Root Cause

apps/backend/server.js line 344 registers app.get("/api/orders/:id", (req, res) => ...) with no authenticateToken middleware in the chain, unlike the neighbouring /api/orders/my-orders (line 311) and /api/orders/:id/cancel (line 321). The handler selects the row by req.params.id alone and never compares order.user_id against the caller, so neither authentication nor ownership is enforced.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | srs.md FR-11 line 166 states a user may view only their own orders; specs/security-requirement.md SEC-02-extended(a) requires cross-user order access to be rejected. User B's request for User A's order 77 must not return that order. |
| **Actual** | The endpoint returns User A's order 77 to User B. The route carries no authenticateToken middleware at all, so the same record is also readable with no token. |

#### Screenshot

Pending
### BUG-FR15-04 - POST/PUT /api/products perform no input validation, persisting products that violate every documented field constraint

**API:** `POST /api/products, PUT /api/products/:id`
**Found By:** AI
**Severity:** High
**GitHub Issue:** Pending

#### Description

Neither the create nor the update handler validates any field before writing to the database. A missing name, an over-length name, a negative or zero price, and a category_id that matches no existing category are all accepted and persisted with HTTP 200.

#### Steps to Reproduce

1. Log in as `admin@eshop.com` / `Admin123!` and obtain a valid admin JWT (this run's fixture establishes one; every step below sends `Authorization: Bearer <valid admin JWT>`, so the defect is independent of BUG-FR15-01).
2. `POST http://127.0.0.1:3000/api/products` with the `name` key omitted entirely: `{"price":100000,"description":"Mô tả sản phẩm","imageUrl":"http://example.com/img.png","category_id":1}` (TC-02, trace EC-01, `reports/newman-report.json` iteration 2).
3. `POST /api/products` with a 256-character `name` (TC-06, trace BVA-03, iteration 6).
4. `POST /api/products` with `"price":-1` (TC-09, trace BVA-04, iteration 9).
5. `POST /api/products` with `"price":0` (TC-10, trace BVA-05, iteration 10).
6. `POST /api/products` with `"category_id":999999`, an id returned by no `GET /api/categories` entry (TC-13, trace EC-08, iteration 13).
7. `POST /api/products` with `"category_id":"electronics"`, a non-numeric category (TC-14, trace EC-10, iteration 14).
8. `PUT http://127.0.0.1:3000/api/products/9` with `"price":0` (TC-18, trace BVA-05_PUT_SCOPED, iteration 18), then `GET /api/products/9`.
9. `PUT http://127.0.0.1:3000/api/products/9` with `"category_id":999999` (TC-19, trace EC-08_PUT_SCOPED, iteration 19), then `GET /api/products/9`.
10. Confirmed independently outside Newman: `curl -X POST /api/products -H 'Authorization: Bearer <admin JWT>' -d '{"name":"PROBE2","price":-1,"category_id":1}'` returned `200`, and the same request with `"category_id":999999` returned `200`.

#### Root Cause

`server.js:167` (`app.post("/api/products", ...)`) and `server.js:179` (`app.put("/api/products/:id", ...)`) destructure `{ name, price, description, imageUrl, category_id }` straight out of `req.body` and pass them directly into the `INSERT` / `UPDATE` statement. There is no presence check on `name`, no length bound, no numeric or sign check on `price`, and no foreign-key lookup against the `categories` table before the write. The products table does not enforce these constraints either, so the invalid row is committed. This is a separate root cause from BUG-FR15-01/02/03: those cover the absent auth middleware, whereas every step above runs with a valid admin JWT and still succeeds.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `srs.md` FR-15 line 195 (`name` is required, maximum 255 characters), line 196 (`price` must be a positive number), and line 197 (`category_id` must be an id drawn from `GET /api/categories`), each request above must be rejected with a 4xx status and no product created or modified. |
| **Actual** | Every request returned `200`. For each POST the catalog count rose by exactly 1 against the fixture baseline - TC-02: 10 vs expected 9; TC-06: 14 vs 13; TC-09: 17 vs 16; TC-10: 18 vs 17; TC-13: 21 vs 20; TC-14: 22 vs 21. Both PUTs were applied and persisted: the follow-up `GET /api/products/9` returned the mutated body (name "Áo thun mới") instead of the pre-request body (name "Áo thun nam"). |

#### Screenshot

Pending

---

### BUG-FR15-05 - GET /api/products/:id returns 200 with an empty object for a non-existent id instead of 404

**API:** `GET /api/products/:id`
**Found By:** AI
**Severity:** Medium
**GitHub Issue:** Pending

#### Description

The read-by-id handler answers a request for an id that matches no row with HTTP 200 and an empty JSON object, so a caller cannot distinguish a deleted or never-existing product from a successful read.

#### Steps to Reproduce

1. `DELETE http://127.0.0.1:3000/api/products/<C id>` for fixture product C, which returns `200 {"message":"Product deleted"}`.
2. `GET http://127.0.0.1:3000/api/products/<C id>` immediately afterward (TC-24, trace S-05, `reports/newman-report.json` iteration 24).
3. Confirmed independently outside Newman: `curl -i http://127.0.0.1:3000/api/products/999999`, an id that has never existed, returned `status=200` with body `{}`.
4. Confirmed the row really is gone: querying `apps/backend/database.sqlite` for the deleted id returns no rows, so the 200 is a response-shape defect, not a failed delete.

#### Root Cause

`server.js:161` hardcodes `if (!row) return res.status(200).json({});` inside `app.get("/api/products/:id", ...)`, returning success for a missing row rather than a not-found status. This also masks any not-found assertion built on this endpoint, which is why TC-24's "C is not retrievable after the first delete" check can never observe a `>=400` status no matter how the preceding DELETE behaves.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Per `api_specification.md` section 3.3 lines 106-107, a request for an id that matches no product should return a not-found status (`404`) so the caller can distinguish absence from a successful read; TC-24's oracle requires the post-delete read to be non-retrievable. |
| **Actual** | `GET /api/products/<deleted id>` returned `200` with body `{}`. The TC-24 assertion "C is not retrievable after the first delete" failed with `expected 200 to be at least 400`. |

#### Screenshot

Pending

---

