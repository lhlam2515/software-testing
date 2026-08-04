# Main Report — HW03

**GUI & Usability Testing on EMS (Event Management System)**

---

## 1. Student Information

| Field | Value |
| ----- | ----- |
| Student name | Lê Hoàng Lâm |
| Student ID | 23127216 |
| Group | 02 |
| Class / Cohort | 23KTPM1 |
| SUT | EMS — <https://prod-dev.ems-fitus.cloud/> |
| Test account(s) used | `lhlam.tester@gmail.com`, role Student, self-registered through the EMS sign-up flow |
| Report date | 2026-08-04 |

---

## 2. Selected Scenario & Screens

**Scenario B — User registers for an event.**

### 2.1 Why this scenario

Scenario B covers the participant side of EMS end to end: discover an event, act on it, then check the resulting record, all reachable with a single self-registered Student account and no admin privileges. That single flow already exercises three structurally different GUI patterns, a filterable data list, a detail page with a stateful primary action, and a personal record view, so the same shared checklist gets tested against a wide slice of control classes rather than three variations of the same layout.

### 2.2 Screens under test

| Screen ID | Screen | URL / Path | Reason for selection |
| --------- | ------ | ---------- | -------------------- |
| B1 | Home / event listing | `/dashboard` | Entry point of the flow, exercises IA-01 (layout, i18n, empty/loading state) and IA-03 (filter, search, back-navigation) on a data-list pattern. |
| B2 | Event detail | `/events/{id}` | Holds the actual registration action, exercises IA-02 (role-selection control) and IA-04 (register/cancel/share feedback) on a status-dependent detail page. |
| B4 | My Registrations / ticket | `/profile` (no dedicated route; reached via the hamburger menu, "View profile") | End state of the flow and the participant's own data view, exercises IA-01 (status badges, i18n) plus IA-02 (Change Password form, avatar upload) on a personal-record pattern the other two screens do not cover. |

> **B3 (Registration form) excluded (decided 2026-08-03):** no dedicated route — it is an in-page panel on `/events/{id}` (B2) — and was never executed in Task 1B. Task 1B/2/3 run on B1, B2, B4 only.

### 2.3 Non-overlap declaration (§5)

| Member | Scenario | Screens |
| ------ | -------- | ------- |
| Lê Hoàng Lâm (me) | B | B1, B2, B4 |

> Other members' scenario/screen assignments are declared in their own individual reports; this row covers only the individual deliverable owned by this submission.

---

## 3. Task 1A — Shared GUI Checklist (Group Deliverable)

### 3.1 How the checklist was built

The group reviewed the course's heuristic sources first (Nielsen's 10 heuristics, Norman's 6 principles, Shneiderman's 8 golden rules, WCAG 2.2 AA, the ISTQB 12-item form checklist, and slide S13's checklist/navigation/common-bugs material), then encoded them into a single structured prompt (`group/gui-checklist.prompt.md`) that pins the exact source list, forbids citing anything outside it, and requires every item to ground in a generic EMS control class rather than a specific screen so the checklist stays reusable across all four scenarios. Claude Code (Sonnet 5) generated the Round 1 draft from that prompt, logged verbatim in `group/checklist-prompts.md`.

The draft was then reviewed against real EMS screens: 11 items the AI could not produce were added by hand (mostly i18n, since the prompt explicitly excluded it as a deferred gap-analysis exercise, plus source under-use on dropdown/checkbox controls and long-text handling), 4 AI items were removed for being flow-level or duplicate checks rather than GUI-level ones, and 2 rules were rewritten, most notably the verdict scale, which the prompt specified as binary Passed/Failed but which broke on the first real screen run because entire control classes are simply absent on any single screen. The full reasoning for every change is in `group/ai-gap-notes.md`.

| Deliverable | Location |
| ----------- | -------- |
| Checklist (> 40 items, IA-01…IA-04) | [group/gui-checklist.md](group/gui-checklist.md) |
| Reference list | [group/references.md](group/references.md) |
| AI prompts used to build it | [group/checklist-prompts.md](group/checklist-prompts.md) |
| Why AI missed the human-added items | [group/ai-gap-notes.md](group/ai-gap-notes.md) |

### 3.2 Coverage across interface aspects

