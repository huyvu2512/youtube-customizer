// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.3.7
// @description  YouTube Customizer v3.3.7 — Bổ sung Tab 5 Thông tin, tính năng Ẩn sản phẩm gắn thẻ (Shopping), tối ưu hóa giao diện và phím tắt.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.3.7
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.7
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.7
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.7:
 * ============================================================================
 * 1. [Mới] Bổ sung Tab 5 "Thông tin":
 *    - Xem thông tin phiên bản phát hành chính thức, kiểm tra cập nhật trực tiếp qua GitHub.
 *    - Thông tin nhà phát triển Huy Vũ (https://huyvu2512.io.vn).
 *    - Mục Báo cáo & Góp ý ý tưởng trực tiếp qua GitHub Issues.
 *    - Mục Tặng quà & Ủng hộ (Donate) qua MoMo (VietQR standee) kèm nút sao chép nhanh.
 * 2. [Mới] Tính năng "Ẩn sản phẩm gắn thẻ" (YouTube Shopping):
 *    - Tự động đóng/ẩn thanh bên Sản phẩm (Shopping), nút túi xách trên video và kệ sản phẩm.
 * 3. [Cải tiến UI] Đưa mục "Độ phân giải video" lên trên cùng tab "Tối Ưu" tiện thao tác.
 * 4. [Cải tiến UI] Thiết kế lại badge phiên bản (version badge) theo phong cách bán trong suốt đồng bộ.
 * ============================================================================
 */
