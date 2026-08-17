# Endurance Summary

Status: `MANUAL ACTION REQUIRED`

This file is the endurance-test summary scaffold required by the assignment.

What is already supported by workspace evidence:

- Load p95: `44 ms`
- Stress p95: `1,381 ms`
- Spike p95: `2,929 ms`

What still needs a real soak run:

- duration of 10-15 minutes at sustained load
- maximum stable concurrent users
- maximum stable RPS
- error rate
- average response time
- p95 and p99 for the endurance run
- CPU and memory telemetry over time
- boundary test at a slightly higher load, if run

Reason for the initial endurance candidate:

- The Load scenario is the clearest stable baseline in the current JTL evidence.
- Stress already shows meaningful latency inflation, so the endurance target should start below that stress setting.

MANUAL ACTION REQUIRED:

1. Copy the most appropriate existing JMX into a real endurance run configuration.
2. Execute the soak test for 10-15 minutes.
3. Save the raw `.jtl` file and HTML report folder.
4. Record CPU, memory, and backend-process telemetry during the run.
5. Replace this scaffold with measured values only.
