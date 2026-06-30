# CHANGELOG — domain-testing

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
