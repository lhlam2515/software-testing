# FR-16 — Domain Testing: CSV Product Import

**Feature:** FR-16 — CSV Product Import
**Technique:** Domain Testing (Equivalence Partitioning)
**Spec source:** `docs/eshop-sut/srs.md` §6 FR-16, FR-15 (cross-ref) · `docs/eshop-sut/api_specification.md` §6.3
**API endpoint:** `POST /api/admin/import-products`
**Author:** Le Hoang Lam — 23127216

---

## 1. Feature Overview

FR-16 allows Admins to import multiple products at once. The SRS describes uploading a CSV file (`.csv` extension, header row `name,price,description,imageUrl,category_id`, RFC 4180 quoting), but the API spec accepts a **JSON body** `{"products": [...]}` — meaning CSV parsing happens at the **frontend layer**; the backend only receives JSON. This is a core Spec Conflict that affects the test scope at the API level.

Pre-import validation: `name` must not be empty and `price` must be positive (`> 0`). If any row violates these rules, the entire batch must be **rolled back** (atomic all-or-nothing). The system returns a clear report: number of rows that succeeded, number that failed, and the reason for each failure.

Cross-feature note: FR-15 caps `name` at 255 characters and requires `category_id` to reference an existing category — FR-16 does not repeat these two constraints, creating two Implicit Gaps that need probing.

---

## 2. Step 1 — Variables & Constraints

| Variable | Type | Description | Valid Domain / Boundaries | Dependencies & Constraints | Expected Error / Behavior |
|:---|:---|:---|:---|:---|:---|
| **Authorization** | System State | Admin JWT token sent with the request | Valid token + `admin` role | `Authorization: Bearer <token>` header required for all `/api/admin/*` routes | No token → HTTP 401; valid token but not admin → HTTP 403 |
| **`products`** (array) | Input | List of products to import (key in JSON body) | Array with ≥ 1 element | Key must exist in the request body | Missing key → 400 Bad Request |
| **`name`** (per row) | Input (string) | Product name | Required, non-empty; max 255 characters (FR-15 cross-ref) | Must not be empty string; each row must have this field | Empty or missing → row invalid, entire batch rolled back |
| **`price`** (per row) | Input (numeric) | Product price | Must be a positive number `> 0` (FR-16 explicit) | Validated before commit; 0, negative, or non-numeric not accepted | Invalid → row invalid, entire batch rolled back |
| **`description`** (per row) | Input (string) | Product description | Optional — no constraint in FR-16 or FR-15 | May be `""` or omitted | Any value accepted |
| **`imageUrl`** (per row) | Input (string) | Product image URL | Optional | May be `""` (as shown in the API example) | Any value accepted |
| **`category_id`** (per row) | Input (integer) | Product category ID | Must be an ID that exists in the categories table | FR-15: "category is required and must be chosen from the existing list"; FR-16 does **not** repeat this constraint | Behavior when ID does not exist: **Gap** |
| **DB Category State** | System State | Whether the category exists in the DB | At least one valid category must exist as a pre-condition | Pre-condition for happy-path tests | N/A — setup condition |
| **Atomic Rollback** | Output Behavior | If any row is invalid, the entire import is rolled back | All-or-nothing: 0 products committed if 1+ rows are invalid | This is the core invariant of FR-16 | No rollback → critical BUG |
| **Import Report** | Output | Report: number of rows succeeded, number failed, and reasons | Must show both counts and the reason for each failed row | SRS requires "a clear report" | Report missing reasons is a defect |

### Implicit Gaps & Spec Conflicts

