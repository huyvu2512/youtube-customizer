// ==========================================================================
// PREVENT AUTO-PAUSE ("VIDEO PAUSED. CONTINUE WATCHING?")
// ==========================================================================
import { currentConfig } from '../core/config.js';

let lactInterval = null;
let dialogObserver = null;

function refreshLact() {
    try {
        window._lact = Date.now();
    } catch (e) {}
}

function checkAndDismissPauseDialog() {
    if (!currentConfig.preventAutoPause) return;

    // 1. Quét hộp thoại xác nhận tạm dừng của YouTube
    const dialogs = document.querySelectorAll(
        'yt-confirm-dialog-renderer, ytd-popup-container, tp-yt-paper-dialog'
    );

    for (const dialog of dialogs) {
        if (dialog.offsetParent === null && dialog.style.display === 'none') continue;

        const text = dialog.textContent || '';
        if (
            text.includes('Bạn vẫn đang xem') ||
            text.includes('Video đã tạm dừng') ||
            text.includes('Continue watching') ||
            text.includes('Video paused')
        ) {
            const confirmBtn = dialog.querySelector(
                '#confirm-button button, yt-button-renderer#confirm-button button, [aria-label*="Có" i], [aria-label*="Yes" i]'
            );
            if (confirmBtn) {
                confirmBtn.click();
            }

            // Tự động phát tiếp nếu player đang bị pause
            const player = document.querySelector('#movie_player:not(#inline-preview-player)');
            if (player && typeof player.playVideo === 'function') {
                player.playVideo();
            }
            break;
        }
    }
}

export function initPreventAutoPause() {
    if (lactInterval) return;

    // 1. Định kỳ 5 phút làm mới _lact (last active time) để YouTube không bao giờ coi người dùng là idle
    lactInterval = setInterval(() => {
        if (currentConfig.preventAutoPause) {
            refreshLact();
        }
    }, 5 * 60 * 1000);
    refreshLact();

    // 2. Observer theo dõi dialog xuất hiện
    dialogObserver = new MutationObserver(() => {
        if (currentConfig.preventAutoPause) {
            checkAndDismissPauseDialog();
        }
    });

    const target = document.querySelector('ytd-app') || document.body || document.documentElement;
    dialogObserver.observe(target, { childList: true, subtree: true });
}

export function stopPreventAutoPause() {
    if (lactInterval) {
        clearInterval(lactInterval);
        lactInterval = null;
    }
    if (dialogObserver) {
        dialogObserver.disconnect();
        dialogObserver = null;
    }
}
