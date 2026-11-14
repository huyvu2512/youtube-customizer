import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { shouldShowLetterboxBackdrop } from '../src/player/letterboxBackdrop.js';
import { shouldThrottleRepeatSeek } from '../src/player/shortcuts.js';
import { isIgnoredPromoMutationNode, shouldInspectPromoAddedNode } from '../src/features/promos.js';
import { currentConfig } from '../src/core/config.js';
import { hasActiveFeedFilters, hasActiveWatchCardFilters, needsFeedObserver } from '../src/features/feedFilter.js';

test('shouldShowLetterboxBackdrop disables backdrop for standard 16:9 ratio match', () => {
    assert.equal(shouldShowLetterboxBackdrop(1920, 1080, 1920, 1080), false);
    assert.equal(shouldShowLetterboxBackdrop(1280, 720, 1920, 1080), false);
});

test('shouldShowLetterboxBackdrop enables backdrop only when video and container aspect ratios differ significantly', () => {
    assert.equal(shouldShowLetterboxBackdrop(1080, 1920, 1920, 1080), true);
    assert.equal(shouldShowLetterboxBackdrop(1440, 1080, 1920, 1080), true);
    assert.equal(shouldShowLetterboxBackdrop(2560, 1080, 1920, 1080), true);
});

test('shouldShowLetterboxBackdrop returns false for invalid or zero dimensions', () => {
    assert.equal(shouldShowLetterboxBackdrop(0, 1080, 1920, 1080), false);
    assert.equal(shouldShowLetterboxBackdrop(1920, 0, 1920, 1080), false);
    assert.equal(shouldShowLetterboxBackdrop(1920, 1080, 0, 1080), false);
    assert.equal(shouldShowLetterboxBackdrop(1920, 1080, 1920, 0), false);
});

test('shouldThrottleRepeatSeek allows single key presses and throttles rapid held repeats', () => {
    assert.equal(shouldThrottleRepeatSeek(1000, 1000, false), false);
    assert.equal(shouldThrottleRepeatSeek(1020, 1000, false), false);
    assert.equal(shouldThrottleRepeatSeek(1050, 1000, true), true);
    assert.equal(shouldThrottleRepeatSeek(1084, 1000, true), true);
    assert.equal(shouldThrottleRepeatSeek(1085, 1000, true), false);
});

test('isIgnoredPromoMutationNode ignores high-frequency player tooltip, chrome, and bezel nodes', () => {
    const createMockNode = (matchedZone) => ({
        nodeType: 1,
        closest(selector) {
            return matchedZone && selector.includes(matchedZone) ? { matchedZone } : null;
        }
    });

    assert.equal(isIgnoredPromoMutationNode(createMockNode('.ytp-tooltip')), true);
    assert.equal(isIgnoredPromoMutationNode(createMockNode('.ytp-chrome-bottom')), true);
    assert.equal(isIgnoredPromoMutationNode(createMockNode('.ytp-bezel')), true);
    assert.equal(isIgnoredPromoMutationNode(createMockNode('ytd-live-chat-frame')), true);
    assert.equal(isIgnoredPromoMutationNode(createMockNode('ytd-engagement-panel-section-list-renderer')), true);
    assert.equal(isIgnoredPromoMutationNode(createMockNode('ytd-transcript-renderer')), true);
    assert.equal(isIgnoredPromoMutationNode(createMockNode('.ytp-heat-map-container')), true);
    assert.equal(isIgnoredPromoMutationNode({ nodeType: 1, id: 'below' }), true);
    assert.equal(isIgnoredPromoMutationNode(createMockNode(null)), false);
});

test('shouldInspectPromoAddedNode skips ordinary watch DOM nodes and accepts promo/interruption roots', () => {
    assert.equal(shouldInspectPromoAddedNode({ nodeType: 3 }), false);
    assert.equal(shouldInspectPromoAddedNode({ nodeType: 1, tagName: 'DIV', className: 'style-scope ytd-watch-flexy' }), false);
    assert.equal(shouldInspectPromoAddedNode({ nodeType: 1, tagName: 'YTD-COMMENT-THREAD-RENDERER', className: '' }), false);
    assert.equal(shouldInspectPromoAddedNode({ nodeType: 1, tagName: 'YTD-TRANSCRIPT-SEGMENT-RENDERER', className: '' }), false);

    assert.equal(shouldInspectPromoAddedNode({ nodeType: 1, tagName: 'SNACKBAR-CONTAINER', className: '' }), true);
    assert.equal(shouldInspectPromoAddedNode({ nodeType: 1, tagName: 'SNACKBAR-VIEW-MODEL', className: '' }), true);
    assert.equal(shouldInspectPromoAddedNode({ nodeType: 1, tagName: 'TP-YT-PAPER-TOAST', className: '' }), true);
    assert.equal(shouldInspectPromoAddedNode({ nodeType: 1, tagName: 'YTD-MEALBAR-PROMO-RENDERER', className: '' }), true);
    assert.equal(shouldInspectPromoAddedNode({ nodeType: 1, tagName: 'DIV', className: 'ytp-suggested-action-badge' }), true);
    assert.equal(shouldInspectPromoAddedNode({ nodeType: 1, tagName: 'DIV', id: 'toast', className: '' }), true);
});

test('needsFeedObserver stays idle on watch page and default home feed unless matching filters are enabled', () => {
    const snapshot = { ...currentConfig };
    try {
        Object.assign(currentConfig, {
            columns: 3,
            hideShorts: false,
            hidePlayables: false,
            hideMembersOnly: false,
            hideMixes: false,
            hideExploreTopics: false,
            hideCommunity: false,
            cleanSearch: false
        });
        assert.equal(hasActiveFeedFilters(), false);
        assert.equal(hasActiveWatchCardFilters(), false);
        assert.equal(needsFeedObserver('/watch'), false);
        assert.equal(needsFeedObserver('/'), false);

        currentConfig.hideShorts = true;
        assert.equal(needsFeedObserver('/watch'), false);
        assert.equal(needsFeedObserver('/'), true);

        currentConfig.hideShorts = false;
        currentConfig.hideMixes = true;
        assert.equal(needsFeedObserver('/watch'), true);

        currentConfig.hideMixes = false;
        currentConfig.columns = 4;
        assert.equal(needsFeedObserver('/'), true);
        assert.equal(needsFeedObserver('/watch'), false);
    } finally {
        Object.assign(currentConfig, snapshot);
    }
});

test('styles.css avoids expensive global :has(), comment content-visibility, and ambient CSS blur shaders', () => {
    const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
    assert.equal(css.includes(':has('), false);
    assert.equal(css.includes('ytd-comment-thread-renderer'), false);
    assert.equal(css.includes('mask-image'), false);
    assert.equal(/#ytc-ambient-spread-canvas[\s\S]{0,400}filter:\s*blur\(/i.test(css), false);
    assert.equal(/html\.ytc-ambient-lighting\s+#movie_player\s*\{[\s\S]{0,200}overflow:\s*hidden/i.test(css), false);
});
