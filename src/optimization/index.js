// ==========================================================================
// OPTIMIZATION SUBSYSTEM ENTRY POINT
// ==========================================================================
export * from './codecBlocker.js';
export * from './chatMemoryGc.js';
export * from './audioOnly.js';
export * from './preventAutoPause.js';
export * from './disableChapters.js';

import { initCodecBlocker } from './codecBlocker.js';
import { initChatMemoryGc } from './chatMemoryGc.js';
import { initAudioOnly } from './audioOnly.js';
import { initPreventAutoPause } from './preventAutoPause.js';
import { initDisableChaptersHook } from './disableChapters.js';

let isOptInitialized = false;

export function initOptimization() {
    initCodecBlocker();
    initDisableChaptersHook();
    initChatMemoryGc();
    initAudioOnly();
    initPreventAutoPause();
    isOptInitialized = true;
}
