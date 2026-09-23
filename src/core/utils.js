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

/**
 * Kiểm tra xem video hiện tại có phải Live Stream hoặc có khung trò chuyện / phát lại trò chuyện không
 */
export function hasLiveOrChatSupport() {
    if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) {
        return false;
    }
    if (location.pathname.startsWith('/live')) {
        return true;
    }
    if (document.getElementById('ytc-bg-live-chat')) {
        return true;
    }
    const player = document.querySelector('#movie_player:not(#inline-preview-player)');
    if (player) {
        try {
            if (typeof player.getVideoData === 'function') {
                const data = player.getVideoData();
                if (data && (data.isLive || data.isPostLiveDvr)) return true;
            }
            if (typeof player.isLive === 'function' && player.isLive()) return true;
        } catch (e) {}
    }
    const chatEl = document.querySelector(
        'ytd-live-chat-frame, ' +
        'iframe#chatframe, ' +
        'iframe[src*="/live_chat"], ' +
        '#chat-teaser, ' +
        '#teaser, ' +
        'ytd-engagement-panel-section-list-renderer[target-id*="chat" i], ' +
        '[target-id="engagement-panel-live-chat"], ' +
        '.ytp-live-chat-button, ' +
        '.ytp-chat-button, ' +
        '#actions button[aria-label*="trò chuyện" i], ' +
        '#actions button[aria-label*="chat" i], ' +
        '#top-level-buttons-computed button[aria-label*="trò chuyện" i], ' +
        '#top-level-buttons-computed button[aria-label*="chat" i]'
    );
    if (chatEl) return true;

    // Kiểm tra #chat hoặc #chat-container nếu thực sự chứa nội dung (iframe, teaser hoặc frame)
    const chatBox = document.querySelector('#chat.ytd-watch-flexy, #chat-container');
    if (chatBox) {
        const hasContent = chatBox.querySelector('ytd-live-chat-frame, iframe, #chat-teaser, #teaser, button');
        if (hasContent) return true;
    }

    return false;
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

