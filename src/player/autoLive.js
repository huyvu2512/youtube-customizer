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

export function resetAutoLiveState() {
    userIsRewound = false;
    lastUserSeekTime = 0;
    lastSnapTime = 0;
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
 * Nhảy về mốc phát trực tiếp:
 * - CHỈ dùng khi bị trôi quá xa (> 45s) hoặc mới từ tab nền quay lại
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
    if (!player) return;

    if (!isCurrentlyActiveLive(player)) {
        return;
    }

    const video = player.querySelector('video');
    if (!video || video.paused || video.ended) return;

    // QUAN TRỌNG: Nếu người xem đã ở mốc trực tiếp (Live Head):
    // Giữ nguyên 100% tốc độ 1.0x, TUYỆT ĐỐI KHÔNG CAN THIỆP, KHÔNG SEEK, KHÔNG GIẬT KHUNG HÌNH!
    if (isAtLiveEdge(player)) {
        if (video.playbackRate !== 1.0) {
            video.playbackRate = 1.0;
        }
        return;
    }

    // Nếu người dùng đang CHỦ ĐỘNG tua xem lại quá khứ:
    // Tuyệt đối không can thiệp, để người dùng tự do xem lại.
    if (userIsRewound) {
        if (video.playbackRate !== 1.0) {
            video.playbackRate = 1.0;
        }
        return;
    }

    // Vừa tương tác tua thủ công gần đây (< 8s) -> tạm hoãn
    if (Date.now() - lastUserSeekTime < 8000) return;

    // Nếu mạng đang buffer / xoay vòng nạp dữ liệu (readyState < 3 hoặc player loading)
    // Tuyệt đối KHÔNG tăng tốc hay snap vì sẽ làm đứt buffer nặng hơn!
    if (video.readyState < 3 || player.classList.contains('ytp-loading')) {
        if (video.playbackRate !== 1.0) {
            video.playbackRate = 1.0;
        }
        return;
    }

    const delay = getLiveDelay(player, video);
    const now = Date.now();

    // 1. Chậm cực kỳ nghiêm trọng (> 45s, ví dụ tab bị đóng băng rất lâu trong nền):
    // Snap về trực tiếp 1 lần duy nhất, cooldown ít nhất 30 giây để YouTube nạp buffer ổn định
    if (delay > 45.0) {
        if (now - lastSnapTime > 30000) {
            lastSnapTime = now;
            snapToLive(player);
            if (video.playbackRate !== 1.0) {
                video.playbackRate = 1.0;
            }
        }
        return;
    }

    // 2. Chậm vừa phải (bị tụt nhẹ sau mốc live khi chuyển tab hoặc mạng lag nhẹ):
    // Dùng cơ chế BẮT KỊP ÊM ÁI (SMOOTH CATCH-UP):
    // Tăng nhẹ tốc độ lên 1.08x — Người xem nghe âm thanh hoàn toàn tự nhiên, không giật hình,
    // Buffer được giữ nguyên vẹn 100%. Khi bắt kịp live head, isAtLiveEdge() sẽ tự ngắt về 1.0x.
    if (delay > 6.0) {
        if (video.playbackRate !== 1.08) {
            video.playbackRate = 1.08;
        }
        return;
    }

    // 3. Trong ngưỡng trễ bình thường: Giữ nguyên 1.0x
    if (video.playbackRate !== 1.0) {
        video.playbackRate = 1.0;
    }
}

/**
 * Kiểm tra ban đầu khi mở trang live:
 * - CHỈ snap nếu bị kẹt ở mốc cực xa (> 60s) và user không chủ động tua lại
 * - Tuyệt đối KHÔNG giật video khi mở trang bình thường
 */
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
                    clearInterval(initialSnapTimer);
                    initialSnapTimer = null;
                    return;
                }
            }

            if (isCurrentlyActiveLive(player)) {
                // Nếu đã ở mốc trực tiếp thì dừng luôn, không can thiệp
                if (isAtLiveEdge(player)) {
                    clearInterval(initialSnapTimer);
                    initialSnapTimer = null;
                    return;
                }

                const video = player.querySelector('video');
                if (video && !video.paused) {
                    const delay = getLiveDelay(player, video);
                    // CHỈ snap khi bị kẹt ở mốc cực xa (> 60s)
                    if (!userIsRewound && delay > 60.0) {
                        clearInterval(initialSnapTimer);
                        initialSnapTimer = null;
                        lastSnapTime = Date.now();
                        snapToLive(player);
                        return;
                    }
                    if (delay <= 60.0) {
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

function stopAutoLiveSyncTimer() {
    if (autoLiveSyncTimer) {
        clearInterval(autoLiveSyncTimer);
        autoLiveSyncTimer = null;
    }
    if (initialSnapTimer) {
        clearInterval(initialSnapTimer);
        initialSnapTimer = null;
    }
}

function syncAutoLiveSyncTimer() {
    const isWatchRoute = location.pathname.startsWith('/watch') || location.pathname.startsWith('/live');
    if (currentConfig.autoLiveSync && isWatchRoute) {
        if (!autoLiveSyncTimer) autoLiveSyncTimer = setInterval(checkLiveSync, 3000);
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

