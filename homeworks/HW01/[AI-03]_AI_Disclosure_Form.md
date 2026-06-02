---
title: "[AI-03] AI Use Disclosure Form — HW01"
assignment: HW01-AI
course: CS423 / CSC13003 – Software Testing
policy: "Adapted from Med Kharbach, PhD (2026) — AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.
---

Faculty of Information Technology (FIT) – Ho Chi Minh City University of Science (HCMUS)  
CS423 / CSC13003 – Software Testing (AI-augmented · 2026)

# AI Use Disclosure Form — HW01

Attach to assignments where AI was used in any permitted capacity.

---

## 1. Course & Student Info

| Field                  | Value                                             |
| ---------------------- | ------------------------------------------------- |
| Course:                | CS423 / CSC13003 – Software Testing               |
| Assignment ID:         | HW#01                                             |
| Assignment Title:      | QA/QC Jobs · 20 Defects · Test a Physical Product |
| AI Use Category (1–5): | Category 4 - AI-Assisted Production               |
| Date:                  | 03/06/2026                                        |
| Student name:          | Lê Hoàng Lâm                                      |
| Student ID:            | 23127216                                          |

---

## 2. Disclosure Questions

### 1. AI tool(s) used

List every AI tool used for this assignment (e.g., ChatGPT, Claude, Gemini, GitHub Copilot, Cursor).

> Claude, Claude Code, Gemini

---

### 2. Stage(s) of the assignment where AI was used

Tick all that apply:

- [x] brainstorming
- [ ] outlining
- [x] drafting
- [ ] feedback
- [x] revision
- [x] coding (test case generation)
- [ ] data analysis
- [ ] visual design
- [ ] other (specify): _________________________________________________

---

### 3. Main prompts or tasks given to the AI

Paste the 2–3 most impactful prompts verbatim. For the full transcript, see the [Prompt Log](prompt_log.md).

> **Prompt 1:** "Hãy giúp tôi vẽ một QA/QC role mindmap bằng mermaid" — *Gemini, 00:30 03/06/2026*
>
> **Prompt 2:** "Hãy giúp tôi viết phần AI Impact Analysis cho cả 10 job dựa vào nội dung của mỗi job…" — *Claude Code, 16:45 28/05/2026*
>
> **Prompt 3:** Full structured prompt for Senko TC1626 physical device test cases (SPEED / SWING / TILT sub-systems) — *Claude, 16:08 02/06/2026*

For the complete transcript, see the [Prompt Log](prompt_log.md).

---

### 4. Specific parts of the work AI contributed to

Be specific. Example: "AI generated TC01–TC15 in Section 3.2; I rewrote TC04 and TC11; AI did NOT contribute to Sections 1, 2, 4, or the AI Critique."

> AI contributed to:
>
> - **QA/QC role mindmap** — generated a first-draft Mermaid diagram; I identified and corrected 3 structural errors (Requirement Review placement, Non-functional Testing classification, missing Test Analysis/Design phases).
> - **AI Impact Analysis (Req 1)** — drafted all 10 analyses; I rewrote 7 of them to remove hallucinated details, fix misread JD signals, and align claims with actual job descriptions.
> - **Physical product test cases (Req 3)** — generated 15 functional black-box test cases (EC/EP/BVA); I added 4 edge cases the AI completely missed (power-cycle recovery, simultaneous cord actuation, vibration-induced bracket loosening, rapid SPEED during oscillation).
> - **Defect descriptions (Req 2)** — drafted 8 AI/LLM defect entries and 12 security defect entries; I verified every claim against primary sources and corrected hallucinations in 16 of the 20 entries.
>
> AI did NOT generate: device photos, execution videos, AI Critique (200–300 words), GitHub Issues defect screenshots, or this Disclosure Form.

---

### 5. How I reviewed, revised, or verified the AI output

Describe your verification method (ran the test, checked the spec, asked the TA, looked up RFC, cross-checked with the ISTQB syllabus, etc.).

> Each AI artifact was verified using the following methods:
>
> - **Mindmap** — cross-checked against ISTQB Foundation Level Syllabus (latest version) for structural correctness.
> - **AI Impact Analysis** — fact-checked every claim against the corresponding job description text; flagged and corrected unsupported inferences (e.g., "self-healing locators," "cross-cultural communication").
> - **Test cases** — physically executed all test cases on the real Senko TC1626 fan device to confirm validity of expected results; revised any cases with incorrect expectations or missing edge conditions.
> - **Defect descriptions** — verified every CVE/incident against primary sources (NVD, vendor advisories, post-mortem analyses, news articles).
> - **Edge cases** — designed EC-01…EC-04 independently and confirmed via a second AI session that the AI did not generate these cases.

---

### 6. Citation (if required by course style guide)

Software Testing uses the IEEE style.

> Anthropic. (2026). Claude [Large language model]. <https://claude.ai>
>
> Google. (2026). Gemini [Large language model]. <https://gemini.google.com>
>
> Anthropic. (2026). Claude Code [AI coding assistant]. <https://claude.ai/code>

---

## 3. Statement of Honesty

By signing below, I confirm that the disclosure above is accurate and complete. I understand that undisclosed or false disclosure of AI use is treated as academic misconduct and may result in a 0 grade for the assignment and disciplinary referral.

---

## 4. Signature

| Field                   | Value                                   |
| ----------------------- | --------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                            |
| Student ID:             | 23127216                                |
| Class / Cohort:         | 23KTPM1                                 |
| Course:                 | CS423 / CSC13003 – Software Testing     |
| Instructor:             | Dr. Lam Quang Vu                        |
| Date:                   | 03/06/2026                              |
| Signature:              | ![Lê Hoàng Lâm](./assets/signature.png) |

---

## References

- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education.* CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Hardman, P. (2025). *A Post-AI Learning Taxonomy.*
- Fuster Rabella, M. (2025). *OECD Education Working Paper No. 338.*
- Perkins, M., Roe, J., & Furze, L. (2025). *AI Assessment Scale.*
- Anthropic (2025). *Building reliable AI test agents* — engineering blog.
- DeepEval & Promptfoo documentation — testing frameworks for LLM systems.
