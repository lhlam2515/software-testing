# WEEKLY REPORT - GROUP 02

## 1. General Information

| Field | Information |
|---|---|
| Group ID | Group 02 |
| Group Name | Group 02 |
| Project Name | Seminar T10: Mutation Testing and Test Effectiveness for the e-Shop SUT |
| Reporting period | 2026-07-06 to 2026-07-11 (Monday to Saturday) |
| Members | `23127216` - Lê Hoàng Lâm (M1); `23127543` - Vu Van Vu (M2) |

## 2. Tasks Completed This Week

Progress below was checked against `seminar/02-planning/weekly-checklist.md` and
`git log --graph refs/heads/seminar --stat` for 2026-07-06 through 2026-07-11.
A task is marked completed only when the `seminar` branch contains implementation
or measured execution evidence.

Full Git evidence: [Appendix A - commit_log.txt](./evidences/commit_log.txt).

### 23127216 - Lê Hoàng Lâm (M1)

- **[Completed] Close the BASELINE.md validation gate for both Group A and Group B.**
  - Debugged and stabilized recurring Stryker `TIMEOUT`/`RuntimeError` failures
    blocking a clean full mutation run.
  - Added kill assertions for mutant 28 (`auth.test.js`), mutants 396/397/398
    (`coupon.test.js`), mutant 515 (`order-status.test.js`), and mutant 268
    (`cart.test.js`) - the last two were Group B's, owned by Vũ.
  - Re-ran the full suite: 541 mutants, 188 killed, 65 survived, 288 no-coverage;
    mutation score 34.75% (+2.40pp from the 32.35% baseline). All 8 targeted
    survivors now have a recorded PASS-original / FAIL-mutant result.
  - This closes both Issues raised in last week's report (T6a/T7a and T6b/T7b
    lacked execution evidence).
  - Evidence: commits `b39a915`, `2fa5c22`; run log in
    [Appendix B - baseline-completion-evidence-2026-07-11.md](./evidences/baseline-completion-evidence-2026-07-11.md).

- **[Completed] `[F2]`/`[F4]` and, additionally, `[F1]`/`[F3]` - write all 7
  sections of `User_Guide.md`.**
  - §1 Introduction and §2 Installation: mutation-testing core concepts, and the
    `concurrency:1` / `--jitless` requirement sourced from an observed SQLite race.
  - §3 First Test: real coupon.test.js walkthrough in exactly 15 steps, with
    measured mutation-score progression 25.93% -> 29.63% -> 35.80% and two real
    bugs found (strict `>` min-order check, negative percent-discount formula).
  - §4 Advanced Usage and §5 Troubleshooting: a captured incremental-run
    benchmark (2m58s -> 2s), a worked AI validation-gate example, and 5
    real captured errors (E1-E5) including the wrapper-timeout-vs-still-running
    Stryker gotcha found this week.
  - §6 Failure Modes: 4 modes (FM1-FM4) rewritten against the real 541-mutant
    run, satisfying the >=3 gate requirement with measured, not invented, data.
  - §7 References: rewritten with per-claim source attribution.
  - Note: `git log --follow` on `User_Guide.md` shows every commit since the
    06/22 skeleton was authored by Lâm; §1/§2/§4/§5/§7 were assigned to Vũ as
    `[F1]`/`[F3]` in last week's plan and have no commit from Vũ (see Issues).
  - Evidence: commits `78fc7cd`, `50b57cf`, `1684a92`, `5683baf`.

- **[Completed] `[T9]` - build the "Kill the Mutant" sandbox, exceeding scope.**
  - Refactored a standalone EShop backend copy into separate modules (no more
    mega-controller) and published it as a public repository:
    <https://github.com/lhlam2515/eshop-kill-the-mutant>.
  - Ran Stryker on the sandbox and used its own mutation report - not the main
    repo's - to design the activity, instead of the originally planned
    checkout/coupon-only scope.

