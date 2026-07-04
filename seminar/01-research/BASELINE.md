# BASELINE - Mutation Score & Coverage (EShop SUT)

> **Đã đo thực tế ngày 2026-06-30.** Owner: M1 (Lâm) chạy full run · M2 (Vũ) review.
> Nguồn lệnh: `stryker.config.mjs` (`mutate: ['server.js']`, `testRunner: 'jest'`, `coverageAnalysis: 'perTest'`).
> SUT: `apps/backend/server.js`.

---

## 1. Môi trường đo

| Field | Value |
|-------|-------|
| Ngày đo | 2026-06-30 |
| StrykerJS version | 9.6.1 |
| Test runner | Jest 30.4.2 + supertest 7.2.2 |
| Node version | v24.11.1 |
| Commit hash | `1b29602` |
| OS | Linux (Fedora 44) |
| Jest config | `maxWorkers: 1`; `testPathIgnorePatterns: ['/node_modules/', '/coverage/']` |
| Stryker config | `concurrency: 1`, `coverageAnalysis: 'perTest'`, `timeoutMS: 60000`, `timeoutFactor: 2`, `testRunnerNodeArgs: ['--jitless']` |
| Test DB harness | Jest/Stryker dùng in-memory DB adapter cùng interface `db.run/get/all/prepare` để loại bỏ `SQLITE_BUSY` / child-process crash trong mutation run |

---

## 2. Coverage baseline (gate 28/06)

> Đo bằng `npm run test:coverage` (Jest + lcov). Code toàn bộ nằm trong `server.js` - per-section coverage tính từ lcov.info.

| Group | Route (FR) | Line % | Branch % |
|-----|-----------|--------|----------|
| A | `POST /api/apply-coupon` (FR-09) | **93%** (27/29) | **85%** (17/20) |
| A | `POST /api/login` (FR-02) | **100%** (18/18) | **92%** (11/12) |
| B | `PUT /api/admin/orders/:id/status` (FR-10) | **86%** (19/22) | **83%** (20/24) |
| B | `POST /api/cart` + `POST /api/checkout` (FR-08) | **59%** (19/32) | **29%** (4/14) |
| **Tổng** | `server.js` overall | **51%** (123/240) | **44%** (57/131) |

> **Ghi chú FR-08:** Coverage thấp do checkout route có nhiều nhánh DB callback chưa được test đầy đủ.

---

## 3. Mutation score baseline (gate 05/07)

> Đo bằng `npm run stryker` (Stryker 9.6.1). Chạy 37 test cases trên 541 mutants từ `server.js`.
> **Run ổn định:** `0 RuntimeError`, `0 Timeout`, `0 CompileError`, `0 pending` trong HTML report hiện tại.

| File | Mutants total | Killed | Survived | Timeout | No-cov | **Mutation Score %** |
|------|--------------|--------|----------|---------|--------|----------------------|
| `server.js` | 541 | 175 | 73 | 0 | 293 | **32.35%** |

> **Overall denominator:** 541 mutants hợp lệ, không có mutant bị loại bởi lỗi runtime/compile.
> **Covered-code denominator:** 541 − 293 (NoCoverage) = **248 mutants được test**.
> **Insight:** 293/541 = **54% mutants không có test nào reach** - tương ứng với các route chưa được test (register, forgot-password, admin products, categories, ...).
>
> **Coverage vs Mutation Score:** Server.js line coverage 51% ↔ overall Mutation Score **32.35%**.
> Trên phần đã được test (248 mutants), kill rate = **70.56%** và **29.44%** vẫn sống sót → **bằng chứng "coverage lies"**:
> code được execute chưa chắc đã được *assert* đúng.

---

## 3b. Mutation Score trên routes được test (scoped analysis)

> Đo bằng cách filter mutants từ HTML report theo line range của 4 FRs mà team phụ trách.
> **Mục đích:** tách nhiễu từ ~281 mutants ở các routes không có test (register, products, categories, admin…) để có con số phản ánh đúng test effectiveness thực tế của team.

