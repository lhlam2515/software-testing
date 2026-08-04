# AI Use Disclosure Form — HW03

---

## 1. Course & Student Info

| Field                  | Value                                       |
| ---------------------- | ------------------------------------------- |
| Course:                | CS423 / CSC13003 – Software Testing         |
| Assignment ID:         | HW#03                                       |
| Assignment Title:      | GUI & Usability Testing on EMS              |
| AI Use Category (1–5): | Cat. 4 — AI-Assisted Production             |
| Date:                  | 2026-08-04                                  |
| Student name:          | Lê Hoàng Lâm                                |
| Student ID:            | 23127216                                    |

---

## 2. Disclosure Questions

### 1. AI tool(s) used

Claude Code (Anthropic, Sonnet 5 model), used both as a drafting assistant and as an agentic testing tool via two project-local Claude Code skills: `playwright-cli` (browser automation for the live checklist runs) and `agent-browser` (Google Form submission of the findings log).

---

### 2. Stage(s) of the assignment where AI was used

- [ ] brainstorming
- [ ] outlining
- [x] drafting
- [ ] feedback
- [x] revision
- [ ] coding
- [x] data analysis
- [ ] visual design
- [x] other: automated test execution (driving a real browser against the live EMS SUT to run the shared checklist)

---

### 3. Main prompts or tasks given to the AI

_Paste the 2–3 most impactful prompts verbatim. Full transcript: see [Prompt Log](prompt_log.md)._

The single most impactful prompt is the Task 1A checklist-generation prompt, reproduced verbatim (with tool and timestamp) in [Prompt Log](prompt_log.md), Entry 001, and in [group/checklist-prompts.md](group/checklist-prompts.md) Round 1. It is not re-pasted here to keep one source of truth, per that file's own instruction.

The per-screen checklist execution (Task 1B, B1/B2/B4) was not a single prompt but a multi-turn agentic session per screen: the student directed the scope (which screen, which account, which checklist version) and the AI operated the browser turn by turn, drafting a Passed/Failed/N/A verdict and supporting evidence for each of the 61 checklist items per screen.

---

### 4. Specific parts of the work AI contributed to

- **Shared GUI checklist (Task 1A):** AI drafted 54 items from the Round 1 prompt. The student reviewed every item against the course sources, kept 50 with 2 citation rewrites, removed 4, and added 11 `Human` items the AI's prompt constraints structurally excluded (see `group/ai-gap-notes.md`).
- **Per-screen checklist execution (Task 1B, B1/B2/B4):** AI ran all 61 items against each live screen via `playwright-cli`, drafting the verdict, notes, and evidence (screenshots, DOM/accessibility-tree excerpts, pixel-contrast samples) for each row. The student reviewed every `Failed` row, decided which were genuine defects worth a Finding ID, set severity, and approved the wording before it entered `FINDINGS_LOG.md`.
- **Report and README drafting:** AI drafted the descriptive sections of `REPORT.md` and `README.md` from the underlying checklist/findings data (coverage tables, per-screen summaries, gap-analysis condensation). Section 6 of `REPORT.md` (AI Critique) was written entirely by the student, per the assignment's anti-AI-cheat constraint on that artifact.

---

### 5. How I reviewed, revised, or verified the AI output

- **Checklist items:** cross-checked each `Human`-added item and each removed/rewritten AI item against a named course source (Nielsen, Norman, Shneiderman, WCAG 2.2 AA, ISTQB, or slide S13), documented row by row in `group/ai-gap-notes.md`.
- **Per-screen verdicts:** every `Failed` verdict was re-verified against direct evidence, DOM/accessibility-tree snapshots, measured pixel contrast ratios, or `window.location`/storage inspection, quoted inline in `FINDINGS_LOG.md`, rather than accepted on the AI's narrative description alone.
- **Report content:** every numeric claim inserted into `REPORT.md`/`README.md` (item counts, pass/fail counts, coverage splits) was cross-checked against the source `checklist-run.md` and `FINDINGS_LOG.md` files before insertion, not taken from the AI's running summary.

---

### 6. Citation

Claude Code (Anthropic), Sonnet 5 model, accessed via the Claude Code CLI. `playwright-cli` and `agent-browser` are project-local Claude Code skills (not third-party AI services) used to give the model live browser control during test execution.

---

## 3. Statement of Honesty

By signing below, I confirm that the disclosure above is accurate and complete. I understand that undisclosed or false disclosure of AI use is treated as academic misconduct and may result in a 0 grade for the assignment and disciplinary referral.

---

## 4. Signature

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

- Kharbach, M. (2026). _AI Use Policy Templates for Higher Education._ CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Nielsen, J. _10 Usability Heuristics for User Interface Design._
- Hardman, P. (2025). _A Post-AI Learning Taxonomy._