- **[Completed] `[E1]` (originally Vũ's) - redesign `Activity_Worksheet.md`.**
  - Expanded from a single coupon-only concept to 5 mutant stations across 4
    business areas (auth, cart, order-status, coupon), each with a facilitator
    answer key.
  - Written in English and checked with the `voice-guard` skill per group
    convention.
  - Soft-reset and re-committed once to remove answer-key content that had
    leaked into the sandbox's own test-file comments before finalizing.
  - Evidence: commit `f8c2494`.

- **[Not started] `[D1]` - draft the seminar demo script.**
  - Carried over to next week; see Tasks Planned for Next Week.

### 23127543 - Vu Van Vu (M2)

- **No commit evidence on branch `seminar` for 2026-07-06 through 2026-07-11.**
  `git shortlog -sn refs/heads/seminar` for this date range returns Lâm only
  (9 commits, 0 from Vũ). `[F1]`, `[F3]`, `[E1]`, `[G1]`, and both `[R]` review
  items assigned to Vũ for this week show no execution evidence. See Issues.

### Consolidated Evidence

| Commit | Date | Owner | Evidence |
|---|---|---|---|
| `b39a915` | 2026-07-11 11:19 | Lâm | Added kill assertions for mutants 28, 396/397/398 (own) and 515, 268 (Vũ's Group B) |
| `2fa5c22` | 2026-07-11 11:20 | Lâm | Closed BASELINE.md validation gate for all 8 survivors; MS 32.35% -> 34.75% |
| `e5bf242` | 2026-07-11 12:09 | Lâm | Synced weekly-checklist.md / README.md to the confirmed BASELINE status |
| `78fc7cd` | 2026-07-11 17:50 | Lâm | Finalized User_Guide §1-2 |
| `50b57cf` | 2026-07-11 17:50 | Lâm | Rewrote User_Guide §3 with real Stryker output |
| `1684a92` | 2026-07-11 17:50 | Lâm | Backed User_Guide §4-5-7 with captured runs and sourced links |
| `5683baf` | 2026-07-11 17:50 | Lâm | Rewrote User_Guide §6 with measured failure-mode data |
| `f8c2494` | 2026-07-11 18:33 | Lâm | Revised Kill the Mutant worksheet to 5 stations, linked sandbox repo |

### Appendix A - Raw Git Commit Log

- Evidence file: [commit_log.txt](./evidences/commit_log.txt)
- Scope: branch `seminar` only, 2026-07-06 00:00:00 through
  2026-07-11 23:59:59, timezone `+07:00`.
- Command:
  `git log --graph refs/heads/seminar --stat --since=2026-07-06T00:00:00+07:00 --until=2026-07-11T23:59:59+07:00 --date=iso-strict --pretty=fuller`

### Appendix B - BASELINE Completion Evidence

- Snapshot: [BASELINE.md](./evidences/BASELINE.md)
- Run log: [baseline-completion-evidence-2026-07-11.md](./evidences/baseline-completion-evidence-2026-07-11.md)

## 3. AI Usage Declaration

### AI Usage Notes

**Claude (Claude Code)**
Claude Sonnet 5, Anthropic, CLI (`claude.ai/code`), accessed 2026-07-11 throughout the day (session timestamps below, `+07:00`).

Prompt (10:11, checklist-driven completion):

> "Tạo checklist các hoạt động cần thực hiện để hoàn thiện tài liệu BASELINE, thu
> thập đầy đủ thông tin, thực thi và cập nhật lại tài liệu BASELINE"

Used to plan and then execute the remaining BASELINE.md work. AI proposed a 90-item checklist, then ran the real kill-assertion and mutation commands against it; M1 reviewed the measured Stryker/Jest output before it was written into `BASELINE.md`.

Prompt (12:24, verify-before-write guardrail):

> "Tôi muốn bạn thực hiện research, kiểm chứng các Failure Mode ở trong
> User_Guide trước khi thay thế bất cứ thông tin nào"

Set as an explicit precondition before any content replacement in User_Guide §6: AI had to verify each failure mode against the actual Stryker run first. The result (commit `548abad`, an intermediate commit later superseded by the final atomic rewrite `5683baf` and no longer reachable from any branch) also dropped a previously listed "AI-hallucination" failure mode because it had no captured in-project instance to verify against.

Prompt (14:25, initial draft):

> "Write User Guide section 3, an end-to-end first-test walkthrough for the
> coupon feature in no more than 15 steps."

AI drafted the initial walkthrough using the team's existing scoped-analysis numbers from `BASELINE.md` (81 mutants, 69.3% kill rate). Left uncommitted for review.

Prompt (14:41, reproducibility catch):

> "Guide hướng dẫn này tập trung vào việc hướng dẫn người dùng tự thực hiện việc
> viết test và kiểm thử Mutation Testing trên coupon feature của EShop. Vấn đề
> là hiện tại nội dung hướng dẫ còn chung chung, vẫn còn bị ràng buộc một số
> ràng buộc số liệu (kết quả số liệu ghi trong guide là không chính xác, đó là
> dữ liệu khi thực thi test thực tế do team tự thêm vào chớ không phải là kết
> quả theo guide)
>
> Hãy cập nhật guide rõ ràng và chính xác hơn bằng cách tự trải nghiệm workflow
> này để verification"

M1 caught that the drafted numbers belonged to the team's own 37-test baseline, not to what a reader following only the guide's own steps would actually measure, and required independent re-execution instead of a rewrite from memory. AI copied `apps/backend` into an isolated `/tmp` sandbox, left the real repository untouched, and re-ran `npx jest` / `npx stryker run` for real at three checkpoints. This produced a materially different, correct number (25.93% at step 1, not the team's 69.3%) and surfaced an unplanned finding: the covered-score dropped from 56.76% to 54.55% even as kills increased, a real "coverage lies" example found by executing, not by writing.

Prompt (15:02, audience-scope catch):

> "Về bug được note, đây là bug được tìm ra một cách độc lập, không có mã bug
> (được tìm trong HW02). Do đó, ta cần viết lại để người đọc hiểu được bug mà
> không hề biết về mã bug"

M1 caught that the draft cited internal bug-tracker IDs (`BUG-A`, `BUG-09-001`) from an unrelated homework's catalog that a guide reader cannot access. AI rewrote both bugs as behavior observed independently, with no ticket reference.

Prompt (15:19, self-containment catch):

> "User guide được một cách độc lập cho đại chúng, không liên quan đến codebase
> này. Guide này sẽ được thực hiện trong bối cảnh đã follow hết các bước setup
> ở phía trên cho SUT EShop ở repo gốc chứ không phải trong repo này, và cũng sẽ
> không liên quan đến bất cứ tài liêun ngoài khác tài liệu của EShop."

M1 caught that §3 and §6 still cited this project's internal `BASELINE.md` and "the team's own investigation" - assumptions a general reader cannot satisfy. AI removed every internal-project citation and fixed a report-filename mismatch against the guide's own configuration steps.

Prompt (16:20, sandbox design):

> "Tôi đang thực hiện tạo một môi trường sandbox được phục vụ cho hoạt động Kill
> the Mutant và Activity_Worksheet của hoạt động này. Môi trường sandbox này
> chính là một repository chứa SUT EShop đã được refactor backend với việc chia
> thành các module khác nhau để tách mega controller bên trong backend.js nhằm
> mục đích kiểm thử tập trung hơn, dễ theo dõi hơn so với hiện tại.
>
> Bạn hãy thu thập toàn bộ thông tin cần thiết, sau đó hãy cùng tôi thực hiện
> việc triển khai môi trường sandbox này."

Used to plan and execute the module-level backend refactor for the public sandbox repository (`github.com/lhlam2515/eshop-kill-the-mutant`).

Prompt (18:04, post-commit leak audit):

> "Tôi cần bạn soft-reset các commit trên để sửa các nội dung chứa đáp án, nội
> dung các test-case được copy trạng thái của chúng trước commit cập nhật
> assertion của repo software-testing branch seminar cũng như các comment trong
> bộ test ở sandbox. Nội dung worksheet có thể giữ lại"

After an earlier commit, M1 found that facilitator answer-key values had leaked into test-file comments in both the sandbox and this repo's branch. Required a soft-reset to strip the leaked content while keeping the worksheet prose. AI reverted the affected test-file state, re-ran Stryker to select a replacement mutant, and re-verified the new answer by execution before the final commit `f8c2494`.

Prompt (17:28, evidence-gated commit):

> "Chúng ta đã hoàn thành việc soạn thảo nội dung của User_Guide.md, hãy giúp tôi
> breakdown diff của User_Guide theo nội dung thực hiện ở các task được liệt kê
> trong @seminar/02-planning/weekly-checklist.md và sử dụng commit skill để cập
> nhật nội dung lên lịch sử commit với clear message ngắn gọn thể hiện việc đã
> cập nhật những phần nào của artifacts. Luôn trình bày commit message trước để
> tôi duyệt trước khi thực hiện"

Used the `commit` skill to split the accumulated User_Guide diff into the four per-section commits listed in the Consolidated Evidence table. All 4 proposed commit messages were displayed for review before M1 approved with "Duyệt, thực hiện đi" at 17:49; none were executed unapproved.

## 4. Tasks Planned for Next Week

The next planning period is 2026-07-12 through 2026-07-19 (Week 4 of `weekly-checklist.md`: demo recording + pre-share, gate 2026-07-17).

### Lê Hoàng Lâm (M1)

- `[D1]` Draft and rehearse the seminar demo script (<=10 minutes, covering both
  Stryker and the AI feature); not started this week.
- Record `Demo_Screencast.mp4` and a backup recording.
- Rehearse the end-to-end demo, timed.
- Review Vũ's `[G1]`/`[E2]` output once delivered.

### Vu Van Vu (M2)

- Independently review and be able to explain the `User_Guide.md` sections
  (§1/§2/§4/§5/§7) and `Activity_Worksheet.md` that Lâm committed this week,
  per the AI Usage Guideline's "Understanding" requirement - this content
  currently has no evidence of Vũ's own review.
- `[G1]` Build `Seminar_Slides.pptx` (<=15 slides) using the outline and this
  week's real BASELINE/User_Guide numbers.
- `[E2]` One-page cheat-sheet and a printable worksheet version.
- `[H1]` Push the pre-share package to Moodle by 2026-07-17.

### Shared

- Agree on a corrected task split for the remaining two weeks before 22/07: the
  current cumulative `git shortlog -sn refs/heads/seminar` is 40 Lâm / 2 Vũ,
  and this week added 9/0 - both members must be able to independently present
  any part of the material at the live seminar.
- Dry-run the "Kill the Mutant" activity end-to-end, verify timing <=25 minutes.

## 5. Issues

| Issue | Impact | Required action |
|---|---|---|
| Vũ has zero commits on branch `seminar` for 2026-07-06 to 2026-07-11; cumulative branch history is 40 commits (Lâm) vs 2 (Vũ). `[F1]`, `[F3]`, `[E1]`, `[G1]` and both `[R]` reviews assigned to Vũ this week show no execution evidence. | Single point of failure before the 22/07 live seminar; risks failing the 29/07 parity gate (`git shortlog -sn`, target <=20% variance); Vũ cannot currently demonstrate understanding of content he is nominally responsible for. | Vũ to independently review and be ready to explain the sections Lâm committed this week; group to renegotiate the Week 4-5 task split given only 11 days remain until 22/07. |
| `[D1]` demo script was planned for this week and not started. | Compresses the Week 4 timeline, which already carries `[G1]`, `[E2]`, `[H1]`, and video editing before the 17/07 pre-share deadline. | Draft `[D1]` at the start of Week 4 before starting the screencast recording. |
| `weekly-checklist.md` was last synced at 12:09 (commit `e5bf242`), before the 17:50 User_Guide commits and the 18:33 worksheet commit; the Week 3 boxes for `[F2]`/`[F4]`/`[T9]`/`[E1]` are not yet ticked. | Cosmetic only - the checklist under-reports actual progress. | Tick the remaining Week 3 boxes in the next planning session. |
