# AI Audit Report - HW06

## 1. Student Information

| Field | Value |
| --- | --- |
| Student name (printed) | Le Hoang Lam |
| Student ID | 23127216 |
| Class / Cohort | 23KTPM1 |
| Assignment ID | `HW#06` |
| Assignment date | 2026-08-20 to 2026-08-29 |
| AI tool(s) used | Claude Code: Sonnet 5 for Pass 1, Opus 5 for Pass 2 |
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

Two passes are audited here. Pass 1 (20/08) generated the three suites and then audited them with the same model. Pass 2 (29/08) re-derived every row from the specification with a different model, which makes the Pass 1 audit itself an audited artifact instead of evidence. Every verdict below is the Pass 2 verdict, with the Pass 1 numbers kept so the change stays visible.

### Artifact #1: API 1 Test-Case Generation and Review [Pool A]

> **Requirement mapping:** REQUIREMENTS.md section 6, items 1-3

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Pass 1: Claude Code, Sonnet 5. Pass 2: Claude Code, Opus 5 |
| Date and time | Pass 1: 2026-08-20T19:04:40+07:00. Pass 2: 2026-08-29T00:26:10+07:00 |
| Prompt log entry | Entries 1 and 2: generate and audit FR-02 Login. Entry 8: Pass 2 re-audit |

**Prompt (verbatim or single-source-of-truth link):** `prompt_log.md`, entries 1, 2, and 8.

#### (2) AI Output

The generator produced 35 cases, with EP=12, BVA=3, State/Lifecycle=5, Security=7, and Schema=8. The Pass 1 audit reviewed all 35, added TC-36 to TC-41, and produced a 41-case suite. Pass 2 re-derived all 41 rows from the authoritative oracles and wrote `audit/audit-log-v2.md`, `audit/extended-test-cases-v2.md`, and `audit/audited-master-test-cases-v2.md`: 21 VALID, 0 INVALID, 20 INCOMPLETE, with 24 labels upheld, 15 overturned, 2 fix-corrected, and TC-42 to TC-46 added. The final suite holds 46 cases.

#### (3) Verdict

- [ ] **VALID:** correct and accepted as-is.
- [x] **INCOMPLETE:** usable only after student changes. 20 of 41 rows needed correction before execution.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- Pass 1 labelled 29 of the 35 generated cases VALID, which is why the earlier verdict on this artifact was VALID. That majority did not survive re-derivation: the same suite scores 21 VALID out of 41 rows once every label has to name the check that decided it.
- TC-13 to TC-17 and TC-32 to TC-35 were labelled from `state-model.md` and `schema-cases.md`, both generator output. An artifact cannot be its own oracle, so Pass 2 re-opened `srs.md` FR-02 lines 41 to 43 and `api_specification.md` section 1.2 and substituted the real evidence.
- TC-32 to TC-34 asserted an error body shape that no source documents. They are still worth running, but only as characterization, so they count toward input coverage and not toward contract coverage. This also weakens the argument behind BUG-FR02-04, which is recorded in the bug entry rather than hidden.
- TC-19 remains the clearest Pass 1 finding and it holds: its precondition reaches S1, counter=1, while TR-06 requires S2. Pass 1 fixed it correctly by splitting TC-36 out.
- The same-state defect Pass 1 found was fixed only where it noticed it. TC-21 and TC-23 got the unlocked, counter=0 precondition; TC-02, TC-07, TC-11 and TC-26 depend on the identical state and were left alone.
- The non-disclosure clause at `srs.md` line 42 was applied in two directions at once. Pass 1 used it to correct TC-12, then accepted TC-28, which stretches the same clause into a key-set comparison covering required-field validation.
- No API resets the failed-attempt counter, and whether a successful login resets it is itself UNSPECIFIED. The package therefore waits out the lock rather than pretending the precondition is enforceable, and rows that run after a non-locking failure start from an unknown counter.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| TC-01 | TC-01 | Content-Type facet traced but not asserted | Oracle: response status, `Content-Type: application/json`, body shape (`token` string, `user` object, no `password` field) |
| TC-12 | TC-12 | Unsupported validation-message constraint | Expected result: required-field violation with both fields empty; exact status and body UNSPECIFIED |
| TC-19 | TC-19 | TR-06 requires S2, not the row's S1 precondition | Trace: drop `TR-06`, keep `TR-05`; TR-06 covered by TC-36 |
| TC-20 | TC-20 | Assumed the counter resets after unlock | Record which attempt triggers the second lock; post-unlock counter left UNSPECIFIED |
| TC-13 to TC-17, TC-32 to TC-35 | Pass 1 audit rows | Labels rested on generator catalogs used as source evidence | Evidence re-derived from `srs.md` FR-02 lines 41 to 43 and `api_specification.md` 1.2; rows with no authoritative source recorded as characterization |
| TC-32 to TC-34 | TC-32 to TC-34 | Asserted an error body shape no source defines | Expected result reduced to recording status and body; counted as input coverage only |
| TC-02, TC-07, TC-11, TC-26 | Pass 1 audit fix | Shared unlocked, counter=0 precondition applied only to TC-21 and TC-23 | Precondition stated on every row that depends on that state |
| TC-28 | TC-28 | Non-disclosure clause widened into a key-set comparison including required-field validation | Comparison narrowed to the two failure causes line 42 actually covers |
| TC-36 to TC-41 | Missing cases (Pass 1) | TR-06, admin role, token usability, per-account lock scope, concurrent lock integrity, JSON null | Added from `audit/extended-test-cases.md`; TC-36, TC-37, TC-39, TC-41 carried with Pass 2 corrections |
| TC-42 to TC-46 | Missing cases (Pass 2) | Lockout message content, counter scope across interleaved accounts, trigger guard on non-consecutive failures, lock TTL renewal, email case variants against the counter | Added from `audit/extended-test-cases-v2.md` |

