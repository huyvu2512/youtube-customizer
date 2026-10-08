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
 */
export function normalizeTimeDisplay() {
    if (!currentConfig.lockElapsedTime) return;
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;

    const now = Date.now();
    if (now - lastCorrectionTime < 800) return; // Cooldown 800ms chống lặp

    const player = document.querySelector('#movie_player:not(#inline-preview-player)');
    if (!player) return;

    // Chỉ áp dụng cho video thông thường (không can thiệp live stream đang phát trực tiếp)
    if (player.classList.contains('ytp-live')) return;

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
 * Khởi tạo bộ bảo vệ cố định thời gian đã phát
 */
export function initTimeLock() {
    if (timeLockInitialized) return;
    timeLockInitialized = true;

    // 1. Chặn click vô tình / ghost click vào thanh thời gian khi đang hiển thị thời gian dương
    document.addEventListener('click', (e) => {
        if (!currentConfig.lockElapsedTime) return;

        const timeDisplay = e.target.closest && e.target.closest('.ytp-time-display');
        if (!timeDisplay) return;

        // Nếu là click hợp lệ do script tự sửa, cho phép đi qua
        if (isProgrammaticFix) return;

        const player = document.querySelector('#movie_player:not(#inline-preview-player)');
        if (player && player.classList.contains('ytp-live')) return;

        const currentEl = timeDisplay.querySelector('.ytp-time-current');
        const text = currentEl ? (currentEl.textContent || '').trim() : '';

        // Nếu thời gian đang ở dạng DƯƠNG bình thường (Elapsed time, không có dấu âm):
        // Chặn tuyệt đối để không bao giờ bị nhảy sang dạng âm (Remaining time)!
        if (text && !text.startsWith('-') && !text.startsWith('−')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, true);

    // 2. Tự động kiểm tra và nắn về thời gian dương khi nạp / chuyển video
    document.addEventListener('yt-navigate-finish', () => {
        if (!currentConfig.lockElapsedTime) return;
        setTimeout(normalizeTimeDisplay, 150);
        setTimeout(normalizeTimeDisplay, 500);
        setTimeout(normalizeTimeDisplay, 1200);
    });

    // 3. Kiểm tra thêm khi video bắt đầu phát lần đầu
    document.addEventListener('play', (e) => {
        if (!currentConfig.lockElapsedTime) return;
        if (e.target && e.target.tagName === 'VIDEO') {
            setTimeout(normalizeTimeDisplay, 100);
        }
    }, true);
}
