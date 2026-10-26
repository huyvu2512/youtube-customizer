// ==========================================================================
// NOTIFICATIONS: ONBOARDING & REMOTE UPDATE CHECKER
// ==========================================================================
import { APP_VERSION } from '../core/constants.js';
import { currentConfig } from '../core/config.js';
import { safeHTML, setElementHTML } from '../core/utils.js';

const ONBOARDING_KEY = `ytc_onboarding_v${APP_VERSION.replace(/\./g, '_')}`;
let updateCheckInitiated = false;

export function isNewerVersion(remote, current) {
    if (!remote || !current) return false;
    const r = remote.split('.').map(x => parseInt(x, 10) || 0);
    const c = current.split('.').map(x => parseInt(x, 10) || 0);
    for (let i = 0; i < Math.max(r.length, c.length); i++) {
        const rPart = r[i] || 0;
        const cPart = c[i] || 0;
        if (rPart > cPart) return true;
        if (rPart < cPart) return false;
    }
    return false;
}

/** Open the userscript update page only after an explicit user action.
 * Reload YouTube only after this tab was backgrounded and then revisited.
 */
export function openUpdatePage(url) {
    const updateTab = window.open(url, '_blank');
    if (!updateTab) return false;

    let leftYouTubeTab = false;
    let completed = false;
    const cleanup = () => {
        if (completed) return;
        completed = true;
        document.removeEventListener('visibilitychange', onVisibilityChange);
        clearTimeout(expireTimer);
    };
    const onVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            leftYouTubeTab = true;
            return;
        }
        if (leftYouTubeTab && document.visibilityState === 'visible') {
            cleanup();
            // Give Tampermonkey a moment to finish applying the accepted update.
            setTimeout(() => location.reload(), 500);
        }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    // A stale update attempt must not make an unrelated tab switch reload YouTube later.
    const expireTimer = setTimeout(cleanup, 5 * 60 * 1000);
    return true;
}

export function showTipCard(btn, { badge, badgeBg, title, desc, btnText, onAction, onClose, tipId = 'ytc-onboarding-tip' }) {
    if (!btn || document.getElementById(tipId)) return;

    const tip = document.createElement('div');
    tip.id = tipId;
    setElementHTML(tip, `
        <div class="ytc-onboarding-arrow"></div>
        <div class="ytc-onboarding-header">
            <span class="ytc-onboarding-badge"${badgeBg ? ` style="background:${badgeBg};"` : ''}>${badge}</span>
            <button class="ytc-onboarding-close" title="Đóng">✕</button>
        </div>
        <div class="ytc-onboarding-content">
            <div class="ytc-onboarding-title">${title}</div>
            <div class="ytc-onboarding-desc">${desc}</div>
        </div>
        <div class="ytc-onboarding-footer">
            <button class="ytc-onboarding-btn">${btnText}</button>
        </div>
    `);

    document.body.appendChild(tip);

    const updateTipPos = () => {
        const targetBtn = document.getElementById('ytc-settings-btn') || btn;
        if (!targetBtn || !targetBtn.isConnected || !tip.isConnected) return;
        const rect = targetBtn.getBoundingClientRect();
        if (rect.width === 0 || rect.bottom === 0) return;
        tip.style.top = `${rect.bottom + 12}px`;
        tip.style.right = `${Math.max(10, window.innerWidth - rect.right - 10)}px`;
    };

    updateTipPos();
    window.addEventListener('resize', updateTipPos);
    setTimeout(updateTipPos, 200);
    setTimeout(updateTipPos, 600);
    setTimeout(updateTipPos, 1500);

    const dismissTip = () => {
        window.removeEventListener('resize', updateTipPos);
        tip.remove();
    };

    const actionBtn = tip.querySelector('.ytc-onboarding-btn');
    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            if (onAction) onAction();
            dismissTip();
        });
    }

    const closeBtn = tip.querySelector('.ytc-onboarding-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (onClose) onClose();
            dismissTip();
        });
    }

    btn.addEventListener('click', dismissTip, { once: true });
}

/**
 * Tải file package.json từ GitHub với cơ chế 3 tầng:
 * 1. raw.githubusercontent.com (không kèm custom headers để tránh CORS preflight)
 * 2. api.github.com
 * 3. cdn.jsdelivr.net (fallback)
 */
export async function fetchRemotePackage() {
    const now = Date.now();

    // 1. Ưu tiên 1: GitHub API (Không bị dính 5 phút cache của Fastly CDN trên raw.githubusercontent.com)
    try {
        const apiRes = await fetch(`https://api.github.com/repos/huyvu2512/youtube-customizer/contents/package.json?ref=main&_t=${now}`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' },
            cache: 'no-store'
        });
        if (apiRes.ok) {
            const data = await apiRes.json();
            if (data && data.version) {
                return data;
            } else if (data && data.content && data.encoding === 'base64') {
                try {
                    const parsed = JSON.parse(decodeURIComponent(escape(atob(data.content.replace(/\s/g, '')))));
                    if (parsed && parsed.version) return parsed;
                } catch (err) {}
            }
        }
    } catch (e) {}

    // 2. Dự phòng: raw.githubusercontent.com trực tiếp
    try {
        const rawRes = await fetch(`https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/package.json?_t=${now}`, {
            cache: 'no-store'
        });
        if (rawRes.ok) {
            const data = await rawRes.json();
            if (data && data.version) return data;
        }
    } catch (e) {}

    // 3. Dự phòng jsDelivr CDN
    try {
        const jsdelivrRes = await fetch(`https://cdn.jsdelivr.net/gh/huyvu2512/youtube-customizer@main/package.json?_t=${now}`, {
            cache: 'no-store'
        });
        if (jsdelivrRes.ok) {
            const data = await jsdelivrRes.json();
            if (data && data.version) return data;
        }
    } catch (e) {}

    return null;
}

