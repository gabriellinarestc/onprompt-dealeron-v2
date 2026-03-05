"use client"

import { useState, useEffect } from "react"
import { useModelFilter } from "@/components/dashboard/model-filter-context"
import { BrandSentimentView } from "./BrandSentimentView"
import { mockSentimentData, mockCurrentScore } from "./mocks"
import type { WidgetState } from "./types"

export function BrandSentimentShell({ initialState = "ready" }: { initialState?: WidgetState }) {
  const { comparePrior } = useModelFilter()
  const [state, setState] = useState<WidgetState>(initialState)

  useEffect(() => {
    setState(initialState)
  }, [initialState])

  return (
    <BrandSentimentView
      state={state}
      data={mockSentimentData}
      currentScore={mockCurrentScore}
      comparePrior={comparePrior}
      onRetry={() => setState("ready")}
    />
  )
}
