# WEEKLY REPORT - GROUP 02

## 1. General Information

| Field | Information |
|---|---|
| Group ID | Group 02 |
| Group Name | Group 02 |
| Project Name | Seminar T10: Mutation Testing and Test Effectiveness for the e-Shop SUT |
| Reporting period | 2026-07-27 to 2026-08-01 (Monday to Saturday) |
| Members | `23127216` - Le Hoang Lam (M1); `23127543` - Vu Van Vu (M2) |

## 2. Tasks Completed This Week

Progress was checked against `seminar/02-planning/weekly-checklist.md`,
`git log --graph refs/heads/seminar --stat` for 2026-07-27 through
2026-08-01, and the working-tree state at time of writing. Following the
standard set in prior reports, a task is marked **[Completed]** only when
the `seminar` branch contains implementation evidence; work that exists
only in the working tree is marked **[WIP, uncommitted]**.

Full Git evidence: [Appendix A - commit_log.txt](./evidences/commit_log.txt).
Uncommitted working-tree evidence: [Appendix B - wip-manifest.txt](./evidences/wip-manifest.txt).

### 23127216 - Le Hoang Lam (M1)

- **[Completed] Corrected the coverage/mutation baseline via deterministic
  per-route scripts** (`696e350`, 2026-07-31). Added
  `apps/backend/scripts/coverage-by-route.js` and `mutation-by-route.js`,
  which detect Express route boundaries by paren/brace balance instead of
  hand-picked line ranges, and recomputed `BASELINE.md` sections 2 and 3b
  from that. This found a real measurement bug in the 28/06 baseline: the
  old FR-08 (`cart` + `checkout`) range (`L284-L342`) accidentally included
  three unrelated routes (`GET /api/cart`, `GET /api/orders/my-orders`,
  `PUT /api/orders/:id/cancel`), which had inflated its NoCoverage figure
  to 57%. Scoped correctly to just the two committed routes, FR-08 is
  **100%/75%** line/branch coverage with an **88.2%** kill rate on covered
  mutants (2/19 mutants, 10.5%, are NoCoverage) - the *strongest*-covered
  route of the four, not the weakest as the original baseline concluded.
  FR-10's old range (`L525-L580`) also overshot the actual file length
  (`server.js` is 576 lines) into the `require.main === module` startup
  guard; corrected coverage is **100%/95%** (was reported as 86%/83%). The
  representative mutation score across the four committed routes moves
  from 76.67% to **78.39%** (215 mutants in scope, 156 killed, 43 survived,
  16 NoCoverage).
- **[Completed] Finalized and committed the slide 1-15 delivery script and
  PDF export** (`9bff08f`, 2026-08-01 23:43). Rewrote
  `Seminar_Slides_content.md` into a full English delivery script per
  slide (purpose, outline XML, speaker script, evidence), removed the
  superseded outline draft `Seminar_Slides.md`, and added the built
  `Seminar_Slides.pdf` as the submission deliverable. Every e-Shop metric
  in the script is grounded to a measured repo value
  (`stryker.config.mjs`, `package.json`, the corrected `BASELINE.md`
  above). This is the tail end of the larger uncommitted revision effort
  below.

### 23127543 - Vu Van Vu (M2)

None

### Consolidated Evidence

| Item | Date | Owner | Status | Evidence |
|---|---|---|---|---|
| `1b8e6b4` | 2026-07-27 12:47 | Lam | Committed | Week-07 report carryover |
| `696e350` | 2026-07-31 09:28 | Lam | Committed | Deterministic baseline recompute; BASELINE.md correction |
| `9bff08f` | 2026-08-01 23:43 | Lam | Committed | Slide 1-15 script finalized; `Seminar_Slides.pdf` added |
| Revision plans + design doc | 2026-07-30 to 2026-08-01 | Lam | Uncommitted | [wip-manifest.txt](./evidences/wip-manifest.txt) |

Cumulative parity (`git shortlog -sn refs/heads/seminar`): **45 Lam / 3
Vu**. Unchanged in ratio from week-07's 42/3; all three of this week's
commits are M1's, widening the absolute gap further.

