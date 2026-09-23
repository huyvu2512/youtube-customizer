// ==========================================================================
// OPTIMIZATION SUBSYSTEM ENTRY POINT
// ==========================================================================
export * from './codecBlocker.js';
export * from './bgTabSaver.js';
export * from './chatMemoryGc.js';
export * from './audioOnly.js';
export * from './preventAutoPause.js';

import { initCodecBlocker } from './codecBlocker.js';
import { initBgTabSaver } from './bgTabSaver.js';
import { initChatMemoryGc } from './chatMemoryGc.js';
import { initAudioOnly } from './audioOnly.js';
import { initPreventAutoPause } from './preventAutoPause.js';

let isOptInitialized = false;

export function initOptimization() {
    initCodecBlocker();
    initBgTabSaver();
    initChatMemoryGc();
    initAudioOnly();
    initPreventAutoPause();
    isOptInitialized = true;
}
