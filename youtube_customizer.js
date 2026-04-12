(function() {
    'use strict';
    
    // ==================================================
    // PHẦN 1: CÁC THAY ĐỔI CSS
    // ==================================================
    function addColumnStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = `
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: 4 !important;
            }
            /* Khi đang tua: Ẩn thanh Play/Pause VÀ ẩn con trỏ chuột */
            #movie_player.seeking-mode .ytp-chrome-bottom,
            #movie_player.seeking-mode .ytp-gradient-bottom,
            #movie_player.seeking-mode .ytp-chrome-top {
                opacity: 0 !important;
            }
            /* Ẩn chuột khi đang tua */
            #movie_player.seeking-mode {
                cursor: none !important;
            }

            /* CHẾ ĐỘ TÀNG HÌNH KHI CÓ QUẢNG CÁO */
            #movie_player.ad-showing video,
            #movie_player.ad-interrupting video {
                opacity: 0 !important;
                filter: brightness(0) !important;
            }
            #movie_player.ad-showing::after,
            #movie_player.ad-interrupting::after {
                content: "Đang bỏ qua quảng cáo...";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: rgba(255, 255, 255, 0.7);
                font-size: 18px;
                font-family: sans-serif;
                z-index: 1000;
                pointer-events: none;
            }
            /* Ẩn các bảng thông báo "Sự cố gián đoạn", "Premium", "Khảo sát" rác */
            ytd-mealbar-promo-renderer,
            ytd-upsell-dialog-renderer,
            yt-notification-action-renderer,
            #premium-container {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addColumnStyles);
    } else {
        addColumnStyles();
    }


    // ==================================================
    // PHẦN 2: CHỨC NĂNG LOGIC
    // ==================================================
    window.addEventListener('load', () => {
        let logoObserver;

        // --- 2.1: LOGO PREMIUM & CUỘN LÊN ĐẦU ---
        function modifyAndSetupLogo(ytdLogos) {
            // Fix TrustedHTML cho Chrome
            if (window.trustedTypes && trustedTypes.createPolicy && !trustedTypes.defaultPolicy) {
                const passThroughFn = (x) => x;
                trustedTypes.createPolicy('default', {
                    createHTML: passThroughFn, createScriptURL: passThroughFn, createScript: passThroughFn,
                });
            }

            ytdLogos.forEach(ytdLogo => {
                const ytdLogoSvg = ytdLogo.querySelector("svg");
                const logoLink = ytdLogo.closest('ytd-topbar-logo-renderer'); 

                if (ytdLogoSvg) {
                    ytdLogoSvg.setAttribute('width', '101');
                    ytdLogoSvg.setAttribute('height', '20'); 
                    ytdLogoSvg.setAttribute('viewBox', '0 0 101 20');
                    const logoWrapper = ytdLogoSvg.closest('ytd-logo');
                    if(logoWrapper) logoWrapper.setAttribute('is-red-logo', '');
                    
                    ytdLogoSvg.innerHTML = '<g><path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"/><path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"/></g><g id="youtube-paths_yt19"><path d="M32.1819 2.10016V18.9002H34.7619V12.9102H35.4519C38.8019 12.9102 40.5619 11.1102 40.5619 7.57016V6.88016C40.5619 3.31016 39.0019 2.10016 35.7219 2.10016H32.1819ZM37.8619 7.63016C37.8619 10.0002 37.1419 11.0802 35.4019 11.0802H34.7619V3.95016H35.4519C37.4219 3.95016 37.8619 4.76016 37.8619 7.13016V7.63016Z"/><path d="M41.982 18.9002H44.532V10.0902C44.952 9.37016 45.992 9.05016 47.302 9.32016L47.462 6.33016C47.292 6.31016 47.142 6.29016 47.002 6.29016C45.802 6.29016 44.832 7.20016 44.342 8.86016H44.162L43.952 6.54016H41.982V18.9002Z"/><path d="M55.7461 11.5002C55.7461 8.52016 55.4461 6.31016 52.0161 6.31016C48.7861 6.31016 48.0661 8.46016 48.0661 11.6202V13.7902C48.0661 16.8702 48.7261 19.1102 51.9361 19.1102C54.4761 19.1102 55.7861 17.8402 55.6361 15.3802L53.3861 15.2602C53.3561 16.7802 53.0061 17.4002 51.9961 17.4002C50.7261 17.4002 50.6661 16.1902 50.6661 14.3902V13.5502H55.7461V11.5002ZM51.9561 7.97016C53.1761 7.97016 53.2661 9.12016 53.2661 11.0702V12.0802H50.6661V11.0702C50.6661 9.14016 50.7461 7.97016 51.9561 7.97016Z"/><path d="M60.1945 18.9002V8.92016C60.5745 8.39016 61.1945 8.07016 61.7945 8.07016C62.5645 8.07016 62.8445 8.61016 62.8445 9.69016V18.9002H65.5045L65.4845 8.93016C65.8545 8.37016 66.4845 8.04016 67.1045 8.04016C67.7745 8.04016 68.1445 8.61016 68.1445 9.69016V18.9002H70.8045V9.49016C70.8045 7.28016 70.0145 6.27016 68.3445 6.27016C67.1845 6.27016 66.1945 6.69016 65.2845 7.67016C64.9045 6.76016 64.1545 6.27016 63.0845 6.27016C61.8745 6.27016 60.7345 6.79016 59.9345 7.76016H59.7845L59.5945 6.54016H57.5445V18.9002H60.1945Z"/><path d="M74.0858 4.97016C74.9858 4.97016 75.4058 4.67016 75.4058 3.43016C75.4058 2.27016 74.9558 1.91016 74.0858 1.91016C73.2058 1.91016 72.7758 2.23016 72.7758 3.43016C72.7758 4.67016 73.1858 4.97016 74.0858 4.97016ZM72.8658 18.9002H75.3958V6.54016H72.8658V18.9002Z"/><path d="M79.9516 19.0902C81.4116 19.0902 82.3216 18.4802 83.0716 17.3802H83.1816L83.2916 18.9002H85.2816V6.54016H82.6416V16.4702C82.3616 16.9602 81.7116 17.3202 81.1016 17.3202C80.3316 17.3202 80.0916 16.7102 80.0916 15.6902V6.54016H77.4616V15.8102C77.4616 17.8202 78.0416 19.0902 79.9516 19.0902Z"/><path d="M90.0031 18.9002V8.92016C90.3831 8.39016 91.0031 8.07016 91.6031 8.07016C92.3731 8.07016 92.6531 8.61016 92.6531 9.69016V18.9002H95.3131L95.2931 8.93016C95.6631 8.37016 96.2931 8.04016 96.9131 8.04016C97.5831 8.04016 97.9531 8.61016 97.9531 9.69016V18.9002H100.613V9.49016C100.613 7.28016 99.8231 6.27016 98.1531 6.27016C96.9931 6.27016 96.0031 6.69016 95.0931 7.67016C94.7131 6.76016 93.9631 6.27016 92.8931 6.27016C91.6831 6.27016 90.5431 6.79016 89.7431 7.76016H89.5931L89.4031 6.54016H87.3531V18.9002H90.0031Z"/></g>';
                }
                
                const clickable = logoLink ? logoLink.querySelector('a') || logoLink : null;
                if (clickable && !clickable.dataset.hasScrollFix) {
                    clickable.dataset.hasScrollFix = "true";
                    clickable.addEventListener('click', function(e) {
                        if (clickable.href === "https://www.youtube.com/" || clickable.getAttribute('href') === '/') {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    });
                }
            });
            if (logoObserver) logoObserver.disconnect();
        }

        function checkYtIconExistence() {
            let ytdLogos = document.querySelectorAll("ytd-logo > yt-icon > span > div");
            if (ytdLogos.length > 0) {
                 setTimeout(() => {
                    ytdLogos = document.querySelectorAll("ytd-logo > yt-icon > span > div");
                    modifyAndSetupLogo(ytdLogos);
                }, 50);
            }
        }
        logoObserver = new MutationObserver(checkYtIconExistence);
        logoObserver.observe(document.body, {childList: true, subtree: true});
        checkYtIconExistence();
        

        // --- 2.1b: FIX SCROLL (V2 - MẠNH MẼ HƠN) ---
        
        // Hàm cuộn cưỡng bức (Chạy nhiều lần để thắng cơ chế giữ trang của YT)
        function forceScrollTop() {
            window.scrollTo({ top: 0, behavior: 'instant' }); 
            // Thử lại liên tục trong 500ms
            let attempts = 0;
            const interval = setInterval(() => {
                if (window.scrollY > 5) { // Nếu vẫn bị trôi xuống
                    window.scrollTo({ top: 0, behavior: 'instant' });
                }
                attempts++;
                if (attempts > 10) clearInterval(interval);
            }, 50);
        }

        // Bắt sự kiện INPUT và CLICK ngay lập tức
        function setupInteractiveSearch() {
            const searchBtn = document.querySelector('#search-icon-legacy');
            const searchInput = document.querySelector('input#search');

            if (searchBtn && !searchBtn.dataset.hasSearchScrollFix) {
                searchBtn.dataset.hasSearchScrollFix = "true";
                searchBtn.addEventListener('click', forceScrollTop);
            }
            if (searchInput && !searchInput.dataset.hasEnterScrollFix) {
                searchInput.dataset.hasEnterScrollFix = "true";
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') forceScrollTop();
                });
            }
        }
        setInterval(setupInteractiveSearch, 1000);

        // Bắt sự kiện DATA UPDATED (Khi list video mới hiện ra)
        // Đây là "Chìa khóa" cho việc tìm kiếm liên tiếp
        document.addEventListener('yt-page-data-updated', function() {
            if (location.pathname === '/results') {
                forceScrollTop();
            }
        });
        
        // Backup bằng navigate-finish
        document.addEventListener('yt-navigate-finish', function() {
            if (location.pathname === '/results') {
                forceScrollTop();
            }
        });


        // --- 2.2: LOGIC TUA VIDEO & ẨN GIAO DIỆN & CHUỘT ---
        function initLiteSeek() {
            const player = document.querySelector('#movie_player');
            if (!player) return;

            let lastKeyTime = 0;

            document.addEventListener('keydown', (e) => {
                const target = e.target;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

                let isSeekAction = false;
                
                // --- XỬ LÝ PHÍM NUMPAD (Bất kể Num Lock) ---
                const isNumpad = (e.location === 3);
                let captured = false;

                const player = document.querySelector('#movie_player');

                // Numpad 8 (Tăng âm lượng)
                if (isNumpad && (e.key === '8' || e.key === 'ArrowUp' || e.code === 'Numpad8')) {
                    captured = true;
                    if (player && typeof player.setVolume === 'function') {
                        player.setVolume(Math.min(100, player.getVolume() + 5));
                        // Hiển thị thanh âm lượng (UI)
                        if (typeof player.volumeUp === 'function') player.volumeUp(); 
                        else player.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', keyCode: 38, bubbles: true }));
                    }
                }
                // Numpad 2 (Giảm âm lượng)
                else if (isNumpad && (e.key === '2' || e.key === 'ArrowDown' || e.code === 'Numpad2')) {
                    captured = true;
                    if (player && typeof player.setVolume === 'function') {
                        player.setVolume(Math.max(0, player.getVolume() - 5));
                        // Hiển thị thanh âm lượng (UI)
                        if (typeof player.volumeDown === 'function') player.volumeDown();
                        else player.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true }));
                    }
                }
                // Numpad 4 (Lùi 10s)
                else if (isNumpad && (e.key === '4' || e.key === 'ArrowLeft' || e.code === 'Numpad4')) {
                    captured = true;
                    const ev = new KeyboardEvent('keydown', { key: 'j', code: 'KeyJ', keyCode: 74, which: 74, bubbles: true, cancelable: true });
                    document.dispatchEvent(ev);
                    isSeekAction = true;
                } 
                // Numpad 5 (Play/Pause)
                else if (isNumpad && (e.key === '5' || e.key === 'Clear' || e.code === 'Numpad5' || e.keyCode === 12)) {
                    captured = true;
                    const ev = new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', keyCode: 75, which: 75, bubbles: true, cancelable: true });
                    document.dispatchEvent(ev);
                }
                // Numpad 6 (Tiến 10s)
                else if (isNumpad && (e.key === '6' || e.key === 'ArrowRight' || e.code === 'Numpad6')) {
                    captured = true;
                    const ev = new KeyboardEvent('keydown', { key: 'l', code: 'KeyL', keyCode: 76, which: 76, bubbles: true, cancelable: true });
                    document.dispatchEvent(ev);
                    isSeekAction = true;
                }
                // Các phím còn lại (1, 3, 7, 9): Chặn hoàn toàn để tránh bấm nhầm
                else if (isNumpad && ['1', '3', '7', '9', 'End', 'PageDown', 'Home', 'PageUp'].includes(e.key)) {
                    captured = true;
                }

                if (captured) {
                    e.preventDefault();
                    e.stopPropagation();
                } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'j', 'l', 'J', 'L', 'k', 'K'].includes(e.key)) {
                    isSeekAction = (['j', 'l', 'ArrowLeft', 'ArrowRight'].includes(e.key));
                }

                if (isSeekAction) {
                    lastKeyTime = Date.now();
                    player.classList.add('seeking-mode');
                }
            }, true);

            document.addEventListener('mousemove', () => {
                if (Date.now() - lastKeyTime < 500) return;
                player.classList.remove('seeking-mode');
            }, true);
        }
        
        const intervalCheck = setInterval(() => {
            const player = document.querySelector('#movie_player');
            if (player) { initLiteSeek(); clearInterval(intervalCheck); }
        }, 500);


        // --- 2.3: AUTO-ESC ---
        let isPageUnsafe = true;
        setTimeout(() => { isPageUnsafe = false; }, 2500);

        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement && isPageUnsafe) {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            }
        });

        const waitForApp = setInterval(() => {
            const app = document.querySelector('ytd-watch-flexy');
            if (app) {
                clearInterval(waitForApp);
                const theaterObserver = new MutationObserver(() => {
                    if (isPageUnsafe && app.hasAttribute('theater')) {
                        const sizeBtn = document.querySelector('.ytp-size-button');
                        if (sizeBtn) sizeBtn.click();
                    }
                });
                theaterObserver.observe(app, { attributes: true, attributeFilter: ['theater'] });
            }
        }, 500);
        

        // --- 2.4: AUTO SKIP ADS (TỐI ƯU TRÁNH PHÁT HIỆN) ---
        let originalPlaybackRate = 1;

        setInterval(() => {
            const player = document.querySelector('#movie_player');
            if (!player) return;

            const video = player.querySelector('video');
            if (!video) return;

            // 1. Kiểm tra nếu đang có quảng cáo
            if (player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting')) {
                // Lưu lại tốc độ người dùng đang xem nếu chưa lưu
                if (video.playbackRate !== 16) originalPlaybackRate = video.playbackRate;
                
                // Thuật toán "Tua nhưng không Nhảy": Giữ 16x để lướt qua cực nhanh mà không bị bắt bài
                video.muted = true;
                video.playbackRate = 16;

                // Nhấn nút Skip ngay khi có thể
                const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .videoAdUiSkipButton, .ytp-ad-skip-button-slot');
                if (skipBtn) skipBtn.click();
            } else {
                // Khi hết quảng cáo, trả lại tốc độ và âm thanh ban đầu
                if (video.playbackRate === 16) {
                    video.playbackRate = originalPlaybackRate;
                    video.muted = false;
                }
            }

            // 2. Tự động đóng bảng cảnh báo "YouTube không cho phép chặn quảng cáo"
            const adblockModal = document.querySelector('ytd-enforcement-message-view-model, tp-yt-paper-dialog');
            if (adblockModal) {
                // Tìm nút đóng (X)
                const closeBtn = adblockModal.querySelector('yt-icon-button#dismiss-button, button[aria-label="Close"], #dismiss-button');
                if (closeBtn) {
                    closeBtn.click();
                    console.log('Antigravity: Đã đóng bảng cảnh báo Adblock.');
                } else {
                    // Nếu không tìm thấy nút đóng, ta ẩn luôn cái bảng và lớp phủ để xem tiếp
                    adblockModal.style.display = 'none';
                    const backdrop = document.querySelector('tp-yt-iron-overlay-backdrop');
                    if (backdrop) backdrop.style.display = 'none';
                    // Đôi khi cần nhấn nút Play lại
                    if (video.paused) video.play();
                }
            }

            // 3. Đóng banner nhỏ đè lên video
            const closeOverlay = document.querySelector('.ytp-ad-overlay-close-button');
            if (closeOverlay) closeOverlay.click();
        }, 500);


        // --- 2.5: AUTO CONFIRM "STILL WATCHING" ---
        // Sử dụng MutationObserver để tối ưu hiệu năng (chỉ chạy khi có thay đổi trên trang)
        const setupConfirmObserver = () => {
            const observerTarget = document.querySelector('ytd-app') || document.body;
            if (!observerTarget) return;

            const confirmObserver = new MutationObserver((mutations) => {
                // Kiểm tra xem có element mới được thêm vào không
                const confirmBtn = document.querySelector('yt-confirm-dialog-renderer yt-button-renderer#confirm-button, #confirm-button.yt-confirm-dialog-renderer, ytd-popup-container yt-button-renderer#confirm-button');
                
                if (confirmBtn && confirmBtn.offsetParent !== null) {
                    const btnText = confirmBtn.innerText || confirmBtn.textContent;
                    if (btnText && (btnText.includes('Có') || btnText.includes('Yes') || btnText.includes('CONTINUE'))) {
                        confirmBtn.click();
                        console.log('Antigravity: Đã tự động nhấn "Có" (via Observer).');
                        
                        const video = document.querySelector('video');
                        if (video && video.paused) {
                            video.play();
                        }
                    }
                }
            });

            confirmObserver.observe(observerTarget, { childList: true, subtree: true });
        };

        // Chạy ngay khi có thể
        if (document.querySelector('ytd-app')) {
            setupConfirmObserver();
        } else {
            const checkAppInterval = setInterval(() => {
                if (document.querySelector('ytd-app')) {
                    setupConfirmObserver();
                    clearInterval(checkAppInterval);
                }
            }, 500);
        }

    });
})();
