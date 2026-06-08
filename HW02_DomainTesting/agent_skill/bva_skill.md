# BVA Skill

## Mục tiêu
Tạo quy trình tái sử dụng để thiết kế Boundary Value Analysis cho feature có biến số, độ dài chuỗi, danh sách, trạng thái hoặc ngưỡng nghiệp vụ.

## Quy trình
1. Đọc requirement và xác định các biến có biên:
   - Numeric: quantity, price, total amount, số lần dùng coupon.
   - Text length: tên, số điện thoại, địa chỉ.
   - List size: số item trong cart, số order hiển thị.
   - State boundary: trạng thái trước/tại/sau trong state machine.
2. Ghi boundary rule cho từng biến.
3. Chọn giá trị dưới biên, tại biên và trên biên.
4. Luôn xét các nhóm phổ biến:
   - Empty/null.
   - Min-1, min, min+1.
   - Max-1, max, max+1.
   - Overflow hoặc chuỗi rất dài.
   - Final state hoặc transition không được phép.
5. Tạo bảng `Boundary Variables`.
6. Tạo test cases BVA với TC ID rõ ràng, ví dụ `FR08-BVA-01`.
7. Review lại với specification để đảm bảo biên được chọn đúng, không dựa trên giả định.
8. Nếu chưa chạy test, để `Actual Result` và `Verdict` là `Not Executed`.

## Checklist
- Có ít nhất 6 BVA cases cho mỗi feature.
- Mỗi case nêu rõ below/on/above boundary hoặc state boundary.
- Có ca biên bảo mật nếu giá trị biên liên quan quyền, token hoặc payload nhạy cảm.
- Không claim pass/fail nếu chưa có bằng chứng thực thi.

