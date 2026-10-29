// ===========================================================================
// VIDEO QUALITY: APPLY THE SAVED PREFERENCE ONCE PER VIDEO
// ===========================================================================
import { currentConfig } from '../core/config.js';

let applyTimeoutId = null;
let applyGeneration = 0;
let lastAppliedQualityKey = null;
let isQualityManagerInitialized = false;

function getPlayer() {
    return document.getElementById('movie_player') || document.querySelector('.html5-video-player');
}

function getVideoId(player = getPlayer()) {
    try {
        const id = player?.getVideoData?.()?.video_id;
        if (id) return id;
    } catch (e) {}
    return new URL(window.location.href).searchParams.get('v') || '';
}

function getPreferenceKey(videoId) {
    return `${videoId || 'watch'}:${currentConfig.audioOnlyMode ? 'audio-only' : (currentConfig.preferredQuality || 'auto')}`;
}

function syncQualityToLocalStorage(target) {
    try {
        const qualityNumbers = {
            highres: 4320, hd2880: 2880, hd2160: 2160, hd1440: 1440,
            hd1080: 1080, hd720: 720, large: 480, medium: 360,
            small: 240, tiny: 144
        };
        const qualityNum = qualityNumbers[target];
        if (!qualityNum) return;
        const now = Date.now();
        localStorage.setItem('yt-player-quality', JSON.stringify({
            data: JSON.stringify({ quality: qualityNum, previousQuality: qualityNum }),
            creation: now,
            expiration: now + 2592000000
        }));
    } catch (e) {}
}

function pickTargetQuality(available, pref) {
    if (!available?.length) return null;
    if (currentConfig.audioOnlyMode) return available.includes('tiny') ? 'tiny' : available[available.length - 1];
    if (pref === 'max') return available[0];

    const orderByPreference = {
        '1440p': ['hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'],
        '1080p': ['hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'],
        '720p': ['hd720', 'large', 'medium', 'small', 'tiny']
    };
    const order = orderByPreference[pref];
    return order ? (order.find(level => available.includes(level)) || available[available.length - 1]) : null;
}

function getBufferedAhead(video) {
    if (!video) return 0;
    try {
        const time = video.currentTime;
        for (let i = 0; i < video.buffered.length; i++) {
            if (video.buffered.start(i) <= time && video.buffered.end(i) >= time) {
                return video.buffered.end(i) - time;
            }
        }
    } catch (e) {}
    return 0;
}

function hasEnoughStartupBuffer(player, video, attempts) {
    if (!video || video.readyState >= 4) return true;
    if (video.readyState < 3) return false;
    let isLive = false;
    try { isLive = !!player?.getVideoData?.()?.isLive; } catch (e) {}
    return isLive || getBufferedAhead(video) >= 1.5 || attempts >= 28;
}

function applyTargetOnce(player, target, videoId, preferenceKey) {
    const current = typeof player.getPlaybackQuality === 'function' ? player.getPlaybackQuality() : null;

    // Do not lock YouTube's quality range: the user can choose a higher
    // resolution manually after this initial preference has been applied.
    if (current !== target && typeof player.setPlaybackQuality === 'function') {
        player.setPlaybackQuality(target);
    }
    if (target !== 'auto' && !currentConfig.audioOnlyMode) syncQualityToLocalStorage(target);
    lastAppliedQualityKey = preferenceKey || getPreferenceKey(videoId);
}

/** Applies the configured quality once immediately, for explicit user actions. */
export function applyPreferredQuality() {
    if (!window.location.pathname.startsWith('/watch')) return false;
    const player = getPlayer();
    if (!player || typeof player.getAvailableQualityLevels !== 'function') return false;

    try {
        const videoId = getVideoId(player);
        const pref = currentConfig.preferredQuality || 'auto';
        if (!currentConfig.audioOnlyMode && pref === 'auto') {
            applyTargetOnce(player, 'auto', videoId, getPreferenceKey(videoId));
            return true;
        }
        const levels = player.getAvailableQualityLevels();
        const available = Array.isArray(levels) ? levels.filter(level => level && level !== 'auto') : [];
        const target = pickTargetQuality(available, pref);
        if (!target) return false;
        applyTargetOnce(player, target, videoId, getPreferenceKey(videoId));
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Waits for usable video data, then applies the preference once. Subsequent
 * player events do not reapply it, so manual quality changes remain untouched.
 */
export function scheduleApplyQuality(options = {}) {
    const force = options === true || !!options.force;
    if (applyTimeoutId !== null) {
        clearTimeout(applyTimeoutId);
        applyTimeoutId = null;
    }
    const generation = ++applyGeneration;
    if (!window.location.pathname.startsWith('/watch')) return;

    const initialPlayer = getPlayer();
    const expectedVideoId = new URL(window.location.href).searchParams.get('v') || getVideoId(initialPlayer);
    const preferenceKey = getPreferenceKey(expectedVideoId);
    if (!force && lastAppliedQualityKey === preferenceKey) return;

    let attempts = 0;
    const maxAttempts = 30;
    const tryApply = () => {
        if (generation !== applyGeneration) return;
        attempts++;

        // The preference may have changed while this startup wait was pending.
        if (getPreferenceKey(expectedVideoId) !== preferenceKey) return;

        const player = getPlayer();
        const playerVideoId = getVideoId(player);
        if (!player || (expectedVideoId && playerVideoId && playerVideoId !== expectedVideoId)) {
            scheduleRetry();
            return;
        }

        try {
            const video = player.querySelector('video.html5-main-video, video');
            if (!hasEnoughStartupBuffer(player, video, attempts)) {
                scheduleRetry();
                return;
            }

            const pref = currentConfig.preferredQuality || 'auto';
            if (!currentConfig.audioOnlyMode && pref === 'auto') {
                applyTargetOnce(player, 'auto', playerVideoId || expectedVideoId, preferenceKey);
                applyTimeoutId = null;
                return;
            }

            const levels = typeof player.getAvailableQualityLevels === 'function'
                ? player.getAvailableQualityLevels()
                : [];
            const available = Array.isArray(levels) ? levels.filter(level => level && level !== 'auto') : [];
            const target = pickTargetQuality(available, pref);
            if (!target) {
                scheduleRetry();
                return;
            }

            applyTargetOnce(player, target, playerVideoId || expectedVideoId, preferenceKey);
            applyTimeoutId = null;
        } catch (e) {
            scheduleRetry();
        }
    };

    function scheduleRetry() {
        if (attempts < maxAttempts && generation === applyGeneration) {
            applyTimeoutId = setTimeout(tryApply, 350);
        } else {
            applyTimeoutId = null;
        }
    }

    applyTimeoutId = setTimeout(tryApply, 250);
}

export function initQualityManager() {
    if (isQualityManagerInitialized) return;
    isQualityManagerInitialized = true;

    window.addEventListener('yt-navigate-start', () => {
        applyGeneration++;
        if (applyTimeoutId !== null) clearTimeout(applyTimeoutId);
        applyTimeoutId = null;
        lastAppliedQualityKey = null;
    });
    window.addEventListener('yt-navigate-finish', () => scheduleApplyQuality());
    window.addEventListener('yt-page-data-updated', () => scheduleApplyQuality());
    document.addEventListener('loadedmetadata', event => {
        if (event.target?.tagName === 'VIDEO') scheduleApplyQuality();
    }, true);

    if (window.location.pathname.startsWith('/watch')) scheduleApplyQuality();
}
