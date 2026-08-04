# Bug & Usability Findings Log — HW03

**Student**: Lê Hoàng Lâm · 23127216 · Group 02 · 23KTPM1
**SUT**: EMS — <https://prod-dev.ems-fitus.cloud/>
**Scenario**: B — User registers for an event

---

## Reporting rule (§7)

Every finding from Task 1 – Task 3 must be reported **twice**:

1. Submitted individually to the course Google Form: <https://forms.gle/CJQFQCAXcsDbXDMM9> (use the MSSV email so submissions are attributable).
2. Consolidated in this file. The row count here and the number of form submissions **must match** — the TA may cross-check.

**ID convention**: `BUG-B<screen>-NNN` for functional/GUI defects, `USA-B<screen>-NNN` for usability findings.
Example: `BUG-B3-001` = first defect found on screen B3 (registration form).

**Severity**: Bugs — Critical / Major / Minor / Cosmetic. Usability findings — Nielsen severity 0–4 (0 = not a problem, 4 = catastrophe).

---

## Summary

| Metric | Count |
| ------ | ----- |
| Total findings | 30 |
| — Type: Bug | 24 |
| — Type: Usability | 6 |
| From Task 1B (checklist run) | 30 |
| From Task 2 (user testing) | 0 |
| From Task 3 (cross-platform) | 0 |
| Submitted to Google Form | 30 |
| **Log rows == form submissions?** | Yes — 30 rows logged, 30 submitted to the Google Form |

---

## Findings

