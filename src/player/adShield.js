// ==========================================================================
// TỰ ĐỘNG BỎ QUA VÀ TUA NHANH QUẢNG CÁO VIDEO DỰ PHÒNG (AD SHIELD)
// ==========================================================================
import { whenElement } from '../core/utils.js';

let adShieldInitialized = false;
let wasAdShowing = false;

function isLiveStream(player) {
    if (!player) return false;
    if (typeof player.getVideoData === 'function') {
        const vd = player.getVideoData();
        if (vd && vd.isLive) return true;
    }
    if (typeof player.isLive === 'function') {
        try { if (player.isLive() === true) return true; } catch (e) {}
    }
    if (player.classList.contains('ytp-live') || !!player.querySelector('.ytp-live-badge')) {
        return true;
    }
    if (location.pathname.startsWith('/live/')) {
        return true;
    }
    return false;
}

export function initAdShield() {
    if (adShieldInitialized) return;
    adShieldInitialized = true;

    function handleVideoAds() {
        if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;
        const player = document.querySelector('#movie_player:not(#inline-preview-player)');
        if (!player) return;

        const isAdShowing = player.classList.contains('ad-showing') || 
                            player.classList.contains('ad-interrupting') ||
                            !!player.querySelector('.ytp-ad-player-overlay, .ytp-ad-text, .video-ads .ad-showing');

        const video = player.querySelector('video.html5-main-video') || player.querySelector('video');

        if (isAdShowing) {
            wasAdShowing = true;
            const isLive = isLiveStream(player);

            if (video) {
                // Tăng tốc độ phát quảng cáo lên 16x để kết thúc tức thì mà không can thiệp currentTime
                try {
                    video.playbackRate = 16.0;
                } catch (e) {}
            }

            // 2. Tự động click mọi biến thể nút "Bỏ qua quảng cáo" / "Skip ad"
            const skipButtons = player.querySelectorAll(`
                .ytp-ad-skip-button,
                .ytp-ad-skip-button-modern,
                .ytp-ad-skip-button-container button,
                button.ytp-ad-skip-button,
                .ytp-ad-overlay-close-button,
                [id^="skip-button"] button
            `);
            skipButtons.forEach((btn) => {
                try { btn.click(); } catch (e) {}
            });
        } else if (wasAdShowing) {
            wasAdShowing = false;
            // Khôi phục tốc độ phát chuẩn ngay khi kết thúc quảng cáo
            if (video && video.playbackRate > 2.0) {
                video.playbackRate = 1.0;
            }
        }
    }

    // Quét định kỳ nhẹ nhàng
    setInterval(handleVideoAds, 300);

    // Chỉ theo dõi sự thay đổi class trên #movie_player (khi có class ad-showing)
    // TUYỆT ĐỐI KHÔNG gắn observer subtree lên document.body
    whenElement('#movie_player:not(#inline-preview-player)', (player) => {
        const obs = new MutationObserver(() => {
            handleVideoAds();
        });
        obs.observe(player, { attributes: true, attributeFilter: ['class'] });
    });
}
