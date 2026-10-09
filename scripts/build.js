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
// @version      3.8.3
// @description  YouTube Customizer v3.8.3 — Tối ưu hóa mượt mà zero-lag khi xem video, mở chuẩn xác panels bình luận/chat toàn màn hình, khôi phục khung video chuẩn gốc cho mọi tỷ lệ video (Shorts/dọc/ngang).
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.7.3:
 * ============================================================================
 * 1. [Tính năng mới: Công tắc gạt Tự động cập nhật]:
 *    - Thêm công tắc gạt "Tự động cập nhật" trong Tab Thông tin (Menu bánh răng).
 *    - Mỗi khi vào YouTube, script tự động gọi GitHub API kiểm tra phiên bản mới; nếu phát hiện bản mới sẽ lập tức tự động trỏ sang link cập nhật Tampermonkey.
 *    - Tích hợp Session Guard chống lặp chuyển hướng khi người dùng nhấn Back.
 * 2. [Thiết kế Frameless & Trong suốt 100%]:
 *    - Playlist & Khung mô tả (Description box) trong suốt hoàn toàn, không hiện khung viền.
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
