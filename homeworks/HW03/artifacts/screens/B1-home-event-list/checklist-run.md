# Checklist Run — B1: Home / Event Listing

**Scenario:** B — User registers for an event
**Screen:** Home / event listing (featured carousel, category browse, search & filter)

| Field | Value |
| ----- | ----- |
| URL | https://prod-dev.ems-fitus.cloud/dashboard |
| Account / role used | lhlam.tester@gmail.com (Student) — app is behind login wall, `/` and `/dashboard` both redirect to `/login` when unauthenticated |
| Browser / OS / viewport | Chromium (playwright-cli), Linux, 1920x1080 |
| Run date | 2026-08-01 |
| Checklist version | [group/gui-checklist.md](../../../group/gui-checklist.md) — `6e815ae` |

---

## Rules

- Run **every** item of the shared checklist against this screen. Mark `Passed`, `Failed` or `N/A`.
- `N/A` = the control class the item is written for does not exist on this screen. It is not a soft pass, and it is excluded from the pass-rate denominator.
- `Notes` is **mandatory for every Failed and every N/A item** — for Failed, the concrete defect; for N/A, the missing control class. Never a restatement of the item.
- Attach a screenshot **only for Failed items**, in `screenshots/`. Naming: `<CHECKLIST-ID>-<short-slug>.png`.
- Every Failed item that is a real defect must get a Finding ID and go into [FINDINGS_LOG.md](../../../FINDINGS_LOG.md) **and** the Google Form.

---

## Result summary

| Metric | Count |
| ------ | ----- |
| Items run (Passed + Failed) | 37 |
| Passed | 29 |
| Failed | 8 |
| N/A (not applicable to this screen) | 24 |
| Findings raised | 8 |

---

## Run table

