// ==========================================================================
// CHAT OBSERVER, BACKGROUND SYNC & IFRAME CONTROLLER
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { whenElement } from '../core/utils.js';
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

export function autoCollapseNativeChatIfOpen() {
    const shouldCollapse = (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') || !!currentConfig.hideNativeLiveChat;
    if (!shouldCollapse) return;
    if (userManuallyOpenedChat && !currentConfig.hideNativeLiveChat) return;
    if (hasAutoCollapsedChatForCurrentVideo) return;

    const chatFrame = document.querySelector('ytd-live-chat-frame#chat, #chat.ytd-watch-flexy');
    const watchFlexy = document.querySelector('ytd-watch-flexy');
    if (!chatFrame) return;

    const isCollapsed = chatFrame.hasAttribute('collapsed') || (watchFlexy && watchFlexy.hasAttribute('chat-collapsed'));
    if (!isCollapsed) {
        // Chat đang mở trên giao diện thường -> nhấp nút đóng chính thức của YouTube để chuyển sang dạng thu gọn
        const hideBtn = chatFrame.querySelector(
            '#show-hide-button button, ' +
            '#close-button button, ' +
            '#close-button, ' +
            '[aria-label*="Ẩn cuộc trò chuyện" i], ' +
            '[aria-label*="Hide chat" i], ' +
            'ytd-button-renderer#show-hide-button button, ' +
            'yt-button-shape button'
        );
        if (hideBtn) {
            hasAutoCollapsedChatForCurrentVideo = true;
            try { hideBtn.click(); } catch (e) {}
        }
    } else {
        hasAutoCollapsedChatForCurrentVideo = true;
    }
}

export function isNativeChatOpenInFullscreen() {
    // 1. Kiểm tra class trên player (control bar button hoặc theme cũ)
    const player = document.querySelector('#movie_player, .html5-video-player');
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
    const isFs = !!(document.fullscreenElement || document.querySelector('#movie_player.ytp-fullscreen, .html5-video-player.ytp-fullscreen'));
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

        // 1. Nút ĐÓNG / ẨN CHAT (X hoặc nút thu gọn):
        const isCloseBtn = !!e.target.closest(
            '#panels-full-bleed-container #visibility-button, ' +
            '#panels-full-bleed-container #close-button, ' +
            '#panels-full-bleed-container [aria-label*="Đóng" i], ' +
            '#panels-full-bleed-container [aria-label*="Close" i], ' +
            'ytd-engagement-panel-section-list-renderer #visibility-button, ' +
            'ytd-engagement-panel-section-list-renderer #close-button, ' +
            'ytd-engagement-panel-section-list-renderer [aria-label*="Đóng" i], ' +
            'ytd-engagement-panel-section-list-renderer [aria-label*="Close" i], ' +
            'ytd-live-chat-frame #show-hide-button button, ' +
            'ytd-live-chat-frame #close-button button, ' +
            'ytd-live-chat-frame #close-button, ' +
            '[aria-label*="Ẩn cuộc trò chuyện" i], ' +
            '[aria-label*="Thu gọn cuộc trò chuyện" i], ' +
            '[aria-label*="Hide chat" i], ' +
            '[aria-label*="Collapse live chat" i], ' +
            '[aria-label*="Close chat" i]'
        );

        if (isCloseBtn) {
            userManuallyOpenedChat = false;
            const isFs = !!(document.fullscreenElement || document.querySelector('#movie_player.ytp-fullscreen, .html5-video-player.ytp-fullscreen'));
            if (isFs && currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
                setNativeChatHiddenState(true);
            }
            return;
        }

        // 2. Click vào bất kỳ nút nào để BẬT / TOGGLE Live Chat (Player bar, Action bar cạnh Like/Dislike, Teaser):
        const isChatBtn = !!e.target.closest(
            '.ytp-live-chat-button, ' +
            '.ytp-chat-button, ' +
            'button[data-tooltip-target-id*="chat" i], ' +
            '[aria-label*="trò chuyện" i], ' +
            '[aria-label*="chat" i], ' +
            '[aria-label*="cuộc trò chuyện" i], ' +
            '[title*="trò chuyện" i], ' +
            '[title*="chat" i], ' +
            '[target-id*="chat" i], ' +
            '[target-id*="engagement-panel" i], ' +
            '[data-target-id*="chat" i], ' +
            '[data-target-id*="engagement-panel" i], ' +
            '[aria-controls*="chat" i], ' +
            '[aria-controls*="engagement" i], ' +
            '#show-hide-button button, ' +
            'button#show-button, ' +
            '#show-button, ' +
            '[aria-label*="Hiện cuộc trò chuyện" i], ' +
            '[aria-label*="Mở rộng cuộc trò chuyện" i], ' +
            '[aria-label*="Mở bảng điều khiển" i], ' +
            '[aria-label*="Show chat" i], ' +
            '[aria-label*="Expand live chat" i], ' +
            '[aria-label*="Open panel" i], ' +
            'ytd-live-chat-frame[collapsed] #teaser, ' +
            'ytd-live-chat-frame[collapsed] ytd-button-renderer, ' +
            'ytd-live-chat-frame[collapsed] yt-button-shape'
        );

        if (isChatBtn) {
            const isFs = !!(document.fullscreenElement || document.querySelector('#movie_player.ytp-fullscreen, .html5-video-player.ytp-fullscreen'));
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

    const isFs = !!(document.fullscreenElement || document.querySelector('#movie_player.ytp-fullscreen, .html5-video-player.ytp-fullscreen'));

    if (isFs) {
        if (!userManuallyOpenedChat || currentConfig.hideNativeLiveChat) {
            setNativeChatHiddenState(true);
        } else {
            setNativeChatHiddenState(false);
        }
    } else {
        // Giao diện thường: không bao giờ set data-ytc-chat-hidden="true" để người dùng mở/đóng bình thường
        setNativeChatHiddenState(false);
        // Tự động thu gọn khung chat gốc 1 lần duy nhất để gọn gàng như người dùng mong muốn
        autoCollapseNativeChatIfOpen();
    }
}

export const ensureNativeLiveChatRunning = syncNativeChatState;

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
                // Nạp tối đa 8 tin gần nhất cho khung nổi
                const recent = allExisting.slice(-8);
                recent.forEach((node, i) => {
                    const data = extractMessageData(node);
                    if (data) {
                        data.isBacklog = true;
                        setTimeout(() => displayChatMessage(data, true), i * 100);
                    }
                });
                return true;
            } else if (currentConfig.chatOverlay === 'danmaku') {
                // Nạp ngay 3 tin gần nhất cho Danmaku chạy lướt mượt mà, không để màn hình bị trống
                const recent = allExisting.slice(-3);
                recent.forEach((node, i) => {
                    const data = extractMessageData(node);
                    if (data) {
                        setTimeout(() => displayChatMessage(data, false), i * 350);
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
    bgChatIframe.src = `https://www.youtube.com/live_chat?v=${videoId}`;
    bgChatIframe.style.cssText = 'position:fixed !important;top:-9999px !important;left:-9999px !important;width:350px !important;height:600px !important;opacity:0.01 !important;pointer-events:none !important;z-index:-9999 !important;border:none !important;';

    document.body.appendChild(bgChatIframe);
}

export function updateChatOverlayVisibility() {
    const mode = currentConfig.chatOverlay || 'off';
    if (mode !== 'off') {
        ensureChatOverlayContainers();
    }
    const danmaku = document.getElementById('ytc-danmaku-container') || danmakuContainer;
    const streamer = document.getElementById('ytc-streamer-box') || streamerBox;
    const player = document.querySelector('#movie_player, .html5-video-player');

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
        if (bgChatIframe) {
            bgChatIframe.remove();
            bgChatIframe = null;
            currentBgVideoId = null;
        }
    }
}

// --------------------------------------------------------------------------
// KHỞI CHẠY BÊN TRONG IFRAME LIVE CHAT
// --------------------------------------------------------------------------
export function initIframeChatSender() {
    function handleNode(node) {
        if (!node || node.nodeType !== 1) return;
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
            const recent = Array.from(existing).slice(-8);
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
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    handleNode(node);
                }
            }
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
        if (e.data && e.data.type === 'YTC_REQUEST_EXISTING_MSGS') {
            const items = document.querySelector('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #chat #items, #items') || document;
            if (items) sendExisting(items);
        }
    });

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
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                processChatNode(node);
            }
        }
    });
    obs.observe(items, { childList: true });
}

