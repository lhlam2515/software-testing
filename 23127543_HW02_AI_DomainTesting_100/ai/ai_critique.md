# AI Critique

AI was useful during the initial stage of HW02 because it quickly generated the report structure, test-case tables, valid/invalid domain groups, and common boundary values. For features such as FR-04, FR-08, FR-18, and FR-20 Mobile Checkout, AI helped save time when drafting the documentation framework and reminded the tester of common test categories: valid data, empty data, missing authentication, invalid formats, and error-message checks.

However, AI output cannot be used directly without comparing it against the real specification and source code. AI may miss state-machine cases such as `delivered` and `canceled` being final states, or invalid transitions such as `pending -> delivered`. It may also underestimate backend risks, for example the backend must recalculate checkout totals instead of trusting client-provided `total_amount`, and APIs must block a normal user from sending `role=admin`. HTML escaping in shipping addresses and UI/API mismatch risks are also easy to miss when the prompt is too general.

Therefore, the tester must review all AI-generated output, read the SRS/API documents, inspect the mobile app, and add missing edge cases. In this assignment, the tester added security cases, authorization-bypass cases, state-dependent behavior, manipulated payload cases, mobile network/API mismatch checks, and kept every result as `Not Executed` until real execution evidence is available.

