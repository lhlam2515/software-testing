# FR-02 — Domain Testing: Đăng nhập & Khóa tài khoản

**Feature:** FR-02 — Đăng nhập & Khóa tài khoản
**Kỹ thuật:** Domain Testing (Equivalence Partitioning)
**Nguồn SRS:** `docs/eshop-sut/srs.md` — §2 FR-02 (liên hệ FR-01 cho format email/password, FR-22 cho form requirements)
**Người thực hiện:** Lê Hoàng Lâm — 23127216

---

## 1. Tổng quan Feature

FR-02 kiểm soát hai hành vi chính:

1. **Đăng nhập:** Xác thực email + mật khẩu → trả về JWT Token khi đúng, generic error khi sai.
2. **Khóa tài khoản:** Sau **3 lần sai liên tiếp**, tài khoản bị tạm khóa **30 giây** (môi trường demo). Hệ thống trả về thông báo lỗi phù hợp nhưng không tiết lộ chi tiết nguyên nhân.

Ràng buộc format lấy từ:

- **FR-01:** Email phải đúng định dạng `user@domain.com`; password đã được đăng ký với quy tắc: ≥ 8 ký tự, ≥ 1 hoa, ≥ 1 thường, ≥ 1 số, ≥ 1 ký tự đặc biệt (`@$!%*?&`).
- **FR-22:** Trường email dùng `type="email"`, trường password dùng `type="password"`. Thông báo lỗi hiển thị **phía trên** nút submit.

---

## 2. Bước 1 — Xác định Biến & Ràng buộc

| Variable | Type | Mô tả | Valid Domain / Boundaries | Dependencies & Constraints | Expected Error / Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `email` | Input | Địa chỉ email nhập vào form đăng nhập | **Valid:** Chuỗi đúng format `user@domain.com` (HTML5 `type="email"`). Resolution: 1 ký tự. | Phải tồn tại trong DB (registered). Trường dùng `type="email"`. Gắn với `failed_login_count` của tài khoản tương ứng. | Sai format → HTML5 ngăn submit. Không tồn tại → generic error (không lộ lý do). |
| `password` | Input | Mật khẩu nhập vào form đăng nhập | **Valid:** Bất kỳ chuỗi nào khớp hash đã lưu (không re-validate độ phức tạp tại login). Resolution: 1 ký tự. | So khớp với hash đã lưu. Trường dùng `type="password"`. Quy tắc độ phức tạp (FR-01) chỉ áp dụng tại đăng ký, KHÔNG re-check tại login. | Không khớp → generic error + `failed_login_count++`. |
| `failed_login_count` | System State | Bộ đếm số lần đăng nhập sai **liên tiếp** của tài khoản | **Valid (không khóa):** `[0, 2]`. **Invalid (khóa):** `[3, +∞)`. Boundaries: `0` (khởi tạo), `2` (OFF point), `3` (ON point — ngưỡng khóa). Resolution: 1 (integer). | Tăng đúng 1 mỗi lần sai. Reset về 0 khi thành công ("liên tiếp" — ngầm định). Gắn với từng email. ⚠️ SRS không nói counter reset sau khi hết 30s lockout hay không. | count < 3 → login thất bại, counter tăng, không khóa. count ≥ 3 → tài khoản bị khóa. |
| `account_locked` | System State | Trạng thái khóa tạm thời (derived từ count + timer) | Binary: `false` (mở) / `true` (khóa). | Kích hoạt khi `failed_login_count ≥ 3`. Tự mở sau 30s. ⚠️ SRS không nói rõ lockout per-account hay per-IP/session. | Khi `true` → mọi attempt bị từ chối kể cả credential đúng. Thông báo "phù hợp" nhưng không lộ chi tiết. |
| `lock_timer` | System State | Thời gian còn lại của lockout (giây) tính từ lần sai thứ 3 | **Locked:** `(0s, 30s]`. **Expired:** `0s`. Boundaries: `30s` (ON — vừa khóa), `0s` (OFF — vừa hết). Resolution: 1 giây. | Chỉ có nghĩa khi `account_locked = true`. ⚠️ SRS không nói `failed_login_count` có reset về 0 khi timer hết không. | Trong (0s, 30s]: mọi request bị từ chối. Tại 0s (hết 30s): tài khoản mở, cho phép thử lại. |
| `jwt_token` | Output | JWT Token trả về khi đăng nhập thành công | **Valid:** Chuỗi JWT hợp lệ. **Invalid:** Không có (null/empty) mọi trường hợp thất bại. | Chỉ phát sinh khi email tồn tại + password khớp + account không bị khóa. Lưu client-side, gửi qua `Authorization: Bearer <token>`. | Thành công → token. Mọi case lỗi → không có token. |
| `error_message` | Output | Thông báo lỗi khi đăng nhập thất bại | **Valid:** Chuỗi text chung, không tiết lộ nguyên nhân cụ thể. | Hiển thị **phía trên** nút submit (FR-22). Áp dụng: sai credential, bị khóa, email không tồn tại — dùng cùng 1 dạng message chung. | Sai credential → generic error. Bị khóa → generic error (không nói thời gian còn lại). Sai format email → HTML5 validation (không qua server). |

