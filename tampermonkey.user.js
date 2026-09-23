// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.2.31
// @description  YouTube Customizer v3.2.31 — Tự động tắt khung trò chuyện trực tiếp bằng nút Đóng (X) khi mới mở video (cho phép mở lại bình thường, Live Chat overlay chạy ngầm).
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.2.31
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.2.31
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.2.31
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.2.31:
 * ============================================================================
 * 1. [Sửa lỗi] Tự động tắt khung trò chuyện khi mới mở video / livestream:
 *    - Khắc phục triệt để lỗi không tự tắt khi đã bật sẵn tính năng từ trước.
 *    - Sử dụng Observer bắt đúng thời điểm khung chat mở để bấm nút Đóng (X) ngay lập tức.
 *    - Chỉ tắt 1 lần lúc đầu, người dùng bấm "Mở bảng điều khiển" vẫn xem bình thường.
 *
 * 2. [Sửa lỗi] Khung trò chuyện bị tự động làm mới / không thể cuộn lên xem tin cũ:
 *    - Gỡ bỏ hoàn toàn mã cưỡng ép cuộn xuống đáy và tự bấm nút "Tin nhắn mới ↓" trên khung chat chính.
 *    - Cho phép vuốt lên đọc lại tin nhắn cũ thoải mái bao lâu tùy thích mà không bị giật về đáy.
 *
 * 3. [Tối ưu] Live Chat Overlay (Danmaku / Khung streamer):
 *    - Luồng ngầm độc lập (#ytc-bg-live-chat) duy trì nhận tin nhắn liên tục, không phụ thuộc
 *      vào việc khung chat chính đang đóng hay người dùng đang cuộn xem tin cũ.
 * ============================================================================
 */
