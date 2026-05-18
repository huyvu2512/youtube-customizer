// YouTube Customizer v1.6 — https://github.com/huyvu2512/youtube-customizer
(function() {
    'use strict';

    function addCustomStyles() {
        if (document.getElementById('yt-customizer-styles')) return;
        const style = document.createElement('style');
        style.id = 'yt-customizer-styles';
        style.textContent = `
            #cinematics, .ytp-ambient-mode-rendering-container {
                display: none !important;
            }

            ytd-comment-thread-renderer {
                content-visibility: auto;
                contain-intrinsic-size: auto 200px;
            }

            @keyframes ytcNodeInserted {
                from { clip-path: inset(0); }
                to { clip-path: inset(0); }
            }
            tp-yt-paper-dialog,
            ytd-enforcement-message-view-model,
            yt-confirm-dialog-renderer {
                animation: ytcNodeInserted 0.001s;
            }

            /* Lưới 4 cột (CSS + JS setProperty dự phòng) */
            @media (min-width: 1000px) {
                ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,
                ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer,
                #page-manager ytd-browse ytd-rich-grid-renderer {
                    --ytd-rich-grid-items-per-row: 4 !important;
                    --ytd-rich-grid-item-max-width: none !important;
                }
            }

            ytd-rich-grid-renderer.ytc-grid-4 {
                --ytd-rich-grid-items-per-row: 4 !important;
                --ytd-rich-grid-item-max-width: none !important;
            }

            #page-manager ytd-rich-item-renderer {
                overflow: hidden !important;
            }
            #page-manager ytd-rich-item-renderer ytd-thumbnail,
            #page-manager ytd-rich-item-renderer #thumbnail {
                overflow: hidden !important;
            }
            #page-manager ytd-rich-item-renderer:hover {
                z-index: 2;
                position: relative;
            }

            #movie_player.seeking-mode .ytp-chrome-bottom,
            #movie_player.seeking-mode .ytp-gradient-bottom,
            #movie_player.seeking-mode .ytp-chrome-top {
                opacity: 0 !important;
            }
            #movie_player.seeking-mode {
                cursor: none !important;
            }

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

            ytd-mealbar-promo-renderer,
            ytd-upsell-dialog-renderer,
            ytd-rich-shelf-renderer[is-shorts],
            ytd-mini-guide-entry-renderer[aria-label="Shorts"],
            ytd-guide-entry-renderer[title="Shorts"],
            ytd-guide-entry-renderer a[title="Shorts"],
            ytd-reel-shelf-renderer,
            #endpoint[title="Shorts"] {
                display: none !important;
            }

            ytd-topbar-logo-renderer #country-code {
                display: none !important;
            }

            ytd-logo > *:not(.custom-premium-logo) {
                display: none !important;
            }
            ytd-logo, ytd-topbar-logo-renderer {
                overflow: visible !important;
            }

            .custom-premium-logo {
                display: flex;
                align-items: center;
                width: 101px !important;
                height: 20px !important;
                color: var(--yt-spec-text-primary, white);
                pointer-events: none;
            }
            .custom-premium-logo svg {
                width: 101px !important;
                height: 20px !important;
                fill: currentColor;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    addCustomStyles();

    function isHomeFeedPath() {
        const p = location.pathname;
        return p === '/' || p === '/feed/subscriptions' || p.startsWith('/feed');
    }

    function rafThrottle(fn) {
        let scheduled = 0;
        return function(...args) {
            if (scheduled) return;
            scheduled = requestAnimationFrame(() => {
                scheduled = 0;
                fn.apply(this, args);
            });
        };
    }

    function whenElement(selector, callback) {
        const found = document.querySelector(selector);
        if (found) {
            callback(found);
            return;
        }
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        const root = document.querySelector('ytd-app') || document.documentElement;
        observer.observe(root, { childList: true, subtree: true });
    }

    function applyHomeGridFourColumns() {
        if (!isHomeFeedPath()) return;
        document.querySelectorAll('ytd-rich-grid-renderer').forEach((grid) => {
            grid.classList.add('ytc-grid-4');
            grid.style.setProperty('--ytd-rich-grid-items-per-row', '4', 'important');
            grid.style.setProperty('--ytd-rich-grid-item-max-width', 'none', 'important');
        });
    }

    const scheduleHomeGrid = rafThrottle(applyHomeGridFourColumns);
    scheduleHomeGrid();
    document.addEventListener('yt-navigate-finish', scheduleHomeGrid);
    whenElement('ytd-rich-grid-renderer', scheduleHomeGrid);

    const LOGO_MARK = 'M32.1819';
    const logoSVG = '<g><path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"/><path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"/></g><g id="youtube-paths_yt19"><path d="M32.1819 2.10016V18.9002H34.7619V12.9102H35.4519C38.8019 12.9102 40.5619 11.1102 40.5619 7.57016V6.88016C40.5619 3.31016 39.0019 2.10016 35.7219 2.10016H32.1819ZM37.8619 7.63016C37.8619 10.0002 37.1419 11.0802 35.4019 11.0802H34.7619V3.95016H35.4519C37.4219 3.95016 37.8619 4.76016 37.8619 7.13016V7.63016Z"/><path d="M41.982 18.9002H44.532V10.0902C44.952 9.37016 45.992 9.05016 47.302 9.32016L47.462 6.33016C47.292 6.31016 47.142 6.29016 47.002 6.29016C45.802 6.29016 44.832 7.20016 44.342 8.86016H44.162L43.952 6.54016H41.982V18.9002Z"/><path d="M55.7461 11.5002C55.7461 8.52016 55.4461 6.31016 52.0161 6.31016C48.7861 6.31016 48.0661 8.46016 48.0661 11.6202V13.7902C48.0661 16.8702 48.7261 19.1102 51.9361 19.1102C54.4761 19.1102 55.7861 17.8402 55.6361 15.3802L53.3861 15.2602C53.3561 16.7802 53.0061 17.4002 51.9961 17.4002C50.7261 17.4002 50.6661 16.1902 50.6661 14.3902V13.5502H55.7461V11.5002ZM51.9561 7.97016C53.1761 7.97016 53.2661 9.12016 53.2661 11.0702V12.0802H50.6661V11.0702C50.6661 9.14016 50.7461 7.97016 51.9561 7.97016Z"/><path d="M60.1945 18.9002V8.92016C60.5745 8.39016 61.1945 8.07016 61.7945 8.07016C62.5645 8.07016 62.8445 8.61016 62.8445 9.69016V18.9002H65.5045L65.4845 8.93016C65.8545 8.37016 66.4845 8.04016 67.1045 8.04016C67.7745 8.04016 68.1445 8.61016 68.1445 9.69016V18.9002H70.8045V9.49016C70.8045 7.28016 70.0145 6.27016 68.3445 6.27016C67.1845 6.27016 66.1945 6.69016 65.2845 7.67016C64.9045 6.76016 64.1545 6.27016 63.0845 6.27016C61.8745 6.27016 60.7345 6.79016 59.9345 7.76016H59.7845L59.5945 6.54016H57.5445V18.9002H60.1945Z"/><path d="M74.0858 4.97016C74.9858 4.97016 75.4058 4.67016 75.4058 3.43016C75.4058 2.27016 74.9558 1.91016 74.0858 1.91016C73.2058 1.91016 72.7758 2.23016 72.7758 3.43016C72.7758 4.67016 73.1858 4.97016 74.0858 4.97016ZM72.8658 18.9002H75.3958V6.54016H72.8658V18.9002Z"/><path d="M79.9516 19.0902C81.4116 19.0902 82.3216 18.4802 83.0716 17.3802H83.1816L83.2916 18.9002H85.2816V6.54016H82.6416V16.4702C82.3616 16.9602 81.7116 17.3202 81.1016 17.3202C80.3316 17.3202 80.0916 16.7102 80.0916 15.6902V6.54016H77.4616V15.8102C77.4616 17.8202 78.0416 19.0902 79.9516 19.0902Z"/><path d="M90.0031 18.9002V8.92016C90.3831 8.39016 91.0031 8.07016 91.6031 8.07016C92.3731 8.07016 92.6531 8.61016 92.6531 9.69016V18.9002H95.3131L95.2931 8.93016C95.6631 8.37016 96.2931 8.04016 96.9131 8.04016C97.5831 8.04016 97.9531 8.61016 97.9531 9.69016V18.9002H100.613V9.49016C100.613 7.28016 99.8231 6.27016 98.1531 6.27016C96.9931 6.27016 96.0031 6.69016 95.0931 7.67016C94.7131 6.76016 93.9631 6.27016 92.8931 6.27016C91.6831 6.27016 90.5431 6.79016 89.7431 7.76016H89.5931L89.4031 6.54016H87.3531V18.9002H90.0031Z"/></g>';

    const logoHtmlPolicy = window.trustedTypes?.createPolicy?.('youtubeCustomizerLogo', {
        createHTML: (html) => html,
    });

    function buildLogoHtml() {
        const raw = `<svg viewBox="0 0 101 20" width="101" height="20" preserveAspectRatio="xMinYMid meet">${logoSVG}</svg>`;
        return logoHtmlPolicy ? logoHtmlPolicy.createHTML(raw) : raw;
    }

    function ensurePremiumLogo(logo) {
        logo.style.overflow = 'visible';
        let parent = logo.parentElement;
        while (parent && parent.tagName.toLowerCase() !== 'ytd-topbar-logo-renderer') {
            parent.style.overflow = 'visible';
            parent = parent.parentElement;
        }

        let customSpan = logo.querySelector('.custom-premium-logo');
        const logoHtml = buildLogoHtml();

        if (!customSpan) {
            customSpan = document.createElement('span');
            customSpan.className = 'custom-premium-logo';
            customSpan.innerHTML = logoHtml;
            logo.appendChild(customSpan);
            logo.setAttribute('is-red-logo', '');
        } else if (!customSpan.innerHTML.includes(LOGO_MARK)) {
            customSpan.innerHTML = logoHtml;
        }
    }

    const scheduleLogoScan = rafThrottle((root) => {
        const scope = root && root.querySelectorAll ? root : document;
        scope.querySelectorAll('ytd-logo').forEach(ensurePremiumLogo);
    });

    function setupLogoObserver() {
        scheduleLogoScan(document);

        const attach = (masthead) => {
            new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType !== 1) return;
                            if (node.matches?.('ytd-logo')) scheduleLogoScan(node.parentElement || masthead);
                            else if (node.querySelector?.('ytd-logo')) scheduleLogoScan(node);
                        });
                    } else if (mutation.type === 'attributes' && mutation.target.matches?.('ytd-logo')) {
                        ensurePremiumLogo(mutation.target);
                    }
                }
            }).observe(masthead, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
        };

        const masthead = document.querySelector('ytd-masthead');
        if (masthead) attach(masthead);
        else whenElement('ytd-masthead', attach);
    }

    setupLogoObserver();

    document.addEventListener('click', (e) => {
        if (!e.target.closest('ytd-topbar-logo-renderer')) return;
        const path = location.pathname;
        if (path === '/' || path.startsWith('/feed')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, true);

    const ADBLOCK_HINTS = [
        'ad blockers are not allowed',
        'ad blocker',
        'trình chặn quảng cáo',
        'chặn quảng cáo',
        'bloqueador',
        'werbeblocker',
    ];

    function tryDismissAdblockDialog(node) {
        setTimeout(() => {
            const text = (node.textContent || '').toLowerCase();
            const isAdblockWarning = ADBLOCK_HINTS.some((hint) => text.includes(hint));
            if (!isAdblockWarning || node.style.display === 'none') return;

            const closeBtn = node.querySelector('yt-icon-button#dismiss-button, button[aria-label="Close"], #dismiss-button');
            if (closeBtn) closeBtn.click();
            else {
                node.style.display = 'none';
                const backdrop = document.querySelector('tp-yt-iron-overlay-backdrop');
                if (backdrop) backdrop.style.display = 'none';
                const video = document.querySelector('#movie_player video');
                if (video?.paused) video.play();
            }
        }, 100);
    }

    function tryConfirmStillWatching(node) {
        const confirmBtn = node.matches?.('yt-confirm-dialog-renderer')
            ? node.querySelector('#confirm-button')
            : node.querySelector?.('yt-button-renderer#confirm-button, #confirm-button');

        if (!confirmBtn || confirmBtn.offsetParent === null) return;

        const btnText = confirmBtn.innerText || confirmBtn.textContent || '';
        if (btnText.includes('Có') || btnText.includes('Yes') || btnText.includes('CONTINUE')) {
            confirmBtn.click();
            const video = document.querySelector('#movie_player video');
            if (video?.paused) video.play();
        }
    }

    document.addEventListener('animationstart', (e) => {
        if (e.animationName !== 'ytcNodeInserted') return;
        const node = e.target;
        const tag = node.tagName.toLowerCase();
        if (tag === 'tp-yt-paper-dialog' || tag === 'ytd-enforcement-message-view-model') {
            tryDismissAdblockDialog(node);
        } else if (tag === 'yt-confirm-dialog-renderer') {
            setTimeout(() => tryConfirmStillWatching(node), 50);
        }
    }, true);

    // --- Player (SPA-safe) ---
    function getPlayerVideo(player) {
        return player.querySelector('video.html5-main-video') || player.querySelector('video');
    }

    function seekBySeconds(player, delta) {
        const now = Date.now();
        if (now - lastSeekAt < SEEK_COOLDOWN_MS) return true;
        lastSeekAt = now;

        const video = getPlayerVideo(player);
        if (!video) return false;
        const duration = Number.isFinite(video.duration) ? video.duration : Infinity;
        video.currentTime = Math.max(0, Math.min(duration, video.currentTime + delta));
        return true;
    }

    function togglePlayback(player) {
        const video = getPlayerVideo(player);
        if (video) {
            if (video.paused) video.play();
            else video.pause();
            return true;
        }
        if (typeof player.getPlayerState === 'function') {
            if (player.getPlayerState() === 1) player.pauseVideo?.();
            else player.playVideo?.();
            return true;
        }
        return false;
    }

    function dispatchYtKey(key) {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key,
            code: key === 'j' ? 'KeyJ' : key === 'k' ? 'KeyK' : 'KeyL',
            keyCode: key === 'j' ? 74 : key === 'k' ? 75 : 76,
            which: key === 'j' ? 74 : key === 'k' ? 75 : 76,
            bubbles: true,
            cancelable: true,
        }));
    }

    let playerOverPlayer = false;
    let lastKeyTime = 0;
    let lastSeekAt = 0;
    let boundPlayer = null;
    let adObserver = null;

    const SEEK_COOLDOWN_MS = 100;

    document.addEventListener('mouseover', (e) => {
        playerOverPlayer = !!e.target.closest('#movie_player');
    }, true);

    function isPlayerFullscreen(player) {
        const fs = document.fullscreenElement;
        return fs && (fs === player || fs.contains(player));
    }

    function canUseAsdKeys(player) {
        return player && (playerOverPlayer || isPlayerFullscreen(player));
    }

    let keysBound = false;

    function bindGlobalKeys() {
        if (keysBound) return;
        keysBound = true;

        document.addEventListener('keydown', (e) => {
            if (e.isComposing || e.keyCode === 229) return;

            const target = e.target;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

            const player = document.querySelector('#movie_player');
            if (!player) return;

            let isSeekAction = false;
            let captured = false;
            const isNumpad = (e.location === 3);
            const asdAllowed = canUseAsdKeys(player);
            const code = e.code;

            if (isNumpad && (e.key === '8' || e.key === 'ArrowUp' || e.code === 'Numpad8')) {
                captured = true;
                if (typeof player.setVolume === 'function') {
                    player.setVolume(Math.min(100, player.getVolume() + 5));
                    player.volumeUp?.();
                }
            } else if (isNumpad && (e.key === '2' || e.key === 'ArrowDown' || e.code === 'Numpad2')) {
                captured = true;
                if (typeof player.setVolume === 'function') {
                    player.setVolume(Math.max(0, player.getVolume() - 5));
                    player.volumeDown?.();
                }
            } else if (isNumpad && (e.key === '4' || e.key === 'ArrowLeft' || e.code === 'Numpad4')) {
                captured = true;
                if (!seekBySeconds(player, -10)) dispatchYtKey('j');
                isSeekAction = true;
            } else if (isNumpad && (e.key === '5' || e.key === 'Clear' || e.code === 'Numpad5' || e.keyCode === 12)) {
                captured = true;
                if (!togglePlayback(player)) dispatchYtKey('k');
            } else if (isNumpad && (e.key === '6' || e.key === 'ArrowRight' || e.code === 'Numpad6')) {
                captured = true;
                if (!seekBySeconds(player, 10)) dispatchYtKey('l');
                isSeekAction = true;
            } else if (asdAllowed && code === 'KeyA') {
                captured = true;
                seekBySeconds(player, -10);
                isSeekAction = true;
            } else if (asdAllowed && code === 'KeyS') {
                captured = true;
                togglePlayback(player);
            } else if (asdAllowed && code === 'KeyD') {
                captured = true;
                seekBySeconds(player, 10);
                isSeekAction = true;
            } else if (isNumpad && ['1', '3', '7', '9', 'End', 'PageDown', 'Home', 'PageUp'].includes(e.key)) {
                captured = true;
            }

            if (captured) {
                e.preventDefault();
                e.stopImmediatePropagation();
            } else if (['ArrowLeft', 'ArrowRight', 'j', 'l', 'J', 'L'].includes(e.key)) {
                isSeekAction = true;
            }

            if (isSeekAction) {
                lastKeyTime = Date.now();
                if (!player.classList.contains('seeking-mode')) {
                    player.classList.add('seeking-mode');
                }
            }
        }, true);

        let seekModeRaf = 0;
        document.addEventListener('mousemove', () => {
            if (Date.now() - lastKeyTime < 400) return;
            if (seekModeRaf) return;
            seekModeRaf = requestAnimationFrame(() => {
                seekModeRaf = 0;
                document.querySelector('#movie_player')?.classList.remove('seeking-mode');
            });
        }, { capture: true, passive: true });
    }

    function bindAdSkip(player) {
        if (boundPlayer === player) return;

        adObserver?.disconnect();
        boundPlayer = player;

        let originalPlaybackRate = 1;
        let mutedBeforeAd = false;
        let inAd = false;

        const handleAdState = rafThrottle(() => {
            const video = getPlayerVideo(player);
            if (!video) return;

            const isAd = player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting');

            if (isAd) {
                if (!inAd) {
                    inAd = true;
                    mutedBeforeAd = video.muted;
                    if (video.playbackRate !== 16) originalPlaybackRate = video.playbackRate;
                }
                video.muted = true;
                video.playbackRate = 16;
                document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .videoAdUiSkipButton, .ytp-ad-skip-button-slot')?.click();
                document.querySelector('.ytp-ad-overlay-close-button')?.click();
            } else if (inAd) {
                inAd = false;
                if (video.playbackRate === 16) video.playbackRate = originalPlaybackRate || 1;
                video.muted = mutedBeforeAd;
            }
        });

        adObserver = new MutationObserver(handleAdState);
        adObserver.observe(player, { attributes: true, attributeFilter: ['class'] });
        handleAdState();
    }

    function attachPlayer() {
        bindGlobalKeys();
        const player = document.querySelector('#movie_player');
        if (player) bindAdSkip(player);
    }

    attachPlayer();
    document.addEventListener('yt-navigate-finish', attachPlayer);
    whenElement('#movie_player', bindAdSkip);

})();
