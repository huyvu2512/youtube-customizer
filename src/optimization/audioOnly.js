// ==========================================================================
// AUDIO-ONLY MODE (RADIO MODE: HIDE VIDEO RENDERING & LOWER TO 144P)
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { applyPreferredQuality, scheduleApplyQuality } from '../features/qualityManager.js';

let audioBadgeElement = null;
let audioOnlyClickHandlerInitialized = false;

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
        applyPreferredQuality();
        scheduleApplyQuality();
    } else {
        const badge = document.getElementById('ytc-audio-only-badge');
        if (badge) badge.remove();
        audioBadgeElement = null;
        // Restore the user's saved quality preference (including Auto).
        applyPreferredQuality();
        scheduleApplyQuality();
    }
}

function handleAudioOnlyPlayerClick(event) {
    if (!currentConfig.audioOnlyMode || event.defaultPrevented || event.button !== 0) return;
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const player = target?.closest('#movie_player:not(#inline-preview-player)');
    if (!target || !player) return;

    // Let the YouTube controls keep their native behavior (seekbar, settings, buttons).
    if (target.closest('.ytp-chrome-controls, .ytp-chrome-top, .ytp-button, .ytp-popup, .ytp-tooltip, .ytp-panel, .ytp-settings-menu, .ytp-cards-teaser, .ytp-ce-element')) return;

    const playerRect = player.getBoundingClientRect();
    if (event.clientY >= playerRect.bottom - 64) return;

    event.preventDefault();
    event.stopPropagation();
    try {
        const state = typeof player.getPlayerState === 'function' ? player.getPlayerState() : null;
        if (state === 1) player.pauseVideo?.();
        else player.playVideo?.();
    } catch (e) {
        const video = player.querySelector('video');
        if (video) video.paused ? video.play().catch(() => {}) : video.pause();
    }
}

export function initAudioOnly() {
    if (!audioOnlyClickHandlerInitialized) {
        document.addEventListener('click', handleAudioOnlyPlayerClick, true);
        audioOnlyClickHandlerInitialized = true;
    }
    applyAudioOnlyState();
}
