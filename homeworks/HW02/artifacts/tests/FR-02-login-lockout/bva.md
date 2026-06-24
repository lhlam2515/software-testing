# FR-02 — Boundary Value Analysis: Đăng nhập & Khóa tài khoản

**Feature:** FR-02 — Đăng nhập & Khóa tài khoản
**Kỹ thuật:** Boundary Value Analysis (BVA) — bổ sung cho Domain Testing
**Nguồn SRS:** `docs/eshop-sut/srs.md` — §2 FR-02
**Người thực hiện:** Lê Hoàng Lâm — 23127216

---

## 1. Tổng quan

BVA được áp dụng bổ sung sau Domain Testing (Equivalence Partitioning) để bắt các lỗi off-by-one tại đúng các điểm ranh giới (turning points) của hai biến numeric trong FR-02:

1. **`failed_login_count`** — Ngưỡng khóa tại `count = 3`
2. **`lock_timer`** — Thời gian khóa tại `30s`

> BVA không thay thế mà **tăng cường** bộ test EC. Các test BVA chỉ test tại ranh giới, không repeat những gì EP đã cover ở midpoint.

---

## 2. Biến Mục tiêu & Boundary Map

### 2.1 `failed_login_count` — Ngưỡng khóa = 3

```
Hành vi hệ thống theo giá trị counter:

  [0]   [1]   [2]  |  [3]   [4]   ...
  ──────────────────|─────────────────
  ← VALID (no lock) | INVALID (locked) →
                    ↑
              ON Point (lock trigger)
              LB của invalid class

  count = 2 → OFF point: tài khoản KHÔNG bị khóa (fail tiếp → count = 3 → lock)
  count = 3 → ON point:  tài khoản BỊ KHÓA ngay
```

**Operator cần test:** SRS dùng "từ 3 lần trở lên" → `count ≥ 3`.
Lỗi tiềm năng: hệ thống triển khai `count > 3` (khóa ở lần 4, không phải 3).

| Điểm BVA | Giá trị count | Vai trò | Hành vi kỳ vọng |
| :--- | :--- | :--- | :--- |
| UB của valid class | `count = 2` | OFF point (fail → transition sang ON) | Không bị khóa; thêm 1 fail nữa → count = 3 → LOCK |
| LB của invalid class | `count = 3` | ON point (first locked state) | Bị khóa; mọi attempt đều bị từ chối |
| Midpoint valid | `count = 1` | Nominal (covered bởi TC-01 trong EP) | Không bị khóa |
| Floor | `count = 0` | Lower bound (covered bởi TC-06 trong EP) | Không bị khóa |

### 2.2 `lock_timer` — Thời gian khóa = 30 giây

```
Thời gian elapsed kể từ thời điểm lock:

  [0s] ...... [15s] ...... [29s] | [30s] [31s] ...
  ─────────────────────────────────|──────────────
  ←──────── LOCKED ──────────────→|←─ UNLOCKED ─→
                                   ↑
                              OFF point (lock expires)
                              UB của locked window

  time_since_lock = 29s → UB-1: còn 1s nữa mới unlock (still locked)
  time_since_lock = 30s → UB:   đúng ranh giới (should be unlocked)
  time_since_lock = 31s → UB+1: rõ ràng sau expiry (unlocked)
```

**Operator cần test:** SRS nói "30 giây" → lock kéo dài 30 giây → unlock tại `elapsed >= 30s`.
Lỗi tiềm năng:
- Hệ thống dùng `> 30s` (unlock ở 31s, không phải 30s) → TC-BVA-04 sẽ FAIL.
- Hệ thống dùng `> 29s` (unlock quá sớm) → TC-BVA-03 sẽ FAIL.

| Điểm BVA | `time_since_lock` | Vai trò | Hành vi kỳ vọng |
| :--- | :--- | :--- | :--- |
| UB-1 của locked window | `29s` | 1 giây trước khi hết khóa | Vẫn bị khóa; login bị từ chối |
| UB của locked window | `30s` | Chính xác tại ranh giới expiry | Đã unlock; login được phép |
| UB+1 của locked window | `31s` | 1 giây sau khi hết khóa | Rõ ràng unlocked; login được phép |
| Midpoint | `15s` | Nominal (covered bởi TC-07 ≈ 5s trong EP) | Vẫn bị khóa |

---

## 3. BVA Test Cases

---

