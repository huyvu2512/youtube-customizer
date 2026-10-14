// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.8.6
// @description  YouTube Customizer v3.8.6 — Triệt tiêu thông báo gián đoạn video (Ad-block interruption prompt) & Khóa an toàn nút toàn màn hình khi đang nạp luồng phát.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.8.6
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.6
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.6
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.8.6:
 * ============================================================================
 * 1. [Khắc phục triệt để thông báo gián đoạn do chặn quảng cáo (Interruption Prompt)]:
 *    - YouTube vừa cập nhật cơ chế phát hiện chặn quảng cáo (uBlock/Adblock) hiển thị hộp thoại
 *      "Bạn đang gặp sự cố gây gián đoạn? Tìm hiểu lý do" / "Experiencing interruptions? Find out why".
 *    - Bổ sung Observer siêu nhẹ chuyên biệt và bộ lọc CSS 0ms tự động đóng, xóa thông báo và tiếp tục phát video tức thì.
 * 2. [Khóa an toàn nút Toàn màn hình khi nạp luồng phát (Buffering Fullscreen Lock)]:
 *    - Khi video đang xoay vòng tải (0:00), nút phóng to và thao tác nhấp đúp sẽ được tạm khóa an toàn
 *      ngăn chặn triệt để lỗi phóng to nhầm toàn bộ trang web trình duyệt thay vì khung video player.
 *    - Tự động mở khóa tức thì ngay khi video sẵn sàng phát (canplay/playing), kèm cơ chế timeout dự phòng 3 giây.
 * ============================================================================
 */
