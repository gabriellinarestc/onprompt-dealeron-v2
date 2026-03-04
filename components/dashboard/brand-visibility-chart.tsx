"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BarChart2, List, SlidersHorizontal, Check, Filter, Crown } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"
import { MODEL_CONFIG, type ModelKey } from "@/lib/models"
import {
  ChatGPTLogo,
  ClaudeLogo,
  CopilotLogo,
  GeminiLogo,
  PerplexityLogo,
} from "./model-logos"

const MODEL_LOGOS: Record<string, React.ComponentType<{ size?: number }>> = {
  chatgpt: ChatGPTLogo,
  claude: ClaudeLogo,
  copilot: CopilotLogo,
  gemini: GeminiLogo,
  perplexity: PerplexityLogo,
}

const CHART_MODELS: ModelKey[] = ["chatgpt", "claude", "copilot", "gemini", "perplexity"]

// --- Brand data with type, visibility score, and realistic names ---

type BrandType = "main" | "competitor" | "partner"

interface BrandEntry {
  name: string
  website: string
  type: BrandType
  visibility: number // 0-100 visibility score
  chatgpt: number
  claude: number
  copilot: number
  gemini: number
  perplexity: number
}

const chartData: BrandEntry[] = [
  { name: "DealerOn",       website: "dealeron.com",        type: "main",       visibility: 72, chatgpt: 12, claude: 8,  copilot: 1, gemini: 10, perplexity: 3 },
  { name: "Dealer Inspire", website: "dealerinspire.com",   type: "competitor", visibility: 68, chatgpt: 8,  claude: 5,  copilot: 0, gemini: 5,  perplexity: 1 },
  { name: "CDK Global",     website: "cdkglobal.com",       type: "competitor", visibility: 54, chatgpt: 7,  claude: 3,  copilot: 0, gemini: 2,  perplexity: 1 },
  { name: "Sincro",         website: "sincrodigital.com",   type: "partner",    visibility: 41, chatgpt: 5,  claude: 2,  copilot: 0, gemini: 2,  perplexity: 0 },
  { name: "Cars.com",       website: "cars.com",            type: "competitor", visibility: 63, chatgpt: 4,  claude: 4,  copilot: 1, gemini: 3,  perplexity: 0 },
  { name: "Shift Digital",  website: "shiftdigital.com",    type: "partner",    visibility: 35, chatgpt: 3,  claude: 1,  copilot: 0, gemini: 1,  perplexity: 0 },
  { name: "AutoTrader",     website: "autotrader.com",      type: "competitor", visibility: 58, chatgpt: 3,  claude: 2,  copilot: 0, gemini: 1,  perplexity: 0 },
]

function getVisibilityColor(score: number): string {
  if (score >= 70) return "oklch(0.55 0.19 155)" // green
  if (score >= 50) return "oklch(0.7 0.16 75)"   // amber
  return "oklch(0.55 0.22 25)"                    // red
}

function CustomChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  const brand = chartData.find((d) => d.name === label)
  const total = payload.reduce((s, e) => s + e.value, 0)
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        {brand?.type === "main" && <Crown className="size-3 text-primary" />}
      </div>
      {brand && (
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
          <span className="text-[10px] text-muted-foreground">Visibility</span>
          <span className="ml-auto text-xs font-bold" style={{ color: getVisibilityColor(brand.visibility) }}>
            {brand.visibility}%
          </span>
        </div>
      )}
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
      <div className="mt-1.5 pt-1.5 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Total</span>
        <span className="font-bold text-foreground">{total}</span>
      </div>
    </div>
  )
}

