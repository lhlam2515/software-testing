# Bug Report - HW04

**Tester:** Lê Hoàng Lâm (23127216)
**SUT:** EShop, [github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut)
**GitHub Issues:** [github.com/lhlam2515/software-testing/issues](https://github.com/lhlam2515/software-testing/issues)
**Total bugs found:** 16 (14 re-confirmed from HW02 · 2 new)

---

## Bug Triage Method (P6)

Ran all 9 required browser suites (`FR-02`/`FR-09`/`FR-16` × 3 browsers) against the live `apps/` monorepo
(backend `:3000`, web `:5173`, admin `:5174`) on 2026-08-09, then read all `test-results/<FR>/<browser>/results.json`
and cross-joined every failing `TC-ID` against `test-data/<FR>/cases.json`'s `knownDefect` field.

**Browser substitution (documented, not silent):** WebKit cannot launch on this host — Fedora 44 is unsupported by
`playwright install-deps` (falls back to an `ubuntu24.04` dependency set that needs `libicu74`/`libjpeg-turbo8`,
neither of which exist under those names on Fedora), and installing them requires an interactive `sudo` password
this session does not have. `REQUIREMENTS.md` line 83 explicitly allows the **"Chrome / Edge / Firefox"** browser
set as a substitute for "Chromium / Firefox / WebKit". Microsoft Edge was installed user-level via
`flatpak install --user flathub-user com.microsoft.Edge` (no root needed) and wired into
`artifacts/playwright.config.ts` as a Playwright project (`edge`, Chromium engine, `executablePath` pointing at
the flatpak wrapper). The `webkit` project definition and all its generated report/result artifacts have since been
removed from the repo — `edge` is the browser actually reported below as the 3rd browser slot. One follow-up fix was needed: Edge's flatpak
sandbox does not expose the project directory by default, so `artifacts/test-data/FR-16/fixtures/generated/*.csv`
was invisible to the sandboxed browser and every FR-16 case failed at the file-upload step regardless of the SUT's
real behavior; `flatpak override --user --filesystem=$HOME/AI-OS com.microsoft.Edge` fixed this, after which FR-16/Edge
reproduced byte-identical results to FR-16/Chromium and FR-16/Firefox.

**Result: zero genuine browser-difference bugs.** After the sandbox fix, Chromium, Firefox, and Edge produced
**identical pass/fail sets on all 60 test cases across all 3 features** — every failure matches a `knownDefect`
tag with no browser-specific divergence. This is itself a negative finding worth recording: HW04's candidate for
"browser-diff bug" (HTML5 validation, number formatting, file-upload handling — all named as suspects in
`TEST_PLAN.md §6`) did not materialize on this SUT/engine combination (Edge and Chromium share the same rendering
and validation engine, which narrows what a real diff could show; Firefox's independent engine still matched).

**One test bug found and fixed during triage:** `TC-07` (FR-02) and `TC-UI-03` (FR-02) both carry
`knownDefect: "PENDING-NEW-lockout-message-enumeration"` but passed cleanly on all 3 browsers before triage. Root
cause: `TC-07`'s `assert.api` only checked `hasToken: false` (true for both the 401 wrong-password case and the 403
locked case, so it could never fail) and the case's own authoring note suggested adding `status: 403` — which would
have asserted the *buggy* behavior as expected and made the case pass forever, violating `TEST_PLAN.md §3.1`'s own
"assert the spec, not the implementation" rule. Fixed: `test-data/FR-02/cases.json` `TC-07.assert.api.status` is now
`401` (the SRS-mandated generic-failure status per `docs/eshop-sut/srs.md` line 42: "*không để lộ chi tiết nguyên
nhân*" — must not leak the specific cause), which correctly fails against the SUT's actual `403` and reveals
**BUG-02-006** below. Re-ran FR-02 on all 3 browsers after the fix; evidence in this report reflects the fixed
assertion. `TC-UI-03` needed no code change — it only checks that the UI *doesn't* leak (which is true), so it
correctly passes; its `knownDefect` tag is informational (same root cause as TC-07), not a failing assertion.

**Known HW02 bugs not re-verified by this automation run:** `BUG-02-002` (error message position, HW02 issue #14)
and `BUG-02-004` (lockout duration ~180s vs documented 30s, HW02 issue #16) are outside this run's assertion set —
`BUG-02-002` is a layout/positioning concern the FR-02 `cases.json` doesn't assert on, and `BUG-02-004` is sidestepped
by design (`TEST_PLAN.md §8` risk #4: the suite seeds `locked_until` directly via `db.ts` instead of waiting out the
real lockout window, to keep the suite fast and non-flaky, which also means it never re-measures the actual duration).
Both remain open on GitHub with no new evidence from HW04.

---

## Bug Summary

| Bug ID | Feature | Title | Severity | Found by (TC) | Status | GitHub Issue |
| --- | --- | --- | --- | --- | --- | --- |
| BUG-02-001 | FR-02 | Invalid email format is not rejected client-side | Medium | TC-03 | Open | [#13](https://github.com/lhlam2515/software-testing/issues/13) |
| BUG-02-003 | FR-02 | Failed login attempts counter increments by 2 instead of 1 | High | TC-06, TC-BVA-01 | Open | [#15](https://github.com/lhlam2515/software-testing/issues/15) |
| BUG-02-005 | FR-02 | Password field is not masked (`type="text"` instead of `type="password"`) | Medium | TC-UI-01 | Open | [#35](https://github.com/lhlam2515/software-testing/issues/35) |
| BUG-02-006 | FR-02 | Locked-account rejection leaks a distinct HTTP status/message vs. wrong-password rejection | Medium | TC-07 | Open | [#36](https://github.com/lhlam2515/software-testing/issues/36) |
| BUG-09-001 | FR-09 | Percent coupon formula produces a negative discount instead of a percentage discount | High | TC-01, TC-BVA-03, TC-BVA-08 | Open | [#17](https://github.com/lhlam2515/software-testing/issues/17) |
| BUG-09-002 | FR-09 | `/api/apply-coupon` accepts requests with no authentication token at all | High | TC-08 | Open | [#18](https://github.com/lhlam2515/software-testing/issues/18) |
| BUG-09-003 | FR-09 | `/api/apply-coupon` accepts an invalid/malformed JWT | High | TC-09 | Open | [#19](https://github.com/lhlam2515/software-testing/issues/19) |
| BUG-09-004 | FR-09 | Fixed-amount coupon discount is not capped at the order total, producing a negative final amount | High | TC-11 | Open | [#20](https://github.com/lhlam2515/software-testing/issues/20) |
| BUG-09-005 | FR-09 | Minimum order amount check uses strict greater-than instead of greater-than-or-equal | Medium | TC-12, TC-BVA-02 | Open | [#21](https://github.com/lhlam2515/software-testing/issues/21) |
| BUG-09-006 | FR-09 | Coupon code lookup is case-insensitive | Medium | TC-05 | Open | [#22](https://github.com/lhlam2515/software-testing/issues/22) |
| BUG-09-007 | FR-09 | Checkout trusts a client-derived `total_amount` instead of recomputing it from the cart | High | TC-13 | Open | [#30](https://github.com/lhlam2515/software-testing/issues/30) |
| BUG-16-001 | FR-16 | Admin-only CSV import route accepts a regular user's token | High | TC-04 | Open | [#23](https://github.com/lhlam2515/software-testing/issues/23) |
| BUG-16-002 | FR-16 | `price > 0` is not validated during CSV import | High | TC-08, TC-09, TC-10, TC-11, TC-12, TC-18, TC-BVA-01 | Open | [#24](https://github.com/lhlam2515/software-testing/issues/24) |
| BUG-16-003 | FR-16 | Import accepts a non-existent `category_id` | High | TC-15 | Open | [#25](https://github.com/lhlam2515/software-testing/issues/25) |
| BUG-16-004 | FR-16 | Import does not enforce the 255-character `name` limit shared with FR-15 | Medium | TC-14, TC-BVA-05 | Open | [#26](https://github.com/lhlam2515/software-testing/issues/26) |
| BUG-16-005 | FR-16 | Admin UI does not enforce the `.csv` file extension | Low | TC-19 | Open | [#27](https://github.com/lhlam2515/software-testing/issues/27) |

**Severity distribution:** High: 9, Medium: 6, Low: 1

---

## Detailed Bug Template

> 14 bugs below are re-confirmations of HW02 findings (full original write-up in
> `../HW02/BUG_REPORT.md`) — kept here in full per the assignment brief ("wherever a failing assertion reveals a
> genuine defect, a bug report"), not just a cross-link, plus this run's own automation evidence. 2 bugs
> (BUG-02-005, BUG-02-006) are new, first found by this HW04 suite.

### BUG-02-001 - Invalid email format is not rejected client-side

**Feature:** FR-02, Login & Account Lockout
**TC that found it:** TC-03
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5173` · local `apps/` monorepo · 2026-08-09
**Severity:** Medium
**GitHub Issue:** [#13](https://github.com/lhlam2515/software-testing/issues/13)

#### Description

The login form does not validate the email format before submitting. Typing a value with no `@` sign into the
username field and clicking `Sign In` sends the request straight to the server instead of blocking it locally. The
server correctly rejects the malformed value with HTTP 401, but the user only finds out after a full round trip, and
the error message is the same generic failure text used for a wrong password — it never says the email itself was
malformed. First found in HW02 (issue #13); re-confirmed by HW04 automation with no change in behavior.

#### Steps to Reproduce

1. Open `http://localhost:5173/login`.
2. Type an email with no `@` (e.g. `invalid_no_at_sign`) and any password.
3. Click `Sign In`.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | The form should reject the malformed email client-side (e.g. `type="email"` or a regex check) before the request reaches the server. |
| **Actual** | `POST /api/login` is sent, the server returns HTTP 401, and the page shows the generic failure message with no indication the email format was the problem. |

#### Automation Evidence

`artifacts/tests/FR-02/login.spec.ts`, case `TC-03` in `artifacts/test-data/FR-02/cases.json` — assertion pattern #2
(network), `assertApi` in `artifacts/tests/_fixtures/fr02-helpers.ts:160`, fails on the expected-vs-actual HTML5
validation state before the request is even allowed to fire.

#### Screenshot

`screenshots/BUG-02-001-TC-03-invalid-email-not-blocked.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-02-001-issue-13.png` (original HW02 evidence; see §Next steps for adding this run's automation screenshot as a comment)

---

### BUG-02-003 - Failed login attempts counter increments by 2 instead of 1

**Feature:** FR-02, Login & Account Lockout
**TC that found it:** TC-06, TC-BVA-01
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5173` · local `apps/` monorepo · 2026-08-09
**Severity:** High
**GitHub Issue:** [#15](https://github.com/lhlam2515/software-testing/issues/15)

#### Description

Every failed login with the correct email but wrong password increases `login_attempts` by 2 instead of 1
(`server.js:54`, `newAttempts = user.login_attempts + 2`). Confirmed at both a clean state (`0 -> 2` after one failed
attempt, TC-06) and at the lockout boundary (`2 -> 4`, triggering the lock two attempts earlier than the documented
threshold of 3, TC-BVA-01). Directly undermines the account lockout policy — users are locked out roughly twice as
fast as intended. First found in HW02 (issue #15); re-confirmed by HW04 automation, same root cause, same line.

#### Steps to Reproduce

1. Seed `login_attempts=0` for `test@eshop.com` via `db.ts`.
2. Submit the correct email with an incorrect password once.
3. Read `login_attempts` from the database.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | `login_attempts` increases from `0` to `1` after a single failed attempt. |
| **Actual** | `login_attempts` increases from `0` to `2`, and the doubled increment reproduces again at the lockout boundary (`2 -> 4`). |

#### Automation Evidence

`artifacts/tests/FR-02/login.spec.ts`, cases `TC-06` and `TC-BVA-01` in `artifacts/test-data/FR-02/cases.json` —
assertion pattern #3 (DB state), `assertDb` in `artifacts/tests/_fixtures/fr02-helpers.ts:185`, expects
`login_attempts` to increase by exactly 1, observes +2.

#### Screenshot

`screenshots/BUG-02-003-TC-06-counter-plus2.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-02-003-issue-15.png` (original HW02 evidence)

---

### BUG-02-005 - Password field is not masked (`type="text"` instead of `type="password"`)

**Feature:** FR-02, Login & Account Lockout
**TC that found it:** TC-UI-01
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5173` · local `apps/` monorepo · 2026-08-09
**Severity:** Medium
**GitHub Issue:** [#35](https://github.com/lhlam2515/software-testing/issues/35)

#### Description

The `Mật khẩu` (password) input on the login page renders with `input type="text"`, so typed characters appear on
screen in plaintext instead of being masked. `docs/eshop-sut/srs.md` FR-02 explicitly requires the parallel
discipline for the email field ("Trường email phải dùng `type="email"`"), and masking password input is the
uncontroversial baseline for any login form — this was not something HW02's spec-only test design surveyed (HW02
never inspected the DOM attribute directly), but was caught here because `TEST_PLAN.md §1.1` deliberately added
`TC-UI-01` as a UI-layer extension of the FR-02 equivalence classes. Exposes the password to shoulder-surfing, screen
recording/sharing, and any tooling that logs visible page content.

#### Steps to Reproduce

1. Open `http://localhost:5173/login`.
2. Click into the `Mật khẩu` field.
3. Type any password (e.g. `Test1234!`).
4. Observe the characters on screen, or inspect the input element's `type` attribute.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Characters are masked (dots/asterisks); `input[type="password"]`. |
| **Actual** | Characters render in plaintext; `input` resolves with `type="text"` and the literal typed value visible in the DOM. |

#### Automation Evidence

`artifacts/tests/FR-02/login.spec.ts`, case `TC-UI-01` in `artifacts/test-data/FR-02/cases.json` — assertion pattern
#1 (web-first UI), `assertUi` in `artifacts/tests/_fixtures/fr02-helpers.ts:125`, `expect(passwordInput).toHaveAttribute('type', 'password')`.
Actual DOM: `<input required="" type="text" value="Test1234!" class="w-full border p-2 rounded"/>`.

#### Screenshot

`screenshots/BUG-02-005-TC-UI-01-password-not-masked.png`

**GitHub Issue Screenshot:** posted as a comment on [#35](https://github.com/lhlam2515/software-testing/issues/35) (embedded from `screenshots/BUG-02-005-TC-UI-01-password-not-masked.png` via the pushed `feature/HW04` branch)

---

### BUG-02-006 - Locked-account rejection leaks a distinct HTTP status/message vs. wrong-password rejection

**Feature:** FR-02, Login & Account Lockout
**TC that found it:** TC-07
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5173` · local `apps/` monorepo · 2026-08-09
**Severity:** Medium
**GitHub Issue:** [#36](https://github.com/lhlam2515/software-testing/issues/36)

#### Description

`docs/eshop-sut/srs.md` FR-02 (line 42) states the lockout response must not leak its specific cause: *"Hệ thống trả
về thông báo lỗi phù hợp; không để lộ chi tiết nguyên nhân."* But `server.js:40-44` returns HTTP 403 with the message
`"Tài khoản đã bị khóa. Vui lòng thử lại sau."` whenever `locked_until` is still in the future — a check that runs
*before* the password comparison, so it fires regardless of whether the submitted password is correct. A normal wrong
password instead returns HTTP 401 with `"Invalid email or password"` (`server.js:63`). Anyone submitting login
attempts against a known account (any password, correct or not) can therefore distinguish "this account is currently
locked" from "this account exists but the password is wrong" purely from status code + message — the exact
enumeration the spec forbids. The frontend's `Login.jsx` swallows every API error into one static string, so the leak
is invisible in the UI (`errorRevealsReason: false` holds); it only surfaces at the network layer. This is why the
original test draft (asserting UI state only, pattern #1) missed it, and why the P6 fix added a network-layer
assertion (pattern #2) that expects the spec-mandated non-leaking status (401) instead of the 403 actually observed.

#### Steps to Reproduce

1. Seed `login_attempts=3` and `locked_until` ~25s in the future for `test@eshop.com` (or trigger via 3 real failed attempts).
2. `POST /api/login` with the **correct** password.
3. Compare the response against a normal wrong-password response.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Response should not be distinguishable from a generic failed-login response — same status (401) as the wrong-password case, per the spec's "do not leak the reason" rule. |
| **Actual** | HTTP 403 with `"Tài khoản đã bị khóa. Vui lòng thử lại sau."` — clearly distinct from the generic 401 `"Invalid email or password"` response. |

#### Automation Evidence

`artifacts/tests/FR-02/login.spec.ts`, case `TC-07` in `artifacts/test-data/FR-02/cases.json` — assertion pattern #2
(network), `assertApi` in `artifacts/tests/_fixtures/fr02-helpers.ts:160-169`, `expect(capture.status).toBe(401)`,
actual `403`. (This is the assertion added during P6 triage — see the note field on `TC-07` in `cases.json` for the
before/after reasoning.)

#### Screenshot

`screenshots/BUG-02-006-TC-07-lockout-status-leak.png`

**GitHub Issue Screenshot:** posted as a comment on [#36](https://github.com/lhlam2515/software-testing/issues/36) (embedded from `screenshots/BUG-02-006-TC-07-lockout-status-leak.png` via the pushed `feature/HW04` branch)

---

### BUG-09-001 - Percent coupon formula produces a negative discount instead of a percentage discount

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-01, TC-BVA-03, TC-BVA-08
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5173` · local `apps/` monorepo · 2026-08-09
**Severity:** High
**GitHub Issue:** [#17](https://github.com/lhlam2515/software-testing/issues/17)

#### Description

Applying any `percent`-type coupon (e.g. `SAVE10`, a 10% discount) does not divide the discount value by 100. The
calculation instead multiplies the order total by the raw discount value, producing a large negative "discount"
bigger than the order itself: on a 500,000₫ order, `SAVE10` reports a discount of -4,500,000₫ and a final amount of
5,000,000₫ (nine times the original total) instead of a 50,000₫ discount and a 450,000₫ final total. Every percent
coupon in the system is affected. First found in HW02 (issue #17); re-confirmed by HW04 automation on the happy path
(TC-01) and at both BVA boundaries around the minimum-order threshold (TC-BVA-03, TC-BVA-08), where the wrong formula
propagates into the same bad `final_amount`.

#### Steps to Reproduce

1. Add items totaling 500,000₫ to the cart, proceed to `/checkout`.
2. Apply coupon code `SAVE10` (10%, active, non-expired).
3. Observe the displayed discount and final total.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | `discount_amount = 50,000₫`, `final_amount = 450,000₫`. |
| **Actual** | `discount_amount = -4,500,000₫`, `final_amount = 5,000,000₫`. |

#### Automation Evidence

`artifacts/tests/FR-09/coupon.spec.ts`, cases `TC-01`, `TC-BVA-03`, `TC-BVA-08` in `artifacts/test-data/FR-09/cases.json`
— assertion pattern #2 (network), `assertApi` in `artifacts/tests/_fixtures/fr09-helpers.ts:239`, expects the correct
`final_amount`/`discount_amount` per spec formula, observes the inflated value.

#### Screenshot

`screenshots/BUG-09-001-TC-01-percent-formula-wrong.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-09-001-issue-17.png` (original HW02 evidence)

---

### BUG-09-002 - `/api/apply-coupon` accepts requests with no authentication token at all

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-08
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · API-level (`request` fixture) · local `apps/` monorepo · 2026-08-09
**Severity:** High
**GitHub Issue:** [#18](https://github.com/lhlam2515/software-testing/issues/18)

#### Description

`POST /api/apply-coupon` has no `authenticateToken` middleware. A request with no `Authorization` header at all still
returns HTTP 200 and applies the coupon exactly as if a logged-in user sent it — confirmed directly by reading
`server.js:363` during HW04's P3 data-authoring pass (the route is missing the middleware every other protected route
uses). Anyone can probe coupon codes and validity without ever logging in. First found in HW02 (issue #18);
re-confirmed by HW04 automation, plus a source-level root cause HW02 could only infer from response behavior.

#### Steps to Reproduce

1. Send `POST /api/apply-coupon` with a valid coupon code and order details, omitting `Authorization` entirely.
2. Observe the HTTP status and response body.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | HTTP 401 Unauthorized. |
| **Actual** | HTTP 200, coupon applied normally. |

#### Automation Evidence

`artifacts/tests/FR-09/coupon.spec.ts`, case `TC-08` in `artifacts/test-data/FR-09/cases.json` — assertion pattern #2
(network, API-only layer via Playwright `request` fixture), `assertApi` in `artifacts/tests/_fixtures/fr09-helpers.ts:239`,
expects `status: 401`, observes `200`.

#### Screenshot

`screenshots/BUG-09-002-TC-08-no-auth-header.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-09-002-issue-18.png` (original HW02 evidence)

---

### BUG-09-003 - `/api/apply-coupon` accepts an invalid/malformed JWT

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-09
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · API-level (`request` fixture) · local `apps/` monorepo · 2026-08-09
**Severity:** High
**GitHub Issue:** [#19](https://github.com/lhlam2515/software-testing/issues/19)

#### Description

Sending `POST /api/apply-coupon` with a clearly invalid bearer token (`Authorization: Bearer invalidtokenstring123abc`)
is treated the same as a valid session — HTTP 200, coupon applied. Combined with BUG-09-002, this confirms the route
performs no meaningful authentication check at all. First found in HW02 (issue #19); re-confirmed by HW04 automation.

#### Steps to Reproduce

1. Send `POST /api/apply-coupon` with `Authorization: Bearer invalidtokenstring123abc` and valid coupon/order details.
2. Observe the HTTP status and response body.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | HTTP 401/403 due to an invalid token. |
| **Actual** | HTTP 200, coupon applied normally. |

#### Automation Evidence

`artifacts/tests/FR-09/coupon.spec.ts`, case `TC-09` in `artifacts/test-data/FR-09/cases.json` — assertion pattern #2
(network), `assertApi` in `artifacts/tests/_fixtures/fr09-helpers.ts:239`, expects `status: 401/403`, observes `200`.

#### Screenshot

`screenshots/BUG-09-003-TC-09-invalid-jwt.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-09-003-issue-19.png` (original HW02 evidence)

---

### BUG-09-004 - Fixed-amount coupon discount is not capped at the order total, producing a negative final amount

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-11
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5173` · local `apps/` monorepo · 2026-08-09
**Severity:** High
**GitHub Issue:** [#20](https://github.com/lhlam2515/software-testing/issues/20)

#### Description

When a `fixed`-type coupon's discount value exceeds the order total, the service subtracts the full discount anyway,
letting `final_amount` go negative. A 100,000₫ coupon on a 60,000₫ order returns `discount_amount=100000`,
`final_amount=-40000`. First found in HW02 (issue #20); re-confirmed by HW04 automation.

#### Steps to Reproduce

1. Use a `fixed`-type coupon with `discount_value=100000`, `min_order_amount=50000`.
2. Build an order with `total_amount=60000` (above minimum, below discount value).
3. Apply the coupon.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Discount capped at the order total; `final_amount` never below 0. |
| **Actual** | `discount_amount=100,000₫`, `final_amount=-40,000₫`. |

#### Automation Evidence

`artifacts/tests/FR-09/coupon.spec.ts`, case `TC-11` in `artifacts/test-data/FR-09/cases.json` — assertion pattern #2
(network), `assertApi` in `artifacts/tests/_fixtures/fr09-helpers.ts:239`, expects `final_amount >= 0`, observes negative value.

#### Screenshot

`screenshots/BUG-09-004-TC-11-negative-final-amount.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-09-004-issue-20.png` (original HW02 evidence)

---

### BUG-09-005 - Minimum order amount check uses strict greater-than instead of greater-than-or-equal

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-12, TC-BVA-02
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5173` · local `apps/` monorepo · 2026-08-09
**Severity:** Medium
**GitHub Issue:** [#21](https://github.com/lhlam2515/software-testing/issues/21)

#### Description

`server.js:379` implements `total_amount >= min_order_amount` as strict `total_amount > min_order_amount`. Confirmed
directly by reading the source during HW04's P3 pass (root cause of both TC-12's degenerate `0 >= 0` case and
TC-BVA-02's ON-boundary case: 300,000₫ order against `SAVE10`'s 300,000₫ minimum). Orders exactly at the coupon's
minimum spend are wrongly rejected. First found in HW02 (issue #21); re-confirmed by HW04 automation with the exact
source line identified.

#### Steps to Reproduce

1. Apply `SAVE10` (`min_order_amount=300000`) to an order whose total is exactly 300,000₫.
2. Separately, create a coupon with `min_order_amount=0` and apply it to a 0₫ order.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | A total exactly equal to `min_order_amount` is accepted (`>=`). |
| **Actual** | Both the 300,000₫-exact and the 0₫-exact cases are rejected as "below minimum". |

#### Automation Evidence

`artifacts/tests/FR-09/coupon.spec.ts`, cases `TC-12` and `TC-BVA-02` in `artifacts/test-data/FR-09/cases.json` —
assertion pattern #2 (network), `assertApi` in `artifacts/tests/_fixtures/fr09-helpers.ts:239`, expects acceptance at the ON boundary, observes rejection.

#### Screenshot

`screenshots/BUG-09-005-TC-12-strict-greater-than.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-09-005-issue-21.png` (original HW02 evidence)

---

### BUG-09-006 - Coupon code lookup is case-insensitive

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-05
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5173` · local `apps/` monorepo · 2026-08-09
**Severity:** Medium
**GitHub Issue:** [#22](https://github.com/lhlam2515/software-testing/issues/22)

#### Description

Typing the coupon code in lowercase (`save10`) is accepted and matched to the seeded `SAVE10` coupon exactly as if
case matched, same `coupon_id`, discount, and final amount. Coupon codes are expected to be exact/case-sensitive
identifiers. First found in HW02 (issue #22); re-confirmed by HW04 automation.

#### Steps to Reproduce

1. Apply the coupon code as `save10` (all lowercase) to an order that otherwise qualifies for `SAVE10`.
2. Observe whether it is recognized.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | `save10` is treated as a different, non-existent code. |
| **Actual** | `save10` resolves to the same `coupon_id=1` as `SAVE10` and applies the same discount. |

#### Automation Evidence

`artifacts/tests/FR-09/coupon.spec.ts`, case `TC-05` in `artifacts/test-data/FR-09/cases.json` — assertion pattern #2
(network), `assertApi` in `artifacts/tests/_fixtures/fr09-helpers.ts:239`, expects rejection/no-match, observes a successful match.

#### Screenshot

`screenshots/BUG-09-006-TC-05-case-insensitive.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-09-006-issue-22.png` (original HW02 evidence)

---

### BUG-09-007 - Checkout trusts a client-derived `total_amount` instead of recomputing it from the cart

**Feature:** FR-09, Coupon (Discount Code)
**TC that found it:** TC-13
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5173` · local `apps/` monorepo · 2026-08-09
**Severity:** High
**GitHub Issue:** [#30](https://github.com/lhlam2515/software-testing/issues/30)

#### Description

`POST /api/apply-coupon` accepts `total_amount` exactly as supplied by the client instead of recomputing it from the
real cart contents, conflicting with FR-08's mandate that the backend recompute the order total server-side. With a
cart holding one 4,000,000₫ item, overwriting the checkout page's total field to 500,000₫ before applying `SAVE10`
(`min_order_amount=300000`) clears the minimum-order check with a manipulated value; the API accepts it, and
confirming the order persists `total_amount` derived entirely from the manipulated client input, not the real cart
subtotal, into the `orders` table. First found in HW02 (issue #30); re-confirmed by HW04 automation.

#### Steps to Reproduce

1. Log in, add exactly 1x an item worth 4,000,000₫, confirm `/cart` shows that subtotal.
2. Proceed to `/checkout`, overwrite the total-amount field to 500,000₫.
3. Apply `SAVE10`, confirm the order.
4. Query the persisted order and inspect `total_amount`.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Backend recomputes `total_amount` from the real cart (4,000,000₫), ignoring/rejecting a disagreeing client value. |
| **Actual** | The manipulated `total_amount` is accepted and persisted as-is. |

#### Automation Evidence

`artifacts/tests/FR-09/coupon.spec.ts`, case `TC-13` in `artifacts/test-data/FR-09/cases.json` — assertion pattern #3
(DB state), `assertDb` in `artifacts/tests/_fixtures/fr09-helpers.ts:272`, expects the persisted `total_amount` to
match the real cart subtotal, observes the client-manipulated value instead.

#### Screenshot

`screenshots/BUG-09-007-TC-13-client-total-trusted.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-09-007-issue-30.png` (original HW02 evidence)

---

### BUG-16-001 - Admin-only CSV import route accepts a regular user's token

**Feature:** FR-16, CSV Product Import
**TC that found it:** TC-04
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5174` (admin) · local `apps/` monorepo · 2026-08-09
**Severity:** High
**GitHub Issue:** [#23](https://github.com/lhlam2515/software-testing/issues/23)

#### Description

The product import endpoint is supposed to be Admin-only, but accepts a valid JWT belonging to a regular user just as
readily — `authenticateToken` (`server.js:100`) does not check `role` on any `/api/admin/*` route. A regular customer
could bulk-create products. First found in HW02 (issue #23); re-confirmed by HW04 automation, plus the exact
middleware line identified during HW04's P3 source read.

#### Steps to Reproduce

1. Log in as a regular (non-admin) user, obtain a token.
2. Inject that token into the Admin UI and reload the import screen.
3. Import a CSV with one valid product row.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | HTTP 403 Forbidden. |
| **Actual** | HTTP 200, `inserted=1`, product created and visible in `GET /api/products`. |

#### Automation Evidence

`artifacts/tests/FR-16/csv-import.spec.ts`, case `TC-04` in `artifacts/test-data/FR-16/cases.json` — assertion
pattern #2 (network), `assertApi` in `artifacts/tests/_fixtures/fr16-helpers.ts:324`, expects `status: 403`, observes `200`.

#### Screenshot

`screenshots/BUG-16-001-TC-04-non-admin-accepted.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-16-001-issue-23.png` (original HW02 evidence)

---

### BUG-16-002 - `price > 0` is not validated during CSV import

**Feature:** FR-16, CSV Product Import
**TC that found it:** TC-08, TC-09, TC-10, TC-11, TC-12, TC-18, TC-BVA-01
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5174` (admin) · local `apps/` monorepo · 2026-08-09
**Severity:** High
**GitHub Issue:** [#24](https://github.com/lhlam2515/software-testing/issues/24)

#### Description

`server.js:199-241` (`/api/admin/import-products`) validates only `!row.name`, never `price`. Rows with `price=0`,
negative, non-numeric, or missing `price` are all accepted and inserted, reproduced across 7 HW04 test cases,
including an all-invalid batch (all 3 rows still inserted) and a mixed batch that should have triggered rollback but
instead committed everything (see also TC-12's atomic-rollback interaction, `TEST_PLAN.md §11` P2 note: this is
compounded by a **second**, separate defect — the import route has no transaction, so `TC-12`/`TC-18` fail for two
independent reasons stacked together, not one). First found in HW02 (issue #24); re-confirmed by HW04 automation,
with the missing-transaction interaction newly documented here.

#### Steps to Reproduce

1. Log in as Admin, open the CSV import screen.
2. Import a row with `price=0` (or negative, non-numeric, or missing).
3. Observe the import result and whether the product was created.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Rows with `price <= 0`, non-numeric, or missing `price` rejected with a validation error; a mixed batch rolls back entirely. |
| **Actual** | Every invalid-price variant is accepted with HTTP 200 and `inserted>=1`; mixed batches commit the valid rows regardless of the invalid one. |

#### Automation Evidence

`artifacts/tests/FR-16/csv-import.spec.ts`, cases `TC-08`, `TC-09`, `TC-10`, `TC-11`, `TC-12`, `TC-18`, `TC-BVA-01` in
`artifacts/test-data/FR-16/cases.json` — assertion patterns #2 (network, `assertApi`,
`artifacts/tests/_fixtures/fr16-helpers.ts:324`) and #3 (DB state, `assertDb`,
`artifacts/tests/_fixtures/fr16-helpers.ts:404`, atomic-rollback check on `TC-12`/`TC-18`).

#### Screenshot

`screenshots/BUG-16-002-TC-08-invalid-price-accepted.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-16-002-issue-24.png` (original HW02 evidence)

---

### BUG-16-003 - Import accepts a non-existent `category_id`

**Feature:** FR-16, CSV Product Import
**TC that found it:** TC-15
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5174` (admin) · local `apps/` monorepo · 2026-08-09
**Severity:** High
**GitHub Issue:** [#25](https://github.com/lhlam2515/software-testing/issues/25)

#### Description

The import route never verifies `category_id` against `GET /api/categories`. A row with `category_id=99999`
(confirmed absent) is accepted and creates a product with a dangling foreign key, which can break
category-filtered browsing or admin category management downstream. First found in HW02 (issue #25); re-confirmed by
HW04 automation.

#### Steps to Reproduce

1. Confirm `category_id=99999` does not exist via `GET /api/categories`.
2. Import a row referencing it with an otherwise valid product.
3. Check the import result and the created product's `category_id`.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Row rejected with a validation error. |
| **Actual** | HTTP 200, `inserted=1`, product created referencing the non-existent category. |

#### Automation Evidence

`artifacts/tests/FR-16/csv-import.spec.ts`, case `TC-15` in `artifacts/test-data/FR-16/cases.json` — assertion
pattern #3 (DB state), `assertDb` in `artifacts/tests/_fixtures/fr16-helpers.ts:404`, expects rejection, observes an
inserted row with a dangling `category_id`.

#### Screenshot

`screenshots/BUG-16-003-TC-15-dangling-category-fk.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-16-003-issue-25.png` (original HW02 evidence)

---

### BUG-16-004 - Import does not enforce the 255-character `name` limit shared with FR-15

**Feature:** FR-16, CSV Product Import
**TC that found it:** TC-14, TC-BVA-05
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5174` (admin) · local `apps/` monorepo · 2026-08-09
**Severity:** Medium
**GitHub Issue:** [#26](https://github.com/lhlam2515/software-testing/issues/26)

#### Description

FR-15 specifies a 255-character `name` maximum, but CSV import accepts a 256-character name without rejection or
truncation — a cross-feature invariant violation between manual entry (FR-15) and bulk import (FR-16). Confirmed at
both TC-14 (gap probe) and TC-BVA-05 (the exact UB+1 boundary). First found in HW02 (issue #26); re-confirmed by HW04
automation.

#### Steps to Reproduce

1. Prepare a CSV row with a 256-character `name`.
2. Import as Admin.
3. Check whether the product was created and the stored `name` length.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | Row rejected (or truncated) to respect the 255-character limit. |
| **Actual** | HTTP 200, `inserted=1`, product created with `name.length=256`. |

#### Automation Evidence

`artifacts/tests/FR-16/csv-import.spec.ts`, cases `TC-14` and `TC-BVA-05` in `artifacts/test-data/FR-16/cases.json` —
assertion pattern #3 (DB state), `assertDb` in `artifacts/tests/_fixtures/fr16-helpers.ts:404`, expects rejection at
the 255-char boundary, observes acceptance at 256.

#### Screenshot

`screenshots/BUG-16-004-TC-14-name-256-accepted.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-16-004-issue-26.png` (original HW02 evidence)

---

### BUG-16-005 - Admin UI does not enforce the `.csv` file extension

**Feature:** FR-16, CSV Product Import
**TC that found it:** TC-19
**Browser / Environment:** Chromium, Firefox, Microsoft Edge (identical result on all 3) · `http://localhost:5174` (admin) · local `apps/` monorepo · 2026-08-09
**Severity:** Low
**GitHub Issue:** [#27](https://github.com/lhlam2515/software-testing/issues/27)

#### Description

The SRS requires imported files to have a `.csv` extension, but the Admin UI's file picker accepts a `.txt` file with
byte-identical CSV content just as readily — same preview, same successful import, same request body. The extension
requirement exists only in the spec, not the client-side check. First found in HW02 (issue #27); re-confirmed by HW04
automation.

#### Steps to Reproduce

1. Prepare byte-identical `products.csv` and `products.txt`.
2. In the Admin import screen, choose `products.txt`.
3. Observe whether it is accepted, previewed, and imported.

#### Expected vs Actual Result

| | Result |
| -- | ------ |
| **Expected** | `products.txt` rejected for not having a `.csv` extension. |
| **Actual** | Accepted, previewed, and imported exactly like a `.csv` file. |

#### Automation Evidence

`artifacts/tests/FR-16/csv-import.spec.ts`, case `TC-19` in `artifacts/test-data/FR-16/cases.json` — assertion
pattern #1 (UI), `assertUiBeforeSubmit` in `artifacts/tests/_fixtures/fr16-helpers.ts:175`, expects the file to be
rejected before preview, observes a successful preview/import.

#### Screenshot

`screenshots/BUG-16-005-TC-19-txt-extension-accepted.png`

**GitHub Issue Screenshot:** `../HW02/assets/issues/BUG-16-005-issue-27.png` (original HW02 evidence)

---

## GitHub follow-through (completed 2026-08-09)

Per `TEST_PLAN.md §6`, executed after explicit user confirmation:

1. **14 known bugs** — commented on the existing Issues (#13, #15, #17–#22, #23–#27, #30) with this run's automation
   evidence (spec path + assertion + a screenshot from `bugs/screenshots/`, embedded via a raw-GitHub link into the
   pushed `feature/HW04` branch). No duplicate Issues opened.
2. **2 new bugs** — opened [#35](https://github.com/lhlam2515/software-testing/issues/35) (BUG-02-005) and
   [#36](https://github.com/lhlam2515/software-testing/issues/36) (BUG-02-006), same structured template HW02 used,
   each with a follow-up comment embedding its screenshot.

`feature/HW04` was pushed to `origin` (`git push -u origin feature/HW04`) so the screenshots referenced from Issue
comments resolve — this repo is private, so the embedded images only render for accounts with repository access,
which is expected for a private academic repo.
