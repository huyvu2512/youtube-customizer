// ==========================================================================
// TỰ ĐỘNG ĐÓNG / ẨN KHUNG SẢN PHẨM GẮN THẺ (YOUTUBE SHOPPING)
// ==========================================================================
import { currentConfig } from '../core/config.js';

export function dismissShoppingPanels(scope) {
    if (!currentConfig.hideShopping) return;
    const root = scope && scope.querySelectorAll ? scope : document;

    // 1. Tự động đóng engagement panel Shopping nếu đang mở làm co hẹp màn hình video
    const shoppingPanels = root.querySelectorAll(
        'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-shopping-panel"],' +
        'ytd-engagement-panel-section-list-renderer[target-id*="shopping"],' +
        'ytd-engagement-panel-section-list-renderer[target-id*="product"]'
    );
    shoppingPanels.forEach((panel) => {
        const isExpanded = panel.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED' ||
            panel.hasAttribute('opened');
        if (isExpanded) {
            const closeBtn = panel.querySelector('#visibility-button button, button[aria-label*="Đóng"], button[aria-label*="Close"], #visibility-button');
            if (closeBtn) {
                try { closeBtn.click(); } catch (e) {}
            }
        }
        panel.style.setProperty('display', 'none', 'important');
        panel.style.setProperty('opacity', '0', 'important');
        panel.style.setProperty('pointer-events', 'none', 'important');
    });

    // 2. Ẩn nút túi xách / badge mua sắm trong player
    const shoppingBtns = root.querySelectorAll(
        '.ytp-shopping-button, .ytp-featured-product-banner, .ytp-suggested-action-badge[aria-label*="sản phẩm" i], .ytp-suggested-action-badge[aria-label*="product" i], .ytp-suggested-action-badge[aria-label*="shopping" i]'
    );
    shoppingBtns.forEach((btn) => {
        btn.style.setProperty('display', 'none', 'important');
        btn.style.setProperty('opacity', '0', 'important');
        btn.style.setProperty('pointer-events', 'none', 'important');
    });
}
