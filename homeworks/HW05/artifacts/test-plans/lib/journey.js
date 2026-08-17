// lib/journey.js — shared e-Shop purchase journey, reused as-is by the
// Load, Stress and Spike test plans (they only differ in `options`).
// Journey: POST /api/login -> GET /api/products?search= -> POST /api/cart
// -> POST /api/checkout. All four steps run every iteration, in this order.
//
// Auth design (see README.md decision + [AI-02] entry for this artifact):
// a VU logs in ONCE, on its first iteration, and reuses the JWT for every
// iteration after that — it does NOT log in again at the top of each
// iteration. Rationale is in the module-level comment above `token` below.

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import { BASE_URL, ACCOUNTS, SEARCH_KEYWORDS, jsonParams, authParams } from '../config.js';

// think() paces requests like a human reading a page, not a loop hammering
// the API back-to-back. Bounds are env-tunable (-e THINK_MIN=.. THINK_MAX=..)
// so Load/Stress/Spike can share this one journey and still dial pacing
// per scenario: Load/Stress want realistic pacing, Spike may set both to 0
// to make the burst as sharp as the VU ramp itself.
const THINK_MIN = Number(__ENV.THINK_MIN || 0.3);
const THINK_MAX = Number(__ENV.THINK_MAX || 0.8);

function think(min = THINK_MIN, max = THINK_MAX) {
  if (max <= 0) return;
  sleep(min + Math.random() * (max - min));
}

// Custom metrics so login-cache behaviour is visible in the k6 summary
// instead of silently hiding inside generic check()/http_req_failed counts.
export const reloginTotal = new Counter('journey_relogin_total');
export const loginFailureTotal = new Counter('journey_login_failure_total');
export const searchNonJsonTotal = new Counter('journey_search_non_json_total');

// Per-step check-rate thresholds, keyed by the `step` tag every check()
// below is tagged with (see jsonParams/authParams in config.js for the
// matching http_req_duration{step:...} tag on the requests themselves).
// A tripped threshold here means the step's *contract* broke — not just
// that a request failed — since none of these checks stop at status 200.
export const thresholds = {
  'checks{step:login}': ['rate>0.99'],
  'checks{step:search}': ['rate>0.99'],
  'checks{step:cart}': ['rate>0.99'],
  'checks{step:checkout}': ['rate>0.99'],
};

// --- Per-VU state -----------------------------------------------------
// k6 loads this module fresh once per VU (init context), so top-level
// `let` bindings here are private to that VU and persist across all of
// its iterations — no shared state, no locking needed between VUs.
//
// Why cache instead of logging in every iteration:
// 1. The JWT is signed with no `expiresIn` (apps/backend/server.js:51) —
//    it never expires, so there is no technical need to re-authenticate.
// 2. A successful login always resets login_attempts to 0
//    (server.js:47-50), so the lockout counter itself doesn't force
//    re-login either — this is purely a load-shape decision.
// 3. The real risk is blast radius under a credential bug. With ~200
//    accounts and Stress/Spike driving far more than 200 iterations,
//    logging in every iteration turns any wrong-password bug (bad seed
//    data, a desynced email/password mapping) into thousands of failed
//    attempts against the same 200-account pool in seconds — enough to
//    trip the >=3 lockout (locked_until = 180s) on all of them before
//    the Spike stage even starts, since login_attempts is checked before
//    the password compare and the lock is not scoped per test run.
//    Logging in once per VU caps that same bug at one failed attempt per
//    account (login_attempts=2, still under the lockout threshold) for
//    the whole suite.
// 4. It also keeps every load/stress metric on the endpoints actually
//    under test (search/cart/checkout) instead of mixing in the
//    DB-write cost of /api/login on every single iteration.
let account = null; // { email, password } — assigned once, on first use
let token = null; // cached JWT — reused until a request proves it's dead

function ensureAccount() {
  if (!account) {
    // __VU is stable for the lifetime of a VU; deterministic assignment
    // means re-running the same script always maps the same VU number to
    // the same account, which makes lockout investigations reproducible.
    account = ACCOUNTS[__VU % ACCOUNTS.length];
  }
  return account;
}

function login() {
  const acc = ensureAccount();
  const res = http.post(
    `${BASE_URL}/api/login`,
    JSON.stringify({ email: acc.email, password: acc.password }),
    jsonParams('login'),
  );

  const ok = check(
    res,
    {
      'login: status 200': (r) => r.status === 200,
      // A 200 alone does not prove authentication actually succeeded — every
      // downstream step (cart, checkout) needs a real JWT string in `token`,
      // so assert that field exists instead of trusting the status code.
      'login: response has token': (r) => {
        try {
          const t = r.json('token');
          return typeof t === 'string' && t.length > 0;
        } catch (e) {
          return false;
        }
      },
    },
    { step: 'login' },
  );
  if (!ok) {
    // A non-200 here is almost always a locked/dirty account left over
    // from a previous run (see artifacts/scripts/reset_lockout.js), not a
    // transient error — do not retry with a different password, that
    // would only move the account closer to lockout. Leave `token` null;
    // the next iteration for this VU will simply try login() again with
    // the SAME (correct) credentials, which is safe even while locked,
    // since the lockout check runs before the password compare and does
    // not add another failed attempt.
    loginFailureTotal.add(1);
    return null;
  }

  let body;
  try {
    body = res.json();
  } catch (e) {
    loginFailureTotal.add(1);
    return null;
  }
  return (body && body.token) || null;
}

