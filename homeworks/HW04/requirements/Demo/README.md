# eShop Performance Testing Lab — k6 Demo Suite

A ready-to-run performance testing suite for the **eShop** SUT, built with
[Grafana k6](https://k6.io). One shared shopping journey drives six test types;
you flip between them by changing VU count, ramp shape and hold time.

## What's inside

```
eshop-perf-lab/
├── k6/
│   ├── config.js          # BASE_URL, SLOs, thresholds (edit these first)
│   ├── lib/journey.js     # the shared login→browse→search→cart→checkout journey
│   ├── 00-smoke.js        # sanity check — run this first
│   ├── 01-load.js         # LOAD    — ramp to peak, hold
│   ├── 02-stress.js       # STRESS  — past peak, find the breaking point
│   ├── 03-spike.js        # SPIKE   — instant flash crowd
│   ├── 04-soak.js         # SOAK    — moderate load held for hours
│   ├── 05-breakpoint.js   # CAPACITY— arrival-rate ramp to the knee
│   ├── ci-gate.js         # SHIFT-LEFT smoke load gate for CI
│   └── .github/workflows/perf.yml   # example GitHub Actions gate
└── mock/
    └── server.js          # a tiny fake eShop so the demo runs with zero setup
```

## Quick start (no eShop needed — uses the mock)

```bash
# 1. Install k6:  https://grafana.com/docs/k6/latest/set-up/install-k6/
# 2. Start the mock eShop in one terminal:
node mock/server.js
# 3. In another terminal, run any test (defaults to http://localhost:5000):
k6 run k6/00-smoke.js
k6 run k6/01-load.js
```

## Run against your real eShop (local / Docker)

Point the suite at your instance with `-e BASE_URL`:

```bash
k6 run -e BASE_URL=http://localhost:5000 k6/01-load.js
k6 run -e BASE_URL=http://localhost:5000 -e USER_EMAIL=you@eshop.test -e USER_PASS=secret k6/01-load.js
```

For a short demo of the soak test, shorten the hold:

```bash
k6 run -e SOAK_HOLD=3m k6/04-soak.js
```

## The eShop API contract these scripts assume

| Method | Path                       | Purpose            |
|--------|----------------------------|--------------------|
| POST   | `/auth/login`              | returns `{ token }` |
| GET    | `/products?page=&size=`    | catalog list `{ items[] }` |
| GET    | `/products/{id}`           | product detail     |
| GET    | `/products/search?q=`      | search results     |
| POST   | `/cart/items`              | add to cart (auth) |
| POST   | `/checkout`                | place order → `{ orderId }` (auth) |

If your eShop uses different paths, edit `lib/journey.js` — everything else stays.

## Reading the results

- **`http_req_duration` p(95)/p(99)** — the latency distribution. Watch the tail, not the mean.
- **`http_req_failed`** — error rate; must stay under the SLO.
- **`http_req_duration{step:checkout}`** — checkout's own latency budget.
- **`checks`** — functional correctness under load (login worked, order returned).
- A **non-zero exit code** means a threshold (SLO) was breached — that's what fails CI.

## SLOs (edit in `config.js`)

| Signal            | Target        |
|-------------------|---------------|
| p95 latency       | < 800 ms      |
| p99 latency       | < 1500 ms     |
| checkout p95      | < 1200 ms     |
| error rate        | < 1%          |
