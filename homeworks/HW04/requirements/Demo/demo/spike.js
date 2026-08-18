// DEMO 3 — SPIKE (catalog read path): flash crowd, then measure recovery.
import http from 'k6/http';
import { check } from 'k6';
const BASE = __ENV.BASE_URL || 'http://localhost:5000';
export const options = {
  discardResponseBodies:true,
  scenarios:{ spike:{ executor:'ramping-vus', startVUs:20, stages:[
    { duration:'20s', target:20 },   // baseline
    { duration:'5s',  target:220 },  // SPIKE
    { duration:'30s', target:220 },  // sustain
    { duration:'5s',  target:20 },   // drop
    { duration:'40s', target:20 } ] } },   // recovery window
  thresholds:{ http_req_failed:['rate<0.20'] },
};
export default function(){
  const r = http.get(`${BASE}/products?page=1&size=20`);
  check(r, { '200':(x)=>x.status===200 });
}
