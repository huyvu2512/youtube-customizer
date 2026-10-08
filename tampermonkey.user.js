// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.6.1
// @description  YouTube Customizer v3.6.1 — Nâng cấp Ánh sáng phòng Full-Screen Cinema (Spread 400%), Dual-Layer Glow, làm dịu nền và xóa bỏ hoàn toàn lộ viền video.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.6.1
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.1
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.1
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.6.1:
 * ============================================================================
 * 1. [Nâng cấp Ánh sáng phòng Full-Screen Cinema (Spread 400%)]:
 *    - Kiến trúc Dual-Layer: Lớp tỏa rộng 400% phủ kín toàn màn hình (360 độ) + Lớp hào quang viền sống động sát mép video.
 *    - Xóa tan 100% hiện tượng "khối chữ nhật màu nâu", quầng sáng mềm mại tan biến vào không gian.
 *    - Tách biệt viền video sắc nét chuẩn OLED với lớp bóng đổ sâu cinema.
 * 2. [Làm dịu màu nội dung xung quanh (Cinema Ambience)]:
 *    - Làm trong suốt toàn bộ chuỗi DOM nền YouTube, Masthead và Playlist dạng kính mờ cao cấp.
 *    - Giảm độ chói/tương phản của thumbnail phụ và description giúp video chính nổi bật rực rỡ nhất.
 * ============================================================================
 */
