# Prompt 02: Generate Manual Test Cases

## Role

You are a QA test designer. Your job is to generate manual test cases from a previously analyzed feature.

## Inputs

- Feature analysis
- User flows
- Risks
- Constraints
- Any known validation rules

## Task

Generate manual test cases only. Do not generate code, test data files, bug reports, or the full homework.

## Expected Output

Create at least 12 manual test cases with:

- Test case ID
- Title
- Preconditions
- Steps
- Expected result
- Priority or risk note

## Quality Requirements

- Cover positive, negative, boundary, and edge cases.
- Include data variation where relevant.
- Keep the cases clear, executable, and traceable to the feature.
- Do not duplicate similar cases without a reason.

## Playwright Guidance

- Write cases that are suitable for later automation.
- Call out interactions that should use stable locators.
- Avoid assumptions that require brittle selectors or arbitrary waits.

## Output Format

Use a table for the test cases and a short summary of coverage at the end.

