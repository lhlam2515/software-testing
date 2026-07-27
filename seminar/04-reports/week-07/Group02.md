# WEEKLY REPORT - GROUP 02

## 1. General Information

| Field | Information |
|---|---|
| Group ID | Group 02 |
| Group Name | Group 02 |
| Project Name | Seminar T10: Mutation Testing and Test Effectiveness for the e-Shop SUT |
| Reporting period | 2026-07-20 to 2026-07-25 (Monday to Saturday) |
| Members | `23127216` - Lê Hoàng Lâm (M1); `23127543` - Vũ Văn Vũ (M2) |

## 2. Tasks Completed This Week

Progress was checked against `seminar/02-planning/weekly-checklist.md` (Tuần 5,
20/07 → 26/07) and `git log --graph refs/heads/seminar --stat` for
2026-07-20 through 2026-07-25. Following the standard set in the week-05/06
reports, a task is marked **[Completed]** only when the `seminar` branch
contains implementation evidence; work that exists only in the working tree
(not committed) is marked **[WIP, uncommitted]** and is not counted toward
this week's committed evidence.

Full Git evidence: [Appendix A - commit_log.txt](./evidences/commit_log.txt).
Uncommitted working-tree evidence: [Appendix B - wip-manifest.txt](./evidences/wip-manifest.txt).

### 23127216 - Lê Hoàng Lâm (M1)

- **[Completed] Committed the week-06 progress report and its evidence
  bundle** (`eb4dd9e`, 2026-07-25 12:01). Closes the reporting carryover
  from the previous cycle.
