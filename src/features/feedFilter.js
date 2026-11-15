// ==========================================================================
// BỘ LỌC NỘI DUNG FEED (SHORTS, PLAYABLES, HỘI VIÊN, KHÁM PHÁ, CỘNG ĐỒNG)
// ==========================================================================
import { rafThrottle, whenElement } from '../core/utils.js';
import { currentConfig } from '../core/config.js';
import { applyHomeGridColumns, isHomeFeedPath } from './grid.js';

let feedObserver = null;
let feedObserverTarget = null;
let feedScanGeneration = 0;

const SECTION_HIDE_CLASSES = [
    'ytc-shelf-shorts',
    'ytc-shelf-playables',
    'ytc-shelf-ad',
    'ytc-shelf-members',
    'ytc-shelf-explore',
    'ytc-shelf-community',
    'ytc-shelf-mix',
    'ytc-shelf-promo'
];

const ITEM_HIDE_CLASSES = [
    'ytc-item-members',
    'ytc-item-mix',
    'ytc-item-ad',
    'ytc-item-community',
    'ytc-item-playables',
    'ytc-item-promo'
];

const HYDRATED_SECTION_SELECTOR =
    'ytd-rich-shelf-renderer, ytd-reel-shelf-renderer, grid-shelf-view-model, ' +
    'ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer, ytd-brand-video-singleton-renderer, ' +
    'ytd-post-renderer, ytd-backstage-post-renderer, ytd-backstage-post-thread-renderer, ' +
    'ytd-post-multi-image-renderer, ytd-poll-renderer, ' +
    'yt-chip-cloud-renderer, ytd-feed-filter-chip-bar-renderer, ' +
    'ytd-in-feed-survey-renderer, ytd-single-option-survey-renderer, ytd-inline-survey-renderer, ' +
    'ytd-mealbar-promo-renderer, yt-mealbar-promo-renderer, ' +
    'ytd-shelf-renderer, ytd-mini-game-card-view-model, yt-card-view-model, ' +
    'ytd-feed-nudge-renderer, ytd-item-section-renderer, ytd-rich-item-renderer, a[href]';

const HYDRATED_RICH_ITEM_SELECTOR =
    'yt-lockup-view-model, ytd-rich-grid-media, ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer, ' +
    'ytd-post-renderer, ytd-backstage-post-renderer, ytd-backstage-post-thread-renderer, ' +
    'ytd-radio-renderer, ytd-compact-radio-renderer, ytd-grid-radio-renderer, ' +
    'ytd-playlist-renderer, ytd-compact-playlist-renderer, ytd-mini-game-card-view-model, ' +
    'ytd-feed-nudge-renderer, ytd-in-feed-survey-renderer, ytd-single-option-survey-renderer, ' +
    'ytd-mealbar-promo-renderer, yt-mealbar-promo-renderer, a#thumbnail, a[href]';

const LOCKUP_CONTENT_SELECTOR =
    'a[href], #video-title, #title, #metadata, yt-lockup-metadata-view-model, ' +
    '.yt-lockup-metadata-view-model__title, yt-badge-view-model, ytd-badge-supported-renderer';

const FEED_WRAPPER_SELECTOR =
    'ytd-rich-section-renderer, ytd-rich-item-renderer, ytd-video-renderer, ' +
    'ytd-compact-video-renderer, yt-lockup-view-model, ytd-shelf-renderer, ' +
    'yt-chip-cloud-chip-renderer, ytd-radio-renderer, ytd-compact-radio-renderer, ' +
    'ytd-grid-radio-renderer, ytd-playlist-renderer, ytd-compact-playlist-renderer';

function syncClass(el, className, enabled) {
    const shouldHave = !!enabled;
    if (el.classList.contains(className) !== shouldHave) {
        el.classList.toggle(className, shouldHave);
    }
}

function clearClasses(el, classes) {
    for (const cls of classes) {
        if (el.classList.contains(cls)) {
            el.classList.remove(cls);
        }
    }
}

function queryAllIncluding(root, selector) {
    const list = Array.from(root.querySelectorAll(selector));
    if (root.matches?.(selector)) {
        list.unshift(root);
    }
    return list;
}

