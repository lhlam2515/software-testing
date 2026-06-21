---
title: "HW01 — QA/QC Jobs · 20 Defects · Test a Physical Product"
assignment: HW01-AI
course: CS423 / CSC13003 – Software Testing
policy: "Adapted from Med Kharbach, PhD (2026) — AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0."
---

Faculty of Information Technology (FIT) – Ho Chi Minh City University of Science (HCMUS)  
CS423 / CSC13003 – Software Testing (AI-augmented · 2026)

# Main Report — HW01

---

## 1. Student Information

| Field                   | Value                                   |
| ----------------------- | --------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                            |
| Student ID:             | 23127216                                |
| Class / Cohort:         | 23KTPM1                                 |
| Assignment ID:          | HW#01                                   |
| Assignment date:        | 03/06/2026                              |
| AI tool(s) used:        | Claude Code, Claude, Gemini             |
| AI Disclosure Form:     | [AI-03] AI Disclosure Form — HW01       |
| GitHub Repository:      | [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing) |

---

## 2. Requirement 1 — QA/QC Job Market 2026+ (Summary)

10 job postings published within 60 days of submission were collected from ITviec. All postings are for QA/QC roles in the Vietnamese market, with 5 positions explicitly requiring AI/LLM/automation-AI skills (Gene Solutions, GrapeCity, Nakivo, Bosch, KMS Technology). Each posting is accompanied by a dated screenshot showing the student's ITviec username, a job description table, salary information (where available), and a 1–2 sentence AI Impact Analysis.

**Artifacts:**

