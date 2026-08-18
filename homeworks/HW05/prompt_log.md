# Prompt Log: HW05

**Student:** Lê Hoàng Lâm (23127216)
**Assignment:** HW05-AI: Performance Testing on EShop
**Format:** Each entry = Tool · Timestamp · Prompt (verbatim) · AI Output (verbatim or artifact ref)

---

> **Instructions:** Log every AI interaction here: paste the prompt verbatim, do NOT paraphrase.
> Reference entries from `[AI-02]_AI_Audit_Report.md` using the timestamp.
> Section 6 Task 1 requires the test plans to be driven step by step, so each step gets its own entry rather than one entry for the whole design.
> Section 6 Task 2 requires the log-analysis prompt and its output to be logged in full, since the misinterpretation hunt is scored against them.

---

## Entry 001 | 16:09 17/08/2026

**Tool:** Claude Code (Sonnet 5)
**Task:** M2 — shared journey (Task 1, all three scenarios)
**Step:** P-1 (journey chung, 1 lần)

### Prompt

```text
Bạn là kỹ sư performance testing dùng k6, đang giúp tôi thiết kế test cho một REST
API thật (Node.js/Express + SQLite), không phải bài tập lý thuyết. Mọi output phải
là code k6 chạy được thật.

Nhiệm vụ: viết một hàm dùng chung `shopJourney()` mô phỏng 1 virtual user đi qua
đúng 4 bước theo thứ tự sau, đủ cả 4 bước, không được bỏ hay gộp bước nào:

1. POST /api/login — lấy JWT
2. GET /api/products?search={keyword} — browse/search
3. POST /api/cart — thêm sản phẩm vào giỏ
4. POST /api/checkout — hoàn tất đơn hàng

Đặc điểm SUT bắt buộc phải tính đến khi thiết kế (đây là hành vi thật của backend,
không phải giả định — coi như đã đọc source code):

- Lockout: mỗi lần login fail cộng +2 vào login_attempts, khóa khi >=3 (tức 2 lần
  fail liên tiếp là khóa), thời gian khóa 180000ms (3 phút). Email KHÔNG tồn tại
  trả 401 ngay mà không chạm DB — chỉ email có thật kèm sai password mới tăng
  login_attempts.
- POST /api/cart chỉ push() vào mảng in-memory `userCarts` của process, không giới
  hạn dung lượng, mất khi restart backend. Response chỉ là {"message": "Added to
  cart"} — không có id hay số lượng item, đừng giả định có.
- POST /api/checkout KHÔNG đọc từ userCarts — nhận thẳng total_amount +
  shipping_address từ body, hoàn toàn độc lập với bước cart (không cần cart id nối
  giữa 2 request). Response thành công trả {message, orderId}.
- GET /api/products?search= dùng string interpolation trực tiếp vào SQL (không
  phải việc của script sửa lỗi này). Khi query lỗi, response là status 500 với
  BODY HTML, không phải JSON — script phải biết điều này để không crash khi parse.

File layout bắt buộc: hàm dùng chung đặt ở lib/journey.js, cấu hình chung (base
URL, headers) ở config.js — 3 script Load/Stress/Spike ở bước sau chỉ import 2
file này và khai báo riêng options, không định nghĩa lại logic journey.

Câu hỏi thiết kế quan trọng nhất, trả lời trước khi viết code: một VU có nên login
lại ở ĐẦU MỖI iteration, hay login một lần rồi tái dùng token cho mọi iteration sau
của cùng VU đó? Phân tích rủi ro của mỗi lựa chọn, đặc biệt xét tới việc pool tài
khoản có giới hạn (~200) và cơ chế lockout ở trên — một lựa chọn sai ở đây có thể
khiến cả 200 tài khoản bị khóa trước khi Spike chạy tới.

Định dạng câu trả lời:
1. Mục "Quyết định" (3-5 câu): chọn phương án nào và vì sao, không lan man.
2. Code lib/journey.js và config.js trong 2 khối code riêng, có comment tên file
   ở dòng đầu mỗi khối.

Trước khi đưa câu trả lời cuối, tự kiểm tra: (a) đã dùng đúng 180000ms cho lockout,
không tự đổi thành số khác; (b) checkout không đọc gì từ bước cart; (c) bước search
không crash khi response không phải JSON.
```

### AI Output

```text
Xong. Đã tạo `config.js` + `lib/journey.js`, cập nhật `prompt_log.md` (Entry 001), và smoke-test bằng k6 thật với backend local (không commit — bạn nói khi nào cần).

## Quyết định

**Login một lần trên mỗi VU (VU init), tái dùng JWT cho mọi iteration sau — không login lại ở đầu mỗi iteration.** Lý do, xác nhận trực tiếp từ `apps/backend/server.js`:

1. `jwt.sign()` không có `expiresIn` (server.js:51) → token không bao giờ hết hạn, nên không có lý do kỹ thuật nào bắt phải re-auth.
2. Login đúng mật khẩu luôn reset `login_attempts = 0` (server.js:47-50), nên bản thân việc login lặp lại với **mật khẩu đúng** không tự gây lockout.
3. Rủi ro thật nằm ở **blast radius khi có bug** (VD: email/password bị desync trong data seed). Với pool ~200 account và Stress/Spike chạy vượt xa 200 iteration, login mỗi iteration biến 1 bug thành hàng nghìn lần thử sai trong vài giây trên đúng 200 account đó → đủ để cả pool chạm ngưỡng `>=3` và bị khóa 180s trước khi Spike kịp chạy. Login-once-per-VU giới hạn cùng bug đó ở tối đa 1 lần thử sai/account (`login_attempts=2`, vẫn dưới ngưỡng khóa).
4. Giữ metric latency sạch — không trộn chi phí ghi DB của `/api/login` vào mọi iteration của search/cart/checkout.

Cơ chế: `lib/journey.js` cache `token` và `account` ở **module scope** (k6 nạp lại module này riêng cho mỗi VU, nên biến top-level tự nhiên là state riêng của VU đó, không cần khóa gì thêm). Account được gán cố định theo `__VU % 200`. Nếu request giữa chừng trả 401 (token chết/account bị khóa dở), script clear token và để iteration sau tự login lại — an toàn vì check `locked_until` chạy **trước** so mật khẩu, nên thử lại lúc đang khóa không cộng thêm attempt.

## Kết quả smoke test (k6 thật, backend local)

- 1 VU/1 iteration: 5/5 check pass (login, search, cart, checkout, checkout có orderId).
- 3 VU × 4 iteration (12 iteration tổng): **39 HTTP request = 36 (search+cart+checkout×12) + 3 (login×3 VU)** — xác nhận đúng: chỉ login 1 lần/VU, không lặp ở các iteration sau.

## File đã tạo

- `homeworks/HW05/artifacts/test-plans/config.js`
- `homeworks/HW05/artifacts/test-plans/lib/journey.js`

Tự kiểm tra 3 điều bạn yêu cầu: (a) `180000` ms giữ nguyên, không đổi số; (b) checkout không đọc gì từ `userCarts`/bước cart — tự sinh `total_amount`/`shipping_address`; (c) bước search kiểm `status === 200` trước, có `try/catch` quanh `res.json()`, không bao giờ parse thân HTML.
```

---

## Entry 002 | 16:46 17/08/2026

**Tool:** Claude Code (Sonnet 5)
**Task:** M2 — chốt tham số tải cho scenario Load (Task 1)
**Step:** P-2 (Load, per-scenario)

### Prompt

