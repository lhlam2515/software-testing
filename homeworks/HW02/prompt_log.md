# Prompt Log: HW02

**Student:** Lê Hoàng Lâm (23127216)
**Assignment:** HW02-AI: Domain Testing on EShop
**Format:** Each entry = Tool · Timestamp · Prompt (verbatim) · AI Output (verbatim or screenshot ref)

---

> **Instructions:** Log every AI interaction here: paste prompt verbatim, do NOT paraphrase.
> Reference entries from `[AI-02]_AI_Audit_Report.md` using the timestamp.

---

## Entry 001 | 09:39 24/06/2026

**Tool:** Claude Code (claude-sonnet-4-6)
**Feature:** FR-02
**Step:** Domain Testing session start

### Prompt

```
You are an expert Software QA Engineer. Your task is to execute the Domain Testing
technique systematically for a given Functional Requirement (FR). You must follow
step-by-step framework to analyze, partition, and design the minimum optimized test
suite. Say OK to ready to start the progress.
```

### AI Output

```
OK — sẵn sàng.

Tôi sẽ thực hiện **Domain Testing** theo framework có hệ thống sau khi bạn cung cấp Functional Requirement (FR):

**Pipeline sẽ thực hiện:**

1. **Phân tích FR** — xác định variables, constraints, input/output domains
2. **Partitioning** — phân hoạch từng domain thành equivalence classes (valid/invalid)
3. **Boundary Analysis** — xác định ON/OFF/IN points cho từng boundary
4. **Test Case Design** — thiết kế minimum optimized test suite (tránh redundancy)
5. **Traceability** — map từng test case về lại FR requirement

Hãy cung cấp FR cần phân tích.
```

### Used in

- `[AI-02]_AI_Audit_Report.md`, Artifact 1

---

## Entry 002 | 09:41 24/06/2026

**Tool:** Claude Code (claude-sonnet-4-6)
**Feature:** FR-02
**Step:** Step 1 — Identify Input/Output Variables and Constraints

### Prompt

```
## STEP 1: IDENTIFY INPUT/OUTPUT VARIABLES & CONSTRAINTS

### 1. Objective

Analyze the requirement text to extract all controllable inputs, system-driven state variables, and output tokens, along with their business rules.

### 2. Execution Guidelines

- Collect information from functional specs, UI designs, and database/API schemas.
- Do not make assumptions about missing boundaries. Identify implicit gaps (e.g., if a minimum is stated, look for the maximum).
- Classify variables into: Input, System State, or Output.
- Identify the "Resolution" (the smallest measurable unit, e.g., 1 integer, 0.01 decimal, 1 character).

### 3. Output Format

Return a Markdown table with the exact following headers:

| Variable | Type | Description | Valid Domain / Boundaries | Dependencies & Constraints | Expected Error / Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |

---

Yêu cầu cần phân tích: FR-02 được đặc tả trong tài liệu eshop-sut/srs.md (liên hệ trực tiếp với FR-01 để biết về format, ràng buộc của các trường trong FR-02)
```

### AI Output

Đã đọc xong SRS. Phân tích FR-02 kết hợp FR-01 (email/password format) và FR-22 (form rules).

---

## STEP 1: IDENTIFY INPUT/OUTPUT VARIABLES & CONSTRAINTS — FR-02

