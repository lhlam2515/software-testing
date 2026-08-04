# AI Audit Report · HW03

---

## 1. Student Information

| Field                   | Value                               |
| ----------------------- | ----------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                        |
| Student ID:             | 23127216                            |
| Class / Cohort:         | 23KTPM1                             |
| Assignment ID:          | HW#03                               |
| Assignment date:        | 2026-08-04                          |
| AI tool(s) used:        | Claude Code (Sonnet 5), via the `playwright-cli` and `agent-browser` skills |
| AI used:                | [x] Yes [ ] No                      |

---

## 2. Instructions

- Add **one section** per AI-generated artifact (shared GUI checklist draft, per-screen checklist run, usability task scenario, findings synthesis, compatibility matrix, etc.).
- Each artifact section contains **5 sub-items**: fill all of them.
  - **(1) Prompt**: paste verbatim; do **not** paraphrase.
  - **(2) AI Output**: paste verbatim output **or** embed a labelled screenshot.
  - **(3) Verdict**: mark exactly one: `VALID` · `INVALID` · `INCOMPLETE`.
  - **(4) Reasoning**: 2-5 sentences citing a course slide, ISTQB section, or a named heuristic (Nielsen / Norman / Shneiderman).
  - **(5) Student Fix**: show the corrected artifact; highlight every change.

> **TODO:** The prompts used to build the shared group checklist (Task 1A) also belong in this report — see assignment §10.

---

## 3. Audit

### Artifact #1: Shared GUI Checklist draft (Task 1A)

> **Requirement mapping:** Task 1A

#### (1) Prompt + Tool

