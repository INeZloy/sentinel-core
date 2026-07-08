"use client"

import { useId } from "react"
import type { Sample } from "@/lib/telemetry"

interface VitalChartProps {
  data: Sample[]
  color: string
  min: number
  max: number
  /** safe band [low, high] rendered as a shaded zone */
  band?: [number, number]
  height?: number
}

export function VitalChart({ data, color, min, max, band, height = 150 }: VitalChartProps) {
  const uid = useId().replace(/:/g, "")
  const W = 600
  const H = height
  const padY = 8

  const range = max - min || 1
  const x = (i: number) => (data.length <= 1 ? 0 : (i / (data.length - 1)) * W)
  const y = (v: number) => padY + (1 - (v - min) / range) * (H - padY * 2)

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(2)} ${y(d.v).toFixed(2)}`)
    .join(" ")

  const areaPath =
    data.length > 0
      ? `${linePath} L ${W} ${H} L 0 ${H} Z`
      : ""

  const last = data[data.length - 1]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-full w-full"
      role="img"
      aria-label="Live vital signal trace"
    >
      <defs>
        <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* horizontal grid lines */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1="0"
          x2={W}
          y1={padY + f * (H - padY * 2)}
          y2={padY + f * (H - padY * 2)}
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
      ))}

      {/* safe band */}
      {band && (
        <rect
          x="0"
          width={W}
          y={y(band[1])}
          height={Math.max(0, y(band[0]) - y(band[1]))}
          fill="var(--success)"
          opacity="0.08"
        />
      )}

      {areaPath && <path d={areaPath} fill={`url(#fill-${uid})`} />}
      {linePath && (
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}

      {last && (
        <>
          <circle cx={x(data.length - 1)} cy={y(last.v)} r="7" fill={color} opacity="0.18">
            <animate attributeName="r" values="4;10;4" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx={x(data.length - 1)} cy={y(last.v)} r="3" fill={color} />
        </>
      )}
    </svg>
  )
}
