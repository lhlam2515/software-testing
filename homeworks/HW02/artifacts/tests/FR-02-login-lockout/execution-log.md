# FR-02: Execution Log

**Feature:** FR-02, Login and Account Lockout  
**Tester:** Le Hoang Lam (23127216)  
**SUT:** EShop frontend `http://localhost:5173`  
**DB:** `apps/backend/database.sqlite`, test account: `test@eshop.com` / `Test1234!`  
**Started:** 2026-07-02

Screenshots: `homeworks/HW02/artifacts/tests/FR-02-login-lockout/screenshots/`

---

## Domain Testing (EP) — TC-01 to TC-07

### TC-01: Happy Path, Successful Login

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs set-attempts test@eshop.com 1`, verified with `node test-db.cjs get test@eshop.com` -> `login_attempts=1`, `locked_until=null` |
| **Executed at** | 2026-07-02 12:49 |
| **Actual result** | Clicking `Sign In` sent `POST /api/login` -> HTTP 200. The UI left `/login` and loaded `/`. JWT token was returned and stored client-side. DB cross-check: `login_attempts` reset `1 -> 0`. |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-01-pass-homepage.png` |
| **Bug ID** | - |
| **Notes** | EC15 and EC17 confirmed. Login page heading still shows `Dang Ky`, but that did not block this flow. |

### TC-02: Empty Email

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs reset test@eshop.com`, verified clean state |
| **Executed at** | 2026-07-02 12:47 |
| **Actual result** | After clicking `Sign In` with the `Username` field empty, the browser blocked submission on `/login` and showed the native validation message `Please fill out this field.` No login request was observed, and DB cross-check kept `login_attempts=0`. |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-02-empty-email.png` |
| **Bug ID** | - |
| **Notes** | Core expected behavior matched. This is native required-field validation, not `type="email"` validation. |

### TC-03: Invalid Email Format

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL, BUG-02-001 |
| **Pre-condition setup** | No special pre-condition required |
| **Executed at** | 2026-07-02 12:47 |
| **Actual result** | Clicking `Sign In` with `invalid_no_at_sign` sent `POST /api/login` -> HTTP 401. The page stayed on `/login` and showed the generic UI error `Dang nhap that bai. Vui long kiem tra lai.` |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/BUG-02-001-type-text-invalid-email.png` |
| **Bug ID** | BUG-02-001 |
| **Notes** | EC02 failed. Invalid email format was not blocked client-side and reached the server. This re-confirms the missing HTML5 email-type behavior. |

### TC-04: Unregistered Email

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `notfound@example.com` not present in the seeded DB |
| **Executed at** | 2026-07-02 12:47 |
| **Actual result** | Clicking `Sign In` sent `POST /api/login` -> HTTP 401. The page stayed on `/login`, showed the generic error, returned no JWT, and did not reveal that the email was unregistered. |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-04-unregistered-email.png` |
| **Bug ID** | BUG-02-002 |
| **Notes** | Primary EC04, EC18, and EC20 behavior passed. The rendered error text appears below the `Sign In` button and after the sign-up prompt in page order, so BUG-02-002 is still present. |

### TC-05: Empty Password

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs reset test@eshop.com`, verified clean state |
| **Executed at** | 2026-07-02 12:48 |
| **Actual result** | After clicking `Sign In` with the password field empty, the browser blocked submission on `/login` and showed the native validation message `Please fill out this field.` No login request was sent, and DB cross-check kept `login_attempts=0`. |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-05-empty-password.png` |
| **Bug ID** | - |
| **Notes** | Branch A was observed this session. The earlier stale log branch was not reused. |