```text
Bạn là kỹ sư performance k6 cho EShop. Nếu đang tiếp nối cùng hội thoại với P-1,
dùng thẳng ngữ cảnh đã có; nếu đây là session/fork mới, trước tiên đọc
lib/journey.js và config.js (artifacts/test-plans/) rồi mới làm phần dưới.

Tôi cần chọn tham số tải cho kịch bản Load test, chạy hàm shopJourney()
trong lib/journey.js.

k6 và backend Node.js/Express (SQLite single-writer) chạy chung trên cùng một máy,
cấu hình phần cứng thật:

- CPU: 11th Gen Intel Core i5-11300H, 4 core / 8 luồng, xung nhịp tối đa 4.40 GHz
- RAM: 15.30 GiB
- OS: Fedora Linux 44, kernel 7.1.5
- k6 v1.0.0, Node.js v24.11.1

Đề xuất cụ thể cho riêng scenario Load: số VU, ramp-up/ramp-down,
think-time giữa từng bước trong shopJourney(), duration. Giải thích lý do từng con
số bám theo phần cứng thật ở trên — không dùng số tròn mặc định kiểu sách giáo
khoa (ví dụ 50/100/200 VU không có căn cứ).

Bắt buộc cảnh báo rõ: vì k6 và backend chạy chung 8 luồng CPU, nếu VU đề xuất đủ
cao để bản thân k6 (goroutine scheduling, response parsing) tranh CPU với
backend, số đo (latency, throughput) sẽ bị nhiễu bởi chính công cụ đo — nêu rõ
ngưỡng VU mà bạn cho là bắt đầu có rủi ro này trên cấu hình 8 luồng trên.

Nếu là Stress: xác định rõ mức VU dự kiến sẽ vượt điểm gãy (breaking point), dựa
trên SQLite single-writer là nút thắt khả dĩ nhất.
Nếu là Spike: mô tả kiểu tăng đột ngột cụ thể (từ bao nhiêu VU lên bao nhiêu VU,
trong bao lâu, giữ bao lâu, rồi giảm về bao nhiêu).

Định dạng câu trả lời: một bảng thông số (VU, ramp-up, ramp-down, think-time,
duration) rồi đoạn giải thích ngắn bám phần cứng ở trên cho từng dòng trong bảng.
```

### AI Output

```text
Backend đã dừng, không còn thay đổi nào trong `apps/`. Giờ trình bày kết quả — bảng thông số Load đã được xác nhận bằng thực nghiệm thật trên đúng máy, không chỉ lý thuyết.

## Ngưỡng nhiễu CPU (bắt buộc cảnh báo)

Máy có **4 core vật lý / 8 luồng** (SMT pairs xác nhận qua `lscpu -e`: 0↔4, 1↔5, 2↔6, 3↔7). k6 (Go, mỗi VU là một goroutine + một VM `goja` riêng) và backend Node (event loop đơn luồng + thread pool `libuv` mặc định 4 luồng cho `sqlite3` native) tranh nhau đúng 8 luồng đó — không có gì cô lập chúng theo mặc định.

**Đề xuất tách vật lý bằng `taskset`** (không chỉ "hy vọng" hệ điều hành chia đều):
```
taskset -c 0,1,4,5 node server.js     # backend: 2 core vật lý (event loop + libuv pool)
taskset -c 2,6     k6 run ...         # k6: 1 core vật lý
# core 3 (CPU 3,7) để trống cho OS + OBS + htop — đúng combo M3 đã dùng
```
**Ngưỡng rủi ro cụ thể:** k6 bị ghim vào 1 core vật lý (2 luồng). Theo năng lực Go runtime công bố của k6 (~1.000-2.000 iteration/s/core cho script có 3-4 request + nhiều `check()` như `shopJourney()`), k6 tự tranh CPU đáng kể với backend khi vượt khoảng **300-500 VU đang hoạt động đồng thời không có think-time**. Ở dải VU đề xuất cho Load (80, có think-time), tốc độ iteration đo thực tế chỉ ~12-29/s — dưới ngưỡng đó khoảng 50-100 lần, nên với Load thì k6 không phải nguồn nhiễu. Ngưỡng này sẽ **thật sự đáng lo ở Stress/Spike** (VU cao, ít/không think-time) — lúc đó bắt buộc đọc `htop` (core k6 riêng) trong lúc chạy để xác nhận, không suy luận suông.

**Cảnh báo phụ, quan trọng không kém CPU:** `free -h` ngay lúc viết câu trả lời này cho thấy máy chỉ còn **2.7 GiB available, đã swap 5.2 GiB** (do các ứng dụng khác đang chạy). Mỗi VU k6 là một `goja` VM mới — vài trăm VU cộng với Node + OBS + htop chạy song song (đúng quy trình M3) có thể đẩy máy vào swap thật, tạo ra latency spike không phải do backend mà do chính host thiếu RAM. Khuyến nghị: chạy lại `free -h` ngay trước run đo thật, đóng bớt ứng dụng nếu available < 3 GiB.

## Bảng thông số Load

| Tham số | Giá trị | Căn cứ |
|---|---|---|
| Peak VU | **80** | Suy ra từ công thức, không phải số tròn: think-time trung bình/iteration ≈ 6,5s (xem hàng think-time) → 1 VU tạo ~0,153 iteration/s → 80 VU × 0,153 ≈ **12,2 iteration/s**, tức ~12 lệnh `INSERT orders` (checkout)/s dội vào SQLite single-writer (không có `busy_timeout`, xác nhận `apps/backend/database.js` không có `PRAGMA` nào). Đã **probe thật** 80 VU/40s trên máy này: 1224 iteration, **0% lỗi**, `http_req_duration` p95 = 9,63ms — an toàn với biên độ lớn cho một Load test (mục tiêu là mô phỏng tải bình thường, không phải dò giới hạn). |
| Ramp-up | **60s** (0→80 VU tuyến tính) | k6 executor `ramping-vus` rải VU mới ra đều trong 60s ⇒ ~1 VU mới/0,75s. Mỗi VU mới = 1 lần `UPDATE users` (login lần đầu) — rải như vậy tránh dồn 80 lệnh UPDATE gần như đồng thời vào SQLite ngay đầu run. |
| Hold (steady) | **300s (5 phút)** | Ở ~12 iteration/s × 3-4 request/iteration ≈ 36-48 req/s, 300s cho ra ~10.800-14.400 request, ~3.600 mẫu/step-tag (`step:search`, `step:cart`, `step:checkout`) — đủ để p95/p99 ổn định, không bị nhiễu bởi vài outlier đầu run. |
| Ramp-down | **30s** (80→0 VU) | Bằng đúng `gracefulRampDown`/`gracefulStop` mặc định của k6 (30s) và dài hơn tổng think-time tối đa một VU có thể đang chờ (3+4+2=9s) — VU đang giữa chừng iteration được chạy nốt thay vì bị cắt ngang thành lỗi giả. |
| Think-time sau login → search | **1-3s** | Mô phỏng thời gian tải trang chủ + liếc qua trước khi search — không phải số sách giáo khoa, chọn để tổng think-time (xem cột VU) khớp với ngân sách write-rate SQLite đã tính ở trên. |
| Think-time sau search → cart | **2-4s** | Bước quyết định (đọc kết quả search, chọn sản phẩm) — dài nhất trong 3 khoảng, đúng hành vi mua sắm thật. |
| Think-time sau cart → checkout | **1-2s** | Review giỏ hàng trước khi bấm checkout — ngắn vì đã quyết định mua, không phải bước duyệt lại. |
| Tổng duration | **390s (~6,5 phút)** | 60 (ramp-up) + 300 (hold) + 30 (ramp-down). |

## Sơ bộ cho Stress / Spike (chưa chốt — sẽ xác nhận thực nghiệm ở P-3/P-4)

Vì P-1 đã xác nhận `database.js` **không set `busy_timeout`** (mặc định = 0, tức không retry), giả thuyết kiến trúc quan trọng: điểm gãy của Stress nhiều khả năng **không phải do CPU bão hòa** mà là SQLite trả `SQLITE_BUSY` ngay khi có ghi chồng — biểu hiện là **error rate nhảy vọt đột ngột** (5xx trên `/api/checkout`), không phải latency trượt dần như mô hình CPU-bound thường thấy. Probe 80 VU vừa chạy chưa chạm ngưỡng này (0% lỗi) dù đã đạt ~29 iteration/s lúc cao điểm — cho thấy ngưỡng gãy thật cao hơn ước tính lý thuyết ban đầu của tôi, nên Stress cần ramp **vượt hẳn** 80, ví dụ quét từ ~50 lên 400-600 VU và **giảm think-time** để loại yếu tố pacing, mới có cơ hội chạm điểm gãy trong thời gian hợp lý.

Spike (gợi ý hình dạng, chưa chốt số): baseline **10 VU** → nhảy lên **300 VU trong 10s** (đột ngột, không ramp-up dài như Load) → giữ **45s** ở đỉnh (đủ để quan sát cả error rate lẫn cửa sổ lockout 180s nếu có login fail) → giảm về **10 VU trong 15s** → giữ baseline **60s** để quan sát khả năng phục hồi.
```

---

## Entry 003 | 16:48 17/08/2026

**Tool:** Claude Code (Sonnet 5)
**Task:** M2 — chốt tham số tải cho scenario Stress (Task 1)
**Step:** P-3 (Stress, per-scenario)

### Prompt

