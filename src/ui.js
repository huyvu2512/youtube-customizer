// ==========================================================================
// YOUTUBE CUSTOMIZER - GIAO DIỆN BẢNG CÀI ĐẶT 4 TAB & BIỂU TƯỢNG (UI & ICONS)
// ==========================================================================
import { currentConfig, saveConfig, applyConfigToRoot } from './index.js';
import { safeHTML, whenElement } from './features.js';

// --------------------------------------------------------------------------
// 1. BIỂU TƯỢNG SVG (LUCIDE ICONS)
// --------------------------------------------------------------------------
const GEAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>`;
const GRID_SVG = `<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z"/></svg>`;
const SHORTS_SVG = `<svg viewBox="0 0 24 24"><path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.5v-5l4.5 2.5-4.5 2.5z"/></svg>`;
const GAMEPAD_SVG = `<svg viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S20.17 9 21 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`;
const YOUTUBE_SVG = `<svg viewBox="0 0 24 24"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/></svg>`;
const SEARCH_SVG = `<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z"/></svg>`;
const SPARKLE_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2z"/></svg>`;
const KEYBOARD_SVG = `<svg viewBox="0 0 24 24"><path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>`;
const CROWN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`;
const COMPASS_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;
const LAYOUT_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M4 4h16v4H4V4zm0 6h7v10H4V10zm9 0h7v10h-7V10z"/></svg>`;
const SHIELD_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>`;
const PLAYER_TAB_SVG = `<svg viewBox="0 0 24 24"><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/></svg>`;
const POST_SVG = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`;
const ENDSCREEN_SVG = `<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-4h6v4zm6 0h-5v-4h5v4zm0-6H6V7h12v4z"/></svg>`;
const BELL_OFF_SVG = `<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>`;
const WATERMARK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
const REWIND_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`;
const MESSAGE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;

// --------------------------------------------------------------------------
// 2. BẢNG MENU CÀI ĐẶT (SETTINGS PANEL)
// --------------------------------------------------------------------------
let menuDismissBound = false;
function bindMenuDismiss(panel) {
    if (menuDismissBound) return;
    menuDismissBound = true;

    document.addEventListener('click', (e) => {
        if (panel && panel.classList.contains('open')) {
            if (!e.target.closest('#ytc-settings-panel') && !e.target.closest('#ytc-settings-btn')) {
                panel.classList.remove('open');
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel && panel.classList.contains('open')) {
            panel.classList.remove('open');
        }
    });
}

function createSettingsPanel(btn) {
    let panel = document.getElementById('ytc-settings-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'ytc-settings-panel';
        panel.innerHTML = safeHTML(`
            <div class="ytc-header">
                <span>YouTube Customizer</span>
                <span class="ytc-header-badge">v2.9</span>
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

                <!-- Ẩn logo góc video (MỚI) -->
                <div class="ytc-item" data-toggle="hideWatermark">
                    <div class="ytc-item-left">
                        ${WATERMARK_SVG}
                        <span>Ẩn logo góc video</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-watermark" ${currentConfig.hideWatermark ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

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

                <div class="ytc-item" data-toggle="unlockLiveDvr">
                    <div class="ytc-item-left">
                        ${REWIND_SVG}
                        <span>Mở khóa tua Live Stream</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-livedvr" ${currentConfig.unlockLiveDvr ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>

                <div class="ytc-item" id="ytc-row-chatoverlay">
                    <div class="ytc-item-left">
                        ${MESSAGE_SVG}
                        <span>Chat trên Video</span>
                    </div>
                    <div class="ytc-mode-group">
                        <button class="ytc-mode-btn ${(!currentConfig.chatOverlay || currentConfig.chatOverlay === 'off') ? 'active' : ''}" data-overlay="off">Tắt</button>
                        <button class="ytc-mode-btn ${currentConfig.chatOverlay === 'danmaku' ? 'active' : ''}" data-overlay="danmaku">Ngang</button>
                        <button class="ytc-mode-btn ${currentConfig.chatOverlay === 'streamer' ? 'active' : ''}" data-overlay="streamer">Nổi</button>
                    </div>
                </div>

                <div class="ytc-item" data-toggle="chatOverlayHideOnRewind">
                    <div class="ytc-item-left">
                        ${REWIND_SVG}
                        <span>Ẩn chat khi tua lùi</span>
                    </div>
                    <label class="ytc-switch">
                        <input type="checkbox" id="ytc-chk-overlayrewind" ${currentConfig.chatOverlayHideOnRewind ? 'checked' : ''}>
                        <span class="ytc-slider"></span>
                    </label>
                </div>
            </div>

            <!-- TAB 4: PHÍM TẮT & TIỆN ÍCH -->
            <div class="ytc-tab-pane" id="ytc-pane-shortcuts">
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

                <div class="ytc-shortcut-hint">
                    <div><kbd>A</kbd> / <kbd>D</kbd> : Tua lùi / tiến 5 giây</div>
                    <div style="margin-top:4px"><kbd>S</kbd> : Tạm dừng / phát tiếp</div>
                    <div style="margin-top:4px"><kbd>1-9 (Numpad)</kbd> : Tua nhanh 10s - 90s</div>
                    <div style="margin-top:4px"><kbd>Shift + Numpad</kbd> : Tua lùi theo giây</div>
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

// --------------------------------------------------------------------------
// 3. NÚT CÀI ĐẶT BÁNH RĂNG TRÊN MASTHEAD & OBSERVER
// --------------------------------------------------------------------------
export function ensureSettingsElements() {
    const endContainer = document.querySelector('ytd-masthead #end, #masthead #end, #end.ytd-masthead');
    if (!endContainer) return;

    let btn = document.getElementById('ytc-settings-btn');
    const isNewBtn = !btn;
    if (isNewBtn) {
        btn = document.createElement('button');
        btn.id = 'ytc-settings-btn';
        btn.title = 'YouTube Customizer';
        btn.innerHTML = safeHTML(GEAR_SVG);
    }

    if (btn.parentElement !== endContainer || btn !== endContainer.firstElementChild) {
        endContainer.insertBefore(btn, endContainer.firstElementChild);
    }

    createSettingsPanel(btn);
}

export function setupSettingsObserver() {
    ensureSettingsElements();

    const attach = (masthead) => {
        ensureSettingsElements();
        new MutationObserver(() => {
            ensureSettingsElements();
        }).observe(masthead, { childList: true, subtree: true });
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
