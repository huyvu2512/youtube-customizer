// ==========================================================================
// TỰ ĐỘNG ĐÓNG PROMO BANNER & CẢNH BÁO GIÁN ĐOẠN
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { whenElement } from '../core/utils.js';
import { dismissShoppingPanels } from './shoppingFilter.js';

function resumePlayerIfPaused() {
    try {
        const player = document.querySelector('#movie_player:not(#inline-preview-player)');
        if (player && typeof player.getPlayerState === 'function') {
            if (player.getPlayerState() === 2 && typeof player.playVideo === 'function') {
                player.playVideo();
            }
        }
    } catch (e) {}
}

export function dismissPromoBanners(scope) {
    if (currentConfig.hideShopping) {
        dismissShoppingPanels(scope);
    }
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

    // 2. Thông báo gián đoạn & popup phiền toái ("Bạn đang gặp sự cố gây gián đoạn?", toasts)
    const toasts = root.querySelectorAll('tp-yt-paper-toast, #toast, yt-notification-action-renderer, ytd-notification-action-renderer, yt-bubble-hint-renderer, ytd-mealbar-promo-renderer');
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
            const closeBtn = toast.querySelector('button, #close-button, [aria-label*="Đóng"], [aria-label*="Close"], [aria-label*="Dismiss"], yt-button-renderer');
            if (closeBtn) {
                try { closeBtn.click(); } catch(e) {}
            }
            toast.style.setProperty('display', 'none', 'important');
            toast.style.setProperty('opacity', '0', 'important');
            toast.style.setProperty('pointer-events', 'none', 'important');
            toast.classList.add('ytc-dismissed-toast');
            try { toast.remove(); } catch (e) {}

            resumePlayerIfPaused();
        }
    });

    // 3. Popup cảnh báo nổi bên trong player (#movie_player)
    const playerPopups = root.querySelectorAll(
        '#movie_player .ytp-popup, #movie_player .ytp-suggested-action-badge, #movie_player .ytp-paid-content-overlay, ' +
        '#movie_player .ytp-bezel, #movie_player .ytp-hint, #movie_player yt-bubble-hint-renderer, ' +
        '#movie_player div[class*="interrupt" i], #movie_player div[class*="suggested-action" i], ' +
        '#movie_player div[class*="ad-interrupt" i]'
    );
    playerPopups.forEach((popup) => {
        const text = (popup.textContent || '').toLowerCase();
        if (
            text.includes('gián đoạn') || 
            text.includes('interruption') || 
            text.includes('sự cố') ||
            text.includes('troubleshoot') ||
            text.includes('tìm hiểu lý do') ||
            text.includes('find out why')
        ) {
            const closeBtn = popup.querySelector('button, [aria-label*="Đóng" i], [aria-label*="Close" i], [aria-label*="Dismiss" i], .ytp-suggested-action-badge-dismiss-button');
            if (closeBtn) {
                try { closeBtn.click(); } catch(e) {}
            }
            popup.style.setProperty('display', 'none', 'important');
            popup.style.setProperty('opacity', '0', 'important');
            popup.style.setProperty('pointer-events', 'none', 'important');
            try { popup.remove(); } catch (e) {}

            resumePlayerIfPaused();
        }
    });
}

let promoObserverAttached = false;
export function setupPromoObserver() {
    if (promoObserverAttached) return;
    promoObserverAttached = true;

    dismissPromoBanners(document);

    let debounceTimer = null;
    const triggerScan = () => {
        if (!currentConfig.autoDismissPromos) return;
        if (debounceTimer) return;
        debounceTimer = setTimeout(() => {
            debounceTimer = null;
            dismissPromoBanners(document);
        }, 120);
    };

    whenElement('ytd-popup-container', (popupTarget) => {
        new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.addedNodes.length > 0) {
                    triggerScan();
                    break;
                }
            }
        }).observe(popupTarget, { childList: true, subtree: true });
    });

    whenElement('#movie_player:not(#inline-preview-player)', (playerTarget) => {
        new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.addedNodes.length > 0) {
                    let hasAlert = false;
                    for (const node of m.addedNodes) {
                        if (node.nodeType === 1) {
                            const cls = (node.className || '').toString();
                            if (cls.includes('ytp-') || cls.includes('bubble') || cls.includes('toast') || cls.includes('badge')) {
                                hasAlert = true;
                                break;
                            }
                        }
                    }
                    if (hasAlert) {
                        triggerScan();
                        break;
                    }
                }
            }
        }).observe(playerTarget, { childList: true });
    });
}
