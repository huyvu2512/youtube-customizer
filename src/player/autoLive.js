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

    // Tuyệt đối không can thiệp nếu không phải luồng trực tiếp đang phát sóng
    if (!isCurrentlyActiveLive(player)) return;

    // 1. Ưu tiên click nút "Trực tiếp" / "LIVE" chính thức của YouTube player (chỉ khi nút đang hiển thị)
    // YouTube sẽ tự đồng bộ buffer và audio mượt mà theo đúng chuẩn native
    const liveBadge = player.querySelector('.ytp-live-badge');
    if (liveBadge && liveBadge.offsetParent !== null && window.getComputedStyle(liveBadge).display !== 'none') {
        try {
            liveBadge.click();
            return;
        } catch (e) {}
    }

    // 2. Dự phòng an toàn: chỉ gọi seekToStreamTime nếu player có hỗ trợ và đang là live thật sự
    try {
        if (typeof player.seekToStreamTime === 'function') {
            player.seekToStreamTime(Infinity);
        }
    } catch (e) {}
}

export function isCurrentlyActiveLive(player) {
    if (!player) player = document.querySelector('#movie_player, .html5-video-player');
    if (!player) return false;

    // 1. Kiểm tra API player.getVideoData() - Nguồn thông tin chính xác nhất của YouTube
    if (typeof player.getVideoData === 'function') {
        const vd = player.getVideoData();
        if (vd) {
            // Live đã kết thúc (PostLiveDvr) -> Chắc chắn là video xem lại, KHÔNG phải đang trực tiếp
            if (vd.isPostLiveDvr === true) return false;

            // Video thường (isLive: false và không phải Live DVR) -> Không phải trực tiếp
            if (vd.isLive === false && !vd.isLiveDvr) return false;

            // Đang phát trực tiếp (Live thông thường hoặc Premiere đang chiếu)
            if (vd.isLive === true && !vd.isPostLiveDvr) return true;
        }
    }

    // 2. Kiểm tra API player.isLive() của YouTube player
    if (typeof player.isLive === 'function') {
        try {
            const live = player.isLive();
            // Nếu player.isLive() trả về false -> 100% không phải trực tiếp
            if (live === false) return false;
            if (live === true) return true;
        } catch (e) {}
    }

    // 3. Kiểm tra class 'ytp-live' trên movie_player
    // YouTube LUÔN gắn class 'ytp-live' khi video đang phát sóng trực tiếp
    // Khi live kết thúc chuyển sang video xem lại, class 'ytp-live' sẽ lập tức bị xóa
    const hasLiveClass = player.classList.contains('ytp-live');
    if (!hasLiveClass) {
        return false;
    }

    // 4. Kiểm tra nút Live Badge (.ytp-live-badge) có đang THỰC SỰ HIỂN THỊ
    // (Trên video thường hoặc live đã kết thúc, nút này bị ẩn display: none)
    const liveBadge = player.querySelector('.ytp-live-badge');
    const isBadgeVisible = !!(liveBadge && liveBadge.offsetParent !== null && window.getComputedStyle(liveBadge).display !== 'none');
    if (!isBadgeVisible) {
        return false;
    }

    return true;
}

function getLiveDelay(player, video) {
    if (!video) return 0;
    if (!isCurrentlyActiveLive(player)) return 0;
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
        if (player) {
            if (typeof player.getVideoData === 'function') {
                const vd = player.getVideoData();
                if (vd && (vd.isPostLiveDvr === true || (vd.isLive === false && !vd.isLiveDvr))) {
                    // Video xem lại hoặc video thường -> lập tức dừng timer, giữ nguyên vị trí xem của người dùng
                    clearInterval(initialSnapTimer);
                    initialSnapTimer = null;
                    return;
                }
            }

            if (isCurrentlyActiveLive(player)) {
                const video = player.querySelector('video');
                if (video && !video.paused) {
                    const delay = getLiveDelay(player, video);
                    // Nếu khi vừa vào video live bị kẹt ở mốc cũ (> 10s hoặc ở 0:00) -> đưa về trực tiếp ngay!
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
        // Nhấp vào badge "Trực tiếp" -> chỉ xử lý khi đang xem live stream thật sự
        if (e.target.closest('.ytp-live-badge')) {
            const player = document.querySelector('#movie_player, .html5-video-player');
            if (player && isCurrentlyActiveLive(player)) {
                userIsRewound = false;
                lastUserSeekTime = 0;
                lastSnapTime = Date.now();
                snapToLive(player);
            }
        }

        // Nhấp vào thanh tiến trình -> chỉ theo dõi trạng thái tua lại nếu đang xem live
        if (e.target.closest('.ytp-progress-bar')) {
            const player = document.querySelector('#movie_player, .html5-video-player');
            if (!player || !isCurrentlyActiveLive(player)) return;

            lastUserSeekTime = Date.now();
            setTimeout(() => {
                const p = document.querySelector('#movie_player, .html5-video-player');
                if (!p || !isCurrentlyActiveLive(p)) return;
                const video = p.querySelector('video');
                const delay = getLiveDelay(p, video);
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
