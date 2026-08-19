# FR-16 — Domain Testing: CSV Product Import

**Feature:** FR-16 — CSV Product Import
**Technique:** Domain Testing (Equivalence Partitioning)
**Spec source:** `docs/eshop-sut/srs.md` §6 FR-16, FR-15 (cross-ref) · `docs/eshop-sut/api_specification.md` §6.3
**API endpoint:** `POST /api/admin/import-products`
**Author:** Le Hoang Lam — 23127216

---

## 1. Feature Overview

FR-16 allows Admins to import multiple products at once. The SRS describes uploading a CSV file (`.csv` extension, header row `name,price,description,imageUrl,category_id`, RFC 4180 quoting), but the API spec accepts a **JSON body** `{"products": [...]}` — meaning CSV parsing happens at the **frontend layer**; the backend only receives JSON. This Spec Conflict means pure API-level testing (TC-01 onward) only exercises the JSON body downstream of that conversion; the file-layer behavior itself (`.csv` extension enforcement, and confirmation that the browser actually sends JSON, not raw CSV) is only observable through the browser and is probed separately by TC-19 (Gap Probe).

Pre-import validation: `name` must not be empty and `price` must be positive (`> 0`). If any row violates these rules, the entire batch must be **rolled back** (atomic all-or-nothing). The system returns a clear report: number of rows that succeeded, number that failed, and the reason for each failure.

Cross-feature note: FR-15 caps `name` at 255 characters and requires `category_id` to reference an existing category — FR-16 does not repeat these two constraints, creating two Implicit Gaps that need probing.

---

## 2. Step 1 — Variables & Constraints

| Variable | Type | Description | Valid Domain / Boundaries | Dependencies & Constraints | Expected Error / Behavior |
|:---|:---|:---|:---|:---|:---|
| **Authorization** | System State | Admin JWT token sent with the request | Valid token + `admin` role | `Authorization: Bearer <token>` header required for all `/api/admin/*` routes | Rejected - authentication required or admin role required |
| **`products`** (array) | Input | List of products to import (key in JSON body) | Array with ≥ 1 element | Key must exist in the request body | Rejected - request body missing `products` |
| **`name`** (per row) | Input (string) | Product name | Required, non-empty; max 255 characters (FR-15 cross-ref) | Must not be empty string; each row must have this field | Empty or missing → row invalid, entire batch rolled back |
| **`price`** (per row) | Input (numeric) | Product price | Must be a positive number `> 0` (FR-16 explicit) | Validated before commit; 0, negative, or non-numeric not accepted | Invalid → row invalid, entire batch rolled back |
| **`description`** (per row) | Input (string) | Product description | Optional — no constraint in FR-16 or FR-15 | May be `""` or omitted | Any value accepted |
| **`imageUrl`** (per row) | Input (string) | Product image URL | Optional | May be `""` (as shown in the API example) | Any value accepted |
| **`category_id`** (per row) | Input (integer) | Product category ID | Must be an ID that exists in the categories table | FR-15: "category is required and must be chosen from the existing list"; FR-16 does **not** repeat this constraint | Behavior when ID does not exist: **Gap** |
| **DB Category State** | System State | Whether the category exists in the DB | At least one valid category must exist as a pre-condition | Pre-condition for happy-path tests | N/A — setup condition |
| **Atomic Rollback** | Output Behavior | If any row is invalid, the entire import is rolled back | All-or-nothing: 0 products committed if 1+ rows are invalid | This is the core invariant of FR-16 | No rollback → critical BUG |
| **Import Report** | Output | Report: number of rows succeeded, number failed, and reasons | Must show both counts and the reason for each failed row | SRS requires "a clear report" | Report missing reasons is a defect |
| **CSV file (client-side)** | Input (file) | The file selected via `Choose File` in the Admin UI import panel | SRS: `.csv` extension, header row `name,price,description,imageUrl,category_id`, RFC 4180 quoting; parsed into the `products` JSON array by the frontend before the API call | Selected via native file picker; only reaches the browser, never the backend directly | Unclear whether the UI enforces the `.csv` extension — **Spec Conflict / Gap**, probed by TC-19 |

### Implicit Gaps & Spec Conflicts

| Variable | Gap / Conflict | Risk | Coverage / Decision |
|:---|:---|:---|:---|
| **Spec Conflict — Input layer** | SRS: "upload CSV file" with `.csv` extension, header row, RFC 4180. API Spec: accepts JSON body `{"products": [...]}`. Backend does not receive CSV — CSV parsing is a frontend concern. | Testing CSV-specific constraints (extension, header row, quoting) cannot be done at the API level; separate E2E frontend tests are required. Probed by TC-19 (Gap Probe). | Covered — TC-19 (EC23, Gap Probe) |
| **`category_id` validation** | FR-16 only validates `name` and `price`. FR-15 requires a valid category. It is unclear whether the import endpoint enforces this constraint. | If not validated, products with dangling foreign keys will be committed → corrupt data. | Covered — TC-15 (EC17, Gap Probe) |
| **`name` max 255 chars** | FR-15 sets a 255-char limit. FR-16 does not repeat it. It is unclear whether the import enforces this. | Import may allow names > 255 chars → truncation or error depending on DB schema. | Covered — TC-14 (EC10, Gap Probe) + TC-BVA-03/04/05 (bva.md, 3-point boundary at 255) |
| **Empty `products` array** | Spec does not define behavior when `products: []`. | HTTP 400 or HTTP 200 with "0 imported"? Undefined. | Covered — TC-13 (EC06, Gap Probe) |
| **`price` type coercion** | API example shows `"price": 10000` (number). Frontend CSV parsing may produce `"price": "10000"` (string). Does the backend coerce? | `"10000"` and `"abc"` are both strings — if the backend does not parse, valid-looking prices get rejected. | Covered — TC-16 (EC22, Gap Probe) |
| **Report response schema** | SRS says "clear report" but the API spec does not define the response body schema for this endpoint (no example response). | Unknown which fields to verify: `imported`, `failed`, `errors[]`? | Covered — TC-17 (Student-added Gap Probe) |
| **Rollback scope** | SRS says "the entire import must be rolled back" → all-or-nothing. Behavior when all rows fail is not addressed separately. | If the implementation does per-row commits instead of a batch transaction, partial imports will occur — violating atomicity. | Covered — TC-18 (Student-added Gap Probe) |

