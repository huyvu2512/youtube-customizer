// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.5.2
// @description  YouTube Customizer v3.5.2 — Tối ưu hóa trang xem video Zero-Lag và khắc phục triệt để lỗi đen màn hình khi thoát chế độ toàn màn hình.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.5.2
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.2
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.2
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.2:
 * ============================================================================
 * 1. [Sửa lỗi đen màn hình khi thoát toàn màn hình (Exit Fullscreen Fix)]:
 *    - Khắc phục triệt để lỗi mất hình ảnh (chỉ còn tiếng, phóng to lại mới có hình) khi thoát chế độ phóng to.
 *    - Áp dụng hàm applyVideoDimensions tính toán chuẩn xác tỷ lệ khung hình video theo kích thước player container.
 *    - Đồng bộ kích thước liên tục qua các mốc chuyển cảnh và gọi player.setInternalSize() để YouTube căn chỉnh hoàn hảo.
 * 2. [Zero-Lag Watch Page & Player Controls]:
 *    - Loại bỏ hoàn toàn bộ chọn html:not(:has(...)) triệt tiêu Style Recalculation Storms khi rê chuột và xem preview tooltip.
 *    - Bỏ ẩn controls/con trỏ chuột khi tua video, tua mượt mà không chớp tắt HUD.
 *    - Gỡ bỏ khóa cứng click player 1.5s, các nút điều khiển và phím tắt phản hồi tức thì.
 *    - Tối ưu bộ lắng nghe click toggle chat với bộ lọc vùng nhanh (inChatArea).
 * ============================================================================
 */