| ID | Scenario / Screen | Type (Bug \| Usability) | Description | Repro steps / Heuristic | Severity | Suggested fix | Screenshot ref | Form submitted at |
| -- | ----------------- | ----------------------- | ----------- | ----------------------- | -------- | ------------- | -------------- | ----------------- |
| BUG-B1-001 | B — B1 Home/Event Listing | Bug | Spotlight banner "View details" link text fails WCAG contrast minimum | IA-01-06; WCAG 2.2 AA SC 1.4.3 | Minor | Darken the link text or the gradient stop under it until measured contrast is >= 4.5:1 | artifacts/screens/B1-home-event-list/screenshots/IA-01-06-view-details-contrast.png | 2026-08-04 20:31 |
| BUG-B1-002 | B — B1 Home/Event Listing | Bug | Search input border fails WCAG non-text contrast minimum | IA-01-07; WCAG 2.2 AA SC 1.4.11 | Minor | Swap `border-gray-300` for a darker gray (>= 3:1 against white) on all bordered controls reusing this class | artifacts/screens/B1-home-event-list/screenshots/IA-01-07-search-border-contrast.png | 2026-08-04 20:53 |
| BUG-B1-003 | B — B1 Home/Event Listing | Bug | Pagination prev/next buttons have no accessible name | IA-01-08; WCAG 2.2 AA SC 1.1.1 / 4.1.2 | Major | Add `aria-label="Previous page"` / `aria-label="Next page"` to the two chevron buttons | artifacts/screens/B1-home-event-list/screenshots/IA-01-08-pagination-icon-no-name.png | 2026-08-04 20:53 |
| USA-B1-001 | B — B1 Home/Event Listing | Usability | Event date/time strings show no explicit time-zone label | IA-01-16; Nielsen #2 — Match between system and the real world | Nielsen severity 2 | Append a fixed timezone label (e.g. "GMT+7") next to every displayed event time | artifacts/screens/B1-home-event-list/screenshots/IA-01-16-no-timezone.png | 2026-08-04 20:55 |
| BUG-B1-004 | B — B1 Home/Event Listing | Bug | Whitespace-only search query is treated as valid input, not empty | IA-02-05; Per-Control — Text Box (rejects spaces-only input) | Minor | Trim the query client-side before dispatching the search, or ignore whitespace-only input as if the field were empty | artifacts/screens/B1-home-event-list/screenshots/IA-02-05-whitespace-search-not-rejected.png | 2026-08-04 |
| BUG-B1-005 | B — B1 Home/Event Listing | Bug | Browser Back from event detail loses the active status filter and list scroll position | IA-03-05; Nielsen #3 — User control and freedom | Major | Persist filter + scroll state (e.g. in the router/query string or a client cache) and restore it on back-navigation | artifacts/screens/B1-home-event-list/screenshots/IA-03-05-back-nav-loses-filter-scroll.png | 2026-08-04 21:02 |
| BUG-B1-006 | B — B1 Home/Event Listing | Bug | Status-filter toggle buttons (Upcoming/Ongoing/Ended) don't expose selected state to assistive tech | IA-04-08; WCAG 2.2 AA SC 4.1.2 | Minor | Add `aria-pressed` (or `role="tab"` + `aria-selected` if treated as a tablist) to the three toggle buttons | artifacts/screens/B1-home-event-list/screenshots/IA-04-08-filter-chip-no-aria-state.png | 2026-08-04 21:02 |
| BUG-B1-007 | B — B1 Home/Event Listing | Bug | "Save event" success confirmation is not announced to assistive tech | IA-04-09; WCAG 2.2 AA SC 4.1.3 | Minor | Wrap the save/saved state change in an `aria-live="polite"` region (or add a toast with `role="status"`) | artifacts/screens/B1-home-event-list/screenshots/IA-04-09-save-no-aria-live.png | 2026-08-04 21:05 |
| BUG-B2-001 | B — B2 Event Detail | Bug | Category/campus tag chip text fails WCAG contrast minimum | IA-01-06; WCAG 2.2 AA SC 1.4.3 | Minor | Darken the chip text colors (orange/teal) until measured contrast is >= 4.5:1 against white | artifacts/screens/B2-event-detail/screenshots/IA-01-06-category-chip-contrast.png | 2026-08-04 21:06 |
| BUG-B2-002 | B — B2 Event Detail | Bug | Info-card borders (Event date/Registration period/Check-in period) fail WCAG non-text contrast minimum | IA-01-07; WCAG 2.2 AA SC 1.4.11 | Minor | Swap `border-cyan-200` for a darker cyan (>= 3:1 against the card background) on all three info cards | artifacts/screens/B2-event-detail/screenshots/IA-01-07-card-border-contrast.png | 2026-08-04 21:07 |
| BUG-B2-003 | B — B2 Event Detail | Bug | Guest role label stays untranslated after switching UI language to Vietnamese | IA-01-14; S13 Challenges (Localization) | Minor | Localize the fixed role-name strings (Guest/Student/Lecturer) the same way other chrome strings are localized | artifacts/screens/B2-event-detail/screenshots/IA-01-14-guest-role-not-translated.png | 2026-08-04 21:08 |
| USA-B2-001 | B — B2 Event Detail | Usability | Event date/registration/check-in times show no explicit time-zone label | IA-01-16; Nielsen #2 — Match between system and the real world | Nielsen severity 2 | Append a fixed timezone label (e.g. "GMT+7") next to every displayed date/time range on this screen | artifacts/screens/B2-event-detail/screenshots/IA-01-16-no-timezone.png | 2026-08-04 21:09 |
| BUG-B2-004 | B — B2 Event Detail | Bug | "Share event" gives no feedback on click | IA-04-01; Shneiderman #3 — Offer informative feedback | Minor | Show a toast/inline confirmation (e.g. "Link copied") once the share action completes | artifacts/screens/B2-event-detail/screenshots/IA-04-01-share-event-no-feedback.png | 2026-08-04 21:11 |
| BUG-B2-005 | B — B2 Event Detail | Bug | Registration-approved confirmation is not announced to assistive tech | IA-04-09; WCAG 2.2 AA SC 4.1.3 | Minor | Wrap the "Registration status" badge update in an `aria-live="polite"` region (or add a toast with `role="status"`) | artifacts/screens/B2-event-detail/screenshots/IA-04-09-registration-approved-no-aria-live.png | 2026-08-04 21:12 |
| BUG-B4-001 | B — B4 My Registrations / Ticket | Bug | Search input border fails WCAG non-text contrast minimum | IA-01-07; WCAG 2.2 AA SC 1.4.11 | Minor | Swap `border-gray-300` for a darker gray (>= 3:1 against white) — same systemic gap as BUG-B1-002 | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-07-search-border-contrast.png | 2026-08-04 21:13 |
| BUG-B4-002 | B — B4 My Registrations / Ticket | Bug | Pagination prev/next buttons have no accessible name | IA-01-08; WCAG 2.2 AA SC 1.1.1 / 4.1.2 | Major | Add `aria-label="Previous page"` / `aria-label="Next page"` to the two chevron buttons | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-08-pagination-icon-no-name.png | 2026-08-04 21:14 |
| BUG-B4-003 | B — B4 My Registrations / Ticket | Bug | "Approved" and "Cancelled" registration-status badges share the identical gray color, hiding the state distinction | IA-01-11; S13 Checklist (Color scheme) | Major | Give each registration status its own semantic color (e.g. green for Approved, red/gray for Cancelled) instead of reusing `bg-gray-100 text-gray-700` for both | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-11-approved-cancelled-same-gray-badge.png | 2026-08-04 21:15 |
| BUG-B4-004 | B — B4 My Registrations / Ticket | Bug | "Roles:" chip value stays untranslated after switching UI language to Vietnamese | IA-01-14; S13 Challenges (Localization) | Minor | Localize the role-chip values ("Guest"/"Participant") through the same i18n path already used for the participation-type badge above them | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-14-roles-chip-not-translated.png | 2026-08-04 21:16 |
| USA-B4-001 | B — B4 My Registrations / Ticket | Usability | Activity cards carry no at-rest visual signifier of interactivity | IA-01-12; Norman — Signifiers | Nielsen severity 1 | Add a static affordance (chevron icon, subtle shadow, or border-color change) to clickable activity cards so they read as interactive without requiring hover | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-12-cards-no-rest-signifier.png | 2026-08-04 21:18 |
| USA-B4-002 | B — B4 My Registrations / Ticket | Usability | Activity date/time ranges show no explicit time-zone label | IA-01-16; Nielsen #2 — Match between system and the real world | Nielsen severity 2 | Append a fixed timezone label (e.g. "GMT+7") next to every displayed activity time range — same gap as USA-B1-001 | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-16-no-timezone.png | 2026-08-04 21:20 |
| USA-B4-003 | B — B4 My Registrations / Ticket | Usability | "Change Password" required fields carry no visible required-field indicator | IA-02-01; Per-Control — Text Box (red asterisk on mandatory fields) | Nielsen severity 1 | Add a red asterisk next to "Current Password", "New Password", and "Confirm Password" labels | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-01-no-required-asterisk.png | 2026-08-04 21:21 |
| BUG-B4-005 | B — B4 My Registrations / Ticket | Bug | Avatar upload accepts a non-image file with no error message | IA-02-04; S13 Bugs (data validation gaps) | Major | Validate the selected file's MIME type client-side (and re-validate server-side) before accepting it into the pending-avatar preview state; show a specific "Only image files are allowed" error otherwise | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-04-avatar-upload-no-type-validation.png | 2026-08-04 21:24 |
| BUG-B4-006 | B — B4 My Registrations / Ticket | Bug | Whitespace-only search query is treated as valid input, not empty | IA-02-05; Per-Control — Text Box (rejects spaces-only input) | Minor | Trim the query client-side before dispatching the search, or ignore whitespace-only input as if the field were empty — same gap as BUG-B1-004 | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-05-whitespace-search-not-rejected.png | 2026-08-04 21:25 |
| BUG-B4-007 | B — B4 My Registrations / Ticket | Bug | "Confirm Password" validation error names the wrong field | IA-02-12; WCAG 2.2 AA SC 3.3.1 | Major | Fix the empty-submit validation logic so the message under "Confirm Password" reads "Confirm password is required", not "New password is required" | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-12-confirm-password-wrong-error-text.png | 2026-08-04 21:27 |
| USA-B4-004 | B — B4 My Registrations / Ticket | Usability | Long activity title is clipped to one line with no way to recover the hidden text | IA-02-18; ISTQB Checklist (item 9 — long field text does not break layout) | Nielsen severity 1 | Either wrap the title to 2 lines (as B1 already does for long event titles) or add a `title` attribute so the full text is available on hover | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-18-long-title-truncated-no-tooltip.png | 2026-08-04 21:29 |
| BUG-B4-008 | B — B4 My Registrations / Ticket | Bug | Browser Back from an activity's event-detail page loses the active search query and list scroll position | IA-03-05; Nielsen #3 — User control and freedom | Major | Persist search + scroll state (e.g. in the router/query string or a client cache) and restore it on back-navigation — same gap as BUG-B1-005 | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-03-05-back-nav-loses-search-scroll.png | 2026-08-04 21:31 |
| BUG-B4-009 | B — B4 My Registrations / Ticket | Bug | Avatar-upload control is not reachable via keyboard | IA-03-07; WCAG 2.2 AA SC 2.1.1 | Major | Give the wrapping `<label>` (or the file input itself) a `tabindex="0"` and an Enter/Space key handler so the control is keyboard-operable | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-03-07-avatar-upload-not-keyboard-reachable.png | 2026-08-04 21:33 |
| BUG-B4-010 | B — B4 My Registrations / Ticket | Bug | "Edit Profile" save gives no visible feedback on success | IA-04-01; Shneiderman #3 — Offer informative feedback | Minor | Show a toast/inline confirmation (e.g. "Profile updated") once the save completes | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-04-01-edit-profile-save-no-toast.png | 2026-08-04 21:34 |
| BUG-B4-011 | B — B4 My Registrations / Ticket | Bug | "Filters" disclosure button never exposes its expanded state to assistive tech | IA-04-08; WCAG 2.2 AA SC 4.1.2 | Minor | Add `aria-expanded` (true/false) and `aria-controls` pointing at the filters panel to the "Filters" button | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-04-08-filters-button-no-aria-expanded.png | 2026-08-04 21:36 |
| BUG-B4-012 | B — B4 My Registrations / Ticket | Bug | "Edit Profile" save confirmation is not announced to assistive tech | IA-04-09; WCAG 2.2 AA SC 4.1.3 | Minor | Wrap the save-success state in an `aria-live="polite"` region (or add a toast with `role="status"`) | artifacts/screens/B4-my-registrations-ticket/screenshots/IA-04-01-edit-profile-save-no-toast.png | 2026-08-04 21:36 |

