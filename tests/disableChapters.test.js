import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { currentConfig, DEFAULT_CONFIG, applyConfigToRoot } from '../src/core/config.js';
import {
    stripChaptersFromWatchData,
    initDisableChaptersHook,
    buildUnifiedHeatmapPathFromMarkers,
    buildUnifiedHeatmapPathFromSegments,
    syncDisableChaptersUI
} from '../src/optimization/disableChapters.js';
import { t, SUPPORTED_LANGUAGES } from '../src/core/i18n.js';

test('stripChaptersFromWatchData removes markersMap chapters and visibleOnLoad while preserving non-chapter markers and panels', () => {
    const data = {
        playerOverlays: {
            playerOverlayRenderer: {
                decoratedPlayerBarRenderer: {
                    decoratedPlayerBarRenderer: {
                        playerBar: {
                            multiMarkersPlayerBarRenderer: {
                                visibleOnLoad: { key: 'AUTO_CHAPTERS' },
                                markersMap: [
                                    { key: 'ANIMATION_ANNOTATION_MARKERS', value: { markers: [{ startMillis: '1000' }] } },
                                    { key: 'AUTO_CHAPTERS', value: { chapters: [{ title: { simpleText: 'Intro' } }] } },
                                    { key: 'DESCRIPTION_CHAPTERS', value: { chapters: [{ title: { simpleText: 'Part 1' } }] } }
                                ]
                            },
                            chapteredPlayerBarRenderer: {
                                chapters: [{ title: { simpleText: 'Legacy chapter' } }]
                            }
                        }
                    }
                }
            }
        },
        frameworkUpdates: {
            entityBatchUpdate: {
                mutations: [
                    {
                        entityKey: 'timestamps',
                        payload: {
                            macroMarkersListEntity: {
                                markersList: {
                                    markerType: 'MARKER_TYPE_TIMESTAMPS',
                                    markers: [{ startMillis: '0', durationMillis: '5000' }]
                                }
                            }
                        }
                    },
                    {
                        entityKey: 'heatmap',
                        payload: {
                            macroMarkersListEntity: {
                                markersList: {
                                    markerType: 'MARKER_TYPE_HEATMAP',
                                    markers: [{ startMillis: '0', intensityScoreNormalized: 0.8 }]
                                }
                            }
                        }
                    }
                ]
            }
        },
        engagementPanels: [{ engagementPanelSectionListRenderer: { panelIdentifier: 'engagement-panel-macro-markers-auto-chapters' } }]
    };

    const changed = stripChaptersFromWatchData(data);
    assert.equal(changed, true);

    const multi = data.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer;
    assert.equal(multi.visibleOnLoad, undefined);
    assert.deepEqual(multi.markersMap, [
        { key: 'ANIMATION_ANNOTATION_MARKERS', value: { markers: [{ startMillis: '1000' }] } }
    ]);
    assert.deepEqual(
        data.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.chapteredPlayerBarRenderer.chapters,
        []
    );
    assert.deepEqual(data.frameworkUpdates.entityBatchUpdate.mutations[0].payload.macroMarkersListEntity.markersList.markers, []);
    assert.equal(data.frameworkUpdates.entityBatchUpdate.mutations[1].payload.macroMarkersListEntity.markersList.markers.length, 1);
    assert.equal(data.engagementPanels.length, 1);
});

