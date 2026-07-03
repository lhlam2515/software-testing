# AI Critique

## What AI Helped With

AI was helpful at the beginning of this assignment. It helped me list possible Domain Testing and Boundary Value Analysis cases, and it also helped me organize the report in a clearer format. This saved time, especially when I needed a starting point for the selected features.

## What AI Missed

However, the AI was not always correct. When it only used the requirement text, it sometimes assumed that the backend followed the SRS exactly. After checking the source code, I found some differences, such as validation only happening on the frontend, backend APIs trusting values sent by the client, and admin routes where the role checking was not as clear as expected.

AI also gave some test ideas that were too general. Some early cases did not include enough details, such as the exact endpoint, request body, token, or follow-up check. Because of that, those cases had to be fixed manually before they could be used.

## What I Learned

Another problem was evidence review. AI could suggest a result from a screenshot or an API response, but some cases still needed human judgment. This was especially true for UI rendering, XSS behavior, mobile behavior, and checking whether the data was really changed.

From this assignment, I learned that AI is useful as an assistant, but it cannot replace manual checking. The better workflow is to guide AI step by step, inspect the source code, run the tests, review the evidence, and only then write the final result. In the end, the student still has to take responsibility for the correctness of the report.
