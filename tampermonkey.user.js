// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.5.5
// @description  YouTube Customizer v3.5.5 — Khóa cố định thời gian đã phát (chống tự đổi số âm), tự động F5 thông minh khi bật Live DVR và loại bỏ thông báo phiền toái.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.5.5
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.5
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.5
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.5:
 * ============================================================================
 * 1. [Khóa cố định thời gian đã phát (Lock Elapsed Time)]:
 *    - Tự động nắn và cố định mốc thời gian trình phát luôn ở dạng thời gian đã phát (vd: 1:47 / 4:13).
 *    - Chống ghost-click và ngăn chặn triệt để tình trạng tự nhảy sang thời gian đếm ngược âm (vd: -3:13 / 4:13) khi mở video.
 * 2. [Tự động F5 thông minh cho Live DVR]:
 *    - Bỏ hoàn toàn thông báo Toast phiền toái.
 *    - Tự động tải lại trang sau 250ms khi gạt công tắc nếu đang ở trong video Live (/watch hoặc /live).
 *    - Giữ nguyên trang chủ/tìm kiếm không reload khi bật từ feed.
 * ============================================================================
 */
