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

## 2. Coverage baseline (gate 28/06, recomputed 2026-07-31)

> Đo bằng `npm run test:coverage` (Jest + lcov), nguồn `apps/backend/coverage/lcov.info`.
> **Recomputed bằng script xác định:** `apps/backend/scripts/coverage-by-route.js`. Script tự phát hiện code block của từng Express route bằng cách cân bằng dấu `(`/`)` và `{`/`}` bắt đầu từ dòng `app.<method>(...)`, thay vì dùng line range chọn tay như bản đo 28/06 - loại bỏ sai số do ước lượng range thủ công. Chạy: `node scripts/coverage-by-route.js` (từ `apps/backend/`).

| Group | Route (FR) | Line range (auto-detect) | Line % | Branch % |
|-----|-----------|---------------------------|--------|----------|
| A | `POST /api/login` (FR-02) | L32-L66 | **100%** (18/18) | **92%** (11/12) |
| A | `POST /api/apply-coupon` (FR-09) | L363-L441 | **93%** (27/29) | **85%** (17/20) |
| B | `POST /api/cart` + `POST /api/checkout` (FR-08) | L290-L295, L297-L309 | **100%** (11/11) | **75%** (3/4) |
| B | `PUT /api/admin/orders/:id/status` (FR-10) | L525-L568 | **100%** (18/18) | **95%** (21/22) |
| **Tổng 4 routes** | | | **97%** (74/76) | **90%** (52/58) |
| **Tổng** | `server.js` overall | L1-L576 | **52%** (124/240) | **46%** (60/131) |

> **Δ so với bản đo 28/06 (line range chọn tay):** FR-02 và FR-09 khớp 100% với số cũ (range chọn tay tình cờ đúng với code block thật). FR-08 và FR-10 lệch lớn:
> - FR-08 cũ dùng range `L284-L342` (59%/29%, 32 dòng/14 nhánh) - range này thực chất bao gồm cả `GET /api/cart`, `GET /api/orders/my-orders`, và `PUT /api/orders/:id/cancel`, tức 5 route chứ không phải chỉ 2 route mà tên cột (FR-08) công bố. Sau khi giới hạn đúng 2 route đã khai báo, coverage thực tế của `POST /api/cart` + `POST /api/checkout` là **100%/75%**, không phải 59%/29%.
> - FR-10 cũ dùng range `L525-L580`, vượt quá cả độ dài file thực tế (`server.js` chỉ có 576 dòng) - range này tràn vào `if (require.main === module) { app.listen(...) }`, không thuộc route. Route thật kết thúc ở `L568`; coverage đúng là **100%/95%**, không phải 86%/83%.
> - Tổng `server.js` cũng lệch nhẹ (51%→52% line, 44%→46% branch) do cùng nguyên nhân: các route group cũ dùng range sai lệch vài dòng khi cộng dồn.
>
> **Kết luận:** FR-08 (giỏ hàng + checkout) không phải là điểm yếu coverage như baseline 28/06 từng kết luận - 2 route này nhỏ (16 dòng tổng) và được cover gần như hoàn toàn ở mức line. Route thật sự thiếu coverage nằm ở các route ngoài phạm vi 4 FR (register, forgot-password, admin products/categories...), đúng như mục 3 đã ghi nhận qua NoCoverage 293/541 mutants.

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
> **Coverage vs Mutation Score:** Server.js line coverage 52% ↔ overall Mutation Score **32.35%**.
> Trên phần đã được test (248 mutants), kill rate = **70.56%** và **29.44%** vẫn sống sót → **bằng chứng "coverage lies"**:
> code được execute chưa chắc đã được *assert* đúng.

---

## 3b. Mutation Score trên routes được test (scoped analysis, recomputed 2026-07-31)

> Đo bằng cách filter mutants từ `reports/mutation/mutation_baseline.html` theo line range của 4 FRs mà team phụ trách.
> **Recomputed bằng script xác định:** `apps/backend/scripts/mutation-by-route.js`. Script dùng chung route-boundary detector với `coverage-by-route.js` (mục 2) - cân bằng dấu `(`/`)`/`{`/`}` từ dòng `app.<method>(...)` để lấy đúng code block, thay cho line range chọn tay của bản đo trước. Report gốc (541 mutants: 175 Killed, 73 Survived, 293 NoCoverage, 0 Timeout) không đổi - chỉ có ranh giới route dùng để lọc là khác.
> **Mục đích:** tách nhiễu từ các mutants ở routes không có test (register, products, categories, admin…) để có con số phản ánh đúng test effectiveness thực tế của team.

### Phân vùng mutants

