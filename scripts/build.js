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
// @version      3.2.31
// @description  YouTube Customizer v3.2.31 — Tự động tắt khung trò chuyện trực tiếp bằng nút Đóng (X) khi mới mở video (cho phép mở lại bình thường, Live Chat overlay chạy ngầm).
// @author       Huy Vũ
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * ============================================================================
 * NHẬT KÝ CẬP NHẬT / CHANGELOG - v3.2.31:
 * ============================================================================
 * 1. [Sửa lỗi] Tự động tắt khung trò chuyện khi mới mở video / livestream:
 *    - Khắc phục triệt để lỗi không tự tắt khi đã bật sẵn tính năng từ trước.
 *    - Sử dụng Observer bắt đúng thời điểm khung chat mở để bấm nút Đóng (X) ngay lập tức.
 *    - Chỉ tắt 1 lần lúc đầu, người dùng bấm "Mở bảng điều khiển" vẫn xem bình thường.
 *
 * 2. [Sửa lỗi] Khung trò chuyện bị tự động làm mới / không thể cuộn lên xem tin cũ:
 *    - Gỡ bỏ hoàn toàn mã cưỡng ép cuộn xuống đáy và tự bấm nút "Tin nhắn mới ↓" trên khung chat chính.
 *    - Cho phép vuốt lên đọc lại tin nhắn cũ thoải mái bao lâu tùy thích mà không bị giật về đáy.
 *
 * 3. [Tối ưu] Live Chat Overlay (Danmaku / Khung streamer):
 *    - Luồng ngầm độc lập (#ytc-bg-live-chat) duy trì nhận tin nhắn liên tục, không phụ thuộc
 *      vào việc khung chat chính đang đóng hay người dùng đang cuộn xem tin cũ.
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
