# AI Performance Analysis

This section is AI-generated analysis based on the raw JTL files present in the workspace.

## Data analyzed

- `jmeter/results/load/load-20260815-145319.jtl`
- `jmeter/results/stress/stress-20260815-150225.jtl`
- `jmeter/results/spike/spike-20260815-073023.jtl`

## Summary of actual results

| Scenario | Samples | Success | Failures | Error % | Avg | Median | P90 | P95 | P99 | Min | Max | Throughput |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Load | 9,870 | 9,870 | 0 | 0.00% | 19.99 ms | 16 ms | 34 ms | 44 ms | 78 ms | 2 ms | 750 ms | 33.00 req/s |
| Stress | 22,903 | 22,903 | 0 | 0.00% | 573.56 ms | 493 ms | 1,138 ms | 1,381 ms | 1,729.98 ms | 5 ms | 2,200 ms | 38.23 req/s |
| Spike | 3,142 | 3,142 | 0 | 0.00% | 1,799.11 ms | 1,822.5 ms | 2,715.9 ms | 2,929 ms | 3,405.31 ms | 9 ms | 4,011 ms | 26.39 req/s |

## AI-generated interpretation

- Load is the only scenario that looks comfortably stable from a latency perspective.
- Stress shows the first clear degradation zone because p95 rises above one second while errors remain at zero.
- Spike shows strong burst sensitivity: the system remains functional, but tail latency is multi-second.
- The most plausible stable sustained region from the evidence is near the Load configuration, not the Stress or Spike settings.

## Suggested thresholds

- Maximum stable sustained load: around the Load scenario, because p95 remains 44 ms and there are no failures.
- Degradation begins: somewhere between Load and Stress, because Stress jumps to 1,381 ms p95 while still producing no failures.
- Instability boundary: not proven by errors in these logs, but Spike clearly crosses a practical performance boundary on latency alone.

## Possible bottlenecks

- SQLite write/read contention under concurrent checkout and admin-order updates.
- Synchronous or serialized request handling in the Node backend.
- Database access patterns for admin reads and order updates.

## Uncertain conclusions

- CPU and memory bottlenecks cannot be proven from the JTL files alone.
- The exact saturation point cannot be claimed without the missing endurance run and resource telemetry.
- No functional lockout was observed in the raw JTLs supplied here.

## Optimization ideas

- Tune SQLite journaling mode and concurrency behavior.
- Review query patterns for admin order reads and status updates.
- Consider application-level caching only for read-heavy endpoints if correctness allows it.
- Keep auth and transactional paths lightweight to reduce queueing.

## Evidence basis

The analysis above is grounded in the raw durations, response-time percentiles, success counts, and throughput values from the JTL files. It does not use fabricated resource telemetry or screenshots.