| Checklist ID | Verdict (Passed \| Failed \| N/A) | Notes (reason for Failed or N/A) | Screenshot | Finding ID |
| ------------ | ---------------------------- | -------------------------------- | ---------- | ---------- |
| IA-01-01 | N/A | Event list is a card grid (no table column headers, no sortable columns) — nothing to compare terminology against on this screen. | | |
| IA-01-02 | Passed | Outline-style secondary buttons ("Save event", "Filters") and filled/pill status toggles use the same visual language on B1 and on B2 (event detail) — checked "Save event" styling on both screens. | | |
| IA-01-03 | N/A | No multi-field form on this screen — the search box is a single field, not a form. | | |
| IA-01-04 | Passed | Searching a non-matching query ("zzzznonexistentquery12345") renders a dedicated empty state: calendar-x icon + "No events found" + "There are no events matching your filters." | | |
| IA-01-05 | Passed | On reload, spotlight banner and event cards render as gray skeleton blocks plus a spinner in the list area while the fetch is pending. | | |
| IA-01-06 | Failed | "View details" link on the spotlight banner: text ~rgb(162,244,253) on purple-gradient background ~rgb(128,87,227) measures ~3.85:1, below the 4.5:1 minimum (sampled via canvas rasterization of the rendered pixels, per screenshot). | screenshots/IA-01-06-view-details-contrast.png | BUG-B1-001 |
| IA-01-07 | Failed | Search input border uses Tailwind `border-gray-300` (rgb(209,213,219)) on white background — measures ~1.47:1, below the 3:1 non-text contrast minimum. Same border class is reused on most bordered controls on this screen. | screenshots/IA-01-07-search-border-contrast.png | BUG-B1-002 |
| IA-01-08 | Failed | Pagination prev/next chevron buttons have no accessible name — `<button>` wraps only an `svg aria-hidden="true"`, no `aria-label` or visible text. | screenshots/IA-01-08-pagination-icon-no-name.png | BUG-B1-003 |
| IA-01-09 | Passed | Tabbing to "Notifications" and "User menu" shows a visible outline box around each control, distinct from the unfocused state. | | |
| IA-01-10 | Passed | Same font family and heading scale used on B1 (dashboard) and B2 (event detail) — no ad-hoc font substitution observed. | | |
| IA-01-11 | Passed | Status badge colors consistent across screens: "Upcoming" = purple, "Ongoing" = teal, "Ended" = gray, checked on both the B1 card list and the B2 detail page badge. | | |
| IA-01-12 | Passed | Links/buttons (View details, Save event, category chevrons, status filter chips) all carry an icon and/or distinct color at rest, without requiring hover to be recognized as interactive. | | |
| IA-01-13 | N/A | No table with numeric/date columns — event time/date appears inside card body text, not a column. | | |
| IA-01-14 | Passed | Switched UI language via the header switcher (EN -> VI): nav, headings, filters, category tree, and card chrome strings (e.g. "Save event" -> "Lưu sự kiện") all translated; only leftover Latin-script text was user-authored event titles/data, not chrome strings. | | |
| IA-01-15 | Passed | Switching EN -> VI kept the user on `/dashboard` with the active "Upcoming" filter still selected and the same scroll/list state — no reset to a default screen. | | |
| IA-01-16 | Failed | Event times are shown as `DD/MM/YYYY HH:mm` (e.g. "20/08/2026 14:18 - 21/08/2026 14:18") with no time-zone label anywhere on the card or spotlight banner. | screenshots/IA-01-16-no-timezone.png | USA-B1-001 |
| IA-01-17 | Passed | Vietnamese strings (e.g. "Chương trình: Gặp gỡ & Trò chuyện cùng Ban chủ nhiệm Khoa CNTT", "Đang cập nhật") render with full diacritics, no fallback-font artifacts or truncation observed in tested strings. | | |
| IA-02-01 | N/A | No required field on this screen — search box and all Filters-panel fields (Event Date, Campus, Registration available) are optional. | | |
| IA-02-02 | N/A | No required field / submit-blocking behavior — search and filters apply live, nothing to "submit". | | |
| IA-02-03 | N/A | No failed-validation state was ever triggered by any control on this screen (see IA-02-05 for the closest case, which fails silently rather than raising a validation error). | | |
| IA-02-04 | N/A | No file/image upload control on this screen. | | |
| IA-02-05 | Failed | Filling the search box with only spaces ("   ") is accepted as valid content and triggers a real search, returning "No events found" instead of being treated as empty (which would show the full list). | screenshots/IA-02-05-whitespace-search-not-rejected.png | BUG-B1-004 |
| IA-02-06 | N/A | Search input has no stated character limit — no `maxlength` attribute; a 300-character string was accepted in full with no visible limit or truncation to test against. | | |
| IA-02-07 | Passed | Event Date "From"/"To" are native `<input type="date">` fields — the browser itself rejects an out-of-range day/month combination at entry (fill of an invalid date raised a "Malformed value" error before it could reach the app). | | |
| IA-02-08 | N/A | No rich-text or long-text input control on this screen. | | |
| IA-02-09 | N/A | The search box is a live-filter field with no explicit submit step, not a single-field form with an Enter-to-submit action. | | |
| IA-02-10 | N/A | No submit button on this screen — search/filters apply live, no double-submit path to test. | | |
| IA-02-11 | Passed | Clicking "Clear all filters" (after setting an Event Date "From" value) resets the field back to empty. | | |
| IA-02-12 | N/A | No failed-validation state was ever triggered on this screen's controls. | | |
| IA-02-13 | Passed | Every filter control (Event Date From/To, Campus, Registration available) and the search box carries a visible label before the user enters a value. | | |
| IA-02-14 | N/A | No validation error was ever triggered to check suggestion wording. | | |
| IA-02-15 | Passed | Campus dropdown has a visible label, a non-empty option list ("All campuses", "Cho Quan Campus"), consistent ordering, and its default option ("All campuses") pinned at a fixed top position. | | |
| IA-02-16 | N/A | No native checkbox or radio-button control on this screen — category-tree items and status filters (Upcoming/Ongoing/Ended) are toggle `button` elements, not checkbox/radio inputs. | | |
| IA-02-17 | Passed | "Clear all filters" in its default disabled state has reduced opacity (0.5), `pointer-events:none`, and the native `disabled` attribute (so it's skipped in tab order); it becomes enabled as soon as a filter value is set, making the reason contextually discoverable. | | |
| IA-02-18 | Passed | A long event title ("Đăng ký tham gia Trường hè FIT@HCMUS Summer School on Intelligent Agents and Agentic AI năm 2026") wraps cleanly to 2 lines, and overflow category chips collapse into a "+1 more" badge — no overlap, clipping, or forced horizontal scroll. | | |
| IA-02-19 | N/A | No validation is triggered anywhere on this screen's controls, so there is no blur-vs-submit trigger to compare for consistency. | | |
| IA-02-20 | N/A | No rich-text editor or authored rich content on this screen — the event description renders as a plain text paragraph. | | |
| IA-02-21 | Passed | An event with a missing thumbnail ("A1 Kiểm thử tiếng Việt 2026-07-31 RT") renders a dedicated placeholder icon rather than a broken-image icon; loaded thumbnails render without visible distortion. | | |
| IA-03-01 | Passed | All 4 top-level nav links (Events, Calendar, Saved Events, User guide) load their target screen without a dead link or error page. | | |
| IA-03-02 | N/A | B1 is the top-level landing screen reached directly after login — no breadcrumb trail is applicable here. | | |
| IA-03-03 | Passed | Exactly one status filter chip (Upcoming/Ongoing/Ended) is active at a time — the active chip is filled/colored, inactive chips stay outline-only; confirmed by switching from "Upcoming" to "Ongoing". | | |
| IA-03-04 | Passed | Keyboard Tab order follows the visual top-to-bottom, left-to-right layout: logo -> nav links -> language/notifications/user menu -> spotlight "View details" -> search box -> status filter chips. | | |
| IA-03-05 | Failed | After opening an event via a card link with the "Ongoing" filter active and the list scrolled down, using the browser Back button returns to `/dashboard` with the filter reset to the default "Upcoming" and scroll position reset to the top — neither the prior filter nor scroll position is preserved. | screenshots/IA-03-05-back-nav-loses-filter-scroll.png | BUG-B1-005 |
| IA-03-06 | N/A | No drag-and-drop reorderable list on this screen. | | |
| IA-03-07 | Passed | The "Ongoing" filter chip is reachable via Tab and activates on Enter — exercised the whole toggle keyboard-only, no mouse. | | |
| IA-03-08 | N/A | No modal or dialog appears on this screen — clicking "Save event" toggles its own state inline without opening a dialog. | | |
| IA-03-09 | Passed | Tab focus order matches the visual reading order end to end (see IA-03-04). | | |
| IA-03-10 | Passed | Each "View details" link sits directly beside/under its own event's heading inside the card, giving it sufficient surrounding context per WCAG Link Purpose (In Context) rather than relying on a bare "click here". | | |
| IA-03-11 | Passed | Main nav (Events, Calendar, Saved Events, User guide) appears in the same relative position and order on B1 (dashboard) and B2 (event detail). | | |
| IA-03-12 | Passed | Opening `/events/39` directly by URL (not via in-app navigation) renders the same event detail content as reaching it through the card's "View details" link. | | |
| IA-03-13 | N/A | No destructive/uncorrectable action on this screen triggers a confirmation dialog — "Save event" is a simple, reversible toggle. | | |
| IA-04-01 | Passed | Clicking "Save event" swaps the button's label and icon to "Saved" immediately once the action completes, confirming success inline. | | |
| IA-04-02 | N/A | No action on this screen runs long enough to need a dedicated progress indicator beyond the initial page-load skeleton (already covered by IA-01-05). | | |
| IA-04-03 | Passed | Status badges (Upcoming/Ongoing/Ended) always pair a colour with a text label — never colour alone. | | |
| IA-04-04 | Passed | The "Save event"/"Saved" button's label and icon update in place immediately after the user's own action, with no manual page reload. | | |
| IA-04-05 | N/A | No destructive/uncorrectable action on this screen requires a confirmation dialog. | | |
| IA-04-06 | N/A | No data-validation error message was ever triggered on this screen to judge its wording (see IA-02-05: the whitespace-search case fails silently with no message at all, plain or otherwise). | | |
| IA-04-07 | N/A | No automatic focus-shift scenario (modal open, validation failure) exists on this screen — the "Filters" disclosure panel intentionally keeps keyboard focus on its own trigger button, which is standard for an inline (non-modal) panel. | | |
| IA-04-08 | Failed | The custom status-filter toggle buttons (Upcoming/Ongoing/Ended) convey selected vs. unselected state only through CSS styling — no `aria-pressed`, `aria-selected`, or `role="tab"` exposes that state to assistive technology. | screenshots/IA-04-08-filter-chip-no-aria-state.png | BUG-B1-006 |
| IA-04-09 | Failed | The "Save event" -> "Saved" confirmation is not wrapped in any `aria-live` / `role="status"` / `role="alert"` region, so assistive-tech users get no announcement that the action succeeded. | screenshots/IA-04-09-save-no-aria-live.png | BUG-B1-007 |
| IA-04-10 | Passed | The "Filters" active-count badge and the per-card Save/Saved state update on screen immediately after the user's own action, with no manual refresh. | | |

---

> Legend: **Passed** / **Failed** = the item applies to this screen and was exercised. **N/A** = the item's control class (data list, form field, tab control, upload, …) does not exist here.