---

## Detailed Entries

> One block per finding. Keep the summary table above in sync.

### `BUG-B1-001` — Spotlight banner "View details" link fails text contrast

| Field | Value |
| ----- | ----- |
| Screen | B1 — Home / Event Listing |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-01-06) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/dashboard` while logged in.
2. Look at the "View details" link in the bottom-right of the spotlight/featured event banner.

**Expected**

Link text meets the WCAG 2.2 AA 4.5:1 minimum contrast ratio against its background (SC 1.4.3).

**Actual**

Sampling the rendered pixels gives text ~rgb(162,244,253) on a purple-gradient background ~rgb(128,87,227), measuring ~3.85:1 — below the 4.5:1 minimum.

**Suggested fix**

Darken the link text color or the gradient stop directly under it until the measured ratio is >= 4.5:1.

**Evidence**

`artifacts/screens/B1-home-event-list/screenshots/IA-01-06-view-details-contrast.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 20:31 | assets/form-submissions/BUG-B1-001.png |

---

### `BUG-B1-002` — Search input border fails non-text contrast

| Field | Value |
| ----- | ----- |
| Screen | B1 — Home / Event Listing |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-01-07) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/dashboard` while logged in.
2. Inspect the border of the "Search events by title..." input against its white background.

**Expected**

Non-text UI element borders meet the WCAG 2.2 AA 3:1 minimum contrast ratio (SC 1.4.11).

**Actual**

The input uses Tailwind `border-gray-300` (rgb(209,213,219)) on white — measured ratio ~1.47:1. The same border class is reused on most bordered controls on the screen (event cards, filter buttons, dropdowns), so the gap is systemic, not isolated to the search box.

**Suggested fix**

Swap `border-gray-300` for a darker gray (e.g. Tailwind `gray-400`/`gray-500`) that clears 3:1 against white, applied wherever the class is reused.

**Evidence**

`artifacts/screens/B1-home-event-list/screenshots/IA-01-07-search-border-contrast.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 20:53 | assets/form-submissions/BUG-B1-002.png |

---

### `BUG-B1-003` — Pagination prev/next buttons have no accessible name

| Field | Value |
| ----- | ----- |
| Screen | B1 — Home / Event Listing |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-01-08) |
| Severity | Major |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/dashboard` while logged in, scroll to the event list pagination controls.
2. Inspect the prev/next chevron buttons with a screen reader or the accessibility tree.

**Expected**

Every icon-only button exposes an accessible name conveying its purpose (WCAG 2.2 AA SC 1.1.1 / 4.1.2).

**Actual**

Both buttons render only an `<svg aria-hidden="true">` chevron with no `aria-label` or visible text — the accessibility tree reports no name for either control.

**Suggested fix**

Add `aria-label="Previous page"` and `aria-label="Next page"` to the two buttons.

**Evidence**

`artifacts/screens/B1-home-event-list/screenshots/IA-01-08-pagination-icon-no-name.png` (visual location/context only — a screenshot cannot show a missing `aria-label`; the actual defect proof is the DOM/accessibility-tree excerpt below).

**DOM / accessibility-tree evidence** (re-verified live, 2026-08-01)

Playwright's accessibility-tree snapshot of the pagination row shows a name string for the numbered page buttons but none for prev/next:

```yaml
- generic [ref=e1167]:
  - button [disabled]:      # <- prev: no accessible name
    - img
  - button "1" [ref=e1168] [cursor=pointer]
  - button "2" [ref=e1169] [cursor=pointer]
  - button [ref=e1170] [cursor=pointer]:  # <- next: no accessible name
    - img [ref=e1171]
```

Matching `outerHTML` (attribute `aria-label` absent on both; icon carries `aria-hidden="true"`):

```html
<!-- prev -->
<button data-disabled="true" type="button" disabled data-react-aria-pressable="true" class="...">
  <svg class="lucide lucide-chevron-left" aria-hidden="true">...</svg>
</button>
<!-- next -->
<button type="button" tabindex="0" data-react-aria-pressable="true" class="...">
  <svg class="lucide lucide-chevron-right" aria-hidden="true">...</svg>
</button>
```

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 20:53 | assets/form-submissions/BUG-B1-003.png |

---

### `USA-B1-001` — Event times show no explicit time-zone label

| Field | Value |
| ----- | ----- |
| Screen | B1 — Home / Event Listing |
| Type | Usability |
| Source task | Task 1B (checklist run, IA-01-16) |
| Severity | Nielsen severity 2 |
| Heuristic violated (usability only) | Nielsen #2 — Match between system and the real world |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/dashboard` while logged in.
2. Read any event card's "Event time:" value or the spotlight banner's date range.

**Expected**

Displayed event times carry an explicit time-zone label so users (including those outside the local timezone) know how to interpret them.

**Actual**

Times are shown as `DD/MM/YYYY HH:mm - DD/MM/YYYY HH:mm` (e.g. "20/08/2026 14:18 - 21/08/2026 14:18") with no timezone indicator anywhere on the card or banner.

