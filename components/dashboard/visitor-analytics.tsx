"use client"

import { ArrowUpRight, AlertTriangle, Clock, CheckCircle2 } from "lucide-react"
import { HelpTooltip } from "./help-tooltip"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  { key: "chatgpt" as const, visitors: 21, change: "+950%" },
  { key: "claude" as const, visitors: 10, change: null },
  { key: "copilot" as const, visitors: 1, change: null },
  { key: "gemini" as const, visitors: 5, change: "+400%" },
  { key: "aioverview" as const, visitors: 3, change: "+200%" },
  { key: "perplexity" as const, visitors: 2, change: "+100%" },
]

const crawlerStats = [
  {
    value: 7,
    total: 10,
    label: "Indexed",
    sub: "pages indexed",
    icon: CheckCircle2,
    status: "ok" as const,
  },
  {
    value: 2,
    total: null,
    label: "Blocked",
    sub: "need attention",
    icon: AlertTriangle,
    status: "warn" as const,
  },
  {
    value: 1,
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
  const { isModelActive } = useModelFilter()
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
          {hasWarning && (
            <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
              <AlertTriangle className="size-3" />
              Action needed
            </span>
          )}
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
        <div className="flex items-center gap-1.5 px-5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Visitors by Model
          </p>
          <HelpTooltip title="Visitors by Model">
            Real users who arrived at your site after seeing your brand mentioned in an AI model response. Growth percentages compare to the previous tracking period.
          </HelpTooltip>
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
                  {item.change ? (
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold" style={{ color: config.hex }}>
                      <ArrowUpRight className="size-2.5" />{item.change}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">—</span>
                  )}
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="max-w-full truncate text-[11px] text-muted-foreground cursor-default">{config.name}</p>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="flex items-center gap-2 bg-popover text-popover-foreground border-border">
                        <span style={{ color: config.hex }}><Logo size={14} /></span>
                        <span className="text-xs font-medium">{config.name}</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
