---
name: fr-execution
description: >
  Execute pre-designed test cases for an e-Shop SUT feature using playwright-cli
  for browser automation and test-db.cjs for SQLite state management. Reads
  domain-testing.md (EP) and bva.md (BVA) as the TC source, fills
  execution-log.md entries in real time, captures screenshots as evidence, and
  logs discovered bugs. Extracted from the FR-02 Login & Account Lockout
  execution experience.

  Trigger whenever the user says: "execute test cases", "run TCs", "thực thi
  test case", "chạy test case", "execute FR-XX", "run FR-XX", "fill execution
  log", "điền execution log", or "execute [feature] test cases". Also trigger
  when the user references a feature alongside words like "execute", "run", or
  "chạy" and test artifacts (domain-testing.md / bva.md / execution-log.md)
  are present.
---

# FR Execution — Playwright + DB State Workflow

**Methodology:** Black-box test execution against e-Shop SUT  
**Tools:** `playwright-cli` (UI automation) · `test-db.cjs` (DB state helper)  
**Output:** Filled `execution-log.md` + timestamped screenshots + bug IDs

---

## Phase 0 — Setup

Before running any TC, confirm:

1. **Feature artifacts exist:**
   - `homeworks/HW02/artifacts/tests/<feature>/domain-testing.md` — EP TCs
   - `homeworks/HW02/artifacts/tests/<feature>/bva.md` — BVA TCs
   - `homeworks/HW02/artifacts/tests/<feature>/execution-log.md` — log to fill (create from template if missing)

2. **SUT is running:** `http://localhost:5173` (frontend) · `http://localhost:3000` (backend)

3. **Test account ready:** verify via `node test-db.cjs get <email>` — account must exist in DB

4. **Screenshot directory exists:** `homeworks/HW02/artifacts/bugs/screenshots/`

---

## Phase 1 — Per-TC Execution Loop

Run EP test cases first (TC-01 → TC-N), then BVA (TC-BVA-01 → TC-BVA-M).

For each TC:

### Step 1 — Read the TC

From `domain-testing.md` or `bva.md`, extract:
- **Pre-condition** (DB state required before execution)
- **Input values** (what to type/click)
- **Expected result** (what should happen: HTTP status, UI message, DB change)
- **EC IDs** being covered (for Notes in the log)

### Step 2 — Setup DB pre-condition

Use `test-db.cjs` to reach the required state. Always verify with `get` after setting:

```bash
# Reset to clean state
node test-db.cjs reset <email>

# Set a specific attempt counter (without locking)
node test-db.cjs set-attempts <email> <n>

# Set a future lock (see Gotcha #1 and #2 below before using this)
node test-db.cjs set-locked <email> "+<N>"

# Verify the state before proceeding
node test-db.cjs get <email>
```

> **Always run `get` after setup and confirm values match the TC pre-condition before opening the browser.**

### Step 3 — Browser execution

```bash
# Open the target page
playwright-cli open http://localhost:5173/login

# Take a snapshot to identify element refs
playwright-cli snapshot

# Fill inputs and submit (use element refs from snapshot)
playwright-cli fill e<N> "<value>"
playwright-cli click e<submit-btn>

# Capture the result page
playwright-cli screenshot --filename=homeworks/HW02/artifacts/bugs/screenshots/<name>.png

# Inspect the network request (HTTP method + status)
playwright-cli requests

# Read post-execution DB state
node test-db.cjs get <email>
```

### Step 4 — Fill the execution log entry

Write the entry into `execution-log.md` immediately after each TC — don't batch at the end.

```markdown
### TC-XX — <TC name>

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS / ❌ FAIL — BUG-XX-NNN / ✅ PASS (with deviation) |
| **Pre-condition setup** | `node test-db.cjs ...` → `field=value` confirmed |
| **Executed at** | YYYY-MM-DD HH:MM |
| **Actual result** | POST /api/<endpoint> → <status> · <UI behavior> · `<field>` <before>→<after> |
| **Screenshot** | `artifacts/bugs/screenshots/<name>.png` |
| **Bug ID** | BUG-XX-NNN or — |
| **Notes** | EC<N> confirmed ✅. <Deviations or observations.> |
```

