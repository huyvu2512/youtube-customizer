// ==========================================================================
// YOUTUBE AMBILIGHT CINEMA - CONTENT SCRIPT
// - 4-Border Edge Bleeding: Khung màu ăn khớp 100% mép viền video tiếp giáp
// - Vertical Glow Columns: Các ô dải màu dóng dọc lan sâu xuống giữa trang
// - Transparent Masthead: Xuyên thấu ở đỉnh trang, tự động hoàn nguyên khi cuộn
// - Zero White Bug: Không bao giờ bị lỗi nền trắng
// - Hardware Compositing 60 FPS siêu nhẹ
// ==========================================================================

(() => {
    let config = {
        enabled: true,
        blur: 34,
        spread: 155,
        saturate: 145,
        brightness: 110,
        transparentMasthead: true
    };

    let ambientWrapper = null;
    let ambientSpreadCanvas = null;
    let ambientAccentCanvas = null;
    let ambientSpreadCtx = null;
    let ambientAccentCtx = null;
    let animFrameId = null;
    let isRunning = false;
    let lastDrawTime = 0;
    let currentVideo = null;
    let intersectionObserver = null;
    let resizeObserver = null;
    let isIntersecting = true;
    let hasDrawnFirstFrame = false;

    // Kích thước canvas hình học
    const CANVAS_WIDTH = 320;
    const CANVAS_HEIGHT = 400;
    const VX = 40;  // Đệm lề trái trong canvas
    const VY = 36;  // Đệm lề trên trong canvas (hắt lên Masthead)
    const VW = 240; // Bề rộng video 16:9
    const VH = 135; // Bề cao video 16:9 (240 * 9 / 16 = 135)
    // Phần đệm lề dưới: 400 - (36 + 135) = 229px (gấp 1.7x chiều cao video, lan sâu xuống giữa trang)
    const TARGET_INTERVAL = 1000 / 24; // 24 FPS mượt mà

    function applyCssTokens() {
        document.documentElement.style.setProperty('--ytc-ambient-blur', `${config.blur}px`);
        document.documentElement.style.setProperty('--ytc-ambient-saturate', `${config.saturate}%`);
        document.documentElement.style.setProperty('--ytc-ambient-brightness', `${config.brightness}%`);
        document.documentElement.classList.toggle('ytc-no-transparent-masthead', !config.transparentMasthead);
    }

    function loadConfig() {
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['ytc_ambilight_config'], (res) => {
                if (res && res.ytc_ambilight_config) {
                    config = Object.assign(config, res.ytc_ambilight_config);
                }
                applyCssTokens();
                applyState();
            });
        } else {
            applyCssTokens();
            applyState();
        }
    }

    if (chrome && chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener((changes) => {
            if (changes.ytc_ambilight_config && changes.ytc_ambilight_config.newValue) {
                config = Object.assign(config, changes.ytc_ambilight_config.newValue);
                applyCssTokens();
                applyState();
                updateAmbientPosition();
            }
        });
    }

    /**
     * Cập nhật vị trí và kích thước canvas bám chuẩn xác tuyệt đối theo Video Player
     */
    function updateAmbientPosition() {
        if (!ambientSpreadCanvas || !ambientWrapper) return;
        const moviePlayer = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        const watchFlexy = document.querySelector('ytd-watch-flexy');

        if (!moviePlayer) return;

        const videoEl = currentVideo || moviePlayer.querySelector('video.html5-main-video') || moviePlayer.querySelector('video');
        const playerRect = moviePlayer.getBoundingClientRect();
        const wrapperRect = ambientWrapper.getBoundingClientRect();

        if (playerRect.width === 0 || playerRect.height === 0) return;

        let targetRect = playerRect;
        if (videoEl && videoEl.clientWidth > 0 && videoEl.clientHeight > 0 &&
            (Math.abs(videoEl.clientWidth - playerRect.width) > 6 || Math.abs(videoEl.clientHeight - playerRect.height) > 6)) {
            targetRect = videoEl.getBoundingClientRect();
        }

        const pLeft = targetRect.left - wrapperRect.left;
        const pTop = targetRect.top - wrapperRect.top;
        const pWidth = targetRect.width;
        const pHeight = targetRect.height;

        const scaleX = pWidth / VW;
        const scaleY = (pHeight / VH) * (config.spread / 100);

        const cW = Math.round(CANVAS_WIDTH * scaleX);
        const cH = Math.round(CANVAS_HEIGHT * scaleY);
        const cLeft = Math.round(pLeft - (VX * scaleX));
        const cTop = Math.round(pTop - (VY * scaleY));

        const setPos = (c) => {
            if (!c) return;
            c.style.top = `${cTop}px`;
            c.style.left = `${cLeft}px`;
            c.style.width = `${cW}px`;
            c.style.height = `${cH}px`;
        };
        setPos(ambientSpreadCanvas);
        setPos(ambientAccentCanvas);
    }

    /**
     * Khởi tạo hoặc gắn canvas vào tầng nền của trang xem video
     */
    function ensureAmbientCanvas() {
        const moviePlayer = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        if (!moviePlayer) return null;

        const watchFlexy = document.querySelector('ytd-watch-flexy');
        const targetParent = watchFlexy || moviePlayer.parentElement;
        if (!targetParent) return null;

        if (!ambientWrapper || !ambientWrapper.isConnected || ambientWrapper.parentElement !== targetParent) {
            let existing = document.getElementById('ytc-ambient-wrapper');
            if (existing) existing.remove();

            ambientWrapper = document.createElement('div');
            ambientWrapper.id = 'ytc-ambient-wrapper';
            ambientWrapper.setAttribute('aria-hidden', 'true');

            ambientSpreadCanvas = document.createElement('canvas');
            ambientSpreadCanvas.id = 'ytc-ambient-spread-canvas';
            ambientSpreadCanvas.width = CANVAS_WIDTH;
            ambientSpreadCanvas.height = CANVAS_HEIGHT;

            ambientAccentCanvas = document.createElement('canvas');
            ambientAccentCanvas.id = 'ytc-ambient-accent-canvas';
            ambientAccentCanvas.width = CANVAS_WIDTH;
            ambientAccentCanvas.height = CANVAS_HEIGHT;

            ambientWrapper.appendChild(ambientSpreadCanvas);
            ambientWrapper.appendChild(ambientAccentCanvas);

            if (watchFlexy) {
                watchFlexy.insertBefore(ambientWrapper, watchFlexy.firstChild);
            } else {
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

        updateAmbientPosition();

        if (!resizeObserver && moviePlayer) {
            try {
                resizeObserver = new ResizeObserver(() => {
                    updateAmbientPosition();
                });
                resizeObserver.observe(moviePlayer);
            } catch (e) {}
        }

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

        return ambientSpreadCanvas;
    }

    function shouldBeActive() {
        if (!config.enabled) return false;
        if (document.hidden) return false;
        if (!isIntersecting) return false;
        if (!currentVideo || currentVideo.paused || currentVideo.ended || currentVideo.readyState < 2) return false;
        return true;
    }

    /**
     * Vòng lặp render siêu nhẹ với thuật toán 4-Border Edge Bleeding:
     * - Mép dưới dóng thẳng xuống tạo dải màu dọc ("các ô dải màu" chuẩn Cinema ảnh 4)
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

        if (ambientSpreadCtx && ambientAccentCtx) {
            try {
                const vW = currentVideo.videoWidth || 16;
                const vH = currentVideo.videoHeight || 9;
                const pW = currentVideo.clientWidth || vW;
                const pH = currentVideo.clientHeight || vH;

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

                // 1. Vẽ video thật vào khung trung tâm [VX, VY, VW, VH]
                ambientSpreadCtx.drawImage(currentVideo, sX, sY, sW, sH, VX, VY, VW, VH);

                // 2. Kéo dãn màu 4 mép ăn khớp 100% với khung video:
                // Mép trên: Kéo thẳng lên đỉnh y=0 (xuyên qua Masthead)
                ambientSpreadCtx.drawImage(ambientSpreadCanvas, VX, VY, VW, 3, VX, 0, VW, VY);
                ambientSpreadCtx.drawImage(ambientSpreadCanvas, VX, VY, 3, 3, 0, 0, VX, VY);
                ambientSpreadCtx.drawImage(ambientSpreadCanvas, VX + VW - 3, VY, 3, 3, VX + VW, 0, CANVAS_WIDTH - (VX + VW), VY);

                // Mép trái: Kéo dãn sang trái x=0
                ambientSpreadCtx.drawImage(ambientSpreadCanvas, VX, VY, 3, VH, 0, VY, VX, VH);

                // Mép phải: Kéo dãn sang phải CANVAS_WIDTH
                ambientSpreadCtx.drawImage(ambientSpreadCanvas, VX + VW - 3, VY, 3, VH, VX + VW, VY, CANVAS_WIDTH - (VX + VW), VH);

                // Mép dưới: Kéo dãn thẳng xuống dưới tận CANVAS_HEIGHT tạo các dải dóng màu ("các ô dải màu ý" chuẩn ảnh 4)
                const bottomY = VY + VH;
                const bottomH = CANVAS_HEIGHT - bottomY;
                ambientSpreadCtx.drawImage(ambientSpreadCanvas, VX, bottomY - 3, VW, 3, VX, bottomY, VW, bottomH);
                ambientSpreadCtx.drawImage(ambientSpreadCanvas, VX, bottomY - 3, 3, 3, 0, bottomY, VX, bottomH);
                ambientSpreadCtx.drawImage(ambientSpreadCanvas, VX + VW - 3, bottomY - 3, 3, 3, VX + VW, bottomY, CANVAS_WIDTH - (VX + VW), bottomH);

                // 3. Sao chép sang canvas hào quang Accent
                ambientAccentCtx.drawImage(ambientSpreadCanvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                // 4. Kích hoạt trạng thái sẵn sàng (Zero-White-Flash)
                if (!hasDrawnFirstFrame) {
                    hasDrawnFirstFrame = true;
                    if (ambientWrapper) ambientWrapper.classList.add('ytc-ambient-active');
                    document.documentElement.classList.add('ytc-ambient-ready');
                }
            } catch (e) {}
        }
    }

    function startLoop() {
        if (isRunning) return;
        if (!shouldBeActive()) return;

        isRunning = true;
        lastDrawTime = performance.now();
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

    function handleVisibilityChange() {
        if (document.hidden) {
            stopLoop();
        } else {
            if (shouldBeActive()) startLoop();
        }
    }

    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const isScrolled = scrollY > 80;
        document.documentElement.classList.toggle('ytc-masthead-scrolled', isScrolled);
        updateAmbientPosition();
    }

    function applyState() {
        if (!config.enabled) {
            stopLoop();
            hasDrawnFirstFrame = false;
            document.documentElement.classList.remove('ytc-ambient-ready');
            document.documentElement.classList.remove('ytc-masthead-scrolled');
            if (ambientWrapper) {
                ambientWrapper.classList.remove('ytc-ambient-active');
                ambientWrapper.style.display = 'none';
            }
            return;
        }

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

    function init() {
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('resize', updateAmbientPosition);
        window.addEventListener('fullscreenchange', updateAmbientPosition);
        window.addEventListener('scroll', handleScroll, { passive: true });

        window.addEventListener('yt-navigate-finish', () => {
            hasDrawnFirstFrame = false;
            document.documentElement.classList.remove('ytc-ambient-ready');
            document.documentElement.classList.remove('ytc-masthead-scrolled');
            if (ambientWrapper) ambientWrapper.classList.remove('ytc-ambient-active');
            setTimeout(() => {
                applyState();
                updateAmbientPosition();
            }, 300);
            setTimeout(updateAmbientPosition, 800);
        });

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

        loadConfig();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
