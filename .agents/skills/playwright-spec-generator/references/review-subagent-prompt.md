# Phase 6 review subagent — prompt template

Launch this via the `Agent` tool (a general-purpose or code-review-capable
agent type — pick whichever is available and suited to reading TypeScript
test code). Run it in the foreground: Phase 7 cannot start without its
findings, so there's nothing productive to do while it's running anyway.

Fill in every `<...>` placeholder before sending. Don't paraphrase the four
categories away — they map directly to the four checklist items this
pipeline was built to catch, and a subagent given a vague "review this"
prompt tends to produce a vague, low-signal review.

```text
description: "Independent review of generated Playwright spec for <feature name>"

prompt: |
  You are reviewing a Playwright + TypeScript test suite that was just
  generated for the feature "<feature name>". You did not write this code —
  review it with fresh eyes, the way a second engineer would on a pull
  request they weren't involved in drafting.

  Files to review:
  - Case data file: <path to cases.json or equivalent>
  - Spec file(s): <path(s) to *.spec.ts>
  - Fixtures / Page Objects: <path(s) to fixtures, POM files>
  - SUT source, if any assertion depends on server-side behavior worth
    cross-checking: <path(s), or "none relevant">

  Read the actual files — don't infer their contents from filenames or from
  this prompt's description of them.

  Report findings in exactly four categories. For each finding, give: the
  file and line, the concrete failure scenario (what input/state would make
  this actually break, not just "this could theoretically be fragile"), and
  a suggested fix.

  1. Fragile selectors — locators likely to break from an unrelated change
     (styling-only class hooks, exact-text coupling, position-based
     traversal), especially where a more stable alternative exists and
     wasn't used.
  2. Weak or missing assertions — assertions that would fail to catch a
     plausible real defect. Look specifically for: UI-only assertions on
     cases where two different backend outcomes would render the same UI
     state (meaning the UI check alone can't tell them apart), and cases
     whose `assert` block is missing a pattern (network/DB) that the case's
     `layer` field implies it should have.
  3. Missing edge cases — cases the underlying test-design technique would
     predict (boundary points, error-isolation combinations, a spec branch
     with no corresponding case) that never made it into the case file or
     spec at all.
  4. Flaky waits / timing issues — fixed sleeps or `waitForTimeout` calls,
     single-read assertions on data a server might still be writing
     asynchronously, and tests that share mutable state (e.g. an account's
     attempt counter) without resetting it, making pass/fail depend on
     execution order.

  If a category has no findings, say so explicitly rather than omitting it —
  "none found for category N" is a real, useful result, not a gap in your
  review.

  Report the findings as a structured list, most-actionable first. Do not
  fix anything yourself — this is a review pass only, findings get reported
  back and fixed in a separate step.
```

## What to do with the result

Present the subagent's findings in full before making any edit — this is
what makes Phase 7's fixes traceable to a specific finding instead of an
unexplained diff. If the subagent reports zero findings across all four
categories, treat that as worth double-checking (a suite this pipeline
produces almost always has at least one accepted-risk fragile selector, if
nothing else) rather than as a clean bill of health to move past quickly.
