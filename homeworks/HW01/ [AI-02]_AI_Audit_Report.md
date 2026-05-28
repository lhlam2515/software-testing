---
title: "[AI-02] AI Audit Report — HW01"
assignment: HW01-AI
course: CS423 / CSC13003 – Software Testing
policy: "Adapted from Med Kharbach, PhD (2026) — AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0."
---

Faculty of Information Technology (FIT) – Ho Chi Minh City University of Science (HCMUS)  
CS423 / CSC13003 – Software Testing (AI-augmented · 2026)

# AI Audit Report — HW01

---

## 1. Student Information

| Field                   | Value                                   |
| ----------------------- | --------------------------------------- |
| Student name (printed): | ![Lê Hoàng Lâm](./assets/signature.png) |
| Student ID:             | 23127216                                |
| Class / Cohort:         | 23KTPM1                                 |
| Assignment ID:          | HW#01                                   |
| Assignment date:        |                                         |
| AI tool(s) used:        | Claude Code                             |
| AI tool(s) used:        | [X] Yes [ ] No                          |

---

## 2. Instructions

- Add **one section** per AI-generated artifact (mindmap, test cases, analysis batch, etc.).
- Each artifact section contains **5 sub-items** — fill all of them.
- **(1) Prompt** — paste verbatim; do **not** paraphrase.
- **(2) AI Output** — paste verbatim output **or** embed a labelled screenshot.
- **(3) Verdict** — mark exactly one: `VALID` · `INVALID` · `INCOMPLETE`.
- **(4) Reasoning** — 2–5 sentences citing a course slide, ISTQB section, or technical RFC.
- **(5) Student Fix** — show the corrected artifact; highlight every change.
- To add more artifacts, duplicate any `### Artifact #N` block and increment the number.

---

## 3. Audit

### Artifact #1 — ISTQB QA/QC Role Mindmap *(Bloom-AI G9.1 — Understand)*

> **Requirement mapping:** R_AI-1 · G9.1 — Ask an AI Tool for an ISTQB-process mindmap and find ≥ 3 mistakes.

#### (1) Prompt + Tool

> **Tool:** <!-- e.g. Claude / ChatGPT / Gemini -->  
> **Time:** <!-- HH:MM DD/MM/YYYY -->  
> **Prompt:**
>
> ```
> [Paste the verbatim prompt here — do not paraphrase]
> ```

#### (2) AI Output

