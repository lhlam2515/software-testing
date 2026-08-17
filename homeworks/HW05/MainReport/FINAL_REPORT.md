# HW05 Final Report

## 1. Introduction

This report documents the current HW05 performance-testing evidence available in the workspace. The existing Load, Stress, and Spike JMeter plans were preserved, and the report relies on the raw JTL and HTML artifacts already present in `homeworks/HW05/jmeter/results/`.

## 2. SUT and Environment

- SUT: EShop backend API
- Backend source: [`apps/backend/server.js`](apps/backend/server.js)
- Database: SQLite in [`apps/backend/database.js`](apps/backend/database.js)
- Base URL: `http://localhost:3000`

## 3. Hardware Specifications

Hardware evidence available in the workspace:

- Screenshot: [`hardware.png`](hardware.png)

Observed values in the screenshot:

| Item | Value |
| --- | --- |
| Computer name | `DESKTOP-0E72VR4` |
| OS | `Windows 11 Home Single Language 64-bit (10.0, Build 26200)` |
| System manufacturer | `ASUSTeK COMPUTER INC.` |
| System model | `Vivobook_ASUSLaptop X1505VA_A1505VA` |
| BIOS | `X1505VA.300` |
| CPU | `13th Gen Intel(R) Core(TM) i9-13900H (20 CPUs), ~2.6GHz` |
| Installed RAM | `16384MB RAM` |

MANUAL ACTION REQUIRED: capture `dxdiag` or equivalent hardware evidence and add a task-manager screenshot pair for each scenario.

## 4. Performance Methodology

The workspace artifacts show a CSV-driven JMeter workflow with these data files:

- `jmeter/data/admin-users.csv`
- `jmeter/data/users.csv`
- `jmeter/data/products.csv`
- `jmeter/data/checkout-data.csv`
- `jmeter/data/workflow-data.csv`

The plans currently exercise an admin-oriented workflow:

1. `POST /api/login`
2. `POST /api/checkout`
3. `GET /api/admin/orders`
4. `PUT /api/admin/orders/:id/status`
5. verification readback through `GET /api/admin/orders`

The backend confirms bearer-token authentication and SQLite-backed order reads/updates.

## 5. Workload Model

Current plan files:

- [`jmeter/plans/23127543_Load_20260813.jmx`](jmeter/plans/23127543_Load_20260813.jmx)
- [`jmeter/plans/23127543_Stress_20260813.jmx`](jmeter/plans/23127543_Stress_20260813.jmx)
- [`jmeter/plans/23127543_Spike_20260813.jmx`](jmeter/plans/23127543_Spike_20260813.jmx)

Scenario parameters observed in the JMX files:

| Scenario | Threads | Ramp-up | Duration | Think time |
| --- | ---: | ---: | ---: | ---: |
| Load | 10 | 60 s | 300 s | 250 ms |
| Stress | 30 | 90 s | 600 s | 150 ms |
| Spike | 50 | 8 s | 120 s | 50 ms |

## 6. Load Test

Evidence:

- Raw JTL: [`jmeter/results/load/load-20260815-145319.jtl`](jmeter/results/load/load-20260815-145319.jtl)
- HTML report: [`jmeter/results/load/report-20260815-145319/index.html`](jmeter/results/load/report-20260815-145319/index.html)

Results:

| Metric | Value |
| --- | ---: |
| Samples | 9,870 |
| Success | 9,870 |
| Failures | 0 |
| Error rate | 0.00% |
| Average response time | 19.99 ms |
| Median | 16 ms |
| P90 | 34 ms |
| P95 | 44 ms |
| P99 | 78 ms |
| Min | 2 ms |
| Max | 750 ms |
| Throughput | 33.00 req/s |

## 7. Stress Test

Evidence:

- Raw JTL: [`jmeter/results/stress/stress-20260815-150225.jtl`](jmeter/results/stress/stress-20260815-150225.jtl)
- HTML report: [`jmeter/results/stress/report-20260815-150225/index.html`](jmeter/results/stress/report-20260815-150225/index.html)

Results:

| Metric | Value |
| --- | ---: |
| Samples | 22,903 |
| Success | 22,903 |
| Failures | 0 |
| Error rate | 0.00% |
| Average response time | 573.56 ms |
| Median | 493 ms |
| P90 | 1,138 ms |
| P95 | 1,381 ms |
| P99 | 1,729.98 ms |
| Min | 5 ms |
| Max | 2,200 ms |
| Throughput | 38.23 req/s |

## 8. Spike Test

Evidence:

- Raw JTL: [`jmeter/results/spike/spike-20260815-073023.jtl`](jmeter/results/spike/spike-20260815-073023.jtl)
- HTML report: [`jmeter/results/spike/report-20260815-073023/index.html`](jmeter/results/spike/report-20260815-073023/index.html)

