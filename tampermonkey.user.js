// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.5.4
// @description  YouTube Customizer v3.5.4 — Khắc phục triệt để tính năng Mở khóa tua Live Stream (Live DVR), gỡ bỏ Server-Driven ABR, tối ưu Zero-Lag và đồng bộ Auto Live.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.5.4
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.4
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.4
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.4:
 * ============================================================================
 * 1. [Mở khóa tua Live Stream (Force Live DVR)]:
 *    - Khởi tạo hook ytInitialPlayerResponse và JSON.parse từ document-start, đảm bảo bắt trọn luồng phát ngay cả khi tính năng được bật sau đó.
 *    - Dỡ bỏ cơ chế Server-Driven ABR (useServerDrivenAbr, serverPlaybackStartConfig) và URL Server ABR độc quyền của YouTube trên các luồng live tắt DVR.
 *    - Xử lý tương thích cả hai cấu trúc dữ liệu data.videoDetails và data.playerResponse.videoDetails (SPA navigation).
 * 2. [Tối ưu hiệu năng Zero-Lag & Bảo vệ tính năng khác]:
 *    - Fast-path boolean check: khi tính năng tắt, JSON.parse trả kết quả tức thì không tốn CPU.
 *    - Không can thiệp Object.prototype, đảm bảo bình luận, feed, chat và uBlock Origin hoạt động 100% trơn tru.
 * 3. [UX & Tương tác Auto Live Sync]:
 *    - Hiển thị Toast thông báo tải lại trang (F5) khi người dùng bật công tắc Live DVR.
 *    - Đồng bộ mượt mà giữa tua lùi (Live DVR) và Tự động trực tiếp (Auto Live Sync): không tự ý giật ngược về mốc live khi người dùng đang chủ động tua xem lại.
 * ============================================================================
 */
