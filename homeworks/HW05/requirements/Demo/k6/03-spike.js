// 03-spike.js — SPIKE: a sudden flash crowd (flash sale, viral link).
// Question answered: "Can eShop survive an instant surge and recover quickly?"
//   k6 run -e BASE_URL=http://localhost:5000 03-spike.js

import { shopJourney } from './lib/journey.js';

export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-vus',
      startVUs: 20,
      stages: [
        { duration: '30s', target: 20 },   // normal baseline
        { duration: '15s', target: 600 },  // SPIKE — near-instant jump
        { duration: '1m',  target: 600 },  // sustain the surge
        { duration: '20s', target: 20 },   // drop back
        { duration: '1m',  target: 20 },   // recovery window — watch latency settle
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.10'],
    // After the spike, latency should return to normal — inspect the trend.
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  shopJourney();
}
