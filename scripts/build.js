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
// @version      3.3.4
// @description  YouTube Customizer v3.3.4 — Sửa triệt để các video trên tab Âm nhạc, ẩn chính xác Danh sách phát (Playlists) & Danh sách kết hợp (Mixes).
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.4:
 * ============================================================================
 * 1. [Sửa lỗi] Khắc phục triệt để các hàng video trên Tab "Âm nhạc":
 *    - Gỡ bỏ bộ lọc CSS list=RD trên thẻ video đơn lẻ, tránh ẩn nhầm các video ca nhạc thường.
 *    - Các hàng "Đề xuất mới", "Tuyển tập nhạc...", "Video nhạc hàng đầu..." hiển thị đầy đủ video.
 * 2. [Cải tiến] Lọc chuẩn xác Danh sách phát (Playlists / Khóa học) & Mix:
 *    - Ẩn hoàn toàn các thẻ Playlist / Khóa học (kể cả trên Trang chủ, Tìm kiếm và Gợi ý).
 *    - Bảo vệ an toàn các video có thời lượng cụ thể không bao giờ bị ẩn nhầm.
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
