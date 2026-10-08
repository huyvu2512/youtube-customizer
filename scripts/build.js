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
// @version      3.5.9
// @description  YouTube Customizer v3.5.9 — Nâng cấp Ánh sáng phòng (Ambilight) Full-Screen 360 độ, xóa bỏ viền cắt video, tự động chống trùng lặp và xóa bỏ tính năng cũ thừa.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.9:
 * ============================================================================
 * 1. [Nâng cấp Ánh sáng phòng (Ambilight) Full-Screen]:
 *    - Tỏa sáng đều 360 độ quanh video, hắt sáng xuyên qua Masthead và Playlist panel.
 *    - Nâng cấp độ mờ quang học blur 85px & scale 1.4x xóa sổ hoàn toàn viền cắt sắc nhọn.
 *    - Tự động tắt ánh sáng gốc YouTube khi bật, khôi phục theo setting YouTube khi tắt.
 * 2. [Dọn dẹp tính năng thừa]:
 *    - Xóa bỏ triệt để tính năng cũ "Tắt ánh sáng video" (disableAmbient) khỏi source code.
 * 3. [Tối ưu kiểm tra cập nhật]:
 *    - Kiểm tra cập nhật qua GitHub REST API thời gian thực, chống kẹt cache CDN Fastly.
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
