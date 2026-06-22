# User Guide — Mutation Testing on EShop with StrykerJS + AI Assertion Synthesis

> **Seminar:** T10 — Mutation Testing & Test Effectiveness
> **Traditional tool:** StrykerJS (Jest runner) · **AI-augmented:** Claude / ChatGPT (assertion synthesis)
> **SUT:** EShop Node.js backend (`apps/backend/server.js`)
> **Team:** _[names]_ · **Status:** DRAFT skeleton — 2026-06-22
>
> _Conventions in this draft:_ `TODO` = capture real output before submission · `📷` = insert a screenshot here.

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
Code coverage proves a test *executed* a line; it does not prove the test would *fail* if that line were wrong. A suite can hit 100% coverage and still assert nothing meaningful.

> Anchor numbers to cite: 96% line / 93% branch coverage with only **34%** mutation score (Diffblue/Theodo); some suites reach 100% coverage at **~4%** mutation score (Wang et al., MutGen). _[verify before printing — §7]_

**Mutation testing** seeds small faults (*mutants*) into the source — flip `>` to `>=`, change `-` to `+`, remove a `return` — then runs the existing suite. If a test fails, the mutant is **killed**; if all pass, it **survived** (a blind spot). The **mutation score = killed / valid mutants** is the test-effectiveness KPI.

### What this guide covers
- Setting up **StrykerJS** on the EShop monolith backend and producing a baseline mutation report.
- Reading surviving mutants and writing assertions that kill them.
- Using **Claude/ChatGPT** to synthesise assertion candidates — and the mandatory validation gate that stops the AI from misleading you.

### Who it is for
Developers/QA who already write Jest tests and want to measure and improve *assertion quality*, not just coverage. Assumes Node ≥ 18 and basic Jest familiarity.

### Why this stack for EShop
- EShop's backend is JavaScript (CommonJS, Express 5, sqlite3). StrykerJS is the JS-native mutation engine — PIT (Java) and mutmut (Python) cannot mutate it.
- StrykerJS has **no** assertion generation of its own; we pair it with an LLM to draft assertions for surviving mutants, gated by execution against the original and the mutant.

---

## 2. Installation

### Prerequisites
| Requirement | Notes |
|---|---|
| Node.js ≥ 18 | `node -v` |
| EShop backend | `apps/backend/` (Express 5, sqlite3) |
| OS | Linux/macOS/Windows. On Windows + Jest, set `tempDirName` (see §5). |

### Step 1 — install dev dependencies
```bash
cd apps/backend
npm i -D jest supertest @stryker-mutator/core @stryker-mutator/jest-runner
```
> 📷 TODO: screenshot of successful install / `npx stryker --version`.

### Step 2 — make `server.js` testable (one-time refactor)
`server.js` calls `app.listen()` directly and does not export `app`, so `supertest` cannot import it. At the bottom of `server.js`:
```js
module.exports = app;                       // export for tests
if (require.main === module) {              // only listen when run directly
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
}
```

### Step 3 — Jest config (`apps/backend/jest.config.js`)
```js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
};
```

### Step 4 — Stryker config (`apps/backend/stryker.config.mjs`)
```js
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  packageManager: 'npm',
  testRunner: 'jest',
  jest: { projectType: 'custom', configFile: 'jest.config.js' },
  mutate: ['server.js'],            // monolith: the whole backend lives here
  coverageAnalysis: 'perTest',
  reporters: ['html', 'clear-text', 'progress', 'json'],
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  thresholds: { high: 80, low: 60, break: null },   // break:null for the first run
  timeoutMS: 60000,
  timeoutFactor: 2,                 // sqlite I/O is slow — give headroom
  tempDirName: 'stryker-tmp',       // required on Windows + Jest
};
```
> Note: `package.json` here is `"type": "commonjs"`, so the Stryker config uses the `.mjs` extension to stay ESM. Add an npm script: `"test": "jest"`.

---

## 3. First Test (end-to-end on EShop)

Goal: from zero to a killed mutant in ≤ 15 steps, using the coupon endpoint `POST /api/apply-coupon` (FR-09).

