# Shared GUI Checklist — Group 02 (HW03, Task 1A)

**Owner (author of this checklist):** Lê Hoàng Lâm (23127216)
**Used by:** all members of Group 02, on their own scenario screens (Task 1B)
**SUT:** EMS — <https://prod-dev.ems-fitus.cloud/>

---

## Rules

- **Target: > 40 items**, covering all four interface aspects (IA-01 … IA-04).
- Every item must be **verifiable on a screen**, with one of three verdicts:
  - **Passed** — the item applies to this screen and the screen satisfies it.
  - **Failed** — the item applies and the screen violates it.
  - **N/A** — the control class the item is written for does not exist on this screen (no data list, no file upload, no tab control, …). `N/A` is not a soft pass: it means the item was never exercised, and it is excluded from the pass-rate denominator.
- **Notes are mandatory for every `Failed` and every `N/A` row.** For `Failed`, state the concrete defect. For `N/A`, name the missing control class. A restatement of the item is not a Note.
- Screenshots are attached for **`Failed` rows only**.
- Every item must cite its **source**: a Nielsen heuristic, a Norman principle, a Shneiderman golden rule, a course slide, a standard (e.g. WCAG), or an EMS-specific observation.
- **Origin** column marks whether the item came from the AI draft (`AI`) or was added by a human after review (`Human`). Every `Human` item needs a matching explanation in [ai-gap-notes.md](ai-gap-notes.md).

**Item ID convention:** `IA-01-01`, `IA-01-02`, … per aspect.

---

## Coverage summary

| Interface aspect | Items | AI-generated | Human-added |
| ---------------- | ----- | ------------ | ----------- |
| IA-01 — General UI standards | 17 | 13 | 4 |
| IA-02 — Forms | 21 | 14 | 7 |
| IA-03 — Navigation | 13 | 13 | 0 |
| IA-04 — Feedback / state | 10 | 10 | 0 |
| **Total** (target > 40) | 61 | 50 | 11 |

---

## IA-01 — General UI standards

*Layout, alignment, typography, colour, consistency, EN/VI i18n, empty & loading states.*

| ID | Checklist item | Heuristic / Source | Origin (AI / Human) | Notes |
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
| IA-01-14 | After switching the interface language, every chrome string on the screen (nav items, icon-only button names, tooltips, validation messages) is rendered in the selected language, with no string left in the other language. | S13 Challenges (Localization and Internationalization) | Human | |
| IA-01-15 | Switching the interface language keeps the user on the current screen and preserves the current view state (active filter, tab, scroll position) instead of resetting to a default screen. | Nielsen #3 — User control and freedom | Human | |
| IA-01-16 | Dates, times and numbers are formatted per the selected locale, and any displayed event time carries an explicit time-zone label. | S13 Challenges (Localization); Nielsen #2 | Human | |
| IA-01-17 | Vietnamese strings render with all diacritics intact, with no font fallback artifacts and no truncation caused by the string being longer than its English counterpart. | S13 GUI Testing Necessary (text overflow, missing components) | Human | |

---

## IA-02 — Forms

*Labels, validation, error placement, required-field handling, upload, rich-text editor.*

