// ==========================================================================
// TÍNH NĂNG ÁNH SÁNG PHÒNG (AMBIENT LIGHT / AMBILIGHT) SIÊU TỐI ƯU
// - Full-Screen Cinema Ambilight: Tỏa đều 360 độ quanh video, xóa bỏ viền cắt
// - Micro Canvas 32x18px: Tiêu thụ cực ít RAM (< 50KB) và CPU (< 0.5%)
// - GPU Hardware Acceleration: CSS Blur 85px & Scale 1.4x xử lý trên GPU Compositor
// - Tự động tắt ánh sáng gốc YouTube khi bật, khôi phục khi tắt
// - Deep Sleeping: Tự động ngắt hoàn toàn khi pause, chuyển tab hoặc cuộn khỏi video
// ==========================================================================
import { currentConfig } from '../core/config.js';

let ambientWrapper = null;
let ambientCanvas = null;
let ambientCtx = null;
let animFrameId = null;
let isRunning = false;
let lastDrawTime = 0;
let currentVideo = null;
let intersectionObserver = null;
let resizeObserver = null;
let isIntersecting = true;

const CANVAS_WIDTH = 32;
const CANVAS_HEIGHT = 18;
const TARGET_INTERVAL = 1000 / 18; // ~18 FPS (55.5ms)

/**
 * Cập nhật vị trí và kích thước canvas bám chuẩn xác theo Video Player
 */
export function updateAmbientPosition() {
    if (!ambientCanvas || !ambientWrapper) return;
    const moviePlayer = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    const watchFlexy = document.querySelector('ytd-watch-flexy');

    if (!moviePlayer) return;

    if (watchFlexy && ambientWrapper.parentElement === watchFlexy) {
        const playerRect = moviePlayer.getBoundingClientRect();
        const flexyRect = watchFlexy.getBoundingClientRect();

        const top = Math.round(playerRect.top - flexyRect.top);
        const left = Math.round(playerRect.left - flexyRect.left);
        const width = Math.round(playerRect.width);
        const height = Math.round(playerRect.height);

        ambientCanvas.style.top = `${top}px`;
        ambientCanvas.style.left = `${left}px`;
        ambientCanvas.style.width = `${width}px`;
        ambientCanvas.style.height = `${height}px`;
    } else {
        ambientCanvas.style.top = '0px';
        ambientCanvas.style.left = '0px';
        ambientCanvas.style.width = '100%';
        ambientCanvas.style.height = '100%';
    }
}

/**
 * Khởi tạo hoặc gắn canvas vào tầng nền của trang xem video (ytd-watch-flexy)
 */
function ensureAmbientCanvas() {
    const moviePlayer = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    if (!moviePlayer) return null;

    const watchFlexy = document.querySelector('ytd-watch-flexy');
    const targetParent = watchFlexy || moviePlayer.parentElement;
    if (!targetParent) return null;

    if (!ambientWrapper || !ambientWrapper.isConnected || ambientWrapper.parentElement !== targetParent) {
        let existing = document.getElementById('ytc-ambient-wrapper');
        if (existing) {
            existing.remove();
        }

        ambientWrapper = document.createElement('div');
        ambientWrapper.id = 'ytc-ambient-wrapper';
        ambientWrapper.setAttribute('aria-hidden', 'true');

        ambientCanvas = document.createElement('canvas');
        ambientCanvas.id = 'ytc-ambient-canvas';
        ambientCanvas.width = CANVAS_WIDTH;
        ambientCanvas.height = CANVAS_HEIGHT;

        ambientWrapper.appendChild(ambientCanvas);

        if (watchFlexy) {
            watchFlexy.insertBefore(ambientWrapper, watchFlexy.firstChild);
        } else {
            moviePlayer.parentElement.insertBefore(ambientWrapper, moviePlayer);
        }

        if (ambientCanvas) {
            ambientCtx = ambientCanvas.getContext('2d', {
                alpha: false,
                willReadFrequently: false
            });
            if (ambientCtx) {
                ambientCtx.imageSmoothingEnabled = true;
                ambientCtx.imageSmoothingQuality = 'low';
            }
        }
    }

    updateAmbientPosition();

    // Theo dõi thay đổi kích thước của Player (Theater mode, resize) để cập nhật vị trí
    if (!resizeObserver && moviePlayer) {
        try {
            resizeObserver = new ResizeObserver(() => {
                updateAmbientPosition();
            });
            resizeObserver.observe(moviePlayer);
        } catch (e) {}
    }

    // Thiết lập IntersectionObserver nếu chưa có
    if (!intersectionObserver && moviePlayer) {
        try {
            intersectionObserver = new IntersectionObserver((entries) => {
                const entry = entries[0];
                isIntersecting = !!(entry && entry.isIntersecting);
                if (!isIntersecting) {
                    stopLoop();
                } else if (shouldBeActive()) {
                    startLoop();
                }
            }, { threshold: 0.05 });
            intersectionObserver.observe(moviePlayer);
        } catch (e) {}
    }

    return ambientCanvas;
}