| Vùng | Mutants | Ghi chú |
|------|---------|---------|
| Trong 4 routes được test | **215** | FR-02 (L32-L66) + FR-09 (L363-L441) + FR-08 (L290-L295, L297-L309) + FR-10 (L525-L568) |
| Ngoài 4 routes | 326 | Không thuộc phạm vi cam kết - luôn là NoCoverage/Survived |

> **Δ so với bản đo trước (260 trong scope / 281 ngoài scope):** FR-02 và FR-09 không đổi (range chọn tay tình cờ khớp code block thật). FR-08 giảm mạnh 58 → 19 mutants vì range cũ (`L284-L342`) gộp cả `GET /api/cart`, `GET /api/orders/my-orders`, `PUT /api/orders/:id/cancel` - 3 route ngoài cam kết FR-08. FR-10 giảm 78 → 72 vì range cũ (`L525-L580`) tràn quá cuối file thật (576 dòng), gồm cả 3 mutant dead-code ở startup guard `require.main === module` (mutant 535/536/537, mục 4b) vốn không thuộc route order-status.

### Scoped mutation score

| Metric | Full `server.js` | **4 routes được test** | Δ |
|--------|-----------------|----------------------|---|
| Total mutants | 541 | **215** | |
| Killed | 175 | **156** | |
| Survived | 73 | **43** | |
| NoCoverage | 293 | **16** | |
| Covered (total − NC) | 248 | **199** | |
| Score (K/total) | 32.35% | **72.56%** | +40.21% |
| **Score Stryker (K/K+S+T)** | **70.56%** | **78.39%** | +7.83% |

> **Con số đại diện cho test effectiveness của team = 78.39%**, không phải 32.35%.
> 32.35% bị kéo thấp vì bao gồm 326 mutants ở code chưa được test - nên dùng để minh họa hậu quả của "partial testing", không dùng để đánh giá chất lượng test trong scope cam kết.
> **Δ so với bản đo trước (76.67%):** con số đại diện tăng lên +1.72 điểm % sau khi sửa scope FR-08/FR-10 - phần lớn NoCoverage từng gán cho FR-08 (33/58) thực ra thuộc 3 route khác không nằm trong cam kết của team, không phản ánh chất lượng test trên `POST /api/cart` + `POST /api/checkout`.

### Per-route breakdown

| Route | Total | Killed | Survived | NoCov | Covered | Kill rate (K/cov) |
|-------|-------|--------|----------|-------|---------|-------------------|
| FR-02 `POST /api/login` | 43 | 33 | 9 | 1 | 42 | **78.6%** |
| FR-09 `POST /api/apply-coupon` | 81 | 52 | 23 | 6 | 75 | **69.3%** ← yếu nhất |
| FR-08 `POST /api/cart` + `POST /api/checkout` | 19 | 15 | 2 | 2 | 17 | **88.2%** ← tốt nhất |
| FR-10 `PUT /api/admin/orders/:id/status` | 72 | 56 | 9 | 7 | 65 | **86.2%** |
| **Tổng 4 routes** | **215** | **156** | **43** | **16** | **199** | **78.4%** |

> **Lưu ý FR-08 (đã sửa):** đúng phạm vi 2 route đã khai báo, chỉ 2/19 mutants (10.5%) là NoCoverage - không phải 57% như bản đo trước. Kill rate 88.2% trên phần covered - route tốt nhất trong 4 FR sau khi sửa scope, không phải yếu nhất như từng mô tả.

### Survivor mutators trong 4 routes được test (43 survivors)

| Mutator | Count | Ý nghĩa |
|---------|-------|---------|
| `ConditionalExpression` | 18 | Logic điều kiện - test chưa cover đủ path |
| `StringLiteral` | 13 | Error message / field name bị đổi nhưng test không verify |
| `EqualityOperator` | 5 | Boundary condition (ON-point thiếu) |
| `ObjectLiteral` | 2 | Response shape không được assert |
| `ArithmeticOperator` | 2 | Giá trị số liệu không được assert |
| `ArrayDeclaration` | 1 | Sequential state assumption |
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
| Mutant ID(s) | 28 |
| Mutator | `EqualityOperator` |
| Vị trí | `server.js:L40` |
| Route / FR | `POST /api/login` (FR-02) |
| Tests covering (coveredBy) | 5 tests |

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
| PASS trên code gốc | ✅ | Target Jest test pass; full suite ngày 2026-07-11 đạt 40/40 pass |
| FAIL trên mutant (Killed) | ✅ | Mutant 28: expected 200, mutant trả 403; `killedBy: ["25"]` trong report hợp nhất |

**Action Item:** Đã kill mutant bằng cách thay `new Date()` runtime bằng một `Date` override giúp đóng băng đồng hồ (`global.Date = FrozenDate`), qua đó loại bỏ hoàn toàn độ trôi thời gian giữa lúc set fixture và lúc server evaluate.

