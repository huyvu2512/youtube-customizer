// ==========================================================================
// TÍNH NĂNG ÁNH SÁNG PHÒNG (AMBIENT LIGHT / AMBILIGHT) SIÊU TỐI ƯU
// - 4-Border Edge Bleeding: Ánh sáng 4 mép ăn khớp 100% với khung hình tiếp giáp
// - Full-Width Masthead Glow: Phủ kín 100% đỉnh trang (kể cả góc phải màn hình)
// - Vertical Glow Columns: Các ô dải màu dóng dọc lan sâu xuống giữa trang
// - Pure Video Sharpness: Tuyệt đối không can thiệp layout của player, video nét 100%
// - Resilient Render Loop: Không bao giờ bị tắt khi buffer hay đổi độ phân giải
// - Chống kích hoạt sai: Đảm bảo tắt 100% khi người dùng không bật tính năng
// ==========================================================================
import { currentConfig } from '../core/config.js';

let ambientWrapper = null;
let ambientSpreadCanvas = null;
let ambientSpreadCtx = null;
let ambientSampleCanvas = null;
let ambientSampleCtx = null;
let ambientEdgeCanvas = null;
let ambientEdgeCtx = null;
let ambientFadeGrad = null;
let animFrameId = null;
let loopTimeoutId = null;
let isRunning = false;
let currentVideo = null;
let hasDrawnFirstFrame = false;
let isPausedAndDrawn = false;
let lastMastheadScrolled = null;
let scrollListenerBound = false;
let ambientResizeObserver = null;
let observedResizeTarget = null;
let rectsDirty = true;

// Canvas nội bộ nhỏ + downscale 2 bước để khử răng cưa và thay thế hoàn toàn CSS blur/mask-image toàn màn hình
const CANVAS_WIDTH = 128;
const CANVAS_HEIGHT = 160;
const SAMPLE_WIDTH = 40;
const SAMPLE_HEIGHT = 50;
const TARGET_INTERVAL = 100; // ~10 FPS đủ mượt cho ánh sáng viền, giảm tải GPU & compositor khi phóng to

function isFullscreenActive() {
    return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.querySelector('#movie_player.ytp-fullscreen, ytd-watch-flexy[fullscreen]')
    );
}

/**
 * Kiểm tra xem tính năng Ambilight có đang được phép chạy hay không
 */
function isAmbientEnabled() {
    return !!currentConfig.ambientLighting && !currentConfig.audioOnlyMode && !isShortsPage();
}

function isShortsPage() {
    return location.pathname.startsWith('/shorts');
}

function findActivePlayer() {
    return document.querySelector('#movie_player:not(#inline-preview-player)') ||
        document.getElementById('movie_player') ||
        document.querySelector('.html5-video-player');
}

/**
 * Tìm phần tử Video đang phát
 */
let cachedPlayerRect = null;
let cachedWrapperRect = null;
let cachedVideoRect = null;
let cachedMediaRect = null;
let cachedObjectFit = 'contain';
let cachedObjectPosition = '50% 50%';
let lastVideoDimensions = '';

function markRectsDirty() {
    rectsDirty = true;
}

function syncResizeObserver(activePlayer) {
    if (!window.ResizeObserver || !activePlayer) return;
    if (!ambientResizeObserver) {
        ambientResizeObserver = new ResizeObserver(() => {
            rectsDirty = true;
        });
    }
    if (observedResizeTarget !== activePlayer) {
        ambientResizeObserver.disconnect();
        ambientResizeObserver.observe(activePlayer);
        if (ambientWrapper) ambientResizeObserver.observe(ambientWrapper);
        observedResizeTarget = activePlayer;
    }
}

