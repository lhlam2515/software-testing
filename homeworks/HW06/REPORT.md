# Main Report - HW06

## 1. Student Information

| Field | Value |
| ----- | ----- |
| Student name | Lê Hoàng Lâm |
| Student ID | 23127216 |
| Class / Cohort | 23KTPM1 |
| GitHub repository | [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing) |
| Assignment ID | HW#06 |
| Assignment date | 2026-08-25 |
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

- Skill: `api-test-generator`, 7-stage prompt (contract extraction, EP/BVA catalog, state model, security cases, schema cases, master suite consolidation, data-driven inputs) — `prompt_log.md` Entry 001, `2026-08-20T18:34:57+07:00`
- Sources: `api_specification.md` 1.2 (contract), `srs.md` FR-02 (requirement)
- Coverage groups targeted: domain partition (`email`/`password`), state transition (fail counter + 30s lockout), security (SEC-01/02/05), `200` response schema
- Rule enforced: undocumented constraints recorded as UNSPECIFIED, never invented
- Output: 35 cases (TC-01..TC-35), meets `>= 35` threshold — EP=12, BVA=3, State/Lifecycle=5, Security=7, Schema=8 (`master-test-cases.md` Coverage Gate)
- No padding: combination rows (TC-12, TC-20, TC-28/29/31) each assert a distinct oracle

| Coverage group | Result |
| --- | --- |
| Domain partition | 12/12 EC classes on `email` (EC-01..07) and `password` (EC-08..12) instantiated (TC-01..TC-12) |
| State transition | 9/9 transitions (TR-01..TR-09) covered; TR-05/06/09 resolve to UNSPECIFIED finish state; +3-value BVA on lock TTL (TC-13..TC-15) |
| Security | 3/7 applicable SEC ids (SEC-01, SEC-02, SEC-05); SEC-03/04/06/07 non-applicable, reason in `specs/security-requirement.md` |
| Schema validation | 1/1 documented variant (`200`); `400`/`401`/`423` undocumented, exercised for non-crash checks only |

### 3.2 Audit

- Skill: `api-test-auditor`, oracle = `srs.md` FR-02 + section 9 (SEC-01/02/05), not the generator's own catalogs — `prompt_log.md` Entry 002
- Result (`audit/audit-log.md`): **29 VALID, 1 INVALID, 5 INCOMPLETE**, total 35
- Corrections applied only in `audit/audited-master-test-cases.md`; `master-test-cases.md` left unmodified

| TC | Label | Defect | Fix |
| --- | --- | --- | --- |
| TC-19 | INVALID | Trace cited TR-05+TR-06, but precondition (counter=1, S1) only reaches TR-05 — Coverage Gate's "9/9 TR" claim was false (8/9 actual) | Trace narrowed to TR-05; TR-06 closed by new case TC-36 |
| TC-01 | INCOMPLETE | Trace cites SC-01..SC-07 but Oracle never asserts `Content-Type` | Added `Content-Type: application/json` assertion |
| TC-12 | INCOMPLETE | Invented constraint not stated in `srs.md` | Reworded to record, not assert, comparison vs TC-05/TC-09 |
| TC-20 | INCOMPLETE | Assumed counter resets to 0 post-unlock, contradicting TR-09 UNSPECIFIED note | Reworded to record which attempt re-triggers lock |
| TC-21, TC-23 | INCOMPLETE | Omitted "unlocked, counter=0" precondition, contradicted by TC-20 leaving the shared account locked | Added explicit reset/wait precondition |

### 3.3 Extend

Extend step of the same `api-test-auditor` skill run. 6 cases added (TC-36..TC-41), full detail in `audit/extended-test-cases.md`:

