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
    setTimeout(() => {
        const p = document.querySelector('#movie_player:not(#inline-preview-player)');
        if (!p || !isCurrentlyActiveLive(p)) return;
        const video = p.querySelector('video');
        const delay = getLiveDelay(p, video);
        if (delay > 8.0) {
            userIsRewound = true;
        } else {
            userIsRewound = false;
        }
    }, 300);
}

/**
 * Nhảy về mốc phát trực tiếp:
 * - Chỉ dùng seekToStreamTime(Infinity) là đủ, YouTube tự xử lý buffer tối ưu
 * - Tuyệt đối KHÔNG set video.currentTime trùng lặp gây giật video
 */
export function snapToLive(player) {
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;
    if (!player) player = document.querySelector('#movie_player:not(#inline-preview-player)');
    if (!player) return;

    if (!isCurrentlyActiveLive(player)) return;

    try {
        // Ưu tiên API chính thức của YouTube player
        if (typeof player.seekToStreamTime === 'function') {
            player.seekToStreamTime(Infinity);
            return;
        }
        // Dự phòng: Chỉ khi không có seekToStreamTime
        const video = player.querySelector('video');
        if (video && video.seekable && video.seekable.length) {
            const end = video.seekable.end(video.seekable.length - 1);
            if (isFinite(end) && end > 0) {
                video.currentTime = Math.max(0, end - 1);
            }
        }
    } catch (e) {}
}

export function isCurrentlyActiveLive(player) {
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return false;
    if (!player) player = document.querySelector('#movie_player:not(#inline-preview-player)');
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
    const hasLiveClass = player.classList.contains('ytp-live');
    if (!hasLiveClass) {
        return false;
    }

    // 4. Kiểm tra nút Live Badge (.ytp-live-badge) có đang THỰC SỰ HIỂN THỊ
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
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;

    const player = document.querySelector('#movie_player:not(#inline-preview-player)');
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

    // 1. Chậm nghiêm trọng (> 15s, ví dụ bị tụt về 0:00 ban đầu hoặc lag mạng lâu):
    // Snap về trực tiếp, cooldown ít nhất 15s để buffer ổn định
    if (delay > 15.0) {
        if (now - lastSnapTime > 15000) {
            lastSnapTime = now;
            snapToLive(player);
            if (video.playbackRate !== 1.0) {
                video.playbackRate = 1.0;
            }
        }
        return;
    }

    // 2. Chậm vừa phải (8s - 15s): Tăng nhẹ tốc độ 1.04x để bắt kịp êm ái, KHÔNG snap gây giật
    if (delay > 8.0) {
        if (video.playbackRate !== 1.04) {
            video.playbackRate = 1.04;
        }
        return;
    }

    // 3. Trong ngưỡng độ trễ tự nhiên bình thường của YouTube (<= 8s):
    // Giữ nguyên tốc độ chuẩn 1.0x, tuyệt đối không can thiệp hay seek
    if (video.playbackRate !== 1.0) {
        video.playbackRate = 1.0;
    }
}

/**
 * Kiểm tra ban đầu khi mở trang live:
 * - CHỈ snap nếu bị kẹt ở mốc cực xa (> 30s) và user không chủ động tua lại
 * - Tuyệt đối KHÔNG giật video khi mở trang bình thường
 */
let initialSnapTimer = null;
export function checkInitialLiveSnap() {
    if (!currentConfig.autoLiveSync) return;
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;
    if (initialSnapTimer) {
        clearInterval(initialSnapTimer);
        initialSnapTimer = null;
    }
    let attempts = 0;
    initialSnapTimer = setInterval(() => {
        attempts++;
        const player = document.querySelector('#movie_player:not(#inline-preview-player)');
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
                    // CHỈ snap khi bị kẹt ở mốc cực xa (> 30s, VD bị tụt về 0:00 ban đầu)
                    // Ngưỡng 30s đủ cao để KHÔNG giật video trong trường hợp bình thường
                    if (!userIsRewound && delay > 30.0) {
                        clearInterval(initialSnapTimer);
                        initialSnapTimer = null;
                        lastSnapTime = Date.now();
                        snapToLive(player);
                        return;
                    }
                    // Nếu video đã ở mốc bình thường (<= 30s) -> dừng check, không can thiệp
                    if (delay <= 30.0) {
                        clearInterval(initialSnapTimer);
                        initialSnapTimer = null;
                        return;
                    }
                }
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

    autoLiveSyncTimer = setInterval(checkLiveSync, 3000);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && currentConfig.autoLiveSync) {
            setTimeout(checkLiveSync, 1000);
        }
    });

    document.addEventListener('click', (e) => {
        if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;

        // Nhấp vào badge "Trực tiếp" -> nhảy ngay lập tức về điểm phát sóng thời gian thực
        if (e.target && e.target.closest && e.target.closest('.ytp-live-badge')) {
            const player = document.querySelector('#movie_player:not(#inline-preview-player)');
            if (player) {
                userIsRewound = false;
                lastUserSeekTime = 0;
                lastSnapTime = Date.now();
                snapToLive(player);
            }
        }

        // Nhấp vào thanh tiến trình -> chỉ theo dõi trạng thái tua lại nếu đang xem live
        if (e.target && e.target.closest && e.target.closest('.ytp-progress-bar')) {
            const player = document.querySelector('#movie_player:not(#inline-preview-player)');
            if (!player || !isCurrentlyActiveLive(player)) return;

            recordUserSeek();
        }
    }, true);

    document.addEventListener('yt-navigate-start', resetAutoLiveState);
    document.addEventListener('yt-navigate-finish', () => {
        resetAutoLiveState();
        checkInitialLiveSnap();
    });
}
