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
// @version      3.5.0
// @description  YouTube Customizer v3.5.0 — Đại tu tối ưu hiệu năng Zero-Lag, sửa lỗi hitbox lưới video, chống nghẽn style recalculation và tối ưu luồng tải video & Live Chat.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.0:
 * ============================================================================
 * 1. [Tối ưu & Sửa lỗi Hitbox] Sửa triệt để lỗi mất hitbox hover và click trượt trên lưới video:
 *    - Thay thế display:contents trên ytd-rich-grid-row bằng flexbox wrap để giữ nguyên bounding box.
 *    - Loại bỏ toàn bộ bộ chọn :has() khi hover gây recalculate style storm trên mỗi chuyển động chuột.
 *    - Hạ z-index khung preview và bỏ pointer-events: auto toàn cục chống chặn click chuột.
 * 2. [Trình phát & Video Stream] Chống nghẽn buffer & ngắt kết nối video:
 *    - Chuyển cơ chế đặt chất lượng (qualityManager) sang kích hoạt 1 lần duy nhất khi manifest sẵn sàng.
 *    - Tối ưu hóa hook JSON.parse trong liveDvr chỉ chạy khi tính năng bật và dữ liệu phù hợp.
 *    - Khóa điều kiện autoLiveSync cho checkInitialLiveSnap tránh polling thừa khi tắt tính năng.
 * 3. [Tối ưu DOM & MutationObserver] Giảm tải CPU Main Thread:
 *    - Debounce MutationObserver và thu hẹp phạm vi trong preventAutoPause.
 *    - Quét feed lũy tiến (incremental scan) với thẻ data-attribute và kiểm tra selector nhẹ trước.
 *    - Triệt tiêu click storm và chuỗi setTimeout lặp trong tự động đóng Live Chat và căn cột lưới.
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