- Full job analyses: [`artifacts/job-market/`](artifacts/job-market/)
- Audit details (AI-02 Artifact #2): [`[AI-02]_AI_Audit_Report.md`]([AI-02]_AI_Audit_Report.md)
- AI-graded with 3 VALID, 5 INCOMPLETE, 2 INVALID — see AI Audit Report §3

| Metric | Count |
|--------|-------|
| Total JDs analysed | 10 |
| AI-required positions | 5 |
| Screenshots with username | 10 |
| AI Impact Analysis | 10 |

---

## 3. Requirement 2 — 20 Software Defects 2022–2026 (Summary)

20 software defects publicized between 2022 and 2026 were collected, spanning critical infrastructure, consumer software, AI/LLM systems, and IoT/embedded. 6 defects are AI/LLM-related (hallucination, prompt injection, bias), meeting the ≥5 requirement. Each defect entry includes a source link, description, severity assessment, consequences, and solution analysis. Additionally, all 20 entries include an AI hallucination analysis: 16 entries show clear signs of AI hallucination (fabricated details, misattributed claims, invented CVSS scores), while the remaining 4 entries are inconclusive — the AI's output matched available sources closely enough that hallucination could not be definitively confirmed. These 4 are marked as VALID in the audit (Artifact #5).

**Artifacts:**

- Full defect catalogue: [`artifacts/defects/software_defects.md`](artifacts/defects/software_defects.md)
- AI hallucination/bias analysis: [`artifacts/defects/hallucination_report.md`](artifacts/defects/hallucination_report.md)
- AI-specific defects: [`artifacts/defects/ai_defects.md`](artifacts/defects/ai_defects.md)
- Audit details (AI-02 Artifacts #4, #5): [`[AI-02]_AI_Audit_Report.md`]([AI-02]_AI_Audit_Report.md)

| Category | Count |
|----------|-------|
| General software defects | 12 |
| AI/LLM-specific defects | 6 |
| Vendor/Security advisories | 2 |
| **Total** | **20** |
| AI hallucination analyses | 16/20 |

---

## 4. Requirement 3 — Physical Product Testing (Summary)

### Device Under Test

| Field | Value |
|-------|-------|
| **Brand** | Senko |
| **Model** | TC1626 |
| **Type** | Wall-mounted oscillating fan |
| **Year** | 09/2022 |
| **Controls** | 3 mechanical sub-systems: SPEED (pull-cord), SWING (pull-cord), TILT (manual pivot) |
| **Photo evidence** | [`artifacts/physical-product-testing/assets/device.jpg`](artifacts/physical-product-testing/assets/device.jpg) |

### Test Execution Overview

| Metric | Count | Details |
|--------|-------|---------|
| Total test cases designed | 19 | 15 AI-baseline + 4 student edge cases |
| Executed on real device | 19 | All 19 test cases physically executed; 3 PASS, 2 FAIL (5 defects found) |
| Video recordings | 5 | [TC-S03: Loop-back Speed OFF](https://youtube.com/shorts/JcOICxVzXLc) · [TC-W01: Start Oscillation](https://youtube.com/shorts/FzpIfNOsJ74) · [TC-T01: Tilt Step Up](https://youtube.com/shorts/OGL_IQ5IagY) · [TC-W03: Asymmetrical Sweep — FAIL](https://youtube.com/shorts/XVii4rJJKvI) · [TC-W05: Jerky Reversal — FAIL](https://youtube.com/shorts/nZOewgCRiUA) |
| Edge cases AI missed | 4 | EC-01 through EC-04 |
| Defects found | 5 | Logged as GitHub Issues |
| AI conversation evidence | 4 | Screenshots showing AI did not generate edge cases |

### Defects Found (GitHub Issues)

| ID | Title | Linked TC |
|----|-------|-----------|
| DEF-01 | Speed Level 1 Runs at Highest Speed Instead of Lowest | TC-S01 |
| DEF-02 | Speed Decreases as Level Number Increases — Inverted Speed Sequence | TC-S02 |
| DEF-03 | Oscillation Sweep Is Asymmetrical — Right Arc Wider Than Left | TC-W03 |
| DEF-04 | Oscillation Motion Jerks at Direction Reversal Points | TC-W05 |
| DEF-05 | Rapid SPEED Cord Pulls Trigger Mid-Sweep Direction Reversal | EC-04 |

**Artifacts:**

- Product info: [`artifacts/physical-product-testing/product_info.md`](artifacts/physical-product-testing/product_info.md)
- Test cases: [`artifacts/physical-product-testing/test_cases.md`](artifacts/physical-product-testing/test_cases.md)
- Defect report: [`artifacts/physical-product-testing/product_defects.md`](artifacts/physical-product-testing/product_defects.md)
- Test case checklist (Excel): [`artifacts/physical-product-testing/test_case_checklist.xlsx`](artifacts/physical-product-testing/test_case_checklist.xlsx)
- Test summary report (Excel): [`artifacts/physical-product-testing/test_summary_report.xlsx`](artifacts/physical-product-testing/test_summary_report.xlsx)
- GitHub Issues screenshots: [`artifacts/physical-product-testing/assets/github-issues/`](artifacts/physical-product-testing/assets/github-issues/)
- GitHub repository (issues logged at): [`github.com/lhlam2515/software-testing/issues`](https://github.com/lhlam2515/software-testing/issues)
- Edge case AI evidence: [`artifacts/physical-product-testing/assets/edge-case-evidences/`](artifacts/physical-product-testing/assets/edge-case-evidences/)
- Demo videos (YouTube Unlisted):
  - [TC-S03 — Loop-back Speed OFF](https://youtube.com/shorts/JcOICxVzXLc)
  - [TC-W01 — Start Oscillation](https://youtube.com/shorts/FzpIfNOsJ74)
  - [TC-T01 — Tilt Step Up](https://youtube.com/shorts/OGL_IQ5IagY)
  - [TC-W03 — Asymmetrical Sweep (FAIL)](https://youtube.com/shorts/XVii4rJJKvI)
  - [TC-W05 — Jerky Reversal (FAIL)](https://youtube.com/shorts/nZOewgCRiUA)

---

## 5. AI Audit Report — Summary

> Full audit report: [`[AI-02]_AI_Audit_Report.md`]([AI-02]_AI_Audit_Report.md) — 5 artifacts audited with 32 total sub-items.

### AI Accuracy Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Total AI-generated artifacts audited | 32 | 100% |
| **VALID** (correct, accepted as-is) | 7 | 22% |
| **INVALID** (wrong; rejected) | 5 | 16% |
| **INCOMPLETE** (acceptable after edits) | 20 | 62% |

### Conclusion — When should AI be used (or not)?

AI handled structured generation well: it built a coherent ISTQB mindmap, wrote 10 job-market analyses from raw JDs, and produced 15 functional test cases in minutes. It was also a useful brainstorming tool for defect categorization.

But AI was not reliable on factual accuracy. Out of 32 audit items, only 22% were accepted as-is. 62% needed correction, and 16% were completely invalid. The most common problems: hallucinated technical details (like "self-healing locators" that no JD mentions), missing implicit requirements (edge cases a physical device needs), and poor signal weighting (treating preferred qualifications as requirements).

Recommendation: use AI for first drafts, exploration, and boilerplate. But verify every output against primary sources. AI can accelerate the mechanical parts of the work, but domain expertise and independent verification are where the real quality comes from.

### Per-Artifact Breakdown

| Artifact | Items | Breakdown |
|----------|-------|-----------|
| #1 — ISTQB Mindmap | 1 | 1 INCOMPLETE |
| #2 — Job Market Analysis | 10 | 3 VALID, 5 INCOMPLETE, 2 INVALID |
| #3 — Physical Product Test Cases | 1 batch | 1 INCOMPLETE |
| #4 — Defects 1–8 | 8 | 8 INCOMPLETE |
| #5 — Defects 9–20 (AI hallucination) | 12 | 4 VALID, 5 INCOMPLETE, 3 INVALID |

---

## 6. AI Critique

Across the five AI artifacts generated for this assignment, AI handled formatting and structure consistently well. mindmaps, test tables, and defect lists appeared in seconds. But that speed came with accuracy problems.

The most common problem was hallucination. In the job market analysis, AI invented technical requirements like "self-healing locators" that did not appear in any job description. It also treated preferred qualifications as hard requirements. In the defect analysis, 8 of the 12 AI/LLM defect entries had factual errors: fabricated CVSS scores, misattributed vulnerabilities, and invented patch timelines.

Physical product testing showed a worse limitation. AI wrote competent functional tests for each mechanical part in isolation. But it could not reason about the device in a real-world context. It missed power-cycle state recovery (EC-01), concurrent pull-cord interaction (EC-02), long-term vibration effects on wall-mounting (EC-03), and cumulative torque coupling from rapid cord pulls (EC-04). These problems come from AI having no physical experience with mechanical systems. It cannot infer failure modes that arise from physics, environment, or concurrent use.

The main takeaway: AI is a drafting tool, not a domain expert. It speeds up writing and formatting, but every factual claim still needs verification, every edge case needs independent reasoning, and every physical test still needs to be run on the real device. LLMs are statistical text predictors, not systems grounded in physical reality. They work well where the answer is in the training data (ISTQB terminology, test-case formatting). They struggle where the answer needs real-world experimentation or domain-specific knowledge. For software testing, AI helps most as a test-design accelerator. It helps least with accuracy-dependent claims and physical-device edge cases. The tester's judgment, domain knowledge, and willingness to verify are still what matters.

---

## 7. Mandatory Disclosure

The QA/QC role mindmap, job market AI impact analysis, physical product test cases, and defect descriptions were initially generated by **Claude, Claude Code, and Gemini**; I reviewed and modified the mindmap structure (3 structural corrections), rewrote 7 of 10 job analyses to remove hallucinated details, added 4 edge cases (EC-01–EC-04) the AI missed, and corrected factual errors in 16 of 20 defect descriptions. The AI Critique, device photos, and GitHub Issues screenshots were produced entirely by me. The detailed AI Audit Report is attached as Appendix A. I confirm I did not use AI to generate any artifact listed in the prohibited category (device photo with student ID, execution videos, job-posting screenshots, prompt log).

---

## 8. Self-Assessment

| No. | Criteria | Max Grade | Self-Assessed Grade | Notes |
|-----|----------|-----------|---------------------|-------|
| 1 | Job Market 2026+ (10 jobs × 3 pts + AI Impact) | 40 | 38 | 10 JDs with screenshots; all have AI Impact Analysis; 5 AI-required positions; some salaries marked as "Not available" |
| 2 | Software Defects 2022–2026 (20 defects) | 20 | 18 | 20 defects with AI hallucination analysis; 6 AI/LLM-related (≥5 met); minor citation gaps in some entries |
| 3 | Physical-product test design (15 TCs + 5 videos) | 25 | **23** | 19 TCs (15 baseline + 4 edge cases); all 19 executed; 5 defects found as GitHub Issues; 5 demo videos on YouTube Unlisted |
| AI-1 | [AI-02] AI Audit Report (5-section) attached | 8 | 8 | 5 artifacts × 5 sections = 32 audit items; full summary table and conclusion included |
| AI-2 | AI Critique 200–300 words + [AI-03] Disclosure attached | 4 | 4 | AI Critique written; AI-03 Disclosure Form signed and attached |
| AI-3 | [AI-05] Checklist signed + anti-cheat artifacts | 3 | 3 | AI-05 Privacy Checklist signed; all anti-cheat artifacts present |
| | **Total** | **100** | **94** | |

---

## 9. Signature

| Field | Value |
|-------|-------|
| Student name (printed): | Lê Hoàng Lâm |
| Student ID: | 23127216 |
| Class / Cohort: | 23KTPM1 |
| Course: | CS423 / CSC13003 – Software Testing |
| Instructor: | Dr. Lam Quang Vu |
| Date: | 03/06/2026 |
| Signature: | ![Lê Hoàng Lâm](./assets/signature.png) |

---

## 10. References

### Course & Academic References

- ISTQB Foundation Level Syllabus (latest version).
- Hardman, P. (2025). *A Post-AI Learning Taxonomy.*
- Fuster Rabella, M. (2025). *OECD Education Working Paper No. 338.*
- Perkins, M., Roe, J., & Furze, L. (2025). *AI Assessment Scale (AAS).*
- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education.* CC BY-NC-SA 4.0.
- Anthropic (2025). *Building reliable AI test agents* — engineering blog.
- DeepEval & Promptfoo documentation — testing frameworks for LLM systems.

### AI Compliance Documents

- [[AI-02] AI Audit Report — HW01]([AI-02]_AI_Audit_Report.md) — 5-section audit per artifact
- [[AI-03] AI Disclosure Form — HW01]([AI-03]_AI_Disclosure_Form.md) — signed AI use declaration
- [[AI-05] AI Privacy & Responsible Use Checklist — HW01]([AI-05]_AI_Privacy_Checklist.md) — signed checklist
- [[AI-06] Student Acknowledgement — HW01]([AI-06]_AI_Student_Acknowledge.md) — signed acknowledgement
- [Prompt Log](prompt_log.md) — full prompt log with timestamps

### Artifact Directories

- [Job Market Analyses](artifacts/job-market/) — 10 job postings with screenshots
- [Defect Catalogue](artifacts/defects/) — 20 software defects + hallucination report
- [Physical Product Testing](artifacts/physical-product-testing/) — test cases, defect report, Excel files, screenshots
- [QA/QC Role Mindmap](artifacts/qa_qc_role_mindmap.md) — ISTQB-based mindmap
