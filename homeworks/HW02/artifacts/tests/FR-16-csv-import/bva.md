# FR-16 — Boundary Value Analysis: CSV Product Import

**Feature:** FR-16 — CSV Product Import
**Technique:** Boundary Value Analysis (BVA) — additive to Domain Testing
**Spec source:** `docs/eshop-sut/srs.md` §6 FR-16, FR-15 (cross-ref) · `docs/eshop-sut/api_specification.md` §6.3
**API endpoint:** `POST /api/admin/import-products`
**Author:** Le Hoang Lam — 23127216

---

## 1. Overview

EP (domain-testing.md) uses midpoint values (`price = 50000`, `price = 150000`) for each class — these do not detect fencepost errors at turning points. BVA adds test cases at **exactly the boundary** to catch off-by-one bugs.

**Two variables are targeted:**

1. **`price`** — Explicit constraint: `price > 0` (FR-16). Boundary at 0: turning point between invalid (≤ 0) and valid (> 0).
2. **`name` length** — Cross-ref constraint: `length ≤ 255` (FR-15). FR-16 does not repeat this — it is a Gap constraint. BVA applies because 255 is a numeric/range boundary even though the source is a cross-reference.

**`products` array size** is not targeted separately: the lower boundary (0 vs 1) is already covered by TC-13 (Gap Probe) and TC-01 (happy path). No upper boundary is defined in the spec.

---

## 2. Target Variables & Boundary Maps

### 2.1 `price` — Lower Boundary at 0

Constraint: `price > 0` (strictly positive). No upper bound.

```
         INVALID                          VALID
    ─────────────────────┬─────────────────────────────────────────▶
                         │
    ... -2  -1  [0]  •  [1]   2   3  ...  150000  ...
              ↑              ↑
           ON point       Min valid
         (turning pt.)    (LB+1)
         TC-BVA-01       TC-BVA-02

    [0]  = boundary itself — INVALID (> 0 excludes 0)
    [1]  = first valid integer — must be accepted
    -1   = clearly below boundary (reference, covered by TC-09 EP)
```

| BVA Point | Value | Expected State | TC |
|:---|:---|:---|:---|
| ON (turning point) | `0` | INVALID — `price = 0` is not a positive number | TC-BVA-01 |
| LB+1 (min valid) | `1` | VALID — minimum positive integer | TC-BVA-02 |

### 2.2 `name` length — Upper Boundary at 255 (Gap)

Constraint: `length ≤ 255` (FR-15 cross-ref; FR-16 silent). If FR-16 does not enforce this, all 3 tests will return "accepted."

```
         VALID (if limit is enforced)          INVALID (if enforced)
    ──────────────────────────────────┬─────────────────────────────▶
                                      │
    ...  253  [254]  [255]  •  [256]  257  ...
               ↑      ↑            ↑
             UB-1    UB          UB+1
           TC-BVA-03 TC-BVA-04  TC-BVA-05

    [255] = ON boundary (last valid if limit enforced)
    [256] = UB+1 (first invalid if limit enforced)
    NB: if FR-16 does not enforce → 254, 255, 256 all VALID → Gap confirmed
```

| BVA Point | Value (chars) | Expected State | TC |
|:---|:---|:---|:---|
| UB-1 | 254 | VALID (regardless of enforcement) | TC-BVA-03 |
| UB = ON | 255 | VALID — at boundary (if `≤ 255` is implemented correctly) | TC-BVA-04 |
| UB+1 | 256 | INVALID (if `≤ 255`) / VALID (if not enforced) — reveals Gap | TC-BVA-05 |

---

## 3. BVA Test Cases