### Appendix A - Raw Git Commit Log

- Evidence file: [commit_log.txt](./evidences/commit_log.txt)
- Scope: branch `seminar` only, 2026-07-27 00:00:00 through
  2026-08-01 23:59:59, timezone `+07:00`.
- Command:
  `git log --graph refs/heads/seminar --stat --since=2026-07-27T00:00:00+07:00 --until=2026-08-01T23:59:59+07:00 --date=iso-strict --pretty=fuller`

### Appendix B - Uncommitted Working-Tree Snapshot

- Evidence file: [wip-manifest.txt](./evidences/wip-manifest.txt)
- Captures line/byte counts and last-modified timestamps for the seminar-
  relevant untracked files as of 2026-08-01, ~23:50 +07:00, without
  including raw content. Also records a stale root-level duplicate of
  `Seminar_Slides_content.md` (109 lines out of sync with the committed
  copy) flagged for cleanup.

## 3. AI Usage Declaration

AI (Claude Code) was used extensively this week by M1 for: (1) drafting
and executing the AI-workflow section revision plan for slides 12-14,
including the V1-V3 technical verification against the live Stryker/Jest
setup; (2) drafting the 19-slide deck restructure plan; (3) auditing and
cutting the slide 1-15 speaker script from 5,577 to 4,562 words; (4)
distilling `seminar_presentation_design.md` into the final, committed
`Seminar_Slides_content.md`; (5) writing the `coverage-by-route.js` and
`mutation-by-route.js` scripts used to correct the baseline measurement.
Items 1-3 remain uncommitted draft plans not yet applied to the master
design document. Item 4 (the committed script) has gone through one
editorial finalization pass but its demo-timing claims (V4/V5) are still
unverified estimates, not measured rehearsal results. Item 5's code and
resulting numbers were verified by direct comparison to the raw Stryker
HTML report and `lcov.info` before being written into `BASELINE.md`.

## 4. Tasks Planned for Next Week

The next planning period is 2026-08-03 through 2026-08-08.

### Le Hoang Lam (M1)

- Record the demo video (`Demo_Screencast`) following the finalized
  seminar script (`Seminar_Slides_content.md` /
  `seminar_presentation_design.md` Demo Runbook). Not yet recorded as of
  this report - target: complete before Wednesday, 2026-08-05.

### Vu Van Vu (M2)

- Time and review the demo video recording, per the D1 timekeeper role
  assigned in `task-assignment.md`.

### Shared

- Once the demo video is complete, submit it together with the slides and
  report to the TA for feedback, and revise based on that feedback before
  the seminar live date (2026-08-12).

## 5. Issues

| Issue | Impact | Required action |
|---|---|---|
| The demo video has not been recorded yet, even though the delivery script it should follow (`Seminar_Slides_content.md` / `seminar_presentation_design.md` Demo Runbook) is now finalized. `[D1]` was first flagged as not started in week-05 and has carried over every report since. | Single largest remaining blocker before the live date; without the recording there is nothing to send for TA feedback or to fall back on if the live demo fails on stage. | Record before Wednesday, 2026-08-05, per the plan above. |
| Cumulative parity remains 45 (Lam) vs 3 (Vu) commits on `seminar`, unchanged in ratio for 4 consecutive reports (week-06: 41/2, week-07: 42/3, week-08: 45/3); no Vu commits landed this week. | Parity gate (<=20% variance via `git shortlog -sn`) remains unmet. | Land a Vu commit next period (see Section 4). |
| The seminar live date is being treated internally as 2026-08-12, but `seminar/README.md` and `seminar/02-planning/weekly-checklist.md` still show the original 22/07 D-day, and there is no written confirmation from the lecturer on record. | Every downstream deadline (Moodle pre-share, the `htthanh@fit.hcmus.edu.vn` email, the demo-video deadline above) depends on this date being correct. | Confirm in writing with the lecturer and update the D-day field in both docs. |
