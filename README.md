# YouTube Customizer — Phiên bản 1.6

Script Tampermonkey tùy biến YouTube: giao diện gọn, xem video thoải mái hơn, tối ưu hiệu năng nhẹ. Một file logic chính (`youtube_customizer.js`) + wrapper cài đặt (`tampermonkey.user.js`).

---

## Tính năng (v1.6)

### Giao diện

| Tính năng | Mô tả |
|-----------|--------|
| **Logo Premium** | Thay logo YouTube bằng logo Premium (span độc lập, tự khôi phục khi YouTube đổi DOM). Ẩn mã quốc gia cạnh logo. |
| **Lưới 4 cột** | Trang chủ & feed: **4 video/hàng** (màn ≥ 1000px). CSS + JavaScript dự phòng. Hover thumbnail gọn trong ô, tránh chồng chéo. |
| **Click logo** | Trên trang chủ / feed: cuộn mượt lên đầu trang. |

### Điều khiển video

| Phím | Chức năng |
|------|-----------|
| **Numpad 8 / 2** | Tăng / giảm âm lượng |
| **Numpad 4 / 6** | Lùi / tiến 10 giây |
| **Numpad 5** | Play / Pause |
| **A / S / D** | Lùi 10s / Play-Pause / Tiến 10s — chỉ khi chuột trên player hoặc fullscreen |
| **Numpad 1, 3, 7, 9** | Vô hiệu (tránh bấm nhầm) |

- Tự tắt phím tắt khi đang gõ ô tìm kiếm, bình luận, v.v.
- **A/S/D dùng `e.code` (phím vật lý)** — tương thích Unikey, ít lag khi bật bộ gõ tiếng Việt.
- **Clean seek:** khi tua, ẩn thanh điều khiển rườm rà + ẩn con trỏ tạm thời.

### Hiệu năng & tiện ích

| Tính năng | Mô tả |
|-----------|--------|
| **Tắt Ambient Mode** | Giảm tải GPU (viền sáng quanh video). |
| **Lazy render bình luận** | `content-visibility` chỉ trên comment — **không** áp lên ô video feed (tránh lỗi layout). |
| **Bỏ qua quảng cáo** | Tua nhanh, ẩn hình quảng cáo, tự bấm Skip; **giữ trạng thái mute** trước/sau quảng cáo. |
| **Đóng popup Adblock** | Tự đóng cảnh báo chặn quảng cáo (nhiều ngôn ngữ). |
| **Vẫn đang xem?** | Tự bấm xác nhận tiếp tục phát. |
| **Ẩn rác & Shorts** | Promo, upsell, shelf Shorts, mục Shorts sidebar. |
| **SPA** | Tự gắn lại player khi chuyển trang (`yt-navigate-finish`). |

---

## Cài đặt

### Bước 1: Tampermonkey

- PC (Chrome / Edge / Cốc Cốc): [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- Android: [Tampermonkey Legacy](https://chromewebstore.google.com/detail/tampermonkey-legacy/lcmhijbkigalmkeommnijlpobloojgfn)

### Bước 2: Cài script

**Cách A — Từ GitHub (sau khi đã push bản 1.6):**

[![Cài đặt Script](https://img.shields.io/badge/CÀI%20ĐẶT-SCRIPT-2ea44f?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js)

**Cách B — Cài local (khuyên dùng khi chưa push GitHub):**

1. Tampermonkey → **Tạo script mới**
2. Xóa dòng `@require ...` trong `tampermonkey.user.js`
3. Dán **toàn bộ** nội dung `youtube_customizer.js` vào **cuối** file script
4. Lưu → F5 YouTube

### Bước 3: Chặn quảng cáo (khuyên dùng)

Script tập trung giao diện & trải nghiệm. Chặn quảng cáo nên dùng thêm [uBlock Origin Lite](https://chromewebstore.google.com/detail/ublock-origin-lite/ddkjiahejlhfcafbddmgiahcphecmpfh?hl=vi).

---

## Cấu trúc repo

| File | Vai trò |
|------|---------|
| `youtube_customizer.js` | Toàn bộ logic (CSS + JS) |
| `tampermonkey.user.js` | Metadata Tampermonkey, `@version 1.6` |
| `README.md` | Tài liệu này |

---

## Ghi chú phiên bản

- **1.6** là phiên bản phát hành hiện tại (gộp các chỉnh sửa ổn định: lưới 4 cột, sửa feed Premium, A/S/D + Unikey, SPA player).
- Không dùng nhánh 1.6.1 / 1.6.2 trong tài liệu — mọi bản vá đều nằm trong **1.6**.

---

## Xử lý sự cố

| Triệu chứng | Gợi ý |
|-------------|--------|
| Script không chạy | Kiểm tra Tampermonkey bật; F5; cài local (Cách B) nếu GitHub chưa cập nhật |
| Trang chủ trống | Đảm bảo dùng bản 1.6 mới (không ẩn `#premium-container`) |
| Vẫn 3 cột | Thu gọn sidebar YouTube; cửa sổ rộng ≥ 1000px; F5 trang chủ |
| A/S/D lag với Unikey | Bản 1.6 dùng `e.code`; rê chuột vào vùng video trước khi bấm |
| Logo không đổi | Đợi 1–2 giây sau F5; thử tắt script khác xung đột |

---

**Tác giả:** Huy Vũ · **Phiên bản:** 1.6
