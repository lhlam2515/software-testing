# Prompt Log - HW04

**Student:** Lê Hoàng Lâm (23127216)
**Assignment:** HW04-AI: Automation Testing on EShop

**Format:** Each entry = Tool · Timestamp · Prompt (verbatim) · AI Output (verbatim or artifact ref)

## Logging Rules

- Record the AI tool and model, ISO timestamp with timezone, exact prompt, and exact output for each logged interaction.
- Preserve prompts and outputs verbatim. Do not reconstruct them from memory.
- Link each entry to its affected artifact and corresponding AI Audit section.
- Timestamps below are reconstructed from session transcripts (`~/.codex/sessions/`, `~/.claude/projects/`) and cross-checked against the git commit that followed each interaction (`git log --date=iso-strict`); both sources agree to within the minutes it took to review/commit.

---

## Entry 001 | `2026-08-05T14:25:21+07:00`

**Tool and model:** Claude Code (claude-sonnet-5)

### Prompt (verbatim)

```text
Hãy cho tôi một prompt tương tự để thực hiện với HW04, đặc biệt lần này nội dung HW04 có bao gồm cả các script automation liên quan đến EShop. Chi tiết bạn có thể dọc bên trong @homeworks/HW04/REQUIREMENTS.md
```

Follow-up (Codex, `2026-08-05T14:32:47+07:00`): *"template markdown cho ai-audit cần đầy đủ như HW03; tên folder cho tests hãy sử dụng mã FR (in hoa) thay vì cho in thường (fr); về agent-skill chưa cần tạo folder bây giờ cho tới khi thực sự bắt đầu thực hiện các task bên trong hw04"*

### AI Output (artifact ref)

`homeworks/HW04/` folder scaffold (README.md, REPORT.md, REQUIREMENTS.md, `[AI-02/03/05]_*.md`, `bugs/BUG_REPORT.md`, `prompt_log.md`), committed `fc75772` (`docs(hw04): scaffold empty submission templates for automation testing`, 2026-08-05T15:09:25+07:00).

### Used In

- Feature or task: Workspace scaffold (all features)
- Artifact: `homeworks/HW04/` folder structure
- AI Audit mapping: Artifact #1

---

## Entry 002 | `2026-08-06T00:04:54+07:00`

**Tool and model:** Claude Code (claude-sonnet-5)

### Prompt (verbatim)

```text
Đi thẳng A4, sinh login.spec.ts từ POM đã có
```

Follow-up (`2026-08-06T00:20:35+07:00`): *"Tiếp tục sang lockout.bva.spec.ts trước, commit sau"*

### AI Output (artifact ref)

`artifacts/tests/FR-02/login.spec.ts` + `artifacts/tests/_fixtures/pom/login.page.ts` (data-driven EP/UI-layer spec), committed `9d6fb25`; BVA counterpart committed `d1a7ed4` (both 2026-08-06T00:22+07:00).

### Used In

- Feature or task: FR-02 — Login & Account Lockout (A4 — spec generation)
- Artifact: `artifacts/tests/FR-02/login.spec.ts`
- AI Audit mapping: Artifact #2

---

## Entry 003 | `2026-08-06T09:51:30+07:00`

**Tool and model:** Claude Code (claude-sonnet-5)

### Prompt (verbatim)

```text
ừ, bắt đầu A5 cho FR-02 đi
```

### AI Output (artifact ref)

Network (`assertApi`) and DB-state (`assertDb`) assertions added to `artifacts/tests/_fixtures/fr02-helpers.ts` and `TC-BVA-*` cases, committed `0e45afc` (`test(hw04): add FR-02 network and DB-state assertions (A5)`, 2026-08-06T10:05:41+07:00) and `89fc3b7` (`test(hw04): add DB assertions to FR-02 lockout-reset cases`, 2026-08-06T10:11:43+07:00).

### Used In

- Feature or task: FR-02 — Login & Account Lockout (A5 — assertion patterns)
- Artifact: `artifacts/tests/_fixtures/fr02-helpers.ts`
- AI Audit mapping: Artifact #2

---

## Entry 004 | `2026-08-06T10:07:25+07:00`

**Tool and model:** Claude Code (claude-sonnet-5)

### Prompt (verbatim)

```text
làm A6 cho FR-02 trước
```

### AI Output (verbatim excerpt)

