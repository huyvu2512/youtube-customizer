// ==========================================================================
// YOUTUBE CUSTOMIZER - TẬP HỢP TOÀN BỘ TÍNH NĂNG NÂNG CAO (FEATURES)
// ==========================================================================
import { currentConfig } from './index.js';

// --------------------------------------------------------------------------
// 1. TIỆN ÍCH DOM & TRUSTED TYPES
// --------------------------------------------------------------------------
const ytcPolicy = window.trustedTypes?.createPolicy?.('youtubeCustomizerPolicy', {
    createHTML: (html) => html,
}) || window.trustedTypes?.defaultPolicy;

export function safeHTML(html) {
    return ytcPolicy ? ytcPolicy.createHTML(html) : html;
}

export function rafThrottle(fn) {
    let scheduled = 0;
    return function(...args) {
        if (scheduled) return;
        scheduled = requestAnimationFrame(() => {
            scheduled = 0;
            fn.apply(this, args);
        });
    };
}

export function whenElement(selector, callback, timeout = 5000) {
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

export function isHomeFeedPath() {
    const p = location.pathname;
    return p === '/' || p.startsWith('/feed') || p.startsWith('/@') || p.startsWith('/channel');
}

// --------------------------------------------------------------------------
// 2. LƯỚI CỘT TÙY BIẾN (3, 4, 5 CỘT)
// --------------------------------------------------------------------------
export function applyHomeGridColumns() {
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

// --------------------------------------------------------------------------
// 3. LOGO YOUTUBE PREMIUM & MÃ QUỐC GIA CHUẨN XÁC
// --------------------------------------------------------------------------
const LOGO_MARK = 'M32.1819';
const logoSVG = '<g><path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"/><path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"/></g><g id="youtube-paths_yt19"><path d="M32.1819 2.10016V18.9002H34.7619V12.9102H35.4519C38.8019 12.9102 40.5619 11.1102 40.5619 7.57016V6.88016C40.5619 3.31016 39.0019 2.10016 35.7219 2.10016H32.1819ZM37.8619 7.63016C37.8619 10.0002 37.1419 11.0802 35.4019 11.0802H34.7619V3.95016H35.4519C37.4219 3.95016 37.8619 4.76016 37.8619 7.13016V7.63016Z"/><path d="M41.982 18.9002H44.532V10.0902C44.952 9.37016 45.992 9.05016 47.302 9.32016L47.462 6.33016C47.292 6.31016 47.142 6.29016 47.002 6.29016C45.802 6.29016 44.832 7.20016 44.342 8.86016H44.162L43.952 6.54016H41.982V18.9002H41.982V18.9002Z"/><path d="M55.7461 11.5002C55.7461 8.52016 55.4461 6.31016 52.0161 6.31016C48.7861 6.31016 48.0661 8.46016 48.0661 11.6202V13.7902C48.0661 16.8702 48.7261 19.1102 51.9361 19.1102C54.4761 19.1102 55.7861 17.8402 55.6361 15.3802L53.3861 15.2602C53.3561 16.7802 53.0061 17.4002 51.9961 17.4002C50.7261 17.4002 50.6661 16.1902 50.6661 14.3902V13.5502H55.7461V11.5002ZM51.9561 7.97016C53.1761 7.97016 53.2661 9.12016 53.2661 11.0702V12.0802H50.6661V11.0702C50.6661 9.14016 50.7461 7.97016 51.9561 7.97016Z"/><path d="M60.1945 18.9002V8.92016C60.5745 8.39016 61.1945 8.07016 61.7945 8.07016C62.5645 8.07016 62.8445 8.61016 62.8445 9.69016V18.9002H65.5045L65.4845 8.93016C65.8545 8.37016 66.4845 8.04016 67.1045 8.04016C67.7745 8.04016 68.1445 8.61016 68.1445 9.69016V18.9002H70.8045V9.49016C70.8045 7.28016 70.0145 6.27016 68.3445 6.27016C67.1845 6.27016 66.1945 6.69016 65.2845 7.67016C64.9045 6.76016 64.1545 6.27016 63.0845 6.27016C61.8745 6.27016 60.7345 6.79016 59.9345 7.76016H59.7845L59.5945 6.54016H57.5445V18.9002H60.1945Z"/><path d="M74.0858 4.97016C74.9858 4.97016 75.4058 4.67016 75.4058 3.43016C75.4058 2.27016 74.9558 1.91016 74.0858 1.91016C73.2058 1.91016 72.7758 2.23016 72.7758 3.43016C72.7758 4.67016 73.1858 4.97016 74.0858 4.97016ZM72.8658 18.9002H75.3958V6.54016H72.8658V18.9002Z"/><path d="M79.9516 19.0902C81.4116 19.0902 82.3216 18.4802 83.0716 17.3802H83.1816L83.2916 18.9002H85.2816V6.54016H82.6416V16.4702C82.3616 16.9602 81.7116 17.3202 81.1016 17.3202C80.3316 17.3202 80.0916 16.7102 80.0916 15.6902V6.54016H77.4616V15.8102C77.4616 17.8202 78.0416 19.0902 79.9516 19.0902Z"/><path d="M90.0031 18.9002V8.92016C90.3831 8.39016 91.0031 8.07016 91.6031 8.07016C92.3731 8.07016 92.6531 8.61016 92.6531 9.69016V18.9002H95.3131L95.2931 8.93016C95.6631 8.37016 96.2931 8.04016 96.9131 8.04016C97.5831 8.04016 97.9531 8.61016 97.9531 9.69016V18.9002H100.613V9.49016C100.613 7.28016 99.8231 6.27016 98.1531 6.27016C96.9931 6.27016 96.0031 6.69016 95.0931 7.67016C94.7131 6.76016 93.9631 6.27016 92.8931 6.27016C91.6831 6.27016 90.5431 6.79016 89.7431 7.76016H89.5931L89.4031 6.54016H87.3531V18.9002H90.0031Z"/></g>';

function buildLogoHtml() {
    return safeHTML(`<svg viewBox="0 0 101 20" width="101" height="20" preserveAspectRatio="xMinYMid meet">${logoSVG}</svg>`);
}

function ensurePremiumLogo(logo) {
    if (!logo) return;
    if (logo.closest('ytd-yoodle-renderer') || logo.classList.contains('ytd-yoodle-renderer')) {
        const span = logo.querySelector('.custom-premium-logo');
        if (span) span.remove();
        return;
    }
    if (!logo.closest('ytd-topbar-logo-renderer')) return;
    if (logo.hasAttribute('hidden')) logo.removeAttribute('hidden');

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

export const scheduleLogoScan = rafThrottle((root) => {
    const doc = (root && root.ownerDocument) || document;
    const renderers = doc.querySelectorAll('ytd-topbar-logo-renderer');
    renderers.forEach((renderer) => {
        const logos = Array.from(renderer.querySelectorAll('ytd-logo')).filter(
            l => !l.closest('ytd-yoodle-renderer') && !l.classList.contains('ytd-yoodle-renderer')
        );
        if (logos.length > 0) {
            ensurePremiumLogo(logos[0]);
            for (let i = 1; i < logos.length; i++) {
                const extraSpan = logos[i].querySelector('.custom-premium-logo');
                if (extraSpan) extraSpan.remove();
            }
        }
    });
});

export function setupLogoObserver() {
    scheduleLogoScan(document);

    const attach = (masthead) => {
        scheduleLogoScan(masthead);
        new MutationObserver((mutations) => {
            let shouldScan = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (node.matches?.('ytd-logo, ytd-topbar-logo-renderer') || node.querySelector?.('ytd-logo'))) {
                            shouldScan = true;
                        }
                    });
                } else if (mutation.type === 'attributes') {
                    if (mutation.target.matches?.('ytd-logo, ytd-topbar-logo-renderer, #logo')) {
                        shouldScan = true;
                    }
                }
                if (shouldScan) break;
            }
            if (shouldScan) scheduleLogoScan(masthead);
        }).observe(masthead, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    };

    const masthead = document.querySelector('ytd-masthead');
    if (masthead) attach(masthead);
    else whenElement('ytd-masthead', attach);

    let retryCount = 0;
    const retryInterval = setInterval(() => {
        retryCount++;
        scheduleLogoScan(document);
        if (retryCount >= 10 && document.querySelector('ytd-topbar-logo-renderer .custom-premium-logo')) {
            clearInterval(retryInterval);
        }
    }, 300);
}

