export function getBackgroundChatRetryAction({ ready, elapsedMs, attempts, retryAfterMs, maxAttempts }) {
    if (ready) return 'keep';
    if (attempts >= maxAttempts) return 'stop';
    if (elapsedMs < retryAfterMs) return 'wait';
    return 'retry';
}
