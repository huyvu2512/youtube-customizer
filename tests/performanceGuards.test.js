import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldShowLetterboxBackdrop } from '../src/player/letterboxBackdrop.js';
import { shouldThrottleRepeatSeek } from '../src/player/shortcuts.js';
import { isIgnoredPromoMutationNode } from '../src/features/promos.js';

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
    assert.equal(isIgnoredPromoMutationNode(createMockNode(null)), false);
});