---

## 3. Step 2 — Equivalence Classes

### Group 1: Authorization (Must-Be Rule + Set Rule)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| Authorization | **EC01** | Valid admin JWT present in `Authorization: Bearer <token>` header | Valid | Proceeds to import logic |
| Authorization | **EC02** | No JWT (missing Authorization header) | Invalid | Rejected - authentication required |
| Authorization | **EC03** | Valid JWT but user is not an admin (regular user) | Invalid | Rejected - admin permission required |

### Group 2: `products` — Key presence & array size (Must-Be Rule + Gap Rule)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `products` key | **EC04** | `products` key present in body, array has ≥ 1 element | Valid | Proceeds to validate each row |
| `products` key | **EC05** | `products` key entirely absent from body | Invalid | Rejected - request body missing `products` |
| `products` array | **EC06** | `products: []` — empty array | Invalid/Gap | **Gap**: Spec undefined — may be 400 or 200 with "0 imported" |

### Group 3: `name` per row (Must-Be Rule + Range Rule via FR-15 cross-ref)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `name` | **EC07** | Non-empty string, 1–255 chars | Valid | Row valid (name dimension) |
| `name` | **EC08** | Empty string `""` | Invalid | Row invalid → entire batch rolled back; reason: "name is required" |
| `name` | **EC09** | `name` field absent (null / key not present) | Invalid | Row invalid → entire batch rolled back |
| `name` | **EC10** | String > 255 characters (cross-ref FR-15; FR-16 silent) | Invalid/Gap | **Gap**: unclear whether 255-char limit is enforced |

### Group 4: `price` per row (Range Rule)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `price` | **EC11** | Positive number, e.g. `10000` | Valid | Row valid (price dimension) |
| `price` | **EC12** | Zero (`0`) — not a positive number | Invalid | Row invalid → batch rolled back; reason: price must be positive |
| `price` | **EC13** | Negative number (e.g., `-1`) | Invalid | Row invalid → batch rolled back |
| `price` | **EC14** | Non-numeric string (e.g., `"abc"`) | Invalid | Row invalid → batch rolled back |
| `price` | **EC15** | `price` field absent | Invalid | Row invalid → batch rolled back |
| `price` type | **EC22** | String representation of a positive number (e.g., `"10000"`) — may come from CSV parsing | Invalid/Gap | **Gap**: does the backend coerce string → number? |

### Group 5: `category_id` per row (Must-Be Rule + Existence — Gap Rule)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `category_id` | **EC16** | Category ID exists in the DB | Valid | Row valid (category dimension) |
| `category_id` | **EC17** | Category ID does **not** exist in the DB | Invalid/Gap | **Gap**: FR-16 unspecified; may be 400 or commit with dangling FK |

### Group 6: Atomic Rollback Behavior (Splitting Rule — System Behavior Output)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| Batch result | **EC18** | All rows are valid | Valid | All products committed; DB changes persist |
| Batch result | **EC19** | At least 1 row is invalid | Invalid | **0 products committed** — full rollback; DB unchanged |

### Group 7: Import Report (Output — Splitting Rule)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| Report — success | **EC20** | All rows succeeded | Valid | Report: `total_imported = N`, `total_failed = 0`, no error list |
| Report — failure | **EC21** | One or more rows failed | Invalid | Report: `total_imported = 0`, `total_failed = M`, reason listed for each failed row |

### Group 8: CSV File Format — Frontend-only layer (Gap Rule)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| File extension | **EC23** | File selected via `Choose File` does not have a `.csv` extension (e.g., `.txt` with identical CSV-formatted content) | Invalid/Gap | **Gap**: SRS requires a `.csv` extension, but it is unclear whether the Admin UI enforces this client-side before parsing |

**Total: 23 ECs** (EC01–EC23, with 6 Invalid/Gap ECs: EC06, EC10, EC17, EC22, EC23, and the gap-context EC19).

---

## 4. Step 3 — Minimum Test Cases

### TC-01 — Happy path: single valid product

