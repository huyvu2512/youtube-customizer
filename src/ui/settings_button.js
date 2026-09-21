// NÚT CÀI ĐẶT BÁNH RĂNG TRÊN MASTHEAD & ĐỒNG BỘ DOM
import { GEAR_SVG } from '../icons/svgs.js';
import { safeHTML, whenElement } from '../core/dom.js';
import { createSettingsPanel } from './settings_panel.js';

export function ensureSettingsElements() {
    const endContainer = document.querySelector('ytd-masthead #end, #masthead #end, #end.ytd-masthead');
    if (!endContainer) return;

    let btn = document.getElementById('ytc-settings-btn');
    const isNewBtn = !btn;
    if (isNewBtn) {
        btn = document.createElement('button');
        btn.id = 'ytc-settings-btn';
        btn.title = 'YouTube Customizer';
        btn.innerHTML = safeHTML(GEAR_SVG);
    }

    // Luôn gắn btn vào đầu endContainer (trước cả skeleton icons và buttons)
    // Kết hợp cùng CSS 'order: -1 !important' để triệt tiêu hoàn toàn lỗi nhảy vị trí lúc skeleton loading
    if (btn.parentElement !== endContainer || btn !== endContainer.firstElementChild) {
        endContainer.insertBefore(btn, endContainer.firstElementChild);
    }

    createSettingsPanel(btn);
}

export function setupSettingsObserver() {
    ensureSettingsElements();

    const attach = (masthead) => {
        ensureSettingsElements();
        new MutationObserver(() => {
            ensureSettingsElements();
        }).observe(masthead, { childList: true, subtree: true });
    };

    const masthead = document.querySelector('ytd-masthead');
    if (masthead) attach(masthead);
    else whenElement('ytd-masthead', attach);

    let retryCount = 0;
    const retryInterval = setInterval(() => {
        retryCount++;
        ensureSettingsElements();
        if (retryCount >= 6 && document.getElementById('ytc-settings-btn')) {
            clearInterval(retryInterval);
        }
    }, 500);
}
