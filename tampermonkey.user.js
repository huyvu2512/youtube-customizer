// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.6.7
// @description  YouTube Customizer v3.6.7 — Sửa triệt để lỗi nền trắng ở một bên trang; Khóa chặt nền tối OLED #0f0f0f; Ánh sáng phòng Cinema lan tỏa sâu; Masthead trong suốt đỉnh trang.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.6.7
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.7
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.7
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.6.7:
 * ============================================================================
 * 1. [Khắc phục triệt để lỗi nền trắng 1 bên trang (Zero White Bug)]:
 *    - Khóa chặt nền tảng html, body, ytd-app luôn ở màu đen sâu OLED (#0f0f0f), tuyệt đối không để lộ nền trắng mặc định của trình duyệt.
 *    - Chỉ làm trong suốt các khung video player và watch-flexy để quầng sáng phòng hiển thị rực rỡ và tan biến mượt mà vào nền đen.
 * 2. [Ánh sáng phòng (Ambilight) Cinema & Masthead xuyên thấu]:
 *    - Các ô dải màu dóng dọc từ đáy video lan tỏa sâu xuống tận giữa trang.
 *    - Thanh tiêu đề và khung tìm kiếm trong suốt ở đỉnh trang, tự động hoàn nguyên nền đen khi cuộn.
 * ============================================================================
 */
