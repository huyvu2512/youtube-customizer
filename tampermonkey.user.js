// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.9.22
// @description  YouTube Customizer v3.9.22 — Sửa phím tua Numpad khi giữ và khôi phục kết nối Live Chat nền.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.9.22
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.22
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.22
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG — 10 VERSION GẦN NHẤT
 * ============================================================================
 * v3.9.22 — Sửa tua liên tục bằng Numpad 4/6 và thử kết nối lại Live Chat nền khi iframe không phản hồi.
 * v3.9.21 — Khôi phục trạng thái ổn định từ v3.9.19 và cập nhật quy tắc phát triển trong AGENTS.md.
 * v3.9.20 — Thử nghiệm tính năng xem trước Live Stream thời gian thực (360p) với cơ chế Sliding Window.
 * v3.9.19 — Lịch sử đầy đủ được tổng hợp tại CHANGELOG.md; phần này giới hạn 10 phiên bản gần nhất.
 * v3.9.18 — Gỡ huy hiệu ngôi sao khỏi mục Ánh sáng phòng (Ambilight).
 * v3.9.17 — Thay emoji ngôi sao bằng SVG riêng; bỏ animation nhấp nháy.
 * v3.9.16 — Gỡ canvas/CSS thử nghiệm trên scrollbar, bỏ cập nhật canvas theo từng frame và khi cuộn.
 * v3.9.15 — Nhắm đúng scrollbar trang YouTube để áp dụng hiệu ứng track.
 * v3.9.14 — Tắt Ambilight trên Shorts, giữ Ambilight cho video thường.
 * v3.9.13 — Làm trong track scrollbar riêng của Shorts, giữ thumb dễ nhận biết.
 * ============================================================================
 */
