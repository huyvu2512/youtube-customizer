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
// @version      3.3.7
// @description  YouTube Customizer v3.3.7 — Bổ sung Tab 5 Thông tin (Phiên bản, Làm mới, Cập nhật, Tác giả Huy Vũ, Báo cáo & Ủng hộ), đưa Độ phân giải video lên đầu mục Tối Ưu.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.7:
 * ============================================================================
 * 1. [Mới] Bổ sung Tab 5 "Thông tin":
 *    - Xem thông tin phiên bản phát hành chính thức, nút Làm mới trang và Kiểm tra cập nhật.
 *    - Thông tin nhà phát triển Huy Vũ (@huyvu2512).
 *    - Mục Báo cáo & Góp ý ý tưởng trực tiếp qua GitHub Issues.
 *    - Mục Tặng quà & Ủng hộ (Donate) với thông tin số tài khoản / MoMo kèm nút sao chép nhanh.
 * 2. [Cải tiến UI] Đưa mục "Độ phân giải video" lên trên cùng tab "Tối Ưu" tiện thao tác.
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
