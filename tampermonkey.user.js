// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.8.8
// @description  YouTube Customizer v3.8.8 — Tích hợp bảng giám sát thông số hệ thống & web thời gian thực, sắp xếp lại tab Trình phát trực quan.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.8.8
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.8
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.8
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.8.8:
 * ============================================================================
 * 1. [Khung thông số hiệu năng Web & Hệ thống Real-time]:
 *    - Tích hợp bảng đo đạc 8 thông số trực quan tại tab Giao diện (RAM JS Heap, DOM Nodes, FPS,
 *      Video Buffer, Khung hình rớt, Độ phân giải, Tài nguyên nạp, Độ trễ mạng/Ping).
 *    - Hoàn toàn 0% CPU khi đóng bảng cài đặt.
 * 2. [Tái cấu trúc giao diện tab Trình phát]:
 *    - Di chuyển "Tự động trực tiếp" và "Mở khóa tua Live Stream" sang tab Trình phát.
 * ============================================================================
 */