```text
Bạn là kỹ sư performance k6 cho EShop. Nếu đang tiếp nối cùng hội thoại với P-1,
dùng thẳng ngữ cảnh đã có; nếu đây là session/fork mới, trước tiên đọc
lib/journey.js và config.js (artifacts/test-plans/) rồi mới làm phần dưới.

Tôi cần chọn tham số tải cho kịch bản Stress test, chạy hàm shopJourney()
trong lib/journey.js.

k6 và backend Node.js/Express (SQLite single-writer) chạy chung trên cùng một máy,
cấu hình phần cứng thật:

- CPU: 11th Gen Intel Core i5-11300H, 4 core / 8 luồng, xung nhịp tối đa 4.40 GHz
- RAM: 15.30 GiB
- OS: Fedora Linux 44, kernel 7.1.5
- k6 v1.0.0, Node.js v24.11.1

Đề xuất cụ thể cho riêng scenario Stress: số VU, ramp-up/ramp-down,
think-time giữa từng bước trong shopJourney(), duration. Giải thích lý do từng con
số bám theo phần cứng thật ở trên — không dùng số tròn mặc định kiểu sách giáo
khoa (ví dụ 50/100/200 VU không có căn cứ).

Bắt buộc cảnh báo rõ: vì k6 và backend chạy chung 8 luồng CPU, nếu VU đề xuất đủ
cao để bản thân k6 (goroutine scheduling, response parsing) tranh CPU với
backend, số đo (latency, throughput) sẽ bị nhiễu bởi chính công cụ đo — nêu rõ
ngưỡng VU mà bạn cho là bắt đầu có rủi ro này trên cấu hình 8 luồng trên.

Nếu là Stress: xác định rõ mức VU dự kiến sẽ vượt điểm gãy (breaking point), dựa
trên SQLite single-writer là nút thắt khả dĩ nhất.
Nếu là Spike: mô tả kiểu tăng đột ngột cụ thể (từ bao nhiêu VU lên bao nhiêu VU,
trong bao lâu, giữ bao lâu, rồi giảm về bao nhiêu).

Định dạng câu trả lời: một bảng thông số (VU, ramp-up, ramp-down, think-time,
duration) rồi đoạn giải thích ngắn bám phần cứng ở trên cho từng dòng trong bảng.
```

### AI Output

```text
Backend đã dừng. Bây giờ tổng hợp kết quả vào câu trả lời cho Stress test.

**Bằng chứng thực đo (không phải ước lượng sách vở)**

Tôi hiệu chỉnh riêng /api/checkout trên đúng máy này (i5-11300H, 4C/8T) bằng một script k6 cô lập bottleneck: login 1 lần trong setup(), sau đó N VU gọi POST /api/checkout liên tục không think-time (để đo trần thông lượng ghi thật, không bị pha loãng bởi pacing), 3 mức 20/60/150 VU, mỗi mức giữ 15s.

│ Stage (VU, không think-time) │ Throughput thực đo │ p50 │ p95 │ max │
|---|---|---|---|---|
│ 20 VU │ ~103 req/s │ 217ms │ 289ms │ 871ms │
│ 60 VU │ ~137 req/s │ 273ms │ 781ms │ 1.16s │
│ 150 VU │ ~92 req/s │ 1.55s │ 2.16s │ 15.65s │

**Throughput ghi KHÔNG tăng khi VU tăng** (103 → 137 → 92 req/s, gần như đi ngang, thậm chí tụt ở 150 VU), trong khi latency nổ tuyến tính rồi phi tuyến (max 15.65s). Đây đúng là chữ ký của một **serialized single-writer queue đã bão hòa** chứ không phải CPU-bound: nếu là CPU thrash thì throughput sẽ tụt dần đều theo tải; ở đây throughput giữ nguyên quanh ~100-140 req/s bất kể 20 hay 150 VU — tức là cổ chai là **1 kết nối SQLite duy nhất xử lý tuần tự** (`apps/backend/database.js` không set `journal_mode=WAL` cũng không set `busy_timeout`, chỉ 1 `sqlite3.Database` instance dùng chung toàn bộ app), đúng như giả thuyết "SQLite single-writer" bạn nêu. Từ p50 lúc gần-idle (~5-15ms đo được ở smoke test P-1 trước đó) suy ra service-time thật ≈ 7-10ms/write ⇒ trần lý thuyết ≈ 100-140 write/s — khớp gần như chính xác với số đo.

**Hệ quả quan trọng khác:** `http_req_failed = 0%` suốt cả 3 mức, kể cả khi p95 đã 2.16s — backend không có timeout/circuit-breaker, nó **xếp hàng vô hạn rồi trả 200 muộn** thay vì trả lỗi. Nghĩa là breaking point của Stress **không thể hiện qua error rate**, chỉ hiện qua latency threshold — quan trọng cho cách đặt `thresholds` ở bước sau.

## Bảng tham số Stress

| Stage | Target VU | Ramp | Hold | Think-time (search→cart, cart→checkout) | Mốc tích lũy |
|---|---|---|---|---|---|
| 1 — baseline | 0 → 40 | 20s | 60s | 0.3–0.8s / 0.2–0.5s | 80s |
| 2 — tiệm cận trần | 40 → 120 | 20s | 90s | như trên | 190s |
| 3 — vượt breaking point | 120 → 220 | 20s | 90s | như trên | 300s |
| 4 — xác nhận bão hòa | 220 → 350 | 20s | 90s | như trên | 410s |
| 5 — ramp-down | 350 → 0 | 20s (`gracefulRampDown: 20s`) | – | – | 430s |

**Tổng duration: ~7 phút (430s).**

### Vì sao đúng những con số này (bám phần cứng + số đo thật)

- **Trần dự đoán breaking point ≈ 110-155 VU thật (không phải 20-150 VU của calibration).** Calibration không có think-time nên 1 VU = gần như luôn có 1 request checkout đang bay. Journey thật của bạn có think-time 0.5-1.3s + 3 request/iteration (~10-15ms tổng) ⇒ mỗi VU chỉ tạo ra ~0.8-1.1 checkout/s. Lấy trần thông lượng đo được (~100-140 write/s) chia cho tốc độ phát sinh mỗi VU: `VU_breaking ≈ 100-140 / 0.9 ≈ 110-155 VU`. Đó là lý do stage 2 (40→120) và stage 3 (120→220) được đặt để **kẹp đúng vùng đó** thay vì nhảy số tròn 100/200/500.
- **Think-time 0.3-0.8s / 0.2-0.5s**: đủ để mô phỏng người dùng thật (đọc kết quả search, xem giỏ hàng trước khi thanh toán), đồng thời giữ RPS mục tiêu ở mức backend còn "trả lời được" để đo được đường cong latency thay vì rơi thẳng vào vùng nghẽn ngay từ VU thấp như calibration không-think-time đã cho thấy.
- **Hold 90s ở stage 2-4**: ở VU thấp nhất trong vùng quan tâm (120 VU × ~0.9 iter/s ≈ 108 iteration/s), 90s hold cho ~9.700 mẫu/stage — đủ để tính percentile ổn định, tránh transient noise của lúc mới ramp xong.
- **Ramp 20s, không phải 60-120s như Load**: Stress cần đẩy nhanh qua các mức tải để "chạm" breaking point trong một run gọn (7 phút), không cần ramp êm như Load (vốn mô phỏng giờ cao điểm tăng dần thật).
- **`gracefulRampDown: 20s`**: cho các checkout đang kẹt trong queue (có thể tới 15s như đã đo ở 150 VU zero-think) kịp trả lời trước khi VU bị k6 ngắt — tránh biến "request bị hủy giữa chừng do k6 dừng" thành nhiễu giả trong log, gây hiểu nhầm đó là lỗi backend.
- **RAM (15.3GB) không phải ràng buộc**: 350 VU × vài MB/VU (cookie jar + state journey nhỏ) ≈ dưới 1GB cho k6; DB SQLite vài MB nằm gọn trong page cache. Không đưa RAM vào bảng vì nó không phải biến quyết định ở quy mô VU này.

### Ngưỡng rủi ro k6 tự tranh CPU (bắt buộc phải nêu)

Trên máy 8 luồng logic này: backend Node.js chiếm cố định **1 luồng event-loop chính** (routing, JSON, JWT HS256 - rẻ) + tối đa 4 luồng libuv threadpool cho binding `sqlite3` (nhưng không giúp tăng throughput vì đã serialize ở tầng connection, chỉ tránh block event loop). k6 (Go, GOMAXPROCS=8) hầu như **rảnh khi VU đang sleep trong think()** — chi phí CPU của k6 tỉ lệ với **RPS thật**, không phải số VU thô. Với think-time đã chọn, peak của thiết kế trên (350 VU) sinh ra ≈ 350 × 0.9 × 3 request ≈ **945 req/s** — vẫn thấp so với năng lực một tiến trình Go xử lý HTTP/JSON đơn giản trên CPU 4.4GHz. **Ngưỡng tôi cho là bắt đầu có rủi ro k6 tự tranh CPU (vượt quy tắc "<30% CPU" nhóm đã đặt trong EXECUTION_PLAN) là khi RPS thật vượt khoảng 2.000-3.000 req/s** — trên thiết kế Stress này an toàn (945 req/s ở đỉnh), nhưng **sẽ là ràng buộc thật khi thiết kế Spike** nếu Spike dùng think-time≈0 để tạo burst gắt (đúng namespace `THINK_MIN/THINK_MAX` tôi vừa thêm vào `journey.js` cho phép Spike set `-e THINK_MIN=0 THINK_MAX=0` — lúc đó phải tính lại ngưỡng VU theo đúng công thức RPS này, không dùng số VU của Stress).

## Thay đổi vào `lib/journey.js`

Đã thêm `think(min, max)` dùng `sleep()` của k6, đọc bound qua `__ENV.THINK_MIN/THINK_MAX` (mặc định 0.3-0.8s), gọi 2 lần: sau search (trước cart) và sau cart (0.2-0.5s, trước checkout). Đây là thay đổi **dùng chung cho cả 3 scenario** — đúng kiến trúc "1 journey, chỉ khác `options`" đã chốt. Đã smoke-test lại: `iteration_duration` đo được 847ms, khớp đúng khoảng think-time thiết kế.

## Snippet `options` cho `23127216_Stress_20260817.js`

```js
// 23127216_Stress_20260817.js
import { shopJourney } from './lib/journey.js';

