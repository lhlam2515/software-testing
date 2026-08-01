# Checklist Run — B2: Event Detail

**Scenario:** B — User registers for an event
**Screen:** Event detail (banner, schedule, register button, waitlist notice)

| Field | Value |
| ----- | ----- |
| URL | https://prod-dev.ems-fitus.cloud/events/39 |
| Account / role used | lhlam.tester@gmail.com (Student) — app is behind login wall, `/events/39` redirects to `/login` when unauthenticated |
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
| Items run (Passed + Failed) | 36 |
| Passed | 29 |
| Failed | 7 |
| N/A (not applicable to this screen) | 25 |
| Findings raised | 7 |

---

## Run table

| Checklist ID | Verdict (Passed \| Failed \| N/A) | Notes (reason for Failed or N/A) | Screenshot | Finding ID |
| ------------ | ---------------------------- | -------------------------------- | ---------- | ---------- |
| IA-01-01 | N/A | Event detail is a single-record page (banner, schedule, roles, content) — no data list, no column headers, nothing to compare terminology against. | | |
| IA-01-02 | Passed | "Save event"/"Share event" (outline/filled secondary style) and "Register (Guest)"/"Cancel registration" (filled primary/destructive) follow the same visual hierarchy language observed on B1 — checked side by side with B1's button styling. | | |
| IA-01-03 | N/A | No multi-field form on this screen — registration is a single checkbox role selector, not a labeled form. | | |
| IA-01-04 | N/A | No filter/search control on this screen. | | |
| IA-01-05 | Passed | A fresh navigation to `/events/39` shows a spinner over the header/blank body while the event fetch is pending, before content renders (raced screenshot mid-navigation). | | |
| IA-01-06 | Failed | Category tag "Conferences & Seminars" text (~rgb(245,74,0) on white) measures ~3.58:1; campus tag "Cho Quan Campus" text (~rgb(0,153,102) on white) measures ~3.65:1 — both below the 4.5:1 minimum (sampled via pixel crop of the rendered chips). | screenshots/IA-01-06-category-chip-contrast.png | BUG-B2-001 |
| IA-01-07 | Failed | The three info cards (Event date / Registration period / Check-in period) use a `border-cyan-200` border (~rgb(162,244,253)) against their white/cyan-gradient background — measures ~1.25:1, below the 3:1 non-text contrast minimum (sampled via pixel crop at the border edge). | screenshots/IA-01-07-card-border-contrast.png | BUG-B2-002 |
| IA-01-08 | Passed | All icon-only controls (Switch language, Notifications, user "Open menu", floating "Social links") expose an `aria-label`; Save/Share/Back/Register/Cancel controls also carry visible text. | | |
| IA-01-09 | Passed | Tabbing to "Switch language" (and other header controls) shows a visible outline box distinct from the unfocused state. | | |
| IA-01-10 | Passed | Same font family and heading scale as B1 (dashboard) — no ad-hoc font substitution observed, consistent with B1's own cross-screen check. | | |
| IA-01-11 | Passed | "Upcoming" status badge uses the same purple used on B1's card list for the same state. | | |
| IA-01-12 | Passed | Save/Share/Back/Register/Cancel buttons and category/campus chips all carry an icon, fill, or outline at rest, without requiring hover to be recognized as interactive. | | |
| IA-01-13 | N/A | No table with numeric/date columns on this screen — dates appear as labeled From/To rows inside cards. | | |
| IA-01-14 | Failed | Switching EN -> VI translates all chrome strings ("Registration roles" -> "Vai trò đăng ký", "Approved" -> "Đã đồng ý", "Guest roles" -> "Vai trò khách", "Share event" -> "Chia sẻ sự kiện") except the role name "Guest" itself, which is a fixed system role label (not free-form user content) and stays in English in both languages. | screenshots/IA-01-14-guest-role-not-translated.png | BUG-B2-003 |
| IA-01-15 | Passed | Switching EN -> VI kept the user on `/events/39` viewing the same event with the same scroll position — no reset to a default screen. | | |
| IA-01-16 | Failed | Event date / Registration period / Check-in period times are shown as `DD/MM/YYYY HH:mm` (e.g. "01/08/2026 19:08") with no time-zone label anywhere on the screen — same defect class as B1 (USA-B1-001), reproduced independently on this screen. | screenshots/IA-01-16-no-timezone.png | USA-B2-001 |
| IA-01-17 | Passed | Vietnamese strings ("Vai trò đăng ký", "Sự kiện diễn ra sau 1 ngày", "Chia sẻ sự kiện", "Đã đồng ý") render with full diacritics, no fallback-font artifacts or truncation observed. | | |
| IA-02-01 | N/A | No required field on this screen — no multi-field form is present (registration is a single checkbox role selector). | | |
| IA-02-02 | N/A | No required field / submit-blocking behavior — no multi-field form on this screen. | | |
| IA-02-03 | N/A | No failed-validation state was ever triggered by any control on this screen. | | |
| IA-02-04 | N/A | No file/image upload control on this screen. | | |
| IA-02-05 | N/A | No free-text input field on this screen to test whitespace-only rejection against. | | |
| IA-02-06 | N/A | No text input field with a character limit on this screen. | | |
| IA-02-07 | N/A | Event date / registration / check-in dates are read-only display fields, not editable date inputs. | | |
| IA-02-08 | N/A | The "Detailed content" section is a read-only rendered view, not an editable rich-text input on this screen. | | |
| IA-02-09 | N/A | No single-field form with an Enter-to-submit action on this screen. | | |
| IA-02-10 | N/A | No multi-field form with a submit control on this screen — "Register (Guest)" is a single-action button, not a form submission with double-submit risk to test in that sense. | | |
| IA-02-11 | N/A | No Reset/Cancel action that clears entered form field values — "Cancel registration" reverses a prior registration, it does not reset in-progress form input. | | |
| IA-02-12 | N/A | No failed-validation state was ever triggered on this screen's controls. | | |
| IA-02-13 | Passed | The "Guest" role checkbox carries a visible label ("Guest") before the user needs to interact with it. | | |
| IA-02-14 | N/A | No validation error was ever triggered to check suggestion wording. | | |
| IA-02-15 | N/A | No dropdown/select control on this screen. | | |
| IA-02-16 | Passed | The "Select Guest" checkbox defaults to unchecked (correct default), clicking the "Guest" label toggles it, and Space toggles it while focused; the radio-group "exactly one selection" clause does not apply since this is a single checkbox, not a radio group (only one guest role exists on this event). | | |
| IA-02-17 | Passed | The disabled "Select Guest" checkbox (after registering) shows reduced opacity (0.6) and a `not-allowed` cursor, is skipped in the tab order via the native `disabled` attribute, and the reason is discoverable via the adjacent "Registration status: Approved" badge and updated Registered/Confirmed counters. | | |
| IA-02-18 | Passed | The event title and the four "Detailed content" paragraphs (up to ~350 characters each) wrap cleanly with no horizontal scroll (`document.documentElement.scrollWidth` == `clientWidth` == 1920px), no overlap or clipping observed. | | |
| IA-02-19 | N/A | No validation is triggered anywhere on this screen's controls, so there is no blur-vs-submit trigger to compare for consistency. | | |
| IA-02-20 | Passed | The "Detailed content" section renders authored headings ("1. Why AI Agents Matter", etc.) and paragraphs correctly formatted, with no raw HTML tags exposed in the rendered text. | | |
| IA-02-21 | Passed | The event banner image renders at its intended aspect ratio without visible distortion or a broken-image placeholder; missing-image fallback behavior was not re-exercised on this specific event (already confirmed on B1's card list for a different event). | | |
| IA-03-01 | Passed | Clicked through all 4 top-level nav links (Events, Calendar, Saved Events, User guide) from this screen — each loads its target screen without a dead link or error page (e.g. Calendar -> `/calendar`, "Lịch sự kiện" title). | | |
| IA-03-02 | N/A | No breadcrumb trail on this screen — "Back to events" is a single back action, not a multi-segment breadcrumb. | | |
| IA-03-03 | N/A | No tab control separating this screen's content into named states. | | |
| IA-03-04 | N/A | No multi-field form on this screen to check field-to-field tab order against. | | |
| IA-03-05 | Failed | Verified via B1 -> B2 -> back-navigation: set the "Ongoing" filter and scrolled the B1 dashboard down, opened an event card (`/events/25`) reaching a detail page in the same shape as this screen, then used browser Back — arrived back at `/dashboard` with the filter reset to default "Upcoming" and scroll position reset to top. Root cause confirmed via `window.location.href`: the URL stays a bare `/dashboard` with no query string at every step (before the filter click, after it, and after Back) — the filter selection is never written to the URL, localStorage, or sessionStorage, only held in the dashboard component's in-memory state. Browser Back triggers a fresh mount of that component with its default state, which is what discards both the filter and the scroll offset; this is a state-persistence gap, not a case of the URL being overwritten or reset by a router push. Same defect as `BUG-B1-005`, reproduced independently while exercising this screen's inbound/outbound navigation. | screenshots/IA-03-05-back-nav-loses-filter-scroll.png | BUG-B1-005 |
| IA-03-06 | N/A | No drag-and-drop reorderable list on this screen. | | |
| IA-03-07 | Passed | Reached and operated every interactive element (nav links, Save/Share/Back buttons, "Select Guest" checkbox via Space, "Register (Guest)"/"Cancel registration" buttons) using only Tab/Shift+Tab/Enter/Space, no mouse. | | |
| IA-03-08 | Passed | Opening the "Cancel registration" confirmation dialog moves focus inside it immediately; Tab cycles through Close -> Cancel -> Confirm and back to Close without escaping to the page behind it — no keyboard trap without an exit, since Close/Cancel are both Tab-reachable and Enter-activatable (Escape itself did not dismiss the dialog in this run, a minor gap noted but not a trap per SC 2.1.2's own wording). | | |
| IA-03-09 | Passed | Tab focus order follows the visual top-to-bottom, left-to-right layout: header nav -> language/notifications/user menu -> Back to events -> Save event -> Share event -> Guest role card -> checkbox -> footer links. | | |
| IA-03-10 | Passed | "Back to events" and "Save event"/"Share event"/"Cancel registration" all carry self-descriptive visible text; footer icon links (Facebook, Zalo, etc.) carry a matching `aria-label` naming the destination service — no bare "click here" links. | | |
| IA-03-11 | Passed | Main nav (Events, Calendar, Saved Events, User guide) appears in the same relative position and order on B2 as on B1. | | |
| IA-03-12 | Passed | Loading `/events/39` directly by URL (not via in-app navigation) renders the same event detail content (banner, schedule, registration section) as reaching it through the dashboard's card link. | | |
| IA-03-13 | Passed | The "Cancel registration" confirmation dialog provides both an explicit "Cancel" button and a "Close" (X) control to back out without cancelling the registration. | | |
| IA-04-01 | Failed | Clicking "Register (Guest)" and "Save event" both show inline success feedback (Registration status badge, Save->Saved label swap), but clicking "Share event" produces no toast, inline message, or any observable UI change at all — the user cannot tell whether the action succeeded (no network request fires either, per `playwright-cli requests`). | screenshots/IA-04-01-share-event-no-feedback.png | BUG-B2-004 |
| IA-04-02 | N/A | None of this screen's actions (Save, Register, Cancel, Share) run long enough to need a dedicated progress indicator beyond the initial page-load skeleton (already covered by IA-01-05). | | |
| IA-04-03 | Passed | The "Upcoming" event-status badge and the "Registration status: Approved" badge both pair a colour with a text label, never colour alone. | | |
| IA-04-04 | Passed | The "Register (Guest)" button changes from disabled to enabled immediately once the "Select Guest" checkbox is ticked, and the whole registration section (checkbox disabled+checked, "Registration status: Approved" badge, "Cancel registration" button) updates in place immediately after a successful registration, with no manual page reload. | | |
| IA-04-05 | Passed | The "Cancel registration" action opens a dialog stating "Are you sure you want to cancel your registration?" and requires an explicit "Cancel registration" confirm click before the cancellation proceeds. | | |
| IA-04-06 | N/A | No data-validation error was ever triggered on this screen to judge its wording. | | |
| IA-04-07 | Passed | Opening the "Cancel registration" dialog moves keyboard focus into the dialog panel immediately (confirmed via `document.activeElement.closest('[role=dialog]')`), landing the user on the control they need to act on next. | | |
| IA-04-08 | Passed | The "Select Guest" role control is a native `<input type="checkbox" aria-label="Select Guest">` (confirmed via DOM ancestor-chain inspection — no invalid nested interactive elements), so it exposes a proper accessible name and role natively; no custom non-native control lacking name/role was found on this screen. | | |
| IA-04-09 | Failed | The "Registration status: Approved" badge that appears after a successful registration is a plain `<div aria-label="Registration status">` with no `aria-live`, `role="status"`, or `role="alert"` anywhere in the DOM (`document.querySelectorAll('[aria-live]')` / `[role=status]` / `[role=alert]` all return 0) — screen reader users get no announcement that the registration succeeded. | screenshots/IA-04-09-registration-approved-no-aria-live.png | BUG-B2-005 |
| IA-04-10 | Passed | "Slot available: Guest" count decremented from 99 to 98 on screen immediately after registering, with no manual refresh; the registration section's counters (Registered/Confirmed) updated the same way. | | |

---

> **TODO:** paste one row per checklist item, keeping the IDs from the shared checklist.

> Legend: **Passed** / **Failed** = the item applies to this screen and was exercised. **N/A** = the item's control class (data list, form field, tab control, upload, …) does not exist here.
