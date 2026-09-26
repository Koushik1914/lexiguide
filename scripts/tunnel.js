// scripts/tunnel.js
// Persistent tunnel with auto-reconnection and fixed subdomain for LexiGuide.

const localtunnel = require('localtunnel');

// Keep Node process running indefinitely
const heartbeat = setInterval(() => {}, 15000);

let currentTunnel = null;

async function startTunnel() {
  const preferredSubdomain = 'lexiguide-navigator';
  console.log(`[LexiGuide Tunnel] Connecting to public tunnel on port 3000 (subdomain: ${preferredSubdomain})...`);

  try {
    if (currentTunnel) {
      try {
        currentTunnel.close();
      } catch (e) {}
    }

    currentTunnel = await localtunnel({
      port: 3000,
      subdomain: preferredSubdomain,
    });

    console.log(`=========================================`);
    console.log(`LEXIGUIDE LIVE PUBLIC URL:`);
    console.log(currentTunnel.url);
    console.log(`=========================================`);

    currentTunnel.on('close', () => {
      console.log('[LexiGuide Tunnel] Closed. Reconnecting in 3s...');
      setTimeout(startTunnel, 3000);
    });

    currentTunnel.on('error', (err) => {
      console.warn('[LexiGuide Tunnel] Socket error:', err?.message || err);
      setTimeout(startTunnel, 3000);
    });
  } catch (err) {
    console.error('[LexiGuide Tunnel] Failed to establish:', err?.message || err);
    setTimeout(startTunnel, 5000);
  }
}

process.on('SIGINT', () => {
  clearInterval(heartbeat);
  if (currentTunnel) currentTunnel.close();
  process.exit(0);
});

startTunnel();
