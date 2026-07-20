# Architecture Canvas — Sentinel Core

## 1. System Context

Sentinel Core is a wearable-health-monitoring system split into two deployable
components communicating over a data channel:

```
graph LR
    Sensor[/"Bio-Sensor Hardware"/] -->|raw vitals| Core["Core Engine (C)"]
    Core -->|JSON telemetry| Dashboard["Dashboard (Next.js/TS)"]
    Dashboard -->|renders for| Doctor(("Medical Doctor"))
    Core -->|emergency signal| Alert["Emergency Dispatcher"]
    Alert --> Doctor
```

## 2. Components

| Component | Technology | Responsibility |
|---|---|---|
| **Core Engine** | C11 | Reads sensor vitals, runs threshold analysis (`Analyzer.analyze_vitals`), raises emergency events, exports telemetry as JSON |
| **Dashboard** | Next.js / TypeScript | Visualizes telemetry for healthcare providers, displays live vitals and alert history |
| **Emergency Dispatcher** | Notification context | Receives emergency events from Core and forwards them (SMS/email/webhook in production; simulated in this project) |

## 3. Data Flow

1. Bio-sensor hardware produces raw `Vitals` (heart rate, sugar level, GPS position, timestamp).
2. Core Engine's `Analyzer` checks vitals against thresholds (e.g. tachycardia `> 100`, bradycardia `< 60`).
3. On abnormal readings, `emergency_handler()` fires and the event is pushed to the Notification Context.
4. All readings (normal and abnormal) are exported as JSON.
5. The Dashboard consumes that JSON and renders it for the doctor.

## 4. Boundaries / Bounded Contexts

- **Monitoring Context** — Sensor Module + Analysis Engine (Core, C).
- **Notification Context** — Emergency Dispatcher.
- **Presentation Context** — Dashboard (Next.js).

Contexts communicate via a JSON contract (shared kernel), not shared code —
each context can be deployed and scaled independently.

## 5. Deployment View

| Component | Where it runs | Notes |
|---|---|---|
| Core Engine | Compiled binary, wrapped as a small HTTP/JSON service | see deployment target in §6 |
| Dashboard | Static/SSR Next.js app | see deployment target in §6 |
| CI/CD | GitHub Actions (`.github/workflows/main.yml`) | builds Core (gcc) + Dashboard (Node ≥ 20.9) |

## 6. Known Constraints / Trade-offs

- Core is written in C for performance and low resource use on embedded-style hardware; this trades development speed for runtime efficiency.
- The JSON contract between Core and Dashboard is currently a simulated file/interface rather than a real network API — see roadmap below for closing this gap.
- Windows dev environment lacked `make`; documented workaround in `METRICS.md` / `build.bat`.

## 7. Roadmap to Full Distribution

- [ ] Wrap Core Engine in a minimal HTTP server (expose `/vitals`, `/alerts`).
- [ ] Deploy Core service (Render / Fly.io / Railway).
- [ ] Deploy Dashboard (Vercel) pointing at the deployed Core service URL.
- [ ] Add the live URLs to the README so the system is reachable end-to-end.
