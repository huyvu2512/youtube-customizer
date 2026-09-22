// ==========================================================================
// BÓC TÁCH & ĐIỀU PHỐI TIN NHẮN LIVE CHAT (PARSER & FILTER)
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { safeHTML } from '../core/utils.js';
import { isDuplicateMessage, ensureChatOverlayContainers, danmakuContainer, streamerMessages } from './chatState.js';
import { danmakuQueue, startDanmakuScheduler } from './danmaku.js';

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

    let streamerBadges = [];
    if (isMod) {
        streamerBadges.push(`<span class="ytc-box-badge ytc-badge-mod" title="Người điều hành"><svg viewBox="0 0 16 16" class="ytc-mod-icon"><path d="M12.44 3.56a4.5 4.5 0 0 0-6.17.22l2.39 2.39-.71.71-2.39-2.39a4.5 4.5 0 0 0-.22 6.17L1.1 14.9a.5.5 0 0 0 0 .71.5.5 0 0 0 .71 0l4.24-4.24a4.5 4.5 0 0 0 6.17-.22 4.5 4.5 0 0 0 .22-6.17z"/></svg></span>`);
    }

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
    if (purchaseEl && purchaseEl.textContent.trim()) {
        const amount = purchaseEl.textContent.trim();
        messageHtml = `<strong>[${amount}]</strong> ${messageHtml}`;
    }

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

    // Khi video đang tạm dừng: không nạp tin nhắn mới
    const player = document.querySelector('#movie_player, .html5-video-player');
    const video = player ? player.querySelector('video') : null;
    if (video && video.paused) return;

    const msgIsBacklog = isBacklog || data.isBacklog || false;

    if (isDuplicateMessage(data.id, data.author, data.messageHtml)) return;

    ensureChatOverlayContainers();

    const showDanmaku = currentConfig.chatOverlay === 'danmaku';
    const showStreamer = currentConfig.chatOverlay === 'streamer';

    // 1. Danmaku chạy ngang (Đưa vào hàng đợi điều phối thông minh)
    const dContainer = danmakuContainer || document.getElementById('ytc-danmaku-container');
    if (showDanmaku && !msgIsBacklog && dContainer) {
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