| Variable | Gap / Conflict | Risk |
|:---|:---|:---|
| **Spec Conflict — Input layer** | SRS: "upload CSV file" with `.csv` extension, header row, RFC 4180. API Spec: accepts JSON body `{"products": [...]}`. Backend does not receive CSV — CSV parsing is a frontend concern. | Testing CSV-specific constraints (extension, header row, quoting) cannot be done at the API level; separate E2E frontend tests are required. |
| **`category_id` validation** | FR-16 only validates `name` and `price`. FR-15 requires a valid category. It is unclear whether the import endpoint enforces this constraint. | If not validated, products with dangling foreign keys will be committed → corrupt data. |
| **`name` max 255 chars** | FR-15 sets a 255-char limit. FR-16 does not repeat it. It is unclear whether the import enforces this. | Import may allow names > 255 chars → truncation or error depending on DB schema. |
| **Empty `products` array** | Spec does not define behavior when `products: []`. | HTTP 400 or HTTP 200 with "0 imported"? Undefined. |
| **`price` type coercion** | API example shows `"price": 10000` (number). Frontend CSV parsing may produce `"price": "10000"` (string). Does the backend coerce? | `"10000"` and `"abc"` are both strings — if the backend does not parse, valid-looking prices get rejected. |
| **Report response schema** | SRS says "clear report" but the API spec does not define the response body schema for this endpoint (no example response). | Unknown which fields to verify: `imported`, `failed`, `errors[]`? |
| **Rollback scope** | SRS says "the entire import must be rolled back" → all-or-nothing. Behavior when all rows fail is not addressed separately. | If the implementation does per-row commits instead of a batch transaction, partial imports will occur — violating atomicity. |

---

## 3. Step 2 — Equivalence Classes

### Group 1: Authorization (Must-Be Rule + Set Rule)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| Authorization | **EC01** | Valid admin JWT present in `Authorization: Bearer <token>` header | Valid | Proceeds to import logic |
| Authorization | **EC02** | No JWT (missing Authorization header) | Invalid | HTTP 401 Unauthorized |
| Authorization | **EC03** | Valid JWT but user is not an admin (regular user) | Invalid | HTTP 403 Forbidden |

### Group 2: `products` — Key presence & array size (Must-Be Rule + Gap Rule)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `products` key | **EC04** | `products` key present in body, array has ≥ 1 element | Valid | Proceeds to validate each row |
| `products` key | **EC05** | `products` key entirely absent from body | Invalid | HTTP 400 Bad Request |
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

