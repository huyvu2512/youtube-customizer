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
// @version      3.7.1
// @description  YouTube Customizer v3.7.1 — Kính mờ xuyên thấu tuyệt đối khung Tìm kiếm (Searchbox) & Playlist panel; Ánh sáng phòng Ambilight rực rỡ không bị che khuất; Sửa lỗi giật video Live.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.1:
 * ============================================================================
 * 1. [Khung tìm kiếm & Playlist xuyên thấu tuyệt đối (Crystal Transparency)]:
 *    - Triệt tiêu hoàn toàn các khối nền xám đục hình chữ nhật xếp chồng trên thanh Searchbox; biến khung tìm kiếm và nút micro thành kính xuyên thấu 100%.
 *    - Khử hoàn toàn nền đen đặc của cột thứ hai (#secondary), khung danh sách phát (Playlist panel) và từng thẻ video con, để quầng sáng phòng Ambilight tỏa sáng lộng lẫy xuyên qua.
 * 2. [Sửa triệt để lỗi giật video & tự chuyển luồng xem Live]:
 *    - Tăng ngưỡng snap lên 30s và bỏ double-seek, đồng bộ thời gian thực siêu mượt.
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
