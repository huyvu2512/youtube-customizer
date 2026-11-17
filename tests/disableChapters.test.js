import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { currentConfig, DEFAULT_CONFIG, applyConfigToRoot } from '../src/core/config.js';
import { stripChaptersFromWatchData, initDisableChaptersHook } from '../src/optimization/disableChapters.js';
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
});
