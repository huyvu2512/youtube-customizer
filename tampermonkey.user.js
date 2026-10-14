// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.9.0
// @description  YouTube Customizer v3.9.0 — Đo RAM Video thực tế, FPS Video chuẩn giải mã, và Ping mạng real-time chuẩn xác.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.9.0
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.0
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.0
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.9.0:
 * ============================================================================
 * 1. [Nâng cấp chỉ số RAM Video & FPS Video chuẩn xác]:
 *    - Chuyển RAM sang đo bộ nhớ đệm video (RAM Video) với 1 số duy nhất (ví dụ: 32 MB).
 *    - Đo FPS Video trực tiếp từ luồng giải mã video (ổn định 30/60 FPS hoặc Tạm dừng).
 * 2. [Đo Ping mạng & Tốc độ tải Real-time]:
 *    - Tự động kiểm tra độ trễ mạng thực tế đến máy chủ YouTube (nhảy ms như game).
 *    - Đo tốc độ tải luồng video (Mbps) theo thời gian thực.
 * ============================================================================
 */
