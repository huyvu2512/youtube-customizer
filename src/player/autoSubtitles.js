// ==========================================================================
// TÍNH NĂNG PHỤ ĐỀ TỰ ĐỘNG (AUTO SUBTITLES & LIVE CAPTION SYNC)
// - Tự động kích hoạt phụ đề cho video và các luồng phát trực tiếp (Live Stream)
// - Dùng native caption player của YouTube, đồng bộ font chữ & khung nền người dùng setup
// - Tự động dịch sang ngôn ngữ ưu tiên (mặc định theo ngôn ngữ YouTube/hệ thống)
// - Ghim ngôn ngữ ưu tiên lên đầu tiên trong menu chọn phụ đề của YouTube Player
// ==========================================================================
import { currentConfig } from '../core/config.js';

let isCaptionsModuleLoaded = false;
let observerAttached = false;

/**
 * Xác định ngôn ngữ mục tiêu (mặc định theo ngôn ngữ YouTube/trình duyệt)
 */
export function getTargetCaptionLang() {
    const cfgLang = currentConfig.captionLanguage || 'auto';
    if (cfgLang !== 'auto') return cfgLang;
    const docLang = (document.documentElement.lang || navigator.language || 'vi').toLowerCase();
    if (docLang.startsWith('vi')) return 'vi';
    if (docLang.startsWith('en')) return 'en';
    if (docLang.startsWith('ja')) return 'ja';
    if (docLang.startsWith('ko')) return 'ko';
    if (docLang.startsWith('zh')) return 'zh';
    return 'vi';
}

/**
 * Tên hiển thị thân thiện cho ngôn ngữ
 */
function getLangDisplayName(code) {
    const map = {
        vi: 'Tiếng Việt',
        en: 'Tiếng Anh (English)',
        ja: 'Tiếng Nhật (日本語)',
        ko: 'Tiếng Hàn (한국어)',
        zh: 'Tiếng Trung (中文)'
    };
    return map[code] || code.toUpperCase();
}

/**
 * Tìm phần tử movie_player
 */
function getPlayer() {
    return document.getElementById('movie_player') || document.querySelector('.html5-video-player');
}

/**
 * Kích hoạt phụ đề và thiết lập ngôn ngữ ưu tiên
 */
export function applyAutoSubtitles() {
    if (!currentConfig.autoSubtitles) return;

    const player = getPlayer();
    if (!player) return;

    try {
        // 1. Mở khóa và hiện nút phụ đề trên Live Stream nếu bị YouTube ẩn
        const subBtn = player.querySelector('.ytp-subtitles-button') || document.querySelector('.ytp-subtitles-button');
        if (subBtn) {
            subBtn.style.display = 'inline-block';
            subBtn.removeAttribute('aria-disabled');
        }

        // 2. Load module captions nếu chưa load
        if (typeof player.loadModule === 'function' && !isCaptionsModuleLoaded) {
            player.loadModule('captions');
            isCaptionsModuleLoaded = true;
        }

        // 3. Đảm bảo bật phụ đề (Subtitles ON)
        const isSubOn = (typeof player.isSubtitlesOn === 'function' && player.isSubtitlesOn()) ||
                        (subBtn && subBtn.getAttribute('aria-pressed') === 'true');

        if (!isSubOn) {
            if (typeof player.toggleSubtitlesOn === 'function') {
                player.toggleSubtitlesOn();
            } else if (subBtn) {
                subBtn.click();
            }
        }

        // 4. Lấy danh sách track phụ đề
        const tracklist = (typeof player.getOption === 'function' && player.getOption('captions', 'tracklist')) || [];
        if (!tracklist || tracklist.length === 0) {
            // Có thể tracklist chưa load xong, thử lại sau 800ms
            setTimeout(() => {
                const retryPlayer = getPlayer();
                const retryTracks = retryPlayer && typeof retryPlayer.getOption === 'function' && retryPlayer.getOption('captions', 'tracklist');
                if (retryTracks && retryTracks.length > 0) {
                    selectPreferredTrack(retryPlayer, retryTracks);
                }
            }, 800);
            return;
        }

        selectPreferredTrack(player, tracklist);
    } catch (e) {
        // Bỏ qua lỗi ngầm định
    }
}

/**
 * Chọn track phụ đề phù hợp nhất (hoặc Auto-Translate sang targetLang)
 */