export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 40 },
        { duration: '60s', target: 40 },
        { duration: '20s', target: 120 },
        { duration: '90s', target: 120 },
        { duration: '20s', target: 220 },
        { duration: '90s', target: 220 },
        { duration: '20s', target: 350 },
        { duration: '90s', target: 350 },
        { duration: '20s', target: 0 },
      ],
      gracefulRampDown: '20s',
    },
  },
};

export default shopJourney;
```

```

---

## Entry 004 | 17:00 17/08/2026

**Tool:** Claude Code (Sonnet 5)
**Task:** M2 — chốt tham số tải cho scenario Spike (Task 1)
**Step:** P-4 (Spike, per-scenario)

### Prompt

```text
Bạn là kỹ sư performance k6 cho EShop. Nếu đang tiếp nối cùng hội thoại với P-1,
dùng thẳng ngữ cảnh đã có; nếu đây là session/fork mới, trước tiên đọc
lib/journey.js và config.js (artifacts/test-plans/) rồi mới làm phần dưới.

Tôi cần chọn tham số tải cho kịch bản Spike test, chạy hàm shopJourney()
trong lib/journey.js.

k6 và backend Node.js/Express (SQLite single-writer) chạy chung trên cùng một máy,
cấu hình phần cứng thật:

- CPU: 11th Gen Intel Core i5-11300H, 4 core / 8 luồng, xung nhịp tối đa 4.40 GHz
- RAM: 15.30 GiB
- OS: Fedora Linux 44, kernel 7.1.5
- k6 v1.0.0, Node.js v24.11.1

Đề xuất cụ thể cho riêng scenario Spike: số VU, ramp-up/ramp-down,
think-time giữa từng bước trong shopJourney(), duration. Giải thích lý do từng con
số bám theo phần cứng thật ở trên — không dùng số tròn mặc định kiểu sách giáo
khoa (ví dụ 50/100/200 VU không có căn cứ).

Bắt buộc cảnh báo rõ: vì k6 và backend chạy chung 8 luồng CPU, nếu VU đề xuất đủ
cao để bản thân k6 (goroutine scheduling, response parsing) tranh CPU với
backend, số đo (latency, throughput) sẽ bị nhiễu bởi chính công cụ đo — nêu rõ
ngưỡng VU mà bạn cho là bắt đầu có rủi ro này trên cấu hình 8 luồng trên.

Nếu là Stress: xác định rõ mức VU dự kiến sẽ vượt điểm gãy (breaking point), dựa
trên SQLite single-writer là nút thắt khả dĩ nhất.
Nếu là Spike: mô tả kiểu tăng đột ngột cụ thể (từ bao nhiêu VU lên bao nhiêu VU,
trong bao lâu, giữ bao lâu, rồi giảm về bao nhiêu).

Định dạng câu trả lời: một bảng thông số (VU, ramp-up, ramp-down, think-time,
duration) rồi đoạn giải thích ngắn bám phần cứng ở trên cho từng dòng trong bảng.
```

### AI Output

```text
## Bảng tham số — Spike Test

| Giai đoạn | VU mục tiêu | Kiểu chuyển | Thời lượng | Think-time |
|---|---|---|---|---|
| 1. Nền (baseline) | 0 → 15 | ramp-up êm | 10s | 0s |
| 2. Giữ nền | 15 | constant | 20s | 0s |
| 3. **SPIKE — tăng đột ngột** | **15 → 200** | **ramp-up dốc đứng** | **5s** | 0s |
| 4. Giữ đỉnh | 200 | constant | 30s | 0s |
| 5. **Rơi đột ngột** | **200 → 15** | **ramp-down dốc đứng** | **5s** | 0s |
| 6. Giữ hồi phục | 15 | constant | 40s | 0s |
| 7. Kết thúc | 15 → 0 | ramp-down êm | 10s | — |
| **Tổng** | | | **~120s (2 phút)** | |

Executor: `ramping-vus` với `stages` đúng 7 dòng trên, dùng chung `shopJourney()`, không đổi logic.

## Giải thích từng dòng, bám phần cứng thật

**VU đỉnh = 200 — không phải số tròn, mà khớp đúng pool tài khoản đã seed.** `journey.js` gán account bằng `ACCOUNTS[__VU % ACCOUNTS.length]`, và `seed_perf.js` seed đúng 200 account (`perf_user_0..199@eshop.test`). Chọn peak = 200 để mỗi VU map vào **đúng một** account riêng biệt, không VU nào trùng token — nếu chọn cao hơn (VD 250), sẽ có VU chia sẻ account với nhau, làm nhiễu việc phân tích write-contention (không phân biệt được là do 200 account thật ghi đồng thời, hay do vài VU đang tranh cùng 1 row user). Đây là ranh giới tự nhiên của chính hệ thống, không phải số sách vở.

**VU nền = 15 — chọn thấp để burst 15→200 đọc rõ như một cú sốc trên đồ thị, không lẫn vào nhiễu.** Tỷ lệ 1:13+ giữa nền và đỉnh đủ dốc để `ts_spike.json` (theo kế hoạch M4 dùng vẽ time-series) cho thấy một bậc thang rõ ràng, không phải một đường ramp mượt.

**Ramp-up 5s (15→200) — đây là cơ chế đặc thù của SUT này, không phải giả định chung chung.** Vì token được cache theo VU (`lib/journey.js:47-58`), **185 VU mới** xuất hiện trong 5 giây đó **mỗi VU gọi `login()` đúng một lần** — tức khoảng 37 lệnh `UPDATE users SET login_attempts=0...` /giây dồn vào SQLite trong đúng cửa sổ 5s này, chồng lên các `INSERT INTO orders` từ 15 VU nền đang chạy. SQLite (rollback-journal, single-writer) serialize toàn bộ ghi này — đây gần như chắc chắn là điểm nhô cao nhất trên đồ thị latency, và nó đến từ **write lock**, không phải CPU. Nên khi phân tích `ts_spike.json`, đỉnh latency đúng lúc t=10s (mốc bắt đầu spike) nên được diễn giải là writer-lock burst trước, CPU contention xét sau.

**Giữ đỉnh 30s — đủ mẫu, không kéo dài vô ích.** Baseline đo thật lúc smoke-test (3 VU, không tải): `iteration_duration` trung bình 16.74ms (`search+cart+checkout`, không tính login đã cache). Dù throughput sụp xuống 1/3-1/2 dưới tải 200 VU, 30s vẫn đủ tích lũy vài trăm iteration để tính percentile có ý nghĩa, mà không kéo run vượt khung thời gian tight của M3.

**Giữ hồi phục 40s (dài hơn giữ đỉnh) — mục đích là đo phục hồi, không phải đo đỉnh lần hai.** Sau khi rơi về 15 VU, câu hỏi là: latency có về lại mức baseline ban đầu (~15-20ms/iteration) hay backend "dính thương" (SQLite WAL/journal chưa flush hết, event loop còn backlog request cũ)? 40s đủ để quan sát đường cong hồi phục có tiệm cận về mức nền hay giữ nguyên ở mức suy giảm.

**Think-time = 0s cho toàn bộ Spike.** Đúng bản chất "spike" — mô phỏng một cú dồn traffic đồng loạt (flash-sale/viral), không phải người dùng duyệt web thong thả. Hiện tại `shopJourney()` **vốn không có `sleep()`** nào giữa các bước, nên với Spike không cần sửa gì — cứ chạy nguyên hàm là đã đúng ý đồ. **Điểm cần lưu ý cho việc ráp 3 script lại:** nếu file Load hoặc Stress (đang thiết kế song song ở fork khác) thêm `sleep()` cố định thẳng vào `journey.js` để mô phỏng người dùng thật, nó sẽ vô tình áp cả lên Spike, làm hỏng đúng đặc tính "dồn dập" này — nên tham số think-time phải đọc từ `__ENV` (VD `THINK_MIN`/`THINK_MAX`, mặc định 0) thay vì hardcode trong hàm dùng chung, để script Spike set `-e THINK_MIN=0 -e THINK_MAX=0` tường minh. Bạn nên đối chiếu với kết quả 2 fork kia trước khi chốt `journey.js` cuối cùng.

## Cảnh báo bắt buộc: ngưỡng tự nhiễu CPU trên máy 8 luồng này

Máy chỉ có **4 core / 8 luồng logic** (i5-11300H), và k6 + backend Node.js chạy chung, không cô lập CPU:

- Backend là Node.js đơn luồng JS (Express callback + marshal SQLite qua `sqlite3` driver) — dưới tải cao, nó thực tế chiếm khoảng **1–1.5 luồng logic** liên tục (libuv thread pool cho I/O phần lớn ở trạng thái chờ, DB 27MB nằm gọn trong page cache nên không nghẽn disk thật).
- k6 (Go runtime, `GOMAXPROCS` mặc định = 8) sẽ dùng toàn bộ luồng còn trống cho goroutine scheduling + parse JSON response. **Điểm đặc thù của chính SUT này:** bước search không nhẹ — keyword `"Laptop"` khớp ~26% trong 2000 sản phẩm đã seed (`KEYWORD_WEIGHTS` trong `seed_perf.js`), tức mỗi lần search trả về ~500 dòng JSON mà k6 phải `res.json()` để lấy `productId` — chi phí parse này nhân theo VU, không phải chi phí bỏ qua được như response `{"message":"..."}` của cart.
- Với ngân sách ~6.5 luồng còn lại sau khi trừ backend, và khuyến nghị chung của Grafana là giữ CPU của k6 dưới ~50–70% năng lực khả dụng để nó không tự trở thành nút thắt, ngân sách an toàn cho riêng k6 trên máy này rơi vào khoảng **3–4 luồng logic**. Với một journey nặng thế này (4 endpoint/iteration, có parse JSON vài trăm dòng), ngân sách đó cạn ở khoảng **VU ≈ 150–200** khi các request gần như không có think-time để giãn ra.

**→ Peak VU = 200 của kịch bản Spike này nằm đúng ngay tại/qua ngưỡng tự nhiễu đó — có chủ đích, không phải sơ suất.** Nghĩa là một phần độ trễ đo được ở giai đoạn giữ đỉnh (30s) sẽ phản ánh chính k6 đang tranh CPU với backend, không thuần là backend chậm. Bắt buộc phải khai báo điều này ở REPORT §2.2 (đúng như rủi ro đã tự ghi trong `EXECUTION_PLAN.md` dòng 562), và nên lọc `htop`/`monitor.sh` theo PID của tiến trình `k6` riêng (không chỉ PID backend) trong cửa sổ giữ đỉnh để tách hai nguồn nhiễu này ra khi viết REPORT.
```

