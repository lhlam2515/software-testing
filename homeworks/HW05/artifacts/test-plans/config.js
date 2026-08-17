// config.js — shared configuration for the e-Shop k6 performance suite.
// Load, Stress and Spike test plans import only this file and lib/journey.js;
// they must not redefine BASE_URL, accounts, or per-step HTTP params.
//
// Point the suite at a running backend with an env var:
//   k6 run -e BASE_URL=http://localhost:3000 23127216_Load_20260817.js
// Defaults to the local dev backend (apps/backend/server.js, port 3000).

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Seeded performance accounts (see artifacts/scripts/seed_perf.js): 200
// accounts, email pattern perf_user_{0..199}@eshop.test, ALL sharing one
// password. Deliberately a flat, uniform table instead of two parallel
// arrays (emails[] / passwords[]) or a parsed CSV row-pair — a desync
// between an email and its password in a mapping like that would make a VU
// send a wrong password, and under the SUT's lockout rule (login_attempts
// += 2 per failed attempt, locked at >= 3, i.e. after 2 consecutive fails)
// that is exactly the bug class that can lock out real accounts mid-run.
// Uniform password removes the desync risk at the source.
const PERF_USER_COUNT = 200;
const PERF_USER_PASSWORD = 'PerfTest1234!';

export const ACCOUNTS = Array.from({ length: PERF_USER_COUNT }, (_, i) => ({
  email: `perf_user_${i}@eshop.test`,
  password: PERF_USER_PASSWORD,
}));

// Search keywords with different selectivity, matching the weighted pool
// seed_perf.js used to name products (see KEYWORD_WEIGHTS there) — so a
// search here is guaranteed to hit a realistic, non-empty result set.
export const SEARCH_KEYWORDS = [
  'Laptop', 'iPhone', 'Samsung', 'Tai nghe',
  'Bàn phím', 'Chuột', 'Màn hình', 'Ổ cứng',
];

// Standard unauthenticated request params: timeout + a `step` tag so k6
// results/thresholds can be grouped per endpoint (e.g. http_req_duration{step:search}).
export function jsonParams(step) {
  return {
    timeout: '30s',
    tags: { step: step || 'other' },
    headers: { 'Content-Type': 'application/json' },
  };
}

// Same as jsonParams, plus the bearer token — used for every endpoint that
// calls authenticateToken() in server.js (cart, checkout).
export function authParams(step, token) {
  return {
    timeout: '30s',
    tags: { step: step || 'other' },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
}