| TC ID | Technique | What it covers | Miss category | Why the AI missed it |
| --- | --- | --- | --- | --- |
| TC-36 | State | Closes the TR-06 gap left by invalid TC-19 (success from S2, counter=2) | Model limitation | The cross-document connection between `state-model.md`'s TR-06 precondition and TC-19's own precondition field was never checked |
| TC-37 | EP | Same no-password-leak invariant instantiated for the admin account, not only the customer account | Prompt quality | Principal/role was never treated as its own equivalence dimension despite `srs.md` section 1 documenting two distinct default accounts |
| TC-38 | State (functional) | An issued token must actually be accepted by a protected endpoint (`GET /api/users/me`), not only be structurally valid | Model limitation | SEC-C-03 stopped at structural JWT parsing and never followed the cross-source link to `srs.md` FR-02 line 43 |
| TC-39 | State (cross-account isolation) | A locked `test@eshop.com` must not block a different, unlocked account (`admin@eshop.com`) from logging in | API characteristic | `state-model.md`'s Notes flagged lock scope as undocumented but never tested the one reading ("tài khoản" = the specific account) the SRS wording itself supports |
| TC-40 | Security (concurrency) | 3 concurrent wrong-password attempts must still reach LOCKED with no lost update | API characteristic | All 5 generated catalogs model single sequential requests only; none consider the counter's read-modify-write logic as a race-condition surface |
| TC-41 | Schema | `email=null` as a third wrong-JSON-type facet, distinct from empty string (TC-05) and omitted key (TC-06) | Prompt quality | `schema-cases.md`'s own scope note enumerates only two wrong-type facets (number, array); `null` was left out |

### 3.4 Execute

- Collection: `artifacts/postman/fr-02-login/` — 42 `tc_id` rows (TC-01..TC-41, TC-38 split into TC-38a/TC-38b) against `http://localhost:3000`

```
newman run collection.postman_collection.json -e environment.postman_environment.json \
  -d test-data.csv --env-var "studentId=23127216" --reporters cli,json,html \
  --reporter-json-export reports/newman-report.json --reporter-html-export reports/newman-report.html
```

- Run: `reports/run-cycle.json`, started `2026-08-22T08:27:13.270Z`, Newman `6.2.2`, exit code `1` (assertion failures, not transport errors)
- Anti-cheat: `X-Student-Id: 23127216` on every request (collection pre-request script); proof in `reports/newman-report.json` (recorded request header + `localhost:3000` target, REQUIREMENTS.md section 11)
- Outcome (`reports/test-execution.md`): **65/65 requests completed**, **185/207 assertions passed**, **22 Newman-reported failures**
- Full per-`tc_id` breakdown: `reports/test-execution.md`, `reports/newman-report.json`, `reports/newman-report.html`

### 3.5 Bugs Found

4 genuine bugs confirmed for `POST /api/login` (`BUG_REPORT.md`):

