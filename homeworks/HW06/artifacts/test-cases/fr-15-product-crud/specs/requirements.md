# FR-15 Product CRUD (Admin) - Requirements Extract

Source: `docs/eshop-sut/api_specification.md` section 3.3 (Thêm / Sửa / Xóa Sản phẩm,
lines 103-118); `docs/eshop-sut/srs.md` FR-15 (lines 191-198, Quản lý Sản phẩm) and FR-12
(lines 174-179, Kiểm soát truy cập, access control governing this endpoint group); FR-14
(lines 186-189, Category CRUD, for the `category_id` referential-validity source) and
section 3.4 (`GET /api/categories`, api_specification.md lines 120-125, the "danh sách có
sẵn" that `category_id` must be chosen from).

## Functional behavior

- Three operations share one request/response shape family:
  - `POST /api/products` — create (api_specification.md line 105).
  - `PUT /api/products/:id` — update (api_specification.md line 106).
  - `DELETE /api/products/:id` — delete (api_specification.md line 107).
- Documented request body for create/update (api_specification.md lines 108-118):
  `name`, `price`, `description`, `imageUrl`, `category_id`.
- All three operations are gated by FR-12 (srs.md lines 177): valid JWT AND
  `role = 'admin'` in the token — not merely token presence (srs.md line 179, "không chỉ
  kiểm tra sự tồn tại của Token").
- FR-15 input constraints (srs.md lines 194-197):
  - `name`: required ("bắt buộc"), max 255 characters ("tối đa 255 ký tự").
  - `price`: required, must be a positive number > 0 ("phải là số dương").
  - `category_id` ("Danh mục"): required, must be chosen from the existing list
    ("phải chọn từ danh sách có sẵn") — implies referential validity against the
    categories resource (FR-14 / section 3.4).
- Isolation invariant (srs.md line 198): "Khi Sửa một sản phẩm, chỉ sản phẩm đó bị thay
  đổi — các sản phẩm khác giữ nguyên" — updating product A must leave every other
  product's stored fields unchanged. Modeled as lifecycle/isolation coverage, not a
  state-transition model (see `../state-model.md`).
- `description` and `imageUrl` appear in the example body (api_specification.md lines
  114-115) but are not named in FR-15's "Ràng buộc đầu vào" (input constraints) list —
  recorded as unspecified whether required.

## Business rules

- Auth + admin role required on all three operations (srs.md FR-12, lines 177-179).
- `name`: required, max 255 chars (srs.md FR-15 line 195).
- `price`: required, > 0 (srs.md FR-15 line 196).
- `category_id`: required, must reference an existing category (srs.md FR-15 line 197).
- Editing one product must not mutate any other product's data (srs.md FR-15 line 198).
- No `role` or admin field appears anywhere in the documented request body for these
  operations (api_specification.md lines 108-118) — any such field submitted by the
  client would be undocumented input on this endpoint family (relevant to SEC-06 mass
  assignment framing even though SEC-06's own source text names the profile-update
  endpoint specifically; see `security-requirement.md`).

## Unspecified constraints (do not invent)

- HTTP status code and body shape for a successful create/update (no example given in
  api_specification.md 3.3, unlike sections 1.1/1.2 which document example success
  bodies).
- HTTP status code and body shape for a successful delete.
- HTTP status/body for editing or deleting a non-existent `id` (no source documents 404
  behavior for this endpoint family; 404 used in test design as an assumption to verify,
  not an asserted fact).
- Exact rejection status code and error-body shape for name/price/category_id validation
  failures. No error envelope (field names, structure) is documented anywhere in
  api_specification.md for any endpoint.
- Whether `name` at exactly 255 characters is accepted (boundary itself is stated; the
  accept/reject behavior exactly at 255 vs 256 is inferred from "tối đa 255", not given
  as an explicit test example).
- Exact numeric precision/type enforcement for `price` (integer vs decimal, upper bound)
  beyond "must be > 0".
- Path parameter `:id` type (numeric vs string) and behavior on a malformed/non-numeric
  id (e.g. `abc`) — not documented.
- Whether `description` and `imageUrl` are required, and any length/format constraints
  on them.
- Whether the create/update response echoes the submitted product object.

## State classification

No meaningful state at the request-parameter level — no status field is accepted or
returned by any of the three operations. Per the skill's Stage 3 rule, product
CRUD is modeled as **lifecycle adaptation / resource-isolation coverage**, not an
explicit/implicit state machine: it covers create → read-back, update-isolation
(srs.md FR-15 line 198), and edit/delete of a non-existent resource. See
`../state-model.md`.
