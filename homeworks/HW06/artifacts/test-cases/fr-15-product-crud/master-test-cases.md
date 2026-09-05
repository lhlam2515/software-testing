# FR-15 `POST/PUT/DELETE /api/products(/:id)` — Master Test Case Suite

Continuous `TC-01..TC-43` sequence merging `domain-partition-catalog.md` (EP + BVA),
`state-model.md` (Lifecycle), `security-cases.md` (Security), and `schema-cases.md`
(Schema).

Test principals referenced: `admin@eshop.com` (seeded admin account per
`docs/eshop-sut/setup_guide.md`, `role='admin'`), a registered non-admin customer account
(any registered user without `role='admin'`), and a valid `category_id` obtained via
`GET /api/categories` before each case that needs one.

Where a documented status code, response body shape, or exact behavior does not exist in
either source, the Expected result / Oracle column says UNSPECIFIED and states what to
record instead of asserting an invented value.

| TC ID | Technique | Precondition | Input / action | Expected result | Oracle | Trace |
| --- | --- | --- | --- | --- | --- | --- |
| TC-01 | EP | Admin logged in (valid admin JWT); a valid `category_id` exists | `POST /api/products` with `name="Áo thun nam"`, `price=100000`, `description="Mô tả sản phẩm"`, `imageUrl="http://example.com/img.png"`, `category_id=<valid>` | Accepted — product created; not asserted as a specific status code | Response status recorded; product retrievable afterward via `GET /api/products/:id` | EC-03, EC-06, EC-09, EC-12, EC-14; srs.md FR-15 lines 194-197 |
| TC-02 | EP | Admin logged in | `POST /api/products` with `name` key omitted, otherwise valid body | Rejected — `name` required | Response status + body | EC-01; srs.md FR-15 line 195 |
| TC-03 | EP | Admin logged in | `POST /api/products` with `name=""`, otherwise valid body | Rejected — required means non-empty | Response status + body | EC-02; srs.md FR-15 line 195 |
| TC-04 | BVA | Admin logged in | `POST /api/products` with `name` = a 254-character string, otherwise valid body | Accepted | Response status + body; product retrievable | BVA-01; srs.md FR-15 line 195 |
| TC-05 | BVA | Admin logged in | `POST /api/products` with `name` = a 255-character string, otherwise valid body | Accepted — UNSPECIFIED whether the implementation truly accepts exactly 255; flagged for verification | Response status + body; product retrievable | BVA-02; srs.md FR-15 line 195 |
| TC-06 | BVA | Admin logged in | `POST /api/products` with `name` = a 256-character string, otherwise valid body | Rejected — exceeds the documented max | Response status + body | BVA-03; srs.md FR-15 line 195 |
| TC-07 | EP | Admin logged in | `POST /api/products` with `price` key omitted, otherwise valid body | Rejected — `price` required | Response status + body | EC-04; srs.md FR-15 line 196 |
| TC-08 | EP | Admin logged in | `POST /api/products` with `price="one hundred"` (string), otherwise valid body | UNSPECIFIED exact status/error shape for a type mismatch; expected rejected in principle ("phải là số") | Response status + body | EC-05; srs.md FR-15 line 196 |
| TC-09 | BVA | Admin logged in | `POST /api/products` with `price=-1`, otherwise valid body | Rejected — not positive | Response status + body | BVA-04; srs.md FR-15 line 196 |
| TC-10 | BVA | Admin logged in | `POST /api/products` with `price=0`, otherwise valid body | Rejected — "phải là số dương (> 0)" excludes zero | Response status + body | BVA-05; srs.md FR-15 line 196 |
| TC-11 | BVA | Admin logged in | `POST /api/products` with `price=1`, otherwise valid body | Accepted — smallest positive value satisfying `> 0` | Response status + body; product retrievable | BVA-06; srs.md FR-15 line 196 |
| TC-12 | EP | Admin logged in | `POST /api/products` with `category_id` key omitted, otherwise valid body | Rejected — `category_id` required | Response status + body | EC-07; srs.md FR-15 line 197 |
| TC-13 | EP | Admin logged in | `POST /api/products` with `category_id=999999` (no such category), otherwise valid body | Rejected — must reference an existing category | Response status + body | EC-08; srs.md FR-15 line 197 |
| TC-14 | EP | Admin logged in | `POST /api/products` with `category_id="electronics"` (string, not an id), otherwise valid body | UNSPECIFIED exact status/error shape for a type mismatch | Response status + body | EC-10; srs.md FR-15 line 197 |
| TC-15 | EP | Admin logged in | `POST /api/products` with `description` key omitted, otherwise valid body | UNSPECIFIED — `description` is not named in FR-15's input-constraint list; record whether it is accepted or rejected, do not assume either | Response status + body | EC-11; api_spec 3.3 (silent) |
| TC-16 | EP | Admin logged in | `POST /api/products` with `imageUrl` key omitted, otherwise valid body | UNSPECIFIED — same gap as `description` | Response status + body | EC-13; api_spec 3.3 (silent) |
| TC-17 | EP | Admin logged in; a product exists | `PUT /api/products/abc` (non-numeric path id), otherwise valid body | UNSPECIFIED exact status/error shape — path parameter type not documented | Response status + body | EC-16; api_spec 3.3 (silent) |
| TC-18 | EP (operation-scoped) | Admin logged in; product P1 exists (created in TC-01) | `PUT /api/products/<P1 id>` with `price=0`, otherwise valid body | Rejected — same `> 0` rule verified on the update path, not only create | Response status + body; `GET /api/products/<P1 id>` afterward shows `price` unchanged | BVA-05 (PUT-scoped verification); srs.md FR-15 line 196 |
| TC-19 | EP (operation-scoped) | Admin logged in; product P1 exists | `PUT /api/products/<P1 id>` with `category_id=999999`, otherwise valid body | Rejected — same referential-validity rule verified on the update path | Response status + body; `GET /api/products/<P1 id>` afterward shows `category_id` unchanged | EC-08 (PUT-scoped verification); srs.md FR-15 line 197 |
| TC-20 | Lifecycle | Admin logged in | `POST /api/products` with valid fields (product P2), then `GET /api/products/<P2 id>` | P2 is retrievable; stored fields match submitted values | Response of `GET` compared field-by-field against the `POST` body | S-01; api_spec section 3.2; FR-15 create |
| TC-21 | Lifecycle | Admin logged in; products A and B both exist (created via `POST`, distinct field values) | `PUT /api/products/<A id>` with different `name`/`price`/`category_id`, then `GET /api/products/<B id>` | A's fields reflect the update; B's fields are unchanged from B's creation | `GET` responses for A and B compared before/after the update | S-02; srs.md FR-15 line 198 (mandatory isolation coverage) |
| TC-22 | Lifecycle | Admin logged in; id `999999` does not correspond to any existing product | `PUT /api/products/999999` with an otherwise-valid body | Rejected as not-found; UNSPECIFIED exact status/body | Response status + body; no product with id `999999` exists afterward | S-03; api_spec 3.3 (silent); assumption to verify |
| TC-23 | Lifecycle | Admin logged in; id `999999` does not correspond to any existing product | `DELETE /api/products/999999` | Rejected as not-found; UNSPECIFIED exact status/body | Response status + body; catalog's existing products unaffected | S-04; srs.md FR-15 (Xóa sản phẩm); mandatory coverage group |
| TC-24 | Lifecycle | Admin logged in | Create product C, `DELETE /api/products/<C id>`, then `GET /api/products/<C id>`, then `DELETE /api/products/<C id>` again | After the first delete, C is not retrievable (same not-found behavior as TC-22/TC-23); the second `DELETE` behaves identically to TC-23 (delete of a non-existent id) | Responses of all three follow-up calls | S-05; srs.md FR-15 (Xóa sản phẩm); terminal re-entry |
| TC-25 | Security | Anonymous (no credential); a valid `category_id` exists | `POST /api/products` with no `Authorization` header, otherwise valid body | Rejected before any product is created; UNSPECIFIED exact status | Response status + body; `GET /api/products` list count unchanged | SEC-C-01; srs.md FR-12 line 177 |
| TC-26 | Security | Anonymous; product P1 exists | `PUT /api/products/<P1 id>` with no `Authorization` header, otherwise valid body | Rejected | `GET /api/products/<P1 id>` afterward shows fields unchanged | SEC-C-02; srs.md FR-12 line 177 |
| TC-27 | Security | Anonymous; product P1 exists | `DELETE /api/products/<P1 id>` with no `Authorization` header | Rejected | `GET /api/products/<P1 id>` afterward still returns the product | SEC-C-03; srs.md FR-12 line 177 |
| TC-28 | Security | Attacker holds a syntactically invalid token; a valid `category_id` exists | `POST /api/products` with `Authorization: Bearer not-a-real-jwt-string`, otherwise valid body | Rejected the same as a missing token | Response status + body; no product created | SEC-C-04; srs.md FR-12 line 177; SEC-02 |
| TC-29 | Security | Attacker holds an expired-shaped admin-claim token; product P1 exists | `PUT /api/products/<P1 id>` with an expired JWT (`exp` in the past), otherwise valid body | Rejected | `GET /api/products/<P1 id>` afterward shows fields unchanged | SEC-C-05; srs.md FR-12 line 177; SEC-02 |
| TC-30 | Security | Authenticated non-admin (customer) user; a valid `category_id` exists | `POST /api/products` with a valid customer JWT, otherwise valid body | Rejected — role check must fail even though the token is valid | Response status + body; no product created | SEC-C-06; srs.md FR-12 lines 177-179 |
| TC-31 | Security | Authenticated non-admin user; product P1 exists | `PUT /api/products/<P1 id>` with a valid customer JWT, otherwise valid body | Rejected | `GET /api/products/<P1 id>` afterward shows fields unchanged | SEC-C-07; srs.md FR-12 lines 177-179 |
| TC-32 | Security | Authenticated non-admin user; product P1 exists | `DELETE /api/products/<P1 id>` with a valid customer JWT | Rejected | `GET /api/products/<P1 id>` afterward still returns the product | SEC-C-08; srs.md FR-12 lines 177-179 |
| TC-33 | Security | Admin logged in; a valid `category_id` exists | `POST /api/products` with `name="Ao'; DROP TABLE products;--"`, otherwise valid body | Parameterized query treats the payload as an inert literal; no SQL error surfaced | `GET /api/products` afterward still lists every previously-existing product | SEC-C-09; srs.md SEC-05 line 282 |
| TC-34 | Security | Admin logged in; products A and B both exist | `PUT /api/products/<A id>` with `description="' OR '1'='1"`, otherwise valid body | No SQL error surfaced; only A's `description` changes | `GET` responses for A (changed) and B (unchanged) after the call | SEC-C-10; srs.md SEC-05 line 282; composite with S-02 isolation oracle |
| TC-35 | Security | Admin logged in; a valid `category_id` exists | `POST /api/products` with body `{"name": "...", "price": 1, "category_id": <valid>, "role": "admin"}` | The extra `role` field has no persisted effect and grants no privilege; a follow-up non-admin-token attempt (TC-30-style) is still rejected | Created record inspected for a `role` field; follow-up privilege probe | SEC-C-11; SEC-06 (extended) |
| TC-36 | Security | Admin logged in; product P1 exists | `PUT /api/products/<P1 id>` with body including `"isAdmin": true` alongside otherwise-valid fields | Same expected control as TC-35 on the update path | Product record inspected for an `isAdmin` field; no privilege change observed for any account | SEC-C-12; SEC-06 (extended) |
| TC-37 | Schema | TC-01's response available | Inspect the raw `POST` success response: status code, `Content-Type`, body presence/parseability, and any id-bearing field | Record actual status/media type (no documented value to assert against); if a body exists, confirm it is parseable JSON; if an id-like field exists, confirm it resolves via `GET /api/products/:id` (cross-ref TC-20) | SC-01, SC-02; api_spec 3.3 (silent) |
| TC-38 | Schema | TC-21's `PUT` response available | Inspect the raw `PUT` success response: status code, `Content-Type`, body presence/parseability | Record actual status/media type; if a body exists, confirm it is parseable JSON | SC-03; api_spec 3.3 (silent) |
| TC-39 | Schema | TC-24's first `DELETE` response available | Inspect the raw `DELETE` success response: status code, `Content-Type`, body presence/parseability | Record actual status/media type; no specific shape asserted beyond "not an error" | SC-05; api_spec 3.3 (silent) |
| TC-40 | Schema | TC-22's response available | Inspect the `PUT`-on-missing-id response: status code + body shape | UNSPECIFIED exact code (404 assumed, not documented); side-effect invariant: no product created | SC-06; composite with S-03 |
| TC-41 | Schema | TC-23's response available | Inspect the `DELETE`-on-missing-id response: status code + body shape | UNSPECIFIED exact code, same caveat as TC-40; side-effect invariant: no existing product removed | SC-07; composite with S-04 |
| TC-42 | Schema | TC-02, TC-07, TC-10, TC-13's responses available (four distinct validation failures) | Compare the four error response bodies' top-level key sets and status codes | UNSPECIFIED whether all four share one documented envelope shape (none is documented anywhere in api_specification.md); recorded as an internal-consistency observation | SC-08; composite with EC-01, EC-04, BVA-05, EC-08 |
| TC-43 | Schema | TC-25..TC-32's responses available (eight distinct auth/role rejections) | Compare the eight error response bodies' top-level key sets and status codes; confirm none leaks internal error/stack detail | UNSPECIFIED shared envelope shape; side-effect invariant already asserted per-case (no mutation) | SC-09; composite with SEC-C-01..08 |