function findAndObserveItems() {
    const mainItems = document.querySelectorAll('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items');
    mainItems.forEach(items => observeItemsElement(items));

    const frames = document.querySelectorAll('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"]');
    frames.forEach(frame => {
        if (!frame._ytcLoadBound) {
            frame._ytcLoadBound = true;
            frame.addEventListener('load', () => {
                setTimeout(findAndObserveItems, 300);
                setTimeout(findAndObserveItems, 1000);
            });
        }
        try {
            const doc = frame.contentDocument || frame.contentWindow?.document;
            if (doc) {
                const iframeItems = doc.querySelectorAll('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #items');
                iframeItems.forEach(items => observeItemsElement(items));
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
        const isFs = !!(document.fullscreenElement || document.querySelector('#movie_player.ytp-fullscreen, .html5-video-player.ytp-fullscreen'));
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
    });

    findAndObserveItems();

    setInterval(() => {
        if (currentConfig.hideNativeLiveChat) {
            autoCollapseNativeChatIfOpen();
        }
        if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
            findAndObserveItems();
            ensureNativeLiveChatRunning();
            ensureBackgroundLiveChat();
            try {
                if (!isUserInteractingWithChatMenu(document)) {
                    const showMore = document.querySelector('#show-more:not([hidden]) button, #show-more button');
                    if (showMore && showMore.offsetParent !== null) {
                        const rect = showMore.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0) {
                            showMore.click();
                        }
                    }
                    const scroller = document.querySelector('#item-scroller, yt-live-chat-item-list-renderer #item-scroller');
                    if (scroller && !scroller.matches(':hover')) {
                        const dist = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
                        if (dist > 50) scroller.scrollTop = scroller.scrollHeight;
                    }
                }
            } catch (e) {}
        }
    }, 2000);

    if (location.pathname.startsWith('/watch') || location.pathname.startsWith('/live')) {
        whenElement('#movie_player, .html5-video-player', () => {
            observePlayerChatState();
            observeFullscreenChatPanels();
            ensureChatOverlayContainers();
            ensureBackgroundLiveChat();
            if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
                ensureNativeLiveChatRunning();
            }
        });
    }
}
