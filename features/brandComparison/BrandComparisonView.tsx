"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Crown, AlertCircle } from "lucide-react"
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
import type { BrandComparisonProps } from "./types"

const MODEL_LOGOS: Record<string, React.ComponentType<{ size?: number }>> = {
  chatgpt: ChatGPTLogo,
  claude: ClaudeLogo,
  copilot: CopilotLogo,
  gemini: GeminiLogo,
  aioverview: AIOverviewLogo,
  perplexity: PerplexityLogo,
}

const CHART_MODELS: ModelKey[] = ["chatgpt", "claude", "copilot", "gemini", "aioverview", "perplexity"]

function getVisibilityColor(score: number): string {
  if (score >= 70) return "oklch(0.55 0.19 155)"
  if (score >= 50) return "oklch(0.7 0.16 75)"
  return "oklch(0.55 0.22 25)"
}

function LoadingSkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-3 w-48 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-4 w-5 animate-pulse rounded bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                <div className="h-1.5 w-full animate-pulse rounded-full bg-muted" />
              </div>
              <div className="h-4 w-10 animate-pulse rounded bg-muted" />
              <div className="h-4 w-10 animate-pulse rounded bg-muted" />
              <div className="h-4 w-10 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">Brand Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-sm font-medium text-muted-foreground">No brand comparison data available</p>
          <p className="text-xs text-muted-foreground">Add competitor brands to see how you compare.</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="border-border bg-card border-destructive/40">
      <CardContent className="py-10">
        <div className="flex items-center justify-center gap-3">
          <AlertCircle className="size-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-foreground">Failed to load brand comparison</p>
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
  )
}

export function BrandComparisonView({ state, data, activeModels, onRetry }: BrandComparisonProps) {
  if (state === "loading") return <LoadingSkeleton />
  if (state === "empty") return <EmptyState />
  if (state === "error") return <ErrorState onRetry={onRetry} />

  const listData = data
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
      if (a.type === "main") return -1
      if (b.type === "main") return 1
      return b.total - a.total
    })

  const maxTotal = Math.max(...listData.map((d) => d.total), 1)

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-sm font-semibold text-foreground">
                Brand Comparison
              </CardTitle>
              <HelpTooltip title="Brand Comparison">
                Compare how often each brand is mentioned across AI models. The visibility score (0-100) indicates overall discoverability, while mentions show the raw count per model.
              </HelpTooltip>
            </div>
            <CardDescription className="text-xs">
              Compare brand mentions across AI models
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col divide-y divide-border">
          {/* Header */}
          <div className="flex items-center gap-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="w-5 text-center">#</span>
            <span className="flex-1">Brand</span>
            <span className="w-14 text-center">Visibility</span>
            {CHART_MODELS.filter((m) => activeModels.has(m)).map((key) => {
              const Logo = MODEL_LOGOS[key]
              return (
                <div key={key} className="w-16 text-center">
                  <TruncatedText
                    className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                    tooltipSide="top"
                    tooltipIcon={<span style={{ color: MODEL_CONFIG[key].hex }}>{Logo && <Logo size={14} />}</span>}
                  >
                    {MODEL_CONFIG[key].name}
                  </TruncatedText>
                </div>
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
                    {isMain && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "var(--primary-foreground)",
                        }}
                      >
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{row.website}</span>
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
                      <p className="text-xs font-medium">Visibility</p>
                      <p className="text-[10px] text-muted-foreground">How often AI models reference this brand in relevant queries</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {CHART_MODELS.filter((m) => activeModels.has(m)).map((key) => {
                  const val = row.breakdown.find((b) => b.key === key)?.value ?? 0
                  return (
                    <span key={key} className="w-16 text-center text-xs tabular-nums" style={{ color: val > 0 ? MODEL_CONFIG[key].hex : undefined }}>
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
      </CardContent>
    </Card>
  )
}
