# HW05 — Kế hoạch thực hiện (execution plan)

> Đây là **kế hoạch làm bài**, không phải test plan mà đề yêu cầu nộp.
> Test plan (Load / Stress / Spike) là *deliverable* được sinh ra ở M2 của kế hoạch này.

**Ngày lập:** 2026-08-08 · **Cập nhật:** 2026-08-08 (ràng buộc lịch thật) · **Người thực hiện:** Lê Hoàng Lâm (23127216)
**Deadline:** 07:00 ngày 19/08/2026 · **Effort ước tính:** ~20h (đề ghi 10h, nhưng evidence + video + skill đội lên gấp đôi)

### Ràng buộc lịch (chốt 2026-08-08)

| Ràng buộc | Chi tiết |
| --------- | -------- |
| Deadline HW05 | **07:00 19/08** → thực tế phải xong **tối 18/08**, sáng 19/08 chỉ để nộp |
| Deadline HW04 (song song) | **07:00 12/08** → phải xong **tối 11/08**. HW04 chiếm ưu tiên trong 08–11/08 |
| **Đóng băng 13–15/08** | Không đụng được HW05. Ba ngày này coi như không tồn tại |
| Lớp học chặn | T4 12/08 và T4 19/08: 07:30–17:10 cả ngày. T6 14/08: 13:30–17:10 (rơi vào vùng đóng băng) |

**Hệ quả:** lịch không còn là "4 + 2 liên tục" mà tách thành **hai khối rời nhau bởi một khoảng chết 3 ngày**:

- **Khối A (08–12/08)** — HW04 là chính, HW05 chỉ dùng slot tối. Mục tiêu duy nhất: **de-risk**, đưa M1 + M2 về đích.
- **Khối B (16–18/08)** — 3 ngày trọn cho HW05, chạy M3 → M8.

Khoảng chết làm đổi bản chất kế hoạch: **mọi rủi ro kỹ thuật phải được phát hiện trong khối A**. Nếu bước sang 16/08 mới biết k6 không cài được hoặc seed sai, không còn ngày nào để xoay.

---

## 0. Trạng thái xuất phát

### Đã có

| Hạng mục | Trạng thái |
| -------- | ---------- |
| `REQUIREMENTS.md`, scaffold `README.md` / `REPORT.md` (đủ heading) | xong |
| Chốt 3 endpoint group + pairing scenario | xong |
| Thỏa thuận non-overlap với thành viên còn lại | đã confirm 2026-08-08 |
| Form AI-02 / AI-03 / AI-05, `BUG_REPORT.md`, `prompt_log.md` | scaffold rỗng |
| `ref/Demo` (k6 suite của giảng viên) + `ref/Examples/Group05` (bài mẫu) | có, chỉ để tham chiếu |
| Công cụ trên máy: `htop`, `fastfetch`, `ffmpeg`, `obs`, `jq`, `python3` | có |

### Chưa có / đang sai — phải xử lý ở M1

| # | Vấn đề | Bằng chứng | Tác động |
| - | ------ | ---------- | -------- |
| **P1** | **k6 chưa cài** | `which k6` → không có | Blocking toàn bộ M2–M4 |
| **P2** | **DB gần như rỗng**: 5 products, 2 users, 3 categories | `database.sqlite` | `LIKE '%kw%'` trên 5 dòng không bao giờ lộ bottleneck. Auth-heavy cần pool tài khoản đủ lớn để lockout không giết cả run. **Bắt buộc seed** |
| **P3** | **`POST /api/cart` không chạm DB** — nó `push()` vào object `userCarts` in-memory của process | `server.js:290` | `README.md:73,75` đang mô tả sai ("upserts the quantity on an existing cart row", "does not inflate the schema"). Phải sửa. Đổi lại, đây là **món quà cho phần endurance threshold**: mảng phình vô hạn → memory ceiling đo được thật, không phải đoán |
| **P4** | **Lockout không phải "3 lần fail / 30 giây"** — mỗi lần fail cộng `+2` vào `login_attempts`, khóa khi `>= 3`, thời gian khóa `180000ms = 3 phút` | `server.js:54-58` | Thực tế: **2 lần fail liên tiếp là khóa 3 phút**. `README.md:72` ghi 30s → sai. Thiết kế Spike và thủ tục reset giữa run phải bám số thật |

### Ba giả thuyết kỹ thuật đã cài sẵn (dùng làm "mồi" cho Task 2)

Đọc code trước cho phép dự đoán AI sẽ sai ở đâu — sau đó đối chiếu với raw log để chứng minh.

1. `GET /api/products?search=` dùng **string interpolation trực tiếp** (`server.js:143`) → vừa là SQL injection thật (ghi vào `BUG_REPORT.md`), vừa nghĩa là **không có prepared statement cache**.
2. `database.js` **không tạo index nào**. AI gần như chắc chắn sẽ đề xuất *"add an index on `products.name`"*. Với `LIKE '%kw%'` (leading wildcard) B-tree index **không dùng được** → phân loại **infeasible**, kèm giải thích. Đây là một điểm ăn chắc ở mục 5.3 của REPORT.
3. AI sẽ đề xuất **bật SQLite WAL**. WAL đã bật sẵn (`database.sqlite-wal` tồn tại) → **redundant**, không phải hallucinated. Phân biệt được hai loại này là điểm khác biệt giữa bài 8 và bài 10.