| Variable | Type | Description | Valid Domain / Boundaries | Dependencies & Constraints | Expected Error / Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `email` | Input | Địa chỉ email người dùng nhập vào form đăng nhập | **Valid:** Chuỗi khớp format `user@domain.com` (HTML5 `type="email"`). **Boundaries:** Chuỗi rỗng (invalid) / chuỗi có `@` + domain (valid) / chuỗi không có `@` (invalid). Resolution: 1 ký tự. | Phải tồn tại trong CSDL (registered). Trường phải dùng `type="email"`. Gắn với `failed_login_count` của tài khoản tương ứng. | **Sai format:** HTML5 ngăn submit (browser-level). **Không tồn tại trong hệ thống:** trả về generic error — không lộ lý do. **Trống:** HTML5 `required` chặn (implicit). |
| `password` | Input | Mật khẩu người dùng nhập tại login | **Valid:** Bất kỳ chuỗi nào khớp với mật khẩu đã đăng ký (không re-validate độ phức tạp tại bước login). **Boundaries:** Chuỗi rỗng (invalid) / ≥ 1 ký tự (accepted for comparison). Resolution: 1 ký tự. | So khớp với hash đã lưu. Trường phải dùng `type="password"` (ẩn ký tự). Độ phức tạp (8 ký tự, 1 hoa, 1 thường, 1 số, 1 special char) chỉ enforce tại FR-01; KHÔNG re-check tại FR-02. | **Sai (không khớp):** generic error + tăng `failed_login_count`. **Trống:** nên bị chặn (implicit required). **Đúng + account locked:** bị từ chối cho đến hết 30s. |
| `failed_login_count` | System State | Bộ đếm số lần đăng nhập sai **liên tiếp** của một tài khoản cụ thể | **Valid (không khóa):** `[0, 2]`. **Invalid (kích hoạt khóa):** `[3, +∞)`. **Boundaries:** `0` (khởi tạo / sau login thành công), `2` (OFF point — tối đa trước khóa), `3` (ON point — ngưỡng khóa). Resolution: 1 (integer). | Tăng **đúng 1** mỗi lần đăng nhập sai. Reset về `0` khi đăng nhập thành công ("liên tiếp" — ngầm định). Gắn với từng `email`. ⚠️ **Implicit gap:** SRS không nói counter có reset sau khi hết 30s lockout hay không. | `count < 3`: thất bại, counter tăng, tài khoản vẫn mở. `count = 3` (lần thứ 3 sai): khóa ngay lập tức. `count > 3`: tiếp tục bị khóa (nếu thử lại trong 30s). |
| `account_locked` | System State | Trạng thái khóa tạm thời của tài khoản | **Valid:** `false` (mở — `failed_login_count < 3`). **Invalid:** `true` (khóa — `failed_login_count ≥ 3`). Binary. | Kích hoạt khi `failed_login_count ≥ 3`. Tự mở sau `30s`. ⚠️ **Implicit gap:** SRS không nói rõ lockout là per-account hay per-IP/session. | Khi `true`: mọi lần thử đều bị từ chối kể cả khi credential đúng. Thông báo "phù hợp" nhưng **không lộ chi tiết** (không nói "bị khóa vì sai 3 lần"). |
| `lock_timer` | System State | Thời gian còn lại của lockout (giây) tính từ lần sai thứ 3 | **Active:** `(0s, 30s]` — account bị khóa. **Expired:** `0s` — account mở lại. **Boundaries:** `30s` (ON point — vừa khóa), `0s` (OFF point — vừa hết khóa). Resolution: 1 giây. | Chỉ có nghĩa khi `account_locked = true`. Đếm ngược 30s từ thời điểm fail lần thứ 3. ⚠️ **Implicit gap:** SRS không nói `failed_login_count` có reset về 0 khi timer hết hay không — nếu không reset, fail thêm 1 lần nữa sẽ lập tức lock lại. | Trong `(0s, 30s]`: mọi request đều bị từ chối. Tại `0s` (hết 30s): tài khoản mở, cho phép thử lại. |
| `jwt_token` | Output | JWT Token trả về sau khi đăng nhập thành công | **Valid:** Chuỗi JWT hợp lệ. **Invalid:** Không có (empty/null) trong mọi trường hợp thất bại. | Chỉ phát sinh khi: email tồn tại + password khớp + `account_locked = false`. Lưu client-side, gửi qua `Authorization: Bearer <token>` cho các API xác thực. | Thành công → trả về token. Mọi case lỗi (sai credential, bị khóa, sai format) → không trả về token. |
| `error_message` | Output | Thông báo lỗi hiển thị khi đăng nhập thất bại | **Valid:** Chuỗi text chung (generic), không tiết lộ nguyên nhân cụ thể. | Hiển thị **phía trên** nút submit (FR-22). Áp dụng cho: sai credential, account locked, email không tồn tại — tất cả dùng cùng 1 dạng message chung. ⚠️ Nếu lộ lý do cụ thể (VD: "Email không tồn tại") → vi phạm credential enumeration. | Sai credential → generic error. Account locked → generic error (không nói thời gian còn lại). Email sai format → HTML5 validation (không qua server). |

---

### Implicit Gaps cần xác minh khi test

| # | Gap | Rủi ro nếu không xác định |
| :--- | :--- | :--- |
| G1 | `failed_login_count` có reset về 0 sau 30s lockout hết không? | Nếu không reset: 1 lần sai tiếp theo sẽ lock lại ngay — behavior khác với 3 lần sai. |
| G2 | Counter tăng tiếp khi account đang locked không? | Nếu có: nghĩa là không có trạng thái "chỉ lock một lần" thực sự. |
| G3 | Lockout per-account hay per-IP/session? | Ảnh hưởng đến khả năng bypass bằng cách đổi IP. |
| G4 | Không có giới hạn độ dài tường minh cho email và password tại login | Có thể test buffer với string dài. |

---

Sẵn sàng tiếp Step 2 — Equivalence Partitioning.

### Used in

