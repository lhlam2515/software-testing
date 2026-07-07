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

## Entry 007 | 21:17 25/06/2026

**Tool:** Claude Code (claude-sonnet-4-6, domain-testing skill)
**Feature:** FR-09
**Step:** Full domain testing design via `/domain-testing` skill (Steps 1-4 in one invocation)

### Prompt

```
Hãy áp dụng kỹ thuật /domain-testing để thực hiện thiết kế test case cho FR-09 - Coupon
đã được document bên trong eshop-sut/srs.md và eshop-sut/api-specification.md.
```

Follow-up at 21:37 (same session):

```
hãy chuyển đổi toàn bộ nội dung design sang tiếng Anh
```

### AI Output

AI executed the 4-step domain testing framework autonomously via the `domain-testing` skill, using both `srs.md` (FR-09 section) and `api_specification.md` (concrete field names and types) as input sources. Output initially produced in Vietnamese, then translated to English per follow-up.

---

#### `artifacts/tests/FR-09-coupon/domain-testing.md`

- **Step 1** — 13 variables across 3 categories (Input: `code`, `total_amount`; System State: `is_active`, `expired_at`, `min_order_amount`, `uses_by_user`, `max_uses_per_user`, `type`, `discount_value`; Output: `discount_amount`, `final_amount`, `http_status`, `error_message`) + 5 Implicit Gaps (G1: case sensitivity, G2: `total_amount` spec conflict with FR-08, G3: `final_amount` negative when fixed discount exceeds total, G4: usage count rollback on failed checkout, G5: `expired_at` timezone boundary)
- **Step 2** — 18 ECs across 8 Groups: Group 1 (C1 Must-Be: code exists and active), Group 2 (Implicit Gap: case sensitivity probe), Group 3 (C2 Must-Be: not expired), Group 4 (C3 Range: total meets minimum), Group 5 (C4 Must-Be: valid JWT), Group 6 (C5 Range: usage limit not reached), Group 7 (Splitting Rule: discount type percent vs fixed), Group 8 (Output: correct response and error response and negative final_amount gap)
- **Step 3** — **11 TCs** (TC-01 through TC-11): 2 happy paths (percent + fixed) + 9 negative TCs (one per invalid EC, each isolating a single condition) + EC Coverage Matrix

#### `artifacts/tests/FR-09-coupon/bva.md`

- **3 target variables**: `total_amount` vs `min_order_amount` (3 boundary points), `uses_by_user` vs `max_uses_per_user` (3 points across 2 coupons), `expired_at` vs `current_date` (2 points)
- **8 BVA TCs** (TC-BVA-01 through TC-BVA-08) each identifying the specific operator error detected
- Setup Protocol with exact SQLite INSERT/DELETE commands and curl sequences for stateful pre-conditions

**Note:** AI output at commit `6153cc0` (21:42 25/06/2026) contained 11 EP TCs. Test cases added by the student after post-design human review:

- TC-12 (zero-amount degenerate probe) — added 26/06/2026, commit `0a855b2`
- TC-13 (client `total_amount` manipulation below actual cart subtotal, FR-08 spec conflict probe) — added 06/07/2026, commit `1cdb554`

### Used in

- `[AI-02]_AI_Audit_Report.md`, Artifact 2

---

## Entry 008 | 21:31 27/06/2026

**Tool:** Claude Code (claude-sonnet-4-6, domain-testing skill)
**Feature:** FR-16
**Step:** Full domain testing design via `/domain-testing` skill (Steps 1-4 in one invocation)

### Prompt

```
Hãy áp dụng kỹ thuật /domain-testing để thực hiện thiết kế test case chi tiết cho FR-16 - CSV Import đã được document bên trong eshop-sut/srs.md và eshop-sut/api-specification.md
```

### AI Output

AI executed the 4 steps of the domain testing framework autonomously via the `domain-testing` skill, reading both `srs.md` (FR-16 section and FR-15 cross-reference for the 255-char constraint) and `api_specification.md` (section 6.3 endpoint and body schema). Output produced in English in a single invocation.

---

#### `artifacts/tests/FR-16-csv-import/domain-testing.md`

- **Step 1** — 10 variables (Input: `Authorization`, `products` array, `name`, `price`, `description`, `imageUrl`, `category_id`; System State: DB Category State; Output: Atomic Rollback behavior, Import Report) + 7 Implicit Gaps and Spec Conflicts (G1: SRS CSV vs API JSON layer conflict, G2: `category_id` validation not specified in FR-16, G3: `name` max 255 from FR-15 not repeated in FR-16, G4: empty `products` array behavior, G5: `price` type coercion from CSV string, G6: response schema not defined in API spec, G7: rollback scope when all rows fail)
- **Step 2** — 22 ECs across 7 Groups: Group 1 (Authorization Must-Be: EC01-EC03), Group 2 (`products` key and size: EC04-EC06 Gap), Group 3 (`name` Must-Be + Range: EC07-EC10 Gap), Group 4 (`price` Range: EC11-EC15 + EC22 Gap), Group 5 (`category_id` Set: EC16-EC17 Gap), Group 6 (Atomicity Splitting: EC18-EC19), Group 7 (Report Splitting: EC20-EC21)
- **Step 3** — **16 TCs**: 2 happy-path (TC-01 single product, TC-02 batch of 3), 2 auth TCs (TC-03, TC-04), 1 missing key TC (TC-05), 6 invalid-row TCs isolating name and price violations (TC-06 through TC-11), 1 atomicity multi-row TC (TC-12), 4 Gap Probe TCs (TC-13 through TC-16) + EC Coverage Matrix

#### `artifacts/tests/FR-16-csv-import/bva.md`

- **2 target variables**: `price` lower boundary at 0 (ON point + LB+1), `name` length upper boundary at 255 chars (UB-1 / UB / UB+1)
- **5 BVA TCs** (TC-BVA-01 through TC-BVA-05) each naming the specific wrong operator exposed
- Setup Protocol with Node.js `repeat()` string generation and post-response length verification

**Note:** AI output at commit `0f518d7` (21:31 27/06/2026) contained 16 EP TCs and 5 BVA TCs. Test cases added by the student after post-design human review:

