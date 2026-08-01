# Verification techniques by item pattern

`gui-checklist.md` items are heuristic-based judgment calls, not literal DOM
assertions. Match the item's control class to a technique below instead of
eyeballing it.

| Item pattern | How to verify |
| ------------ | ------------- |
| Consistency / terminology / visual hierarchy (IA-01-01, -02, -10) | Compare the same control across 2+ screens via snapshot/screenshot |
| Contrast (WCAG 1.4.3 / 1.4.11) | Crop-screenshot the element and sample the rendered pixel color from the PNG — see `gotchas.md`, `getComputedStyle` can return `lab()`/`oklch()` on this SUT and an rgb-regex misreads it. Record the actual ratio in Notes, not just "low contrast" |
| Accessible name (WCAG 1.1.1 / 4.1.2) | `playwright-cli snapshot` — icon-only controls with no name/label in the a11y tree are Failed. A named control reads `button "Save"` in the tree; an unnamed one reads bare `button [ref=...]:` with only a child `img`/`svg` line — that textual absence in the tree *is* the evidence, no further tool needed |
| Programmatic state on custom controls (WCAG 4.1.2 Name/Role/Value — toggle/tab/switch look-alikes built from `<div>`/`<button>`, not native `<input type=checkbox/radio>` or ARIA widgets) | The visual "selected" look (filled color, bold text) is not proof either way. Confirm via `--raw eval`: `[...document.querySelectorAll('button')].map(b => ({text: b.textContent.trim(), role: b.getAttribute('role'), pressed: b.getAttribute('aria-pressed'), selected: b.getAttribute('aria-selected')}))` — Failed if the currently-active-looking one still reports `null`/`null`/`null` same as the inactive ones. Cross-check against the `playwright-cli snapshot` tree too: a properly wired toggle shows `[pressed]` or `[selected]` next to the active item's name; if none of the group shows it, that confirms the miss |
| Status messages / live regions (WCAG 4.1.3) | Trigger the action, then run a page-wide scan, not just near the element — the announcing region can live anywhere in the DOM: `--raw eval "() => ({live: document.querySelectorAll('[aria-live]').length, status: document.querySelectorAll('[role=status],[role=alert]').length, stringPresent: document.body.innerHTML.includes('aria-live')})"`. All three zero/false = Failed. Also snapshot the element itself before/after the action to prove the state genuinely changed (e.g. label/`aria-label` flips) — that rules out "nothing happened" as an alternate explanation for the missing announcement |
| Focus visible / order (WCAG 2.4.7 / 2.4.3 / 2.1.1 / 2.1.2) | `playwright-cli press Tab` repeatedly, snapshot/screenshot each stop, confirm a visible outline, logical order, and no trap in dialogs |
| Loading / empty state (IA-01-04, -05) | Trigger the state directly (zero-match search; `route` to delay/mock a slow response) and observe |
| i18n completeness (IA-01-14..17) | Toggle the language switch, snapshot both states, diff visible strings for anything untranslated or truncated |
| Form validation (IA-02-*) | Submit empty/invalid values via `fill` + `click`, observe error placement, focus target, and message wording |
| Toast / feedback / real-time update (IA-04-*) | Trigger the action, snapshot before and after, confirm the message/update appears without a manual reload |
| Keyboard-only operability | Do the whole flow using only `press Tab` / `press Enter` / `press Space` / `press Escape` — no `click` |

`agent-browser` covers the same operations if `playwright-cli` isn't available
or the user asks for it explicitly. Load `agent-browser skills get core`
before switching tools mid-run — its ref/snapshot format differs from
playwright-cli's, don't mix the two in one run.

---

## Evidence for non-visual (ARIA/WCAG 4.x) items

This is a distinct requirement from the screenshot rule above, not an
alternative to it. It applies whenever the item's source cites WCAG 4.1.2
(Name, Role, Value), 4.1.3 (Status Messages), or any other criterion whose
pass/fail condition is a DOM attribute rather than something rendered.

**Why:** a screenshot can only show what a sighted user sees. `aria-label`,
`aria-pressed`, `aria-selected`, `role`, and `aria-live` have zero visual
signature — a button looks identical whether or not it has an accessible
name. Screenshotting it proves *where the control is*, never *what's wrong
with it*. This is not a theoretical concern — see
`docs/istqb/ch4_design.md`'s own 12-item form checklist, item 12 ("screen
reader compatibility"): the course explicitly puts accessibility inside
checklist-based GUI testing, so these items are in scope, but their
verification method has to be the accessibility tree/DOM, not the naked eye.

**What to capture, for every Failed item in this category:**

1. The `playwright-cli snapshot` excerpt for the affected element(s) —
   showing the accessibility-tree name (or its absence) in context, ideally
   next to a sibling control that *does* expose the attribute correctly, so
   the contrast is visible in the excerpt itself.
2. A targeted `--raw eval` attribute dump (`outerHTML` or a `{role,
   ariaPressed, ariaSelected, ...}` object) confirming the specific
   attribute is `null`/absent — the technique rows above give the exact
   query per pattern.
3. Both go into the `findings-log.md` row's Defect cell (or a linked note)
   **and** into the promoted `FINDINGS_LOG.md` detailed entry, as a `**DOM /
   accessibility-tree evidence**` subsection placed after `**Evidence**`
   (the screenshot line). Label the screenshot line itself as
   "visual location/context only" so a reviewer doesn't mistake it for the
   proof. See `BUG-B1-003`/`BUG-B1-006`/`BUG-B1-007` in the root
   `FINDINGS_LOG.md` for the exact format to replicate.

Don't skip step 2 even when step 1's snapshot already looks damning — the
snapshot line format (bare `button [ref=...]` vs `button "name"`) is
Playwright's own accessibility-tree summary, but the raw attribute dump is
what ties the finding to a specific, quotable line of markup a grader can
verify independently.
