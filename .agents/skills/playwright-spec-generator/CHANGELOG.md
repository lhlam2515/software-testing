# CHANGELOG — playwright-spec-generator

## v0.6 — 2026-08-11

**Source: user request** — `automation-workflow` still wasn't the right
name. It reads as if the skill owns the whole test-automation lifecycle
(design, run, report), when its actual job is narrower and more specific:
turn an already-designed test case into a running Playwright + TypeScript
spec. "Workflow" over-promised; the skill's own `description` already says
it plainly — "the code-generation step of test automation, not manual
execution or test design."

**Changes made in response:**

- Renamed `.agents/skills/automation-workflow/` →
  `.agents/skills/playwright-spec-generator/` (`git mv`, preserving
  history), and the `.claude/skills/` symlink accordingly
- Updated frontmatter `name:` and the `SKILL.md` H1 to
  `playwright-spec-generator` — `description` and all 9 phases unchanged
- Updated cross-references in `README.md`/`CHANGELOG.md` to the new path

## v0.5 — 2026-08-11

**Source: user request** — the skill's name, `playwright-automation-pipeline`,
no longer reflected its content. It read as a narrow code-generation
pipeline, but the skill had grown through v0.2–v0.4 to also cover locating
or designing test cases when none exist (Phase 0), an explicit
tool/environment readiness check (Phase 1), a mandatory independent
subagent review (Phase 6), and a final multi-browser run with a truthfulness
checklist (Phase 8) — a full workflow, not just spec generation.

**Changes made in response:**

- Renamed `.agents/skills/playwright-automation-pipeline/` →
  `.agents/skills/automation-workflow/` (`git mv`, preserving history), and
  the `.claude/skills/` symlink accordingly
- Updated frontmatter `name:` and the `SKILL.md` H1 to `automation-workflow`
  — `description` and all 9 phases unchanged
- Updated cross-references in `README.md`/`CHANGELOG.md` to the new path;
  no other file in the repo referenced the old name outside this skill's own
  folder and its `artifacts/skills/automation-workflow/` submission copy in
  `homeworks/HW04`

## v0.4 — 2026-08-06

**Source: user retrospective** — after running the full pipeline for real on
FR-09 (coupon apply, 21 cases, hybrid UI+API+DB), four gaps surfaced that
cost real back-and-forth: no phase covered a case file that turns out to be
wrong (only SUT defects), the browser-presence check didn't catch a missing
OS-level dependency until the final multi-browser run, the SUT's bundled
start script took down an unrelated service this feature didn't need, and
the "assert per spec" rule had no answer for a status code the spec doc
never documented.

**Changes made in response:**

- Phase 2: added a sentence to the non-negotiable rule — when the spec doc
  is silent on a value, derive it from the SUT's own established internal
  convention (e.g. consistent middleware behavior across routes) instead of
  guessing
- Phase 5: added "Case data can be wrong too" — a real run can surface an
  error in the Phase 2 case file itself (missing `knownDefect`, an
  unreachable `arrange`, an inconsistent `expected`); fix it immediately and
  note why, don't defer to Phase 6 as if it were a review finding
- Phase 1 "Live SUT" row: note that a bundled start script can fail as a
  whole from one unrelated service erroring — prefer starting only what the
  feature needs
- Gotchas: `playwright install --dry-run` only confirms binaries are
  downloaded, not that the OS can launch them — smoke-launch each target
  browser project once before a multi-browser Phase 8 run instead of
  trusting the dry-run

## v0.3 — 2026-08-06

**Source: user feedback** — frontmatter `description` did not clearly signal
that the skill's primary output is a *written test script* (code
generation), and its keyword list mixed generic words (`"script"`,
`"automate"`, `"playwright"` standalone) that could over-trigger on
non-testing tasks, while the "Not for" clause (fr-execution/domain-testing)
had nothing to actually contrast against once those generic keywords were in
the list.

**Changes made in response:**