// Cuộn lên đầu trang khi bấm vào logo ở trang chủ/feed
document.addEventListener('click', (e) => {
    if (!e.target.closest('ytd-topbar-logo-renderer')) return;
    if (isHomeFeedPath()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}, true);

// --------------------------------------------------------------------------
// 4. BỘ LỌC NỘI DUNG FEED (HỘI VIÊN, KHÁM PHÁ, CỘNG ĐỒNG, QUẢNG CÁO)
// --------------------------------------------------------------------------
export function scanAndTagFeedContent(scope) {
    const root = scope && scope.querySelectorAll ? scope : document;

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
        if (!sec.classList.contains('ytc-shelf-community')) {
            if (
                sec.querySelector('ytd-post-renderer, ytd-backstage-post-renderer, ytd-backstage-post-thread-renderer, ytd-post-multi-image-renderer, ytd-poll-renderer')
            ) {
                sec.classList.add('ytc-shelf-community');
            }
        }
    });

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
        if (!card.classList.contains('ytc-item-community')) {
            if (card.querySelector('ytd-post-renderer, ytd-backstage-post-renderer, ytd-post-multi-image-renderer, ytd-poll-renderer')) {
                card.classList.add('ytc-item-community');
            }
        }
    });
}

export function dismissPromoBanners(scope) {
    if (!currentConfig.autoDismissPromos) return;
    const root = scope && scope.querySelectorAll ? scope : document;

    // 1. Banner khuyến mãi, khảo sát & upsell
    const promos = root.querySelectorAll('ytd-mealbar-promo-renderer, yt-mealbar-promo-renderer, ytd-upsell-dialog-renderer, ytd-in-feed-survey-renderer, ytd-single-option-survey-renderer');
    promos.forEach((promo) => {
        const dismissBtn = promo.querySelector('#dismiss-button button, yt-button-renderer#dismiss-button button, yt-button-renderer#dismiss-button, #dismiss-button, button[aria-label*="Không"], button[aria-label*="Dismiss"], button[aria-label*="No thanks"]');
        if (dismissBtn) {
            try { dismissBtn.click(); } catch(e) {}
        }
    });

    // 2. Thông báo gián đoạn & popup phiền toái ("Bạn đang gặp sự cố gây gián đoạn?", "Experiencing interruptions?", toasts)
    const toasts = root.querySelectorAll('tp-yt-paper-toast, #toast, yt-notification-action-renderer, yt-bubble-hint-renderer');
    toasts.forEach((toast) => {
        const text = (toast.textContent || '').toLowerCase();
        if (
            text.includes('gián đoạn') || 
            text.includes('interruption') || 
            text.includes('sự cố') || 
            text.includes('troubleshoot') || 
            text.includes('tìm hiểu lý do') ||
            text.includes('find out why')
        ) {
            try {
                if (typeof toast.close === 'function') toast.close();
                if (typeof toast.hide === 'function') toast.hide();
            } catch (e) {}
            const closeBtn = toast.querySelector('button, #close-button, [aria-label*="Đóng"], [aria-label*="Close"], [aria-label*="Dismiss"]');
            if (closeBtn) {
                try { closeBtn.click(); } catch(e) {}
            }
            toast.style.setProperty('display', 'none', 'important');
            toast.style.setProperty('opacity', '0', 'important');
            toast.style.setProperty('pointer-events', 'none', 'important');
            toast.classList.add('ytc-dismissed-toast');
        }
    });

    // 3. Popup cảnh báo nổi bên trong player (#movie_player)
    const playerPopups = root.querySelectorAll('#movie_player .ytp-popup, #movie_player .ytp-suggested-action-badge, #movie_player .ytp-paid-content-overlay');
    playerPopups.forEach((popup) => {
        const text = (popup.textContent || '').toLowerCase();
        if (text.includes('gián đoạn') || text.includes('interruption') || text.includes('sự cố')) {
            popup.style.setProperty('display', 'none', 'important');
            popup.style.setProperty('opacity', '0', 'important');
            popup.style.setProperty('pointer-events', 'none', 'important');
        }
    });
}

