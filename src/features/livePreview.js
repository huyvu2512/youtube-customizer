// ==========================================================================
// ẢNH XEM TRƯỚC LIVE STREAM THỜI GIAN THỰC (REAL-TIME LIVE STREAM PREVIEW 360P)
// Tự động nhận diện tối đa 5 thẻ Live trong tầm nhìn (Sliding Window), nạp frame
// 360p siêu tốc và ngắt ngay lập tức để tiết kiệm 100% tài nguyên CPU/GPU/RAM.
// ==========================================================================
import { currentConfig, onConfigChange } from '../core/config.js';
import { t } from '../core/i18n.js';

let isInitialized = false;
let cardObserver = null;
let mutationObserver = null;
let refreshTimer = null;
let isProcessingQueue = false;
let currentWorkerIframe = null;

const visibleCards = new Set();
const snapshotCache = new Map(); // videoId -> { url, time }
const MAX_CONCURRENT_CARDS = 5;
const CACHE_TTL_MS = 40000;      // 40 giây giữ cache ảnh
const REFRESH_INTERVAL_MS = 45000;// 45 giây làm mới một chu kỳ

/**
 * Kiểm tra xem trang hiện tại có phải trang áp dụng (Home, Search, Feeds) hay không
 */
function isSupportedRoute() {
    const path = location.pathname;
    return path === '/' || path.startsWith('/results') || path.startsWith('/feed');
}

/**
 * Nhận diện thẻ có phải là Live Stream đang phát trực tiếp hay không
 */
function isLiveCard(card) {
    if (!card || !card.isConnected) return false;

    // 1. Kiểm tra badge overlay "LIVE" hoặc "Trực tiếp"
    const liveTimeOverlay = card.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="LIVE"]');
    if (liveTimeOverlay) return true;

    const liveBadge = card.querySelector(
        '.badge-style-type-live, .badge-style-type-live-now, ' +
        'badge-shape[aria-label*="Trực tiếp" i], badge-shape[aria-label*="LIVE" i], ' +
        'span[aria-label*="TRỰC TIẾP" i], span[aria-label*="LIVE" i]'
    );
    if (liveBadge) return true;

    // 2. Kiểm tra link href dạng /live/ hoặc text trong badge thumbnail
    const thumbLink = card.querySelector('a#thumbnail, a[href*="/live/"]');
    if (thumbLink) {
        const href = thumbLink.getAttribute('href') || '';
        if (href.startsWith('/live/')) return true;
    }

    const badgeText = card.querySelector('ytd-badge-supported-renderer, .ytd-badge-supported-renderer');
    if (badgeText) {
        const txt = (badgeText.textContent || '').trim().toLowerCase();
        if (txt === 'trực tiếp' || txt === 'live') return true;
    }

    return false;
}

/**
 * Trích xuất 11 ký tự Video ID từ thẻ video
 */
function getVideoIdFromCard(card) {
    const link = card.querySelector('a#thumbnail[href*="/watch?v="], a[href*="/watch?v="], a[href*="/live/"]');
    if (!link) return null;
    const href = link.getAttribute('href') || '';
    const vMatch = href.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (vMatch) return vMatch[1];
    const liveMatch = href.match(/\/live\/([a-zA-Z0-9_-]{11})/);
    if (liveMatch) return liveMatch[1];
    return null;
}

/**
 * Hiển thị ảnh snapshot lên thẻ video với hiệu ứng chuyển cảnh mượt
 */
function applySnapshotToCard(card, imageUrl) {
    if (!card || !card.isConnected) return;
    const thumb = card.querySelector('ytd-thumbnail #thumbnail, a#thumbnail, #thumbnail');
    if (!thumb) return;

    let overlay = thumb.querySelector('.ytc-live-snapshot-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'ytc-live-snapshot-overlay';
        overlay.innerHTML = `
            <img class="ytc-live-snapshot-img" alt="Live Preview" />
            <div class="ytc-live-snapshot-badge">
                <span class="ytc-live-snapshot-dot"></span>
                <span class="ytc-live-snapshot-label">${t('live_now') || 'Trực tiếp'}</span>
            </div>
        `;
        thumb.appendChild(overlay);
    }

    const img = overlay.querySelector('.ytc-live-snapshot-img');
    if (img && img.src !== imageUrl) {
        img.src = imageUrl;
    }
    requestAnimationFrame(() => {
        overlay.classList.add('ytc-loaded');
    });
}

