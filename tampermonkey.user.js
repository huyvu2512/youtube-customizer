// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.7.0
// @description  YouTube Customizer v3.7.0 — Sửa lỗi giật video và tự chuyển khi xem trực tiếp; Kính mờ xuyên thấu Searchbox, Playlist, Filter Chips; Sửa nút Trực tiếp; Tối ưu Ambilight Full-Width Cinema.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.7.0
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.0
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.0
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.0:
 * ============================================================================
 * 1. [Sửa triệt để lỗi giật video & tự chuyển luồng xem Live]:
 *    - Tăng ngưỡng snap từ 10s lên 30s để loại bỏ hiện tượng bị giật / tua đột ngột khi vừa mở video trực tiếp.
 *    - Loại bỏ lệnh kép double-seek trong snapToLive gây xung đột bộ giải mã YouTube.
 *    - Tăng chu kỳ kiểm tra đồng bộ lên 3 giây và hạ tốc độ đuổi kịp xuống 1.04x siêu mượt.
 * 2. [Khung trong suốt & Kính mờ cao cấp]:
 *    - Làm trong suốt khung tìm kiếm (Searchbox), bảng danh sách phát (Playlist panel) và dải thẻ phân loại (Filter chips), hòa quyện cùng ánh sáng phòng.
 * 3. [Sửa lỗi nút Trực tiếp (Live Badge)]:
 *    - Tuyệt đối không chặn sự kiện click vào nút Trực tiếp (.ytp-live-badge) khi đang tua lại xem đoạn trước live.
 *    - Bấm nút Trực tiếp lập tức nhảy ngay về thời gian thực của luồng phát và biến chấm đỏ.
 * ============================================================================
 */
