// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.3.3
// @description  YouTube Customizer v3.3.3 — Sửa lỗi tab Âm nhạc bị trống trơn, mở rộng tính năng ẩn Danh sách phát (Playlists) trong Tìm kiếm & thanh chủ đề.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.3.3
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.3
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.3
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.3:
 * ============================================================================
 * 1. [Sửa lỗi] Khắc phục triệt để lỗi Tab "Âm nhạc" trên Trang chủ bị đen sì / trống trơn:
 *    - Thu hẹp phạm vi quét hàng `ytd-rich-section-renderer`: không còn ẩn oan toàn bộ kệ nhạc
 *      chỉ vì có chứa link Mix.
 *    - Các video ca nhạc trong tab "Âm nhạc" hiển thị đầy đủ, đẹp mắt và tự động làm sạch URL khi click.
 * 2. [Mở rộng] Tính năng "Ẩn Danh sách phát & Mix" (`hideMixes`):
 *    - Ẩn toàn diện cả Danh sách phát người dùng tạo (`ytd-playlist-renderer`, `ytd-compact-playlist-renderer`)
 *      trong kết quả Tìm kiếm và thanh Gợi ý xem tiếp.
 *    - Ẩn luôn chip nút bấm "Danh sách kết hợp" trên thanh chủ đề đầu trang chủ.
 *    - Cập nhật nhãn cài đặt thành "Ẩn Danh sách phát & Mix" trực quan, chính xác.
 * ============================================================================
 */
