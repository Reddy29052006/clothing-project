/**
 * scripts/ngrok.js
 * ─────────────────────────────────────────────────────────────
 * Starts ngrok tunnels for EVERY local service:
 *   • backend  → port 5001
 *   • frontend → port 5173
 *
 * Uses a temporary ngrok YAML config so all tunnels run inside
 * ONE ngrok agent session (required for free/paid accounts).
 *
 * After tunnels are live it prints a summary box and optionally
 * patches apps/frontend/.env so VITE_API_URL points to the
 * live ngrok backend URL automatically.
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

const { spawn }    = require('child_process');
const http         = require('http');
const fs           = require('fs');
const path         = require('path');
const os           = require('os');

// ── Load .env files ────────────────────────────────────────────
function loadEnv(filePath) {
  try {
    if (!fs.existsSync(filePath)) return;
    fs.readFileSync(filePath, 'utf-8').split('\n').forEach(line => {
      const [key, ...rest] = line.split('=');
      const k = (key || '').trim();
      if (k && !k.startsWith('#')) {
        process.env[k] = rest.join('=').trim();
      }
    });
  } catch { /* ignore */ }
}

loadEnv(path.resolve(__dirname, '../apps/backend/.env'));
loadEnv(path.resolve(__dirname, '../apps/frontend/.env'));

// ── Config ─────────────────────────────────────────────────────
const BACKEND_PORT  = parseInt(process.env.PORT  || '5001', 10);
const FRONTEND_PORT = 5173;   // Vite default; adjust if different
const NGROK_API     = 'http://127.0.0.1:4040/api/tunnels';
const POLL_DELAY    = 1500;   // ms between API polls
const MAX_RETRIES   = 25;
const STARTUP_WAIT  = 4000;   // ms head-start for backends

// ── Helpers ────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

function box(lines) {
  const width = Math.max(...lines.map(l => l.length)) + 4;
  const bar   = '─'.repeat(width);
  console.log(`\n╭${bar}╮`);
  lines.forEach(l => console.log(`│  ${l.padEnd(width - 2)}  │`));
  console.log(`╰${bar}╯\n`);
}

function httpGet(url) {
  return new Promise(resolve => {
    http.get(url, res => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

// ── Poll until all expected tunnels appear ──────────────────────
async function waitForTunnels(expectedNames, retries = 0) {
  if (retries >= MAX_RETRIES) {
    console.error('[ngrok] ❌  Timed out waiting for tunnels.');
    process.exit(1);
  }

  const json = await httpGet(NGROK_API);
  if (json && Array.isArray(json.tunnels) && json.tunnels.length >= expectedNames.length) {
    // Build map: name → public_url  (prefer https)
    const map = {};
    json.tunnels.forEach(t => {
      const name = t.name.replace(/ \(http\)$/, '').replace(/ \(https\)$/, '');
      if (!map[name] || t.proto === 'https') {
        map[name] = t.public_url;
      }
    });

    const allReady = expectedNames.every(n => map[n]);
    if (allReady) return map;
  }

  await sleep(POLL_DELAY);
  return waitForTunnels(expectedNames, retries + 1);
}

function buildConfig() {
  // authtoken is already saved in ngrok's global config via
  // `ngrok config add-authtoken …` — no need to repeat it here.
  const domain = process.env.NGROK_DOMAIN || '';
  const lines = [
    'version: "3"',
    'tunnels:',
    '  frontend:',
    `    addr: ${FRONTEND_PORT}`,
    '    proto: http',
    ...(domain ? [`    domain: ${domain}`] : []),
  ];

  const cfgPath = path.join(os.tmpdir(), 'fitcraft-ngrok.yml');
  fs.writeFileSync(cfgPath, lines.join('\n') + '\n', 'utf-8');
  return cfgPath;
}

// ── Patch frontend .env with live backend URL ───────────────────
function patchFrontendEnv(backendUrl) {
  const envPath = path.resolve(__dirname, '../apps/frontend/.env');
  try {
    let content = fs.readFileSync(envPath, 'utf-8');
    content = content
      .replace(/^VITE_API_URL=.*/m,  `VITE_API_URL=${backendUrl}/api`)
      .replace(/^VITE_BASE_URL=.*/m, `VITE_BASE_URL=${backendUrl}`);
    fs.writeFileSync(envPath, content, 'utf-8');
    console.log('[ngrok] ✅  Updated frontend .env with live ngrok backend URL.');
  } catch (e) {
    console.warn('[ngrok] ⚠️  Could not patch frontend .env:', e.message);
  }
}

// ── Kill any existing ngrok process ───────────────────────────
function killExistingNgrok() {
  return new Promise(resolve => {
    // Ask the local API for any running tunnels, then stop the agent via SIGTERM
    // The simplest cross-platform approach: run `ngrok api endpoints list` is
    // unavailable on free plans, so we just kill any ngrok OS process instead.
    const killer = spawn('taskkill', ['/F', '/IM', 'ngrok.exe'], {
      stdio: 'ignore',
      shell: true,
    });
    killer.on('close', () => resolve()); // ignore errors — process may not exist
  });
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  console.log('[ngrok] ⏳  Waiting for services to start…');
  await sleep(STARTUP_WAIT);

  // Kill any leftover ngrok from a previous run (prevents ERR_NGROK_334)
  await killExistingNgrok();
  await sleep(800); // brief pause so the OS releases the port

  const cfgPath = buildConfig();

  // Start ngrok with the config file
  const ngrokProc = spawn('ngrok', ['start', '--all', `--config=${cfgPath}`], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  ngrokProc.stderr.on('data', d => {
    const msg = d.toString().trim();
    if (msg.toLowerCase().includes('error') || msg.includes('ERR_NGROK')) {
      console.error('[ngrok] ⚠️ ', msg);
    }
  });

  ngrokProc.on('error', err => {
    if (err.code === 'ENOENT') {
      console.error('[ngrok] ❌  ngrok not found in PATH. Install from https://ngrok.com/download');
    } else {
      console.error('[ngrok] ❌  Failed to start:', err.message);
    }
    process.exit(1);
  });

  ngrokProc.on('exit', code => {
    if (code !== 0 && code !== null) {
      console.error(`[ngrok] ⚠️  ngrok exited with code ${code}`);
    }
  });

  // Wait for all tunnels
  const tunnelMap = await waitForTunnels(['frontend']);

  const frontendUrl = tunnelMap['frontend'];

  box([
    '🚇  ngrok tunnel is LIVE',
    '',
    `  🖥️  Frontend  : ${frontendUrl}`,
    `  ⚙️  Backend   : ${frontendUrl}`,
    `  📡  API       : ${frontendUrl}/api`,
    '',
    '  Share this URL for remote access / testing.',
    '  Inspect traffic → http://127.0.0.1:4040',
  ]);

  // Patch frontend .env so Vite picks up the ngrok API URL on next hot-reload
  patchFrontendEnv(frontendUrl);

  // Graceful shutdown
  const cleanup = () => { ngrokProc.kill(); process.exit(0); };
  process.on('SIGINT',  cleanup);
  process.on('SIGTERM', cleanup);
}

main();