- **[WIP, uncommitted] Research and content build for the seminar deck.**
  Produced two long-form research documents on mutation testing
  (`NOTES.md`, 1433 lines / 36.5 KB; `mutation_testing_and_test_effectiveness.md`,
  2164 lines / 53.5 KB) and a restructured slide-content draft
  (`seminar_content.md`, 233 lines / 18.6 KB), then used a newly added
  `marp-slide-designer` skill to build an actual Marp slide deck
  (`.claude/skills/marp-slide-designer/slides/mutation-testing-seminar.marp.md`,
  15 slides, within the ≤15 hard cap from Guide S6). This substantively
  reworks the slide content beyond Vũ's `[G1]` draft from `03-deliverables/
  Seminar_Slides.md` (see Consolidated Evidence and Issues).
  - **None of this is committed to `seminar` as of this report.** It has no
    entry in `git log` and does not count as this week's committed
    evidence; see [Appendix B](./evidences/wip-manifest.txt) for the
    working-tree snapshot (file sizes, line counts, timestamps) used to
    substantiate the claim without dumping raw content into this report.
- **[Not started] `[D1]` demo script (≤10', Stryker + AI feature).** Still
  not started. Carried over for a third consecutive report (first flagged
  in week-05, repeated in week-06, unchanged this week).

### 23127543 - Vu Van Vu (M2)

- **[Completed] `[G1]` initial `Seminar_Slides.md` draft**
  (`f2ac0ca`, 2026-07-23 12:04), 1120 lines, committed to
  `seminar/03-deliverables/`. This is the outline/content draft that
  M1's uncommitted Marp deck (above) built on top of.
- No other commits for 2026-07-20 through 2026-07-25.

### Consolidated Evidence

| Item | Date | Owner | Status | Evidence |
|---|---|---|---|---|
| `eb4dd9e` | 2026-07-25 12:01 | Lâm | Committed | Week-06 report + evidence bundle |
| `f2ac0ca` | 2026-07-23 12:04 | Vũ | Committed | `Seminar_Slides.md` draft (`[G1]`), 1120 lines |
| Research docs + Marp deck | 2026-07-25 12:51-22:35 | Lâm | Uncommitted | [wip-manifest.txt](./evidences/wip-manifest.txt) |

Cumulative parity (`git shortlog -sn refs/heads/seminar`): **42 Lâm / 3 Vũ**.
Unchanged in ratio terms from week-06 (41/2); the gap has not narrowed and
this week's real (uncommitted) work would widen it further once committed,
since it is entirely M1's.

### Appendix A - Raw Git Commit Log

- Evidence file: [commit_log.txt](./evidences/commit_log.txt)
- Scope: branch `seminar` only, 2026-07-20 00:00:00 through
  2026-07-25 23:59:59, timezone `+07:00`.
- Command:
  `git log --graph refs/heads/seminar --stat --since=2026-07-20T00:00:00+07:00 --until=2026-07-25T23:59:59+07:00 --date=iso-strict --pretty=fuller`

### Appendix B - Uncommitted Working-Tree Snapshot

- Evidence file: [wip-manifest.txt](./evidences/wip-manifest.txt)
- Captures `git status --porcelain`, line/byte counts, and last-modified
  timestamps for the untracked seminar-relevant files as of the time this
  report was written (2026-07-25, ~22:50 +07:00), without including the
  raw content.

## 3. AI Usage Declaration

AI (Claude Code) was used extensively this week by M1 for: (1) synthesizing
two long-form research documents on mutation testing concepts, operators,
and CI/CD integration patterns from external sources; (2) restructuring
that research into slide-ready content; (3) generating a 15-slide Marp deck
via the `marp-slide-designer` skill, including custom CSS/theme
application. All of it is unreviewed, uncommitted draft output at the time
of this report and has not yet gone through the group's own editorial
pass.

## 4. Tasks Planned for Next Week

The next planning period is 2026-07-27 through 2026-08-01.

### Lê Hoàng Lâm (M1)

- Commit the research docs and Marp slide deck with clear, atomic commit
  messages and correct attribution, or explicitly discard them if the
  group decides to keep Vũ's original `Seminar_Slides.md` as the
  submission source, do not leave ~110 KB of undisclosed draft content
  sitting in the working tree past this report.
- Reconcile the Marp deck against the actual required deliverable name and
  format: `seminar/README.md` still lists `Seminar_Slides.pptx`
  (`≤15 slides`) as the S6 deliverable; a `.marp.md` file under
  `.claude/skills/` is neither the right location (`03-deliverables/`) nor
  necessarily exportable to `.pptx` without an extra conversion step,
  confirm Marp's PDF/PPTX export path works before treating this as done.
- Resume `[D1]`: draft and rehearse the demo script (≤10 minutes, Stryker +
  AI feature both required). Third week carried over, now the single
  largest unaddressed item on the checklist.

### Vu Van Vu (M2)

- Review M1's uncommitted Marp deck against the original `[G1]`
  `Seminar_Slides.md` draft and decide, jointly with M1, which becomes the
  submission source; leave a written review note either way so this is
  independently verifiable (per the standing evidence gap from week-06).

## 5. Issues

| Issue | Impact | Required action |
|---|---|---|
| `[D1]` demo script has not been started for three consecutive reporting periods (first flagged week-05). | The demo is one of two hard auto-penalty triggers (Guide, Workflow Pitfall #2) alongside the AI feature; with the date already uncertain this is the single largest schedule risk in the plan. | M1 to draft `[D1]` next week regardless of date-confirmation status, it does not depend on knowing the exact live date. |
| `[H1]` Moodle pre-share (target 17/07) has no evidence of completion in this repo; `Demo_Screencast.mp4` does not exist and slides are not finalized in `03-deliverables/`, both prerequisites for a pre-share push. | If genuinely missed, this is a graded deliverable gate already past its own deadline, independent of the live-date uncertainty. | Vũ to confirm in writing next report whether `[H1]` happened outside the repo (e.g. Moodle upload without a matching commit) or was missed; if missed, treat as immediate priority once artifacts are ready. |
| Cumulative parity remains 42 (Lâm) vs 3 (Vũ) commits, unchanged in ratio from week-06's 41/2, and this week's real content work (research + slide build) was entirely M1's despite being M2's assigned `[G1]` task. | The parity gate (`≤20%` variance target) is further from being met than at any prior report; also raises an ownership question about whose work the slide deck actually represents for grading. | Ensure the next `[G1]`/`[E2]` commit is Vũ's; if M1's Marp deck is adopted, record explicitly in the commit message and in `[AI-03]` that M1 authored the AI-assisted rebuild so authorship is not misattributed. |
