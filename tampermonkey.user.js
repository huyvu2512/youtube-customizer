// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.4.0
// @description  YouTube Customizer v3.4.0 — Khắc phục lỗi tua video nhảy cóc 20s trên phím tắt A-D & Numpad, chuẩn hóa tài liệu & tối ưu hiệu năng.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.4.0
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.4.0
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.4.0
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.4.0:
 * ============================================================================
 * 1. [Sửa lỗi] Khắc phục triệt để lỗi tua video nhảy cóc 20s (như bị kích đúp) khi bấm phím A/D hoặc Numpad 4/6:
 *    - Loại bỏ khối fallback 60ms và lệnh seekBy thừa thãi gây kích tua lần 2.
 *    - Chuẩn hóa dispatch phím duy nhất 1 lần và chặn repeat phím khi nhấn giữ.
 * 2. [Tài liệu] Chuẩn hóa toàn bộ bộ tài liệu dự án:
 *    - Bổ sung Chính sách bảo mật (SECURITY.md).
 *    - Tái cấu trúc README.md chuyên nghiệp kèm bảng tra cứu tính năng & phím tắt.
 * ============================================================================
 */
