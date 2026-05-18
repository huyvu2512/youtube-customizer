(function() {
    'use strict';
    
    // ==================================================
    // PHẦN 1: CÁC THAY ĐỔI CSS (Giao diện & Anti-Lag)
    // ==================================================
    function addCustomStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = `
            /* ---------- ANTI-LAG / TỐI ƯU HIỆU NĂNG ---------- */
            
            /* Khóa Ánh sáng môi trường (Ambient Mode): 
               Xóa bỏ lớp phủ màu phát sáng quanh video gây ngốn GPU & tụt FPS */
            #cinematics, .ytp-ambient-mode-rendering-container {
                display: none !important;
            }
            
            /* Tối ưu Render rảnh tay (Lazy Render):
               Chỉ vẽ bình luận và video đề xuất khi cuộn tới, giúp cuộn trang siêu mượt */
            ytd-comment-thread-renderer,
            ytd-rich-item-renderer,
            ytd-compact-video-renderer {
                content-visibility: auto;
                contain-intrinsic-size: auto 300px;
            }
            
            /* CSS Event Detection (Tối ưu Zero-Overhead):
               Thay vì dùng MutationObserver quét toàn trang gây lag, ta dùng CSS Animation
               để trình duyệt tự báo khi nào Logo hoặc Popup xuất hiện */
            @keyframes nodeInserted {
                from { clip-path: inset(0); }
                to { clip-path: inset(0); }
            }
            ytd-logo yt-icon svg, tp-yt-paper-dialog, ytd-enforcement-message-view-model {
                animation: nodeInserted 0.001s;
            }

            /* ---------- GIAO DIỆN & TRẢI NGHIỆM ---------- */
            
            /* Lưới 4 cột gọn gàng */
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: 4 !important;
            }
            
            /* Chế độ Tua Sạch: Ẩn thanh Play/Pause VÀ ẩn con trỏ chuột */
            #movie_player.seeking-mode .ytp-chrome-bottom,
            #movie_player.seeking-mode .ytp-gradient-bottom,
            #movie_player.seeking-mode .ytp-chrome-top {
                opacity: 0 !important;
            }
            #movie_player.seeking-mode {
                cursor: none !important;
            }

            /* Chế độ Tàng Hình Quảng Cáo */
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
            
            /* Ẩn rác & YouTube Shorts */
            ytd-mealbar-promo-renderer,
            ytd-upsell-dialog-renderer,
            yt-notification-action-renderer,
            #premium-container,
            ytd-rich-shelf-renderer[is-shorts],
            ytd-mini-guide-entry-renderer[aria-label="Shorts"],
            ytd-guide-entry-renderer[title="Shorts"],
            ytd-reel-shelf-renderer,
            #endpoint[title="Shorts"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addCustomStyles);
    } else {
        addCustomStyles();
    }


    // ==================================================
    // PHẦN 2: CHỨC NĂNG LOGIC (Zero-Overhead)
    // ==================================================
    
    const logoSVG = '<g><path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"/><path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"/></g><g id="youtube-paths_yt19"><path d="M32.1819 2.10016V18.9002H34.7619V12.9102H35.4519C38.8019 12.9102H40.5619 11.1102 40.5619 7.57016V6.88016C40.5619 3.31016 39.0019 2.10016 35.7219 2.10016H32.1819ZM37.8619 7.63016C37.8619 10.0002 37.1419 11.0802 35.4019 11.0802H34.7619V3.95016H35.4519C37.4219 3.95016 37.8619 4.76016 37.8619 7.13016V7.63016Z"/><path d="M41.982 18.9002H44.532V10.0902C44.952 9.37016 45.992 9.05016 47.302 9.32016L47.462 6.33016C47.292 6.31016 47.142 6.29016 47.002 6.29016C45.802 6.29016 44.832 7.20016 44.342 8.86016H44.162L43.952 6.54016H41.982V18.9002Z"/><path d="M55.7461 11.5002C55.7461 8.52016 55.4461 6.31016 52.0161 6.31016C48.7861 6.31016 48.0661 8.46016 48.0661 11.6202V13.7902C48.0661 16.8702 48.7261 19.1102 51.9361 19.1102C54.4761 19.1102 55.7861 17.8402 55.6361 15.3802L53.3861 15.2602C53.3561 16.7802 53.0061 17.4002 51.9961 17.4002C50.7261 17.4002 50.6661 16.1902 50.6661 14.3902V13.5502H55.7461V11.5002ZM51.9561 7.97016C53.1761 7.97016 53.2661 9.12016 53.2661 11.0702V12.0802H50.6661V11.0702C50.6661 9.14016 50.7461 7.97016 51.9561 7.97016Z"/><path d="M60.1945 18.9002V8.92016C60.5745 8.39016 61.1945 8.07016 61.7945 8.07016C62.5645 8.07016 62.8445 8.61016 62.8445 9.69016V18.9002H65.5045L65.4845 8.93016C65.8545 8.37016 66.4845 8.04016 67.1045 8.04016C67.7745 8.04016 68.1445 8.61016 68.1445 9.69016V18.9002H70.8045V9.49016C70.8045 7.28016 70.0145 6.27016 68.3445 6.27016C67.1845 6.27016 66.1945 6.69016 65.2845 7.67016C64.9045 6.76016 64.1545 6.27016 63.0845 6.27016C61.8745 6.27016 60.7345 6.79016 59.9345 7.76016H59.7845L59.5945 6.54016H57.5445V18.9002H60.1945Z"/><path d="M74.0858 4.97016C74.9858 4.97016 75.4058 4.67016 75.4058 3.43016C75.4058 2.27016 74.9558 1.91016 74.0858 1.91016C73.2058 1.91016 72.7758 2.23016 72.7758 3.43016C72.7758 4.67016 73.1858 4.97016 74.0858 4.97016ZM72.8658 18.9002H75.3958V6.54016H72.8658V18.9002Z"/><path d="M79.9516 19.0902C81.4116 19.0902 82.3216 18.4802 83.0716 17.3802H83.1816L83.2916 18.9002H85.2816V6.54016H82.6416V16.4702C82.3616 16.9602 81.7116 17.3202 81.1016 17.3202C80.3316 17.3202 80.0916 16.7102 80.0916 15.6902V6.54016H77.4616V15.8102C77.4616 17.8202 78.0416 19.0902 79.9516 19.0902Z"/><path d="M90.0031 18.9002V8.92016C90.3831 8.39016 91.0031 8.07016 91.6031 8.07016C92.3731 8.07016 92.6531 8.61016 92.6531 9.69016V18.9002H95.3131L95.2931 8.93016C95.6631 8.37016 96.2931 8.04016 96.9131 8.04016C97.5831 8.04016 97.9531 8.61016 97.9531 9.69016V18.9002H100.613V9.49016C100.613 7.28016 99.8231 6.27016 98.1531 6.27016C96.9931 6.27016 96.0031 6.69016 95.0931 7.67016C94.7131 6.76016 93.9631 6.27016 92.8931 6.27016C91.6831 6.27016 90.5431 6.79016 89.7431 7.76016H89.5931L89.4031 6.54016H87.3531V18.9002H90.0031Z"/></g>';

    // --- 2.1: CSS Event Listener (Thay thế MutationObserver gây lag) ---
    document.addEventListener('animationstart', (e) => {
        // 1. Chèn Logo Premium khi SVG load
        if (e.animationName === 'nodeInserted') {
            const node = e.target;
            const nodeName = node.tagName.toLowerCase();

            // Xử lý Logo Premium
            if (nodeName === 'svg' && node.closest('ytd-logo')) {
                if (!node.dataset.premiumModified) {
                    node.dataset.premiumModified = "true";
                    node.setAttribute('width', '101');
                    node.setAttribute('height', '20'); 
                    node.setAttribute('viewBox', '0 0 101 20');
                    node.innerHTML = logoSVG;
                    
                    const logoWrapper = node.closest('ytd-logo');
                    if(logoWrapper) logoWrapper.setAttribute('is-red-logo', '');
                }
            }
            
            // 2. Xử lý Đóng Cảnh báo Adblock tự động
            if (nodeName === 'tp-yt-paper-dialog' || nodeName === 'ytd-enforcement-message-view-model') {
                setTimeout(() => { // Đợi render text
                    const textContent = node.textContent || "";
                    const isAdblockWarning = textContent.includes("Ad blockers are not allowed") || 
                                             textContent.includes("Trình chặn quảng cáo không được phép") ||
                                             textContent.includes("trình chặn quảng cáo");
                    
                    if (isAdblockWarning && node.style.display !== 'none') {
                        const closeBtn = node.querySelector('yt-icon-button#dismiss-button, button[aria-label="Close"], #dismiss-button');
                        if (closeBtn) closeBtn.click();
                        else {
                            node.style.display = 'none';
                            const backdrop = document.querySelector('tp-yt-iron-overlay-backdrop');
                            if (backdrop) backdrop.style.display = 'none';
                            const video = document.querySelector('video');
                            if (video && video.paused) video.play();
                        }
                    }
                }, 100);
            }
        }
    }, true);


    // --- 2.2: LOGIC TUA VIDEO & ĐIỀU KHIỂN (NUMPAD + A-S-D) ---
    function initLiteSeek() {
        let lastKeyTime = 0;

        document.addEventListener('keydown', (e) => {
            const target = e.target;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

            let isSeekAction = false;
            let captured = false;
            
            const isNumpad = (e.location === 3);
            const keyLower = e.key.toLowerCase();
            const player = document.querySelector('#movie_player');
            if (!player) return;

            // Âm lượng (Numpad 8/2)
            if (isNumpad && (e.key === '8' || e.key === 'ArrowUp' || e.code === 'Numpad8')) {
                captured = true;
                if (typeof player.setVolume === 'function') {
                    player.setVolume(Math.min(100, player.getVolume() + 5));
                    if (typeof player.volumeUp === 'function') player.volumeUp(); 
                }
            } else if (isNumpad && (e.key === '2' || e.key === 'ArrowDown' || e.code === 'Numpad2')) {
                captured = true;
                if (typeof player.setVolume === 'function') {
                    player.setVolume(Math.max(0, player.getVolume() - 5));
                    if (typeof player.volumeDown === 'function') player.volumeDown();
                }
            }
            // Lùi 10s (Numpad 4 hoặc phím A)
            else if ((isNumpad && (e.key === '4' || e.key === 'ArrowLeft' || e.code === 'Numpad4')) || keyLower === 'a') {
                captured = true;
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', code: 'KeyJ', keyCode: 74, which: 74, bubbles: true, cancelable: true }));
                isSeekAction = true;
            } 
            // Play/Pause (Numpad 5 hoặc phím S)
            else if ((isNumpad && (e.key === '5' || e.key === 'Clear' || e.code === 'Numpad5' || e.keyCode === 12)) || keyLower === 's') {
                captured = true;
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', keyCode: 75, which: 75, bubbles: true, cancelable: true }));
            }
            // Tiến 10s (Numpad 6 hoặc phím D)
            else if ((isNumpad && (e.key === '6' || e.key === 'ArrowRight' || e.code === 'Numpad6')) || keyLower === 'd') {
                captured = true;
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', code: 'KeyL', keyCode: 76, which: 76, bubbles: true, cancelable: true }));
                isSeekAction = true;
            }
            // Block phím rác của numpad
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
            const player = document.querySelector('#movie_player');
            if (player) player.classList.remove('seeking-mode');
        }, true);
    }
    
    const intervalCheck = setInterval(() => {
        if (document.querySelector('#movie_player')) {
            initLiteSeek();
            clearInterval(intervalCheck);
        }
    }, 500);


    // --- 2.3: AUTO SKIP ADS (Dùng MutationObserver trên thẻ Video Player - Nhẹ) ---
    function initAdSkip() {
        let originalPlaybackRate = 1;

        const playerObserver = new MutationObserver(() => {
            const player = document.querySelector('#movie_player');
            if (!player) return;
            
            const video = player.querySelector('video');
            if (!video) return;

            if (player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting')) {
                if (video.playbackRate !== 16) originalPlaybackRate = video.playbackRate;
                video.muted = true;
                video.playbackRate = 16;
                const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .videoAdUiSkipButton, .ytp-ad-skip-button-slot');
                if (skipBtn) skipBtn.click();
                
                const closeOverlay = document.querySelector('.ytp-ad-overlay-close-button');
                if (closeOverlay) closeOverlay.click();
            } else {
                if (video.playbackRate === 16) {
                    video.playbackRate = originalPlaybackRate || 1;
                    video.muted = false;
                }
            }
        });

        const waitForPlayer = setInterval(() => {
            const player = document.querySelector('#movie_player');
            if (player) {
                // Chỉ theo dõi khi class của thẻ Player thay đổi (rất nhẹ, không gây lag)
                playerObserver.observe(player, { attributes: true, attributeFilter: ['class'] });
                clearInterval(waitForPlayer);
            }
        }, 500);
    }
    initAdSkip();


    // --- 2.4: AUTO CONFIRM "STILL WATCHING" ---
    const setupConfirmObserver = () => {
        const observerTarget = document.querySelector('ytd-app') || document.body;
        if (!observerTarget) return;

        // Chỉ theo dõi sự thay đổi nhẹ để ấn nút (không theo dõi toàn bộ thuộc tính con)
        const confirmObserver = new MutationObserver(() => {
            const confirmBtn = document.querySelector('yt-confirm-dialog-renderer yt-button-renderer#confirm-button, #confirm-button.yt-confirm-dialog-renderer, ytd-popup-container yt-button-renderer#confirm-button');
            
            if (confirmBtn && confirmBtn.offsetParent !== null) {
                const btnText = confirmBtn.innerText || confirmBtn.textContent;
                if (btnText && (btnText.includes('Có') || btnText.includes('Yes') || btnText.includes('CONTINUE'))) {
                    confirmBtn.click();
                    const video = document.querySelector('video');
                    if (video && video.paused) video.play();
                }
            }
        });

        confirmObserver.observe(observerTarget, { childList: true, subtree: true });
    };

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

})();
