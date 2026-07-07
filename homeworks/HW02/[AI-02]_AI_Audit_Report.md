# AI Audit Report · HW02

---

## 1. Student Information

| Field                   | Value                                   |
| ----------------------- | --------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                            |
| Student ID:             | 23127216                                |
| Class / Cohort:         | 23KTPM1                                 |
| Assignment ID:          | HW#02                                   |
| Assignment date:        | 07/07/2026                              |
| AI tool(s) used:        | Claude Code, Codex                      |
| AI tool(s) used:        | [X] Yes [ ] No                          |

---

## 2. Instructions

- Add **one section** per AI-generated artifact (EC table, test cases batch, BVA, etc.).
- Each artifact section contains **5 sub-items**: fill all of them.
  - **(1) Prompt**: paste verbatim; do **not** paraphrase.
  - **(2) AI Output**: paste verbatim output **or** embed a labelled screenshot.
  - **(3) Verdict**: mark exactly one: `VALID` · `INVALID` · `INCOMPLETE`.
  - **(4) Reasoning**: 2-5 sentences citing course slide (S04), ISTQB section, or SRS.
  - **(5) Student Fix**: show the corrected artifact; highlight every change.

---

## 3. Audit

### Artifact #1: FR-02 Domain Testing (Equivalence Classes + Test Cases)

> **Requirement mapping:** FR-02 Login and Lockout (EP and BVA)

#### (1) Prompt + Tool

**Tool:** Claude Code (claude-sonnet-4-6)
**Time:** 09:39 to 10:30, 24/06/2026 (6-turn interactive session)
**Prompts:** See [Prompt Log](prompt_log.md), Entries 001 to 006, 24/06/2026

#### (2) AI Output

See [Prompt Log](prompt_log.md), Entries 001 to 006 (24/06/2026).

Deliverables written to disk:

- `artifacts/tests/FR-02-login-lockout/domain-testing.md`
- `artifacts/tests/FR-02-login-lockout/bva.md`

#### (3) Verdict

**[ ] VALID**: correct and accepted as-is  
**[ ] INVALID**: wrong; rejected  
**[x] INCOMPLETE**: acceptable after edits

#### (4) Reasoning (ISTQB / S04)

ISTQB FL 4.2 EP correctly applied: valid groupings for email format, existence, password match, counter threshold, lockout window, JWT output, error messages. Two deficiencies found:

- **Wrong variable names** (`failed_login_count`, `lock_timer`): prompt (Entry 002) gave only `srs.md`, no DB schema, so AI inferred names instead of using the real schema (`login_attempts`, `locked_until`). Caught only at execution, when SQL fixtures failed on the wrong columns.
- **Group 9 out of scope** (EC23, EC24: display position from FR-22): SRS cross-reference to FR-22 pulled a GUI conformance concern into the EP set, not domain testing scope. Slipped through because Step 2 wasn't reviewed before Step 3 built on it; caught by a later dedicated audit pass.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | -------------- |
| 1 | Variable names `failed_login_count` (Step 1) and `lock_timer` (Step 1) | Names do not match actual DB schema: columns are `login_attempts` (INTEGER) and `locked_until` (DATETIME) in the `users` table. SQL pre-condition scripts fail with wrong column names. | Renamed to `login_attempts` and `locked_until` throughout `domain-testing.md` and `bva.md`. |
| 2 | Group 9 containing EC23 (error above Submit, Valid) and EC24 (error below Submit, Invalid); also EC22 (no error message displayed, Invalid) | GUI and presentation-layer ECs. FR-22 display placement is a GUI conformance defect category, confirmed by TA to be outside domain testing scope. AI over-included ECs from cross-referencing FR-22. | Removed Group 9 and EC22. EC count reduced from 24 to 21. BUG-02-002 (error below Submit) documented separately in `BUG_REPORT.md`. |

---

### Artifact #2: FR-09 Domain Testing (5-Condition Equivalence Classes + Test Cases)

> **Requirement mapping:** FR-09 Coupon, EP for all 5 conditions, percent vs fixed discount

#### (1) Prompt + Tool

**Tool:** Claude Code (domain-testing skill, single invocation)  
**Time:** 21:17 25/06/2026  
**Prompt:**
> Hãy áp dụng kỹ thuật /domain-testing để thực hiện thiết kế test case cho FR-09 - Coupon đã được document bên trong eshop-sut/srs.md và eshop-sut/api-specification.md.

#### (2) AI Output

See [Prompt Log](prompt_log.md), entry *21:17 25/06/2026*.

Deliverables written to disk:

