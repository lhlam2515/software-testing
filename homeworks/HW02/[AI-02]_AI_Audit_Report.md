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

### Artifact #1 — FR-02 Domain Testing (Equivalence Classes + Test Cases)

> **Requirement mapping:** FR-02 Login & Lockout — EP & BVA

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

_[2–5 sentences. Reference slide S04 steps, ISTQB FL §4.2, or SRS FR-02 constraints]_

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| - | ----------------- | ----- | -------------- |
| | | | |

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
