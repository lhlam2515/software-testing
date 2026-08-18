# AI Audit Report · HW05

---

## 1. Student Information

| Field                   | Value                               |
| ----------------------- | ----------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                        |
| Student ID:             | 23127216                            |
| Class / Cohort:         | 23KTPM1                             |
| Assignment ID:          | HW#05                               |
| Assignment date:        | TBD                                 |
| AI tool(s) used:        | TBD                                 |
| AI used:                | [x] Yes [ ] No                      |

---

## 2. Instructions

- Add **one section** per AI-generated artifact (each of the three test plans, the CSV generators, the raw-log analysis, the continuous-testing proposal, the Agent Skill, etc.).
- Each artifact section contains **5 sub-items**: fill all of them.
  - **(1) Prompt**: paste verbatim; do **not** paraphrase.
  - **(2) AI Output**: paste verbatim output **or** embed a labelled screenshot.
  - **(3) Verdict**: mark exactly one: `VALID` · `INVALID` · `INCOMPLETE`.
  - **(4) Reasoning**: 2-5 sentences citing a course slide, ISTQB section, or a named performance-testing concept.
  - **(5) Student Fix**: show the corrected artifact; highlight every change.

---

## 3. Audit

### Artifact #1: Load test plan (`23127216_Load_20260817.js`)

> **Requirement mapping:** Task 1, Load scenario

#### (1) Prompt + Tool

**Tool:** Claude Code (Sonnet 5)
**Time:** 16:46 17/08/2026 (Entry 002, step P-2), building on the shared journey design from Entry 001 (16:09 17/08/2026, P-1) and generated into the final file in Entry 006 (17:17 17/08/2026, P-6).

The AI was asked to propose Load's VU count, ramp-up/ramp-down, think-time, and duration for `shopJourney()`, grounded in the real 4-core/8-thread host (i5-11300H, 15.30 GiB RAM, k6 v1.0.0, Node v24.11.1), with round, ungrounded VU values (e.g. 50/100/200) explicitly forbidden and a mandatory CPU-self-interference warning required. See prompt_log.md, Entry 002.

#### (2) AI Output

The AI proposed peak VU = 80, ramp-up 60s, hold 300s, ramp-down 30s, and think-time 1-3s (login to search), 2-4s (search to cart), 1-2s (cart to checkout), derived from a Little's Law-style calculation: average think-time per iteration approximately 6.5s, giving approximately 0.153 iteration/s per VU, so 80 VU approximately 12.2 iteration/s of checkout writes. It validated this with a real 80 VU/40s probe on the actual machine (1,224 iterations, 0% error, `http_req_duration` p95 = 9.63ms), and flagged a CPU self-interference risk threshold (300-500 VU without think-time) plus a RAM/swap warning observed on the machine at the time. See prompt_log.md, Entry 002.

#### (3) Verdict

`INCOMPLETE`

#### (4) Reasoning

The AI's unconstrained first instinct across every P-2/P-3/P-4 prompt was to reach for textbook round VU values instead of deriving parameters from the actual test-bed capacity (REPORT.md section 4.2). The 80 VU figure for Load only became trustworthy once it was pinned down by a real calibration probe and cross-checked against a Little's Law-style relationship between VU count, average think-time, and resulting write rate, not accepted on the AI's proposal alone. This matches the general performance-testing principle that a load profile must be grounded in the SUT's measured capacity, not in generic reference values.

#### (5) Student Fix

Every scenario prompt (P-2/P-3/P-4) explicitly forbade ungrounded round numbers and required a hardware-grounded justification per parameter (prompt_log.md, Entries 002-004); the 80 VU value was accepted only after the 80 VU/40s probe confirmed 0% error and p95 = 9.63ms (REPORT.md section 4.2). No further post-hoc numeric correction was needed for Load beyond this proactive prompt constraint plus probe validation.

---

### Artifact #2: Stress test plan (`23127216_Stress_20260817.js`)

> **Requirement mapping:** Task 1, Stress scenario

#### (1) Prompt + Tool

**Tool:** Claude Code (Sonnet 5)
**Time:** 16:48 17/08/2026 (Entry 003, step P-3), building on Entry 001 and generated into the final file in Entry 006 (17:17 17/08/2026, P-6).

The AI was asked to propose Stress's VU staging, ramp/hold, and think-time for `shopJourney()`, grounded in the same real hardware, and to identify the expected breaking point by reasoning from SQLite's single-writer characteristic as the most likely bottleneck. See prompt_log.md, Entry 003.

