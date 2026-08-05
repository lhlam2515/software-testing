# Checklist Prompts — Group 02 (HW03, Task 1A)

Verbatim AI prompts used to generate and refine the shared GUI checklist. Required deliverable per assignment §6 (Task 1A) and §10.

> Do not paraphrase. Each round below = one prompt + the resulting output, plus what the human reviewer changed.
> This entry also appears in [../prompt_log.md](../prompt_log.md) with the same timestamp.

---

## Round 1 — Initial generation (only round)

**Tool:** Claude Code (Sonnet 5)
**Timestamp:** 12:56 28/07/2026 (+07:00) — matches commit `f5c4e72`

### Prompt

Verbatim `<role>` … `</task>` block from [gui-checklist.prompt.md](gui-checklist.prompt.md), pasted into the tool as a single message. The design rationale for why the prompt is shaped this way lives in that file's "Design notes" section and is not part of what was pasted.

```
<role>
You are acting as a senior QA reviewer designing a reusable GUI checklist for a university software-testing course assignment. The checklist will be executed by hand against live screens later — every item you write must be something a human tester can mark Passed or Failed on sight, with no ambiguity about what "pass" means.
</role>

<assignment_context>
This checklist is Task 1A of a graded assignment ("HW03 — GUI & Usability Testing on EMS"). It is a **group deliverable**: one checklist, shared by the whole group, later executed individually by each member on their own scenario's screens.

Hard requirements from the assignment brief (do not deviate from these):
- Must cover exactly four interface aspects, defined below. Do not invent a fifth category or rename these.
- Target: more than 40 items total across the four aspects combined.
- Every item must be independently verifiable on a screen with a binary Passed/Failed verdict. Reject vague criteria like "looks good," "feels intuitive," or "should be user-friendly."
- Every item must cite the specific source it comes from (a named heuristic number, a named course-slide concept, or "EMS-specific" if it doesn't map to any external source).

The four interface aspects (IA), verbatim from the assignment:
- **IA-01: General UI standards** — layout, alignment, typography, colour, consistency, i18n EN/VI, empty/loading states.
- **IA-02: Forms** — labels, validation, error placement, required-field handling, uploads, rich-text editor.
- **IA-03: Navigation** — menus, breadcrumbs, tabs, sidebar, drag-and-drop reorder, back/return actions, deep links.
- **IA-04: Feedback / state** — toasts, badges, confirmation dialogs, progress bars, status colours, real-time updates.
</assignment_context>

<course_references>
Use these as your primary source material — cite them by name in the Heuristic/Source column wherever an item derives from one of them. Do not invent citations to sources not listed here.

**Nielsen's 10 Usability Heuristics** (cite as "Nielsen #n — <name>"):
1. Visibility of system status
2. Match between system and the real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, and recover from errors
10. Help and documentation

**Norman's 6 Principles of Interaction Design** (*The Design of Everyday Things*; cite as "Norman — <name>"):
Affordances, Signifiers, Constraints, Mappings, Feedback, Consistency.

**Shneiderman's Eight Golden Rules** (cite as "Shneiderman #n — <name>"):
1. Strive for consistency
2. Enable frequent users to use shortcuts
3. Offer informative feedback
4. Design dialogs to yield closure
5. Offer error prevention and simple error handling
6. Permit easy reversal of actions
7. Support internal locus of control
8. Reduce short-term memory load

**Course slide S13 — GUI Testing & Usability Testing, "Low-Level — Checklist Testing"** (cite as "S13 Checklist"):
GUI standards, Application standards, Color scheme, Typography, Layout and alignment, Labels, Error messages.

**Course slide S13 — "Low-Level — Navigation Testing"** (cite as "S13 Navigation"):
Main menu navigation (all sections reachable), breadcrumb navigation (accurately reflects path, allows backtracking), links and buttons (lead to expected screens/actions), form navigation (logical field order, validation messages appear in correct location).

**Course slide S13 — "Common GUI Bugs"** (cite as "S13 Bugs"), used as failure-pattern seeds for IA-02/IA-04:
Data validation gaps; incorrect field defaults; mandatory fields not marked as mandatory; menu options not aligned with data/application state; control state not aligned with underlying data state; focus not placed on the object that needs it.

**Course slide — Per-Control Checklists** (Waghmare, 2009, via the course's combined GUI-testing deck; cite as "Per-Control — <control>", e.g. "Per-Control — Text Box"):
- Text Box: enable/disable per spec; red asterisk on mandatory fields; stops at max width; rejects spaces-only input; correct label with alignment consistent to siblings; scrollbar shown when content exceeds the box.
- Dropdown / Combo Box: arrow shown with a default or blank value; rejects values outside the list; list is non-empty with a scrollbar for long lists; typing the first letter selects the matching item; sorted alphabetically by default, names not truncated.
- Button: enable/disable state and reachable via Tab in order; one default button (thick border) fires on Enter, Cancel fires on Esc; label meaningful and not abbreviated, "…" shown if it opens another screen; an uncorrectable action prompts a Yes/No confirmation; all buttons share consistent size, shape and font.
- Checkbox & Radio button: correct default checked/unchecked state; Tab selects in series and Mouse/Space/Enter/Alt+letter all toggle; only one radio option selectable per group; alignment proper.
- Hyperlink / Image / Grid / List / Date: hyperlink uses standard colour and underline, opens on click/Enter/Ctrl+click and goes to the correct page; image is not blurred, correctly sized, not broken; grid header click sorts ascending/descending; date field rejects invalid day/month combinations (e.g. Feb 30) and handles leap years.
- Input-field validation: every failed rule shows a sensible message and returns focus to the offending field with it highlighted; mandatory fields align with the DB NOT NULL constraint and show an asterisk; character limit matches the DB column size.

**WCAG 2.2, Level AA** (W3C Web Content Accessibility Guidelines; cite as "WCAG 2.2 AA — SC <number> <name>"), grouped by the four POUR principles — pull from this list only, do not cite a Success Criterion not named here:
- Perceivable: SC 1.1.1 Non-text Content (alt text on icons/QR/images); SC 1.4.1 Use of Color (status never conveyed by color alone); SC 1.4.3 Contrast (Minimum, text ≥ 4.5:1); SC 1.4.10 Reflow (no horizontal scroll at 320px); SC 1.4.11 Non-text Contrast (icons/controls ≥ 3:1).
- Operable: SC 2.1.1 Keyboard (all functionality operable without a mouse); SC 2.1.2 No Keyboard Trap; SC 2.4.3 Focus Order; SC 2.4.4 Link Purpose (In Context); SC 2.4.7 Focus Visible.
- Understandable: SC 3.2.3 Consistent Navigation; SC 3.3.1 Error Identification (text, not color alone); SC 3.3.2 Labels or Instructions; SC 3.3.3 Error Suggestion; SC 3.3.4 Error Prevention (Legal, Financial, Data) — applies to the registration confirmation step.
- Robust: SC 4.1.2 Name, Role, Value (custom controls expose accessible name/role); SC 4.1.3 Status Messages (toasts/loading states announced without a forced focus change).

**ISTQB CTFL — Checklist-based testing** (cite as "ISTQB Checklist"), including the syllabus's own 12-item example checklist for any form: tab order correctness, Enter-to-submit where appropriate, required fields marked with * and validated, error message placed near the failing field, Reset/Cancel clears all input, double-submit does not create duplicate records, disabled state visibly distinct, loading state shown during submit, long text does not break layout, validation timing (real-time vs on-submit) is consistent, form usable on mobile (touch/keyboard), screen-reader compatibility.
</course_references>

<ems_context>
System under test: **EMS (Event Management System)** — a web app for a university's Faculty of Information Technology to create, publish, and run academic events, covering both the admin side and the participant side. Live at `https://prod-dev.ems-fitus.cloud/`; data may reset periodically, so do not assume a prior state persists.

