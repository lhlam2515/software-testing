# Activity Worksheet — "Kill the Mutant"

> **Seminar:** T10 — Mutation Testing & Test Effectiveness
> **Module under test:** EShop coupon endpoint — `POST /api/apply-coupon` (`apps/backend/server.js`, FR-09)
> **Tool:** StrykerJS (Jest runner) + supertest · **Duration:** 25 minutes · **Team size:** 3–4
> **Status:** DRAFT for TA review — 2026-06-22

---

## 0. Goal

Five mutants below **survived** our baseline (happy-path) test suite — every existing test still passed even though `server.js` was changed. For each mutant, write **one supertest assertion** that PASSES on the original code and FAILS on the mutant (i.e. *kills* it). The team that kills the most mutants wins.

> A mutant is killed only when a test that passes on the ORIGINAL **fails** on the MUTANT. An assertion that passes on both kills nothing.

---

## ⚠️ Reality check — read before you start

This activity runs against EShop's **real, unmodified** backend code. Two things you must know:

1. **It is a monolith.** All logic is inline in `server.js` (no `services/`, no `controllers/`). The coupon logic lives inside the `POST /api/apply-coupon` route handler, nested in sqlite callbacks. We test it at the **HTTP level** with `supertest`, not as a unit function.
2. **The shipped code already has two real bugs** (EShop is a seeded SUT). Your assertions assert the code's **current behaviour** — which is sometimes wrong. That is the whole lesson: *mutation testing measures whether your tests detect change; it does not tell you the baseline is correct.* You still need the spec (FR-09) to know a bug from a feature.

| Bug | Where | Current (buggy) behaviour | FR-09 spec |
|---|---|---|---|
| **BUG-A** | min-order guard | `total_amount > min_order_amount` → order *exactly* at the threshold is rejected | should be `>=` |
| **BUG-B** | percent formula | `Math.floor(total_amount * (1 - discount_value))` → a 10% coupon yields a **negative** discount | should be `total × value / 100` |

> Talking point for the seminar: these two bugs are effectively **mutants that already survived in production** — no test caught them because EShop ships with zero tests.

---

## 1. Setup prerequisites (facilitator does this before class)

`server.js` calls `app.listen()` directly and does not export `app`, so supertest cannot import it as-is. One-time refactor:

```js
// bottom of server.js
module.exports = app;                 // add this
if (require.main === module) {        // guard the listen
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
}
```

Install + scope Stryker to the coupon route:

```bash
npm i -D jest supertest @stryker-mutator/core @stryker-mutator/jest-runner
# stryker.config.mjs → mutate: ['server.js'], testRunner: 'jest', coverageAnalysis: 'perTest'
```

All five mutants below use the **no-`user_id` branch**, so tests do **not** write to `coupon_usage` — the seeded DB stays read-only and the activity is fully reproducible.

### Endpoint contract (FR-09)

```
POST /api/apply-coupon
body: { code, total_amount, user_id? }
200 → { success:true, coupon_id, discount_amount, final_amount, message }
400 → { error }   // min-order not met, expired, usage limit
404 → { error }   // code not found / inactive
```

### Seeded coupons (`database.js`)

| Code | type | discount_value | min_order_amount | expired_at | max_uses_per_user |
|---|---|---|---|---|---|
| `SAVE10` | percent | 10 | 300,000 | 2099-12-31 | 1 |
| `BIGBUY` | fixed | 50,000 | 500,000 | 2099-12-31 | 1 |
| `VIP100` | fixed | 100,000 | 300,000 | 2099-12-31 | 2 |
| `EXPIRED` | percent | 20 | 100,000 | 2020-01-01 | 1 |

### Assertion format (supertest + Jest)

```js
const request = require('supertest');
const app = require('../server');

test('kills mutant N', async () => {
  const res = await request(app)
    .post('/api/apply-coupon')
    .send({ code: '...', total_amount: ... });   // omit user_id → no-user branch
  expect(res.status).toBe(...);
  // and/or: expect(res.body.discount_amount).toBe(...);
});
```

---

## 2. The five surviving mutants

Each box shows the original line (`-`) and the mutated line (`+`), with the line in `server.js`. Pick `code` + `total_amount` that make the two behave **differently**.

### Mutant 1 — `RelationalOperator` on the min-order guard (line ~379)
```diff
- if (total_amount > coupon.min_order_amount) {
+ if (total_amount >= coupon.min_order_amount) {
```
*Hint: a happy-path total (e.g. 600,000) won't catch this. What total exactly equals the threshold? (This line is also BUG-A — the mutant is accidentally the **correct** spec behaviour.)*

### Mutant 2 — `RelationalOperator` on the expiry check (line ~382)
```diff
- if (expiry < now) {
+ if (expiry > now) {
```
*Hint: there is exactly one already-expired coupon. Make sure its total clears the min-order guard first.*

### Mutant 3 — `EqualityOperator` on the coupon-type check (line ~418, no-user branch)
```diff
- if (coupon.type === "percent") {
+ if (coupon.type !== "percent") {
```
*Hint: send a percent coupon. Original takes the percent path (BUG-B → negative); mutant takes the fixed path. The two `discount_amount` values are very different.*

### Mutant 4 — `ArithmeticOperator` inside the percent formula (line ~419, no-user branch)
```diff
- discount_amount = Math.floor(total_amount * (1 - coupon.discount_value));
+ discount_amount = Math.floor(total_amount * (1 + coupon.discount_value));
```
*Hint: `expect(typeof discount_amount).toBe('number')` passes on BOTH. Assert the actual value.*