function updateCachedRects(force = false) {
    if (!force && !rectsDirty && cachedPlayerRect && cachedWrapperRect && cachedVideoRect) return;
    const activePlayer = findActivePlayer();
    if (!activePlayer || !ambientWrapper) return;
    cachedPlayerRect = activePlayer.getBoundingClientRect();
    cachedWrapperRect = ambientWrapper.getBoundingClientRect();
    const video = findActiveVideo();
    if (video) {
        cachedVideoRect = video.getBoundingClientRect();
        const videoStyle = window.getComputedStyle(video);
        cachedObjectFit = videoStyle.objectFit || 'contain';
        cachedObjectPosition = videoStyle.objectPosition || '50% 50%';
    }
    cachedMediaRect = null;
    rectsDirty = false;
    syncResizeObserver(activePlayer);
}

function getObjectPositionOffset(availableSpace, position) {
    const value = String(position || '50%').trim().toLowerCase();
    if (value === 'left' || value === 'top') return 0;
    if (value === 'right' || value === 'bottom') return availableSpace;
    if (value === 'center') return availableSpace / 2;
    if (value.endsWith('%')) {
        const percent = Number.parseFloat(value);
        return Number.isFinite(percent) ? availableSpace * percent / 100 : availableSpace / 2;
    }
    if (value.endsWith('px')) {
        const pixels = Number.parseFloat(value);
        return Number.isFinite(pixels) ? pixels : availableSpace / 2;
    }
    return availableSpace / 2;
}

/**
 * Tìm phần tử Video đang phát (Bỏ qua 100% inline-preview-player để không lag preview thumbnail)
 */
function findActiveVideo() {
    const activePlayer = findActivePlayer();
    if (activePlayer) {
        const v = activePlayer.querySelector('video.html5-main-video') || activePlayer.querySelector('video');
        if (v && (!v.closest || !v.closest('#inline-preview-player, #preview, ytd-video-preview'))) return v;
    }
    return null;
}

/**
 * Khởi tạo hoặc gắn canvas vào tầng nền sâu nhất của ytd-watch-flexy
 */
function ensureAmbientCanvas() {
    if (!isAmbientEnabled()) {
        if (ambientWrapper) {
            ambientWrapper.style.display = 'none';
            ambientWrapper.classList.remove('ytc-ambient-active');
        }
        return false;
    }

    const watchFlexy = document.querySelector('ytd-watch-flexy');
    const activePlayer = findActivePlayer();
    if (!watchFlexy && !activePlayer) return false;

    const targetParent = watchFlexy || (activePlayer ? activePlayer.parentElement : null);
    if (!targetParent) return false;

    if (!ambientWrapper || !ambientWrapper.isConnected || ambientWrapper.parentElement !== targetParent) {
        const existing = document.getElementById('ytc-ambient-wrapper');
        if (existing && existing !== ambientWrapper) {
            existing.remove();
        }

        if (!ambientWrapper) {
            ambientWrapper = document.createElement('div');
            ambientWrapper.id = 'ytc-ambient-wrapper';
            ambientWrapper.setAttribute('aria-hidden', 'true');

            // Lớp Canvas Ambilight duy nhất: Tỏa rộng tự nhiên, siêu mịn không vệt viền giả
            ambientSpreadCanvas = document.createElement('canvas');
            ambientSpreadCanvas.id = 'ytc-ambient-spread-canvas';
            ambientSpreadCanvas.width = CANVAS_WIDTH;
            ambientSpreadCanvas.height = CANVAS_HEIGHT;

            ambientWrapper.appendChild(ambientSpreadCanvas);
        }

        ambientWrapper.style.display = '';

        // Luôn gắn làm con đầu tiên (firstChild) để nằm dưới tất cả các phần tử video và cột nội dung
        if (watchFlexy) {
            watchFlexy.insertBefore(ambientWrapper, watchFlexy.firstChild);
        } else {
            targetParent.insertBefore(ambientWrapper, targetParent.firstChild);
        }

        ambientSpreadCtx = ambientSpreadCanvas.getContext('2d', {
            alpha: true,
            willReadFrequently: false
        });
        if (ambientSpreadCtx) {
            ambientSpreadCtx.imageSmoothingEnabled = true;
            ambientSpreadCtx.imageSmoothingQuality = 'medium';
            ambientFadeGrad = ambientSpreadCtx.createLinearGradient(0, Math.round(CANVAS_HEIGHT * 0.56), 0, CANVAS_HEIGHT);
            ambientFadeGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
            ambientFadeGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.45)');
            ambientFadeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        if (!ambientSampleCanvas) {
            ambientSampleCanvas = document.createElement('canvas');
            ambientSampleCanvas.width = SAMPLE_WIDTH;
            ambientSampleCanvas.height = SAMPLE_HEIGHT;
            ambientSampleCtx = ambientSampleCanvas.getContext('2d', {
                alpha: true,
                willReadFrequently: false
            });
            if (ambientSampleCtx) {
                ambientSampleCtx.imageSmoothingEnabled = true;
                ambientSampleCtx.imageSmoothingQuality = 'low';
            }
        }

        if (!ambientEdgeCanvas) {
            ambientEdgeCanvas = document.createElement('canvas');
            ambientEdgeCanvas.width = SAMPLE_WIDTH;
            ambientEdgeCanvas.height = SAMPLE_HEIGHT;
            ambientEdgeCtx = ambientEdgeCanvas.getContext('2d', {
                alpha: false,
                willReadFrequently: false
            });
            if (ambientEdgeCtx) {
                ambientEdgeCtx.imageSmoothingEnabled = true;
                ambientEdgeCtx.imageSmoothingQuality = 'low';
            }
        }
    }

    return !!(ambientSpreadCtx && ambientSampleCtx && ambientEdgeCtx);
}

