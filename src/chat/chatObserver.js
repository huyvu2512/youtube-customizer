// ==========================================================================
// CHAT OBSERVER, BACKGROUND SYNC & IFRAME CONTROLLER
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { whenElement, hasLiveOrChatSupport, rafThrottle } from '../core/utils.js';
import {
    chatOverlayInitialized,
    setChatOverlayInitialized,
    danmakuContainer,
    streamerBox,
    seenMessageIds,
    isNativeChatHiddenByScript,
    setNativeChatHiddenState,
    syncPlayerFullscreenSize,
    ensureChatOverlayContainers
} from './chatState.js';
import { applyChatBoxPos, showInitialBox, setupChatBoxInteractions } from './streamerBox.js';
import {
    danmakuQueue,
    laneNextAvailableTime,
    setLastDanmakuSpawnTime,
    setLastSpawnedLane,
    startDanmakuScheduler,
    stopDanmakuScheduler
} from './danmaku.js';
import { extractMessageData, displayChatMessage } from './chatParser.js';

export let userManuallyOpenedChat = false;
export let hasAutoCollapsedChatForCurrentVideo = false;

export function resetChatCollapseState() {
    userManuallyOpenedChat = false;
    hasAutoCollapsedChatForCurrentVideo = false;
}



export function findNativeChatCloseButton() {
    // 1. Kiểm tra trên top window (engagement panel header hoặc live chat header)
    const topSelectors = [
        'ytd-engagement-panel-section-list-renderer[target-id*="chat" i][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] #visibility-button button',
        'ytd-engagement-panel-section-list-renderer[target-id*="chat" i][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] #close-button button',
        'ytd-engagement-panel-section-list-renderer[target-id*="chat" i] #visibility-button button',
        'ytd-engagement-panel-section-list-renderer[target-id*="chat" i] #close-button button',
        'ytd-engagement-panel-section-list-renderer[target-id*="chat" i] button[aria-label="Đóng"]',
        'ytd-engagement-panel-section-list-renderer[target-id*="chat" i] button[aria-label="Close"]',
        '#panels-full-bleed-container [target-id*="chat" i] #visibility-button button',
        '#panels-full-bleed-container [target-id*="chat" i] #close-button button',
        'ytd-live-chat-frame #close-button button',
        'yt-live-chat-header-renderer #close-button button',
        '#close-button button[aria-label="Đóng"]',
        '#close-button button[aria-label="Close"]'
    ];

    for (const sel of topSelectors) {
        const btn = document.querySelector(sel);
        if (btn && (btn.offsetParent !== null || btn.offsetWidth > 0 || btn.offsetHeight > 0)) {
            return btn;
        }
    }

    // 2. Kiểm tra bên trong iframe chat gốc (iframe#chatframe, loại trừ iframe chạy ngầm)
    const nativeFrames = document.querySelectorAll(
        'iframe#chatframe:not(#ytc-bg-live-chat), ' +
        'ytd-live-chat-frame iframe:not(#ytc-bg-live-chat), ' +
        'ytd-engagement-panel-section-list-renderer[target-id*="chat" i] iframe:not(#ytc-bg-live-chat)'
    );

    const iframeSelectors = [
        'yt-live-chat-header-renderer #close-button button',
        '#close-button yt-button-renderer button',
        '#close-button button',
        'yt-button-shape button[aria-label="Đóng"]',
        'yt-button-shape button[aria-label="Close"]',
        'button[aria-label="Đóng"]',
        'button[aria-label="Close"]'
    ];

    for (const frame of nativeFrames) {
        try {
            const doc = frame.contentDocument || frame.contentWindow?.document;
            if (doc) {
                for (const sel of iframeSelectors) {
                    const btn = doc.querySelector(sel);
                    if (btn && (btn.offsetParent !== null || btn.offsetWidth > 0 || btn.offsetHeight > 0)) {
                        return btn;
                    }
                }
            }
        } catch (e) {}
    }

    return null;
}

