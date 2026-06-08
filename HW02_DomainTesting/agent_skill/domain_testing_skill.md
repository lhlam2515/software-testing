# Domain Testing Skill

## Mục tiêu
Tạo quy trình tái sử dụng để thiết kế test case Domain Testing cho một feature của EShop hoặc hệ thống tương tự.

## Quy trình
1. Đọc requirement/specification của feature và ghi lại mục tiêu nghiệp vụ.
2. Xác định các biến đầu vào, điều kiện trạng thái, quyền truy cập và dữ liệu phụ thuộc.
3. Chia từng biến thành miền hợp lệ và miền không hợp lệ.
4. Tạo bảng `Input Variables / Conditions` gồm mô tả, valid domain và invalid domain.
5. Thiết kế test case bao phủ:
   - Đường đi hợp lệ chính.
   - Dữ liệu rỗng/sai định dạng.
   - Quyền truy cập: không token, sai role, truy cập dữ liệu người khác.
   - State-dependent behavior nếu feature có state machine.
   - UI/API mismatch, ví dụ UI khóa trường nhưng API vẫn có thể nhận payload.
   - Security cases như HTML/script input, role escalation, manipulated amount.
6. Với mỗi test case, ghi rõ preconditions, input data, steps, expected result, actual result, verdict và evidence.
7. Nếu chưa thực thi, luôn ghi `Not Executed`, không đoán kết quả.
8. Review AI gaps: hỏi AI có thể đã bỏ sót gì vì prompt tổng quát, chưa inspect code, hoặc thiếu hiểu biết backend/security.

## Checklist
- Feature ID rõ ràng.
- Có ít nhất 8 Domain Testing cases cho mỗi feature.
- Có cả valid và invalid domains.
- Có ca authorization/security nếu feature ảnh hưởng dữ liệu hoặc tiền.
- Evidence path là placeholder thật, không invent screenshot.

