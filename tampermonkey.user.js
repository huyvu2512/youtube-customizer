// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.5.3
// @description  YouTube Customizer v3.5.3 — Tối ưu hóa chu kỳ nền (Idle Efficiency), On-Demand Danmaku Scheduler, cách ly Observer và triệt tiêu tiến trình chạy ngầm vô ích.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.5.3
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.3
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.3
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.3:
 * ============================================================================
 * 1. [Tối ưu tiến trình chạy ngầm & Tiết kiệm CPU (Idle Efficiency)]:
 *    - Ngắt hoàn toàn polling interval Live Chat (2s) và Chat Memory GC (10s) khi ở ngoài trang xem video (/watch, /live).
 *    - Chuyển Danmaku Scheduler (50ms) sang cơ chế On-Demand: chỉ thức dậy khi có tin nhắn trong hàng đợi và tự động ngủ khi hàng đợi trống.
 * 2. [Tối ưu DOM MutationObservers & Settings Panel]:
 *    - Masthead Observer trong panel.js: Bỏ qua việc re-sync settings panel khi nút bánh răng đã nằm đúng vị trí trong masthead.
 *    - Thu hẹp phạm vi preventAutoPause: Quan sát trực tiếp ytd-popup-container, không còn quan sát toàn bộ cây DOM ytd-app.
 *    - Dọn dẹp dead CSS keyframes (@keyframes ytcConfirmInserted).
 * ============================================================================
 */
