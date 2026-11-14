// ==========================================================================
// BỘ LỌC NỘI DUNG FEED (SHORTS, PLAYABLES, HỘI VIÊN, KHÁM PHÁ, CỘNG ĐỒNG)
// ==========================================================================
import { rafThrottle, whenElement } from '../core/utils.js';
import { currentConfig } from '../core/config.js';
import { applyHomeGridColumns, isHomeFeedPath } from './grid.js';

let feedObserver = null;
let feedObserverTarget = null;

export function hasActiveFeedFilters() {
    return !!(
        currentConfig.hideShorts ||
        currentConfig.hidePlayables ||
        currentConfig.hideMembersOnly ||
        currentConfig.hideMixes ||
        currentConfig.hideExploreTopics ||
        currentConfig.hideCommunity ||
        currentConfig.cleanSearch
    );
}

export function hasActiveWatchCardFilters() {
    return !!(currentConfig.hideMembersOnly || currentConfig.hideMixes);
}

export function needsFeedObserver(pathname = (typeof location !== 'undefined' ? location.pathname : '/')) {
    if (pathname.startsWith('/shorts')) return false;
    if (pathname.startsWith('/watch') || pathname.startsWith('/live')) {
        return hasActiveWatchCardFilters();
    }
    return hasActiveFeedFilters() || (isHomeFeedPath(pathname) && (currentConfig.columns || 3) !== 3);
}

function isWatchRoute() {
    const p = location.pathname;
    return p.startsWith('/watch') || p.startsWith('/live');
}

function tagGuideEntries(doc) {
    if (!doc || !doc.querySelectorAll) return;
    if (currentConfig.hideShorts) {
        doc.querySelectorAll('ytd-guide-entry-renderer:not([data-ytc-sh-guide]), ytd-mini-guide-entry-renderer:not([data-ytc-sh-guide])').forEach((entry) => {
            entry.setAttribute('data-ytc-sh-guide', '1');
            if (entry.querySelector('a[href^="/shorts"]')) {
                entry.classList.add('ytc-guide-shorts');
            }
        });
    }
    if (currentConfig.hidePlayables) {
        doc.querySelectorAll('ytd-guide-entry-renderer:not([data-ytc-pl-guide]), ytd-mini-guide-entry-renderer:not([data-ytc-pl-guide])').forEach((entry) => {
            entry.setAttribute('data-ytc-pl-guide', '1');
            if (entry.querySelector('a[href*="/playables"], a[href*="playables"]')) {
                entry.classList.add('ytc-guide-playables');
            }
        });
    }
}

function getScanRoots(scope) {
    if (isWatchRoute()) {
        if (scope && scope !== document && scope.nodeType === 1 && !scope.matches('#page-manager, ytd-page-manager, ytd-app')) {
            return [scope];
        }
        return Array.from(document.querySelectorAll('#related, ytd-watch-next-secondary-results-renderer, #playlist, ytd-playlist-panel-renderer'));
    }

    if (scope && scope !== document && scope.nodeType === 1 && !scope.matches('#page-manager, ytd-page-manager, ytd-app')) {
        if (scope.closest?.('ytd-browse[hidden], ytd-search[hidden]')) return [];
        return [scope];
    }

    const activeContainers = Array.from(document.querySelectorAll('ytd-browse:not([hidden]), ytd-search:not([hidden])'));
    if (activeContainers.length > 0) return activeContainers;
    return scope && scope.querySelectorAll ? [scope] : [document];
}

