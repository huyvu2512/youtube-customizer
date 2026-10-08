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
// @version      3.5.7
// @description  YouTube Customizer v3.5.7 — Bổ sung tính năng Ánh sáng phòng (Ambilight) siêu tối ưu phần cứng, mượt mà và không giật lag.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.7:
 * ============================================================================
 * 1. [Tính năng mới: Ánh sáng phòng (Ambilight)]:
 *    - Tạo hiệu ứng ánh sáng viền phản chiếu màu sắc video cực đẹp ra không gian phòng.
 *    - Kiến trúc Micro Canvas 32x18px siêu nhẹ: Tiêu thụ cực ít RAM (< 50KB) và CPU (< 0.5%).
 *    - GPU Compositor Acceleration: Đẩy toàn bộ xử lý làm mờ và tỏa rộng sang GPU phần cứng.
 *    - Throttling 18 FPS & Deep Sleeping: Tự động ngắt hoàn toàn khi tạm dừng video, chuyển tab hoặc cuộn khỏi video.
 *    - Tích hợp công tắc duy nhất ngay trên Live Chat trong Tab 1 (Giao diện), chuẩn hóa cài đặt điện ảnh.
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
