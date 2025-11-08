import http from 'http';
import https from 'https';
import { getStatusMessage } from './utils.js';

export function checkSite(site) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const url = new URL(site.url);
        const protocol = url.protocol === 'https:' ? https : http;
        const req = protocol.get(site.url, { timeout: 10000 }, (res) => {
            const responseTime = Date.now() - startTime;
            const statusCode = res.statusCode;
            const isHealthy = statusCode >= 200 && statusCode < 400;
            if (isHealthy) {
                resolve({
                    name: site.name,
                    url: site.url,
                    status: 'up',
                    responseTime: responseTime,
                    statusCode: statusCode
                });
            } else {
                resolve({
                    name: site.name,
                    url: site.url,
                    status: 'down',
                    responseTime: responseTime,
                    statusCode: statusCode,
                    error: `HTTP ${statusCode} - ${getStatusMessage(statusCode)}`
                });
            }
        });
        req.on('error', (error) => {
            resolve({
                name: site.name,
                url: site.url,
                status: 'down',
                responseTime: 0,
                error: error.message
            });
        });
        req.on('timeout', () => {
            req.destroy();
            resolve({
                name: site.name,
                url: site.url,
                status: 'down',
                responseTime: 0,
                error: 'Request Timeout (>10s)'
            });
        });
    });
}
