// scripts/tunnel.js
// Persistent tunnel with auto-reconnection and fixed subdomain for LexiGuide.

const localtunnel = require('localtunnel');

async function startTunnel() {
  const preferredSubdomain = 'lexiguide-navigator';
  console.log(`Requesting public tunnel on port 3000 (preferred: ${preferredSubdomain})...`);

  try {
    const tunnel = await localtunnel({
      port: 3000,
      subdomain: preferredSubdomain,
    });

    console.log(`=========================================`);
    console.log(`LEXIGUIDE LIVE PUBLIC URL:`);
    console.log(tunnel.url);
    console.log(`=========================================`);

    tunnel.on('close', () => {
      console.log('Tunnel connection lost. Auto-reconnecting in 3 seconds...');
      setTimeout(startTunnel, 3000);
    });

    tunnel.on('error', (err) => {
      console.warn('Tunnel socket error, reconnecting...', err?.message);
      try {
        tunnel.close();
      } catch (e) {}
    });
  } catch (err) {
    console.error('Failed to establish tunnel:', err?.message || err);
    console.log('Retrying in 5 seconds...');
    setTimeout(startTunnel, 5000);
  }
}

startTunnel();
