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
// 1. LƯU TRỮ VÀ KHÔI PHỤC VỊ TRÍ KHUNG NỔI STREAMER (GẮN CHẶT THEO GÓC)
// --------------------------------------------------------------------------
function getSavedChatBoxPos() {
    try {
        const stored = localStorage.getItem(CHATBOX_POS_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
}

function saveChatBoxPos(data) {
    try {
        const existing = getSavedChatBoxPos() || {};
        localStorage.setItem(CHATBOX_POS_KEY, JSON.stringify({ ...existing, ...data }));
    } catch (e) {}
}

export function centerChatBox(box, player) {
    if (!box) return;
    const p = player || document.querySelector('#movie_player, .html5-video-player');
    const pWidth = p ? (p.offsetWidth || p.clientWidth) : window.innerWidth;
    const pHeight = p ? (p.offsetHeight || p.clientHeight) : window.innerHeight;

    const boxW = Math.min(340, Math.max(260, Math.round(pWidth * 0.32)));
    const boxH = Math.min(300, Math.max(160, Math.round(pHeight * 0.4)));

    box.style.left = '50%';
    box.style.top = '50%';
    box.style.right = 'auto';
    box.style.bottom = 'auto';
    box.style.transform = 'translate(-50%, -50%)';
    box.style.width = `${boxW}px`;
    box.style.height = `${boxH}px`;

    saveChatBoxPos({
        isCentered: true,
        anchorX: 'left',
        anchorY: 'bottom',
        offsetX: 10,
        offsetY: 40,
        width: box.style.width,
        height: box.style.height
    });
}

export function applyChatBoxPos(box, player) {
    if (!box) return;
    const p = player || document.querySelector('#movie_player, .html5-video-player');
    if (!p) return;

    const pos = getSavedChatBoxPos();
    if (!pos) {
        centerChatBox(box, p);
        return;
    }

    if (pos.isCentered) {
        box.style.left = '50%';
        box.style.top = '50%';
        box.style.right = 'auto';
        box.style.bottom = 'auto';
        box.style.transform = 'translate(-50%, -50%)';
        if (pos.width) box.style.width = pos.width;
        if (pos.height) box.style.height = pos.height;
        return;
    }

    box.style.transform = 'none';
    if (pos.width) box.style.width = pos.width;
    if (pos.height) box.style.height = pos.height;

    const pW = p.offsetWidth || p.clientWidth || window.innerWidth;
    const pH = p.offsetHeight || p.clientHeight || window.innerHeight;
    const bW = box.offsetWidth || 300;
    const bH = box.offsetHeight || 200;

    // Định vị trực tiếp theo cạnh neo (Góc nào neo góc đó: left/right và bottom/top)
    // Giúp khi phóng to hoặc thu nhỏ, khung chat luôn bám chặt đúng góc đó!
    if (pos.anchorX === 'right') {
        const rightVal = Math.min(pos.offsetX || 0, Math.max(0, pW - bW));
        box.style.right = `${rightVal}px`;
        box.style.left = 'auto';
    } else {
        const leftVal = Math.min(pos.offsetX || 0, Math.max(0, pW - bW));
        box.style.left = `${leftVal}px`;
        box.style.right = 'auto';
    }

    if (pos.anchorY === 'top') {
        const topVal = Math.min(pos.offsetY || 0, Math.max(0, pH - bH));
        box.style.top = `${topVal}px`;
        box.style.bottom = 'auto';
    } else {
        const bottomVal = Math.min(pos.offsetY || 0, Math.max(0, pH - bH));
        box.style.bottom = `${bottomVal}px`;
        box.style.top = 'auto';
    }
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

        applyChatBoxPos(streamerBox, player);

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
                box.style.bottom = 'auto';
                box.style.transform = 'none';
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                const currentPRect = player.getBoundingClientRect();
                const currentBRect = box.getBoundingClientRect();

                const distLeft = Math.max(0, currentBRect.left - currentPRect.left);
                const distRight = Math.max(0, currentPRect.right - currentBRect.right);
                const distTop = Math.max(0, currentBRect.top - currentPRect.top);
                const distBottom = Math.max(0, currentPRect.bottom - currentBRect.bottom);

                const anchorX = distLeft <= distRight ? 'left' : 'right';
                const anchorY = distTop <= distBottom ? 'top' : 'bottom';

                const offsetX = anchorX === 'left' ? distLeft : distRight;
                const offsetY = anchorY === 'top' ? distTop : distBottom;

                if (anchorX === 'left') {
                    box.style.left = `${Math.round(offsetX)}px`;
                    box.style.right = 'auto';
                } else {
                    box.style.right = `${Math.round(offsetX)}px`;
                    box.style.left = 'auto';
                }

                if (anchorY === 'top') {
                    box.style.top = `${Math.round(offsetY)}px`;
                    box.style.bottom = 'auto';
                } else {
                    box.style.bottom = `${Math.round(offsetY)}px`;
                    box.style.top = 'auto';
                }

                saveChatBoxPos({
                    isCentered: false,
                    anchorX,
                    anchorY,
                    offsetX: Math.round(offsetX),
                    offsetY: Math.round(offsetY),
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
                    width: box.style.width,
                    height: box.style.height
                });
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // Tự động căn chỉnh lại vị trí theo cạnh neo khi thay đổi kích thước cửa sổ hoặc toàn màn hình
    window.addEventListener('resize', () => {
        const p = document.querySelector('#movie_player, .html5-video-player');
        if (box && p) applyChatBoxPos(box, p);
        syncPlayerFullscreenSize();
    });
    document.addEventListener('fullscreenchange', () => {
        const p = document.querySelector('#movie_player, .html5-video-player');
        if (box && p) {
            applyChatBoxPos(box, p);
            setTimeout(() => applyChatBoxPos(box, p), 100);
            setTimeout(() => applyChatBoxPos(box, p), 300);
        }
        syncPlayerFullscreenSize();
        setTimeout(syncPlayerFullscreenSize, 50);
        setTimeout(syncPlayerFullscreenSize, 150);
        setTimeout(syncPlayerFullscreenSize, 300);
        setTimeout(syncPlayerFullscreenSize, 600);
    });

    if (window.ResizeObserver && player) {
        const ro = new ResizeObserver(() => {
            applyChatBoxPos(box, player);
        });
        ro.observe(player);
    }
}

// --------------------------------------------------------------------------
// 3. ĐIỀU PHỐI VÀ QUẢN LÝ LÀN CHẠY DANMAKU (TRÁNH CHỒNG ĐÈ, BẮT BUỘC THƯA THỚT)
// --------------------------------------------------------------------------
const TOTAL_LANES = 10;
const laneNextAvailableTime = new Array(TOTAL_LANES).fill(0);
const danmakuQueue = [];
let danmakuSchedulerTimer = null;
let lastDanmakuSpawnTime = 0;
let lastSpawnedLane = -1;
const MIN_GLOBAL_INTERVAL = 420; // Khoảng cách tối thiểu giữa 2 tin bất kỳ (ms) để luôn THƯA THỚT, không bị dồn cục

function getAvailableLane(now) {
    const freeLanes = [];
    for (let i = 0; i < TOTAL_LANES; i++) {
        if (laneNextAvailableTime[i] <= now) {
            freeLanes.push(i);
        }
    }

    if (freeLanes.length === 0) return -1;

    // Ưu tiên chọn làn khác với làn vừa bắn để trải đều, không bắn liên tiếp cùng làn
    const differentLanes = freeLanes.filter(l => l !== lastSpawnedLane);
    const candidates = differentLanes.length > 0 ? differentLanes : freeLanes;

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
}

function spawnDanmakuItem(data, laneIndex) {
    if (!danmakuContainer || !data || !data.messageHtml) return;

    const item = document.createElement('div');
    item.className = 'ytc-danmaku-item';

    // 10 làn dãn cách rộng rãi từ 6% đến 82% chiều cao video (mỗi làn cách nhau 8.2%), đảm bảo THƯA và không bao giờ bị đè dọc
    const topPercent = 6 + laneIndex * 8.2;
    item.style.top = `${topPercent}%`;

    // Chế độ chat chạy ngang: Không cần @ tên nữa, vào thẳng nội dung!
    item.innerHTML = safeHTML(`
        <span class="ytc-chat-text ${data.authorClass || ''}">${data.messageHtml}</span>
    `);

    danmakuContainer.appendChild(item);

    // Tính toán thời gian bận của làn để cmt sau trên cùng làn KHÔNG BAO GIỜ chạm đuôi cmt trước
    const plainText = (data.messageHtml || '').replace(/<[^>]*>/g, '');
    const textLen = plainText.length || 8;
    // Dãn cách an toàn trên cùng 1 làn: tối thiểu 3200ms
    const busyDuration = Math.min(5500, Math.max(3200, textLen * 110 + 2000));
    laneNextAvailableTime[laneIndex] = Date.now() + busyDuration;

    item.addEventListener('animationend', () => item.remove());
    setTimeout(() => {
        if (item.isConnected) item.remove();
    }, 12000);
}

function processDanmakuQueue() {
    if (document.hidden) return; // Không bắn animation khi tab đang ở nền để tránh dồn cục
    if (danmakuQueue.length === 0) return;

    const now = Date.now();
    // BẮT BUỘC THƯA: Giữ khoảng cách tối thiểu giữa 2 lần xuất hiện bất kỳ
    if (now - lastDanmakuSpawnTime < MIN_GLOBAL_INTERVAL) {
        return;
    }

    const lane = getAvailableLane(now);
    if (lane !== -1) {
        const nextData = danmakuQueue.shift();
        lastDanmakuSpawnTime = now;
        lastSpawnedLane = lane;
        spawnDanmakuItem(nextData, lane);
    }

    // Kiểm soát quá tải (khi livestream đông người chat như 100-200 cmt/phút):
    // Giữ tối đa 12 cmt trong hàng đợi, tự động lọc bớt các cmt thường cũ
    // để cmt luôn mới nhất theo thời gian thực mà không bao giờ bị nghẽn hay dồn ứ
    if (danmakuQueue.length > 12) {
        while (danmakuQueue.length > 8) {
            // Ưu tiên giữ lại Super Chat hoặc tin nhắn hội viên, lọc bớt cmt thường
            const idx = danmakuQueue.findIndex(d => !d.authorClass && !d.messageHtml.includes('purchase-amount'));
            if (idx !== -1) {
                danmakuQueue.splice(idx, 1);
            } else {
                danmakuQueue.shift();
            }
        }
    }
}

function startDanmakuScheduler() {
    if (!danmakuSchedulerTimer) {
        // Chạy kiểm tra mỗi 50ms để bắt nhịp ngay khi hết cooldown MIN_GLOBAL_INTERVAL
        danmakuSchedulerTimer = setInterval(processDanmakuQueue, 50);
    }
}

function stopDanmakuScheduler() {
    if (danmakuSchedulerTimer) {
        clearInterval(danmakuSchedulerTimer);
        danmakuSchedulerTimer = null;
    }
    danmakuQueue.length = 0;
    laneNextAvailableTime.fill(0);
    lastDanmakuSpawnTime = 0;
    lastSpawnedLane = -1;
}

// --------------------------------------------------------------------------
// 4. TRÍCH XUẤT VÀ HIỂN THỊ TIN NHẮN (DANMAKU / STREAMER BOX)
// --------------------------------------------------------------------------
export function extractMessageData(node) {
    if (!node || node.nodeType !== 1) return null;

    const authorEl = node.querySelector('#author-name');
    const rawAuthor = authorEl ? authorEl.textContent.trim() : '';
    let author = rawAuthor.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (author.startsWith('@')) {
        author = author.substring(1);
    }

    const isMod = !!node.querySelector('yt-live-chat-author-badge-renderer[type="moderator"], yt-live-chat-author-badge-renderer[aria-label*="điều hành" i], yt-live-chat-author-badge-renderer[aria-label*="kiểm duyệt" i], yt-live-chat-author-badge-renderer[aria-label*="moderator" i], [type="moderator"], .moderator') || node.classList.contains('author-type-moderator');
    const isMember = !!node.querySelector('yt-live-chat-author-badge-renderer[type="member"], yt-live-chat-author-badge-renderer[aria-label*="hội viên" i], yt-live-chat-author-badge-renderer[aria-label*="member" i], [type="member"], .member') || node.classList.contains('author-type-member');
    const isOwner = !!node.querySelector('yt-live-chat-author-badge-renderer[type="owner"], yt-live-chat-author-badge-renderer[aria-label*="chủ sở hữu" i], yt-live-chat-author-badge-renderer[aria-label*="owner" i], [type="owner"], .owner') || node.classList.contains('author-type-owner');

    const avatarEl = node.querySelector('#author-photo img, yt-img-shadow#author-photo img');
    const avatarSrc = avatarEl ? (avatarEl.src || avatarEl.getAttribute('src') || '') : '';

    // Trích xuất huy hiệu chuyên biệt cho khung nổi Streamer (chỉ thêm bên nổi, không thêm bên ngang)
    let streamerBadges = [];
    if (isMod) {
        streamerBadges.push(`<span class="ytc-box-badge ytc-badge-mod" title="Người điều hành"><svg viewBox="0 0 16 16" class="ytc-mod-icon"><path d="M12.44 3.56a4.5 4.5 0 0 0-6.17.22l2.39 2.39-.71.71-2.39-2.39a4.5 4.5 0 0 0-.22 6.17L1.1 14.9a.5.5 0 0 0 0 .71.5.5 0 0 0 .71 0l4.24-4.24a4.5 4.5 0 0 0 6.17-.22 4.5 4.5 0 0 0 .22-6.17z"/></svg></span>`);
    }

    const badgeEls = Array.from(node.querySelectorAll('#chat-badges yt-live-chat-author-badge-renderer'));
    for (const b of badgeEls) {
        const type = (b.getAttribute('type') || '').toLowerCase();
        const aria = (b.getAttribute('aria-label') || '').toLowerCase();
        if (type === 'moderator' || aria.includes('moderator') || aria.includes('điều hành') || aria.includes('kiểm duyệt')) {
            continue; // Đã thêm mod icon chuẩn bằng SVG ở trên
        }
        const img = b.querySelector('img');
        if (img && img.src) {
            streamerBadges.push(`<span class="ytc-box-badge ytc-badge-member" title="${aria || 'Hội viên'}"><img src="${img.src}" alt=""></span>`);
        }
    }
    const streamerBadgeHtml = streamerBadges.join('');

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
        streamerBadgeHtml,
        messageHtml: messageHtml || '...'
    };
}

export function displayChatMessage(data, isBacklog = false) {
    if (!data || !currentConfig.chatOverlay || currentConfig.chatOverlay === 'off') return;

    const msgIsBacklog = isBacklog || data.isBacklog || false;

    // Chặn tin nhắn mới (thời gian thực) khi phiên live ĐANG diễn ra nhưng người dùng
    // KHÔNG ở mốc trực tiếp (dừng video, tua lại xem đoạn cũ, hoặc lag quá xa)
    // Phiên live ĐÃ kết thúc (replay) thì không ảnh hưởng — chat replay luôn chạy bình thường.
    if (!msgIsBacklog) {
        const player = document.querySelector('#movie_player, .html5-video-player');
        if (player) {
            let isOngoingLive = false;
            try {
                if (typeof player.getVideoData === 'function') {
                    const vd = player.getVideoData();
                    if (vd && vd.isLive === true) isOngoingLive = true;
                }
            } catch (e) {}

            if (isOngoingLive) {
                const video = player.querySelector('video');
                if (video) {
                    // Video đang paused → không hiển thị chat mới
                    if (video.paused) return;

                    // Người dùng đang tua lại quá khứ (cách live edge > 5s) → không hiển thị
                    try {
                        if (video.seekable && video.seekable.length > 0) {
                            const liveEdge = video.seekable.end(video.seekable.length - 1);
                            if (isFinite(liveEdge) && isFinite(video.currentTime)) {
                                const delay = liveEdge - video.currentTime;
                                if (delay > 5) return;
                            }
                        }
                    } catch (e) {}
                }
            }
        }
    }

    if (isDuplicateMessage(data.id, data.author, data.messageHtml)) return;

    ensureChatOverlayContainers();

    const showDanmaku = currentConfig.chatOverlay === 'danmaku';
    const showStreamer = currentConfig.chatOverlay === 'streamer';

    // Chế độ 1: Danmaku chạy ngang (Đưa vào hàng đợi điều phối thông minh)
    // BẮT BUỘC: Tin nhắn cũ (backlog lúc mới bật/kết nối iframe) KHÔNG BAO GIỜ bắn vào Danmaku!
    // Tránh hoàn toàn việc vừa bật lên là bị dồn cục cả đống chữ đè lên nhau.
    if (showDanmaku && !msgIsBacklog && danmakuContainer) {
        danmakuQueue.push(data);
        startDanmakuScheduler();
    }

    // Chế độ 2: Khung nổi Streamer
    if (showStreamer) {
        const msgContainer = streamerMessages || document.querySelector('#ytc-streamer-box .ytc-box-messages');
        if (!msgContainer) return;

        // Nếu là backlog mà trong khung đã có >= 8 tin thì không nhồi thêm
        if (msgIsBacklog && msgContainer.children.length >= 8) return;

        // Xóa thông báo loading nếu có
        const loading = msgContainer.querySelector('.ytc-box-loading');
        if (loading) loading.remove();

        const item = document.createElement('div');
        item.className = 'ytc-box-item';

        const avatarMarkup = data.avatarSrc ? `<img class="ytc-box-avatar" src="${data.avatarSrc}" alt="">` : '';
        const badgeMarkup = data.streamerBadgeHtml ? `${data.streamerBadgeHtml} ` : '';

        item.innerHTML = safeHTML(`
            ${avatarMarkup}
            <div class="ytc-box-content">
                <span class="ytc-chat-author ${data.authorClass || ''}">@${data.author}:</span> ${badgeMarkup}<span class="ytc-chat-text">${data.messageHtml}</span>
            </div>
        `);

        msgContainer.appendChild(item);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        while (msgContainer.children.length > 60) {
            msgContainer.firstElementChild.remove();
        }

        setTimeout(() => {
            if (item.isConnected) {
                item.style.transition = 'opacity 0.6s ease';
                item.style.opacity = '0';
                setTimeout(() => item.remove(), 600);
            }
        }, 45000);
    }
}

// --------------------------------------------------------------------------
// 4. QUAN SÁT VÀ NẠP TIN NHẮN TỪ TẤT CẢ CÁC NGUỒN (MAIN DOM & IFRAME)
// --------------------------------------------------------------------------
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
        if (video && video.dataset.ytcOverridden) {
            delete video.dataset.ytcOverridden;
            video.style.width = '';
            video.style.height = '';
            video.style.left = '';
            video.style.top = '';
        }
        return;
    }

    // Đang trong Fullscreen: Kích hoạt YouTube player tính toán lại kích thước chuẩn 100vw
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
            // Nếu kích thước hiện tại của video YouTube đang bị co cụm (ví dụ nhỏ hơn targetW)
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