#### (2) AI Output

Before proposing stage boundaries, the AI ran an isolated zero-think-time checkout calibration directly on the machine (20/60/150 VU, 15s each) and found throughput plateaus at approximately 100-140 req/s regardless of VU (103 to 137 to 92 req/s) while latency grows from 217ms p50 to 1.55s p50 at 150 VU, the signature of a serialized single-writer queue rather than CPU exhaustion. From that measurement it derived a real breaking-point estimate of approximately 110-155 VU under journey-realistic think-time and proposed a 5-stage design (0 to 40 to 120 to 220 to 350 to 0 VU, 20s ramps, 90s holds) that straddles that range, plus a think-time of 0.3-0.8s/0.2-0.5s. See prompt_log.md, Entry 003.

#### (3) Verdict

`VALID`

#### (4) Reasoning

REPORT.md section 4.5 ("Human review: what the AI got wrong") lists four specific correction rows, none of which names the Stress design itself as wrong. The calibration methodology, isolate the suspected bottleneck, measure it at zero think-time, then derive the breaking-point range before choosing stage boundaries, matches the ISTQB stress-testing objective of determining behavior beyond peak load specifically to find the breaking point. The real execution (REPORT.md section 4.6.2) confirms the predicted single-writer-bottleneck signature: throughput stays flat near 100-140 req/s from stage1 to stage5 while checkout p95 jumps 16.6x between stage2 (120VU, 427.5ms) and stage3 (220VU, 7,093.2ms), matching rather than contradicting the AI's own calibration-derived hypothesis.

#### (5) Student Fix

No correction needed. The stage boundaries and calibration methodology proposed in Entry 003 were accepted as designed; the only constraint layered on top was the same hardware-grounding requirement given to every scenario prompt, which the AI had already satisfied here through the isolated calibration probe rather than through a later fix.

---

### Artifact #3: Spike test plan (`23127216_Spike_20260817.js`)

> **Requirement mapping:** Task 1, Spike scenario

#### (1) Prompt + Tool

**Tool:** Claude Code (Sonnet 5)
**Time:** 17:00 17/08/2026 (Entry 004, step P-4) and 18:06 17/08/2026 (Entry 007, step P-7, edge-case hardening including the lockout sub-scenario), generated into the final file in Entry 006 (17:17 17/08/2026, P-6).

Entry 004 asked the AI to propose Spike's surge shape (baseline to peak VU, hold, drop, recovery), grounded in the real hardware and the 200-account pool as a natural VU ceiling. Entry 007 separately asked the AI to add a dedicated low-VU lockout sub-scenario with an exact 5%-of-pool fail budget and correct assertions against the SUT's real lockout response. See prompt_log.md, Entry 004 and Entry 007.

#### (2) AI Output

Entry 004: baseline 15 VU, surge to 200 VU in 5s, hold 30s, drop to 15 VU in 5s, recovery hold 40s, think-time 0s throughout (deliberate, to simulate a traffic dump), peak VU tied exactly to the seeded 200-account pool so no VU shares an account. Entry 007: a `lockoutProbe` sub-scenario (5 VU x 3 iterations) using only `valid_flag=false` rows, a fail-fast budget guard capped at 5% of the account pool (10 accounts), and an assertion checking the exact 401/401/403 sequence. See prompt_log.md, Entry 004 and Entry 007.

#### (3) Verdict

`INCOMPLETE`

#### (4) Reasoning

REPORT.md section 4.5, rows 1 and 2, document two concrete AI mistakes specific to this artifact. The AI's early draft assumed the lockout response was `423 Locked`, the RFC-conventional status for "resource locked", when the SUT actually returns a plain `401` for the first two failures and `403` only once the counter reaches its threshold. An earlier assertion also accepted either `401` or `403` as "locked", too loose to verify the exact 2-consecutive-failures boundary rule. Both were corrected only after reading `server.js` directly and walking through the `login_attempts += 2` / `>= 3` logic by hand, matching the boundary-value-analysis principle that a boundary condition (here, the exact iteration at which a counter crosses its threshold) requires an exact per-case assertion, not an accept-any-plausible-value check.

#### (5) Student Fix

