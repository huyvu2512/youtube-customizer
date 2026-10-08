// ==========================================================================
// PHÍM TẮT ĐIỀU KHIỂN VIDEO (A-S-D & NUMPAD) & CLEAN SEEK
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { recordUserSeek } from './autoLive.js';

export function triggerCleanSeek(player) {
    // Không ẩn controls hoặc con trỏ chuột khi tua để giữ trải nghiệm mượt mà, không bị giật chớp HUD
}

function getPlayerVideo(player) {
    return player.querySelector('video.html5-main-video') || player.querySelector('video');
}

export function changeVolume(player, delta) {
    if (!player) return;
    try {
        if (delta > 0 && typeof player.volumeUp === 'function') {
            player.volumeUp();
            if (typeof player.unMute === 'function' && player.isMuted?.()) player.unMute();
            return;
        } else if (delta < 0 && typeof player.volumeDown === 'function') {
            player.volumeDown();
            return;
        }
    } catch (e) {}

    try {
        if (typeof player.getVolume === 'function' && typeof player.setVolume === 'function') {
            const cur = player.getVolume();
            const next = Math.max(0, Math.min(100, cur + delta));
            player.setVolume(next);
            if (delta > 0 && typeof player.unMute === 'function' && player.isMuted?.()) player.unMute();
            return;
        }
    } catch (e) {}

    const video = getPlayerVideo(player);
    if (video) {
        video.volume = Math.max(0, Math.min(1, video.volume + delta / 100));
    }
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

function dispatchYtSeek(key) {
    const keyCode = key === 'j' ? 74 : (key === 'l' ? 76 : (key === 'k' ? 75 : 0));
    const code = key === 'j' ? 'KeyJ' : (key === 'l' ? 'KeyL' : (key === 'k' ? 'KeyK' : ''));
    
    const evDown = new KeyboardEvent('keydown', {
        key,
        code,
        keyCode,
        which: keyCode,
        charCode: keyCode,
        bubbles: true,
        cancelable: true,
        composed: true
    });
    evDown._ytcDispatched = true;

    const evUp = new KeyboardEvent('keyup', {
        key,
        code,
        keyCode,
        which: keyCode,
        charCode: keyCode,
        bubbles: true,
        cancelable: true,
        composed: true
    });
    evUp._ytcDispatched = true;

    const player = document.querySelector('#movie_player:not(#inline-preview-player)');
    const target = player || window;

    target.dispatchEvent(evDown);
    target.dispatchEvent(evUp);
}

let keysBound = false;
export function bindGlobalKeys() {
    if (keysBound) return;
    keysBound = true;

    const handleKeyDown = (e) => {
        if (e._ytcDispatched) return;
        if (!currentConfig.keyboardControls) return;
        if (e.isComposing || e.keyCode === 229) return;

        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }

        const code = e.code || '';
        const isNumpad = (e.location === 3) || 
                         code.startsWith('Numpad') || 
                         (e.keyCode >= 96 && e.keyCode <= 111) || 
                         (e.keyCode === 12);

        // Bỏ qua sự kiện lặp phím khi giữ phím (chống spam/kích đúp seek & pause)
        const isVolumeAction = isNumpad && (
            code === 'Numpad8' || e.key === '8' || e.key === 'ArrowUp' || e.keyCode === 104 || e.keyCode === 38 ||
            code === 'Numpad2' || e.key === '2' || e.key === 'ArrowDown' || e.keyCode === 98 || e.keyCode === 40
        );
        if (e.repeat && !isVolumeAction) {
            return;
        }

        const player = document.querySelector('#movie_player');
        const asdAllowed = canUseAsdKeys(player);

        let captured = false;
        let isSeekAction = false;

        // --- ĐIỀU KHIỂN BẰNG NUMPAD ---
        if (isNumpad) {
            captured = true; // Chặn toàn bộ để YouTube không bị nhảy % hoặc cuộn trang

            // Numpad 8: Tăng âm lượng
            if (code === 'Numpad8' || e.key === '8' || e.key === 'ArrowUp' || e.keyCode === 104 || e.keyCode === 38) {
                if (player) changeVolume(player, 5);
            }
            // Numpad 2: Giảm âm lượng
            else if (code === 'Numpad2' || e.key === '2' || e.key === 'ArrowDown' || e.keyCode === 98 || e.keyCode === 40) {
                if (player) changeVolume(player, -5);
            }
            // Numpad 4: Tua lùi 10 giây (J)
            else if (code === 'Numpad4' || e.key === '4' || e.key === 'ArrowLeft' || e.keyCode === 100 || e.keyCode === 37) {
                dispatchYtSeek('j');
                isSeekAction = true;
            }
            // Numpad 6: Tua tiến 10 giây (L)
            else if (code === 'Numpad6' || e.key === '6' || e.key === 'ArrowRight' || e.keyCode === 102 || e.keyCode === 39) {
                dispatchYtSeek('l');
                isSeekAction = true;
            }
            // Numpad 5: Tạm dừng / phát tiếp (K)
            else if (code === 'Numpad5' || e.key === '5' || e.key === 'Clear' || e.keyCode === 101 || e.keyCode === 12) {
                dispatchYtSeek('k');
            }
        }
        // --- ĐIỀU KHIỂN BẰNG A / S / D ---
        else if (asdAllowed && code === 'KeyA') {
            captured = true;
            dispatchYtSeek('j');
            isSeekAction = true;
        } else if (asdAllowed && code === 'KeyS') {
            captured = true;
            dispatchYtSeek('k');
        } else if (asdAllowed && code === 'KeyD') {
            captured = true;
            dispatchYtSeek('l');
            isSeekAction = true;
        }

        if (captured) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        } else if (['ArrowLeft', 'ArrowRight', 'j', 'l', 'J', 'L'].includes(e.key)) {
            isSeekAction = true;
        }

        if (isSeekAction && player) {
            recordUserSeek();
            triggerCleanSeek(player);
        }
    };

    const handleKeyUp = (e) => {
        if (e._ytcDispatched) return;
        if (!currentConfig.keyboardControls) return;
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }
        const code = e.code || '';
        const isNumpad = (e.location === 3) || 
                         code.startsWith('Numpad') || 
                         (e.keyCode >= 96 && e.keyCode <= 111) || 
                         (e.keyCode === 12);
        if (isNumpad) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
}
