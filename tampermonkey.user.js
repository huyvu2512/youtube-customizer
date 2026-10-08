// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.7.6
// @description  YouTube Customizer v3.7.6 — Mở rộng Ambilight tràn viền phủ kín 100% các góc màn hình, triệt tiêu hoàn toàn khoảng trắng góc trên và 2 mép web.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.7.6
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.6
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.6
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.6:
 * ============================================================================
 * 1. [Phủ kín 100% các góc màn hình - Zero White Corners]:
 *    - Loại bỏ mặt nạ mờ ngang ở 2 bên mép và đỉnh trang gây lộ màu nền trắng của web ở các góc.
 *    - Mở rộng canvas tràn viền 60px ra ngoài màn hình để bù trừ hiệu ứng Gaussian blur falloff, đảm bảo góc trên trái, góc trên phải và 2 bên mép phủ màu rực rỡ, đồng nhất 100%.
 * ============================================================================
 */
