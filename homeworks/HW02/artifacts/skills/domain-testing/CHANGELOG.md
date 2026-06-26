# CHANGELOG — domain-testing

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
