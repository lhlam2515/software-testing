# Domain Testing Skill

## Goal
Provide a reusable process for designing Domain Testing test cases for an EShop feature or a similar system feature.

## Process
1. Read the feature requirement/specification and record the business purpose.
2. Identify input variables, state conditions, access-control conditions, and dependent data.
3. Split each variable into valid and invalid domains.
4. Create the `Input Variables / Conditions` table with description, valid domain, and invalid domain.
5. Design test cases that cover:
   - Main valid path.
   - Empty or invalid-format data.
   - Access control: no token, wrong role, accessing another user's data.
   - State-dependent behavior if the feature has a state machine.
   - UI/API mismatches, such as a UI-locked field that the API may still accept.
   - Security cases such as HTML/script input, role escalation, and manipulated amounts.
6. For each test case, specify preconditions, input data, steps, expected result, actual result, verdict, and evidence.
7. If execution has not been performed, always write `Not Executed`; do not guess results.
8. Review AI gaps: identify what AI may have missed because the prompt was too general, code was not inspected, or backend/security behavior was overlooked.

## Checklist
- Feature ID is clear.
- Each feature has at least 8 Domain Testing cases.
- Both valid and invalid domains are included.
- Authorization/security cases are included when the feature affects data or money.
- Evidence paths are real placeholders; do not invent screenshots.

