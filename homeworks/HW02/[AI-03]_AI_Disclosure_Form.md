---
title: "[AI-03] AI Use Disclosure Form — HW02"
assignment: HW02-AI
course: CS423 / CSC13003 – Software Testing
policy: "Adapted from Med Kharbach, PhD (2026) — AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0."
---

Faculty of Information Technology (FIT) – Ho Chi Minh City University of Science (HCMUS)  
CS423 / CSC13003 – Software Testing (AI-augmented · 2026)

# AI Use Disclosure Form — HW02

Attach to assignments where AI was used in any permitted capacity.

---

## 1. Course & Student Info

| Field                  | Value                                          |
| ---------------------- | ---------------------------------------------- |
| Course:                | CS423 / CSC13003 – Software Testing            |
| Assignment ID:         | HW#02                                          |
| Assignment Title:      | Domain Testing on EShop                        |
| AI Use Category (1–5): | Category 4 — AI-Assisted Production            |
| Date:                  | 22/06/2026                                     |
| Student name:          | Lê Hoàng Lâm                                   |
| Student ID:            | 23127216                                       |

---

## 2. Disclosure Questions

### 1. AI tool(s) used

> Claude Code

---

### 2. Stage(s) of the assignment where AI was used

- [ ] brainstorming
- [ ] outlining
- [x] drafting (test case generation)
- [ ] feedback
- [x] revision (AI Gap Analysis)
- [x] coding (test case tables, EC analysis)
- [ ] data analysis
- [ ] visual design
- [ ] other: _________________________________________________

---

### 3. Main prompts or tasks given to the AI

_Paste the 2–3 most impactful prompts verbatim. Full transcript: see [Prompt Log](prompt_log.md)._

> **Prompt 1:** _[Verbatim prompt for FR-02 Domain Testing]_ — _Claude Code, _**:**_ DD/MM/2026_
>
> **Prompt 2:** _[Verbatim prompt for FR-09 Coupon analysis]_ — _Claude Code, _**:**_ DD/MM/2026_
>
> **Prompt 3:** _[Verbatim prompt for FR-16 CSV Import]_ — _Claude Code, _**:**_ DD/MM/2026_

---

### 4. Specific parts of the work AI contributed to

> AI contributed to:
>
> - **FR-02 equivalence classes & test cases** — generated initial EP table and BVA test cases; I [describe what you corrected].
> - **FR-09 coupon condition analysis** — drafted EC table for all 5 conditions and discount calculation test cases; I [describe what you corrected].
> - **FR-16 CSV import test cases** — generated file format and atomicity EC classes; I [describe what you corrected].
> - **FR-20 cancel order test cases** — drafted state-based EC table; I [describe what you corrected].
>
> AI did NOT generate: AI Gap Analysis, bug reports, AI Critique (200–300 words), GitHub Issues screenshots, or this Disclosure Form.

---

### 5. How I reviewed, revised, or verified the AI output

> Each AI artifact was verified using the following methods:
>
> - **Equivalence classes** — cross-checked every EC against `docs/eshop-sut/srs.md` to verify conditions match the written spec, not AI's assumptions.
> - **BVA test cases** — verified boundary points against the 9-point model from slide S04 and the 3-value BVA rule from ISTQB FL §4.2.
> - **Test execution** — ran all test cases against the live EShop SUT and recorded actual results in the Execution Log of each feature file.
> - **Atomicity (FR-16)** — manually verified rollback behavior by inspecting database state after injecting invalid rows.

---

### 6. Citation

> Anthropic. (2026). Claude Code [AI coding assistant]. <https://claude.ai/code>

---

## 3. Statement of Honesty

By signing below, I confirm that the disclosure above is accurate and complete. I understand that undisclosed or false disclosure of AI use is treated as academic misconduct and may result in a 0 grade for the assignment and disciplinary referral.

---

## 4. Signature

| Field                   | Value                                  |
| ----------------------- | -------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                           |
| Student ID:             | 23127216                               |
| Class / Cohort:         | 23KTPM1                                |
| Course:                 | CS423 / CSC13003 – Software Testing    |
| Instructor:             | Dr. Lam Quang Vu                       |
| Date:                   | 22/06/2026                             |
| Signature:              | ![Lê Hoàng Lâm](assets/signature.png) |

---

## References

- Kharbach, M. (2026). _AI Use Policy Templates for Higher Education._ CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Hardman, P. (2025). _A Post-AI Learning Taxonomy._
- Anthropic (2025). _Building reliable AI test agents_ — engineering blog.
