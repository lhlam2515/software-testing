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

**Note:** AI output at commit `6153cc0` (21:42 25/06/2026) contained 11 EP TCs. TC-12 (zero-amount degenerate probe) was added by the student on 26/06/2026 after post-design human review (commit `e8d0d84`).

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

**Note:** AI output at commit `0f518d7` (21:31 27/06/2026) contained 16 EP TCs and 5 BVA TCs. TC-17 (response schema probe) and TC-18 (all-rows-invalid batch) were added by the student after post-design human review, addressing Step 1 Gaps #6 and #7 that the AI identified but did not convert to TCs.

### Used in

- `[AI-02]_AI_Audit_Report.md`, Artifact 3

---

## Entry 009 | 15:42 02/07/2026

**Tool:** Claude Code (claude-sonnet-4-6, domain-testing skill)
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

**Tool:** Claude Code (claude-sonnet-4-6)
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

**Note:** Final output committed at `57e7975` (23:52 02/07/2026). Points #1-#4 were AI-proposed but explicitly rejected by the student after scope negotiation — recorded here as an AI Audit example of over-generation followed by human scope filtering, not a silent AI decision.

### Used in

- `[AI-02]_AI_Audit_Report.md`, Artifact 4

---

<!-- Duplicate an entry block above for each AI interaction -->