function getActiveFilterSignature() {
    const mask =
        (currentConfig.hideShorts ? 'S' : '') +
        (currentConfig.hidePlayables ? 'P' : '') +
        (currentConfig.hideMembersOnly ? 'M' : '') +
        (currentConfig.hideMixes ? 'X' : '') +
        (currentConfig.hideExploreTopics ? 'E' : '') +
        (currentConfig.hideCommunity ? 'C' : '') +
        (currentConfig.cleanSearch ? 'A' : '') +
        (currentConfig.autoDismissPromos ? 'D' : '');
    return `${feedScanGeneration}_${mask}`;
}

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

function hasAnyBadgeText(card, phrases) {
    const badgeAreas = card.querySelectorAll('#badges, ytd-badge-supported-renderer, #metadata-line, yt-badge-view-model');
    for (const area of badgeAreas) {
        const text = area.textContent || '';
        for (const phrase of phrases) {
            if (text.includes(phrase)) return true;
        }
    }
    return false;
}

const MEMBERS_TEXT_PHRASES = [
    'Ưu tiên hội viên',
    'ưu tiên hội viên',
    'Chỉ dành cho hội viên',
    'chỉ dành cho hội viên',
    'Members first',
    'Members only',
    'Members-only',
    'Early access'
];

function isMembersSection(sec) {
    if (sec.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], a[href*="/membership"], a[href*="/memberships"]')) {
        return true;
    }
    const text = sec.textContent || '';
    return (
        text.includes('lợi ích từ hội viên') ||
        text.includes('Ưu tiên hội viên') ||
        text.includes('ưu tiên hội viên') ||
        (text.includes('hội viên') && text.includes('YouTube chọn lọc')) ||
        text.includes('Get more from memberships') ||
        text.includes('Members only') ||
        text.includes('Members first')
    );
}

function isExploreSection(sec) {
    if (sec.querySelector('#chips, yt-chip-cloud-chip-renderer, yt-chip-cloud-renderer, ytd-feed-filter-chip-bar-renderer')) {
        return true;
    }
    const text = sec.textContent || '';
    return (
        text.includes('Khám phá các chủ đề') ||
        text.includes('Explore other topics') ||
        text.includes('Explore topics')
    );
}

function isMixSection(sec) {
    const titleEl = sec.querySelector('#title, #title-container, yt-formatted-string#title');
    const titleText = (titleEl ? titleEl.textContent : '') || '';
    return (
        titleText.includes('Danh sách kết hợp') ||
        titleText.includes('Mixes') ||
        titleText.includes('YouTube tạo danh sách phát này')
    );
}

function isMembersCard(card) {
    if (card.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], [aria-label*="hội viên" i], [aria-label*="Members" i]')) {
        return true;
    }
    return hasAnyBadgeText(card, MEMBERS_TEXT_PHRASES);
}

function isMixCard(card) {
    const tag = card.tagName ? card.tagName.toLowerCase() : '';
    if (
        tag === 'ytd-radio-renderer' ||
        tag === 'ytd-compact-radio-renderer' ||
        tag === 'ytd-grid-radio-renderer' ||
        tag === 'ytd-playlist-renderer' ||
        tag === 'ytd-compact-playlist-renderer'
    ) {
        return true;
    }
    if (card.querySelector('ytd-radio-renderer, ytd-compact-radio-renderer, ytd-playlist-renderer, ytd-compact-playlist-renderer, ytd-playlist-thumbnail, ytd-playlist-custom-thumbnail-renderer, a[href*="/playlist?list="], a[href*="list=RD"], a[href*="list=PL"], a[href*="list=OLAK5uy_"], a[href*="list=CL"]')) {
        return true;
    }
    const hasVideoDuration = !!card.querySelector('ytd-thumbnail-overlay-time-status-renderer, span.ytd-thumbnail-overlay-time-status-renderer');
    if (hasVideoDuration) return false;
    const titleOrBadge = card.querySelector('#video-title, #title, #metadata, yt-lockup-metadata-view-model') || card;
    const text = titleOrBadge.textContent || '';
    return (
        text.includes('Danh sách kết hợp') ||
        text.includes('YouTube tạo danh sách phát này') ||
        text.includes('Xem toàn bộ danh sách phát') ||
        text.includes('Xem toàn bộ khoá học') ||
        text.includes('Xem toàn bộ khóa học')
    );
}

