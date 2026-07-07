# AI Audit Report · HW02

---

## 1. Student Information

| Field                   | Value                                   |
| ----------------------- | --------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                            |
| Student ID:             | 23127216                                |
| Class / Cohort:         | 23KTPM1                                 |
| Assignment ID:          | HW#02                                   |
| Assignment date:        | 22/06/2026                              |
| AI tool(s) used:        | Claude Code                             |
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

ISTQB FL 4.2 EP applied correctly across FR-02's functional domain: valid groupings for email format, existence, password match, counter threshold, lockout window, counter behavior, JWT output, and error message content. However, there are two deficiencies that required to be corrected before execution:

- First, wrong variable names (`failed_login_count`, `lock_timer`): design prompt (Entry 002) had only `srs.md`, no DB schema, so AI inferred names from SRS prose instead of the real schema (`login_attempts`, `locked_until`). Surfaced only at execution, when the SQL fixture failed on the wrong columns.

- Second, Group 9 out-of-scope (EC23, EC24: display position from FR-22): Entry 002's guideline to pull from "functional specs, UI designs, and database/API schemas," combined with FR-02's SRS cross-reference to FR-22, pulled a GUI conformance concern into a functional EP set. Not domain testing scope.

The out-of-scope ECs slipped through because Step 2's output wasn't reviewed carefully before Step 3 built on it; a later, dedicated audit pass caught it.

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

ISTQB FL 4.2.1 EP requires identifying every partition where the system behaves identically. AI covered all 5 conditions (C1-C5) with variable names sourced directly from `api_specification.md`, avoiding FR-02's naming deficiency.

- Splitting Rule (S04 Step 2) correctly applied to `type` (percent vs fixed) in Group 7; EC17 reused as a shared negative-path expectation across TCs. Both are improvements over the FR-02 design.

However, in step 1, AI flagged `min_order_amount >= 0` as an implicit constraint (Gap G5), but Step 3 never turned it into a TC. EC07 was exercised only with positive values (TC-01, TC-02), so the degenerate `total_amount = min_order_amount = 0` path went untested despite AI having already surfaced the constraint.

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

ISTQB FL 4.2.1 + S04 applied correctly: identified the Spec Conflict (SRS: CSV upload; API: JSON body), scoped testing to the JSON layer, and applied Must-Be, Range, and Splitting rules to produce 22 ECs across 7 groups and 16 base TCs. Gap-probe TCs were generated for 4 of 7 Step 1 Implicit Gaps (TC-13 to TC-16); three gaps were correctly identified in Step 1 but never converted into a TC:

- Gap #1 (Spec Conflict — input layer): SRS requires a `.csv` file, API spec accepts JSON only; no TC verified whether the Admin UI actually enforces the `.csv` extension.

- Gap #6 (import report response schema): no gap-probe TC created, so every TC asserting report field names (`imported`, `failed`, `errors[]`) relies on values never empirically confirmed.

- Gap #7 (all-rows-invalid rollback): TC-12 covers only a mixed valid/invalid batch; whether the SUT early-exits or full-scans before rollback on an all-invalid batch was left unverified.

Same failure pattern as FR-09's EC07 miss: Step 1 (gap analysis) and Step 3 (TC selection) ran independently, with nothing cross-checking that every Step 1 gap produced a Step 3 TC.

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

ISTQB FL 4.2 (EP) + BVA applied correctly: `order.status` treated as an ordinal variable across `pending`, `confirmed`, `shipping`, `delivered`, plus the `canceled` terminal value.

- Splitting Rule isolates `shipping` as its own EC (EC03) instead of a generic "non-cancelable" class, necessary because `shipping` is the exact Spec Conflict target (SRS forbids user-cancel here; API section 4.6 wording implicitly permits it).

- BVA carried the same ordinal ranking through the `confirmed` to `shipping` boundary, naming the defect class (deny-list vs. allow-list logic) each TC exposes.

- Gap-probe TCs were correctly generated for the three genuinely undocumented behaviors flagged in Step 1 (order ownership, `shipping` cancel, confirm-dialog existence).

However, Step 1 recorded FR-11's status-label requirement as one cross-feature constraint with two parts, Vietnamese translation and color distinction, but Step 2's EC group for `result` (EC14-EC16) only covered the translation half; the color half was silently dropped despite being written down one step earlier.

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

ISTQB FL Chapter 5 (Defect Management) requires a defect report to include reproduction steps, severity classification, and expected-vs-actual evidence, and requires that only *confirmed* discrepancies (backed by an executed test) be logged as defects. AI satisfied this correctly for all 17 bugs at synthesis time: it read only from `execution-log.md` (not re-deriving conclusions on its own), classified severity consistently with each log's own classification, and wrote reproducible English steps.

- AI correctly declined to log SC-09-001 (FR-09's `total_amount` client-manipulation vs. FR-08's backend-recompute rule) as a confirmed bug at synthesis time (21:44-21:57, 03/07/2026), since it had no EC ID, no TC, and no execution-log entry, an untested spec conflict is not a confirmed defect. It documented it separately under "Untested Spec Conflicts" instead, correctly applying the ISTQB distinction between a suspected discrepancy and a confirmed incident.