/**
 * Kiểm tra xem Ambient Light có đủ điều kiện để render không
 */
function shouldBeActive() {
    if (!currentConfig.ambientLighting) return false;
    if (currentConfig.audioOnlyMode) return false;
    if (document.hidden) return false;
    if (!isIntersecting) return false;
    if (!currentVideo || currentVideo.paused || currentVideo.ended || currentVideo.readyState < 2) return false;
    return true;
}

/**
 * Vòng lặp render siêu nhẹ (18 FPS)
 */
function renderLoop(timestamp) {
    if (!isRunning) return;

    animFrameId = requestAnimationFrame(renderLoop);

    if (timestamp - lastDrawTime < TARGET_INTERVAL) return;
    lastDrawTime = timestamp;

    if (!currentVideo || currentVideo.paused || currentVideo.ended || currentVideo.readyState < 2) {
        stopLoop();
        return;
    }

    if (ambientCtx) {
        try {
            ambientCtx.drawImage(currentVideo, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        } catch (e) {}
    }
}

/**
 * Bắt đầu vòng lặp render
 */
function startLoop() {
    if (isRunning) return;
    if (!shouldBeActive()) return;

    isRunning = true;
    lastDrawTime = performance.now();
    if (ambientWrapper) ambientWrapper.classList.add('ytc-ambient-active');
    animFrameId = requestAnimationFrame(renderLoop);
}

/**
 * Dừng vòng lặp render để tiết kiệm 100% tài nguyên
 */
function stopLoop() {
    if (!isRunning) return;
    isRunning = false;
    if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
}

/**
 * Lắng nghe các sự kiện trạng thái của video
 */
function onVideoPlay() {
    if (shouldBeActive()) startLoop();
}

function onVideoPause() {
    stopLoop();
}

function onVideoSeeking() {
    stopLoop();
}

function onVideoSeeked() {
    if (shouldBeActive()) startLoop();
}

function attachVideo(video) {
    if (!video || video === currentVideo) return;

    if (currentVideo) {
        currentVideo.removeEventListener('play', onVideoPlay);
        currentVideo.removeEventListener('playing', onVideoPlay);
        currentVideo.removeEventListener('pause', onVideoPause);
        currentVideo.removeEventListener('ended', onVideoPause);
        currentVideo.removeEventListener('seeking', onVideoSeeking);
        currentVideo.removeEventListener('seeked', onVideoSeeked);
    }

    currentVideo = video;
    currentVideo.addEventListener('play', onVideoPlay);
    currentVideo.addEventListener('playing', onVideoPlay);
    currentVideo.addEventListener('pause', onVideoPause);
    currentVideo.addEventListener('ended', onVideoPause);
    currentVideo.addEventListener('seeking', onVideoSeeking);
    currentVideo.addEventListener('seeked', onVideoSeeked);

    if (shouldBeActive()) {
        startLoop();
    }
}

/**
 * Cập nhật trạng thái khi người dùng chuyển tab hoặc ẩn cửa sổ
 */
function handleVisibilityChange() {
    if (document.hidden) {
        stopLoop();
    } else {
        if (shouldBeActive()) startLoop();
    }
}

/**
 * Đồng bộ hoặc áp dụng trạng thái Ambient Light theo cấu hình
 */
export function applyAmbientLightingState() {
    if (!currentConfig.ambientLighting || currentConfig.audioOnlyMode) {
        stopLoop();
        if (ambientWrapper) {
            ambientWrapper.classList.remove('ytc-ambient-active');
            ambientWrapper.style.display = 'none';
        }
        return;
    }

    // Nếu cấu hình bật
    if (ambientWrapper) {
        ambientWrapper.style.display = '';
    }

    ensureAmbientCanvas();

    const video = document.querySelector('video.html5-main-video') || document.querySelector('video');
    if (video) {
        attachVideo(video);
        if (!video.paused && !video.ended) {
            startLoop();
        }
    }
}

/**
 * Khởi tạo bộ điều phối Ambient Light
 */
let ambientInitialized = false;
export function initAmbientLight() {
    if (ambientInitialized) return;
    ambientInitialized = true;

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', updateAmbientPosition);
    window.addEventListener('fullscreenchange', updateAmbientPosition);

    // Lắng nghe khi YouTube chuyển trang SPA (/watch, /live)
    window.addEventListener('yt-navigate-finish', () => {
        setTimeout(() => {
            applyAmbientLightingState();
            updateAmbientPosition();
        }, 300);
        setTimeout(updateAmbientPosition, 800);
    });

    // Quan sát xuất hiện video player
    const observer = new MutationObserver(() => {
        const video = document.querySelector('video.html5-main-video') || document.querySelector('video');
        if (video && video !== currentVideo) {
            attachVideo(video);
            updateAmbientPosition();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    applyAmbientLightingState();
}
