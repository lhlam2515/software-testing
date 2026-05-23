---
title: "T08 — Database Testing"
source: "Courses/CSC13003 — SOFTWARE TESTING - ST4 - EN/Seminars/Topic-Descriptions/T08_Database_Testing.docx"
course: CSC13003 Software Testing
topic: T08
tags: [software-testing, seminar, database-testing, dbunit, liquibase, tsqlt]
---

*2026 AI-First - CS423/CSC15003 Software Testing - Seminar Track*

# T08 - Database Testing

> *The DB is the last source of truth. Test schema, data quality, migrations — and let AI mask the PII.*

## 1. Overview

EShop uses SQLite for HW convenience; in industry it might be Postgres or SQL Server. Database testing covers schema correctness, migration safety, query performance, referential integrity, and data masking for non-prod. You'll exercise DbUnit (or its modern alternatives) and experiment with AI-assisted data-masking tools.

## 2. Learning Objectives

By the end of this seminar each team member must be able to:

- Seed EShop with deterministic fixture data; assert schema invariants.
- Write 5 SQL-based test cases (e.g., orphan rows, NOT NULL violations, unique index).
- Run a Liquibase or Flyway migration safely; rollback test.
- Mask the data using an AI tool (e.g., Tonic AI, Synthesised, ChatGPT-assisted faker).
- Verify masked data still passes functional tests.

## 3. Traditional Tools - pick one as your main

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| DbUnit (Java) | JUnit-friendly XML/YAML fixtures. |
| Liquibase / Flyway | Version-controlled migrations; rollback support. |
| tSQLt | Unit testing inside SQL Server. |
| pgTAP | PostgreSQL-native test framework. |

## 4. AI-Augmented Direction - pick at least one

Demonstrating an AI angle is mandatory. The Department does not provide paid AI accounts; free tiers and student trials are allowed.

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| Tonic.ai | AI-driven realistic synthetic data + masking. |
| Synthesized.io | Differential-privacy + ML data generation. |
| ChatGPT-assisted faker scripts | Generate domain-aware faker rules; audit distributions. |

## 5. Reading List

- Bauer & Adams — 'Refactoring Databases'.
- Microsoft tSQLt tutorial.
- OWASP — 'Test Data Management' guidelines (PII).

## 6. Study Milestones (Stage S3 internal checklist)

1. Reset EShop SQLite; load seed via fixture file.
2. Write 5 SQL invariants; run them as a Jest/Python test.
3. Create a Flyway migration that renames a column; run + rollback.
4. Mask the users.email + users.phone columns; verify search-by-email still works for tests.

## 7. In-class Activity - for the audience teams

**Title: Spot-the-PII Game**
Audience teams scan a sample dump from EShop staging and flag every column or value that leaks identity, then propose a masking rule for each.

| Time | Step |
| --- | --- |
| 0:00–0:03 | Facilitator distributes a CSV (anonymised already; pretend it's not). |
| 0:03–0:13 | Teams flag PII columns; propose mask rules (hash, faker, format-preserving). |
| 0:13–0:18 | Compare with an AI suggestion; identify items the AI missed (free-text columns). |
| 0:18–0:22 | Debate: format-preserving vs synthetic — which would break which test? |
| 0:22–0:25 | Each team writes one rule on the board. |

**Audience takeaways:**

- Free-text columns leak more PII than structured columns and AI often misses them.
- Format-preserving masking keeps integration tests green but may keep distribution info.
- Schema-aware data generation > naive faker for representative test data.

## 8. Deliverables

- Tool_Survey_Proposal.md - submitted in Stage S1.
- User_Guide.md (>= 6 sections) - submitted in Stage S4.
- Demo_Screencast.mp4 (5-8 min) - submitted in Stage S4.
- Activity_Worksheet.md for 'Spot-the-PII Game' - submitted in Stage S5.
- Seminar_Slides.pptx (<= 15 slides) - submitted in Stage S6.
- [AI-02] / [AI-03] / [AI-04] - submitted in Stage S8.

## 9. Topic-Specific Grading Notes

Generic rubric is in Seminar_Guide.docx Section 6. Topic-specific additions:

- Live demo MUST exercise at least one feature from the traditional tool AND one from the AI tool.
- User guide MUST include a 'failure modes' section listing 3 real ways the tool can mislead users.
- Activity worksheet MUST be reproducible by a peer team in <= 25 minutes without your help.

---

> *-- End of T08 brief --*