function getRenderedMediaRect(vW, vH, videoRect, boxW, boxH) {
    let sourceX = 0, sourceY = 0, sourceW = vW, sourceH = vH;
    let displayW = boxW, displayH = boxH;
    const fit = cachedObjectFit;

    if (fit === 'contain' || fit === 'scale-down') {
        let scale = Math.min(boxW / vW, boxH / vH);
        if (fit === 'scale-down') scale = Math.min(1, scale);
        displayW = Math.min(boxW, vW * scale);
        displayH = Math.min(boxH, vH * scale);
        const positions = cachedObjectPosition.trim().split(/\s+/);
        const offsetX = getObjectPositionOffset(boxW - displayW, positions[0]);
        const offsetY = getObjectPositionOffset(boxH - displayH, positions[1] || '50%');
        return {
            sourceX, sourceY, sourceW, sourceH,
            mediaRect: {
                left: videoRect.left + offsetX,
                top: videoRect.top + offsetY,
                width: displayW,
                height: displayH
            }
        };
    }

    if (fit === 'cover') {
        const coverScale = Math.max(boxW / vW, boxH / vH);
        const renderedW = vW * coverScale;
        const renderedH = vH * coverScale;
        const positions = cachedObjectPosition.trim().split(/\s+/);
        const offsetX = getObjectPositionOffset(boxW - renderedW, positions[0]);
        const offsetY = getObjectPositionOffset(boxH - renderedH, positions[1] || '50%');
        sourceX = Math.max(0, Math.min(vW, -offsetX / coverScale));
        sourceY = Math.max(0, Math.min(vH, -offsetY / coverScale));
        sourceW = Math.max(1, Math.min(vW - sourceX, boxW / coverScale));
        sourceH = Math.max(1, Math.min(vH - sourceY, boxH / coverScale));
    }

    return { sourceX, sourceY, sourceW, sourceH, mediaRect: videoRect };
}

/**
 * Vẽ một khung hình Ambilight (chỉ lấy mẫu <video> 1 lần duy nhất mỗi tick)
 */
