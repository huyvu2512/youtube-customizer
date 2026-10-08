// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.7.4
// @description  YouTube Customizer v3.7.4 — Tách biệt CSS Dark/Light theme, sửa lỗi Masthead đen khi cuộn ở giao diện sáng, loại bỏ hoàn toàn viền trắng quanh video và mép web.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.7.4
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.4
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.4
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.4:
 * ============================================================================
 * 1. [Tách biệt bộ CSS Dark Theme & Light Theme]:
 *    - Khắc phục triệt để lỗi khi cuộn trang ở giao diện sáng bị biến thành Masthead đen: Tự động chuyển màu trắng #ffffff tinh khôi.
 *    - Tối ưu hóa ô tìm kiếm, icon và text riêng biệt theo từng chế độ sáng/tối.
 * 2. [Loại bỏ hoàn toàn viền trắng quanh video & mép màn hình]:
 *    - Bỏ hào quang viền kép (Accent halo 14px) và loại bỏ đục lỗ clearRect gây vệt trắng bao quanh video.
 *    - Áp dụng mặt nạ gradient 4 hướng (mask-composite) triệt tiêu hoàn toàn đường cắt vệt sáng ở mép web.
 * ============================================================================
 */
