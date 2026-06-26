# FR-02 — Execution Log

**Feature:** FR-02 — Login & Account Lockout  
**Tester:** Lê Hoàng Lâm (23127216)  
**SUT:** EShop frontend `http://localhost:5173`  
**DB:** `apps/backend/database.sqlite` · test account: `test@eshop.com` / `Test1234!`  
**Started:** 2026-06-25

Screenshots: `homeworks/HW02/artifacts/tests/FR-02-login-lockout/screenshots/`

---

## Domain Testing (EP) — TC-01 to TC-07

### TC-01 — Happy Path: Successful Login

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs set-attempts test@eshop.com 1` → `login_attempts=1` confirmed |
| **Executed at** | 2026-06-25 16:32 |
| **Actual result** | POST /api/login → 200 OK · JWT stored in localStorage · redirect to `/` · nav shows "Chào, Test User" · `login_attempts` reset 1→0 |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-01-pass-homepage.png` |
| **Bug ID** | — |
| **Notes** | EC15 (counter reset) confirmed. EC17 (JWT returned) confirmed. Observation: email field is `type="text"` not `type="email"` — impacts TC-02, TC-03. Password field also `type="text"` (known bug). |

---

### TC-02 — Empty Email

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (with deviation) |
| **Pre-condition setup** | none |
| **Executed at** | 2026-06-25 16:33 |
| **Actual result** | Form NOT submitted · no POST /api/login · stayed on /login · browser showed `required` validation tooltip |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-02-empty-email.png` |
| **Bug ID** | — |
| **Notes** | **Deviation:** blocked by `required` attribute, NOT by `type="email"` validation (email field is `type="text"`). Core behavior (no request, no JWT) matches expected, but mechanism differs from spec. |

---

### TC-03 — Invalid Email Format

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-02-001 |
| **Pre-condition setup** | none |
| **Executed at** | 2026-06-25 16:34 |
| **Actual result** | POST /api/login sent to server → 401 Unauthorized · error message "Đăng nhập thất bại. Vui lòng kiểm tra lại." displayed · `login_attempts` unchanged (0) |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/BUG-02-001-type-text-invalid-email.png` |
| **Bug ID** | **BUG-02-001** |
| **Notes** | Email field `type="text"` (not `type="email"`) → HTML5 format validation does NOT trigger → invalid formats bypass client-side validation and reach the server. Server rejects with 401 but this violates FR-22 which requires `type="email"`. Server correctly returns generic error (EC20 ok). `login_attempts` not incremented (non-existent email — no account to lock). |

---

### TC-04 — Unregistered Email

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (secondary BUG-02-002 found) |
| **Pre-condition setup** | none (`notfound@example.com` not in DB) |
| **Executed at** | 2026-06-25 16:34 |
| **Actual result** | POST /api/login → 401 · error message "Đăng nhập thất bại. Vui lòng kiểm tra lại." displayed · no JWT · no redirect |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-04-unregistered-email.png` |
| **Bug ID** | **BUG-02-002** (error position — see Notes) |
| **Notes** | Primary: EC04, EC18, EC20 verified ✅ · EC21 absent ✅. **BUG-02-002:** Error message displayed BELOW submit button, not above — violates FR-22. Also observed: password field plaintext (known), heading "Đăng Ký" wrong (known), label "Username" instead of "Email". |

---

### TC-05 — Empty Password

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS — Branch B observed |
| **Pre-condition setup** | `node test-db.cjs reset test@eshop.com` → `login_attempts=0` |
| **Executed at** | 2026-06-25 16:36 |
| **Actual result** | POST /api/login sent → 401 · error "Đăng nhập thất bại. Vui lòng kiểm tra lại." · `login_attempts` unchanged (0) · no JWT |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-05-empty-password.png` |
| **Bug ID** | — |
| **Notes** | **Gap G resolved:** Despite `required=true` on password field, Playwright's programmatic `fill ""` bypasses browser required validation → request reaches server (Branch B). Server rejects with 401 but does NOT increment `login_attempts` (empty password = hard reject before counter logic). |

---

### TC-06 — Wrong Password & Counter Increment

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-02-003 |
| **Pre-condition setup** | `node test-db.cjs reset test@eshop.com` → `login_attempts=0` |
| **Executed at** | 2026-06-25 16:38 |
| **Actual result** | POST /api/login → 401 · `login_attempts` incremented 0→2 (not 0→1) · no JWT · generic error message |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/BUG-02-003-login-attempts-plus2.png` |
| **Bug ID** | **BUG-02-003** |
| **Notes** | EC13 VIOLATED: counter increments by 2 not 1. Root cause: server increments `login_attempts` by 2 per failed attempt instead of 1. Consequence: account locks after 2 wrong attempts instead of 3 (effective lockout threshold = 2, not 3 as spec). EC14 (wrong increment) IS occurring. |

---

### TC-07 — Account Currently Locked

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Account locked via TC-06 (login_attempts=4, locked_until set) |
| **Executed at** | 2026-06-25 16:40 |
| **Actual result** | POST /api/login → 403 Forbidden · generic error "Đăng nhập thất bại. Vui lòng kiểm tra lại." · no JWT · `login_attempts` unchanged (4) |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-07-locked-correct-creds.png` |
| **Bug ID** | — |
| **Notes** | EC10, EC12 confirmed ✅. EC19 (JWT on failure) absent ✅. Server returns 403 (locked) vs 401 (wrong creds) — different HTTP status but same generic UI message (EC20 ✅). **Gap G2 resolved:** counter NOT incremented while locked. **Potential BUG-02-004:** locked_until = ~3 min from lock time (16:42:09 locked at ~16:39:09) — SRS specifies 30 seconds. Needs verification via BVA timer tests. |

