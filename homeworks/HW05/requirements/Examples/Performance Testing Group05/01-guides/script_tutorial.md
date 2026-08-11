# Tutorial viết script k6 cho EShop SUT

Tài liệu này giải thích ý nghĩa các phần thường có trong file script `.js` của k6, ví dụ `smoke.js`, `load-products.js`, `login-and-profile.js`.

Nguồn tham khảo chính:

- k6 Options reference: https://grafana.com/docs/k6/latest/using-k6/k6-options/reference/
- k6 Thresholds: https://grafana.com/docs/k6/latest/using-k6/thresholds/
- k6 Ramping VUs: https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/
- k6 Scenarios: https://grafana.com/docs/k6/latest/using-k6/scenarios/
- k6 Test lifecycle: https://grafana.com/docs/k6/latest/using-k6/test-lifecycle/
- k6 HTTP API: https://grafana.com/docs/k6/latest/javascript-api/k6-http/
- k6 HTTP params: https://grafana.com/docs/k6/latest/javascript-api/k6-http/params/
- k6 Built-in metrics: https://grafana.com/docs/k6/latest/using-k6/metrics/reference/

## 1. Cấu trúc cơ bản của một file k6

Một script k6 thường có dạng:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '10s',
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/products`);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

Ý nghĩa:

- `import http from 'k6/http'`: dùng module HTTP của k6 để gọi API.
- `import { check, sleep } from 'k6'`: dùng `check()` để kiểm tra kết quả, dùng `sleep()` để giả lập thời gian người dùng nghỉ giữa các thao tác.
- `export const options`: cấu hình cách k6 chạy test.
- `BASE_URL`: URL backend, có thể lấy từ biến môi trường.
- `export default function ()`: phần code mỗi virtual user sẽ lặp lại trong lúc test chạy.

## 2. VU là gì?

`VU` là viết tắt của `Virtual User`, nghĩa là người dùng ảo.

Ví dụ:

```javascript
export const options = {
  vus: 10,
  duration: '30s',
};
```

Nghĩa là k6 sẽ giả lập 10 người dùng ảo cùng chạy script trong 30 giây.

Mỗi VU sẽ lặp lại hàm:

```javascript
export default function () {
  // code test nằm ở đây
}
```

cho tới khi hết thời gian test.

## 3. Đơn vị thời gian trong k6

Các giá trị thời gian trong k6 thường viết bằng string.

Các đơn vị hay dùng:

```text
ms = milliseconds = mili giây
s  = seconds      = giây
m  = minutes      = phút
h  = hours        = giờ
```

Ví dụ:

```javascript
duration: '500ms'
duration: '10s'
duration: '2m'
duration: '1h'
```

Trong script performance test của nhóm, nên dùng chủ yếu:

- `'10s'`, `'30s'` cho smoke test.
- `'1m'`, `'3m'`, `'5m'` cho load test ngắn.
- `'10m'`, `'30m'`, `'1h'` cho soak test nếu máy đủ mạnh.

## 4. `options` dùng để làm gì?

`options` là nơi cấu hình cách k6 chạy test.

Ví dụ đơn giản:

```javascript
export const options = {
  vus: 5,
  duration: '30s',
};
```

Nghĩa là:

- Chạy 5 virtual users.
- Chạy trong 30 giây.

Ví dụ có threshold:

```javascript
export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};
```

Nghĩa là:

- Chạy 5 VU trong 30 giây.
- Test chỉ pass nếu request lỗi dưới 1%.
- Test chỉ pass nếu 95% request hoàn thành dưới 800ms.

## 5. `thresholds` có tác dụng gì?

`thresholds` là điều kiện pass/fail cho performance test.

Nếu metric vượt ngưỡng, test sẽ fail. Điều này giúp nhóm không chỉ nhìn bằng mắt mà có tiêu chí rõ ràng.

Ví dụ:

```javascript
thresholds: {
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<800'],
}
```

Ý nghĩa:

- `http_req_failed`: tỉ lệ request HTTP bị fail.
- `rate<0.01`: tỉ lệ fail phải nhỏ hơn 0.01, tức nhỏ hơn 1%.
- `http_req_duration`: tổng thời gian xử lý request.
- `p(95)<800`: 95% request phải chạy dưới 800ms.

Một số threshold hay dùng:

```javascript
thresholds: {
  checks: ['rate>0.95'],
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['avg<500'],
  http_req_duration: ['p(95)<800'],
}
```

Giải thích:

- `checks: ['rate>0.95']`: trên 95% check phải pass.
- `http_req_failed: ['rate<0.01']`: dưới 1% request được phép lỗi.
- `http_req_duration: ['avg<500']`: thời gian trung bình dưới 500ms.
- `http_req_duration: ['p(95)<800']`: 95% request dưới 800ms.

Lưu ý: Nếu cùng một metric có nhiều điều kiện, viết chung trong một array:

```javascript
thresholds: {
  http_req_duration: ['avg<500', 'p(95)<800', 'p(99)<1500'],
}
```

## 6. `stages` dùng để tăng/giảm tải

`stages` dùng khi muốn tải tăng dần hoặc giảm dần theo thời gian.

Ví dụ:

```javascript
export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};
```

Ý nghĩa:

- Trong 30 giây đầu, tăng dần từ 0 lên 10 VU.
- Trong 1 phút tiếp theo, tăng từ 10 lên 20 VU hoặc giữ quanh 20 VU.
- Trong 30 giây cuối, giảm từ 20 về 0 VU.

`duration` là thời gian của stage.

`target` là số VU mục tiêu ở cuối stage đó.

## 7. Cách viết các kiểu `stages`

### Smoke test nhẹ

Dùng để kiểm tra app còn chạy không:

```javascript
export const options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '10s', target: 0 },
  ],
};
```

### Load test tăng vừa phải

Dùng để giả lập tải bình thường:

```javascript
export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};
```

### Stress test

Dùng để tìm điểm hệ thống bắt đầu chậm hoặc lỗi:

```javascript
export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 0 },
  ],
};
```

Lưu ý với repo EShop local: backend dùng Node.js + SQLite, không nên tăng quá cao ngay. Nên thử 10, 20, 50 trước.

### Spike test

Dùng để giả lập tải tăng đột ngột:

```javascript
export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '10s', target: 80 },
    { duration: '30s', target: 80 },
    { duration: '10s', target: 0 },
  ],
};
```

### Soak test

Dùng để chạy lâu, xem hệ thống có chậm dần hoặc lỗi theo thời gian không:

```javascript
export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '30m', target: 20 },
    { duration: '1m', target: 0 },
  ],
};
```

## 8. `check()` dùng để làm gì?

`check()` dùng để kiểm tra response có đúng như mong đợi không.

Ví dụ:

```javascript
const res = http.get(`${BASE_URL}/api/products`);

