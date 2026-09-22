// ==========================================================================
// CHAT OVERLAY STATE & CONTAINER MANAGEMENT
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { setElementHTML } from '../core/utils.js';

export const CHATBOX_POS_KEY = 'ytc_chatbox_pos';

export let chatOverlayInitialized = false;
export function setChatOverlayInitialized(v) { chatOverlayInitialized = v; }

export let danmakuContainer = null;
export let streamerBox = null;
export let streamerMessages = null;

// Bộ nhớ đệm khử trùng lặp tin nhắn
export const seenMessageIds = new Set();
export function isDuplicateMessage(id, author, text) {
    if (id) {
        if (seenMessageIds.has(id)) return true;
        seenMessageIds.add(id);
        if (seenMessageIds.size > 600) {
            const first = seenMessageIds.values().next().value;
            seenMessageIds.delete(first);
        }
        return false;
    }
    const key = `${author}:${text}`;
    if (seenMessageIds.has(key)) return true;
    seenMessageIds.add(key);
    setTimeout(() => seenMessageIds.delete(key), 3500);
    return false;
}

export let isNativeChatHiddenByScript = false;

export function setNativeChatHiddenState(hidden) {
    isNativeChatHiddenByScript = !!hidden;
    const root = document.documentElement;
    const body = document.body;
    if (hidden) {
        root.setAttribute('data-ytc-chat-hidden', 'true');
        if (body) body.setAttribute('data-ytc-chat-hidden', 'true');
    } else {
        root.removeAttribute('data-ytc-chat-hidden');
        if (body) body.removeAttribute('data-ytc-chat-hidden');
    }
    syncPlayerFullscreenSize();
}

export function syncPlayerFullscreenSize() {
    const isFs = !!(document.fullscreenElement || document.querySelector('#movie_player.ytp-fullscreen, .html5-video-player.ytp-fullscreen'));
    const player = document.querySelector('#movie_player, .html5-video-player');
    if (!player) return;

    if (!isFs) {
        const video = player.querySelector('video.html5-main-video');
        if (video) {
            if (video.dataset.ytcOverridden) {
                delete video.dataset.ytcOverridden;
                video.style.width = '';
                video.style.height = '';
                video.style.left = '';
                video.style.top = '';
            }
        }
        // Kích hoạt YouTube tính toán lại kích thước video khi thoát fullscreen để chống đen màn hình
        if (typeof player.setInternalSize === 'function') {
            try { player.setInternalSize(); } catch(e) {}
        }
        window.dispatchEvent(new Event('resize'));
        return;
    }

    window.dispatchEvent(new Event('resize'));
    if (typeof player.setInternalSize === 'function') {
        try { player.setInternalSize(); } catch(e) {}
    }

    if (isNativeChatHiddenByScript) {
        const video = player.querySelector('video.html5-main-video');
        if (video && video.videoWidth && video.videoHeight) {
            const screenW = window.innerWidth || screen.width;
            const screenH = window.innerHeight || screen.height;
            const videoRatio = video.videoWidth / video.videoHeight;
            const screenRatio = screenW / screenH;

            let targetW, targetH, targetLeft, targetTop;
            if (screenRatio > videoRatio) {
                targetH = screenH;
                targetW = Math.round(targetH * videoRatio);
                targetLeft = Math.round((screenW - targetW) / 2);
                targetTop = 0;
            } else {
                targetW = screenW;
                targetH = Math.round(targetW / videoRatio);
                targetLeft = 0;
                targetTop = Math.round((screenH - targetH) / 2);
            }

            const currentW = parseInt(video.style.width) || 0;
            if (currentW < targetW - 20) {
                video.dataset.ytcOverridden = 'true';
                video.style.width = `${targetW}px`;
                video.style.height = `${targetH}px`;
                video.style.left = `${targetLeft}px`;
                video.style.top = `${targetTop}px`;
            }
        }
    }
}

export function ensureChatOverlayContainers() {
    const player = document.querySelector('#movie_player, .html5-video-player');
    if (!player) return;

    let dContainer = document.getElementById('ytc-danmaku-container');
    if (!dContainer) {
        dContainer = document.createElement('div');
        dContainer.id = 'ytc-danmaku-container';
        player.appendChild(dContainer);
    } else if (dContainer.parentElement !== player) {
        player.appendChild(dContainer);
    }
    danmakuContainer = dContainer;

    let sBox = document.getElementById('ytc-streamer-box');
    if (!sBox) {
        sBox = document.createElement('div');
        sBox.id = 'ytc-streamer-box';
        setElementHTML(sBox, `
            <div class="ytc-box-header">
                <span class="ytc-box-title">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style="flex-shrink:0;"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                    Live Chat
                </span>
                <button class="ytc-box-close" title="Ẩn khung chat" aria-label="Ẩn khung chat">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="ytc-box-messages"></div>
            <div class="ytc-box-resize" title="Kéo để thay đổi kích thước"></div>
        `);
        player.appendChild(sBox);

        const closeBtn = sBox.querySelector('.ytc-box-close');
        if (closeBtn) {
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                sBox.style.display = 'none';
                window.dispatchEvent(new CustomEvent('ytc-close-streamer-box'));
            };
        }
    } else if (sBox.parentElement !== player) {
        player.appendChild(sBox);
    }
    streamerBox = sBox;
    streamerMessages = sBox.querySelector('.ytc-box-messages');
}
