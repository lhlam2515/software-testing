# HW05 Performance Testing Submission


## Self-Assessment

| No. | Criteria | Grade | Self-Assessed Grade |
| --- | --- | ---: | ---: |
| 1 | Task 1 - Load testing | 20 | 20 |
| 2 | Task 1 - Stress testing | 20 | 20 |
| 3 | Task 1 - Spike testing | 20 | 20 |
| 4 | Task 2 - AI analysis + misinterpretation hunt (with correct values from raw logs) | 10 | 10 |
| 5 | Task 3 - Continuous Performance Testing proposal (G9.6) | 10 | 10 |
| 6 | Agent Skills | 10 | 10 |
|  | Total | 100 | 100 |


## Performance Testing Scenarios

### Load

- Purpose: validate the system under a steady expected workload.
- Scenario: the admin workflow runs at the load-plan settings.
- Endpoint groups covered: authentication, order creation, order lookup, and order status update.
- Existing results: zero sampler failures; average response time 12.56 ms; p95-equivalent percentile recorded in the HTML/JSON summary is 45.14 ms for the total transaction group.

### Stress

- Purpose: observe behavior under a heavier sustained workload.
- Scenario: the same admin workflow runs at the stress-plan settings.
- Endpoint groups covered: authentication, order creation, order lookup, and order status update.
- Existing results: zero sampler failures; average response time 464.21 ms; p95-equivalent percentile recorded in the HTML/JSON summary is 1627.99 ms for the total transaction group.

### Spike

- Purpose: observe the system during a sudden sharp increase in traffic.
- Scenario: the same admin workflow runs at the spike-plan settings.
- Endpoint groups covered: authentication, order creation, order lookup, and order status update.
- Existing results: zero sampler failures; average response time 1485.76 ms; p95-equivalent percentile recorded in the HTML/JSON summary is 2987.47 ms for the total transaction group.

## Endurance Threshold

The current repository contains an endurance run in [`jmeter/results/endurance/endurance-20260818-083624.jtl`](jmeter/results/endurance/endurance-20260818-083624.jtl) and its HTML report in [`jmeter/results/endurance/report-20260818-083624/`](jmeter/results/endurance/report-20260818-083624/).

Documented endurance evidence from the current run:

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

## Endpoint Coverage

The performance tests cover these endpoint groups:

- authentication: `POST /api/login`
- transactional order creation: `POST /api/checkout`
- read-heavy order inspection: `GET /api/admin/orders`
- order administration and state update: `PUT /api/admin/orders/:id/status`

## Performance Issues / Bugs

- Documented functional bugs from the raw JTL evidence: `0`
- Documented performance issues with significant latency inflation: `2` scenarios (`Stress` and `Spike`)

## Demo Video

- Unlisted YouTube demo video: <https://youtu.be/2iNwzWi6pEo>
