// 05-breakpoint.js — BREAKPOINT / CAPACITY: ramp arrival rate until it saturates.
// Question answered: "What is the maximum throughput eShop can sustain?"
//   k6 run -e BASE_URL=http://localhost:5000 05-breakpoint.js
//
// Uses an ARRIVAL-RATE executor (open model): we dictate requests/sec, not VUs.
// This applies true pressure regardless of how slow the system gets.
// Watch where p95 turns up sharply — that knee is your capacity number.

import { shopJourney } from './lib/journey.js';

export const options = {
  scenarios: {
    breakpoint: {
      executor: 'ramping-arrival-rate',
      startRate: 10,            // iterations/sec to start
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 2000,
      stages: [
        { duration: '15m', target: 500 }, // steadily climb to 500 iters/sec
      ],
    },
  },
  thresholds: {
    // No pass/fail: we abort the ramp once latency blows past the knee, so the
    // run stops near the true breakpoint instead of wasting time overloaded.
    http_req_duration: [{ threshold: 'p(95)<3000', abortOnFail: true, delayAbortEval: '30s' }],
  },
};

export default function () {
  shopJourney();
}
