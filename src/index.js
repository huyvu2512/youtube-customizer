// ==========================================================================
// YOUTUBE CUSTOMIZER - KHỞI TẠO, CẤU HÌNH & ĐIỀU PHỐI VÒNG ĐỜI (ENTRYPOINT)
// ==========================================================================
import styles from './styles.css';
import {
    CONFIG_KEY,
    DEFAULT_CONFIG,
    loadConfig,
    saveConfig,
    currentConfig,
    applyConfigToRoot,
    onConfigChange
} from './core/config.js';
import { whenElement } from './core/utils.js';
import {
    applyHomeGridColumns,
    scheduleLogoScan,
    setupLogoObserver,
    scheduleFeedScan,
    setupFeedShelvesObserver,
    dismissPromoBanners,
    isHomeFeedPath,
    initMixFilter
} from './features/index.js';
import {
    bindGlobalKeys,
    setWatchLoading,
    setupFullscreenLock,
    initAutoLiveSync,
    resetAutoLiveState,
    checkInitialLiveSnap,
    initLiveDvrHook,
    initAdShield
} from './player/index.js';
import {
    initChatOverlay,
    updateChatOverlayVisibility,
    initIframeChatSender,
    resetChatCollapseState,
    autoCollapseNativeChatIfOpen,
    setupAutoCloseObserver
} from './chat/index.js';
import {
    ensureSettingsElements,
    setupSettingsObserver,
    syncPanelState
} from './ui/index.js';
import {
    initCodecBlocker,
    initOptimization,
    applyAudioOnlyState
} from './optimization/index.js';

// Re-export for compatibility
export { CONFIG_KEY, DEFAULT_CONFIG, loadConfig, saveConfig, currentConfig, applyConfigToRoot };

// Khởi chạy hook Codec Blocker, Live DVR và lá chắn AdShield ngay từ đầu trong top window
if (window.self === window.top) {
    initCodecBlocker();
    initLiveDvrHook();
    initAdShield();
}

// --------------------------------------------------------------------------
// NẠP STYLESHEET
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

// --------------------------------------------------------------------------
// ĐIỀU PHỐI VÒNG ĐỜI ỨNG DỤNG (TOP WINDOW VS IFRAME)
// --------------------------------------------------------------------------
if (window.self !== window.top) {
    if (location.pathname.includes('live_chat')) {
        initIframeChatSender();
    }
} else {
    injectStyles(styles);

    // Đăng ký đồng bộ layout & overlay mỗi khi config thay đổi
    onConfigChange(() => {
        applyHomeGridColumns();
        updateChatOverlayVisibility();
        applyAudioOnlyState();
    });

    applyConfigToRoot();
    bindGlobalKeys();

    function onNavigate() {
        // Chuyển video khác hoặc về trang chủ: BẮT BUỘC TẮT LUÔN Live Chat
        currentConfig.chatOverlay = 'off';
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
            setTimeout(autoCollapseNativeChatIfOpen, 4000);
        }
        initAutoLiveSync();
        resetAutoLiveState();
        checkInitialLiveSnap();

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
        currentConfig.chatOverlay = 'off';
        resetChatCollapseState();
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
    initMixFilter();

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
