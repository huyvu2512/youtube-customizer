// ==========================================================================
// DISABLE VIDEO CHAPTERS (TẮT CHIA ĐOẠN VIDEO & GỘP SÓNG HEATMAP LIỀN MẠCH)
// ==========================================================================
import { currentConfig } from '../core/config.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const HEATMAP_GRADIENT_ID = 'ytc-heat-map-gradient-def';
const HEATMAP_CLIP_ID = 'ytc-heat-map-clip';
const HEATMAP_DEFAULT_MIN_DP = 0;
const HEATMAP_DEFAULT_MAX_DP = 60;

let chaptersHooked = false;
let cachedWatchHeatmap = null; // Lưu duy nhất heatmap của video Watch hiện tại (<2 KB)
let heatmapObserver = null;
let observedHeatmapContainer = null;
let isSyncingUnifiedHeatmap = false;

function isChapterEntityKey(key) {
    if (typeof key !== 'string' || !key) return false;
    if (/CHAPTERS/i.test(key)) return true;
    if (typeof atob !== 'function') return false;
    try {
        const decoded = atob(decodeURIComponent(key));
        return /CHAPTERS/i.test(decoded);
    } catch (e) {
        return false;
    }
}

function cleanPlayerBar(playerBar) {
    if (!playerBar || typeof playerBar !== 'object') return false;
    let modified = false;

    const multi = playerBar.multiMarkersPlayerBarRenderer;
    if (multi && Array.isArray(multi.markersMap)) {
        const removedKeys = new Set();
        const filtered = [];

        for (const entry of multi.markersMap) {
            if (!entry || typeof entry !== 'object') {
                filtered.push(entry);
                continue;
            }
            const key = typeof entry.key === 'string' ? entry.key : '';
            const hasChaptersArray = Array.isArray(entry.value?.chapters);
            const isChapterKey = /CHAPTERS/i.test(key);

            if (hasChaptersArray || isChapterKey) {
                if (entry.value?.heatmap) {
                    // Bảo toàn heatmap nếu đi kèm cùng key chapter thay vì xóa cả entry
                    delete entry.value.chapters;
                    delete entry.value.onChapterRepeat;
                    filtered.push(entry);
                } else if (key) {
                    removedKeys.add(key);
                }
                modified = true;
            } else {
                filtered.push(entry);
            }
        }

        if (filtered.length !== multi.markersMap.length) {
            multi.markersMap = filtered;
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
    const removedKeys = new Set();
    let modified = false;

    if (Array.isArray(mutations)) {
        for (const mutation of mutations) {
            const markersList = mutation?.payload?.macroMarkersListEntity?.markersList;
            if (markersList?.markerType === 'MARKER_TYPE_TIMESTAMPS' && Array.isArray(markersList.markers) && markersList.markers.length > 0) {
                markersList.markers = [];
                if (typeof mutation.entityKey === 'string' && mutation.entityKey) {
                    removedKeys.add(mutation.entityKey);
                }
                modified = true;
            }
        }
    }

    const endpoints = root?.onResponseReceivedEndpoints;
    if (Array.isArray(endpoints)) {
        for (const ep of endpoints) {
            const cmd = ep?.loadMarkersCommand;
            if (!cmd || typeof cmd !== 'object') continue;
            if (Array.isArray(cmd.entityKeys)) {
                const nextEntityKeys = cmd.entityKeys.filter((k) => !removedKeys.has(k) && !isChapterEntityKey(k));
                if (nextEntityKeys.length !== cmd.entityKeys.length) {
                    cmd.entityKeys = nextEntityKeys;
                    modified = true;
                }
            }
            if (Array.isArray(cmd.visibleOnLoadKeys)) {
                const nextVisibleKeys = cmd.visibleOnLoadKeys.filter((k) => !removedKeys.has(k) && !isChapterEntityKey(k));
                if (nextVisibleKeys.length !== cmd.visibleOnLoadKeys.length) {
                    cmd.visibleOnLoadKeys = nextVisibleKeys;
                    modified = true;
                }
            }
        }
    }

    return modified;
}

/**
 * Loại bỏ dữ liệu chia đoạn (chapters) khỏi phản hồi WatchNext / ytInitialData
 * để YouTube chỉ dựng một thanh tiến trình và sóng heatmap liền mạch duy nhất.
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

function getCurrentWatchVideoId() {
    if (typeof location === 'undefined' || !location.pathname?.startsWith('/watch')) return '';
    try {
        return new URLSearchParams(location.search || '').get('v') || '';
    } catch (e) {
        return '';
    }
}

function extractWatchVideoId(data) {
    if (!data || typeof data !== 'object') return '';
    const candidates = [data, data.response, data.pageData, data.pageData?.response];
    for (const root of candidates) {
        const vid = root?.currentVideoEndpoint?.watchEndpoint?.videoId
            || root?.endpoint?.watchEndpoint?.videoId;
        if (typeof vid === 'string' && vid) return vid;
    }
    return '';
}

function extractHeatmapSpecFromData(data) {
    if (!data || typeof data !== 'object') return null;
    const candidates = [data, data.response, data.pageData, data.pageData?.response];
    for (const root of candidates) {
        if (!root || typeof root !== 'object') continue;

        const mutations = root.frameworkUpdates?.entityBatchUpdate?.mutations;
        if (Array.isArray(mutations)) {
            for (const mutation of mutations) {
                const list = mutation?.payload?.macroMarkersListEntity?.markersList;
                if (list?.markerType === 'MARKER_TYPE_HEATMAP' && Array.isArray(list.markers) && list.markers.length > 0) {
                    const meta = list.markersMetadata?.heatmapMetadata;
                    return {
                        minHeightDp: Number(meta?.minHeightDp ?? HEATMAP_DEFAULT_MIN_DP),
                        maxHeightDp: Number(meta?.maxHeightDp ?? HEATMAP_DEFAULT_MAX_DP),
                        markers: list.markers.map((m) => Number(m?.intensityScoreNormalized ?? 0))
                    };
                }
            }
        }

        const decorated = root.playerOverlays?.playerOverlayRenderer?.decoratedPlayerBarRenderer;
        const playerBar = decorated?.decoratedPlayerBarRenderer?.playerBar || decorated?.playerBar;
        const markersMap = playerBar?.multiMarkersPlayerBarRenderer?.markersMap;
        if (Array.isArray(markersMap)) {
            for (const entry of markersMap) {
                const renderer = entry?.value?.heatmap?.heatmapRenderer;
                if (Array.isArray(renderer?.heatMarkers) && renderer.heatMarkers.length > 0) {
                    return {
                        minHeightDp: Number(renderer.minHeightDp ?? HEATMAP_DEFAULT_MIN_DP),
                        maxHeightDp: Number(renderer.maxHeightDp ?? HEATMAP_DEFAULT_MAX_DP),
                        markers: renderer.heatMarkers.map((m) => Number(m?.heatMarkerRenderer?.heatMarkerIntensityScoreNormalized ?? 0))
                    };
                }
            }
        }
    }
    return null;
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function bezierControlPoint(p, prev, next, reverse = false) {
    const a = prev || p;
    const b = next || p;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return {
        x: p.x + (reverse ? -dx : dx) * 0.2,
        y: p.y + (reverse ? -dy : dy) * 0.2
    };
}

function serializeSmoothHeatmapPath(points) {
    if (!Array.isArray(points) || points.length === 0) return '';
    let path = '';
    for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        if (i === 0) {
            path += `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
        } else {
            const c1 = bezierControlPoint(points[i - 1], points[i - 2], pt, false);
            const c2 = bezierControlPoint(pt, points[i - 1], points[i + 1], true);
            path += ` C ${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
        }
    }
    return path;
}

/**
 * Dựng chuỗi SVG path `d` liền mạch từ danh sách điểm cường độ heatmap của YouTube.
 */
export function buildUnifiedHeatmapPathFromMarkers(markers, minHeightDp = 0, maxHeightDp = 60) {
    if (!Array.isArray(markers) || markers.length === 0) return '';
    const safeMax = maxHeightDp > 0 ? maxHeightDp : HEATMAP_DEFAULT_MAX_DP;
    const minPct = (minHeightDp / safeMax) * 100;
    const step = 1000 / markers.length;
    const points = [{ x: 0, y: 100 }];

    for (let i = 0; i < markers.length; i++) {
        const raw = markers[i];
        const score = typeof raw === 'number'
            ? raw
            : Number(raw?.intensityScoreNormalized ?? raw?.heatMarkerRenderer?.heatMarkerIntensityScoreNormalized ?? 0);
        const x = (i + 0.5) * step;
        const y = 100 - clamp(score * 100, minPct, 100);
        points.push({ x, y });
        if (i === markers.length - 1) {
            points.push({ x: 1000, y });
        }
    }

    points.push({ x: 1000, y: 100 });
    return serializeSmoothHeatmapPath(points);
}

function parsePathEndPoints(d) {
    if (typeof d !== 'string' || !d) return [];
    const pts = [];
    const tokens = d.match(/[MC]\s*[^MC]+/g) || [];
    for (const tok of tokens) {
        const nums = tok.slice(1).trim().split(/[\s,]+/).map(Number);
        if (tok[0] === 'M' && nums.length >= 2 && Number.isFinite(nums[0]) && Number.isFinite(nums[1])) {
            pts.push({ x: nums[0], y: nums[1] });
        } else if (tok[0] === 'C' && nums.length >= 6 && Number.isFinite(nums[4]) && Number.isFinite(nums[5])) {
            pts.push({ x: nums[4], y: nums[5] });
        }
    }
    return pts;
}

/**
 * Ghép các đoạn SVG heatmap rời rạc trong DOM thành một đường sóng SVG liền mạch
 * làm phương án dự phòng khi chưa trích xuất được raw heatMarkers.
 */
export function buildUnifiedHeatmapPathFromSegments(segments) {
    if (!Array.isArray(segments) || segments.length === 0) return '';
    const lastSeg = segments[segments.length - 1];
    const totalW = Math.max(Number(lastSeg.left || 0) + Number(lastSeg.width || 0), 1);
    const collected = [];

    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const nextSeg = segments[i + 1];
        const left = Number(seg.left || 0);
        const width = Number(seg.width || 0);
        const spanW = nextSeg ? Math.max(width, Number(nextSeg.left || 0) - left) : width;
        if (spanW <= 0) continue;

        const rawPts = parsePathEndPoints(seg.d);
        const interior = rawPts.filter((p) => {
            if ((p.x <= 0.1 || p.x >= 999.9) && Math.abs(p.y - 100) < 0.05) return false;
            return p.x > 0.1 && p.x < 999.9;
        });

        for (let j = 0; j < interior.length; j++) {
            const p = interior[j];
            // YouTube lặp lại điểm cuối đoạn trước ở đầu đoạn sau: bỏ điểm lặp đầu đoạn để tránh gãy sóng
            if (i > 0 && j === 0 && collected.length > 0 && Math.abs(collected[collected.length - 1].y - p.y) < 0.25) {
                continue;
            }
            const gx = ((left + (p.x / 1000) * spanW) / totalW) * 1000;
            if (collected.length > 0 && gx <= collected[collected.length - 1].x + 0.5) continue;
            collected.push({ x: clamp(gx, 0.5, 999.5), y: clamp(p.y, 0, 100) });
        }
    }

    if (collected.length === 0) return '';
    const unifiedPoints = [
        { x: 0, y: 100 },
        ...collected,
        { x: 1000, y: collected[collected.length - 1].y },
        { x: 1000, y: 100 }
    ];
    return serializeSmoothHeatmapPath(unifiedPoints);
}

function getActiveHeatmapSpec() {
    const currentVid = getCurrentWatchVideoId();
    if (cachedWatchHeatmap && (!currentVid || cachedWatchHeatmap.videoId === currentVid)) {
        return cachedWatchHeatmap.spec;
    }

    if (typeof window !== 'undefined' && window.ytInitialData) {
        const initVid = extractWatchVideoId(window.ytInitialData);
        if (!currentVid || !initVid || initVid === currentVid) {
            const spec = extractHeatmapSpecFromData(window.ytInitialData);
            if (spec) return spec;
        }
    }

    if (typeof document !== 'undefined') {
        const flexy = document.querySelector('ytd-watch-flexy');
        const flexyData = flexy?.data || flexy?.playerData;
        if (flexyData) {
            const flexyVid = flexy.getAttribute?.('video-id') || extractWatchVideoId(flexyData);
            if (!currentVid || !flexyVid || flexyVid === currentVid) {
                const spec = extractHeatmapSpecFromData(flexyData);
                if (spec) return spec;
            }
        }
    }

    return null;
}

function buildUnifiedHeatmapPathFromDom(nativeChapters) {
    const segments = [];
    for (const el of nativeChapters) {
        const left = parseFloat(el.style?.left || '0') || 0;
        const width = parseFloat(el.style?.width || '0') || el.getBoundingClientRect?.().width || 0;
        const modern = el.querySelector('.ytp-modern-heat-map');
        const classic = el.querySelector('.ytp-heat-map-path');
        const d = (modern?.getAttribute('d') || classic?.getAttribute('d') || '').trim();
        if (d) {
            segments.push({ left, width, d });
        }
    }
    return buildUnifiedHeatmapPathFromSegments(segments);
}

function isModernHeatmapMode(sampleEl) {
    const modern = sampleEl?.querySelector('.ytp-modern-heat-map');
    return Boolean(modern && modern.getAttribute('d') && modern.style?.display !== 'none');
}

function ensureSvgEl(tag, attrs = {}) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) {
        el.setAttribute(k, v);
    }
    return el;
}

