# FR-08 `POST /api/checkout` — Audit Log (Pass 2 Re-audit)

Re-audit of `../master-test-cases.md` (TC-01..TC-35) and of the Pass 1 additions
(`extended-test-cases.md`, TC-36..TC-41). The Pass 1 artifacts (`audit-log.md`,
`extended-test-cases.md`, `audited-master-test-cases.md`) are subjects of this review, never
evidence for themselves or for each other.

## Authority order

1. `docs/eshop-sut/api_specification.md` section 4.3 (lines 151-161), section 4 header
   (line 131), sections 4.1/4.2/4.4/4.5 and 5.1 where cart, order-read and coupon
   preconditions are cited.
2. `docs/eshop-sut/srs.md` FR-08 (lines 102-108), plus FR-07, FR-09, FR-10, FR-11 and
   section 9 (SEC-01..SEC-07, lines 274-284) where a case cites them.
3. `specs/security-requirement.md` (SEC applicability mapping for this endpoint).

`master-test-cases.md`, the four generator catalogs (`domain-partition-catalog.md`,
`state-model.md`, `security-cases.md`, `schema-cases.md`), `specs/requirements.md` and
`specs/openapi.yaml` are audit subjects. Citing one of them alone is not source evidence.

## Line citations re-verified against the live sources

| Citation used in the suite | Verified content | Status |
| --- | --- | --- |
| `api_specification.md` line 131 | `_Yêu cầu Header: `Authorization: Bearer <token>`_` (section 4 header) | correct |
| `api_specification.md` line 141 | **blank line inside the section 4.2 body block** | **FALSE — no content supports any claim** |
| `api_specification.md` lines 151-161 | section 4.3 heading, endpoint, and the two-field request example | correct |
| `api_specification.md` line 165 / 169 | `GET /api/orders/my-orders` / `GET /api/orders/:id` | correct |
| `srs.md` line 104 | "Chỉ người dùng **đã đăng nhập** mới tiến hành thanh toán được." | correct |
| `srs.md` line 107 | "Backend phải tự tính lại tổng tiền; không chấp nhận giá trị `total_amount` do client gửi lên." | correct |
| `srs.md` line 108 | "Sau thanh toán thành công, giỏ hàng được xóa." | correct |
| `srs.md` line 100 | "Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng." — an FR-07 **UI display** requirement | correct text, **wrong scope** for API behavior |
| `srs.md` line 164 | `### FR-11: Xem lịch sử đơn hàng (User)` (a heading) | **FALSE — the quoted rule is at line 166** |
| `srs.md` line 166 | "Người dùng chỉ xem được đơn hàng của chính mình." | correct |
| `srs.md` line 282 | SEC-05, parameterized query requirement | correct |
| `srs.md` lines 141-156 | FR-10 heading and state diagram (`pending` is the only state with no inbound arrow) | correct |
| `equivalence-partitioning-and-bva.md` | exists only at `.agents/skills/api-test-generator/references/` — the generator's own methodology reference, not in the suite and not an oracle | **inadmissible as trace** |

Pass 1's audit-log header asserted: "All cited line numbers exist and directly support the
claims made against them; no false trace was found." That assertion is falsified by the two
FALSE rows above. The `line 141` error originates in the generator artifact
`specs/requirements.md` and propagated into eight test-case rows.

## Trace-defect rule applied in this pass

Stated explicitly so it can be checked for symmetry:

- A row whose cited location does not contain the claimed content has a false trace.
- False trace **and** no other verified authoritative trace independently supporting the
  expected result → `INVALID`.
- False trace **but** another verified authoritative trace independently supports the
  expected result → `INCOMPLETE`, corrected by repairing the citation.
- A trace consisting only of generator artifacts (`P-xx`, `EC-xx`, `S-xx`, `SEC-C-xx`,
  `SC-xx`, `specs/requirements.md`) is not source evidence → `INCOMPLETE`, corrected by
  adding the authoritative location; the generated id is kept as a cross-reference.

## Label table

