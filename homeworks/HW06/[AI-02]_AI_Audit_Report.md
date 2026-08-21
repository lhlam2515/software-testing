# AI Audit Report - HW06

## 1. Student Information

| Field | Value |
| --- | --- |
| Student name (printed) | Le Hoang Lam |
| Student ID | 23127216 |
| Class / Cohort | 23KTPM1 |
| Assignment ID | `HW#06` |
| Assignment date | 2026-08-20 |
| AI tool(s) used | Claude Code, Sonnet 5 |
| AI used | [x] Yes [ ] No |

---

## 2. Instructions

Audit every substantial AI-generated artifact used in the submission. Add another artifact block when needed, including for an AI-generated OpenAPI conversion or an implemented Agent Skill.

Each artifact must contain the following five parts:

1. **Prompt + Tool:** identify the tool, model, timestamp, and exact prompt-log entry.
2. **AI Output:** link to or summarize the output without replacing the verbatim prompt log.
3. **Verdict:** mark the artifact VALID, INVALID, or INCOMPLETE.
4. **Reasoning:** justify the verdict using the SUT specification, course material, execution evidence, or another named source.
5. **Student Fix:** record each correction, rejection, or student-added case separately.

---

## 3. Audit

### Artifact #1: API 1 Test-Case Generation and Review [Pool A]

> **Requirement mapping:** REQUIREMENTS.md section 6, items 1-3

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code, Sonnet 5 |
| Date and time | 2026-08-20T19:04:40+07:00 |
| Prompt log entry | Entries 1 and 2: Generate FR-02 Login test cases; Audit FR-02 Login test cases |

**Prompt (verbatim or single-source-of-truth link):** `prompt_log.md`, entries 1 and 2.

#### (2) AI Output

The generator produced 35 cases, with EP=12, BVA=3, State/Lifecycle=5, Security=7, and Schema=8. The audit reviewed all 35 original cases, added TC-36 through TC-41, and produced a 41-case audited suite. Source: `artifacts/test-cases/fr-02-login/master-test-cases.md`, `audit/audit-log.md`, and `audit/audited-master-test-cases.md`.

#### (3) Verdict

- [x] **VALID:** correct and accepted as-is by majority label, 29 of 35 cases.
- [ ] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- The [FR-02 audit log](artifacts/test-cases/fr-02-login/audit/audit-log.md) records 29 VALID, 1 INVALID, and 5 INCOMPLETE among the 35 generated cases. The overall VALID verdict is therefore a majority verdict, not a claim that the suite was accepted unchanged.
- TC-19 is INVALID because its own precondition reaches S1, counter=1, while TR-06 requires S2, counter=2. Changing only its expected result cannot make that row cover TR-06, so the audit removes TR-06 from TC-19 and adds TC-36 with the required S2 origin.
- TC-01 traces SC-02 but never checks `Content-Type`. TC-12 turns a lockout non-disclosure requirement into an unsupported restriction on required-field validation messages. TC-20 asserts re-lock on attempt 3 although the state model records the post-unlock counter as UNSPECIFIED.
- TC-21 and TC-23 need a reachable 200 response, but their shared account can remain locked after TC-20. The audit therefore requires an unlocked account with counter=0, either reset or after the 30-second lock expires.
- The audit uses `srs.md` FR-02 and SEC-01, SEC-02, SEC-05, plus `api_specification.md` sections 1.2 and 2.1 as oracles. The generator catalogs were audit subjects, not authoritative sources.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| TC-01 | TC-01 | Content-Type facet traced but not asserted | Oracle: change to "Response status + `Content-Type: application/json` header + body shape/fields (`token` string, `user` object, no `password` field)" |
| TC-12 | TC-12 | Unsupported validation-message constraint | Expected result: change to "Required-field violation for a combination of both fields empty; exact status/body UNSPECIFIED" |
| TC-19 | TC-19 | TR-06 requires S2, not the row's S1 precondition | Trace: drop `TR-06`, keep only `TR-05`; TR-06 is covered by new TC-36 |
| TC-20 | TC-20 | Assumed counter resets after unlock | Record which attempt triggers the second lock; post-unlock counter value is UNSPECIFIED |
| TC-21, TC-23 | TC-21, TC-23 | Success path can follow TC-20's lock state | Precondition: account exists, unlocked, counter=0, reset or wait out TC-20's 30s lock |
| TC-36 to TC-41 | Missing cases | TR-06, admin role, token usability, per-account lock scope, concurrent lock integrity, JSON null | Added TC-36 through TC-41 from `audit/extended-test-cases.md` |