---

## Entry 005 | 17:14 17/08/2026

**Tool:** Claude Code (Sonnet 5)
**Task:** M2 — thresholds + assertion per step cho `shopJourney()` (Task 1)
**Step:** P-5 (thresholds/assertion)

### Prompt

```text
Bạn là kỹ sư performance k6 cho EShop. Nếu đang tiếp nối cùng hội thoại với bước
trước, dùng thẳng ngữ cảnh đã có; nếu đây là session mới, trước tiên đọc
lib/journey.js (artifacts/test-plans/) rồi mới làm phần dưới.

Với shopJourney() trong lib/journey.js (4 bước: login, search, cart, checkout),
viết thresholds và assertion k6 riêng cho ĐỦ CẢ 4
step bằng tag `step:login`, `step:search`, `step:cart`, `step:checkout` — không
được chỉ check status === 200 cho bất kỳ step nào, và không được bỏ sót step nào
trong 4 step trên.

Ràng buộc theo response thật của SUT, bắt buộc bám đúng:

- GET /api/products?search= trả 200 kể cả khi kết quả rỗng ([]) — assertion chỉ
  check status là vô nghĩa cho step này. Assert thêm Array.isArray(body). Vì
  search dùng string interpolation, một query lỗi trả về status 500 với BODY HTML
  (không phải JSON) — assertion/parse phải kiểm tra status trước khi gọi r.json(),
  không được giả định response luôn parse được thành JSON.
- POST /api/cart chỉ trả {"message": "Added to cart"} — không có id hay số lượng
  item trong response, không được assert một field không tồn tại trong response
  thật này.
- POST /api/checkout thành công phải trả về orderId — assertion phải check field
  đó tồn tại, không chỉ check status.

Định dạng câu trả lời: code chèn được trực tiếp vào lib/journey.js (đối tượng
thresholds + các lệnh check() gắn tag theo từng step), có comment ngắn phía trên
mỗi assertion giải thích lý do check field đó (không phải chỉ status).

Trước khi đưa câu trả lời cuối, tự liệt kê: 4 step — mỗi step có ít nhất 1
assertion vượt quá "status === 200" hay không. Nếu step nào chưa có, bổ sung
trước khi trả lời.
```

### AI Output

```text
Tôi sẽ viết thresholds + assertion trực tiếp vào journey.js, đảm bảo cả 4 step đều
có ít nhất 1 assertion vượt quá status === 200, đúng theo hợp đồng response thật
của SUT.

Tự kiểm tra trước khi sửa (theo yêu cầu):
- login: hiện chỉ có status 200 → thiếu, sẽ bổ sung assertion token tồn tại trong body.
- search: hiện chỉ check status 200 trong check(), phần Array.isArray chỉ nằm
  trong logic thường (không phải check() có tag) → sẽ đưa vào check() có tag
  step:search.
- cart: hiện chỉ có status 200 → thiếu, sẽ bổ sung assertion field message.
- checkout: đã có has orderId nhưng chưa gắn tag step:checkout → sẽ thêm tag.

[4 lệnh Edit áp dụng vào lib/journey.js: thêm export const thresholds ở đầu file
(keyed theo checks{step:login|search|cart|checkout}: ['rate>0.99']); bọc mỗi
check() hiện có bằng object nhiều assertion + tham số tags {step: '...'}]

Đã sửa lib/journey.js (syntax hợp lệ, đã node -c pass). Tự kiểm tra lại theo yêu
cầu — cả 4 step đều có assertion vượt quá status === 200:

- step:login: login: status 200 + login: response has token (JWT phải tồn tại
  và là string non-empty).
- step:search: search: status 200 + search: response is JSON array
  (Array.isArray), status luôn được check trước khi gọi r.json() — nhánh
  500/HTML không bao giờ parse.
- step:cart: cart: status 200 + cart: response has expected message (đúng field
  message === "Added to cart", không assert field nào không tồn tại).
- step:checkout: checkout: status 200 + checkout: has orderId (đã có sẵn, chỉ bổ
  sung tag step:checkout).

Thêm export const thresholds ở đầu file, keyed theo checks{step:...} — dùng
chung tag step mà jsonParams/authParams trong config.js đã gắn sẵn cho request,
nên http_req_duration{step:...} và checks{step:...} cùng nhóm theo một tag
thống nhất.

Lưu ý: các file test-plan (Load/Stress/Spike) chưa tồn tại trong thư mục này —
khi tạo, nhớ import { thresholds as journeyThresholds } from './lib/journey.js'
và spread vào options.thresholds thì threshold mới thật sự có hiệu lực khi
chạy k6 run.
```

---

## Entry 006 | 17:17 17/08/2026