---

### Artifact #2: API 2 Test-Case Generation and Review [Pool B]

> **Requirement mapping:** REQUIREMENTS.md section 6, items 1-3

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Pass 1: Claude Code, Sonnet 5. Pass 2: Claude Code, Opus 5 |
| Date and time | Pass 1: 2026-08-20T21:35:27+07:00. Pass 2: 2026-08-29T10:03:13+07:00 |
| Prompt log entry | Entries 3 and 4: generate and audit FR-08 Checkout. Entry 12: Pass 2 re-audit |

**Prompt (verbatim or single-source-of-truth link):** `prompt_log.md`, entries 3, 4, and 12.

#### (2) AI Output

The generator produced 35 cases, with EP=13, BVA=2, State/Lifecycle=5, Security=8, and Schema=7. The Pass 1 audit reviewed all 35, added TC-36 to TC-41, and produced a 41-case suite. Pass 2 re-derived all 41 rows and wrote the three `-v2` files: 15 VALID, 4 INVALID, 22 INCOMPLETE, with 16 labels upheld, 20 overturned, 5 fix-corrected, and TC-42 to TC-47 added. The final suite holds 47 cases.

#### (3) Verdict

- [ ] **VALID:** correct and accepted as-is.
- [x] **INCOMPLETE:** usable only after student changes. 26 of 41 rows are INVALID or INCOMPLETE.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- Pass 1 stated outright that every cited line number was re-verified and no false trace was found. Two false citations were sitting in the material it reviewed. `api_specification.md` line 141 is a blank line inside the 4.2 body, and the section 4 auth header is at line 131. `srs.md` line 164 is the FR-11 heading, not the isolation sentence, which is at line 166. Both originated in `specs/requirements.md`, a generator artifact, and spread to eight rows.
- The trace defect was not scored uniformly, and the rule is stated so the asymmetry can be checked. A row with a false trace and no surviving independent trace is INVALID (TC-12, TC-22, TC-23, TC-24). A row with a false trace but an independently verified one still standing is INCOMPLETE with the citation corrected (TC-11, TC-21, TC-32, TC-36).
- TC-15 carries six data cells under a seven-column header, so its Trace text spills into the Oracle cell. Pass 1 labelled it VALID without checking the row structure at all.
- TC-14 and TC-31 act on the same empty cart and reach opposite conclusions, and Pass 1 marked both VALID. A per-case review cannot see this; it only shows up when rows are compared against each other.
- TC-17 has to run immediately after TC-16 empties the cart, while more than fifteen rows require a non-empty cart and the specification documents no endpoint that clears one. The run order is a suite-level constraint, not a property of any single row.
- FR-09 coupons have zero coverage across TC-01 to TC-41 even though `srs.md` line 112 puts coupon entry at the checkout step. TC-42 to TC-44 close that, using the sample-coupon table at lines 130 to 135, which ships a deliberately expired code for exactly this purpose.
- TC-47 is the heaviest gap found in this pass. `POST /api/cart` accepts a client-supplied `price`, so FR-08 line 107's recompute rule can be satisfied literally while being bypassed one layer down. Finding it required joining two endpoints documented in different sections.
- Out-of-stock at checkout was examined and deliberately not added. No documented product model has a stock field, so the case could only exist by inventing a data dimension. It is recorded as a specification gap.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| TC-17 | TC-17 | Oracle cannot distinguish reject, silent no-op, and empty order created | Compare `GET /api/orders/my-orders` count immediately before and after the repeat call |
| TC-18 | TC-18 | Same under-asserted oracle as TC-17 | Compare order count before and after, and compare the response with TC-17 |
| TC-11, TC-21, TC-32, TC-36 | Pass 1 audit rows | False citation to `api_specification.md` line 141, with an independent trace still standing | Citation corrected to line 131; rows kept as INCOMPLETE |
| TC-12, TC-22, TC-23, TC-24 | Pass 1 audit rows | False citation with no surviving authoritative trace behind the expected result | Labelled INVALID; expected results re-derived from `srs.md` FR-08 lines 104 to 108 |
| TC-15 | TC-15 | Six cells under a seven-column header, Trace text occupying the Oracle cell | Row rewritten to the seven-column schema with a separate Oracle |
| TC-14, TC-31 | TC-14, TC-31 | Opposite conclusions from the same empty-cart action, both VALID in Pass 1 | Reconciled against `srs.md` FR-08 line 104; one expectation kept, the other recorded as characterization |
| TC-17 run order | Suite ordering | TC-17 requires an empty cart while 15+ rows require a non-empty one, with no documented clear-cart endpoint | Run order fixed in `request-template.md` and the CSV, with the constraint written down |
| `specs/requirements.md` | Generator artifact | Source of both false citations, propagating into the master suite | Corrected backwards after explicit approval, commit `106ac14` |
| TC-36 to TC-41 | Missing cases (Pass 1) | Wrong-scheme Authorization, validation side-effect invariant, order persistence, read-path isolation, recompute on negative or zero total, wrong Content-Type value | Added from `audit/extended-test-cases.md`; TC-36, TC-37, TC-39, TC-41 carried with Pass 2 corrections |
| TC-42 to TC-47 | Missing cases (Pass 2) | Coupon applied at checkout, expired coupon, per-user coupon limit, IDOR on `GET /api/orders/:id`, initial order status via 4.5, client-supplied cart `price` defeating the recompute rule | Added from `audit/extended-test-cases-v2.md` |