**Suggested fix**

Append a fixed timezone label (e.g. "(GMT+7)") next to every displayed event time range.

**Evidence**

`artifacts/screens/B1-home-event-list/screenshots/IA-01-16-no-timezone.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 20:55 | assets/form-submissions/USA-B1-001.png |

---

### `BUG-B1-004` — Whitespace-only search query accepted as valid content

| Field | Value |
| ----- | ----- |
| Screen | B1 — Home / Event Listing |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-02-05) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/dashboard` while logged in.
2. Click the "Search events by title..." box and type only spaces (e.g. three spaces).

**Expected**

A whitespace-only value is treated as if the field were empty (per-control text-box convention), leaving the full event list visible.

**Actual**

The app runs a real search for the literal whitespace string, and since no event title contains that string, the list silently renders "No events found".

**Suggested fix**

Trim the query client-side before dispatching the search, or short-circuit to "no filter applied" when the trimmed value is empty.

**Evidence**

`artifacts/screens/B1-home-event-list/screenshots/IA-02-05-whitespace-search-not-rejected.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:41 | assets/form-submissions/BUG-B1-004.png |

---

### `BUG-B1-005` — Browser Back loses active filter and scroll position

| Field | Value |
| ----- | ----- |
| Screen | B1 — Home / Event Listing |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-03-05) |
| Severity | Major |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. On `/dashboard`, switch the status filter to "Ongoing" and scroll the event list down.
2. Click into any event card to open its detail page.
3. Use the browser Back button to return to `/dashboard`.

**Expected**

The dashboard returns with the "Ongoing" filter still active and the list scrolled to its prior position (Nielsen #3 — user control and freedom).

**Actual**

The filter resets to the default "Upcoming" and the scroll position resets to the top — both pieces of state are lost.

**Root cause (confirmed via `window.location.href` and storage inspection)**

The active filter is never written anywhere durable: `window.location.href` stays a bare `/dashboard` with no query string at every step (before the filter click, after it, and after Back), and neither `localStorage` nor `sessionStorage` holds a filter key. The selection lives only in the dashboard route component's in-memory React state. A browser Back navigation causes that component to mount fresh, so it re-initializes to its default state ("Upcoming", scroll 0) — this is a state-persistence gap in the component, not the URL being overwritten or reset by a router push (there is no push to begin with). Independently reproduced from B2 (`/events/39` -> Back) with the same result — see `artifacts/screens/B2-event-detail/checklist-run.md` IA-03-05.

**Suggested fix**

Lift the filter into the URL query string (e.g. `/dashboard?status=ongoing`) so it survives a fresh mount, and either restore scroll from a client-side cache keyed by the list route or rely on the browser's native scroll restoration once the list renders with the correct filter applied before paint.

**Evidence**

`artifacts/screens/B1-home-event-list/screenshots/IA-03-05-back-nav-loses-filter-scroll.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:02 | assets/form-submissions/BUG-B1-005.png |

---

### `BUG-B1-006` — Status-filter toggles don't expose selected state to assistive tech

| Field | Value |
| ----- | ----- |
| Screen | B1 — Home / Event Listing |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-04-08) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/dashboard` while logged in.
2. Inspect the "Upcoming"/"Ongoing"/"Ended" toggle buttons with a screen reader or the accessibility tree.

**Expected**

A custom toggle control exposes its selected/unselected state programmatically (WCAG 2.2 AA SC 4.1.2).

**Actual**

The active chip is only distinguished by CSS (filled colour vs. outline) — none of the three buttons has `aria-pressed`, `aria-selected`, or `role="tab"`, so assistive tech cannot tell which one is currently selected.

**Suggested fix**

Add `aria-pressed` (or `role="tab"` + `aria-selected` if the group is semantically a tablist) reflecting the active chip.

**Evidence**

`artifacts/screens/B1-home-event-list/screenshots/IA-04-08-filter-chip-no-aria-state.png` (visual location/context only — "selected" here is a CSS color choice, invisible in the accessibility tree; the actual defect proof is the DOM excerpt below).

**DOM / accessibility-tree evidence** (re-verified live, 2026-08-01)

Playwright's accessibility-tree snapshot shows all three chips as plain, unannotated buttons — no `[pressed]`/`[selected]` marker on "Upcoming" despite it being the visually active one:

```yaml
- button "Upcoming" [ref=e45] [cursor=pointer]
- button "Ongoing" [ref=e51] [cursor=pointer]
- button "Ended" [ref=e55] [cursor=pointer]
```

Direct attribute check on the live DOM confirms all three are `null`:

```json
[
  { "text": "Upcoming", "role": null, "ariaPressed": null, "ariaSelected": null },
  { "text": "Ongoing",  "role": null, "ariaPressed": null, "ariaSelected": null },
  { "text": "Ended",    "role": null, "ariaPressed": null, "ariaSelected": null }
]
```

The only place the active/inactive distinction exists is in the Tailwind class list (e.g. active "Upcoming" carries `border-violet-200 bg-violet-50/70 text-violet-700`, structurally identical in kind to the inactive "Ended" chip's `border-slate-200 bg-slate-50/70 text-slate-700` — color only, no semantic attribute).

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:02 | assets/form-submissions/BUG-B1-006.png |

---

### `BUG-B1-007` — "Save event" confirmation not announced to assistive tech

| Field | Value |
| ----- | ----- |
| Screen | B1 — Home / Event Listing |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-04-09) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/dashboard` while logged in.
2. Click "Save event" on any event card.
3. Inspect the DOM for an `aria-live`, `role="status"`, or `role="alert"` region around the change.

**Expected**

The success confirmation is announced to assistive technology without forcing a keyboard focus change (WCAG 2.2 AA SC 4.1.3).

**Actual**

The button's label/icon swap to "Saved" immediately, but no `aria-live`/`role="status"`/`role="alert"` region wraps the change anywhere in the DOM — screen reader users get no announcement that the save succeeded.

**Suggested fix**

Wrap the save/saved state change in an `aria-live="polite"` region, or add a toast component with `role="status"`.

**Evidence**

`artifacts/screens/B1-home-event-list/screenshots/IA-04-09-save-no-aria-live.png` (visual location/context only — the absence of a live region has no visual signature; the actual defect proof is the DOM excerpt below).

**DOM / accessibility-tree evidence** (re-verified live, 2026-08-01)

Button state before/after click confirms the action genuinely succeeds (`aria-label` flips, text flips):

