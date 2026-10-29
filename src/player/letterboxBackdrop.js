// Fill fullscreen letterbox areas with a low-cost, blurred copy of the video.
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;
const UPDATE_INTERVAL_MS = 500;

let canvas = null;
let context = null;
let updateTimer = null;
let activePlayer = null;
let activeVideo = null;
let initialized = false;

function findPlayer() {
    return document.querySelector('#movie_player:not(#inline-preview-player)');
}

function isFullscreen(player) {
    return !!(document.fullscreenElement || document.webkitFullscreenElement ||
        player?.classList.contains('ytp-fullscreen'));
}

function ensureCanvas(player) {
    if (!player) return false;
    if (activePlayer !== player) {
        canvas?.remove();
        canvas = null;
        context = null;
        activePlayer = player;
    }
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.className = 'ytc-letterbox-backdrop';
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        canvas.setAttribute('aria-hidden', 'true');
        context = canvas.getContext('2d', { alpha: false, desynchronized: true });
    }
    const videoContainer = player.querySelector('.html5-video-container');
    if (!videoContainer) return false;
    if (canvas.parentElement !== player) player.insertBefore(canvas, videoContainer);
    player.classList.add('ytc-letterbox-backdrop-active');
    return true;
}

function stopBackdrop() {
    if (updateTimer !== null) {
        clearInterval(updateTimer);
        updateTimer = null;
    }
    activePlayer?.classList.remove('ytc-letterbox-backdrop-active');
    canvas?.remove();
    canvas = null;
    context = null;
    activePlayer = null;
    activeVideo = null;
}

function drawFrame() {
    const player = findPlayer();
    if (!player || !isFullscreen(player)) {
        stopBackdrop();
        return;
    }
    if (!ensureCanvas(player)) return;
    const video = player.querySelector('video.html5-main-video') || player.querySelector('video');
    if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;
    if (video.paused && video === activeVideo && canvas.dataset.hasFrame === 'true') return;
    try {
        context.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        activeVideo = video;
        canvas.dataset.hasFrame = 'true';
    } catch (_) {
        // A transient source change can make drawImage fail; the next tick retries.
    }
}

function syncBackdrop() {
    const player = findPlayer();
    if (!player || !isFullscreen(player)) {
        stopBackdrop();
        return;
    }
    drawFrame();
    if (updateTimer === null) updateTimer = setInterval(drawFrame, UPDATE_INTERVAL_MS);
}

export function initLetterboxBackdrop() {
    if (initialized) return;
    initialized = true;
    document.addEventListener('fullscreenchange', syncBackdrop, { passive: true });
    document.addEventListener('webkitfullscreenchange', syncBackdrop, { passive: true });
    window.addEventListener('yt-navigate-finish', () => {
        stopBackdrop();
        syncBackdrop();
    }, { passive: true });
    window.addEventListener('yt-page-data-updated', () => {
        stopBackdrop();
        syncBackdrop();
    }, { passive: true });
}