### Implicit Gaps (cần xác minh khi test)

| # | Gap | Rủi ro nếu không xác định |
| :--- | :--- | :--- |
| G1 | `failed_login_count` có reset về 0 sau 30s lockout hết không? | Nếu không reset: 1 lần sai tiếp theo sẽ lock lại ngay — behavior khác với "sai lần đầu". |
| G2 | Counter có tiếp tục tăng khi account đang bị locked không? | Ảnh hưởng đến tổng số lần cần thử sau khi unlock. |
| G3 | Lockout per-account hay per-IP/session? | Ảnh hưởng đến khả năng bypass bằng cách đổi IP hoặc session. |
| G4 | Không có giới hạn độ dài tường minh cho email và password tại login. | Cần test với chuỗi rất dài để phát hiện lỗi tiềm năng. |

---

## 3. Bước 2 — Phân hoạch Equivalence Classes

### Group 1 — `email` : Định dạng (Format)

| Variable / Condition | EC ID | Mô tả | Loại | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `email` — Định dạng | **EC01** | Chuỗi rỗng hoặc chỉ khoảng trắng | Invalid | HTML5 `type="email"` ngăn submit; không gửi request lên server |
| `email` — Định dạng | **EC02** | Chuỗi không rỗng, sai format (thiếu `@`, thiếu domain, có dấu cách, nhiều `@`…) | Invalid | HTML5 `type="email"` ngăn submit; không gửi request lên server |
| `email` — Định dạng | **EC03** | Chuỗi đúng format `user@domain.com` | Valid | Request gửi lên server; tiếp tục kiểm tra Existence |

### Group 2 — `email` : Tồn tại trong DB *(chỉ áp dụng khi EC03)*

| Variable / Condition | EC ID | Mô tả | Loại | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `email` — Existence | **EC04** | Email đúng format nhưng **chưa đăng ký** (không trong DB) | Invalid | Server trả về generic error; **không lộ** "email không tồn tại" |
| `email` — Existence | **EC05** | Email đúng format và **đã đăng ký** (tồn tại trong DB) | Valid | Server tiếp tục kiểm tra password |

### Group 3 — `password` : Khớp hash

| Variable / Condition | EC ID | Mô tả | Loại | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `password` — Giá trị | **EC06** | Chuỗi rỗng | Invalid | Bị chặn bởi `required` (nếu có) **hoặc** generic error từ server; ⚠️ SRS không tường minh `required` cho login password |
| `password` — Giá trị | **EC07** | Chuỗi không rỗng, **không khớp** hash đã lưu | Invalid | Generic error; `failed_login_count` tăng đúng 1 |
| `password` — Giá trị | **EC08** | Chuỗi **khớp chính xác** với hash đã lưu | Valid | Tiếp tục luồng đăng nhập thành công (nếu account không bị khóa) |

### Group 4 — `failed_login_count` : Ngưỡng khóa

| Variable / Condition | EC ID | Mô tả | Loại | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `failed_login_count` | **EC09** | `count ∈ [0, 2]` — dưới ngưỡng khóa | Valid | Tài khoản chưa khóa; login attempt được phép |
| `failed_login_count` | **EC10** | `count ≥ 3` — đạt hoặc vượt ngưỡng khóa | Invalid | Tài khoản bị khóa; **mọi** attempt bị từ chối kể cả khi credential đúng |

### Group 5 — `lock_timer` : Cửa sổ khóa 30 giây