This checklist is **not scoped to one function group**. It is a single shared artifact that different group members will later run against different scenarios (Task 1B), so it must read as generic across all four functional pools below — do not write an item that only makes sense on one pool's screen unless the underlying control class plausibly recurs elsewhere.

**The four functional pools** (each group member owns one for their individual execution; this prompt does not target any single one of them):
- **Pool A — Event administration**: dashboard KPIs; events list; add/edit event (thumbnail/banner upload, rich-text content, date/time validation); registration configuration (role toggles, max slots, waitlist); draft/publish/preview/delete; participants & reviews approval; check-in.
- **Pool B — Participant experience**: public event browsing with a featured-event carousel, category/search filter; event detail with a register button and waitlist notice; registration form (role selection, confirmation); My Registrations with a barcode/QR ticket; post-event star review.
- **Pool C — User administration**: users list (avatar, role, member code, active/audit columns); assign role; block/unblock and reset-password dialogs; export to Excel; audit log.
- **Pool D — Support requests**: user creates a request with an image attachment, tracks it in My Requests; admin side has a Pending/Resolved list, request detail with an image lightbox, internal note, and official response.

**Generic UI-control classes recurring across all four pools** — ground every item in one of these instead of a specific screen ID:
- Data lists with filters, search, and sortable columns.
- Multi-field forms with an image/file upload and rich-text or long-text input.
- Detail/preview pages with a status-dependent primary action button (e.g. register / publish / resolve).
- Confirmation dialogs guarding a destructive or uncorrectable action (delete, block, reset password).
- Status badges / colour-coded states (waitlist, pending/resolved, active/blocked).
- Toast/progress feedback for an asynchronous action (upload, export, check-in scan, submit).
- Tabs separating a list into named states (Draft/Published, Pending/Resolved).