- `[AI-02]_AI_Audit_Report.md`, Artifact 1
- `artifacts/tests/FR-02-login-lockout/domain-testing.md`, Step 1

---

## Entry 003 | 09:45 24/06/2026

**Tool:** Claude Code (claude-sonnet-4-6)
**Feature:** FR-02
**Step:** Step 2 — Identify Equivalence Classes

### Prompt

```
## STEP 2: IDENTIFY EQUIVALENCE CLASSES (PARTITIONING)

### 1. Objective

Group input/output spaces into equivalent classes where the system is expected to behave identically, avoiding redundant testing.

### 2. Execution Guidelines

- **Range Rule:** If a range $[Min, Max]$ is specified, create 1 valid class ($Min \le X \le Max$) and 2 invalid classes ($X < Min$, $X > Max$).
- **Set Rule:** If a set of allowed values is handled differently, create 1 valid class for each value, and 1 invalid class for elements outside the set.
- **"Must Be" Rule:** If a condition must be true, create 1 valid class (True) and 1 invalid class (False).
- **Splitting Rule:** If elements within a class are coded/handled differently by the system, split them into smaller subclasses.
- Assign a unique ID (`ECxx`) to each class for traceability.

### 3. Output Format

Return a categorized Markdown table grouped by Variable:

| Variable / Condition | EC ID | Equivalence Class Description | Class Type (Valid/Invalid) | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
```

### AI Output

Phân tích tất cả 9 nhóm biến cho FR-02 — áp dụng Range Rule, Set Rule, Must-Be Rule và Splitting Rule.

---

## STEP 2: EQUIVALENCE CLASSES — FR-02 (Đăng nhập & Khóa tài khoản)

### Group 1 — `email` : Định dạng (Format)

| Variable / Condition | EC ID | Equivalence Class Description | Class Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `email` — Định dạng | **EC01** | Chuỗi rỗng hoặc chỉ chứa khoảng trắng | Invalid | HTML5 `type="email"` ngăn submit; request không gửi lên server |
| `email` — Định dạng | **EC02** | Chuỗi không rỗng, sai format: thiếu `@`, thiếu domain, có dấu cách, nhiều `@`, v.v. | Invalid | HTML5 `type="email"` validation ngăn submit; request không gửi lên server |
| `email` — Định dạng | **EC03** | Chuỗi đúng format `user@domain.com` (vượt qua HTML5 validation) | Valid | Request gửi lên server; tiếp tục kiểm tra tầng Existence |

> **Splitting Rule applied:** EC01 vs EC02 tách biệt vì cơ chế chặn giống nhau (HTML5) nhưng trigger khác nhau — giúp phát hiện lỗi thiếu `required` attribute riêng biệt với lỗi format.

---

### Group 2 — `email` : Tồn tại trong DB *(chỉ áp dụng khi EC03)*

| Variable / Condition | EC ID | Equivalence Class Description | Class Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `email` — Existence | **EC04** | Email đúng format nhưng **chưa đăng ký** (không có trong DB) | Invalid | Server trả về generic error; **không lộ** "email không tồn tại" |
| `email` — Existence | **EC05** | Email đúng format và **đã đăng ký** (tồn tại trong DB) | Valid | Server tiếp tục kiểm tra password |

---

### Group 3 — `password` : Khớp hash

| Variable / Condition | EC ID | Equivalence Class Description | Class Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `password` — Giá trị | **EC06** | Chuỗi rỗng | Invalid | Bị chặn bởi `required` (nếu có) **hoặc** generic error từ server; ⚠️ ambiguity: SRS không tường minh `required` cho login password — cần verify |
| `password` — Giá trị | **EC07** | Chuỗi không rỗng, **không khớp** hash đã lưu | Invalid | Generic error; `failed_login_count` tăng đúng 1 |
| `password` — Giá trị | **EC08** | Chuỗi **khớp chính xác** với hash đã lưu | Valid | Tiếp tục luồng đăng nhập thành công (nếu account không bị khóa) |

> **Splitting Rule applied:** EC06 vs EC07 tách biệt vì empty có thể bị chặn client-side trước khi counter tăng — khác với wrong password luôn tăng counter.

---

### Group 4 — `failed_login_count` : Ngưỡng khóa

| Variable / Condition | EC ID | Equivalence Class Description | Class Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `failed_login_count` — Ngưỡng | **EC09** | `count ∈ [0, 2]` — dưới ngưỡng khóa | Valid | Tài khoản chưa khóa; login attempt được phép; counter tăng nếu fail thêm |
| `failed_login_count` — Ngưỡng | **EC10** | `count ≥ 3` — đạt hoặc vượt ngưỡng khóa | Invalid | Tài khoản bị khóa; **mọi** attempt bị từ chối kể cả khi credential đúng |