**Total: 22 ECs** (EC01–EC22, with 5 Invalid/Gap ECs: EC06, EC10, EC17, EC22, and the gap-context EC19).

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
| **Steps** | 1. Log in with admin credentials, obtain JWT token · 2. Record current product count via `GET /api/products` · 3. Send POST request with the body above · 4. Inspect response · 5. Call `GET /api/products` to find the imported product |
| **Expected Result** | ✅ HTTP 200; report shows 1 success, 0 failures; "Basic Men's T-Shirt" appears in `GET /api/products` after import |
| **Verification Points** | 1. HTTP status = 200 · 2. Response body contains a field indicating rows succeeded = 1, rows failed = 0 · 3. `GET /api/products` returns the product with `name = "Basic Men's T-Shirt"` and `price = 150000` |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in, obtain token · 2. Record current product count · 3. Send POST request · 4. Inspect response · 5. Call `GET /api/products` and count new products |
| **Expected Result** | ✅ HTTP 200; all 3 products exist in DB after import; report: 3 succeeded, 0 failed |
| **Verification Points** | 1. HTTP status = 200 · 2. Product count increases by exactly 3 compared to before import · 3. "Product Alpha", "Product Beta", "Product Gamma" all found in `GET /api/products` |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Send POST request without Authorization header |
| **Expected Result** | ❌ HTTP 401 Unauthorized; no products created in DB |
| **Verification Points** | 1. HTTP status = 401 · 2. Response body contains error message indicating missing authentication |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in with regular user credentials, obtain token · 2. Send POST request using the regular user token |
| **Expected Result** | ❌ HTTP 403 Forbidden; no products created |
| **Verification Points** | 1. HTTP status = 403 · 2. Response body contains error message indicating insufficient permissions |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in, obtain token · 2. Send POST with body `{}` |
| **Expected Result** | ❌ HTTP 400 Bad Request |
| **Verification Points** | 1. HTTP status = 400 · 2. Response body indicates invalid request body |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in, obtain token · 2. Record product count · 3. Send POST · 4. Inspect response · 5. Call `GET /api/products` and compare count |
| **Expected Result** | ❌ HTTP 4xx or 200 with failure report; report: 0 succeeded, 1 failed with reason; product count in DB unchanged |
| **Verification Points** | 1. HTTP status ≠ 200 (or 200 with error flag) · 2. Report contains failed row count = 1 and reason mentioning `name` · 3. `GET /api/products` count equals count before request (rollback confirmed) |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in · 2. Record product count · 3. Send POST · 4. Inspect response and DB |
| **Expected Result** | ❌ HTTP 4xx or failure report; 0 new products in DB |
| **Verification Points** | 1. Response contains error about `name` · 2. Product count does not increase |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in · 2. Record product count · 3. Send POST · 4. Inspect response and DB |
| **Expected Result** | ❌ HTTP 4xx or failure report with reason about price; 0 products committed |
| **Verification Points** | 1. Error reason mentions `price must be positive` or equivalent · 2. Product count unchanged (rollback confirmed) |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in · 2. Record product count · 3. Send POST · 4. Inspect response and DB |
| **Expected Result** | ❌ HTTP 4xx or failure report; 0 products committed |
| **Verification Points** | 1. Error reason mentions `price` invalid · 2. Product count unchanged |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in · 2. Record product count · 3. Send POST · 4. Inspect response and DB |
| **Expected Result** | ❌ HTTP 4xx or failure report; 0 products committed |
| **Verification Points** | 1. Error reason mentions `price` must be a number · 2. Product count unchanged |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in · 2. Record product count · 3. Send POST · 4. Inspect response and DB |
| **Expected Result** | ❌ HTTP 4xx or failure report; 0 products committed |
| **Verification Points** | 1. Error reason mentions `price` is required or invalid · 2. Product count unchanged |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in · 2. Record product count · 3. Send POST (3 rows: rows 1 & 3 valid, row 2 invalid `price=0`) · 4. Inspect response · 5. Call `GET /api/products` and search for "Valid Product 1" and "Valid Product 2" |
| **Expected Result** | ❌ Failure report; "Valid Product 1" and "Valid Product 2" do **not** appear in DB; product count unchanged |
| **Verification Points** | 1. `GET /api/products` search "Valid Product 1" → 0 results · 2. `GET /api/products` search "Valid Product 2" → 0 results · 3. Product count equals count before request → full batch rollback confirmed |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in · 2. Send POST with empty array · 3. Record full response code and body |
| **Expected Result** | _Multiple branches — record actual result:_ · If HTTP 400 → SUT correctly handles the "no products" edge case; record error message · If HTTP 200 with `imported=0` → SUT accepts empty batch; record as undocumented feature · If HTTP 500 → **BUG**: server crash on empty input |
| **Verification Points** | HTTP status + response body + confirm no new products in DB |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in · 2. Send POST with 256-char name · 3. Record response and inspect DB |
| **Expected Result** | _Multiple branches:_ · If HTTP 4xx and 0 products → FR-16 enforces 255-char limit; record constraint as active · If HTTP 200 and product with truncated name → **BUG**: data silently truncated · If HTTP 200 and product with full 256-char name → FR-16 does not enforce limit; record gap with FR-15 |
| **Verification Points** | HTTP status + response + `GET /api/products` find the newly added product and check `name` length |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in · 2. Confirm category 99999 does not exist · 3. Send POST · 4. Record response and inspect DB |
| **Expected Result** | _Multiple branches:_ · If HTTP 4xx and 0 products → SUT validates FK constraint; record constraint as active · If HTTP 200 and product with `category_id=99999` in DB → **CRITICAL BUG**: dangling FK, corrupt data · If HTTP 500 (DB FK violation) → **BUG**: unhandled exception |
| **Verification Points** | HTTP status + response body + `GET /api/products` search for "Test invalid category" |
| **Status** | ⬜ Not yet executed |

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
| **Steps** | 1. Log in · 2. Send POST with `"price": "10000"` · 3. Record response and inspect DB |
| **Expected Result** | _Multiple branches:_ · If HTTP 200 and product in DB with price=10000 → SUT coerces string to number; lenient input accepted · If HTTP 4xx → SUT strict type checking; `"10000"` rejected · If HTTP 200 and price=0 or NaN → **BUG**: incorrect type coercion |
| **Verification Points** | HTTP status + price value in DB if product was created |
| **Status** | ⬜ Not yet executed |

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

**Total: 16 TCs** — 12 EP TCs + 4 Gap Probes — covering 22/22 ECs.
