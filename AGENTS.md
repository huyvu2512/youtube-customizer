# YOUTUBE CUSTOMIZER - QUY TẮC PHÁT TRIỂN & PHÁT HÀNH (WORKFLOW RULES)

## 1. BẮT BUỘC: CHỦ ĐỘNG NÂNG VERSION KHI THAY ĐỔI TÍNH NĂNG / GIAO DIỆN / FIX BUG
- Mỗi khi thực hiện thay đổi tính năng, sửa giao diện hoặc sửa lỗi theo yêu cầu: **LUÔN LUÔN CHỦ ĐỘNG NÂNG VERSION** (ví dụ: `3.9.0` -> `3.9.1`...).
- Tuyệt đối không để người dùng phải nhắc nâng version.
- Các tệp bắt buộc phải cập nhật đồng bộ cùng lúc:
  1. `package.json` -> `"version": "x.y.z"`
  2. `src/core/constants.js` -> `export const APP_VERSION = 'x.y.z';`
  3. `scripts/build.js` -> `// @version x.y.z` và `@description`
  4. `tampermonkey.user.js` -> Cập nhật `@version`, query param `?v=x.y.z` ở `@require`, `@updateURL`, `@downloadURL`, và nhật ký Changelog (giới hạn 10 version gần nhất).
  5. `README.md` & `README_EN.md` -> Cập nhật badge version và đoạn giới thiệu phiên bản mới.
  6. `CHANGELOG.md` -> Thêm mục `## vx.y.z — DD/MM/YYYY HH:MM` và ghi lại chi tiết các thay đổi.
- Trước mỗi lần push, rà soát và cập nhật `README.md`, `README_EN.md` và `CHANGELOG.md` để tài liệu khớp với thay đổi được đẩy lên.
- Viết `CHANGELOG.md` theo độ dài các mục phát hành gần nhất: mỗi gạch đầu dòng là một câu ngắn nêu tính năng và thay đổi chính (thường khoảng 6–12 từ), không quá cụt và không giải thích triển khai dài dòng.

## 2. QUY TRÌNH BUILD & DEPLOY CHUẨN
1. Chạy lệnh đóng gói: `npm run build`
2. Kiểm tra cú pháp an toàn: `node -c youtube_customizer.js`
3. Trước khi commit, rà soát `README.md`, `README_EN.md` và `CHANGELOG.md`; cập nhật nội dung liên quan, giữ CHANGELOG ngắn gọn theo quy tắc trên.
4. Commit và push lên GitHub nhánh `main`:
   `git add .; git commit -m "..."; git push origin main`
5. Xóa bộ nhớ đệm CDN jsDelivr:
   `node -e "fetch('https://purge.jsdelivr.net/gh/huyvu2512/youtube-customizer@main/youtube_customizer.js').then(r => r.json()).then(console.log)"`

## 3. NGUYÊN TẮC THIẾT KẾ & TỐI ƯU
- **Tối giản, thực dụng:** Không thêm các chi tiết màu mè, hiệu ứng rườm rà, tiêu đề thừa thãi khi không được yêu cầu.
- **Hiệu năng 0% CPU khi đóng bảng:** Dọn dẹp sạch sẽ các `setInterval`, `requestAnimationFrame` và listener khi panel đóng.
- **Khi người dùng yêu cầu chỉ phân tích ("từ từ hãng code nhé", "chỉ phân tích thôi"):** Chỉ phân tích và giải thích cặn kẽ, KHÔNG tự ý chỉnh sửa code trước khi có sự đồng ý.