export function checkForUpdates(btn) {
    if (updateCheckInitiated) return;
    const targetBtn = document.getElementById('ytc-settings-btn') || btn;
    if (!targetBtn) return;
    updateCheckInitiated = true;

    const CACHE_KEY = 'ytc_remote_ver_cache';
    const now = Date.now();

    const renderUpdateNotification = (remoteVer) => {
        if (!remoteVer || !isNewerVersion(remoteVer, APP_VERSION)) return false;

        const dismissedKey = `ytc_dismiss_ver_${remoteVer.replace(/\./g, '_')}`;
        try {
            if (localStorage.getItem(dismissedKey) === 'true') return false;
        } catch (e) {}

        const oldTip = document.getElementById('ytc-onboarding-tip');
        if (oldTip) oldTip.remove();

        const currentBtn = document.getElementById('ytc-settings-btn') || btn;
        showTipCard(currentBtn, {
            badge: 'BẢN MỚI',
            title: `Đã có bản cập nhật mới v${remoteVer}`,
            desc: `YouTube Customizer v${remoteVer} đã sẵn sàng trên GitHub với các tính năng mới và bản sửa lỗi tối ưu.`,
            btnText: 'Cập nhật ngay',
            onAction: () => {
                const updateUrl = `https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=${remoteVer}`;
                if (!openUpdatePage(updateUrl)) {
                    window.open('https://github.com/huyvu2512/youtube-customizer/releases', '_blank');
                }
                try { localStorage.setItem(dismissedKey, 'true'); } catch (e) {}
            },
            onClose: () => {
                try { localStorage.setItem(dismissedKey, 'true'); } catch (e) {}
            }
        });
        return true;
    };

    try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
            const cached = JSON.parse(cachedRaw);
            if (cached && cached.version && isNewerVersion(cached.version, APP_VERSION)) {
                if (now - cached.time < 15 * 60 * 1000) {
                    renderUpdateNotification(cached.version);
                    return;
                }
            }
        }
    } catch (e) {}

    fetchRemotePackage()
        .then(data => {
            if (data && data.version) {
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({ version: data.version, time: Date.now() }));
                } catch (e) {}
                renderUpdateNotification(data.version);
            }
        })
        .catch(() => {
            updateCheckInitiated = false;
        });
}

export function setupOnboardingAndUpdates(btn) {
    if (!btn) return;

    if (document.getElementById('ytc-onboarding-tip')) {
        const existingTip = document.getElementById('ytc-onboarding-tip');
        if (existingTip && btn.isConnected) {
            const rect = btn.getBoundingClientRect();
            if (rect.width > 0 && rect.bottom > 0) {
                existingTip.style.top = `${rect.bottom + 12}px`;
                existingTip.style.right = `${Math.max(10, window.innerWidth - rect.right - 10)}px`;
            }
        }
        return;
    }

    checkForUpdates(btn);

    setTimeout(() => {
        if (document.getElementById('ytc-onboarding-tip')) return;
        try {
            if (localStorage.getItem(ONBOARDING_KEY) === 'true') return;
        } catch (e) { return; }

        showTipCard(btn, {
            badge: `PHIÊN BẢN v${APP_VERSION}`,
            title: 'Cài đặt YouTube Customizer ở đây',
            desc: 'Nhấp vào biểu tượng bánh răng này để bật/tắt các tính năng tùy biến theo nhu cầu của bạn.',
            btnText: 'Đã hiểu',
            onAction: () => {
                try { localStorage.setItem(ONBOARDING_KEY, 'true'); } catch (e) {}
            },
            onClose: () => {
                try { localStorage.setItem(ONBOARDING_KEY, 'true'); } catch (e) {}
            }
        });
    }, 600);
}

/**
 * Kiểm tra phiên bản nền; không tự mở trang cập nhật hoặc tải lại YouTube.
 */
export async function checkAndAutoUpdate(force = false) {
    if (!currentConfig.autoUpdate && !force) return;
    if (window.self !== window.top) return;

    if (window.__ytc_auto_update_checked && !force) return;
    window.__ytc_auto_update_checked = true;

    try {
        const pkg = await fetchRemotePackage();
        if (pkg && pkg.version && isNewerVersion(pkg.version, APP_VERSION)) {
            console.info(`[YouTube Customizer] Có phiên bản mới v${pkg.version}; hãy dùng nút Kiểm tra cập nhật để mở Tampermonkey.`);
        }
    } catch (err) {
        console.warn('[YouTube Customizer] Tự động kiểm tra cập nhật thất bại:', err);
    }
}
