import test from 'node:test';
import assert from 'node:assert/strict';
import { currentConfig } from '../src/core/config.js';
import { isLiveChatBotAuthor } from '../src/chat/botFilter.js';
import { extractMessageData, displayChatMessage } from '../src/chat/chatParser.js';
import { danmakuQueue, stopDanmakuScheduler } from '../src/chat/danmaku.js';

test('isLiveChatBotAuthor matches Nightbot and official YouTube Live chat bots regardless of mod badge', () => {
    const bots = [
        '@nightbot',
        'Nightbot',
        '@StreamElements',
        '@StreamElementsbot',
        '@Streamlabs',
        '@StreamlabsBot',
        'Streamlabs Cloudbot',
        'Streamlabs Chatbot',
        '@Fossabot',
        '@BotRix',
        '@casterlabs',
        'Botisimo',
        '@RestreamBot',
        '@PhantomBot',
        'Alesha AI'
    ];

    for (const handle of bots) {
        assert.equal(isLiveChatBotAuthor(handle, false), true, `Expected bot ${handle} (non-mod) to be hidden`);
        assert.equal(isLiveChatBotAuthor(handle, true), true, `Expected bot ${handle} (mod) to be hidden`);
    }
});

test('isLiveChatBotAuthor catches mod-scoped bot services and custom mod bots while sparing normal viewers/mods', () => {
    const modBots = [
        '@cloudbot',
        '@soundalerts',
        '@blerp',
        '@streamerbot',
        '@MixItUpApp',
        'OWN3D Pro',
        'MixiBot',
        'Pew_Bot',
        '[BOT] ThongBao',
        '@timerbot',
        '@streambot'
    ];

    for (const handle of modBots) {
        assert.equal(isLiveChatBotAuthor(handle, true), true, `Expected mod bot ${handle} to be hidden`);
    }

    const normalUsers = [
        ['@MinhAnh_1602', false],
        ['@qu2eZy', false],
        ['@robot99', false],
        ['@cloudbot', false],
        ['@MrRobot', true],
        ['@Abbot', true],
        ['@TuanAnh_Mod', true]
    ];

    for (const [handle, isMod] of normalUsers) {
        assert.equal(isLiveChatBotAuthor(handle, isMod), false, `Expected human ${handle} (mod=${isMod}) to stay visible`);
    }
});

test('extractMessageData filters Nightbot & bots while preserving regular viewer messages', () => {
    const createMsgNode = ({ id, author, msgHtml, isModBadge = false, authorTypeAttr = null }) => ({
        nodeType: 1,
        id,
        tagName: 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER',
        classList: { contains: () => false },
        getAttribute(name) {
            return name === 'author-type' ? authorTypeAttr : null;
        },
        querySelector(sel) {
            if (sel === '#author-name') return { textContent: author };
            if (sel === '#message') return { innerHTML: msgHtml, cloneNode: () => ({ querySelectorAll: () => [], innerHTML: msgHtml, textContent: msgHtml }) };
            if (isModBadge && sel.includes('moderator')) return { getAttribute: () => 'moderator' };
            return null;
        },
        querySelectorAll(sel) {
            if (sel.includes('yt-live-chat-author-badge-renderer') && isModBadge) {
                return [{
                    getAttribute: (attr) => (attr === 'type' ? 'moderator' : 'Moderator'),
                    querySelector: () => null
                }];
            }
            return [];
        }
    });

    const nightbotMsg = createMsgNode({
        id: 'bot-1',
        author: '@nightbot',
        msgHtml: 'Ghe Banh mi PewPew...',
        isModBadge: true
    });
    assert.equal(extractMessageData(nightbotMsg), null);

    const attrModBotMsg = createMsgNode({
        id: 'bot-2',
        author: '@StreamElements',
        msgHtml: 'Join our Discord!',
        isModBadge: false,
        authorTypeAttr: 'moderator'
    });
    assert.equal(extractMessageData(attrModBotMsg), null);

    const viewerMsg = createMsgNode({
        id: 'user-1',
        author: '@MinhAnh_1602',
        msgHtml: 'ao vchuong'
    });
    const parsed = extractMessageData(viewerMsg);
    assert.ok(parsed);
    assert.equal(parsed.author, 'MinhAnh_1602');
    assert.equal(parsed.messageHtml, 'ao vchuong');
});

test('displayChatMessage skips bot payloads even if sent directly via postMessage', () => {
    const prevOverlay = currentConfig.chatOverlay;
    const prevDoc = globalThis.document;
    const prevLoc = globalThis.location;

    const streamerMsgContainer = {
        children: [],
        scrollHeight: 0,
        scrollTop: 0,
        querySelector: () => null,
        appendChild(el) { this.children.push(el); }
    };
    const fakeStreamerBox = {
        style: {},
        parentElement: null,
        querySelector(sel) {
            return sel === '.ytc-box-messages' ? streamerMsgContainer : null;
        }
    };
    const fakePlayer = {
        querySelector: () => ({ paused: false }),
        appendChild(el) { el.parentElement = fakePlayer; }
    };

    globalThis.location = { pathname: '/watch' };
    globalThis.document = {
        documentElement: { setAttribute() {}, removeAttribute() {} },
        body: { setAttribute() {}, removeAttribute() {} },
        getElementById(id) {
            if (id === 'ytc-danmaku-container') return { style: {}, parentElement: fakePlayer };
            if (id === 'ytc-streamer-box') return fakeStreamerBox;
            return null;
        },
        querySelector(sel) {
            if (sel.includes('#movie_player')) return fakePlayer;
            if (sel === '#ytc-streamer-box .ytc-box-messages') return streamerMsgContainer;
            return null;
        }
    };

    try {
        stopDanmakuScheduler();
        currentConfig.chatOverlay = 'danmaku';
        displayChatMessage({
            id: 'direct-bot',
            author: 'nightbot',
            authorClass: 'mod',
            messageHtml: 'Timed promo spam'
        });
        assert.equal(danmakuQueue.length, 0);

        currentConfig.chatOverlay = 'streamer';
        displayChatMessage({
            id: 'direct-bot-2',
            author: 'BotRix',
            authorClass: 'mod',
            messageHtml: 'Subscribe alert'
        });
        assert.equal(streamerMsgContainer.children.length, 0);
    } finally {
        stopDanmakuScheduler();
        currentConfig.chatOverlay = prevOverlay;
        globalThis.document = prevDoc;
        globalThis.location = prevLoc;
    }
});
