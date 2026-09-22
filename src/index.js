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
import { ensureSettingsElements, setupSettingsObserver, syncPanelState } from './ui.js';

// Khởi chạy hook can thiệp Live Stream DVR càng sớm càng tốt (chỉ trong top window)
if (window.self === window.top) {
    initLiveDvrHook();
}

// --------------------------------------------------------------------------
// 1. CẤU HÌNH & LƯU TRỮ (LOCALSTORAGE)
// --------------------------------------------------------------------------
export const CONFIG_KEY = 'ytc_config';

export const DEFAULT_CONFIG = {
    columns: 3,             // 3, 4 hoặc 5 cột (mặc định 3 theo chuẩn YouTube)
    hideShorts: false,      // Ẩn Shorts hoàn toàn (mặc định tắt)
    hidePlayables: false,   // Ẩn Chơi game (Playables) (mặc định tắt)
    hideMembersOnly: false, // Ẩn mục video Hội viên (mặc định tắt)
    hideExploreTopics: false,// Ẩn Khám phá các chủ đề khác (mặc định tắt)
    hideCommunity: false,   // Ẩn bài đăng cộng đồng (mặc định tắt)
    hideEndscreen: false,   // Ẩn thẻ kết thúc & chú thích (mặc định tắt)
    hideWatermark: false,   // Ẩn logo hình mờ kênh ở góc video (mặc định tắt)
    unlockLiveDvr: false,   // Mở khóa tua lại Live Stream (mặc định tắt)
    chatOverlay: 'off',     // 'off', 'danmaku', 'streamer' (luôn mặc định tắt)
    chatOverlayHideOnRewind: false, // Tự động ẩn khi tua về quá khứ (mặc định tắt)
    autoDismissPromos: false,// Tự động đóng banner khuyến mại & thông báo gián đoạn (mặc định tắt)
    autoLiveSync: false,    // Tự động giữ mốc trực tiếp khi xem Live Stream (mặc định tắt)
    premiumLogo: false,     // Logo YouTube Premium (mặc định tắt)
    cleanSearch: false,     // Ẩn video tài trợ / quảng cáo tìm kiếm (mặc định tắt)
    disableAmbient: false,  // Tắt Ambient Mode (Cinematics) (mặc định tắt)
    keyboardControls: false,// Phím tắt A-S-D & Numpad (mặc định tắt)
};

export function loadConfig() {
    try {
        const safeParse = (str) => {
            if (!str) return null;
            try { return JSON.parse(str); } catch (e) { return null; }
        };

        const rawMain = localStorage.getItem('ytc_config');
        const raw3 = localStorage.getItem('ytc_config_v3');
        const rawPersistent = localStorage.getItem('ytc_config_persistent');
        const rawBackup = sessionStorage.getItem('ytc_config_backup');
        const raw2 = localStorage.getItem('ytc_config_v2');

        const candidates = [
            safeParse(rawMain),
            safeParse(raw3),
            safeParse(rawPersistent),
            safeParse(rawBackup),
            safeParse(raw2)
        ].filter(Boolean);

        let merged = Object.assign({}, DEFAULT_CONFIG);

        // Kiểm tra xem có bản ghi nào có timestamp _lastUpdated hay không
        const timedCandidates = candidates.filter(c => typeof c._lastUpdated === 'number');
        if (timedCandidates.length > 0) {
            // Bản lưu mới nhất theo thời gian thực thi của người dùng
            timedCandidates.sort((a, b) => b._lastUpdated - a._lastUpdated);
            merged = Object.assign({}, DEFAULT_CONFIG, timedCandidates[0]);
        } else if (candidates.length > 0) {
            // Trường hợp cập nhật từ các bản cũ (chưa có timestamp):
            // Bảo toàn tuyệt đối mọi cài đặt người dùng đã từng bật ở bất kỳ bản nào
            candidates.forEach(cand => {
                Object.keys(DEFAULT_CONFIG).forEach(k => {
                    if (typeof DEFAULT_CONFIG[k] === 'boolean' && cand[k] === true) {
                        merged[k] = true;
                    } else if (k === 'columns' && (cand[k] === 4 || cand[k] === 5)) {
                        merged[k] = cand[k];
                    }
                });
            });
        }

        // BẮT BUỘC: Live Chat luôn luôn mặc định TẮT sau mỗi video / F5!
        merged.chatOverlay = 'off';

        const json = JSON.stringify({ ...merged, _lastUpdated: Date.now() });
        try {
            localStorage.setItem('ytc_config', json);
            localStorage.setItem('ytc_config_v3', json);
            localStorage.setItem('ytc_config_persistent', json);
            sessionStorage.setItem('ytc_config_backup', json);
        } catch (e) {}

        return merged;
    } catch (e) {
        return Object.assign({}, DEFAULT_CONFIG);
    }
}

export function saveConfig(cfg) {
    try {
        const toSave = { ...cfg, chatOverlay: 'off', _lastUpdated: Date.now() };
        const json = JSON.stringify(toSave);
        localStorage.setItem('ytc_config', json);
        localStorage.setItem('ytc_config_v3', json);
        localStorage.setItem('ytc_config_persistent', json);
        sessionStorage.setItem('ytc_config_backup', json);
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
    root.setAttribute('data-ytc-cols', String(currentConfig.columns || 3));
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
        document.body.setAttribute('data-ytc-cols', String(currentConfig.columns || 3));
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
        // Chuyển video khác hoặc về trang chủ: BẮT BUỘC TẮT LUÔN Live Chat!
        currentConfig.chatOverlay = 'off';
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
        // Chuyển video khác / rời video: Tắt Live Chat ngay lập tức
        currentConfig.chatOverlay = 'off';
        updateChatOverlayVisibility();
        syncPanelState();
        if (location.pathname.startsWith('/watch')) {
            setWatchLoading(true);
        }
    });

    window.addEventListener('popstate', () => {
        if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) {
            currentConfig.chatOverlay = 'off';
            updateChatOverlayVisibility();
            syncPanelState();
        }
    });

    document.addEventListener('yt-page-data-updated', () => {
        if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) {
            currentConfig.chatOverlay = 'off';
            updateChatOverlayVisibility();
            syncPanelState();
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
