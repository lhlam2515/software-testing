# AI Audit Report - HW04

---

## 1. Student Information

| Field | Value |
| --- | --- |
| Student name (printed) | Lê Hoàng Lâm |
| Student ID | 23127216 |
| Class / Cohort | 23KTPM1 |
| Assignment ID | `HW#04` |
| Assignment date | `2026-08-11` |
| AI tool(s) used | Claude Code (`claude-sonnet-5`) · Codex CLI (`gpt-5.6-sol`) |
| AI used | [x] Yes [ ] No |

---

## 2. Instructions

- Add one artifact section for every AI-generated automation artifact or interaction being audited.
- Preserve the AI tool name, date and time, prompt, and output verbatim or link to their verbatim records in `prompt_log.md`.
- Complete all five sub-items for every audited artifact:
  - **(1) Prompt + Tool:** identify the tool, model, timestamp, and exact prompt-log entry.
  - **(2) AI Output:** paste the verbatim output or link to the exact generated artifact.
  - **(3) Verdict:** mark exactly one of `VALID`, `INVALID`, or `INCOMPLETE`.
  - **(4) Reasoning:** explain the verdict using concrete test-design, Playwright, SRS, or execution evidence.
  - **(5) Student Fix:** show what the student corrected, rejected, or added.
- Duplicate the artifact template below as needed. Do not invent prompts, outputs, executions, reports, timestamps, or defects.

---

## 3. Audit

### Artifact #1: HW04 workspace & AI-documentation scaffold

