"use client"

import { useState } from "react"
import { X, TrendingUp, FileText } from "lucide-react"

export function InsightsBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

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
                <span className="font-medium text-foreground">Visibility</span> measures how often AI models reference DealerOn when dealers and OEMs ask about website platforms, SEO, and digital advertising solutions.
              </p>
            </div>
            <div className="flex items-start gap-2 flex-1">
              <FileText className="size-3.5 mt-0.5 shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Content Coverage</span> tracks which automotive topics AI models associate with DealerOn and identifies gaps where competitors like Dealer Inspire or CDK Global are being recommended instead.
              </p>
            </div>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 self-start rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Dismiss banner"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
