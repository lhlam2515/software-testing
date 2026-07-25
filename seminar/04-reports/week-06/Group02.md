# WEEKLY REPORT - GROUP 02

## 1. General Information

| Field | Information |
|---|---|
| Group ID | Group 02 |
| Group Name | Group 02 |
| Project Name | Seminar T10: Mutation Testing and Test Effectiveness for the e-Shop SUT |
| Reporting period | 2026-07-13 to 2026-07-18 (Monday to Saturday) |
| Members | `23127216` - Lê Hoàng Lâm (M1); `23127543` - Vũ Văn Vũ (M2) |

## 2. Tasks Completed This Week

This week was explicitly a pause week: the group did not produce new seminar
content (no `[D1]`, `[G1]`, `[E2]`, or screencast work), and instead reviewed
completed material and reconciled the delivery schedule after a change to the
seminar live date. Progress below was checked against
`seminar/02-planning/weekly-checklist.md` and
`git log --graph refs/heads/seminar --stat` for 2026-07-13 through 2026-07-18.
A task is marked completed only when the `seminar` branch contains
implementation evidence, or is explicitly flagged as self-reported when it is
a review-only task with no diff to point to.

Full Git evidence: [Appendix A - commit_log.txt](./evidences/commit_log.txt).

### 23127216 - Lê Hoàng Lâm (M1)

