// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.3.5
// @description  YouTube Customizer v3.3.5 — Bổ sung tính năng Ưu tiên độ phân giải video (Tự động, Cao nhất, 2K, 1080p, 720p) trong tab Tối Ưu.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.3.5
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.5
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.5
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.5:
 * ============================================================================
 * 1. [Mới] Tính năng Ưu tiên chọn độ phân giải video trong tab "Tối Ưu":
 *    - Hỗ trợ 5 mức tùy chọn: Tự động (mặc định), Cao nhất (Max / 4K), 2K, 1080p, 720p.
 *    - Tự động áp đặt độ phân giải mong muốn ngay khi mở hoặc chuyển tiếp video.
 *    - Đồng bộ mượt mà vào cấu hình người dùng và bộ nhớ trình phát YouTube.
 * 2. [Cải tiến UI] Chuyển mục Ẩn Danh sách phát & Mix xuống cuối tab Lọc gọn gàng, khoa học.
 * ============================================================================
 */