| TC ID | Prev label | New label | Verdict | Source evidence | Reasoning | Student fix |
| --- | --- | --- | --- | --- | --- | --- |
| TC-01 | VALID | VALID | upheld | `api_specification.md` 4.3 lines 151-161 | Deciding check — Expected result: the row records the status code instead of asserting one, and section 4.3 documents no response at all, so nothing is invented. The cited location contains exactly the two-field body the action sends. | None |
| TC-02 | VALID | INCOMPLETE | overturned | `api_specification.md` 4.3 lines 156-161 (body example, no validation rule stated) | Trace admissibility: the row's entire trace (`EC-02`; `specs/requirements.md`) is generator output. Pass 1 accepted it and cited the same generated artifacts back as "Source evidence". The UNSPECIFIED expected result is correct and is preserved. | Trace field → "EC-02 (cross-ref); `api_specification.md` 4.3 lines 156-161 — `shipping_address` appears only as an example value, no constraint or validation rule is stated anywhere, which is the location establishing the silence." |
| TC-03 | VALID | INCOMPLETE | overturned | `api_specification.md` 4.3 lines 156-161 | Same defect as TC-02: trace is `EC-03`; `specs/requirements.md`, both generator output. Required/optional status of the field is genuinely undocumented and the hedge is correct. | Trace field → "EC-03 (cross-ref); `api_specification.md` 4.3 lines 156-161 — the body example shows the field present but no source states whether it is required." |
| TC-04 | VALID | INCOMPLETE | overturned | `api_specification.md` 4.3 lines 156-161 | Same defect: trace is `EC-04` alone, with no authoritative location at all. | Trace field → "EC-04 (cross-ref); `api_specification.md` 4.3 lines 156-161 — no source states null-handling for `shipping_address`." |
| TC-05 | VALID | INCOMPLETE | overturned | `api_specification.md` 4.3 lines 156-161 | The trace cites `equivalence-partitioning-and-bva.md`, which exists only under `.agents/skills/api-test-generator/references/`. It is the generator's own methodology document, is not part of the suite, and is not an oracle. Pass 1 quoted it as evidence ("do not invent a maximum length"). The 5,000-char probe itself is a legitimate class and the UNSPECIFIED expected result is correct. | Trace field → "EC-05 (cross-ref); `api_specification.md` 4.3 lines 156-161 — no maximum length for `shipping_address` is stated in any source, so no boundary is asserted." |
| TC-06 | VALID | VALID | upheld | `api_specification.md` 4.3 lines 156-161 | Deciding check — Trace: the cited location does contain a string-typed `shipping_address` example, which is what the wrong-type class is derived from, and the expected result asserts no outcome. | None |
| TC-07 | VALID | VALID | upheld | `srs.md` FR-08 line 107 | Deciding check — Expected result: line 107 states the recompute rule unconditionally, so "the submitted value is not authoritative for the resulting total" is decidable from the source rather than inferred. Request shape overlaps TC-26 but the oracles differ and the suite discloses it. | None |
| TC-08 | VALID | INCOMPLETE | overturned | `api_specification.md` 4.3 lines 156-161; `srs.md` FR-08 line 107 | Trace is `EC-09`; `specs/requirements.md` — generator output only. The row's own hedge (rejected pre-recompute vs. absorbed) is correct and preserved; only the trace is defective. | Trace field → "EC-09 (cross-ref); `api_specification.md` 4.3 lines 156-161 (field shown in the example, requiredness not stated); `srs.md` FR-08 line 107 (the submitted value is documented as non-authoritative, which is what makes the omission's effect undefined)." |
| TC-09 | VALID | VALID | upheld | `srs.md` FR-08 line 107 | Deciding check — Isolation: the two sub-values (`-1`, `0`) are two members of one equivalence class, not two different classes, so combining them does not confound attribution. Line 107 is a verified authoritative trace supporting the "silently ignored" branch of the hedge. | None |
| TC-10 | VALID | INCOMPLETE | overturned | `api_specification.md` 4.3 lines 156-161 | Trace is `EC-11`; `specs/requirements.md` — no authoritative location. The wrong-type class and the UNSPECIFIED expectation are correct. | Trace field → "EC-11 (cross-ref); `api_specification.md` 4.3 lines 156-161 — `total_amount` appears as a JSON number in the example; no source states type-validation behavior." |
| TC-11 | VALID | INCOMPLETE | overturned | `api_specification.md` line 131; `srs.md` FR-08 line 104 | False trace: `api_specification.md line 141` is a blank line inside the 4.2 body block. The row survives as INCOMPLETE rather than INVALID because `srs.md` FR-08 line 104 is also cited and independently supports "auth required". | Trace field → "EC-13 (cross-ref); `api_specification.md` line 131 (section 4 header requiring `Authorization: Bearer <token>`); `srs.md` FR-08 line 104; composite with SEC-C-01." |
| TC-12 | VALID | **INVALID** | overturned | `api_specification.md` line 131; `srs.md` FR-08 line 104 | The row's only authoritative trace is the false `line 141`; the remainder (`EC-14`, `SEC-C-02`) is generator output. Nothing verifiable supports the "Rejected — auth required" expectation as written. Pass 1 labeled it VALID and reasoned only about which EC-14 sub-variant it instantiates, never opening the cited line. | Trace field → "EC-14 (cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104; composite with SEC-C-02." Expected result and Oracle unchanged. |
| TC-13 | VALID | INCOMPLETE | overturned | `api_specification.md` 4.3 lines 156-161 | Two defects. (1) Trace is generator output only. (2) Expected result asserts the response "must not reveal materially more diagnostic detail than a single-field violation" — no source states any information-disclosure rule for validation errors, so this is an undefined outcome asserted as documented. | Expected result field → "UNSPECIFIED — no source states whether either field is validated, nor whether a combined violation is reported differently from a single-field one. Record the status and body, and record whether the body exposes more field-level detail than TC-02 and TC-08 did; this is an observation, not a documented requirement." Trace field → "EC-02, EC-09 (combination, cross-ref); `api_specification.md` 4.3 lines 156-161." |
| TC-14 | VALID | INCOMPLETE | overturned | `api_specification.md` 4.1 line 135, 4.2 line 139; `srs.md` FR-08 lines 102-108 (silent on empty-cart checkout) | Two defects. (1) Trace cites `srs.md` FR-07 line 100, which is "Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng" — a UI display requirement for the cart screen, wrong scope for checkout API behavior. (2) Precondition "cart has exactly 0 items" names no reachability path, and section 4 documents no cart-clear or cart-item-delete endpoint (only `GET /api/cart` and `POST /api/cart`), so an empty cart is reachable only via a never-populated account or immediately after a successful checkout. The UNSPECIFIED expected result is correct and preserved. | Precondition field → "User A logged in with a freshly registered account that has never called `POST /api/cart` (the only documented way to reach a 0-item cart besides the post-checkout clear in TC-17, since section 4 documents no cart-clear endpoint); emptiness confirmed via `GET /api/cart` (api_specification.md 4.1 line 135) immediately before the action." Trace field → "BVA-01 (domain-partition-catalog.md, cross-ref); `api_specification.md` 4.1 line 135 and 4.2 line 139 (the only documented cart endpoints); `srs.md` FR-08 lines 102-108 — silent on empty-cart checkout." |
| TC-15 | VALID | INCOMPLETE | overturned | `srs.md` FR-08 line 108; `api_specification.md` 4.1 line 135 | Structural defect Pass 1 never checked: the row has **six** columns instead of seven — the `Oracle` field is absent and the trace content occupies the Oracle slot. Every other row in the suite has seven. The expected result itself is sound (cart clearing on success is documented at line 108). | Oracle field (currently missing) → "Checkout response status recorded; follow-up `GET /api/cart` (api_specification.md 4.1 line 135) confirms the cart is empty after success." Trace field (currently holding the Oracle's content) → "BVA-02 (domain-partition-catalog.md, cross-ref); `srs.md` FR-08 lines 104-108." |
| TC-16 | VALID | VALID | upheld | `srs.md` FR-08 line 108; `api_specification.md` 4.1 line 135 | Deciding check — Oracle: the clearing side effect is verified through `GET /api/cart`, a documented endpoint, and line 108 states the clearing rule explicitly, so the assertion is decidable rather than inferred. | None |
| TC-17 | INCOMPLETE | INCOMPLETE | upheld | `state-model.md` S-02 (cross-ref); `srs.md` FR-08 lines 102-108 (silent on repeat calls); `api_specification.md` 4.4 line 165 | Re-derived independently of Pass 1's reasoning: the Expected result names three candidate outcomes including "an empty order" being created, but the Oracle observes only the repeat call's status and body, and the response shape is itself undocumented — so the third outcome is not distinguishable from a silent no-op. Pass 1's fix uses `GET /api/orders/my-orders`, a documented endpoint (line 165), and does not resolve the UNSPECIFIED into a concrete value. Fix survives verification. | Oracle field → "Response status + body of the repeat call; additionally, compare the acting user's order count via `GET /api/orders/my-orders` (api_specification.md 4.4 line 165) immediately before and after the repeat call, to determine whether the 'empty order' outcome named in Expected result actually occurred, since response body presence/shape is itself undocumented and cannot alone distinguish reject vs. silent no-op vs. empty-order-created." |
| TC-18 | INCOMPLETE | INCOMPLETE | fix-corrected | `srs.md` FR-08 lines 102-108 (silent); `api_specification.md` 4.4 line 165 | Label re-derived and upheld: the same under-asserted oracle as TC-17. Pass 1's fix is incomplete — it repaired the Oracle but left the row citing `srs.md` FR-07 line 100, the same wrong-scope UI requirement flagged in TC-14. A fix that leaves a false trace in place is not a complete correction. | Oracle field → "Response status + body, compared against TC-17; additionally, compare the acting user's order count via `GET /api/orders/my-orders` (api_specification.md 4.4 line 165) immediately before and after the call, for the same reason given in TC-17's fix." Trace field → "S-03 (state-model.md, cross-ref); `srs.md` FR-08 lines 102-108 — silent on checkout against a never-populated cart. Remove the `FR-07 line 100` citation: that line governs the empty-cart UI display, not API behavior." |
| TC-19 | VALID | VALID | upheld | `srs.md` FR-08 lines 102-108; `api_specification.md` 4.4 line 165 | Deciding check — Expected result: the row states no idempotency or locking rule is documented and explicitly labels its own "at most one call succeeds" remark as an inference rather than an assertion. The Oracle already counts created orders, so the outcomes are distinguishable. | None |
| TC-20 | VALID | INCOMPLETE | overturned | `srs.md` FR-11 line 166; FR-08 line 104 | Trace overreach: the row cites `srs.md` FR-07 lines 93-100 to support cross-user isolation, but FR-07 states only cart-screen columns, quantity merging, the delete-confirmation dialog, the "Tiếp tục mua sắm" button, the total label, and the empty-cart illustration. **It never states that a cart belongs to one user.** The order half of the expectation is genuinely documented — at line 166, which the row does not cite. The cart half rests on inference and must be marked as such. | Expected result field → "User A's checkout must not add to, remove from, or clear User B's cart, and must not create or alter any order visible to User B. The order half is required by `srs.md` FR-11 line 166; the cart half is an inference from FR-08 line 104 (only the logged-in user checks out) — no source states cart ownership directly, so record it as a characterization observation." Trace field → "S-05 (state-model.md, cross-ref); `srs.md` FR-11 line 166 (order isolation, documented); `srs.md` FR-08 line 104 (checkout is bound to the logged-in user)." |
| TC-21 | VALID | INCOMPLETE | overturned | `api_specification.md` line 131; `srs.md` FR-08 line 104 | Two defects. (1) False trace `line 141`; survives as INCOMPLETE because FR-08 line 104 is also cited and independently supports fail-closed rejection and the "no order created" half. (2) Expected result adds "no internal error detail leaked" — no source states an error-detail disclosure rule for this endpoint, so that clause asserts an undocumented requirement. | Expected result field → "Fail-closed: request rejected; no order created; target cart is not cleared (required by `srs.md` FR-08 line 104 — an unauthenticated request that produced an order would violate it). Exact status and body UNSPECIFIED. Additionally record whether the body exposes internal error detail; no source states a disclosure rule, so this is an observation, not an assertion." Trace field → "SEC-C-01 (cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104." |
| TC-22 | VALID | **INVALID** | overturned | `api_specification.md` line 131; `srs.md` FR-08 line 104 | The only authoritative trace is the false `line 141`; `SEC-C-02` is generator output. Nothing verifiable supports the fail-closed expectation as cited. Pass 1's reasoning ("Correctly specified; request shape overlaps TC-12") never opened the line. | Trace field → "SEC-C-02 (cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104." Expected result and Oracle unchanged. |
| TC-23 | VALID | **INVALID** | overturned | `api_specification.md` line 131; `srs.md` FR-08 line 104 | Same sole-false-trace defect. The forged-signature precondition is itself sound — a tampered JWT is constructed client-side and needs no API to reach — so only the trace requires correction, but as written the row has no verifiable authoritative support. | Trace field → "SEC-C-03 (cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104." Expected result and Oracle unchanged. |
| TC-24 | VALID | **INVALID** | overturned | `api_specification.md` line 131; `srs.md` FR-08 line 104; `api_specification.md` 1.2 lines 26-38 (login returns a JWT, no lifetime stated) | Two defects. (1) Sole authoritative trace is the false `line 141`. (2) Precondition is unreachable through documented endpoints: no source states a JWT lifetime, and no documented endpoint issues or ages a token into expiry. Forging one instead collapses the case into TC-23's invalid-signature class, destroying attribution. Pass 1 called this "correctly hedged on expiry construction details". | Precondition field → "User A logged in; cart non-empty. Token expiry is **not reachable through any documented endpoint** — `api_specification.md` 1.2 (lines 26-38) documents that login returns a JWT but states no lifetime, and no endpoint ages or revokes a token. Execute only if a token lifetime is confirmed out-of-band at execution time and record that lifetime as the precondition; otherwise mark the case blocked as a specification gap. Do not substitute a forged token — that is TC-23's class and would confound expiry with signature invalidity." Trace field → "SEC-C-04 (cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104; token lifetime undocumented." |
| TC-25 | VALID | INCOMPLETE | overturned | `srs.md` FR-08 line 104; `api_specification.md` 4.3 lines 151-161; 2.1 line 74 | The `"cart_id": <B's cart id>` alternative is unreachable: no documented endpoint exposes a cart identifier — `GET /api/cart` (4.1 line 135) is documented with no response schema at all. Offering two alternative payloads under one row also leaves the input ambiguous. The `user_id` variant is reachable (`GET /api/users/me`, 2.1 line 74, called while authenticated as User B during setup). | Input / action field → "`POST /api/checkout` using User A's valid token, with an extraneous `\"user_id\": <B's id>` field added to the body. Drop the `cart_id` alternative: no documented endpoint exposes a cart identifier, so that variant is not constructible." Precondition field → append "; User B's id obtained during setup via `GET /api/users/me` (api_specification.md 2.1 line 74) while authenticated as User B." Trace field → "SEC-C-05 (cross-ref); `srs.md` FR-08 line 104 (checkout is bound to the logged-in user); `api_specification.md` 4.3 lines 151-161 (no cart or user identifier is a documented parameter)." |
| TC-26 | VALID | VALID | upheld | `srs.md` FR-08 line 107 | Deciding check — Expected result: line 107 makes the recompute mandatory and unconditional, so "the recorded total equals the real cart total, never 1" is decidable from the source. The Oracle names three documented surfaces (response, 4.4, 4.5) rather than assuming one. | None |
| TC-27 | VALID | VALID | upheld | `srs.md` line 282 (SEC-05); `specs/security-requirement.md` SEC-05 row | Deciding check — Trace: line 282 states the parameterized-query requirement verbatim, and `shipping_address` is the endpoint's only documented free-text persisted input, so SEC-05 applies in scope and direction. The expected result asserts inertness, not a status code. | None |
| TC-28 | VALID | VALID | upheld | `srs.md` line 282 (SEC-05) | Deciding check — Test intent: the comment-truncation payload is a different injection class from TC-27's boolean tautology, so this is not an unmarked duplicate; same verified SEC-05 basis. | None |
| TC-29 | VALID | VALID | upheld | `api_specification.md` 4.3 lines 151-161 (no response documented); `srs.md` FR-10 lines 141-156 | Deciding check — Expected result: the row records the actual status and media type instead of asserting them, and qualifies `pending` as "weakly inferable from FR-10's diagram topology". The diagram at lines 145-156 does show `pending` as the only state with no inbound transition, so the hedge is accurate and no contract is invented. | None |
| TC-30 | VALID | VALID | upheld | `srs.md` FR-08 line 107; `api_specification.md` 4.4 line 165, 4.5 line 169 | Deciding check — Oracle: the total is inspected on documented surfaces (`GET /api/orders/my-orders`, `GET /api/orders/:id`), making the recompute invariant from line 107 independently observable rather than dependent on the undocumented checkout response body. | None |
| TC-31 | VALID | INCOMPLETE | overturned | `srs.md` FR-08 line 108 (clearing documented for success only); FR-08 lines 102-108 (silent on empty-cart rejection) | The row states the side-effect invariant "is assertable regardless" and asserts "no order created" for the empty-cart attempt. No source defines empty-cart checkout at all, so a server that accepted it and created an order would violate no documented rule. Deriving a prohibition from silence is exactly the misuse the spec-silence rule forbids. It also **contradicts TC-14**, which correctly records the same request's outcome as UNSPECIFIED. | Expected result field → "UNSPECIFIED status and envelope shape. Record whether an order was created (order count via `GET /api/orders/my-orders` before/after) and whether the cart state changed. No source defines empty-cart checkout, so neither creation nor rejection can be asserted — this is a characterization observation exposing the specification gap, consistent with TC-14's UNSPECIFIED reading of the same request." Trace field → "SC-06, SC-07, SC-08 (cross-ref); `srs.md` FR-08 line 108 (cart clearing documented as a success side effect only); FR-08 lines 102-108 silent on empty-cart handling." |
| TC-32 | VALID | INCOMPLETE | overturned | `srs.md` FR-08 line 104; line 108; `api_specification.md` line 131 | False trace `line 141`. Survives as INCOMPLETE because `srs.md` line 108 is also cited and legitimately supports the "no cart cleared" half. The stronger support for "no order created" is FR-08 line 104, which the row never cites — an unauthenticated request producing an order contradicts it directly. | Trace field → "SC-09 (cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104 (only a logged-in user may check out — an order created here would contradict it); `srs.md` FR-08 line 108 (clearing documented for success only)." |
| TC-33 | VALID | INCOMPLETE | overturned | `api_specification.md` 4.3 lines 151-161 | Expected result asserts the response "must not be a raw stack trace or unparseable/HTML error page". No source states any error-format requirement for this endpoint; the row's own trace calls its basis a "document-wide JSON convention", which is an inference from the specification's style, not a stated rule. Pass 1 accepted the assertion and reasoned only about why the side-effect check was omitted. | Expected result field → "UNSPECIFIED — no source states how a malformed JSON body is handled. Record the status, `Content-Type`, and whether the body is parseable, and record whether a stack trace or HTML error page is returned. The specification documents no error format for this endpoint, so a non-JSON error page is a finding to report, not a contract violation to assert." Trace field → "SC-10 (cross-ref); `api_specification.md` 4.3 lines 151-161 — silent on malformed-body handling." |
| TC-34 | VALID | VALID | upheld | `api_specification.md` 4.3 lines 151-161 | Deciding check — Expected result: the row states outright that neither source defines behavior for a missing `Content-Type` and asserts no outcome, which is the correct treatment of a silent source. | None |
| TC-35 | VALID | VALID | upheld | `api_specification.md` 4.3 lines 151-161 (no response documented) | Deciding check — Expected result: framed as "recorded as an internal-consistency observation, not an assertion of a specific documented shape", so the undocumented envelope is not resolved into a claim. The `fr-02-login TC-28` mention is a precedent note, not load-bearing evidence, and the row asserts nothing that would need it. | None |
| TC-36 | n/a (Pass 1 addition) | INCOMPLETE | fix-corrected | `api_specification.md` line 131; `srs.md` FR-08 line 104 | The addition inherits the false `line 141` citation from the same generator artifact that seeded it. The gap it fills is real: `domain-partition-catalog.md` P-14 names a "wrong-scheme value" sub-variant of EC-14 that no row in TC-01..TC-35 ever instantiates. Content survives; citation must be repaired. | Trace field → "`domain-partition-catalog.md` P-14 (EC-14 'wrong-scheme value' sub-variant, cross-ref); `api_specification.md` line 131; `srs.md` FR-08 line 104." |
| TC-37 | n/a (Pass 1 addition) | INCOMPLETE | fix-corrected | `srs.md` FR-08 line 108 (success side effect only); FR-08 lines 102-108 (silent on validation) | Expected result asserts that no validation-error attempt "may have created an order or cleared/altered the cart", and its only cited basis for that invariant is `schema-cases.md` SC-08 — generator output. Line 108 documents clearing as a consequence of success; it does not forbid effects on failure, and no source states that any of TC-02..TC-10/TC-13's inputs must be rejected at all. Note the asymmetry the Pass 1 wording hides: the identical sentence is genuinely source-backed for the auth-rejected rows (FR-08 line 104) but not here. | Expected result field → "Record, for each referenced case, whether an order was created and whether the cart changed. No source states that these inputs must be rejected, so neither outcome can be asserted — this is a characterization sweep exposing the validation gap, and it counts toward input coverage only, not requirement coverage. Contrast TC-21/TC-32, where the same 'no order created' expectation **is** required, by `srs.md` FR-08 line 104." Trace field → "SC-08 (cross-ref); `srs.md` FR-08 line 108 (clearing documented for success only); FR-08 lines 102-108 silent on field validation; `api_specification.md` 4.4 line 165 and 4.1 line 135 (the observation surfaces)." |
| TC-38 | n/a (Pass 1 addition) | VALID | upheld | `api_specification.md` 4.4 lines 163-165; `srs.md` FR-08 lines 104-108 | Deciding check — Expected result: it asserts only that a new order appears, and explicitly leaves the item list, total, and status fields UNSPECIFIED. Order creation is documented semantics, not inference — section 4.3 is titled "Đặt hàng" (place an order) and section 4.4 exposes the resulting order history — so "count increased by exactly one" follows from a single order-placement action rather than from silence. | None |
| TC-39 | n/a (Pass 1 addition) | INCOMPLETE | fix-corrected | `srs.md` FR-11 line 166 | False trace: the row cites `srs.md` line 164 for the text "Người dùng chỉ xem được đơn hàng của chính mình". Line 164 is the FR-11 heading; the quoted rule is at line 166. The quotation itself is accurate and the case is strongly backed, so only the citation is defective. | Trace field → "`srs.md` FR-11 line 166 ('Người dùng chỉ xem được đơn hàng của chính mình'); `srs.md` FR-08 line 104 (checkout is bound to the logged-in user); `api_specification.md` 4.4 line 165." |
| TC-40 | n/a (Pass 1 addition) | VALID | upheld | `srs.md` FR-08 line 107 | Deciding check — Trace: line 107's recompute rule is unconditional on the submitted value's class, so extending the TC-30 companion check to the negative/zero class is supported by the cited text rather than by analogy. The row is correctly conditional ("if TC-09 resulted in an order being created"), so it asserts nothing about whether TC-09 is accepted. | None |
| TC-41 | n/a (Pass 1 addition) | INCOMPLETE | fix-corrected | `api_specification.md` 4.3 lines 151-161 | The expected result is correctly UNSPECIFIED, but the trace names no verifiable authoritative location — only `schema-cases.md` SC-11 (generator output) and an unlocated "document-wide JSON convention". Same defect this pass charged against TC-33's trace; applied symmetrically here. | Trace field → "SC-11 (cross-ref); `api_specification.md` 4.3 lines 151-161 — the body is documented as JSON by example only, and no source states how an incorrect `Content-Type` value is handled." |

## Counts

**New labels — Valid: 15 | Invalid: 4 | Incomplete: 22 | Total: 41**

Composition: 35 original cases (VALID 13, INVALID 4, INCOMPLETE 18) + 6 Pass 1 additions
(VALID 2, INVALID 0, INCOMPLETE 4).

**Verdicts — upheld: 16 | overturned: 20 | fix-corrected: 5 | dropped: 0 | Total: 41**

**Label delta vs. Pass 1** (Pass 1 recorded Valid 33 / Invalid 0 / Incomplete 2 across the 35
original cases and assigned no labels to its own additions): VALID −20, INVALID +4,
INCOMPLETE +20.

All 41 rows were re-derived from the oracles before comparison with the Pass 1 labels. No
label was carried forward. The 16 upheld rows each name the check that decided them.

## Cross-row consistency findings

These are defects a per-case pass cannot see. They are recorded here and resolved in
`audited-master-test-cases-v2.md`.

1. **TC-14 contradicts TC-31.** Both act on an empty cart via `POST /api/checkout`. TC-14
   records the outcome as UNSPECIFIED; TC-31 asserts "no order created" as an invariant
   holding "regardless". Pass 1 labeled both VALID. Resolved by the TC-31 fix.
2. **One sentence, two evidential statuses.** "No order created; cart unchanged" is required
   by `srs.md` FR-08 line 104 in TC-21/TC-22/TC-23/TC-24/TC-32 (an unauthenticated request
   producing an order contradicts that line), but has no source in TC-31/TC-37 (no source
   defines empty-cart or field-validation rejection). The v2 suite marks the second group as
   characterization so the distinction is not lost at execution time.
3. **The `line 141` fix must be applied uniformly.** The citation appears in TC-11, TC-12,
   TC-21, TC-22, TC-23, TC-24, TC-32, TC-36 and in the generator artifact
   `specs/requirements.md`. Repairing some rows and not others would leave the suite's fixes
   contradicting each other.
4. **Run-order conflict, undocumented.** TC-17's precondition is "immediately after TC-16's
   success", at which point the cart is empty; TC-02..TC-13, TC-15, TC-19, TC-20, TC-25..TC-28
   all require "cart non-empty". Section 4 documents no cart-clear endpoint, so the cart can
   only be emptied by a successful checkout and only refilled by `POST /api/cart`. Every
   "cart non-empty" row must therefore state that it repopulates the cart via
   `POST /api/cart` (api_specification.md 4.2 line 139) as part of its setup.
5. **Pass 1's verification claim is falsified.** Its header states "All cited line numbers
   exist and directly support the claims made against them; no false trace was found," while
   two distinct false citations (`api_specification.md` line 141, `srs.md` line 164) were
   present in the material it reviewed — one of them in its own added case.

## Coverage status after re-labeling

The original suite's Coverage Gate claims "Shortfall: none". That claim no longer holds under
Pass 2 labels:

- Rows now classified as characterization (no source defines the outcome) count toward input
  coverage only, not requirement coverage: TC-02..TC-05, TC-08, TC-10, TC-13, TC-14, TC-17,
  TC-18, TC-19, TC-31, TC-33, TC-34, TC-35, TC-37, TC-41.
- Contract coverage rests on the rows tied to a stated rule: FR-08 line 104 (TC-11, TC-21,
  TC-22, TC-23, TC-24, TC-32, TC-36), line 107 (TC-07, TC-09, TC-26, TC-30, TC-40), line 108
  (TC-15, TC-16), FR-11 line 166 (TC-20, TC-39), SEC-05 line 282 (TC-27, TC-28).
- **FR-09 (Coupon) has zero coverage in TC-01..TC-41**, although `srs.md` line 112 places
  coupon entry at the Checkout step. Addressed in `extended-test-cases-v2.md`.
- **Stock / inventory is not testable from these sources.** No documented product model
  (`api_specification.md` 3.3 lines 103-118, 6.3 lines 216-234) contains a stock or inventory
  field, and neither `srs.md` nor the API specification mentions stock at checkout. An
  out-of-stock or quantity-exceeds-stock case cannot be written without inventing a data
  dimension the specification does not define, so none is added. This is reported as a
  specification gap.

## Downstream impact

20 overturned rows and 5 fix-corrected rows change `Trace`, `Oracle`, `Expected result`,
`Precondition`, or `Input / action` text. No TC ID was renumbered or dropped, so existing
references by ID remain valid, but any execution artifact generated from the pre-audit suite
(`data/`, request templates, Postman collections, RUN.md) no longer matches the case text and
must be regenerated with `api-test-sync` before execution.

No execution was performed and no runtime behavior is claimed anywhere in this audit.