| Field | Content |
|:---|:---|
| **TC ID** | TC-01 |
| **Test Case Name** | Import one product with all valid fields — verify DB commit and accurate report |
| **ECs Covered** | EC01, EC04, EC07, EC11, EC16, EC18, EC20 |
| **ECs Verified Absent** | EC02, EC03, EC05, EC08, EC09, EC12, EC13, EC14, EC15, EC19, EC21 |
| **Pre-conditions** | Admin account exists and is logged in (admin JWT obtained via `POST /api/login`); category ID=1 exists in DB (confirmed via `GET /api/categories`) |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "Basic Men's T-Shirt", "price": 150000, "description": "100% cotton material", "imageUrl": "", "category_id": 1}]}` |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV with one row: `name="Basic Men's T-Shirt", price=150000, description="100% cotton material", category_id=1`; click `Choose File` to select it, then confirm the preview table and `Import 1 sản phẩm` button appear · 4. Click `Import 1 sản phẩm` and inspect the rendered report · 5. Cross-check `GET /api/products` for the imported product |
| **Expected Result** | ✅ After clicking `Import 1 sản phẩm`, the rendered report shows 1 success, 0 failures, and the imported row for "Basic Men's T-Shirt" is accepted. API cross-check: HTTP 200; report shows 1 success, 0 failures; "Basic Men's T-Shirt" appears in `GET /api/products` after import |
| **Verification Points** | 1. After `Import 1 sản phẩm`, the rendered report shows the import succeeded · 2. The rendered report shows 1 success and 0 failures · 3. API cross-check: HTTP status = 200 · 4. API cross-check: Response body contains a field indicating rows succeeded = 1, rows failed = 0 · 5. API cross-check: `GET /api/products` returns the product with `name = "Basic Men's T-Shirt"` and `price = 150000` |
| **Status** | ✅ PASS |

---

### TC-02 — Happy path: batch of multiple valid products

| Field | Content |
|:---|:---|
| **TC ID** | TC-02 |
| **Test Case Name** | Import 3 valid products at once — verify entire batch is committed and report is accurate |
| **ECs Covered** | EC01, EC04, EC07, EC11, EC16, EC18, EC20 |
| **ECs Verified Absent** | EC19, EC21 |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count before import |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "Product Alpha", "price": 100000, "description": "", "imageUrl": "", "category_id": 1}, {"name": "Product Beta", "price": 200000, "description": "Beta description", "imageUrl": "", "category_id": 1}, {"name": "Product Gamma", "price": 350000, "description": "", "imageUrl": "", "category_id": 1}]}` |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV with 3 rows: Product Alpha (100000), Product Beta (200000), Product Gamma (350000), all `category_id=1`; click `Choose File` to select it, then confirm the preview table and `Import 3 sản phẩm` button appear · 4. Click `Import 3 sản phẩm` and inspect the rendered report · 5. Cross-check `GET /api/products` for all 3 new products |
| **Expected Result** | ✅ After clicking `Import 3 sản phẩm`, the rendered report shows 3 succeeded and 0 failed for Product Alpha, Product Beta, and Product Gamma. API cross-check: HTTP 200; all 3 products exist in DB after import; report: 3 succeeded, 0 failed |
| **Verification Points** | 1. After `Import 3 sản phẩm`, the rendered report shows the batch import succeeded · 2. The rendered report shows 3 succeeded and 0 failed · 3. API cross-check: HTTP status = 200 · 4. API cross-check: Product count increases by exactly 3 compared to before import · 5. API cross-check: "Product Alpha", "Product Beta", "Product Gamma" all found in `GET /api/products` |
| **Status** | ✅ PASS |

---

### TC-03 — No JWT (Unauthorized)

| Field | Content |
|:---|:---|
| **TC ID** | TC-03 |
| **Test Case Name** | Request without Authorization header is rejected with HTTP 401 |
| **ECs Covered** | EC02 |
| **ECs Verified Absent** | EC01, EC03 |
| **Pre-conditions** | No login required |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | _(no Authorization header)_ |
| **Input — body** | `{"products": [{"name": "Test", "price": 10000, "description": "", "imageUrl": "", "category_id": 1}]}` |
| **Steps** | 1. Send `POST /api/admin/import-products` directly without an Authorization header |
| **UI Fallback Note** | API-level execution retained. Starting the Admin app without a JWT renders only the Login form; there is no UI path to submit an import request with no token attached. |
| **Expected Result** | ❌ No import result is shown in the Admin UI because the request is sent directly without an Authorization header and is rejected before any rendered report can appear. API cross-check: HTTP 401 Unauthorized; no products created in DB |
| **Verification Points** | 1. No rendered import report is shown in the UI for this direct request path · 2. API cross-check: HTTP status = 401 · 3. API cross-check: Response body contains error message indicating missing authentication |
| **Status** | ✅ PASS |

---

### TC-04 — Valid JWT but not Admin

| Field | Content |
|:---|:---|
| **TC ID** | TC-04 |
| **Test Case Name** | Regular user attempting to import products is rejected with HTTP 403 |
| **ECs Covered** | EC03 |
| **ECs Verified Absent** | EC01, EC02 |
| **Pre-conditions** | Regular user account exists; regular user JWT obtained via `POST /api/login` |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <regular_user_token>` |
| **Input — body** | `{"products": [{"name": "Test", "price": 10000, "description": "", "imageUrl": "", "category_id": 1}]}` |
| **Steps** | 1. On `http://localhost:5173/login`, fill `Username` = `test@eshop.com` and `Mật khẩu` = `Test1234!`, then click `Sign In` · 2. Copy the storefront browser-storage key `token` into the Admin app as `adminToken`, reload `http://localhost:5174/`, and confirm the admin sidebar loads under that regular-user session · 3. In the left sidebar, click `Sản phẩm`, then in `📂 Import sản phẩm từ CSV` click `Choose File` to upload a CSV with one valid row (`name="Test", price=10000, category_id=1`) and confirm `Import 1 sản phẩm` appears · 4. Click `Import 1 sản phẩm` and inspect the rendered result |
| **Expected Result** | ❌ After clicking `Import 1 sản phẩm`, the rendered result shows the regular-user session cannot complete the import and no success report is shown. API cross-check: HTTP 403 Forbidden; no products created |
| **Verification Points** | 1. After `Import 1 sản phẩm`, the UI does not show a success import report · 2. The rendered result indicates the import was not allowed for that session · 3. API cross-check: HTTP status = 403 · 4. API cross-check: Response body contains error message indicating insufficient permissions |
| **Status** | ❌ FAIL — BUG-16-001 |

