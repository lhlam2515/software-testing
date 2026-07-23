# GUI Checklist Testing Agent

## Purpose

Execute a GUI checklist on a selected screen and produce a structured checklist execution report.

## When to Use

- When a screen must be inspected against a reusable GUI checklist.
- When the result must be recorded as PASS, FAIL, or N/A per checklist item.
- When the workflow must include evidence notes and screenshot references for failed items.

## Inputs

- Screen identifier or screen name.
- Checklist items to execute.
- Current UI state or screenshot of the screen.
- Environment details if relevant to interpretation.
- Evidence capture capability, including screenshot storage path or reference system.

## Preconditions

- The screen is accessible and stable enough for inspection.
- The checklist is already defined or provided.
- The agent can record observations without altering the product state unless the test requires interaction.
- The user has identified the screen or flow to inspect.

## Workflow

1. Identify the screen under test.
2. Confirm the checklist scope and item list before inspection.
3. Inspect the screen item by item in a consistent order.
4. For each item, determine whether the screen satisfies the requirement.
5. Mark the item as PASS, FAIL, or N/A.
6. For each FAIL, record:
   - the observed issue,
   - the exact evidence,
   - the impact on usability or correctness,
   - the screenshot reference if required.
7. Capture screenshots when visual evidence is needed.
8. Avoid duplicate findings by consolidating repeated observations on the same root cause.
9. Summarize the screen-level result.
10. Produce a structured report that can be reused across different GUI projects.

## Decision Rules

- Use PASS only when the item is clearly satisfied.
- Use FAIL when the item is violated, ambiguous in a harmful way, or causes user friction.
- Use N/A only when the item does not apply to the selected screen.
- If the item cannot be assessed from the available evidence, record it as unresolved and explain what is missing.
- If a failure affects multiple checklist items, note the shared root cause rather than inventing separate defects.
- Do not infer compliance from a partial match.

## Output Format

```markdown
# Checklist Execution Report

## Screen
- Screen name:
- Function / scenario:
- Environment:
- Date:

## Checklist Results
| ID | Checklist Item | Result | Notes | Evidence |
| --- | --- | --- | --- | --- |
| 1 | ... | PASS / FAIL / N/A | ... | ... |

## Failed Items
| ID | Issue | Impact | Screenshot Ref |
| --- | --- | --- | --- |

## Summary
- Total items:
- Passed:
- Failed:
- N/A:
- Key findings:
```

## Validation Checklist

- Every checklist item has a result.
- Every FAIL has a note explaining why it failed.
- Screenshot references are included for failed visual issues when needed.
- The report is structured and readable.
- The result distinguishes actual failures from items that are not applicable.

## Limitations

- This agent evaluates only the provided screen or screens.
- It does not redesign the checklist.
- It does not invent evidence that was not observed.
- It does not replace human review of ambiguous cases.
- It does not automatically confirm hidden backend behavior unless visible in the UI or supplied by the user.

## Example Usage

- Review a login screen against the checklist.
- Inspect an event creation form for labels, validation, and feedback.
- Execute the checklist on a support request detail page.

## Example Prompt

```text
Execute the GUI checklist on this screen and return a checklist execution report with PASS / FAIL / N/A, evidence notes, and screenshot references for any failures.
```
