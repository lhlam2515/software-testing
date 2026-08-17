// 23127216_Spike_20260817.js — Spike scenario for the e-Shop customer
// purchase journey (login -> search -> cart -> checkout, lib/journey.js),
// plus a small dedicated sub-scenario that deliberately exercises the
// account-lockout path.
//
// Main spike shape is the one "chốt" in prompt_log.md Entry 004 (P-2,
// Spike): 15 VU baseline -> 200 VU in 5s -> hold 30s -> drop back to 15 VU
// in 5s -> hold 60s recovery -> ramp down. Peak VU = 200, not a round
// number: it equals exactly the size of the seeded account pool
// (ACCOUNTS in config.js, perf_user_0..199), so at peak every VU maps to a
// distinct account (VU % 200) — no two VUs share a token, which keeps any
// write-contention analysis attributable to "200 real accounts writing
// concurrently" instead of being muddied by VUs colliding on one account.
//
// Think-time = 0s for the whole main scenario (see run command below) —
// deliberate: a spike models a traffic surge, not paced browsing, and
// journey.js's think() already no-ops when THINK_MAX<=0.
//
// Report mechanism for THIS file only: --out json= time-series export,
// plotted afterwards against elapsed time to read recovery behaviour
// (latency/error-rate shape after the surge) — not a mechanism Load or
// Stress use.
//
// Run:
//   k6 run \
//     -e THINK_MIN=0 -e THINK_MAX=0 \
//     --out csv=artifacts/results/raw/raw_spike.csv \
//     --out json=artifacts/results/raw/ts_spike.json \
//     artifacts/test-plans/23127216_Spike_20260817.js
//
// Before every Spike run: run artifacts/scripts/reset_lockout.js first —
// the lockout sub-scenario below leaves accounts perf_user_195..199 locked
// (locked_until = 180s) from the previous run otherwise.

import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, jsonParams } from './config.js';
import { authCredentials, readKeywords, cartCheckoutPayloads } from './lib/csvData.js';
import { shopJourney, thresholds as journeyThresholds } from './lib/journey.js';

export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-vus',
      exec: 'spikeJourney',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 15 }, // 1. baseline ramp-up
        { duration: '20s', target: 15 }, // 2. hold baseline
        { duration: '5s', target: 200 }, // 3. SPIKE — sharp climb, not a soft ramp
        { duration: '30s', target: 200 }, // 4. hold peak
        { duration: '5s', target: 15 }, // 5. sudden drop
        { duration: '40s', target: 15 }, // 6. hold — recovery window
        { duration: '10s', target: 0 }, // 7. end ramp-down
      ],
      // Deliberately short: the 5s drop (stage 5) is meant to read as a
      // cliff on the time-series chart, not a soft landing. 5s still lets
      // an in-flight request finish instead of being hard-aborted.
      gracefulRampDown: '5s',
    },
    // Isolated, bounded lockout demonstration — README.md "Login is cached
    // per VU": if fail-login traffic were spread across the whole 200-VU
    // main pool, a bad-credential bug could lock out the entire account
    // pool before the spike stage even runs. Keeping it to 5 VUs x 3
    // iterations (15 requests total, <=5% of the 200-account pool) bounds
    // that blast radius while still producing a real, observable lockout.
    lockoutProbe: {
      executor: 'per-vu-iterations',
      exec: 'lockoutProbe',
      vus: 5,
      iterations: 3,
      startTime: '10s', // starts once the baseline stage (1) is established
      maxDuration: '90s',
    },
  },
  thresholds: journeyThresholds,
};

export function spikeJourney() {
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

// Deliberate-fail sub-scenario: each of the 5 VUs owns exactly one
// valid_flag=false row (5 consecutive VU ids mod 5 always covers all 5
// residues exactly once, regardless of the absolute VU numbers k6 hands
// this scenario, so this stays collision-free without needing to know
// k6's VU-id allocation across scenarios). 3 iterations per VU walks the
// documented lockout mechanics on that one account:
//   iter 1: login_attempts 0 -> 2 (server.js:54, newAttempts=0+2, still <3)
//           -> 401 "Invalid email or password" (wrong-password path)
//   iter 2: login_attempts 2 -> 4 (newAttempts=2+2=4, >=3) -> server.js:56-57
//           sets locked_until = now+180s on THIS SAME request, but the
//           response is still 401 — the lockout check (server.js:40, "is
//           locked_until in the future") runs BEFORE the password compare,
//           so it only blocks attempts AFTER this one, not this one itself.
//   iter 3: locked_until is now in the future -> rejected at server.js:40-44
//           with 403 (not a 401) BEFORE the password is even checked — this
//           is the request that actually proves the lockout tripped.
// Known residual risk (documented, not hidden — see EXECUTION_PLAN.md
// convention): at Spike's 200-VU peak, the main spikeJourney scenario maps
// every account in the pool (VU % 200), including 195-199, so a real
// successful login on one of these accounts can race with this probe and
// reset login_attempts to 0 mid-sequence (server.js: a successful login
// always resets the counter). At 5/200 accounts this is a low-probability
// event, not a zero one.
export function lockoutProbe() {
  const invalidRows = authCredentials.filter((r) => r.valid_flag === 'false');
  const row = invalidRows[(__VU - 1) % invalidRows.length];

  const res = http.post(
    `${BASE_URL}/api/login`,
    JSON.stringify({ email: row.email, password: row.password }),
    jsonParams('lockout-probe'),
  );

  // 401 = wrong password, still under the lockout threshold (iter 1-2).
  // 403 = the lockout itself tripped (iter 3, expected once attempts>=3 —
  // server.js:40-44). A 200 here would mean the CSV row's password
  // accidentally matches the real one — the actual bug this check exists
  // to catch.
  check(
    res,
    {
      'lockout-probe: rejected (401 wrong password or 403 locked)': (r) => r.status === 401 || r.status === 403,
    },
    { step: 'lockout-probe' },
  );

  sleep(1); // small gap between the 3 deliberate attempts, still well inside the 180s lockout window
}