| Interface aspect | Items | AI-generated | Human-added |
| ---------------- | ----- | ------------ | ----------- |
| IA-01 — General UI standards | 17 | 13 | 4 |
| IA-02 — Forms | 21 | 14 | 7 |
| IA-03 — Navigation | 13 | 13 | 0 |
| IA-04 — Feedback / state | 10 | 10 | 0 |
| **Total** | 61 | 50 | 11 |

### 3.3 Summary of AI gaps

Across the 11 human-added items and the 6 changes to the AI draft, `group/ai-gap-notes.md` traces every gap to one of four causes: 5 to `PROMPT` (the generation prompt named i18n EN/VI, RTL, and dark mode as out of scope, a deliberate deferral so the AI could not have produced them under that instruction), 8 to `MODEL` (six per-control checklists and the ISTQB 12-item list were supplied in full, but the AI kept only the entries that recur most often in generic checklist writing, dropping dropdown, checkbox/radio, disabled-state, long-text, and validation-timing coverage), 1 to `EMS` (locale-correct timestamp rendering, a product-specific behavior no generic source describes), and 3 to `SCOPE` (two AI items and one source clause tested flow design or a duplicate rule rather than a renderable GUI defect, caught only on human review against a live screen). The pattern that carries forward: a prompt constraint acts as a coverage ceiling, whatever it excludes stays excluded no matter how the same prompt is re-run, and full source material does not guarantee full source usage.

---

## 4. Task 1B — Checklist Execution per Screen

> Full per-screen runs live in `artifacts/screens/<screen>/checklist-run.md`. Screenshots are attached for **Failed** items only.

### 4.1 B1 — Home / event listing

| Field | Value |
| ----- | ----- |
| URL | `https://prod-dev.ems-fitus.cloud/dashboard` |
| Run date / build | 2026-08-01, checklist `6e815ae` |
| Items run / Passed / Failed | 37 / 29 / 8 (24 N/A) |
| Detailed run | [artifacts/screens/B1-home-event-list/checklist-run.md](artifacts/screens/B1-home-event-list/checklist-run.md) |

**Failed items summary**

| Checklist ID | Item | Why it failed | Finding ID | Screenshot |
| ------------ | ---- | ------------- | ---------- | ---------- |
| IA-01-06 | Body/label text keeps 4.5:1 minimum contrast | Spotlight "View details" link text measures ~3.85:1 | BUG-B1-001 | [screenshot](artifacts/screens/B1-home-event-list/screenshots/IA-01-06-view-details-contrast.png) |
| IA-01-07 | Non-text elements keep 3:1 minimum contrast | Search input border measures ~1.47:1 | BUG-B1-002 | [screenshot](artifacts/screens/B1-home-event-list/screenshots/IA-01-07-search-border-contrast.png) |
| IA-01-08 | Icon-only control exposes an accessible name | Pagination prev/next buttons carry no `aria-label` | BUG-B1-003 | [screenshot](artifacts/screens/B1-home-event-list/screenshots/IA-01-08-pagination-icon-no-name.png) |
| IA-01-16 | Displayed times carry an explicit time-zone label | Event times show no time-zone indicator anywhere | USA-B1-001 | [screenshot](artifacts/screens/B1-home-event-list/screenshots/IA-01-16-no-timezone.png) |
| IA-02-05 | Whitespace-only input rejected as empty | Whitespace search runs a real (empty-result) search | BUG-B1-004 | [screenshot](artifacts/screens/B1-home-event-list/screenshots/IA-02-05-whitespace-search-not-rejected.png) |
| IA-03-05 | Back action preserves filter and scroll position | Filter resets to default, scroll resets to top | BUG-B1-005 | [screenshot](artifacts/screens/B1-home-event-list/screenshots/IA-03-05-back-nav-loses-filter-scroll.png) |
| IA-04-08 | Custom control exposes selected state to assistive tech | Status-filter toggles carry no `aria-pressed` | BUG-B1-006 | [screenshot](artifacts/screens/B1-home-event-list/screenshots/IA-04-08-filter-chip-no-aria-state.png) |
| IA-04-09 | Async success message announced without a focus change | "Save event" success not wrapped in `aria-live` | BUG-B1-007 | [screenshot](artifacts/screens/B1-home-event-list/screenshots/IA-04-09-save-no-aria-live.png) |

### 4.2 B2 — Event detail

