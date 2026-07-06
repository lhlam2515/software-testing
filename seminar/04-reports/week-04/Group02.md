# WEEKLY REPORT - GROUP 02

## 1. General Information

| Field | Information |
|---|---|
| Group ID | Group 02 |
| Group Name | Group 02 |
| Project Name | Seminar T10: Mutation Testing and Test Effectiveness for the e-Shop SUT |
| Reporting period | 2026-06-29 to 2026-07-04 (Monday to Saturday) |
| Members | `23127216` - Lê Hoàng Lâm (M1); `23127543` - Vu Van Vu (M2) |

## 2. Tasks Completed This Week

Progress below was checked against `seminar/02-planning/weekly-checklist.md` and
`git log --graph refs/heads/seminar --stat` for 2026-06-29 through 2026-07-04.
A task is marked completed only when the `seminar` branch contains implementation
or measured execution evidence. Drafts and unexecuted proposals are marked partial.

Full Git evidence: [Appendix A - commit_log.txt](./commit_log.txt).

### 23127216 - Lê Hoàng Lâm (M1)

- **[Completed] T4 - Run the full mutation baseline and record the results.**
  - Configured and stabilized the Jest/Stryker test harness for sequential execution.
  - Measured 541 mutants: 175 killed, 73 survived, and 293 with no coverage.
  - Recorded an overall mutation score of 32.35%, together with coverage and
    per-route analysis, in `seminar/01-research/BASELINE.md`.
  - Evidence: commits `5fd8f92`, `9a35d54`, and `0b53f94`.

- **[Completed] T5a - Analyze Group A survivors for authentication and coupons.**
  - Extracted structured survivor data from the Stryker HTML report.
  - Classified mutant 28, mutants 397/398, and mutant 396 using root-cause and
    propagation-level dimensions.
  - Evidence: `apps/backend/scripts/extract-mutants.js`,
    `seminar/01-research/survivors.json`, and commits `53d0161`, `493f808`,
    and `e0c85c7`.

- **[Partial] T6a - Add kill assertions for Group A survivors.**
  - Designed deterministic clock handling for the authentication boundary
    mutant and value-pinning assertions for the coupon formula bug, documented
    in `BASELINE.md`.
  - Re-checked against current `HEAD`: `auth.test.js` and `coupon.test.js` do
    not yet contain these assertions. Commit `e0c85c7` modified only
    `BASELINE.md`.
  - Evidence: `seminar/01-research/BASELINE.md` (design only); no corresponding
    test-file diff exists yet.

- **[Partial] T7a - Apply the AI assertion-synthesis validation gate.**
  - `BASELINE.md` records a PASS-27/27-on-original and FAIL-on-mutant (Killed)
    result for mutants 28, 396, and 397/398, but this cannot be reproduced from
    current `HEAD`: the underlying assertions are not present in the test
    files (see T6a). The validation gate is documented, not executable yet.
  - Preserved the AI classification input in
    `seminar/01-research/clips/2026-07-03_gemini_survivor-classification.md`.
  - Evidence: `seminar/01-research/BASELINE.md` (unverifiable against `HEAD`)
    and commit `493f808` (classification data only, no test execution).

- **[Partial] Failure-mode handoff and review of Group B.**
  - Technical risks such as SQLite worker races and time-dependent boundary tests
    were observed, but the required Stryker/AI workflow failure-mode handoff for
    User Guide section 6 has not been finalized.
  - No current-branch evidence shows completion of the review of T5b/T7b.

### 23127543 - Vu Van Vu (M2)

- **[Completed] Maintain the FR-08/FR-10 baseline tests used by Cluster B.**
  - Added Supertest baseline coverage for cart/checkout and order-status behavior.
  - Evidence: `apps/backend/__tests__/cart.test.js`,
    `apps/backend/__tests__/order-status.test.js`, and commit `d1d0904`.