**Tool:** Claude Code (Sonnet 5)
**Task:** M2 — sinh 3 test plan k6 (Load/Stress/Spike) + 3 file CSV data-driven qua SharedArray (Task 1)
**Step:** P-6 (CSV/SharedArray + 3 file scenario hoàn chỉnh)

### Prompt

```text
Bạn là kỹ sư performance k6 cho EShop. Nếu đang tiếp nối cùng hội thoại với các
bước trước, dùng thẳng ngữ cảnh đã có; nếu đây là session mới, trước tiên đọc
lib/journey.js (đã gồm thresholds từ P-3), config.js, và các dòng Entry P-2/P-3
trong prompt_log.md (để lấy đúng tham số VU/ramp-up/duration đã chốt cho từng
scenario) rồi mới làm phần dưới.

Sinh 3 file k6 hoàn chỉnh cho Load/Stress/Spike, dùng chung shopJourney()
(lib/journey.js) và options riêng theo tham số đã chốt ở bước trước, cộng
threshold đã chốt ở bước trước đó nữa. Đặt tên file đúng quy ước: 23127216_Load_{{YYYYMMDD}}.js,
23127216_Stress_{{YYYYMMDD}}.js, 23127216_Spike_{{YYYYMMDD}}.js.

Mỗi trong 3 file PHẢI dùng một cơ chế report khác nhau — áp dụng đúng 1 cơ chế
cho MỖI file, không được dùng chung 1 kiểu report cho cả 3 file:

- 23127216_Load_{{YYYYMMDD}}.js: dùng handleSummary() sinh HTML aggregate report
  (1 dòng/endpoint: count, error rate, p50/p90/p95/p99, throughput cho toàn run).
- 23127216_Stress_{{YYYYMMDD}}.js: dùng --out csv= ghi log thô từng request, kèm
  một script hậu xử lý (file riêng) tính lại percentile theo từng giai đoạn tải
  (không đọc percentile có sẵn từ summary) để xác định breaking point rơi vào mức
  VU nào.
- 23127216_Spike_{{YYYYMMDD}}.js: dùng --out json= xuất time-series, để sau đó vẽ
  metric theo thời gian thực và quan sát hành vi phục hồi sau đợt tăng đột ngột.

Data-driven bằng CSV, đọc qua SharedArray trong CẢ 3 file (không đọc CSV riêng
mỗi VU bằng open() hay thư viện ngoài — với VU cao sẽ nhân bản dữ liệu trong RAM).

Dữ liệu CSV PHẢI khớp với dữ liệu đã seed thật trong database, không được bịa số
liệu mới hay đổi định dạng:

- auth_credentials.csv (cột: email, password, valid_flag): pool tài khoản thật là
  perf_user_0@eshop.test đến perf_user_199@eshop.test, mật khẩu chung
  "PerfTest1234!". Dòng valid_flag=true dùng đúng email+password thật này. Dòng
  valid_flag=false PHẢI dùng một email THẬT trong pool trên kèm password SAI —
  tuyệt đối KHÔNG dùng email không tồn tại, vì backend chỉ tăng login_attempts khi
  email tồn tại thật (email lạ trả 401 ngay mà không chạm DB, nên sẽ không bao giờ
  trigger lockout dù chạy bao nhiêu lần).
- read_keywords.csv (cột: keyword, expected_hit_rate): dùng đúng 10 từ khóa đã
  seed sẵn với trọng số thật (trên tổng 2005 sản phẩm): Laptop 30, iPhone 25,
  Samsung 20, Tai nghe 15, Bàn phím 8, Chuột 6, Màn hình 5, Ổ cứng 3, Sạc dự phòng
  2, Webcam 1. Tính expected_hit_rate tỉ lệ theo đúng trọng số này, không tự bịa
  số khác. Thêm ít nhất 1 keyword miss thật (không nằm trong 10 từ trên, ví dụ
  "Máy in") để có case 0 kết quả.
- cart_checkout_payloads.csv (cột: product_id, quantity, total_amount,
  shipping_address): product_id phải nằm trong khoảng 1–2005 (khoảng id thật đã
  seed), không được dùng id ngoài khoảng này.

Sinh dữ liệu mẫu thật cho cả 3 file CSV (ít nhất 20 dòng mỗi file).

Định dạng câu trả lời: liệt kê từng file cần sinh, mỗi file là 1 khối code riêng,
dòng đầu mỗi khối ghi rõ đường dẫn/tên file. Sau khi sinh xong tất cả file, thêm
một mục "Tự kiểm tra" xác nhận rõ ràng: (a) 3 file có dùng 3 cơ chế report khác
nhau đúng như yêu cầu; (b) mọi dòng valid_flag=false trong auth_credentials.csv
dùng email thật trong pool 200 tài khoản; (c) cả 3 file đều dùng SharedArray thật,
không đọc CSV per-VU; (d) product_id trong cart_checkout_payloads.csv nằm trong
1–2005.
```

### AI Output

```text
Đã sinh 9 file:
1. artifacts/test-plans/lib/journey.js (sửa) — shopJourney(overrides = {}) nhận
   thêm keyword/productId/quantity/payload, giữ nguyên hành vi mặc định khi gọi
   không tham số.
2. artifacts/test-plans/lib/csvData.js (mới) — 3 SharedArray (authCredentials,
   readKeywords, cartCheckoutPayloads), tự viết parser CSV có hỗ trợ quoted field
   (shipping_address có dấu phẩy), không dùng thư viện ngoài.
3. artifacts/test-plans/23127216_Load_20260817.js — options theo Entry 002 (80 VU,
   ramp 60s/hold 300s/ramp-down 30s), handleSummary() sinh HTML 1 dòng/step.
4. artifacts/test-plans/23127216_Stress_20260817.js — options theo Entry 003 (5
   stage, 40→120→220→350 VU), report qua --out csv=.
5. artifacts/test-plans/23127216_Spike_20260817.js — options theo Entry 004 (7
   stage, 15→200→15 VU), cộng scenario lockoutProbe (5 VU x 3 iteration, dùng
   auth_credentials.csv valid_flag=false), report qua --out json=.
6. artifacts/scripts/analyze_raw.py (mới) — script Python hậu xử lý cho Stress,
   tự tính percentile theo 5 stage VU từ raw CSV, không đọc số từ summary k6, tự
   xác định breaking point (checkout p95 > 1000ms).
7-9. artifacts/test-data/{auth_credentials,read_keywords,cart_checkout_payloads}.csv
   — 20 dòng/file, dữ liệu thật khớp seed (pool 200 account, 10 keyword có trọng
   số thật + 10 miss keyword, product_id 1-2005 gồm cả 2 biên).

Đã kiểm chứng bằng công cụ (không chỉ tự khai):
- node -c trên cả 5 file .js: pass.
- python3 -m py_compile analyze_raw.py: pass.
- k6 inspect trên cả 3 file scenario: pass (chứng minh SharedArray + đường dẫn CSV
  tương đối load được thật, không chỉ đúng cú pháp).
- wc -l xác nhận cả 3 CSV đúng 20 dòng dữ liệu.

Tự kiểm tra (yêu cầu bắt buộc trong prompt):
(a) 3 cơ chế report khác nhau, đúng 1/file — xác nhận bằng grep: chỉ
    23127216_Load_20260817.js có handleSummary(), 2 file kia không có.
(b) grep -oP trên cột 1+3 của auth_credentials.csv: cả 5 dòng valid_flag=false
    (perf_user_195..199@eshop.test) đều là index 0-199 thật, không có email lạ.
(c) grep "open(" toàn bộ *.js + lib/*.js: chỉ có đúng 1 lệnh open() thật trong
    lib/csvData.js, nằm trong callback của SharedArray — không có open() nào
    trong shopJourney()/spikeJourney()/lockoutProbe().
(d) awk trên cột product_id của cart_checkout_payloads.csv: min=1, max=2005,
    toàn bộ 20 dòng nằm trong [1, 2005].
```

---

## Entry 007 | 18:06 17/08/2026

**Tool:** Claude Code (Sonnet 5)
**Task:** M2 — xử lý edge case (lockout budget, token hết hạn, giỏ hàng không rỗng) cho 3 test plan (Task 1)
**Step:** P-7 (edge case handling)

### Prompt

