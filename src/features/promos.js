// ==========================================================================
// TỰ ĐỘNG ĐÓNG PROMO BANNER & CẢNH BÁO GIÁN ĐOẠN (ANTI-INTERRUPTION SYSTEM)
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { whenElement } from '../core/utils.js';
import { dismissShoppingPanels } from './shoppingFilter.js';

export function resumePlayerIfPaused() {
    try {
        const player = document.querySelector('#movie_player:not(#inline-preview-player)') || document.getElementById('movie_player');
        if (player) {
            if (typeof player.getPlayerState === 'function') {
                const state = player.getPlayerState();
                // 2: PAUSED, -1: UNSTARTED
                if (state === 2 || state === -1) {
                    if (typeof player.playVideo === 'function') {
                        player.playVideo();
                    }
                }
            }
            const video = player.querySelector('video.html5-main-video') || player.querySelector('video');
            if (video && video.paused) {
                video.play().catch(() => {});
            }
        }
    } catch (e) {}
}

/**
 * Triệt tiêu toàn bộ thông báo gián đoạn do YouTube phát hiện chặn quảng cáo (uBlock/AdBlock)
 * Luôn hoạt động ngầm để bảo đảm trải nghiệm xem video liền mạch 100%
 */
export function dismissInterruptionPrompts(scope) {
    const root = scope && scope.querySelectorAll ? scope : document;

    const candidates = root.querySelectorAll(
        'yt-bubble-hint-renderer, ytd-bubble-hint-renderer, tp-yt-paper-toast, #toast, ' +
        'yt-notification-action-renderer, ytd-notification-action-renderer, ' +
        '.ytp-suggested-action-badge, .ytp-suggested-action-badge-expanded, .ytp-bezel, .ytp-hint, ' +
        'div[class*="interrupt" i], div[class*="suggested-action" i], div[class*="ad-interrupt" i], ' +
        '.paper-toast-open, .toast-button'
    );

    candidates.forEach((el) => {
        const text = (el.textContent || '').toLowerCase();
        if (
            text.includes('gián đoạn') || 
            text.includes('interruption') || 
            text.includes('sự cố') || 
            text.includes('troubleshoot') || 
            text.includes('tìm hiểu lý do') ||
            text.includes('find out why')
        ) {
            const closeBtn = el.querySelector('button, #close-button, [aria-label*="Đóng" i], [aria-label*="Close" i], [aria-label*="Dismiss" i], .ytp-suggested-action-badge-dismiss-button, yt-button-renderer');
            if (closeBtn) {
                try { closeBtn.click(); } catch(e) {}
            }
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('opacity', '0', 'important');
            el.style.setProperty('pointer-events', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
            try {
                if (typeof el.close === 'function') el.close();
                if (typeof el.hide === 'function') el.hide();
                el.remove();
            } catch(e) {}

            resumePlayerIfPaused();
        }
    });
}

export function dismissPromoBanners(scope) {
    if (currentConfig.hideShopping) {
        dismissShoppingPanels(scope);
    }

    // 1. Luôn triệt tiêu thông báo gián đoạn (chống kẹt video do AdBlock)
    dismissInterruptionPrompts(scope);

    // 2. Banner tiếp thị, khảo sát, upsell theo cài đặt người dùng
    if (!currentConfig.autoDismissPromos) return;
    const root = scope && scope.querySelectorAll ? scope : document;

    const promos = root.querySelectorAll('ytd-mealbar-promo-renderer, yt-mealbar-promo-renderer, ytd-upsell-dialog-renderer, ytd-in-feed-survey-renderer, ytd-single-option-survey-renderer');
    promos.forEach((promo) => {
        const dismissBtn = promo.querySelector('#dismiss-button button, yt-button-renderer#dismiss-button button, yt-button-renderer#dismiss-button, #dismiss-button, button[aria-label*="Không"], button[aria-label*="Dismiss"], button[aria-label*="No thanks"]');
        if (dismissBtn) {
            try { dismissBtn.click(); } catch(e) {}
        }
        promo.style.setProperty('display', 'none', 'important');
        promo.style.setProperty('opacity', '0', 'important');
        promo.style.setProperty('pointer-events', 'none', 'important');
    });

    const toasts = root.querySelectorAll('tp-yt-paper-toast, #toast, yt-notification-action-renderer, ytd-notification-action-renderer, yt-bubble-hint-renderer, ytd-mealbar-promo-renderer');
    toasts.forEach((toast) => {
        const text = (toast.textContent || '').toLowerCase();
        if (
            text.includes('premium') ||
            text.includes('dùng thử') ||
            text.includes('khảo sát') ||
            text.includes('survey')
        ) {
            const closeBtn = toast.querySelector('button, #close-button, [aria-label*="Đóng"], [aria-label*="Close"], [aria-label*="Dismiss"], yt-button-renderer');
            if (closeBtn) {
                try { closeBtn.click(); } catch(e) {}
            }
            toast.style.setProperty('display', 'none', 'important');
            toast.style.setProperty('opacity', '0', 'important');
            toast.style.setProperty('pointer-events', 'none', 'important');
        }
    });
}

let promoObserverAttached = false;
export function setupPromoObserver() {
    if (promoObserverAttached) return;
    promoObserverAttached = true;

    dismissPromoBanners(document);

    // Observer toàn cục siêu nhạy bắt ngay các phần tử gián đoạn / popup
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes.length === 0) continue;
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;
                const tag = node.tagName.toLowerCase();
                const cls = (node.className || '').toString();

                if (
                    tag.includes('bubble') ||
                    tag.includes('toast') ||
                    tag.includes('notification') ||
                    tag.includes('mealbar') ||
                    tag.includes('dialog') ||
                    cls.includes('ytp-suggested') ||
                    cls.includes('paper-toast') ||
                    cls.includes('interrupt') ||
                    cls.includes('toast-button')
                ) {
                    dismissInterruptionPrompts(node.parentElement || document);
                    if (currentConfig.autoDismissPromos) {
                        dismissPromoBanners(node.parentElement || document);
                    }
                    return;
                }
            }
        }
    });

    whenElement('body', (body) => {
        observer.observe(body, { childList: true, subtree: true });
    });

    // Quét bổ sung liên tục trong 8 giây đầu khi mở video để tiêu diệt ngay lúc 0:00
    window.addEventListener('yt-navigate-finish', () => {
        let scans = 0;
        const interval = setInterval(() => {
            scans++;
            dismissPromoBanners(document);
            if (scans >= 12) clearInterval(interval);
        }, 600);
    });
}
