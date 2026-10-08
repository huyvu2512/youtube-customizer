// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.7.3
// @description  YouTube Customizer v3.7.3 — Thêm công tắc Tự động cập nhật (Auto-Update); Tự gọi API kiểm tra và trỏ link cài bản mới khi vào YouTube; Giao diện Frameless không khung viền.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.7.3
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.3
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.3
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.3:
 * ============================================================================
 * 1. [Tính năng mới: Công tắc gạt Tự động cập nhật]:
 *    - Thêm công tắc gạt "Tự động cập nhật" trong Tab Thông tin (Menu bánh răng).
 *    - Mỗi khi vào YouTube, script tự động gọi GitHub API kiểm tra phiên bản mới; nếu phát hiện bản mới sẽ lập tức tự động trỏ sang link cập nhật Tampermonkey.
 *    - Tích hợp Session Guard chống lặp chuyển hướng khi người dùng nhấn Back.
 * 2. [Thiết kế Frameless & Trong suốt 100%]:
 *    - Playlist & Khung mô tả (Description box) trong suốt hoàn toàn, không hiện khung viền.
 * ============================================================================
 */
