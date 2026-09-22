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

    // 1. Ưu tiên click nút "Trực tiếp" / "LIVE" chính thức của YouTube player
    // YouTube sẽ tự đồng bộ buffer và audio mà không bị đè tiếng
    const liveBadge = player.querySelector('.ytp-live-badge');
    if (liveBadge) {
        try {
            liveBadge.click();
            return;
        } catch (e) {}
    }

    // 2. Dự phòng: chỉ gọi seekTo nếu không có liveBadge để tránh xung đột 2 lệnh seek gây đè tiếng
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

    const delay = getLiveDelay(player, video);

    // Nếu người dùng đang CHỦ ĐỘNG tua xem lại quá khứ:
    // Tuyệt đối không tự ép kéo về mốc live! Để người dùng tự do xem lại.
    if (userIsRewound) {
        if (delay <= 5.0) {
            userIsRewound = false; // Đã xem lại tới sát mốc trực tiếp
        } else {
            if (video.playbackRate !== 1.0) {
                video.playbackRate = 1.0;
            }
            return;
        }
    }

    // Vừa tương tác tua thủ công gần đây (< 8s) -> tạm hoãn để người dùng xem mượt
    if (Date.now() - lastUserSeekTime < 8000) return;

    const now = Date.now();

    // 1. Chậm rất nặng (> 20s, ví dụ bị tụt về 0:00 ban đầu hoặc lag mạng lâu):
    // Snap về trực tiếp một lần, cooldown ít nhất 15s để buffer ổn định không snap liên tục
    if (delay > 20.0) {
        if (now - lastSnapTime > 15000) {
            lastSnapTime = now;
            snapToLive(player);
            if (video.playbackRate !== 1.0) {
                video.playbackRate = 1.0;
            }
        }
        return;
    }

    // 2. Chậm vừa phải (8s - 20s): Tăng nhẹ tốc độ 1.06x để bắt kịp êm ái, KHÔNG snap gây giật lặp âm thanh
    if (delay > 8.0) {
        if (video.playbackRate !== 1.06) {
            video.playbackRate = 1.06;
        }
        return;
    }

    // 3. Trong ngưỡng độ trễ tự nhiên bình thường của YouTube (<= 8s):
    // Giữ nguyên tốc độ chuẩn 1.0x, tuyệt đối không can thiệp hay seek
    if (video.playbackRate !== 1.0) {
        video.playbackRate = 1.0;
    }
}

let initialSnapTimer = null;
export function checkInitialLiveSnap() {
    if (initialSnapTimer) {
        clearInterval(initialSnapTimer);
        initialSnapTimer = null;
    }
    let attempts = 0;
    initialSnapTimer = setInterval(() => {
        attempts++;
        const player = document.querySelector('#movie_player, .html5-video-player');
        if (player && isCurrentlyActiveLive(player)) {
            const video = player.querySelector('video');
            if (video && !video.paused) {
                clearInterval(initialSnapTimer);
                initialSnapTimer = null;
                if (!userIsRewound && currentConfig.autoLiveSync) {
                    const delay = getLiveDelay(player, video);
                    // Chỉ snap nếu ban đầu video bị tụt sâu về 0:00 (> 25s)
                    if (delay > 25.0) {
                        lastSnapTime = Date.now();
                        snapToLive(player);
                    }
                }
                return;
            }
        }
        if (attempts >= 15) {
            clearInterval(initialSnapTimer);
            initialSnapTimer = null;
        }
    }, 500);
}

export function initAutoLiveSync() {
    if (autoLiveSyncTimer) return;

    autoLiveSyncTimer = setInterval(checkLiveSync, 2000);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && currentConfig.autoLiveSync) {
            setTimeout(checkLiveSync, 500);
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
                if (delay > 15.0) {
                    userIsRewound = true;
                } else {
                    userIsRewound = false;
                }
            }, 300);
        }
    }, true);

    document.addEventListener('yt-navigate-start', resetAutoLiveState);
    document.addEventListener('yt-navigate-finish', () => {
        resetAutoLiveState();
        checkInitialLiveSnap();
    });
}
