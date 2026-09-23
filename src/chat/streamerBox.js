// ==========================================================================
// KHUNG NỔI STREAMER (KÉO THẢ, CO GIÃN, NEO GÓC)
// ==========================================================================
import { safeHTML } from '../core/utils.js';
import { CHATBOX_POS_KEY, syncPlayerFullscreenSize } from './chatState.js';

export function getSavedChatBoxPos() {
    try {
        const stored = localStorage.getItem(CHATBOX_POS_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
}

export function saveChatBoxPos(data) {
    try {
        const existing = getSavedChatBoxPos() || {};
        localStorage.setItem(CHATBOX_POS_KEY, JSON.stringify({ ...existing, ...data }));
    } catch (e) {}
}

export function centerChatBox(box, player) {
    if (!box) return;
    const p = player || document.querySelector('#movie_player:not(#inline-preview-player)');
    const pWidth = p ? (p.offsetWidth || p.clientWidth) : window.innerWidth;
    const pHeight = p ? (p.offsetHeight || p.clientHeight) : window.innerHeight;

    const boxW = Math.min(340, Math.max(260, Math.round(pWidth * 0.32)));
    const boxH = Math.min(300, Math.max(160, Math.round(pHeight * 0.4)));

    box.style.left = '50%';
    box.style.top = '50%';
    box.style.right = 'auto';
    box.style.bottom = 'auto';
    box.style.transform = 'translate(-50%, -50%)';
    box.style.width = `${boxW}px`;
    box.style.height = `${boxH}px`;

    saveChatBoxPos({
        isCentered: true,
        anchorX: 'left',
        anchorY: 'bottom',
        offsetX: 10,
        offsetY: 40,
        width: box.style.width,
        height: box.style.height
    });
}

export function applyChatBoxPos(box, player) {
    if (!box) return;
    const p = player || document.querySelector('#movie_player:not(#inline-preview-player)');
    if (!p) return;

    const pos = getSavedChatBoxPos();
    if (!pos) {
        centerChatBox(box, p);
        return;
    }

    if (pos.isCentered) {
        box.style.left = '50%';
        box.style.top = '50%';
        box.style.right = 'auto';
        box.style.bottom = 'auto';
        box.style.transform = 'translate(-50%, -50%)';
        if (pos.width) box.style.width = pos.width;
        if (pos.height) box.style.height = pos.height;
        return;
    }

    box.style.transform = 'none';
    if (pos.width) box.style.width = pos.width;
    if (pos.height) box.style.height = pos.height;

    const pW = p.offsetWidth || p.clientWidth || window.innerWidth;
    const pH = p.offsetHeight || p.clientHeight || window.innerHeight;
    const bW = box.offsetWidth || 300;
    const bH = box.offsetHeight || 200;

    if (pos.anchorX === 'right') {
        const rightVal = Math.min(pos.offsetX || 0, Math.max(0, pW - bW));
        box.style.right = `${rightVal}px`;
        box.style.left = 'auto';
    } else {
        const leftVal = Math.min(pos.offsetX || 0, Math.max(0, pW - bW));
        box.style.left = `${leftVal}px`;
        box.style.right = 'auto';
    }

    if (pos.anchorY === 'top') {
        const topVal = Math.min(pos.offsetY || 0, Math.max(0, pH - bH));
        box.style.top = `${topVal}px`;
        box.style.bottom = 'auto';
    } else {
        const bottomVal = Math.min(pos.offsetY || 0, Math.max(0, pH - bH));
        box.style.bottom = `${bottomVal}px`;
        box.style.top = 'auto';
    }
}

export function showInitialBox(box) {
    if (!box) return;
    box.classList.add('ytc-box-initial');
    let hasEntered = false;

    const onEnter = () => { hasEntered = true; };
    const onLeave = () => {
        if (hasEntered) {
            box.classList.remove('ytc-box-initial');
            box.removeEventListener('mouseenter', onEnter);
            box.removeEventListener('mouseleave', onLeave);
        }
    };

    box.addEventListener('mouseenter', onEnter);
    box.addEventListener('mouseleave', onLeave);
}

export function setupChatBoxInteractions(box, player) {
    const header = box.querySelector('.ytc-box-header');
    const resizeHandle = box.querySelector('.ytc-box-resize');

    if (header) {
        header.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            centerChatBox(box, player);
        });

        header.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (e.target.closest('.ytc-box-close')) return;
            e.preventDefault();
            e.stopPropagation();

            const pRect = player.getBoundingClientRect();
            const bRect = box.getBoundingClientRect();

            const shiftX = e.clientX - bRect.left;
            const shiftY = e.clientY - bRect.top;

            // Cache kích thước cố định tại thời điểm mousedown, TUYỆT ĐỐI không đọc lại offsetWidth/offsetHeight trong onMouseMove
            const boxW = box.offsetWidth || bRect.width;
            const boxH = box.offsetHeight || bRect.height;
            const maxLeft = Math.max(0, pRect.width - boxW);
            const maxTop = Math.max(0, pRect.height - boxH);

            box.classList.add('ytc-dragging');

            let rafId = null;
            let currentClientX = e.clientX;
            let currentClientY = e.clientY;

            function updatePosition() {
                rafId = null;
                let newLeft = Math.max(0, Math.min(currentClientX - pRect.left - shiftX, maxLeft));
                let newTop = Math.max(0, Math.min(currentClientY - pRect.top - shiftY, maxTop));

                box.style.left = `${newLeft}px`;
                box.style.top = `${newTop}px`;
                box.style.right = 'auto';
                box.style.bottom = 'auto';
                box.style.transform = 'none';
            }

            function onMouseMove(moveEvent) {
                currentClientX = moveEvent.clientX;
                currentClientY = moveEvent.clientY;
                if (!rafId) {
                    rafId = requestAnimationFrame(updatePosition);
                }
            }

            function onMouseUp() {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                box.classList.remove('ytc-dragging');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                const currentPRect = player.getBoundingClientRect();
                const currentBRect = box.getBoundingClientRect();

                const distLeft = Math.max(0, currentBRect.left - currentPRect.left);
                const distRight = Math.max(0, currentPRect.right - currentBRect.right);
                const distTop = Math.max(0, currentBRect.top - currentPRect.top);
                const distBottom = Math.max(0, currentPRect.bottom - currentBRect.bottom);

                const anchorX = distLeft <= distRight ? 'left' : 'right';
                const anchorY = distTop <= distBottom ? 'top' : 'bottom';

                const offsetX = anchorX === 'left' ? distLeft : distRight;
                const offsetY = anchorY === 'top' ? distTop : distBottom;

                if (anchorX === 'left') {
                    box.style.left = `${Math.round(offsetX)}px`;
                    box.style.right = 'auto';
                } else {
                    box.style.right = `${Math.round(offsetX)}px`;
                    box.style.left = 'auto';
                }

                if (anchorY === 'top') {
                    box.style.top = `${Math.round(offsetY)}px`;
                    box.style.bottom = 'auto';
                } else {
                    box.style.bottom = `${Math.round(offsetY)}px`;
                    box.style.top = 'auto';
                }

                saveChatBoxPos({
                    isCentered: false,
                    anchorX,
                    anchorY,
                    offsetX: Math.round(offsetX),
                    offsetY: Math.round(offsetY),
                    width: box.style.width,
                    height: box.style.height
                });
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();

            const startX = e.clientX;
            const startY = e.clientY;
            const startW = box.offsetWidth;
            const startH = box.offsetHeight;
            const maxW = (player.offsetWidth || window.innerWidth) * 0.8;
            const maxH = (player.offsetHeight || window.innerHeight) * 0.8;

            box.classList.add('ytc-dragging');

            let rafId = null;
            let currentClientX = e.clientX;
            let currentClientY = e.clientY;

            function updateResize() {
                rafId = null;
                const newW = Math.max(200, Math.min(startW + (currentClientX - startX), maxW));
                const newH = Math.max(100, Math.min(startH + (currentClientY - startY), maxH));

                box.style.width = `${newW}px`;
                box.style.height = `${newH}px`;
            }

            function onMouseMove(moveEvent) {
                currentClientX = moveEvent.clientX;
                currentClientY = moveEvent.clientY;
                if (!rafId) {
                    rafId = requestAnimationFrame(updateResize);
                }
            }

            function onMouseUp() {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                box.classList.remove('ytc-dragging');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                saveChatBoxPos({
                    width: box.style.width,
                    height: box.style.height
                });
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    window.addEventListener('resize', () => {
        if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;
        const p = document.querySelector('#movie_player:not(#inline-preview-player)');
        if (box && p) applyChatBoxPos(box, p);
        syncPlayerFullscreenSize();
    });
    document.addEventListener('fullscreenchange', () => {
        if (!location.pathname.startsWith('/watch') && !location.pathname.startsWith('/live')) return;
        const p = document.querySelector('#movie_player:not(#inline-preview-player)');
        if (box && p) {
            applyChatBoxPos(box, p);
            setTimeout(() => applyChatBoxPos(box, p), 100);
            setTimeout(() => applyChatBoxPos(box, p), 300);
        }
        syncPlayerFullscreenSize();
        setTimeout(syncPlayerFullscreenSize, 50);
        setTimeout(syncPlayerFullscreenSize, 150);
        setTimeout(syncPlayerFullscreenSize, 300);
        setTimeout(syncPlayerFullscreenSize, 600);
    });

    if (window.ResizeObserver && player) {
        const ro = new ResizeObserver(() => {
            applyChatBoxPos(box, player);
        });
        ro.observe(player);
    }
}
