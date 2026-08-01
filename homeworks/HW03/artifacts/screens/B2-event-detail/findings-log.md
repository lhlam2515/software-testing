# Findings Log (draft) — B2: Event Detail

Per-screen draft findings from the Task 1B checklist run. Promote to the root
`FINDINGS_LOG.md` (Finding ID assigned, Google Form submitted) at Phase 4.

| Checklist ID | Defect | Screenshot | Severity guess | Promoted? |
| ------------ | ------ | ---------- | --------------- | --------- |
| IA-01-06 | Category tag "Conferences & Seminars" (~rgb(245,74,0) on white, ~3.58:1) and campus tag "Cho Quan Campus" (~rgb(0,153,102) on white, ~3.65:1) both fail WCAG 4.5:1 text contrast minimum | screenshots/IA-01-06-category-chip-contrast.png | Minor | Yes |
| IA-01-07 | Event date/Registration period/Check-in period info cards use `border-cyan-200` (~rgb(162,244,253)) against white/cyan gradient, ~1.25:1, fails WCAG 3:1 non-text contrast minimum | screenshots/IA-01-07-card-border-contrast.png | Minor | Yes |
| IA-01-14 | Role name "Guest" stays untranslated in the Vietnamese UI while every surrounding chrome string is localized | screenshots/IA-01-14-guest-role-not-translated.png | Minor | Yes |
| IA-01-16 | Event date/Registration period/Check-in period times carry no explicit time-zone label (same defect class as USA-B1-001, reproduced on B2) | screenshots/IA-01-16-no-timezone.png | Minor | Yes |
| IA-03-05 | Browser Back from an event detail page loses the active status filter and list scroll position on the dashboard. Confirmed root cause: `window.location.href` stays a bare `/dashboard` with no query string throughout (filter click, before/after Back) — the filter is never written to the URL, localStorage, or sessionStorage, only kept in the dashboard component's in-memory state, which resets to default on the fresh mount that Back triggers. Same root-cause defect as BUG-B1-005, reproduced independently while exercising this screen's back-navigation | screenshots/IA-03-05-back-nav-loses-filter-scroll.png | Major | Yes (references existing BUG-B1-005, no new ID) |
| IA-04-01 | "Share event" button gives no toast, inline message, or any observable feedback on click — no way to tell if the action succeeded; no network request fires either | screenshots/IA-04-01-share-event-no-feedback.png | Minor | Yes |
| IA-04-09 | "Registration status: Approved" badge (shown after successful registration) has no `aria-live`/`role=status`/`role=alert` — screen reader users get no announcement of success (DOM/accessibility-tree evidence in FINDINGS_LOG.md) | screenshots/IA-04-09-registration-approved-no-aria-live.png | Minor | Yes |
