# FR-02 — Domain Testing: Login & Account Lockout

**Feature:** FR-02 — Login & Account Lockout
**Technique:** Domain Testing (Equivalence Partitioning)
**Spec source:** `docs/eshop-sut/srs.md` — §2 FR-02 (cross-refs FR-01 for email/password format, FR-22 for form requirements)
**Author:** Lê Hoàng Lâm — 23127216

---

## 1. Feature Overview

FR-02 controls two core behaviors:

1. **Login:** Authenticate email + password → return a JWT Token on success, a generic error on failure.
2. **Account Lockout:** After **3 consecutive failures**, the account is temporarily locked for **30 seconds** (demo environment). The system returns an appropriate error message without revealing the specific reason.

Format constraints sourced from:

- **FR-01:** Email must follow `user@domain.com` format; password registered under rules: ≥ 8 characters, ≥ 1 uppercase, ≥ 1 lowercase, ≥ 1 digit, ≥ 1 special character (`@$!%*?&`).
- **FR-22:** Email field uses `type="email"`, password field uses `type="password"`. Error messages are displayed **above** the submit button.

---

## 2. Step 1 — Variables & Constraints

| Variable | Type | Description | Valid Domain / Boundaries | Dependencies & Constraints | Expected Error / Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `email` | Input | Email address entered in the login form | **Valid:** String matching `user@domain.com` format (HTML5 `type="email"`). Resolution: 1 character. | Must exist in DB (registered). Field uses `type="email"`. Linked to the corresponding account's `login_attempts`. | Invalid format → HTML5 blocks submission. Not found → generic error (reason not revealed). |
| `password` | Input | Password entered in the login form | **Valid:** Any string matching the stored hash (complexity rules not re-validated at login). Resolution: 1 character. | Must match stored hash. Field uses `type="password"`. Complexity rules (FR-01) apply only at registration, NOT re-checked at login. | No match → generic error + `login_attempts++`. |
| `login_attempts` | System State | DB column (`INTEGER DEFAULT 0`) tracking **consecutive** failed login attempts for the account | **Valid (no lock):** `[0, 2]`. **Invalid (locked):** `[3, +∞)`. Boundaries: `0` (init), `2` (OFF point), `3` (ON point — lock threshold). Resolution: 1 (integer). | Increments by exactly 1 per failure. Resets to 0 on success ("consecutive" — implied). Scoped per email. ⚠️ SRS does not specify whether counter resets after the 30s lockout expires. | count < 3 → login fails, counter increments, no lock. count ≥ 3 → account locked. |
| `account_locked` | System State (derived) | Temporary lock state — **not a DB column**; derived from `locked_until`. Active when `locked_until IS NOT NULL AND locked_until > datetime('now')`. | Binary: `false` (open) / `true` (locked). | Activated when `login_attempts ≥ 3` — server sets `locked_until = datetime('now', '+30 seconds')`. Auto-releases when `datetime('now') ≥ locked_until`. ⚠️ SRS does not clarify whether lockout is per-account or per-IP/session. | When `true` → all attempts rejected, even with correct credentials. Message is "appropriate" but reveals no details. |
| `locked_until` | System State | DB column (`DATETIME`) storing the **absolute timestamp** when the lock expires. `NULL` = not locked; set to `datetime('now', '+30 seconds')` on the 3rd failure. | **Locked:** `locked_until > datetime('now')` (lock still active). **Expired/No lock:** `locked_until IS NULL OR locked_until <= datetime('now')`. Boundaries: `locked_until = datetime('now')` (exact expiry). Resolution: 1 second. | Only meaningful when `login_attempts ≥ 3`. The server checks `locked_until > datetime('now')` on each request. ⚠️ SRS does not specify whether `login_attempts` resets to 0 when `locked_until` expires. | `locked_until > NOW()`: all requests rejected. `locked_until <= NOW()` or NULL: account accessible. |
| `jwt_token` | Output | JWT Token returned on successful login | **Valid:** Well-formed JWT string. **Invalid:** Absent (null/empty) in all failure cases. | Only issued when email exists + password matches + account is not locked. Stored client-side, sent via `Authorization: Bearer <token>`. | Success → token. All error cases → no token. |
| `error_message` | Output | Error message displayed on login failure | **Valid:** Generic text string, does not reveal the specific reason. | Displayed **above** the submit button (FR-22). Applies to: wrong credentials, locked account, email not found — same generic message format for all. | Wrong credentials → generic error. Locked → generic error (no remaining time revealed). Invalid email format → HTML5 validation (does not reach server). |

