"use client"

import { useState, useEffect } from "react"
import { ContentGapsWidgetView } from "./ContentGapsWidgetView"
import { mockCoveragePercent, mockRecommendations } from "./mocks"
import type { WidgetState } from "./types"

export function ContentGapsWidgetShell({ initialState = "ready" }: { initialState?: WidgetState }) {
  const [state, setState] = useState<WidgetState>(initialState)

  useEffect(() => {
    setState(initialState)
  }, [initialState])

  return (
    <ContentGapsWidgetView
      state={state}
      coveragePercent={mockCoveragePercent}
      recommendations={mockRecommendations}
      onRetry={() => setState("ready")}
    />
  )
}