> **Range Rule applied:** Boundary là `3` — tạo 1 valid class `[0,2]` và 1 invalid class `[3, +∞)`.

---

### Group 5 — `lock_timer` : Cửa sổ khóa 30 giây

| Variable / Condition | EC ID | Equivalence Class Description | Class Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `lock_timer` — Trạng thái | **EC11** | Không trong cửa sổ khóa: `count < 3` HOẶC `time_since_lock ≥ 30s` | Valid | Tài khoản có thể truy cập; login attempt được phép thực hiện |
| `lock_timer` — Trạng thái | **EC12** | Đang trong cửa sổ khóa: `count ≥ 3` VÀ `0 < time_since_lock < 30s` | Invalid | Login bị từ chối; generic error (không tiết lộ thời gian còn lại) |

> **Range Rule applied:** Boundary là `30s` — `[0s, 30s)` = locked, `[30s, +∞)` = unlocked.

---

### Group 6 — Hành vi bộ đếm `failed_login_count`

| Variable / Condition | EC ID | Equivalence Class Description | Class Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `counter` — Tăng sau mỗi fail | **EC13** | Sau 1 lần login sai: counter tăng **đúng 1** đơn vị | Valid | `count_after = count_before + 1` (exactly) |
| `counter` — Tăng sai | **EC14** | Sau 1 lần login sai: counter tăng **≠ 1** (0 hoặc ≥ 2) | Invalid | Vi phạm spec "tăng bộ đếm lên đúng 1 đơn vị" |
| `counter` — Reset khi thành công | **EC15** | Sau đăng nhập thành công: counter **reset về 0** | Valid | `count = 0`; phù hợp với nghĩa "liên tiếp" trong SRS |
| `counter` — Không reset | **EC16** | Sau đăng nhập thành công: counter **không reset** | Invalid | Vi phạm ý nghĩa "liên tiếp" — ngưỡng khóa bị tính sai |

---

### Group 7 — Output: `jwt_token`

| Variable / Condition | EC ID | Equivalence Class Description | Class Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `jwt_token` — Khi thành công | **EC17** | Đăng nhập thành công (EC05 + EC08 + EC11) → JWT **được** trả về | Valid | JWT hợp lệ; lưu client-side; dùng cho `Authorization: Bearer` |
| `jwt_token` — Khi thất bại | **EC18** | Đăng nhập thất bại (bất kỳ EC invalid) → JWT **không** được trả về | Valid | Response không chứa token |
| `jwt_token` — Vi phạm | **EC19** | Đăng nhập thất bại nhưng server vẫn trả về JWT | Invalid | Security violation — authentication bypass |

---

### Group 8 — Output: `error_message` — Nội dung

| Variable / Condition | EC ID | Equivalence Class Description | Class Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `error_message` — Generic | **EC20** | Thông báo lỗi **chung chung**, không phân biệt lý do (email sai / password sai / bị khóa) | Valid | Đúng spec; không cho phép credential enumeration |
| `error_message` — Lộ chi tiết | **EC21** | Thông báo lộ lý do cụ thể: "Email không tồn tại", "Sai mật khẩu", "Tài khoản bị khóa 25 giây" | Invalid | Credential enumeration — vi phạm security spec |
| `error_message` — Thiếu feedback | **EC22** | Login thất bại nhưng **không có** thông báo nào hiển thị | Invalid | Thiếu user feedback; vi phạm UX requirement |

---

### Group 9 — Output: `error_message` — Vị trí hiển thị (FR-22)

| Variable / Condition | EC ID | Equivalence Class Description | Class Type | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `error_message` — Vị trí | **EC23** | Thông báo lỗi hiển thị **phía trên** nút Submit | Valid | Tuân thủ FR-22 |
| `error_message` — Vị trí | **EC24** | Thông báo lỗi hiển thị **phía dưới** nút Submit | Invalid | Vi phạm FR-22 |

---

### Tổng kết EC Map

| Group | Variable | Valid ECs | Invalid ECs | Total |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `email` — Format | EC03 | EC01, EC02 | 3 |
| 2 | `email` — Existence | EC05 | EC04 | 2 |
| 3 | `password` — Match | EC08 | EC06, EC07 | 3 |
| 4 | `failed_login_count` — Ngưỡng | EC09 | EC10 | 2 |
| 5 | `lock_timer` — Cửa sổ | EC11 | EC12 | 2 |
| 6 | `counter` — Hành vi | EC13, EC15 | EC14, EC16 | 4 |
| 7 | `jwt_token` — Output | EC17, EC18 | EC19 | 3 |
| 8 | `error_message` — Nội dung | EC20 | EC21, EC22 | 3 |
| 9 | `error_message` — Vị trí | EC23 | EC24 | 2 |
| **Total** | | **10 Valid** | **14 Invalid** | **24 ECs** |

