# Updating Feature Reports From Generated Evidence

Generated JSON files and screenshots are evidence aids. They are not final report verdicts.

## Mapping Results To Report Rows

1. Open the relevant file in `test_scripts/results/json/`.
2. Match `testCaseId` to the same `TC ID` row in the feature report.
3. Read `expected`, `actual`, `statusCode`, and any screenshots.
4. Decide the final report `Actual Result` and `Verdict` manually.

## Linking Screenshots

Use relative links from a feature report to the screenshot path. Example:

```md
[FR08-BVA-13-ui-after-checkout-cart.png](../test_scripts/results/screenshots/FR08-BVA-13-ui-after-checkout-cart.png)
```

If a screenshot name has a timestamp suffix, link the exact generated file.

## Verdict Meanings

- `Pass`: Reviewed evidence confirms the expected result.
- `Fail`: Reviewed evidence confirms behavior violates the expected result.
- `Needs Review`: Evidence is incomplete, ambiguous, or requires visual/human judgment.
- `Not Executed`: The case was not run or the environment was not ready.

## GitHub Issues

Create an issue only after confirming a failed case. Include:

- Test case ID
- Environment
- Steps to reproduce
- Expected result
- Actual result
- Screenshot/JSON evidence path

## Warning

Do not submit raw script output as the final report. The scripts intentionally use `verdictSuggestion` and `Manual Review Required` because the final homework tables should be updated by a human reviewer.
