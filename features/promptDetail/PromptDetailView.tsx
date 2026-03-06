"use client"

import { ArrowLeft, Eye, Link2, ExternalLink, AlertCircle, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tag } from "@/components/ui/tag"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SectionHeader } from "@/components/patterns/section-header"
import { HelpTooltip } from "@/components/patterns/help-tooltip"
import { TruncatedText } from "@/components/patterns/truncated-text"
import { MODEL_CONFIG, type ModelKey } from "@/lib/models"
import {
  ChatGPTLogo,
  ClaudeLogo,
  CopilotLogo,
  GeminiLogo,
  AIOverviewLogo,
  PerplexityLogo,
} from "@/components/dashboard/model-logos"
import type { PromptDetailData, PromptDetailPageInfo, ResponseDetail } from "./types"
import type { PromptDetailEvents } from "./events"
import { ResponseDetailModal } from "./ResponseDetailModal"

// ─── Color utilities (matching dashboard conventions) ────────────────────────

const MODEL_LOGOS: Record<string, React.ComponentType<{ size?: number }>> = {
  chatgpt: ChatGPTLogo,
  claude: ClaudeLogo,
  copilot: CopilotLogo,
  gemini: GeminiLogo,
  aioverview: AIOverviewLogo,
  perplexity: PerplexityLogo,
}

/** Brand line colors — uses chart tokens + model brand colors for clear differentiation */
const BRAND_CHART_HEX = [
  "#10a37f", // chart-5 / green — primary brand (DealerOn)
  "#536dfe", // model-gemini / blue
  "#d97757", // model-claude / orange
  "#9c5bce", // model-aioverview / purple
  "#20b8cd", // model-perplexity / cyan
]

/** Score color — interpolates hue from red (0) to green (142), matching MentionsByModel */
function getScoreColor(value: number): string {
  const hue = (Math.max(0, Math.min(100, value)) / 100) * 142
  return `oklch(0.62 0.2 ${hue})`
}

/** Temperature color — discrete ranges matching BrandSentiment/TopPrompts */
function getTemperatureColor(score: number): string {
  if (score >= 80) return "oklch(0.52 0.19 155)"
  if (score >= 65) return "oklch(0.6 0.17 145)"
  if (score >= 50) return "oklch(0.68 0.15 120)"
  if (score >= 35) return "oklch(0.72 0.14 75)"
  return "oklch(0.58 0.18 25)"
}

function getTrendLabel(trend: "positive" | "neutral" | "negative") {
  if (trend === "positive") return "Trending positive"
  if (trend === "negative") return "Trending negative"
  return "Stable"
}

function getTrendColor(trend: "positive" | "neutral" | "negative") {
  if (trend === "positive") return "text-success"
  if (trend === "negative") return "text-destructive"
  return "text-muted-foreground"
}

// ─── Reusable sub-components ─────────────────────────────────────────────────