---

Sẵn sàng tiếp Step 3 — Boundary Value Analysis.

### Used in

- `[AI-02]_AI_Audit_Report.md`, Artifact 1
- `artifacts/tests/FR-02-login-lockout/domain-testing.md`, Step 2

---

## Entry 004 | 09:53 24/06/2026

**Tool:** Claude Code (claude-sonnet-4-6)
**Feature:** FR-02
**Step:** Step 3 — Minimum Set of Test Cases

### Prompt

```
## STEP 3: MINIMUM SET OF TEST CASES (EQUIVALENCE COVERAGE)

### 1. Objective

Derive the absolute minimum number of test cases required to cover 100% of the identified Equivalence Classes (ECs).

### 2. Execution Guidelines

- **Valid Classes (Happy Path):** Combine as many valid equivalence classes into a single test case as possible until all valid classes are covered.
- **Invalid Classes (Negative Path):** Follow the *One-by-One* (Error Isolation) rule. Each negative test case must contain **one and only one** invalid equivalence class, keeping all other variables at safe, valid nominal values to prevent "Error Masking".
- Use nominal midpoint values as representatives for this step.

### 3. Output Format

Return a Markdown table representing the compressed test suite:

| #TC | Partitions Covered (EC IDs) | Input Data Specification | Pre-conditions / System State | Expected Output & Behavior |
| :--- | :--- | :--- | :--- | :--- |
```

### AI Output

Áp dụng chiến lược: gom tối đa Valid EC vào ít TC nhất → sau đó 1 TC/Invalid EC với các biến còn lại ở nominal valid.

---

## STEP 3: MINIMUM TEST CASE SET — FR-02

| #TC | Partitions Covered (EC IDs) | Input Data Specification | Pre-conditions / System State | Expected Output & Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Valid:** EC03, EC05, EC08, EC09, EC11, EC15, EC17 · **Verified absent:** EC16 | `email` = `test@eshop.com` · `password` = `Test1234!` | Tài khoản `test@eshop.com` tồn tại trong DB · `failed_login_count = 1` · `account_locked = false` | ✅ HTTP 200 · JWT token hợp lệ trả về, lưu client-side (EC17) · `failed_login_count` reset về `0` sau thành công (EC15) · Không reveal lý do kỹ thuật · ❌ EC16 không xảy ra (counter đã reset đúng) |
| **TC-02** | **Invalid:** EC01 | `email` = `""` (chuỗi rỗng) · `password` = `Test1234!` | Không yêu cầu pre-condition | ❌ HTML5 `required`/`type="email"` chặn submit ngay tại browser · Không có HTTP request gửi lên server · Không có JWT · Không tăng counter |
| **TC-03** | **Invalid:** EC02 | `email` = `"invalid_no_at_sign"` (thiếu `@`) · `password` = `Test1234!` | Không yêu cầu pre-condition | ❌ HTML5 `type="email"` validation ngăn submit · Không có HTTP request gửi lên server · Không có JWT · Không tăng counter |
| **TC-04** | **Invalid:** EC04 · **Observed valid outputs:** EC18, EC20, EC23 · **Verified absent:** EC19, EC21, EC22, EC24 | `email` = `"notfound@example.com"` · `password` = `Test1234!` | Email `notfound@example.com` **không tồn tại** trong DB · `failed_login_count = 0` · `account_locked = false` | ❌ Generic error (VD: *"Thông tin đăng nhập không chính xác"*) · Không lộ "email không tồn tại" (EC20 ✓ / EC21 absent) · Không trả về JWT (EC18 ✓ / EC19 absent) · Thông báo lỗi hiển thị **phía trên** nút Submit (EC23 ✓ / EC24 absent) · Có error message, không bị im lặng (EC22 absent) |
| **TC-05** | **Invalid:** EC06 | `email` = `"test@eshop.com"` · `password` = `""` (chuỗi rỗng) | Tài khoản tồn tại · `failed_login_count = 0` · `account_locked = false` | ❌ Nếu có `required`: HTML5 chặn tại client · Nếu không có `required`: server trả về generic error; no JWT · ⚠️ **Gap từ Step 1:** SRS không tường minh `required` cho password field tại login — cần verify cả 2 nhánh · Counter: chỉ tăng nếu request đến server |
| **TC-06** | **Invalid:** EC07, EC13 · **Observed valid outputs:** EC18, EC20, EC23 · **Verified absent:** EC14, EC19, EC21, EC22, EC24 | `email` = `"test@eshop.com"` · `password` = `"WrongPass1!"` (sai, không rỗng) | Tài khoản tồn tại · `failed_login_count = 0` · `account_locked = false` | ❌ Generic error (không lộ "sai mật khẩu") · `failed_login_count`: `0 → 1` — tăng **đúng 1** (EC13 ✓) · ❌ EC14 absent: không tăng 0 hay 2+ · Không trả về JWT (EC18 ✓) · Thông báo lỗi **phía trên** Submit (EC23 ✓) |
| **TC-07** | **Invalid:** EC10 + EC12 *(coupled — xem ghi chú)* · **Observed valid outputs:** EC18 · **Verified absent:** EC19, EC21 | `email` = `"test@eshop.com"` · `password` = `"Test1234!"` *(credential **đúng**)* | Tài khoản tồn tại · `failed_login_count = 3` · `time_since_lock = 5s` (đang trong cửa sổ 30s) | ❌ Login **bị từ chối dù credential hoàn toàn đúng** (EC10 + EC12) · Generic error — không nói "còn X giây" (EC21 absent) · Không trả về JWT (EC18 ✓ / EC19 absent) · ⚠️ **Gap G2:** SRS không định nghĩa counter tăng tiếp hay giữ nguyên khi account đang bị locked — cần ghi lại kết quả thực tế |

