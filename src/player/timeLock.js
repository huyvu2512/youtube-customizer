// ==========================================================================
// KHÓA CỐ ĐỊNH THỜI GIAN ĐÃ PHÁT (LOCK ELAPSED TIME DISPLAY)
// CHỐNG TỰ ĐỔI / GHOST CLICK SANG THỜI GIAN ĐẾM NGƯỢC ÂM (-3:13)
// SIÊU NHẸ - ZERO LAG - AN TOÀN TUYỆT ĐỐI
// ==========================================================================
import { currentConfig } from '../core/config.js';

let timeLockInitialized = false;
let isProgrammaticFix = false;
let lastCorrectionTime = 0;

/**
 * Tự động kiểm tra và chuyển thời gian về dạng dương (Thời gian đã phát) nếu đang bị âm
 * Luôn hoạt động mặc định ngầm trong script để khôi phục chuẩn YouTube gốc
 */
export function normalizeTimeDisplay() {
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;

    const now = Date.now();
    if (now - lastCorrectionTime < 400) return; // Cooldown 400ms chống lặp

    const player = document.querySelector('#movie_player:not(#inline-preview-player)');
    if (!player) return;

    // Tuyệt đối không can thiệp nếu là video trực tiếp / livestream
    if (player.classList.contains('ytp-live') || player.querySelector('.ytp-live-badge')) return;

    const currentEl = player.querySelector('.ytp-time-current');
    if (!currentEl) return;

    const text = (currentEl.textContent || '').trim();
    // Nếu thời gian đang ở dạng đếm ngược âm (ví dụ: -3:13 / 4:13)
    if (text.startsWith('-') || text.startsWith('−')) {
        lastCorrectionTime = now;
        isProgrammaticFix = true;

        const timeBtn = player.querySelector('button.ytp-time-display, .ytp-time-display button, .ytp-time-display') || currentEl;
        try {
            timeBtn.click();
        } catch (e) {}

        setTimeout(() => {
            isProgrammaticFix = false;
        }, 60);
    }
}

/**
 * Khởi tạo bộ bảo vệ cố định thời gian đã phát (chạy ngầm mặc định)
 */
export function initTimeLock() {
    if (timeLockInitialized) return;
    timeLockInitialized = true;

    // 1. Lắng nghe khi click vào khu vực thời gian
    // TUYỆT ĐỐI không chặn sự kiện bấm vào nút Trực tiếp (.ytp-live-badge)
    document.addEventListener('click', (e) => {
        // Nếu bấm vào nút Trực tiếp (.ytp-live-badge) -> Bỏ qua 100%, cho phép nhảy về live
        if (e.target && e.target.closest && e.target.closest('.ytp-live-badge')) return;

        const timeDisplay = e.target.closest && e.target.closest('.ytp-time-display');
        if (!timeDisplay) return;

        // Nếu là click hợp lệ do script tự sửa, cho phép đi qua
        if (isProgrammaticFix) return;

        const player = document.querySelector('#movie_player:not(#inline-preview-player)');
        if (player && (player.classList.contains('ytp-live') || player.querySelector('.ytp-live-badge'))) return;

        // Ép định dạng thời gian về dạng số dương đã phát thay vì chặn click
        setTimeout(normalizeTimeDisplay, 60);
    }, false);

    // 2. Tự động kiểm tra và nắn về thời gian dương khi nạp / chuyển video
    document.addEventListener('yt-navigate-finish', () => {
        setTimeout(normalizeTimeDisplay, 150);
        setTimeout(normalizeTimeDisplay, 500);
        setTimeout(normalizeTimeDisplay, 1200);
    });

    // 3. Kiểm tra thêm khi video bắt đầu phát lần đầu
    document.addEventListener('play', (e) => {
        if (e.target && e.target.tagName === 'VIDEO') {
            setTimeout(normalizeTimeDisplay, 100);
        }
    }, true);
}