---

### TC-05 — Missing `products` key in body

| Field | Content |
|:---|:---|
| **TC ID** | TC-05 |
| **Test Case Name** | JSON body without `products` key is rejected with HTTP 400 |
| **ECs Covered** | EC05 |
| **ECs Verified Absent** | EC04, EC06 |
| **Pre-conditions** | Admin JWT |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{}` _(no `products` key)_ |
| **Steps** | 1. Login as Admin via UI to obtain a token · 2. Send `POST /api/admin/import-products` directly with body `{}` |
| **UI Fallback Note** | API-level execution retained. The rendered Import flow only accepts a CSV file and always constructs a request containing a `products` array; there is no UI control that can submit a body without the `products` key. |
| **Expected Result** | ❌ No import result is shown in the Admin UI because the request body is sent directly as `{}` and is rejected before any rendered report can appear. API cross-check: HTTP 400 Bad Request |
| **Verification Points** | 1. No rendered import report is shown in the UI for this direct request path · 2. API cross-check: HTTP status = 400 · 3. API cross-check: Response body indicates invalid request body |
| **Status** | ✅ PASS |

---

### TC-06 — `name` empty string → entire batch rolled back

| Field | Content |
|:---|:---|
| **TC ID** | TC-06 |
| **Test Case Name** | Row with `name = ""` causes entire batch to roll back — no products committed |
| **ECs Covered** | EC08, EC19, EC21 |
| **ECs Verified Absent** | EC07, EC18, EC20 |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count before request |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "", "price": 50000, "description": "desc", "imageUrl": "", "category_id": 1}]}` |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV with one row: empty `name`, `price=50000`, `category_id=1`; click `Choose File` to select it, then confirm the preview table and `Import 1 sản phẩm` button appear · 4. Click `Import 1 sản phẩm` and inspect the rendered report · 5. Cross-check `GET /api/products` count is unchanged |
| **Expected Result** | ❌ After clicking `Import 1 sản phẩm`, the rendered report shows 0 succeeded, 1 failed, and a reason for the empty `name`; no successful import is shown. API cross-check: HTTP 4xx or 200 with failure report; report: 0 succeeded, 1 failed with reason; product count in DB unchanged |
| **Verification Points** | 1. After `Import 1 sản phẩm`, the rendered report shows the row failed · 2. The rendered report shows 0 succeeded, 1 failed, and a reason mentioning `name` · 3. API cross-check: HTTP status ≠ 200 (or 200 with error flag) · 4. API cross-check: Report contains failed row count = 1 and reason mentioning `name` · 5. API cross-check: `GET /api/products` count equals count before request (rollback confirmed) |
| **Status** | ✅ PASS |

---

### TC-07 — `name` field absent

| Field | Content |
|:---|:---|
| **TC ID** | TC-07 |
| **Test Case Name** | Row missing the `name` field causes entire batch to roll back |
| **ECs Covered** | EC09, EC19, EC21 |
| **ECs Verified Absent** | EC07, EC08, EC18, EC20 |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"price": 50000, "description": "desc", "imageUrl": "", "category_id": 1}]}` _(no `name` key)_ |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV file missing the `name` column header; click `Choose File` to select it, then confirm the preview table and `Import 1 sản phẩm` button appear · 4. Click `Import 1 sản phẩm` and inspect the rendered report · 5. Cross-check `GET /api/products` count is unchanged |
| **Expected Result** | ❌ After clicking `Import 1 sản phẩm`, the rendered report shows the row failed because the `name` field is absent and no successful import is shown. API cross-check: HTTP 4xx or failure report; 0 new products in DB |
| **Verification Points** | 1. After `Import 1 sản phẩm`, the rendered report shows the row failed · 2. No successful import is shown in the rendered report · 3. API cross-check: Response contains error about `name` · 4. API cross-check: Product count does not increase |
| **Status** | ✅ PASS |

---

### TC-08 — `price = 0` (not a positive number)

| Field | Content |
|:---|:---|
| **TC ID** | TC-08 |
| **Test Case Name** | Row with `price = 0` is rejected — 0 is not a positive number (> 0) |
| **ECs Covered** | EC12, EC19, EC21 |
| **ECs Verified Absent** | EC11, EC13, EC18, EC20 |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "Test zero price", "price": 0, "description": "", "imageUrl": "", "category_id": 1}]}` |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV with one row: `name="Test zero price", price=0, category_id=1`; click `Choose File` to select it, then confirm the preview table and `Import 1 sản phẩm` button appear · 4. Click `Import 1 sản phẩm` and inspect the rendered report · 5. Cross-check `GET /api/products` count is unchanged |
| **Expected Result** | ❌ After clicking `Import 1 sản phẩm`, the rendered report shows the row failed because `price=0` is invalid and no successful import is shown. API cross-check: HTTP 4xx or failure report with reason about price; 0 products committed |
| **Verification Points** | 1. After `Import 1 sản phẩm`, the rendered report shows the row failed · 2. The rendered report mentions an invalid `price` or shows no success for the row · 3. API cross-check: Error reason mentions `price must be positive` or equivalent · 4. API cross-check: Product count unchanged (rollback confirmed) |
| **Status** | ❌ FAIL — BUG-16-002 |

