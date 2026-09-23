// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.3.1
// @description  YouTube Customizer v3.3.1 — Bổ sung tính năng Ẩn Danh sách kết hợp (Mixes) trong tab Bộ Lọc & tinh chỉnh Chế độ Chỉ Âm Thanh Mẫu 1 tối giản.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.3.1
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.1
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.1
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.1:
 * ============================================================================
 * 1. [Mới] Tính năng Ẩn Danh sách kết hợp (Mixes / Radio) trong tab Bộ Lọc:
 *    - Ẩn toàn diện các playlist Mix (list=RD...) trên Trang chủ, Tìm kiếm và Gợi ý xem tiếp.
 *    - Ẩn khung danh sách phát Mix trên trang xem video.
 *    - Tự động làm sạch URL và chặn nạp playlist Mix khi click xem video.
 *    - Khi hết bài, YouTube tự động chuyển tiếp sang video đề xuất tự nhiên thay vì bị kẹt trong Mix.
 *
 * 2. [Cải tiến] Chế độ Chỉ Âm Thanh (Audio-Only):
 *    - Áp dụng Mẫu 1: Dòng thông báo 2 dòng chữ tối giản, thanh lịch căn giữa khung phát,
 *      loại bỏ hoàn toàn cảm giác khung hộp AI cồng kềnh.
 *
 * 3. [Gỡ bỏ] Loại bỏ hoàn toàn tính năng Ad Shield ngầm (chấm dứt hiện tượng tua nhanh 16x khi gặp quảng cáo).
 * 4. [Mới] Thêm nút liên kết mở trang uBlock Origin ở dưới cùng tab Trình phát để người dùng chủ động cài đặt.
 * ============================================================================
 */
