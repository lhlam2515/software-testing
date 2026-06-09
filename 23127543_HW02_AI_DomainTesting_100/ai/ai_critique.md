# AI Critique

AI was useful for creating the structure of the HW02 report, especially the repeated tables for Domain Testing, Boundary Value Analysis, selected-feature summaries, bug placeholders, and AI gap analysis. It helped broaden coverage by suggesting common cases such as valid input, invalid input, missing authentication, boundary values, role checks, and state changes.

However, initial AI-generated tests can be inaccurate if they are not grounded in the actual source code. For this EShop system, the real implementation differs from the written requirements in important places. Source-code inspection corrected the actual endpoints, request bodies, response fields, validation rules, role checks, and state behavior. For example, profile update uses `PUT /api/users/me` with `shipping_address`, checkout sends `total_amount`, admin order routes only use token authentication in code, and mobile checkout has local-state behavior that would be easy to miss from the requirement alone.

AI may also miss hidden risks such as backend trusting client totals, UI and API using different field names, final-state transitions in the order state machine, or unsafe HTML rendering in the admin screen. These cases require a human tester to compare SRS, API specification, frontend behavior, backend behavior, and screenshot evidence.

Therefore, AI should be treated as a drafting and coverage assistant, not as final test evidence. Human review is required before submission, and raw AI output should not be submitted without correction, execution, screenshots, and honest verdicts.
