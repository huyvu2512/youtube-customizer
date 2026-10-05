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
// @version      3.4.0
// @description  YouTube Customizer v3.4.0 — Khắc phục lỗi tua video nhảy cóc 20s trên phím tắt A-D & Numpad, chuẩn hóa tài liệu & tối ưu hiệu năng.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.4.0:
 * ============================================================================
 * 1. [Sửa lỗi] Khắc phục triệt để lỗi tua video nhảy cóc 20s (như bị kích đúp) khi bấm phím A/D hoặc Numpad 4/6:
 *    - Loại bỏ khối fallback 60ms và lệnh seekBy thừa thãi gây kích tua lần 2.
 *    - Chuẩn hóa dispatch phím duy nhất 1 lần và chặn repeat phím khi nhấn giữ.
 * 2. [Tài liệu] Chuẩn hóa toàn bộ bộ tài liệu dự án:
 *    - Bổ sung Chính sách bảo mật (SECURITY.md).
 *    - Tái cấu trúc README.md chuyên nghiệp kèm bảng tra cứu tính năng & phím tắt.
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
