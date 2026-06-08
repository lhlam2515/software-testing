# AI Critique

AI hữu ích trong giai đoạn đầu của bài HW02 vì có thể nhanh chóng tạo cấu trúc báo cáo, bảng test case, nhóm miền hợp lệ/không hợp lệ và đề xuất các giá trị biên cơ bản. Với các feature như FR-04, FR-08, FR-18 và FR-20 Mobile Checkout, AI giúp tiết kiệm thời gian soạn khung tài liệu và nhắc lại các loại ca kiểm thử phổ biến: dữ liệu hợp lệ, dữ liệu rỗng, thiếu đăng nhập, dữ liệu sai định dạng và kiểm tra thông báo lỗi.

Tuy nhiên, kết quả AI không thể dùng trực tiếp nếu chưa đối chiếu với đặc tả thật và source code. AI có xu hướng bỏ sót các ca phụ thuộc state machine như `delivered` và `canceled` là trạng thái cuối, hoặc các chuyển trạng thái không hợp lệ như `pending -> delivered`. AI cũng có thể đánh giá thấp rủi ro backend, ví dụ backend phải tự tính lại tổng tiền checkout thay vì tin `total_amount` từ client, hoặc API phải chặn việc user tự gửi `role=admin`. Ngoài ra, các vấn đề HTML escaping trong shipping address và khác biệt UI/API thường không xuất hiện nếu prompt quá tổng quát.

Vì vậy, người kiểm thử phải review lại toàn bộ output của AI, đọc SRS/API, inspect mobile app và bổ sung các edge cases còn thiếu. Trong bài này, tester đã thêm các ca bảo mật, authorization bypass, state-dependent behavior, manipulated payload, mobile network/API mismatch và đánh dấu mọi kết quả là `Not Executed` cho đến khi có bằng chứng thực thi thật.