| Bug ID | Severity | Found by | Issue | Summary |
| --- | --- | --- | --- | --- |
| BUG-FR02-01 | Medium | Beyond AI | [#44](https://github.com/lhlam2515/software-testing/issues/44) | Failed-login counter increments by 2 per attempt, locking the account after 2 failures instead of the documented 3 |
| BUG-FR02-02 | Medium | AI | [#45](https://github.com/lhlam2515/software-testing/issues/45) | Account lockout lasts 180 seconds instead of the documented 30-second window |
| BUG-FR02-03 | Critical | AI | [#46](https://github.com/lhlam2515/software-testing/issues/46) | Successful login responses leak the user's plaintext password in the `user` object |
| BUG-FR02-04 | High | AI | [#47](https://github.com/lhlam2515/software-testing/issues/47) | Malformed JSON / missing `Content-Type` crashes login with a raw HTML stack trace instead of a structured error |

## 4. API 2 - FR-08 Checkout (Pool B)

### 4.1 Generate with AI

- Skill: `api-test-generator`, same 7-stage process as FR-02, endpoint-specific prompt — `prompt_log.md` Entry 003, `2026-08-20T21:07:13+07:00`
- Sources: `api_specification.md` 4.3 (contract), `srs.md` FR-07 to FR-08 (requirement)
- Coverage groups targeted: domain partition (`shipping_address`/cart state), cart-to-order lifecycle, security (SEC-02, IDOR, server-side `total_amount` recompute), created-order/error response shapes
- Rules enforced: cart-to-order behavior classified as lifecycle adaptation (no explicit state machine documented); undocumented constraints = UNSPECIFIED
- Output: 35 cases (TC-01..TC-35) — EP=13, BVA=2, State/Lifecycle=5, Security=8, Schema=7 (`master-test-cases.md` Coverage Gate)
- No padding: same-request pairs (TC-07/26/30, TC-11/21, TC-12/22, TC-14/31, TC-02/35) each assert a distinct oracle, disclosed in the suite's Coverage Gate

| Coverage group | Result |
| --- | --- |
| Domain partition | 14/14 EC classes on `shipping_address` (EC-01..06), `total_amount` (EC-07..11), `Authorization` header (EC-12..14) (TC-01..TC-13); cart-count boundary (BVA-01/02) in TC-14/TC-15 |
| State transition | Lifecycle adaptation, not a state machine (spec documents only one transition); 5/5 lifecycle scenarios (S-01..S-05) covered |
| Security | 8/8 applicable ids/extensions: SEC-02, IDOR extension, server-recompute extension, SEC-05 |
| Schema validation | 0/0 documented response variants — spec gap, not a coverage shortfall; all 12 `SC-*` ids traced to TC-29..TC-35 |

### 4.2 Audit

- Skill: `api-test-auditor`, oracle = `srs.md` (FR-07/FR-08/FR-10/FR-11, section 9) + `api_specification.md`, not the generator's own catalogs, every cited line re-verified — `prompt_log.md` Entry 004
- Result (`audit/audit-log.md`): **33 VALID, 0 INVALID, 2 INCOMPLETE**, total 35
- 0-INVALID: all line-level citations verified correct, no unsupported/contradicted claims
- Corrections applied only in `audit/audited-master-test-cases.md`; `master-test-cases.md` left unmodified

| TC | Label | Defect | Fix |
| --- | --- | --- | --- |
| TC-17, TC-18 | INCOMPLETE | Expected result names 3 possible outcomes for repeat/empty-cart checkout, but Oracle (status+body) can't distinguish "empty order" from silent no-op (body shape is UNSPECIFIED per SC-03) | Added "compare order count via `GET /api/orders/my-orders` before/after" to Oracle |

### 4.3 Extend

Extend step of the same `api-test-auditor` skill run. 6 cases added (TC-36..TC-41), full detail in `audit/extended-test-cases.md`:

| TC ID | Technique | What it covers | Miss category | Why the AI missed it |
| --- | --- | --- | --- | --- |
| TC-36 | Security (EP) | The "wrong-scheme value" sub-variant of a malformed `Authorization` header (raw token with no `Bearer` prefix; `Basic` scheme) | Prompt quality | `domain-partition-catalog.md` P-14 itself named three EC-14 sub-variants, but only the "garbage string" member (TC-12/TC-22) was ever instantiated into a case |
| TC-37 | Schema | Side-effect check (no order created, cart unchanged) for the `shipping_address`/`total_amount` validation-error family (TC-02..TC-10, TC-13), not only the empty-cart case | Model limitation | `schema-cases.md`'s SC-08 scope statement names both families, but the generator only wired SC-08 to the empty-cart case (TC-31) when assembling the master suite |
| TC-38 | Schema/Lifecycle | `GET /api/orders/my-orders` as a direct existence/count oracle confirming the plain happy-path checkout (TC-01/TC-16) actually persisted an order | Model limitation | None of the four catalogs ever used this endpoint as a general-purpose success oracle; it was only wired to inspect one field (the recomputed total) for the tampered-amount case |
| TC-39 | Security | Read-path (`GET /api/orders/my-orders`) cross-user order-visibility isolation, mirroring the write-path IDOR check already covered on checkout itself | Model limitation | Cross-user isolation was modeled only on the write path (SEC-C-05); the equivalent read-side rule in `srs.md` FR-11 line 164 was never connected to FR-08's checkout-creates-an-order behavior |
| TC-40 | Schema | Server-side recompute rule extended to the negative/zero `total_amount` class (TC-09), not only the tampered-positive class (TC-07/TC-26) | Model limitation | The companion recompute-verification row pattern (TC-30) was applied only to the positive-tampered class, even though `srs.md` FR-08 line 107's recompute rule is unconditional on the submitted value's class |
| TC-41 | Schema | An incorrect (not merely missing) `Content-Type` value (`text/plain`), completing the three-way missing/correct/incorrect split | Prompt quality | `schema-cases.md` SC-11 and its instantiation (TC-34) covered only the "header entirely omitted" member of the Content-Type dimension |

### 4.4 Execute

- Collection: `artifacts/postman/fr-08-checkout/` — 2 items (fixture provisioning two accounts + order-count baseline, and the data-driven checkout request covering 42 `tc_id` rows, TC-01..TC-41 with TC-36 split into TC-36a/TC-36b) against the local backend

```
newman run collection.postman_collection.json -e environment.postman_environment.json \
  -d test-data.csv --env-var "studentId=23127216" --reporters cli,json,html \
  --reporter-json-export reports/newman-report.json --reporter-html-export reports/newman-report.html
```

- Run: `reports/run-cycle.json`, started `2026-08-22T08:42:43.086Z`, Newman `6.2.2`, exit code `1`
- Anti-cheat: `X-Student-Id: 23127216` on every request; proof in `reports/newman-report.json` (recorded request header + `localhost:3000` target)
- Outcome (`reports/test-execution.md`): **222/222 requests completed**, **89/95 assertions passed**, **6 Newman-reported failures** (TC-16, TC-31, TC-33, TC-34, TC-37, TC-41)
- Full breakdown: `reports/test-execution.md`, `reports/newman-report.json`, `reports/newman-report.html`

### 4.5 Bugs Found

4 genuine bugs confirmed for `POST /api/checkout` (`BUG_REPORT.md`):

| Bug ID | Severity | Found by | Issue | Summary |
| --- | --- | --- | --- | --- |
| BUG-FR08-01 | High | Beyond AI | [#48](https://github.com/lhlam2515/software-testing/issues/48) | Checkout accepts an empty `shipping_address` and still creates an order |
| BUG-FR08-02 | High | AI | [#49](https://github.com/lhlam2515/software-testing/issues/49) | Checkout on an empty cart still creates a pending order with `total_amount` 0 |
| BUG-FR08-03 | High | AI | [#50](https://github.com/lhlam2515/software-testing/issues/50) | A successful checkout does not clear the user's cart |
| BUG-FR08-04 | High | AI | [#51](https://github.com/lhlam2515/software-testing/issues/51) | Malformed JSON / non-JSON `Content-Type` crashes checkout with a raw HTML stack trace instead of a structured error |

## 5. API 3 - FR-15 Product Management (Admin CRUD) (Pool C)

### 5.1 Generate with AI

- Skill: `api-test-generator`, 7-stage process, endpoint-group prompt covering all 3 CRUD ops as one traceable suite (single `TC ID` sequence) — `prompt_log.md` Entry 005, `2026-08-20T21:47:24+07:00`
- Sources: `api_specification.md` 3.3 (contract), `srs.md` FR-12, FR-15 (requirement)
- Coverage groups targeted: domain partition (`name`/`price`/`category_id`), resource-lifecycle/isolation (edit isolation; delete of non-existent id), security (SEC-02 JWT, SEC-03 admin-role, SEC-06 role not client-settable, IDOR/role-escalation), create/update/404 response shapes
- Rule enforced: isolation coverage labeled lifecycle adaptation, not state-transition, to avoid overstating the coverage-gate claim
- Output: 43 cases (TC-01..TC-43), exceeds 35 threshold — EP=13, BVA=6, State/Lifecycle=5, Security=12, Schema=7 (`master-test-cases.md` Coverage Gate)
- TC-18/TC-19 are the only `PUT`-side re-verifications of a `POST`-tested rule (BVA-05, EC-08), included because `srs.md` states the add/edit constraints jointly and `PUT` may run a different code path; each asserts an isolation oracle the `POST` rows don't

| Coverage group | Result |
| --- | --- |
| Domain partition | 17/17 EC/BVA classes on `name`, `price`, `category_id`, `description`, `imageUrl`, path `id` (TC-01..TC-19, TC-20/21, TC-22/23) |
| State/isolation | Lifecycle adaptation, no explicit state table; 5/5 lifecycle scenarios (S-01..S-05) covered |
| Security | 12/12 applicable ids/extensions: SEC-02, SEC-03 incl. IDOR/role-escalation, SEC-05, SEC-06 extended |
| Schema validation | 8/8 documented response-variant slots (POST/PUT/DELETE); all 9 `SC-*` ids traced to TC-37..TC-43, 4 composite with lifecycle/security oracles (spec has no response example) |

### 5.2 Audit

- Skill: `api-test-auditor`, oracle = `srs.md` (FR-12, FR-14, FR-15, section 9) + `api_specification.md` 3.1-3.4, not the generator's own catalogs, every cited line re-verified — `prompt_log.md` Entry 006
- Result (`audit/audit-log.md`): **34 VALID, 0 INVALID, 9 INCOMPLETE**, total 43
- Corrections live only in `audit/audited-master-test-cases.md`; `master-test-cases.md` left unmodified. Extended cases (5.3, TC-44..TC-48) folded into the same file, making TC-01..TC-48 the final execution-ready suite

| TC | Label | Defect | Fix |
| --- | --- | --- | --- |
| TC-05 | Content | Mis-hedged: `srs.md` line 195's 255-char max is inclusive, but TC-05 treated exactly 255 as UNSPECIFIED while TC-04 (254)/TC-06 (256) were treated as certain | Expected result changed to "Accepted, 255 is the inclusive maximum" |
| TC-18 | Content | Mislabeled "EP (operation-scoped)" but trace/input (BVA-05, `price=0`) is a boundary-value re-verification | Relabeled "BVA (operation-scoped)"; suite tally shifts to EP=12/BVA=7 |
| TC-37..TC-43 | Structural | Entire Schema group (7 rows) missing the `Oracle` column, content conflated into `Expected result` | Split conflated text into distinct `Expected result` + new `Oracle` column, all 7 rows |

### 5.3 Extend

Extend step of the same `api-test-auditor` skill run. 5 cases added (TC-44..TC-48), prioritized toward security/state per the assignment's direction: 2 security, 1 cross-FR lifecycle, 2 domain-partition. Full detail in `audit/extended-test-cases.md`:

| TC ID | Technique | What it covers | Miss category | Why the AI missed it |
| --- | --- | --- | --- | --- |
| TC-44 | Security | A JWT with a well-formed `role='admin'` claim but a tampered/invalid signature must still be rejected, not merely a syntactically invalid or expired-shaped token | Model limitation | `security-cases.md`'s SEC-C-04/05 rows only model token-*shape* defects (garbage string, expired-shaped); connecting "hợp lệ" (valid) in `srs.md` line 177 to cryptographic signature verification was a semantic leap the per-field pass never made |
| TC-45 | Security | SQL injection via the path `:id` segment on `DELETE`, not only via body fields | Prompt quality | `security-cases.md`'s own scope statement restricted SEC-05 rows to persisted free-text body fields (`name`, `description`), a self-imposed restriction the source text does not place on path parameters |
| TC-46 | Lifecycle (cross-FR) | Deleting a category (FR-14) that a product still references (FR-15's `category_id`) is a documented gap in both FRs | Model limitation | The generator modeled `category_id` referential validity only at product create/update time; it never connected FR-14's independent category-delete operation to FR-15's referential constraint on the same field |
| TC-47 | EP (price type) | `price=9.99` (fractional positive value), which `srs.md` line 196's "số dương" (positive number, not "số nguyên"/integer) does not exclude | Model limitation | `domain-partition-catalog.md`'s own BVA-06 row flags this exact ambiguity in prose but the generator never authored a test row with an actual fractional value |
| TC-48 | EP (path id boundary) | `id=0` and `id=-1` on `PUT`, numeric but impossible ids, distinct from the "large non-existent id" class already covered | API characteristic | `domain-partition-catalog.md`'s path-id rows treat "numeric" as one homogeneous class and only vary existence, never partitioning the numeric domain itself at the zero/negative boundary |

### 5.4 Execute

- Collection: `artifacts/postman/fr-15-product-crud/` — 2 items (fixture logging in admin/customer + seeding products A/B/C, and the data-driven CRUD request covering 49 `tc_id` rows, TC-01..TC-48 with TC-48 split into TC-48a/TC-48b) against the local backend

```
newman run collection.postman_collection.json -e environment.postman_environment.json \
  -d test-data.csv --env-var "studentId=23127216" --reporters cli,json,html \
  --reporter-json-export reports/newman-report.json --reporter-html-export reports/newman-report.html
```

- Run: `reports/run-cycle.json`, started `2026-08-22T08:57:40.075Z`, Newman `6.2.2`, exit code `1`
- Anti-cheat: `X-Student-Id: 23127216` on every request; proof in `reports/newman-report.json` (recorded request header + `localhost:3000` target)
- Outcome (`reports/test-execution.md`): **140/140 requests completed**, **123/138 assertions passed**, **15 Newman-reported failures**, incl. a `FIXTURE` failure (8 assertions expecting seeded product fields as strings observed `null`)
- Full breakdown: `reports/test-execution.md`, `reports/newman-report.json`, `reports/newman-report.html`

### 5.5 Bugs Found

3 genuine bugs confirmed for the Product CRUD endpoints (`BUG_REPORT.md`), all Critical severity and all found by the AI-generated cases:

| Bug ID | API | Issue | Summary |
| --- | --- | --- | --- |
| BUG-FR15-01 | `POST /api/products` | [#52](https://github.com/lhlam2515/software-testing/issues/52) | No authentication/authorization middleware at all: no token, an invalid token, a valid non-admin token, or a tampered-signature admin-claim token are all accepted and the product is created |
| BUG-FR15-02 | `PUT /api/products/:id` | [#53](https://github.com/lhlam2515/software-testing/issues/53) | No authentication/authorization middleware: a request with no `Authorization` header still updates the target product |
| BUG-FR15-03 | `DELETE /api/products/:id` | [#54](https://github.com/lhlam2515/software-testing/issues/54) | No authentication/authorization middleware: a request with no `Authorization` header still deletes the target product |

## 6. Postman Features Used

| Feature | Description | API Applied To |
| ------- | ----------- | -------------- |
| Environments | One `.postman_environment.json` per API (`baseUrl`, `studentId` placeholders, no committed credentials); actual values injected at run time via `--env-var` | FR-02, FR-08, FR-15 |
| Collection-level pre-request script | Sets `X-Student-Id` on every outgoing request (including calls made via `pm.sendRequest`) and refuses the run when `studentId` is blank | FR-02, FR-08, FR-15 |
| Request-level pre-request scripts | Build wire-mutated bodies/headers from CSV sentinel columns (`OMIT_KEY`, `RAW_TYPE_NUMBER`, forged/tampered JWTs, etc.), drive multi-step sequences, and capture before/after state snapshots | FR-02, FR-08, FR-15 |
| Test scripts (collection- and request-level) | Collection-level auto-capture of each response (`captured_<tc_id>`) plus per-request assertions named `[<tc_id>][<trace>] <assertion>`, mapping Newman results back to the audited suite | FR-02, FR-08, FR-15 |
| Environment variables (runtime) | `pm.environment.set/get` used for cached auth tokens, captured responses, and order/cart-count snapshots shared across data rows | FR-02, FR-08, FR-15 |
| Data-driven Collection Runner (CSV) | `newman run ... -d test-data.csv`, one row per `tc_id`, run through the CLI equivalent of the Collection Runner | FR-02 (42 rows), FR-08 (42 rows), FR-15 (49 rows) |
| `pm.sendRequest` (chained requests) | Fixture-setup items (account provisioning, admin/customer login, product seeding) and in-script multi-step sequences (e.g. FR-02 TC-16/19/20/40, FR-08 double-submit, FR-15 TC-20/21/24/46) fire auxiliary requests ahead of or instead of the visible one | FR-02, FR-08, FR-15 |
| Newman CLI, multi-reporter export | `--reporters cli,json,html` with `--reporter-json-export`/`--reporter-html-export`, producing the JSON/HTML evidence used for `test-execution.md` | FR-02, FR-08, FR-15 |

Workspaces, monitors, and mock servers were not used: `artifacts/postman/README.md` documents that execution is local and account-free by design (no Postman API key, collection ID, or cloud workspace permission required), and no artifact in this repository references a mock server or a monitor.

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
