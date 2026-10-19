import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcEntry = path.join(rootDir, 'src', 'index.js');
const outFile = path.join(rootDir, 'youtube_customizer.js');

const isWatch = process.argv.includes('--watch');

const banner = `// ==UserScript==
// @name         YouTube Customizer
// @namespace    http://tampermonkey.net/
// @version      3.9.18
// @description  YouTube Customizer v3.9.18 — Bỏ huy hiệu ngôi sao cạnh Ambilight.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.9.18:
 * ============================================================================
 * 1. [Giao diện]:
 *    - Gỡ hoàn toàn huy hiệu ngôi sao khỏi mục Ánh sáng phòng (Ambilight).
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
 * ============================================================================
 * CHANGELOG - v3.9.3:
 * ============================================================================
 * 1. [Quản lý tác vụ nền]:
 *    - Chỉ chạy timer Auto Live Sync và Chat Memory GC khi tính năng bật trên trang xem.
 *    - Bỏ qua mutation trong vùng bình luận và overlay chat; giữ nguyên theo dõi trong player.
 *    - Chỉ đọc textContent khi kiểm tra thông báo gián đoạn.
 * ============================================================================
 * CHANGELOG - v3.7.3:
 * ============================================================================
 * 1. [Tính năng mới: Công tắc gạt Tự động cập nhật]:
 *    - Thêm công tắc gạt "Tự động cập nhật" trong Tab Thông tin (Menu bánh răng).
 *    - Mỗi khi vào YouTube, script tự động gọi GitHub API kiểm tra phiên bản mới; nếu phát hiện bản mới sẽ lập tức tự động trỏ sang link cập nhật Tampermonkey.
 *    - Tích hợp Session Guard chống lặp chuyển hướng khi người dùng nhấn Back.
 * 2. [Thiết kế Frameless & Trong suốt 100%]:
 *    - Playlist & Khung mô tả (Description box) trong suốt hoàn toàn, không hiện khung viền.
 * ============================================================================
 */`;

async function buildWithEsbuild() {
    const esbuild = await import('esbuild');

    const buildOptions = {
        entryPoints: [srcEntry],
        bundle: true,
        outfile: outFile,
        format: 'iife',
        target: ['es2020'],
        loader: { '.css': 'text' },
        banner: { js: banner },
        charset: 'utf8',
        legalComments: 'none',
    };

    if (isWatch) {
        const ctx = await esbuild.context(buildOptions);
        await ctx.watch();
        console.log('[YouTube Customizer] Watching for changes in src/...');
    } else {
        const result = await esbuild.build(buildOptions);
        const stats = fs.statSync(outFile);
        console.log(`[YouTube Customizer] Build thành công: ${outFile} (${(stats.size / 1024).toFixed(1)} KB)`);
    }
}

// Chạy build
buildWithEsbuild().catch((err) => {
    console.error('[YouTube Customizer] Build thất bại:', err);
    process.exit(1);
});
