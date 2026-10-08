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
// @version      3.7.0
// @description  YouTube Customizer v3.7.0 — Sửa lỗi giật video và tự chuyển khi xem trực tiếp; Kính mờ xuyên thấu Searchbox, Playlist, Filter Chips; Sửa nút Trực tiếp; Tối ưu Ambilight Full-Width Cinema.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.0:
 * ============================================================================
 * 1. [Sửa triệt để lỗi giật video & tự chuyển luồng xem Live]:
 *    - Tăng ngưỡng snap từ 10s lên 30s để loại bỏ hiện tượng bị giật / tua đột ngột khi vừa mở video trực tiếp.
 *    - Loại bỏ lệnh kép double-seek trong snapToLive gây xung đột bộ giải mã YouTube.
 *    - Tăng chu kỳ kiểm tra đồng bộ lên 3 giây và hạ tốc độ đuổi kịp xuống 1.04x siêu mượt.
 * 2. [Khung trong suốt & Kính mờ cao cấp]:
 *    - Làm trong suốt khung tìm kiếm (Searchbox), bảng danh sách phát (Playlist panel) và dải thẻ phân loại (Filter chips), hòa quyện cùng ánh sáng phòng.
 * 3. [Sửa lỗi nút Trực tiếp (Live Badge)]:
 *    - Tuyệt đối không chặn sự kiện click vào nút Trực tiếp (.ytp-live-badge) khi đang tua lại xem đoạn trước live.
 *    - Bấm nút Trực tiếp lập tức nhảy ngay về thời gian thực của luồng phát và biến chấm đỏ.
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
