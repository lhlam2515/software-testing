import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

// Refined traditional baseline. Reconcile this flow with the manually captured
// recordings/eshop-shopping.har before presenting it as the HAR-derived script.
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const USER_PASSWORD = __ENV.USER_PASSWORD || 'Test1234!';
const COUPON_CODE = __ENV.COUPON_CODE || 'LOADTEST';
const TEST_USER_COUNT = 50;
const SHIPPING_ADDRESS_COUNT = 30;

const loginDuration = new Trend('login_duration', true);
const productsDuration = new Trend('products_duration', true);
const searchDuration = new Trend('search_duration', true);
const productDetailDuration = new Trend('product_detail_duration', true);
const addCartDuration = new Trend('add_cart_duration', true);
const couponDuration = new Trend('coupon_duration', true);
const checkoutDuration = new Trend('checkout_duration', true);
const successfulCheckouts = new Counter('successful_checkouts');

export const options = {
  scenarios: {
    traditional_har_baseline: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
      gracefulStop: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
    login_duration: ['p(95)<500'],
    products_duration: ['p(95)<500'],
    search_duration: ['p(95)<500'],
    product_detail_duration: ['p(95)<500'],
    add_cart_duration: ['p(95)<500'],
    coupon_duration: ['p(95)<500'],
    checkout_duration: ['p(95)<1000'],
  },
};

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

function requestParams(token, name) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return { headers, tags: { name } };
}

function safeJson(response) {
  try {
    return response.json();
  } catch {
    return null;
  }
}

export default function () {
  const user = userForVu();
  let token;
  let userId;
  let product;
  let finalAmount;

  group('01 Login', () => {
    const response = http.post(
      `${BASE_URL}/api/login`,
      JSON.stringify({ email: user.email, password: user.password }),
      requestParams(null, 'POST /api/login'),
    );
    loginDuration.add(response.timings.duration);
    const body = safeJson(response);
    const passed = check(response, {
      'login status is 200': (r) => r.status === 200,
      'login returns token': () => typeof body?.token === 'string' && body.token.length > 0,
      'login returns user id': () => Number.isInteger(body?.user?.id),
    });
    if (passed) {
      token = body.token;
      userId = body.user.id;
    }
  });

  if (!token) return;
  sleep(1);

  group('02 Browse and search products', () => {
    const productsResponse = http.get(`${BASE_URL}/api/products`, {
      tags: { name: 'GET /api/products' },
    });
    productsDuration.add(productsResponse.timings.duration);
    const products = safeJson(productsResponse);
    const loaded = check(productsResponse, {
      'products status is 200': (r) => r.status === 200,
      'products returns 500 records': () => Array.isArray(products) && products.length === 500,
    });
    if (!loaded) return;

    product = products[(__VU + __ITER) % products.length];
    finalAmount = product.price;
    const keyword = encodeURIComponent(product.name.split(' ')[0]);

    const searchResponse = http.get(`${BASE_URL}/api/products?search=${keyword}`, {
      tags: { name: 'GET /api/products?search' },
    });
    searchDuration.add(searchResponse.timings.duration);
    check(searchResponse, {
      'search status is 200': (r) => r.status === 200,
      'search returns products': (r) => Array.isArray(safeJson(r)) && safeJson(r).length > 0,
    });

    const detailResponse = http.get(`${BASE_URL}/api/products/${product.id}`, {
      tags: { name: 'GET /api/products/:id' },
    });
    productDetailDuration.add(detailResponse.timings.duration);
    check(detailResponse, {
      'product detail status is 200': (r) => r.status === 200,
      'product detail id matches': (r) => safeJson(r)?.id === product.id,
    });
  });

  if (!product) return;
  sleep(1);

  group('03 Add to cart', () => {
    const response = http.post(
      `${BASE_URL}/api/cart`,
      JSON.stringify({ id: product.id, name: product.name, price: product.price, quantity: 1 }),
      requestParams(token, 'POST /api/cart'),
    );
    addCartDuration.add(response.timings.duration);
    check(response, {
      'add cart status is 200': (r) => r.status === 200,
      'add cart is confirmed': (r) => safeJson(r)?.message === 'Added to cart',
    });
  });

  sleep(1);

  group('04 Apply coupon', () => {
    const response = http.post(
      `${BASE_URL}/api/apply-coupon`,
      JSON.stringify({ code: COUPON_CODE, total_amount: product.price, user_id: userId }),
      requestParams(null, 'POST /api/apply-coupon'),
    );
    couponDuration.add(response.timings.duration);
    const body = safeJson(response);
    const passed = check(response, {
      'coupon status is 200': (r) => r.status === 200,
      'coupon returns final amount': () => Number(body?.final_amount) > 0,
    });
    if (passed) finalAmount = Number(body.final_amount);
  });

  sleep(1);

  group('05 Checkout', () => {
    const response = http.post(
      `${BASE_URL}/api/checkout`,
      JSON.stringify({ total_amount: finalAmount, shipping_address: user.address }),
      requestParams(token, 'POST /api/checkout'),
    );
    checkoutDuration.add(response.timings.duration);
    const passed = check(response, {
      'checkout status is 200': (r) => r.status === 200,
      'checkout returns order id': (r) => Number.isInteger(safeJson(r)?.orderId),
    });
    if (passed) successfulCheckouts.add(1);
  });

  sleep(1);
}
