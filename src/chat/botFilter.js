// ==========================================================================
// BỘ LỌC BOT LIVE CHAT MẶC ĐỊNH CHO OVERLAY (DANMAKU & STREAMER BOX)
// ==========================================================================

const INVISIBLE_CHAR_REGEX = /[\u200B-\u200D\uFEFF]/g;

// Handle/tên kênh chính thức của các chatbot YouTube Live & bot relay phổ biến (O(1) Set lookup)
export const KNOWN_BOT_KEYS = new Set([
    'nightbot',
    'nightbottv',
    'streamelements',
    'streamelementsbot',
    'streamlabs',
    'streamlabsbot',
    'streamlabscloudbot',
    'streamlabschatbot',
    'fossabot',
    'botrix',
    'casterlabs',
    'botisimo',
    'restreambot',
    'phantombot',
    'moobot',
    'wizebot',
    'coebot',
    'deepbot',
    'ohbot',
    'scorpbot',
    'ankhbot',
    'stayhydratedbot',
    'streamerdotbot',
    'aleshaai'
]);

// Dịch vụ tích hợp bot/relay chỉ lọc khi tin nhắn mang vai trò Kiểm duyệt viên (Moderator)
export const MOD_ONLY_BOT_KEYS = new Set([
    'cloudbot',
    'soundalerts',
    'blerp',
    'streamloots',
    'streamerbot',
    'mixitup',
    'mixitupapp',
    'own3d',
    'own3dpro',
    'restream',
    'restreamio',
    'truffle'
]);

// Mẫu nhận diện tài khoản bot tùy chỉnh của kênh khi có huy hiệu Moderator
const MOD_BOT_BOUNDARY_REGEX = /^(?:\[?bot\]?[\s._\-:]|.*[\s._\-\[\(]bot(?:[\s._\-\]\)\d]|$))/i;
const MOD_BOT_CAMEL_REGEX = /[a-z0-9]Bot\d*$/;
const MOD_BOT_FUNCTIONAL_REGEX = /(?:^|(?:stream|chat|mod|auto|timer|alert|song|music|live|donate|help|helper|notice|news|rule|rules))bot\d*$/i;

/**
 * Chuẩn hóa tên tác giả (gỡ tiền tố `@`, ký tự vô hình, khoảng trắng thừa).
 */
export function normalizeChatAuthor(rawAuthor) {
    if (typeof rawAuthor !== 'string') return '';
    return rawAuthor
        .replace(INVISIBLE_CHAR_REGEX, '')
        .trim()
        .replace(/^@+/, '')
        .trim();
}

/**
 * Kiểm tra xem tác giả tin nhắn Live Chat có phải là chatbot tự động hay không.
 * - Luôn ẩn các bot phổ biến (Nightbot, StreamElements, Streamlabs, Fossabot, BotRix, Casterlabs...).
 * - Khi tài khoản là Moderator (`isMod = true`), ẩn thêm các dịch vụ bot/relay và tài khoản bot đặt tên riêng.
 */
export function isLiveChatBotAuthor(rawAuthor, isMod = false) {
    const clean = normalizeChatAuthor(rawAuthor);
    if (!clean) return false;

    const compactKey = clean.toLowerCase().replace(/[\s._\-]+/g, '');
    if (KNOWN_BOT_KEYS.has(compactKey)) {
        return true;
    }

    if (!isMod) {
        return false;
    }

    if (MOD_ONLY_BOT_KEYS.has(compactKey)) {
        return true;
    }

    return (
        MOD_BOT_BOUNDARY_REGEX.test(clean) ||
        MOD_BOT_CAMEL_REGEX.test(clean) ||
        MOD_BOT_FUNCTIONAL_REGEX.test(compactKey)
    );
}