---

### Artifact #3: API 3 Test-Case Generation and Review [Pool C]

> **Requirement mapping:** REQUIREMENTS.md section 6, items 1-3

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Pass 1: Claude Code, Sonnet 5. Pass 2: Claude Code, Opus 5 |
| Date and time | Pass 1: 2026-08-20T22:25:36+07:00. Pass 2: 2026-08-29T12:04:17+07:00 |
| Prompt log entry | Entries 5 and 6: generate and audit FR-15 Product CRUD. Entry 13: Pass 2 re-audit |

**Prompt (verbatim or single-source-of-truth link):** `prompt_log.md`, entries 5, 6, and 13.

#### (2) AI Output

The generator produced 43 cases, with EP=13, BVA=6, State/Lifecycle=5, Security=12, and Schema=7. The Pass 1 audit reviewed all 43, added TC-44 to TC-48, and produced a 48-case suite. Pass 2 re-derived all 48 rows and wrote the three `-v2` files: 27 VALID, 0 INVALID, 21 INCOMPLETE, with 35 labels upheld, 10 overturned, 3 fix-corrected, and TC-49 to TC-56 added. The final suite holds 56 cases.

#### (3) Verdict

- [ ] **VALID:** correct and accepted as-is.
- [x] **INCOMPLETE:** usable only after student changes. 21 of 48 rows needed correction before execution.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- This suite held up better than the other two, and the reason is visible in the sources: `srs.md` lines 194 to 198 state the constraints numerically (`tối đa 255 ký tự`, `số dương (> 0)`, `bắt buộc`), so most rows had something decidable to cite. 35 of 48 labels were upheld with their deciding check named.
- TC-37 to TC-43 have six data cells under a seven-column header. The Oracle collapses into Expected result, so those schema rows state no separately observable assertion. Their intent is sound, which is why they are INCOMPLETE and not INVALID.
- The Pass 1 coverage gate counted all 43 rows as coverage. Rows resting on a silent source cannot claim requirement coverage, only input coverage, so the gate's own claim was overstated rather than the tests being wrong.
- The lifecycle claim of 5 of 5 scenarios covered counted only product-internal transitions. Deleting a product that a cart or a placed order still references was outside the model entirely, even though `srs.md` FR-08 line 106 says the reference exists.
- SEC-02's malformed and expired token matrix had four of six cells empty, with `DELETE` untested against any token defect. The generator instantiated one verb per defect class and treated the class as covered.
- Expired-token coverage still exists only on `PUT` (TC-29). It was not extended in this pass and is recorded as a residual gap rather than quietly closed.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| TC-37 to TC-43 | TC-37 to TC-43 | Missing `Oracle` column in each schema row | Separate observable Oracle added for POST, PUT, DELETE, missing-id, validation-envelope, and auth-envelope checks |
| Coverage gate | Pass 1 Stage 6 report | All 43 rows counted as contract coverage | Rows resting on silent sources reclassified as input coverage only; the gate's claim restated |
| Lifecycle model | `state-model.md` | Scenario count covered product-internal transitions only | Inbound references from cart and order added as lifecycle scope |
| TC-44 to TC-48 | Missing cases (Pass 1) | Signature-forged JWT, path-parameter SQL injection, category delete with referencing products, fractional price, zero and negative path id | Added from `audit/extended-test-cases.md`; TC-45 and TC-48 carried with Pass 2 corrections |
| TC-49 to TC-56 | Missing cases (Pass 2) | Partial body on `PUT` (merge versus replace), delete of a product held by a cart and by a placed order, error-shape consistency across verbs, token validity on `POST` and `DELETE`, negative path id split out, SEC-05 on `imageUrl` | Added from `audit/extended-test-cases-v2.md` |

