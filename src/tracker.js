export function initializeUptimeData(sites) {
    const uptimeData = {};
    sites.forEach(site => {
        uptimeData[site.name] = {
            upSince: null,
            downSince: null,
            lastStatus: null,
            lastResponseTime: 0,
            totalChecks: 0,
            successfulChecks: 0,
            responseTimes: [],
            incidents: [],
            last24Hours: Array(24).fill(0).map(() => ({ up: 0, down: 0 }))
        };
    });
    return uptimeData;
}

export function updateUptimeData(uptimeData, result) {
    const data = uptimeData[result.name];
    const now = Date.now();
    data.totalChecks++;
    data.lastResponseTime = result.responseTime;
    if (result.status === 'up') {
        data.responseTimes.push(result.responseTime);
        if (data.responseTimes.length > 100) {
            data.responseTimes.shift();
        }
    }
    if (result.status === 'up') {
        data.successfulChecks++;
        if (data.lastStatus !== 'up') {
            data.upSince = now;
            data.downSince = null;
            if (data.lastStatus === 'down') {
                data.incidents.push({
                    type: 'recovery',
                    timestamp: now,
                    duration: data.downSince ? now - data.downSince : 0
                });
            }
        }
    } else {
        if (data.lastStatus !== 'down') {
            data.downSince = now;
            data.upSince = null
            data.incidents.push({
                type: 'outage',
                timestamp: now,
                error: result.error
            });
        }
    }
    data.lastStatus = result.status;
}
