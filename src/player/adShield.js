// ==========================================================================
// TỰ ĐỘNG BỎ QUA VÀ TUA NHANH QUẢNG CÁO VIDEO DỰ PHÒNG (AD SHIELD)
// ==========================================================================

let adShieldInitialized = false;

export function initAdShield() {
    if (adShieldInitialized) return;
    adShieldInitialized = true;

    function handleVideoAds() {
        const player = document.querySelector('#movie_player, .html5-video-player');
        if (!player) return;

        const isAdShowing = player.classList.contains('ad-showing') || 
                            player.classList.contains('ad-interrupting') ||
                            !!player.querySelector('.ytp-ad-player-overlay, .ytp-ad-text, .video-ads .ad-showing');

        if (isAdShowing) {
            const video = player.querySelector('video.html5-main-video') || player.querySelector('video');
            if (video) {
                // 1. Nếu có thể tua nhanh video quảng cáo
                if (isFinite(video.duration) && video.duration > 0) {
                    try {
                        video.currentTime = video.duration;
                    } catch (e) {}
                }
                // Tăng tốc độ phát quảng cáo lên 16x để kết thúc tức thì
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
        }
    }

    // Quét định kỳ nhẹ nhàng
    setInterval(handleVideoAds, 250);

    // Bắt nhịp qua MutationObserver khi container quảng cáo xuất hiện
    const obs = new MutationObserver(() => {
        handleVideoAds();
    });

    const target = document.querySelector('#movie_player') || document.body;
    if (target) {
        obs.observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }
}
