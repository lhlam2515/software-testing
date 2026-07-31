# Task 1B Checklist Execution Template

This template reuses the shared checklist in [../gui-checklist.md](../gui-checklist.md) and is designed for at least three EMS screens.

## Execution Setup

- Scenario: TODO
- Selected screens: Screen 1 (TODO), Screen 2 (TODO), Screen 3 (TODO)
- Tester: TODO
- Date: TODO
- Evidence policy: do not fabricate pass/fail results; use real screenshots only when testing is completed.

## Execution Table

Use one copy of this table per screen, replacing the Screen value with the actual screen name and completing Pass/Fail, Notes, and Screenshot Reference after real execution.

| Checklist ID | Category | Checklist Item | Screen | Pass/Fail | Notes | Screenshot Reference |
| --- | --- | --- | --- | --- | --- | --- |
| IA-01-01 | IA-01 | On a data list with filters and sortable columns, column headers, filter labels, and action-button labels use consistent terminology across screens (no synonyms for the same action, e.g. "Delete" vs. "Remove"). | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-02 | IA-01 | On any screen, primary and secondary buttons follow one consistent visual hierarchy (font weight, colour, size) across the application rather than a per-screen style. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-03 | IA-01 | On a multi-field form, field labels use one consistent alignment style (all left- or all top-aligned) within the form, with no ad-hoc mixing for sibling fields. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-04 | IA-01 | On a data list with filters and sortable columns, a zero-match filter/search result renders a dedicated empty-state message instead of a blank table body. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-05 | IA-01 | On a data list or detail page performing an asynchronous data fetch, a loading indicator (skeleton or spinner) is shown while the fetch is pending rather than a blank or frozen screen. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-06 | IA-01 | On any screen, body text and field-label text maintain a minimum contrast ratio of 4.5:1 against their background. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-07 | IA-01 | On any screen, non-text UI elements (icon glyphs, input outlines, button borders) maintain a minimum contrast ratio of 3:1 against their adjacent background. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-08 | IA-01 | On any screen, an icon used without accompanying visible text (e.g. a status icon or action icon) exposes an accessible name (alt text or aria-label) conveying its meaning. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-09 | IA-01 | On any screen, the currently focused interactive element (button, link, input) shows a visible focus indicator distinct from its unfocused state. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-10 | IA-01 | On any screen, typography (font family, base font size, heading scale) is consistent across all screens, with no ad-hoc font substitution on a subset of screens. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-11 | IA-01 | On a status badge / colour-coded state, the colour palette is consistent across the application — the same colour is never reused to mean two different states in different contexts. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-12 | IA-01 | On any screen, interactive elements (links, buttons, clickable icons) are visually distinguishable from static text or decorative elements at a glance, without requiring a hover to reveal. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-13 | IA-01 | On a data list with filters and sortable columns, numeric and date columns use one consistent alignment (e.g. right-aligned) within the column, not mixed left/right per row. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-14 | IA-01 | After switching the interface language, every chrome string on the screen (nav items, icon-only button names, tooltips, validation messages) is rendered in the selected language, with no string left in the other language. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-15 | IA-01 | Switching the interface language keeps the user on the current screen and preserves the current view state (active filter, tab, scroll position) instead of resetting to a default screen. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-16 | IA-01 | Dates, times and numbers are formatted per the selected locale, and any displayed event time carries an explicit time-zone label. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-01-17 | IA-01 | Vietnamese strings render with all diacritics intact, with no font fallback artifacts and no truncation caused by the string being longer than its English counterpart. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-01 | IA-02 | On a multi-field form, every required field is marked with a visible indicator (e.g. a red asterisk) next to its label. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-02 | IA-02 | On a multi-field form, submitting with a required field left empty blocks submission and shows a visible error message near that field. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-03 | IA-02 | On a multi-field form, a failed-validation error returns keyboard focus to the offending field and visually highlights it. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-04 | IA-02 | On a multi-field form with an image/file upload, attempting to upload a file that violates a stated size or type constraint shows an error message naming the specific constraint violated, not a generic failure message. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-05 | IA-02 | On a text input field, entering only whitespace characters is rejected as if the field were empty, not accepted as valid content. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-06 | IA-02 | On a text input field with a stated character limit, typing beyond the limit is visibly prevented or truncated at the boundary rather than silently accepted past it. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-07 | IA-02 | On a date input field, an invalid day/month combination (e.g. 30 February) is rejected with a visible error rather than silently accepted or auto-corrected. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-08 | IA-02 | On a multi-field form with a rich-text or long-text input, the field's state on first load contains no leftover placeholder or sample text that could be mistaken for real content. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-09 | IA-02 | On a multi-field form consisting of a single primary text field, pressing Enter while focus is inside that field submits the form. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-10 | IA-02 | On a multi-field form, the submit control visibly disables or switches to a busy/loading state immediately after the first click, preventing a visible second submit attempt. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-11 | IA-02 | On a multi-field form, an available Reset or Cancel action visibly clears every entered field back to its default value. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-12 | IA-02 | On a multi-field form, each failed-validation field shows an explicit text error message associated with that field, not only a border-colour change. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-13 | IA-02 | On a multi-field form, every field has a visible label or instruction text available before the user needs to enter a value into it. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-14 | IA-02 | On a multi-field form, where a validation rule is known (e.g. a required format or numeric range), the error message states how to correct the input, not only that it is invalid. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-15 | IA-02 | On a dropdown or select control, the control has a visible label, its option list is non-empty, its ordering is consistent, and any default or blank option sits at a fixed position in the list. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-16 | IA-02 | On a checkbox or radio group, the default selection is correct, clicking the label toggles the control, Space toggles it while focused, and a radio group allows exactly one selection. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-17 | IA-02 | A control in a disabled state is visually distinct (greyed), does not take a text cursor, does not receive keyboard focus, and the reason it is disabled is discoverable on the screen. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-18 | IA-02 | An unusually long value in a field or a label does not break the layout of its containing block (no overlap, no clipping, no forced horizontal scroll). | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-19 | IA-02 | Within one form, the validation trigger is consistent across fields — either all fields validate on blur, or all validate on submit, not a mix. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-20 | IA-02 | Content authored in the rich-text editor renders on the read view exactly as composed (headings, lists, links preserved), with no raw HTML tags exposed. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-02-21 | IA-02 | An uploaded thumbnail or banner renders at its specified aspect ratio without distortion, with no broken-image placeholder, and a fallback image is shown when the source is missing. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-01 | IA-03 | On the main navigation menu, every top-level section reachable from it loads its corresponding screen without a dead link or error page. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-02 | IA-03 | On a screen reached through at least one level of navigation, the breadcrumb trail accurately reflects the current path, and each earlier segment is clickable to navigate back to it. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-03 | IA-03 | On tabs separating a list into named states, exactly one tab is marked active/selected at a time, and its visual state is clearly distinct from the inactive tabs. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-04 | IA-03 | On a multi-field form, the keyboard tab order moves through fields in the same logical order as their visual layout (top-to-bottom, left-to-right). | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-05 | IA-03 | On a detail/preview page reached from a data list, a back/return action returns the user to that data list with the prior filter selection and scroll position preserved. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-06 | IA-03 | On a data list supporting a reorderable sequence (e.g. drag-and-drop), a dragged item shows a visible drop-target indicator during the drag, and the list visually reflects the new order immediately after drop. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-07 | IA-03 | On any screen, every interactive element (button, link, form control) is reachable and operable using only the keyboard (Tab / Shift+Tab / Enter / Space), without requiring a mouse. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-08 | IA-03 | On any modal or dialog, keyboard focus does not become trapped inside it — the user can exit via a standard key (e.g. Tab cycling out, or Esc). | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-09 | IA-03 | On any screen, the keyboard focus order when tabbing through interactive elements follows a logical sequence matching the visual reading order. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-10 | IA-03 | On a data list or detail page, a link's visible text (or accessible name) describes its destination or purpose without relying solely on surrounding context (e.g. not just "click here"). | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-11 | IA-03 | Across different screens of the application, the main navigation menu appears in the same relative location and item order, so a returning user does not need to relearn its layout. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-12 | IA-03 | On a detail page reachable via a shareable/deep link, loading that link directly (not through in-app navigation) renders the same screen content as navigating to it through the UI. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-03-13 | IA-03 | On a confirmation dialog guarding a destructive or uncorrectable action, an explicit Cancel or close control is available to back out without performing the action. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-04-01 | IA-04 | On an asynchronous action (e.g. upload, export, submit), a toast or inline message confirms success or failure once the action completes. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-04-02 | IA-04 | On an asynchronous action that takes longer than an instant (e.g. upload, export, check-in scan), a progress indicator is shown for the duration of the action, not only at its start and end. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-04-03 | IA-04 | On a status badge / colour-coded state, the state is conveyed through both a colour and a text label or icon, not through colour alone. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-04-04 | IA-04 | On a detail/preview page with a status-dependent primary action button, if the underlying state changes (e.g. via another action on the same page), the button's enabled state or label updates to match without requiring a manual page reload. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-04-05 | IA-04 | On a confirmation dialog guarding a destructive or uncorrectable action, the dialog states plainly which action will occur and requires an explicit confirm click before proceeding. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-04-06 | IA-04 | On a data-validation error, the message is phrased in plain language describing what went wrong, not a raw error code or stack trace. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-04-07 | IA-04 | On any screen where an action shifts focus automatically (e.g. after a validation failure or opening a dialog), focus lands on the element the user needs to act on next. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-04-08 | IA-04 | On a custom-built interactive control that is not a native HTML element (e.g. a custom dropdown, toggle, or status badge), the control exposes an accessible name and role to assistive technology. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-04-09 | IA-04 | On a toast or loading-state message triggered by an asynchronous action, the message is announced to assistive technology without forcing a keyboard focus change away from the user's current task. | Screen 1 / 2 / 3 | TODO | TODO | TODO |
| IA-04-10 | IA-04 | On a real-time updating element (e.g. a live badge or count reflecting a state change made elsewhere), the update is visually reflected on screen without the user manually refreshing the page. | Screen 1 / 2 / 3 | TODO | TODO | TODO |

## Summary Notes

- Duplicate this table for each chosen screen to meet the requirement of testing at least three screens.
- Record the screenshot file name or path in the last column only for actual failed cases or for evidence that needs to be attached.