### TC-BVA-01 — Fail Lần Thứ 3: Lock Trigger tại ON Point

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-BVA-01 |
| **Tên Test Case** | Fail lần thứ 3 — count: 2 → 3 → LOCK trigger |
| **Biến mục tiêu** | `failed_login_count` |
| **Loại điểm biên** | UB(valid) = 2 → **ON Point transition** → 3 (LB of invalid) |
| **Target Variable State** | `failed_login_count = 2` (đúng tại UB của valid class — 2 lần sai trước đó) |
| **Pre-conditions** | Tài khoản `test@eshop.com` tồn tại · `failed_login_count = 2` (đã sai 2 lần, 1 lần nữa sẽ lock) · `account_locked = false` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"WrongPass1!"` (sai — để trigger fail lần 3) |
| **Bước thực hiện** | 1. Thiết lập `failed_login_count = 2`: thực hiện 2 lần đăng nhập sai liên tiếp từ tài khoản fresh (count=0) · 2. Mở trang đăng nhập · 3. Nhập `test@eshop.com` · 4. Nhập `WrongPass1!` · 5. Bấm "Đăng nhập" · 6. Quan sát ngay lập tức: có bị khóa không? |
| **Mục tiêu Defect** | Bắt lỗi operator sai: nếu hệ thống dùng `> 3` thay vì `>= 3`, fail lần 3 này sẽ KHÔNG lock → tài khoản vẫn nhận request tiếp theo (test FAIL). Nếu hệ thống dùng `>= 3` đúng, fail lần 3 = LOCK ngay. |
| **Kết quả kỳ vọng** | ❌ Fail với generic error · `failed_login_count: 2 → 3` · **Tài khoản BỊ KHÓA ngay sau fail này** · Attempt ngay tiếp theo (dù credential đúng) phải bị từ chối trong vòng 30s |
| **Điểm xác minh** | 1. Counter chuyển từ 2 → 3 (đúng 1 đơn vị) · 2. Ngay sau TC này: thử đăng nhập với credential đúng → phải bị từ chối (lock active) · 3. Sau 30s: thử lại với credential đúng → phải thành công |
| **Trạng thái** | ⬜ Chưa thực thi |

---

### TC-BVA-02 — Success tại UB của Valid Class (count = 2)

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-BVA-02 |
| **Tên Test Case** | Đăng nhập thành công khi count = 2 (UB của valid class) — counter reset |
| **Biến mục tiêu** | `failed_login_count` |
| **Loại điểm biên** | **UB(valid) = 2** — success scenario tại ngưỡng trên của valid class |
| **Target Variable State** | `failed_login_count = 2` (đúng tại UB, 1 fail nữa sẽ lock — nhưng test này dùng credential đúng) |
| **Pre-conditions** | Tài khoản `test@eshop.com` tồn tại · `failed_login_count = 2` · `account_locked = false` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"Test1234!"` (đúng) |
| **Bước thực hiện** | 1. Thiết lập `failed_login_count = 2`: thực hiện 2 lần sai liên tiếp · 2. Mở trang đăng nhập · 3. Nhập `test@eshop.com` · 4. Nhập `Test1234!` (đúng) · 5. Bấm "Đăng nhập" · 6. Kiểm tra counter và JWT |
| **Mục tiêu Defect** | Bắt lỗi reset logic tại UB: nếu counter không reset sau success khi count=2, lần sai tiếp theo sẽ tính là "fail thứ 3" (không phải fail thứ 1 của chuỗi mới) → logic lockout sai. |
| **Kết quả kỳ vọng** | ✅ Đăng nhập thành công · JWT Token trả về · `failed_login_count: 2 → 0` (reset hoàn toàn) · Không có thông báo lỗi · Sau đó: 1 lần sai mới = count = 1 (không phải 3) |
| **Điểm xác minh** | 1. JWT được trả về trong response · 2. Để verify counter = 0: thực hiện 1 lần sai → count phải là 1 (không phải 3, không lock) · 3. Nếu hệ thống sai: 1 lần sai sau đó → count = 3 → lock → bug! |
| **Trạng thái** | ⬜ Chưa thực thi |

---

