// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.9.17
// @description  YouTube Customizer v3.9.17 — Vẽ lại biểu tượng ngôi sao Ambilight bằng SVG.
// @author       Huy Vũ
// @require      https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/youtube_customizer.js?v=3.9.17
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.17
// @downloadURL  https://raw.githubusercontent.com/huyvu2512/youtube-customizer/main/tampermonkey.user.js?v=3.9.17
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.9.17:
 * ============================================================================
 * 1. [Giao diện]:
 *    - Thay emoji ngôi sao Ambilight bằng biểu tượng SVG vẽ riêng, sắc nét và đồng bộ đa nền tảng.
 *    - Bỏ hiệu ứng nhấp nháy liên tục của biểu tượng.
 * ============================================================================
 * CHANGELOG - v3.9.14:
 * ============================================================================
 * 1. [Ánh sáng phòng / Ambilight]:
 *    - Tắt Ambilight trên Shorts để giữ nguyên bố cục và thanh cuộn gốc của YouTube.
 *    - Tiếp tục áp dụng Ambilight cho các trang video thường.
 * ============================================================================
 * CHANGELOG - v3.9.13:
 * ============================================================================
 * 1. [Ánh sáng phòng / Ambilight Shorts]:
 *    - Làm trong track scrollbar riêng của #shorts-container khi Ambilight bật.
 *    - Giữ thumb scrollbar đủ tương phản để nhận biết và kéo được.
 * ============================================================================
 * CHANGELOG - v3.9.12:
 * ============================================================================
 * 1. [Ánh sáng phòng / Ambilight Shorts]:
 *    - Mở rộng vùng sáng theo cùng tỷ lệ 1.8x ngang và 1.3x dọc của nền Shorts YouTube.
 *    - Lấp dải đen do lớp nền điện ảnh gốc bị ẩn khi Ambilight bật.
 * ============================================================================
 * CHANGELOG - v3.9.11:
 * ============================================================================
 * 1. [Ánh sáng phòng / Ambilight Shorts]:
 *    - Giữ nguyên cách YouTube xếp chồng nội dung Shorts khi bật Ambilight.
 *    - Đặt quầng sáng phía sau nội dung bằng stacking context của renderer.
 * ============================================================================
 * CHANGELOG - v3.9.10:
 * ============================================================================
 * 1. [Ánh sáng phòng / Ambilight Shorts]:
 *    - Giới hạn quầng sáng quanh player Shorts, không kéo màu thành dải ngang toàn trang.
 *    - Giữ nguyên kích thước và tỉ lệ player.
 * ============================================================================
 * CHANGELOG - v3.9.9:
 * ============================================================================
 * 1. [Ánh sáng phòng / Ambilight]:
 *    - Bổ sung hỗ trợ player Shorts riêng.
 *    - Vẽ dải ambient vào gutter scrollbar mà không đổi kích thước player.
 * ============================================================================
 * CHANGELOG - v3.9.8:
 * ============================================================================
 * 1. [Ánh sáng phòng / Ambilight]:
 *    - Làm trong track scrollbar để ánh sáng nền hiện xuyên qua ở cả theme sáng/tối.
 * ============================================================================
 * CHANGELOG - v3.9.7:
 * ============================================================================
 * 1. [Ánh sáng phòng / Ambilight]:
 *    - Tính vùng ảnh hiển thị theo object-fit và tỉ lệ thực của video.
 *    - Không crop nhầm video dọc vào tỉ lệ ngang của player khi kéo ánh sáng.
 *    - Làm mới tọa độ khi kích thước nguồn video thay đổi.
 * ============================================================================
 * CHANGELOG - v3.9.6:
 * ============================================================================
 * 1. [Auto Live]:
 *    - Kiểm tra trạng thái mỗi giây và bắt kịp với tốc độ tăng dần theo độ trễ.
 *    - Chỉ snap khi trễ trên 120 giây và player đã sẵn sàng ổn định.
 *    - Bỏ snap ban đầu khi video đang buffer hoặc player đang loading.
 * ============================================================================
 * CHANGELOG - v3.9.5:
 * ============================================================================
 * 1. [Độ phân giải video]:
 *    - Chờ player nạp đúng video và xác nhận chất lượng yêu cầu đã áp dụng.
 *    - Thử lại có giới hạn khi player cập nhật chất lượng chậm sau điều hướng.
 *    - Hủy lượt áp dụng đang chờ khi người dùng chuyển về Tự động.
 * ============================================================================
 * CHANGELOG - v3.9.4:
 * ============================================================================
 * 1. [Độ chính xác chỉ số hiệu năng]:
 *    - Khởi tạo baseline trước khi tính FPS, đặt lại khi đổi video hoặc tạm dừng.
 *    - Hiển thị thời lượng buffer thay cho ước lượng RAM không thể đo từ API video.
 *    - Ghi rõ độ trễ HTTP tới YouTube và tốc độ tải ước tính.
 * 2. [Bản trước: quản lý tác vụ nền]:
 *    - Dừng timer Auto Live Sync và Chat Memory GC khi tính năng tắt hoặc rời trang xem.
 *    - Bỏ qua mutation trong vùng bình luận và overlay chat, giữ theo dõi trong player.
 *    - Bỏ fallback innerText khi đọc thông báo.
 * ============================================================================
 * CHANGELOG - v3.9.3:
 * ============================================================================
 * 1. [Quản lý tác vụ nền]:
 *    - Dừng timer Auto Live Sync và Chat Memory GC khi tính năng tắt hoặc rời trang xem.
 *    - Bỏ qua mutation trong vùng bình luận và overlay chat, giữ theo dõi trong player.
 *    - Bỏ fallback innerText khi đọc thông báo.
 * 2. [Bản trước: tối ưu quét DOM]:
 *    - Bỏ quét XPath toàn trang và các lượt quét lặp sau điều hướng.
 * 3. [Bản trước: Chỉ số hiệu năng]:
 *    - Bỏ chỉ số DOM, phân tách Ping và Tốc độ mạng.
 *    - Rút gọn bảng hiệu năng gồm 4 thẻ chuyên dụng cho streaming: RAM Video, FPS Video,
 *      Độ trễ (Ping) và Tốc độ tải (Mbps).
 * 4. [Hệ thống đèn màu 3 trạng thái chuẩn xác]:
 *    - Xanh lá: Trạng thái tốt / Mượt mà.
 *    - Màu vàng: Trạng thái bình thường / Trung bình.
 *    - Màu đỏ: Cảnh báo giật lag / Tốc độ mạng chậm / Ping cao.
 * ============================================================================
 */
