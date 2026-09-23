// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.3.2
// @description  YouTube Customizer v3.3.2 — Xử lý triệt để tính năng Tắt trò chuyện trực tiếp (Native Live Chat) với cơ chế 3 tầng InnerTube, WebComponent & DOM selectors tiếng Việt.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.3.2
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.2
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.2
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.2:
 * ============================================================================
 * 1. [Sửa lỗi triệt để] Tính năng "Tắt trò chuyện trực tiếp" (Hide Native Live Chat):
 *    - Đón đầu dữ liệu gốc InnerTube (`yt-page-data-fetched`): đặt `initialDisplayState = 'LIVE_CHAT_DISPLAY_STATE_COLLAPSED'`
 *      để YouTube khởi tạo khung chat ở trạng thái thu gọn ngay từ đầu, loại bỏ hoàn toàn hiện tượng nhấp nháy hay bị kẹt mở.
 *    - Tác động trực tiếp vào WebComponent `<ytd-live-chat-frame>`: cập nhật thuộc tính và trạng thái `collapsed` native.
 *    - Mở rộng toàn diện bộ selector nút đóng/thu gọn chat tiếng Việt và tiếng Anh ("Ẩn cuộc trò chuyện", "Thu gọn", "Hide chat", v.v.).
 *    - Khắc phục lỗi khóa cờ `userManuallyOpenedChat` sai lệch khi vào chế độ toàn màn hình hoặc click nhầm.
 *    - Khi bật công tắc trong bảng cài đặt: ép thu gọn tức thì khung chat đang mở mà không cần tải lại trang.
 * ============================================================================
 */
