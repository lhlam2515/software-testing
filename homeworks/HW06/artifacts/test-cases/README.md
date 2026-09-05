# Test Case Artifacts

This directory will contain the Excel test-case workbook and its Markdown summary. The artifacts will document the generate, audit, and extend stages in REQUIREMENTS.md section 6, items 1-3, and satisfy the Excel test-case and summary requirement in section 14.

## Selected APIs and Coverage Scope

| API | Pool | Endpoint | Spec source | Min. AI-generated cases | Min. student-added cases |
| --- | ---- | -------- | ------------ | ------------------------ | -------------------------- |
| FR-02 Login & Account Lockout | A | `POST /api/login` | `docs/eshop-sut/api_specification.md` section 1.2; `docs/eshop-sut/srs.md` FR-02 | 35 | 5 |
| FR-08 Checkout | B | `POST /api/checkout` | `docs/eshop-sut/api_specification.md` section 4.3; `docs/eshop-sut/srs.md` FR-07 to FR-08 | 35 | 5 |
| FR-15 Product Management (Admin CRUD) | C | `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` | `docs/eshop-sut/api_specification.md` section 3.3; `docs/eshop-sut/srs.md` FR-12, FR-15 | 35 | 5 |

## Required Coverage Groups per API (REQUIREMENTS.md section 6, item 1)

**FR-02 Login & Account Lockout**

- Domain partition: email format (valid/invalid/empty), password presence (valid/invalid/empty), case sensitivity of email lookup.
- State transition: failed-attempt counter increments 0 to 1 to 2 to 3, lock triggers at the 3rd consecutive failure, lock expires after 30s, counter reset on successful login.
- Security: SEC-01 (password never returned/echoed), SEC-02 (JWT correctness/expiry), SEC-05 (SQL injection via `email`/`password` fields), lockout message must not leak whether the email exists.
- Schema: 200 response has `token` (string) and `user` (object); error responses have a consistent error shape.

**FR-08 Checkout**

- Domain partition: `shipping_address` (empty, valid, over-length), cart state (empty cart, non-empty cart), unauthenticated request.
- State transition: cart to order (cart must be cleared after success); repeated checkout of an already-emptied cart.
- Security: SEC-02 (auth required), IDOR (a token cannot checkout another user's cart), server-side recompute of `total_amount` (client-supplied `total_amount` must be ignored, per SRS FR-08).
- Schema: created-order response shape; validation-error response shape.

**FR-15 Product Management (Admin CRUD)**

- Domain partition: `name` (empty, boundary at 255 chars, over-length), `price` (negative, zero, positive, non-numeric), `category_id` (missing, non-existent, valid).
- State/isolation: editing one product must not mutate other products (SRS FR-15); delete of a non-existent id.
- Security: SEC-02 (JWT required), SEC-03 (role must be `'admin'` in the token, not just token presence), SEC-06 (role field not client-settable), IDOR/role-escalation via a non-admin token.
- Schema: create/update response shape; 404 shape on delete of a missing id.

## Excel Workbook

`23127216_HW06_TestCases.xlsx` is the submission workbook required by REQUIREMENTS.md
section 14 ("The Excel test cases and test summary"). It is generated, never hand-edited:

```bash
python3 build_test_case_workbook.py          # requires openpyxl
```

`build_test_case_workbook.py` reads only existing artifacts and derives every number from
them:

| Source | Contributes |
| ------ | ----------- |
| `<fr>/audit/audited-master-test-cases-v2.md` | the final suite (TC ID, technique, precondition, input, expected result, oracle, trace) |
| `<fr>/audit/extended-test-cases-v2.md` | marks the student-added cases, plus miss category and why the AI missed it |
| `<fr>/audit/audit-log-v2.md` | VALID / INCOMPLETE / INVALID label, verdict, student fix |
| `../newman/<fr>/test-execution.md` | execution result, assertion counts, failure evidence |
| `../../BUG_REPORT.md` | the bug summary table |

Sheets: `Test Summary` (per-API counts, audit labels, miss categories, bug list) plus one
sheet per API (`FR-02 Login`, `FR-08 Checkout`, `FR-15 Product CRUD`). Sub-case rows such as
`TC-38a` / `TC-38b` are aggregated to their parent test case; a parent is FAIL if any
sub-case failed. Rebuild the workbook after any change to the source Markdown.
