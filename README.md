# ⚡ UptimeCord

<img width="911" height="545" alt="image" src="https://github.com/user-attachments/assets/7981cfe3-eb32-4a8f-aa3a-43a4fb1e54be" />

Real-time server uptime monitoring with Discord webhook integration.

## Features

- 🔍 Monitor multiple websites simultaneously
- ⚡ Track response times and uptime duration
- 📊 Calculate uptime percentage and statistics
- 🔄 Auto-updates Discord message every 30 seconds
- 🎨 Beautiful Discord embeds with status indicators
- 📝 Incident tracking and reporting

## Project Structure

```
UptimeCord/
├── src/
│   ├── checker.js      # Site health checking logic
│   ├── discord.js      # Discord webhook integration
│   ├── embed.js        # Discord embed builder
│   ├── tracker.js      # Uptime data tracking
│   └── utils.js        # Utility functions
├── app.js              # Main application entry point
├── config.js           # Configuration (webhook, sites)
├── package.json        # Project metadata
└── README.md           # Documentation
```

## Setup

1. Configure your Discord webhook and sites in `config.js`:

```javascript
export const DISCORD_WEBHOOK = "your-webhook-url";
export const DISCORD_MSGID = "your-message-id";

export const SITE_URLS = [
    { name: "example", url: "https://example.com" }
];
```

2. Install dependencies (none required - uses Node.js built-ins)

3. Run the monitor:

```bash
npm start
```

## How it works

- Checks each site every 30 seconds
- Tracks uptime duration, response times, and incidents
- Updates a specific Discord message with current status
- Maintains uptime statistics across checks
- Detects HTTP errors (4xx, 5xx) and connection failures

## Modules

### checker.js
Handles site health checks via HTTP/HTTPS requests. Monitors response times and status codes.

### discord.js
Manages Discord webhook API communication for updating status messages.

### embed.js
Builds formatted Discord embeds with status information, statistics, and visual indicators.

### tracker.js
Maintains uptime data, incident history, and response time statistics for each monitored site.

### utils.js
Provides utility functions for formatting durations, calculating statistics, and status messages.


## Credits

Made with ❤️ by [R](https://github.com/rishabnotfound)

[GitHub Repository](https://github.com/rishabnotfound/UptimeCord)

## License

MIT License - See LICENSE file for details
