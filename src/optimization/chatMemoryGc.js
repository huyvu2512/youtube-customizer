// ==========================================================================
// CHAT DOM MEMORY CLEANER (CAPS CHAT DOM MESSAGES AT ~100 TO PREVENT RAM LEAKS)
// ==========================================================================
import { currentConfig } from '../core/config.js';

let gcInterval = null;
const MAX_CHAT_ITEMS = 100;

function cleanChatContainer(itemsContainer) {
    if (!itemsContainer || !itemsContainer.children) return;
    const count = itemsContainer.children.length;
    if (count <= 120) return;

    const toRemove = count - MAX_CHAT_ITEMS;
    for (let i = 0; i < toRemove; i++) {
        if (itemsContainer.firstElementChild) {
            itemsContainer.firstElementChild.remove();
        }
    }
}

export function performChatMemoryGc() {
    if (!currentConfig.chatMemoryGc) return;

    // 1. Quét container chat trên top window
    const topItems = document.querySelectorAll(
        'yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items'
    );
    topItems.forEach(cleanChatContainer);

    // 2. Quét bên trong các iframe chat (bao gồm iframe gốc và iframe chạy ngầm)
    const frames = document.querySelectorAll('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"]');
    frames.forEach(frame => {
        try {
            const doc = frame.contentDocument || frame.contentWindow?.document;
            if (doc) {
                const iframeItems = doc.querySelectorAll(
                    'yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items'
                );
                iframeItems.forEach(cleanChatContainer);
            }
        } catch (e) {}
    });
}

export function initChatMemoryGc() {
    if (gcInterval) return;

    // Chạy dọn rác định kỳ mỗi 10 giây
    gcInterval = setInterval(() => {
        if (currentConfig.chatMemoryGc) {
            performChatMemoryGc();
        }
    }, 10000);
}

export function stopChatMemoryGc() {
    if (gcInterval) {
        clearInterval(gcInterval);
        gcInterval = null;
    }
}