```text
Đã xác nhận: `TC-UI-01` (password không mask) và `TC-07`/`TC-UI-03` (lockout message rò rỉ ở tầng API) đều không trùng với BUG-02-001..004 trong `HW02/BUG_REPORT.md` — là bug mới thật, cần mở Issue ở P6.

Giờ điền phần FR-02 vào `REPORT.md §6.1-6.4` (giữ nguyên style không dùng `§`/`—` trong nội dung mới, theo quy ước đã chốt trước đây):
```

### Used In

- Feature or task: FR-02 — Login & Account Lockout (A6 — self-critique)
- Artifact: `REPORT.md §6.1–6.4` (FR-02 rows)
- AI Audit mapping: Artifact #2

---

## Entry 005 | `2026-08-06T10:29:03+07:00`

**Tool and model:** Claude Code (claude-sonnet-5)

### Prompt (verbatim)

```text
Tôi muốn bạn đánh giá cách áp dụng data-drivent testing của FR-02 theo nội dung tài liệu tham khảo @data-driven-testing.md này và chỉ ra những điểm có thể được cải thiện thêm
```

Follow-up (`2026-08-06T10:45:38+07:00`): *"Đối với việc loop stage đang bị nhân đôi, tôi muốn bạn hãy gom chung 2 file spec lại với nhau, sử dụng một vào lặp for cases duy nhất bao hàm cả 2 test block, sử dụng filter hợp lý cho từng test case là được, không phải phải phát sinh thêm helper phức tạp"*

### AI Output (artifact ref)

Diagnosis: `login.spec.ts` + `lockout.bva.spec.ts` duplicated the Arrange-Act-Assert block, violating the single-loop DDT principle in `data-driven-testing.md §4`. Fix: merged into one file, one `test.describe`, one `for` loop, branching on data fields — committed `0611886` (`refactor(hw04): merge FR-02 login and BVA specs into one loop`, 2026-08-06T10:54:53+07:00).

### Used In

- Feature or task: FR-02 — Login & Account Lockout (DDT compliance review)
- Artifact: `artifacts/tests/FR-02/login.spec.ts`
- AI Audit mapping: Artifact #3

---

## Entry 006 | `2026-08-06T14:58:21+07:00`

**Tool and model:** Claude Code (claude-sonnet-5)

### Prompt (verbatim)

```text
Hãy giúp tôi thực hiện viết script kiểm thử tự động bằng playwright cho FR-09
```

**Execution mechanism:** this prompt invoked the Agent Skill built in Entry 008 (`Skill({skill: "playwright-automation-pipeline", args: "FR-09"})`, 2026-08-06T14:58:25+07:00) — not a raw ad-hoc generation. The skill's own pipeline (survey → POM → data-driven spec → assertions → independent-subagent review → fix) drove the rest of the session.

### AI Output (artifact ref)

`artifacts/tests/FR-09/coupon.spec.ts` + `artifacts/tests/_fixtures/fr09-helpers.ts` (21 cases: 13 EP + 8 BVA, single-loop), committed `c132e82` (`test(hw04): add FR-09 coupon apply spec (EP + BVA, single loop)`, 2026-08-06T15:29:04+07:00).

### Used In

- Feature or task: FR-09 — Discount Coupons (A3→A6 chain)
- Artifact: `artifacts/tests/FR-09/coupon.spec.ts`
- AI Audit mapping: Artifact #4

---

## Entry 007 | `2026-08-06T15:47:07+07:00`

**Tool and model:** Codex CLI (gpt-5.6-sol)

### Prompt (verbatim)

```text
Hãy giúp tôi thực hiện viết script kiểm thử tự động bằng playwright cho FR-16
```

**Execution mechanism:** Codex read the same shared skill (`.agents/skills/playwright-automation-pipeline/`, agent-agnostic per `AGENTS.md`) and announced it explicitly before starting: *"Mình sẽ dùng `playwright-automation-pipeline` để chuyển bộ ca kiểm thử FR-16 thành Playwright + TypeScript, đồng thời dùng quy trình kiểm chứng trước khi kết luận."* (2026-08-06T15:47:19+07:00) — same 9-phase pipeline as Entry 006, including a live-browser locator survey via `playwright-cli` before writing any spec code.

### AI Output (artifact ref)

`artifacts/tests/FR-16/csv-import.spec.ts` + `artifacts/tests/_fixtures/fr16-helpers.ts` + `_fixtures/csv.ts` (24 cases: 19 EP + 5 BVA, single-loop, dynamic CSV fixtures), committed `8ca7a7e` (`test(hw04): add FR-16 CSV import spec (EP + BVA, single loop)`, 2026-08-06T16:37:17+07:00).

### Used In

