# FR-16 — Import Sản phẩm từ CSV: Domain Testing

## 1. Feature Overview

**Feature:** FR-16 — Import Sản phẩm từ CSV  
**Technique:** Domain Testing (Equivalence Partitioning)  
**Source:** `docs/eshop-sut/srs.md` — Section 6, FR-16

**Ràng buộc chính:**
- File phải có đuôi `.csv`
- Header: `name,price,description,imageUrl,category_id`
- `name` không được rỗng; `price` phải là số dương
- **Atomic transaction**: nếu bất kỳ dòng nào lỗi → rollback toàn bộ

---

## 2. Step 1 — Identify Input & Output Variables

| Variable | Type | Description |
| -------- | ---- | ----------- |
| `file_extension` | Input | Đuôi file được upload |
| `file_header` | Input | Dòng header của CSV |
| `row.name` | Input | Tên sản phẩm ở mỗi dòng |
| `row.price` | Input | Giá sản phẩm ở mỗi dòng |
| `row.description` | Input | Mô tả (optional) |
| `row.imageUrl` | Input | URL ảnh (optional) |
| `row.category_id` | Input | ID danh mục |
| `import_result` | Output | Báo cáo: số dòng thành công / lỗi |
| `db_state` | Output | Sản phẩm được thêm hoặc rollback |

---

## 3. Step 2 — Identify Equivalence Classes

### File extension

| EC | Description | Type |
| -- | ----------- | ---- |
| EC1 | Đuôi file là `.csv` | Valid |
| EC2 | Đuôi file khác (`.xlsx`, `.txt`, `.json`) | Invalid |
| EC3 | File không có đuôi | Invalid |

### File header

| EC | Description | Type |
| -- | ----------- | ---- |
| EC4 | Header đúng: `name,price,description,imageUrl,category_id` | Valid |
| EC5 | Header thiếu cột bắt buộc | Invalid |
| EC6 | Header sai tên cột | Invalid |
| EC7 | File rỗng (không có header) | Invalid |
| EC8 | File chỉ có header, không có data row | Valid (0 sản phẩm import) |

### Row: `name`

| EC | Description | Type |
| -- | ----------- | ---- |
| EC9 | `name` có giá trị, không rỗng | Valid |
| EC10 | `name` rỗng (`""` hoặc whitespace) | Invalid → rollback |

### Row: `price`

| EC | Description | Type |
| -- | ----------- | ---- |
| EC11 | `price` là số dương (> 0) | Valid |
| EC12 | `price` = 0 | Invalid → rollback |
| EC13 | `price` âm (< 0) | Invalid → rollback |
| EC14 | `price` là chuỗi không phải số | Invalid → rollback |
| EC15 | `price` rỗng | Invalid → rollback |

### Row: field có dấu phẩy (RFC 4180)

| EC | Description | Type |
| -- | ----------- | ---- |
| EC16 | Trường có dấu phẩy được bọc trong `"..."` | Valid |
| EC17 | Trường có dấu phẩy không bọc ngoặc | Invalid (parse error) |

### Atomicity

| EC | Description | Type |
| -- | ----------- | ---- |
| EC18 | Tất cả rows hợp lệ | Valid → import toàn bộ |
| EC19 | Ít nhất 1 row lỗi | Invalid → rollback toàn bộ |

---

## 4. Step 3 — Select Test Cases

| TC ID | EC Covered | Scenario | Expected Output |
| ----- | ---------- | -------- | --------------- |
| TC-16-EP-01 | EC1,EC4,EC9,EC11,EC18 | File CSV hợp lệ, tất cả rows đúng | Import thành công; báo cáo N dòng OK |
| TC-16-EP-02 | EC2 | Upload file `.xlsx` | Error: sai định dạng file |
| TC-16-EP-03 | EC3 | Upload file không có đuôi | Error: sai định dạng file |
| TC-16-EP-04 | EC5 | Header thiếu cột `price` | Error: header không đúng |
| TC-16-EP-05 | EC6 | Header dùng `Price` thay vì `price` | Error: header không đúng |
| TC-16-EP-06 | EC7 | File rỗng hoàn toàn | Error: file rỗng |
| TC-16-EP-07 | EC8 | Chỉ có header, không có data | Import 0 sản phẩm; báo cáo 0 dòng |
| TC-16-EP-08 | EC10,EC19 | 1 row có `name` rỗng | Rollback; 0 sản phẩm được thêm |
| TC-16-EP-09 | EC12,EC19 | 1 row có `price = 0` | Rollback; 0 sản phẩm được thêm |
| TC-16-EP-10 | EC13,EC19 | 1 row có `price = -100` | Rollback; 0 sản phẩm được thêm |
| TC-16-EP-11 | EC14,EC19 | 1 row có `price = "abc"` | Rollback; báo cáo lỗi dòng cụ thể |
| TC-16-EP-12 | EC16 | Field description chứa dấu phẩy, bọc trong `"` | Parse đúng; import thành công |
| TC-16-EP-13 | EC19 | File có 5 rows hợp lệ + 1 row lỗi | Rollback toàn bộ 5 rows hợp lệ |

---

## 5. Step 4 — Boundary Value Analysis

> Xem chi tiết tại: `bva.md`

---

## 6. AI Gap Analysis

_Điền sau khi chạy AI và review kết quả._

---

## 7. Execution Log

| TC ID | Executed? | Actual Result | Pass/Fail | Bug ID |
| ----- | --------- | ------------- | --------- | ------ |
| TC-16-EP-01 | | | | |
| TC-16-EP-02 | | | | |
| TC-16-EP-03 | | | | |
| TC-16-EP-04 | | | | |
| TC-16-EP-05 | | | | |
| TC-16-EP-06 | | | | |
| TC-16-EP-07 | | | | |
| TC-16-EP-08 | | | | |
| TC-16-EP-09 | | | | |
| TC-16-EP-10 | | | | |
| TC-16-EP-11 | | | | |
| TC-16-EP-12 | | | | |
| TC-16-EP-13 | | | | |