test('stripChaptersFromWatchData supports wrapped response objects and ignores null inputs', () => {
    assert.equal(stripChaptersFromWatchData(null), false);
    assert.equal(stripChaptersFromWatchData({}), false);

    const wrapped = {
        response: {
            playerOverlays: {
                playerOverlayRenderer: {
                    decoratedPlayerBarRenderer: {
                        decoratedPlayerBarRenderer: {
                            playerBar: {
                                multiMarkersPlayerBarRenderer: {
                                    markersMap: [{ key: 'CHAPTERS', value: { chapters: [{ title: { simpleText: 'Ch 1' } }] } }]
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    assert.equal(stripChaptersFromWatchData(wrapped), true);
    assert.deepEqual(
        wrapped.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap,
        []
    );
});

test('initDisableChaptersHook strips JSON.parse chapter data only when disableChapters is enabled', () => {
    const prevSetting = currentConfig.disableChapters;
    const prevWin = globalThis.window;
    const prevDoc = globalThis.document;
    globalThis.window = { Response: undefined };
    globalThis.document = undefined;

    try {
        initDisableChaptersHook();
        const payload = JSON.stringify({
            padding: 'x'.repeat(220),
            playerOverlays: {
                playerOverlayRenderer: {
                    decoratedPlayerBarRenderer: {
                        decoratedPlayerBarRenderer: {
                            playerBar: {
                                multiMarkersPlayerBarRenderer: {
                                    markersMap: [{ key: 'AUTO_CHAPTERS', value: { chapters: [{ title: { simpleText: 'A' } }] } }]
                                }
                            }
                        }
                    }
                }
            }
        });

        currentConfig.disableChapters = false;
        const untouched = JSON.parse(payload);
        assert.equal(
            untouched.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.length,
            1
        );

        currentConfig.disableChapters = true;
        const stripped = JSON.parse(payload);
        assert.equal(
            stripped.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.length,
            0
        );
    } finally {
        currentConfig.disableChapters = prevSetting;
        globalThis.window = prevWin;
        globalThis.document = prevDoc;
    }
});

test('disableChapters defaults to false, toggles root class, sits under preventAutoPause, and has all 20 translations', () => {
    assert.equal(DEFAULT_CONFIG.disableChapters, false);

    const prevDoc = globalThis.document;
    const prevSetting = currentConfig.disableChapters;
    const prevLang = currentConfig.language;
    const rootClasses = new Set();
    const bodyClasses = new Set();
    const mkList = (set) => ({
        toggle(cls, force) { force ? set.add(cls) : set.delete(cls); },
        contains(cls) { return set.has(cls); }
    });
    globalThis.document = {
        documentElement: { classList: mkList(rootClasses), setAttribute() {} },
        body: { classList: mkList(bodyClasses), setAttribute() {} }
    };

    try {
        currentConfig.disableChapters = true;
        applyConfigToRoot(false);
        assert.equal(rootClasses.has('ytc-disable-chapters'), true);
        assert.equal(bodyClasses.has('ytc-disable-chapters'), true);

        currentConfig.disableChapters = false;
        applyConfigToRoot(false);
        assert.equal(rootClasses.has('ytc-disable-chapters'), false);
        assert.equal(bodyClasses.has('ytc-disable-chapters'), false);

        for (const lang of SUPPORTED_LANGUAGES) {
            if (lang.code === 'auto') continue;
            currentConfig.language = lang.code;
            const label = t('disable_chapters');
            assert.notEqual(label, 'disable_chapters');
            assert.ok(label.length > 0);
        }
    } finally {
        currentConfig.disableChapters = prevSetting;
        currentConfig.language = prevLang;
        globalThis.document = prevDoc;
    }

    const panelSrc = fs.readFileSync(new URL('../src/ui/panel.js', import.meta.url), 'utf8');
    const optimizeStart = panelSrc.indexOf('id="ytc-pane-optimize"');
    const autoPausePos = panelSrc.indexOf('data-toggle="preventAutoPause"', optimizeStart);
    const chaptersPos = panelSrc.indexOf('data-toggle="disableChapters"', optimizeStart);
    const chatGcPos = panelSrc.indexOf('data-toggle="chatMemoryGc"', optimizeStart);
    assert.ok(optimizeStart !== -1 && autoPausePos > optimizeStart);
    assert.ok(chaptersPos > autoPausePos && chaptersPos < chatGcPos);

    const cssSrc = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
    assert.ok(cssSrc.includes('.ytp-exp-chapter-hover-effect'));
    assert.ok(cssSrc.includes('.ytp-heat-map-chapter.ytp-heatmap-hover'));
    assert.ok(cssSrc.includes('.ytp-progress-bar-snap .ytp-tooltip-bg'));
    assert.ok(cssSrc.includes('.ytc-unified-heatmap-active > .ytp-heat-map-chapter:not(.ytc-unified-heatmap)'));
});

test('stripChaptersFromWatchData preserves heatmap inside combined chapter entry and strips chapter keys from loadMarkersCommand', () => {
    const data = {
        playerOverlays: {
            playerOverlayRenderer: {
                decoratedPlayerBarRenderer: {
                    decoratedPlayerBarRenderer: {
                        playerBar: {
                            multiMarkersPlayerBarRenderer: {
                                visibleOnLoad: { key: 'AUTO_CHAPTERS' },
                                markersMap: [
                                    {
                                        key: 'AUTO_CHAPTERS',
                                        value: {
                                            chapters: [{ title: { simpleText: 'Part 1' } }],
                                            heatmap: { heatmapRenderer: { heatMarkers: [{ heatMarkerRenderer: { heatMarkerIntensityScoreNormalized: 0.5 } }] } }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        onResponseReceivedEndpoints: [
            {
                loadMarkersCommand: {
                    visibleOnLoadKeys: ['Eg1BVVRPX0NIQVBURVJTIJICKAE%3D', 'EgpIRUFUU0VFS0VSIJICKAE%3D'],
                    entityKeys: ['Eg1BVVRPX0NIQVBURVJTIJICKAE%3D', 'EgpIRUFUU0VFS0VSIJICKAE%3D']
                }
            }
        ]
    };

    assert.equal(stripChaptersFromWatchData(data), true);
    const multi = data.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer;
    assert.equal(multi.markersMap.length, 1);
    assert.equal(multi.markersMap[0].value.chapters, undefined);
    assert.ok(multi.markersMap[0].value.heatmap);
    const cmd = data.onResponseReceivedEndpoints[0].loadMarkersCommand;
    assert.deepEqual(cmd.visibleOnLoadKeys, ['EgpIRUFUU0VFS0VSIJICKAE%3D']);
    assert.deepEqual(cmd.entityKeys, ['EgpIRUFUU0VFS0VSIJICKAE%3D']);
});

test('buildUnifiedHeatmapPathFromMarkers and buildUnifiedHeatmapPathFromSegments produce continuous curves without midpoint drops to 100', () => {
    const pathFromMarkers = buildUnifiedHeatmapPathFromMarkers([0.2, 0.6, 0.8, 0.4], 0, 60);
    assert.ok(pathFromMarkers.startsWith('M 0.0,100.0 C '));
    assert.ok(pathFromMarkers.endsWith('1000.0,100.0'));
    assert.equal(pathFromMarkers.slice(12).includes(',100.0 C '), false);

    const pathFromSegments = buildUnifiedHeatmapPathFromSegments([
        { left: 0, width: 46, d: 'M 0.0,100.0 C 100.0,80.0 200.0,80.0 500.0,70.0 C 800.0,60.0 900.0,60.0 1000.0,100.0' },
        { left: 50, width: 50, d: 'M 0.0,100.0 C 10.0,80.0 50.0,70.0 100.0,70.0 C 300.0,50.0 400.0,50.0 600.0,45.0 C 800.0,50.0 900.0,50.0 1000.0,100.0' }
    ]);
    assert.ok(pathFromSegments.startsWith('M 0.0,100.0 C '));
    assert.ok(pathFromSegments.endsWith('1000.0,100.0'));
});

test('syncDisableChaptersUI mounts a unified heatmap element when multiple native chapter segments exist and removes it when disabled', () => {
    const prevDoc = globalThis.document;
    const prevLoc = globalThis.location;
    const prevSetting = currentConfig.disableChapters;

    function mkEl(tag, isSvg = false) {
        const el = {
            tagName: tag.toUpperCase(),
            isSvg,
            className: '',
            attrs: {},
            style: {},
            children: [],
            classList: {
                _set: new Set(),
                add(...c) { c.forEach((x) => this._set.add(x)); el.className = [...this._set].join(' '); },
                remove(...c) { c.forEach((x) => this._set.delete(x)); el.className = [...this._set].join(' '); },
                contains(c) { return this._set.has(c) || el.className.split(/\s+/).includes(c); }
            },
            setAttribute(k, v) {
                this.attrs[k] = String(v);
                if (k === 'class') {
                    this.className = String(v);
                    this.classList._set = new Set(this.className.split(/\s+/).filter(Boolean));
                }
            },
            getAttribute(k) { return this.attrs[k] ?? null; },
            appendChild(child) { child.parentNode = this; this.children.push(child); return child; },
            remove() {
                if (this.parentNode) {
                    this.parentNode.children = this.parentNode.children.filter((c) => c !== this);
                }
            },
            querySelector(sel) {
                const cls = sel.startsWith('.') ? sel.slice(1) : sel;
                for (const c of this.children) {
                    if (c.classList.contains(cls) || c.className.split(/\s+/).includes(cls)) return c;
                    const deep = c.querySelector(sel);
                    if (deep) return deep;
                }
                return null;
            }
        };
        return el;
    }

    const container = mkEl('div');
    for (const segSpec of [
        { left: '0px', width: '46px', d: 'M 0.0,100.0 C 100.0,80.0 200.0,80.0 500.0,60.0 C 800.0,60.0 900.0,60.0 1000.0,100.0' },
        { left: '50px', width: '50px', d: 'M 0.0,100.0 C 100.0,70.0 200.0,70.0 500.0,40.0 C 800.0,40.0 900.0,40.0 1000.0,100.0' }
    ]) {
        const ch = mkEl('div');
        ch.classList.add('ytp-heat-map-chapter');
        ch.style.left = segSpec.left;
        ch.style.width = segSpec.width;
        const path = mkEl('path', true);
        path.classList.add('ytp-modern-heat-map');
        path.setAttribute('d', segSpec.d);
        ch.appendChild(path);
        container.appendChild(ch);
    }

    globalThis.location = { pathname: '/watch', search: '?v=testvid123' };
    globalThis.document = {
        createElement: (tag) => mkEl(tag, false),
        createElementNS: (_ns, tag) => mkEl(tag, true),
        querySelector(sel) {
            return sel === '#movie_player .ytp-heat-map-container' ? container : null;
        },
        querySelectorAll(sel) {
            return sel.includes('.ytp-heat-map-container') ? [container] : [];
        }
    };

    try {
        currentConfig.disableChapters = true;
        syncDisableChaptersUI();
        assert.equal(container.classList.contains('ytc-unified-heatmap-active'), true);
        const unified = container.querySelector('.ytc-unified-heatmap');
        assert.ok(unified);
        const unifiedPath = unified.querySelector('.ytp-modern-heat-map');
        assert.ok(unifiedPath.getAttribute('d').startsWith('M 0.0,100.0 C '));

        currentConfig.disableChapters = false;
        syncDisableChaptersUI();
        assert.equal(container.classList.contains('ytc-unified-heatmap-active'), false);
        assert.equal(container.querySelector('.ytc-unified-heatmap'), null);
    } finally {
        currentConfig.disableChapters = prevSetting;
        globalThis.document = prevDoc;
        globalThis.location = prevLoc;
    }
});
