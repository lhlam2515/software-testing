// DEMO 1 — LOAD (full shopping journey): ramp to peak, hold, expect PASS.
import { thresholds } from '../k6/config.js';
import { shopJourney } from '../k6/lib/journey.js';
export const options = {
  scenarios:{ load:{ executor:'ramping-vus', startVUs:0, stages:[
    { duration:'15s', target:100 },
    { duration:'45s', target:100 },
    { duration:'10s', target:0 } ] } },
  thresholds,
};
export default function(){ shopJourney(); }
