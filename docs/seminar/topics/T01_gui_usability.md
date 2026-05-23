---
title: "T01 — GUI & Usability Testing"
source: "Courses/CSC13003 — SOFTWARE TESTING - ST4 - EN/Seminars/Topic-Descriptions/T01_GUI_and_Usability_Testing.docx"
course: CSC13003 Software Testing
topic: T01
tags: [software-testing, seminar, gui-testing, usability-testing, heuristic-evaluation]
---

*2026 AI-First - CS423/CSC15003 Software Testing - Seminar Track*

# T01 - GUI & Usability Testing

> *How real people experience the EShop user interface — and how AI helps us spot trouble.*

## 1. Overview

Software that 'works' technically can still fail its users. GUI and usability testing examines an application from the perspective of the human in front of the screen — does the navigation make sense, do error messages help, is the interaction efficient? In this topic you will pair classical usability heuristics (Nielsen's 10) with modern remote-testing tools and an AI-assisted heuristic reviewer. The EShop checkout journey is the perfect playground: cart, coupon, address, payment.

## 2. Learning Objectives

By the end of this seminar each team member must be able to:

- Run a 5-user remote usability test (think-aloud, scenario-based) on the EShop frontend.
- Score the same screens against Nielsen's 10 usability heuristics — manually.
- Use an AI tool (e.g., ChatGPT vision, Claude with screenshots) to draft a heuristic report; then audit each finding against the manual review.
- Aggregate severity using a 4-point scale (cosmetic / minor / major / catastrophic).
- Communicate findings in a 1-page executive summary plus annotated screenshots.

## 3. Traditional Tools - pick one as your main

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| Maze | Remote unmoderated usability testing — task success, click-paths, heatmaps. |
| Hotjar | Session recordings, heatmaps, and surveys for real EShop users. |
| BrowserStack Live | Cross-browser/device exploratory testing — Safari iOS, Chrome Android. |

## 4. AI-Augmented Direction - pick at least one

Demonstrating an AI angle is mandatory. The Department does not provide paid AI accounts; free tiers and student trials are allowed.

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| ChatGPT / Claude vision | Upload screenshots; ask for heuristic-evaluation report. Cross-check each finding. |
| Hotjar AI summaries | Auto-clustered themes from open-ended user feedback — verify against raw text. |
| UXTweak AI | Heatmap interpretation and report drafting — practise critiquing AI-written usability claims. |

## 5. Reading List

- Nielsen, J. — 10 Usability Heuristics for User Interface Design (NN/g).
- Krug, S. — Rocket Surgery Made Easy (Chs. 1–3) for remote/lightweight tests.
- BS EN ISO 9241-11:2018 — Usability: definitions and concepts.
- Article: 'Can AI replace usability testers?' (NN/g, 2024).

## 6. Study Milestones (Stage S3 internal checklist)

1. Install Maze trial; build 3 EShop task flows: Search → Add to Cart → Apply Coupon → Checkout.
2. Recruit 5 test users (classmates ok); record audio if consent given.
3. Manually score Nielsen heuristics on the same 5 screens; rate each finding 1–4.
4. Repeat the heuristic review with an AI tool; produce a side-by-side comparison.
5. Identify 5 issues the AI missed and 5 issues the humans missed — analyse why.

## 7. In-class Activity - for the audience teams

**Title: Heuristic Showdown — Human vs AI**
Audience teams will run a 20-minute Nielsen heuristic review on a single EShop screen, then compare their findings against an AI-generated review of the same screen.

| Time | Step |
| --- | --- |
| 0:00–0:03 | Facilitator distributes the screenshot of EShop checkout (PDF). |
| 0:03–0:13 | Each audience team writes down ≥ 5 heuristic violations with severity. |
| 0:13–0:18 | Facilitator reveals the AI-generated review; teams cross-check overlaps & misses. |
| 0:18–0:23 | Pairs discuss: which findings did only humans catch? Which only AI? |
| 0:23–0:25 | Each team shares one bullet on the whiteboard or chat. |

**Audience takeaways:**

- AI is fast but biased toward surface issues (contrast, label clarity).
- Humans catch context-dependent issues (e.g., 'add coupon BEFORE payment confusion').
- Severity rating must be human-final; AI severity is often miscalibrated.

## 8. Deliverables

- Tool_Survey_Proposal.md - submitted in Stage S1.
- User_Guide.md (>= 6 sections) - submitted in Stage S4.
- Demo_Screencast.mp4 (5-8 min) - submitted in Stage S4.
- Activity_Worksheet.md for 'Heuristic Showdown — Human vs AI' - submitted in Stage S5.
- Seminar_Slides.pptx (<= 15 slides) - submitted in Stage S6.
- [AI-02] / [AI-03] / [AI-04] - submitted in Stage S8.

## 9. Topic-Specific Grading Notes

Generic rubric is in Seminar_Guide.docx Section 6. Topic-specific additions:

- Live demo MUST exercise at least one feature from the traditional tool AND one from the AI tool.
- User guide MUST include a 'failure modes' section listing 3 real ways the tool can mislead users.
- Activity worksheet MUST be reproducible by a peer team in <= 25 minutes without your help.

---

> *-- End of T01 brief --*
