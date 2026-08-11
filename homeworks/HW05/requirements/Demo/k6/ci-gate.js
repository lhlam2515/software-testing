// ci-gate.js — the SHIFT-LEFT smoke load test that runs on every pull request.
// Short, low VUs, quick signal. A breached threshold exits non-zero and BLOCKS
// the PR — a performance regression breaks the build the day it lands.
//   k6 run -e BASE_URL=$STAGING_URL ci-gate.js

import { thresholds } from './config.js';
import { shopJourney } from './lib/journey.js';

export const options = {
  scenarios: {
    ci_smoke: {
      executor: 'constant-vus',
      vus: 20,
      duration: '1m',
    },
  },
  thresholds, // same SLO contract as the full suite — just less load
};

export default function () {
  shopJourney();
}
