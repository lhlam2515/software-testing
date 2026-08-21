# Prompt Log - HW06

**Student:** Lê Hoàng Lâm (23127216)
**Assignment:** HW06-AI: API Testing on EShop

**Format:** Each entry = Tool · Timestamp · Prompt (verbatim) · AI Output (verbatim or artifact ref)

## Logging Rules

- Record the AI tool and model, ISO timestamp with timezone, exact prompt, and exact output for each logged interaction.
- Preserve prompts and outputs verbatim. Do not reconstruct them from memory.
- Link each entry to its affected artifact and corresponding AI Audit section.
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
