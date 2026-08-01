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
| Total findings | 14 |
| — Type: Bug | 12 |
| — Type: Usability | 2 |
| From Task 1B (checklist run) | 14 |
| From Task 2 (user testing) | 0 |
| From Task 3 (cross-platform) | 0 |
| Submitted to Google Form | 0 |
| **Log rows == form submissions?** | No — 14 rows logged, 0 submitted to the Google Form so far |

---

## Findings

| ID | Scenario / Screen | Type (Bug \| Usability) | Description | Repro steps / Heuristic | Severity | Suggested fix | Screenshot ref | Form submitted at |
| -- | ----------------- | ----------------------- | ----------- | ----------------------- | -------- | ------------- | -------------- | ----------------- |
| BUG-B1-001 | B — B1 Home/Event Listing | Bug | Spotlight banner "View details" link text fails WCAG contrast minimum | IA-01-06; WCAG 2.2 AA SC 1.4.3 | Minor | Darken the link text or the gradient stop under it until measured contrast is >= 4.5:1 | artifacts/screens/B1-home-event-list/screenshots/IA-01-06-view-details-contrast.png | |
| BUG-B1-002 | B — B1 Home/Event Listing | Bug | Search input border fails WCAG non-text contrast minimum | IA-01-07; WCAG 2.2 AA SC 1.4.11 | Minor | Swap `border-gray-300` for a darker gray (>= 3:1 against white) on all bordered controls reusing this class | artifacts/screens/B1-home-event-list/screenshots/IA-01-07-search-border-contrast.png | |
| BUG-B1-003 | B — B1 Home/Event Listing | Bug | Pagination prev/next buttons have no accessible name | IA-01-08; WCAG 2.2 AA SC 1.1.1 / 4.1.2 | Major | Add `aria-label="Previous page"` / `aria-label="Next page"` to the two chevron buttons | artifacts/screens/B1-home-event-list/screenshots/IA-01-08-pagination-icon-no-name.png | |
| USA-B1-001 | B — B1 Home/Event Listing | Usability | Event date/time strings show no explicit time-zone label | IA-01-16; Nielsen #2 — Match between system and the real world | Nielsen severity 2 | Append a fixed timezone label (e.g. "GMT+7") next to every displayed event time | artifacts/screens/B1-home-event-list/screenshots/IA-01-16-no-timezone.png | |
| BUG-B1-004 | B — B1 Home/Event Listing | Bug | Whitespace-only search query is treated as valid input, not empty | IA-02-05; Per-Control — Text Box (rejects spaces-only input) | Minor | Trim the query client-side before dispatching the search, or ignore whitespace-only input as if the field were empty | artifacts/screens/B1-home-event-list/screenshots/IA-02-05-whitespace-search-not-rejected.png | |
| BUG-B1-005 | B — B1 Home/Event Listing | Bug | Browser Back from event detail loses the active status filter and list scroll position | IA-03-05; Nielsen #3 — User control and freedom | Major | Persist filter + scroll state (e.g. in the router/query string or a client cache) and restore it on back-navigation | artifacts/screens/B1-home-event-list/screenshots/IA-03-05-back-nav-loses-filter-scroll.png | |
| BUG-B1-006 | B — B1 Home/Event Listing | Bug | Status-filter toggle buttons (Upcoming/Ongoing/Ended) don't expose selected state to assistive tech | IA-04-08; WCAG 2.2 AA SC 4.1.2 | Minor | Add `aria-pressed` (or `role="tab"` + `aria-selected` if treated as a tablist) to the three toggle buttons | artifacts/screens/B1-home-event-list/screenshots/IA-04-08-filter-chip-no-aria-state.png | |
| BUG-B1-007 | B — B1 Home/Event Listing | Bug | "Save event" success confirmation is not announced to assistive tech | IA-04-09; WCAG 2.2 AA SC 4.1.3 | Minor | Wrap the save/saved state change in an `aria-live="polite"` region (or add a toast with `role="status"`) | artifacts/screens/B1-home-event-list/screenshots/IA-04-09-save-no-aria-live.png | |
| BUG-B2-001 | B — B2 Event Detail | Bug | Category/campus tag chip text fails WCAG contrast minimum | IA-01-06; WCAG 2.2 AA SC 1.4.3 | Minor | Darken the chip text colors (orange/teal) until measured contrast is >= 4.5:1 against white | artifacts/screens/B2-event-detail/screenshots/IA-01-06-category-chip-contrast.png | |
| BUG-B2-002 | B — B2 Event Detail | Bug | Info-card borders (Event date/Registration period/Check-in period) fail WCAG non-text contrast minimum | IA-01-07; WCAG 2.2 AA SC 1.4.11 | Minor | Swap `border-cyan-200` for a darker cyan (>= 3:1 against the card background) on all three info cards | artifacts/screens/B2-event-detail/screenshots/IA-01-07-card-border-contrast.png | |
| BUG-B2-003 | B — B2 Event Detail | Bug | Guest role label stays untranslated after switching UI language to Vietnamese | IA-01-14; S13 Challenges (Localization) | Minor | Localize the fixed role-name strings (Guest/Student/Lecturer) the same way other chrome strings are localized | artifacts/screens/B2-event-detail/screenshots/IA-01-14-guest-role-not-translated.png | |
| USA-B2-001 | B — B2 Event Detail | Usability | Event date/registration/check-in times show no explicit time-zone label | IA-01-16; Nielsen #2 — Match between system and the real world | Nielsen severity 2 | Append a fixed timezone label (e.g. "GMT+7") next to every displayed date/time range on this screen | artifacts/screens/B2-event-detail/screenshots/IA-01-16-no-timezone.png | |
| BUG-B2-004 | B — B2 Event Detail | Bug | "Share event" gives no feedback on click | IA-04-01; Shneiderman #3 — Offer informative feedback | Minor | Show a toast/inline confirmation (e.g. "Link copied") once the share action completes | artifacts/screens/B2-event-detail/screenshots/IA-04-01-share-event-no-feedback.png | |
| BUG-B2-005 | B — B2 Event Detail | Bug | Registration-approved confirmation is not announced to assistive tech | IA-04-09; WCAG 2.2 AA SC 4.1.3 | Minor | Wrap the "Registration status" badge update in an `aria-live="polite"` region (or add a toast with `role="status"`) | artifacts/screens/B2-event-detail/screenshots/IA-04-09-registration-approved-no-aria-live.png | |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

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
| Not yet submitted | — |

---

> **TODO:** duplicate the entry block above for every finding.
