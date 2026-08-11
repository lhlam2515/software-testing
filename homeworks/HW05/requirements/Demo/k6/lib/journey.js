// lib/journey.js — the eShop shopping journey, reused by every test type.
// Model reality: a user logs in, browses, searches, adds to cart, checks out.
// Each request is tagged with a `step` so the dashboard shows per-step latency.

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend } from 'k6/metrics';
import { BASE_URL, USER, params } from '../config.js';

// A custom metric for end-to-end journey time (visible in the summary).
export const journeyTime = new Trend('journey_duration', true);

// think() models human pause time so we don't hammer back-to-back.
function think(min = 1, max = 3) {
  sleep(Math.random() * (max - min) + min);
}

// login → returns a bearer token (eShop contract: POST /auth/login).
export function login() {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: USER.email, password: USER.password }),
    params('login')
  );
  check(res, {
    'login 200': (r) => r.status === 200,
    'got token': (r) => !!(r.json && r.json('token')),
  });
  return res.json ? res.json('token') : null;
}

// One full shopping journey. Call this as the default function of each scenario.
export function shopJourney() {
  const start = Date.now();

  const token = login();
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  think();

  group('browse catalog', function () {
    const list = http.get(`${BASE_URL}/products?page=1&size=20`, params('catalog'));
    check(list, { 'catalog 200': (r) => r.status === 200 });
    think();

    // Open a product detail page.
    const items = list.json && list.json('items') ? list.json('items') : [];
    const id = items.length ? items[Math.floor(Math.random() * items.length)].id : 1;
    const detail = http.get(`${BASE_URL}/products/${id}`, params('product'));
    check(detail, { 'product 200': (r) => r.status === 200 });
    think();
  });

  group('search', function () {
    const q = ['shoes', 'phone', 'book', 'laptop', 'shirt'][Math.floor(Math.random() * 5)];
    const res = http.get(`${BASE_URL}/products/search?q=${q}`, params('search'));
    check(res, { 'search 200': (r) => r.status === 200 });
    think();
  });

  group('add to cart', function () {
    const res = http.post(
      `${BASE_URL}/cart/items`,
      JSON.stringify({ productId: 1, quantity: 1 }),
      Object.assign(params('cart'), auth)
    );
    check(res, { 'cart 200/201': (r) => r.status === 200 || r.status === 201 });
    think();
  });

  group('checkout', function () {
    const res = http.post(
      `${BASE_URL}/checkout`,
      JSON.stringify({ paymentMethod: 'card', couponCode: null }),
      Object.assign(params('checkout'), auth)
    );
    check(res, {
      'checkout 200/201': (r) => r.status === 200 || r.status === 201,
      'order id returned': (r) => !!(r.json && r.json('orderId')),
    });
  });

  journeyTime.add(Date.now() - start);
}
