import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    baseline_smoke: {
      executor: 'constant-vus',
      vus: 2,
      duration: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate==0'],
    checks: ['rate==1'],
  },
};

function bodyOf(response) {
  try {
    return response.json();
  } catch (_) {
    return null;
  }
}

export default function () {
  const login = http.post(
    `${BASE_URL}/api/login`,
    JSON.stringify({ email: 'test@eshop.com', password: 'Test1234!' }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'POST /api/login' } },
  );
  const loginBody = bodyOf(login);
  check(login, {
    'login status is 200': (r) => r.status === 200,
    'login returns token': () => Boolean(loginBody?.token),
  });
  if (!loginBody?.token) return;

  const products = http.get(`${BASE_URL}/api/products`, {
    tags: { name: 'GET /api/products' },
  });
  const productList = bodyOf(products);
  check(products, {
    'products status is 200': (r) => r.status === 200,
    'products returns 500 records': () => Array.isArray(productList) && productList.length === 500,
  });
  if (!Array.isArray(productList) || productList.length === 0) return;

  const product = productList[(__VU + __ITER) % productList.length];
  const authHeaders = {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${loginBody.token}` },
  };

  const cart = http.post(
    `${BASE_URL}/api/cart`,
    JSON.stringify({ id: product.id, name: product.name, price: product.price, quantity: 1 }),
    { ...authHeaders, tags: { name: 'POST /api/cart' } },
  );
  check(cart, { 'add cart status is 200': (r) => r.status === 200 });

  const coupon = http.post(
    `${BASE_URL}/api/apply-coupon`,
    JSON.stringify({ code: 'LOADTEST', total_amount: product.price, user_id: loginBody.user.id }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'POST /api/apply-coupon' } },
  );
  const couponBody = bodyOf(coupon);
  check(coupon, {
    'coupon status is 200': (r) => r.status === 200,
    'coupon returns final amount': () => Number(couponBody?.final_amount) > 0,
  });

  const checkout = http.post(
    `${BASE_URL}/api/checkout`,
    JSON.stringify({
      total_amount: Number(couponBody?.final_amount) || product.price,
      shipping_address: '100 Performance Test Street, District 1, Ho Chi Minh City',
    }),
    { ...authHeaders, tags: { name: 'POST /api/checkout' } },
  );
  check(checkout, {
    'checkout status is 200': (r) => r.status === 200,
    'checkout returns order id': (r) => Number.isInteger(bodyOf(r)?.orderId),
  });

  sleep(1);
}
