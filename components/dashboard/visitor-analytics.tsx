"use client"

import { ArrowUpRight, AlertTriangle, Clock, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { HelpTooltip } from "./help-tooltip"
import { TruncatedText } from "./truncated-text"
import { MODEL_CONFIG } from "@/lib/models"
import { useModelFilter } from "./model-filter-context"
import {
  ChatGPTLogo,
  ClaudeLogo,
  CopilotLogo,
  GeminiLogo,
  AIOverviewLogo,
  PerplexityLogo,
} from "./model-logos"

const MODEL_LOGOS = {
  chatgpt: ChatGPTLogo,
  claude: ClaudeLogo,
  copilot: CopilotLogo,
  gemini: GeminiLogo,
  aioverview: AIOverviewLogo,
  perplexity: PerplexityLogo,
}

const visitorModels = [
  { key: "chatgpt" as const, visitors: 1243, change: "+38%" },
  { key: "claude" as const, visitors: 587, change: "+24%" },
  { key: "copilot" as const, visitors: 142, change: "+15%" },
  { key: "gemini" as const, visitors: 418, change: "+47%" },
  { key: "aioverview" as const, visitors: 356, change: "+31%" },
  { key: "perplexity" as const, visitors: 209, change: "+22%" },
]

const crawlerStats = [
  {
    value: 847,
    total: 1024,
    label: "Indexed",
    sub: "pages indexed",
    icon: CheckCircle2,
    status: "ok" as const,
  },
  {
    value: 128,
    total: null,
    label: "Blocked",
    sub: "need attention",
    icon: AlertTriangle,
    status: "warn" as const,
  },
  {
    value: 49,
    total: null,
    label: "Pending",
    sub: "awaiting index",
    icon: Clock,
    status: "info" as const,
  },
]

const statusStyles = {
  ok:   { text: "text-primary",  bg: "bg-primary/10",  icon: "text-primary"  },
  warn: { text: "text-warning",  bg: "bg-warning/10",  icon: "text-warning"  },
  info: { text: "text-chart-2",  bg: "bg-chart-2/10",  icon: "text-chart-2"  },
}

export function VisitorAnalytics() {
  const { isModelActive, comparePrior } = useModelFilter()
  const filteredVisitorModels = visitorModels.filter((item) => isModelActive(item.key))
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

      {/* Visitors by Model — exactly mirrors Mentions by Model */}
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
            {filteredVisitorModels.reduce((sum, item) => sum + item.visitors, 0)} visitors
          </Badge>
        </div>
        <div className="flex flex-1 divide-x divide-border border-t border-border">
          {filteredVisitorModels.map((item) => {
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
                    <span className="invisible text-[11px]">—</span>
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
