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
// @version      3.9.41
// @description  YouTube Customizer v3.9.41 — Gộp sóng heatmap liền mạch và tắt nổi bật đoạn khi di chuột.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG — 10 VERSION GẦN NHẤT
 * ============================================================================
 * v3.9.41 — Gộp sóng heatmap liền mạch và tắt nổi bật đoạn khi di chuột.
 * v3.9.40 — Thêm tùy chọn tắt chia đoạn video trong mục Tối ưu.
 * v3.9.39 — Giảm lag video chia đoạn dài, heatmap và chế độ phóng to.
 * v3.9.38 — Giữ video nhạc đơn kèm list=RD trên tab Âm nhạc và ẩn shelf rỗng.
 * v3.9.37 — Sửa lỗi thưa cột Trang chủ khi bấm logo nhờ quét lại thẻ tái sử dụng.
 * v3.9.36 — Gỡ :has() CSS, tắt observer thừa trên Watch và khử blur GPU khi phóng to.
 * v3.9.35 — Tối ưu hiệu năng phóng to, tua video và xem trước timeline.
 * v3.9.34 — Giữ mức ban đầu đến khi người dùng đổi trong menu YouTube.
 * v3.9.33 — Áp chất lượng ban đầu rồi cho phép đổi thủ công trong YouTube.
 * v3.9.32 — Phủ khoảng đen khi phóng to mà không cắt khung hình.
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
