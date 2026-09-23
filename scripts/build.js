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
// @version      3.3.8
// @description  YouTube Customizer v3.3.8 — Bổ sung tính năng Ẩn sản phẩm gắn thẻ (YouTube Shopping), tinh chỉnh Tab 5 Thông tin & Kiểm tra cập nhật mượt mà.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.8:
 * ============================================================================
 * 1. [Mới] Bổ sung tính năng "Ẩn sản phẩm gắn thẻ" (YouTube Shopping):
 *    - Tự động đóng/ẩn thanh bên Sản phẩm (Shopping), nút túi xách trên video và kệ sản phẩm tiếp thị liên kết.
 * 2. [Cải tiến UI] Hoàn thiện Tab 5 "Thông tin":
 *    - Đưa thẻ "Kiểm tra cập nhật" xuống dưới cùng tab 5 trực quan.
 *    - Tinh chỉnh nút Kiểm tra -> hiển thị trạng thái "Bản mới nhất" (xanh lá) hoặc "Cập nhật" (xanh dương click mở link).
 *    - Đơn giản hóa mục "Tặng quà & Ủng hộ" thành nút link mở trực tiếp VietQR MoMo.
 *    - Thiết kế lại badge phiên bản (version badge) theo phong cách bán trong suốt đỏ đồng bộ.
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