- TC-17 (import report response schema probe, addressing Step 1 Gap #6) — added 30/06/2026, commit `a9a9fed`
- TC-18 (all-rows-invalid batch probe, addressing Step 1 Gap #7) — added 30/06/2026, commit `a9a9fed`
- TC-19 (CSV file extension enforcement probe, addressing Step 1 Gap #1) — added 02/07/2026, commit `4625540`

### Used in

- `[AI-02]_AI_Audit_Report.md`, Artifact 3

---

## Entry 009 | 15:42 02/07/2026

**Tool:** Claude Code (claude-sonnet-5, domain-testing skill)
**Feature:** FR-20
**Step:** Full domain testing design via `/domain-testing` skill (Steps 1-4 in one invocation), grounded in a real `playwright-cli` UI survey

### Prompt

```
Hãy áp dụng kỹ thuật /domain-testing để thực hiện thiết kế test case chi tiết cho FR-20 - Cancel order đã được document bên trong eshop-sut/srs.md, eshop-sut/api-specification.md, giao diện mobile của eshop-sut. Lần này, chúng ta sẽ thực hiện thiết kế để kiểm thử trên apps/frontend-mobile theo đúng black-box discipline thay vì giao diện web như các FR trước đó.
```

### Intermediate turns (procedural, same session)

Between the prompt above and the AI Output below, two procedural exchanges occurred (environment startup — no design content produced): **15:48** the AI asked the student to manually start `apps/backend` and `apps/frontend-mobile` (`npx expo start --web`) because its own attempt to launch them was blocked; **15:48 (reply)** the student ran `npx expo install react-dom react-native-web` and `npx expo start --web` as instructed.

### Prompt (continued, 15:51 02/07/2026)

```
Backend ở 3000 và Mobile ở 8081
```

### AI Output (verbatim, 15:51 02/07/2026)

```
Đã hoàn tất thiết kế Domain Testing + BVA cho FR-20 (Cancel Order — Mobile), viết vào:
- `homeworks/HW02/artifacts/tests/FR-20-cancel-order-mobile/domain-testing.md` — 16 EC, 9 TC (6 EP thường + 3 gap-probe cho 3 gap/conflict phát hiện ở Step 1)
- `homeworks/HW02/artifacts/tests/FR-20-cancel-order-mobile/bva.md` — 4 TC-BVA quanh ranh giới `confirmed`|`shipping` của chuỗi trạng thái đơn hàng

Điểm đáng chú ý phát hiện qua khảo sát UI thật (playwright-cli):
1. App mobile hardcode gọi API tới một IP LAN cũ (`192.168.10.13`) không khớp máy hiện tại — phải override route mới test được; execution phase cần biết điều này.
2. Không có dialog xác nhận khi bấm "Hủy đơn" — một cú chạm là hủy vĩnh viễn, ghi nhận là UX gap (TC-09) so với quy ước FR-24.
3. Xác nhận bằng UI: nút "Hủy đơn" bị ẩn đúng ở `shipping`/`delivered`/`canceled`, nhưng đây mới chỉ là bằng chứng UI — TC-07 (gap-probe) và TC-BVA-02 để lại việc xác minh backend có thực sự chặn `shipping` hay không (Spec Conflict giữa SRS và API spec) cho lúc thực thi.
4. Token JWT chỉ lưu in-memory, không có trong localStorage/sessionStorage — quyết định TC-05 phải dùng API trực tiếp.

Trạng thái môi trường còn lại: backend (`:3000`) và frontend-mobile (`:8081`) vẫn đang chạy nền; DB hiện có 4 đơn hàng test (`test@eshop.com`, id 1-4, trạng thái `canceled/confirmed→canceled/shipping/delivered`) từ quá trình khảo sát — execution phase sau này nên tạo đơn mới sạch cho từng TC theo đúng Pre-conditions đã viết, không phụ thuộc vào state hiện tại.

Sẵn sàng chuyển sang thực thi (`fr-execution` skill) khi bạn muốn.
```

The full generated content (7 variables, 3 Implicit Gaps, 17 ECs, Step 3.0 UI survey table, 9 TCs, EC Coverage Matrix in `domain-testing.md`; 1 target variable, 4 BVA TCs, Defect Coverage Matrix, Setup Protocol in `bva.md`) is the file content itself — the skill wrote it directly to disk rather than printing it in the chat response above. The two files are submitted as-is under `artifacts/tests/FR-20-cancel-order-mobile/` and constitute the verbatim AI-generated artifact; the quoted response above is the verbatim natural-language summary the AI actually returned in the chat turn.

**Note:** this design pass (commit `4b16343`, 16:36 02/07/2026) produced 9 EP TCs and 4 BVA TCs (13 total). TC-10 (FR-11 status-color cross-feature check, EC17) was added in a separate AI-assisted gap-analysis pass on the same day — see Entry 010 — bringing the final count to 10 EP TCs / 14 total, per commit `57e7975`.

### Used in

- `[AI-02]_AI_Audit_Report.md`, Artifact 4

---

## Entry 010 | 22:53 02/07/2026

**Tool:** Claude Code (claude-sonnet-5)
**Feature:** FR-20
**Step:** Post-design gap-analysis review of `domain-testing.md` / `bva.md`, scoped down through negotiation, then applied

### Prompt

```
Giúp tôi phân tích nội dung thực hiện phân tích và thiết kế các test case theo kỹ thuật Domain Testing và BVA cho FR-20 để tìm kiếm những điểm thiết kế còn thiếu sót hoặc chưa thực sự đầy đủ.
```

### AI Output (verbatim, 22:53 02/07/2026)

```
Tôi đã đọc kỹ `domain-testing.md`, `bva.md` của FR-20, đối chiếu với SRS (FR-10, FR-11, FR-20) và `api_specification.md` (§4.6, §6.2). Bộ thiết kế hiện tại khá vững (14 biến, 16 EC, 9 TC + 4 BVA, 3 gap-probe đã đóng đúng), nhưng vẫn có vài lỗ hổng thực sự đáng lưu ý:

## Các điểm thiếu sót phát hiện được

**1. Thiếu EC cho `order_id` dị dạng (malformed input)**
- Bảng Step 1/Step 2 chỉ chia `order_id` thành "tồn tại" (EC10) / "không tồn tại" (EC11, TC-06 dùng `999999`).
- Chưa có EC nào cho `order_id` không phải số, âm, `0`, hoặc chuỗi injection-shape (vd `abc`, `-1`, `1; DROP TABLE`).
- Rủi ro: parser integer lỗi có thể trả 500 thay vì 404, hoặc lộ stack trace — vi phạm ngầm định "mọi lỗi phải có thông báo phù hợp" (FR-10). Đây là input mà UI không bao giờ tạo ra (giống lý do EC11 dùng UI Fallback), nhưng vẫn là một đường tấn công API hợp lệ cần domain testing phủ.

**2. Intra-EC behavioral gap: race condition / double-cancel**
- TC-01, TC-02 phủ EC01/EC02 (happy path) nhưng chỉ với một request tuần tự.
- Không có TC nào kiểm tra 2 request `PUT /cancel` gửi gần như đồng thời cho cùng 1 order đang `pending`/`confirmed`. Theo checklist của skill, đây là loại gap "intra-EC" — EC đã có TC che phủ nhưng cơ chế nội bộ (backend có khóa transaction/optimistic lock không, hay xử lý request thứ 2 trên state đã `canceled`) vẫn chưa được xác định bằng spec. TC-09 chỉ kiểm tra double-tap từ UI (debounce phía client), không phải race thực sự ở tầng API.

**3. Lý do "no UI path" của EC07 chưa chính xác hoàn toàn**
- `domain-testing.md` khẳng định *toàn bộ* trường hợp token không hợp lệ đều buộc phải test qua API trực tiếp (TC-05), với lý do "JWT chỉ lưu in-memory, không thể can thiệp từ ngoài".
- Nhưng đó chỉ đúng với token bị *thiếu/sai ngay từ đầu*. Có một nhánh UI-reachable thực sự: JWT hết hạn *trong khi phiên đang mở* (người dùng để app idle qua thời hạn token, nút `Hủy đơn` vẫn hiển thị vì UI không tự động biết token đã hết hạn) rồi tap `Hủy đơn`. Đây là một EC/TC còn thiếu — khác về bản chất với "chưa đăng nhập", vì nó test đường UI thật, không phải giả lập bằng gọi API trực tiếp.

**4. Thiếu quan sát schema lỗi (observational gap)**
- Step 3.0 chỉ xác nhận schema thành công: `{"message": "Order canceled successfully"}`.
- Không có TC nào ghi lại nguyên văn body lỗi thực tế (khi status sai, khi không sở hữu, khi 401) — các TC hiện tại chỉ nói "ghi lại HTTP status" mà không yêu cầu ghi verbatim response body. Nếu không chốt được field name/schema lỗi từ TC đầu tiên chạm phải lỗi (vd TC-03), các TC sau (TC-04, TC-06, TC-07, TC-08) không có gì để so sánh nhất quán.

**5. FR-11 "phân biệt màu sắc trạng thái" chưa được kéo vào EC của biến `result`**
- FR-11 (được chính tài liệu này trích dẫn làm cross-reference) yêu cầu trạng thái phải "phân biệt màu sắc" ngoài dịch tiếng Việt. Nhóm EC14/EC15/EC16 (Output) chỉ kiểm tra nội dung text, không có ý nào kiểm tra màu sắc UI đổi theo trạng thái `canceled`. Đây là constraint hợp lệ cần gắn vào biến `result` đã có sẵn (đúng theo cross-reference filter của skill), không phải EC Group mới.

## Không phải gap thực sự (đã cân nhắc rồi loại)
- Race giữa 2 tab admin/user cùng đổi status — thuộc phạm vi FR-18, không phải FR-20.
- Kiểm tra phân trang lịch sử đơn hàng — chi tiết UI, không liên quan bất biến nghiệp vụ của cancel.

Bạn muốn tôi bổ sung 5 điểm trên vào `domain-testing.md`/`bva.md` (thêm EC + TC tương ứng) luôn không, hay để bạn tự quyết định điểm nào đáng thêm trước khi tôi sửa file?
```

### Follow-up prompt (22:58 02/07/2026)

```
Cần xác định lại scope chúng ta đang thực hiện function testing thông quan UI, API chỉ fallback khi không thể thực hiện trực tiếp thông qua UI (kiểm thử API là out scope)
```

### AI Output (verbatim, 22:58 02/07/2026)

```
Đúng, tôi rà lại 5 điểm đã nêu dưới đúng ràng buộc scope: **function testing đi qua UI là chính, API chỉ được dùng làm fallback cho một bước không thể thực hiện qua UI trong một luồng vẫn do UI dẫn dắt** — không tự tạo TC mà toàn bộ hành động chỉ là gọi API thuần túy.

## Rà soát lại 5 điểm theo scope UI-first

**❌ Loại bỏ — #1 (malformed `order_id`)**
Không có bước UI nào trong TC này cả — không phải "UI dẫn dắt, API fallback 1 bước", mà là một lời gọi API thuần từ đầu đến cuối (không ai gõ `order_id` qua UI, kể cả để dựng pre-condition). Đây thực chất là robustness/security test ở tầng API, đúng như bạn xác định — out of scope.

**⚠️ Thu hẹp — #2 (race condition)**
Bản tôi đề xuất ban đầu (bắn 2 request `PUT /cancel` song song bằng script) là kỹ thuật concurrency-test thuần API, không dẫn xuất từ một thao tác người dùng thật — loại bỏ luôn phần đó.
Phần còn giữ được trong scope: **double-tap thật trên UI** (người dùng tap `Hủy đơn` 2 lần liên tiếp thật nhanh, trước khi UI kịp ẩn nút/cập nhật `Trạng thái`) — đây là hành vi UI có thể tái hiện được bằng tay/playwright. Tuy nhiên TC-09 đã có verification point "exactly one `PUT` request sent (not two, from a double-submit)" — cần rà lại xem TC-09 có thực sự *thực hiện* double-tap hay chỉ *quan sát* single-tap. Nếu TC-09 hiện tại chỉ tap 1 lần, đây vẫn là một gap thật (thiếu kịch bản tap 2 lần liên tiếp), nhưng nó là biến thể của TC-09 chứ không phải TC mới độc lập.

**✅ Giữ nguyên — #3 (token hết hạn giữa phiên đang mở)**
Đây là đường UI thật: nút `Hủy đơn` vẫn hiển thị (session tưởng còn hợp lệ), user tap, request thất bại vì token đã hết hạn lúc gửi. Toàn bộ hành động là qua UI, API chỉ đóng vai trò cross-check ở tầng response — đúng scope.

**✅ Giữ nguyên — #4 (ghi verbatim response lỗi)**
Không phải TC mới, chỉ là bổ sung verification point vào các TC UI đã có sẵn (TC-03, TC-04, TC-07, TC-08) để chốt schema lỗi — không vi phạm scope vì API ở đây chỉ là cross-check của một hành động UI đã thực hiện.

**✅ Giữ nguyên — #5 (màu sắc trạng thái theo FR-11)**
Hoàn toàn quan sát qua UI (màu label `Trạng thái` sau khi hủy) — đúng scope, không đụng API.

## Còn lại sau khi lọc theo scope

| # | Gap | Loại bổ sung |
|---|---|---|
| 3 | EC07 tách thành 2 nhánh: (a) chưa đăng nhập/token sai từ đầu — API-only fallback (giữ như hiện tại) vs (b) token hết hạn giữa phiên đang mở, nút vẫn hiển thị — **UI-driven thật**, cần TC riêng | EC + TC mới |
| 2 (thu hẹp) | TC-09 cần xác nhận có double-tap thật (2 lần tap liên tiếp) hay chỉ tap 1 lần | Sửa/bổ sung Steps trong TC-09 hiện có |
| 4 | Verification point ghi verbatim response body lỗi | Bổ sung field vào TC-03/04/07/08 |
| 5 | Kiểm tra màu sắc label "Đã hủy" theo FR-11 | Bổ sung verification point (có thể vào TC-01/02 hoặc TC riêng) |

Bạn muốn tôi cập nhật trực tiếp `domain-testing.md` (EC mới cho #3, sửa TC-09 cho #2, thêm verification point cho #4 và #5) không?
```

### Follow-up prompt (23:14 02/07/2026)

```
Tôi sẽ chỉ bổ sung thêm #5 về màu sắc trạng thái theo FR-11 thôi; #4 không cần thiết vì srs hay api_specification không có document về schema lỗi, không cần phải tự tạo một oracle không chính xác; #3 tiềm năng nhưng thực tế khó test khi không biết rõ token có TTL là bao nhiêu trong spec; #2 TC-09 có mục tiêu kiểm tra có confirm dialog hay không, không phải là race-condition hay double tap;
```

### AI Output (verbatim, 23:14 02/07/2026)

```
Đã hoàn tất. Tóm tắt thay đổi:

1. **Xác nhận lại scope**: chỉ bổ sung #5 (màu sắc trạng thái theo FR-11), loại bỏ #1–#4 theo lý do bạn đưa ra.
2. **Verify thật qua UI** (không đoán màu): khởi động backend + mobile Expo web, đăng nhập `test@eshop.com`, dùng `getComputedStyle()` so sánh 5 trạng thái (`pending`, `confirmed`, `shipping`, `delivered`, `canceled`) — tất cả đều `rgb(0,0,0)`, nền trong suốt, không border/background phân biệt.
3. **Cập nhật `domain-testing.md`**: thêm cross-feature constraint FR-11 vào biến `result`, EC17 (Must-Be Rule), TC-10, và dòng EC Coverage Matrix.
4. **Cập nhật `execution-log.md`**: ghi kết quả TC-10 = FAIL, thêm **BUG-20-002** (severity Low — vi phạm trực tiếp FR-11, không phải gap), cập nhật Execution Summary (14/14 TC, 2 bug).
5. **Cập nhật `bva.md`**: sửa Test Suite Summary từ 13 → 14 TC.

Backend (`:3000`) và mobile Expo web (`:8081`) vẫn đang chạy nền — báo tôi nếu bạn muốn dừng.
```

- Updated `execution-log.md`: recorded TC-10 = FAIL, added **BUG-20-002** (severity Low — direct FR-11 violation, not a gap), updated Execution Summary to 14/14 TC, 2 bugs.

**Note:** Final output committed at `57e7975` (23:52 02/07/2026). Points #1-#4 were AI-proposed but explicitly rejected by the student after scope negotiation — documented in `REPORT.md` Section 5.3.

### Used in

- `[AI-02]_AI_Audit_Report.md`, Artifact 4 (FR-11 fix, EC17/TC-10, only)
- `REPORT.md`, Section 5.3 (full self-review gap analysis, including rejected candidates)

---

## Entry 011 | 21:44 03/07/2026

**Tool:** Claude Code (claude-sonnet-5)
**Feature:** All (FR-02, FR-09, FR-16, FR-20)
**Step:** Post-execution synthesis of BUG_REPORT.md from execution-log.md files

### Prompt

```
Hãy giúp tôi tổng hợp lại toàn bộ các bug đã được catch trong quá trình thực hiện kiểm thử
trên 4 FR và trình bày cho tôi một bản preview BUG_REPORT trước khi thực hiện tổng hợp lại
thành một file
```

### AI Output

```
Đã đọc xong 4 execution log (FR-02, FR-09, FR-16, FR-20). Tổng hợp được 17 bug trên toàn bộ
4 FR. Dưới đây là bản preview trước khi ghi vào BUG_REPORT.md:

| Bug ID | Feature | Mô tả ngắn | Severity | TC phát hiện |
|---|---|---|---|---|
| BUG-02-001 | FR-02 | Email sai định dạng không bị chặn client-side, chỉ server 401 | Medium | TC-03 |
| BUG-02-002 | FR-02 | Error message render dưới nút Sign In thay vì trên | Low | TC-04 |
| BUG-02-003 | FR-02 | Counter đăng nhập sai tăng +2 mỗi lần thất bại thay vì +1 | High | TC-06, TC-BVA-01 |
| BUG-02-004 | FR-02 | Thời gian khóa tài khoản thực tế ~180s, không phải 30s như spec | Medium | TC-BVA-01 |
| BUG-09-001 | FR-09 | Công thức percent coupon sai (nhân 10 thay vì chia 100) → final_amount âm/sai | High | TC-01, TC-05, TC-BVA-03, TC-BVA-08 |
| BUG-09-002 | FR-09 | /api/apply-coupon chấp nhận request không có JWT | High | TC-08 |
| BUG-09-003 | FR-09 | /api/apply-coupon chấp nhận JWT không hợp lệ | High | TC-09 |
| BUG-09-004 | FR-09 | Coupon fixed không giới hạn trần theo tổng đơn → final_amount âm | High | TC-11 |
| BUG-09-005 | FR-09 | Ngưỡng min_order_amount dùng strict > thay vì >= | Medium | TC-12, TC-BVA-02 |
| BUG-09-006 | FR-09 | Mã coupon không phân biệt hoa/thường (case-insensitive) | Medium | TC-05 |
| BUG-16-001 | FR-16 | Route import admin chấp nhận token của user thường (không phải admin) | High | TC-04 |
| BUG-16-002 | FR-16 | Không validate price > 0 (0, âm, non-numeric, thiếu field đều được chấp nhận) → rollback atomic không kích hoạt | High | TC-08-12, TC-18, TC-BVA-01 |
| BUG-16-003 | FR-16 | Import chấp nhận category_id không tồn tại | High | TC-15 |
| BUG-16-004 | FR-16 | Không giới hạn name 255 ký tự theo cross-feature FR-15 | Medium | TC-14, TC-BVA-05 |
| BUG-16-005 | FR-16 | UI không enforce đuôi file .csv (chấp nhận .txt) | Low | TC-19 |
| BUG-20-001 | FR-20 | Backend cho phép cancel đơn ở trạng thái shipping dù UI ẩn nút và spec chỉ cho pending/confirmed | High | TC-07, TC-BVA-02 |
| BUG-20-002 | FR-20 | Tất cả nhãn trạng thái đơn hàng cùng màu đen, vi phạm yêu cầu "phân biệt màu sắc" của FR-11 | Low | TC-10 |

Phân bố severity: High: 9 · Medium: 5 · Low: 3
Phân bố theo FR: FR-02: 4 · FR-09: 6 · FR-16: 5 · FR-20: 2

Bạn xác nhận nội dung này đúng và đủ trước khi tôi ghi đầy đủ (kèm Steps to Reproduce,
Expected/Actual, Screenshot links) vào BUG_REPORT.md chứ?
```

---

### Follow-up prompt (21:49, same session)

```
Ngoài những bug được tiếp thấy trong quá trình thực thi ra, thì còn những BUG được nhắc đến
như một conflict trong các tài liệu spec hay không?
```

### AI Output

```
Có. Grep qua toàn bộ domain-testing.md/bva.md của 4 FR cho từ khóa "conflict/gap/ambiguous"
phát hiện 3 spec conflict được ghi nhận ở giai đoạn thiết kế test, nhưng chỉ 2 trong số đó
đã được convert thành TC và thực thi (đã nằm trong 17 bug ở trên):

1. FR-16 — SRS yêu cầu upload file .csv, nhưng API spec chỉ nhận JSON body → đã test qua
   TC-19 → confirmed BUG-16-005.
2. FR-20 — SRS/FR-10 cấm cancel ở trạng thái shipping, API spec §4.6 diễn đạt lỏng lẻo ngầm
   cho phép → đã test qua TC-07 + TC-BVA-02 → confirmed BUG-20-001.
3. FR-09 — API spec cho phép client tự gửi total_amount, nhưng FR-08 yêu cầu backend phải tự
   recompute độc lập — CHƯA test, được ghi là "Implicit Gap" nhưng không có EC ID, không có
   TC nào, không xuất hiện trong execution-log.md.

Kết luận: #3 là spec conflict đã biết nhưng chưa kiểm thử thực tế — không nên tính vào 17 bug
đã catch, nhưng đáng ghi vào mục riêng "Untested Spec Conflicts" để minh bạch phạm vi coverage.

Bạn muốn tôi thêm mục này vào cuối BUG_REPORT.md, hay bỏ qua chỉ tổng hợp đúng 17 bug?
```

---

### Follow-up prompt (21:53, same session)

```
Thêm mục Untested Spec Conflicts vào cuối BUG_REPORT.md. Nội dung BUG_REPORT cần được viết
bằng tiếng Anh một cách tự nhiên nhất khi mô tả BUG
```

### AI Output

```
Đã ghi đầy đủ BUG_REPORT.md với:
- 17 bug chia theo 4 FR, mỗi bug có mô tả tự nhiên bằng tiếng Anh (Description, Steps to
  Reproduce, Expected vs Actual, Screenshot trỏ đúng đường dẫn ảnh thực tế).
- Bảng Bug Summary ở đầu với severity distribution (High 9, Medium 5, Low 3).
- Mục Untested Spec Conflicts ở cuối file, ghi nhận SC-09-001.

Lưu ý: cột GitHub Issue để TBD vì chưa tạo issue thật trên GitHub.
```

**Note:** the chat reply above is a Vietnamese meta-summary; the AI wrote the actual English
bug descriptions (Description / Steps to Reproduce / Expected vs Actual / Screenshot) directly
to `BUG_REPORT.md` rather than printing them in the chat turn — see that file for the full
verbatim English content (commit `bc96b7a`).

---

### Follow-up prompt (21:57, same session)

```
Giúp tôi tạo các Github Issue này cho các BUG đã được tìm thấy
```

### AI Output

```
Đã tạo xong 17 GitHub Issues và cập nhật BUG_REPORT.md:

| FR | Issues |
|---|---|
| FR-02 | #13-#16 |
| FR-09 | #17-#22 |
| FR-16 | #23-#27 |
| FR-20 | #28-#29 |

Mỗi issue theo đúng format đã dùng sẵn trong repo (BUG ID / Title / Feature / Related TC /
Severity / Status / Description / Steps to Reproduce / Input Data / Expected / Actual /
Impact / Suggested Fix / Evidence). Cột GitHub Issue trong BUG_REPORT.md giờ đã trỏ đúng số
issue thay vì TBD.
```

**Note:** BUG-09-007 (TC-13) was added later on 06/07/2026 (commit `685083c`), raising the
total from 17 to 18 bugs — not part of this synthesis session.

### Used in

- `BUG_REPORT.md` (full artifact)
- `[AI-02]_AI_Audit_Report.md`, artifact mới cần bổ sung

---

## Entry 012 | 10:53 24/06/2026

**Tool:** Claude Code (claude-sonnet-4-6)
**Feature:** All (skill-level)
**Step:** Skill Creation (v0.1) via `/skill-creator`

### Prompt

```
Hãy tổng hợp nội dung toàn bộ quá trình phân tích và thiết kế test case bằng kỹ thuật Domain
Testing và Boundary Value Analysis thành một Agent Skill (sử dụng /skill-creator) thực hiện
theo từng bước của quá trình (sử dụng tài liệu @docs/slides/S04_domain_testing.md như tài liệu
tham khảo). Ở mỗi bước sau khi thực hiện, sử dụng AskUserQuestion để yêu cầu người dùng chấp
nhận hoặc đưa ra feedback cho output, sau khi chỉnh sửa và được người dùng chấp nhận thì hãy
Write ra file tương ứng (Step 1-3 vào domain-testing.md, Step 4 vào bva.md folder FR-xx tương
ứng với FR đang phân tích).
```

### AI Output

```
Skill đã active trong session hiện tại (thấy trong `available_skills`). Đây là tổng kết:

Skill `domain-testing`, tổng kết:

Location:
- Source: `.agents/skills/domain-testing/SKILL.md` (326 dòng)
- Symlink: `.claude/skills/domain-testing`, active ngay lập tức

Cấu trúc skill:

Phase 0, Setup: đọc SRS, xác định FR, locate/create output folder
STEP 1, Variables & Constraints: AskUserQuestion, feedback loop, accepted
STEP 2, Equivalence Classes (4 rules: Range/Set/Must-Be/Splitting): AskUserQuestion, feedback
loop, accepted
STEP 3, Minimum TCs (Error Isolation + vertical table per TC): AskUserQuestion, accepted, Write
domain-testing.md
STEP 4, BVA (3-point model, ASCII boundary map, Defect target per TC): AskUserQuestion,
accepted, Write bva.md

Triggers (tự động invoke):
- "apply domain testing to FR-05"
- "thiết kế test case cho FR-09"
- "/domain-testing FR-16"
- "phân tích FR-03 bằng EP"

Điểm thiết kế quan trọng:
- AskUserQuestion sau mỗi bước, không bao giờ proceed mà không có approval
- Error Isolation bắt buộc, skill ghi rõ là "non-negotiable"
- Mục tiêu Defect cụ thể trong BVA, không chấp nhận "off-by-one" chung chung
- Implicit Gaps phải được flag, không assume away thiếu sót của SRS

Để test skill trên FR khác, dùng: /domain-testing FR-09 hoặc "apply domain testing to FR-16".
```

**Note:** Skill was ported directly from the manual FR-02 pipeline just completed (Entry 001 to
009). Commit `0b90b06 feat(skills): add domain-testing skill for EP + BVA test design`. Same
day, commit `1ab9b14 refactor(skills): generalize domain-testing skill to English,
project-agnostic` rewrote SKILL.md fully in English and removed all EShop SUT/CSC13003/FR-01 to
FR-20 references, replaced with the `{output-folder}/{feature-slug}` placeholder.

### Used in

- `[AI-02]_AI_Audit_Report.md`, artifact domain-testing skill
- `.agents/skills/domain-testing/SKILL.md` (v0.1)

---

## Entry 013 | 10:38 26/06/2026

**Tool:** Claude Code (claude-sonnet-4-6)
**Feature:** All (skill-level, so sánh output FR-02 và FR-09)
**Step:** Skill Upgrade v0.2, 6 improvements

### Prompt

```
Từ những phân tích trên thì domain-testing skill hiện tại có thể nâng cấp được ở những điểm
nào nữa
```

### AI Output

```
Skill hiện tại là v0.1, được forge từ FR-02. Nhìn vào khoảng cách giữa FR-02 output và FR-09
output, tôi thấy 6 điểm cụ thể có thể upgrade.

Điểm 1, Cross-reference Filter Rule (HIGH IMPACT): Phase 0 hiện có câu "constraints in
cross-referenced specs are test targets" quá mở, dẫn đến việc AI đọc FR-22 và add EC23/EC24
(display positioning) vào domain testing của FR-02, tức scope creep. Fix: thêm quy tắc chỉ đọc
cross-reference để lấy constraint cho biến đã có ở Step 1, không tạo EC Group mới cho hành vi
thuộc sở hữu của feature khác.

Điểm 2, Gap Test TC Pattern trong Step 3 (HIGH IMPACT): Step 1 nói "Flag Implicit Gaps" nhưng
skill không nói phải làm gì với chúng ở Step 3. Fix: mỗi gap từ Step 1 trở thành đúng một
gap-probe TC, với "ECs Verified Absent" ghi "N/A, gap test, observe behavior" và "Expected
Result" liệt kê tất cả nhánh khả dĩ thay vì một assertion nhị phân.

Điểm 3, "Invalid/Gap" EC Type trong Step 2 (MEDIUM IMPACT): Step 2 chỉ có Valid/Invalid, cần
thêm loại Invalid/Gap cho hành vi spec không định nghĩa, expected output ghi "undefined, test
to discover" thay vì buộc tester đoán assertion cho một hành vi không tồn tại trong spec.

Điểm 4, Spec Conflict Detection trong Step 1 (MEDIUM IMPACT): tách bảng Implicit Gaps hiện tại
thành hai loại, Implicit Gaps (spec im lặng) và Spec Conflicts (hai nguồn spec mâu thuẫn),
riêng Spec Conflicts phải document cả hai nguồn và tạo gap-probe TC để verify hệ thống thực tế
implement theo nguồn nào.

Điểm 5, Multi-parameter BVA trong Step 4 (MEDIUM IMPACT): khi boundary có tham số cấu hình
được (ví dụ uses_by_user < max_uses_per_user), test điểm ON với ít nhất 2 giá trị tham số khác
nhau để loại trừ khả năng implementation hardcode ngưỡng thay vì đọc từ config.

Điểm 6, Quality Checklist bổ sung (LOW IMPACT): thêm 4 item tương ứng 4 điểm trên vào checklist
tự-kiểm trước AskUserQuestion.

Điểm 1 và 2 là critical nhất, độc lập với nhau, có thể implement song song vào SKILL.md.

Bạn muốn tôi apply trực tiếp vào SKILL.md không?
```

**Note:** Applied as-is, verified (line count, checklist count, both file copies identical),
then committed at `b1d7a3c feat(skills): upgrade domain-testing to v0.2 with 6 improvements`
(10:58, same session).

### Used in

- `[AI-02]_AI_Audit_Report.md`, artifact domain-testing skill
- `.agents/skills/domain-testing/SKILL.md` (v0.2)

---

## Entry 014 | 16:20 đến 16:25 30/06/2026

**Tool:** Claude Code (claude-sonnet-4-6)
**Feature:** FR-16
**Step:** Skill Upgrade v0.3, Gap Completeness Cross-Check

**Note:** a near-duplicate prompt at 16:19 (same session) first returned "current version is
sufficient, no update needed." This corrected analysis below, from an almost identical prompt
one minute later, is the one that actually drove the v0.3 update.

### Prompt

```
Dựa vào kết quả AI Audit và AI Gap của FR-16 có thể bổ sung điều chi cho domain-testing skill
không? Hay phiên bản hiện tại là đã đủ dùng rồi
```

### AI Output

```
Kết luận ngắn: Skill chưa đủ, có 2 lỗ hổng cụ thể chưa được address.

Cả 2 deficiency của FR-16 đều cùng một root cause: không có back-reference pass, tức AI xong
Step 3, EC minimization kết thúc, nhưng không có cơ chế nào quay lại kiểm tra từng gap trong
Step 1 đã có TC chưa. Hai failure mode cụ thể:
- Observational gap (Gap #6, response schema unknown): không có EC mới nên EC minimization coi
  như "done"
- Intra-EC behavioral gap (Gap #7, early-exit vs full-scan): EC19 đã được cover bởi TC-12 nên EC
  minimization dừng

Skill hiện có rule "Each gap or conflict identified in Step 1 becomes exactly one gap-probe TC"
và checklist "Every Implicit Gap and Spec Conflict from Step 1 has a corresponding gap-probe
TC", nhưng FR-16 vẫn fail vì checklist nằm ở cuối, không được invoke đúng thời điểm, và wording
"has a corresponding TC" cho phép AI rationalize rằng TC-12 "corresponds" đến Gap #7.

Cần bổ sung 3 điều: (1) Gap completeness cross-check bắt buộc trong Step 3, trước khi viết file,
scan từng dòng Step 1 gap table và hỏi TC nào cụ thể giải đáp câu hỏi hành vi của gap này; (2)
phân biệt rõ 2 gap type hay bị skip, observational gap (không có EC mới, dùng valid input, ghi
nhận raw response) và intra-EC behavioral gap (EC đã covered nhưng spec im lặng về cơ chế hoạt
động bên trong); (3) siết checklist wording từ "has a corresponding TC" thành "has a TC that
specifically answers the behavioral question the gap raises."

Đây là failure mode đã lặp lại ở cả FR-09 và FR-16 cùng root cause, đủ evidence để coi là
systematic gap, không phải edge case. Nên bổ sung.

Bạn muốn tôi apply trực tiếp vào SKILL.md không?
```

---

### Follow-up prompt (16:25, same session)

```
apply những bổ sung đó vào SKILL.md bằng tiếng Anh đồng bộ với nội dung hiện tại.
```

### AI Output

```
Hai bổ sung đã được apply:

Step 3, thêm "Gap Completeness Cross-Check" ngay trước AskUserQuestion: bắt buộc scan Step 1
gap table từng dòng sau khi xong TCs, giải thích rõ 2 gap type thường bị EC minimization bỏ qua
(observational gap và intra-EC behavioral gap).

Quality Checklist, split thành 2 item rõ ràng hơn: item 1 là row-by-row verification kèm lưu ý
EC coverage không đồng nghĩa gap đã đóng và 2 gap type phải check riêng, thay cho wording cũ
"has a corresponding TC" quá dễ rationalize; item 2 là multi-branch Expected Result tách riêng
để không bị lẫn.
```

**Note:** CHANGELOG and artifact copy updated, then committed at `b2b858b feat(skills): add gap
completeness cross-check to domain-testing v0.3` (16:29, same session).

### Used in

- `[AI-02]_AI_Audit_Report.md`, artifact domain-testing skill
- `.agents/skills/domain-testing/SKILL.md` (v0.3)

---

## Entry 015 | 15:15 đến 15:32 02/07/2026

**Tool:** Claude Code (claude-sonnet-5)
**Feature:** All (skill-level, trigger từ feedback TA và tự quan sát hallucination khi test
chỉ dựa trên SRS/API spec)
**Step:** Skill Upgrade v0.4, UI-first và channel-abstraction rules

**Context (TA feedback, not a student prompt, received 08:02 02/07/2026):**

```
Dear Lâm,

For this assignment, the primary focus is on functional testing, which means the
starting point for your test workflows should begin at the frontend UI. This applies
to manual testing as well as any automation you choose to introduce (though please
note we will have a dedicated exercise for automated testing later).

Regarding your specific constraints, for test cases that cannot be executed through
the UI, either due to strict client-side validation or because the UI elements are
not yet implemented, it is acceptable to execute them at the API level. However, you
must document these API-level test cases clearly and separately in your report,
noting the specific reason for each. Keep in mind that we will also have a separate
assignment specifically focused on API testing.

Best regards,
Thanh
```

---

### Prompt

```
Hiện tại, sự chậm trễ trong việc xác minh phương thức thực thi các test-case nên các test-case
đều được thiết kế chỉ dựa trên srs và api-specification, khiến AI bị hallucination và chỉ kiểm
tra ở mức độ API thay vì thực sự kiểm tra thông qua UI hay frontend thực tế. Vì vậy, tôi cần phải
cập nhật lại domain-testing skill và cả fr-execution skill để fix các vấn đề này, cũng như refine
lại các vấn đề hay điểm đã thảo luận và chỉnh sửa trên các file domain-testing và bva.

Đối với domain-testing skill, ở bước Step 0 hay Step 3 cần phải khảo sát UI thực tế để viết Step
để tương tác với UI chính xác trước khi viết các bước mô phỏng test-case để giai đoạn thực thi
thực hiện (giống với nội dung đã chỉnh sửa hiện tại). Đồng thời, các trường Expected Error/Behavior
ở Step 1, Expected System Output ở Step 2 cần giữ được độ high-level hay abstract giống với những
gì đã thống nhất và chỉnh sửa ở các commit trước đó; Expected Result của test-case cần thể hiện ở
UI observed kết hợp với AI cross-references như đã chốt.

Đối với fr-execution skill, khi chụp màn hình thì cần sử dụng `playwright-cli screenshot
--full-page` để lấy full-page screenshot thay vì sử dụng kích thước tự customize. Đồng thời cập
nhật những điểm bổ sung khi thực hiện (nếu có)
```

### AI Output

```
Symlink đồng bộ hoàn toàn, chỉ 2 file source thay đổi. Hoàn tất cập nhật cả 2 skill.

Tóm tắt thay đổi:

domain-testing/SKILL.md:
- Thêm sub-step Step 3.0, Survey the Real UI: bắt buộc mở SUT thật qua playwright-cli (survey một
  lần/feature, dùng lại cho cả Step 3 và Step 4), lấy đúng label/URL thật thay vì suy đoán từ spec;
  tách rõ setup (DB/API) khỏi execution (UI); mặc định UI, chỉ fallback API khi có blocker thật.
- Step 1 Expected Error/Behavior và Step 2 Expected System Output: thêm rule + ví dụ before/after
  giữ trừu tượng, không literal HTTP/JSON (trừ EC phân loại theo response shape).
- TC template (Step 3 và BVA Step 4): thêm field UI Fallback Note, restructure Expected
  Result/Verification Points thành 2 tầng (UI-observable trước, API cross-check sau).
- Quality Checklist: +4 mục kiểm tra tương ứng.

fr-execution/SKILL.md:
- Screenshot command: thêm --full-page, kèm rule never viewport-only.
- Field Actual result trong execution-log template: đổi sang 2 tầng UI/API cross-check.
- Thêm Gotcha về không dùng §/em dash trong prose của execution-log.md.

Chưa commit, để bạn review trước.
```

---

### Follow-up prompt (15:32, same session)

```
Cập nhật CHANGELOG và domain-testing skill artifacts với nội dung trích dẫn từ cấu trả lời của
TA và các quyết định đã được ra, kèm cập nhật
```

### AI Output

```
Đã hoàn tất:
- homeworks/HW02/artifacts/skills/domain-testing/SKILL.md, đồng bộ 1:1 với bản .agents mới nhất
  (đã có Step 3.0 UI survey, abstraction rule, UI Fallback Note, Expected Result 2 tầng).
- CHANGELOG.md, thêm entry v0.4 (2026-07-02), mở đầu bằng quote nguyên văn câu trả lời của TA
  (Thanh, 08:02 02/07/2026), theo sau là các thay đổi cụ thể đã áp dụng để đáp ứng yêu cầu đó,
  cộng quyết định trong-session rằng Variables/EC vẫn channel-agnostic, không cần redesign toàn
  bộ, chỉ 2 cột bị leak transport-literal cần sửa.
- README.md, sửa bảng Status đang stale, thêm dòng v0.4 (Done, nguồn gốc từ retrospective TA
  feedback).

Tất cả thay đổi đang ở trạng thái chưa commit, sẵn sàng để bạn review trước khi tôi commit.
```

**Note:** A ScheduleWakeup auto-fire at 15:30 (same session) re-announced already-completed work
while waiting on background Explore agents; it added no new decision and is omitted here.
Committed at 15:36, same session: `0c25532 docs(domain-testing): require UI survey and
channel-abstraction rules` (domain-testing skill) and `1d54c6e docs(fr-execution): require
full-page screenshots and UI/API split` (fr-execution skill).

### Used in

- `[AI-02]_AI_Audit_Report.md`, artifact domain-testing skill
- `.agents/skills/domain-testing/SKILL.md` (v0.4)

---

## Entry 016 | 11:48 đến 12:05 06/07/2026

**Tool:** Claude Code (claude-sonnet-5)
**Feature:** All (skill-level, self-audit)
**Step:** Skill Self-Audit và Upgrade v0.5, Extreme/Overflow Value Check

### Prompt

```
Xin chào Claude, tôi đang thực hiện đánh giá kỹ năng domain-testing, kỹ năng giúp tôi Claude
thực hiện pipeline thiết kế test case bằng kỹ thuật Domain Testing và Boundary Value Analysis.
Mục tiêu của tôi là đánh giá chất lượng của skill dựa trên các nguyên tắc thiết kế theo tài liệu
ISTQB và Slide môn học, đảm bảo kỹ năng thực hiện chính xác các bước trong nguyên tắc và đánh
giá các điểm mở rộng của kỹ năng. Hãy đóng vai là chuyên gia về Software Testing, ISTQB Expert
để giúp tôi search extensively về kỹ thuật Domain Testing, BVA và đánh giá kỹ năng
domain-testing. Tôi muốn câu trả lời của tôi ưu tiên sự rõ ràng trong các đánh giá theo thang
điểm 10 với lời giải thích rõ ràng, cụ thể.
```

### AI Output

```
Đánh giá Skill domain-testing, đối chiếu ISTQB CTFL Ch.4 và Slide S04.

Tóm tắt kết luận:
| Tiêu chí | Điểm /10 | Ghi chú ngắn |
|---|---|---|
| Bước 1, Identify Variables & Constraints | 9.0 | Đúng chuẩn + mở rộng System State/Gap hợp lý |
| Bước 2, Equivalence Classes | 9.5 | Implement đủ 4 quy tắc chuẩn + 1 quy tắc mở rộng chính đáng |
| Bước 3, Minimum Test Cases | 9.0 | Bám sát Slide 21 tuyệt đối, có bằng chứng thực thi đúng |

Các phần mở rộng vượt ISTQB (không trừ, chỉ ghi nhận):
1. Parameter Variation, test ON-point với ít nhất 2 giá trị tham số khác nhau để phân biệt
   implementation hardcode với implementation đọc config, insight không có trong ISTQB lẫn
   slide.
2. UI Survey bắt buộc trước khi viết Steps, chặn lỗi phổ biến nhất là suy diễn UI label từ spec
   thay vì quan sát thật.
3. Cross-reference filter, ranh giới rõ ràng giữa dùng constraint của FR khác và tạo EC Group
   cho hành vi thuộc sở hữu của FR khác.

Khuyến nghị cải tiến cụ thể (ưu tiên cao đến thấp):
1. [Cao] Thêm bước "Extreme/Overflow Value Check" chính thức vào Bước 4, ánh xạ đúng điểm
   8*/9* của Slide 26, hiện đang bị lệ thuộc vào Gap Rule một cách không nhất quán.
2. [Trung bình] Chạy lại Gap Completeness Cross-Check trên FR-02 (artifact cũ nhất, tiền-v0.2)
   để đưa nó lên chuẩn hiện tại, G3 và G4 hiện chưa có TC trả lời.
3. [Thấp] Cân nhắc ghi rõ trong SKILL.md rằng thuật ngữ "Domain Testing" ở đây tương đương
   ISTQB "Equivalence Partitioning + BVA".

Điểm tổng: 8.8/10, skill triển khai đúng và đầy đủ cả 4 bước theo cả ISTQB CTFL Ch.4 lẫn Slide
S04, có các mở rộng thực chiến chất lượng cao, và có bằng chứng cụ thể là cơ chế tự-kiểm đã cải
thiện qua các version. Hai điểm cần vá (extreme-value BVA, và audit lại FR-02 theo chuẩn mới)
đều cụ thể, có vị trí file/dòng rõ ràng, không phải nhận xét chung chung.
```

---

### Follow-up prompt (12:05, same session)

```
Tôi đồng ý với đánh giá của bạn, đặc biết là những điểm còn thiếu sót trong kỹ năng nay. Hãy
giúp tôi thực hiện bổ sung bước Extreme/Overflow Value Check cho bước 4 của skill này sau khi
bạn đã thu thập đầy đủ toàn bộ các thông tin mà bạn cần có để thực hiện nhiệm vụ này. Các công
việc bạn cần làm đó là cập nhật nội dung skill ở .agents và cập nhật skill được lưu trữ ở dạng
artifacts ở artifacts/skills cùng CHANGELOG.
```

### AI Output

```
Đã hoàn tất bổ sung Extreme/Overflow Value Check vào Bước 4 của skill.

Thay đổi:
- .agents/skills/domain-testing/SKILL.md (source of truth), thêm subsection mới sau "Parameter
  Variation": quy tắc chọn giá trị cực trị theo 3 mức ưu tiên (độ dài cột DB, maxlength UI quan
  sát được ở Bước 3.0, giá trị stress có lý do), yêu cầu Defect Target gọi đúng tên failure mode
  (truncation/overflow/crash/perf degradation/client-server mismatch), mở rộng enum Boundary
  Point Type, thêm mục checklist thứ 17 buộc mọi Invalid/Gap EC không biên phải có TC cực trị
  tương ứng.
- homeworks/HW02/artifacts/skills/domain-testing/SKILL.md, đồng bộ y hệt (đã diff xác nhận).
- CHANGELOG.md, thêm entry v0.5 ghi rõ nguồn gốc (audit ISTQB/Slide S04 vừa thực hiện), lý do cụ
  thể (đối chiếu 9-điểm biên Slide 26, phát hiện G4 của FR-02 chưa từng có TC), và note "Known
  follow-up" rằng FR-02/bva.md cũ chưa tuân thủ v0.5, cần audit lại.
- README.md, cập nhật bảng version, v0.5 = Done.
```

**Note:** Committed at 12:11, same session: `bb59e3a feat(domain-testing): add extreme/overflow
value check to BVA step` (4 files, 108 insertions, 9 deletions).

### Used in

- `[AI-02]_AI_Audit_Report.md`, artifact domain-testing skill
- `.agents/skills/domain-testing/SKILL.md` (v0.5)

---

<!-- Duplicate an entry block above for each AI interaction -->
