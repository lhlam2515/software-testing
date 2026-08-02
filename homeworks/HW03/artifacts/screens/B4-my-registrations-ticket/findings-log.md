# Findings Log (draft) — B4: My Registrations / Ticket

Per-screen draft findings from the Task 1B checklist run. Promote to the root
`FINDINGS_LOG.md` (Finding ID assigned, Google Form submitted) at Phase 4.

| Checklist ID | Defect | Screenshot | Severity guess | Promoted? |
| ------------ | ------ | ---------- | --------------- | --------- |
| IA-01-07 | Search input border (~rgb(209,213,220) on white) measures ~1.47:1, fails WCAG 3:1 non-text contrast minimum — same border class as BUG-B1-002 | screenshots/IA-01-07-search-border-contrast.png | Minor | Yes |
| IA-01-08 | Pagination prev/next buttons have `aria-hidden="true"` SVGs and no `aria-label` — no accessible name (DOM/accessibility-tree evidence in FINDINGS_LOG.md) | screenshots/IA-01-08-pagination-icon-no-name.png | Major | Yes |
| IA-01-11 | "Approved" and "Cancelled" registration-status badges both use `bg-gray-100 text-gray-700` — same color represents two opposite states on the same screen | screenshots/IA-01-11-approved-cancelled-same-gray-badge.png | Major | Yes |
| IA-01-12 | Activity cards have no at-rest visual signifier of interactivity — identical panel style to non-clickable stat cards, only `cursor-pointer`/hover tint marks them clickable | screenshots/IA-01-12-cards-no-rest-signifier.png | Minor | Yes |
| IA-01-14 | "Roles:" chip value ("Guest"/"Participant") stays untranslated after switching to Vietnamese, while the sibling participation-type badge above it does translate | screenshots/IA-01-14-roles-chip-not-translated.png | Minor | Yes |
| IA-01-16 | Activity date/time ranges carry no explicit time-zone label anywhere on the card | screenshots/IA-01-16-no-timezone.png | Minor | Yes |
| IA-02-01 | None of the 3 "Change Password" fields (Current/New/Confirm) show a required-field indicator (red asterisk), though all 3 are mandatory | screenshots/IA-02-01-no-required-asterisk.png | Minor | Yes |
| IA-02-04 | Uploading a non-image `.txt` file as avatar is accepted with no error message — the app queues it as a pending change with a broken preview instead of naming the violated type constraint | screenshots/IA-02-04-avatar-upload-no-type-validation.png | Major | Yes |
| IA-02-05 | Filling "Search activities..." with only spaces is accepted as valid content and renders "No activities found" instead of being treated as empty | screenshots/IA-02-05-whitespace-search-not-rejected.png | Minor | Yes |
| IA-02-12 | On an empty "Change Password" submit, the Confirm Password field's validation message reads "New password is required" — the wrong field name, not "Confirm password is required" | screenshots/IA-02-12-confirm-password-wrong-error-text.png | Major | Yes |
| IA-02-18 | Long activity title is CSS `truncate`-clipped to a single line with no `title` attribute fallback, hiding part of the text with no way to recover it without leaving the screen | screenshots/IA-02-18-long-title-truncated-no-tooltip.png | Minor | Yes |
| IA-03-05 | Browser Back from an activity's event-detail page loses both the active search query ("AI" reset to empty) and the list scroll position (reset to top) | screenshots/IA-03-05-back-nav-loses-search-scroll.png | Major | Yes |
| IA-03-07 | Avatar-upload control (camera icon `<label>` wrapping a `display:none` file input, no `tabindex` on either) is unreachable via keyboard Tab — mouse/pointer only (DOM evidence in FINDINGS_LOG.md) | screenshots/IA-03-07-avatar-upload-not-keyboard-reachable.png | Major | Yes |
| IA-04-01 | "Edit Profile" save completes with no toast/inline confirmation message — page-wide scan found 0 `aria-live`/`role=status`/`role=alert` elements | screenshots/IA-04-01-edit-profile-save-no-toast.png | Minor | Yes |
| IA-04-08 | "Filters" disclosure button never exposes `aria-expanded`/`aria-pressed`/`aria-controls` in either collapsed or expanded state (DOM evidence in FINDINGS_LOG.md) | screenshots/IA-04-08-filters-button-no-aria-expanded.png | Minor | Yes |
| IA-04-09 | "Edit Profile" save confirmation has no `aria-live`/`role="status"` region — screen-reader users get no announcement of success (DOM evidence in FINDINGS_LOG.md) | screenshots/IA-04-01-edit-profile-save-no-toast.png | Minor | Yes |