### Implicit Gaps

| # | Gap | Risk if not clarified |
| :--- | :--- | :--- |
| G1 | Does `login_attempts` reset to 0 after `locked_until` expires? | If not: one more failure would re-lock immediately — different behavior from "first failure". |
| G2 | Does `login_attempts` keep incrementing while the account is locked (`locked_until > NOW()`)? | Affects how many attempts are needed after unlock. |
| G3 | Is lockout per-account or per-IP/session? | Affects whether the lockout can be bypassed by switching IP or session. |
| G4 | No explicit length limit for email and password at login. | Must test with very long strings to detect potential bugs. |

---

## 3. Step 2 — Equivalence Classes

### Group 1 — `email` : Format

| Variable / Condition | EC ID | Description | Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `email` — Format | **EC01** | Empty string or whitespace only | Invalid | HTML5 `type="email"` blocks submission; no request sent to server |
| `email` — Format | **EC02** | Non-empty string, invalid format (missing `@`, missing domain, contains spaces, multiple `@`…) | Invalid | HTML5 `type="email"` blocks submission; no request sent to server |
| `email` — Format | **EC03** | String matching `user@domain.com` format | Valid | Request sent to server; continues to Existence check |

### Group 2 — `email` : Existence in DB *(applies only when EC03)*

| Variable / Condition | EC ID | Description | Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `email` — Existence | **EC04** | Valid format but **not registered** (not in DB) | Invalid | Server returns generic error; does **not** reveal "email not found" |
| `email` — Existence | **EC05** | Valid format and **registered** (exists in DB) | Valid | Server continues to password check |

### Group 3 — `password` : Hash Match

| Variable / Condition | EC ID | Description | Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `password` — Value | **EC06** | Empty string | Invalid | Blocked by `required` (if present) **or** generic error from server; ⚠️ SRS does not explicitly state `required` for the login password field |
| `password` — Value | **EC07** | Non-empty string, **does not match** stored hash | Invalid | Generic error; `login_attempts` increments by 1 |
| `password` — Value | **EC08** | String **exactly matches** stored hash | Valid | Proceeds through the successful login flow (if account is not locked) |

### Group 4 — `login_attempts` : Lock Threshold

| Variable / Condition | EC ID | Description | Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `login_attempts` | **EC09** | `login_attempts ∈ [0, 2]` — below lock threshold | Valid | Account not locked; login attempt is permitted |
| `login_attempts` | **EC10** | `login_attempts ≥ 3` — at or above lock threshold | Invalid | Account locked; **all** attempts rejected, even with correct credentials |

### Group 5 — `locked_until` : 30-Second Lockout Window

| Variable / Condition | EC ID | Description | Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `locked_until` | **EC11** | Outside lockout window: `login_attempts < 3` OR `locked_until IS NULL` OR `locked_until <= datetime('now')` | Valid | Account accessible; login attempt is permitted |
| `locked_until` | **EC12** | Within lockout window: `login_attempts ≥ 3` AND `locked_until IS NOT NULL` AND `locked_until > datetime('now')` | Invalid | Login rejected; generic error (remaining time not revealed) |

### Group 6 — `login_attempts` Counter Behavior

| Variable / Condition | EC ID | Description | Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `counter` — Increment on fail | **EC13** | After 1 failed login: `login_attempts` increments by **exactly 1** | Valid | `login_attempts_after = login_attempts_before + 1` (exactly) |
| `counter` — Wrong increment | **EC14** | After 1 failed login: `login_attempts` increments by **≠ 1** (0 or ≥ 2) | Invalid | Violates spec "increment counter by exactly 1 unit" |
| `counter` — Reset | **EC15** | After successful login: `login_attempts` **resets to 0** | Valid | `login_attempts = 0`; consistent with the meaning of "consecutive" in SRS |
| `counter` — No reset | **EC16** | After successful login: `login_attempts` **does not reset** | Invalid | Violates the meaning of "consecutive" — lock threshold miscounted |

