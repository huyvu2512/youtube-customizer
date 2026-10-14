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

    // 1. Quét trực tiếp các tag Snackbar mới của YouTube & Toast / Bubble truyền thống
    const candidates = root.querySelectorAll(
        'snackbar-container, snackbar-view-model, .ytSnackbarContainerHost, .ytSnackbarContainerSnackbarContainer, ' +
        '.snackbarViewModelHost, .snackbarViewModelTitle, .snackbarViewModelTitleSubtextWrapper, ' +
        'yt-bubble-hint-renderer, ytd-bubble-hint-renderer, tp-yt-paper-toast, #toast, ' +
        'yt-notification-action-renderer, ytd-notification-action-renderer, ' +
        '.ytp-suggested-action-badge, .ytp-suggested-action-badge-expanded, .ytp-bezel, .ytp-hint, ' +
        'div[class*="interrupt" i], div[class*="suggested-action" i], div[class*="ad-interrupt" i], ' +
        '.paper-toast-open, .toast-button'
    );

    candidates.forEach((el) => {
        const text = (el.textContent || el.innerText || '').toLowerCase();
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

    // 2. Quét XPath dự phòng toàn diện để không bỏ sót bất kỳ container nào chứa chữ gián đoạn
    try {
        const xpath = "//*[self::div or self::span or self::p or self::yt-formatted-string or self::snackbar-view-model or self::snackbar-container][contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'gián đoạn') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'interruption') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'tìm hiểu lý do') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'find out why')]";
        const result = document.evaluate(xpath, root, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
            const node = result.snapshotItem(i);
            if (node) {
                const target = node.closest('snackbar-container, .ytSnackbarContainerHost, snackbar-view-model, yt-bubble-hint-renderer, ytd-bubble-hint-renderer, tp-yt-paper-toast, yt-notification-action-renderer, .paper-toast-open') || node;
                target.style.setProperty('display', 'none', 'important');
                target.style.setProperty('opacity', '0', 'important');
                target.style.setProperty('visibility', 'hidden', 'important');
                target.style.setProperty('pointer-events', 'none', 'important');
                try { target.remove(); } catch(e) {}
                resumePlayerIfPaused();
            }
        }
    } catch(e) {}
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

    const toasts = root.querySelectorAll('tp-yt-paper-toast, #toast, yt-notification-action-renderer, ytd-notification-action-renderer, yt-bubble-hint-renderer, ytd-mealbar-promo-renderer, snackbar-container, snackbar-view-model');
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

    dismissInterruptionPrompts(document);
    if (currentConfig.autoDismissPromos) {
        dismissPromoBanners(document);
    }

    // Observer toàn cục bắt ngay các phần tử gián đoạn / snackbar / popup
    let throttleTimer = null;
    const observer = new MutationObserver((mutations) => {
        // Quét triệt tiêu thông báo gián đoạn
        if (!throttleTimer) {
            throttleTimer = requestAnimationFrame(() => {
                throttleTimer = null;
                dismissInterruptionPrompts(document);
            });
        }

        if (currentConfig.autoDismissPromos) {
            for (const m of mutations) {
                if (m.addedNodes.length === 0) continue;
                for (const node of m.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    const tag = node.tagName.toLowerCase();
                    const cls = (node.className || '').toString();

                    if (
                        tag.includes('snackbar') ||
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
                        dismissPromoBanners(node.parentElement || document);
                        return;
                    }
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
            if (scans >= 15) {
                clearInterval(interval);
                return;
            }
            dismissInterruptionPrompts(document);
            if (currentConfig.autoDismissPromos) {
                dismissPromoBanners(document);
            }
        }, 400);
    });
}
