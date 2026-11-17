// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.9.42
// @description  YouTube Customizer v3.9.42 — Mặc định ẩn tin nhắn Nightbot và chatbot trên Live Chat Ngang/Nổi.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.9.42
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.42
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.42
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG — 10 VERSION GẦN NHẤT
 * ============================================================================
 * v3.9.42 — Mặc định ẩn tin nhắn Nightbot và chatbot trên Live Chat Ngang/Nổi.
 * v3.9.41 — Gộp sóng heatmap liền mạch và tắt nổi bật đoạn khi di chuột.
 * v3.9.40 — Thêm tùy chọn tắt chia đoạn video trong mục Tối ưu.
 * v3.9.39 — Giảm lag video chia đoạn dài, heatmap và chế độ phóng to.
 * v3.9.38 — Giữ video nhạc đơn kèm list=RD trên tab Âm nhạc và ẩn shelf rỗng.
 * v3.9.37 — Sửa lỗi thưa cột Trang chủ khi bấm logo nhờ quét lại thẻ tái sử dụng.
 * v3.9.36 — Gỡ :has() CSS, tắt observer thừa trên Watch và khử blur GPU khi phóng to.
 * v3.9.35 — Tối ưu hiệu năng phóng to, tua video và xem trước timeline.
 * v3.9.34 — Giữ mức ban đầu đến khi người dùng đổi trong menu YouTube.
 * v3.9.33 — Áp chất lượng ban đầu rồi cho phép đổi thủ công trong YouTube.
 * ============================================================================
 */