| Field | Value |
| ----- | ----- |
| URL | `https://prod-dev.ems-fitus.cloud/events/39` |
| Run date / build | 2026-08-01, checklist `6e815ae` |
| Items run / Passed / Failed | 36 / 29 / 7 (25 N/A) |
| Detailed run | [artifacts/screens/B2-event-detail/checklist-run.md](artifacts/screens/B2-event-detail/checklist-run.md) |

**Failed items summary**

| Checklist ID | Item | Why it failed | Finding ID | Screenshot |
| ------------ | ---- | ------------- | ---------- | ---------- |
| IA-01-06 | Body/label text keeps 4.5:1 minimum contrast | Category/campus chip text measures ~3.58 to 3.65:1 | BUG-B2-001 | [screenshot](artifacts/screens/B2-event-detail/screenshots/IA-01-06-category-chip-contrast.png) |
| IA-01-07 | Non-text elements keep 3:1 minimum contrast | Info-card borders measure ~1.25:1 | BUG-B2-002 | [screenshot](artifacts/screens/B2-event-detail/screenshots/IA-01-07-card-border-contrast.png) |
| IA-01-14 | Every chrome string switches with the selected language | "Guest" role label stays English after switching to Vietnamese | BUG-B2-003 | [screenshot](artifacts/screens/B2-event-detail/screenshots/IA-01-14-guest-role-not-translated.png) |
| IA-01-16 | Displayed times carry an explicit time-zone label | Event/registration/check-in times show no time-zone indicator | USA-B2-001 | [screenshot](artifacts/screens/B2-event-detail/screenshots/IA-01-16-no-timezone.png) |
| IA-03-05 | Back action preserves filter and scroll position | Same root cause as B1, reproduced independently entering from this screen | BUG-B1-005 (shared with B1) | [screenshot](artifacts/screens/B2-event-detail/screenshots/IA-03-05-back-nav-loses-filter-scroll.png) |
| IA-04-01 | Async action confirms success or failure | "Share event" gives no toast, message, or network call | BUG-B2-004 | [screenshot](artifacts/screens/B2-event-detail/screenshots/IA-04-01-share-event-no-feedback.png) |
| IA-04-09 | Async success message announced without a focus change | Registration-approved badge not wrapped in `aria-live` | BUG-B2-005 | [screenshot](artifacts/screens/B2-event-detail/screenshots/IA-04-09-registration-approved-no-aria-live.png) |

### 4.3 B4 — My Registrations / ticket

| Field | Value |
| ----- | ----- |
| URL | `https://prod-dev.ems-fitus.cloud/profile` (no dedicated route; reached via hamburger menu, "View profile") |
| Run date / build | 2026-08-02, checklist `6e815ae` |
| Items run / Passed / Failed | 47 / 31 / 16 (14 N/A) |
| Detailed run | [artifacts/screens/B4-my-registrations-ticket/checklist-run.md](artifacts/screens/B4-my-registrations-ticket/checklist-run.md) |

**Failed items summary**