- **[Completed] Relay the seminar-date change and a new lecturer requirement.**
  - The seminar live date, recorded as **22/07/2026** in
    `seminar/README.md` and `seminar/02-planning/weekly-checklist.md`, is
    moving to **Week 10** of the course calendar, about 3 weeks later
    (approximately 2026-08-12 if computed as 22/07 + 3 weeks). This is not
    yet confirmed in writing in any planning doc; `prep-plan.md` section 0
    already flagged this exact uncertainty ("ngày seminar live của nhóm
    (Week 7-11), mốc cần xác nhận với TA").
  - A new hard constraint was surfaced alongside the date change: in addition
    to the existing Moodle pre-share rule, slides, demo, and report must be
    sent by email to `htthanh@fit.hcmus.edu.vn` **at least 4 days before**
    the seminar date for review and revision; if not received by the
    seminar day, the seminar is graded **0**.
  - No commit evidence, this is planning input, not a code/doc change. Carried
    into section 5 (Issues) and section 4 (Tasks Planned for Next Week).

- **Team-level: paused all new seminar-content production this week**
  (`[D1]`, `[G1]`, `[E2]`, screencast, Moodle push) pending the date
  confirmation, deferring the Week 4 checklist block by one week rather than
  starting it against a stale 22/07 target.

### 23127543 - Vu Van Vu (M2)

- **[Completed, self-reported] Independent review of `User_Guide.md`
  (sections 1, 2, 4, 5, 7) and `Activity_Worksheet.md`.**
  - This closes the primary carryover item from last week's report Issues:
    Vũ had zero commits for 2026-07-06 to 2026-07-11 and needed to
    independently review and be able to explain the sections Lâm committed
    that week (commits `78fc7cd`, `50b57cf`, `1684a92`, `5683baf`, `f8c2494`),
    per the AI Usage Guideline's "Understanding" requirement.
  - No commit or diff evidence exists for this task, it is a review-only
    activity. Completion is self-reported by Vũ to M1 and is not
    independently verifiable via `git shortlog` (see Issues).
- **No commits on branch `seminar` for 2026-07-13 through 2026-07-18.**
  Cumulative `git shortlog -sn refs/heads/seminar` remains unchanged for Vũ
  at 2 commits (41 Lâm / 2 Vũ overall after this week's single commit).

### Consolidated Evidence

| Commit | Date | Owner | Evidence |
|---|---|---|---|
| `59cb3fe` | 2026-07-13 17:06 | Lâm | Added week-05 progress report (`Group02.md`) and its supporting evidence bundle |

### Appendix A - Raw Git Commit Log

- Evidence file: [commit_log.txt](./evidences/commit_log.txt)
- Scope: branch `seminar` only, 2026-07-13 00:00:00 through
  2026-07-18 23:59:59, timezone `+07:00`.
- Command:
  `git log --graph refs/heads/seminar --stat --since=2026-07-13T00:00:00+07:00 --until=2026-07-18T23:59:59+07:00 --date=iso-strict --pretty=fuller`

## 3. AI Usage Declaration

None.

## 4. Tasks Planned for Next Week

The next planning period is 2026-07-20 through 2026-07-25.

### Lê Hoàng Lâm (M1)

- Resume `[D1]`: draft and rehearse the seminar demo script (<=10 minutes,
  covering both Stryker and the AI feature). Still not started, now carried
  over from week-05's plan.
- Record `Demo_Screencast.mp4` and a backup recording once `[D1]` is drafted.
- Confirm the exact Week-10 seminar date with the lecturer, then recompute
  both the Moodle pre-share deadline (Guide §S5, >=3 working days before) and
  the new email deadline to `htthanh@fit.hcmus.edu.vn` (>=4 days before,
  whichever is stricter), and update the D-day field in `seminar/README.md`
  and `seminar/02-planning/weekly-checklist.md`.

### Vu Van Vu (M2)

- `[G1]` Build `Seminar_Slides.pptx` (<=15 slides) using the approved outline
  and this cycle's real BASELINE/User_Guide numbers. Not yet started.
- `[E2]` One-page cheat-sheet and a printable worksheet version.
- Leave a short written review note (checklist tick plus a one-line comment)
  recording this week's `User_Guide.md`/`Activity_Worksheet.md` review, so
  the next report has verifiable evidence for it.

### Shared

- Do not treat the later seminar date as slack: resume the paused Week 4
  checklist items (`[D1]`, `[G1]`, `[E2]`, screencast, Moodle push) on the
  original weekly cadence starting immediately, per the requirement to still
  finish planned content early.
- Once the date is confirmed, add an explicit "email GV" line item to the
  checklist, owned jointly by both members, target date = confirmed seminar
  date minus 4 days.
- Renegotiate the Week 4-5 task split given the still-skewed 41 Lâm / 2 Vũ
  cumulative commit count, so the upcoming `[G1]`/`[E2]` work produces commit
  evidence for Vũ rather than being delivered informally.

## 5. Issues

| Issue | Impact | Required action |
|---|---|---|
| Seminar live date has moved from 22/07 (recorded as D-day in `seminar/README.md` and `weekly-checklist.md`) to Week 10 of the course calendar, about 3 weeks later (approximately 2026-08-12); not yet confirmed in writing or reflected in any planning doc. | Every downstream deadline (Moodle pre-share, the new email requirement, the AI Audit +5-working-day window) is currently unresolved, and the planning docs show a stale D-day. | Confirm the exact date with the lecturer, per `prep-plan.md` section 0's pre-existing "cần xác nhận với TA" note; update `README.md` and `weekly-checklist.md` once confirmed. |
| New hard constraint surfaced this week: slides, demo, and report must be emailed to `htthanh@fit.hcmus.edu.vn` at least 4 days before the seminar date for review, in addition to the existing Moodle pre-share rule (Guide §S5, >=3 working days); missing this by the seminar day is an automatic 0 for the seminar. | Highest-severity single point of failure in the whole plan, more costly than any content-quality gap. | Add an explicit "email GV" line item to the Week 4 checklist, owned jointly, target date = confirmed seminar date minus 4 days. |
| Vũ's review of `User_Guide.md`/`Activity_Worksheet.md` this week has no commit or diff evidence, it is a review-only task. | Not independently verifiable via `git shortlog`, the same evidentiary gap flagged as the primary Issue in the week-05 report. | Vũ to leave a short review note or checklist tick as a minimal evidence trail going forward. |
| Cumulative branch history is still 41 commits (Lâm) vs 2 commits (Vũ) after this week's pause; zero new commits from either member for 2026-07-13 through 2026-07-18. | The parity gate (target <=20% variance via `git shortlog -sn`) remains unmet once production resumes. | Structure the resumed Week 4 work (`[G1]`, `[E2]`) so Vũ's contribution lands as commits on the `seminar` branch, not just informal delivery. |
