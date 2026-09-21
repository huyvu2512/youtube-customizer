// ==UserScript==
// YouTube Customizer v2.7 — https://github.com/huyvu2512/youtube-customizer
// ==/UserScript==
(() => {
  // src/styles.css
  var styles_default = '/* ==========================================================================\n   YOUTUBE CUSTOMIZER - TẬP HỢP TOÀN BỘ ĐỊNH KIỂU CSS\n   ========================================================================== */\n\n/* --------------------------------------------------------------------------\n   1. LƯỚI VIDEO TRANG CHỦ & FEED: ÉP 3/4/5 CỘT CHUẨN XÁC\n   (Độ ưu tiên cao nhất, cố định vĩnh viễn khi F5 tải lại trang)\n   -------------------------------------------------------------------------- */\n@media (min-width: 900px) {\n    ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,\n    ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer,\n    ytd-browse[page-subtype="channels"] ytd-rich-grid-renderer,\n    #page-manager ytd-browse ytd-rich-grid-renderer,\n    ytd-rich-grid-renderer.ytc-grid,\n    ytd-rich-grid-renderer {\n        --ytd-rich-grid-items-per-row: 4 !important;\n        --ytd-rich-grid-posts-per-row: 4 !important;\n        --ytd-rich-grid-item-max-width: none !important;\n    }\n\n    html[data-ytc-cols="3"] #page-manager ytd-rich-grid-renderer,\n    html[data-ytc-cols="3"] ytd-rich-grid-renderer,\n    body[data-ytc-cols="3"] #page-manager ytd-rich-grid-renderer,\n    body[data-ytc-cols="3"] ytd-rich-grid-renderer,\n    [data-ytc-cols="3"] #page-manager ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="3"] #page-manager ytd-rich-grid-renderer,\n    [data-ytc-cols="3"] ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="3"] ytd-rich-grid-renderer {\n        --ytd-rich-grid-items-per-row: 3 !important;\n        --ytd-rich-grid-posts-per-row: 3 !important;\n        --ytd-rich-grid-item-max-width: none !important;\n    }\n\n    html[data-ytc-cols="4"] #page-manager ytd-rich-grid-renderer,\n    html[data-ytc-cols="4"] ytd-rich-grid-renderer,\n    body[data-ytc-cols="4"] #page-manager ytd-rich-grid-renderer,\n    body[data-ytc-cols="4"] ytd-rich-grid-renderer,\n    [data-ytc-cols="4"] #page-manager ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="4"] #page-manager ytd-rich-grid-renderer,\n    [data-ytc-cols="4"] ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="4"] ytd-rich-grid-renderer {\n        --ytd-rich-grid-items-per-row: 4 !important;\n        --ytd-rich-grid-posts-per-row: 4 !important;\n        --ytd-rich-grid-item-max-width: none !important;\n    }\n\n    html[data-ytc-cols="5"] #page-manager ytd-rich-grid-renderer,\n    html[data-ytc-cols="5"] ytd-rich-grid-renderer,\n    body[data-ytc-cols="5"] #page-manager ytd-rich-grid-renderer,\n    body[data-ytc-cols="5"] ytd-rich-grid-renderer,\n    [data-ytc-cols="5"] #page-manager ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="5"] #page-manager ytd-rich-grid-renderer,\n    [data-ytc-cols="5"] ytd-browse ytd-rich-grid-renderer,\n    [data-ytc-cols="5"] ytd-rich-grid-renderer {\n        --ytd-rich-grid-items-per-row: 5 !important;\n        --ytd-rich-grid-posts-per-row: 5 !important;\n        --ytd-rich-grid-item-max-width: none !important;\n    }\n\n    #contents.ytd-rich-grid-row ytd-rich-item-renderer,\n    ytd-rich-grid-renderer ytd-rich-item-renderer {\n        width: calc(100% / var(--ytd-rich-grid-items-per-row, 4) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n        max-width: calc(100% / var(--ytd-rich-grid-items-per-row, 4) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n    }\n\n    [data-ytc-cols="3"] #contents.ytd-rich-grid-row ytd-rich-item-renderer,\n    [data-ytc-cols="3"] ytd-rich-grid-renderer ytd-rich-item-renderer {\n        width: calc(100% / 3 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n        max-width: calc(100% / 3 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n    }\n\n    [data-ytc-cols="4"] #contents.ytd-rich-grid-row ytd-rich-item-renderer,\n    [data-ytc-cols="4"] ytd-rich-grid-renderer ytd-rich-item-renderer {\n        width: calc(100% / 4 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n        max-width: calc(100% / 4 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n    }\n\n    [data-ytc-cols="5"] #contents.ytd-rich-grid-row ytd-rich-item-renderer,\n    [data-ytc-cols="5"] ytd-rich-grid-renderer ytd-rich-item-renderer {\n        width: calc(100% / 5 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n        max-width: calc(100% / 5 - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;\n    }\n}\n\n/* --------------------------------------------------------------------------\n   2. TỐI ƯU HIỆU NĂNG, KHUNG HÌNH & LIVE CHAT (ZERO-LAG)\n   -------------------------------------------------------------------------- */\n#page-manager ytd-rich-item-renderer {\n    overflow: hidden !important;\n    border-radius: 12px;\n}\n#page-manager ytd-rich-item-renderer:hover {\n    z-index: 2;\n    position: relative;\n}\n\nytd-comment-thread-renderer {\n    content-visibility: auto;\n    contain-intrinsic-size: auto 200px;\n}\n\n@keyframes ytcConfirmInserted {\n    from { clip-path: inset(0); }\n    to { clip-path: inset(0); }\n}\nyt-confirm-dialog-renderer {\n    animation: ytcConfirmInserted 0.001s;\n}\n\n#movie_player.seeking-mode .ytp-chrome-bottom,\n#movie_player.seeking-mode .ytp-gradient-bottom,\n#movie_player.seeking-mode .ytp-chrome-top {\n    opacity: 0 !important;\n    transition: opacity 0.15s ease;\n}\n#movie_player.seeking-mode {\n    cursor: none !important;\n}\n\n.ytc-fs-locked .ytp-fullscreen-button {\n    opacity: 0.35 !important;\n    pointer-events: none !important;\n    cursor: not-allowed !important;\n    transition: opacity 0.2s ease !important;\n}\n\nytd-live-chat-frame#chat,\n#chat.ytd-watch-flexy,\niframe#chatframe {\n    contain: layout style paint !important;\n}\n\nyt-live-chat-text-message-renderer,\nyt-live-chat-paid-message-renderer,\nyt-live-chat-membership-item-renderer {\n    content-visibility: auto !important;\n    contain-intrinsic-size: auto 32px !important;\n}\n\n/* --------------------------------------------------------------------------\n   3. BỘ LỌC NỘI DUNG: SHORTS, CHƠI GAME, HỘI VIÊN, KHÁM PHÁ, CỘNG ĐỒNG, CLEAN SEARCH\n   -------------------------------------------------------------------------- */\n.ytc-hide-shorts ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),\n.ytc-hide-shorts ytd-rich-section-renderer:has(ytd-reel-shelf-renderer),\n.ytc-hide-shorts ytd-rich-shelf-renderer[is-shorts],\n.ytc-hide-shorts ytd-reel-shelf-renderer,\n.ytc-hide-shorts ytd-guide-entry-renderer:has(a[href^="/shorts"]),\n.ytc-hide-shorts ytd-mini-guide-entry-renderer:has(a[href^="/shorts"]),\n.ytc-hide-shorts ytd-guide-entry-renderer a[title="Shorts"],\n.ytc-hide-shorts ytd-mini-guide-entry-renderer[aria-label="Shorts"],\n.ytc-hide-shorts #endpoint[title="Shorts"],\n.ytc-hide-shorts ytd-mealbar-promo-renderer,\n.ytc-hide-shorts ytd-upsell-dialog-renderer {\n    display: none !important;\n}\n\n.ytc-hide-playables ytd-rich-section-renderer:has([is-mini-game-card-shelf]),\n.ytc-hide-playables ytd-rich-shelf-renderer[is-mini-game-card-shelf],\n.ytc-hide-playables ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-mini-game-card-shelf]),\n.ytc-hide-playables ytd-rich-section-renderer:has(a[href*="/playables"]),\n.ytc-hide-playables ytd-rich-section-renderer:has(a[href*="playables"]),\n.ytc-hide-playables ytd-guide-entry-renderer:has(a[href*="/playables"]),\n.ytc-hide-playables ytd-mini-guide-entry-renderer:has(a[href*="/playables"]),\n.ytc-hide-playables ytd-guide-entry-renderer a[title*="Chơi game"],\n.ytc-hide-playables ytd-guide-entry-renderer a[title*="Playables"],\n.ytc-hide-playables ytd-mini-guide-entry-renderer[aria-label*="Chơi game"],\n.ytc-hide-playables ytd-mini-guide-entry-renderer[aria-label*="Playables"],\n.ytc-hide-playables #endpoint[title*="Chơi game"],\n.ytc-hide-playables #endpoint[title*="Playables"] {\n    display: none !important;\n}\n\n.ytc-hide-members ytd-rich-section-renderer:has(.badge-style-type-members-only),\n.ytc-hide-members ytd-rich-section-renderer:has(.badge-style-type-members-first),\n.ytc-hide-members ytd-rich-section-renderer:has([badge-style="MEMBERS_FIRST"]),\n.ytc-hide-members ytd-rich-section-renderer:has([badge-style="MEMBERS_ONLY"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="hội viên"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Hội viên"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Members only"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="members only"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Members first"]),\n.ytc-hide-members ytd-rich-section-renderer:has([aria-label*="members first"]),\n.ytc-hide-members ytd-rich-section-renderer:has(a[href*="/membership"]),\n.ytc-hide-members ytd-rich-section-renderer:has(a[href*="/memberships"]),\n.ytc-hide-members ytd-rich-section-renderer.ytc-shelf-members,\n.ytc-hide-members ytd-rich-item-renderer:has(.badge-style-type-members-only),\n.ytc-hide-members ytd-rich-item-renderer:has(.badge-style-type-members-first),\n.ytc-hide-members ytd-rich-item-renderer:has([badge-style="MEMBERS_FIRST"]),\n.ytc-hide-members ytd-rich-item-renderer:has([badge-style="MEMBERS_ONLY"]),\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="hội viên"]),\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Hội viên"]),\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Members only"]),\n.ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Members first"]),\n.ytc-hide-members ytd-rich-item-renderer.ytc-item-members,\n.ytc-hide-members ytd-video-renderer:has(.badge-style-type-members-only),\n.ytc-hide-members ytd-video-renderer:has(.badge-style-type-members-first),\n.ytc-hide-members ytd-video-renderer:has([badge-style="MEMBERS_FIRST"]),\n.ytc-hide-members ytd-video-renderer:has([badge-style="MEMBERS_ONLY"]),\n.ytc-hide-members ytd-video-renderer:has([aria-label*="hội viên"]),\n.ytc-hide-members ytd-video-renderer:has([aria-label*="Hội viên"]),\n.ytc-hide-members ytd-video-renderer.ytc-item-members,\n.ytc-hide-members ytd-compact-video-renderer:has(.badge-style-type-members-only),\n.ytc-hide-members ytd-compact-video-renderer:has(.badge-style-type-members-first),\n.ytc-hide-members ytd-compact-video-renderer:has([badge-style="MEMBERS_FIRST"]),\n.ytc-hide-members ytd-compact-video-renderer:has([badge-style="MEMBERS_ONLY"]),\n.ytc-hide-members ytd-compact-video-renderer.ytc-item-members {\n    display: none !important;\n}\n\n.ytc-hide-explore ytd-rich-section-renderer:has(yt-chip-cloud-chip-renderer),\n.ytc-hide-explore ytd-rich-section-renderer:has(yt-chip-cloud-renderer),\n.ytc-hide-explore ytd-rich-section-renderer:has(ytd-feed-filter-chip-bar-renderer),\n.ytc-hide-explore ytd-rich-section-renderer:has(#chips),\n.ytc-hide-explore ytd-rich-section-renderer.ytc-shelf-explore,\n.ytc-hide-explore ytd-rich-section-renderer:has([title*="Khám phá các chủ đề"]),\n.ytc-hide-explore ytd-rich-section-renderer:has([title*="Explore other topics"]),\n.ytc-hide-explore ytd-rich-section-renderer:has([title*="Explore topics"]) {\n    display: none !important;\n}\n\n.ytc-clean-search ytd-ad-slot-renderer,\n.ytc-clean-search ytd-rich-item-renderer:has(ytd-ad-slot-renderer),\n.ytc-clean-search ytd-rich-section-renderer:has(ytd-ad-slot-renderer),\n.ytc-clean-search ytd-video-renderer:has(.badge-style-type-ad) {\n    display: none !important;\n}\n\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-post-renderer),\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-backstage-post-renderer),\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-backstage-post-thread-renderer),\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-post-multi-image-renderer),\n.ytc-hide-community ytd-rich-section-renderer:has(ytd-poll-renderer),\n.ytc-hide-community ytd-rich-section-renderer.ytc-shelf-community,\n.ytc-hide-community ytd-rich-item-renderer:has(ytd-post-renderer),\n.ytc-hide-community ytd-rich-item-renderer:has(ytd-backstage-post-renderer),\n.ytc-hide-community ytd-rich-item-renderer.ytc-item-community,\n.ytc-hide-community ytd-post-renderer,\n.ytc-hide-community ytd-backstage-post-renderer,\n.ytc-hide-community ytd-backstage-post-thread-renderer {\n    display: none !important;\n}\n\n/* --------------------------------------------------------------------------\n   4. TRÌNH PHÁT VIDEO: AMBIENT, THẺ KẾT THÚC, BANNER & LOGO PREMIUM\n   -------------------------------------------------------------------------- */\n.ytc-disable-ambient #cinematics,\n.ytc-disable-ambient ytd-cinematics-renderer,\n.ytc-disable-ambient .ytp-ambient-mode-rendering-container {\n    display: none !important;\n}\n\n.ytc-hide-endscreen .ytp-ce-element,\n.ytc-hide-endscreen .ytp-ce-covering-overlay,\n.ytc-hide-endscreen .ytp-ce-element-show,\n.ytc-hide-endscreen .ytp-ce-video,\n.ytc-hide-endscreen .ytp-ce-playlist,\n.ytc-hide-endscreen .ytp-ce-channel,\n.ytc-hide-endscreen .ytp-ce-subscribe,\n.ytc-hide-endscreen .ytp-cards-button,\n.ytc-hide-endscreen .ytp-cards-teaser,\n.ytc-hide-endscreen .ytp-cards-teaser-box,\n.ytc-hide-endscreen .ytp-card {\n    display: none !important;\n    opacity: 0 !important;\n    pointer-events: none !important;\n}\n\n/* Ẩn logo hình mờ kênh ở góc dưới bên phải video */\n.ytc-hide-watermark .annotation-type-custom.iv-branding,\n.ytc-hide-watermark .iv-branding,\n.ytc-hide-watermark .ytp-iv-video-content .iv-branding,\n.ytc-hide-watermark .ytp-branding-logo,\n.ytc-hide-watermark .ytp-featured-channel,\n.ytc-hide-watermark .ytp-branding-element {\n    display: none !important;\n    opacity: 0 !important;\n    pointer-events: none !important;\n    visibility: hidden !important;\n}\n\n.ytc-auto-dismiss ytd-mealbar-promo-renderer,\n.ytc-auto-dismiss yt-mealbar-promo-renderer,\n.ytc-auto-dismiss ytd-upsell-dialog-renderer,\n.ytc-auto-dismiss ytd-single-option-survey-renderer,\n.ytc-auto-dismiss ytd-in-feed-survey-renderer {\n    display: none !important;\n}\n\n:root.ytc-premium-logo #start.ytd-masthead ytd-topbar-logo-renderer,\n:root.ytc-premium-logo ytd-topbar-logo-renderer#logo {\n    margin-left: 0 !important;\n    display: flex !important;\n    align-items: center !important;\n}\n:root.ytc-premium-logo ytd-topbar-logo-renderer #logo {\n    padding: 18px 4px 18px 16px !important;\n    display: inline-flex !important;\n    align-items: center !important;\n    box-sizing: content-box !important;\n}\nytd-topbar-logo-renderer ytd-yoodle-renderer,\nytd-yoodle-renderer ytd-logo,\nytd-topbar-logo-renderer ytd-yoodle-renderer * {\n    display: none !important;\n}\n:root.ytc-premium-logo ytd-topbar-logo-renderer #logo ytd-logo:not(.ytd-yoodle-renderer),\n:root.ytc-premium-logo ytd-topbar-logo-renderer #logo ytd-logo[hidden]:not(.ytd-yoodle-renderer),\n:root.ytc-premium-logo ytd-topbar-logo-renderer > #logo > div > ytd-logo {\n    width: 101px !important;\n    min-width: 101px !important;\n    max-width: 101px !important;\n    height: 20px !important;\n    display: flex !important;\n    align-items: center !important;\n    overflow: visible !important;\n    visibility: visible !important;\n    opacity: 1 !important;\n}\n:root.ytc-premium-logo ytd-logo:not(.ytd-yoodle-renderer) > *:not(.custom-premium-logo) {\n    display: none !important;\n}\nytd-logo, ytd-topbar-logo-renderer {\n    overflow: visible !important;\n}\n:root:not(.ytc-premium-logo) .custom-premium-logo {\n    display: none !important;\n}\n:root.ytc-premium-logo .custom-premium-logo {\n    display: flex !important;\n    align-items: center !important;\n    width: 101px !important;\n    height: 20px !important;\n    color: var(--yt-spec-wordmark-text, var(--yt-spec-text-primary, #0f0f0f)) !important;\n    pointer-events: none;\n    visibility: visible !important;\n    opacity: 1 !important;\n}\nhtml:not([dark]).ytc-premium-logo .custom-premium-logo,\nhtml:not([dark]) .custom-premium-logo,\n:root:not([dark]).ytc-premium-logo .custom-premium-logo {\n    color: var(--yt-spec-wordmark-text, #0f0f0f) !important;\n}\nhtml[dark].ytc-premium-logo .custom-premium-logo,\nhtml[dark] .custom-premium-logo,\n:root[dark].ytc-premium-logo .custom-premium-logo {\n    color: var(--yt-spec-wordmark-text, #f1f1f1) !important;\n}\n.custom-premium-logo svg {\n    width: 101px !important;\n    height: 20px !important;\n    fill: currentColor !important;\n}\n.custom-premium-logo svg #youtube-paths_yt19,\n.custom-premium-logo svg #youtube-paths_yt19 path {\n    fill: currentColor !important;\n}\n\n:root.ytc-premium-logo ytd-topbar-logo-renderer #country-code {\n    display: inline-block !important;\n    font-size: 10px !important;\n    font-weight: 400 !important;\n    font-family: "Roboto", "Arial", sans-serif !important;\n    line-height: 10px !important;\n    color: var(--yt-spec-text-secondary, #909090) !important;\n    margin-top: 14px !important;\n    margin-left: 4px !important;\n    margin-right: 0 !important;\n    margin-bottom: 0 !important;\n    align-self: flex-start !important;\n    vertical-align: top !important;\n    position: relative !important;\n    top: 0 !important;\n    left: 0 !important;\n}\nhtml:not([dark]).ytc-premium-logo ytd-topbar-logo-renderer #country-code,\nhtml:not([dark]) ytd-topbar-logo-renderer #country-code {\n    color: var(--yt-spec-text-secondary, #606060) !important;\n}\nhtml[dark].ytc-premium-logo ytd-topbar-logo-renderer #country-code,\nhtml[dark] ytd-topbar-logo-renderer #country-code {\n    color: var(--yt-spec-text-secondary, #909090) !important;\n}\n:root.ytc-premium-logo ytd-topbar-logo-renderer #country-code:empty {\n    display: none !important;\n}\n\n/* --------------------------------------------------------------------------\n   5. GIAO DIỆN CÀI ĐẶT: NÚT BÁNH RĂNG & MENU 4 TAB\n   -------------------------------------------------------------------------- */\n#ytc-settings-btn {\n    order: -1 !important;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 40px;\n    height: 40px;\n    border-radius: 50%;\n    border: none;\n    background: transparent;\n    color: var(--yt-spec-text-primary, #f1f1f1);\n    cursor: pointer;\n    margin-right: 8px;\n    flex-shrink: 0;\n    transition: background-color 0.15s;\n    position: relative;\n}\n#ytc-settings-btn:hover {\n    background-color: rgba(255, 255, 255, 0.1);\n}\nhtml:not([dark]) #ytc-settings-btn:hover {\n    background-color: rgba(0, 0, 0, 0.08);\n}\n#ytc-settings-btn svg {\n    width: 24px;\n    height: 24px;\n}\n\n#ytc-settings-panel {\n    position: fixed;\n    width: 310px;\n    max-height: calc(100vh - 80px);\n    overflow-y: auto;\n    background: var(--yt-spec-brand-background-primary, #282828);\n    color: var(--yt-spec-text-primary, #f1f1f1);\n    border-radius: 12px;\n    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);\n    padding: 12px;\n    z-index: 9999;\n    font-family: "Roboto", "Arial", sans-serif;\n    font-size: 14px;\n    display: none;\n    flex-direction: column;\n    gap: 6px;\n    user-select: none;\n    border: 1px solid rgba(255, 255, 255, 0.1);\n}\n#ytc-settings-panel::-webkit-scrollbar {\n    width: 4px;\n}\n#ytc-settings-panel::-webkit-scrollbar-thumb {\n    background: rgba(255, 255, 255, 0.2);\n    border-radius: 2px;\n}\n#ytc-settings-panel.open {\n    display: flex;\n}\n\n.ytc-header {\n    font-weight: 600;\n    font-size: 15px;\n    padding: 4px 6px 8px 6px;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n}\n.ytc-header-badge {\n    font-size: 11px;\n    background: #ff0033;\n    color: white;\n    padding: 2px 6px;\n    border-radius: 4px;\n    font-weight: bold;\n}\n\n.ytc-tabs {\n    display: flex;\n    align-items: center;\n    gap: 4px;\n    background: rgba(255, 255, 255, 0.06);\n    border-radius: 8px;\n    padding: 3px;\n    margin: 4px 0 6px 0;\n}\n.ytc-tab-btn {\n    flex: 1;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    gap: 4px;\n    padding: 6px 2px;\n    border: none;\n    background: transparent;\n    color: #aaa;\n    font-size: 11.5px;\n    font-weight: 500;\n    border-radius: 6px;\n    cursor: pointer;\n    transition: all 0.15s ease;\n    white-space: nowrap;\n}\n.ytc-tab-btn:hover {\n    background: rgba(255, 255, 255, 0.08);\n    color: #fff;\n}\n.ytc-tab-btn.active {\n    background: #f1f1f1;\n    color: #0f0f0f;\n    font-weight: 600;\n}\n.ytc-tab-btn svg {\n    width: 14px;\n    height: 14px;\n    fill: currentColor;\n    flex-shrink: 0;\n}\n.ytc-tab-pane {\n    display: none;\n    flex-direction: column;\n    gap: 4px;\n}\n.ytc-tab-pane.active {\n    display: flex;\n}\n\n.ytc-item {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 8px 8px;\n    border-radius: 8px;\n    cursor: pointer;\n    transition: background 0.15s;\n}\n.ytc-item:hover {\n    background: rgba(255, 255, 255, 0.08);\n}\n\n.ytc-item-left {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n}\n.ytc-item-left svg {\n    width: 20px;\n    height: 20px;\n    fill: currentColor;\n    opacity: 0.9;\n    flex-shrink: 0;\n}\n\n.ytc-switch {\n    position: relative;\n    display: inline-block;\n    width: 36px;\n    height: 20px;\n}\n.ytc-switch input {\n    opacity: 0;\n    width: 0;\n    height: 0;\n}\n.ytc-slider {\n    position: absolute;\n    cursor: pointer;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: #606060;\n    border-radius: 20px;\n    transition: background-color 0.2s;\n}\n.ytc-slider:before {\n    position: absolute;\n    content: "";\n    height: 14px;\n    width: 14px;\n    left: 3px;\n    bottom: 3px;\n    background-color: white;\n    border-radius: 50%;\n    transition: transform 0.2s;\n}\n.ytc-switch input:checked + .ytc-slider {\n    background-color: #3ea6ff;\n}\n.ytc-switch input:checked + .ytc-slider:before {\n    transform: translateX(16px);\n}\n\n.ytc-cols-group {\n    display: flex;\n    align-items: center;\n    gap: 4px;\n    background: rgba(255, 255, 255, 0.08);\n    padding: 2px;\n    border-radius: 6px;\n}\n.ytc-col-btn {\n    border: none;\n    background: transparent;\n    color: #aaa;\n    font-size: 13px;\n    font-weight: 500;\n    padding: 4px 8px;\n    border-radius: 4px;\n    cursor: pointer;\n    transition: all 0.15s;\n}\n.ytc-col-btn.active {\n    background: #f1f1f1;\n    color: #0f0f0f;\n}\n\n.ytc-shortcut-hint {\n    font-size: 12px;\n    color: var(--yt-spec-text-secondary, #aaa);\n    background: rgba(255, 255, 255, 0.04);\n    padding: 8px 10px;\n    border-radius: 6px;\n    line-height: 1.6;\n    margin-top: 4px;\n    border: 1px solid rgba(255, 255, 255, 0.06);\n}\n.ytc-shortcut-hint kbd {\n    background: rgba(255, 255, 255, 0.15);\n    color: var(--yt-spec-text-primary, #fff);\n    padding: 2px 5px;\n    border-radius: 3px;\n    font-family: monospace;\n    font-size: 11px;\n    font-weight: bold;\n}\n\nhtml:not([dark]) #ytc-settings-panel {\n    background: #ffffff;\n    color: #0f0f0f;\n    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.15);\n    border: 1px solid rgba(0, 0, 0, 0.1);\n}\nhtml:not([dark]) .ytc-header {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.08);\n}\nhtml:not([dark]) .ytc-tabs {\n    background: rgba(0, 0, 0, 0.05);\n}\nhtml:not([dark]) .ytc-tab-btn {\n    color: #606060;\n}\nhtml:not([dark]) .ytc-tab-btn:hover {\n    background: rgba(0, 0, 0, 0.06);\n    color: #0f0f0f;\n}\nhtml:not([dark]) .ytc-tab-btn.active {\n    background: #0f0f0f;\n    color: #ffffff;\n}\nhtml:not([dark]) .ytc-shortcut-hint {\n    background: rgba(0, 0, 0, 0.04);\n    color: #606060;\n    border-color: rgba(0, 0, 0, 0.08);\n}\nhtml:not([dark]) .ytc-shortcut-hint kbd {\n    background: rgba(0, 0, 0, 0.1);\n    color: #0f0f0f;\n}\n\n.ytc-divider {\n    height: 1px;\n    background: rgba(255, 255, 255, 0.1);\n    margin: 4px 0;\n}\n';

  // src/features.js
  var ytcPolicy = window.trustedTypes?.createPolicy?.("youtubeCustomizerPolicy", {
    createHTML: (html) => html
  }) || window.trustedTypes?.defaultPolicy;
  function safeHTML(html) {
    return ytcPolicy ? ytcPolicy.createHTML(html) : html;
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
  function isHomeFeedPath() {
    const p = location.pathname;
    return p === "/" || p.startsWith("/feed") || p.startsWith("/@") || p.startsWith("/channel");
  }
  function applyHomeGridColumns() {
    if (!isHomeFeedPath()) return;
    const cols = currentConfig.columns || 4;
    const grids = document.querySelectorAll("ytd-rich-grid-renderer");
    grids.forEach((grid) => {
      if (!grid.classList.contains("ytc-grid")) {
        grid.classList.add("ytc-grid");
      }
      grid.style.setProperty("--ytd-rich-grid-items-per-row", String(cols), "important");
      grid.style.setProperty("--ytd-rich-grid-posts-per-row", String(cols), "important");
      grid.style.setProperty("--ytd-rich-grid-item-max-width", "none", "important");
    });
  }
  var LOGO_MARK = "M32.1819";
  var logoSVG = '<g><path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"/><path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"/></g><g id="youtube-paths_yt19"><path d="M32.1819 2.10016V18.9002H34.7619V12.9102H35.4519C38.8019 12.9102 40.5619 11.1102 40.5619 7.57016V6.88016C40.5619 3.31016 39.0019 2.10016 35.7219 2.10016H32.1819ZM37.8619 7.63016C37.8619 10.0002 37.1419 11.0802 35.4019 11.0802H34.7619V3.95016H35.4519C37.4219 3.95016 37.8619 4.76016 37.8619 7.13016V7.63016Z"/><path d="M41.982 18.9002H44.532V10.0902C44.952 9.37016 45.992 9.05016 47.302 9.32016L47.462 6.33016C47.292 6.31016 47.142 6.29016 47.002 6.29016C45.802 6.29016 44.832 7.20016 44.342 8.86016H44.162L43.952 6.54016H41.982V18.9002H41.982V18.9002Z"/><path d="M55.7461 11.5002C55.7461 8.52016 55.4461 6.31016 52.0161 6.31016C48.7861 6.31016 48.0661 8.46016 48.0661 11.6202V13.7902C48.0661 16.8702 48.7261 19.1102 51.9361 19.1102C54.4761 19.1102 55.7861 17.8402 55.6361 15.3802L53.3861 15.2602C53.3561 16.7802 53.0061 17.4002 51.9961 17.4002C50.7261 17.4002 50.6661 16.1902 50.6661 14.3902V13.5502H55.7461V11.5002ZM51.9561 7.97016C53.1761 7.97016 53.2661 9.12016 53.2661 11.0702V12.0802H50.6661V11.0702C50.6661 9.14016 50.7461 7.97016 51.9561 7.97016Z"/><path d="M60.1945 18.9002V8.92016C60.5745 8.39016 61.1945 8.07016 61.7945 8.07016C62.5645 8.07016 62.8445 8.61016 62.8445 9.69016V18.9002H65.5045L65.4845 8.93016C65.8545 8.37016 66.4845 8.04016 67.1045 8.04016C67.7745 8.04016 68.1445 8.61016 68.1445 9.69016V18.9002H70.8045V9.49016C70.8045 7.28016 70.0145 6.27016 68.3445 6.27016C67.1845 6.27016 66.1945 6.69016 65.2845 7.67016C64.9045 6.76016 64.1545 6.27016 63.0845 6.27016C61.8745 6.27016 60.7345 6.79016 59.9345 7.76016H59.7845L59.5945 6.54016H57.5445V18.9002H60.1945Z"/><path d="M74.0858 4.97016C74.9858 4.97016 75.4058 4.67016 75.4058 3.43016C75.4058 2.27016 74.9558 1.91016 74.0858 1.91016C73.2058 1.91016 72.7758 2.23016 72.7758 3.43016C72.7758 4.67016 73.1858 4.97016 74.0858 4.97016ZM72.8658 18.9002H75.3958V6.54016H72.8658V18.9002Z"/><path d="M79.9516 19.0902C81.4116 19.0902 82.3216 18.4802 83.0716 17.3802H83.1816L83.2916 18.9002H85.2816V6.54016H82.6416V16.4702C82.3616 16.9602 81.7116 17.3202 81.1016 17.3202C80.3316 17.3202 80.0916 16.7102 80.0916 15.6902V6.54016H77.4616V15.8102C77.4616 17.8202 78.0416 19.0902 79.9516 19.0902Z"/><path d="M90.0031 18.9002V8.92016C90.3831 8.39016 91.0031 8.07016 91.6031 8.07016C92.3731 8.07016 92.6531 8.61016 92.6531 9.69016V18.9002H95.3131L95.2931 8.93016C95.6631 8.37016 96.2931 8.04016 96.9131 8.04016C97.5831 8.04016 97.9531 8.61016 97.9531 9.69016V18.9002H100.613V9.49016C100.613 7.28016 99.8231 6.27016 98.1531 6.27016C96.9931 6.27016 96.0031 6.69016 95.0931 7.67016C94.7131 6.76016 93.9631 6.27016 92.8931 6.27016C91.6831 6.27016 90.5431 6.79016 89.7431 7.76016H89.5931L89.4031 6.54016H87.3531V18.9002H90.0031Z"/></g>';
  function buildLogoHtml() {
    return safeHTML(`<svg viewBox="0 0 101 20" width="101" height="20" preserveAspectRatio="xMinYMid meet">${logoSVG}</svg>`);
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
      customSpan.innerHTML = logoHtml;
      logo.appendChild(customSpan);
      logo.setAttribute("is-red-logo", "");
    } else if (!customSpan.innerHTML.includes(LOGO_MARK)) {
      customSpan.innerHTML = logoHtml;
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
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            scheduleFeedScan(container);
            applyHomeGridColumns();
            dismissPromoBanners(container);
            break;
          }
        }
      }).observe(container, { childList: true, subtree: true });
    };
    const target = document.getElementById("page-manager") || document.querySelector("ytd-page-manager") || document.body;
    if (target) attach(target);
    else whenElement("#page-manager", attach);
  }
  document.addEventListener("animationstart", (e) => {
    if (e.animationName !== "ytcConfirmInserted") return;
    const node = e.target;
    if (node.tagName?.toLowerCase() === "yt-confirm-dialog-renderer") {
      setTimeout(() => {
        const confirmBtn = node.querySelector?.("#confirm-button button, yt-button-renderer#confirm-button, #confirm-button");
        if (!confirmBtn || confirmBtn.offsetParent === null) return;
        const text = confirmBtn.innerText || confirmBtn.textContent || "";
        if (text.includes("Có") || text.includes("Yes") || text.includes("CONTINUE")) {
          confirmBtn.click();
          const video = document.querySelector("#movie_player video");
          if (video?.paused) video.play();
        }
      }, 100);
    }
  }, true);
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
  function getPlayerVideo(player) {
    return player.querySelector("video.html5-main-video") || player.querySelector("video");
  }
  var lastSeekAt = 0;
  var SEEK_COOLDOWN_MS = 80;
  function seekBySeconds(player, delta) {
    const now = Date.now();
    if (now - lastSeekAt < SEEK_COOLDOWN_MS) return false;
    lastSeekAt = now;
    const video = getPlayerVideo(player);
    if (!video) return false;
    const duration = Number.isFinite(video.duration) ? video.duration : Infinity;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + delta));
    return true;
  }
  function togglePlayback(player) {
    const video = getPlayerVideo(player);
    if (video) {
      if (video.paused) video.play();
      else video.pause();
      return true;
    }
    if (typeof player.getPlayerState === "function") {
      if (player.getPlayerState() === 1) player.pauseVideo?.();
      else player.playVideo?.();
      return true;
    }
    return false;
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
  var seekModeTimer = null;
  function triggerCleanSeek(player) {
    if (!player) return;
    player.classList.add("seeking-mode");
    clearTimeout(seekModeTimer);
    seekModeTimer = setTimeout(() => {
      player.classList.remove("seeking-mode");
    }, 600);
  }
  function changeVolume(player, delta) {
    if (!player) return;
    const key = delta > 0 ? "ArrowUp" : "ArrowDown";
    const keyCode = delta > 0 ? 38 : 40;
    const vBefore = typeof player.getVolume === "function" ? player.getVolume() : null;
    player.dispatchEvent(new KeyboardEvent("keydown", {
      key,
      code: key,
      keyCode,
      which: keyCode,
      bubbles: true,
      cancelable: true
    }));
    const vAfter = typeof player.getVolume === "function" ? player.getVolume() : null;
    if (vBefore !== null && vAfter !== null && vBefore === vAfter) {
      const next = Math.max(0, Math.min(100, Math.round(vBefore + delta)));
      player.setVolume?.(next);
      if (delta > 0 && player.isMuted?.()) player.unMute?.();
    }
  }
  var keysBound = false;
  function bindGlobalKeys() {
    if (keysBound) return;
    keysBound = true;
    document.addEventListener("keydown", (e) => {
      if (!currentConfig.keyboardControls) return;
      if (e.isComposing || e.keyCode === 229) return;
      const target = e.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      const player = document.querySelector("#movie_player");
      if (!player) return;
      let captured = false;
      let isSeekAction = false;
      const code = e.code || "";
      const isNumpad = e.location === 3 || code.startsWith("Numpad");
      const asdAllowed = canUseAsdKeys(player);
      if (isNumpad) {
        captured = true;
        if (e.key === "8" || e.key === "ArrowUp" || code === "Numpad8" || code === "NumpadAdd" || e.key === "+") {
          changeVolume(player, 5);
        } else if (e.key === "2" || e.key === "ArrowDown" || code === "Numpad2" || code === "NumpadSubtract" || e.key === "-") {
          changeVolume(player, -5);
        } else if (e.key === "4" || e.key === "ArrowLeft" || code === "Numpad4") {
          seekBySeconds(player, -10);
          isSeekAction = true;
        } else if (e.key === "6" || e.key === "ArrowRight" || code === "Numpad6") {
          seekBySeconds(player, 10);
          isSeekAction = true;
        } else if (e.key === "5" || e.key === "Clear" || code === "Numpad5" || e.keyCode === 12) {
          togglePlayback(player);
        }
      } else if (asdAllowed && code === "KeyA") {
        captured = true;
        seekBySeconds(player, -10);
        isSeekAction = true;
      } else if (asdAllowed && code === "KeyS") {
        captured = true;
        togglePlayback(player);
      } else if (asdAllowed && code === "KeyD") {
        captured = true;
        seekBySeconds(player, 10);
        isSeekAction = true;
      } else if (!e.ctrlKey && !e.altKey && !e.metaKey && (code === "KeyF" || e.key === "f" || e.key === "F")) {
        if (isWatchLoading) {
          captured = true;
        }
      }
      if (captured) {
        e.preventDefault();
        e.stopImmediatePropagation();
      } else if (["ArrowLeft", "ArrowRight", "j", "l", "J", "L"].includes(e.key)) {
        isSeekAction = true;
      }
      if (isSeekAction) {
        triggerCleanSeek(player);
      }
    }, true);
  }

  // src/ui.js
  var GEAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>`;
  var GRID_SVG = `<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z"/></svg>`;
  var SHORTS_SVG = `<svg viewBox="0 0 24 24"><path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.5v-5l4.5 2.5-4.5 2.5z"/></svg>`;
  var GAMEPAD_SVG = `<svg viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S20.17 9 21 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`;
  var YOUTUBE_SVG = `<svg viewBox="0 0 24 24"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/></svg>`;
  var SEARCH_SVG = `<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z"/></svg>`;
  var SPARKLE_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2z"/></svg>`;
  var KEYBOARD_SVG = `<svg viewBox="0 0 24 24"><path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>`;
  var CROWN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`;
  var COMPASS_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;
  var LAYOUT_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M4 4h16v4H4V4zm0 6h7v10H4V10zm9 0h7v10h-7V10z"/></svg>`;
  var SHIELD_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>`;
  var PLAYER_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/></svg>`;
  var POST_SVG = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`;
  var ENDSCREEN_SVG = `<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-4h6v4zm6 0h-5v-4h5v4zm0-6H6V7h12v4z"/></svg>`;
  var BELL_OFF_SVG = `<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>`;
  var WATERMARK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
  var menuDismissBound = false;
  function bindMenuDismiss(panel) {
    if (menuDismissBound) return;
    menuDismissBound = true;
    document.addEventListener("click", (e) => {
      if (panel && panel.classList.contains("open")) {
        if (!e.target.closest("#ytc-settings-panel") && !e.target.closest("#ytc-settings-btn")) {
          panel.classList.remove("open");
        }
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel && panel.classList.contains("open")) {
        panel.classList.remove("open");
      }
    });
  }
  function createSettingsPanel(btn) {
    let panel = document.getElementById("ytc-settings-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "ytc-settings-panel";
      panel.innerHTML = safeHTML(`
            <div class="ytc-header">
                <span>YouTube Customizer</span>
                <span class="ytc-header-badge">v2.7</span>
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
                <div class="ytc-item" id="ytc-row-cols">
                    <div class="ytc-item-left">
                        ${GRID_SVG}
                        <span>Số cột trang chủ</span>
                    </div>
                    <div class="ytc-cols-group">
                        <button class="ytc-col-btn ${currentConfig.columns === 3 ? "active" : ""}" data-cols="3">3</button>
                        <button class="ytc-col-btn ${currentConfig.columns === 4 ? "active" : ""}" data-cols="4">4</button>
                        <button class="ytc-col-btn ${currentConfig.columns === 5 ? "active" : ""}" data-cols="5">5</button>
                    </div>
                </div>

                <div class="ytc-item" data-toggle="premiumLogo">
                    <div class="ytc-item-left">
                        ${YOUTUBE_SVG}
                        <span>Logo Premium</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-logo" ${currentConfig.premiumLogo ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideExploreTopics">
                    <div class="ytc-item-left">
                        ${COMPASS_SVG}
                        <span>Ẩn Khám phá chủ đề</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-explore" ${currentConfig.hideExploreTopics ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 2: LỌC NỘI DUNG SẠCH -->
            <div class="ytc-tab-pane" id="ytc-pane-filter">
                <div class="ytc-item" data-toggle="hideShorts">
                    <div class="ytc-item-left">
                        ${SHORTS_SVG}
                        <span>Ẩn mục Shorts</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-shorts" ${currentConfig.hideShorts ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hidePlayables">
                    <div class="ytc-item-left">
                        ${GAMEPAD_SVG}
                        <span>Ẩn mục Chơi game</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-playables" ${currentConfig.hidePlayables ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideMembersOnly">
                    <div class="ytc-item-left">
                        ${CROWN_SVG}
                        <span>Ẩn video Hội viên</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-members" ${currentConfig.hideMembersOnly ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideCommunity">
                    <div class="ytc-item-left">
                        ${POST_SVG}
                        <span>Ẩn bài đăng cộng đồng</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-community" ${currentConfig.hideCommunity ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="cleanSearch">
                    <div class="ytc-item-left">
                        ${SEARCH_SVG}
                        <span>Lọc tìm kiếm sạch</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-search" ${currentConfig.cleanSearch ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 3: TRÌNH PHÁT & VIDEO -->
            <div class="ytc-tab-pane" id="ytc-pane-player">
                <div class="ytc-item" data-toggle="disableAmbient">
                    <div class="ytc-item-left">
                        ${SPARKLE_SVG}
                        <span>Tắt ánh sáng video</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-ambient" ${currentConfig.disableAmbient ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideEndscreen">
                    <div class="ytc-item-left">
                        ${ENDSCREEN_SVG}
                        <span>Ẩn thẻ kết thúc/chú thích</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-endscreen" ${currentConfig.hideEndscreen ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Ẩn logo góc video (MỚI) -->
                <div class="ytc-item" data-toggle="hideWatermark">
                    <div class="ytc-item-left">
                        ${WATERMARK_SVG}
                        <span>Ẩn logo góc video</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-watermark" ${currentConfig.hideWatermark ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="autoDismissPromos">
                    <div class="ytc-item-left">
                        ${BELL_OFF_SVG}
                        <span>Tự đóng banner quảng cáo</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-promos" ${currentConfig.autoDismissPromos ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 4: PHÍM TẮT & TIỆN ÍCH -->
            <div class="ytc-tab-pane" id="ytc-pane-shortcuts">
                <div class="ytc-item" data-toggle="keyboardControls">
                    <div class="ytc-item-left">
                        ${KEYBOARD_SVG}
                        <span>Phím tắt (A-S-D, Numpad)</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-keys" ${currentConfig.keyboardControls ? "checked" : ""}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-shortcut-hint">
                    <div><kbd>A</kbd> / <kbd>D</kbd> : Tua lùi / tiến 5 giây</div>
                    <div style="margin-top:4px"><kbd>S</kbd> : Tạm dừng / phát tiếp</div>
                    <div style="margin-top:4px"><kbd>1-9 (Numpad)</kbd> : Tua nhanh 10s - 90s</div>
                    <div style="margin-top:4px"><kbd>Shift + Numpad</kbd> : Tua lùi theo giây</div>
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
      panel.querySelectorAll(".ytc-item[data-toggle]").forEach((item) => {
        const key = item.getAttribute("data-toggle");
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (!checkbox) return;
        checkbox.addEventListener("change", () => {
          currentConfig[key] = checkbox.checked;
          saveConfig(currentConfig);
          applyConfigToRoot();
        });
        item.addEventListener("click", (e) => {
          if (!e.target.closest(".ytc-switch")) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event("change"));
          }
        });
      });
    }
    function updatePanelPosition() {
      const rect = btn.getBoundingClientRect();
      panel.style.top = rect.bottom + 8 + "px";
      panel.style.right = Math.max(12, window.innerWidth - rect.right - 10) + "px";
    }
    btn.addEventListener("mouseenter", updatePanelPosition, { passive: true });
    window.addEventListener("resize", () => {
      if (panel.classList.contains("open")) updatePanelPosition();
    }, { passive: true });
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!panel.style.top) updatePanelPosition();
      panel.classList.toggle("open");
    });
    bindMenuDismiss(panel);
  }
  function ensureSettingsElements() {
    const endContainer = document.querySelector("ytd-masthead #end, #masthead #end, #end.ytd-masthead");
    if (!endContainer) return;
    let btn = document.getElementById("ytc-settings-btn");
    const isNewBtn = !btn;
    if (isNewBtn) {
      btn = document.createElement("button");
      btn.id = "ytc-settings-btn";
      btn.title = "YouTube Customizer";
      btn.innerHTML = safeHTML(GEAR_SVG);
    }
    if (btn.parentElement !== endContainer || btn !== endContainer.firstElementChild) {
      endContainer.insertBefore(btn, endContainer.firstElementChild);
    }
    createSettingsPanel(btn);
  }
  function setupSettingsObserver() {
    ensureSettingsElements();
    const attach = (masthead2) => {
      ensureSettingsElements();
      new MutationObserver(() => {
        ensureSettingsElements();
      }).observe(masthead2, { childList: true, subtree: true });
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
  var CONFIG_KEY = "ytc_config_v2";
  var DEFAULT_CONFIG = {
    columns: 4,
    // 3, 4 hoặc 5 cột (mặc định 4)
    hideShorts: true,
    // Ẩn Shorts hoàn toàn
    hidePlayables: true,
    // Ẩn Chơi game (Playables)
    hideMembersOnly: true,
    // Ẩn mục video Hội viên
    hideExploreTopics: true,
    // Ẩn Khám phá các chủ đề khác
    hideCommunity: true,
    // Ẩn bài đăng cộng đồng
    hideEndscreen: true,
    // Ẩn thẻ kết thúc & chú thích
    hideWatermark: true,
    // Ẩn logo hình mờ kênh ở góc video
    autoDismissPromos: true,
    // Tự động đóng banner khuyến mại
    premiumLogo: true,
    // Logo YouTube Premium
    cleanSearch: true,
    // Ẩn video tài trợ / quảng cáo tìm kiếm
    disableAmbient: true,
    // Tắt Ambient Mode (Cinematics)
    keyboardControls: true
    // Phím tắt A-S-D & Numpad
  };
  function loadConfig() {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      return stored ? Object.assign({}, DEFAULT_CONFIG, JSON.parse(stored)) : Object.assign({}, DEFAULT_CONFIG);
    } catch (e) {
      return Object.assign({}, DEFAULT_CONFIG);
    }
  }
  function saveConfig(cfg) {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    } catch (e) {
    }
  }
  var currentConfig = loadConfig();
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
    root.setAttribute("data-ytc-cols", String(currentConfig.columns || 4));
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
      document.body.setAttribute("data-ytc-cols", String(currentConfig.columns || 4));
    }
    applyHomeGridColumns();
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
  injectStyles(styles_default);
  applyConfigToRoot();
  function onNavigate() {
    applyConfigToRoot();
    scheduleLogoScan(document);
    ensureSettingsElements();
    bindGlobalKeys();
    setupFullscreenLock();
    dismissPromoBanners(document);
    if (location.pathname.startsWith("/watch")) {
      setWatchLoading(true);
    } else if (isHomeFeedPath()) {
      applyHomeGridColumns();
      scheduleFeedScan(document);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onNavigate, { once: true });
  } else {
    onNavigate();
  }
  document.addEventListener("yt-navigate-start", () => {
    if (location.pathname.startsWith("/watch")) {
      setWatchLoading(true);
    }
  });
  document.addEventListener("yt-navigate-finish", onNavigate);
  window.addEventListener("resize", applyHomeGridColumns);
  setupLogoObserver();
  setupSettingsObserver();
  setupFeedShelvesObserver();
  setupFullscreenLock();
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
})();
