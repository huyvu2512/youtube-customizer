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
// @version      3.5.5
// @description  YouTube Customizer v3.5.5 — Khóa cố định thời gian đã phát (chống tự đổi số âm), tự động F5 thông minh khi bật Live DVR và loại bỏ thông báo phiền toái.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.5:
 * ============================================================================
 * 1. [Khóa cố định thời gian đã phát (Lock Elapsed Time)]:
 *    - Tự động nắn và cố định mốc thời gian trình phát luôn ở dạng thời gian đã phát (vd: 1:47 / 4:13).
 *    - Chống ghost-click và ngăn chặn triệt để tình trạng tự nhảy sang thời gian đếm ngược âm (vd: -3:13 / 4:13) khi mở video.
 * 2. [Tự động F5 thông minh cho Live DVR]:
 *    - Bỏ hoàn toàn thông báo Toast phiền toái.
 *    - Tự động tải lại trang sau 250ms khi gạt công tắc nếu đang ở trong video Live (/watch hoặc /live).
 *    - Giữ nguyên trang chủ/tìm kiếm không reload khi bật từ feed.
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
