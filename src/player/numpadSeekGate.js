export function createNumpadSeekGate(intervalMs = 300) {
    let lastKey = null;
    let lastDispatchAt = 0;

    return {
        shouldDispatch(key, isRepeat, now) {
            if (!isRepeat || lastKey !== key) {
                lastKey = key;
                lastDispatchAt = now;
                return true;
            }
            if (now - lastDispatchAt < intervalMs) return false;
            lastDispatchAt = now;
            return true;
        },
        reset() {
            lastKey = null;
            lastDispatchAt = 0;
        }
    };
}
