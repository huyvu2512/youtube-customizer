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
    audioBadgeElement.className = 'ytc-audio-badge';
    audioBadgeElement.innerHTML = `
        <div class="ytc-audio-badge-content">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <div class="ytc-audio-badge-title">Chế độ Chỉ phát âm thanh (Radio)</div>
            <div class="ytc-audio-badge-sub">Đã ngắt render video & hạ chất lượng để tiết kiệm GPU/RAM tối đa</div>
        </div>
    `;
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
    }
}

export function initAudioOnly() {
    applyAudioOnlyState();
}
