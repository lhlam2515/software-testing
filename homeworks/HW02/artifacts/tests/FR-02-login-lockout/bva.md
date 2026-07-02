# FR-02 — Boundary Value Analysis: Login & Account Lockout

**Feature:** FR-02 — Login & Account Lockout
**Technique:** Boundary Value Analysis (BVA) — additive to Domain Testing
**Spec source:** `docs/eshop-sut/srs.md` — §2 FR-02
**Author:** Lê Hoàng Lâm — 23127216

---

## 1. Overview

BVA is applied as a supplement after Domain Testing (Equivalence Partitioning) to catch off-by-one defects at the exact turning points of the two numeric variables in FR-02:

1. **`login_attempts`** — Lock threshold at `count = 3`
2. **`locked_until`** — Lockout window: lock expires when `locked_until <= datetime('now')`

> BVA does not replace EP — it **enhances** the EC test set. BVA test cases target only boundary points; they do not repeat what EP already covers at midpoints.

---

## 2. Target Variables & Boundary Map

### 2.1 `login_attempts` — Lock threshold = 3

```
System behavior by counter value:

  [0]   [1]   [2]  |  [3]   [4]   ...
  ─────────────────|─────────────────
  ← VALID (no lock)| INVALID (locked) →
                   ↑
            ON Point (lock trigger)
             LB of invalid class

  login_attempts = 2 → OFF point: account NOT locked (one more fail → login_attempts = 3 → lock)
  login_attempts = 3 → ON point:  account LOCKED immediately
```

**Operator under test:** SRS states "3 or more consecutive failures" → `login_attempts ≥ 3`.
Potential defect: system implements `login_attempts > 3` (locks on 4th failure, not 3rd).

| BVA Point | `login_attempts` value | Role | Expected Behavior |
| :--- | :--- | :--- | :--- |
| UB of valid class | `login_attempts = 2` | OFF point (one more fail → transition to ON) | Not locked; one more fail → `login_attempts = 3` → LOCK |
| LB of invalid class | `login_attempts = 3` | ON point (first locked state) | Locked; all attempts rejected |
| Midpoint valid | `login_attempts = 1` | Nominal (covered by TC-01 in EP) | Not locked |
| Floor | `login_attempts = 0` | Lower bound (covered by TC-06 in EP) | Not locked |

### 2.2 `locked_until` — Lockout window

```
Remaining time (locked_until - NOW()):

  [+30s] ... [+15s] ... [+1s]  |  [0s / expired]  [-1s] ...
  ──────────────────────────────|────────────────────────────
  ←────────── LOCKED ───────────→|←──── UNLOCKED ────────→
                                 ↑
                         OFF point (lock expires)
                  locked_until = datetime('now') exactly

  locked_until = NOW()+1s → UB-1: 1 second remaining (still locked)
  locked_until = NOW()    → UB:   exact boundary (should be unlocked)
  locked_until = NOW()-1s → UB+1: clearly past expiry (unlocked)
```

**Operator under test:** SRS states "30 seconds" → lock lasts 30 seconds → unlocks when `locked_until <= datetime('now')`.
Potential defects:

- System uses `locked_until < datetime('now')` (strict less-than — unlocks only 1s after expiry) → TC-BVA-04 will FAIL.
- System uses remaining time `< 1s` (unlocks too early) → TC-BVA-03 will FAIL.

| BVA Point | `locked_until` value | Role | Expected Behavior |
| :--- | :--- | :--- | :--- |
| UB-1 of locked window | `datetime('now', '+1 seconds')` | 1 second remaining — still locked | Login rejected |
| UB of locked window | `datetime('now')` | Exact expiry boundary | Unlocked; login permitted |
| UB+1 of locked window | `datetime('now', '-1 seconds')` | 1 second past expiry | Clearly unlocked; login permitted |
| Midpoint | `datetime('now', '+15 seconds')` | Nominal (covered by TC-07 ≈ 25s in EP) | Still locked |

---

## 3. BVA Test Cases

---

