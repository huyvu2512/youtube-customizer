// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.3.7
// @description  YouTube Customizer v3.3.7 — Bổ sung Tab 5 Thông tin (Phiên bản, Làm mới, Cập nhật, Tác giả Huy Vũ, Báo cáo & Ủng hộ), đưa Độ phân giải video lên đầu mục Tối Ưu.
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
 *    - Xem thông tin phiên bản phát hành chính thức, nút Làm mới trang và Kiểm tra cập nhật.
 *    - Thông tin nhà phát triển Huy Vũ (@huyvu2512).
 *    - Mục Báo cáo & Góp ý ý tưởng trực tiếp qua GitHub Issues.
 *    - Mục Tặng quà & Ủng hộ (Donate) với thông tin số tài khoản / MoMo kèm nút sao chép nhanh.
 * 2. [Cải tiến UI] Đưa mục "Độ phân giải video" lên trên cùng tab "Tối Ưu" tiện thao tác.
 * ============================================================================
 */
