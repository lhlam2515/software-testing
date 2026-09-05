# FR-02 `POST /api/login` — State Model

## Classification

Implicit state — the failed-attempt counter and 30-second lockout window described in
srs.md FR-02 (lines 41-42) make the same event (`POST /api/login` with the same or
different credentials) produce different observable behavior depending on the current
counter value and lock status. There is no explicit named-state field in the contract
(no `status` enum is returned), so this is modeled as implicit counter-/time-driven
state, not an explicit state machine.

Justification: srs.md FR-02, lines 41-42 — "Sau mỗi lần đăng nhập sai, hệ thống tăng bộ
đếm lên đúng 1 đơn vị. Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm
khóa 30 giây."

## States

| State | Meaning |
| --- | --- |
| S0 | Unlocked, consecutive-failure counter = 0 (initial state for a never-failed or freshly-registered account) |
| S1 | Unlocked, counter = 1 |
| S2 | Unlocked, counter = 2 |
| S3 (LOCKED) | Locked for 30s; reached on the 3rd consecutive failure |
| S? | UNSPECIFIED post-condition state — reachable from a successful login at S1/S2, or from S3 after the 30s window elapses. Neither source states the resulting counter value; not asserted as S0 without verification (see Notes). |

## State table

| Row ID | Coverage ID | Start state | Event / guard | Expected action | Finish state | Valid? | Trace |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-01 | TR-01 | S0 | Failed login attempt (wrong password or unregistered email) | Counter +1 (srs.md FR-02 line 41); error response, cause not leaked (line 42) | S1 | Yes | srs.md FR-02 lines 41-42 |
| S-02 | TR-02 | S1 | Failed login attempt (2nd consecutive) | Counter +1 | S2 | Yes | srs.md FR-02 line 41 |
| S-03 | TR-03 | S2 | Failed login attempt (3rd consecutive) | Counter +1 reaches 3 -> lock triggered for 30s | S3 (LOCKED) | Yes | srs.md FR-02 line 42 |
| S-04 | TR-04 | S0 | Successful login (correct email + password) | `200 OK`, `token` + `user` returned (api_specification.md 1.2) | S0 (self-loop; no prior failures to reset) | Yes | api_specification.md 1.2 |
| S-05 | TR-05 | S1 | Successful login (correct email + password) after 1 prior failure | `200 OK`, `token` + `user` returned | S? — UNSPECIFIED whether the counter resets to 0. Action is documented; resulting counter state is not. | Partially — action valid, finish state unresolved | srs.md FR-02 (silent on reset); flagged in specs/requirements.md |
| S-06 | TR-06 | S2 | Successful login (correct email + password) after 2 prior failures | `200 OK`, `token` + `user` returned | S? — same unresolved-reset caveat as S-05 | Partially — action valid, finish state unresolved | srs.md FR-02 (silent on reset) |
| S-07 | TR-07 | S3 (LOCKED) | Any login attempt with WRONG credentials, still inside the 30s window | Rejected; error response, cause not leaked (line 42) | S3 (self-loop / terminal-state re-entry) | Yes | srs.md FR-02 line 42 |
| S-08 | TR-08 | S3 (LOCKED) | Login attempt with CORRECT credentials, still inside the 30s window | Rejected — "tài khoản bị tạm khóa" (account temporarily locked) reads as blocking all attempts regardless of credential correctness | S3 (self-loop / terminal-state re-entry, guard violation of the credential check by the lock guard) | Yes | srs.md FR-02 line 42 |
| S-09 | TR-09 | S3 (LOCKED) | 30 seconds elapse with no further attempt | Lock lifts; next attempt is evaluated normally again | S? — UNSPECIFIED whether the counter resets to 0 or persists (e.g. immediately re-lockable on the next single failure) | Partially — unlock event valid, finish counter value unresolved | srs.md FR-02 line 42 (silent on post-lock counter) |

## BVA extension on the lock TTL (extends TR-09)

The 30-second lockout duration (srs.md FR-02 line 42) is a documented, real numeric
boundary — the smallest observable time unit for a TTL, which
`equivalence-partitioning-and-bva.md` explicitly allows as a BVA domain. A 3-value model
is applied: boundary (`LB`) plus the nearest value on each side, using 1 second as the
smallest observable step for this TTL.

| Row ID | Coverage ID | Start state | Event / guard | Expected action | Finish state | Valid? | Trace |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-10 | BVA-01 (LB-1) | S3 (LOCKED) | Attempt at T=29s after lock start (1s before the documented boundary) | Still inside the documented 30s window; rejected, cause not leaked | S3 (self-loop) | Yes | srs.md FR-02 line 42 |
| S-11 | BVA-02 (LB) | S3 (LOCKED) | Attempt at exactly T=30s after lock start | Boundary point; UNSPECIFIED whether 30s is inclusive (still locked) or exclusive (already unlocked) — neither source states edge inclusivity | S3 or S? — UNRESOLVED, do not assume | Partially — event valid, outcome unresolved | srs.md FR-02 line 42 (silent on inclusivity) |
| S-12 | BVA-03 (LB+1) | S3 (LOCKED) | Attempt at T=31s after lock start (1s after the documented boundary) | Documented: lock has expired, attempt is evaluated normally again (same event/action as TR-09) | S? — UNSPECIFIED post-lock counter value, same caveat as TR-09 | Partially — unlock action valid, finish counter value unresolved | srs.md FR-02 line 42 |

## Notes

- All-transitions coverage target: 9/9 documented transitions (TR-01..TR-09). Three of
  them (TR-05, TR-06, TR-09) land on an unresolved finish state; they are still included
  because the *triggering event and expected action* are documented — only the resulting
  counter value is unspecified. Do not treat "S?" as equivalent to S0 without execution
  evidence; master-test-cases.md carries this caveat into the oracle column.
- Scope of the counter (per-email vs. per-IP vs. both) is not documented — flagged in
  `specs/requirements.md`. Test cases assume per-email scope only because SRS FR-02
  discusses lockout in terms of "tài khoản" (the account), but this is the closest
  documented reading, not an invented rule.
- No state beyond S3 exists (e.g. no documented 4th/5th-failure escalation), so no
  cell is left empty inside the modeled range.