check(res, {
  'status is 200': (r) => r.status === 200,
  'response time < 500ms': (r) => r.timings.duration < 500,
});
```

Ý nghĩa:

- Check 1: status code phải là 200.
- Check 2: request phải chạy dưới 500ms.

Nếu check fail, k6 vẫn tiếp tục chạy, nhưng metric `checks` sẽ ghi nhận fail.

Muốn fail cả test nếu check pass rate thấp, thêm threshold:

```javascript
thresholds: {
  checks: ['rate>0.95'],
}
```

## 9. `sleep()` dùng để làm gì?

`sleep()` tạm dừng VU trong một khoảng thời gian.

Ví dụ:

```javascript
sleep(1);
```

Nghĩa là mỗi VU nghỉ 1 giây trước khi lặp tiếp.

Tác dụng:

- Giả lập hành vi người dùng thật.
- Tránh bắn request liên tục quá nhanh.
- Làm test thực tế hơn.

Ví dụ:

```javascript
export default function () {
  http.get(`${BASE_URL}/api/products`);
  sleep(1);
  http.get(`${BASE_URL}/api/categories`);
  sleep(2);
}
```

Luồng này giống người dùng xem sản phẩm, nghỉ 1 giây, rồi xem danh mục, nghỉ 2 giây.

## 10. Gọi API GET

Ví dụ gọi danh sách sản phẩm:

```javascript
const res = http.get(`${BASE_URL}/api/products`);
```

Ví dụ có check:

```javascript
const res = http.get(`${BASE_URL}/api/products`);