### Mutant 5 — `ArithmeticOperator` on the final amount (line ~425, no-user branch)
```diff
- const final_amount = total_amount - discount_amount;
+ const final_amount = total_amount + discount_amount;
```
*Hint: use a **fixed** coupon for clean numbers, and assert `final_amount`, not `discount_amount`.*

---

## 3. Your answers — one assertion per mutant

| # | code | total_amount | Assertion (status and/or body field = expected) | Will it kill? (✓/✗) |
|---|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |
| 4 |  |  |  |  |
| 5 |  |  |  |  |

---

## 4. Swap & review (0:13–0:18)

Swap worksheets with a partner team. For each assertion, mark:
- **KILL** — passes on original, fails on mutant. ✓
- **WEAK** — passes on both (wrong data, or only checks `typeof`/`success`). ✗
- **BROKEN** — fails on the original too (wrong expected value). ✗

Write one sentence: *which mutant was hardest to kill, and why?*

---

## 5. Rules & timing

| Time | Step |
|---|---|
| 0:00–0:03 | Facilitator shows the 5 mutant diffs |
| 0:03–0:13 | Each team writes 5 candidate assertions (§3) |
| 0:13–0:18 | Swap & review with a partner team (§4) |
| 0:18–0:22 | Facilitator runs assertions in the prepared sandbox; tally kills |
| 0:22–0:25 | Winning team explains its assertion design |

- AI tools allowed — but **every AI-suggested assertion must be cross-checked manually**. An assertion that passes on the mutant kills nothing.
- No internet needed after setup: the sandbox, seeded DB, and refactored `server.js` are provided.
- One minute-paper per team at the end (audience attendance credit).

---
---

# ANSWER KEY — FACILITATOR ONLY

> Do not distribute before 0:18. All values are the **real** behaviour of the unmodified `server.js` (bugs included). Each assertion passes on the original and fails on the stated mutant.

### Mutant 1 — min-order `>` → `>=` (boundary, status-based)
`SAVE10` (min 300,000), `total_amount = 300,000`, no `user_id`.
- Original `>`: `300000 > 300000` → false → else branch → **400** "chưa đủ giá trị tối thiểu".
- Mutant `>=`: `300000 >= 300000` → true → proceeds → **200**.
```js
const res = await request(app).post('/api/apply-coupon').send({ code:'SAVE10', total_amount:300000 });
expect(res.status).toBe(400);   // original 400, mutant 200 → KILL
```
> Teaching point: the *mutant* here is the spec-correct version (`>=`). The test locks in BUG-A. Mutation testing proves the test is sensitive to this line — it does **not** prove the line is correct.

### Mutant 2 — expiry `<` → `>` (status-based)
`EXPIRED` (exp 2020-01-01, min 100,000), `total_amount = 200,000`, no `user_id`.
- Original `<`: `2020 < now` → true → **400** "Mã giảm giá đã hết hạn".
- Mutant `>`: `2020 > now` → false → proceeds → 200.
```js
const res = await request(app).post('/api/apply-coupon').send({ code:'EXPIRED', total_amount:200000 });
expect(res.status).toBe(400);   // original 400, mutant 200 → KILL
```

### Mutant 3 — type `===` → `!==` (value-based)
`SAVE10` (percent, value 10), `total_amount = 500,000`, no `user_id`.
- Original: percent path → BUG-B `floor(500000 * (1 - 10))` = `floor(-4,500,000)` = **-4,500,000**.
- Mutant `!==`: takes the fixed path → `discount_amount = discount_value` = **10**.
```js
const res = await request(app).post('/api/apply-coupon').send({ code:'SAVE10', total_amount:500000 });
expect(res.body.discount_amount).toBe(-4500000);   // original -4,500,000, mutant 10 → KILL
```
> Teaching point: the original value is *negative* — that is BUG-B. The assertion documents real (broken) behaviour; flag the bug separately.

### Mutant 4 — percent arithmetic `1 - value` → `1 + value` (value-based)
`SAVE10` (percent, value 10), `total_amount = 400,000`, no `user_id`.
- Original: `floor(400000 * (1 - 10))` = `floor(-3,600,000)` = **-3,600,000**.
- Mutant: `floor(400000 * (1 + 10))` = `floor(4,400,000)` = **4,400,000**.
```js
const res = await request(app).post('/api/apply-coupon').send({ code:'SAVE10', total_amount:400000 });
expect(res.body.discount_amount).toBe(-3600000);   // original -3.6M, mutant 4.4M → KILL
```
> Teaching point: `expect(typeof res.body.discount_amount).toBe('number')` passes on BOTH → the classic coverage-vs-mutation gap.

### Mutant 5 — final `-` → `+` (value-based, clean numbers via fixed coupon)
`BIGBUY` (fixed 50,000, min 500,000), `total_amount = 600,000`, no `user_id`.
- Original: `discount_amount = 50,000`; `final_amount = 600000 - 50000` = **550,000**.
- Mutant: `final_amount = 600000 + 50000` = **650,000**.
```js
const res = await request(app).post('/api/apply-coupon').send({ code:'BIGBUY', total_amount:600000 });
expect(res.body.final_amount).toBe(550000);   // original 550000, mutant 650000 → KILL
```
> Teaching point: a test that only asserts `discount_amount` (= 50,000 on both) leaves this mutant ALIVE. You must assert `final_amount`. (Fixed coupons avoid BUG-B, so the numbers stay clean.)

### Why these survive a happy-path suite
A naive baseline test like `POST {code:'BIGBUY', total_amount:600000} → expect status 200` covers all five lines but kills **none** of M1–M5 (no boundary, no expired coupon, no type-flip, only `typeof`/`success` checks). That is the gap the activity exposes.
