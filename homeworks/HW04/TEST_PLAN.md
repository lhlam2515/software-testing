# HW04 — Test Plan & Kế hoạch thực hiện

**Sinh viên:** Lê Hoàng Lâm — 23127216 — Nhóm 02 — 23KTPM1
**SUT:** EShop (`apps/` monorepo, local)
**Framework:** Playwright + TypeScript
**Ngày lập kế hoạch:** 2026-08-05

> Tài liệu này là kế hoạch thực thi, không phải bài nộp. Kết quả thật được ghi vào
> `REPORT.md`, `README.md`, `bugs/BUG_REPORT.md`, `[AI-02]_AI_Audit_Report.md`.

---

## 1. Phạm vi & mục tiêu

| Mục | Giá trị |
| --- | --- |
| Feature tự động hoá | FR-02 (Pool A), FR-09 (Pool B), FR-16 (Pool C) — giữ nguyên lựa chọn HW02 |
| Nguồn test case | HW02 `domain-testing.md` + `bva.md` của 3 feature |
| Yêu cầu tối thiểu | ≥12 TC/feature · data-driven file rời · ≥3 assertion pattern · 3 browser · ≥9 browser run |
| Mục tiêu tự chấm | 90–95/100 |
| Ngân sách thời gian | 10h (Day 1) + 3 ngày × 30 phút (commit history + stabilize) |

### 1.1 Ngân sách test case (đã đếm từ HW02)

| Feature | EP (domain-testing) | BVA | Tổng có sẵn | Kế hoạch tự động hoá | Đệm so với ngưỡng 12 |
| --- | ---: | ---: | ---: | ---: | --- |
| FR-02 Login & Lockout | 7 (TC-01…07) | 5 (TC-BVA-01…05) | **12** | **15** (+3 TC UI mới) | Sát ngưỡng → **phải** bổ sung |
| FR-09 Coupon | 13 (TC-01…13) | 8 (TC-BVA-01…08) | **21** | **21** | Dư 9 |
| FR-16 CSV Import | 19 (TC-01…19) | 5 (TC-BVA-01…05) | **24** | **24** | Dư 12 |
| **Tổng** | 39 | 18 | 57 | **60** | 60 TC × 3 browser = **180 test run** |

**FR-02 đang đúng bằng ngưỡng tối thiểu.** Chỉ cần 1 TC không automate được là rớt tiêu chí. Bắt buộc bổ sung 3 TC mức UI (không cần thiết kế lại EP/BVA, chỉ mở rộng nhánh UI của EC đã có):

- `TC-UI-01` — password field phải là `type="password"` (che ký tự) *(EC nhóm 3 — output an toàn)*
- `TC-UI-02` — submit form bằng phím `Enter` cho kết quả giống click nút *(đường vào thứ 2 của cùng EC15)*
- `TC-UI-03` — sau khi lock, nút Sign In / thông báo lockout phản ánh đúng trạng thái trên UI, không chỉ ở API *(EC12 tầng UI)*

Ghi rõ trong `REPORT.md §3.1` rằng 3 TC này là **mở rộng tầng UI của EC đã thiết kế ở HW02**, không phải TC bịa thêm cho đủ số.

---

## 2. Rào cản đã khảo sát (quyết định kiến trúc bắt nguồn từ đây)

| # | Phát hiện | Bằng chứng | Hệ quả lên thiết kế |
| --- | --- | --- | --- |
| R1 | SUT **không có `data-testid`** nào | `grep -rl data-testid apps/*/src` → rỗng | Locator chỉ dựa được vào role / placeholder / text. Bắt buộc có tầng POM để cô lập rủi ro. |
| R2 | `<label>` **không gắn `htmlFor`/`id`** với input | `Login.jsx:28,38` — label và input là 2 element rời | `getByLabel()` **fail**. Đây là lỗi AI sẽ mắc đầu tiên → tư liệu §6.1 REPORT. |
| R3 | Một phần TC HW02 là **mức API**, không có đường vào UI | FR-16 TC-03/04/05 (thiếu JWT, JWT non-admin, thiếu key `products`); FR-09 TC-08/09 | Dùng Playwright `request` fixture. Hợp lệ, vẫn là Playwright, và tạo ra assertion pattern #2. |
| R4 | **WebKit chưa cài**; máy Fedora | `~/.cache/ms-playwright` chỉ có chromium-1234, firefox-1522 | P0 phải `npx playwright install webkit` trước tiên. Fallback: `Chrome / Edge / Firefox` (§6 cho phép). |
| R5 | Đã có **16 bug HW02** trên FR-02/09/16, đã mở Issue #13–#27, #30 | `HW02/BUG_REPORT.md` | Assert theo **spec** ⇒ test sẽ đỏ đúng chỗ đã biết. Đây là bằng chứng, không phải sự cố. Xem §6. |
| R6 | FR-16 parse CSV **ở client** (`FileReader`, admin `App.jsx:357–364`) | grep `type="file"` | Automate được qua `setInputFiles()`. Và BUG-16-005 (không chặn đuôi `.csv`) nằm đúng tầng này. |
| R7 | Chưa có `@playwright/test`, chưa có `playwright.config.*` trong repo | `ls node_modules` → không tồn tại | P0 phải dựng từ đầu. |
| R8 | HW02 thiết kế FR-02/09/16 theo **spec-only**, không khảo sát UI | `HW02/REPORT.md:230` | Bắt buộc chèn bước **UI Survey** (P1) trước khi sinh script, nếu không AI sẽ đoán selector. |

---

## 3. Kiến trúc bộ test