Results:

| Metric | Value |
| --- | ---: |
| Samples | 3,142 |
| Success | 3,142 |
| Failures | 0 |
| Error rate | 0.00% |
| Average response time | 1,799.11 ms |
| Median | 1,822.5 ms |
| P90 | 2,715.9 ms |
| P95 | 2,929 ms |
| P99 | 3,405.31 ms |
| Min | 9 ms |
| Max | 4,011 ms |
| Throughput | 26.39 req/s |

## 9. Endurance / Soak Test

MANUAL ACTION REQUIRED: run a 10-15 minute sustained test and save the outputs below:

- `HW05/endurance/endurance.jmx`
- `HW05/endurance/endurance-results.jtl`
- `HW05/endurance/endurance-report/`

Current workspace evidence that can inform the endurance candidate:

- Load is the only scenario with a low and steady p95 of 44 ms.
- Stress remains error-free but its p95 rises to 1,381 ms.
- Spike remains error-free but its p95 rises to 2,929 ms.

## 10. Endurance Threshold

Because the endurance run has not been executed yet in this workspace, the threshold cannot be claimed as measured.

- Maximum stable concurrent users: `MANUAL ACTION REQUIRED`
- Maximum stable RPS: `MANUAL ACTION REQUIRED`
- Error rate: `MANUAL ACTION REQUIRED`
- Average response time: `MANUAL ACTION REQUIRED`
- P95: `MANUAL ACTION REQUIRED`
- P99: `MANUAL ACTION REQUIRED`
- Memory: `MANUAL ACTION REQUIRED`
- CPU: `MANUAL ACTION REQUIRED`
- Duration: `MANUAL ACTION REQUIRED`
- Load where degradation began: `MANUAL ACTION REQUIRED`

Reason for selecting threshold:

- The existing Load results are the most stable evidence in the workspace, so they are the best starting candidate for a soak run.
- Stress is already showing sustained latency inflation, which suggests the real stable ceiling is below the Stress setting.

## 11. Results

Confirmed from raw JTLs:

- Load completed with zero sampler failures.
- Stress completed with zero sampler failures.
- Spike completed with zero sampler failures.

## 12. Resource Usage

Workspace evidence is insufficient to claim sustained CPU/memory telemetry over time.

Available evidence only:

- `hardware.png` shows Task Manager at the time of capture.

MANUAL ACTION REQUIRED: capture the requested JMeter + Task Manager paired screenshots during each run.

## 13. Bugs and Performance Issues

Confirmed workspace evidence:

- No raw JTL sampler failures are present in the existing scenario logs.
- Confirmed functional bugs in the raw JTL evidence: `0`

Observed performance degradation:

- Stress p95 is 1,381 ms.
- Spike p95 is 2,929 ms.

Observed performance issues in the raw JTL evidence: `2` scenarios with significant tail-latency inflation.

These are performance regressions in a latency sense, but not confirmed functional bugs from the raw JTLs alone.

## 14. AI Performance Analysis

See [`ai-analysis/AI_PERFORMANCE_ANALYSIS.md`](ai-analysis/AI_PERFORMANCE_ANALYSIS.md).

## 15. AI Misinterpretation Hunt

See [`ai-analysis/HUMAN_REVIEW_MISINTERPRETATION_HUNT.md`](ai-analysis/HUMAN_REVIEW_MISINTERPRETATION_HUNT.md).

## 16. Human Review and Corrections

See [`ai-analysis/HUMAN_REVIEW_MISINTERPRETATION_HUNT.md`](ai-analysis/HUMAN_REVIEW_MISINTERPRETATION_HUNT.md) for the review structure.

## 17. AI Optimization Recommendations

See [`ai-analysis/AI_OPTIMIZATION_JUDGMENT.md`](ai-analysis/AI_OPTIMIZATION_JUDGMENT.md).

## 18. Feasible vs Hallucinated Classification

See [`ai-analysis/AI_OPTIMIZATION_JUDGMENT.md`](ai-analysis/AI_OPTIMIZATION_JUDGMENT.md).

## 19. Continuous Performance Testing Proposal

See [`continuous-performance/CONTINUOUS_PERFORMANCE_TESTING.md`](continuous-performance/CONTINUOUS_PERFORMANCE_TESTING.md).

## 20. Flow Chart

Mermaid source:

- [`continuous-performance/continuous-performance-flowchart.mmd`](continuous-performance/continuous-performance-flowchart.mmd)

MANUAL ACTION REQUIRED: render the Mermaid flow chart to PNG if your submission requires an image file.

## 21. Cost / False-Alarm Trade-offs

Continuous performance testing should balance:

- Cost of running long tests on every commit
- False positives from machine noise or background workload
- False negatives from thresholds that are too loose
- Reproducibility versus speed




