---
title: "T06 — API & Contract Testing"
source: "Courses/CSC13003 — SOFTWARE TESTING - ST4 - EN/Seminars/Topic-Descriptions/T06_API_and_Contract_Testing.docx"
course: CSC13003 Software Testing
topic: T06
tags: [software-testing, seminar, api-testing, contract-testing, postman, pact, restassured]
---

*2026 AI-First - CS423/CSC15003 Software Testing - Seminar Track*

# T06 - API & Contract Testing

> *Test the contract — not just the response. AI can read OpenAPI for you, but should it?*

## 1. Overview

EShop exposes a documented Express REST API (see api_specification.md). API testing has classical tools — Postman, RestAssured, Karate — and the AI direction: generating tests directly from an OpenAPI spec, then refining for business logic. Contract testing with Pact ensures provider and consumer agree.

## 2. Learning Objectives

By the end of this seminar each team member must be able to:

- Author a Postman collection covering authentication, products, cart, orders.
- Convert critical scenarios to RestAssured (Java) OR Karate (Gherkin).
- Generate the same test suite from EShop's OpenAPI spec using an AI tool.
- Add one consumer-driven contract test using Pact between mobile and backend.
- Discuss when contract testing complements vs replaces traditional API testing.

## 3. Traditional Tools - pick one as your main

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| Postman | Manual + scripted API testing; collections + monitors. |
| RestAssured (Java) | Java DSL; integrates with JUnit/TestNG. |
| Karate | Gherkin-style; supports REST + GraphQL + WebSocket. |
| Pact | Consumer-driven contract testing; broker-based. |

## 4. AI-Augmented Direction - pick at least one

Demonstrating an AI angle is mandatory. The Department does not provide paid AI accounts; free tiers and student trials are allowed.

> **Note:** Note - the tools listed below are SUGGESTIONS only. The final tool selection is decided JOINTLY by the team and the supervising instructor at Stage S2 (Instructor Review). Teams may add, replace, or drop any tool from this list - provided the choice is justified in the Stage S1 proposal and approved before Stage S3 begins.

| Tool | Why study it |
| --- | --- |
| AI test gen from OpenAPI | Provide the spec; receive a Postman/Karate scaffold. Refine and execute. |
| Postbot (Postman AI) | Inline AI in Postman for assertions and documentation. |
| ChatGPT / Claude for negative tests | Generate adversarial payloads; review against API_RFC and FR-spec. |

## 5. Reading List

- Mark Winteringham — 'API Testing in Action' (Chs. 4 + 9).
- Pact docs — 'Provider verification'.
- EShop /api_specification.md (in repo).

## 6. Study Milestones (Stage S3 internal checklist)

1. Postman collection covering: POST /auth/login, GET /products, POST /cart, POST /orders.
2. Add chained-token auth using collection variables.
3. Generate scaffold from /api_specification.yaml using an AI tool; diff vs your collection.
4. Configure one Pact provider verification on the Node backend.
5. Document 5 contract violations you might encounter.

## 7. In-class Activity - for the audience teams

**Title: Spec-to-Tests Sprint**
Audience teams race to scaffold an API test suite from an OpenAPI snippet — half by hand, half by AI.

| Time | Step |
| --- | --- |
| 0:00–0:03 | Facilitator hands out a 1-endpoint OpenAPI snippet (POST /coupon/redeem). |
| 0:03–0:13 | Half the room writes 5 test cases by hand; the other half via Claude/ChatGPT. |
| 0:13–0:18 | Teams pair up and diff results. |
| 0:18–0:23 | Identify which tests are 'happy-path' only and which probe edge cases. |
| 0:23–0:25 | Each pair states one edge case the AI failed to suggest. |

**Audience takeaways:**

- AI gives high coverage of declared schema but ignores business rules.
- Negative tests on auth, coupon abuse, race conditions still need humans.
- Contract tests catch breaking changes earlier than end-to-end API tests.

## 8. Deliverables

- Tool_Survey_Proposal.md - submitted in Stage S1.
- User_Guide.md (>= 6 sections) - submitted in Stage S4.
- Demo_Screencast.mp4 (5-8 min) - submitted in Stage S4.
- Activity_Worksheet.md for 'Spec-to-Tests Sprint' - submitted in Stage S5.
- Seminar_Slides.pptx (<= 15 slides) - submitted in Stage S6.
- [AI-02] / [AI-03] / [AI-04] - submitted in Stage S8.

## 9. Topic-Specific Grading Notes

Generic rubric is in Seminar_Guide.docx Section 6. Topic-specific additions:

- Live demo MUST exercise at least one feature from the traditional tool AND one from the AI tool.
- User guide MUST include a 'failure modes' section listing 3 real ways the tool can mislead users.
- Activity worksheet MUST be reproducible by a peer team in <= 25 minutes without your help.

---

> *-- End of T06 brief --*
