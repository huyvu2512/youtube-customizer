// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.6.0
// @description  YouTube Customizer v3.6.0 — Chuyển tính năng Ẩn sản phẩm gắn thẻ sang Tab Lọc nội dung, tối ưu bộ giải mã cập nhật Base64 thời gian thực.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.6.0
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.0
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.0
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.6.0:
 * ============================================================================
 * 1. [Tối ưu bố cục cài đặt]:
 *    - Chuyển tính năng "Ẩn sản phẩm gắn thẻ" (hideShopping) sang Tab 2 (Lọc nội dung sạch).
 *    - Giữ Tab 1 (Giao diện) tinh gọn, tập trung hoàn toàn vào bố cục và hiệu ứng video.
 * 2. [Kiểm tra cập nhật siêu bền bỉ]:
 *    - Tích hợp tự động giải mã Base64 cho GitHub Contents REST API.
 *    - Cơ chế Multi-Tier: Trực tiếp API thô -> Giải mã Base64 -> Fallback CDN khi quá tải IP.
 * ============================================================================
 */
