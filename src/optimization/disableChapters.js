// ==========================================================================
// DISABLE VIDEO CHAPTERS (TẮT CHIA ĐOẠN VIDEO TRÊN THANH TIẾN TRÌNH)
// ==========================================================================
import { currentConfig } from '../core/config.js';

let chaptersHooked = false;

function cleanPlayerBar(playerBar) {
    if (!playerBar || typeof playerBar !== 'object') return false;
    let modified = false;

    const multi = playerBar.multiMarkersPlayerBarRenderer;
    if (multi && Array.isArray(multi.markersMap)) {
        const removedKeys = new Set();
        const filtered = multi.markersMap.filter((entry) => {
            if (!entry || typeof entry !== 'object') return true;
            const key = typeof entry.key === 'string' ? entry.key : '';
            const hasChaptersArray = Array.isArray(entry.value?.chapters);
            const isChapterKey = /CHAPTERS/i.test(key);
            if (hasChaptersArray || isChapterKey) {
                if (key) removedKeys.add(key);
                return false;
            }
            return true;
        });
        if (filtered.length !== multi.markersMap.length) {
            multi.markersMap = filtered;
            modified = true;
        }
        if (multi.visibleOnLoad?.key && removedKeys.has(multi.visibleOnLoad.key)) {
            delete multi.visibleOnLoad;
            modified = true;
        }
    }

    const chaptered = playerBar.chapteredPlayerBarRenderer;
    if (chaptered && Array.isArray(chaptered.chapters) && chaptered.chapters.length > 0) {
        chaptered.chapters = [];
        modified = true;
    }

    return modified;
}

function cleanFrameworkEntities(root) {
    const mutations = root?.frameworkUpdates?.entityBatchUpdate?.mutations;
    if (!Array.isArray(mutations)) return false;

    let modified = false;
    for (const mutation of mutations) {
        const markersList = mutation?.payload?.macroMarkersListEntity?.markersList;
        if (markersList?.markerType === 'MARKER_TYPE_TIMESTAMPS' && Array.isArray(markersList.markers) && markersList.markers.length > 0) {
            markersList.markers = [];
            modified = true;
        }
    }
    return modified;
}

/**
 * Loại bỏ dữ liệu chia đoạn (chapters) khỏi phản hồi WatchNext / ytInitialData
 * để YouTube chỉ dựng một thanh tiến trình liền mạch duy nhất.
 */
export function stripChaptersFromWatchData(data) {
    if (!data || typeof data !== 'object') return false;
    let modified = false;

    const targets = [data, data.response, data.pageData, data.pageData?.response];
    for (const root of targets) {
        if (!root || typeof root !== 'object') continue;

        const decorated = root.playerOverlays?.playerOverlayRenderer?.decoratedPlayerBarRenderer;
        const playerBars = [
            decorated?.decoratedPlayerBarRenderer?.playerBar,
            decorated?.playerBar
        ];
        for (const bar of playerBars) {
            if (cleanPlayerBar(bar)) modified = true;
        }

        if (cleanFrameworkEntities(root)) modified = true;
    }

    return modified;
}

export function initDisableChaptersHook() {
    if (chaptersHooked) return;
    chaptersHooked = true;

    // 1. Dọn sớm window.ytInitialData nếu script chạy trước hoặc song song với trang
    try {
        const existingDesc = Object.getOwnPropertyDescriptor(window, 'ytInitialData');
        let _val = window.ytInitialData;
        if (_val && currentConfig.disableChapters) {
            stripChaptersFromWatchData(_val);
        }

        if (!existingDesc || existingDesc.configurable !== false) {
            Object.defineProperty(window, 'ytInitialData', {
                get() {
                    return existingDesc && existingDesc.get ? existingDesc.get.call(this) : _val;
                },
                set(newVal) {
                    if (currentConfig.disableChapters && newVal) {
                        try { stripChaptersFromWatchData(newVal); } catch (e) {}
                    }
                    if (existingDesc && existingDesc.set) {
                        existingDesc.set.call(this, newVal);
                    }
                    _val = newVal;
                },
                configurable: true,
                enumerable: true
            });
        }
    } catch (e) {}

    // 2. Chặn dữ liệu chuyển trang SPA qua JSON.parse (chi phí 0ms khi tính năng tắt)
    try {
        const origParse = JSON.parse;
        JSON.parse = function (text, reviver) {
            const res = origParse.call(this, text, reviver);
            if (
                currentConfig.disableChapters &&
                typeof text === 'string' &&
                text.length > 200 &&
                (
                    text.indexOf('multiMarkersPlayerBarRenderer') !== -1 ||
                    text.indexOf('chapteredPlayerBarRenderer') !== -1 ||
                    text.indexOf('MARKER_TYPE_TIMESTAMPS') !== -1
                )
            ) {
                try { stripChaptersFromWatchData(res); } catch (e) {}
            }
            return res;
        };
    } catch (e) {}

    // 3. Chặn response.json() cho fetch /youtubei/v1/next
    try {
        if (typeof window.Response !== 'undefined' && window.Response.prototype && typeof window.Response.prototype.json === 'function') {
            const origRespJson = window.Response.prototype.json;
            window.Response.prototype.json = function () {
                const promise = origRespJson.call(this);
                if (
                    currentConfig.disableChapters &&
                    typeof this.url === 'string' &&
                    this.url.includes('/youtubei/v1/next')
                ) {
                    return promise.then((res) => {
                        try { stripChaptersFromWatchData(res); } catch (e) {}
                        return res;
                    });
                }
                return promise;
            };
        }
    } catch (e) {}

    // 4. Dọn bổ sung ngay tại sự kiện Polymer yt-page-data-fetched
    if (typeof document !== 'undefined') {
        document.addEventListener('yt-page-data-fetched', (evt) => {
            if (!currentConfig.disableChapters) return;
            try {
                stripChaptersFromWatchData(evt?.detail?.pageData);
                if (window.ytInitialData) stripChaptersFromWatchData(window.ytInitialData);
            } catch (e) {}
        }, true);
    }
}
