# GUI Checklist — Round 1 Prompt (Task 1A, Draft Generation)

**Purpose:** paste the block inside `<prompt>` verbatim into the chosen AI tool as the **first** prompt for generating the shared GUI checklist draft. Do not edit it ad hoc mid-conversation — if you need to change scope, revise this file, log the change, and start a fresh Round 1.

**Status:** ✅ SUT back online as of 2026-07-28 at `https://prod-dev.ems-fitus.cloud/` (redeployed on stable infra, replacing the old ngrok tunnel). This prompt is deliberately scenario/pool-agnostic (see Design notes below), so it runs from the written spec (REQUIREMENTS.md §4) rather than screenshots of one pool's screens. See "Known gaps" at the bottom before you run this.

**After running it:** paste the tool name, exact timestamp, this prompt, and the verbatim output into [checklist-prompts.md](checklist-prompts.md) (Round 1 entry) and [../prompt_log.md](../prompt_log.md). Do not paraphrase the output when logging it.

---

## Design notes (why this prompt is shaped this way — not part of what you paste)

- **Single first prompt, not one-shot-for-everything.** This asks for a full draft across all 4 IA in one pass because that matches the "Round 1 — Initial generation" slot already scaffolded in `checklist-prompts.md`. Refinement (EMS-specific pass once screenshots exist, gap-fill pass) happens in later rounds, not here.
- **Includes WCAG 2.2 (Level AA) as a named source; still omits i18n EN/VI, dark mode, RTL.** Earlier draft of this prompt deliberately left WCAG out to manufacture an "AI missed accessibility" gap for §6's gap-analysis exercise. Decision reversed on 2026-07-28: WCAG is now requested directly so the checklist gets real accessibility coverage instead of a token gap-filling exercise. The remaining omissions (i18n EN/VI, dark mode, RTL) still work as `PROMPT`-cause gaps for §6 — add those as `Human` items during review, do not fold them into this prompt.
- **No cross-browser/compatibility items requested.** That's Task 3's job on a different matrix; asking for it here would blur scope and dilute the >40-item budget with items that don't belong in this artifact.
- **Grounded in the exact course vocabulary** (S13 slide's checklist/navigation taxonomy, the per-control checklists, the ISTQB 12-item form checklist) so the "Heuristic / Source" column can cite something the TA already taught, not just external HCI literature the AI free-associates into existence.
- **Deliberately scenario/pool-agnostic.** Task 1A is one checklist shared by the whole group; each member later executes it against a *different* scenario's screens in Task 1B (Scenario A/B/C/D, REQUIREMENTS.md §5). An earlier draft grounded every item in Scenario B's B1–B4 screens specifically, which made items meaningless for whoever picked A/C/D. Reversed on 2026-07-28: `<ems_context>` now describes all four pools plus the generic UI-control classes recurring across them, and every item must ground in a control class (e.g. "a status-dependent primary action button"), not a project-specific screen ID.

---

<prompt>

<role>
You are acting as a senior QA reviewer designing a reusable GUI checklist for a university software-testing course assignment. The checklist will be executed by hand against live screens later — every item you write must be something a human tester can mark Passed or Failed on sight, with no ambiguity about what "pass" means.
</role>

<assignment_context>
This checklist is Task 1A of a graded assignment ("HW03 — GUI & Usability Testing on EMS"). It is a **group deliverable**: one checklist, shared by the whole group, later executed individually by each member on their own scenario's screens.

Hard requirements from the assignment brief (do not deviate from these):
- Must cover exactly four interface aspects, defined below. Do not invent a fifth category or rename these.
- Target: more than 40 items total across the four aspects combined.
- Every item must be independently verifiable on a screen with a binary Passed/Failed verdict. Reject vague criteria like "looks good," "feels intuitive," or "should be user-friendly."
- Every item must cite the specific source it comes from (a named heuristic number, a named course-slide concept, or "EMS-specific" if it doesn't map to any external source).

The four interface aspects (IA), verbatim from the assignment:
- **IA-01: General UI standards** — layout, alignment, typography, colour, consistency, i18n EN/VI, empty/loading states.
- **IA-02: Forms** — labels, validation, error placement, required-field handling, uploads, rich-text editor.
- **IA-03: Navigation** — menus, breadcrumbs, tabs, sidebar, drag-and-drop reorder, back/return actions, deep links.
- **IA-04: Feedback / state** — toasts, badges, confirmation dialogs, progress bars, status colours, real-time updates.
</assignment_context>

<course_references>
Use these as your primary source material — cite them by name in the Heuristic/Source column wherever an item derives from one of them. Do not invent citations to sources not listed here.

**Nielsen's 10 Usability Heuristics** (cite as "Nielsen #n — <name>"):
1. Visibility of system status
2. Match between system and the real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, and recover from errors
10. Help and documentation

**Norman's 6 Principles of Interaction Design** (*The Design of Everyday Things*; cite as "Norman — <name>"):
Affordances, Signifiers, Constraints, Mappings, Feedback, Consistency.

**Shneiderman's Eight Golden Rules** (cite as "Shneiderman #n — <name>"):
1. Strive for consistency
2. Enable frequent users to use shortcuts
3. Offer informative feedback
4. Design dialogs to yield closure
5. Offer error prevention and simple error handling
6. Permit easy reversal of actions
7. Support internal locus of control
8. Reduce short-term memory load

**Course slide S13 — GUI Testing & Usability Testing, "Low-Level — Checklist Testing"** (cite as "S13 Checklist"):
GUI standards, Application standards, Color scheme, Typography, Layout and alignment, Labels, Error messages.

**Course slide S13 — "Low-Level — Navigation Testing"** (cite as "S13 Navigation"):
Main menu navigation (all sections reachable), breadcrumb navigation (accurately reflects path, allows backtracking), links and buttons (lead to expected screens/actions), form navigation (logical field order, validation messages appear in correct location).

**Course slide S13 — "Common GUI Bugs"** (cite as "S13 Bugs"), used as failure-pattern seeds for IA-02/IA-04:
Data validation gaps; incorrect field defaults; mandatory fields not marked as mandatory; menu options not aligned with data/application state; control state not aligned with underlying data state; focus not placed on the object that needs it.

**Course slide — Per-Control Checklists** (Waghmare, 2009, via the course's combined GUI-testing deck; cite as "Per-Control — <control>", e.g. "Per-Control — Text Box"):
- Text Box: enable/disable per spec; red asterisk on mandatory fields; stops at max width; rejects spaces-only input; correct label with alignment consistent to siblings; scrollbar shown when content exceeds the box.
- Dropdown / Combo Box: arrow shown with a default or blank value; rejects values outside the list; list is non-empty with a scrollbar for long lists; typing the first letter selects the matching item; sorted alphabetically by default, names not truncated.
- Button: enable/disable state and reachable via Tab in order; one default button (thick border) fires on Enter, Cancel fires on Esc; label meaningful and not abbreviated, "…" shown if it opens another screen; an uncorrectable action prompts a Yes/No confirmation; all buttons share consistent size, shape and font.
- Checkbox & Radio button: correct default checked/unchecked state; Tab selects in series and Mouse/Space/Enter/Alt+letter all toggle; only one radio option selectable per group; alignment proper.
- Hyperlink / Image / Grid / List / Date: hyperlink uses standard colour and underline, opens on click/Enter/Ctrl+click and goes to the correct page; image is not blurred, correctly sized, not broken; grid header click sorts ascending/descending; date field rejects invalid day/month combinations (e.g. Feb 30) and handles leap years.
- Input-field validation: every failed rule shows a sensible message and returns focus to the offending field with it highlighted; mandatory fields align with the DB NOT NULL constraint and show an asterisk; character limit matches the DB column size.

**WCAG 2.2, Level AA** (W3C Web Content Accessibility Guidelines; cite as "WCAG 2.2 AA — SC <number> <name>"), grouped by the four POUR principles — pull from this list only, do not cite a Success Criterion not named here:
- Perceivable: SC 1.1.1 Non-text Content (alt text on icons/QR/images); SC 1.4.1 Use of Color (status never conveyed by color alone); SC 1.4.3 Contrast (Minimum, text ≥ 4.5:1); SC 1.4.10 Reflow (no horizontal scroll at 320px); SC 1.4.11 Non-text Contrast (icons/controls ≥ 3:1).
- Operable: SC 2.1.1 Keyboard (all functionality operable without a mouse); SC 2.1.2 No Keyboard Trap; SC 2.4.3 Focus Order; SC 2.4.4 Link Purpose (In Context); SC 2.4.7 Focus Visible.
- Understandable: SC 3.2.3 Consistent Navigation; SC 3.3.1 Error Identification (text, not color alone); SC 3.3.2 Labels or Instructions; SC 3.3.3 Error Suggestion; SC 3.3.4 Error Prevention (Legal, Financial, Data) — applies to the registration confirmation step.
- Robust: SC 4.1.2 Name, Role, Value (custom controls expose accessible name/role); SC 4.1.3 Status Messages (toasts/loading states announced without a forced focus change).

**ISTQB CTFL — Checklist-based testing** (cite as "ISTQB Checklist"), including the syllabus's own 12-item example checklist for any form: tab order correctness, Enter-to-submit where appropriate, required fields marked with * and validated, error message placed near the failing field, Reset/Cancel clears all input, double-submit does not create duplicate records, disabled state visibly distinct, loading state shown during submit, long text does not break layout, validation timing (real-time vs on-submit) is consistent, form usable on mobile (touch/keyboard), screen-reader compatibility.
</course_references>

<ems_context>
System under test: **EMS (Event Management System)** — a web app for a university's Faculty of Information Technology to create, publish, and run academic events, covering both the admin side and the participant side. Live at `https://prod-dev.ems-fitus.cloud/`; data may reset periodically, so do not assume a prior state persists.

This checklist is **not scoped to one function group**. It is a single shared artifact that different group members will later run against different scenarios (Task 1B), so it must read as generic across all four functional pools below — do not write an item that only makes sense on one pool's screen unless the underlying control class plausibly recurs elsewhere.

**The four functional pools** (each group member owns one for their individual execution; this prompt does not target any single one of them):
- **Pool A — Event administration**: dashboard KPIs; events list; add/edit event (thumbnail/banner upload, rich-text content, date/time validation); registration configuration (role toggles, max slots, waitlist); draft/publish/preview/delete; participants & reviews approval; check-in.
- **Pool B — Participant experience**: public event browsing with a featured-event carousel, category/search filter; event detail with a register button and waitlist notice; registration form (role selection, confirmation); My Registrations with a barcode/QR ticket; post-event star review.
- **Pool C — User administration**: users list (avatar, role, member code, active/audit columns); assign role; block/unblock and reset-password dialogs; export to Excel; audit log.
- **Pool D — Support requests**: user creates a request with an image attachment, tracks it in My Requests; admin side has a Pending/Resolved list, request detail with an image lightbox, internal note, and official response.

**Generic UI-control classes recurring across all four pools** — ground every item in one of these instead of a specific screen ID:
- Data lists with filters, search, and sortable columns.
- Multi-field forms with an image/file upload and rich-text or long-text input.
- Detail/preview pages with a status-dependent primary action button (e.g. register / publish / resolve).
- Confirmation dialogs guarding a destructive or uncorrectable action (delete, block, reset password).
- Status badges / colour-coded states (waitlist, pending/resolved, active/blocked).
- Toast/progress feedback for an asynchronous action (upload, export, check-in scan, submit).
- Tabs separating a list into named states (Draft/Published, Pending/Resolved).

Where an item would depend on exact visual detail no one has verified yet (precise colour values, spacing, exact copy text), write it generically (e.g. "the status badge uses a visually distinct colour from the default state" rather than guessing a hex code or exact wording). Do not invent specific UI copy, button labels, or layout details beyond what is given above.
</ems_context>

<output_format>
Output one Markdown table per interface aspect, in this exact column order, matching the existing checklist file so it can be pasted in directly:

| ID | Checklist item | Heuristic / Source | Origin (AI \| Human) | Notes |
| -- | -------------- | ------------------- | --------------------- | ----- |

- ID convention: `IA-01-01`, `IA-01-02`, … per aspect, zero-padded two digits, restarting at 01 for each aspect.
- Origin column: every row you generate is `AI` (a human will change some to `Human` later — do not pre-guess which).
- Notes column: leave blank unless the item needs a `[VERIFY]` flag because a member's actual screen may render the control class differently than described in `<ems_context>`.
- Target count per aspect: IA-01 ≥ 12, IA-02 ≥ 12, IA-03 ≥ 10, IA-04 ≥ 10 (44 total minimum — this gives headroom above the 40-item requirement once some items are merged or cut during human review).
- Within each aspect's total, include at least 3 items sourced from WCAG 2.2 AA (so across all four aspects there are ≥ 12 WCAG-sourced items) — spread across Perceivable/Operable/Understandable/Robust, not clustered on one principle.
- Every item must ground itself in one of the generic UI-control classes named in `<ems_context>` (e.g. "on a multi-field form with an image upload," "on a status-dependent primary action button," "on a data list with filters") — never in a project-specific screen ID or pool name (no "B1," "the Check-in tab," "Pool D"). This is what makes the checklist executable unmodified against whichever pool (A/B/C/D) each member picks in Task 1B.
</output_format>

<constraints>
- No item about cross-browser rendering, responsive breakpoints, OS/device compatibility, or browser-specific behavior — that is out of scope for this checklist (covered separately elsewhere).
- WCAG items must cite one of the Success Criteria listed in <course_references>, phrased against a generic UI-control class from <ems_context> exactly like every other item — no generic "site should be accessible" items.
- No item about i18n EN/VI switching, right-to-left layout, or dark mode — these stay out of scope for this checklist (added by hand later as `Human`/`PROMPT` gap items).
- No item that is really a functional/business-logic test (e.g., "registration actually saves to the database") rather than a GUI/interaction check — this checklist is interface-level, not functional-correctness-level.
- No item scoped to a single pool's screen name or ID (no "B1," "Pool A's dashboard," "the Check-in tab") — every item must be phrased against a generic control class so it applies unmodified to any of the four pools.
- Every item must be traceable to one named source in <course_references>, or explicitly marked "EMS-specific" if it comes purely from the pools/control classes in <ems_context>.
- Before outputting, review your own draft against these constraints and drop or rewrite any item that violates one of them, rather than leaving it in for me to catch.
</constraints>

<examples>
Format reference only — do not reuse these two items verbatim in your output, they are illustrations of the expected specificity level, not itself part of the 44+ items.

<example>
| ID | Checklist item | Heuristic / Source | Origin (AI \| Human) | Notes |
| -- | -------------- | ------------------- | --------------------- | ----- |
| IA-02-EX | On a multi-field form, a required field is visually marked (e.g. asterisk or label) and the form blocks submission with a visible error if left unfilled. | ISTQB Checklist (item 3) | AI | |
</example>

<example>
| ID | Checklist item | Heuristic / Source | Origin (AI \| Human) | Notes |
| -- | -------------- | ------------------- | --------------------- | ----- |
| IA-04-EX | On a detail page with a status-dependent primary action button, the button's visible state (enabled / disabled / alternate label) reflects the underlying data state without requiring a page reload. | S13 Bugs (control state alignment with data state) | AI | |
</example>

<example>
| ID | Checklist item | Heuristic / Source | Origin (AI \| Human) | Notes |
| -- | -------------- | ------------------- | --------------------- | ----- |
| IA-02-EX2 | On a multi-field form, the failed-validation message for a required field is shown as visible text next to the field, not conveyed by border color alone. | WCAG 2.2 AA — SC 1.4.1 Use of Color | AI | |
</example>
</examples>

<task>
Generate the full checklist now: four Markdown tables, one per IA aspect, following <output_format> exactly, respecting every rule in <constraints>, drawing sources only from <course_references>, and grounding every item in the pools and generic UI-control classes given in <ems_context>. Do not add any category, pool, screen ID, or source not defined above. Do not include any preamble or summary — output the four tables directly, in order IA-01, IA-02, IA-03, IA-04.
</task>

</prompt>

---

## Known gaps — cần bạn cung cấp thêm trước khi chạy hoặc trước Round 2

1. ~~Xác nhận AI tool cụ thể sẽ dùng~~ — **Đã xác nhận: Claude Code, Sonnet 5.** Ghi thông tin này vào `checklist-prompts.md` và `../prompt_log.md` khi chạy Round 1 (Tool = "Claude Code (Sonnet 5)").
2. **REF-05 trong references.md** — đã chốt thành `WCAG 2.2, Level AA` (prompt giờ chủ động yêu cầu WCAG, không còn là gap để thêm tay sau). i18n EN/VI, dark mode, RTL vẫn bị loại khỏi prompt — đó là gap còn lại để thêm `Human`/cause `PROMPT` ở vòng review.
3. ~~Xác nhận non-overlap với nhóm~~ — **Đã xác nhận, không overlap.** Cập nhật tương ứng trong `../README.md`.
4. **Prompt này giờ scenario/pool-agnostic** (2026-07-28) — không còn cần screenshot hay URL của B1–B4 để chạy Round 1. Việc khảo sát screenshot/URL thật của các screen trong scenario riêng (B1–B4, hoặc scenario mà thành viên khác chọn) là phạm vi **Task 1B cá nhân**, không phải của checklist chung này — track ở `../README.md` (mục "Screens Under Test"), không ở đây.
