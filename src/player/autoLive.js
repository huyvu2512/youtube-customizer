// ==========================================================================
// TỰ ĐỘNG GIỮ MỐC TRỰC TIẾP (AUTO LIVE SYNC)
// ==========================================================================
import { currentConfig } from '../core/config.js';

let autoLiveSyncTimer = null;
let lastSnapTime = 0;
let lastUserSeekTime = 0;
let userIsRewound = false;

export function recordUserSeek() {
    lastUserSeekTime = Date.now();
    userIsRewound = true;
}

function isCurrentlyActiveLive(player) {
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
    return false;
}

export function initAutoLiveSync() {
    if (autoLiveSyncTimer) return;

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

        let delay = 0;
        try {
            if (video.seekable && video.seekable.length > 0) {
                const liveEdge = video.seekable.end(video.seekable.length - 1);
                if (isFinite(liveEdge) && isFinite(video.currentTime)) {
                    delay = Math.max(0, liveEdge - video.currentTime);
                }
            }
        } catch (e) {}

        // Nếu người dùng đang chủ động tua xem lại quá khứ (delay > 15s): không tự kéo về
        if (userIsRewound || delay > 15.0) {
            if (delay <= 3.0) {
                userIsRewound = false;
            } else {
                if (video.playbackRate === 1.08) {
                    video.playbackRate = 1.0;
                }
                return;
            }
        }

        if (Date.now() - lastUserSeekTime < 10000) return;

        const isBadgeBehind = !liveBadge.hasAttribute('disabled');
        const isBehind = isBadgeBehind || delay > 2.5;

        if (!isBehind) {
            if (video.playbackRate === 1.08) {
                video.playbackRate = 1.0;
            }
            return;
        }

        const now = Date.now();

        // Chậm đáng kể (> 5.5s đến 15s): Bấm nút Trực tiếp để bắt kịp
        if (delay > 5.5 || (isBadgeBehind && delay > 3.5)) {
            if (now - lastSnapTime > 5000) {
                lastSnapTime = now;
                try {
                    liveBadge.click();
                } catch (e) {}
                if (video.playbackRate === 1.08) {
                    video.playbackRate = 1.0;
                }
            }
        }
        // Chậm nhẹ (2.0s - 5.5s): Tăng tốc độ phát 1.08x để bắt kịp êm ái
        else if (delay > 2.0) {
            if (video.playbackRate === 1.0) {
                video.playbackRate = 1.08;
            }
        }
    }

    autoLiveSyncTimer = setInterval(checkLiveSync, 1500);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && currentConfig.autoLiveSync) {
            setTimeout(checkLiveSync, 300);
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.ytp-live-badge')) {
            userIsRewound = false;
            lastUserSeekTime = 0;
            lastSnapTime = Date.now();
        }
        if (e.target.closest('.ytp-progress-bar')) {
            recordUserSeek();
        }
    }, true);
}
