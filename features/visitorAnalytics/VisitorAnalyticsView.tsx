"use client"

import { ArrowUpRight, AlertTriangle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { HelpTooltip } from "@/components/patterns/help-tooltip"
import { TruncatedText } from "@/components/patterns/truncated-text"
import { MODEL_CONFIG } from "@/lib/models"
import {
  ChatGPTLogo,
  ClaudeLogo,
  CopilotLogo,
  GeminiLogo,
  AIOverviewLogo,
  PerplexityLogo,
} from "@/components/dashboard/model-logos"
import type { VisitorAnalyticsProps } from "./types"

const MODEL_LOGOS = {
  chatgpt: ChatGPTLogo,
  claude: ClaudeLogo,
  copilot: CopilotLogo,
  gemini: GeminiLogo,
  aioverview: AIOverviewLogo,
  perplexity: PerplexityLogo,
}

const statusStyles = {
  ok:   { text: "text-primary",  bg: "bg-primary/10",  icon: "text-primary"  },
  warn: { text: "text-warning",  bg: "bg-warning/10",  icon: "text-warning"  },
  info: { text: "text-chart-2",  bg: "bg-chart-2/10",  icon: "text-chart-2"  },
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex flex-1 divide-x divide-border border-t border-border">
            {[0, 1, 2].map((j) => (
              <div key={j} className="flex flex-1 flex-col justify-center gap-2.5 px-5 py-4">
                <div className="size-7 animate-pulse rounded-md bg-muted" />
                <div className="h-7 w-12 animate-pulse rounded bg-muted" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex overflow-hidden rounded-xl border border-border bg-card md:col-span-2">
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-10">
          <p className="text-sm font-medium text-muted-foreground">No visitor analytics data available</p>
          <p className="text-xs text-muted-foreground">Data will appear once AI models start driving traffic to your site.</p>
        </div>
      </div>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex overflow-hidden rounded-xl border border-destructive/40 bg-card md:col-span-2">
        <div className="flex flex-1 items-center justify-center gap-3 px-5 py-10">
          <AlertCircle className="size-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-foreground">Failed to load visitor analytics</p>
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
      </div>
    </div>
  )
}

export function VisitorAnalyticsView({ state, visitorModels, crawlerStats, comparePrior, onRetry }: VisitorAnalyticsProps) {
  if (state === "loading") return <LoadingSkeleton />
  if (state === "empty") return <EmptyState />
  if (state === "error") return <ErrorState onRetry={onRetry} />

  const hasWarning = crawlerStats.some((s) => s.status === "warn" && s.value > 0)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Pages Crawled */}
      <div className={`flex flex-col overflow-hidden rounded-xl border bg-card ${hasWarning ? "border-warning/40" : "border-border"}`}>
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Pages Crawled
            </p>
            <HelpTooltip title="Pages Crawled">
              Breakdown of how AI crawlers are indexing your site. Successful crawls mean the bot read your page. Blocked pages may be due to robots.txt rules. Pending pages are queued for indexing.
            </HelpTooltip>
          </div>
          <div className="flex items-center gap-2">
            {hasWarning && (
              <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
                <AlertTriangle className="size-3" />
                Action needed
              </span>
            )}
            <Badge variant="secondary" className="h-8 px-3 text-sm font-medium">
              {crawlerStats.reduce((sum, s) => sum + s.value, 0)} pages
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 divide-x divide-border border-t border-border">
          {crawlerStats.map((stat) => {
            const styles = statusStyles[stat.status]
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex flex-1 flex-col justify-center gap-2.5 px-5 py-4">
                <div className={`flex size-7 shrink-0 items-center justify-center rounded-md ${styles.bg}`}>
                  <Icon className={`size-3.5 ${styles.icon}`} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className={`text-2xl font-bold leading-none ${styles.text}`}>{stat.value}</span>
                  <span className="text-[11px] text-muted-foreground">{stat.sub}</span>
                  <span className="text-[11px] font-medium text-muted-foreground">{stat.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Visitors by Model */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Visitors by Model
            </p>
            <HelpTooltip title="Visitors by Model">
              Real users who arrived at your site after seeing your brand mentioned in an AI model response. Growth percentages compare to the previous tracking period.
            </HelpTooltip>
          </div>
          <Badge variant="secondary" className="h-8 px-3 text-sm font-medium">
            {visitorModels.reduce((sum, item) => sum + item.visitors, 0)} visitors
          </Badge>
        </div>
        <div className="flex flex-1 divide-x divide-border border-t border-border">
          {visitorModels.map((item) => {
            const config = MODEL_CONFIG[item.key]
            const Logo = MODEL_LOGOS[item.key]
            return (
              <div key={item.key} className="flex flex-1 flex-col justify-center gap-2.5 px-5 py-4">
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${config.hex}15`, color: config.hex }}
                >
                  <Logo size={14} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-2xl font-bold leading-none text-foreground">{item.visitors}</span>
                  {comparePrior && item.change ? (
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold" style={{ color: config.hex }}>
                      <ArrowUpRight className="size-2.5" />{item.change}
                    </span>
                  ) : (
                    <span className="invisible text-[11px]">&mdash;</span>
                  )}
                  <TruncatedText
                    className="max-w-full text-[11px] text-muted-foreground"
                    tooltipIcon={<span style={{ color: config.hex }}><Logo size={14} /></span>}
                  >
                    {config.name}
                  </TruncatedText>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
