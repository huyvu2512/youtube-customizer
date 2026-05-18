# 🛠️ YouTube Customizer: All-in-One

Script Tampermonkey mạnh mẽ giúp tùy biến giao diện YouTube, tối ưu hóa trải nghiệm xem video và sửa các lỗi khó chịu thường gặp. Một công cụ "tất cả trong một" dành cho người dùng YouTube.

## ✨ Tính năng nổi bật

### 🎨 Giao diện & Hiển thị
* **Logo Premium chuẩn:** Tự động thay thế logo mặc định thành logo **YouTube Premium**. Sử dụng công nghệ ẩn logo gốc và hiệu ứng fade-in mượt mà, đảm bảo không bị nháy logo cũ khi tải trang.
* **Lưới 4 Cột:** Cưỡng chế giao diện trang chủ hiển thị **4 video trên một hàng** (thay vì giao diện lộn xộn mặc định), giúp danh sách video gọn gàng và dễ nhìn hơn.
* **Click Logo:** Khi ấn vào Logo: Trang tự động cuộn mượt màng lên vị trí đầu tiên (Top 0).
    
### ⏩ Điều khiển & Trải nghiệm
* **Tua & Điều khiển (Hỗ trợ 2 tay):**
    * Dành cho tay phải (**Numpad**):
        * **Numpad 8 / 2**: Tăng / Giảm âm lượng.
        * **Numpad 4 / 6**: Lùi / Tiến 10 giây.
        * **Numpad 5**: Dừng / Phát video.
        * **Numpad 1, 3, 7, 9**: Đã được vô hiệu hóa để tránh bấm nhầm.
    * Dành cho tay trái (**Phím chữ A-S-D**):
        * Phím **A**: Lùi lại 10 giây.
        * Phím **S**: Dừng / Phát video.
        * Phím **D**: Tiến tới 10 giây.
    * *Tính năng thông minh:* Tự động vô hiệu hóa phím tắt khi bạn đang gõ bình luận hoặc tìm kiếm để không bị loạn chữ. Nhận diện phím Numpad kể cả khi bạn quên bật Num Lock.
* **Giao diện tua "Sạch" (Clean Seek):** 
    * Khi bạn tua video, thanh điều khiển bên dưới (Play/Pause, thanh thời gian) và các nút Like/Share rườm rà sẽ tự động ẩn đi, chỉ hiển thị vòng tròn thông báo số giây (+-10s) nguyên bản.
    * Ẩn chuột thông minh: Con trỏ chuột sẽ biến mất khi bạn đang tua để không che khuất nội dung, và hiện lại ngay lập tức khi bạn di chuyển chuột.

### 🛡️ Tối ưu Hiệu năng & Chống Lag (Zero-Overhead)
* **Công nghệ Zero-Overhead (Phiên bản 1.7):** Loại bỏ hoàn toàn các vòng lặp kiểm tra gây nặng máy. Thay vào đó, script sử dụng công nghệ `CSS Animation Event` cực nhẹ, chỉ chạy đúng lúc cần thiết. Máy tính của bạn sẽ không tốn một giọt RAM/CPU nào để duy trì script!
* **Chống Lag - Tắt Ambient Mode:** Ép tắt hiệu ứng "Ánh sáng môi trường" (hiệu ứng viền phát sáng) của YouTube, giúp giải phóng Card màn hình (GPU), giảm giật lag triệt để trên laptop và máy tính cấu hình yếu.
* **Lazy Render (Cuộn trang siêu mượt):** Can thiệp sâu vào CSS (`content-visibility`) để ép trình duyệt không tải và không vẽ các bình luận / video đề xuất ở dưới trừ khi bạn cuộn tới. Cuộn YouTube giờ đây mượt như bôi mỡ!
* **Bỏ qua quảng cáo tàng hình (Super Optimized):** Tự động phát hiện và ẩn quảng cáo/cảnh báo Adblock ngay lập tức bằng màn hình tối với thông báo "Đang bỏ qua quảng cáo...". Bạn sẽ không bao giờ phải thấy nội dung quảng cáo dù chỉ là thoáng qua.
* **Dọn dẹp thông báo rác & YouTube Shorts:** Tự động ẩn hoàn toàn các bảng thông báo "Bạn đang gặp sự cố gián đoạn?", gợi ý Premium, khảo sát và các thông báo đẩy gây phiền nhiễu. Đặc biệt, **ẩn hoàn toàn mục YouTube Shorts** để tránh gây xao nhãng khi làm việc/học tập.

---

## 📥 Hướng dẫn cài đặt

### Bước 1: Cài đặt tiện ích nền
Trước tiên, bạn cần cài đặt tiện ích quản lý script **Tampermonkey** cho trình duyệt của mình:
* 💻 **Cho PC (Chrome/Edge/CốcCốc):** [Tải Tampermonkey tại đây](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
* 📱 **Cho Mobile (Android/Yandex):** [Tải Tampermonkey Legacy](https://chromewebstore.google.com/detail/tampermonkey-legacy/lcmhijbkigalmkeommnijlpobloojgfn)

### Bước 2: Cài đặt Script
Sau khi đã có Tampermonkey, hãy nhấn vào nút dưới đây để cài đặt script tự động:

[![Cài đặt Script](https://img.shields.io/badge/CÀI%20ĐẶT-SCRIPT-2ea44f?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js)

*(Nhấn nút **Install** hoặc **Cài đặt** khi tab mới hiện ra)*

### Bước 3: Chặn quảng cáo (Khuyên dùng)
Script này tập trung vào giao diện và tính năng. Để chặn quảng cáo sạch sẽ và hiệu quả nhất, bạn hãy cài đặt thêm tiện ích **uBlock Origin Lite**:

[![Tải uBlock Origin Lite](https://img.shields.io/badge/Tải%20uBlock-Origin%20Lite-drkred?style=for-the-badge&logo=ublockorigin)](https://chromewebstore.google.com/detail/ublock-origin-lite/ddkjiahejlhfcafbddmgiahcphecmpfh?hl=vi)

### Bước 4: Tận hưởng
Truy cập [YouTube](https://www.youtube.com/), tải lại trang (F5) và tận hưởng giao diện mới! 🎉

---
**Lưu ý:** Nếu script không hoạt động, hãy thử tải lại trang hoặc kiểm tra xem Tampermonkey đã được bật chưa nhé.

