// ==========================================================================
// UI PANEL STATE SYNCHRONIZATION
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { hasLiveOrChatSupport } from '../core/utils.js';
import { getLanguageInfo, t } from '../core/i18n.js';
import { updatePanelLanguage } from './panel.js';

export function syncPanelState(targetPanel) {
    const panel = targetPanel || document.getElementById('ytc-settings-panel');
    if (!panel) return;

    // 0. Đồng bộ toàn bộ ngôn ngữ giao diện của panel
    updatePanelLanguage(panel);

    // 1. Đồng bộ chế độ Live Chat và kiểm tra tính khả dụng của video hiện tại
    const hasChat = hasLiveOrChatSupport();
    const chatRow = panel.querySelector('#ytc-row-chatoverlay');
    if (chatRow) {
        chatRow.classList.toggle('ytc-disabled', !hasChat);
        const allBtns = chatRow.querySelectorAll('.ytc-mode-btn');
        allBtns.forEach(btn => {
            if (!hasChat) {
                btn.setAttribute('disabled', 'disabled');
                btn.setAttribute('title', t('chat_tip_disabled'));
            } else {
                btn.removeAttribute('disabled');
                const overlayMode = btn.getAttribute('data-overlay');
                if (overlayMode === 'off') {
                    btn.setAttribute('title', t('chat_tip_off'));
                } else if (overlayMode === 'danmaku') {
                    btn.setAttribute('title', t('chat_tip_danmaku'));
                } else if (overlayMode === 'streamer') {
                    btn.setAttribute('title', t('chat_tip_streamer'));
                }
            }
        });
    }

    const currentMode = currentConfig.chatOverlay || 'off';
    panel.querySelectorAll('.ytc-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-overlay') === currentMode);
    });

    // 2. Đồng bộ các toggle switches
    panel.querySelectorAll('.ytc-item[data-toggle]').forEach((item) => {
        const key = item.getAttribute('data-toggle');
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox && key in currentConfig) {
            checkbox.checked = !!currentConfig[key];
        }
    });

    // 3. Đồng bộ số cột
    panel.querySelectorAll('.ytc-col-btn').forEach((colBtn) => {
        const cols = parseInt(colBtn.getAttribute('data-cols'), 10);
        colBtn.classList.toggle('active', cols === currentConfig.columns);
    });

    // 4. Đồng bộ độ phân giải video ưu tiên
    const currentQuality = currentConfig.preferredQuality || 'auto';
    panel.querySelectorAll('.ytc-quality-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-quality') === currentQuality);
    });
    const qualityBadge = panel.querySelector('.ytc-quality-badge');
    if (qualityBadge) {
        if (currentQuality === 'auto') qualityBadge.textContent = t('quality_auto').toUpperCase();
        else if (currentQuality === 'max') qualityBadge.textContent = t('quality_max').toUpperCase();
        else qualityBadge.textContent = currentQuality.toUpperCase();
    }

    // 5. Đồng bộ ngôn ngữ giao diện (Floating Dropdown)
    const currentLangCode = currentConfig.language || 'auto';
    const langInfo = getLanguageInfo(currentLangCode);
    const labelEl = document.getElementById('ytc-lang-current-label');
    if (labelEl) labelEl.textContent = langInfo.name;

    const langMenu = document.getElementById('ytc-lang-menu');
    if (langMenu) {
        langMenu.querySelectorAll('.ytc-dropdown-item').forEach(item => {
            const isMatch = item.getAttribute('data-code') === currentLangCode;
            item.classList.toggle('active', isMatch);
            item.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });
    }
}
