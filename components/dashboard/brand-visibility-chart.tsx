"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BarChart2, List, SlidersHorizontal, Check } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { MODEL_CONFIG, type ModelKey } from "@/lib/models"
import {
  ChatGPTLogo,
  CopilotLogo,
  GeminiLogo,
  PerplexityLogo,
} from "./model-logos"

const MODEL_LOGOS: Record<string, React.ComponentType<{ size?: number }>> = {
  chatgpt: ChatGPTLogo,
  copilot: CopilotLogo,
  gemini: GeminiLogo,
  perplexity: PerplexityLogo,
}

const CHART_MODELS: ModelKey[] = ["chatgpt", "copilot", "gemini", "perplexity"]

const chartData = [
  { name: "Facebook",    website: "facebook.com",    chatgpt: 3,  copilot: 0, gemini: 1,  perplexity: 0 },
  { name: "Dealer L.",   website: "dealerlogix.com", chatgpt: 7,  copilot: 0, gemini: 2,  perplexity: 1 },
  { name: "Google",      website: "google.com",      chatgpt: 4,  copilot: 1, gemini: 3,  perplexity: 0 },
  { name: "DealerOn.c",  website: "dealeron.com",    chatgpt: 3,  copilot: 0, gemini: 1,  perplexity: 0 },
  { name: "Dealer",      website: "dealer.com",      chatgpt: 5,  copilot: 0, gemini: 2,  perplexity: 0 },
  { name: "PennCars",    website: "penncars.com",    chatgpt: 8,  copilot: 0, gemini: 5,  perplexity: 1 },
  { name: "DealerOn",    website: "dealeron.com",    chatgpt: 12, copilot: 1, gemini: 10, perplexity: 3 },
]

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-xl">
      <p className="mb-2 text-xs font-semibold text-foreground">{label}</p>
      {payload.map((entry) => {
        const config = MODEL_CONFIG[entry.name as ModelKey]
        const Logo = MODEL_LOGOS[entry.name]
        return (
          <div key={entry.name} className="flex items-center gap-2 py-0.5 text-xs">
            <span className="flex size-4 items-center justify-center" style={{ color: entry.color }}>
              {Logo && <Logo size={12} />}
            </span>
            <span className="text-muted-foreground">{config?.name ?? entry.name}</span>
            <span className="ml-auto font-semibold tabular-nums text-foreground">{entry.value}</span>
          </div>
        )
      })}
    </div>
  )
}

export function BrandVisibilityChart() {
  const [view, setView] = useState<"chart" | "list">("chart")
  const [activeModels, setActiveModels] = useState<Set<ModelKey>>(
    new Set(CHART_MODELS)
  )

  function toggleModel(key: ModelKey) {
    setActiveModels((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        // keep at least one active
        if (next.size > 1) next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  // List view: compute totals per competitor across active models
  const listData = chartData
    .map((row) => ({
      name: row.name,
      website: row.website,
      total: CHART_MODELS.filter((m) => activeModels.has(m)).reduce(
        (sum, m) => sum + (row[m as keyof typeof row] as number),
        0
      ),
      breakdown: CHART_MODELS.filter((m) => activeModels.has(m)).map((m) => ({
        key: m,
        value: row[m as keyof typeof row] as number,
      })),
    }))
    .sort((a, b) => b.total - a.total)

  const maxTotal = Math.max(...listData.map((d) => d.total), 1)

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              Mentions by Model
            </CardTitle>
            <CardDescription className="text-xs">
              How often your brand is mentioned across AI models vs. competitors
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Total count */}
            <div className="flex items-baseline gap-1 mr-1">
              <span className="text-2xl font-bold text-foreground">65</span>
              <span className="text-xs text-muted-foreground">mentions</span>
            </div>

            {/* Model filter popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 px-2.5 text-xs font-medium"
                >
                  <SlidersHorizontal className="size-3.5" />
                  Models
                  {activeModels.size < CHART_MODELS.length && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {activeModels.size}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-52 p-2">
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Filter models
                </p>
                <div className="flex flex-col gap-0.5">
                  {CHART_MODELS.map((key) => {
                    const config = MODEL_CONFIG[key]
                    const Logo = MODEL_LOGOS[key]
                    const checked = activeModels.has(key)
                    return (
                      <button
                        key={key}
                        onClick={() => toggleModel(key)}
                        className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                      >
                        {/* Model icon */}
                        <span
                          className="flex size-6 shrink-0 items-center justify-center rounded-md"
                          style={{
                            backgroundColor: `${config.hex}18`,
                            color: config.hex,
                          }}
                        >
                          <Logo size={13} />
                        </span>
                        <span className="flex-1 text-left text-xs font-medium text-foreground">
                          {config.name}
                        </span>
                        {/* Custom colored checkbox */}
                        <span
                          className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors"
                          style={
                            checked
                              ? {
                                  backgroundColor: config.hex,
                                  borderColor: config.hex,
                                  color: "#fff",
                                }
                              : { borderColor: "var(--border)" }
                          }
                        >
                          {checked && <Check className="size-2.5 stroke-[3]" />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>

            {/* Chart / List toggle */}
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(v) => v && setView(v as "chart" | "list")}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <ToggleGroupItem value="chart" aria-label="Chart view" className="size-8 px-0">
                <BarChart2 className="size-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view" className="size-8 px-0">
                <List className="size-3.5" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {view === "chart" ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="22%" barGap={2}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--chart-grid)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--chart-grid)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "var(--chart-cursor)" }}
                />
                {CHART_MODELS.filter((m) => activeModels.has(m)).map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={MODEL_CONFIG[key].hex}
                    radius={[3, 3, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {/* Header */}
            <div className="flex items-center gap-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="w-5 text-center">#</span>
              <span className="flex-1">Competitor</span>
              {CHART_MODELS.filter((m) => activeModels.has(m)).map((key) => {
                const Logo = MODEL_LOGOS[key]
                return (
                  <span
                    key={key}
                    className="w-8 text-center"
                    title={MODEL_CONFIG[key].name}
                    style={{ color: MODEL_CONFIG[key].hex }}
                  >
                    <Logo size={13} />
                  </span>
                )
              })}
              <span className="w-16 text-right">Total</span>
            </div>

            {listData.map((row, i) => (
              <div key={row.name} className="flex items-center gap-3 py-2.5">
                <span className="w-5 text-center text-xs font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <div className="flex flex-col gap-0">
                    <span className="truncate text-sm font-medium text-foreground">
                      {row.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{row.website}</span>
                  </div>
                  {/* Proportional stacked bar */}
                  <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    {row.breakdown.map(({ key, value }) =>
                      value > 0 ? (
                        <div
                          key={key}
                          className="h-full transition-all"
                          style={{
                            width: `${(value / maxTotal) * 100}%`,
                            backgroundColor: MODEL_CONFIG[key].hex,
                          }}
                        />
                      ) : null
                    )}
                  </div>
                </div>
                {/* Per-model counts */}
                {CHART_MODELS.filter((m) => activeModels.has(m)).map((key) => {
                  const val = row.breakdown.find((b) => b.key === key)?.value ?? 0
                  return (
                    <span
                      key={key}
                      className="w-8 text-center text-xs tabular-nums"
                      style={{ color: val > 0 ? MODEL_CONFIG[key].hex : undefined }}
                    >
                      {val > 0 ? (
                        <span className="font-semibold">{val}</span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </span>
                  )
                })}
                <span className="w-16 text-right text-sm font-bold text-foreground tabular-nums">
                  {row.total}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

