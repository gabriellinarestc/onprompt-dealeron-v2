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
} from "recharts"
import { ArrowDownRight } from "lucide-react"

const sentimentData = [
  { date: "02 Feb", score: 78 },
  { date: "03 Feb", score: 74 },
  { date: "04 Feb", score: 82 },
  { date: "05 Feb", score: 79 },
  { date: "06 Feb", score: 85 },
  { date: "07 Feb", score: 80 },
  { date: "08 Feb", score: 82 },
]

const promptTypeData = [
  { name: "Organic", score: 82, color: "bg-chart-1" },
  { name: "Competitor Comparison", score: 83, color: "bg-chart-2" },
  { name: "Brand Specific", score: null, color: "bg-muted" },
]

// Temperature colors
const TEMP_RED    = "oklch(0.58 0.18 25)"
const TEMP_AMBER  = "oklch(0.72 0.14 75)"
const TEMP_YELLOW = "oklch(0.68 0.15 120)"
const TEMP_GREEN  = "oklch(0.6 0.17 145)"
const TEMP_DEEP   = "oklch(0.52 0.19 155)"

function getTemperatureColor(score: number): string {
  if (score >= 85) return TEMP_DEEP
  if (score >= 75) return TEMP_GREEN
  if (score >= 60) return TEMP_YELLOW
  if (score >= 40) return TEMP_AMBER
  return TEMP_RED
}

function CustomChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload) return null
  const score = payload[0]?.value ?? 0
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

export function BrandSentiment() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">Score Summary</CardTitle>
          <CardDescription className="text-xs">Overview of your brand{"'"}s sentiment performance across AI models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Current Sentiment Score
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">82</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
              <ArrowDownRight className="size-3" />
              <span>-5.8%</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              Score Position
            </p>
            <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-destructive via-warning to-success">
              <div
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: "82%" }}
              >
                <div className="size-3.5 rounded-full border-2 border-foreground bg-background" />
              </div>
            </div>
            <p className="mt-1.5 text-right text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">82.25</span>/100
            </p>
          </div>

          <div>
            <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground">
              By Prompt Type
            </p>
            <div className="flex flex-col gap-3">
              {promptTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-xs text-muted-foreground">{item.name}</span>
                  <div className="relative h-2 flex-1 rounded-full bg-muted">
                    {item.score !== null && (
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-success"
                        style={{ width: `${item.score}%` }}
                      />
                    )}
                  </div>
                  <span className="w-12 text-right text-xs font-medium text-foreground">
                    {item.score !== null ? `${item.score}/100` : "-/100"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">Sentiment Over Time</CardTitle>
          <CardDescription className="text-xs">
            Track how AI models perceive your brand sentiment over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentData}>
                <defs>
                  {/* Vertical gradient for the line stroke: green at top (high scores) -> red at bottom (low scores) */}
                  <linearGradient id="sentimentStrokeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={TEMP_DEEP} />
                    <stop offset="20%"  stopColor={TEMP_GREEN} />
                    <stop offset="50%"  stopColor={TEMP_YELLOW} />
                    <stop offset="80%"  stopColor={TEMP_AMBER} />
                    <stop offset="100%" stopColor={TEMP_RED} />
                  </linearGradient>
                  {/* Subtle fill under the line using the same temperature range */}
                  <linearGradient id="sentimentFillGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={TEMP_DEEP}  stopOpacity={0.18} />
                    <stop offset="30%"  stopColor={TEMP_GREEN}  stopOpacity={0.12} />
                    <stop offset="60%"  stopColor={TEMP_YELLOW} stopOpacity={0.08} />
                    <stop offset="100%" stopColor={TEMP_RED}    stopOpacity={0.03} />
                  </linearGradient>
                  {/* Very subtle full-background temperature wash */}
                  <linearGradient id="sentimentBgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={TEMP_DEEP}  stopOpacity={0.06} />
                    <stop offset="40%"  stopColor={TEMP_GREEN}  stopOpacity={0.04} />
                    <stop offset="70%"  stopColor={TEMP_AMBER}  stopOpacity={0.03} />
                    <stop offset="100%" stopColor={TEMP_RED}    stopOpacity={0.06} />
                  </linearGradient>
                </defs>

                {/* Background temperature wash — a full-height area behind the data */}
                <Area
                  type="monotone"
                  dataKey={() => 100}
                  stroke="none"
                  fill="url(#sentimentBgGradient)"
                  isAnimationActive={false}
                />

                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--chart-grid)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
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
                        r={4}
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
                        r={6}
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
