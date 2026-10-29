// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.9.33
// @description  YouTube Customizer v3.9.33 — Áp chất lượng ban đầu rồi cho phép đổi thủ công.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.9.33
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.33
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.33
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG — 10 VERSION GẦN NHẤT
 * ============================================================================
 * v3.9.33 — Áp chất lượng ban đầu, sau đó cho phép chọn thủ công.
 * v3.9.32 — Phủ khoảng đen khi phóng to mà không cắt khung hình.
 * v3.9.31 — Nhận diện Replay từ cấu trúc YouTube, không phụ thuộc ngôn ngữ.
 * v3.9.30 — Khôi phục chất lượng thích ứng khi chọn Tự động.
 * v3.9.29 — Bấm nút Replay gốc để khởi tạo khung chat ẩn.
 * v3.9.28 — Tự mở Live Chat Replay; ẩn khung gốc khi phóng to.
 * v3.9.27 — Áp chất lượng một lần; dùng chat gốc cho Live Chat Replay.
 * v3.9.26 — Chỉ mở cập nhật thủ công; bỏ tự tải lại khi đổi tab.
 * v3.9.25 — Giữ xử lý bấm gốc của YouTube trong Chế độ Chỉ Âm Thanh.
 * v3.9.24 — Bổ sung bấm phát/tạm dừng; ép chất lượng thấp nhất và khôi phục mức ưu tiên.
 * ============================================================================
 */
