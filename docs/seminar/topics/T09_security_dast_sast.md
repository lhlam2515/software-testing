---
title: "T09 — Security Testing (DAST/SAST)"
source: "Courses/CSC13003 — SOFTWARE TESTING - ST4 - EN/Seminars/Topic-Descriptions/T09_Security_Testing_(DAST_-_SAST).docx"
course: CSC13003 Software Testing
topic: T09
tags: [software-testing, seminar, security-testing, dast, sast, owasp-zap, burp-suite, semgrep]
---

*2026 AI-First - CS423/CSC15003 Software Testing - Seminar Track*

# T09 - Security Testing (DAST / SAST)

> *Find the bug before an attacker does — classical scanners + AI fuzzers and triage.*

## 1. Overview

EShop deliberately ships with weak surfaces (SQL injection patterns, weak hashing, OTP echoed in test). You'll run ZAP and Burp against the running stack, run Semgrep across the source, and experiment with an AI-assisted triage tool that reduces false positives. The bar: not just to scan but to write reproducible exploits for at least two findings.

## 2. Learning Objectives

By the end of this seminar each team member must be able to:

- Run an OWASP ZAP baseline scan against EShop and triage the report.
- Configure Semgrep with OWASP Top-10 ruleset on the EShop repo.
- Reproduce two real findings as test cases (SQLi or XSS or weak auth).
- Use AI tools to draft a proof-of-concept exploit and a fix — audit both.
- Discuss the responsibility line: tester vs developer vs SOC.

## 3. Traditional Tools - pick one as your main

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| OWASP ZAP | Open-source DAST; spider + active scanner. |
| Burp Suite Community | DAST + manual proxy; industry-standard intercept. |
| Semgrep | Lightweight SAST with Python-friendly rules. |
| nuclei | Template-based vulnerability scanner — community templates. |

## 4. AI-Augmented Direction - pick at least one

Demonstrating an AI angle is mandatory. The Department does not provide paid AI accounts; free tiers and student trials are allowed.

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| Semgrep Pro AI | Auto-triage of findings + secondary scan. |
| Snyk DeepCode AI | ML-driven SAST; auto-fix suggestions. |
| ChatGPT / Claude for exploit drafting | Provide vulnerability description; ask for PoC. Always confirm against real EShop response. |

## 5. Reading List

- OWASP Testing Guide v4.2 (selected chapters).
- Andrew Hoffman — 'Web Application Security' (Chs. 3 + 7).
- Semgrep documentation — 'Custom rules quick start'.

## 6. Study Milestones (Stage S3 internal checklist)

1. Run ZAP baseline against EShop; collect alert counts.
2. Run Semgrep with p/owasp-top-ten ruleset; classify findings.
3. Manually reproduce one SQLi or stored-XSS finding (PoC + fix).
4. Compare AI fix suggestion vs the actual code fix.

## 7. In-class Activity - for the audience teams

**Title: False-Positive Triage Sprint**
Audience teams classify 12 mixed SAST findings as 'real', 'false positive', or 'need more info'.

| Time | Step |
| --- | --- |
| 0:00–0:03 | Facilitator distributes finding cards (Semgrep output + 2 lines of code). |
| 0:03–0:13 | Teams classify; provide a 1-line justification each. |
| 0:13–0:18 | Reveal answer key with reproducer. |
| 0:18–0:23 | Discuss which AI tool would have classified each fastest. |
| 0:23–0:25 | Each team writes one heuristic for spotting false positives. |

**Audience takeaways:**

- False-positive rate is the single biggest cost in security testing.
- AI triage adds value mostly above 100 findings — small scans don't need it.
- Always pair a static finding with a reproducible PoC before raising.

## 8. Deliverables

- Tool_Survey_Proposal.md - submitted in Stage S1.
- User_Guide.md (>= 6 sections) - submitted in Stage S4.
- Demo_Screencast.mp4 (5-8 min) - submitted in Stage S4.
- Activity_Worksheet.md for 'False-Positive Triage Sprint' - submitted in Stage S5.
- Seminar_Slides.pptx (<= 15 slides) - submitted in Stage S6.
- [AI-02] / [AI-03] / [AI-04] - submitted in Stage S8.

## 9. Topic-Specific Grading Notes

Generic rubric is in Seminar_Guide.docx Section 6. Topic-specific additions:

- Live demo MUST exercise at least one feature from the traditional tool AND one from the AI tool.
- User guide MUST include a 'failure modes' section listing 3 real ways the tool can mislead users.
- Activity worksheet MUST be reproducible by a peer team in <= 25 minutes without your help.

---

> *-- End of T09 brief --*
