"use client"

import { useEffect, useRef, useState } from "react"

// Mirrors the structs streamed from the Sentinel-Core C backend (vitals.h):
//
//   typedef struct { float x; float y; } Location;
//
//   typedef struct {
//       const int   id;
//       const int   heart_rate;
//       const float sugar_level;
//       const Location pos;
//       const time_t timestamp;
//   } Vitals;
//
// Room-scale positioning: Location.x / Location.y are floor coordinates in
// meters within the client's monitored room (0 - ROOM_SIZE), reported by the
// in-room sensor mesh rather than outdoor GPS.

export type Severity = "critical" | "warning" | "info"

export interface AlertEntry {
  id: string
  severity: Severity
  code: string
  reason: string
  ts: number
}

export interface Sample {
  t: number
  v: number
}

// typedef struct { float x; float y; } Location;
export interface Location {
  x: number
  y: number
}

export interface Telemetry {
  connected: boolean
  id: number
  heartRate: number
  sugarLevel: number
  pos: Location
  hrSeries: Sample[]
  bgSeries: Sample[]
  alerts: AlertEntry[]
  uptime: number
}

const MAX_POINTS = 48

// Room dimensions in meters (Location.x / .y live in [0, ROOM_SIZE]).
export const ROOM_SIZE = 10

// Thresholds mirrored from vitals.h (#define directives).
export const MAX_PULSE = 100
export const MIN_PULSE = 60
export const MAX_SUGAR = 140

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

let alertSeq = 0

export function useSentinelTelemetry(): Telemetry {
  const [connected, setConnected] = useState(true)
  // heart_rate = (rand % 70) + 50  ->  seed inside 50..119
  const [heartRate, setHeartRate] = useState(82)
  // sugar_level = rand*100 + 70  ->  seed inside 70..170
  const [sugarLevel, setSugarLevel] = useState(112)
  const [uptime, setUptime] = useState(0)
  const [pos, setPos] = useState<Location>({ x: 4.2, y: 5.6 })
  const [hrSeries, setHrSeries] = useState<Sample[]>(() => seed(82, 8))
  const [bgSeries, setBgSeries] = useState<Sample[]>(() => seed(112, 12))
  const [alerts, setAlerts] = useState<AlertEntry[]>(() => [
    {
      id: "sys-boot",
      severity: "info",
      code: "SYS.BOOT",
      reason: "Sentinel-Core v1.0 [Embedded Mode] — sensor mesh online.",
      ts: Date.now() - 4000,
    },
  ])

  // refs to avoid stale closures inside the interval
  const hrRef = useRef(heartRate)
  const bgRef = useRef(sugarLevel)
  const hrBreachRef = useRef(false)
  const bgBreachRef = useRef(false)
  hrRef.current = heartRate
  bgRef.current = sugarLevel

  useEffect(() => {
    const pushAlert = (a: Omit<AlertEntry, "id" | "ts">) => {
      setAlerts((prev) => [{ ...a, id: `al-${++alertSeq}`, ts: Date.now() }, ...prev].slice(0, 40))
    }

    let frame = 0
    const tick = setInterval(() => {
      const now = Date.now()
      frame++

      // --- Heart rate random walk with occasional stress spikes ---
      const spike = Math.random() < 0.07 ? (Math.random() < 0.5 ? 20 : -12) : 0
      const nextHr = Math.round(clamp(hrRef.current + (Math.random() - 0.5) * 6 + spike, 48, 132))
      setHeartRate(nextHr)
      setHrSeries((prev) => [...prev, { t: now, v: nextHr }].slice(-MAX_POINTS))

      // analyze_vitals: if (v.heart_rate > MAX_PULSE) alert("TACHYCARDIA_EVENT")
      const hrBreach = nextHr > MAX_PULSE || nextHr < MIN_PULSE
      if (hrBreach && !hrBreachRef.current) {
        pushAlert({
          severity: nextHr > 120 || nextHr < 50 ? "critical" : "warning",
          code: nextHr > MAX_PULSE ? "TACHYCARDIA_EVENT" : "BRADYCARDIA_EVENT",
          reason:
            nextHr > MAX_PULSE
              ? `Heart rate ${nextHr} bpm exceeds MAX_PULSE (${MAX_PULSE}).`
              : `Heart rate ${nextHr} bpm below MIN_PULSE (${MIN_PULSE}).`,
        })
      }
      hrBreachRef.current = hrBreach

      // --- Glucose slower drift ---
      const drift = Math.random() < 0.08 ? (Math.random() < 0.5 ? 24 : -18) : 0
      const nextBg = Math.round(clamp(bgRef.current + (Math.random() - 0.5) * 5 + drift, 62, 210))
      setSugarLevel(nextBg)
      setBgSeries((prev) => [...prev, { t: now, v: nextBg }].slice(-MAX_POINTS))

      // analyze_vitals: if (v.sugar_level > MAX_SUGAR) alert("HYPERGLYCEMIA_WARNING")
      const bgBreach = nextBg > MAX_SUGAR
      if (bgBreach && !bgBreachRef.current) {
        pushAlert({
          severity: nextBg > 180 ? "critical" : "warning",
          code: "HYPERGLYCEMIA_WARNING",
          reason: `Blood sugar ${nextBg} mg/dL exceeds MAX_SUGAR (${MAX_SUGAR}).`,
        })
      }
      bgBreachRef.current = bgBreach

      // --- In-room movement: subject drifts across the floor ---
      setPos((prev) => ({
        x: clamp(prev.x + (Math.random() - 0.5) * 0.5, 0.4, ROOM_SIZE - 0.4),
        y: clamp(prev.y + (Math.random() - 0.5) * 0.5, 0.4, ROOM_SIZE - 0.4),
      }))

      // --- Occasional link flicker ---
      if (Math.random() < 0.015) {
        setConnected(false)
        pushAlert({
          severity: "warning",
          code: "LINK.DROP",
          reason: "Sensor mesh degradation — buffering last known vitals.",
        })
        setTimeout(() => setConnected(true), 1600)
      }

      setUptime((u) => u + 1)
    }, 1000)

    return () => clearInterval(tick)
  }, [])

  return { connected, id: 1, heartRate, sugarLevel, pos, hrSeries, bgSeries, alerts, uptime }
}

// Deterministic seed (sine-based) so server and client render identically,
// avoiding hydration mismatches. Live jitter kicks in after mount.
function seed(center: number, spread: number): Sample[] {
  const base = 1_720_000_000_000
  return Array.from({ length: MAX_POINTS }, (_, i) => ({
    t: base + i * 1000,
    v: Math.round(center + Math.sin(i * 0.7) * spread),
  }))
}