function isSectionHydrated(sec) {
    return !!sec.querySelector(HYDRATED_SECTION_SELECTOR);
}

function isCardHydrated(card) {
    const tag = card.tagName ? card.tagName.toLowerCase() : '';
    if (tag === 'ytd-rich-item-renderer') {
        if (card.querySelector('ytd-ghost-grid-renderer')) return false;
        if (!card.querySelector(HYDRATED_RICH_ITEM_SELECTOR)) return false;
        // Đợi lockup bên trong dựng link/tiêu đề/badge trước khi chốt signature (trừ thẻ quảng cáo/bài viết)
        if (
            card.querySelector('yt-lockup-view-model') &&
            !card.querySelector('ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer, .badge-style-type-ad') &&
            !card.querySelector(LOCKUP_CONTENT_SELECTOR)
        ) {
            return false;
        }
        return true;
    }
    if (tag === 'yt-lockup-view-model') {
        return !!card.querySelector(LOCKUP_CONTENT_SELECTOR);
    }
    return true;
}

function evaluateSection(sec, sig) {
    if (!isSectionHydrated(sec)) {
        clearClasses(sec, SECTION_HIDE_CLASSES);
        return;
    }
    syncClass(sec, 'ytc-shelf-shorts', currentConfig.hideShorts && sec.querySelector('ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer, [is-shorts]'));
    syncClass(sec, 'ytc-shelf-playables', currentConfig.hidePlayables && sec.querySelector('[is-mini-game-card-shelf], ytd-mini-game-card-view-model, a[href*="playables"]'));
    syncClass(sec, 'ytc-shelf-ad', currentConfig.cleanSearch && sec.querySelector('ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer, ytd-brand-video-singleton-renderer'));
    syncClass(sec, 'ytc-shelf-members', currentConfig.hideMembersOnly && isMembersSection(sec));
    syncClass(sec, 'ytc-shelf-explore', currentConfig.hideExploreTopics && isExploreSection(sec));
    syncClass(sec, 'ytc-shelf-community', currentConfig.hideCommunity && sec.querySelector('ytd-post-renderer, ytd-backstage-post-renderer, ytd-backstage-post-thread-renderer, ytd-post-multi-image-renderer, ytd-poll-renderer'));
    syncClass(sec, 'ytc-shelf-mix', currentConfig.hideMixes && isMixSection(sec));
    syncClass(sec, 'ytc-shelf-promo', currentConfig.autoDismissPromos && sec.querySelector('ytd-in-feed-survey-renderer, ytd-single-option-survey-renderer, ytd-inline-survey-renderer, ytd-mealbar-promo-renderer, yt-mealbar-promo-renderer'));
    sec.setAttribute('data-ytc-feed-sig', sig);
}

function evaluateCard(card, sig) {
    const outerRichItem = card.tagName && card.tagName.toLowerCase() !== 'ytd-rich-item-renderer'
        ? card.closest?.('ytd-rich-item-renderer')
        : null;

    // Phần tử con nằm trong ytd-rich-item-renderer do thẻ cha kiểm soát đồng bộ để tránh tạo ô trống trên lưới
    if (outerRichItem) {
        clearClasses(card, ITEM_HIDE_CLASSES);
        if (outerRichItem.getAttribute('data-ytc-feed-sig') === sig) {
            card.setAttribute('data-ytc-feed-sig', sig);
        }
        return;
    }

    if (!isCardHydrated(card)) {
        clearClasses(card, ITEM_HIDE_CLASSES);
        return;
    }

    syncClass(card, 'ytc-item-members', currentConfig.hideMembersOnly && isMembersCard(card));
    syncClass(card, 'ytc-item-mix', currentConfig.hideMixes && isMixCard(card));
    syncClass(card, 'ytc-item-ad', currentConfig.cleanSearch && card.querySelector('ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer, .badge-style-type-ad'));
    syncClass(card, 'ytc-item-playables', currentConfig.hidePlayables && card.querySelector('[is-mini-game-card-shelf], ytd-mini-game-card-view-model, a[href*="playables"]'));
    syncClass(card, 'ytc-item-community', currentConfig.hideCommunity && card.querySelector('ytd-post-renderer, ytd-backstage-post-renderer, ytd-backstage-post-thread-renderer'));
    syncClass(card, 'ytc-item-promo', currentConfig.autoDismissPromos && card.querySelector('ytd-in-feed-survey-renderer, ytd-single-option-survey-renderer, ytd-mealbar-promo-renderer, yt-mealbar-promo-renderer'));
    card.setAttribute('data-ytc-feed-sig', sig);
}

