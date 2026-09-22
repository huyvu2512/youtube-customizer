# Walkthrough: Phiên bản v3.2.4 (Khắc phục xung đột uBlock Origin & Tái cấu trúc Module)

Phiên bản **v3.2.4** đã được đóng gói thành công và đẩy lên kho lưu trữ GitHub chính thức tại [huyvu2512/youtube-customizer](https://github.com/huyvu2512/youtube-customizer).

---

## 1. Nguyên nhân và giải pháp lỗi uBlock Origin (Quảng cáo 6s)

### Nguyên nhân đã tìm ra:
- Trong bản cũ, lệnh `initLiveDvrHook()` được gọi ngay từ đầu ở `document-start` kể cả khi người dùng **đang tắt** tính năng *"Mở khóa tua Live Stream"*.
- Hàm hook này can thiệp đè lên thuộc tính `window.ytInitialPlayerResponse` và monkey-patch `JSON.parse`.
- Trong khi đó, **uBlock Origin** ngăn chặn quảng cáo video YouTube bằng các Scriptlet can thiệp vào chính `ytInitialPlayerResponse` và `JSON.parse` để lọc mảng `adPlacements` / `playerAds`.
- Việc script can thiệp đè lên đã làm hỏng hoặc bypass scriptlet của uBlock Origin, khiến YouTube nhận được dữ liệu quảng cáo và phát đoạn video quảng cáo 6 giây.

### Khắc phục triệt để:
1. **Chỉ can thiệp khi người dùng thực sự bật `unlockLiveDvr`**: Mặc định tính năng này tắt, `liveDvr.js` sẽ không bao giờ chạm vào `window.ytInitialPlayerResponse` hay `JSON.parse`, trả lại 100% môi trường nguyên vẹn cho uBlock Origin.
2. **Hook an toàn bằng chained descriptor**: Nếu người dùng bật tính năng tua Live, hook sẽ bảo toàn toàn bộ `getter/setter` đã có của uBlock Origin thay vì ghi đè thô bạo.
3. **Bổ sung lá chắn Ad Shield dự phòng (`src/player/adShield.js`)**: Nếu có bất kỳ quảng cáo video nào lọt qua (`.ad-showing`), script sẽ tự động tăng tốc video ad và kích hoạt sự kiện bấm nút *"Bỏ qua quảng cáo"* (Skip Ad) ngay lập tức.

---

## 2. Kiến trúc Codebase mới (Tái cấu trúc Module hóa)

Toàn bộ các tệp khổng lồ (>1.000 dòng) đã được tách thành các module đơn trách nhiệm dưới thư mục `src/`:

```text
src/
├── core/
│   ├── config.js          # loadConfig, saveConfig (an toàn tuyệt đối, chống mất cấu hình)
│   ├── constants.js       # Toàn bộ biểu tượng SVG và APP_VERSION = '3.2.4'
│   └── utils.js           # whenElement, safeHTML, rafThrottle
├── features/
│   ├── grid.js            # Chia 3, 4, 5 cột trang chủ
│   ├── feedFilter.js      # Lọc Shorts, Playables, Hội viên, Bài đăng, Search Ads
│   ├── logo.js            # Thay logo YouTube Premium chuẩn xác
│   └── promos.js          # Tự động đóng banner khuyến mại & cảnh báo gián đoạn
├── player/
│   ├── shortcuts.js       # Phím tắt A-S-D & Numpad
│   ├── fullscreenLock.js  # Khóa nút phóng to khi đang nạp trang
│   ├── liveDvr.js         # Mở khóa tua Live Stream (tương thích 100% uBlock Origin)
│   ├── autoLive.js        # Tự động đồng bộ mốc trực tiếp
│   └── adShield.js        # Lá chắn bỏ qua quảng cáo video dự phòng
├── chat/
│   ├── chatState.js       # State chung (seenMessageIds, containers, fullscreen resize)
│   ├── chatParser.js      # Trích xuất tin nhắn, badge mod/hội viên
│   ├── danmaku.js         # Quản lý 10 làn Danmaku chạy ngang thưa thớt
│   ├── streamerBox.js     # Khung nổi Streamer kéo thả & neo góc tự do
│   └── chatObserver.js    # Gắn MutationObserver, quét tin nhắn & bg iframe
├── ui/
│   ├── panel.js           # Tạo HTML bảng cài đặt 4 tab và nút bánh răng
│   ├── sync.js            # syncPanelState
│   └── notifier.js        # Kiểm tra cập nhật từ xa & hướng dẫn lần đầu
├── styles.css             # Tập hợp định kiểu CSS
└── index.js               # Entrypoint kết nối các module và điều phối SPA
```

---

## 3. Các tệp đã thay đổi và cập nhật

- [package.json](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/package.json): Nâng phiên bản lên `3.2.4`.
- [scripts/build.js](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/scripts/build.js): Cập nhật banner metadata lên `3.2.4`.
- [tampermonkey.user.js](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/tampermonkey.user.js): Trỏ require và updateURL về `?v=3.2.4`.
- [src/core/constants.js](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/src/core/constants.js): `APP_VERSION = '3.2.4'`.
- [README.md](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/README.md): Cập nhật thông tin bản phát hành và cấu trúc thư mục mới.
- [youtube_customizer.js](file:///c:/Users/Huy%20Vu/Downloads/youtube-customizer-main/youtube_customizer.js): Đã đóng gói bundle hoàn chỉnh (146.1 KB) bằng esbuild.

---

## 4. Hướng dẫn kiểm thử (Verification)

1. **Cập nhật script trên Tampermonkey**:
   - Mở Tampermonkey, bấm kiểm tra cập nhật hoặc truy cập trực tiếp:
     [tampermonkey.user.js](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js) để cài đè bản **v3.2.4**.
2. **Kiểm tra uBlock Origin**:
   - Đảm bảo uBlock Origin bật, mở các video thông thường. Kiểm tra không còn bị gián đoạn bởi đoạn quảng cáo 6 giây nào.
3. **Kiểm tra lưu cấu hình (F5 không reset)**:
   - Mở bảng cài đặt bánh răng, bật/tắt vài tính năng và chọn số cột (ví dụ 4 hoặc 5 cột).
   - Nhấn `F5` tải lại trang, kiểm tra số cột và trạng thái các nút gạt vẫn được bảo lưu 100%.
4. **Kiểm tra Live Chat**:
   - Mở luồng phát trực tiếp, chọn chế độ `Ngang` (Danmaku) hoặc `Nổi` (Streamer Box), kiểm tra tin nhắn hiển thị trơn tru, không giật lag.