```html
<!-- before -->
<button type="button" aria-label="Save event" class="...">...</button>
<!-- after click -->
<button type="button" aria-label="Unsave event" class="...">...</button>
```

But a page-wide scan for any live-region mechanism returns zero matches — not just near the button, anywhere in the document:

```json
{
  "ariaLiveElementsOnPage": 0,
  "statusOrAlertElementsOnPage": 0,
  "bodyHasAriaLiveAnywhere": false
}
```

(`document.querySelectorAll('[aria-live]')`, `[role=status]`, `[role=alert]` all empty; `document.body.innerHTML.includes('aria-live')` is `false` — the string does not exist anywhere in the rendered page, confirming this isn't a scoping/selector miss.)

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:05 | assets/form-submissions/BUG-B1-007.png |

---

### `BUG-B2-001` — Category/campus tag chip text fails contrast

| Field | Value |
| ----- | ----- |
| Screen | B2 — Event Detail |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-01-06) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/events/39` while logged in.
2. Look at the "Conferences & Seminars" and "Cho Quan Campus" tag chips under the event title.

**Expected**

Tag text meets the WCAG 2.2 AA 4.5:1 minimum contrast ratio against its background (SC 1.4.3).

**Actual**

Sampling the rendered pixels: "Conferences & Seminars" text ~rgb(245,74,0) on white measures ~3.58:1; "Cho Quan Campus" text ~rgb(0,153,102) on white measures ~3.65:1 — both below the 4.5:1 minimum.

**Suggested fix**

Darken both chip text colors (orange and teal variants) until the measured ratio is >= 4.5:1.

**Evidence**

`artifacts/screens/B2-event-detail/screenshots/IA-01-06-category-chip-contrast.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:06 | assets/form-submissions/BUG-B2-001.png |

---

### `BUG-B2-002` — Info-card borders fail non-text contrast

| Field | Value |
| ----- | ----- |
| Screen | B2 — Event Detail |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-01-07) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/events/39` while logged in.
2. Inspect the border of the "Event date" / "Registration period" / "Check-in period" info cards.

**Expected**

Non-text UI element borders meet the WCAG 2.2 AA 3:1 minimum contrast ratio (SC 1.4.11).

**Actual**

The cards use `border-cyan-200` (~rgb(162,244,253)) against a white/cyan-gradient background — measured ratio ~1.25:1, sampled directly from the border pixel row of a cropped screenshot. All three info cards on the screen share this class.

**Suggested fix**

Swap `border-cyan-200` for a darker cyan (e.g. `cyan-400`/`cyan-500`) that clears 3:1 against the card background.

**Evidence**

`artifacts/screens/B2-event-detail/screenshots/IA-01-07-card-border-contrast.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:07 | assets/form-submissions/BUG-B2-002.png |

---

### `BUG-B2-003` — Guest role label not translated to Vietnamese

| Field | Value |
| ----- | ----- |
| Screen | B2 — Event Detail |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-01-14) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/events/39` while logged in.
2. Switch the UI language from English to Vietnamese via the header switcher.
3. Look at the "Guest roles" section's role name.

**Expected**

Every chrome string, including fixed system role names (Guest/Student/Lecturer), is rendered in the selected language.

**Actual**

All surrounding chrome strings translate correctly ("Registration roles" -> "Vai trò đăng ký", "Approved" -> "Đã đồng ý", "Guest roles" -> "Vai trò khách"), but the role name "Guest" itself stays in English in both languages.

**Suggested fix**

Add the role-name strings (Guest/Student/Lecturer) to the localization dictionary the same way other chrome strings are handled.

**Evidence**

`artifacts/screens/B2-event-detail/screenshots/IA-01-14-guest-role-not-translated.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:08 | assets/form-submissions/BUG-B2-003.png |

---

### `USA-B2-001` — Event date/registration/check-in times show no time-zone label

| Field | Value |
| ----- | ----- |
| Screen | B2 — Event Detail |
| Type | Usability |
| Source task | Task 1B (checklist run, IA-01-16) |
| Severity | Nielsen severity 2 |
| Heuristic violated (usability only) | Nielsen #2 — Match between system and the real world |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/events/39` while logged in.
2. Read the "Event date" / "Registration period" / "Check-in period" From/To values.

**Expected**

Displayed times carry an explicit time-zone label so users outside the local timezone know how to interpret them.

**Actual**

Times are shown as `DD/MM/YYYY HH:mm` (e.g. "01/08/2026 19:08") with no timezone indicator anywhere on the screen — same defect class as `USA-B1-001`, reproduced independently on this screen.

**Suggested fix**

Append a fixed timezone label (e.g. "(GMT+7)") next to every displayed date/time value on this screen.

**Evidence**

`artifacts/screens/B2-event-detail/screenshots/IA-01-16-no-timezone.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:09 | assets/form-submissions/USA-B2-001.png |

---

### `BUG-B2-004` — "Share event" gives no feedback on click

| Field | Value |
| ----- | ----- |
| Screen | B2 — Event Detail |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-04-01) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/events/39` while logged in.
2. Click the "Share event" button.

**Expected**

An asynchronous action confirms success or failure once it completes (e.g. a "Link copied" toast), per Shneiderman #3.

**Actual**

Clicking "Share event" produces no toast, inline message, or any observable UI change — the button state and page content are identical before and after the click. A page-wide scan for the words "copied"/"link copied" returns nothing, and `playwright-cli requests` shows no network call triggered by the click, confirming the action (if it does anything, e.g. a silent clipboard write) gives the user no confirmation either way.

**Suggested fix**

Show a toast or inline confirmation message (e.g. "Link copied to clipboard") immediately after the share action completes.

**Evidence**

`artifacts/screens/B2-event-detail/screenshots/IA-04-01-share-event-no-feedback.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:11 | assets/form-submissions/BUG-B2-004.png |

---

### `BUG-B2-005` — Registration-approved confirmation not announced to assistive tech

| Field | Value |
| ----- | ----- |
| Screen | B2 — Event Detail |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-04-09) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/events/39` while logged in, tick the "Select Guest" checkbox, and click "Register (Guest)".
2. Inspect the DOM for an `aria-live`, `role="status"`, or `role="alert"` region around the resulting "Registration status: Approved" badge.

**Expected**

The success confirmation is announced to assistive technology without forcing a keyboard focus change (WCAG 2.2 AA SC 4.1.3).

**Actual**

The "Registration status" badge appears immediately showing "Approved", but no `aria-live`/`role="status"`/`role="alert"` region wraps the change anywhere in the DOM — screen reader users get no announcement that the registration succeeded.

