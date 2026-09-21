// KHÓA PHÍM & NÚT PHÓNG TO KHI VIDEO ĐANG TẢI (CHỐNG LỖI KẸT GIAO DIỆN)

export let isWatchLoading = false;
let watchLoadTimeout = null;

export function setWatchLoading(loading, duration = 1500) {
    if (!location.pathname.startsWith('/watch')) {
        isWatchLoading = false;
        document.documentElement.classList.remove('ytc-fs-locked');
        clearTimeout(watchLoadTimeout);
        return;
    }

    isWatchLoading = loading;
    document.documentElement.classList.toggle('ytc-fs-locked', loading);
    clearTimeout(watchLoadTimeout);

    if (loading) {
        watchLoadTimeout = setTimeout(() => {
            isWatchLoading = false;
            document.documentElement.classList.remove('ytc-fs-locked');
        }, duration);
    }
}

let fsLockBound = false;
export function setupFullscreenLock() {
    if (fsLockBound) return;
    fsLockBound = true;

    // Chặn click vào nút phóng to khi đang load
    document.addEventListener('click', (e) => {
        if (isWatchLoading && e.target.closest('.ytp-fullscreen-button')) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);

    // Chặn nhấp đúp (double-click) vào player khi đang load
    document.addEventListener('dblclick', (e) => {
        if (isWatchLoading && e.target.closest('#movie_player')) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);

    // Thoát Fullscreen ngay nếu bị lọt vào khi trang chưa sẵn sàng
    document.addEventListener('fullscreenchange', () => {
        if (isWatchLoading && document.fullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
    });
}