function createUnifiedHeatmapNode(pathD, modernMode) {
    const wrapper = document.createElement('div');
    wrapper.className = 'ytp-heat-map-chapter ytc-unified-heatmap';
    wrapper.style.width = '100%';
    wrapper.style.left = '0px';

    const svg = ensureSvgEl('svg', {
        class: 'ytp-heat-map-svg',
        height: '100%',
        preserveAspectRatio: 'none',
        version: '1.1',
        viewBox: '0 0 1000 100',
        width: '100%'
    });

    const defs = ensureSvgEl('defs');
    const clipPath = ensureSvgEl('clipPath', { id: HEATMAP_CLIP_ID });
    const clipCurve = ensureSvgEl('path', {
        class: 'ytp-heat-map-path',
        d: modernMode ? '' : pathD,
        fill: 'white'
    });
    clipPath.appendChild(clipCurve);

    const grad = ensureSvgEl('linearGradient', {
        gradientUnits: 'userSpaceOnUse',
        id: HEATMAP_GRADIENT_ID,
        x1: '0%',
        x2: '0%',
        y1: '0%',
        y2: '100%'
    });
    grad.appendChild(ensureSvgEl('stop', { offset: '0%', 'stop-color': 'white', 'stop-opacity': '1' }));
    grad.appendChild(ensureSvgEl('stop', { offset: '100%', 'stop-color': 'white', 'stop-opacity': '0' }));
    defs.appendChild(clipPath);
    defs.appendChild(grad);
    svg.appendChild(defs);

    const graphRect = ensureSvgEl('rect', {
        class: 'ytp-heat-map-graph',
        'clip-path': `url(#${HEATMAP_CLIP_ID})`,
        fill: 'white',
        'fill-opacity': '0.4',
        height: '100%',
        width: '100%',
        x: '0',
        y: '0'
    });
    const hoverRect = ensureSvgEl('rect', {
        class: 'ytp-heat-map-hover',
        'clip-path': `url(#${HEATMAP_CLIP_ID})`,
        fill: 'white',
        'fill-opacity': '0.7',
        height: '100%',
        width: '100%',
        x: '0',
        y: '0'
    });
    const modernPath = ensureSvgEl('path', {
        class: 'ytp-modern-heat-map',
        d: modernMode ? pathD : '',
        fill: `url(#${HEATMAP_GRADIENT_ID})`,
        height: '100%',
        stroke: 'white',
        'stroke-opacity': '1',
        'stroke-width': '2px',
        width: '100%',
        x: '0',
        y: '0'
    });

    if (modernMode) {
        graphRect.style.display = 'none';
        hoverRect.style.display = 'none';
    } else {
        modernPath.style.display = 'none';
    }

    svg.appendChild(graphRect);
    svg.appendChild(hoverRect);
    svg.appendChild(modernPath);
    wrapper.appendChild(svg);
    return wrapper;
}

