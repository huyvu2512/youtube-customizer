// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.2.17
// @description  YouTube Customizer v3.2.17 — Khắc phục lỗi xem trước video (inline preview) khi di chuột trên lưới trang chủ và tối ưu Auto Live.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
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
  var APP_VERSION, CONFIG_KEY, CHAT_OFF_SVG, EMOJI_OFF_SVG, GEAR_SVG, GRID_SVG, SHORTS_SVG, GAMEPAD_SVG, YOUTUBE_SVG, SEARCH_SVG, SPARKLE_SVG, KEYBOARD_SVG, CROWN_SVG, COMPASS_SVG, LAYOUT_TAB_SVG, SHIELD_TAB_SVG, PLAYER_TAB_SVG, POST_SVG, ENDSCREEN_SVG, BELL_OFF_SVG, WATERMARK_SVG, REWIND_SVG, MESSAGE_SVG, RADIO_SVG;
  var init_constants = __esm({
    "src/core/constants.js"() {
      APP_VERSION = "3.2.17";
      CONFIG_KEY = "ytc_config";
      CHAT_OFF_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`;
      EMOJI_OFF_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`;
      GEAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>`;
      GRID_SVG = `<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z"/></svg>`;
      SHORTS_SVG = `<svg viewBox="0 0 24 24"><path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.5v-5l4.5 2.5-4.5 2.5z"/></svg>`;
      GAMEPAD_SVG = `<svg viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S20.17 9 21 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`;
      YOUTUBE_SVG = `<svg viewBox="0 0 24 24"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/></svg>`;
      SEARCH_SVG = `<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z"/></svg>`;
      SPARKLE_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2z"/></svg>`;
      KEYBOARD_SVG = `<svg viewBox="0 0 24 24"><path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>`;
      CROWN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`;
      COMPASS_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-5.5l2.87-6.26L15.63 5.37l-2.87 6.26L6.5 14.5zm5.5-1.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/></svg>`;
      LAYOUT_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M4 4h16v4H4V4zm0 6h7v10H4V10zm9 0h7v10h-7V10z"/></svg>`;
      SHIELD_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>`;
      PLAYER_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/></svg>`;
      POST_SVG = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`;
      ENDSCREEN_SVG = `<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-4h6v4zm6 0h-5v-4h5v4zm0-6H6V7h12v4z"/></svg>`;
      BELL_OFF_SVG = `<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>`;
      WATERMARK_SVG = `<svg viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-7-6h5v4h-5v-4z"/></svg>`;
      REWIND_SVG = `<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1 4v5l4.25 2.52.77-1.28-3.52-2.09V9H11z"/></svg>`;
      MESSAGE_SVG = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zm-9-5h2v2h-2zm-4 0h2v2H7zm8 0h2v2h-2z"/></svg>`;
      RADIO_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>`;
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
    root.classList.toggle("ytc-hide-explore", !!currentConfig.hideExploreTopics);
    root.classList.toggle("ytc-hide-community", !!currentConfig.hideCommunity);
    root.classList.toggle("ytc-hide-endscreen", !!currentConfig.hideEndscreen);
    root.classList.toggle("ytc-hide-watermark", !!currentConfig.hideWatermark);
    root.classList.toggle("ytc-auto-dismiss", !!currentConfig.autoDismissPromos);
    root.classList.toggle("ytc-premium-logo", !!currentConfig.premiumLogo);
    root.classList.toggle("ytc-clean-search", !!currentConfig.cleanSearch);
    root.classList.toggle("ytc-disable-ambient", !!currentConfig.disableAmbient);
    root.classList.toggle("ytc-hide-native-chat", !!currentConfig.hideNativeLiveChat);
    root.setAttribute("data-ytc-cols", String(currentConfig.columns || 3));
    root.setAttribute("data-ytc-chat", currentConfig.chatOverlay || "off");
    if (document.body) {
      document.body.classList.toggle("ytc-hide-shorts", !!currentConfig.hideShorts);
      document.body.classList.toggle("ytc-hide-playables", !!currentConfig.hidePlayables);
      document.body.classList.toggle("ytc-hide-members", !!currentConfig.hideMembersOnly);
      document.body.classList.toggle("ytc-hide-explore", !!currentConfig.hideExploreTopics);
      document.body.classList.toggle("ytc-hide-community", !!currentConfig.hideCommunity);
      document.body.classList.toggle("ytc-hide-endscreen", !!currentConfig.hideEndscreen);
      document.body.classList.toggle("ytc-hide-watermark", !!currentConfig.hideWatermark);
      document.body.classList.toggle("ytc-auto-dismiss", !!currentConfig.autoDismissPromos);
      document.body.classList.toggle("ytc-premium-logo", !!currentConfig.premiumLogo);
      document.body.classList.toggle("ytc-clean-search", !!currentConfig.cleanSearch);
      document.body.classList.toggle("ytc-disable-ambient", !!currentConfig.disableAmbient);
      document.body.classList.toggle("ytc-hide-native-chat", !!currentConfig.hideNativeLiveChat);
      document.body.setAttribute("data-ytc-cols", String(currentConfig.columns || 3));
      document.body.setAttribute("data-ytc-chat", currentConfig.chatOverlay || "off");
    }
    configListeners.forEach((fn) => {
      try {
        fn(currentConfig);
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
        premiumLogo: false,
        // Logo YouTube Premium (mặc định tắt)
        cleanSearch: false,
        // Ẩn video tài trợ / quảng cáo tìm kiếm (mặc định tắt)
        disableAmbient: false,
        // Tắt Ambient Mode (Cinematics) (mặc định tắt)
        keyboardControls: false,
        // Phím tắt A-S-D & Numpad (mặc định tắt)
        hideNativeLiveChat: false,
        // Tự động ẩn khung trò chuyện trực tiếp mặc định (mặc định tắt)
        hideChatEmojis: false
        // Ẩn biểu tượng cảm xúc (Emoji/Sticker) trong Live Chat (mặc định tắt)
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
  var ytcPolicy;
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
    const avatarEl = node.querySelector("#author-photo img, yt-img-shadow#author-photo img");
    const avatarSrc = avatarEl ? avatarEl.src || avatarEl.getAttribute("src") || "" : "";
    let streamerBadges = [];
    const badgeEls = Array.from(node.querySelectorAll("#chat-badges yt-live-chat-author-badge-renderer"));
    for (const b of badgeEls) {
      const type = (b.getAttribute("type") || "").toLowerCase();
      const aria = (b.getAttribute("aria-label") || "").toLowerCase();
      if (type === "moderator" || aria.includes("moderator") || aria.includes("điều hành") || aria.includes("kiểm duyệt")) {
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
      const avatarMarkup = data.avatarSrc ? `<img class="ytc-box-avatar" src="${data.avatarSrc}" alt="">` : "";
      const badgeMarkup = data.streamerBadgeHtml ? `${data.streamerBadgeHtml} ` : "";
      setElementHTML(item, `
            ${avatarMarkup}
            <div class="ytc-box-content">
                <span class="ytc-chat-author ${data.authorClass || ""}">@${data.author}:</span> ${badgeMarkup}<span class="ytc-chat-text">${data.messageHtml}</span>
            </div>
        `);
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
  }
  var init_sync = __esm({
    "src/ui/sync.js"() {
      init_config();
    }
  });

  // src/chat/chatObserver.js
  function resetChatCollapseState() {
    userManuallyOpenedChat = false;
    hasAutoCollapsedChatForCurrentVideo = false;
  }
  function autoCollapseNativeChatIfOpen() {
    const shouldCollapse = currentConfig.chatOverlay && currentConfig.chatOverlay !== "off" || !!currentConfig.hideNativeLiveChat;
    if (!shouldCollapse) return;
    if (userManuallyOpenedChat && !currentConfig.hideNativeLiveChat) return;
    if (hasAutoCollapsedChatForCurrentVideo) return;
    const chatFrame = document.querySelector("ytd-live-chat-frame#chat, #chat.ytd-watch-flexy");
    const watchFlexy = document.querySelector("ytd-watch-flexy");
    if (!chatFrame) return;
    const isCollapsed = chatFrame.hasAttribute("collapsed") || watchFlexy && watchFlexy.hasAttribute("chat-collapsed");
    if (!isCollapsed) {
      const hideBtn = chatFrame.querySelector(
        '#show-hide-button button, #close-button button, #close-button, [aria-label*="Ẩn cuộc trò chuyện" i], [aria-label*="Hide chat" i], ytd-button-renderer#show-hide-button button, yt-button-shape button'
      );
      if (hideBtn) {
        hasAutoCollapsedChatForCurrentVideo = true;
        try {
          hideBtn.click();
        } catch (e) {
        }
      }
    } else {
      hasAutoCollapsedChatForCurrentVideo = true;
    }
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
    const isOpen = isNativeChatOpenInFullscreen();
    if (isOpen) {
      userManuallyOpenedChat = true;
      if (isNativeChatHiddenByScript) {
        setNativeChatHiddenState(false);
      }
    } else {
      if (userManuallyOpenedChat && !isNativeChatHiddenByScript) {
        userManuallyOpenedChat = false;
        if (currentConfig.chatOverlay && currentConfig.chatOverlay !== "off") {
          setNativeChatHiddenState(true);
        }
      }
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
        '#panels-full-bleed-container #visibility-button, #panels-full-bleed-container #close-button, #panels-full-bleed-container [aria-label*="Đóng" i], #panels-full-bleed-container [aria-label*="Close" i], ytd-engagement-panel-section-list-renderer #visibility-button, ytd-engagement-panel-section-list-renderer #close-button, ytd-engagement-panel-section-list-renderer [aria-label*="Đóng" i], ytd-engagement-panel-section-list-renderer [aria-label*="Close" i], ytd-live-chat-frame #show-hide-button button, ytd-live-chat-frame #close-button button, ytd-live-chat-frame #close-button, [aria-label*="Ẩn cuộc trò chuyện" i], [aria-label*="Thu gọn cuộc trò chuyện" i], [aria-label*="Hide chat" i], [aria-label*="Collapse live chat" i], [aria-label*="Close chat" i]'
      );
      if (isCloseBtn) {
        userManuallyOpenedChat = false;
        const isFs = !!(document.fullscreenElement || document.querySelector("#movie_player.ytp-fullscreen"));
        if (isFs && currentConfig.chatOverlay && currentConfig.chatOverlay !== "off") {
          setNativeChatHiddenState(true);
        }
        return;
      }
      const isChatBtn = !!e.target.closest(
        '.ytp-live-chat-button, .ytp-chat-button, button[data-tooltip-target-id*="chat" i], [aria-label*="trò chuyện" i], [aria-label*="chat" i], [aria-label*="cuộc trò chuyện" i], [title*="trò chuyện" i], [title*="chat" i], [target-id*="chat" i], [target-id*="engagement-panel" i], [data-target-id*="chat" i], [data-target-id*="engagement-panel" i], [aria-controls*="chat" i], [aria-controls*="engagement" i], #show-hide-button button, button#show-button, #show-button, [aria-label*="Hiện cuộc trò chuyện" i], [aria-label*="Mở rộng cuộc trò chuyện" i], [aria-label*="Mở bảng điều khiển" i], [aria-label*="Show chat" i], [aria-label*="Expand live chat" i], [aria-label*="Open panel" i], ytd-live-chat-frame[collapsed] #teaser, ytd-live-chat-frame[collapsed] ytd-button-renderer, ytd-live-chat-frame[collapsed] yt-button-shape'
      );
      if (isChatBtn) {
        const isFs = !!(document.fullscreenElement || document.querySelector("#movie_player.ytp-fullscreen"));
        if (isFs) {
          if (!isNativeChatOpenInFullscreen()) {
            userManuallyOpenedChat = true;
            setNativeChatHiddenState(false);
          } else {
            userManuallyOpenedChat = false;
          }
        } else {
          userManuallyOpenedChat = true;
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
      autoCollapseNativeChatIfOpen();
    }
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
    bgChatIframe.src = `https://www.youtube.com/live_chat?v=${videoId}`;
    bgChatIframe.style.cssText = "position:fixed !important;top:-9999px !important;left:-9999px !important;width:350px !important;height:600px !important;opacity:0.01 !important;pointer-events:none !important;z-index:-9999 !important;border:none !important;";
    document.body.appendChild(bgChatIframe);
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
      if (bgChatIframe) {
        bgChatIframe.remove();
        bgChatIframe = null;
        currentBgVideoId = null;
      }
    }
  }
  function initIframeChatSender() {
    function handleNode(node) {
      if (!node || node.nodeType !== 1) return;
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
              newNodes.push(node);
            } else if (node.querySelectorAll) {
              const targets = node.querySelectorAll(selector);
              targets.forEach((t) => newNodes.push(t));
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
      if (e.data && e.data.type === "YTC_REQUEST_EXISTING_MSGS") {
        const items = document.querySelector("yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #chat #items, #items") || document;
        if (items) sendExisting(items);
      }
    });
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
        if (scroller && !scroller.matches(":hover")) {
          const distFromBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
          if (distFromBottom > 50) {
            scroller.scrollTop = scroller.scrollHeight;
          }
        }
      } catch (e) {
      }
    }, 2e3);
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
    const frames = document.querySelectorAll('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"]');
    frames.forEach((frame) => {
      if (!frame._ytcLoadBound) {
        frame._ytcLoadBound = true;
        frame.addEventListener("load", () => {
          setTimeout(findAndObserveItems, 300);
          setTimeout(findAndObserveItems, 1e3);
        });
      }
      try {
        const doc = frame.contentDocument || frame.contentWindow?.document;
        if (doc) {
          const iframeItems = doc.querySelectorAll("yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #items");
          iframeItems.forEach((items) => observeItemsElement(items));
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
    });
    findAndObserveItems();
    setInterval(() => {
      if (currentConfig.hideNativeLiveChat) {
        autoCollapseNativeChatIfOpen();
      }
      if (currentConfig.chatOverlay && currentConfig.chatOverlay !== "off") {
        findAndObserveItems();
        ensureNativeLiveChatRunning();
        ensureBackgroundLiveChat();
        try {
          if (!isUserInteractingWithChatMenu(document)) {
            const showMore = document.querySelector("#show-more:not([hidden]) button, #show-more button");
            if (showMore && showMore.offsetParent !== null) {
              const rect = showMore.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                showMore.click();
              }
            }
            const scroller = document.querySelector("#item-scroller, yt-live-chat-item-list-renderer #item-scroller");
            if (scroller && !scroller.matches(":hover")) {
              const dist = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
              if (dist > 50) scroller.scrollTop = scroller.scrollHeight;
            }
          }
        } catch (e) {
        }
      }
    }, 2e3);
    if (location.pathname.startsWith("/watch") || location.pathname.startsWith("/live")) {
      whenElement("#movie_player:not(#inline-preview-player)", () => {
        observePlayerChatState();
        observeFullscreenChatPanels();
        ensureChatOverlayContainers();
        ensureBackgroundLiveChat();
        if (currentConfig.chatOverlay && currentConfig.chatOverlay !== "off") {
          ensureNativeLiveChatRunning();
        }
      });
    }
  }
  var userManuallyOpenedChat, hasAutoCollapsedChatForCurrentVideo, chatToggleListenersBound, ensureNativeLiveChatRunning, bgChatIframe, currentBgVideoId;
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
      chatToggleListenersBound = false;
      ensureNativeLiveChatRunning = syncNativeChatState;
      bgChatIframe = null;
      currentBgVideoId = null;
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
    getCurrentLiveVideoId: () => getCurrentLiveVideoId,
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
    requestExistingMessages: () => requestExistingMessages,
    resetChatCollapseState: () => resetChatCollapseState,
    saveChatBoxPos: () => saveChatBoxPos,
    seenMessageIds: () => seenMessageIds,
    setChatOverlayInitialized: () => setChatOverlayInitialized,
    setLastDanmakuSpawnTime: () => setLastDanmakuSpawnTime,
    setLastSpawnedLane: () => setLastSpawnedLane,
    setNativeChatHiddenState: () => setNativeChatHiddenState,
    setupChatBoxInteractions: () => setupChatBoxInteractions,
    setupChatToggleListeners: () => setupChatToggleListeners,
    showInitialBox: () => showInitialBox,
    startDanmakuScheduler: () => startDanmakuScheduler,
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

  // src/styles.css
  var styles_default = '/* ==========================================================================\n   YOUTUBE CUSTOMIZER - TẬP HỢP TOÀN BỘ ĐỊNH KIỂU CSS\n   ========================================================================== */\n\n/* --------------------------------------------------------------------------\n   1. LƯỚI VIDEO TRANG CHỦ & FEED: ÉP 3/4/5 CỘT CHUẨN XÁC\n   (Độ ưu tiên cao nhất, cố định vĩnh viễn khi F5 tải lại trang)\n   -------------------------------------------------------------------------- */\n@media (min-width: 900px) {\n    ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,\n    ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer,\n    ytd-browse[page-subtype="channels"] ytd-rich-grid-renderer,\n    #page-manager ytd-browse ytd-rich-grid-renderer,\n    ytd-rich-grid-renderer.ytc-grid,\n    ytd-rich-grid-renderer {\n        --ytd-rich-grid-items-per-row: 3 !important;\n        --ytd-rich-grid-posts-per-row: 3 !important;\n        --ytd-rich-grid-item-max-width: none !important;\n    }\n\n    html[data-ytc-cols="3"] #page-manager ytd-rich-grid-renderer,\n    html[data-ytc-cols="3"] ytd-rich-grid-renderer,\n    body[data-ytc-cols="3"] #page-manager ytd-rich-grid-renderer,\n    body[data-ytc-cols="3"] ytd-rich-grid-renderer,\n    [data-ytc-cols="3"] #page-manager ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="3"] #page-manager ytd-rich-grid-renderer,\n    [data-ytc-cols="3"] ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="3"] ytd-rich-grid-renderer {\n        --ytd-rich-grid-items-per-row: 3 !important;\n        --ytd-rich-grid-posts-per-row: 3 !important;\n        --ytd-rich-grid-item-max-width: none !important;\n    }\n\n    html[data-ytc-cols="4"] #page-manager ytd-rich-grid-renderer,\n    html[data-ytc-cols="4"] ytd-rich-grid-renderer,\n    body[data-ytc-cols="4"] #page-manager ytd-rich-grid-renderer,\n    body[data-ytc-cols="4"] ytd-rich-grid-renderer,\n    [data-ytc-cols="4"] #page-manager ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="4"] #page-manager ytd-rich-grid-renderer,\n    [data-ytc-cols="4"] ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="4"] ytd-rich-grid-renderer {\n        --ytd-rich-grid-items-per-row: 4 !important;\n        --ytd-rich-grid-posts-per-row: 4 !important;\n        --ytd-rich-grid-item-max-width: none !important;\n    }\n\n    html[data-ytc-cols="5"] #page-manager ytd-rich-grid-renderer,\n    html[data-ytc-cols="5"] ytd-rich-grid-renderer,\n    body[data-ytc-cols="5"] #page-manager ytd-rich-grid-renderer,\n    body[data-ytc-cols="5"] ytd-rich-grid-renderer,\n    [data-ytc-cols="5"] #page-manager ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="5"] #page-manager ytd-rich-grid-renderer,\n    [data-ytc-cols="5"] ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="5"] ytd-rich-grid-renderer {\n        --ytd-rich-grid-items-per-row: 5 !important;\n        --ytd-rich-grid-posts-per-row: 5 !important;\n        --ytd-rich-grid-item-max-width: none !important;\n    }\n\n    /* Làm phẳng cấu trúc dòng ytd-rich-grid-row để thẻ video chảy đều như trang kênh và chuẩn hitbox hover */\n    #contents > ytd-rich-grid-row,\n    #contents > ytd-rich-grid-row > #contents {\n        display: contents !important;\n    }\n\n    #contents.ytd-rich-grid-row ytd-rich-item-renderer,\n    ytd-rich-grid-renderer ytd-rich-item-renderer {\n        width: calc(100% / var(--ytd-rich-grid-items-per-row, 3) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n        max-width: calc(100% / var(--ytd-rich-grid-items-per-row, 3) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n    }\n\n    [data-ytc-cols="3"] #contents.ytd-rich-grid-row ytd-rich-item-renderer,\n    [data-ytc-cols="3"] ytd-rich-grid-renderer ytd-rich-item-renderer {\n        width: calc(100% / 3 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n        max-width: calc(100% / 3 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n    }\n\n    [data-ytc-cols="4"] #contents.ytd-rich-grid-row ytd-rich-item-renderer,\n    [data-ytc-cols="4"] ytd-rich-grid-renderer ytd-rich-item-renderer {\n        width: calc(100% / 4 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n        max-width: calc(100% / 4 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n    }\n\n    [data-ytc-cols="5"] #contents.ytd-rich-grid-row ytd-rich-item-renderer,\n    [data-ytc-cols="5"] ytd-rich-grid-renderer ytd-rich-item-renderer {\n        width: calc(100% / 5 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n        max-width: calc(100% / 5 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n    }\n}\n\n/* --------------------------------------------------------------------------\n   2. TỐI ƯU HIỆU NĂNG, KHUNG HÌNH & LIVE CHAT (ZERO-LAG)\n   -------------------------------------------------------------------------- */\n/* Đảm bảo khung xem trước video inline khi hover không bao giờ bị cắt xén hay che khuất */\n#page-manager ytd-rich-grid-row {\n    overflow: visible !important;\n}\n\n#page-manager ytd-rich-grid-row:hover,\n#page-manager ytd-rich-grid-row:has(ytd-video-preview, [is-hovered], [has-preview]) {\n    z-index: 10 !important;\n    position: relative !important;\n    overflow: visible !important;\n}\n\n#page-manager ytd-rich-item-renderer {\n    overflow: visible !important;\n}\n\n#page-manager ytd-rich-item-renderer:hover,\n#page-manager ytd-rich-item-renderer:has(ytd-video-preview, [is-hovered], [has-preview]),\n#page-manager ytd-rich-item-renderer[is-hovered],\n#page-manager ytd-rich-item-renderer[has-preview] {\n    z-index: 20 !important;\n    position: relative !important;\n    overflow: visible !important;\n}\n\n/* Đặt z-index của #preview và ytd-video-preview lên 1000 !important để luôn nổi lên trên thẻ video khi hover */\n#preview,\n#preview.ytd-rich-grid-renderer,\nytd-rich-grid-renderer #preview,\n#page-manager #preview,\nytd-video-preview,\n#video-preview,\n#media-container.ytd-video-preview,\nytd-video-preview #media-container,\nytd-video-preview #player-container,\nytd-moving-thumbnail-renderer,\n#inline-preview-player {\n    z-index: 1000 !important;\n    overflow: visible !important;\n    pointer-events: auto !important;\n}\n\nytd-comment-thread-renderer {\n    content-visibility: auto;\n    contain-intrinsic-size: auto 200px;\n}\n\n@keyframes ytcConfirmInserted {\n    from { clip-path: inset(0); }\n    to { clip-path: inset(0); }\n}\nyt-confirm-dialog-renderer {\n    animation: ytcConfirmInserted 0.001s;\n}\n\n#movie_player.seeking-mode .ytp-chrome-bottom,\n#movie_player.seeking-mode .ytp-gradient-bottom,\n#movie_player.seeking-mode .ytp-chrome-top {\n    opacity: 0 !important;\n    transition: opacity 0.15s ease;\n}\n#movie_player.seeking-mode {\n    cursor: none !important;\n}\n\n.ytc-fs-locked .ytp-fullscreen-button {\n    opacity: 0.35 !important;\n    pointer-events: none !important;\n    cursor: not-allowed !important;\n    transition: opacity 0.2s ease !important;\n}\n\nytd-live-chat-frame#chat,\n#chat.ytd-watch-flexy,\niframe#chatframe {\n    contain: layout style paint !important;\n}\n\nyt-live-chat-text-message-renderer,\nyt-live-chat-paid-message-renderer,\nyt-live-chat-membership-item-renderer {\n    content-visibility: auto !important;\n    contain-intrinsic-size: auto 32px !important;\n}\n\n/* --------------------------------------------------------------------------\n   3. BỘ LỌC NỘI DUNG: SHORTS, CHƠI GAME, HỘI VIÊN, KHÁM PHÁ, CỘNG ĐỒNG, CLEAN SEARCH\n   -------------------------------------------------------------------------- */\n.ytc-hide-shorts ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),\n.ytc-hide-shorts ytd-rich-section-renderer:has(ytd-reel-shelf-renderer),\n.ytc-hide-shorts ytd-rich-shelf-renderer[is-shorts],\n.ytc-hide-shorts ytd-reel-shelf-renderer,\n.ytc-hide-shorts ytd-guide-entry-renderer:has(a[href^="/shorts"]),\n.ytc-hide-shorts ytd-mini-guide-entry-renderer:has(a[href^="/shorts"]),\n.ytc-hide-shorts ytd-guide-entry-renderer a[title="Shorts"],\n.ytc-hide-shorts ytd-mini-guide-entry-renderer[aria-label="Shorts"],\n.ytc-hide-shorts #endpoint[title="Shorts"],\n.ytc-hide-shorts ytd-mealbar-promo-renderer,\n.ytc-hide-shorts ytd-upsell-dialog-renderer {\n    display: none !important;\n}\n\n.ytc-hide-playables ytd-rich-section-renderer:has([is-mini-game-card-shelf]),\n.ytc-hide-playables ytd-rich-shelf-renderer[is-mini-game-card-shelf],\n.ytc-hide-playables ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-mini-game-card-shelf]),\n.ytc-hide-playables ytd-rich-section-renderer:has(a[href*="/playables"]),\n.ytc-hide-playables ytd-rich-section-renderer:has(a[href*="playables"]),\n.ytc-hide-playables ytd-guide-entry-renderer:has(a[href*="/playables"]),\n.ytc-hide-playables ytd-mini-guide-entry-renderer:has(a[href*="/playables"]),\n.ytc-hide-playables ytd-guide-entry-renderer a[title*="Chơi game"],\n.ytc-hide-playables ytd-guide-entry-renderer a[title*="Playables"],\n.ytc-hide-playables ytd-mini-guide-entry-renderer[aria-label*="Chơi game"],\n.ytc-hide-playables ytd-mini-guide-entry-renderer[aria-label*="Playables"],\n.ytc-hide-playables #endpoint[title*="Chơi game"],\n.ytc-hide-playables #endpoint[title*="Playables"] {\n    display: none !important;\n}\n\n.ytc-hide-members ytd-rich-section-renderer:has(.badge-style-type-members-only),\n.ytc-hide-members ytd-rich-section-renderer:has(.badge-style-type-members-first),\n.ytc-hide-members ytd-rich-section-renderer:has([badge-style="MEMBERS_FIRST"]),\n.ytc-hide-members ytd-rich-section-renderer:has([badge-style="MEMBERS_ONLY"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="hội viên"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Hội viên"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Members only"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="members only"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Members first"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="members first"]),\n.ytc-hide-members ytd-rich-section-renderer:has(a[href*="/membership"]),\n.ytc-hide-members ytd-rich-section-renderer:has(a[href*="/memberships"]),\n.ytc-hide-members ytd-rich-section-renderer.ytc-shelf-members,\n.ytc-hide-members ytd-rich-item-renderer:has(.badge-style-type-members-only),\n.ytc-hide-members ytd-rich-item-renderer:has(.badge-style-type-members-first),\n.ytc-hide-members ytd-rich-item-renderer:has([badge-style="MEMBERS_FIRST"]),\n.ytc-hide-members ytd-rich-item-renderer:has([badge-style="MEMBERS_ONLY"]),\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="hội viên"]),\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Hội viên"]),\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Members only"]),\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Members first"]),\n.ytc-hide-members ytd-rich-item-renderer.ytc-item-members,\n.ytc-hide-members ytd-video-renderer:has(.badge-style-type-members-only),\n.ytc-hide-members ytd-video-renderer:has(.badge-style-type-members-first),\n.ytc-hide-members ytd-video-renderer:has([badge-style="MEMBERS_FIRST"]),\n.ytc-hide-members ytd-video-renderer:has([badge-style="MEMBERS_ONLY"]),\n.ytc-hide-members ytd-video-renderer:has([aria-label*="hội viên"]),\n.ytc-hide-members ytd-video-renderer:has([aria-label*="Hội viên"]),\n.ytc-hide-members ytd-video-renderer.ytc-item-members,\n.ytc-hide-members ytd-compact-video-renderer:has(.badge-style-type-members-only),\n.ytc-hide-members ytd-compact-video-renderer:has(.badge-style-type-members-first),\n.ytc-hide-members ytd-compact-video-renderer:has([badge-style="MEMBERS_FIRST"]),\n.ytc-hide-members ytd-compact-video-renderer:has([badge-style="MEMBERS_ONLY"]),\n.ytc-hide-members ytd-compact-video-renderer.ytc-item-members {\n    display: none !important;\n}\n\n.ytc-hide-explore ytd-rich-section-renderer:has(yt-chip-cloud-chip-renderer),\n.ytc-hide-explore ytd-rich-section-renderer:has(yt-chip-cloud-renderer),\n.ytc-hide-explore ytd-rich-section-renderer:has(ytd-feed-filter-chip-bar-renderer),\n.ytc-hide-explore ytd-rich-section-renderer:has(#chips),\n.ytc-hide-explore ytd-rich-section-renderer.ytc-shelf-explore,\n.ytc-hide-explore ytd-rich-section-renderer:has([title*="Khám phá các chủ đề"]),\n.ytc-hide-explore ytd-rich-section-renderer:has([title*="Explore other topics"]),\n.ytc-hide-explore ytd-rich-section-renderer:has([title*="Explore topics"]) {\n    display: none !important;\n}\n\n.ytc-clean-search ytd-ad-slot-renderer,\n.ytc-clean-search ytd-rich-item-renderer:has(ytd-ad-slot-renderer),\n.ytc-clean-search ytd-rich-section-renderer:has(ytd-ad-slot-renderer),\n.ytc-clean-search ytd-video-renderer:has(.badge-style-type-ad) {\n    display: none !important;\n}\n\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-post-renderer),\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-backstage-post-renderer),\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-backstage-post-thread-renderer),\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-post-multi-image-renderer),\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-poll-renderer),\n.ytc-hide-community ytd-rich-section-renderer.ytc-shelf-community,\n.ytc-hide-community ytd-rich-item-renderer:has(ytd-post-renderer),\n.ytc-hide-community ytd-rich-item-renderer:has(ytd-backstage-post-renderer),\n.ytc-hide-community ytd-rich-item-renderer.ytc-item-community,\n.ytc-hide-community ytd-post-renderer,\n.ytc-hide-community ytd-backstage-post-renderer,\n.ytc-hide-community ytd-backstage-post-thread-renderer {\n    display: none !important;\n}\n\n/* --------------------------------------------------------------------------\n   4. TRÌNH PHÁT VIDEO: AMBIENT, THẺ KẾT THÚC, BANNER & LOGO PREMIUM\n   -------------------------------------------------------------------------- */\n.ytc-disable-ambient #cinematics,\n.ytc-disable-ambient ytd-cinematics-renderer,\n.ytc-disable-ambient .ytp-ambient-mode-rendering-container {\n    display: none !important;\n}\n\n.ytc-hide-endscreen .ytp-ce-element,\n.ytc-hide-endscreen .ytp-ce-covering-overlay,\n.ytc-hide-endscreen .ytp-ce-element-show,\n.ytc-hide-endscreen .ytp-ce-video,\n.ytc-hide-endscreen .ytp-ce-playlist,\n.ytc-hide-endscreen .ytp-ce-channel,\n.ytc-hide-endscreen .ytp-ce-subscribe,\n.ytc-hide-endscreen .ytp-cards-button,\n.ytc-hide-endscreen .ytp-cards-teaser,\n.ytc-hide-endscreen .ytp-cards-teaser-box,\n.ytc-hide-endscreen .ytp-card {\n    display: none !important;\n    opacity: 0 !important;\n    pointer-events: none !important;\n}\n\n/* Ẩn logo hình mờ kênh ở góc dưới bên phải video */\n.ytc-hide-watermark .annotation-type-custom.iv-branding,\n.ytc-hide-watermark .iv-branding,\n.ytc-hide-watermark .ytp-iv-video-content .iv-branding,\n.ytc-hide-watermark .ytp-branding-logo,\n.ytc-hide-watermark .ytp-featured-channel,\n.ytc-hide-watermark .ytp-branding-element {\n    display: none !important;\n    opacity: 0 !important;\n    pointer-events: none !important;\n    visibility: hidden !important;\n}\n\n.ytc-auto-dismiss ytd-mealbar-promo-renderer,\n.ytc-auto-dismiss yt-mealbar-promo-renderer,\n.ytc-auto-dismiss ytd-upsell-dialog-renderer,\n.ytc-auto-dismiss ytd-single-option-survey-renderer,\n.ytc-auto-dismiss ytd-in-feed-survey-renderer,\n.ytc-auto-dismiss yt-bubble-hint-renderer,\n.ytc-auto-dismiss .ytc-dismissed-toast {\n    display: none !important;\n    opacity: 0 !important;\n    pointer-events: none !important;\n}\n\n:root.ytc-premium-logo #start.ytd-masthead ytd-topbar-logo-renderer,\n:root.ytc-premium-logo ytd-topbar-logo-renderer#logo {\n    margin-left: 0 !important;\n    display: flex !important;\n    align-items: center !important;\n}\n:root.ytc-premium-logo ytd-topbar-logo-renderer #logo {\n    padding: 18px 4px 18px 16px !important;\n    display: inline-flex !important;\n    align-items: center !important;\n    box-sizing: content-box !important;\n}\nytd-topbar-logo-renderer ytd-yoodle-renderer,\nytd-yoodle-renderer ytd-logo,\nytd-topbar-logo-renderer ytd-yoodle-renderer * {\n    display: none !important;\n}\n:root.ytc-premium-logo ytd-topbar-logo-renderer #logo ytd-logo:not(.ytd-yoodle-renderer),\n:root.ytc-premium-logo ytd-topbar-logo-renderer #logo ytd-logo[hidden]:not(.ytd-yoodle-renderer),\n:root.ytc-premium-logo ytd-topbar-logo-renderer > #logo > div > ytd-logo {\n    width: 101px !important;\n    min-width: 101px !important;\n    max-width: 101px !important;\n    height: 20px !important;\n    display: flex !important;\n    align-items: center !important;\n    overflow: visible !important;\n    visibility: visible !important;\n    opacity: 1 !important;\n}\n:root.ytc-premium-logo ytd-logo:not(.ytd-yoodle-renderer) > *:not(.custom-premium-logo) {\n    display: none !important;\n}\nytd-logo, ytd-topbar-logo-renderer {\n    overflow: visible !important;\n}\n:root:not(.ytc-premium-logo) .custom-premium-logo {\n    display: none !important;\n}\n:root.ytc-premium-logo .custom-premium-logo {\n    display: flex !important;\n    align-items: center !important;\n    width: 101px !important;\n    height: 20px !important;\n    color: var(--yt-spec-wordmark-text, var(--yt-spec-text-primary, #0f0f0f)) !important;\n    pointer-events: none;\n    visibility: visible !important;\n    opacity: 1 !important;\n}\nhtml:not([dark]).ytc-premium-logo .custom-premium-logo,\nhtml:not([dark]) .custom-premium-logo,\n:root:not([dark]).ytc-premium-logo .custom-premium-logo {\n    color: var(--yt-spec-wordmark-text, #0f0f0f) !important;\n}\nhtml[dark].ytc-premium-logo .custom-premium-logo,\nhtml[dark] .custom-premium-logo,\n:root[dark].ytc-premium-logo .custom-premium-logo {\n    color: var(--yt-spec-wordmark-text, #f1f1f1) !important;\n}\n.custom-premium-logo svg {\n    width: 101px !important;\n    height: 20px !important;\n    fill: currentColor !important;\n}\n.custom-premium-logo svg #youtube-paths_yt19,\n.custom-premium-logo svg #youtube-paths_yt19 path {\n    fill: currentColor !important;\n}\n\n:root.ytc-premium-logo ytd-topbar-logo-renderer #country-code {\n    display: inline-block !important;\n    font-size: 10px !important;\n    font-weight: 400 !important;\n    font-family: "Roboto", "Arial", sans-serif !important;\n    line-height: 10px !important;\n    color: var(--yt-spec-text-secondary, #909090) !important;\n    margin-top: 14px !important;\n    margin-left: 4px !important;\n    margin-right: 0 !important;\n    margin-bottom: 0 !important;\n    align-self: flex-start !important;\n    vertical-align: top !important;\n    position: relative !important;\n    top: 0 !important;\n    left: 0 !important;\n}\nhtml:not([dark]).ytc-premium-logo ytd-topbar-logo-renderer #country-code,\nhtml:not([dark]) ytd-topbar-logo-renderer #country-code {\n    color: var(--yt-spec-text-secondary, #606060) !important;\n}\nhtml[dark].ytc-premium-logo ytd-topbar-logo-renderer #country-code,\nhtml[dark] ytd-topbar-logo-renderer #country-code {\n    color: var(--yt-spec-text-secondary, #909090) !important;\n}\n:root.ytc-premium-logo ytd-topbar-logo-renderer #country-code:empty {\n    display: none !important;\n}\n\n/* --------------------------------------------------------------------------\n   5. GIAO DIỆN CÀI ĐẶT: NÚT BÁNH RĂNG & MENU 4 TAB\n   -------------------------------------------------------------------------- */\n#ytc-settings-btn {\n    order: -1 !important;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 40px;\n    height: 40px;\n    border-radius: 50%;\n    border: none;\n    background: transparent;\n    color: var(--yt-spec-text-primary, #f1f1f1);\n    cursor: pointer;\n    margin-right: 8px;\n    flex-shrink: 0;\n    transition: background-color 0.15s;\n    position: relative;\n}\n#ytc-settings-btn:hover {\n    background-color: rgba(255, 255, 255, 0.1);\n}\nhtml:not([dark]) #ytc-settings-btn:hover {\n    background-color: rgba(0, 0, 0, 0.08);\n}\n#ytc-settings-btn svg {\n    width: 24px;\n    height: 24px;\n}\n\n#ytc-settings-panel {\n    position: fixed;\n    width: 350px;\n    max-height: calc(100vh - 80px);\n    overflow-y: auto;\n    background: var(--yt-spec-brand-background-primary, #282828);\n    color: var(--yt-spec-text-primary, #f1f1f1);\n    border-radius: 12px;\n    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);\n    padding: 12px;\n    z-index: 9999;\n    font-family: "Roboto", "Arial", sans-serif;\n    font-size: 14px;\n    display: none;\n    flex-direction: column;\n    gap: 6px;\n    user-select: none;\n    border: 1px solid rgba(255, 255, 255, 0.1);\n}\n#ytc-settings-panel::-webkit-scrollbar {\n    width: 4px;\n}\n#ytc-settings-panel::-webkit-scrollbar-thumb {\n    background: rgba(255, 255, 255, 0.2);\n    border-radius: 2px;\n}\n#ytc-settings-panel.open {\n    display: flex;\n}\n\n.ytc-header {\n    font-weight: 600;\n    font-size: 15px;\n    padding: 4px 6px 8px 6px;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n}\n.ytc-header-badge {\n    font-size: 11px;\n    background: #ff0033;\n    color: white;\n    padding: 2px 6px;\n    border-radius: 4px;\n    font-weight: bold;\n}\n\n.ytc-tabs {\n    display: flex;\n    align-items: center;\n    gap: 5px;\n    background: rgba(255, 255, 255, 0.06);\n    border-radius: 8px;\n    padding: 4px;\n    margin: 4px 0 6px 0;\n}\n.ytc-tab-btn {\n    flex: 1;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    gap: 5px;\n    padding: 6px 6px;\n    border: none;\n    background: transparent;\n    color: #aaa;\n    font-size: 12px;\n    font-weight: 500;\n    border-radius: 6px;\n    cursor: pointer;\n    transition: all 0.15s ease;\n    white-space: nowrap;\n}\n.ytc-tab-btn:hover {\n    background: rgba(255, 255, 255, 0.08);\n    color: #fff;\n}\n.ytc-tab-btn.active {\n    background: #f1f1f1;\n    color: #0f0f0f;\n    font-weight: 600;\n}\n.ytc-tab-btn svg {\n    width: 14px;\n    height: 14px;\n    fill: currentColor;\n    flex-shrink: 0;\n}\n.ytc-tab-pane {\n    display: none;\n    flex-direction: column;\n    gap: 4px;\n}\n.ytc-tab-pane.active {\n    display: flex;\n}\n\n.ytc-item {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 8px 8px;\n    border-radius: 8px;\n    cursor: pointer;\n    transition: background 0.15s;\n}\n.ytc-item:hover {\n    background: rgba(255, 255, 255, 0.08);\n}\n\n.ytc-item-left {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n}\n.ytc-item-left svg {\n    width: 20px;\n    height: 20px;\n    fill: currentColor;\n    opacity: 0.9;\n    flex-shrink: 0;\n}\n\n.ytc-switch {\n    position: relative;\n    display: inline-block;\n    width: 36px;\n    height: 20px;\n}\n.ytc-switch input {\n    opacity: 0;\n    width: 0;\n    height: 0;\n}\n.ytc-slider {\n    position: absolute;\n    cursor: pointer;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: #606060;\n    border-radius: 20px;\n    transition: background-color 0.2s;\n}\n.ytc-slider:before {\n    position: absolute;\n    content: "";\n    height: 14px;\n    width: 14px;\n    left: 3px;\n    bottom: 3px;\n    background-color: white;\n    border-radius: 50%;\n    transition: transform 0.2s;\n}\n.ytc-switch input:checked + .ytc-slider {\n    background-color: #3ea6ff;\n}\n.ytc-switch input:checked + .ytc-slider:before {\n    transform: translateX(16px);\n}\n\n.ytc-cols-group {\n    display: flex;\n    align-items: center;\n    gap: 4px;\n    background: rgba(255, 255, 255, 0.08);\n    padding: 2px;\n    border-radius: 6px;\n}\n.ytc-col-btn {\n    border: none;\n    background: transparent;\n    color: #aaa;\n    font-size: 13px;\n    font-weight: 500;\n    padding: 4px 8px;\n    border-radius: 4px;\n    cursor: pointer;\n    transition: all 0.15s;\n}\n.ytc-col-btn.active {\n    background: #f1f1f1;\n    color: #0f0f0f;\n}\n\n.ytc-shortcut-hint {\n    font-size: 12px;\n    color: var(--yt-spec-text-secondary, #aaa);\n    background: rgba(255, 255, 255, 0.04);\n    padding: 8px 10px;\n    border-radius: 6px;\n    line-height: 1.6;\n    margin-top: 4px;\n    border: 1px solid rgba(255, 255, 255, 0.06);\n}\n.ytc-shortcut-hint kbd {\n    background: rgba(255, 255, 255, 0.15);\n    color: var(--yt-spec-text-primary, #fff);\n    padding: 2px 5px;\n    border-radius: 3px;\n    font-family: monospace;\n    font-size: 11px;\n    font-weight: bold;\n}\n\nhtml:not([dark]) #ytc-settings-panel {\n    background: #ffffff;\n    color: #0f0f0f;\n    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.15);\n    border: 1px solid rgba(0, 0, 0, 0.1);\n}\nhtml:not([dark]) .ytc-header {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.08);\n}\nhtml:not([dark]) .ytc-tabs {\n    background: rgba(0, 0, 0, 0.05);\n}\nhtml:not([dark]) .ytc-tab-btn {\n    color: #606060;\n}\nhtml:not([dark]) .ytc-tab-btn:hover {\n    background: rgba(0, 0, 0, 0.06);\n    color: #0f0f0f;\n}\nhtml:not([dark]) .ytc-tab-btn.active {\n    background: #0f0f0f;\n    color: #ffffff;\n}\nhtml:not([dark]) .ytc-shortcut-hint {\n    background: rgba(0, 0, 0, 0.04);\n    color: #606060;\n    border-color: rgba(0, 0, 0, 0.08);\n}\nhtml:not([dark]) .ytc-shortcut-hint kbd {\n    background: rgba(0, 0, 0, 0.1);\n    color: #0f0f0f;\n}\n\n.ytc-divider {\n    height: 1px;\n    background: rgba(255, 255, 255, 0.1);\n    margin: 4px 0;\n}\n\n.ytc-mode-group {\n    display: flex;\n    align-items: center;\n    gap: 4px;\n    background: rgba(255, 255, 255, 0.08);\n    padding: 2px;\n    border-radius: 6px;\n}\n.ytc-mode-btn {\n    border: none;\n    background: transparent;\n    color: #aaa;\n    font-size: 12px;\n    font-weight: 500;\n    padding: 4px 8px;\n    border-radius: 4px;\n    cursor: pointer;\n    transition: all 0.15s;\n    white-space: nowrap;\n}\n.ytc-mode-btn.active {\n    background: #f1f1f1;\n    color: #0f0f0f;\n}\nhtml:not([dark]) .ytc-mode-group {\n    background: rgba(0, 0, 0, 0.05);\n}\nhtml:not([dark]) .ytc-mode-btn.active {\n    background: #0f0f0f;\n    color: #ffffff;\n}\n\n/* --------------------------------------------------------------------------\n   CHAT OVERLAY TRÊN VIDEO (DANMAKU & STREAMER BOX)\n   -------------------------------------------------------------------------- */\n#ytc-danmaku-container {\n    position: absolute;\n    inset: 0;\n    width: 100% !important;\n    height: 100% !important;\n    pointer-events: none;\n    overflow: hidden;\n    z-index: 35 !important;\n    container-type: inline-size;\n    transition: opacity 0.3s ease;\n    display: none;\n}\n\n.ytc-danmaku-item {\n    position: absolute;\n    left: 100%;\n    white-space: nowrap;\n    font-family: "YouTube Noto", Roboto, Arial, sans-serif !important;\n    font-weight: 700;\n    font-size: 18px;\n    line-height: 1.3;\n    color: #ffffff;\n    text-shadow: \n        1px 1px 2px #000, \n        -1px -1px 2px #000, \n        1px -1px 2px #000, \n        -1px 1px 2px #000,\n        0 0 4px #000;\n    will-change: transform;\n    animation: ytc-danmaku-slide 8.5s linear forwards;\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    pointer-events: none;\n}\n\n@keyframes ytc-danmaku-slide {\n    from {\n        transform: translateX(0);\n    }\n    to {\n        transform: translateX(calc(-100% - 100cqi));\n    }\n}\n\n@supports not (container-type: inline-size) {\n    @keyframes ytc-danmaku-slide {\n        from {\n            transform: translateX(0);\n        }\n        to {\n            transform: translateX(calc(-100% - 100vw));\n        }\n    }\n}\n\n.ytc-chat-author {\n    color: #9ab4c7;\n    font-weight: 600;\n    flex-shrink: 0;\n}\n.ytc-chat-author.mod,\n.ytc-chat-text.mod {\n    color: #3ea6ff !important;\n}\n.ytc-chat-author.member,\n.ytc-chat-text.member {\n    color: #2ba640 !important;\n}\n.ytc-chat-author.owner,\n.ytc-chat-text.owner {\n    color: #ffd600 !important;\n}\n\n.ytc-chat-text {\n    color: #ffffff !important;\n    font-weight: 500;\n}\n\n.ytc-danmaku-item img,\n.ytc-danmaku-item .ytc-chat-text img,\n.ytc-danmaku-item img.emoji,\n.ytc-danmaku-item img.yt-emoji,\n.ytc-danmaku-item .emoji {\n    max-height: 22px !important;\n    max-width: 28px !important;\n    width: auto !important;\n    height: auto !important;\n    vertical-align: -3px !important;\n    margin: 0 2px !important;\n    display: inline-block !important;\n    object-fit: contain !important;\n}\n\n/* ĐIỀU KHIỂN HIỂN THỊ THEO TRẠNG THÁI CONFIG */\nhtml[data-ytc-chat="danmaku"] #ytc-danmaku-container,\nbody[data-ytc-chat="danmaku"] #ytc-danmaku-container {\n    display: block !important;\n}\n\nhtml[data-ytc-chat="streamer"] #ytc-streamer-box,\nbody[data-ytc-chat="streamer"] #ytc-streamer-box {\n    display: flex !important;\n}\n\nhtml[data-ytc-chat="off"] #ytc-danmaku-container,\nbody[data-ytc-chat="off"] #ytc-danmaku-container,\nhtml[data-ytc-chat="streamer"] #ytc-danmaku-container,\nbody[data-ytc-chat="streamer"] #ytc-danmaku-container {\n    display: none !important;\n}\n\nhtml[data-ytc-chat="off"] #ytc-streamer-box,\nbody[data-ytc-chat="off"] #ytc-streamer-box,\nhtml[data-ytc-chat="danmaku"] #ytc-streamer-box,\nbody[data-ytc-chat="danmaku"] #ytc-streamer-box {\n    display: none !important;\n}\n\n/* ==========================================================================\n   QUẢN LÝ KHUNG LIVE CHAT GỐC KHI BẬT OVERLAY\n   - Nếu Chat gốc BẬT: Giữ nguyên cho người dùng chat và hiển thị tự nhiên.\n   - Nếu Chat gốc TẮT (mặc định tắt hoặc người dùng ẩn):\n     + Chưa phóng to: Ẩn gọn off-screen để script lấy data ngầm.\n     + Phóng to Fullscreen: Ẩn triệt để panel bên phải & PHÓNG TO KHUNG VIDEO 100% FULL MÀN HÌNH.\n   ========================================================================== */\n\n/* 1. Giao diện thường (chưa phóng to):\n   Để YouTube xử lý thu gọn tự nhiên (hiện thẻ teaser "Mở bảng điều khiển" gọn gàng),\n   TUYỆT ĐỐI KHÔNG đẩy frame chat gốc ra -9999px để người dùng có thể nhấp mở/đóng bình thường. */\n\n/* 2. Trạng thái ẩn Chat gốc trong giao diện toàn màn hình (FULLSCREEN / PHÓNG TO) khi CHƯA MỞ CHAT */\n/* Triệt tiêu độ rộng side panel bên phải để video tràn 100vw khi CHƯA CÓ BẤT KỲ PANEL NÀO ĐƯỢC MỞ */\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #panels-full-bleed-container:not(:has([visibility*="EXPANDED"])),\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #chat-container,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #panels,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #secondary,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) .ytp-fullscreen:not(.ytp-chat-open) #chat-container,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) .ytp-fullscreen:not(.ytp-chat-open) .ytp-live-chat-panel {\n    width: 0 !important;\n    min-width: 0 !important;\n    max-width: 0 !important;\n    flex-basis: 0 !important;\n    overflow: hidden !important;\n    opacity: 0 !important;\n    pointer-events: none !important;\n}\n\n/* Phóng to toàn bộ các tầng container và movie_player ra 100vw x 100vh để xóa sổ vệt đen khi chat đang đóng */\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #player-full-bleed-container,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #full-bleed-container,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #player-container-outer,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #player-container-inner,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #player-container,\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) #movie_player:not(#inline-preview-player):not(.ytp-chat-open),\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) ytd-watch-flexy[fullscreen]:not([has-active-panel]):not([panels-open]) .html5-video-player:not(#inline-preview-player):not(.ytp-chat-open),\nhtml[data-ytc-chat-hidden="true"]:not(:has([visibility*="EXPANDED"], [opened], [has-active-panel], [panels-open], .ytp-chat-open)) .ytp-fullscreen.html5-video-player:not(#inline-preview-player):not(.ytp-chat-open) {\n    width: 100vw !important;\n    min-width: 100vw !important;\n    max-width: 100vw !important;\n    height: 100vh !important;\n    min-height: 100vh !important;\n    max-height: 100vh !important;\n    margin-right: 0 !important;\n    padding-right: 0 !important;\n    left: 0 !important;\n    right: 0 !important;\n    top: 0 !important;\n    bottom: 0 !important;\n    transform: none !important;\n}\n\n/* Luôn đảm bảo nút Live Chat trên thanh điều khiển YouTube player và action bar hiển thị và bấm được */\n.ytp-live-chat-button,\n.ytp-chat-button,\n[aria-label*="trò chuyện" i],\n[aria-label*="chat" i],\n[target-id*="chat" i] {\n    pointer-events: auto !important;\n    cursor: pointer !important;\n}\n\n/* ==========================================================================\n   TÍNH NĂNG ẨN KHUNG LIVE CHAT GỐC CỦA YOUTUBE (hideNativeLiveChat)\n   - Đẩy khung chat gốc ra ngoài màn hình off-screen thay vì display:none để iframe vẫn chạy ngầm\n   - Ẩn triệt để tất cả các nút bật/tắt chat, teaser mở bảng điều khiển, nút trên thanh player\n   ========================================================================== */\nhtml.ytc-hide-native-chat ytd-live-chat-frame#chat,\nbody.ytc-hide-native-chat ytd-live-chat-frame#chat,\nhtml.ytc-hide-native-chat #chat.ytd-watch-flexy,\nbody.ytc-hide-native-chat #chat.ytd-watch-flexy {\n    position: fixed !important;\n    top: -9999px !important;\n    left: -9999px !important;\n    width: 0 !important;\n    height: 0 !important;\n    opacity: 0 !important;\n    pointer-events: none !important;\n    visibility: hidden !important;\n}\n\nhtml.ytc-hide-native-chat #chat-container,\nbody.ytc-hide-native-chat #chat-container {\n    width: 0 !important;\n    min-width: 0 !important;\n    max-width: 0 !important;\n    overflow: hidden !important;\n}\n\nhtml.ytc-hide-native-chat .ytp-live-chat-button,\nbody.ytc-hide-native-chat .ytp-live-chat-button,\nhtml.ytc-hide-native-chat .ytp-chat-button,\nbody.ytc-hide-native-chat .ytp-chat-button,\nhtml.ytc-hide-native-chat #show-hide-button,\nbody.ytc-hide-native-chat #show-hide-button,\nhtml.ytc-hide-native-chat #chat-teaser,\nbody.ytc-hide-native-chat #chat-teaser,\nhtml.ytc-hide-native-chat ytd-live-chat-frame #teaser,\nbody.ytc-hide-native-chat ytd-live-chat-frame #teaser,\nhtml.ytc-hide-native-chat ytd-engagement-panel-section-list-renderer[target-id*="chat" i],\nbody.ytc-hide-native-chat ytd-engagement-panel-section-list-renderer[target-id*="chat" i],\nhtml.ytc-hide-native-chat [target-id="engagement-panel-live-chat"],\nbody.ytc-hide-native-chat [target-id="engagement-panel-live-chat"] {\n    display: none !important;\n}\n\n\n\n/* KHUNG LIVE CHAT BOX (NỀN TRONG SUỐT HUD OVERLAY CHO STREAMER) */\n#ytc-streamer-box {\n    position: absolute;\n    width: 320px;\n    min-height: 120px;\n    max-height: 80%;\n    background: transparent !important;\n    backdrop-filter: none !important;\n    border: none !important;\n    box-shadow: none !important;\n    border-radius: 6px;\n    z-index: 38 !important;\n    overflow: hidden;\n    display: flex;\n    flex-direction: column;\n    pointer-events: auto;\n    box-sizing: border-box;\n    transition: background-color 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;\n    user-select: none;\n}\n\n#ytc-streamer-box.ytc-dragging {\n    transition: none !important;\n    will-change: left, top;\n    user-select: none !important;\n}\n\n#ytc-streamer-box:hover,\n#ytc-streamer-box.ytc-box-initial,\n#ytc-streamer-box.ytc-dragging {\n    background: rgba(0, 0, 0, 0.45) !important;\n    backdrop-filter: blur(4px) !important;\n    border: 1px dashed rgba(255, 255, 255, 0.35) !important;\n    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6) !important;\n}\n\n.ytc-box-header {\n    height: 24px;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 2px 6px;\n    background: rgba(0, 0, 0, 0.75);\n    color: #eee;\n    font-size: 11px;\n    font-weight: 600;\n    cursor: move;\n    opacity: 0;\n    pointer-events: none;\n    transition: opacity 0.2s ease;\n    flex-shrink: 0;\n    border-top-left-radius: 6px;\n    border-top-right-radius: 6px;\n}\n\n.ytc-box-title {\n    display: flex;\n    align-items: center;\n    gap: 5px;\n    font-size: 11px;\n    font-weight: 600;\n    color: #fff;\n    user-select: none;\n    letter-spacing: 0.2px;\n}\n\n.ytc-box-title svg {\n    flex-shrink: 0;\n    opacity: 0.9;\n}\n\n.ytc-box-close {\n    background: transparent !important;\n    border: none !important;\n    color: rgba(255, 255, 255, 0.7) !important;\n    cursor: pointer !important;\n    width: 20px !important;\n    height: 20px !important;\n    padding: 0 !important;\n    margin: 0 !important;\n    border-radius: 4px !important;\n    display: flex !important;\n    align-items: center !important;\n    justify-content: center !important;\n    transition: background 0.15s ease, color 0.15s ease !important;\n    outline: none !important;\n    box-shadow: none !important;\n}\n\n.ytc-box-close:hover {\n    background: rgba(255, 255, 255, 0.2) !important;\n    color: #fff !important;\n}\n\n.ytc-box-close svg {\n    display: block;\n}\n\n#ytc-streamer-box:hover .ytc-box-header,\n#ytc-streamer-box.ytc-box-initial .ytc-box-header,\n#ytc-streamer-box.ytc-dragging .ytc-box-header {\n    opacity: 1 !important;\n    pointer-events: auto !important;\n}\n\n#ytc-streamer-box:hover .ytc-box-resize,\n#ytc-streamer-box.ytc-box-initial .ytc-box-resize,\n#ytc-streamer-box.ytc-dragging .ytc-box-resize {\n    opacity: 1 !important;\n    pointer-events: auto !important;\n}\n\n.ytc-box-messages {\n    flex: 1;\n    overflow-y: hidden;\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-end;\n    gap: 3px;\n    padding: 2px 4px;\n    pointer-events: none;\n}\n\n.ytc-box-item {\n    display: flex;\n    align-items: flex-start;\n    flex-shrink: 0 !important;\n    flex-grow: 0 !important;\n    width: 100%;\n    box-sizing: border-box;\n    height: auto !important;\n    min-height: min-content !important;\n    gap: 3px;\n    font-size: 10px;\n    line-height: 1.35;\n    color: #fff;\n    text-shadow: \n        1px 1px 2px #000, \n        -1px -1px 2px #000, \n        1px -1px 2px #000, \n        -1px 1px 2px #000, \n        0 0 3px #000;\n    animation: ytc-fade-in 0.12s ease-out;\n    word-break: break-word;\n    overflow-wrap: break-word;\n}\n\n.ytc-box-avatar {\n    width: 10px;\n    height: 10px;\n    border-radius: 50%;\n    flex-shrink: 0;\n    margin-top: 2px;\n}\n\n.ytc-box-content {\n    flex: 1;\n    min-width: 0;\n    word-break: break-word;\n    overflow-wrap: break-word;\n    line-height: 1.35;\n}\n\n#ytc-streamer-box .ytc-chat-author {\n    color: #b5b5b5 !important;\n    font-weight: 700 !important;\n    flex-shrink: 0;\n}\n#ytc-streamer-box .ytc-chat-author.mod {\n    color: #3ea6ff !important;\n    font-weight: 700 !important;\n}\n#ytc-streamer-box .ytc-chat-author.member {\n    color: #2ba640 !important;\n    font-weight: 700 !important;\n}\n#ytc-streamer-box .ytc-chat-author.owner {\n    color: #ffd600 !important;\n    font-weight: 700 !important;\n}\n\n#ytc-streamer-box .ytc-chat-text {\n    color: #ffffff !important;\n    font-weight: 700 !important;\n}\n\n/* THU NHỎ ICON EMOJI VÀ BADGE BẰNG CỠ CHỮ CHỈ ÁP DỤNG CHO KHUNG NỔI STREAMER */\n#ytc-streamer-box .ytc-box-content img,\n#ytc-streamer-box .ytc-box-item img,\n#ytc-streamer-box img.emoji,\n#ytc-streamer-box img.yt-emoji,\n#ytc-streamer-box .emoji {\n    max-height: 10px !important;\n    width: auto !important;\n    max-width: 12px !important;\n    height: auto !important;\n    vertical-align: -1px !important;\n    display: inline-block !important;\n    object-fit: contain !important;\n    margin: 0 1px !important;\n}\n\n.ytc-box-badge {\n    display: inline-flex;\n    align-items: center;\n    vertical-align: -1px;\n    margin: 0 2px;\n}\n.ytc-box-badge svg.ytc-mod-icon,\n.ytc-badge-mod,\n.ytc-mod-icon {\n    display: none !important;\n}\n.ytc-box-badge img {\n    width: 10px !important;\n    height: 10px !important;\n    max-width: 10px !important;\n    max-height: 10px !important;\n    display: inline-block !important;\n    vertical-align: -1px !important;\n    object-fit: contain !important;\n}\n\n.ytc-box-resize {\n    position: absolute;\n    right: 2px;\n    bottom: 2px;\n    width: 10px;\n    height: 10px;\n    cursor: nwse-resize;\n    opacity: 0;\n    pointer-events: none;\n    transition: opacity 0.2s ease;\n    border-right: 2px solid rgba(255, 255, 255, 0.6);\n    border-bottom: 2px solid rgba(255, 255, 255, 0.6);\n}\n\n#ytc-streamer-box:hover .ytc-box-resize,\n#ytc-streamer-box.ytc-box-initial .ytc-box-resize {\n    opacity: 1;\n    pointer-events: auto;\n}\n\n/* HIỆU ỨNG XUẤT HIỆN MƯỢT MÀ, KHÔNG DÙNG TRANSLATE-Y GÂY GIẬT LAG KHUNG HÌNH */\n@keyframes ytc-fade-in {\n    from { opacity: 0; }\n    to { opacity: 1; }\n}\n\n/* TỰ ĐỘNG CÂN ĐỐI TỶ LỆ KÍCH THƯỚC CHỮ KHI PHÓNG TO TOÀN MÀN HÌNH (FULLSCREEN / ZOOM) */\n.ytp-fullscreen .ytc-danmaku-item {\n    font-size: 25px !important;\n}\n.ytp-fullscreen .ytc-danmaku-item img,\n.ytp-fullscreen .ytc-danmaku-item .ytc-chat-text img,\n.ytp-fullscreen .ytc-danmaku-item img.emoji,\n.ytp-fullscreen .ytc-danmaku-item img.yt-emoji,\n.ytp-fullscreen .ytc-danmaku-item .emoji {\n    max-height: 28px !important;\n    max-width: 36px !important;\n    vertical-align: -4px !important;\n}\n\n/* ==========================================================================\n   ONBOARDING TOOLTIP KHI CÀI ĐẶT LẦN ĐẦU (FIRST-TIME USER EXPERIENCE)\n   ========================================================================== */\n#ytc-onboarding-tip {\n    position: fixed;\n    z-index: 100000;\n    width: 280px;\n    background: #18181b;\n    border: 1px solid rgba(255, 0, 51, 0.6);\n    border-radius: 10px;\n    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);\n    color: #fff;\n    padding: 12px 14px;\n    font-family: Roboto, Arial, sans-serif;\n    user-select: none;\n    box-sizing: border-box;\n    animation: ytc-fade-in 0.12s ease-out;\n}\n\n.ytc-onboarding-arrow {\n    position: absolute;\n    top: -6px;\n    right: 18px;\n    width: 10px;\n    height: 10px;\n    background: #18181b;\n    border-left: 1px solid rgba(255, 0, 51, 0.6);\n    border-top: 1px solid rgba(255, 0, 51, 0.6);\n    transform: rotate(45deg);\n}\n\n.ytc-onboarding-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    margin-bottom: 6px;\n}\n\n.ytc-onboarding-badge {\n    font-size: 10px;\n    font-weight: 700;\n    background: #ff0033;\n    color: #fff;\n    padding: 2px 6px;\n    border-radius: 4px;\n    letter-spacing: 0.5px;\n}\n\n.ytc-onboarding-close {\n    background: transparent;\n    border: none;\n    color: #aaa;\n    font-size: 13px;\n    cursor: pointer;\n    padding: 2px 4px;\n    line-height: 1;\n    border-radius: 4px;\n    transition: color 0.1s;\n}\n.ytc-onboarding-close:hover {\n    color: #fff;\n}\n\n.ytc-onboarding-title {\n    font-size: 13px;\n    font-weight: 700;\n    color: #fff;\n    line-height: 1.35;\n    margin-bottom: 4px;\n}\n\n.ytc-onboarding-desc {\n    font-size: 11.5px;\n    color: #ccc;\n    line-height: 1.4;\n    margin-bottom: 10px;\n}\n\n.ytc-onboarding-footer {\n    display: flex;\n    justify-content: flex-end;\n}\n\n.ytc-onboarding-btn {\n    background: #ff0033;\n    color: #fff;\n    border: none;\n    padding: 5px 14px;\n    font-size: 11.5px;\n    font-weight: 600;\n    border-radius: 6px;\n    cursor: pointer;\n    transition: background-color 0.15s;\n}\n.ytc-onboarding-btn:hover {\n    background: #cc0029;\n}\n\n\n\n';

  // src/index.js
  init_config();
  init_utils();

  // src/features/grid.js
  init_config();
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

  // src/features/logo.js
  init_utils();
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

  // src/features/promos.js
  init_config();
  function dismissPromoBanners(scope) {
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

  // src/features/feedFilter.js
  init_utils();
  function scanAndTagFeedContent(scope) {
    const root = scope && scope.querySelectorAll ? scope : document;
    const sections = root.querySelectorAll("ytd-rich-section-renderer");
    sections.forEach((sec) => {
      if (!sec.classList.contains("ytc-shelf-members")) {
        const text = sec.textContent || "";
        if (text.includes("lợi ích từ hội viên") || text.includes("Ưu tiên hội viên") || text.includes("ưu tiên hội viên") || text.includes("hội viên") && text.includes("YouTube chọn lọc") || text.includes("Get more from memberships") || text.includes("Members only") || text.includes("Members first") || sec.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], a[href*="/membership"], a[href*="/memberships"]')) {
          sec.classList.add("ytc-shelf-members");
        }
      }
      if (!sec.classList.contains("ytc-shelf-explore")) {
        const text = sec.textContent || "";
        if (text.includes("Khám phá các chủ đề") || text.includes("Explore other topics") || text.includes("Explore topics") || sec.querySelector("yt-chip-cloud-chip-renderer, yt-chip-cloud-renderer, ytd-feed-filter-chip-bar-renderer")) {
          sec.classList.add("ytc-shelf-explore");
        }
      }
      if (!sec.classList.contains("ytc-shelf-community")) {
        if (sec.querySelector("ytd-post-renderer, ytd-backstage-post-renderer, ytd-backstage-post-thread-renderer, ytd-post-multi-image-renderer, ytd-poll-renderer")) {
          sec.classList.add("ytc-shelf-community");
        }
      }
    });
    const videoCards = root.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer");
    videoCards.forEach((card) => {
      if (!card.classList.contains("ytc-item-members")) {
        const text = card.textContent || "";
        if (text.includes("Ưu tiên hội viên") || text.includes("ưu tiên hội viên") || text.includes("Chỉ dành cho hội viên") || text.includes("chỉ dành cho hội viên") || text.includes("Members first") || text.includes("Members only") || text.includes("Members-only") || text.includes("Early access") || card.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], [aria-label*="hội viên"], [aria-label*="Hội viên"], [aria-label*="Members"]')) {
          card.classList.add("ytc-item-members");
        }
      }
      if (!card.classList.contains("ytc-item-community")) {
        if (card.querySelector("ytd-post-renderer, ytd-backstage-post-renderer, ytd-post-multi-image-renderer, ytd-poll-renderer")) {
          card.classList.add("ytc-item-community");
        }
      }
    });
  }
  var scheduleFeedScan = rafThrottle((root) => {
    scanAndTagFeedContent(root);
    applyHomeGridColumns();
    dismissPromoBanners(root);
  });
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

  // src/player/adShield.js
  init_utils();
  var adShieldInitialized = false;
  var wasAdShowing = false;
  function isLiveStream(player) {
    if (!player) return false;
    if (typeof player.getVideoData === "function") {
      const vd = player.getVideoData();
      if (vd && vd.isLive) return true;
    }
    if (typeof player.isLive === "function") {
      try {
        if (player.isLive() === true) return true;
      } catch (e) {
      }
    }
    if (player.classList.contains("ytp-live") || !!player.querySelector(".ytp-live-badge")) {
      return true;
    }
    if (location.pathname.startsWith("/live/")) {
      return true;
    }
    return false;
  }
  function initAdShield() {
    if (adShieldInitialized) return;
    adShieldInitialized = true;
    function handleVideoAds() {
      if (!location.pathname.startsWith("/watch") && !location.pathname.startsWith("/live")) return;
      const player = document.querySelector("#movie_player:not(#inline-preview-player)");
      if (!player) return;
      const isAdShowing = player.classList.contains("ad-showing") || player.classList.contains("ad-interrupting") || !!player.querySelector(".ytp-ad-player-overlay, .ytp-ad-text, .video-ads .ad-showing");
      const video = player.querySelector("video.html5-main-video") || player.querySelector("video");
      if (isAdShowing) {
        wasAdShowing = true;
        const isLive = isLiveStream(player);
        if (video) {
          try {
            video.playbackRate = 16;
          } catch (e) {
          }
        }
        const skipButtons = player.querySelectorAll(`
                .ytp-ad-skip-button,
                .ytp-ad-skip-button-modern,
                .ytp-ad-skip-button-container button,
                button.ytp-ad-skip-button,
                .ytp-ad-overlay-close-button,
                [id^="skip-button"] button
            `);
        skipButtons.forEach((btn) => {
          try {
            btn.click();
          } catch (e) {
          }
        });
      } else if (wasAdShowing) {
        wasAdShowing = false;
        if (video && video.playbackRate > 2) {
          video.playbackRate = 1;
        }
      }
    }
    setInterval(handleVideoAds, 300);
    whenElement("#movie_player:not(#inline-preview-player)", (player) => {
      const obs = new MutationObserver(() => {
        handleVideoAds();
      });
      obs.observe(player, { attributes: true, attributeFilter: ["class"] });
    });
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
                <button class="ytc-tab-btn" data-tab="shortcuts" title="Phím tắt & Tiện ích">
                    ${KEYBOARD_SVG}
                    <span>Phím tắt</span>
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

                <div class="ytc-item" data-toggle="hideNativeLiveChat" title="Tự động ẩn khung trò chuyện trực tiếp khi mở video live/công chiếu (vẫn chạy ngầm nếu bật Live Chat)">
                    <div class="ytc-item-left">
                        ${CHAT_OFF_SVG}
                        <span>Ẩn trò chuyện trực tiếp</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-hidenativechat">
                        <input type="checkbox" id="ytc-chk-hidenativechat" name="hideNativeLiveChat" aria-label="Ẩn trò chuyện trực tiếp" ${currentConfig.hideNativeLiveChat ? "checked" : ""}>
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
            </div>

            <!-- TAB 4: PHÍM TẮT & TIỆN ÍCH -->
            <div class="ytc-tab-pane" id="ytc-pane-shortcuts">
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

                <div class="ytc-shortcut-hint" title="Bảng hướng dẫn các phím tắt điều khiển nhanh">
                    <div><kbd>A</kbd> / <kbd>D</kbd> (hoặc <kbd>J</kbd> / <kbd>L</kbd>) : Tua lùi / tiến 10 giây</div>
                    <div style="margin-top:4px"><kbd>S</kbd> (hoặc <kbd>K</kbd>) : Tạm dừng / phát tiếp</div>
                    <div style="margin-top:4px"><kbd>4</kbd> / <kbd>6</kbd> (Numpad) : Tua lùi / tiến 10 giây</div>
                    <div style="margin-top:4px"><kbd>8</kbd> / <kbd>2</kbd> (Numpad) : Tăng / giảm âm lượng</div>
                    <div style="margin-top:4px"><kbd>5</kbd> (Numpad) : Tạm dừng / phát tiếp</div>
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
      panel.querySelectorAll(".ytc-mode-btn").forEach((modeBtn) => {
        modeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const mode = modeBtn.getAttribute("data-overlay") || "off";
          currentConfig.chatOverlay = mode;
          saveConfig(currentConfig);
          panel.querySelectorAll(".ytc-mode-btn").forEach((b) => b.classList.remove("active"));
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
              if (m && typeof m.autoCollapseNativeChatIfOpen === "function") {
                m.autoCollapseNativeChatIfOpen();
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

  // src/index.js
  if (window.self === window.top) {
    initLiveDvrHook();
    initAdShield();
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
