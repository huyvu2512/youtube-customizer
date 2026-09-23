// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.3.8
// @description  YouTube Customizer v3.3.8 — Bổ sung tính năng Ẩn sản phẩm gắn thẻ (YouTube Shopping), tinh chỉnh Tab 5 Thông tin & Kiểm tra cập nhật mượt mà.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.3.8
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.8
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.8
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.8:
 * ============================================================================
 * 1. [Mới] Bổ sung tính năng "Ẩn sản phẩm gắn thẻ" (YouTube Shopping):
 *    - Tự động đóng/ẩn thanh bên Sản phẩm (Shopping), nút túi xách trên video và kệ sản phẩm tiếp thị liên kết.
 * 2. [Cải tiến UI] Hoàn thiện Tab 5 "Thông tin":
 *    - Đưa thẻ "Kiểm tra cập nhật" xuống dưới cùng tab 5 trực quan.
 *    - Tinh chỉnh nút Kiểm tra -> hiển thị trạng thái "Bản mới nhất" (xanh lá) hoặc "Cập nhật" (xanh dương click mở link).
 *    - Đơn giản hóa mục "Tặng quà & Ủng hộ" thành nút link mở trực tiếp VietQR MoMo.
 *    - Thiết kế lại badge phiên bản (version badge) theo phong cách bán trong suốt đỏ đồng bộ.
 * ============================================================================
 */