export function scanAndTagFeedContent(scope) {
    if (!hasActiveFeedFilters()) return;

    if (currentConfig.hideShorts || currentConfig.hidePlayables) {
        tagGuideEntries(document);
    }

    if (isWatchRoute() && !hasActiveWatchCardFilters()) return;

    const roots = getScanRoots(scope);
    if (!roots.length) return;

    for (const root of roots) {
        if (!root || !root.querySelectorAll) continue;

        // Quét section CHỈ KHI có filter shelf active
        if (
            currentConfig.hideShorts ||
            currentConfig.hidePlayables ||
            currentConfig.hideMembersOnly ||
            currentConfig.hideExploreTopics ||
            currentConfig.hideCommunity ||
            currentConfig.hideMixes ||
            currentConfig.cleanSearch
        ) {
            const sections = root.querySelectorAll('ytd-rich-section-renderer:not([data-ytc-sec-scanned])');
            sections.forEach((sec) => {
                sec.setAttribute('data-ytc-sec-scanned', '1');
                if (currentConfig.hideShorts && sec.querySelector('ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer')) {
                    sec.classList.add('ytc-shelf-shorts');
                    return;
                }
                if (currentConfig.hidePlayables && sec.querySelector('[is-mini-game-card-shelf], a[href*="playables"]')) {
                    sec.classList.add('ytc-shelf-playables');
                    return;
                }
                if (currentConfig.cleanSearch && sec.querySelector('ytd-ad-slot-renderer')) {
                    sec.classList.add('ytc-shelf-ad');
                    return;
                }
                if (currentConfig.hideMembersOnly) {
                    if (sec.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], a[href*="/membership"], a[href*="/memberships"]')) {
                        sec.classList.add('ytc-shelf-members');
                        return;
                    }
                    const text = sec.textContent || '';
                    if (
                        text.includes('lợi ích từ hội viên') ||
                        text.includes('Ưu tiên hội viên') ||
                        text.includes('ưu tiên hội viên') ||
                        (text.includes('hội viên') && text.includes('YouTube chọn lọc')) ||
                        text.includes('Get more from memberships') ||
                        text.includes('Members only') ||
                        text.includes('Members first')
                    ) {
                        sec.classList.add('ytc-shelf-members');
                        return;
                    }
                }
                if (currentConfig.hideExploreTopics) {
                    if (sec.querySelector('#chips, yt-chip-cloud-chip-renderer, yt-chip-cloud-renderer, ytd-feed-filter-chip-bar-renderer')) {
                        sec.classList.add('ytc-shelf-explore');
                        return;
                    }
                    const text = sec.textContent || '';
                    if (
                        text.includes('Khám phá các chủ đề') ||
                        text.includes('Explore other topics') ||
                        text.includes('Explore topics')
                    ) {
                        sec.classList.add('ytc-shelf-explore');
                        return;
                    }
                }
                if (currentConfig.hideCommunity) {
                    if (sec.querySelector('ytd-post-renderer, ytd-backstage-post-renderer, ytd-backstage-post-thread-renderer, ytd-post-multi-image-renderer, ytd-poll-renderer')) {
                        sec.classList.add('ytc-shelf-community');
                        return;
                    }
                }
                if (currentConfig.hideMixes) {
                    const titleEl = sec.querySelector('#title, #title-container, yt-formatted-string#title');
                    const titleText = (titleEl ? titleEl.textContent : '') || '';
                    if (titleText.includes('Danh sách kết hợp') || titleText.includes('Mixes') || titleText.includes('YouTube tạo danh sách phát này')) {
                        sec.classList.add('ytc-shelf-mix');
                    }
                }
            });
        }

        if (currentConfig.hideMembersOnly) {
            const videoCards = root.querySelectorAll(
                'ytd-rich-item-renderer:not([data-ytc-mem-scanned]), ytd-video-renderer:not([data-ytc-mem-scanned]), ' +
                'ytd-compact-video-renderer:not([data-ytc-mem-scanned]), yt-lockup-view-model:not([data-ytc-mem-scanned])'
            );
            videoCards.forEach((card) => {
                card.setAttribute('data-ytc-mem-scanned', '1');
                if (card.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], [aria-label*="hội viên" i], [aria-label*="Members" i]')) {
                    card.classList.add('ytc-item-members');
                } else {
                    const badgeArea = card.querySelector('#badges, ytd-badge-supported-renderer, #metadata-line, yt-badge-view-model');
                    const text = badgeArea ? (badgeArea.textContent || '') : '';
                    if (
                        text.includes('Ưu tiên hội viên') ||
                        text.includes('ưu tiên hội viên') ||
                        text.includes('Chỉ dành cho hội viên') ||
                        text.includes('chỉ dành cho hội viên') ||
                        text.includes('Members first') ||
                        text.includes('Members only') ||
                        text.includes('Members-only') ||
                        text.includes('Early access')
                    ) {
                        card.classList.add('ytc-item-members');
                    }
                }
            });
        }

        if (currentConfig.hideMixes) {
            const mixCards = root.querySelectorAll(
                'ytd-rich-item-renderer:not([data-ytc-mix-scanned]), ytd-video-renderer:not([data-ytc-mix-scanned]), ' +
                'ytd-compact-video-renderer:not([data-ytc-mix-scanned]), yt-lockup-view-model:not([data-ytc-mix-scanned]), ' +
                'ytd-radio-renderer:not([data-ytc-mix-scanned]), ytd-compact-radio-renderer:not([data-ytc-mix-scanned]), ' +
                'ytd-grid-radio-renderer:not([data-ytc-mix-scanned]), ytd-playlist-renderer:not([data-ytc-mix-scanned]), ' +
                'ytd-compact-playlist-renderer:not([data-ytc-mix-scanned])'
            );
            mixCards.forEach((card) => {
                card.setAttribute('data-ytc-mix-scanned', '1');
                const tag = card.tagName.toLowerCase();
                if (
                    tag === 'ytd-radio-renderer' ||
                    tag === 'ytd-compact-radio-renderer' ||
                    tag === 'ytd-grid-radio-renderer' ||
                    tag === 'ytd-playlist-renderer' ||
                    tag === 'ytd-compact-playlist-renderer'
                ) {
                    card.classList.add('ytc-item-mix');
                    return;
                }
                if (card.querySelector('ytd-radio-renderer, ytd-compact-radio-renderer, ytd-playlist-renderer, ytd-compact-playlist-renderer, ytd-playlist-thumbnail, ytd-playlist-custom-thumbnail-renderer, a[href*="/playlist?list="], a[href*="list=RD"], a[href*="list=PL"], a[href*="list=OLAK5uy_"], a[href*="list=CL"]')) {
                    card.classList.add('ytc-item-mix');
                    return;
                }
                const hasVideoDuration = !!card.querySelector('ytd-thumbnail-overlay-time-status-renderer, span.ytd-thumbnail-overlay-time-status-renderer');
                if (!hasVideoDuration) {
                    const titleOrBadge = card.querySelector('#video-title, #title, #metadata') || card;
                    const text = titleOrBadge.textContent || '';
                    if (
                        text.includes('Danh sách kết hợp') ||
                        text.includes('YouTube tạo danh sách phát này') ||
                        text.includes('Xem toàn bộ danh sách phát') ||
                        text.includes('Xem toàn bộ khoá học') ||
                        text.includes('Xem toàn bộ khóa học')
                    ) {
                        card.classList.add('ytc-item-mix');
                    }
                }
            });

            root.querySelectorAll('ytd-shelf-renderer:not([data-ytc-mix-shelf])').forEach((shelf) => {
                shelf.setAttribute('data-ytc-mix-shelf', '1');
                const titleEl = shelf.querySelector('#title, #title-container');
                const titleText = (titleEl ? titleEl.textContent : '') || '';
                if (titleText.includes('Danh sách kết hợp') || titleText.includes('Mixes')) {
                    shelf.classList.add('ytc-shelf-mix');
                }
            });

            root.querySelectorAll('yt-chip-cloud-chip-renderer:not([data-ytc-mix-chip])').forEach((chip) => {
                chip.setAttribute('data-ytc-mix-chip', '1');
                const text = chip.textContent || '';
                if (text.includes('Danh sách kết hợp') || text.includes('Mixes')) {
                    chip.classList.add('ytc-chip-mix');
                }
            });
        }

        if (currentConfig.cleanSearch) {
            root.querySelectorAll('ytd-rich-item-renderer:not([data-ytc-ad-scanned]), ytd-video-renderer:not([data-ytc-ad-scanned])').forEach((card) => {
                card.setAttribute('data-ytc-ad-scanned', '1');
                if (card.querySelector('ytd-ad-slot-renderer, .badge-style-type-ad')) {
                    card.classList.add('ytc-item-ad');
                }
            });
        }

        if (currentConfig.hideCommunity) {
            root.querySelectorAll('ytd-rich-item-renderer:not([data-ytc-com-scanned])').forEach((card) => {
                card.setAttribute('data-ytc-com-scanned', '1');
                if (card.querySelector('ytd-post-renderer, ytd-backstage-post-renderer')) {
                    card.classList.add('ytc-item-community');
                }
            });
        }
    }
}

