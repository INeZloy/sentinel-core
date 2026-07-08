"use client"

import type { LucideIcon } from "lucide-react"
import type { Sample } from "@/lib/telemetry"
import { VitalChart } from "@/components/vital-chart"
import { cn } from "@/lib/utils"

interface VitalPanelProps {
  title: string
  code: string
  icon: LucideIcon
  value: number
  unit: string
  data: Sample[]
  color: string
  min: number
  max: number
  band: [number, number]
  status: "nominal" | "warning" | "critical"
  animateIcon?: boolean
}

const statusStyles: Record<VitalPanelProps["status"], { label: string; cls: string; dot: string }> = {
  nominal: { label: "NOMINAL", cls: "text-success border-success/30 bg-success/10", dot: "bg-success" },
  warning: { label: "ELEVATED", cls: "text-warning border-warning/30 bg-warning/10", dot: "bg-warning" },
  critical: { label: "CRITICAL", cls: "text-destructive border-destructive/40 bg-destructive/10", dot: "bg-destructive" },
}

export function VitalPanel({
  title,
  code,
  icon: Icon,
  value,
  unit,
  data,
  color,
  min,
  max,
  band,
  status,
  animateIcon,
}: VitalPanelProps) {
  const s = statusStyles[status]
  return (
    <section className="flex flex-col rounded-lg border border-border bg-card">
      <header className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md border border-border bg-secondary">
            <Icon
              className={cn("size-4 text-primary", animateIcon && "animate-pulse")}
              aria-hidden="true"
            />
          </span>
          <div>
            <h2 className="text-sm font-semibold leading-tight text-foreground">{title}</h2>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{code}</p>
          </div>
        </div>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium tracking-widest",
            s.cls,
          )}
        >
          <span className={cn("size-1.5 rounded-full", s.dot)} />
          {s.label}
        </span>
      </header>

      <div className="flex items-end gap-2 px-4 pt-4">
        <span className="font-mono text-4xl font-semibold tabular-nums text-foreground">{value}</span>
        <span className="pb-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">{unit}</span>
      </div>

      <div className="mt-1 h-[150px] w-full px-1 pb-2">
        <VitalChart data={data} color={color} min={min} max={max} band={band} />
      </div>
    </section>
  )
}
