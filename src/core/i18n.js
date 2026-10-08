// ==========================================================================
// I18N / LOCALIZATION SUBSYSTEM FOR YOUTUBE CUSTOMIZER
// ==========================================================================
import { currentConfig } from './config.js';

export const SUPPORTED_LANGUAGES = [
    { code: 'auto', name: 'Tự động (Theo YouTube)', nativeName: 'Auto (System / YouTube)', flag: '🌐' },
    { code: 'vi', name: 'Tiếng Việt', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
    { code: 'ja', name: 'Tiếng Nhật', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Tiếng Hàn', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'zh-CN', name: 'Tiếng Trung (Giản thể)', nativeName: '简体中文', flag: '🇨🇳' },
    { code: 'zh-TW', name: 'Tiếng Trung (Phồn thể)', nativeName: '繁體中文', flag: '🇹🇼' },
    { code: 'es', name: 'Tiếng Tây Ban Nha', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Tiếng Pháp', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Tiếng Đức', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Tiếng Nga', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'pt', name: 'Tiếng Bồ Đào Nha', nativeName: 'Português', flag: '🇧🇷' },
    { code: 'it', name: 'Tiếng Ý', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'id', name: 'Tiếng Indonesia', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'th', name: 'Tiếng Thái', nativeName: 'ภาษาไทย', flag: '🇹🇭' },
    { code: 'hi', name: 'Tiếng Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ar', name: 'Tiếng Ả Rập', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'tr', name: 'Tiếng Thổ Nhĩ Kỳ', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'pl', name: 'Tiếng Ba Lan', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'nl', name: 'Tiếng Hà Lan', nativeName: 'Nederlands', flag: '🇳🇱' },
    { code: 'fil', name: 'Tiếng Philippines', nativeName: 'Filipino', flag: '🇵🇭' }
];

const TRANSLATIONS = {
    vi: {
        tab_layout: 'Giao diện',
        tab_filter: 'Lọc',
        tab_player: 'Trình phát',
        tab_optimize: 'Tối Ưu',
        tab_info: 'Thông tin',
        home_cols: 'Số cột trang chủ',
        premium_logo: 'Logo Premium',
        unlock_live_dvr: 'Mở khóa tua Live Stream',
        auto_live_sync: 'Tự động trực tiếp (Auto Live)',
        ambient_lighting: 'Ánh sáng phòng (Ambilight)',
        script_language: 'Ngôn ngữ giao diện',
        live_chat: 'Live Chat',
        chat_off: 'Tắt',
        chat_danmaku: 'Ngang',
        chat_streamer: 'Nổi',
        hide_shorts: 'Ẩn mục Shorts',
        hide_playables: 'Ẩn mục Chơi game',
        hide_members: 'Ẩn video Hội viên',
        hide_community: 'Ẩn bài đăng cộng đồng',
        clean_search: 'Ẩn quảng cáo tìm kiếm',
        hide_explore: 'Ẩn kệ Khám phá chủ đề',
        hide_shopping: 'Ẩn YouTube Shopping',
        hide_mixes: 'Ẩn Danh sách kết hợp (Mixes)',
        hide_endscreen: 'Ẩn thẻ kết thúc & chú thích',
        hide_watermark: 'Ẩn logo hình mờ kênh',
        auto_dismiss: 'Tự đóng banner phiền toái',
        hide_native_chat: 'Tự động tắt khung trò chuyện',
        hide_chat_emojis: 'Ẩn emoji trong Live Chat',
        ublock_title: 'Mở trang uBlock Origin — Trình chặn quảng cáo số 1',
        ublock_badge: 'Mở trang',
        video_quality: 'Độ phân giải video',
        quality_auto: 'Tự động',
        quality_max: 'Cao nhất',
        prevent_auto_pause: 'Chặn tự dừng video',
        chat_memory_gc: 'Dọn RAM tin nhắn Live Chat',
        keyboard_controls: 'Phím tắt A-S-D & Numpad',
        block_av1: 'Chặn AV1 / Ép phần cứng H.264 & VP9',
        audio_only: 'Chế độ Radio (Chỉ âm thanh)',
        lock_elapsed_time: 'Cố định hiển thị thời gian đã phát',
        auto_update: 'Tự động cập nhật',
        check_update: 'Kiểm tra cập nhật',
        author: 'Tác giả',
        report_bug: 'Báo lỗi & Đóng góp',
        donate: 'Ủng hộ tác giả',
        special_feature: 'Tính năng đặc biệt nổi bật',
        search_language: 'Tìm kiếm ngôn ngữ...'
    },
    en: {
        tab_layout: 'Interface',
        tab_filter: 'Filter',
        tab_player: 'Player',
        tab_optimize: 'Optimize',
        tab_info: 'About',
        home_cols: 'Home Grid Columns',
        premium_logo: 'Premium Logo',
        unlock_live_dvr: 'Unlock Live DVR',
        auto_live_sync: 'Auto Live Sync',
        ambient_lighting: 'Ambient Light (Cinema)',
        script_language: 'Interface Language',
        live_chat: 'Live Chat',
        chat_off: 'Off',
        chat_danmaku: 'Danmaku',
        chat_streamer: 'Float',
        hide_shorts: 'Hide Shorts',
        hide_playables: 'Hide Playables',
        hide_members: 'Hide Members-Only',
        hide_community: 'Hide Community Posts',
        clean_search: 'Clean Search Ads',
        hide_explore: 'Hide Explore Shelves',
        hide_shopping: 'Hide YouTube Shopping',
        hide_mixes: 'Hide Mixes & Playlists',
        hide_endscreen: 'Hide Endscreen Cards',
        hide_watermark: 'Hide Channel Watermark',
        auto_dismiss: 'Dismiss Promo Banners',
        hide_native_chat: 'Auto-collapse Live Chat',
        hide_chat_emojis: 'Hide Emojis in Live Chat',
        ublock_title: 'Get uBlock Origin — Best Adblocker in the World',
        ublock_badge: 'Open Page',
        video_quality: 'Preferred Video Quality',
        quality_auto: 'Auto',
        quality_max: 'Max Quality',
        prevent_auto_pause: 'Prevent Auto-Pause',
        chat_memory_gc: 'Live Chat Memory GC',
        keyboard_controls: 'Shortcuts A-S-D & Numpad',
        block_av1: 'Block AV1 / Force H.264 & VP9',
        audio_only: 'Audio-Only Mode (Radio)',
        lock_elapsed_time: 'Lock Elapsed Time Display',
        auto_update: 'Auto Update',
        check_update: 'Check for Updates',
        author: 'Developer',
        report_bug: 'Report Bug / GitHub',
        donate: 'Donate / Support',
        special_feature: 'Featured special capability',
        search_language: 'Search language...'
    },
    ja: {
        tab_layout: '画面',
        tab_filter: 'フィルター',
        tab_player: 'プレーヤー',
        tab_optimize: '最適化',
        tab_info: '情報',
        home_cols: 'ホームグリッド列数',
        premium_logo: 'Premiumロゴ',
        unlock_live_dvr: 'ライブ巻き戻し解除',
        auto_live_sync: '自動リアルタイム同期',
        ambient_lighting: 'アンビエントライト (Cinema)',
        script_language: '言語設定',
        live_chat: 'チャット表示',
        chat_off: 'オフ',
        chat_danmaku: '弾幕',
        chat_streamer: 'フロート',
        hide_shorts: 'Shortsを非表示',
        hide_playables: 'プレイアブルを非表示',
        hide_members: 'メンバー限定を非表示',
        hide_community: 'コミュニティを非表示',
        clean_search: '検索広告を除去',
        hide_explore: 'おすすめ枠を非表示',
        hide_shopping: 'ショッピング枠を非表示',
        hide_mixes: 'ミックス・再生リスト非表示',
        hide_endscreen: '終了画面カードを非表示',
        hide_watermark: '透かしロゴを非表示',
        auto_dismiss: 'プロモ通知を自動閉じる',
        hide_native_chat: 'チャット枠を自動格納',
        hide_chat_emojis: 'チャット絵文字を非表示',
        ublock_title: 'uBlock Originを開く',
        ublock_badge: '開く',
        video_quality: '画質設定',
        quality_auto: '自動',
        quality_max: '最高画質',
        prevent_auto_pause: '自動停止を防止',
        chat_memory_gc: 'チャットメモリ解放',
        keyboard_controls: 'ショートカット (A-S-D)',
        block_av1: 'AV1無効 / H.264強制',
        audio_only: 'ラジオモード (音声のみ)',
        lock_elapsed_time: '経過時間を固定表示',
        auto_update: '自動アップデート',
        check_update: '更新を確認',
        author: '開発者',
        report_bug: 'GitHubで不具合報告',
        donate: '開発者を応援',
        special_feature: '注目の特別機能',
        search_language: '言語を検索...'
    },
    ko: {
        tab_layout: '화면',
        tab_filter: '필터',
        tab_player: '플레이어',
        tab_optimize: '최적화',
        tab_info: '정보',
        home_cols: '홈 그리드 열 수',
        premium_logo: '프리미엄 로고',
        unlock_live_dvr: '라이브 되감기 잠금해제',
        auto_live_sync: '실시간 자동 동기화',
        ambient_lighting: '앰비언트 라이트 (Cinema)',
        script_language: '언어 설정',
        live_chat: '라이브 채팅',
        chat_off: '끄기',
        chat_danmaku: '흘림',
        chat_streamer: '플로팅',
        hide_shorts: 'Shorts 숨기기',
        hide_playables: '플레이어블 숨기기',
        hide_members: '멤버십 전용 숨기기',
        hide_community: '커뮤니티 글 숨기기',
        clean_search: '검색 광고 숨기기',
        hide_explore: '탐색 선반 숨기기',
        hide_shopping: '쇼핑 선반 숨기기',
        hide_mixes: '믹스/재생목록 숨기기',
        hide_endscreen: '최종 화면 카드 숨기기',
        hide_watermark: '워터마크 숨기기',
        auto_dismiss: '프로모션 배너 자동 닫기',
        hide_native_chat: '기본 채팅창 자동 숨김',
        hide_chat_emojis: '채팅 이모지 숨기기',
        ublock_title: 'uBlock Origin 열기',
        ublock_badge: '열기',
        video_quality: '화질 우선 설정',
        quality_auto: '자동',
        quality_max: '최고 화질',
        prevent_auto_pause: '자동 일시정지 방지',
        chat_memory_gc: '채팅 메모리 최적화',
        keyboard_controls: '단축키 제어 (A-S-D)',
        block_av1: 'AV1 차단 / 하드웨어 코덱',
        audio_only: '오디오 전용 모드',
        lock_elapsed_time: '재생 시간 고정 표시',
        auto_update: '자동 업데이트',
        check_update: '업데이트 확인',
        author: '개발자',
        report_bug: 'GitHub 버그 제보',
        donate: '개발자 후원',
        special_feature: '주목할 만한 특별 기능',
        search_language: '언어 검색...'
    },
    'zh-CN': {
        tab_layout: '界面',
        tab_filter: '过滤',
        tab_player: '播放',
        tab_optimize: '优化',
        tab_info: '关于',
        home_cols: '首页网格列数',
        premium_logo: 'Premium 标志',
        unlock_live_dvr: '解锁直播倒带',
        auto_live_sync: '自动同步直播',
        ambient_lighting: '流光溢彩 (Cinema)',
        script_language: '界面语言',
        live_chat: '弹幕/聊天',
        chat_off: '关闭',
        chat_danmaku: '横向',
        chat_streamer: '浮窗',
        hide_shorts: '隐藏 Shorts 短视频',
        hide_playables: '隐藏小游戏',
        hide_members: '隐藏会员专享',
        hide_community: '隐藏社区动态',
        clean_search: '净化搜索广告',
        hide_explore: '隐藏探索栏',
        hide_shopping: '隐藏购物推荐',
        hide_mixes: '隐藏合辑/播放列表',
        hide_endscreen: '隐藏片尾推荐卡片',
        hide_watermark: '隐藏频道水印',
        auto_dismiss: '自动关闭弹窗',
        hide_native_chat: '自动收起原生聊天',
        hide_chat_emojis: '隐藏聊天表情',
        ublock_title: '获取 uBlock Origin',
        ublock_badge: '打开',
        video_quality: '首选画质',
        quality_auto: '自动',
        quality_max: '最高画质',
        prevent_auto_pause: '防止自动暂停',
        chat_memory_gc: '聊天内存清理',
        keyboard_controls: '键盘快捷键 (A-S-D)',
        block_av1: '禁用 AV1 / 强制硬件解码',
        audio_only: '纯音频模式 (广播)',
        lock_elapsed_time: '锁定已播放时间',
        auto_update: '自动更新',
        check_update: '检查更新',
        author: '开发者',
        report_bug: '在 GitHub 反馈问题',
        donate: '赞助开发者',
        special_feature: '重点特色功能',
        search_language: '搜索语言...'
    }
};

/**
 * Lấy mã ngôn ngữ hiện tại của script
 */
export function getActiveLanguage() {
    const cfg = currentConfig.language || 'auto';
    if (cfg !== 'auto') return cfg;

    const navLang = (document.documentElement.lang || navigator.language || 'vi').toLowerCase();
    if (navLang.startsWith('vi')) return 'vi';
    if (navLang.startsWith('ja')) return 'ja';
    if (navLang.startsWith('ko')) return 'ko';
    if (navLang.startsWith('zh-tw') || navLang.startsWith('zh-hk')) return 'zh-TW';
    if (navLang.startsWith('zh')) return 'zh-CN';
    if (navLang.startsWith('es')) return 'es';
    if (navLang.startsWith('fr')) return 'fr';
    if (navLang.startsWith('de')) return 'de';
    if (navLang.startsWith('ru')) return 'ru';
    if (navLang.startsWith('pt')) return 'pt';
    if (navLang.startsWith('it')) return 'it';
    if (navLang.startsWith('id')) return 'id';
    if (navLang.startsWith('th')) return 'th';
    if (navLang.startsWith('hi')) return 'hi';
    if (navLang.startsWith('ar')) return 'ar';
    if (navLang.startsWith('tr')) return 'tr';
    if (navLang.startsWith('pl')) return 'pl';
    if (navLang.startsWith('nl')) return 'nl';
    if (navLang.startsWith('fil')) return 'fil';
    if (navLang.startsWith('en')) return 'en';
    return 'vi';
}

/**
 * Lấy chuỗi bản dịch theo key
 */
export function t(key) {
    const lang = getActiveLanguage();
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        return TRANSLATIONS[lang][key];
    }
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
        return TRANSLATIONS['en'][key];
    }
    if (TRANSLATIONS['vi'] && TRANSLATIONS['vi'][key]) {
        return TRANSLATIONS['vi'][key];
    }
    return key;
}

/**
 * Lấy thông tin ngôn ngữ hiển thị
 */
export function getLanguageInfo(code) {
    return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
}
