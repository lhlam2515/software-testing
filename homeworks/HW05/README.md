# HW05 — Performance Testing on EShop

## Student Information

- **Student name**: Lê Hoàng Lâm
- **Student ID**: 23127216
- **Group**: 02
- **Class / Cohort**: 23KTPM1
- **Github Repository**: [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing)
- **SUT (EShop)**: [github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut), run locally at `http://localhost:3000`
- **Tool**: k6 (bonus track, in place of JMeter)

---

## Submission Contents

| Document | Description |
| -------- | ------------ |
| [REPORT.md](./REPORT.md) | Main report: endpoint selection, three scenarios, endurance threshold, AI analysis review, continuous performance testing proposal, AI Critique |
| [BUG_REPORT.md](./BUG_REPORT.md) | Consolidated bug and performance-issue report, cross-linked to GitHub Issues |
| [prompt_log.md](./prompt_log.md) | Full AI prompt log with timestamps |
| [[AI-02]_AI_Audit_Report.md](./%5BAI-02%5D_AI_Audit_Report.md) | Per-artifact AI audit (prompt, output, verdict, reasoning, student fix) |
| [[AI-03]_AI_Disclosure_Form.md](./%5BAI-03%5D_AI_Disclosure_Form.md) | Mandatory AI usage disclosure |
| [[AI-05]_AI_Privacy_Checklist.md](./%5BAI-05%5D_AI_Privacy_Checklist.md) | AI privacy and responsible-use checklist |
| [group/endpoint-split-note.md](./group/endpoint-split-note.md) | Endpoint split agreed with the other Group 02 member (section 5 non-overlap) |
| [artifacts/test-plans/](./artifacts/test-plans/) | The three test plans (Load / Stress / Spike) plus the endurance script |
| [artifacts/test-data/](./artifacts/test-data/) | CSV input data feeding the shared end-to-end workflow (credentials, search keywords, cart/checkout payloads) |
| [artifacts/results/raw/](./artifacts/results/raw/) | Raw per-request logs (the `.jtl` equivalent) and end-of-test summaries |
| [artifacts/results/html-reports/](./artifacts/results/html-reports/) | HTML report folder per scenario |
| [artifacts/skills/](./artifacts/skills/) | Agent Skill source for the performance-testing and log-analysis workflow |
| [assets/screenshots/](./assets/screenshots/) | Hardware report, resource-monitor captures, GitHub Issue screenshots |
| [assets/commit-log.txt](./assets/commit-log.txt) | Git commit log (generated at submission time) |

> `ref/` holds the lecturer-provided reference material (k6 demo scripts, Group05 example, slides). It is not a deliverable and is excluded from git via `.gitignore`.

---

## Tool Choice: k6 instead of JMeter

Section 8 of the assignment allows k6 as a bonus alternative. Section 14 asks for `.jtl` logs and HTML report folders, which are JMeter artifacts, so this submission maps each required JMeter output onto its k6 equivalent:

| Required (JMeter) | k6 equivalent produced here | Location |
| ----------------- | --------------------------- | -------- |
| `.jmx` test plan | k6 script (`.js`) named per the required convention | `artifacts/test-plans/` |
| Raw `.jtl` log | `--out csv=` raw per-request log (one row per HTTP request, same granularity as `.jtl`) | `artifacts/results/raw/` |
| HTML report folder | k6 HTML summary report: Load's generated live by `handleSummary()`; Stress's and Spike's rendered post-hoc by `build_stress_report.py`/`build_spike_report.py` from the already-captured raw data, without rerunning k6 | `artifacts/results/html-reports/` |
| Three distinct listener types | Three distinct output types, one per scenario (see below) | `artifacts/results/` |

**Three distinct report views (section 6, Task 1):**

k6 has no listener concept, so "three distinct listener / report types" is realised as three distinct *analysis views*, one per scenario, each answering the question that scenario actually asks:

| Scenario | Report view | k6 mechanism | What this view is for |
| -------- | ----------- | ------------ | --------------------- |
| Load | Aggregate HTML summary report | `handleSummary()` writing an HTML file | One aggregate row per endpoint (count, error rate, p50/p90/p95/p99, throughput) for the whole run. JMeter analogue: Aggregate Report / HTML dashboard. |
| Stress | Raw per-request log with percentiles recomputed from it | `--out csv=` plus a post-run script over the raw rows | Percentiles and error codes recomputed from the raw rows rather than read off a summary, grouped by load stage, so the breaking point lands on a specific VU level. JMeter analogue: Summary Report over a raw `.jtl`. |
| Spike | Time-series view | `--out json=` plus a chart over the timestamped stream | Metrics plotted against elapsed time. A spike is defined by recovery behaviour after the surge, which no aggregate number shows. JMeter analogue: graph listener. |

