// ==========================================================================
// UI PANEL STATE SYNCHRONIZATION
// ==========================================================================
import { currentConfig } from '../core/config.js';

export function syncPanelState(targetPanel) {
    const panel = targetPanel || document.getElementById('ytc-settings-panel');
    if (!panel) return;

    // 1. Đồng bộ chế độ Live Chat (mặc định Tắt khi ở ngoài video hoặc sau khi chuyển trang/F5)
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
