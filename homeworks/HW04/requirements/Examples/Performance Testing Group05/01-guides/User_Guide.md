# User Guide: EShop Performance Testing with Grafana k6

## 1. Introduction

This guide explains how to prepare, execute, and review performance tests for
the EShop backend with Grafana k6. The project demonstrates two workflows:

| Workflow | Purpose | Main artifact |
| --- | --- | --- |
| Traditional | Reproduce a verified shopping journey captured from browser traffic | `k6/scripts/baseline-har.js` |
| AI-augmented | Use k6 x Agent and Codex to draft, validate, and review a more realistic workload | `k6/scripts/ai-realistic-shopping.js` |

Both measured scenarios use 50 virtual users for five minutes. The shopping
journey covers login, product browsing, search or product discovery, cart,
coupon application, and checkout.

The common service-level objectives (SLOs) are:

| Metric | Target |
| --- | ---: |
| Overall HTTP response time | p95 `< 500 ms` |
| HTTP request failure rate | `< 1%` |
| Successful checks | `> 99%` |
| Checkout response time | p95 `< 1000 ms` |

The AI test also requires `business_errors < 1%`. Run load tests only against
systems that you own or are explicitly authorized to test. The commands in
this guide target the local EShop SUT, not a production environment.

## 2. Install

### 2.1 Prerequisites

Install the following software:

- Node.js 18 or later;
- npm, normally included with Node.js;
- Grafana k6;
- a modern browser for the EShop UI and k6 dashboard;
- Codex CLI or the Codex desktop app for the optional AI workflow.

Verify the main tools:

```powershell
node --version
npm --version
k6 version
```

### 2.2 Install k6

On Windows, use one of the following package managers:

```powershell
# Winget
winget install k6 --source winget

# Chocolatey
choco install k6
```

Alternative platforms:

```bash
# macOS
brew install k6

# Docker
docker pull grafana/k6
```

Open a new terminal after installation and run `k6 version` again.

### 2.3 Install backend dependencies and seed performance data

From the project root:

```powershell
cd backend
npm install
npm run seed:performance
npm start
```

The backend starts at `http://localhost:3000`. Keep this terminal open during
the test. The performance seed creates:

- 8 categories;
- 500 products;
- 50 separate test users;
- 30 fake shipping addresses;
- one administrator account;
- the non-expiring `LOADTEST` coupon;
- a clean SQLite baseline with no previous orders.

Local credentials:

| Account | Email | Password |
| --- | --- | --- |
| Administrator | `admin@eshop.com` | `Admin123!` |
| First test user | `test@eshop.com` | `Test1234!` |
| Remaining test users | `loadtest02@eshop.com` to `loadtest50@eshop.com` | `Test1234!` |

These are fake local test accounts and must not be reused elsewhere.

### 2.4 Start the optional web frontend

Open another terminal from the project root:

```powershell
cd frontend-web
npm install
npm run dev
```

Vite normally exposes the frontend at `http://localhost:5173`. The frontend is
useful for recording the manual shopping journey and HAR, but protocol-level
k6 tests require only the backend.

### 2.5 Optional AI-assistant setup

From the project root, inspect the proposed k6 x Agent changes before applying
them:

```powershell
k6 x agent init --dry-run codex
k6 x agent init codex
k6 x agent status
```

The project already contains `.codex/mcp.json`, which registers the k6 MCP
server. Open Codex from the project root so it can detect the project
configuration:

```powershell
codex
```

Both the Codex CLI and desktop app can use project configuration when the
workspace is opened at the repository root.

## 3. First Test

### 3.1 Confirm that the backend remains running

The backend terminal should display messages similar to:

```text
Server is running on http://localhost:3000
Connected to database
```

The command prompt should not return while the server is running. If the prompt
returns immediately, restart the backend with `npm start`.

### 3.2 Run the Traditional smoke test

Open a second terminal at the repository root and run:

```powershell
k6 run -e BASE_URL=http://localhost:3000 k6/scripts/baseline-smoke.js
```

The smoke test uses 2 VUs for 30 seconds. It verifies login, the 500-product
dataset, cart, coupon, and checkout. Expected results are:

- `http_req_duration` p95 below 500 ms;
- zero HTTP failures;
- 100% successful checks.

Do not continue to the measured run if the smoke test fails. Correct the test
environment or data first.

### 3.3 Reset after a test that creates orders

Stop the backend with `Ctrl+C`, then run:

```powershell
cd backend
npm run reset:performance
npm start
```

The reset command restores the clean performance database. It intentionally
refuses to replace the database while port 3000 is still in use.

