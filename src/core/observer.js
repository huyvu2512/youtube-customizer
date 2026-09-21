// QUẢN LÝ OBSERVER BỀN BỈ CHO FEED VÀ SHELVES
import { rafThrottle, whenElement } from './dom.js';
import { scanAndTagFeedContent } from '../features/content_filters/index.js';
import { applyHomeGridColumns } from '../features/grid_columns/index.js';
import { dismissPromoBanners } from '../features/promos/index.js';

export const scheduleFeedScan = rafThrottle((root) => {
    scanAndTagFeedContent(root);
    applyHomeGridColumns();
    dismissPromoBanners(root);
});

export function setupFeedShelvesObserver() {
    scheduleFeedScan(document);
    applyHomeGridColumns();
    dismissPromoBanners(document);

    const attach = (container) => {
        scheduleFeedScan(container);
        applyHomeGridColumns();
        dismissPromoBanners(container);
        new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    scheduleFeedScan(container);
                    applyHomeGridColumns();
                    dismissPromoBanners(container);
                    break;
                }
            }
        }).observe(container, { childList: true, subtree: true });
    };

    const target = document.getElementById('page-manager') || document.querySelector('ytd-page-manager') || document.body;
    if (target) attach(target);
    else whenElement('#page-manager', attach);
}
