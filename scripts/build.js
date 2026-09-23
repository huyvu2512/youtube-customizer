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
// @version      3.3.0
// @description  YouTube Customizer v3.3.0 — Tùy biến giao diện YouTube, bổ sung Tab Tối Ưu (Chặn AV1/Ép H.264, Dọn rác Live Chat RAM, Radio Audio-Only, Chặn tự dừng).
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.3.0:
 * ============================================================================
 * 1. [Mới] Bổ sung Tab "Tối Ưu" (Optimization) trong bảng cài đặt:
 *    - Gom các thiết lập giảm tải tài nguyên hệ thống, chuyển công tắc Phím tắt vào tab này
 *      và loại bỏ bảng mô tả phím tắt thừa để giao diện tinh gọn, hiện đại.
 *
 * 2. [Mới] Các tính năng tối ưu hiệu năng và tài nguyên chuyên sâu:
 *    - Chặn tự dừng video ("Bạn vẫn đang xem chứ?"): Tự động xác nhận dialog và làm mới
 *      _lact định kỳ để phát video/nhạc liên tục không bao giờ bị dừng.
 *    - Dọn rác bộ nhớ Live Chat: Giới hạn DOM chat tối đa ~100 tin nhắn, tự động dọn sạch
 *      định kỳ chống tràn bộ nhớ RAM khi xem stream lâu.
 *    - Chặn AV1 / Ép Codec H.264: Can thiệp MediaSource & canPlayType chặn AV1 ngốn CPU,
 *      ép YouTube cấp luồng giải mã phần cứng H.264/VP9 mượt mà, mát máy (bật/tắt êm ái).
 *    - Chế độ Chỉ phát âm thanh (Radio): Ngắt render video, hiển thị chữ thông báo tối giản
 *      và hạ chất lượng tối thiểu để chỉ nghe tiếng, giảm tải triệt để RAM và GPU.
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
