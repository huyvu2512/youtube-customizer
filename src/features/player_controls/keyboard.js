// ĐIỀU KHIỂN VIDEO BẰNG BÀN PHÍM (A-S-D & NUMPAD) & CLEAN SEEK
import { currentConfig } from '../../config/index.js';
import { isWatchLoading } from './fullscreen.js';

// Tự động bấm tiếp tục xem khi YouTube hiện "Vẫn đang xem?"
document.addEventListener('animationstart', (e) => {
    if (e.animationName !== 'ytcConfirmInserted') return;
    const node = e.target;
    if (node.tagName?.toLowerCase() === 'yt-confirm-dialog-renderer') {
        setTimeout(() => {
            const confirmBtn = node.querySelector?.('#confirm-button button, yt-button-renderer#confirm-button, #confirm-button');
            if (!confirmBtn || confirmBtn.offsetParent === null) return;
            const text = confirmBtn.innerText || confirmBtn.textContent || '';
            if (text.includes('Có') || text.includes('Yes') || text.includes('CONTINUE')) {
                confirmBtn.click();
                const video = document.querySelector('#movie_player video');
                if (video?.paused) video.play();
            }
        }, 100);
    }
}, true);

function getPlayerVideo(player) {
    return player.querySelector('video.html5-main-video') || player.querySelector('video');
}

let lastSeekAt = 0;
const SEEK_COOLDOWN_MS = 80;

function seekBySeconds(player, delta) {
    const now = Date.now();
    if (now - lastSeekAt < SEEK_COOLDOWN_MS) return false;
    lastSeekAt = now;

    const video = getPlayerVideo(player);
    if (!video) return false;

    const duration = Number.isFinite(video.duration) ? video.duration : Infinity;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + delta));
    return true;
}

function togglePlayback(player) {
    const video = getPlayerVideo(player);
    if (video) {
        if (video.paused) video.play();
        else video.pause();
        return true;
    }
    if (typeof player.getPlayerState === 'function') {
        if (player.getPlayerState() === 1) player.pauseVideo?.();
        else player.playVideo?.();
        return true;
    }
    return false;
}

function isPlayerFullscreen(player) {
    if (!player) return false;
    const fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fs) return false;
    return player.classList.contains('ytp-fullscreen') || (typeof player.isFullscreen === 'function' && player.isFullscreen());
}

function canUseAsdKeys(player) {
    if (!player) return false;
    return isPlayerFullscreen(player) || player.matches(':hover');
}

let seekModeTimer = null;
function triggerCleanSeek(player) {
    if (!player) return;
    player.classList.add('seeking-mode');
    clearTimeout(seekModeTimer);
    seekModeTimer = setTimeout(() => {
        player.classList.remove('seeking-mode');
    }, 600);
}

function changeVolume(player, delta) {
    if (!player) return;
    const key = delta > 0 ? 'ArrowUp' : 'ArrowDown';
    const keyCode = delta > 0 ? 38 : 40;
    const vBefore = typeof player.getVolume === 'function' ? player.getVolume() : null;

    player.dispatchEvent(new KeyboardEvent('keydown', {
        key,
        code: key,
        keyCode,
        which: keyCode,
        bubbles: true,
        cancelable: true
    }));

    const vAfter = typeof player.getVolume === 'function' ? player.getVolume() : null;
    if (vBefore !== null && vAfter !== null && vBefore === vAfter) {
        const next = Math.max(0, Math.min(100, Math.round(vBefore + delta)));
        player.setVolume?.(next);
        if (delta > 0 && player.isMuted?.()) player.unMute?.();
    }
}

let keysBound = false;
export function bindGlobalKeys() {
    if (keysBound) return;
    keysBound = true;

    document.addEventListener('keydown', (e) => {
        if (!currentConfig.keyboardControls) return;
        if (e.isComposing || e.keyCode === 229) return;

        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }

        const player = document.querySelector('#movie_player');
        if (!player) return;

        let captured = false;
        let isSeekAction = false;
        const code = e.code || '';
        const isNumpad = (e.location === 3) || code.startsWith('Numpad');
        const asdAllowed = canUseAsdKeys(player);

        // --- Điều khiển bằng Numpad (Bàn phím phụ) ---
        if (isNumpad) {
            captured = true;

            if (e.key === '8' || e.key === 'ArrowUp' || code === 'Numpad8' || code === 'NumpadAdd' || e.key === '+') {
                changeVolume(player, 5);
            } else if (e.key === '2' || e.key === 'ArrowDown' || code === 'Numpad2' || code === 'NumpadSubtract' || e.key === '-') {
                changeVolume(player, -5);
            } else if (e.key === '4' || e.key === 'ArrowLeft' || code === 'Numpad4') {
                seekBySeconds(player, -10);
                isSeekAction = true;
            } else if (e.key === '6' || e.key === 'ArrowRight' || code === 'Numpad6') {
                seekBySeconds(player, 10);
                isSeekAction = true;
            } else if (e.key === '5' || e.key === 'Clear' || code === 'Numpad5' || e.keyCode === 12) {
                togglePlayback(player);
            }
        }
        // --- Điều khiển bằng A / S / D ---
        else if (asdAllowed && code === 'KeyA') {
            captured = true;
            seekBySeconds(player, -10);
            isSeekAction = true;
        } else if (asdAllowed && code === 'KeyS') {
            captured = true;
            togglePlayback(player);
        } else if (asdAllowed && code === 'KeyD') {
            captured = true;
            seekBySeconds(player, 10);
            isSeekAction = true;
        }
        // Chặn phím F khi video đang tải để không gây kẹt phóng to
        else if (!e.ctrlKey && !e.altKey && !e.metaKey && (code === 'KeyF' || e.key === 'f' || e.key === 'F')) {
            if (isWatchLoading) {
                captured = true;
            }
        }

        if (captured) {
            e.preventDefault();
            e.stopImmediatePropagation();
        } else if (['ArrowLeft', 'ArrowRight', 'j', 'l', 'J', 'L'].includes(e.key)) {
            isSeekAction = true;
        }

        if (isSeekAction) {
            triggerCleanSeek(player);
        }
    }, true);
}
