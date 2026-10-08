// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.5.6
// @description  YouTube Customizer v3.5.6 — Tự động mở trang cập nhật, đếm ngược 10s tự F5 và tự reload khi quay lại tab sau khi cập nhật, hiển thị "Đã cập nhật".
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.5.6
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.6
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.5.6
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.6:
 * ============================================================================
 * 1. [Nâng cấp cơ chế Cập nhật tự động & Tải lại trang]:
 *    - Tự động mở ngay liên kết cài đặt bản mới Tampermonkey khi phát hiện bản cập nhật.
 *    - Bộ đếm ngược 10 giây tự động F5 kèm nút bấm F5 tức thì.
 *    - Cơ chế Smart Return Reload: Tự động tải lại trang ngay khi người dùng cập nhật xong và quay lại tab YouTube.
 * 2. [Chuẩn hóa hiển thị]:
 *    - Đổi trạng thái khi ở bản mới nhất thành "Đã cập nhật" tinh tế, trực quan.
 * ============================================================================
 */