export function BrandVisibilityChart() {
  const [view, setView] = useState<"chart" | "list">("chart")
  const [activeModels, setActiveModels] = useState<Set<ModelKey>>(new Set(CHART_MODELS))
  const [activeTypes, setActiveTypes] = useState<Set<BrandType>>(new Set(["main", "competitor", "partner"]))

  function toggleModel(key: ModelKey) {
    setActiveModels((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        if (next.size > 1) next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  function toggleType(type: BrandType) {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      // main brand is always visible
      if (type === "main") return next
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  const filteredData = chartData.filter((d) => activeTypes.has(d.type))

  const listData = filteredData
    .map((row) => ({
      ...row,
      total: CHART_MODELS.filter((m) => activeModels.has(m)).reduce(
        (sum, m) => sum + (row[m as keyof typeof row] as number),
        0
      ),
      breakdown: CHART_MODELS.filter((m) => activeModels.has(m)).map((m) => ({
        key: m,
        value: row[m as keyof typeof row] as number,
      })),
    }))
    .sort((a, b) => {
      // main brand always first
      if (a.type === "main") return -1
      if (b.type === "main") return 1
      return b.total - a.total
    })

  const maxTotal = Math.max(...listData.map((d) => d.total), 1)
  const totalMentions = filteredData.reduce((sum, row) =>
    sum + CHART_MODELS.filter((m) => activeModels.has(m)).reduce(
      (s, m) => s + (row[m as keyof typeof row] as number), 0
    ), 0
  )

  const TYPE_LABELS: Record<BrandType, { label: string; color: string }> = {
    main: { label: "Your Brand", color: "var(--primary)" },
    competitor: { label: "Competitors", color: "oklch(0.55 0.22 25)" },
    partner: { label: "Partners", color: "oklch(0.52 0.2 250)" },
  }

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
            <div className="flex items-baseline gap-1 mr-1">
              <span className="text-2xl font-bold text-foreground">{totalMentions}</span>
              <span className="text-xs text-muted-foreground">mentions</span>
            </div>

            {/* Brand type filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5 text-xs font-medium">
                  <Filter className="size-3.5" />
                  Brands
                  {activeTypes.size < 3 && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {activeTypes.size}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-52 p-2">
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Brand categories
                </p>
                <div className="flex flex-col gap-0.5">
                  {(["main", "competitor", "partner"] as BrandType[]).map((type) => {
                    const checked = activeTypes.has(type)
                    const isMain = type === "main"
                    return (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                      >
                        <span className="size-2 rounded-full" style={{ backgroundColor: TYPE_LABELS[type].color }} />
                        <span className="flex-1 text-left text-xs font-medium text-foreground">
                          {TYPE_LABELS[type].label}
                        </span>
                        {isMain ? (
                          <Crown className="size-3 text-primary" />
                        ) : (
                          <span
                            className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors"
                            style={
                              checked
                                ? { backgroundColor: "var(--foreground)", borderColor: "var(--foreground)", color: "var(--background)" }
                                : { borderColor: "var(--border)" }
                            }
                          >
                            {checked && <Check className="size-2.5 stroke-[3]" />}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>

            {/* Model filter popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5 text-xs font-medium">
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
                        <span
                          className="flex size-6 shrink-0 items-center justify-center rounded-md"
                          style={{ backgroundColor: `${config.hex}18`, color: config.hex }}
                        >
                          {Logo && <Logo size={13} />}
                        </span>
                        <span className="flex-1 text-left text-xs font-medium text-foreground">
                          {config.name}
                        </span>
                        <span
                          className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors"
                          style={
                            checked
                              ? { backgroundColor: config.hex, borderColor: config.hex, color: "#fff" }
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
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData} barCategoryGap="22%" barGap={2} margin={{ bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
                    const brand = chartData.find((d) => d.name === payload.value)
                    const isMain = brand?.type === "main"
                    const tagLabel = isMain ? "You" : brand?.type === "competitor" ? "Comp" : "Partner"
                    const tagColor = isMain ? "var(--primary)" : brand?.type === "competitor" ? "#d14343" : "#3b82f6"
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          textAnchor="middle"
                          dy={12}
                          fill={isMain ? "var(--primary)" : "var(--chart-tick)"}
                          fontSize={11}
                          fontWeight={isMain ? 600 : 400}
                        >
                          {payload.value}
                        </text>
                        <rect x={-16} y={17} width={32} height={14} rx={3} fill={isMain ? tagColor : `${tagColor}18`} />
                        <text
                          textAnchor="middle"
                          dy={27}
                          fill={isMain ? "#fff" : tagColor}
                          fontSize={8}
                          fontWeight={600}
                        >
                          {tagLabel}
                        </text>
                      </g>
                    )
                  }}
                  axisLine={{ stroke: "var(--chart-grid)" }}
                  tickLine={false}
                  height={45}
                />
                <YAxis
                  tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip content={<CustomChartTooltip />} cursor={{ fill: "var(--chart-cursor)" }} />
                {CHART_MODELS.filter((m) => activeModels.has(m)).map((key) => (
                  <Bar key={key} dataKey={key} fill={MODEL_CONFIG[key].hex} radius={[3, 3, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {/* Header */}
            <div className="flex items-center gap-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="w-5 text-center">#</span>
              <span className="flex-1">Brand</span>
              <span className="w-14 text-center">Visibility</span>
              {CHART_MODELS.filter((m) => activeModels.has(m)).map((key) => {
                const Logo = MODEL_LOGOS[key]
                return (
                  <span key={key} className="w-8 text-center" title={MODEL_CONFIG[key].name} style={{ color: MODEL_CONFIG[key].hex }}>
                    {Logo && <Logo size={13} />}
                  </span>
                )
              })}
              <span className="w-14 text-right">Total</span>
            </div>

            {listData.map((row, i) => {
              const isMain = row.type === "main"
              return (
                <div
                  key={row.name}
                  className={`flex items-center gap-3 py-2.5 ${isMain ? "bg-primary/5 -mx-6 px-6 rounded-lg" : ""}`}
                >
                  <span className="w-5 text-center text-xs font-semibold text-muted-foreground">
                    {isMain ? <Crown className="size-3.5 text-primary mx-auto" /> : i + 1}
                  </span>
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`truncate text-sm font-medium ${isMain ? "text-primary" : "text-foreground"}`}>
                        {row.name}
                      </span>
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                        style={{
                          backgroundColor: isMain ? "var(--primary)" : row.type === "competitor" ? "oklch(0.55 0.22 25 / 0.12)" : "oklch(0.52 0.2 250 / 0.12)",
                          color: isMain ? "var(--primary-foreground)" : row.type === "competitor" ? "oklch(0.55 0.22 25)" : "oklch(0.52 0.2 250)",
                        }}
                      >
                        {isMain ? "You" : row.type === "competitor" ? "Comp" : "Partner"}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{row.website}</span>
                    {/* Proportional stacked bar */}
                    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      {row.breakdown.map(({ key, value }) =>
                        value > 0 ? (
                          <div
                            key={key}
                            className="h-full transition-all"
                            style={{ width: `${(value / maxTotal) * 100}%`, backgroundColor: MODEL_CONFIG[key].hex }}
                          />
                        ) : null
                      )}
                    </div>
                  </div>

                  {/* Visibility score */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="w-14 text-center text-xs font-bold tabular-nums cursor-default"
                          style={{ color: getVisibilityColor(row.visibility) }}
                        >
                          {row.visibility}%
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground border-border">
                        <p className="text-xs font-medium">Visibility Score</p>
                        <p className="text-[10px] text-muted-foreground">How often AI models reference this brand in relevant queries</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Per-model counts */}
                  {CHART_MODELS.filter((m) => activeModels.has(m)).map((key) => {
                    const val = row.breakdown.find((b) => b.key === key)?.value ?? 0
                    return (
                      <span key={key} className="w-8 text-center text-xs tabular-nums" style={{ color: val > 0 ? MODEL_CONFIG[key].hex : undefined }}>
                        {val > 0 ? <span className="font-semibold">{val}</span> : <span className="text-muted-foreground/40">-</span>}
                      </span>
                    )
                  })}
                  <span className="w-14 text-right text-sm font-bold text-foreground tabular-nums">
                    {row.total}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
