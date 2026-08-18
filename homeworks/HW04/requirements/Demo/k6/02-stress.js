// 02-stress.js — STRESS: push past the peak until it hurts; learn the failure mode.
// Question answered: "Where does eShop break, and does it recover?"
//   k6 run -e BASE_URL=http://localhost:5000 02-stress.js
//
// Note: no hard SLO gate here — the point is to OBSERVE failure, not pass.
// We keep only a loose error ceiling so a total meltdown still flags.

import { shopJourney } from './lib/journey.js';

export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 200 },   // above expected peak
        { duration: '3m', target: 500 },   // heavy
        { duration: '3m', target: 900 },   // over-drive
        { duration: '2m', target: 0 },     // recover — watch it come back
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    // Expect graceful degradation (429/503), not a crash. Allow up to 15% here.
    http_req_failed: ['rate<0.15'],
  },
};

export default function () {
  shopJourney();
}
