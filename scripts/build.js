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
// @version      3.5.8
// @description  YouTube Customizer v3.5.8 — Chuyển cơ chế cố định thời gian đã phát thành mặc định ngầm 100%, bỏ toggle thừa khỏi menu cài đặt.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.8:
 * ============================================================================
 * 1. [Mặc định hóa cơ chế hiển thị Thời gian đã phát]:
 *    - Tự động khóa và khôi phục mốc thời gian đã phát (vd: 1:47 / 4:13) thành cơ chế chạy ngầm mặc định 100%.
 *    - Ngăn chặn triệt để tình trạng ghost-click hoặc nhảy sang thời gian đếm ngược âm (-3:13) mà không cần cấu hình.
 *    - Loại bỏ công tắc thừa khỏi Tab 3 (Trình phát), trả lại giao diện gọn gàng và tinh tế.
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