### TC-BVA-01 — 3rd Failure: Lock Trigger at ON Point

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-01 |
| **Test Case Name** | 3rd failure — `login_attempts`: 2 → 3 → LOCK triggered |
| **Target Variable** | `login_attempts` |
| **Boundary Point Type** | UB(valid) = 2 → **ON Point transition** → 3 (LB of invalid) |
| **Target Variable State** | `login_attempts = 2` (exactly at UB of valid class — 2 prior failures) |
| **Pre-conditions** | Account `test@eshop.com` exists · `login_attempts = 2` (2 prior failures, one more will lock) · `locked_until IS NULL` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"WrongPass1!"` (wrong — to trigger 3rd failure) |
| **Steps** | 1. Set `login_attempts = 2`: perform 2 consecutive failed logins from a fresh account (`login_attempts=0`) · 2. Open the login page at `http://localhost:5173/login` · 3. Enter `test@eshop.com` in the `Username` field · 4. Enter `WrongPass1!` in the `Mật khẩu` field · 5. Click `Sign In` · 6. Immediately observe: is the account locked? |
| **Defect Target** | Catches wrong operator: if system uses `> 3` instead of `>= 3`, the 3rd failure will NOT lock → account still accepts the next attempt (test FAILS). If system correctly uses `>= 3`, the 3rd failure = LOCK immediately. |
| **Expected Result** | ❌ Fails with generic error · `login_attempts: 2 → 3` · **Account LOCKED immediately after this failure** (`locked_until` set to `datetime('now', '+30 seconds')`) · Next attempt (even with correct credentials) must be rejected while `locked_until > datetime('now')` |
| **Verification Points** | 1. Counter transitions from 2 → 3 (exactly 1 unit) · 2. Immediately after: attempt login with correct credentials → must be rejected (`locked_until > NOW()`) · 3. After 30s (`locked_until` expired): retry with correct credentials → must succeed |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-02 — Success at UB of Valid Class (`login_attempts = 2`)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-02 |
| **Test Case Name** | Successful login when `login_attempts = 2` (UB of valid class) — counter reset |
| **Target Variable** | `login_attempts` |
| **Boundary Point Type** | **UB(valid) = 2** — success scenario at the upper bound of the valid class |
| **Target Variable State** | `login_attempts = 2` (exactly at UB, one more fail would lock — but this test uses correct credentials) |
| **Pre-conditions** | Account `test@eshop.com` exists · `login_attempts = 2` · `locked_until IS NULL` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"Test1234!"` (correct) |
| **Steps** | 1. Set `login_attempts = 2`: perform 2 consecutive failures · 2. Open the login page at `http://localhost:5173/login` · 3. Enter `test@eshop.com` in the `Username` field · 4. Enter `Test1234!` (correct) in the `Mật khẩu` field · 5. Click `Sign In` · 6. Verify counter and JWT |
| **Defect Target** | Catches reset logic defect at UB: if the counter does not reset after success when `login_attempts=2`, the next failure would be counted as "3rd failure" (not the 1st of a new sequence) → lockout logic broken. |
| **Expected Result** | ✅ Login successful · JWT Token returned · `login_attempts: 2 → 0` (fully reset) · `locked_until` remains NULL · No error message · Afterwards: 1 new failure = `login_attempts = 1` (not 3) |
| **Verification Points** | 1. JWT returned in response · 2. To verify counter = 0: perform 1 failure → `login_attempts` must be 1 (not 3, no lock) · 3. If system is broken: 1 failure after → `login_attempts = 3` → lock → bug! |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-03 — Lock Timer at 29s Remaining (UB-1, 1 Second Remaining)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-03 |
| **Test Case Name** | 1 second remaining in lock window — account still locked (UB-1) |
| **Target Variable** | `locked_until` |
| **Boundary Point Type** | **UB-1 of locked window** — 1 second before expiry, account must still be locked |
| **Target Variable State** | `login_attempts = 3` · `locked_until = datetime('now', '+1 seconds')` (1 second remaining) |
| **Pre-conditions** | Account `test@eshop.com` exists · Perform 3 consecutive failures to trigger lock · Set `locked_until = datetime('now', '+1 seconds')` via DB or wait until 1 second remaining · `locked_until > datetime('now')` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"Test1234!"` (correct — to eliminate "rejected due to wrong password") |
| **Steps** | 1. Fail 3 times consecutively → lock triggered · 2. Set `locked_until = datetime('now', '+1 seconds')` via DB (preferred) OR wait until 29 seconds have elapsed since lock · 3. Open the login page at `http://localhost:5173/login` · 4. Enter `test@eshop.com` in the `Username` field and `Test1234!` in the `Mật khẩu` field · 5. Click `Sign In` while `locked_until > NOW()` |
| **Defect Target** | Catches too-short timeout: if system unlocks before `locked_until` (e.g., at 29s elapsed instead of 30s), this test will PASS (receives JWT) when expected is FAIL (rejected). |
| **Expected Result** | ❌ Login **still rejected** (1 second remaining) · Generic error · No JWT · `locked_until > datetime('now')` |
| **Verification Points** | 1. Response contains no `token` · 2. After `locked_until` passes (≥ 1 more second): retry — must succeed (confirms boundary is at `locked_until`) · 3. Record actual DB value of `locked_until` to confirm timing |
| **Setup Note** | Precision timing is critical: use DB direct manipulation (`UPDATE users SET locked_until = datetime('now', '+1 seconds') WHERE email = 'test@eshop.com'`) rather than manual waiting for exactness. |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-04 — Lock Timer at Exact Expiry (UB — OFF Point)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-04 |
| **Test Case Name** | `locked_until = datetime('now')` — account must be unlocked (UB / OFF point) |
| **Target Variable** | `locked_until` |
| **Boundary Point Type** | **UB of locked window = OFF point of lock** — exactly at the expiry boundary |
| **Target Variable State** | `login_attempts = 3` · `locked_until = datetime('now')` (exactly expired) |
| **Pre-conditions** | Account `test@eshop.com` exists · `login_attempts = 3` · `locked_until` set to `datetime('now')` via DB manipulation |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"Test1234!"` (correct) |
| **Steps** | 1. Set `login_attempts = 3` and `locked_until = datetime('now')` via DB · 2. Open the login page at `http://localhost:5173/login` · 3. Enter `test@eshop.com` in the `Username` field and `Test1234!` in the `Mật khẩu` field · 4. Click `Sign In` immediately |
| **Defect Target** | Catches wrong operator: if system uses `locked_until < datetime('now')` (strict less-than) instead of `locked_until <= datetime('now')`, account will still be locked at exact expiry → test FAILS when expected is SUCCESS. |
| **Expected Result** | ✅ Login **permitted** when `locked_until <= datetime('now')` · JWT Token returned · Account unlocked · ⚠️ **Gap G1:** Record `login_attempts` after unlock — does it auto-reset to 0? Or remain = 3? |
| **Verification Points** | 1. JWT returned · 2. Record `login_attempts` value after successful login: if = 3 (not reset), one more failure → re-locks immediately · 3. If = 0 (reset), behavior returns to normal |
| **Setup Note** | This is the most important BVA test for `locked_until`. Use DB direct manipulation: `UPDATE users SET login_attempts = 3, locked_until = datetime('now') WHERE email = 'test@eshop.com'` — then submit the form immediately (within ~1 second) to stay at the boundary. |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-05 — Lock Timer Past Expiry (UB+1, 1 Second Past)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-05 |
| **Test Case Name** | `locked_until` 1 second in the past — clearly expired, account accessible (UB+1) |
| **Target Variable** | `locked_until` |
| **Boundary Point Type** | **UB+1 of locked window** — 1 second past lockout expiry, baseline confirmation |
| **Target Variable State** | `login_attempts = 3` · `locked_until = datetime('now', '-1 seconds')` (expired 1 second ago) |
| **Pre-conditions** | Account `test@eshop.com` exists · `login_attempts = 3` · `locked_until = datetime('now', '-1 seconds')` via DB |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"Test1234!"` (correct) |
| **Steps** | 1. Set `login_attempts = 3` and `locked_until = datetime('now', '-1 seconds')` via DB · 2. Open the login page at `http://localhost:5173/login` · 3. Enter `test@eshop.com` in the `Username` field and `Test1234!` in the `Mật khẩu` field · 4. Click `Sign In` |
| **Defect Target** | Baseline confirmation past the boundary: confirms account is fully accessible when `locked_until` is in the past. Catches race conditions or timer drift in the implementation. |
| **Expected Result** | ✅ Login successful · JWT Token returned · ⚠️ **Gap G1 (continued):** If `login_attempts` remains = 3 after unlock (not reset), one more failure → re-locks immediately (since `login_attempts ≥ 3`). This behavior must be documented as either a bug or expected behavior. |
| **Verification Points** | 1. JWT returned · 2. Record `login_attempts` after success: if reset = 0 → OK. If still = 3 → potential logic defect · 3. Perform 1 failure immediately after → observe counter behavior (verify Gap G1) |
| **Status** | ⬜ Not yet executed |

