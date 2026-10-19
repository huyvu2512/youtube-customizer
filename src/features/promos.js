// ==========================================================================
// TỰ ĐỘNG ĐÓNG PROMO BANNER & CẢNH BÁO GIÁN ĐOẠN (ANTI-INTERRUPTION SYSTEM)
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { whenElement } from '../core/utils.js';
import { dismissShoppingPanels } from './shoppingFilter.js';

const INTERRUPTION_SELECTOR =
    'snackbar-container, snackbar-view-model, .ytSnackbarContainerHost, .ytSnackbarContainerSnackbarContainer, ' +
    '.snackbarViewModelHost, .snackbarViewModelTitle, .snackbarViewModelTitleSubtextWrapper, ' +
    'yt-bubble-hint-renderer, ytd-bubble-hint-renderer, tp-yt-paper-toast, #toast, ' +
    'yt-notification-action-renderer, ytd-notification-action-renderer, ' +
    '.ytp-suggested-action-badge, .ytp-suggested-action-badge-expanded, .ytp-bezel, .ytp-hint, ' +
    'div[class*="interrupt" i], div[class*="suggested-action" i], div[class*="ad-interrupt" i], ' +
    '.paper-toast-open, .toast-button';

const PROMO_SELECTOR =
    'ytd-mealbar-promo-renderer, yt-mealbar-promo-renderer, ytd-upsell-dialog-renderer, ' +
    'ytd-in-feed-survey-renderer, ytd-single-option-survey-renderer';
const IGNORED_MUTATION_ZONES =
    '#comments, ytd-comments, #ytc-danmaku-container, #ytc-streamer-box, ytd-moving-thumbnail-renderer';

function queryIncludingRoot(root, selector) {
    const matches = Array.from(root.querySelectorAll(selector));
    if (root.nodeType === 1 && root.matches(selector)) matches.unshift(root);
    return matches;
}

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

    const candidates = queryIncludingRoot(root, INTERRUPTION_SELECTOR);

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
            const target = el.closest('snackbar-container, .ytSnackbarContainerHost, snackbar-view-model, yt-bubble-hint-renderer, ytd-bubble-hint-renderer, tp-yt-paper-toast, yt-notification-action-renderer') || el;
            const closeBtn = target.querySelector('button, #close-button, [aria-label*="Đóng" i], [aria-label*="Close" i], [aria-label*="Dismiss" i], .ytp-suggested-action-badge-dismiss-button, yt-button-renderer');
            if (closeBtn) {
                try { closeBtn.click(); } catch(e) {}
            }
            target.style.setProperty('display', 'none', 'important');
            target.style.setProperty('opacity', '0', 'important');
            target.style.setProperty('pointer-events', 'none', 'important');
            target.style.setProperty('visibility', 'hidden', 'important');
            try {
                if (typeof target.close === 'function') target.close();
                if (typeof target.hide === 'function') target.hide();
                target.remove();
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

    const promos = queryIncludingRoot(root, PROMO_SELECTOR);
    promos.forEach((promo) => {
        const dismissBtn = promo.querySelector('#dismiss-button button, yt-button-renderer#dismiss-button button, yt-button-renderer#dismiss-button, #dismiss-button, button[aria-label*="Không"], button[aria-label*="Dismiss"], button[aria-label*="No thanks"]');
        if (dismissBtn) {
            try { dismissBtn.click(); } catch(e) {}
        }
        promo.style.setProperty('display', 'none', 'important');
        promo.style.setProperty('opacity', '0', 'important');
        promo.style.setProperty('pointer-events', 'none', 'important');
    });

    const toasts = queryIncludingRoot(root, 'tp-yt-paper-toast, #toast, yt-notification-action-renderer, ytd-notification-action-renderer, yt-bubble-hint-renderer, ytd-mealbar-promo-renderer, snackbar-container, snackbar-view-model');
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

    // Theo dõi thay đổi để chỉ kiểm tra các node vừa được thêm và tổ tiên liên quan.
    // Không quét lại toàn bộ DOM của YouTube sau mỗi đợt cập nhật giao diện.
    const pendingScopes = new Set();
    let scheduledFrame = 0;
    const relevantSelector = `${INTERRUPTION_SELECTOR}, ${PROMO_SELECTOR}`;
    const observer = new MutationObserver((mutations) => {
        const queueTarget = (node) => {
            if (!node || node.nodeType !== 1) return;
            const related = node.closest(relevantSelector);
            if (related) pendingScopes.add(related);
            if (node.matches(relevantSelector)) pendingScopes.add(node);
        };
        const queueAddedNode = (node) => {
            queueTarget(node);
            if (!node || node.nodeType !== 1) return;
            node.querySelectorAll(relevantSelector).forEach((el) => pendingScopes.add(el));
        };

        for (const mutation of mutations) {
            if (mutation.target.closest?.(IGNORED_MUTATION_ZONES)) continue;
            queueTarget(mutation.target);
            for (const node of mutation.addedNodes) queueAddedNode(node);
        }

        if (pendingScopes.size && !scheduledFrame) {
            scheduledFrame = requestAnimationFrame(() => {
                scheduledFrame = 0;
                const scopes = Array.from(pendingScopes);
                pendingScopes.clear();
                for (const scope of scopes) {
                    if (scope.isConnected) dismissPromoBanners(scope);
                }
            });
        }
    });

    whenElement('body', (body) => {
        observer.observe(body, { childList: true, subtree: true });
    });

}
