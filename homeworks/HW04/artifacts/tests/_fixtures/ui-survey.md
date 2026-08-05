# UI Survey — P1 (HW04)

Khảo sát bằng `playwright-cli` trên SUT thật (`bash apps/run-servers.sh`), ngày 2026-08-05,
trước khi sinh bất kỳ Playwright script nào. Mục tiêu: chốt locator **đã verify chạy được**
thay vì để AI đoán selector (rủi ro R1/R2 trong `TEST_PLAN.md`).

Tài khoản dùng để khảo sát:

| Vai trò | Email/Username | Mật khẩu | Ghi chú |
| --- | --- | --- | --- |
| User | `test@eshop.com` | `Test1234!` | Kế thừa từ HW02, còn tồn tại trong `database.sqlite`, `login_attempts=0` |
| Admin | `admin@eshop.com` | `Admin123!` | Từ `.claude/skills/playwright-cli/references/eshop-sut.md` |

---

## 1. FR-02 — `/login` (frontend-web, :5173)

### 1.1 Phát hiện cấu trúc DOM (quan trọng cho locator)

```html
<div class="max-w-md ...">
  <h2>Đăng Ký</h2>                                <!-- BUG-02: heading sai, đây vẫn là trang Login -->
  <form class="space-y-4">
    <div><label>Username</label><input type="text" ...></div>   <!-- không có name/id/placeholder -->
    <div><label>Mật khẩu</label><input type="text" ...></div>   <!-- ⚠️ type="text", KHÔNG PHẢI password -->
    <a href="/forgot-password">Quên mật khẩu?</a>
    <button type="submit">Sign In</button>
  </form>
  <div class="bg-red-100 text-red-700 ...">Đăng nhập thất bại. Vui lòng kiểm tra lại.</div>  <!-- chỉ render khi có lỗi, nằm NGOÀI <form> -->
</div>
```

**Xác nhận trực tiếp 2 bug đã biết (BUG-02 series):**
- Input mật khẩu là `type="text"` → hiển thị plaintext. Test case đã lên kế hoạch `TC-UI-01` (kỳ vọng "password field masked") **sẽ FAIL đúng — đây là defect thật**, không phải lỗi test.
- Thông báo lỗi render ngoài `<form>`, sau link "Đăng ký ngay" — khớp BUG-02-002 (vị trí sai so với "hiển thị phía trên nút submit" theo spec HW02 TC-07).

### 1.2 Bảng locator

| Control | Locator đề xuất | Đã verify? | Ghi chú |
| --- | --- | --- | --- |
| Input Username | `page.locator('form > div').filter({ hasText: 'Username' }).locator('input')` | ✅ fill thành công | `getByLabel()` **fail** — label không có `for`/`id`. `getByRole('textbox')` không phân biệt được username/password (không có accessible name). |
| Input Mật khẩu | `page.locator('form > div').filter({ hasText: 'Mật khẩu' }).locator('input')` | ✅ fill thành công | Cùng pattern. Type thực tế là `text`, snapshot hiện giá trị plaintext. |
| Nút Sign In | `page.getByRole('button', { name: 'Sign In' })` | ✅ click thành công | Có accessible name rõ ràng, không cần workaround. |
| Vùng lỗi | `page.locator('.bg-red-100.text-red-700')` | ✅ xuất hiện đúng sau submit sai | Fallback nếu đổi class: `div` cuối cùng là con trực tiếp của `.max-w-md` (chỉ tồn tại khi có lỗi, JSX dạng `{error && <div>...}`). |
| Link "Quên mật khẩu?" | `page.getByRole('link', { name: 'Quên mật khẩu?' })` | Không cần verify (ngoài scope FR-02) | — |

### 1.3 Request/response quan sát được

- Submit sai → `POST http://localhost:3000/api/login` → `401 Unauthorized`.
- Không cần thao tác gì đặc biệt để trigger — mọi lần submit đều gọi API trực tiếp (không có client-side validation chặn trước, khớp BUG-02-001 đã ghi ở HW02).

---

## 2. FR-09 — `/checkout` (frontend-web, :5173)

### 2.1 Phát hiện quan trọng nhất của survey này

**`/checkout` truy cập trực tiếp được, không cần qua giỏ hàng.** Lý do: nút "Thêm vào giỏ" ở
trang chủ **không gửi request nào và giỏ hàng vẫn trống sau khi click** (xác nhận bug đã biết:
*"Cart: add-to-cart button fires no API request; cart state not persisted"*). `/cart` sau đó
hiển thị "Giỏ hàng của bạn đang trống".