```text
Tiếp tục vai trò kỹ sư performance k6 ở trên. Bổ sung xử lý các edge case sau vào
CẢ 3 script đã sinh ở bước trước (Load, Stress, Spike) — nêu rõ mỗi thay đổi áp
dụng vào file nào:

1. Sub-scenario cố ý fail login để chứng minh lockout: cần một nhóm VU riêng, số
   lượng nhỏ (~5 VU), CHỈ dùng các dòng valid_flag=false trong
   auth_credentials.csv (email thật trong pool + password sai — nhắc lại lần nữa:
   KHÔNG được dùng email không tồn tại, vì email lạ không làm login_attempts tăng
   nên sẽ không bao giờ trigger được lockout). Sub-scenario này chạy song song
   trong Spike — KHÔNG được rải việc fail login vào toàn bộ traffic chính (traffic
   chính dùng token cache theo VU nên chỉ login 1 lần/VU, không tạo fail nào).
   Response lockout thật là status 403 (KHÔNG phải 429) kèm message tiếng Việt
   "Tài khoản đã bị khóa..." — assertion của sub-scenario này phải check đúng 403,
   không được giả định 429 dù đó là pattern phổ biến hơn ở các API khác.
2. Ngân sách: pool có 200 account, mỗi account cần đúng 2 lần fail liên tiếp để
   bị khóa (login_attempts +2/lần, khóa khi >=3). Tính trước, có công thức rõ
   ràng, để fail rate của sub-scenario này không vượt 5% tổng account (10 account)
   trước khi pool cạn trong suốt thời lượng chạy Spike.
3. Xử lý token hết hạn/expired giữa run dài (soak) — script phải tự phát hiện
   token hết hạn (ví dụ response 401 ở một step lẽ ra không nên fail) và
   login lại, không để cả VU đó fail toàn bộ phần còn lại của run.
4. Không cần cleanup giỏ hàng giữa run trong script (đã có teardown_testbed.sh ở
   cấp session) — chỉ cần script không giả định giỏ hàng rỗng khi bắt đầu.

Định dạng câu trả lời: với mỗi thay đổi, ghi rõ file bị sửa và đoạn code thêm/sửa
tương ứng (không cần in lại toàn bộ file nếu phần không đổi).
```

### AI Output

