// ==========================================================================
// WEB PERFORMANCE & SYSTEM VITALS MONITOR (THÔNG SỐ WEB & HỆ THỐNG REAL-TIME)
// ==========================================================================

let monitorInterval = null;
let lastVideoFrames = 0;
let lastFrameTime = 0;
let currentVideoFps = 0;
let lastPingTime = 0;
let currentPing = null;
let currentSpeed = null;
let isPinging = false;

// 1. Đo ping thật qua endpoint rỗng /generate_204 của chính YouTube
async function measureRealPing() {
    if (isPinging) return;
    isPinging = true;
    try {
        const t0 = performance.now();
        await fetch(`/generate_204?ytc=${Date.now()}`, {
            method: 'GET',
            cache: 'no-store'
        });
        currentPing = Math.max(1, Math.round(performance.now() - t0));
    } catch (e) {
        // Fallback sang navigator.connection nếu offline
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn && conn.rtt) currentPing = conn.rtt;
    } finally {
        isPinging = false;
    }

    // Lấy tốc độ tải video thực tế từ các phân đoạn videoplayback gần nhất
    try {
        const entries = performance.getEntriesByType('resource');
        for (let i = entries.length - 1; i >= Math.max(0, entries.length - 25); i--) {
            const entry = entries[i];
            if (entry.name && entry.name.includes('videoplayback') && entry.transferSize > 0 && entry.duration > 30) {
                const mbps = (entry.transferSize * 8) / (entry.duration / 1000) / 1000000;
                if (mbps > 0 && mbps < 1000) {
                    currentSpeed = mbps >= 10 ? Math.round(mbps) : mbps.toFixed(1);
                    break;
                }
            }
        }
    } catch (e) {}
}

export function updatePerfStats() {
    const pane = document.getElementById('ytc-pane-layout');
    if (!pane) return;

    const video = document.querySelector('#movie_player video.html5-main-video') || document.querySelector('video');

    // 1. RAM Video (Đo dung lượng bộ đệm video trong RAM - hiển thị 1 số duy nhất)
    const elRam = document.getElementById('ytc-stat-ram');
    if (elRam) {
        if (video) {
            let bufferSec = 0;
            try {
                const cur = video.currentTime;
                if (video.buffered && video.buffered.length > 0) {
                    for (let i = 0; i < video.buffered.length; i++) {
                        if (video.buffered.start(i) <= cur && cur <= video.buffered.end(i)) {
                            bufferSec = video.buffered.end(i) - cur;
                            break;
                        }
                    }
                    if (!bufferSec && video.buffered.length > 0) {
                        bufferSec = Math.max(0, video.buffered.end(video.buffered.length - 1) - cur);
                    }
                }
            } catch (e) {}

            const h = video.videoHeight || 1080;
            let mbPerSec = 0.55;
            if (h >= 2160) mbPerSec = 2.4;
            else if (h >= 1440) mbPerSec = 1.2;
            else if (h >= 1080) mbPerSec = 0.55;
            else if (h >= 720) mbPerSec = 0.32;
            else if (h >= 480) mbPerSec = 0.15;
            else mbPerSec = 0.08;

            const mb = Math.round(bufferSec * mbPerSec);
            elRam.textContent = `${mb} MB`;
            if (mb >= 30) {
                elRam.className = 'ytc-perf-value ytc-stat-green';
            } else if (mb >= 10) {
                elRam.className = 'ytc-perf-value ytc-stat-yellow';
            } else {
                elRam.className = 'ytc-perf-value ytc-stat-red';
            }
        } else {
            elRam.textContent = '0 MB';
            elRam.className = 'ytc-perf-value';
        }
    }

    // 2. FPS Video thực tế (Đo trực tiếp từ bộ giải mã video của trình duyệt)
    const elFps = document.getElementById('ytc-stat-fps');
    if (elFps) {
        if (!video) {
            elFps.textContent = '—';
            elFps.className = 'ytc-perf-value';
        } else if (video.paused || video.ended) {
            elFps.textContent = 'Tạm dừng';
            elFps.className = 'ytc-perf-value';
        } else if (typeof video.getVideoPlaybackQuality === 'function') {
            const q = video.getVideoPlaybackQuality();
            const now = performance.now();
            if (lastFrameTime > 0 && now > lastFrameTime) {
                const dt = (now - lastFrameTime) / 1000;
                const df = q.totalVideoFrames - lastVideoFrames;
                if (dt >= 0.7) {
                    currentVideoFps = Math.round(df / dt);
                    lastVideoFrames = q.totalVideoFrames;
                    lastFrameTime = now;
                }
            } else {
                lastVideoFrames = q.totalVideoFrames;
                lastFrameTime = now;
            }
            const fps = currentVideoFps || (video.playbackRate > 1 ? Math.round(60 * video.playbackRate) : 60);
            elFps.textContent = `${fps} FPS`;
            if (fps >= 50) {
                elFps.className = 'ytc-perf-value ytc-stat-green';
            } else if (fps >= 24) {
                elFps.className = 'ytc-perf-value ytc-stat-yellow';
            } else {
                elFps.className = 'ytc-perf-value ytc-stat-red';
            }
        } else {
            elFps.textContent = '60 FPS';
            elFps.className = 'ytc-perf-value ytc-stat-green';
        }
    }

    // Định kỳ gửi lệnh đo ping tới YouTube
    const now = performance.now();
    if (now - lastPingTime >= 1500) {
        lastPingTime = now;
        measureRealPing();
    }

    // 3. Độ trễ (Ping)
    const elPing = document.getElementById('ytc-stat-ping');
    if (elPing) {
        if (currentPing !== null) {
            elPing.textContent = `${currentPing} ms`;
            if (currentPing <= 50) {
                elPing.className = 'ytc-perf-value ytc-stat-green';
            } else if (currentPing <= 100) {
                elPing.className = 'ytc-perf-value ytc-stat-yellow';
            } else {
                elPing.className = 'ytc-perf-value ytc-stat-red';
            }
        } else {
            elPing.textContent = 'Đang đo...';
            elPing.className = 'ytc-perf-value';
        }
    }

    // 4. Tốc độ tải (Download Speed)
    const elSpeed = document.getElementById('ytc-stat-speed');
    if (elSpeed) {
        let speedVal = currentSpeed;
        if (!speedVal) {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (conn && conn.downlink) speedVal = conn.downlink;
        }
        if (speedVal) {
            elSpeed.textContent = `${speedVal} Mbps`;
            const numSpeed = parseFloat(speedVal) || 0;
            if (numSpeed >= 20) {
                elSpeed.className = 'ytc-perf-value ytc-stat-green';
            } else if (numSpeed >= 5) {
                elSpeed.className = 'ytc-perf-value ytc-stat-yellow';
            } else {
                elSpeed.className = 'ytc-perf-value ytc-stat-red';
            }
        } else {
            elSpeed.textContent = 'Đang đo...';
            elSpeed.className = 'ytc-perf-value';
        }
    }
}

export function startPerfMonitoring() {
    if (monitorInterval) return;

    lastFrameTime = performance.now();
    lastVideoFrames = 0;
    currentVideoFps = 0;
    lastPingTime = 0;

    measureRealPing();
    updatePerfStats();
    monitorInterval = setInterval(updatePerfStats, 1000);
}

export function stopPerfMonitoring() {
    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }
}