---

## 1. Nguyên tắc điều phối

| Nguyên tắc | Cụ thể |
| ---------- | ------ |
| **Evidence trước, văn trước sau** | Không viết một dòng REPORT nào trước khi có raw log tương ứng. Mọi con số trong REPORT phải trace được về một file trong `artifacts/results/raw/` |
| **AI-first có kỷ luật** | Mỗi test plan được sinh qua **chuỗi ≥ 4 prompt** (mô hình tải → tham số → script → assertion), không phải một prompt tổng. Đề chấm chính điều này |
| **Human review là deliverable** | Mỗi lần AI sai → ghi ngay vào `[AI-02]` với 4 trường: prompt, output, verdict, fix của mình. Ghi lúc phát hiện, không ghi bù cuối kỳ |
| **Commit từng bước** | Đề mục 12: mỗi bước một commit. Dùng skill `commit`. Single-commit = 0 điểm |
| **Đo trước khi kết luận** | "Threshold" chỉ được phát biểu bằng số lấy từ log, không bằng cảm nhận |
| **Không đụng SUT khi đang đo** | Sửa code SUT (nếu có) chỉ để tái tạo bug, và phải revert trước khi chạy run chính thức |

---

## 2. Milestone — ánh xạ theo yêu cầu của đề

| M | Milestone | Yêu cầu đề bám vào | Điểm liên quan |
| - | --------- | ------------------ | -------------- |
| **M1** | Môi trường + seed + baseline | §6 T1 (điều kiện tiên quyết) | gián tiếp 60 |
| **M2** | Thiết kế test plan bằng AI + human review | §6 T1 (design, data-driven, naming, review) | 60 |
| **M3** | Chạy 3 scenario + thu evidence | §6 T1 (run, resource, report views) | 60 |
| **M4** | Soak + endurance threshold + bug report | §6 T1 (threshold), §6 T1 (issues) | trong 60 |
| **M5** | AI analysis + misinterpretation hunt | §6 T2 | 10 |
| **M6** | Continuous Performance Testing proposal | §6 T3 | 10 |
| **M7** | Agent Skill + demo skill | §7 | 10 |
| **M8** | Video demo + REPORT + AI forms + đóng gói | §6 T1 (video), §9, §10, §14 | gate cho toàn bộ |

> M8 là **gate**: thiếu bất kỳ tài liệu bắt buộc nào → 0 điểm (§17). Không phải hạng mục "nếu còn thời gian".

---

## 3. Lịch hai khối

Bám `context/workflow/schedule.md`: sáng = deep work, chiều = shallow, tối = light.

### Khối A — 08/08 → 12/08 · HW04 là chính, HW05 chỉ chiếm slot tối (~8h)

Nguyên tắc phân chia: **HW04 lấy deep + shallow block, HW05 lấy evening block.** Việc HW05 trong khối A (cài công cụ, seed, drive AI sinh script) đều là task hợp với buổi tối theo energy profile — không cần deep focus liên tục.

| Ngày | Thứ | Slot | Nội dung HW05 | HW04 |
| ---- | --- | ---- | ------------- | ---- |
| 08/08 | T7 | tối 19:30–21:30 | **M1a** — cài k6 + verify + viết `seed_perf.js`, seed DB | sáng + chiều |
| 09/08 | CN | tối | **M1b** — `reset_lockout.js`, `monitor.sh`, smoke 3 endpoint, hardware report, sửa P1–P4 | cả ngày (CN là free day nhưng deadline ép) |
| 10/08 | T2 | tối | **M2a** — chuỗi prompt P-1→P-3 cho cả 3 scenario | sáng + chiều |
| 11/08 | T3 | tối | **để trống** — dự phòng cho HW04 (nộp trước 07:00 12/08) | cả ngày, finalize + nộp |
| 12/08 | T4 | tối | **M2b** — sinh script + 3 CSV + human review + commit | HW04 đã nộp |

> 11/08 cố tình để trống. HW04 hiện mới có `TEST_PLAN.md` + `test-results/`, **chưa có REPORT / README / AI forms, và toàn bộ còn untracked trong git**. Khối lượng còn lại của HW04 lớn hơn vẻ ngoài — đừng lấn slot đó cho HW05.

**Gate bắt buộc trước khi đóng băng (hết 12/08):**

- [ ] `k6 version` chạy được, hoặc đã chuyển sang JMeter và biết rõ mình dùng gì
- [ ] DB đã seed, `seed_report.txt` ghi số dòng thật
- [ ] **Một smoke run k6 thật (2 phút, 5 VU) đã chạy trót lọt và sinh ra raw CSV + HTML report** — không chỉ cài xong công cụ
- [ ] 3 test plan + 3 CSV đã tồn tại và chạy được, dù tham số còn thô
- [ ] `reset_lockout.js` đưa DB về sạch được

