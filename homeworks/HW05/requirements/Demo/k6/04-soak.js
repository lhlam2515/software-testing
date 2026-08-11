// 04-soak.js — SOAK / ENDURANCE: moderate load held for a long time.
// Question answered: "Does eShop leak memory or drift over hours?"
//   k6 run -e BASE_URL=http://localhost:5000 04-soak.js
//
// For a class demo use a short hold (e.g. 20m). In practice, run 2-8 hours
// and watch memory/GC/DB-connections stay FLAT — a rising line = a leak.
// Override the hold without editing the file:  -e SOAK_HOLD=20m

const HOLD = __ENV.SOAK_HOLD || '2h';

import { thresholds } from './config.js';
import { shopJourney } from './lib/journey.js';

export const options = {
  scenarios: {
    soak: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 80 },   // ramp to a moderate, sustainable load
        { duration: HOLD, target: 80 },   // HOLD — this is where leaks surface
        { duration: '5m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds, // SLOs must stay met the WHOLE time, not just at the start
};

export default function () {
  shopJourney();
}
