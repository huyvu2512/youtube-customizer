// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.9.4
// @description  YouTube Customizer v3.9.4 — Sửa phép đo FPS và hiển thị đúng các chỉ số buffer, HTTP, tốc độ tải.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.9.4
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.4
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.4
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.9.4:
 * ============================================================================
 * 1. [Độ chính xác chỉ số hiệu năng]:
 *    - Khởi tạo baseline trước khi tính FPS, đặt lại khi đổi video hoặc tạm dừng.
 *    - Hiển thị thời lượng buffer thay cho ước lượng RAM không thể đo từ API video.
 *    - Ghi rõ độ trễ HTTP tới YouTube và tốc độ tải ước tính.
 * 2. [Bản trước: quản lý tác vụ nền]:
 *    - Dừng timer Auto Live Sync và Chat Memory GC khi tính năng tắt hoặc rời trang xem.
 *    - Bỏ qua mutation trong vùng bình luận và overlay chat, giữ theo dõi trong player.
 *    - Bỏ fallback innerText khi đọc thông báo.
 * ============================================================================
 * CHANGELOG - v3.9.3:
 * ============================================================================
 * 1. [Quản lý tác vụ nền]:
 *    - Dừng timer Auto Live Sync và Chat Memory GC khi tính năng tắt hoặc rời trang xem.
 *    - Bỏ qua mutation trong vùng bình luận và overlay chat, giữ theo dõi trong player.
 *    - Bỏ fallback innerText khi đọc thông báo.
 * 2. [Bản trước: tối ưu quét DOM]:
 *    - Bỏ quét XPath toàn trang và các lượt quét lặp sau điều hướng.
 * 3. [Bản trước: Chỉ số hiệu năng]:
 *    - Bỏ chỉ số DOM, phân tách Ping và Tốc độ mạng.
 *    - Rút gọn bảng hiệu năng gồm 4 thẻ chuyên dụng cho streaming: RAM Video, FPS Video,
 *      Độ trễ (Ping) và Tốc độ tải (Mbps).
 * 4. [Hệ thống đèn màu 3 trạng thái chuẩn xác]:
 *    - Xanh lá: Trạng thái tốt / Mượt mà.
 *    - Màu vàng: Trạng thái bình thường / Trung bình.
 *    - Màu đỏ: Cảnh báo giật lag / Tốc độ mạng chậm / Ping cao.
 * ============================================================================
 */