export function autoCollapseNativeChatIfOpen() {
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;
    if (!currentConfig.hideNativeLiveChat) return;
    if (hasAutoCollapsedChatForCurrentVideo || userManuallyOpenedChat) return;

    // 1. Nếu khung chat đã ở trạng thái tắt / thu gọn sẵn từ đầu
    const isAlreadyClosed = (() => {
        const teaser = document.querySelector(
            'ytd-live-chat-frame[collapsed] #teaser, ' +
            '#chat-messages [aria-label*="Mở bảng điều khiển" i], ' +
            'button[aria-label*="Mở bảng điều khiển" i], ' +
            'ytd-item-section-renderer #teaser'
        );
        if (teaser) return true;
        const panel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id*="chat" i]');
        if (panel && panel.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN') return true;
        const frame = document.querySelector('ytd-live-chat-frame#chat, #chat.ytd-watch-flexy');
        if (frame && frame.hasAttribute('collapsed')) return true;
        return false;
    })();

    if (isAlreadyClosed) {
        hasAutoCollapsedChatForCurrentVideo = true;
        return;
    }

    // 2. Tìm và bấm nút X (Đóng) của YouTube để tắt chuẩn xác
    const closeBtn = findNativeChatCloseButton();
    if (closeBtn) {
        closeBtn.click();
        hasAutoCollapsedChatForCurrentVideo = true;
        return;
    }

    // Gửi message cho iframe chat phòng khi sandbox
    const nativeFrames = document.querySelectorAll(
        'iframe#chatframe:not(#ytc-bg-live-chat), ' +
        'ytd-live-chat-frame iframe:not(#ytc-bg-live-chat)'
    );
    nativeFrames.forEach(frame => {
        try { frame.contentWindow?.postMessage({ type: 'YTC_CLOSE_NATIVE_CHAT' }, '*'); } catch (e) {}
    });

    // Lắng nghe load của native iframe để bấm ngay khi iframe vừa render xong
    const nativeFrame = document.querySelector('iframe#chatframe:not(#ytc-bg-live-chat)');
    if (nativeFrame && !nativeFrame._ytcAutoCloseBound) {
        nativeFrame._ytcAutoCloseBound = true;
        nativeFrame.addEventListener('load', () => {
            if (!hasAutoCollapsedChatForCurrentVideo && !userManuallyOpenedChat && currentConfig.hideNativeLiveChat) {
                setTimeout(autoCollapseNativeChatIfOpen, 80);
                setTimeout(autoCollapseNativeChatIfOpen, 250);
            }
        });
    }
}

export function isNativeChatOpenInFullscreen() {
    // 1. Kiểm tra class trên player (control bar button hoặc theme cũ)
    const player = document.querySelector('#movie_player:not(#inline-preview-player)');
    if (player && player.classList.contains('ytp-chat-open')) {
        return true;
    }

    // 2. Kiểm tra engagement panel trong panels-full-bleed-container hoặc watch-flexy
    const expandedPanel = document.querySelector(
        '#panels-full-bleed-container [visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"], ' +
        '#panels-full-bleed-container ytd-engagement-panel-section-list-renderer[visibility*="EXPANDED"], ' +
        'ytd-watch-flexy[fullscreen] [visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"], ' +
        'ytd-watch-flexy[fullscreen] ytd-engagement-panel-section-list-renderer[visibility*="EXPANDED"], ' +
        '#panels-full-bleed-container [target-id*="chat"][visibility*="EXPANDED"], ' +
        'ytd-watch-flexy[fullscreen] [target-id*="chat"][visibility*="EXPANDED"], ' +
        'ytd-watch-flexy[fullscreen][has-active-panel], ' +
        'ytd-watch-flexy[fullscreen][panels-open]'
    );
    if (expandedPanel) {
        return true;
    }

    // 3. Kiểm tra live-chat-frame trong full-bleed-container hoặc chat-container
    const chatFrame = document.querySelector(
        '#panels-full-bleed-container ytd-live-chat-frame#chat, ' +
        '#panels-full-bleed-container #chat.ytd-watch-flexy, ' +
        'ytd-watch-flexy[fullscreen] #panels-full-bleed-container ytd-live-chat-frame'
    );
    if (chatFrame && !chatFrame.hasAttribute('collapsed') && !chatFrame.hidden) {
        return true;
    }

    return false;
}

export function syncNativeChatFullscreenState() {
    const isFs = !!(document.fullscreenElement || document.querySelector('#movie_player.ytp-fullscreen'));
    if (!isFs) return;

    const isOpen = isNativeChatOpenInFullscreen();
    if (isOpen) {
        userManuallyOpenedChat = true;
        if (isNativeChatHiddenByScript) {
            setNativeChatHiddenState(false);
        }
    } else {
        if (userManuallyOpenedChat && !isNativeChatHiddenByScript) {
            userManuallyOpenedChat = false;
            if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
                setNativeChatHiddenState(true);
            }
        }
    }
}

// Vô hiệu hóa các observer diện rộng để tránh vòng lặp đệ quy 100% CPU làm treo tab
export function observePlayerChatState() {}
export function observeFullscreenChatPanels() {}

