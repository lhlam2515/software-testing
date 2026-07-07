# FR-01 — Boundary Value Analysis: Đăng ký tài khoản

**Feature:** FR-01 — Đăng ký tài khoản
**Technique:** Boundary Value Analysis (BVA) — additive to Domain Testing
**Spec source:** `docs/eshop-sut/srs.md` (FR-01), `docs/eshop-sut/api_specification.md` (mục 1.1), khảo sát UI Step 3.0 (2026-07-07)
**Author:** Lê Hoàng Lâm — 23127216

---

## 1. Overview

Domain Testing (domain-testing.md) đã cover 21 EC bằng 13 TC, nhưng chưa kiểm tra các điểm biên số học. BVA bổ sung 2 nhóm mục tiêu:

1. **Password — độ dài tối thiểu (LB = 8):** ranh giới `>= 8` vs `> 8` là nơi lỗi off-by-one thường xảy ra nhất trong validate độ mạnh mật khẩu.
2. **Extreme/Overflow Value cho 3 biến không có giới hạn tối đa được nêu (Gap Rule ở Step 1/2):** Name (EC03), Email (EC08), Password (EC16). Cả 3 đều xác nhận qua khảo sát UI là không có `maxlength` HTML (`el.maxLength = -1` cho cả 3 trường), và không được đọc source code để tra schema CSDL — nên giá trị extreme được chọn dựa trên constraint thực tế phổ biến, độc lập với source code (xem lý giải từng mục bên dưới).

**Ghi chú kế thừa từ domain-testing.md:** Khảo sát Step 3.0 xác nhận validate mật khẩu phía client hiện từ chối mọi giá trị mật khẩu hợp lệ. Các TC-BVA về độ dài Password (TC-BVA-01..03) vẫn giữ Steps qua UI vì đó chính là hành vi đang kiểm thử — dự kiến TC-BVA-02/03 (các điểm phải VALID) sẽ FAIL khi thực thi do bug đã biết, đây là tín hiệu đúng cần ghi nhận. TC-BVA-04..06 (Extreme Value) dùng API trực tiếp vì lý do tương tự các gap-probe TC ở Bước 3 (client bug + nhập chuỗi cực dài qua UI không khả thi/không có tín hiệu).

---

## 2. Target Variables & Boundary Map

### 2.1 `password.length` — Lower Bound = 8

```
Password length:

   [6]   [7]  |  [8]   [9]   [10] ...
  ─────────────|─────────────────────
  INVALID       ←──────── VALID ────────→
  (too short)  |
               ↑
        ON point (LB of valid class)
        length = 8 (SRS: "Tối thiểu 8 ký tự")

  length = 7 → LB-1: too short, phải bị từ chối
  length = 8 → LB:   đúng ngưỡng, phải được chấp nhận
  length = 9 → LB+1: trên ngưỡng, phải được chấp nhận
```

**Operator under test:** SRS ghi "Tối thiểu 8 ký tự" → `length >= 8`.
Potential defect: hệ thống implement `length > 8` (yêu cầu tối thiểu 9 ký tự, từ chối nhầm mật khẩu 8 ký tự hợp lệ).

| BVA Point | `password` value | Role | Expected Behavior |
| :--- | :--- | :--- | :--- |
| LB-1 | `Abcd1@2` (7 ký tự) | Dưới ngưỡng | Rejected: too weak |
| LB (ON point) | `Abcd12@3` (8 ký tự) | Đúng ngưỡng — điểm bẻ gãy `>` vs `>=` | Accepted |
| LB+1 | `Abcd123@4` (9 ký tự) | Trên ngưỡng | Accepted |

### 2.2 Extreme/Overflow Value — Name, Email, Password (không có UB được nêu)

Không quan sát được `maxlength` HTML nào cho cả 3 trường (`el.maxLength = -1` xác nhận qua eval trong Step 3.0) và không được phép đọc schema CSDL từ source code. Giá trị extreme được chọn theo mức độ ưu tiên "constraint thực tế phổ biến, độc lập với source code":

| Biến | Giá trị extreme | Lý do chọn |
| :--- | :--- | :--- |
| `password` | 100 ký tự | Thư viện hash phổ biến trên Node.js (bcrypt) có giới hạn 72 byte, cắt ngầm phần vượt quá — đây là constraint thực tế của hệ sinh thái công nghệ, không phải suy đoán tuỳ tiện |
| `name` | 10.000 ký tự | Không có maxlength/schema quan sát được; SQLite TEXT không giới hạn mặc định — chọn giá trị đủ lớn để kiểm tra unhandled exception, timeout, hoặc silent truncation ở tầng API |
| `email` | 262 ký tự (local-part 250 ký tự + `@example.com`) | RFC 5321 quy định độ dài email thực tế tối đa 254 ký tự — chọn giá trị vượt ngưỡng chuẩn quốc tế này để kiểm tra enforcement |