| Variable / Condition | EC ID | Mô tả | Loại | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `lock_timer` | **EC11** | Không trong cửa sổ khóa: `count < 3` HOẶC `time_since_lock ≥ 30s` | Valid | Tài khoản có thể truy cập; login attempt được phép |
| `lock_timer` | **EC12** | Đang trong cửa sổ khóa: `count ≥ 3` VÀ `0 < time_since_lock < 30s` | Invalid | Login bị từ chối; generic error (không tiết lộ thời gian còn lại) |

### Group 6 — Hành vi bộ đếm `failed_login_count`

| Variable / Condition | EC ID | Mô tả | Loại | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `counter` — Tăng sau fail | **EC13** | Sau 1 lần login sai: counter tăng **đúng 1** | Valid | `count_after = count_before + 1` (exactly) |
| `counter` — Tăng sai | **EC14** | Sau 1 lần login sai: counter tăng **≠ 1** (0 hoặc ≥ 2) | Invalid | Vi phạm spec "tăng bộ đếm lên đúng 1 đơn vị" |
| `counter` — Reset | **EC15** | Sau đăng nhập thành công: counter **reset về 0** | Valid | `count = 0`; phù hợp với nghĩa "liên tiếp" trong SRS |
| `counter` — Không reset | **EC16** | Sau đăng nhập thành công: counter **không reset** | Invalid | Vi phạm ý nghĩa "liên tiếp" — ngưỡng khóa bị tính sai |

### Group 7 — Output: `jwt_token`

| Variable / Condition | EC ID | Mô tả | Loại | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `jwt_token` — Thành công | **EC17** | Login thành công (EC05 + EC08 + EC11) → JWT **được** trả về | Valid | JWT hợp lệ; lưu client-side; dùng cho `Authorization: Bearer` |
| `jwt_token` — Thất bại | **EC18** | Login thất bại (bất kỳ EC invalid) → JWT **không** trả về | Valid | Response không chứa token |
| `jwt_token` — Vi phạm | **EC19** | Login thất bại nhưng server vẫn trả về JWT | Invalid | Security violation — authentication bypass |

### Group 8 — Output: `error_message` — Nội dung

| Variable / Condition | EC ID | Mô tả | Loại | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `error_message` — Generic | **EC20** | Thông báo lỗi **chung chung**, không phân biệt lý do | Valid | Đúng spec; không cho phép credential enumeration |
| `error_message` — Lộ chi tiết | **EC21** | Thông báo lộ lý do cụ thể: "Email không tồn tại", "Sai mật khẩu"… | Invalid | Credential enumeration — vi phạm security spec |
| `error_message` — Thiếu feedback | **EC22** | Login thất bại nhưng **không có** thông báo nào hiển thị | Invalid | Thiếu user feedback |

### Group 9 — Output: `error_message` — Vị trí hiển thị (FR-22)

| Variable / Condition | EC ID | Mô tả | Loại | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `error_message` — Vị trí | **EC23** | Thông báo lỗi hiển thị **phía trên** nút Submit | Valid | Tuân thủ FR-22 |
| `error_message` — Vị trí | **EC24** | Thông báo lỗi hiển thị **phía dưới** nút Submit | Invalid | Vi phạm FR-22 |

---

## 4. Bước 3 — Minimum Test Cases

> **Chiến lược:** Gom tối đa Valid EC vào ít TC nhất (Happy Path); sau đó 1 TC/Invalid EC với các biến còn lại ở nominal valid (Error Isolation).

---

### TC-01 — Happy Path: Đăng nhập thành công

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-01 |
| **Tên Test Case** | Happy Path — Đăng nhập thành công với counter reset |
| **EC Phủ** | EC03, EC05, EC08, EC09, EC11, EC15, EC17 |
| **EC Verified Absent** | EC16 (counter không reset — không xảy ra) |
| **Pre-conditions** | Tài khoản `test@eshop.com` / `Test1234!` tồn tại trong DB · `failed_login_count = 1` (đã có 1 lần sai trước đó — để kiểm tra EC15 reset) · `account_locked = false` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `Test1234!` |
| **Bước thực hiện** | 1. Đảm bảo pre-conditions: reset counter = 1 (thực hiện 1 lần đăng nhập sai trước đó) · 2. Mở trang đăng nhập tại `http://localhost:5173` · 3. Nhập email `test@eshop.com` vào trường Email · 4. Nhập password `Test1234!` vào trường Mật khẩu · 5. Bấm nút "Đăng nhập" |
| **Kết quả kỳ vọng** | ✅ HTTP 200 · JWT Token hợp lệ được trả về và lưu client-side · Người dùng được điều hướng đến trang chủ/dashboard · `failed_login_count` reset về `0` |
| **Điểm xác minh** | 1. Response body chứa `token` field · 2. Không có thông báo lỗi hiển thị · 3. `failed_login_count` về 0 (kiểm tra bằng DB hoặc thực hiện 2 lần sai tiếp → phải cần đủ 3 lần mới lock, không phải 2) |
| **Trạng thái** | ⬜ Chưa thực thi |

