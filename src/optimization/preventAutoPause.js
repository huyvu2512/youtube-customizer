// ==========================================================================
// PREVENT AUTO-PAUSE ("VIDEO PAUSED. CONTINUE WATCHING?")
// ==========================================================================
import { currentConfig, onConfigChange } from '../core/config.js';
import { whenElement } from '../core/utils.js';

let lactInterval = null;
let dialogObserver = null;
let preventAutoPauseBound = false;

function refreshLact() {
    try {
        window._lact = Date.now();
    } catch (e) {}
}

function checkAndDismissPauseDialog() {
    if (!currentConfig.preventAutoPause) return;

    // 1. Quét hộp thoại xác nhận tạm dừng của YouTube (không quét cả ytd-popup-container để tránh đọc textContent thừa)
    const dialogs = document.querySelectorAll('yt-confirm-dialog-renderer, tp-yt-paper-dialog');

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

export function syncPreventAutoPause() {
    if (!currentConfig.preventAutoPause) {
        stopPreventAutoPause();
        return;
    }

    if (!lactInterval) {
        // 1. Định kỳ 5 phút làm mới _lact (last active time) để YouTube không bao giờ coi người dùng là idle
        lactInterval = setInterval(() => {
            if (currentConfig.preventAutoPause) {
                refreshLact();
            } else {
                stopPreventAutoPause();
            }
        }, 5 * 60 * 1000);
        refreshLact();
    }

    // 2. Observer theo dõi dialog xuất hiện — chỉ theo dõi trực tiếp ytd-popup-container
    if (!dialogObserver) {
        let debounceTimer = null;
        whenElement('ytd-popup-container', (popupTarget) => {
            if (!dialogObserver && currentConfig.preventAutoPause) {
                dialogObserver = new MutationObserver(() => {
                    if (!currentConfig.preventAutoPause) return;
                    if (debounceTimer) return;
                    debounceTimer = setTimeout(() => {
                        debounceTimer = null;
                        checkAndDismissPauseDialog();
                    }, 500);
                });
                dialogObserver.observe(popupTarget, { childList: true, subtree: true });
            }
        });
    }
}

export function initPreventAutoPause() {
    if (!preventAutoPauseBound) {
        preventAutoPauseBound = true;
        onConfigChange(syncPreventAutoPause);
    }
    syncPreventAutoPause();
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
