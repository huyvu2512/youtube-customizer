<div align="center">

# YouTube Customizer

**Userscript Tampermonkey tùy biến giao diện YouTube, tối ưu hiệu năng và điều khiển video thông minh**

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Userscript-black)](https://www.tampermonkey.net/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Version](https://img.shields.io/badge/Version-2.9.5-red)](https://github.com/huyvu2512/youtube-customizer)
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

Phiên bản **v2.9.5** nâng cấp:
- **Tối ưu phân nhóm menu cài đặt:**
  - Chuyển tính năng **Ẩn Khám phá chủ đề** sang mục **Lọc** (cùng nhóm các tính năng lọc và dọn dẹp nội dung).
  - Chuyển tính năng **Mở khóa tua Live Stream** (Live DVR) và **Live Chat** (Danmaku / Streamer Box) sang mục **Giao diện** (cùng nhóm tinh chỉnh hiển thị trực quan).
- **Triệt tiêu toàn diện lỗi phím Numpad (Chống nhảy % video & chống Home/End/PageUp/PageDown):** Chặn độc lập 100% tất cả các phím Numpad (ở cả 2 tầng sự kiện `keydown` và `keyup`), không phụ thuộc vào trạng thái tải của player. Khắc phục triệt để hiện tượng ấn 1, 7 nhảy đầu/cuối video, 3, 9 cuộn trang khi tắt NumLock và 1-9 nhảy % video khi bật NumLock.
- **Tự động đóng banner & thông báo gián đoạn:** Tự động phát hiện và đóng/ẩn ngay lập tức các thông báo toast gây phiền toái như *"Bạn đang gặp sự cố gây gián đoạn?"* (*"Experiencing interruptions? Find out why"*), banner mời dùng thử Premium, khảo sát và popup phiền phức trên giao diện xem video.
- **Chuẩn hóa phím tắt Numpad & A-S-D / J-K-L:**
  - Numpad 4 / 6: Tua lùi / Tua tiến 10 giây.
  - Numpad 8 / 2: Tăng / Giảm âm lượng (chuẩn OSD YouTube).
  - Numpad 5: Tạm dừng / Phát tiếp video.
  - A / D hoặc J / L: Tua lùi / Tua tiến 10 giây.
  - S hoặc K: Tạm dừng / Phát tiếp video.
  - Chặn triệt để toàn bộ các phím Numpad khác (0, 1, 3, 7, 9, dấu chấm, +, -, *, /, Enter) không cho YouTube nhận diện phím số 1-9 nhảy % video khi bật NumLock.
- **Tooltip hướng dẫn trực quan:** Tích hợp mô tả tính năng ngắn gọn, đúng trọng tâm hiển thị qua khung tooltip mặc định của trình duyệt khi di chuột vào từng mục trong bảng cài đặt.
- **Tối ưu hóa Live Chat:** Đổi tên hiển thị thành **Live Chat**, mặc định áp dụng tính năng tự động ẩn khi tua lùi video và loại bỏ tùy chọn thừa trong menu.
- **Live Chat Overlay trên Video (Danmaku & Khung Streamer):** Hiển thị luồng chat trực tiếp hoặc replay nổi ngay trên video player với 2 chế độ tùy chọn:
  - **Chạy ngang (Danmaku / Bullet Chat):** Tin nhắn lướt ngang màn hình từ phải sang trái theo từng làn, phân biệt màu sắc Mod (xanh dương) và Hội viên (xanh lá).
  - **Khung nổi Streamer trong suốt:** Khung chat không nền giống trên luồng phát của streamer, có thể kéo thả di chuyển vị trí và co giãn kích thước tùy ý, hiển thị avatar/logo và huy hiệu.
  - **Tự động ẩn khi tua lùi:** Tự động ẩn chat khi người xem tua video về quá khứ và tự động hiện lại khi quay về mốc Trực tiếp.
- **Mở khóa tua Live Stream (Force Enable Live DVR):** Tự động khôi phục thanh trượt tua lại (Seekbar scrubber) trên các luồng phát trực tiếp (YouTube Live) mà chủ kênh tắt tính năng tua, cho phép xem lại các diễn biến vừa diễn ra mà không bị khóa cứng ở mốc thời gian thực (Real-time).
- **Ẩn logo hình mờ (Watermark) ở góc video:** Tự động xóa bỏ hoàn toàn biểu tượng/avatar của kênh hiển thị ở góc dưới cùng bên phải của trình phát video (`.iv-branding`, `.ytp-iv-video-content .iv-branding`, `.ytp-branding-logo`), giúp khung hình video hoàn toàn thông thoáng.
- **Tối giản hóa kiến trúc mã nguồn:** Toàn bộ mã nguồn phát triển trong `src/` được tổ chức tinh gọn thành 4 tệp chuyên biệt, build tự động siêu tốc bằng `esbuild`.
- **Phân nhóm cài đặt trong Menu theo 4 Tab:** Bảng cài đặt 4 danh mục trực quan gồm **Giao diện**, **Lọc nội dung**, **Trình phát** và **Phím tắt**.
- **Kế thừa các tối ưu cốt lõi:** Ẩn thẻ kết thúc (Endscreen Cards) & chú thích (Info Cards), ẩn bài đăng cộng đồng trên feed, tự đóng banner quảng cáo/hội viên, cố định số cột 3-4-5 không bị hoàn tác khi F5, sửa triệt để logo Premium kèm mã quốc gia chuẩn xác, ẩn Shorts/Playables/Hội viên/Khám phá chủ đề, Clean Search và phím tắt A-S-D / Numpad.

---

## Tính năng chính

- **Menu cài đặt phân nhóm 4 Tab hiện đại:**
  - **Giao diện:** Tùy chọn số cột trang chủ (3, 4, 5 cột), Bật/tắt Logo YouTube Premium, Mở khóa tua Live Stream (Live DVR), Live Chat (Tắt / Ngang / Nổi - tự động ẩn khi tua lùi).
  - **Lọc nội dung:** Ẩn Shorts hoàn toàn, Ẩn Chơi game (Playables), Ẩn video Hội viên (Ưu tiên & Đặc quyền), Ẩn bài đăng cộng đồng, Lọc tìm kiếm sạch (Clean Search), Ẩn Khám phá các chủ đề khác.
  - **Trình phát:** Tắt ánh sáng viền video (Ambient Mode / Cinematics), Ẩn thẻ kết thúc & thẻ chú thích video, Ẩn logo góc video (Watermark), Tự động đóng banner quảng cáo/thông báo.
  - **Phím tắt:** Bật/tắt phím tắt A-S-D & Numpad kèm bảng tra cứu phím tắt nhanh ngay trong menu.
  - Toàn bộ thiết lập được lưu tự động vào `localStorage` và cập nhật tức thì (Live Update) mà không cần tải lại trang.
- **Live Chat Overlay trên Video (Danmaku & Streamer Box):**
  - Hỗ trợ 2 chế độ hiển thị: Chạy ngang (Danmaku) và Khung nổi Streamer trong suốt (hỗ trợ kéo thả chuột và co giãn kích thước đặt ở mọi góc video).
  - Phân biệt màu sắc rõ ràng: Mod màu xanh dương, Hội viên màu xanh lá, Chủ kênh màu vàng, người thường màu trắng; phông chữ có viền bóng đậm nét chống chói trên mọi khung cảnh video.
  - Tự động ẩn khi tua video về quá khứ và hiện lại khi quay về mốc thời gian thực.
  - Hỗ trợ cho cả phiên Live đang phát trực tiếp lẫn video đã kết thúc có Chat Replay.
- **Mở khóa tua Live Stream (Force Enable Live DVR):**
  - Can thiệp an toàn vào dữ liệu khởi tạo luồng stream (`isLiveDvrEnabled: true`), phục hồi thanh tua thời gian cho các buổi phát trực tiếp bị người phát khóa tính năng tua lùi.
- **Ẩn logo hình mờ kênh ở góc video (Clean Video Watermark):**
  - Tự động ẩn biểu tượng logo hoặc ảnh đại diện kênh xuất hiện ở góc dưới cùng bên phải trình phát video.
- **Ẩn thẻ kết thúc & Chú thích video (Clean Endscreen):**
  - Vô hiệu hóa triệt để các khung gợi ý video đè lên phần outro (`.ytp-ce-element`, `.ytp-ce-covering-image`, `.ytp-ce-element-shadow`).
  - Ẩn nút thẻ chú thích góc trên bên phải player (`.ytp-cards-button`) và thanh thông báo teaser (`.ytp-cards-teaser`).
- **Ẩn Bài đăng cộng đồng trên Trang chủ:**
  - Tự động phát hiện và triệt tiêu các bài đăng cộng đồng (kèm khảo sát, hình ảnh) dạng `ytd-post-renderer`, `ytd-backstage-post-thread-renderer` và kệ cộng đồng `ytd-rich-shelf-renderer` trên feed.
- **Tự động đóng Banner thông báo phiền toái:**
  - Tự động kích hoạt nút đóng (`#dismiss-button`) trên các banner mealbar promo (`ytd-mealbar-promo-renderer`), banner dùng thử Premium, popup khảo sát.
- **Tùy biến lưới video linh hoạt:**
  - Hỗ trợ chuyển đổi nhanh bố cục hiển thị **3 cột**, **4 cột** hoặc **5 cột** trên trang chủ và kênh đăng ký, giữ cố định vĩnh viễn ngay cả khi F5 tải lại trang.
- **Ẩn hoàn toàn nội dung Shorts & Chơi game (Playables):**
  - Ẩn triệt để kệ Shorts, Playables trên trang chủ, trang đăng ký và thanh điều hướng bên trái.
- **Ẩn video Hội viên & Kệ Khám phá chủ đề khác:**
  - Ẩn cả video "Ưu tiên hội viên" (Early access) lẫn video "Chỉ dành cho hội viên" và kệ quảng bá gói hội viên.
- **Clean Search (Ẩn video tài trợ):**
  - Tự động ẩn các thẻ video quảng cáo và nội dung được tài trợ (`Sponsored`).
- **Tối ưu hiệu năng Live Chat & đồ họa:**
  - **Zero-Lag Live Chat:** Áp dụng CSS containment và lazy-render loại bỏ giật lag khung chat.
  - **Giảm tải GPU:** Tắt hiệu ứng Ambient Mode (Cinematics) giúp tiết kiệm tài nguyên máy tính.
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

Dự án được tổ chức theo kiến trúc module hóa:

```text
youtube-customizer/
├── package.json            # Cấu hình dự án và lệnh build
├── scripts/
│   └── build.js            # Script đóng gói bằng esbuild
├── src/
│   ├── index.js            # Khởi tạo và điều phối vòng đời
│   ├── styles.css          # Định kiểu CSS toàn bộ giao diện
│   ├── features.js         # Tập hợp toàn bộ tính năng
│   └── ui.js               # Biểu tượng và menu 4 tab
├── LICENSE                 # Giấy phép nguồn mở MIT
├── README.md               # Tài liệu hướng dẫn sử dụng
├── tampermonkey.user.js    # Header nạp Tampermonkey
└── youtube_customizer.js   # Bundle phân phối chính
```

### Lệnh phát triển

- **Cài đặt thư viện phát triển:** `npm install`
- **Đóng gói mã nguồn:** `npm run build` (tạo tệp `youtube_customizer.js`)
- **Chế độ theo dõi tự động (Watch mode):** `npm run dev` (tự động build lại ngay khi lưu tệp trong `src/`)

---

## Hướng dẫn cài đặt

### Yêu cầu tiên quyết
Cài đặt tiện ích quản lý Userscript trên trình duyệt của bạn:
- [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) (Khuyên dùng cho Chrome, Edge, Cốc Cốc, Brave, Firefox, Opera)

### Cách 1: Cài đặt trực tiếp từ GitHub (Khuyên dùng)

[![Cài đặt Script](https://img.shields.io/badge/CÀI%20ĐẶT-SCRIPT-2ea44f?style=for-the-badge)](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js)

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
