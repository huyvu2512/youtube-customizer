// ==========================================================================
// TỰ ĐỘNG GIỮ MỐC TRỰC TIẾP (AUTO LIVE SYNC) - PHIÊN BẢN ZERO-LAG KHÔNG GIẬT BUFFER
// ==========================================================================
import { currentConfig, onConfigChange } from '../core/config.js';

let autoLiveSyncTimer = null;
let autoLiveSyncInitialized = false;
let initialSnapTimer = null;
let lastSnapTime = 0;
let lastUserSeekTime = 0;
let userIsRewound = false;
let snapReadySince = 0;

const LIVE_EDGE_TOLERANCE_SECONDS = 1;
const LIVE_SNAP_THRESHOLD_SECONDS = 120;
const LIVE_SNAP_STABLE_MS = 1500;
const MAX_CATCH_UP_RATE = 1.18;

export function resetAutoLiveState() {
    userIsRewound = false;
    lastUserSeekTime = 0;
    lastSnapTime = 0;
    snapReadySince = 0;
    try {
        const player = document.querySelector('#movie_player:not(#inline-preview-player)');
        if (player) {
            const video = player.querySelector('video');
            if (video && video.playbackRate !== 1.0) {
                video.playbackRate = 1.0;
            }
        }
    } catch (e) {}
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
 * Kiểm tra xem người dùng có đang ở sát mép trực tiếp (Live Head) hay không
 * Sử dụng cả API nội bộ của YouTube player lẫn trạng thái nút .ytp-live-badge
 */
export function isAtLiveEdge(player) {
    if (!player) player = document.querySelector('#movie_player:not(#inline-preview-player)');
    if (!player) return false;

    // 1. YouTube internal API: isAtLiveHead()
    if (typeof player.isAtLiveHead === 'function') {
        try {
            if (player.isAtLiveHead() === true) return true;
        } catch (e) {}
    }

    // 2. Thuộc tính disabled trên nút badge "Trực tiếp" (.ytp-live-badge)
    // Khi đang phát ở mốc trực tiếp, YouTube đánh dấu nút này disabled
    const liveBadge = player.querySelector('.ytp-live-badge');
    if (liveBadge) {
        if (liveBadge.hasAttribute('disabled') || liveBadge.disabled || liveBadge.classList.contains('ytp-live-badge-is-livehead')) {
            return true;
        }
    }

    return false;
}

/**
 * Nhảy về mốc phát trực tiếp khi auto-sync xác nhận độ trễ rất lớn và player ổn định.
 * - Tuyệt đối không gọi liên tục gây xả buffer và đóng băng khung hình
 */
export function snapToLive(player) {
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;
    if (!player) player = document.querySelector('#movie_player:not(#inline-preview-player)');
    if (!player) return;

    if (!isCurrentlyActiveLive(player)) return;

    try {
        if (typeof player.seekToStreamTime === 'function') {
            player.seekToStreamTime(Infinity);
            return;
        }
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

    // 1. Kiểm tra API player.getVideoData()
    if (typeof player.getVideoData === 'function') {
        const vd = player.getVideoData();
        if (vd) {
            if (vd.isPostLiveDvr === true) return false;
            if (vd.isLive === false && !vd.isLiveDvr) return false;
            if (vd.isLive === true && !vd.isPostLiveDvr) return true;
        }
    }

    // 2. Kiểm tra API player.isLive()
    if (typeof player.isLive === 'function') {
        try {
            const live = player.isLive();
            if (live === false) return false;
            if (live === true) return true;
        } catch (e) {}
    }

    // 3. Kiểm tra class 'ytp-live' trên movie_player
    if (!player.classList.contains('ytp-live')) {
        return false;
    }

    // 4. Kiểm tra nút Live Badge (.ytp-live-badge) có đang hiển thị
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
    if (!player) {
        snapReadySince = 0;
        return;
    }

    if (!isCurrentlyActiveLive(player)) {
        snapReadySince = 0;
        return;
    }

    const video = player.querySelector('video');
    if (!video || video.paused || video.ended) {
        snapReadySince = 0;
        return;
    }

    // QUAN TRỌNG: Nếu người xem đã ở mốc trực tiếp (Live Head):
    // Giữ nguyên 100% tốc độ 1.0x, TUYỆT ĐỐI KHÔNG CAN THIỆP, KHÔNG SEEK, KHÔNG GIẬT KHUNG HÌNH!
    if (isAtLiveEdge(player)) {
        snapReadySince = 0;
        if (video.playbackRate !== 1.0) {
            video.playbackRate = 1.0;
        }
        return;
    }

    // Nếu người dùng đang CHỦ ĐỘNG tua xem lại quá khứ:
    // Tuyệt đối không can thiệp, để người dùng tự do xem lại.
    if (userIsRewound) {
        snapReadySince = 0;
        if (video.playbackRate !== 1.0) {
            video.playbackRate = 1.0;
        }
        return;
    }

    // Vừa tương tác tua thủ công gần đây (< 8s) -> tạm hoãn
    if (Date.now() - lastUserSeekTime < 8000) {
        snapReadySince = 0;
        return;
    }

    // Nếu mạng đang buffer / xoay vòng nạp dữ liệu (readyState < 3 hoặc player loading)
    // Tuyệt đối KHÔNG tăng tốc hay snap vì sẽ làm đứt buffer nặng hơn!
    if (video.readyState < 3 || player.classList.contains('ytp-loading')) {
        snapReadySince = 0;
        if (video.playbackRate !== 1.0) {
            video.playbackRate = 1.0;
        }
        return;
    }

    const delay = getLiveDelay(player, video);
    const now = Date.now();

    // Avoid hard seeks for ordinary delay; they can flush the current buffer and stutter.
    // Only snap after a very large delay and a stable ready state across multiple checks.
    if (delay > LIVE_SNAP_THRESHOLD_SECONDS) {
        if (!snapReadySince) snapReadySince = now;
        if (now - snapReadySince >= LIVE_SNAP_STABLE_MS && now - lastSnapTime > 30000) {
            lastSnapTime = now;
            snapReadySince = 0;
            snapToLive(player);
            video.playbackRate = 1.0;
        }
        return;
    }
    snapReadySince = 0;

    // Gradually catch up all the way to the live edge; 1.08x only recovered ~0.08s per second.
    if (delay > LIVE_EDGE_TOLERANCE_SECONDS) {
        const rate = Math.min(MAX_CATCH_UP_RATE, Math.round((1.02 + delay * 0.005) * 100) / 100);
        if (Math.abs(video.playbackRate - rate) >= 0.01) video.playbackRate = rate;
        return;
    }

    // 3. Trong ngưỡng trễ bình thường: Giữ nguyên 1.0x
    if (video.playbackRate !== 1.0) {
        video.playbackRate = 1.0;
    }
}

/**
 * Kiểm tra ban đầu khi mở trang live; only snap after a large delay and stable playback.
 */
export function checkInitialLiveSnap() {
    if (!currentConfig.autoLiveSync) return;
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;
    if (initialSnapTimer) {
        clearInterval(initialSnapTimer);
        initialSnapTimer = null;
    }
    let attempts = 0;
    let stableReadySince = 0;
    initialSnapTimer = setInterval(() => {
        attempts++;
        const player = document.querySelector('#movie_player:not(#inline-preview-player)');
        if (!player) stableReadySince = 0;
        if (player) {
            if (typeof player.getVideoData === 'function') {
                const vd = player.getVideoData();
                if (vd && (vd.isPostLiveDvr === true || (vd.isLive === false && !vd.isLiveDvr))) {
                    clearInterval(initialSnapTimer);
                    initialSnapTimer = null;
                    return;
                }
            }

            if (isCurrentlyActiveLive(player)) {
                // Nếu đã ở mốc trực tiếp thì dừng luôn, không can thiệp
                if (isAtLiveEdge(player)) {
                    stableReadySince = 0;
                    clearInterval(initialSnapTimer);
                    initialSnapTimer = null;
                    return;
                }

                const video = player.querySelector('video');
                if (video && !video.paused) {
                    if (video.readyState < 3 || player.classList.contains('ytp-loading')) {
                        stableReadySince = 0;
                        if (attempts >= 30) {
                            clearInterval(initialSnapTimer);
                            initialSnapTimer = null;
                        }
                        return;
                    }

                    const delay = getLiveDelay(player, video);
                    if (!userIsRewound && delay > LIVE_SNAP_THRESHOLD_SECONDS) {
                        if (!stableReadySince) stableReadySince = Date.now();
                        if (Date.now() - stableReadySince >= LIVE_SNAP_STABLE_MS) {
                            clearInterval(initialSnapTimer);
                            initialSnapTimer = null;
                            lastSnapTime = Date.now();
                            snapToLive(player);
                            return;
                        }
                    } else {
                        clearInterval(initialSnapTimer);
                        initialSnapTimer = null;
                        return;
                    }
                } else {
                    stableReadySince = 0;
                }
            } else {
                stableReadySince = 0;
            }
        }
        if (attempts >= 30) {
            clearInterval(initialSnapTimer);
            initialSnapTimer = null;
        }
    }, 500);
}

function stopAutoLiveSyncTimer() {
    if (autoLiveSyncTimer) {
        clearInterval(autoLiveSyncTimer);
        autoLiveSyncTimer = null;
    }
    if (initialSnapTimer) {
        clearInterval(initialSnapTimer);
        initialSnapTimer = null;
    }
    snapReadySince = 0;
}

function syncAutoLiveSyncTimer() {
    const isWatchRoute = location.pathname.startsWith('/watch') || location.pathname.startsWith('/live');
    if (currentConfig.autoLiveSync && isWatchRoute) {
        if (!autoLiveSyncTimer) autoLiveSyncTimer = setInterval(checkLiveSync, 1000);
        return;
    }

    stopAutoLiveSyncTimer();
}

export function initAutoLiveSync() {
    if (autoLiveSyncInitialized) return;
    autoLiveSyncInitialized = true;

    onConfigChange(syncAutoLiveSyncTimer);
    syncAutoLiveSyncTimer();

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

    document.addEventListener('yt-navigate-start', () => {
        stopAutoLiveSyncTimer();
        resetAutoLiveState();
    });
    document.addEventListener('yt-navigate-finish', () => {
        resetAutoLiveState();
        syncAutoLiveSyncTimer();
        checkInitialLiveSnap();
    });
    window.addEventListener('popstate', syncAutoLiveSyncTimer);
}

