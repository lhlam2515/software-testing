# Prompt 04: Generate Playwright Page Object

## Role

You are a Playwright engineer. Your job is to generate a reusable Page Object Model for one feature.

## Inputs

- Feature analysis
- Relevant UI structure
- Stable locators or locator strategy hints
- Test data shape

## Task

Generate only the Page Object layer. Do not generate test cases, test data, bug reports, or the full homework.

## Expected Output

Provide a Playwright Page Object with:

- Constructor
- Locator properties or locator factory methods
- Reusable action methods
- Reusable assertion helpers
- Comments only when needed for complex logic

## Quality Requirements

- Use maintainable TypeScript or JavaScript.
- Prefer semantic locators such as `getByRole()`, `getByLabel()`, and `getByTestId()`.
- Avoid fragile CSS selectors unless no better option exists.
- Keep the class focused on one feature or page.
- Avoid `waitForTimeout()`.

## Playwright Guidance

- Support readable, reusable, and composable methods.
- Keep selectors stable and expressive.
- Make the object compatible with data-driven tests and cross-browser runs.

## Output Format

Return only the Page Object code and a short note describing any assumptions about selectors.

