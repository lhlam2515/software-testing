# Playwright Automation Pipeline Skill

Agent skill viết Playwright + TypeScript test script từ test case đã có (hoặc
thiết kế mới qua `domain-testing`): data-driven case file, Page Object/fixtures,
spec với 3 assertion pattern (UI/network/DB), review bằng subagent độc lập, fix
theo review, và checklist xác nhận sau khi chạy thật.

## Status

| Version | Trạng thái              | Forge tại                                       |
| ------- | ------------------------ | ------------------------------------------------ |
| v0.1    | ✅ Done                  | Tạo mới qua `skill-creator` — 2026-08-06          |
| v0.2    | ✅ Done                  | Cô đọng SKILL.md — 2026-08-06                     |
| v0.3    | ✅ Done                  | Sửa description (trigger/keyword) — 2026-08-06    |

## Nguồn gốc

Đóng gói từ quy trình automation FR-02 đã chạy thật trong `homeworks/HW04`
(commit `8e3e081`, `8835981`, `32d4f6b`, `e878e25`, `1e14ef4`, `d92fd76`,
`ef5f67e`), tổng quát hoá cho feature bất kỳ thay vì hardcode riêng FR-02.
Khác với quy trình gốc, skill này bổ sung 4 điểm không có ở bản thủ công:
AskUserQuestion để xác định nguồn test case ở bước đầu, tool-check trước khi
gọi bất kỳ tool nào, review bắt buộc bằng subagent độc lập (không inline), và
checklist xác nhận pass/fail + data-driven + reusable + DRY ở bước cuối.

## Cấu trúc

```text
playwright-automation-pipeline/
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

## Vị trí

Nguồn tại `.agents/skills/playwright-automation-pipeline/`, symlink vào
`.claude/skills/playwright-automation-pipeline` — đúng convention 2 file/1
nguồn đang dùng cho các skill khác của project (`domain-testing`,
`fr-execution`, `playwright-cli`, `commit`).
