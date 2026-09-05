# FR-15 Product CRUD — Audit Log

Audit subject: `../master-test-cases.md` (TC-01..TC-43), unchanged. Oracles: `docs/eshop-sut/srs.md`
(FR-12 lines 174-179, FR-14 lines 186-189, FR-15 lines 191-198, section 9 lines 274-284),
`docs/eshop-sut/api_specification.md` (section 3.1-3.4, lines 95-125), and
`.agents/skills/api-test-generator/references/{equivalence-partitioning-and-bva.md,
state-transition-testing.md}` for technique-classification rules. All cited SRS/API-spec line
numbers were checked against the current files and matched exactly.

## Method note

Every TC's `Trace` was opened at the cited source location before its `Expected result` or
technique label was accepted. `Precondition`/`Input`/`Oracle` were checked for reproducibility
and for whether the case actually asserts what it claims to assert. No runtime execution was
performed — this is a design-time audit only.

## Audit table

| TC ID | Label | Source evidence | Reasoning | Student fix |
| --- | --- | --- | --- | --- |
| TC-01 | VALID | srs.md L194-197; api_spec L108-118 | Baseline happy-path combining 5 valid classes in one request is legitimate (individual boundaries isolated separately in TC-02..19); oracle uses the documented `GET /api/products/:id` round-trip. | None |
| TC-02 | VALID | srs.md L195 ("bắt buộc") | `name` omitted correctly rejected per required-field rule. | None |
| TC-03 | VALID | srs.md L195 | Empty string correctly treated as violating "required" (non-empty). | None |
| TC-04 | VALID | srs.md L195 ("tối đa 255 ký tự") | 254 chars is unambiguously below the documented max; BVA-01 lower-neighbor case is correct. | None |
| TC-05 | INCOMPLETE | srs.md L195 ("tối đa 255 ký tự") | "tối đa 255 ký tự" ("maximum 255 characters") states an inclusive upper bound — the same sentence that TC-04 (254→accepted, no hedge) and TC-06 (256→rejected, no hedge) both read without hedging. Marking the boundary value itself (255) as UNSPECIFIED while treating its two neighbors as certain is an internal inconsistency: if "max 255" definitely implies 254 is accepted and 256 is rejected, it equally definitely implies 255 is accepted. This is the heuristics' explicit "incorrectly marked UNSPECIFIED" defect. | Expected result → "Accepted — 255 is the inclusive maximum per 'tối đa 255 ký tự' (srs.md L195); this is the boundary value itself, not a value requiring verification beyond what TC-04/TC-06 already establish for its neighbors." Oracle unchanged (response status + body; product retrievable). |
| TC-06 | VALID | srs.md L195 | 256 chars unambiguously exceeds the documented max; BVA-03 upper-neighbor case correct. | None |
| TC-07 | VALID | srs.md L196 ("bắt buộc") | `price` omitted correctly rejected. | None |
| TC-08 | VALID | srs.md L196 ("phải là số") | Type mismatch honestly flagged UNSPECIFIED for exact status/shape since neither source documents type-coercion behavior; expected-rejected-in-principle is a reasonable inference, not an invented fact. | None |
| TC-09 | VALID | srs.md L196 ("số dương (> 0)") | -1 correctly rejected as not positive. | None |
| TC-10 | VALID | srs.md L196 | 0 correctly rejected — "> 0" explicitly excludes zero. | None |
| TC-11 | VALID | srs.md L196 | 1 correctly accepted as smallest positive integer satisfying "> 0". | None |
| TC-12 | VALID | srs.md L197 ("bắt buộc") | `category_id` omitted correctly rejected. | None |
| TC-13 | VALID | srs.md L197 ("phải chọn từ danh sách có sẵn") | Non-existent category id correctly rejected as a referential-validity violation. | None |
| TC-14 | VALID | srs.md L197 | Type mismatch (string instead of id) honestly flagged UNSPECIFIED, consistent with TC-08's treatment of the same defect class on `price`. | None |
| TC-15 | VALID | api_spec L108-118 (silent on requiredness) | `description` is not named in FR-15's constraint list (srs.md L194-197); correctly flagged UNSPECIFIED rather than assuming required or optional. | None |
| TC-16 | VALID | api_spec L108-118 | Same gap as TC-15, correctly flagged for `imageUrl`. | None |
| TC-17 | VALID | api_spec L106-107 (silent on `:id` type) | Non-numeric path id correctly flagged UNSPECIFIED — no source documents path-parameter type. | None |
| TC-18 | INCOMPLETE | domain-partition-catalog.md BVA-05; srs.md L196 | Technique column says "EP (operation-scoped)" but the cited trace (`BVA-05`) and the input (`price=0`, the documented `> 0` boundary) is a boundary-value re-verification, not an equivalence-class check — the same rule TC-10 tests via BVA on `POST`. The technique label does not match the input per the checklist's "Technique" item. Expected result, oracle, and trace are otherwise correct. | Technique column → "BVA (operation-scoped)". (Downstream effect: the suite's Coverage Gate paragraph technique tally should shift from EP=13/BVA=6 to EP=12/BVA=7 — noted here since the gate text is prose, not an audited TC row.) |
| TC-19 | VALID | domain-partition-catalog.md EC-08; srs.md L197 | Technique "EP (operation-scoped)" correctly matches its trace (`EC-08`, an equivalence-class/referential check, not an ordered boundary — `category_id` has no BVA per the catalog's own scoping note). | None |
| TC-20 | VALID | api_spec section 3.2; srs.md FR-15 create | Create-then-read-back correctly verifies persistence; field-by-field comparison oracle is concrete. | None |
| TC-21 | VALID | srs.md L198 (isolation invariant) | Directly tests the mandatory isolation rule; oracle compares both A (changed) and B (unchanged), matching the invariant's exact wording. | None |
| TC-22 | VALID | api_spec 3.3 (silent on 404) | UNSPECIFIED-flagged correctly — no source documents not-found behavior for PUT; 404 explicitly marked as an assumption to verify, not asserted as fact. | None |
| TC-23 | VALID | api_spec 3.3 (silent) | Same correct treatment for DELETE. | None |
| TC-24 | VALID | srs.md FR-15 (Xóa sản phẩm) | Terminal re-entry case (delete → get → delete again) is a legitimate lifecycle scenario; correctly treats a deleted resource as re-entering the same "does not exist" condition since no source distinguishes the two. | None |
| TC-25 | VALID | srs.md FR-12 L177 | Missing-token rejection on POST; oracle (list count unchanged) is an appropriate non-mutation check. | None |
| TC-26 | VALID | srs.md FR-12 L177 | Missing-token rejection on PUT; oracle checks target fields unchanged. | None |
| TC-27 | VALID | srs.md FR-12 L177 | Missing-token rejection on DELETE; oracle checks product still retrievable. | None |
| TC-28 | VALID | srs.md FR-12 L177; SEC-02 (L279) | Syntactically invalid bearer token correctly expected to fail closed, same as missing token. | None |
| TC-29 | VALID | srs.md FR-12 L177; SEC-02 (L279) | Expired-shaped token correctly expected rejected; distinct defect class from TC-28. | None |
| TC-30 | VALID | srs.md FR-12 L177-179 ("không chỉ kiểm tra sự tồn tại của Token") | Valid-but-non-admin token correctly expected rejected — directly matches the SRS text distinguishing token presence from role check. | None |
| TC-31 | VALID | srs.md FR-12 L177-179 | Same role-check rejection on PUT; oracle confirms no mutation. | None |
| TC-32 | VALID | srs.md FR-12 L177-179 | Same role-check rejection on DELETE; oracle confirms product still exists. | None |
| TC-33 | VALID | srs.md SEC-05 (L282) | SQL injection payload in `name` on create; oracle (full catalog listable afterward) correctly checks for absence of destructive side effects, not just a status code. | None |
| TC-34 | VALID | srs.md SEC-05 (L282) | Injection payload in `description` on update; oracle correctly cross-checks the isolation invariant (only A changes) simultaneously. | None |
| TC-35 | VALID | security-requirement.md SEC-06 (extended reading, L283) | Mass-assignment probe scoped honestly to what's assertable given the caller is already admin (no privilege ceiling above admin exists on this endpoint); the security-requirement.md source itself flags this as a narrower extension, not a direct SEC-06 match — the row is faithful to that caveat. | None |
| TC-36 | VALID | security-requirement.md SEC-06 (extended) | Same honest scoping as TC-35, applied to PUT. | None |
| TC-37 | INCOMPLETE | schema-cases.md SC-01, SC-02 | Table row has only 6 of the header's 7 columns (verified by pipe count: 8 fields vs. 9 for every TC-01..36 row) — the `Oracle` column is missing entirely; its content is conflated into `Expected result`, leaving no separately observable assertion as the schema requires. | Expected result → "UNSPECIFIED exact status code and response body shape for a successful POST (api_spec 3.3 is silent); IF a body is returned, JSON-parseability is expected only as an API-wide convention (sections 1.1/1.2), not stated for 3.3; IF an id-bearing field is present, it is not asserted to exist — the primary oracle for creation success is the GET round-trip (cross-ref TC-20), not this response body." Oracle (new column) → "Record the actual status code and Content-Type header. If a response body is present, assert it parses as valid JSON (no schema shape asserted). If an id-like field is present in the body, assert GET /api/products/:id with that id returns the product; this GET round-trip is the primary creation oracle regardless of whether the POST response carries an id." |
| TC-38 | INCOMPLETE | schema-cases.md SC-03 | Same missing-Oracle-column defect as TC-37. | Expected result → "UNSPECIFIED exact status code and response body shape for a successful PUT (api_spec 3.3 is silent); IF a body is returned, JSON-parseability is expected only as the same API-wide convention noted for TC-37, not stated for 3.3." Oracle (new column) → "Record the actual status code and Content-Type header of TC-21's PUT response. If a body is present, assert it parses as valid JSON; no specific field shape is asserted." |
| TC-39 | INCOMPLETE | schema-cases.md SC-05 | Same missing-Oracle-column defect. | Expected result → "UNSPECIFIED exact status code and body shape for a successful DELETE (api_spec 3.3 is silent); either a parseable-JSON body or an empty body is acceptable — no specific shape is asserted beyond the response not signaling an error." Oracle (new column) → "Record the actual status code of TC-24's first DELETE response. If a body is present, assert it parses as valid JSON; if empty, assert the status code alone indicates success (not an error range)." |
| TC-40 | INCOMPLETE | schema-cases.md SC-06; state-model.md S-03 | Same missing-Oracle-column defect; the existing single field conflates the status-code expectation with the non-mutation side-effect check. | Expected result → "UNSPECIFIED exact status code for PUT on a non-existent id; a non-2xx status is expected (404 is the conventional-REST assumption, not documented — flagged for verification)." Oracle (new column) → "Record the actual status code of TC-22's response and confirm it falls outside the 2xx range. Confirm via GET /api/products that no new product was created as a side effect of the failed update." |
| TC-41 | INCOMPLETE | schema-cases.md SC-07; state-model.md S-04 | Same missing-Oracle-column defect. | Expected result → "UNSPECIFIED exact status code for DELETE on a non-existent id, same caveat as TC-40." Oracle (new column) → "Record the actual status code of TC-23's response and confirm it falls outside the 2xx range. Confirm via GET /api/products that the full existing product list is unchanged (no product removed)." |
| TC-42 | INCOMPLETE | schema-cases.md SC-08 | Same missing-Oracle-column defect; comparison methodology and non-mutation check are conflated into one field. | Expected result → "UNSPECIFIED whether the four validation-failure responses (TC-02, TC-07, TC-10, TC-13) share one documented envelope shape — no error envelope is documented anywhere in api_specification.md." Oracle (new column) → "Record and compare the top-level JSON key sets and status codes of the four responses; report the comparison as an internal-consistency observation, not against a documented contract. Confirm via GET /api/products that none of the four attempts created a product." |
| TC-43 | INCOMPLETE | schema-cases.md SC-09 | Same missing-Oracle-column defect. | Expected result → "UNSPECIFIED whether the eight auth/role-rejection responses (TC-25..TC-32) share one documented envelope shape — no such envelope is documented; each response must be non-2xx and must not leak internal error/stack detail." Oracle (new column) → "Record and compare the top-level JSON key sets and status codes of the eight responses; inspect each body for internal implementation detail (stack traces, file paths, raw error class names) and confirm none is present. The non-mutation side effect for each response is already asserted individually by TC-25..TC-32's own oracle." |

## Counts

Valid: 34 | Invalid: 0 | Incomplete: 9 | Total: 43
