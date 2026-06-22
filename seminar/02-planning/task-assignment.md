# T10 Seminar — Kế hoạch phân công 2 thành viên & cân bằng commit log

> Topic: **T10 — Mutation Testing & Test Effectiveness** · Tool: **StrykerJS + Claude/ChatGPT** · SUT: **EShop**.
> Nhóm: **2 thành viên** — Lâm (M1) · Vũ (M2). Cập nhật: 2026-06-22.
> Phụ thuộc tài liệu nguồn: [prep-plan.md](prep-plan.md), [seminar-workflow.md](../00-brief/seminar-workflow.md), [content-outline.md](content-outline.md).

> ### 🎯 Mốc cứng (đã chốt)
> | Mốc | Ngày | Ghi chú |
> |---|---|---|
> | **User_Guide nộp** | **2026-07-08 (T4)** | Hard — buộc dồn toàn bộ technical baseline + mutation vào 2 tuần đầu |
> | **Pre-share Moodle** (D−3 ngày làm việc) | **2026-07-17 (T6)** | Đẩy User_Guide + Screencast + Worksheet + Slides |
> | **D-day — Seminar live** | **2026-07-22 (T4)** | Trùng buổi học Kiểm thử sáng T4 |
> | **AI Audit nộp** (D+5 ngày làm việc) | **2026-07-29 (T4)** | AI-02 / AI-03 / AI-04 |

---

## 0. Triết lý phân công: cross-functional, không silo

**Nguyên tắc:** Cả hai cùng đụng vào **technical lẫn artifacts**. Không có chuyện một người chỉ code, một người chỉ viết docs.

**Vì sao bắt buộc thế (không phải cho công bằng hình thức):**

- Quy chế §S3: **mọi thành viên phải demo tool unaided.** M2 không viết test / không chạy mutation → không thể demo → mất điểm.
- §6 live ghép vai (2 người gánh 4 vai) → cả hai phải hiểu toàn bộ nội dung để trả lời Q&A và thay vai nhau.
- Hiểu thì mới viết tài liệu đúng. Người viết Failure Modes phải là người *quan sát* được failure mode thật khi chạy tool.

**Mô hình: Lát cắt dọc + Owner/Reviewer.**

- Chia SUT thành **2 cụm module**. Mỗi người **sở hữu trọn vẹn 1 cụm**: code → baseline test → mutation → AI synthesis → tài liệu của cụm đó. Đây là cách mỗi người tự hiểu sâu một mạch end-to-end.
- Mỗi item có **Owner (O)** — làm chính, commit — và **Reviewer (R)** — đọc, đối chứng, góp ý. Reviewer đảm bảo cả hai hiểu phần của nhau.

| Cụm | Owner | Module EShop | Vì sao |
|---|---|---|---|
| **Cụm A** | **Lâm (M1)** | `apply-coupon` (FR-09) + `auth/login` (FR-02) | Coupon có sẵn 2 bug → ngôi sao của demo & narrative (seminar-critical) |
| **Cụm B** | **Vũ (M2)** | `order-status` (FR-10) + `cart/checkout` (FR-08) | State machine + tính toán → giàu mutant, độc lập với cụm A |

> M1 vẫn nghiêng phần seminar-critical (coupon là tâm điểm demo), M2 vẫn nghiêng artifacts (sở hữu nhiều tài liệu hơn). Nhưng **mỗi người đều có commit code thật và commit docs thật** → log phản ánh đúng cộng tác hai chiều.

---

## 1. Cân bằng commit log

**Mâu thuẫn thật:** việc technical cô đặc (ít commit, nặng), việc docs dàn trải (nhiều commit, nhẹ). Cross-functional giải quyết luôn cả việc này: vì mỗi người làm cả hai loại, commit của mỗi người tự nhiên trộn code + docs → không ai bị "kẹt" ở một dạng commit.

**5 luật commit cho cả nhóm:**

