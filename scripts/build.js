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
// @version      3.6.8
// @description  YouTube Customizer v3.6.8 — Ánh sáng phòng (Ambilight) Full-Width Cinema lan tỏa sâu; Masthead trong suốt toàn dải đỉnh trang; Khung video sắc nét nguyên bản; Tối ưu 30 FPS siêu mượt.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.6.8:
 * ============================================================================
 * 1. [Ánh sáng phòng (Ambilight) Full-Width Cinema]:
 *    - Phủ kín 100% bề ngang màn hình, lan tỏa ánh sáng toàn dải Masthead trên cùng (bao gồm cả góc phải phía trên nút Tạo/Avatar/Live Chat).
 *    - Các ô dải màu dóng dọc từ đáy video lan sâu xuống giữa trang cực đẹp.
 *    - Động cơ Render kiên cường 30 FPS không bao giờ bị tắt khi buffer hay đổi độ phân giải.
 * 2. [Bảo toàn độ sắc nét và cấu trúc Player]:
 *    - Giữ nguyên cấu trúc gốc của trình phát YouTube, video sắc nét 100%, thao tác chuột mượt mà.
 *    - Masthead và ô tìm kiếm xuyên thấu tinh tế ở đỉnh trang, tự động hoàn nguyên nền đen khi cuộn.
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