---

## 3. BVA Test Cases

### TC-BVA-01 — Password Length = LB-1 (7 ký tự, dưới ngưỡng)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-01 |
| **Test Case Name** | Mật khẩu 7 ký tự bị từ chối (dưới ngưỡng tối thiểu) |
| **Target Variable** | `password` |
| **Boundary Point Type** | LB-1 |
| **Target Variable State** | `length = 7` |
| **Pre-conditions** | Không |
| **Input — `name`** | `Nguyen Van BVA1` |
| **Input — `email`** | `tcbva01.validemail@example.com` |
| **Input — `password`** | `Abcd1@2` (7 ký tự) |
| **Defect Target** | Catches bug where system uses `length >= 7` (or `length > 6`) instead of `length >= 8`, incorrectly accepting a 7-character password |
| **Steps** | 1. Truy cập `http://localhost:5173/register` · 2. Nhập "Nguyen Van BVA1" vào ô "Họ Tên" · 3. Nhập "tcbva01.validemail@example.com" vào ô "Email" · 4. Nhập "Abcd1@2" vào ô "Mật khẩu" · 5. Bấm nút "Đăng Ký" |
| **Expected Result** | ❌ UI: Hiển thị "Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT." ngay phía trên nút "Đăng Ký"; không điều hướng trang. API cross-check: không có request nào được gửi |
| **Verification Points** | 1. Thông báo lỗi hiển thị đúng vị trí · 2. URL vẫn là `/register` · 3. API cross-check: không có request tới `POST /api/register` |
| **Status** | ⬜ Not yet executed |

### TC-BVA-02 — Password Length = LB (8 ký tự, đúng ngưỡng)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-02 |
| **Test Case Name** | Mật khẩu đúng 8 ký tự được chấp nhận (ON point) |
| **Target Variable** | `password` |
| **Boundary Point Type** | ON Point (LB của lớp Valid) |
| **Target Variable State** | `length = 8` |
| **Pre-conditions** | Email `tcbva02.validemail@example.com` chưa tồn tại |
| **Input — `name`** | `Nguyen Van BVA2` |
| **Input — `email`** | `tcbva02.validemail@example.com` |
| **Input — `password`** | `Abcd12@3` (8 ký tự) |
| **Defect Target** | Catches bug where system uses `length > 8` instead of `length >= 8`, incorrectly rejecting an exactly-8-character password that satisfies all other composition rules |
| **Steps** | 1. Truy cập `http://localhost:5173/register` · 2. Nhập "Nguyen Van BVA2" vào ô "Họ Tên" · 3. Nhập "tcbva02.validemail@example.com" vào ô "Email" · 4. Nhập "Abcd12@3" vào ô "Mật khẩu" · 5. Bấm nút "Đăng Ký" |
| **Expected Result** | ✅ UI: Trang chuyển hướng tới `/login`. API cross-check: HTTP 200 OK, body `{"message": "User registered successfully", "id": <number>}` |
| **Verification Points** | 1. URL sau khi submit là `/login` · 2. API cross-check: tài khoản `tcbva02.validemail@example.com` đăng nhập được bằng đúng `Abcd12@3` |
| **Status** | ⬜ Not yet executed |

### TC-BVA-03 — Password Length = LB+1 (9 ký tự, trên ngưỡng)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-03 |
| **Test Case Name** | Mật khẩu 9 ký tự được chấp nhận (trên ngưỡng) |
| **Target Variable** | `password` |
| **Boundary Point Type** | LB+1 |
| **Target Variable State** | `length = 9` |
| **Pre-conditions** | Email `tcbva03.validemail@example.com` chưa tồn tại |
| **Input — `name`** | `Nguyen Van BVA3` |
| **Input — `email`** | `tcbva03.validemail@example.com` |
| **Input — `password`** | `Abcd123@4` (9 ký tự) |
| **Defect Target** | Sanity check xác nhận giá trị trên ngưỡng vẫn hợp lệ — loại trừ khả năng boundary bị code sai kiểu upper-exclusive (vd `length < 9`) |
| **Steps** | 1. Truy cập `http://localhost:5173/register` · 2. Nhập "Nguyen Van BVA3" vào ô "Họ Tên" · 3. Nhập "tcbva03.validemail@example.com" vào ô "Email" · 4. Nhập "Abcd123@4" vào ô "Mật khẩu" · 5. Bấm nút "Đăng Ký" |
| **Expected Result** | ✅ UI: Trang chuyển hướng tới `/login`. API cross-check: HTTP 200 OK, body `{"message": "User registered successfully", "id": <number>}` |
| **Verification Points** | 1. URL sau khi submit là `/login` · 2. API cross-check: tài khoản `tcbva03.validemail@example.com` đăng nhập được bằng đúng `Abcd123@4` |
| **Status** | ⬜ Not yet executed |

