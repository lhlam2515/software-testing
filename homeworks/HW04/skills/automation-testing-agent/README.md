# Automation Testing Agent Skill

This skill supports the HW04 AI-first automation testing workflow for any web application feature. It helps generate manual test cases, test data, Playwright Page Objects, automated tests, review notes, bug reports, audit entries, and the final homework report section.

## Purpose

Use this skill when you need a repeatable, AI-assisted workflow for converting a web feature into:

- Manual test cases
- Structured test data
- Playwright Page Object Model code
- Data-driven Playwright test scripts
- AI review notes and critique
- Bug reports
- AI audit entries
- Homework report content

The skill is intentionally generic and does not assume a specific product, domain, or application architecture.

## Folder Structure

| Path | Description |
| --- | --- |
| `SKILL.md` | Main skill instructions in the standard Codex Agent Skill format |
| `prompts/` | One-task-at-a-time prompt files used during the workflow |
| `templates/` | Markdown templates for reports, audits, and critiques |

## Workflow

Follow the workflow in order:

1. Analyze the selected feature.
2. Generate at least 12 manual test cases.
3. Generate JSON or CSV test data.
4. Generate a Playwright Page Object.
5. Generate Playwright automation scripts.
6. Ensure scripts are data-driven.
7. Use at least three assertion patterns.
8. Review the generated code.
9. Identify weak selectors, flaky waits, missing assertions, duplicated code, and edge cases.
10. Suggest improvements.
11. Generate bug reports when failures indicate real defects.
12. Generate AI Audit Report entries.
13. Generate the report section for the homework.

Each prompt file performs exactly one task. Do not ask the model to generate the entire homework in a single request.

## How to Use Each Prompt

### `01-analyze-feature.md`
Use this first to inspect the chosen feature and define the test scope.

Expected output:

- Feature summary
- User flows
- Risks
- Assumptions
- Test boundaries

### `02-generate-testcases.md`
Use this after feature analysis to create manual test cases.

Expected output:

- At least 12 manual test cases
- Preconditions
- Steps
- Expected results
- Priority or risk notes

### `03-generate-testdata.md`
Use this to create reusable JSON or CSV test data for the feature.

Expected output:

- One or more structured data files
- Field descriptions
- Valid and invalid variants

### `04-generate-page-object.md`
Use this to generate a Playwright Page Object for the feature.

Expected output:

- Locator methods
- Action methods
- Assertion helpers
- Reusable interactions

### `05-generate-playwright-tests.md`
Use this to create Playwright tests that consume the page object and test data.

Expected output:

- Data-driven test suite
- Multi-browser friendly code
- Stable locator usage
- Playwright HTML Reporter compatibility

### `06-review-generated-code.md`
Use this to review generated Playwright code before finalizing it.

Expected output:

- Selector quality review
- Flakiness review
- Assertion coverage review
- Duplication review
- Edge case review
- Improvement suggestions

### `07-generate-bug-report.md`
Use this when a failing test appears to reveal a real defect.

Expected output:

- Repro steps
- Actual and expected results
- Environment details
- Severity
- Evidence summary

### `08-update-report.md`
Use this to produce or update the homework report section.

Expected output:

- Feature summary
- Testing approach
- Test data summary
- Automation summary
- Findings
- Lessons learned

### `09-ai-audit-report.md`
Use this to record AI usage, code quality observations, and review notes.

Expected output:

- Audit entries
- Risks
- AI contribution summary
- Human review notes

## Example Conversation

1. "Analyze the checkout feature."
2. "Generate 12 manual test cases from that analysis."
3. "Generate JSON test data for valid and invalid checkout inputs."
4. "Generate a Playwright Page Object for the checkout page."
5. "Generate Playwright tests using that page object and data."
6. "Review the generated code for selector quality and flakiness."
7. "Generate a bug report for the observed failure."
8. "Update the homework report with the results."

## Expected Outputs

The skill should produce professional, maintainable outputs with:

- Page Object Model structure
- Reusable helper methods
- Data-driven testing
- Multi-browser support
- Playwright HTML Reporter compatibility
- Stable locators such as `getByRole()`, `getByLabel()`, and `getByTestId()`

## Limitations

- This skill does not inspect the live application by itself.
- It does not replace human review of test quality or defect severity.
- It should not be used to generate the entire homework in one step.
- It should avoid hardcoded values when reusable data or parameters are possible.