function drawFrame(video) {
    if (!isAmbientEnabled()) {
        stopLoop();
        return;
    }
    if (!video) return;
    if (!ensureAmbientCanvas()) return;
    if (!ambientSpreadCtx) return;

    const activePlayer = findActivePlayer();
    if (!activePlayer || activePlayer.classList.contains('ytp-scrubbing')) return;

    try {
        const vW = video.videoWidth;
        const vH = video.videoHeight;
        if (!vW || !vH || vW < 10 || vH < 10) return;

        const dimensions = `${vW}x${vH}`;
        if (dimensions !== lastVideoDimensions) {
            cachedPlayerRect = null;
            cachedVideoRect = null;
            cachedMediaRect = null;
            rectsDirty = true;
            lastVideoDimensions = dimensions;
        }

        if (rectsDirty || !cachedPlayerRect || !cachedWrapperRect || !cachedVideoRect) {
            updateCachedRects(true);
        }

        const playerRect = cachedPlayerRect;
        const wrapperRect = cachedWrapperRect;
        const videoRect = cachedVideoRect;
        if (!playerRect || !wrapperRect || !videoRect) return;

        const pW = playerRect.width;
        const pH = playerRect.height;
        if (pW < 10 || pH < 10) return;

        const wrapW = wrapperRect.width || window.innerWidth || 1920;
        const wrapH = wrapperRect.height || 1150;
        const boxW = videoRect.width || pW;
        const boxH = videoRect.height || pH;
        if (boxW < 10 || boxH < 10) return;

        if (!cachedMediaRect) {
            cachedMediaRect = getRenderedMediaRect(vW, vH, videoRect, boxW, boxH);
        }
        const { sourceX, sourceY, sourceW, sourceH, mediaRect } = cachedMediaRect;
        const scaleX = SAMPLE_WIDTH / wrapW;
        const scaleY = SAMPLE_HEIGHT / wrapH;
        const cvX = Math.round((mediaRect.left - wrapperRect.left) * scaleX);
        const cvY = Math.round((mediaRect.top - wrapperRect.top) * scaleY);
        const cvW = Math.round(mediaRect.width * scaleX);
        const cvH = Math.round(mediaRect.height * scaleY);
        const sX = Math.round(sourceX);
        const sY = Math.round(sourceY);
        const sW = Math.max(1, Math.round(sourceW));
        const sH = Math.max(1, Math.round(sourceH));

        // Chỉ đọc frame từ thẻ <video> ĐÚNG 1 LẦN thay vì 9 lần để tránh kẹt GPU texture pipeline
        ambientEdgeCtx.drawImage(video, sX, sY, sW, sH, 0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);

        const edgeW = Math.max(1, Math.round(SAMPLE_WIDTH * 0.05));
        const edgeH = Math.max(1, Math.round(SAMPLE_HEIGHT * 0.05));
        const bleedX = Math.round(cvW * 0.04);
        const bleedY = Math.round(cvH * 0.04);

        ambientSampleCtx.clearRect(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);
        ambientSampleCtx.globalAlpha = 0.88;
        ambientSampleCtx.drawImage(
            ambientEdgeCanvas,
            0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT,
            Math.max(0, cvX - bleedX),
            Math.max(0, cvY - bleedY),
            cvW + bleedX * 2,
            cvH + bleedY * 2
        );
        ambientSampleCtx.globalAlpha = 1.0;

        const rightW = Math.max(0, SAMPLE_WIDTH - (cvX + cvW));
        const bottomY = cvY + cvH;
        const bottomH = Math.max(0, SAMPLE_HEIGHT - bottomY);

        if (rightW > 0 && cvH > 0) {
            ambientSampleCtx.drawImage(ambientEdgeCanvas, SAMPLE_WIDTH - edgeW, 0, edgeW, SAMPLE_HEIGHT, cvX + cvW - 1, cvY, rightW + 1, cvH);
        }
        if (cvX > 0 && cvH > 0) {
            ambientSampleCtx.drawImage(ambientEdgeCanvas, 0, 0, edgeW, SAMPLE_HEIGHT, 0, cvY, cvX + 1, cvH);
        }
        if (cvY > 0 && cvW > 0) {
            ambientSampleCtx.drawImage(ambientEdgeCanvas, 0, 0, SAMPLE_WIDTH, edgeH, cvX, 0, cvW, cvY + 1);
        }
        if (bottomH > 0 && cvW > 0) {
            ambientSampleCtx.drawImage(ambientEdgeCanvas, 0, SAMPLE_HEIGHT - edgeH, SAMPLE_WIDTH, edgeH, cvX, bottomY - 1, cvW, bottomH + 1);
        }

        if (cvX > 0 && cvY > 0) {
            ambientSampleCtx.drawImage(ambientEdgeCanvas, 0, 0, edgeW, edgeH, 0, 0, cvX + 1, cvY + 1);
        }
        if (rightW > 0 && cvY > 0) {
            ambientSampleCtx.drawImage(ambientEdgeCanvas, SAMPLE_WIDTH - edgeW, 0, edgeW, edgeH, cvX + cvW - 1, 0, rightW + 1, cvY + 1);
        }
        if (cvX > 0 && bottomH > 0) {
            ambientSampleCtx.drawImage(ambientEdgeCanvas, 0, SAMPLE_HEIGHT - edgeH, edgeW, edgeH, 0, bottomY - 1, cvX + 1, bottomH + 1);
        }
        if (rightW > 0 && bottomH > 0) {
            ambientSampleCtx.drawImage(ambientEdgeCanvas, SAMPLE_WIDTH - edgeW, SAMPLE_HEIGHT - edgeH, edgeW, edgeH, cvX + cvW - 1, bottomY - 1, rightW + 1, bottomH + 1);
        }

        // Áp dụng tăng màu giao diện sáng ngay trên canvas 128x160 thay vì CSS filter toàn viewport
        const isDark = document.documentElement.hasAttribute('dark');
        ambientSpreadCtx.globalCompositeOperation = 'source-over';
        ambientSpreadCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        if ('filter' in ambientSpreadCtx) {
            ambientSpreadCtx.filter = isDark ? 'none' : 'saturate(165%) contrast(108%) brightness(98%)';
        }
        ambientSpreadCtx.drawImage(ambientSampleCanvas, 0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        if ('filter' in ambientSpreadCtx) {
            ambientSpreadCtx.filter = 'none';
        }
        if (ambientFadeGrad) {
            ambientSpreadCtx.globalCompositeOperation = 'destination-in';
            ambientSpreadCtx.fillStyle = ambientFadeGrad;
            ambientSpreadCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ambientSpreadCtx.globalCompositeOperation = 'source-over';
        }

        if (isAmbientEnabled()) {
            if (!hasDrawnFirstFrame) {
                hasDrawnFirstFrame = true;
                if (ambientWrapper) ambientWrapper.classList.add('ytc-ambient-active');
                document.documentElement.classList.add('ytc-ambient-lighting');
                document.documentElement.classList.add('ytc-ambient-ready');
            }
        }
    } catch (e) {
        // Không làm ngắt quãng vòng lặp
    }
}

const VIDEO_ACTIVITY_EVENTS = ['play', 'playing', 'canplay', 'loadeddata', 'seeked', 'ratechange'];

function detachCurrentVideo() {
    if (!currentVideo) return;
    VIDEO_ACTIVITY_EVENTS.forEach(evt => currentVideo.removeEventListener(evt, handleVideoActivity));
    currentVideo = null;
}

function scheduleNextTick() {
    if (!isRunning || loopTimeoutId !== null) return;
    loopTimeoutId = setTimeout(() => {
        loopTimeoutId = null;
        if (!isRunning || document.hidden || isFullscreenActive() || !isAmbientEnabled()) {
            stopLoop();
            return;
        }
        animFrameId = requestAnimationFrame(renderLoop);
    }, TARGET_INTERVAL);
}

/**
 * Vòng lặp render tiết kiệm (~10 FPS, nghỉ hẳn khi tạm dừng hoặc fullscreen)
 */
function renderLoop() {
    animFrameId = null;
    if (!isRunning || document.hidden || isFullscreenActive() || !isAmbientEnabled()) {
        stopLoop();
        return;
    }

    const video = currentVideo || findActiveVideo();
    if (!video) {
        scheduleNextTick();
        return;
    }

    if (video !== currentVideo) {
        attachVideo(video);
    }

    if (video.seeking || document.getElementById('movie_player')?.classList.contains('ytp-scrubbing')) {
        scheduleNextTick();
        return;
    }

    // Khi video pause: Vẽ 1 frame lúc pause rồi dừng vòng lặp hoàn toàn cho tới khi play/seek lại
    if (video.paused || video.ended) {
        if (!isPausedAndDrawn && video.readyState >= 2 && video.videoWidth > 0) {
            drawFrame(video);
            isPausedAndDrawn = true;
        }
        stopLoop();
        return;
    }

    isPausedAndDrawn = false;

    if (video.readyState >= 2 && video.videoWidth && video.videoHeight) {
        drawFrame(video);
    }

    scheduleNextTick();
}

function startLoop() {
    if (!isAmbientEnabled() || document.hidden || isFullscreenActive()) {
        stopLoop();
        return;
    }
    if (isRunning) return;
    isRunning = true;
    animFrameId = requestAnimationFrame(renderLoop);
}

function stopLoop() {
    isRunning = false;
    if (loopTimeoutId !== null) {
        clearTimeout(loopTimeoutId);
        loopTimeoutId = null;
    }
    if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
}

function handleVideoActivity() {
    if (!isAmbientEnabled()) {
        stopLoop();
        return;
    }
    isPausedAndDrawn = false;
    if (!isRunning) {
        startLoop();
    }
}

function attachVideo(video) {
    if (!isAmbientEnabled()) {
        detachCurrentVideo();
        return;
    }
    if (!video || video === currentVideo) return;
    if (video.closest && video.closest('#inline-preview-player, #preview, ytd-video-preview')) return;

    detachCurrentVideo();
    currentVideo = video;
    VIDEO_ACTIVITY_EVENTS.forEach(evt => currentVideo.addEventListener(evt, handleVideoActivity, { passive: true }));

    startLoop();
}

function handleVisibilityChange() {
    if (document.hidden) {
        stopLoop();
    } else {
        if (!isAmbientEnabled()) {
            stopLoop();
            return;
        }
        isPausedAndDrawn = false;
        startLoop();
    }
}

function handleScroll() {
    if (!isAmbientEnabled()) {
        if (lastMastheadScrolled) {
            lastMastheadScrolled = false;
            document.documentElement.classList.remove('ytc-masthead-scrolled');
        }
        return;
    }
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const isScrolled = scrollY > 60;
    if (isScrolled !== lastMastheadScrolled) {
        lastMastheadScrolled = isScrolled;
        document.documentElement.classList.toggle('ytc-masthead-scrolled', isScrolled);
    }
}

function syncScrollListener(enabled) {
    if (enabled && !scrollListenerBound) {
        scrollListenerBound = true;
        window.addEventListener('scroll', handleScroll, { passive: true });
    } else if (!enabled && scrollListenerBound) {
        scrollListenerBound = false;
        window.removeEventListener('scroll', handleScroll);
    }
}

function handleNavigation() {
    if (!isAmbientEnabled()) {
        applyAmbientLightingState();
        return;
    }

    const isWatchPage = location.pathname.startsWith('/watch') ||
                        location.pathname.startsWith('/live') ||
                        document.querySelector('ytd-watch-flexy') !== null;

    if (!isWatchPage) {
        stopLoop();
        hasDrawnFirstFrame = false;
        document.documentElement.classList.remove('ytc-ambient-ready');
        if (ambientWrapper) {
            ambientWrapper.classList.remove('ytc-ambient-active', 'ytc-ambient-shorts');
        }
        detachCurrentVideo();
        return;
    }

    isPausedAndDrawn = false;
    cachedPlayerRect = null;
    cachedWrapperRect = null;
    cachedVideoRect = null;
    cachedMediaRect = null;
    rectsDirty = true;
    setTimeout(() => {
        if (!isAmbientEnabled()) return;
        ensureAmbientCanvas();
        updateCachedRects(true);
        const v = findActiveVideo();
        if (v) attachVideo(v);
        startLoop();
    }, 200);

    setTimeout(() => {
        if (!isAmbientEnabled()) return;
        updateCachedRects(true);
        const v = findActiveVideo();
        if (v && isRunning) drawFrame(v);
    }, 700);
}

let ambientObserver = null;
function syncAmbientObserver(enabled) {
    if (!enabled) {
        if (ambientObserver) {
            ambientObserver.disconnect();
            ambientObserver = null;
        }
        return;
    }
    if (ambientObserver) return;
    ambientObserver = new MutationObserver((mutations) => {
        if (!isAmbientEnabled() || isFullscreenActive()) return;
        if (currentVideo && currentVideo.isConnected) return;
        let hasAdded = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                hasAdded = true;
                break;
            }
        }
        if (!hasAdded) return;
        const video = findActiveVideo();
        if (video && video !== currentVideo) {
            attachVideo(video);
        }
    });
    const target = document.getElementById('page-manager') || document.querySelector('ytd-app') || document.documentElement;
    if (target) {
        ambientObserver.observe(target, { childList: true, subtree: true });
    }
}

