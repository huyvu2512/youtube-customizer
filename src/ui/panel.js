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
    SPARKLE_SVG,
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
    EXTERNAL_LINK_SVG
} from '../core/constants.js';
import { syncPanelState } from './sync.js';
import { setupOnboardingAndUpdates } from './notifier.js';

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
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const panel = document.getElementById('ytc-settings-panel');
            if (panel && panel.classList.contains('open')) {
                panel.classList.remove('open');
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
                <button class="ytc-tab-btn active" data-tab="layout" title="Bố cục & Giao diện">
                    ${LAYOUT_TAB_SVG}
                    <span>Giao diện</span>
                </button>
                <button class="ytc-tab-btn" data-tab="filter" title="Lọc nội dung sạch">
                    ${SHIELD_TAB_SVG}
                    <span>Lọc</span>
                </button>
                <button class="ytc-tab-btn" data-tab="player" title="Trình phát & Video">
                    ${PLAYER_TAB_SVG}
                    <span>Trình phát</span>
                </button>
                <button class="ytc-tab-btn" data-tab="optimize" title="Tối ưu hiệu năng, RAM & GPU">
                    ${OPTIMIZE_TAB_SVG}
                    <span>Tối Ưu</span>
                </button>
                <button class="ytc-tab-btn" data-tab="info" title="Thông tin tiện ích & Tác giả">
                    ${INFO_TAB_SVG}
                    <span>Thông tin</span>
                </button>
            </div>

            <!-- TAB 1: GIAO DIỆN & BỐ CỤC -->
            <div class="ytc-tab-pane active" id="ytc-pane-layout">
                <div class="ytc-item" id="ytc-row-cols" title="Tùy chỉnh số cột video hiển thị trên trang chủ và kênh">
                    <div class="ytc-item-left">
                        ${GRID_SVG}
                        <span>Số cột trang chủ</span>
                    </div>
                    <div class="ytc-cols-group">
                        <button class="ytc-col-btn ${currentConfig.columns === 3 ? 'active' : ''}" data-cols="3" title="Hiển thị 3 cột">3</button>
                        <button class="ytc-col-btn ${currentConfig.columns === 4 ? 'active' : ''}" data-cols="4" title="Hiển thị 4 cột">4</button>
                        <button class="ytc-col-btn ${currentConfig.columns === 5 ? 'active' : ''}" data-cols="5" title="Hiển thị 5 cột">5</button>
                    </div>
                </div>

                <div class="ytc-item" data-toggle="premiumLogo" title="Thay thế logo YouTube thường bằng logo YouTube Premium kèm mã quốc gia">
                    <div class="ytc-item-left">
                        ${YOUTUBE_SVG}
                        <span>Logo Premium</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-logo">
                        <input type="checkbox" id="ytc-chk-logo" name="premiumLogo" aria-label="Logo Premium" ${currentConfig.premiumLogo ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="unlockLiveDvr" title="Mở khóa tua lùi thời gian trên các luồng Live Stream bị chủ kênh cấm tua">
                    <div class="ytc-item-left">
                        ${REWIND_SVG}
                        <span>Mở khóa tua Live Stream</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-livedvr">
                        <input type="checkbox" id="ytc-chk-livedvr" name="unlockLiveDvr" aria-label="Mở khóa tua Live Stream" ${currentConfig.unlockLiveDvr ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="autoLiveSync" title="Tự động giữ mốc trực tiếp khi xem Live Stream, chống trễ hình khi mạng lag hoặc chuyển tab">
                    <div class="ytc-item-left">
                        ${RADIO_SVG}
                        <span>Tự động trực tiếp (Auto Live)</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-autolive">
                        <input type="checkbox" id="ytc-chk-autolive" name="autoLiveSync" aria-label="Tự động trực tiếp (Auto Live)" ${currentConfig.autoLiveSync ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" id="ytc-row-chatoverlay" title="Hiển thị chat trực tiếp nổi trên màn hình video (tự động ẩn khi tua lùi video)">
                    <div class="ytc-item-left">
                        ${MESSAGE_SVG}
                        <span>Live Chat</span>
                    </div>
                    <div class="ytc-mode-group">
                        <button class="ytc-mode-btn ${(!currentConfig.chatOverlay || currentConfig.chatOverlay === 'off') ? 'active' : ''}" data-overlay="off" title="Tắt chat trên video">Tắt</button>
                        <button class="ytc-mode-btn ${currentConfig.chatOverlay === 'danmaku' ? 'active' : ''}" data-overlay="danmaku" title="Chữ chạy ngang màn hình dạng Danmaku">Ngang</button>
                        <button class="ytc-mode-btn ${currentConfig.chatOverlay === 'streamer' ? 'active' : ''}" data-overlay="streamer" title="Khung chat nổi của streamer, kéo thả và co giãn tự do">Nổi</button>
                    </div>
                </div>
            </div>

            <!-- TAB 2: LỌC NỘI DUNG SẠCH -->
            <div class="ytc-tab-pane" id="ytc-pane-filter">
                <div class="ytc-item" data-toggle="hideShorts" title="Ẩn toàn bộ video ngắn Shorts trên trang chủ, đăng ký và thanh menu">
                    <div class="ytc-item-left">
                        ${SHORTS_SVG}
                        <span>Ẩn mục Shorts</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-shorts">
                        <input type="checkbox" id="ytc-chk-shorts" name="hideShorts" aria-label="Ẩn mục Shorts" ${currentConfig.hideShorts ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hidePlayables" title="Ẩn mục trò chơi Playables trên trang chủ và thanh menu">
                    <div class="ytc-item-left">
                        ${GAMEPAD_SVG}
                        <span>Ẩn mục Chơi game</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-playables">
                        <input type="checkbox" id="ytc-chk-playables" name="hidePlayables" aria-label="Ẩn mục Chơi game" ${currentConfig.hidePlayables ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideMembersOnly" title="Ẩn video dành riêng cho hội viên và video ưu tiên xem trước">
                    <div class="ytc-item-left">
                        ${CROWN_SVG}
                        <span>Ẩn video Hội viên</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-members">
                        <input type="checkbox" id="ytc-chk-members" name="hideMembersOnly" aria-label="Ẩn video Hội viên" ${currentConfig.hideMembersOnly ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideCommunity" title="Ẩn bài viết, khảo sát và hình ảnh bài đăng cộng đồng trên feed">
                    <div class="ytc-item-left">
                        ${POST_SVG}
                        <span>Ẩn bài đăng cộng đồng</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-community">
                        <input type="checkbox" id="ytc-chk-community" name="hideCommunity" aria-label="Ẩn bài đăng cộng đồng" ${currentConfig.hideCommunity ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="cleanSearch" title="Ẩn video được tài trợ và quảng cáo khi tìm kiếm trên YouTube">
                    <div class="ytc-item-left">
                        ${SEARCH_SVG}
                        <span>Lọc tìm kiếm sạch</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-search">
                        <input type="checkbox" id="ytc-chk-search" name="cleanSearch" aria-label="Lọc tìm kiếm sạch" ${currentConfig.cleanSearch ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideExploreTopics" title="Ẩn kệ Khám phá các chủ đề khác chen giữa video trang chủ">
                    <div class="ytc-item-left">
                        ${COMPASS_SVG}
                        <span>Ẩn Khám phá chủ đề</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-explore">
                        <input type="checkbox" id="ytc-chk-explore" name="hideExploreTopics" aria-label="Ẩn Khám phá chủ đề" ${currentConfig.hideExploreTopics ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideMixes" title="Ẩn toàn bộ Danh sách kết hợp (Mixes/Radio) và Danh sách phát (Playlists) trên trang chủ, tìm kiếm, gợi ý và tự động chuyển tiếp video đề xuất khi xem">
                    <div class="ytc-item-left">
                        ${PLAYLIST_SVG}
                        <span>Ẩn Danh sách phát & Mix</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-mixes">
                        <input type="checkbox" id="ytc-chk-mixes" name="hideMixes" aria-label="Ẩn Danh sách phát & Mix" ${currentConfig.hideMixes ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 3: TRÌNH PHÁT & VIDEO -->
            <div class="ytc-tab-pane" id="ytc-pane-player">
                <div class="ytc-item" data-toggle="disableAmbient" title="Tắt ánh sáng viền xung quanh video (Ambient Mode) để giảm tải GPU">
                    <div class="ytc-item-left">
                        ${SPARKLE_SVG}
                        <span>Tắt ánh sáng video</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-ambient">
                        <input type="checkbox" id="ytc-chk-ambient" name="disableAmbient" aria-label="Tắt ánh sáng video" ${currentConfig.disableAmbient ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideEndscreen" title="Ẩn khung gợi ý video cuối clip và biểu tượng thẻ chữ (i) góc trên">
                    <div class="ytc-item-left">
                        ${ENDSCREEN_SVG}
                        <span>Ẩn thẻ kết thúc/chú thích</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-endscreen">
                        <input type="checkbox" id="ytc-chk-endscreen" name="hideEndscreen" aria-label="Ẩn thẻ kết thúc/chú thích" ${currentConfig.hideEndscreen ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideWatermark" title="Ẩn logo hình mờ hoặc avatar kênh ở góc dưới cùng bên phải video">
                    <div class="ytc-item-left">
                        ${WATERMARK_SVG}
                        <span>Ẩn logo góc video</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-watermark">
                        <input type="checkbox" id="ytc-chk-watermark" name="hideWatermark" aria-label="Ẩn logo góc video" ${currentConfig.hideWatermark ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="autoDismissPromos" title="Tự động tắt banner Premium, khảo sát và thông báo sự cố gián đoạn phiền toái">
                    <div class="ytc-item-left">
                        ${BELL_OFF_SVG}
                        <span>Tự đóng banner & thông báo</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-promos">
                        <input type="checkbox" id="ytc-chk-promos" name="autoDismissPromos" aria-label="Tự đóng banner & thông báo" ${currentConfig.autoDismissPromos ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideNativeLiveChat" title="Tự động tắt khung trò chuyện khi mới mở video (người dùng vẫn có thể bấm mở lại bình thường, Live Chat Overlay vẫn chạy ngầm nếu bật)">
                    <div class="ytc-item-left">
                        ${CHAT_OFF_SVG}
                        <span>Tắt trò chuyện trực tiếp</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-hidenativechat">
                        <input type="checkbox" id="ytc-chk-hidenativechat" name="hideNativeLiveChat" aria-label="Tắt trò chuyện trực tiếp" ${currentConfig.hideNativeLiveChat ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="hideChatEmojis" title="Ẩn biểu tượng cảm xúc (emoji/sticker) trong Live Chat: cmt chỉ có icon sẽ ẩn hẳn, cmt có chữ sẽ chỉ hiện chữ">
                    <div class="ytc-item-left">
                        ${EMOJI_OFF_SVG}
                        <span>Ẩn biểu tượng trong Live Chat</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-hidechatemojis">
                        <input type="checkbox" id="ytc-chk-hidechatemojis" name="hideChatEmojis" aria-label="Ẩn biểu tượng trong Live Chat" ${currentConfig.hideChatEmojis ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item ytc-item-link" id="ytc-btn-ublock" title="Mở trang tiện ích uBlock Origin — trình chặn quảng cáo số 1 thế giới, sạch sẽ, an toàn và không gây giật lag">
                    <div class="ytc-item-left">
                        ${SHIELD_CHECK_SVG}
                        <span>Chặn quảng cáo (uBlock)</span>
                    </div>
                    <div class="ytc-link-badge">
                        <span>Mở trang</span>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                    </div>
                </div>
            </div>

            <!-- TAB 4: TỐI ƯU HIỆU NĂNG & TIỆN ÍCH -->
            <div class="ytc-tab-pane" id="ytc-pane-optimize">
                <div class="ytc-item ytc-item-vertical" id="ytc-row-quality" title="Ưu tiên tự động chọn độ phân giải theo ý muốn (Mặc định: Tự động của YouTube)">
                    <div class="ytc-item-header">
                        <div class="ytc-item-left">
                            ${QUALITY_SVG}
                            <span>Độ phân giải video</span>
                        </div>
                        <span class="ytc-quality-badge">${currentConfig.preferredQuality === 'auto' ? 'TỰ ĐỘNG' : (currentConfig.preferredQuality === 'max' ? 'CAO NHẤT' : currentConfig.preferredQuality.toUpperCase())}</span>
                    </div>
                    <div class="ytc-mode-group ytc-quality-group">
                        <button class="ytc-quality-btn ${(!currentConfig.preferredQuality || currentConfig.preferredQuality === 'auto') ? 'active' : ''}" data-quality="auto" title="Để YouTube tự động quyết định">Tự động</button>
                        <button class="ytc-quality-btn ${currentConfig.preferredQuality === 'max' ? 'active' : ''}" data-quality="max" title="Ưu tiên độ phân giải cao nhất khả dụng (4K, 2K...)">Cao nhất</button>
                        <button class="ytc-quality-btn ${currentConfig.preferredQuality === '1440p' ? 'active' : ''}" data-quality="1440p" title="Ưu tiên 2K (1440p)">2K</button>
                        <button class="ytc-quality-btn ${currentConfig.preferredQuality === '1080p' ? 'active' : ''}" data-quality="1080p" title="Ưu tiên Full HD (1080p)">1080p</button>
                        <button class="ytc-quality-btn ${currentConfig.preferredQuality === '720p' ? 'active' : ''}" data-quality="720p" title="Ưu tiên HD (720p)">720p</button>
                    </div>
                </div>

                <div class="ytc-item" data-toggle="preventAutoPause" title="Tự động xác nhận hộp thoại 'Video đã tạm dừng. Bạn vẫn đang xem chứ?' và duy trì trạng thái hoạt động để phát nhạc/video liên tục">
                    <div class="ytc-item-left">
                        ${INFINITY_SVG}
                        <span>Chặn tự dừng video</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-autopause">
                        <input type="checkbox" id="ytc-chk-autopause" name="preventAutoPause" aria-label="Chặn tự dừng video" ${currentConfig.preventAutoPause ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="chatMemoryGc" title="Giới hạn tối đa 100 tin nhắn trong DOM Live Chat, dọn dẹp bộ nhớ định kỳ chống đầy tràn RAM khi xem stream lâu">
                    <div class="ytc-item-left">
                        ${BROOM_SVG}
                        <span>Dọn rác bộ nhớ Live Chat</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-chatgc">
                        <input type="checkbox" id="ytc-chk-chatgc" name="chatMemoryGc" aria-label="Dọn rác bộ nhớ Live Chat" ${currentConfig.chatMemoryGc ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="keyboardControls" title="Phím tắt: A/D hoặc 4/6 tua 10s, S hoặc 5 dừng/phát, 8/2 âm lượng (chặn nhảy % khi bật NumLock)">
                    <div class="ytc-item-left">
                        ${KEYBOARD_SVG}
                        <span>Phím tắt (A-S-D, Numpad)</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-keys">
                        <input type="checkbox" id="ytc-chk-keys" name="keyboardControls" aria-label="Phím tắt điều khiển" ${currentConfig.keyboardControls ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="blockAv1" title="Chặn codec AV1 ngốn CPU, ép dùng bộ giải mã phần cứng H.264 & VP9 mượt mà, mát máy">
                    <div class="ytc-item-left">
                        ${CPU_SVG}
                        <span>Chặn AV1 / Ép Codec H.264</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-blockav1">
                        <input type="checkbox" id="ytc-chk-blockav1" name="blockAv1" aria-label="Chặn AV1 / Ép Codec H.264" ${currentConfig.blockAv1 ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" data-toggle="audioOnlyMode" title="Chế độ Radio: Tắt hoàn toàn render hình ảnh video, hạ chất lượng tối thiểu để chỉ nghe tiếng, giảm tối đa RAM/GPU">
                    <div class="ytc-item-left">
                        ${HEADPHONES_SVG}
                        <span>Chỉ phát âm thanh (Radio)</span>
                    </div>
                    <label class="ytc-switch" for="ytc-chk-audioonly">
                        <input type="checkbox" id="ytc-chk-audioonly" name="audioOnlyMode" aria-label="Chỉ phát âm thanh" ${currentConfig.audioOnlyMode ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 5: THÔNG TIN & HỖ TRỢ -->
            <div class="ytc-tab-pane" id="ytc-pane-info">
                <!-- Thẻ phiên bản & Hành động -->
                <div class="ytc-info-card">
                    <div class="ytc-info-header">
                        <div class="ytc-info-title-wrap">
                            <span class="ytc-info-title">YouTube Customizer</span>
                            <span class="ytc-info-badge">Chính thức</span>
                        </div>
                        <span class="ytc-info-version">v${APP_VERSION}</span>
                    </div>
                    <div class="ytc-info-desc">
                        Tiện ích tùy biến và tối ưu hóa trải nghiệm YouTube mượt mà, sạch sẽ và thông minh.
                    </div>
                    <div class="ytc-info-actions">
                        <button class="ytc-action-btn" id="ytc-btn-reload" title="Tải lại trang YouTube">
                            ${REFRESH_SVG}
                            <span>Làm mới</span>
                        </button>
                        <button class="ytc-action-btn" id="ytc-btn-update" title="Kiểm tra bản cập nhật mới nhất từ GitHub">
                            ${UPDATE_SVG}
                            <span>Cập nhật</span>
                        </button>
                    </div>
                </div>

                <!-- Thông tin nhà phát triển -->
                <div class="ytc-item ytc-item-link" id="ytc-btn-dev" title="Xem GitHub của tác giả Huy Vũ">
                    <div class="ytc-item-left">
                        ${USER_SVG}
                        <div class="ytc-item-text-group">
                            <span class="ytc-item-main-text">Huy Vũ</span>
                            <span class="ytc-item-sub-text">Nhà phát triển • @huyvu2512</span>
                        </div>
                    </div>
                    <div class="ytc-link-badge">
                        <span>GitHub</span>
                        ${EXTERNAL_LINK_SVG}
                    </div>
                </div>

                <!-- Báo cáo sự cố / Góp ý -->
                <div class="ytc-item ytc-item-link" id="ytc-btn-report" title="Báo lỗi hoặc đề xuất tính năng mới trên GitHub Issues">
                    <div class="ytc-item-left">
                        ${BUG_SVG}
                        <div class="ytc-item-text-group">
                            <span class="ytc-item-main-text">Báo cáo & Góp ý</span>
                            <span class="ytc-item-sub-text">Báo lỗi hoặc đề xuất ý tưởng</span>
                        </div>
                    </div>
                    <div class="ytc-link-badge">
                        <span>Báo cáo</span>
                        ${EXTERNAL_LINK_SVG}
                    </div>
                </div>

                <!-- Tặng quà / Ủng hộ -->
                <div class="ytc-donate-card">
                    <div class="ytc-donate-header" id="ytc-header-donate" title="Bấm để xem/ẩn thông tin ủng hộ">
                        <div class="ytc-item-left">
                            ${GIFT_SVG}
                            <div class="ytc-item-text-group">
                                <span class="ytc-item-main-text">Tặng quà & Ủng hộ</span>
                                <span class="ytc-item-sub-text">Ủng hộ 1 ly cà phê tiếp thêm động lực</span>
                            </div>
                        </div>
                        <button class="ytc-donate-pill-btn" id="ytc-btn-toggle-donate">Chi tiết</button>
                    </div>
                    <div class="ytc-donate-details" id="ytc-donate-box" style="display: none;">
                        <div class="ytc-donate-note">Cảm ơn bạn đã sử dụng và đồng hành cùng YouTube Customizer! ❤️</div>
                        <div class="ytc-donate-list">
                            <!-- THÔNG TIN DONATE: Bạn có thể cập nhật STK & MoMo bên dưới -->
                            <div class="ytc-donate-item">
                                <span class="ytc-donate-label">Ngân hàng:</span>
                                <span class="ytc-donate-val" id="ytc-bank-name">MB Bank (Quân Đội)</span>
                            </div>
                            <div class="ytc-donate-item">
                                <span class="ytc-donate-label">Số TK:</span>
                                <span class="ytc-donate-val ytc-selectable" id="ytc-bank-acc">123456789</span>
                                <button class="ytc-copy-btn" id="ytc-btn-copy-acc" title="Sao chép số tài khoản">Sao chép</button>
                            </div>
                            <div class="ytc-donate-item">
                                <span class="ytc-donate-label">Chủ TK:</span>
                                <span class="ytc-donate-val" id="ytc-bank-holder">HUY VU</span>
                            </div>
                            <div class="ytc-donate-item">
                                <span class="ytc-donate-label">MoMo:</span>
                                <span class="ytc-donate-val ytc-selectable" id="ytc-momo-val">0987654321</span>
                                <button class="ytc-copy-btn" id="ytc-btn-copy-momo" title="Sao chép số MoMo">Sao chép</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        (document.body || document.documentElement).appendChild(panel);

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
                if (key === 'audioOnlyMode') {
                    import('../optimization/audioOnly.js').then(m => {
                        if (m && typeof m.applyAudioOnlyState === 'function') {
                            m.applyAudioOnlyState();
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

        // Tab 5: Nút Làm mới trang
        const reloadBtn = panel.querySelector('#ytc-btn-reload');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showToast('🔄 Đang làm mới trang...');
                setTimeout(() => {
                    window.location.reload();
                }, 350);
            });
        }

        // Tab 5: Nút Cập nhật phiên bản
        const updateBtn = panel.querySelector('#ytc-btn-update');
        if (updateBtn) {
            updateBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                showToast('🔍 Đang kiểm tra bản cập nhật mới...');
                try {
                    const res = await fetch(`https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/package.json?t=${Date.now()}`);
                    if (res.ok) {
                        const pkg = await res.json();
                        if (pkg.version && pkg.version !== APP_VERSION) {
                            showToast(`🚀 Có bản mới v${pkg.version}! Đang mở trang tải...`, 4000);
                            setTimeout(() => {
                                window.open(`https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=${pkg.version}`, '_blank');
                            }, 800);
                        } else {
                            showToast(`✅ Bạn đang dùng phiên bản mới nhất (v${APP_VERSION})!`, 3000);
                        }
                    } else {
                        window.open('https://github.com/huyvu2512/youtube-customizer/releases', '_blank');
                    }
                } catch (err) {
                    window.open('https://github.com/huyvu2512/youtube-customizer/releases', '_blank');
                }
            });
        }

        // Tab 5: Thông tin nhà phát triển (Huy Vũ)
        const devBtn = panel.querySelector('#ytc-btn-dev');
        if (devBtn) {
            devBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open('https://github.com/huyvu2512', '_blank', 'noopener,noreferrer');
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

        // Tab 5: Mở/Đóng thông tin Tặng quà & Ủng hộ
        const donateHeader = panel.querySelector('#ytc-header-donate');
        const donateBox = panel.querySelector('#ytc-donate-box');
        const toggleDonateBtn = panel.querySelector('#ytc-btn-toggle-donate');
        if (donateHeader && donateBox) {
            donateHeader.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = donateBox.style.display === 'none';
                donateBox.style.display = isHidden ? 'block' : 'none';
                if (toggleDonateBtn) {
                    toggleDonateBtn.textContent = isHidden ? 'Đóng' : 'Chi tiết';
                }
            });
        }

        // Tab 5: Sao chép số tài khoản & MoMo
        const copyAccBtn = panel.querySelector('#ytc-btn-copy-acc');
        if (copyAccBtn) {
            copyAccBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const accEl = panel.querySelector('#ytc-bank-acc');
                if (accEl) {
                    const text = accEl.textContent.trim();
                    navigator.clipboard.writeText(text).then(() => {
                        showToast(`📋 Đã sao chép số tài khoản: ${text}`);
                    }).catch(() => {
                        showToast(`Số TK: ${text}`);
                    });
                }
            });
        }

        const copyMomoBtn = panel.querySelector('#ytc-btn-copy-momo');
        if (copyMomoBtn) {
            copyMomoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const momoEl = panel.querySelector('#ytc-momo-val');
                if (momoEl) {
                    const text = momoEl.textContent.trim();
                    navigator.clipboard.writeText(text).then(() => {
                        showToast(`📋 Đã sao chép số MoMo: ${text}`);
                    }).catch(() => {
                        showToast(`MoMo: ${text}`);
                    });
                }
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
