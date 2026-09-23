// ==========================================================================
// GRID LAYOUT (3, 4, 5 CỘT TRANG CHỦ)
// ==========================================================================
import { currentConfig } from '../core/config.js';

export function isHomeFeedPath() {
    const p = location.pathname;
    return p === '/' || p.startsWith('/feed') || p.startsWith('/@') || p.startsWith('/channel');
}

export function applyHomeGridColumns() {
    if (!isHomeFeedPath()) return;
    const cols = currentConfig.columns || 3;
    const colStr = String(cols);
    const grids = document.querySelectorAll('ytd-rich-grid-renderer');
    grids.forEach((grid) => {
        if (!grid.classList.contains('ytc-grid')) {
            grid.classList.add('ytc-grid');
        }
        if (grid.style.getPropertyValue('--ytd-rich-grid-items-per-row') !== colStr) {
            grid.style.setProperty('--ytd-rich-grid-items-per-row', colStr, 'important');
        }
        if (grid.style.getPropertyValue('--ytd-rich-grid-posts-per-row') !== colStr) {
            grid.style.setProperty('--ytd-rich-grid-posts-per-row', colStr, 'important');
        }
        if (grid.style.getPropertyValue('--ytd-rich-grid-item-max-width') !== 'none') {
            grid.style.setProperty('--ytd-rich-grid-item-max-width', 'none', 'important');
        }
    });
}
