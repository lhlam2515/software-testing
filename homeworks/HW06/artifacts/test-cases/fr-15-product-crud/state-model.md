## Classification

No meaningful state - lifecycle adaptation

Justification: none of the three operations (`POST /api/products`,
`PUT /api/products/:id`, `DELETE /api/products/:id`) accept or return a status field
whose value changes how a later call on the same or a different resource is handled.
Per `state-transition-testing.md`, "a state model is valid only when the same event can
produce different behavior depending on current state" — no source (api_specification.md
section 3.3, srs.md FR-15) describes such a condition for products (contrast with FR-10's
order state machine, which *is* explicit state). What FR-15 does document is a
**resource-isolation invariant** ("Khi Sửa một sản phẩm, chỉ sản phẩm đó bị thay đổi — các
sản phẩm khác giữ nguyên", srs.md line 198) and the implicit lifecycle question of
operating on a resource that does not exist. Both are modeled below as lifecycle
adaptation, not as `TR-*` transitions — state-transition coverage is **not applicable** to
this endpoint group.

| Row ID | Scenario | Expected behavior | Trace |
| --- | --- | --- | --- |
| S-01 | Create product A via `POST /api/products` with valid fields, then `GET /api/products/:id` for A's id. | A is retrievable and its stored fields match the submitted values (id is server-generated). | api_spec section 3.2 (`GET /api/products/:id`); FR-15 create behavior. |
| S-02 | Create products A and B. Update only A (`PUT /api/products/:id` on A's id) with different `name`/`price`/`category_id`. Then `GET` B. | A's fields reflect the update; B's fields are byte-identical to what was submitted at B's creation — untouched by A's update. | srs.md FR-15 line 198 (isolation invariant — mandatory coverage group). |
| S-03 | `PUT /api/products/:id` using an id that does not correspond to any existing product (e.g. a very large numeric id, or an id already deleted). | Rejected as not-found. UNSPECIFIED exact status/body — no source documents 404 behavior for this endpoint; 404 used as the conventional-REST assumption, flagged for verification, not asserted as fact. | Realizes P-23/EC-17 from `domain-partition-catalog.md`; no direct SRS/spec text — assumption to verify. |
| S-04 | `DELETE /api/products/:id` using an id that does not correspond to any existing product. | Rejected as not-found. Same UNSPECIFIED status/body caveat as S-03. | Realizes P-23/EC-17 from `domain-partition-catalog.md` (mandatory coverage group: "delete of a non-existent id"); assumption to verify. |
| S-05 | Full lifecycle: create product C, `DELETE` it, then `GET /api/products/:id` for C's id, then `DELETE` C's id again. | After the first delete, C is no longer retrievable (`GET` behaves as not-found, same caveat as S-03/S-04) and a second `DELETE` on the same id behaves identically to S-04 (delete of a non-existent id) — a deleted resource re-enters the same "does not exist" condition, so no special "already deleted" distinction is documented or expected. | srs.md FR-15 (Xóa sản phẩm); no source distinguishes "never existed" from "previously existed and was deleted" — treated as the same lifecycle condition per the only documented reading. |

## Coverage

Not applicable in `TR-*` terms (no explicit/implicit state machine exists for this
endpoint group). Lifecycle/isolation coverage: 5/5 scenarios designed against the
documented isolation invariant (srs.md L198) and the two "operate on a non-existent
resource" obligations named in the task's mandatory coverage groups (PUT and DELETE), plus
a compound re-entry scenario (S-05) that exercises `GET` and a repeated `DELETE` after
removal. No further lifecycle scenarios are supported by the two sources without inventing
unstated behavior (e.g. soft-delete vs hard-delete semantics are not documented).