---

### Artifact #4: Executable Package and Newman Execution

> **Requirement mapping:** REQUIREMENTS.md section 6, items 4-5

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code, Opus 5 |
| Date and time | 2026-08-29T01:25:11+07:00 (build), 2026-08-29T02:26:31+07:00 (execute) |
| Prompt log entry | Entries 9 and 11, shown for FR-02; FR-08 and FR-15 ran the same two skills |

**Prompt (verbatim or single-source-of-truth link):** `prompt_log.md`, entries 9 and 11.

#### (2) AI Output

Per FR, a Postman collection, environment, iteration data file, and `RUN.md` under `artifacts/postman/<fr>/`, then a Newman run with the report, `test-execution.md`, and the archived Pass 1 run under `artifacts/newman/<fr>/`. Totals: FR-02 53 iterations and 89 requests with 247 of 267 assertions passing, FR-08 50 and 250 with 119 of 127, FR-15 56 and 199 with 157 of 173. All three FRs recorded 0 failed requests, so every failure is an assertion failure. 15 bugs were written into `BUG_REPORT.md` and filed as issues #44 to #58.

#### (3) Verdict

- [ ] **VALID:** correct and accepted as-is.
- [x] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- 0 failed requests across all three suites is the check that matters for the package itself. It says the collection, the environment, and the iteration data are wired correctly, so the 44 assertion failures describe SUT behaviour rather than harness defects.
- The FR-02 request template hard-asserted that non-2xx rows never return a raw stack trace, applied to every row. Only TC-25 to TC-27 have SEC-05 behind that expectation, so the assertion contradicted the audited CSV and had to be narrowed.
- Pass 1 runs were archived under `artifacts/newman/<fr>/archive/<timestamp>/` instead of being overwritten, which is what makes the before and after comparison checkable at all.
- BUG-FR02-04 stays open, but its expected behaviour rests on an expectation no source states, and the three rows behind it were downgraded to characterization in Pass 2. The bug is likely real on information-disclosure grounds; the argument needs a different anchor, and the entry says so.
- 4 of the 15 bugs trace to student-added cases or to source inspection during triage rather than to an AI-generated `tc_id`.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| FR-02 `request-template.md` | Stack-trace assertion | Applied to all rows although only SEC-05 supports it | Narrowed to TC-25, TC-26, TC-27; remaining rows switched to record-only |
| FR-08 `test-data.csv` | `REAL_CART_TOTAL` sentinel | Sentinel semantics not decidable from the CSV alone | Kept after an explicit decision, with its meaning documented in `RUN.md` |
| FR-02 execution evidence | Pass 1 report | Rerun would have overwritten the Pass 1 evidence | Archived under `archive/20260828T194022Z/` before the Pass 2 run |
| BUG-FR02-04 | Bug entry | Expected behaviour rested on an unsourced expectation | Evidence section rewritten to state where the defect still reproduces and which rows no longer back it |

