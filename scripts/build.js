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
// @version      3.9.26
// @description  YouTube Customizer v3.9.26 — Chỉ cập nhật Tampermonkey theo thao tác người dùng.
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG — 10 VERSION GẦN NHẤT
 * ============================================================================
 * v3.9.26 — Chỉ mở cập nhật thủ công; bỏ tự tải lại khi đổi tab.
 * v3.9.25 — Giữ xử lý bấm gốc của YouTube trong Chế độ Chỉ Âm Thanh.
 * v3.9.24 — Bổ sung bấm phát/tạm dừng; ép chất lượng thấp nhất và khôi phục mức ưu tiên.
 * v3.9.23 — Tăng tốc tua Numpad 4/6 và mở rộng nhận diện iframe Live Chat.
 * v3.9.22 — Tăng tốc tua khi giữ Numpad 4/6; khôi phục kết nối Live Chat nền.
 * v3.9.21 — Khôi phục trạng thái ổn định từ v3.9.19 và cập nhật quy tắc phát triển trong AGENTS.md.
 * v3.9.20 — Thử nghiệm ảnh xem trước Live Stream theo thời gian thực.
 * v3.9.19 — Lịch sử đầy đủ được tổng hợp tại CHANGELOG.md; phần này giới hạn 10 phiên bản gần nhất.
 * v3.9.18 — Gỡ huy hiệu ngôi sao khỏi mục Ánh sáng phòng (Ambilight).
 * v3.9.17 — Thay emoji ngôi sao bằng SVG riêng; bỏ animation nhấp nháy.
 * v3.9.16 — Gỡ canvas/CSS thử nghiệm trên scrollbar, bỏ cập nhật canvas theo từng frame và khi cuộn.
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