// One full shopping journey: call this as the default function of each
// Load/Stress/Spike scenario.
//
// `overrides` (all optional) lets the CSV-driven top-level scripts (P-4)
// force specific data-driven values without duplicating login/token-cache
// logic per script — passing nothing keeps the exact random behaviour this
// journey already had (and that Load/Stress/Spike VU counts were calibrated
// against in P-2/P-3):
//   - keyword: search term (drives read_keywords.csv's hit/miss distribution)
//   - productId / quantity: cart payload (cart_checkout_payloads.csv, lets a
//     row force a pool-boundary id like 1 or 2005 instead of a real search hit)
//   - payload: { total_amount, shipping_address } for checkout
export function shopJourney(overrides = {}) {
  if (!token) {
    if (account) reloginTotal.add(1); // first attempt already happened once
    token = login();
    if (!token) return; // nothing else to do this iteration without a token
  }

  let productId = null;

  group('search products', function () {
    const keyword = overrides.keyword || SEARCH_KEYWORDS[Math.floor(Math.random() * SEARCH_KEYWORDS.length)];
    const res = http.get(
      `${BASE_URL}/api/products?search=${encodeURIComponent(keyword)}`,
      jsonParams('search'),
    );

    const statusOk = check(
      res,
      {
        // Necessary but NOT sufficient: an empty result set ([]) is also a
        // 200, so this check alone proves nothing about the body — it only
        // rules out the malformed-query failure path below.
        'search: status 200': (r) => r.status === 200,
      },
      { step: 'search' },
    );
    if (!statusOk) {
      // Known SUT behaviour: the search query is string-interpolated into
      // raw SQL, so a query error comes back as status 500 with an HTML
      // body ("<h1>Database Error</h1>..."), not JSON. Do not call
      // res.json() on this path — it would throw and abort the iteration.
      searchNonJsonTotal.add(1);
      check(res, { 'search: response is JSON array': () => false }, { step: 'search' });
      return;
    }

    let products = [];
    let isJsonArray = false;
    try {
      products = res.json();
      isJsonArray = Array.isArray(products);
    } catch (e) {
      // Defensive: even a 200 response is only "probably JSON" — never
      // assume the parse succeeds just because the status check passed.
      searchNonJsonTotal.add(1);
    }
    // The real contract of GET /api/products?search= is "200 + JSON array,
    // possibly empty" — assert Array.isArray directly instead of inferring
    // correctness from status alone (status 200 with a non-array/garbage
    // body would otherwise pass silently).
    check(res, { 'search: response is JSON array': () => isJsonArray }, { step: 'search' });

    if (isJsonArray && products.length > 0) {
      productId = products[Math.floor(Math.random() * products.length)].id;
    }
  });

  think(); // pause to "read" the search results before adding to cart

  group('add to cart', function () {
    // overrides.productId (from cart_checkout_payloads.csv) takes priority
    // over the id a real search just returned — this is how BVA rows at the
    // product-id pool boundary (1, 2005) get exercised even when the random
    // search of the same iteration happened to return different products.
    const cartProductId = overrides.productId || productId || 1;
    const quantity = overrides.quantity || 1;
    const res = http.post(
      `${BASE_URL}/api/cart`,
      JSON.stringify({ productId: cartProductId, quantity }),
      authParams('cart', token),
    );
    check(
      res,
      {
        'cart: status 200': (r) => r.status === 200,
        // POST /api/cart only ever returns {"message": "Added to cart"} — no
        // item id, quantity, or cart id in the contract, so this is the only
        // field there is to assert beyond status. A 200 with a different/
        // missing message would mean the SUT silently changed its contract.
        'cart: response has expected message': (r) => {
          try {
            return r.json('message') === 'Added to cart';
          } catch (e) {
            return false;
          }
        },
      },
      { step: 'cart' },
    );
    if (res.status === 401) token = null; // stale/invalidated token
  });

  think(); // pause to "review the cart" before paying — same env-tunable bounds as
  // the search->cart pause above; a Spike script overriding THINK_MIN/THINK_MAX
  // needs both calls to honor the override, not just the first one.

  group('checkout', function () {
    // POST /api/checkout does NOT read the cart the previous step just
    // built (server.js:297-309 takes total_amount + shipping_address
    // straight from the request body) — it is intentionally independent
    // of the cart step, so no cart id or item list is threaded through here.
    const payload = overrides.payload || {
      total_amount: 100000 + Math.floor(Math.random() * 5000000),
      shipping_address: `Số ${1 + Math.floor(Math.random() * 200)}, Đường Test, Quận 1, TP.HCM`,
    };
    const res = http.post(`${BASE_URL}/api/checkout`, JSON.stringify(payload), authParams('checkout', token));
    check(
      res,
      {
        'checkout: status 200': (r) => r.status === 200,
        // orderId is the only proof an order record was actually created
        // server-side — status 200 by itself doesn't confirm the write
        // happened, only that the HTTP call didn't error out.
        'checkout: has orderId': (r) => {
          try {
            return !!r.json('orderId');
          } catch (e) {
            return false;
          }
        },
      },
      { step: 'checkout' },
    );
    if (res.status === 401) token = null; // stale/invalidated token
  });
}
