# WEEKLY REPORT - GROUP 02

## 1. General Information

| Field | Information |
|---|---|
| Group ID | Group 02 |
| Group Name | Group 02 |
| Project Name | Seminar T10: Mutation Testing and Test Effectiveness for the e-Shop SUT |
| Reporting period | 2026-08-03 to 2026-08-08 (Monday to Saturday) |
| Members | `23127216` - Le Hoang Lam (M1); `23127543` - Vu Van Vu (M2) |

## 2. Tasks Completed This Week

Progress was checked against `seminar/02-planning/weekly-checklist.md`,
`git log --graph refs/heads/seminar --stat` for 2026-08-02 through
2026-08-08 (the day after the week-08 cutoff is included as report
carryover, per the convention used in prior reports), and team
confirmation at time of writing. A task is marked **[Completed]** when the
`seminar` branch contains implementation evidence; **[Completed, evidence
outside repo]** when the group confirms a task is done but no commit or
file exists in the repository to point to.

Full Git evidence: [Appendix A - commit_log.txt](./evidences/commit_log.txt).
Uncommitted working-tree evidence: [Appendix B - wip-manifest.txt](./evidences/wip-manifest.txt).

### 23127216 - Le Hoang Lam (M1)

- **[Completed] Revised the seminar slide deck in response to GVHD/TA
  feedback**, across three commits:
  1. `8bcfe19` (2026-08-04) - verified and corrected citations in
     `mutation-testing-reference.md`: added a Source Index resolving every
     external claim to a verification status, corrected the MuTAP
     HumanEval scores (94%/66% -> verified 93.57%/65.94%), split two
     conflated Google papers by venue, flagged unverified claims (Theodo
     banking case, LLMorpheus venue), and added a "withdrawn / do not
     cite" table for numbers corrected from earlier drafts.
  2. `7db5e97` (2026-08-08) - expanded the slide delivery script from 18 to
     45 screens: split multi-payload screens so each carries one idea,
     added worked examples the original asked the audience to accept as
     aggregates, and resequenced the AI section into two labelled
     directions.
  3. `266c453` (2026-08-08) - added a 30-minute delivery cut of the deck:
     45 screens reduced to 29 (7 dropped, 9 pairs merged), live demo
     compressed from 4:00 to 3:00 by pre-recording the audit step, and
     timekeeper checkpoints added. Still open: the S6 budget (pitch <=10
     min, deck <=15 slides) conflicts with the 29-screen cut; the
     15-screen selection that fits it is not yet resolved.

### 23127543 - Vu Van Vu (M2)

- **[Completed, evidence outside repo] Recorded the demo video**
  (`Demo_Screencast`), closing the `[D1]` blocker flagged as the largest
  open risk in every report since week-05. Confirmed by the group at time
  of writing; no commit or file exists in the `seminar` repository as of
  this report (checked: `*.mp4`, `*screencast*`, files touched since
  week-08). See [Appendix B](./evidences/wip-manifest.txt) for the
  evidence-scope note. Action: add the file or an accessible link to the
  repository before the Moodle submission.

### Consolidated Evidence

| Item | Date | Owner | Status | Evidence |
|---|---|---|---|---|
| `6bd8f26` | 2026-08-02 00:03 | Lam | Committed | Week-08 report carryover |
| `8bcfe19` | 2026-08-04 11:00 | Lam | Committed | Citation verification/correction in mutation-testing-reference.md |
| `7db5e97` | 2026-08-08 22:33 | Lam | Committed | Slide script expanded 18 -> 45 screens |
| `266c453` | 2026-08-08 22:33 | Lam | Committed | 30-minute delivery cut (45 -> 29 screens) |
| Demo video recording | 2026-08-08 (confirmed) | Vu | Completed, not in repo | Team confirmation only; see Appendix B |
| Slide redesign draft + research guide (WIP) | mtime 2026-08-08 | Lam | Uncommitted | [wip-manifest.txt](./evidences/wip-manifest.txt) |

Cumulative parity (`git shortlog -sn refs/heads/seminar`): **49 Lam / 3
Vu**. Ratio is effectively unchanged from week-08's 45/3; no Vu commit
landed on `seminar` this week, so the absolute gap widened by 4.

### Appendix A - Raw Git Commit Log

- Evidence file: [commit_log.txt](./evidences/commit_log.txt)
- Scope: branch `seminar` only, 2026-08-02 00:00:00 through
  2026-08-08 23:59:59, timezone `+07:00`.
- Command:
  `git log --graph refs/heads/seminar --stat --since=2026-08-02T00:00:00+07:00 --until=2026-08-08T23:59:59+07:00 --date=iso-strict --pretty=fuller`

### Appendix B - Uncommitted Working-Tree Snapshot

- Evidence file: [wip-manifest.txt](./evidences/wip-manifest.txt)
- Captures line/byte counts and last-modified timestamps for the seminar-
  relevant untracked files as of 2026-08-08, ~23:00 +07:00, without
  including raw content, and records the evidence-scope note for the demo
  video (completed per team confirmation, not present in the repository).

## 3. AI Usage Declaration

AI (Claude Code) was used by M1 this week to draft this weekly report:
generating and reading the `git log`/`git shortlog` evidence on `seminar`,
cross-checking task status against `weekly-checklist.md` and
`task-assignment.md`, and writing up the report body strictly from that
evidence plus explicit team confirmation obtained for the two items that
have no repo trace (the GVHD/TA feedback attribution and the demo video
completion). No task status or next-week plan was inferred from commit
timestamps alone; both were confirmed by the group before being written
into this document.

## 4. Tasks Planned for Next Week

The next planning period begins 2026-08-10.

### Shared

- **Seminar live presentation.** The group confirmed at time of writing
  that the live seminar is scheduled for next week. This is consistent
  with the internal working target (2026-08-12) carried since the week-08
  report, but that date is still not reflected in `seminar/README.md` or
  `seminar/02-planning/weekly-checklist.md`, which continue to show the
  original 22/07/2026 D-day (see Issues below).

## 5. Issues

| Issue | Impact | Required action |
|---|---|---|
| `seminar/README.md` and `seminar/02-planning/weekly-checklist.md` still show the original 22/07/2026 D-day, while the group is working toward a live date next week (internally tracked as 2026-08-12 since week-08). | Downstream deadlines (Moodle pre-share, demo-video submission, TA feedback turnaround) are being planned against a date that is not written down anywhere in the seminar docs. | Confirm the exact live date in writing and update the D-day field in both documents before the live date. |
| Cumulative parity remains skewed: 49 (Lam) vs 3 (Vu) commits on `seminar`, unchanged in ratio for 5 consecutive reports (week-06: 41/2, week-07: 42/3, week-08: 45/3, week-09: 49/3); no Vu commit landed this week even though the demo video was completed. | Parity gate (<=20% variance via `git shortlog -sn`) remains unmet. | Land a Vu commit (e.g., adding the demo video file/link, or AI Audit pack work) before the next report. |
| The completed demo video has no commit or file in the repository; its completion is recorded on team confirmation only (see Appendix B). | If the video is lost, not backed up, or its readiness is questioned, there is currently nothing in version control to fall back on. | Add the file or a stable link to the repository, and reference it here with a commit hash, before the Moodle submission. |
| The S6 budget conflict flagged in `266c453` (pitch <=10 min, deck <=15 slides vs. the 29-screen 30-minute cut) is unresolved: the 15-screen selection that fits the tighter budget has not been chosen. | Risk of running over time or presenting an unrehearsed shorter cut if the tighter budget applies on the day. | Resolve the 15-screen selection and rehearse it before the live date. |
