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
// @version      3.6.6
// @description  YouTube Customizer v3.6.6 — Ánh sáng phòng Ambilight dải màu dóng dọc chuẩn Cinema lan tỏa sâu xuống giữa trang; Masthead & thanh tìm kiếm trong suốt; Khắc phục triệt để thanh cuộn ngang.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.6.6:
 * ============================================================================
 * 1. [Ánh sáng phòng (Ambilight) Dải màu dóng dọc & Lan tỏa sâu]:
 *    - Tạo các ô dải màu dóng dọc chuẩn xác từ đáy video lan tỏa sâu xuống tận giữa trang.
 *    - Ăn khớp 100% hình học giữa khung video và viền ánh sáng phòng, không lệch góc.
 * 2. [Masthead & Thanh tìm kiếm trong suốt]:
 *    - Trong suốt toàn bộ thanh tiêu đề và thanh tìm kiếm khi ở đỉnh trang để ánh sáng xuyên thấu.
 *    - Tự động hoàn nguyên nền đen khi cuộn trang xuống.
 * 3. [Triệt tiêu thanh cuộn ngang (Zero Horizontal Scrollbar)]:
 *    - Khắc phục triệt để thanh kéo ngang khi bật tính năng ánh sáng phòng.
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
