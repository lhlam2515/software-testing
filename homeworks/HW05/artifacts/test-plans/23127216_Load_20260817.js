// 23127216_Load_20260817.js — Load scenario for the e-Shop customer purchase
// journey (login -> search -> cart -> checkout, lib/journey.js).
//
// Parameters below are the ones "chốt" in prompt_log.md Entry 002 (P-2,
// Load), calibrated on this machine's real hardware (i5-11300H, 4C/8T,
// 15.3GiB), not textbook round numbers:
//   - Peak VU = 80: probed live at 80 VU/40s on this SUT -> 1224 iterations,
//     0% error, http_req_duration p95 = 9.63ms. ~12 iteration/s ≈ 12
//     checkout INSERTs/s against SQLite's single unindexed writer connection
//     (no busy_timeout / WAL pragma set) — safe with large margin for a Load
//     profile whose job is "simulate normal traffic", not find the ceiling.
//   - Ramp-up 60s, hold 300s, ramp-down 30s -> 390s total.
// Report mechanism for THIS file only: handleSummary() -> aggregate HTML,
// one row per step (count, error rate, p50/p90/p95/p99, throughput).
// Stress uses --out csv= + a raw-log post-processor instead; Spike uses
// --out json= time-series — no report mechanism repeats across the 3 files
// (README.md "Three distinct report views").
//
// Run (section 14 also wants raw + HTML for all three scenarios, so both
// --out flags stay on even though this file's own code only builds HTML):
//   k6 run \
//     -e THINK_MIN=2 -e THINK_MAX=4 \
//     --out csv=artifacts/results/raw/raw_load.csv \
//     --out json=artifacts/results/raw/ts_load.json \
//     artifacts/test-plans/23127216_Load_20260817.js
//
// THINK_MIN/THINK_MAX note: P-2's original analysis proposed 3 separate
// think-time bands (login->search 1-3s, search->cart 2-4s, cart->checkout
// 1-2s). The shared journey.js that actually shipped only has 2 think()
// calls and one shared env-driven range (by design — see the comment above
// the second think() call in journey.js: a single THINK_MIN/THINK_MAX pair
// has to cover both pauses so Spike can zero out both with one override).
// 2-4s is used here as the representative band: it was the "search -> cart"
// (decision-making) pause in the original 3-band design, the longest and
// most realistic of the three.

import { readKeywords, cartCheckoutPayloads } from './lib/csvData.js';
import { shopJourney, thresholds as journeyThresholds } from './lib/journey.js';

const STEPS = ['login', 'search', 'cart', 'checkout'];

// Materializes per-step submetrics (http_req_duration{step:x},
// http_reqs{step:x}) so handleSummary() below can read them out of
// data.metrics — k6 only computes a tag-scoped submetric when something
// (a threshold, here) references that exact tag combination. Bounds are
// real sanity gates, not just materialization noise: max<60000 catches a
// hung request, count>0 catches a step that silently never ran.
const reportThresholds = {};
STEPS.forEach((step) => {
  reportThresholds[`http_req_duration{step:${step}}`] = ['max<60000'];
  reportThresholds[`http_reqs{step:${step}}`] = ['count>0'];
});

