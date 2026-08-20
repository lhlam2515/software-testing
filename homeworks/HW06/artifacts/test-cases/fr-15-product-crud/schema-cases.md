# FR-15 Product CRUD — Schema Cases

`specs/openapi.yaml` cross-checked against `docs/eshop-sut/api_specification.md` section
3.3 (lines 103-118): the request body fields (`name`, `price`, `description`, `imageUrl`,
`category_id`) match exactly. Section 3.3 gives **no success or error response example**,
unlike sections 1.1/1.2 — this is the dominant fact driving every row below: most facets
are UNSPECIFIED and are recorded as such rather than invented.

| Row ID | Response variant | Schema facet | Atomic assertion | Expected | Trace / overlap |
| --- | --- | --- | --- | --- | --- |
| SC-01 | `POST /api/products` success | Body presence/parseability | If a body is returned on success, it is well-formed JSON | UNSPECIFIED exact status code and shape by section 3.3 itself; JSON-parseability is asserted only as an API-wide convention observed in every other documented endpoint (sections 1.1, 1.2), not stated for 3.3 | api_spec 3.3 (silent); 1.1/1.2 (convention, not direct source) |
| SC-02 | `POST /api/products` success | Created-resource identifiability | If an id-bearing field is present in the response, it must resolve via `GET /api/products/:id` to the just-created product | UNSPECIFIED whether an id is actually returned; the primary oracle for "was it created" is the `GET` round-trip, not this response body | api_spec 3.3 (silent); cross-ref `state-model.md` S-01 |
| SC-03 | `PUT /api/products/:id` success | Body presence/parseability | Same JSON-parseability convention as SC-01 | UNSPECIFIED exact status/shape | api_spec 3.3 (silent) |
| SC-04 | `PUT /api/products/:id` success | Update reflected in resource state | Composite — the schema-observable fact is the `GET` round-trip showing changed fields, not the `PUT` response body | Covered by `state-model.md` S-02's oracle; no independent assertion added here | `state-model.md` S-02 |
| SC-05 | `DELETE /api/products/:id` success | Body presence/parseability | Same JSON-parseability convention as SC-01, or an acceptable empty body — no specific shape asserted beyond "not an error status" | UNSPECIFIED | api_spec 3.3 (silent) |
| SC-06 | `PUT /api/products/:id` 404 (missing id) | Error status class + non-mutation | A non-2xx status is returned; no product is created as a side effect of the failed update | UNSPECIFIED exact code — 404 is the conventional-REST assumption, not documented; flagged for verification | Composite with `state-model.md` S-03 |
| SC-07 | `DELETE /api/products/:id` 404 (missing id) | Error status class + non-mutation | A non-2xx status is returned; every existing product remains unaffected | UNSPECIFIED exact code, same caveat as SC-06 | Composite with `state-model.md` S-04 |
| SC-08 | `POST`/`PUT` 4xx (validation failure: name/price/category_id) | Error envelope shape | UNSPECIFIED — "No error envelope is documented anywhere in api_specification.md for any endpoint"; only assertable facts are a non-2xx status and that no product is created/mutated | Composite with `domain-partition-catalog.md` invalid rows P-01, P-02, P-07, P-10, P-11, P-13, P-14 |
| SC-09 | `POST`/`PUT`/`DELETE` 4xx (missing/invalid/insufficient-role auth) | Error envelope shape + non-mutation | Composite — same non-2xx-plus-unchanged-state oracle already asserted by the security cases; no independent schema assertion added | Composite with `security-cases.md` SEC-C-01..08 |

## Coverage summary

- Documented response variant slots across the three operations (per `specs/openapi.yaml`):
  POST `200`, POST `4xx` (2); PUT `200`, PUT `404`, PUT `4xx` (3); DELETE `200`,
  DELETE `404`, DELETE `4xx` (3) = **8 variant slots**.
- Covered: 8/8 — every slot has at least one `SC-*` row. Four of the nine rows (SC-04,
  SC-06, SC-07, SC-09) are explicitly composite with lifecycle or security cases rather
  than independent assertions, because the contract documents no response shape for those
  variants beyond the side effect already tested elsewhere.
- No schema facet in this table asserts an invented status code, field name, or error
  envelope structure; every UNSPECIFIED gap is stated inline.
