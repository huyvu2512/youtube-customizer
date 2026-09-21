// ==UserScript==
// YouTube Customizer v2.5 — https://github.com/huyvu2512/youtube-customizer
// ==/UserScript==
(function() {
    'use strict';

    // 0. CẤU HÌNH & LƯU TRỮ (LOCALSTORAGE)
    const CONFIG_KEY = 'ytc_config_v2';
    const DEFAULT_CONFIG = {
        columns: 4,             // 3, 4 hoặc 5 cột (mặc định 4)
        hideShorts: true,       // Ẩn Shorts hoàn toàn
        hidePlayables: true,    // Ẩn Chơi game (Playables)
        hideMembersOnly: true,  // Ẩn mục video Hội viên
        hideExploreTopics: true,// Ẩn Khám phá các chủ đề khác
        premiumLogo: true,      // Logo YouTube Premium
        cleanSearch: true,      // Ẩn video tài trợ / quảng cáo tìm kiếm
        disableAmbient: true,   // Tắt Ambient Mode (Cinematics)
        keyboardControls: true, // Phím tắt A-S-D & Numpad
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
        } catch (e) {}
    }

    const currentConfig = loadConfig();

    function applyConfigToRoot() {
        const root = document.documentElement;
        if (!root) return;

        root.classList.toggle('ytc-hide-shorts', !!currentConfig.hideShorts);
        root.classList.toggle('ytc-hide-playables', !!currentConfig.hidePlayables);
        root.classList.toggle('ytc-hide-members', !!currentConfig.hideMembersOnly);
        root.classList.toggle('ytc-hide-explore', !!currentConfig.hideExploreTopics);
        root.classList.toggle('ytc-premium-logo', !!currentConfig.premiumLogo);
        root.classList.toggle('ytc-clean-search', !!currentConfig.cleanSearch);
        root.classList.toggle('ytc-disable-ambient', !!currentConfig.disableAmbient);
        root.setAttribute('data-ytc-cols', String(currentConfig.columns || 4));

        if (document.body) {
            document.body.classList.toggle('ytc-hide-shorts', !!currentConfig.hideShorts);
            document.body.classList.toggle('ytc-hide-playables', !!currentConfig.hidePlayables);
            document.body.classList.toggle('ytc-hide-members', !!currentConfig.hideMembersOnly);
            document.body.classList.toggle('ytc-hide-explore', !!currentConfig.hideExploreTopics);
            document.body.classList.toggle('ytc-premium-logo', !!currentConfig.premiumLogo);
            document.body.classList.toggle('ytc-clean-search', !!currentConfig.cleanSearch);
            document.body.classList.toggle('ytc-disable-ambient', !!currentConfig.disableAmbient);
            document.body.setAttribute('data-ytc-cols', String(currentConfig.columns || 4));
        }

        applyHomeGridColumns();
    }

    // 1. TỐI ƯU CSS & GIAO DIỆN
    function addCustomStyles() {
        if (document.getElementById('yt-customizer-styles')) return;
        const style = document.createElement('style');
        style.id = 'yt-customizer-styles';
        style.textContent = `
            /* ==============================================
               LƯỚI VIDEO TRANG CHỦ & FEED: ÉP 4 CỘT CHUẨN XÁC
               ============================================== */
            @media (min-width: 900px) {
                ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,
                ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer,
                ytd-browse[page-subtype="channels"] ytd-rich-grid-renderer,
                #page-manager ytd-browse ytd-rich-grid-renderer,
                ytd-rich-grid-renderer.ytc-grid,
                ytd-rich-grid-renderer {
                    --ytd-rich-grid-items-per-row: 4 !important;
                    --ytd-rich-grid-posts-per-row: 4 !important;
                    --ytd-rich-grid-item-max-width: none !important;
                }

                /* Ép chiều rộng mỗi thẻ video hiển thị đúng 4 cột */
                #contents.ytd-rich-grid-row ytd-rich-item-renderer,
                ytd-rich-grid-renderer ytd-rich-item-renderer {
                    width: calc(100% / var(--ytd-rich-grid-items-per-row, 4) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;
                    max-width: calc(100% / var(--ytd-rich-grid-items-per-row, 4) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;
                }

                /* Tùy chỉnh khi người dùng chọn 3 hoặc 5 cột */
                [data-ytc-cols="3"] ytd-rich-grid-renderer {
                    --ytd-rich-grid-items-per-row: 3 !important;
                    --ytd-rich-grid-posts-per-row: 3 !important;
                }
                [data-ytc-cols="4"] ytd-rich-grid-renderer {
                    --ytd-rich-grid-items-per-row: 4 !important;
                    --ytd-rich-grid-posts-per-row: 4 !important;
                }
                [data-ytc-cols="5"] ytd-rich-grid-renderer {
                    --ytd-rich-grid-items-per-row: 5 !important;
                    --ytd-rich-grid-posts-per-row: 5 !important;
                }
            }

            /* Cắt gọn thumbnail hover, tránh vỡ layout và chồng chéo */
            #page-manager ytd-rich-item-renderer {
                overflow: hidden !important;
                border-radius: 12px;
            }
            #page-manager ytd-rich-item-renderer:hover {
                z-index: 2;
                position: relative;
            }

            /* Tắt Ambient Mode & Cinematics để giảm tải GPU tối đa */
            .ytc-disable-ambient #cinematics,
            .ytc-disable-ambient ytd-cinematics-renderer,
            .ytc-disable-ambient .ytp-ambient-mode-rendering-container {
                display: none !important;
            }

            /* Tối ưu render danh sách bình luận (Lazy Render) */
            ytd-comment-thread-renderer {
                content-visibility: auto;
                contain-intrinsic-size: auto 200px;
            }

            /* Bắt sự kiện dialog tự động mà không cần mutation observer nặng */
            @keyframes ytcConfirmInserted {
                from { clip-path: inset(0); }
                to { clip-path: inset(0); }
            }
            yt-confirm-dialog-renderer {
                animation: ytcConfirmInserted 0.001s;
            }

            /* Chế độ Clean Seek: Tự ẩn controls và con trỏ khi tua phím */
            #movie_player.seeking-mode .ytp-chrome-bottom,
            #movie_player.seeking-mode .ytp-gradient-bottom,
            #movie_player.seeking-mode .ytp-chrome-top {
                opacity: 0 !important;
                transition: opacity 0.15s ease;
            }
            #movie_player.seeking-mode {
                cursor: none !important;
            }

            /* Ẩn triệt để mục Shorts không để lại khoảng trắng (dùng :has) */
            .ytc-hide-shorts ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
            .ytc-hide-shorts ytd-rich-section-renderer:has(ytd-reel-shelf-renderer),
            .ytc-hide-shorts ytd-rich-shelf-renderer[is-shorts],
            .ytc-hide-shorts ytd-reel-shelf-renderer,
            .ytc-hide-shorts ytd-guide-entry-renderer:has(a[href^="/shorts"]),
            .ytc-hide-shorts ytd-mini-guide-entry-renderer:has(a[href^="/shorts"]),
            .ytc-hide-shorts ytd-guide-entry-renderer a[title="Shorts"],
            .ytc-hide-shorts ytd-mini-guide-entry-renderer[aria-label="Shorts"],
            .ytc-hide-shorts #endpoint[title="Shorts"],
            .ytc-hide-shorts ytd-mealbar-promo-renderer,
            .ytc-hide-shorts ytd-upsell-dialog-renderer {
                display: none !important;
            }

            /* Ẩn triệt để mục Chơi game (Playables) không để lại khoảng trắng */
            .ytc-hide-playables ytd-rich-section-renderer:has([is-mini-game-card-shelf]),
            .ytc-hide-playables ytd-rich-shelf-renderer[is-mini-game-card-shelf],
            .ytc-hide-playables ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-mini-game-card-shelf]),
            .ytc-hide-playables ytd-rich-section-renderer:has(a[href*="/playables"]),
            .ytc-hide-playables ytd-rich-section-renderer:has(a[href*="playables"]),
            .ytc-hide-playables ytd-guide-entry-renderer:has(a[href*="/playables"]),
            .ytc-hide-playables ytd-mini-guide-entry-renderer:has(a[href*="/playables"]),
            .ytc-hide-playables ytd-guide-entry-renderer a[title*="Chơi game"],
            .ytc-hide-playables ytd-guide-entry-renderer a[title*="Playables"],
            .ytc-hide-playables ytd-mini-guide-entry-renderer[aria-label*="Chơi game"],
            .ytc-hide-playables ytd-mini-guide-entry-renderer[aria-label*="Playables"],
            .ytc-hide-playables #endpoint[title*="Chơi game"],
            .ytc-hide-playables #endpoint[title*="Playables"] {
                display: none !important;
            }

            /* Ẩn mục video Hội viên (Chỉ dành cho hội viên & Ưu tiên hội viên) */
            .ytc-hide-members ytd-rich-section-renderer:has(.badge-style-type-members-only),
            .ytc-hide-members ytd-rich-section-renderer:has(.badge-style-type-members-first),
            .ytc-hide-members ytd-rich-section-renderer:has([badge-style="MEMBERS_FIRST"]),
            .ytc-hide-members ytd-rich-section-renderer:has([badge-style="MEMBERS_ONLY"]),
            .ytc-hide-members ytd-rich-section-renderer:has([aria-label*="hội viên"]),
            .ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Hội viên"]),
            .ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Members only"]),
            .ytc-hide-members ytd-rich-section-renderer:has([aria-label*="members only"]),
            .ytc-hide-members ytd-rich-section-renderer:has([aria-label*="Members first"]),
            .ytc-hide-members ytd-rich-section-renderer:has([aria-label*="members first"]),
            .ytc-hide-members ytd-rich-section-renderer:has(a[href*="/membership"]),
            .ytc-hide-members ytd-rich-section-renderer:has(a[href*="/memberships"]),
            .ytc-hide-members ytd-rich-section-renderer.ytc-shelf-members,
            .ytc-hide-members ytd-rich-item-renderer:has(.badge-style-type-members-only),
            .ytc-hide-members ytd-rich-item-renderer:has(.badge-style-type-members-first),
            .ytc-hide-members ytd-rich-item-renderer:has([badge-style="MEMBERS_FIRST"]),
            .ytc-hide-members ytd-rich-item-renderer:has([badge-style="MEMBERS_ONLY"]),
            .ytc-hide-members ytd-rich-item-renderer:has([aria-label*="hội viên"]),
            .ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Hội viên"]),
            .ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Members only"]),
            .ytc-hide-members ytd-rich-item-renderer:has([aria-label*="Members first"]),
            .ytc-hide-members ytd-rich-item-renderer.ytc-item-members,
            .ytc-hide-members ytd-video-renderer:has(.badge-style-type-members-only),
            .ytc-hide-members ytd-video-renderer:has(.badge-style-type-members-first),
            .ytc-hide-members ytd-video-renderer:has([badge-style="MEMBERS_FIRST"]),
            .ytc-hide-members ytd-video-renderer:has([badge-style="MEMBERS_ONLY"]),
            .ytc-hide-members ytd-video-renderer:has([aria-label*="hội viên"]),
            .ytc-hide-members ytd-video-renderer:has([aria-label*="Hội viên"]),
            .ytc-hide-members ytd-video-renderer.ytc-item-members,
            .ytc-hide-members ytd-compact-video-renderer:has(.badge-style-type-members-only),
            .ytc-hide-members ytd-compact-video-renderer:has(.badge-style-type-members-first),
            .ytc-hide-members ytd-compact-video-renderer:has([badge-style="MEMBERS_FIRST"]),
            .ytc-hide-members ytd-compact-video-renderer:has([badge-style="MEMBERS_ONLY"]),
            .ytc-hide-members ytd-compact-video-renderer.ytc-item-members {
                display: none !important;
            }

            /* Ẩn mục Khám phá các chủ đề khác (Explore topics) */
            .ytc-hide-explore ytd-rich-section-renderer:has(yt-chip-cloud-chip-renderer),
            .ytc-hide-explore ytd-rich-section-renderer:has(yt-chip-cloud-renderer),
            .ytc-hide-explore ytd-rich-section-renderer:has(ytd-feed-filter-chip-bar-renderer),
            .ytc-hide-explore ytd-rich-section-renderer:has(#chips),
            .ytc-hide-explore ytd-rich-section-renderer.ytc-shelf-explore,
            .ytc-hide-explore ytd-rich-section-renderer:has([title*="Khám phá các chủ đề"]),
            .ytc-hide-explore ytd-rich-section-renderer:has([title*="Explore other topics"]),
            .ytc-hide-explore ytd-rich-section-renderer:has([title*="Explore topics"]) {
                display: none !important;
            }

            /* Clean Search: Ẩn video tài trợ / quảng cáo trong kết quả tìm kiếm */
            .ytc-clean-search ytd-ad-slot-renderer,
            .ytc-clean-search ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
            .ytc-clean-search ytd-rich-section-renderer:has(ytd-ad-slot-renderer),
            .ytc-clean-search ytd-video-renderer:has(.badge-style-type-ad) {
                display: none !important;
            }

            /* Logo Premium: Khoảng cách chuẩn với nút tab điều hướng (guide button) & định dạng logo */
            :root.ytc-premium-logo #start.ytd-masthead ytd-topbar-logo-renderer,
            :root.ytc-premium-logo ytd-topbar-logo-renderer#logo {
                margin-left: 16px !important;
                display: flex !important;
                align-items: center !important;
            }
            :root.ytc-premium-logo ytd-topbar-logo-renderer #logo {
                padding: 18px 4px 18px 16px !important;
                display: inline-flex !important;
                align-items: center !important;
                box-sizing: content-box !important;
            }
            :root.ytc-premium-logo ytd-topbar-logo-renderer #logo > div,
            :root.ytc-premium-logo ytd-topbar-logo-renderer ytd-logo {
                width: 101px !important;
                min-width: 101px !important;
                max-width: 101px !important;
                height: 20px !important;
                display: flex !important;
                align-items: center !important;
                overflow: visible !important;
            }
            :root.ytc-premium-logo ytd-logo > *:not(.custom-premium-logo) {
                display: none !important;
            }
            ytd-logo, ytd-topbar-logo-renderer {
                overflow: visible !important;
            }
            :root:not(.ytc-premium-logo) .custom-premium-logo {
                display: none !important;
            }
            :root.ytc-premium-logo .custom-premium-logo {
                display: flex !important;
                align-items: center;
                width: 101px !important;
                height: 20px !important;
                color: var(--yt-spec-wordmark-text, var(--yt-spec-text-primary, #0f0f0f)) !important;
                pointer-events: none;
            }
            /* Giao diện sáng (Light Theme): chữ Premium màu đen chuẩn YouTube (#0f0f0f) */
            html:not([dark]).ytc-premium-logo .custom-premium-logo,
            html:not([dark]) .custom-premium-logo,
            :root:not([dark]).ytc-premium-logo .custom-premium-logo {
                color: var(--yt-spec-wordmark-text, #0f0f0f) !important;
            }
            /* Giao diện tối (Dark Theme): chữ Premium màu trắng chuẩn YouTube (#f1f1f1) */
            html[dark].ytc-premium-logo .custom-premium-logo,
            html[dark] .custom-premium-logo,
            :root[dark].ytc-premium-logo .custom-premium-logo {
                color: var(--yt-spec-wordmark-text, #f1f1f1) !important;
            }
            .custom-premium-logo svg {
                width: 101px !important;
                height: 20px !important;
                fill: currentColor !important;
            }
            .custom-premium-logo svg #youtube-paths_yt19,
            .custom-premium-logo svg #youtube-paths_yt19 path {
                fill: currentColor !important;
            }

            /* Mã quốc gia (#country-code): Đặt ở góc trên bên phải chữ Premium (không bị đè) & đồng bộ theme */
            :root.ytc-premium-logo ytd-topbar-logo-renderer #country-code {
                display: inline-block !important;
                font-size: 10px !important;
                font-weight: 400 !important;
                font-family: "Roboto", "Arial", sans-serif !important;
                line-height: 10px !important;
                color: var(--yt-spec-text-secondary, #909090) !important;
                margin-top: 14px !important;
                margin-left: 4px !important;
                margin-right: 0 !important;
                margin-bottom: 0 !important;
                align-self: flex-start !important;
                vertical-align: top !important;
                position: relative !important;
                top: 0 !important;
                left: 0 !important;
            }
            html:not([dark]).ytc-premium-logo ytd-topbar-logo-renderer #country-code,
            html:not([dark]) ytd-topbar-logo-renderer #country-code {
                color: var(--yt-spec-text-secondary, #606060) !important;
            }
            html[dark].ytc-premium-logo ytd-topbar-logo-renderer #country-code,
            html[dark] ytd-topbar-logo-renderer #country-code {
                color: var(--yt-spec-text-secondary, #909090) !important;
            }
            :root.ytc-premium-logo ytd-topbar-logo-renderer #country-code:empty {
                display: none !important;
            }

            /* Khóa nút phóng to khi video đang load (chống lỗi kẹt giao diện) */
            .ytc-fs-locked .ytp-fullscreen-button {
                opacity: 0.35 !important;
                pointer-events: none !important;
                cursor: not-allowed !important;
                transition: opacity 0.2s ease !important;
            }

            /* ==============================================
               TỐI ƯU SIÊU MƯỢT KHUNG LIVE CHAT (ZERO-LAG LIVE STREAM)
               ============================================== */
            /* Cách ly layout khung chat để không gây giật lag trang chính */
            ytd-live-chat-frame#chat,
            #chat.ytd-watch-flexy,
            iframe#chatframe {
                contain: layout style paint !important;
            }

            /* Tối ưu render từng tin nhắn live chat */
            yt-live-chat-text-message-renderer,
            yt-live-chat-paid-message-renderer,
            yt-live-chat-membership-item-renderer {
                content-visibility: auto !important;
                contain-intrinsic-size: auto 32px !important;
            }

            /* --- NÚT VÀ BẢNG CÀI ĐẶT (CHUẨN GIAO DIỆN YOUTUBE) --- */
            #ytc-settings-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background: transparent;
                color: var(--yt-spec-text-primary, #f1f1f1);
                cursor: pointer;
                margin-right: 8px;
                flex-shrink: 0;
                transition: background-color 0.15s;
                position: relative;
            }
            #ytc-settings-btn:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            html:not([dark]) #ytc-settings-btn:hover {
                background-color: rgba(0, 0, 0, 0.08);
            }
            #ytc-settings-btn svg {
                width: 24px;
                height: 24px;
            }

            /* Bảng menu cài đặt */
            #ytc-settings-panel {
                position: fixed;
                width: 280px;
                background: var(--yt-spec-brand-background-primary, #282828);
                color: var(--yt-spec-text-primary, #f1f1f1);
                border-radius: 12px;
                box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);
                padding: 12px;
                z-index: 9999;
                font-family: "Roboto", "Arial", sans-serif;
                font-size: 14px;
                display: none;
                flex-direction: column;
                gap: 6px;
                user-select: none;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            #ytc-settings-panel.open {
                display: flex;
            }

            .ytc-header {
                font-weight: 600;
                font-size: 15px;
                padding: 4px 8px 8px 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .ytc-header-badge {
                font-size: 11px;
                background: #ff0033;
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: bold;
            }

            .ytc-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 8px;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.15s;
            }
            .ytc-item:hover {
                background: rgba(255, 255, 255, 0.08);
            }

            .ytc-item-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .ytc-item-left svg {
                width: 20px;
                height: 20px;
                fill: currentColor;
                opacity: 0.9;
            }

            /* Toggle Switch */
            .ytc-switch {
                position: relative;
                display: inline-block;
                width: 36px;
                height: 20px;
            }
            .ytc-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .ytc-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #606060;
                border-radius: 20px;
                transition: background-color 0.2s;
            }
            .ytc-slider:before {
                position: absolute;
                content: "";
                height: 14px;
                width: 14px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                border-radius: 50%;
                transition: transform 0.2s;
            }
            .ytc-switch input:checked + .ytc-slider {
                background-color: #3ea6ff;
            }
            .ytc-switch input:checked + .ytc-slider:before {
                transform: translateX(16px);
            }

            /* Nhóm nút chọn số cột */
            .ytc-cols-group {
                display: flex;
                align-items: center;
                gap: 4px;
                background: rgba(255, 255, 255, 0.08);
                padding: 2px;
                border-radius: 6px;
            }
            .ytc-col-btn {
                border: none;
                background: transparent;
                color: #aaa;
                font-size: 13px;
                font-weight: 500;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.15s;
            }
            .ytc-col-btn.active {
                background: #f1f1f1;
                color: #0f0f0f;
            }

            .ytc-divider {
                height: 1px;
                background: rgba(255, 255, 255, 0.1);
                margin: 4px 0;
            }
        `;
        const target = document.head || document.documentElement;
        if (target) {
            target.appendChild(style);
        } else {
            const docObserver = new MutationObserver(() => {
                const t = document.head || document.documentElement;
                if (t) {
                    docObserver.disconnect();
                    if (!document.getElementById('yt-customizer-styles')) {
                        t.appendChild(style);
                    }
                }
            });
            docObserver.observe(document, { childList: true });
        }
    }

    addCustomStyles();
    applyConfigToRoot();

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

    function whenElement(selector, callback, timeout = 5000) {
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
        const root = document.querySelector('ytd-app') || document.documentElement || document;
        observer.observe(root, { childList: true, subtree: true });
        if (timeout > 0) {
            timer = setTimeout(() => observer.disconnect(), timeout);
        }
    }

    // 2. LƯỚI CỘT TÙY BIẾN
    function isHomeFeedPath() {
        const p = location.pathname;
        return p === '/' || p === '/feed/subscriptions' || p.startsWith('/feed');
    }

    function applyHomeGridColumns() {
        if (!isHomeFeedPath()) return;
        const cols = currentConfig.columns || 4;
        const grids = document.querySelectorAll('ytd-rich-grid-renderer');
        grids.forEach((grid) => {
            if (!grid.classList.contains('ytc-grid')) {
                grid.classList.add('ytc-grid');
            }
            grid.style.setProperty('--ytd-rich-grid-items-per-row', String(cols), 'important');
            grid.style.setProperty('--ytd-rich-grid-posts-per-row', String(cols), 'important');
            grid.style.setProperty('--ytd-rich-grid-item-max-width', 'none', 'important');
        });
    }

    // 3. LOGO YOUTUBE PREMIUM
    const LOGO_MARK = 'M32.1819';
    const logoSVG = '<g><path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"/><path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"/></g><g id="youtube-paths_yt19"><path d="M32.1819 2.10016V18.9002H34.7619V12.9102H35.4519C38.8019 12.9102 40.5619 11.1102 40.5619 7.57016V6.88016C40.5619 3.31016 39.0019 2.10016 35.7219 2.10016H32.1819ZM37.8619 7.63016C37.8619 10.0002 37.1419 11.0802 35.4019 11.0802H34.7619V3.95016H35.4519C37.4219 3.95016 37.8619 4.76016 37.8619 7.13016V7.63016Z"/><path d="M41.982 18.9002H44.532V10.0902C44.952 9.37016 45.992 9.05016 47.302 9.32016L47.462 6.33016C47.292 6.31016 47.142 6.29016 47.002 6.29016C45.802 6.29016 44.832 7.20016 44.342 8.86016H44.162L43.952 6.54016H41.982V18.9002H41.982V18.9002Z"/><path d="M55.7461 11.5002C55.7461 8.52016 55.4461 6.31016 52.0161 6.31016C48.7861 6.31016 48.0661 8.46016 48.0661 11.6202V13.7902C48.0661 16.8702 48.7261 19.1102 51.9361 19.1102C54.4761 19.1102 55.7861 17.8402 55.6361 15.3802L53.3861 15.2602C53.3561 16.7802 53.0061 17.4002 51.9961 17.4002C50.7261 17.4002 50.6661 16.1902 50.6661 14.3902V13.5502H55.7461V11.5002ZM51.9561 7.97016C53.1761 7.97016 53.2661 9.12016 53.2661 11.0702V12.0802H50.6661V11.0702C50.6661 9.14016 50.7461 7.97016 51.9561 7.97016Z"/><path d="M60.1945 18.9002V8.92016C60.5745 8.39016 61.1945 8.07016 61.7945 8.07016C62.5645 8.07016 62.8445 8.61016 62.8445 9.69016V18.9002H65.5045L65.4845 8.93016C65.8545 8.37016 66.4845 8.04016 67.1045 8.04016C67.7745 8.04016 68.1445 8.61016 68.1445 9.69016V18.9002H70.8045V9.49016C70.8045 7.28016 70.0145 6.27016 68.3445 6.27016C67.1845 6.27016 66.1945 6.69016 65.2845 7.67016C64.9045 6.76016 64.1545 6.27016 63.0845 6.27016C61.8745 6.27016 60.7345 6.79016 59.9345 7.76016H59.7845L59.5945 6.54016H57.5445V18.9002H60.1945Z"/><path d="M74.0858 4.97016C74.9858 4.97016 75.4058 4.67016 75.4058 3.43016C75.4058 2.27016 74.9558 1.91016 74.0858 1.91016C73.2058 1.91016 72.7758 2.23016 72.7758 3.43016C72.7758 4.67016 73.1858 4.97016 74.0858 4.97016ZM72.8658 18.9002H75.3958V6.54016H72.8658V18.9002Z"/><path d="M79.9516 19.0902C81.4116 19.0902 82.3216 18.4802 83.0716 17.3802H83.1816L83.2916 18.9002H85.2816V6.54016H82.6416V16.4702C82.3616 16.9602 81.7116 17.3202 81.1016 17.3202C80.3316 17.3202 80.0916 16.7102 80.0916 15.6902V6.54016H77.4616V15.8102C77.4616 17.8202 78.0416 19.0902 79.9516 19.0902Z"/><path d="M90.0031 18.9002V8.92016C90.3831 8.39016 91.0031 8.07016 91.6031 8.07016C92.3731 8.07016 92.6531 8.61016 92.6531 9.69016V18.9002H95.3131L95.2931 8.93016C95.6631 8.37016 96.2931 8.04016 96.9131 8.04016C97.5831 8.04016 97.9531 8.61016 97.9531 9.69016V18.9002H100.613V9.49016C100.613 7.28016 99.8231 6.27016 98.1531 6.27016C96.9931 6.27016 96.0031 6.69016 95.0931 7.67016C94.7131 6.76016 93.9631 6.27016 92.8931 6.27016C91.6831 6.27016 90.5431 6.79016 89.7431 7.76016H89.5931L89.4031 6.54016H87.3531V18.9002H90.0031Z"/></g>';

    const ytcPolicy = window.trustedTypes?.createPolicy?.('youtubeCustomizerPolicy', {
        createHTML: (html) => html,
    }) || window.trustedTypes?.defaultPolicy;

    function safeHTML(html) {
        return ytcPolicy ? ytcPolicy.createHTML(html) : html;
    }

    function buildLogoHtml() {
        return safeHTML(`<svg viewBox="0 0 101 20" width="101" height="20" preserveAspectRatio="xMinYMid meet">${logoSVG}</svg>`);
    }

    function ensurePremiumLogo(logo) {
        if (!logo) return;
        logo.style.overflow = 'visible';
        let parent = logo.parentElement;
        while (parent && parent.tagName.toLowerCase() !== 'ytd-topbar-logo-renderer') {
            parent.style.overflow = 'visible';
            parent = parent.parentElement;
        }

        let customSpan = logo.querySelector('.custom-premium-logo');
        const logoHtml = buildLogoHtml();

        if (!customSpan) {
            customSpan = document.createElement('span');
            customSpan.className = 'custom-premium-logo';
            customSpan.innerHTML = logoHtml;
            logo.appendChild(customSpan);
            logo.setAttribute('is-red-logo', '');
        } else if (!customSpan.innerHTML.includes(LOGO_MARK)) {
            customSpan.innerHTML = logoHtml;
        }
    }

    const scheduleLogoScan = rafThrottle((root) => {
        const scope = root && root.querySelectorAll ? root : document;
        scope.querySelectorAll('ytd-logo').forEach(ensurePremiumLogo);
    });

    function setupLogoObserver() {
        scheduleLogoScan(document);

        const attach = (masthead) => {
            new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType !== 1) return;
                            if (node.matches?.('ytd-logo')) scheduleLogoScan(node.parentElement || masthead);
                            else if (node.querySelector?.('ytd-logo')) scheduleLogoScan(node);
                        });
                    } else if (mutation.type === 'attributes' && mutation.target.matches?.('ytd-logo')) {
                        ensurePremiumLogo(mutation.target);
                    }
                }
            }).observe(masthead, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
        };

        const masthead = document.querySelector('ytd-masthead');
        if (masthead) attach(masthead);
        else whenElement('ytd-masthead', attach);
    }

    // Quét và gắn cờ các kệ (shelves) & thẻ video Hội viên (Ưu tiên / Chỉ dành cho hội viên) & Khám phá chủ đề
    function scanAndTagFeedContent(scope) {
        const root = scope && scope.querySelectorAll ? scope : document;

        // 1. Quét các kệ (shelves)
        const sections = root.querySelectorAll('ytd-rich-section-renderer');
        sections.forEach((sec) => {
            if (!sec.classList.contains('ytc-shelf-members')) {
                const text = sec.textContent || '';
                if (
                    text.includes('lợi ích từ hội viên') ||
                    text.includes('Ưu tiên hội viên') ||
                    text.includes('ưu tiên hội viên') ||
                    (text.includes('hội viên') && text.includes('YouTube chọn lọc')) ||
                    text.includes('Get more from memberships') ||
                    text.includes('Members only') ||
                    text.includes('Members first') ||
                    sec.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], a[href*="/membership"], a[href*="/memberships"]')
                ) {
                    sec.classList.add('ytc-shelf-members');
                }
            }
            if (!sec.classList.contains('ytc-shelf-explore')) {
                const text = sec.textContent || '';
                if (
                    text.includes('Khám phá các chủ đề') ||
                    text.includes('Explore other topics') ||
                    text.includes('Explore topics') ||
                    sec.querySelector('yt-chip-cloud-chip-renderer, yt-chip-cloud-renderer, ytd-feed-filter-chip-bar-renderer')
                ) {
                    sec.classList.add('ytc-shelf-explore');
                }
            }
        });

        // 2. Quét từng thẻ video riêng lẻ (Ưu tiên hội viên & Chỉ dành cho hội viên)
        const videoCards = root.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer');
        videoCards.forEach((card) => {
            if (!card.classList.contains('ytc-item-members')) {
                const text = card.textContent || '';
                if (
                    text.includes('Ưu tiên hội viên') ||
                    text.includes('ưu tiên hội viên') ||
                    text.includes('Chỉ dành cho hội viên') ||
                    text.includes('chỉ dành cho hội viên') ||
                    text.includes('Members first') ||
                    text.includes('Members only') ||
                    text.includes('Members-only') ||
                    text.includes('Early access') ||
                    card.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], [aria-label*="hội viên"], [aria-label*="Hội viên"], [aria-label*="Members"]')
                ) {
                    card.classList.add('ytc-item-members');
                }
            }
        });
    }

    const scheduleFeedScan = rafThrottle((root) => {
        scanAndTagFeedContent(root);
    });

    function setupFeedShelvesObserver() {
        scheduleFeedScan(document);

        const attach = (container) => {
            scheduleFeedScan(container);
            new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        scheduleFeedScan(container);
                        break;
                    }
                }
            }).observe(container, { childList: true, subtree: true });
        };

        const target = document.getElementById('page-manager') || document.querySelector('ytd-page-manager') || document.body;
        if (target) attach(target);
        else whenElement('#page-manager', attach);
    }

    // Cuộn lên đầu trang khi bấm vào logo ở trang chủ/feed
    document.addEventListener('click', (e) => {
        if (!e.target.closest('ytd-topbar-logo-renderer')) return;
        if (isHomeFeedPath()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, true);

    // 4. TỰ ĐỘNG BẤM TIẾP TỤC XEM ("Vẫn đang xem?")
    document.addEventListener('animationstart', (e) => {
        if (e.animationName !== 'ytcConfirmInserted') return;
        const node = e.target;
        if (node.tagName?.toLowerCase() === 'yt-confirm-dialog-renderer') {
            setTimeout(() => {
                const confirmBtn = node.querySelector?.('#confirm-button button, yt-button-renderer#confirm-button, #confirm-button');
                if (!confirmBtn || confirmBtn.offsetParent === null) return;
                const text = confirmBtn.innerText || confirmBtn.textContent || '';
                if (text.includes('Có') || text.includes('Yes') || text.includes('CONTINUE')) {
                    confirmBtn.click();
                    const video = document.querySelector('#movie_player video');
                    if (video?.paused) video.play();
                }
            }, 100);
        }
    }, true);

    // 5. ĐIỀU KHIỂN VIDEO BẰNG BÀN PHÍM (A-S-D & NUMPAD)
    function getPlayerVideo(player) {
        return player.querySelector('video.html5-main-video') || player.querySelector('video');
    }

    let lastSeekAt = 0;
    const SEEK_COOLDOWN_MS = 80;

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
        if (typeof player.getPlayerState === 'function') {
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
        return player.classList.contains('ytp-fullscreen') || (typeof player.isFullscreen === 'function' && player.isFullscreen());
    }

    function canUseAsdKeys(player) {
        if (!player) return false;
        return isPlayerFullscreen(player) || player.matches(':hover');
    }

    let seekModeTimer = null;
    function triggerCleanSeek(player) {
        if (!player) return;
        player.classList.add('seeking-mode');
        clearTimeout(seekModeTimer);
        seekModeTimer = setTimeout(() => {
            player.classList.remove('seeking-mode');
        }, 600);
    }

    function changeVolume(player, delta) {
        if (!player) return;
        const key = delta > 0 ? 'ArrowUp' : 'ArrowDown';
        const keyCode = delta > 0 ? 38 : 40;
        const vBefore = typeof player.getVolume === 'function' ? player.getVolume() : null;

        // Kích hoạt phím tăng/giảm âm lượng chuẩn của YouTube kèm thanh hiển thị UI
        player.dispatchEvent(new KeyboardEvent('keydown', {
            key,
            code: key,
            keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true
        }));

        // Dự phòng trường hợp trình phát không nhận sự kiện phím
        const vAfter = typeof player.getVolume === 'function' ? player.getVolume() : null;
        if (vBefore !== null && vAfter !== null && vBefore === vAfter) {
            const next = Math.max(0, Math.min(100, Math.round(vBefore + delta)));
            player.setVolume?.(next);
            if (delta > 0 && player.isMuted?.()) player.unMute?.();
        }
    }

    let keysBound = false;
    function bindGlobalKeys() {
        if (keysBound) return;
        keysBound = true;

        document.addEventListener('keydown', (e) => {
            if (!currentConfig.keyboardControls) return;
            if (e.isComposing || e.keyCode === 229) return;

            const target = e.target;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                return;
            }

            const player = document.querySelector('#movie_player');
            if (!player) return;

            let captured = false;
            let isSeekAction = false;
            const code = e.code || '';
            const isNumpad = (e.location === 3) || code.startsWith('Numpad');
            const asdAllowed = canUseAsdKeys(player);

            // --- Điều khiển bằng Numpad (Bàn phím phụ) ---
            if (isNumpad) {
                captured = true; // Chặn toàn bộ phím numpad để YouTube không nhận diện số 0-9 nhảy % video

                if (e.key === '8' || e.key === 'ArrowUp' || code === 'Numpad8' || code === 'NumpadAdd' || e.key === '+') {
                    changeVolume(player, 5);
                } else if (e.key === '2' || e.key === 'ArrowDown' || code === 'Numpad2' || code === 'NumpadSubtract' || e.key === '-') {
                    changeVolume(player, -5);
                } else if (e.key === '4' || e.key === 'ArrowLeft' || code === 'Numpad4') {
                    seekBySeconds(player, -10);
                    isSeekAction = true;
                } else if (e.key === '6' || e.key === 'ArrowRight' || code === 'Numpad6') {
                    seekBySeconds(player, 10);
                    isSeekAction = true;
                } else if (e.key === '5' || e.key === 'Clear' || code === 'Numpad5' || e.keyCode === 12) {
                    togglePlayback(player);
                }
                // Các phím còn lại (0, 1, 3, 7, 9, Del, Enter,...) đã được captured = true chặn đứng,
                // không lo bấm nhầm bị nhảy giữa video hoặc nhảy % lung tung.
            }
            // --- Điều khiển bằng A / S / D ---
            else if (asdAllowed && code === 'KeyA') {
                captured = true;
                seekBySeconds(player, -10);
                isSeekAction = true;
            } else if (asdAllowed && code === 'KeyS') {
                captured = true;
                togglePlayback(player);
            } else if (asdAllowed && code === 'KeyD') {
                captured = true;
                seekBySeconds(player, 10);
                isSeekAction = true;
            }
            // Chặn phím F khi video đang tải để không gây kẹt phóng to
            else if (!e.ctrlKey && !e.altKey && !e.metaKey && (code === 'KeyF' || e.key === 'f' || e.key === 'F')) {
                if (isWatchLoading) {
                    captured = true;
                }
            }

            if (captured) {
                e.preventDefault();
                e.stopImmediatePropagation();
            } else if (['ArrowLeft', 'ArrowRight', 'j', 'l', 'J', 'L'].includes(e.key)) {
                isSeekAction = true;
            }

            if (isSeekAction) {
                triggerCleanSeek(player);
            }
        }, true);
    }

    // 5.2. KHÓA PHÍM & NÚT PHÓNG TO KHI VIDEO ĐANG TẢI (CHỐNG LỖI KẸT GIAO DIỆN)
    // Chặn người dùng bấm phóng to trong lúc video / trang đang load (1.5s đầu)
    // để tránh xung đột race condition làm kẹt giao diện inline trong fullscreen.
    let isWatchLoading = false;
    let watchLoadTimeout = null;

    function setWatchLoading(loading, duration = 1500) {
        if (!location.pathname.startsWith('/watch')) {
            isWatchLoading = false;
            document.documentElement.classList.remove('ytc-fs-locked');
            clearTimeout(watchLoadTimeout);
            return;
        }

        isWatchLoading = loading;
        document.documentElement.classList.toggle('ytc-fs-locked', loading);
        clearTimeout(watchLoadTimeout);

        if (loading) {
            watchLoadTimeout = setTimeout(() => {
                isWatchLoading = false;
                document.documentElement.classList.remove('ytc-fs-locked');
            }, duration);
        }
    }

    let fsLockBound = false;
    function setupFullscreenLock() {
        if (fsLockBound) return;
        fsLockBound = true;

        // Chặn click vào nút phóng to khi đang load
        document.addEventListener('click', (e) => {
            if (isWatchLoading && e.target.closest('.ytp-fullscreen-button')) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }, true);

        // Chặn nhấp đúp (double-click) vào player khi đang load
        document.addEventListener('dblclick', (e) => {
            if (isWatchLoading && e.target.closest('#movie_player')) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }, true);

        // Thoát Fullscreen ngay nếu bị lọt vào khi trang chưa sẵn sàng
        document.addEventListener('fullscreenchange', () => {
            if (isWatchLoading && document.fullscreenElement) {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            }
        });
    }

    // 6. GIAO DIỆN BẢNG CÀI ĐẶT (SETTINGS MENU CHUẨN YOUTUBE)
    const GEAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>`;
    const GRID_SVG = `<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z"/></svg>`;
    const SHORTS_SVG = `<svg viewBox="0 0 24 24"><path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.5v-5l4.5 2.5-4.5 2.5z"/></svg>`;
    const GAMEPAD_SVG = `<svg viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S20.17 9 21 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`;
    const YOUTUBE_SVG = `<svg viewBox="0 0 24 24"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/></svg>`;
    const SEARCH_SVG = `<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;
    const SPARKLE_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2z"/></svg>`;
    const KEYBOARD_SVG = `<svg viewBox="0 0 24 24"><path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>`;
    const CROWN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`;
    const COMPASS_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;

    function ensureSettingsElements() {
        if (document.getElementById('ytc-settings-btn')) return;

        // Vị trí đặt nút: thanh topbar masthead #end (cạnh nút "+ Tạo")
        const endContainer = document.querySelector('ytd-masthead #end, #masthead #end, #end.ytd-masthead');
        if (!endContainer) return;

        const buttonsContainer = endContainer.querySelector('#buttons') || endContainer;

        const btn = document.createElement('button');
        btn.id = 'ytc-settings-btn';
        btn.title = 'YouTube Customizer';
        btn.innerHTML = safeHTML(GEAR_SVG);

        // Tìm nút Tạo (+ Tạo / Upload) hoặc nút đầu tiên trong #buttons để chèn vào trước
        const createBtn = buttonsContainer.querySelector('ytd-button-renderer:has(a[href*="/upload"]), ytd-button-renderer, yt-button-view-model') 
                       || buttonsContainer.firstElementChild;

        if (createBtn && createBtn.parentElement === buttonsContainer) {
            buttonsContainer.insertBefore(btn, createBtn);
        } else {
            buttonsContainer.prepend(btn);
        }

        // Tạo bảng menu cài đặt
        let panel = document.getElementById('ytc-settings-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'ytc-settings-panel';
            panel.innerHTML = safeHTML(`
                <div class="ytc-header">
                    <span>YouTube Customizer</span>
                    <span class="ytc-header-badge">v2.5</span>
                </div>

                <!-- Số cột trang chủ -->
                <div class="ytc-item" id="ytc-row-cols">
                    <div class="ytc-item-left">
                        ${GRID_SVG}
                        <span>Số cột trang chủ</span>
                    </div>
                    <div class="ytc-cols-group">
                        <button class="ytc-col-btn ${currentConfig.columns === 3 ? 'active' : ''}" data-cols="3">3</button>
                        <button class="ytc-col-btn ${currentConfig.columns === 4 ? 'active' : ''}" data-cols="4">4</button>
                        <button class="ytc-col-btn ${currentConfig.columns === 5 ? 'active' : ''}" data-cols="5">5</button>
                    </div>
                </div>

                <div class="ytc-divider"></div>

                <!-- Ẩn Shorts -->
                <div class="ytc-item" data-toggle="hideShorts">
                    <div class="ytc-item-left">
                        ${SHORTS_SVG}
                        <span>Ẩn mục Shorts</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-shorts" ${currentConfig.hideShorts ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Ẩn Chơi game (Playables) -->
                <div class="ytc-item" data-toggle="hidePlayables">
                    <div class="ytc-item-left">
                        ${GAMEPAD_SVG}
                        <span>Ẩn mục Chơi game</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-playables" ${currentConfig.hidePlayables ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Ẩn mục video Hội viên -->
                <div class="ytc-item" data-toggle="hideMembersOnly">
                    <div class="ytc-item-left">
                        ${CROWN_SVG}
                        <span>Ẩn video Hội viên</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-members" ${currentConfig.hideMembersOnly ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Ẩn Khám phá các chủ đề khác -->
                <div class="ytc-item" data-toggle="hideExploreTopics">
                    <div class="ytc-item-left">
                        ${COMPASS_SVG}
                        <span>Ẩn Khám phá chủ đề</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-explore" ${currentConfig.hideExploreTopics ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Logo Premium -->
                <div class="ytc-item" data-toggle="premiumLogo">
                    <div class="ytc-item-left">
                        ${YOUTUBE_SVG}
                        <span>Logo Premium</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-logo" ${currentConfig.premiumLogo ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Lọc tìm kiếm sạch (Clean Search) -->
                <div class="ytc-item" data-toggle="cleanSearch">
                    <div class="ytc-item-left">
                        ${SEARCH_SVG}
                        <span>Lọc tìm kiếm sạch</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-search" ${currentConfig.cleanSearch ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Tắt hiệu ứng ánh sáng (Disable Ambient) -->
                <div class="ytc-item" data-toggle="disableAmbient">
                    <div class="ytc-item-left">
                        ${SPARKLE_SVG}
                        <span>Tắt ánh sáng video</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-ambient" ${currentConfig.disableAmbient ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-divider"></div>

                <!-- Phím tắt A-S-D / Numpad -->
                <div class="ytc-item" data-toggle="keyboardControls">
                    <div class="ytc-item-left">
                        ${KEYBOARD_SVG}
                        <span>Phím tắt (A-S-D, Numpad)</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-keys" ${currentConfig.keyboardControls ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            `);
            (document.body || document.documentElement).appendChild(panel);

            // Sự kiện chọn số cột
            panel.querySelectorAll('.ytc-col-btn').forEach((colBtn) => {
                colBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const cols = parseInt(colBtn.getAttribute('data-cols'), 10) || 4;
                    currentConfig.columns = cols;
                    saveConfig(currentConfig);

                    panel.querySelectorAll('.ytc-col-btn').forEach(b => b.classList.remove('active'));
                    colBtn.classList.add('active');

                    applyConfigToRoot();
                });
            });

            // Sự kiện bật/tắt Toggle Switch
            panel.querySelectorAll('.ytc-item[data-toggle]').forEach((item) => {
                const key = item.getAttribute('data-toggle');
                const checkbox = item.querySelector('input[type="checkbox"]');
                if (!checkbox) return;

                // Lắng nghe sự kiện change khi click trực tiếp vào nút switch (hoặc gián tiếp)
                checkbox.addEventListener('change', () => {
                    currentConfig[key] = checkbox.checked;
                    saveConfig(currentConfig);
                    applyConfigToRoot();
                });

                // Khi click vào vùng chữ hoặc icon bên ngoài nút switch
                item.addEventListener('click', (e) => {
                    if (!e.target.closest('.ytc-switch')) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
            });
        }

        function updatePanelPosition() {
            const rect = btn.getBoundingClientRect();
            panel.style.top = (rect.bottom + 8) + 'px';
            panel.style.right = Math.max(12, window.innerWidth - rect.right - 10) + 'px';
        }

        btn.addEventListener('mouseenter', updatePanelPosition, { passive: true });
        window.addEventListener('resize', () => {
            if (panel.classList.contains('open')) updatePanelPosition();
        }, { passive: true });

        // Bật / tắt mở bảng cài đặt (mở tức thì 0ms, không gây forced layout reflow khi click)
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!panel.style.top) updatePanelPosition();
            panel.classList.toggle('open');
        });

        bindMenuDismiss(panel);
    }

    let menuDismissBound = false;
    function bindMenuDismiss(panel) {
        if (menuDismissBound) return;
        menuDismissBound = true;

        // Bấm ra ngoài để đóng menu
        document.addEventListener('click', (e) => {
            if (panel && panel.classList.contains('open')) {
                if (!e.target.closest('#ytc-settings-panel') && !e.target.closest('#ytc-settings-btn')) {
                    panel.classList.remove('open');
                }
            }
        });

        // Bấm Esc để đóng menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel && panel.classList.contains('open')) {
                panel.classList.remove('open');
            }
        });
    }

    function setupSettingsObserver() {
        ensureSettingsElements();

        const attach = (masthead) => {
            ensureSettingsElements();
            new MutationObserver(() => {
                if (!document.getElementById('ytc-settings-btn')) {
                    ensureSettingsElements();
                }
            }).observe(masthead, { childList: true, subtree: true });
        };

        const masthead = document.querySelector('ytd-masthead');
        if (masthead) attach(masthead);
        else whenElement('ytd-masthead', attach);

        // Dự phòng khi YouTube thay thế DOM sau khi nạp xong thông tin tài khoản
        let retryCount = 0;
        const retryInterval = setInterval(() => {
            retryCount++;
            ensureSettingsElements();
            if (retryCount >= 6 && document.getElementById('ytc-settings-btn')) {
                clearInterval(retryInterval);
            }
        }, 500);
    }

    // 7. KHỞI CHẠY VÀ XỬ LÝ SPA (Single Page Application)
    function onNavigate() {
        applyConfigToRoot();
        scheduleLogoScan(document);
        ensureSettingsElements();
        bindGlobalKeys();
        setupFullscreenLock();
        if (location.pathname.startsWith('/watch')) {
            setWatchLoading(true);
        } else if (isHomeFeedPath()) {
            applyHomeGridColumns();
            scheduleFeedScan(document);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onNavigate, { once: true });
    } else {
        onNavigate();
    }

    document.addEventListener('yt-navigate-start', () => {
        if (location.pathname.startsWith('/watch')) {
            setWatchLoading(true);
        }
    });

    document.addEventListener('yt-navigate-finish', onNavigate);
    window.addEventListener('resize', applyHomeGridColumns);

    // Kích hoạt các observer bền bỉ theo dõi masthead & feed
    setupLogoObserver();
    setupSettingsObserver();
    setupFeedShelvesObserver();
    setupFullscreenLock();
    if (location.pathname.startsWith('/watch')) {
        setWatchLoading(true);
    }
    if (isHomeFeedPath()) {
        whenElement('ytd-rich-grid-renderer', applyHomeGridColumns);
    }

})();
