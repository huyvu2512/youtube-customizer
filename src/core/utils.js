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