let chatToggleListenersBound = false;
export function setupChatToggleListeners() {
    if (chatToggleListenersBound) return;
    chatToggleListenersBound = true;

    document.addEventListener('click', (e) => {
        if (!e.isTrusted) return; // Bỏ qua click tự động / giả lập
        if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;

        // 1. Nút ĐÓNG / ẨN CHAT (X hoặc nút thu gọn):
        const isCloseBtn = !!e.target.closest(
            '#close-button, ' +
            '#visibility-button, ' +
            '#panels-full-bleed-container #visibility-button, ' +
            '#panels-full-bleed-container #close-button, ' +
            '#panels-full-bleed-container [aria-label*="Đóng" i], ' +
            '#panels-full-bleed-container [aria-label*="Close" i], ' +
            'ytd-engagement-panel-section-list-renderer #visibility-button, ' +
            'ytd-engagement-panel-section-list-renderer #close-button, ' +
            'ytd-engagement-panel-section-list-renderer [aria-label*="Đóng" i], ' +
            'ytd-engagement-panel-section-list-renderer [aria-label*="Close" i], ' +
            'ytd-live-chat-frame #close-button button, ' +
            'ytd-live-chat-frame #close-button, ' +
            'yt-live-chat-header-renderer #close-button, ' +
            'yt-live-chat-header-renderer #close-button button, ' +
            '[aria-label*="Ẩn cuộc trò chuyện" i], ' +
            '[aria-label*="Thu gọn cuộc trò chuyện" i], ' +
            '[aria-label*="Hide chat" i], ' +
            '[aria-label*="Collapse live chat" i], ' +
            '[aria-label*="Close chat" i]'
        );

        if (isCloseBtn) {
            userManuallyOpenedChat = false;
            const isFs = !!(document.fullscreenElement || document.querySelector('#movie_player.ytp-fullscreen'));
            if (isFs && currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
                setNativeChatHiddenState(true);
            }
            return;
        }

        // 2. Click vào bất kỳ nút nào để BẬT / TOGGLE Live Chat (Player bar, Action bar cạnh Like/Dislike, Teaser):
        const isChatBtn = !isCloseBtn && (!!e.target.closest(
            '.ytp-live-chat-button, ' +
            '.ytp-chat-button, ' +
            'button[data-tooltip-target-id*="chat" i], ' +
            '#actions [aria-label*="trò chuyện" i], ' +
            '#actions [aria-label*="chat" i], ' +
            '#top-level-buttons-computed [aria-label*="trò chuyện" i], ' +
            '#top-level-buttons-computed [aria-label*="chat" i], ' +
            'button[aria-label*="trò chuyện" i], ' +
            'button[aria-label*="chat" i], ' +
            'button[target-id*="chat" i], ' +
            'button[data-target-id*="chat" i], ' +
            'button[aria-controls*="chat" i], ' +
            '#show-hide-button button, ' +
            'button#show-button, ' +
            '#show-button, ' +
            '[aria-label*="Hiện cuộc trò chuyện" i], ' +
            '[aria-label*="Mở rộng cuộc trò chuyện" i], ' +
            '[aria-label*="Mở bảng điều khiển" i], ' +
            '[aria-label*="Show chat" i], ' +
            '[aria-label*="Expand live chat" i], ' +
            '[aria-label*="Open panel" i], ' +
            '#teaser, ' +
            '#chat-teaser, ' +
            'ytd-live-chat-frame[collapsed] #teaser, ' +
            'ytd-live-chat-frame[collapsed] ytd-button-renderer, ' +
            'ytd-live-chat-frame[collapsed] yt-button-shape'
        ) || (e.target.textContent && e.target.textContent.includes('Mở bảng điều khiển')));

        if (isChatBtn) {
            const isFs = !!(document.fullscreenElement || document.querySelector('#movie_player.ytp-fullscreen'));
            if (isFs) {
                // Đang trong Fullscreen:
                // Nếu chat đang đóng -> lập tức gỡ bỏ trạng thái ẩn để YouTube render khung chat nguyên bản
                if (!isNativeChatOpenInFullscreen()) {
                    userManuallyOpenedChat = true;
                    setNativeChatHiddenState(false);
                } else {
                    userManuallyOpenedChat = false;
                }
            } else {
                userManuallyOpenedChat = true;
                setNativeChatHiddenState(false);
            }
        }

        // Tự động kiểm tra và đồng bộ lại sau khi YouTube xử lý xong click
        setTimeout(syncNativeChatFullscreenState, 30);
        setTimeout(syncNativeChatFullscreenState, 100);
        setTimeout(syncNativeChatFullscreenState, 250);
        setTimeout(syncNativeChatFullscreenState, 500);
    }, true);
}

export function syncNativeChatState() {
    if (currentConfig.hideNativeLiveChat) {
        autoCollapseNativeChatIfOpen();
    }

    if ((!currentConfig.chatOverlay || currentConfig.chatOverlay === 'off') && !currentConfig.hideNativeLiveChat) {
        setNativeChatHiddenState(false);
        return;
    }

    const isFs = !!(document.fullscreenElement || document.querySelector('#movie_player.ytp-fullscreen'));

    if (isFs) {
        if (!userManuallyOpenedChat || currentConfig.hideNativeLiveChat) {
            setNativeChatHiddenState(true);
        } else {
            setNativeChatHiddenState(false);
        }
    } else {
        // Giao diện thường: không bao giờ set data-ytc-chat-hidden="true" để người dùng mở/đóng bình thường
        setNativeChatHiddenState(false);
    }
}

export const ensureNativeLiveChatRunning = syncNativeChatState;