/**
 * Chụp 1 khung hình 360p chớp nhoáng từ video live bằng iframe cùng nguồn
 */
function captureSingleLiveFrame(videoId) {
    return new Promise((resolve) => {
        // Kiểm tra cache còn hạn
        const cached = snapshotCache.get(videoId);
        if (cached && (Date.now() - cached.time < CACHE_TTL_MS)) {
            return resolve(cached.url);
        }

        const fallbackUrl = `https://i.ytimg.com/vi/${videoId}/hq720.jpg?t=${Date.now()}`;
        const timeoutId = setTimeout(() => {
            cleanup();
            resolve(fallbackUrl);
        }, 3200);

        let iframe = document.createElement('iframe');
        iframe.className = 'ytc-live-snapshot-worker';
        iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:640px;height:360px;opacity:0;pointer-events:none;z-index:-1;';
        iframe.setAttribute('allow', 'autoplay');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&playsinline=1`);
        currentWorkerIframe = iframe;

        function cleanup() {
            clearTimeout(timeoutId);
            if (iframe && iframe.parentNode) {
                try { iframe.remove(); } catch (e) {}
            }
            if (currentWorkerIframe === iframe) {
                currentWorkerIframe = null;
            }
        }

        let checkInterval = null;
        let attempts = 0;

        function checkFrame() {
            attempts++;
            if (attempts > 30) { // ~3s
                clearInterval(checkInterval);
                cleanup();
                return resolve(fallbackUrl);
            }

            try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                const video = doc ? doc.querySelector('video') : null;
                if (video && video.videoWidth >= 200 && (video.currentTime > 0.1 || video.readyState >= 2)) {
                    clearInterval(checkInterval);
                    const canvas = document.createElement('canvas');
                    canvas.width = 640;
                    canvas.height = 360;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, 640, 360);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

                    cleanup();
                    snapshotCache.set(videoId, { url: dataUrl, time: Date.now() });
                    return resolve(dataUrl);
                }
            } catch (err) {
                // Nếu dính giới hạn trình duyệt thì fallback ảnh CDN ngay
                clearInterval(checkInterval);
                cleanup();
                return resolve(fallbackUrl);
            }
        }

        iframe.onload = () => {
            checkInterval = setInterval(checkFrame, 100);
        };
        iframe.onerror = () => {
            cleanup();
            resolve(fallbackUrl);
        };

        document.body.appendChild(iframe);
    });
}

/**
 * Xử lý hàng đợi tuần tự tối đa 5 thẻ Live trong tầm nhìn (Sliding Window)
 */
async function processLiveQueue() {
    if (!currentConfig.livePreview || !isSupportedRoute() || document.hidden) {
        isProcessingQueue = false;
        return;
    }
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    // Lọc ra các thẻ đang thực sự hiển thị trên màn hình
    const inViewCards = Array.from(visibleCards)
        .filter(card => card.isConnected && isLiveCard(card))
        .slice(0, MAX_CONCURRENT_CARDS);

    for (const card of inViewCards) {
        if (!currentConfig.livePreview || !isSupportedRoute() || document.hidden) break;
        if (!card.isConnected || !visibleCards.has(card)) continue;

        const videoId = getVideoIdFromCard(card);
        if (!videoId) continue;

        try {
            const snapshotUrl = await captureSingleLiveFrame(videoId);
            if (card.isConnected && visibleCards.has(card) && snapshotUrl) {
                applySnapshotToCard(card, snapshotUrl);
            }
        } catch (e) {}

        // Nghỉ nhẹ 150ms giữa các thẻ để nhường CPU cho giao diện
        await new Promise(r => setTimeout(r, 150));
    }

    isProcessingQueue = false;

    // Ngủ đông hoàn toàn 45s trước khi quét làm mới lượt tiếp theo
    if (refreshTimer) clearTimeout(refreshTimer);
    if (currentConfig.livePreview && isSupportedRoute() && !document.hidden) {
        refreshTimer = setTimeout(() => {
            processLiveQueue();
        }, REFRESH_INTERVAL_MS);
    }
}

/**
 * Quét DOM tìm các thẻ Live và đưa vào IntersectionObserver
 */
function scanLiveCards(root = document) {
    if (!currentConfig.livePreview || !isSupportedRoute()) return;
    if (!cardObserver) return;

    const cards = root.querySelectorAll(
        'ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer'
    );

    cards.forEach((card) => {
        if (card.dataset.ytcLiveObserved) return;
        if (isLiveCard(card)) {
            card.dataset.ytcLiveObserved = '1';
            cardObserver.observe(card);
        }
    });
}

/**
 * Khởi tạo bộ quan sát tầm nhìn (IntersectionObserver)
 */
function initIntersectionObserver() {
    if (cardObserver) return;

    cardObserver = new IntersectionObserver((entries) => {
        let changed = false;
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (!visibleCards.has(entry.target)) {
                    visibleCards.add(entry.target);
                    changed = true;
                }
            } else {
                if (visibleCards.has(entry.target)) {
                    visibleCards.delete(entry.target);
                }
            }
        });

        if (changed && !isProcessingQueue) {
            processLiveQueue();
        }
    }, {
        rootMargin: '120px 0px 120px 0px',
        threshold: 0.05
    });
}

/**
 * Xóa sạch toàn bộ overlay và giải phóng tài nguyên
 */
function clearAllLiveSnapshots() {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
    if (currentWorkerIframe) {
        try { currentWorkerIframe.remove(); } catch (e) {}
        currentWorkerIframe = null;
    }
    if (cardObserver) {
        cardObserver.disconnect();
        cardObserver = null;
    }
    visibleCards.clear();
    isProcessingQueue = false;

    document.querySelectorAll('.ytc-live-snapshot-overlay').forEach((el) => {
        try { el.remove(); } catch (e) {}
    });
    document.querySelectorAll('[data-ytc-live-observed]').forEach((el) => {
        delete el.dataset.ytcLiveObserved;
    });
}

/**
 * Đồng bộ trạng thái khi cấu hình thay đổi hoặc chuyển trang
 */
export function syncLivePreviewState() {
    if (!currentConfig.livePreview || !isSupportedRoute()) {
        clearAllLiveSnapshots();
        return;
    }

    initIntersectionObserver();
    scanLiveCards(document);
    processLiveQueue();
}

/**
 * Khởi chạy module Live Preview
 */
export function initLivePreview() {
    if (isInitialized) return;
    isInitialized = true;

    onConfigChange(syncLivePreviewState);

    // Lắng nghe điều hướng trang của YouTube
    document.addEventListener('yt-navigate-start', () => {
        clearAllLiveSnapshots();
    });

    document.addEventListener('yt-navigate-finish', () => {
        syncLivePreviewState();
    });

    window.addEventListener('popstate', () => {
        syncLivePreviewState();
    });

    // Tạm dừng khi ẩn tab, tiếp tục khi mở tab
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (refreshTimer) clearTimeout(refreshTimer);
        } else if (currentConfig.livePreview && isSupportedRoute()) {
            processLiveQueue();
        }
    });

    // Theo dõi DOM nạp thêm video khi cuộn trang
    mutationObserver = new MutationObserver((mutations) => {
        if (!currentConfig.livePreview || !isSupportedRoute()) return;
        let hasNewNodes = false;
        for (const m of mutations) {
            if (m.addedNodes.length > 0) {
                hasNewNodes = true;
                break;
            }
        }
        if (hasNewNodes) {
            scanLiveCards(document);
        }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    syncLivePreviewState();
}
