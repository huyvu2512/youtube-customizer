import test from 'node:test';
import assert from 'node:assert/strict';
import { createNumpadSeekGate } from '../src/player/numpadSeekGate.js';

test('first Numpad seek dispatches immediately, then held repeats are rate limited', () => {
    const gate = createNumpadSeekGate(300);

    assert.equal(gate.shouldDispatch('forward', false, 1000), true);
    assert.equal(gate.shouldDispatch('forward', true, 1100), false);
    assert.equal(gate.shouldDispatch('forward', true, 1299), false);
    assert.equal(gate.shouldDispatch('forward', true, 1300), true);
});

test('changing seek direction dispatches immediately and keyup reset starts a new hold', () => {
    const gate = createNumpadSeekGate(300);

    assert.equal(gate.shouldDispatch('backward', false, 1000), true);
    assert.equal(gate.shouldDispatch('forward', true, 1050), true);
    assert.equal(gate.shouldDispatch('forward', true, 1100), false);
    gate.reset();
    assert.equal(gate.shouldDispatch('forward', true, 1150), true);
});
