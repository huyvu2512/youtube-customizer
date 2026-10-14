// ==========================================================================
// WEB PERFORMANCE & SYSTEM VITALS MONITOR (THÔNG SỐ WEB & HỆ THỐNG REAL-TIME)
// ==========================================================================

let monitorInterval = null;
let fpsRafId = null;
let frameCount = 0;
let lastFpsTime = 0;
let currentFps = 60;

function tickFps() {
    frameCount++;
    const now = performance.now();
    if (now - lastFpsTime >= 500) {
        currentFps = Math.round((frameCount * 1000) / (now - lastFpsTime));
        frameCount = 0;
        lastFpsTime = now;
    }
    fpsRafId = requestAnimationFrame(tickFps);
}

export function updatePerfStats() {
    const pane = document.getElementById('ytc-pane-layout');
    if (!pane) return;

    // 1. RAM Heap
    const elRam = document.getElementById('ytc-stat-ram');
    if (elRam) {
        const mem = window.performance && window.performance.memory;
        if (mem && mem.usedJSHeapSize) {
            const usedMB = Math.round(mem.usedJSHeapSize / (1024 * 1024));
            const totalMB = Math.round(mem.totalJSHeapSize / (1024 * 1024));
            elRam.textContent = `${usedMB} / ${totalMB} MB`;
        } else {
            elRam.textContent = 'Không hỗ trợ';
        }
    }

    // 2. Tốc độ khung hình (FPS)
    const elFps = document.getElementById('ytc-stat-fps');
    if (elFps) {
        elFps.textContent = `${currentFps} FPS`;
        if (currentFps >= 50) {
            elFps.className = 'ytc-perf-value ytc-stat-green';
        } else if (currentFps >= 30) {
            elFps.className = 'ytc-perf-value ytc-stat-accent';
        } else {
            elFps.className = 'ytc-perf-value';
        }
    }

    // 3. Mạng & Ping (RTT)
    const elNet = document.getElementById('ytc-stat-network');
    if (elNet) {
        try {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (conn) {
                const parts = [];
                if (conn.rtt) parts.push(`${conn.rtt}ms`);
                if (conn.downlink) parts.push(`${conn.downlink}Mbps`);
                elNet.textContent = parts.join(' • ') || (conn.effectiveType ? conn.effectiveType.toUpperCase() : 'OK');
            } else {
                elNet.textContent = 'Trực tuyến';
            }
        } catch (e) {
            elNet.textContent = '—';
        }
    }

    // 4. Số lượng DOM Nodes
    const elDom = document.getElementById('ytc-stat-dom');
    if (elDom) {
        try {
            const count = document.getElementsByTagName('*').length;
            elDom.textContent = `${count.toLocaleString()} thẻ`;
        } catch (e) {
            elDom.textContent = '—';
        }
    }
}

export function startPerfMonitoring() {
    if (monitorInterval) return;

    lastFpsTime = performance.now();
    frameCount = 0;
    fpsRafId = requestAnimationFrame(tickFps);

    updatePerfStats();
    monitorInterval = setInterval(updatePerfStats, 1000);
}

export function stopPerfMonitoring() {
    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }
    if (fpsRafId) {
        cancelAnimationFrame(fpsRafId);
        fpsRafId = null;
    }
}