- **[Completed] T5b - Classify and select Group B survivors.**
  - Classified mutant 515 (order-status `canceled to delivered` transition gap)
    and mutant 268 (cart sequential-state gap) using the same root-cause and
    propagation-level taxonomy applied to Group A.
  - Triaged mutants 535/536/537 (`require.main === module` startup guard) as
    Equivalent Mutant / Dead Code candidates, flagged for reviewer sign-off
    before exclusion from the denominator.
  - Evidence: `seminar/01-research/BASELINE.md` and commit `7e3d4dc`.

- **[Partial] T6b - Write and validate kill assertions.**
  - `BASELINE.md` documents AI-synthesized kill assertions for mutant 515 and
    mutant 268, but `order-status.test.js` / `cart.test.js` on current `HEAD`
    do not contain them, and no mutation-score increase was measured.
  - The Validation Gate is explicitly recorded as Blocked in `BASELINE.md` -
    an honest status, unlike the Group A T6a claim (see Issues).
  - Evidence: `seminar/01-research/BASELINE.md` (design only); no test-file diff.

- **[Partial] T7b - AI assertion synthesis and validation gate.**
  - Kill-assertion drafts and a Blocked Validation Gate are documented for
    mutant 515 and mutant 268.
  - No executed PASS-on-original / FAIL-on-mutant result exists yet; requires
    adding the assertions and rerunning `npm test` / `npm run stryker`.
  - Evidence: `seminar/01-research/BASELINE.md` and commit `7e3d4dc`.

- **[Partial] T8 - Metrics and equivalent-mutant triage.**
  - Equivalent-mutant triage completed for mutants 535/536/537 (startup-guard
    dead code), pending reviewer sign-off before exclusion from the denominator.
  - Setup time, run time, and mutation-score gain per AI-generated test were not
    measured; the T8 metrics table in `BASELINE.md` reuses Lâm's T4 full-run
    numbers instead of an independent measurement.
  - Evidence: `seminar/01-research/BASELINE.md` and commit `7e3d4dc`.

- **[Partial] Failure-mode contribution and review of Group A.**
  - A state-machine test-gap note was drafted, but it has not been integrated into
    the current branch's User Guide failure-mode section.
  - No current `seminar` branch commit records Vũ's review of the completed Group A
    analysis in `e0c85c7`.

### Consolidated Evidence

| Commit | Date | Owner | Evidence |
|---|---|---|---|
| `d1d0904` | 2026-06-30 | Vũ | Added FR-08 cart and FR-10 order-status Supertest baselines |
| `5fd8f92` | 2026-06-30 | Lâm | Forced sequential Jest workers to remove SQLite race failures |
| `9a35d54` | 2026-06-30 | Lâm | Stabilized the backend test harness |
| `0b53f94` | 2026-06-30 | Lâm | Recorded measured coverage and mutation baseline |
| `341a94e` | 2026-07-03 | Lâm | Added the generated Stryker baseline HTML report |
| `53d0161` | 2026-07-03 | Lâm | Added the Stryker report extraction script |
| `493f808` | 2026-07-03 | Lâm | Added survivor data and AI classification evidence |
| `e0c85c7` | 2026-07-03 | Lâm | Documented Group A T5a survivor classification and proposed (not yet implemented) T6a/T7a kill assertions |
| `7e3d4dc` | 2026-07-04 | Vũ | Documented Group B T5b survivor classification (mutants 515, 268) and equivalent-mutant triage (535/536/537); kill assertions and metrics not yet executed |
| `6a4ee97` | 2026-07-04 | Lâm | Normalized survivor-entry formatting between Group A and Group B in `BASELINE.md` (no content change) |

### Appendix A - Raw Git Commit Log

- Evidence file: [commit_log.txt](./commit_log.txt)
- Scope: branch `seminar` only, 2026-06-29 00:00:00 through
  2026-07-04 23:59:59, timezone `+07:00`.
