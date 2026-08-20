# FR-08 `POST /api/checkout` — Schema Cases

Cross-check against `specs/openapi.yaml`: no disagreement to resolve — `openapi.yaml`
already marks every response facet as unspecified because api_specification.md 4.3
documents **zero** response examples for this endpoint (unlike sections 1.1/1.2, which
show explicit success bodies). This is a genuine documentation gap, not an authoring
error: 0 of 0 documented response variants exist to cross-check against.

Two facts are still assertable without inventing anything:

1. **Media type convention**: every request and response body shown anywhere in
   `api_specification.md` (sections 1-6) is JSON; there is no documented exception. This
   is a document-wide convention, applied here as an inference about transport format
   only — not an invented field or status code.
2. **Business-rule-derived facets**: srs.md FR-08 line 107 (server recomputes
   `total_amount`) and FR-10's diagram topology (srs.md lines 141-156) are strong enough
   to assert two narrow facts about the created-order shape *if* fields with those names
   are returned at all — not that they are returned.

| Row ID | Response variant | Schema facet | Atomic assertion | Expected | Trace / overlap |
| --- | --- | --- | --- | --- | --- |
| SC-01 | Successful checkout (created-order) | Status code | UNSPECIFIED — no source documents which 2xx code (200 vs 201) is returned | Do not assert; record actual code as an observation, not a pass/fail against a documented value | api_specification.md 4.3 (no example given) |
| SC-02 | Successful checkout (created-order) | Media type | If a body is returned, it is JSON (`application/json`) | Consistent with every other documented endpoint in api_specification.md 1-6 | api_specification.md (document-wide convention) |
| SC-03 | Successful checkout (created-order) | Body presence | UNSPECIFIED whether any body is returned at all, and if so, whether it contains the created order, an id, a message, or an empty object | Do not assert a specific shape; record what is actually returned | api_specification.md 4.3 (no example given) |
| SC-04 | Successful checkout (created-order) | `total_amount` value (if the field is present in the response) | If a total/amount-shaped field is present, its value must equal the server-recomputed real cart total, never the client-submitted `total_amount` | Composite: schema facet + SEC-02-extended(b) business-rule assertion | srs.md FR-08 line 107; overlaps `security-cases.md` SEC-C-06 |
| SC-05 | Successful checkout (created-order) | Order status value (if a status/state field is present in the response) | UNSPECIFIED whether the field is even returned; *if* present, the only documented anchor is that `pending` is the sole node in FR-10's state diagram with no incoming transition from another order state — weak inference, not an asserted contract value | srs.md FR-10 lines 141-156 (topology only, no explicit "checkout sets status=pending" statement) |
| SC-06 | Empty-cart / validation-error checkout attempt | Status code | UNSPECIFIED — no source documents a 4xx code for invalid `shipping_address`, empty cart, or malformed `total_amount` | Do not assert; record actual code | api_specification.md 4.3 (no example given); `specs/requirements.md` |
| SC-07 | Empty-cart / validation-error checkout attempt | Error envelope shape | UNSPECIFIED — no error envelope (field names such as `error`/`message`/`code`) is documented anywhere in api_specification.md for any endpoint, not only this one | api_specification.md (document-wide gap) |
| SC-08 | Empty-cart / validation-error checkout attempt | Side-effect invariant (composite with lifecycle) | Whatever the exact status/body, a rejected checkout must not have created an order or cleared a cart — this is assertable regardless of the unresolved status code/body shape, because it follows from FR-08 only describing clearing as a side effect of a *successful* checkout (line 108) | srs.md FR-08 line 108; overlaps `state-model.md` S-02/S-03 |
| SC-09 | Auth-rejected checkout attempt (SEC-02) | Status code and body | UNSPECIFIED shape; same side-effect invariant as SC-08 applies (no order created, no cart cleared) | api_specification.md line 141; overlaps `security-cases.md` SEC-C-01..SEC-C-04 |
| SC-10 | Any checkout attempt | Request robustness — syntactically broken JSON body (e.g. trailing comma / unclosed brace) | UNSPECIFIED exact status/shape, but a JSON API must not surface a raw stack trace or an unparseable/HTML error page; general document-wide JSON-API convention, not a per-endpoint documented rule | api_specification.md (document-wide convention: every endpoint's request/response shown is JSON) |
| SC-11 | Any checkout attempt | Request robustness — valid JSON body sent without a `Content-Type: application/json` header | UNSPECIFIED — neither source states server behavior for this case; record actual status/body, do not assume rejection or acceptance | api_specification.md 4.3 (silent) |
| SC-12 | Cross-comparison of two distinct validation-error responses (e.g. invalid `shipping_address` vs. empty-cart rejection) | Error envelope internal consistency | UNSPECIFIED whether both error responses share the same top-level key set; recorded as an internal-consistency check, not an assertion of a specific envelope shape, since no envelope is documented (SC-07) | api_specification.md (document-wide gap); mirrors FR-02 precedent (`fr-02-login/master-test-cases.md` TC-28) for envelope-consistency checks under undocumented error shapes |

## Coverage note

Documented response variants for this endpoint: **0 of 0** — this is a specification
gap (api_specification.md 4.3 gives a request example only), not a partial-coverage
shortfall. All twelve `SC-*` rows exist to make that gap explicit and to pin down the
handful of facts that *are* derivable from FR-08/FR-10 text, rather than to assert an
invented contract.
