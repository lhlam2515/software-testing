# Misinterpretation Table

| Metric | AI Claim | Raw JTL Correct Value | Difference | Explanation |
| --- | --- | --- | --- | --- |
| Load duration | The original run represented a 300 s load test | 299.125 s on `load-20260815-071413.jtl` | N/A | Corrected plan now actually held the scheduler window. |
| Stress duration | The original run represented a 600 s stress test | 599.141 s on `stress-20260815-071958.jtl` | N/A | Corrected plan now actually held the scheduler window. |
| Spike duration | The original run represented a 120 s spike test | 119.075 s on `spike-20260815-073023.jtl` | N/A | Corrected plan now actually held the scheduler window. |
| Load latency | Original AI-style quick read would suggest the load run was "fast" without context | p95 is 44 ms | Context matters | Load is fast, but the full end-to-end workflow includes five samplers per iteration. |
| Stress latency | A simplistic read would call 573.56 ms average "acceptable" | p95 is 1,381 ms | Context matters | Stress shows substantial queueing and contention despite zero errors. |
| Spike latency | A simplistic read would focus only on zero errors | p95 is 2,929 ms | Context matters | Spike is functionally successful but performance-degraded, which is the expected signal. |