---

### Artifact #2: API 2 Test-Case Generation and Review [Pool B]

> **Requirement mapping:** REQUIREMENTS.md section 6, items 1-3

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code, Sonnet 5 |
| Date and time | 2026-08-20T21:35:27+07:00 |
| Prompt log entry | Entries 3 and 4: Generate FR-08 Checkout test cases; Audit FR-08 Checkout test cases |

**Prompt (verbatim or single-source-of-truth link):** `prompt_log.md`, entries 3 and 4.

#### (2) AI Output

The generator produced 35 cases, with EP=13, BVA=2, State/Lifecycle=5, Security=8, and Schema=7. The audit reviewed all 35 original cases, added TC-36 through TC-41, and produced a 41-case audited suite. Source: `artifacts/test-cases/fr-08-checkout/master-test-cases.md`, `audit/audit-log.md`, and `audit/audited-master-test-cases.md`.

#### (3) Verdict

- [x] **VALID:** correct and accepted as-is by majority label, 33 of 35 cases.
- [ ] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- The [FR-08 audit log](artifacts/test-cases/fr-08-checkout/audit/audit-log.md) records 33 VALID, 0 INVALID, and 2 INCOMPLETE among the 35 generated cases. The overall VALID verdict follows the majority label.
- TC-17 and TC-18 each allow three outcomes in Expected result, including creating an empty order, but their original Oracle checks only the repeat-call response. Because the checkout response schema is UNSPECIFIED, that observation cannot distinguish a rejection, a silent no-op, and an empty order being persisted.
- The correction adds a before/after `GET /api/orders/my-orders` count for the acting user. That makes the empty-order branch observable while retaining the original response observation.
- The audit states that all cited line references in `srs.md` and `api_specification.md` were re-verified and no false trace was found. The two INCOMPLETE labels are insufficient oracles, not fabricated requirement traces.
- The [extended cases](artifacts/test-cases/fr-08-checkout/audit/extended-test-cases.md) add the missing wrong-scheme Authorization variant, validation side-effect invariant, successful-order persistence check, read-path isolation, recomputation coverage for negative/zero total, and incorrect Content-Type value.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| TC-17 | TC-17 | Oracle cannot distinguish reject, silent no-op, and empty-order-created | Compare `GET /api/orders/my-orders` count immediately before and after the repeat call |
| TC-18 | TC-18 | Same under-asserted oracle as TC-17 | Compare order count immediately before and after, and compare the response with TC-17 |
| TC-36 | Missing wrong-scheme Authorization sub-variant | EC-14 named but did not instantiate wrong-scheme value | Added raw-token and Basic-scheme checkout probes |
| TC-37 | Missing validation-error side-effect coverage | No invariant check for field-level validation attempts | Added before/after order-count and cart-state comparison |
| TC-38 | Missing successful-order persistence check | Happy path did not verify persisted order existence | Added `GET /api/orders/my-orders` post-checkout check |
| TC-39 | Missing read-path cross-user isolation | No order-history isolation check after another user's checkout | Added User B order-list comparison |
| TC-40 | Missing recompute check for negative/zero total | Recompute companion check only covered tampered positive value | Added inspection of any order created by TC-09 |
| TC-41 | Missing incorrect Content-Type value | Only omitted Content-Type was covered | Added `Content-Type: text/plain` case |

---

### Artifact #3: API 3 Test-Case Generation and Review [Pool C]

> **Requirement mapping:** REQUIREMENTS.md section 6, items 1-3

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code, Sonnet 5 |
| Date and time | 2026-08-20T22:25:36+07:00 |
| Prompt log entry | Entries 5 and 6: Generate FR-15 Product CRUD test cases; Audit FR-15 Product CRUD test cases |

**Prompt (verbatim or single-source-of-truth link):** `prompt_log.md`, entries 5 and 6.

#### (2) AI Output

The generator produced 43 cases, with EP=13, BVA=6, State/Lifecycle=5, Security=12, and Schema=7. The audit reviewed all 43 original cases, added TC-44 through TC-48, and produced a 48-case audited suite. Source: `artifacts/test-cases/fr-15-product-crud/master-test-cases.md`, `audit/audit-log.md`, and `audit/audited-master-test-cases.md`.

#### (3) Verdict

