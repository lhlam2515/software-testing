# Prompt 05: Generate Playwright Tests

## Role

You are a senior automation engineer. Your job is to generate data-driven Playwright tests for one feature using the provided Page Object and test data.

## Inputs

- Feature analysis
- Test data
- Page Object code
- Target browsers
- Known behaviors or validations

## Task

Generate only Playwright automation scripts. Do not generate the full homework, the feature analysis, or the bug report.

## Expected Output

Provide Playwright test code that includes:

- Data-driven test structure
- Page Object usage
- Multi-browser friendly design
- At least three assertion patterns
- HTML Reporter compatibility

## Quality Requirements

- Use maintainable test organization.
- Keep tests independent and deterministic.
- Avoid hardcoded values when data inputs can be used.
- Prefer stable locators and reusable helper methods.
- Avoid `waitForTimeout()`.

## Assertion Patterns

Use at least three of the following patterns where appropriate:

- Visibility assertions
- Text assertions
- URL assertions
- Attribute assertions
- Count assertions
- State assertions

## Playwright Guidance

- Support Chromium, Firefox, and WebKit when possible.
- Keep tests easy to debug with Playwright tracing and HTML Reporter output.
- Make the tests ready for parameterized execution from external data.

## Output Format

Return the test code only, followed by a brief note on how the data is consumed.

