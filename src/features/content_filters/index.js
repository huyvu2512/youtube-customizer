// BỘ QUÉT VÀ GẮN NHÃN NỘI DUNG FEED: HỘI VIÊN, KHÁM PHÁ, CỘNG ĐỒNG
export function scanAndTagFeedContent(scope) {
    const root = scope && scope.querySelectorAll ? scope : document;

    // 1. Quét các kệ (shelves)
    const sections = root.querySelectorAll('ytd-rich-section-renderer');
    sections.forEach((sec) => {
        if (!sec.classList.contains('ytc-shelf-members')) {
            const text = sec.textContent || '';
            if (
                text.includes('lợi ích từ hội viên') ||
                text.includes('Ưu tiên hội viên') ||
                text.includes('ưu tiên hội viên') ||
                (text.includes('hội viên') && text.includes('YouTube chọn lọc')) ||
                text.includes('Get more from memberships') ||
                text.includes('Members only') ||
                text.includes('Members first') ||
                sec.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], a[href*="/membership"], a[href*="/memberships"]')
            ) {
                sec.classList.add('ytc-shelf-members');
            }
        }
        if (!sec.classList.contains('ytc-shelf-explore')) {
            const text = sec.textContent || '';
            if (
                text.includes('Khám phá các chủ đề') ||
                text.includes('Explore other topics') ||
                text.includes('Explore topics') ||
                sec.querySelector('yt-chip-cloud-chip-renderer, yt-chip-cloud-renderer, ytd-feed-filter-chip-bar-renderer')
            ) {
                sec.classList.add('ytc-shelf-explore');
            }
        }
        if (!sec.classList.contains('ytc-shelf-community')) {
            if (
                sec.querySelector('ytd-post-renderer, ytd-backstage-post-renderer, ytd-backstage-post-thread-renderer, ytd-post-multi-image-renderer, ytd-poll-renderer')
            ) {
                sec.classList.add('ytc-shelf-community');
            }
        }
    });

    // 2. Quét từng thẻ video riêng lẻ (Ưu tiên hội viên & Chỉ dành cho hội viên & Bài đăng cộng đồng)
    const videoCards = root.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer');
    videoCards.forEach((card) => {
        if (!card.classList.contains('ytc-item-members')) {
            const text = card.textContent || '';
            if (
                text.includes('Ưu tiên hội viên') ||
                text.includes('ưu tiên hội viên') ||
                text.includes('Chỉ dành cho hội viên') ||
                text.includes('chỉ dành cho hội viên') ||
                text.includes('Members first') ||
                text.includes('Members only') ||
                text.includes('Members-only') ||
                text.includes('Early access') ||
                card.querySelector('.badge-style-type-members-only, .badge-style-type-members-first, [badge-style="MEMBERS_FIRST"], [badge-style="MEMBERS_ONLY"], [aria-label*="hội viên"], [aria-label*="Hội viên"], [aria-label*="Members"]')
            ) {
                card.classList.add('ytc-item-members');
            }
        }
        if (!card.classList.contains('ytc-item-community')) {
            if (card.querySelector('ytd-post-renderer, ytd-backstage-post-renderer, ytd-post-multi-image-renderer, ytd-poll-renderer')) {
                card.classList.add('ytc-item-community');
            }
        }
    });
}
