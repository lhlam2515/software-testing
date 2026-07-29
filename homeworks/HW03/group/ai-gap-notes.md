# AI Gap Notes — Group 02 (HW03, Task 1A)

This file records **every difference between the AI draft of [gui-checklist.md](gui-checklist.md) and the checklist we are submitting** — assignment §6, Task 1A. Three kinds of difference, one reasoning row each:

1. **Part 1** — the 11 items marked `Human` in the checklist: why the AI missed them.
2. **Part 2** — the 4 AI items we removed and the 2 rules/citations we rewrote: why the draft's version did not hold.

Accepted root causes (pick one, and justify):

| Cause | Meaning |
| ----- | ------- |
| `PROMPT` | Prompt quality — the AI was never given the context needed (e.g. EMS screenshots, the EN/VI requirement), or was instructed away from it. |
| `MODEL` | Model limitation — the AI cannot perceive it (rendered layout, colour contrast, timing), has a known blind spot, under-uses a source it was handed in full, or restates one rule as two items. |
| `EMS` | EMS-specific — the item depends on a product detail no generic checklist would contain. |
| `SCOPE` | The AI produced it, but outside the GUI scope, so it was rewritten or removed rather than kept. |

> Areas AI commonly misses (per §6, examples only — not a to-do list): accessibility, right-to-left layout, dark mode, keyboard navigation, EN/VI i18n.

**Two prompt design choices drive most rows below**, so they are stated once here instead of repeated in every cell. The generation prompt is [gui-checklist.prompt.md](gui-checklist.prompt.md).

1. `<course_references>` gives the AI a **closed whitelist of 17 WCAG success criteria** and instructs: "pull from this list only, do not cite a Success Criterion not named here."
2. `<constraints>` **excludes three topics by name** — i18n EN/VI switching, right-to-left layout, dark mode — and the same line says these are "added by hand later as `Human`/`PROMPT` gap items". The exclusion was a deliberate deferral, not an oversight; it is still the reason the draft ships zero i18n coverage, and the reason four of the eleven `Human` items exist.

A third choice shows up only in Part 2: the prompt required a **binary Passed/Failed verdict** ("every item you write must be something a human tester can mark Passed or Failed on sight"). That one did not survive contact with a real screen.

---

## Part 1 — Why the AI missed the 11 `Human` items

