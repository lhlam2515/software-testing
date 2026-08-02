# Checklist Run — B4: My Registrations / Ticket

**Scenario:** B — User registers for an event
**Screen:** My Registrations and ticket (registration status, barcode / QR)

| Field | Value |
| ----- | ----- |
| URL | https://prod-dev.ems-fitus.cloud/profile (no dedicated route exists; reached via hamburger menu → "View profile") |
| Account / role used | Student test account (lhlam.tester@gmail.com) |
| Browser / OS / viewport | Linux, Chromium (playwright-cli), 1920x1080 |
| Run date | 2026-08-02 |
| Checklist version | [group/gui-checklist.md](../../../group/gui-checklist.md) — 6e815ae |

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
| Items run (Passed + Failed) | 47 |
| Passed | 31 |
| Failed | 16 |
| N/A (not applicable to this screen) | 14 |
| Findings raised | 16 |

---

## Run table

| Checklist ID | Verdict (Passed \| Failed \| N/A) | Notes (reason for Failed or N/A) | Screenshot | Finding ID |
| ------------ | ---------------------------- | -------------------------------- | ---------- | ---------- |
| IA-01-01 | N/A | "My Activities" is a card list (no table column headers, no sortable columns) — nothing to compare terminology against on this screen. | | |
| IA-01-02 | Passed | Outline-style secondary buttons ("QR Code", "Edit Profile", "Change Password", "Filters", "Cancel") and solid-filled primary buttons ("Export", "Save Changes", "Update Password") follow the same visual hierarchy used on B1/B2. | | |
| IA-01-03 | Passed | The "Change Password" dialog (3 fields: Current/New/Confirm Password) uses one consistent top-aligned label style for every field, no ad-hoc mixing. | | |
| IA-01-04 | Passed | Searching "zzzznonexistentquery12345" in "My Activities" renders a dedicated empty state: calendar icon + "No activities found" instead of a blank list. | | |
| IA-01-05 | Passed | Reloading `/profile` shows a full-page spinner while the session/data fetch is pending, before the profile content renders. | | |
| IA-01-06 | Passed | Sampled rendered pixel colors for body/label text and badge text (e.g. "Registered at:" ~rgb(74,85,101) on white ≈7.6:1; gray-700/gray-100, violet-700/violet-100, cyan-700/cyan-100 badge pairs ≈9.4:1 / 6.0:1 / 4.8:1) — all clear the 4.5:1 minimum. | | |
| IA-01-07 | Failed | The "Search activities..." input border (~rgb(209,213,220) on white) measures ~1.47:1, below the WCAG 3:1 non-text contrast minimum — same border color/class as B1's BUG-B1-002. | screenshots/IA-01-07-search-border-contrast.png | BUG-B4-001 |
| IA-01-08 | Failed | Pagination prev/next chevron buttons (`<button disabled>` wrapping only an `svg aria-hidden="true"`) expose no accessible name — confirmed via DOM dump, no `aria-label` or text on either button. | screenshots/IA-01-08-pagination-icon-no-name.png | BUG-B4-002 |
| IA-01-09 | Passed | Tabbing to "Filters", to an activity card, and into the "Change Password" dialog's "Current Password" field each shows a clearly visible focus outline distinct from the unfocused state. | | |
| IA-01-10 | Passed | Same font family and heading scale as B1/B2 — no ad-hoc font substitution on this screen. | | |
| IA-01-11 | Failed | The "Approved" and "Cancelled" registration-status badges both render with the identical class `bg-gray-100 text-gray-700` — the same color pair means two opposite states (success vs. failure) on the same screen. | screenshots/IA-01-11-approved-cancelled-same-gray-badge.png | BUG-B4-003 |
| IA-01-12 | Failed | Activity cards carry no at-rest visual signifier of interactivity — same `border-gray-200` rounded panel style as the non-clickable stat cards above them, with only `cursor-pointer` and a `hover:bg-gray-50` tint (visible on hover only) marking them as clickable. | screenshots/IA-01-12-cards-no-rest-signifier.png | USA-B4-001 |
| IA-01-13 | N/A | No table with numeric/date columns — activity date/time appears as inline card body text, not a column. | | |
| IA-01-14 | Failed | After switching EN → VI, the "Roles:" chip value stays in English ("Guest", "Participant") on the first two activity cards even though the sibling "participation type" badge directly above it correctly translates ("Guest participation" → "Khách tham gia"). | screenshots/IA-01-14-roles-chip-not-translated.png | BUG-B4-004 |
| IA-01-15 | Passed | Switching EN → VI kept the user on `/profile` with the "USING" search query, and scroll position all preserved — no reset to a default view. | | |
| IA-01-16 | Failed | Activity date/time ranges (e.g. "01/08/2026 19:08 - 03/08/2026 19:08") carry no explicit time-zone label anywhere on the card — same gap as B1's USA-B1-001. | screenshots/IA-01-16-no-timezone.png | USA-B4-002 |
| IA-01-17 | Passed | Vietnamese strings (e.g. "Trường Đại học Khoa học Tự nhiên, 227 Nguyễn Văn Cừ, Phường Chợ Quán, TP.HCM", "Học viên tham dự") render with full diacritics, no fallback-font artifacts observed. | | |
| IA-02-01 | Failed | None of the "Change Password" dialog's 3 fields (Current/New/Confirm Password) — all mandatory — carry a visible required-field indicator (red asterisk) next to their labels. | screenshots/IA-02-01-no-required-asterisk.png | USA-B4-003 |
| IA-02-02 | Passed | Submitting "Change Password" with all 3 fields empty blocks submission and shows a visible error under each offending field ("Current password is required", etc.). | | |
| IA-02-03 | Passed | On the empty-submit case, keyboard focus and a visible outline land on "Current Password" (the first offending field); on the mismatch case, focus lands on "Confirm Password" instead. | | |
| IA-02-04 | Failed | Uploading a plain `.txt` file via the avatar camera-icon control is accepted with no error — the app queues it as a pending avatar change with a broken/blank preview instead of naming the violated type constraint (input only carries a soft `accept="image/*"` hint, not enforced after selection). | screenshots/IA-02-04-avatar-upload-no-type-validation.png | BUG-B4-005 |
| IA-02-05 | Failed | Filling "Search activities..." with only spaces ("   ") is accepted as valid content and renders "No activities found" instead of being treated as empty. | screenshots/IA-02-05-whitespace-search-not-rejected.png | BUG-B4-006 |
| IA-02-06 | N/A | Neither "Search activities..." nor "Phone Number" declares a `maxlength` — no stated character limit to test against. | | |
| IA-02-07 | Passed | The Filters "Start date range" fields are native `<input type="date">` — filling an invalid day/month (30/02/2026) throws a "Malformed value" error before it reaches the app, same native guarantee as B1. | | |
| IA-02-08 | N/A | No rich-text or long-text input control on this screen. | | |
| IA-02-09 | Passed | The "Edit Profile" dialog is a single-field form (Phone Number); pressing Enter while focused in it submits and closes the dialog. | | |
| IA-02-10 | Passed | Triple-clicking "Save Changes" in rapid succession (via a single synchronous script) produced exactly one `PATCH /api/users/me` request, confirmed via the network request log — no duplicate submissions. | | |
| IA-02-11 | Passed | Typing a new value into "Edit Profile"'s Phone Number field then clicking Cancel discards it — reopening the dialog shows the last-saved value, not the discarded edit. | | |
| IA-02-12 | Failed | On the empty-submit case, the error rendered under "Confirm Password" reads "New password is required" — the wrong field's message, not "Confirm password is required". | screenshots/IA-02-12-confirm-password-wrong-error-text.png | BUG-B4-007 |
| IA-02-13 | Passed | Every field on this screen (Phone Number, Current/New/Confirm Password, search, Filters date range, Rows per page) carries a visible label before the user enters a value. | | |
| IA-02-14 | Passed | "Change Password" server-side errors name the exact rule violated (e.g. "Password must include uppercase letters and special characters", "Password must be at least 8 characters"), not a generic failure message. | | |
| IA-02-15 | Passed | The "Rows per page" control has a visible "Rows per page:" label, a non-empty option list (5/10/20/50/100) in consistent ascending order, with the default ("10") at a fixed position. | | |
| IA-02-16 | N/A | No native checkbox or radio-button control on this screen. | | |
| IA-02-17 | Passed | The disabled pagination prev/next buttons show reduced opacity and a not-allowed cursor; the reason (only 1 page of results) is inferable from the adjacent "1-3 of 3 results" / "1" page indicator. | | |
| IA-02-18 | Failed | The third activity's long title is CSS `truncate`-clipped to a single line (`scrollWidth` 936px vs. `clientWidth` 640px) with no `title` attribute — part of the text is hidden with no hover fallback to recover it, unlike B1's equivalent long-title case which wraps to 2 lines without clipping. | screenshots/IA-02-18-long-title-truncated-no-tooltip.png | USA-B4-004 |
| IA-02-19 | Passed | Focusing then blurring the empty "Current Password" field (without submitting) shows no error — all 3 "Change Password" fields validate together on submit, not a blur/submit mix. | | |
| IA-02-20 | N/A | No rich-text editor or authored rich content on this screen. | | |
| IA-02-21 | N/A | All 3 of this account's activity thumbnails load successfully (`complete: true`, non-zero `naturalWidth`) — no missing-thumbnail case exists on this account to exercise the fallback-placeholder behavior. | | |
| IA-03-01 | Passed | All 4 top-level nav links (Events, Calendar, Saved Events, User guide) load their target screen from `/profile` without a dead link or error page. | | |
| IA-03-02 | N/A | No breadcrumb control exists anywhere on this screen. | | |
| IA-03-03 | N/A | No tab control (`role=tab`/`tablist`) exists on this screen. | | |
| IA-03-04 | Passed | Keyboard Tab order follows the visual top-to-bottom, left-to-right layout: logo → nav links → language/notifications/user menu → QR Code → Edit Profile → Change Password → search → Filters → Export → activity cards. | | |
| IA-03-05 | Failed | Opening an activity via its card link with an active search query ("AI") and the list scrolled down, then using browser Back, returns to `/profile` with the search box empty and scroll position reset to the top — neither is preserved. | screenshots/IA-03-05-back-nav-loses-search-scroll.png | BUG-B4-008 |
| IA-03-06 | N/A | No drag-and-drop reorderable list on this screen. | | |
| IA-03-07 | Failed | The avatar-upload control (camera-icon `<label>` wrapping a `display:none` file input, neither carrying a `tabindex`) cannot be reached via Tab — it is operable by mouse/pointer only. | screenshots/IA-03-07-avatar-upload-not-keyboard-reachable.png | BUG-B4-009 |
| IA-03-08 | Passed | Tabbing through the "Edit Profile" dialog cycles focus back to its own first field without escaping to the page behind it, and Escape closes the dialog cleanly. | | |
| IA-03-09 | Passed | Tab focus order matches the visual reading order end to end (see IA-03-04). | | |
| IA-03-10 | Passed | Each activity card's link accessible name includes the event title plus its full status/role/date context, giving sufficient purpose in context per WCAG 2.4.4 rather than a bare "click here". | | |
| IA-03-11 | Passed | Main nav (Events, Calendar, Saved Events, User guide) appears in the same relative position and order on `/profile` as on B1 (dashboard) and B2 (event detail). | | |
| IA-03-12 | Passed | Loading `/profile` directly by URL (not via the hamburger → "View profile" path) renders the same profile content as reaching it through in-app navigation. | | |
| IA-03-13 | N/A | No destructive or uncorrectable action (e.g. delete, cancel registration, logout) exists as a control on this screen. | | |
| IA-04-01 | Failed | Saving a phone-number change via "Edit Profile" completes (the dialog closes, the Phone field updates) with no toast or inline confirmation message — a page-wide scan found zero `[aria-live]`/`[role=status]`/`[role=alert]` elements anywhere in the DOM. | screenshots/IA-04-01-edit-profile-save-no-toast.png | BUG-B4-010 |
| IA-04-02 | N/A | The only asynchronous action on this screen ("Export") completes near-instantly for this account's 3 activity rows — no action runs long enough to warrant a dedicated progress indicator beyond the page-load skeleton (IA-01-05). | | |
| IA-04-03 | Passed | Every status badge (Approved/Cancelled, Ongoing/Upcoming, participation-type) pairs its colour with a visible text label — never colour alone — despite the colour-reuse issue flagged separately in IA-01-11. | | |
| IA-04-04 | N/A | No control on this screen has an enabled state or label that depends on data changed via another action on the same page. | | |
| IA-04-05 | N/A | No destructive/uncorrectable action on this screen requires a confirmation dialog (see IA-03-13). | | |
| IA-04-06 | Passed | "Change Password" validation errors are plain language (e.g. "Current password is required", "Password must include uppercase letters and special characters"), never a raw code or stack trace. | | |
| IA-04-07 | Passed | On the "Change Password" empty-submit case, focus automatically lands on "Current Password" (the first offending field); on the mismatch case, it lands on "Confirm Password" — both the field the user needs to act on next. | | |
| IA-04-08 | Failed | The "Filters" disclosure button never exposes `aria-expanded` (or `aria-pressed`/`aria-controls`) — confirmed `null` in both its collapsed and expanded DOM state — so assistive tech has no way to know the panel's open/closed state. | screenshots/IA-04-08-filters-button-no-aria-expanded.png | BUG-B4-011 |
| IA-04-09 | Failed | The "Edit Profile" save confirmation (silent field update, see IA-04-01) is not wrapped in any `aria-live`/`role="status"`/`role="alert"` region — same page-wide scan (0 matches) — so screen-reader users get no announcement that the save succeeded. | screenshots/IA-04-01-edit-profile-save-no-toast.png | BUG-B4-012 |
| IA-04-10 | Passed | The Phone field value updates in place immediately after "Edit Profile" is saved, with no manual page reload required. | | |

---

> **TODO:** paste one row per checklist item, keeping the IDs from the shared checklist.

> Legend: **Passed** / **Failed** = the item applies to this screen and was exercised. **N/A** = the item's control class (data list, form field, tab control, upload, …) does not exist here.
