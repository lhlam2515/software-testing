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

The AI correctly applied ISTQB FL 4.2 Equivalence Partitioning across the functional
domain of FR-02, producing valid groupings for email format, email existence, password
match, counter threshold, lockout window, counter behavior, JWT output, and error
message content. Per S04 Step 2 guidelines, equivalence classes must reflect
functional system behavior only; however, the AI included Group 9 (EC23 and EC24,
covering error message display position derived from FR-22) which belongs to GUI
conformance testing, not to the functional equivalence space of FR-02. Additionally,
the AI inferred internal variable names (`failed_login_count`, `lock_timer`) from SRS
semantics rather than the actual database schema (`login_attempts`, `locked_until`),
making the pre-condition SQL setup scripts incorrect. These two deficiencies required
student corrections before test execution could proceed.

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

**Tool:** Claude Code  
**Time:** _**:**_ DD/MM/2026  
**Prompt:**
> _[Paste verbatim prompt here]_

#### (2) AI Output

> See [Prompt Log](prompt_log.md) — entry **_**:**_ DD/MM/2026**.

#### (3) Verdict

**[ ] VALID** — correct and accepted as-is  
**[ ] INVALID** — wrong; rejected  
**[ ] INCOMPLETE** — acceptable after edits

#### (4) Reasoning (ISTQB / S04)

_[2–5 sentences. Reference 5 conditions C1–C5, EC isolation rule for invalid classes]_

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | -------------- |
| | | | |

---

### Artifact #3 — FR-16 Domain Testing (File Domain + Atomicity Classes)

> **Requirement mapping:** FR-16 CSV Import — EP for file format, row validation, atomic rollback

#### (1) Prompt + Tool

**Tool:** Claude Code  
**Time:** _**:**_ DD/MM/2026  
**Prompt:**
> _[Paste verbatim prompt here]_

#### (2) AI Output

> See [Prompt Log](prompt_log.md) — entry **_**:**_ DD/MM/2026**.

#### (3) Verdict

**[ ] VALID** — correct and accepted as-is  
**[ ] INVALID** — wrong; rejected  
**[ ] INCOMPLETE** — acceptable after edits

#### (4) Reasoning (ISTQB / S04)

_[2–5 sentences. Reference ISTQB FL §4.2 EP, atomic transaction invariant from SRS FR-16]_

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | -------------- |
| | | | |

---

### Artifact #4 — FR-20 Domain Testing (State-Based EC + Cancel Boundary)

> **Requirement mapping:** FR-20 Cancel Order (Mobile) — state machine EC, BVA on `confirmed`↔`shipping`

#### (1) Prompt + Tool

**Tool:** Claude Code  
**Time:** _**:**_ DD/MM/2026  
**Prompt:**
> _[Paste verbatim prompt here]_

#### (2) AI Output

> See [Prompt Log](prompt_log.md) — entry **_**:**_ DD/MM/2026**.

#### (3) Verdict

**[ ] VALID** — correct and accepted as-is  
**[ ] INVALID** — wrong; rejected  
**[ ] INCOMPLETE** — acceptable after edits

#### (4) Reasoning (ISTQB / S04)

_[2–5 sentences. Reference ISTQB FL §4.2.4 state transition, FR-10 state machine invariants]_

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | -------------- |
| | | | |

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