1. Refactor `server.js` to export `app` (§2 Step 2).
2. Create `apps/backend/__tests__/coupon.test.js`.
3. Write one **happy-path** baseline test:
   ```js
   const request = require('supertest');
   const app = require('../server');

   test('BIGBUY applies a fixed discount', async () => {
     const res = await request(app)
       .post('/api/apply-coupon')
       .send({ code: 'BIGBUY', total_amount: 600000 });   // no user_id → no-user branch
     expect(res.status).toBe(200);
     expect(res.body.success).toBe(true);
   });
   ```
4. Run Jest, confirm green: `npx jest`. → 📷 TODO.
5. Run the baseline mutation pass: `npx stryker run`.
6. Open `reports/mutation/index.html` in a browser. → 📷 TODO: HTML report overview.
7. Record the **baseline mutation score** for `server.js` in `BASELINE.md`. → TODO: `__%`.
8. Drill into the coupon lines; find a **Survived** mutant. Example you will see:
   `total_amount - discount_amount` → `total_amount + discount_amount` (final-amount mutant) survives, because the happy-path test only checks `status`/`success`.
9. Explain *why* it survived: no assertion inspects `final_amount`.
10. Add a targeted assertion that kills it:
    ```js
    test('BIGBUY final_amount = total - discount (kills + mutant)', async () => {
      const res = await request(app)
        .post('/api/apply-coupon')
        .send({ code: 'BIGBUY', total_amount: 600000 });
      expect(res.body.discount_amount).toBe(50000);
      expect(res.body.final_amount).toBe(550000);   // original 550000, mutant 650000
    });
    ```
11. Re-run `npx jest` → green on original.
12. Re-run `npx stryker run`; confirm that mutant is now **Killed**. → 📷 TODO.
13. Note the new mutation score vs baseline in `BASELINE.md`. → TODO.
14. Repeat for two more survivors (e.g. the expiry `<`→`>` and the min-order `>`→`>=` mutants).
15. Commit: tests + config + `BASELINE.md`.

> ⚠️ EShop ships with two real bugs in this route (min-order uses `>` instead of `>=`; the percent formula yields a *negative* discount). Asserting current behaviour will lock those bugs in — flag them against FR-09 separately. See §6.

---

## 4. Advanced Usage

### 4.1 Scope and performance
- **`mutate`** — keep it on `server.js`; once split into modules, narrow to business-logic files and exclude bootstrap/seed.
- **`coverageAnalysis: 'perTest'`** — runs only the tests covering each mutant; usually the single biggest speedup.
- **`concurrency`** — defaults to CPU cores; lower it if sqlite makes runs memory-bound.
- **Mutation levels** (Stryker 8+) — `mutationLevel: 1` for fast PR feedback, default for nightly.

### 4.2 Incremental runs (CI)
```bash
npx stryker run --incremental    # reuses prior verdicts via reports/stryker-incremental.json
npx stryker run --force          # full re-run (nightly/weekly) to catch drift
```
Cache `stryker-incremental.json` per branch with a fall-back to `main`. → TODO: paste actual reuse stats.

### 4.3 Trimming noisy mutators
```js
mutator: { excludedMutations: ['StringLiteral', 'ObjectLiteral', 'ArrayDeclaration'] }
```
These generate many trivial/equivalent mutants on string-heavy code (e.g. the Vietnamese error messages in `server.js`) for little assertion benefit. Re-enable once the score stabilises.

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
Then run the **validation gate** (§4.5). _[pattern: research_result §3.1]_

### 4.5 Mandatory validation gate
Never accept an AI-generated assertion without:
```
1. Run the new test on the ORIGINAL  → must PASS.
2. Run it on the TARGET MUTANT       → must FAIL.
3. Run it on the other survivors     → report how many it newly kills.
4. Reject if (1) fails, (2) passes, or (3) = 0.
```
> TODO: capture one real before/after — AI-suggested assertion, MS gain, and one rejected suggestion.

---

## 5. Troubleshooting

> ≥ 3 real errors with fixes. Replace bracketed text with the exact messages you hit.

### E1 — `Cannot find module` / app starts listening during tests
**Symptom:** supertest hangs, or `EADDRINUSE :3000` when running Jest.
**Cause:** `server.js` runs `app.listen()` on import and doesn't export `app`.
**Fix:** the export + `require.main === module` guard from §2 Step 2.