**Suggested fix**

Wrap the registration-status badge update in an `aria-live="polite"` region, or fire a toast component with `role="status"` alongside it.

**Evidence**

`artifacts/screens/B2-event-detail/screenshots/IA-04-09-registration-approved-no-aria-live.png` (visual location/context only — the absence of a live region has no visual signature; the actual defect proof is the DOM excerpt below).

**DOM / accessibility-tree evidence**

Accessibility-tree snapshot of the badge shows a named `generic` node but no live-region role:

```yaml
- generic [ref=e163]:
  - heading "Registration roles" [level=3] [ref=e164]
  - generic "Registration status" [ref=e165]:
    - generic [ref=e166]: Approved
```

Matching `outerHTML` (no `role="status"`/`role="alert"`, no `aria-live`):

```html
<div class="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-6 text-tiny rounded-full bg-emerald-100 text-emerald-700 font-semibold" aria-label="Registration status">
  <span class="flex-1 text-inherit font-normal px-1">Approved</span>
</div>
```

A page-wide scan for any live-region mechanism returns zero matches, confirming this isn't a scoping/selector miss:

```json
{ "live": 0, "status": 0, "bodyHasAriaLive": false }
```

(`document.querySelectorAll('[aria-live]')`, `[role=status]`, `[role=alert]` all empty.)

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:12 | assets/form-submissions/BUG-B2-005.png |

---

### `BUG-B4-001` — Search input border fails non-text contrast

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-01-07) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in.
2. Inspect the border of the "Search activities..." input against its white background.

**Expected**

Non-text UI element borders meet the WCAG 2.2 AA 3:1 minimum contrast ratio (SC 1.4.11).

**Actual**

Cropping and sampling the rendered pixels gives a border color ~rgb(209,213,220) on white — measured ratio ~1.47:1. This is the same `border-gray-300`-class gap already logged as BUG-B1-002, reused here on the search input.

**Suggested fix**

Swap `border-gray-300` for a darker gray (e.g. Tailwind `gray-400`/`gray-500`) that clears 3:1 against white, applied wherever the class is reused.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-07-search-border-contrast.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:13 | assets/form-submissions/BUG-B4-001.png |

---

### `BUG-B4-002` — Pagination prev/next buttons have no accessible name

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-01-08) |
| Severity | Major |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in, scroll to the "My Activities" pagination row.
2. Inspect the prev/next chevron buttons with a screen reader or the accessibility tree.

**Expected**

Every icon-only button exposes an accessible name conveying its purpose (WCAG 2.2 AA SC 1.1.1 / 4.1.2).

**Actual**

Both buttons render only an `<svg aria-hidden="true">` chevron with no `aria-label` or visible text — the accessibility tree reports no name for either control.

**Suggested fix**

Add `aria-label="Previous page"` and `aria-label="Next page"` to the two buttons.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-08-pagination-icon-no-name.png` (visual location/context only — a screenshot cannot show a missing `aria-label`; the actual defect proof is the DOM/accessibility-tree excerpt below).

**DOM / accessibility-tree evidence**

Playwright's accessibility-tree snapshot of the pagination row shows a named page button but none for prev/next:

```yaml
- generic [ref=e616]:
  - spinbutton "Go to page" [ref=e1295]
  - generic [ref=e622]: / 1
  - button [disabled] [ref=e623]:    # <- prev: no accessible name
    - img [ref=e624]
  - button "1" [ref=e1296] [cursor=pointer]
  - button [disabled] [ref=e628]:    # <- next: no accessible name
    - img [ref=e629]
```

Matching `outerHTML` (`aria-label` absent on both; icon carries `aria-hidden="true"`):

```html
<!-- prev -->
<button disabled="" class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
  <svg class="lucide lucide-chevron-left" aria-hidden="true">...</svg>
</button>
<!-- next -->
<button disabled="" class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
  <svg class="lucide lucide-chevron-right" aria-hidden="true">...</svg>