> **Requirement mapping:** Assignment §14 (Required contents of the `.zip`) — folder structure and AI-x template set

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code (`claude-sonnet-5`) + Codex CLI (`gpt-5.6-sol`) |
| Date and time | `2026-08-05T14:25:21+07:00` |
| Prompt log entry | [prompt_log.md — Entry 001](prompt_log.md#entry-001--2026-08-05t142521070) |

**Prompt (verbatim):** see Entry 001.

#### (2) AI Output

`homeworks/HW04/` folder scaffold — README.md, REPORT.md, `[AI-02/03/05]_*.md`, `bugs/BUG_REPORT.md`, `prompt_log.md` (commit `fc75772`).

#### (3) Verdict

- [ ] **VALID:** correct and accepted as-is.
- [x] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- First pass omitted the `[AI-03]` and `[AI-05]` templates entirely — confirmed by the student's own follow-up prompt the same session ("Vẫn còn thiếu AI-03, AI-05...").
- AI Critique was initially scaffolded as its own standalone file instead of a section inside `REPORT.md §12`, contradicting the assignment's single-report structure the student had already set for HW03.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| 1 | Folder scaffold missing `[AI-03]`/`[AI-05]` files | Two of the three mandatory AI-x templates were skipped | Prompted AI directly to add both files in the same session |
| 2 | Standalone AI Critique file | Course convention (confirmed HW03 precedent) keeps AI Critique inside the main report | Directed AI to fold AI Critique into `REPORT.md §12` |

---

### Artifact #2: FR-02 Login & Lockout — Playwright spec (A4→A6 chain)

> **Requirement mapping:** Task 1 — Feature A (FR-02), `REPORT.md §6.1–6.4`

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code (`claude-sonnet-5`) |
| Date and time | `2026-08-06T00:04:54+07:00` → `2026-08-06T10:07:25+07:00` |
| Prompt log entry | [prompt_log.md — Entries 002–004](prompt_log.md#entry-002--2026-08-06t000454070) |

**Prompt (verbatim):** see Entries 002–004 (A4 spec generation → A5 assertion patterns → A6 self-critique).

#### (2) AI Output

`artifacts/tests/FR-02/login.spec.ts` + `artifacts/tests/_fixtures/fr02-helpers.ts`, `login.page.ts` (commits `9d6fb25`, `d1a7ed4`, `0e45afc`, `89fc3b7`).

#### (3) Verdict

- [ ] **VALID:** correct and accepted as-is.
- [x] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- Fragile selectors: `errorMessage` keyed to a Tailwind utility class pair, `usernameInput`/`passwordInput` coupled to label text + sibling DOM position — SUT has no `data-testid` or `for`/`id`-bound `<label>` (`REPORT.md §6.1`).
- Weak assertions: first draft checked UI state only, so TC-06's real defect (counter +2 instead of +1, BUG-02-003) would have passed undetected; TC-BVA-03/04/05 initially inferred DB state from login outcome instead of querying `login_attempts`/`locked_until` directly (`REPORT.md §6.2` rows 1–2).
- Missing edge cases: TC-03 (invalid email) covered only 1 of the 3 variants `domain-testing.md` requires, and the AI's first root-cause note wrongly assumed the field was `type="email"` (`REPORT.md §6.3` row 2).
- Flaky waits: the DB-assertion draft read `login_attempts` immediately after the network response resolved, racing `server.js`'s un-awaited `db.run()` write; TC-UI-01 reused the shared `actLogin` helper, which always submits the form and navigates away before the password-mask assertion could read the DOM (`REPORT.md §6.4`).

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| 1 | UI-only assertion on TC-06 | Real counter-increment defect (BUG-02-003) invisible to UI-only check | Added `assertApi`/`assertDb` (A5, commit `0e45afc`) |
| 2 | TC-BVA-03/04/05 no DB check | Lockout-reset state transition inferred, not verified | Added `db: { login_attempts: 0, locked_until: null }` (commit `89fc3b7`) |
| 3 | TC-03 single variant + wrong root-cause note | 2 of 3 required EP sub-cases dropped; note wrongly blamed browser-diff on `type=email` parsing | Added TC-03b/c/d; corrected note to cite `Login.jsx:30`'s actual `type="text"` (commit `2a46ac1`, `ee09334`) |
| 4 | Fixed single read of `login_attempts`/`locked_until` | Raced `server.js`'s un-awaited `db.run()` write | Enabled WAL + `busy_timeout`, switched `assertDb` to `expect.poll()` |
| 5 | `actLogin` always submits the form | TC-UI-01 navigated away before the password-mask assertion could run | Added `submitVia: 'none'` case-data flag |

---

### Artifact #3: FR-02 single-loop DDT compliance review

> **Requirement mapping:** `REQUIREMENTS.md §6` (data-driven requirement), `data-driven-testing.md §4`

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code (`claude-sonnet-5`) |
| Date and time | `2026-08-06T10:29:03+07:00` |
| Prompt log entry | [prompt_log.md — Entry 005](prompt_log.md#entry-005--2026-08-06t102903070) |

**Prompt (verbatim):** see Entry 005.

#### (2) AI Output

Diagnosis that `login.spec.ts` + `lockout.bva.spec.ts` duplicated the Arrange-Act-Assert block (violating single-loop DDT); merge into one file/one loop, branching on case data instead of a second helper — implemented as commit `0611886`.

#### (3) Verdict

- [x] **VALID:** correct and accepted as-is.
- [ ] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- The AI correctly identified that two spec files reading the same `cases.json` via `loadCases()` and copying the same Arrange→Act→Assert block is the exact duplication `data-driven-testing.md §4` (one reusable loop covers every test case) is designed to eliminate.
- The proposed fix respected the student's explicit constraint (no new helper, branch on data fields inside the single loop) and was verified by an actual re-run: 15/15 cases generated, 11 passed / 4 failed, matching the 4 `knownDefect`-tagged cases exactly — no regression from the merge.

#### (5) Student Fix

None required — diagnosis and fix accepted as-is; verified by execution, not just static review.

---

### Artifact #4: FR-09 Discount Coupons — Playwright spec

> **Requirement mapping:** Task 1 — Feature B (FR-09), `REPORT.md §6.2` rows 7–9

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code (`claude-sonnet-5`) |
| Date and time | `2026-08-06T14:58:21+07:00` |
| Prompt log entry | [prompt_log.md — Entry 006](prompt_log.md#entry-006--2026-08-06t145821070) |

**Prompt (verbatim):** see Entry 006. Executed via the Agent Skill built in Artifact #6 (`Skill({skill: "playwright-automation-pipeline", args: "FR-09"})`), not raw ad-hoc prompting — the skill's own 9-phase pipeline (survey → POM → data-driven spec → assertions → independent-subagent review → fix) ran the rest of the session.

#### (2) AI Output

`artifacts/tests/FR-09/coupon.spec.ts` + `artifacts/tests/_fixtures/fr09-helpers.ts`, `checkout.page.ts` — 21 cases (13 EP + 8 BVA), commit `c132e82`.

#### (3) Verdict

- [ ] **VALID:** correct and accepted as-is.
- [x] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- `checkout.page.ts`'s `errorMessage` locator ORs 5 distinct error substrings into one regex — if the SUT ever shows a generic error matching none of the 5, the locator itself fails to resolve instead of surfacing the real content mismatch (`REPORT.md §6.2` row 7).
- TC-11 (`finalAmountNotNegative`) only lower-bounds `final_amount`, never cross-checks `discount_amount` — a case can pass even when the discount itself is computed incorrectly (`REPORT.md §6.2` row 8).
- TC-13 (client-manipulated `total_amount`) always runs against an empty cart because add-to-cart could not be automated, weakening (but not eliminating) the financial-severity evidence for BUG-09-007 (`REPORT.md §6.2` row 9).
- Correct expected values for `/api/apply-coupon` (missing `authenticateToken` middleware, strict `>` instead of `>=` on `min_order_amount`) required reading `server.js:363–379` directly — `domain-testing.md`'s spec-only wording was not enough on its own (`TEST_PLAN.md` P3 log, 2026-08-05).

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| 1 | `errorMessage` 5-substring OR-regex | Misleading "element not found" failure instead of a real content-mismatch report | Flagged, not rewritten — acceptable because specific-error checks are pushed to the API-assertion layer |
| 2 | TC-11 lower-bound-only assertion | `discount_amount` itself unverified | Flagged, not fixed — noted as a gap to close if time allows |
| 3 | TC-13 expected values assumed spec-only reading | Missed the real, un-guarded `/api/apply-coupon` auth bypass and strict-`>` bug | Re-derived `expected` from `server.js:363,379` directly before finalizing `cases.json` |

---

### Artifact #5: FR-16 CSV Import — Playwright spec

> **Requirement mapping:** Task 1 — Feature C (FR-16), `REPORT.md §6.2` row 5

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Codex CLI (`gpt-5.6-sol`) |
| Date and time | `2026-08-06T15:47:07+07:00` |
| Prompt log entry | [prompt_log.md — Entry 007](prompt_log.md#entry-007--2026-08-06t154707070) |

**Prompt (verbatim):** see Entry 007. Codex read the same shared, agent-agnostic skill (`.agents/skills/playwright-automation-pipeline/`) and announced it before starting work — same 9-phase pipeline as Artifact #4, including a live-browser locator survey via `playwright-cli` before writing any spec code.

#### (2) AI Output

`artifacts/tests/FR-16/csv-import.spec.ts` + `_fixtures/fr16-helpers.ts`, `_fixtures/csv.ts` — 24 cases (19 EP + 5 BVA), commit `8ca7a7e`.

#### (3) Verdict

- [ ] **VALID:** correct and accepted as-is.
- [x] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- TC-13/14/15/16 ("Gap Probe" cases) each hard-code one expected value out of several branches `domain-testing.md` explicitly leaves undefined ("record actual result"), with no `note` explaining why that branch was chosen — inconsistent with sibling TC-12/TC-18 in the same file, which do carry a rationale note (`REPORT.md §6.2` row 5; confirmed independently by the Artifact #7 review).

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| 1 | TC-13/14/15/16 fixed `expected` with no `note` | Future re-run landing on a different, also-valid branch reads as "test broke" instead of "chosen interpretation no longer matches" | Added a `note` to all 4 cases citing the specific branch and HW02-observed status (BUG-16-003/004) that justified it (commit `2a46ac1`) |

---

### Artifact #6: Agent Skill — `playwright-spec-generator` packaging

> **Requirement mapping:** Task 3 — Agent Skill

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code (`claude-sonnet-5`) |
| Date and time | `2026-08-06T11:01:19+07:00` |
| Prompt log entry | [prompt_log.md — Entry 008](prompt_log.md#entry-008--2026-08-06t110119070) |

**Prompt (verbatim):** see Entry 008.

#### (2) AI Output

`.agents/skills/playwright-automation-pipeline/SKILL.md` v0.1, commit `7edba8c`.

#### (3) Verdict

- [ ] **VALID:** correct and accepted as-is.
- [x] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- Skill description used keywords that did not reflect the skill's actual scope (spec-code generation), and its "Not for" section contradicted its own keyword list — flagged directly by the student on 2026-08-06 ("Description của skill không thể hiện rõ chủ yếu viết script kiểm thử... phần Not for mâu thuẫn với các keyword").
- The name itself drifted from the skill's actual scope twice more during real use on FR-09/FR-16 and the FR-01 skill demo: `playwright-automation-pipeline` → `automation-workflow` (over-promised owning the whole test lifecycle) → `playwright-spec-generator` (correctly scoped to code generation), per `artifacts/skills/playwright-spec-generator/CHANGELOG.md` and the 2026-08-11 rename session.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| 1 | Skill description/keywords | Did not reflect actual scope; internal contradiction between keywords and "Not for" | Rewrote description directly, kept concise per student instruction |
| 2 | Skill name `playwright-automation-pipeline` | Over-broad naming after 2 real-use iterations exposed the actual scope | Renamed twice — `automation-workflow` (v0.5) → `playwright-spec-generator` (v0.6) |

---

### Artifact #7: Pre-submission gap review (FR-02 / FR-09 / FR-16)

> **Requirement mapping:** Task 1 — "Review and fix (human review)", `REPORT.md §6`, `§6.6`

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code (`claude-sonnet-5`), independent review subagent |
| Date and time | `2026-08-10T12:08:41+07:00` |
| Prompt log entry | [prompt_log.md — Entries 009–010](prompt_log.md#entry-009--2026-08-10t120841070) |

**Prompt (verbatim):** see Entry 009.

#### (2) AI Output

Full review verbatim in [prompt_log.md Entry 009](prompt_log.md#entry-009--2026-08-10t120841070) — found 4 real gaps (TC-03 undercoverage, TC-05 branch ambiguity, FR-09 TC-13 weakened evidence, FR-16 TC-13–16 missing notes), 3 weak-assertion points, and a `db.ts` refactor recommendation.

#### (3) Verdict

- [ ] **VALID:** correct and accepted as-is.
- [x] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- The review's gap list itself was accurate — the student independently re-ran TC-03b/c/d and TC-05 live against the SUT (not just a static diff read) and confirmed all 3 fixes behaved correctly (see Entry 010).
- However, the AI's own suggested wording for the TC-03d `note` contained a factual error: it claimed the fail was a "browser-diff on `type=email` parsing," but `Login.jsx:30` shows the field is `type="text"` — there is no `type=email` for browsers to parse differently, so no browser-diff exists at all. The student caught this only by reading the SUT source directly, not by trusting the AI's explanation. This is the same "trusted the design doc's field name over the SUT's actual markup" pattern documented in `REPORT.md §6.6` point 1.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| 1 | TC-03d note: "browser-diff on `type=email` parsing" | Factually wrong root cause — field is `type="text"`, no browser-diff possible | Rewrote note to cite the real shared root cause, `BUG-02-001` (commit `ee09334`) |
| 2 | TC-05 missing `db` assertion + branch tag | Correctly flagged; fix verified live (Branch A, `required` on the password field) | Added `db.login_attempts: 0`, confirmed via direct SUT run (Entry 010) |
| 3 | FR-16 TC-13–16 missing `note` | Correctly flagged; notes added without changing `expected`/`knownDefect` | 4 notes added, cross-checked against existing `knownDefect` for consistency (commit `2a46ac1`) |

---

## 4. Summary of AI Accuracy

| Metric | Count | Percentage |
| --- | ---: | ---: |
| Total AI-generated artifacts audited | `7` | `100%` |
| **VALID** (correct, accepted as-is) | `1` | `14%` |
| **INVALID** (wrong, rejected) | `0` | `0%` |
| **INCOMPLETE** (acceptable after edits) | `6` | `86%` |

---

## 5. Conclusion (When AI Should or Should Not Be Used)

AI was reliable for two things this assignment: (1) turning an already-designed test-case table into Playwright boilerplate fast — page objects, data-driven loops, assertion scaffolding — once a prompt named the exact technique step (A3–A6), and (2) diagnosing structural violations against a concrete written standard, as seen in Artifact #3, where pointing the AI at `data-driven-testing.md §4` produced a correct duplication diagnosis and a fix that respected the stated constraint on the first pass.

AI was not reliable at verifying its own output against the SUT's actual runtime behavior. Every INCOMPLETE artifact traces back to the same root cause repeated in Artifacts #2, #4, #5, and even #7 (the review artifact itself): the AI trusted a design document's wording (`domain-testing.md` calling a field "`type=email`") or a plausible-looking pattern (copying an assertion shape from a sibling case) over reading the SUT's actual source (`Login.jsx`, `server.js`) or running the suite against the live application. Notably, this failure mode persisted even in Artifact #7, a review explicitly tasked with catching exactly these mistakes — the review found 4 real gaps correctly, but the note it drafted to explain one of them was itself wrong for the same reason. Human verification against the live SUT — not just re-reading a diff — was what caught it.

**Recommendation:** use AI for first-draft generation and structural review against explicit written standards, but treat any of its claims about *why* a defect occurs as a hypothesis, not a fact, until confirmed by reading the actual SUT source or re-running the assertion live. This is a review discipline gap, not a model-capability limit — see `REPORT.md §6.6`.

---

## 6. Mandatory Disclosure

- **FR-02 - Login & Account Lockout:** Claude Code (Sonnet 5) generated `login.spec.ts` and `fr02-helpers.ts` through the A3→A6 prompt chain (Entries 002–004). The student found and fixed fragile selectors (accepted as risk — no `data-testid` in the SUT), weak assertions (added `assertApi`/`assertDb`, fixed a race condition with WAL + `expect.poll()`), a dropped test-case variant (TC-03b/c/d), and a wrong AI-authored root-cause note — all verified by re-running the suite against the live SUT, not by reading diffs alone.
- **FR-09 - Discount Coupons:** Claude Code generated `coupon.spec.ts` (Entry 006). Two weak-assertion issues (OR-regex locator, TC-11 missing `discount_amount` bound) were identified and knowingly left as documented, accepted risk rather than silently shipped. Expected values for the coupon-application bugs were corrected after the student read `server.js` directly, not from the AI's first draft.
- **FR-16 - CSV Import:** Codex CLI generated `csv-import.spec.ts` (Entry 007). Four Gap Probe cases (TC-13–16) shipped with hard-coded expected values and no rationale; the student added the missing `note` field to each, cross-checked against existing bug tags.
- **Reports and documentation:** Claude Code drafted `REPORT.md`/`README.md` prose from the student-supplied real HTML-report numbers and `BUG_REPORT.md` data; the student verified every number against the generated HTML reports before accepting the draft (see `PROGRESS_CHECKLIST.md §1`).
- **Deviation from course AI policy:** None identified. All AI-generated artifacts were produced through the step-by-step A1–A6 prompt chain documented in `TEST_PLAN.md §4`; no single generic "write all the automation scripts" prompt was used, consistent with the AI-First strategy in `REQUIREMENTS.md §2`.

---

## Signature

| Field | Value |
| --- | --- |
| Student name (printed) | Lê Hoàng Lâm |
| Student ID | 23127216 |
| Class / Cohort | 23KTPM1 |
| Course | `CSC13003 - Software Testing` |
| Instructor | Dr. Lam Quang Vu |
| Date | `2026-08-11` |
| Signature | ![Lê Hoàng Lâm](assets/signature.png) |

---

## References

- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education.* CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Nielsen, J. *10 Usability Heuristics for User Interface Design.*
- Norman, D. *The Design of Everyday Things* (6 principles).
- Shneiderman, B. *Eight Golden Rules of Interface Design.*
- Hardman, P. (2025). *A Post-AI Learning Taxonomy.*