| Checklist ID | Item | Why it failed | Finding ID | Screenshot |
| ------------ | ---- | ------------- | ---------- | ---------- |
| IA-01-07 | Non-text elements keep 3:1 minimum contrast | Search input border measures ~1.47:1, same class as BUG-B1-002 | BUG-B4-001 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-07-search-border-contrast.png) |
| IA-01-08 | Icon-only control exposes an accessible name | Pagination prev/next buttons carry no `aria-label` | BUG-B4-002 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-08-pagination-icon-no-name.png) |
| IA-01-11 | Status colour is never reused across two meanings | "Approved" and "Cancelled" badges share the same gray | BUG-B4-003 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-11-approved-cancelled-same-gray-badge.png) |
| IA-01-12 | Interactive elements are distinguishable at rest | Activity cards look identical to static stat cards without hovering | USA-B4-001 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-12-cards-no-rest-signifier.png) |
| IA-01-14 | Every chrome string switches with the selected language | "ROLES:" chip value stays English after switching to Vietnamese | BUG-B4-004 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-14-roles-chip-not-translated.png) |
| IA-01-16 | Displayed times carry an explicit time-zone label | Activity time ranges show no time-zone indicator | USA-B4-002 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-01-16-no-timezone.png) |
| IA-02-01 | Every required field carries a visible indicator | Change Password's 3 required fields carry no asterisk | USA-B4-003 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-01-no-required-asterisk.png) |
| IA-02-04 | Upload error names the specific constraint violated | A `.txt` file is accepted into the avatar preview with no error | BUG-B4-005 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-04-avatar-upload-no-type-validation.png) |
| IA-02-05 | Whitespace-only input rejected as empty | Whitespace search runs a real (empty-result) search | BUG-B4-006 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-05-whitespace-search-not-rejected.png) |
| IA-02-12 | Failed-validation field shows an explicit text error | "Confirm Password" empty-submit error names the wrong field | BUG-B4-007 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-12-confirm-password-wrong-error-text.png) |
| IA-02-18 | Long field values do not break the containing layout | Long activity title is clipped with no `title` fallback | USA-B4-004 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-02-18-long-title-truncated-no-tooltip.png) |
| IA-03-05 | Back action preserves filter and scroll position | Back from an activity's detail page loses search query and scroll | BUG-B4-008 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-03-05-back-nav-loses-search-scroll.png) |
| IA-03-07 | Every interactive element is keyboard-operable | Avatar-upload control is not reachable via Tab | BUG-B4-009 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-03-07-avatar-upload-not-keyboard-reachable.png) |
| IA-04-01 | Async action confirms success or failure | "Edit Profile" save gives no visible feedback | BUG-B4-010 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-04-01-edit-profile-save-no-toast.png) |
| IA-04-08 | Custom control exposes its state to assistive tech | "Filters" disclosure button never exposes `aria-expanded` | BUG-B4-011 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-04-08-filters-button-no-aria-expanded.png) |
| IA-04-09 | Async success message announced without a focus change | "Edit Profile" save success not wrapped in `aria-live` | BUG-B4-012 | [screenshot](artifacts/screens/B4-my-registrations-ticket/screenshots/IA-04-01-edit-profile-save-no-toast.png) |

### 4.4 Bugs found in Task 1B

> Each bug: screen · repro steps · expected vs actual · severity · screenshot. Full entries in [FINDINGS_LOG.md](FINDINGS_LOG.md).

| Finding ID | Screen | Description | Severity | Form submitted |
| ---------- | ------ | ----------- | -------- | -------------- |
| BUG-B1-001 | B1 Home/Event Listing | Spotlight banner "View details" link text fails WCAG contrast minimum | Minor | Submitted |
| BUG-B1-002 | B1 Home/Event Listing | Search input border fails WCAG non-text contrast minimum | Minor | Submitted |
| BUG-B1-003 | B1 Home/Event Listing | Pagination prev/next buttons have no accessible name | Major | Submitted |
| USA-B1-001 | B1 Home/Event Listing | Event date/time strings show no explicit time-zone label | Nielsen severity 2 | Submitted |
| BUG-B1-004 | B1 Home/Event Listing | Whitespace-only search query is treated as valid input, not empty | Minor | Submitted |
| BUG-B1-005 | B1 Home/Event Listing | Browser Back from event detail loses the active status filter and list scroll position | Major | Submitted |
| BUG-B1-006 | B1 Home/Event Listing | Status-filter toggle buttons (Upcoming/Ongoing/Ended) don't expose selected state to assistive tech | Minor | Submitted |
| BUG-B1-007 | B1 Home/Event Listing | "Save event" success confirmation is not announced to assistive tech | Minor | Submitted |
| BUG-B2-001 | B2 Event Detail | Category/campus tag chip text fails WCAG contrast minimum | Minor | Submitted |
| BUG-B2-002 | B2 Event Detail | Info-card borders (Event date/Registration period/Check-in period) fail WCAG non-text contrast minimum | Minor | Submitted |
| BUG-B2-003 | B2 Event Detail | Guest role label stays untranslated after switching UI language to Vietnamese | Minor | Submitted |
| USA-B2-001 | B2 Event Detail | Event date/registration/check-in times show no explicit time-zone label | Nielsen severity 2 | Submitted |
| BUG-B2-004 | B2 Event Detail | "Share event" gives no feedback on click | Minor | Submitted |
| BUG-B2-005 | B2 Event Detail | Registration-approved confirmation is not announced to assistive tech | Minor | Submitted |
| BUG-B4-001 | B4 My Registrations / Ticket | Search input border fails WCAG non-text contrast minimum | Minor | Submitted |
| BUG-B4-002 | B4 My Registrations / Ticket | Pagination prev/next buttons have no accessible name | Major | Submitted |
| BUG-B4-003 | B4 My Registrations / Ticket | "Approved" and "Cancelled" registration-status badges share the identical gray color, hiding the state distinction | Major | Submitted |
| BUG-B4-004 | B4 My Registrations / Ticket | "Roles:" chip value stays untranslated after switching UI language to Vietnamese | Minor | Submitted |
| USA-B4-001 | B4 My Registrations / Ticket | Activity cards carry no at-rest visual signifier of interactivity | Nielsen severity 1 | Submitted |
| USA-B4-002 | B4 My Registrations / Ticket | Activity date/time ranges show no explicit time-zone label | Nielsen severity 2 | Submitted |
| USA-B4-003 | B4 My Registrations / Ticket | "Change Password" required fields carry no visible required-field indicator | Nielsen severity 1 | Submitted |
| BUG-B4-005 | B4 My Registrations / Ticket | Avatar upload accepts a non-image file with no error message | Major | Submitted |
| BUG-B4-006 | B4 My Registrations / Ticket | Whitespace-only search query is treated as valid input, not empty | Minor | Submitted |
| BUG-B4-007 | B4 My Registrations / Ticket | "Confirm Password" validation error names the wrong field | Major | Submitted |
| USA-B4-004 | B4 My Registrations / Ticket | Long activity title is clipped to one line with no way to recover the hidden text | Nielsen severity 1 | Submitted |
| BUG-B4-008 | B4 My Registrations / Ticket | Browser Back from an activity's event-detail page loses the active search query and list scroll position | Major | Submitted |
| BUG-B4-009 | B4 My Registrations / Ticket | Avatar-upload control is not reachable via keyboard | Major | Submitted |
| BUG-B4-010 | B4 My Registrations / Ticket | "Edit Profile" save gives no visible feedback on success | Minor | Submitted |
| BUG-B4-011 | B4 My Registrations / Ticket | "Filters" disclosure button never exposes its expanded state to assistive tech | Minor | Submitted |
| BUG-B4-012 | B4 My Registrations / Ticket | "Edit Profile" save confirmation is not announced to assistive tech | Minor | Submitted |

