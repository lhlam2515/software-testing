// DEMO 2 — BREAKING POINT (catalog read path): ramp arrival rate until it sheds.
import http from 'k6/http';
import { check } from 'k6';
const BASE = __ENV.BASE_URL || 'http://localhost:5000';
export const options = {
  discardResponseBodies:true,
  scenarios:{ ramp:{ executor:'ramping-arrival-rate', startRate:200, timeUnit:'1s',
    preAllocatedVUs:200, maxVUs:2500, stages:[
    { target:800,  duration:'15s' },
    { target:2600, duration:'25s' },
    { target:2600, duration:'10s' } ] } },
  thresholds:{ http_req_failed:['rate<0.5'], http_req_duration:['p(95)<3000'] },
};
export default function(){
  const r = http.get(`${BASE}/products?page=1&size=20`);
  check(r, { '200':(x)=>x.status===200, 'not 503':(x)=>x.status!==503 });
}
