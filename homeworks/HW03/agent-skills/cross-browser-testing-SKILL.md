# Cross-Browser Testing Agent

## Purpose

Execute compatibility testing across operating systems, browsers, and device classes, and produce a compatibility matrix.

## When to Use

- When a screen or flow must be verified across different platforms and browsers.
- When the deliverable requires pass/fail coverage for compatibility cells.
- When the test must explicitly include rendering, layout, fonts, responsiveness, interaction, scrolling, dialogs, and forms.

## Inputs

- Screen or flow under test.
- Compatibility matrix requirements.
- Target operating systems, browsers, and device classes.
- Screenshot capture reference for each matrix cell.
- Any known device, browser, or OS constraints.

## Preconditions

- The screen is available in a cross-browser testing environment or on real devices.
- The test matrix has been defined.
- Screenshot evidence can be captured for each covered cell.

## Workflow

1. Identify the screen and the compatibility matrix scope.
2. Select the required operating systems, browsers, and device classes.
3. For each covered cell, inspect the screen behavior.
4. Verify:
   - rendering,
   - layout,
   - fonts,
   - responsiveness,
   - interaction,
   - scrolling,
   - dialogs,
   - forms.
5. Mark each cell as PASS or FAIL.
6. Capture a screenshot for every cell in the matrix.
7. If a cell fails, record the defect and note the visible symptom.
8. Summarize coverage and outcomes in a compatibility matrix.

## Decision Rules

- Use PASS when the screen is usable and visually acceptable for that cell.
- Use FAIL when the issue affects readability, layout integrity, interaction, or task completion.
- Keep the matrix explicit about which combinations were actually tested.
- Do not assume untested combinations passed.
- If the screenshot evidence is incomplete, note the limitation rather than inventing a result.

## Output Format

```markdown
# Compatibility Matrix

## Scope
- Screen:
- Matrix dimensions:
- Test environment:

## Results
| OS | Browser | Device | Rendering | Layout | Fonts | Responsiveness | Interaction | Scrolling | Dialogs | Forms | Result | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ... | ... | ... | PASS / FAIL | PASS / FAIL | ... | ... | ... | ... | ... | ... | PASS / FAIL | ... |

## Failed Cells
| Cell | Defect | Note | Screenshot |
| --- | --- | --- | --- |
```

## Validation Checklist

- Every tested cell has a screenshot reference.
- Every required platform category is covered as required by the test plan.
- Each cell has a clear result.
- Failures include short defect notes.
- The matrix can be read independently of the raw session.

## Limitations

- This agent does not replace actual device testing when a real device is required.
- It does not fabricate browser or OS identity.
- It does not guarantee untested combinations.
- It does not fix compatibility problems.

## Example Usage

- Test a registration form on desktop, tablet, and phone.
- Verify event detail rendering in multiple browsers.
- Build a compatibility matrix for a support-request page.

## Example Prompt

```text
Run cross-browser compatibility testing for this screen and return a compatibility matrix with pass/fail results, screenshots, and notes for any rendering or layout failures.
```
