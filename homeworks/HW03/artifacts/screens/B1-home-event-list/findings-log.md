# Findings Log (draft) — B1: Home / Event Listing

Per-screen draft findings from the Task 1B checklist run. Promote to the root
`FINDINGS_LOG.md` (Finding ID assigned, Google Form submitted) at Phase 4.

| Checklist ID | Defect | Screenshot | Severity guess | Promoted? |
| ------------ | ------ | ---------- | --------------- | --------- |
| IA-01-06 | "View details" link text on the spotlight banner (~rgb(162,244,253) on ~rgb(128,87,227) gradient) measures ~3.85:1, fails WCAG 4.5:1 minimum for body/link text | screenshots/IA-01-06-view-details-contrast.png | Minor | Yes |
| IA-01-07 | Search input border (`border-gray-300`, rgb(209,213,219) on white) measures ~1.47:1, fails WCAG 3:1 non-text contrast minimum; same border class reused across most bordered controls on the screen | screenshots/IA-01-07-search-border-contrast.png | Minor | Yes |
| IA-01-08 | Pagination prev/next buttons are icon-only with `aria-hidden="true"` SVGs and no `aria-label` — no accessible name exposed to assistive tech (DOM/accessibility-tree evidence in FINDINGS_LOG.md — screenshot alone cannot show a missing attribute) | screenshots/IA-01-08-pagination-icon-no-name.png | Major | Yes |
| IA-01-16 | Event date/time strings (e.g. "20/08/2026 14:18 - 21/08/2026 14:18") carry no explicit time-zone label anywhere on the card or spotlight banner | screenshots/IA-01-16-no-timezone.png | Minor | Yes |
| IA-02-05 | Search box accepts a whitespace-only query ("   ") as valid content instead of treating it as empty — triggers a real search and silently returns "No events found" | screenshots/IA-02-05-whitespace-search-not-rejected.png | Minor | Yes |
| IA-03-05 | Browser Back from an event detail page loses both the active status filter ("Ongoing" reset to default "Upcoming") and the list scroll position (reset to top) | screenshots/IA-03-05-back-nav-loses-filter-scroll.png | Major | Yes |
| IA-04-08 | Status-filter toggle buttons (Upcoming/Ongoing/Ended) expose selected state via CSS only — no `aria-pressed`/`aria-selected`/`role="tab"` for assistive tech (DOM/accessibility-tree evidence in FINDINGS_LOG.md) | screenshots/IA-04-08-filter-chip-no-aria-state.png | Minor | Yes |
| IA-04-09 | "Save event" -> "Saved" confirmation has no `aria-live`/`role="status"` wrapper — screen reader users are not informed the save succeeded (DOM/accessibility-tree evidence in FINDINGS_LOG.md) | screenshots/IA-04-09-save-no-aria-live.png | Minor | Yes |
