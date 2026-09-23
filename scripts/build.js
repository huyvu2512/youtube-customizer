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
// @version      3.3.3
// @description  YouTube Customizer v3.3.3 — Sửa lỗi tab Âm nhạc bị trống trơn, mở rộng tính năng ẩn Danh sách phát (Playlists) trong Tìm kiếm & thanh chủ đề.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.3:
 * ============================================================================
 * 1. [Sửa lỗi] Khắc phục triệt để lỗi Tab "Âm nhạc" trên Trang chủ bị đen sì / trống trơn:
 *    - Thu hẹp phạm vi quét hàng ytd-rich-section-renderer: không còn ẩn oan toàn bộ kệ nhạc
 *      chỉ vì có chứa link Mix.
 *    - Các video ca nhạc trong tab "Âm nhạc" hiển thị đầy đủ, đẹp mắt và tự động làm sạch URL khi click.
 * 2. [Mở rộng] Tính năng "Ẩn Danh sách phát & Mix" (hideMixes):
 *    - Ẩn toàn diện cả Danh sách phát người dùng tạo (ytd-playlist-renderer, ytd-compact-playlist-renderer)
 *      trong kết quả Tìm kiếm và thanh Gợi ý xem tiếp.
 *    - Ẩn luôn chip nút bấm "Danh sách kết hợp" trên thanh chủ đề đầu trang chủ.
 *    - Cập nhật nhãn cài đặt thành "Ẩn Danh sách phát & Mix" trực quan, chính xác.
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
