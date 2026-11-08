PERCENTAGE RECOVERY LAO — bản thử nghiệm offline-first

Mở index.html bằng trình duyệt để thử giao diện. Để cài như PWA và dùng service worker, chạy thư mục này qua một máy chủ web cục bộ (ví dụ: python3 -m http.server 8000) rồi mở http://localhost:8000.

LƯU Ý QUAN TRỌNG:
- Đây là prototype chạy offline, dữ liệu mẫu được lưu trong localStorage của từng trình duyệt/thiết bị.
- Chưa có đồng bộ giữa nhiều thiết bị, đăng nhập/mật khẩu/PIN an toàn, mã hóa hoặc sao lưu máy chủ. Những phần này cần backend riêng và cấu hình triển khai.
- Công thức trên 14,3° dùng bảng thủy phần đã cung cấp + 0,5%; dưới 14,3° hiện dùng cách đọc từ ví dụ viết tay (moisture/(1+moisture/100), cắt xuống 1 chữ số thập phân, lấy 12,5 trừ kết quả rồi cộng tỷ lệ đó vào nhân sạch). Cần kiểm thử thêm với số liệu thực tế trước khi dùng cho quyết định sản xuất.
- Bảng thủy phần đã nhập các giá trị nhìn đọc được từ ảnh; cần đối chiếu lại bản gốc trước khi xác nhận chính thức.
