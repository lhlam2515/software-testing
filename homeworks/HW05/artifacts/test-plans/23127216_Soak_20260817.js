// 23127216_Soak_20260817.js — Endurance/soak scenario for the e-Shop
// customer purchase journey (login -> search -> cart -> checkout,
// lib/journey.js). Not one of the "three test plans" required by section
// 14 (that's Load/Stress/Spike) — this is the separate endurance run
// required by section 6, Task 1 ("10 to 15 minutes at sustained load").
//
// Deliberately NOT a ramp/breaking-point search — Stress already found
// the breaking point (23127216_Stress_20260817.js: checkout p95 jumps
// from 427ms at 120VU to 7093ms at 220VU, stress_percentiles_by_stage.json).
// Soak's job is different: hold a KNOWN-SAFE load steady for longer than
// any other scenario and watch for degradation *over time* at a fixed VU
// count — the signature of a leak, not a capacity ceiling.
//
// VU = 80, duration = 10m (constant-vus): 80 is the exact level Load
// already validated as safe on this machine (p95=9.63ms, 0% error,
// 23127216_Load_20260817.js) and sits with a wide margin under Stress's
// 120VU-still-clean / 220VU-breaks bracket. Picking a level already known
// to be non-saturating isolates "does it get worse over 10 minutes" from
// "is it saturated" — a ramp to a new VU level would confound the two.
// 10m (not 15m) per the time-budget decision recorded in
// context/transcripts/2026-08-17.md.
//
// What this run is actually looking for: apps/backend/server.js's
// userCarts is an in-memory, unbounded, per-user array that every
// `POST /api/cart` call push()es onto and that is NEVER trimmed
// (BUG-05-LAM-003) — a VU held alive for 10 minutes doing ~1
// iteration/second-ish keeps adding to the SAME account's cart array the
// entire run (see journey.js's per-VU account caching), so backend RSS
// growing over the soak window (not just staying flat) is the expected,
// falsifiable signal this run is designed to surface. monitor.sh's
// per-second RSS/CPU CSV is the primary evidence for REPORT.md 4.8, not
// k6's own output.
//
// Report mechanism: raw CSV only (`--out csv=`), same per-request
// granularity as Load/Stress/Spike, but deliberately NO `--out json=` —
// at this duration k6's per-datapoint JSON stream would land in the
// hundreds of MB (ts_spike.json alone is 80MB for a 2-minute run; scaling
// that x5 for 10 minutes blows past GitHub's 100MB hard push limit, see
// context/transcripts/2026-08-17.md "Blocker khẩn cấp"). Soak isn't one
// of the "three distinct report views" (README.md) so it doesn't owe the
// assignment a fourth view type — a plain per-minute bucket read off the
// raw CSV (mirroring analyze_raw.py's approach) is enough to show the
// error-rate/p95 trend line for REPORT.md 4.8.
//
// Run:
//   k6 run \
//     --out csv=artifacts/results/raw/raw_soak.csv \
//     artifacts/test-plans/23127216_Soak_20260817.js

import { readKeywords, cartCheckoutPayloads } from './lib/csvData.js';
import { shopJourney, thresholds as journeyThresholds } from './lib/journey.js';

export const options = {
  scenarios: {
    soak: {
      executor: 'constant-vus',
      vus: 80,
      duration: '10m',
      gracefulStop: '30s',
    },
  },
  thresholds: journeyThresholds,
};

export default function () {
  // Same round-robin sweep as Load/Stress (see their comments) — evenly
  // covers the CSV pool across VUs/iterations instead of relying on
  // Math.random() to eventually hit the low-selectivity/miss keywords.
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
