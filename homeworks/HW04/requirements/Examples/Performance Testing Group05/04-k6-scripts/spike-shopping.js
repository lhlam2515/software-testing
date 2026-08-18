import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const USER_PASSWORD = __ENV.USER_PASSWORD || 'Test1234!';
const COUPON_CODE = 'LOADTEST';
const TEST_USER_COUNT = 50;
const SHIPPING_ADDRESS_COUNT = 30;

const checkoutDuration = new Trend('checkout_duration', true);
const businessErrors = new Rate('business_errors');
const successfulCheckouts = new Counter('successful_checkouts');

export const options = {
  scenarios: {
    warmup: {
      executor: 'constant-vus',
      vus: 5,
      duration: '15s',
      gracefulStop: '1s',
      exec: 'shoppingFlow',
      tags: { phase: 'warmup', test_type: 'spike' },
    },
    spike: {
      executor: 'constant-vus',
      vus: 120,
      duration: '20s',
      startTime: '15s',
      gracefulStop: '1s',
      exec: 'shoppingFlow',
      tags: { phase: 'spike', test_type: 'spike' },
    },
    recovery: {
      executor: 'constant-vus',
      vus: 5,
      duration: '20s',
      startTime: '35s',
      gracefulStop: '1s',
      exec: 'shoppingFlow',
      tags: { phase: 'recovery', test_type: 'spike' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
    business_errors: ['rate<0.01'],
    checkout_duration: ['p(95)<1000'],
    'http_req_duration{phase:spike}': ['p(95)<1000'],
    'http_req_failed{phase:spike}': ['rate<0.05'],
    'http_req_duration{phase:recovery}': ['p(95)<500'],
    'http_req_failed{phase:recovery}': ['rate<0.01'],
  },
};

function safeJson(response) {
  try {
    return response.json();
  } catch {
    return null;
  }
}

function userForVu() {
  const number = ((__VU - 1) % TEST_USER_COUNT) + 1;
  return {
    email:
      number === 1
        ? 'test@eshop.com'
        : `loadtest${String(number).padStart(2, '0')}@eshop.com`,
    password: USER_PASSWORD,
    address: `${100 + ((number - 1) % SHIPPING_ADDRESS_COUNT)} Performance Test Street, District ${((number - 1) % 10) + 1}, Ho Chi Minh City`,
  };
}

function requestParams(token, step) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return { headers, tags: { step } };
}

function recordChecks(value, checks, tags) {
  const passed = check(value, checks, tags);
  businessErrors.add(!passed, tags);
  return passed;
}

export function shoppingFlow() {
  const user = userForVu();
  let token;
  let userId;
  let product;
  let finalAmount;

  group('01 Login', () => {
    const response = http.post(
      `${BASE_URL}/api/login`,
      JSON.stringify({ email: user.email, password: user.password }),
      requestParams(null, 'login'),
    );
    const body = safeJson(response);
    if (
      recordChecks(
        response,
        {
          'login status is 200': (r) => r.status === 200,
          'login returns token': () => typeof body?.token === 'string',
        },
        { step: 'login' },
      )
    ) {
      token = body.token;
      userId = body.user.id;
    }
  });
  if (!token) {
    sleep(0.25);
    return;
  }

  group('02 Products', () => {
    const response = http.get(`${BASE_URL}/api/products`, requestParams(null, 'products'));
    const products = safeJson(response);
    if (
      recordChecks(
        response,
        {
          'products status is 200': (r) => r.status === 200,
          'products returns at least 500 records': () =>
            Array.isArray(products) && products.length >= 500,
        },
        { step: 'products' },
      )
    ) {
      product = products[(__VU * 19 + __ITER * 11) % products.length];
      finalAmount = Number(product.price);
    }
  });
  if (!product) {
    sleep(0.25);
    return;
  }

  group('03 Cart', () => {
    const response = http.post(
      `${BASE_URL}/api/cart`,
      JSON.stringify({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: 1,
      }),
      requestParams(token, 'cart'),
    );
    recordChecks(
      response,
      {
        'cart status is 200': (r) => r.status === 200,
        'cart is acknowledged': (r) => safeJson(r)?.message === 'Added to cart',
      },
      { step: 'cart' },
    );
  });

  group('04 Coupon', () => {
    const response = http.post(
      `${BASE_URL}/api/apply-coupon`,
      JSON.stringify({
        code: COUPON_CODE,
        total_amount: finalAmount,
        user_id: userId,
      }),
      requestParams(null, 'coupon'),
    );
    const body = safeJson(response);
    if (
      recordChecks(
        response,
        {
          'coupon status is 200': (r) => r.status === 200,
          'coupon returns final amount': () => Number(body?.final_amount) > 0,
        },
        { step: 'coupon' },
      )
    ) {
      finalAmount = Number(body.final_amount);
    }
  });

  group('05 Checkout', () => {
    const response = http.post(
      `${BASE_URL}/api/checkout`,
      JSON.stringify({
        total_amount: finalAmount,
        shipping_address: user.address,
      }),
      requestParams(token, 'checkout'),
    );
    checkoutDuration.add(response.timings.duration);
    if (
      recordChecks(
        response,
        {
          'checkout status is 200': (r) => r.status === 200,
          'checkout returns order id': (r) => Number.isInteger(safeJson(r)?.orderId),
        },
        { step: 'checkout' },
      )
    ) {
      successfulCheckouts.add(1);
    }
  });

  sleep(0.25);
}

export default function () {
  shoppingFlow();
}
