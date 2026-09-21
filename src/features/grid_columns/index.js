// TÙY BIẾN SỐ CỘT TRANG CHỦ & FEED (3, 4, 5 CỘT)
import { currentConfig, registerOnApplyConfig } from '../../config/index.js';
import { isHomeFeedPath } from '../../core/dom.js';

export function applyHomeGridColumns() {
    if (!isHomeFeedPath()) return;
    const cols = currentConfig.columns || 4;
    const grids = document.querySelectorAll('ytd-rich-grid-renderer');
    grids.forEach((grid) => {
        if (!grid.classList.contains('ytc-grid')) {
            grid.classList.add('ytc-grid');
        }
        grid.style.setProperty('--ytd-rich-grid-items-per-row', String(cols), 'important');
        grid.style.setProperty('--ytd-rich-grid-posts-per-row', String(cols), 'important');
        grid.style.setProperty('--ytd-rich-grid-item-max-width', 'none', 'important');
    });
}

// Đăng ký để tự động áp dụng khi cấu hình thay đổi
registerOnApplyConfig(applyHomeGridColumns);