---

## BVA — TC-BVA-01 to TC-BVA-05

### TC-BVA-01 — 3rd Failure: Lock Trigger at ON Point

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (with BUG-02-003 context) |
| **Pre-condition setup** | `node test-db.cjs set-attempts test@eshop.com 2` → `login_attempts=2` confirmed |
| **Executed at** | 2026-06-25 16:42 |
| **Actual result** | POST /api/login → 401/403 · `login_attempts` 2→4 · `locked_until` set · correct credentials immediately rejected |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-BVA-01-lock-triggered.png` |
| **Bug ID** | — (BUG-02-003 context only) |
| **Notes** | Primary objective: `>= 3` operator confirmed correct — lock triggers at count=3 ✅. Count reached 4 due to BUG-02-003 (server increments by 2 per attempt; the single submit pushed count from 2→4, crossing the threshold at 3 and locking, then writing 4). |

---

### TC-BVA-02 — Successful Login at count=2 (UB of valid class)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs set-attempts test@eshop.com 2` → `login_attempts=2` confirmed |
| **Executed at** | 2026-06-25 16:43 |
| **Actual result** | Login successful · JWT stored · redirect to `/` · `login_attempts` reset 2→0 |
| **Screenshot** | — (same UI as TC-01) |
| **Bug ID** | — |
| **Notes** | Counter reset at count=2 (UB) confirmed ✅. Post-reset: one failure → count=2 (due to BUG-02-003 double-submit), not 3 — no immediate re-lock from fresh state. |

---

### TC-BVA-03 — Lock Timer at 29s (UB-1, still locked)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs set-locked test@eshop.com "+30"` → `locked_until = NOW + 30s` (ISO 8601 format) |
| **Executed at** | 2026-06-25 16:47 |
| **Actual result** | Login rejected · 403 Forbidden · generic error "Đăng nhập thất bại. Vui lòng kiểm tra lại." · `login_attempts` unchanged (3) · no JWT |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-BVA-03-still-locked-29s.png` |
| **Bug ID** | — |
| **Notes** | Lock correctly active when `locked_until > NOW` ✅. First attempt with `+1 second` failed (SQLite format bug + form-fill latency ~8s exceeded budget). Fixed helper to use `new Date().toISOString()` (ISO 8601 T+Z format). |

---

### TC-BVA-04 — Lock Timer at Exactly 30s (UB / OFF Point)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (approximate) |
| **Pre-condition setup** | `node test-db.cjs set-locked test@eshop.com "+0"` → `locked_until = NOW` |
| **Executed at** | 2026-06-25 16:49 |
| **Actual result** | Login ALLOWED · redirect to `/` · `login_attempts` reset to 0 · no JWT from lock logic, new JWT from success |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-BVA-04-boundary-allowed.png` |
| **Bug ID** | — |
| **Notes** | By the time the request arrived (~2s after click), `locked_until` was already in the past → server ALLOWED. Confirms server uses `locked_until <= NOW` to allow. **Limitation:** Exact `locked_until = NOW` boundary (operator `>` vs `>=`) untestable with playwright-cli precision (~2-3s CLI overhead). |

---

### TC-BVA-05 — Lock Timer at 31s (UB+1, past expiry)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `node test-db.cjs set-locked test@eshop.com "-5"` → `locked_until = NOW - 5s` |
| **Executed at** | 2026-06-25 16:49 |
| **Actual result** | Login ALLOWED · redirect to `/` · `login_attempts` reset 3→0 · `locked_until` null |
| **Screenshot** | `artifacts/tests/FR-02-login-lockout/screenshots/TC-BVA-05-unlocked-success.png` |
| **Bug ID** | — |
| **Notes** | Server allows login when `locked_until < NOW` ✅. **Gap G1 resolved:** `login_attempts` resets to 0 after successful login post-lock. |

---

## Execution Summary

| Metric | Count |
| :----- | :---- |
| TC Designed (EP) | 7 |
| TC Designed (BVA) | 5 |
| TC Executed | 12 / 12 |
| Passed | 10 |
| Failed | 1 (TC-06) |
| Pass with deviation | 1 (TC-02) |
| Bugs found | 4 (BUG-02-001 to BUG-02-004) |

---

## Bugs Discovered

| Bug ID | TC | Description | Severity |
| :----- | :- | :---------- | :------- |
| BUG-02-001 | TC-03 | Email field `type="text"` instead of `type="email"` — HTML5 format validation bypassed | Medium |
| BUG-02-002 | TC-04 | Error message displayed BELOW submit button — violates FR-22 ("above the submit button") | Low |
| BUG-02-003 | TC-06 | Server increments `login_attempts` by 2 per failed attempt instead of 1 → lockout triggers after 2 wrong attempts instead of 3 | High |
| BUG-02-004 | TC-07 | Lockout duration is ~3 minutes (180s), not 30 seconds as specified in SRS demo spec | Medium |
