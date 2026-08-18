import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import exec from 'k6/execution';
import { Counter, Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL;
const COUPON_CODE = 'LOADTEST';
const EXPECTED_USER_COUNT = 50;
const PERSONA_BUCKET_COUNT = 10;
const DISCOVERY_BUCKET_START = 3;
const CART_BUCKET_START = 7;
const CHECKOUT_BUCKET = 9;

// k6 MCP validates source from a temporary directory and does not inject
// BASE_URL. Measured runs set BASE_URL and load these paths relative to this
// script in k6/scripts/.
const users = BASE_URL
  ? new SharedArray('seeded test users', () => JSON.parse(open('../../test-data/users.json')))
  : [];
const addresses = BASE_URL
  ? new SharedArray('seeded shipping addresses', () => JSON.parse(open('../../test-data/addresses.json')))
  : [];

const loginDuration = new Trend('login_duration', true);
const productsDuration = new Trend('products_duration', true);
const discoveryDuration = new Trend('discovery_duration', true);
const cartDuration = new Trend('cart_duration', true);
const couponDuration = new Trend('coupon_duration', true);
const checkoutDuration = new Trend('checkout_duration', true);
const businessErrors = new Rate('business_errors');
const checkoutAttempts = new Counter('checkout_attempts');
const successfulCheckouts = new Counter('successful_checkouts');

export const options = {
  scenarios: {
    realistic_shopping: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
      gracefulStop: '30s',
      tags: { workload: 'realistic-shopping' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
    business_errors: ['rate<0.01'],
    checkout_duration: ['p(95)<1000'],
  },
};

function requestParams(name, token, flow) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return { headers, tags: { name, flow } };
}

function safeJson(response) {
  try {
    return response.json();
  } catch {
    return null;
  }
}

function recordChecks(value, checks, tags) {
  const passed = check(value, checks, tags);
  businessErrors.add(!passed, tags);
  return passed;
}

function think(minSeconds = 0.8, maxSeconds = 2.8) {
  sleep(minSeconds + Math.random() * (maxSeconds - minSeconds));
}

export default function () {
  // BASE_URL is mandatory for measured runs. The guard lets k6 MCP perform its
  // environment-free 1-VU validation without contacting the application.
  if (!BASE_URL) return;

  if (users.length !== EXPECTED_USER_COUNT || addresses.length === 0) {
    exec.test.abort('Expected 50 seeded users and at least one seeded shipping address.');
  }

  const userIndex = (exec.vu.idInTest - 1) % users.length;
  const user = users[userIndex];
  const address = addresses[userIndex % addresses.length].address;
  const personaBucket = userIndex % PERSONA_BUCKET_COUNT;
  const discoversProduct = personaBucket >= DISCOVERY_BUCKET_START; // 35 of 50 users
  const addsToCart = personaBucket >= CART_BUCKET_START; // 15 of 50 users
  const completesCheckout = personaBucket === CHECKOUT_BUCKET; // 5 of 50 users

  let token;
  let userId;
  let products;

  group('01 Authenticate', () => {
    const response = http.post(
      `${BASE_URL}/api/login`,
      JSON.stringify({ email: user.email, password: user.password }),
      requestParams('POST /api/login', null, 'authenticate'),
    );
    loginDuration.add(response.timings.duration);
    const body = safeJson(response);
    const passed = recordChecks(response, {
      'login status is 200': (r) => r.status === 200,
      'login returns a token': () => typeof body?.token === 'string' && body.token.length > 0,
      'login returns a user id': () => Number.isInteger(body?.user?.id),
    }, { step: 'login' });
    if (passed) {
      token = body.token;
      userId = body.user.id;
    }
  });

  think();

  group('02 Load products', () => {
    const response = http.get(
      `${BASE_URL}/api/products`,
      requestParams('GET /api/products', null, 'browse'),
    );
    productsDuration.add(response.timings.duration);
    const body = safeJson(response);
    const passed = recordChecks(response, {
      'products status is 200': (r) => r.status === 200,
      'products response is a non-empty array': () => Array.isArray(body) && body.length > 0,
    }, { step: 'products' });
    if (passed) products = body;
  });

  if (!token || !products?.length) return;

  const iteration = exec.vu.iterationInScenario;
  const product = products[(userIndex * 17 + iteration * 13) % products.length];
  const productIsUsable = recordChecks(product, {
    'selected product has an id': (p) => Number.isInteger(p?.id),
    'selected product has a name': (p) => typeof p?.name === 'string' && p.name.length > 0,
    'selected product has a positive price': (p) => Number(p?.price) > 0,
  }, { step: 'product_selection' });
  if (!productIsUsable) return;

  if (discoversProduct) {
    think();
    group('03 Search or inspect product', () => {
      if ((userIndex + iteration) % 2 === 0) {
        const keyword = encodeURIComponent(product.name.split(/\s+/)[0]);
        const response = http.get(
          `${BASE_URL}/api/products?search=${keyword}`,
          requestParams('GET /api/products?search=:keyword', null, 'discover'),
        );
        discoveryDuration.add(response.timings.duration, { action: 'search' });
        const body = safeJson(response);
        recordChecks(response, {
          'search status is 200': (r) => r.status === 200,
          'search response is an array': () => Array.isArray(body),
        }, { step: 'search' });
      } else {
        const response = http.get(
          `${BASE_URL}/api/products/${product.id}`,
          requestParams('GET /api/products/:id', null, 'discover'),
        );
        discoveryDuration.add(response.timings.duration, { action: 'detail' });
        const body = safeJson(response);
        recordChecks(response, {
          'product detail status is 200': (r) => r.status === 200,
          'product detail id matches selection': () => Number(body?.id) === product.id,
        }, { step: 'product_detail' });
      }
    });
  }

  if (!addsToCart) {
    think(1.2, 3.5);
    return;
  }

  think();
  group('04 Add selected product to cart', () => {
    const response = http.post(
      `${BASE_URL}/api/cart`,
      JSON.stringify({ id: product.id, name: product.name, price: Number(product.price), quantity: 1 }),
      requestParams('POST /api/cart', token, 'cart'),
    );
    cartDuration.add(response.timings.duration);
    const body = safeJson(response);
    recordChecks(response, {
      'add to cart status is 200': (r) => r.status === 200,
      'add to cart is acknowledged': () => body?.message === 'Added to cart',
    }, { step: 'add_to_cart' });
  });

  if (!completesCheckout) {
    think(1.2, 3.5);
    return;
  }

  let finalAmount = Number(product.price);
  let couponApplied = false;
  think();
  group('05 Apply LOADTEST coupon', () => {
    const response = http.post(
      `${BASE_URL}/api/apply-coupon`,
      JSON.stringify({ code: COUPON_CODE, total_amount: finalAmount, user_id: userId }),
      requestParams('POST /api/apply-coupon', null, 'checkout'),
    );
    couponDuration.add(response.timings.duration);
    const body = safeJson(response);
    couponApplied = recordChecks(response, {
      'coupon status is 200': (r) => r.status === 200,
      'coupon returns a discount amount': () => Number(body?.discount_amount) > 0,
      'coupon returns a positive final amount': () => Number(body?.final_amount) > 0,
    }, { step: 'apply_coupon' });
    if (couponApplied) finalAmount = Number(body.final_amount);
  });

  // Checkout only when the required coupon step succeeds; this prevents a
  // coupon failure from silently changing the intended checkout journey.
  if (!couponApplied) return;

  think();
  group('06 Complete checkout', () => {
    checkoutAttempts.add(1);
    const response = http.post(
      `${BASE_URL}/api/checkout`,
      JSON.stringify({ total_amount: finalAmount, shipping_address: address }),
      requestParams('POST /api/checkout', token, 'checkout'),
    );
    checkoutDuration.add(response.timings.duration);
    const body = safeJson(response);
    const passed = recordChecks(response, {
      'checkout status is 200': (r) => r.status === 200,
      'checkout returns an order id': () => Number.isInteger(body?.orderId),
    }, { step: 'checkout' });
    if (passed) successfulCheckouts.add(1);
  });

  think(1.2, 3.5);
}