<!-- Paste verbatim AI output below, OR replace this comment with a red-bordered screenshot embedded as: ![Artifact #1 output](assets/<filename>.png) -->

```
[Paste verbatim AI output here]
```

#### (3) Verdict

**[ ] VALID** — correct and accepted as-is  
**[ ] INVALID** — wrong; rejected  
**[x] INCOMPLETE** — acceptable after edits ← *(mark the one that applies)*

#### (4) Reasoning (ISTQB)

<!-- 2–5 sentences. Cite the matching course slide number or ISTQB FL syllabus section. Example: "The mindmap omitted the ISTQB concept of 'independence of testing' (FL §3.2). Per slide 07-Testing-Principles, independence is a key factor distinguishing a QA role from a Developer role…" -->

#### (5) Student Fix

<!-- Show the corrected mindmap or list of corrections. Use **bold** or ~~strikethrough~~ to highlight every change. -->

| #   | AI-generated item | Issue | Corrected item |
| --- | ----------------- | ----- | -------------- |
| 1   |                   |       |                |
| 2   |                   |       |                |
| 3   |                   |       |                |

---

### Artifact #2 — QA/QC Job Market AI Impact Analysis *(Req 1)*

> **Requirement mapping:** Req 1 — Write 1–2 sentences of "AI Impact Analysis" per job posting (10 postings).

#### (1) Prompt + Tool

**Tool:** Claude Code
**Time:** 16:45 28/05/2026
**Prompt:**
> Hãy giúp tôi viết phần AI Impact Analysis cho cả 10 job dựa vào nội dung của mỗi job, sau khi hoàn thành hãy giải thích cho tôi lý do bạn viết những phân tích đó một cách rõ ràng. Nội dung phân tích được viết bằng tiếng Anh. Hãy fan out các subagent để thực hiện và tổng kết lại nội dung tôi yêu cầu  

#### (2) AI Output

> See in [Prompt Log](prompt_log.md) for the full AI output for all 10 job postings.

#### (3) Verdict

**[ ] VALID** — correct and accepted as-is  
**[ ] INVALID** — wrong; rejected  
**[X] INCOMPLETE** — acceptable after edits

#### (4) Reasoning

This is an ordinary content-analysis task: each AI-generated "AI Impact Analysis" was judged solely on whether its claims can be traced back to the text of the corresponding job description (JD). Three of the ten analyses were fully grounded and accepted as-is (PNJ, Nakivo, TEENUP); the remaining seven required correction and fell into three problem types:

- **Unsupported or invented detail.** Bosch's analysis claimed AI enables "self-healing locators within Playwright frameworks" — a specific technique that appears nowhere in the JD. soxes AG attributed the human advantage to "cross-cultural communication," whereas the JD only specifies "strong English communication skills."
- **Misread requirement weight.** One Mount's analysis built its human-value argument around the "Fintech/Banking" domain, which the JD places only under *Preferred Qualifications*, not as a hard requirement. KMS's analysis labeled its AI-tool skills a "differentiator," overstating a block the JD explicitly files under nice-to-have.
- **Contradiction or fabrication against the JD.** Gene Solutions's analysis declared the role "at measurable risk" due to its "manual-only nature," directly contradicting the JD, which already lists automation testing as a bonus skill. Pizza Hut's analysis invented AI augmentation tasks — defect triage, pipeline health monitoring — for a JD that contains no AI reference whatsoever. GrapeCity was the mildest case: its claims were individually valid but the analysis overlooked the JD's mention of ISTQB Foundation certification as a plus, a meaningful hiring signal about the company's methodology expectations.

Verdicts were assigned by degree of JD deviation: VALID when every claim mapped directly to JD text; INCOMPLETE when the core argument was sound but relied on an unsupported inference or omitted a meaningful JD signal; INVALID when a claim contradicted the JD or had no grounding in it. Batch result: **VALID 30% · INCOMPLETE 50% · INVALID 20%**.

#### (5) Student Fix

*3 JDs not modified (verdict VALID — accepted as-is): PNJ, Nakivo, TEENUP.*

| # | JD | Issue | Before (AI original) | After (student fix) |
|---|---|---|---|---|
| 1 | **One Mount Group** | Human moat anchored to *Preferred* ("Fintech/Banking") instead of *Required* ("SQL skills") | *"…applying domain-specific judgment in Fintech/Banking contexts where data accuracy and risk-based testing decisions cannot be delegated…"* | **"…applying risk-based judgment in the data-validation layer (SQL skills are explicitly required) where incorrect automated assertions in financial workflows carry real business consequences."** |
| 2 | **soxes AG** | "cross-cultural communication" inferred without JD support; JD only specifies "strong English" | *"…requires the cross-cultural communication and contextual judgment that AI tools currently cannot replicate."* | **"…is a judgment call requiring contextual reasoning, particularly when collaborating directly with overseas partners whose specifications may contain implicit assumptions."** |
| 3 | **Bosch** | "self-healing locators" — hallucinated technical detail absent from JD | *"…automating test case generation, accelerating result analysis, and ~~enabling self-healing locators within Playwright frameworks~~…"* | **"…accelerating test case generation and result analysis…"** (detail removed) |
| 4 | **KMS Technology** | Nice-to-have AI skills mislabeled as "differentiator" | *"KMS explicitly treats AI tool proficiency as ~~a differentiator~~…"* | **"KMS currently lists AI tool proficiency as nice-to-have…but the dedicated AI section signals these skills are becoming baseline expectations…"** |
| 5 | **Gene Solutions** | "at measurable risk" / "no-automation nature" contradicts JD (automation = bonus skill) | *"…putting the ~~manual-only, no-automation nature of this position at measurable risk~~…"* | **"Gene Solutions' QA role sits at the manual-to-automation transition point — …listing automation testing as a bonus skill, indicating the company is beginning to integrate automation…"** |
| 6 | **GrapeCity** | Missing ISTQB certification signal — important JD indicator omitted | *(original ended after bug reporting sentence)* | **Added: "GrapeCity's mention of ISTQB Foundation certification as a plus further suggests the company values structured testing methodology…signaling that human-led quality frameworks remain central even as AI tooling advances."** |
| 7 | **Pizza Hut** | AI augmentation claims entirely fabricated — JD contains zero AI references | *"AI is increasingly capable of augmenting lower-level tasks…such as ~~automated defect triage, test framework recommendations, and CI/CD pipeline health monitoring~~…"* | **"Pizza Hut's Senior/Lead QA job description contains no explicit AI tool requirements…As AI continues to absorb lower-level automation tasks across the industry, this role's defining responsibilities…represent the distinctly human contribution…"** |

---

### Artifact #3 — Physical Product Test Cases *(Bloom-AI G9.3 — Analyse)*

> **Requirement mapping:** Req 3 · G9.3 — Generate test cases for the chosen physical device; then find ≥ 3 edge cases the AI could NOT find.

#### (1) Prompt + Tool

> **Tool:** <!-- e.g. Claude / ChatGPT / Gemini -->  
> **Time:** <!-- HH:MM DD/MM/YYYY -->  
> **Prompt:**
>
> ```
> [Paste the verbatim prompt here — do not paraphrase]
> ```

#### (2) AI Output

<!-- Paste verbatim AI output below, OR embed a labelled screenshot. Include all AI-generated test cases. -->

```
[Paste verbatim AI output here]
```

#### (3) Verdict

**[ ] VALID** — correct and accepted as-is  
**[ ] INVALID** — wrong; rejected  
**[ ] INCOMPLETE** — acceptable after edits

#### (4) Reasoning (ISTQB)

<!-- 2–5 sentences. Example: "AI ignored boundary conditions on the device's rated voltage range. ISTQB FL §4.3 Boundary Value Analysis requires testing at min, max, and just-outside-max values. The test set was therefore INCOMPLETE." -->

#### (5) Student Fix

<!-- List the ≥ 3 edge cases that the AI missed. Include: (a) screenshot of the AI conversation proving the AI did not generate these cases, and (b) written explanation of why the AI missed them. -->

**Edge cases added by student:**

| TC#   | Objective | Input / Condition | Why AI missed it |
| ----- | --------- | ----------------- | ---------------- |
| EC-01 |           |                   |                  |
| EC-02 |           |                   |                  |
| EC-03 |           |                   |                  |

> **Screenshot evidence:** ![AI conversation — missing edge cases](assets/<!-- filename -->.png)

---

## 4. Summary of AI Accuracy

> Aggregate the verdicts from Section 3.

| Metric                                  | Count | Percentage |
| --------------------------------------- | ----- | ---------- |
| Total AI-generated artifacts audited    |       |            |
| **VALID** (correct, accepted as-is)     |       | %          |
| **INVALID** (wrong; rejected)           |       | %          |
| **INCOMPLETE** (acceptable after edits) |       | %          |

---

## 5. Conclusion — When should AI be used (or not)?

> Write **80–150 words** describing patterns observed. Where did AI shine? Where did AI fail? What is your recommendation for using AI in this kind of work in the future?

<!-- Replace this comment with your 80–150-word conclusion. -->

---

## 6. Mandatory Disclosure

> Paste the verbatim disclosure below, filling in the bracketed fields.

"[Test cases / mindmap / job market analysis] was initially generated by [AI tool name]; I reviewed and modified [section X], added [edge cases Y, Z]; [section W] was written entirely by me. The detailed AI Audit Report is attached as Appendix A. I confirm I did not use AI to generate any artifact listed in the prohibited category."

---

## Signature

| Field                   | Value                               |
| ----------------------- | ----------------------------------- |
| Student name (printed): |                                     |
| Student ID:             |                                     |
| Class / Cohort:         |                                     |
| Course:                 | CS423 / CSC13003 – Software Testing |
| Instructor:             |                                     |
| Date:                   |                                     |
| Signature:              |                                     |

---

## References

- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education.* CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Hardman, P. (2025). *A Post-AI Learning Taxonomy.*
- Fuster Rabella, M. (2025). *OECD Education Working Paper No. 338.*
- Perkins, M., Roe, J., & Furze, L. (2025). *AI Assessment Scale.*
- Anthropic (2025). *Building reliable AI test agents* — engineering blog.
- DeepEval & Promptfoo documentation — testing frameworks for LLM systems.
