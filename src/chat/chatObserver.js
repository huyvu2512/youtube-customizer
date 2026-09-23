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
export let hasAutoExpandedDescriptionForCurrentVideo = false;

export function resetChatCollapseState() {
    userManuallyOpenedChat = false;
    hasAutoCollapsedChatForCurrentVideo = false;
    hasAutoExpandedDescriptionForCurrentVideo = false;
}

export function autoExpandDescriptionIfCollapsed() {
    if (!currentConfig.hideNativeLiveChat) return;
    if (hasAutoExpandedDescriptionForCurrentVideo) return;
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;

    const expander = document.querySelector(
        'ytd-watch-metadata ytd-text-inline-expander[is-collapsed], ' +
        '#description ytd-text-inline-expander[is-collapsed], ' +
        'ytd-text-inline-expander#description-inline-expander[is-collapsed]'
    );
    if (expander) {
        const expandBtn = expander.querySelector('#expand, tp-yt-paper-button#expand, #more');
        if (expandBtn) {
            hasAutoExpandedDescriptionForCurrentVideo = true;
            expandBtn.click();
        } else {
            hasAutoExpandedDescriptionForCurrentVideo = true;
            expander.removeAttribute('is-collapsed');
            expander.setAttribute('is-expanded', '');
        }
    }
}

export function hideNativeChatElements() {
    if (!currentConfig.hideNativeLiveChat) return;

    // 1. Ẩn nút icon chat trong Action Bar / Pill Bar / Player
    const chatBtns = document.querySelectorAll(
        '#actions [aria-label*="trò chuyện" i], ' +
        '#actions [aria-label*="chat" i], ' +
        '#actions [title*="trò chuyện" i], ' +
        '#actions [title*="chat" i], ' +
        '#top-level-buttons-computed [aria-label*="trò chuyện" i], ' +
        '#top-level-buttons-computed [aria-label*="chat" i], ' +
        '#top-level-buttons-computed [title*="trò chuyện" i], ' +
        '#top-level-buttons-computed [title*="chat" i], ' +
        'ytd-menu-renderer [aria-label*="trò chuyện" i], ' +
        'ytd-menu-renderer [aria-label*="chat" i], ' +
        '.ytp-live-chat-button, ' +
        '.ytp-chat-button, ' +
        '[aria-label*="Trò chuyện trực tiếp" i]'
    );
    chatBtns.forEach(btn => {
        const wrapper = btn.closest('yt-button-view-model, yt-button-shape, ytd-button-renderer') || btn;
        wrapper.style.setProperty('display', 'none', 'important');
    });

    // 2. Ẩn toàn bộ khung Teaser Live Chat (Trực tiếp & Phát lại)
    const teasers = document.querySelectorAll(
        '#chat-teaser, #teaser, ytd-live-chat-frame[collapsed], ' +
        'ytd-engagement-panel-section-list-renderer[target-id*="chat" i], ' +
        '[target-id="engagement-panel-live-chat"], ' +
        'ytd-live-chat-frame#chat, ' +
        '#chat.ytd-watch-flexy'
    );
    teasers.forEach(t => {
        const itemSection = t.closest('ytd-item-section-renderer') || t;
        itemSection.style.setProperty('display', 'none', 'important');
    });

    // 3. Ẩn các khối chứa nút "Mở bảng điều khiển" của chat
    const openPanelBtns = document.querySelectorAll(
        'ytd-item-section-renderer button[aria-label*="Mở bảng điều khiển" i], ' +
        'ytd-item-section-renderer button[aria-label*="Open panel" i], ' +
        '#related button[aria-label*="Mở bảng điều khiển" i], ' +
        '#below button[aria-label*="Mở bảng điều khiển" i]'
    );
    openPanelBtns.forEach(btn => {
        const itemSection = btn.closest('ytd-item-section-renderer');
        if (itemSection) {
            itemSection.style.setProperty('display', 'none', 'important');
        }
    });

    // 4. Mở rộng khung mô tả để lấp đầy khoảng trống bên phải
    autoExpandDescriptionIfCollapsed();
}

export const throttledHideNativeChatElements = rafThrottle(hideNativeChatElements);

let chatElementsObserver = null;
export function setupChatElementsObserver() {
    if (chatElementsObserver) return;
    chatElementsObserver = new MutationObserver(() => {
        if (currentConfig.hideNativeLiveChat) {
            throttledHideNativeChatElements();
        }
    });
    const target = document.querySelector('ytd-app') || document.body || document.documentElement;
    if (target) {
        chatElementsObserver.observe(target, { childList: true, subtree: true });
    }
}

export function autoCollapseNativeChatIfOpen() {
    const shouldCollapse = (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') || !!currentConfig.hideNativeLiveChat;
    if (!shouldCollapse) return;
    if (userManuallyOpenedChat && !currentConfig.hideNativeLiveChat) return;

    // 1. Nếu hideNativeLiveChat đang bật: đóng panel bằng thuộc tính DOM, TUYỆT ĐỐI KHÔNG click giả lập để không làm đóng menu cài đặt
    if (currentConfig.hideNativeLiveChat) {
        const chatPanel = document.querySelector(
            '#panels-full-bleed-container ytd-engagement-panel-section-list-renderer[target-id*="chat" i], ' +
            'ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id*="chat" i]'
        );
        if (chatPanel) {
            chatPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN');
        }
        const watchFlexy = document.querySelector('ytd-watch-flexy');
        if (watchFlexy) {
            const otherExpanded = watchFlexy.querySelectorAll('ytd-engagement-panel-section-list-renderer:not([target-id*="chat" i])[visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]');
            if (otherExpanded.length === 0) {
                watchFlexy.removeAttribute('has-active-panel');
                watchFlexy.removeAttribute('panels-open');
            }
        }
        hideNativeChatElements();
        return;
    }

    // 2. Chế độ thường khi bật overlay: chỉ thu gọn 1 lần duy nhất cho video hiện tại
    if (hasAutoCollapsedChatForCurrentVideo) return;
    const chatFrame = document.querySelector('ytd-live-chat-frame#chat, #chat.ytd-watch-flexy');
    const watchFlexy = document.querySelector('ytd-watch-flexy');
    if (!chatFrame) return;

    const isCollapsed = chatFrame.hasAttribute('collapsed') || (watchFlexy && watchFlexy.hasAttribute('chat-collapsed'));
    if (!isCollapsed) {
        const hideBtn = chatFrame.querySelector(
            '#show-hide-button button, ' +
            '#close-button button, ' +
            '#close-button, ' +
            '[aria-label*="Ẩn cuộc trò chuyện" i], ' +
            '[aria-label*="Hide chat" i]'
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
            const isFs = !!(document.fullscreenElement || document.querySelector('#movie_player.ytp-fullscreen'));
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
    });

    if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
        findAndObserveItems();
    }
    if (currentConfig.hideNativeLiveChat) {
        autoCollapseNativeChatIfOpen();
    }
    setupChatElementsObserver();

    setInterval(() => {
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
        whenElement('#movie_player:not(#inline-preview-player)', () => {
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
