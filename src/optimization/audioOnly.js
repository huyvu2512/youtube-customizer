// ==========================================================================
// AUDIO-ONLY MODE (RADIO MODE: HIDE VIDEO RENDERING & LOWER TO 144P)
// ==========================================================================
import { currentConfig } from '../core/config.js';

let audioBadgeElement = null;

function getPlayer() {
    return document.querySelector('#movie_player:not(#inline-preview-player)');
}

function ensureAudioBadge(player) {
    if (!player) return;
    if (document.getElementById('ytc-audio-only-badge')) return;

    audioBadgeElement = document.createElement('div');
    audioBadgeElement.id = 'ytc-audio-only-badge';
    audioBadgeElement.textContent = 'Chỉ phát âm thanh';
    player.appendChild(audioBadgeElement);
}

export function applyAudioOnlyState() {
    const isAudioOnly = !!currentConfig.audioOnlyMode;
    const root = document.documentElement;
    const body = document.body;

    root.classList.toggle('ytc-audio-only', isAudioOnly);
    if (body) body.classList.toggle('ytc-audio-only', isAudioOnly);

    const player = getPlayer();
    if (isAudioOnly) {
        if (player) {
            ensureAudioBadge(player);
            try {
                if (typeof player.setPlaybackQualityRange === 'function') {
                    player.setPlaybackQualityRange('tiny', 'tiny');
                }
                if (typeof player.setPlaybackQuality === 'function') {
                    player.setPlaybackQuality('tiny');
                }
            } catch (e) {}
        }
    } else {
        const badge = document.getElementById('ytc-audio-only-badge');
        if (badge) badge.remove();
        audioBadgeElement = null;
        if (player) {
            try {
                if (typeof player.setPlaybackQualityRange === 'function') {
                    player.setPlaybackQualityRange('auto', 'default');
                }
                if (typeof player.setPlaybackQuality === 'function') {
                    player.setPlaybackQuality('auto');
                }
            } catch (e) {}
        }
    }
}

export function initAudioOnly() {
    applyAudioOnlyState();
}
