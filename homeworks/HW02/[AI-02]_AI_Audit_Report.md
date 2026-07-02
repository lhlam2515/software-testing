---
title: "[AI-02] AI Audit Report — HW02"
assignment: HW02-AI
course: CS423 / CSC13003 – Software Testing
policy: "Adapted from Med Kharbach, PhD (2026) — AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0."
---

Faculty of Information Technology (FIT) – Ho Chi Minh City University of Science (HCMUS)  
CS423 / CSC13003 – Software Testing (AI-augmented · 2026)

# AI Audit Report — HW02

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
- Each artifact section contains **5 sub-items** — fill all of them.
- **(1) Prompt** — paste verbatim; do **not** paraphrase.
- **(2) AI Output** — paste verbatim output **or** embed a labelled screenshot.
- **(3) Verdict** — mark exactly one: `VALID` · `INVALID` · `INCOMPLETE`.
- **(4) Reasoning** — 2–5 sentences citing course slide (S04), ISTQB section, or SRS.
- **(5) Student Fix** — show the corrected artifact; highlight every change.

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

The AI correctly applied ISTQB FL 4.2 EP across FR-02's functional domain, producing
valid groupings for email format, existence, password match, counter threshold, lockout
window, counter behavior, JWT output, and error message content. Two deficiencies
required student correction before execution (see Student Fix below):

**Deficiency 1 — Wrong variable names (`failed_login_count`, `lock_timer`)**
- Root cause: design prompt (Entry 002) provided only `srs.md` as spec source —
  no database schema context was available at design time; AI was forced to infer
  column names from SRS prose semantics; the correct names were only discoverable
  by inspecting the actual schema, which occurred during the execution phase

**Deficiency 2 — Group 9 out-of-scope (EC23, EC24: display position from FR-22)**
- Root cause (a): Entry 002 Execution Guidelines specified "collect from functional
  specs, UI designs, and database/API schemas" — the inclusion of "UI designs"
  opened the scope to FR-22 display positioning
- Root cause (b): SRS FR-02 internally cross-references FR-22; no cross-reference
  filter was stated in the prompt, so AI fetched and included FR-22 autonomously

**Structural factor — No intermediate approval gate**
- Session used a 6-turn sequential pipeline (Entry 001–006) with no user review
  between steps — the out-of-scope ECs from Step 2 propagated undetected into
  Step 3 TC expected results before post-session audit caught them

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | -------------- |
| 1 | Variable names `failed_login_count` (Step 1) and `lock_timer` (Step 1) | Names do not match actual DB schema: columns are `login_attempts` (INTEGER) and `locked_until` (DATETIME) in the `users` table. SQL pre-condition scripts fail with wrong column names. | Renamed to `login_attempts` and `locked_until` throughout `domain-testing.md` and `bva.md`. |
| 2 | Group 9 containing EC23 (error above Submit, Valid) and EC24 (error below Submit, Invalid); also EC22 (no error message displayed, Invalid) | GUI and presentation-layer ECs. FR-22 display placement is a GUI conformance defect category, confirmed by TA to be outside domain testing scope. AI over-included ECs from cross-referencing FR-22. | Removed Group 9 and EC22. EC count reduced from 24 to 21. BUG-02-002 (error below Submit) documented separately in `BUG_REPORT.md`. |
| 3 | TC-04 and TC-06 expected results contain "error message displayed above Submit (EC23 correct / EC24 absent)" | Consequence of Fix 2: TCs were asserting GUI positioning rather than functional behavior. | Removed EC23/EC24 lines from TC-04 and TC-06 expected results. Coverage matrix updated: 7 TC x 21 EC. |

---

### Artifact #2 — FR-09 Domain Testing (5-Condition Equivalence Classes + Test Cases)

> **Requirement mapping:** FR-09 Coupon — EP for all 5 conditions, percent vs fixed discount

#### (1) Prompt + Tool