export function onTheaterModeChanged(isTheater) {
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;

    // 1. Đồng bộ lại container overlay trên movie_player
    ensureChatOverlayContainers();
    const player = document.querySelector('#movie_player:not(#inline-preview-player)');
    if (player && streamerBox) {
        applyChatBoxPos(streamerBox, player);
    }

    // 2. Nếu đang bật Live Chat Overlay:
    if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
        if (currentConfig.chatOverlay === 'danmaku') {
            startDanmakuScheduler();
        }

        setTimeout(() => {
            ensureChatOverlayContainers();
            const p = document.querySelector('#movie_player:not(#inline-preview-player)');
            if (p && streamerBox) applyChatBoxPos(streamerBox, p);
            findAndObserveItems();
            requestExistingMessages();
        }, 150);
        setTimeout(() => {
            ensureChatOverlayContainers();
            const p = document.querySelector('#movie_player:not(#inline-preview-player)');
            if (p && streamerBox) applyChatBoxPos(streamerBox, p);
            findAndObserveItems();
        }, 600);
        setTimeout(() => {
            ensureChatOverlayContainers();
            const p = document.querySelector('#movie_player:not(#inline-preview-player)');
            if (p && streamerBox) applyChatBoxPos(streamerBox, p);
            findAndObserveItems();
        }, 1500);

        ensureBackgroundLiveChat();
    }
}

let theaterObserver = null;
export function setupTheaterModeObserver() {
    if (theaterObserver) return;
    const watchFlexy = document.querySelector('ytd-watch-flexy');
    if (!watchFlexy) {
        setTimeout(setupTheaterModeObserver, 500);
        return;
    }
    let lastTheater = watchFlexy.hasAttribute('theater');
    theaterObserver = new MutationObserver(() => {
        const isTheater = watchFlexy.hasAttribute('theater');
        if (isTheater !== lastTheater) {
            lastTheater = isTheater;
            onTheaterModeChanged(isTheater);
        }
    });
    theaterObserver.observe(watchFlexy, { attributes: true, attributeFilter: ['theater'] });

    document.addEventListener('keydown', (e) => {
        const tag = e.target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
        if (e.key === 't' || e.key === 'T' || e.code === 'KeyT') {
            setTimeout(() => {
                const cur = watchFlexy.hasAttribute('theater');
                if (cur !== lastTheater) {
                    lastTheater = cur;
                    onTheaterModeChanged(cur);
                }
            }, 80);
        }
    }, true);
}

function getAllChatElements(scope) {
    const root = scope || document;
    return root.querySelectorAll(
        'yt-live-chat-text-message-renderer, ' +
        'yt-live-chat-paid-message-renderer, ' +
        'yt-live-chat-membership-item-renderer, ' +
        'yt-live-chat-paid-sticker-renderer'
    );
}

function queryAllLiveChatMessages() {
    const msgs = [];
    const mainEls = getAllChatElements(document);
    if (mainEls && mainEls.length) {
        mainEls.forEach(el => msgs.push(el));
    }

    const frames = document.querySelectorAll('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"]');
    frames.forEach(frame => {
        try {
            const doc = frame.contentDocument || frame.contentWindow?.document;
            if (doc) {
                const iframeEls = getAllChatElements(doc);
                if (iframeEls && iframeEls.length) {
                    iframeEls.forEach(el => msgs.push(el));
                }
            }
        } catch (e) {}
    });

    return msgs;
}

export function requestExistingMessages() {
    function doFetch() {
        const allExisting = queryAllLiveChatMessages();
        if (allExisting && allExisting.length > 0) {
            if (currentConfig.chatOverlay === 'streamer') {
                // Nạp tối đa 6 tin gần nhất cho khung nổi
                const recent = allExisting.slice(-6);
                recent.forEach((node, i) => {
                    const data = extractMessageData(node);
                    if (data) {
                        data.isBacklog = true;
                        setTimeout(() => displayChatMessage(data, true), i * 80);
                    }
                });
                return true;
            } else if (currentConfig.chatOverlay === 'danmaku') {
                // Danmaku ngang: chỉ lấy 4 tin mới nhất, giãn cách thời gian để trôi êm ái chống dính chùm
                const recent = allExisting.slice(-4);
                recent.forEach((node, i) => {
                    const data = extractMessageData(node);
                    if (data) {
                        data.isBacklog = true;
                        setTimeout(() => displayChatMessage(data, true), i * 500);
                    }
                });
                return true;
            }
        }
        return false;
    }

    const found = doFetch();
    if (!found) {
        setTimeout(doFetch, 500);
        setTimeout(doFetch, 1500);
    }

    const frames = document.querySelectorAll('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"]');
    frames.forEach(frame => {
        if (frame.contentWindow) {
            try {
                frame.contentWindow.postMessage({ type: 'YTC_REQUEST_EXISTING_MSGS' }, '*');
            } catch (e) {}
        }
    });
}

// --------------------------------------------------------------------------
// CHẠY NGẦM LIVE CHAT QUA IFRAME CHUYÊN BIỆT
// --------------------------------------------------------------------------
let bgChatIframe = null;
let currentBgVideoId = null;

export function getCurrentLiveVideoId() {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('v');
    if (v) return v;

    const liveMatch = window.location.pathname.match(/\/live\/([a-zA-Z0-9_-]+)/);
    if (liveMatch) return liveMatch[1];

    const player = document.querySelector('#movie_player');
    if (player && typeof player.getVideoData === 'function') {
        const data = player.getVideoData();
        if (data && data.video_id) return data.video_id;
    }

    return null;
}