---

### Artifact #5: Excel Test-Case Workbook

> **Requirement mapping:** REQUIREMENTS.md section 14, Excel test cases and test summary

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code, Opus 5 |
| Date and time | 2026-08-29T22:22:10+07:00 |
| Prompt log entry | Entry 15 |

**Prompt (verbatim or single-source-of-truth link):** `prompt_log.md`, entry 15.

#### (2) AI Output

`artifacts/test-cases/build_test_case_workbook.py` and the generated `artifacts/test-cases/23127216_HW06_TestCases.xlsx`, with one Test Summary sheet and one sheet per FR (46, 47, and 56 cases). The script reads only existing artifacts: the `-v2` audited suites, the `-v2` extended cases, the `-v2` audit logs, `test-execution.md`, and `BUG_REPORT.md`.

#### (3) Verdict

- [x] **VALID:** correct and accepted as-is.
- [ ] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- The workbook is derived, not authored. Every number in it comes from a Markdown source that is itself submitted, and the script warns on stderr when a source table has the wrong column count or when an executed TC is missing from the suite. The run that produced the submitted file was clean.
- Its totals reconcile with REPORT.md section 6.6: 113 generated, 36 student-added, 149 final, 159 runner rows, and 15 bugs.
- Two counting decisions were made by the student rather than inferred by the script, because either choice would produce a defensible but different total.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| TC-38a, TC-38b | Sub-case rows in FR-02 | Counting sub-cases as separate cases inflates the suite total against the audited suite | Collapsed into TC-38, which fails if any sub-case fails |
| `FIXTURE` rows | Setup rows in FR-08 and FR-15 | Setup iterations are not test cases | Excluded from case counts, still counted as runner rows to match REPORT.md |

---

### Artifact #6: CI/CD Pipeline and Sample Runs

> **Requirement mapping:** REQUIREMENTS.md section 6, technical requirements

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code, Opus 5 |
| Date and time | 2026-08-29T22:12:19+07:00 |
| Prompt log entry | Entry 14 |

**Prompt (verbatim or single-source-of-truth link):** `prompt_log.md`, entry 14.

#### (2) AI Output

`.github/workflows/hw06-api-tests.yml` running the three suites as a three-job matrix, plus `artifacts/cicd/` with the quarantine manifest, the CI data generator, the local runner, the summariser, both evidence sets, and the CI/CD report. Green run 33260661696 on commit `f018a7d` with 403 assertions passing. Red run 33261095283 on commit `49dd0dc`, which seeds a regression into `PUT /api/products/:id` and fails exactly one test case, FR-15 TC-17, with the other two jobs still green. Commit `8d2013f` reverts the seed.

