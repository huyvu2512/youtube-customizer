// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.8.2
// @description  YouTube Customizer v3.8.2 — Hệ thống đa ngôn ngữ 21 ngôn ngữ, menu nổi ngoài panel, sửa triệt để tự bật Ambilight khi F5/đổi video.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.8.2
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.2
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.2
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.8.2:
 * ============================================================================
 * 1. [Sửa triệt để lỗi tự bật Ambilight]:
 *    - Khắc phục hiện tượng Ambilight tự bật khi F5 hoặc đổi video dù công tắc đang tắt.
 *    - Bổ sung kiểm tra trạng thái nghiêm ngặt và CSS Fail-Safe 2 lớp chống rò rỉ ánh sáng.
 * 2. [Hệ thống Đa ngôn ngữ (i18n)]:
 *    - Hỗ trợ 21 ngôn ngữ phổ biến trên toàn cầu.
 *    - Menu chọn ngôn ngữ nổi độc lập ngoài panel, không bị cắt viền và đổi ngôn ngữ tức thì.
 * ============================================================================
 */