**Tool:** Claude Code (domain-testing skill, single invocation)  
**Time:** 21:17 25/06/2026  
**Prompt:**
> Hãy áp dụng kỹ thuật /domain-testing để thực hiện thiết kế test case cho FR-09 - Coupon đã được document bên trong eshop-sut/srs.md và eshop-sut/api-specification.md.

#### (2) AI Output

> See [Prompt Log](prompt_log.md), entry **21:17 25/06/2026**.

AI autonomously executed all 4 steps of the domain testing framework via the `domain-testing` skill: 13 variables (Step 1), 18 ECs across 8 Groups (Step 2), 11 EP Test Cases with EC Coverage Matrix (Step 3), and 8 BVA Test Cases across 3 boundary targets (Step 4). Output was initially produced in Vietnamese and translated to English per a follow-up request in the same session (21:37). Committed as `6153cc0`.

#### (3) Verdict

**[ ] VALID** — correct and accepted as-is  
**[ ] INVALID** — wrong; rejected  
**[x] INCOMPLETE** — acceptable after edits

#### (4) Reasoning (ISTQB / S04)

Per ISTQB FL section 4.2.1, equivalence partitioning requires identifying all partitions in which the system processes inputs identically. The AI output correctly applied all 5 conditions (C1-C5) and used accurate variable names sourced from `api_specification.md`, eliminating the naming deficiency that affected FR-02. The Splitting Rule (S04 Step 2) was correctly applied for `type` (percent vs fixed) in Group 7, and EC17 was used as a cross-cutting shared expectation for all negative TCs, both improvements over FR-02 design. However, the AI listed `min_order_amount >= 0` as an implicit constraint in Step 1 (Implicit Gap G5: spec does not forbid a zero minimum order threshold), but did not extend this observation into a dedicated test case for the degenerate intersection where `total_amount = 0` satisfies condition C3 when `min_order_amount = 0`. EC07 was covered only via nominal positive values in TC-01 and TC-02. This is a reasoning miss: the constraint data was present in the AI's own Step 1 output, but the inference chain from constraint observation to degenerate boundary probe was not completed in Step 3.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | -------------- |
| 1 | 11 EP TCs (TC-01 through TC-11) covering EC01-EC18 via nominal inputs | Degenerate intersection not covered: EC07 (`total_amount >= min_order_amount`) was tested only with positive values; zero-amount path (`total_amount=0`, `min_order_amount=0`) was not probed despite AI identifying the constraint in Step 1 | Added TC-12: gap probe for zero-amount degenerate path with coupon `ZERO01` (`min_order_amount=0`); added `EC07 (zero path)` row to EC Coverage Matrix (commit `0a855b2`, 26/06/2026) |

---

### Artifact #3: FR-16 Domain Testing (File Domain + Atomicity Classes)

> **Requirement mapping:** FR-16 CSV Import: EP for file format, row validation, atomic rollback

#### (1) Prompt + Tool

**Tool:** Claude Code (claude-sonnet-4-6, domain-testing skill)  
**Time:** 21:31 27/06/2026  
**Prompt:**
> Hãy áp dụng kỹ thuật /domain-testing để thực hiện thiết kế test case chi tiết cho FR-16 - CSV Import đã được document bên trong eshop-sut/srs.md và eshop-sut/api-specification.md

#### (2) AI Output

See [Prompt Log](prompt_log.md), entry **21:31 27/06/2026**.

AI autonomously executed all 4 steps of the domain testing framework via the `domain-testing` skill, reading both `srs.md` (FR-16 and FR-15 cross-reference) and `api_specification.md` (section 6.3 endpoint and body schema). Output produced in English in a single invocation. Committed as `0f518d7`.

Deliverables written to disk:

- `artifacts/tests/FR-16-csv-import/domain-testing.md`
- `artifacts/tests/FR-16-csv-import/bva.md`

#### (3) Verdict

