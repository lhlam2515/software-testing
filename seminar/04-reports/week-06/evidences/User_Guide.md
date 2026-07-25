# User Guide — Mutation Testing on EShop with StrykerJS + AI Assertion Synthesis

> **Seminar:** T10 — Mutation Testing & Test Effectiveness
> **Traditional tool:** StrykerJS (Jest runner) · **AI-augmented:** Claude / ChatGPT (assertion synthesis)
> **SUT:** EShop Node.js backend (`apps/backend/server.js`)
> **Team:** 02

---

## Table of contents

1. [Introduction](#1-introduction)
2. [Installation](#2-installation)
3. [First Test](#3-first-test-end-to-end-on-eshop)
4. [Advanced Usage](#4-advanced-usage)
5. [Troubleshooting](#5-troubleshooting)
6. [Failure Modes](#6-failure-modes)
7. [References](#7-references)

---

## 1. Introduction

### The problem

Code coverage proves a test _executed_ a line; it does not prove the test would _fail_ if that line were wrong. A suite can hit 100% coverage and still assert nothing meaningful.

A reported case (Theodo, banking microservice, via a Diffblue case study) had **96% line / 93% branch coverage with only 34% mutation score**; Wang et al. (MutGen, arXiv:2506.02954, 2025) report some LLM-generated suites reaching **100% coverage at ~4% mutation score**. Both are vendor/industry benchmarks, not independently reproduced. Treat them as directional evidence that the coverage/mutation gap is real and can be large, not as a universal constant (see §7).

### Core concepts

Three terms carry the rest of this guide:

- **Mutant**: a copy of the source with one small syntactic fault seeded in (a _mutation operator_): flip `>` to `>=`, change `-` to `+`, drop a `return`, swap a string literal. Stryker generates these automatically; you never write one by hand.
- **Killed vs. Survived**: run the existing test suite against each mutant. If at least one test now fails, the mutant is **killed** (the suite would have caught this bug). If every test still passes, it **survived**, a blind spot in the _assertions_, not necessarily in what code ran. A survived mutant on a line with 100% coverage means a test executed that line and checked nothing about the result.
- **Mutation Score (MS)**: `MS = killed / valid mutants × 100`, the test-effectiveness KPI this guide optimizes for. The report also shows `MS_covered` (killed / mutants that were actually reached by a test), which is always ≥ `MS` and can look much stronger while hiding untested code entirely. §6 FM3 walks through why citing `MS_covered` alone is misleading and what to report instead.

### What this guide covers

- Setting up **StrykerJS** on the EShop monolith backend and producing a baseline mutation report.
- Reading surviving mutants and writing assertions that kill them.
- Using **Claude/ChatGPT** to synthesise assertion candidates, plus the mandatory validation gate that stops the AI from misleading you.

### Who it is for

Developers/QA who already write Jest tests and want to measure and improve _assertion quality_, not just coverage. Assumes Node ≥ 18 and basic Jest familiarity.

### Why this stack for EShop

- EShop's backend is JavaScript (CommonJS, Express 5, sqlite3). StrykerJS is the JS-native mutation engine; PIT (Java) and mutmut (Python) cannot mutate it.
- StrykerJS has **no** assertion generation of its own; we pair it with an LLM to draft assertions for surviving mutants, gated by execution against the original and the mutant.

---

## 2. Installation

### Prerequisites

| Requirement | Notes |
|---|---|
| Node.js ≥ 18 | `node -v` |
| EShop backend | `apps/backend/` (Express 5, sqlite3) |
| OS | Linux/macOS/Windows. On Windows + Jest, set `tempDirName` (see §5). |

### Step 1: Install dev dependencies

```bash
cd apps/backend
npm i -D jest supertest @stryker-mutator/core @stryker-mutator/jest-runner
```

### Step 2: Make `server.js` testable (one-time refactor)

`server.js` calls `app.listen()` directly and does not export `app`, so `supertest` cannot import it. At the bottom of `server.js`:

```js
module.exports = app;                       // export for tests
if (require.main === module) {              // only listen when run directly
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
}
```

### Step 3: Jest config (`apps/backend/jest.config.js`)

```js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
};
```

### Step 4: Stryker config (`apps/backend/stryker.config.mjs`)

```js
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'jest',
  jest: { configFile: 'jest.config.js' },
  mutate: ['server.js'],            // monolith: the whole backend lives here
  coverageAnalysis: 'perTest',
  reporters: ['html', 'clear-text', 'progress'],
  htmlReporter: { fileName: 'reports/mutation/mutation.html' },
  timeoutMS: 60000,
  timeoutFactor: 2,                 // sqlite I/O is slow, give headroom
  concurrency: 1,                   // one mutant worker at a time
  testRunnerNodeArgs: ['--jitless'],
};
```

> Note: `package.json` here is `"type": "commonjs"`, so the Stryker config uses the `.mjs` extension to stay ESM. Add an npm script: `"test": "jest"`.
>
> `concurrency: 1` and `testRunnerNodeArgs: ['--jitless']` are not cosmetic: they exist because parallel mutant workers hitting the same SQLite-backed test database produced non-deterministic `Timeout`/`RuntimeError` results in earlier runs. See §6 FM1 for the failure mode this prevents; skipping these two lines reproduces it.

---

## 3. First Test (end-to-end on EShop)

Goal: kill a mutant on `POST /api/apply-coupon` (FR-09), starting from zero. Picks up after §2 (Jest + Stryker already configured). Scope Stryker to just this route (81 mutants, not the whole file) so runs stay fast. All numbers below are from these five tests only; a fuller suite kills more of the same 81 mutants, that's expected.

1. `server.js` already exports `app` (§2 Step 2).
2. In `stryker.config.mjs`: `mutate: ["server.js:363-441"]`. Revert to `["server.js"]` after this section.
3. Create `apps/backend/__tests__/coupon.test.js`. Use `createApi(app)` from `__tests__/helpers/http.js`, not raw `supertest` (adds a 2s/5s timeout, §6 FM1).
4. One happy-path test on `BIGBUY`:

   ```js
   const { createApi } = require('./helpers/http');
   const app = require('../server');
   const api = createApi(app);

   it('returns 200 with correct discount when valid fixed coupon meets min-order', async () => {
     const res = await api.post('/api/apply-coupon').send({ code: 'BIGBUY', total_amount: 600000 });
     expect(res.status).toBe(200);
     expect(res.body.success).toBe(true);
     expect(res.body.discount_amount).toBe(50000);
     expect(res.body.final_amount).toBe(550000);
   });
   ```

5. `npx jest`: 1 passed.
6. `npx stryker run`. **81 mutants, 21 killed, 16 survived, 44 NoCoverage → 25.93% / 56.76%.**
7. Clearest survivor: `server.js:L379`, `total_amount > coupon.min_order_amount` mutated to `>=`. Survives because the test (600000 vs 500000) never touches the boundary.
8. Add three BVA tests on `SAVE10` (`min_order_amount: 300000`):

   ```js
   it('returns 400 when total_amount is one unit below min-order (OFF point: 299,999)', async () => {
     const res = await api.post('/api/apply-coupon').send({ code: 'SAVE10', total_amount: 299999 });
     expect(res.status).toBe(400);
   });

   it('returns 400 when total_amount equals min-order (ON point: 300,000)', async () => {
     const res = await api.post('/api/apply-coupon').send({ code: 'SAVE10', total_amount: 300000 });
     expect(res.status).toBe(400);   // documents current behavior, see note below
   });

   it('returns 200 when total_amount is one unit above min-order (UB+1: 300,001)', async () => {
     const res = await api.post('/api/apply-coupon').send({ code: 'SAVE10', total_amount: 300001 });
     expect(res.status).toBe(200);
     expect(res.body.success).toBe(true);
   });
   ```

   ON-point (300,000) returns 400 today: an order that exactly equals the minimum is rejected. Likely a bug (a minimum should mean "reach it," not "exceed it"), found independently here, no existing ticket. `expect(400)` documents current behavior only.
9. `npx jest`: 4 passed.
10. `npx stryker run`. **24 killed, 20 survived, 37 NoCoverage → 29.63% / 54.55%.** L379 now **Killed**, but covered-score drops anyway: `SAVE10` is percent-type, so these tests newly cover the percent formula (`L419-420`) and its guard (`L418`), and only assert `status`. Two new survivors appear right there: a `BlockStatement` mutant on the `L418` guard, two `ArithmeticOperator` mutants on `L420`.
11. Why it matters: `discount_amount = Math.floor(total_amount * (1 - coupon.discount_value))`. `SAVE10.discount_value` is `10` (meant as "10%"), not `0.1`. `(1 - 10) = -9`: the route charges roughly 10x the order total instead of discounting 10%. Another bug found only by writing this assertion, no test before this checked the actual number.
12. Pin the current (buggy) output, don't fix it (out of scope, formula shared with other routes):

    ```js
    it('returns the exact percent-coupon discount and final amount for SAVE10 at 500,000', async () => {
      const res = await api.post('/api/apply-coupon').send({ code: 'SAVE10', total_amount: 500000 });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.discount_amount).toBe(-4500000);
      expect(res.body.final_amount).toBe(5000000);
    });
    ```

13. `npx jest`: 5 passed. `-4,500,000` / `5,000,000` is real output, confirmed before trusting the next Stryker run.
14. `npx stryker run`. **29 killed, 15 survived, 37 NoCoverage → 35.80% / 65.91%.** `L379`, `L418`, `L420` ×2 all **Killed**: 8 more kills from 2 assertions, zero new coverage since step 10.
15. Remaining 15 survivors: cosmetic message strings (`L431`) or low-value (`user_id` branch, `L386`, untested path here). Out of scope. Revert `mutate` to `["server.js"]`, commit `coupon.test.js`, move to §4.

> ⚠️ Two real bugs pinned above, not fixed: the percent-formula sign error (`L419-420`) and the strict `>` min-order check (`L379`). Both found independently while writing this walkthrough, no existing ticket for either. **Killed** proves the test now catches a change on that line; it does not mean the line's business logic is correct. See §6.

---

## 4. Advanced Usage

### 4.1 Scope and performance

- **`mutate`**: keep it on `server.js`; once split into modules, narrow to business-logic files and exclude bootstrap/seed.
- **`coverageAnalysis: 'perTest'`**: runs only the tests covering each mutant; usually the single biggest speedup.
- **`concurrency`**: defaults to CPU cores; lower it if sqlite makes runs memory-bound.
- **Mutation levels** (Stryker 8+): `mutationLevel: 1` for fast PR feedback, default for nightly.

### 4.2 Incremental runs (CI)

```bash
npx stryker run --incremental    # reuses prior verdicts via reports/stryker-incremental.json
npx stryker run --force          # full re-run (nightly/weekly) to catch drift
```

Cache `stryker-incremental.json` per branch with a fall-back to `main`. Real numbers, scoped to the `apply-coupon` route (`server.js:363-441`, 81 mutants, source/tests unchanged between runs):

| Run | Wall-clock | Log |
|---|---|---|
| 1st (`--incremental`, no cache yet) | 2 min 58 s | full mutation run, writes `reports/stryker-incremental.json` |
| 2nd (`--incremental`, cache present) | 2 s | `IncrementalDiffer: Incremental report: Result: 81 of 81 mutant result(s) are reused.` |

Nothing in `server.js` or the test files changed between the two runs, so every verdict was reused instead of re-executed: an ~89x speedup on this slice. In CI, the same cache only reuses mutants whose source line and covering tests are byte-identical to the cached run; touch either one and that mutant re-executes on the next `--incremental` pass.

### 4.3 Trimming noisy mutators

```js
mutator: { excludedMutations: ['StringLiteral', 'ObjectLiteral', 'ArrayDeclaration'] }
```

These generate many trivial/equivalent mutants on string-heavy code (e.g. the Vietnamese error messages in `server.js`) for little assertion benefit. Re-enable once the score stabilizes.

### 4.4 AI assertion synthesis (the AI-augmented feature)

For each surviving mutant, prompt the LLM with the source + the mutant diff:

```
You are an expert in Node.js testing with Jest + supertest.
Source under test:
<CODE> {the apply-coupon handler} </CODE>
The existing test PASSES on the original AND on this mutant:
<MUTANT_DIFF>
- if (total_amount > coupon.min_order_amount)
+ if (total_amount >= coupon.min_order_amount)
</MUTANT_DIFF>
Write ONE supertest assertion that PASSES on the original and FAILS on the mutant.
Return only the test code in a ```js block.
```

Then run the **validation gate** (§4.5).

### 4.5 Mandatory validation gate

Never accept an AI-generated assertion without:

```
1. Run the new test on the ORIGINAL  → must PASS.
2. Run it on the TARGET MUTANT       → must FAIL.
3. Run it on the other survivors     → report how many it newly kills.
4. Reject if (1) fails, (2) passes, or (3) = 0.
```

**Worked example, run against this repo: mutant #46, `server.js:56`, `EqualityOperator`:**

```diff
- if (newAttempts >= 3) {
+ if (newAttempts > 3) {
```

`newAttempts` is `login_attempts + 2`, so under the seeded/tested flows it only ever takes even values (2, 4, 6...); `>= 3` and `> 3` agree everywhere except exactly `3`, a boundary none of the existing tests reach. Two candidate assertions, both first written to set `login_attempts = 1` via the parameterized `UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?` handler so one failed login pushes `newAttempts` to exactly 3:

- **Accepted**: `expect(res.status).toBe(403)` on a login attempt immediately _after_ the boundary-triggering failure (asserts the account is now locked).
- **Rejected**: `expect(res.body.error).toBe('Invalid email or password')` on the boundary-triggering failure itself (asserts only the generic error message, which is identical on every failed login regardless of whether the lock fires).

Gate results, both run with `npx jest`:

| Assertion | On ORIGINAL | On MUTANT | Verdict |
|---|---|---|---|
| Accepted (`toBe(403)`) | PASS | **FAIL** (`Expected: 403, Received: 200`) | kills the mutant → keep |
| Rejected (error message) | PASS | PASS | never touches the mutated branch → reject per step 4 |

Adding only the accepted assertion and re-running Stryker scoped to `server.js:44-58` confirms the kill (`EqualityOperator` mutant on L56 moves from `Survived` to `Killed`) without touching the sibling `ConditionalExpression` mutant on the same line (`newAttempts >= 3` → `true`), which stays `Survived`. One assertion rarely clears every mutant on a shared line, and the report should be read mutant-by-mutant, not line-by-line.

---

## 5. Troubleshooting

> ≥ 3 real errors with fixes. Replace bracketed text with the exact messages you hit.

### E1: `Cannot find module` / app starts listening during tests

**Symptom:** supertest hangs, or `EADDRINUSE :3000` when running Jest.
**Cause:** `server.js` runs `app.listen()` on import and doesn't export `app`.
**Fix:** the export + `require.main === module` guard from §2 Step 2.

### E2: Stryker "Dry run failed" / "No tests found"

**Symptom:** Stryker aborts before mutating. Real captured error, from pointing `jest.configFile` at a config path that doesn't exist:

```
ERROR Stryker Unexpected error occurred while running Stryker
StrykerError: Error: MODULE_NOT_FOUND (undefined)
Error: Cannot find module '.../apps/backend/.stryker-tmp/sandbox-Op47w4/jest.config.nonexistent.js'
Require stack:
- .../node_modules/@stryker-mutator/util/dist/src/require-resolve.js
    at CustomJestConfigLoader.readConfigFromJestConfigFile (.../jest-runner/dist/src/config-loaders/custom-jest-config-loader.js:55:31)
    at async JestTestRunner.init (.../jest-runner/dist/src/jest-test-runner.js:59:32)
```

**Cause:** the same class of failure shows up two ways: Jest isn't green standalone, or the runner can't even load its own config. Here, `jest.config.js` doesn't resolve inside Stryker's sandbox (`.stryker-tmp/sandbox-*`), because the configured path is wrong. Note the error path lives _inside_ the sandbox, not the project root: Stryker copies the project there before running, so a typo'd `configFile` fails only for Stryker, never for a plain `npx jest`.
**Fix:** run `npx jest` first and get it green; confirm `mutate: ['server.js']`, the `testMatch` path, and that `jest.configFile` in `stryker.config.mjs` points at a file that actually exists relative to `apps/backend/`.

### E3: sqlite "database is locked" / non-deterministic test results

**Symptom:** intermittent failures across mutants.
**Cause:** tests writing to the shared DB (e.g. via `coupon_usage`), so runs aren't isolated.
**Fix:** test the **no-`user_id`** branch of apply-coupon (read-only), or point tests at a fresh copy of the seeded DB per run.

### E4: Jest can't run from a hidden temp dir (Windows)

**Symptom:** Stryker fails only on Windows.
**Fix:** `tempDirName: 'stryker-tmp'` (already in the §2 config).

### E5: a full run "times out" in a wrapped/CI shell but Stryker is still running

**Symptom:** the command that invoked `npm run stryker` (a CI job step, an orchestration wrapper, an agent tool call) reports a timeout or non-zero exit around the 5-minute mark, even though the mutation run itself is healthy.
**Cause:** on `server.js`, a full 541-mutant run takes roughly 8 to 9 minutes wall-clock (confirmed baseline: 8 min 30 s). Any caller with its own shorter timeout (a CI step timeout, a wrapper script, an interactive tool with a fixed call budget) cuts the connection before Stryker finishes, while the underlying process keeps mutating and still writes a complete `reports/mutation/mutation.html` afterward.
**Fix:** don't trust the wrapper's exit code as the source of truth for a long-running Stryker call. Either raise the caller's timeout above the expected wall-clock time, run `stryker run` detached/in the background and poll for the report file, or check the timestamp on `reports/mutation/mutation.html` before assuming the run failed.

---

## 6. Failure Modes

### FM1: `Timeout` counts as detected, not killed

**`Timeout` counts as `detected`, but that only proves a stuck CI build would notice, not that any assertion examined the mutated behavior.** Stryker's reasoning: if this mutant reached production, a hung test run is itself a real-world detection signal, so `Timeout` feeds the same numerator as `Killed` in `MS = detected / valid × 100`. The two remain separate statuses in the report, but nothing forces a reader to check which one produced a "detected" count.

Scan for "detected" as proof of strong assertions, and you'll silently count hangs as verified behavior, and may wrongly assume `Timeout` was excluded the way `RuntimeError` is (FM4). It was not; it still counts as a win for the mutation score.

A shared, file-based database is a common trigger: concurrent mutant workers contend for the same SQLite file lock, and a stuck request reports as `Timeout` (or `RuntimeError`, if the runner crashes instead) regardless of what the mutant actually changed. EShop's harness avoids this with `concurrency: 1` against an in-memory database instead of the shared file, plus an explicit deadline on every test request (`__tests__/helpers/http.js`, 2s response, 5s total) so a stuck request fails fast rather than quietly exhausting Stryker's own `timeoutMS`. With that isolation in place, a full run reports `0` `Timeout` and `0` `RuntimeError` mutants in `reports/mutation/index.html`.

- Detect: filter the HTML report by `Timeout` status, then check whether the mutated line has a plausible infinite-loop shape (an unbounded loop, a recursive call). If it does not, suspect harness contention rather than a genuine behavioral change.
- Read it correctly: `Timeout` means the CI pipeline would notice something changed, not that an assertion verified the change. Cite only `Killed` mutants as evidence of assertion quality.

### FM2: Equivalent mutants understate the real score, and excluding them casually is just as risky

**A `Survived` mutant isn't always a weak test: it can be undetectable in principle (an equivalent mutant). The real failure mode is how teams react to it, not the mutant itself.** A mutant is equivalent when the mutated source produces identical input-output behavior to the original for every possible input. Detecting equivalence in general reduces to program equivalence, which is Turing-undecidable (Budd & Angluin 1982, surveyed in Tian et al., ISSTA 2024), and reported equivalent-mutant rates in real-world codebases range from 4% to 39% (Madeyski et al. 2013, as cited in Tian et al. 2024). Every equivalent mutant lands in `Survived` by construction, dragging the numerator down while the denominator stays fixed, so `MS = detected/valid` understates real assertion strength without the suite actually being weaker.

Silently excluding a survivor from the denominator because it "looks equivalent" is exactly as dangerous as leaving it in: misjudge one non-equivalent survivor as equivalent, and a real test gap disappears from the report with no trace and no reviewer catching it later.

In `server.js`, the guard `if (require.main === module)` (line 570, Mutant #535/536/537) only controls whether `app.listen()` runs when the file is executed directly via `node server.js`. The exported `app` object that every Jest/supertest test imports never passes through that guard, so mutating it cannot change anything the suite can observe. Manual inspection classifies it as an equivalent mutant, a dead-code candidate for the current test scope.

- Detect: inspect persistent survivors manually rather than automating equivalence exclusion, since equivalence is undecidable in general and any automated rule will misclassify some real gaps.
- Handle it correctly: annotate a confirmed-equivalent mutant with `// stryker-disable next-line` plus a written justification (as done for #535-537), and require a second reviewer's sign-off before excluding anything from the denominator. Use AI to triage and explain candidates, never to silently auto-drop them.

### FM3: Citing `MS_covered` alone hides how much of the file was never run

**`MS_covered` is always the larger, more flattering number than plain `MS`, because it drops every mutant sitting in code the tests never ran.** Plain mutation score, `MS = detected / valid × 100`, uses every valid mutant as the denominator, including mutants at code locations no test ever executed (`NoCoverage`). `MS_covered = detected / covered × 100`, where `covered = detected + Survived`, drops `NoCoverage` mutants from the denominator entirely. `MS` answers how much of the whole file is protected by assertions; `MS_covered` answers how much of the code the tests actually touch is protected. Report `MS_covered` alone and a reader has no way to tell whether half the file was simply never exercised.

A full run against `server.js` shows the gap concretely. Of 541 total mutants, 293 fall in `NoCoverage`, meaning 54% of all mutants sit in code the test suite never reaches. `MS = 175/541 = 32.35%`, but `MS_covered = 175/248 = 70.56%`, more than double. Reporting 70.56% alone would make the suite look reasonably strong; the actual picture is that barely a third of the file is protected by assertions and over half is completely untested.

- Detect: report both numbers side by side. A large gap between them, 32.35% vs 70.56% here, signals a large `NoCoverage` region rather than strong assertions.
- Use it correctly: treat plain `MS` as the headline KPI in any report or dashboard, and use `MS_covered` only as a secondary diagnostic on the tests that do exist, never as the primary claim of suite strength.

### FM4: `RuntimeError` shrinks the denominator with none of the warning Stryker gives `NoCoverage`

**`RuntimeError` shrinks the denominator with none of the warning `NoCoverage` gets: the mutant disappears from the score as if it never existed.** Unlike `Timeout` (FM1, an unearned point toward `detected`), a `RuntimeError` (the test runner itself crashing while running a mutant, an out-of-memory error or a mutant that produces code the runner cannot execute) is classified as invalid and excluded from both the numerator and the denominator entirely. Stryker's HTML report does not flag invalid mutants with anything like the prominence it gives `NoCoverage`, so a run with a nontrivial `RuntimeError` count can look cleaner than it is.

Two runs of the same suite with the same real assertion strength can report different `MS` values purely because one run hit more runner crashes, and a reader comparing the two percentages would wrongly attribute the difference to test quality.

The same contention as FM1 can surface as `RuntimeError` instead of `Timeout`: whether a stuck database connection produces a hang or a runner crash depends on exact timing, not on anything about the mutant. The FM1 isolation fix (an in-memory test database, one mutant worker at a time, explicit request deadlines) removes the shared lock both paths depend on, so a clean run against `server.js` reports `0` `RuntimeError` alongside `0` `Timeout`.

- Detect: compare the `valid` count (the denominator of `MS`) against the `total` mutant count. A gap beyond the expected `Ignored` count means some mutants were excluded as `CompileError`/`RuntimeError`/`Pending`, worth auditing before trusting the score.
- Use it correctly: treat a nonzero `RuntimeError` count as a test-harness health signal, not a mutant-quality signal. Fix the shared-resource contention causing it before trusting the resulting score.

---

## 7. References

- Diffblue: case study on Theodo's banking microservice, cited in §1 for the 96%/93% coverage vs. 34% mutation score gap. Vendor-published benchmark, not independently reproduced; treat as directional, not as a universal ratio.
- Jia & Harman: _An Analysis and Survey of the Development of Mutation Testing_ (IEEE TSE, 2011).
- Petrović & Ivanković: _State of Mutation Testing at Google_ (ICSE 2018); Petrović et al.: _Practical Mutation Testing at Scale_ (arXiv:2102.11378).
- StrykerJS docs: Getting Started, Configuration. <https://stryker-mutator.io/docs/stryker-js/>
- StrykerJS docs: Mutant states & metrics (source for FM1/FM3/FM4 status semantics: `Timeout` = detected, `RuntimeError` = invalid/excluded, `MS` vs `MS_covered` formulas). <https://stryker-mutator.io/docs/mutation-testing-elements/mutant-states-and-metrics/>
- supertest: <https://github.com/ladjs/supertest> · Jest: <https://jestjs.io/>
- Dakhel et al.: _MuTAP_ (Information & Software Technology, 2024; arXiv:2308.16557).
- Wang et al.: _MutGen_ (arXiv:2506.02954, 2025).
- Tian et al.: _LLMs for Equivalent Mutant Detection_ (ISSTA 2024; arXiv:2408.01760).
- EShop SUT: `docs/eshop-sut/srs.md` (FR-09), `apps/backend/server.js`.
