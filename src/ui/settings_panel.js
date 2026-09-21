// BẢNG CÀI ĐẶT DROPDOWN 4 TAB CHUẨN YOUTUBE
import { currentConfig, saveConfig, applyConfigToRoot } from '../config/index.js';
import { safeHTML } from '../core/dom.js';
import {
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
    BELL_OFF_SVG
} from '../icons/svgs.js';

let menuDismissBound = false;
export function bindMenuDismiss(panel) {
    if (menuDismissBound) return;
    menuDismissBound = true;

    // Bấm ra ngoài để đóng menu
    document.addEventListener('click', (e) => {
        if (panel && panel.classList.contains('open')) {
            if (!e.target.closest('#ytc-settings-panel') && !e.target.closest('#ytc-settings-btn')) {
                panel.classList.remove('open');
            }
        }
    });

    // Bấm Esc để đóng menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel && panel.classList.contains('open')) {
            panel.classList.remove('open');
        }
    });
}

export function createSettingsPanel(btn) {
    let panel = document.getElementById('ytc-settings-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'ytc-settings-panel';
        panel.innerHTML = safeHTML(`
            <div class="ytc-header">
                <span>YouTube Customizer</span>
                <span class="ytc-header-badge">v2.6</span>
            </div>

            <!-- Thanh Tabs điều hướng 4 nhóm -->
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
                <!-- Số cột trang chủ -->
                <div class="ytc-item" id="ytc-row-cols">
                    <div class="ytc-item-left">
                        ${GRID_SVG}
                        <span>Số cột trang chủ</span>
                    </div>
                    <div class="ytc-cols-group">
                        <button class="ytc-col-btn ${currentConfig.columns === 3 ? 'active' : ''}" data-cols="3">3</button>
                        <button class="ytc-col-btn ${currentConfig.columns === 4 ? 'active' : ''}" data-cols="4">4</button>
                        <button class="ytc-col-btn ${currentConfig.columns === 5 ? 'active' : ''}" data-cols="5">5</button>
                    </div>
                </div>

                <!-- Logo Premium -->
                <div class="ytc-item" data-toggle="premiumLogo">
                    <div class="ytc-item-left">
                        ${YOUTUBE_SVG}
                        <span>Logo Premium</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-logo" ${currentConfig.premiumLogo ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Ẩn Khám phá các chủ đề khác -->
                <div class="ytc-item" data-toggle="hideExploreTopics">
                    <div class="ytc-item-left">
                        ${COMPASS_SVG}
                        <span>Ẩn Khám phá chủ đề</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-explore" ${currentConfig.hideExploreTopics ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 2: LỌC NỘI DUNG SẠCH -->
            <div class="ytc-tab-pane" id="ytc-pane-filter">
                <!-- Ẩn Shorts -->
                <div class="ytc-item" data-toggle="hideShorts">
                    <div class="ytc-item-left">
                        ${SHORTS_SVG}
                        <span>Ẩn mục Shorts</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-shorts" ${currentConfig.hideShorts ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Ẩn Chơi game (Playables) -->
                <div class="ytc-item" data-toggle="hidePlayables">
                    <div class="ytc-item-left">
                        ${GAMEPAD_SVG}
                        <span>Ẩn mục Chơi game</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-playables" ${currentConfig.hidePlayables ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Ẩn mục video Hội viên -->
                <div class="ytc-item" data-toggle="hideMembersOnly">
                    <div class="ytc-item-left">
                        ${CROWN_SVG}
                        <span>Ẩn video Hội viên</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-members" ${currentConfig.hideMembersOnly ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Ẩn bài đăng cộng đồng (MỚI) -->
                <div class="ytc-item" data-toggle="hideCommunity">
                    <div class="ytc-item-left">
                        ${POST_SVG}
                        <span>Ẩn bài đăng cộng đồng</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-community" ${currentConfig.hideCommunity ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Lọc tìm kiếm sạch (Clean Search) -->
                <div class="ytc-item" data-toggle="cleanSearch">
                    <div class="ytc-item-left">
                        ${SEARCH_SVG}
                        <span>Lọc tìm kiếm sạch</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-search" ${currentConfig.cleanSearch ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 3: TRÌNH PHÁT & VIDEO -->
            <div class="ytc-tab-pane" id="ytc-pane-player">
                <!-- Tắt hiệu ứng ánh sáng (Disable Ambient) -->
                <div class="ytc-item" data-toggle="disableAmbient">
                    <div class="ytc-item-left">
                        ${SPARKLE_SVG}
                        <span>Tắt ánh sáng video</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-ambient" ${currentConfig.disableAmbient ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Ẩn thẻ kết thúc & chú thích (MỚI) -->
                <div class="ytc-item" data-toggle="hideEndscreen">
                    <div class="ytc-item-left">
                        ${ENDSCREEN_SVG}
                        <span>Ẩn thẻ kết thúc/chú thích</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-endscreen" ${currentConfig.hideEndscreen ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Tự động đóng banner khuyến mại (MỚI) -->
                <div class="ytc-item" data-toggle="autoDismissPromos">
                    <div class="ytc-item-left">
                        ${BELL_OFF_SVG}
                        <span>Tự đóng banner quảng cáo</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-promos" ${currentConfig.autoDismissPromos ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 4: PHÍM TẮT & TIỆN ÍCH -->
            <div class="ytc-tab-pane" id="ytc-pane-shortcuts">
                <!-- Phím tắt A-S-D / Numpad -->
                <div class="ytc-item" data-toggle="keyboardControls">
                    <div class="ytc-item-left">
                        ${KEYBOARD_SVG}
                        <span>Phím tắt (A-S-D, Numpad)</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-keys" ${currentConfig.keyboardControls ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <!-- Hướng dẫn phím tắt -->
                <div class="ytc-shortcut-hint">
                    <div><kbd>A</kbd> / <kbd>D</kbd> : Tua lùi / tiến 5 giây</div>
                    <div style="margin-top:4px"><kbd>S</kbd> : Tạm dừng / phát tiếp</div>
                    <div style="margin-top:4px"><kbd>1-9 (Numpad)</kbd> : Tua nhanh 10s - 90s</div>
                    <div style="margin-top:4px"><kbd>Shift + Numpad</kbd> : Tua lùi theo giây</div>
                </div>
            </div>
        `);
        (document.body || document.documentElement).appendChild(panel);

        // Sự kiện chuyển Tab trong Menu
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

        // Sự kiện chọn số cột
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

        // Sự kiện bật/tắt Toggle Switch
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
    }

    function updatePanelPosition() {
        const rect = btn.getBoundingClientRect();
        panel.style.top = (rect.bottom + 8) + 'px';
        panel.style.right = Math.max(12, window.innerWidth - rect.right - 10) + 'px';
    }

    btn.addEventListener('mouseenter', updatePanelPosition, { passive: true });
    window.addEventListener('resize', () => {
        if (panel.classList.contains('open')) updatePanelPosition();
    }, { passive: true });

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!panel.style.top) updatePanelPosition();
        panel.classList.toggle('open');
    });

    bindMenuDismiss(panel);
}