---

### TC-09 — Negative `price`

| Field | Content |
|:---|:---|
| **TC ID** | TC-09 |
| **Test Case Name** | Row with `price = -1` is rejected — negative numbers are invalid |
| **ECs Covered** | EC13, EC19, EC21 |
| **ECs Verified Absent** | EC11, EC12, EC18, EC20 |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "Test negative price", "price": -1, "description": "", "imageUrl": "", "category_id": 1}]}` |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV with one row: `name="Test negative price", price=-1, category_id=1`; click `Choose File` to select it, then confirm the preview table and `Import 1 sản phẩm` button appear · 4. Click `Import 1 sản phẩm` and inspect the rendered report · 5. Cross-check `GET /api/products` count is unchanged |
| **Expected Result** | ❌ After clicking `Import 1 sản phẩm`, the rendered report shows the row failed because `price=-1` is invalid and no successful import is shown. API cross-check: HTTP 4xx or failure report; 0 products committed |
| **Verification Points** | 1. After `Import 1 sản phẩm`, the rendered report shows the row failed · 2. No successful import is shown in the rendered report · 3. API cross-check: Error reason mentions `price` invalid · 4. API cross-check: Product count unchanged |
| **Status** | ❌ FAIL — BUG-16-002 |

---

### TC-10 — `price` is a non-numeric string

| Field | Content |
|:---|:---|
| **TC ID** | TC-10 |
| **Test Case Name** | Row with `price = "abc"` is rejected — value is not a number |
| **ECs Covered** | EC14, EC19, EC21 |
| **ECs Verified Absent** | EC11, EC18, EC20 |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "Test bad price", "price": "abc", "description": "", "imageUrl": "", "category_id": 1}]}` |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV with one row: `name="Test bad price", price=abc, category_id=1`; click `Choose File` to select it, then confirm the preview table and `Import 1 sản phẩm` button appear · 4. Click `Import 1 sản phẩm` and inspect the rendered report · 5. Cross-check `GET /api/products` count is unchanged |
| **Expected Result** | ❌ After clicking `Import 1 sản phẩm`, the rendered report shows the row failed because `price=abc` is invalid and no successful import is shown. API cross-check: HTTP 4xx or failure report; 0 products committed |
| **Verification Points** | 1. After `Import 1 sản phẩm`, the rendered report shows the row failed · 2. No successful import is shown in the rendered report · 3. API cross-check: Error reason mentions `price` must be a number · 4. API cross-check: Product count unchanged |
| **Status** | ❌ FAIL — BUG-16-002 |

---

### TC-11 — `price` field absent

| Field | Content |
|:---|:---|
| **TC ID** | TC-11 |
| **Test Case Name** | Row missing the `price` field causes entire batch to roll back |
| **ECs Covered** | EC15, EC19, EC21 |
| **ECs Verified Absent** | EC11, EC18, EC20 |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "Test no price", "description": "", "imageUrl": "", "category_id": 1}]}` _(no `price` key)_ |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV file missing the `price` column header for the row `name="Test no price"`; click `Choose File` to select it, then confirm the preview table and `Import 1 sản phẩm` button appear · 4. Click `Import 1 sản phẩm` and inspect the rendered report · 5. Cross-check `GET /api/products` count is unchanged |
| **Expected Result** | ❌ After clicking `Import 1 sản phẩm`, the rendered report shows the row failed because the `price` field is absent and no successful import is shown. API cross-check: HTTP 4xx or failure report; 0 products committed |
| **Verification Points** | 1. After `Import 1 sản phẩm`, the rendered report shows the row failed · 2. No successful import is shown in the rendered report · 3. API cross-check: Error reason mentions `price` is required or invalid · 4. API cross-check: Product count unchanged |
| **Status** | ❌ FAIL — BUG-16-002 |

---

### TC-12 — Atomic rollback: mixed batch (valid + invalid rows)

| Field | Content |
|:---|:---|
| **TC ID** | TC-12 |
| **Test Case Name** | When 1 row in the batch is invalid, all valid rows must also be rolled back (atomicity invariant) |
| **ECs Covered** | EC19, EC21 _(in multi-row context — the only scenario EC19 cannot be tested via a single-row TC)_ |
| **ECs Verified Absent** | EC18, EC20 |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count before request; confirm "Valid Product 1" and "Valid Product 2" do not yet exist in DB |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "Valid Product 1", "price": 100000, "description": "", "imageUrl": "", "category_id": 1}, {"name": "Invalid Row", "price": 0, "description": "", "imageUrl": "", "category_id": 1}, {"name": "Valid Product 2", "price": 200000, "description": "", "imageUrl": "", "category_id": 1}]}` |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV with 3 rows: "Valid Product 1" (100000), "Invalid Row" (price=0), "Valid Product 2" (200000), all `category_id=1`; click `Choose File` to select it, then confirm the preview table and `Import 3 sản phẩm` button appear · 4. Click `Import 3 sản phẩm` and inspect the rendered report · 5. Cross-check `GET /api/products` and search for "Valid Product 1" and "Valid Product 2" |
| **Expected Result** | ❌ After clicking `Import 3 sản phẩm`, the rendered report shows the batch failed and no successful import is shown for "Valid Product 1" or "Valid Product 2". API cross-check: Failure report; "Valid Product 1" and "Valid Product 2" do **not** appear in DB; product count unchanged |
| **Verification Points** | 1. After `Import 3 sản phẩm`, the rendered report shows the batch failed · 2. The rendered report does not show a successful import for "Valid Product 1" or "Valid Product 2" · 3. API cross-check: `GET /api/products` search "Valid Product 1" → 0 results · 4. API cross-check: `GET /api/products` search "Valid Product 2" → 0 results · 5. API cross-check: Product count equals count before request → full batch rollback confirmed |
| **Status** | ❌ FAIL — BUG-16-002 |

