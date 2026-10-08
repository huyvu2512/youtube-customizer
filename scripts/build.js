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
// @version      3.5.2
// @description  YouTube Customizer v3.5.2 — Tối ưu hóa trang xem video Zero-Lag và khắc phục triệt để lỗi đen màn hình khi thoát chế độ toàn màn hình.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.5.2:
 * ============================================================================
 * 1. [Sửa lỗi đen màn hình khi thoát toàn màn hình (Exit Fullscreen Fix)]:
 *    - Khắc phục triệt để lỗi mất hình ảnh (chỉ còn tiếng, phóng to lại mới có hình) khi thoát chế độ phóng to.
 *    - Áp dụng hàm applyVideoDimensions tính toán chuẩn xác tỷ lệ khung hình video theo kích thước player container.
 *    - Đồng bộ kích thước liên tục qua các mốc chuyển cảnh và gọi player.setInternalSize() để YouTube căn chỉnh hoàn hảo.
 * 2. [Zero-Lag Watch Page & Player Controls]:
 *    - Loại bỏ hoàn toàn bộ chọn html:not(:has(...)) triệt tiêu Style Recalculation Storms khi rê chuột và xem preview tooltip.
 *    - Bỏ ẩn controls/con trỏ chuột khi tua video, tua mượt mà không chớp tắt HUD.
 *    - Gỡ bỏ khóa cứng click player 1.5s, các nút điều khiển và phím tắt phản hồi tức thì.
 *    - Tối ưu bộ lắng nghe click toggle chat với bộ lọc vùng nhanh (inChatArea).
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