Where an item would depend on exact visual detail no one has verified yet (precise colour values, spacing, exact copy text), write it generically (e.g. "the status badge uses a visually distinct colour from the default state" rather than guessing a hex code or exact wording). Do not invent specific UI copy, button labels, or layout details beyond what is given above.
</ems_context>

<output_format>
Output one Markdown table per interface aspect, in this exact column order, matching the existing checklist file so it can be pasted in directly:

| ID | Checklist item | Heuristic / Source | Origin (AI \| Human) | Notes |
| -- | -------------- | ------------------- | --------------------- | ----- |

- ID convention: `IA-01-01`, `IA-01-02`, … per aspect, zero-padded two digits, restarting at 01 for each aspect.
- Origin column: every row you generate is `AI` (a human will change some to `Human` later — do not pre-guess which).
- Notes column: leave blank unless the item needs a `[VERIFY]` flag because a member's actual screen may render the control class differently than described in `<ems_context>`.
- Target count per aspect: IA-01 ≥ 12, IA-02 ≥ 12, IA-03 ≥ 10, IA-04 ≥ 10 (44 total minimum — this gives headroom above the 40-item requirement once some items are merged or cut during human review).
- Within each aspect's total, include at least 3 items sourced from WCAG 2.2 AA (so across all four aspects there are ≥ 12 WCAG-sourced items) — spread across Perceivable/Operable/Understandable/Robust, not clustered on one principle.
- Every item must ground itself in one of the generic UI-control classes named in `<ems_context>` (e.g. "on a multi-field form with an image upload," "on a status-dependent primary action button," "on a data list with filters") — never in a project-specific screen ID or pool name (no "B1," "the Check-in tab," "Pool D"). This is what makes the checklist executable unmodified against whichever pool (A/B/C/D) each member picks in Task 1B.
</output_format>

<constraints>
- No item about cross-browser rendering, responsive breakpoints, OS/device compatibility, or browser-specific behavior — that is out of scope for this checklist (covered separately elsewhere).
- WCAG items must cite one of the Success Criteria listed in <course_references>, phrased against a generic UI-control class from <ems_context> exactly like every other item — no generic "site should be accessible" items.
- No item about i18n EN/VI switching, right-to-left layout, or dark mode — these stay out of scope for this checklist (added by hand later as `Human`/`PROMPT` gap items).
- No item that is really a functional/business-logic test (e.g., "registration actually saves to the database") rather than a GUI/interaction check — this checklist is interface-level, not functional-correctness-level.
- No item scoped to a single pool's screen name or ID (no "B1," "Pool A's dashboard," "the Check-in tab") — every item must be phrased against a generic control class so it applies unmodified to any of the four pools.
- Every item must be traceable to one named source in <course_references>, or explicitly marked "EMS-specific" if it comes purely from the pools/control classes in <ems_context>.
- Before outputting, review your own draft against these constraints and drop or rewrite any item that violates one of them, rather than leaving it in for me to catch.
</constraints>