export function ensureBackgroundLiveChat() {
    if (!currentConfig.chatOverlay || currentConfig.chatOverlay === 'off') {
        if (bgChatIframe) {
            bgChatIframe.remove();
            bgChatIframe = null;
            currentBgVideoId = null;
        }
        return;
    }

    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) {
        return;
    }

    if (!hasLiveOrChatSupport()) {
        return;
    }

    const videoId = getCurrentLiveVideoId();
    if (!videoId) return;

    if (bgChatIframe && currentBgVideoId === videoId && document.body.contains(bgChatIframe)) {
        return;
    }

    if (bgChatIframe) {
        bgChatIframe.remove();
        bgChatIframe = null;
    }

    currentBgVideoId = videoId;
    bgChatIframe = document.createElement('iframe');
    bgChatIframe.id = 'ytc-bg-live-chat';

    // Ưu tiên lấy src từ native frame nếu có (chứa continuation token cho replay/DVR chuẩn xác)
    const nativeFrame = document.querySelector('iframe#chatframe, ytd-live-chat-frame iframe');
    let targetSrc = `https://www.youtube.com/live_chat?v=${videoId}`;
    if (nativeFrame && nativeFrame.src && nativeFrame.src.includes('live_chat')) {
        targetSrc = nativeFrame.src;
    }
    bgChatIframe.src = targetSrc;
    // Đặt ở góc dưới màn hình kích thước 2x2px, trong viewport (intersectionRatio > 0) để Chromium & YouTube không bao giờ đóng băng polling
    bgChatIframe.style.cssText = 'position:fixed !important;bottom:0 !important;right:0 !important;width:2px !important;height:2px !important;opacity:0.001 !important;pointer-events:none !important;z-index:-9999 !important;border:none !important;';

    bgChatIframe.addEventListener('load', () => {
        setTimeout(findAndObserveItems, 200);
        setTimeout(findAndObserveItems, 800);
    });

    document.body.appendChild(bgChatIframe);
}

export function stopAllLiveChatIfDisabled() {
    const isOverlayOn = currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off';

    // Khi người dùng tắt Live Chat Overlay: dọn dẹp iframe chạy ngầm để giải phóng 100% tài nguyên
    if (!isOverlayOn) {
        if (bgChatIframe) {
            bgChatIframe.remove();
            bgChatIframe = null;
            currentBgVideoId = null;
        }
    }
}

export function restoreNativeLiveChatIfSaved() {
    // Không làm gì nếu không có trạng thái lưu
}

export function updateChatOverlayVisibility() {
    const mode = currentConfig.chatOverlay || 'off';
    if (mode !== 'off') {
        ensureChatOverlayContainers();
    }
    const danmaku = document.getElementById('ytc-danmaku-container') || danmakuContainer;
    const streamer = document.getElementById('ytc-streamer-box') || streamerBox;
    const player = document.querySelector('#movie_player:not(#inline-preview-player)');

    const showDanmaku = mode === 'danmaku';
    const showStreamer = mode === 'streamer';

    if (danmaku) {
        danmaku.style.display = showDanmaku ? 'block' : 'none';
        danmaku.innerHTML = '';
        danmakuQueue.length = 0;
        laneNextAvailableTime.fill(0);
        setLastDanmakuSpawnTime(Date.now() + 400);
        setLastSpawnedLane(-1);
        if (showDanmaku) {
            stopDanmakuScheduler();
            startDanmakuScheduler();
        } else {
            stopDanmakuScheduler();
        }
    }
    if (streamer) {
        streamer.style.display = showStreamer ? 'flex' : 'none';
        const msgs = streamer.querySelector('.ytc-box-messages');
        if (msgs) {
            msgs.innerHTML = '';
            if (showStreamer) {
                const loading = document.createElement('div');
                loading.className = 'ytc-box-item ytc-box-loading';
                loading.style.cssText = 'padding:8px;text-align:center;color:#fff;font-size:12px;font-style:italic;';
                loading.textContent = '💬 Đang kết nối Live Chat...';
                msgs.appendChild(loading);
            }
        }

        if (showStreamer && player) {
            setupChatBoxInteractions(streamer, player);
            applyChatBoxPos(streamer, player);
            showInitialBox(streamer);
        }
    }

    if (mode !== 'off') {
        ensureNativeLiveChatRunning();
        seenMessageIds.clear();
        ensureBackgroundLiveChat();
        requestExistingMessages();
    } else {
        setNativeChatHiddenState(false);
        stopAllLiveChatIfDisabled();
    }
}

// --------------------------------------------------------------------------
// KHỞI CHẠY BÊN TRONG IFRAME LIVE CHAT
// --------------------------------------------------------------------------
const UNICODE_EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{200D}\u{FE0F}]/gu;

