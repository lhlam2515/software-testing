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
| Total findings | 8 |
| — Type: Bug | 7 |
| — Type: Usability | 1 |
| From Task 1B (checklist run) | 8 |
| From Task 2 (user testing) | 0 |
| From Task 3 (cross-platform) | 0 |
| Submitted to Google Form | 0 |
| **Log rows == form submissions?** | No — 8 rows logged, 0 submitted to the Google Form so far |

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

**Suggested fix**

Persist filter and scroll state (e.g. in the URL query string or a client-side cache keyed by the list route) and restore it on back-navigation.

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

> **TODO:** duplicate the entry block above for every finding.