### TC-BVA-01 — `price = 0` (ON boundary — turning point)

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-01 |
| **Test Case Name** | `price = 0` at the exact turning point — must be rejected (not a positive number) |
| **Target Variable** | `price` |
| **Boundary Point Type** | ON Point (turning point between invalid and valid) |
| **Target Variable State** | `price = 0` — last invalid value |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count before request |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "BVA price zero", "price": 0, "description": "", "imageUrl": "", "category_id": 1}]}` |
| **Defect Target** | Catches bug `price >= 0` instead of `price > 0`: if the SUT uses `>= 0`, then `price = 0` is incorrectly accepted — a free product (price 0) gets imported when it should not be allowed |
| **Expected Result** | ❌ HTTP 4xx or failure report; product count unchanged; "BVA price zero" does not exist in DB |
| **Verification Points** | 1. Response contains error about invalid `price` · 2. `GET /api/products` finds no product named "BVA price zero" · 3. Product count does not increase |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-02 — `price = 1` (minimum valid — LB+1)

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-02 |
| **Test Case Name** | `price = 1` is the smallest positive value — must be accepted |
| **Target Variable** | `price` |
| **Boundary Point Type** | LB+1 (minimum valid — first integer above turning point) |
| **Target Variable State** | `price = 1` — smallest valid positive integer |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count before request |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "BVA price one", "price": 1, "description": "", "imageUrl": "", "category_id": 1}]}` |
| **Defect Target** | Catches bug `price > 1` or `price >= 2` instead of `price > 0`: if the SUT uses `> 1`, then `price = 1` is incorrectly rejected — a product priced at 1 unit cannot be imported even though it is valid |
| **Expected Result** | ✅ HTTP 200; product "BVA price one" exists in DB with `price = 1`; product count increases by 1 |
| **Verification Points** | 1. HTTP status = 200 · 2. `GET /api/products` finds "BVA price one" with `price = 1` · 3. Product count increases by exactly 1 |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-03 — `name` = 254 chars (UB-1)

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-03 |
| **Test Case Name** | `name` is 254 characters — one below the 255-char limit; must be accepted |
| **Target Variable** | `name` length |
| **Boundary Point Type** | UB-1 (one below upper boundary) |
| **Target Variable State** | `name.length = 254` |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "<254-character string of 'A'>", "price": 50000, "description": "", "imageUrl": "", "category_id": 1}]}` _(see Setup Protocol to generate)_ |
| **Defect Target** | Catches bug `length < 254` (enforcement too strict) — rejects a 254-char name even though it is within the limit. If FR-16 does not enforce the limit, an accepted result also confirms no enforcement. |
| **Expected Result** | ✅ HTTP 200; product with a 254-character name is created successfully. _If HTTP 4xx → BUG: enforcement boundary too narrow_ |
| **Verification Points** | 1. HTTP status = 200 · 2. Product exists in DB · 3. `product.name.length = 254` (not truncated) |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-04 — `name` = 255 chars (UB = ON boundary)

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-04 |
| **Test Case Name** | `name` is exactly 255 characters — at the boundary; must be accepted (FR-15: max 255) |
| **Target Variable** | `name` length |
| **Boundary Point Type** | UB / ON Point (exactly at upper boundary) |
| **Target Variable State** | `name.length = 255` |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "<255-character string of 'B'>", "price": 50000, "description": "", "imageUrl": "", "category_id": 1}]}` _(see Setup Protocol to generate)_ |
| **Defect Target** | Catches bug `length < 255` (strict less-than) instead of `length <= 255`: if the SUT uses `< 255`, a name of exactly 255 chars is incorrectly rejected even though FR-15 states "maximum 255". Also confirms whether FR-16 enforces this cross-ref constraint at all. |
| **Expected Result** | ✅ HTTP 200; product with a 255-character name is created successfully. _If HTTP 4xx → BUG: off-by-one — `< 255` instead of `<= 255`, or FR-16 enforces the 255-char limit with incorrect logic_ |
| **Verification Points** | 1. HTTP status = 200 · 2. Product in DB has `name.length = 255` (not truncated) |
| **Status** | ⬜ Not yet executed |

---

### TC-BVA-05 — `name` = 256 chars (UB+1, over boundary)