### Phân vùng mutants

| Vùng | Mutants | Ghi chú |
|------|---------|---------|
| Trong 4 routes được test | **260** | FR-02 (L32-L67) + FR-09 (L363-L443) + FR-08 (L284-L342) + FR-10 (L525-L580) |
| Ngoài 4 routes | 281 | Không thuộc phạm vi cam kết - luôn là NoCoverage/Survived |

### Scoped mutation score

| Metric | Full `server.js` | **4 routes được test** | Δ |
|--------|-----------------|----------------------|---|
| Total mutants | 541 | **260** | |
| Killed | 175 | **161** | |
| Survived | 73 | **49** | |
| NoCoverage | 293 | **50** | |
| Covered (total − NC) | 248 | **210** | |
| Score (K/total) | 32.35% | **61.92%** | +29.57% |
| **Score Stryker (K/K+S+T)** | **70.56%** | **76.67%** | +6.11% |

> **Con số đại diện cho test effectiveness của team = 76.67%**, không phải 32.35%.
> 32.35% bị kéo thấp vì bao gồm 281 mutants ở code chưa được test - nên dùng để minh họa hậu quả của "partial testing", không dùng để đánh giá chất lượng test trong scope cam kết.

### Per-route breakdown

| Route | Total | Killed | Survived | NoCov | Covered | Kill rate (K/cov) |
|-------|-------|--------|----------|-------|---------|-------------------|
| FR-02 `POST /api/login` | 43 | 33 | 9 | 1 | 42 | **78.6%** |
| FR-09 `POST /api/apply-coupon` | 81 | 52 | 23 | 6 | 75 | **69.3%** ← yếu nhất |
| FR-08 `GET+POST /api/cart` + checkout | 58 | 20 | 5 | **33** | 25 | **80.0%** |
| FR-10 `PUT /api/admin/orders/:id/status` | 78 | 56 | 12 | 10 | 68 | **82.4%** ← tốt nhất |
| **Tổng 4 routes** | **260** | **161** | **49** | **50** | **210** | **76.67%** |

> **Lưu ý FR-08:** 33/58 mutants (57%) là NoCoverage - checkout route có nhiều nhánh DB callback chưa có test reach. Kill rate 80% trên phần covered, nhưng coverage bản thân đã thấp.

### Survivor mutators trong 4 routes được test (49 survivors)

| Mutator | Count | Ý nghĩa |
|---------|-------|---------|
| `ConditionalExpression` | 20 | Logic điều kiện - test chưa cover đủ path |
| `StringLiteral` | 15 | Error message / field name bị đổi nhưng test không verify |
| `EqualityOperator` | 6 | Boundary condition (ON-point thiếu) |
| `ObjectLiteral` | 2 | Response shape không được assert |
| `ArrayDeclaration` | 2 | Sequential state assumption |
| `ArithmeticOperator` | 2 | Giá trị số liệu không được assert |
| `BlockStatement` | 1 | Return value unchecked |
| `LogicalOperator` | 1 | Logic compound chưa đủ test case |

---

## 4. Survivor mutants đã phân tích (≥3)

> Nguồn: `reports/mutation/mutation.html` + `apps/backend/__tests__/{auth,coupon}.test.js`.
> Phân loại theo **2 trục độc lập** (nguồn: `seminar/01-research/clips/2026-07-03_gemini_survivor-classification.md`):
>
> - **Root-Cause Classification**: Equivalent Mutant / Assertion Gap (Weak Assertion) / Boundary Value Blindness / Dead Code / **Missing Test Case** (nhãn mở rộng của team, cho gap về untested path/sequence không khớp 4 nhãn gốc).
> - **Propagation Level** (mô hình PIE): No Coverage / Weakly Survived / Strongly Survived.
>
> ⚠️ **Không nhầm với "Failure Modes"** (`seminar/03-deliverables/User_Guide.md` §6) - đó là hành vi của **bản thân Stryker/AI workflow** đánh lừa người dùng (equivalent-mutant skew score, timeout misclassify, coverage-filter blind spot, AI oracle hallucination...), một khái niệm hoàn toàn khác, vẫn đang **chưa hoàn thành** riêng ở User_Guide.

