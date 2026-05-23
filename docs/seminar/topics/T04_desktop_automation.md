---
title: "T04 — Desktop Automation Testing"
source: "Courses/CSC13003 — SOFTWARE TESTING - ST4 - EN/Seminars/Topic-Descriptions/T04_Desktop_Automation_Testing.docx"
course: CSC13003 Software Testing
topic: T04
tags: [software-testing, seminar, desktop-automation, winappdriver, pywinauto]
---

*2026 AI-First - CS423/CSC15003 Software Testing - Seminar Track*

# T04 - Desktop Automation Testing

> *Legacy Windows clients still exist — and now image-based AI automates them.*

## 1. Overview

Although EShop is web/mobile, your industry future may include desktop apps (admin tools, factory dashboards, legacy CRMs). This topic explores classical desktop automation — WinAppDriver, Pywinauto, TestComplete — and the rising image-based / AI-driven tooling (Eggplant AI, Robocorp AI, Microsoft Power Automate Desktop AI). Build a tiny desktop automation around a simple Windows app supplied by the lecturer (or an open-source alternative such as KeePass).

## 2. Learning Objectives

By the end of this seminar each team member must be able to:

- Install WinAppDriver and a Pywinauto script.
- Automate a simple workflow (e.g., add a record, save, verify).
- Replicate the same workflow with image-based / OCR-based automation.
- Compare reliability under DPI changes, theme changes, and window resizing.
- Recommend a decision rule: when to use UI-tree vs image-based automation.

## 3. Traditional Tools - pick one as your main

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| WinAppDriver | Microsoft's WebDriver port for Windows UWP/Win32; deprecated but still common. |
| Pywinauto (Python) | UIA-based; great for legacy Win32 apps. |
| TestComplete | Commercial; mature scripting; image + UI tree hybrid. |

## 4. AI-Augmented Direction - pick at least one

Demonstrating an AI angle is mandatory. The Department does not provide paid AI accounts; free tiers and student trials are allowed.

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| Eggplant AI | Model-based testing + image recognition. |
| Microsoft Power Automate Desktop (AI Builder) | Image + OCR + LLM steps; low-code. |
| Robocorp / Robot Framework AI extensions | Hybrid keyword + vision approach. |

## 5. Reading List

- Microsoft WinAppDriver documentation.
- Pywinauto User Guide.
- Eggplant — 'Model-Based Test Automation' whitepaper.

## 6. Study Milestones (Stage S3 internal checklist)

1. Install the sample target app (e.g., KeePass or Calculator).
2. Write a Pywinauto script: open app → create entry → save → re-open and verify.
3. Recreate the same flow with Power Automate Desktop using AI-builder vision steps.
4. Run both under 125% DPI scaling; record success/failure.

## 7. In-class Activity - for the audience teams

**Title: DPI & Theme Stress Test**
Audience teams predict which automation approach survives a DPI change — then watch the demo.

| Time | Step |
| --- | --- |
| 0:00–0:03 | Vote on a wall: 'UI-tree' or 'Image-based' will fail first under DPI 200%. |
| 0:03–0:10 | Facilitator runs both automation scripts at 100%, 150%, 200% DPI. |
| 0:10–0:15 | Audience teams record failures observed. |
| 0:15–0:22 | Group discussion: failure modes (text shift, button repaint, anti-aliasing). |
| 0:22–0:25 | Each team writes one mitigation tactic. |

**Audience takeaways:**

- UI-tree automation usually wins on DPI but loses on bespoke / canvas-drawn UIs.
- Image-based AI handles canvas UIs but needs anchor calibration.
- Hybrid (UI tree as anchor, OCR for assertion) is often the strongest combo.

## 8. Deliverables

- Tool_Survey_Proposal.md - submitted in Stage S1.
- User_Guide.md (>= 6 sections) - submitted in Stage S4.
- Demo_Screencast.mp4 (5-8 min) - submitted in Stage S4.
- Activity_Worksheet.md for 'DPI & Theme Stress Test' - submitted in Stage S5.
- Seminar_Slides.pptx (<= 15 slides) - submitted in Stage S6.
- [AI-02] / [AI-03] / [AI-04] - submitted in Stage S8.

## 9. Topic-Specific Grading Notes

Generic rubric is in Seminar_Guide.docx Section 6. Topic-specific additions:

- Live demo MUST exercise at least one feature from the traditional tool AND one from the AI tool.
- User guide MUST include a 'failure modes' section listing 3 real ways the tool can mislead users.
- Activity worksheet MUST be reproducible by a peer team in <= 25 minutes without your help.

---

> *-- End of T04 brief --*