---

### Ghi chú thiết kế

**EC10 + EC12 kết hợp trong TC-07:**
Hai EC này không thể tách rời về mặt kỹ thuật — một account ở trạng thái `count ≥ 3` ngay tại thời điểm test tất yếu phải đang trong cửa sổ 30 giây (trừ khi 30s đã trôi qua, lúc đó là EC11 - valid). Error Isolation không bị vi phạm vì chúng là một composite system-state duy nhất, không phải hai input độc lập.

---

### Coverage Matrix — 7 TC × 24 EC

| EC | TC phủ | Cơ chế |
| :--- | :--- | :--- |
| EC01 | TC-02 | Trigger trực tiếp |
| EC02 | TC-03 | Trigger trực tiếp |
| EC03 | TC-01 | Input nominal valid |
| EC04 | TC-04 | Trigger trực tiếp |
| EC05 | TC-01 | Pre-condition |
| EC06 | TC-05 | Trigger trực tiếp |
| EC07 | TC-06 | Trigger trực tiếp |
| EC08 | TC-01 | Input nominal valid |
| EC09 | TC-01 | Pre-condition `count=1 ∈ [0,2]` |
| EC10 | TC-07 | Pre-condition `count=3` |
| EC11 | TC-01 | Pre-condition `locked=false` |
| EC12 | TC-07 | Pre-condition `time_since_lock=5s` |
| EC13 | TC-06 | Observed: `0→1` |
| EC14 | TC-06 | Verified absent (EC13 đúng ↔ EC14 không xảy ra) |
| EC15 | TC-01 | Observed: `1→0` sau success |
| EC16 | TC-01 | Verified absent (EC15 đúng ↔ EC16 không xảy ra) |
| EC17 | TC-01 | Observed output |
| EC18 | TC-04, TC-06, TC-07 | Observed output |
| EC19 | TC-07 | Verified absent (đúng credential nhưng không có JWT) |
| EC20 | TC-04, TC-06 | Observed output |
| EC21 | TC-04, TC-06 | Verified absent |
| EC22 | TC-04, TC-06 | Verified absent (error IS shown) |
| EC23 | TC-04, TC-06 | Observed output |
| EC24 | TC-04, TC-06 | Verified absent |

**Tổng: 7 test cases → 100% EC coverage (24/24)**

---

Sẵn sàng tiếp Step 4 — Boundary Value Analysis.

### Used in

- `[AI-02]_AI_Audit_Report.md`, Artifact 1
- `artifacts/tests/FR-02-login-lockout/domain-testing.md`, Step 3

---

## Entry 005 | 10:09 24/06/2026

**Tool:** Claude Code (claude-sonnet-4-6)
**Feature:** FR-02
**Step:** Step 4 — Boundary Value Analysis Enhancement

### Prompt

```
## STEP 4: BOUNDARY VALUE ANALYSIS (BVA ENHANCEMENT)

### 1. Objective

Inject high-density defect-catching test cases focused purely on the logical turning points (edges) of the ranges/boundaries.

### 2. Execution Guidelines

- Target variables with mathematical or numeric ranges (e.g., counters, timers, lengths).
- Use the **9-Point BVA Model** or **3-Point BVA** depending on criticality:
  - For Lower Boundary (LB): Test `LB-1` (Invalid), `LB` (Valid), `LB+1` (Valid).
  - For Upper Boundary (UB): Test `UB-1` (Valid), `UB` (Valid), `UB+1` (Invalid).
  - Include the `Midpoint` (Nominal).
- Focus the *Test Intent* purely on boundary operator logic (e.g., catching `>` vs `>=` mis-specifications).

### 3. Output Format

Return a Markdown table containing the supplementary boundary test cases:

| #TC | Boundary Point Type (LB/UB/Off) | Target Variable State | Input Data | Expected Boundary Output / State Transition |
| :--- | :--- | :--- | :--- | :--- |
```

