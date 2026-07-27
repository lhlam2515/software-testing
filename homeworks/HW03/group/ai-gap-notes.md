# AI Gap Notes — Group 02 (HW03, Task 1A)

For every checklist item marked `Human` in [gui-checklist.md](gui-checklist.md), explain **why the AI missed it** — assignment §6, Task 1A.

Accepted root causes (pick one, and justify):

| Cause | Meaning |
| ----- | ------- |
| `PROMPT` | Prompt quality — the AI was never given the context needed (e.g. EMS screenshots, the EN/VI requirement). |
| `MODEL` | Model limitation — the AI cannot perceive it (rendered layout, colour contrast, timing) or has a known blind spot. |
| `EMS` | EMS-specific — the item depends on a product detail no generic checklist would contain. |
| `SCOPE` | The AI produced it but outside the four interface aspects, so it was rewritten rather than added. |

> Areas AI commonly misses (per §6, examples only — not a to-do list): accessibility, right-to-left layout, dark mode, keyboard navigation, EN/VI i18n.

---

## Gap table

| Item ID | Checklist item | Root cause (`PROMPT` \| `MODEL` \| `EMS` \| `SCOPE`) | Why the AI missed it | Evidence (prompt round / output excerpt) |
| ------- | -------------- | ---------------------------------------------------- | -------------------- | ---------------------------------------- |
|  |  |  |  |  |

---

## Pattern summary

_TBD — after the table is filled: which root cause dominates, and what that says about how to prompt for checklists next time._

> **TODO:** every `Human` item in the checklist needs exactly one row here.
