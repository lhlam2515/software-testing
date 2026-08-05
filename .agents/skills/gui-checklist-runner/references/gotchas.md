# Gotchas

### Notes are mandatory for Failed and N/A, never a restatement

A Notes cell like "does not pass" or a copy of the item text is not
acceptable — per the checklist's own Rules section. For Failed, state the
concrete defect (what was seen, ideally with a measured value like a contrast
ratio). For N/A, name the missing control class explicitly (e.g. "no
drag-and-drop reorder control on this screen").

### Don't batch rows or findings

Write the Run-table row and, if applicable, the findings-log row right after
judging each item — same discipline as `fr-execution`. Batching at the end of
a cluster risks losing the concrete defect detail while it's fresh.

### Viewport screenshot, not full-page

This skill's screenshot convention is the opposite of `fr-execution`'s
full-page rule. Full-page would include content below the fold that the item
under test may have nothing to do with; a viewport shot matches what a real
user would see. Don't reuse `--full-page` here unless the item explicitly
concerns scroll/reflow behavior (e.g. WCAG 1.4.10 Reflow at 320px).

### Keep the same viewport size for the whole run

Resizing mid-run invalidates comparisons for consistency-type items (IA-01-01,
-02, -10, -13) and any layout/reflow findings. Set it once at the start of
Phase 1 and don't change it until the whole checklist is done for this screen.

### Contrast: getComputedStyle may not return rgb()

On this SUT, `getComputedStyle(el).color` can return `lab(...)` or
`oklch(...)` instead of `rgb(...)` in modern Chromium — an rgb-regex parse of
it silently fails or gives a wrong ratio. Don't parse the computed-style
string for contrast checks. Instead, crop-screenshot the element and sample
the actual rendered pixel color from the PNG — that's the true displayed
color regardless of what color space the browser reports internally. Use the
sampled RGB values to compute the WCAG ratio, and record the ratio (not just
"low contrast") in the Failed row's Notes.

### Cross-screen items

A few checklist items can't be verified from one screen alone — e.g. IA-03-05
(back/return preserves the prior screen's filter and scroll position) and
IA-04-07 (focus lands correctly after a state change triggered elsewhere)
require observing a transition between two screens. This skill runs one
screen's `checklist-run.md` at a time, so for these items: perform the actual
cross-screen transition during the run, judge the verdict based on what
happens on arrival, and note in the Notes column which second screen was
involved (e.g. "verified via B1 -> B2 back-navigation"). Don't mark these N/A
just because the primary control isn't on this screen — the item genuinely
applies here, it just needs a hop to the other screen to exercise it.

### Verdict model is intentionally Passed/Failed/N/A, not Yes/No/N/A+severity

The course's own S13 slide checklist model uses Yes/No/N/A plus a
priority/severity rating per item. `gui-checklist.md` deliberately narrows
this to a binary Passed/Failed/N/A per its own Rules section — this is a
settled group design decision from Task 1A, not a gap to silently patch
during execution. Do not add severity ratings or extra verdict values to the
Run table to better match the slide model. Severity only enters the workflow
later, per-defect, in `findings-log.md` and the promoted `FINDINGS_LOG.md`
entry (which already has a Severity column) — never as a 4th
`checklist-run.md` verdict option.

### The SUT may gate previously-public screens behind login

The EMS deployment has changed mid-project before: a redeploy started
redirecting every route, including previously public ones like `/` and
`/events`, to `/login`. Don't assume a screen reachable without auth today
stays that way — do a quick unauthenticated `playwright-cli open <url>` first;
if it redirects to `/login`, register or log in with a guest/student account
before proceeding, and record that in the `checklist-run.md` header's
"Account / role used" field even for screens that are nominally public.

### Template gotcha in checklist-run.md

The blank template's example Run-table row has extra trailing `|` cells (7
instead of 5). Ignore that — write real rows with exactly 5 columns:
`Checklist ID | Verdict | Notes | Screenshot | Finding ID`.

### Don't fake a loading state (IA-01-05) with a `page.route()` delay

A `page.route()` handler that awaits a raw `setTimeout` Promise throws
(`setTimeout` is undefined in that execution context) without ever calling
`route.continue()`/`route.fulfill()` — the request hangs forever and the
whole page gets stuck "loading", breaking every `eval`/`snapshot`/`click`
after it until you `playwright-cli close` and reopen (re-login included).
See [playwright-cli's troubleshooting.md](../../playwright-cli/references/troubleshooting.md)
for the fix and for a route-free alternative (race a reload against an
immediate screenshot) that can't hang the session.

### Icon classes are reused across unrelated controls — don't trust a bare CSS-class selector

This SUT reuses the same lucide icon class (e.g. `svg.lucide-chevron-left`)
on completely unrelated controls — a sidebar "Collapse categories" button
*and* the pagination "previous page" button both render a chevron-left icon
with that exact class. `document.querySelector('svg.lucide-chevron-left')`
silently grabs whichever one appears first in the DOM, which is not
necessarily the one under test — in this case it returned the sidebar
button (which *does* have a correct `aria-label`), producing a false
"Passed" reading for a pagination button that actually has none. Always
`querySelectorAll` (plural), inspect the full match list, and pick the
element by a scoping signal that's actually unique to the item under test
(nearby text like "Rows per page", the parent's test region, or the
specific event handler/href) — never assume a class-based icon selector
returns a unique element on this SUT.

### Native `<input type="date">` already blocks invalid dates (IA-02-07)

If the date filter/field under test is a real `<input type="date">`, the
browser itself rejects an out-of-range day/month combination — a Playwright
`fill()` with e.g. `02/30/2026` throws `Error: Malformed value` before the
value ever reaches the app. That thrown error *is* the evidence for a
Passed verdict (native browser guarantees the behavior); no app-level
validation exists to test separately. Don't mistake the fill error for a
tooling problem — it only means the control does its job.
