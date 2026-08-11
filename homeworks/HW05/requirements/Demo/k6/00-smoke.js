// 00-smoke.js — sanity check: does one journey work at all?
// Run this FIRST. If the smoke test fails, the load numbers are meaningless.
//   k6 run -e BASE_URL=http://localhost:5000 00-smoke.js

import { thresholds } from './config.js';
import { shopJourney } from './lib/journey.js';

export const options = {
  vus: 1,
  iterations: 3,        // just a few passes
  thresholds,
};

export default function () {
  shopJourney();
}
