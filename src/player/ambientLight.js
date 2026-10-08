// ==========================================================================
// TÍNH NĂNG ÁNH SÁNG PHÒNG (AMBIENT LIGHT / AMBILIGHT) SIÊU TỐI ƯU
// - 4-Border Edge Bleeding: Ánh sáng 4 mép ăn khớp 100% với khung hình tiếp giáp
// - Full-Width Masthead Glow: Phủ kín 100% đỉnh trang (kể cả góc phải màn hình)
// - Vertical Glow Columns: Các ô dải màu dóng dọc lan sâu xuống giữa trang
// - Pure Video Sharpness: Tuyệt đối không can thiệp layout của player, video nét 100%
// - Resilient Render Loop: Không bao giờ bị tắt khi buffer hay đổi độ phân giải
// ==========================================================================
import { currentConfig } from '../core/config.js';

let ambientWrapper = null;
let ambientSpreadCanvas = null;
let ambientAccentCanvas = null;
let ambientSpreadCtx = null;
let ambientAccentCtx = null;
let animFrameId = null;
let isRunning = false;
let lastDrawTime = 0;
let currentVideo = null;
let hasDrawnFirstFrame = false;
let isPausedAndDrawn = false;

// Kích thước canvas nội bộ (tỷ lệ chuẩn tối ưu hiệu năng và GPU)
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 440;
const TARGET_INTERVAL = 1000 / 30; // 30 FPS mượt mà & siêu nhẹ

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

            // Lớp 1: Tỏa rộng Full-Screen (Spread Wash)
            ambientSpreadCanvas = document.createElement('canvas');
            ambientSpreadCanvas.id = 'ytc-ambient-spread-canvas';
            ambientSpreadCanvas.width = CANVAS_WIDTH;
            ambientSpreadCanvas.height = CANVAS_HEIGHT;

            // Lớp 2: Hào quang viền sống động sát mép video (Edge Halo)
            ambientAccentCanvas = document.createElement('canvas');
            ambientAccentCanvas.id = 'ytc-ambient-accent-canvas';
            ambientAccentCanvas.width = CANVAS_WIDTH;
            ambientAccentCanvas.height = CANVAS_HEIGHT;

            ambientWrapper.appendChild(ambientSpreadCanvas);
            ambientWrapper.appendChild(ambientAccentCanvas);
        }

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

        ambientAccentCtx = ambientAccentCanvas.getContext('2d', {
            alpha: true,
            willReadFrequently: false
        });
        if (ambientAccentCtx) {
            ambientAccentCtx.imageSmoothingEnabled = true;
            ambientAccentCtx.imageSmoothingQuality = 'medium';
        }
    }

    return !!(ambientSpreadCtx && ambientAccentCtx);
}

/**
 * Vẽ một khung hình Ambilight:
 * - Tràn màu toàn bộ dải Masthead (kể cả góc phải màn hình)
 * - Dóng dải màu dọc xuống dưới ("các ô dải màu ý" chuẩn Cinema)
 * - Khoét rỗng vùng video thật để video sắc nét 100% nguyên bản
 */
