"use client"

import { ArrowUpRight, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MODEL_CONFIG } from "@/lib/models"
import { HelpTooltip } from "@/components/patterns/help-tooltip"
import { TruncatedText } from "@/components/patterns/truncated-text"
import {
  ChatGPTLogo,
  ClaudeLogo,
  GeminiLogo,
  AIOverviewLogo,
  PerplexityLogo,
  CopilotLogo,
} from "@/components/dashboard/model-logos"
import type { MentionsByModelProps } from "./types"

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

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="flex overflow-hidden rounded-xl border border-border bg-card">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-5">
            <div className="size-16 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card md:col-span-2">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex flex-1 divide-x divide-border border-t border-border">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-1 flex-col justify-center gap-2.5 px-5 py-4">
              <div className="size-7 animate-pulse rounded-md bg-muted" />
              <div className="h-7 w-12 animate-pulse rounded bg-muted" />
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="flex overflow-hidden rounded-xl border border-border bg-card md:col-span-3">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-12">
          <div className="flex gap-2 opacity-30">
            {[ChatGPTLogo, ClaudeLogo, GeminiLogo, PerplexityLogo].map((Logo, i) => (
              <div key={i} className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <Logo size={16} />
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">No mentions yet</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              We&apos;re scanning AI models for mentions of your brand. Results typically appear within 24 hours of adding prompts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="flex overflow-hidden rounded-xl border border-destructive/20 bg-card md:col-span-3">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-12">
          <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-5 text-destructive" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Couldn&apos;t load mention data</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              We had trouble connecting to our analytics service. This is usually temporary.
            </p>
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
      </div>
    </div>
  )
}

export function MentionsByModelView({ state, scores, models, comparePrior, onRetry }: MentionsByModelProps) {
  if (state === "loading") return <LoadingSkeleton />
  if (state === "empty") return <EmptyState />
  if (state === "error") return <ErrorState onRetry={onRetry} />

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Score card */}
      <div className="relative flex overflow-hidden rounded-xl border border-border bg-card">
        {scores.map((item, i) => {
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
                      ? "The Visibility Score measures how prominently your brand appears in AI-generated responses. It combines mention frequency, citation quality, and positioning to give you a comprehensive view of your AI visibility."
                      : "Measures how well your website answers the questions that arise from your tracked prompts. We crawl and index your entire website so we can search it to identify content gaps."}
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
            {models.reduce((sum, item) => sum + item.mentions, 0)} mentions
          </Badge>
        </div>
        <div className="flex flex-1 divide-x divide-border border-t border-border">
          {models.map((item) => {
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
