// 01-load.js — LOAD: ramp to the expected peak and hold; confirm SLOs hold.
// Question answered: "Does eShop meet its targets at expected peak load?"
//   k6 run -e BASE_URL=http://localhost:5000 01-load.js

import { thresholds } from './config.js';
import { shopJourney } from './lib/journey.js';

export const options = {
  scenarios: {
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },  // ramp up to expected peak
        { duration: '5m', target: 100 },  // hold at peak
        { duration: '1m', target: 0 },    // ramp down
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds,
};

export default function () {
  shopJourney();
}