<examples>
Format reference only — do not reuse these two items verbatim in your output, they are illustrations of the expected specificity level, not itself part of the 44+ items.

<example>
| ID | Checklist item | Heuristic / Source | Origin (AI \| Human) | Notes |
| -- | -------------- | ------------------- | --------------------- | ----- |
| IA-02-EX | On a multi-field form, a required field is visually marked (e.g. asterisk or label) and the form blocks submission with a visible error if left unfilled. | ISTQB Checklist (item 3) | AI | |
</example>

<example>
| ID | Checklist item | Heuristic / Source | Origin (AI \| Human) | Notes |
| -- | -------------- | ------------------- | --------------------- | ----- |
| IA-04-EX | On a detail page with a status-dependent primary action button, the button's visible state (enabled / disabled / alternate label) reflects the underlying data state without requiring a page reload. | S13 Bugs (control state alignment with data state) | AI | |
</example>

<example>
| ID | Checklist item | Heuristic / Source | Origin (AI \| Human) | Notes |
| -- | -------------- | ------------------- | --------------------- | ----- |
| IA-02-EX2 | On a multi-field form, the failed-validation message for a required field is shown as visible text next to the field, not conveyed by border color alone. | WCAG 2.2 AA — SC 1.4.1 Use of Color | AI | |
</example>
</examples>

