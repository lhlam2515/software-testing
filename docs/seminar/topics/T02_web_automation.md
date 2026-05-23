---
title: "T02 — Web Automation Testing"
source: "Courses/CSC13003 — SOFTWARE TESTING - ST4 - EN/Seminars/Topic-Descriptions/T02_Web_Automation_Testing.docx"
course: CSC13003 Software Testing
topic: T02
tags: [software-testing, seminar, web-automation, playwright, selenium, cypress]
---

*2026 AI-First - CS423/CSC15003 Software Testing - Seminar Track*

# T02 - Web Automation Testing

> *End-to-end browser tests at speed — and the AI tools that promise to write them for you.*

## 1. Overview

Web automation is the most common test-automation activity in industry. You will compare two traditional frameworks (Playwright and Cypress) with the AI-augmented direction taken by tools such as Mabl, Testim, and GitHub Copilot. EShop has 22 functional requirements — many touch the browser. Pick three flows to automate and measure not just whether the tests pass, but how maintainable and flake-resistant they are.

## 2. Learning Objectives

By the end of this seminar each team member must be able to:

- Install Playwright and run a parameterised test against the EShop frontend.
- Add a 'self-healing locator' experiment using Testim trial OR a Copilot-suggested locator strategy.
- Measure first-run vs 10th-run flakiness on a network-throttled environment.
- Discuss the maintenance cost of AI-generated tests vs hand-written ones over 4–6 weeks.
- Frame a recommendation memo for an EShop dev team choosing an automation strategy.

## 3. Traditional Tools - pick one as your main

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| Playwright | Microsoft-backed, multi-browser, codegen, trace-viewer; great default. |
| Selenium 4 | Industry standard; W3C WebDriver; widest ecosystem. |
| Cypress | DX-friendly, time-travel debugger; chrome-family focus. |

## 4. AI-Augmented Direction - pick at least one

Demonstrating an AI angle is mandatory. The Department does not provide paid AI accounts; free tiers and student trials are allowed.

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| Mabl (free tier) | Auto-healing selectors + visual diff on EShop login flow. |
| Testim AI | Locator stabilisation via attribute-weight model. |
| GitHub Copilot / Cursor | Generate test scripts from a natural-language scenario — then audit, run, and refactor. |

## 5. Reading List

- Playwright docs — Best Practices.
- Bach, J. — 'Test Automation Snake-Oil' (1999) — re-read after AI hype.
- Mabl blog — 'Self-healing tests: what they really do' (technical post).
- Selenium 4 release notes — relative locators.

## 6. Study Milestones (Stage S3 internal checklist)

1. Set up Playwright + npm; verify with the EShop login spec from FR-02.
2. Cover three flows: Login + lockout (FR-02), Add-to-Cart (FR-07), Checkout (FR-08).
3. Capture flakiness metrics over 10 runs; investigate one flake.
4. Re-write one flow using an AI tool; compare locator strategies side-by-side.
5. Diff the AI-generated assertions against your hand-written ones — note false negatives.

## 7. In-class Activity - for the audience teams

**Title: Locator Brawl — Hand-crafted vs AI-suggested**
Audience teams race to write the same Add-to-Cart test two ways and compare results.

| Time | Step |
| --- | --- |
| 0:00–0:03 | Facilitator demos the target flow on EShop (login → add to cart → assert badge). |
| 0:03–0:10 | Team A writes the test by hand in Playwright; Team B uses Copilot/Claude. |
| 0:10–0:15 | Each team runs the test 3 times on a slow network and records failures. |
| 0:15–0:20 | Teams compare locator stability and maintainability. |
| 0:20–0:25 | Whole class agrees on a 'good locator' rubric. |

**Audience takeaways:**

- AI locators favour short XPath/CSS but break on small DOM changes.
- data-test-id attributes still win for long-term maintainability.
- Self-healing reduces noise but can mask real defects — pair with visual diff.

## 8. Deliverables

- Tool_Survey_Proposal.md - submitted in Stage S1.
- User_Guide.md (>= 6 sections) - submitted in Stage S4.
- Demo_Screencast.mp4 (5-8 min) - submitted in Stage S4.
- Activity_Worksheet.md for 'Locator Brawl — Hand-crafted vs AI-suggested' - submitted in Stage S5.
- Seminar_Slides.pptx (<= 15 slides) - submitted in Stage S6.
- [AI-02] / [AI-03] / [AI-04] - submitted in Stage S8.

## 9. Topic-Specific Grading Notes

Generic rubric is in Seminar_Guide.docx Section 6. Topic-specific additions:

- Live demo MUST exercise at least one feature from the traditional tool AND one from the AI tool.
- User guide MUST include a 'failure modes' section listing 3 real ways the tool can mislead users.
- Activity worksheet MUST be reproducible by a peer team in <= 25 minutes without your help.

---

> *-- End of T02 brief --*