---

## 4. Defect Coverage Matrix

| TC | Variable | Boundary Point | Wrong Operator Caught | If system is broken → Actual ≠ Expected |
| :--- | :--- | :--- | :--- | :--- |
| TC-BVA-01 | `login_attempts` | 2 → 3 (transition) | `> 3` instead of `>= 3` | 3rd failure does not lock → TC FAILS (still accepts requests) |
| TC-BVA-01 | `login_attempts` | 2 → 3 (transition) | `>= 2` (locks too early) | 2nd failure already locks → pre-condition breaks |
| TC-BVA-02 | `login_attempts` | `login_attempts=2`, success | Counter not reset at UB | 1 subsequent fail counted as "3rd fail" → unexpected lock |
| TC-BVA-03 | `locked_until` | `NOW()+1s` (UB-1) | Timeout `< 30s` (unlocks early) | 29s elapsed accepted → TC FAILS (expected reject, got JWT) |
| TC-BVA-04 | `locked_until` | `NOW()` (UB) | `locked_until < NOW()` instead of `<= NOW()` | Exact expiry still locked → TC FAILS (expected JWT, got error) |
| TC-BVA-05 | `locked_until` | `NOW()-1s` (UB+1) | Race condition / timer drift | `locked_until` past but still locked → rare timing bug |

