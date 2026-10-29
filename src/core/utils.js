// ==========================================================================
// CORE UTILITIES (DOM, TRUSTED TYPES, TIMING)
// ==========================================================================

let ytcPolicy = null;
if (typeof window !== 'undefined' && window.trustedTypes) {
    if (!window.trustedTypes.defaultPolicy) {
        try {
            ytcPolicy = window.trustedTypes.createPolicy('default', {
                createHTML: (html) => html,
                createScript: (script) => script,
                createScriptURL: (url) => url,
            });
        } catch (e) {}
    }
    if (!ytcPolicy) {
        try {
            ytcPolicy = window.trustedTypes.createPolicy('youtubeCustomizer', {
                createHTML: (html) => html,
            });
        } catch (e) {
            try {
                ytcPolicy = window.trustedTypes.defaultPolicy;
            } catch (err) {}
        }
    }
}

export function safeHTML(html) {
    if (!html) return '';
    try {
        if (ytcPolicy) return ytcPolicy.createHTML(html);
        if (window.trustedTypes?.defaultPolicy) return window.trustedTypes.defaultPolicy.createHTML(html);
        return html;
    } catch (e) {
        return html;
    }
}

/**
 * Gán nội dung HTML an toàn 100% không bao giờ bị chặn bởi Content Security Policy (Trusted Types).
 * Sử dụng DOMParser + replaceChildren nếu Trusted Types không khả dụng (hoàn toàn miễn nhiễm CSP sink check).
 */
export function setElementHTML(element, htmlString) {
    if (!element) return;
    const str = htmlString != null ? String(htmlString) : '';

    // Cách 1: Thử gán bằng TrustedHTML nếu có policy
    try {
        if (ytcPolicy) {
            element.innerHTML = ytcPolicy.createHTML(str);
            return;
        }
        if (window.trustedTypes?.defaultPolicy) {
            element.innerHTML = window.trustedTypes.defaultPolicy.createHTML(str);
            return;
        }
    } catch (e) {}

    // Cách 2: Phân tích cú pháp qua DOMParser và gắn node (KHÔNG kích hoạt sink Trusted Types)
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(str, 'text/html');
        element.replaceChildren(...doc.body.childNodes);
        return;
    } catch (e) {}

    // Cách 3: Fallback gán chuỗi trực tiếp
    try {
        element.innerHTML = str;
    } catch (e) {}
}

export function rafThrottle(fn) {
    let scheduled = 0;
    return function(...args) {
        if (scheduled) return;
        scheduled = requestAnimationFrame(() => {
            scheduled = 0;
            fn.apply(this, args);
        });
    };
}

export function whenElement(selector, callback, timeout = 5000) {
    const found = document.querySelector(selector);
    if (found) {
        callback(found);
        return;
    }
    let timer = null;
    const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
            clearTimeout(timer);
            observer.disconnect();
            callback(el);
        }
    });
    const root = document.querySelector('ytd-app') || document.documentElement || document;
    observer.observe(root, { childList: true, subtree: true });
    if (timeout > 0) {
        timer = setTimeout(() => observer.disconnect(), timeout);
    }
}

function getPageLiveChatRenderer(data = window.ytInitialData) {
    const watchNext = data?.contents?.twoColumnWatchNextResults ||
        data?.response?.contents?.twoColumnWatchNextResults ||
        data?.contents?.singleColumnWatchNextResults ||
        data?.response?.contents?.singleColumnWatchNextResults;
    const conversationBar = watchNext?.conversationBar;
    return conversationBar?.liveChatRenderer || conversationBar?.conversationBarRenderer?.liveChatRenderer || null;
}

function getMenuTitle(item) {
    const title = item?.title;
    return typeof title === 'string' ? title : title?.simpleText || title?.runs?.map(run => run.text).join('') || '';
}

export function hasLiveChatReplaySupport(pageData = window.ytInitialData) {
    const renderer = getPageLiveChatRenderer(pageData) || document.querySelector('ytd-live-chat-frame')?.data?.liveChatRenderer;
    if (renderer) {
        const menuItems = renderer.header?.liveChatHeaderRenderer?.viewSelector
            ?.sortFilterSubMenuRenderer?.subMenuItems || [];
        if (menuItems.some(item => /replay|phát lại/i.test(getMenuTitle(item)))) return true;
        if (renderer.continuations?.some(item => item?.liveChatReplayContinuationData?.continuation)) return true;
    }

    const replayFrameExists = Array.from(document.querySelectorAll('iframe[src], iframe#chatframe, ytd-live-chat-frame iframe'))
        .some(frame => {
            try { return new URL(frame.src || frame.getAttribute('src') || '', location.href).pathname.includes('/live_chat_replay'); }
            catch (e) { return false; }
        });
    if (replayFrameExists) return true;

    // Premiere replays can expose only a collapsed replay card at first;
    // YouTube creates the iframe after its "Open control panel" button is used.
    const replayCard = Array.from(document.querySelectorAll('ytd-watch-flexy button, ytd-watch-flexy [role="button"], ytd-watch-flexy yt-formatted-string'))
        .find(el => {
            if (!el.getClientRects().length) return false;
            const text = `${el.innerText || el.textContent || ''} ${el.getAttribute('aria-label') || ''}`;
            return /mở bảng điều khiển|open control panel/i.test(text);
        });
    if (replayCard) {
        const context = replayCard.closest('ytd-live-chat-frame, ytd-engagement-panel-section-list-renderer, ytd-watch-metadata, #panels, #chat-container') || replayCard.parentElement?.parentElement;
        const text = `${context?.innerText || context?.textContent || ''} ${document.querySelector('ytd-watch-flexy')?.innerText || ''}`;
        if (/phát lại cuộc trò chuyện trực tiếp|live chat replay|top chat replay|phát lại các tin nhắn/i.test(text)) return true;
    }
    return false;
}

/** True only when YouTube exposes an actual live chat or replay for this video. */
export function hasLiveOrChatSupport() {
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return false;
    if (location.pathname.startsWith('/live')) return true;

    const player = document.querySelector('#movie_player:not(#inline-preview-player)');
    try {
        const videoData = player?.getVideoData?.();
        if (videoData && (videoData.isLive || videoData.isPostLiveDvr)) return true;
        if (typeof player?.isLive === 'function' && player.isLive()) return true;
    } catch (e) {}

    if (getPageLiveChatRenderer() || hasLiveChatReplaySupport()) return true;

    const frames = document.querySelectorAll(
        'iframe#chatframe, ytd-live-chat-frame iframe, iframe[src*="/live_chat"]'
    );
    for (const frame of frames) {
        try {
            if (new URL(frame.src || frame.getAttribute('src') || '', location.href).pathname.includes('/live_chat')) return true;
        } catch (e) {}
    }

    const chatRenderer = document.querySelector('ytd-live-chat-frame')?.data?.liveChatRenderer;
    if (chatRenderer) return true;

    const chatTeaser = document.querySelector('#chat-teaser, ytd-live-chat-frame #teaser');
    if (chatTeaser && chatTeaser.getClientRects().length) return true;

    const chatButton = document.querySelector('.ytp-live-chat-button, .ytp-chat-button');
    return !!(chatButton && chatButton.getClientRects().length);
}

let toastTimer = null;
/**
 * Hiển thị thông báo Toast nhẹ nhàng ở giữa cạnh dưới màn hình
 */
export function showToast(message, duration = 3000) {
    if (!document.body) return;
    let toast = document.getElementById('ytc-toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ytc-toast-notification';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('ytc-toast-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('ytc-toast-show');
    }, duration);
}

