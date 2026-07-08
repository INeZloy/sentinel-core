"use client"

import { Activity, Wifi, WifiOff, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

function fmtUptime(s: number) {
  const h = String(Math.floor(s / 3600)).padStart(2, "0")
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0")
  const sec = String(s % 60).padStart(2, "0")
  return `${h}:${m}:${sec}`
}

export function DashboardHeader({
  connected,
  uptime,
}: {
  connected: boolean
  uptime: number
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border bg-card/60 px-4 py-3 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
          <Activity className="size-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h1 className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
            SENTINEL<span className="text-primary">-CORE</span>
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Vitals Command Console
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Pill icon={Cpu} label="C-CORE" value="rt-daemon" />
        <Pill label="UPTIME" value={fmtUptime(uptime)} mono />
        <span
          className={cn(
            "flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-widest",
            connected
              ? "border-success/30 bg-success/10 text-success"
              : "border-warning/30 bg-warning/10 text-warning",
          )}
        >
          {connected ? (
            <Wifi className="size-3.5" aria-hidden="true" />
          ) : (
            <WifiOff className="size-3.5 animate-pulse" aria-hidden="true" />
          )}
          {connected ? "Link Active" : "Reconnecting"}
        </span>
      </div>
    </header>
  )
}

function Pill({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon?: typeof Cpu
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <span className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2">
      {Icon && <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />}
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={cn("text-xs text-foreground", mono && "font-mono tabular-nums")}>{value}</span>
    </span>
  )
}
