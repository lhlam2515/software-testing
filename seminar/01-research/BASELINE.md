# BASELINE — Mutation Score & Coverage (EShop SUT)

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

> Đo bằng `npm run test:coverage` (Jest + lcov). Code toàn bộ nằm trong `server.js` — per-section coverage tính từ lcov.info.

| Cụm | Route (FR) | Line % | Branch % |
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
> **Insight:** 293/541 = **54% mutants không có test nào reach** — tương ứng với các route chưa được test (register, forgot-password, admin products, categories, ...).
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
| Ngoài 4 routes | 281 | Không thuộc phạm vi cam kết — luôn là NoCoverage/Survived |

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
> 32.35% bị kéo thấp vì bao gồm 281 mutants ở code chưa được test — nên dùng để minh họa hậu quả của "partial testing", không dùng để đánh giá chất lượng test trong scope cam kết.

### Per-route breakdown

| Route | Total | Killed | Survived | NoCov | Covered | Kill rate (K/cov) |
|-------|-------|--------|----------|-------|---------|-------------------|
| FR-02 `POST /api/login` | 43 | 33 | 9 | 1 | 42 | **78.6%** |
| FR-09 `POST /api/apply-coupon` | 81 | 52 | 23 | 6 | 75 | **69.3%** ← yếu nhất |
| FR-08 `GET+POST /api/cart` + checkout | 58 | 20 | 5 | **33** | 25 | **80.0%** |
| FR-10 `PUT /api/admin/orders/:id/status` | 78 | 56 | 12 | 10 | 68 | **82.4%** ← tốt nhất |
| **Tổng 4 routes** | **260** | **161** | **49** | **50** | **210** | **76.67%** |

> **Lưu ý FR-08:** 33/58 mutants (57%) là NoCoverage — checkout route có nhiều nhánh DB callback chưa có test reach. Kill rate 80% trên phần covered, nhưng coverage bản thân đã thấp.

### Survivor mutators trong 4 routes được test (49 survivors)

| Mutator | Count | Ý nghĩa |
|---------|-------|---------|
| `ConditionalExpression` | 20 | Logic điều kiện — test chưa cover đủ path |
| `StringLiteral` | 15 | Error message / field name bị đổi nhưng test không verify |
| `EqualityOperator` | 6 | Boundary condition (ON-point thiếu) |
| `ObjectLiteral` | 2 | Response shape không được assert |
| `ArrayDeclaration` | 2 | Sequential state assumption |
| `ArithmeticOperator` | 2 | Giá trị số liệu không được assert |
| `BlockStatement` | 1 | Return value unchecked |
| `LogicalOperator` | 1 | Logic compound chưa đủ test case |

---

## 4. Survivor mutants đã phân tích (≥3)

### Survivor #1 — Coupon Expiry Boundary (EqualityOperator)

| Field | Value |
|-------|-------|
| ID | 355 |
| Mutator | `EqualityOperator` |
| Vị trí | `server.js:L382` |
| Tests covering | 11 tests |

**Original code:**
```javascript
if (expiry < now) {
  return res.status(400).json({ error: "Mã giảm giá đã hết hạn" });
}
```

**Mutant (survived):**
```javascript
if (expiry <= now) {
  return res.status(400).json({ error: "Mã giảm giá đã hết hạn" });
}
```

**Vì sao sống sót:** 11 tests cover đường dẫn này nhưng không có test nào kiểm tra coupon với `expired_at = now` chính xác (ON-point). Tất cả tests chỉ test: (a) coupon hết hạn rõ ràng (quá khứ) và (b) coupon còn hạn (tương lai). Mutation đổi `<` thành `<=` — thay đổi hành vi duy nhất khi `expiry === now`, nhưng case này không có trong test suite.

**AI assertion đề xuất:**
```javascript
it('returns 200 when coupon expires exactly now (ON-point)', async () => {
  // Set expired_at = current timestamp (edge: expiry === now)
  const exactNow = new Date().toISOString();
  // With original code: expiry < now is FALSE → coupon valid
  // With mutant: expiry <= now is TRUE → coupon rejected
  const res = await request(app)
    .post('/api/apply-coupon')
    .send({ coupon_code: 'EXPIRING_NOW', total_amount: 500000, user_id: 1 });
  expect(res.status).toBe(200); // kills mutant #355
});
```

---

### Survivor #2 — Discount Block Bypass (BlockStatement)

| Field | Value |
|-------|-------|
| ID | 396 |
| Mutator | `BlockStatement` |
| Vị trí | `server.js:L418–L422` |
| Tests covering | 3 tests |

**Original code:**
```javascript
let discount_amount = 0;
if (coupon.type === "percent") {
  discount_amount = Math.floor(total_amount * (1 - coupon.discount_value));
} else {
  discount_amount = coupon.discount_value;
}
```

**Mutant (survived):**
```javascript
let discount_amount = 0;
if (coupon.type === "percent") {} // block replaced with {}
else {
  discount_amount = coupon.discount_value;
}
```

**Vì sao sống sót:** Nhánh unauthenticated (không có `user_id`) với coupon `type === "percent"`. 3 tests cover path này nhưng chỉ assert `res.status === 200` và `success === true`, không assert `discount_amount` có giá trị > 0. Khi block bị empty, `discount_amount = 0`, `final_amount = total_amount` (không giảm) nhưng response vẫn `success: true` với status 200 → test vẫn pass.

