# AGENTIC_PROJECT — Distributed Secure Messenger

A minimal pet project built to satisfy requirement 15 (deployed, distributed
application), kept fully separate from `Sentinel-Core` (which stays as the
low-level embedded/C project for the earlier requirements).

## Why this counts as "distributed"

- `server/` and `client/` are two independently deployable modules with no
  shared code or filesystem.
- They communicate exclusively over the network via WebSocket (`wss://`).
- Each can be deployed to a **different provider**, proving there's no
  hidden coupling (e.g. server on Render, client on Vercel/Netlify).
- The server holds no client-side assumptions (CORS-open, stateless per
  connection) — any client speaking the tiny JSON protocol below can join.

## Protocol (kept intentionally tiny)

```
Client -> Server:  {"type":"join", "username":"alice"}
Client -> Server:  {"type":"message", "text":"hello"}
Server -> Clients: {"type":"system", "text":"alice joined", "users":[...]}
Server -> Clients: {"type":"message", "id":"...", "from":"alice", "text":"hello", "ts":169...}
```

## Local run

```bash
cd AGENTIC_PROJECT/server
npm install
npm start
# server on http://localhost:8080, ws endpoint ws://localhost:8080/ws

# in another terminal, just open client/index.html in a browser,
# or serve it: npx serve AGENTIC_PROJECT/client
# then set server URL field to: ws://localhost:8080/ws
```

## Deploy (≈10 minutes, two separate free hosts)

**Backend → Render.com**
1. Push `AGENTIC_PROJECT/server` to GitHub (already in this repo).
2. Render → New → Web Service → connect repo → Root Directory: `AGENTIC_PROJECT/server`.
3. Build command: `npm install`, Start command: `npm start`.
4. Deploy → copy the URL, e.g. `https://sentinel-messenger.onrender.com`.
5. Your WebSocket URL is `wss://sentinel-messenger.onrender.com/ws`.

**Frontend → Netlify (or Vercel)**
1. Netlify → Add new site → deploy `AGENTIC_PROJECT/client` folder (no build step needed, it's static).
2. Once live, open the site URL, e.g. `https://sentinel-messenger.netlify.app`.
3. Paste the `wss://...` backend URL into the "server URL" field in the UI (or append `?server=wss://your-backend/ws` to the site URL for a one-click join link).

Now you have two independently running, independently deployed processes
talking over the public internet — screenshot both live URLs plus a chat
exchange between two browser tabs (one as "alice", one as "bob") as
evidence for the report.

## Security note (for the "Secure" in the project name)

This MVP does **not** implement authentication/encryption beyond
transport-level `wss://` (TLS). If you want to justify "Secure" more
strongly for the report, the cheapest real addition is a shared join
token (`?token=...` checked server-side against an env var) — ask if you
want that added.