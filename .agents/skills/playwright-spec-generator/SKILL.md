---
name: playwright-spec-generator
description: >
  Writes Playwright + TypeScript test scripts (spec.ts) from test cases —
  the code-generation step of test automation, not manual execution or test
  design.

  Trigger on: "viết script test cho FR-XX", "generate playwright test
  script", "automate test cases thành spec.ts", "sinh automation test
  script cho [feature]", "convert test case sang playwright spec", "code
  hoá test case", "turn these test cases into a playwright suite". Not for:
  manually executing existing tests with a browser (see fr-execution), or
  designing test cases without writing any code (see domain-testing).
---

# Playwright Spec Generator

Framework: Playwright + TypeScript. Detect the project's actual config in
Phase 1 instead of assuming a fresh setup.

Pipeline: design source → data file → fixtures/POM → spec skeleton (UI
assertion only) → layered assertions (network + DB) → independent subagent
review → fixes → final run + checklist. Each phase consumes the previous
phase's output — don't merge phases 4 and 5, running the UI-only skeleton
first is what separates "the harness is wrong" from "the new assertion is
wrong" later.

References (read on demand, not upfront):

- `references/cases-schema.md` — data-driven case schema
- `references/assertion-patterns.md` — the three assertion patterns + race-condition handling
- `references/review-subagent-prompt.md` — Phase 6 subagent prompt template

---

## Phase 0 — Locate or design the test cases

1. Check what's already available: pasted test cases, a named file, or a
   feature with an existing `domain-testing.md`/`bva.md`/`cases.json` in the
   repo. If found, read it and skip to step 4.

2. Otherwise ask with `AskUserQuestion`:

   > "Test case cho feature này đang ở đâu?"
   > - Tôi cung cấp đường dẫn / paste ngay
   > - Không chắc, hãy tìm trong repo
   > - Chưa có test case nào

   For option 2, search the repo before falling through to option 3.

3. If there are none, ask again:

   > "Bạn có muốn thiết kế test case ngay bây giờ không?"
   > - Có, thiết kế ngay
   > - Không, dừng lại ở đây

   Stop the pipeline if declined — generating a spec against invented test
   cases produces something that looks tested but isn't.

4. If designing now: check the available-skills listing for a test-design
   skill (`domain-testing` in this workspace). If present, invoke it via
   `Skill` and wait for its output. If absent, design with Equivalence
   Partitioning + BVA directly against the feature spec (check for a
   test-design reference doc first, e.g. `docs/istqb/ch4_design.md`).

Announce the source before Phase 1.

---

## Phase 1 — Confirm the environment is ready

Check each tool's presence before invoking it — a failed call can leave
partial state; a presence check is one cheap command.

| Need | Check | If missing |
| --- | --- | --- |
| Node/npx | `command -v node` / `command -v npx` | Ask the user how to proceed; don't install a runtime yourself |
| Test config | look for `playwright.config.ts`/`.js` in the repo | Reuse an existing one's conventions; confirm before scaffolding a new one |
| `@playwright/test` | `test -d node_modules/@playwright/test` | Show the install command, ask before running (mutating action) |
| Browsers | `npx --no-install playwright install --dry-run` | Show `npx playwright install <browser>`, ask before running |
| Live SUT | `curl -sf <base-url>` or the project's health check | Ask the user to start it, or start it only with a known command and authorization. If the project's start script bundles services this feature doesn't need, prefer starting only what's needed directly — a failure in an unrelated bundled service can take down the whole script |
| `git` (if committing) | `command -v git` | Defer to the repo's own commit skill |

Re-check anything not yet verified right before the phase that needs it —
Phase 0's interview can outlast a dev server someone started earlier.

---

## Phase 2 — Build the data-driven case file

See `references/cases-schema.md`.

Non-negotiable rule: **`expected` values encode the specification's correct
behavior, never the SUT's currently observed behavior.** When unsure, read
the SUT's source for that code path rather than trusting the design doc
blindly. If the SUT will knowingly fail a case, tag it with
`knownDefect`/`note` instead of loosening `expected` to match the bug — a
suite that always passes has stopped testing anything. If the doc is silent
on a value (e.g. no documented status code for a given failure mode),
derive it from the SUT's own established internal convention (how the same
middleware/logic behaves elsewhere in the codebase) instead of guessing.

Keep a `sourceRef` back to the originating design-doc TC where one exists.

---