| Item ID | Checklist item (short) | Root cause | Why the AI missed it | Evidence |
| ------- | ---------------------- | ---------- | -------------------- | -------- |
| IA-01-14 | All chrome strings switch with the selected language | `PROMPT` | The prompt forbade any i18n item outright. The AI complied exactly, so the checklist ended up with zero coverage of a control EMS ships in its top navigation bar. | `<constraints>`: "No item about i18n EN/VI switching, right-to-left layout, or dark mode." None of the 54 draft items mentions language. |
| IA-01-15 | Language switch preserves the current screen and view state | `PROMPT` | Same exclusion. With no i18n item permitted, the follow-on question of what the switch does to filter, tab and scroll state could not arise. | Same constraint line. |
| IA-01-16 | Locale-correct date / time / number format plus a time-zone label | `EMS` | Generic checklists file date handling under date-**input** validation, and that is exactly how the prompt supplied it ("date field rejects invalid day/month combinations… handles leap years"). Nothing in the source material covers **rendering** a stored timestamp. That EMS prints the same `dd/MM/yyyy HH:mm` string under both languages, on a system whose records are timed events, is a product behavior no external source describes. | Per-Control Date clause in `<course_references>` is input-only, and it is already spent on IA-02-07. Live survey 2026-07-29, `/dashboard`: `03/08/2026 08:00` rendered identically in EN and VI. |
| IA-01-17 | Vietnamese diacritics render intact and are not truncated | `PROMPT` | Downstream of the same i18n exclusion. It also needs the knowledge that Vietnamese strings run roughly 30% longer than their English counterpart inside a button sized for English, which the prompt never supplied. | Same constraint line; no draft item references encoding, font fallback, or string expansion. |
| IA-02-15 | Dropdown has a visible label, non-empty list, stable ordering | `MODEL` | The prompt pasted all **six** per-control checklists in full, including Dropdown / Combo Box. The AI used three of the six and dropped the rest without flagging the omission. Given complete source material, it still narrowed to the controls that resemble the ones in its worked examples. | `<course_references>` lists 6 control classes; the draft's Source column cites only Text Box, Date, and Input-field validation. |
| IA-02-16 | Checkbox and radio group behavior | `MODEL` | Same truncation of the same source block, and it costs real coverage: the EMS registration role picker is a checkbox-card group, on the screen scenario B is built around. | Per-Control "Checkbox & Radio button" supplied in full, cited by zero draft items. |
| IA-02-17 | Disabled controls are greyed, unfocusable, and explain themselves | `MODEL` | The ISTQB 12-item form checklist was pasted item by item. The AI reproduced the best-known entries (error near the field, Reset/Cancel, double-submit, Enter-to-submit, plus the required-field marker through the Text Box source) and lost the rest. Recall bias toward the canonical subset, not missing input. | All 12 items present in `<course_references>`; items 7, 9 and 10 cited by no draft row. |
| IA-02-18 | Long values do not break the containing layout | `MODEL` | Same truncation, ISTQB item 9. | Same. |
| IA-02-19 | Validation trigger consistent across one form | `MODEL` | Same truncation, ISTQB item 10. The draft has four items about error **content and placement** (IA-02-02, IA-02-12, IA-02-13, IA-02-14) and none about **when** validation fires. | Same. |
| IA-02-20 | Rich-text content renders as composed, no raw markup exposed | `PROMPT` | "Rich-text editor" appears in the IA-02 aspect label and in the `<ems_context>` control-class list, but no entry in `<course_references>` says what to check about authored content — and a separate constraint requires every item to be traceable to a named source. The AI produced the one thing it could ground, a leftover-placeholder item (IA-02-08), and stopped. | `<ems_context>` control class names rich-text input; no per-control, ISTQB or WCAG entry covers rendering fidelity. |
| IA-02-21 | Uploaded images keep aspect ratio, no broken or missing image | `MODEL` | The Image clause ("not blurred, correctly sized, not broken") was supplied inside the Hyperlink / Image / Grid / List / Date entry and went unused — the same truncation as IA-02-15, one level deeper: the AI consumed one clause of a multi-clause source line and dropped the others. | Only the Date clause of that entry was used (IA-02-07). |

**Root-cause split, Part 1:** 4 `PROMPT`, 6 `MODEL`, 1 `EMS`, 0 `SCOPE`.

---

## Part 2 — What we removed or rewrote in the AI draft

Four AI items were cut and two rules rewritten. Each row is the mirror image of Part 1: not a gap in the draft's coverage, but a defect in what it did produce.

