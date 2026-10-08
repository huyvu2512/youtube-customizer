// ==========================================================================
// SETTINGS PANEL UI & MASTHEAD GEAR OBSERVER
// ==========================================================================
import { currentConfig, saveConfig, applyConfigToRoot } from '../core/config.js';
import { safeHTML, setElementHTML, whenElement, rafThrottle, hasLiveOrChatSupport, showToast } from '../core/utils.js';
import {
    APP_VERSION,
    GEAR_SVG,
    GRID_SVG,
    SHORTS_SVG,
    GAMEPAD_SVG,
    YOUTUBE_SVG,
    SEARCH_SVG,
    KEYBOARD_SVG,
    CROWN_SVG,
    COMPASS_SVG,
    LAYOUT_TAB_SVG,
    SHIELD_TAB_SVG,
    PLAYER_TAB_SVG,
    POST_SVG,
    ENDSCREEN_SVG,
    BELL_OFF_SVG,
    WATERMARK_SVG,
    REWIND_SVG,
    MESSAGE_SVG,
    RADIO_SVG,
    CHAT_OFF_SVG,
    EMOJI_OFF_SVG,
    OPTIMIZE_TAB_SVG,
    CPU_SVG,
    BROOM_SVG,
    HEADPHONES_SVG,
    INFINITY_SVG,
    SHIELD_CHECK_SVG,
    PLAYLIST_SVG,
    QUALITY_SVG,
    INFO_TAB_SVG,
    REFRESH_SVG,
    UPDATE_SVG,
    USER_SVG,
    BUG_SVG,
    GIFT_SVG,
    EXTERNAL_LINK_SVG,
    SHOPPING_SVG,
    AMBIENT_LIGHT_SVG
} from '../core/constants.js';
import { SUPPORTED_LANGUAGES, getLanguageInfo, t } from '../core/i18n.js';
import { syncPanelState } from './sync.js';
import { setupOnboardingAndUpdates, isNewerVersion } from './notifier.js';

export function updatePanelLanguage(targetPanel) {
    const panel = targetPanel || document.getElementById('ytc-settings-panel');
    if (!panel) return;

    panel.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        const translated = t(key);
        if (key === 'ambient_lighting' || el.querySelector('.ytc-star-badge')) {
            el.innerHTML = `${translated}<span class="ytc-star-badge" title="${t('special_feature')}">⭐</span>`;
        } else {
            el.textContent = translated;
        }
    });

    panel.querySelectorAll('[data-i18n-title]').forEach((el) => {
        const key = el.getAttribute('data-i18n-title');
        if (key) el.setAttribute('title', t(key));
    });

    const labelEl = document.getElementById('ytc-lang-current-label');
    const langInfo = getLanguageInfo(currentConfig.language || 'auto');
    if (labelEl) labelEl.textContent = langInfo.name;

    const qualityBadge = panel.querySelector('.ytc-quality-badge');
    if (qualityBadge) {
        const q = currentConfig.preferredQuality || 'auto';
        if (q === 'auto') qualityBadge.textContent = t('quality_auto').toUpperCase();
        else if (q === 'max') qualityBadge.textContent = t('quality_max').toUpperCase();
        else qualityBadge.textContent = q.toUpperCase();
    }
}

