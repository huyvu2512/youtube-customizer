// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.7.7
// @description  YouTube Customizer v3.7.7 — Kéo dài dải màu Ambilight xuống giữa trang (gấp đôi độ dài 2200px) cho cả Giao diện Sáng và Tối.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.7.7
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.7
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.7
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.7:
 * ============================================================================
 * 1. [Kéo dài dải màu Ambilight gấp đôi - Lan sâu xuống giữa trang]:
 *    - Tăng chiều dài bao phủ Ambilight từ 1200px lên 2200px cho cả Giao diện Sáng và Tối.
 *    - Nâng cấp độ phân giải Canvas Height lên 720px giúp các dải dóng màu Cinema chiếu rọi sâu xuyên suốt vùng bình luận, tan biến mượt mà tự nhiên.
 * ============================================================================
 */
