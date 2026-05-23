---
title: "T03 — Mobile Automation Testing"
source: "Courses/CSC13003 — SOFTWARE TESTING - ST4 - EN/Seminars/Topic-Descriptions/T03_Mobile_Automation_Testing.docx"
course: CSC13003 Software Testing
topic: T03
tags: [software-testing, seminar, mobile-automation, appium, espresso, detox]
---

*2026 AI-First - CS423/CSC15003 Software Testing - Seminar Track*

# T03 - Mobile Automation Testing

> *Real devices, real users — Appium classic vs AI visual-driven automation.*

## 1. Overview

Mobile is harder than web: fragmented OS versions, sensors, network conditions, and tiny touch targets. EShop ships a React Native Expo client (Android + iOS) — perfect for exploring Appium, Espresso, and Detox alongside AI visual testing tools like Applitools. Your goal: produce a mobile test that runs on a real device farm AND survives a UI refresh.

## 2. Learning Objectives

By the end of this seminar each team member must be able to:

- Stand up Appium 2 with the UiAutomator2 driver; connect to a real Android device or AVD.
- Author a login + product-search test for the EShop mobile app.
- Add an Applitools Eyes visual check on the home screen.
- Compare maintenance cost when the home banner changes images vs colour tokens.
- Decide when Detox (JS-native pair) is preferable to Appium for React-Native apps.

## 3. Traditional Tools - pick one as your main

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| Appium 2 | Cross-platform, WebDriver protocol, large community. |
| Espresso (Android) | In-process, deterministic, very fast — but Android-only. |
| Detox | RN/Expo focus, synchronisation primitives, no real device needed in CI. |

## 4. AI-Augmented Direction - pick at least one

Demonstrating an AI angle is mandatory. The Department does not provide paid AI accounts; free tiers and student trials are allowed.

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| Applitools Eyes | AI-based visual diff with layout-aware ignore regions. |
| Sauce Labs Sauce AI | Locator self-healing and failure clustering. |
| Mobile.dev (Maestro AI) | YAML flows + AI repair suggestions. |

## 5. Reading List

- Hans-Joachim Görg — 'Practical Appium' (Chs. 1–4).
- React Native testing docs — Detox vs Appium decision matrix.
- Applitools — 'Visual AI 101' whitepaper.

## 6. Study Milestones (Stage S3 internal checklist)

1. Install Appium 2 + driver; run sample on EShop mobile build.
2. Add Applitools Eyes; baseline 3 screens.
3. Introduce a controlled UI change; document false-positive vs true-positive visual diffs.
4. Switch the same scenario to Detox; report DX differences in writing.

## 7. In-class Activity - for the audience teams

**Title: Visual Diff Triage Workshop**
Audience teams classify a batch of Applitools failures into 'true bug', 'false positive', and 'intentional update'.

| Time | Step |
| --- | --- |
| 0:00–0:03 | Facilitator screens 10 diff cards (printed or PDF). |
| 0:03–0:13 | Teams classify each card; provide a 1-line reason. |
| 0:13–0:18 | Reveal answer key + discuss ambiguous cases. |
| 0:18–0:23 | Teams design an 'ignore region' policy for EShop home banner. |
| 0:23–0:25 | Each team shares one rule for the policy. |

**Audience takeaways:**

- Visual AI dramatically lowers script maintenance — but generates triage work.
- Ignore regions must be policy-driven; ad-hoc ignoring hides regressions.
- Pair visual AI with a small set of functional asserts for safety nets.

## 8. Deliverables

- Tool_Survey_Proposal.md - submitted in Stage S1.
- User_Guide.md (>= 6 sections) - submitted in Stage S4.
- Demo_Screencast.mp4 (5-8 min) - submitted in Stage S4.
- Activity_Worksheet.md for 'Visual Diff Triage Workshop' - submitted in Stage S5.
- Seminar_Slides.pptx (<= 15 slides) - submitted in Stage S6.
- [AI-02] / [AI-03] / [AI-04] - submitted in Stage S8.

## 9. Topic-Specific Grading Notes

Generic rubric is in Seminar_Guide.docx Section 6. Topic-specific additions:

- Live demo MUST exercise at least one feature from the traditional tool AND one from the AI tool.
- User guide MUST include a 'failure modes' section listing 3 real ways the tool can mislead users.
- Activity worksheet MUST be reproducible by a peer team in <= 25 minutes without your help.

---

> *-- End of T03 brief --*