export function applyAmbientLightingState() {
    if (!isAmbientEnabled()) {
        stopLoop();
        syncAmbientObserver(false);
        syncScrollListener(false);
        if (ambientResizeObserver) {
            ambientResizeObserver.disconnect();
            observedResizeTarget = null;
        }
        hasDrawnFirstFrame = false;
        isPausedAndDrawn = false;
        lastMastheadScrolled = null;
        cachedPlayerRect = null;
        cachedWrapperRect = null;
        cachedVideoRect = null;
        cachedMediaRect = null;
        rectsDirty = true;
        document.documentElement.classList.remove('ytc-ambient-lighting');
        document.documentElement.classList.remove('ytc-ambient-ready');
        document.documentElement.classList.remove('ytc-masthead-scrolled');
        if (document.body) {
            document.body.classList.remove('ytc-ambient-lighting');
        }
        if (ambientWrapper) {
            ambientWrapper.classList.remove('ytc-ambient-active', 'ytc-ambient-shorts');
            ambientWrapper.style.display = 'none';
        }
        const existing = document.getElementById('ytc-ambient-wrapper');
        if (existing) {
            existing.classList.remove('ytc-ambient-active', 'ytc-ambient-shorts');
            existing.style.display = 'none';
        }
        if (ambientSpreadCtx) {
            ambientSpreadCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        document.querySelectorAll('ytd-reel-video-renderer.ytc-ambient-shorts-host').forEach(el => {
            el.classList.remove('ytc-ambient-shorts-host');
        });
        detachCurrentVideo();
        return;
    }

    document.documentElement.classList.add('ytc-ambient-lighting');
    if (document.body) {
        document.body.classList.add('ytc-ambient-lighting');
    }
    if (ambientWrapper) {
        ambientWrapper.style.display = '';
    }

    ensureAmbientCanvas();
    syncAmbientObserver(true);
    syncScrollListener(true);

    const video = findActiveVideo();
    if (video) {
        attachVideo(video);
    }
    startLoop();
}

let ambientInitialized = false;
export function initAmbientLight() {
    if (ambientInitialized) return;
    ambientInitialized = true;

    const handleFullscreenChange = () => {
        if (!isAmbientEnabled()) return;
        if (isFullscreenActive()) {
            stopLoop();
            return;
        }
        cachedPlayerRect = null;
        cachedWrapperRect = null;
        cachedVideoRect = null;
        cachedMediaRect = null;
        rectsDirty = true;
        isPausedAndDrawn = false;
        updateCachedRects(true);
        startLoop();
        const v = findActiveVideo();
        if (v && isRunning && !v.seeking) drawFrame(v);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', () => {
        if (!isAmbientEnabled() || isFullscreenActive()) return;
        rectsDirty = true;
        updateCachedRects(true);
        const v = findActiveVideo();
        if (v && isRunning && !v.seeking) drawFrame(v);
    }, { passive: true });
    document.addEventListener('fullscreenchange', handleFullscreenChange, { passive: true });
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange, { passive: true });

    window.addEventListener('yt-navigate-finish', handleNavigation);
    window.addEventListener('yt-page-data-updated', handleNavigation);
    window.addEventListener('popstate', handleNavigation);

    applyAmbientLightingState();
}