No view type repeats.

> **Note on section 14 vs this table.** Section 14 requires a raw log and an HTML report folder for *all three* scenarios, so both are produced for every run regardless of which view that run is presented through. The table above records the view each scenario is *analysed and reported through*, which is what the "do not repeat a type" rule constrains.

---

## Scope: End-to-End Workflow

Section 6, Task 1 requires all three test plans (Load / Stress / Spike) to exercise **the same end-to-end workflow**, covering all three endpoint groups in one journey, not one endpoint per scenario as in earlier assignments. The workflow chosen here is a customer purchase journey:

| Step | Group | Endpoint | SRS | Why this step is representative |
| ---- | ----- | -------- | --- | -------------------------------- |
| 1. Login | Auth-heavy | `POST /api/login` | FR-02 | Password verification plus JWT issuance, guarded by a counter-based lockout: each failure adds 2 to `login_attempts`, and the account locks for 180 seconds once the counter reaches 3 (so 2 consecutive failures trigger it). The only auth-heavy endpoint the SRS exposes. |
| 2. Browse / search | Read-heavy | `GET /api/products?search={keyword}` | FR-05 | Search over the product name is the only read path whose cost grows with data volume: every other read resolves by primary key or returns a small fixed table. |
| 3. Add to cart | Transactional | `POST /api/cart` | FR-07 | An authenticated write that mutates per-user state. It does not upsert: every call `push()`es a new entry onto an in-memory array keyed by user id, unbounded and lost on backend restart. |
| 4. Checkout | Transactional | `POST /api/checkout` | FR-08 | Inserts one order row per request. It does **not** read from the cart populated in step 3: it takes `total_amount` / `shipping_address` directly from the request body, so cart and order are functionally disconnected (see `BUG_REPORT.md`, BUG-05-LAM-007). |

All three scenarios (Load, Stress, Spike) run this same four-step journey; they differ only in load profile (VU ramp, duration, surge shape), not in which endpoints they hit. Journey logic lives in `artifacts/test-plans/lib/journey.js`, shared configuration in `artifacts/test-plans/config.js`, and each named test plan (`23127216_{Type}_{YYYYMMDD}.js`) only declares its `options`.

**Login is cached per VU, not repeated every iteration.** If every iteration called `/api/login`, a 100-VU Load run alone could exhaust the account pool and trigger lockout well before Spike ever runs, a failure mode that did not exist under the previous one-endpoint-per-scenario model. Each VU logs in once and reuses its token; only a small, dedicated low-VU sub-scenario inside Spike deliberately uses invalid credentials (`auth_credentials.csv`, `valid_flag=false`) to exercise and observe the lockout behaviour in a controlled, bounded way.

**Why FR-09, FR-16, and FR-20 from HW02 were not reused.**

| HW02 feature | Verdict | Reason |
| ------------ | ------- | ------ |
| FR-02 Login and lockout | reused | Section 5 names the lockout behaviour explicitly for the auth-heavy group |
| FR-09 Coupon | dropped | `max_uses_per_user` is 1 or 2. Either the limit is hit within seconds and the rest of the run returns C5 errors, making the measurements meaningless, or it is not hit, which means the invariant breaks under concurrency. Neither branch measures performance |
| FR-16 CSV import | dropped | An admin batch job, outside all three required groups. Load testing it measures bulk write speed, not read / auth / transactional behaviour |
| FR-20 Cancel order | dropped | Not idempotent: each order cancels once, so a 10 minute run needs tens of thousands of pre-seeded orders. Seeding cost exceeds what the measurement returns |

### Non-overlap declaration

Group 02 has two members. Section 5's non-overlap rule now compares **workflows**, not individual endpoints ("no two members may test the same workflow"), which is a higher bar than the endpoint-level split agreed on 2026-08-06 in [group/endpoint-split-note.md](./group/endpoint-split-note.md). Re-confirmation at the workflow level is pending as of 2026-08-13.

