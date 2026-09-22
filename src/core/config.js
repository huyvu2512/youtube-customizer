// ==========================================================================
// CORE CONFIGURATION & STORAGE
// ==========================================================================
export { CONFIG_KEY } from './constants.js';
import { CONFIG_KEY } from './constants.js';

export const DEFAULT_CONFIG = {
    columns: 3,             // 3, 4 hoặc 5 cột (mặc định 3 theo chuẩn YouTube)
    hideShorts: false,      // Ẩn Shorts hoàn toàn (mặc định tắt)
    hidePlayables: false,   // Ẩn Chơi game (Playables) (mặc định tắt)
    hideMembersOnly: false, // Ẩn mục video Hội viên (mặc định tắt)
    hideExploreTopics: false,// Ẩn Khám phá các chủ đề khác (mặc định tắt)
    hideCommunity: false,   // Ẩn bài đăng cộng đồng (mặc định tắt)
    hideEndscreen: false,   // Ẩn thẻ kết thúc & chú thích (mặc định tắt)
    hideWatermark: false,   // Ẩn logo hình mờ kênh ở góc video (mặc định tắt)
    unlockLiveDvr: false,   // Mở khóa tua lại Live Stream (mặc định tắt)
    chatOverlay: 'off',     // 'off', 'danmaku', 'streamer' (luôn mặc định tắt)
    chatOverlayHideOnRewind: false, // Tự động ẩn khi tua về quá khứ (mặc định tắt)
    autoDismissPromos: false,// Tự động đóng banner khuyến mại & thông báo gián đoạn (mặc định tắt)
    autoLiveSync: false,    // Tự động giữ mốc trực tiếp khi xem Live Stream (mặc định tắt)
    premiumLogo: false,     // Logo YouTube Premium (mặc định tắt)
    cleanSearch: false,     // Ẩn video tài trợ / quảng cáo tìm kiếm (mặc định tắt)
    disableAmbient: false,  // Tắt Ambient Mode (Cinematics) (mặc định tắt)
    keyboardControls: false,// Phím tắt A-S-D & Numpad (mặc định tắt)
    hideNativeLiveChat: false, // Tự động ẩn khung trò chuyện trực tiếp mặc định (mặc định tắt)
    hideChatEmojis: false,     // Ẩn biểu tượng cảm xúc (Emoji/Sticker) trong Live Chat (mặc định tắt)
};

export function loadConfig() {
    try {
        const stored = localStorage.getItem(CONFIG_KEY)
            || localStorage.getItem('ytc_config_v2')
            || localStorage.getItem('ytc_config_persistent')
            || localStorage.getItem('ytc_config_v3');
        if (stored) {
            const parsed = JSON.parse(stored);
            const cfg = Object.assign({}, DEFAULT_CONFIG, parsed);
            cfg.chatOverlay = 'off'; // Chat luôn tắt khi mới vào trang / F5
            return cfg;
        }
    } catch (e) {}
    return Object.assign({}, DEFAULT_CONFIG);
}

export function saveConfig(cfg) {
    try {
        const toSave = Object.assign({}, cfg, { chatOverlay: 'off' });
        const json = JSON.stringify(toSave);
        localStorage.setItem(CONFIG_KEY, json);
        localStorage.setItem('ytc_config_v2', json);
    } catch (e) {}
}

export const currentConfig = loadConfig();

const configListeners = [];
export function onConfigChange(fn) {
    if (typeof fn === 'function' && !configListeners.includes(fn)) {
        configListeners.push(fn);
    }
}

export function applyConfigToRoot() {
    const root = document.documentElement;
    if (!root) return;

    root.classList.toggle('ytc-hide-shorts', !!currentConfig.hideShorts);
    root.classList.toggle('ytc-hide-playables', !!currentConfig.hidePlayables);
    root.classList.toggle('ytc-hide-members', !!currentConfig.hideMembersOnly);
    root.classList.toggle('ytc-hide-explore', !!currentConfig.hideExploreTopics);
    root.classList.toggle('ytc-hide-community', !!currentConfig.hideCommunity);
    root.classList.toggle('ytc-hide-endscreen', !!currentConfig.hideEndscreen);
    root.classList.toggle('ytc-hide-watermark', !!currentConfig.hideWatermark);
    root.classList.toggle('ytc-auto-dismiss', !!currentConfig.autoDismissPromos);
    root.classList.toggle('ytc-premium-logo', !!currentConfig.premiumLogo);
    root.classList.toggle('ytc-clean-search', !!currentConfig.cleanSearch);
    root.classList.toggle('ytc-disable-ambient', !!currentConfig.disableAmbient);
    root.classList.toggle('ytc-hide-native-chat', !!currentConfig.hideNativeLiveChat);
    root.setAttribute('data-ytc-cols', String(currentConfig.columns || 3));
    root.setAttribute('data-ytc-chat', currentConfig.chatOverlay || 'off');

    if (document.body) {
        document.body.classList.toggle('ytc-hide-shorts', !!currentConfig.hideShorts);
        document.body.classList.toggle('ytc-hide-playables', !!currentConfig.hidePlayables);
        document.body.classList.toggle('ytc-hide-members', !!currentConfig.hideMembersOnly);
        document.body.classList.toggle('ytc-hide-explore', !!currentConfig.hideExploreTopics);
        document.body.classList.toggle('ytc-hide-community', !!currentConfig.hideCommunity);
        document.body.classList.toggle('ytc-hide-endscreen', !!currentConfig.hideEndscreen);
        document.body.classList.toggle('ytc-hide-watermark', !!currentConfig.hideWatermark);
        document.body.classList.toggle('ytc-auto-dismiss', !!currentConfig.autoDismissPromos);
        document.body.classList.toggle('ytc-premium-logo', !!currentConfig.premiumLogo);
        document.body.classList.toggle('ytc-clean-search', !!currentConfig.cleanSearch);
        document.body.classList.toggle('ytc-disable-ambient', !!currentConfig.disableAmbient);
        document.body.classList.toggle('ytc-hide-native-chat', !!currentConfig.hideNativeLiveChat);
        document.body.setAttribute('data-ytc-cols', String(currentConfig.columns || 3));
        document.body.setAttribute('data-ytc-chat', currentConfig.chatOverlay || 'off');
    }

    configListeners.forEach(fn => {
        try { fn(currentConfig); } catch (e) {}
    });
}