#### (3) Verdict

- [ ] **VALID:** correct and accepted as-is.
- [x] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- The requirement asks for a run where all API test cases pass, and the full suites cannot produce one because the SUT has real bugs. The AI surfaced the conflict instead of quietly trimming assertions, but it could not resolve it either.
- The gate therefore runs a regression subset: 38 quarantined cases, each tagged with its bug id and issue number, plus the cases that depend on them, are excluded by `build-ci-data.mjs`. Green means no new regression, not a clean SUT, and the report states that rather than letting the badge imply otherwise.
- The red run had to fail for a reason a reviewer can verify. Seeding a throw into `PUT /api/products/:id` produces an HTML error page instead of JSON and fails one case, which is a sharper demonstration than breaking an assertion in the test file.
- The pipeline surfaced an ordering defect the suites hid. FR-15 TC-32, `DELETE` with a non-admin token, passed in the full suite only because an earlier quarantined row had already removed its target product. Run alone, it fails.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| Gate scope | Full-suite run | Cannot go green while real bugs exist, so the required all-pass run is unreachable | Quarantined regression subset chosen by the student; `ci-quarantine.json` records the bug id and issue behind every excluded case |
| Green-run meaning | Pipeline status | A green badge would read as "no bugs" | CI/CD report states that green means no new regression |
| FR-15 TC-32 | Test case | Passed only because a preceding quarantined row deleted the target product | Quarantined under BUG-FR15-03 and recorded as a finding |

---

### Artifact #7: Agent Skills and the AI Test-Generator Design

> **Requirement mapping:** REQUIREMENTS.md section 7

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool and model | Claude Code, Opus 5 |
| Date and time | 2026-08-29T00:17:30+07:00 (auditor Pass 2 workflow), 2026-08-29T02:10:40+07:00 (execute re-run workflow), 2026-08-29T23:06:08+07:00 (diagram and pseudocode) |
| Prompt log entry | Entries 7, 10, and 16 |

**Prompt (verbatim or single-source-of-truth link):** `prompt_log.md`, entries 7, 10, and 16.

#### (2) AI Output

Five skill files under `artifacts/skills/`, one per pipeline stage, and the design deliverable under `artifacts/test-generator/`: `diagrams/src/generator-pipeline.mmd` and `generator-boundaries.mmd` with landscape and portrait variants, their rendered PNGs under `diagrams/render/`, `design-diagram.md`, and `pseudocode.md`. Two skill upgrades are logged separately because they changed how Pass 2 ran: the re-audit workflow in `api-test-auditor` (commit `b70ed1a`) and the re-run workflow in `api-test-execute` (commit `d84e311`).

#### (3) Verdict

- [x] **VALID:** correct and accepted as-is.
- [ ] **INCOMPLETE:** usable only after student changes.
- [ ] **INVALID:** wrong and rejected.

#### (4) Reasoning

- The design being drawn is the pipeline that already ran, twice, on three APIs. The stage split, the permission boundaries, and the rule that a generated artifact is never evidence are student decisions taken during Pass 1 and hardened after Pass 2 failures; the AI wrote the Mermaid source and the pseudocode from that design and did not invent the architecture. This is what REQUIREMENTS.md section 11 asks to be self-drawn.
- The boundary that carries the most weight is the auditor's ban on sending requests. An auditor that can execute starts labelling by observed behaviour, and at that point every SUT bug becomes expected behaviour.
- The Pass 2 auditor workflow exists because of a measured failure, not a preference. Pass 1's audit had claimed no false trace was found while two wrong citations sat in the material it reviewed, so the workflow now forces re-derivation from the oracles before any Pass 1 label is read.
- Both upgrades write `-v2` files instead of overwriting the Pass 1 output. That costs three extra files per FR and keeps the audit trail that proves the challenge actually happened.

#### (5) Student Fix