### E2 — Stryker: "Dry run failed" / "No tests found"
**Symptom:** Stryker aborts before mutating.
**Cause:** Jest isn't green standalone, or `mutate`/`testMatch` globs don't match.
**Fix:** run `npx jest` first and get it green; confirm `mutate: ['server.js']` and the `testMatch` path. → 📷 TODO: real error.

### E3 — sqlite "database is locked" / non-deterministic test results
**Symptom:** intermittent failures across mutants.
**Cause:** tests writing to the shared DB (e.g. via `coupon_usage`), so runs aren't isolated.
**Fix:** test the **no-`user_id`** branch of apply-coupon (read-only), or point tests at a fresh copy of the seeded DB per run.

### E4 — Jest can't run from a hidden temp dir (Windows)
**Symptom:** Stryker fails only on Windows.
**Fix:** `tempDirName: 'stryker-tmp'` (already in the §2 config).

> TODO: add any additional real errors observed during Stage S3.

---

## 6. Failure Modes

> **Required section** — ways the tool (or the AI workflow) returns a *misleading* result. ≥ 3.

### FM1 — Timeouts are counted as "killed"
A mutant that causes an infinite loop or runaway runtime is scored as **Killed**, even though no assertion actually examined behaviour. A suite can inflate its mutation score purely on timeouts.
- **Detect:** filter the HTML report by `Timeout` status; check whether the kill came from an assertion or a hang.
- **Mitigation:** review timeout mutants separately; don't treat them as evidence of assertion strength.

### FM2 — Equivalent mutants make the score look worse than it is
Some surviving mutants are *semantically identical* to the original (e.g. a `StringLiteral` change in a log message). They can never be killed and drag the score down. But silently subtracting them from the denominator is equally dangerous — misjudge one and you hide a real gap.
- **Detect:** manually inspect persistent survivors; equivalence is undecidable in general (research_result §1.3).
- **Mitigation:** use `// stryker-disable next-line` with a justifying comment; have a second person sign off. Use AI only to *triage/explain* equivalence, never to auto-drop.

### FM3 — The AI asserts the wrong oracle (hallucination)
The LLM can produce an assertion that is plausible but wrong in three ways (research_result §3.7): (a) it asserts the value the *mutant* happens to output → kills nothing; (b) it asserts an implementation detail → brittle; (c) it regenerates EShop's buggy logic and asserts the buggy output as "correct".
- **Detect:** the validation gate (§4.5) — if the test passes on the mutant, the AI misled you.
- **Mitigation:** **never** ship an AI assertion that has not run against both *P* and *P′*.

### FM4 — `MS_covered` hides untested code
Stryker reports two scores: `MS = detected/valid` and `MS_covered = detected/covered` (ignores `NoCoverage`). Reading `MS_covered` makes a suite with large untested regions look strong.
- **Detect:** compare the two numbers; a big gap means many `NoCoverage` mutants.
- **Mitigation:** track plain `MS` as the headline KPI; treat `NoCoverage` as undetected.

> TODO: replace/extend with the exact failure modes your team actually observed (the rubric rewards real, observed modes over generic ones).

---

## 7. References

> Cite the **original** source, not the AI. Verify every number above against these before submission.

- Jia & Harman — *An Analysis and Survey of the Development of Mutation Testing* (IEEE TSE, 2011).
- Petrović & Ivanković — *State of Mutation Testing at Google* (ICSE 2018); Petrović et al. — *Practical Mutation Testing at Scale* (arXiv:2102.11378).
- StrykerJS docs — Getting Started, Configuration, Mutant states & metrics — <https://stryker-mutator.io/docs/stryker-js/>
- supertest — <https://github.com/ladjs/supertest> · Jest — <https://jestjs.io/>
- Dakhel et al. — *MuTAP* (Information & Software Technology, 2024; arXiv:2308.16557).
- Wang et al. — *MutGen* (arXiv:2506.02954, 2025).
- Tian et al. — *LLMs for Equivalent Mutant Detection* (ISSTA 2024; arXiv:2408.01760).
- EShop SUT — `docs/eshop-sut/srs.md` (FR-09), `apps/backend/server.js`.
- AI disclosure: see `[AI-02]`, `[AI-03]` (which LLM, prompts, what was cross-checked).

---

> _End of User Guide skeleton — fill TODO/📷 markers during Stage S3/S4._
