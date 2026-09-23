// ==========================================================================
// CODEC BLOCKER: BLOCK AV1 & FORCE HARDWARE-ACCELERATED H.264 / VP9
// ==========================================================================
import { currentConfig } from '../core/config.js';

let isHooked = false;

export function initCodecBlocker() {
    if (isHooked) return;
    isHooked = true;

    // 1. Hook MediaSource.isTypeSupported
    if (typeof window.MediaSource !== 'undefined' && typeof window.MediaSource.isTypeSupported === 'function') {
        const origIsTypeSupported = window.MediaSource.isTypeSupported.bind(window.MediaSource);
        window.MediaSource.isTypeSupported = function (type) {
            if (currentConfig.blockAv1 && typeof type === 'string') {
                const lower = type.toLowerCase();
                if (lower.includes('av01') || lower.includes('av1.')) {
                    return false;
                }
            }
            return origIsTypeSupported(type);
        };
    }

    // 2. Hook HTMLMediaElement.prototype.canPlayType
    if (typeof HTMLMediaElement !== 'undefined' && HTMLMediaElement.prototype) {
        const origCanPlayType = HTMLMediaElement.prototype.canPlayType;
        HTMLMediaElement.prototype.canPlayType = function (type) {
            if (currentConfig.blockAv1 && typeof type === 'string') {
                const lower = type.toLowerCase();
                if (lower.includes('av01') || lower.includes('av1.')) {
                    return '';
                }
            }
            return origCanPlayType.apply(this, arguments);
        };
    }

    // 3. Hook navigator.mediaCapabilities.decodingInfo
    if (navigator.mediaCapabilities && typeof navigator.mediaCapabilities.decodingInfo === 'function') {
        const origDecodingInfo = navigator.mediaCapabilities.decodingInfo.bind(navigator.mediaCapabilities);
        navigator.mediaCapabilities.decodingInfo = function (config) {
            if (currentConfig.blockAv1 && config && config.video && typeof config.video.contentType === 'string') {
                const lower = config.video.contentType.toLowerCase();
                if (lower.includes('av01') || lower.includes('av1.')) {
                    return Promise.resolve({
                        supported: false,
                        smooth: false,
                        powerEfficient: false
                    });
                }
            }
            return origDecodingInfo(config);
        };
    }
}
