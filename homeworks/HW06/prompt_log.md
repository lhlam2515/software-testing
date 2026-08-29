# Prompt Log - HW06

**Student:** Lê Hoàng Lâm (23127216)
**Assignment:** HW06-AI: API Testing on EShop

**Format:** Each entry = Tool · Timestamp · Prompt (verbatim) · AI Output (verbatim or artifact ref)

## Logging Rules

- Record the AI tool and model, ISO timestamp with timezone, exact prompt, and exact output for each logged interaction.
- Preserve prompts and outputs verbatim. Do not reconstruct them from memory.
- Link each entry to its affected artifact and corresponding AI Audit section.
- Entries 001 to 006 cover Pass 1 (design-time generation and audit, 20/08). Entries 007 to 016 cover Pass 2 (re-audit, rebuild, execution, and the remaining submission artifacts, 29/08).
- Pass 2 prompts and outputs were copied straight out of the session JSONL under `~/.claude/projects/` by script, not retyped, so what appears below is the exact text of the turn.
- Timestamps below are reconstructed from session transcripts (`~/.codex/sessions/`, `~/.claude/projects/`) and cross-checked against the git commit that followed each interaction (`git log --date=iso-strict`); both sources agree to within the minutes it took to review/commit.

---

## Entry 001 | `2026-08-20T18:34:57+07:00`

**Tool and model:** Claude Code (Sonnet 5)

**Task:** FR-02 Login and Account Lockout, test-case generation

### Prompt (verbatim)

```
Invoke the `api-test-generator` skill for one endpoint. Do not answer this from general knowledge — follow the skill's own workflow file and stage references; read each stage reference immediately before performing that stage, not all at once.

## Endpoint identity

- FR id: FR-02 (Login & Account Lockout)
- HTTP method / path: `POST /api/login`
- Contract source: `docs/eshop-sut/api_specification.md`, section 1.2
- Requirement source: `docs/eshop-sut/srs.md`, FR-02
- Output base: `homeworks/HW06/artifacts/test-cases/`
- `<api-slug>`: `fr-02-login`

## Mandatory coverage groups

Treat these as the minimum obligations to trace back to in the design catalogs — do not treat them as the full list; extract every parameter and rule from the contract/SRS independently and add whatever the spec supports beyond this:

- **Domain partition:** email format (valid / invalid / empty), password presence (valid / invalid / empty), case sensitivity of email lookup.
- **State transition:** failed-attempt counter 0 → 1 → 2 → 3; lock triggers on the 3rd consecutive failure; lock expires after 30s; counter resets on successful login.
- **Security:** SEC-01 (password never returned/echoed in any response), SEC-02 (JWT correctness/expiry), SEC-05 (SQL injection via `email`/`password` fields), and the lockout message must not leak whether the email exists. Still evaluate SEC-01 through SEC-07 for applicability — do not skip the ones not listed here; mark them explicitly No with a reason if they don't apply.
- **Schema:** 200 response has `token` (string) and `user` (object); error responses share a consistent error shape.

## Process constraints

- Follow the skill's 7 stages in order (contract extraction → EP/BVA catalog → state model → security cases → schema cases → master suite consolidation → data-driven inputs). Do not collapse this into one generic "generate 35 test cases" pass — this assignment is graded on driving the AI step by step, not on a single black-box prompt.
- Use only documented behavior from the two sources above as the oracle. Where a constraint (e.g., exact password complexity rule, exact lock duration) is not stated in the spec or SRS, record it as unspecified rather than inventing a value.
- Target ≥ 35 total cases in the master suite; report the coverage gate exactly as the skill's template specifies (totals, by-technique counts, uncovered parameters/SEC ids/transitions/response variants, and any shortfall).

## Explicit boundaries — stop here

- Do not label any case VALID / INVALID / INCOMPLETE — that audit step happens later, separately, by me.
- Do not send any request to the running SUT and do not report pass/fail results.
- Do not create a Postman collection, test script, or any execution evidence.
- Do not silently convert an undocumented assumption into an expected result — flag it instead.

## Deliverable

Produce every file in the skill's output contract under `homeworks/HW06/artifacts/test-cases/fr-02-login/`, and end with the Stage 6 coverage-gate report inline in chat.
```

### AI Output (verbatim)

```
Tất cả 10 file theo output contract đã được tạo đầy đủ tại `homeworks/HW06/artifacts/test-cases/fr-02-login/`, và CSV có đúng 35 dòng khớp với `TC-01..TC-35`. Không có request nào được gửi tới SUT, không có nhãn VALID/INVALID/INCOMPLETE, và mọi giả định chưa được tài liệu hóa đều được đánh dấu UNSPECIFIED thay vì tự bịa giá trị.

## Coverage Gate (Stage 6)

- **Total: 35/35** (mục tiêu mặc định)
- **By technique:** EP=12, BVA=3, State/Lifecycle=5, Security=7, Schema=8
- **Parameters without EP/BVA coverage:** none — `email` (EC-01..07) và `password` (EC-08..12) đều có class trong catalog; TTL khóa 30s (BVA-01..03, phát hiện thêm ngoài 3 nhóm bắt buộc — boundary hợp lệ theo reference vì là TTL) cũng được phủ
- **Applicable SEC ids without cases:** none — SEC-01, SEC-02, SEC-05 (3 id áp dụng trong 7 id, còn lại SEC-03/04/06/07 đánh dấu No kèm lý do trong `specs/security-requirement.md`)
- **Valid transitions:** 9/9 TR ids phủ (TR-01..09); 3 trong số đó (TR-05, TR-06, TR-09) kết thúc ở trạng thái UNSPECIFIED (không rõ counter có reset hay không) — test case vẫn chạy để ghi nhận hành vi thực tế, không giả định
- **Documented response variants:** 1/1 (`200`) — đây là response duy nhất thực sự được tài liệu hóa; `400/401/423` chỉ là placeholder chưa có schema chính thức
- **Shortfall:** none

Điểm đáng chú ý: tài liệu API/SRS **không** hề định nghĩa status code hay error-body shape cho bất kỳ trường hợp lỗi nào ở `/api/login` — chỉ có `200` được tài liệu hóa. Toàn bộ 24 test case còn lại đụng tới lỗi đều phải để `expected_status` trống và ghi UNSPECIFIED thay vì đoán. Ngoài ra, `security-cases.md` có tham chiếu tới finding thật đã ghi nhận trước đó (`w3-risk-triage-note.md` — nghi vấn `password` bị echo plaintext trong response), và TC-21 chính là test case chính thức để re-verify finding đó.
```

### Used In

- Feature or task: FR-02 Login and Account Lockout, AI-generated test-case suite
- Artifact: `artifacts/test-cases/fr-02-login/master-test-cases.md`, supporting catalogs, and data-driven inputs
- AI Audit mapping: Artifact #1

---

## Entry 002 | `2026-08-20T19:04:40+07:00`

**Tool and model:** Claude Code (Sonnet 5)

**Task:** FR-02 Login and Account Lockout, test-case audit

### Prompt (verbatim)

```
Tôi muốn bạn hãy giúp tôi thực hiện audit test-case của fr-02 được AI tạo ra bằng skill api-test-auditor
```

### AI Output (verbatim)

```
Đã hoàn tất audit FR-02. Ba file đã ghi vào `homeworks/HW06/artifacts/test-cases/fr-02-login/audit/`:

- **`audit-log.md`** — bảng nhãn 35/35 TC gốc: **29 Valid / 1 Invalid / 5 Incomplete**
- **`extended-test-cases.md`** — 6 case bổ sung (TC-36..TC-41), schema 9 cột đầy đủ trace + miss category
- **`audited-master-test-cases.md`** — bộ suite hoàn chỉnh 41 TC (35 gốc đã sửa + 6 mới), schema 7 cột thống nhất, sẵn sàng thực thi

**Phát hiện quan trọng nhất:**
1. **TC-19 (Invalid)** — trace trích `TR-06` nhưng precondition thực tế chỉ đạt state S1, không thể tái tạo TR-06 (cần S2) → Coverage Gate gốc từng khẳng định sai "9/9 TR ids covered". Đã tách thành TC-36 riêng.
2. **TC-21/TC-23 (Incomplete)** — `request-template.md` tự nhận là "stateless, order-free" nhưng chạy ngay sau TC-20 (vừa khóa tài khoản) sẽ không đạt path 200 cần thiết — mâu thuẫn nội bộ giữa các artifact do AI sinh ra.
3. **TC-01, TC-12, TC-20 (Incomplete)** — thiếu assertion Content-Type, bịa thêm ràng buộc không có nguồn, và giả định ngầm counter-reset mâu thuẫn với UNSPECIFIED đã tự công bố.

`master-test-cases.md` gốc giữ nguyên không đổi, đúng theo yêu cầu skill.
```

### Used In

- Feature or task: FR-02 Login and Account Lockout, AI audit and extension
- Artifact: `artifacts/test-cases/fr-02-login/audit/audit-log.md`, `extended-test-cases.md`, `audited-master-test-cases.md`
- AI Audit mapping: Artifact #1

---

## Entry 003 | `2026-08-20T21:07:13+07:00`

**Tool and model:** Claude Code (Sonnet 5)

**Task:** FR-08 Checkout, test-case generation

### Prompt (verbatim)

```
Invoke the `api-test-generator` skill for one endpoint. Do not answer this from general knowledge — follow the skill's own workflow file and stage references; read each stage reference immediately before performing that stage, not all at once.

## Endpoint identity

- FR id: FR-08 (Checkout)
- HTTP method / path: `POST /api/checkout`
- Contract source: `docs/eshop-sut/api_specification.md`, section 4.3
- Requirement source: `docs/eshop-sut/srs.md`, FR-07 to FR-08
- Output base: `homeworks/HW06/artifacts/test-cases/`
- `<api-slug>`: `fr-08-checkout`

## Mandatory coverage groups

Treat these as the minimum obligations to trace back to in the design catalogs — do not treat them as the full list; extract every parameter and rule from the contract/SRS independently and add whatever the spec supports beyond this:

- **Domain partition:** `shipping_address` (empty, valid, over-length), cart state (empty cart, non-empty cart), unauthenticated request.
- **State transition / lifecycle:** cart → order (cart must be cleared after a successful checkout); repeated checkout attempt on an already-emptied cart. If the cart→order behavior does not meet the skill's explicit/implicit state bar, classify it as lifecycle adaptation per the skill's Stage 3 rules and justify that classification from the SRS text.
- **Security:** SEC-02 (authentication required), IDOR (a valid token must not be able to checkout another user's cart), and server-side recomputation of `total_amount` — a client-supplied `total_amount` must be ignored per SRS FR-08. Still evaluate SEC-01 through SEC-07 for applicability; mark the non-applicable ones explicitly No with a reason.
- **Schema:** created-order response shape; validation-error response shape.

## Process constraints

- Follow the skill's 7 stages in order (contract extraction → EP/BVA catalog → state/lifecycle model → security cases → schema cases → master suite consolidation → data-driven inputs). Do not collapse this into one generic "generate 35 test cases" pass — this assignment is graded on driving the AI step by step, not on a single black-box prompt.
- Use only documented behavior from the two sources above as the oracle. Where a constraint (e.g., exact address length limit, exact recompute rule for discounts/tax) is not stated in the spec or SRS, record it as unspecified rather than inventing a value.
- Target ≥ 35 total cases in the master suite; report the coverage gate exactly as the skill's template specifies (totals, by-technique counts, uncovered parameters/SEC ids/transitions/response variants, and any shortfall).

## Explicit boundaries — stop here

- Do not label any case VALID / INVALID / INCOMPLETE — that audit step happens later, separately, by me.
- Do not send any request to the running SUT and do not report pass/fail results.
- Do not create a Postman collection, test script, or any execution evidence.
- Do not silently convert an undocumented assumption into an expected result — flag it instead.

## Deliverable

Produce every file in the skill's output contract under `homeworks/HW06/artifacts/test-cases/fr-08-checkout/`, and end with the Stage 6 coverage-gate report inline in chat.
```

### AI Output (verbatim)

