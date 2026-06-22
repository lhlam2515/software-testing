---
title: "Seminar Track — Master Guide"
source: "Courses/CSC13003 — SOFTWARE TESTING - ST4 - EN/Seminars/Seminar_Guide.docx"
course: CSC13003 Software Testing
tags: [software-testing, seminar, guide, workflow, rubric, ai-policy]
---

### 2026 AI-First Edition

# CS423 / CSC15003 — Software Testing

## Seminar Track — Master Guide

> FIT @ HCMUS · Department of Software Engineering
> Lecturer: Dr. Lâm Quang Vũ · <lqvu@fit.hcmus.edu.vn>

## 1. Purpose of the Seminar Track

The Seminar Track turns students into self-directed researchers of modern testing tools. Each team will survey, install, master, document, and then teach a chosen testing tool to the rest of the class. The track bridges the classical testing techniques taught in lectures (W01–W11) with the rapidly evolving AI-augmented tooling ecosystem.
By the end of the seminar, each team must demonstrate that they can:

- Survey a tool category and articulate trade-offs between competing options.
- Combine one traditional tool with at least one AI-augmented variant.
- Produce reproducible, peer-readable documentation (Markdown + screencast).
- Facilitate a 15–25 minute hands-on activity that lets peers experience the tool.
- Disclose, justify, and audit every AI assistance used in the work.

## 2. Workflow — 8 Stages from Claim to Reflection

The workflow is intentionally student-driven. Instructors review and approve but do NOT prescribe the tool. The table below summarises the 8 stages; deadlines are listed in Section 5.

| # | Stage | Owner | Output |
| --- | --- | --- | --- |
| S1 | Topic claim & tool survey | Team (3–4 SV) | Tool short-list (1 traditional + 1+ AI-augmented); 1-page proposal |
| S2 | Instructor / TA review & approval | Group instructor | Approved tool list + scope note (Markdown comment in repo) |
| S3 | Deep study & hands-on practice | Team | Working installation; sample test on EShop SUT; team notes |
| S4 | Author user-guide (Markdown) + record demo | Team | User_Guide.md (≥ 6 sections) + screencast (5–8 min, ≤ 100 MB) |
| S5 | Pre-seminar sharing (≥ 3 days early) | Team | Folder + Moodle post; audience teams must skim before class |
| S6 | Seminar session (45 min live) | Team + audience | Pitch (10 min) + live demo (10 min) + audience hands-on (20 min) + Q&A (5 min) |
| S7 | Audience activity & feedback | Other teams | Activity worksheet + 1 minute-paper feedback per team |
| S8 | Reflection + AI Audit submission | Team | [AI-02] Audit, [AI-03] Disclosure, [AI-04] Reflective (300 words) |

### 2.1 Stage details

#### Stage S1 — Topic claim & tool survey

Each team chooses one of the ten topics listed in Section 3. Within 5 working days after the topic is claimed, the team must submit a 1-page tool-survey proposal containing:

- Topic name + code (e.g., T6 API Testing).
- At least three candidate tools: 1 traditional, 1 AI-augmented, 1 backup.
- Comparison matrix on five criteria: licence cost, learning curve, EShop fit, AI capability, community.
- Recommended pick + 3-bullet rationale.
- AI Disclosure: which AI you used to research, and what you cross-checked.

#### Stage S2 — Instructor / TA review

The group instructor or TA reads the proposal and replies within 2 working days. Possible verdicts: APPROVED (proceed to S3), MINOR-CHANGE (refine then proceed), or RECLAIM (scope mismatch — pick a different angle). Teams may iterate at most twice.

#### Stage S3 — Deep study & hands-on practice

The team installs the tool, completes the official tutorial, and runs at least one end-to-end scenario against the EShop SUT. Capture screenshots, command lines, and errors in a private team log. Pair-programming is encouraged but every member must be able to run the tool unaided.

#### Stage S4 — User-guide + demo recording

Produce a User_Guide.md (≥ 6 sections: Introduction, Install, First Test, Advanced Usage, Troubleshooting, References) and a 5–8 minute screencast demo. Screencast format: MP4, 1080p preferred, ≤ 100 MB. No background music. English narration. Subtitles optional but recommended.

#### Stage S5 — Pre-seminar share

At least 3 working days before the live seminar, the team must push the user guide, the screencast, and an Activity_Worksheet.md to the shared Moodle folder. Audience teams have a duty to skim the materials beforehand — this is enforced by attendance credit (see Section 6).

#### Stage S6 — Live seminar (45 min)

Recommended structure:

- 0:00–0:10  Pitch — why this tool, who uses it, when it fails.
- 0:10–0:20  Live demo on EShop (no slides; real terminal/IDE).
- 0:20–0:40  Audience hands-on activity (worksheet from S5).
- 0:40–0:45  Debrief + Q&A.
Tip: keep slides to ≤ 15 — the activity is the centrepiece, not the slides.

#### Stage S7 — Audience activity & feedback

Other teams complete the worksheet during the seminar and submit a 1-minute paper answering: (a) one thing learned, (b) one thing still unclear, (c) one rating (1–5) on usefulness. These minute papers count toward audience attendance.

#### Stage S8 — AI Audit + Reflection

Within 5 working days after the seminar, the team submits the AI Audit pack:

- [AI-02] AI Audit Report — 5 sections, ≥ 600 words total.
- [AI-03] AI Disclosure — signed PDF per team member.
- [AI-04] Reflective Statement — 300 words; what worked / what didn't.

## 3. The Ten Seminar Topics

Every topic blends a traditional testing technique with an AI-augmented direction. Detailed topic briefs are available under Seminar/Topic-Descriptions/ in this folder.