---

## 5. AI Critique (200–300 words)

Even with a detailed, fully-scoped prompt, the AI still failed in two opposite directions on Task 1A.

It under-delivered on breadth: `gui-checklist.prompt.md` pasted all six per-control checklists in full (Text Box, Date, Dropdown/Combo, Checkbox/Radio, Hyperlink/Image/Grid/List, Input-field validation), but the draft only cited 3 of 6. Dropdown/Combo and Checkbox/Radio went completely unused, despite Checkbox/Radio being the exact control behind EMS's registration role picker. The same pattern hit the ISTQB 12-item form checklist: only 5 of 12 items survived into the draft. Complete source material did not produce complete source usage; the model kept whatever recurs most often in generic checklist writing and silently dropped the rest, with no signal that anything was cut.

It over-delivered on scope: 4 draft items had to be removed during review, not because they were wrong facts, but because they tested things a rendered screen cannot answer, such as a user's subjective read of icon conventions, whether a submit flow has a review step, or a duplicate rule restated under a second interface aspect. The AI does not reliably know where "GUI defect" stops and "flow design" or "user perception" begins unless the prompt draws that line explicitly.

Neither failure was random; both were consistent across a re-run, which points to the actual principle: a capable agent is not the same as a stable one. For a repeatable task governed by a fixed spec, the bottleneck is not the model's raw capability but how precisely the guideline constrains it. Every implicit boundary left unstated becomes either a silent omission or an unwanted addition, and writing that boundary down explicitly, once, is cheaper than catching it after the fact on every run.

---

## 6. References

- ISTQB Foundation Level Syllabus (latest edition).
- Nielsen, J. _10 Usability Heuristics for User Interface Design._
- Norman, D. _The Design of Everyday Things_ (6 principles).
- Shneiderman, B. _Eight Golden Rules of Interface Design._
- Course slides: _GUI + Usability + Compatibility Testing (AI-First, Combined)._
- BrowserStack / LambdaTest documentation — cross-browser & cross-platform testing.
- Hardman, P. (2025). _A Post-AI Learning Taxonomy._
