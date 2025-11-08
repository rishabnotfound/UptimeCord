import https from 'https';

export function updateDiscordMessage(webhook, messageId, embed) {
    return new Promise((resolve, reject) => {
        const [webhookId, webhookToken] = webhook.split('/webhooks/')[1].split('/');
        const data = JSON.stringify({
            embeds: [embed]
        });
        const options = {
            hostname: 'discord.com',
            path: `/api/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve('Discord message updated successfully');
                } else {
                    reject(`Failed to update Discord message: ${res.statusCode} - ${responseData}`);
                }
            });
        });
        req.on('error', (error) => {
            reject(`Error updating Discord message: ${error.message}`);
        });
        req.write(data);
        req.end();
    });
}