## 4. Running the Measured Tests

### 4.1 Traditional HAR-based baseline

The traditional script represents the shopping sequence captured in
`recordings/eshop-shopping.har`. It correlates the login token, user ID,
selected product, coupon result, and checkout order ID at runtime.

From the project root in PowerShell:

```powershell
$env:K6_WEB_DASHBOARD = "true"
$env:K6_WEB_DASHBOARD_OPEN = "true"
$env:K6_WEB_DASHBOARD_PERIOD = "5s"
$env:K6_WEB_DASHBOARD_PORT = "5665"
$env:K6_WEB_DASHBOARD_EXPORT = "results/baseline-report.html"

k6 run --summary-export=results/baseline-summary.json `
  -e BASE_URL=http://localhost:3000 `
  k6/scripts/baseline-har.js
```

The script already defines 50 constant VUs for five minutes. The dashboard is
available at `http://127.0.0.1:5665` while the test is running.

### 4.2 Reset before the AI run

The Traditional test creates orders. Stop the backend, restore the clean
baseline, and restart it before running the AI variant:

```powershell
cd backend
npm run reset:performance
npm start
```

### 4.3 AI-augmented measured run

The final AI script uses the same 50-VU, five-minute load profile. It loads all
50 users and the prepared addresses from `test-data/`, applies randomized think
time, and uses browsing, cart, and checkout personas.

From the project root in another terminal:

```powershell
$env:K6_WEB_DASHBOARD = "true"
$env:K6_WEB_DASHBOARD_OPEN = "true"
$env:K6_WEB_DASHBOARD_PERIOD = "5s"
$env:K6_WEB_DASHBOARD_PORT = "5666"
$env:K6_WEB_DASHBOARD_EXPORT = "results/ai-report.html"

k6 run --summary-export=results/ai-summary.json `
  -e BASE_URL=http://localhost:3000 `
  k6/scripts/ai-realistic-shopping.js
```

The AI dashboard is available at `http://127.0.0.1:5666`. A different port
avoids collisions with a dashboard process that may still be using port 5665.

## 5. Reading Results

### 5.1 Important metrics

| Metric | Meaning |
| --- | --- |
| `http_req_duration` | Overall HTTP response time; focus on p95 |
| `http_req_failed` | Proportion of failed HTTP requests |
| `checks` | Proportion of successful functional assertions |
| `login_duration` | Login response-time trend |
| `products_duration` | Product-list response-time trend |
| `search_duration` or `discovery_duration` | Product discovery response time |
| `add_cart_duration` or `cart_duration` | Cart response time |
| `coupon_duration` | Coupon response time |
| `checkout_duration` | Checkout response time |
| `successful_checkouts` | Number of verified completed checkouts |
| `business_errors` | AI scenario's business-check failure rate |

### 5.2 Dashboard sections to capture

For each measured run, capture:

1. **Overview:** VUs, duration, request rate, and overall behavior;
2. **Timings:** HTTP duration p95 and failed-request rate;
3. **Summary:** Trends, Counters, Rates, and Gauges;
4. **Threshold status:** evidence that the required SLOs passed.

Use JSON for exact values and HTML/dashboard screenshots as visual evidence.
The canonical result files are:

- `results/baseline-report.html`;
- `results/baseline-summary.json`;
- `results/ai-report.html`;
- `results/ai-summary.json`;
- `results/slo-comparison.md`.

### 5.3 Recorded comparison

| Metric | Traditional | AI-augmented |
| --- | ---: | ---: |
| Profile | 50 VUs, 5 minutes | 50 VUs, 5 minutes |
| HTTP p95 | 13.47 ms | 73.28 ms |
| HTTP failure rate | 0.00% | 0.00% |
| Checks | 100.00% | 100.00% |
| Checkout p95 | 26.89 ms | 81.22 ms |
| HTTP requests | 21,000 | 7,523 |
| Successful checkouts | 3,000 | 134 |

Both runs passed the defined SLOs. The AI scenario has fewer requests because
it includes randomized think time and personas that may browse without
purchasing. Do not claim that AI makes the backend faster; AI assists test
authoring, while k6 generates load and records measurements.

## 6. Advanced Usage

### 6.1 Capture and use a HAR

To record a new manual flow:

1. open the EShop web frontend;
2. open browser Developer Tools and select **Network**;
3. clear existing traffic and enable **Preserve log** if needed;
4. perform login, browse/search, cart, coupon, and checkout;
5. export the traffic as HAR;
6. remove sensitive cookies, tokens, credentials, and personal information;
7. save the reviewed artifact as `recordings/eshop-shopping.har`.

