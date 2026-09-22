// ==========================================================================
// TỰ ĐỘNG ĐÓNG PROMO BANNER & CẢNH BÁO GIÁN ĐOẠN
// ==========================================================================
import { currentConfig } from '../core/config.js';

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

    // 2. Thông báo gián đoạn & popup phiền toái ("Bạn đang gặp sự cố gây gián đoạn?", toasts)
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
