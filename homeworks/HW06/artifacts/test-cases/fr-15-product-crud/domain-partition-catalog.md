# FR-15 Product CRUD — Domain Partition Catalog (EP + BVA)

Applies to `POST /api/products` and `PUT /api/products/:id` request bodies (identical
documented shape, api_specification.md lines 108-118) unless noted otherwise. Path
parameter `:id` rows apply to `PUT` and `DELETE`.

BVA model: **3-value BVA** (boundary + nearest value on each side) for the two ordered,
documented boundaries (`name` length ≤ 255, `price` > 0). Chosen per
`equivalence-partitioning-and-bva.md`: the assignment does not mandate the course 9-point
model, and 3-value is the documented default when neighboring values are representable.
`category_id` and path `:id` are set/reference conditions, not ordered ranges — BVA does
not apply to them (EP only).

| Row ID | Variable | Location | Coverage ID | Class / boundary position | Concrete value or rule | Expected behavior | Trace |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P-01 | `name` | body (POST/PUT) | EC-01 | Invalid: missing | field absent from JSON body | Rejected — `name` is required (srs.md FR-15 line 195) | srs.md L195 |
| P-02 | `name` | body (POST/PUT) | EC-02 | Invalid: empty string | `""` | Rejected — required means non-empty (srs.md FR-15 line 195) | srs.md L195 |
| P-03 | `name` | body (POST/PUT) | EC-03 | Valid: within-bound string | `"Áo thun nam"` | Accepted | srs.md L195; api_spec L112 |
| P-04 | `name` | body (POST/PUT) | BVA-01 | Boundary: `UB-1` (254 chars) | 254-character string | Accepted — below the documented max | srs.md L195 |
| P-05 | `name` | body (POST/PUT) | BVA-02 | Boundary: `UB` (255 chars) | 255-character string | Accepted — "tối đa 255 ký tự" reads as inclusive; UNSPECIFIED whether the implementation actually accepts exactly 255, flagged for verification | srs.md L195 |
| P-06 | `name` | body (POST/PUT) | BVA-03 | Boundary: `UB+1` (256 chars) | 256-character string | Rejected — exceeds the documented max | srs.md L195 |
| P-07 | `price` | body (POST/PUT) | EC-04 | Invalid: missing | field absent from JSON body | Rejected — `price` is required (srs.md FR-15 line 196) | srs.md L196 |
| P-08 | `price` | body (POST/PUT) | EC-05 | Invalid: wrong type | `"one hundred"` (string, non-numeric) | Rejected — UNSPECIFIED exact status/error shape; type mismatch is not directly addressed by FR-15 text, flagged as inferred from "phải là số" (must be a number) | srs.md L196 |
| P-09 | `price` | body (POST/PUT) | EC-06 | Valid: positive number | `100000` | Accepted | srs.md L196; api_spec L113 |
| P-10 | `price` | body (POST/PUT) | BVA-04 | Boundary: `LB-1` relative to 0 | `-1` | Rejected — not positive (srs.md FR-15 line 196) | srs.md L196 |
| P-11 | `price` | body (POST/PUT) | BVA-05 | Boundary: `LB` = 0 | `0` | Rejected — "phải là số dương (> 0)" excludes zero | srs.md L196 |
| P-12 | `price` | body (POST/PUT) | BVA-06 | Boundary: `LB+1` (smallest representable positive step) | `1` | Accepted — smallest positive value satisfying `> 0`; UNSPECIFIED whether decimal precision below 1 is supported (no precision documented) | srs.md L196 |
| P-13 | `category_id` | body (POST/PUT) | EC-07 | Invalid: missing | field absent from JSON body | Rejected — `category_id` is required (srs.md FR-15 line 197) | srs.md L197 |
| P-14 | `category_id` | body (POST/PUT) | EC-08 | Invalid: non-existent reference | `999999` (no such category) | Rejected — "phải chọn từ danh sách có sẵn" requires referential validity against `GET /api/categories` | srs.md L197; api_spec L120-122 |
| P-15 | `category_id` | body (POST/PUT) | EC-09 | Valid: existing reference | id of a category returned by `GET /api/categories` | Accepted | srs.md L197 |
| P-16 | `category_id` | body (POST/PUT) | EC-10 | Invalid: wrong type | `"electronics"` (string, not an id) | Rejected — UNSPECIFIED exact status/error shape; type mismatch inferred from "chọn từ danh sách" implying an id reference, not directly stated | srs.md L197 |
| P-17 | `description` | body (POST/PUT) | EC-11 | Requiredness UNSPECIFIED: missing | field absent from JSON body | UNSPECIFIED — FR-15's input-constraint list (srs.md lines 194-197) does not name `description`; not invented as required or optional | api_spec L108-118 (example only, no constraint text) |
| P-18 | `description` | body (POST/PUT) | EC-12 | Valid: present string | `"Mô tả sản phẩm"` | Accepted (documented example field, api_spec L114) | api_spec L114 |
| P-19 | `imageUrl` | body (POST/PUT) | EC-13 | Requiredness UNSPECIFIED: missing | field absent from JSON body | UNSPECIFIED — same gap as `description` | api_spec L108-118 |
| P-20 | `imageUrl` | body (POST/PUT) | EC-14 | Valid: present string | `"http://example.com/img.png"` | Accepted (documented example field, api_spec L115) | api_spec L115 |
| P-21 | `id` (path) | path (PUT/DELETE) | EC-15 | Valid: existing product id | id of a product created via `POST /api/products` | Operation proceeds on that resource | api_spec L106-107 |
| P-22 | `id` (path) | path (PUT/DELETE) | EC-16 | Invalid: malformed/non-numeric | `"abc"` | UNSPECIFIED exact status/error shape — path parameter type is not documented by either source | api_spec L106-107 |
| P-23 | `id` (path) | path (PUT/DELETE) | EC-17 | Invalid: non-existent numeric id | `999999` | Realized as a lifecycle case, not a standalone EP test row — see `S-03`/`S-04` in `state-model.md` (cross-referenced here to keep this parameter's coverage traceable; not double-counted in the master suite) | srs.md — no direct text; treated as an assumption to verify |

## Coverage summary

- `name`: EC-01..03 + BVA-01..03 = 6 coverage ids.
- `price`: EC-04..06 + BVA-04..06 = 6 coverage ids.
- `category_id`: EC-07..10 = 4 coverage ids.
- `description`: EC-11..12 = 2 coverage ids (both UNSPECIFIED-flagged for requiredness).
- `imageUrl`: EC-13..14 = 2 coverage ids (both UNSPECIFIED-flagged for requiredness).
- `id` (path): EC-15..17 = 3 coverage ids (EC-17 realized in `state-model.md`).
