# AI Test Generation Log

## 8. Human Audit
- Every AI-generated test case was reviewed.
- Each case was labeled VALID, INVALID, or INCOMPLETE.
- Invalid and incomplete cases were corrected.

## 9. AI Missed Cases
- Added at least five new test cases.
- For each case, documented why the original AI generation missed it.
- Reasons were classified as prompt quality, model limitation, or API characteristics.

## 10. Final Coverage
- Original cases: 144
- Valid: 127
- Invalid: 11
- Incomplete: 6
- Corrected: 17
- New human/audit cases: 6
- Final total: 150

## 11. Newman Execution

- Collection executed using Newman.
- Student ID header verified.
- Total requests: 154
- Total assertions: 154
- Passed: 110
- Failed: 44
- HTML report generated: `newman-report.html`

## 12. Bug Discovery

- Genuine bugs found: 4
- Security bugs: 2
- State-transition bugs: 1
- Bugs missed by the original AI test generation: 4

## 13. Human Review

Newman failures were manually investigated to distinguish:
- test-case errors
- test-data/setup errors
- environment errors
- genuine backend defects
- security vulnerabilities
