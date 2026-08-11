---
name: hw05-performance-testing-agent
description: Reusable workflow for inspecting an SUT, designing performance scenarios, preparing data-driven JMeter plans, executing tests, analyzing JTL results, and drafting performance reports.
---

# HW05 Performance Testing Skill

## Purpose

Use this skill to prepare performance-testing artifacts for EShop-style assignments without fabricating runtime evidence.

## Workflow

1. Inspect the SUT documentation and available source artifacts.
2. Discover endpoints and authentication requirements.
3. Design a realistic end-to-end workflow.
4. Prepare CSV data for users, admins, products, and checkout data.
5. Generate JMeter plans.
6. Validate the plan structure before execution.
7. Execute the plans only when the SUT is ready.
8. Collect raw JTL files and HTML reports.
9. Analyze JTL metrics.
10. Compare metrics against thresholds.
11. Draft report content and AI audit entries.

## Constraints

- Do not invent endpoint schemas.
- Do not invent performance results.
- Do not fabricate screenshots, JTL files, or hardware specifications.
- Mark all unverified request bodies as TODO.

## Reusable scripts

Scripts in `scripts/` may be used to:

- run JMeter in non-GUI mode
- generate HTML reports
- validate that plan files exist
- copy results into timestamped folders

## Notes

State-reset steps are required for destructive scenarios such as checkout and should be documented before execution.