```
Toàn bộ 10 file trong output contract của skill đã có đủ. Tất cả các stage đã hoàn thành theo đúng thứ tự (contract extraction → EP/BVA → state/lifecycle → security → schema → master suite → data-driven inputs).

## Stage 6 Coverage Gate report

- **Total: 35/35** (đạt mục tiêu ≥ 35)
- **By technique:** EP=13, BVA=2, State/Lifecycle=5, Security=8, Schema=7
- **Parameters without EP/BVA coverage:** none — `shipping_address` (EC-01..06), `total_amount` (EC-07..11), `Authorization` header (EC-12..14) đều có class trong TC-01..TC-13; ranh giới số lượng giỏ hàng (BVA-01, BVA-02) ở TC-14..TC-15
- **Applicable SEC ids without cases:** none — SEC-02 (TC-11/21, TC-12/22, TC-23, TC-24), SEC-02-extended(a) IDOR (TC-25), SEC-02-extended(b) recompute (TC-07/26/30), SEC-05 (TC-27, TC-28). SEC-01/03/04/06/07 đã đánh dấu No với lý do trong `specs/security-requirement.md`
- **Valid transitions:** không áp dụng — FR-08 được phân loại là *lifecycle adaptation*, không phải state machine (chỉ 1 transition được tài liệu hóa, ô còn lại UNSPECIFIED). Lifecycle coverage thay thế: 5/5 scenario (S-01..S-05) đều có TC
- **Documented response variants:** 0/0 — api_specification.md mục 4.3 không có ví dụ response nào (chỉ có request example), đây là khoảng trống đặc tả chứ không phải thiếu coverage. Cả 12 `SC-*` id vẫn được trace vào TC-29..TC-35
- **Shortfall:** none. Không có case trùng lặp để "độn" số — các cặp TC-07/26/30, TC-11/21, TC-12/22, TC-14/31, TC-02/35 dùng chung 1 request nhưng mỗi dòng khẳng định một oracle khác nhau (EP accept/reject vs. security fail-closed/side-effect vs. schema/envelope inspection)

**Điểm cần lưu ý nổi bật:** endpoint này gần như không có response schema nào được tài liệu hóa (không có status code, không có error envelope) — khác hẳn `/api/login`/`/api/register`. Phần lớn oracle trong suite là UNSPECIFIED có chủ đích, không phải AI bịa ra giá trị. `total_amount` được xử lý như một field đặc biệt: theo FR-08 nó luôn bị server bỏ qua/tính lại, nên các case liên quan (EC-07..11, SEC-C-06) kiểm tra hành vi "bỏ qua" chứ không kiểm tra validation thông thường.
```

### Used In

- Feature or task: FR-08 Checkout, AI-generated test-case suite
- Artifact: `artifacts/test-cases/fr-08-checkout/master-test-cases.md`, supporting catalogs, and data-driven inputs
- AI Audit mapping: Artifact #2

---

## Entry 004 | `2026-08-20T21:35:27+07:00`

**Tool and model:** Claude Code (Sonnet 5)

**Task:** FR-08 Checkout, test-case audit

### Prompt (verbatim)

```
Tôi muốn bạn hãy giúp tôi thực hiện audit test-case của fr-08 được AI tạo ra bằng skill api-test-auditor
```

### AI Output (verbatim)

```
Đã hoàn tất audit FR-08 Checkout, đã ghi 3 file vào `homeworks/HW06/artifacts/test-cases/fr-08-checkout/audit/`:

- **`audit-log.md`** — bảng nhãn 35 TC gốc: **33 VALID, 2 INCOMPLETE (TC-17, TC-18), 0 INVALID**
- **`extended-test-cases.md`** — 6 case bổ sung (TC-36..TC-41), lược đồ 9 cột
- **`audited-master-test-cases.md`** — bộ suite hoàn chỉnh 41 TC (35 gốc đã sửa + 6 bổ sung), sẵn sàng thực thi

Điểm đáng chú ý: bộ FR-08 gốc được sinh rất kỹ (mọi trích dẫn dòng số trong `srs.md`/`api_specification.md` đều đúng), nên 0 case bị INVALID. Hai lỗi INCOMPLETE (TC-17/TC-18) là do Oracle không đủ để phân biệt 3 khả năng mà chính Expected result tự nêu ra ("reject / silent no-op / **empty order**"). Sáu case bổ sung tập trung vào: sai scheme Authorization, invariant "không tạo order" chưa phủ hết nhóm lỗi validation, xác minh persistence qua `GET /api/orders/my-orders`, cách ly cross-user ở read-path (FR-11), mở rộng quy tắc recompute sang lớp âm/0, và giá trị Content-Type sai.

File `master-test-cases.md` gốc được giữ nguyên không đổi.
```

### Used In

- Feature or task: FR-08 Checkout, AI audit and extension
- Artifact: `artifacts/test-cases/fr-08-checkout/audit/audit-log.md`, `extended-test-cases.md`, `audited-master-test-cases.md`
- AI Audit mapping: Artifact #2

---

## Entry 005 | `2026-08-20T21:47:24+07:00`

**Tool and model:** Claude Code (Sonnet 5)

**Task:** FR-15 Product Management Admin CRUD, test-case generation

### Prompt (verbatim)

```
Invoke the `api-test-generator` skill for one endpoint group. Do not answer this from general knowledge — follow the skill's own workflow file and stage references; read each stage reference immediately before performing that stage, not all at once.

## Endpoint identity

- FR id: FR-15 (Product Management, Admin CRUD), with access control from FR-12
- HTTP method / path: `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- Contract source: `docs/eshop-sut/api_specification.md`, section 3.3
- Requirement source: `docs/eshop-sut/srs.md`, FR-12 and FR-15
- Output base: `homeworks/HW06/artifacts/test-cases/`
- `<api-slug>`: `fr-15-product-crud`

Treat the three operations as one traceable suite for this slug — partition, security, and schema rows may be scoped per operation, but keep one continuous `TC ID` sequence per the skill's Stage 6.

## Mandatory coverage groups

Treat these as the minimum obligations to trace back to in the design catalogs — do not treat them as the full list; extract every parameter and rule from the contract/SRS independently and add whatever the spec supports beyond this:

- **Domain partition:** `name` (empty, boundary at 255 chars, over-length), `price` (negative, zero, positive, non-numeric), `category_id` (missing, non-existent, valid).
- **State / isolation (lifecycle adaptation):** editing one product must not mutate other products (SRS FR-15); delete of a non-existent id. Classify this per the skill's Stage 3 rules — this is resource-lifecycle/isolation coverage, not state-transition coverage; label it accordingly and do not report it as state-transition coverage.
- **Security:** SEC-02 (JWT required on all three operations), SEC-03 (role must be `admin` in the token claims, not merely token presence), SEC-06 (the `role`/admin field must not be client-settable via the request body), and IDOR/role-escalation via a non-admin token attempting any of the three operations. Still evaluate SEC-01 through SEC-07 for applicability; mark the non-applicable ones explicitly No with a reason.
- **Schema:** create/update response shape; 404 shape on delete of a missing id.

## Process constraints

- Follow the skill's 7 stages in order (contract extraction → EP/BVA catalog → state/lifecycle model → security cases → schema cases → master suite consolidation → data-driven inputs). Do not collapse this into one generic "generate 35 test cases" pass — this assignment is graded on driving the AI step by step, not on a single black-box prompt.
- Use only documented behavior from the two sources above as the oracle. Where a constraint (e.g., exact max length beyond 255, exact price precision) is not stated in the spec or SRS, record it as unspecified rather than inventing a value.
- Target ≥ 35 total cases in the master suite; report the coverage gate exactly as the skill's template specifies (totals, by-technique counts, uncovered parameters/SEC ids/transitions/response variants, and any shortfall).

## Explicit boundaries — stop here

- Do not label any case VALID / INVALID / INCOMPLETE — that audit step happens later, separately, by me.
- Do not send any request to the running SUT and do not report pass/fail results.
- Do not create a Postman collection, test script, or any execution evidence.
- Do not silently convert an undocumented assumption into an expected result — flag it instead.

## Deliverable

Produce every file in the skill's output contract under `homeworks/HW06/artifacts/test-cases/fr-15-product-crud/`, and end with the Stage 6 coverage-gate report inline in chat.
```

### AI Output (verbatim)

```
Tất cả 10 file theo output contract của skill đã tạo xong. Bộ test-case FR-15 (Product CRUD Admin) đã hoàn thành đủ 7 stage.

## Coverage Gate (Stage 6)

- **Total: 43/35** (vượt target; không có case trùng lặp/đổi từ)
- **By technique:** EP=13, BVA=6, State/Lifecycle=5, Security=12, Schema=7
- **Parameters không có EP/BVA coverage:** không — `name`, `price`, `category_id`, `description`, `imageUrl`, path `id` đều có đủ class trong catalog
- **Applicable SEC ids không có case:** không — SEC-02 (5 case), SEC-03 (3 case, bao gồm IDOR/role-escalation), SEC-05 (2 case), SEC-06 mở rộng (2 case)
- **Valid transitions:** không áp dụng — không có state machine tường minh; thay bằng lifecycle coverage 5/5 (S-01..S-05)
- **Documented response variants:** 8/8 slot có case (POST 200/4xx; PUT 200/404/4xx; DELETE 200/404/4xx) — 4/9 case Schema là composite với lifecycle/security do spec không tài liệu hoá response shape
- **Shortfall:** không

**Điểm đáng chú ý cần audit sau này:**
- Contract gốc (`api_specification.md` mục 3.3) không có ví dụ response nào cho cả 3 thao tác — rất nhiều field trong bảng được đánh dấu UNSPECIFIED thay vì suy đoán (status code, error envelope, kiểu path `:id`, exact boundary tại 255 ký tự...).
- SEC-06 được áp dụng "mở rộng" — nguồn SRS chỉ nói đích danh API cập nhật hồ sơ (`PUT /api/users/me`), tôi đã gắn cờ rõ đây là suy rộng nguyên lý mass-assignment, không phải trích dẫn trực tiếp.
- TC-18/TC-19 là 2 case "operation-scoped" verify lại rule đã test ở POST nhưng trên PUT — có lý do rõ ràng (không phải padding), đã giải thích trong Shortfall.
```

### Used In

- Feature or task: FR-15 Product Management Admin CRUD, AI-generated test-case suite
- Artifact: `artifacts/test-cases/fr-15-product-crud/master-test-cases.md`, supporting catalogs, and data-driven inputs
- AI Audit mapping: Artifact #3

---

## Entry 006 | `2026-08-20T22:25:36+07:00`

**Tool and model:** Claude Code (Sonnet 5)

**Task:** FR-15 Product Management Admin CRUD, test-case audit

### Prompt (verbatim)

```
Tôi muốn bạn hãy giúp tôi thực hiện audit test-case của fr-15 được AI tạo ra bằng skill api-test-auditor
```

### AI Output (verbatim)

```
Tất cả check kỹ thuật đều đạt: 43 TC gốc duy nhất trong `audit-log.md`, đếm nhãn khớp 34+9=43, `audited-master-test-cases.md` có 48 dòng TC-01..TC-48 liên tục không lỗ hổng, cả 3 file đều đúng số cột theo schema. `master-test-cases.md` gốc không bị đụng vào.

Audit FR-15 hoàn tất, 3 file đã ghi tại `homeworks/HW06/artifacts/test-cases/fr-15-product-crud/audit/`:

- **`audit-log.md`** — 34 VALID / 0 INVALID / 9 INCOMPLETE. Hai lỗi nội dung thật (TC-05 hedge sai một boundary đã rõ ràng trong SRS; TC-18 gắn nhãn kỹ thuật EP nhưng trace lại là BVA) và một lỗi cấu trúc lan rộng (TC-37→TC-43, cả nhóm Schema, thiếu hẳn cột Oracle — phát hiện bằng cách đếm pipe: các dòng này chỉ có 6/7 cột).
- **`extended-test-cases.md`** — 5 case mới (TC-44..TC-48): JWT chữ ký giả mạo, SQL injection qua path `:id`, xóa category đang được product tham chiếu (cross-FR14/FR15, chưa từng test), price thập phân, path id=0/-1.
- **`audited-master-test-cases.md`** — bộ suite hoàn chỉnh TC-01..TC-48, execution-ready, 1 schema 7 cột thống nhất.