</button>
```

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:14 | assets/form-submissions/BUG-B4-002.png |

---

### `BUG-B4-003` — "Approved" and "Cancelled" registration badges share the same color

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-01-11) |
| Severity | Major |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in.
2. Compare the status badge on the first "My Activities" card ("Approved") against the second card ("Cancelled").

**Expected**

Per S13's color-scheme checklist item, the same color should never represent two different states in different contexts — a positive outcome (Approved) and a negative one (Cancelled) should be visually distinguishable by color, not only by text.

**Actual**

Both badges render with the identical class `bg-gray-100 text-gray-700` — confirmed via DOM inspection of both `<span>` elements. Only the text label ("Approved" vs. "Cancelled") differentiates them; a user scanning by color alone cannot tell them apart.

**Suggested fix**

Give each registration status its own semantic color (e.g. green/emerald for Approved, red/rose for Cancelled), consistent with how "Ongoing"/"Upcoming" already use distinct cyan/violet tones.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-11-approved-cancelled-same-gray-badge.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:15 | assets/form-submissions/BUG-B4-003.png |

---

### `BUG-B4-004` — "Roles:" chip value not translated to Vietnamese

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-01-14) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in, with English selected.
2. Switch the UI language to Tiếng Việt via the header language switcher.
3. Compare the "participation type" badge (e.g. "Guest participation") against the "ROLES:" chip below it on the same card.

**Expected**

Every chrome string on the screen, including enum-style badge/chip values, renders in the selected language after switching (per the group's own IA-01-14 item).

**Actual**

The "participation type" badge correctly translates ("Guest participation" → "Khách tham gia"), but the "ROLES:" chip directly below it keeps the untranslated English value ("Guest", "Participant") on both the first and second activity cards.

**Suggested fix**

Route the role-chip values through the same i18n translation path already used for the participation-type badge, so both update together on language switch.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-14-roles-chip-not-translated.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:16 | assets/form-submissions/BUG-B4-004.png |

---

### `USA-B4-001` — Activity cards have no at-rest signifier of interactivity

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Usability |
| Source task | Task 1B (checklist run, IA-01-12) |
| Severity | Nielsen severity 1 |
| Heuristic violated (usability only) | Norman — Signifiers |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in.
2. Compare an activity card in "My Activities" (clickable, links to `/events/:id`) against a stat card ("Registered Activities" etc., not clickable) at rest, without hovering either.

**Expected**

Interactive elements are visually distinguishable from static panels at a glance, without requiring a hover to reveal (Norman — Signifiers).

**Actual**

Both the clickable activity card and the non-clickable stat card use the identical `rounded-2xl border border-gray-200` panel treatment at rest. The activity card's only interactivity cues (`cursor-pointer`, `hover:bg-gray-50`) are hover-only — nothing distinguishes it as clickable until the pointer is already over it.

**Suggested fix**

Add a static affordance to activity cards — a trailing chevron icon, a subtle shadow, or a distinct border/accent color — so they read as interactive without requiring hover.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-12-cards-no-rest-signifier.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:18 | assets/form-submissions/USA-B4-001.png |

---

### `USA-B4-002` — Activity times show no explicit time-zone label

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Usability |
| Source task | Task 1B (checklist run, IA-01-16) |
| Severity | Nielsen severity 2 |
| Heuristic violated (usability only) | Nielsen #2 — Match between system and the real world |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in.
2. Read any "My Activities" card's date/time range (e.g. "01/08/2026 19:08 - 03/08/2026 19:08").

**Expected**

Displayed activity times carry an explicit time-zone label so users know how to interpret them.

**Actual**

Times are shown as `DD/MM/YYYY HH:mm - DD/MM/YYYY HH:mm` with no timezone indicator anywhere on the card — same gap already logged as USA-B1-001 and USA-B2-001.

**Suggested fix**

Append a fixed timezone label (e.g. "(GMT+7)") next to every displayed activity time range.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-16-no-timezone.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:20 | assets/form-submissions/USA-B4-002.png |

---

### `USA-B4-003` — "Change Password" required fields have no visible required indicator

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Usability |
| Source task | Task 1B (checklist run, IA-02-01) |
| Severity | Nielsen severity 1 |
| Heuristic violated (usability only) | Per-Control — Text Box (red asterisk on mandatory fields) |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in, click "Change Password".
2. Look at the "Current Password", "New Password", and "Confirm Password" labels.

**Expected**

Every required field is marked with a visible indicator (e.g. a red asterisk) next to its label.

**Actual**

All 3 fields are mandatory (confirmed: submitting empty blocks submission with a per-field error), but none carries a red asterisk or any other visible required-field marker.

**Suggested fix**

Add a red asterisk next to each of the 3 field labels.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-01-no-required-asterisk.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:21 | assets/form-submissions/USA-B4-003.png |

---

### `BUG-B4-005` — Avatar upload accepts a non-image file with no error

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-02-04) |
| Severity | Major |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in, click the camera icon on the avatar.
2. In the file picker, select a plain `.txt` file (bypassing the soft `accept="image/*"` filter, which most OS file pickers allow via an "All Files" option).

**Expected**

Attempting to upload a file that violates the stated type constraint shows an error message naming the specific constraint violated (IA-02-04).

**Actual**

The `.txt` file is accepted with no error. The app enters a pending-avatar-change state (Save/Cancel buttons appear) with a blank/broken avatar preview. The only type gate is the `accept="image/*"` attribute on the `<input>`, which is a soft UI hint, not an enforced constraint after a file is selected.

**Suggested fix**

Validate the selected file's MIME type (and re-validate server-side) before accepting it into the pending-avatar preview state; show a specific "Only image files are allowed" error otherwise.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-04-avatar-upload-no-type-validation.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:24 | assets/form-submissions/BUG-B4-005.png |

---

### `BUG-B4-006` — Whitespace-only search query accepted as valid content

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-02-05) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in.
2. Fill "Search activities..." with only spaces ("   ").

**Expected**

Whitespace-only input is treated as if the field were empty (Per-Control — Text Box).

**Actual**

The spaces-only query is accepted as valid content and triggers a real search, rendering "No activities found" instead of the full unfiltered list — same gap already logged as BUG-B1-004.

**Suggested fix**

Trim the query client-side before dispatching the search, or ignore whitespace-only input as if the field were empty.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-05-whitespace-search-not-rejected.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:25 | assets/form-submissions/BUG-B4-006.png |

---

### `BUG-B4-007` — "Confirm Password" validation error names the wrong field

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-02-12) |
| Severity | Major |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in, click "Change Password".
2. Leave all 3 fields empty and click "Update Password".
3. Read the error message rendered under "Confirm Password".

**Expected**

Each failed-validation field shows an explicit text error message associated with that specific field (WCAG 2.2 AA SC 3.3.1).

**Actual**

The "Current Password" field correctly shows "Current password is required", and "New Password" shows "Password must be at least 8 characters" — but "Confirm Password" shows "New password is required", which names the wrong field. (Note: this mislabeling is specific to the fully-empty-submit case — a separate mismatch test, correct current password + differing new/confirm values, correctly shows "Passwords do not match" under Confirm Password.)

**Suggested fix**

Fix the empty-submit validation logic so the message under "Confirm Password" reads "Confirm password is required" in this specific case.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-12-confirm-password-wrong-error-text.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:27 | assets/form-submissions/BUG-B4-007.png |

---

### `USA-B4-004` — Long activity title clipped with no way to recover the hidden text

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Usability |
| Source task | Task 1B (checklist run, IA-02-18) |
| Severity | Nielsen severity 1 |
| Heuristic violated (usability only) | ISTQB Checklist (item 9 — long field text does not break layout) |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in.
2. Scroll to the third "My Activities" card ("Đăng ký tham gia Trường hè FIT@HCMUS Summer School on Intelligent Agents and Agentic AI năm 2026").

**Expected**

An unusually long title does not break layout — either it wraps cleanly (as B1's equivalent long-title case does) or the hidden portion remains recoverable (e.g. via a `title` tooltip).

**Actual**

The title uses Tailwind's `truncate` class (`scrollWidth` 936px vs. `clientWidth` 640px — confirmed genuinely clipped) with no `title` attribute. Layout itself doesn't break, but roughly a third of the title is permanently hidden from sighted mouse users with no hover fallback to recover it — the only way to read the full title is to click into the event detail page.

**Suggested fix**

Either wrap the title to 2 lines (matching B1's existing pattern for long event titles) or add a `title` attribute carrying the full text so it's available on hover.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-18-long-title-truncated-no-tooltip.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:29 | assets/form-submissions/USA-B4-004.png |

---

### `BUG-B4-008` — Browser Back loses active search query and scroll position

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-03-05) |
| Severity | Major |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in, search "My Activities" for "AI", scroll the list down.
2. Click into an activity card (navigates to `/events/:id`).
3. Use the browser Back button.

**Expected**

Returning via Back restores the prior screen's filter/search state and scroll position (Nielsen #3 — User control and freedom).

**Actual**

`/profile` reloads with the search box empty and scroll position reset to the top — neither the "AI" query nor the scroll position is preserved. Same gap already logged as BUG-B1-005.

**Suggested fix**

Persist search + scroll state (e.g. in the router/query string or a client cache) and restore it on back-navigation.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-03-05-back-nav-loses-search-scroll.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:31 | assets/form-submissions/BUG-B4-008.png |

---

### `BUG-B4-009` — Avatar-upload control is not reachable via keyboard

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-03-07) |
| Severity | Major |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in.
2. Starting from the page top, press Tab repeatedly and track which control receives focus after "User menu".

**Expected**

Every interactive element, including the avatar-upload control, is reachable and operable using only the keyboard (WCAG 2.2 AA SC 2.1.1).

**Actual**

Tab order jumps directly from "User menu" to "QR Code" — the avatar-upload camera icon is skipped entirely. It cannot be reached or activated via keyboard at all, only by mouse click.

**Suggested fix**

Give the wrapping `<label>` (or the file input itself) a `tabindex="0"` and an Enter/Space key handler so the control is keyboard-operable.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-03-07-avatar-upload-not-keyboard-reachable.png` (visual location/context only — a screenshot cannot show a missing tab stop; the actual defect proof is the DOM excerpt below).

