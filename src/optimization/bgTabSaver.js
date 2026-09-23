// ==========================================================================
// BACKGROUND TAB RESOURCE SAVER (LOWER VIDEO QUALITY TO 144P WHEN IN BACKGROUND)
// ==========================================================================
import { currentConfig } from '../core/config.js';

let previousQuality = null;
let isListening = false;

function getPlayer() {
    return document.querySelector('#movie_player:not(#inline-preview-player)');
}

export function handleBgTabChange() {
    if (!currentConfig.bgTabSaver) return;

    const player = getPlayer();
    if (!player) return;

    if (document.hidden) {
        // Tab bị ẩn: lưu độ phân giải cũ và hạ xuống tiny (144p)
        try {
            const curQ = typeof player.getPlaybackQuality === 'function' ? player.getPlaybackQuality() : null;
            if (curQ && curQ !== 'tiny') {
                previousQuality = curQ;
            }
            if (typeof player.setPlaybackQualityRange === 'function') {
                player.setPlaybackQualityRange('tiny', 'tiny');
            }
            if (typeof player.setPlaybackQuality === 'function') {
                player.setPlaybackQuality('tiny');
            }
        } catch (e) {}
    } else {
        // Tab hiển thị trở lại: khôi phục chất lượng ban đầu
        if (previousQuality) {
            try {
                if (typeof player.setPlaybackQualityRange === 'function') {
                    player.setPlaybackQualityRange(previousQuality, previousQuality);
                }
                if (typeof player.setPlaybackQuality === 'function') {
                    player.setPlaybackQuality(previousQuality);
                }
            } catch (e) {}
            previousQuality = null;
        }
    }
}

export function initBgTabSaver() {
    if (isListening) return;
    isListening = true;

    document.addEventListener('visibilitychange', handleBgTabChange, false);
}

export function resetBgTabQuality() {
    if (previousQuality) {
        const player = getPlayer();
        if (player) {
            try {
                if (typeof player.setPlaybackQualityRange === 'function') {
                    player.setPlaybackQualityRange(previousQuality, previousQuality);
                }
                if (typeof player.setPlaybackQuality === 'function') {
                    player.setPlaybackQuality(previousQuality);
                }
            } catch (e) {}
        }
        previousQuality = null;
    }
}