Không có case nào bị gắn INVALID — bộ suite gốc của AI khá vững về mặt trace/oracle, các lỗi chủ yếu là hedge sai chỗ và một lỗi transcription khi merge Schema cases vào bảng master.
```

### Used In

- Feature or task: FR-15 Product Management Admin CRUD, AI audit and extension
- Artifact: `artifacts/test-cases/fr-15-product-crud/audit/audit-log.md`, `extended-test-cases.md`, `audited-master-test-cases.md`
- AI Audit mapping: Artifact #3

---

## Pass 2 Entries (29/08)

Pass 2 re-ran the audit, sync, build and execute stages on all three APIs with a different model from the one that generated the suites, and then produced the remaining submission artifacts. Only the prompts that produced a graded artifact are logged; approval turns, commit turns and follow-up questions inside the same session are not.

---

## Entry 007 | `2026-08-29T00:17:30+07:00`

**Tool and model:** Claude Code (Opus 5)

**Task:** Pass 2 re-audit workflow, `api-test-auditor` skill upgrade

**Note:** The workflow produced by this turn was written into the skill in the next turn of the same session, then committed as `b70ed1a`.

### Prompt (verbatim)

```
Tôi muốn bạn bạn có thể điều chỉnh 3 power promt dùng để audit test case được generate, thì bây giờ tôi muốn giúp prompt có thể phản biện kết quả audit trước đó và đưa ra các đánh giá mới trên kết quả audit trước cho bộ test case chuẩn xác hơn
```

### AI Output (verbatim)

```
Đã điều chỉnh cả 3 prompt tại `.claude/prompts/audit-tc-fr{02,08,15}-*.prompt.md`.

**Cách hoạt động:** prompt giờ tự chọn mode. Nếu `audit/audit-log.md` chưa tồn tại → chạy Pass 1 như cũ. Nếu đã có → nhảy xuống section `Re-audit mode (Pass 2)` mới thêm ở cuối file.

**Nội dung Pass 2:**

- **Authority order rõ ràng:** oracle > `master-test-cases.md` gốc > 3 file audit cũ — cả 3 file audit là *đối tượng bị review*, không được tự làm bằng chứng cho chính nó.
- **Bắt buộc re-derive label từ oracle trước**, rồi mới so với label cũ. Không cho carry-forward vì "nghe hợp lý"; row giữ nguyên vẫn phải nêu deciding check.
- **Phản biện 2 chiều** — đây là phần cốt lõi:
  - *false negative*: row `VALID` mà pass trước bỏ qua một mandatory check, hoặc chấp nhận `Trace` mà không mở nguồn.
  - *false positive*: row `INVALID`/`INCOMPLETE` mà pass trước tự bịa ràng buộc, hoặc áp sai spec-silence rule.
  - *bad fix*: `Student fix` không verify được, đổi test intent, nâng `UNSPECIFIED` thành giá trị cụ thể, hoặc mâu thuẫn với fix của row khác.
- **Audit luôn các case bổ sung của Pass 1** bằng cùng 3 label — addition dựa trên lập luận của auditor cũ thay vì nguồn thì `INVALID`.
- **Cross-row consistency**: điều kiện giống nhau bị gán label khác nhau, precondition xung đột theo run order, coverage-gate claim bị label mới làm sai.
- **Challenge targets riêng từng FR**: FR-02 nhắm lockout/counter sau unlock + phạm vi "không lộ nguyên nhân"; FR-08 nhắm order lifecycle, tính toán total/coupon, reachability của precondition; FR-15 nhắm verb attribution, chiều authorization theo từng verb, cascade behavior.

**Output tách bản, không đè Pass 1:** `audit-log-v2.md` (schema mới `TC ID | Prev label | New label | Verdict | Source evidence | Reasoning | Student fix`, verdict = upheld/overturned/fix-corrected/dropped), `extended-test-cases-v2.md`, `audited-master-test-cases-v2.md`. Vẫn giữ 2 confirmation gate: bảng disagreement trước, additions sau.

Trade-off duy nhất: sinh thêm 3 file v2 mỗi FR thay vì overwrite — chọn vậy để giữ audit trail chứng minh có phản biện thật, hợp với yêu cầu môn học hơn là gọn thư mục.
```

### Used In

- Feature or task: skill upgrade that made the Pass 2 re-audit possible
- Artifact: `.agents/skills/api-test-auditor/SKILL.md` (submitted copy: `artifacts/skills/api-test-auditor/`)
- AI Audit mapping: Artifact #7, and the method behind Artifacts #1 to #3

---

## Entry 008 | `2026-08-29T00:26:10+07:00`

**Tool and model:** Claude Code (Opus 5)

**Task:** FR-02 Login and Account Lockout, Pass 2 re-audit

### Prompt (verbatim)

```
Invoke the `api-test-auditor` skill for one already-generated suite. The skill picks its own
mode: a first-pass audit when `audit/` is empty, its Pass 2 re-audit when a Pass 1 audit is
already there. Follow that workflow. Read `references/audit-heuristics.md` before labeling anything.

## Target

- FR id: FR-02 (Login & Account Lockout), `POST /api/login`
- Suite dir: `homeworks/HW06/artifacts/test-cases/fr-02-login/` (`master-test-cases.md`, TC-01..TC-35, plus the four supporting catalogs)
- Output dir: `homeworks/HW06/artifacts/test-cases/fr-02-login/audit/`

## Authoritative oracles (only these)

- `docs/eshop-sut/api_specification.md` section 1.2
- `docs/eshop-sut/srs.md`, FR-02
- `specs/security-requirement.md` (SEC-01..SEC-07)

The generator's own catalogs are inputs under review, never evidence.

## Audit focus

- Verify every `Trace` by opening the cited location; an unverifiable trace is `INVALID`.
- Check the lockout state cases hardest: 3-failure trigger, 30s expiry, counter reset, and whether the expected result invents a status code or message the sources never state.
- Keep `UNSPECIFIED` where the sources are silent; do not upgrade it to a concrete value, and flag any original case that already did.

## Missed-case gaps to probe

Email case sensitivity, lock-message user-enumeration leakage, SEC ids with no case at all, concurrent/interleaved failed attempts across accounts, and error-response shape consistency. Add at least five source-backed additions.

## Boundaries

- Never modify `master-test-cases.md` or any generated file outside `audit/`.
- Do not send requests to the SUT, build Postman artifacts, or report pass/fail.
- Stop at both confirmation gates (label table, then proposed additions) and wait for my approval before writing files.

## Pass 1 deliverable

`audit/audit-log.md`, `audit/extended-test-cases.md`, `audit/audited-master-test-cases.md`, ending with the label counts inline in chat.

## Re-audit challenge targets (Pass 2 only)

- Every lockout row: re-check that the 3-failure trigger, the 30s expiry, and the post-unlock
  counter value are each labeled against what `srs.md` FR-02 actually states, and that no fix
  quietly resolved the post-unlock counter question the source leaves open.
- Rows justified by "cause not leaked": confirm the previous pass applied that constraint only
  to credential rejection, and did not extend it to required-field validation messages.
- Rows whose preconditions assume a fresh, unlocked account: verify the previous pass fixed
  every affected row, not only the ones it happened to notice, and that the fixes agree.
```

### AI Output (verbatim)

```
Đã đọc xong toàn bộ oracle và Pass 1. Tôi đã tự dẫn lại (re-derive) **cả 35 TC gốc** từ nguồn, không kế thừa nhãn nào của Pass 1. Xác minh trực tiếp: `srs.md` dòng 40–44 và 278–284, `api_specification.md` mục 1.2, mục 2 preamble + 2.1, `srs.md` mục 1 (tài khoản mặc định), `specs/security-requirement.md` SEC-01/02/05.

## Gate 1 — Bảng bất đồng (TC gốc)

| TC | Prev → New | Verdict | Lý do (nguồn đã mở lại) | Fix |
|---|---|---|---|---|
| TC-01 | INCOMPLETE → INCOMPLETE | fix-corrected | Fix của Pass 1 bắt assert `Content-Type: application/json`. `schema-cases.md` SC-02 **tự khai** đây là "inferred, not stated per-endpoint"; api_spec 1.2 không nêu response header nào. Fix nâng im lặng thành assertion — đúng lỗi mà Pass 1 phạt row khác | Oracle: bỏ assert header, thêm "ghi nhận `Content-Type` thực tế (SC-02 — inferred, không assert)". Trace: `SC-01..SC-07` → `SC-01, SC-03..SC-06` |
| TC-02 | VALID → INCOMPLETE | overturned | Precondition chỉ "Account exists". Case dùng password **đúng** để dò case-sensitivity; nếu account LOCKED thì cả hai nhánh đều bị từ chối → kết quả không quy được về điều kiện đang test (Isolation). Pass 1 áp đúng chuẩn này cho TC-21/23 rồi bỏ sót ở đây | Precondition → "…exists, unlocked, counter=0" |
| TC-07 | VALID → INCOMPLETE | overturned | Cùng khiếm khuyết TC-02 (email có padding + password đúng) | Như trên |
| TC-11 | VALID → INCOMPLETE | overturned | Cùng khiếm khuyết TC-02 (password đúng có padding). Thêm: nếu server không trim, chính row này +1 counter, ảnh hưởng row sau | Như trên |
| TC-12 | INCOMPLETE → INCOMPLETE | fix-corrected | Nhãn + fix Expected result **đúng, giữ nguyên**. Nhưng fix đã gỡ assertion dựa line 42 khỏi Expected result mà vẫn để `srs.md FR-02 line 42` trong Trace — trace giờ không đỡ cho assertion nào | Trace → `EC-05, EC-10 (combination); api_specification.md 1.2` |
| TC-18 | VALID → INCOMPLETE | overturned | Trace viện `SEC-02 (line 279)` — yêu cầu **access-side**. Chính `specs/security-requirement.md` giới hạn SEC-02 tại `/api/login` ở đúng một điểm: token phát ra phải well-formed. Dùng nó đỡ cho "không phát token khi bị khóa" là sai phạm vi (consume ≠ issue). Assertion cốt lõi vẫn được line 42 đỡ → strip, không reject | Trace → `TR-08, SEC-C-05; srs.md FR-02 lines 42-43` |
| TC-19 | **INVALID** → INCOMPLETE | overturned | Khiếm khuyết duy nhất là cross-ref `TR-06` — ID trong `state-model.md`, artifact sinh ra, **không phải nguồn thẩm quyền**. Không claim nào mâu thuẫn srs/api_spec, và chính fix Pass 1 (xóa `TR-06`) giữ nguyên toàn bộ row → theo label rule đó là INCOMPLETE | Fix Pass 1 giữ nguyên |
| TC-24 | VALID → INCOMPLETE | overturned | Toàn bộ chỗ dựa authoritative là SEC-02 (qua SEC-C-04) — sai phạm vi như TC-18. Thứ thực sự đỡ "failed login không có token" là line 43 ("Đăng nhập **thành công** trả về JWT Token"), row không viện | Trace → `SEC-C-04; srs.md FR-02 line 43` |
| TC-26 | VALID → INCOMPLETE | overturned | Dùng account thật. Nếu account LOCKED, một injection bypass **thành công** vẫn bị lock chặn → pass giả, che đúng lỗ hổng đang săn. TC-25/27 không dính vì email của chúng không khớp row nào | Precondition → "…exists, unlocked, counter=0" |
| TC-28 | VALID → INCOMPLETE | overturned | Assert "cả 5 error body cùng top-level key set". Line 42 chỉ đòi "thông báo lỗi phù hợp; không để lộ chi tiết nguyên nhân" — không nói gì về đồng nhất envelope. 2/5 điều kiện (TC-05, TC-09) là required-field validation mà **chính Pass 1 đã loại khỏi phạm vi line 42 khi sửa TC-12**. SC-08 tự ghi "shape itself UNSPECIFIED" rồi vẫn assert | Expected → ghi nhận, không assert; tách nhóm credential-rejection (TC-03/08/17, line 42 có đỡ) khỏi nhóm required-field (TC-05/09, nguồn im lặng) |
| TC-32 | VALID → INCOMPLETE | overturned | Assert "structured JSON error, not a `500` with raw stack trace". Không nguồn nào quy định error body shape → "không có stack trace" là ràng buộc body shape dựng trên im lặng | Expected → UNSPECIFIED; ghi nhận status/Content-Type/parse được/có lộ stack trace không. Đánh dấu characterization |
| TC-33 | VALID → INCOMPLETE | overturned | Như TC-32 | Như TC-32 |
| TC-34 | VALID → INCOMPLETE | overturned | Như TC-32. Trace của row **tự thú** "inferred minimum" — suy luận vẫn không phải nguồn | Như TC-32 |