function selectPreferredTrack(player, tracklist) {
    if (!player || typeof player.setOption !== 'function') return;

    const targetLang = getTargetCaptionLang();

    // 1. Tìm track khớp ngôn ngữ chính xác (ví dụ có sẵn Tiếng Việt)
    const exactTrack = tracklist.find(t => t.languageCode === targetLang);
    if (exactTrack) {
        player.setOption('captions', 'track', exactTrack);
        return;
    }

    // 2. Nếu không có sẵn ngôn ngữ đích: Dùng tính năng Tự động dịch (Auto-Translate) của YouTube
    const baseTrack = tracklist.find(t => t.kind === 'asr') || tracklist[0];
    if (baseTrack) {
        player.setOption('captions', 'track', {
            languageCode: baseTrack.languageCode,
            translationLanguage: { languageCode: targetLang }
        });
    }
}

/**
 * Ghim ngôn ngữ ưu tiên lên đầu tiên trong menu chọn phụ đề của YouTube Player
 */
function pinPreferredLanguageInMenu() {
    if (!currentConfig.autoSubtitles) return;

    const panelMenu = document.querySelector('.ytp-popup.ytp-settings-menu .ytp-panel-menu');
    if (!panelMenu) return;

    const items = Array.from(panelMenu.querySelectorAll('.ytp-menuitem'));
    if (items.length < 2) return;

    // Kiểm tra xem đây có phải menu phụ đề không (chứa "Tắt" / "Off" / "Dịch tự động" / "Auto-translate")
    const isCaptionMenu = items.some(it => {
        const text = (it.textContent || '').toLowerCase();
        return text.includes('tắt') || text.includes('off') || text.includes('dịch tự động') || text.includes('auto-translate');
    });

    if (!isCaptionMenu) return;

    const targetLang = getTargetCaptionLang();
    const targetLangName = getLangDisplayName(targetLang).toLowerCase();

    // Tìm item trùng với ngôn ngữ ưu tiên
    const matchedItem = items.find(it => {
        const text = (it.textContent || '').toLowerCase();
        return text.includes(targetLangName) || (targetLang === 'vi' && text.includes('tiếng việt'));
    });

    if (matchedItem) {
        // Đưa item này lên ngay sau item "Tắt" (vị trí đầu danh sách ngôn ngữ)
        const offItem = items[0];
        if (offItem && offItem.nextSibling !== matchedItem) {
            panelMenu.insertBefore(matchedItem, offItem.nextSibling);
            matchedItem.style.background = 'rgba(62, 166, 255, 0.15)';
            matchedItem.style.fontWeight = '600';
        }
    } else {
        // Nếu video chỉ có tiếng nước ngoài và cần dịch: Ghim nút chọn nhanh dịch tự động sang targetLang
        const existingCustom = panelMenu.querySelector('.ytc-pinned-caption-item');
        if (!existingCustom) {
            const player = getPlayer();
            const tracklist = (player && typeof player.getOption === 'function' && player.getOption('captions', 'tracklist')) || [];
            const baseTrack = tracklist.find(t => t.kind === 'asr') || tracklist[0];

            if (baseTrack) {
                const customItem = document.createElement('div');
                customItem.className = 'ytp-menuitem ytc-pinned-caption-item';
                customItem.setAttribute('role', 'menuitemradio');
                customItem.setAttribute('tabindex', '0');
                customItem.style.cssText = 'background: rgba(62, 166, 255, 0.18); font-weight: 600; color: #3ea6ff; cursor: pointer;';
                customItem.innerHTML = `
                    <div class="ytp-menuitem-icon"></div>
                    <div class="ytp-menuitem-label">⭐ ${getLangDisplayName(targetLang)} (Tự động dịch)</div>
                    <div class="ytp-menuitem-content"></div>
                `;

                customItem.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    if (player && typeof player.setOption === 'function') {
                        player.setOption('captions', 'track', {
                            languageCode: baseTrack.languageCode,
                            translationLanguage: { languageCode: targetLang }
                        });
                    }
                    const settingsBtn = document.querySelector('.ytp-settings-button');
                    if (settingsBtn) settingsBtn.click();
                });

                const offItem = items[0];
                if (offItem) {
                    panelMenu.insertBefore(customItem, offItem.nextSibling);
                } else {
                    panelMenu.prepend(customItem);
                }
            }
        }
    }
}

/**
 * Khởi tạo hệ thống phụ đề tự động
 */
export function initAutoSubtitles() {
    // Theo dõi menu cài đặt của YouTube Player để ghim ngôn ngữ ưu tiên lên đầu
    if (!observerAttached) {
        observerAttached = true;
        const menuObserver = new MutationObserver(() => {
            pinPreferredLanguageInMenu();
        });
        menuObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Lắng nghe khi điều hướng trang video
    window.addEventListener('yt-navigate-finish', () => {
        isCaptionsModuleLoaded = false;
        setTimeout(() => {
            applyAutoSubtitles();
        }, 1000);
    });

    // Lần tải đầu tiên
    setTimeout(() => {
        applyAutoSubtitles();
    }, 1500);
}