export function scanAndTagFeedContent(scope) {
    if (!hasActiveFeedFilters()) return;

    if (currentConfig.hideShorts || currentConfig.hidePlayables) {
        tagGuideEntries(document);
    }

    if (isWatchRoute() && !hasActiveWatchCardFilters()) return;

    const roots = getScanRoots(scope);
    if (!roots.length) return;

    const sig = getActiveFilterSignature();
    const staleSigSelector = `:not([data-ytc-feed-sig="${sig}"])`;

    for (const root of roots) {
        if (!root || !root.querySelectorAll) continue;

        const sections = queryAllIncluding(root, `ytd-rich-section-renderer${staleSigSelector}`);
        sections.forEach((sec) => evaluateSection(sec, sig));

        const richItems = queryAllIncluding(root, `ytd-rich-item-renderer${staleSigSelector}`);
        richItems.forEach((card) => evaluateCard(card, sig));

        const standaloneSelector =
            `ytd-video-renderer${staleSigSelector}, ytd-compact-video-renderer${staleSigSelector}, ` +
            `yt-lockup-view-model${staleSigSelector}, ytd-radio-renderer${staleSigSelector}, ` +
            `ytd-compact-radio-renderer${staleSigSelector}, ytd-grid-radio-renderer${staleSigSelector}, ` +
            `ytd-playlist-renderer${staleSigSelector}, ytd-compact-playlist-renderer${staleSigSelector}`;
        const standaloneCards = queryAllIncluding(root, standaloneSelector);
        standaloneCards.forEach((card) => evaluateCard(card, sig));

        if (currentConfig.hideMixes) {
            queryAllIncluding(root, `ytd-shelf-renderer${staleSigSelector}`).forEach((shelf) => {
                const titleEl = shelf.querySelector('#title, #title-container');
                const titleText = (titleEl ? titleEl.textContent : '') || '';
                syncClass(shelf, 'ytc-shelf-mix', titleText.includes('Danh sách kết hợp') || titleText.includes('Mixes'));
                shelf.setAttribute('data-ytc-feed-sig', sig);
            });

            queryAllIncluding(root, `yt-chip-cloud-chip-renderer${staleSigSelector}`).forEach((chip) => {
                const text = chip.textContent || '';
                syncClass(chip, 'ytc-chip-mix', text.includes('Danh sách kết hợp') || text.includes('Mixes'));
                chip.setAttribute('data-ytc-feed-sig', sig);
            });
        }
    }
}

export const scheduleFeedScan = rafThrottle((root) => {
    scanAndTagFeedContent(root);
    applyHomeGridColumns();
});

export function invalidateFeedScan(scope = document) {
    feedScanGeneration++;
    if (needsFeedObserver()) {
        scheduleFeedScan(scope);
    } else {
        applyHomeGridColumns();
    }
}

