# CHANGELOG — playwright-automation-pipeline

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