function drawFrame(video) {
    if (!ensureAmbientCanvas()) return;
    if (!ambientSpreadCtx || !ambientAccentCtx) return;

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
        const wrapH = wrapperRect.height || 1200;

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

        // Xóa sạch canvas trước khi vẽ
        ambientSpreadCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const rightW = Math.max(0, CANVAS_WIDTH - (cvX + cvW));

        // 1. MÉP TRÊN (Lan tỏa lên toàn bộ thanh Masthead phía trên):
        if (cvY > 0) {
            // - Dải trực diện phía trên video
            ambientSpreadCtx.drawImage(video, sX, sY, sW, 4, cvX, 0, cvW, cvY);
            // - Góc trên bên trái (chạm viền trái màn hình)
            if (cvX > 0) {
                ambientSpreadCtx.drawImage(video, sX, sY, 4, 4, 0, 0, cvX, cvY);
            }
            // - GÓC TRÊN BÊN PHẢI (LAN TỎA QUA TOÀN BỘ GÓC PHẢI MÀN HÌNH - PHÍA TRÊN NÚT TẠO/AVATAR/CHAT)
            if (rightW > 0) {
                ambientSpreadCtx.drawImage(video, sX + sW - 4, sY, 4, 4, cvX + cvW, 0, rightW, cvY);
            }
        }

        // 2. HAI BÊN HÔNG (Trái & Phải khung video):
        if (cvH > 0) {
            if (cvX > 0) {
                ambientSpreadCtx.drawImage(video, sX, sY, 4, sH, 0, cvY, cvX, cvH);
            }
            if (rightW > 0) {
                ambientSpreadCtx.drawImage(video, sX + sW - 4, sY, 4, sH, cvX + cvW, cvY, rightW, cvH);
            }
        }

        // 3. MÉP DƯỚI (DÓNG CÁC Ô DẢI MÀU DỌC LAN SÂU XUỐNG DƯỚI TRANG):
        const bottomY = cvY + cvH;
        const bottomH = Math.max(0, CANVAS_HEIGHT - bottomY);
        if (bottomH > 0) {
            // Dải dóng màu thẳng từ mép dưới video xuống
            ambientSpreadCtx.drawImage(video, sX, sY + sH - 4, sW, 4, cvX, bottomY, cvW, bottomH);
            // Góc dưới trái
            if (cvX > 0) {
                ambientSpreadCtx.drawImage(video, sX, sY + sH - 4, 4, 4, 0, bottomY, cvX, bottomH);
            }
            // Góc dưới phải
            if (rightW > 0) {
                ambientSpreadCtx.drawImage(video, sX + sW - 4, sY + sH - 4, 4, 4, cvX + cvW, bottomY, rightW, bottomH);
            }
        }

        // 4. KHOÉT RỖNG VÙNG VIDEO THẬT:
        ambientSpreadCtx.clearRect(cvX, cvY, cvW, cvH);

        // 5. Sao chép sang Accent Canvas để tạo hào quang viền kép
        ambientAccentCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ambientAccentCtx.drawImage(ambientSpreadCanvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ambientAccentCtx.clearRect(cvX, cvY, cvW, cvH);

        // 6. Kích hoạt trạng thái hiển thị
        if (!hasDrawnFirstFrame) {
            hasDrawnFirstFrame = true;
            if (ambientWrapper) ambientWrapper.classList.add('ytc-ambient-active');
            document.documentElement.classList.add('ytc-ambient-lighting');
            document.documentElement.classList.add('ytc-ambient-ready');
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

    animFrameId = requestAnimationFrame(renderLoop);

    if (!currentConfig.ambientLighting || currentConfig.audioOnlyMode) return;

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
    if (isRunning) return;
    isRunning = true;
    lastDrawTime = 0;
    animFrameId = requestAnimationFrame(renderLoop);
}

function stopLoop() {
    if (!isRunning) return;
    isRunning = false;
    if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
}

function handleVideoActivity() {
    isPausedAndDrawn = false;
    if (!isRunning) {
        startLoop();
    }
}

function attachVideo(video) {
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
        isPausedAndDrawn = false;
        startLoop();
    }
}

function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const isScrolled = scrollY > 60;
    document.documentElement.classList.toggle('ytc-masthead-scrolled', isScrolled);
}

function handleNavigation() {
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
        ensureAmbientCanvas();
        const v = findActiveVideo();
        if (v) attachVideo(v);
        startLoop();
    }, 200);

    setTimeout(() => {
        const v = findActiveVideo();
        if (v && isRunning) drawFrame(v);
    }, 700);
}

export function applyAmbientLightingState() {
    if (!currentConfig.ambientLighting || currentConfig.audioOnlyMode) {
        stopLoop();
        hasDrawnFirstFrame = false;
        document.documentElement.classList.remove('ytc-ambient-lighting');
        document.documentElement.classList.remove('ytc-ambient-ready');
        document.documentElement.classList.remove('ytc-masthead-scrolled');
        if (ambientWrapper) {
            ambientWrapper.classList.remove('ytc-ambient-active');
            ambientWrapper.style.display = 'none';
        }
        return;
    }

    document.documentElement.classList.add('ytc-ambient-lighting');
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
        const v = findActiveVideo();
        if (v && isRunning) drawFrame(v);
    });
    window.addEventListener('fullscreenchange', () => {
        const v = findActiveVideo();
        if (v && isRunning) drawFrame(v);
    });
    window.addEventListener('scroll', handleScroll, { passive: true });

    window.addEventListener('yt-navigate-finish', handleNavigation);
    window.addEventListener('yt-page-data-updated', handleNavigation);
    window.addEventListener('popstate', handleNavigation);

    const observer = new MutationObserver(() => {
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