**Đối chứng nội bộ cho nhóm 32/33/34:** TC-35 cùng khối Schema, nguồn cũng im lặng, nhưng nó *ghi nhận* thay vì assert — và Pass 1 cho cả bốn cùng VALID. Chính sự lệch chuẩn giữa TC-35 và TC-32/33/34 là bằng chứng, không phải suy đoán của tôi.

**Không lật (dù có cám dỗ):** TC-31 giữ VALID. "Cả 5 đều non-2xx" **được suy ra**, không phải bịa: api_spec 1.2 buộc `200 OK` vào "Phản hồi thành công", không điều kiện nào trong 5 là đăng nhập thành công, và row từ chối assert mã cụ thể.

## Sửa evidence trên các row upheld

Pass 1 dẫn chứng bằng **artifact sinh ra đứng một mình** — heuristics cấm điều này. Nhãn vẫn đứng, nhưng evidence phải thay: TC-13/14/15/16/17 (chỉ `state-model.md` → `srs.md` line 42, 41-42, 42+43), TC-30/31/35 (chỉ `schema-cases.md`). Ngoài ra **17/35 row có Reasoning đúng chữ "Matches"** — heuristics ghi thẳng "'Matches' is not a reasoning entry"; toàn bộ đã được viết lại nêu đích danh check quyết định.

## Đếm (chỉ 35 TC gốc)

| | Pass 1 | Pass 2 |
|---|---|---|
| VALID | 29 | **19** |
| INVALID | 1 | **0** |
| INCOMPLETE | 5 | **16** |

**Label delta:** VALID→INCOMPLETE 10 · INVALID→INCOMPLETE 1 · giữ nguyên 24.
**Verdict:** upheld 22 · overturned 11 · fix-corrected 2 · dropped 0 (= 35).

**Về INVALID = 0** — heuristics bắt điều tra cực trị này. Tôi đã mở từng trace. Hai row có trace sai phạm vi (TC-18, TC-24) đều **còn một nguồn hợp lệ đỡ cho assertion cốt lõi**, nên theo quy tắc "strip that assertion rather than rejecting the row" chúng rơi vào INCOMPLETE. Không row nào đưa ra claim mâu thuẫn trực tiếp `srs.md`/`api_specification.md`.

## Ba mục tiêu bạn chỉ định — kết quả

1. **Lockout rows:** trigger 3-failure (TC-16) và hết hạn 30s (TC-13/14/15) đều đúng chuẩn — TC-14 giữ đúng ranh giới T=30s là UNSPECIFIED. Fix TC-20 của Pass 1 **không** lén giải quyết câu hỏi counter sau unlock; nó ghi rõ "record which attempt triggers the second lock". **Upheld.**
2. **"Cause not leaked":** Pass 1 áp đúng cho credential rejection và đã chặn đúng ở TC-12 — nhưng **bỏ lọt TC-28**, nơi cùng ràng buộc đó bị kéo sang required-field validation. Đây là lỗi cross-row Pass 1 không thấy được.
3. **Precondition fresh/unlocked:** Pass 1 chỉ sửa TC-21/TC-23. **Bỏ sót TC-02, TC-07, TC-11, TC-26** — cùng phụ thuộc, cùng cần fix. Các fix hiện có không mâu thuẫn nhau, chỉ thiếu.

## Chi phí downstream (bắt buộc công bố)

