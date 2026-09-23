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

export function getFallbackAvatar(authorClass, author) {
    let bg = '#606060';
    const text = (author || 'U').charAt(0).toUpperCase();
    let isSvgIcon = false;
    let iconPath = '';

    if (authorClass === 'mod') {
        bg = '#1a73e8';
        isSvgIcon = true;
        iconPath = '<path fill="%23fff" d="M16 6.5l-7 3v6c0 4.8 3 9.3 7 10.8 4-1.5 7-6 7-10.8v-6l-7-3z"/>';
    } else if (authorClass === 'owner') {
        bg = '#e6a100';
        isSvgIcon = true;
        iconPath = '<path fill="%23fff" d="M5 21h22v3H5zm2.4-13.6l4.6 5.8 4-6.4 4 6.4 4.6-5.8 2.4 11.2H5z"/>';
    } else if (authorClass === 'member') {
        bg = '#1e7e34';
    }

    if (isSvgIcon && iconPath) {
        return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="${encodeURIComponent(bg)}"/>${iconPath}</svg>`;
    }

    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="${encodeURIComponent(bg)}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="central" fill="%23fff" font-family="-apple-system,BlinkMacSystemFont,Roboto,sans-serif" font-weight="bold" font-size="16">${encodeURIComponent(text)}</text></svg>`;
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

    const avatarEl = node.querySelector(
        '#author-photo img, ' +
        'yt-img-shadow#author-photo img, ' +
        '#author-photo #img, ' +
        'yt-avatar-shape img, ' +
        '[id="author-photo"] img, ' +
        'yt-img-shadow img, ' +
        'img#img'
    ) || (node.querySelector('#author-photo')?.shadowRoot?.querySelector('img'));

    let avatarSrc = '';
    if (avatarEl) {
        const rawSrc = avatarEl.currentSrc || avatarEl.src || avatarEl.getAttribute('src') || '';
        const dataSrc = avatarEl.getAttribute('data-src') || '';
        if (rawSrc.startsWith('data:image/svg+xml') || rawSrc.startsWith('data:image/gif')) {
            avatarSrc = dataSrc || '';
        } else {
            avatarSrc = rawSrc || dataSrc;
        }
    }

    let streamerBadges = [];

    // 1. Huy hiệu Người điều hành (Moderator) - Biểu tượng Cái Khiên (Shield)
    if (isMod) {
        streamerBadges.push(`<span class="ytc-box-badge ytc-badge-mod" title="Người kiểm duyệt"><svg class="ytc-mod-icon" viewBox="0 0 16 16" width="10" height="10"><path fill="#3ea6ff" d="M8 1.5L2.5 3.8v4.2c0 3.8 2.3 7.3 5.5 8.5 3.2-1.2 5.5-4.7 5.5-8.5V3.8L8 1.5z"/></svg></span>`);
    } else if (isOwner) {
        streamerBadges.push(`<span class="ytc-box-badge ytc-badge-owner" title="Chủ sở hữu"><svg class="ytc-owner-icon" viewBox="0 0 16 16" width="10" height="10"><path fill="#ffd600" d="M2.5 13h11v1.5h-11zm1.2-8.5l2.8 3.5 2.5-4 2.5 4 2.8-3.5 1.7 7h-14z"/></svg></span>`);
    }

    // 2. Huy hiệu Hội viên (Member badges)
    const badgeEls = Array.from(node.querySelectorAll('#chat-badges yt-live-chat-author-badge-renderer'));
    for (const b of badgeEls) {
        const type = (b.getAttribute('type') || '').toLowerCase();
        const aria = (b.getAttribute('aria-label') || '').toLowerCase();
        if (type === 'moderator' || aria.includes('moderator') || aria.includes('điều hành') || aria.includes('kiểm duyệt') || type === 'owner' || aria.includes('owner') || aria.includes('chủ sở hữu')) {
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
        avatarEl,
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

        const finalAvatar = data.avatarSrc || getFallbackAvatar(data.authorClass, data.author);
        const avatarMarkup = `<img class="ytc-box-avatar" src="${finalAvatar}" alt="">`;
        const badgeMarkup = data.streamerBadgeHtml ? `${data.streamerBadgeHtml} ` : '';

        setElementHTML(item, `
            ${avatarMarkup}
            <div class="ytc-box-content">
                <span class="ytc-chat-author ${data.authorClass || ''}">@${data.author}:</span> ${badgeMarkup}<span class="ytc-chat-text">${data.messageHtml}</span>
            </div>
        `);

        // Nếu lúc lấy tin avatar gốc chưa nạp xong, lắng nghe khi nó tải xong để tự động cập nhật
        if (data.avatarEl && !data.avatarSrc) {
            const onAvatarLoaded = () => {
                const newSrc = data.avatarEl.currentSrc || data.avatarEl.src || data.avatarEl.getAttribute('src');
                if (newSrc && !newSrc.startsWith('data:image/svg+xml') && !newSrc.startsWith('data:image/gif')) {
                    const img = item.querySelector('.ytc-box-avatar');
                    if (img) img.src = newSrc;
                }
            };
            data.avatarEl.addEventListener('load', onAvatarLoaded, { once: true });
        }

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