export const scheduleFeedScan = rafThrottle((root) => {
    scanAndTagFeedContent(root);
    applyHomeGridColumns();
    dismissPromoBanners(root);
});

export function setupFeedShelvesObserver() {
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

    const target = document.getElementById('page-manager') || document.querySelector('ytd-page-manager') || document.body;
    if (target) attach(target);
    else whenElement('#page-manager', attach);

    // Theo dõi trực tiếp ytd-popup-container để đóng tức thì các toast cảnh báo gián đoạn khi vừa chèn vào DOM
    const attachPopup = (popupContainer) => {
        dismissPromoBanners(popupContainer);
        new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    dismissPromoBanners(popupContainer);
                    break;
                }
            }
        }).observe(popupContainer, { childList: true, subtree: true });
    };

    const popupContainer = document.querySelector('ytd-popup-container');
    if (popupContainer) attachPopup(popupContainer);
    else whenElement('ytd-popup-container', attachPopup);
}

// --------------------------------------------------------------------------
// 5. ĐIỀU KHIỂN VIDEO: PHÍM TẮT, CLEAN SEEK & FULLSCREEN LOCK
// --------------------------------------------------------------------------
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

export let isWatchLoading = false;
let watchLoadTimeout = null;

export function setWatchLoading(loading, duration = 1500) {
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
export function setupFullscreenLock() {
    if (fsLockBound) return;
    fsLockBound = true;

    document.addEventListener('click', (e) => {
        if (isWatchLoading && e.target.closest('.ytp-fullscreen-button')) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);

    document.addEventListener('dblclick', (e) => {
        if (isWatchLoading && e.target.closest('#movie_player')) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);

    document.addEventListener('fullscreenchange', () => {
        if (isWatchLoading && document.fullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
    });
}

function getPlayerVideo(player) {
    return player.querySelector('video.html5-main-video') || player.querySelector('video');
}

let lastSeekAt = 0;
const SEEK_COOLDOWN_MS = 80;

function dispatchYtSeek(key, delta) {
    const keyCode = key === 'j' ? 74 : (key === 'l' ? 76 : (key === 'k' ? 75 : 0));
    const code = key === 'j' ? 'KeyJ' : (key === 'l' ? 'KeyL' : (key === 'k' ? 'KeyK' : ''));
    
    const evDown = new KeyboardEvent('keydown', {
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

    const evUp = new KeyboardEvent('keyup', {
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

    const player = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
    const target = player || document.body || document;

    target.dispatchEvent(evDown);
    window.dispatchEvent(evDown);
    target.dispatchEvent(evUp);
    window.dispatchEvent(evUp);

    // Fallback nếu trình duyệt chặn synthetic event sau 60ms
    if (player && delta) {
        const tBefore = player.getCurrentTime ? player.getCurrentTime() : 0;
        setTimeout(() => {
            const tAfter = player.getCurrentTime ? player.getCurrentTime() : 0;
            if (Math.abs(tAfter - tBefore) < 1) {
                if (typeof player.seekBy === 'function') {
                    player.seekBy(delta);
                } else {
                    const video = getPlayerVideo(player);
                    if (video) video.currentTime += delta;
                }
            }
        }, 60);
    }
}

function seekBySeconds(player, delta) {
    const now = Date.now();
    if (now - lastSeekAt < SEEK_COOLDOWN_MS) return false;
    lastSeekAt = now;

    try {
        if (typeof player.seekBy === 'function') {
            player.seekBy(delta);
            return true;
        }
    } catch (e) {}

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
    try {
        if (delta > 0 && typeof player.volumeUp === 'function') {
            player.volumeUp();
            if (typeof player.unMute === 'function' && player.isMuted?.()) player.unMute();
            return;
        } else if (delta < 0 && typeof player.volumeDown === 'function') {
            player.volumeDown();
            return;
        }
    } catch (e) {}

    try {
        if (typeof player.getVolume === 'function' && typeof player.setVolume === 'function') {
            const cur = player.getVolume();
            const next = Math.max(0, Math.min(100, cur + delta));
            player.setVolume(next);
            if (delta > 0 && typeof player.unMute === 'function' && player.isMuted?.()) player.unMute();
            return;
        }
    } catch (e) {}

    const video = getPlayerVideo(player);
    if (video) {
        video.volume = Math.max(0, Math.min(1, video.volume + delta / 100));
    }
}

let keysBound = false;
export function bindGlobalKeys() {
    if (keysBound) return;
    keysBound = true;

    const handleKeyDown = (e) => {
        if (e._ytcDispatched) return;
        if (!currentConfig.keyboardControls) return;
        if (e.isComposing || e.keyCode === 229) return;

        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }

        const code = e.code || '';
        const isNumpad = (e.location === 3) || 
                         code.startsWith('Numpad') || 
                         (e.keyCode >= 96 && e.keyCode <= 111) || 
                         (e.keyCode === 12);

        const player = document.querySelector('#movie_player');
        const asdAllowed = canUseAsdKeys(player);

        let captured = false;
        let isSeekAction = false;

        // --- ĐIỀU KHIỂN BẰNG NUMPAD ---
        if (isNumpad) {
            captured = true; // Chặn 100% tất cả các phím Numpad để YouTube không nhận diện số 0-9 nhảy % video và không bị Home/End/PageUp/PageDown

            // Numpad 8: Tăng âm lượng
            if (code === 'Numpad8' || e.key === '8' || e.key === 'ArrowUp' || e.keyCode === 104 || e.keyCode === 38) {
                if (player) changeVolume(player, 5);
            }
            // Numpad 2: Giảm âm lượng
            else if (code === 'Numpad2' || e.key === '2' || e.key === 'ArrowDown' || e.keyCode === 98 || e.keyCode === 40) {
                if (player) changeVolume(player, -5);
            }
            // Numpad 4: Tua lùi 10 giây (kích hoạt phím J mặc định của YouTube để hiện hiệu ứng tròn tua)
            else if (code === 'Numpad4' || e.key === '4' || e.key === 'ArrowLeft' || e.keyCode === 100 || e.keyCode === 37) {
                dispatchYtSeek('j', -10);
                isSeekAction = true;
            }
            // Numpad 6: Tua tiến 10 giây (kích hoạt phím L mặc định của YouTube để hiện hiệu ứng tròn tua)
            else if (code === 'Numpad6' || e.key === '6' || e.key === 'ArrowRight' || e.keyCode === 102 || e.keyCode === 39) {
                dispatchYtSeek('l', 10);
                isSeekAction = true;
            }
            // Numpad 5: Tạm dừng / phát tiếp (kích hoạt phím K mặc định của YouTube)
            else if (code === 'Numpad5' || e.key === '5' || e.key === 'Clear' || e.keyCode === 101 || e.keyCode === 12) {
                dispatchYtSeek('k');
            }
            // Tất cả phím Numpad còn lại (1, 3, 7, 9, 0, ., +, -, *, /, Enter, NumLock...):
            // captured = true đã được thiết lập ở trên, chặn đứng hoàn toàn, không thực hiện gì cả.
            // Triệt tiêu 100% lỗi bấm 1, 7 nhảy đầu/cuối video, 3, 9 cuộn trang khi tắt NumLock và nhảy % video khi bật NumLock!
        }
        // --- ĐIỀU KHIỂN BẰNG A / S / D (Kích hoạt phím J/K/L mặc định của YouTube) ---
        else if (asdAllowed && code === 'KeyA') {
            captured = true;
            dispatchYtSeek('j', -10);
            isSeekAction = true;
        } else if (asdAllowed && code === 'KeyS') {
            captured = true;
            dispatchYtSeek('k');
        } else if (asdAllowed && code === 'KeyD') {
            captured = true;
            dispatchYtSeek('l', 10);
            isSeekAction = true;
        } else if (!e.ctrlKey && !e.altKey && !e.metaKey && (code === 'KeyF' || e.key === 'f' || e.key === 'F')) {
            if (isWatchLoading) {
                captured = true;
            }
        }

        if (captured) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        } else if (['ArrowLeft', 'ArrowRight', 'j', 'l', 'J', 'L'].includes(e.key)) {
            isSeekAction = true;
        }

        if (isSeekAction && player) {
            triggerCleanSeek(player);
        }
    };

    const handleKeyUp = (e) => {
        if (e._ytcDispatched) return;
        if (!currentConfig.keyboardControls) return;
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }
        const code = e.code || '';
        const isNumpad = (e.location === 3) || 
                         code.startsWith('Numpad') || 
                         (e.keyCode >= 96 && e.keyCode <= 111) || 
                         (e.keyCode === 12);
        if (isNumpad) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('keyup', handleKeyUp, true);
}

// --------------------------------------------------------------------------
// 6. MỞ KHÓA TUA LẠI LIVE STREAM (FORCE ENABLE LIVE DVR)
// --------------------------------------------------------------------------
let liveDvrHooked = false;
export function initLiveDvrHook() {
    if (liveDvrHooked) return;
    liveDvrHooked = true;

    function patchData(data) {
        if (!currentConfig.unlockLiveDvr) return;
        if (!data || typeof data !== 'object') return;
        if (data.videoDetails && data.videoDetails.isLive) {
            if (data.videoDetails.isLiveDvrEnabled === false) {
                data.videoDetails.isLiveDvrEnabled = true;
            }
        }
    }

    // 1. Can thiệp dữ liệu khởi tạo trang ban đầu
    try {
        let _initial = window.ytInitialPlayerResponse;
        if (_initial) patchData(_initial);
        Object.defineProperty(window, 'ytInitialPlayerResponse', {
            get() { return _initial; },
            set(val) {
                _initial = val;
                patchData(_initial);
            },
            configurable: true,
            enumerable: true
        });
    } catch (e) {}

    // 2. Can thiệp dữ liệu khi chuyển trang SPA qua JSON.parse
    try {
        const origParse = JSON.parse;
        JSON.parse = function(text, reviver) {
            const res = origParse.apply(this, arguments);
            if (
                currentConfig.unlockLiveDvr &&
                typeof text === 'string' &&
                text.includes('isLiveDvrEnabled') &&
                res &&
                typeof res === 'object' &&
                res.videoDetails &&
                res.videoDetails.isLive &&
                res.videoDetails.isLiveDvrEnabled === false
            ) {
                res.videoDetails.isLiveDvrEnabled = true;
            }
            return res;
        };
    } catch (e) {}
}

// --------------------------------------------------------------------------
// 7. CHAT OVERLAY TRÊN VIDEO (DANMAKU & KHUNG STREAMER TRONG SUỐT)
// --------------------------------------------------------------------------
const CHATBOX_POS_KEY = 'ytc_chatbox_pos';

let chatOverlayInitialized = false;
let danmakuContainer = null;
let streamerBox = null;
let streamerMessages = null;
let chatFrameObserver = null;
let chatItemsObserver = null;
let liveCheckTimer = null;
let currentLaneIndex = 0;
const TOTAL_LANES = 6;

function getSavedChatBoxPos() {
    try {
        const stored = localStorage.getItem(CHATBOX_POS_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { top: '15%', right: '20px', left: '', width: '340px', height: '260px' };
}

function saveChatBoxPos(pos) {
    try {
        localStorage.setItem(CHATBOX_POS_KEY, JSON.stringify(pos));
    } catch (e) {}
}

export function updateChatOverlayVisibility() {
    const mode = currentConfig.chatOverlay || 'off';
    const danmaku = document.getElementById('ytc-danmaku-container') || danmakuContainer;
    const streamer = document.getElementById('ytc-streamer-box') || streamerBox;

    if (danmaku) {
        danmaku.style.display = mode === 'danmaku' ? 'block' : 'none';
        if (mode !== 'danmaku') danmaku.innerHTML = '';
    }
    if (streamer) {
        streamer.style.display = mode === 'streamer' ? 'flex' : 'none';
        if (mode !== 'streamer') {
            const msgs = streamer.querySelector('.ytc-box-messages');
            if (msgs) msgs.innerHTML = '';
        }
    }
}

function setChatOverlayHidden(hidden) {
    if (danmakuContainer) {
        danmakuContainer.classList.toggle('ytc-chat-hidden', hidden);
    }
    if (streamerBox) {
        streamerBox.classList.toggle('ytc-chat-hidden', hidden);
    }
}

function ensureChatOverlayContainers() {
    const player = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
    if (!player) return;

    // 1. Danmaku Container
    if (!danmakuContainer || !player.contains(danmakuContainer)) {
        danmakuContainer = document.createElement('div');
        danmakuContainer.id = 'ytc-danmaku-container';
        player.appendChild(danmakuContainer);
    }

    // 2. Streamer Box
    if (!streamerBox || !player.contains(streamerBox)) {
        streamerBox = document.createElement('div');
        streamerBox.id = 'ytc-streamer-box';

        const pos = getSavedChatBoxPos();
        if (pos.left) streamerBox.style.left = pos.left;
        else if (pos.right) streamerBox.style.right = pos.right;
        else streamerBox.style.right = '20px';

        if (pos.top) streamerBox.style.top = pos.top;
        else streamerBox.style.top = '15%';

        if (pos.width) streamerBox.style.width = pos.width;
        if (pos.height) streamerBox.style.height = pos.height;

        streamerBox.innerHTML = safeHTML(`
            <div class="ytc-box-header" title="Giữ chuột để kéo thả vị trí">
                <span>💬 Live Chat</span>
                <span style="font-size:10px;opacity:0.7">Kéo thả</span>
            </div>
            <div class="ytc-box-messages"></div>
            <div class="ytc-box-resize" title="Kéo để thay đổi kích thước"></div>
        `);

        player.appendChild(streamerBox);
        streamerMessages = streamerBox.querySelector('.ytc-box-messages');

        setupChatBoxInteractions(streamerBox, player);
    }

    updateChatOverlayVisibility();
}

function setupChatBoxInteractions(box, player) {
    const header = box.querySelector('.ytc-box-header');
    const resizeHandle = box.querySelector('.ytc-box-resize');

    // Drag & Drop
    if (header) {
        header.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();

            const pRect = player.getBoundingClientRect();
            const bRect = box.getBoundingClientRect();

            const shiftX = e.clientX - bRect.left;
            const shiftY = e.clientY - bRect.top;

            function onMouseMove(moveEvent) {
                let newLeft = moveEvent.clientX - pRect.left - shiftX;
                let newTop = moveEvent.clientY - pRect.top - shiftY;

                newLeft = Math.max(0, Math.min(newLeft, pRect.width - box.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, pRect.height - box.offsetHeight));

                box.style.left = `${newLeft}px`;
                box.style.top = `${newTop}px`;
                box.style.right = 'auto';
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                saveChatBoxPos({
                    left: box.style.left,
                    top: box.style.top,
                    right: '',
                    width: box.style.width,
                    height: box.style.height
                });
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // Co giãn (Resize)
    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();

            const startX = e.clientX;
            const startY = e.clientY;
            const startW = box.offsetWidth;
            const startH = box.offsetHeight;

            function onMouseMove(moveEvent) {
                const newW = Math.max(200, Math.min(startW + (moveEvent.clientX - startX), player.offsetWidth * 0.8));
                const newH = Math.max(100, Math.min(startH + (moveEvent.clientY - startY), player.offsetHeight * 0.8));

                box.style.width = `${newW}px`;
                box.style.height = `${newH}px`;
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                saveChatBoxPos({
                    left: box.style.left,
                    top: box.style.top,
                    right: box.style.right,
                    width: box.style.width,
                    height: box.style.height
                });
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
}

function processIncomingMessage(node) {
    if (!currentConfig.chatOverlay || currentConfig.chatOverlay === 'off') return;

    const authorEl = node.querySelector('#author-name');
    const author = authorEl ? authorEl.textContent.trim() : 'Ẩn danh';

    const isMod = !!node.querySelector('yt-live-chat-author-badge-renderer[aria-label*="Kiểm duyệt"], [type="moderator"], .moderator') || node.classList.contains('author-type-moderator');
    const isMember = !!node.querySelector('yt-live-chat-author-badge-renderer[aria-label*="Hội viên"], [type="member"], .member') || node.classList.contains('author-type-member');
    const isOwner = !!node.querySelector('yt-live-chat-author-badge-renderer[aria-label*="Chủ sở hữu"], [type="owner"], .owner') || node.classList.contains('author-type-owner');

    const avatarEl = node.querySelector('#author-photo img');
    const avatarSrc = avatarEl ? (avatarEl.src || avatarEl.getAttribute('src')) : '';

    const badgeEls = Array.from(node.querySelectorAll('#chat-badges yt-live-chat-author-badge-renderer'));
    const badgesHtml = badgeEls.map(b => b.innerHTML).join('');

    const messageEl = node.querySelector('#message');
    const messageHtml = messageEl ? messageEl.innerHTML : '';

    if (!messageHtml && !author) return;

    ensureChatOverlayContainers();

    const authorClass = isMod ? 'mod' : (isMember ? 'member' : (isOwner ? 'owner' : ''));

    // Chế độ 1: Danmaku chạy ngang
    if (currentConfig.chatOverlay === 'danmaku' && danmakuContainer) {
        const item = document.createElement('div');
        item.className = 'ytc-danmaku-item';

        currentLaneIndex = (currentLaneIndex + 1) % TOTAL_LANES;
        const topPercent = 8 + currentLaneIndex * 8;
        item.style.top = `${topPercent}%`;

        item.innerHTML = safeHTML(`
            <span class="ytc-chat-author ${authorClass}">@${author}:</span>
            <span class="ytc-chat-text">${messageHtml}</span>
        `);

        danmakuContainer.appendChild(item);
        item.addEventListener('animationend', () => item.remove());
    }

    // Chế độ 2: Khung nổi Streamer
    if (currentConfig.chatOverlay === 'streamer' && streamerMessages) {
        const item = document.createElement('div');
        item.className = 'ytc-box-item';

        const avatarMarkup = avatarSrc ? `<img class="ytc-box-avatar" src="${avatarSrc}" alt="">` : '';
        const badgeMarkup = badgesHtml ? `<span class="ytc-box-badge">${badgesHtml}</span>` : '';

        item.innerHTML = safeHTML(`
            ${avatarMarkup}
            <div class="ytc-box-content">
                <span class="ytc-chat-author ${authorClass}">@${author}</span>${badgeMarkup}: 
                <span class="ytc-chat-text">${messageHtml}</span>
            </div>
        `);

        streamerMessages.appendChild(item);

        while (streamerMessages.children.length > 12) {
            streamerMessages.firstElementChild.remove();
        }

        setTimeout(() => {
            if (item.isConnected) {
                item.style.transition = 'opacity 0.6s ease';
                item.style.opacity = '0';
                setTimeout(() => item.remove(), 600);
            }
        }, 14000);
    }
}

function hookLiveChatFrame(frame) {
    if (!frame) return;

    function attachToDocument(doc) {
        if (!doc) return;
        const items = doc.querySelector('#items.yt-live-chat-item-list-renderer, #item-list #items, #chat #items');
        if (items) {
            if (items._ytcBound) return;
            items._ytcBound = true;

            // Xử lý các tin nhắn hiện có để người dùng thấy ngay khi vừa bật
            const existingMessages = items.querySelectorAll('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer');
            if (existingMessages && existingMessages.length) {
                const recent = Array.from(existingMessages).slice(-6);
                recent.forEach(node => processIncomingMessage(node));
            }

            if (chatItemsObserver) chatItemsObserver.disconnect();
            chatItemsObserver = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    for (const node of m.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.matches && node.matches('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, [class*="yt-live-chat-"]')) {
                                processIncomingMessage(node);
                            } else {
                                const subs = node.querySelectorAll && node.querySelectorAll('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer');
                                if (subs && subs.length) {
                                    subs.forEach(processIncomingMessage);
                                }
                            }
                        }
                    }
                }
            });
            chatItemsObserver.observe(items, { childList: true });
        } else {
            const waitObs = new MutationObserver(() => {
                const it = doc.querySelector('#items.yt-live-chat-item-list-renderer, #item-list #items, #chat #items');
                if (it) {
                    waitObs.disconnect();
                    attachToDocument(doc);
                }
            });
            waitObs.observe(doc.body || doc.documentElement, { childList: true, subtree: true });
            setTimeout(() => waitObs.disconnect(), 10000);
        }
    }

    try {
        const doc = frame.contentDocument || frame.contentWindow?.document;
        if (doc && doc.body) {
            attachToDocument(doc);
        }
    } catch (e) {}

    frame.addEventListener('load', () => {
        try {
            const doc = frame.contentDocument || frame.contentWindow?.document;
            if (doc) {
                attachToDocument(doc);
            }
        } catch (e) {}
    });
}

function checkLiveHeadStatus() {
    const player = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
    if (!player) return;

    let isLive = false;
    try {
        const d = player.getVideoData?.();
        isLive = !!(d && d.isLive);
    } catch (e) {}

    if (!isLive) {
        setChatOverlayHidden(false);
        return;
    }

    let isAtHead = true;
    try {
        if (typeof player.isAtLiveHead === 'function') {
            isAtHead = player.isAtLiveHead();
        } else {
            const liveBadge = document.querySelector('.ytp-live-badge');
            isAtHead = liveBadge && !liveBadge.hasAttribute('disabled');
        }
    } catch (e) {}

    setChatOverlayHidden(!isAtHead);
}

export function initChatOverlay() {
    if (chatOverlayInitialized) return;
    chatOverlayInitialized = true;

    function scanFrame() {
        const frame = document.querySelector('iframe#chatframe');
        if (frame) {
            hookLiveChatFrame(frame);
        }
    }

    scanFrame();

    chatFrameObserver = new MutationObserver(() => {
        scanFrame();
    });
    const root = document.querySelector('ytd-app') || document.body || document.documentElement;
    chatFrameObserver.observe(root, { childList: true, subtree: true });

    if (liveCheckTimer) clearInterval(liveCheckTimer);
    liveCheckTimer = setInterval(checkLiveHeadStatus, 600);

    // Định kỳ quét và gắn lại nếu người dùng đổi luồng hoặc iframe chat vừa nạp xong
    setInterval(() => {
        if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
            scanFrame();
        }
    }, 2000);

    if (location.pathname.startsWith('/watch') || location.pathname.startsWith('/live')) {
        whenElement('#movie_player', ensureChatOverlayContainers);
    }
}

