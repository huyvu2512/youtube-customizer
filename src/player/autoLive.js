// ==========================================================================
// TỰ ĐỘNG GIỮ MỐC TRỰC TIẾP (AUTO LIVE SYNC)
// ==========================================================================
import { currentConfig } from '../core/config.js';

let autoLiveSyncTimer = null;
let lastSnapTime = 0;
let lastUserSeekTime = 0;
let userIsRewound = false;

export function resetAutoLiveState() {
    userIsRewound = false;
    lastUserSeekTime = 0;
    lastSnapTime = 0;
}

export function recordUserSeek() {
    lastUserSeekTime = Date.now();
    userIsRewound = true;
}

export function snapToLive(player) {
    if (!player) player = document.querySelector('#movie_player, .html5-video-player');
    if (!player) return;

    // 1. Nhấp trực tiếp vào badge "Trực tiếp" / "LIVE" của YouTube player
    const liveBadge = player.querySelector('.ytp-live-badge');
    if (liveBadge) {
        try { liveBadge.click(); } catch (e) {}
    }

    // 2. Gọi API chính thức của YouTube player để nhảy tới điểm trực tiếp mới nhất
    try {
        if (typeof player.seekToStreamTime === 'function') {
            player.seekToStreamTime(Infinity);
        } else if (typeof player.seekTo === 'function') {
            player.seekTo(Infinity, true);
        }
    } catch (e) {}
}

export function isCurrentlyActiveLive(player) {
    if (!player) return false;
    if (typeof player.getVideoData === 'function') {
        const vd = player.getVideoData();
        if (vd) {
            if (vd.isLive === true) return true;
            if (vd.isLive === false) return false;
        }
    }
    if (typeof player.isLive === 'function') {
        try {
            if (player.isLive() === true) return true;
        } catch (e) {}
    }
    if (player.classList.contains('ytp-live') || !!player.querySelector('.ytp-live-badge')) {
        return true;
    }
    if (location.pathname.startsWith('/live/')) {
        return true;
    }
    return false;
}

function getLiveDelay(player, video) {
    if (!video) return 0;
    try {
        if (video.seekable && video.seekable.length > 0) {
            const liveEdge = video.seekable.end(video.seekable.length - 1);
            if (isFinite(liveEdge) && isFinite(video.currentTime)) {
                return Math.max(0, liveEdge - video.currentTime);
            }
        }
    } catch (e) {}
    return 0;
}

function checkLiveSync() {
    if (!currentConfig.autoLiveSync) return;

    const player = document.querySelector('#movie_player, .html5-video-player');
    if (!player) return;

    // Chỉ chạy khi đang là luồng phát trực tiếp theo thời gian thực (chưa kết thúc)
    if (!isCurrentlyActiveLive(player)) {
        return;
    }

    const video = player.querySelector('video');
    if (!video || video.paused || video.ended) return;

    const liveBadge = player.querySelector('.ytp-live-badge');
    if (!liveBadge) return;

    const delay = getLiveDelay(player, video);

    // Nếu người dùng đang CHỦ ĐỘNG tua xem lại quá khứ:
    // Tuyệt đối không tự ép kéo về mốc live! Để người dùng tự do xem lại.
    if (userIsRewound) {
        if (delay <= 3.0) {
            userIsRewound = false; // Đã xem lại tới sát mốc trực tiếp
        } else {
            if (video.playbackRate === 1.08) {
                video.playbackRate = 1.0;
            }
            return;
        }
    }

    // Vừa tương tác tua thủ công gần đây (< 8s) -> tạm hoãn để người dùng xem mượt
    if (Date.now() - lastUserSeekTime < 8000) return;

    const isBadgeBehind = !liveBadge.hasAttribute('disabled');
    const isBehind = isBadgeBehind || delay > 2.5;

    if (!isBehind) {
        if (video.playbackRate === 1.08) {
            video.playbackRate = 1.0;
        }
        return;
    }

    const now = Date.now();

    // Chậm đáng kể (> 5.0s hoặc bị đẩy về 0:00 ban đầu): Lập tức snap về trực tiếp
    if (delay > 5.0 || (isBadgeBehind && delay > 3.0)) {
        if (now - lastSnapTime > 4000) {
            lastSnapTime = now;
            snapToLive(player);
            if (video.playbackRate === 1.08) {
                video.playbackRate = 1.0;
            }
        }
    }
    // Chậm nhẹ (2.0s - 5.0s): Tăng tốc độ phát 1.08x để bắt kịp êm ái
    else if (delay > 2.0) {
        if (video.playbackRate === 1.0) {
            video.playbackRate = 1.08;
        }
    }
}

export function checkInitialLiveSnap() {
    let attempts = 0;
    const interval = setInterval(() => {
        attempts++;
        const player = document.querySelector('#movie_player, .html5-video-player');
        if (player && isCurrentlyActiveLive(player)) {
            const video = player.querySelector('video');
            if (video && !video.paused) {
                clearInterval(interval);
                if (!userIsRewound && currentConfig.autoLiveSync) {
                    const delay = getLiveDelay(player, video);
                    const liveBadge = player.querySelector('.ytp-live-badge');
                    const isBadgeBehind = liveBadge && !liveBadge.hasAttribute('disabled');
                    if (delay > 3.5 || isBadgeBehind) {
                        snapToLive(player);
                    }
                }
                return;
            }
        }
        if (attempts >= 15) {
            clearInterval(interval);
        }
    }, 400);
}

export function initAutoLiveSync() {
    if (autoLiveSyncTimer) return;

    autoLiveSyncTimer = setInterval(checkLiveSync, 1500);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && currentConfig.autoLiveSync) {
            setTimeout(checkLiveSync, 300);
        }
    });

    document.addEventListener('click', (e) => {
        // Nhấp vào badge "Trực tiếp" -> hủy chế độ xem lại, ép về trực tiếp
        if (e.target.closest('.ytp-live-badge')) {
            userIsRewound = false;
            lastUserSeekTime = 0;
            lastSnapTime = Date.now();
            const player = document.querySelector('#movie_player, .html5-video-player');
            snapToLive(player);
        }

        // Nhấp vào thanh tiến trình
        if (e.target.closest('.ytp-progress-bar')) {
            lastUserSeekTime = Date.now();
            setTimeout(() => {
                const player = document.querySelector('#movie_player, .html5-video-player');
                if (!player) return;
                const video = player.querySelector('video');
                const delay = getLiveDelay(player, video);
                const liveBadge = player.querySelector('.ytp-live-badge');
                const isBadgeBehind = liveBadge && !liveBadge.hasAttribute('disabled');
                if (delay > 5.0 || isBadgeBehind) {
                    userIsRewound = true;
                } else {
                    userIsRewound = false;
                }
            }, 250);
        }
    }, true);

    document.addEventListener('yt-navigate-start', resetAutoLiveState);
    document.addEventListener('yt-navigate-finish', () => {
        resetAutoLiveState();
        checkInitialLiveSnap();
    });
}
