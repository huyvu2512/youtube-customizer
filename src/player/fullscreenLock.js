// ==========================================================================
// KHÓA PHÓNG TO KHI VIDEO ĐANG LOAD (CHỐNG KẸT GIAO DIỆN)
// ==========================================================================

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

    document.addEventListener('click', (e) => {
        if (isWatchLoading && e.target.closest('.ytp-fullscreen-button')) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);

    document.addEventListener('dblclick', (e) => {
        if (isWatchLoading && e.target.closest('#movie_player')) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);

    document.addEventListener('fullscreenchange', () => {
        if (isWatchLoading && document.fullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
    });
}