Gate này là điểm quan trọng nhất của cả kế hoạch. **Không tick đủ 5 dòng thì đừng bước vào 13/08** — hãy dồn nốt vào tối 12/08, kể cả phải cắt chất lượng M2 xuống mức "chạy được là đủ, tinh chỉnh sau".

### Đóng băng — 13/08 → 15/08

Không đụng HW05. Không lên lịch gì, không coi đây là buffer ngầm.

### Khối B — 16/08 → 18/08 · toàn thời gian cho HW05 (~18h)

| Ngày | Thứ | Slot | Milestone | Nội dung |
| ---- | --- | ---- | --------- | -------- |
| 16/08 | CN | sáng (deep) | **M2c + M3** | Tinh chỉnh tham số test plan sau 3 ngày nghỉ (đọc lại, chạy thử 1 run ngắn), rồi chạy **Load** + **Stress** |
| | | chiều | **M3** | Chạy **Spike**, xử lý lockout giữa run, sinh 3 report view |
| | | tối | **M3** | Kiểm tra evidence: raw CSV không rỗng, HTML mở được, screenshot đúng chuẩn "cùng khung hình" |
| 17/08 | T2 | sáng (deep) | **M4** | Soak 15 phút → chốt threshold bằng số, memory ceiling từ đường RSS |
| | | chiều | **M4** | `BUG_REPORT.md`, mở GitHub Issues, screenshot |
| | | tối | **M5a** | Vòng AI: đưa raw log cho AI, lưu nguyên văn output |
| 18/08 | T3 | sáng (deep) | **M5b + M6** | Misinterpretation hunt (đối chiếu từng số với raw log) → CPT proposal + flow chart |
| | | chiều | **M7 + M8a** | Agent Skill + viết REPORT hoàn chỉnh, điền README |
| | | tối | **M8b** | Dựng + lồng tiếng video, AI forms, AI Critique, PDF, commit log, **đóng zip** |
| 19/08 | T4 | trước 07:00 | — | **Chỉ nộp.** Class bắt đầu 07:30 — không có chỗ cho việc phát sinh |

**Đường găng khối B:** M3 → M4 → M5. M6 và M7 độc lập, cắt được nếu cháy giờ.

**Quy tắc quay video:** quay ngay trong lúc chạy run thật ở M3 (16/08), tối 18/08 chỉ dựng + lồng tiếng. Quay lại từ đầu vào 18/08 là kịch bản không có đường lui.

### Phương án nén nếu trượt lịch

Cắt theo thứ tự này, dừng lại ngay khi đủ giờ:

| Ưu tiên cắt | Hạng mục | Mất | Vì sao cắt trước |
| ----------- | -------- | --- | ---------------- |
| 1 | **M7 Agent Skill** (chỉ nộp `SKILL.md` + template, bỏ video skill) | tối đa 10đ | Là hạng mục duy nhất "được khuyến khích" chứ không bắt buộc |
| 2 | **M6 CPT proposal** rút gọn — giữ flow chart + 4 trade-off chính, bỏ phần baseline store | vài điểm trong 10đ | Là phần viết, không cần chạy máy |
| 3 | Soak rút xuống **10 phút** (mốc tối thiểu đề cho phép) | ~0 | Đề cho khoảng 10–15 phút |
| **Không bao giờ cắt** | M8 — REPORT, README, AI forms, video chính, zip | **0 điểm toàn bài** | §17: thiếu tài liệu bắt buộc = 0 |

---

## 4. Chi tiết từng milestone

### M1 — Môi trường, seed, baseline (tối 08/08 + 09/08, ~4h)

**Mục tiêu:** có một môi trường đo được, lặp lại được, và reset được về trạng thái sạch trong dưới 30 giây.

| # | Việc | Đầu ra |
| - | ---- | ------ |
| 1.1 | Cài k6: `sudo dnf install k6` (hoặc repo Grafana). Verify `k6 version` | version ghi vào `README.md` §Hardware |
| 1.2 | Viết `artifacts/scripts/seed_perf.js`: seed **2.000 products** (tên có phân phối keyword thật, không random uuid), **200 users** password đã biết, **3.000 orders** cho `GET /api/admin/orders` của bạn cùng nhóm khỏi lệch | script + `seed_report.txt` ghi số dòng thực tế |
| 1.2b | Viết `artifacts/scripts/setup_testbed.sh` + `teardown_testbed.sh`: **test bed setup/teardown** đúng chuẩn (ISTQB ch.2) — `setup` reset DB về baseline sạch bằng `RESET_DB=1`, snapshot baseline đó ra `database.sqlite.baseline`, rồi mới chạy `seed_perf.js` chồng data test lên; `teardown` khôi phục DB từ snapshot đó, trả app về đúng trạng thái trước khi test, không để dữ liệu perf rò rỉ vào git hay vào lần seed sau. Cả hai từ chối chạy nếu backend đang giữ khóa file DB | 2 script + `.gitignore` chặn `*.sqlite.baseline` |
| 1.3 | Viết `artifacts/scripts/reset_lockout.js`: `UPDATE users SET login_attempts=0, locked_until=NULL`. Thủ tục reset **giữa các run trong cùng một session** (khác với teardown — teardown chỉ chạy **cuối session**) mà đề §6 bắt document | script + đoạn mô tả cho REPORT §4.7 |
| 1.4 | Viết `artifacts/scripts/monitor.sh`: sample `ps -o rss=,pcpu= -p <backend_pid>` mỗi 1s → CSV. Đây là bằng chứng định lượng **bổ sung** cho screenshot htop, không thay thế | `monitor.sh` + format CSV |
| 1.5 | Smoke test 3 endpoint bằng `curl`: xác nhận response shape, status code, và đo latency baseline khi 1 VU | `artifacts/results/raw/baseline_smoke.txt` |
| 1.6 | Hardware report: `fastfetch` screenshot (thay `dxdiag`/`screenfetch`) + bảng spec. Xử lý vấn đề hostname theo §4-bis bên dưới | `assets/screenshots/hardware/` + bảng trong README |
| 1.7 | Sửa 4 sai lệch P1–P4 trong `README.md` và `REPORT.md` | commit riêng: `fix(HW05): correct cart and lockout behaviour from SUT source` |