- Feature or task: FR-16 — CSV Import (A3→A6 chain)
- Artifact: `artifacts/tests/FR-16/csv-import.spec.ts`
- AI Audit mapping: Artifact #5

---

## Entry 008 | `2026-08-06T11:01:19+07:00`

**Tool and model:** Claude Code (claude-sonnet-5)

### Prompt (verbatim)

```text
Bây giờ, tôi muốn bạn hãy đóng gói quy trình từ test-case design thành automation script thành một agent skill với skill-creator theo đúng quy trình trên với các lưu ý sau đây:
- Ở bước đầu tiên, nếu người dùng không provide test-case sẵn có hãy AskUserQuestion test-case ở đâu, nếu không có hãy hỏi người dùng có cần thiết kế test-case hay không, nếu cần hãy thiết kế test-case cho người dùng theo domain-testing skill (nếu có)
- Đối với bước review lại spec vừa sinh, hãy sử dụng một subagent độc lập để thực hiện, đừng kiểm tra inline. Kết quả review sau đó sẽ được repot lại và thực hiện fix assertion ở bước sau.
- Cuối cùng, sau khi có script, hãy tiến hành chạy script, xác nhận script có hoạt động hay không?, đã áp dụng data-driven testing chưa, code có reusable, có bị DRY hay không dưới dạng một checklist
```

### AI Output (artifact ref)

`.agents/skills/playwright-automation-pipeline/SKILL.md` v0.1 (9-phase pipeline), committed `7edba8c` (`feat(skills): add playwright-automation-pipeline skill`, 2026-08-06T11:51:52+07:00). Later refined from the FR-09 retrospective (`38fa927`) and renamed twice — `automation-workflow` → `playwright-spec-generator` (`5db99e4`, 2026-08-11) — see `artifacts/skills/playwright-spec-generator/CHANGELOG.md`.

### Used In

- Feature or task: Agent Skill (Task 3)
- Artifact: `artifacts/skills/playwright-spec-generator/SKILL.md`
- AI Audit mapping: Artifact #6

---

## Entry 009 | `2026-08-10T12:08:41+07:00`

**Tool and model:** Claude Code (claude-sonnet-5)

### Prompt (verbatim)

```text
Bạn hãy giúp tôi review lại script tests/ và các test-data đã đầy đủ và chỉnh xác thể hiện đúng với các case đã được thiết kế quả HW02, các edge case còn thiếu, assertion còn yếu hay không? Và các điềm cần thực hiện refactor và cải thiện cho các script test
```

### AI Output (verbatim)

```text
Bộ test HW04 bám khá sát thiết kế HW02 — 60/60 case đúng số lượng (FR-02: 15, FR-09: 21, FR-16: 24), traceability qua `hw02Ref` đầy đủ, và cách xử lý "assert theo spec, không theo implementation" được áp dụng nhất quán, có bằng chứng đọc thẳng `server.js` để sửa lại expected value sai của HW02 (ví dụ 401 vs 403 cho JWT invalid). Đây là engineering discipline tốt hơn mặt bằng chung của bài tập kiểu này. Nhưng có 4 gap thật và một số điểm assertion yếu cần sửa trước khi nộp, cộng một refactor rõ ràng ở `db.ts`.

---

## 1. Case còn thiếu / bị thu hẹp so với thiết kế HW02

**FR-02 — TC-03 (invalid email format):** `domain-testing.md` dòng 167 yêu cầu rõ "Also test with: `test@`, `@domain.com`, `test @domain.com`" — 3 biến thể format lỗi khác nhau (thiếu domain, thiếu local-part, có khoảng trắng). `cases.json` chỉ có 1 case duy nhất (`invalid_no_at_sign`). HTML5 `type="email"` validate khác nhau tuỳ trình duyệt cho từng biến thể này (đặc biệt `test @domain.com` — khoảng trắng), nên đây không phải edge case thừa mà là đúng loại lỗi 3-browser dễ phát hiện browser-diff nhất trong cả bộ. Nên thêm ít nhất 2 case nữa hoặc parametrize TC-03 thành 3 sub-case.

**FR-02 — TC-05 (empty password):** thiết kế có 2 nhánh tường minh (Branch A: HTML5 chặn / Branch B: server trả lỗi) và yêu cầu ghi nhận `login_attempts` có tăng hay không ở Branch B (gap chưa trả lời). `cases.json` TC-05 không có field `db` nào cả, và `assert.ui` chỉ check `staysOnLoginPage` — assertion này đúng ở cả 2 nhánh nên không phân biệt được nhánh nào thực sự xảy ra. Gap bị bỏ ngỏ, không phải do phát hiện rồi quyết định bỏ (như các gap khác đều có `note` giải thích), mà là thiếu sót không ghi chú.

**FR-09 — TC-13 (client-manipulated total_amount):** case này bị suy yếu đáng kể so với ý đồ gốc. HW02 muốn chứng minh user có thể trả một phần nhỏ giá trị đơn hàng thật. Vì add-to-cart không automate được, case hiện tại luôn chạy với giỏ hàng rỗng thật — vẫn chứng minh được BUG-09-007 nhưng ở dạng yếu hơn.

**FR-16 — các "Gap Probe" mất khung "multiple branches":** TC-13, TC-14, TC-15, TC-16 trong `domain-testing.md` đều được viết tường minh là "spec không định nghĩa — ghi nhận hành vi thực tế". `cases.json` gán expected cứng mà không có field `note` giải thích vì sao chọn nhánh đó, không nhất quán với TC-07/TC-12/TC-18 vốn có `note`.

## 2. Assertion yếu

- FR-02 `assertUi.errorRevealsReason` dùng blacklist regex thay vì whitelist theo đúng 1 câu lỗi generic.
- FR-09 `errorMessage` locator gộp 5 loại lỗi vào 1 OR-regex.
- FR-09 TC-11 chỉ lower-bound `final_amount`, không cross-check `discount_amount`.

## 3. Refactor cần làm

`db.ts` — trùng lặp `open()/try/finally` ở cả 15 hàm, đề xuất `withDb<T>()` wrapper. Cache connection module-level thay vì mở lại mỗi lần (an toàn vì `workers:1`).

**Việc cần làm trước khi nộp**, xếp theo ưu tiên: (1) bổ sung `db` assertion + nhánh A/B cho TC-05 FR-02, (2) thêm `note` cho 4 gap-probe FR-16 (TC-13/14/15/16), (3) mở rộng TC-03 FR-02 thành nhiều biến thể email lỗi, (4) refactor `withDb()` trong `db.ts`.
```