### TC-BVA-04 — Password Extreme (Practical Max) — Xác nhận Không Bị Cắt Ngầm ở Ngưỡng 72 Byte

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-04 |
| **Test Case Name** | Mật khẩu 100 ký tự — kiểm tra silent truncation ở ngưỡng bcrypt 72 byte |
| **Target Variable** | `password` |
| **Boundary Point Type** | Extreme (Practical Max) |
| **Target Variable State** | `length = 100` (vượt ngưỡng hash phổ biến 72 byte) |
| **Pre-conditions** | Email `tcbva04.validemail@example.com` chưa tồn tại |
| **Input — `name`** | `Nguyen Van BVA4` |
| **Input — `email`** | `tcbva04.validemail@example.com` |
| **Input — `password`** | `Abcd1234@Abcd1234@Abcd1234@Abcd1234@Abcd1234@Abcd1234@Abcd1234@Abcd1234@Abcd1234@Abcd1234@Abcd1234@A` (100 ký tự) |
| **Defect Target** | Silent truncation tại ngưỡng 72 byte của bcrypt (thư viện hash phổ biến trên Node.js) — nếu backend hash trực tiếp password gốc bằng bcrypt mà không chuẩn hoá trước, chỉ 72 ký tự đầu thực sự được dùng để tạo hash, cho phép đăng nhập chỉ với 72 ký tự đầu |
| **UI Fallback Note** | Bug password phía client chặn mọi mật khẩu qua UI bất kể độ dài, và nhập chuỗi 100 ký tự qua UI không cho tín hiệu đáng tin cậy hơn API — dùng API trực tiếp để cô lập đúng câu hỏi về extreme length |
| **Steps** | 1. Gọi `POST http://localhost:3000/api/register` với `password` 100 ký tự nêu trên · 2. Nếu (1) trả về 200 OK, gọi `POST http://localhost:3000/api/login` với CHỈ 72 ký tự đầu của password gốc (`Abcd1234@Abcd1234@Abcd1234@Abcd1234@Abcd1234@Abcd1234@Abcd1234@Abcd1234@`) |
| **Expected Result** | Nếu bước (1) trả 200 OK VÀ bước (2) đăng nhập thành công chỉ với 72 ký tự đầu → xác nhận silent truncation bcrypt, BUG bảo mật cần báo cáo (độ mạnh mật khẩu thực tế giảm còn 72 ký tự mà người dùng không được cảnh báo). Nếu bước (1) trả 200 OK nhưng bước (2) đăng nhập THẤT BẠI (yêu cầu đủ 100 ký tự) → không có truncation, hệ thống xử lý đúng toàn bộ độ dài. Nếu bước (1) trả 4xx/5xx → hệ thống có giới hạn độ dài cứng (dù SRS không nêu) hoặc lỗi xử lý input dài, ghi nhận giới hạn/lỗi thực tế phát hiện được |
| **Verification Points** | 1. Ghi nhận response status + body nguyên văn của bước (1) · 2. Ghi nhận kết quả đăng nhập (thành công/thất bại) của bước (2) làm bằng chứng truncation |
| **Status** | ⬜ Not yet executed |

### TC-BVA-05 — Name Extreme (Practical Max) — 10.000 Ký Tự

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-05 |
| **Test Case Name** | Tên 10.000 ký tự — kiểm tra unhandled exception/silent truncation |
| **Target Variable** | `name` |
| **Boundary Point Type** | Extreme (Practical Max) |
| **Target Variable State** | `length = 10000` |
| **Pre-conditions** | Email `tcbva05.validemail@example.com` chưa tồn tại |
| **Input — `name`** | Chuỗi ký tự `"A"` lặp lại 10.000 lần |
| **Input — `email`** | `tcbva05.validemail@example.com` |
| **Input — `password`** | `Abcd1234@` |
| **Defect Target** | Unhandled exception, timeout/performance degradation, hoặc silent truncation ở tầng API/CSDL khi Name không có giới hạn độ dài được enforce |
| **UI Fallback Note** | Bug password phía client chặn UI bất kể Name; nhập 10.000 ký tự qua UI không khả thi và không cho tín hiệu tốt hơn — dùng API trực tiếp |
| **Steps** | 1. Gọi `POST http://localhost:3000/api/register` với `name` là chuỗi 10.000 ký tự "A" |
| **Expected Result** | Nếu HTTP 200 OK và `name` lưu đầy đủ 10.000 ký tự → hệ thống chấp nhận không giới hạn, ghi nhận thiếu ràng buộc (không phải lỗi thực thi nhưng là rủi ro thiết kế). Nếu HTTP 200 OK nhưng `name` bị cắt bớt khi lưu → phát hiện silent truncation chưa tài liệu hoá. Nếu HTTP 4xx/5xx → phát hiện giới hạn cứng hoặc lỗi xử lý input lớn (unhandled exception) |
| **Verification Points** | 1. Ghi nhận response status + body nguyên văn · 2. Nếu tạo thành công, kiểm tra độ dài `name` thực sự lưu trong CSDL (qua `GET /api/users/me` sau khi đăng nhập, hoặc `test-db.cjs`) |
| **Status** | ⬜ Not yet executed |

