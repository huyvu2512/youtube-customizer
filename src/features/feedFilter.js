// ==========================================================================
// BỘ LỌC NỘI DUNG FEED (SHORTS, PLAYABLES, HỘI VIÊN, KHÁM PHÁ, CỘNG ĐỒNG)
// ==========================================================================
import { rafThrottle, whenElement } from '../core/utils.js';
import { currentConfig } from '../core/config.js';
import { applyHomeGridColumns } from './grid.js';
import { dismissPromoBanners } from './promos.js';

export function scanAndTagFeedContent(scope) {
    if (!currentConfig.hideMembersOnly && !currentConfig.hideExploreTopics && !currentConfig.hideCommunity) return;
    const root = scope && scope.querySelectorAll ? scope : document;

    const sections = root.querySelectorAll('ytd-rich-section-renderer');
    sections.forEach((sec) => {
        if (currentConfig.hideMembersOnly && !sec.classList.contains('ytc-shelf-members')) {
            const text = sec.textContent || '';
            if (
                text.includes('lợi ích từ hội viên') ||
                text.includes('Ưu tiên hội viên') ||
                text.includes('ưu tiên hội viên') ||
                (text.includes('hội viên') && text.includes('YouTube chọn lọc')) ||
                text.includes('Get more from memberships') ||
                text.includes('Members only') ||
                text.includes('Members first') ||
                sec.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], a[href*="/membership"], a[href*="/memberships"]')
            ) {
                sec.classList.add('ytc-shelf-members');
            }
        }
        if (currentConfig.hideExploreTopics && !sec.classList.contains('ytc-shelf-explore')) {
            const text = sec.textContent || '';
            if (
                text.includes('Khám phá các chủ đề') ||
                text.includes('Explore other topics') ||
                text.includes('Explore topics') ||
                sec.querySelector('yt-chip-cloud-chip-renderer, yt-chip-cloud-renderer, ytd-feed-filter-chip-bar-renderer')
            ) {
                sec.classList.add('ytc-shelf-explore');
            }
        }
        if (currentConfig.hideCommunity && !sec.classList.contains('ytc-shelf-community')) {
            if (
                sec.querySelector('ytd-post-renderer, ytd-backstage-post-renderer, ytd-backstage-post-thread-renderer, ytd-post-multi-image-renderer, ytd-poll-renderer')
            ) {
                sec.classList.add('ytc-shelf-community');
            }
        }
    });

    if (currentConfig.hideMembersOnly) {
        const videoCards = root.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer');
        videoCards.forEach((card) => {
            if (!card.classList.contains('ytc-item-members')) {
                const text = card.textContent || '';
                if (
                    text.includes('Ưu tiên hội viên') ||
                    text.includes('ưu tiên hội viên') ||
                    text.includes('Chỉ dành cho hội viên') ||
                    text.includes('chỉ dành cho hội viên') ||
                    text.includes('Members first') ||
                    text.includes('Members only') ||
                    text.includes('Members-only') ||
                    text.includes('Early access') ||
                    card.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], [aria-label*="hội viên"], [aria-label*="Hội viên"], [aria-label*="Members"]')
                ) {
                    card.classList.add('ytc-item-members');
                }
            }
        });
    }
}

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
            let hasRelevantChanges = false;
            for (const mutation of mutations) {
                if (!mutation.addedNodes.length) continue;
                // Bỏ qua các mutation phát sinh từ preview player, video player hoặc chat overlay
                if (mutation.target.closest && mutation.target.closest('#preview, ytd-video-preview, #inline-preview-player, .html5-video-player, #ytc-streamer-box, #ytc-danmaku-container, ytd-moving-thumbnail-renderer')) {
                    continue;
                }
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        const tag = node.tagName.toLowerCase();
                        if (
                            tag === 'ytd-rich-grid-row' ||
                            tag === 'ytd-rich-grid-renderer' ||
                            tag === 'ytd-rich-item-renderer' ||
                            tag === 'ytd-rich-section-renderer' ||
                            tag === 'ytd-continuation-item-renderer'
                        ) {
                            hasRelevantChanges = true;
                            break;
                        }
                        if (node.querySelector && node.querySelector('ytd-rich-grid-row, ytd-rich-item-renderer, ytd-rich-section-renderer')) {
                            hasRelevantChanges = true;
                            break;
                        }
                    }
                }
                if (hasRelevantChanges) break;
            }
            if (hasRelevantChanges) {
                scheduleFeedScan(container);
            }
        }).observe(container, { childList: true, subtree: true });
    };

    const target = document.getElementById('page-manager') || document.querySelector('ytd-page-manager') || document.body;
    if (target) attach(target);
    else whenElement('#page-manager', attach);

    // Theo dõi trực tiếp ytd-popup-container để đóng tức thì các toast cảnh báo gián đoạn khi vừa chèn vào DOM
    const attachPopup = (popupContainer) => {
        dismissPromoBanners(popupContainer);
        new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    dismissPromoBanners(popupContainer);
                    break;
                }
            }
        }).observe(popupContainer, { childList: true, subtree: true });
    };

    const popupContainer = document.querySelector('ytd-popup-container');
    if (popupContainer) attachPopup(popupContainer);
    else whenElement('ytd-popup-container', attachPopup);
}
