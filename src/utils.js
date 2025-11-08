export function getStatusMessage(code) {
    const messages = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout'
    };
    return messages[code] || 'Unknown Error';
}

export function formatUptime(milliseconds) {
    if (!milliseconds) return '0s';
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

export function calculateResponseStats(responseTimes) {
    if (responseTimes.length === 0) return { min: 0, max: 0, avg: 0 };
    const min = Math.min(...responseTimes);
    const max = Math.max(...responseTimes);
    const avg = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
    return { min, max, avg };
}
