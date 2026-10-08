// ==========================================================================
// ĐIỀU PHỐI TOÀN MÀN HÌNH (FULLSCREEN HANDLER)
// ==========================================================================

export let isWatchLoading = false;

export function setWatchLoading(loading, duration = 0) {
    isWatchLoading = false;
    document.documentElement.classList.remove('ytc-fs-locked');
}

export function setupFullscreenLock() {
    // Không khóa hay chặn click/dblclick để người dùng tương tác tức thì với player
}