**Definition of done:** chạy được `k6 run --vus 1 --duration 10s` trúng cả 3 endpoint, exit code 0, và `reset_lockout.js` đưa DB về sạch.

**Rủi ro:** k6 không có trong repo Fedora chính thức → fallback: tải binary từ GitHub release, hoặc `go install`. Đừng để mất quá 20 phút; nếu quá → chuyển sang JMeter (mất bonus nhưng không mất bài).

---

### M2 — Thiết kế test plan bằng AI + human review (tối 10/08 + 12/08, tinh chỉnh sáng 16/08, ~4h)

**Mục tiêu:** 3 test plan đúng chuẩn tên, data-driven bằng 3 CSV riêng, và **một bản ghi trung thực** về việc AI sai chỗ nào.

**Quy trình bắt buộc — chuỗi prompt, không phải one-shot.** Với *mỗi* scenario chạy đúng 5 bước, log toàn bộ vào `prompt_log.md`:

| Bước | Prompt hỏi AI cái gì | Mình review cái gì |
| ---- | -------------------- | ------------------ |
| **P-1** | Mô tả endpoint + đặc tính (SQL, auth, state). Hỏi: mô hình tải nào phù hợp và vì sao | AI có bắt được `LIKE '%x%'` không dùng index không? có bắt được cart in-memory không? |
| **P-2** | Hỏi tham số cụ thể: VU, ramp-up, think-time, duration, và **lý do từng con số** | Con số có bám hardware thật không, hay là số tròn kiểu sách giáo khoa (100 VU, 10s ramp)? |
| **P-3** | Hỏi thresholds + assertion (không chỉ status 200 — phải assert body) | AI thường chỉ assert `status === 200`. Endpoint search trả `[]` cũng là 200 → assertion vô nghĩa |
| **P-4** | Yêu cầu sinh script k6 + schema CSV | Có dùng `SharedArray` không? Đọc CSV mỗi VU sẽ nổ RAM |
| **P-5** | Yêu cầu xử lý edge case: lockout, token expiry, cleanup | Đây là chỗ AI hay bỏ sót nhất — đề nêu đích danh "missing account-lockout handling" |

**Deliverable:**

| File | Nội dung |
| ---- | -------- |
| `artifacts/test-plans/23127216_Load_20260808.js` | Transactional — `POST /api/cart` |
| `artifacts/test-plans/23127216_Stress_20260808.js` | Read-heavy — `GET /api/products?search=` |
| `artifacts/test-plans/23127216_Spike_20260808.js` | Auth-heavy — `POST /api/login` |
| `artifacts/test-plans/23127216_Soak_20260808.js` | Endurance (không nằm trong 3 plan bắt buộc nhưng đề §6 yêu cầu chạy) |
| `artifacts/test-data/cart_payloads.csv` | product_id, quantity, user_token_index |
| `artifacts/test-data/read_keywords.csv` | keyword có phân phối hit-rate khác nhau (hit nhiều / hit ít / miss) |
| `artifacts/test-data/auth_credentials.csv` | email, password, valid_flag — **cột `valid_flag` là chìa khóa điều khiển tỉ lệ fail** để lockout xảy ra có kiểm soát |

**Điểm thiết kế phải tự quyết, AI sẽ không tự nghĩ ra:**

- **Spike + lockout:** với `+2/fail` và khóa 180s, nếu để 20% request dùng sai password thì sau ~10 giây toàn bộ pool 200 tài khoản bị khóa và phần còn lại của run chỉ đo tốc độ trả 403. → Chốt tỉ lệ fail **thấp (≤5%)** và pool tài khoản **≥ 200**, tính trước ngân sách fail: `200 accounts × 1 fail = 200 fail request` trước khi pool cạn.
- **Load trên cart:** vì cart là in-memory, run càng dài RSS càng tăng → **đây là biến quan sát chính**, không phải nhiễu. Phải log RSS song song từ giây đầu.
- **Stress trên search:** keyword phải có độ chọn lọc khác nhau, nếu không mọi request đều full-scan giống nhau và đường cong breaking point sẽ phẳng bất thường.

