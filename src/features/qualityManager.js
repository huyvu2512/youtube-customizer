// ==========================================================================
// VIDEO QUALITY MANAGER (ƯU TIÊN CHỌN ĐỘ PHÂN GIẢI VIDEO THEO Ý MUỐN)
// ==========================================================================
import { currentConfig } from '../core/config.js';

let applyTimeoutId = null;
let applyGeneration = 0;
let lastAppliedQualityKey = null;
let isQualityManagerInitialized = false;

function syncQualityToLocalStorage(target) {
    try {
        const qualityNumbers = {
            highres: 4320,
            hd2880: 2880,
            hd2160: 2160,
            hd1440: 1440,
            hd1080: 1080,
            hd720: 720,
            large: 480,
            medium: 360,
            small: 240,
            tiny: 144
        };
        const qualityNum = qualityNumbers[target];
        if (!qualityNum) return;

        const payload = {
            data: JSON.stringify({ quality: qualityNum, previousQuality: qualityNum }),
            creation: Date.now(),
            expiration: Date.now() + 2592000000
        };
        localStorage.setItem('yt-player-quality', JSON.stringify(payload));
    } catch (e) {}
}

/**
 * Lựa chọn độ phân giải tốt nhất từ danh sách available theo cấu hình
 */
function pickTargetQuality(available, pref) {
    if (!available || available.length === 0) return null;

    if (currentConfig.audioOnlyMode) {
        // Prefer YouTube's lowest rung; fall back to the lowest available rung.
        return available.includes('tiny') ? 'tiny' : available[available.length - 1];
    }

    if (pref === 'max') {
        // available được YouTube sắp xếp theo thứ tự giảm dần
        return available[0];
    }

    if (pref === '1440p') {
        const order = ['hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
        return order.find(q => available.includes(q)) || available[0];
    }

    if (pref === '1080p') {
        const order = ['hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
        return order.find(q => available.includes(q)) || available[available.length - 1];
    }

    if (pref === '720p') {
        const order = ['hd720', 'large', 'medium', 'small', 'tiny'];
        return order.find(q => available.includes(q)) || available[available.length - 1];
    }

    return null;
}

/**
 * Ép độ phân giải mong muốn vào trình phát YouTube
 */
export function applyPreferredQuality() {
    if (!window.location.pathname.startsWith('/watch')) return;

    const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    if (!player || typeof player.getAvailableQualityLevels !== 'function') return;

    try {
        if (!currentConfig.audioOnlyMode && (!currentConfig.preferredQuality || currentConfig.preferredQuality === 'auto')) {
            if (typeof player.setPlaybackQualityRange === 'function') {
                player.setPlaybackQualityRange('auto', 'default');
            }
            if (typeof player.setPlaybackQuality === 'function') player.setPlaybackQuality('auto');
            const videoId = player.getVideoData?.()?.video_id || new URL(window.location.href).searchParams.get('v');
            lastAppliedQualityKey = `${videoId || 'watch'}:auto:auto`;
            return;
        }

        const rawLevels = player.getAvailableQualityLevels();
        if (!Array.isArray(rawLevels) || rawLevels.length === 0) return;

        const available = rawLevels.filter(q => q && q !== 'auto');
        if (available.length === 0) return;

        const target = pickTargetQuality(available, currentConfig.preferredQuality);
        if (!target) return;

        const current = typeof player.getPlaybackQuality === 'function' ? player.getPlaybackQuality() : null;
        if (current === target && !currentConfig.audioOnlyMode) return;

        if (typeof player.setPlaybackQualityRange === 'function') {
            player.setPlaybackQualityRange(target, target);
        }
        if (typeof player.setPlaybackQuality === 'function') {
            player.setPlaybackQuality(target);
        }

        if (!currentConfig.audioOnlyMode) {
            syncQualityToLocalStorage(target);
        }
        const videoId = player.getVideoData?.()?.video_id || new URL(window.location.href).searchParams.get('v');
        lastAppliedQualityKey = `${videoId || 'watch'}:${currentConfig.preferredQuality || 'auto'}:${target}`;
    } catch (err) {}
}

/**
 * Schedule quality application for the active video, retrying until the player
 * reports the requested level or the bounded retry window expires.
 */
export function scheduleApplyQuality() {
    if (applyTimeoutId !== null) {
        clearTimeout(applyTimeoutId);
        applyTimeoutId = null;
    }
    const generation = ++applyGeneration;
    if (!window.location.pathname.startsWith('/watch')) return;
    if (!currentConfig.audioOnlyMode && (!currentConfig.preferredQuality || currentConfig.preferredQuality === 'auto')) {
        const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        const videoId = player?.getVideoData?.()?.video_id || new URL(window.location.href).searchParams.get('v');
        const qualityKey = `${videoId || 'watch'}:auto:auto`;
        if (lastAppliedQualityKey !== qualityKey) applyPreferredQuality();
        return;
    }

    const expectedVideoId = new URL(window.location.href).searchParams.get('v');
    let attempts = 0;
    let applyIssued = false;
    let retryIssued = false;
    const maxAttempts = 30;
    const tryApply = () => {
        if (generation !== applyGeneration) return;
        attempts++;
        const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        if (player && typeof player.getAvailableQualityLevels === 'function') {
            try {
                const playerVideoId = typeof player.getVideoData === 'function'
                    ? player.getVideoData()?.video_id
                    : null;
                const videoId = playerVideoId || expectedVideoId;

                // During SPA navigation the old player can remain alive briefly.
                if (expectedVideoId && playerVideoId && playerVideoId !== expectedVideoId) {
                    scheduleRetry();
                    return;
                }

                const levels = player.getAvailableQualityLevels();
                const available = Array.isArray(levels) ? levels.filter(q => q && q !== 'auto') : [];
                const target = pickTargetQuality(available, currentConfig.preferredQuality);
                if (target) {
                    const qualityKey = `${videoId || 'watch'}:${currentConfig.preferredQuality}:${target}`;
                    const current = typeof player.getPlaybackQuality === 'function'
                        ? player.getPlaybackQuality()
                        : null;
                    const needsApply = current !== target || lastAppliedQualityKey !== qualityKey;

                    if (needsApply && (!applyIssued || (attempts >= 6 && !retryIssued))) {
                        if (typeof player.setPlaybackQualityRange === 'function') {
                            player.setPlaybackQualityRange(target, target);
                        }
                        if (typeof player.setPlaybackQuality === 'function') {
                            player.setPlaybackQuality(target);
                        }
                        if (!currentConfig.audioOnlyMode) {
                            syncQualityToLocalStorage(target);
                        }
                        lastAppliedQualityKey = qualityKey;
                        if (applyIssued) retryIssued = true;
                        applyIssued = true;
                    }

                    // Do not stop on a non-empty manifest; wait until the player reports the target.
                    if (current === target && lastAppliedQualityKey === qualityKey) {
                        applyTimeoutId = null;
                        return;
                    }
                }
            } catch (err) {}
        }

        scheduleRetry();
    };

    function scheduleRetry() {
        if (attempts < maxAttempts && generation === applyGeneration) {
            applyTimeoutId = setTimeout(tryApply, 400);
        } else {
            applyTimeoutId = null;
        }
    }

    // Wait for the new video's data and quality list, then verify the requested level.
    applyTimeoutId = setTimeout(tryApply, 400);
}

/**
 * Khởi tạo trình lắng nghe điều phối độ phân giải video
 */
export function initQualityManager() {
    if (isQualityManagerInitialized) return;
    isQualityManagerInitialized = true;

    window.addEventListener('yt-navigate-finish', scheduleApplyQuality);
    window.addEventListener('yt-page-data-updated', scheduleApplyQuality);

    document.addEventListener('loadedmetadata', (e) => {
        if (e.target && e.target.tagName === 'VIDEO') {
            scheduleApplyQuality();
        }
    }, true);

    document.addEventListener('playing', (e) => {
        if (e.target && e.target.tagName === 'VIDEO') {
            scheduleApplyQuality();
        }
    }, true);

    if (window.location.pathname.startsWith('/watch')) {
        scheduleApplyQuality();
    }
}
