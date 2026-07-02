# FR-16 - Execution Log

**Feature:** FR-16 - CSV Product Import  
**Tester:** Le Hoang Lam (23127216)  
**SUT:** EShop admin `http://localhost:5174` and API `http://localhost:3000`  
**DB:** `apps/backend/database.sqlite`  
**Started:** 2026-07-02

Screenshots: `homeworks/HW02/artifacts/tests/FR-16-csv-import/screenshots/`

---

## Domain Testing (EP) - TC-01 to TC-19

### TC-01 - Happy path: single valid product

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin login through UI, `category_id=1` confirmed available through seeded data |
| **Executed at** | 2026-07-02 13:46 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, `errors=[]`, product count `5 -> 6`, `"Basic Men's T-Shirt"` present in `GET /api/products` |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-01-pass-single-valid-product.png` |
| **Bug ID** | - |
| **Notes** | EC01, EC04, EC07, EC11, EC16, EC18, EC20 confirmed. |

### TC-02 - Happy path: 3 valid products

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin login through UI, product baseline after TC-01 = 6 |
| **Executed at** | 2026-07-02 13:47 |
| **Actual result** | UI report: `Import hoàn tất: 3/3 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=3`, `errors=[]`, product count `6 -> 9`, all 3 new names found |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-02-pass-batch-valid-products.png` |
| **Bug ID** | - |
| **Notes** | EC01, EC04, EC07, EC11, EC16, EC18, EC20 confirmed for a multi-row batch. |

### TC-03 - No JWT

Fallback Reason: the Admin UI does not expose an import action without a token because the import screen is behind the login shell. The no-token branch was executed through a direct browser `fetch` to the same endpoint.

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | No `Authorization` header sent |
| **Executed at** | 2026-07-02 13:48 |
| **Actual result** | API cross-check: HTTP 401, body `{"error":"Unauthorized"}`, product count unchanged `9 -> 9` |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-03-no-jwt-unauthorized.png` |
| **Bug ID** | - |
| **Notes** | EC02 confirmed. |

### TC-04 - Valid JWT but not Admin

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-16-001 |
| **Pre-condition setup** | Regular-user token obtained through `POST /api/login`, injected into Admin local storage, then Admin UI reloaded |
| **Executed at** | 2026-07-02 13:49 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `9 -> 10`, `"Regular User Import"` created |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-001-non-admin-accepted.png` |
| **Bug ID** | BUG-16-001 |
| **Notes** | EC03 failed. A regular user can import through the admin route. |

### TC-05 - Missing `products` key

Fallback Reason: the visible CSV flow always constructs a `products` array, so the missing-key body cannot be produced through the UI controls. Executed through a direct browser `fetch` after confirming the UI only offers `Import 0 sản phẩm`.

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin token obtained through login; request body `{}` |
| **Executed at** | 2026-07-02 13:50 |
| **Actual result** | API cross-check: HTTP 400, body `{"error":"Không có dữ liệu để import"}`, product count unchanged `10 -> 10` |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-05-missing-products-key.png` |
| **Bug ID** | - |
| **Notes** | EC05 confirmed. |

### TC-06 - Empty `name`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin UI import page open; product count baseline 10 |
| **Executed at** | 2026-07-02 13:51 |
| **Actual result** | UI report shows a failed import. API cross-check: HTTP 200, `inserted=0`, `errors=["Hàng 2: Thiếu tên sản phẩm"]`, product count `10 -> 10` |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-06-empty-name-rolled-back.png` |
| **Bug ID** | - |
| **Notes** | EC08, EC19, EC21 confirmed. |

