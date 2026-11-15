import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Tiny DOM harness to exercise real selector/observer paths of feedFilter.js in Node.
class MockClassList {
    constructor(el) {
        this.el = el;
        this.set = new Set();
    }
    _syncAttr() {
        if (this.set.size > 0) this.el.attributes.set('class', Array.from(this.set).join(' '));
        else this.el.attributes.delete('class');
    }
    add(...names) {
        for (const n of names) {
            if (n) this.set.add(n);
        }
        this._syncAttr();
    }
    remove(...names) {
        for (const n of names) this.set.delete(n);
        this._syncAttr();
    }
    toggle(name, force) {
        const next = force === undefined ? !this.set.has(name) : !!force;
        if (next) this.set.add(name);
        else this.set.delete(name);
        this._syncAttr();
        return next;
    }
    contains(name) {
        return this.set.has(name);
    }
}

class MockElement {
    constructor(tagName, { id = '', classes = [], attrs = {}, text = '' } = {}) {
        this.nodeType = 1;
        this.tagName = tagName.toUpperCase();
        this.parentNode = null;
        this.parentElement = null;
        this.children = [];
        this.isConnected = true;
        this._text = text;
        this.attributes = new Map();
        this.classList = new MockClassList(this);
        this.style = {
            _props: new Map(),
            setProperty(k, v) { this._props.set(k, v); },
            getPropertyValue(k) { return this._props.get(k) || ''; }
        };
        if (id) this.setAttribute('id', id);
        for (const cls of classes) this.classList.add(cls);
        for (const [k, v] of Object.entries(attrs)) {
            if (v !== null && v !== undefined) this.setAttribute(k, String(v));
        }
    }
    get id() {
        return this.attributes.get('id') || '';
    }
    get firstElementChild() {
        return this.children[0] || null;
    }
    get textContent() {
        if (!this.children.length) return this._text;
        return this._text + this.children.map((c) => c.textContent).join(' ');
    }
    set textContent(val) {
        this._text = String(val ?? '');
        this.children = [];
    }
    append(...nodes) {
        for (const node of nodes) {
            node.parentNode = this;
            node.parentElement = this;
            this.children.push(node);
        }
    }
    replaceChildren(...nodes) {
        this.children = [];
        this._text = '';
        this.append(...nodes);
    }
    setAttribute(k, v) {
        this.attributes.set(k, String(v));
    }
    getAttribute(k) {
        return this.attributes.has(k) ? this.attributes.get(k) : null;
    }
    hasAttribute(k) {
        return this.attributes.has(k);
    }
    removeAttribute(k) {
        this.attributes.delete(k);
    }
    matches(selectorList) {
        return splitTopLevel(selectorList, ',').some((sel) => matchesComplex(this, sel.trim()));
    }
    closest(selectorList) {
        let cur = this;
        while (cur && cur.nodeType === 1) {
            if (cur.matches(selectorList)) return cur;
            cur = cur.parentElement;
        }
        return null;
    }
    querySelectorAll(selectorList) {
        const out = [];
        const walk = (node) => {
            for (const child of node.children) {
                if (child.matches(selectorList)) out.push(child);
                walk(child);
            }
        };
        walk(this);
        return out;
    }
    querySelector(selectorList) {
        const walk = (node) => {
            for (const child of node.children) {
                if (child.matches(selectorList)) return child;
                const nested = walk(child);
                if (nested) return nested;
            }
            return null;
        };
        return walk(this);
    }
}

function splitTopLevel(str, delim) {
    const parts = [];
    let buf = '';
    let depthParen = 0;
    let depthBracket = 0;
    let quote = null;
    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (quote) {
            if (ch === quote) quote = null;
            buf += ch;
            continue;
        }
        if (ch === '"' || ch === "'") quote = ch;
        else if (ch === '(') depthParen++;
        else if (ch === ')') depthParen--;
        else if (ch === '[') depthBracket++;
        else if (ch === ']') depthBracket--;
        if (ch === delim && depthParen === 0 && depthBracket === 0) {
            if (buf.trim()) parts.push(buf.trim());
            buf = '';
        } else {
            buf += ch;
        }
    }
    if (buf.trim()) parts.push(buf.trim());
    return parts;
}

