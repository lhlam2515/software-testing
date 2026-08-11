import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Gauge, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const EXPECTED_PRODUCTS = Number(__ENV.EXPECTED_PRODUCTS || 5000);

const catalogDuration = new Trend('catalog_duration', true);
const searchDuration = new Trend('search_duration', true);
const productDetailDuration = new Trend('product_detail_duration', true);
const catalogPayloadBytes = new Gauge('catalog_payload_bytes');
const catalogRecordCount = new Gauge('catalog_record_count');

export const options = {
  scenarios: {
    volume_catalog: {
      executor: 'constant-vus',
      vus: 20,
      duration: '90s',
      gracefulStop: '5s',
      tags: { test_type: 'volume', dataset: '5000-products' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
    catalog_duration: ['p(95)<1000'],
    search_duration: ['p(95)<1000'],
    product_detail_duration: ['p(95)<500'],
  },
};

function safeJson(response) {
  try {
    return response.json();
  } catch {
    return null;
  }
}

export default function () {
  let products;

  group('01 Load large catalog', () => {
    const response = http.get(`${BASE_URL}/api/products`, {
      tags: { step: 'full_catalog' },
    });
    catalogDuration.add(response.timings.duration);
    catalogPayloadBytes.add(response.body?.length || 0);
    products = safeJson(response);
    if (Array.isArray(products)) catalogRecordCount.add(products.length);
    check(response, {
      'catalog status is 200': (r) => r.status === 200,
      'catalog contains expected product volume': () =>
        Array.isArray(products) && products.length === EXPECTED_PRODUCTS,
    });
  });
  if (!Array.isArray(products) || products.length === 0) {
    sleep(0.5);
    return;
  }

  group('02 Search large catalog', () => {
    const keyword = encodeURIComponent(`Product ${String((__VU % 8) + 1)}`);
    const response = http.get(`${BASE_URL}/api/products?search=${keyword}`, {
      tags: { step: 'volume_search' },
    });
    searchDuration.add(response.timings.duration);
    check(response, {
      'volume search status is 200': (r) => r.status === 200,
      'volume search returns an array': (r) => Array.isArray(safeJson(r)),
    });
  });

  group('03 Product detail from large catalog', () => {
    const product = products[(__VU * 101 + __ITER * 37) % products.length];
    const response = http.get(`${BASE_URL}/api/products/${product.id}`, {
      tags: { step: 'volume_product_detail' },
    });
    productDetailDuration.add(response.timings.duration);
    check(response, {
      'volume detail status is 200': (r) => r.status === 200,
      'volume detail id matches': (r) => Number(safeJson(r)?.id) === product.id,
    });
  });

  sleep(0.5);
}