let menuDismissBound = false;
export function bindGlobalMenuDismiss() {
    if (menuDismissBound) return;
    menuDismissBound = true;

    document.addEventListener('click', (e) => {
        const panel = document.getElementById('ytc-settings-panel');
        if (panel && panel.classList.contains('open')) {
            if (!e.target.closest('#ytc-settings-panel') && !e.target.closest('#ytc-settings-btn')) {
                panel.classList.remove('open');
            }
        }

        const langMenu = document.getElementById('ytc-lang-menu');
        const langTrigger = document.getElementById('ytc-lang-trigger');
        if (langMenu && langMenu.classList.contains('open')) {
            if (!e.target.closest('#ytc-lang-menu') && !e.target.closest('#ytc-lang-trigger')) {
                langMenu.classList.remove('open');
                if (langTrigger) langTrigger.setAttribute('aria-expanded', 'false');
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const panel = document.getElementById('ytc-settings-panel');
            if (panel && panel.classList.contains('open')) {
                panel.classList.remove('open');
            }
            const langMenu = document.getElementById('ytc-lang-menu');
            if (langMenu && langMenu.classList.contains('open')) {
                langMenu.classList.remove('open');
                const trigger = document.getElementById('ytc-lang-trigger');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            }
        }
    });

    window.addEventListener('resize', () => {
        const panel = document.getElementById('ytc-settings-panel');
        const btn = document.getElementById('ytc-settings-btn');
        if (panel && panel.classList.contains('open') && btn) {
            const rect = btn.getBoundingClientRect();
            panel.style.top = (rect.bottom + 8) + 'px';
            panel.style.right = Math.max(12, window.innerWidth - rect.right - 10) + 'px';
        }
        const langMenu = document.getElementById('ytc-lang-menu');
        if (langMenu && langMenu.classList.contains('open')) {
            langMenu.classList.remove('open');
            const trigger = document.getElementById('ytc-lang-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
    }, { passive: true });
}

export function createSettingsPanel() {
    let panel = document.getElementById('ytc-settings-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'ytc-settings-panel';
        setElementHTML(panel, `
            <div class="ytc-header">
                <span>YouTube Customizer</span>
                <span class="ytc-header-badge">v${APP_VERSION}</span>
            </div>

            <div class="ytc-tabs">
                <button class="ytc-tab-btn active" data-tab="layout" data-i18n-title="tab_layout">
                    ${LAYOUT_TAB_SVG}
                    <span data-i18n="tab_layout">Giao diện</span>
                </button>
                <button class="ytc-tab-btn" data-tab="filter" data-i18n-title="tab_filter">
                    ${SHIELD_TAB_SVG}
                    <span data-i18n="tab_filter">Lọc</span>
                </button>
                <button class="ytc-tab-btn" data-tab="player" data-i18n-title="tab_player">
                    ${PLAYER_TAB_SVG}
                    <span data-i18n="tab_player">Trình phát</span>
                </button>
                <button class="ytc-tab-btn" data-tab="optimize" data-i18n-title="tab_optimize">
                    ${OPTIMIZE_TAB_SVG}
                    <span data-i18n="tab_optimize">Tối Ưu</span>
                </button>
                <button class="ytc-tab-btn" data-tab="info" data-i18n-title="tab_info">
                    ${INFO_TAB_SVG}
                    <span data-i18n="tab_info">Thông tin</span>
                </button>
            </div>

            <!-- TAB 1: GIAO DIỆN & BỐ CỤC -->
            <div class="ytc-tab-pane active" id="ytc-pane-layout">
                <div class="ytc-item" id="ytc-row-cols" data-i18n-title="home_cols">
                    <div class="ytc-item-left">
                        ${GRID_SVG}
                        <span data-i18n="home_cols">Số cột trang chủ</span>
                    </div>
                    <div class="ytc-cols-group">
                        <button class="ytc-col-btn ${currentConfig.columns === 3 ? 'active' : ''}" data-cols="3" title="3">3</button>
                        <button class="ytc-col-btn ${currentConfig.columns === 4 ? 'active' : ''}" data-cols="4" title="4">4</button>
                        <button class="ytc-col-btn ${currentConfig.columns === 5 ? 'active' : ''}" data-cols="5" title="5">5</button>
                    </div>
                </div>

                <div class="ytc-item" data-toggle="premiumLogo" data-i18n-title="premium_logo">
                    <div class="ytc-item-left">
                        ${YOUTUBE_SVG}
                        <span data-i18n="premium_logo">Logo Premium</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-logo">
                        <input type="checkbox" id="ytc-chk-logo" name="premiumLogo" aria-label="Logo Premium" ${currentConfig.premiumLogo ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="unlockLiveDvr" data-i18n-title="unlock_live_dvr">
                    <div class="ytc-item-left">
                        ${REWIND_SVG}
                        <span data-i18n="unlock_live_dvr">Mở khóa tua Live Stream</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-livedvr">
                        <input type="checkbox" id="ytc-chk-livedvr" name="unlockLiveDvr" aria-label="Mở khóa tua Live Stream" ${currentConfig.unlockLiveDvr ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="autoLiveSync" data-i18n-title="auto_live_sync">
                    <div class="ytc-item-left">
                        ${RADIO_SVG}
                        <span data-i18n="auto_live_sync">Tự động trực tiếp (Auto Live)</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-autolive">
                        <input type="checkbox" id="ytc-chk-autolive" name="autoLiveSync" aria-label="Tự động trực tiếp (Auto Live)" ${currentConfig.autoLiveSync ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="ambientLighting" data-i18n-title="ambient_lighting">
                    <div class="ytc-item-left">
                        ${AMBIENT_LIGHT_SVG}
                        <span data-i18n="ambient_lighting">Ánh sáng phòng (Ambilight)<span class="ytc-star-badge" title="Tính năng đặc biệt nổi bật">⭐</span></span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-ambient-light">
                        <input type="checkbox" id="ytc-chk-ambient-light" name="ambientLighting" aria-label="Ánh sáng phòng (Ambilight)" ${currentConfig.ambientLighting ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- CHỌN NGÔN NGỮ GIAO DIỆN SCRIPT (KHÔNG ICON, GIAO DIỆN NỔI ĐỘC LẬP) -->
                <div class="ytc-item ytc-item-lang" id="ytc-row-language" data-i18n-title="script_language">
                    <div class="ytc-item-left">
                        <span data-i18n="script_language">${t('script_language')}</span>
                    </div>
                    <div class="ytc-dropdown" id="ytc-lang-dropdown">
                        <button type="button" class="ytc-dropdown-trigger" id="ytc-lang-trigger" aria-haspopup="listbox" aria-expanded="false" data-i18n-title="script_language">
                            <span id="ytc-lang-current-label">${(getLanguageInfo(currentConfig.language || 'auto') || {}).name || 'Tự động'}</span>
                            <span class="ytc-dropdown-arrow">▾</span>
                        </button>
                    </div>
                </div>

                <div class="ytc-item" id="ytc-row-chatoverlay" data-i18n-title="live_chat">
                    <div class="ytc-item-left">
                        ${MESSAGE_SVG}
                        <span data-i18n="live_chat">Live Chat</span>
                    </div>
                    <div class="ytc-mode-group">
                        <button class="ytc-mode-btn ${(!currentConfig.chatOverlay || currentConfig.chatOverlay === 'off') ? 'active' : ''}" data-overlay="off" data-i18n="chat_off">Tắt</button>
                        <button class="ytc-mode-btn ${currentConfig.chatOverlay === 'danmaku' ? 'active' : ''}" data-overlay="danmaku" data-i18n="chat_danmaku">Ngang</button>
                        <button class="ytc-mode-btn ${currentConfig.chatOverlay === 'streamer' ? 'active' : ''}" data-overlay="streamer" data-i18n="chat_streamer">Nổi</button>
                    </div>
                </div>
            </div>

            <!-- TAB 2: LỌC NỘI DUNG SẠCH -->
            <div class="ytc-tab-pane" id="ytc-pane-filter">
                <div class="ytc-item" data-toggle="hideShorts" data-i18n-title="hide_shorts">
                    <div class="ytc-item-left">
                        ${SHORTS_SVG}
                        <span data-i18n="hide_shorts">Ẩn mục Shorts</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-shorts">
                        <input type="checkbox" id="ytc-chk-shorts" name="hideShorts" aria-label="Ẩn mục Shorts" ${currentConfig.hideShorts ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hidePlayables" data-i18n-title="hide_playables">
                    <div class="ytc-item-left">
                        ${GAMEPAD_SVG}
                        <span data-i18n="hide_playables">Ẩn mục Chơi game</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-playables">
                        <input type="checkbox" id="ytc-chk-playables" name="hidePlayables" aria-label="Ẩn mục Chơi game" ${currentConfig.hidePlayables ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideMembersOnly" data-i18n-title="hide_members">
                    <div class="ytc-item-left">
                        ${CROWN_SVG}
                        <span data-i18n="hide_members">Ẩn video Hội viên</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-members">
                        <input type="checkbox" id="ytc-chk-members" name="hideMembersOnly" aria-label="Ẩn video Hội viên" ${currentConfig.hideMembersOnly ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideCommunity" data-i18n-title="hide_community">
                    <div class="ytc-item-left">
                        ${POST_SVG}
                        <span data-i18n="hide_community">Ẩn bài đăng cộng đồng</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-community">
                        <input type="checkbox" id="ytc-chk-community" name="hideCommunity" aria-label="Ẩn bài đăng cộng đồng" ${currentConfig.hideCommunity ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="cleanSearch" data-i18n-title="clean_search">
                    <div class="ytc-item-left">
                        ${SEARCH_SVG}
                        <span data-i18n="clean_search">Lọc tìm kiếm sạch</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-search">
                        <input type="checkbox" id="ytc-chk-search" name="cleanSearch" aria-label="Lọc tìm kiếm sạch" ${currentConfig.cleanSearch ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideExploreTopics" data-i18n-title="hide_explore">
                    <div class="ytc-item-left">
                        ${COMPASS_SVG}
                        <span data-i18n="hide_explore">Ẩn Khám phá chủ đề</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-explore">
                        <input type="checkbox" id="ytc-chk-explore" name="hideExploreTopics" aria-label="Ẩn Khám phá chủ đề" ${currentConfig.hideExploreTopics ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideShopping" data-i18n-title="hide_shopping">
                    <div class="ytc-item-left">
                        ${SHOPPING_SVG}
                        <span data-i18n="hide_shopping">Ẩn sản phẩm gắn thẻ</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-shopping">
                        <input type="checkbox" id="ytc-chk-shopping" name="hideShopping" aria-label="Ẩn sản phẩm gắn thẻ" ${currentConfig.hideShopping ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideMixes" data-i18n-title="hide_mixes">
                    <div class="ytc-item-left">
                        ${PLAYLIST_SVG}
                        <span data-i18n="hide_mixes">Ẩn Danh sách phát & Mix</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-mixes">
                        <input type="checkbox" id="ytc-chk-mixes" name="hideMixes" aria-label="Ẩn Danh sách phát & Mix" ${currentConfig.hideMixes ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 3: TRÌNH PHÁT & VIDEO -->
            <div class="ytc-tab-pane" id="ytc-pane-player">
                <div class="ytc-item" data-toggle="hideEndscreen" data-i18n-title="hide_endscreen">
                    <div class="ytc-item-left">
                        ${ENDSCREEN_SVG}
                        <span data-i18n="hide_endscreen">Ẩn thẻ kết thúc/chú thích</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-endscreen">
                        <input type="checkbox" id="ytc-chk-endscreen" name="hideEndscreen" aria-label="Ẩn thẻ kết thúc/chú thích" ${currentConfig.hideEndscreen ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideWatermark" data-i18n-title="hide_watermark">
                    <div class="ytc-item-left">
                        ${WATERMARK_SVG}
                        <span data-i18n="hide_watermark">Ẩn logo góc video</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-watermark">
                        <input type="checkbox" id="ytc-chk-watermark" name="hideWatermark" aria-label="Ẩn logo góc video" ${currentConfig.hideWatermark ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="autoDismissPromos" data-i18n-title="auto_dismiss">
                    <div class="ytc-item-left">
                        ${BELL_OFF_SVG}
                        <span data-i18n="auto_dismiss">Tự đóng banner & thông báo</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-promos">
                        <input type="checkbox" id="ytc-chk-promos" name="autoDismissPromos" aria-label="Tự đóng banner & thông báo" ${currentConfig.autoDismissPromos ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideNativeLiveChat" data-i18n-title="hide_native_chat">
                    <div class="ytc-item-left">
                        ${CHAT_OFF_SVG}
                        <span data-i18n="hide_native_chat">Tắt trò chuyện trực tiếp</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-hidenativechat">
                        <input type="checkbox" id="ytc-chk-hidenativechat" name="hideNativeLiveChat" aria-label="Tắt trò chuyện trực tiếp" ${currentConfig.hideNativeLiveChat ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideChatEmojis" data-i18n-title="hide_chat_emojis">
                    <div class="ytc-item-left">
                        ${EMOJI_OFF_SVG}
                        <span data-i18n="hide_chat_emojis">Ẩn biểu tượng trong Live Chat</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-hidechatemojis">
                        <input type="checkbox" id="ytc-chk-hidechatemojis" name="hideChatEmojis" aria-label="Ẩn biểu tượng trong Live Chat" ${currentConfig.hideChatEmojis ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item ytc-item-link" id="ytc-btn-ublock" data-i18n-title="ublock_title">
                    <div class="ytc-item-left">
                        ${SHIELD_CHECK_SVG}
                        <span data-i18n="ublock_name">Chặn quảng cáo (uBlock)</span>
                    </div>
                    <div class="ytc-link-badge">
                        <span data-i18n="ublock_badge">Mở trang</span>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                    </div>
                </div>
            </div>

            <!-- TAB 4: TỐI ƯU HIỆU NĂNG & TIỆN ÍCH -->
            <div class="ytc-tab-pane" id="ytc-pane-optimize">
                <div class="ytc-item ytc-item-vertical" id="ytc-row-quality" data-i18n-title="video_quality">
                    <div class="ytc-item-header">
                        <div class="ytc-item-left">
                            ${QUALITY_SVG}
                            <span data-i18n="video_quality">Độ phân giải video</span>
                        </div>
                        <span class="ytc-quality-badge">${currentConfig.preferredQuality === 'auto' ? 'TỰ ĐỘNG' : (currentConfig.preferredQuality === 'max' ? 'CAO NHẤT' : currentConfig.preferredQuality.toUpperCase())}</span>
                    </div>
                    <div class="ytc-mode-group ytc-quality-group">
                        <button class="ytc-quality-btn ${(!currentConfig.preferredQuality || currentConfig.preferredQuality === 'auto') ? 'active' : ''}" data-quality="auto" data-i18n="quality_auto">Tự động</button>
                        <button class="ytc-quality-btn ${currentConfig.preferredQuality === 'max' ? 'active' : ''}" data-quality="max" data-i18n="quality_max">Cao nhất</button>
                        <button class="ytc-quality-btn ${currentConfig.preferredQuality === '1440p' ? 'active' : ''}" data-quality="1440p">2K</button>
                        <button class="ytc-quality-btn ${currentConfig.preferredQuality === '1080p' ? 'active' : ''}" data-quality="1080p">1080p</button>
                        <button class="ytc-quality-btn ${currentConfig.preferredQuality === '720p' ? 'active' : ''}" data-quality="720p">720p</button>
                    </div>
                </div>

                <div class="ytc-item" data-toggle="preventAutoPause" data-i18n-title="prevent_auto_pause">
                    <div class="ytc-item-left">
                        ${INFINITY_SVG}
                        <span data-i18n="prevent_auto_pause">Chặn tự dừng video</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-autopause">
                        <input type="checkbox" id="ytc-chk-autopause" name="preventAutoPause" aria-label="Chặn tự dừng video" ${currentConfig.preventAutoPause ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="chatMemoryGc" data-i18n-title="chat_memory_gc">
                    <div class="ytc-item-left">
                        ${BROOM_SVG}
                        <span data-i18n="chat_memory_gc">Dọn rác bộ nhớ Live Chat</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-chatgc">
                        <input type="checkbox" id="ytc-chk-chatgc" name="chatMemoryGc" aria-label="Dọn rác bộ nhớ Live Chat" ${currentConfig.chatMemoryGc ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="keyboardControls" data-i18n-title="keyboard_controls">
                    <div class="ytc-item-left">
                        ${KEYBOARD_SVG}
                        <span data-i18n="keyboard_controls">Phím tắt (A-S-D, Numpad)</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-keys">
                        <input type="checkbox" id="ytc-chk-keys" name="keyboardControls" aria-label="Phím tắt điều khiển" ${currentConfig.keyboardControls ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="audioOnlyMode" data-i18n-title="audio_only">
                    <div class="ytc-item-left">
                        ${HEADPHONES_SVG}
                        <span data-i18n="audio_only">Chỉ phát âm thanh (Radio)</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-audioonly">
                        <input type="checkbox" id="ytc-chk-audioonly" name="audioOnlyMode" aria-label="Chỉ phát âm thanh" ${currentConfig.audioOnlyMode ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="blockAv1" data-i18n-title="block_av1">
                    <div class="ytc-item-left">
                        ${CPU_SVG}
                        <span data-i18n="block_av1">Chặn AV1 / Ép Codec H.264</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-blockav1">
                        <input type="checkbox" id="ytc-chk-blockav1" name="blockAv1" aria-label="Chặn AV1 / Ép Codec H.264" ${currentConfig.blockAv1 ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 5: THÔNG TIN & HỖ TRỢ -->
            <div class="ytc-tab-pane" id="ytc-pane-info">
                <!-- Thông tin nhà phát triển -->
                <div class="ytc-item ytc-item-link" id="ytc-btn-dev" title="Ghé thăm website cá nhân của Huy Vũ">
                    <div class="ytc-item-left">
                        ${USER_SVG}
                        <div class="ytc-item-text-group">
                            <span class="ytc-item-main-text">Huy Vũ</span>
                            <span class="ytc-item-sub-text">huyvu2512.io.vn • <span data-i18n="author">Tác giả</span></span>
                        </div>
                    </div>
                    <div class="ytc-link-badge">
                        <span>Website</span>
                        ${EXTERNAL_LINK_SVG}
                    </div>
                </div>

                <!-- Báo cáo sự cố / Góp ý -->
                <div class="ytc-item ytc-item-link" id="ytc-btn-report" data-i18n-title="report_bug">
                    <div class="ytc-item-left">
                        ${BUG_SVG}
                        <div class="ytc-item-text-group">
                            <span class="ytc-item-main-text" data-i18n="report_bug">Báo cáo & Góp ý</span>
                            <span class="ytc-item-sub-text" data-i18n="sub_report">Báo lỗi hoặc đề xuất ý tưởng</span>
                        </div>
                    </div>
                    <div class="ytc-link-badge">
                        <span data-i18n="btn_report">Báo cáo</span>
                        ${EXTERNAL_LINK_SVG}
                    </div>
                </div>

                <!-- Tặng quà / Ủng hộ -->
                <div class="ytc-item ytc-item-link" id="ytc-btn-donate" data-i18n-title="donate">
                    <div class="ytc-item-left">
                        ${GIFT_SVG}
                        <div class="ytc-item-text-group">
                            <span class="ytc-item-main-text" data-i18n="donate">Tặng quà & Ủng hộ</span>
                            <span class="ytc-item-sub-text" data-i18n="sub_donate">Ủng hộ 1 ly cà phê tiếp thêm động lực</span>
                        </div>
                    </div>
                    <div class="ytc-link-badge">
                        <span data-i18n="donate">Ủng hộ</span>
                        ${EXTERNAL_LINK_SVG}
                    </div>
                </div>

                <!-- Thẻ kiểm tra cập nhật tinh gọn -->
                <div class="ytc-info-card">
                    <div class="ytc-info-title-wrap">
                        <span class="ytc-info-title" data-i18n="check_update">Kiểm tra cập nhật</span>
                    </div>
                    <button class="ytc-update-btn" id="ytc-btn-update" data-i18n-title="check_update">
                        ${UPDATE_SVG}
                        <span id="ytc-update-btn-text" data-i18n="btn_check">Kiểm tra</span>
                    </button>
                </div>

                <!-- Công tắc gạt Tự động cập nhật -->
                <div class="ytc-item" data-toggle="autoUpdate" data-i18n-title="auto_update">
                    <div class="ytc-item-left">
                        ${UPDATE_SVG}
                        <div class="ytc-item-text-group">
                            <span class="ytc-item-main-text" data-i18n="auto_update">Tự động cập nhật</span>
                            <span class="ytc-item-sub-text" data-i18n="sub_autoupdate">Tự gọi API và trỏ sang link cài bản mới khi vào YouTube</span>
                        </div>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-autoupdate">
                        <input type="checkbox" id="ytc-chk-autoupdate" name="autoUpdate" aria-label="Tự động cập nhật" ${currentConfig.autoUpdate ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>
        `);
        (document.body || document.documentElement).appendChild(panel);
        updatePanelLanguage(panel);

        // Chuyển Tab trong Menu
        panel.querySelectorAll('.ytc-tab-btn').forEach((tabBtn) => {
            tabBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tabKey = tabBtn.getAttribute('data-tab');
                panel.querySelectorAll('.ytc-tab-btn').forEach(b => b.classList.remove('active'));
                panel.querySelectorAll('.ytc-tab-pane').forEach(p => p.classList.remove('active'));

                tabBtn.classList.add('active');
                const targetPane = panel.querySelector(`#ytc-pane-${tabKey}`);
                if (targetPane) targetPane.classList.add('active');
            });
        });

        // Chọn số cột
        panel.querySelectorAll('.ytc-col-btn').forEach((colBtn) => {
            colBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const cols = parseInt(colBtn.getAttribute('data-cols'), 10) || 4;
                currentConfig.columns = cols;
                saveConfig(currentConfig);

                panel.querySelectorAll('.ytc-col-btn').forEach(b => b.classList.remove('active'));
                colBtn.classList.add('active');

                applyConfigToRoot();
            });
        });

        // Xử lý Floating Dropdown Ngôn ngữ Giao diện (Nổi tự do ngoài khung, không bị cắt)
        let langMenu = document.getElementById('ytc-lang-menu');
        if (!langMenu) {
            langMenu = document.createElement('div');
            langMenu.id = 'ytc-lang-menu';
            langMenu.setAttribute('role', 'listbox');
            langMenu.innerHTML = SUPPORTED_LANGUAGES.map(lang => {
                const isSelected = (currentConfig.language || 'auto') === lang.code;
                return `<div class="ytc-dropdown-item ${isSelected ? 'active' : ''}" data-code="${lang.code}" role="option">${lang.name}</div>`;
            }).join('');
            (document.body || document.documentElement).appendChild(langMenu);
        }

        const langTrigger = panel.querySelector('#ytc-lang-trigger');
        if (langTrigger && langMenu) {
            langTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = langMenu.classList.toggle('open');
                langTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                if (isOpen) {
                    const rect = langTrigger.getBoundingClientRect();
                    langMenu.style.position = 'fixed';
                    langMenu.style.zIndex = '10000000';
                    langMenu.style.right = `${Math.max(12, window.innerWidth - rect.right)}px`;
                    langMenu.style.left = 'auto';

                    const spaceBelow = window.innerHeight - rect.bottom;
                    if (spaceBelow < 250 && rect.top > 250) {
                        langMenu.style.top = 'auto';
                        langMenu.style.bottom = `${window.innerHeight - rect.top + 4}px`;
                    } else {
                        langMenu.style.top = `${rect.bottom + 4}px`;
                        langMenu.style.bottom = 'auto';
                    }
                }
            });

            langMenu.querySelectorAll('.ytc-dropdown-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const code = item.getAttribute('data-code') || 'auto';
                    currentConfig.language = code;
                    saveConfig(currentConfig);

                    langMenu.querySelectorAll('.ytc-dropdown-item').forEach(it => {
                        it.classList.toggle('active', it.getAttribute('data-code') === code);
                    });

                    updatePanelLanguage(panel);

                    langMenu.classList.remove('open');
                    langTrigger.setAttribute('aria-expanded', 'false');

                    const langInfo = getLanguageInfo(code);
                    showToast((t('toast_lang') || 'Đã đổi ngôn ngữ: ') + langInfo.name);
                });
            });

            panel.addEventListener('scroll', () => {
                if (langMenu.classList.contains('open')) {
                    langMenu.classList.remove('open');
                    langTrigger.setAttribute('aria-expanded', 'false');
                }
            }, { passive: true });
        }

        // Chọn chế độ Chat Overlay (Tắt / Ngang / Nổi)
        panel.querySelectorAll('#ytc-row-chatoverlay .ytc-mode-btn').forEach((modeBtn) => {
            modeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const mode = modeBtn.getAttribute('data-overlay') || 'off';
                if (mode !== 'off' && !hasLiveOrChatSupport()) {
                    showToast('⚠️ Live Chat chỉ khả dụng khi xem Live Stream hoặc video có khung trò chuyện!');
                    return;
                }
                currentConfig.chatOverlay = mode;
                saveConfig(currentConfig);

                panel.querySelectorAll('#ytc-row-chatoverlay .ytc-mode-btn').forEach(b => b.classList.remove('active'));
                modeBtn.classList.add('active');

                applyConfigToRoot();
                import('../chat/index.js').then(m => {
                    if (m && typeof m.updateChatOverlayVisibility === 'function') {
                        m.updateChatOverlayVisibility();
                    }
                }).catch(() => {});
            });
        });

        // Chọn độ phân giải ưu tiên (Tự động / Cao nhất / 2K / 1080p / 720p)
        panel.querySelectorAll('.ytc-quality-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const quality = btn.getAttribute('data-quality') || 'auto';
                currentConfig.preferredQuality = quality;
                saveConfig(currentConfig);

                panel.querySelectorAll('.ytc-quality-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const labelBadge = panel.querySelector('.ytc-quality-badge');
                if (labelBadge) {
                    const labels = {
                        auto: 'TỰ ĐỘNG',
                        max: 'CAO NHẤT',
                        '1440p': '2K',
                        '1080p': '1080P',
                        '720p': '720P'
                    };
                    labelBadge.textContent = labels[quality] || quality.toUpperCase();
                }

                import('../features/qualityManager.js').then(m => {
                    if (m && typeof m.applyPreferredQuality === 'function') {
                        m.applyPreferredQuality();
                    }
                }).catch(() => {});
            });
        });

        // Bật/tắt Toggle Switch
        panel.querySelectorAll('.ytc-item[data-toggle]').forEach((item) => {
            const key = item.getAttribute('data-toggle');
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (!checkbox) return;

            checkbox.addEventListener('change', () => {
                currentConfig[key] = checkbox.checked;
                saveConfig(currentConfig);
                applyConfigToRoot();
                if (key === 'hideNativeLiveChat') {
                    import('../chat/index.js').then(m => {
                        if (checkbox.checked) {
                            if (m && typeof m.resetChatCollapseState === 'function') {
                                m.resetChatCollapseState();
                            }
                            if (m && typeof m.autoCollapseNativeChatIfOpen === 'function') {
                                m.autoCollapseNativeChatIfOpen(true);
                            }
                            if (m && typeof m.setupAutoCloseObserver === 'function') {
                                m.setupAutoCloseObserver();
                            }
                            setTimeout(() => m.autoCollapseNativeChatIfOpen?.(true), 100);
                            setTimeout(() => m.autoCollapseNativeChatIfOpen?.(true), 300);
                            setTimeout(() => m.autoCollapseNativeChatIfOpen?.(true), 700);
                        } else {
                            if (m && typeof m.setUserManuallyOpenedChat === 'function') {
                                m.setUserManuallyOpenedChat(true);
                            }
                            if (m && typeof m.setNativeChatHiddenState === 'function') {
                                m.setNativeChatHiddenState(false);
                            }
                            // Khôi phục hiển thị khung chat nếu đang bị collapsed
                            const chatFrame = document.querySelector('ytd-live-chat-frame#chat, #chat.ytd-watch-flexy');
                            if (chatFrame && chatFrame.hasAttribute('collapsed')) {
                                const showBtn = chatFrame.querySelector('#show-hide-button yt-button-shape button, #show-hide-button button, #show-hide-button');
                                if (showBtn) showBtn.click();
                            }
                        }
                        if (m && typeof m.syncPlayerFullscreenSize === 'function') {
                            m.syncPlayerFullscreenSize();
                        }
                        if (m && typeof m.updateChatOverlayVisibility === 'function') {
                            m.updateChatOverlayVisibility();
                        }
                    }).catch(() => {});
                    window.dispatchEvent(new Event('resize'));
                }
                if (key === 'ambientLighting') {
                    import('../player/ambientLight.js').then(m => {
                        if (m && typeof m.applyAmbientLightingState === 'function') {
                            m.applyAmbientLightingState();
                        }
                    }).catch(() => {});
                }
                if (key === 'audioOnlyMode') {
                    import('../optimization/audioOnly.js').then(m => {
                        if (m && typeof m.applyAudioOnlyState === 'function') {
                            m.applyAudioOnlyState();
                        }
                    }).catch(() => {});
                    import('../player/ambientLight.js').then(m => {
                        if (m && typeof m.applyAmbientLightingState === 'function') {
                            m.applyAmbientLightingState();
                        }
                    }).catch(() => {});
                }
                if (key === 'chatMemoryGc' && checkbox.checked) {
                    import('../optimization/chatMemoryGc.js').then(m => {
                        if (m && typeof m.performChatMemoryGc === 'function') {
                            m.performChatMemoryGc();
                        }
                    }).catch(() => {});
                }
                if (key === 'hideMixes') {
                    import('../features/mixFilter.js').then(m => {
                        if (checkbox.checked) {
                            if (typeof m.cleanMixUrl === 'function') m.cleanMixUrl();
                            if (typeof m.tagWatchMixPanel === 'function') m.tagWatchMixPanel();
                        }
                    }).catch(() => {});
                    import('../features/feedFilter.js').then(m => {
                        if (m && typeof m.scheduleFeedScan === 'function') {
                            m.scheduleFeedScan(document);
                        }
                    }).catch(() => {});
                }
                if (key === 'hideShopping' && checkbox.checked) {
                    import('../features/shoppingFilter.js').then(m => {
                        if (m && typeof m.dismissShoppingPanels === 'function') {
                            m.dismissShoppingPanels(document);
                        }
                    }).catch(() => {});
                }
                if (key === 'unlockLiveDvr') {
                    // Tự động F5 hộ người dùng nếu đang ở trang xem video (/watch hoặc /live)
                    if (location.pathname.startsWith('/watch') || location.pathname.startsWith('/live')) {
                        setTimeout(() => {
                            location.reload();
                        }, 250);
                    }
                }
                if (key === 'autoUpdate' && checkbox.checked) {
                    import('./notifier.js').then(m => {
                        if (m && typeof m.checkAndAutoUpdate === 'function') {
                            m.checkAndAutoUpdate(true);
                        }
                    }).catch(() => {});
                }
            });

            item.addEventListener('click', (e) => {
                if (!e.target.closest('.ytc-switch')) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        });

        // Nút mở trang uBlock Origin
        const ublockBtn = panel.querySelector('#ytc-btn-ublock');
        if (ublockBtn) {
            ublockBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open('https://ublockorigin.com/', '_blank', 'noopener,noreferrer');
            });
        }

        // Tab 5: Nút Kiểm tra cập nhật (Tự mở link cập nhật, tự F5 thông minh khi quay lại tab hoặc sau 10s)
        const updateBtn = panel.querySelector('#ytc-btn-update');
        const updateBtnText = panel.querySelector('#ytc-update-btn-text');
        if (updateBtn) {
            let isChecking = false;
            let isCountingDown = false;
            let countdownInterval = null;
            let reloadTriggered = false;

            const triggerReload = () => {
                if (reloadTriggered) return;
                reloadTriggered = true;
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
                if (updateBtnText) updateBtnText.textContent = 'Đang tải lại...';
                location.reload();
            };

            updateBtn.addEventListener('click', async (e) => {
                e.stopPropagation();

                // Nếu đang trong trạng thái đếm ngược F5, bấm vào sẽ tải lại trang ngay lập tức
                if (isCountingDown) {
                    triggerReload();
                    return;
                }

                if (isChecking) return;
                isChecking = true;

                updateBtn.disabled = true;
                updateBtn.classList.remove('ytc-btn-success', 'ytc-btn-has-update');
                updateBtn.classList.add('ytc-btn-loading');
                if (updateBtnText) updateBtnText.textContent = 'Đang kiểm tra...';

                try {
                    let pkg = null;
                    try {
                        const apiRes = await fetch('https://api.github.com/repos/huyvu2512/youtube-customizer/contents/package.json?ref=main', {
                            headers: { 'Accept': 'application/vnd.github.v3.raw' },
                            cache: 'no-store'
                        });
                        if (apiRes.ok) {
                            const data = await apiRes.json();
                            if (data && data.version) {
                                pkg = data;
                            } else if (data && data.content && data.encoding === 'base64') {
                                try {
                                    pkg = JSON.parse(decodeURIComponent(escape(atob(data.content.replace(/\s/g, '')))));
                                } catch (err) {}
                            }
                        }
                    } catch (e) {}

                    if (!pkg || !pkg.version) {
                        const rawRes = await fetch(`https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/package.json?t=${Date.now()}`, {
                            cache: 'no-store'
                        });
                        if (rawRes.ok) {
                            pkg = await rawRes.json();
                        }
                    }

                    if (pkg && pkg.version) {
                        if (isNewerVersion(pkg.version, APP_VERSION)) {
                            const newVersionUrl = `https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=${pkg.version}`;

                            // 1. Tự động mở trang cài đặt bản mới Tampermonkey trong tab mới
                            window.open(newVersionUrl, '_blank');

                            // 2. Chuyển nút sang trạng thái đếm ngược F5
                            isChecking = false;
                            isCountingDown = true;
                            updateBtn.disabled = false;
                            updateBtn.classList.remove('ytc-btn-loading');
                            updateBtn.classList.add('ytc-btn-has-update');
                            updateBtn.title = `Đã mở trang cập nhật v${pkg.version}. Bấm để tải lại trang ngay!`;

                            let countdown = 10;
                            if (updateBtnText) updateBtnText.textContent = 'F5 sau 10s';

                            const openedTime = Date.now();

                            // 3. Cơ chế thông minh: Tự động F5 ngay khi người dùng cập nhật xong và quay lại tab YouTube
                            const onReturnToTab = () => {
                                // Người dùng đã chuyển sang tab Tampermonkey >= 1.2s rồi quay lại tab YouTube
                                if (Date.now() - openedTime >= 1200) {
                                    window.removeEventListener('focus', onReturnToTab);
                                    document.removeEventListener('visibilitychange', handleVisibilityChange);
                                    triggerReload();
                                }
                            };

                            const handleVisibilityChange = () => {
                                if (document.visibilityState === 'visible') {
                                    onReturnToTab();
                                }
                            };

                            window.addEventListener('focus', onReturnToTab);
                            document.addEventListener('visibilitychange', handleVisibilityChange);

                            // 4. Đếm ngược 10 giây tự F5 nếu người dùng không chuyển tab
                            countdownInterval = setInterval(() => {
                                countdown--;
                                if (countdown <= 0) {
                                    window.removeEventListener('focus', onReturnToTab);
                                    document.removeEventListener('visibilitychange', handleVisibilityChange);
                                    triggerReload();
                                } else {
                                    if (updateBtnText) updateBtnText.textContent = `F5 sau ${countdown}s`;
                                }
                            }, 1000);

                            return;
                        } else {
                            // Đang ở phiên bản mới nhất -> Hiển thị "Đã cập nhật"
                            updateBtn.classList.remove('ytc-btn-loading');
                            updateBtn.classList.add('ytc-btn-success');
                            if (updateBtnText) updateBtnText.textContent = 'Đã cập nhật';
                            setTimeout(() => {
                                updateBtn.classList.remove('ytc-btn-success');
                                if (updateBtnText) updateBtnText.textContent = 'Kiểm tra';
                                updateBtn.disabled = false;
                                isChecking = false;
                            }, 2500);
                            return;
                        }
                    } else {
                        window.open('https://github.com/huyvu2512/youtube-customizer/releases', '_blank');
                    }
                } catch (err) {
                    window.open('https://github.com/huyvu2512/youtube-customizer/releases', '_blank');
                }

                setTimeout(() => {
                    updateBtn.classList.remove('ytc-btn-loading', 'ytc-btn-has-update');
                    if (updateBtnText) updateBtnText.textContent = 'Kiểm tra';
                    updateBtn.disabled = false;
                    isChecking = false;
                }, 3000);
            });
        }

        // Tab 5: Thông tin nhà phát triển (Huy Vũ - huyvu2512.io.vn)
        const devBtn = panel.querySelector('#ytc-btn-dev');
        if (devBtn) {
            devBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open('https://huyvu2512.io.vn', '_blank', 'noopener,noreferrer');
            });
        }

        // Tab 5: Báo cáo & Góp ý
        const reportBtn = panel.querySelector('#ytc-btn-report');
        if (reportBtn) {
            reportBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open('https://github.com/huyvu2512/youtube-customizer/issues', '_blank', 'noopener,noreferrer');
            });
        }

        // Tab 5: Mở link Tặng quà & Ủng hộ
        const donateBtn = panel.querySelector('#ytc-btn-donate');
        if (donateBtn) {
            donateBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open('https://vietqr.app/img?acc=0886308216&bank=MoMo&fullacc=true&holder=VU+QUANG+HUY&template=standee', '_blank', 'noopener,noreferrer');
            });
        }

        panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    return panel;
}

