---
title: "T05 — Performance Testing"
source: "Courses/CSC13003 — SOFTWARE TESTING - ST4 - EN/Seminars/Topic-Descriptions/T05_Performance_Testing.docx"
course: CSC13003 Software Testing
topic: T05
tags: [software-testing, seminar, performance-testing, jmeter, k6, locust]
---

*2026 AI-First - CS423/CSC15003 Software Testing - Seminar Track*

# T05 - Performance Testing

> *JMeter is still king — but AI now writes realistic load scenarios from your logs.*

## 1. Overview

Performance testing on EShop combines load, stress, and spike profiles against the Node.js + SQLite backend. You will design a realistic mixed-workload model — search-heavy, checkout-bursty — and run it from JMeter or k6. The AI angle: use ChatGPT/Claude to translate your assumptions or an HTTP log into a k6 scenario, then audit the script for unrealistic distributions.

## 2. Learning Objectives

By the end of this seminar each team member must be able to:

- Design a workload model: % of search vs cart-add vs checkout per virtual user-minute.
- Implement the model in JMeter (.jmx) AND in k6 (JavaScript).
- Run a baseline load (50 VU) and a spike (50→500 VU in 30s).
- Capture p50/p95/p99 latency and error rate; produce a 1-page report.
- Use AI to draft a 'realistic shopping' scenario from a fake server log — audit & refine.

## 3. Traditional Tools - pick one as your main

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| Apache JMeter | GUI + CLI; rich plugin ecosystem; XML scripts. |
| k6 (Grafana Labs) | JavaScript scripting, cloud-friendly, modern reports. |
| Locust (Python) | Pure-Python scenarios, easy distributed mode. |

## 4. AI-Augmented Direction - pick at least one

Demonstrating an AI angle is mandatory. The Department does not provide paid AI accounts; free tiers and student trials are allowed.

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| ChatGPT / Claude for k6 | Prompt with a sample HAR or log; generate k6 script; audit. |
| Grafana k6 AI | AI-suggested correlations and thresholds from past runs. |
| Akamas (AI optimisation) | Tunes JVM / DB parameters; uses ML for parameter search — discuss only, not required to run. |

## 5. Reading List

- Molyneaux — 'The Art of Application Performance Testing' (Chs. 2, 6).
- Grafana k6 — getting-started + thresholds docs.
- Brendan Gregg — 'Systems Performance' (intro).

## 6. Study Milestones (Stage S3 internal checklist)

1. Capture an HAR from a manual EShop session.
2. Convert it into a baseline k6 script; verify it reproduces the flow.
3. Run baseline 50 VU for 5 min on the local backend (be careful: SQLite + single connection).
4. Generate AI-suggested 'realistic shopping' variant; audit and refine.
5. Produce SLO report: p95 < 500 ms, error rate < 1%, etc.

## 7. In-class Activity - for the audience teams

**Title: Workload Model Bake-off**
Audience teams design a realistic workload distribution for EShop Black-Friday in 15 minutes.

| Time | Step |
| --- | --- |
| 0:00–0:03 | Facilitator shows the EShop site map + the 22 FRs. |
| 0:03–0:12 | Teams sketch %-mix per user-minute on a worksheet. |
| 0:12–0:17 | Each team posts the mix; facilitator collects on the board. |
| 0:17–0:22 | Facilitator runs the winning team's mix as a k6 dry-run; debrief. |
| 0:22–0:25 | Teams note one assumption they would have changed. |

**Audience takeaways:**

- Realistic workload modelling matters more than raw VU count.
- AI helps shape scenarios but cannot verify business realism — humans must.
- SQLite is fine for HW; production SUTs would need pooled Postgres + connection limits.

## 8. Deliverables

- Tool_Survey_Proposal.md - submitted in Stage S1.
- User_Guide.md (>= 6 sections) - submitted in Stage S4.
- Demo_Screencast.mp4 (5-8 min) - submitted in Stage S4.
- Activity_Worksheet.md for 'Workload Model Bake-off' - submitted in Stage S5.
- Seminar_Slides.pptx (<= 15 slides) - submitted in Stage S6.
- [AI-02] / [AI-03] / [AI-04] - submitted in Stage S8.

## 9. Topic-Specific Grading Notes

Generic rubric is in Seminar_Guide.docx Section 6. Topic-specific additions:

- Live demo MUST exercise at least one feature from the traditional tool AND one from the AI tool.
- User guide MUST include a 'failure modes' section listing 3 real ways the tool can mislead users.
- Activity worksheet MUST be reproducible by a peer team in <= 25 minutes without your help.

---

> *-- End of T05 brief --*
