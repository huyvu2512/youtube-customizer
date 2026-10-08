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
// @version      3.5.3
// @description  YouTube Customizer v3.5.3 — Tối ưu hóa chu kỳ nền (Idle Efficiency), On-Demand Danmaku Scheduler, cách ly Observer và triệt tiêu tiến trình chạy ngầm vô ích.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.3:
 * ============================================================================
 * 1. [Tối ưu tiến trình chạy ngầm & Tiết kiệm CPU (Idle Efficiency)]:
 *    - Ngắt hoàn toàn polling interval Live Chat (2s) và Chat Memory GC (10s) khi ở ngoài trang xem video (/watch, /live).
 *    - Chuyển Danmaku Scheduler (50ms) sang cơ chế On-Demand: chỉ thức dậy khi có tin nhắn trong hàng đợi và tự động ngủ khi hàng đợi trống.
 * 2. [Tối ưu DOM MutationObservers & Settings Panel]:
 *    - Masthead Observer trong panel.js: Bỏ qua việc re-sync settings panel khi nút bánh răng đã nằm đúng vị trí trong masthead.
 *    - Thu hẹp phạm vi preventAutoPause: Quan sát trực tiếp ytd-popup-container, không còn quan sát toàn bộ cây DOM ytd-app.
 *    - Dọn dẹp dead CSS keyframes (@keyframes ytcConfirmInserted).
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