export function ensureSettingsElements() {
    const endContainer = document.querySelector('ytd-masthead #end, #masthead #end, #end.ytd-masthead');
    if (!endContainer) return;

    let btn = document.getElementById('ytc-settings-btn');
    const isBtnInPlace = btn && btn.parentElement === endContainer && btn === endContainer.firstElementChild;
    const isPanelExisting = !!document.getElementById('ytc-settings-panel');

    if (isBtnInPlace && isPanelExisting) {
        return;
    }

    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'ytc-settings-btn';
        btn.title = 'YouTube Customizer';
        setElementHTML(btn, GEAR_SVG);
    }

    if (btn.parentElement !== endContainer || btn !== endContainer.firstElementChild) {
        endContainer.insertBefore(btn, endContainer.firstElementChild);
    }

    const panel = createSettingsPanel();
    syncPanelState(panel);
    bindGlobalMenuDismiss();
    setupOnboardingAndUpdates(btn);

    if (!btn._ytcBound) {
        btn._ytcBound = true;

        const updatePosition = () => {
            const rect = btn.getBoundingClientRect();
            panel.style.top = (rect.bottom + 8) + 'px';
            panel.style.right = Math.max(12, window.innerWidth - rect.right - 10) + 'px';
        };

        btn.addEventListener('mouseenter', updatePosition, { passive: true });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            syncPanelState(panel);
            updatePosition();
            panel.classList.toggle('open');
        });
    }
}

export function setupSettingsObserver() {
    ensureSettingsElements();

    const throttledEnsure = rafThrottle(ensureSettingsElements);

    const attach = (masthead) => {
        throttledEnsure();
        new MutationObserver(throttledEnsure).observe(masthead, { childList: true, subtree: true });
    };

    const masthead = document.querySelector('ytd-masthead');
    if (masthead) attach(masthead);
    else whenElement('ytd-masthead', attach);

    let retryCount = 0;
    const retryInterval = setInterval(() => {
        retryCount++;
        ensureSettingsElements();
        if (retryCount >= 6 && document.getElementById('ytc-settings-btn')) {
            clearInterval(retryInterval);
        }
    }, 500);
}
