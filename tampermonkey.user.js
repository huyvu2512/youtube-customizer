// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.6.6
// @description  YouTube Customizer v3.6.6 — Ánh sáng phòng Ambilight dải màu dóng dọc chuẩn Cinema lan tỏa sâu xuống giữa trang; Masthead & thanh tìm kiếm trong suốt; Khắc phục triệt để thanh cuộn ngang.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.6.6
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.6
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.6
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.6.6:
 * ============================================================================
 * 1. [Ánh sáng phòng (Ambilight) Dải màu dóng dọc & Lan tỏa sâu]:
 *    - Tạo các ô dải màu dóng dọc chuẩn xác từ đáy video lan tỏa sâu xuống tận giữa trang.
 *    - Ăn khớp 100% hình học giữa khung video và viền ánh sáng phòng, không lệch góc.
 * 2. [Masthead & Thanh tìm kiếm trong suốt]:
 *    - Trong suốt toàn bộ thanh tiêu đề và thanh tìm kiếm khi ở đỉnh trang để ánh sáng xuyên thấu.
 *    - Tự động hoàn nguyên nền đen khi cuộn trang xuống.
 * 3. [Triệt tiêu thanh cuộn ngang (Zero Horizontal Scrollbar)]:
 *    - Khắc phục triệt để thanh kéo ngang khi bật tính năng ánh sáng phòng.
 * ============================================================================
 */
