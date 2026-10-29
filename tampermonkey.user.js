// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.9.28
// @description  YouTube Customizer v3.9.28 — Tự mở Live Chat Replay và ẩn khung gốc khi phóng to.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.9.28
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.28
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.28
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG — 10 VERSION GẦN NHẤT
 * ============================================================================
 * v3.9.28 — Tự mở Live Chat Replay; ẩn khung gốc khi phóng to.
 * v3.9.27 — Áp chất lượng một lần; dùng chat gốc cho Live Chat Replay.
 * v3.9.26 — Chỉ mở cập nhật thủ công; bỏ tự tải lại khi đổi tab.
 * v3.9.25 — Giữ xử lý bấm gốc của YouTube trong Chế độ Chỉ Âm Thanh.
 * v3.9.24 — Bổ sung bấm phát/tạm dừng; ép chất lượng thấp nhất và khôi phục mức ưu tiên.
 * v3.9.23 — Tăng tốc tua Numpad 4/6 và mở rộng nhận diện iframe Live Chat.
 * v3.9.22 — Tăng tốc tua khi giữ Numpad 4/6; khôi phục kết nối Live Chat nền.
 * v3.9.21 — Khôi phục trạng thái ổn định từ v3.9.19 và cập nhật quy tắc phát triển trong AGENTS.md.
 * v3.9.20 — Thử nghiệm tính năng xem trước Live Stream thời gian thực (360p) với cơ chế Sliding Window.
 * v3.9.19 — Lịch sử đầy đủ được tổng hợp tại CHANGELOG.md; phần này giới hạn 10 phiên bản gần nhất.
 * ============================================================================
 */
