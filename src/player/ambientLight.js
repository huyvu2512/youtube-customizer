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
let animFrameId = null;
let isRunning = false;
let lastDrawTime = 0;
let currentVideo = null;
let hasDrawnFirstFrame = false;
let isPausedAndDrawn = false;

// Kích thước canvas nội bộ (tỷ lệ chuẩn tối ưu hiệu năng và GPU)
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 720;
const TARGET_INTERVAL = 1000 / 30; // 30 FPS mượt mà & siêu nhẹ

/**
 * Kiểm tra xem tính năng Ambilight có đang được phép chạy hay không
 */
function isAmbientEnabled() {
    return !!currentConfig.ambientLighting && !currentConfig.audioOnlyMode;
}

/**
 * Tìm phần tử Video đang phát
 */
function findActiveVideo() {
    const moviePlayer = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    if (moviePlayer) {
        const v = moviePlayer.querySelector('video.html5-main-video') || moviePlayer.querySelector('video');
        if (v) return v;
    }
    return document.querySelector('video.html5-main-video') || document.querySelector('video');
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
    const moviePlayer = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    if (!watchFlexy && !moviePlayer) return false;

    const targetParent = watchFlexy || (moviePlayer ? moviePlayer.parentElement : null);
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
        } else if (moviePlayer && moviePlayer.parentElement) {
            moviePlayer.parentElement.insertBefore(ambientWrapper, moviePlayer);
        }

        ambientSpreadCtx = ambientSpreadCanvas.getContext('2d', {
            alpha: true,
            willReadFrequently: false
        });
        if (ambientSpreadCtx) {
            ambientSpreadCtx.imageSmoothingEnabled = true;
            ambientSpreadCtx.imageSmoothingQuality = 'medium';
        }
    }

    return !!ambientSpreadCtx;
}

/**
 * Vẽ một khung hình Ambilight
 */
function drawFrame(video) {
    if (!isAmbientEnabled()) {
        stopLoop();
        return;
    }
    if (!video) return;
    if (!ensureAmbientCanvas()) return;
    if (!ambientSpreadCtx) return;

    const moviePlayer = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    if (!moviePlayer) return;

    try {
        const vW = video.videoWidth;
        const vH = video.videoHeight;
        if (!vW || !vH || vW < 10 || vH < 10) return;

        const playerRect = moviePlayer.getBoundingClientRect();
        const wrapperRect = ambientWrapper.getBoundingClientRect();

        const pW = playerRect.width;
        const pH = playerRect.height;
        if (pW < 10 || pH < 10) return;

        const wrapW = wrapperRect.width || window.innerWidth || 1920;
        const wrapH = wrapperRect.height || 2200;

        // Tọa độ tương đối của player trong không gian wrapper
        const relX = Math.max(0, playerRect.left - wrapperRect.left);
        const relY = Math.max(0, playerRect.top - wrapperRect.top);

        // Quy đổi sang hệ tọa độ Canvas (CANVAS_WIDTH x CANVAS_HEIGHT)
        const scaleX = CANVAS_WIDTH / wrapW;
        const scaleY = CANVAS_HEIGHT / wrapH;

        const cvX = Math.round(relX * scaleX);
        const cvY = Math.round(relY * scaleY);
        const cvW = Math.round(pW * scaleX);
        const cvH = Math.round(pH * scaleY);

        // Tính toán tỷ lệ aspect ratio của video để lấy đúng vùng hình ảnh (tránh viền đen trong video)
        const videoAspect = vW / vH;
        const playerAspect = pW / pH;

        let sX = 0, sY = 0, sW = vW, sH = vH;
        if (videoAspect > playerAspect + 0.03) {
            const targetW = vH * playerAspect;
            sX = (vW - targetW) / 2;
            sW = targetW;
        } else if (videoAspect < playerAspect - 0.03) {
            const targetH = vW / playerAspect;
            sY = (vH - targetH) / 2;
            sH = targetH;
        }

        // Bỏ qua viền đen (Cinematic Letterbox 21:9 / 2.39:1 hoặc Pillarbox 4:3)
        // Cắt an toàn 10% trên/dưới và 4% trái/phải để luôn bắt trọn màu sắc thật của khung hình
        const padX = sW * 0.04;
        const padY = sH * 0.10;
        const cX = sX + padX;
        const cY = sY + padY;
        const cW = sW - (padX * 2);
        const cH = sH - (padY * 2);

        // Xóa sạch canvas trước khi vẽ
        ambientSpreadCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const rightW = Math.max(0, CANVAS_WIDTH - (cvX + cvW));

        // 1. Phủ toàn bộ canvas một lớp màu nền liên tục, mượt mà từ video (Zero seams, zero blocks)
        ambientSpreadCtx.drawImage(video, cX, cY, cW, cH, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 2. MÉP TRÊN (Lan tỏa dải màu lên toàn bộ thanh Masthead phía trên):
        if (cvY > 0) {
            ambientSpreadCtx.drawImage(video, cX, cY, cW, 12, 0, 0, CANVAS_WIDTH, cvY);
        }

        // 3. HAI BÊN HÔNG (Trái & Phải khung video):
        if (cvH > 0) {
            if (cvX > 0) {
                ambientSpreadCtx.drawImage(video, cX, cY, 12, cH, 0, cvY, cvX, cvH);
            }
            if (rightW > 0) {
                ambientSpreadCtx.drawImage(video, cX + cW - 12, cY, 12, cH, cvX + cvW, cvY, rightW, cvH);
            }
        }

        // 4. MÉP DƯỚI (DÓNG CÁC Ô DẢI MÀU DỌC LAN SÂU XUỐNG DƯỚI TRANG):
        const bottomY = cvY + cvH;
        const bottomH = Math.max(0, CANVAS_HEIGHT - bottomY);
        if (bottomH > 0) {
            ambientSpreadCtx.drawImage(video, cX, cY + cH - 12, cW, 12, cvX, bottomY, cvW, bottomH);
            if (cvX > 0) {
                ambientSpreadCtx.drawImage(video, cX, cY + cH - 12, 12, 12, 0, bottomY, cvX, bottomH);
            }
            if (rightW > 0) {
                ambientSpreadCtx.drawImage(video, cX + cW - 12, cY + cH - 12, 12, 12, cvX + cvW, bottomY, rightW, bottomH);
            }
        }

        // 5. Kích hoạt trạng thái hiển thị CHỈ KHI tính năng thực sự được bật
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

/**
 * Vòng lặp render liên tục kiên cường (Resilient Render Loop)
 */
function renderLoop(timestamp) {
    if (!isRunning) return;

    if (!isAmbientEnabled()) {
        stopLoop();
        return;
    }

    animFrameId = requestAnimationFrame(renderLoop);

    if (timestamp - lastDrawTime < TARGET_INTERVAL) return;
    lastDrawTime = timestamp;

    const video = currentVideo || findActiveVideo();
    if (!video) return;

    if (video !== currentVideo) {
        attachVideo(video);
    }

    if (document.fullscreenElement) return;

    // Khi video pause: Vẽ 1 frame lúc pause rồi tạm nghỉ để tiết kiệm CPU
    if (video.paused || video.ended) {
        if (!isPausedAndDrawn && video.readyState >= 2 && video.videoWidth > 0) {
            drawFrame(video);
            isPausedAndDrawn = true;
        }
        return;
    }

    isPausedAndDrawn = false;

    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
        return;
    }

    drawFrame(video);
}

function startLoop() {
    if (!isAmbientEnabled()) {
        stopLoop();
        return;
    }
    if (isRunning) return;
    isRunning = true;
    lastDrawTime = 0;
    animFrameId = requestAnimationFrame(renderLoop);
}

function stopLoop() {
    isRunning = false;
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
        if (currentVideo) {
            const events = ['play', 'playing', 'timeupdate', 'canplay', 'loadeddata', 'seeked', 'ratechange'];
            events.forEach(evt => currentVideo.removeEventListener(evt, handleVideoActivity));
            currentVideo = null;
        }
        return;
    }
    if (!video || video === currentVideo) return;

    const events = ['play', 'playing', 'timeupdate', 'canplay', 'loadeddata', 'seeked', 'ratechange'];

    if (currentVideo) {
        events.forEach(evt => currentVideo.removeEventListener(evt, handleVideoActivity));
    }

    currentVideo = video;
    events.forEach(evt => currentVideo.addEventListener(evt, handleVideoActivity, { passive: true }));

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
        document.documentElement.classList.remove('ytc-masthead-scrolled');
        return;
    }
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const isScrolled = scrollY > 60;
    document.documentElement.classList.toggle('ytc-masthead-scrolled', isScrolled);
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
        if (ambientWrapper) ambientWrapper.classList.remove('ytc-ambient-active');
        return;
    }

    isPausedAndDrawn = false;
    setTimeout(() => {
        if (!isAmbientEnabled()) return;
        ensureAmbientCanvas();
        const v = findActiveVideo();
        if (v) attachVideo(v);
        startLoop();
    }, 200);

    setTimeout(() => {
        if (!isAmbientEnabled()) return;
        const v = findActiveVideo();
        if (v && isRunning) drawFrame(v);
    }, 700);
}