**[ ] VALID**: correct and accepted as-is  
**[ ] INVALID**: wrong; rejected  
**[x] INCOMPLETE**: acceptable after edits

#### (4) Reasoning (ISTQB / S04)

Per ISTQB FL section 4.2.1 and the S04 domain testing framework, the AI correctly
identified the Spec Conflict (SRS: CSV file upload; API: JSON body), scoped testing
to the JSON layer, and applied Must-Be, Range, and Splitting rules to produce 22 ECs
across 7 groups and 16 base TCs. Gap-probe TCs were generated for 4 of 7 Implicit
Gaps (TC-13 through TC-16). Two gaps were not actioned:

**Deficiency 1: No gap-probe TC for Import Report response schema (Step 1 Gap #6)**

- Step 3 selects TCs via EC minimization and Error Isolation; Gap #6 required a
  schema-observation probe (valid input, observational assertion) that fits neither
  track, so it was silently skipped when both tracks completed.

**Deficiency 2: No gap-probe TC for all-rows-invalid rollback (Step 1 Gap #7)**

- EC19 was already covered by TC-12, so EC minimization stopped. Gap #7 probes
  behavior within EC19's class (early-exit vs. full-scan), not a new EC; without
  a separate gap-completeness pass, TC-12's coverage was treated as sufficient.

Both omissions are structural, not prompt-quality failures; the Step 1 observations
were correct, but the pipeline has no back-reference pass confirming every Step 1 gap
produced a Step 3 TC. Same root cause as FR-09 Artifact #2.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | -------------- |
| 1 | Step 1 Implicit Gaps table, Gap #6: "Report response schema: SRS says 'clear report' but the API spec does not define the response body schema for this endpoint. Unknown which fields to verify: `imported`, `failed`, `errors[]`?" No gap-probe TC created. | The 4 other Step 1 gaps each received a gap-probe TC (TC-13 through TC-16). Gap #6 did not. As a result, every TC that asserts "report contains failed row count and reason" (TC-06 through TC-12) references field names that were never empirically confirmed to exist in the actual response. | Added **TC-17 [Gap Probe]: Import report response schema**: sends TC-01's valid input; records raw JSON response body verbatim; documents actual field names and types. TC-17 runs first and its output provides the verified schema for all subsequent report assertions. Multi-branch expected result: unknown fields documented, wrong schema flags update needed in TC-01 through TC-12, HTTP 500 is a bug. |
| 2 | Step 1 Implicit Gaps table, Gap #7: "Rollback scope: behavior when all rows fail is not addressed separately." No gap-probe TC created. | TC-12 tests a mixed [valid, invalid, valid] batch and confirms rollback. But no TC probes the all-invalid scenario, leaving two behavioral questions open: (a) does the SUT early-exit after the first failure or process all rows before rolling back, and (b) does the report list per-row failure reasons for all N rows as SRS requires ("lý do từng dòng") or only for the first. | Added **TC-18 [Gap Probe]: All-rows-invalid batch**: sends 3 rows all with distinct price violations (price=0, price=-1, price="abc"); records whether the response report lists 1 or 3 failure entries. Multi-branch expected result: 3 entries confirms full-scan before rollback and SRS compliance; 1 entry reveals early-exit and incomplete report; no per-row detail is a bug. |

---

### Artifact #4: FR-20 Domain Testing (Order-Status EC + Cancel Boundary)

> **Requirement mapping:** FR-20 Cancel Order (Mobile): EP on `order.status` and related variables, BVA on `confirmed`↔`shipping`

#### (1) Prompt + Tool

**Tool:** Claude Code (claude-sonnet-4-6, `domain-testing` skill)  
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

Per ISTQB FL section 4.2 (Equivalence Partitioning) and the accompanying BVA technique, the AI treated `order.status` as an ordinal domain variable with four functional values (`pending`, `confirmed`, `shipping`, `delivered`) plus the `canceled` terminal value, and applied the Splitting Rule to isolate `shipping` as its own EC (EC03) rather than folding it into a generic "non-cancelable" class, correct because `shipping` is the specific Spec Conflict target (SRS forbids user-cancel here; API spec section 4.6 wording implicitly permits it), and collapsing it into a broader class would have masked that disagreement. The same ordinal treatment carried into BVA: `order.status` was ranked `pending`(LB) → `confirmed` → `shipping` → `delivered`(UB), and the AI correctly targeted the `confirmed`(UB of the cancelable partition)↔`shipping`(UB+1) transition as the critical boundary, naming the precise wrong-operator defect (deny-list vs. allow-list) each TC exposes. The gap-probe TC pattern was also correctly applied for genuinely undocumented behavior (order ownership on cancel, confirm-dialog existence). However, the first design pass (Entry 009) missed FR-11's "phân biệt màu sắc" (color-distinguished) requirement on the same `result` output variable it had already cross-referenced for the Vietnamese-translation half of the same FR-11 sentence, a partial cross-reference miss, only surfaced in a dedicated self-review pass (Entry 010). That same self-review pass then over-corrected: alongside the one legitimate FR-11 gap, it proposed four additional candidate ECs/TCs with no UI-reachable path or spec-backed oracle, requiring explicit student rejection. The same completeness-checking instinct that caught the color gap also produced false positives once run without a scope constraint.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | -------------- |
| 1 | Step 2 output group (EC14-EC16) in the original design pass (Entry 009), no EC or TC checked whether order-status labels are color-distinguished. | FR-11 explicitly requires "trạng thái phải được dịch sang tiếng Việt rõ ràng **và phân biệt màu sắc**." The first design pass cross-referenced only the translation half; the color half was silently dropped. | Added EC17 (Must-Be Rule, dual-outcome) and TC-10 to `domain-testing.md` during the Entry 010 self-review pass. Execution confirmed **BUG-20-002** (Low): all five statuses render identical `rgb(0,0,0)` text with no distinguishing background/border. |
| 2 | Entry 010's self-review (22:53 turn) proposed 4 additional candidate gaps: malformed `order_id` probes, a race-condition/double-cancel probe, JWT-expiry-mid-session, and verbatim error-response-body assertions. | Each either has no UI-reachable path (violates this feature's UI-first, API-fallback-for-one-step-only scope) or lacks a spec-backed oracle (no documented JWT TTL, no documented error schema); adding them would have inflated the suite with unfalsifiable or out-of-scope assertions. | Rejected via explicit scope-negotiation (22:58 and 23:14 turns); none of the 4 were added to `domain-testing.md`/`bva.md`. Documented in `REPORT.md` Section 5.3 as a negative example of AI over-generation, not under-generation: the opposite failure mode from FR-09/FR-16. |

---

## 4. Summary of AI Accuracy

| Metric | Count | Percentage |
| ------ | ----- | ---------- |
| Total AI-generated artifacts audited | — | 100% |
| **VALID** (correct, accepted as-is) | — | —% |
| **INVALID** (wrong; rejected) | — | —% |
| **INCOMPLETE** (acceptable after edits) | — | —% |

---

## 5. Conclusion (When should AI be used or not)

_Điền sau khi hoàn thành toàn bộ bài._

---

## 6. Mandatory Disclosure

_[Điền sau khi hoàn thành — mô tả cụ thể AI đóng góp gì, bạn sửa gì, và những gì bạn tự làm hoàn toàn.]_

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

- Kharbach, M. (2026). _AI Use Policy Templates for Higher Education._ CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Hardman, P. (2025). _A Post-AI Learning Taxonomy._
- Fuster Rabella, M. (2025). _OECD Education Working Paper No. 338._
- Anthropic (2025). _Building reliable AI test agents_ — engineering blog.
- DeepEval & Promptfoo documentation — testing frameworks for LLM systems.
