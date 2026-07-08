"use client"

import { AlertTriangle, Info, ShieldAlert, Bell } from "lucide-react"
import type { AlertEntry, Severity } from "@/lib/telemetry"
import { cn } from "@/lib/utils"

const severityMap: Record<
  Severity,
  { icon: typeof Info; cls: string; ring: string; label: string }
> = {
  critical: { icon: ShieldAlert, cls: "text-destructive", ring: "border-destructive/40 bg-destructive/10", label: "CRIT" },
  warning: { icon: AlertTriangle, cls: "text-warning", ring: "border-warning/40 bg-warning/10", label: "WARN" },
  info: { icon: Info, cls: "text-primary", ring: "border-primary/40 bg-primary/10", label: "INFO" },
}

function timeAgo(ts: number) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return `${m}m ${s % 60}s`
}

export function AlertsLog({ alerts }: { alerts: AlertEntry[] }) {
  const activeCount = alerts.filter((a) => a.severity !== "info").length

  return (
    <section className="flex h-full flex-col rounded-lg border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Bell className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Alerts Log</h2>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 font-mono text-[10px] font-medium tracking-widest text-destructive">
          <span className="size-1.5 animate-pulse rounded-full bg-destructive" />
          {activeCount} ACTIVE
        </span>
      </header>

      <ul className="flex-1 divide-y divide-border overflow-y-auto">
        {alerts.map((a) => {
          const s = severityMap[a.severity]
          const Icon = s.icon
          return (
            <li key={a.id} className="flex gap-3 px-4 py-3 transition-colors hover:bg-secondary/40">
              <span
                className={cn(
                  "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border",
                  s.ring,
                )}
              >
                <Icon className={cn("size-3.5", s.cls)} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("font-mono text-[11px] font-semibold tracking-widest", s.cls)}>
                    {a.code}
                  </span>
                  <time className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    {timeAgo(a.ts)} ago
                  </time>
                </div>
                <p className="mt-0.5 text-[13px] leading-snug text-foreground/85 text-pretty">{a.reason}</p>
              </div>
            </li>
          )
        })}
      </ul>

      <footer className="border-t border-border px-4 py-2.5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Sentinel-Core · anomaly detection online
        </p>
      </footer>
    </section>
  )
}