export function applyAmbientLightingState() {
    if (!isAmbientEnabled()) {
        stopLoop();
        hasDrawnFirstFrame = false;
        isPausedAndDrawn = false;
        document.documentElement.classList.remove('ytc-ambient-lighting');
        document.documentElement.classList.remove('ytc-ambient-ready');
        document.documentElement.classList.remove('ytc-masthead-scrolled');
        if (document.body) {
            document.body.classList.remove('ytc-ambient-lighting');
        }
        if (ambientWrapper) {
            ambientWrapper.classList.remove('ytc-ambient-active');
            ambientWrapper.style.display = 'none';
        }
        const existing = document.getElementById('ytc-ambient-wrapper');
        if (existing) {
            existing.classList.remove('ytc-ambient-active');
            existing.style.display = 'none';
        }
        if (ambientSpreadCtx) {
            ambientSpreadCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        if (currentVideo) {
            const events = ['play', 'playing', 'timeupdate', 'canplay', 'loadeddata', 'seeked', 'ratechange'];
            events.forEach(evt => currentVideo.removeEventListener(evt, handleVideoActivity));
            currentVideo = null;
        }
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

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', () => {
        if (!isAmbientEnabled()) return;
        const v = findActiveVideo();
        if (v && isRunning) drawFrame(v);
    });
    window.addEventListener('fullscreenchange', () => {
        if (!isAmbientEnabled()) return;
        const v = findActiveVideo();
        if (v && isRunning) drawFrame(v);
    });
    window.addEventListener('scroll', handleScroll, { passive: true });

    window.addEventListener('yt-navigate-finish', handleNavigation);
    window.addEventListener('yt-page-data-updated', handleNavigation);
    window.addEventListener('popstate', handleNavigation);

    const observer = new MutationObserver(() => {
        if (!isAmbientEnabled()) return;
        const video = findActiveVideo();
        if (video && video !== currentVideo) {
            attachVideo(video);
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    applyAmbientLightingState();
}
