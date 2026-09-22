// ==========================================================================
// DANMAKU (10 LÀN CHỮ CHẠY NGANG, ĐIỀU PHỐI THƯA THỚT, CHỐNG CHỒNG ĐÈ)
// ==========================================================================
import { safeHTML, setElementHTML } from '../core/utils.js';
import { danmakuContainer } from './chatState.js';

export const TOTAL_LANES = 10;
export const laneNextAvailableTime = new Array(TOTAL_LANES).fill(0);
export const danmakuQueue = [];
let danmakuSchedulerTimer = null;
export let lastDanmakuSpawnTime = 0;
export function setLastDanmakuSpawnTime(t) { lastDanmakuSpawnTime = t; }
export let lastSpawnedLane = -1;
export function setLastSpawnedLane(l) { lastSpawnedLane = l; }

const MIN_GLOBAL_INTERVAL = 480; // Khoảng cách tối thiểu giữa 2 tin bất kỳ (ms) để luôn THƯA THỚT, chống dính chùm

function getAvailableLane(now) {
    const freeLanes = [];
    for (let i = 0; i < TOTAL_LANES; i++) {
        if (laneNextAvailableTime[i] <= now) {
            freeLanes.push(i);
        }
    }

    if (freeLanes.length === 0) return -1;

    const differentLanes = freeLanes.filter(l => l !== lastSpawnedLane);
    const candidates = differentLanes.length > 0 ? differentLanes : freeLanes;

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
}

function spawnDanmakuItem(data, laneIndex) {
    let container = danmakuContainer || document.getElementById('ytc-danmaku-container');
    if (!container) {
        const player = document.querySelector('#movie_player, .html5-video-player');
        if (player) {
            container = document.createElement('div');
            container.id = 'ytc-danmaku-container';
            container.style.display = 'block';
            player.appendChild(container);
        }
    }
    if (!container || !data || !data.messageHtml) return;
    if (container.style.display === 'none') container.style.display = 'block';

    const item = document.createElement('div');
    item.className = 'ytc-danmaku-item';

    const topPercent = 6 + laneIndex * 8.2;
    item.style.top = `${topPercent}%`;

    setElementHTML(item, `
        <span class="ytc-chat-text ${data.authorClass || ''}">${data.messageHtml}</span>
    `);

    container.appendChild(item);

    const plainText = (data.messageHtml || '').replace(/<[^>]*>/g, '');
    const textLen = plainText.length || 8;
    const busyDuration = Math.min(5500, Math.max(3200, textLen * 110 + 2000));
    laneNextAvailableTime[laneIndex] = Date.now() + busyDuration;

    item.addEventListener('animationend', () => item.remove());
    setTimeout(() => {
        if (item.isConnected) item.remove();
    }, 12000);
}

function processDanmakuQueue() {
    if (document.hidden) return;
    if (danmakuQueue.length === 0) return;

    const now = Date.now();
    if (now - lastDanmakuSpawnTime < MIN_GLOBAL_INTERVAL) {
        return;
    }

    const lane = getAvailableLane(now);
    if (lane !== -1) {
        const nextData = danmakuQueue.shift();
        lastDanmakuSpawnTime = now;
        lastSpawnedLane = lane;
        spawnDanmakuItem(nextData, lane);
    }

    if (danmakuQueue.length > 6) {
        while (danmakuQueue.length > 5) {
            const idx = danmakuQueue.findIndex(d => !d.authorClass && !d.messageHtml.includes('purchase-amount'));
            if (idx !== -1) {
                danmakuQueue.splice(idx, 1);
            } else {
                danmakuQueue.shift();
            }
        }
    }
}

export function startDanmakuScheduler() {
    if (!danmakuSchedulerTimer) {
        danmakuSchedulerTimer = setInterval(processDanmakuQueue, 50);
    }
}

export function stopDanmakuScheduler() {
    if (danmakuSchedulerTimer) {
        clearInterval(danmakuSchedulerTimer);
        danmakuSchedulerTimer = null;
    }
    danmakuQueue.length = 0;
    laneNextAvailableTime.fill(0);
    lastDanmakuSpawnTime = 0;
    lastSpawnedLane = -1;
}
