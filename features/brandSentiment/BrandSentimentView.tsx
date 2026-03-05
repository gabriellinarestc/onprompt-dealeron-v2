"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts"
import { ArrowDownRight, AlertCircle } from "lucide-react"
import { HelpTooltip } from "@/components/patterns/help-tooltip"
import type { BrandSentimentProps } from "./types"

const TEMP_RED    = "oklch(0.58 0.18 25)"
const TEMP_AMBER  = "oklch(0.72 0.14 75)"
const TEMP_YELLOW = "oklch(0.68 0.15 120)"
const TEMP_GREEN  = "oklch(0.6 0.17 145)"
const TEMP_DEEP   = "oklch(0.52 0.19 155)"

function getTemperatureColor(score: number): string {
  if (score >= 80) return TEMP_DEEP
  if (score >= 65) return TEMP_GREEN
  if (score >= 50) return TEMP_YELLOW
  if (score >= 35) return TEMP_AMBER
  return TEMP_RED
}

function CustomChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey?: string | ((entry: Record<string, unknown>) => unknown) }>; label?: string }) {
  if (!active || !payload?.length) return null
  const scoreEntry = payload.find((p) => p.dataKey === "score")
  const score = scoreEntry?.value ?? payload[payload.length - 1]?.value ?? 0
  const color = getTemperatureColor(score)
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
        <p className="text-sm font-bold text-foreground">{score}/100</p>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-3 w-48 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            <div className="h-10 w-16 animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-3 w-48 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card lg:col-span-2">
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground">No sentiment data available</p>
            <p className="text-xs text-muted-foreground">Sentiment tracking will begin once prompts are being monitored.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card border-destructive/40 lg:col-span-2">
        <CardContent className="py-10">
          <div className="flex items-center justify-center gap-3">
            <AlertCircle className="size-5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-foreground">Failed to load sentiment data</p>
              <p className="text-xs text-muted-foreground">Something went wrong. Please try again.</p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function BrandSentimentView({ state, data, currentScore, comparePrior, onRetry }: BrandSentimentProps) {
  if (state === "loading") return <LoadingSkeleton />
  if (state === "empty") return <EmptyState />
  if (state === "error") return <ErrorState onRetry={onRetry} />

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-sm font-semibold text-foreground">Score Summary</CardTitle>
            <HelpTooltip title="Sentiment Score">
              Calculated by averaging how positively AI models describe your brand across all tracked prompts. Scores range from 0 (negative) to 100 (very positive), weighted by prompt frequency and model reach.
            </HelpTooltip>
          </div>
          <CardDescription className="text-xs">Overview of your brand{"'"}s sentiment performance across AI models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Current Sentiment Score
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">{currentScore}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            {comparePrior ? (
              <div className="mt-1 flex items-center gap-1 text-xs text-success">
                <ArrowDownRight className="size-3 rotate-[-90deg]" />
                <span>+8.9%</span>
              </div>
            ) : (
              <div className="invisible mt-1 flex items-center gap-1 text-xs">
                <ArrowDownRight className="size-3" />
                <span>&mdash;</span>
              </div>
            )}
          </div>

          <div>
            <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              Score Position
            </p>
            <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-destructive via-warning to-success">
              <div
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${currentScore}%` }}
              >
                <div className="size-3.5 rounded-full border-2 border-background" style={{ backgroundColor: getTemperatureColor(currentScore) }} />
              </div>
            </div>
            <p className="mt-1.5 text-right text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{currentScore}</span>/100
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-sm font-semibold text-foreground">Sentiment Over Time</CardTitle>
            <HelpTooltip title="How to read this chart">
              Each point shows the weekly average sentiment score. The line color shifts from red (negative) through amber to green (positive) to reflect the score at that point. An upward trend means AI models are describing your brand more favorably.
            </HelpTooltip>
          </div>
          <CardDescription className="text-xs">
            Track how AI models perceive your brand sentiment over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
                <defs>
                  <linearGradient id="sentimentStrokeGradient" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="200">
                    <stop offset="0%"   stopColor={TEMP_DEEP} />
                    <stop offset="20%"  stopColor={TEMP_GREEN} />
                    <stop offset="50%"  stopColor={TEMP_YELLOW} />
                    <stop offset="75%"  stopColor={TEMP_AMBER} />
                    <stop offset="100%" stopColor={TEMP_RED} />
                  </linearGradient>
                  <linearGradient id="sentimentFillGradient" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="200">
                    <stop offset="0%"   stopColor={TEMP_DEEP}  stopOpacity={0.22} />
                    <stop offset="20%"  stopColor={TEMP_GREEN}  stopOpacity={0.14} />
                    <stop offset="50%"  stopColor={TEMP_YELLOW} stopOpacity={0.08} />
                    <stop offset="75%"  stopColor={TEMP_AMBER}  stopOpacity={0.05} />
                    <stop offset="100%" stopColor={TEMP_RED}    stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="sentimentBgGradient" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="200">
                    <stop offset="0%"   stopColor={TEMP_DEEP}  stopOpacity={0.05} />
                    <stop offset="35%"  stopColor={TEMP_GREEN}  stopOpacity={0.03} />
                    <stop offset="65%"  stopColor={TEMP_AMBER}  stopOpacity={0.03} />
                    <stop offset="100%" stopColor={TEMP_RED}    stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <Area
                  type="monotone"
                  dataKey={() => 100}
                  stroke="none"
                  fill="url(#sentimentBgGradient)"
                  isAnimationActive={false}
                />

                <ReferenceLine y={80} stroke={TEMP_DEEP} strokeOpacity={0.15} strokeDasharray="3 3" />
                <ReferenceLine y={50} stroke={TEMP_YELLOW} strokeOpacity={0.15} strokeDasharray="3 3" />

                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} opacity={0.5} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--chart-tick)", fontSize: 10 }}
                  axisLine={{ stroke: "var(--chart-grid)" }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "var(--chart-tick)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <RechartsTooltip
                  content={<CustomChartTooltip />}
                  cursor={{ stroke: "var(--chart-grid)", strokeDasharray: "3 3" }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="url(#sentimentStrokeGradient)"
                  strokeWidth={2.5}
                  fill="url(#sentimentFillGradient)"
                  dot={({ cx, cy, payload }: { cx: number; cy: number; payload: { score: number } }) => {
                    const color = getTemperatureColor(payload.score)
                    return (
                      <circle
                        key={`dot-${cx}`}
                        cx={cx}
                        cy={cy}
                        r={3.5}
                        fill={color}
                        stroke="var(--chart-dot-stroke)"
                        strokeWidth={2}
                      />
                    )
                  }}
                  activeDot={({ cx, cy, payload }: { cx: number; cy: number; payload: { score: number } }) => {
                    const color = getTemperatureColor(payload.score)
                    return (
                      <circle
                        key={`active-${cx}`}
                        cx={cx}
                        cy={cy}
                        r={5.5}
                        fill={color}
                        stroke="var(--chart-dot-stroke)"
                        strokeWidth={2}
                      />
                    )
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
