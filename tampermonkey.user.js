// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.7.2
// @description  YouTube Customizer v3.7.2 — Giao diện không khung viền (Frameless); Khung Playlist & Description box trong suốt hoàn toàn 100%, hòa quyện tuyệt đối cùng ánh sáng phòng Ambilight.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.7.2
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.2
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.2
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.2:
 * ============================================================================
 * 1. [Thiết kế Không Khung Viền - Frameless & Trong suốt 100%]:
 *    - Khử hoàn toàn viền, bóng đổ và nền hộp của Bảng danh sách phát (Playlist panel) & Khung mô tả (Description box).
 *    - Toàn bộ danh sách bài hát và thông tin mô tả video hiển thị trôi nổi trực tiếp trên nền ánh sáng phòng Ambilight, không bị đóng hộp.
 *    - Các nút chức năng (Like, Share, Chips...) chuyển sang chế độ siêu mờ tinh tế.
 * ============================================================================
 */
