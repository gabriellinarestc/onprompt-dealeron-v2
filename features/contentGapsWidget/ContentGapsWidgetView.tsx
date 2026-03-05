"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, AlertCircle } from "lucide-react"
import { HelpTooltip } from "@/components/patterns/help-tooltip"
import type { ContentGapsWidgetProps } from "./types"

function LoadingSkeleton() {
  return (
    <Card className="border-border bg-card h-full">
      <div className="flex items-center justify-between px-6">
        <div className="h-4 w-36 animate-pulse rounded bg-muted" />
        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
      </div>
      <CardContent>
        <div className="mb-5 flex items-center gap-4 rounded-lg bg-secondary p-4">
          <div className="size-14 animate-pulse rounded-full bg-muted" />
          <div className="space-y-1.5">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="h-3 w-40 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="size-6 animate-pulse rounded-md bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
              </div>
              <div className="h-5 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="border-border bg-card h-full">
      <div className="flex items-center justify-between px-6">
        <h3 className="text-sm font-semibold text-foreground">Content Gaps Overview</h3>
      </div>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-sm font-medium text-muted-foreground">No content gaps detected</p>
          <p className="text-xs text-muted-foreground">Your content coverage looks great!</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="border-border bg-card border-destructive/20 h-full">
      <CardContent className="py-12">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-5 text-destructive" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Content gaps unavailable</p>
            <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
              We couldn&apos;t load the content gap data. This is usually temporary.
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
      </CardContent>
    </Card>
  )
}

export function ContentGapsWidgetView({ state, coveragePercent, recommendations, onRetry }: ContentGapsWidgetProps) {
  if (state === "loading") return <LoadingSkeleton />
  if (state === "empty") return <EmptyState />
  if (state === "error") return <ErrorState onRetry={onRetry} />

  const circumference = 2 * Math.PI * 22 // r=22

  return (
    <Card className="border-border bg-card h-full">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-foreground">Content Gaps Overview</h3>
          <HelpTooltip title="Content Gaps">
            Topics where users are asking AI models questions but your brand is not appearing in responses. Addressing these gaps can improve your visibility score.
          </HelpTooltip>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 text-xs text-foreground hover:text-foreground" asChild>
          <Link href="/content-gaps">
            View All
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>
      <CardContent>
        <div className="mb-5 flex items-center gap-4 rounded-lg bg-secondary p-4">
          <div className="relative size-14">
            <svg className="rotate-[-90deg]" width={56} height={56}>
              <circle
                cx={28} cy={28} r={22}
                strokeWidth={5} fill="none"
                className="stroke-muted"
              />
              <circle
                cx={28} cy={28} r={22}
                strokeWidth={5} fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (coveragePercent / 100) * circumference}
                strokeLinecap="round"
                className="stroke-destructive"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">{coveragePercent}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Content Coverage</p>
            <p className="text-xs text-muted-foreground">{coveragePercent}% of tracked topics covered</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Top Recommendations
          </p>
          <div className="flex flex-col gap-2">
            {recommendations.map((item) => (
              <div
                key={item.rank}
                className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3 transition-colors hover:bg-secondary"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                  {item.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 bg-primary/10 text-primary text-[10px]">
                  {item.prompts} prompts
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
