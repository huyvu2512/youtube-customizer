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
// @version      3.6.2
// @description  YouTube Customizer v3.6.2 — Tối ưu bố cục trang xem video bám sát mép, xóa bỏ khoảng trống thừa 2 bên và chống bóp khung hình; Ánh sáng phòng Full-Screen Cinema.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.6.1:
 * ============================================================================
 * 1. [Nâng cấp Ánh sáng phòng Full-Screen Cinema (Spread 400%)]:
 *    - Kiến trúc Dual-Layer: Lớp tỏa rộng 400% phủ kín toàn màn hình (360 độ) + Lớp hào quang viền sống động sát mép video.
 *    - Xóa tan 100% hiện tượng "khối chữ nhật màu nâu", quầng sáng mềm mại tan biến vào không gian.
 *    - Tách biệt viền video sắc nét chuẩn OLED với lớp bóng đổ sâu cinema.
 * 2. [Làm dịu màu nội dung xung quanh (Cinema Ambience)]:
 *    - Làm trong suốt toàn bộ chuỗi DOM nền YouTube, Masthead và Playlist dạng kính mờ cao cấp.
 *    - Giảm độ chói/tương phản của thumbnail phụ và description giúp video chính nổi bật rực rỡ nhất.
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
