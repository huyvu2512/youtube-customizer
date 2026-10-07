// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.5.0
// @description  YouTube Customizer v3.5.0 — Đại tu tối ưu hiệu năng Zero-Lag, sửa lỗi hitbox lưới video, chống nghẽn style recalculation và tối ưu luồng tải video & Live Chat.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.5.0
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.0
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.0
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.0:
 * ============================================================================
 * 1. [Tối ưu & Sửa lỗi Hitbox] Sửa triệt để lỗi mất hitbox hover và click trượt trên lưới video:
 *    - Thay thế display:contents trên ytd-rich-grid-row bằng flexbox wrap để giữ nguyên bounding box.
 *    - Loại bỏ toàn bộ bộ chọn :has() khi hover gây recalculate style storm trên mỗi chuyển động chuột.
 *    - Hạ z-index khung preview và bỏ pointer-events: auto toàn cục chống chặn click chuột.
 * 2. [Trình phát & Video Stream] Chống nghẽn buffer & ngắt kết nối video:
 *    - Chuyển cơ chế đặt chất lượng (qualityManager) sang kích hoạt 1 lần duy nhất khi manifest sẵn sàng.
 *    - Tối ưu hóa hook JSON.parse trong liveDvr chỉ chạy khi tính năng bật và dữ liệu phù hợp.
 *    - Khóa điều kiện autoLiveSync cho checkInitialLiveSnap tránh polling thừa khi tắt tính năng.
 * 3. [Tối ưu DOM & MutationObserver] Giảm tải CPU Main Thread:
 *    - Debounce MutationObserver và thu hẹp phạm vi trong preventAutoPause.
 *    - Quét feed lũy tiến (incremental scan) với thẻ data-attribute và kiểm tra selector nhẹ trước.
 *    - Triệt tiêu click storm và chuỗi setTimeout lặp trong tự động đóng Live Chat và căn cột lưới.
 * ============================================================================
 */
