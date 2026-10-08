// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.5.1
// @description  YouTube Customizer v3.5.1 — Tối ưu hóa toàn diện trang xem video (Zero-Lag Watch), mượt mà khi tua video, hover preview, bật tắt Live Chat và thao tác player controls.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.5.1
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.1
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.1
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.1:
 * ============================================================================
 * 1. [Zero-Lag Watch Page & Player Controls] Tối ưu trang xem video mượt mà tuyệt đối:
 *    - Loại bỏ hoàn toàn bộ chọn html:not(:has(...)) triệt tiêu Style Recalculation Storms khi rê chuột, xem preview tooltip và thao tác player.
 *    - Bỏ cơ chế ẩn controls/con trỏ chuột khi tua video (.seeking-mode), tua mượt mà không chớp tắt HUD.
 *    - Gỡ bỏ khóa cứng click player 1.5s (fullscreenLock), các nút phóng to, play/pause, cài đặt và phím tắt F phản hồi tức thì.
 * 2. [Tối ưu Live Chat Toggle & Click Capture]:
 *    - Tối ưu bộ lắng nghe click toggle chat với bộ lọc vùng nhanh (inChatArea), giải phóng Main Thread cho toàn bộ cụm nút điều khiển player.
 *    - Loại bỏ tính toán px inline thủ công trên video khi không ở chế độ Fullscreen, để YouTube layout tự nhiên không xung đột reflow.
 *    - Triệt tiêu chuỗi setTimeout layout cascade trong fullscreenchange và chat state sync.
 * ============================================================================
 */
