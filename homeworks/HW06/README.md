# HW06 — API Testing

## 1. Overview
This submission documents AI-assisted API testing for the HW06 backend. It includes the main report, AI audit content, Postman collection and environment, Newman evidence, CI/CD documentation, generator documentation, screenshots, and supporting logs.

## 2. System Under Test
The SUT is the HW06 backend running locally at `http://localhost:3000`.

## 3. APIs Tested
The project tests 3 APIs / functional areas:
- FR-04: `/api/users/me`
- FR-07: `/api/cart`
- FR-18: `/api/admin/orders` and `/api/admin/orders/{id}/status`

## 4. Test Case Summary
Primary summary uses the clean all-passing Newman baseline.

| Metric | Count |
|---|---:|
| APIs | 3 |
| Test cases generated | 144 |
| Test cases added | 172 |
| Test cases executed | 172 |
| Test cases passed | 172 |
| Test cases failed | 0 |
| Bugs found | 3 |

Counting method:
- `APIs` means the three selected functional requirements.
- `Test cases generated` means the AI-generated workbook count from `AI_Test_Generation_Log.md`.
- `Test cases added` means the actual Postman request count in the collection.
- `Test cases executed`, `passed`, and `failed` come from the clean Newman baseline report.
- `Bugs found` counts only documented defects, not intentional CI demo failures.

The intentional CI failure is documented separately in the CI/CD report and does not change the baseline summary.

## 5. Test Design Coverage
- Domain Partitioning
- Boundary Value Analysis
- State Transition
- Security
- Schema Validation
- Positive/Negative
- Authentication/Authorization

## 6. Postman Features
See [Postman Features](postman_features.md).

## 7. AI Test Generation
- Generator: [`generate_api_test_cases.py`](generate_api_test_cases.py)
- Audit script: [`audit_api_test_cases.py`](audit_api_test_cases.py)
- Generator notes: [`ai-test-generator.md`](ai-test-generator.md)
- Diagram: [`ai-test-generator.mmd`](ai-test-generator.mmd)

If a PNG rendering of the generator diagram is included later, reference it here as well.

## 8. CI/CD
See [CI/CD Report](CI-CD-report.md).

## 9. Evidence
Screenshots are stored in `evidence/`:
- `evidence/workspace.png`
- `evidence/collection.png`
- `evidence/environment.png`
- `evidence/variable.png`
- `evidence/document.png`
- `evidence/data_driven.png`
- `evidence/monitor.png`
- `evidence/mock_server.png`
- `evidence/CI/CD/success.png`
- `evidence/CI/CD/fail.png`

## 10. Newman Report
The clean baseline Newman report is [`newman-report.html`](newman-report.html).

## 11. Self-Assessment
| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1** | API 1 — full pipeline (generate + audit + extend + execute + bugs) | 30 | 30 |
| **2** | API 2 — full pipeline (same criteria) | 30 | 30 |
| **3** | API 3 — full pipeline (same criteria) | 30 | 30 |
| **4** | Agent Skills (AI-driven test generator) | 10 | 10 |
|  | **Total** | **100** | **100** |

Manual verification note:
- The exact grading outcome depends on TA review of the evidence and execution records.
- Items requiring manual confirmation: GitHub Actions URL insertion, screenshot interpretation, and final grading judgment.
