// ==========================================================================
// BÓC TÁCH & ĐIỀU PHỐI TIN NHẮN LIVE CHAT (PARSER & FILTER)
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { safeHTML, setElementHTML } from '../core/utils.js';
import { isDuplicateMessage, ensureChatOverlayContainers, danmakuContainer, streamerMessages } from './chatState.js';
import { danmakuQueue, startDanmakuScheduler } from './danmaku.js';

const UNICODE_EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{200D}\u{FE0F}]/gu;

export function filterEmojisFromMessage(messageEl) {
    if (!messageEl) return { html: '', text: '', isEmpty: true };

    const clone = messageEl.cloneNode(true);
    const images = clone.querySelectorAll('img');
    images.forEach(img => img.remove());

    let cleanedHtml = clone.innerHTML;
    let textOnly = clone.textContent || '';

    cleanedHtml = cleanedHtml.replace(UNICODE_EMOJI_REGEX, '').trim();
    textOnly = textOnly.replace(UNICODE_EMOJI_REGEX, '').trim();

    cleanedHtml = cleanedHtml.replace(/\s{2,}/g, ' ');
    textOnly = textOnly.replace(/\s{2,}/g, ' ');

    return {
        html: cleanedHtml,
        text: textOnly,
        isEmpty: textOnly.length === 0
    };
}

export function extractMessageData(node) {
    if (!node || node.nodeType !== 1) return null;

    if (currentConfig.hideChatEmojis && node.tagName && node.tagName.toLowerCase().includes('sticker')) {
        return null; // Ẩn hoàn toàn nhãn dán sticker chỉ có hình ảnh
    }

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

    let streamerBadges = [];

    const badgeEls = Array.from(node.querySelectorAll('#chat-badges yt-live-chat-author-badge-renderer'));
    for (const b of badgeEls) {
        const type = (b.getAttribute('type') || '').toLowerCase();
        const aria = (b.getAttribute('aria-label') || '').toLowerCase();
        if (type === 'moderator' || aria.includes('moderator') || aria.includes('điều hành') || aria.includes('kiểm duyệt')) {
            continue;
        }
        const img = b.querySelector('img');
        if (img && img.src) {
            streamerBadges.push(`<span class="ytc-box-badge ytc-badge-member" title="${aria || 'Hội viên'}"><img src="${img.src}" alt=""></span>`);
        }
    }
    const streamerBadgeHtml = streamerBadges.join('');

    const messageEl = node.querySelector('#message');
    let messageHtml = messageEl ? messageEl.innerHTML : '';

    const purchaseEl = node.querySelector('#purchase-amount');
    const headerSubtext = node.querySelector('#header-subtext');
    const isPaid = !!((purchaseEl && purchaseEl.textContent.trim()) || (headerSubtext && headerSubtext.textContent.trim()));

    if (currentConfig.hideChatEmojis && messageEl) {
        const filtered = filterEmojisFromMessage(messageEl);
        if (filtered.isEmpty && !isPaid) {
            // Bình luận thường độc icon -> ẩn hẳn không hiện!
            return null;
        }
        messageHtml = filtered.html;
    }
    if (purchaseEl && purchaseEl.textContent.trim()) {
        const amount = purchaseEl.textContent.trim();
        messageHtml = `<strong>[${amount}]</strong> ${messageHtml}`;
    }

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

    // Khi video đang tạm dừng: không nạp tin nhắn mới
    const player = document.querySelector('#movie_player:not(#inline-preview-player)');
    const video = player ? player.querySelector('video') : null;
    if (video && video.paused) return;

    const msgIsBacklog = isBacklog || data.isBacklog || false;

    if (isDuplicateMessage(data.id, data.author, data.messageHtml)) return;

    ensureChatOverlayContainers();

    const showDanmaku = currentConfig.chatOverlay === 'danmaku';
    const showStreamer = currentConfig.chatOverlay === 'streamer';

    // 1. Danmaku chạy ngang (Đưa vào hàng đợi điều phối thông minh)
    const dContainer = danmakuContainer || document.getElementById('ytc-danmaku-container');
    if (showDanmaku && dContainer) {
        // Nếu là backlog / quét tin cũ lúc mới mở: tối đa 4 tin để chống đè và dính chùm
        if (msgIsBacklog && danmakuQueue.length >= 4) return;

        // Giới hạn hàng đợi Danmaku không bao giờ vượt quá 6 tin
        if (danmakuQueue.length >= 6) {
            const idx = danmakuQueue.findIndex(d => !d.authorClass && !d.messageHtml.includes('purchase-amount'));
            if (idx !== -1) {
                danmakuQueue.splice(idx, 1);
            } else {
                danmakuQueue.shift();
            }
        }

        danmakuQueue.push(data);
        startDanmakuScheduler();
    }

    // 2. Khung nổi Streamer
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

        setElementHTML(item, `
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
