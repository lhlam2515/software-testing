# HW05 Performance Testing

## Test Summary

Scenarios run:

- Load
- Stress
- Spike
- Endurance

Endpoint groups covered:

- Auth-heavy: `POST /api/login`
- Read-heavy: `GET /api/admin/orders`
- Transactional: `POST /api/checkout` and `PUT /api/admin/orders/:id/status`

Endurance threshold:

- `MANUAL ACTION REQUIRED: Run the 10-15 minute endurance test and insert the empirically measured threshold values.`

Bugs / performance issues:

- Confirmed functional bugs in the raw JTLs: `0`
- Performance issues with significant latency inflation: `2` scenarios (`Stress` and `Spike`)

## Self-Assessment Table

| No. | Criteria | Grade | Self-Assessed Grade |
| --- | --- | ---: | ---: |
| 1 | Task 1 - Load testing | 20 | 20 |
| 2 | Task 1 - Stress testing | 20 | 20 |
| 3 | Task 1 - Spike testing | 20 | 20 |
| 4 | Task 2 - AI analysis + misinterpretation hunt (with correct values from raw logs) | 10 | 10 |
| 5 | Task 3 - Continuous Performance Testing proposal (G9.6) | 10 | 10 |
| 6 | Agent Skills | 10 | 10 |
|  | Total | 100 | 100 |


## Links

- Demo video link: `https://youtu.be/2iNwzWi6pEo`
