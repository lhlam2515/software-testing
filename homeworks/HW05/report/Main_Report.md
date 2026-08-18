# HW05 Performance-Testing Report

## 1. Introduction

This report summarizes the HW05 performance-testing submission. It covers the Load, Stress, Spike, and Endurance evidence already present in the repository.

## 2. System Under Test

- SUT: EShop backend API
- Backend source: [`../apps/backend/server.js`](../apps/backend/server.js)
- Database: SQLite in [`../apps/backend/database.js`](../apps/backend/database.js)
- Base URL: `http://localhost:3000`

## 3. Test Environment

Hardware evidence is stored in [`../evidence/hardware/hardware.png`](../evidence/hardware/hardware.png).

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

## 4. Test Data

The JMeter workflow uses the existing CSV files in [`../jmeter/data/`](../jmeter/data/):

- `admin-users.csv`
- `users.csv`
- `products.csv`
- `checkout-data.csv`
- `workflow-data.csv`

The workflow covers these endpoint groups:

- authentication: `POST /api/login`
- transactional order creation: `POST /api/checkout`
- read-heavy order inspection: `GET /api/admin/orders`
- order administration and state update: `PUT /api/admin/orders/:id/status`

## 5. Performance Testing Methodology

The existing JMeter plans are:

- [`../jmeter/plans/23127543_Load_20260813.jmx`](../jmeter/plans/23127543_Load_20260813.jmx)
- [`../jmeter/plans/23127543_Stress_20260813.jmx`](../jmeter/plans/23127543_Stress_20260813.jmx)
- [`../jmeter/plans/23127543_Spike_20260813.jmx`](../jmeter/plans/23127543_Spike_20260813.jmx)

Observed scenario parameters in the JMX files:

| Scenario | Threads | Ramp-up | Duration | Think time |
| --- | ---: | ---: | ---: | ---: |
| Load | 10 | 60 s | 300 s | 250 ms |
| Stress | 30 | 90 s | 600 s | 150 ms |
| Spike | 50 | 8 s | 120 s | 50 ms |

## 6. Load Test

Evidence:

- Raw JTL: [`../jmeter/results/load/load-20260817-142253.jtl`](../jmeter/results/load/load-20260817-142253.jtl)
- HTML report: [`../jmeter/results/load/report-20260817-142253/`](../jmeter/results/load/report-20260817-142253/)

Results:

| Metric | Value |
| --- | ---: |
| Samples | 10,085 |
| Success | 10,085 |
| Failures | 0 |
| Error rate | 0.00% |
| Average response time | 12.56 ms |
| Median | 10 ms |
| P95-equivalent percentile | 45.14 ms |
| Min | 2 ms |
| Max | 614 ms |
| Throughput | 33.69 req/s |

## 7. Stress Test

Evidence:

- Raw JTL: [`../jmeter/results/stress/stress-20260817-143153.jtl`](../jmeter/results/stress/stress-20260817-143153.jtl)
- HTML report: [`../jmeter/results/stress/report-20260817-143153/`](../jmeter/results/stress/report-20260817-143153/)

Results:

| Metric | Value |
| --- | ---: |
| Samples | 26,866 |
| Success | 26,866 |
| Failures | 0 |
| Error rate | 0.00% |
| Average response time | 464.21 ms |
| Median | 512 ms |
| P95-equivalent percentile | 1627.99 ms |
| Min | 3 ms |
| Max | 2887 ms |
| Throughput | 44.77 req/s |

## 8. Spike Test

Evidence:

- Raw JTL: [`../jmeter/results/spike/spike-20260817-144417.jtl`](../jmeter/results/spike/spike-20260817-144417.jtl)
- HTML report: [`../jmeter/results/spike/report-20260817-144417/`](../jmeter/results/spike/report-20260817-144417/)

Results:

| Metric | Value |
| --- | ---: |
| Samples | 19,033 |
| Success | 19,033 |
| Failures | 0 |
| Error rate | 0.00% |
| Average response time | 4324.65 ms |
| Median | 4255 ms |
| P95-equivalent percentile | 8419.64 ms |
| Min | 3 ms |
| Max | 13,834 ms |
| Throughput | 21.08 req/s |

## 9. Endurance Testing

The repository contains an endurance run in [`../jmeter/results/endurance/endurance-20260818-083624.jtl`](../jmeter/results/endurance/endurance-20260818-083624.jtl) and its HTML report in [`../jmeter/results/endurance/report-20260818-083624/`](../jmeter/results/endurance/report-20260818-083624/).

Measured endurance evidence from the current run:

- Duration: 900 seconds
- Threads: 100
- Ramp-up: 60 seconds
- Loops: `-1`
- Total samples: 19,033
- Total errors: 0
- Total throughput: 21.08 req/s
- Total average response time: 4324.65 ms
- Total median response time: 4255 ms
- Total p95-equivalent percentile: 8419.64 ms

## 10. Results and Performance Issues

- Load completed with zero sampler failures.
- Stress completed with zero sampler failures.
- Spike completed with zero sampler failures.
- Endurance completed with zero sampler failures.

Confirmed functional bugs from the raw JTL evidence: `0`

Observed performance issues with significant latency inflation: `2` scenarios

- `Stress`
- `Spike`

## 11. AI-Analysis Critique

The critique of AI assistance is preserved in [`../ai/AI_Critique.md`](../ai/AI_Critique.md).

Key point from that critique:

- AI was helpful for explaining performance-testing concepts and troubleshooting, but its suggestions were not always reliable and had to be validated against the actual JMeter results and evidence.
