// YOUTUBE CUSTOMIZER - ENTRYPOINT
import { applyConfigToRoot } from './config/index.js';
import { injectStyles, whenElement, isHomeFeedPath } from './core/dom.js';
import { allStyles } from './styles/index.js';
import { applyHomeGridColumns } from './features/grid_columns/index.js';
import { scheduleFeedScan, setupFeedShelvesObserver } from './core/observer.js';
import { scheduleLogoScan, setupLogoObserver } from './features/premium_logo/index.js';
import { dismissPromoBanners } from './features/promos/index.js';
import { bindGlobalKeys } from './features/player_controls/keyboard.js';
import { isWatchLoading, setWatchLoading, setupFullscreenLock } from './features/player_controls/fullscreen.js';
import { ensureSettingsElements, setupSettingsObserver } from './ui/settings_button.js';

// Nạp CSS và áp dụng cấu hình ban đầu
injectStyles(allStyles);
applyConfigToRoot();

// Điều phối vòng đời SPA (Single Page Application)
function onNavigate() {
    applyConfigToRoot();
    scheduleLogoScan(document);
    ensureSettingsElements();
    bindGlobalKeys();
    setupFullscreenLock();
    dismissPromoBanners(document);

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

    let gridRetryCount = 0;
    const gridRetryInterval = setInterval(() => {
        gridRetryCount++;
        applyHomeGridColumns();
        if (gridRetryCount >= 10 && document.querySelector('ytd-rich-grid-renderer ytd-rich-item-renderer')) {
            clearInterval(gridRetryInterval);
        }
    }, 250);
}