```
homeworks/HW04/
├── README.md · REPORT.md · REQUIREMENTS.md · TEST_PLAN.md · prompt_log.md
├── [AI-02/03/05]_*.md
├── bugs/BUG_REPORT.md
├── assets/{signature.png, git-commit-log.txt}
└── artifacts/                      # toàn bộ phần automation — code, data, report đều nằm trong đây
    ├── package.json                # scripts chạy theo feature × browser
    ├── playwright.config.ts        # 3 project browser, HTML reporter, metadata Run by
    ├── tests/
    │   ├── _fixtures/
    │   │   ├── pom/
    │   │   │   ├── login.page.ts       # FR-02 — web (:5173)
    │   │   │   ├── checkout.page.ts    # FR-09 — web (:5173)
    │   │   │   └── admin-import.page.ts# FR-16 — admin (:5174)
    │   │   ├── db.ts                   # đọc/ghi database.sqlite (seed + assert state)
    │   │   ├── api.ts                  # helper cho request fixture (login lấy JWT, v.v.)
    │   │   ├── csv.ts                  # sinh file CSV tạm từ cases.json
    │   │   ├── run-meta.ts             # inject "Run by: 23127216" + ISO timestamp
    │   │   └── ui-survey.md            # locator đã verify — đọc trước khi viết POM
    │   ├── FR-02/ login.spec.ts (EP + UI-layer + BVA, một loop duy nhất)
    │   ├── FR-09/ coupon.spec.ts (EP + BVA, một loop duy nhất — xem §11 "Single-loop spec")
    │   └── FR-16/ csv-import.spec.ts (EP + BVA, một loop duy nhất — xem §11 "Single-loop spec")
    ├── test-data/
    │   ├── FR-02/cases.json
    │   ├── FR-09/cases.json
    │   └── FR-16/cases.json + fixtures/*.csv
    ├── scripts/
    │   ├── gen-summary.cjs             # 9x results.json -> reports/markdown/02,03,04,05,06_*.md
    │   └── build-report.cjs            # ported from Triangle_SUT — reports/markdown/*.md -> 1 PDF
    ├── html-reports/<FR>/<browser>/    # layer 1 — native Playwright HTML report (deep-dive)
    ├── test-results/<FR>/<browser>/results.json  # layer 2 — JSON reporter (machine data)
    ├── reports/markdown/               # layer 3 source — 01_overview, 02_summary, 03-05_results-<FR> (matrix), 06_bugs, 07_notes
    ├── pdf/HW04_Test_Report.pdf        # layer 3 output — single-file human view
    └── skills/playwright-spec-generator/
```

**3 tầng report (quyết định §11 "Report design", 2026-08-08):** layer 1 giữ nguyên yêu cầu rubric
(9 HTML report/feature×browser, dùng khi cần trace/screenshot 1 case cụ thể). Layer 2 là dữ liệu máy
đọc (`json` reporter, biến `JSON_OUT` song song `HTML_OUT`). Layer 3 là **thứ dễ xem nhất** — 1 PDF
duy nhất, có bảng ma trận TC × browser cho từng feature (không phải bảng 1 cột như Triangle_SUT, vì
HW04 chạy 3 browser); dòng có kết quả khác nhau giữa các browser được in đậm + gắn nhãn
`⚠ browser-diff` — bằng chứng trực quan cho loại bug mà HW02 (test tay, 1 lần) không phát hiện được.

> **Tách code/docs (quyết định phiên này):** mọi thứ chạy được (config, tests/, test-data/,
> node_modules/, skills/) nằm trong `artifacts/`, khớp convention `artifacts/` mà HW02 đã
> dùng (container cho tests/, skills/, demo/). Root `homeworks/HW04/` chỉ còn tài liệu nộp
> thuần Markdown + `bugs/` + `assets/`. Lệnh chạy suite luôn cần `cd artifacts/` trước — xem
> checklist §10.

### 3.1 Schema `cases.json` (thống nhất cho cả 3 feature)

```jsonc
{
  "id": "TC-06",
  "hw02Ref": "domain-testing.md#tc-06",     // truy vết ngược HW02
  "title": "Wrong password & counter increment",
  "layer": "ui",                             // "ui" | "api" | "hybrid"
  "type": "negative",                        // positive | negative | edge
  "arrange": { "email": "test@eshop.com", "setAttempts": 0 },
  "act":     { "password": "WrongPass1!" },
  "assert": {
    "ui":  { "errorText": "Sai email hoặc mật khẩu" },
    "api": { "status": 401 },
    "db":  { "login_attempts": 1 }
  },
  "knownDefect": "BUG-02-003"                // null nếu kỳ vọng pass
}
```

**Nguyên tắc bất di bất dịch:** trường `assert` ghi **hành vi ĐÚNG theo spec**, không ghi hành vi quan sát được của SUT. Nếu ghi theo hành vi lỗi thì suite xanh nhưng không phát hiện bug nào — mất trắng phần bug report.

### 3.2 Ba assertion pattern (đáp ứng "≥3 distinct")

| # | Pattern | Kỹ thuật | Dùng ở |
| --- | --- | --- | --- |
| 1 | **Web-first UI assertion** | `expect(locator).toHaveText / toBeVisible / toHaveURL` — auto-retry, không sleep | Cả 3 feature |
| 2 | **Network / API response assertion** | `page.waitForResponse()` bắt status + body; hoặc `request.post()` trực tiếp cho TC API-only | FR-02 (401/423), FR-09 (`/api/apply-coupon`), FR-16 (`/api/import`) |
| 3 | **Database state assertion** | Truy vấn `apps/backend/database.sqlite` qua `_fixtures/db.ts` | FR-02 `login_attempts`/`locked_until`, FR-09 `uses_by_user`, FR-16 rollback nguyên tử |
| 4 | *(bonus)* **Structural / a11y snapshot** | `expect(locator).toMatchAriaSnapshot()` | 1–2 TC FR-16 để chứng minh vượt ngưỡng |

