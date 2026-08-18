# k6 Performance Testing — Shared Files

Gói này dành cho người đã có repository EShop. Các file gốc trong repository vẫn được giữ nguyên; thư mục `submission/` chỉ là bản sao để tải lên Drive.

## Thứ tự sử dụng

1. Đọc `01-guides/User_Guide.md` để cài k6 và khởi động backend.
2. Đọc `01-guides/script_tutorial.md` để hiểu cấu trúc k6 script.
3. Dùng HAR hoặc prompt trong `02-input/` để tham khảo cách tạo Traditional/AI-augmented script.
4. Đối chiếu các seed script trong `03-seed/` với thư mục `backend/` của repository.
5. Đối chiếu các test trong `04-k6-scripts/` với thư mục `k6/scripts/` của repository rồi chạy tại repository root.

## Seed data

Chạy trong thư mục `backend/` của repository, không chạy trực tiếp trong `submission/03-seed/`:

```powershell
# Traditional, AI, Smoke, Stress và Spike: 500 sản phẩm
npm install
npm run seed:performance
npm start
```

Volume test cần 5.000 sản phẩm. Dừng backend trước khi seed:

```powershell
npm run seed:volume
npm start
```

Sau Volume test, dừng backend và khôi phục dataset 500 sản phẩm:

```powershell
npm run seed:performance
npm start
```

## Chạy test

Chạy tại thư mục gốc repository:

```powershell
k6 run -e BASE_URL=http://localhost:3000 k6/scripts/baseline-smoke.js
k6 run -e BASE_URL=http://localhost:3000 k6/scripts/baseline-har.js
k6 run -e BASE_URL=http://localhost:3000 k6/scripts/ai-realistic-shopping.js
k6 run -e BASE_URL=http://localhost:3000 k6/scripts/stress-shopping.js
k6 run -e BASE_URL=http://localhost:3000 k6/scripts/spike-shopping.js
k6 run -e BASE_URL=http://localhost:3000 k6/scripts/volume-products.js
```

## Không bao gồm

Gói không chứa `node_modules/`, `database.sqlite`, dashboard kết quả, video hoặc tài liệu thuyết trình. Người dùng tự tạo kết quả trên phần cứng và môi trường của mình.
