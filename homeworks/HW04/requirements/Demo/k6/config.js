// config.js — shared configuration for the eShop performance suite
// One place for the target, SLOs and thresholds. Every script imports this.
//
// Point the suite at your local/Docker eShop with an env var:
//   k6 run -e BASE_URL=http://localhost:5000 01-load.js
// If BASE_URL is not set, it defaults to the local mock server.

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

// Test credentials (override in CI with -e USER_EMAIL=... -e USER_PASS=...)
export const USER = {
  email: __ENV.USER_EMAIL || 'demo@eshop.test',
  password: __ENV.USER_PASS || 'Passw0rd!',
};

// ----- Service Level Objectives (the contract the tests enforce) -----
// Change these to match your eShop's agreed targets.
export const SLO = {
  p95_ms: 800,      // 95% of requests must finish under 800 ms
  p99_ms: 1500,     // 99% under 1.5 s
  error_rate: 0.01, // < 1% failed requests
  checkout_p95_ms: 1200, // checkout is heavier — its own budget
};

// ----- Reusable thresholds built from the SLOs -----
// A breached threshold makes k6 exit non-zero → fails the CI job.
export const thresholds = {
  http_req_failed: [`rate<${SLO.error_rate}`],
  http_req_duration: [`p(95)<${SLO.p95_ms}`, `p(99)<${SLO.p99_ms}`],
  // Custom trend for the checkout step (tagged in the journey):
  'http_req_duration{step:checkout}': [`p(95)<${SLO.checkout_p95_ms}`],
  // A journey should complete without a functional failure:
  checks: ['rate>0.99'],
};

// Standard HTTP params: timeout + a tag so results group by endpoint.
export function params(step) {
  return {
    timeout: '30s',
    tags: { step: step || 'other' },
    headers: { 'Content-Type': 'application/json' },
  };
}