### Group 7 — Output: `jwt_token`

| Variable / Condition | EC ID | Description | Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `jwt_token` — Success | **EC17** | Login succeeds (EC05 + EC08 + EC11) → JWT **is** returned | Valid | Valid JWT; stored client-side; used for `Authorization: Bearer` |
| `jwt_token` — Failure | **EC18** | Login fails (any invalid EC) → JWT **is not** returned | Valid | Response contains no token |
| `jwt_token` — Violation | **EC19** | Login fails but server still returns a JWT | Invalid | Security violation — authentication bypass |

### Group 8 — Output: `error_message` — Content

| Variable / Condition | EC ID | Description | Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `error_message` — Generic | **EC20** | Error message is **generic**, does not distinguish the reason | Valid | Correct per spec; prevents credential enumeration |
| `error_message` — Reveals details | **EC21** | Error message reveals the specific reason: "Email not found", "Wrong password"… | Invalid | Credential enumeration — violates security spec |

---

## 4. Step 3 — Minimum Test Cases

> **Strategy:** Pack as many Valid ECs as possible into the fewest TCs (Happy Path); then 1 TC per Invalid EC with remaining variables at nominal valid (Error Isolation).

---

### TC-01 — Happy Path: Successful Login

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-01 |
| **Test Case Name** | Happy Path — Successful login with counter reset |
| **ECs Covered** | EC03, EC05, EC08, EC09, EC11, EC15, EC17 |
| **ECs Verified Absent** | EC16 (counter not reset — does not occur) |
| **Pre-conditions** | Account `test@eshop.com` / `Test1234!` exists in DB · `login_attempts = 1` (one prior failure — to verify EC15 reset) · `locked_until IS NULL` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `Test1234!` |
| **Steps** | 1. Ensure pre-conditions: set `login_attempts = 1` (perform one failed login beforehand) · 2. Open login page at `http://localhost:5173` · 3. Enter `test@eshop.com` in the Email field · 4. Enter `Test1234!` in the Password field · 5. Click "Login" |
| **Expected Result** | ✅ HTTP 200 · Valid JWT Token returned and stored client-side · User redirected to home/dashboard · `login_attempts` reset to `0` |
| **Verification Points** | 1. Response body contains `token` field · 2. No error message displayed · 3. `login_attempts` = 0 (verify via DB or by performing 2 more failures → should require a full 3 to lock, not 2) |
| **Status** | ⬜ Not yet executed |

---

### TC-02 — Empty Email

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-02 |
| **Test Case Name** | Empty email — HTML5 validation blocks submission |
| **ECs Covered** | EC01 |
| **ECs Verified Absent** | — |
| **Pre-conditions** | No special pre-conditions required |
| **Input — `email`** | `""` (empty string) |
| **Input — `password`** | `Test1234!` (nominal valid) |
| **Steps** | 1. Open login page at `http://localhost:5173` · 2. Leave the Email field **empty** · 3. Enter `Test1234!` in the Password field · 4. Click "Login" |
| **Expected Result** | ❌ Browser displays HTML5 validation message (e.g., "Please fill in this field") · Form **not submitted** · No HTTP request sent to server · No JWT · `login_attempts` not incremented |
| **Verification Points** | 1. No network request to `/api/auth/login` (check DevTools → Network) · 2. HTML5 error tooltip displayed on the email field |
| **Status** | ⬜ Not yet executed |

---

### TC-03 — Invalid Email Format

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-03 |
| **Test Case Name** | Invalid email format — HTML5 `type="email"` validation blocks submission |
| **ECs Covered** | EC02 |
| **ECs Verified Absent** | — |
| **Pre-conditions** | No special pre-conditions required |
| **Input — `email`** | `"invalid_no_at_sign"` (missing `@`) |
| **Input — `password`** | `Test1234!` (nominal valid) |
| **Steps** | 1. Open login page · 2. Enter `invalid_no_at_sign` in the Email field · 3. Enter `Test1234!` in the Password field · 4. Click "Login" |
| **Expected Result** | ❌ Browser HTML5 `type="email"` validation blocks submission · HTML5 error tooltip displayed (e.g., "Please enter an email address") · No HTTP request sent to server · No JWT |
| **Verification Points** | 1. No network request to `/api/auth/login` · 2. HTML5 tooltip appears on the email field with a format error · 3. Also test with: `test@`, `@domain.com`, `test @domain.com` |
| **Status** | ⬜ Not yet executed |