**Tool:** Claude Code (Sonnet 5)
**Time:** 12:56 28/07/2026 (+07:00)
**Prompts:** See [Prompt Log](prompt_log.md), Entry 001, and [group/checklist-prompts.md](group/checklist-prompts.md) Round 1 for the full verbatim prompt (not duplicated here per that file's own single-source-of-truth instruction).

#### (2) AI Output

54 items across the four interface aspects (IA-01 = 14, IA-02 = 16, IA-03 = 13, IA-04 = 11), each with a checklist ID, item text, cited source, and `Origin: AI`. Full verbatim output in [group/checklist-prompts.md](group/checklist-prompts.md#round-1--initial-generation-only-round), "AI output (verbatim)" section.

#### (3) Verdict

**[ ] VALID**: correct and accepted as-is
**[x] INVALID**: wrong; rejected
**[x] INCOMPLETE**: acceptable after edits

(Mixed verdict: 50 of 54 items were INCOMPLETE-accepted, some with a rewritten source citation; 4 items were INVALID and rejected outright.)

#### (4) Reasoning

The prompt's own constraints produced a structural blind spot: it explicitly excluded i18n EN/VI, RTL, and dark-mode items "to be added by hand later," so the draft shipped zero i18n coverage even though EMS ships a language switcher in its top nav (`group/ai-gap-notes.md` Part 1, root cause `PROMPT`). Separately, six per-control checklists and the ISTQB 12-item list were supplied in full, but the model used only 3 of 6 control classes and 5 of 12 ISTQB items, keeping the entries that recur most often in generic checklist writing and dropping Dropdown/Combo, Checkbox/Radio, disabled-state, long-text, and validation-timing coverage (root cause `MODEL`). Of the 4 rejected items, 2 tested user perception or flow design rather than a renderable GUI defect (`SCOPE`), and 2 were near-duplicates of a surviving rule (`MODEL`). One rule, the binary Passed/Failed verdict the prompt mandated, was rewritten to Passed/Failed/N/A after the very first live screen run (B2) showed 21 of 54 items had no matching control class on that screen at all.

#### (5) Student Fix

| #   | AI-generated item | Issue | Corrected item |
| --- | ----------------- | ----- | -------------- |
| 1   | Draft shipped zero i18n coverage (prompt excluded it by name) | `PROMPT`: EN/VI language switch, state preservation across it, locale timezone rendering, and VI diacritics are real EMS controls left unchecked | Added `IA-01-14`, `IA-01-15`, `IA-01-16`, `IA-01-17` (Human) |
| 2   | Dropdown/Combo and Checkbox/Radio per-control clauses supplied but unused | `MODEL`: AI used 3 of 6 supplied per-control checklists | Added `IA-02-15`, `IA-02-16` (Human) |
| 3   | ISTQB items 7/9/10 (disabled state, long text, validation-timing consistency) supplied but unused | `MODEL`: recall bias toward the canonical subset of a 12-item source | Added `IA-02-17`, `IA-02-18`, `IA-02-19` (Human) |
| 4   | Rich-text rendering fidelity and image-upload-fidelity clauses under-cited | `PROMPT`/`MODEL`: no single named source covers authored-content rendering; the Image clause of a multi-clause source line went unused | Added `IA-02-20`, `IA-02-21` (Human) |
| 5   | Icon-ambiguity item (Nielsen #2, "icons match conventions") | `SCOPE`: tests a user's subjective understanding, which is Task 2's job, not a renderable screen defect | Removed |
| 6   | Review-step-before-submit item (WCAG SC 3.3.4) | `SCOPE`: tests flow design, not whether a screen renders/behaves as specified | Removed |
| 7   | Color-alone item (WCAG SC 1.4.1), a third restatement of the same criterion | `MODEL`: duplicate of two surviving items, reused wording the prompt's own example said not to reuse | Removed |
| 8   | Per-state-color item, duplicate of `IA-01-11` filed under a second aspect | `MODEL`: same rule re-derived and split across IA-01 and IA-04 | Removed |
| 9   | `IA-02-06` source clause "character limit matches the DB column size" | `SCOPE`: mixes a GUI check (typing past the limit is visibly prevented) with a schema check no tester can verify from a rendered screen | Rewritten: clause narrowed to "character limit" |
| 10  | Global rule: binary Passed/Failed verdict | `PROMPT`: mandated by the prompt; falsified on the first live run when 21 of 54 items had no matching control class on B2 | Rewritten to Passed / Failed / N/A, with mandatory Notes on both Failed and N/A |

Condensed by category; the full item-by-item reasoning (all 11 additions individually) is in [group/ai-gap-notes.md](group/ai-gap-notes.md).

---

### Artifact #2: Per-screen checklist execution (Task 1B, B1/B2/B4)

> **Requirement mapping:** Task 1B

#### (1) Prompt + Tool

**Tool:** Claude Code (Sonnet 5), operating a real Chromium browser via the `playwright-cli` skill
**Time:** 2026-08-01 (B1, B2), 2026-08-02 (B4)
**Prompts:** Not a single logged prompt. Each screen was run as a multi-turn agentic session: the student fixed the scope (screen, test account, checklist version `6e815ae`) and the AI executed all 61 checklist items against the live screen turn by turn, gathering evidence (DOM/accessibility-tree snapshots, pixel-contrast samples, network/storage inspection) before drafting each verdict. See the note on `prompt_log.md`'s scope in `[AI-05]_AI_Privacy_Checklist.md` section 2.

#### (2) AI Output

183 checklist rows (61 items x 3 screens): a Passed/Failed/N/A verdict, a Notes justification, and (for Failed rows) a screenshot and, where relevant, DOM/accessibility-tree or pixel-measurement evidence. Raw output is the three `checklist-run.md` files under `artifacts/screens/`.

#### (3) Verdict

**[ ] VALID**: correct and accepted as-is
**[x] INCOMPLETE**: acceptable after edits

#### (4) Reasoning

Execution evidence itself held up well (DOM excerpts, measured contrast ratios, and storage inspection are objective and were spot-checked rather than trusted narratively), but two items the AI verdicted `Passed` during the B2 run turned out to be checking the wrong thing rather than genuinely passing: `IA-01-14`'s old draft form (icon-convention item) was marked `Passed` by the AI listing icons it personally found conventional, a verdict with no falsifiable failure condition; `IA-02-15`'s old draft form (review-step item) was marked `Passed` only by arguing the action "is not uncorrectable," which is arguing around the item rather than through it. Both symptoms, not independent bugs, traced back to the same two checklist items already flagged `SCOPE` in Artifact #1 and were resolved by removing those items from the checklist entirely rather than re-verdicting them (`group/ai-gap-notes.md` Part 2). Separately, a numeric discrepancy surfaced during this documentation pass: B2's `checklist-run.md` reports "Findings raised: 7" while `FINDINGS_LOG.md` shows only 6 B2-owned entries; investigation confirmed this is not an error, one of B2's 7 Failed rows (`IA-03-05`) legitimately cross-references `BUG-B1-005` (the same underlying defect, reproduced from B2's own entry point) rather than being a new unique finding.

#### (5) Student Fix

| #   | AI-generated item | Issue | Corrected item |
| --- | ----------------- | ----- | -------------- |
| 1   | B2 run, old `IA-01-14` verdict `Passed`, justified by the tester's personal opinion on icon conventionality | No falsifiable failure condition; substitutes one tester's judgement for Task 2's 5-participant probe | Item removed from the shared checklist; surviving icon items cite only WCAG SC 1.1.1 (Non-text Content) |
| 2   | B2 run, old `IA-02-15` verdict `Passed`, argued around via "not uncorrectable" | Verdict required arguing around the item's own pass condition, a sign the check tests flow design, not rendered state | Item removed from the shared checklist |
| 3   | B2 `checklist-run.md` Result summary: "Findings raised: 7" vs. `FINDINGS_LOG.md`'s 6 unique B2 entries | Apparent inconsistency on first read | Verified correct, not an error: `IA-03-05` cross-references the shared `BUG-B1-005`; documented explicitly in `REPORT.md` section 4.2 rather than silently "fixed" |

---

---

## 4. Summary of AI Accuracy

| Metric                                     | Count | Percentage |
| ------------------------------------------ | ----- | ---------- |
| Total AI-generated artifacts audited        | 2     | 100%       |
| **VALID** (correct, accepted as-is)         | 0     | 0%         |
| **INVALID** (wrong; rejected)               | 0*    | 0%         |
| **INCOMPLETE** (acceptable after edits)     | 2     | 100%       |

\* No artifact was wholesale rejected; Artifact #1 contained 4 individually-invalid items within an otherwise-kept 54-item draft, counted at item granularity in its own Student Fix table, not at artifact granularity here.

---

## 5. Conclusion (When should AI be used or not)

> 80–150 words. Where did AI shine? Where did it fail? Recommendation for future GUI / usability / compatibility work.

AI performed best on mechanical, verifiable work: running 183 checklist checks across three live screens, capturing DOM evidence and measured contrast ratios that stayed independently checkable against the SUT. It performed worst where an item needed human judgment rather than a rendered fact, most visibly two items it verdicted `Passed` by arguing around their own pass condition (icon "conventionality," a subjective flow-design step) instead of measuring anything. Its coverage gaps were structural, not random: a prompt constraint excluding i18n created a hard ceiling no re-prompting inside it would recover, and supplying complete source material did not guarantee the model used all of it. Recommendation: keep AI for evidence-producing execution, but write items so every one resolves to a measurable fact, and treat any AI-drafted `Passed` that needs a justifying sentence as a sign the item, not the screen, is the problem.

---

## 6. Mandatory Disclosure

> **TODO:** list per artifact what AI produced, what you corrected, and what was written entirely by you. Declare explicitly any deviation from the course AI policy (see `context/ai_use_agreement.md`).

- **Shared GUI checklist (Task 1A):** AI produced the 54-item draft. I reviewed every item against the course sources, kept 50 (2 with a rewritten citation), rejected 4, and wrote 11 `Human` items myself. Full reasoning in `group/ai-gap-notes.md`.
- **Per-screen checklist execution (Task 1B, B1/B2/B4):** AI operated the browser and drafted all 183 verdicts with supporting evidence. I reviewed every `Failed` verdict against its evidence before accepting it, removed 2 checklist items whose AI-drafted `Passed` verdicts were unfalsifiable, and investigated (and resolved, as a non-issue) one apparent numeric discrepancy in B2's summary.
- **Report and README (Task 1 documentation):** AI drafted the descriptive sections from the underlying checklist/findings data; I verified every inserted number against its source file.
- **AI Critique (`REPORT.md` section 6):** written entirely by me, no AI drafting, per the assignment's anti-AI-cheat constraint on this artifact.
- **Deviation from course AI policy:** none identified. This assignment is scoped to Task 1 only; Task 2 (User Testing) and Task 3 (Cross-Browser/Cross-Platform) were deliberately not attempted and are self-assessed at 0 in `README.md`, not substituted with AI-fabricated data.

---

## Signature

| Field                   | Value                                 |
| ----------------------- | ------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                          |
| Student ID:             | 23127216                              |
| Class / Cohort:         | 23KTPM1                               |
| Course:                 | CS423 / CSC13003 – Software Testing   |
| Instructor:             | Dr. Lam Quang Vu                      |
| Date:                   | 2026-08-04                            |
| Signature:              | ![Lê Hoàng Lâm](assets/signature.png) |

---

## References

- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education.* CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Nielsen, J. *10 Usability Heuristics for User Interface Design.*
- Norman, D. *The Design of Everyday Things* (6 principles).
- Shneiderman, B. *Eight Golden Rules of Interface Design.*
- Hardman, P. (2025). *A Post-AI Learning Taxonomy.*
