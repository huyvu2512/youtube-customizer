// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.8.1
// @description  YouTube Customizer v3.8.1 — Tự động kích hoạt & dịch phụ đề Live Stream/VOD chuẩn YouTube gốc, ghim ngôn ngữ ưu tiên lên đầu menu và tối ưu huy hiệu tính năng nổi bật.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.8.1
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.1
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.8.1
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.8.1:
 * ============================================================================
 * 1. [Phụ đề tự động (Auto Subtitles & Live Subtitles)]:
 *    - Thêm công tắc trong Tab Giao diện cho phép tự động bật phụ đề video & Live Stream.
 *    - Mở khóa nút phụ đề trên các luồng Live Stream đang bị tắt nút.
 *    - Sử dụng chuẩn font chữ, cỡ chữ, viền và nền gốc của YouTube (người dùng tự setup).
 *    - Ghim ngôn ngữ ưu tiên (mặc định theo YouTube/hệ thống hoặc chọn qua menu) lên ngay đầu danh sách phụ đề.
 * 2. [Tinh chỉnh giao diện & Huy hiệu ⭐ nổi bật]:
 *    - Điều chỉnh khoảng cách ngôi sao ⭐ nằm sát chữ "(Ambilight)", loại bỏ độ nghiêng lỏ.
 * ============================================================================
 */
 * 1. [Đại tu Ambilight 2.0 Cinema - Tính năng đặc biệt ⭐]:
 *    - Gắn huy hiệu ngôi sao ⭐ lấp lánh khẳng định tính năng đặc biệt của script.
 *    - Mở rộng canvas tràn viền 60px ra ngoài màn hình, phủ kín 100% 4 góc màn hình và 2 bên mép (Zero White Corners).
 *    - Kéo dài dải màu chiếu rọi sâu gấp đôi (2200px) xuyên suốt vùng bình luận, tan biến êm dịu tự nhiên.
 *    - Tự động bỏ qua viền đen (Cinematic Letterbox 21:9 / 2.39:1) để luôn bắt trọn màu sắc thật của video.
 * 2. [Tách biệt hoàn hảo Dark & Light Theme]:
 *    - Thanh tìm kiếm Light theme trong suốt 100% xuyên thấu ánh sáng phòng.
 *    - Khi cuộn trang ở giao diện sáng: Masthead tự động trở về màu trắng tinh khôi #ffffff.
 *    - Tăng độ bão hòa saturate(220%) và tương phản contrast(115%) cho Ambilight ở nền sáng cực kỳ nổi bật.
 * 3. [Thiết kế Frameless & Công tắc Tự động cập nhật]:
 *    - Playlist & Khung mô tả trong suốt hoàn toàn, loại bỏ viền và bóng đục.
 *    - Thêm công tắc gạt "Tự động cập nhật" trong Tab Thông tin (gọi GitHub API kiểm tra bản mới).
 * ============================================================================
 */