Corrected in Entry 007 (prompt_log.md): the lockout status assertion was tightened from "401 or 403" to an exact per-iteration expectation (`expectLocked = __ITER >= 2`), so iterations 0-1 must return `401` and iteration 2 must return `403`, matching `server.js:40-44`'s check-before-compare ordering. REPORT.md section 4.7 confirms the corrected sequence reproduced 100% pass on iterations 0 and 2 during real execution.

---

### Artifact #4: TBD (Raw log analysis and threshold suggestions)

> **Requirement mapping:** Task 2

Task 2 (AI analysis + misinterpretation hunt) has not been executed yet as of 18/08/2026, see REPORT.md section 5. This artifact will be audited once Task 2's prompt_log entry exists.

*Same 5 sub-items as Artifact #1. The misinterpretation hunt in `REPORT.md` section 5.2 is the Student Fix for this artifact, and each corrected value must cite the raw log it came from.*

---

### Artifact #5: TBD (Optimization proposals)

> **Requirement mapping:** Task 2, feasible-or-hallucinated classification

Task 2 (AI analysis + misinterpretation hunt) has not been executed yet as of 18/08/2026, see REPORT.md section 5. This artifact will be audited once Task 2's prompt_log entry exists.

*Same 5 sub-items as Artifact #1.*

---

### Artifact #6: Bug report and GitHub Issues (`BUG_REPORT.md`, prompt_log.md Entry 008-009)

> **Requirement mapping:** Task 1 section 6 (issue reporting). Not one of the template's five fixed items; added here because it is a substantial, real AI-generated deliverable, the full Bug Summary and Detailed Findings content of `BUG_REPORT.md`, plus 4 real filed GitHub Issues with screenshots, with clear evidence to audit.

#### (1) Prompt + Tool