*(Full output — including the assertUi/db.ts sections — preserved above; truncated only where noted.)*

### Used In

- Feature or task: Pre-submission gap review (FR-02, FR-09, FR-16)
- Artifact: `artifacts/tests/**/cases.json`, `_fixtures/db.ts`
- AI Audit mapping: Artifact #7

---

## Entry 010 | `2026-08-10T12:33:21+07:00`

**Tool and model:** Claude Code (claude-sonnet-5)

### Prompt (verbatim)

```text
Tôi vừa thực hiện sửa 3 điểm mà bạn đã yêu cầu, tôi muốn bạn review lại nội dung thực hiện từ git diff commit vừa commit để xác định xem tôi có làm đúng không?
```

### Student verification (verbatim, `2026-08-10T12:48:07+07:00`, posted by the student after independently re-running the suite against the live SUT — not AI-generated)

```text
Đã chạy thử trực tiếp cả 2 phần sửa (TC-03b/c/d và TC-05) trên SUT thật để verify, không chỉ đọc diff tĩnh. Kết quả: cả 3 điểm đều làm đúng, có 1 chi tiết cần sửa lại trong note (sai về nguyên nhân, không sai về kỹ thuật) và 1 việc dọn dẹp còn nợ.

TC-03b/c/d (email format): Cả 4 case đều fail với checkValidity() === true. Đọc Login.jsx:30 xác nhận root cause: field Username là type="text", không phải type="email" như domain-testing.md giả định. Cần sửa lại 1 chỗ: note của TC-03d viết "...vì các trình duyệt xử lý khoảng trắng trong type=email khác nhau" — câu này sai về nguyên nhân, vì không hề có type=email nên không tồn tại browser-diff nào ở đây cả. Đây cũng là chỗ tôi đưa gợi ý sai ở lượt review trước (tôi giả định field là type=email mà không kiểm tra JSX).

TC-05 (empty password): Pass thật, xác nhận đúng Branch A (password field có required, Login.jsx:44).
```

Commits: `2a46ac1` (`test(hw04): close report-reliability gaps in FR-02 and FR-16 cases`, 2026-08-10T12:30:33+07:00), `ee09334` (`fix(hw04): correct TC-03d root cause note and drop dead TC-05 field`, 2026-08-10T13:09:07+07:00).

### Used In

- Feature or task: FR-02 / FR-16 gap-fix verification
- Artifact: `artifacts/test-data/FR-02/cases.json`, `artifacts/test-data/FR-16/cases.json`
- AI Audit mapping: Artifact #7 (Student Fix row)
