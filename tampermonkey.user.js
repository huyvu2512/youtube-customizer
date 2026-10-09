// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.8.4
// @description  YouTube Customizer v3.8.4 — Nâng cấp Ánh sáng phòng (Ambilight Cinema) mở rộng không gian vật thể video (Anamorphic Edge Stretch), kéo giãn chuyển động mép tự nhiên không lộ viền.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.8.4
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.4
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.4
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.8.4:
 * ============================================================================
 * 1. [Nâng cấp Ánh sáng phòng mở rộng không gian (Anamorphic Edge Stretch)]:
 *    - Ánh sáng phòng không còn là một lớp màu mờ đè lên đơn điệu.
 *    - Dải pixel sát 4 mép video được chiếu giãn trực tiếp ra xung quanh (Outpainting / Motion Smear),
 *      giúp các vật thể ở mép (vỉa hè, mặt đất, người đi qua, tán cây) kéo dài thẳng tắp tạo cảm giác
 *      video được mở rộng không gian chân thực và sống động.
 * 2. [Hòa quyện viền video liền mạch 100%]:
 *    - Lớp đệm nở nhẹ dưới khung player kết hợp bóng đổ tự nhiên triệt tiêu hoàn toàn viền cắt sắc nhọn.
 *    - Độ mờ cân chỉnh hoàn hảo (blur 16px) giữ trọn vẹn hình khối dải kéo dài mà không bị nhòe vón cục.
 * ============================================================================
 */
