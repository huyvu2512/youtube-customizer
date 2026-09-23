// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.3.6
// @description  YouTube Customizer v3.3.6 — Bổ sung tính năng Ưu tiên độ phân giải video trong tab Tối Ưu, tinh chỉnh thứ tự bố cục cài đặt chuẩn xác.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.3.6
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.6
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.6
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.6:
 * ============================================================================
 * 1. [Mới] Tính năng Ưu tiên chọn độ phân giải video trong tab "Tối Ưu":
 *    - Hỗ trợ 5 mức tùy chọn: Tự động (mặc định), Cao nhất (Max / 4K), 2K, 1080p, 720p.
 *    - Tự động áp đặt độ phân giải mong muốn ngay khi mở hoặc chuyển tiếp video.
 * 2. [Cải tiến UI] Sắp xếp lại bố cục theo nhu cầu sử dụng:
 *    - Mục "Ẩn Danh sách phát & Mix" đặt ở dưới cùng tab "Lọc".
 *    - Mục "Chặn AV1 / Ép Codec H.264" và "Chỉ phát âm thanh (Radio)" chuyển xuống dưới cùng tab "Tối Ưu".
 * ============================================================================
 */