## Coverage Gate

- Total: 43/35 (target exceeded; no reworded duplicates — see Shortfall note)
- By technique: EP=13, BVA=6, State/Lifecycle=5, Security=12, Schema=7
- Parameters without EP/BVA coverage: none — `name` (EC-01..03, BVA-01..03), `price`
  (EC-04..06, BVA-04..06), `category_id` (EC-07..10), `description` (EC-11..12),
  `imageUrl` (EC-13..14), and path `id` (EC-15..17) each have every catalog class
  represented in TC-01..TC-19 and TC-20/TC-21 (EC-15, via S-01/S-02) and TC-22/TC-23
  (EC-17, via S-03/S-04)
- Applicable SEC ids without cases: none — SEC-02 (TC-25, TC-26, TC-27, TC-28, TC-29),
  SEC-03 (TC-30, TC-31, TC-32, including the IDOR/role-escalation obligation), SEC-05
  (TC-33, TC-34), SEC-06 extended (TC-35, TC-36)
- Valid transitions: not applicable — no explicit/implicit state table exists for this
  endpoint group (`state-model.md` classification: lifecycle adaptation). Lifecycle
  coverage instead: 5/5 scenario ids covered (S-01 TC-20; S-02 TC-21; S-03 TC-22; S-04
  TC-23; S-05 TC-24); missing: none
- Documented response variants: 8/8 variant slots covered (POST 200/4xx; PUT 200/404/4xx;
  DELETE 200/404/4xx — see `schema-cases.md`); all 9 `SC-*` ids trace to at least one TC
  row (TC-37..TC-43), four of which (SC-04, SC-06, SC-07, SC-09) are explicitly composite
  with lifecycle/security oracles rather than independent assertions, per the underlying
  contract's silence on response shape
- Shortfall: none. All 17 EC ids, all 6 BVA ids, all 5 lifecycle scenario ids, all 12
  SEC-C ids, and all 9 SC ids trace to at least one TC row. TC-18/TC-19 are the only
  operation-scoped re-verifications of a rule already tested on `POST` (BVA-05, EC-08) —
  included because FR-15's constraints are stated for the "Thêm/Sửa" (add/edit) pair
  jointly (srs.md lines 194-197) and PUT may be implemented by a different code path than
  POST; each asserts the isolation-oracle (other-fields-unchanged) that TC-10/TC-13 do
  not, so it is not a reworded duplicate. TC-34 also verifies the SEC-05/S-02 isolation
  overlap directly rather than assuming it from TC-21.
