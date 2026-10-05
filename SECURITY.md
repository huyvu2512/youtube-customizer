# Chính Sách Bảo Mật (Security Policy)

## Phạm vi và Mục đích

Dự án này được xây dựng hoàn toàn với mục đích học tập, nghiên cứu về cơ chế can thiệp DOM (DOM Manipulation), tối ưu hóa hiệu năng render trình phát và điều khiển tương tác trên nền tảng YouTube mang tính chất phi thương mại. Mọi hành vi sử dụng công cụ này vào mục đích trái phép, can thiệp tài khoản không thuộc quyền sở hữu hoặc vi phạm Điều khoản dịch vụ của YouTube / Google đều bị nghiêm cấm.

## Xử lý Dữ liệu Người dùng

1. **Không thu thập dữ liệu cá nhân:** Tiện ích hoàn toàn không lưu trữ, không theo dõi và không gửi bất kỳ dữ liệu cá nhân, thông tin định danh người dùng, lịch sử xem, nội dung tìm kiếm hay cookies/token tài khoản Google/YouTube nào ra bên ngoài.
2. **Lưu trữ cục bộ:** Trên trình duyệt, toàn bộ tùy chọn cấu hình giao diện và chế độ trình phát (`ytc_config`) chỉ được lưu tạm thời trong `localStorage` của máy khách (client-side) nhằm duy trì trạng thái cài đặt qua các phiên làm việc và sẽ bị xóa sạch hoàn toàn khi người dùng xóa dữ liệu duyệt web.
3. **Quyền hạn tối thiểu (`@grant none`):** Userscript hoạt động hoàn toàn với khai báo `@grant none` trong ngữ cảnh tiêu chuẩn của trình duyệt, không đòi hỏi hay sử dụng bất kỳ đặc quyền can thiệp nâng cao nào (như `GM_xmlhttpRequest`, `GM_cookie` hay truy cập hệ thống tệp).
4. **Tuân thủ chuẩn bảo mật Trusted Types & CSP:** Toàn bộ việc chèn và cập nhật DOM giao diện được xử lý qua hàm chuẩn hóa `safeHTML` và `setElementHTML`, tương thích tuyệt đối với chính sách Content Security Policy (CSP) và Trusted Types của YouTube, loại bỏ triệt để nguy cơ tấn công XSS (Cross-Site Scripting).
5. **Không có máy chủ theo dõi (No External Telemetry):** Dự án không tích hợp bất kỳ dịch vụ phân tích lưu lượng, theo dõi hành vi hay máy chủ trung gian nào. Mọi tác vụ xử lý đều diễn ra cục bộ 100% tại máy khách.

## Báo cáo Lỗ hổng Bảo mật

Nếu bạn phát hiện bất kỳ vấn đề bảo mật tiềm ẩn nào liên quan đến mã nguồn của dự án này, vui lòng thực hiện theo các bước sau:

1. Tuyệt đối không công khai lỗ hổng qua hệ thống Issue công khai của GitHub.
2. Gửi thông tin chi tiết về lỗ hổng kèm các bước tái hiện tới kênh liên hệ cá nhân của tác giả:
   - Trang thông tin: https://huyvu2512.io.vn
   - Hồ sơ GitHub: https://github.com/huyvu2512
3. Tác giả sẽ tiếp nhận, đánh giá mức độ nghiêm trọng và phát hành bản cập nhật vá lỗi trong thời gian sớm nhất.
