# Test Convention — EShop Backend

> Áp dụng cho toàn bộ bộ test baseline (T3a + T3b).  
> Stack: Jest 30 · supertest · SQLite (callback-based).

---

## 1. Cấu trúc thư mục

```
apps/backend/
├── __tests__/
│   ├── helpers/
│   │   ├── auth.js        # tạo JWT token hợp lệ cho test
│   │   └── db.js          # seed / reset DB trước mỗi test suite
│   ├── coupon.test.js     # T3a — Lâm (FR-09 apply-coupon)
│   ├── auth.test.js       # T3a — Lâm (FR-02 login)
│   ├── order-status.test.js  # T3b — Vũ (FR-10 order status)
│   └── cart.test.js       # T3b — Vũ (FR-08 cart/checkout)
├── jest.config.js
├── stryker.config.mjs
└── server.js
```

Mỗi file test = một feature/route cluster. Không gộp nhiều FR vào một file.

---

## 2. Cấu trúc một file test

```js
// __tests__/coupon.test.js
const request = require('supertest');
const app     = require('../server');
const { getAuthToken } = require('./helpers/auth');

// Nhóm theo route, không phải theo HTTP method
describe('POST /api/apply-coupon', () => {

  // Happy path luôn là case đầu tiên
  it('returns discount when valid percent coupon and total meets min-order', async () => {
    const res = await request(app)
      .post('/api/apply-coupon')
      .send({ code: 'PERCENT10', total_amount: 200000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.discount_amount).toBeGreaterThan(0);
    expect(res.body.final_amount).toBeLessThan(200000);
  });

  // Edge / error cases theo thứ tự logic của route handler
  it('returns 400 when total is below min-order threshold', async () => {
    const res = await request(app)
      .post('/api/apply-coupon')
      .send({ code: 'PERCENT10', total_amount: 50000 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/giá trị tối thiểu/i);
  });

  it('returns 404 for unknown coupon code', async () => {
    const res = await request(app)
      .post('/api/apply-coupon')
      .send({ code: 'NOTEXIST', total_amount: 200000 });

    expect(res.status).toBe(404);
  });
});
```

### Quy tắc đặt tên `it()`

```
it('<kết quả mong đợi> when <điều kiện>')
```

Ví dụ đúng:
- `it('returns 400 when coupon is expired')`
- `it('returns discount_amount = 0 when fixed coupon equals total')`

Ví dụ sai (tránh):
- `it('test coupon')` — quá chung
- `it('should work')` — không có thông tin

---

## 3. Helper: auth token

```js
// __tests__/helpers/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'super_secret_key_that_should_not_be_here';

/**
 * Trả về Bearer token hợp lệ cho user test.
 * user_id mặc định = 1 (seeded trong database.sqlite).
 */
function getAuthToken(userId = 1) {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = { getAuthToken };
```

Dùng trong test cần auth:

```js
const token = getAuthToken();
const res = await request(app)
  .put('/api/admin/orders/1/status')
  .set('Authorization', `Bearer ${token}`)
  .send({ status: 'confirmed' });
```

---

## 4. Chiến lược DB

**Dùng `database.sqlite` seeded sẵn ở chế độ read-only cho test.**

- Không tạo DB test riêng (overkill cho scope này).
- Các test **không được ghi vào DB** (tránh dùng route tạo order thật, POST coupon-usage, v.v.).
- `apply-coupon` không có `user_id` → không ghi `coupon_usage` → safe để test nhiều lần.
- Nếu một test buộc phải ghi, dùng `afterEach` để rollback thủ công.

**Không cần `beforeAll` / `afterAll` reset DB** trừ khi file test đó có write operation.

---

## 5. Chạy test

```bash
# Chạy toàn bộ
npm test

# Chạy một file
npx jest __tests__/coupon.test.js

# Chạy với coverage
npm run test:coverage

# Watch mode khi đang viết test
npx jest --watch

# Chạy mutation (sau khi có test xanh)
npm run stryker
```

---

## 6. Checklist trước khi push test

- [ ] `npm test` xanh hoàn toàn (0 failed)
- [ ] Mỗi `it()` có ít nhất 1 `expect()` về `status` và 1 về `body`
- [ ] Không có `console.log` bỏ lại trong test file
- [ ] Tên `it()` đủ mô tả để đọc test output biết ngay case nào fail

---

## 7. Phân công file (T3a / T3b)

| File | Người viết | FR |
|---|---|---|
| `__tests__/coupon.test.js` | Lâm (T3a) | FR-09 |
| `__tests__/auth.test.js` | Lâm (T3a) | FR-02 |
| `__tests__/order-status.test.js` | Vũ (T3b) | FR-10 |
| `__tests__/cart.test.js` | Vũ (T3b) | FR-08 |
| `__tests__/helpers/auth.js` | Lâm | shared |
| `__tests__/helpers/db.js` | Lâm | shared |

> **Review chéo**: sau khi merge T3a và T3b, mỗi người đọc test file của người kia và xác nhận hiểu được từng case trước Gate 28/06.
