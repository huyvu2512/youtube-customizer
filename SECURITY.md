# Chính Sách Bảo Mật (Security Policy)

## Phạm vi và Mục đích

Dự án này được xây dựng hoàn toàn với mục đích học tập, nghiên cứu về cơ chế can thiệp DOM (DOM Manipulation), tối ưu hóa hiệu năng render trình phát và điều khiển tương tác trên nền tảng YouTube mang tính chất phi thương mại. Mọi hành vi sử dụng công cụ này vào mục đích trái phép, can thiệp tài khoản không thuộc quyền sở hữu hoặc vi phạm Điều khoản dịch vụ của YouTube / Google đều bị nghiêm cấm.

## Xử lý Dữ liệu Người dùng

1. **Dữ liệu cá nhân:** Mã nguồn không gửi lịch sử xem, nội dung tìm kiếm, cookies hay token tài khoản tới máy chủ dự án. Không tích hợp hệ thống phân tích hành vi.
2. **Lưu trữ cục bộ:** Cấu hình và một số trạng thái như phiên bản đã kiểm tra được lưu trong `localStorage` hoặc `sessionStorage` của trình duyệt. Chúng không được đồng bộ lên máy chủ dự án.
3. **Quyền hạn tối thiểu (`@grant none`):** Userscript hoạt động hoàn toàn với khai báo `@grant none` trong ngữ cảnh tiêu chuẩn của trình duyệt, không đòi hỏi hay sử dụng bất kỳ đặc quyền can thiệp nâng cao nào (như `GM_xmlhttpRequest`, `GM_cookie` hay truy cập hệ thống tệp).
4. **Trusted Types và CSP:** Mã nguồn có các hàm hỗ trợ gán nội dung DOM tương thích với Trusted Types. Đây không phải bộ lọc làm sạch HTML; nội dung không tin cậy vẫn cần được kiểm tra trước khi chèn.
5. **Yêu cầu mạng:** Không có dịch vụ phân tích hay máy chủ telemetry. Khi bật kiểm tra cập nhật, script truy cập GitHub hoặc CDN để lấy thông tin phiên bản; bảng thông số có thể gửi yêu cầu đo độ trễ tới YouTube. Các yêu cầu này không kèm lịch sử xem hay nội dung tài khoản.

## Báo cáo Lỗ hổng Bảo mật

Nếu bạn phát hiện bất kỳ vấn đề bảo mật tiềm ẩn nào liên quan đến mã nguồn của dự án này, vui lòng thực hiện theo các bước sau:

1. Tuyệt đối không công khai lỗ hổng qua hệ thống Issue công khai của GitHub.
2. Gửi thông tin chi tiết về lỗ hổng kèm các bước tái hiện tới kênh liên hệ cá nhân của tác giả:
   - Trang thông tin: https://huyvu2512.io.vn
   - Hồ sơ GitHub: https://github.com/huyvu2512
3. Tác giả sẽ tiếp nhận, đánh giá mức độ nghiêm trọng và phát hành bản cập nhật vá lỗi trong thời gian sớm nhất.
