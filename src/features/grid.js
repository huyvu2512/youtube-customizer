// ==========================================================================
// GRID LAYOUT (3, 4, 5 CỘT TRANG CHỦ)
// ==========================================================================
import { currentConfig } from '../core/config.js';

export function isHomeFeedPath(pathname = (typeof location !== 'undefined' ? location.pathname : '')) {
    return pathname === '/' || pathname.startsWith('/feed') || pathname.startsWith('/@') || pathname.startsWith('/channel');
}

export function applyHomeGridColumns() {
    const isFeed = isHomeFeedPath();
    if (document.documentElement) {
        document.documentElement.classList.toggle('ytc-feed-page', isFeed);
    }
    if (!isFeed) return;
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
