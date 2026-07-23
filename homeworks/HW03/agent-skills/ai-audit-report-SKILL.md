# AI Audit Report Agent

## Purpose

Generate the AI Audit Report required by HW03 by recording the AI usage history and validation actions.

## When to Use

- When AI was used during HW03 and the interaction history must be documented.
- When prompts, generated output, human modifications, validation, and limitations must be recorded.
- When a Markdown audit appendix is needed for submission.

## Inputs

- AI tool name.
- Date and time of interaction.
- Prompt text.
- Generated output or a summary of it.
- Human modifications made after review.
- Validation notes.
- Known limitations.

## Preconditions

- The AI interaction details are available.
- Human review has been completed or is being recorded honestly.
- The report is intended to reflect real usage, not a fabricated sequence.

## Workflow

1. Record the AI tool used.
2. Record the date and time of the interaction.
3. Capture the exact prompt or a faithful transcript.
4. Capture the generated output or a concise but faithful summary.
5. Record all human modifications.
6. Record validation steps and corrections.
7. Record limitations or failure modes observed in the AI output.
8. Consolidate the entries into a Markdown audit report.

## Decision Rules

- Use factual timestamps and tool names.
- Preserve the difference between raw AI output and human-reviewed output.
- If no AI was used, record that explicitly.
- Do not omit limitations; they are part of the required audit.
- Do not rewrite the interaction into a generic success story.

## Output Format

```markdown
# AI Audit Report

## Declaration
- AI used: Yes / No

## Tool Log
| Date & Time | AI Tool | Prompt | Generated Output | Human Modifications | Validation | Limitations |
| --- | --- | --- | --- | --- | --- | --- |
| ... | ... | ... | ... | ... | ... | ... |

## Summary
- Main AI-assisted tasks:
- Main corrections made by the human reviewer:
```

## Validation Checklist

- Every AI interaction is logged.
- Prompts are traceable.
- Human review is documented.
- Limitations are explicit.
- The report is in Markdown and suitable for submission.

## Limitations

- This agent relies on accurate user-provided interaction records.
- It does not recover deleted prompts or hidden chat history.
- It cannot validate the truth of a record beyond the supplied inputs.
- It does not judge academic policy compliance.

## Example Usage

- Document the prompts used to build a shared GUI checklist.
- Record an AI-assisted heuristic review workflow.
- Log AI support used during compatibility analysis.

## Example Prompt

```text
Generate an AI Audit Report in Markdown from these AI interaction records, including tool name, prompts, generated output, human modifications, validation, and limitations.
```