export function initIframeChatSender() {
    let iframeConfig = currentConfig;

    function injectIframeEmojiStyle() {
        let style = document.getElementById('ytc-iframe-emoji-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'ytc-iframe-emoji-style';
            style.textContent = `
                html.ytc-hide-chat-emojis img.emoji,
                html.ytc-hide-chat-emojis img.yt-emoji,
                html.ytc-hide-chat-emojis .emoji,
                html.ytc-hide-chat-emojis yt-live-chat-paid-sticker-renderer {
                    display: none !important;
                }
                html.ytc-hide-chat-emojis .ytc-emoji-only-msg {
                    display: none !important;
                }
            `;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    function filterSingleMessageNode(node, hideEmojis) {
        if (!node || node.nodeType !== 1) return;
        if (!hideEmojis) {
            node.classList.remove('ytc-emoji-only-msg');
            return;
        }
        if (node.tagName && node.tagName.toLowerCase().includes('sticker')) {
            node.classList.add('ytc-emoji-only-msg');
            return;
        }
        const msgEl = node.querySelector('#message');
        if (msgEl) {
            const clone = msgEl.cloneNode(true);
            const images = clone.querySelectorAll('img');
            images.forEach(img => img.remove());
            let textOnly = (clone.textContent || '').replace(UNICODE_EMOJI_REGEX, '').trim();
            if (textOnly.length === 0) {
                node.classList.add('ytc-emoji-only-msg');
            } else {
                node.classList.remove('ytc-emoji-only-msg');
            }
        }
    }

    function filterAllIframeMessages(hideEmojis) {
        const all = getAllChatElements(document);
        all.forEach(el => filterSingleMessageNode(el, hideEmojis));
    }

    function updateIframeEmojiState(cfg) {
        iframeConfig = cfg || iframeConfig;
        const hide = !!iframeConfig.hideChatEmojis;
        document.documentElement.classList.toggle('ytc-hide-chat-emojis', hide);
        if (document.body) {
            document.body.classList.toggle('ytc-hide-chat-emojis', hide);
        }
        filterAllIframeMessages(hide);
    }

    injectIframeEmojiStyle();
    updateIframeEmojiState(currentConfig);

    function handleNode(node) {
        if (!node || node.nodeType !== 1) return;
        filterSingleMessageNode(node, !!iframeConfig.hideChatEmojis);
        const selector = 'yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, yt-live-chat-paid-sticker-renderer';
        if (node.matches && node.matches(selector)) {
            const data = extractMessageData(node);
            if (data) {
                try { window.top.postMessage({ type: 'YTC_LIVE_CHAT_MSG', payload: data }, '*'); } catch (e) {}
            }
            return;
        }
        if (node.querySelectorAll) {
            const targets = node.querySelectorAll(selector);
            targets.forEach(t => {
                filterSingleMessageNode(t, !!iframeConfig.hideChatEmojis);
                const data = extractMessageData(t);
                if (data) {
                    try { window.top.postMessage({ type: 'YTC_LIVE_CHAT_MSG', payload: data }, '*'); } catch (e) {}
                }
            });
        }
    }

    function sendExisting(items) {
        const existing = getAllChatElements(items);
        if (existing && existing.length) {
            existing.forEach(node => filterSingleMessageNode(node, !!iframeConfig.hideChatEmojis));
            // Khi quét tin có sẵn lúc đầu: chỉ lấy 4 tin mới nhất để chống đè và dính chùm
            const recent = Array.from(existing).slice(-4);
            recent.forEach((node) => {
                const data = extractMessageData(node);
                if (data) {
                    data.isBacklog = true;
                    try { window.top.postMessage({ type: 'YTC_LIVE_CHAT_MSG', payload: data, isBacklog: true }, '*'); } catch (e) {}
                }
            });
        }
    }

    function attach(items) {
        if (!items || items._ytcBoundIframe) return;
        items._ytcBoundIframe = true;

        sendExisting(items);

        const obs = new MutationObserver((mutations) => {
            const selector = 'yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, yt-live-chat-paid-sticker-renderer';
            const newNodes = [];

            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (!node || node.nodeType !== 1) continue;
                    if (node.matches && node.matches(selector)) {
                        filterSingleMessageNode(node, !!iframeConfig.hideChatEmojis);
                        newNodes.push(node);
                    } else if (node.querySelectorAll) {
                        const targets = node.querySelectorAll(selector);
                        targets.forEach(t => {
                            filterSingleMessageNode(t, !!iframeConfig.hideChatEmojis);
                            newNodes.push(t);
                        });
                    }
                }
            }

            if (newNodes.length === 0) return;

            // Nếu phát hiện đợt nạp hàng loạt (10-20 tin dính chùm lúc khởi tạo): chỉ lấy 4 tin mới nhất!
            const nodesToProcess = (newNodes.length > 5) ? newNodes.slice(-4) : newNodes;

            nodesToProcess.forEach(node => {
                const data = extractMessageData(node);
                if (data) {
                    try { window.top.postMessage({ type: 'YTC_LIVE_CHAT_MSG', payload: data }, '*'); } catch (e) {}
                }
            });
        });
        obs.observe(items, { childList: true });
    }

    function tryFindItems() {
        const items = document.querySelector('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #chat #items, #items');
        if (items) {
            attach(items);
            return true;
        }
        return false;
    }

    if (!tryFindItems()) {
        const obs = new MutationObserver(() => {
            if (tryFindItems()) obs.disconnect();
        });
        obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
        setTimeout(() => obs.disconnect(), 20000);

        const pollTimer = setInterval(() => {
            if (tryFindItems()) {
                clearInterval(pollTimer);
                obs.disconnect();
            }
        }, 500);
        setTimeout(() => clearInterval(pollTimer), 20000);
    }

    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'YTC_CONFIG_UPDATED' && e.data.config) {
            updateIframeEmojiState(e.data.config);
        }
        if (e.data && e.data.type === 'YTC_REQUEST_EXISTING_MSGS') {
            const items = document.querySelector('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #chat #items, #items') || document;
            if (items) sendExisting(items);
        }
        if (e.data && e.data.type === 'YTC_CLOSE_NATIVE_CHAT') {
            const btn = document.querySelector(
                'yt-live-chat-header-renderer #close-button button, ' +
                '#close-button yt-button-renderer button, ' +
                '#close-button button, ' +
                'yt-button-shape button[aria-label="Đóng"], ' +
                'yt-button-shape button[aria-label="Close"], ' +
                'button[aria-label="Đóng"], ' +
                'button[aria-label="Close"]'
            );
            if (btn && btn.offsetParent !== null) {
                btn.click();
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.isTrusted) return;
        const isClose = !!e.target.closest('#close-button, [aria-label*="Đóng" i], [aria-label*="Close" i]');
        if (isClose) {
            try {
                window.top.postMessage({ type: 'YTC_NATIVE_CHAT_CLOSED_BY_USER' }, '*');
            } catch (err) {}
        }
    }, true);

    setInterval(() => {
        try {
            if (isUserInteractingWithChatMenu(document)) return;

            const showMoreBtn = document.querySelector('#show-more:not([hidden]) button, #show-more button');
            if (showMoreBtn && showMoreBtn.offsetParent !== null) {
                const rect = showMoreBtn.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    showMoreBtn.click();
                }
            }

            const scroller = document.querySelector('#item-scroller, yt-live-chat-item-list-renderer #item-scroller');
            if (scroller && !scroller.matches(':hover')) {
                const distFromBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
                if (distFromBottom > 50) {
                    scroller.scrollTop = scroller.scrollHeight;
                }
            }
        } catch (e) {}
    }, 2000);
}

