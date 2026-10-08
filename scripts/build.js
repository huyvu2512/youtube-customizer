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
// @version      3.7.2
// @description  YouTube Customizer v3.7.2 — Giao diện không khung viền (Frameless); Khung Playlist & Description box trong suốt hoàn toàn 100%, hòa quyện tuyệt đối cùng ánh sáng phòng Ambilight.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.2:
 * ============================================================================
 * 1. [Thiết kế Không Khung Viền - Frameless & Trong suốt 100%]:
 *    - Khử hoàn toàn viền, bóng đổ và nền hộp của Bảng danh sách phát (Playlist panel) & Khung mô tả (Description box).
 *    - Toàn bộ danh sách bài hát và thông tin mô tả video hiển thị trôi nổi trực tiếp trên nền ánh sáng phòng Ambilight, không bị đóng hộp.
 *    - Các nút chức năng (Like, Share, Chips...) chuyển sang chế độ siêu mờ tinh tế.
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
