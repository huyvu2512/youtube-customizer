// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.9.1
// @description  YouTube Customizer v3.9.1 — Tách biệt chỉ số Ping và Tốc độ tải, hỗ trợ hệ thống 3 màu trạng thái (Xanh lá - Vàng - Đỏ).
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.9.1
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.1
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.1
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.9.1:
 * ============================================================================
 * 1. [Bỏ chỉ số DOM, phân tách Ping và Tốc độ mạng]:
 *    - Rút gọn bảng hiệu năng gồm 4 thẻ chuyên dụng cho streaming: RAM Video, FPS Video,
 *      Độ trễ (Ping) và Tốc độ tải (Mbps).
 * 2. [Hệ thống đèn màu 3 trạng thái chuẩn xác]:
 *    - Xanh lá: Trạng thái tốt / Mượt mà.
 *    - Màu vàng: Trạng thái bình thường / Trung bình.
 *    - Màu đỏ: Cảnh báo giật lag / Tốc độ mạng chậm / Ping cao.
 * ============================================================================
 */
