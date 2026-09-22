// ==========================================================================
// MỞ KHÓA TUA LẠI LIVE STREAM (FORCE ENABLE LIVE DVR)
// BẢO VỆ TUYỆT ĐỐI KHÔNG GÂY XUNG ĐỘT VỚI UBLOCK ORIGIN / AD-BLOCKERS
// ==========================================================================
import { currentConfig } from '../core/config.js';

let liveDvrHooked = false;

function patchData(data) {
    if (!currentConfig.unlockLiveDvr) return;
    if (!data || typeof data !== 'object') return;
    if (data.videoDetails && data.videoDetails.isLive) {
        if (data.videoDetails.isLiveDvrEnabled === false) {
            data.videoDetails.isLiveDvrEnabled = true;
        }
    }
}

export function initLiveDvrHook() {
    // 1. NẾU TÍNH NĂNG ĐANG TẮT: TUYỆT ĐỐI KHÔNG CAN THIỆP VÀO WINDOW HAY JSON.PARSE!
    // Giúp uBlock Origin chạy 100% trơn tru, không bao giờ bị dính quảng cáo 6s!
    if (!currentConfig.unlockLiveDvr) return;
    if (liveDvrHooked) return;
    liveDvrHooked = true;

    // 2. Can thiệp an toàn vào ytInitialPlayerResponse (bảo toàn descriptor của uBlock Origin)
    try {
        const existingDesc = Object.getOwnPropertyDescriptor(window, 'ytInitialPlayerResponse');
        let _val = window.ytInitialPlayerResponse;
        if (_val) patchData(_val);

        if (existingDesc && existingDesc.configurable === false) {
            // Nếu uBlock Origin hoặc trình duyệt đã đóng băng descriptor, không cố ghi đè
            if (window.ytInitialPlayerResponse) patchData(window.ytInitialPlayerResponse);
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
                    patchData(_val);
                },
                configurable: true,
                enumerable: true
            });
        }
    } catch (e) {}

    // 3. Can thiệp JSON.parse khi chuyển video (chỉ áp dụng khi có chuỗi isLiveDvrEnabled)
    try {
        const origParse = JSON.parse;
        JSON.parse = function(text, reviver) {
            const res = origParse.apply(this, arguments);
            if (
                currentConfig.unlockLiveDvr &&
                typeof text === 'string' &&
                text.includes('isLiveDvrEnabled') &&
                res &&
                typeof res === 'object' &&
                res.videoDetails &&
                res.videoDetails.isLive &&
                res.videoDetails.isLiveDvrEnabled === false
            ) {
                res.videoDetails.isLiveDvrEnabled = true;
            }
            return res;
        };
    } catch (e) {}
}
