# CHANGELOG — domain-testing

## v0.4 — 2026-07-02

**TA feedback (verbatim, received 2026-07-02, 08:02):**

> Dear Lâm,
>
> For this assignment, the primary focus is on functional testing, which means the
> starting point for your test workflows should begin at the frontend UI. This applies
> to manual testing as well as any automation you choose to introduce (though please
> note we will have a dedicated exercise for automated testing later).
>
> Regarding your specific constraints, for test cases that cannot be executed through
> the UI, either due to strict client-side validation or because the UI elements are
> not yet implemented, it is acceptable to execute them at the API level. However, you
> must document these API-level test cases clearly and separately in your report,
> noting the specific reason for each. Keep in mind that we will also have a separate
> assignment specifically focused on API testing.
>
> Best regards,
> Thanh

**Changes made in response:**

- Added Step 3.0 — Survey the Real UI: mandatory `playwright-cli` survey of the actual running SUT before drafting any TC's `Steps`, done once per feature and reused for Step 4 (BVA); `Steps` must reuse real observed labels/URLs verbatim, never invented from the spec
- Added `UI Fallback Note` field to the Step 3 and Step 4 TC templates: `Steps` default to UI execution; direct-API `Steps` are permitted only when a real UI blocker exists, and the blocker must be documented per TC — mirrors the "Fallback Reason" pattern already in use in `execution-log.md`
- Decision (in-session, 2026-07-02): Variables (Step 1) and EC/EP (Step 2) are channel-agnostic and were **not** redesigned — only two specific columns had conflated business-behavior classification with the API's transport representation, a leak that only became visible once a second channel (UI) existed alongside the original API-only design
- Step 1 `Expected Error/Behavior` and Step 2 `Expected System Output`: added a rule to keep both columns abstract/business-level (no literal HTTP status/JSON), with before/after examples (`"HTTP 401 if token is missing or invalid"` → `"Rejected - authentication required or invalid"`); added an explicit exception for ECs that classify the response shape itself (e.g., an "Output — Response" group where the JSON/HTTP shape *is* the condition being partitioned)
- Step 3 and Step 4 `Expected Result` / `Verification Points`: restructured into two tiers — a UI-observable prediction first (using the same vocabulary as `Steps`), then an explicit `API cross-check:` clause preserving the original literal HTTP/JSON content verbatim; updated the gap-probe multi-branch example to the same two-tier pattern
- Extended Quality Checklist from 12 to 16 items: UI survey requirement, Step 1/2 abstraction rule (grep-verifiable via `grep -n "HTTP [0-9]"` restricted to the Step 1/Step 2 table regions), the two-tier `Expected Result` requirement, and the `UI Fallback Note` requirement
- Root cause: FR-02, FR-09, and FR-16 were originally designed against the API only, so `Steps` described curl/API calls instead of real UI actions, and the Step 1/2 columns leaked literal HTTP wording into what should have been an abstract behavior classification — both defects were only caught after re-reading the TA's clarification above and auditing the already-written artifacts against it. Full audit trail in `context/transcripts/2026-07-02.md` and `.claude/handoffs/codex-fr02-fr09-fr16-step1-2-3-abstraction-patch.md`

## v0.3 — 2026-06-30

- Added Gap Completeness Cross-Check to Step 3: mandatory row-by-row scan of the Step 1 gap table after all TCs are drafted, before AskUserQuestion; EC coverage of the same class does not satisfy a gap
- Defined two gap types that EC minimization routinely skips: (1) Observational gaps — no new EC exists, probe uses valid input + raw-response record; (2) Intra-EC behavioral gaps — EC is already covered but spec is silent on internal mechanism (e.g., early-exit vs. full-scan), requiring a separate gap-probe TC
- Split Quality Checklist gap item into two: (1) row-by-row gap-to-TC mapping with explicit callout that observational and intra-EC behavioral gaps each need their own TC; (2) multi-branch Expected Result requirement separated for clarity
- Root cause: FR-16 audit identified the same structural omission as FR-09 — Step 1 gaps were correctly identified but the pipeline had no back-reference pass, allowing EC minimization to silently skip gaps that did not produce new ECs

## v0.2 — 2026-06-26

- Added cross-reference filter rule to Phase 0: cross-referenced specs may only add constraints to existing Step 1 variables — no new EC Groups for behaviors owned by other features
- Expanded Step 1 Implicit Gaps into two categories: Implicit Gaps (spec silence) and Spec Conflicts (contradicting sources), each with different resolution paths
- Added Gap Rule to Step 2 rule table: produces `Invalid/Gap` EC type for undefined/conflicting behavior, distinct from `Invalid`
- Updated Step 2 EC column header to `Type (Valid / Invalid / Invalid/Gap)`
- Added Gap-Probe TC pattern to Step 3: each gap/conflict becomes one TC with multi-branch Expected Result instead of a single assertion
- Added Parameter Variation to Step 4 BVA: when boundary condition has a configurable parameter, test ON point at ≥2 different parameter values to catch hardcoded implementations
- Added date/timestamp BVA maintenance note to Step 4: TCs must state design date and instruct executor to update boundary values before running
- Extended Quality Checklist from 8 to 12 items covering all 4 new improvements
- Updated File Format: renamed `### Implicit Gaps` to `### Implicit Gaps & Spec Conflicts`

## v0.1 — 2026-06-24

- Initial functional version of the skill (first forge from FR-02 session)
- SKILL.md written entirely in English with general-purpose description
- Decoupled from EShop SUT: no course/SRS/FR-range references in skill body
- Output paths use generic `{output-folder}/{feature-slug}` placeholders
- All table headers, step labels, and TC field names translated to English
- AskUserQuestion protocol and Quality Checklist fully translated to English
- Added "Output ECs Verified Absent" tracking to Step 3 TC format

## v0 (scaffold) — 2026-06-23

- Tạo thư mục và README.md: mô tả mục tiêu skill, roadmap version
- SKILL.md sẽ được tạo tại Phase 2 sau khi rút kinh nghiệm từ FR-02