| Change | Draft item / rule | Root cause | Why the draft's version did not hold | Evidence |
| ------ | ----------------- | ---------- | ------------------------------------ | -------- |
| Removed | IA-01-14 — "icons and wording for a real-world concept match common web conventions rather than a novel or ambiguous metaphor" (Nielsen #2) | `SCOPE` | "Ambiguous" is a judgement about a user's understanding, not a property of the rendered screen. The course deck asks exactly this as a Task 2 **preference probe** ("Are icons self-explanatory?"). Answering it ourselves substitutes one tester for the five participants Task 2 requires. Its Nielsen #2 citation moved onto IA-01-16, so no source was lost. | B2 run recorded it `Passed` by listing icons the tester personally found conventional — a verdict with no failure condition. Goes to: Task 2 probe questions. |
| Removed | IA-02-15 — review step before an uncorrectable submission (SC 3.3.4) | `SCOPE` | A requirement about how a **flow** is designed, not about whether a screen renders and behaves as specified. It cannot fail as a GUI defect: a screen without a review step is not broken, it is a different design. | B2 run, IA-02-15: `Passed` with the note "no separate review step exists, but the action is not 'uncorrectable'". An item whose pass condition has to be argued around is testing the wrong thing. Goes to: dropped. |
| Removed | IA-02-16 — a field's valid/invalid state is never signalled by colour alone (SC 1.4.1) | `MODEL` | A third statement of SC 1.4.1. IA-02-12 already requires an explicit text error "not only a border-colour change"; IA-04-03 already requires state to carry colour **and** a text label or icon. Worse, the wording tracks the prompt's own format example IA-02-EX2, which the prompt explicitly said not to reuse. | `<examples>`: "do not reuse these two items verbatim in your output." Three surviving rows cite or paraphrase SC 1.4.1. |
| Removed | IA-04-11 — each distinct state uses its own colour, no reuse across meanings (S13 Checklist) | `MODEL` | Duplicate of IA-01-11, filed under a second interface aspect. IA-01-11 owns colour-palette consistency; splitting the same rule across IA-01 and IA-04 inflates the item count without adding a check. | Both rows cite S13 Checklist (Color scheme). B2 run marked both `Passed` on the same observation. |
| Rewritten | IA-02-06 source: "character limit **matches the DB column size**" → "character limit" | `SCOPE` | The clause is copied verbatim from the per-control source line, which mixes a GUI check (typing past the limit is visibly prevented) with a schema check no tester can make from a rendered screen. The AI cited its source faithfully; filtering the source for stage-1 scope is our job, not its refusal. | `<course_references>`, Input-field validation: "…mandatory fields align with the DB NOT NULL constraint…; character limit matches the DB column size." |
| Rewritten | Verdict rule: binary `Passed` / `Failed` → `Passed` / `Failed` / `N/A`, with mandatory Notes on `Failed` and `N/A` | `PROMPT` | The prompt mandated a binary verdict, so the AI wrote every item as if it always applies. It does not: a shared checklist run against four different screens hits control classes that are simply absent, and forcing those into `Passed` inflates the pass rate with checks nobody performed. The three-verdict form was in our own reference deck and the prompt overrode it. | Prompt: "every item you write must be something a human tester can mark Passed or Failed on sight." B2 run, 2026-07-28: **21 of 54** items had no matching control class on the screen. REF-04 deck, GUI Review Checklist: "Score each item Yes / No / **N/A**". |

**Root-cause split, Part 2:** 1 `PROMPT`, 2 `MODEL`, 0 `EMS`, 3 `SCOPE`.

### Items considered and deliberately not written as gap rows

The review pass also raised a 360px-viewport reflow check, a 200% text-zoom check, and an OS dark-mode / high-contrast check. None of them is in the checklist and none of them gets a row above.

Writing a gap row for them would assert that the AI failed to produce something it should have produced. It did not. The prompt constraint that suppressed them was correct: all three are Task 3 compatibility checks, stage 4 under the deck's own Four Test Stages slide. The honest record is that *we* briefly mis-scoped the checklist during review, not that the AI mis-scoped its draft.

One consequence is worth carrying forward: SC 1.4.10 Reflow sits in the prompt's WCAG whitelist **and** is banned by the prompt's constraint on responsive breakpoints, in the same prompt. The AI silently dropped it rather than flagging the conflict. Post-review the ban is right, so the repair is to remove 1.4.10 from the whitelist, not to lift the ban.

---

## Pattern summary

Across both parts: 5 gaps trace to `PROMPT`, 8 to `MODEL`, 1 to `EMS`, 3 to `SCOPE`. The split matters more than the counts, because these are four different failures with four different fixes.

The `PROMPT` group is not the AI missing anything. Every item in it was either banned by name or unreachable because its criterion sat outside a closed whitelist, and the AI followed the instruction exactly — including the binary-verdict instruction that a single real screen then falsified. What we learn is that a prompt constraint is a coverage ceiling: whatever it excludes, no amount of re-prompting inside the same constraint will recover.

The `MODEL` group is the genuine limitation, and it runs in both directions. On the supply side, six per-control checklists and the ISTQB 12-item list were pasted in full; the AI used three of six control classes and five of twelve ISTQB items, keeping the entries that recur most often in public checklist writing. On the output side, it re-derived two rules it had already written and filed them under a second aspect, one of them lifted from the prompt's own "do not reuse" example. Completeness of input produced neither completeness nor economy of output, and nothing in the response signalled either problem.

The `SCOPE` group is ours as much as the model's. Two AI items and one source clause were outside GUI testing and we kept them through the first review; the deck's Four Test Stages slide settles all three in one reading.