**Human review ghi vào đâu:** `REPORT.md` §4.5 + `[AI-02]_AI_Audit_Report.md`. Mỗi lỗi ghi 3 phần: *AI đưa gì → sai ở đâu (dẫn chứng code/log) → vì sao AI sai (prompt kém / model không có context SUT / đặc tính endpoint)*. Đề chấm cả phần "vì sao".

**Skill / công cụ:** skill `commit` sau mỗi test plan. Hook `prompt-capture.js` đã bật → dùng transcript để dựng `prompt_log.md` thay vì chép tay.

---

### M3 — Chạy 3 scenario + evidence (16/08 cả ngày, ~6h)

**Mục tiêu:** 3 run hoàn chỉnh, mỗi run có raw log + HTML report + screenshot htop **cùng khung hình** + đoạn video.

**Thủ tục chuẩn cho mỗi run (lặp 3 lần):**

```
0. (đầu session, chạy 1 lần) setup_testbed.sh  — baseline sạch + seed perf data
1. reset_lockout.js + restart backend  (xóa userCarts in-memory)
2. Mở layout 2 pane: trái = terminal k6, phải = htop lọc theo PID backend
3. Bật OBS ghi màn hình  (ghi luôn ở đây, không quay lại sau — tiết kiệm 1 buổi)
4. Bật monitor.sh  → CSV
5. k6 run --out csv=raw_<scenario>.csv --out json=ts_<scenario>.json <plan>.js
6. Chụp screenshot đỉnh tải (k6 + htop trong 1 khung)
7. Dừng monitor, sinh HTML report từ handleSummary()
8. commit
9. (cuối session, sau scenario cuối cùng) dừng backend → teardown_testbed.sh — trả DB về baseline gốc
```

> Bước 0 và 9 chạy **một lần cho cả session** (không lặp lại mỗi scenario) — `setup_testbed.sh` mở test bed, `teardown_testbed.sh` đóng nó lại. Bước 1 (`reset_lockout.js`) là reset **trong session**, giữa các run, không thay thế bước 9.

**Ba report view — mỗi scenario một loại, không lặp** (đã chốt ở README):

| Scenario | View | Cách tạo |
| -------- | ---- | -------- |
| Load | Aggregate HTML summary | `handleSummary()` → 1 dòng/endpoint: count, error rate, p50/p90/p95/p99, throughput |
| Stress | Percentile **tính lại từ raw log**, group theo stage VU | script python đọc `raw_stress.csv`, tự tính percentile — **không đọc số từ summary của k6**. Đây là điểm phân biệt: chứng minh mình đọc được raw |
| Spike | Time-series | từ `ts_spike.json` vẽ latency + error rate theo trục thời gian, đánh dấu cửa sổ lockout 180s |

> §14 vẫn bắt raw log + HTML report cho **cả ba**. Bảng trên chỉ nói mỗi run được *phân tích* qua view nào. Vẫn sinh đủ raw + HTML cho cả ba.

**Definition of done:** 3 thư mục trong `artifacts/results/`, mỗi thư mục có raw CSV không rỗng, HTML mở được, ≥1 screenshot đúng chuẩn "cùng khung hình".

**Rủi ro:** load generator và SUT chạy chung một máy → k6 tranh CPU với backend, làm p95 bị thổi phồng. **Không né được**, nhưng phải *khai báo* ở REPORT §2.2 và đo mức tiêu thụ CPU của chính k6 để định lượng nhiễu. TA đánh giá cao việc thừa nhận này hơn là giấu.

---

### M4 — Soak + endurance threshold + bug report (17/08 sáng + chiều, ~4h)

**Mục tiêu:** một con số threshold có thể bảo vệ được trong oral defense.

| # | Việc | Đầu ra |
| - | ---- | ------ |
| 4.1 | Chạy soak 15 phút ở mức tải ổn định (chọn từ đường cong Stress: mức VU ngay trước điểm gãy) | `raw_soak.csv`, `monitor_soak.csv` |
| 4.2 | Chốt các số: **max stable RPS**, **VU tại điểm error rate vượt 1%**, **p95 tại trần ổn định**, **RSS ceiling**, **CPU tại trần** | bảng README §Endurance Threshold |
| 4.3 | Vẽ RSS theo thời gian cho run cart — nếu đường thẳng dốc lên không bão hòa thì đó là **memory leak được chứng minh**, không phải suy đoán | biểu đồ + issue |
| 4.4 | Mở GitHub Issues cho từng bug thật, screenshot | `BUG_REPORT.md` + `assets/screenshots/issues/` |

**Danh sách bug ứng viên đã nhìn thấy từ code** (còn phải reproduce mới được ghi):

| ID | Bug | Nguồn |
| -- | --- | ----- |
| BUG-05-LAM-001 | SQL injection ở `GET /api/products?search=` — nội suy chuỗi trực tiếp | `server.js:143` |
| BUG-05-LAM-002 | Lockout cộng `+2` mỗi lần fail → khóa sau **2** lần fail, không phải 3 như SRS | `server.js:54` |
| BUG-05-LAM-003 | Giỏ hàng lưu in-memory, `push()` không giới hạn → RSS tăng tuyến tính, mất sạch khi restart | `server.js:290` |
| BUG-05-LAM-004 | `POST /api/cart` không validate payload — nhận bất kỳ JSON nào | `server.js:290` |
| BUG-05-LAM-005 | Lỗi DB ở nhánh search trả **HTML** trong API JSON | `server.js:147` |
| BUG-05-LAM-006 | `/api/login` trả nguyên object `user` gồm cả password | `server.js:52` |