function updateUnifiedHeatmapNode(wrapper, pathD, modernMode) {
    const clipCurve = wrapper.querySelector('.ytp-heat-map-path');
    const graphRect = wrapper.querySelector('.ytp-heat-map-graph');
    const hoverRect = wrapper.querySelector('.ytp-heat-map-hover');
    const modernPath = wrapper.querySelector('.ytp-modern-heat-map');
    if (modernMode) {
        if (clipCurve) clipCurve.setAttribute('d', '');
        if (graphRect) graphRect.style.display = 'none';
        if (hoverRect) hoverRect.style.display = 'none';
        if (modernPath) {
            modernPath.style.display = '';
            modernPath.setAttribute('d', pathD);
        }
    } else {
        if (clipCurve) clipCurve.setAttribute('d', pathD);
        if (graphRect) graphRect.style.display = '';
        if (hoverRect) hoverRect.style.display = '';
        if (modernPath) {
            modernPath.style.display = 'none';
            modernPath.setAttribute('d', '');
        }
    }
}

function disconnectHeatmapObserver() {
    if (heatmapObserver) {
        heatmapObserver.disconnect();
        heatmapObserver = null;
    }
    observedHeatmapContainer = null;
}

function observeHeatmapContainer(container) {
    if (typeof MutationObserver !== 'function' || !container) return;
    if (observedHeatmapContainer === container && heatmapObserver) return;

    disconnectHeatmapObserver();
    observedHeatmapContainer = container;
    // Chỉ theo dõi childList trực tiếp của .ytp-heat-map-container (0% CPU trong lúc phát video)
    heatmapObserver = new MutationObserver(() => {
        if (isSyncingUnifiedHeatmap) return;
        syncDisableChaptersUI();
    });
    heatmapObserver.observe(container, { childList: true });
}

