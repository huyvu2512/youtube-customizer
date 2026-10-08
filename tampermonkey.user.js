// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.5.8
// @description  YouTube Customizer v3.5.8 — Chuyển cơ chế cố định thời gian đã phát thành mặc định ngầm 100%, bỏ toggle thừa khỏi menu cài đặt.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.5.8
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.8
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.8
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.8:
 * ============================================================================
 * 1. [Mặc định hóa cơ chế hiển thị Thời gian đã phát]:
 *    - Tự động khóa và khôi phục mốc thời gian đã phát (vd: 1:47 / 4:13) thành cơ chế chạy ngầm mặc định 100%.
 *    - Ngăn chặn triệt để tình trạng ghost-click hoặc nhảy sang thời gian đếm ngược âm (-3:13) mà không cần cấu hình.
 *    - Loại bỏ công tắc thừa khỏi Tab 3 (Trình phát), trả lại giao diện gọn gàng và tinh tế.
 * ============================================================================
 */
