// ==========================================================================
// YOUTUBE CUSTOMIZER - KHỞI TẠO, CẤU HÌNH & ĐIỀU PHỐI VÒNG ĐỜI (ENTRYPOINT)
// ==========================================================================
import styles from './styles.css';
import {
    applyHomeGridColumns,
    scheduleLogoScan,
    setupLogoObserver,
    scheduleFeedScan,
    setupFeedShelvesObserver,
    dismissPromoBanners,
    bindGlobalKeys,
    setWatchLoading,
    setupFullscreenLock,
    isHomeFeedPath,
    whenElement,
    initLiveDvrHook,
    initChatOverlay,
    updateChatOverlayVisibility,
    initIframeChatSender,
    initAutoLiveSync
} from './features.js';
import { ensureSettingsElements, setupSettingsObserver } from './ui.js';

// Khởi chạy hook can thiệp Live Stream DVR càng sớm càng tốt (chỉ trong top window)
if (window.self === window.top) {
    initLiveDvrHook();
}

// --------------------------------------------------------------------------
// 1. CẤU HÌNH & LƯU TRỮ (LOCALSTORAGE)
// --------------------------------------------------------------------------
export const CONFIG_KEY = 'ytc_config_v2';

export const DEFAULT_CONFIG = {
    columns: 4,             // 3, 4 hoặc 5 cột (mặc định 4)
    hideShorts: true,       // Ẩn Shorts hoàn toàn
    hidePlayables: true,    // Ẩn Chơi game (Playables)
    hideMembersOnly: true,  // Ẩn mục video Hội viên
    hideExploreTopics: true,// Ẩn Khám phá các chủ đề khác
    hideCommunity: true,    // Ẩn bài đăng cộng đồng
    hideEndscreen: true,    // Ẩn thẻ kết thúc & chú thích
    hideWatermark: true,    // Ẩn logo hình mờ kênh ở góc video
    unlockLiveDvr: true,    // Mở khóa tua lại Live Stream
    chatOverlay: 'off',     // 'off', 'danmaku', 'streamer'
    chatOverlayHideOnRewind: true, // Tự động ẩn khi tua về quá khứ
    autoDismissPromos: true,// Tự động đóng banner khuyến mại & thông báo gián đoạn
    autoLiveSync: true,     // Tự động giữ mốc trực tiếp khi xem Live Stream
    premiumLogo: true,      // Logo YouTube Premium
    cleanSearch: true,      // Ẩn video tài trợ / quảng cáo tìm kiếm
    disableAmbient: true,   // Tắt Ambient Mode (Cinematics)
    keyboardControls: true, // Phím tắt A-S-D & Numpad
};

export function loadConfig() {
    try {
        const stored = localStorage.getItem(CONFIG_KEY);
        return stored ? Object.assign({}, DEFAULT_CONFIG, JSON.parse(stored)) : Object.assign({}, DEFAULT_CONFIG);
    } catch (e) {
        return Object.assign({}, DEFAULT_CONFIG);
    }
}

export function saveConfig(cfg) {
    try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    } catch (e) {}
}

export const currentConfig = loadConfig();

export function applyConfigToRoot() {
    const root = document.documentElement;
    if (!root) return;

    root.classList.toggle('ytc-hide-shorts', !!currentConfig.hideShorts);
    root.classList.toggle('ytc-hide-playables', !!currentConfig.hidePlayables);
    root.classList.toggle('ytc-hide-members', !!currentConfig.hideMembersOnly);
    root.classList.toggle('ytc-hide-explore', !!currentConfig.hideExploreTopics);
    root.classList.toggle('ytc-hide-community', !!currentConfig.hideCommunity);
    root.classList.toggle('ytc-hide-endscreen', !!currentConfig.hideEndscreen);
    root.classList.toggle('ytc-hide-watermark', !!currentConfig.hideWatermark);
    root.classList.toggle('ytc-auto-dismiss', !!currentConfig.autoDismissPromos);
    root.classList.toggle('ytc-premium-logo', !!currentConfig.premiumLogo);
    root.classList.toggle('ytc-clean-search', !!currentConfig.cleanSearch);
    root.classList.toggle('ytc-disable-ambient', !!currentConfig.disableAmbient);
    root.setAttribute('data-ytc-cols', String(currentConfig.columns || 4));
    root.setAttribute('data-ytc-chat', currentConfig.chatOverlay || 'off');

    if (document.body) {
        document.body.classList.toggle('ytc-hide-shorts', !!currentConfig.hideShorts);
        document.body.classList.toggle('ytc-hide-playables', !!currentConfig.hidePlayables);
        document.body.classList.toggle('ytc-hide-members', !!currentConfig.hideMembersOnly);
        document.body.classList.toggle('ytc-hide-explore', !!currentConfig.hideExploreTopics);
        document.body.classList.toggle('ytc-hide-community', !!currentConfig.hideCommunity);
        document.body.classList.toggle('ytc-hide-endscreen', !!currentConfig.hideEndscreen);
        document.body.classList.toggle('ytc-hide-watermark', !!currentConfig.hideWatermark);
        document.body.classList.toggle('ytc-auto-dismiss', !!currentConfig.autoDismissPromos);
        document.body.classList.toggle('ytc-premium-logo', !!currentConfig.premiumLogo);
        document.body.classList.toggle('ytc-clean-search', !!currentConfig.cleanSearch);
        document.body.classList.toggle('ytc-disable-ambient', !!currentConfig.disableAmbient);
        document.body.setAttribute('data-ytc-cols', String(currentConfig.columns || 4));
        document.body.setAttribute('data-ytc-chat', currentConfig.chatOverlay || 'off');
    }

    applyHomeGridColumns();
    updateChatOverlayVisibility();
}

// --------------------------------------------------------------------------
// 2. NẠP STYLESHEET
// --------------------------------------------------------------------------
function injectStyles(css) {
    const style = document.createElement('style');
    style.id = 'yt-customizer-styles';
    style.textContent = css;

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

if (window.self !== window.top) {
    if (location.pathname.includes('live_chat')) {
        initIframeChatSender();
    }
} else {
    injectStyles(styles);
    applyConfigToRoot();
    bindGlobalKeys();

    // --------------------------------------------------------------------------
    // 3. ĐIỀU PHỐI VÒNG ĐỜI SPA
    // --------------------------------------------------------------------------
    function onNavigate() {
        applyConfigToRoot();
        scheduleLogoScan(document);
        ensureSettingsElements();
        bindGlobalKeys();
        setupFullscreenLock();
        dismissPromoBanners(document);
        initChatOverlay();
        initAutoLiveSync();

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

    // Kích hoạt các observer bền bỉ
    setupLogoObserver();
    setupSettingsObserver();
    setupFeedShelvesObserver();
    setupFullscreenLock();
    initChatOverlay();
    initAutoLiveSync();

    if (location.pathname.startsWith('/watch')) {
        setWatchLoading(true);
    }

    if (isHomeFeedPath()) {
        whenElement('ytd-rich-grid-renderer', applyHomeGridColumns);

        let gridRetryCount = 0;
        const gridRetryInterval = setInterval(() => {
            gridRetryCount++;
            applyHomeGridColumns();
            if (gridRetryCount >= 10 && document.querySelector('ytd-rich-grid-renderer ytd-rich-item-renderer')) {
                clearInterval(gridRetryInterval);
            }
        }, 250);
    }
}