> §6 nói bug chức năng thật mới tính; performance issue là khuyến khích. 6 bug này đều là bug chức năng/bảo mật thật → giá trị cao hơn "p95 cao".

---

### M5 — AI analysis + misinterpretation hunt (17/08 tối + 18/08 sáng, ~3.5h)

**Quy trình 3 vòng:**

1. **Vòng AI (không can thiệp):** đưa raw CSV cho AI, yêu cầu (a) phân tích, (b) đề xuất threshold, (c) đề xuất tối ưu. Lưu **nguyên văn** output — đây là vật chứng, sửa là mất điểm.
2. **Vòng đối chiếu:** với mỗi con số AI nêu, chạy script tính lại từ raw log. Lập bảng `AI nói | Giá trị đúng từ raw | Sai ở đâu | Vì sao AI sai`.
3. **Vòng phân loại đề xuất:** mỗi optimization → **feasible / redundant / hallucinated** + lý do kỹ thuật.

**Những chỗ AI gần như chắc chắn sẽ trượt** (kiểm chứng, đừng giả định sẵn):

- Đọc `avg` thay `p95` rồi kết luận "hiệu năng tốt" — trong khi phân phối lệch phải.
- Coi `http_req_duration` là latency server, quên rằng nó gồm cả thời gian chờ khi k6 bị đói CPU.
- Tính error rate trên tổng request thay vì theo stage → làm loãng đúng cái đoạn gãy.
- Đề xuất **index trên `products.name`** → infeasible với `LIKE '%kw%'` (leading wildcard vô hiệu B-tree).
- Đề xuất **bật WAL** → redundant, đã bật rồi (`database.sqlite-wal` tồn tại).
- Đề xuất **connection pool** → sai loại: `sqlite3` node là file-based single-writer, "pool" không giải quyết được write serialization.

**Định dạng đầu ra:** `REPORT.md` §5.1 / §5.2 / §5.3. Mỗi misinterpretation **bắt buộc** trích số đúng từ raw log — §6 T2 ghi rõ.

---

### M6 — Continuous Performance Testing proposal (18/08 sáng muộn, ~2h)

**Mục tiêu:** trả lời được ba câu: *khi nào chạy*, *chạy cái gì*, *khi nào chặn merge*.

Cấu trúc đề xuất cho §6 của REPORT:

| Phần | Nội dung |
| ---- | -------- |
| Trigger | Không chạy mọi commit. Chỉ chạy khi diff chạm path nhạy cảm (`server.js` route handler, `database.js`, migration) — dùng path filter. Cộng thêm một run nightly full |
| Tầng test | 3 tầng: **smoke gate** 30s mỗi PR → **load gate** 5 phút khi chạm path nhạy cảm → **soak** nightly |
| Baseline | Lưu p95 theo commit vào một store. So sánh **với rolling median 7 ngày**, không so với một con số cứng — số cứng sẽ hỏng ngay khi đổi runner |
| Quy tắc chặn | Chặn khi p95 tăng > 20% so với baseline **và** lặp lại ở lần chạy xác nhận thứ hai. Một lần vượt ngưỡng đơn lẻ chỉ cảnh báo, không chặn |
| Flow chart | Mermaid trong REPORT §6.2 (commit → path filter → tầng test → so baseline → chặn/cảnh báo/pass) |
| Trade-offs | Chi phí runner vs độ phủ · false alarm do nhiễu runner chia sẻ vs chạy trên máy vật lý riêng · độ trễ PR vs độ tin cậy tín hiệu · chi phí bảo trì baseline khi SUT đổi |

Phần trade-off là chỗ ăn điểm G9.6 — phải nêu được **cost of false alarm** (dev mất niềm tin vào gate → tắt gate → gate vô dụng), không chỉ nêu "tốn tiền".

---

### M7 — Agent Skill (18/08 chiều, ~2h)

**Skill đề xuất:** `.agents/skills/perf-k6-runner/` (symlink sang `.claude/skills/`, theo đúng convention của repo).

**Skill làm gì:** nhận một endpoint spec, chạy trọn vòng — seed → sinh test plan k6 + CSV → chạy → thu resource → parse raw log → sinh 3 report view → dựng bảng số cho REPORT.

```
.agents/skills/perf-k6-runner/
├── SKILL.md              # trigger, quy trình 7 bước, khuôn prompt cho từng bước
├── templates/
│   ├── plan-load.js.tmpl
│   ├── plan-stress.js.tmpl
│   └── plan-spike.js.tmpl
└── scripts/
    ├── monitor.sh        # sample RSS/CPU của PID backend
    └── analyze_raw.py    # tính lại percentile từ raw CSV, xuất 3 view
```

