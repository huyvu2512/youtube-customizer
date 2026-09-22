// ==========================================================================
// NOTIFICATIONS: ONBOARDING & REMOTE UPDATE CHECKER
// ==========================================================================
import { APP_VERSION } from '../core/constants.js';
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

export function checkForUpdates(btn) {
    if (updateCheckInitiated) return;
    const targetBtn = document.getElementById('ytc-settings-btn') || btn;
    if (!targetBtn) return;
    updateCheckInitiated = true;

    const CHECK_URL = 'https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/package.json';
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
                window.open('https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js', '_blank');
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

    fetch(`${CHECK_URL}?_t=${now}_${Math.random().toString(36).slice(2)}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    })
        .then(res => res.json())
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
