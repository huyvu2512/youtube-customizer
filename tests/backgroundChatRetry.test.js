import test from 'node:test';
import assert from 'node:assert/strict';
import { getBackgroundChatRetryAction } from '../src/chat/backgroundChatRetry.js';

const defaults = { elapsedMs: 0, attempts: 1, retryAfterMs: 10000, maxAttempts: 3 };

test('keeps a responsive background chat iframe', () => {
    assert.equal(getBackgroundChatRetryAction({ ...defaults, ready: true }), 'keep');
});

test('waits before retrying an iframe that has not loaded chat items', () => {
    assert.equal(getBackgroundChatRetryAction({ ...defaults, ready: false, elapsedMs: 9999 }), 'wait');
});

test('retries an unresponsive iframe after the timeout, then stops at the attempt limit', () => {
    assert.equal(getBackgroundChatRetryAction({ ...defaults, ready: false, elapsedMs: 10000 }), 'retry');
    assert.equal(getBackgroundChatRetryAction({ ...defaults, ready: false, attempts: 3, elapsedMs: 20000 }), 'stop');
});
