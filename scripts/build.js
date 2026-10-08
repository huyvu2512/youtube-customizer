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
// @version      3.6.0
// @description  YouTube Customizer v3.6.0 — Chuyển tính năng Ẩn sản phẩm gắn thẻ sang Tab Lọc nội dung, tối ưu bộ giải mã cập nhật Base64 thời gian thực.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.6.0:
 * ============================================================================
 * 1. [Tối ưu bố cục cài đặt]:
 *    - Chuyển tính năng "Ẩn sản phẩm gắn thẻ" (hideShopping) sang Tab 2 (Lọc nội dung sạch).
 *    - Giữ Tab 1 (Giao diện) tinh gọn, tập trung hoàn toàn vào bố cục và hiệu ứng video.
 * 2. [Kiểm tra cập nhật siêu bền bỉ]:
 *    - Tích hợp tự động giải mã Base64 cho GitHub Contents REST API.
 *    - Cơ chế Multi-Tier: Trực tiếp API thô -> Giải mã Base64 -> Fallback CDN khi quá tải IP.
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
