// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.9.19
// @description  YouTube Customizer v3.9.19 — Lưu lịch sử đầy đủ, giới hạn nhật ký nhúng trong userscript ở 10 phiên bản mới nhất.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.9.19
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.19
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.19
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG — 10 VERSION GẦN NHẤT
 * ============================================================================
 * v3.9.19 — Lịch sử đầy đủ được tổng hợp tại CHANGELOG.md; phần này giới hạn 10 phiên bản gần nhất.
 * v3.9.18 — Gỡ huy hiệu ngôi sao khỏi mục Ánh sáng phòng (Ambilight).
 * v3.9.17 — Thay emoji ngôi sao bằng SVG riêng; bỏ animation nhấp nháy.
 * v3.9.16 — Gỡ canvas/CSS thử nghiệm trên scrollbar, bỏ cập nhật canvas theo từng frame và khi cuộn.
 * v3.9.15 — Nhắm đúng scrollbar trang YouTube để áp dụng hiệu ứng track.
 * v3.9.14 — Tắt Ambilight trên Shorts, giữ Ambilight cho video thường.
 * v3.9.13 — Làm trong track scrollbar riêng của Shorts, giữ thumb dễ nhận biết.
 * v3.9.12 — Mở rộng vùng Ambilight Shorts theo nền điện ảnh của YouTube.
 * v3.9.11 — Giữ nguyên stacking/layout Shorts, đặt quầng sáng phía sau nội dung.
 * v3.9.10 — Giới hạn quầng Ambilight quanh player Shorts, giữ nguyên kích thước player.
 * ============================================================================
 */
