// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.3.0
// @description  YouTube Customizer v3.3.0 — Tùy biến giao diện YouTube, bổ sung Tab Tối Ưu (Chặn AV1/Ép H.264, Tiết kiệm Tab nền, Dọn rác Live Chat RAM, Radio Audio-Only, Chặn tự dừng).
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.3.0
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.0
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.3.0
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.0:
 * ============================================================================
 * 1. [Mới] Bổ sung Tab "Tối Ưu" (Optimization) trong bảng cài đặt:
 *    - Gom các thiết lập giảm tải tài nguyên hệ thống, chuyển công tắc Phím tắt vào tab này
 *      và loại bỏ bảng mô tả phím tắt thừa để giao diện tinh gọn, hiện đại.
 *
 * 2. [Mới] 5 tính năng tối ưu hiệu năng và tài nguyên chuyên sâu:
 *    - Chặn AV1 / Ép Codec H.264: Can thiệp MediaSource & canPlayType chặn AV1 ngốn CPU,
 *      ép YouTube cấp luồng giải mã phần cứng H.264/VP9 mượt mà, mát máy.
 *    - Tiết kiệm Tab nền: Tự động hạ chất lượng video xuống 144p khi tab bị ẩn và khôi phục
 *      độ phân giải cũ khi quay trở lại tab.
 *    - Dọn rác bộ nhớ Live Chat: Giới hạn DOM chat tối đa ~100 tin nhắn, tự động dọn sạch
 *      định kỳ chống tràn bộ nhớ RAM khi xem stream lâu.
 *    - Chế độ Chỉ phát âm thanh (Radio): Ngắt render video, hiển thị bảng âm thanh và hạ
 *      chất lượng tối thiểu để chỉ nghe tiếng, giảm tải triệt để RAM và GPU.
 *    - Chặn tự dừng video ("Bạn vẫn đang xem chứ?"): Tự động xác nhận dialog và làm mới
 *      _lact định kỳ để phát video/nhạc liên tục không bao giờ bị dừng.
 * ============================================================================
 */