Pattern #3 là thứ phân biệt bài này với bài trung bình: nó chứng minh được **rollback nguyên tử** của FR-16 và **counter tăng 2 thay vì 1** của BUG-02-003 — hai thứ UI không nhìn thấy.

### 3.3 `playwright.config.ts` — điểm mấu chốt "Run by: {StudentID}"

```ts
const RUN_BY = process.env.STUDENT_ID ?? '23127216';
const RUN_AT = new Date().toISOString();

export default defineConfig({
  metadata: { 'Run by': RUN_BY, 'Run at': RUN_AT },        // hiện ở header HTML report
  reporter: [
    ['html', { open: 'never',
               outputFolder: process.env.HTML_OUT,
               title: `EShop HW04 — Run by: ${RUN_BY} — ${RUN_AT}` }],
    ['list'],
  ],
  retries: 0,            // KHÔNG retry: che mất bug thật và làm sai số liệu pass/fail
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
```

**Belt-and-braces cho tiêu chí chống gian lận (§11).** Ba lớp độc lập, ít nhất 2 phải hiện:

1. `metadata` → render ở header report.
2. `title` của html reporter → hiện ở tab + tiêu đề.
3. `test.info().annotations.push({ type: 'Run by', description: RUN_BY })` trong `beforeEach` → hiện trong từng test detail.

Ở bước P0 phải **mở thật 1 report và mắt nhìn thấy chuỗi `Run by: 23127216` + ISO timestamp** rồi mới đi tiếp. Nếu bước này sai thì toàn bộ 9 report phải chạy lại.

---

## 4. Quy trình AI-first (§Guiding Principles — bị chấm điểm)

Cấm 1 prompt tổng quát kiểu *"viết toàn bộ automation script cho FR-09"*. Mỗi feature chạy **chuỗi 6 prompt** dưới đây, mỗi prompt log đầy đủ vào `prompt_log.md` (tool, timestamp, prompt, output, verdict, student fix).

| Bước | Prompt gửi AI | Output kỳ vọng | Việc người làm sau đó |
| --- | --- | --- | --- |
| A1 | "Đọc `domain-testing.md` + `bva.md` của FR-XX. Liệt kê từng TC thành bảng: id, layer (ui/api/hybrid), precondition, input, expected theo spec." | Bảng TC chuẩn hoá | Đối chiếu tay với HW02, sửa layer bị gán sai |
| A2 | "Từ bảng trên + kết quả UI survey `ui-survey.md`, sinh `cases.json` theo schema §3.1. Không sinh code test." | File dữ liệu | Kiểm `expected` có bám spec không (không bám hành vi lỗi) |
| A3 | "Sinh Page Object cho màn hình X. Chỉ locator + action, không assertion. Ràng buộc: SUT không có data-testid, label không gắn htmlFor." | `*.page.ts` | **Kiểm từng locator bằng `playwright-cli`** — đây là nơi AI hay bịa |
| A4 | "Sinh spec data-driven đọc `cases.json`, dùng POM ở A3, cấu trúc Arrange-Act-Assert, mỗi TC 1 `test()`." | `*.spec.ts` khung | Sửa cấu trúc, thêm `test.describe` + annotation |
| A5 | "Bổ sung assertion pattern #2 (network) và #3 (DB) cho các TC được đánh dấu trong `cases.json`." | Assertion nâng cao | Kiểm assertion có thật sự fail khi SUT sai |
| A6 | "Rà lại spec vừa sinh: chỉ ra selector dễ vỡ, assertion yếu, wait cứng, TC bị bỏ sót." | Danh sách self-critique | **Đối chiếu với lỗi mình tự tìm được** → nội dung §6 REPORT |

Chuỗi này chính là bằng chứng cho Bloom-AI **G9.2 / G9.3 / G9.4**. Bước A6 đặc biệt quan trọng: nó cho phép so sánh "AI tự nhận ra gì" vs "người phát hiện gì AI không nhận ra" — đúng câu hỏi §10 AI Critique.

### 4.1 Dự đoán lỗi AI sẽ mắc (để chủ động ghi §6 REPORT)

| Loại | Dự đoán cụ thể | Gốc rễ |
| --- | --- | --- |
| Fragile selector | `getByLabel('Username')`, `getByLabel('Mật khẩu')` | R2 — AI giả định HTML đúng chuẩn a11y; SUT không đạt |
| Fragile selector | `page.locator('.bg-blue-600')` (bám class Tailwind) | AI thấy class trong JSX và tưởng đó là hook ổn định |
| Weak assertion | Chỉ `expect(page).toHaveURL('/')` sau login, không kiểm DB | AI không có mô hình về `login_attempts` |
| Missing edge | Bỏ TC-BVA-04 (`expired_at` = hôm nay, biên nghiêm ngặt) | Biên thời gian cần seed DB — AI né việc phải arrange phức tạp |
| Flaky wait | `await page.waitForTimeout(3000)` chờ lockout 30s | AI mặc định sleep thay vì thao tác DB/clock |
| Sai kỳ vọng | Viết `expected` khớp hành vi lỗi hiện tại của SUT | AI đọc code SUT rồi suy ra expected — sai gốc: expected phải đến từ **spec**, không từ **implementation** |

Mỗi mục xác nhận được → 1 dòng trong `REPORT.md §6.1–6.4`, kèm diff before/after.

---

## 5. Lịch thực thi — Day 1 (10 giờ)

