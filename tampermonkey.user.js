// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.6.9
// @description  YouTube Customizer v3.6.9 — Kính mờ xuyên thấu khung Tìm kiếm, Playlist và Filter Chips; Sửa lỗi bấm nút Trực tiếp (Live badge); Tối ưu Ambilight Full-Width Cinema.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.6.9
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.9
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.6.9
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.6.9:
 * ============================================================================
 * 1. [Khung trong suốt & Kính mờ cao cấp]:
 *    - Làm trong suốt khung tìm kiếm (Searchbox), bảng danh sách phát (Playlist panel) và dải thẻ phân loại (Filter chips), hòa quyện cùng ánh sáng phòng.
 * 2. [Sửa lỗi nút Trực tiếp (Live Badge)]:
 *    - Tuyệt đối không chặn sự kiện click vào nút Trực tiếp (.ytp-live-badge) khi đang tua lại xem đoạn trước live.
 *    - Bấm nút Trực tiếp lập tức nhảy ngay về thời gian thực của luồng phát và biến chấm đỏ.
 * ============================================================================
 */
