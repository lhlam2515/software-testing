# FR-16 — Execution Log

**Feature:** FR-16 — CSV Product Import
**Tester:** Lê Hoàng Lâm (23127216)
**SUT:** EShop API `http://localhost:3000`
**DB:** `apps/backend/database.sqlite` · admin: `admin@eshop.com` / `Admin123!` · user: `test@eshop.com` / `Test1234!`
**Started:** 2026-06-30

Screenshots: `homeworks/HW02/artifacts/tests/FR-16-csv-import/screenshots/`

---

## Domain Testing (EP) — TC-01 to TC-18

### TC-01 — Happy path: single valid product

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 5. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 5→6 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-01-pass-single-valid-product.png` |
| **Bug ID** | — |
| **Notes** | EC01, EC04, EC07, EC11, EC16, EC18, EC20 confirmed. |

---

### TC-02 — Happy path: batch of multiple valid products

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 6. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=3 · errors=[] · product_count 6→9 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-02-pass-batch-valid-products.png` |
| **Bug ID** | — |
| **Notes** | EC01, EC04, EC07, EC11, EC16, EC18, EC20 confirmed for 3-row batch. |

---

### TC-03 — No JWT (Unauthorized)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | No Authorization header sent. Product count before request = 9. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 401 · product_count 9→9 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-03-no-jwt-unauthorized.png` |
| **Bug ID** | — |
| **Notes** | EC02 confirmed. Missing token correctly rejected with no DB change. |

---

### TC-04 — Valid JWT but not Admin

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-16-001 |
| **Pre-condition setup** | Regular-user JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 9. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 9→10 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-001-non-admin-accepted.png` |
| **Bug ID** | BUG-16-001 |
| **Notes** | Route verifies token signature but not admin role; regular users can import products through an admin endpoint. |

---

### TC-05 — Missing `products` key in body

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 10. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 400 · product_count 10→10 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-05-missing-products-key.png` |
| **Bug ID** | — |
| **Notes** | EC05 confirmed. Missing `products` key returns 400 with no DB change. |

---

### TC-06 — `name` empty string -> entire batch rolled back

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 10. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=0 · errors=["Hàng 2: Thiếu tên sản phẩm"] · product_count 10→10 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-06-empty-name-rolled-back.png` |
| **Bug ID** | — |
| **Notes** | EC08, EC19, EC21 confirmed. Invalid empty name rejected with no DB change. |

---

### TC-07 — `name` field absent

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 10. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=0 · errors=["Hàng 2: Thiếu tên sản phẩm"] · product_count 10→10 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-07-missing-name-rolled-back.png` |
| **Bug ID** | — |
| **Notes** | EC09, EC19, EC21 confirmed. Missing `name` rejected with no DB change. |

---

### TC-08 — `price = 0` (not a positive number)

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-16-002 |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 10. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 10→11 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-08-invalid-price-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | The endpoint only checks `name`; zero, negative, non-numeric, or missing `price` values are inserted instead of rejected. |

---

### TC-09 — Negative `price`

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-16-002 |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 11. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 11→12 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-09-invalid-price-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | The endpoint only checks `name`; zero, negative, non-numeric, or missing `price` values are inserted instead of rejected. |

---

### TC-10 — `price` is a non-numeric string

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-16-002 |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 12. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 12→13 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-10-invalid-price-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | The endpoint only checks `name`; zero, negative, non-numeric, or missing `price` values are inserted instead of rejected. |

---

### TC-11 — `price` field absent

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-16-002 |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 13. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 13→14 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-11-invalid-price-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | The endpoint only checks `name`; zero, negative, non-numeric, or missing `price` values are inserted instead of rejected. |

---

### TC-12 — Atomic rollback: mixed batch (valid + invalid rows)

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-16-002 |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 14. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=3 · errors=[] · product_count 14→17 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-mixed-batch-price-zero-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | The supposed invalid row (`price = 0`) was inserted, so rollback was never triggered. The root cause is missing `price > 0` validation. |

---

### TC-13 — [Gap Probe] `products: []` (empty array)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 17. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 400 · product_count 17→17 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-13-empty-array-rejected.png` |
| **Bug ID** | — |
| **Notes** | Gap resolved: empty array is rejected with 400 and no DB change. |

---

### TC-14 — [Gap Probe] `name` longer than 255 characters

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (with deviation) |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 17. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 17→18 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-14-name-256-gap-confirmed.png` |
| **Bug ID** | — |
| **Notes** | FR-16 accepts a full 256-character name. Cross-reference limit from FR-15 is not enforced here. |

---

### TC-15 — [Gap Probe] `category_id` does not exist

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-16-003 |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 18. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 18→19 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-003-invalid-category-accepted.png` |
| **Bug ID** | BUG-16-003 |
| **Notes** | The endpoint does not validate that `category_id` exists; product rows can be inserted with broken foreign-key references. |

