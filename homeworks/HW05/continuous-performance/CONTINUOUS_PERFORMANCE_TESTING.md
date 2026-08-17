# Continuous Performance Testing Proposal

This proposal describes a continuous performance-testing model for the HW05 backend.

## Goal

Run targeted performance checks when a commit is likely to affect response time, throughput, or lockout/auth behavior, and compare the resulting p95 against a stored baseline.

## Model

1. Watch the SUT repository for commits.
2. Detect changed files in the commit range.
3. Classify the change as performance-sensitive or not.
4. Run a smoke performance test for small changes.
5. Run the full Load/Stress/Spike suite for backend, SQL, auth, or checkout changes.
6. Collect the raw JTL artifact.
7. Calculate p95 from the JTL.
8. Compare p95 against the scenario baseline.
9. Flag a regression when the delta exceeds the allowed threshold.
10. Send the result to developer review.

## Performance-sensitive paths

- `apps/backend/**`
- database schema or migration files
- authentication, checkout, cart, or order-management code
- JMeter plans and CSV test data

## Smoke vs full tests

- Smoke test: short, cheap, and used for routine commit gating.
- Full test: longer and reserved for high-risk or release-critical changes.

## Baseline selection

- Use the last known good raw JTL for each scenario.
- Pin the baseline to a commit hash and scenario name.
- Refresh the baseline only after a deliberate review.

## Suggested gating rule

- p95 regression threshold: 10% over baseline for routine changes
- emergency/manual review threshold: 20% over baseline or any sampler failure

## CI/CD integration

- On each relevant commit, run the selected scenario in CI.
- Publish JTL and HTML report artifacts.
- Store the baseline comparison as a build artifact.

## Artifacts

- Raw `.jtl`
- HTML report folder
- summary JSON or Markdown
- regression note for reviewers

## Test duration

- Smoke: a few minutes
- Load: around 5 minutes
- Stress: 10 minutes or release-gated
- Endurance: periodic, not on every commit

## Cost and trade-offs

- Running every commit gives the best coverage but is expensive.
- Selective execution reduces cost but can miss cross-cutting regressions.
- Lower thresholds catch more issues but produce more false alarms.
- Higher thresholds reduce false alarms but may hide real slowdowns.
- Environmental noise can skew latency, especially on shared hardware.

## Reproducibility

- Fix the test data
- Fix the environment as much as possible
- Keep the baseline and the comparison run in the same scenario family
- Record the exact JMeter parameters

## Flow chart

See [`continuous-performance-flowchart.mmd`](continuous-performance-flowchart.mmd).

MANUAL ACTION REQUIRED: render the Mermaid file to PNG if required by submission.
