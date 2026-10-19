// ==========================================================================
// WEB PERFORMANCE & SYSTEM VITALS MONITOR (THÔNG SỐ WEB & HỆ THỐNG REAL-TIME)
// ==========================================================================

let monitorInterval = null;
let lastVideoFrames = null;
let lastFrameTime = null;
let lastVideoIdentity = null;
let currentVideoFps = null;
let lastPingTime = 0;
let currentPing = null;
let currentSpeed = null;
let currentSpeedTime = 0;
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
        currentPing = null;
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
                    currentSpeed = mbps >= 10 ? Math.round(mbps) : Number(mbps.toFixed(1));
                    currentSpeedTime = performance.now();
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

    // 1. Video buffer ahead, in seconds. Browser APIs do not expose video RAM usage.
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
                }
            } catch (e) {}

            elRam.textContent = `${bufferSec.toFixed(1)} s`;
            if (bufferSec >= 30) {
                elRam.className = 'ytc-perf-value ytc-stat-green';
            } else if (bufferSec >= 10) {
                elRam.className = 'ytc-perf-value ytc-stat-yellow';
            } else {
                elRam.className = 'ytc-perf-value ytc-stat-red';
            }
        } else {
            elRam.textContent = '—';
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
            lastVideoFrames = null;
            lastFrameTime = null;
            lastVideoIdentity = null;
            currentVideoFps = null;
            elFps.textContent = 'Tạm dừng';
            elFps.className = 'ytc-perf-value';
        } else if (typeof video.getVideoPlaybackQuality === 'function') {
            const q = video.getVideoPlaybackQuality();
            const now = performance.now();
            const identity = `${video.currentSrc || video.src}|${video.videoWidth}x${video.videoHeight}`;
            const frames = q.totalVideoFrames;
            if (!Number.isFinite(frames)) {
                elFps.textContent = 'Không hỗ trợ';
                elFps.className = 'ytc-perf-value';
            } else {
                if (identity !== lastVideoIdentity || lastFrameTime === null || frames < lastVideoFrames) {
                    lastVideoIdentity = identity;
                    lastVideoFrames = frames;
                    lastFrameTime = now;
                    currentVideoFps = null;
                } else if (now > lastFrameTime) {
                    const dt = (now - lastFrameTime) / 1000;
                    const df = frames - lastVideoFrames;
                    if (dt >= 0.7) {
                        const measuredFps = df / dt;
                        currentVideoFps = measuredFps <= 240 ? Math.round(measuredFps) : null;
                        lastVideoFrames = frames;
                        lastFrameTime = now;
                    }
                }
                if (currentVideoFps === null) {
                    elFps.textContent = 'Đang đo...';
                    elFps.className = 'ytc-perf-value';
                } else {
                    const fps = currentVideoFps;
                    elFps.textContent = `${fps} FPS`;
                    if (fps >= 50) {
                        elFps.className = 'ytc-perf-value ytc-stat-green';
                    } else if (fps >= 24) {
                        elFps.className = 'ytc-perf-value ytc-stat-yellow';
                    } else {
                        elFps.className = 'ytc-perf-value ytc-stat-red';
                    }
                }
            }
        } else {
            elFps.textContent = 'Không hỗ trợ';
            elFps.className = 'ytc-perf-value';
        }
    }

    // Định kỳ gửi lệnh đo ping tới YouTube
    const now = performance.now();
    if (now - lastPingTime >= 1500) {
        lastPingTime = now;
        measureRealPing();
    }

    // 3. HTTP response latency to YouTube, not ICMP ping.
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
        let speedVal = currentSpeed && now - currentSpeedTime < 15000 ? currentSpeed : null;
        if (speedVal === null) {
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

    lastFrameTime = null;
    lastVideoFrames = null;
    lastVideoIdentity = null;
    currentVideoFps = null;
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
    lastFrameTime = null;
    lastVideoFrames = null;
    lastVideoIdentity = null;
    currentVideoFps = null;
}