### TC-07 - Missing `name` field

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Admin UI import page open; CSV omits the `name` header |
| **Executed at** | 2026-07-02 13:52 |
| **Actual result** | UI report shows a failed import. API cross-check: HTTP 200, `inserted=0`, `errors=["Hàng 2: Thiếu tên sản phẩm"]`, product count `10 -> 10` |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-07-missing-name-rolled-back.png` |
| **Bug ID** | - |
| **Notes** | EC09, EC19, EC21 confirmed. |

### TC-08 - `price = 0`

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-16-002 |
| **Pre-condition setup** | Admin UI import page open; product count baseline 10 |
| **Executed at** | 2026-07-02 13:53 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `10 -> 11`, `"Test zero price"` created |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-08-invalid-price-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | EC12 failed. `price > 0` is not enforced. |

### TC-09 - Negative `price`

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-16-002 |
| **Pre-condition setup** | Admin UI import page open; product count baseline 11 |
| **Executed at** | 2026-07-02 13:54 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `11 -> 12`, `"Test negative price"` created |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-09-invalid-price-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | EC13 failed for the same root cause as TC-08. |

### TC-10 - Non-numeric `price`

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-16-002 |
| **Pre-condition setup** | Admin UI import page open; product count baseline 12 |
| **Executed at** | 2026-07-02 13:54 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `12 -> 13`, `"Test bad price"` created |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-10-invalid-price-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | EC14 failed for the same root cause as TC-08. |

### TC-11 - Missing `price` field

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-16-002 |
| **Pre-condition setup** | Admin UI import page open; product count baseline 13 |
| **Executed at** | 2026-07-02 13:55 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `13 -> 14`, `"Test no price"` created |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-11-invalid-price-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | EC15 failed for the same root cause as TC-08. |

### TC-12 - Mixed batch atomic rollback

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-16-002 |
| **Pre-condition setup** | Admin UI import page open; product count baseline 14 |
| **Executed at** | 2026-07-02 13:55 |
| **Actual result** | UI report: `Import hoàn tất: 3/3 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=3`, `errors=[]`, product count `14 -> 17`, both valid rows committed |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-mixed-batch-price-zero-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | EC19 failed indirectly because the invalid row was never rejected, so rollback never happened. |

### TC-13 - Empty `products` array

Fallback Reason: a header-only CSV leaves the UI button as `Import 0 sản phẩm` and disabled, so the empty-array request cannot be submitted through the visible controls. Executed through a direct browser `fetch` after verifying the disabled state.

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Header-only CSV loaded into the UI, direct API request body `{"products":[]}` |
| **Executed at** | 2026-07-02 13:56 |
| **Actual result** | UI cross-check: button stayed disabled. API cross-check: HTTP 400, body `{"error":"Không có dữ liệu để import"}`, product count unchanged `17 -> 17` |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-13-empty-array-rejected.png` |
| **Bug ID** | - |
| **Notes** | EC06 resolved as rejection. |

### TC-14 - `name` longer than 255 characters

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-16-004 |
| **Pre-condition setup** | 256-character `name` CSV prepared through the UI flow |
| **Executed at** | 2026-07-02 13:56 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `17 -> 18`, a product with `name.length = 256` exists |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-14-name-256-gap-confirmed.png` |
| **Bug ID** | BUG-16-004 |
| **Notes** | EC failed: FR-16 does not enforce the 255-character `name` limit that FR-15 specifies. Cross-feature invariant violation, not merely an observed gap. |

### TC-15 - Invalid `category_id`

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-16-003 |
| **Pre-condition setup** | `GET /api/categories` confirmed category `99999` absent; UI import page open |
| **Executed at** | 2026-07-02 13:57 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `18 -> 19`, `"Test invalid category"` created |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-003-invalid-category-accepted.png` |
| **Bug ID** | BUG-16-003 |
| **Notes** | EC17 failed. The import route accepts a non-existent category reference. |

### TC-16 - `price` as numeric string

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (with deviation) |
| **Pre-condition setup** | UI CSV import, product count baseline 19 |
| **Executed at** | 2026-07-02 13:57 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `19 -> 20`, `"Test price as string"` stored with `price=10000` |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-16-price-string-coerced.png` |
| **Bug ID** | - |
| **Notes** | Gap branch observed: string prices are accepted and coerced successfully. |

### TC-17 - Response schema probe

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | UI CSV import, product count baseline 20 |
| **Executed at** | 2026-07-02 13:58 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, raw JSON `{"message":"Import hoàn tất: 1/1 sản phẩm được thêm","inserted":1,"errors":[]}`, product count `20 -> 21`, `"Schema Probe Product"` present |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-17-schema-probe-response.png` |
| **Bug ID** | - |
| **Notes** | Actual response schema is `message`, `inserted`, `errors`. |

### TC-18 - All rows invalid batch

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-16-002 |
| **Pre-condition setup** | UI CSV import, three rows with `price=0`, `price=-1`, `price=abc`, product count baseline 21 |
| **Executed at** | 2026-07-02 13:58 |
| **Actual result** | UI report: `Import hoàn tất: 3/3 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=3`, `errors=[]`, product count `21 -> 24` |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-18-all-invalid-report-gap.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | Because price validation is absent, the intended all-fail rollback path never occurs. |

