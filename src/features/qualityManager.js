// ==========================================================================
// VIDEO QUALITY MANAGER (ƯU TIÊN CHỌN ĐỘ PHÂN GIẢI VIDEO THEO Ý MUỐN)
// ==========================================================================
import { currentConfig } from '../core/config.js';

let applyTimeoutId = null;
let applyGeneration = 0;
let lastAppliedQualityKey = null;
let isQualityManagerInitialized = false;

function syncQualityToLocalStorage(pref, target) {
    try {
        let qualityNum = 1080;
        if (pref === 'max') qualityNum = 2160;
        else if (pref === '1440p') qualityNum = 1440;
        else if (pref === '1080p') qualityNum = 1080;
        else if (pref === '720p') qualityNum = 720;

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
    if (!currentConfig.preferredQuality || currentConfig.preferredQuality === 'auto') return;
    if (!window.location.pathname.startsWith('/watch')) return;

    const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    if (!player || typeof player.getAvailableQualityLevels !== 'function') return;

    try {
        const rawLevels = player.getAvailableQualityLevels();
        if (!Array.isArray(rawLevels) || rawLevels.length === 0) return;

        const available = rawLevels.filter(q => q && q !== 'auto');
        if (available.length === 0) return;

        const target = pickTargetQuality(available, currentConfig.preferredQuality);
        if (!target) return;

        const current = typeof player.getPlaybackQuality === 'function' ? player.getPlaybackQuality() : null;
        if (current === target) return;

        if (typeof player.setPlaybackQualityRange === 'function') {
            player.setPlaybackQualityRange(target, target);
        }
        if (typeof player.setPlaybackQuality === 'function') {
            player.setPlaybackQuality(target);
        }

        syncQualityToLocalStorage(currentConfig.preferredQuality, target);
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
    if (!currentConfig.preferredQuality || currentConfig.preferredQuality === 'auto') return;
    if (!window.location.pathname.startsWith('/watch')) return;

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
                        syncQualityToLocalStorage(currentConfig.preferredQuality, target);
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