| # | Seminar Topic | Traditional Tools | AI-Augmented Direction |
| --- | --- | --- | --- |
| T1 | GUI & Usability Testing | Maze, Hotjar, BrowserStack Live | AI heuristic reviewer, screenshot diffing |
| T2 | Web Automation Testing | Playwright, Selenium, Cypress | Mabl, Testim (auto-heal), GitHub Copilot test-gen |
| T3 | Mobile Automation Testing | Appium, Espresso, Detox | Applitools visual AI, AI-based locator |
| T4 | Desktop Automation Testing | WinAppDriver, Pywinauto, TestComplete | Image-based recognition (Eggplant AI) |
| T5 | Performance Testing | JMeter, k6, Locust | AI scenario synthesis from production logs |
| T6 | API & Contract Testing | Postman, RestAssured, Karate | AI test gen from OpenAPI; Pact AI hints |
| T7 | CI/CD & Test-Harness Engineering | GitHub Actions, Jenkins, GitLab CI | AI flaky-test triage, log summarisation |
| T8 | Database Testing | DbUnit, Liquibase, tSQLt | AI data masking, schema-drift detection |
| T9 | Security Testing (DAST/SAST) | OWASP ZAP, Burp Suite, Semgrep | AI vulnerability triage, AI fuzzers |
| T10 | Mutation Testing & Test Effectiveness | PIT, Stryker, mutmut | AI assertion gen, equivalent-mutant detection |

Rule of pairing: teams must demonstrate at least one feature from BOTH the traditional and the AI-augmented columns during their live demo.

## 4. Deliverables Checklist

- Tool_Survey_Proposal.md — Stage S1 (≤ 1 page).
- User_Guide.md — Stage S4 (≥ 6 sections, English).
- Demo_Screencast.mp4 — Stage S4 (5–8 min, ≤ 100 MB).
- Activity_Worksheet.md — Stage S5 (worksheet + answer key).
- Seminar_Slides.pptx — Stage S6 (≤ 15 slides; use template).
- Audience_Feedback_Aggregated.md — Stage S7 (collected by facilitator team).
- [AI-02] / [AI-03] / [AI-04] — Stage S8 (in /AI Templates filled-in).
- Final_Reflection.md — Stage S8 (300 words English).

## 5. Timeline (relative to Week 1 = course start)

All teams follow the same milestones below — but each team will deliver their live seminar on a different week between Week 7 and Week 11.

- Week 5: topic claim opens; teams form (3–4 SV).
- Week 6: Stage S1 proposal due (Sat 23:59).
- Week 6 mid: Stage S2 approval issued.
- Weeks 6–10: S3 study + S4 documenting + S5 pre-share.
- Weeks 7–11: live seminars (1–2 topics per week, scheduled by instructor).
- Within 5 working days after live seminar: Stage S8 submission.

## 6. Rubric — 20% of final grade (PRJ-SM)

Total weights below sum to 100% of the Seminar component (which itself is 20% of the course grade).

| Criterion | Weight | What we look for |
| --- | --- | --- |
| Tool survey + proposal | 10% | Quality of comparison; rationale for the AI-augmented pick; cost & licence awareness |
| Depth of study | 15% | Architectural understanding; correct vocabulary; coverage of edge cases & limits |
| User-guide document | 20% | Markdown clarity; reproducible steps; troubleshooting; references; AI-disclosure |
| Live demo on EShop | 15% | Demo runs end-to-end without scripted help; realistic scenario; AI add-on shown |
| In-class hands-on activity | 20% | Activity is feasible in 15–25 min; audience can replicate; rubric for peers prepared |
| Q&A + facilitation | 10% | Accurate answers; humility; ability to redirect off-topic questions |
| AI Audit + Disclosure + Reflection | 10% | [AI-02] complete (5 sections); [AI-03] signed; [AI-04] 300-word reflection |

Audience attendance — each team must attend at least 8 of the 10 live seminars and submit a 1-minute paper each time. Missing more than 2 seminars caps the team's Seminar component at 70%.

## 7. AI Policy for the Seminar

The Seminar Track sits in AI Use Category 5 — AI-Integrated Work. Teams may use any AI tool of their choice (e.g., ChatGPT, Claude, Gemini, Copilot, Cursor). The Department does not provide paid AI accounts; teams are responsible for their own tooling.
**Mandatory rules:**

- Every AI-generated artefact must be reviewed and edited by a human before submission. Direct copy-paste without editing = academic violation.
- Every public statement (slide, screencast claim, factual answer) must be verifiable. Cite the original source, not the AI.
- Disclose tool, prompt summary, and outcome in [AI-02]. Do not paste private keys, student IDs, or course-secret content into AI tools.
- Do not use AI to fabricate audience feedback or attendance.

## 8. Peer Review across Teams

Each team is assigned 2 peer-review partners. After their seminar they review the partners' user guide + screencast and submit a Peer_Review.md. The goal — as with software testing itself — is constructive critique, not praise. A peer review of the form 'great work, nothing to add' will not earn credit.

- ≥ 3 concrete strengths.
- ≥ 3 concrete suggestions for improvement, each anchored in a section of the guide.
- 1 question that the audience would likely ask and how the team would answer it.

## 9. Contact

For questions, the Moodle discussion forum is the first stop. For escalations:

- Dr. Lâm Quang Vũ — <lqvu@fit.hcmus.edu.vn> (course owner)
- Mrs. Trần Thị Bích Hạnh — <ttbhanh@fit.hcmus.edu.vn> (lab + EShop)
- TA team — see Moodle for assignments per topic.

---

> *— End of Seminar Guide —*