> Lưu ý lịch cá nhân: Thứ 4 (2026-08-05) bị chặn bởi 2 ca học 07:30–17:10.
> Khối 10h nên đặt vào **Thứ 5 2026-08-06** (deep work sáng + shallow chiều), hoặc chia
> 2 nửa Thứ 5/Thứ 6 sáng. Các mốc dưới đây tính theo giờ trôi, không theo giờ đồng hồ.

| Phase | Thời lượng | Nội dung | Definition of Done |
| --- | ---: | --- | --- |
| **P0** Môi trường | 0:30 | `npm i -D @playwright/test`; `npx playwright install chromium firefox webkit`; dựng `playwright.config.ts` + `package.json` scripts; 1 smoke test `expect(page).toHaveTitle()`; chạy `bash apps/run-servers.sh` | Mở HTML report và **nhìn thấy** `Run by: 23127216` + ISO timestamp. WebKit chạy được hoặc đã chốt fallback Chrome/Edge/Firefox. |
| **P1** UI Survey | 0:45 | Dùng skill `playwright-cli` khảo sát 3 màn: `/login` (:5173), `/checkout` (:5173), admin CSV import (:5174). Ghi `tests/_fixtures/ui-survey.md`: mỗi control → locator đề xuất + lý do. | Mọi control cần thiết có locator **đã verify chạy được**, không phải locator đoán. |
| **P2** POM + fixtures | 1:00 | 3 page object; `db.ts` (seed `login_attempts`/`locked_until`/`uses_by_user`, đọc `products`); `api.ts`; `csv.ts`; `run-meta.ts` | `db.ts` set/get được state; test seed chạy xanh. |
| **P3** Dữ liệu | 1:00 | Chạy A1+A2 cho cả 3 feature → 3 `cases.json` (60 case) + CSV fixtures FR-16 | 60 case, mỗi case có `hw02Ref` truy vết được; `expected` bám spec. |
| **P4** Sinh spec | 3:00 | A3→A6 lần lượt FR-02 (0:50) → FR-09 (1:05) → FR-16 (1:05). Sau mỗi feature: chạy chromium, sửa ngay, **commit**. | 3 feature chạy hết trên chromium, mọi failure đã phân loại (bug SUT vs bug test). |
| **P5** Multi-browser | 1:00 | 9 lần chạy (3 feature × 3 browser), xuất vào `artifacts/html-reports/<FR>/<browser>/`. Thu screenshot failure. | 9 thư mục report, mỗi cái mở được và có `Run by`. Ghi số liệu pass/fail vào bảng tổng hợp. |
| **P6** Bug triage | 1:00 | Phân loại failure: (a) bug SUT đã biết → cross-link Issue #13–#27/#30 + bổ sung bằng chứng automation; (b) bug **mới** (đặc biệt lỗi khác biệt giữa browser) → mở Issue mới + screenshot; (c) bug của test → sửa test | `bugs/BUG_REPORT.md` đầy đủ; mỗi bug có screenshot Issue trên GitHub. |
| **P7** Agent Skill | 0:45 | Viết `skills/playwright-spec-generator/SKILL.md` v0.1 — đóng gói đúng chuỗi A1–A6 vừa dùng, format YAML frontmatter + numbered steps (theo convention `gui-checklist-runner`). Cập nhật CHANGELOG. | Skill mô tả được quy trình vừa chạy thật, không phải mô tả lý thuyết. |
| **P8** Tài liệu | 1:30 | Điền `REPORT.md` §2–§11, `README.md` (test summary + self-assessment), `[AI-02]`, `[AI-03]`, `[AI-05]`, `prompt_log.md`. **§12 AI Critique 200–300 từ phải tự viết tay.** | Không còn `_TBD_` / `<Count>` nào. Xuất PDF. |
| **P9** Video | 0:30 chuẩn bị | Viết outline kịch bản tiếng Việt ≥5 phút: mở `whoami && hostname` → giới thiệu cấu trúc → chạy 1 feature 3 browser → mở HTML report → **kể 1 fix cụ thể đã làm trên script AI sinh ra** (chọn lỗi `getByLabel` — trực quan nhất) | Outline sẵn sàng; quay là việc thủ công ~40 phút riêng. |

**Tổng: 11h00** (10h + 1h đệm). Nếu phải cắt: bỏ assertion pattern #4 (aria snapshot) và giảm FR-16 từ 24 xuống 18 TC — vẫn dư ngưỡng.

### 5.1 Đường găng (critical path)

`P0 (report metadata) → P1 (locator verify) → P2 (db.ts) → P4 → P5`

Ba điểm nếu sai sẽ phải làm lại nhiều nhất:

1. **P0** — sai `Run by` ⇒ chạy lại cả 9 report.
2. **P1** — locator đoán ⇒ P4 mất gấp đôi thời gian debug.
3. **P2 `db.ts`** — không seed được `login_attempts`/`locked_until` ⇒ toàn bộ 5 TC BVA của FR-02 phải chờ thật 30s hoặc bất khả thi.

Làm 3 thứ này **trước**, đừng để dồn.

---

## 6. Xử lý 16 bug đã biết từ HW02

Assert theo spec ⇒ tỉ lệ fail dự kiến khá cao. Đây là **đúng ý đồ** (§6: *"wherever a failing assertion reveals a genuine defect, a bug report"*), nhưng phải trình bày cho rõ, nếu không người chấm sẽ đọc thành "suite hỏng".

