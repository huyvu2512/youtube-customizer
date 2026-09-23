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
// @version      3.3.1
// @description  YouTube Customizer v3.3.1 — Bổ sung tính năng Ẩn Danh sách kết hợp (Mixes) trong tab Bộ Lọc & tinh chỉnh Chế độ Chỉ Âm Thanh Mẫu 1 tối giản.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.1:
 * ============================================================================
 * 1. [Mới] Tính năng Ẩn Danh sách kết hợp (Mixes / Radio) trong tab Bộ Lọc:
 *    - Ẩn toàn diện các playlist Mix (list=RD...) trên Trang chủ, Tìm kiếm và Gợi ý xem tiếp.
 *    - Ẩn khung danh sách phát Mix trên trang xem video.
 *    - Tự động làm sạch URL và chặn nạp playlist Mix khi click xem video.
 *    - Khi hết bài, YouTube tự động chuyển tiếp sang video đề xuất tự nhiên thay vì bị kẹt trong Mix.
 *
 * 2. [Cải tiến] Chế độ Chỉ Âm Thanh (Audio-Only):
 *    - Áp dụng Mẫu 1: Dòng thông báo 2 dòng chữ tối giản, thanh lịch căn giữa khung phát,
 *      loại bỏ hoàn toàn cảm giác khung hộp AI cồng kềnh.
 *
 * 3. [Gỡ bỏ] Loại bỏ hoàn toàn tính năng Ad Shield ngầm (chấm dứt hiện tượng tua nhanh 16x khi gặp quảng cáo).
 * 4. [Mới] Thêm nút liên kết mở trang uBlock Origin ở dưới cùng tab Trình phát để người dùng chủ động cài đặt.
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