### TC-BVA-03 — Lock Timer tại 29s (UB-1, còn 1s nữa)

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-BVA-03 |
| **Tên Test Case** | Lock timer tại 29s — tài khoản vẫn bị khóa (UB-1) |
| **Biến mục tiêu** | `lock_timer` (`time_since_lock`) |
| **Loại điểm biên** | **UB-1 của locked window** — 1 giây trước khi hết khóa, tài khoản phải vẫn bị khóa |
| **Target Variable State** | `failed_login_count = 3` · `time_since_lock = 29s` (còn 1s trong cửa sổ 30s) |
| **Pre-conditions** | Tài khoản `test@eshop.com` tồn tại · Thực hiện 3 lần sai liên tiếp để trigger lock · Đợi đúng 29 giây kể từ thời điểm lock · `account_locked = true` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"Test1234!"` (đúng — để loại trừ "bị reject vì sai password") |
| **Bước thực hiện** | 1. Fail 3 lần liên tiếp → ghi lại `T_lock` (thời điểm lock) · 2. Đợi đến `T_lock + 29s` · 3. Mở trang đăng nhập · 4. Nhập `test@eshop.com` + `Test1234!` · 5. Bấm "Đăng nhập" tại đúng giây thứ 29 |
| **Mục tiêu Defect** | Bắt lỗi timeout quá ngắn: nếu hệ thống unlock ở 29s thay vì 30s, test này sẽ PASS (nhận JWT) khi expected là FAIL (bị từ chối). |
| **Kết quả kỳ vọng** | ❌ Login **vẫn bị từ chối** tại 29s · Generic error · Không có JWT · Lock chưa hết (còn 1 giây) |
| **Điểm xác minh** | 1. Response không chứa `token` · 2. Ghi lại exact timestamp để đảm bảo test được thực hiện đúng tại 29s (không phải 30s hay 31s) · 3. Sau 1s thêm (≥ 30s total): thử lại — phải thành công (xác nhận 30s là ranh giới đúng) |
| **Ghi chú setup** | Precision timing quan trọng: sử dụng automation (Playwright) hoặc DB query để set `lock_start_time` chính xác. Manual timing có thể gây lệch ±1s. |
| **Trạng thái** | ⬜ Chưa thực thi |

---

### TC-BVA-04 — Lock Timer tại Đúng 30s (UB — OFF Point)

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-BVA-04 |
| **Tên Test Case** | Lock timer tại đúng 30s — tài khoản phải được unlock (UB / OFF point) |
| **Biến mục tiêu** | `lock_timer` (`time_since_lock`) |
| **Loại điểm biên** | **UB của locked window = OFF point của lock** — đúng tại ranh giới 30s |
| **Target Variable State** | `failed_login_count = 3` · `time_since_lock = 30s` (chính xác tại thời điểm hết khóa) |
| **Pre-conditions** | Tài khoản `test@eshop.com` tồn tại · Fail 3 lần để trigger lock · Đợi đúng 30 giây |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"Test1234!"` (đúng) |
| **Bước thực hiện** | 1. Fail 3 lần → ghi lại `T_lock` · 2. Đợi đến `T_lock + 30s` · 3. Mở trang đăng nhập · 4. Nhập `test@eshop.com` + `Test1234!` · 5. Bấm "Đăng nhập" tại đúng giây thứ 30 |
| **Mục tiêu Defect** | Bắt lỗi operator sai: nếu hệ thống dùng `elapsed > 30s` (strict greater-than) thay vì `elapsed >= 30s`, tài khoản sẽ vẫn bị khóa ở giây 30 → test FAIL khi expected là SUCCESS. |
| **Kết quả kỳ vọng** | ✅ Login **được phép** tại đúng 30s · JWT Token trả về · Tài khoản unlock · ⚠️ **Gap G1:** Ghi lại `failed_login_count` sau unlock — có tự reset về 0 không? Hay vẫn = 3? (Hành vi này quyết định risk của lần fail tiếp theo) |
| **Điểm xác minh** | 1. JWT được trả về tại `T_lock + 30s` · 2. Ghi lại giá trị `failed_login_count` sau khi login thành công: nếu = 3 (không reset), 1 lần sai tiếp → lock lại ngay · 3. Nếu = 0 (reset), hành vi bình thường trở lại |
| **Ghi chú setup** | Đây là test quan trọng nhất của BVA cho `lock_timer`. Nên dùng DB direct manipulation để set `lock_start_time = NOW() - 30s` cho precision tuyệt đối, thay vì đợi thủ công. |
| **Trạng thái** | ⬜ Chưa thực thi |

---

