# Evidence hoàn thiện BASELINE - 2026-07-11

## Run context

- Commit SHA: `f99c760d77fc089e8a11e60934416fa8a21a5bcf`
- Machine: `FedoraOS`
- Node / Jest / StrykerJS: `v24.11.1` / `30.4.1` / `9.6.1`
- Stryker scope: `mutate: ["server.js"]`, `coverageAnalysis: "perTest"`, `concurrency: 1`
- Combined Group A and B mutation report completed: `2026-07-11 10:56:29 +07`
- First-time Stryker setup duration: `Not recorded`
- Full mutation duration: approximately 8 minutes 30 seconds wall-clock. The command wrapper timed out after 300 seconds, while the Stryker process continued normally and wrote the final HTML report.

## Commands and results

1. `npm test -- --runInBand __tests__/auth.test.js -t 'locked_until exactly equals'`
   - 1 Group A target passed; 9 skipped; 0 failed.
2. `npm test -- --runInBand __tests__/coupon.test.js -t 'current percent-coupon arithmetic'`
   - 2 Group A targets passed; 15 skipped; 0 failed.
3. `npm test -- --runInBand __tests__/order-status.test.js -t 'canceled to delivered'`
   - 1 target passed; 5 skipped; 0 failed.
4. `npm test -- --runInBand __tests__/cart.test.js -t 'keeps existing cart items'`
   - 1 target passed; 5 skipped; 0 failed.
5. `npm test -- --runInBand`
   - 5 suites passed; 40 tests passed; 0 failed; 1.167 s.
6. `npm run test:coverage -- --runInBand`
   - 5 suites passed; 40 tests passed; 0 failed; 1.415 s.
   - `server.js`: 51.66% lines, 45.8% branches.
   - All files: 57.48% lines, 54% branches.
7. `npm run stryker`
   - Report: `apps/backend/reports/mutation/mutation.html`.
   - 541 total = 188 Killed + 65 Survived + 288 NoCoverage.
   - Mutation score: 34.75%; delta from 32.35% baseline: +2.40 percentage points.
   - Covered-code kill rate: 74.31%, compared with 70.56% at baseline.
   - RuntimeError / Timeout / CompileError: 0 / 0 / 0.

## Validation Gate

### Mutant 28, FR-02

- Original source: frozen-clock boundary test passes with HTTP 200.
- Mutant result: `Killed`, `killedBy: ["25"]`.
- Failure: expected HTTP 200, received 403.
- Test: `returns 200 when locked_until exactly equals the server clock (UB: locked_until = now)`.

### Mutants 393, 395, 396, 397 and 398, FR-09

- Original source: both percent-coupon target tests pass with pinned current values.
- Mutant results: all five changed from `Survived` to `Killed`; target 396/397/398 use `killedBy: ["1"]`.
- Mutant 396 failure: expected `discount_amount = -4500000`, received `0`.
- Mutant 397 failure: expected `-4500000`, received `-55556`.
- Mutant 398 failure: expected `-4500000`, received `5500000`.
- These values pin current BUG-09-001 behavior for mutation analysis. They are not the correct business oracle.

### Mutant 515, FR-10

- Original source: target test passes and persists `delivered` in the database.
- Mutant result: `Killed`, `killedBy: ["30"]`.
- Failure: expected HTTP 200, received 400 at the target assertion.
- Test: `returns 200 and updates status when transition is canceled to delivered`.

### Mutant 268, FR-08

- Original source: target test passes with both cart items retained.
- Mutant result: `Killed`, `killedBy: ["36"]`.
- Failure: expected cart length 2, received length 1 containing only Item B.
- Test: `keeps existing cart items when the same user adds another item`.

## AI assertion accounting

- Proposed: 5
- Used unchanged: 3
- Required manual edits: 2
- Rejected: 0
