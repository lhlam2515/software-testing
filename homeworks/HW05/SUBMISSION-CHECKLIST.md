# HW05 Submission Checklist

## Requirement Status

| Requirement | Status | Evidence/File | Remaining action |
| --- | --- | --- | --- |
| Load plan uses same E2E workflow | ✅ Complete | `jmeter/plans/23127543_Load_20260813.jmx` | None |
| Stress plan uses same E2E workflow | ✅ Complete | `jmeter/plans/23127543_Stress_20260813.jmx` | None |
| Spike plan uses same E2E workflow | ✅ Complete | `jmeter/plans/23127543_Spike_20260813.jmx` | None |
| CSV-driven workflow | ✅ Complete | `jmeter/data/workflow-data.csv` and the three JMX plans | None |
| Distinct listener/report types | ✅ Complete | Load Summary Report, Stress Aggregate Report, Spike View Results Tree | None |
| Load duration | ✅ Complete | `jmeter/results/load/load-20260815-071413.jtl` | None |
| Stress duration | ✅ Complete | `jmeter/results/stress/stress-20260815-071958.jtl` | None |
| Spike duration | ✅ Complete | `jmeter/results/spike/spike-20260815-073023.jtl` | None |
| Raw JTL logs | ✅ Complete | Three `.jtl` files in `jmeter/results/` | None |
| HTML reports | ✅ Complete | Three `report-<timestamp>/index.html` folders | None |
| AI JTL analysis | ✅ Complete | `ai/analysis/jtl-analysis.md` | None |
| Misinterpretation hunt | ✅ Complete | `ai/analysis/misinterpretation-table.md` | None |
| Optimization review | ✅ Complete | `ai/analysis/optimization-review.md` | None |
| AI critique | ✅ Complete | `report/AI-Critique.md` | None |
| Continuous testing proposal | ⚠️ Manual action required | `report/HW05-report.md` section 16 | Expand if your instructor expects a separate flowchart file |
| Endurance test evidence | ⚠️ Manual action required | `report/HW05-report.md` section 11 | Capture a 10-15 minute sustained test with resource monitoring |
| Resource monitor screenshot | ⚠️ Manual action required | Not available in workspace | Capture Task Manager/htop in the same frame as JMeter |
| Hardware spec evidence | ⚠️ Manual action required | Not available in workspace | Capture dxdiag/screenfetch and a spec table |
| Demo video | ⚠️ Manual action required | `video/youtube-link.txt` preserved | Record/upload the actual unlisted video |
| GitHub issues evidence | ⚠️ Manual action required | Not available in workspace | Create issue only if you have a real defect with screenshot |
| Git commit log | ⚠️ Manual action required | Not verified in this pass | Export the commit log to text |

## Final Scenario Results

| Scenario | Duration | Samples | Success | Failures | Error % | Avg | Median | P90 | P95 | P99 | Min | Max | Throughput |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Load | 299.125 s | 9,870 | 9,870 | 0 | 0.00% | 19.99 ms | 16 ms | 34 ms | 44 ms | 78 ms | 2 ms | 750 ms | 33.00 req/s |
| Stress | 599.141 s | 22,903 | 22,903 | 0 | 0.00% | 573.56 ms | 493 ms | 1,138 ms | 1,381 ms | 1,729.98 ms | 5 ms | 2,200 ms | 38.23 req/s |
| Spike | 119.075 s | 3,142 | 3,142 | 0 | 0.00% | 1,799.11 ms | 1,822.5 ms | 2,715.9 ms | 2,929 ms | 3,405.31 ms | 9 ms | 4,011 ms | 26.39 req/s |

## Remaining Manual Evidence

1. Capture a screenshot of JMeter and the resource monitor in the same frame for each scenario.
2. Capture hardware evidence:
   - `dxdiag` or screenfetch equivalent
   - a concise hardware-spec table in Markdown
3. Record the unlisted demo video with Vietnamese narration and upload it.
4. Export or capture the git commit log if your submission package requires it.
5. Create GitHub Issues only for real defects that you can support with screenshots.

## Submission Readiness

The JMeter core is now in much better shape for submission. The remaining blockers are manual evidence items that cannot be safely fabricated in this workspace.
