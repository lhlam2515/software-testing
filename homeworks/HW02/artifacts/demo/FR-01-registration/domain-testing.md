# FR-01 — Domain Testing: Đăng ký tài khoản

**Feature:** FR-01 — Đăng ký tài khoản
**Technique:** Domain Testing (Equivalence Partitioning)
**Spec source:** `docs/eshop-sut/srs.md` (FR-01, dòng 30-36), `docs/eshop-sut/api_specification.md` (mục 1.1, `POST /api/register`), khảo sát UI trực tiếp tại `http://localhost:5173/register` (Step 3.0, 2026-07-07)
**Author:** Lê Hoàng Lâm — 23127216

---

## 1. Feature Overview

FR-01 cho phép người dùng chưa có tài khoản tạo tài khoản mới bằng Họ Tên, Email, Mật khẩu, Xác nhận mật khẩu. Backend chỉ nhận `name`, `email`, `password` (API spec không có trường `confirmPassword`) — tạo ra một Spec Conflict cần probe. Cross-feature: FR-22 áp dụng các ràng buộc UI chung (dấu `*` cho trường bắt buộc, vị trí thông báo lỗi phía trên nút submit, `type="email"`/`type="password"`) cho form này; FR-21 yêu cầu trang chỉ có đúng 1 `<h1>` (page-level, không gắn vào biến cụ thể).

**Phát hiện quan trọng từ khảo sát UI (Step 3.0, 2026-07-07):**

1. Trường "Xác nhận mật khẩu" **hoàn toàn không tồn tại** trên UI thực tế (`/register` chỉ có 3 input: Họ Tên, Email, Mật khẩu) — mâu thuẫn trực tiếp, đã xác nhận (không còn là giả thuyết) với yêu cầu SRS FR-01.
2. Validate mật khẩu phía client dường như **từ chối mọi giá trị mật khẩu**, kể cả các giá trị thoả mãn đầy đủ yêu cầu SRS (đã thử `Test1234!` và `Abcd1234@` qua cả `fill` lẫn gõ phím thật, không có request nào tới `POST /api/register` được gửi). Bug này chặn hoàn toàn happy path qua UI và che lấp tín hiệu thật của các validate khác (Email, Name) khi chúng cần một mật khẩu hợp lệ làm baseline.
3. Ghi nhận phụ (không tạo EC riêng, ngoài phạm vi FR-01): Email dùng `type="text"` chứ không phải `type="email"` (khác FR-22); heading dùng `<h2>` chứ không phải `<h1>`; không thấy dấu `*` cạnh nhãn trường bắt buộc.

