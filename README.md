# YouTube Customizer — Phiên bản 2.0

Script Tampermonkey tùy biến YouTube: giao diện tinh gọn, xem video mượt mà, loại bỏ triệt để hiện tượng giật lag, tương thích hoàn toàn với giao diện mới của YouTube. Gồm một file logic chính ([`youtube_customizer.js`](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/youtube_customizer.js)) và wrapper cài đặt ([`tampermonkey.user.js`](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/tampermonkey.user.js)).

---

## Tính năng (v2.0)

### Giao diện & Hiệu năng cao (Zero-Lag)

| Tính năng | Mô tả |
|-----------|--------|
| **Logo Premium** | Thay logo YouTube bằng logo Premium màu đỏ sắc nét. Ẩn mã quốc gia cạnh logo. Tự sửa bằng CSS tức thì, không giật hình (FOUC). |
| **Lưới 4 cột chuẩn mới** | Trang chủ & Kênh đăng ký: hiển thị **4 video/hàng** cân đối trên màn hình ≥ 1024px. Khắc phục lỗi vỡ tỷ lệ thẻ video hoặc lệch layout của YouTube mới. |
| **Ẩn Shorts triệt để** | Sử dụng CSS `:has()` hiện đại để ẩn toàn bộ kệ Shorts ngoài trang chủ/feed/kênh và mục Shorts trên thanh menu bên trái, **không để lại khoảng trống hay khoảng cách vô nghĩa**. |
| **Tắt Ambient Mode** | Tắt hoàn toàn hiệu ứng Cinematics (viền sáng phát sáng xung quanh video), tiết kiệm tài nguyên GPU tối đa. |
| **Lazy render bình luận** | Tự động áp dụng `content-visibility: auto` cho danh sách bình luận giúp tăng tốc cuộn trang khi xem video. |
| **Click logo cuộn lên đầu** | Trên trang chủ & feed: bấm vào logo sẽ cuộn mượt (smooth scroll) lên đầu trang. |
| **Tự động tiếp tục xem** | Tự động bấm xác nhận khi xuất hiện hộp thoại "Vẫn đang xem? / Video đã tạm dừng", phù hợp nghe nhạc playlist/lofi dài. |

### Điều khiển video thông minh

| Phím | Chức năng |
|------|-----------|
| **Numpad 8 / 2** | Tăng / giảm âm lượng 5% |
| **Numpad 4 / 6** | Lùi / tiến 10 giây |
| **Numpad 5** | Play / Pause |
| **A / S / D** | Lùi 10s / Play-Pause / Tiến 10s — chỉ kích hoạt khi chuột trong player hoặc khi Fullscreen |
| **Numpad 1, 3, 7, 9** | Vô hiệu hóa để tránh bấm nhầm |

- **Không lag khi di chuột:** Khác với các script cũ lắng nghe mousemove/mouseover trên toàn bộ trang web, phiên bản 2.0 sử dụng bộ chọn `:hover` native và timer cục bộ, loại bỏ 100% hiện tượng drop FPS khi rê chuột.
- **Tương thích hoàn hảo với bộ gõ tiếng Việt (Unikey / EVKey):** Phím A/S/D bắt theo mã vật lý `e.code` (`KeyA`, `KeyS`, `KeyD`), đồng thời tự động ngắt khi bạn đang gõ ô tìm kiếm, viết bình luận hoặc trò chuyện trực tiếp.
- **Clean Seek:** Khi tua phím, giao diện thanh điều khiển và con trỏ chuột được ẩn gọn gàng, tự hiện lại ngay sau khi dừng tua.

---

## Cài đặt

### Bước 1: Tampermonkey

- PC (Chrome / Edge / Cốc Cốc / Brave / Firefox): [Tampermonkey Extension](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

### Bước 2: Cài script

**Cách A — Cài trực tiếp từ GitHub (sau khi push lên GitHub repo):**

[![Cài đặt Script](https://img.shields.io/badge/CÀI%20ĐẶT-SCRIPT-2ea44f?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js)

**Cách B — Cài đặt cục bộ (Dùng ngay trên máy tính):**

1. Mở tiện ích Tampermonkey trên trình duyệt → Chọn **Tạo script mới** (+).
2. Xóa hết code mẫu có sẵn.
3. Mở file [`tampermonkey.user.js`](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/tampermonkey.user.js), xóa dòng `@require ...`.
4. Sao chép toàn bộ nội dung file [`youtube_customizer.js`](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/youtube_customizer.js) và dán vào dưới metadata của script.
5. Nhấn **File** → **Save** (hoặc Ctrl+S) và tải lại (F5) YouTube.

### Lưu ý về chặn quảng cáo

Phiên bản 2.0 đã gỡ bỏ hoàn toàn module bỏ qua quảng cáo trong script để đảm bảo sự tinh gọn, không xung đột với các bản cập nhật chống adblock của YouTube. Để chặn quảng cáo tốt nhất, bạn nên dùng tiện ích chuyên dụng như **uBlock Origin** hoặc **uBlock Origin Lite**.

---

## Ghi chú nâng cấp (v2.0)

- **Loại bỏ tính năng Ad-skip:** Tối ưu độ nhẹ, không can thiệp vào `playbackRate` hay mute của video.
- **Khắc phục lỗi lag 100%:** Loại bỏ toàn bộ `mouseover` / `mousemove` toàn cục trên `document`.
- **Cập nhật lưới 4 cột:** Phù hợp với cấu trúc container mới của YouTube, chống co kéo thumbnail.
- **Cải tiến ẩn Shorts:** Sử dụng CSS `:has()` triệt tiêu các khoảng trống dư thừa.

---

**Tác giả:** Huy Vũ · **Phiên bản:** 2.0
