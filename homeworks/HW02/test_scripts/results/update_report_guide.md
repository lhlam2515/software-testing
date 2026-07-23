# Update Report Guide

Generated API and Playwright outputs are evidence, not final report updates.

## Evidence Files

API scripts write:

```text
test_scripts/results/json/
test_scripts/results/html/
```

UI-assisted Playwright scripts write:

```text
test_scripts/results/screenshots/
test_scripts/results/json/
```

Mobile cases are mainly manual. Save reviewed mobile screenshots and link them manually from the FR20 report.

## Map Evidence To Report Rows

1. Open the feature Markdown file.
2. Find the row with the same `TC ID`.
3. Open the generated JSON/HTML result with the matching `testCaseId`.
4. Review request input, expected result, actual status/response, screenshots, and notes.
5. Only then update `Actual Result`, `Verdict`, and `Evidence`.

## Suggested Verdict Rules

- `Pass`: actual behavior matches the expected result.
- `Fail`: actual behavior contradicts the expected result.
- `Needs Review`: result is unclear or requires visual inspection.
- `To be executed`: test has not been run yet.
- `Error`: environment/script issue; not automatically a product bug.

## Evidence Links

Example screenshot link from a feature Markdown file:

```md
[FR08-BVA-13 second screenshot](../../evidence/screenshots/FR08-BVA-13-2.png)
```

Example JSON evidence link:

```md
[fr08_checkout_api_results.json](../../test_scripts/results/json/fr08_checkout_api_results.json)
```

Example HTML evidence link:

```md
[fr08_checkout_api_results.html](../../test_scripts/results/html/fr08_checkout_api_results.html)
```

## GitHub Issues For Confirmed Bugs

Create an issue only after reviewing evidence and confirming the behavior is a product bug. Include:

- Test case ID
- Environment
- Steps to reproduce
- Expected result
- Actual result
- Evidence links

## Warning

Do not submit raw script output as the final report. The scripts intentionally use `verdictSuggestion` and `humanReviewRequired` because final Pass/Fail values must be reviewed manually.