- [x] **VALID:** correct and accepted as-is by majority label, 34 of 43 cases.
- [ ] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- The [FR-15 audit log](artifacts/test-cases/fr-15-product-crud/audit/audit-log.md) records 34 VALID, 0 INVALID, and 9 INCOMPLETE among the 43 generated cases. The overall VALID verdict follows the majority label.
- TC-37 through TC-43 have only six data cells under a seven-column header. The missing `Oracle` cell is merged into Expected result, so the suite does not state a separately observable assertion for these schema cases.
- The audit does not replace undocumented API behavior with invented status codes or response envelopes. For POST, PUT, DELETE, missing-id, validation-envelope, and auth-envelope cases, it keeps the exact response shape UNSPECIFIED while adding actions that can be observed, such as status range, Content-Type, JSON parseability, GET round-trips, and non-mutation checks.
- This is why the affected rows are INCOMPLETE rather than INVALID: their trace and test intent remain usable, but the observation mechanism must be separated before execution.
- The [extended cases](artifacts/test-cases/fr-15-product-crud/audit/extended-test-cases.md) add signature-forged JWT, path-parameter SQL injection, category-delete referential behavior, fractional price, and zero/negative path-ID coverage from SRS security, lifecycle, and domain-partition gaps.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| TC-37 to TC-43 | TC-37 to TC-43 | Missing `Oracle` column in each schema row | Added the separate observable Oracle specified in `audit-log.md` for POST, PUT, DELETE, missing-id, validation-envelope, and auth-envelope checks |
| TC-44 | Missing signature-forged JWT vector | Only malformed and expired-shaped token cases existed | Added tampered-signature admin-claim JWT rejection case |
| TC-45 | Missing path-parameter SQL injection | SEC-05 probes excluded `:id` | Added `DELETE /api/products/1%20OR%201%3D1` case with catalog-integrity check |
| TC-46 | Missing category-delete lifecycle behavior | Product `category_id` was tested only at create/update time | Added category deletion followed by product retrieval |
| TC-47 | Missing fractional positive price class | Catalog noted decimal ambiguity but had no test row | Added `price=9.99` case |
| TC-48 | Missing numeric-but-impossible ID class | Numeric path IDs were not partitioned at zero/negative boundary | Added `PUT /api/products/0` and `PUT /api/products/-1` case |

---

### Artifact #4: Additional AI-Generated Artifact (If Applicable)

> **Requirement mapping:** _TBD_

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | _TBD_ |
| Date and time | _TBD_ |
| Prompt log entry | _TBD_ |

**Prompt (verbatim or single-source-of-truth link):** _TBD_

#### (2) AI Output

_TBD_

#### (3) Verdict

- [ ] **VALID:** correct and accepted as-is.
- [ ] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

_TBD_

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| _TBD_ | _TBD_ | _TBD_ | _TBD_ |

---

## 4. Summary of AI Accuracy

| Metric | Count | Percentage |
| --- | ---: | ---: |
| Total AI-generated artifacts audited | 3 suites, 113 original test cases | 100.00% |
| **VALID** (correct, accepted as-is) | 96 | 84.96% |
| **INVALID** (wrong and rejected) | 1 | 0.88% |
| **INCOMPLETE** (acceptable after edits) | 16 | 14.16% |

## 5. Conclusion (When Should AI Be Used or Not)

AI was useful for producing broad, traceable first-pass suites: 96 of 113 generated cases were accepted as-is. It must not be the final authority for state preconditions, observable oracles, cross-feature effects, and security variants. The audit exposed one invalid FR-02 transition trace and 16 incomplete cases, then added 17 source-backed cases across the three APIs.

## 6. Mandatory Disclosure

Claude Code, Sonnet 5 generated the three original test-case suites through the documented generator workflow and then audited them through the documented auditor workflow. The student retained the original master suites, used `audit-log.md` as the source for labels and corrections, and added the source-backed audit extensions. No execution result is claimed by this report; the recorded work is design-time generation and audit.

## Signature

| Field | Value |
| --- | --- |
| Student name (printed) | Le Hoang Lam |
| Student ID | 23127216 |
| Class / Cohort | 23KTPM1 |
| Course | CS423 / CSC13003 - Software Testing |
| Instructor | Dr. Lam Quang Vu |
| Date | 2026-08-20 |
| Signature | ![Le Hoang Lam](assets/signature.png) |

## References

- [AI Use Agreement](../../context/ai_use_agreement.md)
- [HW06 Requirements](REQUIREMENTS.md)
- [Prompt Log](prompt_log.md)
