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
// @version      3.9.19
// @description  YouTube Customizer v3.9.19 — Lưu lịch sử đầy đủ, giới hạn nhật ký nhúng trong userscript ở 10 phiên bản mới nhất.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG — 10 VERSION GẦN NHẤT
 * ============================================================================
 * v3.9.19 — Lịch sử đầy đủ được tổng hợp tại CHANGELOG.md; phần này giới hạn 10 phiên bản gần nhất.
 * v3.9.18 — Gỡ huy hiệu ngôi sao khỏi mục Ánh sáng phòng (Ambilight).
 * v3.9.17 — Thay emoji ngôi sao bằng SVG riêng; bỏ animation nhấp nháy.
 * v3.9.16 — Gỡ canvas/CSS thử nghiệm trên scrollbar, bỏ cập nhật canvas theo từng frame và khi cuộn.
 * v3.9.15 — Nhắm đúng scrollbar trang YouTube để áp dụng hiệu ứng track.
 * v3.9.14 — Tắt Ambilight trên Shorts, giữ Ambilight cho video thường.
 * v3.9.13 — Làm trong track scrollbar riêng của Shorts, giữ thumb dễ nhận biết.
 * v3.9.12 — Mở rộng vùng Ambilight Shorts theo nền điện ảnh của YouTube.
 * v3.9.11 — Giữ nguyên stacking/layout Shorts, đặt quầng sáng phía sau nội dung.
 * v3.9.10 — Giới hạn quầng Ambilight quanh player Shorts, giữ nguyên kích thước player.
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