1. **Mỗi người commit bằng git identity riêng.** Không commit hộ. `git shortlog -sn` là thứ TA nhìn đầu tiên.
2. **Atomic commit** — mỗi commit một đơn vị hoàn chỉnh. Chia nhỏ; tránh dồn cục cuối tuần.
3. **Owner commit phần mình; Reviewer commit phần review** nếu sửa thực chất (vd: thêm test case, sửa assertion) — không chỉ "approve miệng".
4. Mỗi người giữ **tỉ lệ commit code ≈ commit docs** của riêng mình → cả hai đều thể hiện năng lực kỹ thuật lẫn viết lách.
5. **Parity check hàng tuần** (§7). Mục tiêu: số commit chênh ≤ 20%; không cần ngang dòng code.

---

## 2. Phân công chi tiết (Owner / Reviewer)

### Track kỹ thuật — cả hai đều làm

| Mã | Việc | Stage | Owner | Reviewer |
|---|---|---|---|---|
| T1 | Refactor `server.js`: `module.exports = app` + guard `require.main` | S3 | M1 | M2 |
| T2 | Cài jest + supertest + stryker; `jest.config.js` + `stryker.config.mjs` | S3 | M1 | M2 |
| T3a | Baseline supertest **cụm A**: coupon + auth | S3 | M1 | M2 |
| T3b | Baseline supertest **cụm B**: order-status + cart | S3 | **M2** | M1 |
| T4 | Chạy baseline mutation toàn bộ, ghi `BASELINE.md` (coverage + MS) | S3 | M1 | M2 |
| T5a | Phân loại survivor + chọn mutant **cụm A** (2 mutant) | S3 | M1 | M2 |
| T5b | Phân loại survivor + chọn mutant **cụm B** (1–2 mutant) | S3 | **M2** | M1 |
| T6a | Viết kill assertion cho survivor **cụm A**, xác nhận MS tăng | S3 | M1 | M2 |
| T6b | Viết kill assertion cho survivor **cụm B**, xác nhận MS tăng | S3 | **M2** | M1 |
| T7a | AI assertion synthesis + **validation gate** trên survivor cụm A | S3 | M1 | M2 |
| T7b | AI assertion synthesis + **validation gate** trên survivor cụm B | S3 | **M2** | M1 |
| T8 | Đo metric (setup/run time, MS gain) + AI triage equivalent-mutant | S3 | M2 | M1 |
| T9 | Dựng **sandbox "Kill the Mutant"** (tally ≤4'); mỗi người góp mutant từ cụm mình | S5 | M1 | M2 |

> Kết quả: M2 viết test thật, tự chạy Stryker, tự chạy AI synthesis trên cụm B → **đủ năng lực demo unaided**. M1 review cụm B, M2 review cụm A → cả hai nắm toàn SUT.

### Track artifacts — cả hai đều viết

| Mã | Artifact | Stage | Owner | Reviewer | Ghi chú |
|---|---|---|---|---|---|
| F1 | User_Guide §1 Intro + §2 Installation | S4 | M2 | M1 | M2 viết Installation từ setup của M1 (T2) → cùng nắm toolchain |
| F2 | User_Guide §3 First Test (walkthrough trên coupon) | S4 | **M1** | M2 | M1 viết vì sở hữu demo coupon |
| F3 | User_Guide §4 Advanced + §5 Troubleshooting + §7 References | S4 | M2 | M1 | |
| F4 | User_Guide §6 **Failure Modes (≥3)** | S4 | **M1** | M2 | M1+M2 mỗi người góp mode từ cụm mình |
| G1 | `Seminar_Slides.pptx` ≤15 slide (nội dung từ outline) | S6 | M2 | M1 | M1 cấp số liệu before/after từ T4, T8 |
| D1 | Script demo ≤10' (ép cả Stryker + AI) | S6 | **M1** | M2 | M1 thao tác, M2 timekeeper |
| E1 | `Activity_Worksheet.md` + answer key | S5 | M2 | **M1** | M1 cấp 5 mutant từ sandbox T9 |
| E2 | Cheat-sheet 1 trang + bản in worksheet | S5 | M2 | M1 | |
| H1 | Đóng gói + đẩy Moodle (đúng D−3) | S5 | M2 | M1 | checklist chung |
| I1 | `Audience_Feedback_Aggregated.md` | S7 | M2 | M1 | |
| I2 | `[AI-02]` Audit Report (5 mục ≥600 từ) | S8 | M2 | **M1** | M1 viết phần kỹ thuật metric/AI gate |
| I3 | `[AI-03]` Disclosure (ký từng người) + `[AI-04]` Reflective | S8 | M2 | M1 | mỗi người tự ký + tự viết phần mình |
| I4 | `Final_Reflection.md` + `Peer_Review.md` ×2 | S8 | M1+M2 | — | mỗi người viết reflection riêng |

> **Đối xứng có chủ đích:** M1 (chủ yếu technical) vẫn viết F2, F4, D1, I2-technical (làm chủ narrative); M2 (chủ yếu artifacts) vẫn viết T2, T3b, T5b–T7b (hiểu tool tay). Không ai bị nhốt một phía.

---

## 3. Handoff & chống idle

Vì cross-functional, **phụ thuộc giảm mạnh** — M2 không còn ngồi chờ M1 vì đã có cụm B của riêng mình để chạy song song. Các handoff còn lại:

```
T1 (export app) + T2 (toolchain)  ─→ T3a, T3b (cả hai test được)   [ưu tiên tuyệt đối P0]
T5a + T5b (survivors)             ─→ F4 (failure modes, mỗi người góp 1+)
T8 (metrics)                      ─→ G1 (slide số liệu)
T9 (sandbox 5 mutant)             ─→ E1 (worksheet + answer key)
```

**Lưu ý handoff mới:** M1 ôm cả T1 + T2 → Vũ (cụm B) bị chặn cho tới khi T2 (cài jest/supertest) xong. **M1 phải làm T1 + T2 trong 1–2 ngày đầu P0** rồi Vũ mới chạy được T3b. Sau đó hai cụm chạy song song độc lập, không ai chặn ai.

---

## 4. Bảng cân đối commit (mục tiêu ~ngang)

| | M1 (Lâm) | M2 (Vũ) |
|---|---|---|
| **Commit code** | T1, T2, T3a, T4, T6a, T7a, T9 | T3b, T6b, T7b |
| **Commit docs/phân tích** | T5a, F2, F4, D1, I2-tech, I4 | T5b, T8, F1, F3, G1, E1, E2, I1, I2, I3, I4 |
| **Tổng ước tính** | **~13** | **~14** |
| Đặc điểm | nhiều code + narrative docs | ít code hơn + nhiều docs |

> M1 giờ ôm thêm T2 → chênh lệch **code commit** giãn ra (M1 7 vs M2 3). Vẫn ổn vì M2 còn T3b/T6b/T7b (vẫn viết test + chạy mutation thật, không silo). Bù lại M2 trội về **docs commit**. Tổng commit vẫn ~ngang. Nếu cuối Phase 2 chênh > 20%: chuyển E2 hoặc I1 sang M1, hoặc M1 tách nhỏ T6a/T7a.

---

## 5. Timeline tuyệt đối (D-day = 2026-07-22)

> Deadline 08/07 (User_Guide) là **forcing function** — kéo toàn bộ technical baseline + mutation về 2 tuần đầu. Mọi thứ sau 08/07 là demo, activity, slides, screencast.
> ⚠️ **Lưu ý lịch học:** từ 29/06, **Thứ Tư bị block cả ngày** (2 ca học), **Thứ Sáu chiều** có lớp → deep work dồn vào sáng Mon/Tue/Thu/Sat + sáng Fri.

| Phase | Khoảng ngày | M1 (Lâm) — cụm A | M2 (Vũ) — cụm B | Mốc chốt |
|---|---|---|---|---|
| **P0 — Setup** | 22/06 → 28/06 *(còn kỳ nghỉ, deep work tốt)* | **T1 + T2 trước (ngày 1–2)**, rồi T3a (coupon+auth test) | T3b (order+cart test) — *bắt đầu sau khi T2 xong* | **28/06: baseline test xanh cả 2 cụm** |
| **P1 — Mutation+AI** | 29/06 → 05/07 | T4 (baseline run + BASELINE.md), T5a, T6a, T7a | T5b, T6b, T7b, T8 (metrics) | **05/07: có đủ survivor + failure modes + metrics** |
| **P2 — User_Guide sprint** | 05/07 → **08/07** | F2 (§3 First Test), F4 (§6 Failure Modes) | F1 (§1–2), F3 (§4–5–7) | **🎯 08/07: nộp User_Guide** |
| **P3 — Demo+Activity+Slides** | 09/07 → 15/07 | T9 (sandbox), D1 (demo script), quay screencast | E1 (worksheet+key), G1 (slides), dựng video | Dry-run activity trước 15/07 |
| **P4 — Pre-share** | 16/07 → **17/07** | Rehearse full 45' + backup recording | E2 (cheat-sheet), **H1 đẩy Moodle ≤ 17/07** | **🎯 17/07: pre-share Moodle** |
| **P5 — Đệm + Live** | 18/07 → **22/07** | Rehearse chéo vai | Rehearse chéo vai | **🎯 22/07: seminar live** |
| **P6 — Post** | 23/07 → **29/07** | I2 phần kỹ thuật, I4 reflection riêng | I1, I2, I3, I4 | **🎯 29/07: nộp AI Audit pack** |

> **Đệm 18–21/07:** cố ý chừa 4 ngày giữa pre-share và live để sửa lỗi phát sinh từ feedback pre-share + rehearse. Không xếp việc mới.
> **Điểm căng nhất:** P0+P1 chỉ ~2 tuần để dựng toàn bộ technical, mà 29/06–05/07 đã vướng lịch học. Nếu T1 (refactor) hoặc baseline test trượt khỏi 28/06 → User_Guide 08/07 lập tức gặp rủi ro. Ưu tiên tuyệt đối tuần 22–28/06.

---

## 6. Phân vai buổi live (2 người, 4 vai chuẩn)

| Phân đoạn | Lâm (M1) | Vũ (M2) |
|---|---|---|
| Pitch (10') | Chuyển slide kỹ thuật + bổ sung | **Presenter** |
| Demo (10') | **Demoer** (terminal thật) | Timekeeper + thao tác slide |
| Activity (20') | Chạy sandbox tally kills | **Facilitator** điều phối |
| Q&A (5') | Câu hỏi kỹ thuật cụm A | Câu hỏi cụm B + redirect |

> Vì cross-functional, **mỗi người trả lời được câu hỏi cụm của mình** và rehearse chéo để thay vai khi cần.

---

## 7. Theo dõi parity (chạy hàng tuần)

```bash
# Số commit mỗi người
git shortlog -sn --all

# Tỉ lệ code vs docs mỗi người (đếm file đổi theo đuôi)
for who in "Lâm" "Vũ"; do
  code=$(git log --author="$who" --name-only --pretty=format: | grep -cE '\.(js|mjs|ts)$')
  docs=$(git log --author="$who" --name-only --pretty=format: | grep -cE '\.md$')
  echo "$who → code:$code docs:$docs"
done
```

**Cuối mỗi phase:** kiểm 2 trục — (1) tổng commit chênh ≤ 20%; (2) mỗi người có **cả** commit code lẫn docs. Nếu một người thiếu một trục → rebalance trước khi sang phase sau.

---

## 8. Rủi ro & cách chặn

| Rủi ro | Hệ quả | Chặn bằng |
|---|---|---|
| M2 không hiểu tool, không demo được | Mất điểm §S3 unaided | Cross-functional: M2 sở hữu cụm B end-to-end |
| Một người dồn hết technical / hết docs | Lệch hiểu biết + lệch log | Owner/Reviewer + kiểm 2 trục §7 |
| Thiếu §6 Failure Modes | **Auto-penalty** | T5a+T5b là blocker cho F4; mỗi người góp ≥1 mode |
| Demo thiếu Stryker hoặc AI | **Auto-penalty** | D1 ép cả 2 feature; rehearse có checklist |
| Worksheet không xong ≤25' | **Auto-penalty** | Dry-run trước D−5 (M1 chạy sandbox, M2 đóng audience) |
| Commit dồn cục cuối kỳ | Log lệch | Atomic commit + parity check hàng tuần |
