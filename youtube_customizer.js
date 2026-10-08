// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.8.1
// @description  YouTube Customizer v3.8.1 — Tự động kích hoạt & dịch phụ đề Live Stream/VOD chuẩn YouTube gốc, ghim ngôn ngữ ưu tiên lên đầu menu và tối ưu huy hiệu tính năng nổi bật.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.3:
 * ============================================================================
 * 1. [Tính năng mới: Công tắc gạt Tự động cập nhật]:
 *    - Thêm công tắc gạt "Tự động cập nhật" trong Tab Thông tin (Menu bánh răng).
 *    - Mỗi khi vào YouTube, script tự động gọi GitHub API kiểm tra phiên bản mới; nếu phát hiện bản mới sẽ lập tức tự động trỏ sang link cập nhật Tampermonkey.
 *    - Tích hợp Session Guard chống lặp chuyển hướng khi người dùng nhấn Back.
 * 2. [Thiết kế Frameless & Trong suốt 100%]:
 *    - Playlist & Khung mô tả (Description box) trong suốt hoàn toàn, không hiện khung viền.
 * ============================================================================
 */
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/core/constants.js
  var APP_VERSION, CONFIG_KEY, SUBTITLES_SVG, CHAT_OFF_SVG, EMOJI_OFF_SVG, GEAR_SVG, GRID_SVG, SHORTS_SVG, GAMEPAD_SVG, YOUTUBE_SVG, SEARCH_SVG, KEYBOARD_SVG, CROWN_SVG, COMPASS_SVG, LAYOUT_TAB_SVG, SHIELD_TAB_SVG, PLAYER_TAB_SVG, POST_SVG, ENDSCREEN_SVG, BELL_OFF_SVG, WATERMARK_SVG, REWIND_SVG, MESSAGE_SVG, RADIO_SVG, OPTIMIZE_TAB_SVG, CPU_SVG, BROOM_SVG, HEADPHONES_SVG, INFINITY_SVG, SHIELD_CHECK_SVG, PLAYLIST_SVG, AMBIENT_LIGHT_SVG, QUALITY_SVG, INFO_TAB_SVG, UPDATE_SVG, USER_SVG, BUG_SVG, GIFT_SVG, EXTERNAL_LINK_SVG, SHOPPING_SVG;
  var init_constants = __esm({
    "src/core/constants.js"() {
      APP_VERSION = "3.8.1";
      CONFIG_KEY = "ytc_config";
      SUBTITLES_SVG = `<svg viewBox="0 0 24 24"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V6h14v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/></svg>`;
      CHAT_OFF_SVG = `<svg viewBox="0 0 24 24"><path d="M20 4v10.59l2 2V4c0-1.1-.9-2-2-2H5.41l2 2H20zM2.81 2.81L1.39 4.22l2.61 2.61V22l4-4h8.59l3.18 3.19 1.41-1.41L2.81 2.81zM8.83 16l-2.83 2.83V8.83L16 16H8.83z"/></svg>`;
      EMOJI_OFF_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9z"/><circle cx="8.5" cy="9.5" r="1.5"/><circle cx="15.5" cy="9.5" r="1.5"/><path d="M12 17.5c2.1 0 3.88-1.2 4.6-3h-9.2c.72 1.8 2.5 3 4.6 3z"/></svg>`;
      GEAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>`;
      GRID_SVG = `<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z"/></svg>`;
      SHORTS_SVG = `<svg viewBox="0 0 24 24"><path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.5v-5l4.5 2.5-4.5 2.5z"/></svg>`;
      GAMEPAD_SVG = `<svg viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S20.17 9 21 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`;
      YOUTUBE_SVG = `<svg viewBox="0 0 24 24"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/></svg>`;
      SEARCH_SVG = `<svg viewBox="0 0 24 24"><path d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>`;
      KEYBOARD_SVG = `<svg viewBox="0 0 24 24"><path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>`;
      CROWN_SVG = `<svg viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1z"/></svg>`;
      COMPASS_SVG = `<svg viewBox="0 0 24 24"><path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1 1.1-.49 1.1-1.1-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"/></svg>`;
      LAYOUT_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M4 4h16v4H4V4zm0 6h7v10H4V10zm9 0h7v10h-7V10z"/></svg>`;
      SHIELD_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>`;
      PLAYER_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/></svg>`;
      POST_SVG = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`;
      ENDSCREEN_SVG = `<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-4h6v4zm6 0h-5v-4h5v4zm0-6H6V7h12v4z"/></svg>`;
      BELL_OFF_SVG = `<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>`;
      WATERMARK_SVG = `<svg viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-7-6h5v4h-5v-4z"/></svg>`;
      REWIND_SVG = `<svg viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>`;
      MESSAGE_SVG = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zm-9-5h2v2h-2zm-4 0h2v2H7zm8 0h2v2h-2z"/></svg>`;
      RADIO_SVG = `<svg viewBox="0 0 24 24"><path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-2.18-1.36a4.5 4.5 0 0 0 0 6.72l-1.42 1.42a6.5 6.5 0 0 1 0-9.56l1.42 1.42zm4.36 0l1.42-1.42a6.5 6.5 0 0 1 0 9.56l-1.42-1.42a4.5 4.5 0 0 0 0-6.72zM7 5.82a8.5 8.5 0 0 0 0 12.36l-1.42 1.42a10.5 10.5 0 0 1 0-15.2L7 5.82zm10 0l1.42-1.42a10.5 10.5 0 0 1 0 15.2L17 18.18a8.5 8.5 0 0 0 0-12.36z"/></svg>`;
      OPTIMIZE_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M13 2L3 14h7v8l10-12h-7l3-8z"/></svg>`;
      CPU_SVG = `<svg viewBox="0 0 24 24"><path d="M4 7h2v10H4zm14 0h2v10h-2zm-9-3h2v2H9zm4 0h2v2h-2zM9 18h2v2H9zm4 0h2v2h-2zM7 6h10v12H7z"/></svg>`;
      BROOM_SVG = `<svg viewBox="0 0 24 24"><path d="M19.36 2.72l1.42 1.42-4.95 4.95-1.41-1.42 4.94-4.95zm-6.36 6.36l1.41 1.42-2.12 2.12-1.41-1.41 2.12-2.13zm-3.54 3.54l1.41 1.41L5 19.83V22h2.17l5.79-5.79 1.42 1.42L7.59 24H3v-4.59l7.46-7.33z"/></svg>`;
      HEADPHONES_SVG = `<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1a7 7 0 0 1 14 0v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z"/></svg>`;
      INFINITY_SVG = `<svg viewBox="0 0 24 24"><path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.98l-2.83-2.83A5.33 5.33 0 0 0 5.4 6.62C2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53L12 13.02l2.83 2.83c.97.97 2.33 1.53 3.77 1.53 2.98 0 5.4-2.42 5.4-5.38s-2.42-5.38-5.4-5.38zm-13.2 8.78c-1.87 0-3.4-1.53-3.4-3.4s1.53-3.4 3.4-3.4c.91 0 1.77.36 2.38.97l2.43 2.43-2.43 2.43c-.61.61-1.47.97-2.38.97zm13.2 0c-.91 0-1.77-.36-2.38-.97L13.79 12l2.43-2.43c.61-.61 1.47-.97 2.38-.97 1.87 0 3.4 1.53 3.4 3.4s-1.53 3.4-3.4 3.4z"/></svg>`;
      SHIELD_CHECK_SVG = `<svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>`;
      PLAYLIST_SVG = `<svg viewBox="0 0 24 24"><path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z"/></svg>`;
      AMBIENT_LIGHT_SVG = `<svg viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>`;
      QUALITY_SVG = `<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM8 15h2v-2h1v2h1.5v-6H11v2.5h-1V9H8v6zm6.5-6h-3v6h3c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5zm0 4.5h-1.5v-3h1.5v3z"/></svg>`;
      INFO_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;
      UPDATE_SVG = `<svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>`;
      USER_SVG = `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
      BUG_SVG = `<svg viewBox="0 0 24 24"><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg>`;
      GIFT_SVG = `<svg viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.65-.5-.65C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1h-2.22l.8-1.07C13.86 4.38 14.4 4 15 4zM9 4c.6 0 1.14.38 1.42.93L11.22 6H9c-.55 0-1-.45-1-1s.45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76V14h2V8.76L15.38 12 17 10.83 14.92 8H20v6z"/></svg>`;
      EXTERNAL_LINK_SVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>`;
      SHOPPING_SVG = `<svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"/></svg>`;
    }
  });

  // src/core/config.js
  function loadConfig() {
    try {
      const stored = localStorage.getItem(CONFIG_KEY) || localStorage.getItem("ytc_config_v2") || localStorage.getItem("ytc_config_persistent") || localStorage.getItem("ytc_config_v3");
      if (stored) {
        const parsed = JSON.parse(stored);
        const cfg = Object.assign({}, DEFAULT_CONFIG, parsed);
        cfg.chatOverlay = "off";
        return cfg;
      }
    } catch (e) {
    }
    return Object.assign({}, DEFAULT_CONFIG);
  }
  function saveConfig(cfg) {
    try {
      const toSave = Object.assign({}, cfg, { chatOverlay: "off" });
      const json = JSON.stringify(toSave);
      localStorage.setItem(CONFIG_KEY, json);
      localStorage.setItem("ytc_config_v2", json);
    } catch (e) {
    }
  }
  function onConfigChange(fn) {
    if (typeof fn === "function" && !configListeners.includes(fn)) {
      configListeners.push(fn);
    }
  }
  function applyConfigToRoot() {
    const root = document.documentElement;
    if (!root) return;
    root.classList.toggle("ytc-hide-shorts", !!currentConfig.hideShorts);
    root.classList.toggle("ytc-hide-playables", !!currentConfig.hidePlayables);
    root.classList.toggle("ytc-hide-members", !!currentConfig.hideMembersOnly);
    root.classList.toggle("ytc-hide-mixes", !!currentConfig.hideMixes);
    root.classList.toggle("ytc-hide-explore", !!currentConfig.hideExploreTopics);
    root.classList.toggle("ytc-hide-community", !!currentConfig.hideCommunity);
    root.classList.toggle("ytc-hide-endscreen", !!currentConfig.hideEndscreen);
    root.classList.toggle("ytc-hide-watermark", !!currentConfig.hideWatermark);
    root.classList.toggle("ytc-hide-shopping", !!currentConfig.hideShopping);
    root.classList.toggle("ytc-auto-dismiss", !!currentConfig.autoDismissPromos);
    root.classList.toggle("ytc-premium-logo", !!currentConfig.premiumLogo);
    root.classList.toggle("ytc-clean-search", !!currentConfig.cleanSearch);
    root.classList.toggle("ytc-hide-native-chat", !!currentConfig.hideNativeLiveChat);
    root.classList.toggle("ytc-hide-chat-emojis", !!currentConfig.hideChatEmojis);
    root.classList.toggle("ytc-audio-only", !!currentConfig.audioOnlyMode);
    root.classList.toggle("ytc-ambient-lighting", !!currentConfig.ambientLighting);
    root.setAttribute("data-ytc-cols", String(currentConfig.columns || 3));
    root.setAttribute("data-ytc-chat", currentConfig.chatOverlay || "off");
    if (document.body) {
      document.body.classList.toggle("ytc-hide-shorts", !!currentConfig.hideShorts);
      document.body.classList.toggle("ytc-hide-playables", !!currentConfig.hidePlayables);
      document.body.classList.toggle("ytc-hide-members", !!currentConfig.hideMembersOnly);
      document.body.classList.toggle("ytc-hide-mixes", !!currentConfig.hideMixes);
      document.body.classList.toggle("ytc-hide-explore", !!currentConfig.hideExploreTopics);
      document.body.classList.toggle("ytc-hide-community", !!currentConfig.hideCommunity);
      document.body.classList.toggle("ytc-hide-endscreen", !!currentConfig.hideEndscreen);
      document.body.classList.toggle("ytc-hide-watermark", !!currentConfig.hideWatermark);
      document.body.classList.toggle("ytc-hide-shopping", !!currentConfig.hideShopping);
      document.body.classList.toggle("ytc-auto-dismiss", !!currentConfig.autoDismissPromos);
      document.body.classList.toggle("ytc-premium-logo", !!currentConfig.premiumLogo);
      document.body.classList.toggle("ytc-clean-search", !!currentConfig.cleanSearch);
      document.body.classList.toggle("ytc-hide-native-chat", !!currentConfig.hideNativeLiveChat);
      document.body.classList.toggle("ytc-hide-chat-emojis", !!currentConfig.hideChatEmojis);
      document.body.classList.toggle("ytc-audio-only", !!currentConfig.audioOnlyMode);
      document.body.classList.toggle("ytc-ambient-lighting", !!currentConfig.ambientLighting);
      document.body.setAttribute("data-ytc-cols", String(currentConfig.columns || 3));
      document.body.setAttribute("data-ytc-chat", currentConfig.chatOverlay || "off");
    }
    broadcastConfigToIframes(currentConfig);
    configListeners.forEach((fn) => {
      try {
        fn(currentConfig);
      } catch (e) {
      }
    });
  }
  function broadcastConfigToIframes(cfg = currentConfig) {
    if (typeof window === "undefined") return;
    const frames = document.querySelectorAll("iframe");
    frames.forEach((frame) => {
      try {
        if (frame.contentWindow) {
          frame.contentWindow.postMessage({ type: "YTC_CONFIG_UPDATED", config: cfg }, "*");
        }
      } catch (e) {
      }
    });
  }
  var DEFAULT_CONFIG, currentConfig, configListeners;
  var init_config = __esm({
    "src/core/config.js"() {
      init_constants();
      init_constants();
      DEFAULT_CONFIG = {
        columns: 3,
        // 3, 4 hoặc 5 cột (mặc định 3 theo chuẩn YouTube)
        hideShorts: false,
        // Ẩn Shorts hoàn toàn (mặc định tắt)
        hidePlayables: false,
        // Ẩn Chơi game (Playables) (mặc định tắt)
        hideMembersOnly: false,
        // Ẩn mục video Hội viên (mặc định tắt)
        hideMixes: false,
        // Ẩn Danh sách phát & Mix (Playlists / Radio) (mặc định tắt)
        hideExploreTopics: false,
        // Ẩn Khám phá các chủ đề khác (mặc định tắt)
        hideCommunity: false,
        // Ẩn bài đăng cộng đồng (mặc định tắt)
        hideEndscreen: false,
        // Ẩn thẻ kết thúc & chú thích (mặc định tắt)
        hideWatermark: false,
        // Ẩn logo hình mờ kênh ở góc video (mặc định tắt)
        unlockLiveDvr: false,
        // Mở khóa tua lại Live Stream (mặc định tắt)
        chatOverlay: "off",
        // 'off', 'danmaku', 'streamer' (luôn mặc định tắt)
        chatOverlayHideOnRewind: false,
        // Tự động ẩn khi tua về quá khứ (mặc định tắt)
        autoDismissPromos: false,
        // Tự động đóng banner khuyến mại & thông báo gián đoạn (mặc định tắt)
        autoLiveSync: false,
        // Tự động giữ mốc trực tiếp khi xem Live Stream (mặc định tắt)
        hideShopping: false,
        // Ẩn bảng sản phẩm gắn thẻ (YouTube Shopping), nút túi xách mua sắm (mặc định tắt)
        premiumLogo: false,
        // Logo YouTube Premium (mặc định tắt)
        cleanSearch: false,
        // Ẩn video tài trợ / quảng cáo tìm kiếm (mặc định tắt)
        keyboardControls: false,
        // Phím tắt A-S-D & Numpad (mặc định tắt)
        hideNativeLiveChat: false,
        // Tự động tắt khung trò chuyện trực tiếp khi mở video (mặc định tắt)
        hideChatEmojis: false,
        // Ẩn biểu tượng cảm xúc (Emoji/Sticker) trong Live Chat (mặc định tắt)
        blockAv1: false,
        // Chặn AV1 / Ép bộ giải mã phần cứng H.264 & VP9 (mặc định tắt)
        chatMemoryGc: false,
        // Dọn dẹp DOM tin nhắn Live Chat chống tràn RAM (mặc định tắt)
        audioOnlyMode: false,
        // Chế độ Radio / Chỉ phát âm thanh, ngắt render video (mặc định tắt)
        preventAutoPause: false,
        // Chặn tự dừng video "Bạn vẫn đang xem chứ?" (mặc định tắt)
        preferredQuality: "auto",
        // Ưu tiên độ phân giải video: 'auto', 'max', '1440p', '1080p', '720p'
        lockElapsedTime: true,
        // Cố định thời gian đã phát, chống tự nhảy sang thời gian còn lại (mặc định bật)
        ambientLighting: false,
        // Hiệu ứng ánh sáng phòng (Ambilight) phản chiếu viền video (mặc định tắt)
        autoSubtitles: false,
        // Tự động kích hoạt & tối ưu phụ đề cho video và Live Stream (mặc định tắt)
        captionLanguage: "auto",
        // Ngôn ngữ phụ đề ưu tiên: 'auto', 'vi', 'en', 'ja', 'ko', 'zh', ...
        autoUpdate: false
        // Tự động kiểm tra & trỏ đến bản cập nhật mới khi vào YouTube (mặc định tắt)
      };
      currentConfig = loadConfig();
      configListeners = [];
    }
  });

  // src/core/utils.js
  function setElementHTML(element, htmlString) {
    if (!element) return;
    const str = htmlString != null ? String(htmlString) : "";
    try {
      if (ytcPolicy) {
        element.innerHTML = ytcPolicy.createHTML(str);
        return;
      }
      if (window.trustedTypes?.defaultPolicy) {
        element.innerHTML = window.trustedTypes.defaultPolicy.createHTML(str);
        return;
      }
    } catch (e) {
    }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(str, "text/html");
      element.replaceChildren(...doc.body.childNodes);
      return;
    } catch (e) {
    }
    try {
      element.innerHTML = str;
    } catch (e) {
    }
  }
  function rafThrottle(fn) {
    let scheduled = 0;
    return function(...args) {
      if (scheduled) return;
      scheduled = requestAnimationFrame(() => {
        scheduled = 0;
        fn.apply(this, args);
      });
    };
  }
  function whenElement(selector, callback, timeout = 5e3) {
    const found = document.querySelector(selector);
    if (found) {
      callback(found);
      return;
    }
    let timer = null;
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearTimeout(timer);
        observer.disconnect();
        callback(el);
      }
    });
    const root = document.querySelector("ytd-app") || document.documentElement || document;
    observer.observe(root, { childList: true, subtree: true });
    if (timeout > 0) {
      timer = setTimeout(() => observer.disconnect(), timeout);
    }
  }
  function hasLiveOrChatSupport() {
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) {
      return false;
    }
    if (location.pathname.startsWith("/live")) {
      return true;
    }
    if (document.getElementById("ytc-bg-live-chat")) {
      return true;
    }
    const player = document.querySelector("#movie_player:not(#inline-preview-player)");
    if (player) {
      try {
        if (typeof player.getVideoData === "function") {
          const data = player.getVideoData();
          if (data && (data.isLive || data.isPostLiveDvr)) return true;
        }
        if (typeof player.isLive === "function" && player.isLive()) return true;
      } catch (e) {
      }
    }
    const chatEl = document.querySelector(
      'ytd-live-chat-frame, iframe#chatframe, iframe[src*="/live_chat"], #chat-teaser, #teaser, ytd-engagement-panel-section-list-renderer[target-id*="chat" i], [target-id="engagement-panel-live-chat"], .ytp-live-chat-button, .ytp-chat-button, #actions button[aria-label*="trò chuyện" i], #actions button[aria-label*="chat" i], #top-level-buttons-computed button[aria-label*="trò chuyện" i], #top-level-buttons-computed button[aria-label*="chat" i]'
    );
    if (chatEl) return true;
    const chatBox = document.querySelector("#chat.ytd-watch-flexy, #chat-container");
    if (chatBox) {
      const hasContent = chatBox.querySelector("ytd-live-chat-frame, iframe, #chat-teaser, #teaser, button");
      if (hasContent) return true;
    }
    return false;
  }
  function showToast(message, duration = 3e3) {
    if (!document.body) return;
    let toast = document.getElementById("ytc-toast-notification");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "ytc-toast-notification";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("ytc-toast-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("ytc-toast-show");
    }, duration);
  }
  var ytcPolicy, toastTimer;
  var init_utils = __esm({
    "src/core/utils.js"() {
      ytcPolicy = null;
      if (typeof window !== "undefined" && window.trustedTypes) {
        if (!window.trustedTypes.defaultPolicy) {
          try {
            ytcPolicy = window.trustedTypes.createPolicy("default", {
              createHTML: (html) => html,
              createScript: (script) => script,
              createScriptURL: (url) => url
            });
          } catch (e) {
          }
        }
        if (!ytcPolicy) {
          try {
            ytcPolicy = window.trustedTypes.createPolicy("youtubeCustomizer", {
              createHTML: (html) => html
            });
          } catch (e) {
            try {
              ytcPolicy = window.trustedTypes.defaultPolicy;
            } catch (err) {
            }
          }
        }
      }
      toastTimer = null;
    }
  });

  // src/features/grid.js
  function isHomeFeedPath() {
    const p = location.pathname;
    return p === "/" || p.startsWith("/feed") || p.startsWith("/@") || p.startsWith("/channel");
  }
  function applyHomeGridColumns() {
    if (!isHomeFeedPath()) return;
    const cols = currentConfig.columns || 3;
    const colStr = String(cols);
    const grids = document.querySelectorAll("ytd-rich-grid-renderer");
    grids.forEach((grid) => {
      if (!grid.classList.contains("ytc-grid")) {
        grid.classList.add("ytc-grid");
      }
      if (grid.style.getPropertyValue("--ytd-rich-grid-items-per-row") !== colStr) {
        grid.style.setProperty("--ytd-rich-grid-items-per-row", colStr, "important");
      }
      if (grid.style.getPropertyValue("--ytd-rich-grid-posts-per-row") !== colStr) {
        grid.style.setProperty("--ytd-rich-grid-posts-per-row", colStr, "important");
      }
      if (grid.style.getPropertyValue("--ytd-rich-grid-item-max-width") !== "none") {
        grid.style.setProperty("--ytd-rich-grid-item-max-width", "none", "important");
      }
    });
  }
  var init_grid = __esm({
    "src/features/grid.js"() {
      init_config();
    }
  });

  // src/features/shoppingFilter.js
  var shoppingFilter_exports = {};
  __export(shoppingFilter_exports, {
    dismissShoppingPanels: () => dismissShoppingPanels
  });
  function dismissShoppingPanels(scope) {
    if (!currentConfig.hideShopping) return;
    const root = scope && scope.querySelectorAll ? scope : document;
    const shoppingPanels = root.querySelectorAll(
      'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-shopping-panel"],ytd-engagement-panel-section-list-renderer[target-id*="shopping"],ytd-engagement-panel-section-list-renderer[target-id*="product"]'
    );
    shoppingPanels.forEach((panel) => {
      const isExpanded = panel.getAttribute("visibility") === "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED" || panel.hasAttribute("opened");
      if (isExpanded) {
        const closeBtn = panel.querySelector('#visibility-button button, button[aria-label*="Đóng"], button[aria-label*="Close"], #visibility-button');
        if (closeBtn) {
          try {
            closeBtn.click();
          } catch (e) {
          }
        }
      }
      panel.style.setProperty("display", "none", "important");
      panel.style.setProperty("opacity", "0", "important");
      panel.style.setProperty("pointer-events", "none", "important");
    });
    const shoppingBtns = root.querySelectorAll(
      '.ytp-shopping-button, .ytp-featured-product-banner, .ytp-suggested-action-badge[aria-label*="sản phẩm" i], .ytp-suggested-action-badge[aria-label*="product" i], .ytp-suggested-action-badge[aria-label*="shopping" i]'
    );
    shoppingBtns.forEach((btn) => {
      btn.style.setProperty("display", "none", "important");
      btn.style.setProperty("opacity", "0", "important");
      btn.style.setProperty("pointer-events", "none", "important");
    });
  }
  var init_shoppingFilter = __esm({
    "src/features/shoppingFilter.js"() {
      init_config();
    }
  });

  // src/features/promos.js
  function dismissPromoBanners(scope) {
    if (currentConfig.hideShopping) {
      dismissShoppingPanels(scope);
    }
    if (!currentConfig.autoDismissPromos) return;
    const root = scope && scope.querySelectorAll ? scope : document;
    const promos = root.querySelectorAll("ytd-mealbar-promo-renderer, yt-mealbar-promo-renderer, ytd-upsell-dialog-renderer, ytd-in-feed-survey-renderer, ytd-single-option-survey-renderer");
    promos.forEach((promo) => {
      const dismissBtn = promo.querySelector('#dismiss-button button, yt-button-renderer#dismiss-button button, yt-button-renderer#dismiss-button, #dismiss-button, button[aria-label*="Không"], button[aria-label*="Dismiss"], button[aria-label*="No thanks"]');
      if (dismissBtn) {
        try {
          dismissBtn.click();
        } catch (e) {
        }
      }
    });
    const toasts = root.querySelectorAll("tp-yt-paper-toast, #toast, yt-notification-action-renderer, yt-bubble-hint-renderer");
    toasts.forEach((toast) => {
      const text = (toast.textContent || "").toLowerCase();
      if (text.includes("gián đoạn") || text.includes("interruption") || text.includes("sự cố") || text.includes("troubleshoot") || text.includes("tìm hiểu lý do") || text.includes("find out why")) {
        try {
          if (typeof toast.close === "function") toast.close();
          if (typeof toast.hide === "function") toast.hide();
        } catch (e) {
        }
        const closeBtn = toast.querySelector('button, #close-button, [aria-label*="Đóng"], [aria-label*="Close"], [aria-label*="Dismiss"]');
        if (closeBtn) {
          try {
            closeBtn.click();
          } catch (e) {
          }
        }
        toast.style.setProperty("display", "none", "important");
        toast.style.setProperty("opacity", "0", "important");
        toast.style.setProperty("pointer-events", "none", "important");
        toast.classList.add("ytc-dismissed-toast");
      }
    });
    const playerPopups = root.querySelectorAll("#movie_player .ytp-popup, #movie_player .ytp-suggested-action-badge, #movie_player .ytp-paid-content-overlay");
    playerPopups.forEach((popup) => {
      const text = (popup.textContent || "").toLowerCase();
      if (text.includes("gián đoạn") || text.includes("interruption") || text.includes("sự cố")) {
        popup.style.setProperty("display", "none", "important");
        popup.style.setProperty("opacity", "0", "important");
        popup.style.setProperty("pointer-events", "none", "important");
      }
    });
  }
  var init_promos = __esm({
    "src/features/promos.js"() {
      init_config();
      init_shoppingFilter();
    }
  });

  // src/features/feedFilter.js
  var feedFilter_exports = {};
  __export(feedFilter_exports, {
    scanAndTagFeedContent: () => scanAndTagFeedContent,
    scheduleFeedScan: () => scheduleFeedScan,
    setupFeedShelvesObserver: () => setupFeedShelvesObserver
  });
  function scanAndTagFeedContent(scope) {
    if (!currentConfig.hideMembersOnly && !currentConfig.hideExploreTopics && !currentConfig.hideCommunity && !currentConfig.hideMixes) return;
    const root = scope && scope.querySelectorAll ? scope : document;
    const sections = root.querySelectorAll("ytd-rich-section-renderer:not([data-ytc-shelf-scanned])");
    sections.forEach((sec) => {
      sec.setAttribute("data-ytc-shelf-scanned", "1");
      if (currentConfig.hideMembersOnly) {
        if (sec.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], a[href*="/membership"], a[href*="/memberships"]')) {
          sec.classList.add("ytc-shelf-members");
        } else {
          const text = sec.textContent || "";
          if (text.includes("lợi ích từ hội viên") || text.includes("Ưu tiên hội viên") || text.includes("ưu tiên hội viên") || text.includes("hội viên") && text.includes("YouTube chọn lọc") || text.includes("Get more from memberships") || text.includes("Members only") || text.includes("Members first")) {
            sec.classList.add("ytc-shelf-members");
          }
        }
      }
      if (currentConfig.hideExploreTopics && !sec.classList.contains("ytc-shelf-members")) {
        if (sec.querySelector("yt-chip-cloud-chip-renderer, yt-chip-cloud-renderer, ytd-feed-filter-chip-bar-renderer")) {
          sec.classList.add("ytc-shelf-explore");
        } else {
          const text = sec.textContent || "";
          if (text.includes("Khám phá các chủ đề") || text.includes("Explore other topics") || text.includes("Explore topics")) {
            sec.classList.add("ytc-shelf-explore");
          }
        }
      }
      if (currentConfig.hideCommunity && !sec.classList.contains("ytc-shelf-members") && !sec.classList.contains("ytc-shelf-explore")) {
        if (sec.querySelector("ytd-post-renderer, ytd-backstage-post-renderer, ytd-backstage-post-thread-renderer, ytd-post-multi-image-renderer, ytd-poll-renderer")) {
          sec.classList.add("ytc-shelf-community");
        }
      }
      if (currentConfig.hideMixes && !sec.classList.contains("ytc-shelf-members") && !sec.classList.contains("ytc-shelf-explore") && !sec.classList.contains("ytc-shelf-community")) {
        const titleEl = sec.querySelector("#title, #title-container, yt-formatted-string#title");
        const titleText = (titleEl ? titleEl.textContent : "") || "";
        if (titleText.includes("Danh sách kết hợp") || titleText.includes("Mixes") || titleText.includes("YouTube tạo danh sách phát này")) {
          sec.classList.add("ytc-shelf-mix");
        }
      }
    });
    if (currentConfig.hideMembersOnly) {
      const videoCards = root.querySelectorAll("ytd-rich-item-renderer:not([data-ytc-mem-scanned]), ytd-video-renderer:not([data-ytc-mem-scanned]), ytd-compact-video-renderer:not([data-ytc-mem-scanned])");
      videoCards.forEach((card) => {
        card.setAttribute("data-ytc-mem-scanned", "1");
        if (card.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], [aria-label*="hội viên" i], [aria-label*="Hội viên" i], [aria-label*="Members" i]')) {
          card.classList.add("ytc-item-members");
        } else {
          const badgeArea = card.querySelector("#badges, ytd-badge-supported-renderer, #metadata-line");
          const text = badgeArea ? badgeArea.textContent || "" : "";
          if (text.includes("Ưu tiên hội viên") || text.includes("ưu tiên hội viên") || text.includes("Chỉ dành cho hội viên") || text.includes("chỉ dành cho hội viên") || text.includes("Members first") || text.includes("Members only") || text.includes("Members-only") || text.includes("Early access")) {
            card.classList.add("ytc-item-members");
          }
        }
      });
    }
    if (currentConfig.hideMixes) {
      const mixCards = root.querySelectorAll(
        "ytd-rich-item-renderer:not([data-ytc-mix-scanned]), ytd-video-renderer:not([data-ytc-mix-scanned]), ytd-compact-video-renderer:not([data-ytc-mix-scanned]), ytd-radio-renderer:not([data-ytc-mix-scanned]), ytd-compact-radio-renderer:not([data-ytc-mix-scanned]), ytd-grid-radio-renderer:not([data-ytc-mix-scanned]), ytd-playlist-renderer:not([data-ytc-mix-scanned]), ytd-compact-playlist-renderer:not([data-ytc-mix-scanned])"
      );
      mixCards.forEach((card) => {
        card.setAttribute("data-ytc-mix-scanned", "1");
        const tag = card.tagName.toLowerCase();
        if (tag === "ytd-radio-renderer" || tag === "ytd-compact-radio-renderer" || tag === "ytd-grid-radio-renderer" || tag === "ytd-playlist-renderer" || tag === "ytd-compact-playlist-renderer") {
          card.classList.add("ytc-item-mix");
          return;
        }
        if (card.querySelector("ytd-radio-renderer, ytd-compact-radio-renderer, ytd-playlist-renderer, ytd-compact-playlist-renderer")) {
          card.classList.add("ytc-item-mix");
          return;
        }
        if (card.querySelector('ytd-playlist-thumbnail, ytd-playlist-custom-thumbnail-renderer, a[href*="/playlist?list="]')) {
          card.classList.add("ytc-item-mix");
          return;
        }
        const hasVideoDuration = !!card.querySelector("ytd-thumbnail-overlay-time-status-renderer, span.ytd-thumbnail-overlay-time-status-renderer");
        if (!hasVideoDuration) {
          const titleOrBadge = card.querySelector("#video-title, #title, #metadata") || card;
          const text = titleOrBadge.textContent || "";
          if (text.includes("Danh sách kết hợp") || text.includes("YouTube tạo danh sách phát này") || text.includes("Xem toàn bộ danh sách phát") || text.includes("Xem toàn bộ khoá học") || text.includes("Xem toàn bộ khóa học")) {
            card.classList.add("ytc-item-mix");
          }
        }
      });
    }
  }
  function setupFeedShelvesObserver() {
    scheduleFeedScan(document);
    applyHomeGridColumns();
    dismissPromoBanners(document);
    const attach = (container) => {
      scheduleFeedScan(container);
      applyHomeGridColumns();
      dismissPromoBanners(container);
      new MutationObserver((mutations) => {
        let hasRelevantChanges = false;
        for (const mutation of mutations) {
          if (!mutation.addedNodes.length) continue;
          if (mutation.target.closest && mutation.target.closest("#preview, ytd-video-preview, #inline-preview-player, .html5-video-player, #ytc-streamer-box, #ytc-danmaku-container, ytd-moving-thumbnail-renderer")) {
            continue;
          }
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
              const tag = node.tagName.toLowerCase();
              if (tag === "ytd-rich-grid-row" || tag === "ytd-rich-grid-renderer" || tag === "ytd-rich-item-renderer" || tag === "ytd-rich-section-renderer" || tag === "ytd-continuation-item-renderer") {
                hasRelevantChanges = true;
                break;
              }
              if (node.querySelector && node.querySelector("ytd-rich-grid-row, ytd-rich-item-renderer, ytd-rich-section-renderer")) {
                hasRelevantChanges = true;
                break;
              }
            }
          }
          if (hasRelevantChanges) break;
        }
        if (hasRelevantChanges) {
          scheduleFeedScan(container);
        }
      }).observe(container, { childList: true, subtree: true });
    };
    const target = document.getElementById("page-manager") || document.querySelector("ytd-page-manager") || document.body;
    if (target) attach(target);
    else whenElement("#page-manager", attach);
    const attachPopup = (popupContainer2) => {
      dismissPromoBanners(popupContainer2);
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            dismissPromoBanners(popupContainer2);
            break;
          }
        }
      }).observe(popupContainer2, { childList: true, subtree: true });
    };
    const popupContainer = document.querySelector("ytd-popup-container");
    if (popupContainer) attachPopup(popupContainer);
    else whenElement("ytd-popup-container", attachPopup);
  }
  var scheduleFeedScan;
  var init_feedFilter = __esm({
    "src/features/feedFilter.js"() {
      init_utils();
      init_config();
      init_grid();
      init_promos();
      scheduleFeedScan = rafThrottle((root) => {
        scanAndTagFeedContent(root);
        applyHomeGridColumns();
        dismissPromoBanners(root);
      });
    }
  });

  // src/features/mixFilter.js
  var mixFilter_exports = {};
  __export(mixFilter_exports, {
    cleanMixUrl: () => cleanMixUrl,
    initMixFilter: () => initMixFilter,
    tagWatchMixPanel: () => tagWatchMixPanel
  });
  function isRdMixList(listId) {
    return typeof listId === "string" && listId.startsWith("RD");
  }
  function cleanMixUrl() {
    if (!currentConfig.hideMixes) return;
    if (!window.location.pathname.startsWith("/watch")) return;
    try {
      const url = new URL(window.location.href);
      const list = url.searchParams.get("list");
      if (isRdMixList(list)) {
        url.searchParams.delete("list");
        url.searchParams.delete("index");
        url.searchParams.delete("start_radio");
        const clean = url.pathname + (url.searchParams.toString() ? "?" + url.searchParams.toString() : "");
        window.history.replaceState(window.history.state, "", clean);
      }
    } catch (e) {
    }
  }
  function isCurrentPageMix() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (isRdMixList(urlParams.get("list"))) return true;
    } catch (e) {
    }
    const playlist = document.querySelector("ytd-playlist-panel-renderer, #playlist");
    if (!playlist) return false;
    if (playlist.classList.contains("ytc-item-mix")) return true;
    if (playlist.querySelector('a[href*="list=RD"]')) return true;
    const text = playlist.textContent || "";
    if (text.includes("Danh sách kết hợp") || text.includes("YouTube tạo danh sách phát này") || text.includes("Mixes")) {
      return true;
    }
    return false;
  }
  function handleVideoEnded() {
    if (!currentConfig.hideMixes) return;
    if (!window.location.pathname.startsWith("/watch")) return;
    if (!isCurrentPageMix()) return;
    const autonavBtn = document.querySelector(".ytp-autonav-toggle-button");
    if (autonavBtn && autonavBtn.getAttribute("aria-checked") === "false") {
      return;
    }
    setTimeout(() => {
      const candidateLinks = document.querySelectorAll(
        "#related ytd-compact-video-renderer:not(.ytc-item-mix) a#thumbnail, ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer:not(.ytc-item-mix) a#thumbnail"
      );
      for (const link of candidateLinks) {
        if (!link || !link.href) continue;
        try {
          const u = new URL(link.href, window.location.origin);
          const list = u.searchParams.get("list");
          if (!isRdMixList(list)) {
            link.click();
            return;
          }
        } catch (e) {
        }
      }
    }, 400);
  }
  function bindVideoEndedEvent() {
    const video = document.querySelector("#movie_player video, video.html5-main-video");
    if (!video || video === boundVideoEl) return;
    if (boundVideoEl) {
      boundVideoEl.removeEventListener("ended", handleVideoEnded);
    }
    boundVideoEl = video;
    boundVideoEl.addEventListener("ended", handleVideoEnded);
  }
  function handleLinkClick(e) {
    if (!currentConfig.hideMixes) return;
    const anchor = e.target.closest && e.target.closest('a[href*="list="]');
    if (!anchor || !anchor.href) return;
    try {
      const u = new URL(anchor.href, window.location.origin);
      const list = u.searchParams.get("list");
      if (isRdMixList(list)) {
        u.searchParams.delete("list");
        u.searchParams.delete("index");
        u.searchParams.delete("start_radio");
        anchor.href = u.pathname + (u.searchParams.toString() ? "?" + u.searchParams.toString() : "");
        if (anchor.data && anchor.data.navigationEndpoint && anchor.data.navigationEndpoint.watchEndpoint) {
          delete anchor.data.navigationEndpoint.watchEndpoint.playlistId;
          delete anchor.data.navigationEndpoint.watchEndpoint.index;
          delete anchor.data.navigationEndpoint.watchEndpoint.params;
        }
      }
    } catch (err) {
    }
  }
  function handleYtNavigateStart(e) {
    if (!currentConfig.hideMixes) return;
    if (e && e.detail) {
      if (e.detail.url && e.detail.url.includes("list=RD")) {
        try {
          const u = new URL(e.detail.url, window.location.origin);
          const list = u.searchParams.get("list");
          if (isRdMixList(list)) {
            u.searchParams.delete("list");
            u.searchParams.delete("index");
            u.searchParams.delete("start_radio");
            e.detail.url = u.pathname + (u.searchParams.toString() ? "?" + u.searchParams.toString() : "");
          }
        } catch (err) {
        }
      }
      if (e.detail.endpoint && e.detail.endpoint.watchEndpoint) {
        const ep = e.detail.endpoint.watchEndpoint;
        if (isRdMixList(ep.playlistId)) {
          delete ep.playlistId;
          delete ep.index;
          delete ep.params;
        }
      }
    }
  }
  function tagWatchMixPanel() {
    if (!currentConfig.hideMixes) return;
    const panel = document.querySelector("ytd-playlist-panel-renderer, #playlist");
    if (!panel) return;
    const listParam = new URLSearchParams(window.location.search).get("list");
    if (isRdMixList(listParam) || panel.querySelector('a[href*="list=RD"]')) {
      panel.classList.add("ytc-item-mix");
    } else {
      const text = panel.textContent || "";
      if (text.includes("Danh sách kết hợp") || text.includes("YouTube tạo danh sách phát này") || text.includes("Mixes")) {
        panel.classList.add("ytc-item-mix");
      }
    }
  }
  function initMixFilter() {
    if (isMixFilterInitialized) return;
    isMixFilterInitialized = true;
    document.addEventListener("click", handleLinkClick, true);
    document.addEventListener("yt-navigate-start", handleYtNavigateStart, true);
    document.addEventListener("yt-navigate-finish", () => {
      cleanMixUrl();
      tagWatchMixPanel();
      bindVideoEndedEvent();
    });
    window.addEventListener("popstate", () => {
      cleanMixUrl();
      tagWatchMixPanel();
      bindVideoEndedEvent();
    });
    cleanMixUrl();
    tagWatchMixPanel();
    bindVideoEndedEvent();
    whenElement("#movie_player video, video.html5-main-video", () => {
      bindVideoEndedEvent();
    });
  }
  var isMixFilterInitialized, boundVideoEl;
  var init_mixFilter = __esm({
    "src/features/mixFilter.js"() {
      init_config();
      init_utils();
      isMixFilterInitialized = false;
      boundVideoEl = null;
    }
  });

  // src/features/qualityManager.js
  var qualityManager_exports = {};
  __export(qualityManager_exports, {
    applyPreferredQuality: () => applyPreferredQuality,
    initQualityManager: () => initQualityManager,
    scheduleApplyQuality: () => scheduleApplyQuality
  });
  function syncQualityToLocalStorage(pref, target) {
    try {
      let qualityNum = 1080;
      if (pref === "max") qualityNum = 2160;
      else if (pref === "1440p") qualityNum = 1440;
      else if (pref === "1080p") qualityNum = 1080;
      else if (pref === "720p") qualityNum = 720;
      const payload = {
        data: JSON.stringify({ quality: qualityNum, previousQuality: qualityNum }),
        creation: Date.now(),
        expiration: Date.now() + 2592e6
      };
      localStorage.setItem("yt-player-quality", JSON.stringify(payload));
    } catch (e) {
    }
  }
  function pickTargetQuality(available, pref) {
    if (!available || available.length === 0) return null;
    if (pref === "max") {
      return available[0];
    }
    if (pref === "1440p") {
      const order = ["hd1440", "hd1080", "hd720", "large", "medium", "small", "tiny"];
      return order.find((q) => available.includes(q)) || available[0];
    }
    if (pref === "1080p") {
      const order = ["hd1080", "hd720", "large", "medium", "small", "tiny"];
      return order.find((q) => available.includes(q)) || available[available.length - 1];
    }
    if (pref === "720p") {
      const order = ["hd720", "large", "medium", "small", "tiny"];
      return order.find((q) => available.includes(q)) || available[available.length - 1];
    }
    return null;
  }
  function applyPreferredQuality() {
    if (!currentConfig.preferredQuality || currentConfig.preferredQuality === "auto") return;
    if (!window.location.pathname.startsWith("/watch")) return;
    const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
    if (!player || typeof player.getAvailableQualityLevels !== "function") return;
    try {
      const rawLevels = player.getAvailableQualityLevels();
      if (!Array.isArray(rawLevels) || rawLevels.length === 0) return;
      const available = rawLevels.filter((q) => q && q !== "auto");
      if (available.length === 0) return;
      const target = pickTargetQuality(available, currentConfig.preferredQuality);
      if (!target) return;
      const current = typeof player.getPlaybackQuality === "function" ? player.getPlaybackQuality() : null;
      if (current === target) return;
      if (typeof player.setPlaybackQualityRange === "function") {
        player.setPlaybackQualityRange(target, target);
      }
      if (typeof player.setPlaybackQuality === "function") {
        player.setPlaybackQuality(target);
      }
      syncQualityToLocalStorage(currentConfig.preferredQuality, target);
    } catch (err) {
    }
  }
  function scheduleApplyQuality() {
    if (!currentConfig.preferredQuality || currentConfig.preferredQuality === "auto") return;
    if (!window.location.pathname.startsWith("/watch")) return;
    applyTimeoutIds.forEach((id2) => clearTimeout(id2));
    applyTimeoutIds = [];
    let attempts = 0;
    const maxAttempts = 8;
    const tryApply = () => {
      attempts++;
      const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
      if (player && typeof player.getAvailableQualityLevels === "function") {
        const levels = player.getAvailableQualityLevels();
        if (Array.isArray(levels) && levels.filter((q) => q && q !== "auto").length > 0) {
          applyPreferredQuality();
          return;
        }
      }
      if (attempts < maxAttempts) {
        const id2 = setTimeout(tryApply, Math.min(400 * attempts, 2e3));
        applyTimeoutIds.push(id2);
      }
    };
    const id = setTimeout(tryApply, 600);
    applyTimeoutIds.push(id);
  }
  function initQualityManager() {
    if (isQualityManagerInitialized) return;
    isQualityManagerInitialized = true;
    window.addEventListener("yt-navigate-finish", scheduleApplyQuality);
    window.addEventListener("yt-page-data-updated", scheduleApplyQuality);
    document.addEventListener("loadedmetadata", (e) => {
      if (e.target && e.target.tagName === "VIDEO") {
        scheduleApplyQuality();
      }
    }, true);
    document.addEventListener("playing", (e) => {
      if (e.target && e.target.tagName === "VIDEO") {
        scheduleApplyQuality();
      }
    }, true);
    if (window.location.pathname.startsWith("/watch")) {
      scheduleApplyQuality();
    }
  }
  var applyTimeoutIds, isQualityManagerInitialized;
  var init_qualityManager = __esm({
    "src/features/qualityManager.js"() {
      init_config();
      applyTimeoutIds = [];
      isQualityManagerInitialized = false;
    }
  });

  // src/player/ambientLight.js
  var ambientLight_exports = {};
  __export(ambientLight_exports, {
    applyAmbientLightingState: () => applyAmbientLightingState,
    initAmbientLight: () => initAmbientLight
  });
  function findActiveVideo() {
    const moviePlayer = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
    if (moviePlayer) {
      const v = moviePlayer.querySelector("video.html5-main-video") || moviePlayer.querySelector("video");
      if (v) return v;
    }
    return document.querySelector("video.html5-main-video") || document.querySelector("video");
  }
  function ensureAmbientCanvas() {
    const watchFlexy = document.querySelector("ytd-watch-flexy");
    const moviePlayer = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
    if (!watchFlexy && !moviePlayer) return false;
    const targetParent = watchFlexy || (moviePlayer ? moviePlayer.parentElement : null);
    if (!targetParent) return false;
    if (!ambientWrapper || !ambientWrapper.isConnected || ambientWrapper.parentElement !== targetParent) {
      const existing = document.getElementById("ytc-ambient-wrapper");
      if (existing && existing !== ambientWrapper) {
        existing.remove();
      }
      if (!ambientWrapper) {
        ambientWrapper = document.createElement("div");
        ambientWrapper.id = "ytc-ambient-wrapper";
        ambientWrapper.setAttribute("aria-hidden", "true");
        ambientSpreadCanvas = document.createElement("canvas");
        ambientSpreadCanvas.id = "ytc-ambient-spread-canvas";
        ambientSpreadCanvas.width = CANVAS_WIDTH;
        ambientSpreadCanvas.height = CANVAS_HEIGHT;
        ambientWrapper.appendChild(ambientSpreadCanvas);
      }
      if (watchFlexy) {
        watchFlexy.insertBefore(ambientWrapper, watchFlexy.firstChild);
      } else if (moviePlayer && moviePlayer.parentElement) {
        moviePlayer.parentElement.insertBefore(ambientWrapper, moviePlayer);
      }
      ambientSpreadCtx = ambientSpreadCanvas.getContext("2d", {
        alpha: true,
        willReadFrequently: false
      });
      if (ambientSpreadCtx) {
        ambientSpreadCtx.imageSmoothingEnabled = true;
        ambientSpreadCtx.imageSmoothingQuality = "medium";
      }
    }
    return !!ambientSpreadCtx;
  }
  function drawFrame(video) {
    if (!ensureAmbientCanvas()) return;
    if (!ambientSpreadCtx) return;
    const moviePlayer = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
    if (!moviePlayer) return;
    try {
      const vW = video.videoWidth;
      const vH = video.videoHeight;
      if (!vW || !vH || vW < 10 || vH < 10) return;
      const playerRect = moviePlayer.getBoundingClientRect();
      const wrapperRect = ambientWrapper.getBoundingClientRect();
      const pW = playerRect.width;
      const pH = playerRect.height;
      if (pW < 10 || pH < 10) return;
      const wrapW = wrapperRect.width || window.innerWidth || 1920;
      const wrapH = wrapperRect.height || 2200;
      const relX = Math.max(0, playerRect.left - wrapperRect.left);
      const relY = Math.max(0, playerRect.top - wrapperRect.top);
      const scaleX = CANVAS_WIDTH / wrapW;
      const scaleY = CANVAS_HEIGHT / wrapH;
      const cvX = Math.round(relX * scaleX);
      const cvY = Math.round(relY * scaleY);
      const cvW = Math.round(pW * scaleX);
      const cvH = Math.round(pH * scaleY);
      const videoAspect = vW / vH;
      const playerAspect = pW / pH;
      let sX = 0, sY = 0, sW = vW, sH = vH;
      if (videoAspect > playerAspect + 0.03) {
        const targetW = vH * playerAspect;
        sX = (vW - targetW) / 2;
        sW = targetW;
      } else if (videoAspect < playerAspect - 0.03) {
        const targetH = vW / playerAspect;
        sY = (vH - targetH) / 2;
        sH = targetH;
      }
      const padX = sW * 0.04;
      const padY = sH * 0.1;
      const cX = sX + padX;
      const cY = sY + padY;
      const cW = sW - padX * 2;
      const cH = sH - padY * 2;
      ambientSpreadCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const rightW = Math.max(0, CANVAS_WIDTH - (cvX + cvW));
      ambientSpreadCtx.drawImage(video, cX, cY, cW, cH, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      if (cvY > 0) {
        ambientSpreadCtx.drawImage(video, cX, cY, cW, 12, 0, 0, CANVAS_WIDTH, cvY);
      }
      if (cvH > 0) {
        if (cvX > 0) {
          ambientSpreadCtx.drawImage(video, cX, cY, 12, cH, 0, cvY, cvX, cvH);
        }
        if (rightW > 0) {
          ambientSpreadCtx.drawImage(video, cX + cW - 12, cY, 12, cH, cvX + cvW, cvY, rightW, cvH);
        }
      }
      const bottomY = cvY + cvH;
      const bottomH = Math.max(0, CANVAS_HEIGHT - bottomY);
      if (bottomH > 0) {
        ambientSpreadCtx.drawImage(video, cX, cY + cH - 12, cW, 12, cvX, bottomY, cvW, bottomH);
        if (cvX > 0) {
          ambientSpreadCtx.drawImage(video, cX, cY + cH - 12, 12, 12, 0, bottomY, cvX, bottomH);
        }
        if (rightW > 0) {
          ambientSpreadCtx.drawImage(video, cX + cW - 12, cY + cH - 12, 12, 12, cvX + cvW, bottomY, rightW, bottomH);
        }
      }
      if (!hasDrawnFirstFrame) {
        hasDrawnFirstFrame = true;
        if (ambientWrapper) ambientWrapper.classList.add("ytc-ambient-active");
        document.documentElement.classList.add("ytc-ambient-lighting");
        document.documentElement.classList.add("ytc-ambient-ready");
      }
    } catch (e) {
    }
  }
  function renderLoop(timestamp) {
    if (!isRunning) return;
    animFrameId = requestAnimationFrame(renderLoop);
    if (!currentConfig.ambientLighting || currentConfig.audioOnlyMode) return;
    if (timestamp - lastDrawTime < TARGET_INTERVAL) return;
    lastDrawTime = timestamp;
    const video = currentVideo || findActiveVideo();
    if (!video) return;
    if (video !== currentVideo) {
      attachVideo(video);
    }
    if (document.fullscreenElement) return;
    if (video.paused || video.ended) {
      if (!isPausedAndDrawn && video.readyState >= 2 && video.videoWidth > 0) {
        drawFrame(video);
        isPausedAndDrawn = true;
      }
      return;
    }
    isPausedAndDrawn = false;
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      return;
    }
    drawFrame(video);
  }
  function startLoop() {
    if (isRunning) return;
    isRunning = true;
    lastDrawTime = 0;
    animFrameId = requestAnimationFrame(renderLoop);
  }
  function stopLoop() {
    if (!isRunning) return;
    isRunning = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }
  function handleVideoActivity() {
    isPausedAndDrawn = false;
    if (!isRunning) {
      startLoop();
    }
  }
  function attachVideo(video) {
    if (!video || video === currentVideo) return;
    const events = ["play", "playing", "timeupdate", "canplay", "loadeddata", "seeked", "ratechange"];
    if (currentVideo) {
      events.forEach((evt) => currentVideo.removeEventListener(evt, handleVideoActivity));
    }
    currentVideo = video;
    events.forEach((evt) => currentVideo.addEventListener(evt, handleVideoActivity, { passive: true }));
    startLoop();
  }
  function handleVisibilityChange() {
    if (document.hidden) {
      stopLoop();
    } else {
      isPausedAndDrawn = false;
      startLoop();
    }
  }
  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const isScrolled = scrollY > 60;
    document.documentElement.classList.toggle("ytc-masthead-scrolled", isScrolled);
  }
  function handleNavigation() {
    const isWatchPage = location.pathname.startsWith("/watch") || location.pathname.startsWith("/live") || document.querySelector("ytd-watch-flexy") !== null;
    if (!isWatchPage) {
      stopLoop();
      hasDrawnFirstFrame = false;
      document.documentElement.classList.remove("ytc-ambient-ready");
      if (ambientWrapper) ambientWrapper.classList.remove("ytc-ambient-active");
      return;
    }
    isPausedAndDrawn = false;
    setTimeout(() => {
      ensureAmbientCanvas();
      const v = findActiveVideo();
      if (v) attachVideo(v);
      startLoop();
    }, 200);
    setTimeout(() => {
      const v = findActiveVideo();
      if (v && isRunning) drawFrame(v);
    }, 700);
  }
  function applyAmbientLightingState() {
    if (!currentConfig.ambientLighting || currentConfig.audioOnlyMode) {
      stopLoop();
      hasDrawnFirstFrame = false;
      document.documentElement.classList.remove("ytc-ambient-lighting");
      document.documentElement.classList.remove("ytc-ambient-ready");
      document.documentElement.classList.remove("ytc-masthead-scrolled");
      if (ambientWrapper) {
        ambientWrapper.classList.remove("ytc-ambient-active");
        ambientWrapper.style.display = "none";
      }
      return;
    }
    document.documentElement.classList.add("ytc-ambient-lighting");
    if (ambientWrapper) {
      ambientWrapper.style.display = "";
    }
    ensureAmbientCanvas();
    const video = findActiveVideo();
    if (video) {
      attachVideo(video);
    }
    startLoop();
  }
  function initAmbientLight() {
    if (ambientInitialized) return;
    ambientInitialized = true;
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", () => {
      const v = findActiveVideo();
      if (v && isRunning) drawFrame(v);
    });
    window.addEventListener("fullscreenchange", () => {
      const v = findActiveVideo();
      if (v && isRunning) drawFrame(v);
    });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("yt-navigate-finish", handleNavigation);
    window.addEventListener("yt-page-data-updated", handleNavigation);
    window.addEventListener("popstate", handleNavigation);
    const observer = new MutationObserver(() => {
      const video = findActiveVideo();
      if (video && video !== currentVideo) {
        attachVideo(video);
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    applyAmbientLightingState();
  }
  var ambientWrapper, ambientSpreadCanvas, ambientSpreadCtx, animFrameId, isRunning, lastDrawTime, currentVideo, hasDrawnFirstFrame, isPausedAndDrawn, CANVAS_WIDTH, CANVAS_HEIGHT, TARGET_INTERVAL, ambientInitialized;
  var init_ambientLight = __esm({
    "src/player/ambientLight.js"() {
      init_config();
      ambientWrapper = null;
      ambientSpreadCanvas = null;
      ambientSpreadCtx = null;
      animFrameId = null;
      isRunning = false;
      lastDrawTime = 0;
      currentVideo = null;
      hasDrawnFirstFrame = false;
      isPausedAndDrawn = false;
      CANVAS_WIDTH = 512;
      CANVAS_HEIGHT = 720;
      TARGET_INTERVAL = 1e3 / 30;
      ambientInitialized = false;
    }
  });

  // src/player/autoSubtitles.js
  var autoSubtitles_exports = {};
  __export(autoSubtitles_exports, {
    applyAutoSubtitles: () => applyAutoSubtitles,
    getTargetCaptionLang: () => getTargetCaptionLang,
    initAutoSubtitles: () => initAutoSubtitles
  });
  function getTargetCaptionLang() {
    const cfgLang = currentConfig.captionLanguage || "auto";
    if (cfgLang !== "auto") return cfgLang;
    const docLang = (document.documentElement.lang || navigator.language || "vi").toLowerCase();
    if (docLang.startsWith("vi")) return "vi";
    if (docLang.startsWith("en")) return "en";
    if (docLang.startsWith("ja")) return "ja";
    if (docLang.startsWith("ko")) return "ko";
    if (docLang.startsWith("zh")) return "zh";
    return "vi";
  }
  function getLangDisplayName(code) {
    const map = {
      vi: "Tiếng Việt",
      en: "Tiếng Anh (English)",
      ja: "Tiếng Nhật (日本語)",
      ko: "Tiếng Hàn (한국어)",
      zh: "Tiếng Trung (中文)"
    };
    return map[code] || code.toUpperCase();
  }
  function getPlayer() {
    return document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  }
  function applyAutoSubtitles() {
    if (!currentConfig.autoSubtitles) return;
    const player = getPlayer();
    if (!player) return;
    try {
      const subBtn = player.querySelector(".ytp-subtitles-button") || document.querySelector(".ytp-subtitles-button");
      if (subBtn) {
        subBtn.style.display = "inline-block";
        subBtn.removeAttribute("aria-disabled");
      }
      if (typeof player.loadModule === "function" && !isCaptionsModuleLoaded) {
        player.loadModule("captions");
        isCaptionsModuleLoaded = true;
      }
      const isSubOn = typeof player.isSubtitlesOn === "function" && player.isSubtitlesOn() || subBtn && subBtn.getAttribute("aria-pressed") === "true";
      if (!isSubOn) {
        if (typeof player.toggleSubtitlesOn === "function") {
          player.toggleSubtitlesOn();
        } else if (subBtn) {
          subBtn.click();
        }
      }
      const tracklist = typeof player.getOption === "function" && player.getOption("captions", "tracklist") || [];
      if (!tracklist || tracklist.length === 0) {
        setTimeout(() => {
          const retryPlayer = getPlayer();
          const retryTracks = retryPlayer && typeof retryPlayer.getOption === "function" && retryPlayer.getOption("captions", "tracklist");
          if (retryTracks && retryTracks.length > 0) {
            selectPreferredTrack(retryPlayer, retryTracks);
          }
        }, 800);
        return;
      }
      selectPreferredTrack(player, tracklist);
    } catch (e) {
    }
  }
  function selectPreferredTrack(player, tracklist) {
    if (!player || typeof player.setOption !== "function") return;
    const targetLang = getTargetCaptionLang();
    const exactTrack = tracklist.find((t) => t.languageCode === targetLang);
    if (exactTrack) {
      player.setOption("captions", "track", exactTrack);
      return;
    }
    const baseTrack = tracklist.find((t) => t.kind === "asr") || tracklist[0];
    if (baseTrack) {
      player.setOption("captions", "track", {
        languageCode: baseTrack.languageCode,
        translationLanguage: { languageCode: targetLang }
      });
    }
  }
  function pinPreferredLanguageInMenu() {
    if (!currentConfig.autoSubtitles) return;
    const panelMenu = document.querySelector(".ytp-popup.ytp-settings-menu .ytp-panel-menu");
    if (!panelMenu) return;
    const items = Array.from(panelMenu.querySelectorAll(".ytp-menuitem"));
    if (items.length < 2) return;
    const isCaptionMenu = items.some((it) => {
      const text = (it.textContent || "").toLowerCase();
      return text.includes("tắt") || text.includes("off") || text.includes("dịch tự động") || text.includes("auto-translate");
    });
    if (!isCaptionMenu) return;
    const targetLang = getTargetCaptionLang();
    const targetLangName = getLangDisplayName(targetLang).toLowerCase();
    const matchedItem = items.find((it) => {
      const text = (it.textContent || "").toLowerCase();
      return text.includes(targetLangName) || targetLang === "vi" && text.includes("tiếng việt");
    });
    if (matchedItem) {
      const offItem = items[0];
      if (offItem && offItem.nextSibling !== matchedItem) {
        panelMenu.insertBefore(matchedItem, offItem.nextSibling);
        matchedItem.style.background = "rgba(62, 166, 255, 0.15)";
        matchedItem.style.fontWeight = "600";
      }
    } else {
      const existingCustom = panelMenu.querySelector(".ytc-pinned-caption-item");
      if (!existingCustom) {
        const player = getPlayer();
        const tracklist = player && typeof player.getOption === "function" && player.getOption("captions", "tracklist") || [];
        const baseTrack = tracklist.find((t) => t.kind === "asr") || tracklist[0];
        if (baseTrack) {
          const customItem = document.createElement("div");
          customItem.className = "ytp-menuitem ytc-pinned-caption-item";
          customItem.setAttribute("role", "menuitemradio");
          customItem.setAttribute("tabindex", "0");
          customItem.style.cssText = "background: rgba(62, 166, 255, 0.18); font-weight: 600; color: #3ea6ff; cursor: pointer;";
          customItem.innerHTML = `
                    <div class="ytp-menuitem-icon"></div>
                    <div class="ytp-menuitem-label">⭐ ${getLangDisplayName(targetLang)} (Tự động dịch)</div>
                    <div class="ytp-menuitem-content"></div>
                `;
          customItem.addEventListener("click", (ev) => {
            ev.stopPropagation();
            if (player && typeof player.setOption === "function") {
              player.setOption("captions", "track", {
                languageCode: baseTrack.languageCode,
                translationLanguage: { languageCode: targetLang }
              });
            }
            const settingsBtn = document.querySelector(".ytp-settings-button");
            if (settingsBtn) settingsBtn.click();
          });
          const offItem = items[0];
          if (offItem) {
            panelMenu.insertBefore(customItem, offItem.nextSibling);
          } else {
            panelMenu.prepend(customItem);
          }
        }
      }
    }
  }
  function initAutoSubtitles() {
    if (!observerAttached) {
      observerAttached = true;
      const menuObserver = new MutationObserver(() => {
        pinPreferredLanguageInMenu();
      });
      menuObserver.observe(document.body, { childList: true, subtree: true });
    }
    window.addEventListener("yt-navigate-finish", () => {
      isCaptionsModuleLoaded = false;
      setTimeout(() => {
        applyAutoSubtitles();
      }, 1e3);
    });
    setTimeout(() => {
      applyAutoSubtitles();
    }, 1500);
  }
  var isCaptionsModuleLoaded, observerAttached;
  var init_autoSubtitles = __esm({
    "src/player/autoSubtitles.js"() {
      init_config();
      isCaptionsModuleLoaded = false;
      observerAttached = false;
    }
  });

  // src/chat/chatState.js
  function setChatOverlayInitialized(v) {
    chatOverlayInitialized = v;
  }
  function isDuplicateMessage(id, author, text) {
    if (id) {
      if (seenMessageIds.has(id)) return true;
      seenMessageIds.add(id);
      if (seenMessageIds.size > 600) {
        const first = seenMessageIds.values().next().value;
        seenMessageIds.delete(first);
      }
      return false;
    }
    const key = `${author}:${text}`;
    if (seenMessageIds.has(key)) return true;
    seenMessageIds.add(key);
    setTimeout(() => seenMessageIds.delete(key), 3500);
    return false;
  }
  function setNativeChatHiddenState(hidden) {
    const next = !!hidden;
    if (isNativeChatHiddenByScript === next) return;
    isNativeChatHiddenByScript = next;
    const root = document.documentElement;
    const body = document.body;
    if (next) {
      root.setAttribute("data-ytc-chat-hidden", "true");
      if (body) body.setAttribute("data-ytc-chat-hidden", "true");
    } else {
      root.removeAttribute("data-ytc-chat-hidden");
      if (body) body.removeAttribute("data-ytc-chat-hidden");
    }
    syncPlayerFullscreenSize();
  }
  function applyVideoDimensions(video, containerW, containerH) {
    if (!video || containerW <= 0 || containerH <= 0) return;
    const vW = video.videoWidth;
    const vH = video.videoHeight;
    if (vW > 0 && vH > 0) {
      const videoRatio = vW / vH;
      const containerRatio = containerW / containerH;
      let targetW, targetH, targetLeft, targetTop;
      if (containerRatio > videoRatio) {
        targetH = containerH;
        targetW = Math.round(targetH * videoRatio);
        targetLeft = Math.round((containerW - targetW) / 2);
        targetTop = 0;
      } else {
        targetW = containerW;
        targetH = Math.round(targetW / videoRatio);
        targetLeft = 0;
        targetTop = Math.round((containerH - targetH) / 2);
      }
      video.style.width = `${targetW}px`;
      video.style.height = `${targetH}px`;
      video.style.left = `${targetLeft}px`;
      video.style.top = `${targetTop}px`;
    } else {
      video.style.width = `${containerW}px`;
      video.style.height = `${containerH}px`;
      video.style.left = "0px";
      video.style.top = "0px";
    }
  }
  function syncPlayerFullscreenSize() {
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
    if (isSyncingPlayerSize) return;
    isSyncingPlayerSize = true;
    try {
      const isFs = !!(document.fullscreenElement || document.querySelector("#movie_player.ytp-fullscreen"));
      const player = document.querySelector("#movie_player:not(#inline-preview-player)");
      if (!player) return;
      const video = player.querySelector("video.html5-main-video") || player.querySelector("video");
      if (!video) return;
      if (!isFs) {
        delete video.dataset.ytcOverridden;
        const pW = player.clientWidth || player.offsetWidth;
        const pH = player.clientHeight || player.offsetHeight;
        if (pW > 0 && pH > 0) {
          applyVideoDimensions(video, pW, pH);
        }
        if (typeof player.setInternalSize === "function") {
          try {
            player.setInternalSize();
          } catch (e) {
          }
        }
        return;
      }
      if (!isNativeChatHiddenByScript) {
        delete video.dataset.ytcOverridden;
        const pW = player.clientWidth || player.offsetWidth;
        const pH = player.clientHeight || player.offsetHeight;
        if (pW > 0 && pH > 0) {
          applyVideoDimensions(video, pW, pH);
        }
        if (typeof player.setInternalSize === "function") {
          try {
            player.setInternalSize();
          } catch (e) {
          }
        }
        return;
      }
      const screenW = window.innerWidth || screen.width;
      const screenH = window.innerHeight || screen.height;
      if (screenW > 0 && screenH > 0) {
        video.dataset.ytcOverridden = "true";
        applyVideoDimensions(video, screenW, screenH);
      }
    } finally {
      isSyncingPlayerSize = false;
    }
  }
  function ensureChatOverlayContainers() {
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
    const player = document.querySelector("#movie_player:not(#inline-preview-player)");
    if (!player) return;
    let dContainer = document.getElementById("ytc-danmaku-container");
    if (!dContainer) {
      dContainer = document.createElement("div");
      dContainer.id = "ytc-danmaku-container";
      player.appendChild(dContainer);
    } else if (dContainer.parentElement !== player) {
      player.appendChild(dContainer);
    }
    danmakuContainer = dContainer;
    let sBox = document.getElementById("ytc-streamer-box");
    if (!sBox) {
      sBox = document.createElement("div");
      sBox.id = "ytc-streamer-box";
      setElementHTML(sBox, `
            <div class="ytc-box-header">
                <span class="ytc-box-title">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style="flex-shrink:0;"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                    Live Chat
                </span>
                <button class="ytc-box-close" title="Ẩn khung chat" aria-label="Ẩn khung chat">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="ytc-box-messages"></div>
            <div class="ytc-box-resize" title="Kéo để thay đổi kích thước"></div>
        `);
      player.appendChild(sBox);
      const closeBtn = sBox.querySelector(".ytc-box-close");
      if (closeBtn) {
        closeBtn.onclick = (e) => {
          e.stopPropagation();
          sBox.style.display = "none";
          window.dispatchEvent(new CustomEvent("ytc-close-streamer-box"));
        };
      }
    } else if (sBox.parentElement !== player) {
      player.appendChild(sBox);
    }
    streamerBox = sBox;
    streamerMessages = sBox.querySelector(".ytc-box-messages");
  }
  var CHATBOX_POS_KEY, chatOverlayInitialized, danmakuContainer, streamerBox, streamerMessages, seenMessageIds, isNativeChatHiddenByScript, isSyncingPlayerSize;
  var init_chatState = __esm({
    "src/chat/chatState.js"() {
      init_config();
      init_utils();
      CHATBOX_POS_KEY = "ytc_chatbox_pos";
      chatOverlayInitialized = false;
      danmakuContainer = null;
      streamerBox = null;
      streamerMessages = null;
      seenMessageIds = /* @__PURE__ */ new Set();
      isNativeChatHiddenByScript = false;
      isSyncingPlayerSize = false;
    }
  });

  // src/chat/streamerBox.js
  function getSavedChatBoxPos() {
    try {
      const stored = localStorage.getItem(CHATBOX_POS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
    }
    return null;
  }
  function saveChatBoxPos(data) {
    try {
      const existing = getSavedChatBoxPos() || {};
      localStorage.setItem(CHATBOX_POS_KEY, JSON.stringify({ ...existing, ...data }));
    } catch (e) {
    }
  }
  function centerChatBox(box, player) {
    if (!box) return;
    const p = player || document.querySelector("#movie_player:not(#inline-preview-player)");
    const pWidth = p ? p.offsetWidth || p.clientWidth : window.innerWidth;
    const pHeight = p ? p.offsetHeight || p.clientHeight : window.innerHeight;
    const boxW = Math.min(340, Math.max(260, Math.round(pWidth * 0.32)));
    const boxH = Math.min(300, Math.max(160, Math.round(pHeight * 0.4)));
    box.style.left = "50%";
    box.style.top = "50%";
    box.style.right = "auto";
    box.style.bottom = "auto";
    box.style.transform = "translate(-50%, -50%)";
    box.style.width = `${boxW}px`;
    box.style.height = `${boxH}px`;
    saveChatBoxPos({
      isCentered: true,
      anchorX: "left",
      anchorY: "bottom",
      offsetX: 10,
      offsetY: 40,
      width: box.style.width,
      height: box.style.height
    });
  }
  function applyChatBoxPos(box, player) {
    if (!box) return;
    const p = player || document.querySelector("#movie_player:not(#inline-preview-player)");
    if (!p) return;
    const pos = getSavedChatBoxPos();
    if (!pos) {
      centerChatBox(box, p);
      return;
    }
    if (pos.isCentered) {
      box.style.left = "50%";
      box.style.top = "50%";
      box.style.right = "auto";
      box.style.bottom = "auto";
      box.style.transform = "translate(-50%, -50%)";
      if (pos.width) box.style.width = pos.width;
      if (pos.height) box.style.height = pos.height;
      return;
    }
    box.style.transform = "none";
    if (pos.width) box.style.width = pos.width;
    if (pos.height) box.style.height = pos.height;
    const pW = p.offsetWidth || p.clientWidth || window.innerWidth;
    const pH = p.offsetHeight || p.clientHeight || window.innerHeight;
    const bW = box.offsetWidth || 300;
    const bH = box.offsetHeight || 200;
    if (pos.anchorX === "right") {
      const rightVal = Math.min(pos.offsetX || 0, Math.max(0, pW - bW));
      box.style.right = `${rightVal}px`;
      box.style.left = "auto";
    } else {
      const leftVal = Math.min(pos.offsetX || 0, Math.max(0, pW - bW));
      box.style.left = `${leftVal}px`;
      box.style.right = "auto";
    }
    if (pos.anchorY === "top") {
      const topVal = Math.min(pos.offsetY || 0, Math.max(0, pH - bH));
      box.style.top = `${topVal}px`;
      box.style.bottom = "auto";
    } else {
      const bottomVal = Math.min(pos.offsetY || 0, Math.max(0, pH - bH));
      box.style.bottom = `${bottomVal}px`;
      box.style.top = "auto";
    }
  }
  function showInitialBox(box) {
    if (!box) return;
    box.classList.add("ytc-box-initial");
    let hasEntered = false;
    const onEnter = () => {
      hasEntered = true;
    };
    const onLeave = () => {
      if (hasEntered) {
        box.classList.remove("ytc-box-initial");
        box.removeEventListener("mouseenter", onEnter);
        box.removeEventListener("mouseleave", onLeave);
      }
    };
    box.addEventListener("mouseenter", onEnter);
    box.addEventListener("mouseleave", onLeave);
  }
  function setupChatBoxInteractions(box, player) {
    const header = box.querySelector(".ytc-box-header");
    const resizeHandle = box.querySelector(".ytc-box-resize");
    if (header) {
      header.addEventListener("dblclick", (e) => {
        e.preventDefault();
        e.stopPropagation();
        centerChatBox(box, player);
      });
      header.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        if (e.target.closest(".ytc-box-close")) return;
        e.preventDefault();
        e.stopPropagation();
        const pRect = player.getBoundingClientRect();
        const bRect = box.getBoundingClientRect();
        const shiftX = e.clientX - bRect.left;
        const shiftY = e.clientY - bRect.top;
        const boxW = box.offsetWidth || bRect.width;
        const boxH = box.offsetHeight || bRect.height;
        const maxLeft = Math.max(0, pRect.width - boxW);
        const maxTop = Math.max(0, pRect.height - boxH);
        box.classList.add("ytc-dragging");
        let rafId = null;
        let currentClientX = e.clientX;
        let currentClientY = e.clientY;
        function updatePosition() {
          rafId = null;
          let newLeft = Math.max(0, Math.min(currentClientX - pRect.left - shiftX, maxLeft));
          let newTop = Math.max(0, Math.min(currentClientY - pRect.top - shiftY, maxTop));
          box.style.left = `${newLeft}px`;
          box.style.top = `${newTop}px`;
          box.style.right = "auto";
          box.style.bottom = "auto";
          box.style.transform = "none";
        }
        function onMouseMove(moveEvent) {
          currentClientX = moveEvent.clientX;
          currentClientY = moveEvent.clientY;
          if (!rafId) {
            rafId = requestAnimationFrame(updatePosition);
          }
        }
        function onMouseUp() {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          box.classList.remove("ytc-dragging");
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          const currentPRect = player.getBoundingClientRect();
          const currentBRect = box.getBoundingClientRect();
          const distLeft = Math.max(0, currentBRect.left - currentPRect.left);
          const distRight = Math.max(0, currentPRect.right - currentBRect.right);
          const distTop = Math.max(0, currentBRect.top - currentPRect.top);
          const distBottom = Math.max(0, currentPRect.bottom - currentBRect.bottom);
          const anchorX = distLeft <= distRight ? "left" : "right";
          const anchorY = distTop <= distBottom ? "top" : "bottom";
          const offsetX = anchorX === "left" ? distLeft : distRight;
          const offsetY = anchorY === "top" ? distTop : distBottom;
          if (anchorX === "left") {
            box.style.left = `${Math.round(offsetX)}px`;
            box.style.right = "auto";
          } else {
            box.style.right = `${Math.round(offsetX)}px`;
            box.style.left = "auto";
          }
          if (anchorY === "top") {
            box.style.top = `${Math.round(offsetY)}px`;
            box.style.bottom = "auto";
          } else {
            box.style.bottom = `${Math.round(offsetY)}px`;
            box.style.top = "auto";
          }
          saveChatBoxPos({
            isCentered: false,
            anchorX,
            anchorY,
            offsetX: Math.round(offsetX),
            offsetY: Math.round(offsetY),
            width: box.style.width,
            height: box.style.height
          });
        }
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    }
    if (resizeHandle) {
      resizeHandle.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startW = box.offsetWidth;
        const startH = box.offsetHeight;
        const maxW = (player.offsetWidth || window.innerWidth) * 0.8;
        const maxH = (player.offsetHeight || window.innerHeight) * 0.8;
        box.classList.add("ytc-dragging");
        let rafId = null;
        let currentClientX = e.clientX;
        let currentClientY = e.clientY;
        function updateResize() {
          rafId = null;
          const newW = Math.max(200, Math.min(startW + (currentClientX - startX), maxW));
          const newH = Math.max(100, Math.min(startH + (currentClientY - startY), maxH));
          box.style.width = `${newW}px`;
          box.style.height = `${newH}px`;
        }
        function onMouseMove(moveEvent) {
          currentClientX = moveEvent.clientX;
          currentClientY = moveEvent.clientY;
          if (!rafId) {
            rafId = requestAnimationFrame(updateResize);
          }
        }
        function onMouseUp() {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          box.classList.remove("ytc-dragging");
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          saveChatBoxPos({
            width: box.style.width,
            height: box.style.height
          });
        }
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    }
    window.addEventListener("resize", () => {
      if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
      const p = document.querySelector("#movie_player:not(#inline-preview-player)");
      if (box && p) applyChatBoxPos(box, p);
      syncPlayerFullscreenSize();
    });
    document.addEventListener("fullscreenchange", () => {
      if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
      const p = document.querySelector("#movie_player:not(#inline-preview-player)");
      if (box && p) {
        applyChatBoxPos(box, p);
        setTimeout(() => applyChatBoxPos(box, p), 150);
      }
    });
    if (window.ResizeObserver && player) {
      const ro = new ResizeObserver(() => {
        applyChatBoxPos(box, player);
      });
      ro.observe(player);
    }
  }
  var init_streamerBox = __esm({
    "src/chat/streamerBox.js"() {
      init_utils();
      init_chatState();
    }
  });

  // src/chat/danmaku.js
  function setLastDanmakuSpawnTime(t) {
    lastDanmakuSpawnTime = t;
  }
  function setLastSpawnedLane(l) {
    lastSpawnedLane = l;
  }
  function getAvailableLane(now) {
    const freeLanes = [];
    for (let i = 0; i < TOTAL_LANES; i++) {
      if (laneNextAvailableTime[i] <= now) {
        freeLanes.push(i);
      }
    }
    if (freeLanes.length === 0) return -1;
    const differentLanes = freeLanes.filter((l) => l !== lastSpawnedLane);
    const candidates = differentLanes.length > 0 ? differentLanes : freeLanes;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }
  function spawnDanmakuItem(data, laneIndex) {
    let container = danmakuContainer || document.getElementById("ytc-danmaku-container");
    if (!container) {
      const player = document.querySelector("#movie_player:not(#inline-preview-player)");
      if (player) {
        container = document.createElement("div");
        container.id = "ytc-danmaku-container";
        container.style.display = "block";
        player.appendChild(container);
      }
    }
    if (!container || !data || !data.messageHtml) return;
    if (container.style.display === "none") container.style.display = "block";
    const item = document.createElement("div");
    item.className = "ytc-danmaku-item";
    const topPercent = 6 + laneIndex * 8.2;
    item.style.top = `${topPercent}%`;
    setElementHTML(item, `
        <span class="ytc-chat-text ${data.authorClass || ""}">${data.messageHtml}</span>
    `);
    container.appendChild(item);
    const plainText = (data.messageHtml || "").replace(/<[^>]*>/g, "");
    const textLen = plainText.length || 8;
    const busyDuration = Math.min(5500, Math.max(3200, textLen * 110 + 2e3));
    laneNextAvailableTime[laneIndex] = Date.now() + busyDuration;
    item.addEventListener("animationend", () => item.remove());
    setTimeout(() => {
      if (item.isConnected) item.remove();
    }, 12e3);
  }
  function processDanmakuQueue() {
    if (document.hidden) return;
    if (danmakuQueue.length === 0) {
      if (danmakuSchedulerTimer) {
        clearInterval(danmakuSchedulerTimer);
        danmakuSchedulerTimer = null;
      }
      return;
    }
    const now = Date.now();
    if (now - lastDanmakuSpawnTime < MIN_GLOBAL_INTERVAL) {
      return;
    }
    const lane = getAvailableLane(now);
    if (lane !== -1) {
      const nextData = danmakuQueue.shift();
      lastDanmakuSpawnTime = now;
      lastSpawnedLane = lane;
      spawnDanmakuItem(nextData, lane);
    }
    if (danmakuQueue.length > 6) {
      while (danmakuQueue.length > 5) {
        const idx = danmakuQueue.findIndex((d) => !d.authorClass && !d.messageHtml.includes("purchase-amount"));
        if (idx !== -1) {
          danmakuQueue.splice(idx, 1);
        } else {
          danmakuQueue.shift();
        }
      }
    }
  }
  function startDanmakuScheduler() {
    if (!danmakuSchedulerTimer) {
      danmakuSchedulerTimer = setInterval(processDanmakuQueue, 50);
    }
  }
  function stopDanmakuScheduler() {
    if (danmakuSchedulerTimer) {
      clearInterval(danmakuSchedulerTimer);
      danmakuSchedulerTimer = null;
    }
    danmakuQueue.length = 0;
    laneNextAvailableTime.fill(0);
    lastDanmakuSpawnTime = 0;
    lastSpawnedLane = -1;
  }
  var TOTAL_LANES, laneNextAvailableTime, danmakuQueue, danmakuSchedulerTimer, lastDanmakuSpawnTime, lastSpawnedLane, MIN_GLOBAL_INTERVAL;
  var init_danmaku = __esm({
    "src/chat/danmaku.js"() {
      init_utils();
      init_chatState();
      TOTAL_LANES = 10;
      laneNextAvailableTime = new Array(TOTAL_LANES).fill(0);
      danmakuQueue = [];
      danmakuSchedulerTimer = null;
      lastDanmakuSpawnTime = 0;
      lastSpawnedLane = -1;
      MIN_GLOBAL_INTERVAL = 480;
    }
  });

  // src/chat/chatParser.js
  function filterEmojisFromMessage(messageEl) {
    if (!messageEl) return { html: "", text: "", isEmpty: true };
    const clone = messageEl.cloneNode(true);
    const images = clone.querySelectorAll("img");
    images.forEach((img) => img.remove());
    let cleanedHtml = clone.innerHTML;
    let textOnly = clone.textContent || "";
    cleanedHtml = cleanedHtml.replace(UNICODE_EMOJI_REGEX, "").trim();
    textOnly = textOnly.replace(UNICODE_EMOJI_REGEX, "").trim();
    cleanedHtml = cleanedHtml.replace(/\s{2,}/g, " ");
    textOnly = textOnly.replace(/\s{2,}/g, " ");
    return {
      html: cleanedHtml,
      text: textOnly,
      isEmpty: textOnly.length === 0
    };
  }
  function getFallbackAvatar(authorClass, author) {
    let bg = "#606060";
    const text = (author || "U").charAt(0).toUpperCase();
    let isSvgIcon = false;
    let iconPath = "";
    if (authorClass === "mod") {
      bg = "#1a73e8";
      isSvgIcon = true;
      iconPath = '<path fill="%23fff" d="M16 6.5l-7 3v6c0 4.8 3 9.3 7 10.8 4-1.5 7-6 7-10.8v-6l-7-3z"/>';
    } else if (authorClass === "owner") {
      bg = "#e6a100";
      isSvgIcon = true;
      iconPath = '<path fill="%23fff" d="M5 21h22v3H5zm2.4-13.6l4.6 5.8 4-6.4 4 6.4 4.6-5.8 2.4 11.2H5z"/>';
    } else if (authorClass === "member") {
      bg = "#1e7e34";
    }
    if (isSvgIcon && iconPath) {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="${encodeURIComponent(bg)}"/>${iconPath}</svg>`;
    }
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="${encodeURIComponent(bg)}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="central" fill="%23fff" font-family="-apple-system,BlinkMacSystemFont,Roboto,sans-serif" font-weight="bold" font-size="16">${encodeURIComponent(text)}</text></svg>`;
  }
  function extractMessageData(node) {
    if (!node || node.nodeType !== 1) return null;
    if (currentConfig.hideChatEmojis && node.tagName && node.tagName.toLowerCase().includes("sticker")) {
      return null;
    }
    const authorEl = node.querySelector("#author-name");
    const rawAuthor = authorEl ? authorEl.textContent.trim() : "";
    let author = rawAuthor.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (author.startsWith("@")) {
      author = author.substring(1);
    }
    const isMod = !!node.querySelector('yt-live-chat-author-badge-renderer[type="moderator"], yt-live-chat-author-badge-renderer[aria-label*="điều hành" i], yt-live-chat-author-badge-renderer[aria-label*="kiểm duyệt" i], yt-live-chat-author-badge-renderer[aria-label*="moderator" i], [type="moderator"], .moderator') || node.classList.contains("author-type-moderator");
    const isMember = !!node.querySelector('yt-live-chat-author-badge-renderer[type="member"], yt-live-chat-author-badge-renderer[aria-label*="hội viên" i], yt-live-chat-author-badge-renderer[aria-label*="member" i], [type="member"], .member') || node.classList.contains("author-type-member");
    const isOwner = !!node.querySelector('yt-live-chat-author-badge-renderer[type="owner"], yt-live-chat-author-badge-renderer[aria-label*="chủ sở hữu" i], yt-live-chat-author-badge-renderer[aria-label*="owner" i], [type="owner"], .owner') || node.classList.contains("author-type-owner");
    const avatarEl = node.querySelector(
      '#author-photo img, yt-img-shadow#author-photo img, #author-photo #img, yt-avatar-shape img, [id="author-photo"] img, yt-img-shadow img, img#img'
    ) || node.querySelector("#author-photo")?.shadowRoot?.querySelector("img");
    let avatarSrc = "";
    if (avatarEl) {
      const rawSrc = avatarEl.currentSrc || avatarEl.src || avatarEl.getAttribute("src") || "";
      const dataSrc = avatarEl.getAttribute("data-src") || "";
      if (rawSrc.startsWith("data:image/svg+xml") || rawSrc.startsWith("data:image/gif")) {
        avatarSrc = dataSrc || "";
      } else {
        avatarSrc = rawSrc || dataSrc;
      }
    }
    let streamerBadges = [];
    if (isMod) {
      streamerBadges.push(`<span class="ytc-box-badge ytc-badge-mod" title="Người kiểm duyệt"><svg class="ytc-mod-icon" viewBox="0 0 16 16" width="10" height="10"><path fill="#3ea6ff" d="M8 1.5L2.5 3.8v4.2c0 3.8 2.3 7.3 5.5 8.5 3.2-1.2 5.5-4.7 5.5-8.5V3.8L8 1.5z"/></svg></span>`);
    } else if (isOwner) {
      streamerBadges.push(`<span class="ytc-box-badge ytc-badge-owner" title="Chủ sở hữu"><svg class="ytc-owner-icon" viewBox="0 0 16 16" width="10" height="10"><path fill="#ffd600" d="M2.5 13h11v1.5h-11zm1.2-8.5l2.8 3.5 2.5-4 2.5 4 2.8-3.5 1.7 7h-14z"/></svg></span>`);
    }
    const badgeEls = Array.from(node.querySelectorAll("#chat-badges yt-live-chat-author-badge-renderer"));
    for (const b of badgeEls) {
      const type = (b.getAttribute("type") || "").toLowerCase();
      const aria = (b.getAttribute("aria-label") || "").toLowerCase();
      if (type === "moderator" || aria.includes("moderator") || aria.includes("điều hành") || aria.includes("kiểm duyệt") || type === "owner" || aria.includes("owner") || aria.includes("chủ sở hữu")) {
        continue;
      }
      const img = b.querySelector("img");
      if (img && img.src) {
        streamerBadges.push(`<span class="ytc-box-badge ytc-badge-member" title="${aria || "Hội viên"}"><img src="${img.src}" alt=""></span>`);
      }
    }
    const streamerBadgeHtml = streamerBadges.join("");
    const messageEl = node.querySelector("#message");
    let messageHtml = messageEl ? messageEl.innerHTML : "";
    const purchaseEl = node.querySelector("#purchase-amount");
    const headerSubtext = node.querySelector("#header-subtext");
    const isPaid = !!(purchaseEl && purchaseEl.textContent.trim() || headerSubtext && headerSubtext.textContent.trim());
    if (currentConfig.hideChatEmojis && messageEl) {
      const filtered = filterEmojisFromMessage(messageEl);
      if (filtered.isEmpty && !isPaid) {
        return null;
      }
      messageHtml = filtered.html;
    }
    if (purchaseEl && purchaseEl.textContent.trim()) {
      const amount = purchaseEl.textContent.trim();
      messageHtml = `<strong>[${amount}]</strong> ${messageHtml}`;
    }
    if (headerSubtext && headerSubtext.textContent.trim()) {
      messageHtml = `<em>${headerSubtext.textContent.trim()}</em> ${messageHtml}`;
    }
    if (!messageHtml && !author) return null;
    const authorClass = isMod ? "mod" : isMember ? "member" : isOwner ? "owner" : "";
    const id = node.id || "";
    return {
      id,
      author: author || "Ẩn danh",
      authorClass,
      avatarEl,
      avatarSrc,
      streamerBadgeHtml,
      messageHtml: messageHtml || "..."
    };
  }
  function displayChatMessage(data, isBacklog = false) {
    if (!data || !currentConfig.chatOverlay || currentConfig.chatOverlay === "off") return;
    const player = document.querySelector("#movie_player:not(#inline-preview-player)");
    const video = player ? player.querySelector("video") : null;
    if (video && video.paused) return;
    const msgIsBacklog = isBacklog || data.isBacklog || false;
    if (isDuplicateMessage(data.id, data.author, data.messageHtml)) return;
    ensureChatOverlayContainers();
    const showDanmaku = currentConfig.chatOverlay === "danmaku";
    const showStreamer = currentConfig.chatOverlay === "streamer";
    const dContainer = danmakuContainer || document.getElementById("ytc-danmaku-container");
    if (showDanmaku && dContainer) {
      if (msgIsBacklog && danmakuQueue.length >= 4) return;
      if (danmakuQueue.length >= 6) {
        const idx = danmakuQueue.findIndex((d) => !d.authorClass && !d.messageHtml.includes("purchase-amount"));
        if (idx !== -1) {
          danmakuQueue.splice(idx, 1);
        } else {
          danmakuQueue.shift();
        }
      }
      danmakuQueue.push(data);
      startDanmakuScheduler();
    }
    if (showStreamer) {
      const msgContainer = streamerMessages || document.querySelector("#ytc-streamer-box .ytc-box-messages");
      if (!msgContainer) return;
      if (msgIsBacklog && msgContainer.children.length >= 8) return;
      const loading = msgContainer.querySelector(".ytc-box-loading");
      if (loading) loading.remove();
      const item = document.createElement("div");
      item.className = "ytc-box-item";
      const finalAvatar = data.avatarSrc || getFallbackAvatar(data.authorClass, data.author);
      const avatarMarkup = `<img class="ytc-box-avatar" src="${finalAvatar}" alt="">`;
      const badgeMarkup = data.streamerBadgeHtml ? `${data.streamerBadgeHtml} ` : "";
      setElementHTML(item, `
            ${avatarMarkup}
            <div class="ytc-box-content">
                <span class="ytc-chat-author ${data.authorClass || ""}">@${data.author}:</span> ${badgeMarkup}<span class="ytc-chat-text">${data.messageHtml}</span>
            </div>
        `);
      if (data.avatarEl && !data.avatarSrc) {
        const onAvatarLoaded = () => {
          const newSrc = data.avatarEl.currentSrc || data.avatarEl.src || data.avatarEl.getAttribute("src");
          if (newSrc && !newSrc.startsWith("data:image/svg+xml") && !newSrc.startsWith("data:image/gif")) {
            const img = item.querySelector(".ytc-box-avatar");
            if (img) img.src = newSrc;
          }
        };
        data.avatarEl.addEventListener("load", onAvatarLoaded, { once: true });
      }
      msgContainer.appendChild(item);
      msgContainer.scrollTop = msgContainer.scrollHeight;
      while (msgContainer.children.length > 60) {
        msgContainer.firstElementChild.remove();
      }
      setTimeout(() => {
        if (item.isConnected) {
          item.style.transition = "opacity 0.6s ease";
          item.style.opacity = "0";
          setTimeout(() => item.remove(), 600);
        }
      }, 45e3);
    }
  }
  var UNICODE_EMOJI_REGEX;
  var init_chatParser = __esm({
    "src/chat/chatParser.js"() {
      init_config();
      init_utils();
      init_chatState();
      init_danmaku();
      UNICODE_EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{200D}\u{FE0F}]/gu;
    }
  });

  // src/ui/sync.js
  var sync_exports = {};
  __export(sync_exports, {
    syncPanelState: () => syncPanelState
  });
  function syncPanelState(targetPanel) {
    const panel = targetPanel || document.getElementById("ytc-settings-panel");
    if (!panel) return;
    const hasChat = hasLiveOrChatSupport();
    const chatRow = panel.querySelector("#ytc-row-chatoverlay");
    if (chatRow) {
      chatRow.classList.toggle("ytc-disabled", !hasChat);
      const allBtns = chatRow.querySelectorAll(".ytc-mode-btn");
      allBtns.forEach((btn) => {
        if (!hasChat) {
          btn.setAttribute("disabled", "disabled");
          btn.setAttribute("title", "Chỉ khả dụng khi xem Live Stream hoặc video có khung trò chuyện");
        } else {
          btn.removeAttribute("disabled");
          const overlayMode = btn.getAttribute("data-overlay");
          if (overlayMode === "off") {
            btn.setAttribute("title", "Tắt chat trên video");
          } else if (overlayMode === "danmaku") {
            btn.setAttribute("title", "Chữ chạy ngang màn hình dạng Danmaku");
          } else if (overlayMode === "streamer") {
            btn.setAttribute("title", "Khung chat nổi của streamer, kéo thả và co giãn tự do");
          }
        }
      });
    }
    const currentMode = currentConfig.chatOverlay || "off";
    panel.querySelectorAll(".ytc-mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-overlay") === currentMode);
    });
    panel.querySelectorAll(".ytc-item[data-toggle]").forEach((item) => {
      const key = item.getAttribute("data-toggle");
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox && key in currentConfig) {
        checkbox.checked = !!currentConfig[key];
      }
    });
    panel.querySelectorAll(".ytc-col-btn").forEach((colBtn) => {
      const cols = parseInt(colBtn.getAttribute("data-cols"), 10);
      colBtn.classList.toggle("active", cols === currentConfig.columns);
    });
    const currentQuality = currentConfig.preferredQuality || "auto";
    panel.querySelectorAll(".ytc-quality-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-quality") === currentQuality);
    });
    const qualityBadge = panel.querySelector(".ytc-quality-badge");
    if (qualityBadge) {
      const labels = {
        auto: "TỰ ĐỘNG",
        max: "CAO NHẤT",
        "1440p": "2K",
        "1080p": "1080P",
        "720p": "720P"
      };
      qualityBadge.textContent = labels[currentQuality] || currentQuality.toUpperCase();
    }
    const rowCaptionLang = panel.querySelector("#ytc-row-captionlang");
    if (rowCaptionLang) {
      rowCaptionLang.style.display = currentConfig.autoSubtitles ? "flex" : "none";
    }
    const selectCaptionLang = panel.querySelector("#ytc-select-captionlang");
    if (selectCaptionLang) {
      selectCaptionLang.value = currentConfig.captionLanguage || "auto";
    }
  }
  var init_sync = __esm({
    "src/ui/sync.js"() {
      init_config();
      init_utils();
    }
  });

  // src/chat/chatObserver.js
  function setUserManuallyOpenedChat(v) {
    userManuallyOpenedChat = v;
    try {
      window.userManuallyOpenedChat = v;
    } catch (e) {
    }
  }
  function setHasAutoCollapsedChatForCurrentVideo(v) {
    hasAutoCollapsedChatForCurrentVideo = v;
    try {
      window.hasAutoCollapsedChatForCurrentVideo = v;
    } catch (e) {
    }
  }
  function resetChatCollapseState() {
    setUserManuallyOpenedChat(false);
    setHasAutoCollapsedChatForCurrentVideo(false);
    if (chatAutoCloseObserver) {
      chatAutoCloseObserver.disconnect();
      chatAutoCloseObserver = null;
    }
    if (chatAutoCloseTimeout) {
      clearTimeout(chatAutoCloseTimeout);
      chatAutoCloseTimeout = null;
    }
  }
  function hookInnerTubeDataForChat(data) {
    if (!currentConfig.hideNativeLiveChat || userManuallyOpenedChat) return;
    try {
      const conversationBar = data?.contents?.twoColumnWatchNextResults?.conversationBar || data?.response?.contents?.twoColumnWatchNextResults?.conversationBar;
      const liveChatRenderer = conversationBar?.liveChatRenderer;
      if (liveChatRenderer) {
        liveChatRenderer.initialDisplayState = "LIVE_CHAT_DISPLAY_STATE_COLLAPSED";
        const toggleButtonRenderer = liveChatRenderer.showHideButton?.toggleButtonRenderer;
        if (toggleButtonRenderer) {
          toggleButtonRenderer.isToggled = false;
        }
      }
    } catch (e) {
    }
  }
  function findNativeChatCloseButton() {
    const topSelectors = [
      // ytd-live-chat-frame (khung chat chính khi đang mở)
      "ytd-live-chat-frame:not([collapsed]) #show-hide-button yt-button-shape button",
      "ytd-live-chat-frame:not([collapsed]) #show-hide-button button",
      "ytd-live-chat-frame:not([collapsed]) #show-hide-button ytd-button-renderer button",
      "ytd-live-chat-frame:not([collapsed]) #show-hide-button ytd-toggle-button-renderer button",
      "ytd-live-chat-frame:not([collapsed]) #show-hide-button",
      "ytd-live-chat-frame:not([collapsed]) #collapse-button button",
      "ytd-live-chat-frame:not([collapsed]) #collapse-button yt-button-shape button",
      "ytd-live-chat-frame:not([collapsed]) #close-button button",
      'ytd-live-chat-frame:not([collapsed]) [aria-label*="Ẩn cuộc trò chuyện" i]',
      'ytd-live-chat-frame:not([collapsed]) [aria-label*="Ẩn trò chuyện" i]',
      'ytd-live-chat-frame:not([collapsed]) [aria-label*="Thu gọn" i]',
      'ytd-live-chat-frame:not([collapsed]) [aria-label*="Hide chat" i]',
      'ytd-live-chat-frame:not([collapsed]) [aria-label*="Collapse" i]',
      // Engagement panels (khi mở dạng panel)
      'ytd-engagement-panel-section-list-renderer[target-id*="chat" i][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] #visibility-button button',
      'ytd-engagement-panel-section-list-renderer[target-id*="chat" i][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] #close-button button',
      'ytd-engagement-panel-section-list-renderer[target-id*="chat" i][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] [aria-label*="Đóng" i]',
      'ytd-engagement-panel-section-list-renderer[target-id*="chat" i][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] [aria-label*="Close" i]',
      'ytd-engagement-panel-section-list-renderer[target-id*="chat" i][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] [aria-label*="Ẩn" i]',
      'ytd-engagement-panel-section-list-renderer[target-id*="chat" i][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] [aria-label*="Hide" i]',
      'ytd-engagement-panel-section-list-renderer[target-id*="chat" i] #visibility-button button',
      'ytd-engagement-panel-section-list-renderer[target-id*="chat" i] #close-button button',
      '#panels-full-bleed-container [target-id*="chat" i] #visibility-button button',
      '#panels-full-bleed-container [target-id*="chat" i] #close-button button',
      // Header renderer nếu xuất hiện trên top
      "yt-live-chat-header-renderer #close-button button",
      "yt-live-chat-header-renderer #close-button yt-icon-button",
      "yt-live-chat-header-renderer #close-button yt-button-shape button",
      "yt-live-chat-header-renderer #collapse-button button",
      'yt-live-chat-header-renderer [aria-label*="Ẩn" i]',
      'yt-live-chat-header-renderer [aria-label*="Hide" i]',
      '#close-button button[aria-label*="Đóng" i]',
      '#close-button button[aria-label*="Close" i]'
    ];
    for (const sel of topSelectors) {
      const btn = document.querySelector(sel);
      if (btn && btn.offsetParent !== null) {
        return btn;
      }
    }
    const nativeFrames = document.querySelectorAll(
      'iframe#chatframe:not(#ytc-bg-live-chat), ytd-live-chat-frame iframe:not(#ytc-bg-live-chat), ytd-engagement-panel-section-list-renderer[target-id*="chat" i] iframe:not(#ytc-bg-live-chat)'
    );
    const iframeSelectors = [
      "yt-live-chat-header-renderer #close-button button",
      "yt-live-chat-header-renderer #close-button yt-icon-button",
      "yt-live-chat-header-renderer #close-button yt-button-shape button",
      "yt-live-chat-header-renderer #collapse-button button",
      "yt-live-chat-header-renderer #collapse-button yt-icon-button",
      "#close-button yt-button-renderer button",
      "#close-button yt-icon-button",
      "#close-button button",
      "#collapse-button button",
      'yt-button-shape button[aria-label*="Ẩn" i]',
      'yt-button-shape button[aria-label*="Thu gọn" i]',
      'yt-button-shape button[aria-label*="Hide" i]',
      'yt-button-shape button[aria-label*="Collapse" i]',
      'yt-button-shape button[aria-label*="Close" i]',
      'yt-button-shape button[aria-label*="Đóng" i]',
      'button[aria-label*="Ẩn" i]',
      'button[aria-label*="Thu gọn" i]',
      'button[aria-label*="Hide" i]',
      'button[aria-label*="Collapse" i]',
      'button[aria-label*="Close" i]',
      'button[aria-label*="Đóng" i]'
    ];
    for (const frame of nativeFrames) {
      try {
        const doc = frame.contentDocument || frame.contentWindow?.document;
        if (doc) {
          for (const sel of iframeSelectors) {
            const btn = doc.querySelector(sel);
            if (btn && btn.offsetParent !== null) {
              return btn;
            }
          }
        }
      } catch (e) {
      }
    }
    return null;
  }
  function autoCollapseNativeChatIfOpen(force = false) {
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return false;
    if (!currentConfig.hideNativeLiveChat) return false;
    if (!force && (hasAutoCollapsedChatForCurrentVideo || userManuallyOpenedChat)) return false;
    let collapsedSomething = false;
    const chatFrame = document.querySelector("ytd-live-chat-frame#chat, #chat.ytd-watch-flexy, #chat-container ytd-live-chat-frame");
    if (chatFrame) {
      const isCollapsed = chatFrame.hasAttribute("collapsed") || chatFrame.collapsed === true;
      if (!isCollapsed) {
        const collapseBtn = chatFrame.querySelector(
          '#show-hide-button yt-button-shape button, #show-hide-button button, #show-hide-button ytd-button-renderer button, #show-hide-button ytd-toggle-button-renderer button, #show-hide-button, #collapse-button button, #collapse-button yt-button-shape button, #close-button button, [aria-label*="Ẩn" i], [aria-label*="Hide" i], [aria-label*="Thu gọn" i]'
        );
        if (collapseBtn) {
          collapseBtn.click();
          collapsedSomething = true;
        }
        chatFrame.setAttribute("collapsed", "");
        chatFrame.collapsed = true;
        if (typeof chatFrame.collapse === "function") {
          try {
            chatFrame.collapse();
          } catch (e) {
          }
        }
        if (chatFrame.data?.liveChatRenderer) {
          chatFrame.data.liveChatRenderer.initialDisplayState = "LIVE_CHAT_DISPLAY_STATE_COLLAPSED";
        }
        collapsedSomething = true;
      } else {
        collapsedSomething = true;
      }
    }
    const engagementPanel = document.querySelector(
      'ytd-engagement-panel-section-list-renderer[target-id*="chat" i][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"], #panels-full-bleed-container ytd-engagement-panel-section-list-renderer[target-id*="chat" i][visibility*="EXPANDED"]'
    );
    if (engagementPanel) {
      const panelCloseBtn = engagementPanel.querySelector(
        '#visibility-button button, #close-button button, yt-button-shape button, [aria-label*="Đóng" i], [aria-label*="Close" i], [aria-label*="Ẩn" i], [aria-label*="Hide" i]'
      );
      if (panelCloseBtn) {
        panelCloseBtn.click();
        collapsedSomething = true;
      }
      if (typeof engagementPanel.setPanelVisibility === "function") {
        try {
          engagementPanel.setPanelVisibility("ENGAGEMENT_PANEL_VISIBILITY_HIDDEN");
        } catch (e) {
        }
      }
      engagementPanel.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN");
      collapsedSomething = true;
    }
    const closeBtn = findNativeChatCloseButton();
    if (closeBtn) {
      closeBtn.click();
      collapsedSomething = true;
    }
    const nativeFrames = document.querySelectorAll(
      "iframe#chatframe:not(#ytc-bg-live-chat), ytd-live-chat-frame iframe:not(#ytc-bg-live-chat)"
    );
    nativeFrames.forEach((frame) => {
      try {
        frame.contentWindow?.postMessage({ type: "YTC_CLOSE_NATIVE_CHAT" }, "*");
      } catch (e) {
      }
    });
    if (collapsedSomething) {
      setHasAutoCollapsedChatForCurrentVideo(true);
      if (chatAutoCloseObserver) {
        chatAutoCloseObserver.disconnect();
        chatAutoCloseObserver = null;
      }
      return true;
    }
    const nativeFrame = document.querySelector("iframe#chatframe:not(#ytc-bg-live-chat)");
    if (nativeFrame && !nativeFrame._ytcAutoCloseBound) {
      nativeFrame._ytcAutoCloseBound = true;
      nativeFrame.addEventListener("load", () => {
        if (!hasAutoCollapsedChatForCurrentVideo && !userManuallyOpenedChat && currentConfig.hideNativeLiveChat) {
          setTimeout(() => autoCollapseNativeChatIfOpen(), 50);
          setTimeout(() => autoCollapseNativeChatIfOpen(), 200);
          setTimeout(() => autoCollapseNativeChatIfOpen(), 500);
        }
      });
    }
    return false;
  }
  function setupAutoCloseObserver() {
    if (!currentConfig.hideNativeLiveChat) return;
    if (hasAutoCollapsedChatForCurrentVideo || userManuallyOpenedChat) return;
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
    if (chatAutoCloseObserver) {
      chatAutoCloseObserver.disconnect();
      chatAutoCloseObserver = null;
    }
    if (chatAutoCloseTimeout) {
      clearTimeout(chatAutoCloseTimeout);
      chatAutoCloseTimeout = null;
    }
    if (autoCollapseNativeChatIfOpen()) {
      return;
    }
    const retryDelays = [150, 500, 1200];
    retryDelays.forEach((delay) => {
      setTimeout(() => {
        if (!hasAutoCollapsedChatForCurrentVideo && !userManuallyOpenedChat && currentConfig.hideNativeLiveChat) {
          autoCollapseNativeChatIfOpen();
        }
      }, delay);
    });
    let autoCloseDebounceTimer = null;
    chatAutoCloseObserver = new MutationObserver(() => {
      if (hasAutoCollapsedChatForCurrentVideo || userManuallyOpenedChat || !currentConfig.hideNativeLiveChat) {
        if (chatAutoCloseObserver) {
          chatAutoCloseObserver.disconnect();
          chatAutoCloseObserver = null;
        }
        return;
      }
      if (autoCloseDebounceTimer) return;
      autoCloseDebounceTimer = setTimeout(() => {
        autoCloseDebounceTimer = null;
        if (autoCollapseNativeChatIfOpen()) {
          if (chatAutoCloseObserver) {
            chatAutoCloseObserver.disconnect();
            chatAutoCloseObserver = null;
          }
        }
      }, 100);
    });
    const target = document.querySelector("#panels-full-bleed-container, #panels, ytd-watch-flexy, #chat-container") || document.body || document.documentElement;
    chatAutoCloseObserver.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["visibility", "collapsed", "panels-open", "has-active-panel"]
    });
    chatAutoCloseTimeout = setTimeout(() => {
      if (chatAutoCloseObserver) {
        chatAutoCloseObserver.disconnect();
        chatAutoCloseObserver = null;
      }
    }, 8e3);
  }
  function isNativeChatOpenInFullscreen() {
    const player = document.querySelector("#movie_player:not(#inline-preview-player)");
    if (player && player.classList.contains("ytp-chat-open")) {
      return true;
    }
    const expandedPanel = document.querySelector(
      '#panels-full-bleed-container [visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"], #panels-full-bleed-container ytd-engagement-panel-section-list-renderer[visibility*="EXPANDED"], ytd-watch-flexy[fullscreen] [visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"], ytd-watch-flexy[fullscreen] ytd-engagement-panel-section-list-renderer[visibility*="EXPANDED"], #panels-full-bleed-container [target-id*="chat"][visibility*="EXPANDED"], ytd-watch-flexy[fullscreen] [target-id*="chat"][visibility*="EXPANDED"], ytd-watch-flexy[fullscreen][has-active-panel], ytd-watch-flexy[fullscreen][panels-open]'
    );
    if (expandedPanel) {
      return true;
    }
    const chatFrame = document.querySelector(
      "#panels-full-bleed-container ytd-live-chat-frame#chat, #panels-full-bleed-container #chat.ytd-watch-flexy, ytd-watch-flexy[fullscreen] #panels-full-bleed-container ytd-live-chat-frame"
    );
    if (chatFrame && !chatFrame.hasAttribute("collapsed") && !chatFrame.hidden) {
      return true;
    }
    return false;
  }
  function syncNativeChatFullscreenState() {
    const isFs = !!(document.fullscreenElement || document.querySelector("#movie_player.ytp-fullscreen"));
    if (!isFs) return;
    if (!userManuallyOpenedChat || currentConfig.hideNativeLiveChat) {
      if (currentConfig.chatOverlay && currentConfig.chatOverlay !== "off" || currentConfig.hideNativeLiveChat) {
        setNativeChatHiddenState(true);
      }
    } else {
      setNativeChatHiddenState(false);
    }
  }
  function observePlayerChatState() {
  }
  function observeFullscreenChatPanels() {
  }
  function setupChatToggleListeners() {
    if (chatToggleListenersBound) return;
    chatToggleListenersBound = true;
    document.addEventListener("click", (e) => {
      if (!e.isTrusted) return;
      if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
      const inChatArea = e.target.closest(
        '#chat, ytd-live-chat-frame, #chat-container, ytd-engagement-panel-section-list-renderer[target-id*="chat" i], #panels-full-bleed-container, .ytp-live-chat-button, .ytp-chat-button, #show-hide-button, #collapse-button, #close-button, #teaser, #chat-teaser'
      );
      if (!inChatArea) return;
      const isCloseBtn = !!e.target.closest(
        '#close-button, #visibility-button, #collapse-button, [aria-label*="Đóng" i], [aria-label*="Close" i], [aria-label*="Ẩn" i], [aria-label*="Hide" i], [aria-label*="Thu gọn" i]'
      );
      if (isCloseBtn) {
        setUserManuallyOpenedChat(false);
        setHasAutoCollapsedChatForCurrentVideo(true);
        const isFs2 = !!(document.fullscreenElement || document.querySelector("#movie_player.ytp-fullscreen"));
        if (isFs2 && currentConfig.chatOverlay && currentConfig.chatOverlay !== "off") {
          setNativeChatHiddenState(true);
        }
        return;
      }
      const isExplicitOpenBtn = !!e.target.closest(
        '#show-hide-button, #teaser, #chat-teaser, [aria-label*="Hiện" i], [aria-label*="Show" i], [aria-label*="Mở" i], [aria-label*="Open" i]'
      );
      const isPlayerChatToggle = !!e.target.closest('.ytp-live-chat-button, .ytp-chat-button, button[data-tooltip-target-id*="chat" i]');
      if (isExplicitOpenBtn || isPlayerChatToggle) {
        setUserManuallyOpenedChat(true);
        setHasAutoCollapsedChatForCurrentVideo(true);
        if (chatAutoCloseObserver) {
          chatAutoCloseObserver.disconnect();
          chatAutoCloseObserver = null;
        }
        const isFs2 = !!(document.fullscreenElement || document.querySelector("#movie_player.ytp-fullscreen"));
        if (isFs2) {
          if (!isNativeChatOpenInFullscreen()) {
            setNativeChatHiddenState(false);
          } else {
            setUserManuallyOpenedChat(false);
          }
        } else {
          setNativeChatHiddenState(false);
        }
      }
      const isFs = !!(document.fullscreenElement || document.querySelector("#movie_player.ytp-fullscreen"));
      if (isFs) {
        setTimeout(syncNativeChatFullscreenState, 120);
      }
    }, true);
  }
  function syncNativeChatState() {
    if (currentConfig.hideNativeLiveChat) {
      autoCollapseNativeChatIfOpen();
    }
    if ((!currentConfig.chatOverlay || currentConfig.chatOverlay === "off") && !currentConfig.hideNativeLiveChat) {
      setNativeChatHiddenState(false);
      return;
    }
    const isFs = !!(document.fullscreenElement || document.querySelector("#movie_player.ytp-fullscreen"));
    if (isFs) {
      if (!userManuallyOpenedChat || currentConfig.hideNativeLiveChat) {
        setNativeChatHiddenState(true);
      } else {
        setNativeChatHiddenState(false);
      }
    } else {
      setNativeChatHiddenState(false);
    }
  }
  function onTheaterModeChanged(isTheater) {
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
    ensureChatOverlayContainers();
    const player = document.querySelector("#movie_player:not(#inline-preview-player)");
    if (player && streamerBox) {
      applyChatBoxPos(streamerBox, player);
    }
    if (currentConfig.chatOverlay && currentConfig.chatOverlay !== "off") {
      if (currentConfig.chatOverlay === "danmaku") {
        startDanmakuScheduler();
      }
      setTimeout(() => {
        ensureChatOverlayContainers();
        const p = document.querySelector("#movie_player:not(#inline-preview-player)");
        if (p && streamerBox) applyChatBoxPos(streamerBox, p);
        findAndObserveItems();
        requestExistingMessages();
      }, 150);
      setTimeout(() => {
        ensureChatOverlayContainers();
        const p = document.querySelector("#movie_player:not(#inline-preview-player)");
        if (p && streamerBox) applyChatBoxPos(streamerBox, p);
        findAndObserveItems();
      }, 600);
      setTimeout(() => {
        ensureChatOverlayContainers();
        const p = document.querySelector("#movie_player:not(#inline-preview-player)");
        if (p && streamerBox) applyChatBoxPos(streamerBox, p);
        findAndObserveItems();
      }, 1500);
      ensureBackgroundLiveChat();
    }
  }
  function setupTheaterModeObserver() {
    if (theaterObserver) return;
    const watchFlexy = document.querySelector("ytd-watch-flexy");
    if (!watchFlexy) {
      setTimeout(setupTheaterModeObserver, 500);
      return;
    }
    let lastTheater = watchFlexy.hasAttribute("theater");
    theaterObserver = new MutationObserver(() => {
      const isTheater = watchFlexy.hasAttribute("theater");
      if (isTheater !== lastTheater) {
        lastTheater = isTheater;
        onTheaterModeChanged(isTheater);
      }
    });
    theaterObserver.observe(watchFlexy, { attributes: true, attributeFilter: ["theater"] });
    document.addEventListener("keydown", (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
      if (e.key === "t" || e.key === "T" || e.code === "KeyT") {
        setTimeout(() => {
          const cur = watchFlexy.hasAttribute("theater");
          if (cur !== lastTheater) {
            lastTheater = cur;
            onTheaterModeChanged(cur);
          }
        }, 80);
      }
    }, true);
  }
  function getAllChatElements(scope) {
    const root = scope || document;
    return root.querySelectorAll(
      "yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, yt-live-chat-paid-sticker-renderer"
    );
  }
  function queryAllLiveChatMessages() {
    const msgs = [];
    const mainEls = getAllChatElements(document);
    if (mainEls && mainEls.length) {
      mainEls.forEach((el) => msgs.push(el));
    }
    const frames = document.querySelectorAll('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"]');
    frames.forEach((frame) => {
      try {
        const doc = frame.contentDocument || frame.contentWindow?.document;
        if (doc) {
          const iframeEls = getAllChatElements(doc);
          if (iframeEls && iframeEls.length) {
            iframeEls.forEach((el) => msgs.push(el));
          }
        }
      } catch (e) {
      }
    });
    return msgs;
  }
  function requestExistingMessages() {
    function doFetch() {
      const allExisting = queryAllLiveChatMessages();
      if (allExisting && allExisting.length > 0) {
        if (currentConfig.chatOverlay === "streamer") {
          const recent = allExisting.slice(-6);
          recent.forEach((node, i) => {
            const data = extractMessageData(node);
            if (data) {
              data.isBacklog = true;
              setTimeout(() => displayChatMessage(data, true), i * 80);
            }
          });
          return true;
        } else if (currentConfig.chatOverlay === "danmaku") {
          const recent = allExisting.slice(-4);
          recent.forEach((node, i) => {
            const data = extractMessageData(node);
            if (data) {
              data.isBacklog = true;
              setTimeout(() => displayChatMessage(data, true), i * 500);
            }
          });
          return true;
        }
      }
      return false;
    }
    const found = doFetch();
    if (!found) {
      setTimeout(doFetch, 500);
      setTimeout(doFetch, 1500);
    }
    const frames = document.querySelectorAll('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"]');
    frames.forEach((frame) => {
      if (frame.contentWindow) {
        try {
          frame.contentWindow.postMessage({ type: "YTC_REQUEST_EXISTING_MSGS" }, "*");
        } catch (e) {
        }
      }
    });
  }
  function getCurrentLiveVideoId() {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("v");
    if (v) return v;
    const liveMatch = window.location.pathname.match(/\/live\/([a-zA-Z0-9_-]+)/);
    if (liveMatch) return liveMatch[1];
    const player = document.querySelector("#movie_player");
    if (player && typeof player.getVideoData === "function") {
      const data = player.getVideoData();
      if (data && data.video_id) return data.video_id;
    }
    return null;
  }
  function ensureBackgroundLiveChat() {
    if (!currentConfig.chatOverlay || currentConfig.chatOverlay === "off") {
      if (bgChatIframe) {
        bgChatIframe.remove();
        bgChatIframe = null;
        currentBgVideoId = null;
      }
      return;
    }
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) {
      return;
    }
    if (!hasLiveOrChatSupport()) {
      return;
    }
    const videoId = getCurrentLiveVideoId();
    if (!videoId) return;
    if (bgChatIframe && currentBgVideoId === videoId && document.body.contains(bgChatIframe)) {
      return;
    }
    if (bgChatIframe) {
      bgChatIframe.remove();
      bgChatIframe = null;
    }
    currentBgVideoId = videoId;
    bgChatIframe = document.createElement("iframe");
    bgChatIframe.id = "ytc-bg-live-chat";
    const nativeFrame = document.querySelector("iframe#chatframe, ytd-live-chat-frame iframe");
    let targetSrc = `https://www.youtube.com/live_chat?v=${videoId}`;
    if (nativeFrame && nativeFrame.src && nativeFrame.src.includes("live_chat")) {
      targetSrc = nativeFrame.src;
    }
    if (targetSrc.includes("?")) {
      targetSrc += "&ytc_bg=1";
    } else {
      targetSrc += "?ytc_bg=1";
    }
    bgChatIframe.src = targetSrc;
    bgChatIframe.style.cssText = "position:fixed !important;bottom:0 !important;right:0 !important;width:2px !important;height:2px !important;opacity:0.001 !important;pointer-events:none !important;z-index:-9999 !important;border:none !important;";
    bgChatIframe.addEventListener("load", () => {
      setTimeout(findAndObserveItems, 200);
      setTimeout(findAndObserveItems, 800);
    });
    document.body.appendChild(bgChatIframe);
  }
  function stopAllLiveChatIfDisabled() {
    const isOverlayOn = currentConfig.chatOverlay && currentConfig.chatOverlay !== "off";
    if (!isOverlayOn) {
      if (bgChatIframe) {
        bgChatIframe.remove();
        bgChatIframe = null;
        currentBgVideoId = null;
      }
    }
  }
  function restoreNativeLiveChatIfSaved() {
  }
  function updateChatOverlayVisibility() {
    const mode = currentConfig.chatOverlay || "off";
    if (mode !== "off") {
      ensureChatOverlayContainers();
    }
    const danmaku = document.getElementById("ytc-danmaku-container") || danmakuContainer;
    const streamer = document.getElementById("ytc-streamer-box") || streamerBox;
    const player = document.querySelector("#movie_player:not(#inline-preview-player)");
    const showDanmaku = mode === "danmaku";
    const showStreamer = mode === "streamer";
    if (danmaku) {
      danmaku.style.display = showDanmaku ? "block" : "none";
      danmaku.innerHTML = "";
      danmakuQueue.length = 0;
      laneNextAvailableTime.fill(0);
      setLastDanmakuSpawnTime(Date.now() + 400);
      setLastSpawnedLane(-1);
      if (showDanmaku) {
        stopDanmakuScheduler();
        startDanmakuScheduler();
      } else {
        stopDanmakuScheduler();
      }
    }
    if (streamer) {
      streamer.style.display = showStreamer ? "flex" : "none";
      const msgs = streamer.querySelector(".ytc-box-messages");
      if (msgs) {
        msgs.innerHTML = "";
        if (showStreamer) {
          const loading = document.createElement("div");
          loading.className = "ytc-box-item ytc-box-loading";
          loading.style.cssText = "padding:8px;text-align:center;color:#fff;font-size:12px;font-style:italic;";
          loading.textContent = "💬 Đang kết nối Live Chat...";
          msgs.appendChild(loading);
        }
      }
      if (showStreamer && player) {
        setupChatBoxInteractions(streamer, player);
        applyChatBoxPos(streamer, player);
        showInitialBox(streamer);
      }
    }
    if (mode !== "off") {
      ensureNativeLiveChatRunning();
      seenMessageIds.clear();
      ensureBackgroundLiveChat();
      requestExistingMessages();
    } else {
      setNativeChatHiddenState(false);
      stopAllLiveChatIfDisabled();
    }
  }
  function initIframeChatSender() {
    let iframeConfig = currentConfig;
    function injectIframeEmojiStyle() {
      let style = document.getElementById("ytc-iframe-emoji-style");
      if (!style) {
        style = document.createElement("style");
        style.id = "ytc-iframe-emoji-style";
        style.textContent = `
                html.ytc-hide-chat-emojis img.emoji,
                html.ytc-hide-chat-emojis img.yt-emoji,
                html.ytc-hide-chat-emojis .emoji,
                html.ytc-hide-chat-emojis yt-live-chat-paid-sticker-renderer {
                    display: none !important;
                }
                html.ytc-hide-chat-emojis .ytc-emoji-only-msg {
                    display: none !important;
                }
            `;
        (document.head || document.documentElement).appendChild(style);
      }
    }
    function filterSingleMessageNode(node, hideEmojis) {
      if (!node || node.nodeType !== 1) return;
      if (!hideEmojis) {
        node.classList.remove("ytc-emoji-only-msg");
        return;
      }
      if (node.tagName && node.tagName.toLowerCase().includes("sticker")) {
        node.classList.add("ytc-emoji-only-msg");
        return;
      }
      const msgEl = node.querySelector("#message");
      if (msgEl) {
        const clone = msgEl.cloneNode(true);
        const images = clone.querySelectorAll("img");
        images.forEach((img) => img.remove());
        let textOnly = (clone.textContent || "").replace(UNICODE_EMOJI_REGEX2, "").trim();
        if (textOnly.length === 0) {
          node.classList.add("ytc-emoji-only-msg");
        } else {
          node.classList.remove("ytc-emoji-only-msg");
        }
      }
    }
    function filterAllIframeMessages(hideEmojis) {
      const all = getAllChatElements(document);
      all.forEach((el) => filterSingleMessageNode(el, hideEmojis));
    }
    function updateIframeEmojiState(cfg) {
      iframeConfig = cfg || iframeConfig;
      const hide = !!iframeConfig.hideChatEmojis;
      document.documentElement.classList.toggle("ytc-hide-chat-emojis", hide);
      if (document.body) {
        document.body.classList.toggle("ytc-hide-chat-emojis", hide);
      }
      filterAllIframeMessages(hide);
    }
    injectIframeEmojiStyle();
    updateIframeEmojiState(currentConfig);
    function handleNode(node) {
      if (!node || node.nodeType !== 1) return;
      filterSingleMessageNode(node, !!iframeConfig.hideChatEmojis);
      const selector = "yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, yt-live-chat-paid-sticker-renderer";
      if (node.matches && node.matches(selector)) {
        const data = extractMessageData(node);
        if (data) {
          try {
            window.top.postMessage({ type: "YTC_LIVE_CHAT_MSG", payload: data }, "*");
          } catch (e) {
          }
        }
        return;
      }
      if (node.querySelectorAll) {
        const targets = node.querySelectorAll(selector);
        targets.forEach((t) => {
          filterSingleMessageNode(t, !!iframeConfig.hideChatEmojis);
          const data = extractMessageData(t);
          if (data) {
            try {
              window.top.postMessage({ type: "YTC_LIVE_CHAT_MSG", payload: data }, "*");
            } catch (e) {
            }
          }
        });
      }
    }
    function sendExisting(items) {
      const existing = getAllChatElements(items);
      if (existing && existing.length) {
        existing.forEach((node) => filterSingleMessageNode(node, !!iframeConfig.hideChatEmojis));
        const recent = Array.from(existing).slice(-4);
        recent.forEach((node) => {
          const data = extractMessageData(node);
          if (data) {
            data.isBacklog = true;
            try {
              window.top.postMessage({ type: "YTC_LIVE_CHAT_MSG", payload: data, isBacklog: true }, "*");
            } catch (e) {
            }
          }
        });
      }
    }
    function attach(items) {
      if (!items || items._ytcBoundIframe) return;
      items._ytcBoundIframe = true;
      sendExisting(items);
      const obs = new MutationObserver((mutations) => {
        const selector = "yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, yt-live-chat-paid-sticker-renderer";
        const newNodes = [];
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (!node || node.nodeType !== 1) continue;
            if (node.matches && node.matches(selector)) {
              filterSingleMessageNode(node, !!iframeConfig.hideChatEmojis);
              newNodes.push(node);
            } else if (node.querySelectorAll) {
              const targets = node.querySelectorAll(selector);
              targets.forEach((t) => {
                filterSingleMessageNode(t, !!iframeConfig.hideChatEmojis);
                newNodes.push(t);
              });
            }
          }
        }
        if (newNodes.length === 0) return;
        const nodesToProcess = newNodes.length > 5 ? newNodes.slice(-4) : newNodes;
        nodesToProcess.forEach((node) => {
          const data = extractMessageData(node);
          if (data) {
            try {
              window.top.postMessage({ type: "YTC_LIVE_CHAT_MSG", payload: data }, "*");
            } catch (e) {
            }
          }
        });
      });
      obs.observe(items, { childList: true });
    }
    function tryFindItems() {
      const items = document.querySelector("yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #chat #items, #items");
      if (items) {
        attach(items);
        return true;
      }
      return false;
    }
    if (!tryFindItems()) {
      const obs = new MutationObserver(() => {
        if (tryFindItems()) obs.disconnect();
      });
      obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
      setTimeout(() => obs.disconnect(), 2e4);
      const pollTimer = setInterval(() => {
        if (tryFindItems()) {
          clearInterval(pollTimer);
          obs.disconnect();
        }
      }, 500);
      setTimeout(() => clearInterval(pollTimer), 2e4);
    }
    window.addEventListener("message", (e) => {
      if (e.data && e.data.type === "YTC_CONFIG_UPDATED" && e.data.config) {
        updateIframeEmojiState(e.data.config);
      }
      if (e.data && e.data.type === "YTC_REQUEST_EXISTING_MSGS") {
        const items = document.querySelector("yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #chat #items, #items") || document;
        if (items) sendExisting(items);
      }
      if (e.data && e.data.type === "YTC_CLOSE_NATIVE_CHAT") {
        const btn = document.querySelector(
          'yt-live-chat-header-renderer #close-button button, yt-live-chat-header-renderer #close-button yt-icon-button, yt-live-chat-header-renderer #close-button yt-button-shape button, yt-live-chat-header-renderer #collapse-button button, yt-live-chat-header-renderer #collapse-button yt-icon-button, #close-button yt-button-renderer button, #close-button yt-icon-button, #close-button button, #collapse-button button, yt-button-shape button[aria-label*="Ẩn" i], yt-button-shape button[aria-label*="Thu gọn" i], yt-button-shape button[aria-label*="Hide" i], yt-button-shape button[aria-label*="Collapse" i], yt-button-shape button[aria-label*="Close" i], yt-button-shape button[aria-label*="Đóng" i], button[aria-label*="Ẩn" i], button[aria-label*="Thu gọn" i], button[aria-label*="Hide" i], button[aria-label*="Collapse" i], button[aria-label*="Close" i], button[aria-label*="Đóng" i]'
        );
        if (btn) {
          btn.click();
          try {
            window.top?.postMessage({ type: "YTC_NATIVE_CHAT_CLOSED_SUCCESS" }, "*");
          } catch (err) {
          }
        }
      }
    });
    const isBgFrame = window.frameElement && window.frameElement.id === "ytc-bg-live-chat" || location.href.includes("ytc_bg=1");
    if (!isBgFrame && iframeConfig.hideNativeLiveChat) {
      let tryClickIframeClose = function() {
        try {
          if (window.top && (window.top.hasAutoCollapsedChatForCurrentVideo || window.top.userManuallyOpenedChat)) {
            return true;
          }
        } catch (e) {
        }
        const closeBtn = document.querySelector(
          'yt-live-chat-header-renderer #close-button button, yt-live-chat-header-renderer #close-button yt-icon-button, yt-live-chat-header-renderer #close-button yt-button-shape button, yt-live-chat-header-renderer #collapse-button button, yt-live-chat-header-renderer #collapse-button yt-icon-button, #close-button yt-button-renderer button, #close-button yt-icon-button, #close-button button, #collapse-button button, yt-button-shape button[aria-label*="Ẩn" i], yt-button-shape button[aria-label*="Thu gọn" i], yt-button-shape button[aria-label*="Hide" i], yt-button-shape button[aria-label*="Collapse" i], yt-button-shape button[aria-label*="Close" i], yt-button-shape button[aria-label*="Đóng" i], button[aria-label*="Ẩn" i], button[aria-label*="Thu gọn" i], button[aria-label*="Hide" i], button[aria-label*="Collapse" i], button[aria-label*="Close" i], button[aria-label*="Đóng" i]'
        );
        if (closeBtn) {
          closeBtn.click();
          try {
            if (window.top) window.top.hasAutoCollapsedChatForCurrentVideo = true;
            window.top?.postMessage({ type: "YTC_NATIVE_CHAT_CLOSED_SUCCESS" }, "*");
          } catch (e) {
          }
          return true;
        }
        return false;
      };
      if (!tryClickIframeClose()) {
        const iframeObs = new MutationObserver(() => {
          if (tryClickIframeClose()) {
            iframeObs.disconnect();
          }
        });
        iframeObs.observe(document.body || document.documentElement, { childList: true, subtree: true });
        setTimeout(() => iframeObs.disconnect(), 1e4);
      }
    }
    document.addEventListener("click", (e) => {
      if (!e.isTrusted) return;
      const isClose = !!e.target.closest(
        '#close-button, #collapse-button, [aria-label*="Ẩn" i], [aria-label*="Thu gọn" i], [aria-label*="Hide" i], [aria-label*="Collapse" i], [aria-label*="Close" i], [aria-label*="Đóng" i]'
      );
      if (isClose) {
        try {
          window.top.postMessage({ type: "YTC_NATIVE_CHAT_CLOSED_BY_USER" }, "*");
        } catch (err) {
        }
      }
    }, true);
    if (isBgFrame) {
      setInterval(() => {
        try {
          if (isUserInteractingWithChatMenu(document)) return;
          const showMoreBtn = document.querySelector("#show-more:not([hidden]) button, #show-more button");
          if (showMoreBtn && showMoreBtn.offsetParent !== null) {
            const rect = showMoreBtn.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              showMoreBtn.click();
            }
          }
          const scroller = document.querySelector("#item-scroller, yt-live-chat-item-list-renderer #item-scroller");
          if (scroller) {
            const distFromBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
            if (distFromBottom > 50) {
              scroller.scrollTop = scroller.scrollHeight;
            }
          }
        } catch (e) {
        }
      }, 2e3);
    }
  }
  function isUserInteractingWithChatMenu(doc) {
    const root = doc || document;
    const popups = root.querySelectorAll("tp-yt-iron-dropdown, iron-dropdown, ytd-menu-popup-renderer, tp-yt-paper-listbox");
    for (const popup of popups) {
      if (popup.offsetParent !== null && !popup.hasAttribute("aria-hidden") && popup.style.display !== "none") {
        return true;
      }
    }
    return false;
  }
  function observeItemsElement(items) {
    if (!items || items._ytcBoundTop) return;
    items._ytcBoundTop = true;
    const obs = new MutationObserver((mutations) => {
      if (!currentConfig.chatOverlay || currentConfig.chatOverlay === "off") return;
      const selector = "yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, yt-live-chat-paid-sticker-renderer";
      const newNodes = [];
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!node || node.nodeType !== 1) continue;
          if (node.matches && node.matches(selector)) {
            newNodes.push(node);
          } else if (node.querySelectorAll) {
            const targets = node.querySelectorAll(selector);
            targets.forEach((t) => newNodes.push(t));
          }
        }
      }
      if (newNodes.length === 0) return;
      const nodesToProcess = newNodes.length > 5 ? newNodes.slice(-4) : newNodes;
      if (newNodes.length > 5) {
        const discarded = newNodes.slice(0, -4);
        discarded.forEach((n) => {
          if (n.id) seenMessageIds.add(n.id);
        });
      }
      nodesToProcess.forEach((node) => {
        const data = extractMessageData(node);
        if (data) displayChatMessage(data);
      });
    });
    obs.observe(items, { childList: true });
  }
  function findAndObserveItems() {
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
    const mainItems = document.querySelectorAll("yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items");
    mainItems.forEach((items) => observeItemsElement(items));
    const frames = document.querySelectorAll('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"], iframe#ytc-bg-live-chat');
    frames.forEach((frame) => {
      if (!frame._ytcLoadBound) {
        frame._ytcLoadBound = true;
        frame.addEventListener("load", () => {
          setTimeout(findAndObserveItems, 200);
          setTimeout(findAndObserveItems, 800);
          setTimeout(findAndObserveItems, 1500);
        });
      }
      try {
        const doc = frame.contentDocument || frame.contentWindow?.document;
        if (doc && doc.location && doc.location.href !== "about:blank") {
          let docStyle = doc.getElementById("ytc-iframe-emoji-style");
          if (!docStyle) {
            docStyle = doc.createElement("style");
            docStyle.id = "ytc-iframe-emoji-style";
            docStyle.textContent = `
                        html.ytc-hide-chat-emojis img.emoji,
                        html.ytc-hide-chat-emojis img.yt-emoji,
                        html.ytc-hide-chat-emojis .emoji,
                        html.ytc-hide-chat-emojis yt-live-chat-paid-sticker-renderer {
                            display: none !important;
                        }
                        html.ytc-hide-chat-emojis .ytc-emoji-only-msg {
                            display: none !important;
                        }
                    `;
            (doc.head || doc.documentElement).appendChild(docStyle);
          }
          doc.documentElement.classList.toggle("ytc-hide-chat-emojis", !!currentConfig.hideChatEmojis);
          if (doc.body) {
            doc.body.classList.toggle("ytc-hide-chat-emojis", !!currentConfig.hideChatEmojis);
          }
          const iframeItems = doc.querySelectorAll("yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #items");
          if (iframeItems.length > 0) {
            iframeItems.forEach((items) => observeItemsElement(items));
          } else if (!doc._ytcDocObserverAttached) {
            doc._ytcDocObserverAttached = true;
            const docObs = new MutationObserver(() => {
              const lateItems = doc.querySelectorAll("yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #items");
              if (lateItems.length > 0) {
                lateItems.forEach((items) => observeItemsElement(items));
                docObs.disconnect();
              }
            });
            docObs.observe(doc.documentElement || doc.body, { childList: true, subtree: true });
            setTimeout(() => docObs.disconnect(), 2e4);
          }
        }
      } catch (e) {
      }
    });
  }
  function initChatOverlay() {
    if (chatOverlayInitialized) return;
    setChatOverlayInitialized(true);
    setupChatToggleListeners();
    observePlayerChatState();
    observeFullscreenChatPanels();
    document.addEventListener("fullscreenchange", () => {
      const isFs = !!(document.fullscreenElement || document.querySelector("#movie_player.ytp-fullscreen"));
      const isOpen = isNativeChatOpenInFullscreen();
      if (!isFs) {
        setNativeChatHiddenState(false);
      } else if ((isOpen || userManuallyOpenedChat) && !currentConfig.hideNativeLiveChat) {
        userManuallyOpenedChat = true;
        setNativeChatHiddenState(false);
      } else if (currentConfig.chatOverlay && currentConfig.chatOverlay !== "off" || currentConfig.hideNativeLiveChat) {
        setNativeChatHiddenState(true);
      }
      syncPlayerFullscreenSize();
      setTimeout(syncPlayerFullscreenSize, 60);
      setTimeout(syncPlayerFullscreenSize, 180);
      setTimeout(syncPlayerFullscreenSize, 350);
    });
    let windowResizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(windowResizeTimer);
      windowResizeTimer = setTimeout(() => {
        syncPlayerFullscreenSize();
      }, 150);
    });
    window.addEventListener("ytc-close-streamer-box", () => {
      currentConfig.chatOverlay = "off";
      updateChatOverlayVisibility();
      Promise.resolve().then(() => (init_sync(), sync_exports)).then((m) => m.syncPanelState()).catch(() => {
      });
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        if (currentConfig.chatOverlay && currentConfig.chatOverlay !== "off") {
          if (currentConfig.chatOverlay === "danmaku") {
            startDanmakuScheduler();
          }
          requestExistingMessages();
        }
      }
    });
    window.addEventListener("message", (e) => {
      if (e.data && e.data.type === "YTC_LIVE_CHAT_MSG" && e.data.payload) {
        const isBacklog = !!e.data.isBacklog || !!e.data.payload.isBacklog;
        displayChatMessage(e.data.payload, isBacklog);
      }
      if (e.data && e.data.type === "YTC_NATIVE_CHAT_CLOSED_BY_USER") {
        setUserManuallyOpenedChat(false);
        setHasAutoCollapsedChatForCurrentVideo(true);
      }
      if (e.data && e.data.type === "YTC_NATIVE_CHAT_CLOSED_SUCCESS") {
        setHasAutoCollapsedChatForCurrentVideo(true);
        if (chatAutoCloseObserver) {
          chatAutoCloseObserver.disconnect();
          chatAutoCloseObserver = null;
        }
      }
    });
    if (currentConfig.chatOverlay && currentConfig.chatOverlay !== "off") {
      findAndObserveItems();
    }
    if (currentConfig.hideNativeLiveChat) {
      setupAutoCloseObserver();
      autoCollapseNativeChatIfOpen();
      setTimeout(autoCollapseNativeChatIfOpen, 300);
      setTimeout(autoCollapseNativeChatIfOpen, 800);
      setTimeout(autoCollapseNativeChatIfOpen, 1500);
    }
    setupTheaterModeObserver();
    setInterval(() => {
      if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
      if (currentConfig.chatOverlay && currentConfig.chatOverlay !== "off") {
        findAndObserveItems();
        ensureNativeLiveChatRunning();
        ensureBackgroundLiveChat();
      }
    }, 2e3);
    if (location.pathname.startsWith("/watch") || location.pathname.startsWith("/live")) {
      whenElement("#movie_player:not(#inline-preview-player)", () => {
        observePlayerChatState();
        observeFullscreenChatPanels();
        ensureChatOverlayContainers();
        if (currentConfig.chatOverlay && currentConfig.chatOverlay !== "off") {
          ensureBackgroundLiveChat();
          ensureNativeLiveChatRunning();
        } else if (currentConfig.hideNativeLiveChat) {
          stopAllLiveChatIfDisabled();
        }
      });
    }
  }
  var userManuallyOpenedChat, hasAutoCollapsedChatForCurrentVideo, chatAutoCloseObserver, chatAutoCloseTimeout, chatToggleListenersBound, ensureNativeLiveChatRunning, theaterObserver, bgChatIframe, currentBgVideoId, UNICODE_EMOJI_REGEX2;
  var init_chatObserver = __esm({
    "src/chat/chatObserver.js"() {
      init_config();
      init_utils();
      init_chatState();
      init_streamerBox();
      init_danmaku();
      init_chatParser();
      userManuallyOpenedChat = false;
      hasAutoCollapsedChatForCurrentVideo = false;
      chatAutoCloseObserver = null;
      chatAutoCloseTimeout = null;
      if (typeof window !== "undefined") {
        document.addEventListener("yt-page-data-fetched", (evt) => {
          hookInnerTubeDataForChat(evt.detail?.pageData);
          if (currentConfig.hideNativeLiveChat && !userManuallyOpenedChat) {
            autoCollapseNativeChatIfOpen();
            setTimeout(() => autoCollapseNativeChatIfOpen(), 50);
            setTimeout(() => autoCollapseNativeChatIfOpen(), 200);
          }
        });
        document.addEventListener("yt-navigate-finish", () => {
          if (currentConfig.hideNativeLiveChat && !userManuallyOpenedChat) {
            autoCollapseNativeChatIfOpen();
            setTimeout(() => autoCollapseNativeChatIfOpen(), 100);
            setTimeout(() => autoCollapseNativeChatIfOpen(), 300);
            setTimeout(() => autoCollapseNativeChatIfOpen(), 800);
          }
        });
        if (window.ytInitialData) {
          hookInnerTubeDataForChat(window.ytInitialData);
        }
      }
      chatToggleListenersBound = false;
      ensureNativeLiveChatRunning = syncNativeChatState;
      theaterObserver = null;
      bgChatIframe = null;
      currentBgVideoId = null;
      UNICODE_EMOJI_REGEX2 = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{200D}\u{FE0F}]/gu;
    }
  });

  // src/chat/index.js
  var chat_exports = {};
  __export(chat_exports, {
    CHATBOX_POS_KEY: () => CHATBOX_POS_KEY,
    TOTAL_LANES: () => TOTAL_LANES,
    applyChatBoxPos: () => applyChatBoxPos,
    autoCollapseNativeChatIfOpen: () => autoCollapseNativeChatIfOpen,
    centerChatBox: () => centerChatBox,
    chatOverlayInitialized: () => chatOverlayInitialized,
    danmakuContainer: () => danmakuContainer,
    danmakuQueue: () => danmakuQueue,
    displayChatMessage: () => displayChatMessage,
    ensureBackgroundLiveChat: () => ensureBackgroundLiveChat,
    ensureChatOverlayContainers: () => ensureChatOverlayContainers,
    ensureNativeLiveChatRunning: () => ensureNativeLiveChatRunning,
    extractMessageData: () => extractMessageData,
    filterEmojisFromMessage: () => filterEmojisFromMessage,
    findNativeChatCloseButton: () => findNativeChatCloseButton,
    getCurrentLiveVideoId: () => getCurrentLiveVideoId,
    getFallbackAvatar: () => getFallbackAvatar,
    getSavedChatBoxPos: () => getSavedChatBoxPos,
    hasAutoCollapsedChatForCurrentVideo: () => hasAutoCollapsedChatForCurrentVideo,
    initChatOverlay: () => initChatOverlay,
    initIframeChatSender: () => initIframeChatSender,
    isDuplicateMessage: () => isDuplicateMessage,
    isNativeChatHiddenByScript: () => isNativeChatHiddenByScript,
    isNativeChatOpenInFullscreen: () => isNativeChatOpenInFullscreen,
    laneNextAvailableTime: () => laneNextAvailableTime,
    lastDanmakuSpawnTime: () => lastDanmakuSpawnTime,
    lastSpawnedLane: () => lastSpawnedLane,
    observeFullscreenChatPanels: () => observeFullscreenChatPanels,
    observePlayerChatState: () => observePlayerChatState,
    onTheaterModeChanged: () => onTheaterModeChanged,
    requestExistingMessages: () => requestExistingMessages,
    resetChatCollapseState: () => resetChatCollapseState,
    restoreNativeLiveChatIfSaved: () => restoreNativeLiveChatIfSaved,
    saveChatBoxPos: () => saveChatBoxPos,
    seenMessageIds: () => seenMessageIds,
    setChatOverlayInitialized: () => setChatOverlayInitialized,
    setHasAutoCollapsedChatForCurrentVideo: () => setHasAutoCollapsedChatForCurrentVideo,
    setLastDanmakuSpawnTime: () => setLastDanmakuSpawnTime,
    setLastSpawnedLane: () => setLastSpawnedLane,
    setNativeChatHiddenState: () => setNativeChatHiddenState,
    setUserManuallyOpenedChat: () => setUserManuallyOpenedChat,
    setupAutoCloseObserver: () => setupAutoCloseObserver,
    setupChatBoxInteractions: () => setupChatBoxInteractions,
    setupChatToggleListeners: () => setupChatToggleListeners,
    setupTheaterModeObserver: () => setupTheaterModeObserver,
    showInitialBox: () => showInitialBox,
    startDanmakuScheduler: () => startDanmakuScheduler,
    stopAllLiveChatIfDisabled: () => stopAllLiveChatIfDisabled,
    stopDanmakuScheduler: () => stopDanmakuScheduler,
    streamerBox: () => streamerBox,
    streamerMessages: () => streamerMessages,
    syncNativeChatFullscreenState: () => syncNativeChatFullscreenState,
    syncNativeChatState: () => syncNativeChatState,
    syncPlayerFullscreenSize: () => syncPlayerFullscreenSize,
    updateChatOverlayVisibility: () => updateChatOverlayVisibility,
    userManuallyOpenedChat: () => userManuallyOpenedChat
  });
  var init_chat = __esm({
    "src/chat/index.js"() {
      init_chatState();
      init_streamerBox();
      init_danmaku();
      init_chatParser();
      init_chatObserver();
    }
  });

  // src/ui/notifier.js
  var notifier_exports = {};
  __export(notifier_exports, {
    checkAndAutoUpdate: () => checkAndAutoUpdate,
    checkForUpdates: () => checkForUpdates,
    isNewerVersion: () => isNewerVersion,
    setupOnboardingAndUpdates: () => setupOnboardingAndUpdates,
    showTipCard: () => showTipCard
  });
  function isNewerVersion(remote, current) {
    if (!remote || !current) return false;
    const r = remote.split(".").map((x) => parseInt(x, 10) || 0);
    const c = current.split(".").map((x) => parseInt(x, 10) || 0);
    for (let i = 0; i < Math.max(r.length, c.length); i++) {
      const rPart = r[i] || 0;
      const cPart = c[i] || 0;
      if (rPart > cPart) return true;
      if (rPart < cPart) return false;
    }
    return false;
  }
  function showTipCard(btn, { badge, badgeBg, title, desc, btnText, onAction, onClose, tipId = "ytc-onboarding-tip" }) {
    if (!btn || document.getElementById(tipId)) return;
    const tip = document.createElement("div");
    tip.id = tipId;
    setElementHTML(tip, `
        <div class="ytc-onboarding-arrow"></div>
        <div class="ytc-onboarding-header">
            <span class="ytc-onboarding-badge"${badgeBg ? ` style="background:${badgeBg};"` : ""}>${badge}</span>
            <button class="ytc-onboarding-close" title="Đóng">✕</button>
        </div>
        <div class="ytc-onboarding-content">
            <div class="ytc-onboarding-title">${title}</div>
            <div class="ytc-onboarding-desc">${desc}</div>
        </div>
        <div class="ytc-onboarding-footer">
            <button class="ytc-onboarding-btn">${btnText}</button>
        </div>
    `);
    document.body.appendChild(tip);
    const updateTipPos = () => {
      const targetBtn = document.getElementById("ytc-settings-btn") || btn;
      if (!targetBtn || !targetBtn.isConnected || !tip.isConnected) return;
      const rect = targetBtn.getBoundingClientRect();
      if (rect.width === 0 || rect.bottom === 0) return;
      tip.style.top = `${rect.bottom + 12}px`;
      tip.style.right = `${Math.max(10, window.innerWidth - rect.right - 10)}px`;
    };
    updateTipPos();
    window.addEventListener("resize", updateTipPos);
    setTimeout(updateTipPos, 200);
    setTimeout(updateTipPos, 600);
    setTimeout(updateTipPos, 1500);
    const dismissTip = () => {
      window.removeEventListener("resize", updateTipPos);
      tip.remove();
    };
    const actionBtn = tip.querySelector(".ytc-onboarding-btn");
    if (actionBtn) {
      actionBtn.addEventListener("click", () => {
        if (onAction) onAction();
        dismissTip();
      });
    }
    const closeBtn = tip.querySelector(".ytc-onboarding-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (onClose) onClose();
        dismissTip();
      });
    }
    btn.addEventListener("click", dismissTip, { once: true });
  }
  function checkForUpdates(btn) {
    if (updateCheckInitiated) return;
    const targetBtn = document.getElementById("ytc-settings-btn") || btn;
    if (!targetBtn) return;
    updateCheckInitiated = true;
    const CHECK_URL = "https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/package.json";
    const CACHE_KEY = "ytc_remote_ver_cache";
    const now = Date.now();
    const renderUpdateNotification = (remoteVer) => {
      if (!remoteVer || !isNewerVersion(remoteVer, APP_VERSION)) return false;
      const dismissedKey = `ytc_dismiss_ver_${remoteVer.replace(/\./g, "_")}`;
      try {
        if (localStorage.getItem(dismissedKey) === "true") return false;
      } catch (e) {
      }
      const oldTip = document.getElementById("ytc-onboarding-tip");
      if (oldTip) oldTip.remove();
      const currentBtn = document.getElementById("ytc-settings-btn") || btn;
      showTipCard(currentBtn, {
        badge: "BẢN MỚI",
        title: `Đã có bản cập nhật mới v${remoteVer}`,
        desc: `YouTube Customizer v${remoteVer} đã sẵn sàng trên GitHub với các tính năng mới và bản sửa lỗi tối ưu.`,
        btnText: "Cập nhật ngay",
        onAction: () => {
          window.open("https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js", "_blank");
          try {
            localStorage.setItem(dismissedKey, "true");
          } catch (e) {
          }
          const openTime = Date.now();
          const reloadOnReturn = () => {
            if (Date.now() - openTime >= 1200) {
              location.reload();
            }
          };
          window.addEventListener("focus", reloadOnReturn, { once: true });
          document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") reloadOnReturn();
          });
          setTimeout(() => location.reload(), 1e4);
        },
        onClose: () => {
          try {
            localStorage.setItem(dismissedKey, "true");
          } catch (e) {
          }
        }
      });
      return true;
    };
    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached && cached.version && isNewerVersion(cached.version, APP_VERSION)) {
          if (now - cached.time < 15 * 60 * 1e3) {
            renderUpdateNotification(cached.version);
            return;
          }
        }
      }
    } catch (e) {
    }
    fetch(`${CHECK_URL}?_t=${now}_${Math.random().toString(36).slice(2)}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
    }).then((res) => res.json()).then((data) => {
      if (data && data.version) {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ version: data.version, time: Date.now() }));
        } catch (e) {
        }
        renderUpdateNotification(data.version);
      }
    }).catch(() => {
      updateCheckInitiated = false;
    });
  }
  function setupOnboardingAndUpdates(btn) {
    if (!btn) return;
    if (document.getElementById("ytc-onboarding-tip")) {
      const existingTip = document.getElementById("ytc-onboarding-tip");
      if (existingTip && btn.isConnected) {
        const rect = btn.getBoundingClientRect();
        if (rect.width > 0 && rect.bottom > 0) {
          existingTip.style.top = `${rect.bottom + 12}px`;
          existingTip.style.right = `${Math.max(10, window.innerWidth - rect.right - 10)}px`;
        }
      }
      return;
    }
    checkForUpdates(btn);
    setTimeout(() => {
      if (document.getElementById("ytc-onboarding-tip")) return;
      try {
        if (localStorage.getItem(ONBOARDING_KEY) === "true") return;
      } catch (e) {
        return;
      }
      showTipCard(btn, {
        badge: `PHIÊN BẢN v${APP_VERSION}`,
        title: "Cài đặt YouTube Customizer ở đây",
        desc: "Nhấp vào biểu tượng bánh răng này để bật/tắt các tính năng tùy biến theo nhu cầu của bạn.",
        btnText: "Đã hiểu",
        onAction: () => {
          try {
            localStorage.setItem(ONBOARDING_KEY, "true");
          } catch (e) {
          }
        },
        onClose: () => {
          try {
            localStorage.setItem(ONBOARDING_KEY, "true");
          } catch (e) {
          }
        }
      });
    }, 600);
  }
  async function checkAndAutoUpdate(force = false) {
    if (!currentConfig.autoUpdate && !force) return;
    if (window.self !== window.top) return;
    if (window.__ytc_auto_update_checked && !force) return;
    window.__ytc_auto_update_checked = true;
    const now = Date.now();
    const GITHUB_API = "https://api.github.com/repos/huyvu2512/youtube-customizer/contents/package.json?ref=main";
    const RAW_URL = `https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/package.json?_t=${now}_${Math.random().toString(36).slice(2)}`;
    try {
      let pkg = null;
      try {
        const res = await fetch(GITHUB_API, {
          headers: { "Accept": "application/vnd.github.v3.raw" },
          cache: "no-store"
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.version) {
            pkg = data;
          } else if (data && data.content && data.encoding === "base64") {
            pkg = JSON.parse(decodeURIComponent(escape(atob(data.content.replace(/\s/g, "")))));
          }
        }
      } catch (e) {
      }
      if (!pkg || !pkg.version) {
        const rawRes = await fetch(RAW_URL, { cache: "no-store" });
        if (rawRes.ok) {
          pkg = await rawRes.json();
        }
      }
      if (pkg && pkg.version && isNewerVersion(pkg.version, APP_VERSION)) {
        const newVersion = pkg.version;
        const redirectKey = `ytc_auto_redirect_${newVersion.replace(/\./g, "_")}`;
        if (sessionStorage.getItem(redirectKey) === "true" && !force) {
          return;
        }
        sessionStorage.setItem(redirectKey, "true");
        const updateUrl = `https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=${newVersion}`;
        console.log(`[YouTube Customizer] Phát hiện phiên bản mới v${newVersion}, tự động trỏ sang link cập nhật:`, updateUrl);
        window.location.href = updateUrl;
      }
    } catch (err) {
      console.warn("[YouTube Customizer] Tự động kiểm tra cập nhật thất bại:", err);
    }
  }
  var ONBOARDING_KEY, updateCheckInitiated;
  var init_notifier = __esm({
    "src/ui/notifier.js"() {
      init_constants();
      init_config();
      init_utils();
      ONBOARDING_KEY = `ytc_onboarding_v${APP_VERSION.replace(/\./g, "_")}`;
      updateCheckInitiated = false;
    }
  });

  // src/optimization/audioOnly.js
  var audioOnly_exports = {};
  __export(audioOnly_exports, {
    applyAudioOnlyState: () => applyAudioOnlyState,
    initAudioOnly: () => initAudioOnly
  });
  function getPlayer2() {
    return document.querySelector("#movie_player:not(#inline-preview-player)");
  }
  function ensureAudioBadge(player) {
    if (!player) return;
    if (document.getElementById("ytc-audio-only-badge")) return;
    audioBadgeElement = document.createElement("div");
    audioBadgeElement.id = "ytc-audio-only-badge";
    audioBadgeElement.innerHTML = `
        <div class="ytc-audio-badge-title">Đang phát ở Chế độ Chỉ Âm Thanh</div>
        <div class="ytc-audio-badge-sub">Đã tắt video để tiết kiệm tài nguyên</div>
    `;
    player.appendChild(audioBadgeElement);
  }
  function applyAudioOnlyState() {
    const isAudioOnly = !!currentConfig.audioOnlyMode;
    const root = document.documentElement;
    const body = document.body;
    root.classList.toggle("ytc-audio-only", isAudioOnly);
    if (body) body.classList.toggle("ytc-audio-only", isAudioOnly);
    const player = getPlayer2();
    if (isAudioOnly) {
      if (player) {
        ensureAudioBadge(player);
        try {
          if (typeof player.setPlaybackQualityRange === "function") {
            player.setPlaybackQualityRange("tiny", "tiny");
          }
          if (typeof player.setPlaybackQuality === "function") {
            player.setPlaybackQuality("tiny");
          }
        } catch (e) {
        }
      }
    } else {
      const badge = document.getElementById("ytc-audio-only-badge");
      if (badge) badge.remove();
      audioBadgeElement = null;
      if (player) {
        try {
          if (typeof player.setPlaybackQualityRange === "function") {
            player.setPlaybackQualityRange("auto", "default");
          }
          if (typeof player.setPlaybackQuality === "function") {
            player.setPlaybackQuality("auto");
          }
        } catch (e) {
        }
      }
    }
  }
  function initAudioOnly() {
    applyAudioOnlyState();
  }
  var audioBadgeElement;
  var init_audioOnly = __esm({
    "src/optimization/audioOnly.js"() {
      init_config();
      audioBadgeElement = null;
    }
  });

  // src/optimization/chatMemoryGc.js
  var chatMemoryGc_exports = {};
  __export(chatMemoryGc_exports, {
    initChatMemoryGc: () => initChatMemoryGc,
    performChatMemoryGc: () => performChatMemoryGc,
    stopChatMemoryGc: () => stopChatMemoryGc
  });
  function cleanChatContainer(itemsContainer) {
    if (!itemsContainer || !itemsContainer.children) return;
    const count = itemsContainer.children.length;
    if (count <= 120) return;
    const toRemove = count - MAX_CHAT_ITEMS;
    for (let i = 0; i < toRemove; i++) {
      if (itemsContainer.firstElementChild) {
        itemsContainer.firstElementChild.remove();
      }
    }
  }
  function performChatMemoryGc() {
    if (!currentConfig.chatMemoryGc) return;
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
    const topItems = document.querySelectorAll(
      "yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items"
    );
    topItems.forEach(cleanChatContainer);
    const frames = document.querySelectorAll('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"]');
    frames.forEach((frame) => {
      try {
        const doc = frame.contentDocument || frame.contentWindow?.document;
        if (doc) {
          const iframeItems = doc.querySelectorAll(
            "yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items"
          );
          iframeItems.forEach(cleanChatContainer);
        }
      } catch (e) {
      }
    });
  }
  function initChatMemoryGc() {
    if (gcInterval) return;
    gcInterval = setInterval(() => {
      if (currentConfig.chatMemoryGc) {
        performChatMemoryGc();
      }
    }, 1e4);
  }
  function stopChatMemoryGc() {
    if (gcInterval) {
      clearInterval(gcInterval);
      gcInterval = null;
    }
  }
  var gcInterval, MAX_CHAT_ITEMS;
  var init_chatMemoryGc = __esm({
    "src/optimization/chatMemoryGc.js"() {
      init_config();
      gcInterval = null;
      MAX_CHAT_ITEMS = 100;
    }
  });

  // src/styles.css
  var styles_default = '/* ==========================================================================\r\n   YOUTUBE CUSTOMIZER - TẬP HỢP TOÀN BỘ ĐỊNH KIỂU CSS\r\n   ========================================================================== */\r\n\r\n/* --------------------------------------------------------------------------\r\n   1. LƯỚI VIDEO TRANG CHỦ & FEED: ÉP 3/4/5 CỘT CHUẨN XÁC\r\n   (Độ ưu tiên cao nhất, cố định vĩnh viễn khi F5 tải lại trang)\r\n   -------------------------------------------------------------------------- */\r\n@media (min-width: 900px) {\r\n    ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,\r\n    ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer,\r\n    ytd-browse[page-subtype="channels"] ytd-rich-grid-renderer,\r\n    #page-manager ytd-browse ytd-rich-grid-renderer,\r\n    ytd-rich-grid-renderer.ytc-grid,\r\n    ytd-rich-grid-renderer {\r\n        --ytd-rich-grid-items-per-row: 3 !important;\r\n        --ytd-rich-grid-posts-per-row: 3 !important;\r\n        --ytd-rich-grid-item-max-width: none !important;\r\n    }\r\n\r\n    html[data-ytc-cols="3"] #page-manager ytd-rich-grid-renderer,\r\n    html[data-ytc-cols="3"] ytd-rich-grid-renderer,\r\n    body[data-ytc-cols="3"] #page-manager ytd-rich-grid-renderer,\r\n    body[data-ytc-cols="3"] ytd-rich-grid-renderer,\r\n    [data-ytc-cols="3"] #page-manager ytd-browse ytd-rich-grid-renderer,\r\n    [data-ytc-cols="3"] #page-manager ytd-rich-grid-renderer,\r\n    [data-ytc-cols="3"] ytd-browse ytd-rich-grid-renderer,\r\n    [data-ytc-cols="3"] ytd-rich-grid-renderer {\r\n        --ytd-rich-grid-items-per-row: 3 !important;\r\n        --ytd-rich-grid-posts-per-row: 3 !important;\r\n        --ytd-rich-grid-item-max-width: none !important;\r\n    }\r\n\r\n    html[data-ytc-cols="4"] #page-manager ytd-rich-grid-renderer,\r\n    html[data-ytc-cols="4"] ytd-rich-grid-renderer,\r\n    body[data-ytc-cols="4"] #page-manager ytd-rich-grid-renderer,\r\n    body[data-ytc-cols="4"] ytd-rich-grid-renderer,\r\n    [data-ytc-cols="4"] #page-manager ytd-browse ytd-rich-grid-renderer,\r\n    [data-ytc-cols="4"] #page-manager ytd-rich-grid-renderer,\r\n    [data-ytc-cols="4"] ytd-browse ytd-rich-grid-renderer,\r\n    [data-ytc-cols="4"] ytd-rich-grid-renderer {\r\n        --ytd-rich-grid-items-per-row: 4 !important;\r\n        --ytd-rich-grid-posts-per-row: 4 !important;\r\n        --ytd-rich-grid-item-max-width: none !important;\r\n    }\r\n\r\n    html[data-ytc-cols="5"] #page-manager ytd-rich-grid-renderer,\r\n    html[data-ytc-cols="5"] ytd-rich-grid-renderer,\r\n    body[data-ytc-cols="5"] #page-manager ytd-rich-grid-renderer,\r\n    body[data-ytc-cols="5"] ytd-rich-grid-renderer,\r\n    [data-ytc-cols="5"] #page-manager ytd-browse ytd-rich-grid-renderer,\r\n    [data-ytc-cols="5"] #page-manager ytd-rich-grid-renderer,\r\n    [data-ytc-cols="5"] ytd-browse ytd-rich-grid-renderer,\r\n    [data-ytc-cols="5"] ytd-rich-grid-renderer {\r\n        --ytd-rich-grid-items-per-row: 5 !important;\r\n        --ytd-rich-grid-posts-per-row: 5 !important;\r\n        --ytd-rich-grid-item-max-width: none !important;\r\n    }\r\n\r\n    /* Làm phẳng cấu trúc dòng ytd-rich-grid-row — dùng flex-wrap thay display:contents để GIỮ NGUYÊN hitbox hover */\r\n    #contents > ytd-rich-grid-row {\r\n        display: flex !important;\r\n        flex-wrap: wrap !important;\r\n        width: 100% !important;\r\n    }\r\n    #contents > ytd-rich-grid-row > #contents {\r\n        display: flex !important;\r\n        flex-wrap: wrap !important;\r\n        width: 100% !important;\r\n    }\r\n\r\n    #contents.ytd-rich-grid-row ytd-rich-item-renderer,\r\n    ytd-rich-grid-renderer ytd-rich-item-renderer {\r\n        width: calc(100% / var(--ytd-rich-grid-items-per-row, 3) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\r\n        max-width: calc(100% / var(--ytd-rich-grid-items-per-row, 3) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\r\n    }\r\n\r\n    [data-ytc-cols="3"] #contents.ytd-rich-grid-row ytd-rich-item-renderer,\r\n    [data-ytc-cols="3"] ytd-rich-grid-renderer ytd-rich-item-renderer {\r\n        width: calc(100% / 3 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\r\n        max-width: calc(100% / 3 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\r\n    }\r\n\r\n    [data-ytc-cols="4"] #contents.ytd-rich-grid-row ytd-rich-item-renderer,\r\n    [data-ytc-cols="4"] ytd-rich-grid-renderer ytd-rich-item-renderer {\r\n        width: calc(100% / 4 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\r\n        max-width: calc(100% / 4 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\r\n    }\r\n\r\n    [data-ytc-cols="5"] #contents.ytd-rich-grid-row ytd-rich-item-renderer,\r\n    [data-ytc-cols="5"] ytd-rich-grid-renderer ytd-rich-item-renderer {\r\n        width: calc(100% / 5 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\r\n        max-width: calc(100% / 5 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\r\n    }\r\n}\r\n\r\n/* --------------------------------------------------------------------------\r\n   2. TỐI ƯU HIỆU NĂNG, KHUNG HÌNH & LIVE CHAT (ZERO-LAG)\r\n   -------------------------------------------------------------------------- */\r\n/* Đảm bảo khung xem trước video inline khi hover không bao giờ bị cắt xén hay che khuất */\r\n#page-manager ytd-rich-grid-row {\r\n    overflow: visible !important;\r\n}\r\n\r\n/* Dùng :hover đơn giản, KHÔNG dùng :has() để tránh style recalc storm mỗi khi di chuột */\r\n#page-manager ytd-rich-grid-row:hover {\r\n    z-index: 10 !important;\r\n    position: relative !important;\r\n    overflow: visible !important;\r\n}\r\n\r\n#page-manager ytd-rich-item-renderer {\r\n    overflow: visible !important;\r\n}\r\n\r\n#page-manager ytd-rich-item-renderer:hover,\r\n#page-manager ytd-rich-item-renderer[is-hovered],\r\n#page-manager ytd-rich-item-renderer[has-preview] {\r\n    z-index: 20 !important;\r\n    position: relative !important;\r\n    overflow: visible !important;\r\n}\r\n\r\n/* z-index vừa đủ để preview nổi lên trên thẻ video khi hover, KHÔNG dùng pointer-events: auto toàn cục */\r\n#preview,\r\n#preview.ytd-rich-grid-renderer,\r\nytd-rich-grid-renderer #preview,\r\n#page-manager #preview,\r\nytd-video-preview,\r\n#video-preview {\r\n    z-index: 60 !important;\r\n    overflow: visible !important;\r\n}\r\nytd-video-preview #media-container,\r\nytd-video-preview #player-container,\r\nytd-moving-thumbnail-renderer,\r\n#inline-preview-player {\r\n    z-index: 60 !important;\r\n}\r\n\r\nytd-comment-thread-renderer {\r\n    content-visibility: auto;\r\n    contain-intrinsic-size: auto 200px;\r\n}\r\n\r\n/* Giữ thanh điều khiển và chat hiển thị mượt mà không can thiệp layout */\r\niframe#chatframe {\r\n    contain: paint !important;\r\n}\r\n\r\nyt-live-chat-text-message-renderer,\r\nyt-live-chat-paid-message-renderer,\r\nyt-live-chat-membership-item-renderer {\r\n    content-visibility: auto !important;\r\n    contain-intrinsic-size: auto 32px !important;\r\n}\r\n\r\n/* --------------------------------------------------------------------------\r\n   3. BỘ LỌC NỘI DUNG: SHORTS, CHƠI GAME, HỘI VIÊN, KHÁM PHÁ, CỘNG ĐỒNG, CLEAN SEARCH\r\n   -------------------------------------------------------------------------- */\r\n.ytc-hide-shorts ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),\r\n.ytc-hide-shorts ytd-rich-section-renderer:has(ytd-reel-shelf-renderer),\r\n.ytc-hide-shorts ytd-rich-shelf-renderer[is-shorts],\r\n.ytc-hide-shorts ytd-reel-shelf-renderer,\r\n.ytc-hide-shorts ytd-guide-entry-renderer:has(a[href^="/shorts"]),\r\n.ytc-hide-shorts ytd-mini-guide-entry-renderer:has(a[href^="/shorts"]),\r\n.ytc-hide-shorts ytd-guide-entry-renderer a[title="Shorts"],\r\n.ytc-hide-shorts ytd-mini-guide-entry-renderer[aria-label="Shorts"],\r\n.ytc-hide-shorts #endpoint[title="Shorts"],\r\n.ytc-hide-shorts ytd-mealbar-promo-renderer,\r\n.ytc-hide-shorts ytd-upsell-dialog-renderer {\r\n    display: none !important;\r\n}\r\n\r\n.ytc-hide-playables ytd-rich-section-renderer:has([is-mini-game-card-shelf]),\r\n.ytc-hide-playables ytd-rich-shelf-renderer[is-mini-game-card-shelf],\r\n.ytc-hide-playables ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-mini-game-card-shelf]),\r\n.ytc-hide-playables ytd-rich-section-renderer:has(a[href*="/playables"]),\r\n.ytc-hide-playables ytd-rich-section-renderer:has(a[href*="playables"]),\r\n.ytc-hide-playables ytd-guide-entry-renderer:has(a[href*="/playables"]),\r\n.ytc-hide-playables ytd-mini-guide-entry-renderer:has(a[href*="/playables"]),\r\n.ytc-hide-playables ytd-guide-entry-renderer a[title*="Chơi game"],\r\n.ytc-hide-playables ytd-guide-entry-renderer a[title*="Playables"],\r\n.ytc-hide-playables ytd-mini-guide-entry-renderer[aria-label*="Chơi game"],\r\n.ytc-hide-playables ytd-mini-guide-entry-renderer[aria-label*="Playables"],\r\n.ytc-hide-playables #endpoint[title*="Chơi game"],\r\n.ytc-hide-playables #endpoint[title*="Playables"] {\r\n    display: none !important;\r\n}\r\n\r\n.ytc-hide-members ytd-rich-section-renderer:has(.badge-style-type-members-only),\r\n.ytc-hide-members ytd-rich-section-renderer:has(.badge-style-type-members-first),\r\n.ytc-hide-members ytd-rich-section-renderer:has([badge-style="MEMBERS_FIRST"]),\r\n.ytc-hide-members ytd-rich-section-renderer:has([badge-style="MEMBERS_ONLY"]),\r\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="hội viên"]),\r\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Hội viên"]),\r\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Members only"]),\r\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="members only"]),\r\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Members first"]),\r\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="members first"]),\r\n.ytc-hide-members ytd-rich-section-renderer:has(a[href*="/membership"]),\r\n.ytc-hide-members ytd-rich-section-renderer:has(a[href*="/memberships"]),\r\n.ytc-hide-members ytd-rich-section-renderer.ytc-shelf-members,\r\n.ytc-hide-members ytd-rich-item-renderer:has(.badge-style-type-members-only),\r\n.ytc-hide-members ytd-rich-item-renderer:has(.badge-style-type-members-first),\r\n.ytc-hide-members ytd-rich-item-renderer:has([badge-style="MEMBERS_FIRST"]),\r\n.ytc-hide-members ytd-rich-item-renderer:has([badge-style="MEMBERS_ONLY"]),\r\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="hội viên"]),\r\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Hội viên"]),\r\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Members only"]),\r\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Members first"]),\r\n.ytc-hide-members ytd-rich-item-renderer.ytc-item-members,\r\n.ytc-hide-members ytd-video-renderer:has(.badge-style-type-members-only),\r\n.ytc-hide-members ytd-video-renderer:has(.badge-style-type-members-first),\r\n.ytc-hide-members ytd-video-renderer:has([badge-style="MEMBERS_FIRST"]),\r\n.ytc-hide-members ytd-video-renderer:has([badge-style="MEMBERS_ONLY"]),\r\n.ytc-hide-members ytd-video-renderer:has([aria-label*="hội viên"]),\r\n.ytc-hide-members ytd-video-renderer:has([aria-label*="Hội viên"]),\r\n.ytc-hide-members ytd-video-renderer.ytc-item-members,\r\n.ytc-hide-members ytd-compact-video-renderer:has(.badge-style-type-members-only),\r\n.ytc-hide-members ytd-compact-video-renderer:has(.badge-style-type-members-first),\r\n.ytc-hide-members ytd-compact-video-renderer:has([badge-style="MEMBERS_FIRST"]),\r\n.ytc-hide-members ytd-compact-video-renderer:has([badge-style="MEMBERS_ONLY"]),\r\n.ytc-hide-members ytd-compact-video-renderer.ytc-item-members {\r\n    display: none !important;\r\n}\r\n\r\n/* Ẩn Danh sách kết hợp (Mixes / Radio) và Danh sách phát (Playlists) trên Feed, Tìm kiếm, Gợi ý và Watch page */\r\n.ytc-hide-mixes ytd-playlist-renderer,\r\n.ytc-hide-mixes ytd-compact-playlist-renderer,\r\n.ytc-hide-mixes ytd-radio-renderer,\r\n.ytc-hide-mixes ytd-compact-radio-renderer,\r\n.ytc-hide-mixes ytd-grid-radio-renderer,\r\n.ytc-hide-mixes ytd-rich-item-renderer:has(ytd-playlist-renderer),\r\n.ytc-hide-mixes ytd-rich-item-renderer:has(ytd-radio-renderer),\r\n.ytc-hide-mixes ytd-rich-item-renderer:has(ytd-playlist-thumbnail),\r\n.ytc-hide-mixes ytd-rich-item-renderer:has(ytd-playlist-custom-thumbnail-renderer),\r\n.ytc-hide-mixes ytd-rich-item-renderer:has(a[href*="/playlist?list="]),\r\n.ytc-hide-mixes ytd-rich-item-renderer:has(a[href*="list=PL"]),\r\n.ytc-hide-mixes ytd-rich-item-renderer:has(a[href*="list=OLAK5uy_"]),\r\n.ytc-hide-mixes ytd-rich-item-renderer:has(a[href*="list=CL"]),\r\n.ytc-hide-mixes ytd-video-renderer:has(ytd-playlist-thumbnail),\r\n.ytc-hide-mixes ytd-video-renderer:has(a[href*="/playlist?list="]),\r\n.ytc-hide-mixes ytd-video-renderer:has(a[href*="list=PL"]),\r\n.ytc-hide-mixes ytd-video-renderer:has(a[href*="list=OLAK5uy_"]),\r\n.ytc-hide-mixes ytd-video-renderer:has(a[href*="list=CL"]),\r\n.ytc-hide-mixes ytd-rich-item-renderer.ytc-item-mix,\r\n.ytc-hide-mixes ytd-video-renderer.ytc-item-mix,\r\n.ytc-hide-mixes ytd-compact-video-renderer.ytc-item-mix,\r\n.ytc-hide-mixes #related ytd-compact-radio-renderer,\r\n.ytc-hide-mixes #related ytd-compact-playlist-renderer,\r\n.ytc-hide-mixes #playlist:has(a[href*="list=RD"]),\r\n.ytc-hide-mixes #playlist:has([title*="Danh sách kết hợp"]),\r\n.ytc-hide-mixes #playlist:has([title*="Mixes"]),\r\n.ytc-hide-mixes #playlist:has([title*="Mix -"]),\r\n.ytc-hide-mixes ytd-playlist-panel-renderer:has(a[href*="list=RD"]),\r\n.ytc-hide-mixes ytd-playlist-panel-renderer:has([title*="Danh sách kết hợp"]),\r\n.ytc-hide-mixes ytd-playlist-panel-renderer:has([title*="Mixes"]),\r\n.ytc-hide-mixes ytd-playlist-panel-renderer:has([title*="Mix -"]),\r\n/* Kệ Mix chuyên biệt (dựa theo tiêu đề rõ ràng, không ẩn oan toàn bộ kệ nhạc) */\r\n.ytc-hide-mixes ytd-rich-section-renderer:has(#title-container [title*="Danh sách kết hợp"]),\r\n.ytc-hide-mixes ytd-rich-section-renderer:has(#title-container [title*="Mixes"]),\r\n.ytc-hide-mixes ytd-rich-section-renderer:has(#title[title*="Danh sách kết hợp"]),\r\n.ytc-hide-mixes ytd-rich-section-renderer:has(#title[title*="Mixes"]),\r\n.ytc-hide-mixes ytd-shelf-renderer:has(#title-container [title*="Danh sách kết hợp"]),\r\n.ytc-hide-mixes ytd-shelf-renderer:has(#title-container [title*="Mixes"]),\r\n.ytc-hide-mixes ytd-shelf-renderer:has(#title[title*="Danh sách kết hợp"]),\r\n.ytc-hide-mixes ytd-shelf-renderer:has(#title[title*="Mixes"]),\r\n.ytc-hide-mixes ytd-rich-section-renderer.ytc-shelf-mix,\r\n.ytc-hide-mixes ytd-shelf-renderer.ytc-shelf-mix,\r\n/* Chip "Danh sách kết hợp" trên thanh chủ đề */\r\n.ytc-hide-mixes yt-chip-cloud-chip-renderer:has([title*="Danh sách kết hợp"]),\r\n.ytc-hide-mixes yt-chip-cloud-chip-renderer:has([title*="Mixes"]),\r\n.ytc-hide-mixes .ytc-item-mix {\r\n    display: none !important;\r\n}\r\n\r\n.ytc-hide-explore ytd-rich-section-renderer:has(yt-chip-cloud-chip-renderer),\r\n.ytc-hide-explore ytd-rich-section-renderer:has(yt-chip-cloud-renderer),\r\n.ytc-hide-explore ytd-rich-section-renderer:has(ytd-feed-filter-chip-bar-renderer),\r\n.ytc-hide-explore ytd-rich-section-renderer:has(#chips),\r\n.ytc-hide-explore ytd-rich-section-renderer.ytc-shelf-explore,\r\n.ytc-hide-explore ytd-rich-section-renderer:has([title*="Khám phá các chủ đề"]),\r\n.ytc-hide-explore ytd-rich-section-renderer:has([title*="Explore other topics"]),\r\n.ytc-hide-explore ytd-rich-section-renderer:has([title*="Explore topics"]) {\r\n    display: none !important;\r\n}\r\n\r\n.ytc-clean-search ytd-ad-slot-renderer,\r\n.ytc-clean-search ytd-rich-item-renderer:has(ytd-ad-slot-renderer),\r\n.ytc-clean-search ytd-rich-section-renderer:has(ytd-ad-slot-renderer),\r\n.ytc-clean-search ytd-video-renderer:has(.badge-style-type-ad) {\r\n    display: none !important;\r\n}\r\n\r\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-post-renderer),\r\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-backstage-post-renderer),\r\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-backstage-post-thread-renderer),\r\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-post-multi-image-renderer),\r\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-poll-renderer),\r\n.ytc-hide-community ytd-rich-section-renderer.ytc-shelf-community,\r\n.ytc-hide-community ytd-rich-item-renderer:has(ytd-post-renderer),\r\n.ytc-hide-community ytd-rich-item-renderer:has(ytd-backstage-post-renderer),\r\n.ytc-hide-community ytd-rich-item-renderer.ytc-item-community,\r\n.ytc-hide-community ytd-post-renderer,\r\n.ytc-hide-community ytd-backstage-post-renderer,\r\n.ytc-hide-community ytd-backstage-post-thread-renderer {\r\n    display: none !important;\r\n}\r\n\r\n/* --------------------------------------------------------------------------\r\n   4. TRÌNH PHÁT VIDEO: THẺ KẾT THÚC, BANNER & LOGO PREMIUM\r\n   -------------------------------------------------------------------------- */\r\n/* Tự động tắt ánh sáng gốc của YouTube khi BẬT Ánh sáng phòng (Ambilight) để chống trùng lặp */\r\nhtml.ytc-ambient-lighting #cinematics,\r\nhtml.ytc-ambient-lighting ytd-cinematics-renderer,\r\nhtml.ytc-ambient-lighting .ytp-ambient-mode-rendering-container {\r\n    display: none !important;\r\n    opacity: 0 !important;\r\n    pointer-events: none !important;\r\n}\r\n\r\n.ytc-hide-endscreen .ytp-ce-element,\r\n.ytc-hide-endscreen .ytp-ce-covering-overlay,\r\n.ytc-hide-endscreen .ytp-ce-element-show,\r\n.ytc-hide-endscreen .ytp-ce-video,\r\n.ytc-hide-endscreen .ytp-ce-playlist,\r\n.ytc-hide-endscreen .ytp-ce-channel,\r\n.ytc-hide-endscreen .ytp-ce-subscribe,\r\n.ytc-hide-endscreen .ytp-cards-button,\r\n.ytc-hide-endscreen .ytp-cards-teaser,\r\n.ytc-hide-endscreen .ytp-cards-teaser-box,\r\n.ytc-hide-endscreen .ytp-card {\r\n    display: none !important;\r\n    opacity: 0 !important;\r\n    pointer-events: none !important;\r\n}\r\n\r\n/* Ẩn logo hình mờ kênh ở góc dưới bên phải video */\r\n.ytc-hide-watermark .annotation-type-custom.iv-branding,\r\n.ytc-hide-watermark .iv-branding,\r\n.ytc-hide-watermark .ytp-iv-video-content .iv-branding,\r\n.ytc-hide-watermark .ytp-branding-logo,\r\n.ytc-hide-watermark .ytp-featured-channel,\r\n.ytc-hide-watermark .ytp-branding-element {\r\n    display: none !important;\r\n    opacity: 0 !important;\r\n    pointer-events: none !important;\r\n    visibility: hidden !important;\r\n}\r\n\r\n/* Ẩn sản phẩm gắn thẻ (YouTube Shopping / Shopee affiliate / Merch shelf) */\r\n.ytc-hide-shopping ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-shopping-panel"],\r\n.ytc-hide-shopping ytd-engagement-panel-section-list-renderer[target-id*="shopping"],\r\n.ytc-hide-shopping ytd-engagement-panel-section-list-renderer[target-id*="product"],\r\n.ytc-hide-shopping ytd-merch-shelf-renderer,\r\n.ytc-hide-shopping ytd-products-shelf-renderer,\r\n.ytc-hide-shopping ytd-product-shelf-renderer,\r\n.ytc-hide-shopping .ytp-shopping-button,\r\n.ytc-hide-shopping .ytp-featured-product-banner,\r\n.ytc-hide-shopping .ytp-suggested-action-badge[aria-label*="sản phẩm" i],\r\n.ytc-hide-shopping .ytp-suggested-action-badge[aria-label*="product" i],\r\n.ytc-hide-shopping .ytp-suggested-action-badge[aria-label*="shopping" i],\r\n.ytc-hide-shopping .ytp-suggested-action-badge:has(svg path[d*="M19 6"]) {\r\n    display: none !important;\r\n    opacity: 0 !important;\r\n    pointer-events: none !important;\r\n}\r\n\r\n.ytc-auto-dismiss ytd-mealbar-promo-renderer,\r\n.ytc-auto-dismiss yt-mealbar-promo-renderer,\r\n.ytc-auto-dismiss ytd-upsell-dialog-renderer,\r\n.ytc-auto-dismiss ytd-single-option-survey-renderer,\r\n.ytc-auto-dismiss ytd-in-feed-survey-renderer,\r\n.ytc-auto-dismiss yt-bubble-hint-renderer,\r\n.ytc-auto-dismiss .ytc-dismissed-toast {\r\n    display: none !important;\r\n    opacity: 0 !important;\r\n    pointer-events: none !important;\r\n}\r\n\r\n:root.ytc-premium-logo #start.ytd-masthead ytd-topbar-logo-renderer,\r\n:root.ytc-premium-logo ytd-topbar-logo-renderer#logo {\r\n    margin-left: 0 !important;\r\n    display: flex !important;\r\n    align-items: center !important;\r\n}\r\n:root.ytc-premium-logo ytd-topbar-logo-renderer #logo {\r\n    padding: 18px 4px 18px 16px !important;\r\n    display: inline-flex !important;\r\n    align-items: center !important;\r\n    box-sizing: content-box !important;\r\n}\r\nytd-topbar-logo-renderer ytd-yoodle-renderer,\r\nytd-yoodle-renderer ytd-logo,\r\nytd-topbar-logo-renderer ytd-yoodle-renderer * {\r\n    display: none !important;\r\n}\r\n:root.ytc-premium-logo ytd-topbar-logo-renderer #logo ytd-logo:not(.ytd-yoodle-renderer),\r\n:root.ytc-premium-logo ytd-topbar-logo-renderer #logo ytd-logo[hidden]:not(.ytd-yoodle-renderer),\r\n:root.ytc-premium-logo ytd-topbar-logo-renderer > #logo > div > ytd-logo {\r\n    width: 101px !important;\r\n    min-width: 101px !important;\r\n    max-width: 101px !important;\r\n    height: 20px !important;\r\n    display: flex !important;\r\n    align-items: center !important;\r\n    overflow: visible !important;\r\n    visibility: visible !important;\r\n    opacity: 1 !important;\r\n}\r\n:root.ytc-premium-logo ytd-logo:not(.ytd-yoodle-renderer) > *:not(.custom-premium-logo) {\r\n    display: none !important;\r\n}\r\nytd-logo, ytd-topbar-logo-renderer {\r\n    overflow: visible !important;\r\n}\r\n:root:not(.ytc-premium-logo) .custom-premium-logo {\r\n    display: none !important;\r\n}\r\n:root.ytc-premium-logo .custom-premium-logo {\r\n    display: flex !important;\r\n    align-items: center !important;\r\n    width: 101px !important;\r\n    height: 20px !important;\r\n    color: var(--yt-spec-wordmark-text, var(--yt-spec-text-primary, #0f0f0f)) !important;\r\n    pointer-events: none;\r\n    visibility: visible !important;\r\n    opacity: 1 !important;\r\n}\r\nhtml:not([dark]).ytc-premium-logo .custom-premium-logo,\r\nhtml:not([dark]) .custom-premium-logo,\r\n:root:not([dark]).ytc-premium-logo .custom-premium-logo {\r\n    color: var(--yt-spec-wordmark-text, #0f0f0f) !important;\r\n}\r\nhtml[dark].ytc-premium-logo .custom-premium-logo,\r\nhtml[dark] .custom-premium-logo,\r\n:root[dark].ytc-premium-logo .custom-premium-logo {\r\n    color: var(--yt-spec-wordmark-text, #f1f1f1) !important;\r\n}\r\n.custom-premium-logo svg {\r\n    width: 101px !important;\r\n    height: 20px !important;\r\n    fill: currentColor !important;\r\n}\r\n.custom-premium-logo svg #youtube-paths_yt19,\r\n.custom-premium-logo svg #youtube-paths_yt19 path {\r\n    fill: currentColor !important;\r\n}\r\n\r\n:root.ytc-premium-logo ytd-topbar-logo-renderer #country-code {\r\n    display: inline-block !important;\r\n    font-size: 10px !important;\r\n    font-weight: 400 !important;\r\n    font-family: "Roboto", "Arial", sans-serif !important;\r\n    line-height: 10px !important;\r\n    color: var(--yt-spec-text-secondary, #909090) !important;\r\n    margin-top: 14px !important;\r\n    margin-left: 4px !important;\r\n    margin-right: 0 !important;\r\n    margin-bottom: 0 !important;\r\n    align-self: flex-start !important;\r\n    vertical-align: top !important;\r\n    position: relative !important;\r\n    top: 0 !important;\r\n    left: 0 !important;\r\n}\r\nhtml:not([dark]).ytc-premium-logo ytd-topbar-logo-renderer #country-code,\r\nhtml:not([dark]) ytd-topbar-logo-renderer #country-code {\r\n    color: var(--yt-spec-text-secondary, #606060) !important;\r\n}\r\nhtml[dark].ytc-premium-logo ytd-topbar-logo-renderer #country-code,\r\nhtml[dark] ytd-topbar-logo-renderer #country-code {\r\n    color: var(--yt-spec-text-secondary, #909090) !important;\r\n}\r\n:root.ytc-premium-logo ytd-topbar-logo-renderer #country-code:empty {\r\n    display: none !important;\r\n}\r\n\r\n/* --------------------------------------------------------------------------\r\n   5. GIAO DIỆN CÀI ĐẶT: NÚT BÁNH RĂNG & MENU 4 TAB\r\n   -------------------------------------------------------------------------- */\r\n#ytc-settings-btn {\r\n    order: -1 !important;\r\n    display: inline-flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    width: 40px;\r\n    height: 40px;\r\n    border-radius: 50%;\r\n    border: none;\r\n    background: transparent;\r\n    color: var(--yt-spec-text-primary, #f1f1f1);\r\n    cursor: pointer;\r\n    margin-right: 8px;\r\n    flex-shrink: 0;\r\n    transition: background-color 0.15s, color 0.15s;\r\n    position: relative;\r\n}\r\n#ytc-settings-btn:hover {\r\n    background-color: rgba(255, 255, 255, 0.1);\r\n}\r\n#ytc-settings-btn svg {\r\n    width: 24px;\r\n    height: 24px;\r\n    stroke: currentColor;\r\n    display: block;\r\n}\r\nhtml:not([dark]) #ytc-settings-btn {\r\n    color: #0f0f0f !important;\r\n}\r\nhtml:not([dark]) #ytc-settings-btn svg {\r\n    stroke: #0f0f0f !important;\r\n    color: #0f0f0f !important;\r\n}\r\nhtml:not([dark]) #ytc-settings-btn:hover {\r\n    background-color: rgba(0, 0, 0, 0.08);\r\n}\r\nhtml[dark] #ytc-settings-btn {\r\n    color: #f1f1f1 !important;\r\n}\r\nhtml[dark] #ytc-settings-btn svg {\r\n    stroke: #f1f1f1 !important;\r\n    color: #f1f1f1 !important;\r\n}\r\n\r\n#ytc-settings-panel {\r\n    position: fixed;\r\n    width: 380px;\r\n    max-height: calc(100vh - 80px);\r\n    overflow-y: auto;\r\n    background: var(--yt-spec-brand-background-primary, #282828);\r\n    color: var(--yt-spec-text-primary, #f1f1f1);\r\n    border-radius: 12px;\r\n    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);\r\n    padding: 12px;\r\n    z-index: 9999;\r\n    font-family: "Roboto", "Arial", sans-serif;\r\n    font-size: 14px;\r\n    display: none;\r\n    flex-direction: column;\r\n    gap: 6px;\r\n    user-select: none;\r\n    border: 1px solid rgba(255, 255, 255, 0.1);\r\n}\r\n#ytc-settings-panel::-webkit-scrollbar {\r\n    width: 4px;\r\n}\r\n#ytc-settings-panel::-webkit-scrollbar-thumb {\r\n    background: rgba(255, 255, 255, 0.2);\r\n    border-radius: 2px;\r\n}\r\n#ytc-settings-panel.open {\r\n    display: flex;\r\n}\r\n\r\n.ytc-header {\r\n    font-weight: 600;\r\n    font-size: 15px;\r\n    padding: 4px 6px 8px 6px;\r\n    border-bottom: 1px solid rgba(255, 255, 255, 0.1);\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n}\r\n.ytc-header-badge {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    color: #ff4e45;\r\n    background: rgba(255, 78, 69, 0.12);\r\n    border: 1px solid rgba(255, 78, 69, 0.25);\r\n    padding: 2px 8px;\r\n    border-radius: 6px;\r\n    letter-spacing: 0.5px;\r\n    user-select: none;\r\n    flex-shrink: 0;\r\n}\r\nhtml:not([dark]) .ytc-header-badge {\r\n    color: #cc0000;\r\n    background: rgba(204, 0, 0, 0.08);\r\n    border-color: rgba(204, 0, 0, 0.25);\r\n}\r\n\r\n.ytc-star-badge {\r\n    display: inline-block;\r\n    font-size: 13px;\r\n    margin-left: 5px;\r\n    line-height: 1;\r\n    vertical-align: middle;\r\n    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.6));\r\n    animation: ytc-star-pulse 2.2s infinite ease-in-out;\r\n    cursor: default;\r\n    user-select: none;\r\n}\r\n@keyframes ytc-star-pulse {\r\n    0%, 100% {\r\n        transform: scale(1);\r\n        filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.4));\r\n    }\r\n    50% {\r\n        transform: scale(1.18);\r\n        filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.85));\r\n    }\r\n}\r\n\r\n.ytc-tabs {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 3px;\r\n    background: rgba(255, 255, 255, 0.06);\r\n    border-radius: 8px;\r\n    padding: 3px;\r\n    margin: 4px 0 6px 0;\r\n    border: 1px solid rgba(255, 255, 255, 0.08);\r\n}\r\n.ytc-tab-btn {\r\n    flex: 1 1 0px;\r\n    width: 0;\r\n    display: inline-flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 3px;\r\n    padding: 6px 1px;\r\n    border: none;\r\n    background: transparent;\r\n    color: #aaa;\r\n    font-size: 11.5px;\r\n    font-weight: 500;\r\n    border-radius: 6px;\r\n    cursor: pointer;\r\n    transition: background 0.15s ease, color 0.15s ease;\r\n    white-space: nowrap;\r\n    text-align: center;\r\n    box-sizing: border-box;\r\n}\r\n.ytc-tab-btn:hover {\r\n    background: rgba(255, 255, 255, 0.08);\r\n    color: #fff;\r\n}\r\n.ytc-tab-btn.active {\r\n    background: #f1f1f1;\r\n    color: #0f0f0f;\r\n    font-weight: 500;\r\n}\r\n.ytc-tab-btn svg {\r\n    width: 13px;\r\n    height: 13px;\r\n    fill: currentColor;\r\n    flex-shrink: 0;\r\n}\r\n.ytc-tab-pane {\r\n    display: none;\r\n    flex-direction: column;\r\n    gap: 4px;\r\n}\r\n.ytc-tab-pane.active {\r\n    display: flex;\r\n}\r\n\r\n.ytc-item {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    padding: 8px 8px;\r\n    border-radius: 8px;\r\n    cursor: pointer;\r\n    transition: background 0.15s;\r\n}\r\n.ytc-item:hover {\r\n    background: rgba(255, 255, 255, 0.08);\r\n}\r\n\r\n.ytc-item-left {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 12px;\r\n}\r\n.ytc-item-left svg {\r\n    width: 20px;\r\n    height: 20px;\r\n    fill: currentColor;\r\n    opacity: 0.9;\r\n    flex-shrink: 0;\r\n}\r\n.ytc-item-left svg[fill="none"] {\r\n    fill: none;\r\n}\r\n\r\n.ytc-switch {\r\n    position: relative;\r\n    display: inline-block;\r\n    width: 36px;\r\n    height: 20px;\r\n}\r\n.ytc-switch input {\r\n    opacity: 0;\r\n    width: 0;\r\n    height: 0;\r\n}\r\n.ytc-slider {\r\n    position: absolute;\r\n    cursor: pointer;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    background-color: #606060;\r\n    border-radius: 20px;\r\n    transition: background-color 0.2s;\r\n}\r\n.ytc-slider:before {\r\n    position: absolute;\r\n    content: "";\r\n    height: 14px;\r\n    width: 14px;\r\n    left: 3px;\r\n    bottom: 3px;\r\n    background-color: white;\r\n    border-radius: 50%;\r\n    transition: transform 0.2s;\r\n}\r\n.ytc-switch input:checked + .ytc-slider {\r\n    background-color: #3ea6ff;\r\n}\r\n.ytc-switch input:checked + .ytc-slider:before {\r\n    transform: translateX(16px);\r\n}\r\n\r\n.ytc-link-badge {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: 4px;\r\n    padding: 3px 8px;\r\n    border-radius: 6px;\r\n    background: rgba(62, 166, 255, 0.12);\r\n    color: #3ea6ff;\r\n    font-size: 11.5px;\r\n    font-weight: 500;\r\n    transition: all 0.2s ease;\r\n    border: 1px solid rgba(62, 166, 255, 0.25);\r\n    user-select: none;\r\n    flex-shrink: 0;\r\n}\r\n.ytc-link-badge svg {\r\n    flex-shrink: 0;\r\n}\r\n.ytc-item:hover .ytc-link-badge {\r\n    background: #3ea6ff;\r\n    color: #0f0f0f;\r\n    border-color: #3ea6ff;\r\n}\r\n\r\n.ytc-cols-group {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 4px;\r\n    background: rgba(255, 255, 255, 0.06);\r\n    padding: 3px;\r\n    border-radius: 8px;\r\n    border: 1px solid rgba(255, 255, 255, 0.08);\r\n}\r\n.ytc-col-btn {\r\n    border: none;\r\n    background: transparent;\r\n    color: #aaa;\r\n    font-size: 12px;\r\n    font-weight: 500;\r\n    padding: 5px 10px;\r\n    border-radius: 6px;\r\n    cursor: pointer;\r\n    transition: all 0.15s ease;\r\n    min-width: 28px;\r\n    text-align: center;\r\n    box-sizing: border-box;\r\n}\r\n.ytc-col-btn:hover {\r\n    background: rgba(255, 255, 255, 0.08);\r\n    color: #fff;\r\n}\r\n.ytc-col-btn.active {\r\n    background: #f1f1f1 !important;\r\n    color: #0f0f0f !important;\r\n    font-weight: 600;\r\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.ytc-shortcut-hint {\r\n    font-size: 12px;\r\n    color: var(--yt-spec-text-secondary, #aaa);\r\n    background: rgba(255, 255, 255, 0.04);\r\n    padding: 8px 10px;\r\n    border-radius: 6px;\r\n    line-height: 1.6;\r\n    margin-top: 4px;\r\n    border: 1px solid rgba(255, 255, 255, 0.06);\r\n}\r\n.ytc-shortcut-hint kbd {\r\n    background: rgba(255, 255, 255, 0.15);\r\n    color: var(--yt-spec-text-primary, #fff);\r\n    padding: 2px 5px;\r\n    border-radius: 3px;\r\n    font-family: monospace;\r\n    font-size: 11px;\r\n    font-weight: bold;\r\n}\r\n\r\nhtml:not([dark]) #ytc-settings-panel {\r\n    background: #ffffff;\r\n    color: #0f0f0f;\r\n    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.15);\r\n    border: 1px solid rgba(0, 0, 0, 0.1);\r\n}\r\nhtml:not([dark]) .ytc-header {\r\n    border-bottom: 1px solid rgba(0, 0, 0, 0.08);\r\n}\r\nhtml:not([dark]) .ytc-tabs {\r\n    background: rgba(0, 0, 0, 0.05);\r\n    border: 1px solid rgba(0, 0, 0, 0.08);\r\n}\r\nhtml:not([dark]) .ytc-tab-btn {\r\n    color: #606060;\r\n}\r\nhtml:not([dark]) .ytc-tab-btn:hover {\r\n    background: rgba(0, 0, 0, 0.06);\r\n    color: #0f0f0f;\r\n}\r\nhtml:not([dark]) .ytc-tab-btn.active {\r\n    background: #0f0f0f;\r\n    color: #ffffff;\r\n    font-weight: 500;\r\n}\r\nhtml:not([dark]) .ytc-shortcut-hint {\r\n    background: rgba(0, 0, 0, 0.04);\r\n    color: #606060;\r\n    border-color: rgba(0, 0, 0, 0.08);\r\n}\r\nhtml:not([dark]) .ytc-shortcut-hint kbd {\r\n    background: rgba(0, 0, 0, 0.1);\r\n    color: #0f0f0f;\r\n}\r\n\r\n.ytc-divider {\r\n    height: 1px;\r\n    background: rgba(255, 255, 255, 0.1);\r\n    margin: 4px 0;\r\n}\r\n\r\n.ytc-mode-group {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 4px;\r\n    background: rgba(255, 255, 255, 0.06);\r\n    padding: 3px;\r\n    border-radius: 8px;\r\n    border: 1px solid rgba(255, 255, 255, 0.08);\r\n}\r\n.ytc-mode-btn {\r\n    border: none;\r\n    background: transparent;\r\n    color: #aaa;\r\n    font-size: 12px;\r\n    font-weight: 500;\r\n    padding: 5px 9px;\r\n    border-radius: 6px;\r\n    cursor: pointer;\r\n    transition: all 0.15s ease;\r\n    white-space: nowrap;\r\n    text-align: center;\r\n    box-sizing: border-box;\r\n}\r\n.ytc-mode-btn:hover {\r\n    background: rgba(255, 255, 255, 0.08);\r\n    color: #fff;\r\n}\r\n.ytc-mode-btn.active {\r\n    background: #f1f1f1 !important;\r\n    color: #0f0f0f !important;\r\n    font-weight: 600;\r\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n/* Định kiểu tường minh cho chế độ Tối (Dark mode) */\r\nhtml[dark] .ytc-cols-group,\r\nhtml[dark] .ytc-mode-group {\r\n    background: rgba(255, 255, 255, 0.06);\r\n    border: 1px solid rgba(255, 255, 255, 0.08);\r\n}\r\nhtml[dark] .ytc-col-btn,\r\nhtml[dark] .ytc-mode-btn {\r\n    color: #aaa;\r\n    background: transparent;\r\n}\r\nhtml[dark] .ytc-col-btn:hover,\r\nhtml[dark] .ytc-mode-btn:hover {\r\n    background: rgba(255, 255, 255, 0.08);\r\n    color: #fff;\r\n}\r\nhtml[dark] .ytc-col-btn.active,\r\nhtml[dark] .ytc-mode-btn.active {\r\n    background: #f1f1f1 !important;\r\n    color: #0f0f0f !important;\r\n    font-weight: 600;\r\n}\r\n\r\n/* Định kiểu đồng bộ chuẩn xác cho chế độ Sáng (Light mode) */\r\nhtml:not([dark]) .ytc-cols-group {\r\n    background: rgba(0, 0, 0, 0.05);\r\n    border: 1px solid rgba(0, 0, 0, 0.08);\r\n}\r\nhtml:not([dark]) .ytc-col-btn {\r\n    color: #606060;\r\n    background: transparent;\r\n}\r\nhtml:not([dark]) .ytc-col-btn:hover {\r\n    background: rgba(0, 0, 0, 0.06);\r\n    color: #0f0f0f;\r\n}\r\nhtml:not([dark]) .ytc-col-btn.active {\r\n    background: #0f0f0f !important;\r\n    color: #ffffff !important;\r\n    font-weight: 600;\r\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);\r\n}\r\n\r\nhtml:not([dark]) .ytc-mode-group {\r\n    background: rgba(0, 0, 0, 0.05);\r\n    border: 1px solid rgba(0, 0, 0, 0.08);\r\n}\r\nhtml:not([dark]) .ytc-mode-btn {\r\n    color: #606060;\r\n    background: transparent;\r\n}\r\nhtml:not([dark]) .ytc-mode-btn:hover {\r\n    background: rgba(0, 0, 0, 0.06);\r\n    color: #0f0f0f;\r\n}\r\nhtml:not([dark]) .ytc-mode-btn.active {\r\n    background: #0f0f0f !important;\r\n    color: #ffffff !important;\r\n    font-weight: 600;\r\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);\r\n}\r\n\r\n/* Kiểu dáng mục phân giải video (2 tầng & segmented control) */\r\n.ytc-item-vertical {\r\n    flex-direction: column !important;\r\n    align-items: stretch !important;\r\n    gap: 8px !important;\r\n}\r\n.ytc-item-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    width: 100%;\r\n}\r\n.ytc-quality-badge {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    color: #3ea6ff;\r\n    background: rgba(62, 166, 255, 0.12);\r\n    border: 1px solid rgba(62, 166, 255, 0.25);\r\n    padding: 2px 8px;\r\n    border-radius: 6px;\r\n    letter-spacing: 0.5px;\r\n    user-select: none;\r\n    flex-shrink: 0;\r\n}\r\nhtml:not([dark]) .ytc-quality-badge {\r\n    color: #065fd4;\r\n    background: rgba(6, 95, 212, 0.08);\r\n    border-color: rgba(6, 95, 212, 0.25);\r\n}\r\n.ytc-quality-group {\r\n    display: flex;\r\n    width: 100%;\r\n    gap: 3px;\r\n    box-sizing: border-box;\r\n}\r\n.ytc-quality-btn {\r\n    border: none;\r\n    background: transparent;\r\n    color: #aaa;\r\n    font-size: 11px;\r\n    font-weight: 500;\r\n    padding: 5px 2px;\r\n    border-radius: 6px;\r\n    cursor: pointer;\r\n    transition: all 0.15s ease;\r\n    white-space: nowrap;\r\n    text-align: center;\r\n    box-sizing: border-box;\r\n    flex: 1;\r\n    min-width: 0;\r\n}\r\n.ytc-quality-btn:hover {\r\n    background: rgba(255, 255, 255, 0.08);\r\n    color: #fff;\r\n}\r\n.ytc-quality-btn.active {\r\n    background: #f1f1f1 !important;\r\n    color: #0f0f0f !important;\r\n    font-weight: 600;\r\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\nhtml[dark] .ytc-quality-btn {\r\n    color: #aaa;\r\n    background: transparent;\r\n}\r\nhtml[dark] .ytc-quality-btn:hover {\r\n    background: rgba(255, 255, 255, 0.08);\r\n    color: #fff;\r\n}\r\nhtml[dark] .ytc-quality-btn.active {\r\n    background: #f1f1f1 !important;\r\n    color: #0f0f0f !important;\r\n    font-weight: 600;\r\n}\r\n\r\nhtml:not([dark]) .ytc-quality-btn {\r\n    color: #606060;\r\n    background: transparent;\r\n}\r\nhtml:not([dark]) .ytc-quality-btn:hover {\r\n    background: rgba(0, 0, 0, 0.06);\r\n    color: #0f0f0f;\r\n}\r\nhtml:not([dark]) .ytc-quality-btn.active {\r\n    background: #0f0f0f !important;\r\n    color: #ffffff !important;\r\n    font-weight: 600;\r\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);\r\n}\r\n\r\n/* Trạng thái vô hiệu hóa của Live Chat row khi video không hỗ trợ chat */\r\n#ytc-row-chatoverlay.ytc-disabled {\r\n    opacity: 0.35 !important;\r\n    pointer-events: none !important;\r\n    cursor: not-allowed !important;\r\n}\r\n#ytc-row-chatoverlay.ytc-disabled .ytc-mode-btn {\r\n    pointer-events: none !important;\r\n    cursor: not-allowed !important;\r\n}\r\n\r\n/* Kiểu dáng danh mục phụ & hộp chọn (Sub-item & Select Dropdown) */\r\n.ytc-sub-item {\r\n    margin-top: -2px;\r\n    margin-bottom: 2px;\r\n    padding-left: 20px !important;\r\n    padding-top: 5px !important;\r\n    padding-bottom: 5px !important;\r\n    background: rgba(255, 255, 255, 0.03);\r\n    border-radius: 8px;\r\n    transition: all 0.2s ease;\r\n}\r\n.ytc-sub-bullet {\r\n    color: var(--yt-spec-text-secondary, #888);\r\n    font-size: 13px;\r\n    line-height: 1;\r\n    margin-right: -4px;\r\n    opacity: 0.6;\r\n}\r\n.ytc-sub-label {\r\n    font-size: 12.5px;\r\n    color: var(--yt-spec-text-secondary, #ccc);\r\n}\r\n.ytc-select {\r\n    background: rgba(255, 255, 255, 0.08);\r\n    color: var(--yt-spec-text-primary, #f1f1f1);\r\n    border: 1px solid rgba(255, 255, 255, 0.15);\r\n    border-radius: 6px;\r\n    padding: 3px 8px;\r\n    font-size: 12px;\r\n    font-family: inherit;\r\n    outline: none;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease;\r\n    max-width: 175px;\r\n}\r\n.ytc-select:hover {\r\n    background: rgba(255, 255, 255, 0.12);\r\n    border-color: rgba(255, 255, 255, 0.25);\r\n}\r\n.ytc-select:focus {\r\n    border-color: #3ea6ff;\r\n    box-shadow: 0 0 0 2px rgba(62, 166, 255, 0.2);\r\n}\r\n.ytc-select option {\r\n    background: #282828;\r\n    color: #f1f1f1;\r\n}\r\n\r\nhtml:not([dark]) .ytc-sub-item {\r\n    background: rgba(0, 0, 0, 0.025);\r\n}\r\nhtml:not([dark]) .ytc-sub-label {\r\n    color: #606060;\r\n}\r\nhtml:not([dark]) .ytc-select {\r\n    background: #ffffff;\r\n    color: #0f0f0f;\r\n    border-color: rgba(0, 0, 0, 0.15);\r\n}\r\nhtml:not([dark]) .ytc-select:hover {\r\n    background: #f8f8f8;\r\n    border-color: rgba(0, 0, 0, 0.25);\r\n}\r\nhtml:not([dark]) .ytc-select option {\r\n    background: #ffffff;\r\n    color: #0f0f0f;\r\n}\r\n#ytc-row-chatoverlay.ytc-disabled .ytc-mode-btn.active {\r\n    background: rgba(255, 255, 255, 0.12) !important;\r\n    color: rgba(255, 255, 255, 0.45) !important;\r\n    box-shadow: none !important;\r\n}\r\nhtml:not([dark]) #ytc-row-chatoverlay.ytc-disabled .ytc-mode-btn.active {\r\n    background: rgba(0, 0, 0, 0.08) !important;\r\n    color: rgba(0, 0, 0, 0.38) !important;\r\n    box-shadow: none !important;\r\n}\r\n\r\nhtml:not([dark]) .ytc-item:hover {\r\n    background: rgba(0, 0, 0, 0.05);\r\n}\r\nhtml:not([dark]) .ytc-divider {\r\n    background: rgba(0, 0, 0, 0.08);\r\n}\r\nhtml:not([dark]) .ytc-slider {\r\n    background-color: #b0b0b0;\r\n}\r\nhtml:not([dark]) .ytc-slider:before {\r\n    background-color: #ffffff;\r\n}\r\nhtml:not([dark]) .ytc-switch input:checked + .ytc-slider {\r\n    background-color: #065fd4;\r\n}\r\n\r\n/* --------------------------------------------------------------------------\r\n   CHAT OVERLAY TRÊN VIDEO (DANMAKU & STREAMER BOX)\r\n   -------------------------------------------------------------------------- */\r\n#ytc-danmaku-container {\r\n    position: absolute;\r\n    inset: 0;\r\n    width: 100% !important;\r\n    height: 100% !important;\r\n    pointer-events: none;\r\n    overflow: hidden;\r\n    z-index: 35 !important;\r\n    container-type: inline-size;\r\n    transition: opacity 0.3s ease;\r\n    display: none;\r\n}\r\n\r\n.ytc-danmaku-item {\r\n    position: absolute;\r\n    left: 100%;\r\n    white-space: nowrap;\r\n    font-family: "YouTube Noto", Roboto, Arial, sans-serif !important;\r\n    font-weight: 700;\r\n    font-size: 18px;\r\n    line-height: 1.3;\r\n    color: #ffffff;\r\n    text-shadow: \r\n        1px 1px 2px #000, \r\n        -1px -1px 2px #000, \r\n        1px -1px 2px #000, \r\n        -1px 1px 2px #000,\r\n        0 0 4px #000;\r\n    will-change: transform;\r\n    animation: ytc-danmaku-slide 8.5s linear forwards;\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    pointer-events: none;\r\n}\r\n\r\n@keyframes ytc-danmaku-slide {\r\n    from {\r\n        transform: translateX(0);\r\n    }\r\n    to {\r\n        transform: translateX(calc(-100% - 100cqi));\r\n    }\r\n}\r\n\r\n@supports not (container-type: inline-size) {\r\n    @keyframes ytc-danmaku-slide {\r\n        from {\r\n            transform: translateX(0);\r\n        }\r\n        to {\r\n            transform: translateX(calc(-100% - 100vw));\r\n        }\r\n    }\r\n}\r\n\r\n.ytc-chat-author {\r\n    color: #9ab4c7;\r\n    font-weight: 600;\r\n    flex-shrink: 0;\r\n}\r\n.ytc-chat-author.mod,\r\n.ytc-chat-text.mod {\r\n    color: #3ea6ff !important;\r\n}\r\n.ytc-chat-author.member,\r\n.ytc-chat-text.member {\r\n    color: #2ba640 !important;\r\n}\r\n.ytc-chat-author.owner,\r\n.ytc-chat-text.owner {\r\n    color: #ffd600 !important;\r\n}\r\n\r\n.ytc-chat-text {\r\n    color: #ffffff !important;\r\n    font-weight: 500;\r\n}\r\n\r\n.ytc-danmaku-item img,\r\n.ytc-danmaku-item .ytc-chat-text img,\r\n.ytc-danmaku-item img.emoji,\r\n.ytc-danmaku-item img.yt-emoji,\r\n.ytc-danmaku-item .emoji {\r\n    max-height: 22px !important;\r\n    max-width: 28px !important;\r\n    width: auto !important;\r\n    height: auto !important;\r\n    vertical-align: -3px !important;\r\n    margin: 0 2px !important;\r\n    display: inline-block !important;\r\n    object-fit: contain !important;\r\n}\r\n\r\n/* ĐIỀU KHIỂN HIỂN THỊ THEO TRẠNG THÁI CONFIG */\r\nhtml[data-ytc-chat="danmaku"] #ytc-danmaku-container,\r\nbody[data-ytc-chat="danmaku"] #ytc-danmaku-container {\r\n    display: block !important;\r\n}\r\n\r\nhtml[data-ytc-chat="streamer"] #ytc-streamer-box,\r\nbody[data-ytc-chat="streamer"] #ytc-streamer-box {\r\n    display: flex !important;\r\n}\r\n\r\nhtml[data-ytc-chat="off"] #ytc-danmaku-container,\r\nbody[data-ytc-chat="off"] #ytc-danmaku-container,\r\nhtml[data-ytc-chat="streamer"] #ytc-danmaku-container,\r\nbody[data-ytc-chat="streamer"] #ytc-danmaku-container {\r\n    display: none !important;\r\n}\r\n\r\nhtml[data-ytc-chat="off"] #ytc-streamer-box,\r\nbody[data-ytc-chat="off"] #ytc-streamer-box,\r\nhtml[data-ytc-chat="danmaku"] #ytc-streamer-box,\r\nbody[data-ytc-chat="danmaku"] #ytc-streamer-box {\r\n    display: none !important;\r\n}\r\n\r\n/* ==========================================================================\r\n   QUẢN LÝ KHUNG LIVE CHAT GỐC KHI BẬT OVERLAY\r\n   - Nếu Chat gốc BẬT: Giữ nguyên cho người dùng chat và hiển thị tự nhiên.\r\n   - Nếu Chat gốc TẮT (mặc định tắt hoặc người dùng ẩn):\r\n     + Chưa phóng to: Ẩn gọn off-screen để script lấy data ngầm.\r\n     + Phóng to Fullscreen: Ẩn triệt để panel bên phải & PHÓNG TO KHUNG VIDEO 100% FULL MÀN HÌNH.\r\n   ========================================================================== */\r\n\r\n/* 1. Giao diện thường (chưa phóng to):\r\n   Để YouTube xử lý thu gọn tự nhiên (hiện thẻ teaser "Mở bảng điều khiển" gọn gàng),\r\n   TUYỆT ĐỐI KHÔNG đẩy frame chat gốc ra -9999px để người dùng có thể nhấp mở/đóng bình thường. */\r\nytd-live-chat-frame[collapsed] #chatframe {\r\n    display: none !important;\r\n}\r\n\r\n/* 2. Trạng thái ẩn Chat gốc trong giao diện toàn màn hình (FULLSCREEN) khi CHƯA MỞ CHAT */\r\n[data-ytc-chat-hidden="true"] ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #panels-full-bleed-container,\r\n[data-ytc-chat-hidden="true"] ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #chat-container,\r\n[data-ytc-chat-hidden="true"] ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #panels,\r\n[data-ytc-chat-hidden="true"] ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #secondary,\r\n[data-ytc-chat-hidden="true"] .ytp-fullscreen:not(.ytp-chat-open) #chat-container,\r\n[data-ytc-chat-hidden="true"] .ytp-fullscreen:not(.ytp-chat-open) .ytp-live-chat-panel {\r\n    width: 0 !important;\r\n    min-width: 0 !important;\r\n    max-width: 0 !important;\r\n    flex-basis: 0 !important;\r\n    overflow: hidden !important;\r\n    opacity: 0 !important;\r\n    pointer-events: none !important;\r\n}\r\n\r\n/* Phóng to toàn bộ các tầng container và movie_player ra 100vw x 100vh để xóa sổ vệt đen khi chat đang đóng trong Fullscreen */\r\n[data-ytc-chat-hidden="true"] ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #player-full-bleed-container,\r\n[data-ytc-chat-hidden="true"] ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #full-bleed-container,\r\n[data-ytc-chat-hidden="true"] ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #player-container-outer,\r\n[data-ytc-chat-hidden="true"] ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #player-container-inner,\r\n[data-ytc-chat-hidden="true"] ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #player-container,\r\n[data-ytc-chat-hidden="true"] ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #movie_player:not(#inline-preview-player):not(.ytp-chat-open),\r\n[data-ytc-chat-hidden="true"] ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) .html5-video-player:not(#inline-preview-player):not(.ytp-chat-open),\r\n[data-ytc-chat-hidden="true"] .ytp-fullscreen.html5-video-player:not(#inline-preview-player):not(.ytp-chat-open) {\r\n    width: 100vw !important;\r\n    min-width: 100vw !important;\r\n    max-width: 100vw !important;\r\n    height: 100vh !important;\r\n    min-height: 100vh !important;\r\n    max-height: 100vh !important;\r\n    margin-right: 0 !important;\r\n    padding-right: 0 !important;\r\n    left: 0 !important;\r\n    right: 0 !important;\r\n    top: 0 !important;\r\n    bottom: 0 !important;\r\n    transform: none !important;\r\n}\r\n\r\n/* Đảm bảo nút Live Chat trên thanh điều khiển YouTube player luôn bấm được */\r\n.ytp-live-chat-button,\r\n.ytp-chat-button,\r\n#chat-container [aria-label*="chat" i],\r\nytd-live-chat-frame [aria-label*="chat" i] {\r\n    pointer-events: auto !important;\r\n    cursor: pointer !important;\r\n}\r\n\r\n\r\n/* ==========================================================================\r\n   TÍNH NĂNG ẨN BIỂU TƯỢNG CẢM XÚC TRONG LIVE CHAT (hideChatEmojis)\r\n   - Ẩn hoàn toàn thẻ ảnh emoji/sticker trong khung chat gốc\r\n   - Ẩn hoàn toàn các bình luận chỉ chứa icon/emoji không có chữ\r\n   ========================================================================== */\r\nhtml.ytc-hide-chat-emojis img.emoji,\r\nbody.ytc-hide-chat-emojis img.emoji,\r\nhtml.ytc-hide-chat-emojis img.yt-emoji,\r\nbody.ytc-hide-chat-emojis img.yt-emoji,\r\nhtml.ytc-hide-chat-emojis .emoji,\r\nbody.ytc-hide-chat-emojis .emoji,\r\nhtml.ytc-hide-chat-emojis yt-live-chat-paid-sticker-renderer,\r\nbody.ytc-hide-chat-emojis yt-live-chat-paid-sticker-renderer {\r\n    display: none !important;\r\n}\r\n\r\nhtml.ytc-hide-chat-emojis .ytc-emoji-only-msg,\r\nbody.ytc-hide-chat-emojis .ytc-emoji-only-msg {\r\n    display: none !important;\r\n}\r\n\r\n/* ==========================================================================\r\n   TOAST NOTIFICATION (HỖ TRỢ THÔNG BÁO NHẸ NHÀNG)\r\n   ========================================================================== */\r\n#ytc-toast-notification {\r\n    position: fixed;\r\n    bottom: 28px;\r\n    left: 50%;\r\n    transform: translateX(-50%) translateY(20px);\r\n    background: rgba(18, 18, 18, 0.92);\r\n    backdrop-filter: blur(12px);\r\n    -webkit-backdrop-filter: blur(12px);\r\n    color: #fff;\r\n    padding: 10px 18px;\r\n    border-radius: 20px;\r\n    font-size: 13px;\r\n    font-weight: 500;\r\n    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15);\r\n    z-index: 999999;\r\n    opacity: 0;\r\n    pointer-events: none;\r\n    transition: opacity 0.25s ease, transform 0.25s ease;\r\n    font-family: "YouTube Sans", "Roboto", sans-serif;\r\n    white-space: nowrap;\r\n}\r\n\r\n#ytc-toast-notification.ytc-toast-show {\r\n    opacity: 1;\r\n    transform: translateX(-50%) translateY(0);\r\n}\r\n\r\nhtml[light] #ytc-toast-notification,\r\nbody[light] #ytc-toast-notification {\r\n    background: rgba(255, 255, 255, 0.95);\r\n    color: #0f0f0f;\r\n    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n/* Trạng thái disabled cho các mục không hỗ trợ trong menu */\r\n.ytc-item.ytc-disabled {\r\n    opacity: 0.55;\r\n}\r\n\r\n.ytc-item.ytc-disabled .ytc-mode-btn:not([data-overlay="off"]) {\r\n    cursor: not-allowed !important;\r\n    opacity: 0.45;\r\n    pointer-events: auto !important;\r\n}\r\n\r\n\r\n\r\n/* KHUNG LIVE CHAT BOX (NỀN TRONG SUỐT HUD OVERLAY CHO STREAMER) */\r\n#ytc-streamer-box {\r\n    position: absolute;\r\n    width: 320px;\r\n    min-height: 120px;\r\n    max-height: 80%;\r\n    background: transparent !important;\r\n    backdrop-filter: none !important;\r\n    border: none !important;\r\n    box-shadow: none !important;\r\n    border-radius: 6px;\r\n    z-index: 38 !important;\r\n    overflow: hidden;\r\n    display: flex;\r\n    flex-direction: column;\r\n    pointer-events: auto;\r\n    box-sizing: border-box;\r\n    transition: background-color 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;\r\n    user-select: none;\r\n}\r\n\r\n#ytc-streamer-box.ytc-dragging {\r\n    transition: none !important;\r\n    will-change: left, top;\r\n    user-select: none !important;\r\n}\r\n\r\n#ytc-streamer-box:hover,\r\n#ytc-streamer-box.ytc-box-initial,\r\n#ytc-streamer-box.ytc-dragging {\r\n    background: rgba(0, 0, 0, 0.45) !important;\r\n    backdrop-filter: blur(4px) !important;\r\n    border: 1px dashed rgba(255, 255, 255, 0.35) !important;\r\n    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6) !important;\r\n}\r\n\r\n.ytc-box-header {\r\n    height: 24px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    padding: 2px 6px;\r\n    background: rgba(0, 0, 0, 0.75);\r\n    color: #eee;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    cursor: move;\r\n    opacity: 0;\r\n    pointer-events: none;\r\n    transition: opacity 0.2s ease;\r\n    flex-shrink: 0;\r\n    border-top-left-radius: 6px;\r\n    border-top-right-radius: 6px;\r\n}\r\n\r\n.ytc-box-title {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 5px;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    color: #fff;\r\n    user-select: none;\r\n    letter-spacing: 0.2px;\r\n}\r\n\r\n.ytc-box-title svg {\r\n    flex-shrink: 0;\r\n    opacity: 0.9;\r\n}\r\n\r\n.ytc-box-close {\r\n    background: transparent !important;\r\n    border: none !important;\r\n    color: rgba(255, 255, 255, 0.7) !important;\r\n    cursor: pointer !important;\r\n    width: 20px !important;\r\n    height: 20px !important;\r\n    padding: 0 !important;\r\n    margin: 0 !important;\r\n    border-radius: 4px !important;\r\n    display: flex !important;\r\n    align-items: center !important;\r\n    justify-content: center !important;\r\n    transition: background 0.15s ease, color 0.15s ease !important;\r\n    outline: none !important;\r\n    box-shadow: none !important;\r\n}\r\n\r\n.ytc-box-close:hover {\r\n    background: rgba(255, 255, 255, 0.2) !important;\r\n    color: #fff !important;\r\n}\r\n\r\n.ytc-box-close svg {\r\n    display: block;\r\n}\r\n\r\n#ytc-streamer-box:hover .ytc-box-header,\r\n#ytc-streamer-box.ytc-box-initial .ytc-box-header,\r\n#ytc-streamer-box.ytc-dragging .ytc-box-header {\r\n    opacity: 1 !important;\r\n    pointer-events: auto !important;\r\n}\r\n\r\n#ytc-streamer-box:hover .ytc-box-resize,\r\n#ytc-streamer-box.ytc-box-initial .ytc-box-resize,\r\n#ytc-streamer-box.ytc-dragging .ytc-box-resize {\r\n    opacity: 1 !important;\r\n    pointer-events: auto !important;\r\n}\r\n\r\n.ytc-box-messages {\r\n    flex: 1;\r\n    overflow-y: hidden;\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-end;\r\n    gap: 3px;\r\n    padding: 2px 4px;\r\n    pointer-events: none;\r\n}\r\n\r\n.ytc-box-item {\r\n    display: flex;\r\n    align-items: flex-start;\r\n    flex-shrink: 0 !important;\r\n    flex-grow: 0 !important;\r\n    width: 100%;\r\n    box-sizing: border-box;\r\n    height: auto !important;\r\n    min-height: min-content !important;\r\n    gap: 3px;\r\n    font-size: 10px;\r\n    line-height: 1.35;\r\n    color: #fff;\r\n    text-shadow: \r\n        1px 1px 2px #000, \r\n        -1px -1px 2px #000, \r\n        1px -1px 2px #000, \r\n        -1px 1px 2px #000, \r\n        0 0 3px #000;\r\n    animation: ytc-fade-in 0.12s ease-out;\r\n    word-break: break-word;\r\n    overflow-wrap: break-word;\r\n}\r\n\r\n.ytc-box-avatar {\r\n    width: 10px;\r\n    height: 10px;\r\n    border-radius: 50%;\r\n    flex-shrink: 0;\r\n    margin-top: 2px;\r\n}\r\n\r\n.ytc-box-content {\r\n    flex: 1;\r\n    min-width: 0;\r\n    word-break: break-word;\r\n    overflow-wrap: break-word;\r\n    line-height: 1.35;\r\n}\r\n\r\n#ytc-streamer-box .ytc-chat-author {\r\n    color: #b5b5b5 !important;\r\n    font-weight: 700 !important;\r\n    flex-shrink: 0;\r\n}\r\n#ytc-streamer-box .ytc-chat-author.mod {\r\n    color: #3ea6ff !important;\r\n    font-weight: 700 !important;\r\n}\r\n#ytc-streamer-box .ytc-chat-author.member {\r\n    color: #2ba640 !important;\r\n    font-weight: 700 !important;\r\n}\r\n#ytc-streamer-box .ytc-chat-author.owner {\r\n    color: #ffd600 !important;\r\n    font-weight: 700 !important;\r\n}\r\n\r\n#ytc-streamer-box .ytc-chat-text {\r\n    color: #ffffff !important;\r\n    font-weight: 700 !important;\r\n}\r\n\r\n/* THU NHỎ ICON EMOJI VÀ BADGE BẰNG CỠ CHỮ CHỈ ÁP DỤNG CHO KHUNG NỔI STREAMER */\r\n#ytc-streamer-box .ytc-box-content img,\r\n#ytc-streamer-box .ytc-box-item img,\r\n#ytc-streamer-box img.emoji,\r\n#ytc-streamer-box img.yt-emoji,\r\n#ytc-streamer-box .emoji {\r\n    max-height: 10px !important;\r\n    width: auto !important;\r\n    max-width: 12px !important;\r\n    height: auto !important;\r\n    vertical-align: -1px !important;\r\n    display: inline-block !important;\r\n    object-fit: contain !important;\r\n    margin: 0 1px !important;\r\n}\r\n\r\n.ytc-box-badge {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    vertical-align: -1px;\r\n    margin: 0 2px;\r\n}\r\n.ytc-box-badge.ytc-badge-mod,\r\n.ytc-box-badge.ytc-badge-owner {\r\n    display: inline-flex !important;\r\n    align-items: center !important;\r\n    justify-content: center !important;\r\n    vertical-align: -1px !important;\r\n    margin: 0 1px !important;\r\n}\r\n.ytc-box-badge svg.ytc-mod-icon,\r\n.ytc-badge-mod,\r\n.ytc-mod-icon {\r\n    display: inline-block !important;\r\n    width: 10px !important;\r\n    height: 10px !important;\r\n    fill: #3ea6ff !important;\r\n    vertical-align: -1px !important;\r\n}\r\n.ytc-box-badge svg.ytc-owner-icon,\r\n.ytc-badge-owner,\r\n.ytc-owner-icon {\r\n    display: inline-block !important;\r\n    width: 10px !important;\r\n    height: 10px !important;\r\n    fill: #ffd600 !important;\r\n    vertical-align: -1px !important;\r\n}\r\n.ytc-box-badge img {\r\n    width: 10px !important;\r\n    height: 10px !important;\r\n    max-width: 10px !important;\r\n    max-height: 10px !important;\r\n    display: inline-block !important;\r\n    vertical-align: -1px !important;\r\n    object-fit: contain !important;\r\n}\r\n\r\n.ytc-box-resize {\r\n    position: absolute;\r\n    right: 2px;\r\n    bottom: 2px;\r\n    width: 10px;\r\n    height: 10px;\r\n    cursor: nwse-resize;\r\n    opacity: 0;\r\n    pointer-events: none;\r\n    transition: opacity 0.2s ease;\r\n    border-right: 2px solid rgba(255, 255, 255, 0.6);\r\n    border-bottom: 2px solid rgba(255, 255, 255, 0.6);\r\n}\r\n\r\n#ytc-streamer-box:hover .ytc-box-resize,\r\n#ytc-streamer-box.ytc-box-initial .ytc-box-resize {\r\n    opacity: 1;\r\n    pointer-events: auto;\r\n}\r\n\r\n/* HIỆU ỨNG XUẤT HIỆN MƯỢT MÀ, KHÔNG DÙNG TRANSLATE-Y GÂY GIẬT LAG KHUNG HÌNH */\r\n@keyframes ytc-fade-in {\r\n    from { opacity: 0; }\r\n    to { opacity: 1; }\r\n}\r\n\r\n/* TỰ ĐỘNG CÂN ĐỐI TỶ LỆ KÍCH THƯỚC CHỮ KHI PHÓNG TO TOÀN MÀN HÌNH (FULLSCREEN / ZOOM) */\r\n.ytp-fullscreen .ytc-danmaku-item {\r\n    font-size: 25px !important;\r\n}\r\n.ytp-fullscreen .ytc-danmaku-item img,\r\n.ytp-fullscreen .ytc-danmaku-item .ytc-chat-text img,\r\n.ytp-fullscreen .ytc-danmaku-item img.emoji,\r\n.ytp-fullscreen .ytc-danmaku-item img.yt-emoji,\r\n.ytp-fullscreen .ytc-danmaku-item .emoji {\r\n    max-height: 28px !important;\r\n    max-width: 36px !important;\r\n    vertical-align: -4px !important;\r\n}\r\n\r\n/* ==========================================================================\r\n   ONBOARDING TOOLTIP KHI CÀI ĐẶT LẦN ĐẦU (FIRST-TIME USER EXPERIENCE)\r\n   ========================================================================== */\r\n#ytc-onboarding-tip {\r\n    position: fixed;\r\n    z-index: 100000;\r\n    width: 280px;\r\n    background: #18181b;\r\n    border: 1px solid rgba(255, 0, 51, 0.6);\r\n    border-radius: 10px;\r\n    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);\r\n    color: #fff;\r\n    padding: 12px 14px;\r\n    font-family: Roboto, Arial, sans-serif;\r\n    user-select: none;\r\n    box-sizing: border-box;\r\n    animation: ytc-fade-in 0.12s ease-out;\r\n}\r\n\r\n.ytc-onboarding-arrow {\r\n    position: absolute;\r\n    top: -6px;\r\n    right: 18px;\r\n    width: 10px;\r\n    height: 10px;\r\n    background: #18181b;\r\n    border-left: 1px solid rgba(255, 0, 51, 0.6);\r\n    border-top: 1px solid rgba(255, 0, 51, 0.6);\r\n    transform: rotate(45deg);\r\n}\r\n\r\n.ytc-onboarding-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    margin-bottom: 6px;\r\n}\r\n\r\n.ytc-onboarding-badge {\r\n    font-size: 10px;\r\n    font-weight: 700;\r\n    background: #ff0033;\r\n    color: #fff;\r\n    padding: 2px 6px;\r\n    border-radius: 4px;\r\n    letter-spacing: 0.5px;\r\n}\r\n\r\n.ytc-onboarding-close {\r\n    background: transparent;\r\n    border: none;\r\n    color: #aaa;\r\n    font-size: 13px;\r\n    cursor: pointer;\r\n    padding: 2px 4px;\r\n    line-height: 1;\r\n    border-radius: 4px;\r\n    transition: color 0.1s;\r\n}\r\n.ytc-onboarding-close:hover {\r\n    color: #fff;\r\n}\r\n\r\n.ytc-onboarding-title {\r\n    font-size: 13px;\r\n    font-weight: 700;\r\n    color: #fff;\r\n    line-height: 1.35;\r\n    margin-bottom: 4px;\r\n}\r\n\r\n.ytc-onboarding-desc {\r\n    font-size: 11.5px;\r\n    color: #ccc;\r\n    line-height: 1.4;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.ytc-onboarding-footer {\r\n    display: flex;\r\n    justify-content: flex-end;\r\n}\r\n\r\n.ytc-onboarding-btn {\r\n    background: #ff0033;\r\n    color: #fff;\r\n    border: none;\r\n    padding: 5px 14px;\r\n    font-size: 11.5px;\r\n    font-weight: 600;\r\n    border-radius: 6px;\r\n    cursor: pointer;\r\n    transition: background-color 0.15s;\r\n}\r\n.ytc-onboarding-btn:hover {\r\n    background: #cc0029;\r\n}\r\n\r\n/* --------------------------------------------------------------------------\r\n   CHẾ ĐỘ CHỈ PHÁT ÂM THANH (RADIO / AUDIO ONLY)\r\n   -------------------------------------------------------------------------- */\r\nhtml.ytc-audio-only #movie_player video,\r\nbody.ytc-audio-only #movie_player video {\r\n    visibility: hidden !important;\r\n}\r\n\r\n#ytc-audio-only-badge {\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    transform: translate(-50%, -50%);\r\n    text-align: center;\r\n    pointer-events: none;\r\n    user-select: none;\r\n    z-index: 30;\r\n    font-family: "YouTube Sans", Roboto, sans-serif;\r\n    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);\r\n    width: 90%;\r\n    max-width: 650px;\r\n}\r\n\r\n.ytc-audio-badge-title {\r\n    color: #ffffff;\r\n    font-size: clamp(22px, 2.5vw, 30px);\r\n    font-weight: 600;\r\n    letter-spacing: 0.4px;\r\n    line-height: 1.35;\r\n}\r\n\r\n.ytc-audio-badge-sub {\r\n    color: rgba(255, 255, 255, 0.65);\r\n    font-size: clamp(15px, 1.4vw, 19px);\r\n    font-weight: 400;\r\n    margin-top: 10px;\r\n    line-height: 1.4;\r\n}\r\n\r\n/* --------------------------------------------------------------------------\r\n   TAB 5: THÔNG TIN, NHÀ PHÁT TRIỂN & ỦNG HỘ\r\n   -------------------------------------------------------------------------- */\r\n.ytc-item-text-group {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 2px;\r\n    text-align: left;\r\n    min-width: 0;\r\n}\r\n.ytc-item-main-text {\r\n    font-size: 13.5px;\r\n    font-weight: 500;\r\n    color: inherit;\r\n    line-height: 1.2;\r\n}\r\n.ytc-item-sub-text {\r\n    font-size: 11px;\r\n    color: #888;\r\n    line-height: 1.2;\r\n}\r\nhtml:not([dark]) .ytc-item-sub-text {\r\n    color: #606060;\r\n}\r\n\r\n.ytc-info-card {\r\n    background: rgba(255, 255, 255, 0.04);\r\n    border: 1px solid rgba(255, 255, 255, 0.08);\r\n    border-radius: 8px;\r\n    padding: 8px 10px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    gap: 8px;\r\n    margin-top: 4px;\r\n}\r\nhtml:not([dark]) .ytc-info-card {\r\n    background: rgba(0, 0, 0, 0.02);\r\n    border-color: rgba(0, 0, 0, 0.08);\r\n}\r\n.ytc-info-title-wrap {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 6px;\r\n    min-width: 0;\r\n}\r\n.ytc-info-title {\r\n    font-weight: 600;\r\n    font-size: 13.5px;\r\n    white-space: nowrap;\r\n}\r\n.ytc-info-version {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    font-size: 11px;\r\n    font-weight: 600;\r\n    color: #ff4e45;\r\n    background: rgba(255, 78, 69, 0.12);\r\n    border: 1px solid rgba(255, 78, 69, 0.25);\r\n    padding: 2px 8px;\r\n    border-radius: 6px;\r\n    letter-spacing: 0.5px;\r\n    user-select: none;\r\n    white-space: nowrap;\r\n}\r\nhtml:not([dark]) .ytc-info-version {\r\n    color: #cc0000;\r\n    background: rgba(204, 0, 0, 0.08);\r\n    border-color: rgba(204, 0, 0, 0.25);\r\n}\r\n.ytc-update-btn {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 5px;\r\n    padding: 5px 10px;\r\n    background: rgba(255, 255, 255, 0.08);\r\n    border: 1px solid rgba(255, 255, 255, 0.12);\r\n    color: #eee;\r\n    border-radius: 6px;\r\n    font-size: 11.5px;\r\n    font-weight: 500;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease;\r\n    white-space: nowrap;\r\n    flex-shrink: 0;\r\n}\r\n.ytc-update-btn:hover {\r\n    background: rgba(255, 255, 255, 0.15);\r\n    color: #fff;\r\n    border-color: rgba(255, 255, 255, 0.2);\r\n}\r\n.ytc-update-btn svg {\r\n    width: 13px;\r\n    height: 13px;\r\n    fill: currentColor;\r\n    flex-shrink: 0;\r\n}\r\n.ytc-update-btn.ytc-btn-loading {\r\n    opacity: 0.8;\r\n    cursor: wait;\r\n}\r\n.ytc-update-btn.ytc-btn-success {\r\n    background: rgba(46, 204, 113, 0.15) !important;\r\n    color: #2ecc71 !important;\r\n    border-color: rgba(46, 204, 113, 0.35) !important;\r\n}\r\nhtml:not([dark]) .ytc-update-btn.ytc-btn-success {\r\n    background: rgba(39, 174, 96, 0.1) !important;\r\n    color: #27ae60 !important;\r\n    border-color: rgba(39, 174, 96, 0.3) !important;\r\n}\r\n.ytc-update-btn.ytc-btn-has-update {\r\n    background: rgba(62, 166, 255, 0.12) !important;\r\n    color: #3ea6ff !important;\r\n    border: 1px solid rgba(62, 166, 255, 0.25) !important;\r\n    cursor: pointer !important;\r\n}\r\n.ytc-update-btn.ytc-btn-has-update:hover {\r\n    background: #3ea6ff !important;\r\n    color: #0f0f0f !important;\r\n    border-color: #3ea6ff !important;\r\n}\r\nhtml:not([dark]) .ytc-update-btn.ytc-btn-has-update {\r\n    background: rgba(6, 95, 212, 0.08) !important;\r\n    color: #065fd4 !important;\r\n    border-color: rgba(6, 95, 212, 0.25) !important;\r\n}\r\nhtml:not([dark]) .ytc-update-btn.ytc-btn-has-update:hover {\r\n    background: #065fd4 !important;\r\n    color: #ffffff !important;\r\n    border-color: #065fd4 !important;\r\n}\r\nhtml:not([dark]) .ytc-update-btn {\r\n    background: rgba(0, 0, 0, 0.05);\r\n    border-color: rgba(0, 0, 0, 0.1);\r\n    color: #0f0f0f;\r\n}\r\nhtml:not([dark]) .ytc-update-btn:hover {\r\n    background: rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n/* ==========================================================================\r\n   HIỆU ỨNG ÁNH SÁNG PHÒNG (AMBIENT LIGHT / AMBILIGHT) TỰ ĐỘNG TỐI ƯU\r\n   ========================================================================== */\r\n/* ==========================================================================\r\n   HIỆU ỨNG ÁNH SÁNG PHÒNG (AMBIENT LIGHT / AMBILIGHT) FULL-SCREEN CINEMA\r\n   - 4-Border Edge Bleeding: Khung màu ăn khớp 100% mép viền video tiếp giáp\r\n   - Vertical Glow Columns: Dải màu dọc lan sâu xuống giữa trang (chuẩn Ảnh 4)\r\n   - Zero Horizontal Scrollbar: Triệt tiêu hoàn toàn thanh cuộn ngang\r\n   - Masthead Translucent: Trong suốt xuyên thấu ở đỉnh trang, đen lại khi cuộn\r\n   - OLED Depth Shadow & Glass UI: Giao diện kính mờ sang trọng, video nổi bật\r\n   ========================================================================== */\r\n\r\n/* Triệt tiêu 100% thanh cuộn ngang toàn cục */\r\nhtml, body {\r\n    overflow-x: hidden !important;\r\n    max-width: 100vw !important;\r\n}\r\n\r\nytd-app, #page-manager, ytd-watch-flexy {\r\n    overflow-x: clip !important;\r\n    max-width: 100% !important;\r\n}\r\n\r\nytd-watch-flexy {\r\n    position: relative !important;\r\n    overflow: visible !important;\r\n}\r\n\r\n#ytc-ambient-wrapper {\r\n    position: absolute !important;\r\n    top: -56px !important;\r\n    left: 0 !important;\r\n    right: 0 !important;\r\n    width: 100% !important;\r\n    height: 2200px !important;\r\n    pointer-events: none !important;\r\n    z-index: 0 !important;\r\n    overflow: hidden !important;\r\n    contain: paint !important;\r\n    opacity: 0;\r\n    /* Lan tỏa sâu xuống giữa trang (gấp đôi độ dài trước đây), tan biến mượt mà */\r\n    mask-image: linear-gradient(to bottom, #000 0%, #000 55%, rgba(0, 0, 0, 0.6) 75%, rgba(0, 0, 0, 0.2) 90%, transparent 100%);\r\n    -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 55%, rgba(0, 0, 0, 0.6) 75%, rgba(0, 0, 0, 0.2) 90%, transparent 100%);\r\n    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);\r\n}\r\n\r\n#ytc-ambient-wrapper.ytc-ambient-active {\r\n    opacity: 1;\r\n}\r\n\r\n/* Lớp Canvas Ambilight duy nhất: Mở rộng tràn viền để triệt tiêu hiện tượng mờ trắng ở các góc */\r\n#ytc-ambient-spread-canvas {\r\n    position: absolute !important;\r\n    top: -60px !important;\r\n    left: -60px !important;\r\n    width: calc(100% + 120px) !important;\r\n    height: calc(100% + 120px) !important;\r\n    filter: blur(48px) saturate(145%) brightness(105%);\r\n    pointer-events: none !important;\r\n    transform: translateZ(0);\r\n    opacity: 0.92;\r\n}\r\n\r\n/* Ẩn Ambilight mặc định của YouTube để tránh xung đột */\r\n#cinematic-container,\r\nytd-watch-flexy #cinematic-container {\r\n    display: none !important;\r\n}\r\n\r\n/* Khung video: Bo tròn mượt mà, KHÔNG viền, KHÔNG bóng đổ tạo viền trắng giả */\r\nhtml.ytc-ambient-lighting #movie_player {\r\n    border-radius: 12px !important;\r\n    overflow: hidden !important;\r\n    border: none !important;\r\n    outline: none !important;\r\n    box-shadow: none !important;\r\n}\r\n\r\nhtml[fullscreen] #movie_player,\r\n.ytp-fullscreen #movie_player {\r\n    border-radius: 0 !important;\r\n    box-shadow: none !important;\r\n    border: none !important;\r\n    outline: none !important;\r\n}\r\n\r\n/* Làm trong suốt các khung chứa video, cột nội dung & bình luận để ánh sáng xuyên thấu sâu xuống trang */\r\nhtml.ytc-ambient-lighting ytd-watch-flexy,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #columns,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #primary,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #primary-inner,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #secondary,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #secondary-inner,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #panels,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #playlist,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #player,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #player-container,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #player-container-outer,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #player-container-inner,\r\nhtml.ytc-ambient-lighting #full-bleed-container,\r\nhtml.ytc-ambient-lighting #player-full-bleed-container,\r\nhtml.ytc-ambient-lighting #player-theater-container,\r\nhtml.ytc-ambient-lighting #below,\r\nhtml.ytc-ambient-lighting ytd-comments,\r\nhtml.ytc-ambient-lighting #comments,\r\nhtml.ytc-ambient-lighting ytd-item-section-renderer#sections {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    border: none !important;\r\n    outline: none !important;\r\n}\r\n\r\n/* Đảm bảo cột nội dung và khung video nổi trên tầng ambient light */\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #columns,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #full-bleed-container,\r\nhtml.ytc-ambient-lighting ytd-watch-flexy #player-theater-container {\r\n    z-index: 1 !important;\r\n}\r\n\r\n/* Playlist / Danh sách kết hợp: TRONG SUỐT HOÀN TOÀN, KHÔNG HIỆN KHUNG */\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer {\r\n    --yt-spec-base-background: transparent !important;\r\n    --yt-spec-raised-background: transparent !important;\r\n    --yt-spec-menu-background: transparent !important;\r\n    --yt-spec-additive-background: transparent !important;\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    border: none !important;\r\n    box-shadow: none !important;\r\n}\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer #container,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer #container.ytd-playlist-panel-renderer,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer #header,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer .header.ytd-playlist-panel-renderer,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer #header.ytd-playlist-panel-renderer,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer #items,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer .playlist-items,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer #items.ytd-playlist-panel-renderer,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer iron-list,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer #items-container,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer #contents,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer #playlist-actions,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer #content,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer a#wc-endpoint,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer #container,\r\nhtml.ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer .yt-lockup-view-model-wiz {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    border: none !important;\r\n    border-bottom: none !important;\r\n    box-shadow: none !important;\r\n    backdrop-filter: none !important;\r\n    -webkit-backdrop-filter: none !important;\r\n}\r\n\r\n/* Dải Filter Chips: Nền trong suốt */\r\nhtml.ytc-ambient-lighting yt-related-chip-cloud-renderer,\r\nhtml.ytc-ambient-lighting yt-chip-cloud-renderer,\r\nhtml.ytc-ambient-lighting #chip-bar,\r\nhtml.ytc-ambient-lighting iron-selector#chips,\r\nhtml.ytc-ambient-lighting #chips.yt-chip-cloud-renderer,\r\nhtml.ytc-ambient-lighting #chips.iron-selector {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n}\r\n\r\n/* Description box: TRONG SUỐT HOÀN TOÀN, KHÔNG HIỆN KHUNG */\r\nhtml.ytc-ambient-lighting ytd-watch-metadata #description,\r\nhtml.ytc-ambient-lighting ytd-watch-metadata #description.ytd-watch-metadata,\r\nhtml.ytc-ambient-lighting #description-inner,\r\nhtml.ytc-ambient-lighting ytd-expandable-metadata-renderer,\r\nhtml.ytc-ambient-lighting #description-and-actions,\r\nhtml.ytc-ambient-lighting ytd-text-inline-expander {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    border: none !important;\r\n    box-shadow: none !important;\r\n    backdrop-filter: none !important;\r\n    -webkit-backdrop-filter: none !important;\r\n}\r\n\r\n/* Giảm màu và dịu nội dung phụ xung quanh để video chính nổi bật rực rỡ */\r\nhtml.ytc-ambient-lighting #secondary ytd-thumbnail,\r\nhtml.ytc-ambient-lighting #related ytd-thumbnail {\r\n    filter: brightness(0.88) contrast(0.95);\r\n    transition: filter 0.25s ease;\r\n}\r\nhtml.ytc-ambient-lighting #secondary ytd-thumbnail:hover,\r\nhtml.ytc-ambient-lighting #related ytd-thumbnail:hover {\r\n    filter: brightness(1) contrast(1);\r\n}\r\n\r\n/* ==========================================================================\r\n   1. QUY TẮC RIÊNG CHO GIAO DIỆN TỐI (DARK THEME)\r\n   ========================================================================== */\r\n\r\n/* Khi ở đỉnh trang: Masthead trong suốt cho ánh sáng xuyên qua */\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) #masthead-container,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) #masthead-container.ytd-app,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead #container,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead #background,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) #background.ytd-masthead,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead #end,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead #start,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead #center,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead #buttons {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    border: none !important;\r\n    border-bottom: none !important;\r\n    box-shadow: none !important;\r\n    backdrop-filter: none !important;\r\n    -webkit-backdrop-filter: none !important;\r\n}\r\n\r\n/* Khung tìm kiếm Dark theme ở đỉnh trang */\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-searchbox,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) yt-searchbox,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) #search-form,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) form.ytSearchboxComponentSearchForm {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    border: none !important;\r\n    box-shadow: none !important;\r\n    backdrop-filter: none !important;\r\n    -webkit-backdrop-filter: none !important;\r\n}\r\n\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-searchbox #container,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) #search-form.ytd-searchbox #container,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) #search-input,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) .ytSearchboxComponentInputBox {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    box-shadow: none !important;\r\n    border-color: rgba(255, 255, 255, 0.15) !important;\r\n}\r\n\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-searchbox #search-icon-legacy,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) .ytSearchboxComponentSearchButton {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    border-color: rgba(255, 255, 255, 0.15) !important;\r\n    box-shadow: none !important;\r\n}\r\n\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-searchbox input#search,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) input#search,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) input.ytSearchboxComponentInput {\r\n    background: transparent !important;\r\n    color: #fff !important;\r\n}\r\n\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) #voice-search-button button,\r\nhtml[dark].ytc-ambient-lighting:not(.ytc-masthead-scrolled) #voice-search-button yt-button-shape button {\r\n    background: transparent !important;\r\n    border: 1px solid rgba(255, 255, 255, 0.15) !important;\r\n}\r\n\r\n/* KHI CUỘN XUỐNG Ở DARK THEME: Masthead quay về màu ĐEN #0f0f0f */\r\nhtml[dark].ytc-ambient-lighting.ytc-masthead-scrolled #masthead-container,\r\nhtml[dark].ytc-ambient-lighting.ytc-masthead-scrolled ytd-masthead {\r\n    background: #0f0f0f !important;\r\n    background-color: #0f0f0f !important;\r\n    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;\r\n    transition: background-color 0.25s ease, border-color 0.25s ease;\r\n}\r\n\r\n/* Các thành phần phụ trong Dark theme */\r\nhtml[dark].ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer:hover,\r\nhtml[dark].ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer:hover #content,\r\nhtml[dark].ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer:hover a#wc-endpoint {\r\n    background: rgba(255, 255, 255, 0.08) !important;\r\n    border-radius: 8px !important;\r\n}\r\n\r\nhtml[dark].ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer[selected],\r\nhtml[dark].ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer[selected] #content,\r\nhtml[dark].ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer[selected] a#wc-endpoint {\r\n    background: rgba(255, 255, 255, 0.12) !important;\r\n    border-radius: 8px !important;\r\n}\r\n\r\nhtml[dark].ytc-ambient-lighting yt-chip-cloud-chip-renderer:not([selected]) {\r\n    background: rgba(255, 255, 255, 0.06) !important;\r\n    border-radius: 8px !important;\r\n    border: none !important;\r\n}\r\n\r\nhtml[dark].ytc-ambient-lighting yt-chip-cloud-chip-renderer:not([selected]):hover {\r\n    background: rgba(255, 255, 255, 0.14) !important;\r\n}\r\n\r\nhtml[dark].ytc-ambient-lighting ytd-watch-metadata #description:hover,\r\nhtml[dark].ytc-ambient-lighting ytd-watch-metadata #description.ytd-watch-metadata:hover {\r\n    background: rgba(255, 255, 255, 0.04) !important;\r\n    border-radius: 12px !important;\r\n}\r\n\r\nhtml[dark].ytc-ambient-lighting #actions ytd-button-renderer yt-button-shape button,\r\nhtml[dark].ytc-ambient-lighting #actions ytd-menu-renderer yt-button-shape button,\r\nhtml[dark].ytc-ambient-lighting #top-level-buttons-computed yt-button-shape button {\r\n    background: rgba(255, 255, 255, 0.06) !important;\r\n    border: none !important;\r\n}\r\n\r\nhtml[dark].ytc-ambient-ready ytd-watch-metadata #title h1,\r\nhtml[dark].ytc-ambient-lighting ytd-watch-metadata #title h1 {\r\n    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);\r\n}\r\n\r\n/* ==========================================================================\r\n   2. QUY TẮC RIÊNG CHO GIAO DIỆN SÁNG (LIGHT THEME)\r\n   ========================================================================== */\r\n\r\n/* Tinh chỉnh màu sắc Ambilight trên nền trắng: Màu sắc rực rỡ, đậm đà ngang ngửa Dark Theme */\r\nhtml:not([dark]) #ytc-ambient-spread-canvas {\r\n    filter: blur(48px) saturate(220%) contrast(115%) brightness(96%);\r\n    opacity: 0.9;\r\n}\r\n\r\n/* Khi ở đỉnh trang: Masthead trong suốt */\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) #masthead-container,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) #masthead-container.ytd-app,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead #container,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead #background,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) #background.ytd-masthead,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead #end,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead #start,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead #center,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-masthead #buttons {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    border: none !important;\r\n    border-bottom: none !important;\r\n    box-shadow: none !important;\r\n    backdrop-filter: none !important;\r\n    -webkit-backdrop-filter: none !important;\r\n}\r\n\r\n/* Khung tìm kiếm Light theme ở đỉnh trang: 100% trong suốt xuyên thấu */\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-searchbox,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) yt-searchbox,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) #search-form,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) form.ytSearchboxComponentSearchForm {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    border: none !important;\r\n    box-shadow: none !important;\r\n    backdrop-filter: none !important;\r\n    -webkit-backdrop-filter: none !important;\r\n}\r\n\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-searchbox #container,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) #search-form.ytd-searchbox #container,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) #search-input,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) .ytSearchboxComponentInputBox {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    box-shadow: none !important;\r\n    backdrop-filter: none !important;\r\n    -webkit-backdrop-filter: none !important;\r\n    border-color: rgba(0, 0, 0, 0.15) !important;\r\n}\r\n\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-searchbox #search-icon-legacy,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) .ytSearchboxComponentSearchButton {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    border-color: rgba(0, 0, 0, 0.15) !important;\r\n    box-shadow: none !important;\r\n    backdrop-filter: none !important;\r\n    -webkit-backdrop-filter: none !important;\r\n}\r\n\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) ytd-searchbox input#search,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) input#search,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) input.ytSearchboxComponentInput {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    box-shadow: none !important;\r\n    color: #0f0f0f !important;\r\n}\r\n\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) #voice-search-button button,\r\nhtml:not([dark]).ytc-ambient-lighting:not(.ytc-masthead-scrolled) #voice-search-button yt-button-shape button {\r\n    background: transparent !important;\r\n    background-color: transparent !important;\r\n    border: 1px solid rgba(0, 0, 0, 0.15) !important;\r\n    box-shadow: none !important;\r\n    backdrop-filter: none !important;\r\n    -webkit-backdrop-filter: none !important;\r\n}\r\n\r\n/* KHI CUỘN XUỐNG Ở LIGHT THEME: Masthead TRỞ VỀ MÀU TRẮNG #ffffff (CHUẨN XÁC) */\r\nhtml:not([dark]).ytc-ambient-lighting.ytc-masthead-scrolled #masthead-container,\r\nhtml:not([dark]).ytc-ambient-lighting.ytc-masthead-scrolled ytd-masthead {\r\n    background: #ffffff !important;\r\n    background-color: #ffffff !important;\r\n    border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;\r\n    transition: background-color 0.25s ease, border-color 0.25s ease;\r\n}\r\n\r\n/* Các thành phần phụ trong Light theme: Màu tối dịu nhẹ trên nền sáng */\r\nhtml:not([dark]).ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer:hover,\r\nhtml:not([dark]).ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer:hover #content,\r\nhtml:not([dark]).ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer:hover a#wc-endpoint {\r\n    background: rgba(0, 0, 0, 0.05) !important;\r\n    border-radius: 8px !important;\r\n}\r\n\r\nhtml:not([dark]).ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer[selected],\r\nhtml:not([dark]).ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer[selected] #content,\r\nhtml:not([dark]).ytc-ambient-lighting ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer[selected] a#wc-endpoint {\r\n    background: rgba(0, 0, 0, 0.08) !important;\r\n    border-radius: 8px !important;\r\n}\r\n\r\nhtml:not([dark]).ytc-ambient-lighting yt-chip-cloud-chip-renderer:not([selected]) {\r\n    background: rgba(0, 0, 0, 0.05) !important;\r\n    color: #0f0f0f !important;\r\n    border-radius: 8px !important;\r\n    border: none !important;\r\n}\r\n\r\nhtml:not([dark]).ytc-ambient-lighting yt-chip-cloud-chip-renderer:not([selected]):hover {\r\n    background: rgba(0, 0, 0, 0.1) !important;\r\n}\r\n\r\nhtml:not([dark]).ytc-ambient-lighting ytd-watch-metadata #description:hover,\r\nhtml:not([dark]).ytc-ambient-lighting ytd-watch-metadata #description.ytd-watch-metadata:hover {\r\n    background: rgba(0, 0, 0, 0.03) !important;\r\n    border-radius: 12px !important;\r\n}\r\n\r\nhtml:not([dark]).ytc-ambient-lighting #actions ytd-button-renderer yt-button-shape button,\r\nhtml:not([dark]).ytc-ambient-lighting #actions ytd-menu-renderer yt-button-shape button,\r\nhtml:not([dark]).ytc-ambient-lighting #top-level-buttons-computed yt-button-shape button {\r\n    background: rgba(0, 0, 0, 0.05) !important;\r\n    border: none !important;\r\n}\r\n\r\nhtml:not([dark]).ytc-ambient-ready ytd-watch-metadata #title h1,\r\nhtml:not([dark]).ytc-ambient-lighting ytd-watch-metadata #title h1 {\r\n    text-shadow: none !important;\r\n}\r\n\r\n/* Tự động ẩn khi fullscreen hoàn toàn để tiết kiệm 100% GPU */\r\nhtml[fullscreen] #ytc-ambient-wrapper,\r\nytd-watch-flexy[fullscreen] #ytc-ambient-wrapper,\r\n.ytp-fullscreen #ytc-ambient-wrapper {\r\n    display: none !important;\r\n}\r\n\r\n/* Ẩn khi không bật tính năng */\r\nhtml:not(.ytc-ambient-lighting) #ytc-ambient-wrapper {\r\n    display: none !important;\r\n}\r\n\r\n/* ==========================================================================\r\n   TỐI ƯU BỐ CỤC TRANG XEM VIDEO (WATCH PAGE FULL-WIDTH ALIGNMENT)\r\n   - Khắc phục triệt để lỗi khung video bị bóp ép vào trong, thừa 2 khoảng trống 2 bên\r\n   - Triệt tiêu hoàn toàn thanh cuộn ngang (Zero Horizontal Scrollbar)\r\n   - Ép layout trải rộng 100% màn hình, cách đều 2 mép 24px chuẩn như giao diện gốc\r\n   - Video player và sidebar gợi ý tự động co dãn linh hoạt, bám sát mép phải\r\n   ========================================================================== */\r\n@media (min-width: 1000px) {\r\n    ytd-watch-flexy:not([theater]):not([fullscreen]) #columns.ytd-watch-flexy {\r\n        max-width: 100% !important;\r\n        width: 100% !important;\r\n        margin: 0 !important;\r\n        padding-left: 24px !important;\r\n        padding-right: 24px !important;\r\n        box-sizing: border-box !important;\r\n        display: flex !important;\r\n        justify-content: space-between !important;\r\n        overflow-x: clip !important;\r\n    }\r\n\r\n    ytd-watch-flexy:not([theater]):not([fullscreen]) #primary.ytd-watch-flexy {\r\n        flex: 1 1 0% !important;\r\n        min-width: 0 !important;\r\n        max-width: none !important;\r\n        width: auto !important;\r\n        margin-right: 24px !important;\r\n    }\r\n\r\n    ytd-watch-flexy:not([theater]):not([fullscreen]) #primary.ytd-watch-flexy #primary-inner {\r\n        width: 100% !important;\r\n        max-width: 100% !important;\r\n    }\r\n\r\n    ytd-watch-flexy:not([theater]):not([fullscreen]) #player.ytd-watch-flexy,\r\n    ytd-watch-flexy:not([theater]):not([fullscreen]) #player-container-outer.ytd-watch-flexy,\r\n    ytd-watch-flexy:not([theater]):not([fullscreen]) #player-container-inner.ytd-watch-flexy,\r\n    ytd-watch-flexy:not([theater]):not([fullscreen]) #player-container.ytd-watch-flexy {\r\n        width: 100% !important;\r\n        max-width: 100% !important;\r\n    }\r\n\r\n    ytd-watch-flexy:not([theater]):not([fullscreen]) #movie_player {\r\n        width: 100% !important;\r\n        height: 100% !important;\r\n    }\r\n\r\n    ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy {\r\n        flex: 0 0 var(--ytd-watch-flexy-sidebar-width, 360px) !important;\r\n        width: var(--ytd-watch-flexy-sidebar-width, 360px) !important;\r\n        min-width: 280px !important;\r\n        max-width: 420px !important;\r\n        margin-right: 0 !important;\r\n        padding-right: 0 !important;\r\n    }\r\n\r\n    ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy #secondary-inner,\r\n    ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy ytd-playlist-panel-renderer,\r\n    ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy #related {\r\n        width: 100% !important;\r\n        max-width: 100% !important;\r\n        box-sizing: border-box !important;\r\n    }\r\n}\r\n\r\n\r\n\r\n\r\n';

  // src/index.js
  init_config();
  init_utils();

  // src/features/index.js
  init_grid();

  // src/features/logo.js
  init_utils();
  init_grid();
  var LOGO_MARK = "M32.1819";
  var logoSVG = '<g><path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"/><path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"/></g><g id="youtube-paths_yt19"><path d="M32.1819 2.10016V18.9002H34.7619V12.9102H35.4519C38.8019 12.9102 40.5619 11.1102 40.5619 7.57016V6.88016C40.5619 3.31016 39.0019 2.10016 35.7219 2.10016H32.1819ZM37.8619 7.63016C37.8619 10.0002 37.1419 11.0802 35.4019 11.0802H34.7619V3.95016H35.4519C37.4219 3.95016 37.8619 4.76016 37.8619 7.13016V7.63016Z"/><path d="M41.982 18.9002H44.532V10.0902C44.952 9.37016 45.992 9.05016 47.302 9.32016L47.462 6.33016C47.292 6.31016 47.142 6.29016 47.002 6.29016C45.802 6.29016 44.832 7.20016 44.342 8.86016H44.162L43.952 6.54016H41.982V18.9002H41.982V18.9002Z"/><path d="M55.7461 11.5002C55.7461 8.52016 55.4461 6.31016 52.0161 6.31016C48.7861 6.31016 48.0661 8.46016 48.0661 11.6202V13.7902C48.0661 16.8702 48.7261 19.1102 51.9361 19.1102C54.4761 19.1102 55.7861 17.8402 55.6361 15.3802L53.3861 15.2602C53.3561 16.7802 53.0061 17.4002 51.9961 17.4002C50.7261 17.4002 50.6661 16.1902 50.6661 14.3902V13.5502H55.7461V11.5002ZM51.9561 7.97016C53.1761 7.97016 53.2661 9.12016 53.2661 11.0702V12.0802H50.6661V11.0702C50.6661 9.14016 50.7461 7.97016 51.9561 7.97016Z"/><path d="M60.1945 18.9002V8.92016C60.5745 8.39016 61.1945 8.07016 61.7945 8.07016C62.5645 8.07016 62.8445 8.61016 62.8445 9.69016V18.9002H65.5045L65.4845 8.93016C65.8545 8.37016 66.4845 8.04016 67.1045 8.04016C67.7745 8.04016 68.1445 8.61016 68.1445 9.69016V18.9002H70.8045V9.49016C70.8045 7.28016 70.0145 6.27016 68.3445 6.27016C67.1845 6.27016 66.1945 6.69016 65.2845 7.67016C64.9045 6.76016 64.1545 6.27016 63.0845 6.27016C61.8745 6.27016 60.7345 6.79016 59.9345 7.76016H59.7845L59.5945 6.54016H57.5445V18.9002H60.1945Z"/><path d="M74.0858 4.97016C74.9858 4.97016 75.4058 4.67016 75.4058 3.43016C75.4058 2.27016 74.9558 1.91016 74.0858 1.91016C73.2058 1.91016 72.7758 2.23016 72.7758 3.43016C72.7758 4.67016 73.1858 4.97016 74.0858 4.97016ZM72.8658 18.9002H75.3958V6.54016H72.8658V18.9002Z"/><path d="M79.9516 19.0902C81.4116 19.0902 82.3216 18.4802 83.0716 17.3802H83.1816L83.2916 18.9002H85.2816V6.54016H82.6416V16.4702C82.3616 16.9602 81.7116 17.3202 81.1016 17.3202C80.3316 17.3202 80.0916 16.7102 80.0916 15.6902V6.54016H77.4616V15.8102C77.4616 17.8202 78.0416 19.0902 79.9516 19.0902Z"/><path d="M90.0031 18.9002V8.92016C90.3831 8.39016 91.0031 8.07016 91.6031 8.07016C92.3731 8.07016 92.6531 8.61016 92.6531 9.69016V18.9002H95.3131L95.2931 8.93016C95.6631 8.37016 96.2931 8.04016 96.9131 8.04016C97.5831 8.04016 97.9531 8.61016 97.9531 9.69016V18.9002H100.613V9.49016C100.613 7.28016 99.8231 6.27016 98.1531 6.27016C96.9931 6.27016 96.0031 6.69016 95.0931 7.67016C94.7131 6.76016 93.9631 6.27016 92.8931 6.27016C91.6831 6.27016 90.5431 6.79016 89.7431 7.76016H89.5931L89.4031 6.54016H87.3531V18.9002H90.0031Z"/></g>';
  function buildLogoHtml() {
    return `<svg viewBox="0 0 101 20" width="101" height="20" preserveAspectRatio="xMinYMid meet">${logoSVG}</svg>`;
  }
  function ensurePremiumLogo(logo) {
    if (!logo) return;
    if (logo.closest("ytd-yoodle-renderer") || logo.classList.contains("ytd-yoodle-renderer")) {
      const span = logo.querySelector(".custom-premium-logo");
      if (span) span.remove();
      return;
    }
    if (!logo.closest("ytd-topbar-logo-renderer")) return;
    if (logo.hasAttribute("hidden")) logo.removeAttribute("hidden");
    logo.style.overflow = "visible";
    let parent = logo.parentElement;
    while (parent && parent.tagName.toLowerCase() !== "ytd-topbar-logo-renderer") {
      parent.style.overflow = "visible";
      parent = parent.parentElement;
    }
    let customSpan = logo.querySelector(".custom-premium-logo");
    const logoHtml = buildLogoHtml();
    if (!customSpan) {
      customSpan = document.createElement("span");
      customSpan.className = "custom-premium-logo";
      setElementHTML(customSpan, logoHtml);
      logo.appendChild(customSpan);
      logo.setAttribute("is-red-logo", "");
    } else if (!customSpan.innerHTML.includes(LOGO_MARK)) {
      setElementHTML(customSpan, logoHtml);
    }
  }
  var scheduleLogoScan = rafThrottle((root) => {
    const doc = root && root.ownerDocument || document;
    const renderers = doc.querySelectorAll("ytd-topbar-logo-renderer");
    renderers.forEach((renderer) => {
      const logos = Array.from(renderer.querySelectorAll("ytd-logo")).filter(
        (l) => !l.closest("ytd-yoodle-renderer") && !l.classList.contains("ytd-yoodle-renderer")
      );
      if (logos.length > 0) {
        ensurePremiumLogo(logos[0]);
        for (let i = 1; i < logos.length; i++) {
          const extraSpan = logos[i].querySelector(".custom-premium-logo");
          if (extraSpan) extraSpan.remove();
        }
      }
    });
  });
  function setupLogoObserver() {
    scheduleLogoScan(document);
    const attach = (masthead2) => {
      scheduleLogoScan(masthead2);
      new MutationObserver((mutations) => {
        let shouldScan = false;
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && (node.matches?.("ytd-logo, ytd-topbar-logo-renderer") || node.querySelector?.("ytd-logo"))) {
                shouldScan = true;
              }
            });
          } else if (mutation.type === "attributes") {
            if (mutation.target.matches?.("ytd-logo, ytd-topbar-logo-renderer, #logo")) {
              shouldScan = true;
            }
          }
          if (shouldScan) break;
        }
        if (shouldScan) scheduleLogoScan(masthead2);
      }).observe(masthead2, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden"] });
    };
    const masthead = document.querySelector("ytd-masthead");
    if (masthead) attach(masthead);
    else whenElement("ytd-masthead", attach);
    let retryCount = 0;
    const retryInterval = setInterval(() => {
      retryCount++;
      scheduleLogoScan(document);
      if (retryCount >= 10 && document.querySelector("ytd-topbar-logo-renderer .custom-premium-logo")) {
        clearInterval(retryInterval);
      }
    }, 300);
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest("ytd-topbar-logo-renderer")) return;
    if (isHomeFeedPath()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, true);

  // src/features/index.js
  init_promos();
  init_feedFilter();
  init_mixFilter();
  init_qualityManager();
  init_shoppingFilter();

  // src/player/fullscreenLock.js
  var isWatchLoading = false;
  function setWatchLoading(loading, duration = 0) {
    isWatchLoading = false;
    document.documentElement.classList.remove("ytc-fs-locked");
  }
  function setupFullscreenLock() {
  }

  // src/player/shortcuts.js
  init_config();

  // src/player/autoLive.js
  init_config();
  var autoLiveSyncTimer = null;
  var lastSnapTime = 0;
  var lastUserSeekTime = 0;
  var userIsRewound = false;
  function resetAutoLiveState() {
    userIsRewound = false;
    lastUserSeekTime = 0;
    lastSnapTime = 0;
  }
  function recordUserSeek() {
    lastUserSeekTime = Date.now();
    setTimeout(() => {
      const p = document.querySelector("#movie_player:not(#inline-preview-player)");
      if (!p || !isCurrentlyActiveLive(p)) return;
      const video = p.querySelector("video");
      const delay = getLiveDelay(p, video);
      if (delay > 8) {
        userIsRewound = true;
      } else {
        userIsRewound = false;
      }
    }, 300);
  }
  function snapToLive(player) {
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
    if (!player) player = document.querySelector("#movie_player:not(#inline-preview-player)");
    if (!player) return;
    if (!isCurrentlyActiveLive(player)) return;
    try {
      if (typeof player.seekToStreamTime === "function") {
        player.seekToStreamTime(Infinity);
        return;
      }
      const video = player.querySelector("video");
      if (video && video.seekable && video.seekable.length) {
        const end = video.seekable.end(video.seekable.length - 1);
        if (isFinite(end) && end > 0) {
          video.currentTime = Math.max(0, end - 1);
        }
      }
    } catch (e) {
    }
  }
  function isCurrentlyActiveLive(player) {
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return false;
    if (!player) player = document.querySelector("#movie_player:not(#inline-preview-player)");
    if (!player) return false;
    if (typeof player.getVideoData === "function") {
      const vd = player.getVideoData();
      if (vd) {
        if (vd.isPostLiveDvr === true) return false;
        if (vd.isLive === false && !vd.isLiveDvr) return false;
        if (vd.isLive === true && !vd.isPostLiveDvr) return true;
      }
    }
    if (typeof player.isLive === "function") {
      try {
        const live = player.isLive();
        if (live === false) return false;
        if (live === true) return true;
      } catch (e) {
      }
    }
    const hasLiveClass = player.classList.contains("ytp-live");
    if (!hasLiveClass) {
      return false;
    }
    const liveBadge = player.querySelector(".ytp-live-badge");
    const isBadgeVisible = !!(liveBadge && liveBadge.offsetParent !== null && window.getComputedStyle(liveBadge).display !== "none");
    if (!isBadgeVisible) {
      return false;
    }
    return true;
  }
  function getLiveDelay(player, video) {
    if (!video) return 0;
    if (!isCurrentlyActiveLive(player)) return 0;
    try {
      if (video.seekable && video.seekable.length > 0) {
        const liveEdge = video.seekable.end(video.seekable.length - 1);
        if (isFinite(liveEdge) && isFinite(video.currentTime)) {
          return Math.max(0, liveEdge - video.currentTime);
        }
      }
    } catch (e) {
    }
    return 0;
  }
  function checkLiveSync() {
    if (!currentConfig.autoLiveSync) return;
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
    const player = document.querySelector("#movie_player:not(#inline-preview-player)");
    if (!player) return;
    if (!isCurrentlyActiveLive(player)) {
      return;
    }
    const video = player.querySelector("video");
    if (!video || video.paused || video.ended) return;
    const delay = getLiveDelay(player, video);
    if (userIsRewound) {
      if (delay <= 5) {
        userIsRewound = false;
      } else {
        if (video.playbackRate !== 1) {
          video.playbackRate = 1;
        }
        return;
      }
    }
    if (Date.now() - lastUserSeekTime < 8e3) return;
    const now = Date.now();
    if (delay > 15) {
      if (now - lastSnapTime > 15e3) {
        lastSnapTime = now;
        snapToLive(player);
        if (video.playbackRate !== 1) {
          video.playbackRate = 1;
        }
      }
      return;
    }
    if (delay > 8) {
      if (video.playbackRate !== 1.04) {
        video.playbackRate = 1.04;
      }
      return;
    }
    if (video.playbackRate !== 1) {
      video.playbackRate = 1;
    }
  }
  var initialSnapTimer = null;
  function checkInitialLiveSnap() {
    if (!currentConfig.autoLiveSync) return;
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
    if (initialSnapTimer) {
      clearInterval(initialSnapTimer);
      initialSnapTimer = null;
    }
    let attempts = 0;
    initialSnapTimer = setInterval(() => {
      attempts++;
      const player = document.querySelector("#movie_player:not(#inline-preview-player)");
      if (player) {
        if (typeof player.getVideoData === "function") {
          const vd = player.getVideoData();
          if (vd && (vd.isPostLiveDvr === true || vd.isLive === false && !vd.isLiveDvr)) {
            clearInterval(initialSnapTimer);
            initialSnapTimer = null;
            return;
          }
        }
        if (isCurrentlyActiveLive(player)) {
          const video = player.querySelector("video");
          if (video && !video.paused) {
            const delay = getLiveDelay(player, video);
            if (!userIsRewound && delay > 30) {
              clearInterval(initialSnapTimer);
              initialSnapTimer = null;
              lastSnapTime = Date.now();
              snapToLive(player);
              return;
            }
            if (delay <= 30) {
              clearInterval(initialSnapTimer);
              initialSnapTimer = null;
              return;
            }
          }
        }
      }
      if (attempts >= 15) {
        clearInterval(initialSnapTimer);
        initialSnapTimer = null;
      }
    }, 500);
  }
  function initAutoLiveSync() {
    if (autoLiveSyncTimer) return;
    autoLiveSyncTimer = setInterval(checkLiveSync, 3e3);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && currentConfig.autoLiveSync) {
        setTimeout(checkLiveSync, 1e3);
      }
    });
    document.addEventListener("click", (e) => {
      if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
      if (e.target && e.target.closest && e.target.closest(".ytp-live-badge")) {
        const player = document.querySelector("#movie_player:not(#inline-preview-player)");
        if (player) {
          userIsRewound = false;
          lastUserSeekTime = 0;
          lastSnapTime = Date.now();
          snapToLive(player);
        }
      }
      if (e.target && e.target.closest && e.target.closest(".ytp-progress-bar")) {
        const player = document.querySelector("#movie_player:not(#inline-preview-player)");
        if (!player || !isCurrentlyActiveLive(player)) return;
        recordUserSeek();
      }
    }, true);
    document.addEventListener("yt-navigate-start", resetAutoLiveState);
    document.addEventListener("yt-navigate-finish", () => {
      resetAutoLiveState();
      checkInitialLiveSnap();
    });
  }

  // src/player/shortcuts.js
  function triggerCleanSeek(player) {
  }
  function getPlayerVideo(player) {
    return player.querySelector("video.html5-main-video") || player.querySelector("video");
  }
  function changeVolume(player, delta) {
    if (!player) return;
    try {
      if (delta > 0 && typeof player.volumeUp === "function") {
        player.volumeUp();
        if (typeof player.unMute === "function" && player.isMuted?.()) player.unMute();
        return;
      } else if (delta < 0 && typeof player.volumeDown === "function") {
        player.volumeDown();
        return;
      }
    } catch (e) {
    }
    try {
      if (typeof player.getVolume === "function" && typeof player.setVolume === "function") {
        const cur = player.getVolume();
        const next = Math.max(0, Math.min(100, cur + delta));
        player.setVolume(next);
        if (delta > 0 && typeof player.unMute === "function" && player.isMuted?.()) player.unMute();
        return;
      }
    } catch (e) {
    }
    const video = getPlayerVideo(player);
    if (video) {
      video.volume = Math.max(0, Math.min(1, video.volume + delta / 100));
    }
  }
  function isPlayerFullscreen(player) {
    if (!player) return false;
    const fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fs) return false;
    return player.classList.contains("ytp-fullscreen") || typeof player.isFullscreen === "function" && player.isFullscreen();
  }
  function canUseAsdKeys(player) {
    if (!player) return false;
    return isPlayerFullscreen(player) || player.matches(":hover");
  }
  function dispatchYtSeek(key) {
    const keyCode = key === "j" ? 74 : key === "l" ? 76 : key === "k" ? 75 : 0;
    const code = key === "j" ? "KeyJ" : key === "l" ? "KeyL" : key === "k" ? "KeyK" : "";
    const evDown = new KeyboardEvent("keydown", {
      key,
      code,
      keyCode,
      which: keyCode,
      charCode: keyCode,
      bubbles: true,
      cancelable: true,
      composed: true
    });
    evDown._ytcDispatched = true;
    const evUp = new KeyboardEvent("keyup", {
      key,
      code,
      keyCode,
      which: keyCode,
      charCode: keyCode,
      bubbles: true,
      cancelable: true,
      composed: true
    });
    evUp._ytcDispatched = true;
    const player = document.querySelector("#movie_player:not(#inline-preview-player)");
    const target = player || window;
    target.dispatchEvent(evDown);
    target.dispatchEvent(evUp);
  }
  var keysBound = false;
  function bindGlobalKeys() {
    if (keysBound) return;
    keysBound = true;
    const handleKeyDown = (e) => {
      if (e._ytcDispatched) return;
      if (!currentConfig.keyboardControls) return;
      if (e.isComposing || e.keyCode === 229) return;
      const target = e.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      const code = e.code || "";
      const isNumpad = e.location === 3 || code.startsWith("Numpad") || e.keyCode >= 96 && e.keyCode <= 111 || e.keyCode === 12;
      const isVolumeAction = isNumpad && (code === "Numpad8" || e.key === "8" || e.key === "ArrowUp" || e.keyCode === 104 || e.keyCode === 38 || code === "Numpad2" || e.key === "2" || e.key === "ArrowDown" || e.keyCode === 98 || e.keyCode === 40);
      if (e.repeat && !isVolumeAction) {
        return;
      }
      const player = document.querySelector("#movie_player");
      const asdAllowed = canUseAsdKeys(player);
      let captured = false;
      let isSeekAction = false;
      if (isNumpad) {
        captured = true;
        if (code === "Numpad8" || e.key === "8" || e.key === "ArrowUp" || e.keyCode === 104 || e.keyCode === 38) {
          if (player) changeVolume(player, 5);
        } else if (code === "Numpad2" || e.key === "2" || e.key === "ArrowDown" || e.keyCode === 98 || e.keyCode === 40) {
          if (player) changeVolume(player, -5);
        } else if (code === "Numpad4" || e.key === "4" || e.key === "ArrowLeft" || e.keyCode === 100 || e.keyCode === 37) {
          dispatchYtSeek("j");
          isSeekAction = true;
        } else if (code === "Numpad6" || e.key === "6" || e.key === "ArrowRight" || e.keyCode === 102 || e.keyCode === 39) {
          dispatchYtSeek("l");
          isSeekAction = true;
        } else if (code === "Numpad5" || e.key === "5" || e.key === "Clear" || e.keyCode === 101 || e.keyCode === 12) {
          dispatchYtSeek("k");
        }
      } else if (asdAllowed && code === "KeyA") {
        captured = true;
        dispatchYtSeek("j");
        isSeekAction = true;
      } else if (asdAllowed && code === "KeyS") {
        captured = true;
        dispatchYtSeek("k");
      } else if (asdAllowed && code === "KeyD") {
        captured = true;
        dispatchYtSeek("l");
        isSeekAction = true;
      }
      if (captured) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      } else if (["ArrowLeft", "ArrowRight", "j", "l", "J", "L"].includes(e.key)) {
        isSeekAction = true;
      }
      if (isSeekAction && player) {
        recordUserSeek();
        triggerCleanSeek(player);
      }
    };
    const handleKeyUp = (e) => {
      if (e._ytcDispatched) return;
      if (!currentConfig.keyboardControls) return;
      const target = e.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      const code = e.code || "";
      const isNumpad = e.location === 3 || code.startsWith("Numpad") || e.keyCode >= 96 && e.keyCode <= 111 || e.keyCode === 12;
      if (isNumpad) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
  }

  // src/player/liveDvr.js
  init_config();
  var liveDvrHooked = false;
  var MAX_DVR_SECS = 43200 * 14;
  function isStreamOver12h(microformat) {
    const live = microformat?.playerMicroformatRenderer?.liveBroadcastDetails;
    if (!live || !live.startTimestamp) return false;
    const seconds = (Date.now() - new Date(live.startTimestamp).getTime()) / 1e3;
    return seconds > 43200;
  }
  function modifyPlayerResponse(pr) {
    if (!pr || typeof pr !== "object") return;
    const { videoDetails, playerConfig, streamingData, microformat } = pr;
    if (!videoDetails || !videoDetails.isLive) return;
    videoDetails.isLiveDvrEnabled = true;
    const mc = playerConfig?.mediaCommonConfig;
    if (mc) {
      mc.useServerDrivenAbr = false;
      if (mc.serverPlaybackStartConfig) {
        mc.serverPlaybackStartConfig.enable = false;
      }
    }
    if (streamingData) {
      if (streamingData.serverAbrStreamingUrl && (streamingData.hlsManifestUrl || streamingData.dashManifestUrl)) {
        delete streamingData.serverAbrStreamingUrl;
      }
      if (Array.isArray(streamingData.adaptiveFormats) && isStreamOver12h(microformat)) {
        for (const format of streamingData.adaptiveFormats) {
          format.maxDvrDurationSec = MAX_DVR_SECS;
        }
      }
    }
  }
  function patchResponse(data) {
    if (!currentConfig.unlockLiveDvr || !data || typeof data !== "object") return false;
    if (data.videoDetails) {
      modifyPlayerResponse(data);
      return true;
    }
    if (data.playerResponse && data.playerResponse.videoDetails) {
      modifyPlayerResponse(data.playerResponse);
      return true;
    }
    return false;
  }
  function initLiveDvrHook() {
    if (liveDvrHooked) return;
    liveDvrHooked = true;
    try {
      const existingDesc = Object.getOwnPropertyDescriptor(window, "ytInitialPlayerResponse");
      let _val = window.ytInitialPlayerResponse;
      if (_val) patchResponse(_val);
      if (existingDesc && existingDesc.configurable === false) {
        if (window.ytInitialPlayerResponse) patchResponse(window.ytInitialPlayerResponse);
      } else {
        Object.defineProperty(window, "ytInitialPlayerResponse", {
          get() {
            return existingDesc && existingDesc.get ? existingDesc.get.call(this) : _val;
          },
          set(newVal) {
            if (existingDesc && existingDesc.set) {
              existingDesc.set.call(this, newVal);
            }
            _val = newVal;
            patchResponse(_val);
          },
          configurable: true,
          enumerable: true
        });
      }
    } catch (e) {
    }
    try {
      const origParse = JSON.parse;
      JSON.parse = function(text, reviver) {
        const res = origParse.call(this, text, reviver);
        if (currentConfig.unlockLiveDvr && typeof text === "string" && text.length > 100 && text.indexOf("isLiveDvrEnabled") !== -1) {
          try {
            patchResponse(res);
          } catch (e) {
          }
        }
        return res;
      };
    } catch (e) {
    }
  }

  // src/player/timeLock.js
  init_config();
  var timeLockInitialized = false;
  var isProgrammaticFix = false;
  var lastCorrectionTime = 0;
  function normalizeTimeDisplay() {
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
    const now = Date.now();
    if (now - lastCorrectionTime < 400) return;
    const player = document.querySelector("#movie_player:not(#inline-preview-player)");
    if (!player) return;
    if (player.classList.contains("ytp-live") || player.querySelector(".ytp-live-badge")) return;
    const currentEl = player.querySelector(".ytp-time-current");
    if (!currentEl) return;
    const text = (currentEl.textContent || "").trim();
    if (text.startsWith("-") || text.startsWith("−")) {
      lastCorrectionTime = now;
      isProgrammaticFix = true;
      const timeBtn = player.querySelector("button.ytp-time-display, .ytp-time-display button, .ytp-time-display") || currentEl;
      try {
        timeBtn.click();
      } catch (e) {
      }
      setTimeout(() => {
        isProgrammaticFix = false;
      }, 60);
    }
  }
  function initTimeLock() {
    if (timeLockInitialized) return;
    timeLockInitialized = true;
    document.addEventListener("click", (e) => {
      if (e.target && e.target.closest && e.target.closest(".ytp-live-badge")) return;
      const timeDisplay = e.target.closest && e.target.closest(".ytp-time-display");
      if (!timeDisplay) return;
      if (isProgrammaticFix) return;
      const player = document.querySelector("#movie_player:not(#inline-preview-player)");
      if (player && (player.classList.contains("ytp-live") || player.querySelector(".ytp-live-badge"))) return;
      setTimeout(normalizeTimeDisplay, 60);
    }, false);
    document.addEventListener("yt-navigate-finish", () => {
      setTimeout(normalizeTimeDisplay, 150);
      setTimeout(normalizeTimeDisplay, 500);
      setTimeout(normalizeTimeDisplay, 1200);
    });
    document.addEventListener("play", (e) => {
      if (e.target && e.target.tagName === "VIDEO") {
        setTimeout(normalizeTimeDisplay, 100);
      }
    }, true);
  }

  // src/player/index.js
  init_ambientLight();
  init_autoSubtitles();

  // src/index.js
  init_chat();

  // src/ui/index.js
  init_sync();
  init_notifier();

  // src/ui/panel.js
  init_config();
  init_utils();
  init_constants();
  init_sync();
  init_notifier();
  var menuDismissBound = false;
  function bindGlobalMenuDismiss() {
    if (menuDismissBound) return;
    menuDismissBound = true;
    document.addEventListener("click", (e) => {
      const panel = document.getElementById("ytc-settings-panel");
      if (panel && panel.classList.contains("open")) {
        if (!e.target.closest("#ytc-settings-panel") && !e.target.closest("#ytc-settings-btn")) {
          panel.classList.remove("open");
        }
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const panel = document.getElementById("ytc-settings-panel");
        if (panel && panel.classList.contains("open")) {
          panel.classList.remove("open");
        }
      }
    });
    window.addEventListener("resize", () => {
      const panel = document.getElementById("ytc-settings-panel");
      const btn = document.getElementById("ytc-settings-btn");
      if (panel && panel.classList.contains("open") && btn) {
        const rect = btn.getBoundingClientRect();
        panel.style.top = rect.bottom + 8 + "px";
        panel.style.right = Math.max(12, window.innerWidth - rect.right - 10) + "px";
      }
    }, { passive: true });
  }
  function createSettingsPanel() {
    let panel = document.getElementById("ytc-settings-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "ytc-settings-panel";
      setElementHTML(panel, `
            <div class="ytc-header">
                <span>YouTube Customizer</span>
                <span class="ytc-header-badge">v${APP_VERSION}</span>
            </div>

            <div class="ytc-tabs">
                <button class="ytc-tab-btn active" data-tab="layout" title="Bố cục & Giao diện">
                    ${LAYOUT_TAB_SVG}
                    <span>Giao diện</span>
                </button>
                <button class="ytc-tab-btn" data-tab="filter" title="Lọc nội dung sạch">
                    ${SHIELD_TAB_SVG}
                    <span>Lọc</span>
                </button>
                <button class="ytc-tab-btn" data-tab="player" title="Trình phát & Video">
                    ${PLAYER_TAB_SVG}
                    <span>Trình phát</span>
                </button>
                <button class="ytc-tab-btn" data-tab="optimize" title="Tối ưu hiệu năng, RAM & GPU">
                    ${OPTIMIZE_TAB_SVG}
                    <span>Tối Ưu</span>
                </button>
                <button class="ytc-tab-btn" data-tab="info" title="Thông tin tiện ích & Tác giả">
                    ${INFO_TAB_SVG}
                    <span>Thông tin</span>
                </button>
            </div>

            <!-- TAB 1: GIAO DIỆN & BỐ CỤC -->
            <div class="ytc-tab-pane active" id="ytc-pane-layout">
                <div class="ytc-item" id="ytc-row-cols" title="Tùy chỉnh số cột video hiển thị trên trang chủ và kênh">
                    <div class="ytc-item-left">
                        ${GRID_SVG}
                        <span>Số cột trang chủ</span>
                    </div>
                    <div class="ytc-cols-group">
                        <button class="ytc-col-btn ${currentConfig.columns === 3 ? "active" : ""}" data-cols="3" title="Hiển thị 3 cột">3</button>
                        <button class="ytc-col-btn ${currentConfig.columns === 4 ? "active" : ""}" data-cols="4" title="Hiển thị 4 cột">4</button>
                        <button class="ytc-col-btn ${currentConfig.columns === 5 ? "active" : ""}" data-cols="5" title="Hiển thị 5 cột">5</button>
                    </div>
                </div>

                <div class="ytc-item" data-toggle="premiumLogo" title="Thay thế logo YouTube thường bằng logo YouTube Premium kèm mã quốc gia">
                    <div class="ytc-item-left">
                        ${YOUTUBE_SVG}
                        <span>Logo Premium</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-logo">
                        <input type="checkbox" id="ytc-chk-logo" name="premiumLogo" aria-label="Logo Premium" ${currentConfig.premiumLogo ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="unlockLiveDvr" title="Mở khóa tua lùi thời gian trên các luồng Live Stream bị chủ kênh cấm tua">
                    <div class="ytc-item-left">
                        ${REWIND_SVG}
                        <span>Mở khóa tua Live Stream</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-livedvr">
                        <input type="checkbox" id="ytc-chk-livedvr" name="unlockLiveDvr" aria-label="Mở khóa tua Live Stream" ${currentConfig.unlockLiveDvr ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="autoLiveSync" title="Tự động giữ mốc trực tiếp khi xem Live Stream, chống trễ hình khi mạng lag hoặc chuyển tab">
                    <div class="ytc-item-left">
                        ${RADIO_SVG}
                        <span>Tự động trực tiếp (Auto Live)</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-autolive">
                        <input type="checkbox" id="ytc-chk-autolive" name="autoLiveSync" aria-label="Tự động trực tiếp (Auto Live)" ${currentConfig.autoLiveSync ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>


                <div class="ytc-item" data-toggle="ambientLighting" title="Hiệu ứng ánh sáng phòng (Ambilight) phản chiếu theo màu video cực đẹp, tự động tối ưu phần cứng siêu nhẹ">
                    <div class="ytc-item-left">
                        ${AMBIENT_LIGHT_SVG}
                        <span>Ánh sáng phòng (Ambilight)<span class="ytc-star-badge" title="Tính năng đặc biệt nổi bật">⭐</span></span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-ambient-light">
                        <input type="checkbox" id="ytc-chk-ambient-light" name="ambientLighting" aria-label="Ánh sáng phòng (Ambilight)" ${currentConfig.ambientLighting ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="autoSubtitles" title="Tự động kích hoạt phụ đề cho video và Live Stream, dùng font chữ & khung nền người dùng cài đặt trên YouTube">
                    <div class="ytc-item-left">
                        ${SUBTITLES_SVG}
                        <span>Phụ đề tự động (Auto Subtitles)</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-auto-subtitles">
                        <input type="checkbox" id="ytc-chk-auto-subtitles" name="autoSubtitles" aria-label="Phụ đề tự động" ${currentConfig.autoSubtitles ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item ytc-sub-item" id="ytc-row-captionlang" style="display: ${currentConfig.autoSubtitles ? "flex" : "none"};" title="Ngôn ngữ ưu tiên ghim lên đầu menu phụ đề và tự động dịch">
                    <div class="ytc-item-left">
                        <span class="ytc-sub-bullet">└</span>
                        <span class="ytc-sub-label">Ngôn ngữ ưu tiên</span>
                    </div>
                    <select id="ytc-select-captionlang" class="ytc-select" aria-label="Ngôn ngữ phụ đề ưu tiên">
                        <option value="auto" ${currentConfig.captionLanguage === "auto" ? "selected" : ""}>Tự động (Theo YouTube)</option>
                        <option value="vi" ${currentConfig.captionLanguage === "vi" ? "selected" : ""}>Tiếng Việt</option>
                        <option value="en" ${currentConfig.captionLanguage === "en" ? "selected" : ""}>Tiếng Anh (English)</option>
                        <option value="ja" ${currentConfig.captionLanguage === "ja" ? "selected" : ""}>Tiếng Nhật (日本語)</option>
                        <option value="ko" ${currentConfig.captionLanguage === "ko" ? "selected" : ""}>Tiếng Hàn (한국어)</option>
                        <option value="zh" ${currentConfig.captionLanguage === "zh" ? "selected" : ""}>Tiếng Trung (中文)</option>
                        <option value="fr" ${currentConfig.captionLanguage === "fr" ? "selected" : ""}>Tiếng Pháp (Français)</option>
                        <option value="es" ${currentConfig.captionLanguage === "es" ? "selected" : ""}>Tiếng Tây Ban Nha (Español)</option>
                        <option value="de" ${currentConfig.captionLanguage === "de" ? "selected" : ""}>Tiếng Đức (Deutsch)</option>
                        <option value="ru" ${currentConfig.captionLanguage === "ru" ? "selected" : ""}>Tiếng Nga (Русский)</option>
                    </select>
                </div>

                <div class="ytc-item" id="ytc-row-chatoverlay" title="Hiển thị chat trực tiếp nổi trên màn hình video (tự động ẩn khi tua lùi video)">
                    <div class="ytc-item-left">
                        ${MESSAGE_SVG}
                        <span>Live Chat</span>
                    </div>
                    <div class="ytc-mode-group">
                        <button class="ytc-mode-btn ${!currentConfig.chatOverlay || currentConfig.chatOverlay === "off" ? "active" : ""}" data-overlay="off" title="Tắt chat trên video">Tắt</button>
                        <button class="ytc-mode-btn ${currentConfig.chatOverlay === "danmaku" ? "active" : ""}" data-overlay="danmaku" title="Chữ chạy ngang màn hình dạng Danmaku">Ngang</button>
                        <button class="ytc-mode-btn ${currentConfig.chatOverlay === "streamer" ? "active" : ""}" data-overlay="streamer" title="Khung chat nổi của streamer, kéo thả và co giãn tự do">Nổi</button>
                    </div>
                </div>
            </div>

            <!-- TAB 2: LỌC NỘI DUNG SẠCH -->
            <div class="ytc-tab-pane" id="ytc-pane-filter">
                <div class="ytc-item" data-toggle="hideShorts" title="Ẩn toàn bộ video ngắn Shorts trên trang chủ, đăng ký và thanh menu">
                    <div class="ytc-item-left">
                        ${SHORTS_SVG}
                        <span>Ẩn mục Shorts</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-shorts">
                        <input type="checkbox" id="ytc-chk-shorts" name="hideShorts" aria-label="Ẩn mục Shorts" ${currentConfig.hideShorts ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hidePlayables" title="Ẩn mục trò chơi Playables trên trang chủ và thanh menu">
                    <div class="ytc-item-left">
                        ${GAMEPAD_SVG}
                        <span>Ẩn mục Chơi game</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-playables">
                        <input type="checkbox" id="ytc-chk-playables" name="hidePlayables" aria-label="Ẩn mục Chơi game" ${currentConfig.hidePlayables ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideMembersOnly" title="Ẩn video dành riêng cho hội viên và video ưu tiên xem trước">
                    <div class="ytc-item-left">
                        ${CROWN_SVG}
                        <span>Ẩn video Hội viên</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-members">
                        <input type="checkbox" id="ytc-chk-members" name="hideMembersOnly" aria-label="Ẩn video Hội viên" ${currentConfig.hideMembersOnly ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideCommunity" title="Ẩn bài viết, khảo sát và hình ảnh bài đăng cộng đồng trên feed">
                    <div class="ytc-item-left">
                        ${POST_SVG}
                        <span>Ẩn bài đăng cộng đồng</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-community">
                        <input type="checkbox" id="ytc-chk-community" name="hideCommunity" aria-label="Ẩn bài đăng cộng đồng" ${currentConfig.hideCommunity ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="cleanSearch" title="Ẩn video được tài trợ và quảng cáo khi tìm kiếm trên YouTube">
                    <div class="ytc-item-left">
                        ${SEARCH_SVG}
                        <span>Lọc tìm kiếm sạch</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-search">
                        <input type="checkbox" id="ytc-chk-search" name="cleanSearch" aria-label="Lọc tìm kiếm sạch" ${currentConfig.cleanSearch ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideExploreTopics" title="Ẩn kệ Khám phá các chủ đề khác chen giữa video trang chủ">
                    <div class="ytc-item-left">
                        ${COMPASS_SVG}
                        <span>Ẩn Khám phá chủ đề</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-explore">
                        <input type="checkbox" id="ytc-chk-explore" name="hideExploreTopics" aria-label="Ẩn Khám phá chủ đề" ${currentConfig.hideExploreTopics ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideShopping" title="Ẩn bảng Sản phẩm (Shopping), nút túi xách mua sắm trên video và kệ sản phẩm gắn thẻ">
                    <div class="ytc-item-left">
                        ${SHOPPING_SVG}
                        <span>Ẩn sản phẩm gắn thẻ</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-shopping">
                        <input type="checkbox" id="ytc-chk-shopping" name="hideShopping" aria-label="Ẩn sản phẩm gắn thẻ" ${currentConfig.hideShopping ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideMixes" title="Ẩn toàn bộ Danh sách kết hợp (Mixes/Radio) và Danh sách phát (Playlists) trên trang chủ, tìm kiếm, gợi ý và tự động chuyển tiếp video đề xuất khi xem">
                    <div class="ytc-item-left">
                        ${PLAYLIST_SVG}
                        <span>Ẩn Danh sách phát & Mix</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-mixes">
                        <input type="checkbox" id="ytc-chk-mixes" name="hideMixes" aria-label="Ẩn Danh sách phát & Mix" ${currentConfig.hideMixes ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 3: TRÌNH PHÁT & VIDEO -->
            <div class="ytc-tab-pane" id="ytc-pane-player">
                <div class="ytc-item" data-toggle="hideEndscreen" title="Ẩn khung gợi ý video cuối clip và biểu tượng thẻ chữ (i) góc trên">
                    <div class="ytc-item-left">
                        ${ENDSCREEN_SVG}
                        <span>Ẩn thẻ kết thúc/chú thích</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-endscreen">
                        <input type="checkbox" id="ytc-chk-endscreen" name="hideEndscreen" aria-label="Ẩn thẻ kết thúc/chú thích" ${currentConfig.hideEndscreen ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideWatermark" title="Ẩn logo hình mờ hoặc avatar kênh ở góc dưới cùng bên phải video">
                    <div class="ytc-item-left">
                        ${WATERMARK_SVG}
                        <span>Ẩn logo góc video</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-watermark">
                        <input type="checkbox" id="ytc-chk-watermark" name="hideWatermark" aria-label="Ẩn logo góc video" ${currentConfig.hideWatermark ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="autoDismissPromos" title="Tự động tắt banner Premium, khảo sát và thông báo sự cố gián đoạn phiền toái">
                    <div class="ytc-item-left">
                        ${BELL_OFF_SVG}
                        <span>Tự đóng banner & thông báo</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-promos">
                        <input type="checkbox" id="ytc-chk-promos" name="autoDismissPromos" aria-label="Tự đóng banner & thông báo" ${currentConfig.autoDismissPromos ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideNativeLiveChat" title="Tự động tắt khung trò chuyện khi mới mở video (người dùng vẫn có thể bấm mở lại bình thường, Live Chat Overlay vẫn chạy ngầm nếu bật)">
                    <div class="ytc-item-left">
                        ${CHAT_OFF_SVG}
                        <span>Tắt trò chuyện trực tiếp</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-hidenativechat">
                        <input type="checkbox" id="ytc-chk-hidenativechat" name="hideNativeLiveChat" aria-label="Tắt trò chuyện trực tiếp" ${currentConfig.hideNativeLiveChat ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideChatEmojis" title="Ẩn biểu tượng cảm xúc (emoji/sticker) trong Live Chat: cmt chỉ có icon sẽ ẩn hẳn, cmt có chữ sẽ chỉ hiện chữ">
                    <div class="ytc-item-left">
                        ${EMOJI_OFF_SVG}
                        <span>Ẩn biểu tượng trong Live Chat</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-hidechatemojis">
                        <input type="checkbox" id="ytc-chk-hidechatemojis" name="hideChatEmojis" aria-label="Ẩn biểu tượng trong Live Chat" ${currentConfig.hideChatEmojis ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item ytc-item-link" id="ytc-btn-ublock" title="Mở trang tiện ích uBlock Origin — trình chặn quảng cáo số 1 thế giới, sạch sẽ, an toàn và không gây giật lag">
                    <div class="ytc-item-left">
                        ${SHIELD_CHECK_SVG}
                        <span>Chặn quảng cáo (uBlock)</span>
                    </div>
                    <div class="ytc-link-badge">
                        <span>Mở trang</span>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                    </div>
                </div>
            </div>

            <!-- TAB 4: TỐI ƯU HIỆU NĂNG & TIỆN ÍCH -->
            <div class="ytc-tab-pane" id="ytc-pane-optimize">
                <div class="ytc-item ytc-item-vertical" id="ytc-row-quality" title="Ưu tiên tự động chọn độ phân giải theo ý muốn (Mặc định: Tự động của YouTube)">
                    <div class="ytc-item-header">
                        <div class="ytc-item-left">
                            ${QUALITY_SVG}
                            <span>Độ phân giải video</span>
                        </div>
                        <span class="ytc-quality-badge">${currentConfig.preferredQuality === "auto" ? "TỰ ĐỘNG" : currentConfig.preferredQuality === "max" ? "CAO NHẤT" : currentConfig.preferredQuality.toUpperCase()}</span>
                    </div>
                    <div class="ytc-mode-group ytc-quality-group">
                        <button class="ytc-quality-btn ${!currentConfig.preferredQuality || currentConfig.preferredQuality === "auto" ? "active" : ""}" data-quality="auto" title="Để YouTube tự động quyết định">Tự động</button>
                        <button class="ytc-quality-btn ${currentConfig.preferredQuality === "max" ? "active" : ""}" data-quality="max" title="Ưu tiên độ phân giải cao nhất khả dụng (4K, 2K...)">Cao nhất</button>
                        <button class="ytc-quality-btn ${currentConfig.preferredQuality === "1440p" ? "active" : ""}" data-quality="1440p" title="Ưu tiên 2K (1440p)">2K</button>
                        <button class="ytc-quality-btn ${currentConfig.preferredQuality === "1080p" ? "active" : ""}" data-quality="1080p" title="Ưu tiên Full HD (1080p)">1080p</button>
                        <button class="ytc-quality-btn ${currentConfig.preferredQuality === "720p" ? "active" : ""}" data-quality="720p" title="Ưu tiên HD (720p)">720p</button>
                    </div>
                </div>

                <div class="ytc-item" data-toggle="preventAutoPause" title="Tự động xác nhận hộp thoại 'Video đã tạm dừng. Bạn vẫn đang xem chứ?' và duy trì trạng thái hoạt động để phát nhạc/video liên tục">
                    <div class="ytc-item-left">
                        ${INFINITY_SVG}
                        <span>Chặn tự dừng video</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-autopause">
                        <input type="checkbox" id="ytc-chk-autopause" name="preventAutoPause" aria-label="Chặn tự dừng video" ${currentConfig.preventAutoPause ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="chatMemoryGc" title="Giới hạn tối đa 100 tin nhắn trong DOM Live Chat, dọn dẹp bộ nhớ định kỳ chống đầy tràn RAM khi xem stream lâu">
                    <div class="ytc-item-left">
                        ${BROOM_SVG}
                        <span>Dọn rác bộ nhớ Live Chat</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-chatgc">
                        <input type="checkbox" id="ytc-chk-chatgc" name="chatMemoryGc" aria-label="Dọn rác bộ nhớ Live Chat" ${currentConfig.chatMemoryGc ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="keyboardControls" title="Phím tắt: A/D hoặc 4/6 tua 10s, S hoặc 5 dừng/phát, 8/2 âm lượng (chặn nhảy % khi bật NumLock)">
                    <div class="ytc-item-left">
                        ${KEYBOARD_SVG}
                        <span>Phím tắt (A-S-D, Numpad)</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-keys">
                        <input type="checkbox" id="ytc-chk-keys" name="keyboardControls" aria-label="Phím tắt điều khiển" ${currentConfig.keyboardControls ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="audioOnlyMode" title="Chế độ Radio: Tắt hoàn toàn render hình ảnh video, hạ chất lượng tối thiểu để chỉ nghe tiếng, giảm tối đa RAM/GPU">
                    <div class="ytc-item-left">
                        ${HEADPHONES_SVG}
                        <span>Chỉ phát âm thanh (Radio)</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-audioonly">
                        <input type="checkbox" id="ytc-chk-audioonly" name="audioOnlyMode" aria-label="Chỉ phát âm thanh" ${currentConfig.audioOnlyMode ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="blockAv1" title="Chặn codec AV1 ngốn CPU, ép dùng bộ giải mã phần cứng H.264 & VP9 mượt mà, mát máy">
                    <div class="ytc-item-left">
                        ${CPU_SVG}
                        <span>Chặn AV1 / Ép Codec H.264</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-blockav1">
                        <input type="checkbox" id="ytc-chk-blockav1" name="blockAv1" aria-label="Chặn AV1 / Ép Codec H.264" ${currentConfig.blockAv1 ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 5: THÔNG TIN & HỖ TRỢ -->
            <div class="ytc-tab-pane" id="ytc-pane-info">
                <!-- Thông tin nhà phát triển -->
                <div class="ytc-item ytc-item-link" id="ytc-btn-dev" title="Ghé thăm website cá nhân của Huy Vũ">
                    <div class="ytc-item-left">
                        ${USER_SVG}
                        <div class="ytc-item-text-group">
                            <span class="ytc-item-main-text">Huy Vũ</span>
                            <span class="ytc-item-sub-text">huyvu2512.io.vn • Tác giả</span>
                        </div>
                    </div>
                    <div class="ytc-link-badge">
                        <span>Website</span>
                        ${EXTERNAL_LINK_SVG}
                    </div>
                </div>

                <!-- Báo cáo sự cố / Góp ý -->
                <div class="ytc-item ytc-item-link" id="ytc-btn-report" title="Báo lỗi hoặc đề xuất tính năng mới trên GitHub Issues">
                    <div class="ytc-item-left">
                        ${BUG_SVG}
                        <div class="ytc-item-text-group">
                            <span class="ytc-item-main-text">Báo cáo & Góp ý</span>
                            <span class="ytc-item-sub-text">Báo lỗi hoặc đề xuất ý tưởng</span>
                        </div>
                    </div>
                    <div class="ytc-link-badge">
                        <span>Báo cáo</span>
                        ${EXTERNAL_LINK_SVG}
                    </div>
                </div>

                <!-- Tặng quà / Ủng hộ -->
                <div class="ytc-item ytc-item-link" id="ytc-btn-donate" title="Ủng hộ tác giả 1 ly cà phê tiếp thêm động lực">
                    <div class="ytc-item-left">
                        ${GIFT_SVG}
                        <div class="ytc-item-text-group">
                            <span class="ytc-item-main-text">Tặng quà & Ủng hộ</span>
                            <span class="ytc-item-sub-text">Ủng hộ 1 ly cà phê tiếp thêm động lực</span>
                        </div>
                    </div>
                    <div class="ytc-link-badge">
                        <span>Ủng hộ</span>
                        ${EXTERNAL_LINK_SVG}
                    </div>
                </div>

                <!-- Thẻ kiểm tra cập nhật tinh gọn -->
                <div class="ytc-info-card">
                    <div class="ytc-info-title-wrap">
                        <span class="ytc-info-title">Kiểm tra cập nhật</span>
                    </div>
                    <button class="ytc-update-btn" id="ytc-btn-update" title="Kiểm tra bản cập nhật mới nhất từ GitHub">
                        ${UPDATE_SVG}
                        <span id="ytc-update-btn-text">Kiểm tra</span>
                    </button>
                </div>

                <!-- Công tắc gạt Tự động cập nhật -->
                <div class="ytc-item" data-toggle="autoUpdate" title="Tự động gọi API kiểm tra phiên bản mới mỗi khi vào YouTube và tự trỏ sang link cập nhật">
                    <div class="ytc-item-left">
                        ${UPDATE_SVG}
                        <div class="ytc-item-text-group">
                            <span class="ytc-item-main-text">Tự động cập nhật</span>
                            <span class="ytc-item-sub-text">Tự gọi API và trỏ sang link cài bản mới khi vào YouTube</span>
                        </div>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-autoupdate">
                        <input type="checkbox" id="ytc-chk-autoupdate" name="autoUpdate" aria-label="Tự động cập nhật" ${currentConfig.autoUpdate ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>
        `);
      (document.body || document.documentElement).appendChild(panel);
      panel.querySelectorAll(".ytc-tab-btn").forEach((tabBtn) => {
        tabBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const tabKey = tabBtn.getAttribute("data-tab");
          panel.querySelectorAll(".ytc-tab-btn").forEach((b) => b.classList.remove("active"));
          panel.querySelectorAll(".ytc-tab-pane").forEach((p) => p.classList.remove("active"));
          tabBtn.classList.add("active");
          const targetPane = panel.querySelector(`#ytc-pane-${tabKey}`);
          if (targetPane) targetPane.classList.add("active");
        });
      });
      panel.querySelectorAll(".ytc-col-btn").forEach((colBtn) => {
        colBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const cols = parseInt(colBtn.getAttribute("data-cols"), 10) || 4;
          currentConfig.columns = cols;
          saveConfig(currentConfig);
          panel.querySelectorAll(".ytc-col-btn").forEach((b) => b.classList.remove("active"));
          colBtn.classList.add("active");
          applyConfigToRoot();
        });
      });
      panel.querySelectorAll("#ytc-row-chatoverlay .ytc-mode-btn").forEach((modeBtn) => {
        modeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const mode = modeBtn.getAttribute("data-overlay") || "off";
          if (mode !== "off" && !hasLiveOrChatSupport()) {
            showToast("⚠️ Live Chat chỉ khả dụng khi xem Live Stream hoặc video có khung trò chuyện!");
            return;
          }
          currentConfig.chatOverlay = mode;
          saveConfig(currentConfig);
          panel.querySelectorAll("#ytc-row-chatoverlay .ytc-mode-btn").forEach((b) => b.classList.remove("active"));
          modeBtn.classList.add("active");
          applyConfigToRoot();
          Promise.resolve().then(() => (init_chat(), chat_exports)).then((m) => {
            if (m && typeof m.updateChatOverlayVisibility === "function") {
              m.updateChatOverlayVisibility();
            }
          }).catch(() => {
          });
        });
      });
      panel.querySelectorAll(".ytc-quality-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const quality = btn.getAttribute("data-quality") || "auto";
          currentConfig.preferredQuality = quality;
          saveConfig(currentConfig);
          panel.querySelectorAll(".ytc-quality-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const labelBadge = panel.querySelector(".ytc-quality-badge");
          if (labelBadge) {
            const labels = {
              auto: "TỰ ĐỘNG",
              max: "CAO NHẤT",
              "1440p": "2K",
              "1080p": "1080P",
              "720p": "720P"
            };
            labelBadge.textContent = labels[quality] || quality.toUpperCase();
          }
          Promise.resolve().then(() => (init_qualityManager(), qualityManager_exports)).then((m) => {
            if (m && typeof m.applyPreferredQuality === "function") {
              m.applyPreferredQuality();
            }
          }).catch(() => {
          });
        });
      });
      panel.querySelectorAll(".ytc-item[data-toggle]").forEach((item) => {
        const key = item.getAttribute("data-toggle");
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (!checkbox) return;
        checkbox.addEventListener("change", () => {
          currentConfig[key] = checkbox.checked;
          saveConfig(currentConfig);
          applyConfigToRoot();
          if (key === "hideNativeLiveChat") {
            Promise.resolve().then(() => (init_chat(), chat_exports)).then((m) => {
              if (checkbox.checked) {
                if (m && typeof m.resetChatCollapseState === "function") {
                  m.resetChatCollapseState();
                }
                if (m && typeof m.autoCollapseNativeChatIfOpen === "function") {
                  m.autoCollapseNativeChatIfOpen(true);
                }
                if (m && typeof m.setupAutoCloseObserver === "function") {
                  m.setupAutoCloseObserver();
                }
                setTimeout(() => m.autoCollapseNativeChatIfOpen?.(true), 100);
                setTimeout(() => m.autoCollapseNativeChatIfOpen?.(true), 300);
                setTimeout(() => m.autoCollapseNativeChatIfOpen?.(true), 700);
              } else {
                if (m && typeof m.setUserManuallyOpenedChat === "function") {
                  m.setUserManuallyOpenedChat(true);
                }
                if (m && typeof m.setNativeChatHiddenState === "function") {
                  m.setNativeChatHiddenState(false);
                }
                const chatFrame = document.querySelector("ytd-live-chat-frame#chat, #chat.ytd-watch-flexy");
                if (chatFrame && chatFrame.hasAttribute("collapsed")) {
                  const showBtn = chatFrame.querySelector("#show-hide-button yt-button-shape button, #show-hide-button button, #show-hide-button");
                  if (showBtn) showBtn.click();
                }
              }
              if (m && typeof m.syncPlayerFullscreenSize === "function") {
                m.syncPlayerFullscreenSize();
              }
              if (m && typeof m.updateChatOverlayVisibility === "function") {
                m.updateChatOverlayVisibility();
              }
            }).catch(() => {
            });
            window.dispatchEvent(new Event("resize"));
          }
          if (key === "ambientLighting") {
            Promise.resolve().then(() => (init_ambientLight(), ambientLight_exports)).then((m) => {
              if (m && typeof m.applyAmbientLightingState === "function") {
                m.applyAmbientLightingState();
              }
            }).catch(() => {
            });
          }
          if (key === "autoSubtitles") {
            const rowLang = panel.querySelector("#ytc-row-captionlang");
            if (rowLang) {
              rowLang.style.display = checkbox.checked ? "flex" : "none";
            }
            Promise.resolve().then(() => (init_autoSubtitles(), autoSubtitles_exports)).then((m) => {
              if (m && typeof m.applyAutoSubtitles === "function") {
                m.applyAutoSubtitles();
              }
            }).catch(() => {
            });
          }
          if (key === "audioOnlyMode") {
            Promise.resolve().then(() => (init_audioOnly(), audioOnly_exports)).then((m) => {
              if (m && typeof m.applyAudioOnlyState === "function") {
                m.applyAudioOnlyState();
              }
            }).catch(() => {
            });
            Promise.resolve().then(() => (init_ambientLight(), ambientLight_exports)).then((m) => {
              if (m && typeof m.applyAmbientLightingState === "function") {
                m.applyAmbientLightingState();
              }
            }).catch(() => {
            });
          }
          if (key === "chatMemoryGc" && checkbox.checked) {
            Promise.resolve().then(() => (init_chatMemoryGc(), chatMemoryGc_exports)).then((m) => {
              if (m && typeof m.performChatMemoryGc === "function") {
                m.performChatMemoryGc();
              }
            }).catch(() => {
            });
          }
          if (key === "hideMixes") {
            Promise.resolve().then(() => (init_mixFilter(), mixFilter_exports)).then((m) => {
              if (checkbox.checked) {
                if (typeof m.cleanMixUrl === "function") m.cleanMixUrl();
                if (typeof m.tagWatchMixPanel === "function") m.tagWatchMixPanel();
              }
            }).catch(() => {
            });
            Promise.resolve().then(() => (init_feedFilter(), feedFilter_exports)).then((m) => {
              if (m && typeof m.scheduleFeedScan === "function") {
                m.scheduleFeedScan(document);
              }
            }).catch(() => {
            });
          }
          if (key === "hideShopping" && checkbox.checked) {
            Promise.resolve().then(() => (init_shoppingFilter(), shoppingFilter_exports)).then((m) => {
              if (m && typeof m.dismissShoppingPanels === "function") {
                m.dismissShoppingPanels(document);
              }
            }).catch(() => {
            });
          }
          if (key === "unlockLiveDvr") {
            if (location.pathname.startsWith("/watch") || location.pathname.startsWith("/live")) {
              setTimeout(() => {
                location.reload();
              }, 250);
            }
          }
          if (key === "autoUpdate" && checkbox.checked) {
            Promise.resolve().then(() => (init_notifier(), notifier_exports)).then((m) => {
              if (m && typeof m.checkAndAutoUpdate === "function") {
                m.checkAndAutoUpdate(true);
              }
            }).catch(() => {
            });
          }
        });
        item.addEventListener("click", (e) => {
          if (!e.target.closest(".ytc-switch")) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event("change"));
          }
        });
      });
      const captionLangSelect = panel.querySelector("#ytc-select-captionlang");
      if (captionLangSelect) {
        captionLangSelect.addEventListener("change", (e) => {
          e.stopPropagation();
          currentConfig.captionLanguage = captionLangSelect.value;
          saveConfig(currentConfig);
          Promise.resolve().then(() => (init_autoSubtitles(), autoSubtitles_exports)).then((m) => {
            if (m && typeof m.applyAutoSubtitles === "function") {
              m.applyAutoSubtitles();
            }
          }).catch(() => {
          });
        });
      }
      const ublockBtn = panel.querySelector("#ytc-btn-ublock");
      if (ublockBtn) {
        ublockBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          window.open("https://ublockorigin.com/", "_blank", "noopener,noreferrer");
        });
      }
      const updateBtn = panel.querySelector("#ytc-btn-update");
      const updateBtnText = panel.querySelector("#ytc-update-btn-text");
      if (updateBtn) {
        let isChecking = false;
        let isCountingDown = false;
        let countdownInterval = null;
        let reloadTriggered = false;
        const triggerReload = () => {
          if (reloadTriggered) return;
          reloadTriggered = true;
          if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
          }
          if (updateBtnText) updateBtnText.textContent = "Đang tải lại...";
          location.reload();
        };
        updateBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          if (isCountingDown) {
            triggerReload();
            return;
          }
          if (isChecking) return;
          isChecking = true;
          updateBtn.disabled = true;
          updateBtn.classList.remove("ytc-btn-success", "ytc-btn-has-update");
          updateBtn.classList.add("ytc-btn-loading");
          if (updateBtnText) updateBtnText.textContent = "Đang kiểm tra...";
          try {
            let pkg = null;
            try {
              const apiRes = await fetch("https://api.github.com/repos/huyvu2512/youtube-customizer/contents/package.json?ref=main", {
                headers: { "Accept": "application/vnd.github.v3.raw" },
                cache: "no-store"
              });
              if (apiRes.ok) {
                const data = await apiRes.json();
                if (data && data.version) {
                  pkg = data;
                } else if (data && data.content && data.encoding === "base64") {
                  try {
                    pkg = JSON.parse(decodeURIComponent(escape(atob(data.content.replace(/\s/g, "")))));
                  } catch (err) {
                  }
                }
              }
            } catch (e2) {
            }
            if (!pkg || !pkg.version) {
              const rawRes = await fetch(`https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/package.json?t=${Date.now()}`, {
                cache: "no-store"
              });
              if (rawRes.ok) {
                pkg = await rawRes.json();
              }
            }
            if (pkg && pkg.version) {
              if (isNewerVersion(pkg.version, APP_VERSION)) {
                const newVersionUrl = `https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=${pkg.version}`;
                window.open(newVersionUrl, "_blank");
                isChecking = false;
                isCountingDown = true;
                updateBtn.disabled = false;
                updateBtn.classList.remove("ytc-btn-loading");
                updateBtn.classList.add("ytc-btn-has-update");
                updateBtn.title = `Đã mở trang cập nhật v${pkg.version}. Bấm để tải lại trang ngay!`;
                let countdown = 10;
                if (updateBtnText) updateBtnText.textContent = "F5 sau 10s";
                const openedTime = Date.now();
                const onReturnToTab = () => {
                  if (Date.now() - openedTime >= 1200) {
                    window.removeEventListener("focus", onReturnToTab);
                    document.removeEventListener("visibilitychange", handleVisibilityChange2);
                    triggerReload();
                  }
                };
                const handleVisibilityChange2 = () => {
                  if (document.visibilityState === "visible") {
                    onReturnToTab();
                  }
                };
                window.addEventListener("focus", onReturnToTab);
                document.addEventListener("visibilitychange", handleVisibilityChange2);
                countdownInterval = setInterval(() => {
                  countdown--;
                  if (countdown <= 0) {
                    window.removeEventListener("focus", onReturnToTab);
                    document.removeEventListener("visibilitychange", handleVisibilityChange2);
                    triggerReload();
                  } else {
                    if (updateBtnText) updateBtnText.textContent = `F5 sau ${countdown}s`;
                  }
                }, 1e3);
                return;
              } else {
                updateBtn.classList.remove("ytc-btn-loading");
                updateBtn.classList.add("ytc-btn-success");
                if (updateBtnText) updateBtnText.textContent = "Đã cập nhật";
                setTimeout(() => {
                  updateBtn.classList.remove("ytc-btn-success");
                  if (updateBtnText) updateBtnText.textContent = "Kiểm tra";
                  updateBtn.disabled = false;
                  isChecking = false;
                }, 2500);
                return;
              }
            } else {
              window.open("https://github.com/huyvu2512/youtube-customizer/releases", "_blank");
            }
          } catch (err) {
            window.open("https://github.com/huyvu2512/youtube-customizer/releases", "_blank");
          }
          setTimeout(() => {
            updateBtn.classList.remove("ytc-btn-loading", "ytc-btn-has-update");
            if (updateBtnText) updateBtnText.textContent = "Kiểm tra";
            updateBtn.disabled = false;
            isChecking = false;
          }, 3e3);
        });
      }
      const devBtn = panel.querySelector("#ytc-btn-dev");
      if (devBtn) {
        devBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          window.open("https://huyvu2512.io.vn", "_blank", "noopener,noreferrer");
        });
      }
      const reportBtn = panel.querySelector("#ytc-btn-report");
      if (reportBtn) {
        reportBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          window.open("https://github.com/huyvu2512/youtube-customizer/issues", "_blank", "noopener,noreferrer");
        });
      }
      const donateBtn = panel.querySelector("#ytc-btn-donate");
      if (donateBtn) {
        donateBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          window.open("https://vietqr.app/img?acc=0886308216&bank=MoMo&fullacc=true&holder=VU+QUANG+HUY&template=standee", "_blank", "noopener,noreferrer");
        });
      }
      panel.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
    return panel;
  }
  function ensureSettingsElements() {
    const endContainer = document.querySelector("ytd-masthead #end, #masthead #end, #end.ytd-masthead");
    if (!endContainer) return;
    let btn = document.getElementById("ytc-settings-btn");
    const isBtnInPlace = btn && btn.parentElement === endContainer && btn === endContainer.firstElementChild;
    const isPanelExisting = !!document.getElementById("ytc-settings-panel");
    if (isBtnInPlace && isPanelExisting) {
      return;
    }
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "ytc-settings-btn";
      btn.title = "YouTube Customizer";
      setElementHTML(btn, GEAR_SVG);
    }
    if (btn.parentElement !== endContainer || btn !== endContainer.firstElementChild) {
      endContainer.insertBefore(btn, endContainer.firstElementChild);
    }
    const panel = createSettingsPanel();
    syncPanelState(panel);
    bindGlobalMenuDismiss();
    setupOnboardingAndUpdates(btn);
    if (!btn._ytcBound) {
      btn._ytcBound = true;
      const updatePosition = () => {
        const rect = btn.getBoundingClientRect();
        panel.style.top = rect.bottom + 8 + "px";
        panel.style.right = Math.max(12, window.innerWidth - rect.right - 10) + "px";
      };
      btn.addEventListener("mouseenter", updatePosition, { passive: true });
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        syncPanelState(panel);
        updatePosition();
        panel.classList.toggle("open");
      });
    }
  }
  function setupSettingsObserver() {
    ensureSettingsElements();
    const throttledEnsure = rafThrottle(ensureSettingsElements);
    const attach = (masthead2) => {
      throttledEnsure();
      new MutationObserver(throttledEnsure).observe(masthead2, { childList: true, subtree: true });
    };
    const masthead = document.querySelector("ytd-masthead");
    if (masthead) attach(masthead);
    else whenElement("ytd-masthead", attach);
    let retryCount = 0;
    const retryInterval = setInterval(() => {
      retryCount++;
      ensureSettingsElements();
      if (retryCount >= 6 && document.getElementById("ytc-settings-btn")) {
        clearInterval(retryInterval);
      }
    }, 500);
  }

  // src/optimization/codecBlocker.js
  init_config();
  var isHooked = false;
  function initCodecBlocker() {
    if (isHooked) return;
    isHooked = true;
    if (typeof window.MediaSource !== "undefined" && typeof window.MediaSource.isTypeSupported === "function") {
      const origIsTypeSupported = window.MediaSource.isTypeSupported.bind(window.MediaSource);
      window.MediaSource.isTypeSupported = function(type) {
        if (currentConfig.blockAv1 && typeof type === "string") {
          const lower = type.toLowerCase();
          if (lower.includes("av01") || lower.includes("av1.")) {
            return false;
          }
        }
        return origIsTypeSupported(type);
      };
    }
    if (typeof HTMLMediaElement !== "undefined" && HTMLMediaElement.prototype) {
      const origCanPlayType = HTMLMediaElement.prototype.canPlayType;
      HTMLMediaElement.prototype.canPlayType = function(type) {
        if (currentConfig.blockAv1 && typeof type === "string") {
          const lower = type.toLowerCase();
          if (lower.includes("av01") || lower.includes("av1.")) {
            return "";
          }
        }
        return origCanPlayType.apply(this, arguments);
      };
    }
    if (navigator.mediaCapabilities && typeof navigator.mediaCapabilities.decodingInfo === "function") {
      const origDecodingInfo = navigator.mediaCapabilities.decodingInfo.bind(navigator.mediaCapabilities);
      navigator.mediaCapabilities.decodingInfo = function(config) {
        if (currentConfig.blockAv1 && config && config.video && typeof config.video.contentType === "string") {
          const lower = config.video.contentType.toLowerCase();
          if (lower.includes("av01") || lower.includes("av1.")) {
            return Promise.resolve({
              supported: false,
              smooth: false,
              powerEfficient: false
            });
          }
        }
        return origDecodingInfo(config);
      };
    }
  }

  // src/optimization/index.js
  init_chatMemoryGc();
  init_audioOnly();

  // src/optimization/preventAutoPause.js
  init_config();
  init_utils();
  var lactInterval = null;
  var dialogObserver = null;
  function refreshLact() {
    try {
      window._lact = Date.now();
    } catch (e) {
    }
  }
  function checkAndDismissPauseDialog() {
    if (!currentConfig.preventAutoPause) return;
    const dialogs = document.querySelectorAll(
      "yt-confirm-dialog-renderer, ytd-popup-container, tp-yt-paper-dialog"
    );
    for (const dialog of dialogs) {
      if (dialog.offsetParent === null && dialog.style.display === "none") continue;
      const text = dialog.textContent || "";
      if (text.includes("Bạn vẫn đang xem") || text.includes("Video đã tạm dừng") || text.includes("Continue watching") || text.includes("Video paused")) {
        const confirmBtn = dialog.querySelector(
          '#confirm-button button, yt-button-renderer#confirm-button button, [aria-label*="Có" i], [aria-label*="Yes" i]'
        );
        if (confirmBtn) {
          confirmBtn.click();
        }
        const player = document.querySelector("#movie_player:not(#inline-preview-player)");
        if (player && typeof player.playVideo === "function") {
          player.playVideo();
        }
        break;
      }
    }
  }
  function initPreventAutoPause() {
    if (lactInterval) return;
    lactInterval = setInterval(() => {
      if (currentConfig.preventAutoPause) {
        refreshLact();
      }
    }, 5 * 60 * 1e3);
    refreshLact();
    let debounceTimer = null;
    whenElement("ytd-popup-container", (popupTarget) => {
      if (!dialogObserver && currentConfig.preventAutoPause) {
        dialogObserver = new MutationObserver(() => {
          if (!currentConfig.preventAutoPause) return;
          if (debounceTimer) return;
          debounceTimer = setTimeout(() => {
            debounceTimer = null;
            checkAndDismissPauseDialog();
          }, 500);
        });
        dialogObserver.observe(popupTarget, { childList: true, subtree: true });
      }
    });
  }

  // src/optimization/index.js
  init_chatMemoryGc();
  init_audioOnly();
  var isOptInitialized = false;
  function initOptimization() {
    initCodecBlocker();
    initChatMemoryGc();
    initAudioOnly();
    initPreventAutoPause();
    isOptInitialized = true;
  }

  // src/index.js
  if (window.self === window.top) {
    initCodecBlocker();
    initLiveDvrHook();
  }
  function injectStyles(css) {
    const style = document.createElement("style");
    style.id = "yt-customizer-styles";
    style.textContent = css;
    const target = document.head || document.documentElement;
    if (target) {
      target.appendChild(style);
    } else {
      const docObserver = new MutationObserver(() => {
        const t = document.head || document.documentElement;
        if (t) {
          docObserver.disconnect();
          if (!document.getElementById("yt-customizer-styles")) {
            t.appendChild(style);
          }
        }
      });
      docObserver.observe(document, { childList: true });
    }
  }
  if (window.self !== window.top) {
    if (location.pathname.includes("live_chat")) {
      initIframeChatSender();
    }
  } else {
    let onNavigate = function() {
      currentConfig.chatOverlay = "off";
      resetChatCollapseState();
      updateChatOverlayVisibility();
      syncPanelState();
      applyConfigToRoot();
      scheduleLogoScan(document);
      ensureSettingsElements();
      syncPanelState();
      bindGlobalKeys();
      setupFullscreenLock();
      dismissPromoBanners(document);
      initChatOverlay();
      initOptimization();
      if (currentConfig.hideNativeLiveChat) {
        setupAutoCloseObserver();
      }
      initAutoLiveSync();
      resetAutoLiveState();
      checkInitialLiveSnap();
      normalizeTimeDisplay();
      applyAmbientLightingState();
      applyAutoSubtitles();
      if (location.pathname.startsWith("/watch")) {
        setWatchLoading(true);
      } else if (isHomeFeedPath()) {
        applyHomeGridColumns();
        scheduleFeedScan(document);
      }
    };
    injectStyles(styles_default);
    onConfigChange(() => {
      applyHomeGridColumns();
      updateChatOverlayVisibility();
      applyAudioOnlyState();
      applyPreferredQuality();
      applyAutoSubtitles();
    });
    applyConfigToRoot();
    bindGlobalKeys();
    checkAndAutoUpdate();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onNavigate, { once: true });
    } else {
      onNavigate();
    }
    document.addEventListener("yt-navigate-start", () => {
      currentConfig.chatOverlay = "off";
      resetChatCollapseState();
      updateChatOverlayVisibility();
      syncPanelState();
      if (location.pathname.startsWith("/watch")) {
        setWatchLoading(true);
      }
    });
    window.addEventListener("popstate", () => {
      if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) {
        currentConfig.chatOverlay = "off";
        updateChatOverlayVisibility();
        syncPanelState();
      }
    });
    document.addEventListener("yt-page-data-updated", () => {
      if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) {
        currentConfig.chatOverlay = "off";
        updateChatOverlayVisibility();
        syncPanelState();
      }
    });
    document.addEventListener("yt-navigate-finish", onNavigate);
    window.addEventListener("resize", applyHomeGridColumns);
    setupLogoObserver();
    setupSettingsObserver();
    setupFeedShelvesObserver();
    setupFullscreenLock();
    initChatOverlay();
    initAutoLiveSync();
    initMixFilter();
    initQualityManager();
    initTimeLock();
    initAmbientLight();
    initAutoSubtitles();
    if (location.pathname.startsWith("/watch")) {
      setWatchLoading(true);
    }
    if (isHomeFeedPath()) {
      whenElement("ytd-rich-grid-renderer", applyHomeGridColumns);
      let gridRetryCount = 0;
      const gridRetryInterval = setInterval(() => {
        gridRetryCount++;
        applyHomeGridColumns();
        if (document.querySelector("ytd-rich-grid-renderer ytd-rich-item-renderer") || gridRetryCount >= 10) {
          clearInterval(gridRetryInterval);
        }
      }, 250);
    }
  }
})();
