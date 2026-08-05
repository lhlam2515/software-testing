---
name: automation-testing-agent
description: Reusable AI-first workflow for analyzing any web feature, generating manual test cases, test data, Playwright Page Objects, data-driven automation scripts, code review notes, bug reports, AI audits, and homework report content.
---

# Automation Testing Agent Skill

## Purpose

Use this skill to convert any web feature into a structured automation testing package for HW04-style assignments. It supports an AI-first workflow that starts with analysis and ends with review, reporting, and defect documentation.

## When to Use

Use this skill when you need to:

- Analyze a web feature for automation coverage
- Produce manual test cases before coding tests
- Create JSON or CSV data sets for test execution
- Build a Playwright Page Object Model
- Generate maintainable Playwright test scripts
- Review AI-generated automation code
- Write bug reports from real failures
- Create AI audit entries and homework report content

## Inputs

Provide the following when using this skill:

- Feature name or feature area
- Application context or page under test
- Functional requirements, notes, or screenshots if available
- Existing selectors, routes, or data constraints if known
- Target browsers or environments
- Known risks, bugs, or special behaviors

## Outputs

Typical outputs include:

- Feature analysis summary
- Manual test cases
- JSON or CSV test data
- Playwright Page Object code
- Playwright test code
- Review checklist and improvement notes
- Bug report content
- AI audit entries
- Final homework report section

## Workflow

Follow this sequence exactly:

1. Analyze the selected feature.
2. Generate at least 12 manual test cases.
3. Generate JSON or CSV data files.
4. Generate a Playwright Page Object.
5. Generate Playwright automation scripts.
6. Ensure scripts are data-driven.
7. Use at least three assertion patterns.
8. Review AI-generated code.
9. Identify weak selectors, flaky waits, missing assertions, duplicated code, and edge cases.
10. Suggest improvements.
11. Generate bug reports when failures indicate real defects.
12. Generate AI Audit Report entries.
13. Generate the homework report section.

Each prompt file in `prompts/` must perform exactly one task. Never combine multiple workflow stages into a single prompt.

## Best Practices

- Prefer stable locators such as `getByRole()`, `getByLabel()`, and `getByTestId()`.
- Use the Page Object Model for reusable interactions.
- Keep test data external and parameterized.
- Write tests that work across Chromium, Firefox, and WebKit when feasible.
- Keep assertions explicit and meaningful.
- Prefer Playwright HTML Reporter-friendly structure.
- Use helper methods for repeated flows.
- Write code that is readable, maintainable, and easy to update.
- Keep prompts generic so they work for any web app feature.

## Constraints

- Do not generate the entire homework in one request.
- Do not hardcode values that should come from data files or parameters.
- Do not use `waitForTimeout()` unless there is an exceptional, documented reason.
- Do not rely on unstable CSS selectors when semantic locators are available.
- Do not assume the target application is EShop or any specific product.
- Do not skip code review before reporting results.

## Example Usage

### Analyze a feature

```text
Use prompts/01-analyze-feature.md for the login page feature.
```

### Generate test cases

```text
Use prompts/02-generate-testcases.md based on the feature analysis.
```

### Build automation

```text
Use prompts/04-generate-page-object.md to create the page object.
Use prompts/05-generate-playwright-tests.md to create the tests.
```

### Review and report

```text
Use prompts/06-review-generated-code.md to audit the generated tests.
Use prompts/07-generate-bug-report.md if the failure is a real defect.
Use prompts/08-update-report.md to finish the homework report.
Use prompts/09-ai-audit-report.md to record AI usage and review notes.
```