export function clearUnifiedHeatmap() {
    disconnectHeatmapObserver();
    if (typeof document === 'undefined') return;
    const containers = document.querySelectorAll('#movie_player .ytp-heat-map-container.ytc-unified-heatmap-active, #movie_player .ytp-heat-map-container');
    for (const container of containers) {
        container.classList?.remove('ytc-unified-heatmap-active');
        const unified = container.querySelector('.ytc-unified-heatmap');
        if (unified) unified.remove();
    }
}

/**
 * Đồng bộ trực tiếp sóng heatmap trên video đang phát để gộp thành 1 sóng liền mạch
 * ngay cả khi người dùng bật tùy chọn giữa chừng mà chưa F5 trang.
 */
export function syncDisableChaptersUI() {
    if (typeof document === 'undefined') return;
    const isWatch = typeof location !== 'undefined' && location.pathname?.startsWith('/watch');
    if (!currentConfig.disableChapters || !isWatch) {
        clearUnifiedHeatmap();
        return;
    }

    const container = document.querySelector('#movie_player .ytp-heat-map-container');
    if (!container) return;

    observeHeatmapContainer(container);

    const children = Array.from(container.children || []);
    const nativeChapters = children.filter(
        (el) => el.classList?.contains('ytp-heat-map-chapter') && !el.classList?.contains('ytc-unified-heatmap')
    );

    if (nativeChapters.length <= 1) {
        container.classList?.remove('ytc-unified-heatmap-active');
        const stale = container.querySelector('.ytc-unified-heatmap');
        if (stale) stale.remove();
        return;
    }

    const spec = getActiveHeatmapSpec();
    const pathD = spec
        ? buildUnifiedHeatmapPathFromMarkers(spec.markers, spec.minHeightDp, spec.maxHeightDp)
        : buildUnifiedHeatmapPathFromDom(nativeChapters);

    if (!pathD) return;

    const modernMode = isModernHeatmapMode(nativeChapters[0]);
    isSyncingUnifiedHeatmap = true;
    try {
        let unified = container.querySelector('.ytc-unified-heatmap');
        if (!unified) {
            unified = createUnifiedHeatmapNode(pathD, modernMode);
            container.appendChild(unified);
        } else {
            updateUnifiedHeatmapNode(unified, pathD, modernMode);
        }
        container.classList.add('ytc-unified-heatmap-active');
    } finally {
        isSyncingUnifiedHeatmap = false;
    }
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

    // 3. Chặn response.json() cho fetch /youtubei/v1/next hoặc /youtubei/v1/get_watch
    try {
        if (typeof window.Response !== 'undefined' && window.Response.prototype && typeof window.Response.prototype.json === 'function') {
            const origRespJson = window.Response.prototype.json;
            window.Response.prototype.json = function () {
                const promise = origRespJson.call(this);
                if (
                    currentConfig.disableChapters &&
                    typeof this.url === 'string' &&
                    (this.url.includes('/youtubei/v1/next') || this.url.includes('/youtubei/v1/get_watch'))
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

    // 4. Lưu cache heatmap nhẹ theo video hiện tại & dọn bổ sung trên các sự kiện điều hướng Polymer
    if (typeof document !== 'undefined') {
        document.addEventListener('yt-page-data-fetched', (evt) => {
            try {
                const pageData = evt?.detail?.pageData;
                const spec = extractHeatmapSpecFromData(pageData);
                if (spec) {
                    const vid = extractWatchVideoId(pageData) || getCurrentWatchVideoId();
                    cachedWatchHeatmap = { videoId: vid, spec };
                } else if (getCurrentWatchVideoId()) {
                    cachedWatchHeatmap = null;
                }

                if (currentConfig.disableChapters) {
                    stripChaptersFromWatchData(pageData);
                    if (window.ytInitialData) stripChaptersFromWatchData(window.ytInitialData);
                    const flexy = document.querySelector('ytd-watch-flexy');
                    if (flexy?.data) stripChaptersFromWatchData(flexy.data);
                }
            } catch (e) {}
        }, true);

        document.addEventListener('yt-navigate-start', () => {
            clearUnifiedHeatmap();
        }, true);
    }
}