## Phase 3 — UI survey, Page Objects, fixtures

Verify every locator against the running app before writing it — don't
guess from component source. Watch for: no `data-testid`, `<label>` not
bound via `for`/`id`, styling-only class hooks. None of these block you;
they're a conscious tradeoff to note later, not a surprise to hit mid-spec.

Build fixtures for whatever `assert` blocks need: a DB/state helper for
pattern #3, a request/API helper for pattern #2 or API-driven arrange.

Extract shared Arrange-Act-Assert helpers now, before multiple spec files
need them — this is the main lever on the DRY/reusability checklist item in
Phase 8.

---

## Phase 4 — Spec skeleton, UI assertion only

Iterate the spec over the Phase 2 case file — never type a case's expected
value directly into the spec. Assert only pattern #1 (UI state) at this
stage; network and DB assertions land in Phase 5.

Run it on one fast browser project. Confirm the harness itself is honest:
flip one case's expected value temporarily and confirm it fails, then flip
it back — a harness that reports everything as passing regardless of input
is worse than no suite.

---

## Phase 5 — Layer in network and DB-state assertions

See `references/assertion-patterns.md`.

Extend the shared helpers (not individual `test()` blocks) to add pattern #2
and #3 for cases flagged in Phase 2.

Common trap: the server may respond before its own write to persisted state
completes, so an immediate read after the response observes stale state.
Use a polling/auto-retry assertion (`expect.poll()` or equivalent) instead
of a one-shot read — never a fixed sleep.

**Case data can be wrong too.** A real run here doesn't only surface SUT
defects — it can surface an error in the Phase 2 case file itself: a
`knownDefect` tag missing from a case that shares the same root cause as a
tagged one, an `arrange` that can't actually reach the state it claims to
(e.g. seeding data through a path that's broken elsewhere), or an `expected`
inconsistent with the SUT's own convention. Fix the case data now, note why
in the case itself — don't defer it to Phase 6 as if it were a review
finding.

---

## Phase 6 — Independent review (subagent, never inline)

Must run as a separate subagent via the `Agent` tool, not a self-review
continuing the same context that just wrote the spec — the authoring agent
is anchored on its own choices and reliably under-reports its own blind
spots.

Build the prompt from `references/review-subagent-prompt.md`, filled in with
the case file, spec file(s), fixtures/POM, and relevant SUT source paths.
Run it in the foreground; Phase 7 depends on its output. Findings must cover
four categories: fragile selectors, weak/missing assertions, missing edge
cases, flaky waits/timing issues.

Present the findings in full before touching any code.

---

## Phase 7 — Fix based on the review

For each finding: fix it, accept as a documented risk (only when no better
option exists), or defer with a reason. Apply fixes directly — no parallel
"-fixed" copy. Rerun the affected specs and compare pass/fail counts against
Phase 5's run; an unexplained change on untargeted cases is a new finding,
not a side effect to ignore.

---

## Phase 8 — Final run and verification checklist

Run the complete suite for real, then answer from what the run actually
showed, one line of evidence per item:

- [ ] **Pass/fail is explicit and truthful** — numeric pass/fail/skip count, nothing failed silently
- [ ] **Data-driven confirmed** — no case-specific value hardcoded in the spec; all trace to the Phase 2 file
- [ ] **Reusable** — Page Objects/helpers live in shared fixture files, not duplicated per spec
- [ ] **DRY** — no test reimplements another's Arrange/Act/Assert inline; the diff between two cases is data, not code

A failed item is a Phase 7-style fix, not a caveat to note and move past.

---

## Gotchas

- `npx playwright ...` silently installs the CLI on first use if missing —
  use `npx --no-install ...` for the Phase 1 check so a missing install
  surfaces clearly instead of triggering an unplanned network install.
- `playwright install --dry-run` only confirms the browser binaries are
  downloaded, not that the OS has the shared libraries to launch them —
  a missing system dependency (e.g. `libicu`) only surfaces when a browser
  actually launches. Before a multi-browser Phase 8 run, smoke-launch each
  target project once (one trivial test) instead of trusting the dry-run.
- A file-based DB shared with the running server (e.g. SQLite) needs a
  concurrency mode (WAL + busy_timeout on the fixture's connection) or reads
  will hit "database is locked."
- A locator/assertion on a static DOM property (e.g. an input's `type`) must
  run before any action that navigates away — give the shared act helper a
  way to stop short of submitting instead of writing a near-duplicate helper.
