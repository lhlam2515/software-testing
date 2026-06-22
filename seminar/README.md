# T10 Seminar — Mutation Testing & Test Effectiveness

> **Dashboard điều phối toàn bộ seminar.** Mở file này đầu tiên mỗi session.
> Cập nhật trạng thái thủ công khi qua mỗi gate.

| | |
|---|---|
| **Topic** | T10 — Mutation Testing & Test Effectiveness |
| **Tool** | StrykerJS (traditional) + Claude/ChatGPT (AI-augmented assertion synthesis) |
| **SUT** | EShop Node.js backend (`apps/backend/server.js`) |
| **Nhóm** | Lâm (M1) · Vũ (M2) |
| **🎯 D-day (live)** | **22/07/2026** |
| **Course** | CSC13003 Software Testing — Seminar Track |

---

## Cấu trúc thư mục

```
seminar/
├── README.md           ← bạn đang ở đây (dashboard)
├── 00-brief/           INPUT từ course — read-only, không sửa
├── 01-research/        Kiến thức nền + clip hội thoại AI
├── 02-planning/        Working docs PM — sửa liên tục
└── 03-deliverables/    OUTPUT nộp Moodle — giữ tên file gốc
```

| Folder | Nội dung | Quyền |
|--------|----------|-------|
| [`00-brief/`](00-brief/) | `seminar-guide` · `seminar-workflow` · `topic-t10` · `activity-deck` | Course-given, read-only |
| [`01-research/`](01-research/) | `mutation-testing-reference` + `clips/` | Nhóm tích lũy |
| [`02-planning/`](02-planning/) | `content-outline` · `prep-plan` · `task-assignment` · `weekly-checklist` | Nhóm, live |
| [`03-deliverables/`](03-deliverables/) | tên file **cố định theo course** (PascalCase) | Nhóm, nộp bài |

> ⚠️ **Không đổi tên file trong `03-deliverables/`** — course quy định tên nộp Moodle cố định (xem `00-brief/seminar-guide.md` §4 Deliverables Checklist).

---

## Trạng thái Deliverables

Nguồn chuẩn: `00-brief/seminar-guide.md` §4. Trạng thái: ✅ có draft · 🟡 đang làm · ⬜ chưa bắt đầu.

| Deliverable | Stage | Vị trí | Trạng thái |
|-------------|-------|--------|-----------|
| `Tool_Survey_Proposal.md` | S1 | [03-deliverables](03-deliverables/Tool_Survey_Proposal.md) | ✅ draft |
| `User_Guide.md` (≥6 sections) | S4 | [03-deliverables](03-deliverables/User_Guide.md) | 🟡 skeleton |
| `Demo_Screencast.mp4` (5–8 min) | S4 | _binary, ngoài repo_ | ⬜ |
| `Activity_Worksheet.md` | S5 | [03-deliverables](03-deliverables/Activity_Worksheet.md) | ✅ draft |
| `Seminar_Slides.pptx` (≤15) | S6 | source: [Seminar_Slides_content.md](03-deliverables/Seminar_Slides_content.md) | 🟡 content có, chưa build pptx |
| `Audience_Feedback_Aggregated.md` | S7 | [03-deliverables](03-deliverables/Audience_Feedback_Aggregated.md) | 🟡 skeleton |
| `AI-02` Audit Report (≥600w) | S8 | [03-deliverables](03-deliverables/AI-02_ai-audit-report.md) | 🟡 skeleton |
| `AI-03` Disclosure (ký/người) | S8 | [03-deliverables](03-deliverables/AI-03_ai-disclosure-form.md) | 🟡 skeleton |
| `AI-04` Reflective (300w EN) | S8 | [03-deliverables](03-deliverables/AI-04_ai-reflective-statement.md) | 🟡 skeleton |
| `Final_Reflection.md` (300w EN) | S8 | [03-deliverables](03-deliverables/Final_Reflection.md) | 🟡 skeleton |
| `Peer_Review.md` ×2 | post | [03-deliverables](03-deliverables/Peer_Review.md) | 🟡 skeleton |
| `BASELINE.md` (metrics) | S3 | [01-research](01-research/BASELINE.md) | 🟡 skeleton |

---

## Gates theo tuần

Chi tiết task: [02-planning/weekly-checklist.md](02-planning/weekly-checklist.md) · Phân công: [02-planning/task-assignment.md](02-planning/task-assignment.md)

| Tuần | Khoảng | Phase | 🚦 Gate |
|------|--------|-------|--------|
| 1 | 22/06 → 28/06 | P0 Setup | 4 route có test xanh · ghi coverage baseline |
| 2 | 29/06 → 05/07 | P1 Mutation + AI | `BASELINE.md` xong · ≥3 survivor + ≥3 failure mode |
| 3 | 06/07 → 12/07 | P2 User_Guide + P3 mở màn | User_Guide nộp · sandbox chạy · worksheet có answer key |
| 4 | 13/07 → 19/07 | P3 + P4 Pre-share | 4 artifact lên Moodle (17/07) · activity dry-run đạt timing |
| 5 | 20/07 → 26/07 | **P5 Live (22/07)** + P6 | feedback tổng hợp · AI-02 khung · AI-03/04 nháp |
| 6 | 27/07 → 29/07 | P6 hoàn tất | toàn bộ artifact nộp · final parity `git shortlog -sn` |

---

## Quy ước

- **Naming:** `00-02/` dùng `kebab-case`. `03-deliverables/` giữ tên course (`PascalCase_Snake`).
- **Parity commit:** mỗi gate kiểm `git shortlog -sn` — chênh lệch giữa 2 thành viên ≤ 20%.
- **Tài liệu nguồn không sửa:** mọi file trong `00-brief/` là bản sao từ course; chỉnh sửa → tạo bản phái sinh trong `02-planning/`.
