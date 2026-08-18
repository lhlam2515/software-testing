# Continuous Performance Testing Flowchart

This flowchart describes how the continuous performance-testing proposal works for the HW05 backend.

```mermaid
flowchart TD
  A[Git commit pushed] --> B[Detect changed files]
  B --> C{Performance-sensitive change?}

  C -- No --> D[Skip full performance suite]
  D --> E[Record skip decision]
  E --> Z[End]

  C -- Yes --> F{Change risk level}
  F -- Low risk --> G[Run smoke performance test]
  F -- High risk --> H[Run Load, Stress, and Spike tests]

  G --> I[Collect raw JTL and HTML report]
  H --> I

  I --> J[Extract p95 and other key metrics]
  J --> K[Compare results with baseline]
  K --> L{p95 regression or sampler failure?}

  L -- No --> M[Mark as pass]
  M --> N[Store results as candidate baseline]
  N --> Z[End]

  L -- Yes --> O[Flag regression]
  O --> P[Attach summary and evidence]
  P --> Q[Developer review]
  Q --> Z[End]
```

## Notes

- Performance-sensitive changes include backend code, database/schema changes, authentication, checkout, order-management logic, JMeter plans, and test data.
- Smoke tests are intended for small routine changes.
- Full Load, Stress, and Spike tests are intended for higher-risk changes.
- Baselines should come from the last known good run for the same scenario family.
- A regression should be flagged when the p95 delta exceeds the allowed threshold or when sampler failures appear.
