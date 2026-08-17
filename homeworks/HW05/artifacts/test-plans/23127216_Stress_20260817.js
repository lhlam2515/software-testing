// 23127216_Stress_20260817.js — Stress scenario for the e-Shop customer
// purchase journey (login -> search -> cart -> checkout, lib/journey.js).
//
// `options.scenarios.stress` is copied verbatim from prompt_log.md Entry 003
// (P-2, Stress) — do not re-derive the numbers, they are already backed by
// a live calibration run isolating POST /api/checkout on this machine
// (20/60/150 VU, no think-time): throughput held flat at ~92-137 req/s
// across all three levels while p95 went 289ms -> 781ms -> 2.16s. Flat
// throughput + exploding latency is the signature of a saturated
// single-writer queue (SQLite, no WAL/busy_timeout — apps/backend/database.js),
// not CPU contention, so stage 2-3 (40->120->220 VU) is placed to straddle
// the ~110-155 VU breaking point that calibration implies for this journey's
// real request rate (with think-time + 3 requests/iteration, not the
// zero-think calibration rate).
//
// Report mechanism for THIS file only: --out csv= raw per-request log, with
// percentiles recomputed per load stage by a SEPARATE post-run script
// (artifacts/scripts/analyze_raw.py) — never read off k6's own summary.
// This is deliberately NOT the same mechanism as Load (handleSummary/HTML)
// or Spike (--out json= time-series).
//
// Run:
//   k6 run \
//     --out csv=artifacts/results/raw/raw_stress.csv \
//     --out json=artifacts/results/raw/ts_stress.json \
//     artifacts/test-plans/23127216_Stress_20260817.js
//   python3 artifacts/scripts/analyze_raw.py artifacts/results/raw/raw_stress.csv \
//     --out artifacts/results/raw/stress_percentiles_by_stage.json
//
// THINK_MIN/THINK_MAX: intentionally NOT overridden here. journey.js's
// defaults (0.3/0.8s) already equal Entry 003's "search -> cart" think-time
// band; the second band (0.2-0.5s) was merged away when journey.js's two
// think() calls were consolidated onto one shared env-driven range (see the
// comment above the second think() call in journey.js).

import { readKeywords, cartCheckoutPayloads } from './lib/csvData.js';
import { shopJourney, thresholds as journeyThresholds } from './lib/journey.js';

export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 40 }, // stage 1 ramp — baseline
        { duration: '60s', target: 40 }, // stage 1 hold
        { duration: '20s', target: 120 }, // stage 2 ramp — approaching the writer ceiling
        { duration: '90s', target: 120 }, // stage 2 hold
        { duration: '20s', target: 220 }, // stage 3 ramp — expected to cross the breaking point
        { duration: '90s', target: 220 }, // stage 3 hold
        { duration: '20s', target: 350 }, // stage 4 ramp — confirm saturation, not just a blip
        { duration: '90s', target: 350 }, // stage 4 hold
        { duration: '20s', target: 0 }, // stage 5 ramp-down
      ],
      gracefulRampDown: '20s', // >= the 15.65s max observed in the 150-VU zero-think calibration
    },
  },
  thresholds: journeyThresholds,
};

export default function () {
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
