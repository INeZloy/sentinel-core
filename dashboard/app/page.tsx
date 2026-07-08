"use client"

import { Heart, Droplet } from "lucide-react"
import { useSentinelTelemetry, MAX_PULSE, MIN_PULSE, MAX_SUGAR } from "@/lib/telemetry"
import { DashboardHeader } from "@/components/dashboard-header"
import { VitalPanel } from "@/components/vital-panel"
import { AlertsLog } from "@/components/alerts-log"
import { RoomPanel } from "@/components/room-panel"

// Status thresholds derived from the C backend #defines (vitals.h).
function hrStatus(bpm: number): "nominal" | "warning" | "critical" {
  if (bpm > 120 || bpm < 50) return "critical"
  if (bpm > MAX_PULSE || bpm < MIN_PULSE) return "warning"
  return "nominal"
}
function bgStatus(mg: number): "nominal" | "warning" | "critical" {
  if (mg > 180) return "critical"
  if (mg > MAX_SUGAR) return "warning"
  return "nominal"
}

export default function Page() {
  const t = useSentinelTelemetry()

  return (
    <div className="tactical-grid min-h-svh">
      <DashboardHeader connected={t.connected} uptime={t.uptime} />

      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 p-4 lg:grid-cols-3 lg:p-6">
        {/* Left + center: vitals and room position */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <VitalPanel
              title="Heart Rate"
              code="ECG.BPM"
              icon={Heart}
              animateIcon
              value={t.heartRate}
              unit="bpm"
              data={t.hrSeries}
              color="oklch(0.7 0.2 15)"
              min={40}
              max={140}
              band={[MIN_PULSE, MAX_PULSE]}
              status={hrStatus(t.heartRate)}
            />
            <VitalPanel
              title="Blood Sugar"
              code="CGM.MGDL"
              icon={Droplet}
              value={t.sugarLevel}
              unit="mg/dL"
              data={t.bgSeries}
              color="oklch(0.8 0.13 195)"
              min={50}
              max={210}
              band={[70, MAX_SUGAR]}
              status={bgStatus(t.sugarLevel)}
            />
          </div>

          <RoomPanel pos={t.pos} />
        </div>

        {/* Right: alerts log */}
        <div className="lg:col-span-1 lg:h-[calc(100svh-8rem)]">
          <AlertsLog alerts={t.alerts} />
        </div>
      </main>
    </div>
  )
}
