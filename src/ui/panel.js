// ==========================================================================
// SETTINGS PANEL UI & MASTHEAD GEAR OBSERVER
// ==========================================================================
import { currentConfig, saveConfig, applyConfigToRoot } from '../core/config.js';
import { safeHTML, setElementHTML, whenElement, rafThrottle } from '../core/utils.js';
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
    RADIO_SVG
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
                <button class="ytc-tab-btn" data-tab="shortcuts" title="Phím tắt & Tiện ích">
                    ${KEYBOARD_SVG}
                    <span>Phím tắt</span>
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
            </div>

            <!-- TAB 4: PHÍM TẮT & TIỆN ÍCH -->
            <div class="ytc-tab-pane" id="ytc-pane-shortcuts">
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

                <div class="ytc-shortcut-hint" title="Bảng hướng dẫn các phím tắt điều khiển nhanh">
                    <div><kbd>A</kbd> / <kbd>D</kbd> (hoặc <kbd>J</kbd> / <kbd>L</kbd>) : Tua lùi / tiến 10 giây</div>
                    <div style="margin-top:4px"><kbd>S</kbd> (hoặc <kbd>K</kbd>) : Tạm dừng / phát tiếp</div>
                    <div style="margin-top:4px"><kbd>4</kbd> / <kbd>6</kbd> (Numpad) : Tua lùi / tiến 10 giây</div>
                    <div style="margin-top:4px"><kbd>8</kbd> / <kbd>2</kbd> (Numpad) : Tăng / giảm âm lượng</div>
                    <div style="margin-top:4px"><kbd>5</kbd> (Numpad) : Tạm dừng / phát tiếp</div>
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
        panel.querySelectorAll('.ytc-mode-btn').forEach((modeBtn) => {
            modeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const mode = modeBtn.getAttribute('data-overlay') || 'off';
                currentConfig.chatOverlay = mode;
                saveConfig(currentConfig);

                panel.querySelectorAll('.ytc-mode-btn').forEach(b => b.classList.remove('active'));
                modeBtn.classList.add('active');

                applyConfigToRoot();
                import('../chat/index.js').then(m => {
                    if (m && typeof m.updateChatOverlayVisibility === 'function') {
                        m.updateChatOverlayVisibility();
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
            });

            item.addEventListener('click', (e) => {
                if (!e.target.closest('.ytc-switch')) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        });

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
