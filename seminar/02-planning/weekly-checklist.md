# T10 Seminar — Checklist tiến độ theo tuần

> Track theo tick-box. Mã task `[Txx]/[Fx]/...` ánh xạ sang [task-assignment.md](task-assignment.md).
> D-day = **22/07/2026**. Nhóm: **Lâm (M1)** · **Vũ (M2)**. `[R]` = việc review để cùng hiểu phần của nhau.
> Mỗi tuần có **Gate** cuối tuần — không sang tuần sau khi gate chưa đạt.

---

## Tuần 1 · 22/06 → 28/06 · P0 Setup
**Milestone: baseline test xanh cả 2 cụm.** *(Còn kỳ nghỉ — deep work tốt nhất, tận dụng tối đa.)*

### Lâm (M1)
- [ ] `[T1]` Refactor `server.js`: `module.exports = app` + guard `if (require.main === module)` — **ngày 1**
- [ ] `[T2]` Cài jest + supertest + @stryker-mutator/core + jest-runner; tạo `jest.config.js` + `stryker.config.mjs` — **ngày 1–2** ⚠️ blocker cho Vũ
- [ ] **Báo Vũ ngay khi T2 xong** để Vũ khởi động T3b
- [ ] `[T3a]` Viết supertest baseline cụm A: `apply-coupon` (FR-09) + `auth/login` (FR-02); chạy xanh
- [ ] `[R]` Review T3b của Vũ (đọc test order-status / cart)

### Vũ (M2)
- [ ] *Trong lúc chờ T2:* đọc `server.js`, nắm 4 route ưu tiên + 2 bug coupon (BUG-A `>` vs `>=`, BUG-B công thức percent)
- [ ] `[T3b]` Viết supertest baseline cụm B: `order-status` (FR-10) + `cart/checkout` (FR-08); chạy xanh
- [ ] `[R]` Review T1 + T2 của Lâm (hiểu setup app + cấu hình stryker/jest)

**🚦 Gate 28/06:** cả 4 route có test xanh · ghi line/branch coverage baseline · `git shortlog -sn` kiểm cả 2 đã có commit.

---

## Tuần 2 · 29/06 → 05/07 · P1 Mutation + AI
**Milestone: đủ survivor + failure modes + metrics (cấp dữ liệu cho User_Guide).** ⚠️ *Lịch học bắt đầu: T4 block cả ngày, T6 chiều — dồn việc vào sáng Mon/Tue/Thu/Sat.*

### Lâm (M1)
- [x] `[T4]` Chạy baseline mutation toàn bộ (`mutate: server.js`, `coverageAnalysis: perTest`); ghi `BASELINE.md` (coverage + mutation score)
- [x] `[T5a]` Đọc HTML report cụm A; phân loại survivor; chọn 2 mutant (gồm BUG-A/BUG-B coupon)
- [x] `[T6a]` Viết kill assertion cho 2 survivor cụm A; chạy lại xác nhận MS tăng
- [x] `[T7a]` AI assertion synthesis cụm A + **validation gate** (PASS gốc / FAIL mutant)
- [ ] Ghi **≥2 failure mode** Stryker quan sát từ cụm A → cấp cho F4 *(chưa làm — `User_Guide.md` §6 Failure Modes vẫn skeleton, xem ghi chú trong `BASELINE.md` mục 4b)*
- [ ] `[R]` Review T5b / T7b của Vũ *(peer review chưa xảy ra, xem `baseline-completion-checklist.md` mục 9)*

### Vũ (M2)
- [x] `[T5b]` Phân loại survivor cụm B; chọn 1–2 mutant (order-status / cart)
- [x] `[T6b]` Viết kill assertion cho survivor cụm B; xác nhận MS tăng
- [x] `[T7b]` AI assertion synthesis cụm B + **validation gate**
- [x] `[T8]` Đo metric (setup time, run time, MS gain/test AI) + AI triage equivalent-mutant
- [ ] Ghi **≥1 failure mode** Stryker từ cụm B → cấp cho F4 *(chưa làm — cùng gap với cụm A)*
- [ ] `[R]` Review T4 `BASELINE.md` + T5a / T7a của Lâm *(peer review chưa xảy ra)*

**🚦 Gate 05/07:** `BASELINE.md` xong · ≥3 survivor đã phân tích · ≥3 failure mode đã ghi · metrics đủ → **sẵn sàng viết User_Guide** · parity check `git shortlog -sn`.

---

## Tuần 3 · 06/07 → 12/07 · P2 User_Guide sprint + P3 mở màn

### Phần A · 06–08/07 — sprint User_Guide 🎯
#### Lâm (M1)
- [ ] `[F2]` User_Guide **§3 First Test** — walkthrough end-to-end trên coupon (≤15 bước)
- [ ] `[F4]` User_Guide **§6 Failure Modes** — tổng hợp ≥3 mode (mình + Vũ góp)
- [ ] `[R]` Review F1 / F3 của Vũ trước khi nộp