Điều này đảo ngược kiến trúc automation dự kiến ban đầu cho FR-09: **không cần fix/né bug giỏ
hàng**, vì trang `/checkout` có sẵn một ô nhập **"Tổng tiền thanh toán (VND)"** dạng
`<input type="number">` cho phép **nhập tay `total_amount`** — đây chính là cơ chế đứng sau
BUG-09-007 ("Checkout trusts a client-derived `total_amount` instead of recomputing it from the
cart"). Nhờ vậy, toàn bộ 21 TC của FR-09 (bao gồm cả TC cần "giỏ hàng có sản phẩm") automate
được thuần qua UI `/checkout`, chỉ cần set `total_amount` theo giá trị `cases.json`.

### 2.2 Cấu trúc DOM

```html
<div class="max-w-lg ...">
  <h2>Xác Nhận Đơn Hàng</h2>
  <div><h3>Sản phẩm:</h3><ul class="list-disc pl-5"></ul></div>   <!-- rỗng khi vào thẳng /checkout -->
  <div><label>Tổng tiền thanh toán (VND):</label><input type="number" value="0"></div>
  <div class="bg-gray-50 ...">
    <label>Mã Giảm Giá</label>
    <input placeholder="Nhập mã giảm giá..." type="text">
    <button disabled>Áp dụng</button>   <!-- enable khi input coupon không rỗng -->
  </div>
  <div><span class="font-bold text-xl">Tổng thanh toán: 0 ₫</span></div>
  <button>Xác Nhận Thanh Toán</button>
</div>
```

Sau khi apply thành công, xuất hiện thêm block kết quả (chỉ khi có phản hồi):

```html
<div>
  <p>✅ Áp dụng thành công! Giảm 10%</p>
  <p>Tiết kiệm: <strong>-9,000,000 ₫</strong></p>
  <p>Thành tiền: <strong>10,000,000 ₫</strong></p>
</div>
```

### 2.3 Bảng locator

| Control | Locator đề xuất | Đã verify? | Ghi chú |
| --- | --- | --- | --- |
| Input tổng tiền | `page.getByRole('spinbutton')` | ✅ fill `1000000` | Duy nhất 1 spinbutton trên trang — an toàn. |
| Input mã coupon | `page.getByPlaceholder('Nhập mã giảm giá...')` | ✅ fill `SAVE10` | Placeholder khớp JSX gốc — ổn định hơn CSS. |
| Nút Áp dụng | `page.getByRole('button', { name: 'Áp dụng' })` | ✅ click, tự động enable khi coupon không rỗng | Disabled ban đầu — test cần verify enable state như 1 assertion riêng. |
| Thông báo kết quả (thành công) | `page.getByText(/Áp dụng thành công/)` | ✅ xuất hiện sau click | Cho case fail, dùng `page.getByText(/thất bại|hết hạn|không tồn tại/i)` — cần verify từng thông báo lỗi cụ thể ở bước A3/A4 vì server trả `message` khác nhau theo lỗi. |
| Số tiền tiết kiệm | `page.getByText('Tiết kiệm:').locator('..').locator('strong')` | ✅ đọc được `-9,000,000 ₫` | Dùng cho assertion pattern UI kiểm tra giá trị discount hiển thị đúng/sai. |
| Tổng thanh toán cuối | `page.getByText(/Tổng thanh toán:/)` | ✅ | Nằm ngoài card kết quả coupon, cập nhật real-time theo input. |
| Nút Xác Nhận Thanh Toán | `page.getByRole('button', { name: 'Xác Nhận Thanh Toán' })` | Chưa click (ngoài scope FR-09 apply-coupon) | Dùng nếu cần TC full checkout flow. |

### 2.4 Request/response quan sát được — bằng chứng bug thật

Request: `POST http://localhost:3000/api/apply-coupon` (không kèm `Authorization` header — **request đi qua thành công dù không login**, xác nhận BUG-09-002).

Response với `total_amount=1000000`, coupon `SAVE10` (loại percent, giảm "10%"):

```json
{"success":true,"coupon_id":1,"discount_amount":-9000000,"final_amount":10000000,"message":"Áp dụng thành công! Giảm 10%"}
```

`discount_amount: -9000000` trên tổng 1.000.000 với nhãn "giảm 10%" → sai lệch **900%**, không phải sai số làm tròn. Đây là tái hiện trực tiếp **BUG-09-001** (công thức phần trăm cho ra số âm sai) bằng dữ liệu khảo sát thật — dùng làm bằng chứng bổ sung cho Issue #17 khi viết `BUG_REPORT.md`.

---

## 3. FR-16 — Admin CSV Import (frontend-admin, :5174)

### 3.1 Điều hướng

1. Trang gốc `:5174` hiện form login admin (**khác `/login` bên web**: input ở đây CÓ accessible name qua `placeholder`, không cần workaround).
2. Sau đăng nhập, sidebar là `<li>` (`listitem`, không phải `<a>`/`<button>`) → phải click bằng text, không dùng `getByRole('link'|'button')`.
3. Mục CSV import nằm trong trang "Sản phẩm".

### 3.2 Cấu trúc DOM (mục Import)

```html
<div class="bg-blue-50 ...">
  <div>
    <h3>📂 Import sản phẩm từ CSV</h3>
    <a href="data:text/csv;..." download="template_import.csv">Tải file mẫu (template.csv)</a>
  </div>
  <div>
    <input type="file">                          <!-- ⚠️ không có accept=".csv" -->
    <button disabled>Import 0 sản phẩm</button>   <!-- text đổi theo số dòng preview -->
  </div>
</div>
```

Sau khi chọn file hợp lệ, xuất hiện bảng xem trước ("Xem trước (N dòng)") và nút đổi thành
"Import N sản phẩm" (enabled). Sau khi bấm Import, xuất hiện `<p>✅ Import hoàn tất: X/Y sản phẩm được thêm</p>`.

**Xác nhận trực tiếp BUG-16-005:** `<input type="file">` **không có thuộc tính `accept`**, nghĩa là trình duyệt không tự chặn chọn file non-CSV ở tầng UI — khớp mô tả "Admin UI does not enforce the .csv file extension".

### 3.3 Bảng locator

| Control | Locator đề xuất | Đã verify? | Ghi chú |
| --- | --- | --- | --- |
| Input Email (admin login) | `page.getByRole('textbox', { name: 'Email' })` | ✅ fill | Có accessible name sạch qua placeholder — không cần workaround như FR-02. |
| Input Password (admin login) | `page.getByRole('textbox', { name: 'Password' })` | ✅ fill | — |
| Nút Login (admin) | `page.getByRole('button', { name: 'Login' })` | ✅ click, vào Dashboard | — |
| Menu "Sản phẩm" (sidebar) | `page.getByText('Sản phẩm', { exact: true })` | ✅ click, điều hướng đúng trang | Sidebar là `<li>`, không phải link/button — bắt buộc dùng text locator, không dùng role. |
| Input file CSV | `page.locator('input[type="file"]')` | ✅ upload qua filechooser | Duy nhất 1 `input[type=file]` trên trang. **Không dùng `upload` command trực tiếp** — phải `click()` trước để trigger modal filechooser, rồi mới `setFiles()`. |
| Nút Import | `page.getByRole('button', { name: /Import \d+ sản phẩm/ })` | ✅ click sau khi file hợp lệ, request `POST /api/admin/import-products` thành công | Text đổi theo số dòng — dùng regex, không match chuỗi cứng "Import 0 sản phẩm". |
| Thông báo kết quả | `page.getByText(/Import hoàn tất/)` | ✅ | Response body mẫu: `{"message":"Import hoàn tất: 1/1 sản phẩm được thêm","inserted":1,"errors":[]}` — field `errors` là mảng, dùng cho assertion pattern #2 (network) khi test rollback. |

### 3.4 Ghi chú cho `db.ts` fixture

DB `apps/backend/database.sqlite` đọc được trực tiếp qua **`node:sqlite`** (built-in Node 24, không cần `better-sqlite3`/`g++` — xem quyết định ở P0). Bảng liên quan: `users`, `products`, `categories`, `coupons`, `coupon_usage`, `orders`. Xác nhận `test@eshop.com` (`login_attempts=0`, `locked_until=null`) vẫn dùng được cho FR-02.

---

## 4. Tổng kết hệ quả lên kiến trúc (cập nhật so với `TEST_PLAN.md`)

| # | Phát hiện mới ở P1 | Thay đổi so với kế hoạch ban đầu |
| --- | --- | --- |
| P1-1 | Mật khẩu login web là `type="text"` thật (không phải giả định) | `TC-UI-01` (password masking) sẽ **fail thật** — đổi từ "kỳ vọng pass" sang "known defect, expected FAIL", cần thêm `knownDefect` id mới trong `cases.json` và mở Issue nếu HW02 chưa có. Kiểm tra: HW02 `BUG_REPORT.md` chưa có bug về việc password field không mask — **đây là bug mới do automation phát hiện**, không trùng 16 bug cũ. |
| P1-2 | Giỏ hàng không hoạt động (add-to-cart không gửi request) | Không cần route qua `/cart` cho FR-09 — dùng thẳng ô nhập `total_amount` ở `/checkout`. Giảm độ phức tạp fixture, bỏ nhu cầu POM riêng cho trang Home/Cart trong scope FR-09. |
| P1-3 | Admin login sạch, web login bẩn | 2 tiêu chuẩn locator khác nhau cho 2 POM: `admin-import.page.ts` dùng role/label bình thường; `login.page.ts` (FR-02) cần div-filter workaround. Đây chính là ví dụ cụ thể nhất cho `REPORT.md §6.1` (Fragile Selectors) — AI chắc chắn sẽ thử `getByLabel` trước ở cả hai trang như nhau, và chỉ 1 trong 2 sẽ fail. |
| P1-4 | Input file CSV không có `accept=".csv"` | Xác nhận BUG-16-005 ở tầng DOM, không chỉ suy luận — dùng câu này trực tiếp trong `BUG_REPORT.md`. |
