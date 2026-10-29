// ==========================================================================
// AUDIO-ONLY MODE (RADIO MODE: HIDE VIDEO RENDERING & LOWER TO 144P)
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { scheduleApplyQuality } from '../features/qualityManager.js';

let audioBadgeElement = null;
let lastQualityMode = null;

function getPlayer() {
    return document.querySelector('#movie_player:not(#inline-preview-player)');
}

function ensureAudioBadge(player) {
    if (!player) return;
    if (document.getElementById('ytc-audio-only-badge')) return;

    audioBadgeElement = document.createElement('div');
    audioBadgeElement.id = 'ytc-audio-only-badge';
    audioBadgeElement.innerHTML = `
        <div class="ytc-audio-badge-title">Đang phát ở Chế độ Chỉ Âm Thanh</div>
        <div class="ytc-audio-badge-sub">Đã tắt video để tiết kiệm tài nguyên</div>
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
        }
    } else {
        const badge = document.getElementById('ytc-audio-only-badge');
        if (badge) badge.remove();
        audioBadgeElement = null;
    }

    // Only a mode transition should request a quality change. Other settings
    // updates must not override a resolution the user chose in YouTube.
    if (lastQualityMode !== isAudioOnly) {
        lastQualityMode = isAudioOnly;
        scheduleApplyQuality({ force: true });
    }
}

export function initAudioOnly() {
    applyAudioOnlyState();
}