| ID | Checklist item | Heuristic / Source | Origin (AI / Human) | Notes |
| -- | -------------- | ------------------ | -------------------- | ----- |
| IA-02-01 | On a multi-field form, every required field is marked with a visible indicator (e.g. a red asterisk) next to its label. | Per-Control — Text Box (red asterisk on mandatory fields) | AI | |
| IA-02-02 | On a multi-field form, submitting with a required field left empty blocks submission and shows a visible error message near that field. | ISTQB Checklist (item 3) | AI | |
| IA-02-03 | On a multi-field form, a failed-validation error returns keyboard focus to the offending field and visually highlights it. | Per-Control — Input-field validation | AI | |
| IA-02-04 | On a multi-field form with an image/file upload, attempting to upload a file that violates a stated size or type constraint shows an error message naming the specific constraint violated, not a generic failure message. | S13 Bugs (data validation gaps) | AI | |
| IA-02-05 | On a text input field, entering only whitespace characters is rejected as if the field were empty, not accepted as valid content. | Per-Control — Text Box (rejects spaces-only input) | AI | |
| IA-02-06 | On a text input field with a stated character limit, typing beyond the limit is visibly prevented or truncated at the boundary rather than silently accepted past it. | Per-Control — Input-field validation (character limit) | AI | |
| IA-02-07 | On a date input field, an invalid day/month combination (e.g. 30 February) is rejected with a visible error rather than silently accepted or auto-corrected. | Per-Control — Hyperlink/Image/Grid/List/Date (date field rejects invalid combinations) | AI | |
| IA-02-08 | On a multi-field form with a rich-text or long-text input, the field's state on first load contains no leftover placeholder or sample text that could be mistaken for real content. | S13 Bugs (incorrect field defaults) | AI | |
| IA-02-09 | On a multi-field form consisting of a single primary text field, pressing Enter while focus is inside that field submits the form. | ISTQB Checklist (Enter-to-submit where appropriate) | AI | |
| IA-02-10 | On a multi-field form, the submit control visibly disables or switches to a busy/loading state immediately after the first click, preventing a visible second submit attempt. | ISTQB Checklist (double-submit does not create duplicate records) | AI | |
| IA-02-11 | On a multi-field form, an available Reset or Cancel action visibly clears every entered field back to its default value. | ISTQB Checklist (Reset/Cancel clears all input) | AI | |
| IA-02-12 | On a multi-field form, each failed-validation field shows an explicit text error message associated with that field, not only a border-colour change. | WCAG 2.2 AA — SC 3.3.1 Error Identification | AI | |
| IA-02-13 | On a multi-field form, every field has a visible label or instruction text available before the user needs to enter a value into it. | WCAG 2.2 AA — SC 3.3.2 Labels or Instructions | AI | |
| IA-02-14 | On a multi-field form, where a validation rule is known (e.g. a required format or numeric range), the error message states how to correct the input, not only that it is invalid. | WCAG 2.2 AA — SC 3.3.3 Error Suggestion | AI | |
| IA-02-15 | On a dropdown or select control, the control has a visible label, its option list is non-empty, its ordering is consistent, and any default or blank option sits at a fixed position in the list. | Per-Control — Dropdown / Combo Box | Human | |
| IA-02-16 | On a checkbox or radio group, the default selection is correct, clicking the label toggles the control, Space toggles it while focused, and a radio group allows exactly one selection. | Per-Control — Checkbox & Radio button | Human | |
| IA-02-17 | A control in a disabled state is visually distinct (greyed), does not take a text cursor, does not receive keyboard focus, and the reason it is disabled is discoverable on the screen. | ISTQB Checklist (item 7 — disabled state shown clearly); Per-Control — Text Box | Human | |
| IA-02-18 | An unusually long value in a field or a label does not break the layout of its containing block (no overlap, no clipping, no forced horizontal scroll). | ISTQB Checklist (item 9 — long field text does not break layout) | Human | |
| IA-02-19 | Within one form, the validation trigger is consistent across fields — either all fields validate on blur, or all validate on submit, not a mix. | ISTQB Checklist (item 10 — real-time vs on-submit validation consistency) | Human | |
| IA-02-20 | Content authored in the rich-text editor renders on the read view exactly as composed (headings, lists, links preserved), with no raw HTML tags exposed. | S13 Bugs (data validation); assignment IA-02 (rich-text editor) | Human | |
| IA-02-21 | An uploaded thumbnail or banner renders at its specified aspect ratio without distortion, with no broken-image placeholder, and a fallback image is shown when the source is missing. | Per-Control — Hyperlink/Image/Grid/List/Date (Image) | Human | |

---

## IA-03 — Navigation

*Menu, breadcrumb, tabs, sidebar, drag-and-drop reorder, back/return, deep links.*

| ID | Checklist item | Heuristic / Source | Origin (AI / Human) | Notes |
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

---

## IA-04 — Feedback / state

*Toasts, badges, confirmation dialogs, progress bars, status colours, real-time updates.*

| ID | Checklist item | Heuristic / Source | Origin (AI / Human) | Notes |
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

---

> **Status:** the AI prompt that produced the draft is recorded in [gui-checklist.prompt.md](gui-checklist.prompt.md); every item maps to a source row in [references.md](references.md); every `Human` item has a root-cause row in [ai-gap-notes.md](ai-gap-notes.md).