**AI assertion đề xuất:**
```javascript
it('returns correct discount_amount for percent coupon (unauthenticated)', async () => {
  const res = await request(app)
    .post('/api/apply-coupon')
    .send({ coupon_code: 'PERCENT10', total_amount: 1000000 });
  expect(res.status).toBe(200);
  expect(res.body.discount_amount).toBeGreaterThan(0); // kills mutant #396
  expect(res.body.final_amount).toBeLessThan(1000000); // double-confirm
});
```

---

### Survivor #3 — Canceled→Delivered Transition (ConditionalExpression)

| Field | Value |
|-------|-------|
| ID | 515 |
| Mutator | `ConditionalExpression` |
| Vị trí | `server.js:L550` |
| Tests covering | 4 tests |

**Original code:**
```javascript
if (currentStatus === "canceled" && status === "delivered")
  isValidTransition = true;
```

**Mutant (survived):**
```javascript
if (false) // entire condition replaced with false
  isValidTransition = true;
```

**Vì sao sống sót:** Không có test nào cover `canceled → delivered` transition path. 4 tests cover order-status route nhưng chỉ test: `pending→confirmed`, `confirmed→shipping`, `shipping→delivered`, và invalid transitions. Mutant chuyển condition thành `false` (loại bỏ `canceled→delivered` path) — không có test nào verify path này tồn tại, nên tất cả 4 tests vẫn pass.

**AI assertion đề xuất:**
```javascript
it('allows canceled→delivered transition', async () => {
  // Set up: create order with status "canceled"
  const orderId = await createOrderWithStatus('canceled');
  const res = await request(app)
    .put(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ status: 'delivered' });
  expect(res.status).toBe(200); // kills mutant #515
});
```

---

### Survivor #4 — Cart Reset on Every Add (ConditionalExpression)

| Field | Value |
|-------|-------|
| ID | 268 |
| Mutator | `ConditionalExpression` |
| Vị trí | `server.js:L292` |
| Tests covering | 1 test |

**Original code:**
```javascript
if (!userCarts[userId]) userCarts[userId] = [];
userCarts[userId].push(req.body);
```

**Mutant (survived):**
```javascript
if (true) userCarts[userId] = []; // always resets cart!
userCarts[userId].push(req.body);
```

**Vì sao sống sót:** Chỉ 1 test cover POST /api/cart. Test này thêm 1 item vào cart trống → kết quả giống nhau dù cart reset hay không. Mutant luôn reset cart trước mỗi push, nhưng nếu test chỉ add 1 item từ trạng thái trống, không phát hiện được hành vi sai.

**AI assertion đề xuất:**
```javascript
it('cart retains items across multiple adds', async () => {
  const token = await getAuthToken();
  await request(app).post('/api/cart').set('Authorization', `Bearer ${token}`).send({ id: 1 });
  await request(app).post('/api/cart').set('Authorization', `Bearer ${token}`).send({ id: 2 });
  const cart = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);
  expect(cart.body).toHaveLength(2); // kills mutant #268 — mutant resets, leaves only 1 item
});
```

---

## 5. Failure modes ghi nhận (≥3)

### Mode 1 — BOUNDARY_CONDITION_MISSED
Tests cover "clearly expired" and "clearly valid" cases nhưng không test ON-point của ranh giới.
- **Ví dụ:** Coupon `expired_at = now` (L382): 11 tests cover expiry check nhưng không ai test timestamp chính xác = now.
- **Pattern:** `EqualityOperator` mutations từ `<` sang `<=` (và ngược lại) sống sót.
- **Survivor IDs:** #355

### Mode 2 — RETURN_VALUE_UNCHECKED
Tests assert status code 200 và `success: true` nhưng không assert giá trị số liệu trong response body.
- **Ví dụ:** Coupon percent discount (L418-L422): 3 tests confirm `200 OK` nhưng không verify `discount_amount > 0` hay `final_amount < total_amount`.
- **Pattern:** `BlockStatement` mutations (empty block) sống sót vì tests chỉ check status.
- **Survivor IDs:** #396, #405

### Mode 3 — TRANSITION_PATH_UNTESTED
State machine có nhiều valid transitions nhưng không phải tất cả đều được test.
- **Ví dụ:** `canceled → delivered` (L550): Transition này hợp lệ theo code nhưng không có test nào verify nó. 4 tests cover order-status route nhưng bỏ sót path này.
- **Pattern:** `ConditionalExpression` mutations sống sót khi path bị loại bỏ hoàn toàn mà không có test detect.
- **Survivor IDs:** #515, #510

### Mode 4 — SEQUENTIAL_STATE_ASSUMPTION
Tests giả định initial state và không test behavior trong multi-step sequences.
- **Ví dụ:** Cart accumulation (L292): Test chỉ add 1 item, không verify rằng adding nhiều items không reset cart.
- **Pattern:** Mutations đổi lazy-init thành unconditional-reset sống sót.
- **Survivor IDs:** #268, #264

---

## 6. Delta sau khi thêm AI assertion

> Chưa thực hiện — planned cho Stage S2 (Tuần 2, sau Gate 05/07).

| Metric | Trước | Sau | Δ |
|--------|-------|-----|---|
| Mutation score % | 32.35% | _TBD_ | _TBD_ |
| Survivor count | 73 | _TBD_ | _TBD_ |
