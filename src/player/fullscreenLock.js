// ==========================================================================
// ĐIỀU PHỐI TOÀN MÀN HÌNH (FULLSCREEN HANDLER) & KHÓA KHI ĐANG TẢI (BUFFERING LOCK)
// ==========================================================================

export let isWatchLoading = false;
let unlockTimer = null;
let boundVideo = null;

function onVideoReady() {
    setWatchLoading(false);
}

function bindVideoEvents(video) {
    if (!video || video === boundVideo) return;
    if (boundVideo) {
        ['playing', 'canplay', 'timeupdate', 'loadeddata'].forEach(evt => {
            boundVideo.removeEventListener(evt, onVideoReady);
        });
    }
    boundVideo = video;
    ['playing', 'canplay', 'timeupdate', 'loadeddata'].forEach(evt => {
        boundVideo.addEventListener(evt, onVideoReady, { once: true, passive: true });
    });
}

/**
 * Tạm khóa nút toàn màn hình trong lúc video đang quay vòng nạp luồng phát
 * Chống triệt để lỗi phóng to nhầm cả trang web thay vì phóng to video player
 */
export function setWatchLoading(loading, duration = 3000) {
    if (unlockTimer) {
        clearTimeout(unlockTimer);
        unlockTimer = null;
    }

    if (loading) {
        isWatchLoading = true;
        document.documentElement.classList.add('ytc-fs-locked');

        // Tìm video và lắng nghe khi video sẵn sàng thì mở khóa ngay lập tức
        const player = document.querySelector('#movie_player:not(#inline-preview-player)') || document.getElementById('movie_player');
        if (player) {
            const video = player.querySelector('video.html5-main-video') || player.querySelector('video');
            if (video) {
                if (video.readyState >= 2 && !player.classList.contains('ytp-loading')) {
                    // Video đã sẵn sàng phát, mở khóa tức thì
                    isWatchLoading = false;
                    document.documentElement.classList.remove('ytc-fs-locked');
                    return;
                }
                bindVideoEvents(video);
            }
        }

        // Khóa an toàn dự phòng: Tự động giải phóng sau tối đa 3 giây, không bao giờ để kẹt nút
        unlockTimer = setTimeout(() => {
            setWatchLoading(false);
        }, duration || 3000);
    } else {
        isWatchLoading = false;
        document.documentElement.classList.remove('ytc-fs-locked');
        if (boundVideo) {
            ['playing', 'canplay', 'timeupdate', 'loadeddata'].forEach(evt => {
                boundVideo.removeEventListener(evt, onVideoReady);
            });
            boundVideo = null;
        }
    }
}

let fullscreenLockBound = false;
export function setupFullscreenLock() {
    if (fullscreenLockBound) return;
    fullscreenLockBound = true;

    // 1. Chặn click vào nút Fullscreen ở pha capture khi đang load
    document.addEventListener('click', (e) => {
        if (!isWatchLoading) return;
        const fsBtn = e.target && e.target.closest && e.target.closest('.ytp-fullscreen-button');
        if (fsBtn) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, true);

    // 2. Chặn double click vào khung player ở pha capture khi đang load (tránh double click phóng to cả trang web)
    document.addEventListener('dblclick', (e) => {
        if (!isWatchLoading) return;
        const player = e.target && e.target.closest && e.target.closest('#movie_player:not(#inline-preview-player)');
        if (player) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, true);

    // 3. Tự động kiểm tra trạng thái video khi chuyển trang hoặc kết thúc nạp dữ liệu
    const checkReady = () => {
        const player = document.querySelector('#movie_player:not(#inline-preview-player)');
        if (!player) return;
        const video = player.querySelector('video.html5-main-video') || player.querySelector('video');
        if (video) {
            bindVideoEvents(video);
            if (video.readyState >= 2 && !player.classList.contains('ytp-loading')) {
                setWatchLoading(false);
            }
        }
    };

    window.addEventListener('yt-navigate-finish', () => {
        setTimeout(checkReady, 200);
        setTimeout(checkReady, 600);
        setTimeout(checkReady, 1200);
    });
}