| Field | Content |
|:---|:---|
| **TC ID** | TC-BVA-05 |
| **Test Case Name** | `name` is 256 characters — one above the limit; must be rejected IF FR-16 enforces the limit |
| **Target Variable** | `name` length |
| **Boundary Point Type** | UB+1 (one above upper boundary) |
| **Target Variable State** | `name.length = 256` |
| **Pre-conditions** | Admin JWT; category ID=1 exists; record product count |
| **Input — endpoint** | `POST /api/admin/import-products` |
| **Input — header** | `Authorization: Bearer <admin_token>` |
| **Input — body** | `{"products": [{"name": "<256-character string of 'C'>", "price": 50000, "description": "", "imageUrl": "", "category_id": 1}]}` _(see Setup Protocol to generate)_ |
| **Defect Target** | Catches bug `length <= 256` (off-by-one too wide) instead of `length <= 255`: if the SUT uses `<= 256`, a 256-char name is incorrectly accepted. Also reveals the Gap if FR-16 does not enforce the FR-15 constraint at all. |
| **Expected Result** | _Gap TC — multiple branches:_ · If HTTP 4xx and 0 products → FR-16 correctly enforces `≤ 255` · If HTTP 200 and product with 256-char name → FR-16 does not enforce limit; Gap confirmed; record as undocumented behavior · If HTTP 200 and product with 255-char name (truncated) → **BUG**: data silently truncated at import |
| **Verification Points** | 1. HTTP status + response body · 2. If product exists → read `name` field and check length (256, 255, or other?) |
| **Status** | ⬜ Not yet executed |

---

## 4. Defect Coverage Matrix

| TC-BVA | Target Variable | Boundary Point | Specific Defect Exposed |
|:---|:---|:---|:---|
| TC-BVA-01 | `price` | ON (value = 0) | `price >= 0` instead of `price > 0` — accepts a product priced at 0 |
| TC-BVA-02 | `price` | LB+1 (value = 1) | `price > 1` or `price >= 2` instead of `price > 0` — rejects a valid price of 1 |
| TC-BVA-03 | `name` length | UB-1 (254 chars) | `length < 254` (enforcement too strict) — rejects a 254-char name |
| TC-BVA-04 | `name` length | UB / ON (255 chars) | `length < 255` (strict less-than) instead of `length <= 255` — rejects a name of exactly 255 chars |
| TC-BVA-05 | `name` length | UB+1 (256 chars) | `length <= 256` (off-by-one too wide) — accepts 256 chars when limit is 255; or confirms Gap if not enforced |

---

## 5. Setup Protocol

### TC-BVA-01 and TC-BVA-02: No special setup required
Input literals `price = 0` and `price = 1` — values provided directly in the JSON body.

### TC-BVA-03, TC-BVA-04, TC-BVA-05: Generate strings of exact length

```javascript
// In Node.js / supertest test:
const name254 = 'A'.repeat(254);  // TC-BVA-03
const name255 = 'B'.repeat(255);  // TC-BVA-04
const name256 = 'C'.repeat(256);  // TC-BVA-05

// Verify lengths before sending:
console.assert(name254.length === 254, 'TC-BVA-03: name must be exactly 254 chars');
console.assert(name255.length === 255, 'TC-BVA-04: name must be exactly 255 chars');
console.assert(name256.length === 256, 'TC-BVA-05: name must be exactly 256 chars');
```

**Post-response verification (TC-BVA-03/04):**
1. Call `GET /api/products`
2. Find the product by name prefix (e.g., `name.startsWith('AAAA')` for TC-BVA-03)
3. Check `product.name.length` matches the input — detects silent truncation

---

## 6. Test Suite Summary

| Category | TCs | Coverage |
|:---|:---|:---|
| EP — Happy Path | TC-01, TC-02 | EC01, EC04, EC07, EC11, EC16, EC18, EC20 |
| EP — Auth | TC-03, TC-04 | EC02, EC03 |
| EP — Invalid Input | TC-05–TC-11 | EC05, EC08, EC09, EC12, EC13, EC14, EC15 + EC19, EC21 |
| EP — Atomicity | TC-12 | EC19, EC21 (multi-row context) |
| Gap Probes | TC-13–TC-16 | EC06, EC10, EC17, EC22 |
| Student-added Gap Probes | TC-17, TC-18 | Response schema + all-invalid rollback |
| **EP Subtotal** | **18 TCs** | 22/22 ECs |
| BVA — `price` boundary | TC-BVA-01, TC-BVA-02 | ON point (0) + min valid (1) |
| BVA — `name` length boundary | TC-BVA-03, TC-BVA-04, TC-BVA-05 | UB-1 / UB / UB+1 at 255-char limit |
| **BVA Subtotal** | **5 TCs** | — |
| **GRAND TOTAL** | **23 TCs** | 22/22 ECs fully covered |
