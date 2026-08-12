# Slide 16 Demo Guide

This file is a paste-ready command and prompt guide for the live demo on Slide 16:
`Demo: one surviving mutant, audited and fixed by AI`.

Use it exactly as a terminal script. The goal is to show the baseline, inspect one surviving mutant, let Claude Code audit it with RIPR, then write one assertion and validate it with the same Stryker run.

---

## 1. Demo Order

1. Show the coupon route baseline.
2. Run the normal test suite.
3. Run coverage.
4. Run Stryker on only `server.js:363-443`.
5. Open the surviving mutant report.
6. Ask Claude Code to audit the mutant with RIPR.
7. Ask Claude Code to write one regression test.
8. Re-run the same Stryker command as the validation gate.

---

## 2. Terminal Commands

Run these from `apps/backend/`.

```bash
npm test
npm run test:coverage
npx stryker run --mutate "server.js:363-443"
```

If you want the exact mutation scope called out on the slide, keep the Stryker command scoped to the coupon route only:

```bash
npx stryker run --mutate "server.js:363-443"
```

If you need to re-check just the route after adding the new assertion, rerun the same command again. Do not change the scope during the demo.

---

## 3. Claude Code Prompt 1: Audit

Use this prompt after opening the Stryker report for the surviving mutant.

```text
You are looking at one surviving mutant in e-Shop's coupon route.

Context:
- Route: POST /api/apply-coupon
- File: server.js
- Range: lines 363-443
- Shape: five sequential guards and two calculation branches
- The mutant is covered by existing tests, but it survived

Task:
Audit this mutant using RIPR.
1. State which RIPR link is broken.
2. Explain why the current tests do not kill it.
3. Classify the failure mode in one short label.
4. Do not write a fix yet.

Use only the mutant report and source behavior. Keep the answer concise and specific.
```

### What to say out loud

- “This is the audit step, not the fix.”
- “I want the broken RIPR link, not a guess.”
- “If the requirement is ambiguous, stop and say so.”

---

## 4. Claude Code Prompt 2: Write the Test

Use this prompt only after the audit result is accepted and the human checkpoint is resolved.

```text
Write one Jest test for the coupon route that targets the surviving mutant we just audited.

Constraints:
- Use the existing test style in this repository.
- Keep the test focused on one ON-point case.
- If the case depends on time, freeze the clock in the test.
- Add only the minimum assertion needed to kill the mutant.
- Do not rewrite production code.
- Return only the test code or the exact patch content.

Goal:
Make the new assertion fail on the mutant and pass on the original code.
```

### What to say out loud

- “Now Claude Code writes the assertion, not me.”
- “We are pinning the behavior we just agreed on.”
- “This is still not accepted until the validation gate passes.”

---

## 5. Validation Gate

After adding the test, run the same Stryker command again:

```bash
npx stryker run --mutate "server.js:363-443"
```

Optional sanity check if needed:

```bash
npm test -t "<test name>"
```

### What to say out loud

- “Same gate, same scope, same route.”
- “The gate decides whether the assertion is effective.”
- “A green run proves the test distinguishes the mutant; it does not prove the oracle is business-correct.”

---

## 6. Backup Fallbacks

If Claude Code gives an unclear RIPR answer:

```text
Restate the diagnosis in RIPR terms only. Tell me exactly which link is broken and why the other links still hold.
```

If Claude Code writes a test that is too broad:

```text
Tighten the test so it covers only the mutant's behavior. Keep the assertion minimal and specific.
```

If the rerun does not kill the mutant:

```text
Explain why the new assertion failed to kill the mutant. Do not change the production code.
```

If the requirement turns out to be ambiguous:

```text
Pause and identify the ambiguity. Do not assume the business rule without calling it out.
```

---

## 7. Short Speaker Script

Use this if you want a compact spoken version during the demo:

> “This is the coupon route, FR-09. The baseline looks fine: tests pass, coverage is acceptable, but Stryker still leaves survivors. We are going to take one surviving mutant, ask Claude Code to audit it with RIPR, then have it write one assertion. Finally, we rerun the same Stryker command as the validation gate. The gate tells us whether the assertion is effective. It does not replace the human decision on ambiguous requirements or oracle correctness.”