---

### TC-04 — Unregistered Email

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-04 |
| **Test Case Name** | Valid email format but not found in DB |
| **ECs Covered** | EC04 |
| **ECs Observed (valid outputs)** | EC18 (no JWT), EC20 (generic error) |
| **ECs Verified Absent** | EC19 (JWT not returned on failure), EC21 (does not reveal "email not found") |
| **Pre-conditions** | Email `notfound@example.com` does **not** exist in DB · `login_attempts` not applicable (email not in system) |
| **Input — `email`** | `notfound@example.com` |
| **Input — `password`** | `Test1234!` (nominal valid) |
| **Steps** | 1. Open login page · 2. Enter `notfound@example.com` in the Email field · 3. Enter `Test1234!` in the Password field · 4. Click "Login" |
| **Expected Result** | ❌ Server returns an error · Error message is **generic** — does not say "email not found" or "account not registered" · No JWT in response |
| **Verification Points** | 1. Response contains no `token` field · 2. Error message does NOT reveal the reason (not "Email not found", "Account does not exist") · 3. Error message is present (not silent) |
| **Status** | ⬜ Not yet executed |

---

### TC-05 — Empty Password

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-05 |
| **Test Case Name** | Empty password on the login form |
| **ECs Covered** | EC06 |
| **ECs Observed** | EC18 (no JWT) |
| **ECs Verified Absent** | — |
| **Pre-conditions** | Account `test@eshop.com` exists · `login_attempts = 0` · `locked_until IS NULL` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `""` (empty string) |
| **Steps** | 1. Open login page · 2. Enter `test@eshop.com` in the Email field · 3. Leave the Password field **empty** · 4. Click "Login" |
| **Expected Result** | ❌ **Branch A (if `required` is present):** HTML5 blocks form submission; no request sent · **Branch B (if `required` is absent):** Request sent to server; server returns generic error; no JWT |
| **Verification Points** | 1. ⚠️ **Gap:** SRS does not explicitly state `required` attribute for the password field at login — record actual behavior · 2. If Branch B: check `login_attempts` — does it increment? (empty password = wrong password?) · 3. No JWT in either case |
| **Status** | ⬜ Not yet executed |

---

### TC-06 — Wrong Password & Counter Increment Check

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-06 |
| **Test Case Name** | Wrong password (non-empty) — counter increments by exactly 1 |
| **ECs Covered** | EC07, EC13 |
| **ECs Observed (valid outputs)** | EC18 (no JWT), EC20 (generic error) |
| **ECs Verified Absent** | EC14 (counter increment ≠ 1 — does not occur), EC19, EC21 |
| **Pre-conditions** | Account `test@eshop.com` / `Test1234!` exists · `login_attempts = 0` (clean state) · `locked_until IS NULL` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"WrongPass1!"` (wrong, non-empty) |
| **Steps** | 1. Reset test account to `login_attempts = 0` (if needed) · 2. Open login page · 3. Enter `test@eshop.com` in the Email field · 4. Enter `WrongPass1!` in the Password field · 5. Click "Login" · 6. Observe response and verify counter |
| **Expected Result** | ❌ Generic error message displayed · `login_attempts` increments from `0 → 1` (exactly 1 unit) · No JWT |
| **Verification Points** | 1. Response contains no `token` · 2. Error message is generic (does not say "wrong password") · 3. Verify `login_attempts` = 1: perform one more failure → `login_attempts` = 2; third failure → `login_attempts` = 3 → lock triggers (indirect verification of EC13) |
| **Status** | ⬜ Not yet executed |

---

### TC-07 — Account Currently Locked

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-07 |
| **Test Case Name** | Account currently locked — rejected even with correct credentials |
| **ECs Covered** | EC10, EC12 *(coupled: inseparable — see note)* |
| **ECs Observed (valid outputs)** | EC18 (no JWT) |
| **ECs Verified Absent** | EC19 (JWT not returned even with correct credentials), EC21 (does not reveal "locked due to X failures") |
| **Pre-conditions** | Account `test@eshop.com` exists · `login_attempts = 3` (threshold reached) · `locked_until = datetime('now', '+25 seconds')` (25s remaining in 30s window) |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"Test1234!"` *(correct credentials — to prove lock overrides even when correct)* |
| **Steps** | 1. Perform 3 consecutive failed logins to lock the account · 2. Wait approximately 5 seconds (still within 30s window) · 3. Open login page · 4. Enter `test@eshop.com` in the Email field · 5. Enter `Test1234!` (correct) in the Password field · 6. Click "Login" |
| **Expected Result** | ❌ Login **rejected** despite completely correct credentials · Generic error (does not say "locked due to 3 failures" or "X seconds remaining") · No JWT |
| **Verification Points** | 1. Response contains no `token` · 2. Error message is generic (does not reveal reason or remaining time) · 3. ⚠️ **Gap G2:** Record `login_attempts` after this attempt — does the counter increment to 4? |
| **Note** | EC10 (`login_attempts ≥ 3` = state locked) and EC12 (`locked_until > NOW()` = window active) cannot be separated in practice — they always coexist when the account is locked. Error Isolation is not violated because this is a composite system-state, not two independent inputs. |
| **Status** | ⬜ Not yet executed |

