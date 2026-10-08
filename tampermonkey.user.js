// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.8.1
// @description  YouTube Customizer v3.8.1 — Tự động kích hoạt & dịch phụ đề Live Stream/VOD chuẩn YouTube gốc, ghim ngôn ngữ ưu tiên lên đầu menu và tối ưu huy hiệu tính năng nổi bật.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.8.1
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.1
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.1
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.8.1:
 * ============================================================================
 * 1. [Phụ đề tự động (Auto Subtitles & Live Subtitles)]:
 *    - Thêm công tắc trong Tab Giao diện cho phép tự động bật phụ đề video & Live Stream.
 *    - Mở khóa nút phụ đề trên các luồng Live Stream đang bị tắt nút.
 *    - Sử dụng chuẩn font chữ, cỡ chữ, viền và nền gốc của YouTube (người dùng tự setup).
 *    - Ghim ngôn ngữ ưu tiên (mặc định theo YouTube/hệ thống hoặc chọn qua menu) lên ngay đầu danh sách phụ đề.
 * 2. [Tinh chỉnh giao diện & Huy hiệu ⭐ nổi bật]:
 *    - Điều chỉnh khoảng cách ngôi sao ⭐ nằm sát chữ "(Ambilight)", loại bỏ độ nghiêng lỏ.
 * ============================================================================
 */