### 4a. Group A - Coupon + Auth (T5a, owner: Lâm)

#### Survivor A1 - Account Lockout ON-Point bị "trôi" vì timing (Mutant 28, Group A, FR-02)

| Trường | Giá trị |
|---|---|
| Mutant ID | 28 |
| Mutator | `EqualityOperator` |
| Vị trí | `server.js:L40` |
| Route / FR | `POST /api/login` (FR-02) |
| Tests covering | 5 tests |

**Original code:**

```javascript
if (user.locked_until && new Date() < new Date(user.locked_until)) {
  return res.status(403).json({ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." });
}
```

**Mutant (survived):**

```javascript
if (user.locked_until && new Date() <= new Date(user.locked_until)) {
```

**Classification:**

- **Root-Cause Classification:** Boundary Value Blindness
- **Propagation Level:** Weakly Survived - no divergence observed

Test suite thực ra **đã nhắm đúng** ON-point cần kiểm (`locked_until = now`) - đây không phải trường hợp team quên viết boundary test. Vấn đề nằm ở tính **non-deterministic** của môi trường: giữa thời điểm gán giá trị và thời điểm server thực sự evaluate điều kiện, đồng hồ đã trôi qua một khoảng do độ trễ round-trip qua HTTP. Đây không phải một "Equivalent Mutant" thật sự - phép thử với đồng hồ bị đóng băng (frozen clock) cho thấy rõ hai nhánh code (gốc và mutant) có phân kỳ hành vi khi loại bỏ được yếu tố trôi thời gian.

**Vì sao sống sót:** `auth.test.js:162-178` (case `TC-BVA-04`) capture giá trị `now = new Date().toISOString()` ở phía client, ghi xuống DB, rồi mới gửi HTTP request. Trong khoảng giữa lúc capture và lúc `server.js:40` thực sự evaluate `new Date()`, đã trôi qua vài mili-giây do thao tác ghi DB và độ trễ mạng - nên tại thời điểm server kiểm tra, `new Date()` phía server đã lớn hơn `locked_until` đã capture trước đó, không còn bằng nhau. Hệ quả: nhánh `now < locked_until` đã trả `false` từ trước khi mutant kịp đổi `<` thành `<=` - nên cả code gốc lẫn mutant đều trả cùng kết quả `200`.

**Kill assertion (đã triển khai):**

```javascript
it('returns 200 when locked_until exactly equals the server clock (UB: locked_until = now)', async () => {
  const frozen = new Date('2026-07-03T10:00:00.000Z');
  const RealDate = Date;
  class FrozenDate extends RealDate {
    constructor(value) {
      if (arguments.length === 0) {
        return new RealDate(frozen);
      }
      return new RealDate(value);
    }

    static now() {
      return frozen.getTime();
    }
  }
  FrozenDate.parse = RealDate.parse;
  FrozenDate.UTC = RealDate.UTC;

  try {
    global.Date = FrozenDate;
    await dbRun(
      "UPDATE users SET login_attempts=3, locked_until=? WHERE email='test@eshop.com'",
      [frozen.toISOString()]
    );

    const res = await api
      .post('/api/login')
      .send({ email: 'test@eshop.com', password: 'Test1234!' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  } finally {
    global.Date = RealDate;
  }
});
```

**Validation Gate:**

| Check | Kết quả | Bằng chứng |
|---|---|---|
| PASS trên code gốc | ✅ | `npm test` → 27/27 pass |
| FAIL trên mutant (Killed) | ✅ | Mutant 28: `Survived` (`mutation_baseline.html`) → `Killed` (`mutation.html`) |

**Action Item:** Đã kill mutant bằng cách thay `new Date()` runtime bằng một `Date` override giúp đóng băng đồng hồ (`global.Date = FrozenDate`), qua đó loại bỏ hoàn toàn độ trôi thời gian giữa lúc set fixture và lúc server evaluate.

