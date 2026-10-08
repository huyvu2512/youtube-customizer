// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.8.1
// @description  YouTube Customizer v3.8.1 — Tinh chỉnh huy hiệu ngôi sao ⭐ cho Ánh sáng phòng (Ambilight 2.0 Cinema), kéo sát chữ và loại bỏ góc nghiêng, tối ưu độ ổn định.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.8.1
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.1
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.1
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.8.1:
 * ============================================================================
 * 1. [Tinh chỉnh giao diện & Huy hiệu ⭐ nổi bật]:
 *    - Điều chỉnh khoảng cách ngôi sao ⭐ nằm sát chữ "(Ambilight)", loại bỏ flex gap thừa.
 *    - Loại bỏ góc nghiêng rotate(10deg), thay bằng hiệu ứng scale ánh vàng dịu dàng, sang trọng.
 * 2. [Tối ưu độ ổn định]:
 *    - Tối ưu hóa cấu trúc mã nguồn, đảm bảo khởi động an toàn mượt mà ở document-start.
 * ============================================================================
 */