### TC-BVA-05 — Lock Timer tại 31s (UB+1, sau Expiry)

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-BVA-05 |
| **Tên Test Case** | Lock timer tại 31s — rõ ràng sau expiry, tài khoản accessible (UB+1) |
| **Biến mục tiêu** | `lock_timer` (`time_since_lock`) |
| **Loại điểm biên** | **UB+1 của locked window** — 1 giây sau khi hết khóa, baseline confirmation |
| **Target Variable State** | `failed_login_count = 3` · `time_since_lock = 31s` (rõ ràng sau 30s window) |
| **Pre-conditions** | Tài khoản `test@eshop.com` tồn tại · Fail 3 lần để trigger lock · Đợi 31 giây |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"Test1234!"` (đúng) |
| **Bước thực hiện** | 1. Fail 3 lần → ghi lại `T_lock` · 2. Đợi đến `T_lock + 31s` · 3. Mở trang đăng nhập · 4. Nhập `test@eshop.com` + `Test1234!` · 5. Bấm "Đăng nhập" |
| **Mục tiêu Defect** | Baseline confirmation sau ranh giới: xác nhận tài khoản hoàn toàn accessible sau 31s. Catch race conditions hoặc timer drift trong implementation. |
| **Kết quả kỳ vọng** | ✅ Login thành công · JWT Token trả về · ⚠️ **Gap G1 (continued):** Nếu `failed_login_count` vẫn = 3 sau unlock (không reset), thì: 1 lần sai tiếp theo → count = 4 → lock lại ngay (vì count ≥ 3). Hành vi này cần được document là bug hoặc expected behavior. |
| **Điểm xác minh** | 1. JWT được trả về · 2. Ghi lại `failed_login_count` sau success: nếu reset = 0 → OK. Nếu vẫn = 3 → tiềm ẩn lỗi logic · 3. Thực hiện 1 lần sai ngay sau đó → quan sát counter behavior (kiểm tra Gap G1) |
| **Trạng thái** | ⬜ Chưa thực thi |

---

## 4. Defect Coverage Matrix

| TC | Biến | Điểm biên | Operator lỗi bị bắt | Nếu hệ thống sai → Actual ≠ Expected |
| :--- | :--- | :--- | :--- | :--- |
| TC-BVA-01 | `failed_login_count` | 2 → 3 (transition) | `> 3` thay vì `>= 3` | Fail lần 3 không lock → TC FAIL (còn nhận request) |
| TC-BVA-01 | `failed_login_count` | 2 → 3 (transition) | `>= 2` (lock quá sớm) | Fail lần 2 đã lock → Pre-condition phá vỡ |
| TC-BVA-02 | `failed_login_count` | count=2, success | Counter không reset tại UB | 1 sai tiếp → tính là "fail 3" → lock unexpected |
| TC-BVA-03 | `lock_timer` | 29s (UB-1) | Timeout `< 30s` (unlock sớm) | 29s accepted → TC FAIL (expected reject, got JWT) |
| TC-BVA-04 | `lock_timer` | 30s (UB) | `> 30s` thay vì `>= 30s` | 30s vẫn locked → TC FAIL (expected JWT, got error) |
| TC-BVA-05 | `lock_timer` | 31s (UB+1) | Race condition / timer drift | 31s vẫn locked → rare but possible timing bug |

---

## 5. Setup Protocol — Precision Timing

Đối với TC-BVA-03, TC-BVA-04, TC-BVA-05, timing chính xác là yếu tố then chốt:

### Option A: Manual Timing (đủ cho demo, ±1s tolerance)

```
1. Reset tài khoản test về failed_login_count = 0
2. Fail đăng nhập 3 lần liên tiếp
3. Ghi lại T_lock = thời điểm lần fail thứ 3
4. Chạy test tại:
   - TC-BVA-03: T_lock + 29s
   - TC-BVA-04: T_lock + 30s
   - TC-BVA-05: T_lock + 31s
5. Ghi lại actual behavior tại từng thời điểm
```

### Option B: Database Direct Manipulation (khuyến nghị cho automation)

```sql
-- Set lock_start_time để simulate "vừa lock xong T giây trước"
UPDATE users
SET lock_until = datetime('now', '+' || (30 - T) || ' seconds')
WHERE email = 'test@eshop.com';

-- Ví dụ: simulate đã lock được 29s (còn 1s nữa)
UPDATE users
SET lock_until = datetime('now', '+1 seconds')
WHERE email = 'test@eshop.com';

-- Simulate đã hết lock (30s elapsed)
UPDATE users
SET lock_until = datetime('now', '-0 seconds')
WHERE email = 'test@eshop.com';
```

> ⚠️ Cần kiểm tra schema thực tế của DB để xác định field name (`lock_until`, `locked_at`, `lockout_until`…). Schema có thể khác với giả định trên.

---

## 6. Tổng hợp Test Suite

| Nhóm | TC | Biến | Điểm biên | Mục tiêu |
| :--- | :--- | :--- | :--- | :--- |
| BVA — count threshold | TC-BVA-01 | `failed_login_count` | count=2 → 3 (transition) | Off-by-one tại lock trigger |
| BVA — count threshold | TC-BVA-02 | `failed_login_count` | count=2, success | Counter reset tại UB |
| BVA — timer window | TC-BVA-03 | `lock_timer` | 29s (UB-1) | Early unlock bug |
| BVA — timer window | TC-BVA-04 | `lock_timer` | 30s (UB / OFF point) | Exact boundary operator |
| BVA — timer window | TC-BVA-05 | `lock_timer` | 31s (UB+1) | Post-expiry baseline |

**Tổng cộng toàn bộ FR-02:**

| Nhóm | Số TC |
| :--- | :--- |
| Domain Testing (EP) — TC-01 đến TC-07 | 7 |
| BVA Enhancement — TC-BVA-01 đến TC-BVA-05 | 5 |
| **Tổng** | **12** |
