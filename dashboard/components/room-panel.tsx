"use client"

import { MapPin, Radio, DoorOpen, BedDouble } from "lucide-react"
import { ROOM_SIZE, type Location } from "@/lib/telemetry"

// Fixed sensor nodes installed around the client's room (meters).
const SENSORS = [
  { id: "S1", label: "Bedside", x: 1.5, y: 1.6 },
  { id: "S2", label: "Window", x: 8.4, y: 1.6 },
  { id: "S3", label: "Doorway", x: 1.5, y: 8.4 },
  { id: "S4", label: "Bathroom", x: 8.4, y: 8.4 },
] as const

const SENSOR_RANGE = 3.2 // meters; nearest node "owns" the fix

function toPct(v: number) {
  return (v / ROOM_SIZE) * 100
}

export function RoomPanel({ pos }: { pos: Location }) {
  // Determine which sensor currently has the strongest fix on the subject.
  let nearest = SENSORS[0]
  let nearestDist = Infinity
  for (const s of SENSORS) {
    const d = Math.hypot(s.x - pos.x, s.y - pos.y)
    if (d < nearestDist) {
      nearestDist = d
      nearest = s
    }
  }

  return (
    <section className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <MapPin className="size-4 text-primary" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold leading-tight text-foreground">Room Position</h2>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              LOCATION.POS · SENSOR MESH
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-success">
          <Radio className="size-3.5" aria-hidden="true" />
          {SENSORS.length} nodes
        </span>
      </header>

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-[1fr_auto]">
        {/* Floor plan */}
        <div className="relative mx-auto aspect-square w-full max-w-[440px] p-4">
          <div className="room-floor relative h-full w-full overflow-hidden rounded-md border border-border bg-secondary">
            {/* grid overlay */}
            <div className="room-grid pointer-events-none absolute inset-0" aria-hidden="true" />

            {/* room fixtures */}
            <Fixture icon={BedDouble} x={1.5} y={1.6} label="Bed" />
            <Fixture icon={DoorOpen} x={1.5} y={8.4} label="Door" />

            {/* sensor nodes + coverage rings */}
            {SENSORS.map((s) => {
              const active = s.id === nearest.id
              return (
                <div key={s.id}>
                  {/* coverage radius */}
                  <span
                    className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                      active ? "border-success/50 bg-success/5" : "border-muted-foreground/15"
                    }`}
                    style={{
                      left: `${toPct(s.x)}%`,
                      top: `${toPct(s.y)}%`,
                      width: `${(SENSOR_RANGE / ROOM_SIZE) * 200}%`,
                      height: `${(SENSOR_RANGE / ROOM_SIZE) * 200}%`,
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${toPct(s.x)}%`, top: `${toPct(s.y)}%` }}
                  >
                    {active && (
                      <span className="absolute left-1/2 top-1/2 -z-0 size-10 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-success/25" />
                    )}
                    <span
                      className={`relative flex size-5 items-center justify-center rounded-full border ${
                        active
                          ? "border-success bg-success/20 text-success"
                          : "border-muted-foreground/40 bg-card text-muted-foreground"
                      }`}
                      title={`${s.id} · ${s.label}`}
                    >
                      <Radio className="size-3" aria-hidden="true" />
                    </span>
                    <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-widest text-muted-foreground">
                      {s.id}
                    </span>
                  </div>
                </div>
              )
            })}

            {/* subject marker */}
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
              style={{ left: `${toPct(pos.x)}%`, top: `${toPct(pos.y)}%` }}
            >
              <span className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15" />
              <span className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-primary/40" />
              <span className="relative flex size-4 -translate-x-0 items-center justify-center rounded-full border-2 border-primary bg-primary/30 shadow-[0_0_12px_var(--color-primary)]">
                <span className="size-1.5 rounded-full bg-primary" />
              </span>
            </div>
          </div>
        </div>

        {/* Readout column */}
        <div className="flex flex-row justify-between gap-4 border-t border-border px-4 py-3 sm:w-44 sm:flex-col sm:justify-start sm:border-l sm:border-t-0">
          <Coord label="POS.X" value={`${pos.x.toFixed(2)} m`} />
          <Coord label="POS.Y" value={`${pos.y.toFixed(2)} m`} />
          <Coord label="NEAREST" value={`${nearest.id} · ${nearest.label}`} />
          <Coord
            label="FIX.RANGE"
            value={`${nearestDist.toFixed(2)} m`}
            tone={nearestDist <= SENSOR_RANGE ? "ok" : "warn"}
          />
        </div>
      </div>
    </section>
  )
}

function Fixture({
  icon: Icon,
  x,
  y,
  label,
}: {
  icon: typeof BedDouble
  x: number
  y: number
  label: string
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 text-muted-foreground/50"
      style={{ left: `${toPct(x)}%`, top: `${toPct(y)}%` }}
      aria-hidden="true"
    >
      <Icon className="size-5" />
      <span className="sr-only">{label}</span>
    </div>
  )
}

function Coord({
  label,
  value,
  tone = "default",
}: {
  label: string
  value: string
  tone?: "default" | "ok" | "warn"
}) {
  const color = tone === "ok" ? "text-success" : tone === "warn" ? "text-warning" : "text-foreground"
  return (
    <div className="flex flex-col">
      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={`font-mono text-xs tabular-nums ${color}`}>{value}</span>
    </div>
  )
}
