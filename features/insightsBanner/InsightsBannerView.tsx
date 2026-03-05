"use client"

import { X, TrendingUp, FileText, AlertCircle } from "lucide-react"
import type { InsightsBannerProps } from "./types"

export function InsightsBannerView({ state, onDismiss, onRetry }: InsightsBannerProps) {
  if (state === "empty") return null

  if (state === "loading") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-border">
        <div className="absolute inset-0 bg-card/60" />
        <div className="relative flex items-center gap-4 px-5 py-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="flex gap-8">
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-destructive/40">
        <div className="absolute inset-0 bg-card/60" />
        <div className="relative flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-foreground">Failed to load insights</p>
              <p className="text-xs text-muted-foreground">Something went wrong. Please try again.</p>
            </div>
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
    )
  }

  // ready
  return (
    <div className="relative overflow-hidden rounded-xl border border-border">
      {/* Background with mesh gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 10% 40%, oklch(0.65 0.18 55 / 0.15), transparent),
            radial-gradient(ellipse 60% 80% at 90% 20%, oklch(0.35 0.12 260 / 0.18), transparent),
            radial-gradient(ellipse 50% 50% at 50% 80%, oklch(0.70 0.15 60 / 0.10), transparent),
            radial-gradient(ellipse 90% 40% at 70% 50%, oklch(0.30 0.10 255 / 0.08), transparent)
          `,
        }}
      />
      {/* Subtle noise overlay */}
      <div className="absolute inset-0 bg-card/60" />

      <div className="relative flex items-center justify-between gap-4 px-5 py-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground mb-2">
            Understanding Your AI Visibility
          </p>
          <div className="flex gap-8">
            <div className="flex items-start gap-2 flex-1">
              <TrendingUp className="size-3.5 mt-0.5 shrink-0 text-success" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Visibility</span> measures how prominently your brand appears in AI-generated responses. It combines mention frequency, citation quality, and positioning to give you a comprehensive view of your AI visibility.
              </p>
            </div>
            <div className="flex items-start gap-2 flex-1">
              <FileText className="size-3.5 mt-0.5 shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Content Coverage</span> measures how well your website answers the questions that arise from your tracked prompts. We crawl and index your entire website so we can search it to identify content gaps.
              </p>
            </div>
          </div>
        </div>

        {/* Close */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="shrink-0 self-start rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Dismiss banner"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
