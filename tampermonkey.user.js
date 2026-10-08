// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.6.2
// @description  YouTube Customizer v3.6.2 — Tối ưu bố cục trang xem video bám sát mép, xóa bỏ khoảng trống thừa 2 bên và chống bóp khung hình; Ánh sáng phòng Full-Screen Cinema.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.6.2
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.2
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.2
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.6.2:
 * ============================================================================
 * 1. [Tối ưu bố cục trang xem video (Full-Width Watch Page Alignment)]:
 *    - Khắc phục triệt để lỗi khung video bị bóp hẹp và thừa 2 dải đen trống 2 bên.
 *    - Trải rộng layout 100%, canh lề 2 mép 24px chuẩn xác như giao diện gốc.
 *    - Video player và sidebar gợi ý / playlist co dãn linh hoạt, bám sát mép phải.
 * 2. [Ánh sáng phòng Full-Screen Cinema (Spread 400%)]:
 *    - Tự động tương thích và co giãn hoàn hảo theo kích thước player mới.
 * ============================================================================
 */