function matchesCompound(el, compound) {
    let rest = compound.trim();
    if (!rest) return false;

    // Leading tag name
    const tagMatch = rest.match(/^[a-zA-Z0-9_-]+/);
    if (tagMatch) {
        if (el.tagName.toLowerCase() !== tagMatch[0].toLowerCase()) return false;
        rest = rest.slice(tagMatch[0].length);
    }

    while (rest.length > 0) {
        if (rest.startsWith(':not(')) {
            let depth = 0;
            let end = -1;
            for (let i = 4; i < rest.length; i++) {
                if (rest[i] === '(') depth++;
                else if (rest[i] === ')') {
                    depth--;
                    if (depth === 0) {
                        end = i;
                        break;
                    }
                }
            }
            const inner = rest.slice(5, end);
            if (matchesCompound(el, inner)) return false;
            rest = rest.slice(end + 1);
            continue;
        }
        if (rest[0] === '#') {
            const m = rest.match(/^#([a-zA-Z0-9_-]+)/);
            if (!m || el.id !== m[1]) return false;
            rest = rest.slice(m[0].length);
            continue;
        }
        if (rest[0] === '.') {
            const m = rest.match(/^\.([a-zA-Z0-9_-]+)/);
            if (!m || !el.classList.contains(m[1])) return false;
            rest = rest.slice(m[0].length);
            continue;
        }
        if (rest[0] === '[') {
            const closeIdx = rest.indexOf(']');
            const body = rest.slice(1, closeIdx).trim();
            rest = rest.slice(closeIdx + 1);
            const caseInsensitive = /\s+i$/i.test(body);
            const cleanBody = caseInsensitive ? body.replace(/\s+i$/i, '').trim() : body;
            const opMatch = cleanBody.match(/^([a-zA-Z0-9_-]+)\s*(\^=|\*=|=)?\s*(?:"([^"]*)"|'([^']*)')?$/);
            if (!opMatch) return false;
            const attrName = opMatch[1];
            const op = opMatch[2];
            const expected = opMatch[3] ?? opMatch[4] ?? '';
            if (!el.hasAttribute(attrName)) return false;
            if (op) {
                let actual = el.getAttribute(attrName) || '';
                let exp = expected;
                if (caseInsensitive) {
                    actual = actual.toLowerCase();
                    exp = exp.toLowerCase();
                }
                if (op === '=' && actual !== exp) return false;
                if (op === '*=' && !actual.includes(exp)) return false;
                if (op === '^=' && !actual.startsWith(exp)) return false;
            }
            continue;
        }
        return false;
    }
    return true;
}

function matchesComplex(el, complex) {
    const tokens = splitTopLevel(complex, ' ');
    if (!tokens.length) return false;
    if (!matchesCompound(el, tokens[tokens.length - 1])) return false;
    let cur = el.parentElement;
    for (let i = tokens.length - 2; i >= 0; i--) {
        while (cur && !matchesCompound(cur, tokens[i])) {
            cur = cur.parentElement;
        }
        if (!cur) return false;
        cur = cur.parentElement;
    }
    return true;
}

function setupMockEnv() {
    const rafQueue = [];
    const observers = [];
    const html = new MockElement('html');
    const body = new MockElement('body');
    const pageManager = new MockElement('ytd-page-manager', { id: 'page-manager' });
    const browse = new MockElement('ytd-browse', { attrs: { 'page-subtype': 'home', role: 'main' } });
    const richGrid = new MockElement('ytd-rich-grid-renderer');
    const contents = new MockElement('div', { id: 'contents' });
    richGrid.append(contents);
    browse.append(richGrid);
    pageManager.append(browse);
    body.append(pageManager);
    html.append(body);

    const mockDoc = {
        documentElement: html,
        body,
        getElementById(id) {
            return id === 'page-manager' ? pageManager : this.querySelector(`#${id}`);
        },
        querySelector(sel) {
            return html.querySelector(sel);
        },
        querySelectorAll(sel) {
            return html.querySelectorAll(sel);
        }
    };

    class MockMutationObserver {
        constructor(cb) {
            this.cb = cb;
            this.disconnected = false;
            observers.push(this);
        }
        observe(target, opts) {
            this.target = target;
            this.opts = opts;
            this.disconnected = false;
        }
        disconnect() {
            this.disconnected = true;
        }
        trigger(records) {
            if (!this.disconnected) this.cb(records);
        }
    }

    globalThis.window = globalThis;
    globalThis.document = mockDoc;
    globalThis.location = { pathname: '/', href: 'https://www.youtube.com/', search: '' };
    globalThis.requestAnimationFrame = (cb) => {
        rafQueue.push(cb);
        return rafQueue.length;
    };
    globalThis.cancelAnimationFrame = () => {};
    globalThis.MutationObserver = MockMutationObserver;

    const flushRaf = () => {
        while (rafQueue.length) {
            const cb = rafQueue.shift();
            cb();
        }
    };

    return { contents, browse, richGrid, observers, flushRaf };
}

test('unhydrated skeleton wrappers do not lock data-ytc-feed-sig and tag cleanly once hydrated', async () => {
    const env = setupMockEnv();
    const { currentConfig } = await import('../src/core/config.js');
    const { scanAndTagFeedContent } = await import('../src/features/feedFilter.js');

    Object.assign(currentConfig, {
        columns: 4,
        hideShorts: true,
        hidePlayables: true,
        hideMembersOnly: true,
        hideMixes: true,
        hideExploreTopics: true,
        hideCommunity: true,
        cleanSearch: true,
        autoDismissPromos: false
    });

    const adSkeleton = new MockElement('ytd-rich-item-renderer');
    const adContent = new MockElement('div', { id: 'content' });
    adSkeleton.append(adContent);

    const shortsSkeleton = new MockElement('ytd-rich-section-renderer');
    const shortsContent = new MockElement('div', { id: 'content' });
    shortsSkeleton.append(shortsContent);

    const mixSkeleton = new MockElement('ytd-rich-item-renderer');
    const mixLockup = new MockElement('yt-lockup-view-model', {
        classes: ['ytLockupViewModelHost', 'ytLockupViewModelCollectionStack2', 'content-id-RD123']
    });
    mixSkeleton.append(new MockElement('div', { id: 'content' }));
    mixSkeleton.children[0].append(mixLockup);

    env.contents.append(adSkeleton, shortsSkeleton, mixSkeleton);

    // Phase 1: Skeleton wrappers present before Polymer hydrates inner content
    scanAndTagFeedContent(globalThis.document);
    assert.equal(adSkeleton.hasAttribute('data-ytc-feed-sig'), false);
    assert.equal(shortsSkeleton.hasAttribute('data-ytc-feed-sig'), false);
    assert.equal(mixSkeleton.hasAttribute('data-ytc-feed-sig'), false);

    // Phase 2: Async inner elements arrive inside the already-mounted wrappers
    adContent.append(new MockElement('ytd-ad-slot-renderer'));
    shortsContent.append(new MockElement('ytd-rich-shelf-renderer', { attrs: { 'is-shorts': '' } }));
    mixLockup.append(
        new MockElement('yt-collection-thumbnail-view-model'),
        new MockElement('a', { attrs: { href: '/watch?v=123&list=RD123' }, text: 'Mix - My Mix' })
    );

    scanAndTagFeedContent(globalThis.document);

    assert.equal(adSkeleton.classList.contains('ytc-item-ad'), true);
    assert.equal(shortsSkeleton.classList.contains('ytc-shelf-shorts'), true);
    assert.equal(mixSkeleton.classList.contains('ytc-item-mix'), true);
    assert.equal(mixLockup.classList.contains('ytc-item-mix'), false);
    assert.equal(adSkeleton.hasAttribute('data-ytc-feed-sig'), true);
    assert.equal(shortsSkeleton.hasAttribute('data-ytc-feed-sig'), true);
    assert.equal(mixSkeleton.hasAttribute('data-ytc-feed-sig'), true);
});

test('Polymer DOM recycling after Home logo click removes stale classes and hides newly recycled ads/shorts', async () => {
    const env = setupMockEnv();
    const { currentConfig } = await import('../src/core/config.js');
    const { scanAndTagFeedContent, invalidateFeedScan } = await import('../src/features/feedFilter.js');

    Object.assign(currentConfig, {
        columns: 4,
        hideShorts: true,
        hideMixes: true,
        cleanSearch: true,
        hideMembersOnly: true,
        hidePlayables: false,
        hideExploreTopics: false,
        hideCommunity: false,
        autoDismissPromos: false
    });

    // Slot 0 starts as normal video; Slot 1 starts as Mix; Section 2 starts as regular feed shelf
    const slot0 = new MockElement('ytd-rich-item-renderer');
    const slot0Content = new MockElement('div', { id: 'content' });
    const slot0Lockup = new MockElement('yt-lockup-view-model');
    slot0Lockup.append(new MockElement('a', { attrs: { href: '/watch?v=video1' }, text: 'Regular Video 1' }));
    slot0Content.append(slot0Lockup);
    slot0.append(slot0Content);

    const slot1 = new MockElement('ytd-rich-item-renderer');
    const slot1Content = new MockElement('div', { id: 'content' });
    const slot1Lockup = new MockElement('yt-lockup-view-model');
    slot1Lockup.append(new MockElement('a', { attrs: { href: '/playlist?list=RD999' }, text: 'Mix Playlist' }));
    slot1Content.append(slot1Lockup);
    slot1.append(slot1Content);

    const sec2 = new MockElement('ytd-rich-section-renderer');
    const sec2Content = new MockElement('div', { id: 'content' });
    sec2Content.append(new MockElement('ytd-rich-shelf-renderer'));
    sec2.append(sec2Content);

    env.contents.append(slot0, slot1, sec2);
    scanAndTagFeedContent(globalThis.document);

    assert.equal(slot0.classList.contains('ytc-item-ad'), false);
    assert.equal(slot1.classList.contains('ytc-item-mix'), true);
    assert.equal(sec2.classList.contains('ytc-shelf-shorts'), false);

    // Polymer soft-reloads Home (reuses slot0/slot1/sec2 elements in-place)
    slot0Content.replaceChildren(new MockElement('ytd-ad-slot-renderer'));
    const recycledLockup = new MockElement('yt-lockup-view-model');
    recycledLockup.append(new MockElement('a', { attrs: { href: '/watch?v=normal2' }, text: 'Normal Video 2' }));
    recycledLockup.append(new MockElement('ytd-thumbnail-overlay-time-status-renderer', { text: '12:34' }));
    slot1Content.replaceChildren(recycledLockup);
    sec2Content.replaceChildren(new MockElement('ytd-rich-shelf-renderer', { attrs: { 'is-shorts': '' } }));

    invalidateFeedScan(globalThis.document);
    env.flushRaf();

    assert.equal(slot0.classList.contains('ytc-item-ad'), true);
    assert.equal(slot1.classList.contains('ytc-item-mix'), false);
    assert.equal(sec2.classList.contains('ytc-shelf-shorts'), true);
});

test('enabling a feed filter in config re-evaluates previously scanned sections', async () => {
    const env = setupMockEnv();
    const { currentConfig } = await import('../src/core/config.js');
    const { scanAndTagFeedContent } = await import('../src/features/feedFilter.js');

    Object.assign(currentConfig, {
        columns: 4,
        hideShorts: false,
        hidePlayables: false,
        hideMembersOnly: false,
        hideMixes: false,
        hideExploreTopics: false,
        hideCommunity: false,
        cleanSearch: true,
        autoDismissPromos: false
    });

    const sec = new MockElement('ytd-rich-section-renderer');
    sec.append(new MockElement('ytd-rich-shelf-renderer', { attrs: { 'is-shorts': '' } }));
    env.contents.append(sec);

    scanAndTagFeedContent(globalThis.document);
    assert.equal(sec.classList.contains('ytc-shelf-shorts'), false);

    currentConfig.hideShorts = true;
    scanAndTagFeedContent(globalThis.document);
    assert.equal(sec.classList.contains('ytc-shelf-shorts'), true);
});

test('hideMembersOnly scans all yt-badge-view-model nodes even when an earlier badge is non-members', async () => {
    const env = setupMockEnv();
    const { currentConfig } = await import('../src/core/config.js');
    const { scanAndTagFeedContent } = await import('../src/features/feedFilter.js');

    Object.assign(currentConfig, {
        columns: 4,
        hideShorts: false,
        hidePlayables: false,
        hideMembersOnly: true,
        hideMixes: false,
        hideExploreTopics: false,
        hideCommunity: false,
        cleanSearch: false,
        autoDismissPromos: false
    });

    const card = new MockElement('ytd-rich-item-renderer');
    const lockup = new MockElement('yt-lockup-view-model');
    lockup.append(
        new MockElement('a', { attrs: { href: '/watch?v=mem1' }, text: 'Member Stream' }),
        new MockElement('yt-badge-view-model', { text: 'LIVE' }),
        new MockElement('yt-badge-view-model', { text: 'Chỉ dành cho hội viên' })
    );
    card.append(lockup);
    env.contents.append(card);

    scanAndTagFeedContent(globalThis.document);
    assert.equal(card.classList.contains('ytc-item-members'), true);
});

test('feed MutationObserver reacts to continuation-is-reloading and async ad slot insertion while ignoring hover overlays', async () => {
    const env = setupMockEnv();
    const { currentConfig } = await import('../src/core/config.js');
    const { syncFeedObserver } = await import('../src/features/feedFilter.js');

    Object.assign(currentConfig, {
        columns: 4,
        hideShorts: true,
        hideMixes: true,
        cleanSearch: true,
        hideMembersOnly: false,
        hidePlayables: false,
        hideExploreTopics: false,
        hideCommunity: false,
        autoDismissPromos: false
    });

    const card = new MockElement('ytd-rich-item-renderer');
    const content = new MockElement('div', { id: 'content' });
    const lockup = new MockElement('yt-lockup-view-model');
    const hoverOverlay = new MockElement('div', { id: 'mouseover-overlay' });
    lockup.append(new MockElement('a', { attrs: { href: '/watch?v=v1' }, text: 'Video 1' }), hoverOverlay);
    content.append(lockup);
    card.append(content);
    env.contents.append(card);

    syncFeedObserver();
    env.flushRaf();
    const obs = env.observers.at(-1);
    assert.ok(obs && !obs.disconnected);
    assert.equal(card.classList.contains('ytc-item-ad'), false);

    // Hover overlay mutation inside an already-scanned card should not dirty or re-scan the card
    const beforeSig = card.getAttribute('data-ytc-feed-sig');
    obs.trigger([
        { type: 'childList', target: hoverOverlay, addedNodes: [new MockElement('div')], removedNodes: [] }
    ]);
    assert.equal(card.getAttribute('data-ytc-feed-sig'), beforeSig);

    // Polymer replaces card contents in-place with an ad slot -> dirty + reschedule + hide outer wrapper
    const adNode = new MockElement('ytd-ad-slot-renderer');
    content.replaceChildren(adNode);
    obs.trigger([
        { type: 'childList', target: content, addedNodes: [adNode], removedNodes: [lockup] }
    ]);
    env.flushRaf();
    assert.equal(card.classList.contains('ytc-item-ad'), true);

    // Home logo click reloads grid using continuation-is-reloading toggle + updated slot
    content.replaceChildren(lockup);
    env.richGrid.removeAttribute('continuation-is-reloading');
    obs.trigger([
        { type: 'attributes', attributeName: 'continuation-is-reloading', target: env.richGrid, addedNodes: [], removedNodes: [] }
    ]);
    env.flushRaf();
    assert.equal(card.classList.contains('ytc-item-ad'), false);
    obs.disconnect();
});

test('Music tab single videos carrying list=RD...&start_radio=1 stay visible while real Mix shelves collapse cleanly', async () => {
    const env = setupMockEnv();
    const { currentConfig } = await import('../src/core/config.js');
    const { scanAndTagFeedContent } = await import('../src/features/feedFilter.js');

    Object.assign(currentConfig, {
        columns: 4,
        hideShorts: true,
        hidePlayables: true,
        hideMembersOnly: true,
        hideMixes: true,
        hideExploreTopics: true,
        hideCommunity: true,
        cleanSearch: true,
        autoDismissPromos: false
    });

    // Shelf 1: "Video nhạc hàng đầu" with single music videos having &list=RD...&start_radio=1
    const topMusicSection = new MockElement('ytd-rich-section-renderer');
    const topMusicShelf = new MockElement('ytd-rich-shelf-renderer');
    const topMusicContents = new MockElement('div', { id: 'contents' });

    const singleSongCard = new MockElement('ytd-rich-item-renderer');
    const singleSongLockup = new MockElement('yt-lockup-view-model', {
        classes: ['ytLockupViewModelHost', 'ytLockupViewModelVertical']
    });
    const thumb = new MockElement('yt-thumbnail-view-model');
    const badge = new MockElement('badge-shape', { text: '4:54' });
    thumb.append(badge);
    singleSongLockup.append(
        thumb,
        new MockElement('a', { attrs: { href: '/watch?v=QxXYWMIQAcQ&list=RDQxXYWMIQAcQ&start_radio=1&pp=oAcB' }, text: "Dangrangto - 'để dành cho em' (Visualizer)" })
    );
    singleSongCard.append(singleSongLockup);

    // Single live music video without numeric duration inside Music tab (still NOT a collection/Mix)
    const liveSongCard = new MockElement('ytd-rich-item-renderer');
    const liveSongLockup = new MockElement('yt-lockup-view-model', {
        classes: ['ytLockupViewModelHost', 'ytLockupViewModelVertical']
    });
    liveSongLockup.append(
        new MockElement('yt-thumbnail-view-model'),
        new MockElement('a', { attrs: { href: '/watch?v=live123&list=RDlive123&start_radio=1' }, text: 'Live Performance' })
    );
    liveSongCard.append(liveSongLockup);

    topMusicContents.append(singleSongCard, liveSongCard);
    topMusicShelf.append(topMusicContents);
    topMusicSection.append(topMusicShelf);

    // Shelf 2: "Tuyển tập nhạc của nghệ sĩ dành cho bạn" containing ONLY real Mix cards
    const artistMixSection = new MockElement('ytd-rich-section-renderer');
    const artistMixShelf = new MockElement('ytd-rich-shelf-renderer');
    const artistMixContents = new MockElement('div', { id: 'contents' });

    const realMixCard = new MockElement('ytd-rich-item-renderer');
    const realMixLockup = new MockElement('yt-lockup-view-model', {
        classes: ['ytLockupViewModelHost', 'ytLockupViewModelCollectionStack2', 'content-id-RD999']
    });
    realMixLockup.append(
        new MockElement('yt-collection-thumbnail-view-model'),
        new MockElement('a', { attrs: { href: '/watch?v=abc&list=RD999' }, text: 'Mix - Nghệ sĩ Việt' })
    );
    realMixCard.append(realMixLockup);
    artistMixContents.append(realMixCard);
    artistMixShelf.append(artistMixContents);
    artistMixSection.append(artistMixShelf);

    env.contents.append(topMusicSection, artistMixSection);
    scanAndTagFeedContent(globalThis.document);

    // Single songs on Music tab must NOT be hidden by hideMixes
    assert.equal(singleSongCard.classList.contains('ytc-item-mix'), false);
    assert.equal(liveSongCard.classList.contains('ytc-item-mix'), false);
    assert.equal(topMusicSection.classList.contains('ytc-shelf-empty'), false);

    // Real Mix card IS hidden and its now-empty shelf collapses so no orphan "Hiện thêm" bar stays visible
    assert.equal(realMixCard.classList.contains('ytc-item-mix'), true);
    assert.equal(artistMixSection.classList.contains('ytc-shelf-empty'), true);
});

test('styles.css reinforces flat ytd-rich-grid-renderer > #contents flex alignment and outer wrapper hide classes', () => {
    const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
    assert.match(css, /ytd-rich-grid-renderer\s*>\s*#contents\s*\{[\s\S]*display:\s*flex\s*!important;[\s\S]*flex-wrap:\s*wrap\s*!important;[\s\S]*justify-content:\s*flex-start\s*!important;/);
    assert.match(css, /\.ytc-hide-playables\s+ytd-rich-item-renderer\.ytc-item-playables/);
    assert.match(css, /\.ytc-auto-dismiss\s+ytd-rich-section-renderer\.ytc-shelf-promo/);
    assert.match(css, /\.ytc-auto-dismiss\s+ytd-rich-item-renderer\.ytc-item-promo/);
    assert.match(css, /ytd-rich-section-renderer\.ytc-shelf-empty/);
});
