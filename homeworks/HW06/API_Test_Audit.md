# HW06 API Test Audit

Student ID: `23127543`

## Summary

- Original reported Newman failures: 50
- Invalid test cases fixed in the collection: authentication/misconstructed-request cases for FR-04, FR-07, and some FR-18 requests
- Incomplete test cases fixed in the collection: FR-18 state-transition requests were updated to use separate setup orders where possible
- Valid tests that still fail and indicate genuine issues: admin authorization gaps and several state-transition/transition-assumption failures remain

## Key Corrections Made

- Added/kept `X-Student-Id: 23127543` via collection-level pre-request script.
- Corrected obvious auth-negative requests that were sending valid bearer tokens.
- Added spare setup orders to reduce state dependence in FR-18 transition tests.
- Regenerated `newman-report-fixed.html` from the updated collection.

## Remaining Genuine Bugs

| Bug ID | Test ID | Endpoint | Expected | Actual | Description | Severity |
|---|---|---|---|---|---|---|
| BUG-01 | TC-014, TC-015, TC-018, TC-021, TC-023, TC-030, TC-033 | `GET /api/users/me` | `403` for tampered/invalid security scenarios | `200` | The profile endpoint accepts requests that should fail token-integrity/security checks. | High |
| BUG-02 | TC-077, TC-085, TC-086, TC-087, TC-092, TC-093, TC-095, TC-098, TC-108 | `GET /api/admin/orders` | `403` for non-admin / authorization-bypass scenarios | `200` | Admin orders are exposed without the expected authorization enforcement. | High |
| BUG-03 | TC-110, TC-111, TC-112, TC-116, TC-118, TC-120, TC-121, TC-130, TC-132, TC-140, TC-143, TC-144 | `PUT /api/admin/orders/{id}/status` | Valid transition assertions should succeed only from the correct source state | `400` | Several transition tests still depend on order state in a way that causes the backend to reject them. | Medium |

## Remaining Test-Construction Issues

- `TC-003` was originally misclassified as a missing-token case while sending an invalid token; the request was corrected to a true invalid-token scenario.
- `TC-039`, `TC-040`, `TC-041`, `TC-044`, `TC-045`, `TC-056`, `TC-057`, `TC-058`, `TC-075`, `TC-088`, `TC-090`, `TC-100`, `TC-115`, and `TC-123` were adjusted to better reflect the intended auth or schema scenario.
- Several FR-18 state-transition tests remain sensitive to order-state setup and need more isolated fixtures if the goal is a fully green run.

## Final Newman Execution

- Fresh report generated: `[newman-report-fixed.html](/D:/SoftwareTesting/Homework/software-testing/homeworks/HW06/newman-report-fixed.html)`
- Run status: failed, with remaining failures primarily in admin authorization and state-transition coverage.

## File Paths

- Updated collection: `[API_Test_Cases.postman_collection.json](/D:/SoftwareTesting/Homework/software-testing/homeworks/HW06/API_Test_Cases.postman_collection.json)`
- Environment: `[postman_environment.json](/D:/SoftwareTesting/Homework/software-testing/homeworks/HW06/postman_environment.json)`
- Audit: `[API_Test_Audit.md](/D:/SoftwareTesting/Homework/software-testing/homeworks/HW06/API_Test_Audit.md)`
- Newman HTML report: `[newman-report-fixed.html](/D:/SoftwareTesting/Homework/software-testing/homeworks/HW06/newman-report-fixed.html)`