let chatToggleListenersBound = false;
export function setupChatToggleListeners() {
    if (chatToggleListenersBound) return;
    chatToggleListenersBound = true;

    document.addEventListener('click', (e) => {
        // 1. Người dùng bấm "Hiện cuộc trò chuyện" / "Mở bảng điều khiển" / "Show chat"
        const showBtn = e.target.closest('#show-hide-button button, [aria-label*="Hiện cuộc trò chuyện" i], [aria-label*="Show chat" i], button#show-button, #show-button');
        if (showBtn) {
            setNativeChatHiddenState(false);
            return;
        }

        // 2. Người dùng bấm "Ẩn cuộc trò chuyện" / "Hide chat"
        const hideBtn = e.target.closest('ytd-live-chat-frame #show-hide-button button, ytd-live-chat-frame #close-button, [aria-label*="Ẩn cuộc trò chuyện" i], [aria-label*="Hide chat" i]');
        if (hideBtn) {
            if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
                setNativeChatHiddenState(true);
            }
        }
    }, true);
}

export function ensureNativeLiveChatRunning() {
    if (!currentConfig.chatOverlay || currentConfig.chatOverlay === 'off') {
        setNativeChatHiddenState(false);
        return;
    }

    const chatFrame = document.querySelector('ytd-live-chat-frame#chat, #chat.ytd-watch-flexy');
    const watchFlexy = document.querySelector('ytd-watch-flexy');

    if (!chatFrame) return;

    const isCollapsed = chatFrame.hasAttribute('collapsed') || (watchFlexy && watchFlexy.hasAttribute('chat-collapsed'));

    if (isCollapsed) {
        // Nếu ban đầu bị tắt (mặc định hoặc người dùng ẩn): đánh dấu ẩn bằng script và uncollapse ngầm để nạp data
        setNativeChatHiddenState(true);
        const expandBtn = chatFrame.querySelector('#show-hide-button button, [aria-label*="Hiện cuộc trò chuyện" i], [aria-label*="Show chat" i], button#show-button');
        if (expandBtn) {
            try { expandBtn.click(); } catch(e) {}
        }
    } else {
        // Nếu YouTube đang mở sẵn (chưa bị ẩn): không ẩn, để người dùng chat và fullscreen tự nhiên
        if (!isNativeChatHiddenByScript) {
            setNativeChatHiddenState(false);
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
    // Nếu chỉ bật Danmaku thì KHÔNG nạp tin nhắn cũ để tránh dồn cục lúc đầu bật!
    if (currentConfig.chatOverlay !== 'streamer') {
        return;
    }

    function doFetch() {
        const allExisting = queryAllLiveChatMessages();
        if (allExisting && allExisting.length > 0) {
            // Nạp 8 tin gần nhất cho khung nổi để khung không bị trống
            const recent = allExisting.slice(-8);
            recent.forEach((node, i) => {
                const data = extractMessageData(node);
                if (data) {
                    data.isBacklog = true;
                    setTimeout(() => displayChatMessage(data, true), i * 100);
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
        setTimeout(doFetch, 800);
        setTimeout(doFetch, 2000);
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

// --------------------------------------------------------------------------
// 4. CHẠY NGẦM LIVE CHAT QUA IFRAME CHUYÊN BIỆT (TUY TẮT GỐC VẪN CHẠY)
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
        lastDanmakuSpawnTime = Date.now() + 400; // Đệm thời gian để cmt đầu tiên xuất hiện tự nhiên
        lastSpawnedLane = -1;
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

// Lắng nghe sự kiện chuyển tab trình duyệt để khôi phục ngay lập tức khi quay lại
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

// --------------------------------------------------------------------------
// 5. KHỞI CHẠY BÊN TRONG IFRAME LIVE CHAT (NẾU YOUTUBE DÙNG IFRAME HOẶC BG IFRAME)
// --------------------------------------------------------------------------
export function initIframeChatSender() {
    function handleNode(node) {
        if (node && node.nodeType === 1) {
            if (node.matches && node.matches('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, yt-live-chat-paid-sticker-renderer')) {
                const data = extractMessageData(node);
                if (data) {
                    try { window.top.postMessage({ type: 'YTC_LIVE_CHAT_MSG', payload: data }, '*'); } catch (e) {}
                }
            }
        }
    }

    function sendExisting(items) {
        const existing = getAllChatElements(items);
        if (existing && existing.length) {
            // Đánh dấu isBacklog: true để Danmaku bỏ qua hoàn toàn, gửi tối đa 8 tin cho khung nổi nếu cần
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
        if (!items || items._ytcBound) return;
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
        obs.observe(document.body || document.documentElement, { childList: true });
        setTimeout(() => obs.disconnect(), 20000);
    }

    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'YTC_REQUEST_EXISTING_MSGS') {
            const items = document.querySelector('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items, #chat #items, div#items') || document;
            if (items) sendExisting(items);
        }
    });

function isUserInteractingWithChatMenu(doc) {
    const root = doc || document;
    // Kiểm tra xem có popup/dropdown nào đang mở không (như menu chọn Tin nhắn hàng đầu / Trực tiếp [Ảnh 2] hoặc menu 3 chấm [Ảnh 3])
    const popups = root.querySelectorAll('tp-yt-iron-dropdown, iron-dropdown, ytd-menu-popup-renderer, tp-yt-paper-listbox');
    for (const popup of popups) {
        if (popup.offsetParent !== null && !popup.hasAttribute('aria-hidden') && popup.style.display !== 'none') {
            return true;
        }
    }
    return false;
}

    // Chống đứng chat YouTube (Auto unpause & Auto scroll bottom)
    setInterval(() => {
        try {
            // NẾU NGƯỜI DÙNG ĐANG MỞ MENU/TAB DROPDOWN (Ảnh 2 & 3): TUYỆT ĐỐI KHÔNG CLICK HOẶC SCROLL!
            // Tránh hoàn toàn việc vừa mở menu lên 1s lại bị tự động đóng mất menu!
            if (isUserInteractingWithChatMenu(document)) {
                return;
            }

            // 1. Chỉ click nút "Tin nhắn mới" / "Cuộc trò chuyện bị tạm dừng" KHI NÓ ĐANG THỰC SỰ HIỆN DIỆN (visible)
            const showMoreBtn = document.querySelector('#show-more:not([hidden]) button, #show-more button');
            if (showMoreBtn && showMoreBtn.offsetParent !== null) {
                const rect = showMoreBtn.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    showMoreBtn.click();
                }
            }
            // 2. Chỉ cuộn xuống nếu đang bị chậm và người dùng không di chuột trong vùng chat
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

function processChatNode(node) {
    if (!node || node.nodeType !== 1) return;

    if (node.matches && node.matches('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-membership-item-renderer, yt-live-chat-paid-sticker-renderer')) {
        const data = extractMessageData(node);
        if (data) displayChatMessage(data);
    }
}

function observeItemsElement(items) {
    if (!items || items._ytcBound) return;
    items._ytcBound = true;

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
    // 1. Quét trong main document
    const mainItems = document.querySelectorAll('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items');
    mainItems.forEach(items => observeItemsElement(items));

    // 2. Quét trong iframe (nếu cùng origin và truy cập được)
    const frames = document.querySelectorAll('iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"]');
    frames.forEach(frame => {
        try {
            const doc = frame.contentDocument || frame.contentWindow?.document;
            if (doc) {
                const iframeItems = doc.querySelectorAll('yt-live-chat-item-list-renderer #items, #items.yt-live-chat-item-list-renderer, #item-scroller #items');
                iframeItems.forEach(items => observeItemsElement(items));
            }
        } catch (e) {}
    });
}

// --------------------------------------------------------------------------
// 6. KHỞI CHẠY BỘ ĐIỀU PHỐI CHAT CHÍNH (TOP WINDOW)
// --------------------------------------------------------------------------
export function initChatOverlay() {
    if (chatOverlayInitialized) return;
    chatOverlayInitialized = true;

    setupChatToggleListeners();
    document.addEventListener('fullscreenchange', () => {
        syncPlayerFullscreenSize();
        setTimeout(syncPlayerFullscreenSize, 50);
        setTimeout(syncPlayerFullscreenSize, 150);
        setTimeout(syncPlayerFullscreenSize, 300);
        setTimeout(syncPlayerFullscreenSize, 600);
    });
    window.addEventListener('resize', () => {
        syncPlayerFullscreenSize();
    });

    // 1. Lắng nghe tin nhắn từ iframe gửi sang qua postMessage
    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'YTC_LIVE_CHAT_MSG' && e.data.payload) {
            const isBacklog = !!e.data.isBacklog || !!e.data.payload.isBacklog;
            displayChatMessage(e.data.payload, isBacklog);
        }
    });

    // 2. Gắn observer nhẹ nhàng chỉ trên vùng chat items (tiết kiệm 99% RAM & CPU)
    findAndObserveItems();

    setInterval(() => {
        if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
            findAndObserveItems();
            ensureNativeLiveChatRunning();
            ensureBackgroundLiveChat();
            // Chống đứng chat YouTube trong Main DOM nếu có
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
            ensureChatOverlayContainers();
            ensureBackgroundLiveChat();
            if (currentConfig.chatOverlay && currentConfig.chatOverlay !== 'off') {
                ensureNativeLiveChatRunning();
            }
        });
    }
}