Các phát hiện này định hình cách viết `Steps` ở Bước 3: TC-01 (Happy Path) giữ nguyên qua UI vì đây chính là mục tiêu kiểm thử (bắt đúng bug #2); các TC khác cần "mật khẩu hợp lệ" làm baseline để cô lập một EC khác buộc phải chuyển sang gọi API trực tiếp, có `UI Fallback Note` giải thích rõ lý do.

---

## 2. Step 1 — Variables & Constraints

| Variable | Type | Description | Valid Domain / Boundaries | Dependencies & Constraints | Expected Error / Behavior |
|---|---|---|---|---|---|
| Name (Họ Tên) | Input | Tên đầy đủ người dùng nhập | Chuỗi không rỗng; không giới hạn độ dài tối đa được nêu (Gap) | Bắt buộc (dấu `*` theo FR-22) | Rejected: required field |
| Email | Input | Địa chỉ email đăng ký | Định dạng `user@domain.com` hợp lệ; không giới hạn độ dài tối đa được nêu (Gap) | Bắt buộc, duy nhất trong hệ thống (phụ thuộc System State), `type="email"` theo FR-22 | Rejected: invalid email format / Rejected: email already in use |
| Password | Input | Mật khẩu đăng ký | Chuỗi, tối thiểu 8 ký tự, chứa ≥1 chữ hoa, ≥1 chữ thường, ≥1 chữ số, ≥1 ký tự đặc biệt trong tập `{@,$,!,%,*,?,&}`; không giới hạn độ dài tối đa được nêu (Gap) | Bắt buộc, phải khớp với Confirm Password, `type="password"` theo FR-22 | Rejected: password does not meet strength requirement |
| Confirm Password (Xác nhận mật khẩu) | Input | Trường xác nhận mật khẩu | Chuỗi phải khớp chính xác với Password | Bắt buộc theo SRS; không xuất hiện trong API body; **xác nhận qua khảo sát UI: không tồn tại trên UI thực tế** | Rejected: passwords do not match (theo spec — chưa quan sát được vì trường không tồn tại) |
| Email Uniqueness | System State | Trạng thái email đã tồn tại trong CSDL hay chưa | Boolean: exists / not exists | Phụ thuộc giá trị Email nhập vào | Nếu exists → Rejected: email already in use |
| Registration Outcome | Output | Kết quả xử lý sau khi submit | Success: tài khoản được tạo + điều hướng tới trang Đăng nhập (không tự động đăng nhập); Failure: ở lại trang đăng ký | Phụ thuộc vào toàn bộ input hợp lệ đồng thời | Success → Redirect to Login page. Failure → Stay on Register page |
| Error Message Display | Output | Cách thông báo lỗi hiển thị | Vị trí: trên nút submit (FR-22); nội dung: theo từng nguyên nhân lỗi cụ thể | Phụ thuộc EC nào bị vi phạm | Hiển thị đúng 1 thông báo tương ứng với lỗi đầu tiên/duy nhất bị vi phạm |

### Implicit Gaps & Spec Conflicts

| Variable | Gap / Conflict | Risk |
|---|---|---|
| Name | Không có giới hạn độ dài tối đa; không nêu rõ bộ ký tự cho phép (số, ký tự đặc biệt, HTML) | Có thể gây tràn dữ liệu CSDL hoặc chấp nhận input không hợp lệ về nghiệp vụ |
| Email | Không có giới hạn độ dài tối đa | Có thể gây tràn cột CSDL hoặc lỗi không xử lý |
| Email | Không nêu rõ việc kiểm tra trùng có phân biệt hoa/thường hay không (`Test@x.com` vs `test@x.com`) | Có thể cho phép tạo 2 tài khoản "trùng" email theo nghiệp vụ nhưng khác chuỗi |
| Password | Không có giới hạn độ dài tối đa | Rủi ro tràn bộ đệm hoặc suy giảm hiệu năng khi hash password quá dài |
| Password | Không rõ ký tự đặc biệt ngoài tập `{@,$,!,%,*,?,&}` (vd: `#`, `~`, `^`) có được chấp nhận và/hoặc tính là thoả điều kiện "1 ký tự đặc biệt" hay không | Regex thực tế có thể whitelist cứng tập ký tự này, từ chối cả những mật khẩu mạnh hợp lý dùng ký tự khác |
| Confirm Password | SRS nói "hệ thống từ chối nếu không khớp" nhưng API spec không có trường `confirmPassword` trong body; **khảo sát UI xác nhận trường này hoàn toàn không tồn tại trên giao diện thực tế** | Yêu cầu nghiệp vụ "Xác nhận mật khẩu" của FR-01 có khả năng không được triển khai ở bất kỳ tầng nào |

---

## 3. Step 2 — Equivalence Classes

| Variable / Condition | EC ID | Description | Type (Valid / Invalid / Invalid/Gap) | Expected System Output |
|---|---|---|---|---|
| **Name** | EC01 | Tên không rỗng, văn bản thông thường (có dấu, có khoảng trắng) | Valid | Tiếp tục xử lý đăng ký |
| Name | EC02 | Tên rỗng | Invalid | Rejected: required field |
| Name | EC03 | Tên cực dài (không có giới hạn max được nêu) | Invalid/Gap | Undefined — route to Extreme BVA (Bước 4) |
| Name | EC04 | Tên chứa ký tự bất thường (toàn số, thẻ HTML, ký tự đặc biệt lạ) | Invalid/Gap | Undefined — gap-probe TC-10 |
| **Email** | EC05 | Email đúng định dạng, chưa tồn tại trong hệ thống | Valid | Tiếp tục xử lý đăng ký |
| Email | EC06 | Email sai định dạng (thiếu `@`, thiếu domain, thiếu TLD) | Invalid | Rejected: invalid email format |
| Email | EC07 | Email đã tồn tại trong hệ thống | Invalid | Rejected: email already in use |
| Email | EC08 | Email cực dài (không có giới hạn max được nêu) | Invalid/Gap | Undefined — route to Extreme BVA (Bước 4) |
| Email | EC09 | Email trùng với email đã tồn tại nhưng khác hoa/thường | Invalid/Gap | Undefined — gap-probe TC-11 |
| **Password** | EC10 | Mật khẩu thoả cả 4 điều kiện thành phần, độ dài ≥ 8 | Valid | Tiếp tục xử lý đăng ký |
| Password | EC11 | Độ dài < 8 ký tự | Invalid | Rejected: password does not meet strength requirement |
| Password | EC12 | Thiếu chữ hoa | Invalid | Rejected: password does not meet strength requirement |
| Password | EC13 | Thiếu chữ thường | Invalid | Rejected: password does not meet strength requirement |
| Password | EC14 | Thiếu chữ số | Invalid | Rejected: password does not meet strength requirement |
| Password | EC15 | Thiếu ký tự đặc biệt trong tập `{@,$,!,%,*,?,&}` | Invalid | Rejected: password does not meet strength requirement |
| Password | EC16 | Mật khẩu cực dài (không có giới hạn max được nêu) | Invalid/Gap | Undefined — route to Extreme BVA (Bước 4) |
| Password | EC17 | Ký tự đặc biệt dùng để thoả điều kiện nằm ngoài tập được định nghĩa | Invalid/Gap | Undefined — gap-probe TC-12 |
| **Confirm Password** *(revised sau Step 3.0)* | EC18 | Trường Xác nhận mật khẩu hoàn toàn vắng mặt trên UI `/register` — xác nhận qua khảo sát trực tiếp (không phải suy đoán) | Invalid/Gap | Confirmed Gap — gap-probe TC-13 |
| Confirm Password | EC19 | Gọi thẳng API `POST /api/register` chỉ với `password`, không có tham số xác nhận nào | Invalid/Gap | Undefined — gap-probe TC-13 |
| **Registration Outcome (Output)** | EC20 | Đăng ký thành công | Valid | Redirect to Login page; response không chứa JWT token (verified absent) |
| **Error Message Display (Output)** | EC21 | Vị trí hiển thị lỗi | Valid | Thông báo lỗi xuất hiện phía trên nút submit (FR-22) |

**Tổng: 21 EC** (5 Valid, 8 Invalid, 8 Invalid/Gap).

---

## 4. Step 3 — Minimum Test Cases

> **Ghi chú thiết kế:** TC-01 (Happy Path) cố tình giữ Steps qua UI dù khảo sát Step 3.0 cho thấy validate mật khẩu phía client hiện từ chối mọi giá trị mật khẩu hợp lệ (đã kiểm chứng bằng `Test1234!` và `Abcd1234@`, qua cả `fill` lẫn gõ phím thật, không có request nào tới `POST /api/register`) — đây chính là hành vi cần kiểm thử, không phải lý do để né qua API. Ngược lại, các TC khác cần "mật khẩu hợp lệ" làm baseline để cô lập một EC khác (Name/Email) buộc phải chuyển sang gọi API trực tiếp vì bug này che lấp hoàn toàn tín hiệu thật của các trường đó qua UI.

### TC-01 — Happy Path: Đăng ký thành công

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-01 |
| **Test Case Name** | Đăng ký thành công với dữ liệu hợp lệ |
| **ECs Covered** | EC01, EC05, EC10, EC20 |
| **ECs Verified Absent** | — |
| **Pre-conditions** | Email `newuser.tc01@example.com` chưa tồn tại trong hệ thống |
| **Input — `name`** | `Nguyen Van A` |
| **Input — `email`** | `newuser.tc01@example.com` |
| **Input — `password`** | `Abcd1234@` |
| **Steps** | 1. Truy cập `http://localhost:5173/register` · 2. Nhập "Nguyen Van A" vào ô "Họ Tên" · 3. Nhập "newuser.tc01@example.com" vào ô "Email" · 4. Nhập "Abcd1234@" vào ô "Mật khẩu" · 5. Bấm nút "Đăng Ký" |
| **Expected Result** | ✅ UI: Trang chuyển hướng tới `/login`; không tự động đăng nhập. API cross-check: HTTP 200 OK, body `{"message": "User registered successfully", "id": <number>}`, response không chứa JWT token |
| **Verification Points** | 1. URL sau khi submit là `/login` · 2. Không có token trong localStorage/sessionStorage ngay sau đăng ký · 3. API cross-check: tài khoản `newuser.tc01@example.com` đăng nhập được bằng đúng `Abcd1234@` |
| **Status** | ⬜ Not yet executed |

### TC-02 — Tên trống bị từ chối

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-02 |
| **Test Case Name** | Đăng ký với Họ Tên để trống |
| **ECs Covered** | EC02 |
| **ECs Verified Absent** | — |
| **Pre-conditions** | Không |
| **Input — `name`** | `` (rỗng) |
| **Input — `email`** | `tc02.validemail@example.com` |
| **Input — `password`** | `Abcd1234@` |
| **Steps** | 1. Truy cập `http://localhost:5173/register` · 2. Để trống ô "Họ Tên" · 3. Nhập "tc02.validemail@example.com" vào ô "Email" · 4. Nhập "Abcd1234@" vào ô "Mật khẩu" · 5. Bấm nút "Đăng Ký" |
| **Expected Result** | ❌ UI: Trình duyệt chặn submit bằng native validate `required`, focus chuyển về ô "Họ Tên", không điều hướng trang. API cross-check: không có request nào tới `POST /api/register` |
| **Verification Points** | 1. URL vẫn là `/register` · 2. Ô "Họ Tên" nhận focus (constraint validation) · 3. API cross-check: không ghi nhận request nào tới `POST /api/register` |
| **Status** | ⬜ Not yet executed |

### TC-03 — Email sai định dạng bị từ chối (API — UI bị chặn)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-03 |
| **Test Case Name** | Đăng ký với Email sai định dạng |
| **ECs Covered** | EC06 |
| **ECs Verified Absent** | — |
| **Pre-conditions** | Không |
| **Input — `name`** | `Nguyen Van B` |
| **Input — `email`** | `invalid-email-format` |
| **Input — `password`** | `Abcd1234@` |
| **Steps** | 1. Gọi `POST http://localhost:3000/api/register` với body `{"name": "Nguyen Van B", "email": "invalid-email-format", "password": "Abcd1234@"}` |
| **UI Fallback Note** | Khảo sát Step 3.0 xác nhận client password validate từ chối mọi mật khẩu hợp lệ, khiến submit qua UI luôn hiển thị nhầm "Mật khẩu quá yếu!" bất kể email đúng hay sai, không có request nào được gửi đi để quan sát hành vi thật của validate email — phải cô lập bằng API |
| **Expected Result** | ❌ API cross-check: HTTP 4xx, thông báo liên quan định dạng email không hợp lệ; không tạo user mới |
| **Verification Points** | 1. Response status 4xx · 2. Không có user mới với email `invalid-email-format` trong CSDL |
| **Status** | ⬜ Not yet executed |

### TC-04 — Email đã tồn tại bị từ chối (API — UI bị chặn)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-04 |
| **Test Case Name** | Đăng ký với Email đã được sử dụng |
| **ECs Covered** | EC07 |
| **ECs Verified Absent** | — |
| **Pre-conditions** | Email `test@eshop.com` đã tồn tại (tài khoản mặc định theo SRS) |
| **Input — `name`** | `Nguyen Van C` |
| **Input — `email`** | `test@eshop.com` |
| **Input — `password`** | `Abcd1234@` |
| **Steps** | 1. Gọi `POST http://localhost:3000/api/register` với body `{"name": "Nguyen Van C", "email": "test@eshop.com", "password": "Abcd1234@"}` |
| **UI Fallback Note** | Cùng lý do TC-03 — bug password phía client che lấp tín hiệu thật của validate email trùng qua UI |
| **Expected Result** | ❌ API cross-check: HTTP 4xx, thông báo email đã được sử dụng; không tạo user mới, tài khoản gốc không đổi |
| **Verification Points** | 1. Response status 4xx · 2. Số user có email `test@eshop.com` trong CSDL vẫn là 1 |
| **Status** | ⬜ Not yet executed |

### TC-05 — Mật khẩu quá ngắn bị từ chối

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-05 |
| **Test Case Name** | Đăng ký với Mật khẩu ngắn hơn 8 ký tự |
| **ECs Covered** | EC11 |
| **ECs Verified Absent** | EC21 (verified: vị trí thông báo lỗi) |
| **Pre-conditions** | Không |
| **Input — `name`** | `Nguyen Van D` |
| **Input — `email`** | `tc05.validemail@example.com` |
| **Input — `password`** | `Abc1@` (5 ký tự) |
| **Steps** | 1. Truy cập `http://localhost:5173/register` · 2. Nhập "Nguyen Van D" vào ô "Họ Tên" · 3. Nhập "tc05.validemail@example.com" vào ô "Email" · 4. Nhập "Abc1@" vào ô "Mật khẩu" · 5. Bấm nút "Đăng Ký" |
| **Expected Result** | ❌ UI: Hiển thị "Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT." ngay phía trên nút "Đăng Ký"; không điều hướng trang. API cross-check: không có request nào được gửi |
| **Verification Points** | 1. Thông báo lỗi xuất hiện phía trên nút "Đăng Ký" (EC21) · 2. URL vẫn là `/register` · 3. API cross-check: không có request tới `POST /api/register` |
| **Status** | ⬜ Not yet executed |

### TC-06 — Mật khẩu thiếu chữ hoa bị từ chối

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-06 |
| **Test Case Name** | Đăng ký với Mật khẩu không có chữ hoa |
| **ECs Covered** | EC12 |
| **ECs Verified Absent** | — |
| **Pre-conditions** | Không |
| **Input — `name`** | `Nguyen Van E1` |
| **Input — `email`** | `tc06.validemail@example.com` |
| **Input — `password`** | `abcd1234@` |
| **Steps** | 1. Truy cập `http://localhost:5173/register` · 2. Nhập "Nguyen Van E1" vào ô "Họ Tên" · 3. Nhập "tc06.validemail@example.com" vào ô "Email" · 4. Nhập "abcd1234@" vào ô "Mật khẩu" · 5. Bấm nút "Đăng Ký" |
| **Expected Result** | ❌ UI: Hiển thị "Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT." (nguyên văn như TC-05); không điều hướng trang |
| **Verification Points** | 1. Thông báo lỗi hiển thị đúng vị trí · 2. Không có request tới `POST /api/register` |
| **Status** | ⬜ Not yet executed |

### TC-07 — Mật khẩu thiếu chữ thường bị từ chối

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-07 |
| **Test Case Name** | Đăng ký với Mật khẩu không có chữ thường |
| **ECs Covered** | EC13 |
| **ECs Verified Absent** | — |
| **Pre-conditions** | Không |
| **Input — `name`** | `Nguyen Van E2` |
| **Input — `email`** | `tc07.validemail@example.com` |
| **Input — `password`** | `ABCD1234@` |
| **Steps** | 1. Truy cập `http://localhost:5173/register` · 2. Nhập "Nguyen Van E2" vào ô "Họ Tên" · 3. Nhập "tc07.validemail@example.com" vào ô "Email" · 4. Nhập "ABCD1234@" vào ô "Mật khẩu" · 5. Bấm nút "Đăng Ký" |
| **Expected Result** | ❌ UI: Hiển thị "Mật khẩu quá yếu! ..." (nguyên văn như TC-05); không điều hướng trang |
| **Verification Points** | 1. Thông báo lỗi hiển thị đúng vị trí · 2. Không có request tới `POST /api/register` |
| **Status** | ⬜ Not yet executed |

### TC-08 — Mật khẩu thiếu chữ số bị từ chối

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-08 |
| **Test Case Name** | Đăng ký với Mật khẩu không có chữ số |
| **ECs Covered** | EC14 |
| **ECs Verified Absent** | — |
| **Pre-conditions** | Không |
| **Input — `name`** | `Nguyen Van E3` |
| **Input — `email`** | `tc08.validemail@example.com` |
| **Input — `password`** | `Abcdefgh@` |
| **Steps** | 1. Truy cập `http://localhost:5173/register` · 2. Nhập "Nguyen Van E3" vào ô "Họ Tên" · 3. Nhập "tc08.validemail@example.com" vào ô "Email" · 4. Nhập "Abcdefgh@" vào ô "Mật khẩu" · 5. Bấm nút "Đăng Ký" |
| **Expected Result** | ❌ UI: Hiển thị "Mật khẩu quá yếu! ..." (nguyên văn như TC-05); không điều hướng trang |
| **Verification Points** | 1. Thông báo lỗi hiển thị đúng vị trí · 2. Không có request tới `POST /api/register` |
| **Status** | ⬜ Not yet executed |

### TC-09 — Mật khẩu thiếu ký tự đặc biệt (trong tập quy định) bị từ chối

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-09 |
| **Test Case Name** | Đăng ký với Mật khẩu không có ký tự đặc biệt hợp lệ |
| **ECs Covered** | EC15 |
| **ECs Verified Absent** | — |
| **Pre-conditions** | Không |
| **Input — `name`** | `Nguyen Van E4` |
| **Input — `email`** | `tc09.validemail@example.com` |
| **Input — `password`** | `Abcd12345` |
| **Steps** | 1. Truy cập `http://localhost:5173/register` · 2. Nhập "Nguyen Van E4" vào ô "Họ Tên" · 3. Nhập "tc09.validemail@example.com" vào ô "Email" · 4. Nhập "Abcd12345" vào ô "Mật khẩu" · 5. Bấm nút "Đăng Ký" |
| **Expected Result** | ❌ UI: Hiển thị "Mật khẩu quá yếu! ..." (nguyên văn như TC-05); không điều hướng trang |
| **Verification Points** | 1. Thông báo lỗi hiển thị đúng vị trí · 2. Không có request tới `POST /api/register` |
| **Status** | ⬜ Not yet executed |

### TC-10 — Gap Probe: Tên chứa ký tự bất thường (API — UI bị chặn)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-10 |
| **Test Case Name** | Đăng ký với Tên chứa ký tự bất thường (số, thẻ HTML) |
| **ECs Covered** | N/A — gap test |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Không |
| **Input — `name`** | `12345 <script>alert(1)</script>` |
| **Input — `email`** | `tc10.validemail@example.com` |
| **Input — `password`** | `Abcd1234@` |
| **Steps** | 1. Gọi `POST http://localhost:3000/api/register` với body chứa `name` nêu trên |
| **UI Fallback Note** | Bug password phía client che lấp tín hiệu validate Name qua UI — phải quan sát trực tiếp qua API |
| **Expected Result** | Nếu HTTP 200 OK và `name` lưu y hệt chuỗi gửi lên → hệ thống không lọc ký tự đầu vào ở Name, cần theo dõi thêm rủi ro hiển thị (SEC-04) ở nơi khác render tên này → ghi nhận undocumented behavior. Nếu HTTP 4xx với lỗi định dạng Name → hệ thống có lọc ký tự ở backend, tài liệu hoá quy tắc thực tế |
| **Verification Points** | 1. Ghi nhận nguyên văn response body · 2. Nếu tạo thành công, kiểm tra `name` lưu trong CSDL có khớp y hệt input |
| **Status** | ⬜ Not yet executed |

### TC-11 — Gap Probe: Email trùng khác hoa/thường (API — UI bị chặn)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-11 |
| **Test Case Name** | Đăng ký với Email trùng tài khoản có sẵn nhưng khác hoa/thường |
| **ECs Covered** | N/A — gap test |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Email `test@eshop.com` đã tồn tại |
| **Input — `name`** | `Nguyen Van F1` |
| **Input — `email`** | `TEST@ESHOP.COM` |
| **Input — `password`** | `Abcd1234@` |
| **Steps** | 1. Gọi `POST http://localhost:3000/api/register` với email viết hoa toàn bộ, trùng tài khoản đã tồn tại (khác case) |
| **UI Fallback Note** | Bug password phía client che lấp tín hiệu validate uniqueness qua UI — phải quan sát trực tiếp qua API |
| **Expected Result** | Nếu HTTP 4xx (email đã dùng) → kiểm tra trùng không phân biệt hoa/thường, ghi nhận business rule thực tế. Nếu HTTP 200 OK → kiểm tra trùng phân biệt hoa/thường, hệ thống coi 2 tài khoản là khác nhau dù cùng hộp thư → rủi ro cho FR-03 (OTP gửi qua email) → ghi nhận cho gap analysis |
| **Verification Points** | 1. Ghi nhận response status + body nguyên văn · 2. Nếu 200 OK, đếm số user trùng email không phân biệt hoa/thường trong CSDL |
| **Status** | ⬜ Not yet executed |

### TC-12 — Gap Probe: Ký tự đặc biệt ngoài tập quy định (API — UI bị chặn)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-12 |
| **Test Case Name** | Đăng ký với Mật khẩu chỉ có ký tự đặc biệt ngoài whitelist SRS |
| **ECs Covered** | N/A — gap test |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Không |
| **Input — `name`** | `Nguyen Van F2` |
| **Input — `email`** | `tc12.validemail@example.com` |
| **Input — `password`** | `Abcd1234#` |
| **Steps** | 1. Gọi `POST http://localhost:3000/api/register` với password nêu trên |
| **UI Fallback Note** | Bug password phía client hiện từ chối mọi mật khẩu qua UI kể cả hợp lệ, không thể dùng UI để phân biệt câu hỏi gap này — phải quan sát qua API |
| **Expected Result** | Nếu HTTP 200 OK → hệ thống chấp nhận ký tự đặc biệt ngoài whitelist SRS, whitelist thực tế rộng hơn tài liệu. Nếu HTTP 4xx → hệ thống enforce đúng whitelist hẹp `{@,$,!,%,*,?,&}`, từ chối vì không thoả điều kiện |
| **Verification Points** | 1. Ghi nhận response status + body nguyên văn · 2. Nếu 200 OK, xác nhận đăng nhập được bằng đúng password này |
| **Status** | ⬜ Not yet executed |

### TC-13 — Gap Probe: Cơ chế Xác nhận Mật khẩu hoàn toàn vắng mặt (UI + API)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-13 |
| **Test Case Name** | Xác nhận trường/cơ chế Xác nhận Mật khẩu không tồn tại ở bất kỳ tầng nào |
| **ECs Covered** | N/A — gap test |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Không |
| **Input — `name`** | `Nguyen Van G` |
| **Input — `email`** | `tc13.validemail@example.com` |
| **Input — `password`** | `Abcd1234@` (không kèm bất kỳ tham số xác nhận nào) |
| **Steps** | 1. [UI] Truy cập `http://localhost:5173/register`, quan sát: trang chỉ hiển thị 3 trường "Họ Tên", "Email", "Mật khẩu" — không có trường "Xác nhận mật khẩu" nào như SRS FR-01 mô tả · 2. [API] Gọi `POST http://localhost:3000/api/register` với body JSON chỉ gồm `name`, `email`, `password` |
| **UI Fallback Note** | Trường "Xác nhận mật khẩu" không tồn tại trên UI (đã xác nhận qua khảo sát Step 3.0: chỉ 3 input trên trang, không text nào chứa "xác nhận"/"confirm") — phần kiểm tra cơ chế backend bắt buộc qua API |
| **Expected Result** | SRS FR-01 yêu cầu "Phải có trường Xác nhận mật khẩu — hệ thống từ chối nếu hai trường không khớp" nhưng UI hoàn toàn không triển khai trường này → BUG cần báo cáo bất kể kết quả API. Nếu API vẫn trả HTTP 200 OK dù không có tham số xác nhận nào → xác nhận backend cũng không có cơ chế thay thế nào (không OTP, không double-submit) → toàn bộ yêu cầu FR-01 về Xác nhận mật khẩu không được triển khai ở bất kỳ tầng nào |
| **Verification Points** | 1. Snapshot UI xác nhận không có trường "Xác nhận mật khẩu"/label chứa "xác nhận" nào trên DOM · 2. API cross-check: response status của lời gọi chỉ-password là 200 OK |
| **Status** | ⬜ Not yet executed |

---

## 5. EC Coverage Matrix

| EC ID | TC | Mechanism |
|---|---|---|
| EC01 | TC-01 | Nominal valid input |
| EC02 | TC-02 | Direct trigger |
| EC03 | *(Step 4 — bva.md)* | Extreme Value BVA |
| EC04 | TC-10 | Direct trigger (gap-probe) |
| EC05 | TC-01 | Nominal valid input |
| EC06 | TC-03 | Direct trigger |
| EC07 | TC-04 | Direct trigger |
| EC08 | *(Step 4 — bva.md)* | Extreme Value BVA |
| EC09 | TC-11 | Direct trigger (gap-probe) |
| EC10 | TC-01 | Direct trigger (primary target) |
| EC11 | TC-05 | Direct trigger |
| EC12 | TC-06 | Direct trigger |
| EC13 | TC-07 | Direct trigger |
| EC14 | TC-08 | Direct trigger |
| EC15 | TC-09 | Direct trigger |
| EC16 | *(Step 4 — bva.md)* | Extreme Value BVA |
| EC17 | TC-12 | Direct trigger (gap-probe) |
| EC18 | TC-13 | Direct trigger (gap-probe / observed) |
| EC19 | TC-13 | Direct trigger (gap-probe) |
| EC20 | TC-01 | Observed |
| EC21 | TC-05 | Observed |

**Tổng: 13 TC** (1 happy path, 8 negative isolation, 4 gap-probe). Tất cả 21 EC được cover; 3 EC liên quan giới hạn độ dài (EC03/EC08/EC16) dời sang Bước 4 (BVA).
