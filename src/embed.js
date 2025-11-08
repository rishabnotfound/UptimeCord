import { formatUptime, calculateResponseStats } from './utils.js';

export function createDiscordEmbed(results, uptimeData) {
    const now = new Date();
    const fields = [];
    let totalUp = 0;
    let totalDown = 0;
    let avgResponseTime = 0;
    let responseCount = 0;
    let allResponseTimes = [];
    results.forEach(result => {
        const data = uptimeData[result.name];
        const uptime = result.status === 'up' && data.upSince
            ? formatUptime(Date.now() - data.upSince)
            : 'N/A';
        const downtime = result.status === 'down' && data.downSince
            ? formatUptime(Date.now() - data.downSince)
            : null;
        const uptimePercent = data.totalChecks > 0
            ? ((data.successfulChecks / data.totalChecks) * 100).toFixed(2)
            : '100.00';
        if (result.status === 'up') {
            totalUp++;
            avgResponseTime += result.responseTime;
            responseCount++;
            allResponseTimes = [...allResponseTimes, ...data.responseTimes];
        } else {
            totalDown++;
        }
        const responseStats = calculateResponseStats(data.responseTimes);
        const recentIncidents = data.incidents.filter(i => i.type === 'outage').length;
        let fieldValue = `${result.url}\n\n`;
        if (result.status === 'up') {
            fieldValue += `**Status** → Operational`;
            fieldValue += `\n**Response** → ${result.responseTime}ms`;
            if (responseStats.avg > 0 && responseStats.avg !== result.responseTime) {
                fieldValue += ` (avg: ${responseStats.avg}ms)`;
            }
            fieldValue += `\n**Uptime** → ${uptimePercent}% • ${uptime}`;
            if (recentIncidents > 0) {
                fieldValue += `\n**Incidents** → ${recentIncidents}`;
            }
        } else {
            fieldValue += `**Status** → Down`;
            fieldValue += `\n**Error** → ${result.error}`;
            if (downtime) {
                fieldValue += `\n**Duration** → ${downtime}`;
            }
            fieldValue += `\n**Uptime** → ${uptimePercent}%`;
            if (recentIncidents > 0) {
                fieldValue += `\n**Incidents** → ${recentIncidents}`;
            }
        }
        fieldValue += `\n${'─'.repeat(40)}`;
        const statusIndicator = result.status === 'up' ? '🟢' : '🔴';
        fields.push({
            name: `${statusIndicator} ${result.name.toUpperCase()}`,
            value: fieldValue,
            inline: false
        });
    });
    const avgResponse = responseCount > 0
        ? Math.round(avgResponseTime / responseCount)
        : 0;
    const overallUptime = results.length > 0
        ? ((results.reduce((sum, r) => {
            const d = uptimeData[r.name];
            return sum + (d.totalChecks > 0 ? (d.successfulChecks / d.totalChecks) * 100 : 100);
        }, 0) / results.length).toFixed(2))
        : '100.00';
    let statusText = '';
    let statusEmoji = '';
    if (totalDown === 0) {
        statusText = 'All Systems Operational';
        statusEmoji = '✅';
    } else if (totalUp === 0) {
        statusText = 'All Systems Down';
        statusEmoji = '❌';
    } else {
        statusText = 'Partial Outage';
        statusEmoji = '⚠️';
    }
    let description = `${statusEmoji} **${statusText}**\n`;
    description += `**${totalUp}** online • **${totalDown}** offline • **${overallUptime}%** uptime • **${avgResponse}ms** response\n`;
    description += `${'═'.repeat(30)}\n`;
    const embed = {
        title: '📡 UptimeCord Status',
        description: description,
        color: totalDown === 0 ? 0x57F287 : (totalUp === 0 ? 0xED4245 : 0xFEE75C),
        fields: fields,
        footer: {
            text: `Last check • Auto-refresh every 30s`
        },
        timestamp: now.toISOString()
    };
    return embed;
}
