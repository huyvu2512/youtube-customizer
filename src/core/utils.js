// ==========================================================================
// CORE UTILITIES (DOM, TRUSTED TYPES, TIMING)
// ==========================================================================

const ytcPolicy = window.trustedTypes?.createPolicy?.('youtubeCustomizerPolicy', {
    createHTML: (html) => html,
}) || window.trustedTypes?.defaultPolicy;

export function safeHTML(html) {
    return ytcPolicy ? ytcPolicy.createHTML(html) : html;
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
