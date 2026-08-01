# Verification techniques by item pattern

`gui-checklist.md` items are heuristic-based judgment calls, not literal DOM
assertions. Match the item's control class to a technique below instead of
eyeballing it.

| Item pattern | How to verify |
| ------------ | ------------- |
| Consistency / terminology / visual hierarchy (IA-01-01, -02, -10) | Compare the same control across 2+ screens via snapshot/screenshot |
| Contrast (WCAG 1.4.3 / 1.4.11) | Crop-screenshot the element and sample the rendered pixel color from the PNG — see `gotchas.md`, `getComputedStyle` can return `lab()`/`oklch()` on this SUT and an rgb-regex misreads it. Record the actual ratio in Notes, not just "low contrast" |
| Accessible name (WCAG 1.1.1 / 4.1.2) | `playwright-cli snapshot` — icon-only controls with no name/label in the a11y tree are Failed |
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
