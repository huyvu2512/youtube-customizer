// CẤU HÌNH & LƯU TRỮ (LOCALSTORAGE)
export const CONFIG_KEY = 'ytc_config_v2';

export const DEFAULT_CONFIG = {
    columns: 4,             // 3, 4 hoặc 5 cột (mặc định 4)
    hideShorts: true,       // Ẩn Shorts hoàn toàn
    hidePlayables: true,    // Ẩn Chơi game (Playables)
    hideMembersOnly: true,  // Ẩn mục video Hội viên
    hideExploreTopics: true,// Ẩn Khám phá các chủ đề khác
    hideCommunity: true,    // Ẩn bài đăng cộng đồng
    hideEndscreen: true,    // Ẩn thẻ kết thúc & chú thích
    autoDismissPromos: true,// Tự động đóng banner khuyến mại
    premiumLogo: true,      // Logo YouTube Premium
    cleanSearch: true,      // Ẩn video tài trợ / quảng cáo tìm kiếm
    disableAmbient: true,   // Tắt Ambient Mode (Cinematics)
    keyboardControls: true, // Phím tắt A-S-D & Numpad
};

export function loadConfig() {
    try {
        const stored = localStorage.getItem(CONFIG_KEY);
        return stored ? Object.assign({}, DEFAULT_CONFIG, JSON.parse(stored)) : Object.assign({}, DEFAULT_CONFIG);
    } catch (e) {
        return Object.assign({}, DEFAULT_CONFIG);
    }
}

export function saveConfig(cfg) {
    try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    } catch (e) {}
}

export const currentConfig = loadConfig();

let onApplyCallbacks = [];
export function registerOnApplyConfig(fn) {
    onApplyCallbacks.push(fn);
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
    root.classList.toggle('ytc-auto-dismiss', !!currentConfig.autoDismissPromos);
    root.classList.toggle('ytc-premium-logo', !!currentConfig.premiumLogo);
    root.classList.toggle('ytc-clean-search', !!currentConfig.cleanSearch);
    root.classList.toggle('ytc-disable-ambient', !!currentConfig.disableAmbient);
    root.setAttribute('data-ytc-cols', String(currentConfig.columns || 4));

    if (document.body) {
        document.body.classList.toggle('ytc-hide-shorts', !!currentConfig.hideShorts);
        document.body.classList.toggle('ytc-hide-playables', !!currentConfig.hidePlayables);
        document.body.classList.toggle('ytc-hide-members', !!currentConfig.hideMembersOnly);
        document.body.classList.toggle('ytc-hide-explore', !!currentConfig.hideExploreTopics);
        document.body.classList.toggle('ytc-hide-community', !!currentConfig.hideCommunity);
        document.body.classList.toggle('ytc-hide-endscreen', !!currentConfig.hideEndscreen);
        document.body.classList.toggle('ytc-auto-dismiss', !!currentConfig.autoDismissPromos);
        document.body.classList.toggle('ytc-premium-logo', !!currentConfig.premiumLogo);
        document.body.classList.toggle('ytc-clean-search', !!currentConfig.cleanSearch);
        document.body.classList.toggle('ytc-disable-ambient', !!currentConfig.disableAmbient);
        document.body.setAttribute('data-ytc-cols', String(currentConfig.columns || 4));
    }

    onApplyCallbacks.forEach(fn => fn());
}
