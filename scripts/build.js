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
// @version      3.9.34
// @description  YouTube Customizer v3.9.34 — Giữ chất lượng ban đầu đến khi chọn thủ công.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG — 10 VERSION GẦN NHẤT
 * ============================================================================
 * v3.9.34 — Giữ mức ban đầu đến khi người dùng đổi trong menu YouTube.
 * v3.9.33 — Áp chất lượng ban đầu rồi cho phép đổi thủ công trong YouTube.
 * v3.9.32 — Phủ khoảng đen khi phóng to mà không cắt khung hình.
 * v3.9.31 — Nhận diện Replay từ cấu trúc YouTube, không phụ thuộc ngôn ngữ.
 * v3.9.30 — Khôi phục chất lượng thích ứng khi chọn Tự động.
 * v3.9.29 — Bấm nút Replay gốc để khởi tạo khung chat ẩn.
 * v3.9.28 — Tự mở Live Chat Replay; ẩn khung gốc khi phóng to.
 * v3.9.27 — Áp chất lượng một lần; dùng chat gốc cho Live Chat Replay.
 * v3.9.26 — Chỉ mở cập nhật thủ công; bỏ tự tải lại khi đổi tab.
 * v3.9.25 — Giữ xử lý bấm gốc của YouTube trong Chế độ Chỉ Âm Thanh.
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