---

## 5. Setup Protocol

For TC-BVA-03, TC-BVA-04, and TC-BVA-05, precise timing is critical.

### Option A: Manual Timing (sufficient for demo, ±1s tolerance)

```
1. Reset test account: UPDATE users SET login_attempts = 0, locked_until = NULL WHERE email = 'test@eshop.com'
2. Fail login 3 consecutive times → lock triggered (locked_until = NOW + 30s)
3. Record T_lock = timestamp of the 3rd failure
4. Execute tests at:
   - TC-BVA-03: T_lock + 29s (1 second remaining)
   - TC-BVA-04: T_lock + 30s (exact expiry)
   - TC-BVA-05: T_lock + 31s (1 second past)
5. Record actual behavior at each moment
```

### Option B: Database Direct Manipulation (recommended for precision)

```sql
-- TC-BVA-03: Simulate 1 second remaining
UPDATE users
SET login_attempts = 3, locked_until = datetime('now', '+1 seconds')
WHERE email = 'test@eshop.com';

-- TC-BVA-04: Simulate exact expiry (locked_until = NOW)
UPDATE users
SET login_attempts = 3, locked_until = datetime('now')
WHERE email = 'test@eshop.com';

-- TC-BVA-05: Simulate 1 second past expiry
UPDATE users
SET login_attempts = 3, locked_until = datetime('now', '-1 seconds')
WHERE email = 'test@eshop.com';

-- Reset account to clean state
UPDATE users
SET login_attempts = 0, locked_until = NULL
WHERE email = 'test@eshop.com';
```

> ⚠️ Confirmed DB schema: field is `locked_until` (DATETIME) in the `users` table. `NULL` = no lock. Server checks `locked_until IS NOT NULL AND locked_until > datetime('now')` to determine lock state.

---

## 6. Test Suite Summary

| Group | TC | Variable | Boundary Point | Objective |
| :--- | :--- | :--- | :--- | :--- |
| BVA — count threshold | TC-BVA-01 | `login_attempts` | `login_attempts=2 → 3` (transition) | Off-by-one at lock trigger |
| BVA — count threshold | TC-BVA-02 | `login_attempts` | `login_attempts=2`, success | Counter reset at UB |
| BVA — timer window | TC-BVA-03 | `locked_until` | `NOW()+1s` (UB-1) | Early unlock bug |
| BVA — timer window | TC-BVA-04 | `locked_until` | `NOW()` (UB / OFF point) | Exact boundary operator |
| BVA — timer window | TC-BVA-05 | `locked_until` | `NOW()-1s` (UB+1) | Post-expiry baseline |

**Total for FR-02:**

| Group | TC Count |
| :--- | :--- |
| Domain Testing (EP) — TC-01 to TC-07 | 7 |
| BVA Enhancement — TC-BVA-01 to TC-BVA-05 | 5 |
| **Total** | **12** |