- Rewrote the description's first sentence to lead with "Writes Playwright +
  TypeScript test scripts (spec.ts) from test cases" and explicitly frame it
  as the code-generation step, not execution or design
- Removed standalone generic trigger words (`"script"`, `"automate"`,
  `"playwright"`, `"spec.ts"` as bare terms); replaced with phrases that keep
  the test/spec context attached (`"viết script test cho FR-XX"`, `"generate
  playwright test script"`, `"convert test case sang playwright spec"`, etc.)
- Reworded the "Not for" clause so it now genuinely contrasts with the
  trigger list instead of overlapping with it

## v0.2 — 2026-08-06

**Source: user feedback** — "giữ skill concise, description ngắn gọn, đừng
thêm mô tả nội dung skill làm gì cả." The v0.1 draft's description spelled
out the full pipeline output (data file, POM, 3 assertion patterns, subagent
review, checklist) and the body repeated the same rationale in multiple
phases.

**Changes made in response:**

- Cut `SKILL.md` from 338 to 196 lines: removed repeated framing sentences,
  shortened the Gotchas section to plain bullets, trimmed each phase to its
  imperative steps plus a one-line why
- Shortened the frontmatter `description` to a single-sentence purpose
  statement plus a trigger list, dropping the enumerated list of produced
  artifacts
- Kept all four mandatory behaviors (AskUserQuestion sourcing in Phase 0,
  tool-check table in Phase 1, subagent-only review in Phase 6, checklist in
  Phase 8) unchanged — only prose length was cut, not scope

## v0.1 — 2026-08-06

Initial forge, via `skill-creator`, generalized from the FR-02 login/lockout
automation workflow actually run in `homeworks/HW04` (commits `8e3e081`
fixtures/POM, `8835981` data-driven case file, `32d4f6b`/`e878e25` spec
skeleton with UI-only assertions, `1e14ef4` network + DB assertions and race
condition fixes, `d92fd76` self-critique review, `ef5f67e` fix from that
review). Not scaffolded ahead of time — written directly as a working v0.1
since the source workflow it packages had already been run once for real.

- 9-phase `SKILL.md`: locate/design test cases → confirm tool/environment
  readiness → data-driven case file → UI survey + Page Objects/fixtures →
  spec skeleton (UI assertion only) → layer in network + DB assertions →
  independent subagent review → fix from review → final run + checklist
- Phase 0 uses `AskUserQuestion` to locate the test-case source, then a
  second question to offer designing test cases now via the `domain-testing`
  skill if one is available in the workspace — this did not exist in the
  original manual workflow, added specifically so the skill degrades
  gracefully when no design doc exists yet
- Phase 1 adds an explicit tool/dependency presence check (node/npx,
  `@playwright/test`, browser binaries, live SUT, git) before any tool call
  in the pipeline, with a note on `npx`'s silent auto-install behavior — the
  manual workflow never needed this because the environment was already set
  up once at the start of the homework
- Phase 6 requires the spec review to run as an independent subagent via the
  `Agent` tool, never inline self-review — mirrors the real self-critique
  pass (`d92fd76`) that caught a missing DB assertion, but forces it into a
  separate agent invocation so the review isn't anchored on the same context
  that just wrote the code
- Phase 8 formalizes a final checklist (pass/fail explicit and truthful,
  data-driven confirmed, reusable Page Objects/helpers, DRY
  Arrange-Act-Assert) that the original workflow satisfied informally but
  never checked explicitly against evidence
- Generalized every FR-02-specific detail (schema field names, file paths,
  SUT specifics) into feature-agnostic language so the skill applies to any
  Playwright + TypeScript project, not just this course's e-Shop SUT
- Bundled 3 reference files: `cases-schema.md`, `assertion-patterns.md`,
  `review-subagent-prompt.md`
- No eval loop run (user opted for a light self-review pass over the full
  skill-creator subagent benchmark, given the pipeline needs a live SUT +
  seeded DB to exercise for real)