**Tool:** Claude Code (Sonnet 5)
**Time:** 18:22 18/08/2026 (Entry 008, step P-8, drafting `BUG_REPORT.md`'s Bug Summary and Detailed Findings from raw log evidence) and 19:55 18/08/2026 (Entry 009, step P-9, filing real GitHub Issues and capturing screenshots).

Entry 008 asked the AI to read raw k6 logs and monitor CSVs for the 4 executed scenarios (Load/Stress/Spike/Soak), write up 2 already-referenced findings (BUG-05-LAM-003, -007) in full, scan all 4 raw log files for any additional anomaly, classify the Spike login-fail-rate behavior as by-design or a real bug, and fill the Bug Summary/Detailed Findings tables, citing an exact path/line for every number and marking anything unproven as "needs human verification". Entry 009 asked the AI to file real GitHub Issues for the findings in `BUG_REPORT.md`, add a verification checklist inside the body of any issue marked "needs human verification", and capture full-page screenshots of the published issues. See prompt_log.md, Entry 008 and Entry 009.

#### (2) AI Output

Entry 008 produced the Bug Summary table and 4 Detailed Findings blocks (BUG-05-LAM-003, -007, -008, -009) now in `BUG_REPORT.md`, classifying 1 functional bug (BUG-05-LAM-007, Critical) and 3 performance issues (BUG-05-LAM-003 High, BUG-05-LAM-008 Low, BUG-05-LAM-009 Low), with every quoted number tied to a specific file/line (e.g. `monitor_soak.csv:2`/`:627`, `raw_stress.csv:683720-683728`) and 3 of the 4 findings explicitly flagged "needs human verification" for their root cause. Entry 009 filed 4 real GitHub Issues (#37-#40) on `lhlam2515/software-testing`, each carrying the full Detailed Findings content, added a "Needs human verification" checklist section to the 3 hedged issues, captured 4 full-page screenshots into `assets/screenshots/issues/`, and updated `BUG_REPORT.md`'s "Pending - to be filed" placeholders with the real issue links. See prompt_log.md, Entry 008 and Entry 009.

#### (3) Verdict

`VALID`

#### (4) Reasoning

Neither REPORT.md section 4.5 nor `BUG_REPORT.md` names any specific point where this artifact's classification or evidence was wrong; each finding's severity, type (functional vs. performance), and evidence citation is traceable to a real file/line as required for an ISTQB-style incident report (identification, environment, expected/actual, evidence). The 3 "needs human verification" flags are not a defect in the AI's output: they are the AI correctly applying the distinction between a confirmed defect backed by direct evidence (e.g. BUG-05-LAM-007's static code read) and a suspected defect whose root cause is a reasoned inference rather than a proven trace (e.g. BUG-05-LAM-003's leak source inferred from code, not from a heap profiler), which is exactly the honest-hedging behavior a defect report is expected to show instead of asserting false certainty.

#### (5) Student Fix

No correction needed. The Bug Summary and Detailed Findings content was accepted as generated and committed as-is (commit `0aa60a8` per Entry 008); the GitHub Issue links and screenshot references were then added on top by the same AI-assisted step (Entry 009) rather than as a separate human correction.

---

## 4. Summary of AI Accuracy

| Metric                                     | Count | Percentage |
| ------------------------------------------ | ----- | ---------- |
| Total AI-generated artifacts audited       | 4 of 4 audited artifacts (2 still pending Task 2 execution) | 100% |
| **VALID** (correct, accepted as-is)        | 2     | 50%        |
| **INVALID** (wrong; rejected)              | 0     | 0%         |
| **INCOMPLETE** (acceptable after edits)    | 2     | 50%        |

VALID: Artifact #2 (Stress), Artifact #6 (Bug report and GitHub Issues). INCOMPLETE: Artifact #1 (Load), Artifact #3 (Spike). Artifact #4 (Raw log analysis) and Artifact #5 (Optimization proposals) are excluded from this count, Task 2 has not been executed yet.

---

## 5. Conclusion (When should AI be used or not)

Across the four artifacts audited, a clear pattern emerges. Left to invent implicit defaults, such as VU counts and ramp shapes, without a real system to check against, the AI fell back on textbook round numbers; those became trustworthy only once prompts demanded hardware-grounded, probe-validated figures. Pointed instead at a specific, checkable fact, an exact HTTP status code, an account-lockout threshold rule, it got that fact wrong once and right only after the source code was actually read, not assumed from general convention. The strongest results came from the Stress calibration and the bug report: give the AI a measurement to make before it designs, and a rule to hedge honestly when evidence is incomplete, and the output holds up unedited. The practical rule: never let it pick a load parameter or an assertion target from convention alone; force it to cite a specific source line or measured number first.

---

## 6. Mandatory Disclosure

- **Test plans (Task 1):** the Load, Stress, and Spike test plans were initially generated by Claude Code (Sonnet 5) (prompt_log.md Entries 001-007); I reviewed and corrected the Spike `lockoutProbe` assertion (an RFC-style `423` assumption versus the SUT's actual `401`/`403` sequence, tightened to an exact per-iteration check) and required every VU/ramp/think-time parameter proposal to be validated against a real hardware probe before accepting it. Full audit in section 3, Artifact #1-3.
- **CSV input data (Task 1):** the three CSV files (`auth_credentials.csv`, `read_keywords.csv`, `cart_checkout_payloads.csv`) were initially generated by Claude Code (Sonnet 5) (prompt_log.md Entry 006); I verified each file against the seeded database (account pool, keyword weights, product id range) rather than accepting the generated values as-is.
- **Test execution and evidence capture (Task 1):** TBD
- **Raw log analysis (Task 2):** TBD
- **Continuous performance testing proposal (Task 3):** TBD
- **Agent Skill (section 7):** TBD
- **Bug report and GitHub Issues (`BUG_REPORT.md`):** the Bug Summary and Detailed Findings content, and the 4 filed GitHub Issues (#37-#40), were initially generated by Claude Code (Sonnet 5) (prompt_log.md Entries 008-009); I accepted them as-is after verifying each evidence citation against its source file/line. Full audit in section 3, Artifact #6.
- **AI Critique (`REPORT.md` section 8):** written entirely by me, no AI drafting, per the assignment's anti-AI-cheat constraint on this artifact.
- **Deviation from course AI policy:** TBD

Task 2 (raw log analysis, optimization proposals), Task 3 (continuous performance testing proposal), Agent Skill, and AI Critique have not been completed yet and are not disclosed here; they will be added once executed.

---

## Signature

| Field                   | Value                                 |
| ----------------------- | ------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                          |
| Student ID:             | 23127216                              |
| Class / Cohort:         | 23KTPM1                               |
| Course:                 | CS423 / CSC13003 – Software Testing   |
| Instructor:             | Dr. Lam Quang Vu                      |
| Date:                   | TBD                                   |
| Signature:              | ![Lê Hoàng Lâm](assets/signature.png) |

---

## References

- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education.* CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Hardman, P. (2025). *A Post-AI Learning Taxonomy.*
- k6 documentation, Grafana Labs.