| # | AI-generated item | Issue | Corrected item |
| ---: | --- | --- | --- |
| Auditor workflow | Pass 1 skill | Same model audited its own output, and labels could be carried forward | Authority order fixed, labels re-derived from oracles first, verdict recorded as upheld, overturned, fix-corrected, or dropped |
| Auditor output | Pass 1 file layout | Overwriting the Pass 1 audit would erase the evidence of the challenge | `-v2` files written alongside, Pass 1 files left intact |
| Execute workflow | Pass 1 skill | A rerun would overwrite the earlier Newman evidence | Archive step added before every rerun |
| Diagram | Rendering | A generated diagram would breach the self-drawn constraint | Layout, stage boundaries, and artifact flow specified by the student from the built pipeline; AI limited to rendering the Mermaid source |

---

## 4. Summary of AI Accuracy

Pass 1, the 113 originally generated cases labelled by the same model that wrote them:

| Metric | Count | Percentage |
| --- | ---: | ---: |
| Total cases audited | 113 | 100.00% |
| **VALID** | 96 | 84.96% |
| **INVALID** | 1 | 0.88% |
| **INCOMPLETE** | 16 | 14.16% |

Pass 2, the same 113 cases plus the 17 cases Pass 1 added, re-derived from the specification by a different model:

| Metric | Count | Percentage |
| --- | ---: | ---: |
| Total rows re-derived | 130 | 100.00% |
| **VALID** | 63 | 48.46% |
| **INVALID** | 4 | 3.08% |
| **INCOMPLETE** | 63 | 48.46% |

| Verdict against the Pass 1 label | Count | Percentage |
| --- | ---: | ---: |
| Upheld | 75 | 57.69% |
| Overturned | 45 | 34.62% |
| Fix-corrected | 10 | 7.69% |
| Dropped | 0 | 0.00% |

Student-added cases: 17 in Pass 1, 19 in Pass 2, 36 in total. Final suites: 46 for FR-02, 47 for FR-08, 56 for FR-15, 149 across the three APIs. Beyond the three test-case suites, four more AI-generated artifacts were audited: the executable package and Newman run (INCOMPLETE), the Excel workbook (VALID), the CI/CD pipeline (INCOMPLETE), and the agent skills with the generator design (VALID).

## 5. Conclusion (When Should AI Be Used or Not)

AI produced broad, traceable first-pass suites quickly, and that is where its value sat: 113 cases across three APIs in a few hours, each row carrying a technique label and a trace.

Where it failed is more useful than where it succeeded. A model auditing its own output upheld 96 of 113 cases, and re-derivation from the specification upheld 75 of 130 rows. The gap is not noise; it covers false citations that Pass 1 explicitly certified as verified, rows whose evidence was another AI artifact, coverage claims that counted undecidable rows as contract coverage, and defects that only exist between rows: two cases concluding opposite things from the same action, a precondition fixed on two rows and missed on four more, a run order that no single row can violate on its own.

The working rule that came out of this: never let the model that wrote an artifact be the one that grades it, and never let anything the model produced count as evidence. Everything else follows from those two. The human decisions stayed with the student: which labels to accept, whether to overwrite a generator document that had been proven wrong, whether a specification gap gets a fabricated test case or a written record, and what a green CI badge is allowed to mean.f

## 6. Mandatory Disclosure

Claude Code, Sonnet 5 generated the three original test-case suites and audited them in Pass 1. Claude Code, Opus 5 re-audited all three suites in Pass 2, rebuilt the Postman packages, ran Newman, wrote the bug entries, built the CI/CD pipeline and the Excel workbook, and rendered the generator diagram and pseudocode from the student's design. The original master suites and the Pass 1 audit files are kept unchanged next to the `-v2` files, and Pass 1 Newman reports are archived rather than overwritten, so both passes remain checkable. Execution results reported here come from real Newman runs against a locally deployed SUT; no result is estimated or reconstructed.

## Signature

| Field | Value |
| --- | --- |
| Student name (printed) | Le Hoang Lam |
| Student ID | 23127216 |
| Class / Cohort | 23KTPM1 |
| Course | CS423 / CSC13003 - Software Testing |
| Instructor | Dr. Lam Quang Vu |
| Date | 2026-08-29 |
| Signature | ![Le Hoang Lam](assets/signature.png) |

## References

- [HW06 Requirements](REQUIREMENTS.md)
- [Prompt Log](prompt_log.md)