HAR is used to identify the real request order and dynamic values. It is not a
performance result and should not be replayed without correlation and review.

### 6.2 Reproduce the AI-augmented workflow

The recorded prompt is stored in `ai-demo/prompt.md`. The expected workflow is:

1. provide the baseline, API specification, seed manifest, and requirements;
2. save the untouched first draft as `ai-demo/ai-generated-v1.js`;
3. validate the draft with k6 MCP;
4. save validation evidence in `ai-demo/validation-v1.txt`;
5. audit endpoints, fields, authentication, correlation, test data, and SQLite
   risk;
6. record the human review in `ai-demo/ai-analysis.md`;
7. save the corrected script as `k6/scripts/ai-realistic-shopping.js`;
8. run a small smoke test before the 50-VU measured execution.

AI output must not be executed at full load without human review. In this
project, synthesized credentials and addresses were replaced with deterministic
seed artifacts before the final run.

### 6.3 Change the target environment

Both measured scripts receive the backend URL through `BASE_URL`:

```powershell
k6 run -e BASE_URL=http://localhost:3000 k6/scripts/baseline-har.js
```

Do not point the scripts at a shared, staging, or production environment unless
the environment owner has approved the load level and test window.

### 6.4 Interpret local results correctly

Local execution is useful for repeatability, workflow validation, and comparing
two scenarios on the same machine. It is not a production capacity test because
the load generator and SUT share CPU, memory, disk, and loopback networking.
SQLite may also serialize concurrent writes. For production-oriented evidence,
deploy a representative environment, separate the load generator, and monitor
server and database resources.

## 7. Troubleshooting

| Problem | Likely cause | Resolution |
| --- | --- | --- |
| `k6: command not found` | k6 is missing or not in `PATH` | Reinstall k6, open a new terminal, and run `k6 version` |
| `connect ECONNREFUSED` | Backend is stopped or `BASE_URL` is wrong | Run `npm start` in `backend` and verify `http://localhost:3000` |
| Backend prints startup messages and then returns to the prompt | The Node.js process stopped | Review the terminal error and restart `node server.js` or `npm start` |
| Login checks fail | Performance users were not seeded or the database is stale | Stop the backend and run `npm run seed:performance` or `npm run reset:performance` |
| Product-count check fails | The active database does not contain the 500-product seed | Restore the performance baseline |
| Coupon checks fail | `LOADTEST` is missing, expired, or has stale usage | Reset the performance database and confirm the seeded coupon |
| Dashboard reports `listen tcp :5665: bind` | Another process is already using the port | Stop only the previous load-test terminal or set `K6_WEB_DASHBOARD_PORT=5666` |
| Dashboard closes when the test ends | The local dashboard belongs to the k6 process | Use the exported HTML report after execution |
| No HTML report is generated | Dashboard export was not enabled or dashboard startup failed | Set `K6_WEB_DASHBOARD=true` and `K6_WEB_DASHBOARD_EXPORT` before rerunning |
| Reset refuses to run | The backend still holds the SQLite database | Stop the backend with `Ctrl+C`, reset, and restart it |
| High latency or lock errors at 50 VUs | Local Node.js/SQLite write contention | Record the limitation, reduce load for diagnosis, and inspect system/database resources |
| `k6 x agent` fails | Agent setup is incomplete or the installed k6 build lacks the capability | Run `k6 version`, `k6 x agent status`, and inspect the dry-run output |
| AI generates an invalid endpoint or payload | The prompt lacks authoritative context | Require the assistant to read `api_specification.md` and audit the generated script |

For comparable results, use the same machine, reset state before each official
run, keep the same VU count and duration, and avoid running unrelated heavy
applications during measurement.

## 8. References

- EShop API specification: `api_specification.md`
- Final report: `Final_Report.md`
- Performance-test report: `Performance_Test_Report.md`
- Test-data instructions: `test-data/README.md`
- Traditional script: `k6/scripts/baseline-har.js`
- AI script: `k6/scripts/ai-realistic-shopping.js`
- AI audit: `ai-demo/ai-analysis.md`
- [Grafana k6 — Install k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)
- [Grafana k6 — Configure an AI assistant](https://grafana.com/docs/k6/latest/set-up/configure-ai-assistant/)
- [Grafana k6 — Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/)
- [Grafana k6 — Checks](https://grafana.com/docs/k6/latest/using-k6/checks/)
- [Grafana k6 — Scenarios](https://grafana.com/docs/k6/latest/using-k6/scenarios/)
- [Grafana k6 — Web dashboard](https://grafana.com/docs/k6/latest/results-output/web-dashboard/)
