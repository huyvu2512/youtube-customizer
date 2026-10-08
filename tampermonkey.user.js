// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.7.1
// @description  YouTube Customizer v3.7.1 — Kính mờ xuyên thấu tuyệt đối khung Tìm kiếm (Searchbox) & Playlist panel; Ánh sáng phòng Ambilight rực rỡ không bị che khuất; Sửa lỗi giật video Live.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.7.1
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.1
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.1
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.1:
 * ============================================================================
 * 1. [Khung tìm kiếm & Playlist xuyên thấu tuyệt đối (Crystal Transparency)]:
 *    - Triệt tiêu hoàn toàn các khối nền xám đục hình chữ nhật xếp chồng trên thanh Searchbox; biến khung tìm kiếm và nút micro thành kính xuyên thấu 100%.
 *    - Khử hoàn toàn nền đen đặc của cột thứ hai (#secondary), khung danh sách phát (Playlist panel) và từng thẻ video con, để quầng sáng phòng Ambilight tỏa sáng lộng lẫy xuyên qua.
 * 2. [Sửa triệt để lỗi giật video & tự chuyển luồng xem Live]:
 *    - Tăng ngưỡng snap lên 30s và bỏ double-seek, đồng bộ thời gian thực siêu mượt.
 * ============================================================================
 */