### TC-BVA-06 — Email Extreme (Practical Max) — 262 Ký Tự (Vượt RFC 5321)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-06 |
| **Test Case Name** | Email 262 ký tự — kiểm tra enforcement giới hạn RFC 5321 |
| **Target Variable** | `email` |
| **Boundary Point Type** | Extreme (Practical Max) |
| **Target Variable State** | `length = 262` (250 ký tự local-part + `@example.com`) |
| **Pre-conditions** | Không |
| **Input — `name`** | `Nguyen Van BVA6` |
| **Input — `email`** | 250 ký tự `"a"` + `@example.com` (262 ký tự tổng) |
| **Input — `password`** | `Abcd1234@` |
| **Defect Target** | Thiếu enforcement giới hạn thực tế 254 ký tự theo RFC 5321, cho phép lưu địa chỉ email vượt chuẩn quốc tế, tiềm ẩn rủi ro khi gửi OTP (FR-03) hoặc tích hợp dịch vụ email thật |
| **UI Fallback Note** | Bug password phía client chặn UI bất kể Email; dùng API trực tiếp để cô lập đúng câu hỏi về extreme length |
| **Steps** | 1. Gọi `POST http://localhost:3000/api/register` với `email` 262 ký tự nêu trên |
| **Expected Result** | Nếu HTTP 200 OK và email lưu đầy đủ 262 ký tự → hệ thống không enforce giới hạn RFC 5321, ghi nhận rủi ro. Nếu HTTP 4xx → hệ thống có enforce giới hạn độ dài email (dù SRS không nêu rõ ngưỡng), ghi nhận ngưỡng thực tế phát hiện được |
| **Verification Points** | 1. Ghi nhận response status + body nguyên văn · 2. Nếu tạo thành công, xác nhận có thể đăng nhập bằng đúng email 262 ký tự đó |
| **Status** | ⬜ Not yet executed |

---

## 4. Defect Coverage Matrix

| TC-BVA | Boundary / Defect nhắm tới |
| :--- | :--- |
| TC-BVA-01 | Password LB-1 (7 ký tự) — catches `length >= 7` (hoặc `> 6`) dùng thay vì `>= 8` |
| TC-BVA-02 | Password LB (8 ký tự, ON point) — catches `length > 8` dùng thay vì `>= 8` |
| TC-BVA-03 | Password LB+1 (9 ký tự) — sanity check loại trừ boundary code sai kiểu upper-exclusive |
| TC-BVA-04 | Password Extreme Max (100 ký tự) — catches silent truncation ở ngưỡng bcrypt 72 byte |
| TC-BVA-05 | Name Extreme Max (10.000 ký tự) — catches unhandled exception/timeout/silent truncation cho biến không giới hạn |
| TC-BVA-06 | Email Extreme Max (262 ký tự) — catches thiếu enforcement giới hạn RFC 5321 |

---

## 5. Setup Protocol

Không cần thao tác timing chính xác hay thao tác CSDL đặc biệt cho các TC-BVA của FR-01 (khác với các feature có ràng buộc timer như FR-02). Yêu cầu duy nhất: mỗi TC dùng một email chưa tồn tại (đã liệt kê cụ thể trong Pre-conditions từng TC) để tránh xung đột EC07 (email đã tồn tại) khi thực thi lặp lại.

Với TC-BVA-04, thực thi phải theo đúng thứ tự 2 bước (đăng ký trước, sau đó thử đăng nhập bằng password đã cắt) — nếu bước (1) thất bại thì bước (2) không có ý nghĩa và cần ghi `Status` là "Blocked" thay vì tiếp tục.

---

## 6. Test Suite Summary

| Nhóm | Số TC |
| :--- | :--- |
| Domain Testing (EP) — domain-testing.md | 13 |
| Boundary Value Analysis (BVA) — bva.md | 6 |
| **Tổng cộng** | **19** |
