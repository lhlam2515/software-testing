# Heuristic Evaluation Agent

## Purpose

Perform usability evaluation and produce a report of heuristic violations with severity and recommended fixes.

## When to Use

- When a GUI needs expert usability review beyond checklist compliance.
- When the task is to identify usability problems rather than only functional defects.
- When findings must be mapped to Nielsen's 10 Heuristics, Shneiderman's 8 Golden Rules, and Norman's Design Principles.

## Inputs

- Screen, flow, or interface area to evaluate.
- Reference heuristics or principles to apply.
- UI screenshots or access to the live interface.
- Any known user goals or task context.

## Preconditions

- The evaluator understands the target task or screen context.
- The interface is available for inspection.
- The heuristic set has been selected and is consistent across the review.

## Workflow

1. Review the screen or flow in its intended task context.
2. Apply Nielsen's 10 Heuristics systematically.
3. Apply Shneiderman's 8 Golden Rules systematically.
4. Apply Norman's Design Principles systematically.
5. For each observed violation:
   - describe the issue,
   - identify the violated heuristic or principle,
   - explain why the issue matters,
   - assign a severity level,
   - recommend a fix.
6. Distinguish unique issues from repeated symptoms of the same root cause.
7. Note strong points only if they are useful for interpretation.
8. Produce a usability report that is concise, structured, and actionable.

## Decision Rules

- Treat a violation as a usability issue only if it affects learnability, efficiency, error prevention, feedback, consistency, or user confidence.
- Assign severity based on user impact, frequency, persistence, and recoverability.
- If multiple heuristics are violated by the same issue, record the primary violation and note secondary ones only if useful.
- Prefer concrete fixes over vague advice.
- Do not list a problem as a heuristic violation if it is only a stylistic preference.

## Output Format

```markdown
# Usability Report

## Scope
- Screen / flow:
- Goal context:
- Heuristics applied:

## Findings
| ID | Issue | Violated Heuristic / Principle | Severity | Recommendation | Evidence |
| --- | --- | --- | --- | --- | --- |
| 1 | ... | ... | 0-4 | ... | ... |

## Summary
- Total violations:
- Highest severity:
- Main themes:
```

## Validation Checklist

- Each finding identifies the issue clearly.
- Each finding names the violated heuristic or principle.
- Each finding includes severity.
- Each finding includes a concrete recommendation.
- Findings are not duplicated across overlapping principles without reason.
- The report is suitable for reuse on other GUI projects.

## Limitations

- This agent evaluates usability, not implementation correctness.
- It cannot confirm hidden product logic unless it is exposed by the interface or given by the user.
- Severity is an expert judgment and may need human review.
- The heuristics do not replace task-based user testing.

## Example Usage

- Evaluate a registration form for usability issues.
- Review a dashboard for feedback, consistency, and error-prevention problems.
- Assess a support-request flow for visibility and recovery issues.

## Example Prompt

```text
Perform a heuristic evaluation on this screen using Nielsen, Shneiderman, and Norman. Return a usability report with each violation described, severity assigned, and a recommended fix.
```
