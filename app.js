import { DISCORD_WEBHOOK, DISCORD_MSGID, SITE_URLS, check_interval } from './config.js';
import { checkSite } from './src/checker.js';
import { updateDiscordMessage } from './src/discord.js';
import { createDiscordEmbed } from './src/embed.js';
import { initializeUptimeData, updateUptimeData } from './src/tracker.js';

const uptimeData = initializeUptimeData(SITE_URLS);

async function monitorSites() {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] Checking sites...`);
    //site checking in parallel alr
    const results = await Promise.all(
        SITE_URLS.map(site => checkSite(site))
    );
    //updating the data
    results.forEach(result => {
        updateUptimeData(uptimeData, result);
        const statusSymbol = result.status === 'up' ? '[OK]' : '[DOWN]';
        const details = result.status === 'up' ? `${result.responseTime}ms` : result.error;
        console.log(`  ${statusSymbol} ${result.name}: ${details}`);
    });
    //sending to embed
    const embed = createDiscordEmbed(results, uptimeData);
    try {
        const message = await updateDiscordMessage(DISCORD_WEBHOOK, DISCORD_MSGID, embed);
        console.log(`[${timestamp}] ${message}`);
    } catch (error) {
        console.error(`[${timestamp}] Error:`, error);
    }
    console.log('');
}
console.log('UptimeCord - Live Status Monitor');
console.log(`Monitoring ${SITE_URLS.length} endpoints with 30s interval`);
console.log('='.repeat(50));
monitorSites();
setInterval(monitorSites, check_interval);