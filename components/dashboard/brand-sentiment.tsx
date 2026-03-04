"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowDownRight, LineChart as LineChartIcon, Grid3X3 } from "lucide-react"

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

const timeSlots = ["6am", "9am", "12pm", "3pm", "6pm", "9pm", "12am"]
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// Heatmap data: sentiment scores (0-100) for each day/time combination
const heatmapData: Record<string, number[]> = {
  Mon: [65, 78, 85, 72, 80, 88, 92],
  Tue: [70, 82, 75, 88, 68, 85, 62],
  Wed: [58, 72, 80, 78, 82, 90, 85],
  Thu: [75, 85, 78, 92, 88, 80, 95],
  Fri: [82, 78, 85, 65, 88, 82, 72],
  Sat: [68, 75, 80, 85, 62, 90, 78],
  Sun: [72, 68, 82, 78, 85, 75, 70],
}

// Get color based on score using primary purple color variations (hue 300)
function getHeatmapColor(score: number): string {
  // Using oklch with primary hue (300) adjusting lightness and chroma for intensity
  // Lower scores = lighter/less saturated, higher scores = darker/more saturated
  if (score >= 90) return "oklch(0.52 0.22 300)" // Darkest purple (primary)
  if (score >= 80) return "oklch(0.58 0.18 300)"
  if (score >= 70) return "oklch(0.65 0.15 300)"
  if (score >= 60) return "oklch(0.72 0.12 300)"
  return "oklch(0.80 0.08 300)" // Lightest purple
}

const heatmapLegendColors = [
  "oklch(0.80 0.08 300)",
  "oklch(0.72 0.12 300)",
  "oklch(0.65 0.15 300)",
  "oklch(0.58 0.18 300)",
  "oklch(0.52 0.22 300)",
]

function CustomChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{payload[0]?.value}/100</p>
    </div>
  )
}

export function BrandSentiment() {
  const [viewMode, setViewMode] = useState<"chart" | "heatmap">("chart")
  
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">Score Summary</CardTitle>
          <CardDescription className="text-xs">Overview of your brand's sentiment performance across AI models</CardDescription>
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">Sentiment Over Time</CardTitle>
              <CardDescription className="text-xs">
                Track how AI models perceive your brand sentiment over time
              </CardDescription>
            </div>
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(v) => v && setViewMode(v as "chart" | "heatmap")}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <ToggleGroupItem value="chart" aria-label="Chart view" className="size-8 px-0">
                <LineChartIcon className="size-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="heatmap" aria-label="Heatmap view" className="size-8 px-0">
                <Grid3X3 className="size-3.5" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "chart" ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sentimentData}>
                  <defs>
                    <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <RechartsTooltip content={<CustomChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    fill="url(#sentimentGradient)"
                    dot={{ r: 4, fill: "var(--chart-1)", strokeWidth: 2, stroke: "var(--chart-dot-stroke)" }}
                    activeDot={{ r: 6, fill: "var(--chart-1)", strokeWidth: 2, stroke: "var(--chart-dot-stroke)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col">
              {/* Time slots header */}
              <div className="flex items-center mb-2">
                <div className="w-10" />
                <div className="flex flex-1 justify-between px-1">
                  {timeSlots.map((time) => (
                    <span key={time} className="text-[10px] text-muted-foreground w-10 text-center">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Heatmap grid */}
              <div className="flex flex-col gap-1 flex-1">
                <TooltipProvider>
                  {days.map((day) => (
                    <div key={day} className="flex items-center gap-2 flex-1">
                      <span className="w-8 text-xs text-muted-foreground">{day}</span>
                      <div className="flex flex-1 gap-1 h-full">
                        {heatmapData[day].map((score, idx) => (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <div
                                className="flex-1 rounded-md cursor-pointer transition-transform hover:scale-105"
                                style={{ backgroundColor: getHeatmapColor(score) }}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover text-popover-foreground border-border">
                              <p className="text-xs font-medium">{day} at {timeSlots[idx]}</p>
                              <p className="text-xs text-muted-foreground">Score: {score}/100</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  ))}
                </TooltipProvider>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-2 pt-2 mt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Lower</span>
                <div className="flex gap-0.5">
                  {heatmapLegendColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-4 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">Higher</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
