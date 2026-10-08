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
// @version      3.5.6
// @description  YouTube Customizer v3.5.6 — Tự động mở trang cập nhật, đếm ngược 10s tự F5 và tự reload khi quay lại tab sau khi cập nhật, hiển thị "Đã cập nhật".
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.6:
 * ============================================================================
 * 1. [Nâng cấp cơ chế Cập nhật tự động & Tải lại trang]:
 *    - Tự động mở ngay liên kết cài đặt bản mới Tampermonkey khi phát hiện bản cập nhật.
 *    - Bộ đếm ngược 10 giây tự động F5 kèm nút bấm F5 tức thì.
 *    - Cơ chế Smart Return Reload: Tự động tải lại trang ngay khi người dùng cập nhật xong và quay lại tab YouTube.
 * 2. [Chuẩn hóa hiển thị]:
 *    - Đổi trạng thái khi ở bản mới nhất thành "Đã cập nhật" tinh tế, trực quan.
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
