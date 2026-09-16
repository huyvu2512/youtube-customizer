# YouTube Customizer — Phiên bản 2.1

Script Tampermonkey tùy biến YouTube chuyên sâu: giao diện tinh gọn, menu cài đặt trực quan chuẩn phong cách YouTube, loại bỏ triệt để hiện tượng giật lag, tương thích hoàn toàn với giao diện mới nhất của YouTube.

Dự án gồm một file logic chính ([`youtube_customizer.js`](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/youtube_customizer.js)) và wrapper cài đặt ([`tampermonkey.user.js`](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/tampermonkey.user.js)).

---

## Tính năng nổi bật (v2.1)

### ⚙️ Menu Cài Đặt Nhanh (Native YouTube Style)
- **Vị trí tinh tế:** Nút icon bánh răng SVG được đặt ngay cạnh nút **"+ Tạo"** ở thanh trên cùng (Topbar).
- **Giao diện chuẩn YouTube:** Thiết kế phong cách Dark theme tối giản, đồng bộ với menu tài khoản của YouTube, không màu mè rườm rà.
- **Thao tác nhanh:** Bấm vào để mở, bấm ra ngoài hoặc nhấn `Esc` để đóng.
- **Lưu cấu hình tự động:** Tự động lưu lựa chọn vào `localStorage`, cập nhật hiệu lực ngay tức thì (Live Update) mà không cần tải lại trang.

### 🎛️ Bảng tính năng có thể bật / tắt trong Menu

| Tính năng | Mô tả |
|-----------|--------|
| **Tùy chọn số cột trang chủ** | Chọn hiển thị **3 cột**, **4 cột** hoặc **5 cột** video trên màn hình rộng theo sở thích. |
| **Ẩn mục Shorts** | Sử dụng CSS `:has()` hiện đại để ẩn sạch toàn bộ kệ Shorts và menu Shorts bên trái, **không để lại khoảng trắng**. |
| **Logo Premium** | Đổi logo YouTube sang logo YouTube Premium màu đỏ sắc nét, ẩn mã quốc gia. |
| **Clean Search (Ẩn video tài trợ)** | Ẩn triệt để các video quảng cáo/được tài trợ (`Sponsored`, `ytd-ad-slot-renderer`) trong trang tìm kiếm và feeds. |
| **Tắt Ambient Mode** | Tắt hiệu ứng viền sáng phát sáng xung quanh video (Cinematics), giải phóng tài nguyên GPU. |
| **Phím tắt điều khiển video** | Bật / tắt hệ thống phím tắt A-S-D và Numpad. |

---

### ⌨️ Điều khiển video thông minh (A-S-D & Numpad)

| Phím | Chức năng |
|------|-----------|
| **Numpad 8 / 2** | Tăng / giảm âm lượng 5% |
| **Numpad 4 / 6** | Lùi / tiến 10 giây |
| **Numpad 5** | Play / Pause |
| **A / S / D** | Lùi 10s / Play-Pause / Tiến 10s — chỉ kích hoạt khi chuột trong player hoặc Fullscreen |
| **Numpad 1, 3, 7, 9** | Vô hiệu hóa để tránh bấm nhầm |

- **Zero-Lag:** Sử dụng bộ chọn native `:hover`, loại bỏ 100% hiện tượng drop FPS khi rê chuột.
- **Tương thích Unikey / EVKey:** Đọc mã phím vật lý `e.code` (`KeyA`, `KeyS`, `KeyD`), tự động vô hiệu khi đang nhập văn bản trong ô tìm kiếm hoặc khung bình luận.
- **Clean Seek:** Tự động ẩn thanh điều khiển và con trỏ chuột khi tua phím để màn hình thông thoáng.

---

## Cài đặt

### Bước 1: Tampermonkey

- PC (Chrome / Edge / Cốc Cốc / Brave / Firefox): [Tampermonkey Extension](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

### Bước 2: Cài script

**Cách A — Cài trực tiếp từ GitHub (khuyên dùng):**

[![Cài đặt Script](https://img.shields.io/badge/CÀI%20ĐẶT-SCRIPT-2ea44f?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js)

**Cách B — Cài đặt cục bộ (Dùng trực tiếp code):**

1. Mở tiện ích Tampermonkey trên trình duyệt → Chọn **Tạo script mới** (+).
2. Xóa hết code mẫu có sẵn.
3. Mở file [`tampermonkey.user.js`](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/tampermonkey.user.js), xóa dòng `@require ...`.
4. Sao chép toàn bộ nội dung file [`youtube_customizer.js`](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/youtube_customizer.js) và dán vào dưới metadata của script.
5. Nhấn **File** → **Save** (hoặc Ctrl+S) và F5 lại trang YouTube.

---

**Tác giả:** Huy Vũ · **Phiên bản:** 2.1
