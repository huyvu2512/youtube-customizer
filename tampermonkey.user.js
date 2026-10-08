// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.7.5
// @description  YouTube Customizer v3.7.5 — Thanh tìm kiếm Light theme trong suốt 100%; Khắc phục viền đen letterbox; Ambilight rực rỡ, sống động tương đương Dark theme.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.7.5
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.5
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.7.5
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.5:
 * ============================================================================
 * 1. [Thanh tìm kiếm Light Theme trong suốt 100%]:
 *    - Loại bỏ hoàn toàn nền đục trắng mờ của ô tìm kiếm, nút kính lúp và nút mic, trong suốt tuyệt đối xuyên thấu Ambilight.
 * 2. [Tối ưu Ambilight Giao diện Sáng rực rỡ ngang Dark Theme]:
 *    - Tự động bỏ qua viền đen (Cinematic Letterbox 21:9 / 2.39:1) để luôn bắt đúng màu sắc sống động của video thay vì viền đen gây mờ xám.
 *    - Tăng độ bão hòa saturate(220%) và tương phản contrast(115%) cho Ambilight ở nền sáng cực kỳ nổi bật và có chiều sâu.
 * ============================================================================
 */
