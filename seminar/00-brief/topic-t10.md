*2026 AI-First - CS423/CSC15003 Software Testing - Seminar Track*

# T10 - Mutation Testing & Test Effectiveness

> *Coverage lies. Mutation testing tells you if your tests can actually catch bugs.*

## 1. Overview

Code coverage proves test execution; mutation testing proves test sensitivity. You introduce small code defects (mutants) — change > to <, remove a return, flip a Boolean — then ask: does any test fail? The mutation score (killed / total) is the metric. This topic puts EShop's own test suite under the microscope using PIT (Java), Stryker (JS/TS), or mutmut (Python) — and explores AI-assisted assertion generation and equivalent-mutant detection.

## 2. Learning Objectives

By the end of this seminar each team member must be able to:

- Set up Stryker on the EShop Node.js backend; produce a baseline mutation report.
- Identify three surviving mutants; explain why each survived.
- Add tests that kill those mutants without inflating coverage artificially.
- Generate assertion candidates with an AI tool; verify they actually kill mutants.
- Discuss the equivalent-mutant problem and current AI approaches to detection.

## 3. Traditional Tools - pick one as your main

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| Stryker | Mutation testing for JS/TS/C#/Scala. JSON + HTML reports. |
| PIT (PITest) | Java/Kotlin standard; integrates with Maven, Gradle, JUnit. |
| mutmut / Cosmic Ray | Python mutation testing. |
| mull | C/C++ via LLVM. |

## 4. AI-Augmented Direction - pick at least one

Demonstrating an AI angle is mandatory. The Department does not provide paid AI accounts; free tiers and student trials are allowed.

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| DiffBlue Cover | AI-generated JUnit tests targeting un-killed mutants. |
| ChatGPT / Claude for assertion synthesis | Given a function + missing assertion, propose extra asserts; verify against mutation report. |
| Pynguin + LLM helpers | Combine search-based test generation with LLM assertion repair. |

## 5. Reading List

- Jia & Harman — 'An Analysis and Survey of Mutation Testing' (2011).
- Stryker.NET / Stryker JS — 'Getting started' guides.
- GoogleResearch — 'State of Mutation Testing at Google' (2018).

## 6. Study Milestones (Stage S3 internal checklist)

1. Install Stryker on EShop backend; run baseline.
2. Read the HTML report; classify surviving mutants (real gap vs equivalent vs timeout).
3. Add 3 hand-written assertions to kill specific surviving mutants.
4. Ask AI to propose assertions for the same mutants; verify which actually kill them.
5. Report final mutation score and remaining equivalent-mutant candidates.

## 7. In-class Activity - for the audience teams

**Title: Kill the Mutant**
Audience teams look at five surviving mutants and write one assertion each, then race to kill the most.

| Time | Step |
| --- | --- |
| 0:00–0:03 | Facilitator shows 5 mutant diffs from EShop checkout module. |
| 0:03–0:13 | Each team writes 5 candidate assertions (in Jest or pytest pseudocode). |
| 0:13–0:18 | Pair teams swap and review — would these actually kill the mutants? |
| 0:18–0:22 | Facilitator runs the assertions on a prepared sandbox; tally kills. |
| 0:22–0:25 | Winning team explains the assertion design. |

**Audience takeaways:**

- A mutation score of 70–80% is a strong target; 100% is usually unrealistic.
- Equivalent mutants are unavoidable noise — manual review is still required.
- AI assertion generators are useful as drafts; validation against the mutation report is mandatory.

## 8. Deliverables

- Tool_Survey_Proposal.md - submitted in Stage S1.
- User_Guide.md (>= 6 sections) - submitted in Stage S4.
- Demo_Screencast.mp4 (5-8 min) - submitted in Stage S4.
- Activity_Worksheet.md for 'Kill the Mutant' - submitted in Stage S5.
- Seminar_Slides.pptx (<= 15 slides) - submitted in Stage S6.
- [AI-02] / [AI-03] / [AI-04] - submitted in Stage S8.

## 9. Topic-Specific Grading Notes

Generic rubric is in Seminar_Guide.docx Section 6. Topic-specific additions:

- Live demo MUST exercise at least one feature from the traditional tool AND one from the AI tool.
- User guide MUST include a 'failure modes' section listing 3 real ways the tool can mislead users.
- Activity worksheet MUST be reproducible by a peer team in <= 25 minutes without your help.

---

> *-- End of T10 brief --*