- `artifacts/tests/FR-09-coupon/domain-testing.md`
- `artifacts/tests/FR-09-coupon/bva.md`

#### (3) Verdict

**[ ] VALID**: correct and accepted as-is  
**[ ] INVALID**: wrong; rejected  
**[x] INCOMPLETE**: acceptable after edits

#### (4) Reasoning (ISTQB / S04)

ISTQB FL 4.2.1 EP correctly applied: all 5 conditions (C1-C5) covered, variable names sourced directly from `api_specification.md` (avoiding FR-02's naming issue).

- Splitting Rule (S04 Step 2) correctly applied to `type` (percent vs fixed) in Group 7; EC17 reused as a shared negative-path expectation, both improvements over FR-02.
- **Gap dropped**: Step 1 flagged `min_order_amount >= 0` (Gap G5), but Step 3 never converted it into a TC. EC07 exercised only with positive values (TC-01, TC-02); the zero-amount degenerate path went untested.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | -------------- |
| 1 | Step 3: 11 EP TCs (TC-01 through TC-11) covering EC01-EC18 | EC07 (`total_amount >= min_order_amount`) exercised only with positive values; zero-amount degenerate path untested despite AI flagging `min_order_amount >= 0` in Step 1 | Added TC-12: gap probe for the zero-amount path (coupon `ZERO01`, `min_order_amount=0`); added `EC07 (zero path)` row to EC Coverage Matrix |
| 2 | Step 1: `total_amount` flagged as an FR-08 spec conflict (client-supplied value vs. mandated backend recompute) | Conflict identified but never converted into a TC; no gap probe existed for whether the backend trusts the client-supplied value | Added TC-13: client-manipulated `total_amount=500000` vs real cart subtotal `4,000,000₫` |

---

### Artifact #3: FR-16 Domain Testing (File Domain + Atomicity Classes)

> **Requirement mapping:** FR-16 CSV Import: EP for file format, row validation, atomic rollback

#### (1) Prompt + Tool

**Tool:** Claude Code (claude-sonnet-4-6, domain-testing skill)  
**Time:** 21:31 27/06/2026  
**Prompt:**
> Hãy áp dụng kỹ thuật /domain-testing để thực hiện thiết kế test case chi tiết cho FR-16 - CSV Import đã được document bên trong eshop-sut/srs.md và eshop-sut/api-specification.md

#### (2) AI Output

See [Prompt Log](prompt_log.md), entry *21:31 27/06/2026*.

Deliverables written to disk:

- `artifacts/tests/FR-16-csv-import/domain-testing.md`
- `artifacts/tests/FR-16-csv-import/bva.md`

#### (3) Verdict

**[ ] VALID**: correct and accepted as-is  
**[ ] INVALID**: wrong; rejected  
**[x] INCOMPLETE**: acceptable after edits

#### (4) Reasoning (ISTQB / S04)

ISTQB FL 4.2.1 + S04 applied correctly: Spec Conflict identified (SRS: CSV upload vs API: JSON body), testing scoped to the JSON layer, Must-Be/Range/Splitting rules produced 22 ECs across 7 groups, 16 base TCs. Gap-probe TCs generated for 4 of 7 Step 1 gaps (TC-13 to TC-16); 3 gaps flagged but never converted to a TC:

- **Gap #1** (Spec Conflict, input layer): no TC verified whether the Admin UI enforces the `.csv` extension.
- **Gap #6** (report response schema): report field names (`imported`, `failed`, `errors[]`) asserted by every TC but never empirically confirmed.
- **Gap #7** (all-rows-invalid rollback): TC-12 covers only a mixed batch; early-exit vs. full-scan behavior on an all-invalid batch left unverified.

Same failure pattern as FR-09: Step 1 (gap analysis) and Step 3 (TC selection) ran independently; nothing cross-checked that every flagged gap produced a TC.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | -------------- |
| 1 | Step 1 Implicit Gaps table, Gap #6: import report response schema not defined by API spec §6.3 | No gap-probe TC created; TC-06 through TC-12 assert report field names (`imported`, `failed`, `errors[]`) that were never empirically confirmed to exist in the actual response | Added TC-17 [Gap Probe]: sends valid input, records the raw response schema; result becomes the verified field reference for TC-01 through TC-12 |
| 2 | Step 1 Implicit Gaps table, Gap #7: rollback scope when all rows fail not addressed in SRS | No gap-probe TC created; TC-12 only tests a mixed valid/invalid batch, so whether the SUT early-exits or full-scans before rollback, and whether the report lists all N failure reasons per SRS, remained unverified | Added TC-18 [Gap Probe]: all-rows-invalid batch (3 distinct price violations); failure-entry count in the response distinguishes early-exit from full-scan |
| 3 | Step 1 Implicit Gaps table, Gap #1: Spec Conflict — SRS requires a `.csv` file upload, API spec accepts JSON body only | No gap-probe TC created; TC-01 onward test only the JSON body downstream of the frontend's CSV-to-JSON conversion, so whether the Admin UI actually enforces the `.csv` extension was never verified | Added TC-19 [Gap Probe] (new EC23): checks via the browser Network panel whether a non-`.csv` file is accepted and whether the request sent is JSON |

---

### Artifact #4: FR-20 Domain Testing (Order-Status EC + Cancel Boundary)

> **Requirement mapping:** FR-20 Cancel Order (Mobile): EP on `order.status` and related variables, BVA on `confirmed`↔`shipping`

#### (1) Prompt + Tool

**Tool:** Claude Code (claude-sonnet-5, `domain-testing` skill)  
**Time:** 15:42 to 23:14, 02/07/2026 (initial design pass, then a separate self-review / gap-analysis pass same day)  
**Prompts:** See [Prompt Log](prompt_log.md), Entries 009-010, 02/07/2026

#### (2) AI Output

See [Prompt Log](prompt_log.md), Entries 009-010 (02/07/2026).

Deliverables written to disk:

- `artifacts/tests/FR-20-cancel-order-mobile/domain-testing.md`: 17 ECs across 6 groups, 10 EP TCs (grounded in a real `playwright-cli` UI survey of `apps/frontend-mobile`)
- `artifacts/tests/FR-20-cancel-order-mobile/bva.md`: 4 BVA TCs around the `confirmed`↔`shipping` state-machine boundary

#### (3) Verdict

**[ ] VALID**: correct and accepted as-is  
**[ ] INVALID**: wrong; rejected  
**[x] INCOMPLETE**: acceptable after edits

#### (4) Reasoning (ISTQB / S04)

ISTQB FL 4.2 (EP) + BVA applied correctly: `order.status` treated as ordinal (`pending` → `confirmed` → `shipping` → `delivered`, plus terminal `canceled`).

- Splitting Rule isolates `shipping` as its own EC (EC03), not a generic "non-cancelable" class; needed because `shipping` is the exact Spec Conflict target (SRS forbids cancel here; API §4.6 implicitly permits it).
- BVA carried the same ordinal ranking through the `confirmed`→`shipping` boundary, naming the defect class (deny-list vs. allow-list) each TC exposes.
- Gap-probe TCs correctly generated for all 3 undocumented behaviors flagged in Step 1 (order ownership, `shipping` cancel, confirm-dialog existence).
- **Gap dropped**: FR-11's status-label requirement has two parts (Vietnamese translation + color distinction); Step 2's EC group (EC14-EC16) covered only translation. Color was dropped despite being flagged in Step 1.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | -------------- |
| 1 | Step 2 EC group for `result` (EC14-EC16) | FR-11 explicitly requires order-status labels to be both translated to Vietnamese and color-distinguished. The EC group covered only the translation half; no EC or TC checked color distinction. | Added EC17 (Must-Be Rule, dual-outcome) and TC-10 to `domain-testing.md`. |

---

### Artifact #5: BUG_REPORT.md Synthesis (Post-Execution Bug Consolidation)

> **Requirement mapping:** Cross-feature, consolidates confirmed defects from all 4 executed FRs (FR-02, FR-09, FR-16, FR-20)

#### (1) Prompt + Tool

**Tool:** Claude Code (claude-sonnet-5)
**Time:** 21:44 to 21:57, 03/07/2026 (single interactive session, after all 4 `execution-log.md` files were complete)
**Prompts:** See [Prompt Log](prompt_log.md), Entry 011, 03/07/2026

#### (2) AI Output

See [Prompt Log](prompt_log.md), Entry 011 (03/07/2026).

Deliverables written to disk:

- `BUG_REPORT.md`: Bug Summary table + severity distribution, one detailed English write-up (Description / Steps to Reproduce / Expected vs Actual / Screenshot) per bug, plus an "Untested Spec Conflicts" section
- 17 matching GitHub Issues created (#13-#29), linked back into the table

#### (3) Verdict

**[x] VALID**: correct and accepted as-is  
**[ ] INVALID**: wrong; rejected  
**[ ] INCOMPLETE**: acceptable after edits

#### (4) Reasoning (ISTQB / S04)

ISTQB FL Ch.5 (Defect Management) requires reproduction steps, severity classification, expected-vs-actual evidence, and only *confirmed* discrepancies (backed by an executed test) logged as defects. AI satisfied this for all 17 bugs: read only from `execution-log.md` (no self-derived conclusions), classified severity consistent with each log, wrote reproducible English steps.

- Correctly declined to log SC-09-001 (FR-09 `total_amount` client-manipulation vs. FR-08 backend-recompute rule) as a bug at synthesis time (21:44-21:57, 03/07/2026): no EC ID, no TC, no execution-log entry. Logged instead under "Untested Spec Conflicts", correctly distinguishing a suspected discrepancy from a confirmed incident.
- 3 days later, TC-13 was added and executed (06/07/2026), confirming the discrepancy. `BUG_REPORT.md` was updated the same evening (commit `685083c`, 21:18, 37 min after the TC-13 commit `1cdb554`) adding `BUG-09-007`, expected artifact evolution from new test evidence, not a correction of an AI error.

#### (5) Student Fix

No correction needed: synthesis logic was sound at the time it ran. `BUG-09-007` was added later (commit `685083c`, 21:18 06/07/2026) once TC-13 confirmed `SC-09-001`: header updated to "Total bugs found: 18", severity to "High: 10, Medium: 5, Low: 3", linked to GitHub Issue [#30](https://github.com/lhlam2515/software-testing/issues/30). Downstream update from new evidence, not an AI-error fix.

---

### Artifact #6: `domain-testing` Skill (Agent Skill Creation and Iterative Upgrade)

> **Requirement mapping:** Meta-artifact, cross-feature: the Agent Skill used to produce the test designs in Artifacts #1 through #4

#### (1) Prompt + Tool

**Tool:** Claude Code (claude-sonnet-4-6 for v0.1 to v0.3, claude-sonnet-5 for v0.4 and v0.5)
**Time:** 10:53 24/06/2026 to 12:05 06/07/2026 (skill creation via `/skill-creator`, then 4 upgrade passes across 5 sessions)
**Prompts:** See [Prompt Log](prompt_log.md), Entries 012 to 016, 24/06/2026 to 06/07/2026

#### (2) AI Output

See [Prompt Log](prompt_log.md), Entries 012 to 016.

Deliverables written to disk:

- `.agents/skills/domain-testing/SKILL.md` (source of truth, 498 lines, v0.5)
- `.claude/skills/domain-testing` (symlink, auto-synced)
- `homeworks/HW02/artifacts/skills/domain-testing/SKILL.md` (submission snapshot, byte-identical)
- `homeworks/HW02/artifacts/skills/domain-testing/CHANGELOG.md`, `README.md`

#### (3) Verdict

**[ ] VALID**: correct and accepted as-is  
**[ ] INVALID**: wrong; rejected  
**[x] INCOMPLETE**: acceptable after edits

#### (4) Reasoning (ISTQB / S04)

v0.1 correctly implemented ISTQB FL 4.2/4.3's Domain Testing + BVA pipeline (Phase 0 setup, Step 1 Variables, Step 2 EC via S04's four partition rules, Step 3 minimum EC-covering TCs, Step 4 3-point BVA). Gap was enforcement, not technique: v0.1 was a direct port of one successful FR-02 session, so its rules described what had just happened rather than checking that the same rule held on a different feature.

Each upgrade (v0.2-v0.5) closes one instance of that enforcement gap, triggered by a real FR artifact or TA feedback (see Student Fix): v0.1 was a one-pass generator that trusted its own output; v0.2-v0.5 turned it into a pipeline that checks its own output against a rule before stopping.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | --------------- |
| 1 | v0.1 Phase 0 cross-reference guideline ("constraints in cross-referenced specs are test targets") | Wording too broad; combined with FR-02's cross-reference to FR-22, it pulled FR-22's display-position behavior into FR-02's EC table (Artifact #1, Group 9) | v0.2: added Cross-reference Filter Rule, cross-specs may only add constraints to existing Step 1 variables, no new EC Groups for behavior owned by another feature |
| 2 | v0.1/v0.2 Step 1 to Step 3 pipeline (no back-reference pass) | Step 1 correctly flagged gaps (Artifact #2's G5, Artifact #3's Gap #1/#6/#7) but Step 3's EC minimization silently dropped gaps that produced no new EC | v0.3: added mandatory Gap Completeness Cross-Check in Step 3, row-by-row scan of the Step 1 gap table before AskUserQuestion |
| 3 | v0.1-v0.3 Step 3.0 (absent) and Expected Result field | No UI survey step; `Steps` and `Expected Result` described curl/API calls and literal HTTP/JSON instead of real UI interaction | v0.4: added mandatory Step 3.0 UI Survey via `playwright-cli`, two-tier Expected Result (UI-observable, then API cross-check) |
| 4 | v0.1-v0.4 Step 4 BVA (3-point model only) | Unbounded Invalid/Gap ECs (no defined upper boundary) had no BVA counterpart; confirmed empirically that FR-02's G4 has zero corresponding TC | v0.5: added Extreme/Overflow Value Check to Step 4, with a 3-tier priority for picking the extreme value and a required Defect Target |

FR-02's G4 (the case that motivated v0.5) was re-audited 06/07/2026 (commit `3d6aa12`): decision was no TC. `email`/`password` are unbounded with no defined boundary, so BVA has no target; concern is robustness/DoS, outside EP/BVA scope. Documented in `domain-testing.md`'s Coverage/Decision column instead.

---

## 4. Summary of AI Accuracy

| Metric | Count | Percentage |
| ------ | ----- | ---------- |
| Total AI-generated artifacts audited | 6 | 100% |
| **VALID** (correct, accepted as-is) | 1 | 16.7% |
| **INVALID** (wrong; rejected) | 0 | 0% |
| **INCOMPLETE** (acceptable after edits) | 5 | 83.3% |

---

## 5. Conclusion (When should AI be used or not)

**Trust for technique execution.** EP's four partition rules, minimum EC-covering test cases, and 3-point BVA all held up: 0 of 6 artifacts were INVALID. Every defect found was a completeness or grounding failure, not a technique failure.

**Do not trust without a verification step:**

- **Closing the gap-to-test loop**: FR-09, FR-16, and FR-20 all show the same failure. A gap correctly flagged in Step 1 never became a Step 3 TC, because EC minimization stops once coverage *looks* complete.
- **Inferring unobserved facts**: FR-02's variable names came from SRS prose, not the real `users` schema; the mismatch surfaced only at execution.
- **Judging assignment scope**: FR-20's self-driven gap-analysis proposed 5 test candidates; 4 were out of scope once checked against the TA-confirmed function-testing-through-UI mandate.

**Verdict**: reliable technique executor, poor completeness auditor of its own output. Use it for the first pass of any EP/BVA suite, but budget a separate pass (human or tool-enforced) that cross-checks every flagged gap against the final TC list. Encoded here as the `domain-testing` skill's v0.3 Gap Completeness Cross-Check.

---

## 6. Mandatory Disclosure

- **Test design** (EC + BVA + TC tables, FR-02/09/16/20): generated by **Claude Code**; I reviewed and corrected 8 items across 4 artifacts (FR-02: 2, FR-09: 2, FR-16: 3, FR-20: 1, itemized in each artifact's Student Fix table above).
- **Test execution**: **Codex** ran all 70 TCs via the `fr-execution` skill, filled in each `execution-log.md` Actual Result, captured screenshots; I verified every actual-vs-expected comparison and root-caused each discrepancy against server code before accepting a verdict.
- **`BUG_REPORT.md` + 18 GitHub Issues**: synthesized by **Claude Code** from Codex's execution logs; I reviewed each synthesis against its log, and held `SC-09-001` out of the confirmed-bug count until TC-13 confirmed it.
- **AI Gap Analysis tables** (`REPORT.md`): written entirely by me, no AI involved.
- **AI Critique** (`REPORT.md` §6): drafted by Claude Code from patterns documented above, reviewed by me before acceptance.

> Execution recording, bug write-ups, GitHub Issues, and the AI Critique deviate from course policy section 11 ("Bug reports: 100% student-written; AI may not draft the description") and the AI-05 prohibited-artifact list, disclosed here rather than left unstated. No other prohibited-category artifact was AI-generated.

---

## Signature

| Field                   | Value                                   |
| ----------------------- | --------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                            |
| Student ID:             | 23127216                                |
| Class / Cohort:         | 23KTPM1                                 |
| Course:                 | CS423 / CSC13003 – Software Testing     |
| Instructor:             | Dr. Lam Quang Vu                        |
| Date:                   | 07/07/2026                              |
| Signature:              | ![Lê Hoàng Lâm](assets/signature.png)   |

---

## References

- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education.* CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Hardman, P. (2025). *A Post-AI Learning Taxonomy.*
- Fuster Rabella, M. (2025). *OECD Education Working Paper No. 338.*
- Anthropic (2025). *Building reliable AI test agents* (engineering blog).
- DeepEval & Promptfoo documentation (testing frameworks for LLM systems).
