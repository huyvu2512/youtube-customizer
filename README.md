<div align="center">

# YouTube Customizer

**Userscript Tampermonkey tùy biến giao diện YouTube, tối ưu hiệu năng và điều khiển video thông minh**

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Userscript-black?logo=tampermonkey&logoColor=white)](https://www.tampermonkey.net/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Version](https://img.shields.io/badge/Version-2.5-red)](https://github.com/huyvu2512/youtube-customizer)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

[![Stars](https://img.shields.io/github/stars/huyvu2512/youtube-customizer?style=flat-square&label=Stars&color=FFCC00)](https://github.com/huyvu2512/youtube-customizer/stargazers)
[![Forks](https://img.shields.io/github/forks/huyvu2512/youtube-customizer?style=flat-square&label=Forks&color=6e7681)](https://github.com/huyvu2512/youtube-customizer/forks)
[![Issues](https://img.shields.io/github/issues/huyvu2512/youtube-customizer?style=flat-square&label=Issues&color=f85149)](https://github.com/huyvu2512/youtube-customizer/issues)
[![Last Commit](https://img.shields.io/github/last-commit/huyvu2512/youtube-customizer?style=flat-square&label=Last%20Commit&color=3fb950)](https://github.com/huyvu2512/youtube-customizer/commits/main)
[![Visitors](https://visitor-badge.laobi.icu/badge?page_id=huyvu2512.youtube-customizer&left_text=Visitors&left_color=6e7681&right_color=00B4C8)](https://github.com/huyvu2512/youtube-customizer)

[Cài Đặt Script](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js) · [Báo Lỗi](https://github.com/huyvu2512/youtube-customizer/issues) · [Yêu Cầu Tính Năng](https://github.com/huyvu2512/youtube-customizer/issues)

</div>

---

## Giới thiệu

**YouTube Customizer** là tiện ích mở rộng dạng Userscript chạy trên nền Tampermonkey, được thiết kế nhằm mang lại trải nghiệm xem YouTube gọn gàng, mượt mà và trực quan hơn.

Phiên bản **v2.5** nâng cấp:
- **Ẩn triệt để Video Hội viên (Ưu tiên & Đặc quyền):** Mở rộng bộ lọc của công tắc "Ẩn video Hội viên" để quét sạch toàn diện cả các video dán nhãn "Ưu tiên hội viên" (Members first / Early access), video đặc quyền hội viên ("Chỉ dành cho hội viên") và các kệ giới thiệu đặc quyền trên trang chủ, kênh đăng ký, trang tìm kiếm và thanh gợi ý xem tiếp.
- **Chuẩn hóa Logo YouTube Premium & Mã quốc gia:**
  - Tách biệt khoảng cách thẩm mỹ chuẩn giữa nút tab điều hướng (`≡` guide menu) và Logo YouTube Premium, khắc phục triệt để lỗi logo bị dính sát vào nút tab.
  - Căn chỉnh mã quốc gia (`#country-code`, ví dụ: VN, US, JP,...) nằm chuẩn xác ở góc trên bên phải của chữ "Premium" theo tỷ lệ gốc của YouTube Premium, loại bỏ hoàn toàn lỗi đè chữ lên nhau.
  - Tự động điều chỉnh màu sắc chữ "Premium" và mã quốc gia theo giao diện Sáng / Tối trong thời gian thực (Zero-reload Realtime Switch) mà không cần F5.
- Kế thừa toàn bộ tối ưu hiệu năng và tính năng của các phiên bản trước (Menu cài đặt chuẩn YouTube, tùy chỉnh 3-4-5 cột, ẩn Shorts & Playables, Clean Search, Zero-Lag Live Chat, Fullscreen Safe Lock, phím tắt A-S-D / Numpad).

---

## Tính năng chính

- **Menu cài đặt nhanh chuẩn giao diện YouTube:**
  - Nút icon bánh răng SVG tinh gọn được gắn trực tiếp trên thanh điều hướng cạnh nút "+ Tạo", tự động phục hồi nếu YouTube nạp lại thanh header khi đăng nhập.
  - Bảng menu dropdown thiết kế tối giản theo chuẩn Dark theme của YouTube, hiển thị ngay dưới nút bấm với phản hồi tức thì (zero-delay) và tự động đóng khi nhấp chuột ra ngoài hoặc nhấn phím `Esc`.
  - Công tắc bật/tắt (toggle switches) mượt mà, phản hồi chính xác khi click cả vào nhãn chữ lẫn nút gạt.
  - Toàn bộ thiết lập được lưu trữ tự động vào `localStorage` và áp dụng thay đổi tức thì (Live Update) mà không cần tải lại trang.
- **Tùy biến lưới video linh hoạt:**
  - Hỗ trợ chuyển đổi nhanh bố cục hiển thị **3 cột**, **4 cột** hoặc **5 cột** trên trang chủ và kênh đăng ký đối với màn hình rộng.
  - Tự động bo góc và cắt gọn thumbnail khi hover, chống lỗi tràn viền hoặc co kéo sai tỉ lệ khung hình.
- **Ẩn hoàn toàn nội dung Shorts & Chơi game (Playables):**
  - **Shorts:** Áp dụng bộ chọn CSS hiện đại `:has()` để triệt tiêu toàn bộ kệ Shorts trên trang chủ, trang đăng ký và mục Shorts trên thanh điều hướng bên trái, không để lại khoảng trắng dư thừa.
  - **Playables:** Tự động ẩn toàn bộ kệ mini-game và mục "Chơi game" trên thanh sidebar và trang chủ.
- **Ẩn video Hội viên & Kệ Khám phá chủ đề khác:**
  - **Video Hội viên:** Tự động ẩn cả video "Ưu tiên hội viên" (Early access) lẫn video "Chỉ dành cho hội viên" và kệ quảng bá gói hội viên ("Hưởng thêm nhiều lợi ích từ hội viên") trên feed, kết quả tìm kiếm và trang xem video.
  - **Khám phá chủ đề:** Triệt tiêu kệ thẻ chip chủ đề ("Khám phá các chủ đề khác") làm rối mắt giữa dòng video chính.
- **Clean Search (Ẩn video tài trợ):**
  - Tự động ẩn các thẻ video quảng cáo và nội dung được tài trợ (`Sponsored`) trong kết quả tìm kiếm và các trang feed.
- **Tối ưu hiệu năng Live Chat & đồ họa:**
  - **Zero-Lag Live Chat:** Áp dụng cơ chế CSS containment (`contain: layout style paint !important`) và lazy-render (`content-visibility: auto`) cho khung chat trực tiếp (`#chat`), loại bỏ hoàn toàn hiện tượng tụt khung hình (FPS drop) khi chat nhảy liên tục mà vẫn giữ nguyên vẹn khung chat.
  - **Giảm tải GPU:** Vô hiệu hóa hiệu ứng sáng viền video (Ambient Mode / Cinematics) giúp tiết kiệm tài nguyên GPU.
  - **Tối ưu bình luận:** Áp dụng cơ chế lazy-render cho danh sách bình luận dưới video.
  - **Zero CPU idle:** Không sử dụng event listener bắt chuột toàn cục (`mouseover`/`mousemove`), không gây tốn pin hay tải CPU lúc rảnh.
- **Khóa an toàn nút phóng to (Fullscreen Safe Lock):**
  - Tự động vô hiệu hóa tạm thời nút phóng to (1.5 giây) khi vừa tải hoặc F5 lại trang video, chống lỗi kẹt giao diện inline/toàn màn hình của trình phát YouTube.
- **Logo YouTube Premium & Mã quốc gia chuẩn xác:**
  - Thay thế logo mặc định bằng biểu tượng YouTube Premium sắc nét với khoảng cách chuẩn so với nút menu tab.
  - Giữ nguyên mã quốc gia (VN, US, JP,...) và hiển thị chuẩn xác ở góc trên bên phải của chữ Premium, không bao giờ bị đè chữ.
  - Tự động thích ứng màu sắc của cả logo lẫn mã quốc gia theo giao diện Sáng / Tối (Light / Dark theme) ngay lập tức khi đổi giao diện mà không cần tải lại trang.
  - Nhấp chuột vào logo ở trang chủ/feed hỗ trợ cuộn mượt (smooth scroll) lên đầu trang.
- **Tự động tiếp tục phát video:**
  - Tự động đóng hộp thoại xác nhận "Vẫn đang xem? / Video đã tạm dừng" để tiếp tục phát nhạc nền hoặc playlist dài.

---

## Điều khiển video bằng bàn phím

| Phím | Chức năng | Điều kiện kích hoạt |
| :--- | :--- | :--- |
| **A / S / D** | Lùi 10s / Play-Pause / Tiến 10s | Chuột nằm trong player hoặc chế độ Fullscreen |
| **Numpad 8 / 2** | Tăng / Giảm âm lượng 5% (chuẩn OSD YouTube) | Toàn cục (khi player đang hoạt động) |
| **Numpad 4 / 6** | Tua lùi / Tua tiến 10 giây | Toàn cục (khi player đang hoạt động) |
| **Numpad 5** | Phát / Tạm dừng video | Toàn cục (khi player đang hoạt động) |
| **Numpad 1, 3, 7, 9** | Vô hiệu hóa (chống nhảy video nhầm lẫn) | Toàn cục |

- **Tương thích bộ gõ tiếng Việt:** Phím A/S/D bắt mã phím vật lý `e.code` (`KeyA`, `KeyS`, `KeyD`), không bị ảnh hưởng bởi Unikey / EVKey.
- **Chống gõ nhầm:** Tự động vô hiệu hóa phím tắt khi người dùng đang nhập văn bản trong ô tìm kiếm, viết bình luận hoặc khung chat trực tiếp.
- **Clean Seek:** Tự động ẩn thanh điều khiển và con trỏ chuột trong quá trình tua video nhằm giữ khung nhìn tập trung và thông thoáng.

---

## Cấu trúc thư mục

```text
youtube-customizer/
├── LICENSE                 # Giấy phép mã nguồn mở MIT License
├── README.md               # Tài liệu hướng dẫn sử dụng và giới thiệu dự án
├── tampermonkey.user.js    # Tệp metadata nạp script cho tiện ích Tampermonkey
└── youtube_customizer.js   # Mã nguồn chính (toàn bộ CSS, giao diện Menu và logic điều khiển)
```

---

## Hướng dẫn cài đặt

### Yêu cầu tiên quyết
Cài đặt tiện ích quản lý Userscript trên trình duyệt của bạn:
- [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) (Khuyên dùng cho Chrome, Edge, Cốc Cốc, Brave, Firefox, Opera)

### Cách 1: Cài đặt trực tiếp từ GitHub (Khuyên dùng)

[![Cài đặt Script](https://img.shields.io/badge/CÀI%20ĐẶT-SCRIPT-2ea44f?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js)

1. Nhấp vào nút **CÀI ĐẶT SCRIPT** ở trên (hoặc mở [liên kết tệp script](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js)).
2. Tiện ích Tampermonkey sẽ tự động mở giao diện cài đặt, chọn **Install** (hoặc **Update** nếu đã cài bản cũ).
3. Mở YouTube hoặc tải lại trang (F5) để bắt đầu sử dụng.

### Cách 2: Cài đặt thủ công bằng mã nguồn cục bộ

1. Mở bảng điều khiển Tampermonkey trên trình duyệt, chọn **Tạo script mới** (`+`).
2. Xóa toàn bộ nội dung mẫu có sẵn.
3. Mở tệp [`tampermonkey.user.js`](./tampermonkey.user.js), xóa dòng `@require ...`.
4. Sao chép toàn bộ nội dung từ tệp [`youtube_customizer.js`](./youtube_customizer.js) và dán tiếp nối vào bên dưới phần header metadata.
5. Chọn **File** → **Save** (hoặc nhấn tổ hợp phím `Ctrl + S`), sau đó tải lại YouTube.

---

## Tác giả & Giấy phép

- **Tác giả:** Huy Vũ ([@huyvu2512](https://github.com/huyvu2512))
- **Giấy phép:** Dự án được phân phối theo giấy phép [MIT License](./LICENSE).