export const scheduleFeedScan = rafThrottle((root) => {
    scanAndTagFeedContent(root);
    applyHomeGridColumns();
});

const RELEVANT_FEED_TAGS = new Set([
    'YTD-RICH-GRID-ROW',
    'YTD-RICH-GRID-RENDERER',
    'YTD-RICH-ITEM-RENDERER',
    'YTD-RICH-SECTION-RENDERER',
    'YTD-CONTINUATION-ITEM-RENDERER',
    'YTD-VIDEO-RENDERER',
    'YTD-COMPACT-VIDEO-RENDERER',
    'YT-LOCKUP-VIEW-MODEL',
    'YTD-SHELF-RENDERER',
    'YTD-PLAYLIST-PANEL-RENDERER'
]);

const IGNORED_FEED_ZONE =
    '#preview, ytd-video-preview, #inline-preview-player, #movie_player, .html5-video-player, ' +
    '#ytc-streamer-box, #ytc-danmaku-container, ytd-moving-thumbnail-renderer, ' +
    '#comments, ytd-comments, #below, ytd-watch-metadata, #panels, ytd-engagement-panel-section-list-renderer, ytd-browse[hidden]';

function attachFeedObserver(container) {
    if (!container) return;
    if (feedObserver && feedObserverTarget === container) {
        scheduleFeedScan(container);
        return;
    }
    if (feedObserver) {
        feedObserver.disconnect();
        feedObserver = null;
        feedObserverTarget = null;
    }

    scheduleFeedScan(container);
    feedObserverTarget = container;
    feedObserver = new MutationObserver((mutations) => {
        if (!needsFeedObserver()) {
            syncFeedObserver();
            return;
        }
        let hasRelevantChanges = false;
        for (const mutation of mutations) {
            if (!mutation.addedNodes.length) continue;
            if (mutation.target.closest && mutation.target.closest(IGNORED_FEED_ZONE)) {
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    const tag = node.tagName ? node.tagName.toUpperCase() : '';
                    if (RELEVANT_FEED_TAGS.has(tag)) {
                        hasRelevantChanges = true;
                        break;
                    }
                    if (node.firstElementChild && node.querySelector && node.querySelector('ytd-rich-grid-row, ytd-rich-item-renderer, ytd-rich-section-renderer, ytd-compact-video-renderer, yt-lockup-view-model')) {
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
    });
    feedObserver.observe(container, { childList: true, subtree: true });
}

export function syncFeedObserver() {
    if (!needsFeedObserver()) {
        if (feedObserver) {
            feedObserver.disconnect();
            feedObserver = null;
            feedObserverTarget = null;
        }
        return;
    }

    if (isWatchRoute()) {
        const secondary = document.getElementById('secondary') || document.querySelector('ytd-watch-next-secondary-results-renderer, #related');
        if (secondary) attachFeedObserver(secondary);
        else whenElement('#secondary', () => {
            if (needsFeedObserver() && isWatchRoute()) {
                attachFeedObserver(document.getElementById('secondary'));
            }
        });
        return;
    }

    const target = document.getElementById('page-manager') || document.querySelector('ytd-page-manager') || document.body;
    if (target) attachFeedObserver(target);
    else whenElement('#page-manager', (el) => {
        if (needsFeedObserver() && !isWatchRoute()) attachFeedObserver(el);
    });
}

export function setupFeedShelvesObserver() {
    syncFeedObserver();
}
