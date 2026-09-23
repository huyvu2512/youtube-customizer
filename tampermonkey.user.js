// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.3.4
// @description  YouTube Customizer v3.3.4 — Sửa triệt để các video trên tab Âm nhạc, ẩn chính xác Danh sách phát (Playlists) & Danh sách kết hợp (Mixes).
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.3.4
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.4
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.4
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.4:
 * ============================================================================
 * 1. [Sửa lỗi] Khắc phục triệt để các hàng video trên Tab "Âm nhạc":
 *    - Gỡ bỏ bộ lọc CSS list=RD trên thẻ video đơn lẻ, tránh ẩn nhầm các video ca nhạc thường.
 *    - Các hàng "Đề xuất mới", "Tuyển tập nhạc...", "Video nhạc hàng đầu..." hiển thị đầy đủ video.
 * 2. [Cải tiến] Lọc chuẩn xác Danh sách phát (Playlists / Khóa học) & Mix:
 *    - Ẩn hoàn toàn các thẻ Playlist / Khóa học (kể cả trên Trang chủ, Tìm kiếm và Gợi ý).
 *    - Bảo vệ an toàn các video có thời lượng cụ thể không bao giờ bị ẩn nhầm.
 * ============================================================================
 */
