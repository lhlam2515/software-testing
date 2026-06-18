# AI Audit Report

## AI Declaration

I use AI tools for the following tasks: understanding assignment requirements, reviewing EShop source-code behavior, drafting Domain Testing and Boundary Value Analysis cases, generating helper scripts, standardizing report wording, and checking the final submission structure. AI output is reviewed manually before being used in the report.

## Interaction Log

| No. | AI Tool | Date/Time | Purpose | Prompt Summary | Output Summary | Human Review / Correction |
|---|---|---|---|---|---|---|
| 1 | Codex | [Fill in exact date/time] | Test design prompts | Generate Domain Testing and BVA ideas for FR-04, FR-08, FR-18, and FR-20. | Drafted test cases, input variables, and boundary variables. | Reviewed against assignment requirements and source code. |
| 2 | Codex | [Fill in exact date/time] | Source-code review prompts | Inspect EShop backend, web, admin, and mobile behavior for selected features. | Identified actual endpoints, request bodies, validation behavior, role checks, checkout behavior, coupon logic, and mobile local-state risks. | Corrected assumptions that came only from the SRS. |
| 3 | Codex | [Fill in exact date/time] | Script-generation prompts | Create API and UI evidence scripts for selected features. | Produced Node.js API scripts, Playwright UI scripts, helper functions, and result writers. | Checked that generated logs are evidence suggestions, not final verdicts. |
| 4 | Codex | [Fill in exact date/time] | Report-fixing prompts | Reorganize the HW02 folder and standardize all deliverables in English. | Updated README, main report, feature files, bug report, AI audit, critique, script guides, and checklist. | Reset unsupported verdicts to `To be executed` or potential-bug status. |
| 5 | Codex | [Fill in exact date/time] | Human corrections | Review AI output for unsupported claims, broken paths, and inconsistent verdict wording. | Standardized result wording and evidence policy. | Final reviewer must execute or inspect evidence before assigning Pass/Fail. |

## Test Design Prompts

AI was used to draft equivalence classes, invalid domains, boundary values, and executable test-case tables. The human reviewer must confirm that each test maps to actual EShop behavior.

## Source-Code Review Prompts

AI was used to inspect source behavior such as `/api/users/me`, `/api/checkout`, `/api/apply-coupon`, `/api/admin/orders`, `/api/admin/orders/:id/status`, and mobile checkout state. Any source-code-derived risk remains a test target until execution evidence confirms it.

## Script-Generation Prompts

AI helped create scripts that save JSON logs, HTML summaries, and screenshots under `test_scripts/results/`. These scripts mask JWT tokens and mark their output as requiring human review.

## Report-Fixing Prompts

AI was used to reorganize deliverables, standardize English wording, and make reports evidence-based. Exact prompts and timestamps should be pasted into the interaction log before final submission.

## Human Corrections

Human review is required for final verdicts, GitHub Issues, screenshots, demo videos, and any PDF export.