---

### TC-13 [Gap Probe] — `products: []` (empty array)

| Field | Content |
|:---|:---|
| **TC ID** | TC-13 |
| **Test Case Name** | [Gap Probe] Behavior when `products` array is empty — spec does not define this |
| **ECs Covered** | EC06 |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Admin JWT |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": []}` |
| **Steps** | 1. Login as Admin via UI to obtain a token · 2. Send `POST /api/admin/import-products` directly with body `{"products": []}` · 3. Record full response code and body |
| **UI Fallback Note** | API-level execution retained. A header-only CSV is rendered as "Import 0 sản phẩm" with the Import button disabled — client-side validation prevents submission of an empty `products` array through the UI. |
| **Expected Result** | No rendered import report appears in the UI for this direct empty-array request; record the observed branch for the empty `products` case. API cross-check: _Multiple branches — record actual result:_ · If HTTP 400 → SUT correctly handles the "no products" edge case; record error message · If HTTP 200 with `imported=0` → SUT accepts empty batch; record as undocumented feature · If HTTP 500 → **BUG**: server crash on empty input |
| **Verification Points** | 1. No rendered import report is shown in the UI for this direct request path · 2. API cross-check: HTTP status + response body + confirm no new products in DB |
| **Status** | ✅ PASS |

---

### TC-14 [Gap Probe] — `name` longer than 255 characters

| Field | Content |
|:---|:---|
| **TC ID** | TC-14 |
| **Test Case Name** | [Gap Probe] Does FR-16 enforce the 255-character limit from FR-15? |
| **ECs Covered** | EC10 |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "<256-character string of 'x'>", "price": 50000, "description": "", "imageUrl": "", "category_id": 1}]}` _(name is 256 characters long)_ |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV with one row: `name=<256-char string>, price=50000, category_id=1`; click `Choose File` to select it, then confirm the preview table and `Import 1 sản phẩm` button appear · 4. Click `Import 1 sản phẩm` and inspect the rendered report · 5. Cross-check `GET /api/products` for the new product's `name` length |
| **Expected Result** | After clicking `Import 1 sản phẩm`, record whether the rendered report shows a failed row or a successful import for the 256-character `name`. API cross-check: _Multiple branches:_ · If HTTP 4xx and 0 products → FR-16 enforces 255-char limit; record constraint as active · If HTTP 200 and product with truncated name → **BUG**: data silently truncated · If HTTP 200 and product with full 256-char name → FR-16 does not enforce limit; record gap with FR-15 |
| **Verification Points** | 1. Record whether the rendered report shows failure or success after `Import 1 sản phẩm` · 2. If the UI shows success, note that the long-name row was accepted in the rendered report · 3. API cross-check: HTTP status + response + `GET /api/products` find the newly added product and check `name` length |
| **Status** | ❌ FAIL — BUG-16-004 |

---

### TC-15 [Gap Probe] — `category_id` does not exist

| Field | Content |
|:---|:---|
| **TC ID** | TC-15 |
| **Test Case Name** | [Gap Probe] Does FR-16 validate that `category_id` exists in the DB? |
| **ECs Covered** | EC17 |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Admin JWT; confirm category_id=99999 does **not** exist via `GET /api/categories`; record product count |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "Test invalid category", "price": 50000, "description": "", "imageUrl": "", "category_id": 99999}]}` |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Danh mục` and confirm category `99999` is not listed, then click `Sản phẩm` to return to `Quản lý Sản phẩm` · 3. In `📂 Import sản phẩm từ CSV`, click `Choose File` to upload a CSV with one row: `name="Test invalid category", price=50000, category_id=99999`, then confirm the preview table and `Import 1 sản phẩm` button appear · 4. Click `Import 1 sản phẩm` and inspect the rendered report · 5. Cross-check `GET /api/products` |
| **Expected Result** | After clicking `Import 1 sản phẩm`, record whether the rendered report shows a failed row or a successful import for "Test invalid category". API cross-check: _Multiple branches:_ · If HTTP 4xx and 0 products → SUT validates FK constraint; record constraint as active · If HTTP 200 and product with `category_id=99999` in DB → **CRITICAL BUG**: dangling FK, corrupt data · If HTTP 500 (DB FK violation) → **BUG**: unhandled exception |
| **Verification Points** | 1. Record whether the rendered report shows failure or success after `Import 1 sản phẩm` · 2. If the UI shows success, note that "Test invalid category" was accepted in the rendered report · 3. API cross-check: HTTP status + response body + `GET /api/products` search for "Test invalid category" |
| **Status** | ❌ FAIL — BUG-16-003 |

---

### TC-16 [Gap Probe] — `price` as numeric string ("10000")

| Field | Content |
|:---|:---|
| **TC ID** | TC-16 |
| **Test Case Name** | [Gap Probe] Does the backend coerce string "10000" to a number? (CSV parsing often produces strings) |
| **ECs Covered** | EC22 |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "Test price as string", "price": "10000", "description": "", "imageUrl": "", "category_id": 1}]}` _(`price` is a JSON string, not a number)_ |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV with one row: `name="Test price as string", price=10000, category_id=1`; click `Choose File` to select it, then confirm the preview table and `Import 1 sản phẩm` button appear · 4. Click `Import 1 sản phẩm` and inspect the rendered report · 5. Cross-check the stored `price` via `GET /api/products` |
| **Expected Result** | After clicking `Import 1 sản phẩm`, record whether the rendered report shows a failed row or a successful import for "Test price as string". API cross-check: _Multiple branches:_ · If HTTP 200 and product in DB with price=10000 → SUT coerces string to number; lenient input accepted · If HTTP 4xx → SUT strict type checking; `"10000"` rejected · If HTTP 200 and price=0 or NaN → **BUG**: incorrect type coercion |
| **Verification Points** | 1. Record whether the rendered report shows failure or success after `Import 1 sản phẩm` · 2. If the UI shows success, note that "Test price as string" was accepted in the rendered report · 3. API cross-check: HTTP status + price value in DB if product was created |
| **Status** | ✅ PASS (with deviation) |