---

#### Survivor A2 - Percent Discount Formula sai (Mutant 397/398, Group A, FR-09)

| Trường | Giá trị |
|---|---|
| Mutant ID | 397, 398 |
| Mutator | `ArithmeticOperator` |
| Vị trí | `server.js:L420` |
| Route / FR | `POST /api/apply-coupon` (FR-09) |
| Tests covering | 3 tests (#1, #11, #16 - nhánh **không có** `user_id`) |

**Original code:**

```javascript
discount_amount = Math.floor(total_amount * (1 - coupon.discount_value));
```

**Mutant 397 (survived):** `total_amount / (1 - coupon.discount_value)`
**Mutant 398 (survived):** `1 + coupon.discount_value` (thay cho `1 - coupon.discount_value`)

**Classification:**

- **Root-Cause Classification:** Assertion Gap (Weak Assertion)
- **Propagation Level:** Strongly Survived

Mutant khiến code thực thi ra giá trị `discount_amount`/`final_amount` khác đi thật sự, và sai lệch này đã lan truyền đến tận response body - nhưng test chỉ assert `status` và `success`, không hề kiểm tra giá trị cụ thể. Đây không phải Equivalent Mutant (vì giá trị **có** thay đổi thật), cũng không phải Boundary Value Blindness (vì không liên quan đến lỗi ở giá trị biên).

**Vì sao sống sót:** Đây chính là `BUG-09-001` mà team đã biết từ trước (`coupon.test.js:101,218,275`). Với coupon loại `percent`, trường `discount_value` được lưu dưới dạng **số nguyên phần trăm** (ví dụ `10` cho mã `SAVE10`) thay vì phân số (`0.1`), trong khi công thức `total_amount * (1 - discount_value)` lại giả định `discount_value` là một phân số → hệ số nhân thực tế trở thành `(1 - 10) = -9`. Giá trị pin thực tế trong test xác nhận điều này: với `total_amount: 500000`, kết quả ra `discount_amount: -4500000` và `final_amount: 5000000` - gấp khoảng **10 lần** tổng tiền gốc, nghiêm trọng hơn nhiều so với mô tả "sai gấp đôi" trước đây (vốn chỉ là suy đoán, chưa đối chiếu giá trị thực tế). Vì bug này đã biết trước, 3 test chạm vào nhánh percent trước T6a chỉ dừng ở `expect(res.status).toBe(200)` và `success: true` - cố tình không assert giá trị cụ thể để tránh làm fail chính bug đã biết.

**Kill assertion (đã triển khai - pin giá trị hiện tại, không sửa SUT):**

```javascript
it('returns 200 with the current percent-coupon arithmetic when valid percent coupon meets min-order (BUG-09-001 pinned)', async () => {
  const res = await api
    .post('/api/apply-coupon')
    .send({ code: 'SAVE10', total_amount: 500000 });

  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.discount_amount).toBe(-4500000);
  expect(res.body.final_amount).toBe(5000000);
});
```

**Validation Gate:**

| Check | Kết quả | Bằng chứng |
|---|---|---|
| PASS trên code gốc | ✅ | `npm test` → 27/27 pass |
| FAIL trên mutant (Killed) | ✅ | Mutant 397, 398: `Survived` → `Killed` trong `mutation.html` |

**Action Item:** Đã kill mutant theo hướng (a): assert giá trị thực tế hiện tại, kèm comment `pinned - regression guard, not fix` để làm rõ đây là regression guard chứ không phải fix. Không sửa lại công thức vì SUT hiện đang sai theo đúng spec; việc sửa root cause nằm ngoài phạm vi T5a/T6a và cần bàn bạc thêm với M2 vì có đụng đến code dùng chung.

---

#### Survivor A3 - Percent Discount Block Bypass, nhánh unauthenticated (Mutant 396, Group A, FR-09)

| Trường | Giá trị |
|---|---|
| Mutant ID | 396 |
| Mutator | `BlockStatement` |
| Vị trí | `server.js:L418–L422` |
| Route / FR | `POST /api/apply-coupon` (FR-09), nhánh unauthenticated (không gửi `user_id`) |
| Tests covering | 3 tests (#1, #11, #16) |

**Original code:**

```javascript
if (coupon.type === "percent") {
  discount_amount = Math.floor(total_amount * (1 - coupon.discount_value));
} else {
  discount_amount = coupon.discount_value;
}
```

**Mutant (survived):**

```javascript
if (coupon.type === "percent") {} // block replaced with {}
else {
  discount_amount = coupon.discount_value;
}
```

**Classification**

- **Root-Cause Classification:** Assertion Gap (Weak Assertion)
- **Propagation Level:** Strongly Survived

Khi block bị thay bằng rỗng, `discount_amount` trở thành `0` thay vì giá trị (dù sai) mà công thức gốc tính ra - sự khác biệt này **có** lan truyền ra tới response body, nhưng vì response vẫn trả `200` và `success: true`, nên bộ test cũ (chỉ kiểm tra status) không hề phát hiện ra.

**Vì sao sống sót:** `coupon.test.js:270-278` (case `TC-BVA-08`, dùng coupon `TOMORROWEXP`, không gửi kèm `user_id`) trước T6a chỉ dừng ở `expect(res.status).toBe(200)` và `success: true`, không assert `discount_amount`. Khi block bị rỗng, `discount_amount = 0`, `final_amount = total_amount` (không giảm giá gì cả) nhưng response vẫn `200/success: true` → test vẫn pass bình thường.

**Kill assertion (đã triển khai):**

```javascript
it('returns 200 with the current percent-coupon arithmetic when coupon expires tomorrow (UB+1: expired_at = tomorrow)', async () => {
  const res = await api
    .post('/api/apply-coupon')
    .send({ code: 'TOMORROWEXP', total_amount: 200000 });

  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.discount_amount).toBe(-1800000);
  expect(res.body.final_amount).toBe(2000000);
});
```

**Validation Gate:**

| Check | Kết quả | Bằng chứng |
|---|---|---|
| PASS trên code gốc | ✅ | `npm test` → 27/27 pass |
| FAIL trên mutant (Killed) | ✅ | Mutant 396: `Survived` → `Killed` trong `mutation.html` (bonus: mutant 393, 395 cùng vùng code cũng bị kill) |

**Action Item:** Đã kill mutant bằng cách assert `discount_amount` khác `0` (pin theo giá trị cụ thể của bug hiện tại), nhờ đó block rỗng do mutant tạo ra bị phát hiện ngay lập tức.

---

### 4b. Group B - Order-status + Cart (T5b, owner: Vũ)

> **Đã hoàn thành phần phân tích T5b/T6b/T7b/T8 ở mức tài liệu.** Xác nhận từ `survivors.json` và `mutation.html`: Mutant 515 và Mutant 268 vẫn **Survived** tính đến baseline 2026-07-03. Chưa có bằng chứng chạy lại `npm test` / `npm run stryker` sau khi thêm assertion, nên Validation Gate được ghi là **Blocked**, không tự suy diễn kết quả.

#### Survivor B1 - Mất transition `canceled -> delivered` (Mutant 515, Group B, FR-10)

| Trường | Giá trị |
|---|---|
| Mutant ID(s) | Mutant 515 |
| Mutator | `ConditionalExpression` |
| Vị trí | `server.js:L550` |
| Route / FR | `PUT /api/admin/orders/:id/status` / FR-10 |
| Tests covering (coveredBy) | 4 tests |

**Original code:**

```javascript
if (currentStatus === "canceled" && status === "delivered")
  isValidTransition = true;
```

**Mutant (survived):**

```javascript
if (false)
  isValidTransition = true;
```

**Classification**

- **Root-Cause Classification:** Missing Test Case (`TRANSITION_PATH_UNTESTED`)
- **Propagation Level:** Strongly Survived

Route order-status đã được cover, nhưng test suite chưa đi đúng cạnh transition `canceled -> delivered`. Mutant này tạo khác biệt hành vi quan sát được: code gốc cho phép transition, còn mutant loại bỏ nhánh này nên transition sẽ bị từ chối.

**Vì sao sống sót:** Các test hiện tại cover route và một số transition khác, nhưng chưa tạo order đang ở trạng thái `canceled` rồi cập nhật sang `delivered`.

**Kill assertion (AI-synthesized):**

```javascript
it('returns 200 and persists delivered when current status is canceled', async () => {
  const token = getAuthToken();
  const orderId = 1; // cần fixture/order seeded có status = "canceled"

  const res = await request(app)
    .put(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${token}`)
    .send({ status: 'delivered' });

  expect(res.status).toBe(200);
  expect(res.body.message).toMatch(/status/i);

  const verify = await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(verify.status).toBe(200);
  expect(verify.body.status).toBe('delivered');
});
```

**Validation Gate:**

| Check | Kết quả | Bằng chứng |
|---|---|---|
| PASS trên code gốc | ⚠️ Blocked | Cần thêm assertion vào test và chạy `npm test`; chưa có output trong repo |
| FAIL trên mutant (Killed sau khi thêm assertion) | ⚠️ Blocked | Cần chạy lại `npm run stryker` và xác nhận Mutant 515: `Survived` -> `Killed` trong `mutation.html` |

**Action Item:** Thêm test transition `canceled -> delivered`; assert cả response lẫn trạng thái lưu cuối cùng. Cần fixture ổn định cho order có status ban đầu là `canceled`.

---

#### Survivor B2 - Giỏ hàng bị reset khi thêm item thứ hai (Mutant 268, Group B, FR-08)

| Trường | Giá trị |
|---|---|
| Mutant ID(s) | Mutant 268 |
| Mutator | `ConditionalExpression` |
| Vị trí | `server.js:L292` |
| Route / FR | `POST /api/cart` / FR-08 |
| Tests covering (coveredBy) | 1 test |

**Original code:**

```javascript
if (!userCarts[userId]) userCarts[userId] = [];
userCarts[userId].push(req.body);
```

**Mutant (survived):**

```javascript
if (true) userCarts[userId] = [];
userCarts[userId].push(req.body);
```

**Classification**

- **Root-Cause Classification:** Missing Test Case (`SEQUENTIAL_STATE_ASSUMPTION`)
- **Propagation Level:** Strongly Survived

Route `POST /api/cart` đã được cover, nhưng chỉ bằng case thêm một item. Mutant chỉ lộ ra khi cùng một user thêm nhiều item liên tiếp, vì nó reset `userCarts[userId]` trước mỗi lần `push`.

**Vì sao sống sót:** Test hiện tại chứng minh một item có thể được thêm vào giỏ hàng, nhưng không assert state sau chuỗi nhiều thao tác.

**Kill assertion (AI-synthesized):**

```javascript
it('keeps existing cart items when the same user adds another item', async () => {
  const token = getAuthToken();

  await request(app)
    .post('/api/cart')
    .set('Authorization', `Bearer ${token}`)
    .send({ product_id: 101, name: 'Item A', price: 10000, quantity: 1 })
    .expect(200);

  await request(app)
    .post('/api/cart')
    .set('Authorization', `Bearer ${token}`)
    .send({ product_id: 102, name: 'Item B', price: 20000, quantity: 2 })
    .expect(200);

  const res = await request(app)
    .get('/api/cart')
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(2);
  expect(res.body).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ product_id: 101, quantity: 1 }),
      expect.objectContaining({ product_id: 102, quantity: 2 }),
    ]),
  );
});
```

**Validation Gate:**

| Check | Kết quả | Bằng chứng |
|---|---|---|
| PASS trên code gốc | ⚠️ Blocked | Cần thêm assertion vào test và chạy `npm test`; chưa có output trong repo |
| FAIL trên mutant (Killed sau khi thêm assertion) | ⚠️ Blocked | Cần chạy lại `npm run stryker` và xác nhận Mutant 268: `Survived` -> `Killed` trong `mutation.html` |

**Action Item:** Thêm test sequence: add item A, add item B, gọi `GET /api/cart`, assert cả hai item còn tồn tại. Cần cô lập state `userCarts` hoặc dùng user riêng cho test này.

---

#### Equivalent / Dead-code triage - startup guard (Mutant 535/536/537, Group B)

| Mutant | Mutator | Vị trí | Original | Replacement | coveredBy |
|---|---|---:|---|---|---:|
| Mutant 535 | `ConditionalExpression` | `server.js:L570` | `require.main === module` | `true` | 0 |
| Mutant 536 | `ConditionalExpression` | `server.js:L570` | `require.main === module` | `false` | 0 |
| Mutant 537 | `EqualityOperator` | `server.js:L570` | `require.main === module` | `require.main !== module` | 0 |

**Context:**

```javascript
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
```

**AI triage result:** Nhóm mutant này là ứng viên **Equivalent Mutant / Dead Code** trong phạm vi Week 2 Group B, vì chỉ ảnh hưởng hành vi startup khi chạy trực tiếp `node server.js`. Nó không kiểm tra logic nghiệp vụ FR-08/FR-10 khi Jest/supertest import `app`.

**Human review note:** Không tự động trừ khỏi denominator. Reviewer cần ký duyệt rõ nếu muốn loại khỏi phân tích, hoặc giữ chúng trong danh sách survivor nhưng không ưu tiên viết assertion để "kill".

---

#### Assumptions / Missing Information

- `survivors.json` chỉ cung cấp số lượng/ID `coveredBy`, không có tên test Jest dạng người đọc hiểu ngay.
- Chưa có output chạy lại `npm test` hoặc `npm run stryker` sau khi thêm assertion, nên không ghi ✅ cho Validation Gate.
- Thời gian setup Stryker và thời gian full run chưa được ghi trong `seminar/`, nên phần T8 chỉ có baseline metrics và mục blocked.

---

## 5. Survivor Root-Cause Patterns (Test Gap Taxonomy, ≥3)

> **Lưu ý phân biệt:** đây là taxonomy phân loại *nguyên nhân sống sót của mutant* (test gap trong test suite EShop, theo `mutation-testing-reference.md` §1.5), phục vụ Learning Objective #2 ("Identify surviving mutants; explain why each survived"). Đây **không phải** mục "Failure Modes" mà rubric §9 (`topic-t10.md`) yêu cầu - mục đó nói về cách *bản thân công cụ/AI đánh lừa người dùng*, đã được viết riêng ở `User_Guide.md` §6 (FM1–FM4). Không dùng 2 khái niệm này thay thế cho nhau.

### Mode 1 - BOUNDARY_CONDITION_MISSED

Tests cover "clearly expired" and "clearly valid" cases nhưng không test ON-point của ranh giới.

- **Ví dụ:** Coupon `expired_at = now` (L382): 11 tests cover expiry check nhưng không ai test timestamp chính xác = now.
- **Pattern:** `EqualityOperator` mutations từ `<` sang `<=` (và ngược lại) sống sót.
- **Survivor IDs:** 355

### Mode 2 - RETURN_VALUE_UNCHECKED

Tests assert status code 200 và `success: true` nhưng không assert giá trị số liệu trong response body.

- **Ví dụ:** Coupon percent discount (L418-L422): 3 tests confirm `200 OK` nhưng không verify `discount_amount > 0` hay `final_amount < total_amount`.
- **Pattern:** `BlockStatement` mutations (empty block) sống sót vì tests chỉ check status.
- **Survivor IDs:** 396, 405

### Mode 3 - TRANSITION_PATH_UNTESTED

State machine có nhiều valid transitions nhưng không phải tất cả đều được test.

- **Ví dụ:** `canceled → delivered` (L550): Transition này hợp lệ theo code nhưng không có test nào verify nó. 4 tests cover order-status route nhưng bỏ sót path này.
- **Pattern:** `ConditionalExpression` mutations sống sót khi path bị loại bỏ hoàn toàn mà không có test detect.
- **Survivor IDs:** 515, 510

### Mode 4 - SEQUENTIAL_STATE_ASSUMPTION

Tests giả định initial state và không test behavior trong multi-step sequences.

- **Ví dụ:** Cart accumulation (L292): Test chỉ add 1 item, không verify rằng adding nhiều items không reset cart.
- **Pattern:** Mutations đổi lazy-init thành unconditional-reset sống sót.
- **Survivor IDs:** 268, 264

---

## 6. Delta sau khi thêm AI assertion

> Cập nhật cho Group B (owner: Vũ). Phần assertion đã được thiết kế cho Mutant 515 và Mutant 268, nhưng chưa có bằng chứng chạy lại `npm test` / `npm run stryker`, nên các số liệu "Sau" vẫn để blocked/TBD thay vì tự suy diễn.

| Metric | Trước | Sau | Δ | Trạng thái |
|--------|-------|-----|---|---|
| Mutation score % (`server.js`) | 32.35% | *TBD* | *TBD* | Blocked - cần chạy lại Stryker sau khi thêm assertion |
| Survivor count (`server.js`) | 73 | *TBD* | *TBD* | Blocked - cần mutation report mới |
| Mutant 515 status | `Survived` | Expected `Killed` | *TBD* | Blocked - cần Validation Gate |
| Mutant 268 status | `Survived` | Expected `Killed` | *TBD* | Blocked - cần Validation Gate |
| AI assertions proposed | 0 | 2 | +2 | Đã có assertion design cho Mutant 515 và Mutant 268 |
| AI assertions used unchanged | 0 | *TBD* | *TBD* | Cần chạy test thật để biết có phải sửa fixture/assertion không |
| AI assertions requiring manual edits | 0 | *TBD* | *TBD* | Cần fixture và test execution evidence |
| Setup time Stryker lần đầu | *Chưa ghi* | *Chưa ghi* | *N/A* | Missing information |
| Full `npm run stryker` time | *Chưa ghi* | *Chưa ghi* | *N/A* | Missing information |

### T8 - Metrics hiện có từ baseline

| Metric | Giá trị |
|---|---:|
| StrykerJS version | 9.6.1 |
| Test runner | Jest 30.4.2 + supertest 7.2.2 |
| Node version | v24.11.1 |
| Full `server.js` mutants | 541 |
| Full `server.js` killed | 175 |
| Full `server.js` survived | 73 |
| Full `server.js` NoCoverage | 293 |
| Full `server.js` mutation score | 32.35% |
| Covered-code kill rate | 70.56% |
| Four tested routes scoped score | 76.67% |
| FR-08 covered kill rate | 80.0% |
| FR-10 covered kill rate | 82.4% |
| RuntimeError / Timeout / CompileError | 0 / 0 / 0 |

### T8 - AI triage equivalent-mutant

Ví dụ triage: Mutant 535/536/537 ở `server.js:L570` mutate guard `require.main === module`. AI hỗ trợ phân biệt rằng đây là startup guard, không phải logic nghiệp vụ `order-status` hoặc `cart/checkout`. Kết luận thực dụng: xếp vào nhóm **Equivalent Mutant / Dead Code candidate** cho phạm vi Week 2 Group B, cần reviewer ký duyệt trước khi loại khỏi denominator.

### Assumptions / Missing Information

- Chưa có thời gian setup Stryker lần đầu.
- Chưa có thời gian một lượt `npm run stryker` full run sau khi thêm assertion.
- Chưa có mutation report mới để xác nhận Mutant 515 và Mutant 268 đã `Killed`.
- Cần fixture ổn định cho order `canceled` và cô lập state `userCarts` trước khi chạy Validation Gate.
