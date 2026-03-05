"use client"

import { useState } from "react"
import { VisitorAnalyticsView } from "@/features/visitorAnalytics/VisitorAnalyticsView"
import { mockVisitorModels, mockCrawlerStats } from "@/features/visitorAnalytics/mocks"
import { Button } from "@/components/ui/button"
import type { WidgetState } from "@/features/visitorAnalytics/types"

const states: { label: string; value: WidgetState }[] = [
  { label: "Loading", value: "loading" },
  { label: "Empty", value: "empty" },
  { label: "Error", value: "error" },
  { label: "Ready", value: "ready" },
]

export default function VisitorAnalyticsDevPage() {
  const [activeState, setActiveState] = useState<WidgetState>("ready")

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dev Preview
            </p>
            <h1 className="text-sm font-bold text-foreground">Visitor Analytics</h1>
          </div>
          <div className="flex items-center gap-1">
            {states.map((s) => (
              <Button
                key={s.value}
                variant={activeState === s.value ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => setActiveState(s.value)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl p-6">
        <VisitorAnalyticsView
          state={activeState}
          visitorModels={mockVisitorModels}
          crawlerStats={mockCrawlerStats}
          comparePrior={true}
          onRetry={() => console.log("onRetry")}
        />
      </div>
    </div>
  )
}