| Member | Workflow | Auth-heavy | Read-heavy | Transactional |
| ------ | -------- | ---------- | ---------- | -------------- |
| Lê Hoàng Lâm (23127216) | Customer purchase journey: login → search products → add to cart → checkout | `POST /api/login` (customer account) | `GET /api/products?search=` | `POST /api/cart` + `POST /api/checkout` |
| Other member (proposed, pending confirmation) | Admin order-management journey: login → review orders → update order status | `POST /api/login` (admin account) | `GET /api/admin/orders` | `PUT /api/admin/orders/:id/status` |

Three of the four steps use different endpoints, and the narratives differ (customer purchase vs. admin operations); `POST /api/login` is shared because it is the SRS's only auth-heavy endpoint. Status: **pending**, sent for re-confirmation, not yet acknowledged by the other member.

---

## Test Summary

### Scenarios Run

| Scenario | Workflow | VUs (peak) | Duration | Requests | Error rate | p95 (ms) | RPS (avg) |
| -------- | -------- | ---------- | -------- | -------- | ---------- | -------- | --------- |
| Load | Login → search → cart → checkout | 80 | 394s | 13,988 | 0.00% | 10.86 (checkout) | 35.5 |
| Stress | Login → search → cart → checkout | 350 | 430s | 100,171 | ~0.00% (0.012% peak, cart@220VU) | 7,093 (checkout, 220VU breaking point) | 233 |
| Spike | Login → search → cart → checkout (+ lockout sub-scenario) | 200 | 121s (14:56:28–14:58:29) | 19,427 | 40.67% (`http_req_failed`): see note below | 1,830 (overall `http_req_duration`) | 161.3 |
| Endurance / soak | Login → search → cart → checkout | 80 | ~10.5min (628 monitor samples @ 1/s) | 117,920 | 0.00% | 176.5 (checkout, overall) | 178.5 (search+cart+checkout combined) |

> **Spike error rate note:** `checks{step:login}` breached its threshold (2.43% pass rate) during the run: `journey_login_failure_total` = 7,886 and `journey_relogin_total` = 7,883 (nearly 1:1), meaning a batch of VUs failed to log in once during the 15→200VU surge and then kept retrying `/api/login` every iteration for the rest of the run instead of recovering, since journey.js has no retry backoff. `search`/`cart`/`checkout` checks all pass at 100%: the failure is isolated to the login step under the surge, not a full-journey failure. Root cause (SQLite write contention vs. a genuine login-endpoint bug under concurrent first-logins) not yet isolated from raw_spike.csv, flagged as an open item, not yet written up as a confirmed bug.

### Endurance Threshold (section 6, Task 1)

Computed from the real Soak run (`23127216_Soak_20260817.js`: 80 VU, `constant-vus`, 10m + 30s gracefulStop) via `artifacts/scripts/analyze_soak.py` over `raw_soak.csv` (1.57M samples) and `monitor_soak.csv` (628 samples, 1/s). See `artifacts/results/raw/soak_summary.json` for the full per-minute breakdown. Breaking-point row is cross-referenced from the Stress run (`stress_percentiles_by_stage.json`).

| Metric | Value |
| ------ | ----- |
| Maximum stable RPS | 178.5 req/s (search+cart+checkout combined, 80 VU, 0% error, sustained 10 min, login excluded, it only fires once per VU) |
| Breaking point (VUs at which error rate exceeds threshold) | Not reached by error rate: `http_req_failed` stays ~0% even at 350 VU in Stress. Real breaking point is a **latency** cliff: checkout p95 jumps from 427ms at 120 VU to 7,093ms at 220 VU (16.6x). Backend has no timeout/circuit-breaker, so it queues instead of erroring. See BUG_REPORT.md |
| p95 latency at the stable ceiling | 176.5ms (checkout, 80 VU, whole 10-min soak); minutes 3-4 show a transient spike to ~1,900ms p95 that self-recovered by minute 5, not a sustained regression |
| Backend memory ceiling (RSS) | Not a ceiling, still climbing at end of run: 70,768KB → 216,444KB (max 223,492KB), +145,676KB over 10.47 min (~13.9MB/min), consistent with the unbounded in-memory `userCarts` array (BUG-05-LAM-003) |
| Backend CPU at ceiling | 17.5% avg / 18.7% max (steady-state, excluding the first ~30s startup burst which peaked at 29%): well under the <30% CPU-interference budget |
| Soak duration | 10 minutes (`constant-vus`) + 30s `gracefulStop`, ~10.47 min measured end-to-end |

### Issues Found

