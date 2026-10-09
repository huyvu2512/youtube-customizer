// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.8.3
// @description  YouTube Customizer v3.8.3 — Tối ưu hóa mượt mà zero-lag khi xem video, mở chuẩn xác panels bình luận/chat toàn màn hình, khôi phục khung video chuẩn gốc cho mọi tỷ lệ video (Shorts/dọc/ngang).
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.8.3
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.3
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.3
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.8.3:
 * ============================================================================
 * 1. [Khôi phục khung video chuẩn gốc & Tương thích 100% video dọc / Shorts]:
 *    - Gỡ bỏ quy tắc ép layout watch-flexy chiều ngang cố định làm vỡ khung hình video dọc (9:16).
 *    - Giữ trọn vẹn thuật toán tính toán kích thước responsive nguyên bản của YouTube.
 * 2. [Mở bảng điều khiển trong Fullscreen (Bình luận, Chat, Đặt câu hỏi)]:
 *    - Gỡ bỏ quy tắc bóp nghẹt #panels-full-bleed-container và movie_player trong fullscreen.
 *    - Bấm nút bình luận/chat trên thanh công cụ toàn màn hình mở panel mượt mà, đúng chuẩn.
 * 3. [Tối ưu hóa hiệu năng & Xem trước thumbnail mượt mà (Zero Lag)]:
 *    - Bộ nhớ đệm (cache) bounding rects cho Ambilight, triệt tiêu hoàn toàn forced layout reflow.
 *    - Di chuột xem trước video trong sidebar gợi ý mượt mà 100%, không bị chập chờn hay giật lag.
 * ============================================================================
 */