/** SVG ring score — same as MentionsByModel */
function Ring({ value, size = 44, stroke = 5 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const color = getScoreColor(value)
  return (
    <svg width={size} height={size} className="shrink-0 rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" stroke="var(--muted)" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        strokeWidth={stroke} fill="none"
        stroke={color}
        strokeDasharray={circ}
        strokeDashoffset={circ - (value / 100) * circ}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  )
}

/** Sentiment gradient bar — same as TopPrompts SentimentBar */
function SentimentBar({ value }: { value: number }) {
  const color = getTemperatureColor(value)
  const clampedLeft = Math.max(8, Math.min(92, value))
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative h-2 w-20 rounded-full"
        style={{ background: "linear-gradient(to right, oklch(0.55 0.22 25), oklch(0.7 0.16 75), oklch(0.55 0.19 155))" }}
      >
        <div
          className="absolute size-2.5 rounded-full border-2 border-background"
          style={{
            left: `${clampedLeft}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: color,
          }}
        />
      </div>
      <span className="text-[11px] font-semibold tabular-nums" style={{ color }}>{value}</span>
    </div>
  )
}

/** Custom chart tooltip — same as BrandSentiment */
function CustomChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <div className="mt-1 flex flex-col gap-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-muted-foreground">{entry.name}</span>
            <span className="ml-auto text-xs font-semibold text-foreground">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Skeleton states ─────────────────────────────────────────────────────────

function HeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-6 w-72" />
      <Skeleton className="h-3 w-36" />
    </div>
  )
}

function ScoreCardsSkeleton() {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-5">
        <div className="size-14 animate-pulse rounded-full bg-muted" />
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2.5 rounded-xl border border-border bg-card px-5 py-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </>
  )
}

function ChartSkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-3 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

function SnippetsSkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-56" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2 rounded-xl border border-border p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main View ───────────────────────────────────────────────────────────────

type PromptDetailViewProps = {
  state: "loading" | "empty" | "error" | "ready"
  data?: PromptDetailData
  pageInfo?: PromptDetailPageInfo
  error?: { title: string; message: string; code?: string }
  responseDetail?: ResponseDetail | null
  responseDetailOpen?: boolean
  onResponseDetailOpenChange?: (open: boolean) => void
} & PromptDetailEvents

export function PromptDetailView({
  state,
  data,
  pageInfo,
  error,
  onBack,
  onPageChange,
  onRetry,
  onViewResponseDetail,
  onViewCitation,
  responseDetail,
  responseDetailOpen = false,
  onResponseDetailOpenChange,
}: PromptDetailViewProps) {
  // ── Loading ──
  if (state === "loading") {
    return (
      <div className="flex flex-col gap-6">
        <HeaderSkeleton />
        <Skeleton className="h-3 w-28" />
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <ChartSkeleton />
          <div className="flex flex-col gap-4">
            <ScoreCardsSkeleton />
          </div>
        </div>
        <Skeleton className="h-3 w-28" />
        <SnippetsSkeleton />
      </div>
    )
  }

  // ── Error ──
  if (state === "error") {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Prompts
        </button>
        <Card className="border-border bg-card border-destructive/20">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="size-5 text-destructive" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{error?.title ?? "Something went wrong"}</p>
                <p className="mt-1 max-w-md text-xs text-muted-foreground">{error?.message}</p>
                {error?.code && (
                  <p className="mt-2 text-[10px] font-mono text-muted-foreground/60">{error.code}</p>
                )}
              </div>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
                >
                  Try again
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Empty ──
  if (state === "empty" || !data) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Prompts
        </button>
        <Card className="border-border bg-card">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex gap-2 opacity-30">
                {[ChatGPTLogo, ClaudeLogo, GeminiLogo, PerplexityLogo].map((Logo, i) => (
                  <div key={i} className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <Logo size={16} />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">No data available yet</p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  This prompt is still being analyzed. Check back soon for visibility data and AI model responses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Ready ──
  const { visibilityOverTime, visibilityBrands, sentimentScore, visibilityScore, brandsInResponses, queryFanouts, responseSnippets } = data

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="size-4" />
          Back to Prompts
        </button>
        <h1 className="text-lg font-bold text-foreground">&ldquo;{data.prompt}&rdquo;</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Last updated: {data.lastUpdated}</p>
      </div>

      {/* ── Section: Prompt Metrics ── */}
      <SectionHeader
        title="Prompt Metrics"
        tooltip="Key performance indicators for this prompt across AI models."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Brand Visibility Over Time (wider, left) */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-sm font-semibold text-foreground">Brand Visibility Over Time</CardTitle>
              <HelpTooltip title="How to read this chart">
                Each line represents a brand&apos;s visibility percentage across AI models over time. Higher values mean the brand is referenced more often in responses to this prompt.
              </HelpTooltip>
            </div>
            <CardDescription className="text-xs">
              Average visibility across all AI models per brand
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Brands in Responses — above chart */}
            {brandsInResponses.length > 0 && (
              <div className="mb-6 flex items-center gap-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">Brands</p>
                <div className="flex flex-wrap gap-1.5">
                  {brandsInResponses.map((brand) => (
                    <Badge key={brand} variant="outline" className="text-[11px] font-medium">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visibilityOverTime} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "var(--chart-tick)" }}
                    axisLine={{ stroke: "var(--chart-grid)" }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickFormatter={(v: number) => `${v}%`}
                    tick={{ fontSize: 10, fill: "var(--chart-tick)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<CustomChartTooltip />} cursor={{ stroke: "var(--chart-grid)", strokeDasharray: "3 3" }} />
                  <Legend
                    iconType="plainline"
                    wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                  />
                  {visibilityBrands.map((brand, i) => (
                    <Line
                      key={brand}
                      type="monotone"
                      dataKey={brand}
                      stroke={BRAND_CHART_HEX[i % BRAND_CHART_HEX.length]}
                      strokeWidth={2}
                      dot={{ r: 3, fill: "var(--chart-dot-stroke)", strokeWidth: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Score cards (narrower, right — stacked) */}
        <div className="flex flex-col gap-4">
          {/* Visibility Score */}
          <div className="flex flex-1 overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-5">
              <Ring value={visibilityScore.percent} size={64} stroke={6} />
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-lg font-bold leading-tight" style={{ color: getScoreColor(visibilityScore.percent) }}>
                  {visibilityScore.percent}%
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-center text-xs leading-tight text-muted-foreground">Visibility Score</p>
                  <HelpTooltip title="Visibility Score">
                    How prominently your brand appears in AI-generated responses for this prompt. Combines mention frequency, citation quality, and positioning.
                  </HelpTooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Score */}
          <div className="flex flex-1 overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-1 flex-col justify-center gap-2.5 px-5 py-4">
              <div className="flex items-center gap-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sentiment Score</p>
                <HelpTooltip title="Sentiment Score">
                  How positively AI models describe your brand when responding to this prompt. Scores range from 0 (negative) to 100 (very positive).
                </HelpTooltip>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{sentimentScore.score}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
              <p className={`text-[11px] font-medium ${getTrendColor(sentimentScore.trend)}`}>
                {getTrendLabel(sentimentScore.trend)}
              </p>
              <div>
                <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-destructive via-warning to-success">
                  <div
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${sentimentScore.score}%` }}
                  >
                    <div className="size-3.5 rounded-full border-2 border-background" style={{ backgroundColor: getTemperatureColor(sentimentScore.score) }} />
                  </div>
                </div>
                <p className="mt-1 text-right text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">{sentimentScore.score}</span>/100
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section: Query Fanouts ── */}
      {queryFanouts.length > 0 && (
        <>
          <SectionHeader
            title="Query Fanouts"
            tooltip="Related queries AI models use to gather information when responding to this prompt."
          />
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-sm font-semibold text-foreground">Query Fanouts</CardTitle>
                <HelpTooltip title="Query Fanouts">
                  These are related queries that AI models generate internally to gather more context before crafting a response to your prompt.
                </HelpTooltip>
              </div>
              <CardDescription className="text-xs">
                Related queries AI models use to gather information for this prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {queryFanouts.map((fanout) => {
                  const fanoutModelConfig = MODEL_CONFIG[fanout.model]
                  const isHigh = fanout.visibilityChange >= 10
                  return (
                    <div
                      key={fanout.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
                    >
                      <Tag variant="default" className="shrink-0 uppercase tracking-wider">
                        Query
                      </Tag>
                      <p className="flex-1 text-sm text-foreground">{fanout.query}</p>
                      <Tag variant={isHigh ? "moderate" : "high"} className="shrink-0 gap-0.5">
                        <ChevronUp className="size-3" />
                        +{fanout.visibilityChange}%
                      </Tag>
                      <span className="shrink-0 text-sm text-muted-foreground w-24 text-right">
                        {fanoutModelConfig.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ── Section: Response Snippets ── */}
      <SectionHeader
        title="Response Snippets"
        tooltip="How each AI model responds to this prompt, with visibility, sentiment, and citation data."
      />
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-sm font-semibold text-foreground">Response Snippets</CardTitle>
                <HelpTooltip title="Response Snippets">
                  Each card shows a snapshot of how a specific AI model responds to this prompt, including visibility share, sentiment, and cited sources.
                </HelpTooltip>
              </div>
              <CardDescription className="text-xs">
                How each AI model responds to this prompt
              </CardDescription>
            </div>
            {pageInfo && (
              <p className="text-xs text-muted-foreground shrink-0">
                Showing {(pageInfo.page - 1) * pageInfo.pageSize + 1}-
                {Math.min(pageInfo.page * pageInfo.pageSize, pageInfo.totalItems)} of{" "}
                {pageInfo.totalItems} responses
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {responseSnippets.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {responseSnippets.map((response) => {
                const modelConfig = MODEL_CONFIG[response.model]
                const Logo = MODEL_LOGOS[response.model]
                return (
                  <div key={response.id} className="flex flex-col gap-2.5 rounded-xl border border-border p-4 transition-colors hover:bg-muted/30">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {Logo && (
                          <div
                            className="flex size-6 shrink-0 items-center justify-center rounded-md"
                            style={{ backgroundColor: `${modelConfig.hex}15`, color: modelConfig.hex }}
                          >
                            <Logo size={13} />
                          </div>
                        )}
                        <span className="text-sm font-semibold text-foreground">
                          {modelConfig?.name ?? response.model}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{response.date}</span>
                    </div>

                    {/* Metrics row */}
                    <div className="flex items-center gap-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1 cursor-default" style={{ color: getScoreColor(response.visibilityPercent) }}>
                              <Eye className="size-3.5" />
                              <span className="text-xs font-semibold tabular-nums">{response.visibilityPercent}%</span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover text-popover-foreground border-border">
                            <p className="text-xs font-medium">Visibility</p>
                            <p className="text-[10px] text-muted-foreground">Share of responses where your brand appears</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <SentimentBar value={response.sentimentScore} />
                      <span className="flex items-center gap-1 text-primary">
                        <Link2 className="size-3.5" />
                        <span className="text-xs font-semibold">{response.citationCount} citations</span>
                      </span>
                    </div>

                    {/* Brand badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {response.brands.slice(0, 3).map((brand) => (
                        <Badge key={brand} variant="secondary" className="text-[11px] px-2 py-0">
                          {brand}
                        </Badge>
                      ))}
                      {response.brands.length > 3 && (
                        <Badge variant="secondary" className="text-[11px] px-2 py-0">
                          +{response.brands.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Snippet text */}
                    <TruncatedText className="text-xs leading-relaxed text-muted-foreground">
                      {response.snippet}
                    </TruncatedText>

                    {/* View Details link */}
                    <button
                      onClick={() => onViewResponseDetail?.(response.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      View Details
                      <ExternalLink className="size-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <div className="flex gap-2 opacity-30">
                {[ChatGPTLogo, ClaudeLogo, GeminiLogo, PerplexityLogo].map((Logo, i) => (
                  <div key={i} className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <Logo size={16} />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">No responses yet</p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  AI model responses will appear here once analysis is complete.
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pageInfo && pageInfo.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                Showing {(pageInfo.page - 1) * pageInfo.pageSize + 1}-
                {Math.min(pageInfo.page * pageInfo.pageSize, pageInfo.totalItems)} of{" "}
                {pageInfo.totalItems} responses
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pageInfo.page <= 1}
                  onClick={() => onPageChange?.(pageInfo.page - 1)}
                >
                  <ChevronLeft className="size-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pageInfo.page >= pageInfo.totalPages}
                  onClick={() => onPageChange?.(pageInfo.page + 1)}
                >
                  Next
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Detail Modal */}
      <ResponseDetailModal
        open={responseDetailOpen}
        onOpenChange={(open) => onResponseDetailOpenChange?.(open)}
        detail={responseDetail ?? null}
        onViewCitation={onViewCitation}
      />
    </div>
  )
}