### AI Output

Hai biến có numeric boundary cần phân tích sâu: `failed_login_count` (ngưỡng 3) và `lock_timer` (cửa sổ 30 giây).

---

## STEP 4: BVA ENHANCEMENT — FR-02

### Boundary Map trước khi thiết kế TC

```
failed_login_count:
  ← Valid: [0 ──── 1 ──── 2] | [3 ──── ... → Invalid
                        ↑ OFF point     ↑ ON point (lock trigger)
                       (UB)             (LB invalid)

lock_timer (time_since_lock):
  LOCKED:  [0s ──── 15s ──── 29s | 30s] ──── 31s → UNLOCKED
                                   ↑UB-1   ↑UB(OFF)  ↑UB+1
                                          (expiry)
```

---

### BVA Test Cases

| #TC | Boundary Point Type (LB/UB/Off) | Target Variable State | Input Data | Expected Boundary Output / State Transition |
| :--- | :--- | :--- | :--- | :--- |
| **TC-BVA-01** | `failed_login_count` — **UB(valid) = 2 → ON Point = 3** · Transition test (lock trigger) | `failed_login_count = 2` (đúng 1 thất bại trước ngưỡng) · `account_locked = false` | `email` = `test@eshop.com` · `password` = `"WrongPass1!"` *(sai)* | ❌ Lần fail thứ 3 này → `count: 2→3` → **LOCK kích hoạt ngay lập tức** · Generic error · Không có JWT · 🎯 *Defect target:* Bắt lỗi `> 3` thay vì `>= 3` — nếu hệ thống chỉ khóa ở lần thứ 4, test này FAIL |
| **TC-BVA-02** | `failed_login_count` — **UB(valid) = 2 · Success tại ngưỡng trên** | `failed_login_count = 2` · `account_locked = false` | `email` = `test@eshop.com` · `password` = `"Test1234!"` *(đúng)* | ✅ Đăng nhập thành công · `count: 2→0` (reset) · **Không bị khóa** dù đã có 2 lần thất bại · JWT trả về · 🎯 *Defect target:* Bắt lỗi sai reset logic tại UB — nếu hệ thống không reset ở count=2, lần thất bại tiếp theo sẽ là fail thứ 3 (không phải 1) |
| **TC-BVA-03** | `lock_timer` — **UB-1 (29s)** · 1 giây trước khi hết khóa | `failed_login_count = 3` · `time_since_lock = 29s` (còn 1s trong cửa sổ) | `email` = `test@eshop.com` · `password` = `"Test1234!"` *(đúng)* | ❌ Login **bị từ chối** dù credential đúng — cửa sổ 30s chưa hết · Generic error · Không có JWT · 🎯 *Defect target:* Bắt lỗi timeout quá ngắn (VD: hệ thống mở khóa ở 29s thay vì 30s) |
| **TC-BVA-04** | `lock_timer` — **UB = 30s (OFF point of lock)** · Chính xác tại thời điểm hết khóa | `failed_login_count = 3` · `time_since_lock = 30s` (đúng tại ranh giới) | `email` = `test@eshop.com` · `password` = `"Test1234!"` *(đúng)* | ✅ Login **được phép** — khóa đã hết đúng 30 giây · JWT trả về · 🎯 *Defect target:* Bắt lỗi operator `> 30s` thay vì `>= 30s` — nếu hệ thống yêu cầu 31s mới mở, test này FAIL · ⚠️ **Gap G1:** Ghi lại `failed_login_count` sau unlock — có reset về 0 không? |
| **TC-BVA-05** | `lock_timer` — **UB+1 (31s)** · 1 giây sau khi hết khóa | `failed_login_count = 3` · `time_since_lock = 31s` (rõ ràng sau expiry) | `email` = `test@eshop.com` · `password` = `"Test1234!"` *(đúng)* | ✅ Login **được phép** · JWT trả về · Xác nhận tài khoản hoàn toàn khôi phục sau expiry · ⚠️ **Gap G1:** Nếu `count` vẫn là 3 sau unlock, 1 lần sai tiếp theo → lock lại ngay lập tức (hành vi cần document) |

---

### Defect Coverage Matrix — BVA nhắm vào