**Điểm cần có trong `SKILL.md` để ăn đủ 10 điểm:** nó phải mã hóa được **chuỗi prompt 5 bước ở M2**, không chỉ là wrapper gọi `k6 run`. Giá trị của skill nằm ở phương pháp, không ở lệnh chạy.

**Demo video riêng:** chạy skill end-to-end trên **một endpoint group hoàn chỉnh** (§7 bắt buộc). Đề xuất chọn read-heavy vì nhanh nhất và không cần reset lockout.

---

### M8 — Video, REPORT, đóng gói (18/08 chiều + tối, ~5h)

| # | Việc | Ràng buộc từ đề |
| - | ---- | --------------- |
| 8.1 | Video chính ≥ **6 phút**, có thể chia 3 clip theo scenario | §6: tool + resource monitor **cùng khung hình**, tự lồng tiếng Việt. Unlisted YouTube |
| 8.2 | Video skill, end-to-end 1 endpoint group | §7 |
| 8.3 | Viết `REPORT.md` đầy đủ theo scaffold có sẵn | §14 |
| 8.4 | Điền `README.md`: bảng test summary, threshold có số, số bug, link video, self-assessment | §14 |
| 8.5 | `[AI-02]` / `[AI-03]` / `[AI-05]` + **AI Critique 200–300 từ** | §9, §10 — đếm từ, dưới/quá đều bị trừ |
| 8.6 | `git log > assets/commit-log.txt` | §12 |
| 8.7 | Export PDF: REPORT + AI Audit | §14 bắt "Markdown + PDF" |
| 8.8 | Đóng zip `23127216_HW05_AI_Performance_<grade>.zip` | §14, grade là 3 chữ số |
| 8.9 | Chạy checklist §14 trong `README.md` — tick từng dòng | §17: thiếu tài liệu = 0 |

**Kịch bản video (viết trước ở tối 12/08, quay ngay khi chạy run thật 16/08, dựng + lồng tiếng tối 18/08):** intro 30s (SUT, tool, hardware) → Load 100s → Stress 120s → Spike 120s → threshold + kết luận 60s. Tổng ~7 phút, dư biên so với mốc 6 phút.

---

## 4-bis. Xử lý §11: hostname không có baseline để đối chiếu

**Tình huống.** §11 viết: *"the hardware report, whose hostname matches your previous homework deployments"*. Nhưng HW01–HW04 **không yêu cầu hardware report**, nên không tồn tại bản khai hostname nào từ trước để đối chiếu. Điều kiện của §11 không có gì để so.

**Đây không phải lỗi, nhưng im lặng thì bất lợi.** TA đọc §11 sẽ đi tìm baseline; không thấy gì mà báo cáo cũng không nói gì thì khoảng trống đó tự nó thành nghi vấn.

**Cách xử lý — khai báo chủ động, rồi thay baseline bằng tính nhất quán nội tại:**

1. **Một đoạn ghi chú trong `REPORT.md` §2.1**, đại ý: máy dùng cho HW05 là `FedoraOS`; HW01–HW04 không yêu cầu hardware report nên không có bản khai hostname trước đó để đối chiếu; đây là lần khai báo đầu tiên và sẽ là baseline cho các bài sau.
2. **Rải cùng một hostname qua nhiều artifact độc lập** — đây mới là bằng chứng thật, mạnh hơn một dòng cam kết:
   - `fastfetch` screenshot → hiện hostname
   - shell prompt trong **mọi** screenshot terminal chạy k6 → hiện hostname
   - `htop` header → hiện hostname
   - **video demo** → hostname xuất hiện trong prompt suốt cả clip
   - dòng `hostname` in ở đầu mỗi file trong `artifacts/results/raw/`

   Năm nguồn được sinh ra ở năm thời điểm khác nhau mà cùng một hostname thì không dựng lại được sau. Đó chính là thứ §11 muốn có.
3. **Thêm một trường `Hostname` vào bảng Hardware trong `README.md`** kèm chú thích một dòng về việc không có baseline trước.

Chi phí: ~15 phút. Đổi lại là gỡ hẳn một điểm nghi vấn anti-cheat.

---

## 5. Ma trận truy vết — yêu cầu → deliverable → milestone