```text
Cả 3 file vẫn parse/init đúng sau khi sửa. Tóm tắt các thay đổi:

## Edge case 1 & 2 — Sub-scenario lockout + ngân sách 5%

**File: `23127216_Spike_20260817.js`** (Load/Stress **không đổi** — đúng ý đồ, vì `valid_flag=false` chỉ được dùng trong sub-scenario riêng của Spike, không rải vào traffic chính của bất kỳ file nào)

Thêm ngay sau import, tính ngân sách và tự chặn (fail-fast) nếu CSV bị sửa vượt ngưỡng:

```js
import { BASE_URL, ACCOUNTS, jsonParams } from './config.js';
...
const LOCKOUT_BUDGET_ACCOUNTS = Math.floor(ACCOUNTS.length * 0.05); // = 10
const invalidAccountRows = authCredentials.filter((r) => r.valid_flag === 'false');
if (invalidAccountRows.length > LOCKOUT_BUDGET_ACCOUNTS) {
  throw new Error(`lockout-probe budget exceeded: ...`);
}
```

Công thức: pool 200 account × 5% = 10 account là trần; mỗi account chỉ cần đúng 2 lần fail liên tiếp để khóa (server.js:54,56: `+2`/lần, khóa khi `>=3`). CSV hiện có 5 dòng `valid_flag=false` → 2.5%, dưới trần, và có "cầu chì" tự chặn nếu sau này thêm dòng vượt ngưỡng.

`lockoutProbe()` sửa assertion từ "401 hoặc 403" (mơ hồ) thành check đúng theo `__ITER`:

```js
const expectLocked = __ITER >= 2; // 0-indexed: iter 0-1 = wrong password, iter 2 = đã khóa
check(res, {
  [`lockout-probe: iter ${__ITER} returns ${expectLocked ? '403 (locked)' : '401 (wrong password)'}`]:
    (r) => (expectLocked ? r.status === 403 : r.status === 401),
}, { step: 'lockout-probe' });
```

Đã đối chiếu `server.js` thật (dòng 40-44, 54-63): response khóa là **403** kèm message "Tài khoản đã bị khóa..." — không phải 429.

## Edge case 3 — Token hết hạn giữa run dài

**File: `lib/journey.js`** (dùng chung → tự động áp dụng cho cả Load/Stress/Spike, không cần sửa riêng từng file)

Thêm counter quan sát + đổi `token = null` (chỉ null hoá, chờ iteration sau) thành re-login **ngay lập tức trong cùng iteration**, ở cả bước `cart` và `checkout`:

```js
export const tokenExpiredMidRunTotal = new Counter('journey_token_expired_mid_run_total');
...
// trong group('add to cart', ...) và group('checkout', ...):
if (res.status === 401) {
  tokenExpiredMidRunTotal.add(1);
  token = login(); // tự heal ngay, không đợi iteration kế tiếp
}
```

Lý do đổi: nếu chỉ `token = null` ở bước cart, bước checkout ngay sau đó trong **cùng iteration** vẫn dùng token cũ (đã chết) và fail tiếp — lãng phí cả phần còn lại của iteration. Re-login ngay giúp checkout cùng iteration (và mọi iteration sau) phục hồi mà không cần đợi vòng lặp kế.

## Edge case 4 — Không giả định giỏ hàng rỗng

**File: `lib/journey.js`** (dùng chung) — không cần đổi logic (bước cart vốn chỉ `POST` thêm item, chưa từng đọc/giả định số lượng item hiện có), chỉ thêm comment làm rõ đây là quyết định có chủ đích:

```js
group('add to cart', function () {
  // Edge case 4: deliberately NOT reading/validating existing cart state
  // here — userCarts is in-memory, unbounded, per-user (BUG-05-LAM-003),
  // so a real client's cart is never empty by the time a soak run has
  // been going for a while. This step only ever POSTs an addition...
  // Resetting that in-memory state between runs is a session-level
  // concern (teardown_testbed.sh), not this script's job.
  const cartProductId = overrides.productId || productId || 1;
  ...
```

Đã `node -c` + `k6 inspect` lại cả 3 file sau khi sửa — parse/init sạch, không lỗi.
```

---

## Entry 008 | 18:22 18/08/2026

**Tool:** Claude Code (Sonnet 5)
**Task:** M4 — hoàn thiện `BUG_REPORT.md` (Bug Summary + Detailed Findings), quét anomaly toàn bộ raw log, phân loại misinterpretation lockout ở Spike (Task 1 §6, chuẩn bị Task 2)
**Step:** P-8 (bug report: viết đầy đủ finding + anomaly scan + phân loại đúng thiết kế/bug thật)

### Prompt

```text
Vai trò: Bạn là kỹ sư performance testing, nhiệm vụ là đọc dữ liệu k6 thô đã
thu thập cho SUT EShop (bài HW05, workflow login → search → cart → checkout)
và soạn đầy đủ nội dung cho BUG_REPORT.md theo đúng template hiện có trong
file, không đổi cấu trúc heading.

Bối cảnh:
- 4 scenario đã chạy thật và có evidence đầy đủ: Load (80VU), Stress (5 stage,
  0->350VU), Spike (surge 200VU + sub-scenario lockout cố ý dùng sai mật
  khẩu), Soak (80VU, ~10.5 phút).
- 2 finding đã được tham chiếu ở nơi khác nhưng CHƯA viết đầy đủ vào
  BUG_REPORT.md:
  - BUG-05-LAM-003: RSS backend tăng liên tục không có dấu hiệu plateau
    trong suốt soak run (70,768KB -> 216,444KB, +145,676KB / 10.47 phút),
    nghi do mảng `userCarts` trong bộ nhớ không bao giờ được trim.
  - BUG-05-LAM-007: `POST /api/checkout` không đọc từ cart đã tạo ở bước
    trước, mà lấy `total_amount`/`shipping_address` thẳng từ request body,
    nên cart và order bị tách rời về mặt logic.
- Đã xác nhận trước 1 dòng lỗi thật, chưa đưa vào BUG_REPORT.md: trong
  raw_stress.csv có 1 request `POST /api/cart` trả status=0, error
  "read: connection reset by peer", tại stage3 (220VU), timestamp
  1786975623. Dùng làm mẫu định dạng bằng chứng, KHÔNG bỏ qua nếu quét ra
  thêm dòng khác tương tự.

Nguồn dữ liệu (đọc theo đúng thứ tự ưu tiên):
1. homeworks/HW05/README.md - mục "Test Summary" (số liệu tổng đã verify,
   dùng làm nguồn số chính, không tính lại từ đầu).
2. homeworks/HW05/REPORT.md - mục 3.1 (bảng workflow 4 bước, FR tương ứng)
   để biết endpoint group và spec hành vi mong đợi.
3. homeworks/HW05/BUG_REPORT.md - file đích, đọc template hiện tại trước khi
   viết.
4. homeworks/HW05/artifacts/results/raw/monitor_{load,stress,spike,soak}.csv
   - cột timestamp,rss_kb,cpu_pct, dùng để lấy CPU/RSS đúng thời điểm mỗi
   finding.
5. homeworks/HW05/artifacts/results/raw/stress_percentiles_by_stage.json,
   soak_summary.json, spike_console_summary.txt - số liệu đã tổng hợp sẵn.
6. homeworks/HW05/artifacts/results/raw/raw_{load,stress,spike,soak}.csv -
   log thô từng request. CẢNH BÁO: các file này nặng vài trăm MB
   (raw_stress.csv ~200MB, raw_soak.csv ~235MB). KHÔNG đọc trực tiếp toàn bộ
   file vào ngữ cảnh - viết một script Python ngắn (theo đúng cách
   artifacts/scripts/analyze_raw.py đã làm) để lọc: mọi dòng có
   metric_name=http_req_duration và status khác 200, hoặc field error khác
   rỗng, rồi chỉ in ra danh sách rút gọn (timestamp, step, status, error,
   url) - không paste nguyên file.
7. docs/eshop-sut/srs.md - FR-02 (login/lockout), FR-05 (search), FR-07
   (cart), FR-08 (checkout) để biết hành vi đúng theo spec, dùng phân biệt
   "đúng thiết kế" với "bug thật".

Nhiệm vụ, thực hiện tuần tự:
1. Với BUG-05-LAM-003 và BUG-05-LAM-007: viết đầy đủ 2 entry theo đúng
   template BUG_REPORT.md (Load conditions, Steps to reproduce, Expected
   result, Actual result, Evidence với path + dòng cụ thể, Notes). Số liệu
   lấy từ soak_summary.json và REPORT.md mục 3.1, không tính lại.
2. Chạy script lọc mô tả ở nguồn số 6 trên cả 4 file raw log. Với mỗi dòng
   anomaly tìm được (kể cả dòng connection-reset đã biết trước), đối chiếu
   backend CPU/RSS tại đúng timestamp đó bằng monitor CSV tương ứng, rồi
   viết thành 1 entry riêng nếu nó không trùng với 2 bug đã có ở bước 1.
3. Với hành vi login FAIL rate=2.43% ở Spike (checks{step:login} threshold
   breach, 7886/8083 request login fail): phân loại rõ đây là "đúng thiết
   kế" (lockout kích hoạt theo FR-02) hay "bug thật" (vd: VU cứ retry login
   liên tục không có backoff sau khi bị lock, gây tải rác không cần thiết) -
   giải thích căn cứ vào FR-02 và vào tỉ lệ journey_login_failure_total so
   với journey_relogin_total nếu có trong log.
4. Phân loại mỗi finding: functional bug (error response/crash/regression)
   hay performance issue (latency/error rate/resource). Gán severity theo
   mức ảnh hưởng tới business invariant của EShop (ví dụ: đơn hàng tạo sai
   dữ liệu = Critical, memory leak không tự hồi phục = High, 1 request bị
   reset dưới tải đỉnh = Low hoặc Medium - tự giải thích lý do chọn mức).
5. Điền lại toàn bộ bảng "Bug Summary" và từng block "Detailed Findings"
   trong BUG_REPORT.md, đúng cấu trúc heading hiện có, không thêm/bớt mục.
   Cột "GitHub Issue" ghi "Pending - to be filed" cho mọi finding chưa có
   link thật, không bịa link.

Yêu cầu output:
- Trả về đúng nội dung Markdown sẵn sàng dán thay thế phần "Bug Summary" và
  "Detailed Findings" hiện tại của BUG_REPORT.md.
- Cuối cùng, liệt kê riêng: tổng số functional bug, tổng số performance
  issue, và với mỗi finding là path + dòng/field cụ thể đã dùng làm bằng
  chứng (để tôi tự kiểm tra lại theo yêu cầu human review bắt buộc của bài).

Ràng buộc:
- Không bịa số liệu hoặc suy đoán thay dữ liệu thật; mọi con số phải trích
  dẫn được path và dòng/field cụ thể.
- Nếu một finding chưa đủ bằng chứng để khẳng định chắc chắn, ghi rõ "needs
  human verification" thay vì khẳng định sai.
- Không tự sửa code SUT, không tự tạo GitHub Issue thật.
- Không dùng ký tự "§" hoặc em-dash "—" trong nội dung viết ra (dùng
  "section", dấu phẩy, hai chấm) - đúng convention style đã chốt cho các
  deliverable của bài này.
- Toàn bộ nội dung ghi vào BUG_REPORT.md viết bằng tiếng Anh, dù prompt này
  viết tiếng Việt.
```

### AI Output

```text
Đã hoàn tất soạn nội dung Bug Summary và Detailed Findings cho `homeworks/HW05/BUG_REPORT.md`, giữ nguyên cấu trúc heading gốc, và đã commit (`0aa60a8`). Chưa push lên remote vì đây là worktree coursework mà bạn tự quản lý commit/push xuyên suốt các session trước, để bạn tự review rồi push khi sẵn sàng.

## Kết quả phân loại

- **Functional bug: 1** — BUG-05-LAM-007 (Critical)
- **Performance issue: 3** — BUG-05-LAM-003 (High), BUG-05-LAM-008 (Low), BUG-05-LAM-009 (Low)

## Bằng chứng để bạn tự kiểm tra lại (human review bắt buộc)

**BUG-05-LAM-007** (checkout không đọc cart, nhận thẳng `total_amount` từ body, không xóa cart sau checkout):
- `apps/backend/server.js:290-295` (`POST /api/cart` push vào `userCarts`) và `server.js:297-309` (`POST /api/checkout` không hề đụng tới `userCarts`)
- `artifacts/test-plans/lib/journey.js:268-277` (comment xác nhận checkout không đọc cart)
- `artifacts/results/raw/raw_load.csv:76` (cart, ts=1786967987, status=200) và `:247` (checkout, ts=1786967990, status=200)
- `docs/eshop-sut/srs.md` mục FR-08

**BUG-05-LAM-003** (RSS backend tăng liên tục, không plateau):
- `apps/backend/server.js:14` (`const userCarts = {}`, không giới hạn)
- `artifacts/results/raw/monitor_soak.csv:2` (70,768KB) → `:627` (216,444KB)
- `artifacts/results/raw/soak_summary.json` khối `monitor`
- Đối chứng chéo mới: `artifacts/results/raw/monitor_spike.csv:56,73,90,112-117` cho thấy RSS ở Spike cũng nhảy từ ~84MB lên ~230MB và không tụt lại, dù VU đã giảm về 0

**BUG-05-LAM-008** (1 request `POST /api/cart` bị connection reset ở stage3/220VU của Stress):
- `artifacts/results/raw/raw_stress.csv:683720-683728` (dòng `http_req_duration` cụ thể ở `:683721`), timestamp=1786975623, error_code=1220
- `artifacts/results/raw/monitor_stress.csv:284` (14:07:02.833Z, rss_kb=139660, cpu_pct=17.3)
- Đã quét toàn bộ 4 file raw (load/stress/soak/spike) bằng script, load và soak không có anomaly nào ngoài đã biết trước

**BUG-05-LAM-009** (login fail 2.43% ở Spike, phân loại):
- Toàn bộ 7,886 request login fail đều trả về **403 (locked)**, 0 request trả 401 — xác nhận bằng cách quét trực tiếp `raw_spike.csv` (không có trong bất kỳ file tổng hợp có sẵn nào, tôi tự tính trong phiên này)
- `apps/backend/server.js:32-44` cho thấy check `locked_until` chạy trước khi so mật khẩu → 403 chứng minh account đã bị khóa từ trước, không phải do traffic của chính Spike gây ra (vì VU:account là ánh xạ 1:1 ở đỉnh 200VU)
- `artifacts/test-plans/23127216_Spike_20260817.js:31-32` (comment gốc cảnh báo `perf_user_195..199` còn khóa từ lần chạy trước nếu quên chạy `reset_lockout.js`)
- `artifacts/test-plans/lib/journey.js:154-157` (retry mỗi iteration, không backoff)
- Kết luận: cơ chế lockout **đúng thiết kế theo FR-02**; phần đáng ghi nhận là thiếu throttling/`Retry-After` phía server + có thể do quên chạy `reset_lockout.js` trước run này. Số tài khoản bị ảnh hưởng chính xác **cần xác minh thủ công** vì raw log không có field VU/account.
```
