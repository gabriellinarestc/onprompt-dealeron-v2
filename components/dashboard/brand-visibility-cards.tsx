"use client"

import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MODEL_CONFIG } from "@/lib/models"
import { useModelFilter } from "./model-filter-context"
import { HelpTooltip } from "./help-tooltip"
import { TruncatedText } from "./truncated-text"
import {
  ChatGPTLogo,
  ClaudeLogo,
  GeminiLogo,
  AIOverviewLogo,
  PerplexityLogo,
  CopilotLogo,
} from "./model-logos"

const modelData = [
  { key: "chatgpt" as const, mentions: 20, change: "+1,900%" },
  { key: "claude" as const, mentions: 8, change: "+700%" },
  { key: "gemini" as const, mentions: 5, change: "+400%" },
  { key: "aioverview" as const, mentions: 4, change: "+300%" },
  { key: "perplexity" as const, mentions: 1, change: null },
  { key: "copilot" as const, mentions: 1, change: null },
]

const MODEL_LOGOS = {
  chatgpt: ChatGPTLogo,
  claude: ClaudeLogo,
  gemini: GeminiLogo,
  aioverview: AIOverviewLogo,
  perplexity: PerplexityLogo,
  copilot: CopilotLogo,
}

function getScoreColor(value: number): string {
  const hue = (Math.max(0, Math.min(100, value)) / 100) * 142
  return `oklch(0.62 0.2 ${hue})`
}

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

export function BrandVisibilityCards() {
  const { isModelActive } = useModelFilter()
  const filteredModelData = modelData.filter((item) => isModelActive(item.key))

  return (
    <div className="grid gap-4 md:grid-cols-3">

      {/* Score card */}
      <div className="relative flex overflow-hidden rounded-xl border border-border bg-card">
        {[
          { value: 28, label: "Visibility" },
          { value: 57, label: "Content Coverage" },
        ].map((item, i) => {
          const color = getScoreColor(item.value)
          return (
            <div key={item.label} className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-5">
              <Ring value={item.value} size={64} stroke={6} />
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-lg font-bold leading-tight" style={{ color }}>{item.value}%</p>
                <div className="flex items-center gap-1">
                  <p className="text-center text-xs leading-tight text-muted-foreground">{item.label}</p>
                  <HelpTooltip title={item.label}>
                    {i === 0
                      ? "Measures how often your brand appears in AI model responses. Calculated as (your brand mentions / total category mentions) across all tracked models and prompts."
                      : "Percentage of relevant prompts where your brand appears in at least one AI model response. Higher coverage means better discoverability."}
                  </HelpTooltip>
                </div>
              </div>

            </div>
          )
        })}
      </div>

      {/* Mentions by Model */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card md:col-span-2">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Mentions by Model
            </p>
            <HelpTooltip title="Mentions by Model">
              Total number of times your brand was mentioned in responses from each AI model. The percentage shows growth compared to the previous period.
            </HelpTooltip>
          </div>
          <Badge variant="secondary" className="h-8 px-3 text-sm font-medium">
            {filteredModelData.reduce((sum, item) => sum + item.mentions, 0)} mentions
          </Badge>
        </div>
        <div className="flex flex-1 divide-x divide-border border-t border-border">
          {filteredModelData.map((item) => {
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
                  <span className="text-2xl font-bold leading-none text-foreground">{item.mentions}</span>
                  {item.change ? (
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold" style={{ color: config.hex }}>
                      <ArrowUpRight className="size-2.5" />{item.change}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">—</span>
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
