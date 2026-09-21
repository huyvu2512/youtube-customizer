// ==========================================================================
// YOUTUBE CUSTOMIZER - QUẢN LÝ LIVE CHAT OVERLAY (DANMAKU & KHUNG NỔI)
// ==========================================================================
import { currentConfig } from './index.js';
import { safeHTML, whenElement } from './features.js';

const CHATBOX_POS_KEY = 'ytc_chatbox_pos';

let chatOverlayInitialized = false;
let danmakuContainer = null;
let streamerBox = null;
let streamerMessages = null;
let liveCheckTimer = null;
let currentLaneIndex = 0;
const TOTAL_LANES = 6;

// Bộ nhớ đệm khử trùng lặp tin nhắn
const seenMessageIds = new Set();
function isDuplicateMessage(id, author, text) {
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

// --------------------------------------------------------------------------
// 1. LƯU TRỮ VÀ KHÔI PHỤC VỊ TRÍ KHUNG NỔI STREAMER
// --------------------------------------------------------------------------
function getSavedChatBoxPos() {
    try {
        const stored = localStorage.getItem(CHATBOX_POS_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null; // Trả về null nếu chưa từng lưu để đặt ở chính giữa mặc định
}

function saveChatBoxPos(pos) {
    try {
        localStorage.setItem(CHATBOX_POS_KEY, JSON.stringify(pos));
    } catch (e) {}
}

function centerChatBox(box, player) {
    if (!box || !player) return;
    const pRect = player.getBoundingClientRect();
    const pWidth = pRect.width || player.offsetWidth || window.innerWidth;
    const pHeight = pRect.height || player.offsetHeight || window.innerHeight;

    const boxW = Math.min(380, Math.max(280, Math.round(pWidth * 0.38)));
    const boxH = Math.min(300, Math.max(180, Math.round(pHeight * 0.42)));
    const left = Math.max(10, Math.round((pWidth - boxW) / 2));
    const top = Math.max(10, Math.round((pHeight - boxH) / 2));

    box.style.left = `${left}px`;
    box.style.top = `${top}px`;
    box.style.right = 'auto';
    box.style.bottom = 'auto';
    box.style.width = `${boxW}px`;
    box.style.height = `${boxH}px`;
}

function showInitialBox(box) {
    if (!box) return;
    box.classList.add('ytc-box-initial');
    let hasEntered = false;

    const onEnter = () => {
        hasEntered = true;
    };
    const onLeave = () => {
        if (hasEntered) {
            box.classList.remove('ytc-box-initial');
            box.removeEventListener('mouseenter', onEnter);
            box.removeEventListener('mouseleave', onLeave);
        }
    };

    box.addEventListener('mouseenter', onEnter);
    box.addEventListener('mouseleave', onLeave);
}

// --------------------------------------------------------------------------
// 2. TẠO VÀ GẮN CONTAINER VÀO TRÌNH PHÁT VIDEO (#movie_player)
// --------------------------------------------------------------------------
export function ensureChatOverlayContainers() {
    const player = document.querySelector('#movie_player') || document.querySelector('.html5-video-player') || document.querySelector('#player-container-inner');
    if (!player) return;

    // 1. Danmaku Container
    if (!danmakuContainer || !player.contains(danmakuContainer)) {
        const existing = document.getElementById('ytc-danmaku-container');
        if (existing) existing.remove();

        danmakuContainer = document.createElement('div');
        danmakuContainer.id = 'ytc-danmaku-container';
        player.appendChild(danmakuContainer);
    }

    // 2. Khung nổi Streamer Box
    if (!streamerBox || !player.contains(streamerBox)) {
        const existing = document.getElementById('ytc-streamer-box');
        if (existing) existing.remove();

        streamerBox = document.createElement('div');
        streamerBox.id = 'ytc-streamer-box';

        const pos = getSavedChatBoxPos();
        if (pos && (pos.left || pos.right)) {
            if (pos.left) streamerBox.style.left = pos.left;
            else if (pos.right) streamerBox.style.right = pos.right;
            if (pos.top) streamerBox.style.top = pos.top;
            if (pos.width) streamerBox.style.width = pos.width;
            if (pos.height) streamerBox.style.height = pos.height;
        } else {
            // Lần đầu bật: hiện ở CHÍNH GIỮA khung video để người dùng nhận ra ngay
            centerChatBox(streamerBox, player);
        }

        streamerBox.innerHTML = safeHTML(`
            <div class="ytc-box-header" title="Giữ chuột để kéo thả vị trí (nhấp đúp để đặt lại về giữa)">
                <span>💬 Live Chat</span>
                <span style="font-size:10px;opacity:0.7">Kéo thả</span>
            </div>
            <div class="ytc-box-messages"></div>
            <div class="ytc-box-resize" title="Kéo để thay đổi kích thước"></div>
        `);

        player.appendChild(streamerBox);
        setupChatBoxInteractions(streamerBox, player);
    }

    streamerMessages = streamerBox.querySelector('.ytc-box-messages');
}

function setupChatBoxInteractions(box, player) {
    const header = box.querySelector('.ytc-box-header');
    const resizeHandle = box.querySelector('.ytc-box-resize');

    // Kéo thả vị trí (Drag & Drop)
    if (header) {
        header.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            centerChatBox(box, player);
            saveChatBoxPos({
                left: box.style.left,
                top: box.style.top,
                right: '',
                width: box.style.width,
                height: box.style.height
            });
        });

        header.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();

            const pRect = player.getBoundingClientRect();
            const bRect = box.getBoundingClientRect();

            const shiftX = e.clientX - bRect.left;
            const shiftY = e.clientY - bRect.top;

            function onMouseMove(moveEvent) {
                let newLeft = moveEvent.clientX - pRect.left - shiftX;
                let newTop = moveEvent.clientY - pRect.top - shiftY;

                newLeft = Math.max(0, Math.min(newLeft, pRect.width - box.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, pRect.height - box.offsetHeight));

                box.style.left = `${newLeft}px`;
                box.style.top = `${newTop}px`;
                box.style.right = 'auto';
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                saveChatBoxPos({
                    left: box.style.left,
                    top: box.style.top,
                    right: '',
                    width: box.style.width,
                    height: box.style.height
                });
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // Co giãn kích thước (Resize)
    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();

            const startX = e.clientX;
            const startY = e.clientY;
            const startW = box.offsetWidth;
            const startH = box.offsetHeight;

            function onMouseMove(moveEvent) {
                const newW = Math.max(200, Math.min(startW + (moveEvent.clientX - startX), player.offsetWidth * 0.8));
                const newH = Math.max(100, Math.min(startH + (moveEvent.clientY - startY), player.offsetHeight * 0.8));

                box.style.width = `${newW}px`;
                box.style.height = `${newH}px`;
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                saveChatBoxPos({
                    left: box.style.left,
                    top: box.style.top,
                    right: box.style.right,
                    width: box.style.width,
                    height: box.style.height
                });
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
}

// --------------------------------------------------------------------------
// 3. TRÍCH XUẤT VÀ HIỂN THỊ TIN NHẮN (DANMAKU / STREAMER BOX)
// --------------------------------------------------------------------------
export function extractMessageData(node) {
    if (!node || node.nodeType !== 1) return null;

    const authorEl = node.querySelector('#author-name');
    const rawAuthor = authorEl ? authorEl.textContent.trim() : '';
    const author = rawAuthor.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const isMod = !!node.querySelector('yt-live-chat-author-badge-renderer[aria-label*="Kiểm duyệt"], [type="moderator"], .moderator') || node.classList.contains('author-type-moderator');
    const isMember = !!node.querySelector('yt-live-chat-author-badge-renderer[aria-label*="Hội viên"], [type="member"], .member') || node.classList.contains('author-type-member');
    const isOwner = !!node.querySelector('yt-live-chat-author-badge-renderer[aria-label*="Chủ sở hữu"], [type="owner"], .owner') || node.classList.contains('author-type-owner');

    const avatarEl = node.querySelector('#author-photo img, yt-img-shadow#author-photo img');
    const avatarSrc = avatarEl ? (avatarEl.src || avatarEl.getAttribute('src') || '') : '';

    const badgeEls = Array.from(node.querySelectorAll('#chat-badges yt-live-chat-author-badge-renderer'));
    const badgesHtml = badgeEls.map(b => b.innerHTML).join('');

    const messageEl = node.querySelector('#message');
    let messageHtml = messageEl ? messageEl.innerHTML : '';

    // Xử lý Super Chat / Paid message
    const purchaseEl = node.querySelector('#purchase-amount');
    if (purchaseEl && purchaseEl.textContent.trim()) {
        const amount = purchaseEl.textContent.trim();
        messageHtml = `<strong>[${amount}]</strong> ${messageHtml}`;
    }

    // Xử lý thông báo hội viên
    const headerSubtext = node.querySelector('#header-subtext');
    if (headerSubtext && headerSubtext.textContent.trim()) {
        messageHtml = `<em>${headerSubtext.textContent.trim()}</em> ${messageHtml}`;
    }

    if (!messageHtml && !author) return null;

    const authorClass = isMod ? 'mod' : (isMember ? 'member' : (isOwner ? 'owner' : ''));
    const id = node.id || '';

    return {
        id,
        author: author || 'Ẩn danh',
        authorClass,
        avatarSrc,
        badgesHtml,
        messageHtml: messageHtml || '...'
    };
}

export function displayChatMessage(data) {
    if (!data || !currentConfig.chatOverlay || currentConfig.chatOverlay === 'off') return;

    if (isDuplicateMessage(data.id, data.author, data.messageHtml)) return;

    ensureChatOverlayContainers();

    // Chế độ 1: Danmaku chạy ngang
    if (currentConfig.chatOverlay === 'danmaku' && danmakuContainer) {
        const item = document.createElement('div');
        item.className = 'ytc-danmaku-item';

        currentLaneIndex = (currentLaneIndex + 1) % TOTAL_LANES;
        const topPercent = 6 + currentLaneIndex * 7.5;
        item.style.top = `${topPercent}%`;

        item.innerHTML = safeHTML(`
            <span class="ytc-chat-author ${data.authorClass || ''}">@${data.author}:</span>
            <span class="ytc-chat-text">${data.messageHtml}</span>
        `);

        danmakuContainer.appendChild(item);
        item.addEventListener('animationend', () => item.remove());

        setTimeout(() => {
            if (item.isConnected) item.remove();
        }, 10000);
    }

    // Chế độ 2: Khung nổi Streamer
    if (currentConfig.chatOverlay === 'streamer') {
        const msgContainer = streamerMessages || document.querySelector('#ytc-streamer-box .ytc-box-messages');
        if (!msgContainer) return;

        const item = document.createElement('div');
        item.className = 'ytc-box-item';

        const avatarMarkup = data.avatarSrc ? `<img class="ytc-box-avatar" src="${data.avatarSrc}" alt="">` : '';
        const badgeMarkup = data.badgesHtml ? `<span class="ytc-box-badge">${data.badgesHtml}</span>` : '';

        item.innerHTML = safeHTML(`
            ${avatarMarkup}
            <div class="ytc-box-content">
                <span class="ytc-chat-author ${data.authorClass || ''}">@${data.author}</span>${badgeMarkup}: 
                <span class="ytc-chat-text">${data.messageHtml}</span>
            </div>
        `);

        msgContainer.appendChild(item);

        while (msgContainer.children.length > 15) {
            msgContainer.firstElementChild.remove();
        }

        setTimeout(() => {
            if (item.isConnected) {
                item.style.transition = 'opacity 0.6s ease';
                item.style.opacity = '0';
                setTimeout(() => item.remove(), 600);
            }
        }, 14000);
    }
}

// --------------------------------------------------------------------------
// 4. QUAN SÁT VÀ NẠP TIN NHẮN TỪ TẤT CẢ CÁC NGUỒN (MAIN DOM & IFRAME)
// --------------------------------------------------------------------------
function ensureYouTubeLiveChatOpen() {
    const chatFrame = document.querySelector('ytd-live-chat-frame#chat, #chat.ytd-watch-flexy');
    if (chatFrame && chatFrame.hasAttribute('collapsed')) {
        const expandBtn = document.querySelector('#show-hide-button button, ytd-live-chat-frame #show-hide-button button, #chat-container #show-hide-button button, [aria-label*="Hiện cuộc trò chuyện"], [aria-label*="Show chat"], [aria-label*="Live chat"]');
        if (expandBtn) {
            try { expandBtn.click(); } catch(e) {}
        }
    }
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
    // 1. Quét trong main document
    const mainEls = getAllChatElements(document);
    if (mainEls && mainEls.length) {
        mainEls.forEach(el => msgs.push(el));
    }

    // 2. Quét trong iframe (nếu có)
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
    ensureYouTubeLiveChatOpen();

    function doFetch() {
        const allExisting = queryAllLiveChatMessages();
        if (allExisting && allExisting.length > 0) {
            const recent = allExisting.slice(-15);
            recent.forEach((node, i) => {
                const data = extractMessageData(node);
                if (data) {
                    setTimeout(() => displayChatMessage(data), i * 80);
                }
            });
            return true;
        }
        return false;
    }

    // Quét ngay lập tức
    const found = doFetch();

    // Nếu chưa có (chat đang tải hoặc bung ra), thử lại nhiều mốc thời gian
    if (!found) {
        setTimeout(doFetch, 500);
        setTimeout(doFetch, 1200);
        setTimeout(doFetch, 2500);
    }

    // Gửi postMessage tới iframe nếu có
    const frames = document.querySelectorAll('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"]');
    frames.forEach(frame => {
        if (frame.contentWindow) {
            try {
                frame.contentWindow.postMessage({ type: 'YTC_REQUEST_EXISTING_MSGS' }, '*');
            } catch (e) {}
        }
    });
}

export function updateChatOverlayVisibility() {
    const mode = currentConfig.chatOverlay || 'off';
    if (mode !== 'off') {
        ensureChatOverlayContainers();
    }
    const danmaku = document.getElementById('ytc-danmaku-container') || danmakuContainer;
    const streamer = document.getElementById('ytc-streamer-box') || streamerBox;

    if (danmaku) {
        danmaku.style.display = mode === 'danmaku' ? 'block' : 'none';
        danmaku.innerHTML = '';
    }
    if (streamer) {
        streamer.style.display = mode === 'streamer' ? 'flex' : 'none';
        const msgs = streamer.querySelector('.ytc-box-messages');
        if (msgs) msgs.innerHTML = '';

        if (mode === 'streamer') {
            showInitialBox(streamer);
        }
    }

    if (mode !== 'off') {
        // Bắt buộc mỗi lần bật là làm mới luôn!
        seenMessageIds.clear();
        requestExistingMessages();
    }
}

function setChatOverlayHidden(hidden) {
    if (danmakuContainer) {
        danmakuContainer.classList.toggle('ytc-chat-hidden', hidden);
    }
    if (streamerBox) {
        streamerBox.classList.toggle('ytc-chat-hidden', hidden);
    }
}

function checkLiveHeadStatus() {
    if (!currentConfig.chatOverlayHideOnRewind) {
        setChatOverlayHidden(false);
        return;
    }

    const player = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
    if (!player) return;

    let isLive = false;
    try {
        const d = player.getVideoData?.();
        isLive = !!(d && d.isLive);
    } catch (e) {}

    if (!isLive) {
        setChatOverlayHidden(false);
        return;
    }

    let isAtHead = true;
    try {
        const liveBadge = document.querySelector('.ytp-live-badge');
        if (liveBadge) {
            // Khi ở Live Head: nút live badge có disabled="" hoặc aria-disabled="true"
            // Khi tua lùi (quá khứ): disabled bị gỡ bỏ để người dùng có thể bấm nhảy về Trực tiếp
            isAtHead = liveBadge.hasAttribute('disabled') || liveBadge.getAttribute('aria-disabled') === 'true';
        }
    } catch (e) {}

    setChatOverlayHidden(!isAtHead);
}

// --------------------------------------------------------------------------
// 5. KHỞI CHẠY BÊN TRONG IFRAME LIVE CHAT (NẾU YOUTUBE DÙNG IFRAME)
// --------------------------------------------------------------------------
export function initIframeChatSender() {
    function handleNode(node) {
        if (node.nodeType === 1) {
            if (node.matches && node.matches('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, [class*="yt-live-chat-"]')) {
                const data = extractMessageData(node);
                if (data) {
                    window.top.postMessage({ type: 'YTC_LIVE_CHAT_MSG', payload: data }, '*');
                }
            } else if (node.querySelectorAll) {
                const subs = getAllChatElements(node);
                subs.forEach((s) => {
                    const data = extractMessageData(s);
                    if (data) {
                        window.top.postMessage({ type: 'YTC_LIVE_CHAT_MSG', payload: data }, '*');
                    }
                });
            }
        }
    }

    function sendExisting(items) {
        const existing = getAllChatElements(items);
        if (existing && existing.length) {
            const recent = Array.from(existing).slice(-10);
            recent.forEach((node) => {
                const data = extractMessageData(node);
                if (data) {
                    window.top.postMessage({ type: 'YTC_LIVE_CHAT_MSG', payload: data }, '*');
                }
            });
        }
    }

    function attach(items) {
        if (items._ytcBound) return;
        items._ytcBound = true;

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
        const items = document.querySelector('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #chat #items, div#items');
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
        obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
        setTimeout(() => obs.disconnect(), 20000);
    }

    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'YTC_REQUEST_EXISTING_MSGS') {
            const items = document.querySelector('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #chat #items, div#items') || document;
            if (items) sendExisting(items);
        }
    });
}

function processChatNode(node) {
    if (!node || node.nodeType !== 1) return;

    if (node.matches && node.matches('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, yt-live-chat-paid-sticker-renderer')) {
        const data = extractMessageData(node);
        if (data) {
            displayChatMessage(data);
        } else {
            setTimeout(() => {
                const retryData = extractMessageData(node);
                if (retryData) displayChatMessage(retryData);
            }, 60);
        }
    }

    if (node.querySelectorAll) {
        const subs = getAllChatElements(node);
        if (subs.length > 0) {
            subs.forEach(s => {
                const data = extractMessageData(s);
                if (data) displayChatMessage(data);
                else {
                    setTimeout(() => {
                        const retryData = extractMessageData(s);
                        if (retryData) displayChatMessage(retryData);
                    }, 60);
                }
            });
        }
    }
}

function observeItemsDirectly() {
    const itemsContainers = document.querySelectorAll('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items');
    itemsContainers.forEach(items => {
        if (items && !items._ytcDirectObs) {
            items._ytcDirectObs = true;
            const itemsObs = new MutationObserver((mutations) => {
                if (!currentConfig.chatOverlay || currentConfig.chatOverlay === 'off') return;
                for (const m of mutations) {
                    for (const node of m.addedNodes) {
                        processChatNode(node);
                    }
                }
            });
            itemsObs.observe(items, { childList: true });
        }
    });
}

// --------------------------------------------------------------------------
// 6. KHỞI CHẠY BỘ ĐIỀU PHỐI CHAT CHÍNH (TOP WINDOW)
// --------------------------------------------------------------------------
export function initChatOverlay() {
    if (chatOverlayInitialized) return;
    chatOverlayInitialized = true;

    // 1. Lắng nghe tin nhắn từ iframe gửi sang qua postMessage
    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'YTC_LIVE_CHAT_MSG' && e.data.payload) {
            displayChatMessage(e.data.payload);
        }
    });

    // 2. Quan sát trực tiếp mọi tin nhắn mới thêm vào DOM (bất kể nằm ở đâu)
    const chatMessageObserver = new MutationObserver((mutations) => {
        if (!currentConfig.chatOverlay || currentConfig.chatOverlay === 'off') return;

        for (const m of mutations) {
            for (const node of m.addedNodes) {
                processChatNode(node);
            }
        }
        observeItemsDirectly();
    });

    const rootTarget = document.querySelector('ytd-watch-flexy, ytd-app') || document.body || document.documentElement;
    chatMessageObserver.observe(rootTarget, { childList: true, subtree: true });

    // Gắn trực tiếp cho container chat nếu đã có sẵn
    observeItemsDirectly();

    // 3. Quét và gắn observer cho Iframe (nếu có)
    function scanIframe() {
        observeItemsDirectly();
        const frame = document.querySelector('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"]');
        if (!frame) return;

        try {
            const doc = frame.contentDocument || frame.contentWindow?.document;
            if (doc && doc.body && !doc._ytcObsBound) {
                doc._ytcObsBound = true;
                chatMessageObserver.observe(doc.body, { childList: true, subtree: true });
            }
        } catch (e) {}

        if (!frame._ytcLoadBound) {
            frame._ytcLoadBound = true;
            frame.addEventListener('load', () => {
                try {
                    const doc = frame.contentDocument || frame.contentWindow?.document;
                    if (doc && doc.body && !doc._ytcObsBound) {
                        doc._ytcObsBound = true;
                        chatMessageObserver.observe(doc.body, { childList: true, subtree: true });
                    }
                } catch (e) {}
            });
        }
    }

    scanIframe();

    if (liveCheckTimer) clearInterval(liveCheckTimer);
    liveCheckTimer = setInterval(checkLiveHeadStatus, 600);

    setInterval(() => {
        if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
            scanIframe();
        }
    }, 2500);

    if (location.pathname.startsWith('/watch') || location.pathname.startsWith('/live')) {
        whenElement('#movie_player, .html5-video-player', ensureChatOverlayContainers);
    }
}