| Nhóm | Cách xử lý |
| --- | --- |
| Bug HW02 đã có Issue (#13–#27, #30) | Giữ nguyên Issue. Trong `BUG_REPORT.md` HW04 ghi mục *"Automation evidence"*: spec path + tên assertion + dòng fail. Comment thêm vào Issue cũ kèm ảnh report. **Không mở Issue trùng.** |
| Bug **mới** do automation phát hiện | Ứng viên rõ nhất: khác biệt hành vi giữa Chromium/Firefox/WebKit (validate HTML5, format số, upload file). Mở Issue mới + screenshot. Đây là giá trị gia tăng mà HW02 thủ công không có. |
| Failure do lỗi test | Sửa test. Ghi vào `REPORT.md §6` như một mục self-review. |

Bảng bắt buộc có trong `REPORT.md §5.4`: mỗi feature tách rõ **Failed (defect thật)** vs **Failed (test issue, đã sửa)** vs **Passed**. Không gộp.

---

## 7. Kế hoạch commit (§12 — ≥8 commit, ≥4 ngày, chỉ tính file spec)

| Ngày | Commit | Nội dung chạm file spec |
| --- | --- | --- |
| D1 | 1. `test(hw04): scaffold playwright config and smoke spec` | `tests/smoke.spec.ts` |
| D1 | 2. `test(hw04): add FR-02 login page object and data-driven spec` | `tests/FR-02/login.spec.ts` |
| D1 | 3. `test(hw04): add FR-02 lockout BVA spec with DB state assertions` | `tests/FR-02/lockout.bva.spec.ts` |
| D1 | 4. `test(hw04): add FR-09 coupon spec` | `tests/FR-09/coupon.spec.ts` |
| D1 | 5. `test(hw04): add FR-09 coupon BVA spec` | `tests/FR-09/coupon.bva.spec.ts` |
| D1 | 6. `test(hw04): add FR-16 CSV import spec` | `tests/FR-16/csv-import.spec.ts` |
| D2 | 7. `fix(hw04): replace label-based locators with role locators in FR-02 POM` | spec + POM |
| D2 | 8. `test(hw04): add FR-16 BVA spec for name length boundary` | `tests/FR-16/csv-import.bva.spec.ts` |
| D3 | 9. `fix(hw04): stabilise webkit run by removing fixed waits` | các spec |
| D3 | 10. `test(hw04): add 3 UI-layer test cases to FR-02` | `tests/FR-02/login.spec.ts` |
| D4 | 11. `test(hw04): assert atomic rollback via DB state in FR-16` | spec |
| D4 | 12. `chore(hw04): export git commit log and final report artifacts` | (không tính, nhưng cần) |

**11 commit chạm spec / 4 ngày** — vượt ngưỡng 8, có đệm. Commit D2–D4 là công việc thật (fix flaky, thêm TC, siết assertion), không phải commit rỗng chia nhỏ.

Xuất log ở cuối: `git log --date=iso --pretty='%h %ad %an %s' -- homeworks/HW04 > homeworks/HW04/assets/git-commit-log.txt`

---

## 8. Rủi ro & phương án

| # | Rủi ro | Xác suất | Tác động | Phương án |
| --- | --- | --- | --- | --- |
| 1 | WebKit không cài/chạy được trên Fedora | Trung bình | Cao — mất tiêu chí 3 browser | Fallback `Chrome / Edge / Firefox` qua `channel:` (§6 cho phép rõ ràng). Quyết trong P0, không để đến P5. |
| 2 | AI sinh locator bịa vì SUT không có testid | **Cao** | Trung bình | P1 UI Survey verify locator **trước** khi sinh spec. Đây đã tính vào kế hoạch. |
| 3 | TC mức API bị coi là "không phải automation web frontend" | Thấp | Trung bình | Giữ tỉ lệ UI ≥ 60% mỗi feature. Ghi rõ ở `REPORT.md §4.1` lý do phân tầng, viện dẫn HW02. |
| 4 | Lockout 30s (thực tế ~180s, BUG-02-004) làm suite chậm/flaky | Trung bình | Cao | Không bao giờ `waitForTimeout`. Seed trực tiếp `locked_until` qua `db.ts`. |
| 5 | Test không độc lập, dây chuyền (`login_attempts` rò rỉ giữa test) | Cao nếu ẩu | Cao | `beforeEach` reset state qua `db.ts`. `fullyParallel: false` cho FR-02 (test chia sẻ 1 tài khoản). |
| 6 | Không kịp quay video ≥5 phút | Trung bình | Cao — mất 15đ | P9 chỉ chuẩn bị outline ở Day 1; quay vào Day 2. Đừng để chung ngày với build. |
| 7 | Lịch sử Git không đủ 4 ngày | **Chắc chắn nếu làm 1 ngày** | Cao | Bám lịch commit §7. Đã tính vào kế hoạch. |
| 8 | Report bị chạy đè, mất `Run by` | Thấp | Cao | `HTML_OUT` khác nhau cho từng feature × browser; không dùng `playwright-report/` mặc định. |

---

## 9. Bản đồ tiêu chí chấm → deliverable

| Tiêu chí | Điểm | Deliverable | Tự chấm dự kiến |
| --- | ---: | --- | ---: |
| Task 1 — FR-02 | 25 | 15 TC · `cases.json` · 3 assertion pattern · 3 report | 23 |
| Task 1 — FR-09 | 25 | 21 TC · 3 report · bug cross-link | 23 |
| Task 1 — FR-16 | 25 | 24 TC · CSV fixtures · DB rollback assertion · 3 report | 23 |
| Task 2 — Demo video | 15 | YouTube unlisted ≥5', tiếng Việt, `whoami`/`hostname`, kể 1 fix | 14 |
| Task 3 — Agent Skill | 10 | `skills/playwright-spec-generator/SKILL.md` v0.1 + demo | 9 |
| | **100** | | **92** |

Tự chấm cuối cùng chốt sau P8 dựa trên số liệu thật, không dùng con số dự kiến này. Tên file zip: `23127216_HW04_AI_Automation_092.zip`.

---

## 10. Checklist khởi động P0 (chạy theo thứ tự)

```bash
cd homeworks/HW04/artifacts
npm init -y
npm i -D @playwright/test better-sqlite3
npx playwright install chromium firefox webkit     # RỦI RO R4 — kiểm ngay tại đây
# terminal khác:
bash ../../../apps/run-servers.sh                  # :3000 / :5173 / :5174
# smoke:
STUDENT_ID=23127216 HTML_OUT=html-reports/_smoke npx playwright test tests/smoke.spec.ts --project=chromium
npx playwright show-report html-reports/_smoke
# ⇒ MẮT PHẢI NHÌN THẤY: "Run by: 23127216" và ISO timestamp
```

Nếu bước cuối không hiện chuỗi đó — **dừng lại và sửa config trước khi viết bất kỳ spec nào.**

---

## 11. Nhật ký quyết định — Reorg tách code/docs (2026-08-05, giữa P1)

**Bối cảnh:** giữa P1 (UI Survey), phát sinh yêu cầu khảo sát `Triangle_SUT/Codes` (một
project Domain Testing + BVA khác trong repo, dùng làm tham chiếu tổ chức thư mục) và tách
biệt code automation khỏi tài liệu Markdown trong `homeworks/HW04/`, vì tại thời điểm đó
`tests/`, `test-data/`, `skills/`, `package.json`, `playwright.config.ts`, `tsconfig.json`
đang nằm ngang hàng với `REPORT.md`, `README.md`, `[AI-xx]_*.md` ngay tại root.

### Khảo sát

| Nguồn | Rút ra được |
| --- | --- |
| `Triangle_SUT/Codes` | Pipeline báo cáo: JSON reporter (`results.json`) → script parse ra bảng markdown (`gen-results.js`) → gộp các file `NN_*.md` đã đánh số + inline ảnh base64 → render PDF qua Chromium headless (`build-report.js`), không cần Word/LaTeX. `tests/` (spec + helper) tách biệt vật lý khỏi `test-data/` (CSV) và `reports/` (output sinh ra). |
| `homeworks/HW02` (tiền lệ cùng repo) | `artifacts/` **đã là container chuẩn** cho `tests/`, `skills/`, `demo/` trong repo này; root homework chỉ giữ tài liệu nộp thuần (README/REPORT/REQUIREMENTS/BUG_REPORT/`[AI-xx]`/prompt_log) + `assets/`. |

### Quyết định

2 phương án được đưa ra, đã chọn **phương án 1**: gộp toàn bộ code + data + skill + report
output vào `artifacts/` **có sẵn** (đã có `artifacts/html-reports/`, `artifacts/pdf/`) thay vì
tạo thư mục `automation/` mới ngang hàng. Lý do: khớp 100% convention `artifacts/` mà HW02 đã
dùng, rủi ro thấp, ít link phải sửa hơn.

### Đã thực hiện

- **Di chuyển** (giữ nguyên nội dung, chỉ đổi vị trí): `tests/` → `artifacts/tests/` ·
  `test-data/` → `artifacts/test-data/` · `skills/` → `artifacts/skills/` ·
  `package.json`, `package-lock.json`, `playwright.config.ts`, `tsconfig.json`, `node_modules/`,
  `test-results/` → vào trong `artifacts/`.
- **Sửa `artifacts/playwright.config.ts`**: `HTML_OUT` mặc định đổi từ
  `'artifacts/html-reports/_default'` thành `'html-reports/_default'` — path tương đối bị lệch
  1 cấp sau khi config chuyển vào chính `artifacts/`.
- **Sửa link** trỏ vào vị trí mới trong: `README.md`, `REPORT.md`, `bugs/BUG_REPORT.md`,
  `[AI-05]_AI_Privacy_Checklist.md` (tất cả tham chiếu `tests/`, `test-data/`,
  `skills/playwright-spec-generator/` → thêm tiền tố `artifacts/`).
- **Sửa chính file này**: sơ đồ §3 và checklist §10 (`cd homeworks/HW04/artifacts` trước khi
  `npm`/`playwright`).
- **Verify thật**: chạy lại `node ./node_modules/.bin/playwright test tests/smoke.spec.ts
  --project=chromium` từ `artifacts/` → **1 passed**; report sinh đúng
  `artifacts/html-reports/_default`, không bị lồng `artifacts/artifacts/`.

### Commit

Tách 2 commit theo yêu cầu — không gộp reorg với setup framework:

1. `refactor(hw04): move automation code and scaffold into artifacts/` (`2b51e2c`)
2. `build(hw04): scaffold playwright automation environment` (`e11f7fa`)

`TEST_PLAN.md` **không** nằm trong cả hai commit — tài liệu này là kế hoạch thực thi, không
commit trong suốt quá trình làm bài (xem dòng 8–9 đầu file).

### Nợ còn lại (chưa xử lý trong phiên reorg này)

- `TC-UI-01` (§1.1) vẫn chưa được đánh dấu lại là **expected FAIL** trong bảng — UI survey đã
  phát hiện password field là `type="text"`, tức đây là bug thật, không phải case pass như kế
  hoạch ban đầu.
- **FR-16 rollback không atomic (phát hiện ở P2, chưa xử lý):** `server.js:199-241`
  (`/api/admin/import-products`) không có transaction — mỗi dòng `stmt.run()` độc lập, dòng hợp
  lệ vẫn được insert dù dòng khác lỗi. Mâu thuẫn với giả định ở §3.2 pattern #3 ("chứng minh
  rollback nguyên tử"). **Quyết định (phiên này):** giữ nguyên kỳ vọng cũ trong kế hoạch, để
  P3/P4 xử lý — khi viết `cases.json`/`assert.db` cho FR-16, nhớ đối chiếu lại hành vi thật
  (partial insert) trước khi chốt `expected`, nếu không assertion sẽ sai theo đúng nguyên tắc
  bất di bất dịch ở §3.1 (assert theo spec, không theo implementation — nhưng ở đây "spec" của
  rollback cũng cần làm rõ lại là gì trước khi viết assert).

### P3 — Dữ liệu `cases.json` cho cả 3 feature (2026-08-05)

Chạy A1+A2 (chuỗi prompt §4) cho FR-02, FR-09, FR-16, đọc thẳng `server.js` (không chỉ dựa vào
`domain-testing.md`/`bva.md` của HW02) để chốt `expected` theo spec đúng, vì hành vi thật của SUT
lệch khỏi giả định ban đầu ở nhiều điểm hơn HW02 đã ghi nhận.

**Kết quả:** `FR-02/cases.json` 15 case (7 EP + 5 BVA + 3 UI mới), `FR-09/cases.json` 21 case
(13 EP + 8 BVA), `FR-16/cases.json` 24 case (19 EP + 5 BVA) — đúng ngân sách §1.1, tổng 60 case.

**Phát hiện mới từ việc đọc `server.js` trực tiếp (không có trong HW02, ảnh hưởng lên `expected`):**

- **FR-09 `/api/apply-coupon` (`server.js:363`) hoàn toàn không có `authenticateToken`
  middleware** — route này không xác thực JWT ở tầng server dù `docs/eshop-sut/api_specification.md`
  ngụ ý cần đăng nhập. Đây là bằng chứng trực tiếp, đọc từ mã nguồn, cho BUG-09-002/003 (trước đây
  HW02 chỉ suy ra qua quan sát response, chưa xác nhận qua code). `user_id` cũng lấy thẳng từ
  `req.body`, không lấy từ token đã giải mã.
- **FR-09 điều kiện ngưỡng dùng `total_amount > coupon.min_order_amount`** (`server.js:379`, so
  sánh **strict `>`**), không phải `>=` như spec yêu cầu. Đây là root cause chính xác của
  BUG-09-005 — ảnh hưởng cả `TC-BVA-02` (total = min_order, ON point) lẫn `TC-12` (total=0,
  min=0, degenerate case) vì cùng một dòng code.
- **FR-16 `/api/admin/import-products` (`server.js:199-241`) chỉ validate duy nhất điều kiện
  `!row.name`** — hoàn toàn **không validate `price`** (0, âm, chuỗi không phải số, hoặc thiếu
  field đều được insert thẳng), **không validate `category_id`** tồn tại hay không (dangling FK),
  **không giới hạn độ dài `name` 255 ký tự** (cross-ref FR-15). Hệ quả: gần như toàn bộ TC liên
  quan đến `price`/`category_id`/độ dài tên (TC-08→11, TC-14, TC-15, TC-BVA-01, TC-BVA-05) sẽ
  **fail đúng** trong `cases.json` vì `expected` được viết theo spec, không theo implementation —
  đây chính là bằng chứng automation mạnh hơn hẳn so với HW02 (HW02 chỉ quan sát qua UI/response,
  chưa từng đọc thẳng logic validate — hoặc thiếu logic validate — trong `server.js`).
- **`authenticateToken` (`server.js:100`) không kiểm tra `role`** ở bất kỳ route `/api/admin/*`
  nào, kể cả `import-products` — xác nhận trực tiếp BUG-16-001 (user thường vẫn import được).

**Quyết định về TC-12/TC-18 (atomic rollback) — nối tiếp nợ đã ghi ở P2:** giữ `expected` theo
spec cũ (rollback toàn bộ khi có 1 dòng lỗi) đúng như đã chốt, nhưng thêm field `note` riêng trong
`cases.json` cho 2 TC này cảnh báo rằng thực tế sẽ FAIL vì **2 lý do cộng dồn** (thiếu validate
`price` + thiếu transaction), không phải 1 lý do — tránh hiểu nhầm khi viết `REPORT.md §6` sau
này rằng đây chỉ là 1 bug.

### Single-loop spec cho DDT, FR-02 (2026-08-06)

**Bối cảnh:** FR-02 ban đầu tách 2 file spec theo nhóm test-design technique —
`login.spec.ts` (EP + UI-layer, filter `!id.startsWith('TC-BVA')`) và
`lockout.bva.spec.ts` (BVA, filter `id.startsWith('TC-BVA')`) — cả 2 cùng đọc
`test-data/FR-02/cases.json` qua `loadCases()`. Đánh giá lại theo mô hình DDT chuẩn
(`data-driven-testing.md` §4, "one reusable loop covers every test case") phát hiện
2 file này copy gần như y hệt khối Arrange/Act/Assert (`applyArrange` →
`actLogin` → `assertUi`/`assertApi`/`assertDb`), chỉ khác predicate filter và 1
nhánh annotation phụ cho case thiếu `assert.ui`. Đây là nhân đôi đúng thứ DDT sinh
ra để loại bỏ: logic test bị duy trì ở 2 nơi thay vì 1.

### Quyết định

Gộp về **1 file spec / 1 `test.describe` / 1 vòng `for` duy nhất** đọc toàn bộ
mảng case (`loadCases('FR-02')`, không filter theo prefix ID trước khi loop). Phân
biệt hành vi giữa các nhóm case (EP/UI-layer/BVA) xử lý **ngay trong thân loop bằng
điều kiện đọc từ chính data của case** (`if (!tc.assert.ui) { … }`), không phải
bằng cách tách file hay tách loop theo nhóm. Không phát sinh helper trung gian mới
— toàn bộ logic vốn đã nằm sẵn trong `fr02-helpers.ts`.

**Lý do không giữ 2 file để lọc theo CLI (`--grep`):** lợi ích "chạy riêng BVA" nhỏ
hơn chi phí duy trì 2 bản sao cùng 1 logic test — muốn chạy riêng nhóm nào vẫn dùng
được `--grep "TC-BVA"` trên 1 file gộp, không mất khả năng đó.

### Áp dụng cho FR-09 và FR-16 (chưa viết tại thời điểm quyết định này)

`FR-09/` và `FR-16/` hiện chỉ có `.gitkeep`, thân bài chưa viết. Khi viết spec cho
2 feature này, **áp dụng ngay pattern single-loop** — không lặp lại sai lầm ban đầu
của FR-02 (tách rồi phải gộp lại): mỗi feature 1 file spec, 1 `test.describe`, 1
vòng `for` đọc toàn bộ `cases.json` của feature đó, phân biệt EP/BVA (nếu cần)
bằng điều kiện đọc từ field trong data, không bằng tách file/tách loop. Sơ đồ §3
đã cập nhật phản ánh quy ước này trước.

### Đã thực hiện (FR-02)

- Gộp `login.spec.ts` + `lockout.bva.spec.ts` → 1 file `login.spec.ts` (15 case: 7
  EP + 3 UI-layer + 5 BVA), xoá `lockout.bva.spec.ts`.
- **Verify thật:** `playwright test tests/FR-02 --project=chromium` → 15/15 case
  được sinh, **11 passed / 4 failed**, đúng khớp 4 `knownDefect` đã ghi sẵn trong
  `cases.json` (`BUG-02-001` → TC-03, `BUG-02-003` → TC-06 và TC-BVA-01,
  `PENDING-NEW-password-field-not-masked` → TC-UI-01) — không có regression so với
  trước khi gộp.
- Cập nhật sơ đồ §3 (dòng FR-02/FR-09/FR-16) phản ánh quy ước single-loop.

### Report design — khảo sát Triangle_SUT trước khi chạy P5 (2026-08-08)

**Bối cảnh:** trước khi chạy P5 (9 lần chạy multi-browser), yêu cầu thiết kế cách xuất report sao
cho dễ xem nhất, dựa trên khảo sát `Triangle_SUT/Codes` (project Domain Testing + BVA khác trong
repo, đã có sẵn pipeline report chạy thật).

**Khảo sát Triangle_SUT:** pipeline 3 tầng — (1) Playwright `html` reporter (native, tương tác,
per-test trace); (2) `json` reporter → `gen-results.js` walk `suites/specs/tests` → 1 bảng Markdown
`TC | Expected | Actual | Verdict`; (3) `build-report.js` gộp toàn bộ `*.md` đánh số (`01_..07_`)
thành 1 HTML, inline ảnh base64, render PDF qua Chromium headless (`page.pdf()`) — generic, nhận
`--in/--out/--title/--meta`, không hardcode gì riêng của Triangle. Giới hạn: Triangle chỉ chạy 1
browser nên bảng chỉ có 1 cột Actual — không đủ cho HW04 (3 browser).

**Quyết định:** giữ nguyên kiến trúc 3 tầng, nhưng thay bảng 1-cột-actual bằng **ma trận TC ×
browser** cho từng feature (§3 đã cập nhật). Join key giữa `results.json` và `cases.json` là
**`tc.id`** (không phải parse test title như Triangle) — xác nhận với người dùng trước khi viết
script, vì title Playwright của HW04 (`${tc.id} — ${tc.title}`) có thể đổi câu chữ mô tả trong khi
`id` ổn định.

**Đã thực hiện:**

- `artifacts/playwright.config.ts`: thêm `['json', { outputFile: JSON_OUT }]` vào `reporter`,
  biến `JSON_OUT` song song `HTML_OUT` đã có (per-run, không dùng path mặc định của Playwright).
- `artifacts/scripts/gen-summary.cjs` (mới): đọc 9 `results.json`, join theo `id` với
  `cases.json`, sinh `02_summary.md` (tổng số theo feature) + `03/04/05_results-FR-XX.md` (ma
  trận, cell in đậm + nhãn `⚠ browser-diff` khi 3 browser không đồng nhất) + `06_bugs.md` (index
  trỏ về `bugs/BUG_REPORT.md`, không thay thế).
- `artifacts/scripts/build-report.cjs`: **copy gần nguyên xi** từ `Triangle_SUT/Codes/build-report.js`
  (chỉ đổi `.js` → `.cjs` vì `package.json` HW04 có `"type": "module"`, script dùng `require`) —
  không viết lại vì đã generic sẵn.
- `01_overview.md`, `07_notes.md` (viết tay, không script hoá vì là prose): giải thích oracle =
  spec, lý do dùng ma trận thay vì bảng đơn cột, cách chạy lại từ đầu.
- `package.json`: thêm `devDependency marked`, script `report:summary` / `report:pdf`.

**Chưa chạy thật** (chờ P5): `test-results/**/results.json` chưa tồn tại, nên `gen-summary.cjs`
sẽ in cảnh báo `missing ... — column will show "—"` cho toàn bộ 9 run cho đến khi P5 thực thi xong.
Đây là hành vi mong đợi (script không giả lập dữ liệu).