function isUserInteractingWithChatMenu(doc) {
    const root = doc || document;
    const popups = root.querySelectorAll('tp-yt-iron-dropdown, iron-dropdown, ytd-menu-popup-renderer, tp-yt-paper-listbox');
    for (const popup of popups) {
        if (popup.offsetParent !== null && !popup.hasAttribute('aria-hidden') && popup.style.display !== 'none') {
            return true;
        }
    }
    return false;
}

function processChatNode(node) {
    if (!node || node.nodeType !== 1) return;
    const selector = 'yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, yt-live-chat-paid-sticker-renderer';

    if (node.matches && node.matches(selector)) {
        const data = extractMessageData(node);
        if (data) displayChatMessage(data);
        return;
    }

    if (node.querySelectorAll) {
        const targets = node.querySelectorAll(selector);
        targets.forEach(t => {
            const data = extractMessageData(t);
            if (data) displayChatMessage(data);
        });
    }
}

function observeItemsElement(items) {
    if (!items || items._ytcBoundTop) return;
    items._ytcBoundTop = true;

    const obs = new MutationObserver((mutations) => {
        if (!currentConfig.chatOverlay || currentConfig.chatOverlay === 'off') return;
        const selector = 'yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, yt-live-chat-paid-sticker-renderer';
        const newNodes = [];

        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!node || node.nodeType !== 1) continue;
                if (node.matches && node.matches(selector)) {
                    newNodes.push(node);
                } else if (node.querySelectorAll) {
                    const targets = node.querySelectorAll(selector);
                    targets.forEach(t => newNodes.push(t));
                }
            }
        }

        if (newNodes.length === 0) return;

        // Nếu phát hiện nạp hàng loạt (10-20 tin dính chùm): chỉ lấy 4 tin mới nhất để chống đè
        const nodesToProcess = (newNodes.length > 5) ? newNodes.slice(-4) : newNodes;

        if (newNodes.length > 5) {
            const discarded = newNodes.slice(0, -4);
            discarded.forEach(n => {
                if (n.id) seenMessageIds.add(n.id);
            });
        }

        nodesToProcess.forEach(node => {
            const data = extractMessageData(node);
            if (data) displayChatMessage(data);
        });
    });
    obs.observe(items, { childList: true });
}

