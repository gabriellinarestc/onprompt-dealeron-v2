"use client"

import { Globe, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MODEL_CONFIG } from "@/lib/models"
import {
  ChatGPTLogo,
  ClaudeLogo,
  CopilotLogo,
  GeminiLogo,
  AIOverviewLogo,
  PerplexityLogo,
} from "@/components/dashboard/model-logos"
import type { ResponseDetail } from "./types"

const MODEL_LOGOS: Record<string, React.ComponentType<{ size?: number }>> = {
  chatgpt: ChatGPTLogo,
  claude: ClaudeLogo,
  copilot: CopilotLogo,
  gemini: GeminiLogo,
  aioverview: AIOverviewLogo,
  perplexity: PerplexityLogo,
}

/** Score color — interpolates hue from red (0) to green (142) */
function getScoreColor(value: number): string {
  const hue = (Math.max(0, Math.min(100, value)) / 100) * 142
  return `oklch(0.62 0.2 ${hue})`
}

/** Temperature color — discrete ranges */
function getTemperatureColor(score: number): string {
  if (score >= 80) return "oklch(0.52 0.19 155)"
  if (score >= 65) return "oklch(0.6 0.17 145)"
  if (score >= 50) return "oklch(0.68 0.15 120)"
  if (score >= 35) return "oklch(0.72 0.14 75)"
  return "oklch(0.58 0.18 25)"
}

/** SVG ring score */
function Ring({ value, size = 28, stroke = 3 }: { value: number; size?: number; stroke?: number }) {
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

/** Sentiment gradient bar with marker and value — matches Sentiment Score card */
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

/** Parse markdown-like bold formatting in response text */
function FormattedResponse({ text }: { text: string }) {
  const lines = text.split("\n")

  return (
    <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
      {lines.map((line, i) => {
        if (!line.trim()) return null

        const isBullet = line.trim().startsWith("- ")
        const content = isBullet ? line.trim().slice(2) : line

        const parts = content.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <span key={j} className="font-semibold text-foreground">
                {part.slice(2, -2)}
              </span>
            )
          }
          return <span key={j}>{part}</span>
        })

        if (isBullet) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
              <span>{parts}</span>
            </div>
          )
        }

        return <p key={i}>{parts}</p>
      })}
    </div>
  )
}

type ResponseDetailModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  detail: ResponseDetail | null
  onViewCitation?: (url: string) => void
}

export function ResponseDetailModal({
  open,
  onOpenChange,
  detail,
  onViewCitation,
}: ResponseDetailModalProps) {
  if (!detail) return null

  const modelConfig = MODEL_CONFIG[detail.model]
  const Logo = MODEL_LOGOS[detail.model]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[860px] h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="shrink-0 px-6 pt-6 pb-0">
          <DialogTitle className="text-lg font-bold text-foreground">
            Response Details
          </DialogTitle>
        </DialogHeader>

        {/* Metrics row */}
        <div className="shrink-0 flex flex-wrap items-start gap-6 border-b border-border px-6 pt-4 pb-5">
          {/* Visibility Score */}
          <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Visibility Score</p>
            <div className="flex items-center gap-1.5">
              <Ring value={detail.visibilityPercent} />
              <span className="text-sm font-bold" style={{ color: getScoreColor(detail.visibilityPercent) }}>
                {detail.visibilityPercent}%
              </span>
            </div>
          </div>

          {/* Sentiment */}
          <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sentiment</p>
            <div className="flex items-center pt-0.5">
              <SentimentBar value={detail.sentimentScore} />
            </div>
          </div>

          {/* Model */}
          <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Model</p>
            <div className="flex items-center gap-1.5">
              {Logo && (
                <div
                  className="flex size-4 shrink-0 items-center justify-center rounded"
                  style={{ color: modelConfig.hex }}
                >
                  <Logo size={12} />
                </div>
              )}
              <span className="text-xs font-medium text-foreground">{modelConfig.name}</span>
            </div>
          </div>

          {/* Brands Mentioned — matches prompts table pattern */}
          <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Brands Mentioned</p>
            <TooltipProvider>
              <div className="flex items-center gap-1">
                {detail.brands.map((brand) => (
                  <Tooltip key={brand}>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="size-6 items-center justify-center rounded-full border-border p-0 text-[10px] text-muted-foreground cursor-pointer hover:bg-muted"
                      >
                        {brand.charAt(0).toUpperCase()}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground border-border">
                      <p className="text-xs">{brand}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* Received at */}
          <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Received at</p>
            <p className="text-xs font-medium text-foreground">{detail.date}</p>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 pt-4 pb-6 flex flex-col gap-4">
          {/* User Prompt section — bordered card like Response tab */}
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              User Prompt
            </p>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs leading-relaxed text-foreground">{detail.userPrompt}</p>
            </div>
          </div>

          {/* Tabs: Response / Citations */}
          <Tabs defaultValue="response" className="flex flex-col flex-1 min-h-0">
            <TabsList className="w-fit shrink-0">
              <TabsTrigger value="response" className="text-xs">
                Response
              </TabsTrigger>
              <TabsTrigger value="citations" className="text-xs">
                Citations ({detail.citations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="response" className="mt-3">
              <div className="rounded-lg border border-border p-4">
                <FormattedResponse text={detail.fullResponse} />
              </div>
            </TabsContent>

            <TabsContent value="citations" className="mt-3">
              <div className="flex flex-col gap-2">
                {detail.citations.map((citation) => (
                  <div
                    key={citation.id}
                    className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3 transition-colors hover:bg-secondary"
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                      {citation.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground">{citation.title}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                        {citation.description}
                      </p>
                      <button
                        onClick={() => onViewCitation?.(citation.url)}
                        className="mt-1 flex items-center gap-1 text-[11px] text-primary hover:underline"
                      >
                        <Globe className="size-3" />
                        {citation.url}
                      </button>
                    </div>
                    <button
                      onClick={() => onViewCitation?.(citation.url)}
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
