/**
 * Distributed Secure Messenger — Backend
 *
 * This process is intentionally standalone: it knows nothing about how or
 * where the client is deployed. It only exposes a WebSocket endpoint and a
 * health-check HTTP endpoint. The client (a separate deployable module,
 * see ../client) talks to it purely over the network. That separation is
 * what makes this a distributed system rather than a monolith.
 */
const http = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;

const app = express();

// Basic CORS so a client deployed on a different domain (Vercel/Netlify)
// can reach this server (deployed separately on Render/Railway/Fly.io).
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', clients: wss ? wss.clients.size : 0, uptime: process.uptime() });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

/** username -> ws connection */
const clients = new Map();

function broadcast(payload, exceptWs = null) {
  const data = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN && client !== exceptWs) {
      client.send(data);
    }
  }
}

function onlineUsernames() {
  return Array.from(clients.keys());
}

wss.on('connection', (ws) => {
  let username = null;

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return; // ignore malformed frames
    }

    if (msg.type === 'join') {
      username = String(msg.username || 'anon').slice(0, 24);
      clients.set(username, ws);
      broadcast({ type: 'system', text: `${username} joined`, users: onlineUsernames() });
      return;
    }

    if (msg.type === 'message' && username) {
      const outgoing = {
        type: 'message',
        id: crypto.randomUUID(),
        from: username,
        text: String(msg.text || '').slice(0, 2000),
        ts: Date.now(),
      };
      broadcast(outgoing); // simple broadcast chat: everyone sees everything
    }
  });

  ws.on('close', () => {
    if (username && clients.get(username) === ws) {
      clients.delete(username);
      broadcast({ type: 'system', text: `${username} left`, users: onlineUsernames() });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Messenger server listening on :${PORT} (ws path: /ws)`);
});