export const options = {
  scenarios: {
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '60s', target: 80 }, // ramp-up: ~1 new VU/0.75s, spreads the first-login UPDATE writes
        { duration: '300s', target: 80 }, // hold: ~10.8k-14.4k requests, ~3.6k samples/step-tag
        { duration: '30s', target: 0 }, // ramp-down: matches k6's default gracefulStop, > max think-time chain (9s)
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: { ...journeyThresholds, ...reportThresholds },
  // p(99) is not in k6's default summary trend stats — add it explicitly so
  // handleSummary() below can read it straight off data.metrics.
  summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

export default function () {
  // Round-robin index: for a fixed VU count, (VU + ITER) mod pool.length
  // sweeps the whole CSV pool evenly across VUs/iterations instead of
  // relying on Math.random() to eventually cover it (Stress's breaking-
  // point curve specifically needs the low-selectivity/miss keywords to
  // actually show up, not just the high-weight ones by chance).
  const kwRow = readKeywords[(__VU + __ITER) % readKeywords.length];
  const payloadRow = cartCheckoutPayloads[(__VU + __ITER + 1) % cartCheckoutPayloads.length];

  shopJourney({
    keyword: kwRow.keyword,
    productId: Number(payloadRow.product_id),
    quantity: Number(payloadRow.quantity),
    payload: {
      total_amount: Number(payloadRow.total_amount),
      shipping_address: payloadRow.shipping_address,
    },
  });
}

// --- Aggregate HTML report ------------------------------------------
// One row per step: count, error rate (from checks{step:x} — business-
// contract pass rate, not just HTTP status), p50/p90/p95/p99, throughput
// (count / actual run duration). Hand-rolled HTML instead of a remote
// jslib.k6.io report helper: fully offline, no network dependency during
// the run, and the exact columns the assignment asks for.
function buildRow(step, data, durationSeconds) {
  const durKey = `http_req_duration{step:${step}}`;
  const reqsKey = `http_reqs{step:${step}}`;
  const checksKey = `checks{step:${step}}`;

  const dur = data.metrics[durKey] && data.metrics[durKey].values;
  const reqs = data.metrics[reqsKey] && data.metrics[reqsKey].values;
  const checksRate = data.metrics[checksKey] && data.metrics[checksKey].values.rate;

  const count = reqs ? reqs.count : 0;
  const errorRate = checksRate === undefined ? null : (1 - checksRate) * 100;
  const throughput = durationSeconds > 0 ? count / durationSeconds : 0;

  const fmt = (v) => (v === undefined || v === null || Number.isNaN(v) ? '-' : v.toFixed(2));

  return `<tr>
    <td>${step}</td>
    <td>${count}</td>
    <td>${errorRate === null ? '-' : fmt(errorRate) + '%'}</td>
    <td>${dur ? fmt(dur.med) : '-'}</td>
    <td>${dur ? fmt(dur['p(90)']) : '-'}</td>
    <td>${dur ? fmt(dur['p(95)']) : '-'}</td>
    <td>${dur ? fmt(dur['p(99)']) : '-'}</td>
    <td>${fmt(throughput)}</td>
  </tr>`;
}

export function handleSummary(data) {
  const durationSeconds = (data.state && data.state.testRunDurationMs ? data.state.testRunDurationMs : 0) / 1000;
  const rows = STEPS.map((step) => buildRow(step, data, durationSeconds)).join('\n');

  const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<title>23127216 — Load Test Report (${new Date().toISOString()})</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; margin: 2rem; color: #0A3A45; }
  h1 { font-size: 1.25rem; }
  table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
  th, td { border: 1px solid #d0d7d8; padding: 0.5rem 0.75rem; text-align: right; font-variant-numeric: tabular-nums; }
  th:first-child, td:first-child { text-align: left; }
  th { background: #12707F; color: white; }
  tr:nth-child(even) { background: #f4f8f8; }
  caption { text-align: left; font-size: 0.85rem; color: #5B6B70; margin-bottom: 0.5rem; }
</style>
</head>
<body>
  <h1>23127216 — Load Test Aggregate Report</h1>
  <p>Scenario: Load (peak 80 VU, 60s ramp-up / 300s hold / 30s ramp-down, 390s total).
     Run duration measured: ${durationSeconds.toFixed(1)}s.</p>
  <table>
    <caption>One row per journey step. Error rate = 1 - checks{step:x} pass rate (business-contract checks,
      not just HTTP status — see lib/journey.js). Throughput = step count / total run duration.</caption>
    <thead>
      <tr>
        <th>Step</th><th>Count</th><th>Error rate</th>
        <th>p50 (ms)</th><th>p90 (ms)</th><th>p95 (ms)</th><th>p99 (ms)</th>
        <th>Throughput (req/s)</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>`;

  return {
    'artifacts/results/html-reports/23127216_Load_20260817.html': html,
    stdout: `Load report written to artifacts/results/html-reports/23127216_Load_20260817.html (run duration ${durationSeconds.toFixed(1)}s)\n`,
  };
}
