// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.3.7
// @description  YouTube Customizer v3.3.7 — Bổ sung Tab 5 Thông tin (Phiên bản, Làm mới, Cập nhật, Tác giả Huy Vũ, Báo cáo & Ủng hộ), đưa Độ phân giải video lên đầu mục Tối Ưu.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.7:
 * ============================================================================
 * 1. [Mới] Bổ sung Tab 5 "Thông tin":
 *    - Xem thông tin phiên bản phát hành chính thức, kiểm tra cập nhật trực tiếp qua GitHub.
 *    - Thông tin nhà phát triển Huy Vũ (https://huyvu2512.io.vn).
 *    - Mục Báo cáo & Góp ý ý tưởng trực tiếp qua GitHub Issues.
 *    - Mục Tặng quà & Ủng hộ (Donate) qua MoMo (VietQR standee) kèm nút sao chép nhanh.
 * 2. [Mới] Tính năng "Ẩn sản phẩm gắn thẻ" (YouTube Shopping):
 *    - Tự động đóng/ẩn thanh bên Sản phẩm (Shopping), nút túi xách trên video và kệ sản phẩm.
 * 3. [Cải tiến UI] Đưa mục "Độ phân giải video" lên trên cùng tab "Tối Ưu" tiện thao tác.
 * 4. [Cải tiến UI] Thiết kế lại badge phiên bản (version badge) theo phong cách bán trong suốt đồng bộ.
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
  var APP_VERSION, CONFIG_KEY, CHAT_OFF_SVG, EMOJI_OFF_SVG, GEAR_SVG, GRID_SVG, SHORTS_SVG, GAMEPAD_SVG, YOUTUBE_SVG, SEARCH_SVG, SPARKLE_SVG, KEYBOARD_SVG, CROWN_SVG, COMPASS_SVG, LAYOUT_TAB_SVG, SHIELD_TAB_SVG, PLAYER_TAB_SVG, POST_SVG, ENDSCREEN_SVG, BELL_OFF_SVG, WATERMARK_SVG, REWIND_SVG, MESSAGE_SVG, RADIO_SVG, OPTIMIZE_TAB_SVG, CPU_SVG, BROOM_SVG, HEADPHONES_SVG, INFINITY_SVG, SHIELD_CHECK_SVG, PLAYLIST_SVG, QUALITY_SVG, INFO_TAB_SVG, UPDATE_SVG, USER_SVG, BUG_SVG, GIFT_SVG, EXTERNAL_LINK_SVG, SHOPPING_SVG;
  var init_constants = __esm({
    "src/core/constants.js"() {
      APP_VERSION = "3.3.7";
      CONFIG_KEY = "ytc_config";
      CHAT_OFF_SVG = `<svg viewBox="0 0 24 24"><path d="M20 4v10.59l2 2V4c0-1.1-.9-2-2-2H5.41l2 2H20zM2.81 2.81L1.39 4.22l2.61 2.61V22l4-4h8.59l3.18 3.19 1.41-1.41L2.81 2.81zM8.83 16l-2.83 2.83V8.83L16 16H8.83z"/></svg>`;
      EMOJI_OFF_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9z"/><circle cx="8.5" cy="9.5" r="1.5"/><circle cx="15.5" cy="9.5" r="1.5"/><path d="M12 17.5c2.1 0 3.88-1.2 4.6-3h-9.2c.72 1.8 2.5 3 4.6 3z"/></svg>`;
      GEAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>`;
      GRID_SVG = `<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z"/></svg>`;
      SHORTS_SVG = `<svg viewBox="0 0 24 24"><path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.5v-5l4.5 2.5-4.5 2.5z"/></svg>`;
      GAMEPAD_SVG = `<svg viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S20.17 9 21 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`;
      YOUTUBE_SVG = `<svg viewBox="0 0 24 24"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/></svg>`;
      SEARCH_SVG = `<svg viewBox="0 0 24 24"><path d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>`;
      SPARKLE_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2z"/></svg>`;
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
    root.classList.toggle("ytc-disable-ambient", !!currentConfig.disableAmbient);
    root.classList.toggle("ytc-hide-native-chat", !!currentConfig.hideNativeLiveChat);
    root.classList.toggle("ytc-hide-chat-emojis", !!currentConfig.hideChatEmojis);
    root.classList.toggle("ytc-audio-only", !!currentConfig.audioOnlyMode);
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
      document.body.classList.toggle("ytc-disable-ambient", !!currentConfig.disableAmbient);
      document.body.classList.toggle("ytc-hide-native-chat", !!currentConfig.hideNativeLiveChat);
      document.body.classList.toggle("ytc-hide-chat-emojis", !!currentConfig.hideChatEmojis);
      document.body.classList.toggle("ytc-audio-only", !!currentConfig.audioOnlyMode);
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
        disableAmbient: false,
        // Tắt Ambient Mode (Cinematics) (mặc định tắt)
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
        preferredQuality: "auto"
        // Ưu tiên độ phân giải video: 'auto', 'max', '1440p', '1080p', '720p'
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
    const sections = root.querySelectorAll("ytd-rich-section-renderer");
    sections.forEach((sec) => {
      if (currentConfig.hideMembersOnly && !sec.classList.contains("ytc-shelf-members")) {
        const text = sec.textContent || "";
        if (text.includes("lợi ích từ hội viên") || text.includes("Ưu tiên hội viên") || text.includes("ưu tiên hội viên") || text.includes("hội viên") && text.includes("YouTube chọn lọc") || text.includes("Get more from memberships") || text.includes("Members only") || text.includes("Members first") || sec.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], a[href*="/membership"], a[href*="/memberships"]')) {
          sec.classList.add("ytc-shelf-members");
        }
      }
      if (currentConfig.hideExploreTopics && !sec.classList.contains("ytc-shelf-explore")) {
        const text = sec.textContent || "";
        if (text.includes("Khám phá các chủ đề") || text.includes("Explore other topics") || text.includes("Explore topics") || sec.querySelector("yt-chip-cloud-chip-renderer, yt-chip-cloud-renderer, ytd-feed-filter-chip-bar-renderer")) {
          sec.classList.add("ytc-shelf-explore");
        }
      }
      if (currentConfig.hideCommunity && !sec.classList.contains("ytc-shelf-community")) {
        if (sec.querySelector("ytd-post-renderer, ytd-backstage-post-renderer, ytd-backstage-post-thread-renderer, ytd-post-multi-image-renderer, ytd-poll-renderer")) {
          sec.classList.add("ytc-shelf-community");
        }
      }
      if (currentConfig.hideMixes && !sec.classList.contains("ytc-shelf-mix")) {
        const titleEl = sec.querySelector("#title, #title-container, yt-formatted-string#title");
        const titleText = (titleEl ? titleEl.textContent : "") || "";
        if (titleText.includes("Danh sách kết hợp") || titleText.includes("Mixes") || titleText.includes("YouTube tạo danh sách phát này")) {
          sec.classList.add("ytc-shelf-mix");
        }
      }
    });
    if (currentConfig.hideMembersOnly) {
      const videoCards = root.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer");
      videoCards.forEach((card) => {
        if (!card.classList.contains("ytc-item-members")) {
          const text = card.textContent || "";
          if (text.includes("Ưu tiên hội viên") || text.includes("ưu tiên hội viên") || text.includes("Chỉ dành cho hội viên") || text.includes("chỉ dành cho hội viên") || text.includes("Members first") || text.includes("Members only") || text.includes("Members-only") || text.includes("Early access") || card.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], [aria-label*="hội viên"], [aria-label*="Hội viên"], [aria-label*="Members"]')) {
            card.classList.add("ytc-item-members");
          }
        }
      });
    }
    if (currentConfig.hideMixes) {
      const mixCards = root.querySelectorAll(
        "ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-radio-renderer, ytd-compact-radio-renderer, ytd-grid-radio-renderer, ytd-playlist-renderer, ytd-compact-playlist-renderer"
      );
      mixCards.forEach((card) => {
        if (card.classList.contains("ytc-item-mix")) return;
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
          const text = card.textContent || "";
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
    applyTimeoutIds.forEach((id) => clearTimeout(id));
    applyTimeoutIds = [];
    const delays = [200, 600, 1400, 2800];
    delays.forEach((delay) => {
      const id = setTimeout(() => {
        applyPreferredQuality();
      }, delay);
      applyTimeoutIds.push(id);
    });
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
    isNativeChatHiddenByScript = !!hidden;
    const root = document.documentElement;
    const body = document.body;
    if (hidden) {
      root.setAttribute("data-ytc-chat-hidden", "true");
      if (body) body.setAttribute("data-ytc-chat-hidden", "true");
    } else {
      root.removeAttribute("data-ytc-chat-hidden");
      if (body) body.removeAttribute("data-ytc-chat-hidden");
    }
    syncPlayerFullscreenSize();
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
        const vW = video.videoWidth;
        const vH = video.videoHeight;
        if (pW > 0 && pH > 0) {
          if (vW > 0 && vH > 0) {
            const videoRatio = vW / vH;
            const playerRatio = pW / pH;
            let targetW, targetH, targetLeft, targetTop;
            if (playerRatio > videoRatio) {
              targetH = pH;
              targetW = Math.round(targetH * videoRatio);
              targetLeft = Math.round((pW - targetW) / 2);
              targetTop = 0;
            } else {
              targetW = pW;
              targetH = Math.round(targetW / videoRatio);
              targetLeft = 0;
              targetTop = Math.round((pH - targetH) / 2);
            }
            video.style.width = `${targetW}px`;
            video.style.height = `${targetH}px`;
            video.style.left = `${targetLeft}px`;
            video.style.top = `${targetTop}px`;
          } else {
            video.style.width = "100%";
            video.style.height = "100%";
            video.style.left = "0px";
            video.style.top = "0px";
          }
        }
        if (typeof player.setInternalSize === "function") {
          try {
            player.setInternalSize();
          } catch (e) {
          }
        }
        return;
      }
      if (typeof player.setInternalSize === "function") {
        try {
          player.setInternalSize();
        } catch (e) {
        }
      }
      if (isNativeChatHiddenByScript) {
        const video2 = player.querySelector("video.html5-main-video");
        if (video2 && video2.videoWidth && video2.videoHeight) {
          const screenW = window.innerWidth || screen.width;
          const screenH = window.innerHeight || screen.height;
          const videoRatio = video2.videoWidth / video2.videoHeight;
          const screenRatio = screenW / screenH;
          let targetW, targetH, targetLeft, targetTop;
          if (screenRatio > videoRatio) {
            targetH = screenH;
            targetW = Math.round(targetH * videoRatio);
            targetLeft = Math.round((screenW - targetW) / 2);
            targetTop = 0;
          } else {
            targetW = screenW;
            targetH = Math.round(targetW / videoRatio);
            targetLeft = 0;
            targetTop = Math.round((screenH - targetH) / 2);
          }
          const currentW = parseInt(video2.style.width) || 0;
          if (currentW < targetW - 20) {
            video2.dataset.ytcOverridden = "true";
            video2.style.width = `${targetW}px`;
            video2.style.height = `${targetH}px`;
            video2.style.left = `${targetLeft}px`;
            video2.style.top = `${targetTop}px`;
          }
        }
      } else {
        if (video.dataset.ytcOverridden) {
          delete video.dataset.ytcOverridden;
        }
        const pW = player.clientWidth || player.offsetWidth;
        const pH = player.clientHeight || player.offsetHeight;
        const vW = video.videoWidth;
        const vH = video.videoHeight;
        if (pW > 0 && pH > 0 && vW > 0 && vH > 0) {
          const videoRatio = vW / vH;
          const playerRatio = pW / pH;
          let targetW, targetH, targetLeft, targetTop;
          if (playerRatio > videoRatio) {
            targetH = pH;
            targetW = Math.round(targetH * videoRatio);
            targetLeft = Math.round((pW - targetW) / 2);
            targetTop = 0;
          } else {
            targetW = pW;
            targetH = Math.round(targetW / videoRatio);
            targetLeft = 0;
            targetTop = Math.round((pH - targetH) / 2);
          }
          video.style.width = `${targetW}px`;
          video.style.height = `${targetH}px`;
          video.style.left = `${targetLeft}px`;
          video.style.top = `${targetTop}px`;
        }
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
        setTimeout(() => applyChatBoxPos(box, p), 100);
        setTimeout(() => applyChatBoxPos(box, p), 300);
      }
      syncPlayerFullscreenSize();
      setTimeout(syncPlayerFullscreenSize, 50);
      setTimeout(syncPlayerFullscreenSize, 150);
      setTimeout(syncPlayerFullscreenSize, 300);
      setTimeout(syncPlayerFullscreenSize, 600);
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
    if (danmakuQueue.length === 0) return;
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
    const retryDelays = [80, 200, 450, 900, 1600, 2800];
    retryDelays.forEach((delay) => {
      setTimeout(() => {
        if (!hasAutoCollapsedChatForCurrentVideo && !userManuallyOpenedChat && currentConfig.hideNativeLiveChat) {
          autoCollapseNativeChatIfOpen();
        }
      }, delay);
    });
    chatAutoCloseObserver = new MutationObserver(() => {
      if (hasAutoCollapsedChatForCurrentVideo || userManuallyOpenedChat || !currentConfig.hideNativeLiveChat) {
        if (chatAutoCloseObserver) {
          chatAutoCloseObserver.disconnect();
          chatAutoCloseObserver = null;
        }
        return;
      }
      if (autoCollapseNativeChatIfOpen()) {
        if (chatAutoCloseObserver) {
          chatAutoCloseObserver.disconnect();
          chatAutoCloseObserver = null;
        }
      }
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
    }, 12e3);
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
      const isCloseBtn = !!e.target.closest(
        '#close-button, #visibility-button, #collapse-button, #panels-full-bleed-container #visibility-button, #panels-full-bleed-container #close-button, #panels-full-bleed-container [aria-label*="Đóng" i], #panels-full-bleed-container [aria-label*="Close" i], #panels-full-bleed-container [aria-label*="Ẩn" i], #panels-full-bleed-container [aria-label*="Hide" i], ytd-engagement-panel-section-list-renderer #visibility-button, ytd-engagement-panel-section-list-renderer #close-button, ytd-engagement-panel-section-list-renderer [aria-label*="Đóng" i], ytd-engagement-panel-section-list-renderer [aria-label*="Close" i], ytd-engagement-panel-section-list-renderer [aria-label*="Ẩn" i], ytd-engagement-panel-section-list-renderer [aria-label*="Hide" i], ytd-live-chat-frame:not([collapsed]) #show-hide-button, ytd-live-chat-frame:not([collapsed]) #show-hide-button button, ytd-live-chat-frame:not([collapsed]) #show-hide-button yt-button-shape, #chat-container ytd-live-chat-frame:not([collapsed]) #show-hide-button, ytd-live-chat-frame:not([collapsed]) #collapse-button, ytd-live-chat-frame:not([collapsed]) #close-button, yt-live-chat-header-renderer #close-button, yt-live-chat-header-renderer #collapse-button, [aria-label*="Ẩn cuộc trò chuyện" i], [aria-label*="Ẩn trò chuyện" i], [aria-label*="Ẩn mục trò chuyện" i], [aria-label*="Thu gọn" i], [aria-label*="Hide chat" i], [aria-label*="Collapse live chat" i], [aria-label*="Close chat" i]'
      );
      if (isCloseBtn) {
        setUserManuallyOpenedChat(false);
        setHasAutoCollapsedChatForCurrentVideo(true);
        const isFs = !!(document.fullscreenElement || document.querySelector("#movie_player.ytp-fullscreen"));
        if (isFs && currentConfig.chatOverlay && currentConfig.chatOverlay !== "off") {
          setNativeChatHiddenState(true);
        }
        return;
      }
      const chatFrameEl = document.querySelector("ytd-live-chat-frame#chat, #chat.ytd-watch-flexy, #chat-container ytd-live-chat-frame");
      const isFrameCollapsed = !chatFrameEl || chatFrameEl.hasAttribute("collapsed") || chatFrameEl.collapsed === true;
      const isPanelClosed = !document.querySelector('ytd-engagement-panel-section-list-renderer[target-id*="chat" i][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]');
      const isExplicitOpenBtn = !!e.target.closest(
        'ytd-live-chat-frame[collapsed] #show-hide-button, ytd-live-chat-frame[collapsed] #show-hide-button button, ytd-live-chat-frame[collapsed] #teaser, ytd-live-chat-frame[collapsed] #chat-teaser, ytd-live-chat-frame[collapsed] ytd-button-renderer, ytd-live-chat-frame[collapsed] yt-button-shape, [aria-label*="Hiện cuộc trò chuyện" i], [aria-label*="Hiện trò chuyện" i], [aria-label*="Mở rộng cuộc trò chuyện" i], [aria-label*="Mở bảng điều khiển" i], [aria-label*="Show chat" i], [aria-label*="Expand live chat" i], [aria-label*="Open panel" i]'
      );
      const isPlayerChatToggle = (isFrameCollapsed || isPanelClosed) && !!e.target.closest(
        '.ytp-live-chat-button, .ytp-chat-button, button[data-tooltip-target-id*="chat" i]'
      );
      if (isExplicitOpenBtn || isPlayerChatToggle) {
        setUserManuallyOpenedChat(true);
        setHasAutoCollapsedChatForCurrentVideo(true);
        if (chatAutoCloseObserver) {
          chatAutoCloseObserver.disconnect();
          chatAutoCloseObserver = null;
        }
        const isFs = !!(document.fullscreenElement || document.querySelector("#movie_player.ytp-fullscreen"));
        if (isFs) {
          if (!isNativeChatOpenInFullscreen()) {
            setNativeChatHiddenState(false);
          } else {
            setUserManuallyOpenedChat(false);
          }
        } else {
          setNativeChatHiddenState(false);
        }
      }
      setTimeout(syncNativeChatFullscreenState, 30);
      setTimeout(syncNativeChatFullscreenState, 100);
      setTimeout(syncNativeChatFullscreenState, 250);
      setTimeout(syncNativeChatFullscreenState, 500);
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
      setTimeout(syncPlayerFullscreenSize, 50);
      setTimeout(syncPlayerFullscreenSize, 150);
      setTimeout(syncPlayerFullscreenSize, 300);
      setTimeout(syncPlayerFullscreenSize, 600);
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

  // src/optimization/audioOnly.js
  var audioOnly_exports = {};
  __export(audioOnly_exports, {
    applyAudioOnlyState: () => applyAudioOnlyState,
    initAudioOnly: () => initAudioOnly
  });
  function getPlayer() {
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
    const player = getPlayer();
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
  var styles_default = '/* ==========================================================================\n   YOUTUBE CUSTOMIZER - TẬP HỢP TOÀN BỘ ĐỊNH KIỂU CSS\n   ========================================================================== */\n\n/* --------------------------------------------------------------------------\n   1. LƯỚI VIDEO TRANG CHỦ & FEED: ÉP 3/4/5 CỘT CHUẨN XÁC\n   (Độ ưu tiên cao nhất, cố định vĩnh viễn khi F5 tải lại trang)\n   -------------------------------------------------------------------------- */\n@media (min-width: 900px) {\n    ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,\n    ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer,\n    ytd-browse[page-subtype="channels"] ytd-rich-grid-renderer,\n    #page-manager ytd-browse ytd-rich-grid-renderer,\n    ytd-rich-grid-renderer.ytc-grid,\n    ytd-rich-grid-renderer {\n        --ytd-rich-grid-items-per-row: 3 !important;\n        --ytd-rich-grid-posts-per-row: 3 !important;\n        --ytd-rich-grid-item-max-width: none !important;\n    }\n\n    html[data-ytc-cols="3"] #page-manager ytd-rich-grid-renderer,\n    html[data-ytc-cols="3"] ytd-rich-grid-renderer,\n    body[data-ytc-cols="3"] #page-manager ytd-rich-grid-renderer,\n    body[data-ytc-cols="3"] ytd-rich-grid-renderer,\n    [data-ytc-cols="3"] #page-manager ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="3"] #page-manager ytd-rich-grid-renderer,\n    [data-ytc-cols="3"] ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="3"] ytd-rich-grid-renderer {\n        --ytd-rich-grid-items-per-row: 3 !important;\n        --ytd-rich-grid-posts-per-row: 3 !important;\n        --ytd-rich-grid-item-max-width: none !important;\n    }\n\n    html[data-ytc-cols="4"] #page-manager ytd-rich-grid-renderer,\n    html[data-ytc-cols="4"] ytd-rich-grid-renderer,\n    body[data-ytc-cols="4"] #page-manager ytd-rich-grid-renderer,\n    body[data-ytc-cols="4"] ytd-rich-grid-renderer,\n    [data-ytc-cols="4"] #page-manager ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="4"] #page-manager ytd-rich-grid-renderer,\n    [data-ytc-cols="4"] ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="4"] ytd-rich-grid-renderer {\n        --ytd-rich-grid-items-per-row: 4 !important;\n        --ytd-rich-grid-posts-per-row: 4 !important;\n        --ytd-rich-grid-item-max-width: none !important;\n    }\n\n    html[data-ytc-cols="5"] #page-manager ytd-rich-grid-renderer,\n    html[data-ytc-cols="5"] ytd-rich-grid-renderer,\n    body[data-ytc-cols="5"] #page-manager ytd-rich-grid-renderer,\n    body[data-ytc-cols="5"] ytd-rich-grid-renderer,\n    [data-ytc-cols="5"] #page-manager ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="5"] #page-manager ytd-rich-grid-renderer,\n    [data-ytc-cols="5"] ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="5"] ytd-rich-grid-renderer {\n        --ytd-rich-grid-items-per-row: 5 !important;\n        --ytd-rich-grid-posts-per-row: 5 !important;\n        --ytd-rich-grid-item-max-width: none !important;\n    }\n\n    /* Làm phẳng cấu trúc dòng ytd-rich-grid-row để thẻ video chảy đều như trang kênh và chuẩn hitbox hover */\n    #contents > ytd-rich-grid-row,\n    #contents > ytd-rich-grid-row > #contents {\n        display: contents !important;\n    }\n\n    #contents.ytd-rich-grid-row ytd-rich-item-renderer,\n    ytd-rich-grid-renderer ytd-rich-item-renderer {\n        width: calc(100% / var(--ytd-rich-grid-items-per-row, 3) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n        max-width: calc(100% / var(--ytd-rich-grid-items-per-row, 3) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n    }\n\n    [data-ytc-cols="3"] #contents.ytd-rich-grid-row ytd-rich-item-renderer,\n    [data-ytc-cols="3"] ytd-rich-grid-renderer ytd-rich-item-renderer {\n        width: calc(100% / 3 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n        max-width: calc(100% / 3 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n    }\n\n    [data-ytc-cols="4"] #contents.ytd-rich-grid-row ytd-rich-item-renderer,\n    [data-ytc-cols="4"] ytd-rich-grid-renderer ytd-rich-item-renderer {\n        width: calc(100% / 4 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n        max-width: calc(100% / 4 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n    }\n\n    [data-ytc-cols="5"] #contents.ytd-rich-grid-row ytd-rich-item-renderer,\n    [data-ytc-cols="5"] ytd-rich-grid-renderer ytd-rich-item-renderer {\n        width: calc(100% / 5 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n        max-width: calc(100% / 5 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n    }\n}\n\n/* --------------------------------------------------------------------------\n   2. TỐI ƯU HIỆU NĂNG, KHUNG HÌNH & LIVE CHAT (ZERO-LAG)\n   -------------------------------------------------------------------------- */\n/* Đảm bảo khung xem trước video inline khi hover không bao giờ bị cắt xén hay che khuất */\n#page-manager ytd-rich-grid-row {\n    overflow: visible !important;\n}\n\n#page-manager ytd-rich-grid-row:hover,\n#page-manager ytd-rich-grid-row:has(ytd-video-preview, [is-hovered], [has-preview]) {\n    z-index: 10 !important;\n    position: relative !important;\n    overflow: visible !important;\n}\n\n#page-manager ytd-rich-item-renderer {\n    overflow: visible !important;\n}\n\n#page-manager ytd-rich-item-renderer:hover,\n#page-manager ytd-rich-item-renderer:has(ytd-video-preview, [is-hovered], [has-preview]),\n#page-manager ytd-rich-item-renderer[is-hovered],\n#page-manager ytd-rich-item-renderer[has-preview] {\n    z-index: 20 !important;\n    position: relative !important;\n    overflow: visible !important;\n}\n\n/* Đặt z-index của #preview và ytd-video-preview lên 1000 !important để luôn nổi lên trên thẻ video khi hover */\n#preview,\n#preview.ytd-rich-grid-renderer,\nytd-rich-grid-renderer #preview,\n#page-manager #preview,\nytd-video-preview,\n#video-preview,\n#media-container.ytd-video-preview,\nytd-video-preview #media-container,\nytd-video-preview #player-container,\nytd-moving-thumbnail-renderer,\n#inline-preview-player {\n    z-index: 1000 !important;\n    overflow: visible !important;\n    pointer-events: auto !important;\n}\n\nytd-comment-thread-renderer {\n    content-visibility: auto;\n    contain-intrinsic-size: auto 200px;\n}\n\n@keyframes ytcConfirmInserted {\n    from { clip-path: inset(0); }\n    to { clip-path: inset(0); }\n}\nyt-confirm-dialog-renderer {\n    animation: ytcConfirmInserted 0.001s;\n}\n\n#movie_player.seeking-mode .ytp-chrome-bottom,\n#movie_player.seeking-mode .ytp-gradient-bottom,\n#movie_player.seeking-mode .ytp-chrome-top {\n    opacity: 0 !important;\n    transition: opacity 0.15s ease;\n}\n#movie_player.seeking-mode {\n    cursor: none !important;\n}\n\n.ytc-fs-locked .ytp-fullscreen-button {\n    opacity: 0.35 !important;\n    pointer-events: none !important;\n    cursor: not-allowed !important;\n    transition: opacity 0.2s ease !important;\n}\n\nytd-live-chat-frame#chat,\n#chat.ytd-watch-flexy,\niframe#chatframe {\n    contain: layout style paint !important;\n}\n\nyt-live-chat-text-message-renderer,\nyt-live-chat-paid-message-renderer,\nyt-live-chat-membership-item-renderer {\n    content-visibility: auto !important;\n    contain-intrinsic-size: auto 32px !important;\n}\n\n/* --------------------------------------------------------------------------\n   3. BỘ LỌC NỘI DUNG: SHORTS, CHƠI GAME, HỘI VIÊN, KHÁM PHÁ, CỘNG ĐỒNG, CLEAN SEARCH\n   -------------------------------------------------------------------------- */\n.ytc-hide-shorts ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),\n.ytc-hide-shorts ytd-rich-section-renderer:has(ytd-reel-shelf-renderer),\n.ytc-hide-shorts ytd-rich-shelf-renderer[is-shorts],\n.ytc-hide-shorts ytd-reel-shelf-renderer,\n.ytc-hide-shorts ytd-guide-entry-renderer:has(a[href^="/shorts"]),\n.ytc-hide-shorts ytd-mini-guide-entry-renderer:has(a[href^="/shorts"]),\n.ytc-hide-shorts ytd-guide-entry-renderer a[title="Shorts"],\n.ytc-hide-shorts ytd-mini-guide-entry-renderer[aria-label="Shorts"],\n.ytc-hide-shorts #endpoint[title="Shorts"],\n.ytc-hide-shorts ytd-mealbar-promo-renderer,\n.ytc-hide-shorts ytd-upsell-dialog-renderer {\n    display: none !important;\n}\n\n.ytc-hide-playables ytd-rich-section-renderer:has([is-mini-game-card-shelf]),\n.ytc-hide-playables ytd-rich-shelf-renderer[is-mini-game-card-shelf],\n.ytc-hide-playables ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-mini-game-card-shelf]),\n.ytc-hide-playables ytd-rich-section-renderer:has(a[href*="/playables"]),\n.ytc-hide-playables ytd-rich-section-renderer:has(a[href*="playables"]),\n.ytc-hide-playables ytd-guide-entry-renderer:has(a[href*="/playables"]),\n.ytc-hide-playables ytd-mini-guide-entry-renderer:has(a[href*="/playables"]),\n.ytc-hide-playables ytd-guide-entry-renderer a[title*="Chơi game"],\n.ytc-hide-playables ytd-guide-entry-renderer a[title*="Playables"],\n.ytc-hide-playables ytd-mini-guide-entry-renderer[aria-label*="Chơi game"],\n.ytc-hide-playables ytd-mini-guide-entry-renderer[aria-label*="Playables"],\n.ytc-hide-playables #endpoint[title*="Chơi game"],\n.ytc-hide-playables #endpoint[title*="Playables"] {\n    display: none !important;\n}\n\n.ytc-hide-members ytd-rich-section-renderer:has(.badge-style-type-members-only),\n.ytc-hide-members ytd-rich-section-renderer:has(.badge-style-type-members-first),\n.ytc-hide-members ytd-rich-section-renderer:has([badge-style="MEMBERS_FIRST"]),\n.ytc-hide-members ytd-rich-section-renderer:has([badge-style="MEMBERS_ONLY"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="hội viên"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Hội viên"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Members only"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="members only"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Members first"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="members first"]),\n.ytc-hide-members ytd-rich-section-renderer:has(a[href*="/membership"]),\n.ytc-hide-members ytd-rich-section-renderer:has(a[href*="/memberships"]),\n.ytc-hide-members ytd-rich-section-renderer.ytc-shelf-members,\n.ytc-hide-members ytd-rich-item-renderer:has(.badge-style-type-members-only),\n.ytc-hide-members ytd-rich-item-renderer:has(.badge-style-type-members-first),\n.ytc-hide-members ytd-rich-item-renderer:has([badge-style="MEMBERS_FIRST"]),\n.ytc-hide-members ytd-rich-item-renderer:has([badge-style="MEMBERS_ONLY"]),\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="hội viên"]),\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Hội viên"]),\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Members only"]),\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Members first"]),\n.ytc-hide-members ytd-rich-item-renderer.ytc-item-members,\n.ytc-hide-members ytd-video-renderer:has(.badge-style-type-members-only),\n.ytc-hide-members ytd-video-renderer:has(.badge-style-type-members-first),\n.ytc-hide-members ytd-video-renderer:has([badge-style="MEMBERS_FIRST"]),\n.ytc-hide-members ytd-video-renderer:has([badge-style="MEMBERS_ONLY"]),\n.ytc-hide-members ytd-video-renderer:has([aria-label*="hội viên"]),\n.ytc-hide-members ytd-video-renderer:has([aria-label*="Hội viên"]),\n.ytc-hide-members ytd-video-renderer.ytc-item-members,\n.ytc-hide-members ytd-compact-video-renderer:has(.badge-style-type-members-only),\n.ytc-hide-members ytd-compact-video-renderer:has(.badge-style-type-members-first),\n.ytc-hide-members ytd-compact-video-renderer:has([badge-style="MEMBERS_FIRST"]),\n.ytc-hide-members ytd-compact-video-renderer:has([badge-style="MEMBERS_ONLY"]),\n.ytc-hide-members ytd-compact-video-renderer.ytc-item-members {\n    display: none !important;\n}\n\n/* Ẩn Danh sách kết hợp (Mixes / Radio) và Danh sách phát (Playlists) trên Feed, Tìm kiếm, Gợi ý và Watch page */\n.ytc-hide-mixes ytd-playlist-renderer,\n.ytc-hide-mixes ytd-compact-playlist-renderer,\n.ytc-hide-mixes ytd-radio-renderer,\n.ytc-hide-mixes ytd-compact-radio-renderer,\n.ytc-hide-mixes ytd-grid-radio-renderer,\n.ytc-hide-mixes ytd-rich-item-renderer:has(ytd-playlist-renderer),\n.ytc-hide-mixes ytd-rich-item-renderer:has(ytd-radio-renderer),\n.ytc-hide-mixes ytd-rich-item-renderer:has(ytd-playlist-thumbnail),\n.ytc-hide-mixes ytd-rich-item-renderer:has(ytd-playlist-custom-thumbnail-renderer),\n.ytc-hide-mixes ytd-rich-item-renderer:has(a[href*="/playlist?list="]),\n.ytc-hide-mixes ytd-rich-item-renderer:has(a[href*="list=PL"]),\n.ytc-hide-mixes ytd-rich-item-renderer:has(a[href*="list=OLAK5uy_"]),\n.ytc-hide-mixes ytd-rich-item-renderer:has(a[href*="list=CL"]),\n.ytc-hide-mixes ytd-video-renderer:has(ytd-playlist-thumbnail),\n.ytc-hide-mixes ytd-video-renderer:has(a[href*="/playlist?list="]),\n.ytc-hide-mixes ytd-video-renderer:has(a[href*="list=PL"]),\n.ytc-hide-mixes ytd-video-renderer:has(a[href*="list=OLAK5uy_"]),\n.ytc-hide-mixes ytd-video-renderer:has(a[href*="list=CL"]),\n.ytc-hide-mixes ytd-rich-item-renderer.ytc-item-mix,\n.ytc-hide-mixes ytd-video-renderer.ytc-item-mix,\n.ytc-hide-mixes ytd-compact-video-renderer.ytc-item-mix,\n.ytc-hide-mixes #related ytd-compact-radio-renderer,\n.ytc-hide-mixes #related ytd-compact-playlist-renderer,\n.ytc-hide-mixes #playlist:has(a[href*="list=RD"]),\n.ytc-hide-mixes #playlist:has([title*="Danh sách kết hợp"]),\n.ytc-hide-mixes #playlist:has([title*="Mixes"]),\n.ytc-hide-mixes #playlist:has([title*="Mix -"]),\n.ytc-hide-mixes ytd-playlist-panel-renderer:has(a[href*="list=RD"]),\n.ytc-hide-mixes ytd-playlist-panel-renderer:has([title*="Danh sách kết hợp"]),\n.ytc-hide-mixes ytd-playlist-panel-renderer:has([title*="Mixes"]),\n.ytc-hide-mixes ytd-playlist-panel-renderer:has([title*="Mix -"]),\n/* Kệ Mix chuyên biệt (dựa theo tiêu đề rõ ràng, không ẩn oan toàn bộ kệ nhạc) */\n.ytc-hide-mixes ytd-rich-section-renderer:has(#title-container [title*="Danh sách kết hợp"]),\n.ytc-hide-mixes ytd-rich-section-renderer:has(#title-container [title*="Mixes"]),\n.ytc-hide-mixes ytd-rich-section-renderer:has(#title[title*="Danh sách kết hợp"]),\n.ytc-hide-mixes ytd-rich-section-renderer:has(#title[title*="Mixes"]),\n.ytc-hide-mixes ytd-shelf-renderer:has(#title-container [title*="Danh sách kết hợp"]),\n.ytc-hide-mixes ytd-shelf-renderer:has(#title-container [title*="Mixes"]),\n.ytc-hide-mixes ytd-shelf-renderer:has(#title[title*="Danh sách kết hợp"]),\n.ytc-hide-mixes ytd-shelf-renderer:has(#title[title*="Mixes"]),\n.ytc-hide-mixes ytd-rich-section-renderer.ytc-shelf-mix,\n.ytc-hide-mixes ytd-shelf-renderer.ytc-shelf-mix,\n/* Chip "Danh sách kết hợp" trên thanh chủ đề */\n.ytc-hide-mixes yt-chip-cloud-chip-renderer:has([title*="Danh sách kết hợp"]),\n.ytc-hide-mixes yt-chip-cloud-chip-renderer:has([title*="Mixes"]),\n.ytc-hide-mixes .ytc-item-mix {\n    display: none !important;\n}\n\n.ytc-hide-explore ytd-rich-section-renderer:has(yt-chip-cloud-chip-renderer),\n.ytc-hide-explore ytd-rich-section-renderer:has(yt-chip-cloud-renderer),\n.ytc-hide-explore ytd-rich-section-renderer:has(ytd-feed-filter-chip-bar-renderer),\n.ytc-hide-explore ytd-rich-section-renderer:has(#chips),\n.ytc-hide-explore ytd-rich-section-renderer.ytc-shelf-explore,\n.ytc-hide-explore ytd-rich-section-renderer:has([title*="Khám phá các chủ đề"]),\n.ytc-hide-explore ytd-rich-section-renderer:has([title*="Explore other topics"]),\n.ytc-hide-explore ytd-rich-section-renderer:has([title*="Explore topics"]) {\n    display: none !important;\n}\n\n.ytc-clean-search ytd-ad-slot-renderer,\n.ytc-clean-search ytd-rich-item-renderer:has(ytd-ad-slot-renderer),\n.ytc-clean-search ytd-rich-section-renderer:has(ytd-ad-slot-renderer),\n.ytc-clean-search ytd-video-renderer:has(.badge-style-type-ad) {\n    display: none !important;\n}\n\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-post-renderer),\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-backstage-post-renderer),\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-backstage-post-thread-renderer),\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-post-multi-image-renderer),\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-poll-renderer),\n.ytc-hide-community ytd-rich-section-renderer.ytc-shelf-community,\n.ytc-hide-community ytd-rich-item-renderer:has(ytd-post-renderer),\n.ytc-hide-community ytd-rich-item-renderer:has(ytd-backstage-post-renderer),\n.ytc-hide-community ytd-rich-item-renderer.ytc-item-community,\n.ytc-hide-community ytd-post-renderer,\n.ytc-hide-community ytd-backstage-post-renderer,\n.ytc-hide-community ytd-backstage-post-thread-renderer {\n    display: none !important;\n}\n\n/* --------------------------------------------------------------------------\n   4. TRÌNH PHÁT VIDEO: AMBIENT, THẺ KẾT THÚC, BANNER & LOGO PREMIUM\n   -------------------------------------------------------------------------- */\n.ytc-disable-ambient #cinematics,\n.ytc-disable-ambient ytd-cinematics-renderer,\n.ytc-disable-ambient .ytp-ambient-mode-rendering-container {\n    display: none !important;\n}\n\n.ytc-hide-endscreen .ytp-ce-element,\n.ytc-hide-endscreen .ytp-ce-covering-overlay,\n.ytc-hide-endscreen .ytp-ce-element-show,\n.ytc-hide-endscreen .ytp-ce-video,\n.ytc-hide-endscreen .ytp-ce-playlist,\n.ytc-hide-endscreen .ytp-ce-channel,\n.ytc-hide-endscreen .ytp-ce-subscribe,\n.ytc-hide-endscreen .ytp-cards-button,\n.ytc-hide-endscreen .ytp-cards-teaser,\n.ytc-hide-endscreen .ytp-cards-teaser-box,\n.ytc-hide-endscreen .ytp-card {\n    display: none !important;\n    opacity: 0 !important;\n    pointer-events: none !important;\n}\n\n/* Ẩn logo hình mờ kênh ở góc dưới bên phải video */\n.ytc-hide-watermark .annotation-type-custom.iv-branding,\n.ytc-hide-watermark .iv-branding,\n.ytc-hide-watermark .ytp-iv-video-content .iv-branding,\n.ytc-hide-watermark .ytp-branding-logo,\n.ytc-hide-watermark .ytp-featured-channel,\n.ytc-hide-watermark .ytp-branding-element {\n    display: none !important;\n    opacity: 0 !important;\n    pointer-events: none !important;\n    visibility: hidden !important;\n}\n\n/* Ẩn sản phẩm gắn thẻ (YouTube Shopping / Shopee affiliate / Merch shelf) */\n.ytc-hide-shopping ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-shopping-panel"],\n.ytc-hide-shopping ytd-engagement-panel-section-list-renderer[target-id*="shopping"],\n.ytc-hide-shopping ytd-engagement-panel-section-list-renderer[target-id*="product"],\n.ytc-hide-shopping ytd-merch-shelf-renderer,\n.ytc-hide-shopping ytd-products-shelf-renderer,\n.ytc-hide-shopping ytd-product-shelf-renderer,\n.ytc-hide-shopping .ytp-shopping-button,\n.ytc-hide-shopping .ytp-featured-product-banner,\n.ytc-hide-shopping .ytp-suggested-action-badge[aria-label*="sản phẩm" i],\n.ytc-hide-shopping .ytp-suggested-action-badge[aria-label*="product" i],\n.ytc-hide-shopping .ytp-suggested-action-badge[aria-label*="shopping" i],\n.ytc-hide-shopping .ytp-suggested-action-badge:has(svg path[d*="M19 6"]) {\n    display: none !important;\n    opacity: 0 !important;\n    pointer-events: none !important;\n}\n\n.ytc-auto-dismiss ytd-mealbar-promo-renderer,\n.ytc-auto-dismiss yt-mealbar-promo-renderer,\n.ytc-auto-dismiss ytd-upsell-dialog-renderer,\n.ytc-auto-dismiss ytd-single-option-survey-renderer,\n.ytc-auto-dismiss ytd-in-feed-survey-renderer,\n.ytc-auto-dismiss yt-bubble-hint-renderer,\n.ytc-auto-dismiss .ytc-dismissed-toast {\n    display: none !important;\n    opacity: 0 !important;\n    pointer-events: none !important;\n}\n\n:root.ytc-premium-logo #start.ytd-masthead ytd-topbar-logo-renderer,\n:root.ytc-premium-logo ytd-topbar-logo-renderer#logo {\n    margin-left: 0 !important;\n    display: flex !important;\n    align-items: center !important;\n}\n:root.ytc-premium-logo ytd-topbar-logo-renderer #logo {\n    padding: 18px 4px 18px 16px !important;\n    display: inline-flex !important;\n    align-items: center !important;\n    box-sizing: content-box !important;\n}\nytd-topbar-logo-renderer ytd-yoodle-renderer,\nytd-yoodle-renderer ytd-logo,\nytd-topbar-logo-renderer ytd-yoodle-renderer * {\n    display: none !important;\n}\n:root.ytc-premium-logo ytd-topbar-logo-renderer #logo ytd-logo:not(.ytd-yoodle-renderer),\n:root.ytc-premium-logo ytd-topbar-logo-renderer #logo ytd-logo[hidden]:not(.ytd-yoodle-renderer),\n:root.ytc-premium-logo ytd-topbar-logo-renderer > #logo > div > ytd-logo {\n    width: 101px !important;\n    min-width: 101px !important;\n    max-width: 101px !important;\n    height: 20px !important;\n    display: flex !important;\n    align-items: center !important;\n    overflow: visible !important;\n    visibility: visible !important;\n    opacity: 1 !important;\n}\n:root.ytc-premium-logo ytd-logo:not(.ytd-yoodle-renderer) > *:not(.custom-premium-logo) {\n    display: none !important;\n}\nytd-logo, ytd-topbar-logo-renderer {\n    overflow: visible !important;\n}\n:root:not(.ytc-premium-logo) .custom-premium-logo {\n    display: none !important;\n}\n:root.ytc-premium-logo .custom-premium-logo {\n    display: flex !important;\n    align-items: center !important;\n    width: 101px !important;\n    height: 20px !important;\n    color: var(--yt-spec-wordmark-text, var(--yt-spec-text-primary, #0f0f0f)) !important;\n    pointer-events: none;\n    visibility: visible !important;\n    opacity: 1 !important;\n}\nhtml:not([dark]).ytc-premium-logo .custom-premium-logo,\nhtml:not([dark]) .custom-premium-logo,\n:root:not([dark]).ytc-premium-logo .custom-premium-logo {\n    color: var(--yt-spec-wordmark-text, #0f0f0f) !important;\n}\nhtml[dark].ytc-premium-logo .custom-premium-logo,\nhtml[dark] .custom-premium-logo,\n:root[dark].ytc-premium-logo .custom-premium-logo {\n    color: var(--yt-spec-wordmark-text, #f1f1f1) !important;\n}\n.custom-premium-logo svg {\n    width: 101px !important;\n    height: 20px !important;\n    fill: currentColor !important;\n}\n.custom-premium-logo svg #youtube-paths_yt19,\n.custom-premium-logo svg #youtube-paths_yt19 path {\n    fill: currentColor !important;\n}\n\n:root.ytc-premium-logo ytd-topbar-logo-renderer #country-code {\n    display: inline-block !important;\n    font-size: 10px !important;\n    font-weight: 400 !important;\n    font-family: "Roboto", "Arial", sans-serif !important;\n    line-height: 10px !important;\n    color: var(--yt-spec-text-secondary, #909090) !important;\n    margin-top: 14px !important;\n    margin-left: 4px !important;\n    margin-right: 0 !important;\n    margin-bottom: 0 !important;\n    align-self: flex-start !important;\n    vertical-align: top !important;\n    position: relative !important;\n    top: 0 !important;\n    left: 0 !important;\n}\nhtml:not([dark]).ytc-premium-logo ytd-topbar-logo-renderer #country-code,\nhtml:not([dark]) ytd-topbar-logo-renderer #country-code {\n    color: var(--yt-spec-text-secondary, #606060) !important;\n}\nhtml[dark].ytc-premium-logo ytd-topbar-logo-renderer #country-code,\nhtml[dark] ytd-topbar-logo-renderer #country-code {\n    color: var(--yt-spec-text-secondary, #909090) !important;\n}\n:root.ytc-premium-logo ytd-topbar-logo-renderer #country-code:empty {\n    display: none !important;\n}\n\n/* --------------------------------------------------------------------------\n   5. GIAO DIỆN CÀI ĐẶT: NÚT BÁNH RĂNG & MENU 4 TAB\n   -------------------------------------------------------------------------- */\n#ytc-settings-btn {\n    order: -1 !important;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 40px;\n    height: 40px;\n    border-radius: 50%;\n    border: none;\n    background: transparent;\n    color: var(--yt-spec-text-primary, #f1f1f1);\n    cursor: pointer;\n    margin-right: 8px;\n    flex-shrink: 0;\n    transition: background-color 0.15s, color 0.15s;\n    position: relative;\n}\n#ytc-settings-btn:hover {\n    background-color: rgba(255, 255, 255, 0.1);\n}\n#ytc-settings-btn svg {\n    width: 24px;\n    height: 24px;\n    stroke: currentColor;\n    display: block;\n}\nhtml:not([dark]) #ytc-settings-btn {\n    color: #0f0f0f !important;\n}\nhtml:not([dark]) #ytc-settings-btn svg {\n    stroke: #0f0f0f !important;\n    color: #0f0f0f !important;\n}\nhtml:not([dark]) #ytc-settings-btn:hover {\n    background-color: rgba(0, 0, 0, 0.08);\n}\nhtml[dark] #ytc-settings-btn {\n    color: #f1f1f1 !important;\n}\nhtml[dark] #ytc-settings-btn svg {\n    stroke: #f1f1f1 !important;\n    color: #f1f1f1 !important;\n}\n\n#ytc-settings-panel {\n    position: fixed;\n    width: 380px;\n    max-height: calc(100vh - 80px);\n    overflow-y: auto;\n    background: var(--yt-spec-brand-background-primary, #282828);\n    color: var(--yt-spec-text-primary, #f1f1f1);\n    border-radius: 12px;\n    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);\n    padding: 12px;\n    z-index: 9999;\n    font-family: "Roboto", "Arial", sans-serif;\n    font-size: 14px;\n    display: none;\n    flex-direction: column;\n    gap: 6px;\n    user-select: none;\n    border: 1px solid rgba(255, 255, 255, 0.1);\n}\n#ytc-settings-panel::-webkit-scrollbar {\n    width: 4px;\n}\n#ytc-settings-panel::-webkit-scrollbar-thumb {\n    background: rgba(255, 255, 255, 0.2);\n    border-radius: 2px;\n}\n#ytc-settings-panel.open {\n    display: flex;\n}\n\n.ytc-header {\n    font-weight: 600;\n    font-size: 15px;\n    padding: 4px 6px 8px 6px;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n}\n.ytc-header-badge {\n    display: inline-flex;\n    align-items: center;\n    font-size: 11px;\n    font-weight: 600;\n    color: #ff4e45;\n    background: rgba(255, 78, 69, 0.12);\n    border: 1px solid rgba(255, 78, 69, 0.25);\n    padding: 2px 8px;\n    border-radius: 6px;\n    letter-spacing: 0.5px;\n    user-select: none;\n    flex-shrink: 0;\n}\nhtml:not([dark]) .ytc-header-badge {\n    color: #cc0000;\n    background: rgba(204, 0, 0, 0.08);\n    border-color: rgba(204, 0, 0, 0.25);\n}\n\n.ytc-tabs {\n    display: flex;\n    align-items: center;\n    gap: 3px;\n    background: rgba(255, 255, 255, 0.06);\n    border-radius: 8px;\n    padding: 3px;\n    margin: 4px 0 6px 0;\n    border: 1px solid rgba(255, 255, 255, 0.08);\n}\n.ytc-tab-btn {\n    flex: 1 1 0px;\n    width: 0;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    gap: 3px;\n    padding: 6px 1px;\n    border: none;\n    background: transparent;\n    color: #aaa;\n    font-size: 11.5px;\n    font-weight: 500;\n    border-radius: 6px;\n    cursor: pointer;\n    transition: background 0.15s ease, color 0.15s ease;\n    white-space: nowrap;\n    text-align: center;\n    box-sizing: border-box;\n}\n.ytc-tab-btn:hover {\n    background: rgba(255, 255, 255, 0.08);\n    color: #fff;\n}\n.ytc-tab-btn.active {\n    background: #f1f1f1;\n    color: #0f0f0f;\n    font-weight: 500;\n}\n.ytc-tab-btn svg {\n    width: 13px;\n    height: 13px;\n    fill: currentColor;\n    flex-shrink: 0;\n}\n.ytc-tab-pane {\n    display: none;\n    flex-direction: column;\n    gap: 4px;\n}\n.ytc-tab-pane.active {\n    display: flex;\n}\n\n.ytc-item {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 8px 8px;\n    border-radius: 8px;\n    cursor: pointer;\n    transition: background 0.15s;\n}\n.ytc-item:hover {\n    background: rgba(255, 255, 255, 0.08);\n}\n\n.ytc-item-left {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n}\n.ytc-item-left svg {\n    width: 20px;\n    height: 20px;\n    fill: currentColor;\n    opacity: 0.9;\n    flex-shrink: 0;\n}\n.ytc-item-left svg[fill="none"] {\n    fill: none;\n}\n\n.ytc-switch {\n    position: relative;\n    display: inline-block;\n    width: 36px;\n    height: 20px;\n}\n.ytc-switch input {\n    opacity: 0;\n    width: 0;\n    height: 0;\n}\n.ytc-slider {\n    position: absolute;\n    cursor: pointer;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: #606060;\n    border-radius: 20px;\n    transition: background-color 0.2s;\n}\n.ytc-slider:before {\n    position: absolute;\n    content: "";\n    height: 14px;\n    width: 14px;\n    left: 3px;\n    bottom: 3px;\n    background-color: white;\n    border-radius: 50%;\n    transition: transform 0.2s;\n}\n.ytc-switch input:checked + .ytc-slider {\n    background-color: #3ea6ff;\n}\n.ytc-switch input:checked + .ytc-slider:before {\n    transform: translateX(16px);\n}\n\n.ytc-link-badge {\n    display: inline-flex;\n    align-items: center;\n    gap: 4px;\n    padding: 3px 8px;\n    border-radius: 6px;\n    background: rgba(62, 166, 255, 0.12);\n    color: #3ea6ff;\n    font-size: 11.5px;\n    font-weight: 500;\n    transition: all 0.2s ease;\n    border: 1px solid rgba(62, 166, 255, 0.25);\n    user-select: none;\n    flex-shrink: 0;\n}\n.ytc-link-badge svg {\n    flex-shrink: 0;\n}\n.ytc-item:hover .ytc-link-badge {\n    background: #3ea6ff;\n    color: #0f0f0f;\n    border-color: #3ea6ff;\n}\n\n.ytc-cols-group {\n    display: flex;\n    align-items: center;\n    gap: 4px;\n    background: rgba(255, 255, 255, 0.06);\n    padding: 3px;\n    border-radius: 8px;\n    border: 1px solid rgba(255, 255, 255, 0.08);\n}\n.ytc-col-btn {\n    border: none;\n    background: transparent;\n    color: #aaa;\n    font-size: 12px;\n    font-weight: 500;\n    padding: 5px 10px;\n    border-radius: 6px;\n    cursor: pointer;\n    transition: all 0.15s ease;\n    min-width: 28px;\n    text-align: center;\n    box-sizing: border-box;\n}\n.ytc-col-btn:hover {\n    background: rgba(255, 255, 255, 0.08);\n    color: #fff;\n}\n.ytc-col-btn.active {\n    background: #f1f1f1 !important;\n    color: #0f0f0f !important;\n    font-weight: 600;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n}\n\n.ytc-shortcut-hint {\n    font-size: 12px;\n    color: var(--yt-spec-text-secondary, #aaa);\n    background: rgba(255, 255, 255, 0.04);\n    padding: 8px 10px;\n    border-radius: 6px;\n    line-height: 1.6;\n    margin-top: 4px;\n    border: 1px solid rgba(255, 255, 255, 0.06);\n}\n.ytc-shortcut-hint kbd {\n    background: rgba(255, 255, 255, 0.15);\n    color: var(--yt-spec-text-primary, #fff);\n    padding: 2px 5px;\n    border-radius: 3px;\n    font-family: monospace;\n    font-size: 11px;\n    font-weight: bold;\n}\n\nhtml:not([dark]) #ytc-settings-panel {\n    background: #ffffff;\n    color: #0f0f0f;\n    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.15);\n    border: 1px solid rgba(0, 0, 0, 0.1);\n}\nhtml:not([dark]) .ytc-header {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.08);\n}\nhtml:not([dark]) .ytc-tabs {\n    background: rgba(0, 0, 0, 0.05);\n    border: 1px solid rgba(0, 0, 0, 0.08);\n}\nhtml:not([dark]) .ytc-tab-btn {\n    color: #606060;\n}\nhtml:not([dark]) .ytc-tab-btn:hover {\n    background: rgba(0, 0, 0, 0.06);\n    color: #0f0f0f;\n}\nhtml:not([dark]) .ytc-tab-btn.active {\n    background: #0f0f0f;\n    color: #ffffff;\n    font-weight: 500;\n}\nhtml:not([dark]) .ytc-shortcut-hint {\n    background: rgba(0, 0, 0, 0.04);\n    color: #606060;\n    border-color: rgba(0, 0, 0, 0.08);\n}\nhtml:not([dark]) .ytc-shortcut-hint kbd {\n    background: rgba(0, 0, 0, 0.1);\n    color: #0f0f0f;\n}\n\n.ytc-divider {\n    height: 1px;\n    background: rgba(255, 255, 255, 0.1);\n    margin: 4px 0;\n}\n\n.ytc-mode-group {\n    display: flex;\n    align-items: center;\n    gap: 4px;\n    background: rgba(255, 255, 255, 0.06);\n    padding: 3px;\n    border-radius: 8px;\n    border: 1px solid rgba(255, 255, 255, 0.08);\n}\n.ytc-mode-btn {\n    border: none;\n    background: transparent;\n    color: #aaa;\n    font-size: 12px;\n    font-weight: 500;\n    padding: 5px 9px;\n    border-radius: 6px;\n    cursor: pointer;\n    transition: all 0.15s ease;\n    white-space: nowrap;\n    text-align: center;\n    box-sizing: border-box;\n}\n.ytc-mode-btn:hover {\n    background: rgba(255, 255, 255, 0.08);\n    color: #fff;\n}\n.ytc-mode-btn.active {\n    background: #f1f1f1 !important;\n    color: #0f0f0f !important;\n    font-weight: 600;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n}\n\n/* Định kiểu tường minh cho chế độ Tối (Dark mode) */\nhtml[dark] .ytc-cols-group,\nhtml[dark] .ytc-mode-group {\n    background: rgba(255, 255, 255, 0.06);\n    border: 1px solid rgba(255, 255, 255, 0.08);\n}\nhtml[dark] .ytc-col-btn,\nhtml[dark] .ytc-mode-btn {\n    color: #aaa;\n    background: transparent;\n}\nhtml[dark] .ytc-col-btn:hover,\nhtml[dark] .ytc-mode-btn:hover {\n    background: rgba(255, 255, 255, 0.08);\n    color: #fff;\n}\nhtml[dark] .ytc-col-btn.active,\nhtml[dark] .ytc-mode-btn.active {\n    background: #f1f1f1 !important;\n    color: #0f0f0f !important;\n    font-weight: 600;\n}\n\n/* Định kiểu đồng bộ chuẩn xác cho chế độ Sáng (Light mode) */\nhtml:not([dark]) .ytc-cols-group {\n    background: rgba(0, 0, 0, 0.05);\n    border: 1px solid rgba(0, 0, 0, 0.08);\n}\nhtml:not([dark]) .ytc-col-btn {\n    color: #606060;\n    background: transparent;\n}\nhtml:not([dark]) .ytc-col-btn:hover {\n    background: rgba(0, 0, 0, 0.06);\n    color: #0f0f0f;\n}\nhtml:not([dark]) .ytc-col-btn.active {\n    background: #0f0f0f !important;\n    color: #ffffff !important;\n    font-weight: 600;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);\n}\n\nhtml:not([dark]) .ytc-mode-group {\n    background: rgba(0, 0, 0, 0.05);\n    border: 1px solid rgba(0, 0, 0, 0.08);\n}\nhtml:not([dark]) .ytc-mode-btn {\n    color: #606060;\n    background: transparent;\n}\nhtml:not([dark]) .ytc-mode-btn:hover {\n    background: rgba(0, 0, 0, 0.06);\n    color: #0f0f0f;\n}\nhtml:not([dark]) .ytc-mode-btn.active {\n    background: #0f0f0f !important;\n    color: #ffffff !important;\n    font-weight: 600;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);\n}\n\n/* Kiểu dáng mục phân giải video (2 tầng & segmented control) */\n.ytc-item-vertical {\n    flex-direction: column !important;\n    align-items: stretch !important;\n    gap: 8px !important;\n}\n.ytc-item-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    width: 100%;\n}\n.ytc-quality-badge {\n    display: inline-flex;\n    align-items: center;\n    font-size: 11px;\n    font-weight: 600;\n    color: #3ea6ff;\n    background: rgba(62, 166, 255, 0.12);\n    border: 1px solid rgba(62, 166, 255, 0.25);\n    padding: 2px 8px;\n    border-radius: 6px;\n    letter-spacing: 0.5px;\n    user-select: none;\n    flex-shrink: 0;\n}\nhtml:not([dark]) .ytc-quality-badge {\n    color: #065fd4;\n    background: rgba(6, 95, 212, 0.08);\n    border-color: rgba(6, 95, 212, 0.25);\n}\n.ytc-quality-group {\n    display: flex;\n    width: 100%;\n    gap: 3px;\n    box-sizing: border-box;\n}\n.ytc-quality-btn {\n    border: none;\n    background: transparent;\n    color: #aaa;\n    font-size: 11px;\n    font-weight: 500;\n    padding: 5px 2px;\n    border-radius: 6px;\n    cursor: pointer;\n    transition: all 0.15s ease;\n    white-space: nowrap;\n    text-align: center;\n    box-sizing: border-box;\n    flex: 1;\n    min-width: 0;\n}\n.ytc-quality-btn:hover {\n    background: rgba(255, 255, 255, 0.08);\n    color: #fff;\n}\n.ytc-quality-btn.active {\n    background: #f1f1f1 !important;\n    color: #0f0f0f !important;\n    font-weight: 600;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n}\n\nhtml[dark] .ytc-quality-btn {\n    color: #aaa;\n    background: transparent;\n}\nhtml[dark] .ytc-quality-btn:hover {\n    background: rgba(255, 255, 255, 0.08);\n    color: #fff;\n}\nhtml[dark] .ytc-quality-btn.active {\n    background: #f1f1f1 !important;\n    color: #0f0f0f !important;\n    font-weight: 600;\n}\n\nhtml:not([dark]) .ytc-quality-btn {\n    color: #606060;\n    background: transparent;\n}\nhtml:not([dark]) .ytc-quality-btn:hover {\n    background: rgba(0, 0, 0, 0.06);\n    color: #0f0f0f;\n}\nhtml:not([dark]) .ytc-quality-btn.active {\n    background: #0f0f0f !important;\n    color: #ffffff !important;\n    font-weight: 600;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);\n}\n\n/* Trạng thái vô hiệu hóa của Live Chat row khi video không hỗ trợ chat */\n#ytc-row-chatoverlay.ytc-disabled {\n    opacity: 0.35 !important;\n    pointer-events: none !important;\n    cursor: not-allowed !important;\n}\n#ytc-row-chatoverlay.ytc-disabled:hover {\n    background: transparent !important;\n}\n#ytc-row-chatoverlay.ytc-disabled .ytc-mode-btn {\n    pointer-events: none !important;\n    cursor: not-allowed !important;\n}\n#ytc-row-chatoverlay.ytc-disabled .ytc-mode-btn.active {\n    background: rgba(255, 255, 255, 0.12) !important;\n    color: rgba(255, 255, 255, 0.45) !important;\n    box-shadow: none !important;\n}\nhtml:not([dark]) #ytc-row-chatoverlay.ytc-disabled .ytc-mode-btn.active {\n    background: rgba(0, 0, 0, 0.08) !important;\n    color: rgba(0, 0, 0, 0.38) !important;\n    box-shadow: none !important;\n}\n\nhtml:not([dark]) .ytc-item:hover {\n    background: rgba(0, 0, 0, 0.05);\n}\nhtml:not([dark]) .ytc-divider {\n    background: rgba(0, 0, 0, 0.08);\n}\nhtml:not([dark]) .ytc-slider {\n    background-color: #b0b0b0;\n}\nhtml:not([dark]) .ytc-slider:before {\n    background-color: #ffffff;\n}\nhtml:not([dark]) .ytc-switch input:checked + .ytc-slider {\n    background-color: #065fd4;\n}\n\n/* --------------------------------------------------------------------------\n   CHAT OVERLAY TRÊN VIDEO (DANMAKU & STREAMER BOX)\n   -------------------------------------------------------------------------- */\n#ytc-danmaku-container {\n    position: absolute;\n    inset: 0;\n    width: 100% !important;\n    height: 100% !important;\n    pointer-events: none;\n    overflow: hidden;\n    z-index: 35 !important;\n    container-type: inline-size;\n    transition: opacity 0.3s ease;\n    display: none;\n}\n\n.ytc-danmaku-item {\n    position: absolute;\n    left: 100%;\n    white-space: nowrap;\n    font-family: "YouTube Noto", Roboto, Arial, sans-serif !important;\n    font-weight: 700;\n    font-size: 18px;\n    line-height: 1.3;\n    color: #ffffff;\n    text-shadow: \n        1px 1px 2px #000, \n        -1px -1px 2px #000, \n        1px -1px 2px #000, \n        -1px 1px 2px #000,\n        0 0 4px #000;\n    will-change: transform;\n    animation: ytc-danmaku-slide 8.5s linear forwards;\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    pointer-events: none;\n}\n\n@keyframes ytc-danmaku-slide {\n    from {\n        transform: translateX(0);\n    }\n    to {\n        transform: translateX(calc(-100% - 100cqi));\n    }\n}\n\n@supports not (container-type: inline-size) {\n    @keyframes ytc-danmaku-slide {\n        from {\n            transform: translateX(0);\n        }\n        to {\n            transform: translateX(calc(-100% - 100vw));\n        }\n    }\n}\n\n.ytc-chat-author {\n    color: #9ab4c7;\n    font-weight: 600;\n    flex-shrink: 0;\n}\n.ytc-chat-author.mod,\n.ytc-chat-text.mod {\n    color: #3ea6ff !important;\n}\n.ytc-chat-author.member,\n.ytc-chat-text.member {\n    color: #2ba640 !important;\n}\n.ytc-chat-author.owner,\n.ytc-chat-text.owner {\n    color: #ffd600 !important;\n}\n\n.ytc-chat-text {\n    color: #ffffff !important;\n    font-weight: 500;\n}\n\n.ytc-danmaku-item img,\n.ytc-danmaku-item .ytc-chat-text img,\n.ytc-danmaku-item img.emoji,\n.ytc-danmaku-item img.yt-emoji,\n.ytc-danmaku-item .emoji {\n    max-height: 22px !important;\n    max-width: 28px !important;\n    width: auto !important;\n    height: auto !important;\n    vertical-align: -3px !important;\n    margin: 0 2px !important;\n    display: inline-block !important;\n    object-fit: contain !important;\n}\n\n/* ĐIỀU KHIỂN HIỂN THỊ THEO TRẠNG THÁI CONFIG */\nhtml[data-ytc-chat="danmaku"] #ytc-danmaku-container,\nbody[data-ytc-chat="danmaku"] #ytc-danmaku-container {\n    display: block !important;\n}\n\nhtml[data-ytc-chat="streamer"] #ytc-streamer-box,\nbody[data-ytc-chat="streamer"] #ytc-streamer-box {\n    display: flex !important;\n}\n\nhtml[data-ytc-chat="off"] #ytc-danmaku-container,\nbody[data-ytc-chat="off"] #ytc-danmaku-container,\nhtml[data-ytc-chat="streamer"] #ytc-danmaku-container,\nbody[data-ytc-chat="streamer"] #ytc-danmaku-container {\n    display: none !important;\n}\n\nhtml[data-ytc-chat="off"] #ytc-streamer-box,\nbody[data-ytc-chat="off"] #ytc-streamer-box,\nhtml[data-ytc-chat="danmaku"] #ytc-streamer-box,\nbody[data-ytc-chat="danmaku"] #ytc-streamer-box {\n    display: none !important;\n}\n\n/* ==========================================================================\n   QUẢN LÝ KHUNG LIVE CHAT GỐC KHI BẬT OVERLAY\n   - Nếu Chat gốc BẬT: Giữ nguyên cho người dùng chat và hiển thị tự nhiên.\n   - Nếu Chat gốc TẮT (mặc định tắt hoặc người dùng ẩn):\n     + Chưa phóng to: Ẩn gọn off-screen để script lấy data ngầm.\n     + Phóng to Fullscreen: Ẩn triệt để panel bên phải & PHÓNG TO KHUNG VIDEO 100% FULL MÀN HÌNH.\n   ========================================================================== */\n\n/* 1. Giao diện thường (chưa phóng to):\n   Để YouTube xử lý thu gọn tự nhiên (hiện thẻ teaser "Mở bảng điều khiển" gọn gàng),\n   TUYỆT ĐỐI KHÔNG đẩy frame chat gốc ra -9999px để người dùng có thể nhấp mở/đóng bình thường. */\nytd-live-chat-frame[collapsed] #chatframe {\n    display: none !important;\n}\n\n/* 2. Trạng thái ẩn Chat gốc trong giao diện toàn màn hình (FULLSCREEN / PHÓNG TO) khi CHƯA MỞ CHAT */\n/* Triệt tiêu độ rộng side panel bên phải để video tràn 100vw khi CHƯA CÓ BẤT KỲ PANEL NÀO ĐƯỢC MỞ */\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #panels-full-bleed-container:not(:has([visibility*="EXPANDED"])),\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #chat-container,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #panels,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #secondary,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) .ytp-fullscreen:not(.ytp-chat-open) #chat-container,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) .ytp-fullscreen:not(.ytp-chat-open) .ytp-live-chat-panel {\n    width: 0 !important;\n    min-width: 0 !important;\n    max-width: 0 !important;\n    flex-basis: 0 !important;\n    overflow: hidden !important;\n    opacity: 0 !important;\n    pointer-events: none !important;\n}\n\n/* Phóng to toàn bộ các tầng container và movie_player ra 100vw x 100vh để xóa sổ vệt đen khi chat đang đóng */\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #player-full-bleed-container,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #full-bleed-container,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #player-container-outer,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #player-container-inner,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #player-container,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #movie_player:not(#inline-preview-player):not(.ytp-chat-open),\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) .html5-video-player:not(#inline-preview-player):not(.ytp-chat-open),\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) .ytp-fullscreen.html5-video-player:not(#inline-preview-player):not(.ytp-chat-open) {\n    width: 100vw !important;\n    min-width: 100vw !important;\n    max-width: 100vw !important;\n    height: 100vh !important;\n    min-height: 100vh !important;\n    max-height: 100vh !important;\n    margin-right: 0 !important;\n    padding-right: 0 !important;\n    left: 0 !important;\n    right: 0 !important;\n    top: 0 !important;\n    bottom: 0 !important;\n    transform: none !important;\n}\n\n/* Luôn đảm bảo nút Live Chat trên thanh điều khiển YouTube player và action bar hiển thị và bấm được */\n.ytp-live-chat-button,\n.ytp-chat-button,\n[aria-label*="trò chuyện" i],\n[aria-label*="chat" i],\n[target-id*="chat" i] {\n    pointer-events: auto !important;\n    cursor: pointer !important;\n}\n\n\n/* ==========================================================================\n   TÍNH NĂNG ẨN BIỂU TƯỢNG CẢM XÚC TRONG LIVE CHAT (hideChatEmojis)\n   - Ẩn hoàn toàn thẻ ảnh emoji/sticker trong khung chat gốc\n   - Ẩn hoàn toàn các bình luận chỉ chứa icon/emoji không có chữ\n   ========================================================================== */\nhtml.ytc-hide-chat-emojis img.emoji,\nbody.ytc-hide-chat-emojis img.emoji,\nhtml.ytc-hide-chat-emojis img.yt-emoji,\nbody.ytc-hide-chat-emojis img.yt-emoji,\nhtml.ytc-hide-chat-emojis .emoji,\nbody.ytc-hide-chat-emojis .emoji,\nhtml.ytc-hide-chat-emojis yt-live-chat-paid-sticker-renderer,\nbody.ytc-hide-chat-emojis yt-live-chat-paid-sticker-renderer {\n    display: none !important;\n}\n\nhtml.ytc-hide-chat-emojis .ytc-emoji-only-msg,\nbody.ytc-hide-chat-emojis .ytc-emoji-only-msg {\n    display: none !important;\n}\n\n/* ==========================================================================\n   TOAST NOTIFICATION (HỖ TRỢ THÔNG BÁO NHẸ NHÀNG)\n   ========================================================================== */\n#ytc-toast-notification {\n    position: fixed;\n    bottom: 28px;\n    left: 50%;\n    transform: translateX(-50%) translateY(20px);\n    background: rgba(18, 18, 18, 0.92);\n    backdrop-filter: blur(12px);\n    -webkit-backdrop-filter: blur(12px);\n    color: #fff;\n    padding: 10px 18px;\n    border-radius: 20px;\n    font-size: 13px;\n    font-weight: 500;\n    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15);\n    z-index: 999999;\n    opacity: 0;\n    pointer-events: none;\n    transition: opacity 0.25s ease, transform 0.25s ease;\n    font-family: "YouTube Sans", "Roboto", sans-serif;\n    white-space: nowrap;\n}\n\n#ytc-toast-notification.ytc-toast-show {\n    opacity: 1;\n    transform: translateX(-50%) translateY(0);\n}\n\nhtml[light] #ytc-toast-notification,\nbody[light] #ytc-toast-notification {\n    background: rgba(255, 255, 255, 0.95);\n    color: #0f0f0f;\n    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1);\n}\n\n/* Trạng thái disabled cho các mục không hỗ trợ trong menu */\n.ytc-item.ytc-disabled {\n    opacity: 0.55;\n}\n\n.ytc-item.ytc-disabled .ytc-mode-btn:not([data-overlay="off"]) {\n    cursor: not-allowed !important;\n    opacity: 0.45;\n    pointer-events: auto !important;\n}\n\n\n\n/* KHUNG LIVE CHAT BOX (NỀN TRONG SUỐT HUD OVERLAY CHO STREAMER) */\n#ytc-streamer-box {\n    position: absolute;\n    width: 320px;\n    min-height: 120px;\n    max-height: 80%;\n    background: transparent !important;\n    backdrop-filter: none !important;\n    border: none !important;\n    box-shadow: none !important;\n    border-radius: 6px;\n    z-index: 38 !important;\n    overflow: hidden;\n    display: flex;\n    flex-direction: column;\n    pointer-events: auto;\n    box-sizing: border-box;\n    transition: background-color 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;\n    user-select: none;\n}\n\n#ytc-streamer-box.ytc-dragging {\n    transition: none !important;\n    will-change: left, top;\n    user-select: none !important;\n}\n\n#ytc-streamer-box:hover,\n#ytc-streamer-box.ytc-box-initial,\n#ytc-streamer-box.ytc-dragging {\n    background: rgba(0, 0, 0, 0.45) !important;\n    backdrop-filter: blur(4px) !important;\n    border: 1px dashed rgba(255, 255, 255, 0.35) !important;\n    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6) !important;\n}\n\n.ytc-box-header {\n    height: 24px;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 2px 6px;\n    background: rgba(0, 0, 0, 0.75);\n    color: #eee;\n    font-size: 11px;\n    font-weight: 600;\n    cursor: move;\n    opacity: 0;\n    pointer-events: none;\n    transition: opacity 0.2s ease;\n    flex-shrink: 0;\n    border-top-left-radius: 6px;\n    border-top-right-radius: 6px;\n}\n\n.ytc-box-title {\n    display: flex;\n    align-items: center;\n    gap: 5px;\n    font-size: 11px;\n    font-weight: 600;\n    color: #fff;\n    user-select: none;\n    letter-spacing: 0.2px;\n}\n\n.ytc-box-title svg {\n    flex-shrink: 0;\n    opacity: 0.9;\n}\n\n.ytc-box-close {\n    background: transparent !important;\n    border: none !important;\n    color: rgba(255, 255, 255, 0.7) !important;\n    cursor: pointer !important;\n    width: 20px !important;\n    height: 20px !important;\n    padding: 0 !important;\n    margin: 0 !important;\n    border-radius: 4px !important;\n    display: flex !important;\n    align-items: center !important;\n    justify-content: center !important;\n    transition: background 0.15s ease, color 0.15s ease !important;\n    outline: none !important;\n    box-shadow: none !important;\n}\n\n.ytc-box-close:hover {\n    background: rgba(255, 255, 255, 0.2) !important;\n    color: #fff !important;\n}\n\n.ytc-box-close svg {\n    display: block;\n}\n\n#ytc-streamer-box:hover .ytc-box-header,\n#ytc-streamer-box.ytc-box-initial .ytc-box-header,\n#ytc-streamer-box.ytc-dragging .ytc-box-header {\n    opacity: 1 !important;\n    pointer-events: auto !important;\n}\n\n#ytc-streamer-box:hover .ytc-box-resize,\n#ytc-streamer-box.ytc-box-initial .ytc-box-resize,\n#ytc-streamer-box.ytc-dragging .ytc-box-resize {\n    opacity: 1 !important;\n    pointer-events: auto !important;\n}\n\n.ytc-box-messages {\n    flex: 1;\n    overflow-y: hidden;\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-end;\n    gap: 3px;\n    padding: 2px 4px;\n    pointer-events: none;\n}\n\n.ytc-box-item {\n    display: flex;\n    align-items: flex-start;\n    flex-shrink: 0 !important;\n    flex-grow: 0 !important;\n    width: 100%;\n    box-sizing: border-box;\n    height: auto !important;\n    min-height: min-content !important;\n    gap: 3px;\n    font-size: 10px;\n    line-height: 1.35;\n    color: #fff;\n    text-shadow: \n        1px 1px 2px #000, \n        -1px -1px 2px #000, \n        1px -1px 2px #000, \n        -1px 1px 2px #000, \n        0 0 3px #000;\n    animation: ytc-fade-in 0.12s ease-out;\n    word-break: break-word;\n    overflow-wrap: break-word;\n}\n\n.ytc-box-avatar {\n    width: 10px;\n    height: 10px;\n    border-radius: 50%;\n    flex-shrink: 0;\n    margin-top: 2px;\n}\n\n.ytc-box-content {\n    flex: 1;\n    min-width: 0;\n    word-break: break-word;\n    overflow-wrap: break-word;\n    line-height: 1.35;\n}\n\n#ytc-streamer-box .ytc-chat-author {\n    color: #b5b5b5 !important;\n    font-weight: 700 !important;\n    flex-shrink: 0;\n}\n#ytc-streamer-box .ytc-chat-author.mod {\n    color: #3ea6ff !important;\n    font-weight: 700 !important;\n}\n#ytc-streamer-box .ytc-chat-author.member {\n    color: #2ba640 !important;\n    font-weight: 700 !important;\n}\n#ytc-streamer-box .ytc-chat-author.owner {\n    color: #ffd600 !important;\n    font-weight: 700 !important;\n}\n\n#ytc-streamer-box .ytc-chat-text {\n    color: #ffffff !important;\n    font-weight: 700 !important;\n}\n\n/* THU NHỎ ICON EMOJI VÀ BADGE BẰNG CỠ CHỮ CHỈ ÁP DỤNG CHO KHUNG NỔI STREAMER */\n#ytc-streamer-box .ytc-box-content img,\n#ytc-streamer-box .ytc-box-item img,\n#ytc-streamer-box img.emoji,\n#ytc-streamer-box img.yt-emoji,\n#ytc-streamer-box .emoji {\n    max-height: 10px !important;\n    width: auto !important;\n    max-width: 12px !important;\n    height: auto !important;\n    vertical-align: -1px !important;\n    display: inline-block !important;\n    object-fit: contain !important;\n    margin: 0 1px !important;\n}\n\n.ytc-box-badge {\n    display: inline-flex;\n    align-items: center;\n    vertical-align: -1px;\n    margin: 0 2px;\n}\n.ytc-box-badge.ytc-badge-mod,\n.ytc-box-badge.ytc-badge-owner {\n    display: inline-flex !important;\n    align-items: center !important;\n    justify-content: center !important;\n    vertical-align: -1px !important;\n    margin: 0 1px !important;\n}\n.ytc-box-badge svg.ytc-mod-icon,\n.ytc-badge-mod,\n.ytc-mod-icon {\n    display: inline-block !important;\n    width: 10px !important;\n    height: 10px !important;\n    fill: #3ea6ff !important;\n    vertical-align: -1px !important;\n}\n.ytc-box-badge svg.ytc-owner-icon,\n.ytc-badge-owner,\n.ytc-owner-icon {\n    display: inline-block !important;\n    width: 10px !important;\n    height: 10px !important;\n    fill: #ffd600 !important;\n    vertical-align: -1px !important;\n}\n.ytc-box-badge img {\n    width: 10px !important;\n    height: 10px !important;\n    max-width: 10px !important;\n    max-height: 10px !important;\n    display: inline-block !important;\n    vertical-align: -1px !important;\n    object-fit: contain !important;\n}\n\n.ytc-box-resize {\n    position: absolute;\n    right: 2px;\n    bottom: 2px;\n    width: 10px;\n    height: 10px;\n    cursor: nwse-resize;\n    opacity: 0;\n    pointer-events: none;\n    transition: opacity 0.2s ease;\n    border-right: 2px solid rgba(255, 255, 255, 0.6);\n    border-bottom: 2px solid rgba(255, 255, 255, 0.6);\n}\n\n#ytc-streamer-box:hover .ytc-box-resize,\n#ytc-streamer-box.ytc-box-initial .ytc-box-resize {\n    opacity: 1;\n    pointer-events: auto;\n}\n\n/* HIỆU ỨNG XUẤT HIỆN MƯỢT MÀ, KHÔNG DÙNG TRANSLATE-Y GÂY GIẬT LAG KHUNG HÌNH */\n@keyframes ytc-fade-in {\n    from { opacity: 0; }\n    to { opacity: 1; }\n}\n\n/* TỰ ĐỘNG CÂN ĐỐI TỶ LỆ KÍCH THƯỚC CHỮ KHI PHÓNG TO TOÀN MÀN HÌNH (FULLSCREEN / ZOOM) */\n.ytp-fullscreen .ytc-danmaku-item {\n    font-size: 25px !important;\n}\n.ytp-fullscreen .ytc-danmaku-item img,\n.ytp-fullscreen .ytc-danmaku-item .ytc-chat-text img,\n.ytp-fullscreen .ytc-danmaku-item img.emoji,\n.ytp-fullscreen .ytc-danmaku-item img.yt-emoji,\n.ytp-fullscreen .ytc-danmaku-item .emoji {\n    max-height: 28px !important;\n    max-width: 36px !important;\n    vertical-align: -4px !important;\n}\n\n/* ==========================================================================\n   ONBOARDING TOOLTIP KHI CÀI ĐẶT LẦN ĐẦU (FIRST-TIME USER EXPERIENCE)\n   ========================================================================== */\n#ytc-onboarding-tip {\n    position: fixed;\n    z-index: 100000;\n    width: 280px;\n    background: #18181b;\n    border: 1px solid rgba(255, 0, 51, 0.6);\n    border-radius: 10px;\n    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);\n    color: #fff;\n    padding: 12px 14px;\n    font-family: Roboto, Arial, sans-serif;\n    user-select: none;\n    box-sizing: border-box;\n    animation: ytc-fade-in 0.12s ease-out;\n}\n\n.ytc-onboarding-arrow {\n    position: absolute;\n    top: -6px;\n    right: 18px;\n    width: 10px;\n    height: 10px;\n    background: #18181b;\n    border-left: 1px solid rgba(255, 0, 51, 0.6);\n    border-top: 1px solid rgba(255, 0, 51, 0.6);\n    transform: rotate(45deg);\n}\n\n.ytc-onboarding-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    margin-bottom: 6px;\n}\n\n.ytc-onboarding-badge {\n    font-size: 10px;\n    font-weight: 700;\n    background: #ff0033;\n    color: #fff;\n    padding: 2px 6px;\n    border-radius: 4px;\n    letter-spacing: 0.5px;\n}\n\n.ytc-onboarding-close {\n    background: transparent;\n    border: none;\n    color: #aaa;\n    font-size: 13px;\n    cursor: pointer;\n    padding: 2px 4px;\n    line-height: 1;\n    border-radius: 4px;\n    transition: color 0.1s;\n}\n.ytc-onboarding-close:hover {\n    color: #fff;\n}\n\n.ytc-onboarding-title {\n    font-size: 13px;\n    font-weight: 700;\n    color: #fff;\n    line-height: 1.35;\n    margin-bottom: 4px;\n}\n\n.ytc-onboarding-desc {\n    font-size: 11.5px;\n    color: #ccc;\n    line-height: 1.4;\n    margin-bottom: 10px;\n}\n\n.ytc-onboarding-footer {\n    display: flex;\n    justify-content: flex-end;\n}\n\n.ytc-onboarding-btn {\n    background: #ff0033;\n    color: #fff;\n    border: none;\n    padding: 5px 14px;\n    font-size: 11.5px;\n    font-weight: 600;\n    border-radius: 6px;\n    cursor: pointer;\n    transition: background-color 0.15s;\n}\n.ytc-onboarding-btn:hover {\n    background: #cc0029;\n}\n\n/* --------------------------------------------------------------------------\n   CHẾ ĐỘ CHỈ PHÁT ÂM THANH (RADIO / AUDIO ONLY)\n   -------------------------------------------------------------------------- */\nhtml.ytc-audio-only #movie_player video,\nbody.ytc-audio-only #movie_player video {\n    visibility: hidden !important;\n}\n\n#ytc-audio-only-badge {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    text-align: center;\n    pointer-events: none;\n    user-select: none;\n    z-index: 30;\n    font-family: "YouTube Sans", Roboto, sans-serif;\n    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);\n    width: 90%;\n    max-width: 650px;\n}\n\n.ytc-audio-badge-title {\n    color: #ffffff;\n    font-size: clamp(22px, 2.5vw, 30px);\n    font-weight: 600;\n    letter-spacing: 0.4px;\n    line-height: 1.35;\n}\n\n.ytc-audio-badge-sub {\n    color: rgba(255, 255, 255, 0.65);\n    font-size: clamp(15px, 1.4vw, 19px);\n    font-weight: 400;\n    margin-top: 10px;\n    line-height: 1.4;\n}\n\n/* --------------------------------------------------------------------------\n   TAB 5: THÔNG TIN, NHÀ PHÁT TRIỂN & ỦNG HỘ\n   -------------------------------------------------------------------------- */\n.ytc-item-text-group {\n    display: flex;\n    flex-direction: column;\n    gap: 2px;\n    text-align: left;\n    min-width: 0;\n}\n.ytc-item-main-text {\n    font-size: 13.5px;\n    font-weight: 500;\n    color: inherit;\n    line-height: 1.2;\n}\n.ytc-item-sub-text {\n    font-size: 11px;\n    color: #888;\n    line-height: 1.2;\n}\nhtml:not([dark]) .ytc-item-sub-text {\n    color: #606060;\n}\n\n.ytc-info-card {\n    background: rgba(255, 255, 255, 0.04);\n    border: 1px solid rgba(255, 255, 255, 0.08);\n    border-radius: 8px;\n    padding: 8px 10px;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 8px;\n    margin-bottom: 2px;\n}\nhtml:not([dark]) .ytc-info-card {\n    background: rgba(0, 0, 0, 0.02);\n    border-color: rgba(0, 0, 0, 0.08);\n}\n.ytc-info-title-wrap {\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    min-width: 0;\n}\n.ytc-info-title {\n    font-weight: 600;\n    font-size: 13.5px;\n    white-space: nowrap;\n}\n.ytc-info-version {\n    display: inline-flex;\n    align-items: center;\n    font-size: 11px;\n    font-weight: 600;\n    color: #ff4e45;\n    background: rgba(255, 78, 69, 0.12);\n    border: 1px solid rgba(255, 78, 69, 0.25);\n    padding: 2px 8px;\n    border-radius: 6px;\n    letter-spacing: 0.5px;\n    user-select: none;\n    white-space: nowrap;\n}\nhtml:not([dark]) .ytc-info-version {\n    color: #cc0000;\n    background: rgba(204, 0, 0, 0.08);\n    border-color: rgba(204, 0, 0, 0.25);\n}\n.ytc-update-btn {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    gap: 5px;\n    padding: 5px 10px;\n    background: rgba(255, 255, 255, 0.08);\n    border: 1px solid rgba(255, 255, 255, 0.12);\n    color: #eee;\n    border-radius: 6px;\n    font-size: 11.5px;\n    font-weight: 500;\n    cursor: pointer;\n    transition: all 0.2s ease;\n    white-space: nowrap;\n    flex-shrink: 0;\n}\n.ytc-update-btn:hover {\n    background: rgba(255, 255, 255, 0.15);\n    color: #fff;\n    border-color: rgba(255, 255, 255, 0.2);\n}\n.ytc-update-btn svg {\n    width: 13px;\n    height: 13px;\n    fill: currentColor;\n    flex-shrink: 0;\n}\n.ytc-update-btn.ytc-btn-loading {\n    opacity: 0.8;\n    cursor: wait;\n}\n.ytc-update-btn.ytc-btn-success {\n    background: rgba(46, 204, 113, 0.15) !important;\n    color: #2ecc71 !important;\n    border-color: rgba(46, 204, 113, 0.35) !important;\n}\n.ytc-update-btn.ytc-btn-has-update {\n    background: rgba(255, 0, 51, 0.15) !important;\n    color: #ff4e45 !important;\n    border-color: rgba(255, 0, 51, 0.35) !important;\n}\nhtml:not([dark]) .ytc-update-btn {\n    background: rgba(0, 0, 0, 0.05);\n    border-color: rgba(0, 0, 0, 0.1);\n    color: #0f0f0f;\n}\nhtml:not([dark]) .ytc-update-btn:hover {\n    background: rgba(0, 0, 0, 0.1);\n}\n\n';

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
  var watchLoadTimeout = null;
  function setWatchLoading(loading, duration = 1500) {
    if (!location.pathname.startsWith("/watch")) {
      isWatchLoading = false;
      document.documentElement.classList.remove("ytc-fs-locked");
      clearTimeout(watchLoadTimeout);
      return;
    }
    isWatchLoading = loading;
    document.documentElement.classList.toggle("ytc-fs-locked", loading);
    clearTimeout(watchLoadTimeout);
    if (loading) {
      watchLoadTimeout = setTimeout(() => {
        isWatchLoading = false;
        document.documentElement.classList.remove("ytc-fs-locked");
      }, duration);
    }
  }
  var fsLockBound = false;
  function setupFullscreenLock() {
    if (fsLockBound) return;
    fsLockBound = true;
    document.addEventListener("click", (e) => {
      if (isWatchLoading && e.target.closest(".ytp-fullscreen-button")) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);
    document.addEventListener("dblclick", (e) => {
      if (isWatchLoading && e.target.closest("#movie_player")) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);
    document.addEventListener("fullscreenchange", () => {
      if (isWatchLoading && document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    });
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
    userIsRewound = true;
  }
  function snapToLive(player) {
    if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
    if (!player) player = document.querySelector("#movie_player:not(#inline-preview-player)");
    if (!player) return;
    if (!isCurrentlyActiveLive(player)) return;
    const liveBadge = player.querySelector(".ytp-live-badge");
    if (liveBadge && liveBadge.offsetParent !== null && window.getComputedStyle(liveBadge).display !== "none") {
      try {
        liveBadge.click();
        return;
      } catch (e) {
      }
    }
    try {
      if (typeof player.seekToStreamTime === "function") {
        player.seekToStreamTime(Infinity);
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
    if (delay > 12) {
      if (now - lastSnapTime > 1e4) {
        lastSnapTime = now;
        snapToLive(player);
        if (video.playbackRate !== 1) {
          video.playbackRate = 1;
        }
      }
      return;
    }
    if (delay > 7) {
      if (video.playbackRate !== 1.06) {
        video.playbackRate = 1.06;
      }
      return;
    }
    if (video.playbackRate !== 1) {
      video.playbackRate = 1;
    }
  }
  var initialSnapTimer = null;
  function checkInitialLiveSnap() {
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
            if (!userIsRewound && delay > 10) {
              clearInterval(initialSnapTimer);
              initialSnapTimer = null;
              lastSnapTime = Date.now();
              snapToLive(player);
              return;
            }
            if (delay <= 10) {
              clearInterval(initialSnapTimer);
              initialSnapTimer = null;
              return;
            }
          }
        }
      }
      if (attempts >= 25) {
        clearInterval(initialSnapTimer);
        initialSnapTimer = null;
      }
    }, 300);
  }
  function initAutoLiveSync() {
    if (autoLiveSyncTimer) return;
    autoLiveSyncTimer = setInterval(checkLiveSync, 2e3);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && currentConfig.autoLiveSync) {
        setTimeout(checkLiveSync, 500);
      }
    });
    document.addEventListener("click", (e) => {
      if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
      if (e.target.closest(".ytp-live-badge")) {
        const player = document.querySelector("#movie_player:not(#inline-preview-player)");
        if (player && isCurrentlyActiveLive(player)) {
          userIsRewound = false;
          lastUserSeekTime = 0;
          lastSnapTime = Date.now();
          snapToLive(player);
        }
      }
      if (e.target.closest(".ytp-progress-bar")) {
        const player = document.querySelector("#movie_player:not(#inline-preview-player)");
        if (!player || !isCurrentlyActiveLive(player)) return;
        lastUserSeekTime = Date.now();
        setTimeout(() => {
          const p = document.querySelector("#movie_player:not(#inline-preview-player)");
          if (!p || !isCurrentlyActiveLive(p)) return;
          const video = p.querySelector("video");
          const delay = getLiveDelay(p, video);
          if (delay > 15) {
            userIsRewound = true;
          } else {
            userIsRewound = false;
          }
        }, 300);
      }
    }, true);
    document.addEventListener("yt-navigate-start", resetAutoLiveState);
    document.addEventListener("yt-navigate-finish", () => {
      resetAutoLiveState();
      checkInitialLiveSnap();
    });
  }

  // src/player/shortcuts.js
  var seekModeTimer = null;
  function triggerCleanSeek(player) {
    if (!player) return;
    player.classList.add("seeking-mode");
    clearTimeout(seekModeTimer);
    seekModeTimer = setTimeout(() => {
      player.classList.remove("seeking-mode");
    }, 600);
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
  function dispatchYtSeek(key, delta) {
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
    const target = player || document.body || document;
    target.dispatchEvent(evDown);
    window.dispatchEvent(evDown);
    target.dispatchEvent(evUp);
    window.dispatchEvent(evUp);
    if (player && delta) {
      const tBefore = player.getCurrentTime ? player.getCurrentTime() : 0;
      setTimeout(() => {
        const tAfter = player.getCurrentTime ? player.getCurrentTime() : 0;
        if (Math.abs(tAfter - tBefore) < 1) {
          if (typeof player.seekBy === "function") {
            player.seekBy(delta);
          } else {
            const video = getPlayerVideo(player);
            if (video) video.currentTime += delta;
          }
        }
      }, 60);
    }
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
          dispatchYtSeek("j", -10);
          isSeekAction = true;
        } else if (code === "Numpad6" || e.key === "6" || e.key === "ArrowRight" || e.keyCode === 102 || e.keyCode === 39) {
          dispatchYtSeek("l", 10);
          isSeekAction = true;
        } else if (code === "Numpad5" || e.key === "5" || e.key === "Clear" || e.keyCode === 101 || e.keyCode === 12) {
          dispatchYtSeek("k");
        }
      } else if (asdAllowed && code === "KeyA") {
        captured = true;
        dispatchYtSeek("j", -10);
        isSeekAction = true;
      } else if (asdAllowed && code === "KeyS") {
        captured = true;
        dispatchYtSeek("k");
      } else if (asdAllowed && code === "KeyD") {
        captured = true;
        dispatchYtSeek("l", 10);
        isSeekAction = true;
      } else if (!e.ctrlKey && !e.altKey && !e.metaKey && (code === "KeyF" || e.key === "f" || e.key === "F")) {
        if (isWatchLoading) {
          captured = true;
        }
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
    document.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    document.addEventListener("keyup", handleKeyUp, true);
  }

  // src/player/liveDvr.js
  init_config();
  var liveDvrHooked = false;
  function patchData(data) {
    if (!currentConfig.unlockLiveDvr) return;
    if (!data || typeof data !== "object") return;
    if (data.videoDetails && data.videoDetails.isLive) {
      if (data.videoDetails.isLiveDvrEnabled === false) {
        data.videoDetails.isLiveDvrEnabled = true;
      }
    }
  }
  function initLiveDvrHook() {
    if (!currentConfig.unlockLiveDvr) return;
    if (liveDvrHooked) return;
    liveDvrHooked = true;
    try {
      const existingDesc = Object.getOwnPropertyDescriptor(window, "ytInitialPlayerResponse");
      let _val = window.ytInitialPlayerResponse;
      if (_val) patchData(_val);
      if (existingDesc && existingDesc.configurable === false) {
        if (window.ytInitialPlayerResponse) patchData(window.ytInitialPlayerResponse);
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
            patchData(_val);
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
        const res = origParse.apply(this, arguments);
        if (currentConfig.unlockLiveDvr && typeof text === "string" && text.includes("isLiveDvrEnabled") && res && typeof res === "object" && res.videoDetails && res.videoDetails.isLive && res.videoDetails.isLiveDvrEnabled === false) {
          res.videoDetails.isLiveDvrEnabled = true;
        }
        return res;
      };
    } catch (e) {
    }
  }

  // src/index.js
  init_chat();

  // src/ui/index.js
  init_sync();

  // src/ui/notifier.js
  init_constants();
  init_utils();
  var ONBOARDING_KEY = `ytc_onboarding_v${APP_VERSION.replace(/\./g, "_")}`;
  var updateCheckInitiated = false;
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

  // src/ui/panel.js
  init_config();
  init_utils();
  init_constants();
  init_sync();
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
                <div class="ytc-item" data-toggle="disableAmbient" title="Tắt ánh sáng viền xung quanh video (Ambient Mode) để giảm tải GPU">
                    <div class="ytc-item-left">
                        ${SPARKLE_SVG}
                        <span>Tắt ánh sáng video</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-ambient">
                        <input type="checkbox" id="ytc-chk-ambient" name="disableAmbient" aria-label="Tắt ánh sáng video" ${currentConfig.disableAmbient ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

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
            </div>

            <!-- TAB 5: THÔNG TIN & HỖ TRỢ -->
            <div class="ytc-tab-pane" id="ytc-pane-info">
                <!-- Thẻ phiên bản & Nút cập nhật tinh gọn -->
                <div class="ytc-info-card">
                    <div class="ytc-info-title-wrap">
                        <span class="ytc-info-title">YouTube Customizer</span>
                        <span class="ytc-info-version">v${APP_VERSION}</span>
                    </div>
                    <button class="ytc-update-btn" id="ytc-btn-update" title="Kiểm tra bản cập nhật mới nhất từ GitHub">
                        ${UPDATE_SVG}
                        <span id="ytc-update-btn-text">Cập nhật</span>
                    </button>
                </div>

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
          if (key === "audioOnlyMode") {
            Promise.resolve().then(() => (init_audioOnly(), audioOnly_exports)).then((m) => {
              if (m && typeof m.applyAudioOnlyState === "function") {
                m.applyAudioOnlyState();
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
        });
        item.addEventListener("click", (e) => {
          if (!e.target.closest(".ytc-switch")) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event("change"));
          }
        });
      });
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
        updateBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          if (isChecking) return;
          isChecking = true;
          updateBtn.disabled = true;
          updateBtn.classList.remove("ytc-btn-success", "ytc-btn-has-update");
          updateBtn.classList.add("ytc-btn-loading");
          if (updateBtnText) updateBtnText.textContent = "Đang kiểm tra...";
          try {
            const res = await fetch(`https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/package.json?t=${Date.now()}`);
            if (res.ok) {
              const pkg = await res.json();
              if (pkg.version && pkg.version !== APP_VERSION) {
                updateBtn.classList.remove("ytc-btn-loading");
                updateBtn.classList.add("ytc-btn-has-update");
                if (updateBtnText) updateBtnText.textContent = `Có bản mới v${pkg.version}!`;
                setTimeout(() => {
                  window.open(`https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=${pkg.version}`, "_blank");
                }, 500);
              } else {
                updateBtn.classList.remove("ytc-btn-loading");
                updateBtn.classList.add("ytc-btn-success");
                if (updateBtnText) updateBtnText.textContent = "✓ Bản mới nhất";
                setTimeout(() => {
                  updateBtn.classList.remove("ytc-btn-success");
                  if (updateBtnText) updateBtnText.textContent = "Cập nhật";
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
            if (updateBtnText) updateBtnText.textContent = "Cập nhật";
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
    dialogObserver = new MutationObserver(() => {
      if (currentConfig.preventAutoPause) {
        checkAndDismissPauseDialog();
      }
    });
    const target = document.querySelector("ytd-app") || document.body || document.documentElement;
    dialogObserver.observe(target, { childList: true, subtree: true });
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
        autoCollapseNativeChatIfOpen();
        setTimeout(autoCollapseNativeChatIfOpen, 300);
        setTimeout(autoCollapseNativeChatIfOpen, 800);
        setTimeout(autoCollapseNativeChatIfOpen, 1500);
        setTimeout(autoCollapseNativeChatIfOpen, 2500);
        setTimeout(autoCollapseNativeChatIfOpen, 4e3);
      }
      initAutoLiveSync();
      resetAutoLiveState();
      checkInitialLiveSnap();
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
    });
    applyConfigToRoot();
    bindGlobalKeys();
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
    if (location.pathname.startsWith("/watch")) {
      setWatchLoading(true);
    }
    if (isHomeFeedPath()) {
      whenElement("ytd-rich-grid-renderer", applyHomeGridColumns);
      let gridRetryCount = 0;
      const gridRetryInterval = setInterval(() => {
        gridRetryCount++;
        applyHomeGridColumns();
        if (gridRetryCount >= 10 && document.querySelector("ytd-rich-grid-renderer ytd-rich-item-renderer")) {
          clearInterval(gridRetryInterval);
        }
      }, 250);
    }
  }
})();