### TC-19 [Gap Probe] - CSV file extension enforcement and JSON translation at the input layer

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-16-005 |
| **Pre-condition setup** | Admin login through UI; category `id=1` confirmed available; `products.txt` and `products.csv` prepared with byte-identical CSV-formatted content (header row + one valid data row) |
| **Executed at** | 2026-07-02 14:57 |
| **Actual result** | Branch 1 (`.txt`, wrong extension): the `Choose File` dialog accepted `products.txt` without rejection; the UI rendered the same `Xem trước (1 dòng)` preview table as a normal `.csv` upload and enabled `Import 1 sản phẩm`. Clicking Import produced `✅ Import hoàn tất: 1/1 sản phẩm được thêm`. Network panel request #26: `POST /api/admin/import-products`, `content-type: application/json`, request body `{"products":[{"name":"TC19 Gap Probe Product","price":"15000",...,"category_id":1}]}`, response `{"message":"Import hoàn tất: 1/1 sản phẩm được thêm","inserted":1,"errors":[]}`. Branch 2 (`.csv`, correct extension, identical content): request #35 captured an identical request/response pair (same `content-type: application/json`, same JSON body shape, same success message). `GET /api/products` confirms count `29 -> 31` (2 products named `TC19 Gap Probe Product` created, one per branch) |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-19-txt-extension-accepted-preview.png`, `artifacts/tests/FR-16-csv-import/screenshots/TC-19-txt-import-success-json-body.png`, `artifacts/tests/FR-16-csv-import/screenshots/TC-19-csv-comparison-identical-json-body.png` |
| **Bug ID** | BUG-16-005 |
| **Notes** | EC23 failed: the Admin UI does not enforce the `.csv` extension client-side, contradicting the SRS requirement that import files be `.csv`. Second half of the Spec Conflict confirmed as expected, not a defect: the frontend does convert the parsed rows into a JSON body (`Content-Type: application/json`, `{"products":[...]}`) before sending, exactly as the Feature Overview states, so no separate bug is raised for the JSON-translation branch. |

---

## Boundary Value Analysis (BVA) - TC-BVA-01 to TC-BVA-05

### TC-BVA-01 - `price = 0`

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-16-002 |
| **Pre-condition setup** | UI CSV import, product count baseline 24 |
| **Executed at** | 2026-07-02 13:59 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `24 -> 25`, `"BVA price zero"` created |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/BUG-16-002-bva-price-zero-accepted.png` |
| **Bug ID** | BUG-16-002 |
| **Notes** | ON boundary defect re-confirmed. |

### TC-BVA-02 - `price = 1`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | UI CSV import, product count baseline 25 |
| **Executed at** | 2026-07-02 13:59 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `25 -> 26`, `"BVA price one"` stored with `price=1` |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-BVA-02-price-one-valid.png` |
| **Bug ID** | - |
| **Notes** | Minimum valid positive price accepted. |

### TC-BVA-03 - `name.length = 254`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | UI CSV import with 254-character `name`, product count baseline 26 |
| **Executed at** | 2026-07-02 14:00 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `26 -> 27`, a product with `name.length = 254` exists |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-BVA-03-name-254-valid.png` |
| **Bug ID** | - |
| **Notes** | UB-1 accepted. |

### TC-BVA-04 - `name.length = 255`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | UI CSV import with 255-character `name`, product count baseline 27 |
| **Executed at** | 2026-07-02 14:00 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `27 -> 28`, a product with `name.length = 255` exists |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-BVA-04-name-255-valid.png` |
| **Bug ID** | - |
| **Notes** | ON boundary accepted. |

### TC-BVA-05 - `name.length = 256`

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-16-004 |
| **Pre-condition setup** | UI CSV import with 256-character `name`, product count baseline 28 |
| **Executed at** | 2026-07-02 14:01 |
| **Actual result** | UI report: `Import hoàn tất: 1/1 sản phẩm được thêm`. API cross-check: HTTP 200, `inserted=1`, product count `28 -> 29`, a product with `name.length = 256` exists |
| **Screenshot** | `artifacts/tests/FR-16-csv-import/screenshots/TC-BVA-05-name-256-gap.png` |
| **Bug ID** | BUG-16-004 |
| **Notes** | UB+1 boundary confirms BUG-16-004 (same root cause as TC-14): FR-16 accepts 256 characters instead of enforcing the FR-15 255-character limit. |

---

## Execution Summary

| Metric | Count |
| :----- | :---- |
| TC Designed (EP) | 19 |
| TC Designed (BVA) | 5 |
| TC Executed | 24 / 24 |
| Passed | 11 |
| Failed | 12, TC-04, TC-08, TC-09, TC-10, TC-11, TC-12, TC-14, TC-15, TC-18, TC-19, TC-BVA-01, TC-BVA-05 |
| Pass with deviation | 1, TC-16 |
| Bugs found | 5, BUG-16-001 to BUG-16-005 |

## Bugs Discovered

| Bug ID | TC | Description | Severity |
| :----- | :- | :---------- | :------- |
| BUG-16-001 | TC-04 | Admin import route accepts a regular-user token and imports products successfully | High |
| BUG-16-002 | TC-08, TC-09, TC-10, TC-11, TC-12, TC-18, TC-BVA-01 | Import route does not validate `price > 0`, so invalid rows are inserted and atomic rollback never triggers | High |
| BUG-16-003 | TC-15 | Import route accepts a non-existent `category_id` | High |
| BUG-16-004 | TC-14, TC-BVA-05 | Import route does not enforce the FR-15 255-character `name` limit; names up to at least 256 characters are accepted | Medium |
| BUG-16-005 | TC-19 | Admin UI accepts a file with a non-`.csv` extension (e.g., `.txt`) and imports it identically to a `.csv` file, contradicting the SRS `.csv`-only requirement | Low |