- Command:
  `git log --graph refs/heads/seminar --stat --since=2026-06-29T00:00:00+07:00 --until=2026-07-04T23:59:59+07:00 --date=iso-strict --pretty=fuller`

## 3. AI Usage Declaration

### AI Usage Notes

**Gemini**
Version not recorded by the tool, Google, `gemini.google.com` (chat link:
`https://gemini.google.com/app/0aec0f27e424e1ff`), accessed 2026-07-03 (exact
hour not recorded in the saved clip).

Prompt:

> "Theo các kết quả nghiên cứu về Mutation Testing, hãy giúp tôi tìm kiếm và
> tổng hợp các loại survivor có thể có khi thực hiện Mutation Testing"

Used to source a two-axis taxonomy for classifying Stryker survivors: Root-Cause
Classification (Equivalent Mutant / Assertion Gap / Boundary Value Blindness /
Dead Code) and Propagation Level (No Coverage / Weakly Survived / Strongly
Survived). AI generated the generic taxonomy and terminology, preserved verbatim
in `seminar/01-research/clips/2026-07-03_gemini_survivor-classification.md`. M1
mapped it onto the actual mutants (28, 396, 397/398 for Group A; 515, 268 for
Group B), added an extended label the AI did not produce ("Missing Test Case"),
and recorded the mapping in `BASELINE.md`.

## 4. Tasks Planned for Next Week

The next planning period is 2026-07-06 through 2026-07-12.

### Lê Hoàng Lâm (M1)

- `[F2]` Write User Guide section 3, an end-to-end first-test walkthrough for the
  coupon feature in no more than 15 steps.
- `[F4]` Write User Guide section 6 and consolidate at least three verified
  Stryker/AI workflow failure modes.
- Review Vũ's F1 and F3 sections before the User Guide is submitted.
- `[T9]` Build the "Kill the Mutant" sandbox with five checkout/coupon mutants and
  a scoring flow that runs within four minutes.
- `[D1]` Draft the seminar demo script, covering both Stryker and the AI feature
  within ten minutes.

### Vu Van Vu (M2)

- `[F1]` Write User Guide sections 1 and 2: Introduction and Installation, with
  exact commands and at least one screenshot.
- `[F3]` Write User Guide sections 4, 5, and 7: Advanced Usage, Troubleshooting
  with at least three real errors and fixes, and References.
- Review Lâm's F2 and F4 sections.
- `[E1]` Create `Activity_Worksheet.md` and its answer key, reproducible within
  25 minutes without group assistance.
- `[G1]` Start `Seminar_Slides.pptx` with no more than 15 slides following the
  approved outline.

### Shared

- By 2026-07-08, merge and review all seven User Guide sections, confirm at least
  three evidence-backed failure modes, and verify every reference.
- Before starting the User Guide, finish the unverified execution evidence for
  both groups - Group A T6a/T7a and Group B T6b/T7b/T8 - so the guide does not
  rely on candidate or placeholder data.

## 5. Issues

| Issue | Impact | Required action |
|---|---|---|
| Group B T6b/T7b lacks PASS-original and FAIL-mutant execution evidence. | The selected assertions cannot yet be claimed to kill real mutants. | Add assertions to the owned test file, run Jest and Stryker, and record mutant IDs and results. |
| Group A T6a/T7a were documented in `BASELINE.md` as implemented and validated, but commit `e0c85c7` only modified `BASELINE.md`; `auth.test.js`/`coupon.test.js` do not contain the described assertions. | The Completed status previously recorded for T6a/T7a was not backed by an executable diff, the same gap as Group B. | M1 adds the assertions to the test files, reruns `npm test` / `npm run stryker`, and replaces documented results with real output before claiming Completed. |
| T8 has completed equivalent-mutant triage but no measured timing/score-delta metrics. | The 05/07 gate is not fully satisfied. | Capture setup time, run time, and score delta per AI test; triage results are already recorded. |
