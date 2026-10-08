// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.5.9
// @description  YouTube Customizer v3.5.9 — Nâng cấp Ánh sáng phòng (Ambilight) Full-Screen 360 độ, xóa bỏ viền cắt video, tự động chống trùng lặp và xóa bỏ tính năng cũ thừa.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.5.9
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.9
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.9
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.9:
 * ============================================================================
 * 1. [Nâng cấp Ánh sáng phòng (Ambilight) Full-Screen]:
 *    - Tỏa sáng đều 360 độ quanh video, hắt sáng xuyên qua Masthead và Playlist panel.
 *    - Nâng cấp độ mờ quang học blur 85px & scale 1.4x xóa sổ hoàn toàn viền cắt sắc nhọn.
 *    - Tự động tắt ánh sáng gốc YouTube khi bật, khôi phục theo setting YouTube khi tắt.
 * 2. [Dọn dẹp tính năng thừa]:
 *    - Xóa bỏ triệt để tính năng cũ "Tắt ánh sáng video" (disableAmbient) khỏi source code.
 * 3. [Tối ưu kiểm tra cập nhật]:
 *    - Kiểm tra cập nhật qua GitHub REST API thời gian thực, chống kẹt cache CDN Fastly.
 * ============================================================================
 */