#### Vũ (M2)
- [ ] `[F1]` User_Guide **§1 Introduction** + **§2 Installation** (lệnh chính xác, ≥1 screenshot)
- [ ] `[F3]` User_Guide **§4 Advanced** + **§5 Troubleshooting** (≥3 lỗi thật + fix) + **§7 References**
- [ ] `[R]` Review F2 / F4 của Lâm

#### Chung
- [ ] 🎯 **08/07: hợp nhất — kiểm đủ 7 mục + Failure Modes ≥3 + references có nguồn → nộp `User_Guide.md`**

### Phần B · 09–12/07 — bắt đầu demo/activity
#### Lâm (M1)
- [ ] `[T9]` Dựng sandbox "Kill the Mutant": chọn 5 mutant từ checkout/coupon, script tally kills ≤4'
- [ ] `[D1]` Viết script demo ≤10' (ép **cả** Stryker + AI feature)

#### Vũ (M2)
- [ ] `[E1]` `Activity_Worksheet.md` + **answer key** (reproducible ≤25', không cần nhóm hỗ trợ)
- [ ] `[G1]` Bắt đầu `Seminar_Slides.pptx` (≤15 slide theo outline)

**🚦 Gate 12/07:** User_Guide đã nộp · sandbox chạy được · worksheet có answer key · slides có khung.

---

## Tuần 4 · 13/07 → 19/07 · P3 hoàn tất + P4 Pre-share 🎯

### Lâm (M1)
- [ ] Quay `Demo_Screencast.mp4`: terminal thật, narration EN, không nhạc
- [ ] Quay **backup recording** cho live demo (phòng mạng/máy hỏng)
- [ ] Rehearse demo end-to-end, bấm giờ ≤10'
- [ ] `[R]` Review E1 worksheet + G1 slides của Vũ

### Vũ (M2)
- [ ] `[G1]` Hoàn thiện slides (số liệu before/after từ T4 / T8)
- [ ] `[E2]` Cheat-sheet 1 trang + bản in worksheet
- [ ] Dựng/cắt video screencast, kiểm **≤100MB**
- [ ] `[H1]` 🎯 **17/07: đẩy Moodle** — User_Guide + Screencast + Worksheet + Slides

### Chung
- [ ] **Dry-run activity** nội bộ (Lâm chạy sandbox, Vũ đóng audience) — verify timing ≤25'
- [ ] Phân vai + rehearse chéo (mỗi người thay được vai người kia)

**🚦 Gate 17/07:** 4 artifact đã lên Moodle đúng hạn · activity đã dry-run đạt timing · parity check.

---

## Tuần 5 · 20/07 → 26/07 · P5 Live 🎯 + P6 mở màn

### 20–21/07 — chốt
- [ ] **Chung:** Rehearse full **45'** (pitch 10 + demo 10 + activity 20 + Q&A 5)
- [ ] **Chung:** Chuẩn bị backup (mạng hỏng / máy hỏng / audience không cài được env)

### 22/07 — 🎯 SEMINAR LIVE
- [ ] **Vũ:** Presenter (pitch) + Facilitator (activity)
- [ ] **Lâm:** Demoer + chạy sandbox tally + Q&A kỹ thuật
- [ ] **Chung:** Thu minute-paper từ các nhóm audience

### 23–26/07 — post
#### Vũ (M2)
- [ ] `[I1]` `Audience_Feedback_Aggregated.md` (gom minute-paper)
- [ ] `[I2]` Bắt đầu `[AI-02]` Audit Report (5 mục)
- [ ] `[I3]` `[AI-03]` Disclosure (ký tên) + `[AI-04]` Reflective (300 từ)

#### Lâm (M1)
- [ ] `[I2]` Viết phần kỹ thuật AI-02 (metric, AI validation gate)
- [ ] `[I4]` `Final_Reflection.md` riêng (300 từ)

**🚦 Gate 26/07:** feedback đã tổng hợp · AI-02 có khung 5 mục · AI-03/04 nháp xong.

---

## Tuần 6 · 27/07 → 29/07 · P6 hoàn tất 🎯

### Chung
- [ ] `[I2]` Hoàn thiện AI-02 **≥600 từ, đủ 5 mục**
- [ ] `[I4]` `Peer_Review.md` ×2 (≥3 strengths + ≥3 suggestions + 1 câu hỏi/nhóm partner)
- [ ] Mỗi người tự ký `[AI-03]`
- [ ] 🎯 **29/07: nộp đủ AI Audit pack (AI-02 / AI-03 / AI-04)**

**🚦 Gate 29/07:** toàn bộ artifact đã nộp · final parity check `git shortlog -sn` (chênh ≤ 20%, cả 2 đều có commit code + docs).

---

## Bảng mốc cứng (tham chiếu nhanh)

| Ngày | Mốc |
|---|---|
| 28/06 | Baseline test xanh cả 2 cụm |
| 05/07 | Mutation + AI + metrics xong |
| **08/07** | 🎯 Nộp User_Guide.md |
| **17/07** | 🎯 Pre-share Moodle |
| **22/07** | 🎯 Seminar live |
| **29/07** | 🎯 Nộp AI Audit pack |
