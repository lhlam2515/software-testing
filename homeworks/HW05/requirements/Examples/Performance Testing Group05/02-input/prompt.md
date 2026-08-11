# Prompt for the recorded AI-augmented demo

Paste the prompt below into Codex after the traditional baseline is complete.

```text
Use the installed k6 load-test skill and k6 MCP tools.

Read:
- api_specification.md
- ai-demo/requirements.md
- k6/scripts/baseline-har.js
- test-data/seed-manifest.json

Create an AI-augmented realistic shopping performance test for EShop.

Requirements:
- Preserve only verified endpoints and request fields.
- Use BASE_URL from __ENV.BASE_URL.
- Distribute the 50 seeded test users across VUs.
- Every iteration must authenticate and load products.
- About 70% of users search or inspect a product.
- About 30% add a product to the cart.
- About 10% apply LOADTEST and complete checkout.
- Select products dynamically and include realistic think time.
- Add checks for every critical response.
- Define thresholds for p95 below 500 ms, errors below 1%, checks above 99%,
  and checkout p95 below 1000 ms.
- Include meaningful groups, request names, and custom metrics.

Save the untouched first draft as ai-demo/ai-generated-v1.js.
Validate it with k6 MCP and save the validation evidence as
ai-demo/validation-v1.txt.

Then audit the draft against the API specification. List any invented endpoint,
hard-coded dynamic value, missing authentication, unrealistic workload choice,
or SQLite concurrency risk. Apply only verified corrections, save the final
script as k6/scripts/ai-realistic-shopping.js, and save a concise review as
ai-demo/ai-analysis.md.

Do not run the 50-VU test until I explicitly approve it.
```

---

## Prompt template — AI-assisted Stress test

```text
Use $k6-stress-test to create a draft only.

Read:
- api_specification.md
- ai-demo/requirements.md
- k6/scripts/baseline-har.js
- test-data/seed-manifest.json
- backend/seed_performance.js

Requirements:
- Target the authorized local EShop backend through __ENV.BASE_URL.
- Reuse only verified endpoints, fields, authentication, and dynamic correlation
  from the API specification and baseline script.
- Use the 50 seeded users safely and select products dynamically.
- Preserve a realistic shopping workflow with deterministic personas and think
  time. Use approximately 70% discovery, 30% cart, and 10% checkout behavior.
- Design a ramping-vus stress profile with baseline, incremental load levels,
  a hold at each important level, a peak hold, and recovery.
- Evaluate 25, 50, 100, and 150 VUs. Hold 150 VUs long enough for dashboard
  sampling instead of touching the target and immediately ramping down.
- Treat local SQLite and the shared load-generator/SUT machine as explicit
  limitations. Do not claim local capacity represents production capacity.

SLO and evidence:
- Overall p95 < 500 ms.
- HTTP errors < 1%.
- Checks > 99%.
- Business errors < 1%.
- Checkout p95 < 1000 ms.
- Add phase or load-level evidence for p95, p99, errors, throughput, active VUs,
  checkout, and recovery so the first SLO-violating level is visible.

Output:
- Summarize the inputs and assumptions.
- Show the proposed stage table before writing code.
- Save the draft as k6/scripts/ai-stress-shopping-draft.js.
- Validate it with k6 MCP and show the validation output.
- Save a concise human-audit checklist as ai-demo/stress-analysis.md.
- Provide seed, run, Web Dashboard, HTML export, and restore commands, but do
  not execute the seed or test until I explicitly approve it.
```

## Prompt template — AI-assisted Spike test

```text
Use $k6-spike-test to create a draft only.

Read:
- api_specification.md
- ai-demo/requirements.md
- k6/scripts/baseline-har.js
- test-data/seed-manifest.json
- backend/seed_performance.js

Requirements:
- Target the authorized local EShop backend through __ENV.BASE_URL.
- Reuse only verified endpoints, fields, authentication, and dynamic values.
- Use the same core shopping journey in warm-up, spike, and recovery so the
  phase comparison is meaningful.
- Use the 50 seeded users safely, dynamic products, deterministic personas, and
  realistic think time.
- Model a sudden concurrent-user surge with three clearly tagged phases:
  warm-up at 5 VUs, spike at 120 VUs, and recovery at 5 VUs.
- Keep the spike sudden; do not turn it into a gradual stress ramp.
- Treat local SQLite and local hardware as test-environment limitations.

SLO and evidence:
- Overall HTTP errors < 1% and checks > 99%.
- Business errors < 1%.
- Spike-phase p95 < 1000 ms and spike HTTP errors < 5%.
- Recovery-phase p95 < 500 ms and recovery HTTP errors < 1%.
- Add phase tags and metrics for spike p95/p99, errors, checkout, dropped
  iterations when applicable, recovery p95, and recovery time.

Output:
- Summarize the inputs and assumptions.
- Show the warm-up, spike, and recovery table before writing code.
- Save the draft as k6/scripts/ai-spike-shopping-draft.js.
- Validate it with k6 MCP and show the validation output.
- Save a concise human-audit checklist as ai-demo/spike-analysis.md.
- Provide seed, run, Web Dashboard, HTML export, and restore commands, but do
  not execute the seed or test until I explicitly approve it.
```

## Prompt template — AI-assisted Volume test

```text
Use $k6-volume-test to create a draft only.

Read:
- api_specification.md
- ai-demo/requirements.md
- k6/scripts/baseline-har.js
- test-data/seed-manifest.json
- backend/seed_performance.js
- backend/seed_volume_products.js

Requirements:
- Target the authorized local EShop backend through __ENV.BASE_URL.
- Compare the 500-product baseline with a 5,000-product volume dataset.
- Keep the workload controlled at 20 VUs for 90 seconds so dataset size is the
  main changed variable; do not combine this test with a stress ramp.
- Cover catalog loading, search, and product detail using verified endpoints.
- Select product IDs dynamically and validate response shapes and record counts.
- Add deterministic read-heavy personas and realistic think time.
- Parameterize EXPECTED_PRODUCTS and the dataset label through environment
  variables.
- Document that the backend must stop before SQLite seed/reset operations.

SLO and evidence:
- Catalog p95 < 500 ms.
- Search p95 < 500 ms.
- HTTP errors < 1%.
- Checks > 99%.
- Verify at least 5,000 returned products for the volume run.
- Measure catalog/search/detail p95 and p99, response payload bytes, total data
  received, throughput, and correctness.
- Flag full-catalog payload growth or missing pagination even if thresholds pass.

Output:
- Summarize the inputs and assumptions.
- Show a baseline-versus-volume experiment table before writing code.
- Save the draft as k6/scripts/ai-volume-products-draft.js.
- Validate it with k6 MCP and show the validation output.
- Save a concise human-audit checklist as ai-demo/volume-analysis.md.
- Provide baseline seed, volume seed, verification, run, Web Dashboard, HTML
  export, and restore commands, but do not seed or run until I explicitly
  approve it.
```