---

#### Survivor A2 - Percent Discount Formula sai (Mutant 397/398, Group A, FR-09)

| Trường | Giá trị |
|---|---|
| Mutant ID(s) | 397, 398 |
| Mutator | `ArithmeticOperator` |
| Vị trí | `server.js:L420` |
| Route / FR | `POST /api/apply-coupon` (FR-09) |
| Tests covering (coveredBy) | 3 tests (#1, #11, #16 - nhánh **không có** `user_id`) |

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
| PASS trên code gốc | ✅ | Hai target coupon test pass; full suite ngày 2026-07-11 đạt 40/40 pass |
| FAIL trên mutant (Killed) | ✅ | Mutant 397/398: expected `-4500000`, mutant lần lượt trả `-55556` và `5500000`; `killedBy: ["1"]` |

**Action Item:** Đã kill mutant theo hướng (a): assert giá trị thực tế hiện tại, kèm comment `pinned - regression guard, not fix` để làm rõ đây là regression guard chứ không phải fix. Không sửa lại công thức vì SUT hiện đang sai theo đúng spec; việc sửa root cause nằm ngoài phạm vi T5a/T6a và cần bàn bạc thêm với M2 vì có đụng đến code dùng chung.

---

#### Survivor A3 - Percent Discount Block Bypass, nhánh unauthenticated (Mutant 396, Group A, FR-09)

| Trường | Giá trị |
|---|---|
| Mutant ID(s) | 396 |
| Mutator | `BlockStatement` |
| Vị trí | `server.js:L418–L422` |
| Route / FR | `POST /api/apply-coupon` (FR-09), nhánh unauthenticated (không gửi `user_id`) |
| Tests covering (coveredBy) | 3 tests (#1, #11, #16) |

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

**Classification:**

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
| PASS trên code gốc | ✅ | Hai target coupon test pass; full suite ngày 2026-07-11 đạt 40/40 pass |
| FAIL trên mutant (Killed) | ✅ | Mutant 396: expected `-4500000`, mutant trả `0`; `killedBy: ["1"]`. Mutant 393 và 395 cùng vùng code cũng chuyển `Survived` → `Killed` |

**Action Item:** Đã kill mutant bằng cách assert `discount_amount` khác `0` (pin theo giá trị cụ thể của bug hiện tại), nhờ đó block rỗng do mutant tạo ra bị phát hiện ngay lập tức.

---

### 4b. Group B - Order-status + Cart (T5b, owner: Vũ)

> **Đã hoàn thành Validation Gate cho Group B.** Baseline ngày 2026-07-03 ghi Mutant 515 và 268 là `Survived`; report sau cải tiến ngày 2026-07-11 xác nhận cả hai là `Killed`. Full Jest suite trên source gốc đạt 40/40 test.

#### Survivor B1 - Mất transition `canceled → delivered` (Mutant 515, Group B, FR-10)

| Trường | Giá trị |
|---|---|
| Mutant ID(s) | 515 |
| Mutator | `ConditionalExpression` |
| Vị trí | `server.js:L550` |
| Route / FR | `PUT /api/admin/orders/:id/status` / FR-10 |
| Tests covering (coveredBy) | 5 tests sau cải tiến |

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

**Classification:**

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
| PASS trên code gốc | ✅ | `npm test -- --runInBand __tests__/order-status.test.js -t 'canceled to delivered'` → 1/1 target pass; full suite 40/40 pass |
| FAIL trên mutant (Killed) | ✅ | Mutant 515: expected HTTP 200 nhưng mutant trả 400; `killedBy: ["30"]` trong `reports/mutation/mutation.html` |

**Action Item:** Hoàn thành. Test tạo order `canceled`, assert HTTP response và trạng thái `delivered` trong DB, rồi xóa fixture ở `afterEach`.

---

#### Survivor B2 - Giỏ hàng bị reset khi thêm item thứ hai (Mutant 268, Group B, FR-08)

| Trường | Giá trị |
|---|---|
| Mutant ID(s) | 268 |
| Mutator | `ConditionalExpression` |
| Vị trí | `server.js:L292` |
| Route / FR | `POST /api/cart` / FR-08 |
| Tests covering (coveredBy) | 2 tests sau cải tiến |

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

**Classification:**

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
| PASS trên code gốc | ✅ | `npm test -- --runInBand __tests__/cart.test.js -t 'keeps existing cart items'` → 1/1 target pass; full suite 40/40 pass |
| FAIL trên mutant (Killed) | ✅ | Mutant 268 làm cart chỉ còn 1 item thay vì 2; `killedBy: ["36"]` trong `reports/mutation/mutation.html` |

**Action Item:** Hoàn thành. Test dùng user ID riêng `515268`, thêm hai item liên tiếp và assert đủ hai item cùng giá trị định danh/số lượng.

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

> Tổng hợp Group A và Group B từ cùng full run ngày 2026-07-11 trên commit `f99c760d77fc089e8a11e60934416fa8a21a5bcf`. Report hợp nhất xác nhận toàn bộ mutant mục tiêu 28, 396, 397, 398, 515 và 268 đều bị kill. Hai mutant 393/395 của Group A cũng bị kill như hiệu ứng bổ sung của assertion percent-coupon.

| Metric | Trước | Sau | Δ | Trạng thái |
|--------|-------|-----|---|---|
| Mutation score % (`server.js`) | 32.35% | 34.75% | +2.40 điểm % | 188/541 mutants killed |
| Killed count (`server.js`) | 175 | 188 | +13 | +6 Group A; Group B tăng coverage và kill thêm 7 mutants |
| Survivor count (`server.js`) | 73 | 65 | -8 | 6 Group A + 2 Group B chuyển từ `Survived` sang `Killed`; một mutant Group B chuyển `NoCoverage` sang `Survived` |
| NoCoverage count (`server.js`) | 293 | 288 | -5 | Test Group B cover thêm vùng cart/order-status; Group A chỉ tăng độ mạnh assertion trên dòng đã cover |
| Mutant 28 status | `Survived` | `Killed` | Killed | Frozen clock làm boundary equality deterministic |
| Mutant 393/395/396 status | `Survived` | `Killed` | Killed | Assertion percent-coupon phát hiện block/condition bị bỏ qua |
| Mutant 397/398 status | `Survived` | `Killed` | Killed | Assertion pin giá trị hiện tại của BUG-09-001 cho mutation analysis |
| Mutant 515 status | `Survived` | `Killed` | Killed | Target test `returns 200 and updates status when transition is canceled to delivered` |
| Mutant 268 status | `Survived` | `Killed` | Killed | Target test `keeps existing cart items when the same user adds another item` |
| AI assertions proposed | 0 | 5 | +5 | 3 assertion Group A + 2 assertion Group B |
| AI assertions used unchanged | 0 | 3 | +3 | Ba thiết kế Group A được triển khai đúng oracle đã ghi trong phần survivor analysis |
| AI assertions requiring manual edits | 0 | 2 | +2 | Hai thiết kế Group B cần chỉnh fixture/schema field để khớp test suite thực tế |
| Setup time Stryker lần đầu | `Not recorded` | `Not recorded` | N/A | Không có evidence lịch sử; không đo lại để thay thế |
| Full `npm run stryker` time | `Not recorded` | khoảng 8 phút 30 giây | N/A | Node v24.11.1, Stryker 9.6.1, concurrency 1, mutate `server.js`; report hợp nhất ghi lúc 10:56:29 +07 |

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
| Four tested routes scoped score (recomputed, mục 3b) | 78.39% |
| FR-08 covered kill rate (recomputed) | 88.2% |
| FR-10 covered kill rate (recomputed) | 86.2% |
| RuntimeError / Timeout / CompileError | 0 / 0 / 0 |

### T8 - AI triage equivalent-mutant

Ví dụ triage: Mutant 535/536/537 ở `server.js:L570` mutate guard `require.main === module`. AI hỗ trợ phân biệt rằng đây là startup guard, không phải logic nghiệp vụ `order-status` hoặc `cart/checkout`. Kết luận thực dụng: xếp vào nhóm **Equivalent Mutant / Dead Code candidate** cho phạm vi Week 2 Group B, cần reviewer ký duyệt trước khi loại khỏi denominator.

### Assumptions / Missing Information

- Setup time Stryker lần đầu: `Not recorded` vì không có evidence lịch sử.
- Full run hợp nhất có thời lượng wall-clock xấp xỉ 8 phút 30 giây; output trực tiếp của tool wrapper hết hạn sau 300 giây, nhưng process Stryker tiếp tục và report hoàn tất lúc `2026-07-11 10:56:29 +07`.
- Evidence: `apps/backend/reports/mutation/mutation.html`; 541 mutants = 188 Killed + 65 Survived + 288 NoCoverage; RuntimeError/Timeout/CompileError = 0/0/0.
- Coverage hậu cải tiến: `server.js` line 51.66%, branch 45.8%; toàn repo line 57.48%, branch 54%; full suite 40/40 pass.
- Commands: target Jest tests → `npm test -- --runInBand` → `npm run test:coverage -- --runInBand` → `npm run stryker`.