**DOM / accessibility-tree evidence**

The avatar-upload control's `outerHTML` confirms neither the wrapping `<label>` nor the `<input>` it contains carries a `tabindex`, and the input is `display:none` (natively removed from tab order):

```html
<label class="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1bc2f5] text-white shadow-md hover:bg-[#15a8d6]">
  <svg class="lucide lucide-camera" aria-hidden="true">...</svg>
  <input accept="image/*" aria-label="Upload avatar" class="hidden" type="file">
</label>
```

Targeted attribute dump confirming the tab-order gap directly:

```json
{ "labelTabindex": null, "labelTag": "LABEL", "inputDisplay": "none", "inputTabindex": null }
```

(The hidden input does carry `aria-label="Upload avatar"`, so the control would have an accessible *name* if it were ever reachable — the defect here is specifically that it is never reachable.)

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:33 | assets/form-submissions/BUG-B4-009.png |

---

### `BUG-B4-010` — "Edit Profile" save gives no visible feedback on success

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-04-01) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in, click "Edit Profile".
2. Change the Phone Number value and click "Save Changes".

**Expected**

An asynchronous action confirms success or failure via a toast or inline message once it completes (Shneiderman #3 — Offer informative feedback).

**Actual**

The dialog closes and the Phone field silently updates to the new value — no toast, banner, or inline message ever appears. The only way to notice the save succeeded is to compare the field's new value against what was typed.

**Suggested fix**

Show a toast/inline confirmation (e.g. "Profile updated") once the save completes.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-04-01-edit-profile-save-no-toast.png`

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:34 | assets/form-submissions/BUG-B4-010.png |

---

### `BUG-B4-011` — "Filters" disclosure button never exposes its expanded state

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-04-08) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in.
2. Inspect the "Filters" button's attributes both before and after clicking it to open the filter panel.

**Expected**

A custom (non-native) disclosure control exposes its expanded/collapsed state programmatically (WCAG 2.2 AA SC 4.1.2 Name, Role, Value).

**Actual**

`aria-expanded`, `aria-controls`, and `aria-pressed` are all `null` on the "Filters" button in both its collapsed and expanded states — confirmed by re-reading the same attributes immediately after opening the panel (visually confirmed open via the rendered "Start date range" fields).

**Suggested fix**

Add `aria-expanded` (true/false) and `aria-controls` pointing at the filters panel to the "Filters" button.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-04-08-filters-button-no-aria-expanded.png` (visual location/context only — a screenshot cannot show a missing `aria-expanded`; the actual defect proof is the DOM excerpt below).

**DOM / accessibility-tree evidence**

`outerHTML` of the "Filters" button (no `aria-expanded`/`aria-controls`/`aria-pressed` anywhere in the attribute list):

```html
<button type="button" tabindex="0" data-react-aria-pressable="true" class="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer ...">
  Filters
</button>
```

Targeted attribute dump, read once with the panel collapsed and again with it expanded — identical both times:

```json
{ "ariaExpanded": null, "ariaControls": null, "ariaPressed": null }
```

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:36 | assets/form-submissions/BUG-B4-011.png |

---

### `BUG-B4-012` — "Edit Profile" save confirmation not announced to assistive tech

| Field | Value |
| ----- | ----- |
| Screen | B4 — My Registrations / Ticket |
| Type | Bug |
| Source task | Task 1B (checklist run, IA-04-09) |
| Severity | Minor |
| Heuristic violated (usability only) | — |
| Environment (OS / browser / device) | Linux, Chromium (playwright-cli), 1920x1080 |

**Steps to reproduce**

1. Open `/profile` while logged in, click "Edit Profile".
2. Change the Phone Number value and click "Save Changes".
3. Inspect the DOM for an `aria-live`, `role="status"`, or `role="alert"` region anywhere on the page.

**Expected**

The success confirmation is announced to assistive technology without forcing a keyboard focus change (WCAG 2.2 AA SC 4.1.3).

**Actual**

The Phone field updates silently (see BUG-B4-010) with no `aria-live`/`role="status"`/`role="alert"` region wrapping the change anywhere in the DOM — screen reader users get no announcement that the save succeeded.

**Suggested fix**

Wrap the save-success state (or the toast added to fix BUG-B4-010) in an `aria-live="polite"` region, or use a toast component with `role="status"`.

**Evidence**

`artifacts/screens/B4-my-registrations-ticket/screenshots/IA-04-01-edit-profile-save-no-toast.png` (visual location/context only — the absence of a live region has no visual signature; the actual defect proof is the DOM scan below).

**DOM / accessibility-tree evidence**

A page-wide scan for any live-region mechanism, run immediately after the save completed, returns zero matches:

```json
{ "liveCount": 0, "statusCount": 0 }
```

(`document.querySelectorAll('[aria-live]')` and `[role=status],[role=alert]` both empty — confirming this isn't a scoping/selector miss but a genuine absence of any live-region mechanism on the page.)

**Google Form submission**

| Submitted at | Confirmation |
| ------------ | ------------ |
| 2026-08-04 21:36 | assets/form-submissions/BUG-B4-012.png |

---

> **TODO:** duplicate the entry block above for every finding.
