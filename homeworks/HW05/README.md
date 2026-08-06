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
| [artifacts/test-plans/](./artifacts/test-plans/) | The three test plans (Load / Stress / Spike) plus the endurance script |
| [artifacts/test-data/](./artifacts/test-data/) | One CSV input file per endpoint group |
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

## Scope: Endpoint Selection

Three endpoint groups, one scenario each, no overlap with other group members (section 5).

| Group | Endpoint / workflow | Scenario paired | Why this pairing | Test plan | CSV input |
| ----- | ------------------- | --------------- | ---------------- | --------- | --------- |
| Read-heavy | TBD | TBD | TBD | TBD | TBD |
| Auth-heavy | TBD | TBD | TBD | TBD | TBD |
| Transactional | TBD | TBD | TBD | TBD | TBD |

### Non-overlap declaration

TBD: list which endpoint / workflow each other member of Group 02 is testing, and confirm no duplication.

---

## Test Summary

### Scenarios Run

| Scenario | Endpoint group | VUs (peak) | Duration | Requests | Error rate | p95 (ms) | RPS (avg) |
| -------- | -------------- | ---------- | -------- | -------- | ---------- | -------- | --------- |
| Load | TBD | | | | | | |
| Stress | TBD | | | | | | |
| Spike | TBD | | | | | | |
| Endurance / soak | TBD | | | | | | |

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
| Hostname | TBD (must match previous homework deployments, section 11) |
| CPU | TBD |
| RAM | TBD |
| Storage | TBD |
| OS / kernel | TBD |
| Node.js version | TBD |
| k6 version | TBD |

Evidence: `assets/screenshots/hardware/`.

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
- [ ] One CSV input file per endpoint group (three files, not one shared file)
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
