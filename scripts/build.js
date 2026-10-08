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
// @version      3.6.7
// @description  YouTube Customizer v3.6.7 — Sửa triệt để lỗi nền trắng ở một bên trang; Khóa chặt nền tối OLED #0f0f0f; Ánh sáng phòng Cinema lan tỏa sâu; Masthead trong suốt đỉnh trang.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.6.7:
 * ============================================================================
 * 1. [Khắc phục triệt để lỗi nền trắng 1 bên trang (Zero White Bug)]:
 *    - Khóa chặt nền tảng html, body, ytd-app luôn ở màu đen sâu OLED (#0f0f0f), tuyệt đối không để lộ nền trắng mặc định của trình duyệt.
 *    - Chỉ làm trong suốt các khung video player và watch-flexy để quầng sáng phòng hiển thị rực rỡ và tan biến mượt mà vào nền đen.
 * 2. [Ánh sáng phòng (Ambilight) Cinema & Masthead xuyên thấu]:
 *    - Các ô dải màu dóng dọc từ đáy video lan tỏa sâu xuống tận giữa trang.
 *    - Thanh tiêu đề và khung tìm kiếm trong suốt ở đỉnh trang, tự động hoàn nguyên nền đen khi cuộn.
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
