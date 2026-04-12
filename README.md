# 🛠️ YouTube Customizer: All-in-One

Script Tampermonkey mạnh mẽ giúp tùy biến giao diện YouTube, tối ưu hóa trải nghiệm xem video và sửa các lỗi khó chịu thường gặp. Một công cụ "tất cả trong một" dành cho người dùng YouTube.

## ✨ Tính năng nổi bật

### 🎨 Giao diện & Hiển thị
* **Logo Premium:** Tự động thay thế logo mặc định thành logo **YouTube Premium**.
* **Lưới 4 Cột:** Cưỡng chế giao diện trang chủ hiển thị **4 video trên một hàng** (thay vì giao diện lộn xộn mặc định), giúp danh sách video gọn gàng và dễ nhìn hơn.
* **Click Logo & Tìm kiếm lên đầu trang:** 
    * Khi ấn vào Logo: Trang tự động cuộn mượt mà lên vị trí đầu tiên (Top 0).
    * Khi ấn nút Tìm kiếm (🔍): Trang cũng tự động cuộn lên đầu, giúp bạn xem kết quả tìm kiếm thuận tiện nhất mà không cần kéo chuột thủ công.
    
### ⏩ Điều khiển & Trải nghiệm
* **Tua & Điều khiển bằng Numpad (Bàn phím số):**
    * Phím **Numpad 8 / 2**: Tăng / Giảm âm lượng.
    * Phím **Numpad 4 / 6**: Lùi / Tiến 10 giây.
    * Phím **Numpad 5**: Dừng / Phát video.
    * Phím **Numpad 1, 3, 7, 9**: Đã được vô hiệu hóa để tránh trường hợp bấm nhầm làm nhảy video.
    * *Tính năng thông minh:* Tự động nhận diện phím kể cả khi tắt Num Lock. Chặn hoàn toàn lỗi bị nhảy video khi dùng phím số. Tự động vô hiệu hóa khi bạn đang gõ bình luận hoặc tìm kiếm.
* **Giao diện tua "Sạch" (Clean Seek):** 
    * Khi bạn tua video, thanh điều khiển bên dưới (Play/Pause, thanh thời gian) và các nút Like/Share rườm rà sẽ tự động ẩn đi, chỉ hiển thị vòng tròn thông báo số giây (+-10s) nguyên bản.
    * Ẩn chuột thông minh: Con trỏ chuột sẽ biến mất khi bạn đang tua để không che khuất nội dung, và hiện lại ngay lập tức khi bạn di chuyển chuột.

### 🛡️ Sửa lỗi & Bảo vệ (Fix Lag)
* **Tự động bỏ qua quảng cáo (Aggressive Skip):** Tự động phát hiện quảng cáo, tăng tốc độ video lên 16 lần và nhấn "Bỏ qua" ngay lập tức để quảng cáo trôi qua trong < 1 giây. Đồng thời tự động ẩn các banner quảng cáo đè lên video.
* **Auto-ESC (Chống lỗi Zoom):** Khi mạng lag hoặc trang chưa tải xong, nếu bạn ấn phóng to (Fullscreen) thường sẽ bị lỗi màn hình đen hoặc video bị nhỏ. Script sẽ phát hiện và **tự động thoát toàn màn hình** ngay lập tức để bạn không bị kẹt ở giao diện lỗi.
* **Tự động nhấn "Tiếp tục xem":** Tự động nhấn "Có" khi YouTube hiện thông báo "Video đã tạm dừng. Tiếp tục xem?" do treo tab quá lâu, giúp trải nghiệm nghe nhạc hoặc xem video liên tục không bị gián đoạn.
* **Ổn định giao diện:** Ngăn chặn các thành phần rác (như thanh Like/Share nổi, Popup đề xuất) che khuất nội dung khi đang tua video.

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

