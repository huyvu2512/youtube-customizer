// Fill fullscreen letterbox areas with a low-cost, bilinear-smoothed copy of the video.
const CANVAS_WIDTH = 48;
const CANVAS_HEIGHT = 27;
const UPDATE_INTERVAL_MS = 2000;
const LETTERBOX_RATIO_THRESHOLD = 0.06;

let canvas = null;
let context = null;
let updateTimer = null;
let activePlayer = null;
let activeVideo = null;
let boundVideo = null;
let initialized = false;

export function shouldShowLetterboxBackdrop(videoWidth, videoHeight, containerWidth, containerHeight) {
    if (!(videoWidth > 0 && videoHeight > 0 && containerWidth > 0 && containerHeight > 0)) {
        return false;
    }
    const videoRatio = videoWidth / videoHeight;
    const containerRatio = containerWidth / containerHeight;
    const relativeDiff = Math.abs(videoRatio - containerRatio) / Math.max(videoRatio, containerRatio);
    return relativeDiff > LETTERBOX_RATIO_THRESHOLD;
}

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

function stopTimer() {
    if (updateTimer !== null) {
        clearInterval(updateTimer);
        updateTimer = null;
    }
}

function unbindVideo() {
    if (!boundVideo) return;
    boundVideo.removeEventListener('loadedmetadata', syncBackdrop);
    boundVideo.removeEventListener('seeked', drawFrame);
    boundVideo.removeEventListener('play', syncBackdrop);
    boundVideo.removeEventListener('pause', stopTimer);
    boundVideo = null;
}

function bindVideo(video) {
    if (!video || video === boundVideo) return;
    unbindVideo();
    boundVideo = video;
    boundVideo.addEventListener('loadedmetadata', syncBackdrop, { passive: true });
    boundVideo.addEventListener('seeked', drawFrame, { passive: true });
    boundVideo.addEventListener('play', syncBackdrop, { passive: true });
    boundVideo.addEventListener('pause', stopTimer, { passive: true });
}

function clearBackdropCanvas() {
    stopTimer();
    activePlayer?.classList.remove('ytc-letterbox-backdrop-active');
    canvas?.remove();
    canvas = null;
    context = null;
    activePlayer = null;
    activeVideo = null;
}

function stopBackdrop() {
    clearBackdropCanvas();
    unbindVideo();
}

function drawFrame() {
    if (document.hidden) return;
    const player = findPlayer();
    if (!player || !isFullscreen(player)) {
        stopBackdrop();
        return;
    }
    const video = player.querySelector('video.html5-main-video') || player.querySelector('video');
    if (!video) return;
    bindVideo(video);
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;

    const containerW = player.clientWidth || window.innerWidth;
    const containerH = player.clientHeight || window.innerHeight;
    if (!shouldShowLetterboxBackdrop(video.videoWidth, video.videoHeight, containerW, containerH)) {
        // Keep native hardware video overlay active when no letterbox bars exist.
        clearBackdropCanvas();
        return;
    }

    if (video.seeking || player.classList.contains('ytp-scrubbing')) return;
    if (!ensureCanvas(player) || !context) return;
    if (video.paused && video === activeVideo && canvas.dataset.hasFrame === 'true') return;
    try {
        // Bão hòa màu ngay trên canvas 48x27 thay vì CSS filter toàn màn hình để giữ mượt khi phóng to.
        if ('filter' in context) {
            context.filter = 'saturate(1.15)';
        }
        context.drawImage(video, -2, -2, CANVAS_WIDTH + 4, CANVAS_HEIGHT + 4);
        if ('filter' in context) {
            context.filter = 'none';
        }
        activeVideo = video;
        canvas.dataset.hasFrame = 'true';
    } catch (_) {
        // A transient source change can make drawImage fail; the next tick retries.
    }
}

function syncBackdrop() {
    if (document.hidden) {
        stopTimer();
        return;
    }
    const player = findPlayer();
    if (!player || !isFullscreen(player)) {
        stopBackdrop();
        return;
    }
    drawFrame();
    const video = player.querySelector('video.html5-main-video') || player.querySelector('video');
    if (activePlayer && updateTimer === null && video && !video.paused && !video.ended) {
        updateTimer = setInterval(drawFrame, UPDATE_INTERVAL_MS);
    } else if (video && (video.paused || video.ended)) {
        stopTimer();
    }
}

export function initLetterboxBackdrop() {
    if (initialized) return;
    initialized = true;
    document.addEventListener('fullscreenchange', syncBackdrop, { passive: true });
    document.addEventListener('webkitfullscreenchange', syncBackdrop, { passive: true });
    window.addEventListener('resize', syncBackdrop, { passive: true });
    document.addEventListener('visibilitychange', syncBackdrop, { passive: true });
    window.addEventListener('yt-navigate-finish', () => {
        stopBackdrop();
        syncBackdrop();
    }, { passive: true });
    window.addEventListener('yt-page-data-updated', () => {
        stopBackdrop();
        syncBackdrop();
    }, { passive: true });
}