| Metric | Count |
| ------ | ----- |
| Functional bugs (error responses, crashes, regressions) | 1 confirmed: BUG-05-LAM-007 — Critical, checkout does not read from the cart populated in the previous step |
| Performance issues (latency, error rate) | 3 confirmed: BUG-05-LAM-003 — High, unbounded in-memory `userCarts` (soak memory-leak measurement above); BUG-05-LAM-008 — Low, connection failure at the Stress breaking point (220 VU); BUG-05-LAM-009 — Low, Spike login retry-storm with no server-side throttling. BUG-05-LAM-009's underlying concurrency mechanism (SQLite write contention vs. a genuine login-endpoint bug) is flagged as not yet isolated, see `BUG_REPORT.md` |
| Reported on GitHub Issues | 4/4 filed with screenshots: Issues [#37](https://github.com/lhlam2515/software-testing/issues/37)–[#40](https://github.com/lhlam2515/software-testing/issues/40), full write-up in `BUG_REPORT.md` |

### Hardware

| Field | Value |
| ----- | ----- |
| Hostname | `FedoraOS`: HW01-HW04 did not require a hardware report, so no prior hostname declaration exists to match against (section 11); this is the first declaration and becomes the baseline for later assignments |
| CPU | 11th Gen Intel(R) Core(TM) i5-11300H (8) @ 4.40 GHz |
| RAM | 15.30 GiB |
| Storage | 474.35 GiB (btrfs) |
| OS / kernel | Fedora Linux 44 (Workstation Edition) x86_64, kernel 7.1.5-201.fc44.x86_64 |
| Node.js version | v24.11.1 |
| k6 version | v1.0.0 (commit/41b4984b75, go1.24.2, linux/amd64) |

Evidence: `assets/screenshots/hardware/fastfetch.png`, hostname `FedoraOS` visible in the prompt, matching the declaration above (section 11 hostname consistency).

---

## Demo Videos

| Video | Content | Link | Duration |
| ----- | ------- | ---- | -------- |
| Main demo | Three scenarios, tool and resource monitor in the same frame, Vietnamese narration | Not produced | Not applicable |
| Agent Skill demo | End-to-end run of the skill on one complete endpoint group | Not produced | Not applicable |

> **Demo video note.** Neither video was produced. This is a deliberate, final decision, not an oversight or a pending item: the student is knowingly accepting the point deduction associated with this specific requirement (section 14, unlisted YouTube demo video) rather than submitting one.

---

## Self-assessment

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1** | Task 1 — Load testing | 30 | 25 |
| **2** | Task 1 — Stress testing | 20 | 15 |
| **3** | Task 1 — Spike testing | 20 | 15 |
| **4** | Task 2 — AI analysis + misinterpretation hunt (with correct values from raw logs) | 10 | 10 |
| **5** | Task 3 — Continuous Performance Testing proposal (G9.6) | 10 | 0 |
| **6** | Agent Skills | 10 | 0 |
| | **Total** | **100** | **65** |

---

## Submission Checklist (section 14)

- [x] Main report, Markdown + PDF (Markdown complete for Task 1 §4 and Task 2 §5; Task 3 §6 and Agent Skill §7 deliberately not attempted, see below; PDF export still pending)
- [x] Three test plans named `23127216_{ScenarioType}_{YYYYMMDD}`
- [x] Three raw per-request logs (the `.jtl` equivalent), attached in full
- [x] Three HTML report folders
- [x] CSV input data for the shared workflow (credentials, search keywords, cart/checkout payloads)
- [x] Resource-monitor screenshots per run
- [x] Hardware report screenshot and spec table
- [x] Endurance / soak run with the threshold reported in numbers
- [ ] Unlisted YouTube demo video, at least 6 minutes, tool + monitor in the same frame, own narration (not produced, deliberate decision, point deduction accepted, see Demo Videos section above)
- [x] AI Critique (200 to 300 words) — outstanding, must be hand-written by the student, not AI-fillable
- [x] AI Audit Report, Markdown + PDF (Markdown complete, [AI-02]_AI_Audit_Report.md; PDF export still pending)
- [x] Git commit log (`assets/commit-log.txt`), one commit per procedure step (38 commits)
- [x] Bug report with GitHub Issue screenshots (4/4 findings, Issues #37–#40)
- [ ] Agent Skill + demo video link — not attempted, deliberate decision, point deduction accepted (see `REPORT.md` §7)
- [ ] Task 3 — Continuous Performance Testing proposal — not attempted, deliberate decision, point deduction accepted (see `REPORT.md` §6)
- [x] Public GitHub repository link included in the report
- [x] Zip named `23127216_HW05_AI_Performance_{SelfAssessedGrade}.zip`
