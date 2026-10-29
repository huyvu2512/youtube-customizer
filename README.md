<div align="center">

# YouTube Customizer

**Userscript tùy biến giao diện YouTube, tối ưu hiệu năng và điều khiển video thông minh**

[Tiếng Việt](README.md) · [English](README_EN.md)

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Userscript-black)](https://www.tampermonkey.net/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Vanilla%20Dark-1572B6)](https://www.w3.org/Style/CSS/)
[![Version](https://img.shields.io/badge/Version-3.9.33-red)](https://github.com/huyvu2512/youtube-customizer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[![Stars](https://img.shields.io/github/stars/huyvu2512/youtube-customizer?style=flat-square&label=Stars&color=FFCC00)](https://github.com/huyvu2512/youtube-customizer/stargazers)
[![Forks](https://img.shields.io/github/forks/huyvu2512/youtube-customizer?style=flat-square&label=Forks&color=6e7681)](https://github.com/huyvu2512/youtube-customizer/forks)
[![Issues](https://img.shields.io/github/issues/huyvu2512/youtube-customizer?style=flat-square&label=Issues&color=f85149)](https://github.com/huyvu2512/youtube-customizer/issues)
[![Last Commit](https://img.shields.io/github/last-commit/huyvu2512/youtube-customizer?style=flat-square&label=Last%20Commit&color=3fb950)](https://github.com/huyvu2512/youtube-customizer/commits/main)
![Visitors](https://visitor-badge.laobi.icu/badge?page_id=huyvu2512.youtube-customizer&left_text=Visitors&left_color=6e7681&right_color=FF0000)

[Cài Đặt Script](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js) · [Lịch sử thay đổi](CHANGELOG.md) · [Báo Lỗi](https://github.com/huyvu2512/youtube-customizer/issues) · [Yêu Cầu Tính Năng](https://github.com/huyvu2512/youtube-customizer/issues)

</div>

---

<div align="center">
  <img src="assets/preview.png" alt="Giao diện YouTube Customizer" width="480">
</div>

---

## Giới thiệu

**YouTube Customizer** là tiện ích mở rộng dạng Userscript chạy trên nền Tampermonkey / Violentmonkey, được thiết kế nhằm mang lại trải nghiệm xem YouTube gọn gàng, mượt mà và trực quan hơn. Sản phẩm được thiết kế và phát triển bởi Huy Vũ (@huyvu2512) với mục tiêu nghiên cứu chuyên sâu về cơ chế can thiệp DOM (DOM Manipulation), tối ưu hóa hiệu năng render trình phát và điều khiển tương tác trên nền tảng YouTube.

Phiên bản **v3.9.33** áp chất lượng ban đầu rồi cho phép đổi thủ công trong YouTube. Xem [CHANGELOG.md](CHANGELOG.md) để biết chi tiết.

---

## Tính năng chính

- **Ánh sáng phòng (Ambilight)** - Tạo ánh sáng nền theo khung hình trên trang xem video thông thường. Tính năng mặc định tắt và không áp dụng trên Shorts.
- **Bảng cài đặt 5 tab** - Quản lý giao diện, bộ lọc, trình phát, tối ưu và thông tin; hỗ trợ chọn giao diện bằng tiếng Việt, tiếng Anh và các ngôn ngữ khác.
- **Ngôn ngữ giao diện** - Có 20 ngôn ngữ và chế độ tự động.
- **Tùy chỉnh lưới video** - Chọn 3, 4 hoặc 5 cột cho trang chủ và trang kênh.
- **Lọc nội dung** - Có thể ẩn Shorts, Playables, video hội viên, bài đăng cộng đồng, chủ đề khám phá, Mix/playlist, sản phẩm gắn thẻ và kết quả tìm kiếm được tài trợ.
- **Tùy chỉnh trình phát** - Có tùy chọn ẩn watermark, thẻ kết thúc và chú thích; đóng banner hoặc thông báo; ẩn khung chat gốc và biểu tượng trong Live Chat.
- **Công cụ phát trực tiếp** - Mở khóa tua Live DVR và đồng bộ về thời gian thực bằng Auto Live Sync.
- **Live Chat Overlay** - Hiển thị tin nhắn dạng chạy ngang (Danmaku) hoặc trong khung nổi (Streamer). Mặc định tắt.
- **Ưu tiên độ phân giải** - Chọn Tự động, Cao nhất, 1440p, 1080p hoặc 720p. Chất lượng cuối cùng còn phụ thuộc video và khả năng phát của YouTube.
- **Tùy chọn tối ưu** - Chế độ chỉ phát âm thanh hạ chất lượng xuống mức thấp nhất; các tùy chọn khác có thể chặn AV1, dọn DOM Live Chat hoặc đóng hộp thoại hỏi tiếp tục xem. Các tùy chọn này mặc định tắt.
- **Thông số phát video** - Bảng cài đặt có thể hiển thị FPS, thời lượng buffer, độ trễ phản hồi HTTP tới YouTube và tốc độ tải ước tính.
- **Phím tắt** - Khi bật, A/D tua lùi/tiến và S phát/tạm dừng khi con trỏ ở trên trình phát hoặc đang toàn màn hình; Numpad 4/6 tua 10 giây mỗi nhịp khi giữ phím, 5 phát/tạm dừng, 8/2 chỉnh âm lượng.
- **Khóa thời gian đã phát** - Chuẩn hóa hiển thị thời gian đã xem trên video thường; không áp dụng cho livestream.

---

## Công nghệ

| Thành phần | Công nghệ |
| :--- | :--- |
| Nền tảng | Userscript (Tampermonkey, Violentmonkey) |
| Ngôn ngữ | Vanilla JavaScript (ES6+, IIFE Bundle) |
| Kiểu dáng | Vanilla CSS3 |
| Đóng gói & Xây dựng | Node.js, esbuild |
| Xử lý DOM | Trusted Types và các hàm hỗ trợ chèn nội dung an toàn |
| Trình duyệt hỗ trợ | Các trình duyệt có hỗ trợ Tampermonkey hoặc userscript manager tương thích |

---

## Cấu trúc thư mục

`src` chứa mã nguồn được chia theo chức năng. `youtube_customizer.js` là bundle tạo bởi lệnh build.

```text
 youtube-customizer/
 ├── assets/preview.png
 ├── CHANGELOG.md
 ├── scripts/build.js
 ├── src/
 │   ├── chat.js              # Xuất các module chat
 │   ├── features.js          # Xuất các module tính năng và trình phát
 │   ├── ui.js                # Xuất các module giao diện
 │   ├── chat/                 # Live Chat Overlay
 │   ├── core/                 # Cấu hình, hằng số, đa ngôn ngữ và tiện ích
 │   ├── features/             # Bộ lọc, lưới video và quản lý chất lượng
 │   ├── optimization/         # Chế độ âm thanh, codec, chat GC và tự dừng
 │   ├── player/               # Ambilight và điều khiển trình phát
 │   ├── ui/                   # Bảng cài đặt và đo thông số
 │   ├── index.js
 │   └── styles.css
 ├── package.json
 ├── tampermonkey.user.js
 ├── youtube_customizer.js
 ├── README.md
 ├── README_EN.md
 ├── SECURITY.md
 └── LICENSE
```

### Đóng gói mã nguồn (Dành cho lập trình viên)

- Cài đặt thư viện: `npm install`
- Build bundle: `npm run build`
- Theo dõi và build khi source thay đổi: `npm run dev`

---

## Điều khiển video bằng bàn phím

| Phím | Chức năng | Điều kiện kích hoạt |
| :--- | :--- | :--- |
| **A / D** | Tua lùi / Tua tiến 10 giây | Chuột nằm trong player hoặc chế độ Fullscreen |
| **S** | Tạm dừng / Phát tiếp video | Chuột nằm trong player hoặc chế độ Fullscreen |
| **Numpad 4 / 6** | Tua lùi / Tua tiến 10 giây | Toàn cục (khi player đang hoạt động) |
| **Numpad 5** | Tạm dừng / Phát tiếp video | Toàn cục (khi player đang hoạt động) |
| **Numpad 8 / 2** | Tăng / Giảm âm lượng 5% | Toàn cục (hỗ trợ nhấn giữ phím) |
| **Numpad 1, 3, 7, 9** | Vô hiệu hóa (chống nhảy % video) | Toàn cục |

- **Tương thích bộ gõ tiếng Việt:** Phím A/S/D bắt mã phím vật lý `e.code` (`KeyA`, `KeyS`, `KeyD`), hoàn toàn không bị ảnh hưởng bởi Unikey / EVKey.
- **Chống gõ nhầm:** Tự động vô hiệu hóa phím tắt khi người dùng đang nhập văn bản trong ô tìm kiếm, viết bình luận hoặc khung chat trực tiếp.

---

## Hướng dẫn cài đặt Userscript

### Bước 1: Cài đặt tiện ích Tampermonkey

Cài đặt Tampermonkey từ cửa hàng tiện ích của trình duyệt:

[![Tải Tampermonkey](https://img.shields.io/badge/TẢI%20TIỆN%20ÍCH-TAMPERMONKEY-black?style=for-the-badge)](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

> Dùng trình duyệt có hỗ trợ Tampermonkey hoặc userscript manager tương thích.

---

### Bước 2: Bật "Cho phép tập lệnh của người dùng" (Bắt buộc trên Chrome / Chromium)

Trên các trình duyệt nhân Chromium phiên bản mới chạy chuẩn Manifest V3, bạn **bắt buộc** phải kích hoạt quyền chạy Userscript cho Tampermonkey:

[![Bật Tập Lệnh Người Dùng](https://img.shields.io/badge/BẬT%20TẬP%20LỆNH-NGƯỜI%20DÙNG-1a73e8?style=for-the-badge)](chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo)

1. Nhấp vào nút trên hoặc sao chép đường dẫn sau dán vào thanh địa chỉ trình duyệt:
   ```text
   chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo
   ```
2. Tìm và gạt bật công tắc: **"Cho phép tập lệnh của người dùng"** (*"Allow user scripts"*).

---

### Bước 3: Cài đặt YouTube Customizer

#### Cách 1: Cài đặt trực tiếp từ GitHub (Khuyên dùng)

[![Cài đặt Script](https://img.shields.io/badge/CÀI%20ĐẶT-SCRIPT-2ea44f?style=for-the-badge)](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js)

1. Nhấp vào nút **CÀI ĐẶT SCRIPT** ở trên (hoặc mở [liên kết tệp script trực tiếp](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js)).
2. Tiện ích Tampermonkey sẽ tự động mở giao diện cài đặt, chọn **Install** (hoặc **Update** nếu đã cài bản cũ).
3. Mở YouTube hoặc tải lại trang (`F5`) để bắt đầu sử dụng.

#### Cách 2: Cài đặt thủ công bằng mã nguồn cục bộ

1. Mở bảng điều khiển Tampermonkey trên trình duyệt, chọn **Tạo script mới** (`+`).
2. Xóa toàn bộ nội dung mẫu có sẵn.
3. Mở tệp [`tampermonkey.user.js`](./tampermonkey.user.js), xóa dòng `@require ...`.
4. Sao chép toàn bộ nội dung từ tệp [`youtube_customizer.js`](./youtube_customizer.js) và dán tiếp nối vào bên dưới phần header metadata.
5. Nhấn tổ hợp phím `Ctrl + S` để lưu, sau đó tải lại YouTube.

---

## Tài liệu

| Tài liệu | Nội dung |
| :--- | :--- |
| [CHANGELOG.md](./CHANGELOG.md) | Lịch sử thay đổi theo phiên bản |
| [SECURITY.md](./SECURITY.md) | Chính sách bảo mật cho Userscript, an toàn dữ liệu và quy trình báo lỗi |
| [LICENSE](./LICENSE) | Giấy phép mã nguồn mở MIT |

---

## Tuyên bố miễn trừ trách nhiệm

Dự án này là một Userscript được phát triển hoàn toàn vì mục đích học tập, nghiên cứu về cơ chế can thiệp DOM và tối ưu hóa trải nghiệm người dùng cá nhân trên trình duyệt mang tính chất phi thương mại. Dự án không liên kết, không được tài trợ và không đại diện cho Google LLC hoặc YouTube. Tên gọi, logo "YouTube" và các nhãn hiệu liên quan thuộc quyền sở hữu của Google LLC.

Người sử dụng chịu trách nhiệm về việc cài đặt và sử dụng Userscript trên trình duyệt của mình. Tác giả hoàn toàn không chịu bất kỳ trách nhiệm nào liên quan đến việc sử dụng sai mục đích.

---

## Giấy phép

Mã nguồn được phát hành theo giấy phép [MIT License](./LICENSE).