---

## 5. EC Coverage Matrix

| EC ID | Short Description | TC Covering | Mechanism |
| :--- | :--- | :--- | :--- |
| EC01 | Empty email | TC-02 | Direct trigger |
| EC02 | Invalid email format | TC-03 | Direct trigger |
| EC03 | Valid email format | TC-01 | Nominal valid input |
| EC04 | Unregistered email | TC-04 | Direct trigger |
| EC05 | Registered email | TC-01 | Pre-condition |
| EC06 | Empty password | TC-05 | Direct trigger |
| EC07 | Wrong password (non-empty) | TC-06 | Direct trigger |
| EC08 | Correct password | TC-01 | Nominal valid input |
| EC09 | `login_attempts` ∈ [0, 2] | TC-01 | Pre-condition `login_attempts=1 ∈ [0,2]` |
| EC10 | `login_attempts` ≥ 3 (locked) | TC-07 | Pre-condition `login_attempts=3` |
| EC11 | Outside lockout window (`locked_until IS NULL` or expired) | TC-01 | Pre-condition `locked_until IS NULL` |
| EC12 | Within lockout window (`locked_until > NOW()`) | TC-07 | Pre-condition `locked_until = NOW()+25s` |
| EC13 | `login_attempts` increments by exactly 1 | TC-06 | Observed: `0 → 1` |
| EC14 | `login_attempts` increment ≠ 1 | TC-06 | Verified absent (EC13 correct ↔ EC14 does not occur) |
| EC15 | `login_attempts` reset after success | TC-01 | Observed: `1 → 0` after successful login |
| EC16 | `login_attempts` not reset | TC-01 | Verified absent (EC15 correct ↔ EC16 does not occur) |
| EC17 | JWT returned (success) | TC-01 | Observed output |
| EC18 | JWT not returned (failure) | TC-04, TC-06, TC-07 | Observed output |
| EC19 | JWT returned on failure (violation) | TC-07 | Verified absent |
| EC20 | Generic error (reason not revealed) | TC-04, TC-06 | Observed output |
| EC21 | Error reveals specific reason (violation) | TC-04, TC-06 | Verified absent |

**Summary:** 7 TCs → 100% coverage (21/21 ECs)

| Group | Valid ECs | Invalid ECs | Total |
| :--- | :--- | :--- | :--- |
| email Format | EC03 | EC01, EC02 | 3 |
| email Existence | EC05 | EC04 | 2 |
| password Match | EC08 | EC06, EC07 | 3 |
| login_attempts | EC09 | EC10 | 2 |
| locked_until | EC11 | EC12 | 2 |
| counter behavior | EC13, EC15 | EC14, EC16 | 4 |
| jwt_token | EC17, EC18 | EC19 | 3 |
| error_message content | EC20 | EC21 | 2 |
| **Total** | **9 Valid** | **12 Invalid** | **21** |
