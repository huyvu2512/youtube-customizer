// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.5.7
// @description  YouTube Customizer v3.5.7 — Bổ sung tính năng Ánh sáng phòng (Ambilight) siêu tối ưu phần cứng, mượt mà và không giật lag.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.5.7
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.7
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.7
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.7:
 * ============================================================================
 * 1. [Tính năng mới: Ánh sáng phòng (Ambilight)]:
 *    - Tạo hiệu ứng ánh sáng viền phản chiếu màu sắc video cực đẹp ra không gian phòng.
 *    - Kiến trúc Micro Canvas 32x18px siêu nhẹ: Tiêu thụ cực ít RAM (< 50KB) và CPU (< 0.5%).
 *    - GPU Compositor Acceleration: Đẩy toàn bộ xử lý làm mờ và tỏa rộng sang GPU phần cứng.
 *    - Throttling 18 FPS & Deep Sleeping: Tự động ngắt hoàn toàn khi tạm dừng video, chuyển tab hoặc cuộn khỏi video.
 *    - Tích hợp công tắc duy nhất ngay trên Live Chat trong Tab 1 (Giao diện), chuẩn hóa cài đặt điện ảnh.
 * ============================================================================
 */
