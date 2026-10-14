// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.8.9
// @description  YouTube Customizer v3.8.9 — Tinh gọn bảng đo thông số hệ thống còn 4 chỉ số thiết yếu (RAM, FPS, Mạng, DOM), tối ưu hiệu năng.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.8.9
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.9
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.9
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.8.9:
 * ============================================================================
 * 1. [Tinh gọn bảng thông số hiệu năng Web & Hệ thống]:
 *    - Lược bỏ hoàn toàn thanh tiêu đề và các chi tiết thừa, tạo giao diện phẳng tối giản.
 *    - Tinh lọc giữ lại chính xác 4 chỉ số cốt lõi: RAM (JS Heap), Khung hình (FPS),
 *      Mạng / Ping, và Số lượng DOM Nodes.
 *    - Cắt giảm các tác vụ truy vấn video rớt/buffer không cần thiết, tối ưu hóa CPU tối đa.
 * ============================================================================
 */