---

### TC-02 — Email Rỗng

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-02 |
| **Tên Test Case** | Email rỗng — HTML5 validation chặn |
| **EC Phủ** | EC01 |
| **EC Verified Absent** | — |
| **Pre-conditions** | Không yêu cầu pre-condition đặc biệt |
| **Input — `email`** | `""` (chuỗi rỗng) |
| **Input — `password`** | `Test1234!` (nominal valid) |
| **Bước thực hiện** | 1. Mở trang đăng nhập tại `http://localhost:5173` · 2. Để **trống** trường Email · 3. Nhập password `Test1234!` · 4. Bấm nút "Đăng nhập" |
| **Kết quả kỳ vọng** | ❌ Trình duyệt hiển thị HTML5 validation message (VD: "Vui lòng điền vào trường này") · Form **không được submit** · Không có HTTP request gửi lên server · Không có JWT · `failed_login_count` không tăng |
| **Điểm xác minh** | 1. Không có network request đến `/api/auth/login` (kiểm tra DevTools → Network) · 2. HTML5 error tooltip hiển thị trên trường email |
| **Trạng thái** | ⬜ Chưa thực thi |

---

### TC-03 — Email Sai Định Dạng

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-03 |
| **Tên Test Case** | Email sai format — HTML5 `type="email"` validation chặn |
| **EC Phủ** | EC02 |
| **EC Verified Absent** | — |
| **Pre-conditions** | Không yêu cầu pre-condition đặc biệt |
| **Input — `email`** | `"invalid_no_at_sign"` (không có `@`) |
| **Input — `password`** | `Test1234!` (nominal valid) |
| **Bước thực hiện** | 1. Mở trang đăng nhập · 2. Nhập `invalid_no_at_sign` vào trường Email · 3. Nhập password `Test1234!` · 4. Bấm nút "Đăng nhập" |
| **Kết quả kỳ vọng** | ❌ Trình duyệt HTML5 `type="email"` validation ngăn submit · HTML5 error tooltip hiển thị (VD: "Hãy nhập một địa chỉ email") · Không có HTTP request gửi lên server · Không có JWT |
| **Điểm xác minh** | 1. Không có network request đến `/api/auth/login` · 2. HTML5 tooltip xuất hiện tại trường email với thông báo format · 3. Thử thêm các pattern khác: `test@`, `@domain.com`, `test @domain.com` |
| **Trạng thái** | ⬜ Chưa thực thi |

---

### TC-04 — Email Chưa Đăng Ký

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-04 |
| **Tên Test Case** | Email đúng format nhưng không tồn tại trong DB |
| **EC Phủ** | EC04 |
| **EC Observed (valid outputs)** | EC18 (không có JWT), EC20 (generic error), EC23 (error trên Submit) |
| **EC Verified Absent** | EC19 (JWT không được trả về dù fail), EC21 (không lộ "email không tồn tại"), EC22 (error message phải hiển thị), EC24 (error không ở dưới Submit) |
| **Pre-conditions** | Email `notfound@example.com` **không tồn tại** trong DB · `failed_login_count` không liên quan (email không có trong hệ thống) |
| **Input — `email`** | `notfound@example.com` |
| **Input — `password`** | `Test1234!` (nominal valid) |
| **Bước thực hiện** | 1. Mở trang đăng nhập · 2. Nhập `notfound@example.com` vào trường Email · 3. Nhập password `Test1234!` · 4. Bấm nút "Đăng nhập" |
| **Kết quả kỳ vọng** | ❌ Server trả về lỗi · Thông báo lỗi **generic** — không nói "email không tồn tại" hay "tài khoản không được đăng ký" · Thông báo hiển thị **phía trên** nút Submit · Không có JWT trong response |
| **Điểm xác minh** | 1. Response không chứa `token` field · 2. Error message KHÔNG tiết lộ lý do (không phải "Email not found", "Tài khoản không tồn tại") · 3. Vị trí error message: phải nằm trên nút Submit trong DOM · 4. Có error message (không im lặng) |
| **Trạng thái** | ⬜ Chưa thực thi |

