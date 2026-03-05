"use client"

import { useState, useEffect } from "react"
import { useModelFilter } from "@/components/dashboard/model-filter-context"
import { VisitorAnalyticsView } from "./VisitorAnalyticsView"
import { mockVisitorModels, mockCrawlerStats } from "./mocks"
import type { WidgetState } from "./types"

export function VisitorAnalyticsShell({ initialState = "ready" }: { initialState?: WidgetState }) {
  const { isModelActive, comparePrior } = useModelFilter()
  const [state, setState] = useState<WidgetState>(initialState)

  useEffect(() => {
    setState(initialState)
  }, [initialState])

  const filteredVisitorModels = mockVisitorModels.filter((item) => isModelActive(item.key))

  return (
    <VisitorAnalyticsView
      state={state}
      visitorModels={filteredVisitorModels}
      crawlerStats={mockCrawlerStats}
      comparePrior={comparePrior}
      onRetry={() => setState("ready")}
    />
  )
}
