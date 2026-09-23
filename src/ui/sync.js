// ==========================================================================
// UI PANEL STATE SYNCHRONIZATION
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { hasLiveOrChatSupport } from '../core/utils.js';

export function syncPanelState(targetPanel) {
    const panel = targetPanel || document.getElementById('ytc-settings-panel');
    if (!panel) return;

    // 1. Đồng bộ chế độ Live Chat và kiểm tra tính khả dụng của video hiện tại
    const hasChat = hasLiveOrChatSupport();
    const chatRow = panel.querySelector('#ytc-row-chatoverlay');
    if (chatRow) {
        chatRow.classList.toggle('ytc-disabled', !hasChat);
        const liveBtns = chatRow.querySelectorAll('.ytc-mode-btn:not([data-overlay="off"])');
        liveBtns.forEach(btn => {
            if (!hasChat) {
                btn.setAttribute('disabled', 'disabled');
                btn.setAttribute('title', 'Chỉ khả dụng khi xem Live Stream hoặc video có khung trò chuyện');
            } else {
                btn.removeAttribute('disabled');
                if (btn.getAttribute('data-overlay') === 'danmaku') {
                    btn.setAttribute('title', 'Chữ chạy ngang màn hình dạng Danmaku');
                } else if (btn.getAttribute('data-overlay') === 'streamer') {
                    btn.setAttribute('title', 'Khung chat nổi của streamer, kéo thả và co giãn tự do');
                }
            }
        });
    }

    if (!hasChat && currentConfig.chatOverlay !== 'off') {
        currentConfig.chatOverlay = 'off';
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
}

