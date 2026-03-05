"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowRight, AlertCircle } from "lucide-react"
import { HelpTooltip } from "@/components/patterns/help-tooltip"
import { TruncatedText } from "@/components/patterns/truncated-text"
import type { TopPromptsProps } from "./types"

function getTemperatureColor(value: number): string {
  if (value >= 80) return "oklch(0.55 0.19 155)"
  if (value >= 60) return "oklch(0.65 0.17 115)"
  if (value >= 40) return "oklch(0.7 0.16 75)"
  return "oklch(0.55 0.22 25)"
}

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

function LoadingSkeleton() {
  return (
    <Card className="border-border bg-card h-full flex flex-col">
      <div className="flex items-center justify-between px-6">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
      </div>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
              <div className="h-4 w-10 animate-pulse rounded bg-muted" />
              <div className="h-2 w-20 animate-pulse rounded-full bg-muted" />
              <div className="flex gap-1">
                <div className="size-5 animate-pulse rounded-full bg-muted" />
                <div className="size-5 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="border-border bg-card h-full flex flex-col">
      <div className="flex items-center justify-between px-6">
        <h3 className="text-sm font-semibold text-foreground">Top Prompts</h3>
      </div>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">No prompt data available</p>
          <p className="text-xs text-muted-foreground">Start tracking prompts to see results here.</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="border-border bg-card border-destructive/40 h-full flex flex-col">
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <AlertCircle className="size-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-foreground">Failed to load prompts</p>
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

export function TopPromptsView({ state, data, brandNames, onRetry }: TopPromptsProps) {
  if (state === "loading") return <LoadingSkeleton />
  if (state === "empty") return <EmptyState />
  if (state === "error") return <ErrorState onRetry={onRetry} />

  return (
    <Card className="border-border bg-card h-full flex flex-col">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-foreground">Top Prompts</h3>
          <HelpTooltip title="Top Prompts">
            The most frequent prompts where your brand appears in AI model responses. Sentiment shows how positively your brand is described, visibility shows how often your brand appears for that prompt.
          </HelpTooltip>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 text-xs text-foreground hover:text-foreground" asChild>
          <Link href="/prompts">
            View All
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>
      <CardContent className="flex-1 flex flex-col">
        <Table className="flex-1">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Prompt
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <span className="inline-flex items-center gap-1">Visibility <HelpTooltip>The percentage of times your brand is mentioned when this prompt is asked across all tracked models.</HelpTooltip></span>
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <span className="inline-flex items-center gap-1">Sentiment <HelpTooltip>How positively the AI model describes your brand for this prompt. 0 = negative, 100 = very positive.</HelpTooltip></span>
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <span className="inline-flex items-center gap-1">
                  Brands
                  <HelpTooltip title="Brands">
                    Which tracked brands are mentioned by AI models in response to this prompt.
                  </HelpTooltip>
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.prompt} className="border-border">
                <TableCell className="max-w-[250px]">
                  <TruncatedText className="text-xs text-foreground">
                    {item.prompt}
                  </TruncatedText>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-semibold tabular-nums" style={{ color: getTemperatureColor(parseInt(item.visibility)) }}>
                    {item.visibility}
                  </span>
                </TableCell>
                <TableCell>
                  <SentimentBar value={item.sentiment} />
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <div className="flex gap-1">
                      {item.brands.map((b) => (
                        <Tooltip key={b}>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="size-5 items-center justify-center rounded-full border-border p-0 text-[10px] text-muted-foreground cursor-pointer"
                            >
                              {b}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover text-popover-foreground border-border">
                            <p className="text-xs">{brandNames[b]}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
