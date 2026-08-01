---
name: gui-checklist-runner
description: >
  Trigger whenever the user says "run gui checklist", "run the checklist on
  screen X", "execute gui-checklist", "chạy checklist GUI", "chạy
  gui-checklist trên màn hình X", "checklist run cho B<n>", "thực thi
  checklist trên [screen]", or otherwise asks to execute
  homeworks/HW03/group/gui-checklist.md end-to-end against a named SUT screen
  (HW03 Task 1B). Do not trigger for editing the shared checklist itself
  (Task 1A) — that's out of scope for this skill.
---

# GUI Checklist Runner — Task 1B Execution

**Tools:** `playwright-cli` (default) or `agent-browser`
**Output:** filled `checklist-run.md` + `findings-log.md` + `screenshots/`, per screen

Do not edit `gui-checklist.md` (shared Task 1A artifact) from this skill —
flag issues in `findings-log.md` instead. Read `references/gotchas.md` before
a first run on a screen; it covers known pitfalls (contrast measurement,
cross-screen items, the verdict model, SUT login gate).

---

## Phase 0 — Setup

1. **Confirm SUT + screen** with the user if unclear: SUT URL (default
   `https://prod-dev.ems-fitus.cloud/`), screen folder under
   `homeworks/HW03/artifacts/screens/<screen-id>/` (create it + `screenshots/`
   if missing), account/role (pull from memory — never write passwords into
   `checklist-run.md`), browser/viewport.
   ```bash
   mkdir -p "homeworks/HW03/artifacts/screens/<screen-id>/screenshots"
   ```
2. **Load** `homeworks/HW03/group/gui-checklist.md` in full — the
   authoritative, ordered item list across `IA-01 -> IA-04`. Don't skip or
   reorder items.
3. **Create or resume `checklist-run.md`** from the existing template shape
   (see `artifacts/screens/B1-home-event-list/checklist-run.md`). Fill the
   header table: URL, account/role, browser/OS/viewport, run date, and
   checklist version (`git log -1 --format=%h -- homeworks/HW03/group/gui-checklist.md`).
   If rows already exist, resume — don't overwrite. Create the screen's
   `findings-log.md` too if missing (format in Phase 1).

---

## Phase 1 — Per-cluster execution loop

Finish one cluster fully before starting the next: `IA-01 -> IA-02 -> IA-03 -> IA-04`.

1. **Open the browser, fix the viewport for the whole run:**
   ```bash
   playwright-cli open <SUT URL>
   playwright-cli resize 1920 1080
   ```
2. **Per item, in ID order:** read the item + source, verify it live (use
   `playwright-cli snapshot` for accessible names/roles/state — see
   `references/verification-techniques.md` for the technique per item
   pattern), decide **Passed / Failed / N/A**.
3. **If Failed:** take a viewport screenshot (not full-page) of the affected
   region:
   ```bash
   playwright-cli screenshot --filename="homeworks/HW03/artifacts/screens/<screen-id>/screenshots/<CHECKLIST-ID>-<slug>.png"
   ```
   **If the item's source is WCAG 4.1.2 (Name/Role/Value) or 4.1.3 (Status
   Messages)** — or any other criterion whose pass/fail hinges on a DOM
   attribute rather than something rendered — the screenshot only proves
   *where* the control is, not *what's wrong with it*: `aria-label`,
   `aria-pressed`, `aria-live`, etc. have no visual signature. Also capture a
   DOM/accessibility-tree evidence snippet (accessibility-tree excerpt +
   attribute dump via `--raw eval`) per `references/verification-techniques.md`
   § "Evidence for non-visual (ARIA/WCAG 4.x) items" — this is what actually
   proves the defect, the screenshot stays as location context only.
4. **Write the row immediately** (don't batch), exactly 5 columns:
   `| <ID> | Passed\|Failed\|N/A | <notes — mandatory for Failed/N/A> | <screenshot or empty> | <Finding ID or empty> |`
5. **If it's a real defect**, append a row to `findings-log.md` immediately:
   ```markdown
   | Checklist ID | Defect | Screenshot | Severity guess | Promoted? |
   | ------------ | ------ | ---------- | --------------- | --------- |
   | IA-01-06 | Body text #999 on #fff, ~2.8:1 contrast, fails 4.5:1 | screenshots/IA-01-06-contrast-detail.png | Minor | No |
   ```
   This is a per-screen draft, separate from the root `FINDINGS_LOG.md` —
   Finding IDs and Google Form submission happen at promotion time (Phase 4).

---

## Phase 2 — Cluster verification

After finishing a cluster, confirm full coverage before moving on:

```bash
bash .agents/skills/gui-checklist-runner/scripts/verify-coverage.sh \
  homeworks/HW03/group/gui-checklist.md \
  homeworks/HW03/artifacts/screens/<screen-id>/checklist-run.md IA-01
```

Exit 0 ("OK") = cluster complete, move on. Exit 1 = run exactly the listed
missing IDs (Phase 1, Step 2), then re-check. Don't proceed with gaps.

---

## Phase 3 — Repeat

Repeat Phase 1 + Phase 2 for `IA-02`, `IA-03`, `IA-04`.

---

## Phase 4 — Finalize

1. Fill the Result summary table in `checklist-run.md` — compute from the
   completed Run table, don't estimate.
2. Run `verify-coverage.sh` for all four clusters as a final gate.
3. Promote every `findings-log.md` row to `FINDINGS_LOG.md` (root): assign a
   `BUG-B<n>-NNN` / `USA-B<n>-NNN` ID per its Reporting rule, add the detailed
   entry, back-fill the Finding ID into the matching `checklist-run.md` row,
   mark `findings-log.md`'s `Promoted? = Yes`. For any finding sourced from
   WCAG 4.1.2/4.1.3 (or otherwise non-visual), carry the DOM/accessibility-tree
   evidence captured in Phase 1 into the detailed entry as a `**DOM /
   accessibility-tree evidence**` subsection after `**Evidence**` — don't let
   it get dropped at promotion time, it's the actual proof, the screenshot
   line is context only. Google Form submission stays with the user (out of
   this skill's scope) — flag which findings still need it.
4. Stage the screen's artifacts and hand off to the `commit` skill:
   ```bash
   git add "homeworks/HW03/artifacts/screens/<screen-id>/checklist-run.md" \
           "homeworks/HW03/artifacts/screens/<screen-id>/findings-log.md" \
           "homeworks/HW03/artifacts/screens/<screen-id>/screenshots/"
   ```

---

## References

- `references/gotchas.md` — known pitfalls: contrast measurement, cross-screen
  items, why the verdict model is intentionally Passed/Failed/N/A, SUT login
  gate, checklist-run.md template quirk, reused-icon-class false matches.
- `references/verification-techniques.md` — how to verify each checklist item
  pattern (contrast, accessible name, ARIA state, live regions, keyboard,
  i18n, form validation, feedback/toast) with concrete commands, plus the
  DOM/accessibility-tree evidence requirement for non-visual (WCAG 4.x) items.