### TC-06: Wrong Password, Counter Increment Check

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL, BUG-02-003 |
| **Pre-condition setup** | `node test-db.cjs reset test@eshop.com`, verified `login_attempts=0`, `locked_until=null` |
| **Executed at** | 2026-07-02 12:48 |
| **Actual result** | Clicking `Sign In` with `WrongPass1!` sent `POST /api/login` -> HTTP 401. The page stayed on `/login` and showed the generic error. DB cross-check after the single failed attempt showed `login_attempts=2`, not `1`. |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/BUG-02-003-login-attempts-plus2.png` |
| **Bug ID** | BUG-02-003 |
| **Notes** | EC13 failed and EC14 was observed. The failed-login counter still increments by 2 per bad submission. |

### TC-07: Account Currently Locked

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs set-locked test@eshop.com +30`, verified `login_attempts=3` and future `locked_until` |
| **Executed at** | 2026-07-02 12:49 |
| **Actual result** | Clicking `Sign In` with correct credentials sent `POST /api/login` -> HTTP 403. The page stayed on `/login`, the UI still showed the generic failure message, no JWT was returned, and DB cross-check stayed at `login_attempts=3`. |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-07-locked-correct-creds.png` |
| **Bug ID** | - |
| **Notes** | EC10, EC12, EC18, and EC20 confirmed. The API body still exposes a lock-specific message even though the UI masks it. |

## Boundary Value Analysis, TC-BVA-01 to TC-BVA-05

### TC-BVA-01: Third Failure, Lock Trigger at ON Point

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs set-attempts test@eshop.com 2`, verified `login_attempts=2`, `locked_until=null` |
| **Executed at** | 2026-07-02 12:50 |
| **Actual result** | Clicking `Sign In` with a wrong password sent `POST /api/login` -> HTTP 401. DB cross-check after the attempt showed `login_attempts=4` and a new future `locked_until`, so the account became locked immediately after the threshold-crossing failure. |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-BVA-01-lock-triggered.png` |
| **Bug ID** | BUG-02-003, BUG-02-004 |
| **Notes** | The threshold operator still behaves like `>= 3`, so the lock activates on the threshold-crossing failure. BUG-02-003 remains in effect because the counter jumped `2 -> 4`. BUG-02-004 was also re-confirmed here because the generated `locked_until` was about 180 seconds ahead, not 30 seconds. |

### TC-BVA-02: Successful Login at `login_attempts = 2`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs set-attempts test@eshop.com 2`, verified `login_attempts=2`, `locked_until=null` |
| **Executed at** | 2026-07-02 12:50 |
| **Actual result** | Clicking `Sign In` with correct credentials sent `POST /api/login` -> HTTP 200. The UI left `/login` and loaded `/`. DB cross-check reset `login_attempts` from `2 -> 0`. |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-BVA-02-success-attempts-2.png` |
| **Bug ID** | - |
| **Notes** | Counter reset at the upper valid boundary was confirmed. |

### TC-BVA-03: Lock Timer, Still Locked While `locked_until > now`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs set-locked test@eshop.com +30`, verified `login_attempts=3` and future `locked_until` |
| **Executed at** | 2026-07-02 12:51 |
| **Actual result** | Clicking `Sign In` with correct credentials sent `POST /api/login` -> HTTP 403. The page stayed on `/login`, the UI showed the generic failure message, and the account was still blocked while `locked_until` remained in the future. |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-BVA-03-still-locked-29s.png` |
| **Bug ID** | - |
| **Notes** | This session used the helper-set future lock window. The account remained inaccessible while the stored expiry was still ahead of the current time. |

### TC-BVA-04: Lock Timer at Exact Expiry

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs set-locked test@eshop.com +0`, verified `login_attempts=3` and `locked_until` at the current instant |
| **Executed at** | 2026-07-02 12:51 |
| **Actual result** | Clicking `Sign In` with correct credentials sent `POST /api/login` -> HTTP 200. The UI left `/login` and loaded `/`. DB cross-check after the successful login showed `login_attempts=0` and `locked_until=null`. |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-BVA-04-boundary-allowed.png` |
| **Bug ID** | - |
| **Notes** | The exact-expiry path allowed login in this session. |

### TC-BVA-05: Lock Timer Past Expiry

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs set-locked test@eshop.com -1`, verified `login_attempts=3` and past `locked_until` |
| **Executed at** | 2026-07-02 12:51 |
| **Actual result** | Clicking `Sign In` with correct credentials sent `POST /api/login` -> HTTP 200. The UI left `/login` and loaded `/`. DB cross-check reset `login_attempts=0` and cleared `locked_until`. |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-BVA-05-unlocked-success.png` |
| **Bug ID** | - |
| **Notes** | Past-expiry access behavior matched the expected unlocked path. |

## Execution Summary

| Metric | Count |
| :----- | :---- |
| TC Designed, EP | 7 |
| TC Designed, BVA | 5 |
| TC Executed | 12 / 12 |
| Passed | 10 |
| Failed | 2, TC-03, TC-06 |
| Pass with deviation | 0 |
| Bugs found | 4, BUG-02-001 to BUG-02-004 |

## Bugs Discovered

| Bug ID | TC | Description | Severity |
| :----- | :- | :---------- | :------- |
| BUG-02-001 | TC-03 | Invalid email format is accepted by the login form and only rejected server-side | Medium |
| BUG-02-002 | TC-04 | Login error message renders below the `Sign In` button, not above it | Low |
| BUG-02-003 | TC-06 | Failed-login counter increments by 2 per bad submission | High |
| BUG-02-004 | TC-BVA-01 | Server lockout duration is about 180 seconds, not 30 seconds | Medium |
