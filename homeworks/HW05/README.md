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
| HTML report folder | k6 HTML summary report generated from `handleSummary()` | `artifacts/results/html-reports/` |
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

Section 6, Task 1 requires all three test plans (Load / Stress / Spike) to exercise **the same end-to-end workflow**, covering all three endpoint groups in one journey — not one endpoint per scenario as in earlier assignments. The workflow chosen here is a customer purchase journey:

| Step | Group | Endpoint | SRS | Why this step is representative |
| ---- | ----- | -------- | --- | -------------------------------- |
| 1. Login | Auth-heavy | `POST /api/login` | FR-02 | Password verification plus JWT issuance, guarded by a counter-based lockout: each failure adds 2 to `login_attempts`, and the account locks for 180 seconds once the counter reaches 3 (so 2 consecutive failures trigger it). The only auth-heavy endpoint the SRS exposes. |
| 2. Browse / search | Read-heavy | `GET /api/products?search={keyword}` | FR-05 | Search over the product name is the only read path whose cost grows with data volume — every other read resolves by primary key or returns a small fixed table. |
| 3. Add to cart | Transactional | `POST /api/cart` | FR-07 | An authenticated write that mutates per-user state. It does not upsert: every call `push()`es a new entry onto an in-memory array keyed by user id, unbounded and lost on backend restart. |
| 4. Checkout | Transactional | `POST /api/checkout` | FR-08 | Inserts one order row per request. Notably, it does **not** read from the cart populated in step 3 — it takes `total_amount` / `shipping_address` directly from the request body, so cart and order are functionally disconnected (see `BUG_REPORT.md`, BUG-05-LAM-007). |

All three scenarios (Load, Stress, Spike) run this same four-step journey; they differ only in load profile (VU ramp, duration, surge shape), not in which endpoints they hit. Journey logic lives in `artifacts/test-plans/lib/journey.js`, shared configuration in `artifacts/test-plans/config.js`, and each named test plan (`23127216_{Type}_{YYYYMMDD}.js`) only declares its `options`.

**Login is cached per VU, not repeated every iteration.** If every iteration called `/api/login`, a 100-VU Load run alone could exhaust the account pool and trigger lockout well before Spike ever runs — a failure mode that did not exist under the previous one-endpoint-per-scenario model. Each VU logs in once and reuses its token; only a small, dedicated low-VU sub-scenario inside Spike deliberately uses invalid credentials (`auth_credentials.csv`, `valid_flag=false`) to exercise and observe the lockout behaviour in a controlled, bounded way.

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

Three of the four steps use different endpoints, and the narratives differ (customer purchase vs. admin operations); `POST /api/login` is shared because it is the SRS's only auth-heavy endpoint. Status: **pending** — sent for re-confirmation, not yet acknowledged by the other member.

---

## Test Summary

### Scenarios Run

| Scenario | Workflow | VUs (peak) | Duration | Requests | Error rate | p95 (ms) | RPS (avg) |
| -------- | -------- | ---------- | -------- | -------- | ---------- | -------- | --------- |
| Load | Login → search → cart → checkout | | | | | | |
| Stress | Login → search → cart → checkout | | | | | | |
| Spike | Login → search → cart → checkout (+ lockout sub-scenario) | | | | | | |
| Endurance / soak | Login → search → cart → checkout | | | | | | |

### Endurance Threshold (section 6, Task 1)

| Metric | Value |
| ------ | ----- |
| Maximum stable RPS | TBD |
| Breaking point (VUs at which error rate exceeds threshold) | TBD |
| p95 latency at the stable ceiling | TBD |
| Backend memory ceiling (RSS) | TBD |
| Backend CPU at ceiling | TBD |
| Soak duration | TBD (10 to 15 minutes required) |

### Issues Found

| Metric | Count |
| ------ | ----- |
| Functional bugs (error responses, crashes, regressions) | TBD |
| Performance issues (latency, error rate) | TBD |
| Reported on GitHub Issues | TBD |

### Hardware

| Field | Value |
| ----- | ----- |
| Hostname | `FedoraOS` — HW01-HW04 did not require a hardware report, so no prior hostname declaration exists to match against (section 11); this is the first declaration and becomes the baseline for later assignments |
| CPU | 11th Gen Intel(R) Core(TM) i5-11300H (8) @ 4.40 GHz |
| RAM | 15.30 GiB |
| Storage | 474.35 GiB (btrfs) |
| OS / kernel | Fedora Linux 44 (Workstation Edition) x86_64, kernel 7.1.5-201.fc44.x86_64 |
| Node.js version | v24.11.1 |
| k6 version | v1.0.0 (commit/41b4984b75, go1.24.2, linux/amd64) |

Evidence: `assets/screenshots/hardware/fastfetch.png` — hostname `FedoraOS` visible in the prompt, matching the declaration above (section 11 hostname consistency).

---

## Demo Videos

| Video | Content | Link | Duration |
| ----- | ------- | ---- | -------- |
| Main demo | Three scenarios, tool and resource monitor in the same frame, Vietnamese narration | TBD | TBD (6 minutes minimum in total) |
| Agent Skill demo | End-to-end run of the skill on one complete endpoint group | TBD | TBD |

---

## Self-assessment

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1** | Task 1 — Load testing | 20 | |
| **2** | Task 1 — Stress testing | 20 | |
| **3** | Task 1 — Spike testing | 20 | |
| **4** | Task 2 — AI analysis + misinterpretation hunt (with correct values from raw logs) | 10 | |
| **5** | Task 3 — Continuous Performance Testing proposal (G9.6) | 10 | |
| **6** | Agent Skills | 10 | |
| | **Total** | **100** | |

---

## Submission Checklist (section 14)

- [ ] Main report, Markdown + PDF
- [ ] Three test plans named `23127216_{ScenarioType}_{YYYYMMDD}`
- [ ] Three raw per-request logs (the `.jtl` equivalent), attached in full
- [ ] Three HTML report folders
- [ ] CSV input data for the shared workflow (credentials, search keywords, cart/checkout payloads)
- [ ] Resource-monitor screenshots per run
- [ ] Hardware report screenshot and spec table
- [ ] Endurance / soak run with the threshold reported in numbers
- [ ] Unlisted YouTube demo video, at least 6 minutes, tool + monitor in the same frame, own narration
- [ ] AI Critique (200 to 300 words) and AI Audit Report, Markdown + PDF
- [ ] Git commit log (`assets/commit-log.txt`), one commit per procedure step
- [ ] Bug report with GitHub Issue screenshots
- [ ] Agent Skill + demo video link
- [ ] Public GitHub repository link included in the report
- [ ] Zip named `23127216_HW05_AI_Performance_{SelfAssessedGrade}.zip`