- Three days later, once TC-13 was added and executed (06/07/2026), confirming the discrepancy as a real defect, `BUG_REPORT.md` was updated the same evening, 37 minutes after the TC-13 design commit (`1cdb554`, 20:41) to `685083c` (21:18) adding `BUG-09-007`. This is expected artifact evolution as new test cases close a previously-flagged gap, not a correction of an AI error, so no student fix was required on the original synthesis itself.

#### (5) Student Fix

No correction needed, the synthesis logic was sound at the time it ran. `BUG-09-007` was added later (commit `685083c`, 21:18 06/07/2026) once TC-13 execution confirmed `SC-09-001`, updating the header to "Total bugs found: 18" and severity distribution to "High: 10, Medium: 5, Low: 3", and linking GitHub Issue [#30](https://github.com/lhlam2515/software-testing/issues/30). This is a downstream update driven by new test execution evidence, not a fix to an AI mistake.

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

v0.1 correctly implemented ISTQB FL 4.2/4.3's Domain Testing plus BVA pipeline: Phase 0 setup, Step 1 Variables, Step 2 Equivalence Classes via S04's four partition rules, Step 3 minimum EC-covering TCs, Step 4 3-point BVA. What it lacked was not technique but enforcement: it was a direct port of one successful FR-02 session, so every rule it encoded was a description of what had just happened, not a check that the same rule would hold on a different feature. Nothing in v0.1 forced the agent to verify, before finishing, that a written-down rule had actually been followed.

Each upgrade from v0.2 to v0.5 closes one instance of that same enforcement gap, only after a real FR artifact or the TA exposed a case where the missing check mattered (see Student Fix). The direction is consistent: v0.1 was a one-pass generator that trusted its own output; v0.2 through v0.5 turned it into a pipeline that checks its own output against a rule before stopping.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | --------------- |
| 1 | v0.1 Phase 0 cross-reference guideline ("constraints in cross-referenced specs are test targets") | Wording too broad; combined with FR-02's cross-reference to FR-22, it pulled FR-22's display-position behavior into FR-02's EC table (Artifact #1, Group 9) | v0.2: added Cross-reference Filter Rule, cross-specs may only add constraints to existing Step 1 variables, no new EC Groups for behavior owned by another feature |
| 2 | v0.1/v0.2 Step 1 to Step 3 pipeline (no back-reference pass) | Step 1 correctly flagged gaps (Artifact #2's G5, Artifact #3's Gap #1/#6/#7) but Step 3's EC minimization silently dropped gaps that produced no new EC | v0.3: added mandatory Gap Completeness Cross-Check in Step 3, row-by-row scan of the Step 1 gap table before AskUserQuestion |
| 3 | v0.1-v0.3 Step 3.0 (absent) and Expected Result field | No UI survey step; `Steps` and `Expected Result` described curl/API calls and literal HTTP/JSON instead of real UI interaction | v0.4: added mandatory Step 3.0 UI Survey via `playwright-cli`, two-tier Expected Result (UI-observable, then API cross-check) |
| 4 | v0.1-v0.4 Step 4 BVA (3-point model only) | Unbounded Invalid/Gap ECs (no defined upper boundary) had no BVA counterpart; confirmed empirically that FR-02's G4 has zero corresponding TC | v0.5: added Extreme/Overflow Value Check to Step 4, with a 3-tier priority for picking the extreme value and a required Defect Target |

FR-02's G4, the case that motivated v0.5, was re-audited on 06/07/2026 (commit `3d6aa12`): decision was not to add a TC, `email`/`password` are unbounded with no defined boundary, so BVA has no target and the concern is robustness/DoS, outside EP/BVA scope. Documented in `domain-testing.md`'s Coverage/Decision column instead.

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

*Điền sau khi hoàn thành toàn bộ bài.*

---

## 6. Mandatory Disclosure

*[Điền sau khi hoàn thành — mô tả cụ thể AI đóng góp gì, bạn sửa gì, và những gì bạn tự làm hoàn toàn.]*

> The Domain Testing equivalence classes, BVA test cases, and test case tables for FR-02, FR-09, FR-16, and FR-20 were initially generated by **Claude Code**; I reviewed and corrected [X] items across [N] artifacts. The AI Gap Analysis, bug reports, AI Critique, and GitHub Issues screenshots were written entirely by me. I confirm I did not use AI to generate any artifact listed in the prohibited category.

---

## Signature

| Field                   | Value                                   |
| ----------------------- | --------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                            |
| Student ID:             | 23127216                                |
| Class / Cohort:         | 23KTPM1                                 |
| Course:                 | CS423 / CSC13003 – Software Testing     |
| Instructor:             | Dr. Lam Quang Vu                        |
| Date:                   | 22/06/2026                              |
| Signature:              | ![Lê Hoàng Lâm](assets/signature.png)   |

---

## References

- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education.* CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Hardman, P. (2025). *A Post-AI Learning Taxonomy.*
- Fuster Rabella, M. (2025). *OECD Education Working Paper No. 338.*
- Anthropic (2025). *Building reliable AI test agents* (engineering blog).
- DeepEval & Promptfoo documentation (testing frameworks for LLM systems).