check(res, {
  'products status is 200': (r) => r.status === 200,
});
```

## 11. Gọi API POST JSON

Ví dụ đăng nhập:

```javascript
const loginRes = http.post(
  `${BASE_URL}/api/login`,
  JSON.stringify({
    email: 'test@eshop.com',
    password: 'Test1234!',
  }),
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
```

Lưu ý:

- Body JSON nên dùng `JSON.stringify(...)`.
- Header cần có `'Content-Type': 'application/json'`.

Check login:

```javascript
check(loginRes, {
  'login status is 200': (r) => r.status === 200,
  'login returns token': (r) => Boolean(r.json('token')),
});
```

## 12. Gọi API có token

Sau khi login, lấy token:

```javascript
const token = loginRes.json('token');
```

Gọi API cần đăng nhập:

```javascript
const profileRes = http.get(`${BASE_URL}/api/users/me`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

Ví dụ đầy đủ:

```javascript
const loginRes = http.post(
  `${BASE_URL}/api/login`,
  JSON.stringify({
    email: 'test@eshop.com',
    password: 'Test1234!',
  }),
  {
    headers: { 'Content-Type': 'application/json' },
  }
);

const token = loginRes.json('token');

if (token) {
  const profileRes = http.get(`${BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  check(profileRes, {
    'profile status is 200': (r) => r.status === 200,
  });
}
```

## 13. Biến môi trường `__ENV`

`__ENV` dùng để truyền giá trị từ terminal vào script.

Trong script:

```javascript
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
```

Chạy trên PowerShell:

```powershell
$env:BASE_URL="http://localhost:3000"
k6 run performance-tests\smoke.js
```

Hoặc chạy một dòng:

```powershell
$env:BASE_URL="http://localhost:3000"; k6 run performance-tests\smoke.js
```

Tác dụng:

- Không cần sửa code khi đổi môi trường.
- Local có thể dùng `http://localhost:3000`.
- Docker có thể dùng `http://host.docker.internal:3000`.

## 14. `setup()` và `teardown()`

k6 có lifecycle chính:

- Init code: phần import, khai báo biến, khai báo options.
- `setup()`: chạy một lần trước khi VU bắt đầu.
- `default()`: code chính của VU, chạy lặp lại.
- `teardown()`: chạy một lần sau khi test kết thúc.

Ví dụ:

```javascript
import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/api/login`,
    JSON.stringify({
      email: 'test@eshop.com',
      password: 'Test1234!',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  return {
    token: loginRes.json('token'),
  };
}

export default function (data) {
  const res = http.get(`${BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

  check(res, {
    'profile status is 200': (r) => r.status === 200,
  });
}

export function teardown(data) {
  console.log('Test finished');
}
```

Lưu ý:

- `setup()` chỉ chạy một lần cho cả test.
- `default()` chạy nhiều lần bởi nhiều VU.
- Dữ liệu return từ `setup()` được truyền vào `default(data)` và `teardown(data)`.
- Không nên dùng chung một token/tài khoản cho flow làm thay đổi dữ liệu quá nhiều nếu test tải cao.

## 15. `scenarios` là gì?

`scenarios` dùng khi muốn nhiều loại luồng chạy trong cùng một script.

Ví dụ một script có hai luồng:

- Người dùng xem sản phẩm.
- Người dùng đăng nhập xem profile.

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    browse_products: {
      executor: 'constant-vus',
      vus: 5,
      duration: '1m',
      exec: 'browseProducts',
    },
    login_profile: {
      executor: 'constant-vus',
      vus: 2,
      duration: '1m',
      exec: 'loginAndProfile',
    },
  },
};

export function browseProducts() {
  const res = http.get(`${BASE_URL}/api/products`);

  check(res, {
    'products status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

export function loginAndProfile() {
  const loginRes = http.post(
    `${BASE_URL}/api/login`,
    JSON.stringify({
      email: 'test@eshop.com',
      password: 'Test1234!',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const token = loginRes.json('token');

  if (token) {
    http.get(`${BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  sleep(1);
}
```

Trong `scenarios`:

- `executor`: kiểu chạy scenario.
- `vus`: số user ảo cho scenario đó.
- `duration`: thời gian chạy.
- `exec`: tên function sẽ được chạy.

## 16. Các executor hay dùng

### `constant-vus`

Giữ số lượng VU cố định.

```javascript
scenarios: {
  products: {
    executor: 'constant-vus',
    vus: 10,
    duration: '1m',
    exec: 'browseProducts',
  },
}
```

Dùng khi muốn giả lập 10 user hoạt động liên tục trong 1 phút.

### `ramping-vus`

Tăng/giảm VU theo stage.

```javascript
scenarios: {
  products: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '30s', target: 10 },
      { duration: '1m', target: 20 },
      { duration: '30s', target: 0 },
    ],
    exec: 'browseProducts',
  },
}
```

Dùng khi muốn load test/stress test tăng tải dần.

### `constant-arrival-rate`

Giữ tốc độ tạo iteration cố định, ví dụ 30 request-flow mỗi giây.

```javascript
scenarios: {
  products: {
    executor: 'constant-arrival-rate',
    rate: 30,
    timeUnit: '1s',
    duration: '30s',
    preAllocatedVUs: 10,
    maxVUs: 50,
    exec: 'browseProducts',
  },
}
```

Ý nghĩa:

- `rate: 30`: tạo 30 iteration.
- `timeUnit: '1s'`: mỗi 1 giây.
- `preAllocatedVUs: 10`: chuẩn bị sẵn 10 VU.
- `maxVUs: 50`: nếu cần, k6 có thể tăng tối đa tới 50 VU để giữ rate.

Dùng khi muốn test theo số request/flow mỗi giây, thay vì theo số user ảo.

## 17. Metric thường gặp

k6 tự thu thập nhiều metric. Những metric cần xem nhất:

```text
checks
http_req_duration
http_req_failed
http_reqs
iterations
vus
vus_max
data_received
data_sent
```

Ý nghĩa:

- `checks`: tỉ lệ check pass/fail.
- `http_req_duration`: tổng thời gian request HTTP.
- `http_req_failed`: tỉ lệ request bị lỗi.
- `http_reqs`: tổng số request đã gửi.
- `iterations`: số lần chạy hàm test.
- `vus`: số VU đang active.
- `vus_max`: số VU tối đa.
- `data_received`: dữ liệu nhận về.
- `data_sent`: dữ liệu gửi đi.

Trong report, nên ghi ít nhất:

- `http_req_duration avg`
- `http_req_duration p(95)`
- `http_req_duration p(99)`
- `http_req_failed`
- `checks`
- Số VU hoặc stages đã dùng

## 18. Tùy chỉnh summary output

Chạy k6 với summary nhiều percentile hơn:

```powershell
k6 run --summary-trend-stats="min,avg,med,p(90),p(95),p(99),max" performance-tests\load-products.js
```

Xuất summary JSON:

```powershell
k6 run --summary-export=performance-tests\summary.json performance-tests\load-products.js
```

Đặt đơn vị thời gian summary là milliseconds:

```javascript
export const options = {
  summaryTimeUnit: 'ms',
};
```

## 19. Mẫu script đầy đủ cho EShop

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    checks: ['rate>0.95'],
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
  summaryTimeUnit: 'ms',
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const productsRes = http.get(`${BASE_URL}/api/products`);

  check(productsRes, {
    'GET /api/products status is 200': (r) => r.status === 200,
    'GET /api/products p95 target helper': (r) => r.timings.duration < 800,
  });

  const categoriesRes = http.get(`${BASE_URL}/api/categories`);

  check(categoriesRes, {
    'GET /api/categories status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

## 20. Checklist khi viết script mới

1. Xác định API hoặc flow cần test.
2. Chọn loại test: smoke, load, stress, spike, soak.
3. Viết `options`.
4. Chọn `vus + duration` hoặc `stages`.
5. Thêm `thresholds` để có pass/fail rõ ràng.
6. Gọi API bằng `http.get`, `http.post`, `http.put`, `http.del`.
7. Thêm `check()` cho status code và dữ liệu quan trọng.
8. Thêm `sleep()` để mô phỏng người dùng thật.
9. Chạy thử với tải nhỏ trước.
10. Tăng tải từ từ và ghi lại kết quả.

## 21. Lưu ý riêng cho repo EShop

- Backend local chạy ở `http://localhost:3000`.
- Nếu chạy k6 bằng Docker, dùng `http://host.docker.internal:3000`.
- Không nên stress test quá cao ngay vì backend local dùng SQLite.
- Với flow login/cart/checkout, nên cẩn thận khi nhiều VU dùng chung một tài khoản.
- Với checkout, nên reset database sau test nếu script tạo nhiều đơn hàng.
- Nên bắt đầu từ `GET /api/products`, sau đó mới test login, cart, checkout, admin.