| Yêu cầu (§) | Deliverable | M |
| ----------- | ----------- | - |
| §6 T1 design bằng AI, từng bước | `prompt_log.md`, `[AI-02]` | M2 |
| §6 T1 data-driven, mỗi group một CSV | 3 file trong `artifacts/test-data/` | M2 |
| §6 T1 ba report view khác nhau | 3 view trong `artifacts/results/` | M3 |
| §6 T1 naming `{ID}_{Type}_{YYYYMMDD}` | 4 file trong `artifacts/test-plans/` | M2 |
| §6 T1 human review | REPORT §4.5 | M2 |
| §6 T1 run + resource + hardware | screenshots, raw log, HTML report | M1, M3 |
| §6 T1 lockout reset giữa run | `reset_lockout.js` + REPORT §4.7 | M1, M3 |
| Test bed setup/teardown (vệ sinh môi trường, không rò dữ liệu perf) | `setup_testbed.sh` + `teardown_testbed.sh` + REPORT §4.7 | M1, M3 |
| §6 T1 endurance threshold | README bảng threshold, REPORT §4.8 | M4 |
| §6 T1 video ≥6 phút | link YouTube unlisted | M8 |
| §6 T1 report issues | `BUG_REPORT.md` + GitHub Issues | M4 |
| §6 T2 AI analysis | REPORT §5.1 | M5 |
| §6 T2 misinterpretation + số đúng từ raw | REPORT §5.2 | M5 |
| §6 T2 phân loại optimization | REPORT §5.3 | M5 |
| §6 T3 CPT + flow chart + trade-offs | REPORT §6 | M6 |
| §7 Agent Skill + video | `.agents/skills/perf-k6-runner/` | M7 |
| §9 AI Audit Report | `[AI-02]`, `[AI-03]`, `[AI-05]` | liên tục, chốt M8 |
| §10 AI Critique 200–300 từ | REPORT §8 | M8 |
| §11 anti-cheat: filename, raw log, video, hostname | — | M1, M8 |
| §12 commit log | `assets/commit-log.txt` | liên tục, xuất M8 |
| §14 đóng gói | zip | M8 |

---

## 6. Rủi ro và phương án

| Rủi ro | Xác suất | Tác động | Phương án |
| ------ | -------- | -------- | --------- |
| k6 cài không được trên Fedora | thấp | cao | Timebox 20 phút → chuyển JMeter, mất bonus nhưng giữ nguyên cấu trúc bài |
| Load generator tranh CPU với SUT làm sai số | **cao** | trung bình | Không né được trên 1 máy. Khai báo ở REPORT §2.2 + đo CPU của k6 để định lượng nhiễu. Giới hạn VU ở mức k6 dùng < 30% CPU |
| Pool tài khoản cạn vì lockout giữa run Spike | trung bình | cao | Pool ≥ 200 account, fail rate ≤ 5%, tính trước ngân sách fail. `reset_lockout.js` chạy giữa các lần lặp |
| Soak 15 phút làm RSS cart phình đến mức OOM | trung bình | thấp | Đây là *kết quả*, không phải sự cố. Ghi lại RSS tại thời điểm gãy — chính là memory ceiling đề hỏi |
| Video quay lại nhiều lần → mất trọn D5 | trung bình | cao | Quay ngay trong lúc chạy run thật ở M3, D5 chỉ dựng + lồng tiếng. Viết script narration từ tối T4 |
| Ghi AI audit dồn vào cuối, không nhớ prompt | **cao** | cao | Ghi ngay lúc phát hiện. Hook `prompt-capture.js` đã bật — dựng `prompt_log.md` từ transcript |
| §11 không có baseline hostname để đối chiếu | **chắc chắn** | trung bình | Xử lý theo §4-bis: khai báo chủ động + rải hostname qua 5 artifact độc lập |
| **HW04 tràn sang khối B** | trung bình | **rất cao** | HW04 hiện chưa có REPORT/README/AI forms và chưa commit gì. Nếu 11/08 chưa xong → **nộp HW04 ở mức đủ tài liệu, không cầu toàn**. Tràn sang 16–18/08 sẽ giết HW05 vì không còn ngày đệm |
| **Mất ngữ cảnh sau 3 ngày đóng băng** | **cao** | trung bình | Cuối 12/08 viết một file `HANDOFF.md` ngắn: đang ở đâu, lệnh nào chạy tiếp, số nào đã có. Sáng 16/08 đọc nó thay vì đọc lại cả kế hoạch |
| **Phát hiện lỗi kỹ thuật vào 16/08** (k6 hỏng, seed sai, plan không chạy) | trung bình | **rất cao** | Gate 5 dòng cuối khối A tồn tại chính vì rủi ro này. Smoke run thật ở khối A là bắt buộc, không phải tùy chọn |
| Cháy giờ ngày 18/08 | **cao** | cao | Áp bảng cắt ở §3. Quyết định cắt **trước 15:00 ngày 18/08**, không để đến tối mới nhận ra |

---

## 7. Việc cần làm ngay tối nay (08/08)

Timebox 2 giờ. Mục tiêu duy nhất: **biết sớm cái gì hỏng.**

1. `sudo dnf install k6` → `k6 version`. Timebox **20 phút**. Không được thì tải binary từ GitHub release; vẫn không được thì chốt luôn phương án JMeter và ghi vào kế hoạch. Đừng để câu hỏi này treo sang 16/08.
2. Viết + chạy `seed_perf.js` — 2.000 products, 200 users. Verify bằng count thật.
3. Một **smoke run k6 2 phút, 5 VU** trúng `GET /api/products?search=` — chỉ để chứng minh pipeline `k6 → raw CSV → HTML` thông. Chất lượng script chưa quan trọng.
4. Sửa 4 sai lệch P1–P4 trong `README.md` / `REPORT.md`.
5. Commit — dùng skill `commit`. Đây cũng là commit đầu tiên tính cho §12.

**Không làm tối nay:** tinh chỉnh tham số VU/ramp-up, viết REPORT, đụng vào Agent Skill. Tất cả đều chờ được; câu hỏi "k6 có chạy không" thì không.