**Status values:**
- `✅ PASS` — actual matches expected exactly
- `❌ FAIL — BUG-XX-NNN` — actual deviates from expected; bug logged
- `✅ PASS (with deviation)` — core behavior correct but mechanism differs from spec

### Step 5 — Bug detection

Compare actual result against expected. If they differ:

1. **Assign a Bug ID:** `BUG-<FR number>-<NNN>` (increment NNN per bug found in this feature, e.g., BUG-02-001, BUG-02-002)
2. **Determine severity:**
   - High — blocks core functionality or security invariant violated
   - Medium — wrong behavior but workaround exists; spec clearly violated
   - Low — cosmetic or UX issue
3. **Root cause check:** if the actual behavior is surprising (e.g., counter increments by unexpected amount), grep the server handler before documenting root cause — avoid documenting a symptom as the cause
4. **Screenshot naming for bugs:** use `BUG-XX-NNN-<root-cause-slug>.png`

---

## Phase 2 — Fill Execution Summary

After all TCs are done, update the two summary sections at the bottom of `execution-log.md`:

### Execution Summary table

```markdown
| Metric | Count |
| :----- | :---- |
| TC Designed (EP) | N |
| TC Designed (BVA) | M |
| TC Executed | N+M / N+M |
| Passed | X |
| Failed | Y (list TC IDs) |
| Pass with deviation | Z (list TC IDs) |
| Bugs found | K (BUG-XX-001 to BUG-XX-K) |
```

### Bugs Discovered table

```markdown
| Bug ID | TC | Description | Severity |
| :----- | :- | :---------- | :------- |
| BUG-XX-001 | TC-NN | <concise root cause — what the system does wrong> | High/Medium/Low |
```

---

## Phase 3 — Commit

Stage and commit the execution artifacts:

```bash
git add homeworks/HW02/artifacts/tests/<feature>/execution-log.md
git add homeworks/HW02/artifacts/bugs/screenshots/
```

Then invoke the `commit` skill for the commit message.

---

## Screenshot Naming Convention

```
TC-XX-<brief-description>.png          # neutral / passing TC
BUG-XX-NNN-<root-cause-slug>.png       # TC that found a bug
```

**Examples:**
- `TC-01-pass-homepage.png`
- `TC-BVA-03-still-locked-29s.png`
- `BUG-02-003-login-attempts-plus2.png`

Keep the root-cause slug accurate — rename if root cause is later corrected.

---

## Gotchas

### Gotcha 1 — ISO 8601 lock format

`test-db.cjs set-locked` stores `locked_until` as ISO 8601 with T+Z separator:
```
"2026-06-25T09:47:32.657Z"   ← correct (what the server writes and reads)
"2026-06-25 09:47:32"        ← wrong (SQLite default — server comparison fails)
```

The helper uses `new Date(Date.now() + N*1000).toISOString()` to generate the correct format. Do **not** modify it to use SQLite's `datetime('now', ...)` — the formats are not interchangeable and a mismatch makes a locked account appear unlocked with no error.

### Gotcha 2 — CLI timing budget for set-locked

Running `playwright-cli fill` twice + `click` accumulates ~8 seconds of subprocess overhead. If `set-locked` window is shorter than ~10 seconds, the lock expires **during form fill** before the request reaches the server.

The TC silently becomes a "past-expiry" test (TC-BVA-05 behavior) instead of a "still-locked" test (TC-BVA-03 behavior).

**Rule:** use `+30` (seconds) as the minimum safe offset for any "still locked" BVA boundary test.

### Gotcha 3 — Verify root cause before documenting

If a counter increments by an unexpected amount (e.g., 0→2 after a single submit), resist writing "double request" as root cause. Check the server handler first:

```bash
grep -n "login_attempts" apps/backend/server.js
```

The increment may be hardcoded in the handler logic. Document what the code actually does, not what the network layer implies.