<task>
Generate the full checklist now: four Markdown tables, one per IA aspect, following <output_format> exactly, respecting every rule in <constraints>, drawing sources only from <course_references>, and grounding every item in the pools and generic UI-control classes given in <ems_context>. Do not add any category, pool, screen ID, or source not defined above. Do not include any preamble or summary — output the four tables directly, in order IA-01, IA-02, IA-03, IA-04.
</task>
```

### AI output (verbatim)

54 items total: IA-01 = 14, IA-02 = 16, IA-03 = 13, IA-04 = 11. Reproduced exactly as returned, before any human edit (source: commit `f5c4e72`, `gui-checklist.md` at that revision).

**IA-01 — General UI standards**

| ID | Checklist item | Heuristic / Source | Origin (AI \| Human) | Notes |
| -- | -------------- | ------------------ | -------------------- | ----- |
| IA-01-01 | On a data list with filters and sortable columns, column headers, filter labels, and action-button labels use consistent terminology across screens (no synonyms for the same action, e.g. "Delete" vs. "Remove"). | Nielsen #4 — Consistency and standards | AI | |
| IA-01-02 | On any screen, primary and secondary buttons follow one consistent visual hierarchy (font weight, colour, size) across the application rather than a per-screen style. | Shneiderman #1 — Strive for consistency | AI | |
| IA-01-03 | On a multi-field form, field labels use one consistent alignment style (all left- or all top-aligned) within the form, with no ad-hoc mixing for sibling fields. | S13 Checklist (Layout and alignment) | AI | |
| IA-01-04 | On a data list with filters and sortable columns, a zero-match filter/search result renders a dedicated empty-state message instead of a blank table body. | EMS-specific | AI | |
| IA-01-05 | On a data list or detail page performing an asynchronous data fetch, a loading indicator (skeleton or spinner) is shown while the fetch is pending rather than a blank or frozen screen. | Nielsen #1 — Visibility of system status | AI | |
| IA-01-06 | On any screen, body text and field-label text maintain a minimum contrast ratio of 4.5:1 against their background. | WCAG 2.2 AA — SC 1.4.3 Contrast (Minimum) | AI | |
| IA-01-07 | On any screen, non-text UI elements (icon glyphs, input outlines, button borders) maintain a minimum contrast ratio of 3:1 against their adjacent background. | WCAG 2.2 AA — SC 1.4.11 Non-text Contrast | AI | |
| IA-01-08 | On any screen, an icon used without accompanying visible text (e.g. a status icon or action icon) exposes an accessible name (alt text or aria-label) conveying its meaning. | WCAG 2.2 AA — SC 1.1.1 Non-text Content | AI | |
| IA-01-09 | On any screen, the currently focused interactive element (button, link, input) shows a visible focus indicator distinct from its unfocused state. | WCAG 2.2 AA — SC 2.4.7 Focus Visible | AI | |
| IA-01-10 | On any screen, typography (font family, base font size, heading scale) is consistent across all screens, with no ad-hoc font substitution on a subset of screens. | S13 Checklist (Typography) | AI | |
| IA-01-11 | On a status badge / colour-coded state, the colour palette is consistent across the application — the same colour is never reused to mean two different states in different contexts. | S13 Checklist (Color scheme) | AI | |
| IA-01-12 | On any screen, interactive elements (links, buttons, clickable icons) are visually distinguishable from static text or decorative elements at a glance, without requiring a hover to reveal. | Norman — Signifiers | AI | |
| IA-01-13 | On a data list with filters and sortable columns, numeric and date columns use one consistent alignment (e.g. right-aligned) within the column, not mixed left/right per row. | S13 Checklist (Layout and alignment) | AI | |
| IA-01-14 | On any screen, icons and wording used for a real-world concept (e.g. a trash icon for delete, a calendar icon for a date field) match common web conventions rather than a novel or ambiguous metaphor. | Nielsen #2 — Match between system and the real world | AI | |

**IA-02 — Forms**

| ID | Checklist item | Heuristic / Source | Origin (AI \| Human) | Notes |
| -- | -------------- | ------------------ | -------------------- | ----- |
| IA-02-01 | On a multi-field form, every required field is marked with a visible indicator (e.g. a red asterisk) next to its label. | Per-Control — Text Box (red asterisk on mandatory fields) | AI | |
| IA-02-02 | On a multi-field form, submitting with a required field left empty blocks submission and shows a visible error message near that field. | ISTQB Checklist (item 3) | AI | |
| IA-02-03 | On a multi-field form, a failed-validation error returns keyboard focus to the offending field and visually highlights it. | Per-Control — Input-field validation | AI | |
| IA-02-04 | On a multi-field form with an image/file upload, attempting to upload a file that violates a stated size or type constraint shows an error message naming the specific constraint violated, not a generic failure message. | S13 Bugs (data validation gaps) | AI | |
| IA-02-05 | On a text input field, entering only whitespace characters is rejected as if the field were empty, not accepted as valid content. | Per-Control — Text Box (rejects spaces-only input) | AI | |
| IA-02-06 | On a text input field with a stated character limit, typing beyond the limit is visibly prevented or truncated at the boundary rather than silently accepted past it. | Per-Control — Input-field validation (character limit matches DB column size) | AI | |
| IA-02-07 | On a date input field, an invalid day/month combination (e.g. 30 February) is rejected with a visible error rather than silently accepted or auto-corrected. | Per-Control — Hyperlink/Image/Grid/List/Date (date field rejects invalid combinations) | AI | |
| IA-02-08 | On a multi-field form with a rich-text or long-text input, the field's state on first load contains no leftover placeholder or sample text that could be mistaken for real content. | S13 Bugs (incorrect field defaults) | AI | |
| IA-02-09 | On a multi-field form consisting of a single primary text field, pressing Enter while focus is inside that field submits the form. | ISTQB Checklist (Enter-to-submit where appropriate) | AI | |
| IA-02-10 | On a multi-field form, the submit control visibly disables or switches to a busy/loading state immediately after the first click, preventing a visible second submit attempt. | ISTQB Checklist (double-submit does not create duplicate records) | AI | |
| IA-02-11 | On a multi-field form, an available Reset or Cancel action visibly clears every entered field back to its default value. | ISTQB Checklist (Reset/Cancel clears all input) | AI | |
| IA-02-12 | On a multi-field form, each failed-validation field shows an explicit text error message associated with that field, not only a border-colour change. | WCAG 2.2 AA — SC 3.3.1 Error Identification | AI | |
| IA-02-13 | On a multi-field form, every field has a visible label or instruction text available before the user needs to enter a value into it. | WCAG 2.2 AA — SC 3.3.2 Labels or Instructions | AI | |
| IA-02-14 | On a multi-field form, where a validation rule is known (e.g. a required format or numeric range), the error message states how to correct the input, not only that it is invalid. | WCAG 2.2 AA — SC 3.3.3 Error Suggestion | AI | |
| IA-02-15 | On a multi-field form representing an uncorrectable data-entry step (e.g. a registration confirmation), the user can review the entered data before final submission. | WCAG 2.2 AA — SC 3.3.4 Error Prevention (Legal, Financial, Data) | AI | |
| IA-02-16 | On a multi-field form, a field's valid/invalid state is never signalled by colour alone — an icon or text label accompanies any colour change on the field. | WCAG 2.2 AA — SC 1.4.1 Use of Color | AI | |

**IA-03 — Navigation**

| ID | Checklist item | Heuristic / Source | Origin (AI \| Human) | Notes |
| -- | -------------- | ------------------ | -------------------- | ----- |
| IA-03-01 | On the main navigation menu, every top-level section reachable from it loads its corresponding screen without a dead link or error page. | S13 Navigation (main menu navigation) | AI | |
| IA-03-02 | On a screen reached through at least one level of navigation, the breadcrumb trail accurately reflects the current path, and each earlier segment is clickable to navigate back to it. | S13 Navigation (breadcrumb navigation) | AI | |
| IA-03-03 | On tabs separating a list into named states, exactly one tab is marked active/selected at a time, and its visual state is clearly distinct from the inactive tabs. | Norman — Signifiers | AI | |
| IA-03-04 | On a multi-field form, the keyboard tab order moves through fields in the same logical order as their visual layout (top-to-bottom, left-to-right). | S13 Navigation (form navigation, logical field order) | AI | |
| IA-03-05 | On a detail/preview page reached from a data list, a back/return action returns the user to that data list with the prior filter selection and scroll position preserved. | Nielsen #3 — User control and freedom | AI | |
| IA-03-06 | On a data list supporting a reorderable sequence (e.g. drag-and-drop), a dragged item shows a visible drop-target indicator during the drag, and the list visually reflects the new order immediately after drop. | EMS-specific | AI | [VERIFY] control class may not exist on every member's chosen screen |
| IA-03-07 | On any screen, every interactive element (button, link, form control) is reachable and operable using only the keyboard (Tab / Shift+Tab / Enter / Space), without requiring a mouse. | WCAG 2.2 AA — SC 2.1.1 Keyboard | AI | |
| IA-03-08 | On any modal or dialog, keyboard focus does not become trapped inside it — the user can exit via a standard key (e.g. Tab cycling out, or Esc). | WCAG 2.2 AA — SC 2.1.2 No Keyboard Trap | AI | |
| IA-03-09 | On any screen, the keyboard focus order when tabbing through interactive elements follows a logical sequence matching the visual reading order. | WCAG 2.2 AA — SC 2.4.3 Focus Order | AI | |
| IA-03-10 | On a data list or detail page, a link's visible text (or accessible name) describes its destination or purpose without relying solely on surrounding context (e.g. not just "click here"). | WCAG 2.2 AA — SC 2.4.4 Link Purpose (In Context) | AI | |
| IA-03-11 | Across different screens of the application, the main navigation menu appears in the same relative location and item order, so a returning user does not need to relearn its layout. | WCAG 2.2 AA — SC 3.2.3 Consistent Navigation | AI | |
| IA-03-12 | On a detail page reachable via a shareable/deep link, loading that link directly (not through in-app navigation) renders the same screen content as navigating to it through the UI. | EMS-specific | AI | |
| IA-03-13 | On a confirmation dialog guarding a destructive or uncorrectable action, an explicit Cancel or close control is available to back out without performing the action. | Shneiderman #6 — Permit easy reversal of actions | AI | |

**IA-04 — Feedback / state**

| ID | Checklist item | Heuristic / Source | Origin (AI \| Human) | Notes |
| -- | -------------- | ------------------ | -------------------- | ----- |
| IA-04-01 | On an asynchronous action (e.g. upload, export, submit), a toast or inline message confirms success or failure once the action completes. | Shneiderman #3 — Offer informative feedback | AI | |
| IA-04-02 | On an asynchronous action that takes longer than an instant (e.g. upload, export, check-in scan), a progress indicator is shown for the duration of the action, not only at its start and end. | Nielsen #1 — Visibility of system status | AI | |
| IA-04-03 | On a status badge / colour-coded state, the state is conveyed through both a colour and a text label or icon, not through colour alone. | WCAG 2.2 AA — SC 1.4.1 Use of Color | AI | |
| IA-04-04 | On a detail/preview page with a status-dependent primary action button, if the underlying state changes (e.g. via another action on the same page), the button's enabled state or label updates to match without requiring a manual page reload. | S13 Bugs (control state alignment with data state) | AI | |
| IA-04-05 | On a confirmation dialog guarding a destructive or uncorrectable action, the dialog states plainly which action will occur and requires an explicit confirm click before proceeding. | Shneiderman #4 — Design dialogs to yield closure | AI | |
| IA-04-06 | On a data-validation error, the message is phrased in plain language describing what went wrong, not a raw error code or stack trace. | Nielsen #9 — Help users recognize, diagnose, and recover from errors | AI | |
| IA-04-07 | On any screen where an action shifts focus automatically (e.g. after a validation failure or opening a dialog), focus lands on the element the user needs to act on next. | S13 Bugs (focus not placed on the object that needs it) | AI | |
| IA-04-08 | On a custom-built interactive control that is not a native HTML element (e.g. a custom dropdown, toggle, or status badge), the control exposes an accessible name and role to assistive technology. | WCAG 2.2 AA — SC 4.1.2 Name, Role, Value | AI | |
| IA-04-09 | On a toast or loading-state message triggered by an asynchronous action, the message is announced to assistive technology without forcing a keyboard focus change away from the user's current task. | WCAG 2.2 AA — SC 4.1.3 Status Messages | AI | |
| IA-04-10 | On a real-time updating element (e.g. a live badge or count reflecting a state change made elsewhere), the update is visually reflected on screen without the user manually refreshing the page. | Norman — Feedback | AI | |
| IA-04-11 | On a status badge / colour-coded state used across different states (e.g. waitlist vs. pending vs. active), each distinct state uses its own visually distinct colour, with no colour reused across two different meanings. | S13 Checklist (Color scheme) | AI | |

### Human review verdict

Reviewed by Lê Hoàng Lâm on 2026-07-29 (commit `6e815ae`), against the four functional pools and a live survey of the SUT. Full item-by-item reasoning lives in [ai-gap-notes.md](ai-gap-notes.md); summary:

- **Kept:** 50 of 54 AI items, 2 with a rewritten source citation (IA-02-06 dropped a DB-schema clause; the binary Passed/Failed verdict rule was widened to Passed/Failed/N/A).
- **Removed:** 4 items — 1 subjective/preference item that belongs in Task 2 user testing, 1 flow-design item that isn't a GUI defect, 2 duplicates of another surviving item ([ai-gap-notes.md](ai-gap-notes.md) Part 2).
- **Added:** 11 `Human` items — 4 i18n EN/VI items excluded by this prompt on purpose (deferred by design, see prompt's `<constraints>`), 6 items where the model under-used a fully-supplied source (Dropdown/Combo, Checkbox/Radio, disabled-state, long-text, validation-timing, image-upload clauses), 1 EMS-specific date/timezone-rendering item no external source covers ([ai-gap-notes.md](ai-gap-notes.md) Part 1).
- **Result:** 61 items shipped in [gui-checklist.md](gui-checklist.md) (14/21/13/13 → see its Coverage summary table), 50 AI-origin / 11 Human-origin.

No second AI prompt was run. All refinement after Round 1 was manual human review against `ai-gap-notes.md`'s four root-cause categories (`PROMPT` / `MODEL` / `EMS` / `SCOPE`) — there is no Round 2 to log.
