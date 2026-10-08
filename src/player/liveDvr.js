// ==========================================================================
// MỞ KHÓA TUA LẠI LIVE STREAM (FORCE ENABLE LIVE DVR)
// BẢO VỆ TUYỆT ĐỐI KHÔNG GÂY XUNG ĐỘT VỚI UBLOCK ORIGIN / AD-BLOCKERS
// SIÊU TỐI ƯU HIỆU NĂNG - ZERO LAG - ZERO CPU OVERHEAD
// ==========================================================================
import { currentConfig } from '../core/config.js';

let liveDvrHooked = false;

// Giới hạn tua tối đa khi luồng live chạy cực dài (mở rộng lên đến 7 ngày)
const MAX_DVR_SECS = 43200 * 14; // 604,800 giây

function isStreamOver12h(microformat) {
    const live = microformat?.playerMicroformatRenderer?.liveBroadcastDetails;
    if (!live || !live.startTimestamp) return false;
    const seconds = (Date.now() - new Date(live.startTimestamp).getTime()) / 1000;
    return seconds > 43200;
}

function modifyPlayerResponse(pr) {
    if (!pr || typeof pr !== 'object') return;
    const { videoDetails, playerConfig, streamingData, microformat } = pr;
    if (!videoDetails || !videoDetails.isLive) return;

    // 1. Mở khóa tua lại (bỏ cấm tua của chủ kênh)
    videoDetails.isLiveDvrEnabled = true;

    // 2. Tắt cơ chế Server-Driven ABR ép bám mốc trực tiếp của máy chủ YouTube
    const mc = playerConfig?.mediaCommonConfig;
    if (mc) {
        mc.useServerDrivenAbr = false;
        if (mc.serverPlaybackStartConfig) {
            mc.serverPlaybackStartConfig.enable = false;
        }
    }

    // 3. Dỡ bỏ URL Server ABR nếu đã có manifest DASH / HLS chuẩn
    if (streamingData) {
        if (streamingData.serverAbrStreamingUrl && (streamingData.hlsManifestUrl || streamingData.dashManifestUrl)) {
            delete streamingData.serverAbrStreamingUrl;
        }

        // 4. Mở rộng cửa sổ tua nếu luồng live kéo dài hơn 12 giờ
        if (Array.isArray(streamingData.adaptiveFormats) && isStreamOver12h(microformat)) {
            for (const format of streamingData.adaptiveFormats) {
                format.maxDvrDurationSec = MAX_DVR_SECS;
            }
        }
    }
}

export function patchResponse(data) {
    if (!currentConfig.unlockLiveDvr || !data || typeof data !== 'object') return false;
    if (data.videoDetails) {
        modifyPlayerResponse(data);
        return true;
    }
    if (data.playerResponse && data.playerResponse.videoDetails) {
        modifyPlayerResponse(data.playerResponse);
        return true;
    }
    return false;
}

export function initLiveDvrHook() {
    if (liveDvrHooked) return;
    liveDvrHooked = true;

    // 1. Can thiệp an toàn vào ytInitialPlayerResponse (bảo toàn descriptor của uBlock Origin)
    try {
        const existingDesc = Object.getOwnPropertyDescriptor(window, 'ytInitialPlayerResponse');
        let _val = window.ytInitialPlayerResponse;
        if (_val) patchResponse(_val);

        if (existingDesc && existingDesc.configurable === false) {
            // Nếu uBlock Origin hoặc trình duyệt đã đóng băng descriptor, không cố ghi đè
            if (window.ytInitialPlayerResponse) patchResponse(window.ytInitialPlayerResponse);
        } else {
            Object.defineProperty(window, 'ytInitialPlayerResponse', {
                get() {
                    return existingDesc && existingDesc.get ? existingDesc.get.call(this) : _val;
                },
                set(newVal) {
                    if (existingDesc && existingDesc.set) {
                        existingDesc.set.call(this, newVal);
                    }
                    _val = newVal;
                    patchResponse(_val);
                },
                configurable: true,
                enumerable: true
            });
        }
    } catch (e) {}

    // 2. Can thiệp JSON.parse khi chuyển video (SPA Navigation)
    try {
        const origParse = JSON.parse;
        JSON.parse = function(text, reviver) {
            const res = origParse.call(this, text, reviver);
            // BẢO VỆ HIỆU NĂNG TUYỆT ĐỐI (ZERO LAG GUARANTEE):
            // - Nếu tính năng tắt -> lập tức trả kết quả (chỉ tốn 1 phép so sánh boolean trong RAM, < 0.00001ms)
            // - Nếu tính năng bật -> chỉ kiểm tra các chuỗi lớn chứa từ khóa 'isLiveDvrEnabled'
            //   (Chat, bình luận, feed trang chủ, gợi ý tìm kiếm không bao giờ chứa từ khóa này)
            if (
                currentConfig.unlockLiveDvr &&
                typeof text === 'string' &&
                text.length > 100 &&
                text.indexOf('isLiveDvrEnabled') !== -1
            ) {
                try {
                    patchResponse(res);
                } catch (e) {}
            }
            return res;
        };
    } catch (e) {}
}
