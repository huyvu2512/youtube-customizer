// ==========================================================================
// MIXES FILTER (ẨN DANH SÁCH KẾT HỢP & TỰ ĐỘNG CHUYỂN BÀI ĐỀ XUẤT)
// ==========================================================================
import { currentConfig } from '../core/config.js';
import { whenElement } from '../core/utils.js';

let isMixFilterInitialized = false;
let boundVideoEl = null;

function isRdMixList(listId) {
    return typeof listId === 'string' && listId.startsWith('RD');
}

/**
 * Làm sạch URL trên thanh địa chỉ nếu đang xem video thuộc Mix
 */
export function cleanMixUrl() {
    if (!currentConfig.hideMixes) return;
    if (!window.location.pathname.startsWith('/watch')) return;

    try {
        const url = new URL(window.location.href);
        const list = url.searchParams.get('list');
        if (isRdMixList(list)) {
            url.searchParams.delete('list');
            url.searchParams.delete('index');
            url.searchParams.delete('start_radio');
            const clean = url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '');
            window.history.replaceState(window.history.state, '', clean);
        }
    } catch (e) {}
}

/**
 * Đánh giá xem trang xem hiện tại có đang bị kẹp trong playlist Mix hay không
 */
function isCurrentPageMix() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        if (isRdMixList(urlParams.get('list'))) return true;
    } catch (e) {}

    const playlist = document.querySelector('ytd-playlist-panel-renderer, #playlist');
    if (!playlist) return false;

    if (playlist.classList.contains('ytc-item-mix')) return true;
    if (playlist.querySelector('a[href*="list=RD"]')) return true;

    const text = playlist.textContent || '';
    if (text.includes('Danh sách kết hợp') || text.includes('YouTube tạo danh sách phát này') || text.includes('Mixes')) {
        return true;
    }

    return false;
}

/**
 * Xử lý khi video kết thúc: Nếu đang xem Mix và bật Autoplay của YouTube,
 * tự động chuyển tiếp sang video đề xuất tự nhiên đầu tiên thay vì bị kẹt trong Mix.
 */
function handleVideoEnded() {
    if (!currentConfig.hideMixes) return;
    if (!window.location.pathname.startsWith('/watch')) return;

    if (!isCurrentPageMix()) return;

    // Kiểm tra nút Tự động phát (Autonav) của YouTube có đang bật không
    const autonavBtn = document.querySelector('.ytp-autonav-toggle-button');
    if (autonavBtn && autonavBtn.getAttribute('aria-checked') === 'false') {
        return; // Người dùng chủ động tắt autoplay, không can thiệp
    }

    // Tìm video đề xuất đầu tiên hợp lệ trong danh sách xem tiếp (#related)
    setTimeout(() => {
        const candidateLinks = document.querySelectorAll(
            '#related ytd-compact-video-renderer:not(.ytc-item-mix) a#thumbnail, ' +
            'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer:not(.ytc-item-mix) a#thumbnail'
        );

        for (const link of candidateLinks) {
            if (!link || !link.href) continue;
            try {
                const u = new URL(link.href, window.location.origin);
                const list = u.searchParams.get('list');
                if (!isRdMixList(list)) {
                    link.click();
                    return;
                }
            } catch (e) {}
        }
    }, 400);
}

function bindVideoEndedEvent() {
    const video = document.querySelector('#movie_player video, video.html5-main-video');
    if (!video || video === boundVideoEl) return;

    if (boundVideoEl) {
        boundVideoEl.removeEventListener('ended', handleVideoEnded);
    }
    boundVideoEl = video;
    boundVideoEl.addEventListener('ended', handleVideoEnded);
}

/**
 * Can thiệp trước khi click điều hướng link YouTube
 */
function handleLinkClick(e) {
    if (!currentConfig.hideMixes) return;

    const anchor = e.target.closest && e.target.closest('a[href*="list="]');
    if (!anchor || !anchor.href) return;

    try {
        const u = new URL(anchor.href, window.location.origin);
        const list = u.searchParams.get('list');
        if (isRdMixList(list)) {
            u.searchParams.delete('list');
            u.searchParams.delete('index');
            u.searchParams.delete('start_radio');
            anchor.href = u.pathname + (u.searchParams.toString() ? '?' + u.searchParams.toString() : '');

            // Nếu phần tử chứa dữ liệu polymer navigation endpoint
            if (anchor.data && anchor.data.navigationEndpoint && anchor.data.navigationEndpoint.watchEndpoint) {
                delete anchor.data.navigationEndpoint.watchEndpoint.playlistId;
                delete anchor.data.navigationEndpoint.watchEndpoint.index;
                delete anchor.data.navigationEndpoint.watchEndpoint.params;
            }
        }
    } catch (err) {}
}

/**
 * Can thiệp sự kiện điều hướng nội bộ SPA của YouTube (yt-navigate-start)
 */
function handleYtNavigateStart(e) {
    if (!currentConfig.hideMixes) return;

    if (e && e.detail) {
        if (e.detail.url && e.detail.url.includes('list=RD')) {
            try {
                const u = new URL(e.detail.url, window.location.origin);
                const list = u.searchParams.get('list');
                if (isRdMixList(list)) {
                    u.searchParams.delete('list');
                    u.searchParams.delete('index');
                    u.searchParams.delete('start_radio');
                    e.detail.url = u.pathname + (u.searchParams.toString() ? '?' + u.searchParams.toString() : '');
                }
            } catch (err) {}
        }

        if (e.detail.endpoint && e.detail.endpoint.watchEndpoint) {
            const ep = e.detail.endpoint.watchEndpoint;
            if (isRdMixList(ep.playlistId)) {
                delete ep.playlistId;
                delete ep.index;
                delete ep.params;
            }
        }
    }
}

/**
 * Kiểm tra và gắn tag vào playlist panel trên watch page
 */
export function tagWatchMixPanel() {
    if (!currentConfig.hideMixes) return;
    const panel = document.querySelector('ytd-playlist-panel-renderer, #playlist');
    if (!panel) return;

    const listParam = new URLSearchParams(window.location.search).get('list');
    if (isRdMixList(listParam) || panel.querySelector('a[href*="list=RD"]')) {
        panel.classList.add('ytc-item-mix');
    } else {
        const text = panel.textContent || '';
        if (text.includes('Danh sách kết hợp') || text.includes('YouTube tạo danh sách phát này') || text.includes('Mixes')) {
            panel.classList.add('ytc-item-mix');
        }
    }
}

export function initMixFilter() {
    if (isMixFilterInitialized) return;
    isMixFilterInitialized = true;

    // 1. Can thiệp click chuột vào bất kỳ link mix nào
    document.addEventListener('click', handleLinkClick, true);

    // 2. Can thiệp điều hướng SPA của YouTube
    document.addEventListener('yt-navigate-start', handleYtNavigateStart, true);

    // 3. Làm sạch URL và gắn sự kiện kết thúc video khi hoàn tất điều hướng
    document.addEventListener('yt-navigate-finish', () => {
        cleanMixUrl();
        tagWatchMixPanel();
        bindVideoEndedEvent();
    });

    window.addEventListener('popstate', () => {
        cleanMixUrl();
        tagWatchMixPanel();
        bindVideoEndedEvent();
    });

    // 4. Lần chạy đầu tiên
    cleanMixUrl();
    tagWatchMixPanel();
    bindVideoEndedEvent();
    whenElement('#movie_player video, video.html5-main-video', () => {
        bindVideoEndedEvent();
    });
}
