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
// @version      3.5.1
// @description  YouTube Customizer v3.5.1 — Tối ưu hóa toàn diện trang xem video (Zero-Lag Watch), mượt mà khi tua video, hover preview, bật tắt Live Chat và thao tác player controls.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.1:
 * ============================================================================
 * 1. [Zero-Lag Watch Page & Player Controls] Tối ưu trang xem video mượt mà tuyệt đối:
 *    - Loại bỏ hoàn toàn bộ chọn html:not(:has(...)) triệt tiêu Style Recalculation Storms khi rê chuột, xem preview tooltip và thao tác player.
 *    - Bỏ cơ chế ẩn controls/con trỏ chuột khi tua video (.seeking-mode), tua mượt mà không chớp tắt HUD.
 *    - Gỡ bỏ khóa cứng click player 1.5s (fullscreenLock), các nút phóng to, play/pause, cài đặt và phím tắt F phản hồi tức thì.
 * 2. [Tối ưu Live Chat Toggle & Click Capture]:
 *    - Tối ưu bộ lắng nghe click toggle chat với bộ lọc vùng nhanh (inChatArea), giải phóng Main Thread cho toàn bộ cụm nút điều khiển player.
 *    - Loại bỏ tính toán px inline thủ công trên video khi không ở chế độ Fullscreen, để YouTube layout tự nhiên không xung đột reflow.
 *    - Triệt tiêu chuỗi setTimeout layout cascade trong fullscreenchange và chat state sync.
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
