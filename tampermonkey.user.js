// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.9.3
// @description  YouTube Customizer v3.9.3 — Dừng timer tính năng khi tắt và lọc mutation không liên quan.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.9.3
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.3
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.3
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.9.3:
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
