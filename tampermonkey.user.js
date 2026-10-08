// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.6.8
// @description  YouTube Customizer v3.6.8 — Ánh sáng phòng (Ambilight) Full-Width Cinema lan tỏa sâu; Masthead trong suốt toàn dải đỉnh trang; Khung video sắc nét nguyên bản; Tối ưu 30 FPS siêu mượt.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.6.8
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.8
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.8
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.6.8:
 * ============================================================================
 * 1. [Ánh sáng phòng (Ambilight) Full-Width Cinema]:
 *    - Phủ kín 100% bề ngang màn hình, lan tỏa ánh sáng toàn dải Masthead trên cùng (bao gồm cả góc phải phía trên nút Tạo/Avatar/Live Chat).
 *    - Các ô dải màu dóng dọc từ đáy video lan sâu xuống giữa trang cực đẹp.
 *    - Động cơ Render kiên cường 30 FPS không bao giờ bị tắt khi buffer hay đổi độ phân giải.
 * 2. [Bảo toàn độ sắc nét và cấu trúc Player]:
 *    - Giữ nguyên cấu trúc gốc của trình phát YouTube, video sắc nét 100%, thao tác chuột mượt mà.
 *    - Masthead và ô tìm kiếm xuyên thấu tinh tế ở đỉnh trang, tự động hoàn nguyên nền đen khi cuộn.
 * ============================================================================
 */
