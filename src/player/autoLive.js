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
    // YouTube sẽ tự đồng bộ buffer và audio mượt mà theo đúng chuẩn native
    const liveBadge = player.querySelector('.ytp-live-badge');
    if (liveBadge) {
        try {
            liveBadge.click();
            return;
        } catch (e) {}
    }

    // 2. Dự phòng: chỉ gọi seekTo nếu không tìm thấy liveBadge
    try {
        if (typeof player.seekToStreamTime === 'function') {
            player.seekToStreamTime(Infinity);
        } else if (typeof player.seekTo === 'function') {
            player.seekTo(Infinity, true);
        }
    } catch (e) {}
}

export function isCurrentlyActiveLive(player) {
    if (!player) player = document.querySelector('#movie_player, .html5-video-player');
    if (!player) return false;

    // 1. Kiểm tra class trên player hoặc sự hiện diện của badge Trực tiếp
    if (player.classList.contains('ytp-live') || !!player.querySelector('.ytp-live-badge')) {
        return true;
    }

    // 2. Kiểm tra URL /live/
    if (location.pathname.startsWith('/live/')) {
        return true;
    }

    // 3. Kiểm tra API player
    if (typeof player.getVideoData === 'function') {
        const vd = player.getVideoData();
        if (vd) {
            // Nếu đã kết thúc live (PostLiveDvr) thì không phải đang phát trực tiếp
            if (vd.isPostLiveDvr) return false;
            // Hỗ trợ cả live thông thường và Live DVR (tua lại)
            if (vd.isLive || vd.isLiveDvr) return true;
        }
    }

    if (typeof player.isLive === 'function') {
        try {
            if (player.isLive() === true) return true;
        } catch (e) {}
    }

    // 4. Kiểm tra cấu trúc DOM trang YouTube (ytd-watch-flexy có attribute is-live hoặc live chat frame)
    if (document.querySelector('ytd-watch-flexy[is-live], ytd-live-chat-frame#chat:not([hidden])')) {
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

    // 1. Chậm nghiêm trọng (> 12s, ví dụ bị tụt về 0:00 ban đầu hoặc lag mạng lâu):
    // Snap về trực tiếp, cooldown ít nhất 10s để buffer ổn định
    if (delay > 12.0) {
        if (now - lastSnapTime > 10000) {
            lastSnapTime = now;
            snapToLive(player);
            if (video.playbackRate !== 1.0) {
                video.playbackRate = 1.0;
            }
        }
        return;
    }

    // 2. Chậm vừa phải (7s - 12s): Tăng nhẹ tốc độ 1.06x để bắt kịp êm ái, KHÔNG snap gây giật lặp âm thanh
    if (delay > 7.0) {
        if (video.playbackRate !== 1.06) {
            video.playbackRate = 1.06;
        }
        return;
    }

    // 3. Trong ngưỡng độ trễ tự nhiên bình thường của YouTube (<= 7s):
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
                const delay = getLiveDelay(player, video);
                // Nếu khi vừa vào video bị kẹt ở mốc cũ (> 10s hoặc ở 0:00) -> đưa về trực tiếp ngay!
                if (!userIsRewound && delay > 10.0) {
                    clearInterval(initialSnapTimer);
                    initialSnapTimer = null;
                    lastSnapTime = Date.now();
                    snapToLive(player);
                    return;
                }
                // Nếu video đã ở mốc trực tiếp bình thường (delay <= 10s) -> dừng check
                if (delay <= 10.0) {
                    clearInterval(initialSnapTimer);
                    initialSnapTimer = null;
                    return;
                }
            }
        }
        if (attempts >= 25) {
            clearInterval(initialSnapTimer);
            initialSnapTimer = null;
        }
    }, 300);
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