---

### TC-17 [Gap Probe] — Import report response schema

| Field | Content |
|:---|:---|
| **TC ID** | TC-17 |
| **Test Case Name** | [Gap Probe] What JSON fields does the import report response actually return? (Step 1 Gap #6 — API spec defines no response body example) |
| **ECs Covered** | EC01, EC04, EC07, EC11, EC16, EC18, EC20 _(valid path required; schema observation needs a successful import)_ |
| **ECs Verified Absent** | N/A — gap test, discover actual response structure |
| **Pre-conditions** | Admin JWT; category ID=1 exists |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "Schema Probe Product", "price": 75000, "description": "", "imageUrl": "", "category_id": 1}]}` |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV with one row: `name="Schema Probe Product", price=75000, category_id=1`; click `Choose File` to select it, then confirm the preview table and `Import 1 sản phẩm` button appear · 4. Click `Import 1 sản phẩm` and inspect the browser Network entry for `POST /api/admin/import-products` · 5. Record the raw JSON response body verbatim — every key, type, and value |
| **Expected Result** | After clicking `Import 1 sản phẩm`, the rendered report should show the outcome for "Schema Probe Product"; record the visible success/failure details before inspecting Network. API cross-check: _Multiple branches — record actual result:_ · If response contains `{"imported": 1, "failed": 0, ...}` → document `imported` and `failed` as canonical field names · If response contains `{"success": 1}` or other schema → record actual field names and update Verification Points in TC-01, TC-02, TC-06 through TC-12 accordingly · If HTTP 500 → **BUG**: schema probe crashes the server on valid input |
| **Verification Points** | 1. Record what the rendered report shows after `Import 1 sản phẩm` · 2. Note whether the UI presents the import as a success or failure before opening Network · 3. API cross-check: Record complete raw JSON response body · 4. API cross-check: List all top-level keys and their types · 5. API cross-check: Confirm "Schema Probe Product" appears in `GET /api/products` (validates import succeeded, not just response received) |
| **Status** | ✅ PASS |

---

### TC-18 [Gap Probe] — All-rows-invalid batch: rollback and report completeness

| Field | Content |
|:---|:---|
| **TC ID** | TC-18 |
| **Test Case Name** | [Gap Probe] When every row is invalid, does the report list per-row failure reasons for all rows or only the first? (Step 1 Gap #7 — rollback scope when all rows fail) |
| **ECs Covered** | EC19, EC21 _(all-invalid multi-row context — TC-12 tests mixed valid+invalid; this probes the all-fail case)_ |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count before request |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "Invalid Row 1", "price": 0, "description": "", "imageUrl": "", "category_id": 1}, {"name": "Invalid Row 2", "price": -1, "description": "", "imageUrl": "", "category_id": 1}, {"name": "Invalid Row 3", "price": "abc", "description": "", "imageUrl": "", "category_id": 1}]}` _(3 rows, each with a distinct price violation)_ |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Prepare a CSV with 3 rows, each with a distinct price violation: "Invalid Row 1" (price=0), "Invalid Row 2" (price=-1), "Invalid Row 3" (price=abc); click `Choose File` to select it, then confirm the preview table and `Import 3 sản phẩm` button appear · 4. Click `Import 3 sản phẩm` and record the full rendered report · 5. Cross-check `GET /api/products` count is unchanged |
| **Expected Result** | After clicking `Import 3 sản phẩm`, record whether the rendered report lists failure reasons for all three invalid rows or only part of the batch. API cross-check: _Multiple branches — record actual result:_ · If response lists 3 separate failure entries (one per row, each with a distinct reason) → SUT processes all rows before rolling back; SRS "lý do từng dòng" requirement satisfied · If response lists only 1 failure entry → SUT early-exits after first invalid row; rows 2 and 3 unreported → **undocumented behavior**: report is incomplete per SRS · If HTTP 4xx with no per-row detail → **BUG**: batch rejected without per-row report; "lý do" requirement violated |
| **Verification Points** | 1. Record how many failed rows the rendered report shows after `Import 3 sản phẩm` · 2. Note whether the rendered report gives a distinct reason for each invalid row · 3. API cross-check: Product count unchanged (full rollback confirmed) · 4. API cross-check: Number of failure entries in response body (1 vs 3?) · 5. API cross-check: Each failure entry identifies which row and what reason? |
| **Status** | ❌ FAIL — BUG-16-002 |

---

### TC-19 [Gap Probe] — CSV file extension enforcement and JSON translation at the input layer

