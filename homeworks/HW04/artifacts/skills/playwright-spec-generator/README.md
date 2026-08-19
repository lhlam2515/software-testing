# Playwright Spec Generator Skill

Agent skill viết Playwright + TypeScript test script từ test case đã có (hoặc
thiết kế mới qua `domain-testing`): data-driven case file, Page Object/fixtures,
spec với 3 assertion pattern (UI/network/DB), review bằng subagent độc lập, fix
theo review, và checklist xác nhận sau khi chạy thật.

Đây là artifact submission cho §7/§10 của HW04 — bản snapshot đóng gói của
skill sống tại `.agents/skills/playwright-spec-generator/` (nguồn thật, được
Claude Code load qua symlink `.claude/skills/`). Nội dung `SKILL.md` và
`references/` trong thư mục này giống hệt nguồn tại thời điểm nộp bài.

> Lịch sử tên: `playwright-automation-pipeline` (v0.1–v0.4) → `automation-workflow`
> (v0.5, 2026-08-11 — tên cũ chỉ mô tả bước sinh code, trong khi skill đã bao
> gồm cả sourcing/thiết kế test case, tool-check, subagent review, checklist
> chạy multi-browser) → `playwright-spec-generator` (v0.6, 2026-08-11 —
> `automation-workflow` lại quá rộng, ngụ ý skill điều phối cả vòng đời test
> automation thay vì chỉ đúng việc: sinh spec.ts Playwright từ test case đã
> thiết kế). Xem chi tiết ở `CHANGELOG.md`.

## Status

| Version | Trạng thái | Forge tại |
| ------- | ---------- | --------- |
| v0.1 | ✅ Done | Tạo mới qua `skill-creator` — 2026-08-06 |
| v0.2 | ✅ Done | Cô đọng SKILL.md — 2026-08-06 |
| v0.3 | ✅ Done | Sửa description (trigger/keyword) — 2026-08-06 |
| v0.4 | ✅ Done | Retrospective sau khi chạy thật trên FR-09 — 2026-08-06 |
| v0.5 | ✅ Done | Đổi tên `playwright-automation-pipeline` → `automation-workflow` — 2026-08-11 |
| v0.6 | ✅ Done | Đổi tên `automation-workflow` → `playwright-spec-generator` — 2026-08-11 |
| Artifact snapshot | ✅ Done | Đóng gói vào `artifacts/skills/playwright-spec-generator/` cho HW04 §10 — 2026-08-11 |

## Nguồn gốc

Đóng gói từ quy trình automation FR-02 đã chạy thật trong `homeworks/HW04`
(commit `8e3e081`, `8835981`, `32d4f6b`, `e878e25`, `1e14ef4`, `d92fd76`,
`ef5f67e`), tổng quát hoá cho feature bất kỳ thay vì hardcode riêng FR-02.
Khác với quy trình gốc, skill này bổ sung 4 điểm không có ở bản thủ công:
AskUserQuestion để xác định nguồn test case ở bước đầu, tool-check trước khi
gọi bất kỳ tool nào, review bắt buộc bằng subagent độc lập (không inline), và
checklist xác nhận pass/fail + data-driven + reusable + DRY ở bước cuối. Sau
đó tiếp tục được tinh chỉnh qua v0.2–v0.4 dựa trên phản hồi thật (xem
`CHANGELOG.md`), gần nhất là retrospective sau lần chạy thật trên FR-09.

## Những gì skill tự động hoá

`SKILL.md` định nghĩa pipeline 9 phase, mỗi phase tiêu thụ output của phase
trước:

1. **Locate/design test case** — đọc `domain-testing.md`/`bva.md`/`cases.json`
   có sẵn, hoặc hỏi qua `AskUserQuestion` và gọi skill `domain-testing` nếu
   chưa có test case nào.
2. **Tool/environment check** — xác nhận node/npx, `@playwright/test`,
   browser binary, SUT đang chạy, git — trước khi gọi bất kỳ tool nào.
3. **Data-driven case file** — tách test data ra file `.csv`/`.json` riêng,
   không hardcode trong spec.
4. **Fixtures/Page Object** — khảo sát UI thật, viết fixtures/POM tái sử dụng
   được.
5. **Spec skeleton (UI assertion only)** — chạy được trước khi thêm assertion
   phức tạp, để tách lỗi harness khỏi lỗi assertion.
6. **Layered assertions (network + DB)** — thêm 2 pattern còn lại theo
   `references/assertion-patterns.md`, xử lý race condition/timing.
7. **Independent subagent review** — bắt buộc qua tool `Agent`, không tự
   review inline.
8. **Fix theo review**.
9. **Final run + checklist** — xác nhận pass/fail trung thực, data-driven,
   reusable, DRY Arrange-Act-Assert; chạy multi-browser (Chromium/Firefox/
   Edge) và xuất HTML report có `Run by: {StudentID}`.

## Cấu trúc

```text
playwright-spec-generator/
├── SKILL.md                        # 9 phase: sourcing → tool-check → data
│                                    # → fixtures → spec skeleton → assertions
│                                    # → subagent review → fix → checklist
├── references/
│   ├── cases-schema.md             # schema case file + nguyên tắc "assert theo spec"
│   ├── assertion-patterns.md       # 3 assertion pattern + race condition/timing
│   └── review-subagent-prompt.md   # template prompt cho subagent ở Phase 6
├── README.md
└── CHANGELOG.md
```

## Vị trí (bản sống, không phải artifact này)

Nguồn thật tại `.agents/skills/playwright-spec-generator/`, symlink vào
`.claude/skills/playwright-spec-generator` — đúng convention 2 file/1
nguồn đang dùng cho các skill khác của project (`domain-testing`,
`fr-execution`, `playwright-cli`, `commit`). Thư mục hiện tại
(`artifacts/skills/playwright-spec-generator/`) chỉ là bản sao tĩnh phục vụ
nộp bài; sửa skill thì sửa ở nguồn, không sửa ở đây.
