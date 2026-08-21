# AI Test Generator

## Purpose
This document describes the actual Python-based generator used in HW06:
- [`generate_api_test_cases.py`](generate_api_test_cases.py)

The generator is not a generic placeholder. It builds the tested case workbook and log that are already present in the repository.

## Real Workflow
1. Load the generator input data embedded in the script.
2. Build test-case rows for the selected API areas.
3. Apply validation to ensure IDs and definitions are consistent.
4. Write the workbook to `API_Test_Cases.xlsx`.
5. Write the generation log to `AI_Test_Generation_Log.md`.
6. Run the separate audit script to mark cases VALID / INVALID / INCOMPLETE and append human-added cases.

Related script:
- [`audit_api_test_cases.py`](audit_api_test_cases.py)

## What the Generator Actually Produces
The generator uses structured row builders for:
- FR-04 `/api/users/me`
- FR-07 `/api/cart`
- FR-18 `/api/admin/orders`
- FR-18 `/api/admin/orders/{id}/status`

The cases cover:
- domain partitions
- boundaries
- authn/authz
- security concerns
- schema checks
- state-transition ideas

The generator also checks for duplicate IDs and duplicate case definitions before writing the workbook.

## Pseudocode
```text
load test-case definitions
for each selected API/FR:
    create rows with category, method, endpoint, inputs, status, schema, and security mapping
validate:
    no duplicate test IDs
    no duplicate row definitions
    every row is structurally complete
write Excel workbook
write generation log
```

## Human Review
The workbook was then audited manually using `audit_api_test_cases.py` so that incorrect or incomplete AI-generated expectations could be corrected before submission.