const RELEVANT_FEED_TAGS = new Set([
    'YTD-RICH-GRID-ROW',
    'YTD-RICH-GRID-RENDERER',
    'YTD-RICH-ITEM-RENDERER',
    'YTD-RICH-SECTION-RENDERER',
    'YTD-CONTINUATION-ITEM-RENDERER',
    'YTD-VIDEO-RENDERER',
    'YTD-COMPACT-VIDEO-RENDERER',
    'YT-LOCKUP-VIEW-MODEL',
    'YTD-RICH-GRID-MEDIA',
    'YTD-RICH-SHELF-RENDERER',
    'YTD-REEL-SHELF-RENDERER',
    'YTD-SHELF-RENDERER',
    'YTD-AD-SLOT-RENDERER',
    'YTD-IN-FEED-AD-LAYOUT-RENDERER',
    'YTD-MINI-GAME-CARD-VIEW-MODEL',
    'YTD-POST-RENDERER',
    'YTD-BACKSTAGE-POST-RENDERER',
    'YTD-BACKSTAGE-POST-THREAD-RENDERER',
    'YTD-IN-FEED-SURVEY-RENDERER',
    'YTD-SINGLE-OPTION-SURVEY-RENDERER',
    'YTD-INLINE-SURVEY-RENDERER',
    'YTD-PLAYLIST-PANEL-RENDERER',
    'YTD-BADGE-SUPPORTED-RENDERER',
    'YT-BADGE-VIEW-MODEL',
    'GRID-SHELF-VIEW-MODEL'
]);

const RELEVANT_DESCENDANT_SELECTOR =
    'ytd-rich-grid-row, ytd-rich-item-renderer, ytd-rich-section-renderer, ' +
    'ytd-compact-video-renderer, yt-lockup-view-model, ytd-ad-slot-renderer, ' +
    'ytd-rich-shelf-renderer, ytd-reel-shelf-renderer, ytd-post-renderer';

const IGNORED_FEED_ZONE =
    '#preview, ytd-video-preview, #inline-preview-player, #movie_player, .html5-video-player, ' +
    '#mouseover-overlay, #hover-overlays, yt-interaction, tp-yt-paper-ripple, tp-yt-paper-tooltip, ' +
    'yt-img-shadow, yt-image, ' +
    '#ytc-streamer-box, #ytc-danmaku-container, ytd-moving-thumbnail-renderer, ' +
    '#comments, ytd-comments, #below, ytd-watch-metadata, #panels, ytd-engagement-panel-section-list-renderer, ytd-browse[hidden]';

function markWrapperDirty(el) {
    if (!el || !el.closest) return;
    const wrapper = el.closest(FEED_WRAPPER_SELECTOR);
    if (!wrapper) return;
    wrapper.removeAttribute('data-ytc-feed-sig');
    const outerRich = wrapper.closest('ytd-rich-section-renderer, ytd-rich-item-renderer');
    if (outerRich && outerRich !== wrapper) {
        outerRich.removeAttribute('data-ytc-feed-sig');
    }
}

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
            const target = mutation.target;
            if (target?.closest && target.closest(IGNORED_FEED_ZONE)) {
                continue;
            }

            if (mutation.type === 'attributes') {
                const attr = mutation.attributeName;
                const targetTag = target?.tagName ? target.tagName.toUpperCase() : '';
                if (attr === 'continuation-is-reloading' && !target.hasAttribute('continuation-is-reloading')) {
                    feedScanGeneration++;
                    hasRelevantChanges = true;
                } else if (attr === 'hidden' && !target.hasAttribute('hidden')) {
                    if (targetTag === 'YTD-BROWSE' || targetTag === 'YTD-SEARCH') {
                        feedScanGeneration++;
                    } else {
                        markWrapperDirty(target);
                    }
                    hasRelevantChanges = true;
                } else if (attr === 'is-shorts' || attr === 'is-mini-game-card-shelf' || attr === 'is-post') {
                    markWrapperDirty(target);
                    hasRelevantChanges = true;
                }
                continue;
            }

            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                const insideWrapper = target?.closest?.(FEED_WRAPPER_SELECTOR);
                if (insideWrapper) {
                    markWrapperDirty(target);
                    hasRelevantChanges = true;
                    continue;
                }
            }

            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    const tag = node.tagName ? node.tagName.toUpperCase() : '';
                    if (RELEVANT_FEED_TAGS.has(tag)) {
                        hasRelevantChanges = true;
                        break;
                    }
                    if (node.firstElementChild && node.querySelector && node.querySelector(RELEVANT_DESCENDANT_SELECTOR)) {
                        hasRelevantChanges = true;
                        break;
                    }
                }
            }
        }
        if (hasRelevantChanges) {
            scheduleFeedScan(container);
        }
    });
    feedObserver.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['continuation-is-reloading', 'hidden', 'is-shorts', 'is-mini-game-card-shelf', 'is-post']
    });
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