---

### TC-05 — Password Rỗng

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-05 |
| **Tên Test Case** | Password rỗng tại form đăng nhập |
| **EC Phủ** | EC06 |
| **EC Observed** | EC18 (không có JWT) |
| **EC Verified Absent** | — |
| **Pre-conditions** | Tài khoản `test@eshop.com` tồn tại · `failed_login_count = 0` · `account_locked = false` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `""` (chuỗi rỗng) |
| **Bước thực hiện** | 1. Mở trang đăng nhập · 2. Nhập `test@eshop.com` vào trường Email · 3. Để **trống** trường Mật khẩu · 4. Bấm nút "Đăng nhập" |
| **Kết quả kỳ vọng** | ❌ **Nhánh A (nếu có `required`):** HTML5 chặn form submit; không có request · **Nhánh B (nếu không có `required`):** Request gửi lên server; server trả về generic error; không có JWT |
| **Điểm xác minh** | 1. ⚠️ **Gap:** SRS không tường minh `required` attribute cho password field tại login — ghi lại actual behavior · 2. Nếu Nhánh B: kiểm tra `failed_login_count` — có tăng không? (empty password = sai password?) · 3. Không có JWT trong mọi trường hợp |
| **Trạng thái** | ⬜ Chưa thực thi |

---

### TC-06 — Password Sai & Kiểm tra Counter Increment

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-06 |
| **Tên Test Case** | Password sai (không rỗng) — counter tăng đúng 1 |
| **EC Phủ** | EC07, EC13 |
| **EC Observed (valid outputs)** | EC18 (không có JWT), EC20 (generic error), EC23 (error trên Submit) |
| **EC Verified Absent** | EC14 (counter tăng ≠ 1 — không xảy ra), EC19, EC21, EC22, EC24 |
| **Pre-conditions** | Tài khoản `test@eshop.com` / `Test1234!` tồn tại · `failed_login_count = 0` (trạng thái sạch) · `account_locked = false` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"WrongPass1!"` (sai, không rỗng) |
| **Bước thực hiện** | 1. Reset tài khoản test về `failed_login_count = 0` (nếu cần) · 2. Mở trang đăng nhập · 3. Nhập `test@eshop.com` vào trường Email · 4. Nhập `WrongPass1!` vào trường Mật khẩu · 5. Bấm "Đăng nhập" · 6. Quan sát response và kiểm tra counter |
| **Kết quả kỳ vọng** | ❌ Generic error message hiển thị · `failed_login_count` tăng từ `0 → 1` (đúng 1 đơn vị) · Không có JWT · Error message hiển thị **phía trên** nút Submit |
| **Điểm xác minh** | 1. Response không chứa `token` · 2. Error message là generic (không nói "sai mật khẩu") · 3. Vị trí error: trên Submit button · 4. Verify counter = 1: thực hiện thêm 1 lần sai nữa → counter = 2; lần thứ 3 → counter = 3 → lock triggers (indirect verification of EC13) |
| **Trạng thái** | ⬜ Chưa thực thi |

---

### TC-07 — Tài khoản Đang Bị Khóa

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-07 |
| **Tên Test Case** | Tài khoản đang bị khóa — từ chối kể cả credential đúng |
| **EC Phủ** | EC10, EC12 *(coupled: không thể tách rời — xem ghi chú)* |
| **EC Observed (valid outputs)** | EC18 (không có JWT) |
| **EC Verified Absent** | EC19 (JWT không được trả về dù credential đúng), EC21 (không lộ "bị khóa vì X lần sai") |
| **Pre-conditions** | Tài khoản `test@eshop.com` tồn tại · `failed_login_count = 3` (đã đủ ngưỡng khóa) · `time_since_lock = 5s` (đang trong cửa sổ 30s) · `account_locked = true` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `"Test1234!"` *(credential **đúng** — để chứng minh lock override cả khi đúng)* |
| **Bước thực hiện** | 1. Thực hiện 3 lần đăng nhập sai liên tiếp để lock tài khoản · 2. Đợi khoảng 5 giây (vẫn trong cửa sổ 30s) · 3. Mở trang đăng nhập · 4. Nhập `test@eshop.com` vào Email · 5. Nhập `Test1234!` (đúng) vào Mật khẩu · 6. Bấm "Đăng nhập" |
| **Kết quả kỳ vọng** | ❌ Login **bị từ chối** dù credential hoàn toàn đúng · Generic error (không nói "bị khóa vì sai 3 lần" hoặc "còn X giây") · Không có JWT |
| **Điểm xác minh** | 1. Response không chứa `token` · 2. Error message là generic (không tiết lộ nguyên nhân hoặc thời gian còn lại) · 3. ⚠️ **Gap G2:** Ghi lại `failed_login_count` sau attempt này — counter có tăng lên 4 không? |
| **Ghi chú** | EC10 (count ≥ 3 = state locked) và EC12 (0 < time < 30s = window active) không thể tách biệt trong thực tế — chúng luôn đồng thời tồn tại khi tài khoản đang bị khóa. Error Isolation không bị vi phạm vì đây là composite system-state, không phải hai input độc lập. |
| **Trạng thái** | ⬜ Chưa thực thi |

---

## 5. EC Coverage Matrix

| EC ID | Mô tả ngắn | TC Phủ | Cơ chế |
| :--- | :--- | :--- | :--- |
| EC01 | Email rỗng | TC-02 | Trigger trực tiếp |
| EC02 | Email sai format | TC-03 | Trigger trực tiếp |
| EC03 | Email valid format | TC-01 | Input nominal valid |
| EC04 | Email chưa đăng ký | TC-04 | Trigger trực tiếp |
| EC05 | Email đã đăng ký | TC-01 | Pre-condition |
| EC06 | Password rỗng | TC-05 | Trigger trực tiếp |
| EC07 | Password sai (không rỗng) | TC-06 | Trigger trực tiếp |
| EC08 | Password đúng | TC-01 | Input nominal valid |
| EC09 | count ∈ [0, 2] | TC-01 | Pre-condition `count=1 ∈ [0,2]` |
| EC10 | count ≥ 3 (locked) | TC-07 | Pre-condition `count=3` |
| EC11 | Không trong lockout window | TC-01 | Pre-condition `locked=false` |
| EC12 | Đang trong lockout window | TC-07 | Pre-condition `time_since_lock=5s` |
| EC13 | Counter tăng đúng 1 | TC-06 | Observed: `0 → 1` |
| EC14 | Counter tăng ≠ 1 | TC-06 | Verified absent (EC13 đúng ↔ EC14 không xảy ra) |
| EC15 | Counter reset sau success | TC-01 | Observed: `1 → 0` sau login thành công |
| EC16 | Counter không reset | TC-01 | Verified absent (EC15 đúng ↔ EC16 không xảy ra) |
| EC17 | JWT được trả về (success) | TC-01 | Observed output |
| EC18 | JWT không trả về (failure) | TC-04, TC-06, TC-07 | Observed output |
| EC19 | JWT trả về khi fail (vi phạm) | TC-07 | Verified absent |
| EC20 | Generic error (không lộ lý do) | TC-04, TC-06 | Observed output |
| EC21 | Error lộ lý do cụ thể (vi phạm) | TC-04, TC-06 | Verified absent |
| EC22 | Không có error khi fail (vi phạm) | TC-04, TC-06 | Verified absent (error IS shown) |
| EC23 | Error hiển thị trên Submit | TC-04, TC-06 | Observed output |
| EC24 | Error hiển thị dưới Submit (vi phạm) | TC-04, TC-06 | Verified absent |

**Tổng kết:** 7 TC → 100% coverage (24/24 EC)

| Nhóm | Valid EC | Invalid EC | Total |
| :--- | :--- | :--- | :--- |
| email Format | EC03 | EC01, EC02 | 3 |
| email Existence | EC05 | EC04 | 2 |
| password Match | EC08 | EC06, EC07 | 3 |
| failed_login_count | EC09 | EC10 | 2 |
| lock_timer | EC11 | EC12 | 2 |
| counter behavior | EC13, EC15 | EC14, EC16 | 4 |
| jwt_token | EC17, EC18 | EC19 | 3 |
| error_message content | EC20 | EC21, EC22 | 3 |
| error_message position | EC23 | EC24 | 2 |
| **Total** | **10 Valid** | **14 Invalid** | **24** |