| TC | Operator lỗi bị bắt | Hệ thống triển khai sai → Kết quả test |
| :--- | :--- | :--- |
| TC-BVA-01 | `>3` thay vì `>=3` | Sai thứ 3 không lock → TC FAIL (vẫn cho login) |
| TC-BVA-01 | `>2` (lock ở fail thứ 2!) | Sai thứ 3 không cần thiết → TC FAIL (locked ở lần 2) |
| TC-BVA-02 | Counter không reset ở count=2 | Login thứ 3 sau đó là "fail lần 3" → lock unexpected |
| TC-BVA-03 | Timeout 29s thay vì 30s | Unlock sớm → TC FAIL (expected reject, got JWT) |
| TC-BVA-04 | Timeout `>30s` thay vì `>=30s` | 30s vẫn locked → TC FAIL (expected JWT, got error) |
| TC-BVA-05 | Baseline post-unlock | Catch race conditions hoặc timer drift |

---

### Setup Protocol cho TC-BVA-03 đến TC-BVA-05

```
1. Reset tài khoản test (count=0)
2. Fail đăng nhập 3 lần liên tiếp → ghi lại T_lock
3. Tại T_lock + target_seconds, thực hiện login attempt
   - TC-BVA-03: T_lock + 29s
   - TC-BVA-04: T_lock + 30s
   - TC-BVA-05: T_lock + 31s
4. Quan sát response và ghi lại actual count sau unlock (Gap G1)
```

---

### Tổng hợp Test Suite sau 4 bước

| Nhóm | Số TC | Mục tiêu |
| :--- | :--- | :--- |
| Step 3 — EC Coverage | 7 TC (TC-01 → TC-07) | Phủ 100% 24 Equivalence Classes |
| Step 4 — BVA Enhancement | 5 TC (TC-BVA-01 → TC-BVA-05) | Bắt off-by-one tại ngưỡng count=3 và timer=30s |
| **Tổng** | **12 TC** | **Minimum optimized suite cho FR-02** |

### Used in

- `[AI-02]_AI_Audit_Report.md`, Artifact 1
- `artifacts/tests/FR-02-login-lockout/bva.md`

---

## Entry 006 | 10:30 24/06/2026

**Tool:** Claude Code (claude-sonnet-4-6)
**Feature:** FR-02
**Step:** Consolidation to artifact files

### Prompt

```
Bước tiếp theo, hãy tổng hợp toàn bộ output của quá trình phân tích thiết kế
test-case cho FR-02 bằng kỹ thuật Domain Testing và Boundary Value Analysis (BVA)
vào 2 file tài liệu domain-testing.md (cho bước 1 đến bước 3) và bva.md (cho bước 4).
Đối với mỗi test-case, hãy trình bày mỗi test-case là một bảng riêng với các trường
(theo chiều dọc) riêng biệt (atomic).
```

### AI Output

Hai file đã được ghi đầy đủ. Đây là tổng kết nội dung:

---

### `artifacts/tests/FR-02-login-lockout/domain-testing.md` (298 dòng)

Bao gồm:

- **Bước 1** — Bảng 7 biến với Valid Domain, Boundaries, Dependencies, Expected Error (kể cả 4 Implicit Gaps G1–G4)
- **Bước 2** — 24 EC phân thành 9 nhóm, đầy đủ EC ID / mô tả / loại / expected output
- **Bước 3** — **7 TC, mỗi TC là một bảng dọc riêng** với 10 trường: TC ID, Tên, EC Phủ, EC Verified Absent, Pre-conditions, Input email, Input password, Bước thực hiện, Kết quả kỳ vọng, Điểm xác minh, Trạng thái
- **EC Coverage Matrix** — map đầy đủ 24 EC → 7 TC với cơ chế phủ

---

### `artifacts/tests/FR-02-login-lockout/bva.md` (255 dòng)

Bao gồm:

- **Boundary Map** — ASCII diagram cho cả `failed_login_count` (ngưỡng 3) và `lock_timer` (cửa sổ 30s)
- **5 TC-BVA, mỗi TC là một bảng dọc riêng** với 11 trường: TC ID, Tên, Biến mục tiêu, Loại điểm biên, Target Variable State, Input email, Input password, Pre-conditions, Mục tiêu Defect, Kết quả kỳ vọng, Điểm xác minh
- **Defect Coverage Matrix** — map từng TC → operator lỗi cụ thể nó bắt được
- **Setup Protocol** — hướng dẫn timing (manual + DB direct manipulation query)

### Used in

- `[AI-02]_AI_Audit_Report.md`, Artifact 1 (primary deliverable)

---

<!-- Duplicate an entry block above for each AI interaction -->