---

### TC-16 — [Gap Probe] `price` as numeric string ("10000")

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (with deviation) |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 19. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 19→20 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-16-price-string-coerced.png` |
| **Bug ID** | — |
| **Notes** | Lenient branch observed: string price is accepted and stored as 10000. |

---

### TC-17 — [Gap Probe] Import report response schema

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Fresh isolated rerun from seeded DB for new TCs; product count before request = 5. |
| **Executed at** | 2026-06-30 11:48 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · raw JSON = `{"message":"Import hoàn tất: 1/1 sản phẩm được thêm","inserted":1,"errors":[]}` · top-level keys: `message:string`, `inserted:number`, `errors:array` · product_count 5→6 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-17-schema-probe-response.png` |
| **Bug ID** | — |
| **Notes** | Gap resolved: the success response schema is `message`, `inserted`, and `errors`; there is no separate `failed` field. "Schema Probe Product" was created successfully with `price=75000`, so the captured schema is from a true success path, not an error branch. |

---

### TC-18 — [Gap Probe] All-rows-invalid batch: rollback and report completeness

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-16-002 |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Fresh isolated rerun from seeded DB for new TCs; product count before request = 6. |
| **Executed at** | 2026-06-30 11:48 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · raw JSON = `{"message":"Import hoàn tất: 3/3 sản phẩm được thêm","inserted":3,"errors":[]}` · product_count 6→9 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-all-invalid-batch-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | All three rows with invalid prices were inserted: `Invalid Row 1 (0)`, `Invalid Row 2 (-1)`, and `Invalid Row 3 ("abc")`. This is the same root cause as BUG-16-002: the endpoint does not validate `price`, so there is no rollback and the report misleadingly claims `3/3` success with `errors=[]`. |

---

## Boundary Value Analysis (BVA) — TC-BVA-01 to TC-BVA-05

### TC-BVA-01 — `price = 0` (ON boundary — turning point)

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL — BUG-16-002 |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 20. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 20→21 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-BVA-01-invalid-price-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | The endpoint only checks `name`; zero, negative, non-numeric, or missing `price` values are inserted instead of rejected. |

---

### TC-BVA-02 — `price = 1` (minimum valid — LB+1)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 21. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 21→22 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-BVA-02-price-one-accepted.png` |
| **Bug ID** | — |
| **Notes** | Boundary accepted correctly. Minimum valid `price = 1` persists in DB. |

---

### TC-BVA-03 — `name` = 254 chars (UB-1)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 22. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 22→23 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-BVA-03-name-254-accepted.png` |
| **Bug ID** | — |
| **Notes** | UB-1 accepted. Stored product name length remains 254. |

---

### TC-BVA-04 — `name` = 255 chars (UB = ON boundary)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 23. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 23→24 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-BVA-04-name-255-accepted.png` |
| **Bug ID** | — |
| **Notes** | Boundary accepted correctly. Stored product name length remains 255. |

---

### TC-BVA-05 — `name` = 256 chars (UB+1, over boundary)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (with deviation) |
| **Pre-condition setup** | Admin JWT acquired via `POST /api/login`; category_id=1 exists. Product count before request = 24. |
| **Executed at** | 2026-06-30 11:36 |
| **Actual result** | POST /api/admin/import-products → HTTP 200 · inserted=1 · errors=[] · product_count 24→25 |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-BVA-05-name-256-gap-confirmed.png` |
| **Bug ID** | — |
| **Notes** | UB+1 accepted. FR-16 does not enforce the 255-character limit at import time. |

---

## Execution Summary

| Metric | Count |
| :----- | :---- |
| TC Designed (EP) | 18 |
| TC Designed (BVA) | 5 |
| TC Executed | 23 / 23 |
| Passed | 11 |
| Failed | 9 (TC-04, TC-08, TC-09, TC-10, TC-11, TC-12, TC-15, TC-18, TC-BVA-01) |
| Pass with deviation | 3 (TC-14, TC-16, TC-BVA-05) |
| Bugs found | 3 (BUG-16-001, BUG-16-002, BUG-16-003) |

## Bugs Discovered

| Bug ID | TC | Description | Severity |
| :----- | :- | :---------- | :------- |
| BUG-16-001 | TC-04 | Non-admin JWT can call /api/admin/import-products | High |
| BUG-16-002 | TC-08, TC-18 | Invalid `price` values are accepted and committed by import endpoint | High |
| BUG-16-003 | TC-15 | Import allows non-existent category_id values and creates dangling product records | High |
