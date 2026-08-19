# Main Report - HW06

## 1. Student Information

| Field | Value |
| ----- | ----- |
| Student name | Le Hoang Lam |
| Student ID | 23127216 |
| Class / Cohort | 23KTPM1 |
| GitHub repository | [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing) |
| Assignment ID | HW#06 |
| Assignment date | 2026-08-19 |
| AI tool(s) used | Claude Code (Claude Sonnet 5) |

## 2. Selected APIs

| Pool | API | Endpoint | Rationale |
| ---- | --- | -------- | --------- |
| Pool A | FR-02 Login & Account Lockout | `POST /api/login` | High security surface (SEC-01, SEC-02, SEC-05: password hashing, JWT issuance, SQL injection risk on credential check) combined with a stateful lockout counter (3 consecutive failures triggers a 30-second lock per SRS section FR-02). Covers both domain partition (email/password format) and state transition (fail counter, lock/unlock) coverage groups required by REQUIREMENTS.md section 6. |
| Pool B | FR-08 Checkout | `POST /api/checkout` | Converts cart state into an order, exercising business-rule validation (`total_amount`, `shipping_address`) and cross-user IDOR risk (a token from user A must not be able to checkout on behalf of user B's cart). Produces a clear oracle: a created order record with a verifiable state. |
| Pool C | FR-15 Product Management (Admin CRUD) | `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` | Independent domain from Pool B (no order-state overlap), so the three APIs cover distinct FRs without duplicating coverage. Full CRUD surface gives broad domain-partition coverage (price, category_id, name/description length) plus a direct SEC-03/SEC-06 role-escalation and IDOR target: only `role = 'admin'` may call these endpoints. |

### 2.1 Coverage and Evidence Mapping

This subsection maps each selected API to its specification source and the four mandatory coverage groups from REQUIREMENTS.md section 6, item 1 (domain partition, state transition, security, schema validation). No test cases exist yet at this stage (W2); this is the scope plan that T4/T5/T6 (generate) will follow. Full detail lives in `artifacts/test-cases/README.md`.

| API | Spec source | Domain partition | State transition | Security (SEC-01-07) | Schema validation |
| --- | --- | --- | --- | --- | --- |
| FR-02 Login | `api_specification.md` 1.2; `srs.md` FR-02 | email format, password presence/case-sensitivity | fail counter (0 to 3), lock (30s) to unlock | SEC-01 (no plaintext password echo), SEC-02 (JWT issuance), SEC-05 (SQLi via email/password field) | 200 response shape (`token`, `user`); error response shape on lockout |
| FR-08 Checkout | `api_specification.md` 4.3; `srs.md` FR-07 to FR-08 | `shipping_address` presence/length; empty-cart case | cart to order transition (cart cleared after success); no-cart / already-checked-out edge | SEC-02 (auth required), IDOR (checkout must use the token owner's own cart, not a client-supplied user id), server must recompute `total_amount` and ignore the client-sent value | 200/201 response shape of the created order; rejection shape when `total_amount` is spoofed |
| FR-15 Product CRUD | `api_specification.md` 3.3; `srs.md` FR-12, FR-15 | `name` (required, <= 255 chars), `price` (required, > 0), `category_id` (required, must exist) | none intrinsic to the resource; cross-check: edit of one product must not mutate others (FR-15 isolation rule) | SEC-02 (JWT required), SEC-03 (role must be `'admin'` in token, not just token presence), SEC-06 (role not client-settable) | 200/201 response shape on create/update; 404 shape on delete of non-existent id |

### 2.2 Evidence Location Plan

| Pipeline stage | Evidence location |
| --- | --- |
| Generate (AI cases) | `artifacts/test-cases/` (workbook + Markdown summary); `prompt_log.md` |
| Audit (labels/reasoning) | `artifacts/test-cases/`; `[AI-02]_AI_Audit_Report.md` |
| Extend (student cases) | `artifacts/test-cases/` |
| Execute (Postman/Newman) | `artifacts/postman/`; `artifacts/newman/` |
| Bugs | `BUG_REPORT.md`; GitHub Issues; `assets/` (screenshots) |

## 3. API 1 - FR-02 Login & Account Lockout (Pool A)

### 3.1 Generate with AI

_TBD_

> Document the step-by-step AI generation process and required coverage from REQUIREMENTS.md section 6, item 1.

### 3.2 Audit

_TBD_

> Record the human VALID / INVALID / INCOMPLETE review, reasoning, and corrections required by section 6, item 2.

### 3.3 Extend

_TBD_

> Add the student-designed cases missed by AI and explain the omissions as required by section 6, item 3.

### 3.4 Execute

_TBD_

> Document Postman and Newman execution, required student header, and evidence from section 6, item 4.

### 3.5 Bugs Found

_TBD_

> Report genuine bugs, including bugs missed by AI, with Markdown and GitHub Issues evidence as required by section 6, item 5.

## 4. API 2 - FR-08 Checkout (Pool B)

### 4.1 Generate with AI

_TBD_

> Document the step-by-step AI generation process and required coverage from REQUIREMENTS.md section 6, item 1.

### 4.2 Audit

_TBD_

> Record the human VALID / INVALID / INCOMPLETE review, reasoning, and corrections required by section 6, item 2.

### 4.3 Extend

_TBD_

> Add the student-designed cases missed by AI and explain the omissions as required by section 6, item 3.

### 4.4 Execute

_TBD_

> Document Postman and Newman execution, required student header, and evidence from section 6, item 4.

### 4.5 Bugs Found

_TBD_

> Report genuine bugs, including bugs missed by AI, with Markdown and GitHub Issues evidence as required by section 6, item 5.

## 5. API 3 - FR-15 Product Management (Admin CRUD) (Pool C)

### 5.1 Generate with AI

_TBD_

> Document the step-by-step AI generation process and required coverage from REQUIREMENTS.md section 6, item 1.

### 5.2 Audit

_TBD_

> Record the human VALID / INVALID / INCOMPLETE review, reasoning, and corrections required by section 6, item 2.

### 5.3 Extend

_TBD_

> Add the student-designed cases missed by AI and explain the omissions as required by section 6, item 3.

### 5.4 Execute

_TBD_

> Document Postman and Newman execution, required student header, and evidence from section 6, item 4.

### 5.5 Bugs Found

_TBD_

> Report genuine bugs, including bugs missed by AI, with Markdown and GitHub Issues evidence as required by section 6, item 5.

## 6. Postman Features Used

> List the Postman features you used, as required by REQUIREMENTS.md section 6.

| Feature | Description | API Applied To |
| ------- | ----------- | -------------- |
| _TBD_ | _TBD_ | _TBD_ |

## 7. CI/CD Report

### 7.1 Pipeline Configuration

_TBD_

### 7.2 Sample Commit: All Tests Passing

_TBD_

### 7.3 Sample Commit: One Test Failing

_TBD_

> Describe the pipeline and provide screenshots and links for both required sample runs from REQUIREMENTS.md section 6.

## 8. Agent Skill - AI-driven API Test Generator

### 8.1 Self-drawn Diagram

_TBD_

### 8.2 Pseudocode

_TBD_

> Provide the design diagram and pseudocode required by section 7. Under section 11, the diagram must reflect the student's own design decisions and must not be AI-generated.

## 9. AI Critique (200-300 words)

_TBD_

> Address the mandatory questions in REQUIREMENTS.md section 10: where the AI was wrong, biased, or incomplete; why it failed to catch the issue; and what principle was learned about collaborating with AI.
