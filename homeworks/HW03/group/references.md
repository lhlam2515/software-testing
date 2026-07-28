# Checklist References — Group 02 (HW03, Task 1A)

Sources the shared GUI checklist is grounded in. Every checklist item in [gui-checklist.md](gui-checklist.md) must map to at least one entry here.

---

## Reference list

| Ref ID | Type (book / article / standard / course slide) | Source | Used for items | Notes |
| ------ | ----------------------------------------------- | ------ | -------------- | ----- |
| REF-01 | Article | Nielsen, J. *10 Usability Heuristics for User Interface Design.* | IA-01-01, IA-01-05, IA-01-14, IA-03-05, IA-04-02, IA-04-06 | Cited as "Nielsen #n — \<name\>". |
| REF-02 | Book | Norman, D. *The Design of Everyday Things* — 6 design principles. | IA-01-12, IA-03-03, IA-04-10 | Cited as "Norman — \<principle\>". |
| REF-03 | Article | Shneiderman, B. *Eight Golden Rules of Interface Design.* | IA-01-02, IA-03-13, IA-04-01, IA-04-05 | Cited as "Shneiderman #n — \<rule\>". |
| REF-04 | Course slide | *GUI + Usability + Compatibility Testing (AI-First, Combined)* — `docs/slides/EN.GUI-Usability-Compatibility-Testing-AI-First.md`. | IA-02-01, IA-02-03, IA-02-05, IA-02-06, IA-02-07 | Source of the per-control checklists (Waghmare, 2009) — Text Box, Dropdown/Combo Box, Button, Date, Input-field validation. Cited as "Per-Control — \<control\>". |
| REF-07 | Course slide | *S13_GUI Testing & Usability Testing* — `docs/slides/S13_gui_usability_testing.md`. | IA-01-03, IA-01-10, IA-01-11, IA-01-13, IA-02-04, IA-02-08, IA-03-01, IA-03-02, IA-03-04, IA-04-04, IA-04-07, IA-04-11 | Slides 11–14 (Common GUI Bugs → "S13 Bugs"), Slide 16 (Checklist Testing → "S13 Checklist"), Slides 17–18 (Navigation Testing → "S13 Navigation"). |
| REF-08 | Syllabus | ISTQB Foundation Level Syllabus, Ch. 4 §4.4 Checklist-based testing | IA-02-02, IA-02-09, IA-02-10, IA-02-11 | Includes the syllabus's 12-item example form checklist. Cited as "ISTQB Checklist". |
| REF-05 | Standard | W3C *Web Content Accessibility Guidelines (WCAG) 2.2*, Level AA | IA-01-06, IA-01-07, IA-01-08, IA-01-09, IA-02-12, IA-02-13, IA-02-14, IA-02-15, IA-02-16, IA-03-07, IA-03-08, IA-03-09, IA-03-10, IA-03-11, IA-04-03, IA-04-08, IA-04-09 | 17 items across all four POUR principles. Cited as "WCAG 2.2 AA — SC \<number\> \<name\>". |
| REF-06 | Internal (no external citation) | EMS-specific observation — not traceable to a heuristic, course slide, or standard; derived purely from the EMS control classes described in the assignment prompt. | IA-01-04, IA-03-06, IA-03-12 | Per the assignment rule, items with no external source are marked "EMS-specific" instead of a citation. IA-03-06 also carries a `[VERIFY]` note in the checklist since drag-and-drop reorder may not exist on every member's screen. |

> **TODO:** re-check this mapping once `Human`-origin items are added during Task 1B review — new items need a row update here too.

---

## Mapping notes

- **REF-04 vs. REF-07 split**: both are course-slide material, but from two different files. REF-04 (`EN.GUI-Usability-Compatibility-Testing-AI-First.md`) is the only source for the Waghmare per-control checklists (Text Box, Dropdown, Button, Date, Input-field validation). REF-07 (`S13_gui_usability_testing.md`) is the only source for the S13 "Checklist Testing", "Navigation Testing", and "Common GUI Bugs" slides. An item is mapped to whichever file it actually appears in, not merged into one entry, so a grader can open the exact slide.
- **Nielsen vs. Shneiderman overlap on feedback/error handling**: several items could cite either Nielsen #1 (Visibility of system status) or Shneiderman #3 (Offer informative feedback) — both describe the same UX principle from different authors. The checklist follows the convention: Nielsen is used for *state visibility* items (loading indicators, progress bars), Shneiderman is used for *action-outcome* items (toast/confirmation after a completed action), to avoid citing both for the same row.
- **No item cites REF-06 as a real source** — it is a bookkeeping row for the 3 items the assignment explicitly allows to have no external citation ("EMS-specific"). Do not add a 4th, external "TBD" source here; if a genuinely new external source is consulted later, give it its own new Ref ID instead of overloading REF-06.