- `data/request-template.md` liệt kê TC-01..12, TC-21..27 là "stateless, order-free" — claim này **sai** sau khi TC-02/07/11/26 có precondition trạng thái. `data/test-data.csv` và package Postman FR-02 đang phản ánh suite Pass 1.
- **`BUG-FR02-04` (issue #47)** — "malformed JSON / missing Content-Type crashes with raw stack trace" — dựng đúng trên assertion tôi đang hạ cấp ở TC-32/33/34. Nếu chốt, cột **Expected** của bug đó đang viện một kỳ vọng mà nguồn không hề phát biểu; nó cần đổi cơ sở (observed behavior / information disclosure) chứ không phải "spec đòi structured error". Hành vi vẫn là lỗi kỹ thuật thật — chỉ là chỗ dựa spec không tồn tại. Tôi **không** sửa BUG_REPORT.md; đây là quyết định của bạn.
- `BUG-FR02-01`, `-02` (line 41, 42) và `-03` (SEC-01 + TC-21 upheld) **không bị ảnh hưởng**.

Chốt bảng này hoặc nêu TC ID cần chỉnh. Sau khi bạn duyệt, tôi trình Gate 2: nhãn lại TC-36..TC-41 (dự kiến 2 VALID / 4 INCOMPLETE — TC-39 nâng phạm vi khóa từ UNSPECIFIED thành MUST) cộng 5 case bổ sung mới. Chưa có file nào được ghi.
```

### Used In

- Feature or task: FR-02, re-audit of the Pass 1 suite against the authoritative oracles
- Artifact: `artifacts/test-cases/fr-02-login/audit/audit-log-v2.md`, `extended-test-cases-v2.md`, `audited-master-test-cases-v2.md`
- AI Audit mapping: Artifact #1

---

## Entry 009 | `2026-08-29T01:25:11+07:00`

**Tool and model:** Claude Code (Opus 5)

**Task:** FR-02 Postman package rebuild from the re-audited suite

### Prompt (verbatim)

```
Tôi muốn bạn chạy api-test-postman-build cho fr-02 để rebuild collection
```

### AI Output (verbatim)

```
## Handoff — FR-02 Postman package rebuilt

**FR / nguồn:** FR-02 Login & Account Lockout, dựng từ `test-cases/fr-02-login/` (audited Pass 2: `audit/audited-master-test-cases-v2.md` + `audit/extended-test-cases-v2.md`, qua `data/test-data.csv` + `data/request-template.md`).

**File sinh ra** (`homeworks/HW06/artifacts/postman/fr-02-login/`):
- `collection.postman_collection.json` — schema v2.1, 1 item data-driven
- `environment.postman_environment.json` — `baseUrl`, `studentId`, `lockUntil_test` (placeholder, không credentials)
- `test-data.csv` — snapshot khớp byte-for-byte với source
- `RUN.md` — lệnh Newman relative, timeout nâng lên 60s

**Case count: 42 → 53.** Package cũ còn ở Pass 1; Pass 2 thêm TC-42, TC-43a..g, TC-44, TC-45, TC-46 và đổi oracle của TC-02/07/11/26 (thêm reset precondition), TC-28, TC-32/33/34/41, TC-39 (chuyển sang characterization).

**Thay đổi script đáng kể:**
- Assertion `Content-Type: application/json` trên mọi row 2xx → record-only (Pass 2 lật lại fix của Pass 1).
- TC-32/33/34/41 tách khỏi assertion stack-trace/HTML chung → ghi vào `observed_content_type_*`, `observed_body_parses_as_json_*`, `observed_html_error_page_*`, `observed_stack_trace_*`.
- TC-28 từ assert → record-only; TC-42 là nhánh phân tích mới (diff message TC-17 vs TC-03).
- Danh sách `waitOutTestLock()` mở rộng: thêm TC-02/07/11/26, TC-40, TC-43a, TC-44, TC-45, TC-46. TC-40 giờ arm lại `lockUntil_test` sau khi verify LOCKED.

**Static validation: pass.** JSON parse OK, schema v2.1, snapshot khớp, đủ 53 `tc_id` không dư, mọi assertion name reversible về `[tc_id][trace]`, `X-Student-Id` có trên cả request thường lẫn `loginConfig()`, env var đọc đều đã khai báo. 5 sandbox constraint đều sạch: không `const`/`let` top-level, không bare top-level `await`, không dùng chéo identifier giữa script, `pm.sendRequest` đều có callback 2 tham số, mọi nhánh `skipRequest()` đều có `send()` trước đó.

**Dry-run: pass**, chạy trên **local HTTP stub** (`node` stub port 3999, không tạo resource cloud Postman nào). 30 row đại diện phủ hết nhánh dispatcher: exit code 0, 58 request, 150 assertion, 0 fail, không `SyntaxError`/`ReferenceError`/`TypeError`, không row nào ghi 0 kết quả `pm.test()`. Output dry-run nằm trong scratchpad, `reports/` không bị đụng.

**Vướng chưa giải quyết (cần `api-test-sync`):**

1. `request-template.md` section 3 vẫn ghi assertion cứng "non-2xx rows never return a raw stack trace / HTML error page" cho toàn bộ row, trong khi CSV + audit v2 hạ TC-32/33/34/41 xuống record-only. Đây là mâu thuẫn thật giữa template và CSV. Tôi build theo oracle hẹp hơn ở CSV (record thay vì assert — hướng bảo toàn, không biến UNSPECIFIED thành pass), thay vì dừng lại. Template cần sync lại.
2. Precondition "counter=0 (reset before running this row)" chỉ được **xấp xỉ**: package chỉ chờ hết lock do row trước arm, không set được counter về 0 (không API nào làm được, và việc login thành công có reset counter hay không chính là UNSPECIFIED theo TC-19/TC-36). Row chạy sau một failure không gây lock trên cùng account (ví dụ TC-11 sau TC-08) sẽ bắt đầu từ counter không xác định. `api-test-execute` cần reset ở tầng DB hoặc ghi nhận deviation.
3. TC-29/TC-42 đọc field `message` — audit để shape response là UNSPECIFIED; nếu run thật cho tên field khác thì đó là thông tin mới cho `api-test-execute`, không phải lỗi script.

**Hành vi runtime với SUT thật vẫn chưa được kiểm chứng** — dry-run chỉ chạy trên stub, không phải `apps/backend`.
```

### Used In

- Feature or task: FR-02, rebuild of the executable package after the re-audit
- Artifact: `artifacts/postman/fr-02-login/` (collection, environment, iteration-data CSV, `RUN.md`)
- AI Audit mapping: Artifact #4

---

## Entry 010 | `2026-08-29T02:10:40+07:00`

**Tool and model:** Claude Code (Opus 5)

**Task:** Re-run workflow, `api-test-execute` skill upgrade

**Note:** As in entry 007, the workflow was written into the skill in a later turn of the same session and committed as `d84e311`.

### Prompt (verbatim)

```
Tôi muốn bạn cập nhật promt execute để thực hiện việc chạy lại bộ test sau khi đã cập nhật bộ test, ghi nhận kết quả mới, BUG mới, hoặc bug cũ như cần đồng bộ với bộ test hiện tại
```

### AI Output (verbatim)

```
Đã cập nhật cả 3 prompt execute (`fr-02-login`, `fr-08-checkout`, `fr-15-product-crud`) trong `.claude/prompts/`.

Thêm section **"Re-run after a suite update"** giữa Scope và Deliverable, với:

- **Điều kiện kích hoạt**: phải verify bằng mtime của artifact so với `reports/newman-report.json` + diff tập `tc_id` giữa `test-data.csv` và `reports/test-execution.md` — không tự cho là re-run.
- **Archive trước khi chạy**: copy `reports/` sang `reports/archive/<UTC-timestamp>/`, không ghi đè bằng chứng cũ (nó là baseline để tính delta).
- **Chạy lại toàn bộ suite**, không chạy subset dù chỉ vài case đổi.
- **Re-run delta** trong `test-execution.md`: tc_id added/removed/renamed, newly failing, newly passing, still failing, still passing — lấy từ 2 file JSON, không nhớ lại.
- **Quy tắc đồng bộ BUG_REPORT.md** (phần cốt lõi bạn cần):
  - Root cause mới → append bug mới qua script, id kế tiếp trong dãy `BUG-FR02-NN`, không tái dùng id đã bỏ.
  - Bug cũ vẫn tái hiện nhưng evidence đổi (tc_id/iteration/request/response) → hand-edit Steps/Expected/Actual, giữ nguyên id + GitHub Issue + screenshot.
  - Bug cũ mà tc_id chứng minh đã bị audit xóa/viết lại → re-point sang case hiện tại; nếu không case nào tái hiện thì giữ entry, ghi chú "suite hiện tại không cover" và báo trong report. Không xóa bug chỉ vì test case biến mất.
  - Bug cũ không còn tái hiện → không tự đóng; re-run riêng tc_id đó để xác nhận rồi hỏi user trước khi đổi `status`.
  - Failure bị audit phân loại lại thành test-artifact/environment defect → flag cho user quyết, không âm thầm bỏ row.
  - Không re-append id đã có, không hand-edit thứ script sinh được.
- **Scope** thêm 1 dòng trỏ sang section mới để không mâu thuẫn với "one real Newman run".
- **Deliverable** thêm yêu cầu báo cáo: archive path, tc_id delta, số newly failing/passing/still failing, và mọi hành động sync BUG_REPORT.

Skill `api-test-execute` chưa động tới — nếu muốn logic re-run này thành mặc định cho mọi FR (kể cả HW sau), nói một tiếng để tôi đưa nó vào `SKILL.md` + `references/bug-report-contract.md` thay vì lặp ở 3 prompt.
```

### Used In

- Feature or task: skill upgrade that made the Pass 2 re-execution reproducible
- Artifact: `.agents/skills/api-test-execute/SKILL.md` (submitted copy: `artifacts/skills/api-test-execute/`)
- AI Audit mapping: Artifact #7, and the method behind Artifact #4

---

## Entry 011 | `2026-08-29T02:26:31+07:00`

**Tool and model:** Claude Code (Opus 5)

**Task:** FR-02 Login and Account Lockout, Pass 2 Newman execution

### Prompt (verbatim)

```
Invoke the `api-test-execute` skill for one FR package. Do not answer this from general
knowledge — follow the skill's own preflight, run, inspect, and completion steps as written.

## Package identity

- FR id: FR-02 (Login & Account Lockout)
- HTTP method / path: `POST /api/login`
- Package under test: `homeworks/HW06/artifacts/postman/fr-02-login/`
- Built by `api-test-postman-build` beforehand; do not regenerate the collection,
  environment, or `test-data.csv` here.

## Inputs

- `studentId`: `23127216`
- SUT base URL: `http://127.0.0.1:3000` (use `127.0.0.1`, not `localhost` — see the
  environment's `base_url`; `localhost` has produced intermittent DNS resolution failures
  in this sandbox)
- Backend must already be running (`cd apps/backend && node server.js`); confirm reachable
  before running, do not start/stop it yourself unless asked
- Runtime credentials (seed accounts from `apps/backend/database.js`, pass via
  `--env-var`, never hard-code): `test@eshop.com` / `Test1234!` (role `user`),
  `admin@eshop.com` / `Admin123!` (role `admin`) if any case in this suite needs it
- Lockout behavior under test: 3 consecutive failed attempts locks the account for 30s
  (demo environment) — this suite's timing-sensitive cases depend on that window

## Scope

- Execute only the `fr-02-login` package; do not touch any other FR package.
- Run every `tc_id` present in this package's `test-data.csv` — no subset, no extra.
- One real Newman run against the reachable SUT, plus inspection of the resulting
  report. No SUT code changes. No database reset beyond what a normal backend restart
  already does. At most one unchanged rerun for a suspected transient failure.
  If the package changed since the last recorded run, follow "Re-run after a suite
  update" below instead of treating this as a first run.
- Bug candidates surfaced during inspection go through the skill's Report bugs step: group
  by root cause, write bug objects to a scratch JSON file, and append them to
  `homeworks/HW06/BUG_REPORT.md` with `scripts/append-bug-report.mjs` per
  `references/bug-report-contract.md` (severity + `foundBy` taxonomy). Opening the GitHub
  Issue and attaching a screenshot per bug stays a separate step gated on the user's
  explicit go-ahead — do not run `gh issue create` here.

## Re-run after a suite update

If the audited test cases, `test-data.csv`, the collection, or the environment changed since
the last recorded run, this is a re-run: follow the skill's `references/rerun-contract.md`
(archive `reports/` first, re-run the whole suite, report the delta) and the "Re-run
synchronization" rules in `references/bug-report-contract.md` for `BUG_REPORT.md`. Do not
close or delete an existing bug entry on your own judgment.

## Deliverable

Produce every file in the skill's completion contract under
`homeworks/HW06/artifacts/postman/fr-02-login/reports/`, then report the FR, exact
command, exit code, concise pass/fail counts, failed or blocked `tc_id`s, bug candidates,
which `BUG_REPORT.md` rows were appended (or none, if no bug candidate was found), artifact
paths, and any cleanup still required per the skill's report format.

On a re-run, additionally report the archive path, the `tc_id` delta, and every
`BUG_REPORT.md` sync action, per the skill's completion contract.
```

### AI Output (verbatim)

````
## FR-02 — Re-run hoàn tất

**Lệnh** (từ repo root):
```
node .claude/skills/api-test-execute/scripts/run-cycle.mjs \
  --package homeworks/HW06/artifacts/postman/fr-02-login \
  --student-id 23127216 --fr FR-02 \
  --env-var baseUrl=http://127.0.0.1:3000 \
  --timeout-request 60000 --timeout-script 60000
```

**Exit code: 1** (Newman FAIL — giữ nguyên, không ép pass). Preflight PASS, inspection PASS, setup/teardown NOT REQUESTED. Wall-clock ~4m36s.

### Kết quả
- Requests: 89/89
- Assertions: **247/267 pass, 20 fail**
- Test cases: **41 PASS / 12 FAIL** trên 53 `tc_id`
- FAIL: `TC-01, TC-07, TC-15, TC-19, TC-21, TC-23, TC-36, TC-37, TC-38a, TC-38b, TC-39, TC-44, TC-45`
- BLOCKED / NOT OBSERVED: không có

### Re-run delta
Archive: `reports/archive/20260828T194022Z/` (baseline 42 tc_id, 207 assertions, 22 fail)

| | |
|---|---|
| Added (11) | TC-42, TC-43a–g, TC-44, TC-45, TC-46 |
| Removed / renamed | không |
| Newly failing | **0** |
| Newly passing (6) | TC-28, TC-29, TC-30, TC-31, TC-34, TC-35 |
| Still failing (11) | TC-01, TC-07, TC-15, TC-19, TC-21, TC-23, TC-36, TC-37, TC-38a, TC-38b, TC-39 |
| Still passing | 24 |
| Trong 11 case mới | TC-44, TC-45 fail; 9 case còn lại pass |

6 case newly passing là do Pass 2 audit hạ các facet UNSPECIFIED từ assertion cứng xuống observation — thay đổi oracle trong suite, **không phải** SUT đổi hành vi.

### Bug candidates — không có root cause mới
Cả 20 assertion fail quy về 3 defect đã có trong `BUG_REPORT.md`:

| Root cause (`apps/backend/server.js`) | Bug id | tc_id |
|---|---|---|
| `:55` `login_attempts + 2` → khóa ở lần sai thứ **2**, SRS ghi 3 | BUG-FR02-01 | TC-19, TC-36, TC-38a, TC-38b*, TC-44, TC-45 |
| `:57` `Date.now() + 180000` → khóa **180s**, SRS ghi 30s | BUG-FR02-02 | TC-15, TC-21, TC-23 |
| `:51` `res.json({..., user})` trả cả `password` plaintext (SEC-01) | BUG-FR02-03 | TC-01, TC-07, TC-37, TC-39 |

\* TC-38b là cascade: TC-38a không lấy được token nên endpoint bảo vệ trả 401.

### BUG_REPORT.md sync
- **Appended: none** — không có root cause mới, không chạy `append-bug-report.mjs`.
- Skipped as duplicate: none (không có bug object nào được tạo).
- Re-confirmed evidence: BUG-FR02-01, -02, -03 — vẫn reproduce, không sửa entry.
- **BUG-FR02-04** (malformed JSON stack trace) không còn assertion fail nào cover: Pass 2 audit đã hạ TC-32/33/34/41 xuống characterization, giờ chỉ ghi `observed_stack_or_html_*`. Entry giữ nguyên Open — đây là **fix candidate cho bạn quyết định**, tôi không tự đóng.
- Không bug nào cần mở GitHub Issue mới (issue #44–#47 đã tồn tại).

### Artifacts
```
reports/newman-report.json          2.8 MB
reports/newman-report.html
reports/test-execution.md           + section "Re-run delta"
reports/run-cycle.json              + rerun{archivePath, delta, bugReportSync}
reports/archive/20260828T194022Z/   evidence run trước (4 file)
```

### Cleanup còn lại
1. **Backend do tôi khởi động vẫn đang chạy** — PID `122956`, log ở scratchpad. Nói một tiếng nếu bạn muốn tôi kill.
2. `test@eshop.com` và `admin@eshop.com` còn `login_attempts` khác 0 và có thể đang trong lock 180s. Restart backend không reset (DB đã seed) — cần reset DB-level nếu chạy suite khác ngay.
3. `reports/newman-report.json` chứa response body có JWT và trường `password` plaintext của seed account — review trước khi commit/chia sẻ.
````

### Used In

- Feature or task: FR-02, Newman run, failure tracing, bug write-up
- Artifact: `artifacts/newman/fr-02-login/` (report, `test-execution.md`, archived Pass 1 run), `BUG_REPORT.md` entries BUG-FR02-01 to BUG-FR02-04
- AI Audit mapping: Artifact #4

---

## Entry 012 | `2026-08-29T10:03:13+07:00`

**Tool and model:** Claude Code (Opus 5)

**Task:** FR-08 Checkout, Pass 2 re-audit

### Prompt (verbatim)

```
Invoke the `api-test-auditor` skill for one already-generated suite. The skill picks its own
mode: a first-pass audit when `audit/` is empty, its Pass 2 re-audit when a Pass 1 audit is
already there. Follow that workflow. Read `references/audit-heuristics.md` before labeling anything.

## Target

- FR id: FR-08 (Checkout), `POST /api/checkout`
- Suite dir: `homeworks/HW06/artifacts/test-cases/fr-08-checkout/` (`master-test-cases.md`, TC-01..TC-35, plus the four supporting catalogs)
- Output dir: `homeworks/HW06/artifacts/test-cases/fr-08-checkout/audit/`

## Authoritative oracles (only these)

- `docs/eshop-sut/api_specification.md` section 4.3 (and 4.2 / 5.1 where cart and coupon preconditions are cited)
- `docs/eshop-sut/srs.md`, FR-08
- `specs/security-requirement.md` (SEC-01..SEC-07)

The generator's own catalogs are inputs under review, never evidence.

## Audit focus

- Verify every `Trace` by opening the cited location; an unverifiable trace is `INVALID`.
- Check the order-lifecycle cases hardest: cart-to-order transition, cart emptied after success, stock decrement, coupon/total recalculation, and empty-cart rejection. Flag any expected result that invents a status code, error message, or total-computation rule the sources never state.
- Preconditions must be reachable through documented endpoints; a case that assumes DB state no API can set is `INCOMPLETE`.
- Keep `UNSPECIFIED` where the sources are silent and flag any original case that already upgraded it to a concrete value.

## Missed-case gaps to probe

Cross-user cart/order isolation (User B cannot check out User A's cart), checkout without a token, double submit of the same cart, out-of-stock or quantity-exceeding-stock at checkout time, expired or already-used coupon at checkout, and error-response shape consistency. Add at least five source-backed additions.

## Boundaries

- Never modify `master-test-cases.md` or any generated file outside `audit/`.
- Do not send requests to the SUT, build Postman artifacts, or report pass/fail.
- Stop at both confirmation gates (label table, then proposed additions) and wait for my approval before writing files.

## Pass 1 deliverable

`audit/audit-log.md`, `audit/extended-test-cases.md`, `audit/audited-master-test-cases.md`, ending with the label counts inline in chat.

## Re-audit challenge targets (Pass 2 only)

- Order-lifecycle rows: re-check cart-to-order transition, cart emptied after success, stock
  decrement, and total/coupon recomputation against `api_specification.md` section 4.3 alone.
  Any status code, error message, or arithmetic rule the section does not state must be
  `UNSPECIFIED` in both the case and the fix.
- Preconditions: confirm every state the previous pass accepted is reachable through documented
  endpoints, and that its fixes did not introduce a state no API can set.
- Cross-user and double-submit additions: verify they rest on a cited source rather than on a
  reasonable-sounding isolation assumption.
```

### AI Output (verbatim)

```
Đã re-derive toàn bộ 41 dòng từ oracle gốc. Trước khi trình bảng, hai phát hiện gốc rễ làm đổ phần lớn Pass 1:

**Sai trích dẫn hệ thống #1 — `api_specification.md` dòng 141 là dòng TRỐNG.** Header auth của section 4 nằm ở **dòng 131**. Dòng 141 nằm giữa block body của 4.2. Sai sót này bắt nguồn từ `specs/requirements.md` (artifact do generator sinh) rồi lan vào 8 dòng TC: TC-11, TC-12, TC-21, TC-22, TC-23, TC-24, TC-32, TC-36. Pass 1 còn khẳng định nguyên văn: *"All cited line numbers exist and directly support the claims made against them; no false trace was found"* — mệnh đề này sai.

**Sai trích dẫn hệ thống #2 — `srs.md` dòng 164 là heading FR-11**, không phải câu *"Người dùng chỉ xem được đơn hàng của chính mình"* (thực tế ở **dòng 166**). TC-39 của Pass 1 trích sai.

**Phát hiện cấu trúc:** TC-15 chỉ có **6 cột** — thiếu hẳn cột `Oracle`, nội dung Trace tràn vào ô Oracle. Pass 1 gán VALID mà không kiểm tra cấu trúc dòng.

**Về stock:** không nguồn nào (`api_specification.md` 3.3/6.3, `srs.md`) định nghĩa trường tồn kho. `stock` không tồn tại trong model sản phẩm được tài liệu hoá. Nên gap "out-of-stock at checkout" trong yêu cầu của bạn **không thể thêm** như một case có nguồn — thêm vào sẽ là bịa một chiều dữ liệu mà đặc tả chưa hề có. Tôi nêu ra thay vì chế ra dòng test.

---

## GATE 1 — Bảng bất đồng (25 dòng thay đổi)

| TC | Pass 1 | Pass 2 | Verdict | Khiếm khuyết cụ thể ở Pass 1 |
| --- | --- | --- | --- | --- |
| TC-02 | VALID | INCOMPLETE | overturned | Trace chỉ gồm `EC-02` + `specs/requirements.md` — cả hai là generated artifact. Không có vị trí nguồn thẩm quyền nào. Fix: Trace → `api_specification.md` 4.3 dòng 156-161 (nơi xác lập sự im lặng về validation). |
| TC-03 | VALID | INCOMPLETE | overturned | Như TC-02: trace generated-only. |
| TC-04 | VALID | INCOMPLETE | overturned | Như TC-02: trace chỉ `EC-04`. |
| TC-05 | VALID | INCOMPLETE | overturned | Trace `equivalence-partitioning-and-bva.md` — file này chỉ tồn tại ở `.agents/skills/api-test-generator/references/`, là tài liệu phương pháp của chính generator, không nằm trong suite và không phải oracle. Pass 1 còn dẫn nó làm "Source evidence". |
| TC-08 | VALID | INCOMPLETE | overturned | Trace generated-only (`EC-09`; `specs/requirements.md`). |
| TC-10 | VALID | INCOMPLETE | overturned | Trace generated-only (`EC-11`; `specs/requirements.md`). |
| TC-11 | VALID | INCOMPLETE | overturned | Trace `api_specification.md line 141` sai (dòng trống). Còn `srs.md` FR-08 dòng 104 đã verify nên dòng vẫn cứu được. Fix: 141 → 131. |
| TC-12 | VALID | **INVALID** | overturned | Trace thẩm quyền duy nhất là dòng 141 (trống); phần còn lại là `SEC-C-02` generated. Không còn trace nào chống đỡ kết quả kỳ vọng. Fix: Trace → `api_specification.md` dòng 131 + `srs.md` FR-08 dòng 104. |
| TC-13 | VALID | INCOMPLETE | overturned | Hai lỗi: trace generated-only; và Expected result khẳng định *"must not reveal materially more diagnostic detail than a single-field violation"* — không nguồn nào quy định luật information-disclosure cho validation error. Fix: hạ xuống quan sát, không phải MUST. |
| TC-14 | VALID | INCOMPLETE | overturned | Trace `srs.md` FR-07 dòng 100 = *"Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng"* — yêu cầu hiển thị UI, sai phạm vi cho hành vi API. Thêm nữa precondition "cart có đúng 0 item" không nêu đường đạt tới: **không có endpoint xoá giỏ nào được tài liệu hoá** (section 4 chỉ có `GET /api/cart` và `POST /api/cart`). |
| TC-15 | VALID | INCOMPLETE | overturned | Dòng thiếu cột `Oracle` (6/7 cột). Pass 1 không kiểm cấu trúc. Fix: bổ sung Oracle → response của checkout + `GET /api/cart` (4.1) xác nhận giỏ trống. |
| TC-18 | INCOMPLETE | INCOMPLETE | fix-corrected | Nhãn đúng, nhưng fix của Pass 1 bỏ sót lỗi trace: dòng vẫn dẫn `FR-07 line 100` sai phạm vi như TC-14. Fix bổ sung phần sửa trace. |
| TC-20 | VALID | INCOMPLETE | overturned | Trace `srs.md` FR-07 dòng 93-100 **không hề phát biểu giỏ hàng thuộc sở hữu từng user** — FR-07 chỉ mô tả cột hiển thị, gộp số lượng, dialog xoá, nhãn tổng tiền. Nửa "order isolation" thì có nguồn thật ở dòng 166 nhưng không được dẫn. Fix: bổ sung `srs.md` dòng 166 + FR-08 dòng 104; đánh dấu nửa cart-isolation là suy luận. |
| TC-21 | VALID | INCOMPLETE | overturned | Trace 141 sai (còn FR-08 dòng 104 cứu được). Thêm: *"no internal error detail leaked"* không có nguồn nào quy định. |
| TC-22 | VALID | **INVALID** | overturned | Trace thẩm quyền duy nhất = dòng 141 (trống). |
| TC-23 | VALID | **INVALID** | overturned | Trace thẩm quyền duy nhất = dòng 141 (trống). |
| TC-24 | VALID | **INVALID** | overturned | Hai lỗi: trace 141 sai; và precondition "token đã hết hạn" **không đạt tới được qua endpoint nào** — không nguồn nào tài liệu hoá TTL của JWT hay cách lấy token hết hạn. Pass 1 chỉ ghi "correctly hedged on expiry construction details". |
| TC-25 | VALID | INCOMPLETE | overturned | Biến thể `cart_id` không đạt tới được: không surface nào được tài liệu hoá phơi ra cart id (`GET /api/cart` không có response schema). Fix: bỏ nhánh `cart_id`, giữ `user_id` (lấy qua `GET /api/users/me` §2.1 khi đăng nhập bằng User B). |
| TC-31 | VALID | INCOMPLETE | overturned | Khẳng định *"side-effect invariant is assertable regardless: no order created"* cho giỏ trống. Không nguồn nào quy định checkout giỏ trống phải bị từ chối, nên "không tạo order" là suy ra một cấm đoán từ im lặng. **Mâu thuẫn trực tiếp với TC-14** vốn ghi đúng là UNSPECIFIED cho cùng request. |
| TC-32 | VALID | INCOMPLETE | overturned | Trace 141 sai. Nửa "no order created" thực ra có nguồn ở FR-08 dòng 104 (chỉ user đã đăng nhập mới checkout được) nhưng không được dẫn. |
| TC-33 | VALID | INCOMPLETE | overturned | *"must not be a raw stack trace or unparseable/HTML error page"* là một MUST không nguồn; "document-wide JSON convention" là suy luận, không phải điều khoản. Fix: hạ xuống ghi nhận quan sát. |
| TC-36 | (không gán) | INCOMPLETE | fix-corrected | Addition của Pass 1 kế thừa đúng lỗi trace 141. Nội dung gap hợp lệ, giữ lại. |
| TC-37 | (không gán) | INCOMPLETE | fix-corrected | Khẳng định *"none of these validation-error attempts may have created an order or cleared the cart"* — chỗ dựa duy nhất là `schema-cases.md` SC-08 (generated). FR-08 dòng 108 chỉ tài liệu hoá việc xoá giỏ **khi thành công**, không cấm hiệu ứng khi thất bại. Khác hẳn TC-21/22/23/24/32 nơi cùng câu chữ đó lại có nguồn thật (dòng 104). |
| TC-39 | (không gán) | INCOMPLETE | fix-corrected | Trích `srs.md` dòng 164 cho câu nằm ở dòng 166. Nội dung backing rất mạnh, chỉ sửa trích dẫn. |
| TC-41 | (không gán) | INCOMPLETE | fix-corrected | Trace không có vị trí thẩm quyền nào (chỉ `SC-11` generated + "document-wide convention"). Expected result thì đúng chuẩn UNSPECIFIED. |

**Quy tắc tôi áp dụng cho trace sai, phát biểu rõ để bạn kiểm chứng tính đối xứng:** dòng có trace sai **và** không còn trace thẩm quyền nào độc lập chống đỡ kết quả kỳ vọng → `INVALID` (TC-12, 22, 23, 24). Dòng có trace sai **nhưng** còn một trace đã verify độc lập → `INCOMPLETE` + sửa trích dẫn (TC-11, 21, 32, 36).

## Các dòng upheld (16) — kèm check quyết định

- **VALID upheld (13):** TC-01 (trace `api_spec` 4.3 dòng 151-161 chứa đúng request shape; Expected không bịa status code) · TC-06, TC-34, TC-35 (Expected khẳng định KHÔNG có gì, đúng luật spec-silence) · TC-07, TC-09, TC-26, TC-30 (dựa `srs.md` dòng 107 — điều khoản recompute vô điều kiện, đã mở và verify) · TC-16 (dòng 108 tài liệu hoá việc xoá giỏ; oracle dùng `GET /api/cart` §4.1 có thật) · TC-19 (tự gắn nhãn suy luận của chính nó, không khẳng định luật) · TC-27, TC-28 (dòng 282 SEC-05 verify) · TC-29 (hedge `pending` là "weakly inferable" từ topology FR-10, không khẳng định).
- **INCOMPLETE upheld (1):** TC-17 — oracle không phân biệt nổi nhánh "empty order created"; fix của Pass 1 dùng `GET /api/orders/my-orders` (§4.4 có thật) và không nâng cấp UNSPECIFIED thành giá trị cụ thể.
- **Addition upheld (2):** TC-38, TC-40.

## Đếm

**Nhãn Pass 2:** VALID 15 | INVALID 4 | INCOMPLETE 22 | Total 41
**Delta so với Pass 1** (Pass 1: VALID 33, INVALID 0, INCOMPLETE 2 trên 35 dòng gốc): VALID −20, INVALID +4, INCOMPLETE +20
**Verdict:** upheld 16 | overturned 20 | fix-corrected 5 | dropped 0 = 41

Đã re-derive cả 41 dòng từ oracle, không dòng nào mang nhãn cũ sang.

## Nhất quán liên dòng (những gì per-case pass không thấy)

1. **TC-14 ↔ TC-31 mâu thuẫn:** cùng một request giỏ trống, TC-14 ghi UNSPECIFIED còn TC-31 khẳng định invariant cứng.
2. **Cùng câu chữ, khác hẳn tư cách bằng chứng:** "no order created" có nguồn ở TC-21/22/23/24/32 (FR-08 dòng 104) nhưng vô căn cứ ở TC-31/TC-37. Suite v2 phải phân biệt hai loại này.
3. **Xung đột thứ tự chạy:** TC-17 yêu cầu chạy ngay sau TC-16 thành công (giỏ đã trống), trong khi TC-02..TC-13 đều đòi "cart non-empty". Suite không quy định run order và **không có endpoint xoá giỏ**, nên mọi dòng "cart non-empty" phải nêu rõ bước nạp lại qua `POST /api/cart` §4.2.
4. **Fix phải đồng bộ:** sửa 141→131 phải áp cho cả 8 dòng cùng lúc, nếu không các fix mâu thuẫn nhau.

## Chi phí downstream (cần bạn nắm)

Suite này đã có `data/` và các artifact thực thi. 20 dòng overturned + 5 fix-corrected sẽ khiến mọi Postman collection / CSV / RUN.md sinh từ suite pre-audit **không còn khớp**. Không có TC ID nào bị đổi số hay bị drop, nên trace ID vẫn nguyên; nhưng nội dung Trace/Oracle/Expected của 25 dòng đổi. Cần chạy lại `api-test-sync` sau khi Pass 2 ghi file.

---

**Gate 1.** Bạn duyệt bảng bất đồng này, hay muốn tôi xem lại TC nào? Sau khi bạn chấp nhận, tôi trình Gate 2 — phần additions v2 (đã tìm được 6 gap có nguồn: tương tác coupon tại checkout, coupon hết hạn `EXPIRED`, coupon vượt `max_uses_per_user`, IDOR trên `GET /api/orders/:id`, trạng thái khởi tạo order qua §4.5, và **price do client cung cấp trong `POST /api/cart` làm vô hiệu hoá luật recompute ở FR-08 dòng 107** — cái cuối là gap nặng nhất và cả 41 dòng hiện tại đều bỏ sót).
```

### Used In

- Feature or task: FR-08, re-audit plus backward correction of the false citations in the generator documents
- Artifact: `artifacts/test-cases/fr-08-checkout/audit/audit-log-v2.md`, `extended-test-cases-v2.md`, `audited-master-test-cases-v2.md`; corrections in commit `106ac14`
- AI Audit mapping: Artifact #2

---

## Entry 013 | `2026-08-29T12:04:17+07:00`

**Tool and model:** Claude Code (Opus 5)

**Task:** FR-15 Product Management Admin CRUD, Pass 2 re-audit

### Prompt (verbatim)

```
nvoke the `api-test-auditor` skill for one already-generated suite. The skill picks its own
mode: a first-pass audit when `audit/` is empty, its Pass 2 re-audit when a Pass 1 audit is
already there. Follow that workflow. Read `references/audit-heuristics.md` before labeling anything.

## Target

- FR id: FR-15 (Admin Product CRUD), `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- Suite dir: `homeworks/HW06/artifacts/test-cases/fr-15-product-crud/` (`master-test-cases.md`, TC-01..TC-43, plus the four supporting catalogs)
- Output dir: `homeworks/HW06/artifacts/test-cases/fr-15-product-crud/audit/`

## Authoritative oracles (only these)

- `docs/eshop-sut/api_specification.md` section 3.3 (and 3.1 / 3.2 / 3.4 for read-back and `category_id` preconditions)
- `docs/eshop-sut/srs.md`, FR-15
- `specs/security-requirement.md` (SEC-01..SEC-07)

The generator's own catalogs are inputs under review, never evidence.

## Audit focus

- Verify every `Trace` by opening the cited location; an unverifiable trace is `INVALID`.
- This suite spans three verbs: check that each case names the right verb, and that a case written for one verb is not implicitly reused as evidence for another.
- Check the lifecycle cases hardest: create to read-back, update of a non-existent id, delete then re-read, delete of an id already deleted, and the fate of a product referenced by an existing cart or order. Flag invented status codes or cascade behavior the sources never state.
- Check authorization on every verb: admin vs registered non-admin vs anonymous. A missing role dimension on any verb is `INCOMPLETE`.
- Keep `UNSPECIFIED` where the sources are silent and flag any original case that already upgraded it to a concrete value.

## Missed-case gaps to probe

Invalid or non-existent `category_id`, negative or non-numeric price, ownership/role bypass via a customer token, idempotency of repeated `DELETE`, `PUT` with a partial body, and error-response shape consistency across the three verbs. Add at least five source-backed additions.

## Boundaries

- Never modify `master-test-cases.md` or any generated file outside `audit/`.
- Do not send requests to the SUT, build Postman artifacts, or report pass/fail.
- Stop at both confirmation gates (label table, then proposed additions) and wait for my approval before writing files.

## Pass 1 deliverable

`audit/audit-log.md`, `audit/extended-test-cases.md`, `audit/audited-master-test-cases.md`, ending with the label counts inline in chat.

## Re-audit challenge targets (Pass 2 only)

- Verb attribution: re-check that no row, and no Pass 1 fix, uses evidence drawn from one verb
  to justify a case written for another.
- Authorization dimension: confirm admin / registered non-admin / anonymous were each judged
  per verb, and that a missing role was labeled `INCOMPLETE` rather than waved through.
- Lifecycle and cascade rows: delete-then-re-read, repeat `DELETE`, and a product referenced by
  a cart or order. Any cascade behavior `api_specification.md` section 3.3 does not state must
  stay `UNSPECIFIED` in both the case and the fix.
```

### AI Output (verbatim)

```
Đã re-derive toàn bộ 48 hàng (TC-01..TC-43 gốc + TC-44..TC-48 bổ sung Pass 1) trực tiếp từ oracle. Xác minh trước: mọi số dòng Pass 1 trích dẫn đều **đúng** (srs.md FR-12 L177/179, FR-14 L186-189, FR-15 L193-198, SEC L278-284; api_spec L96-118). Cấu trúc thiếu cột `Oracle` ở TC-37..43 cũng **đúng** (đếm pipe: 8 field vs 9).

## GATE 1 — Bảng bất đồng (chỉ các hàng đổi label / evidence / fix)

| TC | Pass 1 | Pass 2 | Verdict | Khiếm khuyết cụ thể của Pass 1 |
| --- | --- | --- | --- | --- |
| TC-03 | VALID | INCOMPLETE | overturned | Pass 1 khẳng định `""` vi phạm "bắt buộc" như điều đã ghi. Nhưng srs.md L195 chỉ viết "bắt buộc"; chính SRS khi muốn cấm rỗng thì viết rõ — FR-14 L189: "bắt buộc, **không được để trống**". Đối chiếu hai dòng cho thấy FR-15 im lặng về chuỗi rỗng → thuộc quy tắc spec-silence, phải hedge. |
| TC-11 | VALID | INCOMPLETE | overturned | Expected result nói `1` là "smallest positive value satisfying > 0" — sai nếu chấp nhận thập phân. Chính bổ sung TC-47 của Pass 1 lập luận `"số dương"` ≠ `"số nguyên dương"`. Hai hàng mâu thuẫn nhau; Pass 1 không phát hiện. |
| TC-14 | VALID | INCOMPLETE | overturned | Pass 1 lập luận "consistent with TC-08" — **không đúng thực tế**. TC-08 nêu kết quả ("expected rejected in principle"), TC-14 chỉ nói UNSPECIFIED về status/shape mà **không nêu kết quả mong đợi nào**. Trong khi L197 "phải chọn từ danh sách có sẵn" đủ quyết định `"electronics"` bị từ chối. Hàng thiếu Expected result. |
| TC-23 | VALID | INCOMPLETE | overturned | Khẳng định "Rejected as not-found" cho `DELETE` id không tồn tại. api_spec 3.3 (L103-118) im lặng — 204 idempotent là kết cục hợp lệ không kém. TC-22 gắn nhãn "assumption to verify", TC-23 thì không. Cùng điều kiện, hai chuẩn khác nhau. |
| TC-24 | VALID | INCOMPLETE | overturned | **Trúng challenge target.** Hàng khẳng định "the second `DELETE` behaves identically to TC-23". Không nguồn nào đồng nhất "chưa từng tồn tại" với "đã xóa" (soft-delete cho kết quả khác). Lý lẽ Pass 1 — *"correctly treats a deleted resource as re-entering the same condition since no source distinguishes the two"* — chính là đảo ngược quy tắc spec-silence: im lặng không phải là giấy phép khẳng định tương đương. |
| TC-29 | VALID | INCOMPLETE | overturned | Precondition "attacker holds an expired-shaped admin-claim token" không tái lập được: token hết hạn hợp lệ chữ ký cần JWT secret, không nêu cách lấy. Đối chiếu TC-44 (chữ ký giả) — dựng được không cần secret, precondition mô tả rõ. Chuẩn bất đối xứng. |
| TC-33 | VALID | INCOMPLETE | overturned | Expected khẳng định payload được lưu "as an inert literal" nhưng Oracle chỉ kiểm tra catalog còn nguyên. Nửa khẳng định (giá trị lưu nguyên văn) không có assertion quan sát được. |
| TC-34 | VALID | INCOMPLETE | overturned | Cùng lỗi under-assertion: "only A's `description` changes" nhưng Oracle chỉ ghi "A (changed)", không so `description` với payload nguyên văn. |
| TC-35 | VALID | INCOMPLETE | overturned | **Trúng challenge target (evidence bắc cầu sai domain).** Trace `SEC-06` — srs.md L283 chữ nghĩa chỉ điều chỉnh `PUT /api/users/me`; dùng cho `/api/products` là false trace kiểu "reusing a requirement ID across domains". Thêm nữa Oracle "a follow-up non-admin-token attempt (TC-30-style) is still rejected" mượn điều kiện của TC-30 (một case POST auth) làm bằng chứng cho case mass-assignment. `security-requirement.md` tự nhận đây là "extension, not an asserted fact" — nhưng nó là generated artifact, không phải evidence. |
| TC-36 | VALID | INCOMPLETE | overturned | Cùng lỗi trên bản PUT; thêm Oracle "no privilege change observed for **any account**" — phạm vi không quan sát được. |
| TC-43 | INCOMPLETE | INCOMPLETE | fix-corrected | **Bad fix.** Fix của Pass 1 viết "each response ... **must** not leak internal error/stack detail". srs.md section 9 (L278-284) không có SEC nào về information disclosure. Fix tự chế ra requirement — phải hạ xuống characterization (ghi nhận, không khẳng định). |
| TC-45 | — (bổ sung) | INCOMPLETE | fix-corrected | Khẳng định "request rejected as an invalid/not-found id" cho path id phi số. Nhưng TC-17 (`PUT /api/products/abc`, cùng lớp) để UNSPECIFIED. Phần có nguồn chỉ là hệ quả SEC-05 (catalog nguyên vẹn). |
| TC-48 | — (bổ sung) | INCOMPLETE | fix-corrected | Gộp hai điều kiện (`/0` và `/-1`) trong một hàng → vi phạm "one identifiable condition". (Downstream `data/test-data.csv` đã phải tự tách thành `TC-48a`/`TC-48b` — bằng chứng lỗi này có thật.) |

**35 hàng upheld** (24 VALID gốc + 8 INCOMPLETE gốc giữ nguyên fix: TC-05, 18, 37, 38, 39, 40, 41, 42 + 3 bổ sung: TC-44, 46, 47) — đều re-derive lại từ oracle, không mang lý lẽ Pass 1 sang.

Hai điểm **bảo vệ Pass 1** sau khi tự kiểm tra ngược (false positive hunt):
- **TC-05 upheld.** "tối đa 255 ký tự" là cận trên *tường minh bao gồm*, không phải im lặng — khác ví dụ "khóa 30 giây" trong heuristics. Pass 1 nâng UNSPECIFIED → "Accepted" là đúng, không phải bad fix.
- **TC-18 upheld.** `price=0` trên PUT đúng là BVA chứ không phải EP; và ràng buộc L196 phủ cả hai verb vì api_spec L108 ghi "Body khi **Thêm/Sửa**" chung — không có lỗi verb attribution.

**Kiểm tra bắt buộc theo challenge target:**
- *Verb attribution*: TC-37/38/39/40/41 quy chiếu đúng verb (POST/PUT/DELETE). TC-43 xuyên verb nhưng đó là chủ đích. Chỉ TC-35/36 mượn evidence sai domain → đã bắt.
- *Authorization × verb*: anonymous (TC-25/26/27), non-admin (TC-30/31/32), admin-success (TC-01/21/24) — **đủ 3 principal × 3 verb**, không hàng nào bị thả nổi. Nhưng token-validity (SEC-02) lệch: malformed chỉ có POST, expired chỉ có PUT → xử lý ở phần bổ sung.
- *Lifecycle/cascade*: TC-24 (đã bắt), TC-46 (category→product, upheld). **Sản phẩm bị cart/order tham chiếu: không hàng nào phủ** → gap.

## Đếm

| Label | Pass 1 | Pass 2 |
| --- | --- | --- |
| VALID | 34 (+5 bổ sung chưa gán) | 27 |
| INVALID | 0 | 0 |
| INCOMPLETE | 9 | 21 |
| **Tổng** | 43 (+5) | **48** |

Verdict: `upheld` 35 · `overturned` 10 · `fix-corrected` 3 · `dropped` 0 — **tổng 48** ✓

**Downstream cost:** `data/test-data.csv` (49 dòng) và `data/request-template.md` đang phản ánh suite *sau Pass 1*; các fix Pass 2 ở TC-14/23/24/29/33/34/35/36/43/45 làm cột `expected_status_note` / `expected_side_effect_note` của các dòng đó lỗi thời, và TC-48a/48b cần đổi thành TC-48/TC-55. Chưa sinh lại — cần chạy `api-test-sync` sau khi audit chốt.

Anh duyệt bảng này, hay muốn tôi xem lại TC nào?
```

### Used In

- Feature or task: FR-15, re-audit of the Pass 1 suite against the authoritative oracles
- Artifact: `artifacts/test-cases/fr-15-product-crud/audit/audit-log-v2.md`, `extended-test-cases-v2.md`, `audited-master-test-cases-v2.md`
- AI Audit mapping: Artifact #3

---

## Entry 014 | `2026-08-29T22:12:19+07:00`

**Tool and model:** Claude Code (Opus 5)

**Task:** CI/CD pipeline and the two sample runs

**Note:** The run paused on an approval question first: the full suites cannot go green because the SUT has real bugs, so the student chose a quarantined regression subset as the gate. The output below is the completion summary of the same task, after that decision.

### Prompt (verbatim)

```
Tiếp theo, tôi muốn bạn giúp tôi setup một ci/cd pipeline theo yêu cầu của HW06, sau đó thực hiện thu thập bằng chứng theo yêu cầu trong @homeworks/HW06/REQUIREMENTS.md
```

### AI Output (verbatim)

```
**Saved — will be active from next session.**

## Xong. Tóm tắt

**Pipeline:** `.github/workflows/hw06-api-tests.yml` — GitHub Actions, matrix 3 job song song (fr-02 / fr-08 / fr-15), mỗi job xoá `database.sqlite`, khởi động SUT với `RESET_DB=1`, chạy Newman, upload report + ghi bảng kết quả vào job summary. Không cần secret. `X-Student-Id: 23127216` inject qua env `STUDENT_ID`.

**Cách giải quyết xung đột "all-pass":** gate chạy *CI regression subset*.
- `artifacts/cicd/ci-quarantine.json` — 38 TC bị loại, mỗi TC gắn bug id + số issue
- `build-ci-data.mjs` — sinh `ci-data.csv` từ `test-data.csv` đã audit, bỏ TC quarantine và TC phụ thuộc chúng
- Xanh nghĩa là "không có regression mới", không phải "không còn bug" — nói rõ trong report

| API | Rows | Quarantine | Dependency | Vào gate |
|---|---:|---:|---:|---:|
| FR-02 | 53 | 13 | 0 | 40 |
| FR-08 | 50 | 8 | 6 | 36 |
| FR-15 | 56 | 17 | 3 | 36 |

**Hai sample run thật:**
- **Xanh** — commit `f018a7d`, [run 33260661696](https://github.com/lhlam2515/software-testing/actions/runs/33260661696), Success 3m38s, 3/3 job xanh, 403 assertion pass, 0 fail
- **Đỏ** — commit `49dd0dc` seed regression vào `PUT /api/products/:id` (throw thay vì trả JSON → Express trả HTML error page), [run 33261095283](https://github.com/lhlam2515/software-testing/actions/runs/33261095283), Failure 3m33s, **đúng 1 test case fail** (FR-15 TC-17), hai job kia vẫn xanh. Commit `8d2013f` revert, run sau đó xanh lại.

**Bằng chứng đã commit:** `artifacts/cicd/README.md` (CI/CD report đầy đủ), `artifacts/cicd/evidence/run-all-pass|run-one-fail/<fr>/` (HTML report + summary.md + sut.log), 3 screenshot trong `assets/`.

**Phát hiện phụ:** FR-15 **TC-32** (DELETE bằng token non-admin) chỉ pass trong full suite vì một row quarantine trước đó đã xoá mất product đích. Chạy độc lập nó fail thật → đã quarantine dưới BUG-FR15-03. Đây là finding đáng cân nhắc bổ sung vào BUG_REPORT.md.

**Còn lại cần bạn quyết:** `REPORT.md` mục 8 tôi đã điền xong nhưng **chưa commit** — file này đang có sẵn nhiều edit dở dang khác của bạn (đổi model attribution, restructure mục 3, v.v.), commit chung sẽ trộn scope. Tương tự `BUG_REPORT.md`, `artifacts/test-cases/README.md`, và `artifacts/test-generator/README.md` (đang bị xoá). Bạn muốn tôi tách commit ra sao?
```

### Used In

- Feature or task: GitHub Actions pipeline, quarantine gate, all-pass and one-fail evidence
- Artifact: `.github/workflows/hw06-api-tests.yml`, `artifacts/cicd/` (`ci-quarantine.json`, `build-ci-data.mjs`, `run-ci-suite.sh`, `summarize-run.mjs`, `evidence/`, `README.md`)
- AI Audit mapping: Artifact #6

---

## Entry 015 | `2026-08-29T22:22:10+07:00`

**Tool and model:** Claude Code (Opus 5)

**Task:** Excel test-case workbook and test summary

### Prompt (verbatim)

```
Theo yêu cầu nộp bài của HW06, tôi sẽ cần nộp một file Excel chứa các test-cases cùng với test summary. Tôi muốn bạn giúp tôi viết script python để dựng lại một file Excel chứa nội dung của một test-cases chuẩn. File Excel này sẽ nên được chi thành như worksheet khác nhau, 1 cho test summary và 3 cho mỗi fr được kiểm tra. File excel được xuất ra được lưu vào trong artifacts/test-cases
```

### AI Output (verbatim)

```
Xong. Hai file trong `homeworks/HW06/artifacts/test-cases/`:

**`build_test_case_workbook.py`** — script dựng workbook, chỉ đọc artifact có sẵn, không tự bịa số:

| Nguồn | Đóng góp |
|---|---|
| `<fr>/audit/audited-master-test-cases-v2.md` | suite cuối (7 cột: TC ID, Technique, Precondition, Input, Expected, Oracle, Trace) |
| `<fr>/audit/extended-test-cases-v2.md` | đánh dấu case student-added + Miss category + Why the AI missed it |
| `<fr>/audit/audit-log-v2.md` | nhãn VALID/INCOMPLETE/INVALID, verdict, student fix |
| `../newman/<fr>/test-execution.md` | kết quả PASS/FAIL, assertion count, evidence |
| `../../BUG_REPORT.md` | bảng bug |

**`23127216_HW06_TestCases.xlsx`** — 4 worksheet:
- `Test Summary`: metadata + 4 bảng (counts per API, phân bố nhãn audit, miss category, danh sách 15 bug)
- `FR-02 Login` (46 TC), `FR-08 Checkout` (47 TC), `FR-15 Product CRUD` (56 TC) — 16 cột, freeze panes, autofilter, tô màu PASS/FAIL và nhãn audit, cột `Origin` highlight case tự thêm.

Số liệu khớp REPORT.md 6.6: 113 AI-generated / 36 student-added / 149 tổng, runner rows 53+50+56=159, assertions 247/267 + 119/127 + 157/173, 15 bug.

Hai điểm xử lý đáng chú ý:
- Sub-case `TC-38a`/`TC-38b` gộp về `TC-38`; parent FAIL nếu bất kỳ sub-case fail — nếu không sẽ đếm sai tổng test case so với suite.
- Row `FIXTURE` trong newman fr-08/fr-15 bị loại khỏi đếm test case (nhưng vẫn tính vào runner rows như REPORT đang làm).

Nếu sửa Markdown nguồn, chạy lại `python3 build_test_case_workbook.py` là workbook tự cập nhật. Script sẽ in cảnh báo ra stderr nếu bảng Markdown lệch số cột hoặc có TC chạy mà không có trong suite — lần chạy này sạch, không cảnh báo.
```

### Used In

- Feature or task: submission workbook built from the audited suites and the execution results
- Artifact: `artifacts/test-cases/build_test_case_workbook.py`, `artifacts/test-cases/23127216_HW06_TestCases.xlsx`
- AI Audit mapping: Artifact #5

---

## Entry 016 | `2026-08-29T23:06:08+07:00`

**Tool and model:** Claude Code (Opus 5)

**Task:** AI test-generator design diagram and pseudocode

**Note:** The design being drawn is the student's own five-skill pipeline, already built and used throughout HW06. The AI rendered the Mermaid source and the pseudocode from that design; it did not invent the architecture.

### Prompt (verbatim)

```
Theo yêu cầu của HW06, tôi sẽ cần thực hiện vẽ sơ đồ của AI test generator mà tôi đã thiết kế, mà ở đây đó là bộ agent skill mà tôi đã tự tay thiết kế, và sử dụng xuyên suốt HW06 này. Do đó, tôi hoàn toàn có cơ sở sử dụng chính tài nguyên này để bạn có thể giúp tôi sử dụng mermaid flow diagram để thực hiện thiết kế, vẽ diagram cho hệ thống này theo đúng yêu cầu của HW06
- For the Create level (G9.5), design an **AI-driven API test generator** for the SUT: given the API specification, it produces test cases automatically. Provide a **self-drawn diagram** and **pseudocode** of the design. ("Self-drawn" means you make the design decisions; any diagramming tool is fine, but the diagram itself must not be AI-generated.)
- For the evidence, the AI test-generator diagram and pseudocode (PNG / Mermaid + `.md` / `.py`).
Sau khi thực hiện thiết kế, vẽ từ nội dung api-test-pipeline hoặc trong mô tả ở REPORT, hãy thực hiện điền thông tin còn thiếu vào bên trong REPORT
```

### AI Output (verbatim)

```
Xong. Diagram + pseudocode đã có, REPORT mục 9 đã điền.

**Artifacts mới — `homeworks/HW06/artifacts/test-generator/`**

| File | Nội dung |
|---|---|
| `generator-pipeline.mmd` / `.png` | Diagram 1: pipeline 7 stage của `api-test-generator` (S1 extract contract → gate documented/UNSPECIFIED → 4 nhánh S2-S5 song song → S6 consolidate + coverage check có vòng lặp deepen → S7 emit CSV → handoff) |
| `generator-boundaries.mmd` / `.png` | Diagram 2: vị trí generator trong pipeline 5 skill, 3 ràng buộc "must not" và 3 human gate |
| `design-diagram.md` | Cả 2 diagram (Mermaid source + PNG) kèm bảng 7 quyết định thiết kế và lý do |
| `pseudocode.py` | Pseudocode Python-syntax: `oracle()` gate dùng chung cho 4 nhánh, `partition_catalog`, `lifecycle_model`, `security_cases`, `schema_cases`, `coverage_gaps`, `FORBIDDEN_IN_THIS_SKILL` |
| `README.md` | Thay TODO cũ bằng index + lệnh render |

**REPORT.md**
- 9.1: nhúng cả 2 PNG, nêu 6 quyết định thiết kế, chốt bằng bằng chứng Pass 1 (cùng model generate + audit đã tự chứng nhận 2 citation sai).
- 9.2: trích core loop, cộng một đoạn nói rõ **giới hạn** của coverage gate: cả 3 FR đều khai "Shortfall: none" và Pass 2 audit lật lại kết luận đó cho FR-08. Đây là điểm mình phải sửa vì bản nháp đầu viết "FR-02 báo thin schema group" — artifact thực tế không nói vậy.
- 2.2: thêm dòng evidence location cho `artifacts/test-generator/`.
- `README.md`: tick checklist item diagram/pseudocode.

**Hai lưu ý**
1. `pseudocode.py` cố ý không parse được bằng `python3` (`SEC_01..SEC_07`, `every(...)`) — nó là design artifact, không phải code chạy. Nếu muốn nộp dạng chạy được thì phải viết lại, nhưng yêu cầu chỉ đòi pseudocode.
2. Section 11 cấm diagram AI-generated. Cơ sở phòng thủ ở đây là các quyết định thiết kế nằm sẵn trong `SKILL.md` viết trước khi test 3 FR, Mermaid chỉ vẽ lại — mình đã viết đúng câu đó vào 9.1. Nhưng việc dùng AI để chuyển SKILL.md thành Mermaid vẫn nên log vào `prompt_log.md` + AI Audit Report, không nên bỏ trống.

Chưa commit.
```

### Used In

- Feature or task: self-designed AI test generator, diagram and pseudocode deliverable
- Artifact: `artifacts/test-generator/` — `diagrams/src/generator-pipeline.mmd`,
  `generator-boundaries.mmd` (plus the `-portrait` variants added later),
  `diagrams/render/*.png`, `design-diagram.md`, `pseudocode.md`
- Later in the same session the pseudocode was moved from `.py` to `.md`, portrait
  layouts were added, and the folder was split into `diagrams/src` and
  `diagrams/render`. The output block above is kept verbatim and still names the
  original paths.
- AI Audit mapping: Artifact #7