function findAndObserveItems() {
    const mainItems = document.querySelectorAll('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items');
    mainItems.forEach(items => observeItemsElement(items));

    const frames = document.querySelectorAll('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"], iframe#ytc-bg-live-chat');
    frames.forEach(frame => {
        if (!frame._ytcLoadBound) {
            frame._ytcLoadBound = true;
            frame.addEventListener('load', () => {
                setTimeout(findAndObserveItems, 200);
                setTimeout(findAndObserveItems, 800);
                setTimeout(findAndObserveItems, 1500);
            });
        }
        try {
            const doc = frame.contentDocument || frame.contentWindow?.document;
            if (doc && doc.location && doc.location.href !== 'about:blank') {
                let docStyle = doc.getElementById('ytc-iframe-emoji-style');
                if (!docStyle) {
                    docStyle = doc.createElement('style');
                    docStyle.id = 'ytc-iframe-emoji-style';
                    docStyle.textContent = `
                        html.ytc-hide-chat-emojis img.emoji,
                        html.ytc-hide-chat-emojis img.yt-emoji,
                        html.ytc-hide-chat-emojis .emoji,
                        html.ytc-hide-chat-emojis yt-live-chat-paid-sticker-renderer {
                            display: none !important;
                        }
                        html.ytc-hide-chat-emojis .ytc-emoji-only-msg {
                            display: none !important;
                        }
                    `;
                    (doc.head || doc.documentElement).appendChild(docStyle);
                }
                doc.documentElement.classList.toggle('ytc-hide-chat-emojis', !!currentConfig.hideChatEmojis);
                if (doc.body) {
                    doc.body.classList.toggle('ytc-hide-chat-emojis', !!currentConfig.hideChatEmojis);
                }
                const iframeItems = doc.querySelectorAll('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #items');
                if (iframeItems.length > 0) {
                    iframeItems.forEach(items => observeItemsElement(items));
                } else if (!doc._ytcDocObserverAttached) {
                    doc._ytcDocObserverAttached = true;
                    const docObs = new MutationObserver(() => {
                        const lateItems = doc.querySelectorAll('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #items');
                        if (lateItems.length > 0) {
                            lateItems.forEach(items => observeItemsElement(items));
                            docObs.disconnect();
                        }
                    });
                    docObs.observe(doc.documentElement || doc.body, { childList: true, subtree: true });
                    setTimeout(() => docObs.disconnect(), 20000);
                }
            }
        } catch (e) {}
    });
}

// --------------------------------------------------------------------------
// KHỞI CHẠY ĐIỀU PHỐI CHAT CHÍNH (TOP WINDOW)
// --------------------------------------------------------------------------
export function initChatOverlay() {
    if (chatOverlayInitialized) return;
    setChatOverlayInitialized(true);

    setupChatToggleListeners();
    observePlayerChatState();
    observeFullscreenChatPanels();

    document.addEventListener('fullscreenchange', () => {
        const isFs = !!(document.fullscreenElement || document.querySelector('#movie_player.ytp-fullscreen'));
        const isOpen = isNativeChatOpenInFullscreen();

        if (!isFs) {
            setNativeChatHiddenState(false);
        } else if ((isOpen || userManuallyOpenedChat) && !currentConfig.hideNativeLiveChat) {
            userManuallyOpenedChat = true;
            setNativeChatHiddenState(false);
        } else if ((currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') || currentConfig.hideNativeLiveChat) {
            setNativeChatHiddenState(true);
        }
        syncPlayerFullscreenSize();
        setTimeout(syncPlayerFullscreenSize, 50);
        setTimeout(syncPlayerFullscreenSize, 150);
        setTimeout(syncPlayerFullscreenSize, 300);
        setTimeout(syncPlayerFullscreenSize, 600);
    });
    let windowResizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(windowResizeTimer);
        windowResizeTimer = setTimeout(() => {
            syncPlayerFullscreenSize();
        }, 150);
    });

    window.addEventListener('ytc-close-streamer-box', () => {
        currentConfig.chatOverlay = 'off';
        updateChatOverlayVisibility();
        import('../ui/sync.js').then(m => m.syncPanelState()).catch(() => {});
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
                if (currentConfig.chatOverlay === 'danmaku') {
                    startDanmakuScheduler();
                }
                requestExistingMessages();
            }
        }
    });

    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'YTC_LIVE_CHAT_MSG' && e.data.payload) {
            const isBacklog = !!e.data.isBacklog || !!e.data.payload.isBacklog;
            displayChatMessage(e.data.payload, isBacklog);
        }
        if (e.data && e.data.type === 'YTC_NATIVE_CHAT_CLOSED_BY_USER') {
            userManuallyOpenedChat = false;
        }
    });

    if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
        findAndObserveItems();
    }
    if (currentConfig.hideNativeLiveChat) {
        autoCollapseNativeChatIfOpen();
        setTimeout(autoCollapseNativeChatIfOpen, 300);
        setTimeout(autoCollapseNativeChatIfOpen, 800);
        setTimeout(autoCollapseNativeChatIfOpen, 1500);
    }
    setupTheaterModeObserver();

    setInterval(() => {
        if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
            findAndObserveItems();
            ensureNativeLiveChatRunning();
            ensureBackgroundLiveChat();
        }
    }, 2000);

    if (location.pathname.startsWith('/watch') || location.pathname.startsWith('/live')) {
        whenElement('#movie_player:not(#inline-preview-player)', () => {
            observePlayerChatState();
            observeFullscreenChatPanels();
            ensureChatOverlayContainers();
            if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
                ensureBackgroundLiveChat();
                ensureNativeLiveChatRunning();
            } else if (currentConfig.hideNativeLiveChat) {
                stopAllLiveChatIfDisabled();
            }
        });
    }
}