| Field | Content |
|:---|:---|
| **TC ID** | TC-19 |
| **Test Case Name** | [Gap Probe] Does the Admin UI enforce the `.csv` extension, and is the resulting network request actually a JSON body? (Step 1 Spec Conflict — Input layer) |
| **ECs Covered** | EC23 |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Admin JWT (logged in via UI); category ID=1 exists; a file named `products.txt` (not `.csv`) containing valid CSV-formatted content (`name,price,description,imageUrl,category_id` header + one valid data row) is prepared alongside a normal `.csv` version of the exact same content |
| **Input — endpoint** | `POST /api/admin/import-products` (observed via the browser Network panel, not sent directly) |
| **Input — header** | `Authorization: Bearer <admin_token>` (attached automatically by the Admin UI) |
| **Input — body** | Not applicable as a direct input — this TC observes whatever body the frontend actually constructs |
| **Steps** | 1. Open `http://localhost:5174/`, fill `Email` = `admin@eshop.com` and `Password` = `Admin123!`, then click `Login` · 2. In the left sidebar, click `Sản phẩm` to open `Quản lý Sản phẩm` and locate the `📂 Import sản phẩm từ CSV` panel · 3. Open the browser DevTools Network panel, then click `Choose File` and select `products.txt` (non-`.csv` extension, valid CSV content inside); record whether the file picker/preview accepts or rejects it · 4. If accepted, click `Import 1 sản phẩm` (or equivalent) and inspect the captured `POST /api/admin/import-products` request in the Network panel: record its `Content-Type` header and the raw request payload · 5. Repeat steps 3-4 with the properly named `.csv` version of the same content and compare the two captured requests |
| **Expected Result** | Record the actual behavior for both branches. API cross-check: _Multiple branches — record actual result:_ · If the `Choose File` dialog or the Admin UI rejects `products.txt` before any request is sent → UI enforces the `.csv` extension client-side; record as active constraint · If `products.txt` is accepted and produces the same successful import as the `.csv` version → **Gap confirmed**: UI does not enforce the `.csv` extension, contradicting the SRS requirement · In either accepted case, confirm via the Network panel that `Content-Type: application/json` and the request payload is `{"products": [...]}`, not raw CSV text or `multipart/form-data` → confirms the Spec Conflict described in Step 1 (frontend parses CSV into JSON before sending) |
| **Verification Points** | 1. Record whether `products.txt` (wrong extension) is accepted or rejected by the Admin UI before any request is sent · 2. If accepted, confirm the import outcome (success/failure) matches the `.csv` version · 3. Network panel: confirm the `Content-Type` header of the captured request · 4. Network panel: confirm the raw request payload is JSON (`{"products": [...]}`), not CSV text · 5. Screenshot the Network panel entry as evidence for both the extension-enforcement result and the JSON-body confirmation |
| **Status** | ❌ FAIL — BUG-16-005 |

---

## 5. EC Coverage Matrix

| EC ID | Description (summary) | TC | Mechanism |
|:---|:---|:---|:---|
| EC01 | Admin JWT valid | TC-01, TC-02, TC-06–TC-16 | Nominal valid input |
| EC02 | No JWT → 401 | TC-03 | Direct trigger |
| EC03 | Non-admin JWT → 403 | TC-04 | Direct trigger |
| EC04 | `products` array ≥ 1 item | TC-01, TC-02 | Nominal valid input |
| EC05 | Missing `products` key | TC-05 | Direct trigger |
| EC06 | `products: []` empty array | TC-13 | Gap Probe |
| EC07 | `name` non-empty, ≤ 255 | TC-01, TC-02 | Nominal valid input |
| EC08 | `name = ""` | TC-06 | Direct trigger |
| EC09 | `name` field missing | TC-07 | Direct trigger |
| EC10 | `name` > 255 chars | TC-14 | Gap Probe |
| EC11 | `price` positive number | TC-01, TC-02 | Nominal valid input |
| EC12 | `price = 0` | TC-08 | Direct trigger |
| EC13 | `price < 0` | TC-09 | Direct trigger |
| EC14 | `price` non-numeric string | TC-10 | Direct trigger |
| EC15 | `price` field missing | TC-11 | Direct trigger |
| EC16 | `category_id` exists | TC-01, TC-02 | Nominal valid input |
| EC17 | `category_id` not found | TC-15 | Gap Probe |
| EC18 | All rows valid → DB commit | TC-01, TC-02 | Direct trigger + Observed |
| EC19 | Any row invalid → rollback | TC-06–TC-12 | Observed (each invalid TC triggers rollback) |
| EC20 | Report: all success | TC-01, TC-02 | Observed |
| EC21 | Report: failure with reasons | TC-06–TC-12 | Observed |
| EC22 | `price` as string "10000" | TC-16 | Gap Probe |
| EC23 | File extension not `.csv` | TC-19 | Gap Probe |

**Student-added Gap Probes (Step 1 gaps not converted to TCs by AI — no new ECs defined unless noted):**

| TC | Gap Probed | Step 1 Gap Source |
|:---|:---|:---|
| TC-17 | Response schema: records actual JSON field names returned by a successful import | Gap #6 — Report response schema not defined in API spec §6.3 |
| TC-18 | All-rows-invalid batch: verifies whether report lists per-row reasons for all N failures or only the first | Gap #7 — Rollback scope when all rows fail not addressed in SRS |
| TC-19 | CSV file extension enforcement and JSON translation at the input layer (new EC23 defined) | Gap #1 — Spec Conflict: Input layer (SRS `.csv` file vs API JSON body) never converted to a TC |

**Total: 19 TCs** — 12 EP TCs + 4 AI-generated Gap Probes + 3 Student-added Gap Probes — covering 23/23 ECs.
